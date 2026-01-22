// ==UserScript==
// @name         Kahoot Unlocker
// @namespace    https://kahoot.it/
// @version      1.0.1
// @description  Unlocks the annoying things of the kahoot
// @author       Shuno
// @match        *://kahoot.it/*
// @match        *://kahoot.it
// @icon         https://assets-cdn.kahoot.it/controller/v2/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544371/Kahoot%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/544371/Kahoot%20Unlocker.meta.js
// ==/UserScript==

!(function () {
  "use strict";
  let t = !1,
    e = JSON.parse;
  JSON.parse = function (n, r) {
    try {
      let a = e(n, r);
      return (
        "object" == typeof a &&
          null !== a &&
          !0 === a.namerator &&
          ((a.namerator = !1), (t = !0)),
        a
      );
    } catch (o) {
      throw o;
    }
  };
  let n = WebSocket;
  window.WebSocket = function (e, r) {
    let a = new n(e, r),
      o = a.send;
    return (
      (a.send = function (e) {
        if ("string" == typeof e)
          try {
            let n = JSON.parse(e);
            if (Array.isArray(n) && n.length > 0) {
              let r = n[0];
              if (r.data && r.data.content) {
                let i = JSON.parse(r.data.content);
                i.hasOwnProperty("usingNamerator") &&
                  (console.log("Original content:", i),
                  (i.usingNamerator = t),
                  (r.data.content = JSON.stringify(i)),
                  console.log("Modified content:", i));
              }
              e = JSON.stringify(n);
            }
          } catch (c) {}
        return o.call(a, e);
      }),
      a
    );
  };
})();
