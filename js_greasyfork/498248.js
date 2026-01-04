// ==UserScript==
// @name        追放论坛奇技淫巧
// @namespace   Violentmonkey Scripts
// @icon        https://gf2-cn.cdn.sunborngame.com/website/official/web_head.jpg
// @match       https://gf2-bbs.sunborngame.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @require     https://gcore.jsdelivr.net/gh/gudzpoz/spotlight@b6a20cfb946955be05c514619ff93a7884e7f583/dist/spotlight.bundle.js
// @license     MIT
// @version     1.4.0
// @author      gudzpoz
// @description 另外能不能不要再在追放论坛发一代剧透了……
// @downloadURL https://update.greasyfork.org/scripts/498248/%E8%BF%BD%E6%94%BE%E8%AE%BA%E5%9D%9B%E5%A5%87%E6%8A%80%E6%B7%AB%E5%B7%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/498248/%E8%BF%BD%E6%94%BE%E8%AE%BA%E5%9D%9B%E5%A5%87%E6%8A%80%E6%B7%AB%E5%B7%A7.meta.js
// ==/UserScript==

/// ================
/// 这部分是屏蔽功能
/// ================

/** @type {string[]} */
let blockList = JSON.parse(GM_getValue('blocked_users', '[]'));
const blockSet = new Set(blockList);
let keywordList = JSON.parse(GM_getValue('blocked_words', '[]'));

function updateBlockList() {
  blockList = Array.from(blockSet);
  GM_setValue('blocked_users', JSON.stringify(blockList));
  update();
}

function updateKeywordList() {
  GM_setValue('blocked_words', JSON.stringify(keywordList));
  update();
}

/**
 * @param {HTMLElement} item
 * @param {string} nameSelector
 * @returns {string|null}
 */
function getText(item, nameSelector) {
  /** @type {HTMLElement} */
  const nameDiv = item.querySelector(nameSelector);
  const nameNode = nameDiv.childNodes[0];
  if (nameNode.nodeType === Node.TEXT_NODE) {
    return nameNode.textContent.trim();
  }
  return null;
}

/**
 * @param {string} text
 * @returns {string | undefined}
 */
function isContentBlocked(text) {
  return keywordList.find((kwd) => text.includes(kwd));
}

let blockTimestamp = 0;

/**
 * @param {string} nameSelector
 * @returns {(item: HTMLElement) => void}
 */
function getBlockHandler(nameSelector) {
  /** @type {(item: HTMLElement) => void} */
  return (item) => {
    const name = getText(item, nameSelector);
    if (name && blockSet.has(name.trim())) {
      if (item.style.display !== 'none') {
        console.log(`${nameSelector}: 屏蔽用户“${name}”`);
        item.style.display = 'none';
        item.dataset.bts = `${blockTimestamp}`;
      }
      return;
    }
    if (item.style.display === 'none') {
      if (Number(item.dataset.bts) !== blockTimestamp) {
        item.style.display = '';
      }
    }
  };
}

GM_addStyle(`.block-hint {
  font-size: 0.8em;
  text-align: center;
}`);


/**
 * @param {string} contentSelector
 * @returns {(item: HTMLElement) => void}
 */
function getKeywordHanlder(contentSelector) {
  /** @type {(item: HTMLElement) => void} */
  return (item) => {
    /** @type {HTMLElement | null} */
    const content = item.querySelector(contentSelector);
    const blocked = content && isContentBlocked(content.innerText);
    if (blocked) {
      if (item.style.display !== 'none') {
        console.log(`${contentSelector}: 屏蔽关键词“${blocked}”`);
        item.style.display = 'none';
        item.dataset.bts = `${blockTimestamp}`;
        if (!item.previousElementSibling?.classList.contains('block-hint')) {
          const div = document.createElement('div');
          div.classList.add('block-hint');
          div.innerText = '已屏蔽';
          div.onclick = () => {
            item.style.display = item.style.display === 'none' ? '' : 'none';
          };
          item.parentElement.insertBefore(div, item);
        }
      }
      return;
    }
    if (item.style.display === 'none') {
      if (Number(item.dataset.bts) !== blockTimestamp) {
        item.style.display = '';
      }
    }
  };
}

