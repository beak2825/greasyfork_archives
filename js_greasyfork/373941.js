// ==UserScript==
// @name         巴哈姆特哈啦區定時桌面通知
// @namespace    巴哈姆特哈啦區定時桌面通知
// @description  透過Notification函數來將通知顯示於右下角的通知欄位
// @author       b20100921
// @match        *forum.gamer.com.tw/*
// @version      2018-11-05 22
// @include       https://www.gamer.com.tw/
// @include       https://www.gamer.com.tw/index*
// @include       https://forum.gamer.com.tw*
// @include       https://forum.gamer.com.tw/
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/373941/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E5%AE%9A%E6%99%82%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/373941/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E5%AE%9A%E6%99%82%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==
function getNotP() { //第一取得權限
    if (!('Notification' in window)) {
        console.log('This browser does not support notification');
    }
    if (Notification.permission === 'default' || Notification.permission === 'undefined') {
        Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
                var notification = new Notification('開啟通知!');
            }
        });
    }
}


function CatchM() { //第二抓取通知
        if (document.hasFocus() === false) {
        TOPBAR_show('light_0', 'topb1');
        console.log('close');
        Sdm();
    }

}
function Sdm() { //第三送通知
		console.log('close');
        for (var MgItems = 0; MgItems < document.getElementsByClassName('new').length; MgItems++) {
            var notify = new Notification("通知", {
                body: document.getElementsByClassName('new')[MgItems].innerText,
                icon: 'https://avatar2.bahamut.com.tw/avataruserpic/b/2/b20100921/b20100921.png'
            });

        }

}
getNotP();


setTimeout(function() {
    CatchM();
}, 60000);
setTimeout(function() {
    Sdm();
}, 61000);
