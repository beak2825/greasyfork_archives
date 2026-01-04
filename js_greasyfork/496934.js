// ==UserScript==
// @name         Viewer for xchina
// @namespace    http://tampermonkey.net/xchina
// @version      0.0.2
// @description  Viewer for xchina ...
// @author       You
// @match        https://xchina.co/photo/id-*
// @icon         https://www.google.com/s2/favicons?domain=xchina.co
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.js
// @resource     viewerCSS   https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.css
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/496934/Viewer%20for%20xchina.user.js
// @updateURL https://update.greasyfork.org/scripts/496934/Viewer%20for%20xchina.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let DEBUG_INFO = false;
  let DEBUG_VERBOSE = false;

  function debug_info(...data) { if (DEBUG_INFO === true) { console.log('[INFO] ', data); } }

  function debug_verbose(...data) { if (DEBUG_VERBOSE === true) { console.log('[VERBOSE]', data); } }

  function sleep(time) { return new Promise((resolve) => window.setTimeout(resolve, time)); }

  function Random(min, max) { return Math.round(Math.random() * (max - min)) + min; }

  GM_addStyle(GM_getResourceText('viewerCSS'));

  // https://xchina.co/photo/id-XXXXXXXXX/1.html
  var href = window.location.href;
  debug_info('handle href: ' + href);

  // HD img url: https://img.xchina.biz/photos2/XXXXXXXXX/0001.jpg
  // thumbnail img url: https://img.xchina.biz/photos2/XXXXXXXXX/0001_600x0.webp
  function thumbnail_img_url_to_hd_img_url(thumbnail_img_url) {
    let last_mark_pos = thumbnail_img_url.lastIndexOf('_');
    let hd_img_file_ext = ".jpg"
    return thumbnail_img_url.slice(0, last_mark_pos) + hd_img_file_ext
  }

  function images_paragraph_node(root_document) {
    let imgs = root_document.getElementsByTagName('img');
    for (let img of imgs) {
      if (img.getAttribute('class') != null && img.getAttribute('class').startsWith('cr_only')) {
        return img.parentNode.parentNode.parentNode;
      }
    }
  }

  var new_image_viewer_ul = document.createElement('ul');         // 注册新的图片浏览器
  var img_container = images_paragraph_node(document).parentNode; // 原网页图片所在的div容器

  new_image_viewer_ul.setAttribute('id', 'imagesViewer');
  img_container.appendChild(new_image_viewer_ul);                 // 注入新的图片浏览器到原图片所在的div容器

  var gallery = new Viewer(new_image_viewer_ul, {
    fullscreen: false,
    interval: 1200,
    loop: false,
    transition: false,
  });

  // 删除原来的图片段落
  images_paragraph_node(document).remove();

  // @description 从网页源码中获取图片分组
  // @return 每页的图片数组
  function getPageImages(i, htmlDoc) {
    let text = images_paragraph_node(htmlDoc).outerHTML;
    // debug_verbose(text);
    let template = `<div class='child${i}'>${text}</div>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    let imgs = Array.from(tempNode.firstChild.getElementsByTagName('img'))
      .filter((img) => { return img.getAttribute('class') != null && img.getAttribute('class').startsWith('cr_only') })
      .map((img) => { img.setAttribute('src', thumbnail_img_url_to_hd_img_url(img.getAttribute('src'))); return img; });

    return imgs; // HTMLCollection(3)[img, img, img]
  }

  // index from 0
  var arr = document.getElementsByClassName("prev")[0].parentNode.children;
  var pages_num = Number(arr[arr.length - 2].text);

  var pages_url = [];
  for (let i = 1; i <= pages_num; i++) {
    pages_url.push(href.slice(0, href.lastIndexOf('.')) + '/' + i + '.html');
  }

  var pages_map = {};

  function update_img_set(page, img_set) {
    pages_map[page] = img_set;
    debug_verbose(
      `update_img_set: 加载页面 ${page + 1} / ${pages_url.length}, 共计 ${img_set.length
      } 张图片`,
    );
    if (Object.keys(pages_map).length === pages_url.length) {
      debug_info('所有页面的信息已经加载到 pages_map 中');

      let img_cnt = 0;
      for (let i = 0; i < pages_url.length; i++) {
        img_set = pages_map['' + i];
        let img_cnt_this_page = 0;
        // console.log(img_set)
        for (let j = 0; j < img_set.length; j++) {
          let img = img_set[j];
          img.setAttribute('style', 'max-height: 1080px');
          img_cnt += 1;
          img_cnt_this_page += 1;
          new_image_viewer_ul.appendChild(img);
        }
        debug_info(i, '页', img_cnt_this_page, '张');
      }
      debug_info('共计', img_cnt, '张');
    }
    gallery.update();
  }

  (function addBtn(text, disable) {
    let btn = document.createElement('input');
    let div = document.createElement('div');

    let btnFarther = document.getElementsByClassName('tab-content')[0];

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

    btn.onclick = function () {
      gallery.show();
    };
  })('Play by Viewer', false);

  let reset_url_map = {};
  for (let i = 0; i < pages_url.length; i++) {

    let durl = pages_url[i];
    debug_info('采集图片自', durl);

    GM_xmlhttpRequest({
      url: durl,
      method: 'GET',
      onload: (xhr) => {
        let data = xhr.response;

        let htmlDoc = new DOMParser().parseFromString(data, 'text/html');

        let imgs = htmlDoc.getElementsByTagName('img');
        let flag = false;
        for (let img of imgs) {
          if (img.getAttribute('class') != null && img.getAttribute('class').startsWith('cr_only')) {
            flag = true;
          }
        }
        if (flag)
          update_img_set(i, getPageImages(i, htmlDoc));
        else {
          reset_url_map[i] = durl;
        }
      },
    });
  }

  function mysleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function do_requests(reset_url) {
    debug_info('未完成', Object.keys(reset_url).length);
    mysleep(5000).then(() => {
      for (let key in reset_url) {
        let durl = reset_url[key];
        // console.log('采集图片自', durl);
        GM_xmlhttpRequest({
          url: durl,
          method: 'GET',
          onload: (xhr) => {
            let data = xhr.response;
            let htmlDoc = new DOMParser().parseFromString(data, 'text/html');
            let imgs = htmlDoc.getElementsByTagName('img');
            for (let img of imgs) {
              if (img.getAttribute('class') != null && img.getAttribute('class').startsWith('cr_only')) {
                update_img_set(key, getPageImages(key, htmlDoc));
                delete reset_url[key]
              }
            }

          },
        });
      }
      if (Object.keys(reset_url).length != 0) {
        do_requests(reset_url)
      }
    });
  }
  do_requests(reset_url_map);

})();