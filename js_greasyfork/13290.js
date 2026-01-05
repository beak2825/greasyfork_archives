// ==UserScript==
// @name         No Stream
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       Lunavod
// @match        http://tabun.everypony.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13290/No%20Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/13290/No%20Stream.meta.js
// ==/UserScript==
document.getElementsByClassName('block block-type-stream')[0].style.display = "none"