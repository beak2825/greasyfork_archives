// ==UserScript==
// @name        Anti-anti adblock xvideos.com
// @namespace   Violentmonkey Scripts
// @match       https://www.xvideos.com/*
// @grant       none
// @license     gpl3 
// @version     1.0
// @author      -
// @description 2/24/2024, 6:18:51 PM
// @downloadURL https://update.greasyfork.org/scripts/488203/Anti-anti%20adblock%20xvideoscom.user.js
// @updateURL https://update.greasyfork.org/scripts/488203/Anti-anti%20adblock%20xvideoscom.meta.js
// ==/UserScript==

function xvideosBlankPageRemoval(f){
        if(document.readyState == "complete"){f();}
        else{document.addEventListener('readystatechange',function(){setTimeout(f,500);});}
}

xvideosBlankPageRemoval(function(){
        if(document.readyState == "complete"){
          var body = document.body;
          body.classList.remove("exo-ad-ins-container");
        }
        else{document.addEventListener('readystatechange',function(){setTimeout(f(),500);});}
});


