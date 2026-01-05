// ==UserScript==
// @name                Tab Hoarder
// @namespace           DCI
// @description         Provides a link to hoard HITs into tabs as well as standard panda links
// @author              Chet Manley - The good parts
// @author              Cristo - The bad parts
// @author              DCI - The brilliant parts
// @version             1.2
// @grant               GM_openInTab
// @include 		https://www.mturk.com/mturk/accept*
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/searchbar*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/sortsearchbar*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/viewsearchbar*
// @include             *knowidea*
// @downloadURL https://update.greasyfork.org/scripts/3929/Tab%20Hoarder.user.js
// @updateURL https://update.greasyfork.org/scripts/3929/Tab%20Hoarder.meta.js
// ==/UserScript==

var HoardDelay = 0
// Hoarding delay in seconds



var previewLinkEls = document.querySelectorAll('span.capsulelink a');
for (var i = 0; i < previewLinkEls.length; i++) {
    var previewLink = previewLinkEls[i].getAttribute('href');
    if (previewLink && previewLink.split('?')) {
        var previewLinkArray = previewLink.split('?');
        if (previewLinkArray[0] == '/mturk/preview') {
            var previewAndAcceptLink = previewLinkArray[0] + 'andaccept?' + previewLinkArray[1]; 
            var previewAndAcceptEl = document.createElement('a');
            previewAndAcceptEl.setAttribute('href', previewAndAcceptLink);
            previewAndAcceptEl.setAttribute('target', 'mturkhits');
            previewAndAcceptEl.setAttribute('style', 'padding-right: 20px;');
            previewAndAcceptEl.innerHTML = 'Accept';
            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(previewAndAcceptEl, parentSpan.firstChild);
            var hoardLink = document.createElement("a");            
            hoardLink.setAttribute('href', previewAndAcceptLink + "&isPreviousIFrame=true&prevRequester=knowidea");
            hoardLink.setAttribute('class', 'newhb');
            hoardLink.setAttribute('style', 'padding-right: 20px;'); 
            hoardLink.setAttribute('id', 'hLink');
            hoardLink.target = "_blank";
            hoardLink.innerHTML = "Hoard";
            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(hoardLink, parentSpan.firstChild);
        }
    }
}


if (window.location.toString().indexOf("knowidea") != -1) {
    if (document.getElementsByName("autoAcceptEnabled")[0]) {
 setTimeout(function(){GM_openInTab(window.location.toString());},HoardDelay);
    } else {
window.close();    	
    }
}