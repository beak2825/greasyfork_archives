// ==UserScript==
// @name         知乎批量举报
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在知乎问题页自动执行举报操作
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @author       sisyplone
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419090/%E7%9F%A5%E4%B9%8E%E6%89%B9%E9%87%8F%E4%B8%BE%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/419090/%E7%9F%A5%E4%B9%8E%E6%89%B9%E9%87%8F%E4%B8%BE%E6%8A%A5.meta.js
// ==/UserScript==

// 每次操作的时间间隔
var autoReportIntervalStart = 15000;
var autoReportIntervalEnd = 10000;
var reportUserList = {};
var aReport;

function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function() {
      var d = 0.5;
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
      m.style.opacity = '0';
      setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

function question(){

    $(".ContentItem-actions").each(function () {

        if ($(this).find(".Zi--Report").length == 0 && $(this).find(".Zi--Settings").length == 0) {
            let $question_dot = $(this).find(".Zi--Dots").closest(".ContentItem-action");
            $question_dot.hide();
            let button_text = '<button type=\"button\" class=\"Button ContentItem-action Button--plain Button--withIcon Button--withLabel not-report\"><span style=\"display: inline-flex; align-items: center;\"><svg class=\"Zi Zi--Report\" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
            let $report = $(button_text);
            $report.bind("click", function () {
                $question_dot.find("button").click();
                $(".Menu.AnswerItem-selfMenu").find("button").each(function () {
                    if ($(this).text().indexOf("举报") > -1)
                        $(this).click();
                });
            });
            $question_dot.after($report);

        } else {
            $(this).find(".Zi--Dots").closest(".ContentItem-action").hide();
        }

    });

}

function getUserList(){
    let userList = $("span.SearchItem-userTitle .UserLink-link");
    let searchWord = $(".SearchBar-input input").val();
    if (userList.length > 0){
        userList.each((index, item)=>{
            let spanText = $(item).find("span.Highlight").text();
            if (spanText === searchWord){
                let userLink = $(item).attr("href");
                if (!reportUserList.hasOwnProperty(userLink)){
                    console.info("找到用户: ", spanText);
                    console.info("找到用户链接: ", userLink);
                    reportUserList[userLink] = 1;
                }
            }
        });
    }
}

function autoReport(){
    if ($(".not-report").length > 0){
        if ($(".ModalButtonGroup .ReportMenu-button").length > 0 && $(".Modal-closeButton[aria-label='关闭']").length > 0){
            console.log("举报失败，关闭页面。")
            $(".Modal-closeButton[aria-label='关闭']").click();
        }

        $(".not-report")[0].click();
        console.log("点击举报");
        $(".ReportMenu-options .ReportMenu-item")[0].click();
        console.log("选择原因");
        $(".ModalButtonGroup .ReportMenu-button").click();
        console.log("举报");
        $($(".not-report")[0]).removeClass("not-report");

    }else{
        console.log("当前页已举报完毕，滚动到底部");
        $(document).scrollTop($(document).height());
        $(document).scrollTop($(document).height() - 2000);
        $(document).scrollTop($(document).height());
    }

    clearInterval(aReport);
    aReport = setInterval(autoReport, parseInt(Math.random()*(autoReportIntervalStart-autoReportIntervalEnd+1)+autoReportIntervalEnd));

}

function autoReportUser(){
    let userLinks = Object.keys(reportUserList);
    let reportedNum = 0;
    for(let userLink in reportUserList){
        if(reportUserList[userLink] === 1){
            openWin(userLink);
            reportUserList[userLink] = 0;
            clearInterval(aReport);
            aReport = setInterval(autoReportUser, parseInt(Math.random()*(autoReportIntervalStart-autoReportIntervalEnd+1)+autoReportIntervalEnd));
            break;
        }else{
            reportedNum += 1;
        }
    }
    if (reportedNum === userLinks.length){
        console.log("当前页已举报完毕，滚动到底部");
        $(document).scrollTop($(document).height());
        $(document).scrollTop($(document).height() - 2000);
        $(document).scrollTop($(document).height());
    }
}

function openWin(userLink){
    console.log("打开新窗口");
    myWindow=window.open('https:' + userLink);
    setTimeout(()=>{
        let allButton = myWindow.document.querySelectorAll(".Profile-footerOperations button.Button.Button--plain");
        allButton.forEach((item, index)=>{
            let $button = $(item)
            if ($button.html().indexOf("举报") !== -1){
                $button.click();
                console.log("点击举报");
                let selectReason = myWindow.document.querySelectorAll(".ReportMenu-options .ReportMenu-item")[2]
                $(selectReason).click(); // 选择原因
                console.log("选择原因");

                let reasonArea = myWindow.document.querySelector(".ReportMenu-textarea textarea");
                $(reasonArea).focus();

                let lastValue = reasonArea.value;
                reasonArea.value = "用户名违规，不符合规范，容易与账号使用状态混淆";
                let event = new Event('input', {bubbles: true});
                let tracker = reasonArea._valueTracker;
                if (tracker){
                    tracker.setValue(lastValue);
                }
                reasonArea.dispatchEvent(event);

                console.log("输入原因");

                let reportButton = myWindow.document.querySelectorAll(".ModalButtonGroup .ReportMenu-button")[0];  // 点击举报
                $(reportButton).click();

                console.log("举报，并关闭窗口");

                myWindow.close();
            }
        });
    }, 3000);
}

(function() {

    var $QuestionHeaderActions = $("div.QuestionHeaderActions");  //问题标题
    var $titlemore = $QuestionHeaderActions.find(".Zi--Dots").parent().parent().parent(); //更多
    var $titleBatchReport = $QuestionHeaderActions.find(".Title.Zi--Report"); //举报
    var isStart = false;

    var button_Add = `<button id="auto-report-button" data-tooltip="举报/暂停" data-tooltip-position="left" data-tooltip-will-hide-on-click="false" aria-label="举报/暂停" type="button" class="Button CornerButton Button--plain"><svg class="ContentItem-arrowIcon is-active" aria-label="举报/暂停" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.005z"></path></svg></button>`
    var style_Add = document.createElement('style');
    style_Add.innerHTML = '.CornerButton{margin-bottom:8px !important;}.CornerButtons{bottom:45px !important;}';
    document.head.appendChild(style_Add);
    $(".CornerAnimayedFlex").prepend(button_Add);
    $("#auto-report-button").on("click", function () {
        let reportFunction;
        if (window.location.href.indexOf("question") > -1){
            reportFunction = autoReport;
        }
        if (window.location.href.indexOf("search") > -1 && window.location.href.indexOf("type=people") > -1){
            reportFunction = autoReportUser;
        }
        if(!isStart){
            isStart = true;
            console.log("开始举报");
            Toast("开始举报", 1000);
            aReport = setInterval(reportFunction, parseInt(Math.random()*(autoReportIntervalStart-autoReportIntervalEnd+1)+autoReportIntervalEnd));
        }else{
            isStart = false;
            console.log("暂停举报");
            Toast("暂停举报", 1000);
            clearInterval(aReport);
        }
    });

    // if ($(".AppHeader-profileAvatar").length > 0){  //已登录
    if (false){  //已登录
        $titlemore.hide();
        let button_text = '<button type=\"button\" class=\"Button Button--plain Button--withIcon Button--withLabel\"><span style=\"display: inline-flex; align-items: center; vertical-align:middle;\"><svg class=\"Title Zi--Report \" fill=\"currentColor\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\"><path d=\"M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z\" fill-rule=\"evenodd\"></path></svg></span> 举报</button>';
        let $report = $(button_text);
        $report.bind("click", function () {
            $titlemore.find("button").click();
            $(".Menu.QuestionHeader-menu").children().eq(2).click();
        });
        $titlemore.after($report);
    }

    if (window.location.href.indexOf("question") > -1){
        setInterval(question, 300);
    }
    if (window.location.href.indexOf("search") > -1 && window.location.href.indexOf("type=people") > -1){
        setInterval(getUserList, 300);
    }

})();