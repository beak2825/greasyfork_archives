// ==UserScript==
// @name         hotkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hotkey int
// @author       mat
// @run-at       document-start
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368264/hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/368264/hotkey.meta.js
// ==/UserScript==
$(document).bind('keydown', '1', function(){document.getElementById('button id="btn-blacklist"').click();});