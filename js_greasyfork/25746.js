// ==UserScript==
// @name         PTH Derefer
// @version      0.2
// @description  Derefer external links on PTH
// @author       Chameleon
// @include      http*://*redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25746/PTH%20Derefer.user.js
// @updateURL https://update.greasyfork.org/scripts/25746/PTH%20Derefer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var as=document.getElementsByTagName('a');
  for(var i=0; i<as.length; i++)
  {
    var a=as[i];
    if(a.href.indexOf(window.location.host) == -1 && a.href.indexOf('javascript') !== 0)
    {
      a.href = "https://anonym.to/?"+encodeURIComponent(a.href);
    }
  }
})();
