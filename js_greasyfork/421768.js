// ==UserScript==
// @name         Zoom Cloud Playback keyboard shortcut control
// @namespace    http://tampermonkey.net/
// @include	 *.zoom.us/*
// @version      1.2
// @description  player keyboard control
// @author       VinC
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421768/Zoom%20Cloud%20Playback%20keyboard%20shortcut%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/421768/Zoom%20Cloud%20Playback%20keyboard%20shortcut%20control.meta.js
// ==/UserScript==

// User input.
window.addEventListener("keydown", keydown);

// User determined events.
function keydown (event) {
    // Spacebar: Play/Pause
    if (event.keyCode == 32) {
        document.getElementsByClassName('vjs-play-control')[0].click();
    }
    // k key: Play/Pause
    if (event.keyCode == 75) {
        document.getElementsByClassName('vjs-play-control')[0].click();
    }
    // c key: captions
    if (event.keyCode == 67) {
        document.getElementsByClassName('vjs-captions-control-button')[0].click();
    }
    // f key: full scree
    if (event.keyCode == 70) {
        document.getElementsByClassName('vjs-fullscreen-toggle-control-button')[0].click();
    }
}


/*
Notes:

- This script is designed for US keyboards. Some shortcuts won't work on non US keyboard. Non US keyboard users will need to edit keys in the script.

- In YouTube, if the video speed is below 0.25x or above 2x, the YouTube setting display will be capped to 0.1x or 2x.
- Web browser video speeds: Firefox = 0.25 to 5.0; Chrome = 0.1 to 16.0.


Keyboard Shortcuts:

j                  = Rewind media by 5 seconds
k                  = Fast forward media by 5 seconds
LEFT               = Rewind media by 5 seconds
RIGHT              = Fast forward media by 5 seconds
SHIFT+LEFT         = Rewind media by 30 seconds
SHIFT+RIGHT        = Fast forward media by 30 seconds
SHIFT+LEFT         = Rewind media by 30 seconds
SHIFT+j            = Fast forward media by 30 seconds
CTRL+l             = Rewind media by 1 minute
CTRL+RIGHT         = Fast forward media by 1 minute
CTRL+SHIFT+LEFT    = Rewind media by 5 minutes
CTRL+SHIFT+RIGHT   = Fast forward media by 5 minutes
CTRL+/             = Fast forward media by 1.5 minutes
0 to 9             = Seek media to 0%, 10%, 20%,...90%
SHIFT+0 to SHIFT+9 = Seek media to 5%, 15%, 25%,...95%
CTRL+1 to CTRL+5   = Change audio volume to 20%, 40%, 60$, 80%, 100%
vinc:SHIFT+<       = Decrease media speed by 0.2x (by default)
vinc:z             = Decrease media speed by 0.2x (by default)
vinc:SHIFT+        = Increase media speed by 0.2x (by default)
vinc:x             = Increase media speed by 0.2x (by default)
CTRL+;             = Reset media speed
CTRL+'             = Change custom media speed
CTRL+\             = Change unit of media speed increment/decrement

For Widescreen Video Viewport:
CTRL+6             = Zoom ultra widescreen content to remove top+bottom borders, but also remove left+right content a bit.
CTRL+7             = Change video aspect ratio for letterbox content. Fix 4:3 letterbox content stretched to widescreen format.
CTRL+8             = Change video aspect ratio for TV content. Fix 4:3 TV content stretched to widescreen format.

For 4:3 TV Video Viewport:
CTRL+SHIFT+6       = Change video aspect ratio for ultra widescreen content. Fix ultra widescreen content compressed into 4:3 TV format.
CTRL+SHIFT+7       = Zoom 4:3 letterbox content to remove half of top+bottom borders, but also remove left+right content a little.
                     This can also be used to half-zoom ultra widescreen content on widescreen viewport. i.e. half-zoom of CTRL+6.
CTRL+SHIFT+8       = Change video aspect ratio for widescreen content. Fix widescreen content compressed into 4:3 TV format.

For Any Video Viewport:
CTRL+9             = Reset video aspect ratio
*/

