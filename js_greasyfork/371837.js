// ==UserScript==
// @name         rock_radio_show
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://rockradioua.online/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371837/rock_radio_show.user.js
// @updateURL https://update.greasyfork.org/scripts/371837/rock_radio_show.meta.js
// ==/UserScript==

(function() {

function notifyMe(mess)
{
  if (Notification.permission !== "granted")
  {
    Notification.requestPermission();
  }
  else
  {
    var notification = new Notification(mess);
  };

}
var elems;
var bb;
var old_bb;

 function prefresh()
 {

     setTimeout(prefresh, 3000);
     elems = document.getElementById('track_name');
     bb=elems.innerHTML

     if (bb!=old_bb)
     {
         old_bb=bb;
         bb = bb.replace('<div style="font-size: 20px; margin-bottom: 10px">', "");
         bb = bb.replace('</div><strong>', " - ");
         bb = bb.replace('</strong><div class="album" style="display:none"></div>', "");
         bb=bb.replace(/(?!(\<br\>|\<br\s\/\>))<\/?[^>]+>/g, '_');
         if(bb.indexOf('Океан') + 1)
         {
             $('#jquery_jplayer_1').jPlayer("mute");
         }
         else
         {
             $('#jquery_jplayer_1').jPlayer("unmute");
         }
         document.title = bb;
         notifyMe(bb);
     }



 }
prefresh();
    // Your code here...
})();

