// ==UserScript==
// @name         OzBargin Hide Expired.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide expired deals
// @author       ZMO
// @match        https://www.ozbargain.com.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26291/OzBargin%20Hide%20Expired.user.js
// @updateURL https://update.greasyfork.org/scripts/26291/OzBargin%20Hide%20Expired.meta.js
// ==/UserScript==
/* jshint -W097 */
(function() {
    'use strict';
    

    var marker_class="special-marker-class-is-hidden",
        butwrap = document.createElement("li");
    butwrap.innerHTML = "<button id='toggleExpired'>Toggle Expired</button>";
    var but = $('button', butwrap)[0];
    var maincontentdiv = $("div.maincontent")[0];
    var tabsdiv = $("ul.tabs.primary", maincontentdiv);
    if (tabsdiv.length === 0){
        tabsdiv = document.createElement("ul");
        tabsdiv['class'] = "tabs primary";
        //maincontentdiv.appendChild(tabsdiv);
        maincontentdiv.insertBefore(tabsdiv, maincontentdiv.childNodes[0]);
        tabsdiv = [tabsdiv];
    }
    tabsdiv[0].appendChild(but);
    
    $(but).on('click', function(el){
       the_thing();
    });

    //default hide
    the_thing();
    
    function the_thing(){
       var nl = $('.node.expired');
       nl.each(function (i){
           if (this.classList.contains(marker_class)){
               this.style.backgroundColor = null;
               this.style.minHeight = null;
               this.classList.remove(marker_class);
               $(this).children().show();
           }else{
               this.classList.add(marker_class);
               this.style.backgroundColor = "#444";
               this.style.minHeight = "12px";
               $(this).children().hide();
           }
       });
       // hide/unhide child nodes, not deal node.
       //nl.children().toggle();
    }

}());

