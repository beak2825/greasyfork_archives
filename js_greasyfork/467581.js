// ==UserScript==
// @name         easylearn-anti-mask
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度题库去遮罩，答案立现！
// @author       Sean
// @match        *://easylearn.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467581/easylearn-anti-mask.user.js
// @updateURL https://update.greasyfork.org/scripts/467581/easylearn-anti-mask.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTarget() {
        let doc = null;
        if (doc = document.getElementsByClassName('mask')) {
            return doc;
        }
        return null;
    }


    let sensor = setInterval(()=>{
        if(getTarget()) {
            console.log('===============mask定位成功！===========\n')
            for (let i=0;i<getTarget().length;i++){
                getTarget()[i].style.display = 'none';
            }
    }
    },100);

    setTimeout(()=>{
        console.log('脚本超时');
        window.clearInterval(sensor);
    },5000);
})();