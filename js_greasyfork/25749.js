// ==UserScript==
// @name         PTH Everynoise
// @version      0.3
// @description  Add everynoise.com overload (ctrl+click) to every tag link
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25749/PTH%20Everynoise.user.js
// @updateURL https://update.greasyfork.org/scripts/25749/PTH%20Everynoise.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var as=document.getElementsByTagName('a');
  for(var i=0; i<as.length; i++)
  {
    var a=as[i];
    if(a.href.indexOf('torrents.php?taglist=') == -1)
      continue;
    a.addEventListener('click', everynoise.bind(undefined, a), false);
  }
})();

function everynoise(a, event)
{
  if(event.ctrlKey || event.cmdKey)
  {
    event.preventDefault();
    var href="http://everynoise.com/engenremap-"+(a.innerHTML.replace(/\./g, ''))+'.html';
    window.open(href, '_blank');
  }
}
