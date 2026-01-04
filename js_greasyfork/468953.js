// ==UserScript==
// @name          kbin copy
// @namespace     banana69
// @description   Post to kbin
// @author        you
// @version       0.0.1
// @include       https://old.reddit.com*
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/468953/kbin%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/468953/kbin%20copy.meta.js
// ==/UserScript==

/*edit magazine name for static magazine
or leave blank to select from dropdown when posting*/

const magazine = 'YOUR_MAGAZINE_HERE';
const itemsSelector = 'a.title.may-blank';


function insertElementAfter(target, element) {
  if (target.nextSibling) {
    target.parentNode.insertBefore(element, target.nextSibling);
  } else {
    target.parentNode.appendChild(element);
  }
}

function addItemLink(item) {
var prefix;
  var url = item.href;
   var title = item.text;

  const link = document.createElement('a');
  if (magazine == "") {
    prefix = 'https://kbin.social';
} else {
   prefix = 'https://kbin.social/m/';
}
  link.setAttribute('href', prefix + magazine + '/new?url='+url);
  link.innerText = 'KBIN';
  link.className = 'title-copy-link';
  link.style.cssText += 'color:white !important;background-color:#333 !important;border-radius:5px';
  insertElementAfter(item, link);
}

function checkItems(selector) {
  const items = document.querySelectorAll(selector);
  items.forEach((item) => {
         addItemLink(item);
  });
}

checkItems(itemsSelector);