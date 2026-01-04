// ==UserScript==
// @name         logCenterQueryDecode
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  对logCenter的query进行decode
// @author       You
// @match        http://logcenter.data.sankuai.com/search/dpods_baymax_wm_charge_service_cpvlog/query/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require https://update.greasyfork.org/scripts/476008/1255570/waitForKeyElements%20gist%20port.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484795/logCenterQueryDecode.user.js
// @updateURL https://update.greasyfork.org/scripts/484795/logCenterQueryDecode.meta.js
// ==/UserScript==

console.log('成功加载本地文件...')

function log(s) {
    console.log("======wdd " + s);
}

var queryThSelector = "#tblHeader tr.field_filter th:contains('query')";

function f() {
    var queryTh = $(queryThSelector);
    log("find query title..." + queryTh.text())

    var index = queryTh.index();

    log("query title index:" + index);

    $("#tblHeader").closest('table').find('tbody tr').map(function () {
        var pre = $(this).find('td').eq(index).find('pre');
        var con = pre.text();
        var dec = decodeURI(con);
        log("query对应的内容：" + con + "，解码后为：" + dec);


        if (pre.parent().children().length == 1) {
            if (con != dec) {
                pre.after('<label style="background-color: #ef080891;">' + dec + '</label>')
            }
        } else {
            pre.next().remove();

            if (con != dec) {
                pre.after('<label style="background-color: #ef080891;">' + dec + '</label>')
            }
        }

    });
}


waitForKeyElements(queryThSelector, f);


function clickListener() {
    // 当点击事件触发时执行的代码
    var $this = $(this);

    // 这里可以添加其他点击后需要执行的逻辑
    log('Clicked pagination item: ' + $this.find('span').text());

    var timerId = setInterval(function () {
        if ($('.loading-div').is(':visible')) {
            // div 是可见的
        } else {
            log('请求完成')
            // var w = setInterval(function () {
            //     // 清除定时器
            //     clearInterval(w);
            // }, 2000);
            f()

            // 清除定时器
            clearInterval(timerId);
        }
    }, 1000);
}


var page = '.mu-pagination';
function pageSearch() {
    $('.mu-pagination > .mu-pagination-item, .search-button').click(clickListener);
}

waitForKeyElements(page, pageSearch);

var timeOp ='.time-option-cls'
function timeSearch() {
    $('.time-option-cls').click(clickListener);
}

waitForKeyElements(timeOp, timeSearch);

var rippleOp = '.mu-ripple-wrapper'
function rippleSearch() {
    $('.mu-ripple-wrapper').click(clickListener);
}
waitForKeyElements(rippleOp, rippleSearch);
