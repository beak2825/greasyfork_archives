// ==UserScript==
// @name       Disable youtubeblocker
// @namespace  http://gipacu
// @version    0.9
// @description Removes the retarded "Share to View" social crap on sites that use youtubeblocker
// @match      http://*/*
// @copyright  2014
// @downloadURL https://update.greasyfork.org/scripts/1975/Disable%20youtubeblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/1975/Disable%20youtubeblocker.meta.js
// ==/UserScript==

// @match         http://www.covvotto.com*
// @match         http://situazionivirali.com*
// @match         http://esperimentisociali.it*
// @match         http://guardacheocchi.com*

var o = document.getElementsByClassName('image');
for (var i = 0; i < o.length; i++) {
    var videoid = o[i].getAttribute('style');
    var videoid2=videoid.substring(49,60);    
   console.log('Unblocking ' + videoid2);
 };

var o = document.getElementsByClassName('youtubeblocker');
for (var i = 0; i < o.length; i++) {
    
    var iframe = document.createElement('iframe');
    iframe.src='//www.youtube.com/embed/' + videoid2 + '?rel=0';
    iframe.width='560';
    iframe.height='315';
    iframe.frameborder='0';
    iframe.setAttribute('allowfullscreen','');
    o[i].outerHTML=iframe.outerHTML;
 };


if (window.location.href.toString().match('funnyclipe')) {
    blocker = document.getElementById('pampam');
    blocker.parentNode.removeChild(blocker);
    video = document.getElementById('video-wrapper');
    video.setAttribute('style','display:visible');
}