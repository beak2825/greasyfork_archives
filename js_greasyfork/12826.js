// ==UserScript==
// @name       Twitch Player Plus
// @namespace  http://ehsankia.com
// @version    1.0
// @description  Various tweaks to the Twitch HTML5 player UI
// @match      http://www.twitch.tv/*
// @match      http://player.twitch.tv/*
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @require    http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @copyright  2015+, Ehsan Kia
// @downloadURL https://update.greasyfork.org/scripts/12826/Twitch%20Player%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/12826/Twitch%20Player%20Plus.meta.js
// ==/UserScript==

var html5Player;
var waitForPlayerReadyTimer = setInterval(function() {
    html5Player = $('div.player');
    if (html5Player.length > 0) {
      if (html5Player.attr('data-loading') === "false") {
        clearInterval(waitForPlayerReadyTimer);
        window.eval("var flashBackend = $('div.player-video object')[0];");
        setTimeout(applyFixes, 100);
      }
    }
}, 100);

function applyFixes() {

    // Move quality options to main bar
    $(".js-quality").insertAfter($('.js-quality-display-contain'));

    // Remove remaining label
    $("span:contains('Video Quality:')").remove();

    // Hide options if there are no transcoders
    checkForQualityOptions();
    setInterval(checkForQualityOptions, 5000);

    // Bind F key to toggle fullscreen
    $('body').keypress(function(e) {
      if (e.which === 102) {
        // fallback to event.target just in case
        var el = document.activeElement || e.target;
        var t  = (el && el.tagName.toLowerCase()) || '';

        // pass through to elements that take keyboard input
        if (/(input|textarea|select)/.test(t)) {
          return true;
        }

        $('.js-control-fullscreen').click();
        return false;
      }
    });

    // Add latency status under Live icon
    var liveIcon = $('.player-livestatus__online');
    liveIcon.append("<div class='lag-status'></div>");
    window.eval('flashBackend.startPlaybackStatistics();');
    setTimeout(updateLatency, 5000);

    // Remove old stats button and add new one
    $('.player-menu__item--stats').css('display', 'none');
    $('.js-control-fullscreen').before(" \
      <button type='button' class='player-button js-custom-stats-toggle'> \
        <span class='player-tip' data-tip='Video Stats'></span> \
        <svg id='icon-stats' viewBox='0 0 1024 1024' style='width: 16px; fill: white; margin: 1px 6px;'> \
          <path d='M960 0h-896c-35.328 0-64 28.672-64 64v640c0 35.328 28.672 64 64 64h256l-128 256h32l230.4-256h115.2l230.4 256h32l-128-256h256c35.328 0 64-28.672 64-64v-640c0-35.328-28.672-64-64-64zM960 672c0 17.696-14.304 32-32 32h-832c-17.696 0-32-14.304-32-32v-576c0-17.696 14.304-32 32-32h832c17.696 0 32 14.304 32 32v576zM668.096 500.192l-144.672-372.128-158.016 297.28-88.192-90.72-149.216 92.992 42.112 24.256 95.616-59.584 115.36 118.784 133.6-251.296 147.712 380.128 125.984-265.216 51.328 109.248 56.288-9.44-107.328-228.224-120.576 253.92z'></path> \
        </svg> \
      </button>");
    $('.js-custom-stats-toggle').click(function(){
      var prev = $('.js-playback-stats').attr('data-state');
      var state = prev === 'on' ? 'off' : 'on';
      $('.js-playback-stats').attr('data-state', state);
    });

    // Check if it's a VOD and there isn't a seek argument in the url
    var vodID = html5Player.attr('data-video');
    var hasSeekParam = document.location.search.search("t=") >= 0;
    if (vodID !== undefined && !hasSeekParam) {
      //seek to previous position and keep track of the position
      var oldTime = GM_getValue("seek_" + vodID);
      if (oldTime !== undefined) {
        oldTime = parseFloat(oldTime);
        window.eval('flashBackend.videoSeek(' + oldTime + ');');
      }
      setTimeout(function() {
        setInterval(trackSeekTime, 15000);
      }, 5 * 60 * 1000);
    }
}

function checkForQualityOptions() {
  var numQualityOptions = $(".js-quality > option").length;
  if (numQualityOptions > 1) {
    $('.js-quality').css('display', 'block');
  } else {
    $('.js-quality').css('display', 'none');
  }
}

function updateLatency() {
  var lat = $('.js-stat-hls-latency-broadcaster').text();
  if (lat === "" || lat === "NaN") {
    window.eval('flashBackend.stopPlaybackStatistics();');
    window.eval('flashBackend.startPlaybackStatistics();');
    setTimeout(updateLatency, 5000);
  } else {
    $('.lag-status').text(lat + ' sec.');
    setTimeout(updateLatency, 1000);
  }
}

function trackSeekTime() {
  var vodID = html5Player.attr('data-video');
  var seekTime = window.eval('flashBackend.getVideoTime();');
  if (seekTime < 5 * 60) return;
  GM_setValue("seek_" + vodID, seekTime);
}

GM_addStyle(" \
.js-volume-container { width: 13em; } \
select.js-quality:hover { color: #a991d4 !important; } \
select.js-quality, select.js-quality:focus { \
  float: left; \
  height: 29px; \
  margin: 0 6px 0 4px; \
  padding: 0; \
  color: white; \
  font-weight: bold; \
  background: none; \
  border: none; \
  box-shadow: 0 0 black; \
  appearance: none; \
  -moz-appearance: none; \
  -webkit-appearance: none; \
  outline: none; \
  cursor: pointer; \
} \
select.js-quality > option { \
  color: white; \
  background: black; \
  padding: 0 5px; \
  margin-right: -15px; \
  font-weight: bold; \
} \
.lag-status { \
  width: 60px; \
  margin-left: -20px; \
  text-align: center; \
} \
.js-custom-stats-toggle:hover > svg { \
  fill: #a991d4 !important; \
}");
