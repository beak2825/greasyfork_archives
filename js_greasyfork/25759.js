// ==UserScript==
// @name         PTH Search requests on search pages
// @version      0.2
// @description  Add a link to search pages to search for a request with the same search
// @author       Chameleon
// @include      http*://redacted.ch/torrents.php*searchstr*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25759/PTH%20Search%20requests%20on%20search%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/25759/PTH%20Search%20requests%20on%20search%20pages.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  var before=document.getElementsByClassName('box pad');
  if(before.length === 0)
    before=document.getElementsByClassName('linkbox');
  before=before[0];

  var a=document.createElement('a');
  before.parentNode.insertBefore(a, before);
  a.innerHTML = 'Search Requests';
  a.setAttribute('style', 'display: block; text-align: center;');

  var search="search="+encodeURIComponent(document.getElementById('search_terms').getElementsByTagName('input')[0].value);
  var tags=document.getElementById('tagfilter').getElementsByTagName('input')[0].value;
  if(tags.length > 0)
    search+="&tags="+encodeURIComponent();
  var tags_type0 = document.getElementById('tags_type0').checked;
  var tags_type1 = document.getElementById('tags_type1').checked;
  if(tags_type0 || tags_type1)
    search+="&tags_type="+(tags_type0 ? '0':'1');

  var anyType=false;

  for(var i=1; i<8; i++)
  {
    if(document.getElementById('cat_'+i).checked)
    {
      anyType=true;
    }
  }
  if(anyType)
  {
    for(var i=1; i<8; i++)
    {

      if(document.getElementById('cat_'+i).checked)
      {
        search+="&"+encodeURIComponent("filter_cat["+i+"]=1");
      }
    }
  }

  a.href="/requests.php?"+search;
})();
