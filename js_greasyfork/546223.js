// ==UserScript==
// @name        Make list edit sections actual links
// @namespace   https://rateyourmusic.com/
// @match       https://rateyourmusic.com/lists/edit*
// @grant       none
// @version     1.0
// @author      AnotherBubblebath
// @license     MIT
// @description If you know, you know.
// @downloadURL https://update.greasyfork.org/scripts/546223/Make%20list%20edit%20sections%20actual%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/546223/Make%20list%20edit%20sections%20actual%20links.meta.js
// ==/UserScript==

'use strict';

setTimeout(function(){
  run();
},500);

function run(){
  let sections = [];
  for (let i = 0; i < getSection().length; i++){
    sections.push(getSection()[i]);
  }
  setSections(sections);
}

function getSection(){
  return document.querySelectorAll('.navlinknum');
}

function setSections(sections){
  const buttonCopy = document.querySelectorAll('.btn.blue_btn.btn_small')[2].getAttribute('href');
  let url = "https://rateyourmusic.com/lists/edit" + buttonCopy.substring(buttonCopy.indexOf('?list_id='));

  for (let i = 0; i < sections.length; i++){
    let link = url + "&page=" + sections[i].innerText;
    sections[i].setAttribute('href', link);
  }
}