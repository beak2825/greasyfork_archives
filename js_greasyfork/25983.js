// ==UserScript==
// @name         PTH Copy last read link to icon
// @version      0.2
// @description  Copy the last read link to the read/unread/pinned/locked icon
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25983/PTH%20Copy%20last%20read%20link%20to%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/25983/PTH%20Copy%20last%20read%20link%20to%20icon.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var lastreads=document.getElementsByClassName('last_read');
  for(var i=0; i<lastreads.length; i++)
  {
    var l=lastreads[i];
    
    var a=document.createElement('a');
    a.href=l.getElementsByTagName('a')[0].href;
    a.setAttribute('style', 'display: block; width: 10px; height: 15px;');
    l.parentNode.previousElementSibling.appendChild(a);
  }

})();
