// ==UserScript==
// @name         Jira增强助手(JiraAssistant)
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  你是不是还在为Jira的版本检索闹心呢？Jira增强助手——一款增强“新建需求、新建缺陷、新建文档问题、新建风险与问题、新建任务、新建故事、修复缺陷、重新分配，创建子任务、解决子任务”等十几项搜索功能的脚本。并且可以自动识别填充“修复缺陷时”当前经办人和版本号。自动识别并填充“重新分配”场景的当前版本号。从此让产品同学爱上提需求，测试同学爱上提bug，开发同学爱上解bug。脚本长期维护更新！另外如果有脚本定制需求也可以提！如果脚本存在bug请反馈。
// @author       CCoder
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @match        *://jira.komect.net/*
// @icon         http://jira.komect.net/s/zc39sm/813004/6411e0087192541a09d88223fb51a6a0/_/images/fav-jsw.png
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/450762/Jira%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B%28JiraAssistant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450762/Jira%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B%28JiraAssistant%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // *************************************************************更新日志*************************************************************
    // V2.5 (2022年9月6日12:33:10)：
    // 新增 “基线化排产版本” 增强搜索
    // V2.6 (2022年11月8日12:46:54)：
    // 新增批量 “基线化排产版本” 增强搜索
    // V2.7 (2023年9月4日13:28:41)：
    // 优化搜索样式，增加选中效果
    // *************************************************************更新日志*************************************************************

    // 修改缺陷页面-版本（缓存）
    var $fixBugVersion = ''
    // 修改缺陷页面-经办人（缓存）
    var $fixBugAssignee = ''

    var currentPage = window.location.href
    console.log("**************************" + currentPage)

    if (currentPage.indexOf('/browse/') != - 1) {
        // Bug页面
        $fixBugVersion = $("#versions-val").text().trim()
        $fixBugAssignee = $("#assignee-val").text().trim()

        // console.log($fixBugAssignee + "......." + $fixBugVersion)
    }

    var $versionList = [];

    const originOpen = XMLHttpRequest.prototype.open;
    // 拦截新建窗口请求
    XMLHttpRequest.prototype.open = function (_, url) {
        // console.log("***********************" + url)
        if (url.indexOf("QuickCreateIssue!default.jspa") != -1) {
            // 新建问题窗口打开
            // 初始化数据
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const res = JSON.parse(this.responseText);
                    openCreateIssueDialog(res)
                }
            });
        } else if (url.indexOf("WorkflowUIDispatcher.jspa") != -1) {
            // 修改缺陷窗口打开
            // 初始化数据
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    // const res = JSON.parse(this.responseText);
                    // this.responseText = JSON.stringify(res);
                    setTimeout(() => {
                        openFixBugsOrProduceDialog(this.responseText)
                        // console.log($fixBugAssignee + "......." + $fixBugVersion)
                    }, 500)
                }
            });
        } else if (url.indexOf("AjaxIssueAction!default.jspa") != -1) {
            // 非弹出窗口式打开“修改缺陷”页面（从issue链接进入）
            // 此时也需要缓存数据
            setTimeout(() => {
                $fixBugVersion = $("#versions-val").text().trim()
                $fixBugAssignee = $("#assignee-val").text().trim()

                // console.log($fixBugAssignee + "......." + $fixBugVersion)
            }, 500)
        }
        originOpen.apply(this, arguments);
    };

    // ***********************************************以下为“修改缺陷”页面相关逻辑  START**************************************************
    const onMouseDownForFixBugsDialogScript = `<script type="text/javascript">
    // 选择其中的提示内容
    function onMouseDownForFixBugsDialog(object) {
        $("#fixVersions-textarea").focus()
        $("#fixVersions-textarea").val($(object).text());
        $("#assignee-field").focus()
        $("#fixVersions-textarea").focus()
        $("#cmcc-fix-search").fadeOut();
    }
    </script>`

    /**
     * 当“修改缺陷”对话框或者是“基线化排产”对话框打开时
     * @param {*} res 
     * @returns 
     */
    function openFixBugsOrProduceDialog(res) {
        console.log('*****************************************************************')
        console.log(res)
        // console.log($(res).find("#fixVersions > optgroup > option"))
        $versionList = []
        // 修复缺陷添加数据
        if (hasProperty("#fixVersions")) {
            $(res).find("#fixVersions > optgroup > option").each(function (index) {
                let version = $(this).text().trim()
                // console.log(version)
                if (version != undefined) {
                    $versionList.push(version)
                }
            })
            // console.log($versionList.length)
            injectFixBugsDialog()
        }

        // 基线化排产添加数据
        if (hasProperty("#customfield_10605")) {
            $(res).find("#customfield_10605 > optgroup > option").each(function (index) {
                let version = $(this).text().trim()
                // console.log(version)
                if (version != undefined) {
                    $versionList.push(version)
                }
            })

            // 有可能是基线化排产对话框打开了
            injectCreateDialog()
        }

        // console.log('*****************************************************************')
    }

    /**
     * 向创建问题Dialog注入功能
     */
    function injectFixBugsDialog() {
        // console.log(GM_getValue(SETTING_REMOVE_SEARCH))
        // if (GM_getValue(SETTING_REMOVE_SEARCH)) {
        //     setInterval(function () {
        //         $("#fixVersions-suggestions").remove()
        //         console.log(".....")
        //     }, 100)
        // }

        // 设置缓存数据

        // 版本号
        $("#fixVersions-textarea").focus()
        $("#fixVersions-textarea").val($fixBugVersion)

        // 解决人
        $("#customfield_10603").val($fixBugAssignee)

        // 经办人获取焦点
        $("#assignee-field").focus()

        // 监听版本输入框
        $("#fixVersions-textarea").bind("input propertychange", function (event) {
            let value = $("#fixVersions-textarea").val()
            // console.log(value)
            // 过滤
            if (!hasProperty("#cmcc-fix-search")) {
                $("#fixVersions-textarea").parent().after('<div><div style="margin-top:5px; width: 500px; height: 100px; overflow: scroll;cursor:default;" id="cmcc-fix-search"></div></div>')
            }
            $("#cmcc-fix-search").css("display", "");
            $("#cmcc-fix-search").html("")
            // if (value.trim().length != 0) {
            $("#cmcc-fix-search").append(onMouseDownForFixBugsDialogScript)
            for (const index in $versionList) {
                let element = $versionList[index]
                if (element.toString().toLowerCase().indexOf(value.trim().toLowerCase()) != -1) {
                    $("#cmcc-fix-search").append('<div class="item" style="cursor:default;" onclick="onMouseDownForFixBugsDialog(this)">' + element + '</div>');
                }
            }

            if (GM_getValue(SETTING_REMOVE_SEARCH)) {
                $("#fixVersions-suggestions").remove()
            }
        });
    }

    // *******************************************以上为“修改缺陷”页面相关逻辑  END********************************************************



    // *******************************************以下为“新建”页面相关逻辑  START**********************************************************

    const onMouseDownForCreateDialogScript = `<script type="text/javascript">
    // 选择其中的提示内容
    function onMouseDownForCreateDialog(object) {
        $("#versions-textarea").focus();
        $("#versions-textarea").val($(object).text());
        $("#summary").focus();
        $("#versions-textarea").focus();
        $("#cmcc-search").fadeOut();
    }
    </script>`

    const recSearchHtml = `<div style="margin-left:145px; ">
    <div style="font-weight: 600">排产版本搜索：<input type="text" id="cmcc-rec-textarea" class="text" /></div>
    <div style="margin-top:5px; max-width: 500px; width: 500px; height: 150px; overflow: scroll;" class="select" id="cmcc-rec-search";cursor:default;></div>
</div>`


    const onMouseDownForCreateRecommendDialogScript = `<script type="text/javascript">
        // 选择其中的提示内容
        function onMouseDownForCreateRecommendDialog(object) {
            var text = $(object).text()
            // 清除选中
            try {
                $('#cmcc-rec-search').children().each(function(index, element) { 
                    $(element).css("background-color", "");
                    $(element).css("color", "");
                })
                $(object).css("background-color", "#0052CC");
                $(object).css("color", "white");
            } catch(e) {

            }
            $("#customfield_10605").find('option[title="' + text +'"]').attr("selected", true);
        }
    </script>`

    /**
     * 当“新建”对话框打开时，解析版本数据
     * @param {*} res 
     * @returns 
     */
    function openCreateIssueDialog(res) {
        // console.log('*****************************************************************')
        // console.log(res)

        let versionHtml = ""
        if (res.fields.length != 0) {
            for (const key in res.fields) {
                if (res.fields[key].id == 'versions' || res.fields[key].id == 'customfield_10605') {
                    versionHtml = res.fields[key].editHtml
                    break
                }
            }
        }

        if (versionHtml.trim() === '') {
            return
        }

        $versionList = []
        $(versionHtml).find("option").each(function (index) {
            let version = $(this).text().trim()
            // console.log($(this).text().trim())
            if (version != undefined) {
                $versionList.push(version)
            }
        })
        // console.log($versionList.length)
        setTimeout(function () {
            injectCreateDialog()
        }, 500)
        // console.log('*****************************************************************')
    }

    /**
     * 向创建问题Dialog注入功能
     */
    function injectCreateDialog() {
        // console.log(".......[run injectCreateDialog]..........")
        // console.log(GM_getValue(SETTING_REMOVE_SEARCH))
        // if (GM_getValue(SETTING_REMOVE_SEARCH)) {
        //     setInterval(function () {
        //         $("#versions-suggestions").remove()
        //         console.log(".....")
        //     }, 100)
        // }

        if (hasProperty('#customfield_10605') && !hasProperty('#cmcc-rec-textarea')) {
            // 当前是创建需求页面
            // $(".description").last().after(recSearchHtml + onMouseDownForCreateRecommendDialogScript)
            $("#customfield_10605").parent().after(recSearchHtml + onMouseDownForCreateRecommendDialogScript)

            $("#cmcc-rec-textarea").bind("input propertychange", function (event) {
                let value = $("#cmcc-rec-textarea").val()
                // 过滤
                // if (!hasProperty("#cmcc-search")) {
                //     // $("label[for='versions-textarea']").before('<div style="width: 100px; height: 100px; overflow: scroll" id="cmcc-search"><div>')
                //     $(".description").after('<div style="margin-top:5px; width: 500px; height: 100px; overflow: scroll" id="cmcc-search"></div>')
                // }
                // $("#cmcc-search").css("display", "");
                $("#cmcc-rec-search").html("")
                if (value.trim().length != 0) {
                    // $("#cmcc-search").append(onMouseDownForCreateDialogScript)
                    for (const index in $versionList) {
                        let element = $versionList[index]
                        if (element.toString().toLowerCase().indexOf(value.trim().toLowerCase()) != -1) {
                            $("#cmcc-rec-search").append('<div class="item" style="cursor:default;" style="" onclick="onMouseDownForCreateRecommendDialog(this)">' + element + '</div>');
                        }
                    }
                }
            });
        } else {
            // 其它页面
            // 监听版本输入框
            $("#versions-textarea").bind("input propertychange", function (event) {
                let value = $("#versions-textarea").val()
                // console.log(value)
                // 过滤
                if (!hasProperty("#cmcc-search")) {
                    // $("label[for='versions-textarea']").before('<div style="width: 100px; height: 100px; overflow: scroll" id="cmcc-search"><div>')
                    $("#versions-multi-select").parent().after('<div style="margin-top:5px; margin-left:145px; max-width: 500px; width: 500px; height: 100px; overflow: scroll; cursor:default;" class="select" id="cmcc-search"></div>')
                }
                $("#cmcc-search").css("display", "");
                $("#cmcc-search").html("")
                // if (value.trim().length != 0) {
                $("#cmcc-search").append(onMouseDownForCreateDialogScript)
                for (const index in $versionList) {
                    let element = $versionList[index]
                    if (element.toString().toLowerCase().indexOf(value.trim().toLowerCase()) != -1) {
                        $("#cmcc-search").append('<div class="item" style="cursor:default;"  onclick="onMouseDownForCreateDialog(this)">' + element + '</div>');
                    }
                }

                if (GM_getValue(SETTING_REMOVE_SEARCH)) {
                    $("#versions-suggestions").remove()
                }
            });

        }

    }

    // ********************************************************以下功能注入非 非弹窗而是新页面****************************************************************************8

    // ***********************************************以下为“批量转移问题”页面相关逻辑  START**************************************************
    // 1. 批量转移-基线化排产版本搜索
    const transferSearchHtml = `
         <div style="margin-left:0px; ">
             <div>排产版本搜索：<input type="text" id="cmcc-trans-rec-textarea" class="text" /></div>
             <div style="margin-top:5px; max-width: 500px; width: 500px; height: 150px; overflow: scroll" class="select" id="cmcc-trans-rec-search"
                 ;cursor:default;></div>
         </div>`

    const onMouseDownForTransferVersionScript = `<script type="text/javascript">
        // 选择其中的提示内容
        function onMouseDownForTransferVersion(object) {
            var text = $(object).text()
            try {
                // 清除选中
                $('#cmcc-trans-rec-search').children().each(function(index, element) { 
                    $(element).css("background-color", "");
                    $(element).css("color", "");
                })
                $(object).css("background-color", "#0052CC");
                $(object).css("color", "white");
            } catch(e) {

            }
            $("#customfield_10605").find('option[title="' + text +'"]').attr("selected", true);
        }
    </script>`

    if (currentPage.indexOf("BulkWorkflowTransitionDetailsValidation.jspa") != -1) {
        // 批量问题转换页面添加排产版本搜索
        if (hasProperty("#customfield_10605")) {
            $versionList = [];

            $("#customfield_10605").after(transferSearchHtml + onMouseDownForTransferVersionScript);

            $("#customfield_10605 > optgroup > option").each(function (index) {
                let version = $(this).text().trim()
                // console.log(version)
                if (version != undefined) {
                    $versionList.push(version);
                }
            })

            // 绑定监听
            $("#cmcc-trans-rec-textarea").bind("input propertychange", function (event) {
                let value = $("#cmcc-trans-rec-textarea").val()
                // 过滤
                $("#cmcc-trans-rec-search").html("")
                if (value.trim().length != 0) {
                    // $("#cmcc-search").append(onMouseDownForCreateDialogScript)
                    for (const index in $versionList) {
                        let element = $versionList[index]
                        if (element.toString().toLowerCase().indexOf(value.trim().toLowerCase()) != -1) {
                            $("#cmcc-trans-rec-search").append('<div class="item" style="cursor:default;" style="" onclick="onMouseDownForTransferVersion(this)">' + element + '</div>');
                        }
                    }
                }
            });
        }
    }

    // ***********************************************以下为“批量转移问题”页面相关逻辑  END**************************************************



    /**
     * 是否存在某个属性
     * @param {*} property 
     */
    function hasProperty(property) {
        return $(property).length > 0;
    }

    /*************************************设置相关 START*************************************************** */
    const SETTING_REMOVE_SEARCH = "setting_remove_search"

    GM_registerMenuCommand("移除自带提示框", removeSearch, "")
    GM_registerMenuCommand("恢复自带提示框", restoreSearch, "")

    function restoreSearch() {
        GM_setValue(SETTING_REMOVE_SEARCH, false)
    }

    function removeSearch() {
        GM_setValue(SETTING_REMOVE_SEARCH, true)
    }

    /*************************************设置相关 END*************************************************** */
})();


