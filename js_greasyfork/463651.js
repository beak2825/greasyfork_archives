// ==UserScript==
// @name         百度题库删除蒙版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除百度题库蒙版
// @author       Pikaqian
// @match        https://easylearn.baidu.com/edu-page/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463651/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E5%88%A0%E9%99%A4%E8%92%99%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/463651/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E5%88%A0%E9%99%A4%E8%92%99%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload=function(){
        var a=setInterval(function(){
            console.log('a')
            if(document.getElementsByClassName('mask').length!=0){
                document.getElementsByClassName('mask')[0].remove()
                clearInterval(a)
            }
        },100)
        }
})();