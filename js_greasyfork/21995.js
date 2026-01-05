// ==UserScript==
// @name           MH - H2P - Mountypedia focus search
// @namespace      mountypedia
// @description    When you surf to Mountypedia, focus the search field so that you can enter a search without having to use the mouse to focus the field
// @include        https://mountypedia.mountyhall.com/*
// @include        https://mp.mh.raistlin.fr/*
// @icon           https://xballiet.github.io/ImagesMH/MP.jpg
// @version        1.3
// @author         43406 - H2P
// @downloadURL https://update.greasyfork.org/scripts/21995/MH%20-%20H2P%20-%20Mountypedia%20focus%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/21995/MH%20-%20H2P%20-%20Mountypedia%20focus%20search.meta.js
// ==/UserScript==

document.getElementById("searchbox").focus();