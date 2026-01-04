// ==UserScript==
// @name         Dress to Impress Biology Effects Category
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Inserts a section in the search dropdown for the category of "Biology Effects" on DTI.
// @author       Flordibel
// @match        http://impress.openneo.net/*
// @match        https://impress.openneo.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404401/Dress%20to%20Impress%20Biology%20Effects%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/404401/Dress%20to%20Impress%20Biology%20Effects%20Category.meta.js
// ==/UserScript==

var $ = window.jQuery;
$('#advanced-search-occupies').append('<option value="BiologyEffects">Biology Effects</option>')