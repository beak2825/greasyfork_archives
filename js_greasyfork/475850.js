// ==UserScript==
// @name         delete anti-adblock sankaku complex
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  fuck you sankaku, fuck you WinterXIX
// @author       shadyreptilian
// @match        https://chan.sankakucomplex.com/*
// @grant        none
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475850/delete%20anti-adblock%20sankaku%20complex.user.js
// @updateURL https://update.greasyfork.org/scripts/475850/delete%20anti-adblock%20sankaku%20complex.meta.js
// ==/UserScript==


var divs = document.getElementsByTagName("div");
var todelete = []
var div = document.getElementById("content")
var clone = div.cloneNode(true);
clone.id = "asdf";


var clonechild_nodes = clone.childNodes
for(var c = 0; c < clonechild_nodes.length; c++){
    if(clonechild_nodes[c].localName == "div"){
        var cloneouter_text = String(clonechild_nodes[c].outerText).replace(/\s/g, "").replace(/[\u200B-\u200D\uFEFF]/g, '')
        var isAntiAdblock = cloneouter_text.indexOf("ad-block")
        if(isAntiAdblock >= 0){
            todelete.push(clonechild_nodes[c])
        }
    }
}


for(var j = 0; j < todelete.length; j++){
    todelete[j].remove();
}


div.remove();
clone.id = "content";
div = clone
document.body.appendChild(clone);