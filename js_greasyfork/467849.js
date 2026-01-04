// ==UserScript==
// @name     mastodon-confirm-no-replying
// @namespace http://gholk.github.io
// @version  1
// @grant    none
// @license GPLv3
// @description prevent user post a replying toot without click *reply* button of the origin toot.
// @include https://g0v.social/*
// @exclude https://g0v.social/settings/*
// @downloadURL https://update.greasyfork.org/scripts/467849/mastodon-confirm-no-replying.user.js
// @updateURL https://update.greasyfork.org/scripts/467849/mastodon-confirm-no-replying.meta.js
// ==/UserScript==


window.addEventListener('keydown', e=>{
  const t = e.target;
  if (!(e.key == 'Enter' && e.ctrlKey)) return true
  if (t.nodeName == 'TEXTAREA' && t.matches('.autosuggest-textarea__textarea')) {
    const f = t.form;
    confirmNotReply(f, e)
  }
}, {
  capture: true,
  passive: false
})
window.addEventListener('click', e=>{
  const b = e.target;
  if (b.matches('.compose-form__publish-button-wrapper *')) {
    const f = b.closest('form');
    confirmNotReply(f, e)
  }
}, {
  capture: true,
  passive: false
})
function confirmNotReply(form, event) {
    const f = form
    const e = event
    if (f.querySelector('.reply-indicator')) return;
    if (confirm('not replying, toot this?')) return;
    e.preventDefault();
    e.stopImmediatePropagation()
}
