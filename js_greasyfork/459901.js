// ==UserScript==
// @name     iris.to - Click background to back
// @version  1.00
// @grant    none
// @include  https://iris.to/*
// @description You can click background to back at iris.to
// @license WTFPL
// @namespace https://greasyfork.org/users/114367
// @downloadURL https://update.greasyfork.org/scripts/459901/iristo%20-%20Click%20background%20to%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/459901/iristo%20-%20Click%20background%20to%20back.meta.js
// ==/UserScript==
     
addEventListener('click', e => {
  if (location.pathname === '/') return;
  if (!e.target.classList.contains('main-view')) return;
  if (document.getElementsByClassName('new-msg')[0]?.value) {
    if (!confirm('You are typing a note.\nAre you sure you want to go back?')) return;
  }
  history.back();
});
