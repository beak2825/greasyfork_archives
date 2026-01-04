// ==UserScript==
// @name         No autoplay on Bilibili live homepage
// @namespace    https://exz.me/
// @version      0.1
// @description  Prevent autoplay on Bilibili live homepage
// @author       Epix
// @include        /^https://live\.bilibili\.com/$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380972/No%20autoplay%20on%20Bilibili%20live%20homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/380972/No%20autoplay%20on%20Bilibili%20live%20homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pause(target){
        console.log("blocking");
        console.log(target);
        target.src="";
        target.parentNode.removeChild(target);
    }
    var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if(mutation.type=="attributes"&&mutation.target.tagName=="VIDEO"){
                pause(mutation.target);
            }
            if(mutation.addedNodes.length>0){
                for(var i = 0; i < mutation.addedNodes.length; i++){
                    if(mutation.addedNodes[i].nodeType==1&&mutation.addedNodes[i].tagName=="VIDEO"){
                        pause(mutation.addedNodes[i]);
                    }
                }
            }
        });
    });
    observer.observe(document, {attributes:true,childList:true,subtree:true,characterData:true});
})();