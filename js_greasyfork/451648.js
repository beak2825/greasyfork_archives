// ==UserScript==
// @name         9gag - Scroll down to current position
// @namespace    https://github.com/Procyon-b
// @version      0.3.1
// @description  Scroll down back where the focus was when you clicked the arrow-up icon or scrolled up
// @author       Achernar
// @match        https://9gag.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451648/9gag%20-%20Scroll%20down%20to%20current%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/451648/9gag%20-%20Scroll%20down%20to%20current%20position.meta.js
// ==/UserScript==

(function() {
"use strict";

var pos=[0,0], allPos={}, L, btt=document.querySelector('.back-to-top')

if (!btt) return;

btt.addEventListener('click', toTop);
window.addEventListener('scroll', savePos);

function toTop() {
  if (window.scrollY < pos[1]) {
    L.midpos=[window.scrollX, window.scrollY];
    backMid.style.display='';
    }
  }
  
function savePos() {
  var d=window.scrollY - pos[1];
  if (d < 0) showHide(true);
  if (d >= 0) {
    pos[0]=window.scrollX;
    pos[1]=window.scrollY;
    showHide();
    }
  if (L.midpos && (window.scrollY >= L.midpos[1]) ) {
    hideMBt();
    }
  }

function showHide(show=false) {
  if (show == L.disp) return;
  back.style.display= show?'':'none';
  L.disp=show;
  }

var back=document.createElement('a');

document.querySelector('header#top-nav').appendChild(back);

back.href='javascript:;';
back.classList='back-to-top';
back.style='transform: rotate(180deg); top: 5em; display: none;';
back.title='Scroll back to position';

back.addEventListener('click', function(e){
  if (pos) window.scrollTo.apply(null, pos);
  showHide();
  });

var backMid=back.cloneNode(false);
backMid.style='transform: rotate(180deg); top: 8em; display: none;';
backMid.title='Scroll back to mid-position';
document.querySelector('header#top-nav').appendChild(backMid);
backMid.addEventListener('click', function(e){
  if (L.midpos) window.scrollTo.apply(null, L.midpos);
  });

function hideMBt() {
  backMid.style.display='none';
  delete L.midpos;
  }

var hRS=history.replaceState;

history.replaceState=function() {
setTimeout(function(){console.info('%c history.replaceState() ', 'background: lightblue;', location.href, {arguments});}, 0);
  setTimeout(LocPos, 0);
  pos=[0,0];
  L={disp:false};
  return hRS.apply(history, arguments);
  }

function LocPos() {
  if (!allPos[location.href]) {
    if ( (location.hash == '#comment') && allPos[location.href.split('#')[0]] )
         allPos[location.href]=allPos[location.href.split('#')[0]];
    else allPos[location.href]={pos:[0,0], disp:false};
    }
  L=allPos[location.href];
  pos=L.pos;
  
  back.style.display= L.disp ? '':'none';
  backMid.style.display= L.midpos?'':'none';
  }

// set clones
allPos['https://9gag.com/home']=allPos['https://9gag.com/']={pos:[0,0], disp:false};
LocPos();

})();