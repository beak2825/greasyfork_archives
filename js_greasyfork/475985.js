// ==UserScript==
// @name         futaba-add-uploader
// @namespace    http://2chan.net/
// @version      0.2.1
// @description  ふたばちゃんねるの投稿フォームに「あぷ小」または「あぷ」へのアップロード機能を追加します
// @author       ame-chan
// @match        http://*.2chan.net/b/res/*
// @match        https://*.2chan.net/b/res/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-idle
// @connect      2chan.net
// @connect      *.2chan.net
// @connect      img.2chan.net
// @connect      dec.2chan.net
// @downloadURL https://update.greasyfork.org/scripts/475985/futaba-add-uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/475985/futaba-add-uploader.meta.js
// ==/UserScript==
(() => {
  'use strict';
  const addStyle = `<style id="userjs-add-uploader">
  .ftbl {
    width: 510px;
  }
  [target="futaba_viewer_postcontents"] .ftbl {
    margin: 0 0 32px !important;
  }
  .ftdc {
    width: 100px;
  }
  #up2input + #fileselector-button-clear {
    display: none !important;
  }
  #up2error {
    display: none;
    color: #ff0000;
  }
  #up2error.is-visible {
    display: block;
  }
  .userjs-uploadcell:has(#file_control) {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .userjs-loading {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
  }
  </style>`;
  const targetUploader = {
    'あぷ小': {
      name: 'あぷ小',
      max_file_size: 3000000,
      max_file_size_text: '※あぷ小は3MBまで',
      post_url: '//dec.2chan.net/up2/up.php',
      get_url: '//dec.2chan.net/up2/up.htm',
    },
    'あぷ': {
      name: 'あぷ',
      max_file_size: 10000000,
      max_file_size_text: '※あぷは10MBまで',
      post_url: '//dec.2chan.net/up/up.php',
      get_url: '//dec.2chan.net/up/up.htm',
    },
  };
  const showErrorText = () => document.querySelector('#up2error')?.classList.add('is-visible');
  const hideErrorText = () => document.querySelector('#up2error')?.classList.remove('is-visible');
  const addUploader = () => {
    const inputAreaElm = document.querySelector('.ftbl tbody');
    const html = `<tr>
      <td class="ftdc">
        <b><span data-uploader-name>あぷ小</span>にUP</b>
      </td>
      <td class="userjs-uploadcell">
        <input id="up2input" name="userjs-uploader" type="file" size="40">
        <button id="up2submit" type="button">アップロード</button>
        <span id="up2error" data-uploader-text>※あぷ小は3MBまで</span>
      </td>
    </tr>`;
    const replaceHtml = (uploader) => {
      const nameElm = document.querySelector('[data-uploader-name]');
      const errorTextElm = document.querySelector('[data-uploader-text]');
      if (nameElm) {
        nameElm.textContent = uploader.name;
      }
      if (errorTextElm) {
        errorTextElm.textContent = uploader.max_file_size_text;
      }
    };
    const arrayBufferToHex = (arrayBuffer) =>
      Array.from(new Uint8Array(arrayBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    const calculateSHA1 = async (file) => {
      const buffer = await file.arrayBuffer();
      const message = new TextEncoder().encode(arrayBufferToHex(buffer));
      const hashBuffer = await crypto.subtle.digest('SHA-1', message);
      return arrayBufferToHex(hashBuffer);
    };
    const setInputState = {
      disabled(up2inputElm, up2submit) {
        up2inputElm.disabled = true;
        up2submit.innerHTML = `<div class="userjs-loading">
          <svg width="18px" height="18px" display="block" shape-rendering="auto" style="background:none;margin:auto" preserveAspectRatio="xMidYMid" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#aaa" stroke-dasharray="164.93361431346415 56.97787143782138" stroke-width="10">
              <animateTransform attributeName="transform" dur="1s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="0 50 50;360 50 50"/>
            </circle>
          </svg>
          <span>アップロード中...</span>
        </div>`;
        up2submit.disabled = true;
      },
      enabled(up2inputElm, up2submit) {
        up2inputElm.disabled = false;
        up2submit.innerHTML = 'アップロード';
        up2submit.disabled = false;
      },
    };
    const setErrorText = (text) => {
      const errorElm = document.querySelector('#up2error');
      if (errorElm) {
        errorElm.textContent = text;
      }
    };
    const setError = (text) => {
      const up2inputElm = document.querySelector('#up2input');
      const up2submitElm = document.querySelector('#up2submit');
      if (up2inputElm instanceof HTMLInputElement && up2submitElm instanceof HTMLButtonElement) {
        setErrorText(text);
        showErrorText();
        setInputState.enabled(up2inputElm, up2submitElm);
      }
    };
    const uploadFile = async (file, uploader) => {
      const formData = new FormData();
      const sha1 = await calculateSHA1(file);
      formData.append('MAX_FILE_SIZE', String(uploader.max_file_size));
      formData.append('mode', 'reg');
      formData.append('up', file);
      formData.append('com', sha1);
      try {
        await fetch(`${location.protocol}${uploader.post_url}`, {
          method: 'POST',
          body: formData,
        });
      } catch (e) {
      } finally {
        hideErrorText();
        return sha1;
      }
    };
    const getUploaderHTML = (uploader) => {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${location.protocol}${uploader.get_url}`,
          responseType: 'arraybuffer',
          headers: {
            'Cache-Control': 'no-cache',
          },
          onload: (response) => {
            if (response.status === 200) {
              resolve(response.response);
            } else {
              resolve(false);
            }
          },
          onerror: () => resolve(false),
        });
      });
    };
    const isAllowExtension = (up2inputElm) => {
      const allowExtension =
        /\.(3g2|3gp|7z|ai|aif|asf|avi|bmp|c|doc|eps|exe|f4v|flv|gca|gif|htm|html|jpeg|jpg|lzh|m4a|mgx|mht|mid|mkv|mmf|mov|mp3|mp4|mpeg|mpg|mpo|mqo|ogg|pdf|pls|png|ppt|psd|ram|rar|rm|rpy|sai|swf|tif|tiff|txt|wav|webm|webp|wma|wmv|xls|zip)$/;
      return allowExtension.test(up2inputElm.value);
    };
    const selectedUploader = (size) => {
      const up2MaxSize = targetUploader['あぷ小'].max_file_size;
      return size > up2MaxSize ? targetUploader['あぷ'] : targetUploader['あぷ小'];
    };
    const uploadHandler = async (up2inputElm, up2submitElm) => {
      const htmlParser = (uploaderHTML) => {
        const textDecoder = new TextDecoder('Shift_JIS');
        const html = textDecoder.decode(uploaderHTML);
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        if (dom) {
          return dom;
        }
        return false;
      };
      hideErrorText();
      setInputState.disabled(up2inputElm, up2submitElm);
      if (!up2inputElm.value || up2inputElm.files === null) {
        setError('ファイルが選択されていません');
        return;
      }
      const file = up2inputElm.files[0];
      const uploader = selectedUploader(file.size);
      if (file.size > uploader.max_file_size) {
        setError(uploader.max_file_size_text);
        return;
      }
      if (!isAllowExtension(up2inputElm)) {
        setError('アップロードが許可されていない拡張子です');
        return;
      }
      // ファイルのアップロードとSHA-1の取得
      const sha1 = await uploadFile(file, uploader);
      if (!sha1) {
        setError('アップロードファイルのSHA-1取得に失敗しました');
        return;
      }
      // uploaderのHTML取得
      const uploaderHTML = await getUploaderHTML(uploader);
      if (!uploaderHTML) {
        setError(`${uploader.name}のHTML取得に失敗しました`);
        return;
      }
      // uploaderのDOM取得
      const uploaderDocument = htmlParser(uploaderHTML);
      if (!uploaderDocument) {
        setError(`${uploader.name}のDOM取得に失敗しました`);
        return;
      }
      const files = uploaderDocument.querySelector('.files tbody');
      let uploadFileName = '';
      for (const el of [...(files?.children || [])]) {
        const comment = (el.querySelector('.fco')?.textContent || '').replace(/[\s\n\t]+/g, '');
        if (comment === sha1) {
          uploadFileName = el.querySelector('.fnm a')?.textContent || '';
          break;
        }
      }
      if (!uploadFileName) {
        setError(`${uploader.name}にアップロードしたファイルが見つかりませんでした`);
        return;
      }
      const textareaElm = document.querySelector('#ftxa');
      if (textareaElm) {
        textareaElm.value = textareaElm.value.length ? `${textareaElm.value}\n${uploadFileName}` : uploadFileName;
        up2inputElm.value = '';
        hideErrorText();
        setInputState.enabled(up2inputElm, up2submitElm);
        // ふたクロでプレビュー表示していた場合削除
        const previewElm = document.querySelector('#upfile_preview_wrap');
        if (previewElm) {
          previewElm.innerHTML = '';
        }
      }
    };
    if (inputAreaElm) {
      inputAreaElm.insertAdjacentHTML('beforeend', html);
      const up2inputElm = document.querySelector('#up2input');
      const up2submitElm = document.querySelector('#up2submit');
      if (up2inputElm instanceof HTMLInputElement && up2submitElm instanceof HTMLButtonElement) {
        up2submitElm.addEventListener('click', () => {
          void uploadHandler(up2inputElm, up2submitElm);
        });
        up2inputElm.addEventListener('change', (event) => {
          const files = event.target.files;
          if (files && files.length) {
            const uploader = selectedUploader(files[0].size);
            replaceHtml(uploader);
          }
        });
      }
    }
  };
  const initialize = () => {
    const styleElm = document.querySelector('#userjs-add-uploader');
    if (styleElm === null) {
      document.head.insertAdjacentHTML('beforeend', addStyle);
      addUploader();
    }
  };
  initialize();
  window.addEventListener('load', initialize);
})();
