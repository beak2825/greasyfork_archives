// ==UserScript==
// @name         Neopets pet image swapper
// @namespace    petimageswapper
// @version      0.1
// @description  read the name
// @match        *.neopets.com/userlookup.phtml?user=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35874/Neopets%20pet%20image%20swapper.user.js
// @updateURL https://update.greasyfork.org/scripts/35874/Neopets%20pet%20image%20swapper.meta.js
// ==/UserScript==

$('document').ready(function(){
  var pets = $('#bxlist > li');
  for (var i = 0; i < pets.length; i++) {
    //alert($('.medText > center > b:first-of-type', pets[i]).text());
    //alert($('.medText > a > img', pets[i]).attr("src"));
    $('.medText > a > img', pets[i]).attr("src", "http://pets.neopets.com/cpn/" + $('.medText > center > b:first-of-type', pets[i]).text() + "/2/2.png");
  }
  $('#bxlist').attr("id", "");
});