// ==UserScript==
// @name IMDb Feeling Lucky Search Results
// @description Open the first imdb result automatically with a keyword search.
// @version 0.1
// @namespace https://github.com/hbaughman
// @icon http://www.imdb.com/favicon.ico
// @include http://www.imdb.com/find?lucky=true&q=*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/14558/IMDb%20Feeling%20Lucky%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/14558/IMDb%20Feeling%20Lucky%20Search%20Results.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
this.$('.result_text').children('a')[0].click();
