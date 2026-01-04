// ==UserScript==
// @name         识货脚本
// @namespace    https?://tampermonkey.net/
// @version      0.5.4
// @description  丽萨的积分啦积分卡卡收费
// @author       You
// @match        https://life.shihuo.cn/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @run-at document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471251/%E8%AF%86%E8%B4%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/471251/%E8%AF%86%E8%B4%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



(function() {
    'use strict';

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
            var _this = this;

            if(this._url.indexOf('product-detail') !== -1) {
                //console.log('====请求内容===:', this._method, this._url, postData);
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
                                let result = response.data.product_name.replace("王者荣耀", "");
                                result = result.replace("皮肤", "");
                                GM_setClipboard(result + ' ' + response.data.second_number_data.game_zone_name)
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
                            //html3.appendChild(btn3);

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
