// ==UserScript==
// @name         LOL S10 二路流合成
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  企鹅直播77777二路流
// @author       DKing
// @match        https://egame.qq.com/77777
// @match        https://egame.qq.com/367958257*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412066/LOL%20S10%20%E4%BA%8C%E8%B7%AF%E6%B5%81%E5%90%88%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/412066/LOL%20S10%20%E4%BA%8C%E8%B7%AF%E6%B5%81%E5%90%88%E6%88%90.meta.js
// ==/UserScript==



function set_second_frame() {
    if (window.location.pathname == "/367958257") {
        // mute
        let vol = document.getElementsByClassName("vcp-volume-icon")[0];
        if (!vol.parentElement.classList.contains("vcp-volume-muted"))
            vol.click();
        // disable danmuku
        let danmuku = document.getElementsByClassName("vcp-extended-barrage")[0];
        if (!danmuku.parentElement.classList.contains("hide"))
            danmuku.click();
        // clean junk elems
        let second_frame_all = document.getElementById('__nuxt');
        var second_video = document.getElementsByClassName('ui-video live-player')[0];
        second_frame_all.innerHTML = '';
        second_frame_all.appendChild(second_video);
    }
}

function load_second_frame() {
    if (window.location.pathname == "/77777") {
        let second_frame = `
<div id="second_frame" style="position: absolute; z-index: 999;">
<div id="second_frameheader" style="cursor: move; opacity: 0.0; margin-bottom: -50px">-<br>-</div>
<iframe src="/367958257" width="800" height="600" style="resize: both; overflow: auto;">
</iframe>
</div>
`;
        let title = document.getElementsByClassName("live-mod-anchor normal-anchor-info live-anchor-normal")[0];
        title.innerHTML= second_frame + title.innerHTML;

        dragElement(document.getElementById("second_frame"));
    }

    setTimeout(set_second_frame, 1000);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
setTimeout(load_second_frame, 1000);