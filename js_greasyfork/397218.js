// ==UserScript==
// @name     Ignore Abebook Results
// @namespace https://hisdeedsaredust.com/gmscripts
// @description Allow results on Abebooks to be persistently ignored
// @version  1
// @grant    none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include  https://www.abebooks.co.uk/*
// @include  https://www.abebooks.com/*
// @downloadURL https://update.greasyfork.org/scripts/397218/Ignore%20Abebook%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/397218/Ignore%20Abebook%20Results.meta.js
// ==/UserScript==

$("<style>")
    .prop("type", "text/css")
    .html(".ignorespan { float: right; padding: 2px 10px 4px } .ignorespan button { } .bookignored { color: #ccc; background-color: #eee;  max-height: 1.7em; overflow: hidden }")
.appendTo("head");

function tagBooks() {
  $("[itemtype='http://schema.org/Book']").each(function() {
    var listingid = $(this).find("a[class*='btn-add-to-basket']").first().attr('data-listingid');
    var isignored = localStorage.getItem("ignore" + listingid);
    $(this).prepend("<span class='ignorespan'>Listing ID " +
                      listingid + ' <button class="ignore-link" type="button" data-bookid="' + $(this).attr('id') +
                      '" data-isignored="' + (isignored ? 'true' : 'false') +
                      '" data-listingid="' + listingid + '">' + (isignored ? 'Unignore' : 'Ignore') + '</button></span>');
    if (isignored)
      $(this).addClass('bookignored');
  });
     
  $(".ignore-link").click(ignoreButton);
}

function ignoreButton() {
  if ($(this).attr('data-isignored') == 'true') {
    $(this).attr('data-isignored', 'false');
    localStorage.removeItem("ignore" + $(this).attr('data-listingid'));
    $(this).text('Ignore');//.on("click", ignoreButton);
    $("#" + $(this).attr('data-bookid')).removeClass('bookignored');
  }
  else {
    $(this).attr('data-isignored', 'true');
    localStorage.setItem("ignore" + $(this).attr('data-listingid'), true);
    $(this).text('Unignore');//.on("click", ignoreButton);
    $("#" + $(this).attr('data-bookid')).addClass('bookignored');
  }
  return true;
}

tagBooks();
