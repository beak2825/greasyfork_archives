// ==UserScript==
// @name         小宇宙FM-增加倍速选项
// @namespace    http://tampermonkey.net/
// @version      0.95
// @description  给小宇宙播放页面增加倍速选项，方便在电脑上收听
// @author       icheer.me
// @match        https://www.xiaoyuzhoufm.com/episode/*
// @match        https://www.xiaoyuzhoufm.com/podcast/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoyuzhoufm.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486742/%E5%B0%8F%E5%AE%87%E5%AE%99FM-%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/486742/%E5%B0%8F%E5%AE%87%E5%AE%99FM-%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const CE = tag => document.createElement(tag);
let panel = null;

async function init(delay = 0) {
  await sleep(delay);
  panel = $('body > div[id] > section .wrap + div');
  if (!panel) return console.error('panel not found');
  const audio = $('audio');
  if (!audio) return console.error('audio not found');
  if (panel.querySelector('select')) return;
  // v0.1 倍速选项
  makePlaybackRateSelect(panel, audio);
  // v0.2 下载按钮
  makeDownloadButton(panel, audio);
  // v0.3 循环播放
  makeLoopCheckbox(panel, audio);
  // v0.5 左右按键控制播放进度
  makeKeyboardControl();
  // v0.6 调出单集列表页面隐藏着的播放面板
  fixPodcastPage(audio, delay);
  // v0.4 二维码淡化
  // v0.7 允许选中和复制网页内的文字
  overrideStyles();
  // v0.8 记录最近30个单集的播放进度,打开页面时自动恢复进度并播放
  loadAudioProgress();
  // v0.9 Show Notes 中存在时间轴信息时,自动高亮当前主题
  loopExecute(1000, saveAudioProgress, highlightCurrentTopic)
}
init(500);

// 倍速下拉框
function makePlaybackRateSelect(panel, audio) {
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
  select.value = '1x';
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
}

// 下载按钮
function makeDownloadButton(panel, audio) {
  const download = CE('a');
  download.innerText = '下载音频';
  download.style = 'display: inline-block; width: 72px; margin: 0 75px 0 10px; text-align: left; color: var(--theme-color); font-size: 14px; text-decoration: none';
  download.href = audio.src;
  download.target = '_blank';
  const title = $('h1') && $('h1').innerText.trim();
  const fileName = audio.src.split('/').pop();
  const extName = fileName.split('.').pop();
  download.download = title ? `${title}.${extName}` : fileName;
  panel.appendChild(download);
}

// 循环播放复选框
function makeLoopCheckbox(panel, audio) {
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
}

// 样式修改
function overrideStyles() {
  const style = CE('style');
  style.innerHTML = `
    .title .highlight-word-clipper {
      width: 65px !important;
    }
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
    .highlight {
      display: block;
      position: relative;
    }
    .highlight + br {
      display: none;
    }
    .highlight::before {
      content: '▶';
      position: absolute;
      left: -1.25em;
    }
  `;
  $('head').appendChild(style);
}

// 左右按键控制播放进度,空格键播放/暂停
function makeKeyboardControl() {
  const btnPlay = panel.querySelector('button[aria-label^="播放"]') || panel.querySelector('button[aria-label^="暂停"]');
  const btnLeft = panel.querySelector('button[aria-label^="后退"]');
  const btnRight = panel.querySelector('button[aria-label^="前进"]');
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      btnPlay && btnPlay.click();
      e.preventDefault();
    } else if (e.code === 'ArrowLeft') {
      btnLeft && btnLeft.click();
    } else if (e.code === 'ArrowRight') {
      btnRight && btnRight.click();
    }
  });
}

// 调出单集列表页面隐藏着的播放面板
function fixPodcastPage(audio, delay) {
  if (/^\/podcast\//.test(location.pathname)) {
    $('section.wrap').style.transform = 'none';
    audio.onplay = () => {
      const rate = parseFloat(localStorage.getItem('xyzRate')) || 1;
      if (audio.playbackRate !== rate) audio.playbackRate = rate;
    };
  }
  // 解决在单集和列表之间切换时,功能失效的问题
  if ($('.podcast-title')) {
    $('.podcast-title').onclick = () => init(450);
  }
  $$('main.tabs a').forEach(a => {
    a.onclick = () => init(450);
  });
  if (!history.pushStateOld) {
    history.pushStateOld = history.pushState;
    history.pushState = (...args) => {
      init(450);
      history.pushStateOld.apply(history, args);
    };
    window.onpopstate = () => init(450);
  }
}

// 记录最近30个单集的播放进度,打开页面时自动恢复进度
const progressKey = 'xyzAudioProgress';

function getEpisodeId(audio) {
  let id = /episode\/([0-9a-f]+)/.exec(location.href)?.[1];
  if (!id) id = /track_id=(\d+)/.exec(audio.src)?.[1];
  return id;
}

function saveAudioProgress() {
  const audio = $('audio');
  if (!audio || !audio.src || audio.paused) return;
  const id = getEpisodeId(audio);
  if (!id) return;
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(progressKey) || '[]');
  } catch (e) {
    console.error(e);
  }
  let item = list.find(i => i.id === id)
  if (!item) {
    item = { id };
    list.unshift(item);
  }
  item.time = audio.currentTime;
  list = list.slice(0, 30);
  localStorage.setItem(progressKey, JSON.stringify(list));
}

function loadAudioProgress() {
  const audio = $('audio');
  if (!audio || !audio.src) return;
  const id = getEpisodeId(audio);
  if (!id) return;
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(progressKey) || '[]');
  } catch (e) {
    console.error(e);
  }
  const item = list.find(i => i.id === id);
  if (item) {
    audio.currentTime = item.time;
  }
  audio.play();
  audio.onended = removeAudioProgress;
}

function removeAudioProgress() {
  const audio = $('audio');
  if (!audio || !audio.src) return;
  const id = getEpisodeId(audio);
  if (!id) return;
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(progressKey) || '[]');
  } catch (e) {
    console.error(e);
  }
  list = list.filter(i => i.id !== id);
  localStorage.setItem(progressKey, JSON.stringify(list));
}

// ShowNotes中存在时间轴信息时,自动高亮当前主题
function highlightCurrentTopic() {
  const audio = $('audio');
  if (!audio || !audio.src) return;
  const timestamps = $$('.sn-content a.timestamp[data-timestamp]');
  if (!timestamps.length) return;
  const times = timestamps.map(a => parseFloat(a.dataset.timestamp) || 0);
  let paragraphs = timestamps.map(a => a.closest('p'));
  if (paragraphs[0] === paragraphs[1]) {
    paragraphs = timestamps.map(a => a.closest('span'));
  }
  const currentTime = audio.currentTime;
  const currentIdx = times.findLastIndex(t => t <= currentTime);
  paragraphs.forEach((p, i) => {
    p.classList.remove('highlight');
    if (i === currentIdx) p.classList.add('highlight');
  });
}

// 循环执行
function loopExecute(interval = 1000, ...funcs) {
  if (window.audioLoopTimer) return;
  window.audioLoopTimer = setInterval(() => {
    funcs.forEach(func => func());
  }, interval);
}