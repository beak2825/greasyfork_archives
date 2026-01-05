// ==UserScript==
// @name                this is a test 07
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
// @namespace           jhakjfh
// @downloadURL https://update.greasyfork.org/scripts/20433/this%20is%20a%20test%2007.user.js
// @updateURL https://update.greasyfork.org/scripts/20433/this%20is%20a%20test%2007.meta.js
// ==/UserScript==
/*
myT1 = window.setTimeout(document.location.reload(), 10000);
myT2 = window.setInterval(document.loction.reload(), 10000);

document.addEventListener("DOMContentLoaded",myT1,false);
*/
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
           var test1 = ["37ZHE2JT1D250TKIB56TICN73UQ88W", "3USMLONC9E5MDB1GD7ZQ6SDG14K85P"];
          var test2 = previewLink.replace("/mturk/preview?groupId=", "");
          var test3 = test1.indexOf(test2);
          if(test3 === -1){
            window.open(previewAndAcceptEl);
            //clearTimeout(myT1);
            
            break;
            
            
          }
          
          
          
          
           /*
           for(var j=0;j<test1.length;j++)
           {
            var test1src = previewLink.search(test1[j]);
            var arr1 = [test1Src];
            window.alert(arr1);
            
            if (test1src ===-1){
                window.alert("accept it");
            }
            else{
              window.alert(test1src);  
            }
             
             
           }
           
            */
           
           
           
           
           
           
            
        }
    }
}