// ==UserScript==
// @name         TSDM Checkin
// @namespace    https://www.tsdm.live
// @match *://www.tsdm.live/*
// @version      0.1.1
// @description  TSDM auto check in
// @author       WeiYuanStudio
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/394622/TSDM%20Checkin.user.js
// @updateURL https://update.greasyfork.org/scripts/394622/TSDM%20Checkin.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    window.clickAd = function clickAd() {
        window.jq.post('plugin.php?id=np_cliworkdz:work', {
            act: 'clickad'
        });
    }
    window.clickGetCre = function clickGetCre() {
        window.jq.post('plugin.php?id=np_cliworkdz:work', {
            act: 'getcre'
        });
    }

    window.daGong = function daGong() {
        for (let i = 1; i <= 6; i++) {
            setTimeout(function() {
                window.clickAd();
                console.log('点击广告' + i + '次');
            },1000 * i);
        }
        setTimeout(function () {
            console.log('请求积分');
            window.clickGetCre();
        }, 10000);
    }

    function main() {
        console.log('注入面板')
        let dagong_btn = document.createElement('button'); //打工按钮
        dagong_btn.setAttribute('onclick', 'daGong()');
        dagong_btn.setAttribute('style', 'font-size: 2em; color: #39c5bb; border-radius: 8px;  border: solid 2px; margin: auto;');
        dagong_btn.innerText = '自动打工';
        let user_panel = document.getElementById('um');
        try {
            user_panel.appendChild(dagong_btn);
            console.log('面板注入成功');
        } catch (e) {
            console.log('面板注入失败');
            console.log(e);
        }
    }
    main();
})();
