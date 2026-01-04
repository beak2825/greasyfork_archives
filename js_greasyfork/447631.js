// ==UserScript==
// @name         医科点墨继续教育视频自动进入2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  找我另外一个插件，配合其他插件使用，本插件自动进入视频，另外一个插件自动刷视频2(以往学期)
// @author       Coolstuz
// @match        http://www.dianmoyun.com/*
// @match        http://www.dianmoyun.com/StudentInfo/*
// @match        http://www.dianmoyun.com/StudentInfo/kcxx/*
// @include      http://www.dianmoyun.com
// @include      http://www.dianmoyun.com/StudentInfo
// @include      https://www.dianmoyun.com/StudentInfo/kcxx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447631/%E5%8C%BB%E7%A7%91%E7%82%B9%E5%A2%A8%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A52.user.js
// @updateURL https://update.greasyfork.org/scripts/447631/%E5%8C%BB%E7%A7%91%E7%82%B9%E5%A2%A8%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A52.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tpp=document.getElementsByClassName("bcon_ywxq")[0].getElementsByTagName("tbody")[0].children.length;
    var Con=0;
    for(Con;Con<tpp;Con++){
        
        var forapp1=parseInt(document.getElementsByClassName("bcon_ywxq")[0].getElementsByTagName("tbody")[0].children[Con].cells[4].innerText)
        var forapp2=parseInt(document.getElementsByClassName("bcon_ywxq")[0].getElementsByTagName("tbody")[0].children[Con].cells[5].innerText)
        if(document.getElementsByClassName("bcon_ywxq")[0].getElementsByTagName("tbody")[0].children[Con].cells[13].innerText=='继续学习' && (forapp1>forapp2)){
            var timeData={
                appValue1:parseInt(document.getElementsByClassName("bcon_ywxq")[0].getElementsByTagName("tbody")[0].children[Con].cells[4].innerText),
                appValue2:parseInt(document.getElementsByClassName("bcon_ywxq")[0].getElementsByTagName("tbody")[0].children[Con].cells[5].innerText),
            }

            var user = JSON.stringify(timeData);
            document.getElementsByClassName("bcon_ywxq")[0].getElementsByTagName("tbody")[0].children[Con].cells[13].getElementsByTagName("a")[0].click(window.localStorage.setItem('timeData',user))
            /*console.log(user)
            console.log(Con)
            console.log("Click")*/
        }
    }
    // Your code here...
})();