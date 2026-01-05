// ==UserScript==
// @name        Video Auto-downloader
// @namespace   png-vid-archive
// @description Downloads every viewed online video
// @include     http*://*youtube.com/*
// @include     http*://vimeo.com/*
// @version     1.33.7.1
// @downloadURL https://update.greasyfork.org/scripts/25028/Video%20Auto-downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/25028/Video%20Auto-downloader.meta.js
// ==/UserScript==

function inject(func) {
  // Injects a script into the content page.
  // Needed to escape Chrome sandbox
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.appendChild(document.createTextNode("(" + func + ")();"));

  document.body.appendChild(script);
  document.body.removeChild(script);
}

function YoutubeAutoDownloader() {
  // This fucntion gets injected into the page and executed
  var YOUTUBE_ARCHIVER_HOST = "locker.phinugamma.org";
  var currentUrl;

  function sendPage(uri) {
    // Fuck your same-origin policy :smug:
    var image = new Image();
    image.src = '//' + YOUTUBE_ARCHIVER_HOST + '/dlvid?url=' + escape(uri);
    console.log("[Auto-download] Sent request for " + uri);
  }

  function checkPageNavigate() {
    // Poll for page changes. Needed since youtube will dynamically load pages now.
    locationStr = document.location.toString();
    if (locationStr != currentUrl) {
      console.log("[Auto-download] Sending Youtube page");
      currentUrl = locationStr;
      sendPage(currentUrl);
    }
    setTimeout(checkPageNavigate, 2000)
  }

  function checkEmbedReadiness() {
    if (window.yt) {
      console.log("[Auto-download] Setting up embedded handler")
      setupEmbeddedEventHandler();
    } else {
      console.log("[Auto-download] Embedded player not ready. Trying again...")
      setTimeout(checkEmbedReadiness, 1000);
    }
  }

  function getURLFromPlayer(player) {
    // Returns a clean URL from the player
    // Need to remove timestamp that embedded player tries to add
    return player.getVideoUrl().replace(/t=[0-9]*&/, "");
  }

  function setupEmbeddedEventHandler() {
    // Hook into embedded player event
    player = window.yt.player.getPlayerByElement("player");
    player.addEventListener('onStateChange', function(state) {
      if (state == 1) { // Playing
        var playingVid = getURLFromPlayer(player);
        if (playingVid != currentUrl) {
          currentUrl = playingVid;
          sendPage(currentUrl);
        }
      }
    });
  } 

  if (window.top == window.self) {
    // This is a youtube page. Start the checker to look for page changes, and
    // send archive commands as needed.
    console.log("[Auto-download] Detected video page");
    checkPageNavigate();
  } else if (window.location.toString().search('/embed/') > 0) {  
    // This is a youtube embed. Need to hook up event handler
    console.log("[Auto-download] Detected embed");
    checkEmbedReadiness();
  }
}

// o shit waddup
console.log("[Auto-download] Youtube Auto-dowloader loading");
inject(YoutubeAutoDownloader);
