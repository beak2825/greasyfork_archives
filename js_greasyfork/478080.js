// ==UserScript==
// @name Kirka.IO speed
// @namespace -
// @version 1.5.0
// @description speed hack for Kirka.IO.
// @author NotYou
// @match *://kirka.io/*
// @run-at document-end
// @license GPL-3.0-or-later
// @grant GM.info
// @icon data:image/data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/478080/KirkaIO%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/478080/KirkaIO%20speed.meta.js
// ==/UserScript==
  const speed = performance.now;
  performance.now = () => Date.now() * 5;