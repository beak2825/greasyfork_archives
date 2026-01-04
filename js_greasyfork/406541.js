// ==UserScript==
// @name     Facebook Group Pending Posts Deleter
// @description:en Deletes All Pending Facebook Group Posts
// @version  1
// @grant    none
// @include        http://*.facebook.com/*
// @include        https://*.facebook.com/*
// @namespace https://greasyfork.org/users/663733
// @description Deletes All Pending Facebook Group Posts
// @downloadURL https://update.greasyfork.org/scripts/406541/Facebook%20Group%20Pending%20Posts%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/406541/Facebook%20Group%20Pending%20Posts%20Deleter.meta.js
// ==/UserScript==


var i = 0;
function main(){
do {
i = i + 1;


   if (document.getElementsByClassName('layerConfirm')[0] >= 1 && document.getElementsByClassName('layerConfirm')[0] !== undefined) {
      document.getElementsByClassName('layerConfirm')[0].click();
   }
  else (console.error() !== null)
  {document.getElementsByClassName('layerConfirm')[0].click();
}
   if (document.getElementsByClassName('sx_616ed1')[0] >= 1 && document.getElementsByClassName('sx_616ed1')[0] !== undefined) {
      document.getElementsByClassName('sx_616ed1')[0].click();

   }
   else(console.error() !== null)
   {
  document.getElementsByClassName('sx_616ed1')[0].click();
  }
} while (i < 10000); }

  setTimeout(main, 2000);