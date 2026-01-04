// ==UserScript==
// @name           Auto-Outline
// @namespace      https://openuserjs.org/users/clemente
// @match          https://consent.yahoo.com/*
// @grant          none
// @version        1.0
// @author         clemente
// @license        MIT
// @description    Redirect articles with yahoo consent wall to outline automatically
// @icon           https://outline.com/favicon.png
// @inject-into    content
// @noframes
// @homepageURL    https://openuserjs.org/scripts/clemente/Auto-Outline
// @supportURL     https://openuserjs.org/scripts/clemente/Auto-Outline/issues
// @downloadURL https://update.greasyfork.org/scripts/402781/Auto-Outline.user.js
// @updateURL https://update.greasyfork.org/scripts/402781/Auto-Outline.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const redirectUrl = document.querySelector('input[name=originalDoneUrl]').value;
document.location.href = `https://outline.com/${redirectUrl}`;
