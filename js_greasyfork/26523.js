// ==UserScript==
// @name        pls.watch
// @description Adds a button on YouTube, Imgur and SoundCloud to open current resource in pls.watch looper
// @version     1.9.2
// @namespace   https://pls.watch
// @icon        https://ipfs.io/ipfs/QmZFXPq9xMJY3Z8q2fq4wfsU93uTpVfjbiaYzwFmfnkCfM
// @match       https://www.youtube.com/*
// @match       https://youtube.com/*
// @match       http://www.youtube.com/*
// @match       http://youtube.com/*
// @match       https://imgur.com/*
// @match       http://imgur.com/*
// @match       http://soundcloud.com/*
// @match       https://soundcloud.com/*
// @license     CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @homepageURL https://github.com/lidel/pls.watch/#companion-userscript
// @supportURL  https://github.com/lidel/pls.watch/issues
// @require     https://cdn.jsdelivr.net/jquery/3.2.1/jquery.slim.min.js
// @grant       none
// @run-at document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/26523/plswatch.user.js
// @updateURL https://update.greasyfork.org/scripts/26523/plswatch.meta.js
// ==/UserScript==
'use strict';
(function ($, undefined) { // eslint-disable-line no-unused-vars
  const youtubeHandler = function () {
    const atWatchPage = window.location.pathname.startsWith('/watch');
    if (atWatchPage && $('#pls-watch').length === 0) {
      const getYtPlayer = function () {
          return window.document.getElementById('movie_player');
      };
      const renderLooperActions = function() {
        console.log('renderLooperActions()');
        $('#pls-watch').remove();

        // new layout (https://www.youtube.com/new)
        const $secondaryActions = $('#info #top-level-buttons');
        const $button = $('<button id="pls-watch" style="cursor:pointer;background:none;border:none;vertical-align:middle;" title="Open in pls.watch"><span style="margin:0 0.1rem;vertical-align: middle;font-size:2em;" class="yt-view-count-renderer"> &#x21BB; </span></button>');
        $secondaryActions.append($button);

        $button.show();
        $button.click(function () {
          let url = window.location.href;
          url = url.replace(/.*youtube.com\/watch\?/, 'https://pls.watch/#');
          url = url.replace(/[&#]t=[^&#]*/g, '');
          window.open(url);
        });
      };

      const initButton = function() {
        console.log('initButton()');
        renderLooperActions();

        window.ytLooperStateChanged = function(state) {
          console.log('ytLooperStateChanged().state', state);
          if (state === 1) {
            // youtube redraws div.watch-action-buttons AFTER 5 and -1 events
            // and 1 is the only one we have after GUI stabilizes.
            // ANGST.
            renderLooperActions();
          }
        };
        getYtPlayer().addEventListener('onStateChange', window.ytLooperStateChanged);
      };

      initButton();
    }
  };
  const imgurHandlerRenderButton = function(ids) {
    const id = ids[0];
    if (/[a-zA-Z0-9]+/.test(id) && ($('div.post-image img').length > 0 || $('div.post-image video').length > 0)) {
      console.log('pls.watch → renderButton for ' + ids.join(', '));
      const url = 'https://pls.watch/#i=' + ids.join('&i=');
      const html = '<a style="pointer:cursor;text-decoration:none;color:#ccc" title="Open in pls.watch"><span style="font-size:1.5em">&#x21BB;</span><br>yt.looper</a>';
      const $a = $(html).click(function () {
        window.open(url);
      });
      $('<div class="post-account" id="pls-watch">')
        .data('imgurId', id)
        .css('margin-left','1em')
        .css('float', 'right')
        .css('text-align', 'center')
        .append($a)
        .hide()
        .prependTo($('div.post-header'))
        .show();

    }
  };
  const imgurHandler = function () {
    const $oldButton = $('#pls-watch');
    const imgurIds = $('div.post-image-container').map(function() { return $(this).attr('id'); }).get();
    if (imgurIds.length > 0 && $oldButton.data('imgurId') != imgurIds[0]) {
      $oldButton.remove();
      imgurHandlerRenderButton(imgurIds);
    }
  };
  const soundCloudHandler = function () {
    if ($('#pls-watch').length === 0) {
      const $soundActions = $('div.l-about-top div.soundActions');
      if ($soundActions.length === 1) {
        console.log('soundCloudHandler(): adding pls.watch button..');
        const scId = window.location.pathname.replace(/^\//, '');
        const url = 'https://pls.watch/#s=' + scId;
        const $button = $('<button id="pls-watch" class="sc-button sc-button-medium" title="Open in pls.watch"><span style="font-weight: 900;">&#x21BB;</span>&nbsp;pls.watch</button>');
        $button.click(function () {
          window.open(url);
        });
        $('div.sc-button-group', $soundActions).first().append($button);
      }
    }
  };
  // since everyone does reactive gui, we just poll to see if elements are present/gone
  console.log('pls.watch userscript loaded');
  switch (window.location.hostname.replace('www.', '')) {
    case 'youtube.com':
      window.setInterval(youtubeHandler, 1000);
      break;
    case 'imgur.com':
      window.setInterval(imgurHandler, 1000);
      break;
    case 'soundcloud.com':
      window.setInterval(soundCloudHandler, 1000);
      break;
  }
}(window.jQuery.noConflict(true)));
// vim:ts=2:sw=2:et:
