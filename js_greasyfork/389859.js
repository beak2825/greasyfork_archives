// ==UserScript==
// @name        贴吧图片上传加强
// @namespace   Myon
// @grant       none
// @description 添加图片粘贴和拖拽上传
// @include     http://tieba.baidu.com/*
// @include     https://tieba.baidu.com/*
// @author      Myon<myon.cn@gmail.com>
// @icon        http://tb.himg.baidu.com/sys/portrait/item/c339b7e2d3a1b5c4c3a8d726
// @version     0.0.1
// @downloadURL https://update.greasyfork.org/scripts/389859/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/389859/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

const TBS_REQUEST_URL = 'https://tieba.baidu.com/dc/common/imgtbs';
const IMAGE_UPLOAD_URL = 'https://uploadphotos.baidu.com/upload/pic';
const IMAGE_MAX_WIDTH = 560;
const forumId = PageData.forum.id;

$( document ).ready(() => {
  const editorElem = document.getElementById('ueditor_replace');
  if (!editorElem) return;
  // 粘贴事件
  editorElem.addEventListener('paste', function (event) {
    const items = event.clipboardData && event.clipboardData.items;
    let file = null;
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
    }
    if (file) {
      uploadFile(file);
    }
  });
  // 拖拽事件
  editorElem.addEventListener("drop", (e) => {
    e.preventDefault();
    [].forEach.call(e.dataTransfer.files, (file) => {
      if (file.type.indexOf('image') !== -1) {
        uploadFile(file);
      }
    });
  });
  function uploadFile (file) {
    $.get(TBS_REQUEST_URL, (res) => {
      const result = JSON.parse(res);
      const tbs = result.data.tbs;
      if (tbs) {
        const formData = new FormData();
        formData.append('file', file);
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onload = () => {
          const json = JSON.parse(xhr.responseText);
          if (json.err_msg) {
            alert(json.err_msg);
            return;
          }
          const imageUrl = `https://imgsa.baidu.com/forum/pic/item/${json.info.pic_id_encode}.jpg`;
          const imageWidth = json.info.fullpic_width;
          const imageHeight = json.info.fullpic_height;
          const insertWidth = imageWidth > IMAGE_MAX_WIDTH ? IMAGE_MAX_WIDTH : imageWidth;
          const insertHeight = imageWidth > IMAGE_MAX_WIDTH ? ~~(imageHeight / imageWidth * IMAGE_MAX_WIDTH) : imageHeight;
          const insertImage = `<p><img class="BDE_Image" src="${imageUrl}" unselectable="on" pic_type="0" width="${insertWidth}" height="${insertHeight}"></p>`;
          // 等待半秒，不然图片可能加载失败
          setTimeout(() => {
            $(editorElem).append(insertImage);
          }, 500);
        };
        xhr.open('POST', `${IMAGE_UPLOAD_URL}?tbs=${tbs}&fid=${forumId}&save_yun_album=1`, true);
        xhr.send(formData);
      } else {
        alert('获取TBS失败');
      }
    });
  }
});
