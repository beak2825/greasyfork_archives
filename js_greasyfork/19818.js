// ==UserScript==
// @name        Voat expand
// @namespace   ba47d809c2aa7679e054eeb7853cd673
// @description Adds button to expand or collapse all posts.
// @version     1.0
// @match       https://voat.co/*
// @downloadURL https://update.greasyfork.org/scripts/19818/Voat%20expand.user.js
// @updateURL https://update.greasyfork.org/scripts/19818/Voat%20expand.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
  window.ba47d809c2aa7679e054eeb7853cd673 = (function (self) {
    self.buttons = [].slice.call(document.querySelectorAll('.expando-button'));

    self.button = document.createElement('a');
    self.button.className = 'contribute';
    self.button.innerHTML = 'View/Hide All';
    self.button.href = '';
    self.button.addEventListener('click', function (event) {
      event.preventDefault();
      self.buttons.forEach(function (button) {
        button.click();
      });
    });

    self.li = document.createElement('li');
    self.li.className = 'disabled';
    self.li.appendChild(self.button);
    document.querySelector('.tabmenu').appendChild(self.li);

    return self;
  })({});
});