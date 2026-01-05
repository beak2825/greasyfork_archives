// ==UserScript==
// @name                this is a test 05
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
// @namespace uhjkhjkhkl
// @downloadURL https://update.greasyfork.org/scripts/20382/this%20is%20a%20test%2005.user.js
// @updateURL https://update.greasyfork.org/scripts/20382/this%20is%20a%20test%2005.meta.js
// ==/UserScript==


var previewLinkEls = document.querySelectorAll('span.capsulelink a');

for (var i = 0; i < 4; i++) {
    var previewLink = previewLinkEls[i].getAttribute('href');
    
   

    if (previewLink && previewLink.split('?')) {
        var previewLinkArray = previewLink.split('?');
        if (previewLinkArray[0] == '/mturk/preview') {
            var previewAndAcceptLink = previewLinkArray[0] + 'andaccept?' + previewLinkArray[1] + '&autoAcceptEnabled=true';

            var previewAndAcceptEl = document.createElement('a');
            previewAndAcceptEl.setAttribute('href', previewAndAcceptLink);
            previewAndAcceptEl.setAttribute('target', 'mturkhits');
            previewAndAcceptEl.setAttribute('style', 'margin-right: 20px;');
            //previewAndAcceptEl.innerHTML = 'Preview & Accept HITs';
            previewAndAcceptEl.innerHTML = previewLink;

            var parentSpan = previewLinkEls[i].parentNode;
            parentSpan.insertBefore(previewAndAcceptEl, parentSpan.firstChild);
            //window.open(previewAndAcceptEl);
            //var myStr = '/mturk/preview?groupId=35DAEVU8JHJ10FFZ10EN4CRDQ8F870';
            //var myStrMtch = myStr.search(previewLink);
            
            //if (myStrMtch === -1){
              //  window.alert('not found');
            //}
            //else{
              //  window.alert(previewLink);
            //}
           //var test1 = previewLink.replace("/mturk/preview?groupId=", "");
           var test1 = "37ZHE2JT1D250TKIB56TICN73UQ88W";
           var test1src = previewLink.search(test1);
           
           
           window.alert(test1src);
           
            
        }
    }
}