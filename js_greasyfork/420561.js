// ==UserScript==
// @name         巴哈姆特動畫瘋影片擷圖小工具
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  video screenshot on ani.gamer.com.tw
// @author       Rplus
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/420561/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%B1%E7%89%87%E6%93%B7%E5%9C%96%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/420561/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%B1%E7%89%87%E6%93%B7%E5%9C%96%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  let video = getVideo();
  let title = '';
  let option = {
    fileExt: 'jpg',
    mimeType: 'image/jpeg',
    compressRatio: 0.95,
  };

  unsafeWindow.addEventListener('load', () => {
    video = getVideo();
    if (video) {
      init();
    } else {
      console.log('load video GG, wait 5s');
      delayInit();
    }
  });

  function delayInit() {
    setTimeout(() => {
      if (!unsafeWindow.videojs) {
        delayInit();
      } else {
        init();
      }
    }, 1000);
  }

  function init() {
    video = getVideo();
    title = document.querySelector('h1')?.textContent || document.title;

    console.log('load');
    if (!video) { return; }

    document.addEventListener('keydown', handleKeyDown);

    injectScreenshotBtn();
  }

  function handleKeyDown(e) {
    if (!e.altKey) { return; }

    switch (e.code) {
      case 'KeyS':
        screenshot(video, title);
        break;
      case 'Equal':
        shiftVideoFrame(1);
        break;
      case 'Minus':
        shiftVideoFrame(-1);
        break;
      default:
        break;
    }
  }

  function shiftVideoFrame(dir = 1) {
    video.currentTime += (dir / 60);
  }

  function injectScreenshotBtn() {
    const bar = document.querySelector('.control-bar-rightbtn');

    if (!bar) { return; }
    const btn = document.createElement('div');
    btn.className = 'vjs-button vjs-control vjs-playback-rate';
    btn.innerHTML = `<div class="vjs-playback-rate-value">擷圖</div>`
    btn.addEventListener('click', () => screenshot(video, title));
    bar.appendChild(btn);
  }

  function screenshot(video, title) {
    const currentTimeStr = new Date(video.currentTime * 1000).toISOString().slice(11, 19).replace(/\:/g, '-');
    const fn = title + '_' + currentTimeStr + '.' + option.fileExt;
    saveImage(getImgDataUrl(video), fn);
  }

  function getVideo() {
    return document.getElementById('ani_video_html5_api') || document.querySelector('video');
  }

  function getImgDataUrl(videoEl, scale = unsafeWindow.devicePixelRatio || 1) {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth * scale;
    canvas.height = videoEl.videoHeight * scale;
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL(option.mimeType, option.compressRatio);
  }

  function saveImage(imgSrc, filename) {
    var link = document.createElement('a');
    link.href = imgSrc;
    link.target = '_img';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  GM_registerMenuCommand('存檔格式設定為 JPG', updateConfig('jpg'), 'J');
  GM_registerMenuCommand('存檔格式設定為 PNG', updateConfig('png'), 'P');
  GM_registerMenuCommand('調整圖片壓縮率', udpateCompressRatio, 'C');

  function updateConfig(type) {
    return () => {
      switch (type) {
        case 'jpg':
          option.fileExt = 'jpg';
          option.mimeType = 'image/jpeg';
          break;
        case 'png':
          option.fileExt = 'png';
          option.mimeType = 'image/png';
          break;
        default:
          break;
      }
    };
  }

  function udpateCompressRatio() {
    let value = unsafeWindow.prompt(`調整圖片壓縮率(0: 最差，1: 最佳)`, option.compressRatio);
    if (!isNaN(value)) {
      value = Number(value)
      if (value <= 1 && value >= 0) {
        option.compressRatio = value;
      } else {
        unsafeWindow.alert(`輸入錯誤壓縮率: ${value}。\n請使用合格數字區間`);
      }
    } else {
      unsafeWindow.alert(`輸入錯誤壓縮率: ${value}。\n請使用數字格式`);
    }
  }
})();
