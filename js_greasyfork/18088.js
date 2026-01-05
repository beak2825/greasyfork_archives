// ==UserScript==
// @name         Animate Tableau Public Viz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a 'play' button to public tableau vizzes that have animated steps available
// @author       jacalata@gmail.com
// @match        *.public.tableau.com/*
// @grant        none
// @run-at       document.idle
// @downloadURL https://update.greasyfork.org/scripts/18088/Animate%20Tableau%20Public%20Viz.user.js
// @updateURL https://update.greasyfork.org/scripts/18088/Animate%20Tableau%20Public%20Viz.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var SECOND = 1000

var waitForElementClass = function(name){
    var element = document.getElementsByClassName(name);
    while (!element){
        setTimeout(waitForElementClass(name), 2 * SECOND);
    }
}


window.addEventListener('load', function() {
    
    var forwardButtonId = "dijit_form_Button_1"
    
    // the last elements to load are the social network badges - wait for them
    waitForElementClass("fb_iframe_widget")
    
    // it's all inside an iframe http://stackoverflow.com/questions/1451208/access-iframe-elements-in-javascript
    var getDoc = function(){
        var doc = window.frames['viz_embedded_frame'].contentDocument
        while (!doc){
            setTimeout(getDoc, 2 * SECOND);
        }
        return doc
    }
    
    var doc = getDoc()   
    doc.getElementById("loadingGlassPane").remove() //otherwise it flashes each time we step forward
    
    var findButton = function(){
        var forwardBtn = doc.getElementById(forwardButtonId);
        while (!forwardBtn){
            setTimeout(findButton, 2 * SECOND);
        }
        return forwardBtn
    }
    
    var runCount = 0
    var attachElementToPage = function(){        
        console.log("looking for parent to attach to: ", runCount)
        var foo = doc.getElementById("tableau_base_widget_CurrentPagePanel_0");
        if (foo){
            console.log("found the parent we want")
            foo.appendChild(element);
            console.log("play button added")
            return foo;
        }
        runCount++
        setTimeout(attachElementToPage, 2 * SECOND)
        if (runCount > 20) {
            console.log("exit: gave up looking for parent to attach to")
            return null;
        }
    }
    
    var clicks = 0;
    var play_viz = function() {    
        clicks++
        // click on dijit_form_Button_1 every x seconds until it is disabled
        var forwardBtn = findButton()
        if (forwardBtn && forwardBtn.disabled) { 
            console.log("no more data points to show");
            return; 
        }
        console.log("click forward", clicks)
        forwardBtn.click()
        setTimeout(play_viz, 0.5 * SECOND); //if this is faster than ~0.5 seconds then the clicks are just ignored
    };
    
    console.log("begin DOM manipulation")
    //Create an input type dynamically.    http://stackoverflow.com/a/7707095/422315
    var element = doc.createElement("input");
    element.type = "button";
    element.id = "my-foo-button";
    element.value = "Play"; 
    element.name = "btn_play_viz";
    element.style.cssText = 'position:relative;top:56px;left:90px';
    element.onclick = play_viz

    attachElementToPage(element);
    
}, false);
