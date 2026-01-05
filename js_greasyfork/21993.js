// ==UserScript==
// @name           MH - H2P - Forums focus search
// @namespace      mountyhall
// @description    When you surf to MountyHall's Forums, focus the search field so that you can enter a search without having to use the mouse to focus the field
// @include        http://www.mountyhall.com/Forum/search_form.php*
// @include        https://mhf.mh.raistlin.fr/Forum/search_form.php*
// @icon           https://xballiet.github.io/ImagesMH/MH.png
// @version        1.2
// @author         43406 - H2P
// @downloadURL https://update.greasyfork.org/scripts/21993/MH%20-%20H2P%20-%20Forums%20focus%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/21993/MH%20-%20H2P%20-%20Forums%20focus%20search.meta.js
// ==/UserScript==

document.getElementsByName('search').item(0).focus();