function addBlockButton() {
  if (document.location.pathname.startsWith('/user')) {
    if (document.getElementById('userscript_block_button')) {
      return;
    }
    const button = document.createElement('button');
    button.id = 'userscript_block_button';
    button.textContent = '屏蔽用户';
    button.addEventListener('click', () => {
      const name = getText(document.body, '.mine_box > p');
      if (!name) {
        return;
      }
      if (confirm(`确定要屏蔽用户“${name}”吗？
请注意用户改名之后屏蔽即失效。请在设置页面查看目前的屏蔽列表。`) === false) {
        return;
      }
      blockSet.add(name.trim());
      updateBlockList();
      alert(`已屏蔽用户“${name}”`);
    });
    const destination = document.querySelector('.mine_box_id');
    if (destination) {
      destination.appendChild(button);
    }
  }
}

function addBlockListTextarea() {
  const parent = document.querySelector('.content');
  if (!parent || !document.location.pathname.startsWith('/set')) {
    return;
  }
  /** @type {[string, string, string, () => string[], (textarea: HTMLTextAreaElement) => void][]} */
  const textareaConfigs = [
    [
      'userscript_block_list', '屏蔽用户名列表：', '输入用户名，一行一个',
      () => blockList, (textarea) => {
        blockSet.clear();
        textarea.value.split('\n').map(s => s.trim()).filter(s => s).forEach(s => blockSet.add(s));
        updateBlockList();
      },
    ],
    [
      'userscript_keyword_list', '屏蔽词列表：', '输入屏蔽词，一行一个',
      () => keywordList, (textarea) => {
        keywordList = textarea.value.split('\n').map(s => s.trim()).filter(s => s);
        updateKeywordList();
      },
    ],
  ];
  textareaConfigs.forEach(([id, title, placeholder, list, listener]) => {
    if (document.getElementById(id)) {
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.placeholder = placeholder;
    textarea.addEventListener('change', () => listener(textarea));
    textarea.value = list().join('\n');
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(title));
    div.appendChild(textarea);
    parent.appendChild(div);
  });
}

/// ================
/// 这部分是图片缩放
/// ================

GM_addStyle(`.card_item.spotlight-group .card_m .img_box {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.img_box > div.spotlight {
  background-color: gray;
  background: repeating-conic-gradient(#ccc 0% 25%, #eee 0% 50%) 50% / 24px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.img_box > div.spotlight > img {
  display: block;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
}`);
/**
 * @param {HTMLImageElement} img
 */
function addLightboxForImage(img) {
  const parent = img.parentElement;
  parent.dataset.src = img.src;
  parent.classList.add('spotlight');
}
/**
 * @param {NodeList} images
 */
function addLightboxForImages(images) {
  /** @type {HTMLElement[]} */
  const multipleImageParents = [];
  images.forEach((img) => {
    const parent = img.parentElement;
    const enclosing = parent.closest('.card_item');
    if (enclosing) {
      enclosing.classList.add('spotlight-group');
    }
    if (!parent.dataset.src) {
      if (parent.querySelectorAll('& > img').length === 1) {
        addLightboxForImage(img);
        return;
      }
      multipleImageParents.push(parent);
    }
  });
  multipleImageParents.forEach((parent) => {
    Array.from(parent.children).forEach((img) => {
      if (img.tagName.toUpperCase() !== 'IMG') {
        return;
      }
      const div = document.createElement('div');
      img.replaceWith(div);
      div.appendChild(img);
      addLightboxForImage(img);
    });
  });
}
function addLightbox() {
  const img = document.querySelector('.showBigImg');
  if (img) {
    addLightboxForImage(img);
  }
  addLightboxForImages(document.querySelectorAll('.img_box > div > img'));
  addLightboxForImages(document.querySelectorAll('img.showImg'));
}

/// ================
/// 这部分是通知跳转
/// ================

