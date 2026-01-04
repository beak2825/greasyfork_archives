// ==UserScript==
// @name		Kufirc torrent preview cover
// @name:hu Kufirc torrenten a borítóképek megjelenítése
// @author		Kepek
// @description 	The list page shows the cover images
// @description:hu A lista oldalon megmutatja a borítóképet
// @namespace		https://greasyfork.org/hu/users/1159232-kepek
// @license MIT
// @version		0.1
// @include		https://kufirc.com/torrents.php*
// @compatible		Greasemonkey
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/475989/Kufirc%20torrent%20preview%20cover.user.js
// @updateURL https://update.greasyfork.org/scripts/475989/Kufirc%20torrent%20preview%20cover.meta.js
// ==/UserScript==

// Before use, in Search Center choose categories and click on save button (subtitle: "Tedd alapértelmezetté")

// cover image
$('#torrent_table td > a').each(function(index, value) {

    var id = $(value).attr("href");

    id = id.replace("/torrents.php?id=", "");

    if ( typeof unsafeWindow[ "overlay" + id ] !== 'undefined' ) {

      var popup = $.parseHTML( unsafeWindow[ "overlay" + id ] );

      var src = $( 'img', popup ).attr("src");

      $(value).append( '<div><img src="' + src + '" style="max-width: 300px;"></div>' );


    }
  
});