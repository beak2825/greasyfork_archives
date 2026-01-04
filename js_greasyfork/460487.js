// ==UserScript==
// @name         猫站自动认领 2023/2/21修复
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  用户页自动认领所有种子，修复原脚本https://greasyfork.org/zh-CN/scripts/441395-pterclub%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86 停止工作的情况。感谢原脚本作者albao。
// @author       freefrank
// @match        https://pterclub.com/userdetails.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460487/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86%202023221%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/460487/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86%202023221%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var button = document.createElement('button');
    button.id = 'auto-confirm';
    button.textContent = '认领';
    button.style.height = '20px';
    button.style.width = '60px';
    button.style.fontsize = '3px';
    button.onclick = function (){
        var tbl = document.getElementById('ka1');
        var l = tbl.getElementsByClassName('claim-confirm');
        for (var i = 0; i < l.length; i++) {
            var url = 'https://pterclub.com/' + l[i].getAttribute('data-url');
            console.log(url);
            var httpRequest = new XMLHttpRequest(); // Create a new XMLHttpRequest object for each URL
            httpRequest.open('GET', url, true);
            httpRequest.send();
        }
        alert('完成');
        // location.reload();
    }
    var x = document.getElementById('row_current_seeding').parentElement;
    x.prepend(button);
})();