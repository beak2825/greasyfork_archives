// ==UserScript==
// @name        Ektoplazm Playlist
// @namespace   radix
// @author      radix
// @match       *.ektoplazm.com/*
// @version     0.1
// @grant       none
// @description Adds playlist (m3u) to all ektoplazm albums. Useful in case you can't run flash player.
// @downloadURL https://update.greasyfork.org/scripts/39227/Ektoplazm%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/39227/Ektoplazm%20Playlist.meta.js
// ==/UserScript==

$ = this.jQuery = jQuery.noConflict(true);

(function() {

    function sixBitDecode(encoded){
    var binary = "";
    var decoded = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    var counter = 0;

    while(counter < encoded.length)
      {
         var tmp1 = alphabet.indexOf(encoded.substr(counter,1));
         binary = binary + ("000000" + tmp1.toString(2)).substr(-6,6);
         counter = counter + 1;
      }
    counter = 0;
    while(counter < binary.length)
      {
         var tmp2 = parseInt(binary.substr(counter,8),2);
         if(tmp2 !== 0) {
           decoded = decoded + String.fromCharCode(tmp2);
          }
         counter = counter + 8;
      }
      return decoded;
    }

  var source  = $('.audioplayer_container > object > param[name="flashvars"]');
  $.map( source, function( s, i ) {
    var value = $(s).attr("value");
    var decoded = sixBitDecode(value.match(/(?<=soundFile=)[^&]+/)[0]);
    var files   = decoded.split(',');
    text = "#EXTM3U\n";
    var filecount = 0;
    while(filecount < files.length)
    {
        text = text + "#EXTINF:0," + files[filecount].match(/(?:.(?<!\/))+(?=\..[^\.]+$)/)[0] + "\n";
        text = text + files[filecount] + "\n";
        filecount = filecount +1;
    }
    var element = document.createElement('a');
    $(element).attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    $(element).attr('download', "playlist.m3u");
    $(element).text('Download playlist');
    var cont = document.createElement('p');
    $(cont).append(element);
    $(cont).insertBefore($(s).closest('.audioplayer_container'));
  });

})();