// ==UserScript==
// @name         Easier NEMF Pickup Request (Autofill)
// @namespace    https://greasyfork.org/users/4756
// @version      0.1
// @author       saibotshamtul (Michael Cimino)
// @description  auto-fills some fields
// @match        http://nemfweb.nemf.com/MiscePickup.nsf/PuEntry?Openform
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18394/Easier%20NEMF%20Pickup%20Request%20%28Autofill%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18394/Easier%20NEMF%20Pickup%20Request%20%28Autofill%29.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

function dq(x){return document.querySelector("[name="+x+"]")};
dq("PUSHNM").value = "Outerstuff/Statco";
dq("PUPRSN").value = "Michael Cimino";
dq("AREACD").value = 201;
dq("PHEXCH").value = 792;
dq("PHNUM").value = 7000;
dq("PUADR1").value = "301 16th Street";
dq("PUCITY").value = "Jersey City";
dq("PUSTTE").children[38].selected = true;
dq("PUZIPC").value = '07310';

dq("PUREML").value = "outerstuff1@statcowhse.com";

dq("THH").children[16].selected = true;
dq("PCCMNT1").value = "First come, first served. Closed for lunch 12:00 - 1:00."

dq("H01").children[2].selected = true;
dq("A01").children[2].selected = true;

dq("BOLEmail").value = "outerstuff1@statcowhse.com";