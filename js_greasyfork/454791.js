// ==UserScript==
// @name         Code.org Auto Fill Up Report Form
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically fills up the report form of a code.org project.
// @author       You
// @match        https://studio.code.org/report_abuse
// @icon         https://www.google.com/s2/favicons?sz=64&domain=code.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454791/Codeorg%20Auto%20Fill%20Up%20Report%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/454791/Codeorg%20Auto%20Fill%20Up%20Report%20Form.meta.js
// ==/UserScript==

var e = document.getElementById("uitest-email");
var d = document.getElementById("uitest-abuse-type");
var t = document.getElementById("uitest-abuse-detail");
var s = document.getElementById("uitest-submit-report-abuse");
e.value = "cool@gmail.com";
d.selectedIndex = "2";
t.value = "Offensive content";
s.click();