// ==UserScript==
// @name         Open SoundCloud album picture
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       DOO
// @match        https://soundcloud.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376646/Open%20SoundCloud%20album%20picture.user.js
// @updateURL https://update.greasyfork.org/scripts/376646/Open%20SoundCloud%20album%20picture.meta.js
// ==/UserScript==

(function() {
    setInterval(function(){
        try{
                /*$('.sound__coverArt').each(function(i,el){
                    el.href=el.childNodes[1].childNodes[1].style.backgroundImage.split('\"')[1];
                    el.setAttribute('target', '_blank');
                });*/
                var adj = document.getElementsByClassName("imageContent")[0].childNodes[2];
                var ul = adj.childNodes[1].style.backgroundImage.split('\"')[1];
                var sp = adj.innerHTML;
                adj.innerHTML="<a href='"+ul+"' target='_blank'>"+sp+"</a>"
       }catch(e){}
    },500);
    //imageContent
    // Your code here...
})();