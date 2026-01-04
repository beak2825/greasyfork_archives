// ==UserScript==
// @name     iris.to - Ctrl-Enter to Post
// @version  1.00
// @grant    none
// @include  https://iris.to/*
// @description You can post with CTRL+Enter at iris.to
// @license WTFPL
// @namespace https://greasyfork.org/users/114367
// @downloadURL https://update.greasyfork.org/scripts/459900/iristo%20-%20Ctrl-Enter%20to%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/459900/iristo%20-%20Ctrl-Enter%20to%20Post.meta.js
// ==/UserScript==

addEventListener('keydown', e => {
  if (e.target.className === 'new-msg') {
    if (e.ctrlKey && e.key === 'Enter') {
      e.target.form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }
});