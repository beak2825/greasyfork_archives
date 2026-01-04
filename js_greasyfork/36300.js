// ==UserScript==
// @name         rap
// @namespace    undefined
// @version      1.1
// @description  Rap
// @author       huangcf
// @match        *://192.168.74.164/workspace/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36300/rap.user.js
// @updateURL https://update.greasyfork.org/scripts/36300/rap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var platforms = ["pc", "h5", "android", "ios"];

    var p = rap.project;

    function deepCopy(o) {
        return jQuery.extend(true, {}, o);
    }

    p.addAction = function(obj, addExisted, isCopy) {
        obj = deepCopy(obj);
        var page = this.getPage(obj.pageId);
        if (isCopy) {
            //判断是否存在同名接口，存在才加-副本
            var isExist = false;
            if(page.actionList) {
                for(var i = 0; i < page.actionList.length; i++) {
                    if(page.actionList[i].name == obj.name) {
                        isExist = true;
                        return false;
                    }
                }
            }
            if(isExist) {
                obj.name += '-副本';
            }
        }
        //修改路径
        if(platforms.indexOf(page.name.toLowerCase()) > -1) {
            var reg = new RegExp("/(" + platforms.join(")|(") + ")/");
            obj.requestUrl = obj.requestUrl.replace(reg, page.name.toLowerCase());
        }
        var oldId = obj.id;
        obj.id = this.generateId();
        if (!addExisted || addExisted === 'mount') {
            obj.requestParameterList = [];
            obj.responseParameterList = [];
            /**
            if (addExisted === 'mount') {
                obj.requestType = '99';
                obj.responseTemplate = '{{mountId}}' + oldId;
            }
            */
        } else {
            // recursively update identifier
            var i;
            for (i = 0; i < obj.requestParameterList.length; i++) {
                recurUpdateParamId(obj.requestParameterList[i]);
            }
            for (i = 0; i < obj.responseParameterList.length; i++) {
                recurUpdateParamId(obj.responseParameterList[i]);
            }
        }
        this.getPage(obj.pageId).actionList.push(obj);

        function recurUpdateParamId(param) {
            param.id = p.generateId();
            if (param.parameterList) {
                for (var i = 0; i < param.parameterList.length; i++) {
                    recurUpdateParamId(param.parameterList[i]);
                }
            }
        }


        return obj.id;
    };

    // 重写workspace方法
    var checkEditTimer;
    function runCheckEditTimer() {
        window.clearInterval(checkEditTimer);
        checkEditTimer = window.setInterval(function(){
            if($("#btnSave").is(":hidden")) {
                return;
            }
            $("[id^=div-a-tree-node]:not(:has(input[type=checkbox])),[id^=div-tree]>div.ec-tree-items>div.ec-tree:not(:has(input[type=checkbox]))").prepend('<input type="checkbox"/>');
        }, 100);
    }

    //编辑
    var _switchToEditMode = ws.switchToEditMode;
    ws.switchToEditMode = function() {
        _switchToEditMode.apply(this);
        runCheckEditTimer();
    };

    //保存、取消编辑
    var _switchToViewMode = ws.switchToViewMode;
    ws.switchToViewMode = function(isSave) {
        window.clearInterval(checkEditTimer);
        _switchToViewMode.call(this, isSave);
    };

    //移动、复制
    var _closeActionOpFloater = ws.closeActionOpFloater;
    ws.closeActionOpFloater = function(userConfirm) {
        var _this = this;
        if(userConfirm) {
            var $checbox = $("[id^=div-a-tree-node]:visible input[type=checkbox]:checked");
            if($checbox.length > 0) {
                $checbox.each(function() {
                    var actionId = $(this).parent().attr("id").replace("div-a-tree-node-", "");
                    var modelId = p.getModuleIdByActionId(actionId);
                    ws.switchM(modelId);
                    ws.switchA(actionId);
                    _closeActionOpFloater.call(_this, userConfirm);
                });
            } else {
                _closeActionOpFloater.call(this, userConfirm);
            }
        } else {
            _closeActionOpFloater.call(this, userConfirm);
        }
    };

    // 添加模块，自动创建各段分页
    var _addM = ws.addM;
    ws.addM = function() {
        _addM.call(this);
        $.each(platforms, function(i, platform) {
            baidu.g("editPFloater-name").value = platform;
            ws.doAddP();
        });
    };

    $(function() {
        //判断是否加载草稿
        var checkEditOnLoad = function() {
            if($("#div-w").length == 0) {
                window.setTimeout(function() {
                    checkEditOnLoad();
                }, 100);
                return;
            }
            window.setTimeout(function() {
                if($("#btnSave").is(":visible")) {
                    runCheckEditTimer();
                }
            }, 100);

        };
        checkEditOnLoad();

        //全选功能
        $("body").on("click", "[id^=div-tree]>div.ec-tree-items>div.ec-tree>input[type=checkbox]", function() {
            $(this).parent().next().find("div.ec-tree>input[type=checkbox]").prop("checked", $(this).prop("checked"));
        });
    });

    console.log("Tampermonkey Rap Loaded");

})();