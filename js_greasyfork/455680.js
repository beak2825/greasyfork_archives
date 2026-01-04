// ==UserScript==
// @name         AutoHentaiCosplays
// @namespace    http://tampermonkey.net/https://hentai-cosplays.com/image
// @version      0.1
// @description  Auto Hentai Cosplays
// @author       You
// @match        https://hentai-cosplays.com/image/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentai-cosplays.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.js
// @resource     viewerCSS   https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.css
// @downloadURL https://update.greasyfork.org/scripts/455680/AutoHentaiCosplays.user.js
// @updateURL https://update.greasyfork.org/scripts/455680/AutoHentaiCosplays.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const DEBUG_INFO = true;
  const DEBUG_VERBOSE = true;

  function debug_info(...data) { if (DEBUG_INFO === true) { console.log('[INFO] ', data); } }
  function debug_verbose(...data) { if (DEBUG_VERBOSE === true) { console.log('[VERBOSE]', data); } }
  function sleep(time) { return new Promise((resolve) => window.setTimeout(resolve, time)); }
  function Random(min, max) { return Math.round(Math.random() * (max - min)) + min; }

  GM_addStyle(GM_getResourceText('viewerCSS'));

  const host = window.location.host;
  var img_prefix = document.querySelector("meta[property='og:image']").getAttribute("content");
  img_prefix = img_prefix.slice(0, img_prefix.lastIndexOf('/')+1); // 'https://static11.hentai-cosplays.com/upload/20221009/318/324621/'

  var new_image_viewer = document.createElement('ul');
  new_image_viewer.setAttribute('id', 'imagesViewer'); // 注册新的图片浏览器

  var img_container = document.getElementById('post');
  img_container.appendChild(new_image_viewer);                          // 注入新的图片浏览器到原图片所在的div容器

  // 声明相册实例
  var gallery = new Viewer(new_image_viewer, {
    fullscreen: false,
    interval: 1200,
    loop: false,
    transition: false,
  });

  (function addBtn(text, disable) {
    let btn = document.createElement('input');
    let div = document.createElement('div');

    let btnFarther = document.getElementById("detail_tag");

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

  const page_indicator = document.querySelectorAll('#paginator > span > a');
  const img_story_url = "https://" + host + page_indicator[page_indicator.length-1].getAttribute('href');

  GM_xmlhttpRequest({
    url: img_story_url,
    method: 'GET',
    onload: (xhr) => {
      let data = xhr.response;
      let htmlDoc = new DOMParser().parseFromString(data, 'text/html');
      const imgs_count = htmlDoc.getElementsByTagName("amp-story-page").length;

      for(let i = 1; i <= imgs_count; i++) {
        let img_element = document.createElement('img');
        img_element.setAttribute("src", img_prefix + i + ".jpg")
        img_element.setAttribute("hidden", "hidden");
        new_image_viewer.appendChild(img_element);
      }
      gallery.update();
    }
  });

})();