// ==UserScript==
// @name GazelleGames image preview
// @description Shows a tooltip with a preview image of the torrent when hoovering the mouse
// @version 1.2
// @author spendius
// @match https://gazellegames.net/*
// @match https://redacted.ch/*
// @match https://orpheus.network/*
// @require https://code.jquery.com/jquery-3.4.1.js
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @namespace https://greasyfork.org/users/373505
// @downloadURL https://update.greasyfork.org/scripts/390270/GazelleGames%20image%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/390270/GazelleGames%20image%20preview.meta.js
// ==/UserScript==

img_max_height = 384
img_max_width = 768

torrent_selector = 'a'
torrent_link_prefix = 'torrents.php?id='
image_selector = 'div.box.box_albumart img'

GM_addStyle(`
#preview-popup {
  display: none;
  position: absolute;
  padding: 6px;
  background: #000000;
  z-index: 1728;
  max-width: ${img_max_width}px;
  max-height: ${img_max_height}px;
  transform:translateY(-50%);
}
#preview-popup > img {
  object-fit: contain;
  max-width: ${img_max_width}px;
  max-height: ${img_max_height}px;
}
`)


$(document).ready(function() {
  req = {}
  req.abort = () => null

  $('body').append('<div id="preview-popup"></div>')

  $(torrent_selector).mouseenter(function(e) {
    game_url = $(this).attr('href')
    if(! game_url.startsWith(torrent_link_prefix)) {
      return
    }
    
    windowy = e.pageY - $(window).scrollTop()
    close_to_top = windowy < $(window).height()/2 ? true : false
    bordery_distance = close_to_top ? windowy : $(window).height() - windowy
    offsety = bordery_distance < img_max_height/2 ? img_max_height/2 - bordery_distance + 12 : 0
    offsety = close_to_top ? offsety : -offsety
    $("#preview-popup").css('top', e.pageY + offsety).css('left', e.pageX + 128)
    $('#preview-popup').empty()
    $('#preview-popup').show()
    
    img_url = GM_getValue(game_url)
    if(img_url !== undefined){
      $('#preview-popup').append(`<img src="${img_url}">`)

    } else {
      req = $.get(game_url, function(data) {
        img_url = $(data).find(image_selector).attr('src')
        GM_setValue(game_url, img_url)
        $('#preview-popup').append(`<img src="${img_url}">`)
      })

    }

  });

  $(torrent_selector).mouseleave(function() {
    req.abort()
    $('#preview-popup').empty()
    $('#preview-popup').hide()
  })

})
