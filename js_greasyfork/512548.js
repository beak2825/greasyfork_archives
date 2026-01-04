// ==UserScript==
// @name         刷新政企运营平台
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  刷新政企运营平台，防止掉线
// @author       fankq
// @match        https://tt.unicom.local/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unicom.local
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512548/%E5%88%B7%E6%96%B0%E6%94%BF%E4%BC%81%E8%BF%90%E8%90%A5%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/512548/%E5%88%B7%E6%96%B0%E6%94%BF%E4%BC%81%E8%BF%90%E8%90%A5%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var titles = "首页";
    var timers = null;
    var timers2 = null;
    function initReload(){
        if(timers) {clearTimeout(timers)}
        if(timers2) {clearTimeout(timers2)}
        window.removeEventListener('hashchange', function(){});
        if(location.hash.indexOf('#/home') == 0) {
            let count = sessionStorage.getItem('reloadCount')
            if(!count) {
                sessionStorage.setItem('reloadCount', 1)
                count = 1
            }
            console.log("自动刷新" + count + "次");
            timers = setTimeout(()=>{
                count = parseInt(count) + 1
                sessionStorage.setItem('reloadCount', count)
                location.reload();
            },10 * 60 * 1000);
            timers2 = setTimeout(()=>{
                document.title = titles + "(刷新"+count+"次)";
            },5 * 1000);
        } else{
            console.log("不自动刷新")
            window.addEventListener('hashchange', handleHashChange);
        }
    }

    function handleHashChange(){
        initReload()
    }

    initReload();

    // Your code here...
})();