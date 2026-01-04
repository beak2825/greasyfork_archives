// ==UserScript==
// @name         AGREE 论坛替换 flash 验证码
// @namespace    Aloxaf
// @version      0.1.0
// @description  替换掉 AGREE 论坛上的旧 flash 验证码模块
// @author       Aloxaf
// @match        http://www.galgamezs.com/bbs/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420053/AGREE%20%E8%AE%BA%E5%9D%9B%E6%9B%BF%E6%8D%A2%20flash%20%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/420053/AGREE%20%E8%AE%BA%E5%9D%9B%E6%9B%BF%E6%8D%A2%20flash%20%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

// jshint esversion: 6

function load_captcha() {
  let flash = document.querySelector('embed');
  let img = document.querySelector('#captcha');
  if (img === null) {
    let parent = document.querySelector('#seccodeswf_3');
    img = document.createElement('img');
    img.id = 'captcha';
    flash.style = 'display: none';
    parent.insertBefore(img, flash);
  }

  let update = flash.attributes.flashvars.textContent.match(/\d+$/)[0];

  fetch(`http://www.galgamezs.com/bbs/seccode.php?update=${update}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'fromFlash=1',
    credentials: 'same-origin',
  }).then(res => {
    return res.blob();
  }).then(b => {
    let img = document.querySelector('#captcha');
    img.src = window.URL.createObjectURL(b);
  });
}

unsafeWindow.opensecwin3_bak = unsafeWindow.opensecwin3;
unsafeWindow.opensecwin3 = (id, type) => {
  unsafeWindow.opensecwin3_bak(id, type);
  let flash_loaded = setInterval(() => {
    if (document.querySelector('embed') !== null) {
      load_captcha();
      clearInterval(flash_loaded);
    }
  }, 50);
}
