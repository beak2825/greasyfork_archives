// ==UserScript==
// @name         Prevent tab history flooding
// @description  Never again click Back and stay on the same page
// @include      *
// @run-at       document-start
// @version      1.1
// @author       xiaoxiaoflood
// @namespace    https://github.com/xiaoxiaoflood
// @downloadURL https://update.greasyfork.org/scripts/422832/Prevent%20tab%20history%20flooding.user.js
// @updateURL https://update.greasyfork.org/scripts/422832/Prevent%20tab%20history%20flooding.meta.js
// ==/UserScript==

history.pushState = new Proxy(history.pushState, {
  apply (target, thisArg, args) {
    let el = document.createElement('a');
    el.href = args[2];
    if (el.href != location.href) {
      return target.apply(thisArg, args);
    }
  }
});

unsafeWindow.history.pushState = exportFunction(history.pushState, unsafeWindow);