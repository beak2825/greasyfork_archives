// ==UserScript==
// @name         CursorsIO custom cursor (another hack if jpeg file is empty soo...)
// @namespace    lotus
// @version      0.1
// @description  A CursorsIO custom cursor extenstion (another hack if jpeg file is empty soo...)
// @author       lotus
// @match        http://cursors.io/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/406067/CursorsIO%20custom%20cursor%20%28another%20hack%20if%20jpeg%20file%20is%20empty%20soo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406067/CursorsIO%20custom%20cursor%20%28another%20hack%20if%20jpeg%20file%20is%20empty%20soo%29.meta.js
// ==/UserScript==

var re = '&apos;'
var customcursor = prompt("Path to cursor on device (Must be 128x128, jpeg , jpg, or cur", "file:///C:/Users/username/Downloads/");
    document.write('<style>cursor:url('
        + re + customcursor + re +
        ');</style>');