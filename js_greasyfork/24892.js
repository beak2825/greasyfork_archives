// ==UserScript==
// @name        Simple redmine
// @namespace   https://greasyfork.org/users/50045
// @include     https://*redmine*
// @description Simple redmine, remove unnecessary part and add email link
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24892/Simple%20redmine.user.js
// @updateURL https://update.greasyfork.org/scripts/24892/Simple%20redmine.meta.js
// ==/UserScript==
if (window.top != window.self) { //don't run on frames or iframes
  return;
}
function foo() {
  let elements = document.querySelectorAll('div');
  for (i = 0; i < elements.length; i++) {
    let cls = elements[i].getAttribute('class');
    if (cls == 'journal has-details') {
      elements[i].style.display = 'none';
    }
    if (cls == 'journal has-notes') {
      let x = elements[i].getElementsByClassName('journal-link');
      let s;
      s = document.createElement('A');
      s.text = 'email';
      s.href = 'mailto:?subject=' + document.title + '&body=' + x[0].href;
      elements[i].appendChild(s);
    }
  }
}
foo();
