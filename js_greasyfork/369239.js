// ==UserScript==
// @name SDsearcher
// @namespace Violentmonkey Scripts
// @match *://hd/WOListView.do*
// @grant none
// @description SDsearcherdesc
// @version 0.0.3
// @downloadURL https://update.greasyfork.org/scripts/369239/SDsearcher.user.js
// @updateURL https://update.greasyfork.org/scripts/369239/SDsearcher.meta.js
// ==/UserScript==


(($) => {
  $(document).ready(() => {
     //http://hd/WorkOrder.do?search=
    var urlreq = getUrlVars()["search"];
    if (urlreq) {
    var search_tmp = getUrlVars()["search"];
    var search = decodeURIComponent(search_tmp).replace(/\+/g," ");
    document.getElementsByName('searchText')[0].value = search;
    document.forms['SearchNForm'].submit();
    }
  });
})(jQuery);


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}