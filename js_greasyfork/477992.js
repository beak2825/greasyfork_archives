
// ==UserScript==
// @name         得物脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  丽萨
// @author       You
// @match        https://stark.dewu.com/*
// @require  http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477992/%E5%BE%97%E7%89%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/477992/%E5%BE%97%E7%89%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
//- The @grant directives are needed to restore the proper sandbox.
/* global $, waitForKeyElements */

console.log("开始得物脚本")

waitForKeyElements (".left___BoSXM", clickNode, true);

function clickNode (jNode) {
    console.log("开始创建按钮")
    var html = document.querySelector(".left___BoSXM");
    var btn = document.createElement("button");
    //btn.style.cssText("position=absolute;left=270px;height=28px;line-height=0px");

    console.log('dewu_status:' + GM_getValue("dewu_status"));

    if (GM_getValue("dewu_status") && GM_getValue("dewu_status") === true){
        btn.innerHTML = `监控中`;
        btn.className= `ant-btn ant-btn-danger`
    } else {
       btn.innerHTML = `打开监控`;
       btn.className= `ant-btn ant-btn-info`
    }

    btn.addEventListener("click", function() {
            console.log('dewu_status222:' + GM_getValue("dewu_status"));

        if (GM_getValue("dewu_status") && GM_getValue("dewu_status") === true) {
            GM_setValue("dewu_status", false);
            btn.innerHTML = `打开监控`;
            btn.className= `ant-btn ant-btn-info`
        } else {
            req();
            GM_setValue("dewu_status", true);
            btn.innerHTML = `监控中`;
            btn.className= `ant-btn ant-btn-danger`
        }
    })
    html.insertBefore(btn, html.img);
}

monitor()
function monitor()
{
    setInterval(() => {
        setTimeout(() => {
            if(GM_getValue("dewu_status") && GM_getValue("dewu_status") === true){
                console.log("发起一次请求")
                req()
            }
        }, 0)
    },30*1000)
}


function req()
{
    var header = GM_getValue("dewu_header");
    GM_xmlhttpRequest({
        method: "post",
        url: "https://stark.dewu.com/api/v1/h5/trade/orders/list",
        headers:header,
        data:'{"pageNum":1,"pageSize":20,"queryFlag":0,"businessType":1,"status":11,"bizType":null,"addressId":null,"warehouseCode":null,"markColor":null,"ticketFulfillMode":0,"orderTag":null,"canDelivery":null,"createTimeStart":null,"createTimeEnd":null,"sign":"81938cdd4338be379e804be8f0c8e6df"}',
        onload: function(response){
            var lists=response.responseText;
            lists=JSON.parse(lists);
            lists = lists.data
            var contents = lists.contents
            console.log("请求成功");
            console.log(lists);
            if (lists.total !== 0) {
                 notice();
            }
        },
        onerror: function(response){
            console.log("请求失败");
        }
    });
}

function notice()
{
    var player = document.createElement('audio');
    player.src = 'https://static.shihuocdn.cn/admin/files/20220316/7c6211c731fa0235dbee844560a0db4e.mp3';
    player.preload = 'auto';
    player.play()
}

(function() {
    'use strict';




const originFetch = fetch;
unsafeWindow.fetch = (...arg) => {
    if (arg[0] == '/api/v1/h5/trade/orders/list') {
        var res = arg[1];
        GM_setValue("dewu_header", res.headers);
    }
    return originFetch(...arg);
}


/**/

    (function (xhr) {
        var XHR = XMLHttpRequest.prototype;
        var open = XHR.open;
        var send = XHR.send;
        XHR.open = function (method, url) {
            this._method = method;
            this._url = url;
            return open.apply(this, arguments);
        };
        XHR.send = function (postData) {


            //console.log("%c ==============请求内容=========:", this._method, this._url, postData);



            var _this = this;
            if(this._url.indexOf('/api/v1/h5/trade/orders/list') !== -1) {
                console.info('====请求内容===:', this._method, this._url, postData);
            }

            this.addEventListener('load', function () {
                // sessionStorage['key'] = JSON.stringify(response); // 插件需要添加'storage'权限
                // document.cookie
                // localStorage['key']
                // window.postMessage({ type: 'xhr', data: this.response }, '*');  // 将响应发送到 content script


                if(_this._url.indexOf('product-detail') !== -1) {
                    //console.log('====返回内容===:', this.response);
                    var response = JSON.parse(this.response);
                        setTimeout(function() {

document.querySelector("body > div.next-icestark-overlay-wrapper.opened > div.next-icestark-dialog.next-icestark-closeable.next-icestark-overlay-inner").style.width = '800px';


                            var html = document.querySelector("body > div.next-icestark-overlay-wrapper.opened > div.next-icestark-dialog.next-icestark-closeable.next-icestark-overlay-inner > div.next-icestark-dialog-body > form > div:nth-child(3) > div.next-icestark-col.next-icestark-form-item-control > div");
                            var btn = document.createElement("button");
                            btn.innerHTML = `复制`;
                            btn.className= `next-icestark-btn next-icestark-small next-icestark-btn-secondary`
                            btn.addEventListener("click", function() {
                                GM_setClipboard(response.data.product_name.substring(6))
                            })
                            html.appendChild(btn);



                            var html2 = document.querySelector("body > div.next-icestark-overlay-wrapper.opened > div.next-icestark-dialog.next-icestark-closeable.next-icestark-overlay-inner > div.next-icestark-dialog-body > form > div:nth-child(5) > div.next-icestark-col.next-icestark-form-item-control > img");
                            //var btn2 = document.createElement("button");
                            //btn2.innerHTML = `复制图片`;
                            //btn2.className= `next-icestark-btn next-icestark-small next-icestark-btn-secondary`
                            html2.style.width="600px";
                            html2.style.height="";
                            html2.addEventListener("click", function() {
                                GM_openInTab(response.data.game_user_proof[0].url,{ active: true, setParent :true})
                            })



                            var html3 = document.querySelector("body > div.next-icestark-overlay-wrapper.opened > div.next-icestark-dialog.next-icestark-closeable.next-icestark-overlay-inner > div.next-icestark-dialog-body > form > div:nth-child(6) > div > div:nth-child(1) > div.next-icestark-col.next-icestark-form-item-control > div");
                            var btn3 = document.createElement("button");
                            btn3.innerHTML = `复制`;
                            btn3.className= `next-icestark-btn next-icestark-small next-icestark-btn-secondary`
                            btn3.addEventListener("click", function() {
                                GM_setClipboard(response.data.second_number_data.game_zone_name)
                            })
                            html3.appendChild(btn3);

                        }, 500);


                }

            });
            return send.apply(this, arguments);

        };
    })(XMLHttpRequest);

 /**
    setTimeout(function() {
        btn.onclick = function () {
            var url = 'https://sh-gateway.shihuo.cn/v4/services/sh-lifeserviceadmin/shop/product/supply?status=0&page=1&page_limit=20';
            var xml = new XMLHttpRequest();
            xml.open("GET", url);
            xml.withCredentials = true;
            xml.send();
            xml.onload = e => {
                var response = JSON.parse(e.currentTarget.response);
                console.log("================================");
                console.log(response);

                var lists = response.data.data;
                lists.map(function(item){
                    if(item.consult_offer < item.msrp_price){
                        console.log(item.product_name);
                    }
                })

            }
        };
    }, 1000);

**/


})();
