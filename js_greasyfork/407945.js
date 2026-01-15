// ==UserScript==
// @name         Youtube 2020 improvements
// @version      1.3.2
// @description  All Youtube improvements in one pack
// @author       Burlaka.net
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.5/cash.min.js
// @grant        none
// @license      MIT
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/407945/Youtube%202020%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/407945/Youtube%202020%20improvements.meta.js
// ==/UserScript==
//https://code.jquery.com/jquery-3.7.1.min.js
//jQuery.noConflict();

  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('default', {
      createHTML: string => string,
      createScriptURL: string => string,
      createScript: string => string,
    });
  }

(function() {
    'use strict';

    $('body').append(`<style>
/*#playlist .header {display:none !important;}*/
/*body:not(.no-scroll) #container.ytd-masthead {height:40px}*/
#container.ytd-masthead {height:38px}
#background.ytd-masthead {height:40px}
#page-manager.ytd-app{margin-top:40px}
body.no-scroll #page-manager.ytd-app {margin-top:0}
.viewed-opacity {opacity: 0.5}
.sf-btn-name {display:none}
#savefrom__yt_btn_premium {display:none !important}
#savefrom__yt_notification {display:none !important}
#savefrom__yt_btn button:last-child {display:none !important}


/* change actions buttons */
#actions.ytd-watch-metadata button[title='Поделиться'] .yt-spec-button-shape-next__button-text-content {display: none}
#actions.ytd-watch-metadata button[title='Поделиться'] .yt-spec-button-shape-next__icon {margin-right: -6px}
#actions.ytd-watch-metadata button[title='Создать клип'] .yt-spec-button-shape-next__button-text-content {display: none}
#actions.ytd-watch-metadata button[title='Создать клип'] .yt-spec-button-shape-next__icon {margin-right: -6px}
#owner.ytd-watch-metadata {min-width: calc(40% - 6px);}
#actions.ytd-watch-metadata {min-width: calc(60% - 6px);}

/* episodes */
#header.ytd-engagement-panel-title-header-renderer {padding: 0px 2px 0px 16px;}
#title-container.ytd-engagement-panel-title-header-renderer {margin: 0px 8px 0px 0;}
</style>`);

//    $('ytd-mini-guide-renderer #items.ytd-mini-guide-renderer').on('mouseover', function(e) {
//      if ($(this).find('#leftWatchlater').length === 0) {
//        $(this).children(':last-child').clone().appendTo($(this));
//        $(this).children(':last-child').find('yt-icon').html('<svg id="leftWatchlater" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z" class="style-scope yt-icon"></path></g></svg>');
//        $(this).children(':last-child').find('a').attr('href', '/playlist?list=WL').attr('title', 'Смотреть позже');
//        $(this).children(':last-child').find('.title').html('Смотреть позже');
//        $(this).children(':last-child').find('#tooltip').html('Смотреть позже');
//      }
//    });


    // comment autoexpand onmouseover
    $(document).on('mouseover', '.ytd-item-section-renderer .ytd-comment-renderer ytd-expander', function(e) {
        var $this = $(this);
        if ($this.find('#more:not([hidden])')) {
            $this.removeAttr('collapsed');
            //$this.parent().find('#less').removeAttr('hidden');
            $this.parent().find('#more').attr('hidden',true);
        }
    });

    // video info autoexpand onmouseover
    $(document).on('mouseover', 'ytd-expander.ytd-video-secondary-info-renderer', function(e) {
        var $this = $(this);
        if ($this.find('#more:not([hidden])')) {
            $this.removeAttr('collapsed');
            $this.find('#collapsible').removeAttr('hidden');
            //$this.find('#less').removeAttr('hidden');
            $this.find('#more').attr('hidden',true);
        }
    });

    // expand video name in tootltip (recommendations after video ends)
    $(document).on('mouseover', '.ytp-ce-covering-overlay .ytp-ce-video-title', function(e) {
        $(this).parent().attr('title', $(this).text());
    });

    // expand video name in watchlater playlist
    $('#playlist .playlist-items').on('mouseover', '#container.ytd-playlist-panel-video-renderer', function(e) {
        $(this).attr('title', $(this).find('#video-title.ytd-playlist-panel-video-renderer').text());
    });

    // set opacity to viewed videos
    $(document).on('scroll', function() {
        $('a#thumbnail.ytd-thumbnail').has('ytd-thumbnail-overlay-resume-playback-renderer').addClass('viewed-opacity')
        //$('#progress.ytd-thumbnail-overlay-resume-playback-renderer').parent().parent().parent().not('.viewed-opacity').addClass('viewed-opacity'); //.parent()
    });

    $('body').on('click', 'iron-selector', function() { // order selector on the page popualar/new/old
        $('.viewed-opacity').removeClass('viewed-opacity');
    });

    var oldURL = '';
    setInterval(function() {
        var rundt = new Date();

        if (oldURL != String(document.location)) {
            $('.viewed-opacity').removeClass('viewed-opacity');
            oldURL = String(document.location);
        }
    }, 7000);


    // add video date and video views to video title
    $(document).on('mouseover', 'h1.title yt-formatted-string.ytd-video-primary-info-renderer', function(e) {
        $(this).attr('title', $('#info-strings yt-formatted-string').text() + "\n" + $('#count.ytd-video-primary-info-renderer .view-count').text());
    });

    // add title on embed videos
    $(document).on('mouseover', '.ytp-title-link, .ytp-videowall-still-info-title', function(e) {
        $(this).attr('title', $(this).text());
    });

    // hide elements over video
    var hideOverVideo = true;
    $('.ytp-chrome-controls').on('mouseover', function() {
      if (hideOverVideo) {
        $('.ytp-right-controls').prepend('<button class="ytp-button" onclick="$(\'.ytp-ce-element\').toggle();return false;" style="padding: 0px 11px;position: relative;font-size: 1em;line-height: 0px;">Hide</button>');
        hideOverVideo = false;
      }
    });


    /*
      Stop playlist autoplay
    */
    (function() {
      var ypm;
      function f() {
        if (ypm) {
          ypm.canAutoAdvance_ = false;
        } else {
          ypm = document.getElementsByTagName('yt-playlist-manager')[0];
        }
      }
      f();
      setInterval(f, 5000);
    })();

    /*
      Channel videos redirect
    */
    document.addEventListener('mouseover', getLink);

    function getLink(linkElement) {
        var url = linkElement.target.toString();

        if ((url.search(/www.youtube.com/) != -1) && (url.match(/\//g).length < 5)) {
            if ((url.match(/https:\/\/www.youtube.com\/channel\//i) && (/videos/.test(url) == false))) {
                changeLink(linkElement);
            } else if ((url.match(/https:\/\/www.youtube.com\/c\//i) && (/videos/.test(url) == false))) {
                changeLink(linkElement);
            } else if ((url.match(/https:\/\/www.youtube.com\/user\//i) && (/videos/.test(url) == false))) {
                changeLink(linkElement);
            } else if ((url.match(/https:\/\/www.youtube.com\/@/i) && (/videos/.test(url) == false))) {
                changeLink(linkElement);
            }
        }
    }

    function changeLink(linkElement) {
        var newUrl = linkElement.target.toString().concat("/videos");
        linkElement.target.href = newUrl;
    }

    // add sort links
    let sorthtml = '';
    $(document).on('mouseover', '#sub-menu.ytd-section-list-renderer', function(e) {
        //let str1 = document.location.href;
        if (sorthtml == '') {
            let parseUrl = document.location.href.match(/youtube\.com\/([^&]*)\/([^&]*)\//i);
            sorthtml = `
                <div style="cursor:pointer;">
                    <span onclick="location.href='/`+parseUrl[1]+`/`+parseUrl[2]+`/videos?view=0&sort=p&flow=grid'">&nbsp; &nbsp; Популярные</span>
                    <span onclick="location.href='/`+parseUrl[1]+`/`+parseUrl[2]+`/videos?view=0&sort=da&flow=grid'">&nbsp; Старые</span>
                    <span onclick="location.href='/`+parseUrl[1]+`/`+parseUrl[2]+`/videos?view=0&sort=dd&flow=grid'">&nbsp; Новые</span>
                </div>`;
            $(this).find('#primary-items.ytd-channel-sub-menu-renderer').append(sorthtml);

        }
    });

    /* Watch later button toggler */
    var addbutton = false;
    $('#end.ytd-masthead').on('mouseover', function() {
        if (addbutton == false) {
          $('#buttons.ytd-masthead').prepend(`<div style="color: #fff;padding: 3px 8px 0 0;cursor: pointer;text-shadow: 0px 0px 5px #777;" class="wl_toggle">WL</div>`);
          $('#buttons.ytd-masthead').prepend(`<div style="color: #fff;padding: 3px 8px 0 0;cursor: pointer;text-shadow: 0px 0px 5px #777;" class="pl_toggle">Pl</div>`);
          addbutton = true;
        }
    });
    $('body').append(`<style id="wl_toggle_style">#playlist .header {display:none !important;}</style>`);
    var wl_toggle = false;
    $('body').on('click', '.wl_toggle', function() {
        if (wl_toggle == true) {
            $('body').append(`<style id="wl_toggle_style">#playlist .header {display:none !important;}</style>`);
            wl_toggle = false;
        }
        else if (wl_toggle == false) {
            $('#wl_toggle_style').remove();
            wl_toggle = true;
        }
    });

    var pl_toggle = false;
    $('body').on('click', '.pl_toggle', function() {
        if (pl_toggle == false) {
            $('body').append(`<style id="pl_toggle_style">.html5-video-player .ytp-chrome-bottom {display:none !important;}.html5-video-player .ytp-gradient-bottom {display:none !important;}</style>`);
            pl_toggle = true;
        }
        else if (pl_toggle == true) {
            $('#pl_toggle_style').remove();
            pl_toggle = false;
        }
    });


    /* Player size button toggler */
    $('#end.ytd-masthead').on('mouseover', function() {
        if ($('#center.ytd-masthead .ps_toggle').length === 0) {
          $('#center.ytd-masthead').prepend(`<div style="color: #fff;padding: 0;cursor: pointer;text-shadow: 0px 0px 5px #777;" class="ps_toggle">Player size</div>`);
        }
    });

    function ps_toggle(change) {
        var playersize_cookie = document.cookie.match(new RegExp("(?:^|; )" + 'playersize_status'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        playersize_cookie = playersize_cookie ? decodeURIComponent(playersize_cookie[1]) : undefined;

        if (change == 'change') {
            if (playersize_cookie == 'narrow') {
                document.cookie = "playersize_status=;max-age=-1";
                playersize_cookie = undefined;
            }
            else {
                document.cookie = "playersize_status=narrow;expires=2592000";
                playersize_cookie = 'narrow';
            }
        }

        if (playersize_cookie == 'narrow') {
            $('body').append(`<style id="ps_toggle_style">body:not(.no-scroll) #player-theater-container {max-height:480px !important}
body:not(.no-scroll) #player-theater-container #player-container {width: 100%;max-width: 854px;height:100%;max-height:480px; margin: 0 auto;}</style>`);

        }
        else {
            $('#ps_toggle_style').remove();

        }
    }
    ps_toggle('');

    $('body').on('click', '.ps_toggle', function() {
        ps_toggle('change');
    });


    /*
      Player keyboard shortcuts
    */
    var volume;
    $(document).ready(function() {
        $(window).on('keydown', function(e) {
            var player = $('video.html5-main-video')[0];
            var player_wrap = $('.html5-video-player');

            if (!player_wrap.is(":focus") && !$('input').is(":focus") && !$('textarea').is(":focus") && !$('.comment-simplebox-text').is(":focus") && !$('[contenteditable="true"]').is(":focus")) {
                if (e.keyCode == 0 || e.keyCode == 32) { // Space = play/pause
                    e.preventDefault();
                    if (player.paused == false) {
                        player.pause();
                    } else {
                        player.play();
                    }
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.keyCode == 38) { // Ctrl + Up = Volume up
                volume = player.volume + 0.1;
                if (volume > 1) volume = 1;
                player.volume = volume;
            }

            if ((e.ctrlKey || e.metaKey) && e.keyCode == 40) { // Ctrl + Down = Volume down
                volume = player.volume - 0.1;
                if (volume < 0) volume = 0;
                player.volume = volume;
            }
            if (e.which === 27) { // Esc Shift+Tab = focus on body //e.shiftKey
                e.preventDefault();
                $('#page').focus();
                $('video').blur();
                $('#masthead-search-term').focus();
                $('#yt-masthead-container').focus();

            } else if (e.which == 9) { // Tab = focus on video element
                e.preventDefault();
                $('video.html5-main-video').focus();
            }
        });
    });

})();
