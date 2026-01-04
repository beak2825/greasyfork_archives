// ==UserScript==
// @name AnonAmp Script
// @namespace Amp Scripts 
// @match https://*.anonamp.com/*
// @grant none
// @version 1.0.1
// @description Remove ad-links and clickbait from anonamp.com
// @downloadURL https://update.greasyfork.org/scripts/32603/AnonAmp%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/32603/AnonAmp%20Script.meta.js
// ==/UserScript==

var tags = document.getElementsByTagName('img');
for (var i = 0; i < tags.length; i++) {
  var imageSrc = tags[i].src
      .replace('thumb/', 'src/')
      .replace('s.jpg', '.jpg')
      .replace('s.png', '.png')
      .replace('s.gif', '.gif');
  console.log('Replacing: ' + imageSrc);
  var anchor = tags[i].parentElement;
  while( anchor && anchor.tagName.toUpperCase()!="A" ) {
    console.log('Tag: ' + anchor.tagName);    
    anchor = anchor.parentElement;
  }
  if( anchor ) {
    console.log('Href: ' + anchor.href);
    if( anchor.href.indexOf('src.php?') > -1 ) {
      anchor.href = imageSrc;
    }
    if( imageSrc.endsWith('locked.gif')) {
      anchor.target = '_top';
    }
    if( anchor.href.indexOf('pic.php?') > -1 ) {
      anchor.href = imageSrc;
    }
  } 
}