// ==UserScript==
// @name Marriott hotel factsheet
// @description Adds a link to the menubar on the Marriott website for viewing a hotel's factsheet. The factsheet contains contact details and other information about the hotel.
// @namespace all
// @match *://www.marriott.com/hotels/travel/*
// @grant none
// @version 0.0.1.20190915133200
// @downloadURL https://update.greasyfork.org/scripts/389320/Marriott%20hotel%20factsheet.user.js
// @updateURL https://update.greasyfork.org/scripts/389320/Marriott%20hotel%20factsheet.meta.js
// ==/UserScript==

function addFactSheetLink() {
    var url = getFactSheetUrl();
    if(!url) {
        return;
    }    
    var ul = document.querySelector("ul.l-navbar-content") || document.querySelector("nav.l-pos-relative > ul");
    if(ul) {
        var lastMenuItem = ul.lastElementChild;
        if(lastMenuItem) {
            var li = document.createElement('li');
            li.className = lastMenuItem.className;
            li.innerHTML = lastMenuItem.innerHTML;
            var anchor = li.querySelector("a");
            if(anchor) {
                anchor.setAttribute("href", url);
                anchor.setAttribute("target", "_blank");
                anchor.innerHTML = "Factsheet";
                ul.appendChild(li);
            }
        }
    }
}

function getFactSheetUrl() {
    var regex = /^https?:\/\/(www\.)?marriott\.com\/hotels\/travel\/(\w+)-/i;
    var match = regex.exec(document.location.href);
    if(match) {
      var marshaCode = match[match.length-1];
      var factSheetUrl = "https://www.marriott.com/hotels/hotelFactSheet.mi?marshaCode=" + marshaCode;
      return factSheetUrl;
    }
    return null;
}

addFactSheetLink();