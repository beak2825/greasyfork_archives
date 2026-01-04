// ==UserScript==
// @name         AkuvoxGitlabAutoCompleteTemplate
// @namespace    http://www.akuvox.com/
// @version      1.1
// @description  try to take over the world!
// @author       phoenixylf
// @match        http://192.168.13.20/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/407025/AkuvoxGitlabAutoCompleteTemplate.user.js
// @updateURL https://update.greasyfork.org/scripts/407025/AkuvoxGitlabAutoCompleteTemplate.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Your code here...

    //1、PR提交 模板
    function autoCompletePRTemplate() {

        var prStr = "## 修改原因描述\n" +
            "**[需求设计]:**\n" +
            "\n" +
            "请在这里写需求设计, 可直接贴wiki地址(如果有), 简单的也可以直接描述\n" +
            "\n" +
            "**[问题修复描述]:** \n" +
            "\n" +
            "请在这里写问题分析, 可直接贴wiki地址(如果有), 简单的也可以直接描述\n" +
            "\n" +
            "## 自测范围描述\n" +
            "请在这里简要描述自己的自测流程\n" +
            "\n";
        var elementMergeRequestDescription = document.getElementById("merge_request_description")
        var pageTitleList = document.getElementsByClassName("page-title")
        if (pageTitleList !== null && pageTitleList.length > 0) {
            var pageTitle = pageTitleList[0]
            if (pageTitle !== null && pageTitle.innerText == "New Merge Request") {
                if (elementMergeRequestDescription !== null) {
                    elementMergeRequestDescription.value = prStr;
                    elementMergeRequestDescription.style = "overflow: hidden; overflow-wrap: break-word; resize: none; height: 305px;"
                }
            } else {
                // alert("null merge request")
            }

            //针对title的要求
            var mergeRequestTitle = document.getElementById("merge_request_title")
            var subCommitBtnList = document.getElementsByClassName("btn btn-success qa-issuable-create-button")

            if (subCommitBtnList !== null && subCommitBtnList.length > 0) {
                var subCommitBtn = subCommitBtnList[0]
                if (subCommitBtn !== null) {
                    subCommitBtn.disabled = true
                }

                var patt = /^([SB]-[\d]+-)?[MOACRI][\W]?[:： ]/
                if (mergeRequestTitle !== null) {
                    mergeRequestTitle.addEventListener("change", function () {
                        if (!patt.test(mergeRequestTitle.value)) {
                            alert("Title非法请修改，否则无法提交")
                        } else {
                            if (subCommitBtn !== null) {
                                subCommitBtn.disabled = true
                            }
                        }
                    });

                    if (mergeRequestTitle.value == "Master") {
                        mergeRequestTitle.value = ""
                        mergeRequestTitle.placeholder = "Title格式为：S-xx-M:xxx 或者 B-xx-M:xxx，请根据具体提交填写"
                    } else if (!patt.test(mergeRequestTitle.value)) {
                        alert("Title非法请修改，否则无法提交")
                    } else {
                        if (subCommitBtn !== null) {
                            subCommitBtn.disabled = false
                        }
                    }

                }
            }
        }
    }

    //2、普通需求或bug commit 模板
    function autoCompleteBugOrStoryCommitTemplate() {
        var commitStr = "# 标题, 最简洁的描述具体提交的原因, 每次提交只允许写一个,\n" +
            "# M: 修复了啥\n" +
            "# O: 优化了啥\n" +
            "# A: 新增了啥\n" +
            "# C: 定制了啥\n" +
            "# R: 回退了啥\n" +
            "# 如S-XXX-A, B-XXX-M\n" +
            "# 请控制在一行以内, 即不允许多个需求/bug一起提交\n" +
            "\n" +
            "# 提交的备注, 描述原因, 修改文件等, 如有多个, 请用1. 2.序号标出\n" +
            "Modified:\n" +
            "\n"

        function getCommitId() {
            var elements = document.getElementsByName("commit_message"), item;
            for (var i = 0, len = elements.length; i < len; i++) {
                item = elements[i];
                if (item.id && item.id.indexOf("commit_message-") === 0) {
                    // item.id starts with commit_message-
                    //alert(item.id)
                    return item.id;
                }
            }
        }

        var commitId = getCommitId();
        var element_commit = document.getElementById(commitId)
        if (element_commit !== null) {
            element_commit.value = commitStr;
            element_commit.rows = 12;
        } else {
            //alert("commit is null");
        }

    }

    //3、展开PR合并请求中的（相当于点击按钮展开）
    function autoExpandAndCompletePRTemplate() {
        var timer = null;

        function checkRightIsExist() {
            var prCommitExpandButton = document.getElementsByClassName("commit-edit-toggle")[0];
            var isRight = document.getElementsByClassName("s16 ic-chevron-right").length;
            //alert("====="+isRight+"==prCommitExpandButton="+prCommitExpandButton)
            if (isRight == 1 && prCommitExpandButton !== null) {
                prCommitExpandButton.click()
                //展开后，进行模板填充
                autoCompletePRCommitTemplate()
                //关闭定时器
                if (timer !== null) {
                    clearInterval(timer);
                    timer = null;
                }
            }
        }

        //如果第一次进来，相关图标未加载，则开启定时器进行轮询，直到加载完成为止
        timer = setInterval(checkRightIsExist, 100);
    }

    /**
     * 备注：
     * 该模板填充遇到一个问题，gitlab会检测输入框中的内容是否被浏览器外部人为修改。
     * 如果没有被修改，则会定时更新输入框中的内容；
     * 而通过脚本修改输入框的内容，gitlab还会定时更新输入框的内容，所以会有现象，
     * 即输入框的内容改完之后又变回来
     *
     * 无法找到gitlab js中相关的变量，所以目前新增一个定时器，时时检测输入框的内容，
     * 如果内容被gitlab修改，则脚本会再次改回来，达到绕过这个问题的效果。
     *
     * 2020.07.16  增加修改默认值
     * */
    function autoCompletePRCommitTemplate() {
        var prCommitMsgTextArea = document.getElementById("merge-message-edit")
        var defaultPrCommitMsg

        function startTimer() {
            setInterval(checkChange, 100)//页面销毁才会停止，如果当前页面就需要一直跑
        }

        function checkChange() {
            //alert("timer is start")
            if (prCommitMsgTextArea.value != defaultPrCommitMsg) {
                //alert(prCommitMsgTextArea.value)
                prCommitMsgTextArea.value = defaultPrCommitMsg;
            }
        }

        if (prCommitMsgTextArea !== null) {
            var msg = prCommitMsgTextArea.value
            if (msg !== null) {
                //返回一个数组，判断数组的长度，大于3，取第三行数据为title
                var msg_split_lists = msg.split("\n");
                //alert(msg_split_lists.length)
                if (msg_split_lists.length > 3) {
                    var title = msg_split_lists[2];
                    //重新组装成一个填充模板
                    var prCommitMsg = title + "\n" +
                        "\n" +
                        "Modified:\n" +
                        "1. PR审核通过\n";
                    //再次填充内容
                    prCommitMsgTextArea.value = prCommitMsg;
                    prCommitMsgTextArea._value = prCommitMsg;//修改默认模板，避免被gitlab再次更改
                    defaultPrCommitMsg = prCommitMsg
                    startTimer(prCommitMsgTextArea)
                }

            }

        } else {
            //alert("pr commit msg is null")
        }
    }

    //4、PR 审核模板
    function autoCompletePRExamineAndVerifyTemplate() {
        var prExamineAndVerifyStr = "| PR检查项目 | 是否具备 |\n" +
            "| :------------: | :------------: |\n" +
            "| 修改原因描述 | √/× |\n" +
            "| 自测范围描述 | √/× |\n" +
            "| 代码命名规范 | √/× |\n" +
            "| 逻辑检查 | √/× |\n" +
            "\n" +
            "结论: PR审核通过/PR审核不通过\n" +
            "\n";

        var element_pr_examine_and_verify = document.getElementById("note-body")
        if (element_pr_examine_and_verify !== null) {
            element_pr_examine_and_verify.value = prExamineAndVerifyStr;
            element_pr_examine_and_verify.style = "overflow: hidden; overflow-wrap: break-word; resize: none; height: 210px;"
        } else {

            // alert("null merge request")
        }
    }

    //5、异常提交信息标为红色
    function markInvalidCommit() {
        //alert(2)

        var timer = null;

        function checkCommitLoaded() {
            var invalidList = document.getElementsByClassName("commit-row-message item-title js-onboarding-commit-item ")
            var patt = /^([SB]-[\d]+-)?[MOACRI][\W]?[:： ]/

            if (invalidList.length > 0) {
                for (var i = 0; i < invalidList.length; i++) {
                    if (!patt.test(invalidList[i].innerText)) {
                        invalidList[i].style = "color:red"
                    }
                }
                if (timer !== null) {
                    clearInterval(timer);
                    timer = null;
                }
            }

        }

        //如果第一次进来，相关图标未加载，则开启定时器进行轮询，直到加载完成为止
        timer = setInterval(checkCommitLoaded, 300);

    }

    function startAutoComplete() {
        //1、PR提交 模板
        autoCompletePRTemplate();
        //2、普通需求或bug commit 模板
        autoCompleteBugOrStoryCommitTemplate();
        //3、展开PR合并请求中的（相当于点击按钮展开）
        autoExpandAndCompletePRTemplate();
        //4、PR 审核模板
        autoCompletePRExamineAndVerifyTemplate()
        //5、异常提交信息标为红色
        markInvalidCommit()
    }


    if (navigator.userAgent.indexOf('Firefox') >= 0) {
        //firefox 不支持 window.onload 直接调用函数
        startAutoComplete()
    } else {
        //其他浏览器使用window.onload
        //窗口文件加载完成后，进行检测及模板填充
        //增加gl-sr-only的检测，来判断是否在gitlab页面，避免对jira和conference的影响
        if(document.getElementsByClassName("gl-sr-only").length > 0){
           window.onload = startAutoComplete;
        }
    }

})();

