// ==UserScript==
// @name         Discogs list export notes, from a personal list
// @version      0.1
// @description  Store notes on torrents at PTH
// @author       Chameleon - (Denlekke edit)
// @include      http*://*discogs.com/lists/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/133827-den-lekke
// @downloadURL https://update.greasyfork.org/scripts/370275/Discogs%20list%20export%20notes%2C%20from%20a%20personal%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/370275/Discogs%20list%20export%20notes%2C%20from%20a%20personal%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list=document.getElementsByClassName('listitem body_row row_with_actions shortcut_navigable');
    //var list2 = document.getElementsByClassName('group discog');
    var releaseId;
    var comment;
    var div;
    var pad;
    var t;
    var before;
var torrentId;
    var pageBottom=document.getElementsByClassName('pagination bottom')[0];

    var div2=document.createElement('div');
  pageBottom.parentNode.insertBefore(div2, pageBottom);
  div2.setAttribute('class', 'box box2');
  div2.innerHTML='<div class="head"><strong>Notes</strong></div>';
  var pad2=document.createElement('div');
  pad2.setAttribute('class', 'pad');
  div2.appendChild(pad2);
  var t2=document.createElement('textarea');
  t2.setAttribute('id', 'torrentNotes2');
  t2.setAttribute('style', 'width: 100%;');
  t2.rows="4";
  pad2.appendChild(t2);


    for(var i=0; i<list.length; i++){

        before=list.item(i);
        if(!before)
            return;
        torrentId=parseInt(before.id.split('_R_')[1]);
        
        comment=getComment(torrentId);
        //div=document.createElement('tr');
        //before.parentNode.insertBefore(div, before.nextSibling);
        //div.setAttribute('class', 'group note');
        //pad=document.createElement('td');
        //pad.setAttribute('colspan', '7');
        //div.appendChild(pad);
        //t=document.createElement('textarea');
        //t.setAttribute('id', 'torrentNotes');
        //t.setAttribute('style', 'width: 99%;');
        //t.rows="1";
        //pad.appendChild(t);
        t2.value=t2.value+"\n"+(i+1)+"|"+comment;
        //resize('torrentNotes');
    }
    //alert(torrentId);

})();


function getComment(id)
{
    var notes=window.localStorage.discogsNotes;
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

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}