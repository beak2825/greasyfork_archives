// ==UserScript==
// @name         Discogs search export notes
// @version      0.1
// @description  Store notes on torrents at PTH
// @author       Chameleon - (Denlekke edit)
// @include      http*://www.discogs.com/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/133827-den-lekke
// @downloadURL https://update.greasyfork.org/scripts/37302/Discogs%20search%20export%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/37302/Discogs%20search%20export%20notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

//here
    if(window.location.href.includes("search/?")){

    var list=document.getElementsByClassName('search_result_title ');
    //alert(list.length);
    var releaseId;
    var comment;
    var div;
    var pad;
    var t;
    var before;

    var before2=document.getElementsByClassName('pagination bottom ')[0];
    var div2=document.createElement('div');
  before2.parentNode.insertBefore(div2, before);
  div2.setAttribute('class', 'box box2');
  div2.innerHTML='<div class="head"><strong>Notes</strong></div>';
  var pad2=document.createElement('div');
  pad2.setAttribute('class', 'pad');
  div2.appendChild(pad2);
  var t2=document.createElement('textarea');
  t2.setAttribute('id', 'discogsNotes2');
  t2.setAttribute('style', 'width: 100%;');
  t2.rows="4";
  pad2.appendChild(t2);


    for(var i=0; i<list.length; i++){



        before=list.item(i);
        window.open(before.href);
        console.log('before');
wait(1200);  //7 seconds in milliseconds
console.log('after');
        if(!before)
            return;
        releaseId=parseInt(before.href.split('release/')[1]);
        //alert("atgetcomment");
        comment=getComment(releaseId);
        //div=document.createElement('tr');
        //before.parentNode.insertBefore(div, before.nextSibling);
        //div.setAttribute('class', 'group note');
        //pad=document.createElement('td');
        //pad.setAttribute('colspan', '7');
        //div.appendChild(pad);
        //t=document.createElement('textarea');
        //t.setAttribute('id', 'discogsNotes');
        //t.setAttribute('style', 'width: 99%;');
        //t.rows="1";
        //pad.appendChild(t);
        t2.value=t2.value+"\n"+(i+1)+"|"+comment;
        //resize('discogsNotes');
    }
       }




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

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}