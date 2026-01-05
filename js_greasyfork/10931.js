// ==UserScript==
// @name        Yahoo Mail Attachment List in Print View
// @version     0.9
// @description Extract attachment list from the message and add it to the end of the print view (2015-07-12)
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @license     BSD with restriction
// @include     https://*.mail.yahoo.com/neo/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10931/Yahoo%20Mail%20Attachment%20List%20in%20Print%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/10931/Yahoo%20Mail%20Attachment%20List%20in%20Print%20View.meta.js
// ==/UserScript==

// Only in Print windows
var plink = document.querySelector('td a[href*="window.print"]');
if (plink) if(document.title == "Print"){
  // Get a reference to the message being printed (fails after reload?)
  var m=window.opener.document.querySelector(".tab-content:not(.offscreen)"); 
  // Examiner footer section of the message for possible attachments
  var f=m.querySelector(".base-card-footer"); 
  var atts=f.querySelectorAll(".tictac-att-other,.tictac-att-thumb"); 
  // If attachments were found, build a list and insert it
  if(atts.length>0) {
    var imglist="", thumbs="", uriTemp, otherlist=""; 
    for(var i=0; i<atts.length; i++){
      if(atts[i].className.indexOf("has-thumb")>-1){
        // Gather URLs of thumbnails for image attachments, as well as the image titles
        imglist+="<br>"+atts[i].getAttribute("title");
        uriTemp=atts[i].style.backgroundImage;
        uriTemp=uriTemp.substr(uriTemp.indexOf("https://"));
        thumbs+='<img src="'+uriTemp.substr(0,uriTemp.lastIndexOf('"')-1)+'"> ';
      } else {
        // Gather titles of non-image attachments
        otherlist+="<br>"+atts[i].getAttribute("title"); 
      }
    } 
    // Insert attachment list (images first)
    var d=document.createElement("div"); 
    d.innerHTML="<b>" + atts.length + " Attachments:</b>";
    if(imglist.length > 0) d.innerHTML+="<br>"+thumbs+imglist;
    if(otherlist.length > 0) d.innerHTML+=otherlist;
    document.body.appendChild(d); 
    d.setAttribute("style", "border-top:2px solid #aaa; margin-top:1em; padding-top:0.5em; font-family:sans-serif;");
  }
}
/*
Copyright (c) 2015 Jefferson Scher. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met and subject to the following restriction:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

RESTRICTION: USE WITH ANY @include or @match THAT COVERS FACEBOOK.COM IS PROHIBITED AND UNLICENSED.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/