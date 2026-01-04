// ==UserScript==
// @name         ras系统开发工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ras开发工具
// @author       You
// @match        http://localhost*
// @match        http://localhost*/*
// @match        */ra-webapp*
// @grant        null
// @downloadURL https://update.greasyfork.org/scripts/432321/ras%E7%B3%BB%E7%BB%9F%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432321/ras%E7%B3%BB%E7%BB%9F%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!SYS_FRONT_JS_CONFIG) return;
    if (fObject("LOGIN_ID").length > 0) {
        if (checkNecessaryStr(localStorage.loginUsers) && localStorage.loginUsers.length > 5) {
            fObject("login_button").after($.vDom.wrapper("mg-t-10", $.map(evalV(localStorage.loginUsers), function (user) {
                return $.vDom.button({name: "以" + nvl(user.desc, user.userId) + "登录", btnStyle: randomArray(choose_randomColor), btnClass: "btn-sm mg-r-10"}).click(function () {
                    fObject("LOGIN_ID").val(user.userId);
                    fObject("PASSWORD").val(user.password);
                    if (SYS_FRONT_JS_CONFIG.IF_NEED_IDENTIFYING_CODE !== "1") {
                        fObject("login_button").click();

                    }

                });
            })));
        }
    } else {
        $("#content_container .index-tab-nav").on("contextmenu",">li",function(event){
            var data =$(this).data("linkInfo");
            if(!data) return;
            var entity = {
                name:data.entity.name,url:data.entity.url
            };
            var devPage = localStorage.devPage;
            devPage = checkNecessaryStr(devPage)?evalV(devPage):[];
            var prevIndex = null;
            $.each(devPage,function(idx,ele){
                if(ele.url===entity.url){
                    prevIndex = idx;
                    return false;
                }
            });

            $.vMouseMenu.mouseMenu({
                menuList: [
                    prevIndex!==null?{
                        name:"不再初始打开",
                        clickEvent:function(){
                            devPage.splice(prevIndex,1);
                            localStorage.devPage = displayObj(devPage);
                        }
                    }:{
                        name: "初始打开",
                        clickEvent: function () {
                            saveIndex(entity);
                        }
                    },
                    {
                        name: "初始打开（清空其他）",
                        clickEvent: function (event) {
                            saveIndex(entity,true);
                        }
                    },
                    {
                        name: "复制打开脚本",
                        clickEvent: function (event) {
                            var d = $.vDom.textarea({noWrapper:true,noLabel:true}).css({position:"absolute",top:-999999});
                            $("body").append(d);
                            d.VE.val("$(\"body\").triggerHandler(\"index_openMenu\",\""+entity.url+"\");");
                            d.VE.select();
                            document.execCommand('Copy', false, null);
                            d.remove();
                        }
                    }
                ]
            }, event);
        });

        var components = [
            {
                name: "快速登录登记", icon: "user-secret", clickEvent: function () {
                    var users = localStorage.loginUsers, $userContainer = $("<div class='mg-t-20'>"), createUser = function (user) {
                        $userContainer.append($.vDom.any("span", "label mg-r-5 mg-b-5 label-" + randomArray(choose_randomColor), "用户名：" + checkNecessaryStr(user.desc) ? (user.desc + "-" + user.userId) : user.userId).on("dblclick", function () {
                            $(this).remove();
                        }).data("user", user).attr("title", "密码:" + user.password));
                    }, $userId = $.vDom.input({name: "用户名"}), $desc = $.vDom.input({name: "备注名称"}), $addBtn = $.vDom.button({name: "添加登录信息", icon: "plus", btnStyle: "success", btnClass: "btn-sm"})
                    , $loginAsUser = $.vDom.button({name: "以该用户身份登陆", icon: "user-secret", btnStyle: "info", btnClass: "btn-sm mg-l-20"});
                    $addBtn.click(function () {
                        var loginId = $userId.vTrueElement.val();
                        commonAjax("getUserPassword.do", {LOGIN_ID: loginId}, function (msg) {
                            createUser({userId: loginId, password: msg, desc: $desc.vTrueElement.val()});
                        });
                    });
                    $loginAsUser.click(function(){
                        var loginId = $userId.vTrueElement.val();
                        commonAjax("assignAsLogin.do", {LOGIN_ID: loginId}, function (msg) {
                            alertMsg_B("登陆成功，请继续操作");
                            $.vSelection.cleanDictionary();
                            $.vModal.hide();
                        });
                    });
                    checkNecessaryStr(localStorage.loginUsers) && $.map(evalV(localStorage.loginUsers), function (user) {
                        createUser(user);
                    });
                    $.vModal.show({
                        title: "快速登录信息登记",
                        modalContent: $.vDom.wrapper("", [$userId, $desc, $addBtn,$loginAsUser, $userContainer]),
                        confirmFunc: function () {
                            localStorage.loginUsers = displayObj($.map($userContainer.children().toArray(), function ($this) {
                                return $($this).data("user");
                            }));
                            alertMsg_B("成功，更改后的信息登录可见");
                            $.vModal.hide();
                        }
                    });
                }
            },
            {
                name: "清理缓存", icon: "trash", clickEvent: function (event, $dom) {
                    commonAjax_fresh("clearCache.do",{},function(msg){
                        alertMsgByResponse(msg);
                    });
                }
            }, {
                name: GLOBAL_IS_DEBUG ? "关闭debug" : "开启debug", icon: GLOBAL_IS_DEBUG ? "toggle-off color-gray" : "toggle-on color-g", clickEvent: function (event, $dom) {
                    GLOBAL_IS_DEBUG = !GLOBAL_IS_DEBUG;
                    addLocalStorage("isDebug", GLOBAL_IS_DEBUG ? "1" : "0");
                    $dom.html($.vDom.any("a", {href: "#"}, "<i class='fa fa-" + (GLOBAL_IS_DEBUG ? "toggle-off color-gray" : "toggle-on color-g") + " wd-fact-20'></i>" + (GLOBAL_IS_DEBUG ? "关闭debug" : "开启debug")));
                }
            }, {
                name: "开发页面直达", icon: "link", clickEvent: function () {
                    var avaliableList = localStorage.developList;
                    if (!checkNecessaryStr(avaliableList)) {
                        alertMsg_B("需要配置本地脚本，添加locatStorage方可使用");
                        return;
                    }

                    avaliableList = evalV(avaliableList);
                    $.vModal.show({
                        title: "直达", width: "80%", footer: false,
                        modalContent: $.vDom.any("ul", "list-group list-group-sm", $.map(avaliableList, function (item) {
                            return item.url ? $.vDom.any("li", "list-group-item cursor-p", ["<i class='fa fa-link mg-r-5'></i>" + item.title, $.vDom.button({
                                name: "设置开发页",
                                icon: "plus",
                                btnStyle: "success",
                                btnClass: "btn-xs pull-right"
                            }).click(function (event) {
                                event.stopPropagation();
                                saveIndex(item.url);
                            })]).click(function () {
                                $("body").triggerHandler("index_openMenu", [item.url,null,item.title]);
                                $.vModal.hide();
                            }) : $.vDom.any("li", "list-group-item active ", item.title);
                        }))
                    });

                }

            }
        ], $ul = $.vDom.any("ul", "dropdown-menu dropdown-menu-right animated animated-normal  fadeInUp", $.map(components, function (item) {
            return $.vDom.any("li", "dropdown", $.vDom.any("a", {href: "#"}, "<i class='fa fa-" + item.icon + " wd-fact-20'></i>" + item.name)).click(function (event) {
                event.preventDefault();
                item.clickEvent(event, $(this));
            });
        }));
        $(".header-right-tool").append($.vDom.wrapper("dropdown inline-b", [$.vDom.wrapper("dropdown-toggle header-inline text-danger", "<i class='fa fa-linux fa-lg mg-r-5'></i>deveplop").attr("data-toggle", "dropdown"), $ul]));

        if (checkNecessaryStr(localStorage.devPage)&&!$("body").is(".is-outer-link")) {
            var devPage = localStorage.devPage;
            if (checkNecessaryStr(devPage)) {
                try {
                    devPage = evalV(devPage);
                } catch (e) {
                    devPage = [];
                }
            } else {
                devPage = [];
            }
            setTimeout(function(){
                devPage.length > 0  && $.map(devPage.reverse(),function(entity){
                    $("body").triggerHandler("index_openMenu", [entity.url,null,entity.name])
                });
            },1000);
        }

    }

    function saveIndex(url,override) {
        var devPage = localStorage.devPage;
        if(override){
            devPage = [];
        }else{
            if (checkNecessaryStr(devPage)) {
                try {
                    devPage = evalV(devPage);
                } catch (e) {
                    devPage = [];
                }
            } else {
                devPage = [];
            }
        }
        devPage.push(url);
        localStorage.devPage = displayObj(devPage);
        alertMsg_B("变更成功,刷新后生效~");
    }

})();