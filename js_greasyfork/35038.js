// ==UserScript==
// @name         Auto Click "Baca Mode Full Page" Button in mangacanblog
// @namespace    https://greasyfork.org/en/users/158832
// @version      1.5
// @description  Auto Click "Baca Mode Full Page" Button in mangacanblog.com
// @author       Riztard
// @match        http://www.mangacanblog.com/baca*
// @exclude      http://www.mangacanblog.com/*terbaru.html
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/35038/Auto%20Click%20%22Baca%20Mode%20Full%20Page%22%20Button%20in%20mangacanblog.user.js
// @updateURL https://update.greasyfork.org/scripts/35038/Auto%20Click%20%22Baca%20Mode%20Full%20Page%22%20Button%20in%20mangacanblog.meta.js
// ==/UserScript==

window.location.href = document.getElementsByClassName("pagers")[0].getElementsByTagName("a")[0].getAttribute("href");
