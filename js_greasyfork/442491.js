// ==UserScript==
// @name        System indicator
// @namespace   https://greasyfork.org/en/users/370170
// @match       https://mediatask-integrated.herokuapp.com/*
// @match       https://beta.app.mediatask.pl/*
// @match       http://127.0.0.1:3000/*
// @match       http://localhost:3000/*
// @grant       none
// @version     1.3
// @author      Radoslaw Rusek
// @description 3/26/2022, 5:33:35 PM
// @downloadURL https://update.greasyfork.org/scripts/442491/System%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/442491/System%20indicator.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return };
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
  'use strict'
  const type = window.location.href
  
  if(type.includes('.app.') && !type.includes('beta')) return
  
  let subtitle = 'DEV'
  let background = '43,31,120'

  if(type.includes('integrated')) {
    subtitle += ' integrated'
    background = '70,31,120'
  } else if(type.includes('beta')) {
    subtitle += ' beta'
    background = '120,31,86'
  } else if(!type.includes('app')) {
    subtitle += ' local'
    background = '50,31,140'
  }

  document.title = document.title + ' - ' + subtitle
  addGlobalStyle(`body { background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(${background},0.7581232322030375) 100%); }`)
  addGlobalStyle('.nav > li > a { color: white; }')
  addGlobalStyle('.nav > li > a:hover { color: black; }')

  })();