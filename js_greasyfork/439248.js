// ==UserScript==
// @name           YouTube 3D SBS
// @description    disables anaglyph to show 3D SBS in youtube (2022)
// @author         DerBen
// @namespace      https://derben.ca
// @version        1.1
// @license        Public Domain
// @grant          none
// @include        https://www.youtube.com/watch*
// @downloadURL https://update.greasyfork.org/scripts/439248/YouTube%203D%20SBS.user.js
// @updateURL https://update.greasyfork.org/scripts/439248/YouTube%203D%20SBS.meta.js
// ==/UserScript==

window.addEventListener('load', function() { setInterval(DBfun, 2000); }, false);
dbsbs=0;

function DBfun() {
 var texb = document.createElement('div');
 texb.id="dbwin";
 texb.style.cursor = "pointer"; 
 texb.style.top='0px';
 texb.style.left='0px';
 texb.style.background='black';
 texb.style.color='white';
 texb.style.border='green 2px solid';
 texb.style.borderRadius="25px";
 texb.style.position="fixed";
 texb.style.font="12px arial";
 texb.style.zIndex='99999';
 texb.innerHTML='3D SBS';
 texb.onclick=function(){sbson(); };
 dbcan=document.getElementsByTagName('canvas');
 //console.log(document.getElementById('dbwin'));
 if (dbcan.length>0) {
  if (document.getElementById('dbwin')==null){
   document.body.appendChild(texb);
  }
 }else{ document.getElementById('dbwin').remove(); }
}
function sbson() {
 if (dbsbs==0){
  document.getElementsByTagName('canvas')[0].style.display="none";
  document.getElementsByTagName('video')[0].style.display="block";
  document.getElementById('dbwin').innerHTML="Anaglyph";
  dbsbs=1;
 }else{
  document.getElementsByTagName('canvas')[0].style.display="block";
  document.getElementsByTagName('video')[0].style.display="none";
  document.getElementById('dbwin').innerHTML="3D SBS";
  dbsbs=0;
 }
}