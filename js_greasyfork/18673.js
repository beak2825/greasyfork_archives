// ==UserScript==
// @name         Blockerar postare på fz forum
// @namespace    Blockera_ointressanta_postare
// @author       Notumforce
// @description  Blockerar postare på fz forum och gör ditt liv skönare.
// @include      http://www.fz.se/forum/*
// @version 0.0.1.20160410220315
// @downloadURL https://update.greasyfork.org/scripts/18673/Blockerar%20postare%20p%C3%A5%20fz%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/18673/Blockerar%20postare%20p%C3%A5%20fz%20forum.meta.js
// ==/UserScript==

var tag = document.getElementsByTagName("span");
for(var c=0;c<=tag.length;c++){
  if(tag[c].innerHTML=="läggin postarens id här"){
    var rem = tag[c].parentNode.parentNode.parentNode;
    rem.parentNode.removeChild(rem);
  }
}