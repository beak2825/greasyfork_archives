// ==UserScript==
// @name         猫站一键认领
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  做种页面快速认领种子
// @author       benz1
// @match        *://pterclub.com/getusertorrentlist.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475786/%E7%8C%AB%E7%AB%99%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/475786/%E7%8C%AB%E7%AB%99%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement('button');
    button.type = "button";
    button.textContent = '一键认领';
    button.onclick = function (){
        var httpRequest = new XMLHttpRequest();
        var l = document.getElementsByClassName('claim-confirm');
        for (var i = 0; i < l.length; i++) {
            var url = 'https://pterclub.com/' + l[i].getAttribute('data-url');
            httpRequest.open('GET', url, true);
            httpRequest.send();
        }
        alert('完成');
        location.reload();
    }
    var x = document.querySelector('b[title="Alt+Pagedown"]').parentElement;
    x.after(button);
})();