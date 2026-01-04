// ==UserScript==
// @name        TGChan ID Colors
// @namespace   tgchanIDColors
// @description Adds a background color to post IDs
// @include     *//tgchan.org/kusaba/quest/*
// @include     *//tgchan.org/kusaba/questdis/*
// @include     *//tgchan.org/kusaba/questarch/*
// @include     *//tgchan.org/kusaba/graveyard/*
// @version     3
// @grant       none
// @icon        data:image/vnd.microsoft.icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsSAAALEgHS3X78AAAANklEQVQokWNgoBOI2mJKpEomMvQgNAxRPUy4JGjjJJqoZoSrZmBgWOZzGlk/mlKILBMafxAAAE1pG/UEXzMMAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/31138/TGChan%20ID%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/31138/TGChan%20ID%20Colors.meta.js
// ==/UserScript==

HSVtoRGB= function(color) {
  var i;
  var h,s,v,r,g,b;
  h = color[0]; s = color[1]; v = color[2];
  h /= 60;            //hue sector 0 to 5
  i = Math.floor( h );
  f = h - i;          // factorial part of h
  p = v * ( 1 - s );
  q = v * ( 1 - s * f );
  t = v * ( 1 - s * ( 1 - f ) );
  switch( i ) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    default: // case 5:
      r = v; g = p; b = q; break;
  }
  return [Math.round(r),Math.round(g),Math.round(b)];
};

var IDColor = {
  ids: {}
};
IDColor.apply = function(uid) {
  var newSpan = document.createElement("span");
  newSpan.textContent = 'ID: ';
  uid.parentNode.insertBefore(newSpan, uid);
  uid.textContent = uid.textContent.substring(3);
  var str = uid.textContent;
  var hash = parseInt(str, 16);
  var rgb1, rgb2;
  if (!IDColor.ids[str]) {
      var hsv1 = [((hash & 0xFF) * 360) / 255, 1, 255];
      var hsv2 = [hsv1[0], 1, 255];
      var brightness = (hash >> 8) & 0xFF;
      var brightness2 = (hash >> 16) & 0xFF;
      if (brightness > 127) { //saturation = 1.0, value varies between 127 and 255
        hsv1[2] = brightness;
      }
      else { //value = 255, saturation varies between 0.5 and 1
        hsv1[1] = ((brightness / 127) / 2) + 0.5; //0.5 - 1
      }
      if (brightness2 > 127) {
        hsv2[2] = (brightness2 - 63) * 1.5;
      }
      else {
        hsv2[1] = ((brightness2 / 127) * 0.75) + 0.25;
      }
      rgb1 = HSVtoRGB(hsv1);
      rgb2 = HSVtoRGB(hsv2);
      rgb1[3] = ((rgb1[0] * 0.299) + (rgb1[1] * 0.587) + (rgb1[2] * 0.114)) > 125; //text color, black or white
      IDColor.ids[str] = [rgb1, rgb2];
  }
  var rgbs = IDColor.ids[str];
  rgb1 = rgbs[0];
  rgb2 = rgbs[1];
  uid.style.cssText = "background-color: rgb(" + rgb1[0] + "," + rgb1[1] + "," + rgb1[2] + ");" +
    " color: " + (rgb1[3] ? "black;" : "white;") +
    " padding: 0 5px; border-radius: 6px; " +
    " border-color: rgb(" + rgb2[0] + "," + rgb2[1] + "," + rgb2[2] + ");" +
    " border-style: solid; border-width: 2px;";
};

//main
var uids = document.getElementsByClassName('uid');
if (uids) {
	uids.forEach(IDColor.apply);
}