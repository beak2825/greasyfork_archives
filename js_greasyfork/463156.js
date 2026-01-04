// ==UserScript==
// @name         WebFuture模板配置助手
// @homeurl      https://greasyfork.org/zh-CN/scripts/463156
// @homepageURL  https://greasyfork.org/zh-CN/scripts/463156
// @namespace    http://www.xueyidian.cn/
// @version      2.0.2
// @description  动易软件设计部内部使用的脚本
// @author       MacroDa
// @icon         https://www.powereasy.net/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        *://*/*

// @run-at document-idle

// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info

// @downloadURL https://update.greasyfork.org/scripts/463156/WebFuture%E6%A8%A1%E6%9D%BF%E9%85%8D%E7%BD%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463156/WebFuture%E6%A8%A1%E6%9D%BF%E9%85%8D%E7%BD%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isSA = false;
    var isTemplast = false;
    var isNodeTypeModify = false;
    var href = $("link").eq(1).attr("href");
    var pagePath = window.location.pathname;
    if (href) {
        var hrefAry = href.split("/");
        if ( hrefAry[1].toLowerCase()=="admin" && hrefAry[2].toLowerCase()=="content"){
            isSA = true;
        }
    }

    if (isSA && pagePath) {
        var pagePathAry = pagePath.split("/");
        if (pagePathAry[3].toLowerCase() == "node") {
            isTemplast = true;
        }
        var pathLast = pagePathAry[4].toLowerCase();
        if (pathLast == "nodetypemodify" || pathLast == "modify" || pathLast == "setnodeassociation") {
            isNodeTypeModify = true;
        }
    }

    if (isSA) {
        if (isTemplast) {
            if (isNodeTypeModify) {
                // 增加下一个节点按钮
                $(".widget-title h5").after('<div style="display: inline-block; width: 120px; vertical-align: middle;" id="goToPage"><div class="input-group input-group-sm"><input type="text" class="form-control"  style="margin-top: 5px;"><span class="input-group-btn"><button class="btn btn-default btn-xs" type="button">跳转</button></span></div></div>');
                var nodeId = getQueryString("NodeId") ? getQueryString("NodeId") : parseInt(pagePathAry[5]);
                $("#goToPage .form-control").val(nodeId);
                $("#goToPage .btn").click(function() {
                    var newNodeId = nodeId;
                    if (nodeId == $("#goToPage .form-control").val()) {
                        newNodeId = parseInt(nodeId) + 1;
                    } else {
                        newNodeId = $("#goToPage .form-control").val();
                    }
                    var pageHref = window.location.href.replace(nodeId, newNodeId);
                    window.location.href = pageHref;
                })
            }

            // 增加快速填写按钮
            // $("[name=IsBlank]").val('false');
            // $("[name=PhoneViewEnabled]").val('false');
            $(".widget-title h5").after('<button class="btn btn-default btn-xs" id="quickEntry" style="padding: 3px 5px;" title="一键填写以下内容：\n列表页模板：{SiteIdentifier}/ContentManage/Article/文章-列表页.cshtml\n内容页模板：{SiteIdentifier}/ContentManage/Article/文章-内容页.cshtml\n单页模板：{SiteIdentifier}/ContentManage/Other/通用-单页.cshtml\n在菜单新窗口打开：关闭\n是否启用手机端：启用">快速填写</button> ');            $("#quickEntry").click(function() {
                $("#ListViewPath").prop('disabled', false).val("{SiteIdentifier}/ContentManage/Article/文章-列表页.cshtml").parents(".batchset-single").addClass("active");
                $("#SingleViewPath").prop('disabled', false).val("{SiteIdentifier}/ContentManage/Other/通用-单页.cshtml").parents(".batchset-single").addClass("active");
                $("#ContentViewPath").prop('disabled', false).val("{SiteIdentifier}/ContentManage/Article/文章-内容页.cshtml").parents(".batchset-single").addClass("active");

                var IsBlank = $("#row-IsBlank").find(".batchset-single");
                if (!IsBlank.hasClass("active")) {
                    IsBlank.find(".batchset-single-select").trigger("click");
                }
                if ($("[name=IsBlank]").eq(2).prop("disabled")) {
                    $(".switchery[name=IsBlank]").trigger("click");
                }

                var PhoneViewEnabled = $("#row-PhoneViewEnabled").find(".batchset-single");
                if (!PhoneViewEnabled.hasClass("active")) {
                    PhoneViewEnabled.find(".batchset-single-select").trigger("click");
                }
                if (!$("[name=PhoneViewEnabled]").eq(2).prop("disabled")) {
                    $(".switchery[name=PhoneViewEnabled]").trigger("click");
                }

            })
        }

        // 增加移除文本框只读按钮
        if ($(".form-control[readonly]").length > 0) {
            $(".widget-title h5").after('<button class="btn btn-default btn-xs" id="removeReadonly"><input type="checkbox"> 移除文本框只读</button> ');
            removeReadonly();
            $("#removeReadonly").click(function() {
                if (GM_getValue("PE_removeReadonly")) {
                    GM_setValue("PE_removeReadonly", false);
                } else {
                    GM_setValue("PE_removeReadonly", true);
                }
                removeReadonly();
            })
            function removeReadonly() {
                var PE_removeReadonly = GM_getValue("PE_removeReadonly");
                $(".form-control").each(function (e, i) {
                    if (($(this).parent().attr("data-ui-type") && $(this).parent().attr("data-ui-type") == "viewpath") || ($(this).attr("data-ui-ime") && $(this).attr("data-ui-ime") == "inactive")) {
                        if (PE_removeReadonly) {
                            $(this).removeAttr("readonly");
                        } else {
                            $(this).attr("readonly", "readonly");
                        }
                    }
                })

                // 显示logo地址输入框
                $("#files-LogoUrl").parent().css("position", "relative");
                $("#files-LogoUrl").removeClass("hidden").css({"position": "absolute", "left": "110%", "top": "0px", "width": "30em"}).find("input").addClass("form-control").attr({"type": "text"});

                if (PE_removeReadonly) {
                    $("#removeReadonly").find("input[type=checkbox]").prop('checked', true);
                } else {
                    $("#removeReadonly").find("input[type=checkbox]").prop('checked', false);
                }
            }
        }

        // 增加批量节点设置全选按钮
        $(".batchset-select h3").append(' <a href="javascript:;" class="btn btn-default btn-xs" id="selectAll">全选</a> <a href="javascript:;" class="btn btn-default btn-xs" id="selectAllNot">全不选</a>');
        $("#selectAll").click(function() {
            setCheck(unsafeWindow.$.fn.zTree.getZTreeObj("batchSetTree").getNodes(), true);
        })
        $("#selectAllNot").click(function() {
            setCheck(unsafeWindow.$.fn.zTree.getZTreeObj("batchSetTree").getNodes(), false);
        })

        // 循环设置选中
        function setCheck(clickNode, flag) {
            $.each(clickNode, function (k, value) {
                var zTree = unsafeWindow.$.fn.zTree.getZTreeObj("batchSetTree");
                zTree.checkNode(value, flag, true);
                if (value.isParent) {
                    if (flag) {
                        zTree.expandNode(value, true, false);
                        setTimeout(function () {
                            setCheck(value.Children, flag);
                        }, 800);
                    } else {
                        setCheck(value.Children, flag);
                    }
                }
            });
        }

    }

    // 获取url参数
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

})();