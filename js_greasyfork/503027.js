// ==UserScript==
// @name        anti-anti-cheat
// @version     1.0
// @match       *://diep.io/*
// @description disables anti-cheat to let some scripts work again (piufan says it doesnt work for fov so rip)
// @run-at      document-start
// @namespace https://greasyfork.org/users/689759
// @downloadURL https://update.greasyfork.org/scripts/503027/anti-anti-cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/503027/anti-anti-cheat.meta.js
// ==/UserScript==
const handler = {
  apply(r,o,args) {
    Error.stackTraceLimit = 0;
    return r.apply(o,args)
  }
}
Object.freeze = new Proxy(Object.freeze, handler)