// ==UserScript==
// @name         jetBrains
// @namespace    https://www.ddkk.com/zhuanlan/
// @version      2025-03-04
// @description  JetBrains全家桶激活-跳过公众号[网址:https://www.ddkk.com/zhuanlan/jihuo/]
// @author       You
// @match        https://www.ddkk.com/zhuanlan/jihuo/**
// @icon         https://www.ddkk.com/favicon.ico
// @grant        none
// @license aa
// @downloadURL https://update.greasyfork.org/scripts/532906/jetBrains.user.js
// @updateURL https://update.greasyfork.org/scripts/532906/jetBrains.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function deepDon(){
        console.log(document.querySelector('body > div > main > div.row-content'))
        if(document.querySelector('body > div > main > div.row-content')){
            document.querySelector('body > div > main > div.row-content').style = ''
        }else {
            setTimeout(deepDon,300)
        }
    }
    deepDon()
    // Your code here...
})();