// ==UserScript==
// @name        Baidu Pan WAP Hack
// @namespace   http://rix.li/
// @description Prevent redirect
// @include     /^https?\:\/\/pan\.baidu\.com/
// @version     0.0.1
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16351/Baidu%20Pan%20WAP%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/16351/Baidu%20Pan%20WAP%20Hack.meta.js
// ==/UserScript==
window.addEventListener('beforescriptexecute', function (e) {
  injectScript(injectPlatform);
  window.removeEventListener(e.type, arguments.callee, true);
}, true);
function injectScript(fn) {
  var tag = document.createElement('script');
  var head = document.getElementsByTagName('head') [0];
  tag.appendChild(document.createTextNode(fn.toString().replace(/^function.*{|}$/g, '')));
  head.insertBefore(tag, head.firstChild);
}
function injectPlatform() {
  var fakePlatformGetter = function () {
    return 'FakeOS';
  };
  if (Object.defineProperty) {
    Object.defineProperty(navigator, 'platform', {
      get: fakePlatformGetter,
      configurable: true
    });
  } else if (Object.prototype.__defineGetter__) {
    navigator.__defineGetter__('platform', fakePlatformGetter);
  }
};
