// ==UserScript==
// @name         Hotgirlchina
// @namespace    http://tampermonkey.net/hotgirlchina.com
// @version      0.1
// @description  Hotgirlchina-tampermonkey
// @author       You
// @match        https://hotgirlchina.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotgirlchina.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.js
// @resource     viewerCSS   https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.css
// @downloadURL https://update.greasyfork.org/scripts/454986/Hotgirlchina.user.js
// @updateURL https://update.greasyfork.org/scripts/454986/Hotgirlchina.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('Hello');

  GM_addStyle(GM_getResourceText('viewerCSS'));
  const host = window.location.host; // hotgirlchina.com
  const href = window.location.href; // https://hotgirlchina.com/{ALBUM_NAME}/

  const old_image_container = document.querySelector('.entry-inner'); // the last one is <nav>
  // old_image_container.removeChild(old_image_container.querySelector('nav')); // 删除底部导航栏

  const img_sample = old_image_container.children[0].cloneNode(true);

  let img_src = img_sample.firstChild.src;
  img_src = img_src.slice(0, img_src.lastIndexOf('?'));

  const title = document.querySelector('.post-title');
  const photoCount = title.textContent.match(/((\d+) photos)/)[2] - 0;

  const new_image_viewer = document.createElement('ul');
  new_image_viewer.setAttribute('id', 'imagesViewer'); // 注册新的图片浏览器

  function MakeImg(index) {
    function PrefixInteger(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    }

    let newImg = img_sample.cloneNode(true);
    newImg.firstChild.setAttribute('src',
        img_src.replace(/-(\d\d\d)\./, '-' + PrefixInteger(index, 3) + '.'));
    return newImg;
  }

  old_image_container.innerHTML = '';

  for (let i = 1; i <= photoCount; i++) {
    old_image_container.appendChild(MakeImg(i));
  }

  // 声明相册实例
  const gallery = new Viewer(old_image_container, {
    fullscreen: false,
    interval: 1200,
    loop: false,
    transition: false,
  });

  (function addBtn(text, disable) {
    let btn = document.createElement('input');
    let div = document.createElement('div');

    let btnFarther = document.querySelector('.category');

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