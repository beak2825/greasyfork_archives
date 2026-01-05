// ==UserScript==
// @name                Preview, Accept and Hoard
// @author              Chet Manley - The good parts
// @description       Adds an Accept and Hoard link to every Hit Capsule.
// @author              Cristo - The bad parts
// @version    	       13.0
// @grant                GM_getValue
// @grant                GM_setValue
// @include 	       https://www.mturk.com/mturk/accept*
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/searchbar*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/sortsearchbar*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/viewsearchbar*
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2431/Preview%2C%20Accept%20and%20Hoard.user.js
// @updateURL https://update.greasyfork.org/scripts/2431/Preview%2C%20Accept%20and%20Hoard.meta.js
// ==/UserScript==

var refreshTime = 2; //In seconds


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
            hoardLink.setAttribute('href', previewAndAcceptLink);
            hoardLink.setAttribute('class', 'newhb');
            hoardLink.setAttribute('style', 'padding-right: 20px;'); 
            hoardLink.setAttribute('id', 'hLink');
            hoardLink.innerHTML = "Hoard";
            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(hoardLink, parentSpan.firstChild);
        }
    }
}
function goGoGadget(e){
	e.preventDefault();
	var hPage = this.getAttribute("href");
	pageToDo(hPage);
}
function pageToDo(hPage) {
    var fulPage = "https://www.mturk.com" + hPage;
    var groupId = fulPage.split("=")[1];
    GM_setValue("groupcheck", groupId);
    GM_setValue("thePage", fulPage);
    GM_setValue("outthewindow", "true");
    var nwwi = window.open(fulPage,"nwwi");
}
var newHB = document.getElementsByClassName("newhb");
for (var t = 0; t < newHB.length; t++){
	newHB[t].addEventListener( "click", goGoGadget, false);
}
if ((GM_getValue("outthewindow") == "true") && (window.location.toString().indexOf(GM_getValue("groupcheck")) != -1)) {
    if (document.getElementsByName("userCaptchaResponse")[0]) {
    	console.log("Lowlife and ZSMTurker are awesome");
    } else {
    	GM_setValue("outthewindow", "false");
    	var t = refreshTime * 1000;
    	var load = setTimeout(function () { GM_setValue("outthewindow", "true"); window.location = GM_getValue("thePage"); }, t);
    }
}