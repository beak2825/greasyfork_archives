// ==UserScript==
// @name         RTVE.es Download video and subtitles
// @description  Shows a download link to download mp4 and vtt files
// @namespace    cuzi
// @version      2
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @grant        unsafeWindow
// @include      http://www.rtve.es/*
// @include      https://www.rtve.es/*
// @downloadURL https://update.greasyfork.org/scripts/373824/RTVEes%20Download%20video%20and%20subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/373824/RTVEes%20Download%20video%20and%20subtitles.meta.js
// ==/UserScript==

main();

// ####### Util: #######

function unicodeFlag(xx) {
  const offset = function charoff(c) {
    return String.fromCodePoint(0x1F1E6 - 65 + c.toUpperCase().charCodeAt(0));
  };
  return offset(xx[0]) + offset(xx[1]);
}

function httpGet(url, cb) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function onreadystatechange() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      cb(xmlHttp.responseText);
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
  return xmlHttp;
}


// ####### Func: #######

function getVideoSrc(ev) { 
  if(!document.querySelector("video")) {
    ev.preventDefault();
    alert("Video tag <video> not found!\n\nPlease start the video and select the quality that you want to download. Then click here again.");
    return false;
  }

  const player = unsafeWindow.videojs(document.querySelector("video").id);
  let url = player.currentSource().src; // "https://rtve-hlsvod.secure.footprint.net/resources/XY_ABCD/mp4/1/2/3456789123456.mp4/playlist.m3u8"
  let parts = url.split("/");
  parts.pop();
  url = parts.join("/");

  this.href = url;
  this.innerHTML = url;
  this.target = "_blank";
  return true;
}

function getSubtitles(rootEl) {
  const mediaBox = document.querySelector(".mediaBox.videoBox[data-config]");
  const config = JSON.parse(mediaBox.dataset.config);
  const subtitleRefUrl = document.location.origin + config.mediaConfig.subtitleRefUrl;

  httpGet(subtitleRefUrl, function onLoadSubtitle(text) {
    const data = JSON.parse(text);

    if(!data.page.items || !data.page.items.length) {
      return; 
    }
    
    rootEl.style.opacity = 1.0;

    const p = document.createElement("p");
    p.setAttribute("style", "margin:5px 0px;");
    rootEl.append(p);
    p.appendChild(document.createTextNode("Subtitulos:"));
    const ul = document.createElement("ul");
    p.appendChild(ul);
    for(const item of data.page.items) {
      const li = document.createElement("li");
      ul.appendChild(li); 
      li.appendChild(document.createTextNode(unicodeFlag(item.lang)));
      const a = document.createElement("a");
      a.target = "_black";
      a.href = item.src;
      a.style = "color:#f7780a";
      a.appendChild(document.createTextNode(item.src));
      li.appendChild(a);

    }

  });
}

function hideMe() { 
  this.parentNode.parentNode.removeChild(this.parentNode); 
}

function waitForVideoTag() {
  const div = document.getElementById("userscript_rtve_cuzi_ui");
  
  if(div && div.dataset.url != document.location.href) {
    showUI();
    return;
  }
  
  if(!document.querySelector("video")) {
    div.style.opacity = 0.3;
    return; 
  }
  div.style.opacity = 1.0;
}

function showUI() {
  if(!document.querySelector(".mediaBox.videoBox")) {
    return; 
  }
  
  const oldui = document.getElementById("userscript_rtve_cuzi_ui");
  if(oldui) {
    oldui.parentNode.removeChild(oldui);
  }
  
  
  const div = document.createElement("div");
  div.dataset.url = document.location.href;
  div.setAttribute("id", "userscript_rtve_cuzi_ui");
  div.setAttribute("style", "position:fixed; top:100px; left:10px; background:rgb(250,230,230); color:black; border:2px solid black; font-size:12px; padding:10px; border-radius:5px; z-index:9999; opacity:0.3;");
  document.body.appendChild(div);

  const close = document.createElement("div");
  close.setAttribute("style", "position:absolute; top:3px; right:3px; color:red; border:2px solid red; font-size:12px; padding:2px; border-radius:5px; cursor:pointer;");
  close.setAttribute("title", "Hide");
  close.addEventListener("click", hideMe);
  close.appendChild(document.createTextNode("X"));
  div.appendChild(close);


  const p = document.createElement("p");
  p.setAttribute("style", "margin:5px 0px;");
  div.append(p);
  
  p.appendChild(document.createTextNode("Video:"));
  p.appendChild(document.createElement("br"));
  
  const aGetSrc = document.createElement("a");
  p.appendChild(aGetSrc);
  aGetSrc.appendChild(document.createTextNode("Download"));
  aGetSrc.href = "#";
  aGetSrc.style = "color:#f7780a";
  aGetSrc.addEventListener("click", getVideoSrc);

  getSubtitles(div);
}


// ####### Main: #######

function main() {
  showUI();
  window.setInterval(function interval() { waitForVideoTag(); }, 2000);
}