// ==UserScript==
// @name         HentaiCosplays
// @namespace    http://tampermonkey.net/https://hentai-cosplays.com/search/
// @version      0.1
// @description  Viewer for HentaiCosplays
// @author       You
// @match        https://hentai-cosplays.com/search/*
// @match        https://hentai-cosplays.com/ranking/*
// @match        https://hentai-cosplays.com/recently/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentai-cosplays.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.js
// @resource     viewerCSS   https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.css
// @downloadURL https://update.greasyfork.org/scripts/453462/HentaiCosplays.user.js
// @updateURL https://update.greasyfork.org/scripts/453462/HentaiCosplays.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const DEBUG_INFO = false;
  const DEBUG_VERBOSE = false;

  function debug_info(...data) { if (DEBUG_INFO === true) { console.log('[INFO] ', data); } }
  function debug_verbose(...data) { if (DEBUG_VERBOSE === true) { console.log('[VERBOSE]', data); } }

  GM_addStyle(GM_getResourceText('viewerCSS'));
  const host = window.location.host;
  const old_image_container = document.querySelector('#center');
  const new_image_viewer = document.createElement('ul');
  new_image_viewer.setAttribute('id', 'imagesViewer'); // 注册新的图片浏览器

  // 声明相册实例
  const gallery = new Viewer(new_image_viewer, {
    fullscreen: false,
    interval: 1200,
    loop: false,
    transition: false,
  });

  old_image_container.appendChild(new_image_viewer); // 注入图片浏览器
  const image_list = document.getElementById('image-list').getElementsByTagName('a')

  var last_clicked_img = '';

  for(let i = 0; i < image_list.length; i+=2) {
    image_list[i].onclick = function() {
      let img_href = this.getAttribute('href');
      debug_info('click ' + img_href);
      if(last_clicked_img !== img_href) { // 不刷新 imagesViewer 的 ul
        new_image_viewer.innerHTML = '';
        gallery.update();
        last_clicked_img = img_href;

        const img_story_url = 'https://' + host + img_href.replace('/image/', '/story/');
        debug_info('fetch ' + img_story_url);

        GM_xmlhttpRequest({
          url: img_story_url,
          method: 'GET',
          onload: (xhr) => {
            let data = xhr.response;
            let htmlDoc = new DOMParser().parseFromString(data, 'text/html');
            const img_count = htmlDoc.getElementsByTagName("amp-story-page").length;

            var img_prefix = htmlDoc.querySelector("meta[property='og:image']").getAttribute("content");
            img_prefix = img_prefix.slice(0, img_prefix.lastIndexOf('/')+1);

            for(let i = 1; i <= img_count; i++) {
              let img_element = document.createElement('img');
              img_element.setAttribute("src", img_prefix + i + ".jpg")
              img_element.setAttribute("hidden", "hidden");
              new_image_viewer.appendChild(img_element);
            }
            gallery.update();
          }
        });
      }

      gallery.show();
      return false;
    }
  }

})();