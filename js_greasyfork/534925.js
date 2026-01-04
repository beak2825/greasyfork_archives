// ==UserScript==
// @name            Auto nhặt đồ Sangtacviet
// @name:vi         Auto nhặt đồ Sangtacviet
// @namespace       http://tampermonkey.net/
// @version         1.5
// @icon            https://sangtacviet.vip/favicon.png
// @description     Reload lại page sangtacviet để kiếm điểm kinh nghiệm.
// @description:vi  Reload lại page sangtacviet để kiếm điểm kinh nghiệm.
// @author          FixBug by Cáo
// @match           https://sangtacviet.vip/truyen/*
// @match           http://14.225.254.182/truyen/*
// @match           https://sangtacviet.app/truyen/*
// @require         https://code.jquery.com/jquery-3.5.1.min.js
// @require         https://unpkg.com/ejs@2.7.4/ejs.min.js
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js?v=a834d46
// @noframes
// @connect         self
// @supportURL      https://facebook.com/fixbug
// @run-at          document-idle
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/534925/Auto%20nh%E1%BA%B7t%20%C4%91%E1%BB%93%20Sangtacviet.user.js
// @updateURL https://update.greasyfork.org/scripts/534925/Auto%20nh%E1%BA%B7t%20%C4%91%E1%BB%93%20Sangtacviet.meta.js
// ==/UserScript==
(function ($, window, document) {
    'use strict';

    // Tạo một div để hiển thị log
    var logDiv = document.createElement('div');
    logDiv.id = 'custom-log';
    logDiv.style.position = 'fixed';
    logDiv.style.top = '0';
    logDiv.style.left = '0';
    logDiv.style.width = '100%';
    logDiv.style.maxHeight = '200px';
    logDiv.style.overflowY = 'auto';
    logDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    logDiv.style.color = 'white';
    logDiv.style.fontSize = '12px';
    logDiv.style.zIndex = '9999';
    logDiv.style.padding = '10px';
    document.body.appendChild(logDiv);

    // Hàm ghi log vào div
    function customLog(message) {
        if (!logDiv) {
            console.error("logDiv chưa được khởi tạo.");
            return;
        }

        var logMessage = document.createElement('div');
        logMessage.textContent = message;
        logDiv.appendChild(logMessage);

        // Tự động cuộn xuống cuối
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    var waitTime = 0;
    var retryNum = 1;
    var cType = 0;

    var randomFn = function (min, max) {
        min = min || 180000;
        max = max || 300000;
        return Math.floor((Math.random()) * (max - min + 1)) + min;
    };

    var randomXinDo = function (min, max) {
        min = min || 40000; // 40 giây
        max = max || 60000; // 60 giây
        var time = Math.floor((Math.random()) * (max - min + 1)) + min;
        console.log("randomXinDo - min:", min, "max:", max, "time:", time);
        return time;
    };

    var randomTimeoutFn = function (time, action) {
        time = time || randomFn();
        var handle = setTimeout(() => {
            action();
            clearTimeout(handle);
        }, time);
    };

    var xemCoGiKhong = function () {
        return new Promise((resolve, reject) => {
            try {
                var params = "ngmar=collect&ajax=collect";
                var http = new XMLHttpRequest();
                var url = '/index.php';
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                http.onreadystatechange = async function () {
                    if (http.readyState == 4 && http.status == 200) {
                        var x;
                        try {
                            x = JSON.parse(http.responseText);
                            g("cInfo").innerHTML = x.info;
                            g("cName").innerHTML = x.name;
                            g("cLevel").innerHTML = x.level;
                            cType = x.type;

                            // Loại bỏ HTML trong nội dung x.name và x.info
                            var tempDiv = document.createElement('div');
                            tempDiv.innerHTML = x.name;
                            var cleanName = tempDiv.textContent || tempDiv.innerText || '';

                            tempDiv.innerHTML = x.info;
                            var cleanInfo = tempDiv.textContent || tempDiv.innerText || '';

                            customLog("Có đồ vật rơi kìa: " + cleanName + " - " + cleanInfo);
                            resolve(true);
                        } catch (f) {
                            customLog(http.responseText);
                            resolve(false);
                        }
                    }
                };
                http.send(params);
            } catch (err) {
                console.error(err);
                resolve(false);
            }
        });
    };

    var thuThap = function () {
        return new Promise((resolve, reject) => {
            try {
                var urlxx = window.location.href.slice(0, -1).split('/');
                var chapterId = $(urlxx).get(-1);
                var params = "ajax=fcollect&c=" + chapterId;
                if (cType == 3 || cType == 4) {
                    var nname = g("cName").innerText;
                    if (nname.length > 80) {
                        return;
                    }
                    params += "&newname=" + encodeURI(nname) + "&newinfo=" + encodeURI(g("cInfo").innerText);
                }
                var http = new XMLHttpRequest();
                var url = '/index.php?ngmar=fcl';
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                http.onreadystatechange = async function () {
                    if (http.readyState == 4 && http.status == 200) {
                        try {
                            var x = JSON.parse(http.responseText);
                            if (x.code == 1) {
                                customLog("Thu thập đồ vật thành công");
                            }
                        } catch (e) {
                            customLog("Lỗi rồi. Không thu thập được.");
                        }
                    }
                };
                http.send(params);
            } catch (err) {
                console.error(err);
            }
        });
    };

    // Refresh
    randomTimeoutFn(2000, async () => {
        var timeXinDo = randomXinDo(40000, 60000); // Đảm bảo giá trị nằm trong khoảng 40-60 giây
        setInterval(() => {
            xemCoGiKhong().then(async (item) => {
                if (item == true) {
                    await thuThap();
                }
                customLog("Page sẽ tự động xin đồ lại sau " + timeXinDo / 1000 + " giây!");
            });
        }, timeXinDo);

        waitTime = randomFn();
        customLog("Page sẽ tự động refresh sau " + waitTime / 1000 + " giây.");
        randomTimeoutFn(waitTime, () => {
            window.location.reload(1);
        });
    });
})(jQuery, window, document);