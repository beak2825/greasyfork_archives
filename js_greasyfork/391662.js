// ==UserScript==
// @name         Telegraaf.nl see all articles
// @namespace    ladroop is lazy
// @version      0.3
// @description  try to take the world
// @author       someguy
// @match        https://www.telegraaf.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391662/Telegraafnl%20see%20all%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/391662/Telegraafnl%20see%20all%20articles.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var n=0;
    var sc="";
    var article="";
    var textblock="";

    var observer = new MutationObserver(paytest);
    var observerConfig = {childList: true};
    var observenode=document.querySelector('title');
    observer.observe(observenode, observerConfig);
    setTimeout(paytest, 3000);



    function paytest(){
        if (document.getElementById("lala")){
            document.getElementById("lala").parentNode.removeChild(document.getElementById("lala"));
        }
        if (document.getElementById("TEMPRORARY_METERING_ID")){
            document.getElementById("TEMPRORARY_METERING_ID").parentNode.style.display="none";
            sc=document.getElementsByTagName("script");
            for(n=0;n < sc.length;n++) {
                if (sc[n].innerHTML.indexOf('"@type":"NewsArticle"')!=-1){
                    article=JSON.parse(sc[n].innerHTML);
                    textblock=(article.articleBody);
                    textblock=textblock.replace(/\n/gi,"<br>");
                    break;
                }
            }
            var newp=document.createElement("p");
            newp.id="lala";
            newp.innerHTML=textblock;
            document.getElementsByClassName('TextArticlePage__bodyText')[0].appendChild(newp);
        }
    }


})();