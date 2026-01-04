// ==UserScript==
// @name         4chan/f helper
// @namespace    https://greasyfork.org/zh-CN/scripts/412639-4chan-f-fitler
// @version      0.3
// @description  4chan/f helper script
// @description  ctrl+<- prev swf
// @description  ctrl+-> next swf
// @author       Neysummer2000
// @match        https://boards.4chan.org/f/
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_openInTab
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/412639/4chanf%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412639/4chanf%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // GM_addStyle(".viewing{background-color: blue !important;}");

    var g_viewing; // dom
    var g_viewed = GM_getValue("4chan_viewed", "[]");
    g_viewed = JSON.parse(g_viewed);

    window.addEventListener("keydown", function(ev){
        if(g_viewing === undefined) return;
        if(ev.ctrlKey){
            switch(ev.key){
                case "ArrowRight":
                    var prev = g_viewing.nextElementSibling;
                    if(prev !== null){
                        document.getElementById('swf-embed').remove()
                        prev.children[3].children[0].click();
                    }
                    break;

                case "ArrowLeft":
                    var next = g_viewing.previousElementSibling;
                    if(next !== null){
                        document.getElementById('swf-embed').remove()
                        next.children[3].children[0].click();
                    }
                    break;

            }
        }
    });

    var g_doms = [];
    document.querySelectorAll('.flashListing td:nth-child(4) a').forEach(function(d) {
        var parent =  d.parentElement.parentElement;
        if (g_viewed.indexOf(d.href) != -1){
            parent.remove();
        }else{
            g_doms.push(d);
        }
    });

   g_doms.forEach(function(d, i){
       var parent =  d.parentElement.parentElement;
        d.addEventListener("click", function(ev) {
//             for(let dom of document.querySelectorAll(".viewing")){
//                 dom.classList.remove("viewing");
//             }
//             parent.classList.add("viewing");

            g_viewed.push(d.href);
            g_viewing = parent;
            // console.log(g_viewing);
            GM_setValue("4chan_viewed", JSON.stringify(g_viewed));

            var iframe = document.getElementById('swf-embed-header');
            var span = document.createElement("span");
            span.innerText = "  --  " + parent.children[6].innerText;
            iframe.appendChild(span);

            var span_1 = document.createElement("span");
            span_1.innerText = "[ " + (i + 1) + "/" + g_doms.length+ "] ";
            iframe.prepend(span_1);

            var a = document.createElement("a");
            //a.target = "_blank";
            //a.href = d.href;
            a.href = "javascript: void(0)";
            a.addEventListener("click", function(){GM_openInTab(d.href, true)});
            a.innerText = "download";
            a.style.cssText = "float: right; margin-right: 10px;";
            iframe.appendChild(a);
            //console.log(d.href);

        });
    });

})();