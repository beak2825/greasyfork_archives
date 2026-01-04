// ==UserScript==
// @name         小宇宙FM-增加倍速选项
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  给小宇宙播放页面增加倍速选项，方便在电脑上收听
// @author       icheer.me
// @match        https://www.xiaoyuzhoufm.com/episode/*
// @match        https://www.xiaoyuzhoufm.com/podcast/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoyuzhoufm.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483124/%E5%B0%8F%E5%AE%87%E5%AE%99FM-%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/483124/%E5%B0%8F%E5%AE%87%E5%AE%99FM-%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(async function init (delay = 0) {
  const sleep = time => new Promise(resolve => setTimeout(resolve, time));
  const $ = sel => document.querySelector(sel);
  const CE = tag => document.createElement(tag);
  await sleep(delay);
  const panel = $('.controls');
  if (!panel) return console.error('panel not found');
  const audio = $('audio');
  if (!audio) return console.error('audio not found');
  // v0.1 倍速选项
  // 倍速下拉框
  const select = CE('select');
  // 0.5倍速听谈话类节目太魔性了,是一个无用的选项,需要的话可以自己在下方添加<option value="0.5x">0.5x</option>
  select.innerHTML = `
    <option value="1x">1x</option>
    <option value="1.25x">1.25x</option>
    <option value="1.5x">1.5x</option>
    <option value="1.75x">1.75x</option>
    <option value="2x">2x</option>
    <option value="3x">3x</option>
  `;
  select.style = 'width: 72px; height: 28px; margin: 0 10px; padding: 0 4px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px; color: #333; outline: none';
  panel.insertBefore(select, panel.children[0]);
  // 最后一次选择的倍速偏好,自动带入
  if (localStorage.getItem('xyzRate')) {
    const rate = parseFloat(localStorage.getItem('xyzRate')) || 1;
    audio.playbackRate = rate;
    select.value = rate + 'x';
  }
  // 选择倍速时,让倍速生效,并在localStorage中记录偏好,以便下次自动生效
  select.addEventListener('change', e => {
    const rate = parseFloat(e.target.value) || 1;
    audio.playbackRate = rate;
    localStorage.setItem('xyzRate', rate);
  });
  // v0.2 下载按钮
  // 下载按钮
  const download = CE('a');
  download.innerText = '下载音频';
  download.style = 'display: inline-block; width: 72px; margin: 0 75px 0 10px; text-align: left; color: var(--theme-color); font-size: 14px; text-decoration: none';
  download.href = audio.src;
  download.target = '_blank';
  const title = $('h1') && $('h1').innerText.trim();
  const fileName = audio.src.split('/').pop();
  const extName = fileName.split('.').pop();
  download.download = title ? `${title}.${extName}` : fileName;;
  panel.appendChild(download);
  // v0.3 循环播放
  // 循环播放复选框
  const loopLabel = CE('label');
  const loopBox = CE('input');
  const loopSpan = CE('span');
  loopLabel.style = 'margin: 0 10px; color: var(--theme-color); font-size: 14px';
  loopBox.type = 'checkbox';
  loopBox.style = 'display: inline-block; vertical-align: middle; margin-right: 4px; background: #fff; opacity: 0.15';
  loopSpan.style = 'display: inline-block; vertical-align: middle'
  loopSpan.innerText = '循环';
  loopLabel.appendChild(loopBox);
  loopLabel.appendChild(loopSpan);
  panel.insertBefore(loopLabel, panel.children[0]);
  // 切换循环播放时,使audio.loop生效
  loopBox.addEventListener('change', e => {
    audio.loop = e.target.checked;
    loopBox.style.opacity = e.target.checked ? 1 : 0.15;
  });
  // v0.5 左右按键控制播放进度
  // 左右按键控制播放进度
  const btnLeft = $('.controls button[aria-label^="后退"]');
  const btnRight = $('.controls button[aria-label^="前进"]');
  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') {
      btnLeft && btnLeft.click();
    } else if (e.key === 'ArrowRight') {
      btnRight && btnRight.click();
    }
  });
  // v0.6 调出单集列表页面隐藏着的播放面板
  if (/^\/podcast\//.test(location.pathname)) {
    $('section.wrap').style.transform = 'none';
    audio.onplay = () => {
      const rate = parseFloat(localStorage.getItem('xyzRate')) || 1;
      if (audio.playbackRate !== rate) audio.playbackRate = rate;
    };
  }
  // 解决在单集和列表之间切换时,功能失效的问题
  if (delay === 500) {
    history.pushState = () => init(150);
  }
  if ($('.podcast-title')) {
    $('.podcast-title').onclick = () => init(150);
  }
  // v0.4 二维码淡化
  // v0.7 允许选中和复制网页内的文字
  const style = CE('style');
  style.innerHTML = `
    main aside {
      opacity: 0.08;
    }
    main aside:hover {
      opacity: 1;
    }
    div, img, span, p {
      -webkit-user-select: auto;
      -moz-user-select: auto;
      -ms-user-select: auto;
      user-select: auto;
      -webkit-touch-callout: initial;
    }
  `;
  $('head').appendChild(style);
})(500);