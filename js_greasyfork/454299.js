// ==UserScript==
// @name        aiyingshi.tv - close tips and skip video ads
// @namespace   Violentmonkey Scripts
// @match       *://*.aiyingshi.tv/*
// @match       *://*.itiyu5.tv/*
// @grant       none
// @version     0.0.3
// @author      Bin
// @description Skip video ads before playing and close tips banner in the player
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/454299/aiyingshitv%20-%20close%20tips%20and%20skip%20video%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/454299/aiyingshitv%20-%20close%20tips%20and%20skip%20video%20ads.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

$(() => {
  if (!window.YZM) {
    $('#ads').remove();
    return;
  }

  const skipAd = (player) => {
    player.on('playing', () => {
      player.video.currentTime = player.video.duration;
    });
  }

  if (YZM.ad instanceof yzmplayer) {
    skipAd(YZM.ad);
  }

  if (location.hostname.match(/itiyu/) && typeof YZM.MYad.pic === 'function') {
    YZM.MYad.pic = new Proxy(YZM.MYad.pic, {
      apply: () => {
        if(config.flag == 1) {
          $('#videoPlay').html(`<iframe autoplay="1" width="100%" min-height="480" class="mainplayerss" id="mainplayerss" src="${config.iurl}" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen=""></iframe>`);
        } else {
          YZM.play(config.url);
          $('#ADtip').remove();
          $('#ADmask').remove();
        }
      }
    });
  }

  YZM = new Proxy(YZM, {
    set(obj, prop, value) {
      if (prop === 'ad' && value instanceof yzmplayer) {
        skipAd(value);
      } else if (prop === 'dp' && value instanceof yzmplayer) {
        value.on('loadedmetadata', () => {
          if (obj.ads) {
            obj.ads.state = 'off';
            obj.ads.pause.state = 'off';
          }
          window.closeTips && closeTips();
        });
      }

      return Reflect.set(...arguments);
    }
  });

  if (window.yzmck && !yzmck.get('isdanmuon')) {
    yzmck.set('isdanmuon', 2);
  }
});
