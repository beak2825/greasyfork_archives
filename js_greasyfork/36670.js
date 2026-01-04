// ==UserScript==
// @name       Daily Bonus on Hellcase BETA
// @namespace    undefined
// @description   Daily Bonus BETA
// @author        undefined
// @icon          https://www.google.com/s2/favicons?domain=hellcase.com
// @version       12252017
// @include       https://hellcase.com/en/dailyfree
// @grant unsafeWindow
// @grant randomizator
// @downloadURL https://update.greasyfork.org/scripts/36670/Daily%20Bonus%20on%20Hellcase%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/36670/Daily%20Bonus%20on%20Hellcase%20BETA.meta.js
// ==/UserScript==

//Hidden Alert
unsafeWindow.alert = function alert(message) {
    console.log('Hidden Alert ' + message);
};

(function() {
  var r, a, s, c;
  try {
    a = this, r = i(arguments), s = "function" == typeof e ? e(r, a) : e || {}
  } catch (f) {
    l([f, "", [r, a, o], s])
  }
  u(n + "start", [r, a, o], s);
  try {
    return c = t.apply(a, r)
  } catch (d) {
    throw u(n + "err", [r, a, d], s), d
  } finally {
    u(n + "end", [r, a, c], s)
  }
console.log('Clicked');
})();