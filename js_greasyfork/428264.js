// ==UserScript==
// @name        Better XVideos.com
// @namespace   Violentmonkey Scripts
// @match       https://www.xvideos.com/video*
// @grant       none
// @version     3.3
// @author      -
// @description Always expand video to large size, scroll down to video, use w a s d to rotate video, q e ` 1 2 3 4 5 z x to seek, v V to frame advance, allow seeking to 0:00, allow clicking anywhere to start video, infinite volume up and down - 2025-05-30, 14:44
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428264/Better%20XVideoscom.user.js
// @updateURL https://update.greasyfork.org/scripts/428264/Better%20XVideoscom.meta.js
// ==/UserScript==

const gainStep = 0.8; // gain when stepping the volume down. volume up will be the inverse. configure to your liking.

this.$ = jQuery.noConflict(true);

const scrollToVideo = () => {
  $("div#video-player-bg")[0].scrollIntoView({
    behavior: 'instant',
    block: 'center',
    inline: 'center'
  });
};
// Poll until the video has the desired class
const scrollToVideoAfterFullWidth = () => {
  var host = {};
  const scrollPoll = (host) => {
    if ($("div#content")[0].classList.contains("player-enlarged")) {
      scrollToVideo();
      clearInterval(host.id);
      setTimeout(scrollToVideo, 500); // one more, for Jesus
    }
  }
  host.id = setInterval(scrollPoll.bind(null, host), 5);
};

$("div#video-player-bg").ready(() => {
  setTimeout(() => {
    if (! $("div#content")[0].classList.contains("player-enlarged")) {
      $("span.pif-full-width")[0].click();
    }
    scrollToVideoAfterFullWidth();
  }, 100);
});

// Poll until the video has changed its full screen status and then run callback multiple times to make sure it hits right.
const waitFullScreenChange = (callback) => {
  const initial = html5player.isFullScreen;
  var host = {};
  const fullScreenPoll = (host) => {
    if (html5player.isFullScreen != initial) {
      setTimeout(callback, 10);
      setTimeout(callback, 50);
      setTimeout(callback, 75);
      setTimeout(callback, 100);
      setTimeout(callback, 200);
      clearInterval(host.id);
    }
  }
  host.id = setInterval(fullScreenPoll.bind(null, host), 5);
};

// Somehow, the below didn't work - the button got added, but when clicking it,
// it showed the menu for the next button to the right (originally from xvideos),
// and that button showed the menu for the next one, etc.
//
//$("button#v-actions-overflow-menu").ready(function () {
//  var rotationButtons = `<button class="tab-button rotate-video-right"><span>Rotate video right (E)</span></button>`
//  $(rotationButtons).insertAfter("button#v-actions-overflow-menu")
//})

const video = $("div#video-player-bg video")[0];

