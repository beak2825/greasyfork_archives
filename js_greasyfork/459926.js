// ==UserScript==
// @name         Twitter Promotion Filter
// @name:ja      Twitterプロモーションフィルター
// @namespace    https://greasyfork.org/ja/users/175598
// @version      23.03.1
// @description  Hides promotion on twitter
// @description:ja Twitterのプロモーションを隠します
// @author       N.Y.Boyu
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/416296/Twitter%20Promotion%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/416296/Twitter%20Promotion%20Filter.meta.js
// ==/UserScript==

(function(){
    var MutationObserver=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
    if(MutationObserver)console.log("TPF: Twitter Promotion Filter is enabled.");

    var style=document.createElement("style");
    style.textContent='[tabindex="0"][data-testid][tpf-checked="hidden"]{ display:none!important; }';
    document.head.appendChild(style);

    var root=document.getElementById("react-root")||document.body;
    var check=function(){
        var targets=root.querySelectorAll('[tabindex="0"][data-testid]:not([tpf-checked])'),elems,i,j,m,n;
        topfor: for(i=0,m=targets.length;i<m;i++){
            elems=targets[i].getElementsByTagName("path");
            for(j=0,n=elems.length;j<n;j++){
                if(elems[j].getAttribute("d")==="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"){
                    console.log("TPF: Hit "+targets[i].dataset.testid);
                    targets[i].setAttribute("tpf-checked","hidden");
                    continue topfor;
                }
            }
            /*
            elems=targets[i].querySelectorAll('div:last-child > svg[viewBox="0 0 24 24"]:first-child + :last-child > span:last-child'); //Change here for other language (e.g. '(...) > span:first-child' for English)
            for(j=0,n=elems.length;j<n;j++){
                if(elems[j].textContent.slice(-7)==="プロモーション"){ //Change here for other language (e.g. slice(0,8)==="Promoted" for English)
                    console.log("TPF: Hit");
                    targets[i].parentNode.removeChild(targets[i]);
                    continue topfor;
                }
            }
            */
            targets[i].setAttribute("tpf-checked","");
        }
    };
    new MutationObserver(check).observe(root,{childList:true,subtree:true});
    check();
})();