((eleOSD, osdTimer) => {

  //=== CONFIGURATION BEGIN ===

  //Video speed increment/decrement unit.
  var incrementUnit = 0.2;

  //Duration (in milliseconds) to display On Screen Display (OSD) when changing playback rate. Set to zero or less to disable.
  var osdTimeout = 3000;

  //Keyboard shortcuts.
  //key = Key name. String type if single shortcut, or array of string if multiple shortcut (for single function multiple shortcuts).
  //      Each key name can either be the character which is produced by the key (e.g. `a`, `4`, `*`, etc.),
  //      or the code name for the key (e.g. `Digit2`, `BracketLeft`, etc.). Both types are case sensitive.
  //      When SHIFT modifier is used with keys which produces a character, key code name should be used.
  //      A list of key code names can be found here: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
  //modifiers = Any combinations of "C", "S", and "A", for Ctrl, Shift, and Alt keys.
  var keys = [
    { //ctrl+space: seek media to next frame (only when paused. firefox only)
      key: " ", modifiers: "C",
      func: (key, ele) => ele.seekToNextFrame && ele.seekToNextFrame()
    },
    { //0 to 9: seek media to 0%,10%,20%,...90%
      key: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], modifiers: "",
      func: (ele, key, keyIndex) => ele.currentTime = keyIndex / 10 * ele.duration
    },
    { //shift+0 to shift+9: seek media to 5%,15%,25%,...95%
      key: [")", "!", "@", "#", "$", "%", "^", "&", "*", "("], modifiers: "S",
      func: (ele, key, keyIndex) => ele.currentTime = (keyIndex + 0.5) / 10 * ele.duration
    },
    { //ctrl+1 to ctrl+5: set audio volume to 20%,40%,60%,80%,100%
      key: ["1", "2", "3", "4", "5"], modifiers: "C",
      func: (ele, key, keyIndex)  => updAudioVolume(ele, (parseInt(key) * 2) / 10)
    },
    { //vinc:j: rewind media by 5 seconds
      key: "j", modifiers: "",
      func: (ele, key) => ele.currentTime -= 5
    },
    { //vinc:left: rewind media by 5 seconds
      key: "ArrowLeft", modifiers: "",
      func: (ele, key) => ele.currentTime -= 5
    },
    { //shift+left: rewind media by 30 seconds
      key: "ArrowLeft", modifiers: "S",
      func: (ele, key) => ele.currentTime -= 30
    },
    { //shift+left: rewind media by 30 seconds
      key: "j", modifiers: "S",
      func: (ele, key) => ele.currentTime -= 30
    },
    { //ctrl+left: rewind media by 1 minute
      key: "ArrowLeft", modifiers: "C",
      func: (ele, key) => ele.currentTime -= 60
    },
    { //ctrl+shift+left: rewind media by 5 minutes
      key: "ArrowLeft", modifiers: "CS",
      func: (ele, key) => ele.currentTime -= 300
    },
    { //vinc:k: fast forward media by 5 seconds
      key: "l", modifiers: "",
      func: (ele, key) => ele.currentTime += 5
    },
    { //vinc:right: fast forward media by 5 seconds
      key: "ArrowRight", modifiers: "",
      func: (ele, key) => ele.currentTime += 5
    },
    { //shift+right: fast forward media by 30 seconds
      key: "ArrowRight", modifiers: "S",
      func: (ele, key) => ele.currentTime += 30
    },
    { //shift+right: fast forward media by 30 seconds
      key: "k", modifiers: "S",
      func: (ele, key) => ele.currentTime += 30
    },
    { //ctrl+right: fast forward media by 1 minute
      key: "ArrowRight", modifiers: "C",
      func: (ele, key) => ele.currentTime += 60
    },
    { //ctrl+shift+right: fast forward media by 5 minutes
      key: "ArrowRight", modifiers: "CS",
      func: (ele, key) => ele.currentTime += 300
    },
    { //ctrl+/: fast forward media by 1.5 minutes
      key: "/", modifiers: "CS",
      func: (ele, key) => ele.currentTime += 90
    },
    { //vinc:shift+<: decrease media speed by 0.2
      key: "<", modifiers: "S",
      func: (ele, key) => {
        key = ele.playbackRate - incrementUnit;
        if (key < 0.1) {
          key = 0.1;
        } else if ((key < 1) && (ele.playbackRate > 1)) key = 1;
        updVideoSpeed(ele, key);
      }
    },
    { //vinc:z: decrease media speed by 0.2
      key: "z", modifiers: "",
      func: (ele, key) => {
        key = ele.playbackRate - incrementUnit;
        if (key < 0.1) {
          key = 0.1;
        } else if ((key < 1) && (ele.playbackRate > 1)) key = 1;
        updVideoSpeed(ele, key);
      }
    },
    { //vinc:shift+> increase media speed by 0.2
      key: ">", modifiers: "S",
      func: (ele, key) => {
        key = ele.playbackRate + incrementUnit;
        if (key > 16) {
          key = 16;
        } else if ((key > 1) && (ele.playbackRate < 1)) key = 1;
        updVideoSpeed(ele, key);
      }
    },
    { //vinc:x increase media speed by 0.2
      key: "x", modifiers: "",
      func: (ele, key) => {
        key = ele.playbackRate + incrementUnit;
        if (key > 16) {
          key = 16;
        } else if ((key > 1) && (ele.playbackRate < 1)) key = 1;
        updVideoSpeed(ele, key);
      }
    },
    { //ctrl+;: reset media speed to 1x
      key: ";", modifiers: "C",
      func: (ele, key) => updVideoSpeed(ele, 1)
    },
    { //ctrl+': use custom media speed
      key: "'", modifiers: "C",
      func: (ele, key) => {
        if ((key = prompt("Enter media speed from 0.1 to 16 (inclusive).\ne.g.: 1 = Normal, 0.5 = Half, 2 = Double, 3 = Triple, etc.", ele.playbackRate)) === null) return;
        if (isNaN(key = parseFloat(key.trim()))) {
          alert("Input must be a number.");
          return;
        }
        updVideoSpeed(ele, (key = parseFloat(key.toFixed(1))) < 0.1 ? 0.1 : (key > 16 ? 16 : key));
      }
    },
    { //ctrl+\: change unit of media speed increment/decrement
      key: "\\", modifiers: "C",
      func: (ele, key) => {
        if ((key = prompt("Enter unit of media speed increment/decrement from 0.1 to 4 (inclusive).", incrementUnit)) === null) return;
        if (!isNaN(key = parseFloat(key.trim()))) {
          incrementUnit = (key = parseFloat(key.toFixed(1))) < 0.1 ? 0.1 : (key > 4 ? 4 : key);
        } else alert("Input must be a number.");
      }
    },
    { //ctrl+6: Zoom ultra widescreen
      key: "6", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("scale(1.3333)", "Ultra Widescreen Zoom")
    },
    { //ctrl+7: Letterbox aspect ratio
      key: "7", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleY(1.3333)", "Letterbox")
    },
    { //ctrl+8: TV aspect ratio
      key: "8", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleX(0.75)", "TV")
    },
    { //ctrl+shift+6: Ultra widescreen aspect ratio
      key: "Digit6", modifiers: "CS", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleY(0.7168)", "Ultra Widescreen")
    },
    { //ctrl+shift+7: Half-zoom letterbox
      key: "Digit7", modifiers: "CS", videoOnly: true,
      func: (ele, key) => updVideoAspect("scale(1.1666)", "Letterbox Half-Zoom")
    },
    { //ctrl+shift+8: Widescreen aspect ratio
      key: "Digit8", modifiers: "CS", videoOnly: true,
      func: (ele, key) => updVideoAspect("scaleY(0.5625)", "Widescreen")
    },
    { //ctrl+9: reset video aspect ratio
      key: "9", modifiers: "C", videoOnly: true,
      func: (ele, key) => updVideoAspect("", "Reset")
    }
  ];
  keys.forEach((k, s, m) => {
    s = k.modifiers.toUpperCase();
    k.modifiers = {ctrl: s.includes("C"), shift: s.includes("S"), alt: s.includes("A")};
  });

  //=== CONFIGURATION END ===

  function showOSD(s) {
    if (osdTimeout < 0) return;
    if (eleOSD) {
      eleOSD.textContent = s;
    } else {
      eleOSD = document.createElement("DIV");
      eleOSD.style.cssText = "position:fixed;z-index:999999999;right:.5rem;bottom:.5rem;margin:0;padding:.2rem .5rem .1rem .5rem;width:auto;height:auto;font:normal 16pt/normal sans-serif;background:#444;color:#fff";
      eleOSD.textContent = s;
      document.body.appendChild(eleOSD);
    }
    clearTimeout(osdTimer);
    osdTimer = setTimeout(() => {
      eleOSD.remove();
      eleOSD = null;
    }, osdTimeout);
  }

  function stopEvent(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }

  function updVideoSpeed(ele, spd, e) {
    if ((location.hostname === "www.youtube.com") && (e = ele.parentNode.parentNode).setPlaybackRate && (spd >= 0.25) && (spd <= 2)) {
      e.setPlaybackRate(spd = parseFloat(spd.toFixed(1)));
    } else ele.playbackRate = spd = parseFloat(spd.toFixed(1));
    showOSD("Speed " + spd + "x");
  }

  function updVideoAspect(asp, label, s) {
    if (!(s = document.getElementById("vidAspOvr"))) document.body.appendChild(s = document.createElement("STYLE")).id = "vidAspOvr";
    s.innerHTML = asp ? `video{transform:${asp}!important}` : "";
    showOSD("Ratio: " + label);
  }

  function updAudioVolume(ele, vol) {
    if ((location.hostname === "www.youtube.com") && (e = ele.parentNode.parentNode).setVolume) {
      e.setVolume(vol * 100);
    } else ele.volume = vol;
    showOSD("Audio " + (vol * 100) + "%");
  }

  incrementUnit = parseFloat((incrementUnit < 0.1 ? 0.1 : (incrementUnit > 1 ? 1 : incrementUnit)).toFixed(1));
  addEventListener("keydown", function(ev, ele) {
    if ((!(ele = document.activeElement) || !((ele.contentEditable === "true") || ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(ele.tagName))) && (ele = document.querySelector("video,audio"))) {
      keys.some((k, a, i) => {
        a = Array.isArray(k.key);
        if (
          ((!a && ((k.key === ev.key) || (k.key === ev.code))) || (a && (((i = k.key.indexOf(ev.key)) >= 0) || ((i = k.key.indexOf(ev.code)) >= 0)))) &&
          (k.modifiers.ctrl === ev.ctrlKey) && (k.modifiers.shift === ev.shiftKey) && (k.modifiers.alt === ev.altKey) &&
          (!k.videoOnly || (ele.tagName === "VIDEO"))
        ) {
          stopEvent(ev);
          k.func(ele, ev.key, a ? i : null);
          return true;
        }
      });
    }
  }, true);

})();
