// ==UserScript==
// @name       skeleton288
// @namespace  tomhay
// @version    0.4
// @description  tom hay ad remove
// @match      http://www.hayhaytv.vn/*
// @copyright  2012+, skeleton288
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/3643/skeleton288.user.js
// @updateURL https://update.greasyfork.org/scripts/3643/skeleton288.meta.js
// ==/UserScript==

// $('iframe[src*=\'http://www.yan.vn/widHayHayTV728.html\']').remove();
$('#btn_xemngay').after('<span id="btn_tomxem" class="btn_span">Tom Xem phim</span>');
$('#btn_xemngay').hide();
$('.box_div_like_social').remove();
$(document).ready(function () {
  tom_file_name = initVideoUrl[0].file;
  console.log(tom_file_name);
  tom_file_name = tom_file_name.replace('720p', '1080p');
  console.log(tom_file_name);
  
  $('#btn_tomxem').click(function () {
    $('.banner_player_img').hide();
    $('.info_film-div').animate({
      height: '0px',
      opacity: 0
    }, {
      duration: 1500,
      complete: function () {
        $('.info_film-div').hide();
      }
    });
    $.ajax({
      type: 'POST',
      url: http + 'vod/addview',
      data: 'id=' + '383536306E61' + '&q=' + 'detail',
      dataType: 'json',
      success: function (result) {
      }
    })
    //eventTracking('Videos', 'Play', 'Nhấp vào nút xem ngay.');
    //ga_event('Phim Lẻ', 'Xem Phim', 'Phim Hành động');
    adsXMLUrl = '';
        
//     addTomPlayer2(initVideoUrlcf5b999cb95358b8da94ff4471271af0, imageSrc, infoXMLUrl, videoSubscf5b999cb95358b8da94ff4471271af0);
    
    addTomPlayer(initVideoUrl, imageSrc, adsXMLUrl, videoSubs);
    // addPlayer(initVideoUrl, imageSrc , 'http://www.hayhaytv.vn/ads.xml', videoSubs);
    button = 2;
  });
  function addTomPlayer(fileSrc, imageSrc, ads_url, subs) {
    //console.log("tom player");
    if (!ads_url)
    is_trailer = true;
     else
    is_trailer = false;
    var userId = defaultObj.userId;
    jwplayer(player_id).setup({
      debug: true,
      primary: 'flash',
      flashplayer: 'http://www.hayhaytv.vn/jwplayer/jwplayer.flash.swf',
      //file: fileSrc,
      image: imageSrc,
      tracks: subs,
      sources: fileSrc,
      captions: {
        back: false,
        color: 'FFFFFF',
        fontsize: 18
      },
      skin: 'http://www.hayhaytv.vn/jwplayer/skins/stormtrooper.xml',
      plugins: {
        'http://www.hayhaytv.vn/jwplayer/swf/at-plugin.swf': {
          userid: userId,
          ads_pause_url: '',
          video_url: fileSrc
        }
      },
      startparam: 'ec_seek',
      autostart: true,
      width: defaultObj.playerWidth,
      height: defaultObj.playerHeight,
      events: {
        onPause: function (e) {
          var myPosition = Math.floor(jwplayer(player_id).getPosition());
          var myState = jwplayer(player_id).getState();
          if ((e.oldstate == 'BUFFERING' || e.oldstate == 'PLAYING') && e.newstate == 'PAUSED' && myPosition > 60) {
            setCookie('resume' + film_id, myPosition, 4);
          }
        }
      }
    });
    playerInfo.fileSrc = fileSrc;
    playerInfo.imageSrc = imageSrc;
    playerInfo.isError = false;
    jwplayer(player_id).onTime(SetPlayInfo);
    jwplayer(player_id).onBufferChange(SetBufferInfo);
    jwplayer(player_id).onComplete(OnPlayerComplete);
    jwplayer(player_id).onError(OnPlayerError);
  }
  
  
});