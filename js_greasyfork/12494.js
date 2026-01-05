// ==UserScript==
// @name        Fark Redirect Remover
// @namespace   https://github.com/pdkl95/user_scripts
// @description Removes some of fark.com's tracking redirects.
// @include     http://www.fark.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12494/Fark%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/12494/Fark%20Redirect%20Remover.meta.js
// ==/UserScript==

/*
    fark-redirect_remover.user.js
    A user script to remove fark.com's tracking redirects.
    Copyright (C) 2015 Brent Sanders

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function () {
  var link_selector = 'a.outbound_link';
  var links = document.querySelectorAll(link_selector);
  var link_regex = /^http:\/\/www.fark.com\/goto\/[0-9]+\/(.+)$/;
  
  // fark tuncates the url when it is longer than this limit,
  // which means we have to use the redirect logger to lookup
  // the actual url.
  var max_url_length = 99;
  
  var fix_link = function (link) {
    var url = link.href;

    if (link_regex.test(url)) {
      var md = link_regex.exec(url);
      if (md.length === 2) {
        var givenurl = md[1];
        if (givenurl.length > max_url_length) {
          // probable truncated url
        } else {
          var newurl = 'http://' + givenurl;
          link.href = newurl;
        }
      }
    }
  };
  
  Array.forEach(links, fix_link);
})();
