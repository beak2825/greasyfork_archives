// ==UserScript==
// @name Social Limit
// @namespace Fusir Projects
// @description Prevents being on social media too long
// @match *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version 0.0.1.20190309201947
// @downloadURL https://update.greasyfork.org/scripts/379458/Social%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/379458/Social%20Limit.meta.js
// ==/UserScript==

const LIMIT = 1000*60*15;
const COOLDOWN = 1000*60*15;


var socialmedia = ['voat.co','phuks.co','notabug.io','hooktube.com','invidio.us',
'reddit.com','facebook.com','twitter.com','gab.io','poal.co','instagram.com',
'youtube.com'];
socialmedia = new Set(socialmedia);

var isalert=false; //Used to not count visits while being alerted so going back prematurely doesn't reset the whole cool down.

function onfocus() {
var earliest = GM_getValue('earliest') || null;
  var latest = GM_getValue('latest') || 0;
  if(Date.now()-latest>COOLDOWN) {
   console.log('Set new earliest');
   earliest=Date.now();
  }
  latest=Date.now();
  if(earliest && Date.now()-earliest>LIMIT) {
   isalert=true;
   alert('Close all social media');
  }
  else {
   alerttimeout = setTimeout(()=>{
    isalert=true;
    alert('Close all social media');
   },LIMIT+earliest-Date.now());
   isalert = false;
   GM_setValue('latest',latest);
  }
  GM_setValue('earliest',earliest);
}

if(socialmedia.has(location.hostname)) {
 console.log('Is social media');
 var alerttimeout = null;
 onfocus();
 $(window).focus(onfocus);
 $(window).blur(()=>{
  if(alerttimeout) {
   clearTimeout(alerttimeout);
  }
  if(!isalert) {
   //If we are being alerted don't count it as a view.
   GM_setValue('latest',Date.now());
  }
 });
}