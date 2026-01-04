// ==UserScript==
// @name         FitGirl Repacks - all games in a single page.
// @description  All games will be shown in a single page instead of multiple pages. Use CTRL+F!
// @namespace    erkexzcx
// @version      0.2
// @author       You
// @match        http://fitgirl-repacks.site/all-my-repacks-a-z/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383828/FitGirl%20Repacks%20-%20all%20games%20in%20a%20single%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/383828/FitGirl%20Repacks%20-%20all%20games%20in%20a%20single%20page.meta.js
// ==/UserScript==

// Make sure we are on the first page:
if(window.location.href !== "http://fitgirl-repacks.site/all-my-repacks-a-z/?lcp_page0=1#lcp_instance_0"){
    window.location.replace("http://fitgirl-repacks.site/all-my-repacks-a-z/?lcp_page0=1#lcp_instance_0");
    return;
}

// Some reusable vars:
var gamesContainer = document.getElementById("lcp_instance_0");
var pagesContainer = document.getElementsByClassName("lcp_paginator")[0];
var dummyDocument = document.implementation.createHTMLDocument();

// Hide pages:
pagesContainer.style.display = 'none';

// Open links in new tab:
makeLinksOpenInNewTab(document);

var pages = pagesContainer.querySelectorAll('li > a[href^="http://fitgirl-repacks.site/all-my-repacks-a-z/?lcp_page0="][title]');
Array.prototype.forEach.call(pages, function(el, i){

    if(el.innerHTML === "Next Page"){
        return;
    }

    var request = new XMLHttpRequest();
    request.open('GET', el.getAttribute('href'), true);
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            parseAndAppend(this.response);
        } else {
            alert("Error occured while parsing games! Userscript now stops, please refresh the page.");
            return;
        }
    };
    request.onerror = function() {
        alert("Error occured while parsing games! Userscript now stops, please refresh the page.");
        return;
    };
    request.send();

});

function parseAndAppend(html){
    dummyDocument.body.innerHTML = html;

    // Open links in new tab:
    dummyDocument = makeLinksOpenInNewTab(dummyDocument);

    // Append parsed new links to existing page:
    var elements = dummyDocument.querySelectorAll('#lcp_instance_0 > li');
    Array.prototype.forEach.call(elements, function(el, i){
        gamesContainer.appendChild(el);
    });
}

// Make all links to open in a new tab:
function makeLinksOpenInNewTab(doc){
    var links = doc.querySelectorAll('#lcp_instance_0 > li > a[href][title]');
    for(var i=0; i < links.length; i++) {
        links[i].setAttribute('target', '_blank');
    }
    return doc;
}