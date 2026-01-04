// ==UserScript==
// @name        setTimeout by Animator (PRIVATE)
// @namespace   UserScripts
// @match       https://*/*
// @grant       none
// @version     0.1.0
// @author      CY Fung
// @license     MIT
// @description 8/20/2023, 12:05:25 PM
// @run-at document-start
// @unwrap
// @allFrames true
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/473601/setTimeout%20by%20Animator%20%28PRIVATE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473601/setTimeout%20by%20Animator%20%28PRIVATE%29.meta.js
// ==/UserScript==


(() => {



  // Define some constants for the initial value and the safe limits of the timer ID
  const INT_INITIAL_VALUE = 8192; // 1 ~ {INT_INITIAL_VALUE} are reserved for native setTimeout/setInterval
  const SAFE_INT_LIMIT = 2251799813685248; // in case cid would be used for multiplying
  const SAFE_INT_REDUCED = 67108864; // avoid persistent interval handlers with cids between {INT_INITIAL_VALUE + 1} and {SAFE_INT_REDUCED - 1}
  // Note: Number.MAX_SAFE_INTEGER = 9007199254740991

  let anode = document.createElement('noscript');

  const fnMap = new Map();

  let kId = INT_INITIAL_VALUE;

  function killAE(ae) {
    ae.onfinish = null;
    // ae.finished = null;
    // ae.ready = null;
    ae.finish(); // we want "replaceState => removed"

    // ae.effect= null;
    // ae.timeline=null;

  }

  window.setTimeout = function (fn, delay) {

    let ae = anode.animate({ 'order': 0 }, {
      fill: "forwards",
      duration: delay,
      easing: "linear"
    });
    let uid;

    ae.onfinish = function () {
      if (uid > 0) {
        fnMap.delete(uid);
        uid = 0;
        killAE(ae);
        ae = null;
        fn();
      }
    }

    uid = ++kId;
    if (uid > SAFE_INT_LIMIT) uid = SAFE_INT_REDUCED;
    fnMap.set(uid, ae)
    return uid;

  }
  const { clearTimeout } = window;

  window.clearTimeout = function (uid) {
    uid = +uid;
    if (uid > INT_INITIAL_VALUE) {

      let ae = fnMap.get(uid)
      if (ae) {
        fnMap.delete(uid);
        ae.cancel();
        window.mm3 = ae;
        window.mm4 = anode
        killAE(ae);
      }

    } else {
      clearTimeout.call(window, uid);
    }

  }


})();

