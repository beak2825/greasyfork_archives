// ==UserScript==
// @name        Rarbg improver
// @namespace   http://shadow.ed
// @description	Various improvements to Rarbg site (adding direct links to torrents, auto open first list etc.)
// @include     https://rarbg*.org/*
// @version     1
// @grant       none
// @require			https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/369557/Rarbg%20improver.user.js
// @updateURL https://update.greasyfork.org/scripts/369557/Rarbg%20improver.meta.js
// ==/UserScript==

function addTorrentLinkTo(link)
{
  jLink = $(link);
  if (jLink.text() != '')
  {
    var pathParts = link.pathname.split('/');
    var torrentId = pathParts[pathParts.length - 1];
    var torrentUrl = '/download.php?id=' + torrentId;
    torrentUrl += '&f=' + jLink.text();
    jLink.before($('<a style="margin: 5px; font-size: 1.5em" href="' + torrentUrl + '">🔽</a>'));
  }
}

function populate_tv2(tvepisode) {
  var link = $('#tvcontent_' + tvepisode).parent();
  if (link.attr('class') == 'tvdivshowed') {
    link.removeClass('tvdivshowed');
    link.addClass('tvdivhidden');
    $('#tvcontent_' + tvepisode).empty().html();
    return false;
  }
  $('#tvcontent_' + tvepisode).empty().html('<img src="http://rgbydyvkcn.dyncdn.me/static/20/img/loading.gif" border="0" />');
  $.get('/tv.php?ajax=1&tvepisode=' + tvepisode + '', function (data) {
    link.removeClass('tvdivhidden');
    link.addClass('tvdivshowed');
    $('#tvcontent_' + tvepisode).html(data);
    $('#tvcontent_' + tvepisode).find('a[href^="/torrent/"]').each(function () {
      addTorrentLinkTo(this);
    });
  });
}

var torrentLinks = $('a[href^="/torrent/"]');
var tvContentDivs = $('div[id^="tvcontent_"]');

torrentLinks.each(function ()
{
  addTorrentLinkTo(this);
});

tvContentDivs.each(function ()
{
  var tvContentId = this.id.split('_') [1];
  if ($(this).prev().find('.tvshowClick').length > 0) {
    $(this).prev().find('.tvshowClick') [0].onclick = (function (id) {
      return function () { populate_tv2(id); }
    })(tvContentId);
  }
});

$('.tvshowClick')[0].click();

//$('h1.black').append('<a onclick="$(this).parent().next().find(\'a\').click()">+</a>');