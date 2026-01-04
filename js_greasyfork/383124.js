// ==UserScript==
// @name     Item Guide Image URL Fixer
// @description fix old broken item image URLs
// @version  1.0.0
// @match		 https://www.gaiaonline.com/forum/compose/entry/new/*
// @match		 https://www.gaiaonline.com/forum/compose/entry/*_*/
// @grant    none
// @namespace https://greasyfork.org/users/2263
// @downloadURL https://update.greasyfork.org/scripts/383124/Item%20Guide%20Image%20URL%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/383124/Item%20Guide%20Image%20URL%20Fixer.meta.js
// ==/UserScript==

var oldDomain = /gaia.hs.llnwd.net\/e1/g;
var curDomain = 'graphics.gaiaonline.com';
var buttons = document.querySelector('.form_buttons');
var button = document.createElement('button');
button.type = 'button';
button.className = 'cta-button-sm';
button.innerHTML = '<span>Fix broken item image URLs</span>';
button.addEventListener('click', urlFixer);
buttons.insertBefore(document.createTextNode("\n"), buttons.children[0]);
buttons.insertBefore(button, buttons.childNodes[0]);

function urlFixer(evt) {
  var textarea = document.querySelector('#message');
  var text = textarea.value;
  
  var count = (text.match(oldDomain) || []).length;
  text = text.replace(oldDomain, curDomain);
  
  alert(`Replaced: ${count} domains`)
  
  textarea.value = text;
}