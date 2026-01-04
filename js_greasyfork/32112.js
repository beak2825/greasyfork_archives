// ==UserScript==
// @name         爱创导购文收藏助手
// @namespace    https://aiwriting.io/
// @version      0.1
// @description  保存商品详细页内容到爱创
// @author       羽衣尘
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/*
// @match        https://item.jd.com/*
// @connect      aiwriting.io
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/32112/%E7%88%B1%E5%88%9B%E5%AF%BC%E8%B4%AD%E6%96%87%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/32112/%E7%88%B1%E5%88%9B%E5%AF%BC%E8%B4%AD%E6%96%87%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var siteIndex=[
        'item.taobao.com',
        'detail.tmall.com',
        'item.jd.com'
    ].indexOf(location.hostname);

    switch(siteIndex){
            //taobao
        case 0:
            taobaoItemFun();
            break;
            //Tmall
        case 1:
            tmallItemFun();
            break;
            //JD
        case 2:
            jdItemFun();
            break;
    }
    function taobaoItemFun() {
        document.querySelector(".tb-action").innerHTML +=('<div class="tb-btn-buy"><a href="javascript:;" id="saveToAichuang" style="margin-top:10px;background-color:#00aaff;border-color:#00aaff;color:#fff;">保存到爱创</a></div>');
        document.querySelector('#saveToAichuang').onclick=saveItem;
    }
    function tmallItemFun() {
        document.querySelector(".tb-action").innerHTML +=('<div class="tb-btn-basket tb-btn-sku "><a href="javascript:;" id="saveToAichuang" class="btn-special3 btn-lg" style="margin-top:10px;background-color:#00aaff;border-color:#00aaff;color:#fff;">保存到爱创</a></div>');
        document.querySelector('#saveToAichuang').onclick=saveItem;
    }
    function jdItemFun() {
        document.querySelector("#choose-btns").innerHTML +=('<a href="javascript:;" id="saveToAichuang" class="btn-special3 btn-lg" style="background-color:#00aaff;border-color:#00aaff;color:#fff;">保存到爱创</a>');
        document.querySelector('#saveToAichuang').onclick=saveItem;

    }
    function saveItem(){
        var btn = this;
        if(btn.getAttribute('disabled')){
            return false;
        }
        btn.setAttribute('disabled',true);
        btn.innerText='保存中...';
        GM_xmlhttpRequest({
            method:'POST',
            url:'https://test.aiwriting.io/api/collect/page',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            // data:{
            //     url:location.href,
            //     html:document.getElementsByTagName('html')[0].innerHTML
            // },
            data:'url='+encodeURIComponent(location.href)+'&html='+encodeURIComponent(document.getElementsByTagName('html')[0].innerHTML),
            responseType :'json',
            timeout:10000,
            onload:function(xhr){
                btn.removeAttribute('disabled');
                if(xhr.readyState==4 && xhr.status==200){
                    if(xhr.response.status=="success"){
                        btn.innerText='已保存到爱创';
                    }else{
                        btn.innerText='保存到爱创';
                        alert(xhr.response.message);
                    }
                }else{
                    btn.innerText='保存到爱创';
                }
            },
            ontimeout:function(){
                alert('请求超时');
                btn.removeAttribute('disabled');
            },
            onerror:function(error){
                alert('请求出错');
                btn.removeAttribute('disabled');
            }
        });
    }
    /**
   * 保存链接
   * @param  {[type]}   myUrl [链接地址]
   * @param  {Function} cb    [回调]
   * @return {[type]}         [description]
   */
    function saveUrl(myUrl,cb){
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

        var encodedUrl = Base64.encode(myUrl);
        // $.ajax({
        //     async:false,//必须为同步方式,否则onMessage中的sendResponse无法发送数据
        //     url: 'https://aiwriting.io/material/json/import/page/url?url=' + encodedUrl,
        //     type: 'get',
        //     success: function(res) {
        //         cb && cb(res);
        //     }
        // });
        GM_xmlhttpRequest({
            method:'GET',
            url:'https://aiwriting.io/material/json/import/page/url?url='+ encodedUrl,
            onload:function(response){
                console.log(response);
            },
            onerror:function(error){
                return false;
            }
        });
    }

})();