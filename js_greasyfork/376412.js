/**
 */
// ==UserScript==
// @name           FetLife Feed Picture Lightbox Viewer
// @version        1.0
// @namespace      https://fetlife.com
// @description    Allows you to view feed pictures in a lightbox and includes keyboard shortcuts (left/right arrow, l for like, escape to close)
// @include        https://fetlife.com/home
// @grant          GM_log
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376412/FetLife%20Feed%20Picture%20Lightbox%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/376412/FetLife%20Feed%20Picture%20Lightbox%20Viewer.meta.js
// ==/UserScript==

GM_addStyle('\
#gm_lightbox { position: fixed; display: none; width: 100%; height: ' + window.innerHeight + 'px; top: 0; left: 0; background-color: rgba(206, 206, 206, 0.51); }\
#gm_lightbox .gm_container { height: 85%; margin: 30px; padding: 20px; box-sizing: border-box; background-color: #0e0e0e; border-radius: 10px; }\
#gm_lightbox .gm_container .clear { clear:both; }\
#gm_lightbox .gm_container .top { }\
#gm_lightbox .gm_container .top .gallery .gm_current img { background-color: #949494; }\
#gm_lightbox .gm_container hr { margin: 10px 0; }\
#gm_lightbox .gm_container .left { float: left; width: 33%; }\
#gm_lightbox .gm_container .left .caption { margin-top: 20px; clear: both; padding: 10px; background-color: #2b2b2b; }\
#gm_lightbox .gm_container .right { height: 80%; margin-left: 35%; }\
\
#gm_lightbox .gm_container .love { position: relative; display: inline-block; border: 1px solid #888; padding: 7px 12px; background-color: #111; color: #111; font-weight: bold;\
text-decoration: none; text-align: center; -moz-box-shadow: 0 1px 3px rgba(0,0,0,0.5); -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.5); box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 0 rgba(255,255,255,0.3);\
cursor: pointer; background-image: -webkit-linear-gradient(top, #272727, #030303); color: #DDD; border-color: #171717; }\
#gm_lightbox .gm_container .love .picto { font-family: "Pictos"; line-height: 0; }\
#gm_lightbox .gm_container .love .picto.red { color: #A00; }\
');

(function() {
    'use strict';

    $('body #maincontent').append('<div id="gm_lightbox"><div class="gm_container">\
<div class="top"><div class="gallery"></div></div>\
<div class="clear"></div><hr>\
<div class="left"><a class="love btnsqr dark"><span class="picto pu2">k</span> Love</a><div class="caption"></div></div>\
<div class="right"><div class="img"></div></div>\
</div></div>');

    var $currentImg = {};
    var $lightbox = $('#gm_lightbox');
    var $gallery = $('#gm_lightbox .top .gallery');
    var $caption = $('#gm_lightbox .left .caption');
    var $love = $('#gm_lightbox a.love .picto');

    // hide lightbox when clicking outside
    $(document).click(function(event) {
        if($(event.target).attr('id') == 'gm_lightbox') {
            hideLightbox();
        }
    });

    $('#stories').on('click', '.story a[href*=pictures]', function(e) {
        e.preventDefault();

        $(this).addClass('gm_current');
        $lightbox.find('.gallery').html($(this).parent().html());

        loadImage($(this).attr('href'));
    });

    $lightbox.on('click', 'a.love', function(e) {
        e.preventDefault();

        loveImage();
    });

    $gallery.on('click', 'a[href*=pictures]', function(e) {
        e.preventDefault();

        if ($(this).hasClass('gm_current')) {
            return;
        }

        $gallery.find('a.gm_current').removeClass('gm_current');
        $(this).addClass('gm_current');

        loadImage($(this).attr('href'));
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key
            hideLightbox();
        } else if (e.keyCode == 37) { // left key
            setGalleryImage($gallery.find('.gm_current'), $gallery.find('.gm_current').prev());
        } else if (e.keyCode == 39) { // right key
            setGalleryImage($gallery.find('.gm_current'), $gallery.find('.gm_current').next());
        } else if (e.keyCode == 76) { // l key
            loveImage();
        }
    });

    function loadImage(link) {
        GM_xmlhttpRequest({
            'method': 'GET',
            headers: {
                "Accept": "application/json"
            },
            'url': 'https://fetlife.com' + link,
            'onload': function (response) {
                $currentImg = JSON.parse(response.responseText);

                $lightbox.find('.img').html('<img src="' + $currentImg.image_url + '"/>');
                showLightbox();

                // set caption
                $caption.html(($currentImg.caption == '') ? '<em>No caption</em>' : $currentImg.caption);

                // set love button
                if ($currentImg.current_user_loves_this && !$love.hasClass('red')) {
                    $love.addClass('red');
                } else if (!$currentImg.current_user_loves_this && $love.hasClass('red')) {
                    $love.removeClass('red');
                }
            }
        });
    }

    function setGalleryImage(currentImg, newImg) {
        if (newImg.length == 0) {
            return;
        }

        currentImg.removeClass('gm_current');
        newImg.addClass('gm_current');

        loadImage(newImg.attr('href'));
    }

    function loveImage() {
        GM_xmlhttpRequest({
            'method': 'POST',
            headers: {
                "Accept": "application/json",
                "x-csrf-token": $('meta[name="csrf-token"]').attr('content'),
                "x-requested-with": "XMLHttpRequest"
            },
            'url': $currentImg.toggle_love_status_url,
            'onload': function (response) {
                if (response.status == 200) {
                    $love.toggleClass('red');
                }
                else {
                    alert('An error occured with the request');
                }
            }
        });
    }

    function hideLightbox() {
        $lightbox.hide();
        $('nav.fl-nav').show();
    }
    function showLightbox() {
        $lightbox.show();
        $('nav.fl-nav').hide();

        var height = $lightbox.find('.right').height();
        $lightbox.find('.right img').css('max-height', height+'px');
    }
    function toggleLightbox() {
        if ($lightbox.css('display') == 'block') {
            hideLightbox();
        }
        else {
            showLightbox();
        }
    }
})();