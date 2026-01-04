// ==UserScript==
// @name         Fuck Network Admission System Detection
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Skip the device information detection of a certain network admission system
// @author       Null
// @match        http://1.1.1.3/sinstall/sinstall.htm*
// @icon         https://s21.ax1x.com/2024/12/05/pAoz328.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519915/Fuck%20Network%20Admission%20System%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/519915/Fuck%20Network%20Admission%20System%20Detection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var uaList = [
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; DT2002C; Build/RKQ1.201217.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.4280.141 Mobile Safari/537.36 Firefox-KiToBrowser/124.0",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; HLK-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Mobile Safari/537.36 EdgA/104.0.1293.70",
        "Mozilla/5.0 (Linux; Android 8.1.0; Pixel C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.116 Safari/537.36 EdgA/46.03.4.5155",
        "Mozilla/5.0 (Linux; Android 10; ONEPLUS A6003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36 EdgA/46.3.4.5155",
        "Mozilla/5.0 (Android 10; Mobile; rv:127.0) Gecko/127.0 Firefox/127.0",
        "Mozilla/5.0 (Android 8.1.0; Mobile; rv:127.0) Gecko/127.0 Firefox/127.0",
        "Mozilla/5.0 (Linux; Android 9; SM-G9600) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36  uacq",
        "Mozilla/5.0 (Linux; Android 13; 2203121C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; SM-J720F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36"
    ]

    // Hook init Function
    window.init = function () {
        console.log('Executing modified code below');
        debugger
        var timeStamp = String(new Date().valueOf());
        const randomIndex = Math.floor(Math.random() * uaList.length);
        $.ajax({
            url: '/terminal_info',
            type: 'POST',
            dataType: "json",
            timeout: 5000,
            data: {
                tag: timeStamp,
                userAgent: do_encrypt_rc4(uaList[randomIndex], timeStamp),
                platform: do_encrypt_rc4('Android', timeStamp),
            },
            contentType: "application/x-www-form-urlencoded",
            complete: function (resp) {
                var json = resp.responseJSON;
                if (json && json.success === false) {
                    start();
                } else {
                    window.location = 'http://' + getUrlParam('url');
                }
            }
        });
    };

    setTimeout(() => {
        window.init()
    }, 2000)
})();