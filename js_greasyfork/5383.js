// ==UserScript==
// @name       Tilt
// @namespace  foop
// @version    0.2
// @description  enter something useful
// @match      http://*/*
// @match      https://*/*
// @grant none
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/5383/Tilt.user.js
// @updateURL https://update.greasyfork.org/scripts/5383/Tilt.meta.js
// ==/UserScript==

window.setTimeout(function() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("body *"));
    nodes.forEach(function(el) {
      var tilt = Math.random() * (0.3 - -0.3) + -0.3;
      el.style.transform = 'rotate(' + tilt + 'deg)';
    });
}, 2000)