//keyboard handler for various things
$("html").ready(() => {


  // make whole player clickable to start playing
  $("div.video-pic").click(() => { $("span.pif-play").trigger("click") });


  // define our keyboard handler

  var orientation = 0; // 0, 90, 180, 270

  const setVideoOrientation = (angle) => { // set absolute rotation for video
    if (0 === angle) { // no rotation
      $("div.video-bg-pic > video").css("transform", "");
      return true;
    } else if(90 === angle) { // rotated to the right
      const fitScale = Math.min(video.videoWidth / video.videoHeight, video.videoHeight / video.videoWidth);
      const transform = `rotate(${angle}deg) scale(${fitScale})`;
      $("div.video-bg-pic > video").css("transform", transform);
      return true;
    } else if (180 === angle) { // upside down
      $("div.video-bg-pic > video").css("transform", "scaleX(-1) scaleY(-1)");
      return true;
    } else if (270 === angle) { // rotated left
      const fitScale = Math.min(video.videoWidth / video.videoHeight, video.videoHeight / video.videoWidth);
      const transform = `rotate(${angle}deg) scale(${fitScale})`;
      $("div.video-bg-pic > video").css("transform", transform);
      return true;
    }
    return false;
  };

  const cycleOrientationRight = () => {
    const desiredOrientation = (orientation % 360) + 90;
    const moduloOrientation = desiredOrientation % 360; // make sure it's 0...359
    orientation = moduloOrientation;
  };

  const cycleOrientationLeft = () => {
    const desiredOrientation = (orientation % 360) - 90;
    const moduloOrientation = (desiredOrientation + 360) % 360; // make sure it's 0...359. note x % 360 clamps to (-359.999... ... 359.999)
    orientation = moduloOrientation;
  };

  const cycleOrientation180 = () => {
    const desiredOrientation = (orientation % 360) + 180;
    const moduloOrientation = desiredOrientation % 360; // make sure it's 0...359
    orientation = moduloOrientation;
  };

  // Seek to fraction of video between 0 and 1, meaning start and end.
  const seekFraction = (fraction) => {
    if((fraction > 1) || (fraction < 0)) {
      return false;
    }
    video.currentTime = video.duration * fraction;
    return true;
  };

  const videoExtraGain = (mediaElem) => {
    // Chrome compat
    var context = new(window.AudioContext || window.webkitAudioContext);
    var result = {
      context: context,
      source: context.createMediaElementSource(mediaElem),
      gain: context.createGain(),
      media: mediaElem,
      amplify: function(multiplier) {
        result.gain.gain.value = multiplier;
      },
      getAmpLevel: function() {
        return result.gain.gain.value;
      }
    };
    result.source.connect(result.gain);
    result.gain.connect(context.destination);
    result.amplify(1);
    return result;
  };

  const vidGain = videoExtraGain(video);
  vidGain.amplify(1);

  var totalGain = video.volume;

  const gainToDb = (gain) => 20 * Math.log10(gain);

  const volumeSet = (desiredGain) => {
    const dBString = gainToDb(desiredGain).toFixed(1);
    if (desiredGain <= 1) {
      vidGain.amplify(1);
      html5player.setVolume(desiredGain);
    } else {
      html5player.setVolume(1);
      vidGain.amplify(desiredGain);
    }
    console.log(`Set gain to ${dBString} dB.`); // logging at the end to make it show up after website spam
  };

  const volumeUp = () => {
    if (totalGain <= 0) {
      totalGain == 0.0000001; // 0 multiplied by anything is always zero, so we need to be able to escape it.
    }
    const desiredGain = totalGain / gainStep;
    totalGain = desiredGain;
    volumeSet(desiredGain);
  };

  const volumeDown = () => {
    const desiredGain = totalGain * gainStep;
    totalGain = desiredGain;
    volumeSet(desiredGain);
  };

  const playPause = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const fullScreen = () => {
    waitFullScreenChange(() => { setVideoOrientation(orientation); });
    html5player.fullscreen();
    return true;
  };

  const keyboardHandlerInner = (event) => {
    if ("w" == event.key) { // restore upright rotation (no rotation)
      orientation = 0;
      setVideoOrientation(orientation);
      return true;
    }
    if ("a" == event.key) { // rotate head 90 degrees to the left
      cycleOrientationRight();
      setVideoOrientation(orientation);
      return true;
    }
    if ("s" == event.key) { // turn upside down
      cycleOrientation180();
      setVideoOrientation(orientation);
      return true;
    }
    if ("d" == event.key) { // rotate head 90 degrees to the right
      cycleOrientationLeft();
      setVideoOrientation(orientation);
      return true;
    }
    if ( ("ArrowLeft" == event.key) || ("q" == event.key) ) { // seek left
      video.currentTime = Math.max(0, video.currentTime - 10);
      return true;
    }
    if ( ("ArrowRight" == event.key) || ("e" == event.key) ) { // seek right
      video.currentTime = Math.min(video.currentTime + 10, Math.floor(video.duration));
      return true;
    }
    if ("z" == event.key) { // seek left long
      video.currentTime = Math.max(0, video.currentTime - 60);
      return true;
    }
    if ("x" == event.key) { // seek right long
      video.currentTime = Math.min(video.currentTime + 60, Math.floor(video.duration));
      return true;
    }
    if ("v" == event.key) { // frame advance (we don't know the FPS so we'll just assume 30 fps)
      video.pause();
      video.currentTime = Math.min(video.currentTime + 1/30, Math.floor(video.duration));
      return true;
    }
    if ("V" == event.key) { // frame advance backwards (we don't know the FPS so we'll just assume 30 fps)
      video.pause();
      video.currentTime = Math.max(0, video.currentTime - 1/30);
      return true;
    }
    if (" " == event.key) { // space - play/pause
      playPause();
      return true;
    }

    if ("`" == event.key) { seekFraction(  0); return true; }
    if ("1" == event.key) { seekFraction(0.1); return true; }
    if ("2" == event.key) { seekFraction(0.2); return true; }
    if ("3" == event.key) { seekFraction(0.4); return true; }
    if ("4" == event.key) { seekFraction(0.6); return true; }
    if ("5" == event.key) { seekFraction(0.8); return true; }

    if ("ArrowUp"   == event.key) { volumeUp();   return true; }
    if ("ArrowDown" == event.key) { volumeDown(); return true; }

    if ("f" == event.key) { fullScreen(); return true; }

    return false;
  };

  const handlerStopsEvents = (handler) => {
    const wrapper = (event) => {
      // console.log('handler: event.target: ', event.target);
      // console.log('handler: event.currentTarget: ', event.currentTarget);

      const ret = handler(event);
      if (ret) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
      return null; // pass to xvideos own handler and the browser. only happens on null, and never on false etc.
    };
    return wrapper;
  };

  videoClickHandlerDiv = document.querySelector('div.video-click-handler');

  const isOverNavBar = (event) => {
    return ( (event.offsetY > videoClickHandlerDiv.clientHeight * 0.8) || (event.offsetY > videoClickHandlerDiv.clientHeight - 140) );
  };

  const mouseMoveHandlerInner = (event) => {
    // stop the nav bar from popping up on mouse move unless the mouse cursor is close to it.
    if (! isOverNavBar(event) ) {
      return true;
    }
    return false; // pass to xvideos own handler and the browser
  };

  const clickHandlerInner = (event) => {
    // stop the nav bar from popping up on click unless the mouse cursor is close to it.
    if (! isOverNavBar(event) ) {
      $("div.video-click-handler").trigger('mouseup');
      playPause();
      return true;
    }
    return false; // pass to xvideos own handler and the browser
  }

  const keyboardHandler = handlerStopsEvents(keyboardHandlerInner);

  $("html").keydown(keyboardHandler);

  const mouseMoveHandler = handlerStopsEvents(mouseMoveHandlerInner);

  $("div.video-click-handler").mousemove(mouseMoveHandler);

  // const clickHandler = handlerStopsEvents( (event) => { console.log('click handler: event:', event); return false; });

  const clickHandler = handlerStopsEvents(clickHandlerInner);

  // TODO: doesn't work currently for some reason. it triggers the drag-to-seek functionality.
  // $("div.video-click-handler").click(clickHandler);




  /* actually this whole thing with finding the old handler doesn't do anything anymore, the handler always comes up null.

  // attach our keyboard handler - step 1: find old keyboard handler

  const getHandlerOnElm = (handler, element) => {
    var ret = null;
    $.each($._data(element, "events"), function(i, event) {
      // i is the event type, like "click"
      if (i != handler) return;
      $.each(event, function(j, h) {
        // h.handler is the function being called
        ret = h.handler;
      });
    });
    return ret;
  }

  const xvKeyboardHandler = getHandlerOnElm("keydown", $("html")[0]);

  // const xvMouseOverHandler = getHandlerOnElm("mouseover", $("div.video-click-handler")[0]);

  // attach our keyboard handler - step 2: override keyboard handler with our pass-through

  // $("html").off("keydown", "**") // BROKEN - currently doesn't detach the original listener

  $("html").keydown((event) => {
    if((keyboardHandler(event) === false) && (xvKeyboardHandler !== null)) {
      xvKeyboardHandler(event); // BROKEN - the original listener fires no matter what
    }
  });
  */




});
