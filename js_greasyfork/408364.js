// ==UserScript==
// @name         時報(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1時間ごとに時報が投稿されます。
// @author       You
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @require      https://greasyfork.org/scripts/396472-yaju1919/code/yaju1919.js?version=798050
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/408364/%E6%99%82%E5%A0%B1%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408364/%E6%99%82%E5%A0%B1%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==

(function(unsafeWindow) {
    'use strict';
    var $ = unsafeWindow.$;
    var yaju1919 = window.yaju1919;
    var addCheckBtn = function(h, title, val, func) { // チェックボックスを追加する関数
        var flag = val;
        var check = $("<input>", {
            type: "checkbox"
        });
        var btn = $("<button>").append(check).append(title).click(function() {
            flag = !flag;
            setCSS();
            if (func) func();
        });
        var setCSS = function() {
            btn.css("background-color", (flag ? "red" : "gray"));
            check.prop("checked", flag);
        }
        setCSS();
        h.before(btn);
        return function() {
            flag;
        }
    }
    var comment = function(str) { // 投稿する関数
        $.post(location.href + "post_feed.php", {
            name: $("#post_form_name").val(),
            comment: str,
            is_special: 0,
            category_id: 0
        });
    }
    var notice_flag = false; // 時報するかどうか
    var main = function() {
        var nowTime = yaju1919.getTime().match(/^([0-9]+):([0-9]+:[0-9]+)$/);
        var hours = nowTime[1]
        var isSwitched_flag = (nowTime[2] === "00:00");
        if (isSwitched_flag && notice_flag) comment(Number(hours) + "時をお知らせします。"); // Number関数で00を0に直す
    }
    addCheckBtn($("#header_items"), "時報", false, function() {
        notice_flag = !notice_flag;
    });
    setInterval(main, 1000);
})(this.unsafeWindow || window);