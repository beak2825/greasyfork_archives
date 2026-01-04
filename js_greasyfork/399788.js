// ==UserScript==
// @name         UIS Support v2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Try to take over the world!
// @author       Didier Otero
// @match        https://support.uistechpartners.com/*
// @grant        none
// @connect      uistechpartners.com
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/399788/UIS%20Support%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/399788/UIS%20Support%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var fontawesome = '<link rel="stylesheet" href="https://use.fontawesome.com/2703d1765a.css">';
    var fontawesome = '<script src="https://kit.fontawesome.com/1d8feff935.js" crossorigin="anonymous"></script><link href="https://kit-free.fontawesome.com/releases/latest/css/free.min.css" media="all" rel="stylesheet">';
    document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', fontawesome);
    addMenuButton();
    addIdsToHomePageLeftMenuItems();
    addHomeLinkToLogo();
    addClassesToReplies();
    addClassToReplyTextarea();
    changeStopwatchSize();
})();

function changeStopwatchSize() {
    document.getElementById("stopwatch").setAttribute("size","6");
}

function addMenuButton() {
    var a = document.createElement('a');
    a.setAttribute('href',"#");
    a.className = "menu-button";
    a.onclick = function(){
        document.querySelector(".content_left").classList.toggle('expanded');
    };
    document.querySelector("td.leftmenubox ul").prepend(a);
}

function addHomeLinkToLogo() {
    // Adds home lnk to logo
    var logoImage = document.querySelector("img[name='UIS Technology Partners']");
    var wrapperLink = document.createElement('a');
    wrapperLink.href = "/support/";
    logoImage.parentNode.insertBefore(wrapperLink, logoImage);
    wrapperLink.appendChild(logoImage);
}
/*
function addIconsToMenu() {
    var a = document.createElement('a');
    a.setAttribute('href',"#");
    a.className = "menu-button";
    a.onclick = function(){
        document.querySelector(".content_left").classList.toggle('expanded');
    };
    document.querySelector("td.leftmenubox ul").prepend(a);
}
*/

function addIdsToHomePageLeftMenuItems() {
    if (window.location.href=="https://support.uistechpartners.com/support/dashboard.cfm" ||
        window.location.href=="https://support.uistechpartners.com/support/dashboard.cfm#") {
        var menuItems = document.querySelectorAll(".content_left ul li a");
        menuItems.forEach(function(menuItem, i) {
            switch(i) {
                case 1: menuItem.classList.add("management"); break;
                case 2: menuItem.id = "consultant"; break;
                case 3: menuItem.id = "telco"; break;
                case 4: menuItem.id = "finance"; break;
                case 5: menuItem.id = "sales"; break;
                case 6: menuItem.id = "marketing"; break;
                case 7: menuItem.id = "hr"; break;
                case 8: menuItem.id = "settings"; break;
                case 9: menuItem.id = "services"; break;
                case 10: menuItem.id = "logout"; break;
                default: break;
            }
        });
    }
}

function addDarkModeBtn() {

    var button = document.createElement("INPUT");
    button.setAttribute("type", "button");
    button.innerHTML = '<i class="fas fa-adjust fa-lg"></i>';

    var topnav = document.getElementById("topnav");
    topnav.appendChild(button);

    button.addEventListener ("click", function() {
        var body = document.getElementsByTagName("body")[0];
        body.classList.toggle('darkMode');
    });
}


function addClassesToReplies() {

    var replies = document.querySelectorAll("div#replies tbody tr");
    replies.forEach(function(reply) {
        var viewers = reply.querySelector("td:first-child img");
        if (viewers) {
            reply.classList.add(viewers.getAttribute("title").replace(/\s/g, ""));
        }
    });
}


function addClassToReplyTextarea() {

    var replySelector = document.querySelector("select[name=TaskReplyViewID]");
    replySelector.addEventListener("change", addClassToReplyTextarea);
    var replyVal = replySelector.options[replySelector.selectedIndex].text.replace(/\s/g, "");

    var textarea = document.getElementById("replyTaskDescription");
    var replyList = ["UNameITsManagement", "UNameITsTeam", "ClientManagement", "Everyone"];

    replyList.forEach(function(e) {
        textarea.classList.remove(e);
    });

    textarea.classList.add(replyVal);
}