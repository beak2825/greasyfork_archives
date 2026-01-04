// ==UserScript==
// @name         Closing confirmation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Подтверждение о закрытии Брофиста
// @author       H336
// @match        http://brofist.io/brofist-io-2/*
// @match        http://brofist.io/modes/*
// @match        http://brofist.io/editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423710/Closing%20confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/423710/Closing%20confirmation.meta.js
// ==/UserScript==

onbeforeunload = () => 1