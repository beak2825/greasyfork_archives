// ==UserScript==
// @name         熊孩子学习助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将游戏网页强制跳转到学习页面
// @author       cool lei, jiajun
// @match        *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/438122/%E7%86%8A%E5%AD%A9%E5%AD%90%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438122/%E7%86%8A%E5%AD%A9%E5%AD%90%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    // 获取当前URL
    var currentUrl = window.location.href;
    var url = [
        "http://www.jtyhjy.com/edu/home_index.action",
        "https://www.baobaoxuexi.com/",
    ];

    //跳转到学习页面
    function gotoStudyWeb(){
        var googleHelpUrl = {
            url:[
                "http://www.4399.com/",
                "http://www.7k7k.com",
            ]
        };
        for(let i=0;i<googleHelpUrl.url.length;i++){
            if(currentUrl.indexOf(googleHelpUrl.url[i])!==-1){
                window.location.href = url[Math.floor(Math.random() * url.length)];
                return;
            }
        }
    }
    gotoStudyWeb();
})();