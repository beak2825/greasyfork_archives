// ==UserScript==
// @license      MIT
// @name         aemobile
// @namespace    https://maposcan.io/
// @version      0.1.3
// @description  用于查看https://maposcan.io/网站转账信息
// @author       yaoboqin
// @match        https://maposcan.io/tx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maposcan.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468546/aemobile.user.js
// @updateURL https://update.greasyfork.org/scripts/468546/aemobile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var time
    document.getElementsByClassName('page-title mantine-et4l4o')[0].innerText = 'Transaction Details(查询中...)'
    function check() {
        var address = document.getElementsByClassName('mantine-10bskoa');
        if (address[0]) {
            clearTimeout(time)
            var from = address[0].textContent;
            var to = address[1].textContent;
            if (!to && !from) {
                time = setTimeout(() => {
                    check();
                }, 100)
                return
            }
            if (to === '0xf2072ce95f717e73b314ce4783041c89cf087c8d') {
                document.getElementsByClassName('mantine-1iy1luo')[2].append('AE-GAME账户')
            } else {
                document.getElementsByClassName('mantine-1iy1luo')[2].append('未知账户')
            }
            document.getElementsByClassName('page-title mantine-et4l4o')[0].innerText = 'Transaction Details(查询结束)'
        } else {
            time = setTimeout(() => {
                check();
            }, 100)
        }
    }
    if (/(maposcan.io\/tx.*)/g.test(window.location.href)) {
        check();
    }

    // Your code here...
})();