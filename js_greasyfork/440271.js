// ==UserScript==
// @name        OpenEclass courses
// @license     MIT
// @namespace   Violentmonkey Scripts
// @match       https://*/main/portfolio.php
// @grant       none
// @version     1.0
// @author      matzi24
// @description Show all courses on the home page of openeclass.uom.gr
// @downloadURL https://update.greasyfork.org/scripts/440271/OpenEclass%20courses.user.js
// @updateURL https://update.greasyfork.org/scripts/440271/OpenEclass%20courses.meta.js
// ==/UserScript==

var Limit = -1;
jQuery('#portfolio_lessons').DataTable().page.len(Limit).draw();