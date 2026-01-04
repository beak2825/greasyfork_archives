// ==UserScript==
// @name         YouTube Video Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.3.127
// @license      MIT
// @description  Trying to make the world a better place!
// @author       Garfield1415926
// @match        https://chat.openai.com/c/30a56eb6-e9f1-4a64-ab3a-c206aaab13cb
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478879/YouTube%20Video%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/478879/YouTube%20Video%20Enhancer.meta.js
// ==/UserScript==

// YouTube Settings Configuration
var youtubeSettings = {
  "version": "2.0.121",
  "settings": {
    "blur": 0,
    "brightness": 100,
    "contrast": 100,
    "grayscale": 0,
    "huerotate": 0,
    "invert": 0,
    "saturate": 100,
    "sepia": 0,
    "applyvideofilters": true,
    "backgroundcolor": "#000000",
    "backgroundopacity": 85,
    "blackbars": true, // Enabled black bars to maintain aspect ratio
    "blockads": true,
    "blockadsexceptforsubs": false,
    "blockautoplay": true,
    "blockhfrformats": true,
    "blockwebmformats": false,
    "boostvolume": false,
    "cinemamode": false,
    "cinemamodewideplayer": false,
    "controlbar": {
      "active": false, // Disabled control bar for a cleaner interface
      "autohide": false,
      "centered": true,
      "position": "absolute"
    },
    "controls": [
      "loop",
      "volume-booster",
      "whitelist",
      "not-interested",
      "cards-end-screens",
      "size",
      "speed-minus",
      "speed",
      "speed-plus",
      "flip-horizontally",
      "flip-vertically",
      "screenshot",
      "keyboard-shortcuts",
      "options"
    ],
    "controlsvisible": false, // Initially hide controls for a cleaner interface
    "controlspeed": false,
    "controlspeedmousebutton": false,
    "controlvolume": false,
    "controlvolumemousebutton": false,
    "convertshorts": false,
    "customcolors": {
      "--main-color": "#00adee",
      "--main-background": "#111111",
      "--second-background": "#181818",
      "--hover-background": "#232323",
      "--main-text": "#eff0f1",
      "--dimmer-text": "#cccccc",
      "--shadow": "#000000"
    },
    "customcssrules": "",
    "customscript": "",
    "customtheme": false,
    "darktheme": true,
    "date": 1692443155427,
    "defaultvolume": false,
    "disableautoplay": false,
    "executescript": false,
    "expanddescription": false,
    "filter": "none",
    "hidecardsendscreens": false,
    "hidechat": false,
    "hidecomments": false,
    "hiderelated": false,
    "hideshorts": false,
    "ignoreplaylists": true,
    "ignorepopupplayer": true,
    "localecode": "en_GB",
    "localedir": "ltr",
    "message": false,
    "miniplayer": false,
    "miniplayerposition": "_top-left",
    "miniplayersize": "_400x225",
    "newestcomments": true,
    "overridespeeds": false,
    "pauseforegroundtab": false,
    "pausevideos": true,
    "popuplayersize": "640x360",
    "qualityembeds": "medium",
    "qualityembedsfullscreen": "hd1080",
    "qualityplaylists": "hd1080",
    "qualityplaylistsfullscreen": "hd1080",
    "qualityvideos": "hd1080",
    "qualityvideosfullscreen": "hd1080",
    "reload": false,
    "reversemousewheeldirection": false,
    "selectquality": true,
    "selectqualityfullscreenoff": false,
    "selectqualityfullscreenon": false,
    "speed": 1,
    "speedvariation": 0.1,
    "stopvideos": false,
    "theatermode": false,
    "theme": "youtube-deep-dark",
    "themevariant": "youtube-deep-dark-youtube-dark.css",
    "update": 0,
    "volume": 100,
    "volumemultiplier": 3,
    "volumevariation": 5,
    "whitelist": "",
    "wideplayer": true,
    "wideplayerviewport": true
  }
};

// Apply YouTube Settings
// You can use the youtubeSettings object to apply these settings to the YouTube page.
