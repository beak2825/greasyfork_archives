// ==UserScript==
// @name         Flux de nouvelles side
// @namespace    https://realitygaming.fr/
// @version      1.0
// @description  Flux de nouvelles side rg
// @author       Marent
// @match        https://realitygaming.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30492/Flux%20de%20nouvelles%20side.user.js
// @updateURL https://update.greasyfork.org/scripts/30492/Flux%20de%20nouvelles%20side.meta.js
// ==/UserScript==
$('body').append("<style>h3.newsh3:before {content: '\\f099'!important;}</style>");
$('head').append('<script src="https://marent-dev.fr/realitygaming/ActuFollowers.js"></script>');