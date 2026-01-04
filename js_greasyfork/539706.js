// ==UserScript==
// @name         B站分享链接净化器 - 保留时间戳与分P (Bilibili URL Cleaner)
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  自动清理B站视频链接中的追踪参数，只保留时间戳(t)和分P(p)参数。
// @author       BiBiCi
// @icon https://www.bilibili.com/favicon.ico
// @match        *://www.bilibili.com/video/BV*
// @match        *://*.bilibili.com/video/av*
// @match        *://*.bilibili.com/v/topic/detail/*
// @match        *://m.bilibili.com/video/*
// @match        *://www.bilibili.com/list/*
// @license MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539706/B%E7%AB%99%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8%20-%20%E4%BF%9D%E7%95%99%E6%97%B6%E9%97%B4%E6%88%B3%E4%B8%8E%E5%88%86P%20%28Bilibili%20URL%20Cleaner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539706/B%E7%AB%99%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8%20-%20%E4%BF%9D%E7%95%99%E6%97%B6%E9%97%B4%E6%88%B3%E4%B8%8E%E5%88%86P%20%28Bilibili%20URL%20Cleaner%29.meta.js
// ==/UserScript==
(function(){if(!navigator.clipboard||typeof navigator.clipboard.writeText!=='function')return;const o=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async t=>{const i=String(t),r=/(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/gi;let p="",l=0,m;r.lastIndex=0;while((m=r.exec(i))!==null){const u=m[0];p+=i.slice(l,m.index);let j;try{j=new URL(u)}catch(e){p+=u;l=r.lastIndex;continue}if(j.hostname==="www.bilibili.com"&&j.pathname.startsWith("/video/")){const d=j.pathname.match(/^\/video\/(BV[a-zA-Z0-9_]+|av\d+)/i),v=d?d[1]:null;if(v){const s=new URLSearchParams(j.search);let k=[];s.has("p")&&k.push(`p=${s.get("p")}`);s.has("t")&&k.push(`t=${s.get("t")}`);p+=k.length===0?`https://www.bilibili.com/video/${v}`:`https://www.bilibili.com/video/${v}?${k.join("&")}`}else p+=u}else p+=u;l=r.lastIndex}p+=i.slice(l);await o(p)}})();