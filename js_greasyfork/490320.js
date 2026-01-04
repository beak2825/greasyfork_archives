// ==UserScript==
// @name         美团返现
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  抢美团自动返现
// @author       chris.f
// @match        https://offsiteact.meituan.com/web/hoae/order_cashback_activity/index.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      cacalot123

// @downloadURL https://update.greasyfork.org/scripts/490320/%E7%BE%8E%E5%9B%A2%E8%BF%94%E7%8E%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490320/%E7%BE%8E%E5%9B%A2%E8%BF%94%E7%8E%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const wantName = '德蕓坊·北京烤鸭(张江旗舰店)'
    const dianName = []
    const interval = setInterval(function(){
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    },2000)
    setTimeout(function(){
        $.each( $('.poi-list-item'),function(index,value){
            const name = $(value).find('.poi-name').html();
            const $btn = $(value).find('.cash-back-not-order-btn');
                 console.log('text',name)
                 dianName.push(name)
            if(name === wantName && $btn.text() === '报名下单') {
                 console.log('text',$btn.text(),$btn.html())
                $btn.click()
            }
        });
    },10000)
     setTimeout(function(){
         console.log('dianName',dianName.join(','))
         clearInterval(interval)
     }, 11000)

     setTimeout(()=>{
       location.reload();
     },15000)
    // Your code here...
})();