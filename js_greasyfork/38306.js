// ==UserScript==
// @name         Youtube common improvements
// @version      0.17
// @description  All my Youtube scripts in one pack
// @author       Burlaka.net
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/371173/Youtube%20common%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/371173/Youtube%20common%20improvements.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // cosmetic 
  $('#watch-appbar-playlist .control-bar').hide();
  $('#watch-appbar-playlist .playlist-header').hide();
  $('#player-playlist .playlist-videos-list li').css('padding', '6px 10px 4px 0');
  $('#player-playlist .playlist-videos-list li.currently-playing').css('height', 'auto');
  $('#player-playlist .playlist-videos-list').css('max-height', '460px');
  $('.watch-stage-mode #player-playlist .watch-playlist').css('top','111px');
  $('#placeholder-player').css('marginBottom', 0);
  $('.appbar-nav-menu').append('<li><a href="/playlist?list=WL" class="yt-uix-button spf-link yt-uix-sessionlink yt-uix-button-epic-nav-item yt-uix-button-size-default" aria-selected="false"><span class="yt-uix-button-content">Посмотреть позже</span></a></li>');
  $('.ytp-ce-covering-overlay').attr('title', $(this).find('.ytp-ce-video-title').text());
  $('#old-browser-alert').hide();

  if (/watch?/.test(location.href)) {
    $('#yt-masthead-container').css('paddingTop', 0).css('paddingBottom', 0);
    $('#masthead-positioner-height-offset').css('transition','all 500ms ease').css('height','35px');
  }

  // -> add to nav "watch later" link
  var add_wl = `<li class="guide-channel guide-notification-item overflowable-list-item" id="watch-later-guide-item" data-visibility-tracking="CBIQtSwYASITCPmHg_DRtOwCFYRHmwodSYoKdQ==" role="menuitem"><a class="guide-item yt-uix-sessionlink yt-valign spf-link" href="/playlist?list=WL" title="Смотреть позже" data-external-id="trending" data-serialized-endpoint="0qDduQEMEgpGRXRyZW5kaW5n" data-sessionlink="ei=jjmHX7amGdKJv_IP6ZybuAU&amp;ved=CAoQtSwYASITCLal9e_RtOwCFdLETwgdac4GVyjpHg" data-visibility-tracking="CBIQtSwYASITCPmHg_DRtOwCFYRHmwodSYoKdQ=="><span class="yt-valign-container"><span class="thumb guide-watch-later-icon yt-sprite"></span><span class="display-name no-count"><span>Watch later</span></span></span></a></li>`;
  $('.appbar-guide-toggle').click(function() {
    if ($('.guide-user-links.yt-uix-tdl.yt-box #watch-later-guide-item').length < 1) {
      $('.guide-user-links.yt-uix-tdl.yt-box:first-child').append(add_wl);
    }
  });
  // <- add to nav "watch later" link

  // expand video name in tootltip (recommendations after video ends) 
  $('#page').on('mouseover', '.ytp-videowall-still-info-title', function(k, el) {
    $(this).parent().attr('title', $(this).text());
  });

  /*
    Comments autoexpand
  */
  $(document).on('mouseover', '.comment-renderer-text-content', function(e) {
    var $this = $(this);
    $this.addClass('expanded');
    $this.next('.comment-text-toggle').find('.read-more').addClass('hid');
    $this.next('.comment-text-toggle').find('.show-less').removeClass('hid').css('display','inline');
  });
  $(document).on('mouseover', '#watch-description', function(e) {
    var $this = $(this);
    $this.parent().removeClass('yt-uix-expander-collapsed');
  });

  /*
    WatchLater playlist duration
  */
  $('.playlist-videos-list li').mouseover(function() {
    var $this = $(this);
    if (!$this.find('.video-uploader-byline span.time').length) {
      var video_id = $this.attr('data-video-id');
      var youtubeUrl = "https://www.googleapis.com/youtube/v3/videos?id=" + video_id + "&key=AIzaSyD_PDPnj6yE2UGIM-p5JCYqkDokW3yMUTY&part=contentDetails";

      $.ajax({
        async: false,
        type: 'GET',
        url: youtubeUrl,
        success: function(data) {
          var youtube_time = data.items[0].contentDetails.duration;

          var duration;

          youtube_time = youtube_time.replace('PT', '');

          var h_delim = youtube_time.split(/[H]/);
          if (h_delim.length==2) {
            youtube_time = h_delim[1];
            duration = h_delim[0];
          }

          var m_delim = youtube_time.split(/[M]/);
          if (m_delim.length==2) {
            youtube_time = m_delim[1];
            if (duration) {
              if(m_delim[0].length<2)
                m_delim[0] = '0'+m_delim[0];

              duration = duration + ':' + m_delim[0];
            }
            else
              duration = m_delim[0];
          }
          else {
            if (duration)
              duration = duration + ':00';
          }

          var s_delim = youtube_time.split(/[S]/);
          if (s_delim.length==2) {
            if(s_delim[0].length<2)
              s_delim[0] = '0'+s_delim[0];
            if (duration)
              duration = duration + ':' + s_delim[0];
            else
              duration = '0:'+s_delim[0];
          }
          else {
            if (duration)
              duration = duration + ':00';
          }

          $this.attr('title', $.trim($this.find('.yt-ui-ellipsis').text()) + "\n" + $.trim($this.find('.video-uploader-byline').text()) + "\n" + duration);
          $this.find('.video-uploader-byline').append('&nbsp;&nbsp;&nbsp;<span class="time">' + duration + '</span>');
        }
      });
    }
  });

  /*
    Add opacity to viewed videos
  */
  $('.resume-playback-background').parent().css('opacity', '0.5');
  $('body').on('scroll', function() {
      $('.resume-playback-background').parent().css('opacity', '0.5');
  });

  /*
    Hide elements over video
  */
  $('.ytp-right-controls').prepend('<button class="ytp-button" onclick="$(\'.ytp-ce-element\').toggle();return false;" style="padding: 0px 3px;font-size: 13px;position: relative;top: -13px;">Hide</button>');
  if ($('#watch-appbar-playlist')) {
    $('#yt-masthead-creation-menu').parent().prepend('<a class="wl_toggler" onclick="return false;" style="display:inline-block;padding:5px 12px;border:1px solid #ccc;text-decoration:none;">WL</a>');
  }
  $.fn.toggleClick = function() {
      var functions = arguments,
          iteration = 0;
      return this.click(function() {
          functions[iteration].call();
          iteration = (iteration + 1) % functions.length;
      });
  }
  $('.wl_toggler').toggleClick(function () {
    $('#watch-appbar-playlist .control-bar, #watch-appbar-playlist .playlist-header').show();
  }, function () {
    $('#watch-appbar-playlist .control-bar, #watch-appbar-playlist .playlist-header').hide();
  }, function () {
    $('#placeholder-playlist').hide();
    $('#watch-appbar-playlist.watch-playlist').hide();
  }, function () {
    $('#placeholder-playlist').show();
    $('#watch-appbar-playlist.watch-playlist').show();
    $('#watch-appbar-playlist .control-bar, #watch-appbar-playlist .playlist-header').hide();
  });

  /*
    Change videoactionmenu position to mouse pointer
  */
  $('.yt-uix-videoactionmenu-button').click(function() {//#yt-uix-videoactionmenu
    var offset = $('#watch-header').offset();
    var top = offset.top;
    $('#videoactionmenu_css').remove();
    $('head').append('<style id="videoactionmenu_css">#yt-uix-videoactionmenu-menu {top: '+ (top + 52) +'px !important;}</style>');//90//52//28
  });

  /*
    Channel videos redirect
  */
  document.addEventListener('mouseover', getLink);

  function getLink(linkElement) {
    var url = linkElement.target.toString();

    if ((url.search(/www.youtube.com/) != -1) && (url.match(/\//g).length < 5)) {
      if ((url.match(/https:\/\/www.youtube.com\/channel\//i) && (/videos/.test(url) == false))) {
        changeLink(linkElement);
      }
      else if ((url.match(/https:\/\/www.youtube.com\/c\//i) && (/videos/.test(url) == false))) {
        changeLink(linkElement);
      }
      else if ((url.match(/https:\/\/www.youtube.com\/user\//i) && (/videos/.test(url) == false))) {
        changeLink(linkElement);
      }
    }
  }

  function changeLink(linkElement) {
    var newUrl = linkElement.target.toString().concat("/videos");
    linkElement.target.href = newUrl;
  }

  /*
    Player keyboard shortcuts
  */
  var volume;
  $(document).ready(function() {
    $(window).keydown(function(e) {
      var player = $('.video-stream.html5-main-video')[0];
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

      if ( (e.ctrlKey || e.metaKey) && e.keyCode == 38 ) { // Ctrl + Up = Volume up
        volume = player.volume + 0.1;
        if (volume > 1) volume = 1;
        player.volume = volume;
      }

      if ( (e.ctrlKey || e.metaKey) && e.keyCode == 40 ) { // Ctrl + Down = Volume down
        volume = player.volume - 0.1;
        if (volume < 0) volume = 0;
        player.volume = volume;
      }
      if ( e.which === 27 ) { // Esc Shift+Tab = focus on body //e.shiftKey
        e.preventDefault();
        $('#page').focus();
        $('video').blur();
        $('#masthead-search-term').focus();
        $('#yt-masthead-container').focus();

      }
      else if ( e.which == 9 ) { // Tab = focus on video element
        e.preventDefault();
        $('video').focus();
      }
    });
  });


  /*
    Popup video titles
  */
  function popup_video_title() {
    $('.ytp-ce-covering-overlay .ytp-ce-video-title').each(function() {
      $(this).parent().parent().attr('title', $(this).text())
    });
  }
  setTimeout(popup_video_title, 3000);


  /*
    WatchLater autoplay stop
  */
  // script from "Nextvid Stopper for YouTube" chrome extension
//  var newScript = document.createElement("script");
//  newScript.type = "text/javascript";
//  newScript.innerText = "var NextVidEnabled = true;ytspf.enabled = false;ytspf.config['navigate-limit'] = 0;_spf_state.config['navigate-limit'] = 0;var NextVidStopperGetNextValues = function () {var nextLink = document.getElementsByClassName('playlist-behavior-controls')[0].getElementsByTagName('a')[1].href;var nextLinkStart = nextLink.search('v=');return nextLink.substr(nextLinkStart + 2, 8);};for (var key in _yt_www) {var stringFunction = '' + _yt_www[key];if (stringFunction.search('window.spf.navigate') != -1) {_yt_www[key] = function (a, b) {if (a.search(NextVidStopperGetNextValues()) == -1 || NextVidEnabled == false) {window.location = a;}};}}";
//  document.body.appendChild(newScript);
})();
