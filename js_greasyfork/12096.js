// ==UserScript==
// @name                Multi tab for Mturk
// @author              ikarma
// @namespace           https://greasyfork.org/en/users/9054
// @version             .02
// @description       Adds Multi Tab link to open hits in 6 tabs
// @include 	       https://www.mturk.com/mturk/accept*
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/searchbar*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/sortsearchbar*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/viewsearchbar*
// @downloadURL https://update.greasyfork.org/scripts/12096/Multi%20tab%20for%20Mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/12096/Multi%20tab%20for%20Mturk.meta.js
// ==/UserScript==



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
            hoardLink.setAttribute('class', 'multitab');
            hoardLink.setAttribute('style', 'padding-right: 20px;'); 
            hoardLink.setAttribute('id', 'mLink');
            hoardLink.innerHTML = "Multi Tab";
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
    var nwwi = window.open(fulPage,"nwwi");
    var nwwi1 = window.open(fulPage,"nwwi1");
    var nwwi2 = window.open(fulPage,"nwwi2");
    var nwwi3 = window.open(fulPage,"nwwi3");
    var nwwi4 = window.open(fulPage,"nwwi4");
    var nwwi5 = window.open(fulPage,"nwwi5");





}

var newHB = document.getElementsByClassName("multitab");
for (var t = 0; t < newHB.length; t++){
    newHB[t].addEventListener( "click", goGoGadget, false);
}

