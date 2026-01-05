// ==UserScript==
// @name        Youtube Speed Control With + and -
// @namespace   YoutubeSpeedPlusMinus
// @description Increases the playback speed when the + key on the numpad is pressed, and decreases when the - key is pressed
// @include     https://www.youtube.com/*
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24246/Youtube%20Speed%20Control%20With%20%2B%20and%20-.user.js
// @updateURL https://update.greasyfork.org/scripts/24246/Youtube%20Speed%20Control%20With%20%2B%20and%20-.meta.js
// ==/UserScript==

function pressKey(keyCode)
{
  var eventObj = document.createEventObject ? document.createEventObject() : document.createEvent("Events");

  if(eventObj.initEvent)
  {
    eventObj.initEvent("keydown", true, true);
  }

  eventObj.keyCode = keyCode;
  eventObj.shiftKey = true;

  if (document.dispatchEvent)
  {
    document.dispatchEvent(eventObj);
  }
  else
  {
    document.fireEvent("onkeydown", eventObj);
  }
}

document.onkeydown = function(evt)
{
  var keyboardEvent = document.createEvent("KeyboardEvent");
  var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

  switch (evt.keyCode)
  {
    case 106:
      //console.log("speed normal");
      var player = document.querySelector(".html5-main-video");

      if (player)
      {
        var lookup = 
            {
              0.25:  3,
              0.5 :  2,
              0.75:  1,
              1   :  0,
              1.25: -1,
              1.5 : -2,
              2   : -3
            }[player.playbackRate];
        for (var i = 0; i < lookup; i++)
        {
          pressKey(190);
        }
        for (var i = 0; i < -lookup; i++)
        {
          pressKey(188);
        }
      }
      break;
    case 107:
      //console.log("speed up");
      pressKey(190);
      break;
    case 109:
      //console.log("speed down");
      pressKey(188);
      break;
  }
};
