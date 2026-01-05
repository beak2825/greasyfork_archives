// ==UserScript==
// @name        gamespot expose download links
// @namespace   *.gamespot.*
// @description gamespot video Links appear in the video description next to the social buttons.
// @include     *.gamespot.*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2276/gamespot%20expose%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/2276/gamespot%20expose%20download%20links.meta.js
// ==/UserScript==


var addLinks = function(){  
     var components = $('#kubrick-lead').html().split('{&quot;f4m_stream&quot;:&quot;')[1].split('.csmil')[0].replace(/\\/g, '').replace('/z/','/').replace('/hdv.','/video.').split(',')
     var base = components[0]
     var mediatype = components.slice(-1)[0] 
     var toolbar = document.querySelectorAll('.news-hdr')[0];
     
    for (var i = 1; i < components.length-1; i++) {
       var desiredLink = base + components[i] + mediatype;
       var desiredText = components[i] + " "; 
       var link=document.createElement("a");
       link.appendChild(document.createTextNode(desiredText));
       link.href = desiredLink;
       toolbar.appendChild(link);

    }
    
};

addLinks();


