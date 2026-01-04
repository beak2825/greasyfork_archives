// ==UserScript==
// @name Remove all comments from duellinks.gamea.co
// @description removes all comments from duellinks.gamea.co
// @version 1
// @author          bubbad
// @include http://duellinks.gamea.co/*
// @namespace Bubbad scripts
// @match http://duellinks.gamea.co/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/387693/Remove%20all%20comments%20from%20duellinksgameaco.user.js
// @updateURL https://update.greasyfork.org/scripts/387693/Remove%20all%20comments%20from%20duellinksgameaco.meta.js
// ==/UserScript==
$('.thread_part').remove();
$('.side-thread').remove();