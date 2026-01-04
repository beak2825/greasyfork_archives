// ==UserScript==
// @name         Github markdown 公式渲染
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Render equations in markdown with katex.
// @author       flaribbit
// @match        https://github.com/*.md
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/397797/Github%20markdown%20%E5%85%AC%E5%BC%8F%E6%B8%B2%E6%9F%93.user.js
// @updateURL https://update.greasyfork.org/scripts/397797/Github%20markdown%20%E5%85%AC%E5%BC%8F%E6%B8%B2%E6%9F%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("customCSS").replace(/url\(/g,"url(https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/"));
    let convert=function(str){
        let flag=false;
        let strs=str.replace(/\\\n/g,"\\\\").replace(/\\left{/g,"\\left\\{").split("$");
        let out="";
        for(let i=0;i<strs.length;i++){
            if(flag){
                if(!strs[i]){
                    console.log(strs[i+1]);
                    out+="</p>"+katex.renderToString(strs[i+1], {throwOnError: false})+"<p>";
                    i+=2;
                }else{
                    out+=katex.renderToString(strs[i], {throwOnError: false});
                }
            }else{
                out+=strs[i];
            }
            flag=!flag;
        }
        return out;
    }
    let elements=document.querySelectorAll("p");
    for(let i=0;i<elements.length;i++){
        elements[i].innerHTML=convert(elements[i].textContent);
    }
})();