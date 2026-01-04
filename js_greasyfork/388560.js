// ==UserScript==
// @name         Github Batch Open Tabs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Batch Open Github Search Results.
// @author       v4IIII
// @match        https://www.github.com/
// @connect         www.github.com
// @include         *://*github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388560/Github%20Batch%20Open%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/388560/Github%20Batch%20Open%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';
var c2=[];
var c0=document.getElementsByTagName('a');
    console.log(c0);
for (var i=0;i<c0.length;i++){
    var c1=c0[i].getAttribute('class');
    if (c1==="v-align-middle"){c2.push(c0[i].href);};
/*  try{var c1=c0[i].firstChild.nextSibling.href;}catch(err){c1=null;}
  try{var c3=c0[i].firstChild.href;}catch(err){c3=null;}
      console.log(c1);
  console.log(c3);
  if(c1===undefined){}else{if(c1===null){}else{c2.push(c1);}}
  if(c3===undefined){}else{if(c3===null){}else{c2.push(c3);}}*/
};
console.log(c2);

function fm(a){
  let handle=window.open(a);
  handle.blur();
  window.focus();
};

for (i=0;i<c2.length;i++){
  fm(c2[i]);
}
    // Your code here...
})();