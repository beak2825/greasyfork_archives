// ==UserScript==
// @name         Pinterest Nag Killer
// @namespace    http://www.ryangittins.com/
// @author       Ryan Gittins
// @version      1.0.0
// @description  Removes the large 'Join Pinterest' bar shown to visitors.
// @include      *://*pinterest.com/*
// @copyright    2014
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5347/Pinterest%20Nag%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/5347/Pinterest%20Nag%20Killer.meta.js
// ==/UserScript==

$('div.Nags.Module').remove();