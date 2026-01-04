// ==UserScript==
// @name         自动答题
// @namespace    http://lishengli.xin/autoAnswer
// @version      0.2
// @description  自动答题辅助工具
// @author       Victory
// @license      MIT
// @include      http://222.143.33.184:8080/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      lishengli.xin
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451781/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451781/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

function getURL_GM(url, data='', method='POST') {
    return new Promise(resolve => GM_xmlhttpRequest({
        method,
        url: url,
        data,
        headers: {'HTTP_X_REQUESTED_WITH':'xmlhttprequest'},
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                resolve(response.responseText);
            } else {
                console.error(`Error getting ${url}:`, response.status, response.statusText, response.responseText);
                resolve();
            }
        },
        onerror: function (response) {
            console.error(`Error during GM.xmlHttpRequest to ${url}:`, response.statusText);
            resolve();
        }
    }));
}


(function() {
    //'use strict';

    // Your code here...
    var $ = window.$;
    $(document).on('click', '.uni-swiper-wrapper .cu-bar .action', async function(){
        let question = $(this).text()
        console.log(question)
        if(question){
            let re = await getURL_GM('http://ab.lishengli.xin/home/timu/answer?_ajax=ajax',`question=${question}`)
            console.log(re)
            try{
                if(re){
                    re = JSON.parse(re)
                    $(this).append(`<h4 href="#" class="auto-answer" style="color:${re.code >=0 ? 'green' : 'red'}">${re.msg}</h4>`)
                    setTimeout(()=>{
                        $('.auto-answer').remove()
                    }, 2000)
                }
            }catch{}
        }
    })
})();