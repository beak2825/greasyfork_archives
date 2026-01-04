// ==UserScript==
// @name         Remove Lichess Timeline
// // @version      0.1
// @description  Removes the homepage timeline on Lichess.org
// @author       https://github.com/nojoking
// @match        https://lichess.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @license MIT
// @namespace https://greasyfork.org/users/927355
// @downloadURL https://update.greasyfork.org/scripts/446729/Remove%20Lichess%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/446729/Remove%20Lichess%20Timeline.meta.js
// ==/UserScript==

$('.timeline').remove();