// ==UserScript==
// @name           netfix
// @version        2.3.9
// @namespace      https:\\derben.ca
// @author         DerBen
/// @license        Public Domain
// @description    skip presser, mute/hide ads. (red green logo shows script is active)
// @run-at         document-end
// @include        https://www.netflix.com/*
// @include        https://www.crave.ca/en/tv-shows/*
// @include        https://www.youtube.com/watch*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/439247/netfix.user.js
// @updateURL https://update.greasyfork.org/scripts/439247/netfix.meta.js
// ==/UserScript==
'use strict';

//console.log('netfix startup');

// ** Sometimes these sites unload this script, just press reload **
// no longer have netflix to test. I have crave now

// edit these if needed, these sites update frequently.
var admut=1; // mute ads
var adblk=0; // hide ads, experimental
setInterval(looper, 2000); //check interval
var nfb=["skip-recap","skip-intro","continue"]; // netflix buttons
var nf=['ltr-m66rkx','ltr-yo6l9w','ad-count','default-ltr-cache-m66rkx']; // netflix data
var yts=["[aria-label^='No thanks']",'ytp-skip-ad-button','ytp-ad-skip-button','ytp-ad-skip-button-modern','ytp-ad-skip-button-icon-modern','ytp-ad-skip-button-text-centered','ytp-ad-skip-button-text','ytp-skip-ad-button__text']; // youtube skip ad data
var ytm=['ytp-ad-preview-image','ytp-ad-preview-container','ytp-ad-preview-container-detached','ytp-preview-ad__text'] //yt mute ad
//var cr=['bm-view-skipbreaks1',"div[class='skipbreaks-click-area']"]; // old crave skip data
var cr=['button','aria-label','Skip Intro']; // crave skip data

// Don't edit below!
var host=location.hostname;
var vt=1,at=1; // video audio toggles
var sk=0,skip=0; //skip timing variables
var texb = document.createElement('div');
 texb.id='cgwin';
 texb.style.top='0px';
 texb.style.left='0px';
 texb.style.position='fixed';
 texb.style.background='black';
 texb.style.border='green 2px solid';
 texb.style.borderRadius='25px';
 texb.style.font='12px arial';
 texb.style.color='grey';
 texb.style.zIndex='99999';
 texb.innerHTML='netfix';


function looper(){
 //console.log('loop');
 var nflogo=document.getElementById('cgwin');
 if (typeof(nflogo) === 'undefined' || nflogo==null) {
  try { document.body.appendChild(texb); }
  catch(error){ console.log('netfix no append');}
 } else {
  nflogo.style.border= Math.floor(Math.random() * 2) ? 'green 2px solid' :  'red 2px solid';
 }

 if (skip>0) {
  skip--; sk=1;
  //console.log('skip');
  return;
 }

 if (host=='www.crave.ca') { crave(); }
 if (host=='www.youtube.com') { youtube(); }
 if (host=='www.netflix.com') { netflix(); }
}

function clkd(clkhere,typ=0){
 event = document.createEvent('HTMLEvents');
 event.initEvent('click', true, false);
 if (typ==0){
  document.querySelector(clkhere).dispatchEvent(event);
 } else {
  clkhere.dispatchEvent(event);
 }
 return;
}


function netflix(){
 //console.log('netflix funct');
 var mute=0;
 for(var i=0;i<nf.length;i++) {
  var pin=document.getElementsByClassName(nf[i]);
  if (pin.length){ mute=1; }
 }

 if (location.pathname.includes("watch")){
  if (mute==1){
    if (admut && !at){
     document.getElementsByTagName("video")[0].muted=true;
     at=1;
    }
    if (adblk && !vt){
     document.getElementsByTagName("video")[0].hidden=true
     vt=1;
    }
  } else {
   if (admut && at){
    document.getElementsByTagName("video")[0].muted=false;
    at=0;
   }
   if (adblk && vt){
    document.getElementsByTagName("video")[0].hidden=false
    vt=0;
   }
  }
 }

 var butt=document.getElementsByTagName('button');
 for(var i=0;i<butt.length;i++) {
  //console.log(i, butt[i].dataset);
  for(var ii=0;ii<nfb.length;ii++) {
   var regex = new RegExp(nfb[ii], "g");
   //console.log(nf[ii])
   if (regex.test(butt[i].dataset.uia)){
    skip=5;
   }
  }
  if (skip>=4) {
   //console.log('skipping');
   clkd(butt[i],2);
   break;
  }
 }
}


function crave(){
 //console.log('crave funct');
  /*
 var crsk=document.getElementById(cr[0]);
 if (typeof(crsk) === 'undefined' || crsk==null) {
  //console.log('no vid');
 } else {
  //console.log('vid'+crsk.style.display);
  if (crsk.style.display=='block'){
   console.log('CR skip');
   clkd(cr[1]);
  }
 }
 */
 var crsk=document.getElementsByTagName(cr[0]);
 for(var ii=0;ii<crsk.length;ii++) {
  //console.log(crsk[ii].ariaLabel);
  if (crsk[ii].ariaLabel=="Skip Intro") {
    crsk[ii].click();
  }
 }
}

function youtube(){
 //console.log('YT check!');
 const pop=document.querySelectorAll(yts[0]); // skip popup
 if (typeof(pop[0]) !== 'undefined') {
  //console.log('YT popped!');
  pop[0].click();
 }
 //console.log('youtube funct');
 const vid=document.getElementsByTagName("video");

 for(var i=0;i<ytm.length;i++) {
  var crsk=document.getElementsByClassName(ytm[i]); // mute ad playing
  if (typeof(crsk[0]) === 'undefined' || crsk==null) {
   //console.log('YT unmuted');
   if (admut && vid[0].muted!=false) { vid[0].muted=false; }
  } else {
   //console.log('YT muted!');
   if (admut && vid[0].muted==false) { vid[0].muted=true; }
  }
 }
 for(var i=1;i<yts.length;i++) {
  var crsk=document.getElementsByClassName(yts[i]); //skip button shown
  console.log('c',crsk[0]);
  if (typeof(crsk[0]) === 'undefined' || crsk==null) {
   console.log('no skip');
  } else {
   console.log('YT skip');
   clkd(crsk[0],1);
   clkd(crsk[0]);
  }
 }
}