// ==UserScript==
// @id             video.golem.de-cf1af14e-25ea-4d9a-9924-58563eb39677@https://github.com/about-robots/
// @name           golem-html5-vids
// @description    Golem.de HTML5 Videos: kill flash and ads on golem.de!
// @namespace      https://github.com/about-robots/
// @author         about:robots
// @include        http://video.golem.de/*
// @include        http://www.golem.de/news/*
// @run-at         document-end
//
// @version        1.4.2
// @downloadURL https://update.greasyfork.org/scripts/4295/golem-html5-vids.user.js
// @updateURL https://update.greasyfork.org/scripts/4295/golem-html5-vids.meta.js
// ==/UserScript==

var styleUnfocused = "color:rgba(255,255,255,0.3);background:rgba(0,0,0,0.1);cursor:pointer;height:32px;width:32px;position:absolute;top:1em;right:0.8em;font:bold 18px/32px sans-serif;text-align:center;border-radius:4px;";
var styleMouseover = "color:rgba(255,255,255,0.5);background:rgba(0,0,0,0.2);cursor:pointer;height:32px;width:32px;position:absolute;top:1em;right:0.8em;font:bold 18px/32px sans-serif;text-align:center;border-radius:4px;";
function createSwitchMouseOver(Id) {
  return function() { document.getElementById(Id).setAttribute("style", styleMouseover); };
}
function createSwitchMouseOut(Id) {
  return function() { document.getElementById(Id).setAttribute("style", styleUnfocused); };
}
function createSwitchOnClick(vidId, swId, vUrlHD, vUrlSD) {
  return function() {
    var video = document.getElementById(vidId);
    var qswitch = document.getElementById(swId);
    var videoPos = video.currentTime - 1.1;
    if (videoPos < 0) videoPos = 0;
    if (qswitch.innerHTML == "HD") {
      localStorage.setItem("videoQuality", "SD");
      qswitch.innerHTML = "SD";
      video.setAttribute("src", vUrlHD);
    } else {
      localStorage.setItem("videoQuality", "HD");
      qswitch.innerHTML = "HD";
      video.setAttribute("src", vUrlSD);
    }
    video.play();
    video.oncanplay = function() {
      video.currentTime = videoPos;
      video.oncanplay = "";
    };
  };
}

var divs = document.getElementById("screen").getElementsByTagName("div");
var videoDIV = [];
for (var i = 0; i < divs.length; i++) {
  if (divs[i].id.indexOf("NVBPlayer") > -1) {
    videoDIV.push(divs[i]);
  }
}
for (var i = 0; i < videoDIV.length; i++) {
  var videoId = videoDIV[i].id.substring(9);
  var videoURL_HD = "http://video.golem.de/download/"+videoId+"?q=high";
  var videoURL_SD = "http://video.golem.de/download/"+videoId+"?q=normal";
  var html5video = document.createElement("video");
  var qualitySwitch = document.createElement("div");
  var style = videoDIV[i].getAttribute("style")
  var i1 = style.indexOf("http");
  var i2 = style.indexOf('"', i1);
  var snapshotImg = style.substring(i1, i2);
  html5video.setAttribute("poster", snapshotImg);
  html5video.setAttribute("width", 620);
  html5video.setAttribute("height", 349);
  html5video.setAttribute("controls", 1);
  var html5vidId = "html5video"+videoId;
  html5video.setAttribute("id", html5vidId);
  if (localStorage.getItem("videoQuality") === null) {
    localStorage.setItem("videoQuality", "SD");
  }
  if (localStorage.getItem("videoQuality") == "SD") {
    html5video.setAttribute("src", videoURL_SD);
    qualitySwitch.innerHTML = "SD";
  } else {
    html5video.setAttribute("src", videoURL_HD);
    qualitySwitch.innerHTML = "HD";
  }
  qualitySwitch.setAttribute("style", styleUnfocused);
  qualitySwitch.setAttribute("title", "Qualität zwischen SD und HD umschalten");
  var switchId = "qualitySwitch"+videoId;
  qualitySwitch.setAttribute("id", switchId);
  while (videoDIV[i].hasChildNodes()) {
    videoDIV[i].removeChild(videoDIV[i].lastChild);
  }
  qualitySwitch.onmouseover = createSwitchMouseOver(switchId);
  qualitySwitch.onmouseout = createSwitchMouseOut(switchId);
  qualitySwitch.onclick = createSwitchOnClick(html5vidId, switchId, videoURL_HD, videoURL_SD);
  videoDIV[i].appendChild(html5video);
  videoDIV[i].appendChild(qualitySwitch);
}
