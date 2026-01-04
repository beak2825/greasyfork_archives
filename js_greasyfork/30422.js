// ==UserScript==
// @name         去除电信运营商劫持广告
// @namespace    hoothin
// @version      1.1
// @description  去除中国电信等运营商的劫持内嵌广告
// @author       hoothin
// @include      http://*/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/30422/%E5%8E%BB%E9%99%A4%E7%94%B5%E4%BF%A1%E8%BF%90%E8%90%A5%E5%95%86%E5%8A%AB%E6%8C%81%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/30422/%E5%8E%BB%E9%99%A4%E7%94%B5%E4%BF%A1%E8%BF%90%E8%90%A5%E5%95%86%E5%8A%AB%E6%8C%81%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //if(/zf\.tx\(\)|a7\.u\(\)/.test(document.body.getAttribute("onload")))location.reload();
    document.body.addEventListener("DOMSubtreeModified", function() {
        [].every.call(document.querySelectorAll("iframe"),function(i){
            if(i.src.indexOf(location.href)===0 && i.src.replace(location.href,"").indexOf("?")===0 && /\./.test(document.body.getAttribute("onload")) && !document.title){
                console.info("检测到劫持广告！");
                //alert("检测到劫持广告！");
                var ad=document.querySelector("iframe#a");
                if(ad)ad.parentNode.removeChild(ad);
                var check=function(){
                    var doc=i.contentDocument || i.contentWindow.document;
                    if(doc){
                        if(document.readyState == 'complete') {
                            try{
                                document.querySelector("html").innerHTML=doc.querySelector("html").innerHTML;
                            }catch(e){
                                location.reload();
                            }
                        }else{
                            doc.addEventListener("DOMContentLoaded",function(){
                                doc.removeEventListener('DOMContentLoaded',arguments.callee,false);
                                try{
                                    document.querySelector("html").innerHTML=doc.querySelector("html").innerHTML;
                                }catch(e){
                                    location.reload();
                                }
                            });
                        }
                    }else{
                        setTimeout(check, 1);
                    }
                };
                check();
                return false;
            }
            return true;
        });
    });
})();