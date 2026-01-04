// ==UserScript==
// @name        xtu评教
// @namespace   http://tampermonkey.net/
// @match       http://jwxt.xtu.edu.cn/jsxsd/xspj/xspj_*
// @grant       none
// @version     1.1
// @author      D15h35
// @description xtu教务系统自动评教
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/419044/xtu%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/419044/xtu%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
var $ = window.jQuery;
window.confirm = function () { return true; }
window.alert = function () { return true; }

function closeWebPage() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {//close IE
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        } else {
            window.open('', '_top');
            window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {//close firefox
        window.location.href = 'about:blank ';
    } else {//close chrome;It is effective when it is only one.
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
}

if (location.pathname === "/jsxsd/xspj/xspj_list.do") {
    let pages = [];
    let appraise = $("a");
    let pageIndex = 0;

    if (appraise != null) {
        appraise.each(function (index, a) {
            if ($(a).text() === "评价") {
                pages.push($(a).attr('href').match(/'(\/[^\s]*)'/)[1]);
            }
        });
    }

    if (pages.length != 0) {
        let h = setInterval(() => {
            window.open(pages[pageIndex]);
            if (pageIndex == pages.length - 1) {
                clearInterval(h);
            }
            pageIndex++;
        }, 2000);
    }
} else if (location.pathname === "/jsxsd/xspj/xspj_edit.do") {
    let tj = $("#tj");
    if (tj != null) {
        let radioNum = $("input[id^='pj0601id'][id$='_1']");
        console.log(radioNum.length);
        for (let pageIndex = 1; pageIndex <= radioNum.length; pageIndex++) {
            $("#pj0601id_" + pageIndex + "_" + [1, 2][Math.floor(Math.random() * 2)]).attr("checked", true);
        }
        // tj.trigger("click");
        let f = new FormData(document.querySelector("#Form1"));
        f.set("issubmit", "1");
        let data = "";
        f.forEach((v, k) => data += `${k}=${v}&`);
        data = data.slice(0, -1);
        let xhr = new XMLHttpRequest();
        xhr.open(document.getElementById("Form1").method, document.getElementById("Form1").action);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = (data) => console.log(data);
        xhr.send(data);
        setTimeout(function () { closeWebPage(); }, 2000);
    }
}

