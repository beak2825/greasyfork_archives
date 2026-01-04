// ==UserScript==
// @name         Zendesk close all tabs
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds a button to Zendesk to close all tabs
// @author       Gerrit De Vriese
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390678/Zendesk%20close%20all%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/390678/Zendesk%20close%20all%20tabs.meta.js
// ==/UserScript==


//Make sure script only runs after page has loaded
var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 200, observer);
observer.observe(document, {childList: true, subtree: true});

function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 200, observer);
}


function action(o) {
    o.disconnect();


    //Add Google Icons
    if(!document.getElementById('id2')) {
    var link = document.createElement('link');
    link.id = 'id2';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
    }

    //Create closetabs div
    var closetabs = document.createElement("DIV");
    closetabs.setAttribute("style", "width: 75px; cursor: pointer; padding-left: 22px;  padding-top: 10px;");
    closetabs.setAttribute("class", "tab-content-holder");

    //Create icon div
    var icon = document.createElement("DIV");
    icon.innerHTML = "<i class='material-icons' style='font-size:16px;'>delete</i>";
    icon.setAttribute("style", "padding-top: 7px; width: 19px; font-size: 16px; color:#767676; float:left");

    //Create text div
    var text = document.createElement("DIV");
    text.innerHTML = "Close All";
    text.setAttribute("style", "padding-top: 8px; width: 55px; font-size: 12px; color:#2F3941; float:left");

    //Add icon and text to closetabs div
    closetabs.appendChild(icon);
    closetabs.appendChild(text);
    closetabs.addEventListener("click", CloseTabs, false);

    //Get zendesk top tab bar by id
    var list = document.getElementById("tabs");

    //Insert before Add Button
    list.insertBefore(closetabs, list.lastElementChild);

    function CloseTabs() {
        //Closing all tabs
        [...document.querySelectorAll('li.tab:not(.selected) .close')].reverse().forEach(btn => btn.click());
    }

}