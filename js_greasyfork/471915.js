// ==UserScript==
// @name         futaba-image-preview
// @namespace    http://2chan.net/
// @version      0.7.4
// @description  ふたばちゃんねるのスレッド上で「あぷ」「あぷ小」の画像をプレビュー表示する
// @author       ame-chan
// @match        http://*.2chan.net/b/res/*
// @match        https://*.2chan.net/b/res/*
// @match        http://kako.futakuro.com/futa/*
// @match        https://kako.futakuro.com/futa/*
// @match        https://tsumanne.net/si/data/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-idle
// @connect      2chan.net
// @connect      img.2chan.net
// @connect      dec.2chan.net
// @require      https://cdn.jsdelivr.net/npm/exifreader@4.20.0/dist/exif-reader.min.js
// @downloadURL https://update.greasyfork.org/scripts/471915/futaba-image-preview.user.js
// @updateURL https://update.greasyfork.org/scripts/471915/futaba-image-preview.meta.js
// ==/UserScript==
(async () => {
  'use strict';
  const resNumberStorage = {};
  let initExecCreateLink = false;
  let initTimer;
  const addedStyle = `<style id="userjs-preview-style">
  .zoom_button.not_copy_button {
    display: none;
  }
  .userjs-preview-link {
    padding-right: 24px;
    background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2038%2038%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20stroke%3D%22%23000%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20transform%3D%22translate(1%201)%22%20stroke-width%3D%222%22%3E%3Ccircle%20stroke-opacity%3D%22.5%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2218%22%2F%3E%3Cpath%20d%3D%22M36%2018c0-9.94-8.06-18-18-18%22%3E%20%3CanimateTransform%20attributeName%3D%22transform%22%20type%3D%22rotate%22%20from%3D%220%2018%2018%22%20to%3D%22360%2018%2018%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%2F%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right center;
  }
  .userjs-preview-imageWrap {
    max-width: calc(100vw - 200px);
    width: fit-content;
  }
  .userjs-preview-inner {
    position: relative;
    width: fit-content;
  }
  .userjs-preview-inner.is-caution::after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(40px);
    border-radius: 4px;
  }
  .userjs-preview-image {
    max-width: calc(100vw - 200px) !important;
    max-height: none !important;
    transition: all 0.2s ease-in-out;
    border-radius: 4px;
    cursor: pointer;
  }
  .userjs-preview-close {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 24px;
    height: 24px;
    line-height: 1;
    color: #fff;
    background-color: hsl(347.94deg 100% 60.98%);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
  }
  .userjs-preview-close:hover {
    background-color: hsl(347.94deg 100% 75.98%);
  }
  .userjs-preview-close::before {
    position: absolute;
    top: 50%;
    left: 50%;
    content: "";
    display: block;
    width: 16px;
    height: 16px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path fill="%23FFFFFF" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>');
    background-repeat: no-repeat;
    background-size: 16px 16px;
    transform: translate3d(-50%, -50%, 0);
  }
  .userjs-preview-title {
    display: flex;
    flex-direction: row;
    margin: 8px 0 16px;
    gap: 16px;
    padding: 16px;
    line-height: 1.6 !important;
    color: #ff3860 !important;
    background-color: #fff;
    border-radius: 4px;
  }
  .userjs-prompt {
    color: #888;
    border-left: 4px solid #888;
    padding: 0 0 0 16px;
  }
  .fat-settings button + p {
    margin-top: 16px;
  }
  </style>`;
  const settingsStyle = `<style id="fat-style">
  .fat-icon {
    position: fixed;
    right: 16px;
    bottom: 16px;
    padding: 8px;
    width: 24px;
    height: 24px;
    z-index: 9999;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgb(0 0 0 / 30%);
    cursor: pointer;
  }
  .fat-icon::before {
    display: block;
    width: 24px;
    height: 24px;
    content: "";
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='100px' height='100px'%3E%3Cpath d='M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: cover;
    transition: all 0.3s ease;
    transform: rotate(0deg);
  }
  .fat-icon:hover::before {
    transform: rotate(180deg);
  }
  .fat-settings {
    position: fixed;
    bottom: 72px;
    right: 16px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    max-width: 80%;
    width: calc(350px - 32px);
    height: fit-content;
    color: #202020;
    background-color: #fff;
    border-radius: 6px;
    transition: transform 0.3s ease;
    transform: translateX(400px);
    z-index: 10001;
  }
  .fat-settings p {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  .fat-settings button + p {
    margin-top: 16px;
  }
  .fat-settings p span {
    font-size: 13px;
  }
  .fat-settings textarea {
    margin-top: 8px;
    padding: 8px;
    height: 150px;
    max-height: 400px;
    min-height: 100px;
    line-height: 1.3;
    letter-spacing: 0.5px;
    font-weight: 400;
    font-family: Verdana;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
  }
  .fat-settings button {
    margin-top: 16px;
    padding: 8px 16px;
    width: fit-content;
    color: #fff;
    font-size: 13px;
    border: 0px;
    border-radius: 4px;
    background-color: #00d1b2;
    appearance: none;
    cursor: pointer;
  }
  .fat-settings button:hover {
    filter: saturate(130%);
  }
  .fat-settings button:active {
    filter: saturate(150%);
  }
  .fat-settings.is-visible {
    transform: translateX(0);
  }
  </style>`;
  if (!document.querySelector('#userjs-preview-style')) {
    document.head.insertAdjacentHTML('beforeend', addedStyle);
  }
  if (!document.querySelector('#fat-style')) {
    document.head.insertAdjacentHTML('beforeend', settingsStyle);
  }
  const getCloseFileName = async () => JSON.parse((await GM_getValue('closeFileName')) || '[]');
  const getMinSize = async () => {
    const defaultValue = '480';
    const storageValue = await GM_getValue('minSize');
    return storageValue || defaultValue;
  };
  const hasFutakuroElm = () => document.querySelector('#fvw_menu') !== null;
  // あぷ・あぷ小ファイルの文字列を見つけたらリンクに変換する（既にリンクになってたらスキップする）
  const createAnchorLink = (elms) => {
    const processNode = (node) => {
      const regex = /((?<!<a[^>]*>)(fu?)([0-9]{5,8})\.(jpe?g|png|webp|gif|bmp)(?![^<]*<\/a>))/g;
      if (node.nodeType === 3) {
        let textNode = node;
        // テキストノードの親要素がaタグである場合、処理をスキップ
        if (textNode.parentNode?.nodeName === 'A') {
          return;
        }
        let match;
        while ((match = regex.exec(textNode.data)) !== null) {
          const [fullMatch, _, type, digits, ext] = match;
          const url =
            type === 'fu'
              ? `//dec.2chan.net/up2/src/${type}${digits}.${ext}`
              : `//dec.2chan.net/up/src/${type}${digits}.${ext}`;
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.classList.add('is-createLink');
          anchor.dataset.from = 'userjs-preview';
          anchor.textContent = fullMatch;
          const nextTextNode = textNode.splitText(match.index);
          nextTextNode.data = nextTextNode.data.substring(fullMatch.length);
          textNode.parentNode.insertBefore(anchor, nextTextNode);
          textNode = nextTextNode;
        }
      } else if (node.nodeType !== 1 || node.tagName !== 'BR') {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach((childNode) => processNode(childNode));
      }
    };
    for (const el of elms) {
      processNode(el);
    }
  };
  const setFailedText = (linkElm) => {
    if (linkElm && linkElm instanceof HTMLAnchorElement) {
      linkElm.insertAdjacentHTML('afterend', '<span class="userjs-preview-title">データ取得失敗</span>');
    }
  };
  const getArrayBuffer = (path) => {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: path,
        responseType: 'blob',
        onload: ({ response }) => {
          return resolve(response);
        },
        onerror: (error) => {
          console.log(error);
        },
      });
    });
  };
  class FileReaderEx extends FileReader {
    constructor() {
      super();
    }
    #readAs(blob, ctx) {
      return new Promise((res, rej) => {
        super.addEventListener('load', ({ target }) => target?.result && res(target.result));
        super.addEventListener('error', ({ target }) => target?.error && rej(target.error));
        super[ctx](blob);
      });
    }
    readAsArrayBuffer(blob) {
      return this.#readAs(blob, 'readAsArrayBuffer');
    }
    readAsDataURL(blob) {
      return this.#readAs(blob, 'readAsDataURL');
    }
  }
  const getPromptData = async (div, img) => {
    const getGridPosition = ({ x, y }) => {
      const xPos = Math.round((x - 0.1) / 0.2);
      const yPos = Math.round((y - 0.1) / 0.2);
      const column = String.fromCharCode(65 + xPos);
      const row = yPos + 1;
      return `${column}${row}`;
    };
    const escapeHtml = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    const createV4Prompt = (v4_prompt) => {
      const charCaptions = v4_prompt?.caption?.char_captions;
      let text = escapeHtml(v4_prompt?.caption?.base_caption) || '';
      if (charCaptions) {
        text += '<br>';
        text += charCaptions.reduce((temp, data, idx) => {
          temp += `<strong>▼character prompt ${idx + 1}</strong><br>`;
          temp += escapeHtml(data.char_caption) + '<br>';
          if (data.centers && data.centers.length) {
            for (const center of data.centers) {
              temp += `<strong>position</strong><br>`;
              temp += `${getGridPosition(center)}<br>`;
            }
          }
          return temp;
        }, '');
      }
      return text;
    };
    const promptParser = (tags) => {
      const parse = JSON.parse(tags?.['Comment']?.value || '{}');
      if (Object.keys(parse).length === 0) {
        if (img.src.endsWith('.webp')) {
          const webpParseArray = tags?.['UserComment']?.value || [];
          const text = webpParseArray
            .filter((code) => code !== 0)
            .map((code) => String.fromCharCode(code))
            .join('');
          const match = text.match(/Comment: ({.+})/);
          if (match && JSON.parse(match[1])) {
            return JSON.parse(match[1]);
          }
        }
        return {};
      }
      return parse;
    };
    try {
      const isExifImageType = img.src.endsWith('.png') || img.src.endsWith('.webp');
      if (!isExifImageType || !window.ExifReader) return;
      const buffer = await getArrayBuffer(img.src);
      const data = await new FileReaderEx().readAsDataURL(buffer);
      const tags = await window.ExifReader.load(data);
      const parse = promptParser(tags);
      const { prompt, v4_prompt } = parse;
      if (!prompt && !v4_prompt) return;
      const p = document.createElement('p');
      let html = prompt;
      p.classList.add('userjs-prompt');
      if (v4_prompt) {
        html = createV4Prompt(v4_prompt);
      }
      if (prompt || v4_prompt) {
        p.innerHTML = html;
      } else {
        p.textContent = 'プロンプトがありません';
      }
      div.appendChild(p);
    } catch (error) {
      console.error(error);
    }
  };
  const wrapperClickHandler = (e) => {
    const self = e.currentTarget;
    if (self.classList.contains('is-caution')) {
      self.classList.remove('is-caution');
    }
  };
  const makeCloseButton = () => {
    const closeButtonElm = document.createElement('button');
    closeButtonElm.classList.add('userjs-preview-close');
    return closeButtonElm;
  };
  const setSetting = async () => {
    const delay = (time = 500) => new Promise((resolve) => setTimeout(() => resolve(true), time));
    const value = await getMinSize();
    const toggleSetting = () => {
      const settingElm = document.querySelector('[data-fat="settings"]');
      settingElm?.classList.toggle('is-visible');
    };
    const saveSetting = async () => {
      const minSizeElm = document.querySelector(`[data-fat="minSize"]`);
      if (!minSizeElm) return;
      const value = minSizeElm.value;
      if (value === '' || /^[0-9]+$/.test(value) === false) {
        alert('数値を入力してください');
        return;
      }
      await GM_setValue('minSize', value);
      const settingElm = document.querySelector('[data-fat="settings"]');
      settingElm?.classList.remove('is-visible');
      await delay(300);
      location.reload();
    };
    const iconHTML = `<div class="fat-icon" data-fat="icon"></div>`;
    const settingInnerHTML = `<p>デフォルトの画像サイズを指定、0で非表示</p>
    <input type="text" data-fat="minSize" value="${value}">
    <button type="button" data-fat="minSizeSave">条件を保存してリロード</button>`;
    const settingHTML = `<div class="fat-settings" data-fat="settings">
      ${settingInnerHTML}
    </div>`;
    await delay(1000);
    const hasFatIconElm = document.querySelector('[data-fat="icon"]') !== null;
    const fatSettingsElm = document.querySelector('[data-fat="settings"]');
    if (!hasFatIconElm) {
      document.body.insertAdjacentHTML('afterbegin', iconHTML);
      await delay(100);
      const settingIconElm = document.querySelector(`[data-fat="icon"]`);
      settingIconElm?.addEventListener('click', toggleSetting);
    }
    if (fatSettingsElm !== null) {
      fatSettingsElm.insertAdjacentHTML('beforeend', settingInnerHTML);
      await delay(100);
      const settingSaveElm = document.querySelector(`[data-fat="minSizeSave"]`);
      settingSaveElm?.addEventListener('click', saveSetting);
    } else {
      document.body.insertAdjacentHTML('afterbegin', settingHTML);
      await delay(100);
      const settingSaveElm = document.querySelector(`[data-fat="minSizeSave"]`);
      settingSaveElm?.addEventListener('click', saveSetting);
    }
  };
  const closeBtnEventHandler = async (e, div, fileName) => {
    e.stopPropagation();
    div.remove();
    const data = await getCloseFileName();
    if (!data.includes(fileName)) {
      data.push(fileName);
      GM_setValue('closeFileName', JSON.stringify(data));
    }
  };
  const setImageElm = async (linkElm) => {
    const imageMinSize = Number(await getMinSize());
    const imageMaxSize = 1024;
    const imageEventHandler = (e) => {
      const self = e.currentTarget;
      if (!(self instanceof HTMLImageElement)) return;
      const naturalWidth = self.naturalWidth;
      if (naturalWidth < imageMinSize) {
        self.width = self.width === naturalWidth ? imageMinSize : naturalWidth;
      } else if (self.width === imageMinSize) {
        self.width = naturalWidth > imageMaxSize ? naturalWidth : imageMaxSize;
      } else {
        self.width = imageMinSize;
      }
    };
    const fileName = (linkElm.textContent || '').trim();
    const closeFileName = await getCloseFileName();
    if (closeFileName.includes(fileName)) {
      return;
    }
    const resText = linkElm.closest('blockquote')?.textContent;
    const div = document.createElement('div');
    const innerDiv = document.createElement('div');
    div.classList.add('userjs-preview-imageWrap');
    innerDiv.classList.add('userjs-preview-inner');
    if (/注意|グロ/g.test(resText || '')) {
      innerDiv.classList.add('is-caution');
    }
    const img = document.createElement('img');
    const closeBtnElm = makeCloseButton();
    img.addEventListener('load', () => {
      if (img.naturalWidth < imageMinSize) {
        img.width = img.naturalWidth;
      }
      getPromptData(div, img);
    });
    img.addEventListener('error', () => setFailedText(linkElm));
    img.src = linkElm.href;
    img.width = imageMinSize;
    img.classList.add('userjs-preview-image');
    innerDiv.appendChild(img);
    innerDiv.appendChild(closeBtnElm);
    div.appendChild(innerDiv);
    img.addEventListener('click', imageEventHandler);
    innerDiv.addEventListener('click', wrapperClickHandler);
    closeBtnElm.addEventListener('click', (e) => closeBtnEventHandler(e, div, fileName));
    linkElm.insertAdjacentElement('afterend', div);
    return img;
  };
  const setLoading = async (linkElm) => {
    const parentElm = linkElm.parentElement;
    if (parentElm instanceof HTMLFontElement) {
      return;
    }
    linkElm.classList.add('userjs-preview-link');
  };
  const removeLoading = (targetElm) => targetElm.classList.remove('userjs-preview-link');
  // ふたクロで「新着レスに自動スクロール」にチェックが入っている場合画像差し込み後に下までスクロールさせる
  const scrollIfAutoScrollIsEnabled = () => {
    const checkboxElm = document.querySelector('#autolive_scroll');
    const readmoreElm = document.querySelector('#res_menu');
    if (checkboxElm === null || readmoreElm === null || !checkboxElm?.checked) {
      return;
    }
    const elementHeight = readmoreElm.offsetHeight;
    const viewportHeight = window.innerHeight;
    const offsetTop = readmoreElm.offsetTop;
    window.scrollTo({
      top: offsetTop - viewportHeight + elementHeight,
      behavior: 'smooth',
    });
  };
  const setResNumber = (linkElm, fileName) => {
    const tdElm = linkElm.closest('td.rtd');
    const resNumber = tdElm?.querySelector('.rsc');
    if (resNumber && resNumber.textContent) {
      const num = Number(resNumber.textContent);
      const storage = resNumberStorage[num];
      if (Number.isInteger(num) && fileName) {
        if (typeof storage === 'undefined') {
          resNumberStorage[num] = [fileName];
        } else if (Array.isArray(storage) && !storage.includes(fileName)) {
          storage.push(fileName);
        }
      }
    }
  };
  const isFindFileNameFromStorage = (fileName) =>
    Object.keys(resNumberStorage).some((key) => {
      const arr = resNumberStorage?.[Number(key)];
      return arr && fileName && arr.includes(fileName);
    });
  const insertURLData = async (linkElm, match) => {
    const [, , , fileName] = match;
    const imageElm = await setImageElm(linkElm);
    if (imageElm instanceof HTMLImageElement) {
      linkElm.classList.add('is-intersecting');
      setResNumber(linkElm, fileName);
      imageElm.onload = () => scrollIfAutoScrollIsEnabled();
    }
    removeLoading(linkElm);
  };
  const linkRegExp =
    /((tsumanne\.net\/si\/data|\w+\.2chan\.net\/up[0-9]?\/src)\/)?(fu?[0-9]{5,8}\.(jpe?g|png|gif|webp|bmp))/;
  class LinkObserver {
    targetLink;
    isObserving;
    matchLink;
    options;
    constructor(targetLink) {
      this.targetLink = targetLink;
      this.isObserving = this.targetLink.classList.contains('is-observing');
      this.matchLink = this.targetLink.href.match(linkRegExp);
      this.options = {
        rootMargin: '800px 0px 0px 0px',
      };
    }
    observer() {
      return new IntersectionObserver(async ([entry], observer) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          const linkElm = entry.target;
          if (this.matchLink && linkElm instanceof HTMLAnchorElement) {
            await setLoading(linkElm);
            if (linkElm.classList.contains('userjs-preview-link')) {
              await insertURLData(linkElm, this.matchLink);
            }
          }
        }
      }, this.options);
    }
    check() {
      if (this.matchLink === null) {
        return false;
      }
      const isQuoteText = this.targetLink.closest('font[color="#789922"]') !== null;
      const [, , , fileName] = this.matchLink;
      if (isQuoteText || isFindFileNameFromStorage(fileName)) {
        return false;
      }
      return true;
    }
    init() {
      const isCheckOK = this.check();
      if (isCheckOK && !this.isObserving && this.matchLink) {
        this.targetLink.classList.add('is-observing');
        this.observer().observe(this.targetLink);
      }
    }
  }
  const getLinkElm = (threElm) => {
    const linkElms = threElm.querySelectorAll('a[href*="2chan.net/up"], a[href^="f"]');
    if (linkElms.length) {
      return linkElms;
    }
    return [];
  };
  const deleteDuplicate = (blockquoteElms) => {
    for (const blockquoteElm of blockquoteElms) {
      const anchorElms = blockquoteElm.querySelectorAll('a[data-orig]');
      for (const anchorElm of anchorElms) {
        const newAnchorElm = anchorElm.querySelector('a[data-from]');
        if (newAnchorElm !== null) {
          anchorElm.outerHTML = newAnchorElm.outerHTML;
        }
      }
    }
  };
  const setLinkObserver = (linkElms) => {
    for (const linkElm of linkElms) {
      if (linkElm instanceof HTMLAnchorElement) {
        const linkObserver = new LinkObserver(linkElm);
        linkObserver.init();
      }
    }
  };
  const mutationLinkElements = async (mutations) => {
    const futakuroState = hasFutakuroElm();
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (!(addedNode instanceof HTMLElement)) continue;
        const newBlockQuotes = addedNode.querySelectorAll('blockquote');
        if (!futakuroState) {
          createAnchorLink(newBlockQuotes);
          deleteDuplicate(newBlockQuotes);
        }
        for (const newBlockQuote of newBlockQuotes) {
          const linkElms = newBlockQuote.querySelectorAll('a');
          if (linkElms.length) {
            setLinkObserver(linkElms);
          }
        }
      }
    }
  };
  // ふたクロが無い環境用にアンカーリンクを生成したい
  const exec = () => {
    const threadElm = document.querySelector('.thre');
    const isTsumanne = location.hostname === 'tsumanne.net';
    const isFutakuro = location.hostname === 'kako.futakuro.com';
    if (!isTsumanne && !isFutakuro && !hasFutakuroElm() && !initExecCreateLink && threadElm instanceof HTMLElement) {
      const quoteElms = threadElm.querySelectorAll('blockquote');
      initExecCreateLink = true;
      if (initTimer) {
        clearTimeout(initTimer);
      }
      createAnchorLink(quoteElms);
      for (const quoteElm of quoteElms) {
        const linkElms = quoteElm.querySelectorAll('.is-createLink');
        setLinkObserver(linkElms);
      }
    }
  };
  const threadElm = document.querySelector('.thre');
  if (threadElm instanceof HTMLElement) {
    setSetting();
    const linkElms = getLinkElm(threadElm);
    setLinkObserver(linkElms);
    const observer = new MutationObserver(mutationLinkElements);
    observer.observe(threadElm, {
      childList: true,
      subtree: true,
    });
    initTimer = setTimeout(exec, 1500);
  }
})();
