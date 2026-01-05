// ==UserScript==
// @name         PTH Search requests on failed search
// @version      0.3
// @description  Add a link to the 'Your search did not match anything' page to search for a request with the same search
// @author       Chameleon
// @include      http*://redacted.ch/torrents.php*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25758/PTH%20Search%20requests%20on%20failed%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/25758/PTH%20Search%20requests%20on%20failed%20search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(document.body.innerHTML.indexOf('Your search did not match anything.') != -1)
  {
    var a=document.createElement('a');
    a.innerHTML = 'Search Requests';
    var b=document.getElementsByClassName('box pad')[0];
    b.appendChild(document.createElement('br'));
    b.appendChild(a);

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

    //a.href='javascript:void(0);';
    //a.addEventListener('click', searchRequests, false);
  }
})();

function searchRequests()
{
  var form=document.createElement('form');
  form.setAttribute('action', '/requests.php');
  form.setAttribute('action_method', 'get');

  var search=document.getElementById('search_terms').getElementsByTagName('input')[0];
  search.setAttribute('name', 'search');
  form.appendChild(search);

  var tags=document.getElementById('tagfilter').getElementsByTagName('input')[0];
  tags.setAttribute('name', 'tags');
  form.appendChild(tags);

  form.appendChild(document.getElementById('tags_type0'));
  form.appendChild(document.getElementById('tags_type1'));

  for(var i=1; i<8; i++)
  {
    form.appendChild(document.getElementById('cat_'+i));
  }

  form.submit();
}
