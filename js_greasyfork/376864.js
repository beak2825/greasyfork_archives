// ==UserScript==
// @name KimCartoonAntiEarrape
// @namespace KimCartoonBoiz
// @description Removes earrape intro from KimCartůn.
// @description:en Removes earrape intro from KimCartůn.
// @author TitoDick69XLoliFan420Fakfest
// @include http://kimcartoon.*/*
// @include https://kimcartoon.*/*
// @include http://www.kimcartoon.*/*
// @include http://www.kimcartoon.*/*
// @include http://rapidvideo.*/*
// @include https://rapidvideo.*/*
// @include http://www.rapidvideo*/*
// @include https://www.rapidvideo.*/*
// @version 0.69m9
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/376864/KimCartoonAntiEarrape.user.js
// @updateURL https://update.greasyfork.org/scripts/376864/KimCartoonAntiEarrape.meta.js
// ==/UserScript==
  var myelementz = [];
  var thresh=6;

setInterval(function(){
   ProcezzVideoz(document);
},350);

function ProcezzVideoz(docme)
{
     var lizt = document.getElementsByTagName("video");
    for (i = 0; i < lizt.length; i++) {
      if(lizt[i].currentTime<thresh)
       {
         lizt[i].currentTime=thresh;
       }
      if(myelementz.indexOf(lizt[i].getAttribute("src"))<0)
     {
       myelementz.push(lizt[i].getAttribute("src"));
       lizt[i].addEventListener('loadedmetadata', function() {
         if(this.playing)
         {
           this.currentTime = thresh;
         }
         }, false);
     }
  }
}