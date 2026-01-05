// ==UserScript==
// @name        Find File Shortcut (GitHub)
// @namespace   chriskim06
// @description Adds a keyboard shortcut to use GitHub's find file feature
// @include     https://github.com/*/*
// @version     1.6
// @grant       none
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/17504/Find%20File%20Shortcut%20%28GitHub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17504/Find%20File%20Shortcut%20%28GitHub%29.meta.js
// ==/UserScript==

document.querySelector('html').addEventListener('keydown', function(e) {
  if (e.shiftKey && e.which === 80 && e.target.nodeName !== 'INPUT') {
    var url = window.location.href.match(/(https:\/\/github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+)/);
    if (url) {
      var branchMenu = document.getElementsByClassName('btn btn-sm select-menu-button js-menu-target css-truncate')[0];
      if (branchMenu) {
        var branch = branchMenu.getElementsByClassName('js-select-button css-truncate-target')[0];
        if (branch) {
          window.location.href = url[1] + '/find/' + branch.innerHTML;
        }
      }
    }
  }
});

