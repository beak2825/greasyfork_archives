// ==UserScript==
// @name         V2EX base64 decode
// @namespace    https://github.com/bjzhou/v2ex-base64-decoder
// @version      0.5.1
// @description  base64自动解析
// @author       Hinnka
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462230/V2EX%20base64%20decode.user.js
// @updateURL https://update.greasyfork.org/scripts/462230/V2EX%20base64%20decode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //base64
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):function(){const r=e.Base64,n=t();n.noConflict=(()=>(e.Base64=r,n)),e.Meteor&&(Base64=n),e.Base64=n}()}("undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:this,function(){"use strict";const e="function"==typeof atob,t="function"==typeof btoa,r="function"==typeof Buffer,n=[..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="],o=(e=>{let t={};return n.forEach((e,r)=>t[e]=r),t})(),a=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,f=String.fromCharCode.bind(String),i="function"==typeof Uint8Array.from?Uint8Array.from.bind(Uint8Array):(e,t=(e=>e))=>new Uint8Array(Array.prototype.slice.call(e,0).map(t)),c=e=>e.replace(/[+\/]/g,e=>"+"==e?"-":"_").replace(/=+$/m,""),u=e=>e.replace(/[^A-Za-z0-9\+\/]/g,""),s=e=>{let t,r,o,a,f="";const i=e.length%3;for(let i=0;i<e.length;){if((r=e.charCodeAt(i++))>255||(o=e.charCodeAt(i++))>255||(a=e.charCodeAt(i++))>255)throw new TypeError("invalid character found");f+=n[(t=r<<16|o<<8|a)>>18&63]+n[t>>12&63]+n[t>>6&63]+n[63&t]}return i?f.slice(0,i-3)+"===".substring(i):f},l=t?e=>btoa(e):r?e=>Buffer.from(e,"binary").toString("base64"):s,d=r?e=>Buffer.from(e).toString("base64"):e=>{let t=[];for(let r=0,n=e.length;r<n;r+=4096)t.push(f.apply(null,e.subarray(r,r+4096)));return l(t.join(""))},p=(e,t=!1)=>t?c(d(e)):d(e),y=e=>unescape(encodeURIComponent(e)),b=r?e=>Buffer.from(e,"utf8").toString("base64"):e=>l(y(e)),h=(e,t=!1)=>t?c(b(e)):b(e),B=e=>h(e,!0),g=e=>decodeURIComponent(escape(e)),m=e=>{if(e=e.replace(/\s+/g,""),!a.test(e))throw new TypeError("malformed base64.");e+="==".slice(2-(3&e.length));let t,r,n,i="";for(let a=0;a<e.length;)t=o[e.charAt(a++)]<<18|o[e.charAt(a++)]<<12|(r=o[e.charAt(a++)])<<6|(n=o[e.charAt(a++)]),i+=64===r?f(t>>16&255):64===n?f(t>>16&255,t>>8&255):f(t>>16&255,t>>8&255,255&t);return i},A=e?e=>atob(u(e)):r?e=>Buffer.from(e,"base64").toString("binary"):m,U=r?e=>Buffer.from(e,"base64").toString("utf8"):e=>g(A(e)),w=e=>u(e.replace(/[-_]/g,e=>"-"==e?"+":"/")),S=e=>U(w(e)),C=r?e=>i(Buffer.from(w(e),"base64")):e=>i(A(w(e)),e=>e.charCodeAt(0)),R=e=>({value:e,enumerable:!1,writable:!0,configurable:!0}),I=function(){const e=(e,t)=>Object.defineProperty(String.prototype,e,R(t));e("fromBase64",function(){return S(this)}),e("toBase64",function(e){return h(this,e)}),e("toBase64URI",function(){return h(this,!0)}),e("toBase64URL",function(){return h(this,!0)}),e("toUint8Array",function(){return C(this)})},j=function(){const e=(e,t)=>Object.defineProperty(Uint8Array.prototype,e,R(t));e("toBase64",function(e){return p(this,e)}),e("toBase64URI",function(){return p(this,!0)}),e("toBase64URL",function(){return p(this,!0)})},x={version:"3.4.5",VERSION:"3.4.5",atob:A,atobPolyfill:m,btoa:l,btoaPolyfill:s,fromBase64:S,toBase64:h,encode:h,encodeURI:B,encodeURL:B,utob:y,btou:g,decode:S,fromUint8Array:p,toUint8Array:C,extendString:I,extendUint8Array:j,extendBuiltins:()=>{I(),j()},Base64:{}};return Object.keys(x).forEach(e=>x.Base64[e]=x[e]),x});

    var blacklist = ["bilibili", "Bilibili", "MyTomato", "InDesign", "Encrypto", "encrypto", "Window10", "USERNAME", "airpords", "Windows7"];

    var reg = /[A-z0-9+/=]+/g

    var replaceContent = function(el) {
        var innerLinkTexts = Array.from(el.getElementsByTagName("a")).map(item => item.innerText);
        el.innerHTML = el.innerHTML.replace(reg, function(str) {
            if (str.length % 4 !== 0 || str.length < 8) {
                return str;
            }
            for (var text of innerLinkTexts) {
                if (text.includes(str)) {
                    return str;
                }
            }
            if (blacklist.includes(str)) {
                return str;
            }
            try {
                return `${str}<span style="color:#EE6F2D"><xmp style="display:inline;white-space:pre-wrap;word-wrap:break-word;">(${unescape(Base64.decode(str).replace(/\r?\n?/g, '').trim())})</xmp></span>`;
            } catch (error) {
                return str;
            }
        })
    }

    var topicContent = document.getElementsByClassName("topic_content")[0];
    if (topicContent) {
        replaceContent(topicContent);
    }
    var replyContent = document.getElementsByClassName("reply_content");
    if (replyContent) {
        for (var i = 0; i < replyContent.length; i++) {
            replaceContent(replyContent[i])
        }
    }

    var replyTextArea = document.getElementById("reply_content");
    if (replyTextArea) {
        var form = replyTextArea.parentElement;
        if (form) {
            var base64ReplyFunc = function() {
                replyTextArea.value = Base64.encode(replyTextArea.value);
                form.submit();
                // alert(replyTextArea.value);
            };
            form.insertAdjacentHTML("beforeend", '<input type="button" id="base64Reply" value="base64回复" class="super normal button" style="margin-left: 10px"></input>');
            var base64Reply = document.getElementById("base64Reply");
            if(base64Reply) {
                base64Reply.onclick = base64ReplyFunc;
            }
        }
    }
})();
