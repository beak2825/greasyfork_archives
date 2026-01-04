// ==UserScript==
// @name        Hide low viewcount vids
// @description Hides low view count recommended videos on YouTube
// @match       https://www.youtube.com/*
// @version     1.1.4
// @author      Laku
// @namespace   https://greasyfork.org/users/1387751
// @downloadURL https://update.greasyfork.org/scripts/514532/Hide%20low%20viewcount%20vids.user.js
// @updateURL https://update.greasyfork.org/scripts/514532/Hide%20low%20viewcount%20vids.meta.js
// ==/UserScript==

const threshold = 100;

function hide(v) {
  const e = v.querySelector('span.inline-metadata-item.style-scope.ytd-video-meta-block');
  if(!e) return;
  const cap = /(?:No|(\d+\.?\d{0,2})([KMB])?) views?/.exec(e.textContent);
  if(!cap) return;
  const count = parseFloat(cap[1]??0) * (({K:1e3,M:1e6,B:1e9})[cap[2]]??1);
  if(count < threshold) {
    v.style.display = "none";
    //console.log(count);
  }
}

function hide_endscreen(v) {
  const e = v.querySelector(".ytp-videowall-still-info-author");
  const split = e.textContent.split("•");
  if(split.length < 2) return;
  const cap = /(?:No|(\d+\.?\d{0,2})([KMB])?) views?/.exec(split[1].trim());
  const count = parseFloat(cap[1]??0) * (({K:1e3,M:1e6,B:1e9})[cap[2]]??1);
  if(count < threshold) {
    v.style.display = "none";
    //console.log(count);
  }
}

function hide_vids() {
  if(window.location.pathname.includes("watch")) document.querySelectorAll("#secondary > ytd-compact-video-renderer").forEach((v) => hide(v));
  if(window.location.pathname == "/") document.querySelectorAll("#contents > ytd-rich-item-renderer").forEach((v) => hide(v));
}

let old_path = window.location.pathname;
function check(changes, observer) {
  changes.forEach((c)=>{
    const path = window.location.pathname;
    if(path != old_path) {
      //console.log("path changed");
      old_path = path;
      setTimeout(hide_vids, 1000);
    }
    const id = c.target.id;
    if(path == "/" && id == "contents") {
      c.addedNodes.forEach((v) => hide(v));
    } else if(path.includes("watch") && (id == "items" || id == "contents")) {
      c.addedNodes.forEach((v) => {if(v.nodeName == "YTD-COMPACT-VIDEO-RENDERER") hide(v);});
    } else if(path.includes("watch") && c.target.className == "ytp-endscreen-content") {
      c.addedNodes.forEach((v) => {hide_endscreen(v);});
    }
  });
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

window.addEventListener("yt-page-data-updated", () => {
  // I can't figure out a good way to detect when YT has loaded new recommended vids on page transition, observer doesnt pick up the changes for whatever reason
  setTimeout(hide_vids, 1000);
});
