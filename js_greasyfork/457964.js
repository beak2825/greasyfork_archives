// ==UserScript==
// @name         pinterest sucks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pinterest image swapper
// @author       You
// @match        https://www.pinterest.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457964/pinterest%20sucks.user.js
// @updateURL https://update.greasyfork.org/scripts/457964/pinterest%20sucks.meta.js
// ==/UserScript==

const $ = window.jQuery;

waitForKeyElements (
    "#__PWS_ROOT__",
    obsv
);

function obsv(){
// Select the node that will be observed for mutations
const targetNode = document.getElementById('__PWS_ROOT__');

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      replaceImages();
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
}

function replaceImages(){
     $('[data-test-id="suggested-interests"]').remove();
    var pins = $('[role="listitem"]');
    for(var i=0;i<pins.length;i++){
     if($(pins[i]).hasClass('addedButton')==false){
$(pins[i]).toggleClass('addedButton');
         var image = $(pins[i]).find('img');
         image = image.attr('src');
         image = image.replace('236x','originals');
         var req = new XMLHttpRequest();
         req.open('GET', image, false);
         req.send();
         if (req.status === 400 || req.status === 403 || req.status === 404) {
             console.log('asddfasfasdfasd');
             image = image.replace('jpg','png');
             $(pins[i]).append('<img class="buttonOverride" style="width:100%;height:100%;background:red;position:absolute;top:0;left:0;" src="'+image+'"></img>');
         }
         else{
         $(pins[i]).append('<img class="buttonOverride" style="width:100%;height:100%;background:red;position:absolute;top:0;left:0;" src="'+image+'"></img>');
     }}
    }
};
