// ==UserScript==
// @name         RED Bookmark notes
// @version      0.1
// @description  Store notes on torrents at PTH
// @author       Chameleon - (Denlekke edit)
// @include      http*://*redacted.ch/bookmarks.php*
// @grant        none
// @namespace    https://greasyfork.org/en/users/133827-den-lekke
// @downloadURL https://update.greasyfork.org/scripts/30772/RED%20Bookmark%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/30772/RED%20Bookmark%20notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list=document.getElementsByClassName('group discog');
    var torrentId;
    var comment;
    var div;
    var pad;
    var t;
    var before;
    for(var i=0; i<20; i++){
       
        before=list.item(i);
        if(!before)
            return;
        torrentId=parseInt(before.id.split('group_')[1]);
        comment=getComment(torrentId);
        div=document.createElement('tr');
        before.parentNode.insertBefore(div, before.nextSibling);
        div.setAttribute('class', 'group note');
        pad=document.createElement('td');
        pad.setAttribute('colspan', '7');
        div.appendChild(pad);
        t=document.createElement('textarea');
        t.setAttribute('id', 'torrentNotes');
        t.setAttribute('style', 'width: 99%;');
        t.rows="1";
        pad.appendChild(t);
        t.value=comment;
        t.addEventListener('keyup', save.bind(undefined, torrentId, t), false);
        resize('torrentNotes');
    }
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

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}