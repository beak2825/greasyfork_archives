// ==UserScript==
// @name        Songsterr Premium - songsterr.com
// @namespace   https://github.com/Thibb1
// @match       https://songsterr.com/*
// @match       https://www.songsterr.com/*
// @grant       none
// @run-at      document-start
// @version     1.3.5
// @author      Thibb1
// @description Unlock all premium features on Songsterr
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/539204/Songsterr%20Premium%20-%20songsterrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/539204/Songsterr%20Premium%20-%20songsterrcom.meta.js
// ==/UserScript==

(function() {
  'use strict';
  Object.assign = new Proxy(Object.assign, {
    apply: function assign(target, thisArg, argumentsList) {
      const r = Reflect.apply(target, thisArg, argumentsList);
      if (r && r.user) {
        r.user.hasPlus = true;
        if (r.user.profile) r.user.profile.plan = "plus";
      }
      return r;
    },
    get: function (target, name) {
      const property = target[name];
      return (typeof property === 'function')
        ? property.bind(target)
        : property;
    }
  });
  window.addEventListener('load', () => {
    (document.querySelector('#showroom') || document.querySelector('#showroom_header'))?.removeAttribute('class');
  });
})();