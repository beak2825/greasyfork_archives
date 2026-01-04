// ==UserScript==
// @name                this is a test 01-a - 28 nov 2018
// @author              test002
// @version             1.10
// @description         test 01 a
// @include             https://worker.mturk.com/?*


// @namespace           jhojpaogf99o
// @downloadURL https://update.greasyfork.org/scripts/374920/this%20is%20a%20test%2001-a%20-%2028%20nov%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/374920/this%20is%20a%20test%2001-a%20-%2028%20nov%202018.meta.js
// ==/UserScript==


var previewLinkEls = document.querySelectorAll('span.accept-qualify-container a');

for (var i = 0; i < previewLinkEls.length; i++) {
  
   
    var previewLink = previewLinkEls[i].getAttribute('href');
    
    //t//  var previewLinkArray = previewLink.split('/', 3);
   //t//  var previewAndAcceptLink = previewLinkArray[2];
 ///////////////var previewLinkArray = previewLink.split('/');
    ////////////////var previewAndAcceptLink = previewLinkArray[1];   
  ///https://worker.mturk.com/projects/3OJGK8O6MRF5RY0JXNTE20YSI1W5LW/tasks/accept_random?ref=w_pl_prvw
  
    //t//  previewLinkEls[i].innerHTML = previewAndAcceptLink;
    
    
    
    //t// var test1 = ["30X7H91F8MC95Y5UNTPP94YX5MRU7T"];    
      
          
          //t// var test3 = test1.indexOf(previewAndAcceptLink);
         //t//  if(test3 === -1){
          var winOpen =  window.open(previewLink, width=100, height=100);
          
              //t// break;}
    
}

var myt4 = setTimeout( function() {
            location.reload( true );
       }, 600 );
      //}, 1000 ); 
    
        

//t// if (test3 === -1){
  //t// clearTimeout(myt4); 
//t// }