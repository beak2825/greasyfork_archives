// ==UserScript==
// @name         Nyaa Filter
// @version      1.0
// @description  为nyaa上添加更多过滤条件
// @icon         https://sukebei.nyaa.si/static/favicon.png
// @author       Amamiya
// @match        https://sukebei.nyaa.si/*
// @match        https://nyaa.si/*
// @match        https://nyaa.land/*
// @exclude      https://sukebei.nyaa.si/*/*
// @exclude      https://nyaa.si/*/*
// @exclude      https://nyaa.land/*/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      Apache-2.0 license
// @namespace https://greasyfork.org/users/801480
// @downloadURL https://update.greasyfork.org/scripts/482019/Nyaa%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/482019/Nyaa%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 条件框
    var nodeHtml = '<div id="tool-card" class="centered-style"><div class="card-body"><label for="earliestDate">最早日期 <input type="date" style="width:75%" id="earliestDate"></label><label for="latestDate">最晚日期 <input type="date" id="latestDate" style="width:75%"></label><label for="downloadComplete">下载完成 <input type="number" style="width:75%" id="downloadComplete"></label></div><div class="card-footer"><button id="RESET_BUTTON">重置</button><button id="FILTER_BUTTON">确定</button></div></div>';
    var tempNode = document.createElement('div');
    tempNode.innerHTML = nodeHtml;
    var toolCard = tempNode.firstChild;
    document.body.appendChild(toolCard);

    // 重置
    $("#RESET_BUTTON").on("click", function () {
        $("#earliestDate").val("");
        $("#latestDate").val("");
        $("#downloadComplete").val("");
        $("tr:hidden").show();
    });

    // 确定
    $("#FILTER_BUTTON").on("click", function () {
        applyFilter();
    });
    watchNewTr();
    dargCard();
    // 样式
    GM_addStyle(`
    #tool-card {
        z-index: 998;
        position: fixed;
        left: 10px;
        top: 400px;
        background-color: #0f0e17;
        color: #a7a9be;
        display: flex;
        flex-direction: column;
        padding: 0.75rem 1rem 0.4rem;
        font-size: 1.2rem;
        font-weight: 600;
        border-radius: 6px;
        border: 2px solid #337ab7;
        min-width: 160px;
    }
    .card-body {
        display: flex;
        flex-direction: column;
    }
    .card-footer {
    display: flex;
    justify-content: space-around;
    margin-top: 0.3rem;
}
    #tool-card button {
    margin-bottom: 0.2rem;
    background-color: #337ab7;
    color: #fffffe;
    padding: 0.3rem 0.5rem;
    border: none;
    border-radius: 3px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
}
    #tool-card label {
        margin-bottom: 0.5rem;
    }
    #tool-card input[type="date"],
    #tool-card input[type="number"] {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
    .centered-style {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
    }
    `);



})();




function watchNewTr() {
    var observer = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {
            var filterValue = parseInt($("#downloadComplete").val(), 10);
            var earliestDate = $("#earliestDate").val();
            var latestDate = $("#latestDate").val();
            mutation.addedNodes.forEach(function (node) {
                if (node.tagName && node.tagName.toLowerCase() === 'tr') {
                    //applyFilter();
                    var timeTd = $(node).find("td:nth-child(5)");
                    var timeValue = Date.parse(timeTd.text());
                    var downloadTd = $(node).find("td:last-child");
                    var downloadValue = parseInt(downloadTd.text(), 10);
                    if (downloadValue < filterValue) {
                        $(node).hide();
                    }
                    if (earliestDate) {
                        if (timeValue < Date.parse(earliestDate)) {
                            $(node).hide();
                        }
                    }
                    if (latestDate) {
                        if (timeValue > Date.parse(latestDate)) {
                            $(node).hide();
                        }
                    }
                }
            });
        });
    });
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

function applyFilter() {
    $("tr").show();
    var filterValue = parseInt($("#downloadComplete").val(), 10);
    var earliestDate = $("#earliestDate").val();
    var latestDate = $("#latestDate").val();
    $("tr").each(function () {
        var timeTd = $(this).find("td:nth-child(5)");
        var timeValue = Date.parse(timeTd.text());
        var downloadTd = $(this).find("td:last-child");
        var downloadValue = parseInt(downloadTd.text(), 10);
        if (downloadValue < filterValue) {
            $(this).hide();
        }
        if (earliestDate) {
            if (timeValue < Date.parse(earliestDate)) {
                $(this).hide();
            }
        }
        if (latestDate) {
            if (timeValue > Date.parse(latestDate)) {
                $(this).hide();
            }
        }
    });
}

function tryCatch(callBack) {
    try {
        callBack && callBack()
    } catch (e) {
        console.log(e)
    }
}

function dargCard() {
    tryCatch(() => {
        $("#tool-card").mousedown(function () {
            $("#tool-card").on({
                mousedown: function (e) {
                    var el = $(this);
                    var os = el.offset();
                    var dx = e.pageX - os.left
                    var dy = e.pageY - os.top;
                    $(document).on('mousemove.drag', function (e) {
                        el.offset({
                            top: e.pageY - dy,
                            left: e.pageX - dx
                        });
                    });
                },
                mouseup: function (e) {
                    $(document).off('mousemove.drag');
                }
            })
        })
    })
}
