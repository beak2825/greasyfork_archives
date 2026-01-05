// ==UserScript==
// @name         FB Suggested Post Killer
// @namespace    https://www.facebook.com/
// @version      1.2
// @description  Prevent adds in my post!
// @author       Eric Mintz
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22289/FB%20Suggested%20Post%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/22289/FB%20Suggested%20Post%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // I predict FB will change this classname from time to time.
    // ... so I have it in an easy-to-access variable here at the top.

    // -----------------------------
    // -- change me as needed
    // -----------------------------
    var divClass="_5jmm";
    // -----------------------------

    // Your code here...
    var addListener = function(element,eventName,listener){
        if(element.addEventListener){
            element.addEventListener(eventName, listener);
        }else{
            element.attachEvent('on'+eventName, listener);
        }
    };
    var killads = function(){
        var divs = document.getElementsByClassName(divClass);
        for (var i = 0; i < divs.length; i++){
            var spans = divs[i].getElementsByTagName('span');
            if (spans.length > 0 && (spans[0].innerHTML == "Suggested Post" || spans[0].innerHTML == "Voorgesteld bericht")){
                divs[i].remove();
            }
        }
    };
    addListener(document,'load',killads);
    addListener(document,'DOMNodeInserted',killads);
})();