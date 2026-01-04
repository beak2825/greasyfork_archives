// ==UserScript==
// @name        Redirect Google
// @namespace   http://domain.com/directory
// @description Redirect Google to Yahoo!
// @include     http://www.narutoplayers.com.br/?p=status
// @version 0.0.1.20180106191848
// @downloadURL https://update.greasyfork.org/scripts/37098/Redirect%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/37098/Redirect%20Google.meta.js
// ==/UserScript==

//-- global variables
// config # sounds, more can be found @ http://simplythebest.net/sounds/WAV/WAV_sounds.html
var sa_SoundNotify 	= 'http://www.wavsource.com/snds_2017-03-26_2137986549265739/animals/bird.wav';
var sa_SoundWarning = 'http://www.wavsource.com/snds_2017-03-26_2137986549265739/animals/bird.wav';
var sa_SoundAlert 	= 'http://www.wavsource.com/snds_2017-03-26_2137986549265739/animals/bird.wav';
var sa_RandStart = 1; // random value start from X minutes
var sa_RandEnd = 5; // random value end at Y minutes

// !!! no modification needed under this line !!!
var sa_Time = 300; // refresh time in seconds, will be overwritten in sa_init with random value
var sa_Timeout = null; // timeout object
// state variables
var sa_Go = true; // state
var sa_Notify = 0;
var sa_Warning = 0;
var sa_Alert = 0;

window.location.replace("http://www.narutoplayers.com.br/?p=invasao");


//-- functions
// stop countdown
function sa_stop() { clearTimeout(sa_Timeout); sa_Go=false; }
// write notify text
function sa_write(s) { document.getElementById('sa_nlink').innerHTML = s+' &nbsp;'; }
// write time text
function sa_writetime(s) { document.getElementById('sa_slink').innerHTML = s; }
// format given time (seconds) to "Xm Ys" format
function sa_formattedtime() { var sa_min = Math.floor(sa_Time/60); var sa_sec = sa_Time - sa_min*60; return (sa_min>0?sa_min+'m ':'')+sa_sec+'s'; }
// refresh page
function sa_refresh() { sa_writetime('..refresh..'); window.location.reload(); }
// handle notifies
function sa_notify(type) { if(type=='notify') sa_Notify++; else if(type=='warning') sa_Warning++; else if(type=='alert') sa_Alert++; }
// play sound defined in parameter
function sa_sound(snd) { var embed = document.createElement('embed'); embed.setAttribute('hidden','true'); embed.setAttribute('autostart','true'); embed.setAttribute('loop','false'); embed.src = snd; document.getElementById('sa_clink').appendChild(embed); }
// make countdown cycle
