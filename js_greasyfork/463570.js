// ==UserScript==
// @name         Yahoo新聞留言自動檢舉腳本
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  檢舉特定使用者大量垃圾留言!
// @author       hughccr
// @match        https://tw.news.yahoo.com/*.html
// @match        https://tw.news.yahoo.com/*.html?bcmt=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463570/Yahoo%E6%96%B0%E8%81%9E%E7%95%99%E8%A8%80%E8%87%AA%E5%8B%95%E6%AA%A2%E8%88%89%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/463570/Yahoo%E6%96%B0%E8%81%9E%E7%95%99%E8%A8%80%E8%87%AA%E5%8B%95%E6%AA%A2%E8%88%89%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

// 0.使用者須先登入yahoo才可檢舉(未登入就無法檢舉留言)
// 1.僅本頁面自動檢舉, 根據關鍵字找出特定使用者後並針對該評論檢舉, 當本頁面跑完後會自動重整頁面直到找不到特定使用者
// 2.全自動化檢舉, 根據關鍵字找出特定使用者後, 開啟該使用者的所有歷史評論視窗並檢舉該使用者的所有評論
//   檢舉完後自動重整網頁, 繼續同樣流程, 當已經找不到目標後會自動點擊下一則新聞並繼續尋找

var keywords = ["抗議", "重障", "輕障", "身障", "君品苑", "燒香", "燒金紙", "邱萍如", "家暴", "暴力", "殘疾"];
var mode = "";
var reload_flag = false;
var jump_proc_flag = false;
var jump_proc_times = 0;
var check_ready_times = 0;
var check_ready_finished = false;

(function() {
    'use strict';
    var $ = window.jQuery;
    $('[id^=community-bar]').first().prepend('<input type="button" value="立即中止" id="stop_auto_report">');
    $("#stop_auto_report").click(function() {
        sessionStorage.setItem("fully_auto_again", "false");
        sessionStorage.setItem("current_page_again", "false");
        document.location.reload(true);
    });
    $('[id^=community-bar]').first().prepend('<input type="button" value="僅本頁面自動檢舉" id="auto_report_current_page">');
    $("#auto_report_current_page").click(function() {
        mode = "current_page";
        var iframe = $('[id^=community-bar][id$=iframe]')[0];
        var btns = iframe.contentWindow.document.getElementsByTagName("BUTTON");
        var found = null;
        for (var i = 0; i < btns.length; i++) {
            if (btns[i].textContent.includes("檢視留言")) {
                found = btns[i];
                break;
            }
        }
        if (found != null) {
            found.click();
            sleep(3000).then(showmore);
        }
        else {
            sleep(3000).then(showmore);
        }
    });
    $('[id^=community-bar]').first().prepend('<input type="button" value="全自動化檢舉" id="auto_report_fully_auto">');
    $("#auto_report_fully_auto").click(function() {
        mode = "fully_auto";
        var iframe = $('[id^=community-bar][id$=iframe]')[0];
        var btns = iframe.contentWindow.document.getElementsByTagName("BUTTON");
        var found = null;
        for (var i = 0; i < btns.length; i++) {
            if (btns[i].textContent.includes("檢視留言")) {
                found = btns[i];
                break;
            }
        }
        if (found != null) {
            found.click();
            sleep(3000).then(showmore);
        }
        else {
            sleep(3000).then(showmore);
        }
    });

    if (sessionStorage.getItem("fully_auto_again") == "true" || sessionStorage.getItem("current_page_again") == "true") {
        document.title = "*" + document.title;
        checkReady();
    }
})();

function checkReady() {
    var $ = window.jQuery;
    var iframe = $('[id^=community-bar][id$=iframe]')[0];
    if (iframe != null && iframe.contentWindow.document.querySelector("button.comments-title") != null &&
        iframe.contentWindow.document.querySelector("button.comments-title").textContent.includes("檢視留言")) {
        check_ready_finished = true;
        if (sessionStorage.getItem("fully_auto_again") == "true") {
            $("#auto_report_fully_auto").click();
            if (iframe.contentWindow.document.querySelector("button.comments-title").textContent.includes("檢視留言")) {
                sleep(3000).then(checkReady);
            }
        }
        else if (sessionStorage.getItem("current_page_again") == "true") {
            $("#auto_report_current_page").click();
            if (iframe.contentWindow.document.querySelector("button.comments-title").textContent.includes("檢視留言")) {
                sleep(3000).then(checkReady);
            }
        }
    }
    else if (check_ready_finished == false){
        if (check_ready_times <= 5) {
            ++check_ready_times;
            sleep(3000).then(checkReady);
        }
        else {
            document.location.reload(true);
        }
    }
}

function showmore() {
    var $ = window.jQuery;
    var iframe = $('[id^=community-bar][id$=iframe]')[0];
    if (mode == "current_page") {
        autoreport_current_page();
    }
    else if (mode == "fully_auto") {
        autoreport_fully_auto();
    }
    var btn = iframe.contentWindow.document.querySelector("div.user-comments > div > button");
    var btn2 = iframe.contentWindow.document.querySelector("div.comments-body > button");
    !!btn ? btn.click() : btn2?.click();
    sleep(3000).then(showmore);
}

