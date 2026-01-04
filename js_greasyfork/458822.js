// ==UserScript==
// @name         Headlines
// @namespace    blaseball
// @version      1.1.0
// @description  adds a few helpful widgets via chartographer to the blaseball homepage
// @author       Myno
// @match        https://www.blaseball.com/*
// @match        https://blaseball.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blaseball.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458822/Headlines.user.js
// @updateURL https://update.greasyfork.org/scripts/458822/Headlines.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateHomePage(){
        if(!!document.querySelector(".playtab__cover-banner")){
            document.querySelector(".playtab__cover").style["flex-direction"] = "row";
            document.querySelector(".playtab__cover-ctas").style["flex-direction"] = "row";
            document.querySelector(".playtab__cover-header").style["flex-direction"] = "row";
            document.querySelector(".playtab__cover").style.width = "100%";
            document.querySelector(".playtab__cover").style.padding = "1rem 1rem 1rem";
            document.querySelector(".playtab__cover").style["border-bottom"] = "1px solid #3d414c";
            document.querySelector(".playtab__cover-banner").style.width = "6rem";
            document.querySelector(".playtab__cover-banner").style.height = "6rem";
            document.querySelector(".playtab__cover-banner").querySelector("img").style.width = "auto";
            if(!document.querySelector(".headlines")){
                document.getElementsByClassName("main__contents")[0].insertAdjacentHTML('beforeend',`<div class="headlines" style="display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: -webkit-max-content;
grid-template-rows: max-content;
width: 100%;
grid-gap: 20px;
gap: 20px; margin: 1rem; width: 90%; height: 100%"></div>`)
            }
            if(!document.querySelector(".headlines_msgs")){
               document.getElementsByClassName("headlines")[0].insertAdjacentHTML('beforeend','<iframe style="grid-area: 1 / 1 / span 3 / span 1;" class="headlines_msgs" title="Messages" width="100%" height="100%" src="https://www.blaseball.com/messages"></iframe>');
            }
            if(!document.querySelector(".headlines_chartographer")){
               document.getElementsByClassName("headlines")[0].insertAdjacentHTML('beforeend','<iframe style="grid-area: 1 / 2 / span 3 / span 2;" class="headlines_chartographer" title="Chartographer" width="100%" height="100%" src="https://chartographer.sibr.dev/events"></iframe>');
            }
            document.getElementsByClassName("headlines_msgs")[0].contentWindow.document.querySelector(".ticker").style.display = "none";
            document.getElementsByClassName("headlines_msgs")[0].contentWindow.document.querySelector(".navigation").style.display = "none";
            document.getElementsByClassName("headlines_msgs")[0].contentWindow.document.querySelector(".toasts").style.display = "none";
            document.getElementsByClassName("headlines_msgs")[0].contentWindow.document.querySelector(".PostFeed-Header").style.display = "none";
            document.getElementsByClassName("headlines_msgs")[0].contentWindow.document.querySelector(".PostFeed-Body").style.width = "100%";

        }else{
            if(document.querySelector(".headlines")){
                document.querySelector(".headlines").remove()
            }
            if(document.querySelector(".headlines_msgs")){
                document.querySelector(".headlines_msgs").remove()
            }
            if(document.querySelector(".headlines_chartographer")){
                document.querySelector(".headlines_chartographer").remove()
            }
        }
    }
    window.setInterval(updateHomePage,1000)
})();