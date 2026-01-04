// ==UserScript==
// @name         hover translate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  hover over text to translate it
// @author       naturaldesire
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530433/hover%20translate.user.js
// @updateURL https://update.greasyfork.org/scripts/530433/hover%20translate.meta.js
// ==/UserScript==

(function(){let e=document.createElement("div");e.className="hover-translate-box",document.body.appendChild(e),GM_addStyle(".hover-translate-box{position:absolute;background:rgba(0,0,0,.8);color:#fff;padding:5px 10px;border-radius:5px;font-size:14px;max-width:250px;z-index:9999;pointer-events:none;white-space:pre-wrap}"),document.addEventListener("mouseover",async t=>{let o=window.getSelection().toString().trim()||t.target.innerText.trim();if(!o||o.length>100)return;let n=await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q="+encodeURIComponent(o)),a=await n.json(),l=a[0]?.map(e=>e[0]).join(" ")||"Translation error";e.innerText=l,e.style.top=t.pageY+15+"px",e.style.left=t.pageX+15+"px",e.style.display="block"}),document.addEventListener("mouseout",()=>{e.style.display="none"})})();
