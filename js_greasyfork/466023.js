// ==UserScript==
// @name         Viewer for Mrcong
// @namespace    http://tampermonkey.net/mrcong.com
// @version      0.1
// @description  Viewer for Mrcong!!!!
// @author       You
// @match        https://mrcong.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mrcong.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.3/viewer.min.js
// @resource     viewerCSS   https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.3/viewer.min.css
// @downloadURL https://update.greasyfork.org/scripts/466023/Viewer%20for%20Mrcong.user.js
// @updateURL https://update.greasyfork.org/scripts/466023/Viewer%20for%20Mrcong.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Debug Switches
  let DEBUG_INFO = false;

  const href = window.location.href;
  debug_info('handle: ' + href);

  function debug_info(...data) {
    if (DEBUG_INFO === true) {
      console.log('[INFO] ', data);
    }
  }

  GM_addStyle(GM_getResourceText('viewerCSS'));

  const title = document.querySelector("head > title").textContent;
  let image_count = parseInt(title.match(/(\d+) photos/)[1]);
  debug_info("image_count = ", image_count);

  const first_image_element = document.querySelector("#fukie2 > p > img:nth-child(1)");
  const first_image_url = first_image_element.getAttribute('src');

  var new_image_viewer = document.createElement('ul');
  new_image_viewer.setAttribute('id', 'imagesViewer'); // 注册新的图片浏览器

  var img_container = document.querySelector('#fukie2 > p');
  img_container.innerHTML = '';
  img_container.appendChild(new_image_viewer); // 注入新的图片浏览器到原图片所在的div容器

  var gallery = new Viewer(new_image_viewer, {
    fullscreen: false,
    interval: 1200,
    loop: false,
    transition: false,
  });

  for (let i = 1; i <= image_count; i++) {
    let url = first_image_url;
    let image_url = url.replace(/-(\d\d\d)\./, "-" + i.toString().padStart(3, '0') + ".");
    debug_info(image_url);
    let image_node = document.createElement('li');
    image_node.innerHTML = `<img decoding="async" class="aligncenter" src="${image_url}">`;
    new_image_viewer.appendChild(image_node);
  }
  gallery.update();

  (function addBtn(text, disable) {
    let btn = document.createElement('input');
    let div = document.createElement('div');

    let btnFarther = document.getElementsByClassName("post-meta")[0];

    div.appendChild(btn);
    btnFarther.appendChild(div);

    div.style.textAlign = 'center';

    btn.disabled = disable;
    btn.type = 'submit';
    btn.value = text;
    btn.style.textAlign = 'center';
    btn.style.verticalAlign = 'middle';
    btn.style.color = '#666666';
    btn.style.background = '#fff';
    btn.style.width = '10rem';
    btn.style.height = '2rem';
    btn.style.background =
        '-webkit-gradient(linear,left top, right top,from(#02fdfe),to(#d3fb42))';
    btn.style.border = '1px';
    btn.style.borderRadius = '3rem';

    btn.onclick = function() {
      gallery.show();
    };
  })('Play by Viewer', false);

})();