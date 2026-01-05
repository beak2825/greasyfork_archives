// ==UserScript==
// @name        KAT - Remove URLs From Titles
// @namespace   Dr.YeTii
// @description on torrent pages
// @include     *kat.cr/*.html*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10065/KAT%20-%20Remove%20URLs%20From%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/10065/KAT%20-%20Remove%20URLs%20From%20Titles.meta.js
// ==/UserScript==

if ($('#torrent_title').text() != removeURLs($('#torrent_title').text()))
  $('#torrent_title').before('<span><i style="margin-left: 4px; bottom: 4px; position: relative;" class="ka16 ka ka-pencil removeURLfromTitle" title="Remove URLs"></i></span>');

function removeURLs(txt) {
  var orig = txt;
  txt = txt.replace(/http*s*:*\/*\/*\s*www*\.*/ig, '');
  txt = txt.replace(/www\.*\s*/ig, '');
  txt = txt.replace(/http(s*):\/\//ig, '');
  if (orig!=txt||1) { // would detect if http or www exists before hand, if so then there is a website so these will execute. However lots of sites are "something com" with no http/www :/
    txt = txt.replace(/(\s|\.)com(\b|_)/ig, '');
    txt = txt.replace(/(\s|\.)net\b/ig, '');
    txt = txt.replace(/(\s|\.)org\b/ig, '');
    txt = txt.replace(/(\s|\.)info\b/ig, '');
  }
  txt = txt.replace(/\s*\.*co\s*\.*uk\b/ig, '');
  txt = txt.replace(/\s*\.*me\s*\.*uk\b/ig, '');
  return txt;
}

$(document).delegate('.removeURLfromTitle', 'click', function() {
   var elem = $(this).parent();
   var txt = elem.next().text()
   var hash = $('[href^="/moderator/torrent/deletetorrent/"]').attr('href').split('/')[4];
   txt = removeURLs(txt).replace(/&quot;/, '\"');
   $.ajax({
 		type: 'POST',
  	url: '/torrents/edit_title/'+hash+'/',
  	data: {element: '', value: txt},
 		beforeSend: function() {
  		elem.html('<img alt="..." src="http://kastatic.com/images/indicator.gif" />');
 		},success: function(data) {
 			elem.html('<i style="margin-left: 4px; bottom: 4px; position: relative;" class="ka ka16 ka-accept greyButton" title="Title Changed"></i>');
       $('#torrent_title').html(txt);
 		},error: function() {
 			elem.html('<i style="margin-left: 4px; bottom: 4px; position: relative;" class="ka ka-cancel" title="'+xhr.statusText + xhr.responseText+'"></i>');
 		}
 	});
});