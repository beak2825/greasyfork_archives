// ==UserScript==
// @name         Steam Unfavorite All on Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @licence      MIT
// @description  Automagic Unsubscribe button
// @author       spdyvkng
// @match        https://steamcommunity.com/id/*/myworkshopfiles/?appid=*&browsefilter=myfavorites&browsesort=myfavorites&p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465949/Steam%20Unfavorite%20All%20on%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/465949/Steam%20Unfavorite%20All%20on%20Page.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
    return query_string;
}();

function unsub()
{
    jQuery(".workshopItemSubscription .subscriptionControls .actionsCtn .favorite").each(function(index, elem)
    {
        console.log("Unfavoriting mod #"+jQuery(elem).attr('id').replace("UnsubscribeItemBtn",""));
        elem.click();
    });
    setTimeout(function(){location.reload()},2750);
}

function inject_go()
{
    var $input = jQuery('<input type="button" value="Unfavorite All Mods On Page" />');
    $input.on("click", function() {
        unsub();
    });
    $input.appendTo(jQuery(".workshopBrowsePagingWithBG")[0]);
}

inject_go();