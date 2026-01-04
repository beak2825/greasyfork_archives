// ==UserScript==
// @name     DMM Subtitle
// @name:zh-TW   DMM 外掛字幕
// @author ug945
// @description Watch DMM video with subtitles. Drag srt file to the player.
// @description:zh-TW DMM 外掛字幕。拖曳字幕檔進播放器即可。
// @version  0.1.3
// @match https://www.dmm.co.jp/digital/-/player/=/player=html5/*
// @grant    none
// @run-at document-idle
// @namespace https://greasyfork.org/users/466290
// @downloadURL https://update.greasyfork.org/scripts/401797/DMM%20Subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/401797/DMM%20Subtitle.meta.js
// ==/UserScript==
var style = document.createElement('style');
style.innerHTML = `
  .area-subControls {
      float: left;
      margin-top: -30px;
  }
  .area-subControls > div {
      float: right;
  }
  .btn-sub {
      cursor: pointer;
      width: 50px;
      line-height: 27px;
      margin-top: -2px;
      color: #939393;
      font-size: 11px;
      text-align: center;
  }
  .area-sub {
      position: relative;
      margin: 0 12px 0 12px;
  }
`;

document.body.appendChild(style);

var videoPlayer = document.querySelector("video");
var videoTrack = document.createElement('track');
videoTrack.kind = "subtitles";
videoTrack.setAttribute("default", "");
videoPlayer.appendChild(videoTrack);

var divSubOffset = document.createElement('div');
divSubOffset.classList.add("area-sub");
divSubOffset.id = "sub_offset";
divSubOffset.innerHTML = "+0ms";
divSubOffset.offset = 0;
divSubOffset.lock = false;


var buttonSubMinus = document.createElement('div');
buttonSubMinus.classList.add("area-sub");
buttonSubMinus.classList.add("button");
buttonSubMinus.id = "sub_minus100";
buttonSubMinus.innerHTML = `<div class="btn-sub is-active active-mode">-200ms</div>`;
var buttonSubPlus = document.createElement('div');
buttonSubPlus.classList.add("area-sub");
buttonSubPlus.classList.add("button");
buttonSubPlus.id = "sub_plus100";
buttonSubPlus.innerHTML = `<div class="btn-sub is-active active-mode">+200ms</div>`;

buttonSubMinus.addEventListener('click', onSubMinusClicked, false);
buttonSubPlus.addEventListener('click', onSubPlusClicked, false);


var subControls = document.createElement('div');
subControls.classList.add("area-subControls");
subControls.classList.add("group");
subControls.style.display = "none";
document.getElementById("seek-padding").parentNode.appendChild(subControls);
subControls.appendChild(divSubOffset);
subControls.appendChild(buttonSubPlus);
subControls.appendChild(buttonSubMinus);

videoPlayer.addEventListener('dragover', handleDragOver, false);
videoPlayer.addEventListener('drop', handleFileSelect, false);

function onSubMinusClicked(event) {
  if(!divSubOffset.lock){
    divSubOffset.lock = true;
    if(videoTrack.track.cues.length>0){
      Array.from(videoTrack.track.cues).forEach((cue) => {
        cue.startTime -= 0.2;
        cue.endTime -= 0.2;
      });
      divSubOffset.offset -= 200;
      divSubOffset.innerHTML = (divSubOffset.offset<0?"":"+") + divSubOffset.offset + "ms";
    }
    divSubOffset.lock = false;
  }
}

function onSubPlusClicked(event) {
  if(!divSubOffset.lock){
    divSubOffset.lock = true;
    if(videoTrack.track.cues.length>0){
      Array.from(videoTrack.track.cues).forEach((cue) => {
        cue.startTime += 0.2;
        cue.endTime += 0.2;
      });
      divSubOffset.offset += 200;
      divSubOffset.innerHTML = (divSubOffset.offset<0?"":"+") + divSubOffset.offset + "ms";
    }
    divSubOffset.lock = false;
  }
}

function setTrack(file) {
  var reader = new FileReader();
  reader.onload = function(evt) {
    var vtt = srt2webvtt(evt.target.result);    
    var trackBlob = new Blob([vtt], {type:"text/plain;charset=utf-8"});
		var trackUrl = URL.createObjectURL(trackBlob);
    videoTrack.src = trackUrl;  
    divSubOffset.offset = 0;
    divSubOffset.innerHTML = (divSubOffset.offset<0?"":"+") + divSubOffset.offset + "ms";
		subControls.style.display = "block";
  };
  reader.readAsText(file);
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.dataTransfer.files;
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    setTrack(f)
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}

function srt2webvtt(data) {
  var srt = data.replace(/\r+/g, '');
  srt = srt.replace(/^\s+|\s+$/g, '');
  var cuelist = srt.split('\n\n');
  var result = "";
  if (cuelist.length > 0) {
    result += "WEBVTT\n\n";
    for (var i = 0; i < cuelist.length; i=i+1) {
      result += convertSrtCue(cuelist[i]);
    }
  }
  return result;
}

function convertSrtCue(caption) {
  // remove all html tags for security reasons
  //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');
  var cue = "";
  var s = caption.split(/\n/);
  while (s.length > 3) {
    for (var i = 3; i < s.length; i++) {
      s[2] += "\n" + s[i]
    }
    s.splice(3, s.length - 3);
  }
  var line = 0;
  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
    cue += s[0].match(/\w+/) + "\n";
    line += 1;
  }
  if (s[line].match(/\d+:\d+:\d+/)) {
    var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
    if (m) {
      cue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
        +m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
      line += 1;
    } else {
      return "";
    }
  } else {
    return "";
  }
  if (s[line]) {
    cue += s[line] + "\n\n";
  }
  return cue;
}