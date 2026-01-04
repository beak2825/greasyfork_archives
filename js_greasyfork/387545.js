// ==UserScript==
// @name         Starve.io Private server.
// @namespace    Starve.io
// @version      2.5
// @description  Starveio Private server.
// @author       Nisyyy
// @run-at       document-ready
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        *://starve.io
// @downloadURL https://update.greasyfork.org/scripts/387545/Starveio%20Private%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/387545/Starveio%20Private%20server.meta.js
// ==/UserScript==

i7.Gv[0][0] = {"nu": "numberofplayers", "m": maxplayers, "i": "ip", "p": port, "a": "Name", "ssl": 1}

 i7.Gv[0].unshift(serverslist); i7.oL(0); $(".md-select").click(); $(".md-select ul li")[1].click()

