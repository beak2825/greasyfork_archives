// ==UserScript==
// @name        hunter-ext
// @namespace   Violentmonkey Scripts
// @match       https://hunter.qianxin.com/list*
// @grant       none
// @run-at      document-idle
// @version     1.0
// @author      -
// @license        GPLv3
// @description 8/19/2023, 3:07:42 PM
// @downloadURL https://update.greasyfork.org/scripts/473438/hunter-ext.user.js
// @updateURL https://update.greasyfork.org/scripts/473438/hunter-ext.meta.js
// ==/UserScript==


function runMain(){
    'use strict';
    $('.q-table__row').each(function() {
        var protocol = $(this).find('.q-table_1_column_4 .protocol-tag .q-tooltip').text().replace(/\s/g, '');
        var url = $(this).find('.q-table_1_column_3 .q-tooltip').text().replace(/\s/g, '');
        var port = $(this).find('.q-table_1_column_4 .q-popover__reference .q-tooltip').text().replace(/\s/g, '');

        var endpods = protocol + "://" + url + ":" + port


        var $a = $('<a>', {
            href: endpods,
            target: '_blank',
            text: 'open link',
            rel: "noreferrer noopener nofollow"
        });

        // $(this).find('.q-table_1_column_3').append("<p  class='constom' href='"+ endpods  +"'>" + endpods +"</p>");
        $(this).find('.q-table_1_column_3').append($a);

        var $copyButton = $('<button>', {
            text: 'copy link',
            click: function() {
                var link = endpods;
                navigator.clipboard.writeText(link)
                .then(function() {
                    alert(endpods + ' copy succeed');
                })
                .catch(function(error) {
                    console.error(endpods + ' copy error:', error);
                });
            }
        });

        $a.after($copyButton);
    // if (endpods) {
    //     console.log(endpods);
    // }


    });

}


function checkQTableRows() {
    if ($('.q-table__row').length > 0) {
      runMain();
    } else {
      setTimeout(checkQTableRows, 1000);
    }
  }

  $(document).ready(function() {
    checkQTableRows();
  });
  