// ==UserScript==
// @name         USO - add USOa button on userstyle page
// @namespace    github.com/Procyon-b
// @version      0.4
// @description  Add a link on userstyles.org to the copy of the current userstyle on "USO archive" (uso.kkx.one)
// @author       Achernar
// @match        https://userstyles.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443153/USO%20-%20add%20USOa%20button%20on%20userstyle%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/443153/USO%20-%20add%20USOa%20button%20on%20userstyle%20page.meta.js
// ==/UserScript==

(function() {
"use strict";

var newL=document.querySelector('#__next');

if (newL) {
  let pushState=history.pushState;
  history.pushState=function(){
    pushState.apply(history, arguments);
    if (location.pathname.startsWith('/styles/')) {
      setTimeout(add, 0);
      }
    }
  // popup created?
  new MutationObserver(function(mutations) {
    if (newL.querySelector(':scope > [class^="style_mainWrapper_"]')) setTimeout(add, 0);
    }).observe(newL, { attributes: false, subtree: false, childList: true });
  }

const obs=new MutationObserver(function(muts){
  for (let mut of muts) {
    for (let n of mut.addedNodes) {
      b=n && n.querySelector && ( n.querySelector('#top-buttons > .left') || n.querySelector('#buttons') || n.querySelector('div[class^="style-details_bottomRight_"]') );
      if (b) {
        this.disconnect();
        setTimeout(addLink,0);
        return;
        }
      }
    }
  });

var b=null;

function add() {
  var e;
  if (e=document.getElementById('USOa')) {
    // update url
    e.firstElementChild.href=aLink();
    return;
    }

  b=document.querySelector('#top-buttons > .left') || document.querySelector('#buttons') || document.querySelector('div[class^="style-details_bottomRight_"]');

  if (b) addLink();
  else if (!newL) obs.observe(document.body, {attributes: false, subtree: true, childList: true });
  }

if (location.pathname.startsWith('/styles/')) add();

// old design - buttons can be removed
window.addEventListener('resize', function(){
  setTimeout(add,0);
  })

function aLink() {
  return 'https://uso.kkx.one/style/'+location.pathname.split('/')[2];
  }

function addLink() {
  if (!b || document.getElementById('USOa')) return;
  var L=aLink(),
    r=document.querySelector('div[class^="style-details_bottomRight_"]'),
    e=document.createElement('style');
  b.appendChild(e);
  e.innerText='.upgradeButton {margin-right: 11px;} #USOa {background: #39c739; color: white; text-align: center; order: 9; width: unset; padding: 0 1em; border-radius: 24px; border: none;} #USOa a {color: inherit; line-height: 1.3em} #style-top-upvotes-wrapper {white-space: nowrap;} #style-top-upvotes-wrapper.can-vote {position: relative;} #style-top-upvotes-wrapper.can-vote:hover .button-wrapper {display: flex !important; visibility: hidden;} #style-top-upvotes-wrapper.can-vote .button-wrapper ~ img {position: absolute !important; right: 0;}';
  if (r) {
    e.innerText+='\ndiv[class^="style-details_bottomRight_"] {display: flex; align-items: center;} #USOa {order: 9; z-index: 20; margin-left: 0.5em; font-size: 13px;}';
    }
  e=document.createElement('div');
  b.appendChild(e);
  e.outerHTML='<div class="customize_style_button" id="USOa"><a href="'+L+'" target="_blank"><span>Install&nbsp;from<br>USO&nbsp;archive</span></a></div>';
  }

})();