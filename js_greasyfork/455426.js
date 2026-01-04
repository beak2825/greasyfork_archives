// ==UserScript==
// @name         91 Plus M
// @namespace    https://github.com/DonkeyBear
// @version      1.0.2
// @description  打造91譜的最佳體驗
// @author       DonkeyBear
// @match        *://www.91pu.com.tw/m/*
// @match        *://www.91pu.com.tw/song/*
// @icon         https://www.91pu.com.tw/icons/favicon-32x32.png
// @antifeature  tracking
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455426/91%20Plus%20M.user.js
// @updateURL https://update.greasyfork.org/scripts/455426/91%20Plus%20M.meta.js
// ==/UserScript==

/* global $ */

/** 若樂譜頁面為電腦版，跳轉至行動版 */
function redirect () {
  const currentUrl = window.location.href;
  if ((/\/song\//).test(currentUrl)) {
    const sheetId = currentUrl.match(/(?<=\/)\d+(?=\.)/)[0];
    const newUrl = `https://www.91pu.com.tw/m/tone.shtml?id=${sheetId}`;
    window.location.replace(newUrl);
  }
}

/** 引入 Google Analytics */
function injectGtag () {
  const newScript = document.createElement('script');
  newScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-JF4S3HZY31';
  newScript.async = true;
  document.head.appendChild(newScript);
  newScript.onload = () => {
    // 此區塊由 Google Analytics 生成
    window.dataLayer = window.dataLayer || [];
    function gtag () { window.dataLayer.push(arguments) }
    gtag('js', new Date());
    gtag('config', 'G-JF4S3HZY31');
  };
}

/** 注入頁面樣式 */
function injectStyle () {
  const stylesheet = /* css */`
    html {
      background: #fafafa url(/templets/pu/images/tone-bg.gif); 
    }

    header {
      background-color: rgba(25, 20, 90, 0.5);
      backdrop-filter: blur(5px) saturate(80%);
      -webkit-backdrop-filter: blur(5px) saturate(80%);
      display: flex;
      justify-content: center;
      font-family: system-ui;
    }

    header > .set {
      width: 768px;
    }

    .tfunc2 {
      margin: 10px;
    }

    .setint {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .setint,
    .plays .capo {
      display: flex;
      justify-content: space-between;
    }

    #mtitle {
      font-family: system-ui;
    }

    .setint {
      border-top: 0;
      padding: 10px;
    }

    .setint > .hr {
      margin-right: 15px;
      padding: 0 15px;
    }

    .capo-section {
      flex-grow: 1;
      margin-right: 0 !important;
      display: flex !important;
      justify-content: space-between !important;
    }

    .capo-button.decrease {
      padding-right: 20px;
    }

    .capo-button.increase {
      padding-left: 20px;
    }

    /* 需要倒數才能關閉的蓋版廣告 */
    #viptoneWindow.window,
    /* 在頁面最底部的廣告 */
    #bottomad,
    /* 最上方提醒升級VIP的廣告 */
    .update_vip_bar,
    /* 譜上的LOGO和浮水印 */
    .wmask,
    /* 彈出式頁尾 */
    footer,
    /* 自動滾動頁面捲軸 */
    .autoscroll,
    /* 頁首的返回列 */
    .backplace,
    /* 頁首的多餘列 */
    .set .keys,
    .set .plays,
    .set .clear,
    /* 功能列上多餘的按鈕 */
    .setint .hr:nth-child(4),
    .setint .hr:nth-child(5),
    .setint .hr:nth-child(6),
    /* 其餘的Google廣告 */
    .adsbygoogle {
      display: none !important;
    }
  `;
  const style = document.createElement('style');
  style.innerText = stylesheet;
  document.head.appendChild(style);
}

/**
 * @typedef {object} Params
 * @prop {number} transpose
 * @prop {boolean} darkMode
 */
/**
 * 從 URL 取得參數
 * @returns {Params}
 */
function getQueryParams () {
  const url = new URL(window.location.href);
  const params = {
    transpose: +url.searchParams.get('transpose'),
    darkMode: !!url.searchParams.get('darkmode')
  };
  return params;
}

/** 用於操作和弦字串 */
class Chord {
  static sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  static flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  /** @param {string} chordString  */
  constructor (chordString) {
    this.chordString = chordString;
  }

  /** @param {number} delta */
  transpose (delta) {
    this.chordString = this.chordString.replaceAll(/[A-G][#b]?/g, (note) => {
      const isSharp = Chord.sharps.includes(note);
      const scale = isSharp ? Chord.sharps : Chord.flats;
      const noteIndex = scale.indexOf(note);
      const transposedIndex = (noteIndex + delta + 12) % 12;
      const transposedNote = scale[transposedIndex];
      return transposedNote;
    });
    return this;
  }

  switchModifier () {
    this.chordString = this.chordString.replaceAll(/[A-G][#b]/g, (note) => {
      const scale = note.includes('#') ? Chord.sharps : Chord.flats;
      const newScale = note.includes('#') ? Chord.flats : Chord.sharps;
      const noteIndex = scale.indexOf(note);
      return newScale[noteIndex];
    });
    return this;
  }

  useSharpModifier () {
    this.chordString = this.chordString.replaceAll(/[A-G]b/g, (note) => {
      const noteIndex = Chord.flats.indexOf(note);
      return Chord.sharps[noteIndex];
    });
    return this;
  }

  useFlatModifier () {
    this.chordString = this.chordString.replaceAll(/[A-G]#/g, (note) => {
      const noteIndex = Chord.sharps.indexOf(note);
      return Chord.flats[noteIndex];
    });
    return this;
  }

  toString () {
    return this.chordString;
  }

  toFormattedString () {
    return this.chordString.replaceAll(/[#b]/g, /* html */`<sup>$&</sup>`); // eslint-disable-line quotes
  }
}

/** 用於修改樂譜 */
class ChordSheetElement {
  /** @param {HTMLElement} chordSheetElement  */
  constructor (chordSheetElement) {
    this.chordSheetElement = chordSheetElement;
  }

  formatUnderlines () {
    const underlineEl = this.chordSheetElement.querySelectorAll('u');
    const doubleUnderlineEl = this.chordSheetElement.querySelectorAll('abbr');
    underlineEl.forEach((el) => { el.innerText = `{_${el.innerText}_}` });
    doubleUnderlineEl.forEach((el) => { el.innerText = `{=${el.innerText}=}` });
    return this;
  }

  unformatUnderlines () {
    const underlineEl = this.chordSheetElement.querySelectorAll('u');
    const doubleUnderlineEl = this.chordSheetElement.querySelectorAll('abbr');
    const unformat = (nodeList) => {
      nodeList.forEach((el) => {
        el.innerHTML = el.innerText
          .replaceAll(/{_|{=|=}|_}/g, '')
          .replaceAll(/[a-zA-Z0-9#/]+/g, /* html */`<span class="tf">$&</span>`); // eslint-disable-line quotes
      });
    };
    unformat(underlineEl);
    unformat(doubleUnderlineEl);
    return this;
  }
}

/** 用於取得樂譜相關資訊 */
class ChordSheetDocument {
  constructor () {
    this.el = {
      mtitle: document.getElementById('mtitle'),
      tkinfo: document.querySelector('.tkinfo'),
      capoSelect: document.querySelector('.capo .select'),
      tinfo: document.querySelector('.tinfo'),
      tone_z: document.getElementById('tone_z')
    };
  }

  getId () {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get('id'));
  }

  getTitle () {
    return this.el.mtitle.innerText.trim();
  }

  getKey () {
    const match = this.el.tkinfo?.innerText.match(/(?<=原調：)\w*/);
    return match ? match[0].trim() : '';
  }

  getPlay () {
    const match = this.el.capoSelect?.innerText.split(/\s*\/\s*/);
    return match ? match[1].trim() : '';
  }

  getCapo () {
    const match = this.el.capoSelect?.innerText.split(/\s*\/\s*/);
    return match ? Number(match[0]) : 0;
  }

  getSinger () {
    const match = this.el.tinfo?.innerText.match(/(?<=演唱：).*(?=\n|$)/);
    return match ? match[0].trim() : '';
  }

  getComposer () {
    const match = this.el.tinfo?.innerText.match(/(?<=曲：).*?(?=詞：|$)/);
    return match ? match[0].trim() : '';
  }

  getLyricist () {
    const match = this.el.tinfo?.innerText.match(/(?<=詞：).*?(?=曲：|$)/);
    return match ? match[0].trim() : '';
  }

  getBpm () {
    const match = this.el.tkinfo?.innerText.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  getSheetText () {
    const formattedChordSheet = this.el.tone_z.innerText
      .replaceAll(/\s+?\n/g, '\n')
      .replaceAll('\n\n', '\n')
      .trim()
      .replaceAll(/\s+/g, (match) => { return `{%${match.length}%}` });
    return formattedChordSheet;
  }
}

/**
 * 將 Header 和譜上的和弦移調，並實質修改於 DOM
 * @param {number} delta
 */
function transposeSheet (delta) {
  // 修改 Header 上的 Capo
  const $spanCapo = $('.capo-button > .text-capo');
  const newSpanCapoText = (+$spanCapo.text() + delta) % 12;
  $spanCapo.text(newSpanCapoText);

  // 修改 Header 上的 Key
  const $spanKey = $('.capo-button > .text-key');
  const keyName = new Chord($spanKey.text());
  const newSpanCapoHTML = keyName.transpose(-delta).toFormattedString();
  $spanKey.html(newSpanCapoHTML);

  // 修改譜上的和弦
  $('#tone_z .tf').each(function () {
    const chord = new Chord($(this).text());
    const newChordHTML = chord.transpose(-delta).toFormattedString();
    $(this).html(newChordHTML);
  });
};

/** 初始化並綁定大部分事件 */
function initEventHandlers () {
  /** @type {number} */
  let originalCapo;

  // 頁面動態讀取完成時觸發
  $('body').on('mutation.done', () => {
    // 記錄原調
    const $textCapo = $('.capo-button > .text-capo');
    originalCapo = +$textCapo.text();

    // 依照 URL 參數進行移調
    if (getQueryParams().transpose) {
      transposeSheet(getQueryParams().transpose);
    }
  });

  // 點擊移調按鈕時進行移調
  $('body').on('click', '.capo-section > .capo-button.decrease', () => { transposeSheet(-1) });
  $('body').on('click', '.capo-section > .capo-button.increase', () => { transposeSheet(1) });
  $('body').on('click', '.capo-section > .capo-button.info', () => {
    const $textCapo = $('.capo-button > .text-capo');
    const currentCapo = +$textCapo.text();
    transposeSheet(originalCapo - currentCapo);
  });
}

/**
 * 將網頁標題替換為自訂格式
 * @returns {boolean} 是否完成
 */
function changeTitle () {
  const $mtitle = $('#mtitle');
  const newTitle = $mtitle.text().trim();
  if (newTitle) {
    document.title = `${newTitle} | 91+ M`;
    return true;
  } else {
    return false;
  }
}

/**
 * 修改 Header：替換移調按鈕、增加自訂按鈕等
 * @returns {boolean} 是否完成
 */
function modifyHeader () {
  const capoSelectText = $('.capo .select').eq(0).text().trim();
  if (!capoSelectText) { return false }

  const stringCapo = capoSelectText.split(/\s*\/\s*/)[0]; // CAPO
  const stringKey = capoSelectText.split(/\s*\/\s*/)[1]; // 調

  // 新增功能鈕
  const newFunctionDiv = document.createElement('div');
  newFunctionDiv.classList.add('hr', 'capo-section');
  newFunctionDiv.innerHTML = /* html */`
    <button class="scf capo-button decrease">◀</button>
    <button class="scf capo-button info">
      CAPO：<span class="text-capo">${stringCapo}</span>
      （<span class="text-key">${
        stringKey.replaceAll(/[#b]/g, /* html */`<sup>$&</sup>`) // eslint-disable-line quotes
      }</span>）
    </button>
    <button class="scf capo-button increase">▶</button>
  `;
  document.querySelector('.setint').appendChild(newFunctionDiv);

  return true;
}

/**
 * 發送請求至 API，雲端備份樂譜
 * @returns {boolean} 是否完成
 */
function archiveChordSheet () {
  const sheet = document.getElementById('tone_z');
  if (!sheet?.innerText.trim()) { return false }

  const chordSheetDocument = new ChordSheetDocument();
  try {
    const chordSheetElement = new ChordSheetElement(sheet);
    chordSheetElement.formatUnderlines();

    const formBody = {
      id: chordSheetDocument.getId(),
      title: chordSheetDocument.getTitle(),
      key: chordSheetDocument.getKey(),
      play: chordSheetDocument.getPlay(),
      capo: chordSheetDocument.getCapo(),
      singer: chordSheetDocument.getSinger(),
      composer: chordSheetDocument.getComposer(),
      lyricist: chordSheetDocument.getLyricist(),
      bpm: chordSheetDocument.getBpm(),
      sheet_text: chordSheetDocument.getSheetText()
    };
    chordSheetElement.unformatUnderlines();

    fetch('https://91-plus-plus-api.fly.dev/archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formBody)
    })
      .then(response => { console.log('雲端樂譜備份成功：', response) })
      .catch(error => { console.error('雲端樂譜備份失敗：', error) });
  } catch {
    console.warn('樂譜解析失敗，無法備份');
    fetch(`https://91-plus-plus-api.fly.dev/report?id=${chordSheetDocument.getId()}`);
  }

  return true;
}

/**
 * @typedef {object} ObserverCheckList
 * @prop {boolean} changeTitle 是否已替換頁面標題
 * @prop {boolean} modifyHeader 是否已替換 Header
 * @prop {boolean} archiveChordSheet 是否已將樂譜進行雲端備份
 */
/**
 * 透過 MutationObserver 觸發的處理函式
 * @param {ObserverCheckList} checkList
 */
function observerHandler (checkList) {
  if (!checkList.changeTitle) {
    checkList.changeTitle = changeTitle();
  }
  if (!checkList.modifyHeader) {
    checkList.modifyHeader = modifyHeader();
  }
  if (!checkList.archiveChordSheet) {
    checkList.archiveChordSheet = archiveChordSheet();
  }

  // 如果已全數完成，則觸發 body 上的 mutation.done 事件
  let isAllClear = true;
  for (const checked of Object.values(checkList)) {
    if (!checked) { isAllClear = false }
  }
  if (isAllClear) { $('body').trigger('mutation.done') }
}

/** 初始化 MutationObserver */
function initMutationObserver () {
  /** @type {ObserverCheckList} */
  const observerCheckList = {
    changeTitle: false,
    modifyHeader: false,
    archiveChordSheet: false
  };

  const observer = new MutationObserver(() => {
    observerHandler(observerCheckList);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  $('body').on('mutation.done', () => { observer.disconnect() });
}

/** 於每天第一次使用時跳出升級建議 */
function askToUpdate () {
  const currentUrl = window.location.href;
  if ((/\/song\//).test(currentUrl)) { return }

  const storageKey = 'plus91-last-visit';
  const lastVisit = localStorage.getItem(storageKey);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };
  const currentDate = formatDate(new Date());
  if (currentDate !== lastVisit) {
    localStorage.setItem(storageKey, currentDate);
    const ans = confirm('91 Plus M 已經停止更新和維護了，\n建議升級至全新版本的 91 Plus！\n\n（本訊息僅會在每天第一次使用時跳出）');
    if (ans) {
      window.location.replace('https://github.com/DonkeyBear/91Plus/wiki/91-Plus-%E8%88%87-91-Plus-M');
    }
  }
}

/** 主程式進入點 */
function main () {
  redirect();
  injectGtag();
  injectStyle();
  initEventHandlers();
  initMutationObserver();
  askToUpdate();
}

main();
