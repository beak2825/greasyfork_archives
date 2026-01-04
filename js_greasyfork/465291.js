// ==UserScript==
// @name         Go to English wikipedia
// @namespace    https://userscript.snomiao.com/
// @version      0.0.1
// @description  Search wikipedia in chinese, read it in english.
// @author       snomiao@gmail.com
// @match        https://zh.wikipedia.org/wiki/*
// @grant        none
// @run-at       document-end
// @supportURL       https://github.com/snomiao/userscript.js/issues
// @downloadURL https://update.greasyfork.org/scripts/465291/Go%20to%20English%20wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/465291/Go%20to%20English%20wikipedia.meta.js
// ==/UserScript==

document?.querySelector('.interlanguage-link-target[lang="en"]')?.click();
