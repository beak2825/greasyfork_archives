// ==UserScript==
// @name         IMDB: redirect to Reference View
// @description  Redirect IMDB TV show/movie etc. pages to the Reference View
// @namespace    pk.qwerty12
// @include      /https://www\.imdb\.com/title/tt[0-9]+(?:$|/$|/\?ref_=.+)/
// @grant        none
// @run-at       document-start
// @inject-into  content
// @noframes
// @version 0.0.1.20210802205924
// @downloadURL https://update.greasyfork.org/scripts/430244/IMDB%3A%20redirect%20to%20Reference%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/430244/IMDB%3A%20redirect%20to%20Reference%20View.meta.js
// ==/UserScript==

window.stop();
window.location.replace("reference");