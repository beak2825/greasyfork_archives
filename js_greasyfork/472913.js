// ==UserScript==
// @name         Bypass premium on wprost.pl
// @version      1.0
// @description  wprost.pl premium bypasser. The script uses very simple bypass, as shown below. No idea why does it work, but it works. I just found a very long if() instrucion in the site's source code and checked when it returns true. Script needs around 10-15 seconds to extend article with premium content, should run automatically.
// @match        *://*.wprost.pl/*
// @namespace https://greasyfork.org/users/1149258
// @downloadURL https://update.greasyfork.org/scripts/472913/Bypass%20premium%20on%20wprostpl.user.js
// @updateURL https://update.greasyfork.org/scripts/472913/Bypass%20premium%20on%20wprostpl.meta.js
// ==/UserScript==


//yes, as simple as that
sessionStorage.nscpwid=document.getElementById('element').getAttribute("data-id");