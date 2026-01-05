// ==UserScript==
// @name         Ogame Retro Polish letters
// @namespace    Polskie literki w wiadomościach ąśćźż
// @include      http://ogame1304.de/game/index.php?page=messages*
// @version      1.3
// @description  joks@linux.pl
// @author       joks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21740/Ogame%20Retro%20Polish%20letters.user.js
// @updateURL https://update.greasyfork.org/scripts/21740/Ogame%20Retro%20Polish%20letters.meta.js
// ==/UserScript==


(function () {
 "use strict";
 var replacements, regex, key, textnodes, node, s;

 replacements = {
     
       "#261;":'ą',
     "47;":'ś',
     "#263;":'ć',
     "80;":'ż',
     "78;":'ź',
     "#281;":'ę',
     "22;":'ł',
     "24;":'ń',

     "#260;":'Ą',
     "46;":'Ś',
     "#262;":'Ć',
     "79;":'Ż',
     "77;":'Ź',
     "#2ż":'Ę',
     "21;":'Ł',
     "23;":'Ń',


	};

	 regex = {};
 for (key in replacements) {
  regex[key] = new RegExp(key, 'g');
 }

 textnodes = document.evaluate("//body//text()", document, null,
  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

 for (var i = 0; i < textnodes.snapshotLength; i++) {
  node = textnodes.snapshotItem(i);
  s = node.data;
  for (key in replacements) {
   s = s.replace(regex[key], replacements[key]);
  }
  node.data = s;
 }

})();