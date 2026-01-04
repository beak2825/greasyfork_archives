// ==UserScript==
// @name         ushistory.org summarizer - bruh im not bouta read all dat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  extracts bolded words & cooresponding paragraphs and underlines them in the browser console. also outputs a list of all the bolded words
// @author       You
// @include      *://*.ushistory.org/us/*
// @include      *://*.ushistory.org/gov/*
// @include      *://*.ushistory.org/civ/*
// @exclude      *://*.ushistory.org/*/index.asp
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392517/ushistoryorg%20summarizer%20-%20bruh%20im%20not%20bouta%20read%20all%20dat.user.js
// @updateURL https://update.greasyfork.org/scripts/392517/ushistoryorg%20summarizer%20-%20bruh%20im%20not%20bouta%20read%20all%20dat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var terms=[...document.querySelectorAll(".term")],
        textterms=terms.map(a=>a.innerText),
        termsents=terms.map((a,i,w)=>(((i-1>=0&&w[i-1].nextSibling==a.previousSibling)||a.previousSibling==null)?"":("\n\n|~|N%c"+a.previousSibling.textContent))+"|~|B%c"+a.innerText+"|~|N%c"+a.nextSibling.textContent);
    console.log(textterms.join("\n"));
    console.log("\n\n");
    var newarra=[],
        newarrb=[];
    termsents.join("").split("|~|").forEach(a=>{
        newarra.push(a.slice(1));
        newarrb.push(a.startsWith("B")?"font-weight:bold;text-decoration:underline;":"");
    });
    if(["","\n","\n\n"].includes(newarra[0])){
        newarra.shift();
        newarrb.shift();
    }
    console.log(newarra.join(""),...newarrb);
})();