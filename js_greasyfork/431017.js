// ==UserScript==
// @name           Show Password on Double Click
// @namespace      myfonj
// @description    Double click toggles password to text field and back
// @include        *
// @grant          none
// @license        CC0
// @version        2.0.3
// @downloadURL https://update.greasyfork.org/scripts/431017/Show%20Password%20on%20Double%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/431017/Show%20Password%20on%20Double%20Click.meta.js
// ==/UserScript==

// https://greasyfork.org/en/scripts/431017/versions/new

if(!document.body || !document.body.addEventListener || !WeakSet) {
  return
}

const swapped = new WeakSet();

document.body.addEventListener('dblclick', swap, true);

function swap(e) {
  const tgt = e.target;
  if( swapped.has(tgt) ) {
    tgt.type = 'password';
    swapped.delete(tgt);
    return
  }
  if ('INPUT' != tgt.tagName || 'password' != tgt.type) {
    return
  }
  tgt.type = 'text';
  swapped.add(tgt);
}
