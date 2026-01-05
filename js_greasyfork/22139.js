// ==UserScript==
// @name         Auto Close Deez nutz
// @namespace    http://fuzetsu.acypa.com
// @version      1.1.13
// @description  Close and/or Mute YouTube ads automatically!
// @author       fuzetsu
// @match        https://*.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @downloadURL https://update.greasyfork.org/scripts/22139/Auto%20Close%20Deez%20nutz.user.js
// @updateURL https://update.greasyfork.org/scripts/22139/Auto%20Close%20Deez%20nutz.meta.js
// ==/UserScript==

var Util = {
  log: function () {
    var args = [].slice.call(arguments);
    args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: purple;');
    console.log.apply(console, args);
  },
  clearTicks: function(ticks) {
    ticks.forEach(function(tick) {
      if(typeof tick === 'number') {
        clearInterval(tick);
      } else {
        tick.stop();
      }
    });
    ticks.length = 0;
  },
  keepTrying: function(wait, action) {
    var tick = setInterval(function() {
      if(action()) {
        clearInterval(tick);
      }
    }, wait);
  },
  storeGet: function(key) {
    if (typeof GM_getValue === "undefined") {
      var value = localStorage.getItem(key);
      if (value === "true" || value === "false") {
        return (value === "true") ? true : false;
      }
      return value;
    }
    return GM_getValue(key);
  },
  storeSet: function(key, value) {
    if (typeof GM_setValue === "undefined") {
      return localStorage.setItem(key, value);
    }
    return GM_setValue(key, value);
  },
  storeDel: function(key) {
    if (typeof GM_deleteValue === "undefined") {
      return localStorage.removeItem(key);
    }
    return GM_deleteValue(key);
  },
  q: function(query, context) {
    return (context || document).querySelector(query);
  },
  qq: function(query, context) {
    return [].slice.call((context || document).querySelectorAll(query));
  }
};

var SCRIPT_NAME = 'Auto Close YouTube Ads';
var SEC_WAIT = parseInt(Util.storeGet('SEC_WAIT'));
var MUTE_AD = Util.storeGet('MUTE_AD') || true;
var MUTE_BUTTON_SELECTOR = '.ytp-mute-button';
var ticks = [];
var videoUrl;

if(!SEC_WAIT && SEC_WAIT !== 0) SEC_WAIT = 0.1;

function waitForAds() {
  ticks.push(
    waitAndClick('.videoAdUiSkipButton', function(btn) {
      Util.keepTrying(1000, function() {
        btn.click();
        if(!Util.q('.videoAdUiSkipButton')) {
          return true;
        }
      });
    }),
    waitAndClick('a.close-button', function(btn) {
      Util.q('div.recall-button').remove();
    })
  );
  if(MUTE_AD) {
    ticks.push(waitForElems('.videoAdUi', function(ad) {
      var muteButton = Util.q(MUTE_BUTTON_SELECTOR);
      if(muteButton.title === 'Unmute') {
        Util.log('Video ad detected, audio already muted so respecting user setting');
        return;
      }
      // mute the ad
      muteButton.click();
      Util.log('Video ad detected, muting audio');
      // wait for the ad to dissapear before unmuting
      Util.keepTrying(500, function() {
        if(!Util.q('.videoAdUi')) {
          if(muteButton.title === 'Unmute') {
            muteButton.click();
            Util.log('Video ad ended, unmuting audio');
          } else {
            Util.log('Video ad ended, audio already unmuted');
          }
          return true;
        }
      });
    }));
  }
}

function waitAndClick(sel, cb, extraWait) {
  return waitForElems(sel, function(btn) {
    Util.log('Found ad, closing in', SEC_WAIT, 'seconds');
    setTimeout(function() {
      btn.click();
      if(cb) {
        cb(btn);
      }
    }, SEC_WAIT * 1000 + (extraWait || 0));
  });
}

Util.log('Started');

if(window.self === window.top) {
  waitForUrl(/^https:\/\/www\.youtube\.com\/watch\?.*v=.+/, function() {
    if(videoUrl && location.href !== videoUrl) {
      Util.log('Changed video, removing old wait');
      Util.clearTicks(ticks);
    }
    videoUrl = location.href;
    Util.log('Entered video, waiting for ads');
    waitForAds();
    ticks.push(
      waitForUrl(function(url) {
        return url !== videoUrl;
      }, function() {
        videoUrl = null;
        Util.clearTicks(ticks);
        Util.log('Left video, stopped waiting for ads');
      }, true)
    );
  });
} else {
  if(/https:\/\/www\.youtube\.com\/embed\//.test(location.href)) {
    Util.log('Found embedded video, waiting for ads');
    waitForAds();
  }
}

// register menu commands
GM_registerMenuCommand(SCRIPT_NAME + ': set ad close delay', function() {
  var wait = parseInt(prompt('Current setting is ' + SEC_WAIT + ' seconds. Enter the number of seconds you would like the script to wait before closing an ad. 0 means no delay.'));
  if(!isNaN(wait)) {
    SEC_WAIT = wait;
    Util.storeSet('SEC_WAIT', SEC_WAIT);
  }
});
GM_registerMenuCommand(SCRIPT_NAME + ': ' + (MUTE_AD ? 'disable' : 'enable') + ' video ad muting (warning clicking this will refresh the page)', function() {
  Util.storeSet('MUTE_AD', !MUTE_AD);
  location.reload();
});