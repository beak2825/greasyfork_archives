// ==UserScript==
// @name        Youtube Anti-Spoiler Thumbnails
// @name:de     Youtube Anti-Spoiler Thumbnails
// @namespace   greasyfork.czxzyyyk.de
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1.1
// @author      greasyfork@czxzyyyk.de
// @description replace thumbnails of channels that contain spoilers
// @description:de Script ersetzt thumbnails von Sportschau, Sportstudio und DAZN durch neutrale thumbnails.
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/498508/Youtube%20Anti-Spoiler%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/498508/Youtube%20Anti-Spoiler%20Thumbnails.meta.js
// ==/UserScript==

// thumbnails to use for various channels
var conf = {
  "DAZNUEFAChampionsLeague":"https://yt3.googleusercontent.com/9Z_aWEioElsfPKr_6p3wohWCqCAeJHoCMbXODj4Pi0A74oxJ6K3dCpAJbEX-QHzLWioZh5D_Dg=s176-c-k-c0x00ffffff-no-rj",
  "DAZN UEFA Champions League":"https://yt3.googleusercontent.com/9Z_aWEioElsfPKr_6p3wohWCqCAeJHoCMbXODj4Pi0A74oxJ6K3dCpAJbEX-QHzLWioZh5D_Dg=s176-c-k-c0x00ffffff-no-rj",
  "sportstudio":"https://yt3.googleusercontent.com/qcnzbMsW5sETLq3-b2vrfW8yPKV6fzW_wL1Pr7-Q03BUzsTNdVuc3OMxOHaEsEviuNno-Nzc=s176-c-k-c0x00ffffff-no-rj",
  "sportschau":"https://yt3.googleusercontent.com/p6EuIXblQzb7f4m_GDhBdn8ronxGOaLlVgvBFOBbh03Q5oPmx3akq4uRUbbHBZ53x-jKMpZ27yQ=s176-c-k-c0x00ffffff-no-rj"
}


function loop(argument) {
	//console.log("loop");

  for(let renderer of document.querySelectorAll("ytd-video-renderer:not(.ficken), .ytd-grid-renderer:not(.ficken), ytd-item-section-renderer:not(.ficken), .ytd-rich-item-renderer:not(.ficken), ytd-grid-video-renderer:not(.ficken), ytd-compact-video-renderer:not(.ficken), ytd-rich-item-renderer:not(.ficken)")) {
    //console.log("loop1");

    let channel = renderer.querySelector(".ytd-channel-name");
    if(!channel)
      continue;

    for(name in conf){
      if (channel.textContent.toLowerCase().includes(name.toLowerCase()) || document.location.href.toLowerCase().includes(name.toLowerCase())) {
        let url = conf[name];
        //console.log("loop add stuff", name);

        renderer.classList.add("ficken");

        let mouseover_overlay = renderer.querySelector("#mouseover-overlay");
        if (mouseover_overlay) mouseover_overlay.style.display = "none";

        let overlay = document.querySelector(".ytp-cued-thumbnail-overlay-image");
        if (overlay) overlay.style.display = "none";

        let img = renderer.querySelector(".ytd-thumbnail img");
        let thumb = renderer.querySelector(".ytd-thumbnail");
        let a = thumb?.closest("a");

        console.log("img", img);
        console.log("thumb", thumb);
        console.log("a", a);

        if (img && a) {
            img.style.opacity = "0";
            a.style.backgroundImage = "url('"+url+"')";
            a.style.backgroundSize = "cover";
            a.style.backgroundPosition = "center";
        }
      }
    }
  }

  loop:
  for(let renderer of document.querySelectorAll(".ficken")) {
    //console.log("loop2");
    let channel = renderer.querySelector(".ytd-channel-name");
    if(!channel)
         continue;

    for(name in conf){
      if (channel.textContent.toLowerCase().includes(name.toLowerCase()) || document.location.href.toLowerCase().includes(name.toLowerCase())) {
        continue loop;
      }
    }
    //console.log("loop remove stuff", channel)

    renderer.classList.remove("ficken");
    renderer.querySelector("#mouseover-overlay").style.display = "";

    let img = renderer.querySelector(".ytd-thumbnail img");
    let thumb = renderer.querySelector(".ytd-thumbnail");
    let a = thumb?.closest("a");

    console.log("img", img);
    console.log("thumb", thumb);
    console.log("a", a);

    if (img && a) {
      img.style.opacity = "";
      a.style.backgroundImage = "";
      a.style.backgroundSize = "";
      a.style.backgroundPosition = "";
    }
  }
}

var i = setInterval(loop, 500)

document.addEventListener("mouseenter", function enter(e) {
  if (e.target.closest(".ficken")) {
    document.querySelector("#video-preview").style.display = "none";
    //console.log("enter", document.querySelector("#video-preview"))
    e.stopPropagation();
  }
}, true);

document.addEventListener("mouseleave", function leave(e) {
  if (e.target.closest(".ficken")) {
    document.querySelector("#video-preview").style.display = "";
    //console.log("leave", document.querySelector("#video-preview"))
    e.stopPropagation();
  }
}, true);



