// ==UserScript==
// @name         Viewer for XiuRen
// @namespace    http://tampermonkey.net/XiuRen
// @version      0.8.5
// @description  try to take over the world!
// @author       You
// @include      *://*.123784.xyz/*
// @include      *://*xiuren*
// @include      *://*xr*
// @include      *://*.*/*XiuRen*
// @icon         https://www.google.com/s2/favicons?domain=xiurenb.net
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.js
// @resource     viewerCSS   https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.css
// @downloadURL https://update.greasyfork.org/scripts/427515/Viewer%20for%20XiuRen.user.js
// @updateURL https://update.greasyfork.org/scripts/427515/Viewer%20for%20XiuRen.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let DEBUG_INFO = false;
  let DEBUG_VERBOSE = false;

  function debug_info(...data) { if (DEBUG_INFO === true) { console.log('[INFO] ', data); } }

  function debug_verbose(...data) { if (DEBUG_VERBOSE === true) { console.log('[VERBOSE]', data); } }

  function sleep(time) { return new Promise((resolve) => window.setTimeout(resolve, time)); }

  function Random(min, max) { return Math.round(Math.random() * (max - min)) + min; }

  GM_addStyle(GM_getResourceText('viewerCSS'));

  var href = window.location.href;
  debug_info('handle: ' + href);

  if (href.indexOf('_') !== -1) {
    return; // 仅处理图集的首页
  }

  function images_paragraph_node(root_document, sub_page = false) {
    let imgs = root_document.getElementsByTagName('img');
    for (let img of imgs) {
      if (img.getAttribute('src').startsWith('/uploadfile/2')) {
        return img.parentNode;
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
    let is_sub_page = i !== 0; // 第0页和第1页的获取逻辑不同
    let text = images_paragraph_node(htmlDoc, is_sub_page).outerHTML;
    debug_verbose(text);
    let template = `<div class='child${i}'>${text}</div>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    let imgs = Array.from(tempNode.firstChild.getElementsByTagName('img'));
    return imgs; // HTMLCollection(3)[img, img, img]
  }

  function page_indicator_node(root_document) {
    return root_document.getElementsByClassName("current")[0].parentNode
  }

  var page_ind = page_indicator_node(document);
  var pages_num = page_ind.innerText.split('\n');
  pages_num = pages_num.slice(1, pages_num.length - 1); // 去头掐尾

  var pages_url = [];
  var pages_map = {};
  pages_url.push(href); // 第 0 页

  function update_img_set(page, img_set) {
    pages_map[page] = img_set;
    debug_verbose(
        `update_img_set: 加载页面 ${page + 1} / ${pages_url.length}, 共计 ${
            img_set.length
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

  for (let i = 0; i < pages_num.length; i++) {
    let page = parseInt(pages_num[i]);
    if (page) {
      if (page - 1 === 0) continue;
      pages_url.push(
          href.slice(0, href.lastIndexOf('.')) + `_${page - 1}.html`,
      );
    }
  }

  (function addBtn(text, disable) {
    let btn = document.createElement('input');
    let div = document.createElement('div');

    let btnFarther = document.getElementsByClassName('item_info')[0];

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

  for (let i = 0; i < pages_url.length; i++) {
    let durl = pages_url[i];
    debug_info('采集图片自', durl);

    GM_xmlhttpRequest({
      url: durl,
      method: 'GET',
      onload: (xhr) => {
        let data = xhr.response;
        // debug_info(data);
        let htmlDoc = new DOMParser().parseFromString(data, 'text/html');
        update_img_set(i, getPageImages(i, htmlDoc));
      },
    });
  }
})();
