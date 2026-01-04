// ==UserScript==
// @name                this is a test 20 aug 2021_1
// @author              test00122feb2019
// @version             42.08
// @description         test22feb2019
// @include             https://worker.mturk.com/?*


// @namespace           jhakjfh
// @downloadURL https://update.greasyfork.org/scripts/431120/this%20is%20a%20test%2020%20aug%202021_1.user.js
// @updateURL https://update.greasyfork.org/scripts/431120/this%20is%20a%20test%2020%20aug%202021_1.meta.js
// ==/UserScript==
/*
function playAlertSound() {
  // https://notificationsounds.com/notification-sounds/plucky-564
  const audio = new Audio('data:audio/mp3;base64,');
  audio.play();
}
 
const app = document.querySelector('#app');
 
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes) {
      const studyAdded = [...mutation.addedNodes].some((node) => node.className === 'list-item');
      if (studyAdded) {
        playAlertSound();
      }
    }
  });
});
 
observer.observe(app, { childList: true, subtree: true });

*/

var previewLinkEls = document.querySelectorAll('span.accept-qualify-container a');

for (var i = 0; i < previewLinkEls.length; i++) {
  
   
    var previewLink = previewLinkEls[i].getAttribute('href');
    
    var previewLinkArray = previewLink.split('/', 3);
   var previewAndAcceptLink = previewLinkArray[2];
 
     

  
    previewLinkEls[i].innerHTML = previewAndAcceptLink;
    
    
    
     var test1 = ["3MX1CQXD172XZM2LB7FFD3SC2MNWDB", "3Z44DFV2VTJH7JHHOH8FOLKRF5Z7L9", "3ZAK6NWIZBW899OE6PQOMTJ75ZPV9A", "3ZAK6NWIZBW899OE6PQOMTJ75ZPV9A"];    
      
          
          var test3 = test1.indexOf(previewAndAcceptLink);
          if(test3 === -1){
          var winOpen =  window.open(previewLink, width=100, height=100);
          //var winOpen1 =  window.open(previewLink, width=50, height=50);


                //break;
}
    
}

var myt4 = setTimeout( function() {
            location.reload( true );
       }, 300 );
      ///}, 1000 ); 
    
        

if (test3 === -1){
  clearTimeout(myt4); 
}