var count = 0;
function autoreport_current_page() {
    var $ = window.jQuery;
    var iframe = $('[id^=community-bar][id$=iframe]')[0];
    var comments = iframe.contentWindow.document.querySelectorAll("li.comment");
    for (var idx = 0; idx < comments.length; idx++) {
        var comment = comments[idx];
        if (comment.closest("div.user-comments") == null) {
            //var username = comment.innerText.split(/\n/)[0];
            var username = comment.children[0].children[0].children[1].textContent;
            for (var idx_k = 0; idx_k < keywords.length; idx_k++) {
                if (username.includes(keywords[idx_k])) {
                    //console.log(comment.innerText);
                    var ob = comment.getElementsByClassName("overflow-button")[0];
                    ob.click();
                    var fbf = comment.getElementsByClassName("flyout-button-flag")[0];
                    fbf.click();
                    var inputs = comment.getElementsByTagName("input");
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i].defaultValue.includes("疑似垃圾內容")) {
                            inputs[i].click();
                            var btns = comment.getElementsByTagName("BUTTON");
                            for (var b = 0; b < btns.length; b++) {
                                if (btns[b].textContent == "完成") {
                                    btns[b].click();
                                    ++count;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    // 如果已經全部檢舉完(無顯示更多內容按鈕), 則重整頁面
    if (iframe.contentWindow.document.querySelector("div.comments-body > button") == null && count > 0 && reload_flag == false) {
        reload_flag = true;
        sessionStorage.setItem("current_page_again", "true");
        sleep(10000).then(() => document.location.reload(true));
    }
}

function autoreport_fully_auto() {
    var $ = window.jQuery;
    var iframe = $('[id^=community-bar][id$=iframe]')[0];
    var comments = iframe.contentWindow.document.querySelectorAll("li.comment");
    var idx = 0;
    var comment = null;
    var done = false;
    var uc = iframe.contentWindow.document.querySelector("div.user-comments");
    // 如果沒有開啟歷史評論視窗的話, 就根據關鍵字找出特定使用者, 找到後點擊使用者頭像
    if (uc == null) {
        for (idx = 0; idx < comments.length; idx++) {
            comment = comments[idx];
            //var username = comment.innerText.split(/\n/)[0];
            var username = comment.children[0].children[0].children[1].textContent;
            for (var idx_k = 0; idx_k < keywords.length; idx_k++) {
                if (username.includes(keywords[idx_k])) {
                    var avatar = comment.getElementsByClassName("avatar")[0];
                    if (avatar != null) {
                        avatar.click();
                        done = true;
                        break;
                    }
                }
            }
            if (done) {
                break;
            }
        }
        // 如果找不到特定使用者且顯示更多內容按鈕也點完的話, 就挑選一則有留言的新聞並前往
        if (done == false &&
            iframe.contentWindow.document.querySelector("button.comments-title").textContent.includes("個留言") == true &&
            iframe.contentWindow.document.querySelector("div.comments-body > button") == null) {
            if (sessionStorage.getItem("fully_auto_again") != "true") {
                sessionStorage.setItem("fully_auto_again", "true");
            }
            document.getElementById("stream-wrapper")?.scrollIntoView({behavior: "instant", block: "start", inline: "nearest"});
            document.getElementById("stream-wrapper")?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            if (jump_proc_flag == false) {
                jump_proc_flag = true;
                sleep(5000).then(() => {
                    jump_proc_flag = false;
                    ++jump_proc_times;
                    var arr = document.querySelectorAll("li.common.stream-item > div.action-bar > div > div.comments-button a");
                    for (idx = 0; idx < arr.length; idx++) {
                        if ((parseInt(arr[idx].lastChild?.textContent) >= 50 || jump_proc_times >= 4) && arr[idx].href.includes("tw.news.yahoo.com") && sessionStorage.getItem(arr[idx].href) == null) {
                            sessionStorage.setItem(arr[idx].href, arr[idx].href);
                            //document.location = arr[idx].href;
                            document.location = arr[idx].href.replace("?bcmt=1", "");
                            break;
                        }
                    }
                });
            }
        }
    }
    // 有開啟歷史評論視窗
    if (uc != null) {
        // 先移除span(如果有的話)
        var spans = iframe.contentWindow.document.querySelectorAll("div.user-comments > div > ul > span");
        for (var s = 0; s < spans.length; s++) {
            var node = spans[s];
            node.parentNode.removeChild(node);
        }
        // 再檢舉comment
        for (idx = 0; idx < comments.length; idx++) {
            comment = comments[idx];
            // 如果是user-comments的子節點的話, 直接檢舉
            if (comment.closest("div.user-comments") != null) {
                // 有可能是剛點完檢舉的comment, ob會找不到
                var ob = comment.getElementsByClassName("overflow-button")[0];
                if (ob != null) {
                    ob.click();
                    var fbf = comment.getElementsByClassName("flyout-button-flag")[0];
                    fbf.click();
                    var inputs = comment.getElementsByTagName("input");
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i].defaultValue.includes("疑似垃圾內容")) {
                            inputs[i].click();
                            var btns = comment.getElementsByTagName("BUTTON");
                            for (var b = 0; b < btns.length; b++) {
                                if (btns[b].textContent == "完成") {
                                    btns[b].click();
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        // 如果已經全部檢舉完(無顯示更多內容按鈕), 則重整頁面
        if (iframe.contentWindow.document.querySelector("div.user-comments > div > button") == null && reload_flag == false) {
            reload_flag = true;
            sessionStorage.setItem("fully_auto_again", "true");
            sleep(10000).then(() => document.location.reload(true));
        }
    }
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
