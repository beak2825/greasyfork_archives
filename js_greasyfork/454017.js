// ==UserScript==
// @name         AdFly Skip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tired of getting rid of adfly "Please press allow to continue"? Install this script to skip and redirect to the URL have shorted.
// @author       You
// @match        https://*/pushredirect/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454017/AdFly%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/454017/AdFly%20Skip.meta.js
// ==/UserScript==

var u = new URLSearchParams(location.search);
Notification.requestPermission = undefined;
location.href = u.get("dest");