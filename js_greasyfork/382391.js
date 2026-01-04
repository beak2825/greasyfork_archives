// ==UserScript==
// @name         Neptun beléptető
// @namespace    http://abs.ezw.me
// @version      1.0
// @description  Gotta go fast
// @author       ABS
// @match        https://frame.neptun.bme.hu/hallgatoi/login.aspx
// @downloadURL https://update.greasyfork.org/scripts/382391/Neptun%20bel%C3%A9ptet%C5%91.user.js
// @updateURL https://update.greasyfork.org/scripts/382391/Neptun%20bel%C3%A9ptet%C5%91.meta.js
// ==/UserScript==

document.getElementById('user').value = 'felhasználónév';
document.getElementById('pwd').value = 'jelszó';
document.getElementById('btnSubmit').click();