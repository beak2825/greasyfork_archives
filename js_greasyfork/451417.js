// ==UserScript==
// @name         屏蔽B站话题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  disable bilibili's side topic
// @author       You
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451417/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451417/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var i = setInterval(function(){
        checkTopic();
    }, 1000);
    function checkTopic() {
        var collection = document.getElementsByClassName("topic-panel");
        if(collection.length!=0) {
            collection[0].remove();
            clearInterval(i);
        }
    }
})();