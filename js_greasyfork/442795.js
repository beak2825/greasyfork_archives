// ==UserScript==
// @name         新片场视频解析
// @namespace    https://jyonn.space
// @version      1
// @description  Stops most anti debugging implementations by JavaScript obfuscaters
// @author       Jyonn
// @include      https://*.xinpianchang.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/442795/%E6%96%B0%E7%89%87%E5%9C%BA%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/442795/%E6%96%B0%E7%89%87%E5%9C%BA%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

function stringToHtml(s) {
    let tmp = document.createElement('div');
    tmp.innerHTML = s;
    return tmp.firstElementChild;
}

(function() {
  let nav = document.getElementsByClassName('fs_16 fw_300 nav-list clearfix v-center')[0];
  nav.appendChild(stringToHtml('<li class="nav-item" id="analyse-VoC"><a>解析</a></li>'));
  let voc = document.getElementById('analyse-VoC');
  voc.addEventListener('click', () => {
      let video = document.getElementsByTagName('video')[0];
      window.open(video.src)
  });
})();