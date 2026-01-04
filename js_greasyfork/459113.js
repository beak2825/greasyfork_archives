// ==UserScript==
// @name               fantia-image-downloader
// @name:en            fantia-image-downloader
// @name:zh-CN         fantia-image-downloader
// @namespace          https://fantia.jp/
// @version            0.2.0
// @description        Fantiaに投稿された画像をzipファイルでダウンロードするシンプルなスクリプトです。
// @description:en     Download all images posted to Fantia at once for each post.
// @description:zh-CN  一个简单的脚本，可以将Fantia上发布的图片下载成一个压缩文件。
// @author             ame-chan
// @match              https://fantia.jp/posts/*
// @icon               https://fantia.jp/assets/customers/favicon-32x32-8ab6e1f6c630503f280adca20d089646e0ea67559d5696bb3b9f34469e15c168.png
// @grant              none
// @license            MIT
// @require            https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @downloadURL https://update.greasyfork.org/scripts/459113/fantia-image-downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/459113/fantia-image-downloader.meta.js
// ==/UserScript==
(() => {
  const i18n = {
    'en': {
      'noname': 'untitled',
      'initialButtonName': 'Image Download',
      'progressDownloadImages': 'Downloading images',
      'createZipFile': 'Creating zip file',
    },
    'zh': {
      'noname': '无标题',
      'initialButtonName': '图片下载',
      'progressDownloadImages': '正在下载的图像',
      'createZipFile': '正在创建压缩文件',
    },
    'ja': {
      'noname': '無題',
      'initialButtonName': '画像ダウンロード',
      'progressDownloadImages': '画像ダウンロード中',
      'createZipFile': '圧縮ファイル作成中',
    },
  };
  const lang = (() => {
    if (/^ja/.test(navigator.language)) {
      return i18n['ja'];
    } else if (/^zh/.test(navigator.language)) {
      return i18n['zh'];
    }
    return i18n['en'];
  })();
  const getDLButton = () => document.querySelector('#fantiaDLbutton');
  const getDLButtonWrapper = () => document.querySelector('.userjs-downloadBtn');
  const getDate = () => {
    const getNowDate = () => {
      const date = new Date();
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}${mm}${dd}`;
    };
    const postDate = document.querySelector('.post-header .post-date');
    const [date = false] = postDate?.textContent?.split(' ').filter(Boolean) || [];
    if (!date) {
      return getNowDate();
    }
    return date.replace(/\//g, '');
  };
  const getPostContent = () => {
    const contentElms = document.querySelectorAll('.post-content');
    const postData = [];
    for (const contentElm of contentElms) {
      const contentData = {
        title: '',
        imagePaths: [],
      };
      const titleElm = contentElm.querySelector('.post-content-title');
      if (titleElm && titleElm.textContent) {
        contentData.title = titleElm.textContent === '' ? lang['noname'] : titleElm.textContent;
      }
      const imageElms = contentElm.querySelectorAll('.image-module');
      for (const imageElm of imageElms) {
        const image = imageElm.querySelector('img[src]');
        if (!image) continue;
        const [imgId = false] = image.src.match(/\/[0-9]{8}\//) || [];
        if (imgId) {
          contentData.imagePaths.push(imgId.replace(/\//g, ''));
        }
      }
      if (contentData.imagePaths.length > 0) {
        postData.push(contentData);
      }
    }
    return postData;
  };
  const getImageFormat = (arrayBuffer) => {
    const arr = new Uint8Array(arrayBuffer).subarray(0, 4);
    let header = '';
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    if (/^89504e47/.test(header)) {
      return 'png';
    } else if (/^47494638/.test(header)) {
      return 'gif';
    } else if (/^424d/.test(header)) {
      return 'bmp';
    } else if (/^ffd8ff/.test(header)) {
      return 'jpg';
    }
    return '';
  };
  const execDownload = async () => {
    try {
      // 新しいzipファイルを作成
      const zip = new window.fflate.Zip();
      const zipData = [];
      const postContents = getPostContent();
      const postContentsLength = postContents.length;
      const postId = location.pathname.split('/').filter(Boolean).pop();
      const baseURL = `https://fantia.jp/posts/${postId}/post_content_photo/`;
      const changeProgress = (text, percentage) => {
        const buttonElm = getDLButton();
        if (!buttonElm) return;
        if (!buttonElm.classList.contains('is-disabled')) {
          buttonElm.classList.add('is-disabled');
        }
        buttonElm.textContent = `${text} ... ${percentage}%`;
      };
      let totalFiles = 0;
      for (let i = 0; i < postContentsLength; i++) {
        const content = postContents[i];
        totalFiles += content.imagePaths.length;
      }
      let completedFiles = 0;
      // ZIPデータを収集するためのイベントを設定
      zip.ondata = (err, data, final) => {
        if (err) {
          console.error(err);
          return;
        }
        zipData.push(data);
        if (final) {
          const blob = new Blob(zipData, {
            type: 'application/zip',
          });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `[${getDate()}] ${title}.zip`;
          link.click();
          // ボタン初期化
          const buttonElm = getDLButton();
          if (!buttonElm) return;
          buttonElm.classList.remove('is-disabled');
          buttonElm.textContent = lang['initialButtonName'];
        }
      };
      const postTitleElm = document.querySelector('h1.post-title');
      const title = postTitleElm?.textContent || lang['noname'];
      // 画像のダウンロードと処理を並行して行う
      await Promise.all(
        postContents.map(async (data, contentIndex) => {
          await Promise.all(
            data.imagePaths.map(async (imagePath, imageIndex) => {
              const response = await fetch(baseURL + imagePath);
              const text = await response.text();
              const dom = new DOMParser();
              const html = dom.parseFromString(text, 'text/html');
              const originalImage = html.querySelector('img[src*="cc.fantia.jp"]');
              if (originalImage) {
                const imageDataResp = await fetch(originalImage.src);
                const binaryData = await imageDataResp.arrayBuffer();
                const uint8arrayData = new Uint8Array(binaryData);
                const url = new URL(originalImage.src);
                const ext = url.pathname.split('.').pop() || getImageFormat(binaryData);
                const fileName = `${data.title}_${contentIndex}_${imageIndex}.${ext}`;
                // ファイルをZIPに追加
                const fileEntry = new window.fflate.ZipPassThrough(fileName);
                zip.add(fileEntry); // ストリームをZIPに追加
                fileEntry.push(uint8arrayData, true); // データを追加し、終了を示す
                completedFiles++;
                const percentage = ((completedFiles / totalFiles) * 100).toFixed(2);
                changeProgress(lang['progressDownloadImages'], percentage);
              }
            }),
          );
        }),
      );
      // ZIPの生成を開始
      changeProgress(lang['createZipFile'], '100');
      zip.end();
    } catch (e) {
      alert(e);
      console.error(e);
    }
  };
  const buttonStyle = `<style>
  .userjs-downloadBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
  }
  .userjs-downloadBtn__button {
    position: relative;
    appearance: none;
    margin: 0;
    padding: 12px 24px;
    font-size: 16px;
    color: #fff;
    background-color: #00d1b2;
    border: 0;
    border-radius: 4px;
    box-shadow: 0 3px 6px rgb(0 209 178 / 60%);
    transition: filter 0.3s ease;
  }
  .userjs-downloadBtn__button:hover {
    filter: saturate(130%);
  }
  .userjs-downloadBtn__button:active {
    top: 1px;
    box-shadow: none;
  }
  .userjs-downloadBtn__button.is-disabled {
    pointer-events: none;
    user-select: none;
    color: #aaa;
    background-color: #e0e0e0;
    box-shadow: none;
  }
  </style>`;
  const createDownloadButton = () => {
    const postHeader = document.querySelector('.the-post .post-header');
    const buttonHTML = `<div class="userjs-downloadBtn">
      <button type="button" id="fantiaDLbutton" class="userjs-downloadBtn__button">${lang['initialButtonName']}</button>
    </div>`;
    document.head.insertAdjacentHTML('afterbegin', buttonStyle);
    postHeader?.insertAdjacentHTML('afterend', buttonHTML);
    const buttonElm = getDLButton();
    buttonElm?.addEventListener('click', () => {
      void execDownload();
    });
  };
  const observeContents = () => {
    const mainElm = document.querySelector('#main');
    if (!mainElm) {
      return console.warn('mainElm not found');
    }
    const dlbuttonWrapperElm = getDLButtonWrapper();
    if (dlbuttonWrapperElm !== null) {
      dlbuttonWrapperElm.remove();
    }
    let timer;
    const postContentsArray = () => getPostContent().filter((data) => data.imagePaths.length);
    const observer = new MutationObserver((_, obs) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (postContentsArray().length) {
          obs.disconnect();
          clearTimeout(timer);
          const dlbuttonWrapperElm = getDLButtonWrapper();
          if (dlbuttonWrapperElm === null) {
            createDownloadButton();
          }
          window.removeEventListener('focus', observeContents);
        } else {
          console.warn('[fantia-downloader] download files not found.');
        }
      }, 100);
    });
    if (postContentsArray().length) {
      createDownloadButton();
    } else {
      observer.observe(mainElm, {
        childList: true,
        subtree: true,
      });
    }
  };
  observeContents();
  window.addEventListener('focus', observeContents);
})();
