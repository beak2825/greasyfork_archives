// ==UserScript==
// @name         Viewer for everia
// @namespace    http://tampermonkey.net/everia
// @version      0.1
// @description  ...Viewer for everia...
// @author       You
// @match        *://everia.club/*
// @icon         https://www.google.com/s2/favicons?domain=everia.club
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.js
// @resource     viewerCSS   https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.0/viewer.min.css
// @downloadURL https://update.greasyfork.org/scripts/475746/Viewer%20for%20everia.user.js
// @updateURL https://update.greasyfork.org/scripts/475746/Viewer%20for%20everia.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(GM_getResourceText('viewerCSS'));

  var new_image_viewer_ul = document.createElement('ul');         // 注册新的图片浏览器
  new_image_viewer_ul.setAttribute('id', 'imagesViewer');

  var img_container = document.getElementsByClassName('entry-content')[0]; // 原网页图片所在的div容器
  document.getElementById('main').appendChild(new_image_viewer_ul)
  let img_url_template = document.querySelector("meta[property='og:image']").getAttribute("content");
  img_url_template = img_url_template.slice(0, img_url_template.lastIndexOf('_'))

  let imgs = img_container.getElementsByTagName('img')
  for(let i = 0 ; i <= imgs.length; i += 1) {
    let img_element = document.createElement('img');
    img_element.setAttribute("src", img_url_template + "_" + i + ".jpg")
    img_element.setAttribute("hidden", "hidden");
    new_image_viewer_ul.appendChild(img_element)
  }

  // console.log(imgs)

  var gallery = new Viewer(new_image_viewer_ul, {
    fullscreen: false,
    interval: 1200,
    loop: false,
    transition: false,
  });

  (function addBtn(text, disable) {
    let btn = document.createElement('input');
    let div = document.createElement('div');

    let btnFarther = document.getElementById('site-logo');

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
  })('Play', false);

})();
