// ==UserScript==
// @name         火猫TV自动领仙豆
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  用于火猫TV自动领仙豆
// @author       Dash Chen
// @match        https://www.huomao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28675/%E7%81%AB%E7%8C%ABTV%E8%87%AA%E5%8A%A8%E9%A2%86%E4%BB%99%E8%B1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/28675/%E7%81%AB%E7%8C%ABTV%E8%87%AA%E5%8A%A8%E9%A2%86%E4%BB%99%E8%B1%86.meta.js
// ==/UserScript==

window.setInterval(function() {
    var node = document.getElementById("getxd");
    var time = node.children[1].textContent;
    if (time === '') {
        //node.click();
        //console.log('node');
        document.getElementsByClassName('okby')[0].click();
        //console.log('dou'+i);
        //document.getElementsByClassName('confirm-button')[0].click();
        //console.log('btn');
    }
}, 1000);
