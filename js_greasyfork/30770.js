// ==UserScript==
// @name         RED Torrent notes
// @version      0.3
// @description  Store notes on torrents at PTH
// @author       Chameleon - (Denlekke edit)
// @include      http*://*redacted.ch/torrents.php*
// @grant        none
// @namespace    https://greasyfork.org/en/users/133827-den-lekke
// @downloadURL https://update.greasyfork.org/scripts/30770/RED%20Torrent%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/30770/RED%20Torrent%20notes.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var before=document.getElementById('torrent_details');
  if(!before)
    return;
  
  var torrentId=parseInt(window.location.href.split('id=')[1]);
  var comment=getComment(torrentId);
  var div=document.createElement('div');
  before.parentNode.insertBefore(div, before);
  div.setAttribute('class', 'box box2');
  div.innerHTML='<div class="head"><strong>Notes</strong></div>';
  var pad=document.createElement('div');
  pad.setAttribute('class', 'pad');
  div.appendChild(pad);
  var t=document.createElement('textarea');
  t.setAttribute('id', 'torrentNotes');
  t.setAttribute('style', 'width: 100%;');
  t.rows="4";
  pad.appendChild(t);
  t.value=comment;
  t.addEventListener('keyup', save.bind(undefined, torrentId, t), false);
  resize('torrentNotes');
})();

function save(id, t)
{
  var notes=window.localStorage.torrentNotes;
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
  
  window.localStorage.torrentNotes=JSON.stringify(notes);
  resize('torrentNotes');
}

function getComment(id)
{
  var notes=window.localStorage.torrentNotes;
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
