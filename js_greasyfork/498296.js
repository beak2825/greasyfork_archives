// ==UserScript==
// @name        anti-anti-cheat
// @match       *://diep.io/*
// @description disables anti-cheat to let some scripts work again
// @run-at      document-start
// @license     #2026
// @version     1
// @namespace https://greasyfork.org/users/1284915
// @downloadURL https://update.greasyfork.org/scripts/498296/anti-anti-cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/498296/anti-anti-cheat.meta.js
// ==/UserScript==
Object.freeze=new Proxy(Object.freeze,{
    apply(r,o,a) {
        Error.stackTraceLimit=0
        return r.apply(o,a)
    }
})