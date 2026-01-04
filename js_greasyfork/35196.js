// ==UserScript==
// @name	       Redit Comment Form and Stickied Hider
// @description        Hides reddit comment form and stickied comments
// @version            1.1
// @include            http*://www.reddit.com/**
// @namespace          https://greasyfork.org/users/153157
// @downloadURL https://update.greasyfork.org/scripts/35196/Redit%20Comment%20Form%20and%20Stickied%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/35196/Redit%20Comment%20Form%20and%20Stickied%20Hider.meta.js
// ==/UserScript==

function GM_addStyle_from_string(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

GM_addStyle_from_string(`
  .commentarea > .usertext, .stickied {
    display: none;
  }
`);
