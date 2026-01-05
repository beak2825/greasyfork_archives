// ==UserScript==
// @name           GooglePlaySwitchLang
// @namespace      IzzySoft
// @description    Easily switch between languages for app comments on Google Play
// @license        CC BY-NC-SA
// @include        https://play.google.com/store/apps/details?id=*
// @version        3
// @run-at         document-idle
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/28036/GooglePlaySwitchLang.user.js
// @updateURL https://update.greasyfork.org/scripts/28036/GooglePlaySwitchLang.meta.js
// ==/UserScript==

anchorlist = document.getElementsByClassName('Fd93Bb');
if ( anchorlist.length < 1 ) anchorlist = document.getElementsByClassName('AHFaub');
if (anchorlist.length > 0) {
  anchor = anchorlist.item(0);

  span = document.createElement('span');
  span.setAttribute('style','margin-left:1em;font-size:13px;');
  //span.appendChild(document.createTextNode('(');

  link = document.createElement('a');
  link.setAttribute('href',window.location.href + '&hl=en');
  link.setAttribute('title','English');
  link.appendChild(document.createTextNode('EN'));
  span.appendChild(link);
  span.appendChild(document.createTextNode(' | '));

  link2 = document.createElement('a');
  link2.setAttribute('href',window.location.href + '&hl=de');
  link2.setAttribute('title','Deutsch');
  link2.appendChild(document.createTextNode('DE'));
  span.appendChild(link2);

  //span.appendChild(document.createTextNode(')');
  anchor.appendChild(span);
} else {
  console.log('Anchor not found!');
}
