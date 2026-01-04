// ==UserScript==
// @name         无名小站手机版去黄色广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  remove AD
// @author       M&W
// @match        https://m.btnull.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btnull.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445671/%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99%E6%89%8B%E6%9C%BA%E7%89%88%E5%8E%BB%E9%BB%84%E8%89%B2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445671/%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99%E6%89%8B%E6%9C%BA%E7%89%88%E5%8E%BB%E9%BB%84%E8%89%B2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        var arr = document.getElementsByTagName('img');
        for(var i in arr){
            var item = arr[i];
            console.log(item.getAttribute('ck'))
            if(item.getAttribute('ck') != null){
                item.click()
            }
        }
}
})();