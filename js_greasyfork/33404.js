// ==UserScript==
// @name         Youtube plus
// @description  Small CSS tweaks to youtube with color theme settings
// @grant        GM_addStyle
// @include *://youtube.com/*
// @include *://www.youtube.com/*
// @run-at document-start
// @version 3.5
// @namespace https://greasyfork.org/users/3167
// @downloadURL https://update.greasyfork.org/scripts/33404/Youtube%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/33404/Youtube%20plus.meta.js
// ==/UserScript==

var defaultcolor = "hsla(3, 60%, 47%, 1)";

var customcolor = defaultcolor;

var firstrun = false;

if (typeof(Storage) !== "undefined") {
  if (localStorage.yt_custom_color) {
      customcolor = localStorage.yt_custom_color;
  } else {
      firstrun = true;
      localStorage.yt_custom_color = customcolor;
  }
}

console.log("yt_custom_color", customcolor);

var stylesheet = `
body {
    /* --yt-custom-color: " + customcolor + "; */
}
.ytp-pause-overlay {
    display: none;
}
#player-ads { display: none; }
body, 
ytd-app {
    --yt-brand-paper-button-color: var(--yt-custom-color) !important;
    --yt-brand-color: var(--yt-custom-color) !important;
}
paper-button.style-scope.ytd-subscribe-button-renderer,
paper-button.ytd-subscribe-button-renderer {
    background-color: var(--yt-custom-color);
}
paper-button.style-scope.ytd-subscribe-button-renderer[subscribed] {
    background-color: var(--yt-spec-10-percent-layer);
}
ytd-guide-entry-renderer[active] path.style-scope.yt-icon {
    color: var(--yt-custom-color) !important;
}
#progress.yt-page-navigation-progress, 
#progress.ytd-thumbnail-overlay-resume-playback-renderer, 
.ytp-red2 .ytp-swatch-background-color, 
.ytp-red2 .ytp-swatch-background-color-secondary, 
.ytp-play-progress.ytp-swatch-background-color, 
.ytp-swatch-background-color-secondary, 
.ytp-scrubber-button.ytp-swatch-background-color {
    background-color: var(--yt-custom-color) !important;
}
path#lozenge-path, 
path.style-scope.ytd-topbar-logo-renderer {
    fill: var(--yt-custom-color);
}
div#top div#player {
    max-height: calc(100vh - var(--ytd-masthead-height, 56px));
}
`;



var setcustomcolor = function (colorinput) {
  console.log("Changing color theme to: " + colorinput);
  customcolor = colorinput;
  document.body.style.setProperty('--yt-custom-color', customcolor);

  localStorage.yt_custom_color = customcolor;

  var savedcolor = localStorage.yt_custom_color;
  console.log("Saved color theme: " + savedcolor);
  
}
unsafeWindow.setcustomcolor = setcustomcolor;

var pickcustomcolor = function () {
    console.log("click");
    customcolorpicker.click();
}
unsafeWindow.pickcustomcolor = pickcustomcolor;

var resetcustomcolor = function () {
    unsafeWindow.setcustomcolor(defaultcolor);
}
unsafeWindow.resetcustomcolor = resetcustomcolor;

var video_emitkey = function(keycode) {
  var video_element = document.getElementById("movie_player");
  if (video_element) {
    var ke = new KeyboardEvent('keydown');
    delete ke.keyCode;
    Object.defineProperty(ke, "keyCode", {"value" : keycode});
    video_element.dispatchEvent(ke);
  }
}

var volumecontrol_init = function() {
  var video_player = document.getElementById("ytd-player");
  if (video_player) {

    if (!video_player.youtubeplus_wheel_hooked) {
      video_player.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
          video_emitkey(38);
        }
        if (e.deltaY > 0) {
          video_emitkey(40);
        }
      }); 
      video_player.youtubeplus_wheel_hooked = true;
    }
  }
}

var redirectshorts_init = function() {
    if (location.href.includes("/shorts/")){
        let redirect_url = location.href.replace("/shorts/", "/watch?v=");
        console.log("Shorts detected, redirecting to: " + redirect_url);
        window.location.href = redirect_url;
    }
}

var init = function() {
  
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle (stylesheet);
  } else {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = stylesheet;
    document.head.appendChild(css);
  }

  var customcolorpicker = document.createElement('input');
  customcolorpicker.type = "color";
  customcolorpicker.onchange = "setcustomcolor(this.value);";
  customcolorpicker.style = "display: none;";
  customcolorpicker.addEventListener("change", function() {
      setcustomcolor(this.value);

  });
  redirectshorts_init();
  setcustomcolor(customcolor);
  volumecontrol_init();
  mutator_init();
  console.log("Youtube++ init!");
}

var mutator_callback = function() {
  //console.log("Mutation detected...");
  volumecontrol_init();
  mutator_init();
}

var mutator_init = function() {
  var targetNode = document.body;
  if (targetNode && !targetNode.youtubeplus_mutator_hooked) {
    var observer = new MutationObserver(mutator_callback);
    observer.observe(targetNode, { childList: true });
    targetNode.youtubeplus_mutator_hooked = true;
  }
}

if (typeof unsafeWindow.Request_OLD == "undefined") {
  var Request_OLD = unsafeWindow.Request;
  class Request extends Request_OLD {
    constructor(a,b) {
      b = b || {};
      b.credentials = b.credentials || "same-origin";
      super(a,b)
    }
  }
  unsafeWindow.Request = Request;
}

console.log("Youtube++ loaded!");

document.addEventListener("DOMContentLoaded", function(event) { 
  init();
  console.log("Youtube++ init!");
});

