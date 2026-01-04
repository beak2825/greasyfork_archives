// ==UserScript==
// @name         广东省教师公需课(推送状态)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto_push
// @author       Hui
// @match        http*://jsxx.gdedu.gov.cn/*/study/course/progess
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pushplus.plus
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/467700/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%28%E6%8E%A8%E9%80%81%E7%8A%B6%E6%80%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467700/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%28%E6%8E%A8%E9%80%81%E7%8A%B6%E6%80%81%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        if(document.querySelector("#top > div > div > div > div > span.name")){
            var push_title=encodeURIComponent("广东省教师公需课")
            var push_name=encodeURIComponent(document.querySelector("#top > div > div > div > div > span.name").innerText)
            var push_content=encodeURIComponent(document.querySelector("#courseLearning > div > ul > li > div.m-bar > p:nth-child(2)").innerText)
            console.log(push_content)
            GM_xmlhttpRequest({
                method: "get",
                url: 'http://www.pushplus.plus/send?token=6802cceb380f416fbc668f10feed04b3&title='+push_title+'&content='+'"'+push_name+'"'+push_content+'&template=html&topic=1',
                data: {
                },
                onload: function(res){
                    // code
                }
            });
        }
    },2000)

    // Your code here...
})();