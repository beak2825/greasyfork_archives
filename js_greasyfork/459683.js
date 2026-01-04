// ==UserScript==
// @name         职业技能培训自动点击
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击播放
// @author       ECarry
// @match        https://yqyc.fjylzbrt.com:8090/px/Pages/CourseVideoPlay.aspx?CID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fjylzbrt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459683/%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/459683/%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
        let btn = document.querySelector("a.layui-layer-btn0")
        if(btn) {
            btn.click()
            console.log('点击继续')
        }else{
            console.log('无需点击')
        }
    }, 10000)
})();