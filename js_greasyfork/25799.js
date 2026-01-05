// ==UserScript==
// @name         PTH Record label collages on search
// @version      0.3
// @description  Show record label collages on searches that include a record label
// @author       Chameleon
// @include      http*://redacted.ch/torrents.php*recordlabel=*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25799/PTH%20Record%20label%20collages%20on%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/25799/PTH%20Record%20label%20collages%20on%20search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var recordLabel = window.location.href.split('recordlabel=')[1].split('&')[0];

  var div=document.createElement('div');
  var stylesheets=document.styleSheets;
  var color=false;
  for(var i=0; i<stylesheets.length; i++)
  {
    var s=stylesheets[i];
    for(var j=0; j<s.cssRules.length; j++)
    {
      var r=s.cssRules[j];
      if(r.selectorText.indexOf('tr.group,') != -1)
      {
        color=r.cssText.split('{ ')[1].split(' }')[0];
        break;
      }
    }
    if(color)
      break;
  }
  if(!color)
    color='color: rgba(0,0,0,0.5);';
  div.setAttribute('style', 'text-align: center; '+color+'; margin: 10px 0 10px 0;');
  var before=document.getElementsByClassName('box filter_torrents')[0].parentNode.nextElementSibling;
  before.parentNode.insertBefore(div, before);

  getCollages(recordLabel, div);
})();

function getCollages(recordLabel, div)
{
  div.innerHTML = 'Found record label in search, searching collages for it.';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/collages.php?action=search&search='+encodeURIComponent(recordLabel)+'&cats%5B4%5D=1');
  xhr.onreadystatechange = xhr_func.bind(undefined, div, xhr, gotCollages.bind(undefined, recordLabel, div), getCollages.bind(undefined, recordLabel, div));
  xhr.send();
}

function gotCollages(recordLabel, div, response)
{
  var result=[];

  var d=document.createElement('div');
  d.innerHTML = response;

  var trs=d.getElementsByClassName('collage_table');
  if(trs.length === 0)
  {
    showCollages(result, div, recordLabel);
    return;
  }
  trs=trs[0].getElementsByTagName('tr');

  for(var i=1; i<trs.length; i++)
  {
    var tds=trs[i].getElementsByTagName('td');
    var r={};
    r.collage = tds[1].getElementsByTagName('a')[0].outerHTML;
    r.tags = tds[1].getElementsByTagName('div')[0].innerHTML;
    r.torrents = tds[2].innerHTML;
    r.subscribers = tds[3].innerHTML;
    r.updated = tds[4].innerHTML;
    r.author = tds[5].innerHTML;

    result.push(r);
  }

  showCollages(result, div, recordLabel);
}

function showCollages(result, div, recordLabel)
{
  recordLabel=decodeURIComponent(recordLabel.replace(/\+/g, ' '));
  if(result.length === 0)
  {
    div.innerHTML = 'No collages appear to have been made for label: '+recordLabel+'.<br /><a href="/collages.php?action=search&search='+encodeURIComponent(recordLabel)+'&cats%5B4%5D=1">Go to collage search</a>';
  }
  else if(result.length === 1)
  {
    var r=result[0];
    div.innerHTML = 'Collage: '+r.collage+', authored by '+r.author+'<br />'+r.torrents+' torrents, '+r.subscribers+' subscribers<br />Last updated: '+r.updated;
    if(r.tags.length > 0)
      div.innerHTML += '<br />Tags: '+r.tags;
  }
  else
  {
    div.innerHTML = result.length+' collages match the label \''+recordLabel+'\'<br /><a href="/collages.php?action=search&search='+encodeURIComponent(recordLabel)+'&cats%5B4%5D=1">Go to collage search</a>';
    for(var i=0; i<result.length; i++)
    {
      var r=result[i];
      div.innerHTML += '<br /><br />Collage: '+r.collage+', authored by '+r.author+'<br />'+r.torrents+' torrents, '+r.subscribers+' subscribers<br />Last updated: '+r.updated;
      if(r.tags.length > 0)
        div.innerHTML += '<br />Tags: '+r.tags;
    }
  }
}

function xhr_func(messageDiv, xhr, func, repeatFunc)
{
  if(xhr.readyState == 4)
  {
    if(xhr.status == 200)
      func(xhr.responseText);
    else
    {
      messageDiv.innerHTML = 'Error: '+xhr.status+'<br />retrying in 1 second';
      window.setTimeout(repeatFunc, 1000);
    }
  }
}
