// ==UserScript==
// @name         Meetup
// @version      0.3
// @description  Do not send email to approver by default and click the approve button
// @author       Jose Espinosa
// @match        *://www.meetup.com/*/approve/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/408502/Meetup.user.js
// @updateURL https://update.greasyfork.org/scripts/408502/Meetup.meta.js
// ==/UserScript==

'use strict';

document.querySelector("#ccOrg").click();

document.querySelector(".primary").click();
