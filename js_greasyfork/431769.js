// ==UserScript==
// @name         Komoot Gradient
// @namespace    Komoot-CarlesV
// @homepageURL  https://greasyfork.org/en/scripts/431769-komoot-gradient
// @version      0.2.1
// @description  Show Gradient on Komoot tour profile
// @author       CarlesV
// @match        https://www.komoot.com/tour/*
// @require http://code.jquery.com/jquery-latest.js
// @icon         https://www.komoot.com/icons/favicon.11dce39abcb07b8a81b4c3be7218631f.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431769/Komoot%20Gradient.user.js
// @updateURL https://update.greasyfork.org/scripts/431769/Komoot%20Gradient.meta.js
// ==/UserScript==

(function() {
    'use strict';

function pendent()
{
    var test = $('span[data-test-id=t_distance_value]:eq(1)').html();
      if (test)
      {
          var multi=1;
          if (test.search("km")>-1)
          {
              multi=1000;
          }
          var metres = parseFloat(test)*multi;

          if ($('span[data-test-id=t_elevation_up_value]:eq(1)').length)
          {
            test = $('span[data-test-id=t_elevation_up_value]:eq(1)').html();
          }
          else
          {
            test = $('span[data-test-id=t_elevation_down_value]:eq(1)').html();
          }
          multi=1;
          if (test.search("km")>-1)
          {
              multi=1000;
          }
          var alsada = parseFloat(test)*multi;

          var grad = 100 * alsada / metres;
          grad = Math.round(grad * 100) / 100

          //console.log(grad);

          if (!$("#grad").length)
          {
             $('button:contains("Clear Selection")').first().parent().before( "<span id='grad' style='width: 75px;'>Test</span>" );
          }
          $("#grad").html(grad + " %");
      }
      else
      {
        $("#grad").html("");
      }
}

    // Your code here...

    setInterval(function(){
           pendent();
     },500);

})();