// ==UserScript==
// @name         HackForums UID Title Lookup
// @namespace    http://www.hackforums.net/member.php?action=profile&uid=2525478
// @version      0.3
// @description  When a thread is hovered over and contains a UID, this script will display the current username of that UID
// @author       TyrantKingBen
// @match        http://*.hackforums.net/search.php*
// @match        http://*.hackforums.net/forumdisplay.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11436/HackForums%20UID%20Title%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/11436/HackForums%20UID%20Title%20Lookup.meta.js
// ==/UserScript==

var hoverTime = 750; //750 milliseconds

var links = document.getElementsByTagName("a"); //document.links;

for (i = 0; i < links.length; i++) {
    (function () {
        if (isThread(links[i].href)) {
            var UID = findUID(links[i].innerHTML);
            if (UID != false) {
                var j = i;
                var post = links[j].parentNode.parentNode.parentNode;
                if (post.getElementsByClassName("disputed_username").length == 0) { //Checks if UID was already looked up
                    var timeout;
                    
                    var mouseEnter = function() {
                        timeout = setTimeout(function() { showUsername(UID, post) }, hoverTime);
                    };
                    var mouseLeave = function() {
                        clearTimeout(timeout);
                    };
                    
                    post.addEventListener("mouseenter", mouseEnter);
                    post.addEventListener("mouseleave", mouseLeave);
                }
            }
        }
    }())
}

function isThread(link) {
    var threadLink = link.match(/http:\/\/(www|nsfw)\.hackforums\.net\/showthread\.php\?tid=\d+/);
    if (threadLink == null) return false; //Isn't a thread link at all
    if (threadLink[0] == link) return true; //Is a pure thread link
    else return false; //Isn't a pure thread link
}

function findUID(title) {
    var threadTitle = title.match(/uid/i);
    if (threadTitle != null) {
        title = title.substr(threadTitle["index"], title.length - threadTitle["index"]);
        var UID = title.match(/\d+/);
        if (UID != null) return UID[0];
        else return false;
    } else {
        var UID = title.match(/[^\.]\b(\d{6,})/); //Match numeric string of length 6 or more
        if (UID != null) return UID[1];
        else return false;
    }
}

function showUsername(UID, element) {
    if (element.getElementsByClassName("disputed_username").length > 0) return; //Makes sure that the username box isn't already shown
    
    var postRectangle = element.getBoundingClientRect();
    var div = document.createElement("div");
    div.className = "disputed_username";
    div.innerHTML = "Loading profile.";
    div.style.color = "#FFF";
    div.style.background = "#0F5799";
    div.style.float = "right";
    div.style.padding = "2px 6px 2px 6px";
    div.style.MozBorderRadius = "5px";
    div.style.webkitBorderRadius = "5px";
    div.style.KhtmlBorderRadius = "5px";
    div.style.borderRadius = "5px";
    div.style.lineHeight = (postRectangle.bottom - postRectangle.top - 12) + "px";
    element.children[0].insertBefore(div, element.getElementsByClassName("author smalltext")[0]);
    
    findUsername(UID, div);
}

function findUsername(UID, div) {
    var request, username;
    if (window.XMLHttpRequest) request = new XMLHttpRequest();
    else request = new ActiveXObject("Microsoft.XMLHTTP");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            try {
                username = request.responseText;
                username = username.split("<span class=\"largetext\">")[1];
                username = username.split("</span><br />")[0];
                username = username.match(/<span .+?>(.+?)<\/span>/);
                div.innerHTML = "Disputed: " + username[1];
            } catch (error) { //Profile page can't be loaded
                console.log(error);
                div.innerHTML = "Error loading profile.";
            }
        }
    }
    request.open("GET", "http://www.hackforums.net/member.php?action=profile&uid=" + UID, true);
    request.send(null);
}