// ==UserScript==
// @name         Okoun.cz bookmarks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  more bookmarks!
// @author       You
// @match        https://www.okoun.cz/favourites.jsp*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439013/Okouncz%20bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/439013/Okouncz%20bookmarks.meta.js
// ==/UserScript==

$( document ).ready(function() {

  var clubs = [];
  var load = $.cookie('eso-okoun-books');

  if (load) {
      clubs = JSON.parse(load);
  }

  var favs = $("input[id^='favouriteBoardId-']");

  $(favs).each(
   function(index, item) {
      $(item).after('<span class="eso-fav" style="cursor: pointer;" data-cid="' + item.id.replace('favouriteBoardId-','') + '">&#x2605;</span>');
   });

  renderBooks(clubs);

  $(document).on('click', 'span.eso-fav,span.eso-fav-btn-rmv', function(e) {

       var cid = $(this).data('cid') ;
       if (clubs.includes(cid)) {
           clubs = clubs.filter(function(item) {
              return item !== cid
           })
           $('span.eso-fav[data-cid=' + cid + ']').css('color', 'black');
       } else {
           clubs.push(cid);
           $('span.eso-fav[data-cid=' + cid + ']').css('color', 'red');
       }
       saveClubs(clubs);
       renderBooks(clubs);
   });

});

function renderBooks(clubs) {

  var books = $('<div class="eso-books"></div>');

  $(clubs).each(
   function(index, item) {
     var div = $('input#favouriteBoardId-' + item).parent();
     var a1 = $(div).find("a.name").first();
     var a2 = $(div).find("b a").first()[0];

     if (a1.length > 0) {
         var delBtn = $('<span class="eso-fav-btn-rmv" style="cursor: pointer;" data-cid="' + item + '"> &#x2716; </span>');
       $(books).append(delBtn, $(a1).clone(), $(a2).clone(), $('<br>'));
       $('span.eso-fav[data-cid=' + item + ']').css('color', 'red');
     }

   });

   $('div.eso-books').remove();
   $('div.first.main').before(books);
   $('div.eso-books').css( {'display': 'block', 'margin-bottom' : '8px'} );
   $('div.eso-books a').css( {'display': 'inline-block', 'font-size': '15px', 'padding-right' : '8px'} );

}

function saveClubs(clubs) {
   $.cookie('eso-okoun-books', JSON.stringify(clubs), { expires: 365 });
}