// ==UserScript==
// @name         PTH Request + Torrent notes
// @version      0.2
// @description  Store notes on requests at PTH
// @author       Chameleon - (Denlekke edit)
// @include      http*://*redacted.ch/requests.php*
// @include      http*://*redacted.ch/torrents.php*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/30741/PTH%20Request%20%2B%20Torrent%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/30741/PTH%20Request%20%2B%20Torrent%20notes.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var before=document.getElementById('request_comments');
  if(!before)
    before=document.getElementById('torrent_comments');
  if(!before)
    return;
  
  var requestId=parseInt(window.location.href.split('id=')[1]);
  var comment=getComment(requestId);
  var div=document.createElement('div');
  before.parentNode.insertBefore(div, before);
  div.setAttribute('class', 'box box2');
  div.innerHTML='<div class="head"><strong>Notes</strong></div>';
  var pad=document.createElement('div');
  pad.setAttribute('class', 'pad');
  div.appendChild(pad);
  var t=document.createElement('textarea');
  t.setAttribute('id', 'requestNotes');
  t.setAttribute('style', 'width: 100%;');
  t.rows="8";
  pad.appendChild(t);
  t.value=comment;
  t.addEventListener('keyup', save.bind(undefined, requestId, t), false);
  resize('requestNotes');
})();

function save(id, t)
{
  var notes=window.localStorage.requestNotes;
  if(!notes)
    notes=[];
  else
    notes=JSON.parse(notes);
  
  var noteExisted=false;
  for(var i=0; i<notes.length; i++)
  {
    if(notes[i].id === id)
    {
      notes[i].comment=t.value;
      noteExisted=true;
      break;
    }
  }
  if(!noteExisted)
  {
    notes.push({id:id, comment:t.value});
  }
  
  window.localStorage.requestNotes=JSON.stringify(notes);
  resize('requestNotes');
}

function getComment(id)
{
  var notes=window.localStorage.requestNotes;
  if(!notes)
    notes=[];
  else
    notes=JSON.parse(notes);
  
  for(var i=0; i<notes.length; i++)
  {
    if(notes[i].id === id)
      return notes[i].comment;
  }
  
  return '';
}
