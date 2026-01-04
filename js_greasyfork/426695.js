// ==UserScript==
// @name         google meet auto place meet-id for covid-19
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  auto place meeting id for http://www.ccjh.ntpc.edu.tw/
// @author       Neo Chang
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426695/google%20meet%20auto%20place%20meet-id%20for%20covid-19.user.js
// @updateURL https://update.greasyfork.org/scripts/426695/google%20meet%20auto%20place%20meet-id%20for%20covid-19.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*
    https://meet.google.com/?hs=197&pli=1&authuser=0
    */
    const bufferBefore = 15; // in minute
    const bufferAfter = 50; // in minute

    var countdownContainer = document.createElement("div");
    var countdownElm = document.createElement("div");
    countdownContainer.setAttribute("id", "countdown-container");
    countdownElm.setAttribute("id", "countdown-elm");

    var timetable = [
        { h: 8, m: 15 },
        { h: 9, m: 15 },
        { h: 10, m: 15 },
        { h: 11, m: 15 },
        { h: 13, m: 15 },
        { h: 14, m: 10 },
        { h: 15, m: 15 },
    ];

    var triggerFocus = function (element) {
        var eventType = "onfocusin" in element ? "focusin" : "focus",
            bubbles = "onfocusin" in element,
            event;

        if ("createEvent" in document) {
            event = document.createEvent("Event");
            event.initEvent(eventType, bubbles, true);
        }
        else if ("Event" in window) {
            event = new Event(eventType, { bubbles: bubbles, cancelable: true });
        }

        element.focus();
        element.dispatchEvent(event);
    };

    var toDatetime = function (d, h, m) {
        var _d = [d.getFullYear()
            , d.getMonth() + 1
            , d.getDate()
        ].join('-');

        return new Date(_d + " " + h.toString() + ":" + m.toString() + ":00");
    };

    var getCountdown = function () {
        var _d = new Date();

        var _current_time = _d.getTime();
        var _result = null;

        for (var i = 0; i < timetable.length; i++) {
            var _t = timetable[i];
            var _nextdt = toDatetime(_d, _t.h, _t.m);

            var _ms = _nextdt - _d;

            //if (_ms > 0) {
            if (_ms < (bufferBefore * 60000) && _ms >= ((bufferAfter * 60000) * -1)) {
                _result = { index: i + 1, h: parseInt(_ms / 3600000), m: parseInt(_ms / 60000) % 60, s: parseInt(_ms / 1000) % 60, ms: _ms };
            }
        }

        return _result;
    };

    var padLeft = function (v, length, paddingChar = '0') {
        var _v = v.toString();

        if (_v.length >= length) {
            return _v;
        } else {
            return padLeft(paddingChar + _v, length);
        }
    }

    var d = new Date();
    var n = d.getDay();
    var hour = d.getHours();
    var minutes = d.getMinutes();

    setTimeout(function () {
        var elms = document.querySelectorAll('input[placeholder="輸入代碼或暱稱"]');
        // 輸入會議代碼或連結
        if (elms.length == 0) elms = document.querySelectorAll('input[placeholder="輸入會議代碼或連結"]');
        //console.log(elms);

        if (elms.length > 0) {

            var styleContainer = "position: absolute; z-index: 99999; height: 70px; top: 100px; left: 25px; font-size: 40px; text-align: center;";
            var style = "display: inline-block; max-width: 670px; height: 70px; padding: 20px; border-radius: 10px; font-size: 50px; text-align: center;";

            countdownContainer.setAttribute("style", styleContainer);
            countdownElm.setAttribute("style", style + "background-color: #4cc9f0;");

            countdownContainer.appendChild(countdownElm);

            //countdownElm.innerText = "下堂課將於 後開始...";
            countdownElm.innerText = "";
            var runCountdown = function () {
                var c = getCountdown();

                if (c != null) {

                    var str = "ccjh713-" + n.toString() + c.index.toString();

                    elms[0].value = str;
                    triggerFocus(elms[0]);

                    if (c.h == 0 && (c.m <= 3) && c.s >= 0) {
                        // #ef476f
                        countdownElm.setAttribute("style", style + "background-color: #ef476f; color: #ffffff !important;");
                    }

                    if (c.ms > 0) {
                        if (c.h > 0) {
                            // h:mm:ss
                            countdownElm.innerText = "下堂課將於 " + [c.h, padLeft(c.m, 2, '0'), padLeft(c.s, 2, '0')].join(':') + " 後開始...";
                        }
                        else {
                            // m:ss
                            countdownElm.innerText = "下堂課將於 " + [c.m, padLeft(c.s, 2, '0')].join(':') + " 後開始...";
                        }
                    }
                    else if (c.ms < 0) {
                        countdownElm.innerText = "第 " + c.index + " 節課 上課中";
                        countdownElm.setAttribute("style", style + "background-color: #06d6a0; color: #ffffff !important;");
                    }

                    setTimeout(runCountdown, 1000);
                    return;
                }
                countdownElm.innerText = "今日課程已結束";
                //document.body.removeChild(countdownElm);
                countdownElm.setAttribute("style", style + "background-color: #ef476f; color: #ffffff !important");
            };

            document.body.appendChild(countdownContainer);

            var link = document.createElement("a");
            link.setAttribute("href", "http://www.ccjh.ntpc.edu.tw/mediafile/598/news/1589/2021-5/122021-5-18-18-33-23-nf1.pdf");
            link.setAttribute("target", "_blank");
            link.innerHTML = "<img src=\"https:\/\/i.imgur.com/XKtP40l_d.webp?maxwidth=60&fidelity=grand\" style=\"max-width: 36px; margin-left: 20px; margin-right: 10px; position: relative; top: 3px;\" \/>課表";
            countdownContainer.appendChild(link);

            runCountdown();
        }
    }, 500);
})();