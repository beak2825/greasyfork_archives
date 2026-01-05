// ==UserScript==
// @name        Squidi Comics Keyboard
// @namespace   me.kroltan.squidi-kb
// @description Adds Left and Right shortcuts for navigating view pages
// @include     http://www.squidi.net/comic/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26212/Squidi%20Comics%20Keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/26212/Squidi%20Comics%20Keyboard.meta.js
// ==/UserScript==

const PREVIOUS_KEYCODE = 37;
const NEXT_KEYCODE = 39;

const textEquals = cmp => (l => l.innerText.toLowerCase() === cmp);

const links = [...document.querySelectorAll(`a[href*="${location.pathname}"]`)];
const previousEl = links.filter(textEquals("prev"))[0];
const nextEl = links.filter(textEquals("next"))[0];

const header = document.querySelector('font[size="2"]');
header.innerHTML += `
  <label title="Use arrow keys for navigation, previous/next comics">
    <input type="checkbox" />
    Enable shortcuts
  </label>
`;
const enableBox = header.querySelector("input");
enableBox.checked = JSON.parse(localStorage.getItem("shortcuts_enabled"));
enableBox.addEventListener("change", event => {
  localStorage.setItem("shortcuts_enabled", JSON.stringify(enableBox.checked));
})

if (previousEl && nextEl) {
  document.body.addEventListener("keyup", event => {
    let link = null;
    switch (event.which) {
      case PREVIOUS_KEYCODE:
        link = previousEl;
        break;
      case NEXT_KEYCODE:
        link = nextEl;
        break;
      default: break;
    }
    if (link && enableBox.checked) {
      link.click();
    }
  });
}