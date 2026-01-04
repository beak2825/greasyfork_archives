// ==UserScript==
// @name        promotion free twitter
// @namespace   twitter_goes_droopy
// @description hides promoted tweets
// @match       https://x.com/*
// @version     1.1
// @run-at      document-end
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/407596/promotion%20free%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/407596/promotion%20free%20twitter.meta.js
// ==/UserScript==


(function() {
//    'use strict';

    var n=0;
    var observer = new MutationObserver(cleanup);
    var observerConfig = {subtree:true, childList:true};
    var observenode="";
    var observer2 = new MutationObserver(start);
    var observerConfig2 = {subtree: true, characterData: true, childList: true };
    var observenode2="";

    start();

    function start(){
        observer2.disconnect();
        if(!document.querySelector('[data-testid="primaryColumn"]')){
            setTimeout(function(){start();}, 2000);
            return;
        }
        observenode2=document.getElementsByTagName('title')[0];
        observer2.observe(observenode2, observerConfig2);
        observenode=document.querySelector('[data-testid="primaryColumn"]');
        observer.observe(observenode, observerConfig);
    }

    function cleanup(){
        var tweets=document.querySelectorAll('[data-testid="tweet"]');
        for (n=0;n<tweets.length ; n++){
            if (tweets[n].querySelector('[d="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"]')){
                tweets[n].style.display="none";
            }
        }
    }

})();