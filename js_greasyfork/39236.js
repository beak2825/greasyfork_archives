// ==UserScript==
// @name     song info for Nectarine Player
// @namespace skd.nectarine.player
// @description Display current song's details (title and time left) in Nectarine Player from scenemusic.net
// @version  1.1
// license: GPL
// @grant    none
// @include  https://www.scenemusic.net/player/
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/39236/song%20info%20for%20Nectarine%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/39236/song%20info%20for%20Nectarine%20Player.meta.js
// ==/UserScript==

/* Function counter from from demovibes:
 * https://www.scenemusic.net/static/js/dutils.js?v=20170202v02
 * can not "@require", because greasyfork.org policy
 */
function counter() {
    $("[data-name='counter']").each( function (n) {
        i = $(this);
        var counter=1*i.attr("data-sec");
        var inc=1*i.attr("data-inc");
        if ((inc<0 && counter>0) || inc>0) {
            counter=counter+inc;

            i.attr("data-sec",counter);
            var s=counter;
            var h=Math.round(Math.floor(s/(60.0*60.0)));
            s%=(60*60);
            var m=Math.round(Math.floor(s/60.0));
            s%=(60);
            if (s<10) {
                s="0"+s;
            }
            if (h>0 && m<10) {
                m="0"+m;
            }
            try {
                if (h>0) {
                    i.text(h+":"+m+":"+s);
                }else{
                    i.text(m+":"+s);
                }
            }catch(err){} // ignore error
        }
    });
}

function updateSongDetails(data) {
  var songdetails=$(data).find('div[data-name=nowplaying]');
  $('#songdetails > #title').html($(songdetails).find('.songname'));
  $('#songdetails > #timeleft').html($(songdetails).find('span[data-name=counter]'));
  var timeleft=$('span[data-name=counter]').attr('data-sec');
  if ($.isNumeric(timeleft)) {
    setupUpdateSongDetails(timeleft);
  }
  $("a").css({
    "font-weight": "bold",
    "text-decoration": "none",
    "color": "#a60"
  }).attr("target", "_blank");
}

function setupUpdateSongDetails(delaysec) {
  console.log('setup update after ' + delaysec + 's');
  window.setTimeout(function() {
    console.log('get song data');
		$.get('https://www.scenemusic.net/demovibes', updateSongDetails);
  }, delaysec * 1000);
}

/* Update counter using js from nectarine page (GPL code) */
function counterUpdater() {
  counter();
}

this.$ = this.jQuery = jQuery.noConflict(true);

/* Add div for song info */
$(".jp-controls").after("<div id='songdetails'><span id='title' style='display: inline-block; width: 90%;'>title</span><span id='timeleft'>0:00</span></div>");

setupUpdateSongDetails(1);
window.setInterval(counterUpdater, 1000);
