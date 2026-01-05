// ==UserScript==
// @name        Mangaupdates Cover Preview
// @namespace   https://twitter.com/Kuroonehalf
// @include     https://www.mangaupdates.com/*
// @include     http://www.mangaupdates.com/*
// @version     2.0
// @description Previews covers in mangaupdates.com when hovering over hyperlinks that lead to manga pages.
// @grant       GM_setValue
// @grant       GM_getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js 
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/5452/Mangaupdates%20Cover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/5452/Mangaupdates%20Cover%20Preview.meta.js
// ==/UserScript==
// Link title suppression
$('[title]').each( function() {
    var $this = $(this);
    $this.data('title',$this.attr('title'));
    $this.removeAttr('title');
});
// Centering function
var pathname = document.URL;
var MangaPageTest = /series\.html\?id\=[0-9]*$/;
jQuery.fn.center = function () {
  this.css('top', Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + 'px');
  if (pathname.search(MangaPageTest) != -1){
    this.css('left', Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.4) + $(window).scrollLeft()) + 'px');
  }
  else {
    this.css('left', Math.max(0, (($(window).width() - $(this).outerWidth()) * 0.6) + $(window).scrollLeft()) + 'px');
  }
  return this;
}

$('body').append('<div ID="popover"></div>');
$('#popover').css('position', 'absolute');
$('#popover').css('z-index', '10');
$('#popover').css('box-shadow', '0px 0px 5px #7A7A7A');

$('.col-6 a').mouseover(function () {
  var Href = $(this).attr('href');
  console.log(Href);
  if (Href.search(MangaPageTest) != - 1) {
    console.log("This is a manga page");
    $(this).css('font-weight', 'bold'); // Bolds previously hovered links.
    if (GM_getValue(Href)) {
       var retrievedLink = GM_getValue(Href);
       $('#popover').empty();
       $('#popover').append('<img src="' + retrievedLink + '"></img>');
       $('#popover img').load(function() {
         $('#popover').center();
       });
       console.log(Href + " has been found and retrieved from the cache."); // for testing purposes
    }
    else {
      $.ajax({
        url: Href,
        dataType: 'text',
        success: function (data) {
            var imagelink = $('<div>').html(data)[0].getElementsByClassName('sContent')[13].getElementsByTagName('img') [0].src;
          // clear what's inside #popover and put the new image in there
          $('#popover').empty();
          $('#popover').append('<img src="' + imagelink + '"></img>');
          $('#popover img').load(function () {
            $('#popover').center();
          });
//           // cache info
          GM_setValue(Href, imagelink);
          console.log(imagelink + ') successfully cached.') // for testing purposes
        }
      });
    }
  }
});
$('.col-6 a').mouseleave(function () {
  $('#popover').empty();
});