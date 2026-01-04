// ==UserScript==
// @name         知乎去除图片懒加载、禁止链接重定向
// @namespace https://greasyfork.org/users/2646
// @version      0.3.1
// @description  f**k zhihu!
// @author       https://clso.fun
// @contributionURL    https://clso.fun/donate/
// @contributionAmount 6.66
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393532/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%9B%BE%E7%89%87%E6%87%92%E5%8A%A0%E8%BD%BD%E3%80%81%E7%A6%81%E6%AD%A2%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/393532/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%9B%BE%E7%89%87%E6%87%92%E5%8A%A0%E8%BD%BD%E3%80%81%E7%A6%81%E6%AD%A2%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cleardoc = function(doc) {
        doc.querySelectorAll("a").forEach(function(e){
            var regRet = e.href.match(/target=(.+?)(&|$)/);
            if(regRet && regRet.length==3){
                e.href = decodeURIComponent(regRet[1]);
            }
        });

        $("img.lazy").each(function(){
            var orig = this.getAttribute("data-original");
            var hd = this.getAttribute("data-actualsrc");
            this.src = (orig) ? orig : hd;
            this.setAttribute("data-lazy-status", "ok");
        }).removeClass("lazy");

    };

    //cleardoc(document);

    $("body").bind("DOMNodeInserted", function(e) {
        cleardoc(e.target);
    });

})();