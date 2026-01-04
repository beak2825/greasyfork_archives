// ==UserScript==
// @name         智联抓取脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       winter木风
// @match        https://sou.zhaopin.com/*
// @grant        none
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/403994/%E6%99%BA%E8%81%94%E6%8A%93%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/403994/%E6%99%BA%E8%81%94%E6%8A%93%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    var lastUrl='';
    var first='';
    var waitTime=0;

    var divs = $(".contentpile__content__wrapper__item");
    var timer = setInterval(()=> {
        waitTime+=100;
        var currentUrl=location.href;
        if (divs.length > 0&&currentUrl!=lastUrl && divs.get(0)!=first) {
            lastUrl=currentUrl;
            first=divs.get(0);
            sendData($("#listContent").html());
            waitTime=0;
            var next=$("#pagination_content > div > button.soupager__btn:not(.soupager__btn--disable):not(.soupager__btn__before)");
            if(next.length>0){
                //滚动到底部翻页
                var t =document.body.clientHeight;
                window.scroll({top:t,left:0,behavior:'smooth' });
                //点击下一页
                $(next.get(0)).click();
            }
        }else{
            divs = $(".contentpile__content__wrapper__item");
        }
    }, 100);

//发送数据到后端接口,由后端接口处理
    function sendData(html) {
        $.ajax({
            'type':'post',
            'url':'http://localhost:8080/job/receive',
            'contentType':'content-type/text-plain',
            'data':html,
            'async':false,
            'success':function(data){
                console.log('push result :'+data)
            },
            'error':function (e) {
                alert(e);
            }
        });
    }

})();