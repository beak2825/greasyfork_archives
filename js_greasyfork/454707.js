// ==UserScript==
// @name        Editable Title
// @namespace   myfonj
// @include     *
// @grant       none
// @version     1.0.2
// @run-at      document-start
// @description Makes document title element editable
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/454707/Editable%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/454707/Editable%20Title.meta.js
// ==/UserScript==
/*
 https://greasyfork.org/en/scripts/454707/versions/new
 1.0.1 (2022-11-14) workaround for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1291467
*/

const conf = {capture: true};
const dd = document.documentElement;

function editablizeTitleWhenClickizored ( event ) {
  const tgt = event.target;
  if( tgt?.constructor?.name !== 'HTMLTitleElement' ) {
    return;
  }
  // workaround for bug 1291467
  document.body.appendChild(tgt);
  tgt.addEventListener('blur',function(){document.head.appendChild(tgt)},{once:true})
  tgt.setAttribute('contenteditable', '');
  // tgt.focus();
  // dd.removeEventListener('click', editablizeTitleWhenClickizored, conf);
}

dd.addEventListener('mousedown', editablizeTitleWhenClickizored, conf);
