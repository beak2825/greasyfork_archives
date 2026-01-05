// ==UserScript==
// @name        EdShare Download
// @namespace   ro.mihalea.edshare
// @description Automatically redirects to the download link
// @include     https://secure.ecs.soton.ac.uk/*
// @version     1.1.1
// @grant GM_xmlhttpRequest
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/30180/EdShare%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/30180/EdShare%20Download.meta.js
// ==/UserScript==

$(document).ready(function () {
  $('a').click(function (e) {
    var anchor = $(this);
    var url = anchor.attr('href');
    if (/^(http:\/\/)?(www.)?edshare.soton.ac.uk\/[0-9]+\/$/.test(url)) {
      e.preventDefault();
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (page) {
          var link = $(page.response).find('#ep_inplace_docinfo_0').find('a').attr('href');
          if (link) {
            anchor.attr('href', link);
            window.location.href = link;
          }
        }
      });
    }
  })
})