// 目前只是基于评论的时间找到一模一样的时间位点来跳转，所以楼中楼暂时没办法
const jumpingTo = {
  commentTimestamp: new Date(),
  at: 0,
};
function addMessageClickListeners() {
  const messages = document.querySelectorAll('.message .me_con');
  messages.forEach((comment) => {
    const parent = comment.closest('.message_item');
    if (!parent) {
      return;
    }
    if (parent.dataset.listening) {
      return;
    }
    parent.dataset.listening = 'true';
    parent.addEventListener('click', (e) => {
      /** @type {HTMLElement} */
      const p = parent.querySelector('& > p');
      if (p) {
        jumpingTo.commentTimestamp = new Date(p.innerText.trim());
        if (!isNaN(jumpingTo.commentTimestamp.getTime())) {
          jumpingTo.at = Date.now();
        }
      }
    });
  });
  if (messages.length === 0) {
    if (Date.now() - jumpingTo.at >= 3000) {
      return;
    }
    const commentDates = document.querySelectorAll('.card_item .card_tm p span');
    let found = false;
    let overscrolled = false;
    commentDates.forEach((date) => {
      const time = new Date(date.innerText.trim()).getTime();
      if (isNaN(time)) {
        return;
      }
      if (time < jumpingTo.commentTimestamp.getTime()) {
        overscrolled = true;
        return;
      }
      if (time !== jumpingTo.commentTimestamp.getTime()) {
        return;
      }
      const parent = date.closest('.card_item');
      parent.scrollIntoView();
      found = true;
      jumpingTo.at = 0;
      parent.style.backgroundColor = 'yellow';
      parent.style.transition = 'all 1s';
      setTimeout(() => {
        parent.style.backgroundColor = '';
      }, 2000);
    });
    if (!found && !overscrolled) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
}


/// ================
/// 这部分是自动签到
/// ================

function semiAutomaticCheckIn() {
  // 小红点更新会有延迟，等页面稳定再确认小红点的状况
  setTimeout(() => {
    /** @type {HTMLElement} */
    const redDot = document.querySelector('span.point');
    if (redDot) {
      const message = redDot.parentElement.querySelector('p');
      if (message.innerText.trim() === '签到') {
        redDot.click();
      }
    }
  }, 500);
}

/// ================
/// 这部分是页面监听
/// ================

const blockTimelineItems = getBlockHandler('.card_t > .card_tm > div');
const blockReplies = getBlockHandler('.card_t > .card_tm > div');
const blockNestedReplies = getBlockHandler('.card_con_reply_r > p > i');
const blockRecommended = getBlockHandler('& > p');

function update() {
  blockTimestamp += 1;

  const timelineItems = document.querySelectorAll('.index_con .card_item');
  timelineItems.forEach(getBlockHandler('.card_t > .card_tm > div'));
  timelineItems.forEach(getKeywordHanlder('.card_m'));

  const replyItems = document.querySelectorAll('.content .card_item');
  replyItems.forEach(getBlockHandler('.card_t > .card_tm > div'));
  replyItems.forEach(getKeywordHanlder('.card_con > .card_con_text'));
  replyItems.forEach(getKeywordHanlder('.card_m'));
  replyItems.forEach(getKeywordHanlder('.card_m1'));

  const nestedItems = document.querySelectorAll('.content .card_con_reply');
  nestedItems.forEach(getBlockHandler('.card_con_reply_r > p > i'));
  nestedItems.forEach(getKeywordHanlder('.card_con_reply > .card_con_reply_con'));

  const recommendedItems = document.querySelectorAll('.index_con > .list_wrap > ul > li');
  recommendedItems.forEach(getBlockHandler('& > p'));

  addBlockButton();
  addBlockListTextarea();

  addLightbox();

  addMessageClickListeners();

  semiAutomaticCheckIn();
}

/**
 * @param {() => void} fn
 * @param {number} delay
 * @returns {() => void}
 */
function debounce(fn, delay) {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    } else {
      fn.apply(context, args);
    }
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

(function() {
  update();
  const observer = new MutationObserver(debounce(update, 100));
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
})();
