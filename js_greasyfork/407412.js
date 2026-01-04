// ==UserScript==
// @name         FV - scrapping
// @version      1.2.1
// @description  Show full pagination when scrapping, and remember the last page opened
// @author       msjanny (#7302)
// @match        https://www.furvilla.com/career/blacksmith*
// @grant       GM_setValue
// @grant       GM_getValue
// @namespace https://greasyfork.org/users/319295
// @downloadURL https://update.greasyfork.org/scripts/407412/FV%20-%20scrapping.user.js
// @updateURL https://update.greasyfork.org/scripts/407412/FV%20-%20scrapping.meta.js
// ==/UserScript==

(function() {
  'use strict';
  /* globals $:false */

  function loadScripts() {
    //check every 300ms if pagination has loaded before continuing
    if(! $(".modal .pagination").length) {
      setTimeout ( function() {
          loadScripts();
        }, 300);
    }
    else {
      $(".modal .pagination a").click(function() {
        GM_setValue("scrapPage", $(this).attr('href'));
        loadScripts();
      });

      fullPagination();
    }
  }

  function fullPagination() {
    let active = $(".modal .pagination li").index($(".active").eq(0));
    let url = $(".modal .pagination a").eq(0).attr("href").replace(/\d+$/g, '');

    let scrapPage = GM_getValue("scrapPage", "");
    if (scrapPage && scrapPage.match(/\d+$/g)[0] != $(".modal .pagination .active").eq(0).text() && parseInt(scrapPage.match(/\d+$/g)[0]) <= parseInt($(".modal .pagination").eq(0).find('li').eq(-2).text()) ) {
        loadInventoryBlockScrapping($(".inventory-block-scrapping"), scrapPage);
        loadScripts();
    }

    //for each ellipses
    $(".disabled:contains('...')", $(".modal .pagination").eq(1)).each(function(idx) {
      let pos = $(".modal .pagination li").index($(this));
      let minPage = parseInt($(".modal .pagination li").eq(pos - 1).text());
      let maxPage = parseInt($(".modal .pagination li").eq(pos + 1).text());

        //add links
        for (var i = maxPage - 1; i > minPage; i--) {
          //create new link
          let a = $(`<a href="${url}${i}">${i}</a>`);
          a.click(function(e) {
            e.preventDefault();
            GM_setValue("scrapPage", $(this).attr('href'));
            loadInventoryBlockScrapping($(".inventory-block-scrapping"), $(this).attr('href'));
            loadScripts();
          });

          //add link
          $(this).after($("<li>").append(a));
        }

    });
    $(".disabled:contains('...')", $(".modal .pagination").eq(1)).remove();
  }

  $(document).ready(function(){
    //scrapping, pot
    $('.btn[data-url*="scrap/"]').click(function() {
      loadScripts();
    });
  });
})();

