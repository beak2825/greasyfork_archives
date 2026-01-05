// ==UserScript==
// @name         External links on steamcommunity.com
// @namespace    http://steamcommunity.com/id/hlcs/
// @version      1.0
// @description  Includes links to external sites
// @author       2nd
// @include      /^https?:\/\/steamcommunity\.com[/]+(id|profiles)[/]+[^/]+(\/|)$/
// @icon         http://img-fotki.yandex.ru/get/6835/203537249.14/0_13878d_ee5e20a5_orig.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14517/External%20links%20on%20steamcommunitycom.user.js
// @updateURL https://update.greasyfork.org/scripts/14517/External%20links%20on%20steamcommunitycom.meta.js
// ==/UserScript==

$J(document).ready(function() {

  var urls = {
        backpack: "http://backpack.tf/profiles/",
        tf2outpost: "http://www.tf2outpost.com/user/",
        steamrep: "http://steamrep.com/profiles/",
        mvmlobby: "http://mvmlobby.com/profile/"
      }
      favicons = "http://www.google.com/s2/favicons?domain=",
      $ = $J;

  $(".header_real_name").append("<br>");

  $.each(urls, function(_, s_url){

    $(".header_real_name")
      .append(
        $("<a>")
          .attr({
            "href": s_url + g_rgProfileData.steamid,
            "target": "_blank"
          })
          .css({
            "display": "block",
            "float": "left",
            "background-color": "#34435A",
            "padding": "0px",
            "margin": "4px 0px",
          })
          .html(
            $("<img>")
              .attr("src", favicons + s_url)
              .css({
                "display": "block",
                "margin": "7px"
              })
          )
          .hover(
            function () {
              $(this).css("background-color", "#475E82");
            },
            function () {
              $(this).css("background-color", "#34435A");
            }
          )
      );

  });

});
