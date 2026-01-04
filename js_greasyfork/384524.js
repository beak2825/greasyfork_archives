// ==UserScript==
// @name         PlayPauseOnScreen-UNEXT
// @description  Enable you to play or pause a movie with a click on the screen at U-NEXT
// @version      2020.6.28
// @namespace    https://github.com/toten-s
// @match        https://video.unext.jp/*
// @downloadURL https://update.greasyfork.org/scripts/384524/PlayPauseOnScreen-UNEXT.user.js
// @updateURL https://update.greasyfork.org/scripts/384524/PlayPauseOnScreen-UNEXT.meta.js
// ==/UserScript==

function addGlobalStyle(css){
  var head, style;
  head = document.getElementsByTagName("head")[0];
  if (!head) { return }
  style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  head.appendChild(style);
}

addGlobalStyle(`
  #ctl{
    position: absolute;
    margin: auto;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 80vh;
    width: 100vw;
  }
  .hideCursor{
    cursor: none !important;
  }
`);

function video_ctl(v){
  if(v.paused){
    v.play();
  }else{
    v.pause();
  }
}

var video_tag;
function mask_div(){
  video_tag = document.getElementsByTagName("video")[0];
  if(document.getElementById("ctl") == undefined){
    var div = document.createElement("div");
    div.id = "ctl";
    div.addEventListener("click", function(){video_ctl(video_tag)}, false);
    //div.addEventListener("dblclick", function(){video_tag.requestFullscreen()}, false);
    //ƒJ[ƒ\ƒ‹Á‚µ
    var timer;
    div.addEventListener("mousemove", function(){
      div.className = "";
      clearTimeout(timer);
      timer = setTimeout(function() {
        div.className = "hideCursor";
      }, 1000);
    });
    //
    var layered = document.getElementsByTagName("div")[2];
    layered.appendChild(div);
  }
  console.log("PPOS: loaded");
}

console.log("PPOS: activated");
var target = document.getElementById("app");
var observer = new MutationObserver(function(mutations){
    if(mutations[0].target.nodeName == "VIDEO"){mask_div();};
});
var options = {
  attributes: true,
  attributeFilter: ["src"],
  subtree: true
};
observer.observe(target, options);