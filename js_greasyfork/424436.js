// ==UserScript==
// @name         中国语文自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  处于学习资料界面时，5-11分钟自动刷新一次
// @author       Blurryface
// @match        http://59.69.102.9/zgyw/study/LearningIndex.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424436/%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/424436/%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //setInterval(function() {document.location.reload()},1000*60*10)
    let time=randomTime(1000*60*5,1000*60*11)
    function randomTime(start,end){
        return Math.round(Math.random()*(end-start)+start)
    }

    setTimeout(()=>{
        location.reload()
    },time);
})();