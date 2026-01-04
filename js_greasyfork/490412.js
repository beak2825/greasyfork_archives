// ==UserScript==
// @name         美团叠加券
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  input输入要抢的点名
// @author       You
// @match        https://offsiteact.meituan.com/web/hoae/collection_waimai_v7/index.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      cacalot123

// @downloadURL https://update.greasyfork.org/scripts/490412/%E7%BE%8E%E5%9B%A2%E5%8F%A0%E5%8A%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/490412/%E7%BE%8E%E5%9B%A2%E5%8F%A0%E5%8A%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
        setTimeout(()=>{
        $('<div style="position:fixed;right:0; top:300px;z-index: 99999;"><input type="text" id="wantName" /><button id="wantNameBotton">自动搜索</button></div>').appendTo('body')
        $("#wantNameBotton").click(()=>{
            const wantName = $('#wantName').val();
            if(!wantName){
                alert('请输入')
                return false
            }
            const dianName = []
            const interval = setInterval(function(){
                $("html, body").animate({ scrollTop: $(document).height() });
                $.each( $('.mb16'),function(index,value){
                    const name = $(value).find('.style_name__3ldZb').html();
                    const $btn = $(value).find('.style_btn__35tv_');
                    console.log('text',name)
                    dianName.push(name)
                    if(name === wantName && $.trim($btn.text()) === '立即领取') {
                     //if(name.includes(wantName) && $.trim($btn.text()) === '立即领取') {
                        console.log('text',$btn.text(),$btn.html())
                        $btn.click()
                        clearInterval(interval)
                        alert('抢券成功')
                    }
                });
            },5000)
        })
    },3000)

    return false


})();