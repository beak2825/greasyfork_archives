// ==UserScript==
// @name                this is a test 04
// @author              test001
// @version             1.1
// @description         test
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/searchbar*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/sortsearchbar*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/viewsearchbar*
// @namespace     gjuhkjhlk
// @downloadURL https://update.greasyfork.org/scripts/20355/this%20is%20a%20test%2004.user.js
// @updateURL https://update.greasyfork.org/scripts/20355/this%20is%20a%20test%2004.meta.js
// ==/UserScript==


var previewLinkEls = document.querySelectorAll('span.capsulelink a');
var myVar1 = document.querySelectorAll('class.requeaterIdentity value');

//for (var i = 0; i < previewLinkEls.length; i++) {
for (var i = 0; i < 1; i++) {
    var previewLink = previewLinkEls[i].getAttribute('href');
    //var myVar2 = myVar1[i].innerHTML.value;
   // var myVar2 = getElementByClassName('requesterIdentity')[i];
   //var myVar2 = myVar1[i].span.textContent;
   //var myVar2 = getElementByClassName('requesterIdentity')[i].textContent;
   //var myVar2 = myVar1[i].childNodes[0].nodeValue;
   //var myVar3 = previewLinkEls[i].getAttribute('textContent');
   //var myVar2 = myVar1[i].getAttribute('textContent');
   var myVar2 = previewLinkEls[i].getAttribute('requesterId');
   

    if (previewLink && previewLink.split('?')) {
        var previewLinkArray = previewLink.split('?');
        if (previewLinkArray[0] == '/mturk/preview') {
            var previewAndAcceptLink = previewLinkArray[0] + 'andaccept?' + previewLinkArray[1] + '&autoAcceptEnabled=true';

            var previewAndAcceptEl = document.createElement('a');
            previewAndAcceptEl.setAttribute('href', previewAndAcceptLink);
            previewAndAcceptEl.setAttribute('target', 'mturkhits');
            previewAndAcceptEl.setAttribute('style', 'margin-right: 20px;');
            previewAndAcceptEl.innerHTML = 'Preview & Accept HITs';

            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(previewAndAcceptEl, parentSpan.firstChild);
            //window.open(previewAndAcceptEl);
            //var handle = getElementsByClassName('requesterIdentity');
            window.alert(previewLink);
            //window.alert(myVar2);
        }
    }
}