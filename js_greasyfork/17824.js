// ==UserScript==
// @name         custom stream buttons
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       BigCIA4U
// @match        http://infinity.moe/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17824/custom%20stream%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/17824/custom%20stream%20buttons.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var newStreams = [
    {"shortText":"BIGCIA4U", "longText":"BigCIA4U's Ustream", "icon":"http://i.imgur.com/ZF3IKlP.gif", "embed":"http://www.ustream.tv/embed/21996843?html5ui"}
];

var streams=document.getElementById("streams");
var streamKids = streams.children;
for(var i=0; i<streamKids.length; i++) {
    if (streamKids[i].nodeType != 1) {
        continue ;
    }
    if (streamKids[i] instanceof HTMLUListElement) {
        
        for(var j=0 ; j<newStreams.length ; j++) {
            var li = document.createElement('li');
            var ahref = document.createElement('a');
            ahref.setAttribute("target", "iframe");
            ahref.setAttribute("href", newStreams[j]["embed"]);
            var img = document.createElement('img');
            img.setAttribute("id", "streamlink");
            img.setAttribute("src", newStreams[j]["icon"]);
            img.setAttribute("title", newStreams[j]["longText"]);
            var span=document.createElement('span');
            span.setAttribute("class", "text-content");
            var span2=document.createElement('span');
            var text=document.createTextNode(newStreams[j]["shortText"]);
            span2.appendChild(text);
            span.appendChild(span2);
            ahref.appendChild(img);
            ahref.appendChild(span);
            li.appendChild(ahref);
            streamKids[i].appendChild(li);
        }
    }
}   