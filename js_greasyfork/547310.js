// ==UserScript==
// @name         放开飞书复制和右键
// @license      GPL License
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  让飞书文档不受权限限制，可以复制任意内容，可以打开右键菜单（图片需点击2次右键才可弹出菜单），可以将复制内容粘贴到新的飞书文档
// @author       James Lin618
// @match        *://*.feishu.cn/*
// @icon         https://sf3-scmcdn2-cn.feishucdn.com/ccm/pc/web/resource/bear/src/common/assets/favicons/icon_file_doc_nor-32x32.8cb0fef16653221e74b9.png
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547310/%E6%94%BE%E5%BC%80%E9%A3%9E%E4%B9%A6%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/547310/%E6%94%BE%E5%BC%80%E9%A3%9E%E4%B9%A6%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE.meta.js
// ==/UserScript==
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    createToast();
    // 拦截权限接口，修改响应，获取复制权限
    rewritePermissionRequest();
    // 增加右键菜单，转换复制的内容
    addContextMenu();
    // 给图片增加右键菜单，可复制、下载等
    imgContextMenu();
  });
})();

function rewritePermissionRequest() {
  XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (...args) {
    const [method, url] = args;
    if (method === 'POST' && url.includes('space/api/suite/permission/document/actions/state/')) {
      this.addEventListener("readystatechange", function () {
        if (this.readyState !== 4) {
          return;
        }
        let { response } = this;
        try {
          response = JSON.parse(response);
        } catch (e) {}

        response.data.actions.copy = 1;
        response.data.actions.duplicate = 1;
        response.data.actions.export = 1;

        Object.defineProperty(this, 'response', {
          get() {
            return response;
          }
        });
        Object.defineProperty(this, 'responseText', {
          get() {
            return JSON.stringify(response);
          }
        });
      }, false);
    }/* else if (method === 'POST' && url.includes('space/api/box/file/multi_copy/')) {
      this.addEventListener("readystatechange", function () {
        if (this.readyState !== 4) {
          return;
        }
        let { response } = this;
        try {
          response = JSON.parse(response);
        } catch (e) {}

        const params = JSON.parse(this._data);
        const token = params.files[0].file_token;
        response.code = 0;
        response.data = {
          succ_files: {
            // [token]: '123'
          }
        };
        response.message = 'Success';

        Object.defineProperty(this, 'response', {
          get() {
            return response;
          }
        });
        Object.defineProperty(this, 'responseText', {
          get() {
            return JSON.stringify(response);
          }
        });
      }, false);
    } */

    return this._open(...args);
  };
}

function addContextMenu() {
  // 增加右键菜单
  GM_registerMenuCommand ("转换复制的飞书文档内容", async function() {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        if (type === 'text/html') {
          const reader = new FileReader();
          reader.readAsText(blob, 'utf-8');
          reader.onload = async function (e) {
            const htmlStr = await formatHtml(reader.result);
            const htmlBlob = new Blob([htmlStr], {
              type: 'text/html',
            });
            console.log(type);
            console.log(URL.createObjectURL(htmlBlob));
            await navigator.clipboard.write([new ClipboardItem({ [htmlBlob.type]: htmlBlob })]);
            // 无效
            // document.execCommand('paste');
            toast('转换成功，可以粘贴了！');
          };
        } else {
          console.log(type);
          console.log(URL.createObjectURL(blob));
        }
      }
    }
  });
}

function imgContextMenu() {
  // 图片的右键
  document.addEventListener('contextmenu', e => {
    if (e.target.nodeName === 'IMG') {
      console.log(e);
      const elements = e.composedPath();
      for (let index = 0; index < elements.length - 2; index++) {
        const ele = elements[index];
        try {
          ele.removeAttribute('data-copyable');
          ele.removeAttribute('data-printable');
          ele.removeAttribute('data-exportable');
        } catch (err) {
          console.log(ele, err);
        }
      }
    }
  });
}

function getBase64Image(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
}

function setImage(img) {
  return new Promise((resolve, reject) => {
    let src = img.src;
    if (src.startsWith('http')) {
      src = img.getAttribute('data-src')
        .replace(/\?.*/, '?preview_type=16')
        .replace(/\/all\//, '/preview/');
      const tempImg = document.createElement('img');
      tempImg.src = src;
      tempImg.crossOrigin = 'use-credentials';
      tempImg.onload = function () {
        const base64 = getBase64Image(tempImg);
        img.setAttribute('src', base64);
        img.setAttribute('default-src', src);
        img.setAttribute('crossorigin', 'use-credentials');
        img.style.maxHeight = '100%';
        img.style.maxWidth = '100%';
        img.removeAttribute('data-single-block');
        img.removeAttribute('data-snapshot');
        img.removeAttribute('data-suite');
        img.removeAttribute('data-src');
        img.removeAttribute('data-width');
        img.removeAttribute('data-height');
        img.parentElement.removeAttribute('data-ace-gallery-json');
        resolve();
      };
      tempImg.onerror = function (e) {
        reject(e);
      };
    }
    if (src.startsWith('blob')) {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        resolve(e.target.result);
      };
    }
  });
}

function formatHtml(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  div.childNodes[div.childElementCount - 1].remove();
  const imgArray = div.querySelectorAll('tbody img');
  const promises = [...imgArray].map(setImage);
  return Promise.allSettled(promises).then(() => div.innerHTML);
}

function createToast() {
  const style = document.createElement('style');
  style.innerHTML = `
      .m_toast {
        position: fixed;
        top: 20px;
        left: 50%;
        font-size: 14px;
        color: #fff;
        background: #000b;
        padding: 6px 10px;
        transform: translate(-50%, -100px);
        border-radius: 2px;
        transition: transform 0.4s ease 0s;
        z-index: 9999;
      }
   `;
  document.head.append(style);
  const div = document.createElement('div');
  div.className = 'm_toast';
  div.id = 'toast';
  div.innerHTML = '12345';
  document.body.appendChild(div);
}

function toast(text) {
  const toast = document.querySelector('#toast');
  toast.innerHTML = text;
  toast.style.transform = 'translate(-50%, 0)';
  setTimeout(() => {
    toast.style.transform = 'translate(-50%, -100px)';
  }, 2000);
}
