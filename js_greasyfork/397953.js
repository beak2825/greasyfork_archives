// ==UserScript==
// @name         RR Start / Continue Reading Link
// @namespace    ultrabenosaurus.RoyalRoad
// @version      1.3
// @description  Adds a link under every fiction title on your Follow List on Royal Road to start or continue reading in one click, inspired by Chameleon's script and edited to suit my preferences.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @include      http*://*royalroad.com/my/follows*
// @icon         https://www.google.com/s2/favicons?domain=royalroad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397953/RR%20Start%20%20Continue%20Reading%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/397953/RR%20Start%20%20Continue%20Reading%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // var linkOpenBehaviour
    // current = open chapter in current browser tab
    // use any other value to open chapter in a new tab
    var linkOpenBehaviour = "tab";

    if(document.querySelectorAll("div.portlet-title div.actions a.btn.btn-circle.blue:not(.btn-outline)")[0].innerText == "V2"){
        UBaddV2Link(linkOpenBehaviour);
    } else {
        UBaddLink(linkOpenBehaviour);
    }
})();

function UBaddV2Link(linkOpenBehaviour) {
    var titles = document.querySelectorAll('h2.fiction-title');
    for(var t in titles) {
        if(!titles.hasOwnProperty(t)){break;}
        var list = titles[t].parentNode.querySelectorAll('ul.list-unstyled li.list-item');
        var rncElem="";
        if(list.length>1 && list[1].childNodes[0].textContent.trim() == "Last Read Chapter:") {
            rncElem='<a href="javascript:void(0);" class="bold no-margin" id="UBreading'+t+'">Continue Reading</a>';
        } else if(list[0].childNodes[0].textContent.trim() == "Last Update:") {
            rncElem='<a href="javascript:void(0);" class="bold no-margin" id="UBreading'+t+'">Start Reading</a>';
        } else {
            linkElem = rncElem = "";
        }
        if(!rncElem=="") {
            var linkElem=titles[t].querySelector("a");
            titles[t].insertAdjacentHTML("afterend", rncElem);
            var rncBtn = document.getElementById('UBreading'+t);
            if(rncBtn) {
                rncBtn.addEventListener("click", UBstartContinueReading.bind(undefined, linkElem.href, linkOpenBehaviour), false);
            }
        }
    }
}

function UBaddLink(linkOpenBehaviour) {
    var titles = document.querySelectorAll('h2.fiction-title');
    for(var t in titles) {
        if(!titles.hasOwnProperty(t)){break;}
        var fictionPageA=titles[t].querySelector("a");
        var rfcElem='<a href="javascript:void(0);" class="bold no-margin" id="UBstartContinueReading'+t+'">Start / Continue Reading</a>';
        titles[t].insertAdjacentHTML("afterend", rfcElem);
        var rfcBtn = document.getElementById('UBstartContinueReading'+t);
        if(rfcBtn) {
            rfcBtn.addEventListener("click", UBstartContinueReading.bind(undefined, fictionPageA.href, linkOpenBehaviour), false);
        }
    }
}

function UBstartContinueReading(fiction, linkOpenBehaviour){
    $.ajax({
        type: "GET",
        url: fiction,
        success: function(t){
            var fictionPage = document.implementation.createHTMLDocument();
            fictionPage.body.innerHTML = t;
            var a = fictionPage.querySelector("a.btn.btn-lg.btn-primary");
            linkOpenBehaviour=="current"?window.location.href = a.href:window.open(a.href);
        }
    });
}