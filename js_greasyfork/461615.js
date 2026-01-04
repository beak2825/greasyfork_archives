// ==UserScript==
// @name         Shopdora_price
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Shopdora价格转换
// @author       Movingj
// @include      https://shopee.tw/*
// @include      https://xiapi.xiapibuy.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461615/Shopdora_price.user.js
// @updateURL https://update.greasyfork.org/scripts/461615/Shopdora_price.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery.fn.wait = function (selector, func, times, interval) {
        var _times = times || -1, //100次
            _interval = interval || 20, //20毫秒每次
            _self = this,
            _selector = selector, //选择器
            _iIntervalID; //定时器id
        if( this.length ){ //如果已经获取到了，就直接执行函数
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function() {
                if(!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --

                _self = $(_selector); //再次选择
                if( _self.length ) { //判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    }




    // Your code here...
        document.addEventListener("DOMNodeInserted", function(event){
            var element = event.target;
                if (element.className == 'row shopee-search-item-result__items') {
                    $(".shopee-search-item-result__items")[0].addEventListener("DOMNodeInserted", function(event){

                         $(event.target).wait("[data-sqe='name']+div",function(el){
                             let price_children = $(event.target).find("[data-sqe='name']").next().children()

                             let tw_price,rmb_price = 0

                             if(price_children.length==1){
                                 //单价格
                                 let text = $(event.target).find("[data-sqe='name']").next()[0].innerText
                                 if(text.lastIndexOf("$")==0){
                                     tw_price = $(event.target).find("[data-sqe='name']").next()[0].innerText.replace("$","").replace("," , "")
                                     rmb_price = (Number(tw_price)/5.8).toFixed(2)
                                 }
                                 else{
                                     const tw_price1 = text.substr(1,text.lastIndexOf("$")-3).replace(",","")
                                     const tw_price2 = text.substr( text.lastIndexOf("$")+1 ).replace(",","")
                                     console.log(tw_price1,tw_price2)
                                     rmb_price = (Number(tw_price1)/5.8).toFixed(2) + ' - ' + (Number(tw_price2)/5.8).toFixed(2)
                                 }

                             }

                             //原价 折扣价
                             else if(price_children.length==2){
                                 tw_price = price_children[1].innerText.replace("$","")
                                 rmb_price = (Number(tw_price)/5.8).toFixed(2)
                             }


                             //let tw_price = $(".shopee-search-item-result__item [data-sqe='name']").next() [0].innerText.replace("$","")

                             $($(this).find("[data-sqe='name']").next()).after(`RMB：${rmb_price}`)
                         })



                    })
      
                }
            
        });

})();