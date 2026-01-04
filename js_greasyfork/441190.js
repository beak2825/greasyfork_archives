// ==UserScript==
// @name         hipda-img-paster
// @namespace    https://github.com/maltoze/tampermonkey-scripts
// @version      0.1.4
// @description  支持在发帖/回帖(高级模式)时直接粘贴图片
// @author       maltoze
// @match        https://www.hi-pda.com/forum/post.php?*
// @match        https://www.4d4y.com/forum/post.php?*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441190/hipda-img-paster.user.js
// @updateURL https://update.greasyfork.org/scripts/441190/hipda-img-paster.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BASE_URL = 'https://www.4d4y.com/forum/';
  const IMG_UPLOAD_URL = `${BASE_URL}misc.php?action=swfupload&operation=upload&simple=1&type=image`;
  const COMMON_OPTIONS = { credentials: 'same-origin' };
  const TIMEOUT = 30000;

  // chrome/edge
  const iframeEl = document.getElementById('e_iframe');
  // firefox
  const textAreaEl = document.getElementById('e_textarea');

  function imgListAjaxUrlGenenter(postTime) {
    return `${BASE_URL}ajax.php?action=imagelist&pid=NaN&posttime=${postTime.toFixed()}`;
  }

  function uploadImg(imgFile) {
    const userSpaceEl = document.querySelector('#umenu > cite > a');
    if (!userSpaceEl) return;

    const uidMatch = userSpaceEl.href.match(/uid=(\d+)/);
    if (!uidMatch) return;

    const hashInputEl = document.querySelector('input[name=hash]');
    if (!hashInputEl) return;

    const formData = new FormData();
    formData.append('uid', uidMatch[1]);
    formData.append('hash', hashInputEl.value);
    formData.append('Filedata', imgFile, 'image.png');

    return fetch(IMG_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      ...COMMON_OPTIONS,
    });
  }

  function insertNode(node) {
    const sel = (iframeEl?.contentWindow || window).getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.insertNode(node);
      range.collapse();
    }
  }

  async function handleOnPaste(event) {
    const clipboardItems = event.clipboardData.items;
    const items = [].slice.call(clipboardItems).filter(function (item) {
      // Filter the image items only
      return item.type.indexOf('image') !== -1;
    });
    if (items.length === 0) {
      return;
    }
    event.preventDefault();

    const tmpEl = document.createElement('span');
    tmpEl.innerText = '上传中...';
    insertNode(tmpEl);

    const item = items[0];
    const resp = await uploadImg(item.getAsFile());
    tmpEl.remove();
    if (resp) {
      const respText = await resp.text();
      // DISCUZUPLOAD|0|123456|0
      const imgId = respText.split('|')[2];

      const postTime = new Date().getTime() / 1000;
      // https://img02.hi-pda.com/forum/forumdata/cache/common.js
      // eslint-disable-next-line no-undef
      ajaxget(imgListAjaxUrlGenenter(postTime), 'imgattachlist');

      let imgEl = document.getElementById(`image_${imgId}`);
      let msCount = 0;
      const sleepTime = 100;
      while (!imgEl && msCount < TIMEOUT) {
        await sleep(sleepTime);
        msCount += sleepTime;
        imgEl = document.getElementById(`image_${imgId}`);
      }
      const imgElStr = `<img src="${imgEl.src}" aid="attachimg_${imgId}" border="0" alt="" width="${imgEl.width}" />`;

      if (iframeEl) {
        // https://img02.hi-pda.com/forum/forumdata/cache/post.js
        // eslint-disable-next-line no-undef
        insertText(imgElStr, false);
      } else {
        if (textAreaEl) {
          const insertStr = `[attachimg]${imgId}[/attachimg]`;
          // eslint-disable-next-line no-undef
          insertText(insertStr, insertStr.length, 0);
        }
      }
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  if (iframeEl) {
    iframeEl.contentDocument.body.addEventListener('paste', handleOnPaste);
  } else {
    if (textAreaEl) {
      textAreaEl.addEventListener('paste', handleOnPaste);
    }
  }
})();
