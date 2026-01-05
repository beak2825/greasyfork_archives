// ==UserScript==
// @name        Juick tweaks
// @namespace   ForJuickCom
// @description Feature testing
// @match       *://juick.com/*
// @author      Killy
// @version     2.21.2
// @date        2016.09.02 - 2022.08.18
// @license     MIT
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_info
// @connect     api.juick.com
// @connect     twitter.com
// @connect     bandcamp.com
// @connect     mixcloud.com
// @connect     flickr.com
// @connect     flic.kr
// @connect     deviantart.com
// @connect     slideshare.net
// @connect     gist.github.com
// @connect     codepen.io
// @connect     arxiv.org
// @connect     pixiv.net
// @connect     konachan.net
// @connect     yande.re
// @connect     gelbooru.com
// @connect     safebooru.org
// @connect     danbooru.donmai.us
// @connect     safebooru.donmai.us
// @connect     anime-pictures.net
// @connect     api.imgur.com
// @connect     tumblr.com
// @connect     reddit.com
// @connect     wordpress.com
// @connect     lenta.ru
// @connect     meduza.io
// @connect     rbc.ru
// @connect     tjournal.ru
// @connect     *.newsru.com
// @connect     *.itar-tass.com
// @connect     tass.ru
// @connect     rublacklist.net
// @connect     mk.ru
// @connect     gazeta.ru
// @connect     republic.ru
// @connect     bash.im
// @connect     ixbt.com
// @connect     techxplore.com
// @connect     medicalxpress.com
// @connect     phys.org
// @connect     techcrunch.com
// @connect     bbc.com
// @connect     nplus1.ru
// @connect     elementy.ru
// @connect     news.tut.by
// @connect     pikabu.ru
// @connect     imdb.com
// @connect     mastodon.social
// @connect     mastodonsocial.ru
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/22830/Juick%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/22830/Juick%20tweaks.meta.js
// ==/UserScript==


// #region === Pages and elements ===========================================================================

const content = document.getElementById('content');
const isPost = content && content.hasAttribute('data-mid');
const isFeed = document.querySelectorAll('#content article[data-mid]').length > 0;
const isCommonFeed = /^(?:https?:)?\/\/[a-z0-9.:]+\/(?:$|tag|#post|\?.*show=(?:all|photos))/i.test(window.location.href);
const isAll = /\bshow=all\b/i.test(window.location.search);
const isNewPostPage = window.location.pathname.endsWith('/post') && document.querySelector('textarea.newmessage');
const isTagsPage = window.location.pathname.endsWith('/tags');
const isSettingsPage = window.location.pathname.endsWith('/settings');
const isUserColumn = !!(document.querySelector('aside#column div#ustats'));
const isUsersTable = !!(document.querySelector('#content > div.users'));
const hasContentArticle = !!(document.querySelector('#content article'));

// #endregion


// #region === Userscript features ==========================================================================

addStyle();

const userscriptFeatures = [
  {
    name: 'Форма нового сообщения в ленте (как старый /#post)',
    id: 'enable_post_sharp',
    enabledByDefault: true,
    pageMatch: (isFeed && isUserColumn) || isAll,
    fun: addPostSharpFormUser
  },
  {
    name: 'Сортировка и цветовое кодирование тегов на странице нового поста (/post)',
    id: 'enable_tags_on_new_post_page',
    enabledByDefault: true,
    pageMatch: isNewPostPage,
    fun: easyTagsUnderNewMessageForm
  },
  {
    name: 'Сортировка и цветовое кодирование тегов на странице /user/tags',
    id: 'enable_tags_page_coloring',
    enabledByDefault: true,
    pageMatch: isTagsPage,
    fun: sortTagsPage
  },
  {
    name: 'Min-width для тегов',
    id: 'enable_tags_min_width',
    enabledByDefault: true
  },
  {
    name: 'Копирование ссылок на посты/комментарии',
    id: 'enable_comment_share_menu',
    enabledByDefault: true,
    pageMatch: isPost,
    fun: addCommentShareMenu
  },
  {
    name: 'Ссылки для удаления комментариев',
    id: 'enable_comment_removal_links',
    enabledByDefault: true,
    pageMatch: isPost,
    fun: addCommentRemovalLinks
  },
  {
    name: 'Ссылка для редактирования тегов поста',
    id: 'enable_tags_editing_link',
    enabledByDefault: true,
    pageMatch: isPost,
    fun: addTagEditingLinkUnderPost
  },
  {
    name: 'Большая аватарка в левой колонке',
    id: 'enable_big_avatar',
    enabledByDefault: true,
    pageMatch: isUserColumn,
    fun: biggerAvatar
  },
  {
    name: 'Ссылки для перехода к постам пользователя за определённый год',
    id: 'enable_year_links',
    enabledByDefault: true,
    pageMatch: isUserColumn,
    fun: addYearLinks
  },
  {
    name: 'Сортировка подписок/подписчиков по дате последнего сообщения',
    id: 'enable_users_sorting',
    enabledByDefault: true,
    pageMatch: isUsersTable,
    fun: addUsersSortingButton
  },
  {
    name: 'Статистика рекомендаций',
    id: 'enable_irecommend',
    enabledByDefault: true,
    pageMatch: isUserColumn,
    fun: addIRecommendLink
  },
  {
    name: 'Упоминания (ссылка на поиск)',
    id: 'enable_mentions_search',
    enabledByDefault: true,
    pageMatch: isUserColumn,
    fun: addMentionsLink
  },
  {
    name: 'Посты и комментарии, на которые нельзя ответить, — более бледные',
    id: 'enable_unrepliable_styling',
    enabledByDefault: true,
    pageMatch: isPost || isFeed,
    fun: () => { if (isPost) { checkReplyPost(); } else { checkReplyArticles(); } }
  },
  {
    name: 'Для readonly поста отображать виртуальный тег (только на странице поста)',
    id: 'enable_mark_readonly_post',
    enabledByDefault: true,
    pageMatch: isPost,
    fun: markReadonlyPost
  },
  {
    name: 'Показывать комментарии при наведении на ссылку "в ответ на /x"',
    id: 'enable_move_comment_into_view',
    enabledByDefault: true,
    pageMatch: isPost,
    fun: bringCommentsIntoViewOnHover
  },
  {
    name: 'Стрелочки ("↓")',
    id: 'enable_arrows',
    enabledByDefault: true
  },
  {
    name: 'Take care of NSFW tagged posts in feed',
    id: 'enable_mark_nsfw_posts_in_feed',
    enabledByDefault: true,
    pageMatch: isFeed,
    fun: markNsfwPostsInFeed
  },
  {
    name: 'Сбросить стили для тега *code. Уменьшить шрифт взамен',
    id: 'unset_code_style',
    enabledByDefault: false
  },
  {
    name: 'Сворачивать длинные посты',
    id: 'enable_long_message_folding',
    enabledByDefault: true,
    pageMatch: isFeed,
    fun: limitArticlesHeight
  },
  {
    id: 'filter_comments_too', // not in the main feature list
    enabledByDefault: false,
    pageMatch: isPost,
    fun: filterPostComments
  },
  {
    pageMatch: isPost,
    fun: embedLinksToPost
  },
  {
    pageMatch: isFeed,
    fun: embedLinksToArticles
  },
  {
    pageMatch: isFeed && isCommonFeed,
    fun: filterArticles
  },
  {
    pageMatch: isSettingsPage,
    fun: addTweaksSettingsButton
  },
  {
    pageMatch: hasContentArticle,
    fun: addTweaksSettingsFooterLink
  }
];

userscriptFeatures.forEach(feature => {
  let runnable = feature.pageMatch && !!feature.fun;
  let enabled = !feature.id || GM_getValue(feature.id, feature.enabledByDefault);
  if (runnable && enabled) {
    try { feature.fun(); } catch (e) {
      console.warn(`Failed to run ${feature.fun.name}()`);
      console.warn(e);
    }
  }
});

// #endregion


// #region === Helpers ======================================================================================

Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));

String.prototype.count = function(s1) {
  return (this.length - this.replace(new RegExp(s1, 'g'), '').length) / s1.length;
};

Number.prototype.pad = function(size=2) {
  let s = String(this);
  while (s.length < size) { s = '0' + s; }
  return s;
};

function longest(arr) {
  return arr.reduce((a,b) => (!a) ? b : (!b || a.length > b.length) ? a : b);
}

function intersect(a, b) {
  if (a.length > b.length) { [a, b] = [b, a]; } // filter shorter array
  return a.filter(item => (b.indexOf(item) !== -1));
}

function fitToBounds(w, h, maxW, maxH) {
  let r = h / w;
  let w1 = ((h > maxH) ? maxH : h) / r;
  let w2 = ((w1 > maxW) ? maxW : w1);
  let h2 = w2 * r;
  return { w: w2, h: h2 };
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function setContent(containerNode, ...newNodes) {
  removeAllFrom(containerNode);
  newNodes.forEach(n => containerNode.appendChild(n));
  return containerNode;
}

function removeAllFrom(fromNode) {
  for (let c; c = fromNode.lastChild; ) { fromNode.removeChild(c); }
}

function parseRgbColor(colorStr, fallback=[0,0,0]){
  let [, r, g, b] = colorStr.replace(/ /g, '').match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i) || [, ...fallback];
  return [ +r, +g, +b ];
}

function getAllMatchesAndCaptureGroups(re, str) {
  let results = [], result;
  while ((result = re.exec(str)) !== null) { results.push(Array.from(result)); }
  return results;
}

function htmlDecode(str) {
  let doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.documentElement.textContent;
}

function htmlEscape(html) {
  let textarea = document.createElement('textarea');
  textarea.textContent = html;
  return textarea.innerHTML;
}

function escapeRegExp(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function naiveEllipsis(str, len, ellStr='...') {
  let ellLen = ellStr.length;
  if (str.length <= len) { return str; }
  let half = Math.floor((len - ellLen) / 2);
  let left = str.substring(0, half);
  let right = str.substring(str.length - (len - half - ellLen));
  return '' + left + ellStr + right;
}

function naiveEllipsisRight(str, len, ellStr='...') {
  let ellLen = ellStr.length;
  return (str.length <= len) ? str : str.substring(0, len - ellLen) + ellStr;
}

function wrapIntoTag(node, tagName, className=undefined) {
  let tag = document.createElement(tagName);
  if (className) { tag.className = className; }
  tag.appendChild(node);
  return tag;
}

function randomId() {
  return Math.random().toString(36).substr(2);
}

function matchWildcard(str, wildcard) {
  let ww = wildcard.split('*');
  let startFrom = 0;
  for (let i = 0; i < ww.length; i++) {
    let w = ww[i];
    if (w == '') { continue; }
    let wloc = str.indexOf(w, startFrom);
    if (wloc == -1) { return false; }
    let wend = wloc + w.length;
    let headCondition = (i > 0) || (wloc == 0);
    let tailCondition = (i < ww.length - 1) || ((i > 0) ? str.endsWith(w) : (str.substr(wloc) == w));
    if (!headCondition || !tailCondition) { return false; }
    startFrom = wend;
  }
  return true;
}

// rules :: [{pr: number, re: RegExp, with: string}]
// rules :: [{pr: number, re: RegExp, with: Function}]
// rules :: [{pr: number, re: RegExp, brackets: true, with: [string, string]}]
// rules :: [{pr: number, re: RegExp, brackets: true, with: [string, string, Function]}]
function formatText(txt, rules) {
  let idCounter = 0;
  function nextId() { return idCounter++; }
  function ft(txt, rules) {
    let matches = rules.map(r => { r.re.lastIndex = 0; return [r, r.re.exec(txt)]; })
                       .filter(([,m]) => m !== null)
                       .sort(([r1,m1],[r2,m2]) => (r1.pr - r2.pr) || (m1.index - m2.index));
    if (matches && matches.length > 0) {
      let [rule, match] = matches[0];
      let subsequentRules = rules.filter(r => r.pr >= rule.pr);
      let idStr = `<>(${nextId()})<>`;
      let outerStr = txt.substring(0, match.index) + idStr + txt.substring(rule.re.lastIndex);
      let innerStr = (rule.brackets)
        ? (() => { let [l ,r ,f] = rule.with; return l + ft((f ? f(match[1]) : match[1]), subsequentRules) + r; })()
        : match[0].replace(rule.re, rule.with);
      return ft(outerStr, subsequentRules).replace(idStr, innerStr);
    }
    return txt;
  }
  return ft(htmlEscape(txt), rules); // idStr above relies on the fact the text is escaped
}

function getProto() {
  return (location.protocol == 'http:') ? 'http:' : 'https:';
}

function setProto(url, proto) {
  return url.replace(
    /^(https?:)?(?=\/\/)/i,
    proto ? proto : getProto()
  );
}

function unsetProto(url) {
  return url.replace(/^(https?:)?(?=\/\/)/i, '');
}

function fixWwwLink(url) {
  return url.replace(/^(?!([a-z]+:)?\/\/)/i, '//');
}

function waitAndRunAsync(test, count, tick=100, successCallback, failCallback) {
  return new Promise((resolve, reject) => {
    function r(c){
      if (test()) { resolve(successCallback()); } else {
        if (c && (c > 0)) {
          setTimeout(() => r(c-1), tick);
        } else {
          reject(failCallback());
        }
      }
    }
    r(count);
  });
}

// predicates :: [{ msg: Response -> string, test: Response -> bool, permanent: Response -> bool }]
function xhrGetAsync(url, timeout=3000, predicates=undefined, method='GET') {
  predicates = predicates || [
    {
      msg: response => (response.statusText ? `${response.status} - ${response.statusText}` : `${response.status}`),
      test: response => response.status != 200,
      permanent: response => !([408, 500, 503].includes(response.status))
    }
  ];
  return new Promise(function(resolve, reject) {
    GM_xmlhttpRequest({
      method: method,
      url: url,
      timeout: timeout,
      onload: function(response) {
        let match = predicates && predicates.find(p => p.test(response));
        if (!match) {
          resolve(response);
        } else {
          reject({
            reason: match.msg(response),
            response: response,
            permanent: (match.permanent) ? match.permanent(response) : false,
            url: url
          });
        }
      },
      ontimeout: function(response) { reject({ reason: 'timeout', response: response, permanent: false, url: url }); },
      onerror: function(response) { reject({ reason: 'unknown error', response: response, permanent: false, url: url }); }
    });
  });
}

function xhrFirstResponse(urls, timeout) {
  return urls.reduce(
    (p, url) => p.catch(e => xhrGetAsync(url, timeout)),
    Promise.reject({reason: 'init'})
  );
}

function computeStyle(newElement) {
  if (document.body.contains(newElement)) {
    return getComputedStyle(newElement);
  }
  document.body.appendChild(newElement);
  let style = getComputedStyle(newElement);
  setTimeout(function() {
    document.body.removeChild(newElement);
  }, 1); // let getComputedStyle to do the job
  return style;
}

function autosize(el) {
  let offset = (!window.opera)
    ? (el.offsetHeight - el.clientHeight)
    : (el.offsetHeight + parseInt(window.getComputedStyle(el, null).getPropertyValue('border-top-width')));
  let resize = function (el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight + offset) + 'px';
  };
  el.addEventListener('input', () => resize(el));
}

function selectAndCopyElementContents(el, deselect=false) {
  if (window.getSelection && document.createRange) {
    let range = document.createRange();
    range.selectNodeContents(el);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try {
      let successful = document.execCommand('copy');
      if (!successful) { console.log('Copy command is not available or not enabled.'); }
      if (deselect) { sel.removeAllRanges(); }
      return successful;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  return false;
}

function keyboardClickable(el) {
  el.addEventListener('keydown', e => {
    if ((e.which === 13) || (e.which === 32)) { // 13 = Return, 32 = Space
      e.preventDefault();
      el.click();
    }
  });
}

function onClickOutsideOnce(element, callback) {
  const outsideClickListener = event => {
    if (!element.contains(event.target)) {
      callback();
      removeClickListener();
    }
  };
  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener);
  };
  document.addEventListener('click', outsideClickListener);
}

// #endregion


// #region === Function definitions =========================================================================

function svgIconHtml(name) {
  return /*html*/`<div class="icon icon--ei-${name} icon--s"><svg class="icon__cnt"><use xlink:href="/sprite.svg#ei-${name}-icon"></use></svg></div>`;
}

function getMyAccountAsync() {
  if (getMyAccountAsync[0]) {
    return Promise.resolve(getMyAccountAsync[0]);
  } else {
    let hash = document.body.getAttribute('data-hash');
    if (!hash) { return Promise.reject('not logged in'); }
    return xhrGetAsync(setProto('//api.juick.com/me?hash=' + hash)).then(response => {
      let account = JSON.parse(response.responseText);
      getMyAccountAsync[0] = account;
      return account;
    });
  }
}

function getMyUserNameAsync() {
  return getMyAccountAsync().then(account => account.uname);
}

function getColumnUserName() {
  let columnUserIdLink = document.querySelector('#column #ctitle > a');
  if (columnUserIdLink) { return columnUserIdLink.textContent.trim(); }
  let headerUserIdLink = document.querySelector('#header #ctitle > a');
  if (headerUserIdLink) { return headerUserIdLink.textContent.trim(); }
  return null;
}

function getColumnUid() {
  let columnAvatar = document.querySelector('#column #ctitle > a > img');
  if (columnAvatar) { return columnAvatar.src.match(/\/i\/a\/(\d+)-[0-9a-fA-F]+\./i)[1]; }
  let headerAvatar = document.querySelector('#header #ctitle > a > img');
  if (headerAvatar) { return headerAvatar.src.match(/\/i\/a\/(\d+)-[0-9a-fA-F]+\./i)[1]; }
  return null;
}

function getPostUserName(element) {
  let avatar = element.querySelector('div.msg-avatar > a > img');
  return (avatar) ? avatar.alt : null;
}

function getPostUid(element) {
  let avatar = element.querySelector('div.msg-avatar > a > img');
  return (avatar) ? avatar.src.match(/\/i\/a\/(\d+)-[0-9a-fA-F]+\./i)[1] : null;
}

function markNsfwPostsInFeed() {
  [].forEach.call(document.querySelectorAll('#content article[data-mid]'), function(article) {
    let tagsDiv = article.querySelector('.msg-tags');
    let isNsfw = tagsDiv && Array.from(tagsDiv.children).some(t => t.textContent.toUpperCase() == 'NSFW');
    if (isNsfw) { article.classList.add('nsfw'); }
  });
}

function addTagEditingLinkUnderPost() {
  let post = document.querySelector('#content .msgthread');
  let postToolbar = post.querySelector('nav.l');
  let canEdit = !!postToolbar.querySelector('a[href*="?body=D+"]');
  let mid = document.getElementById('content').getAttribute('data-mid');
  if (canEdit) {
    postToolbar.insertAdjacentHTML(
      'beforeend',
      `<a href="/post?body=%23${mid}+%2ATag" class="msg-button">${svgIconHtml('tag')}<span>&nbsp;Tags</span></a>`
    );
  }
}

function addCommentRemovalLinks() {
  getMyUserNameAsync().then(uname => {
    let commentsBlock = document.querySelector('ul#replies');
    if (commentsBlock && uname) {
      [].forEach.call(commentsBlock.children, linode => {
        let postUserAvatar = linode.querySelector('div.msg-avatar > a > img');
        if (postUserAvatar) {
          let postUserId = postUserAvatar.alt;
          if (postUserId == uname) {
            let linksBlock = linode.querySelector('div.msg-links');
            let commentLink = linode.querySelector('div.msg-ts > a');
            let mid = /\/(\d+)$/.exec(commentLink.pathname)[1];
            let rid = commentLink.hash.replace('#','');

            linksBlock.insertAdjacentHTML('beforeend', /*html*/`
              <div class="clickPopup">
                <div class="clickTarget" tabindex="0">${svgIconHtml('close')}&nbsp;Delete</div>
                <div class="clickContainer">
                  <p>Click&nbsp;to&nbsp;confirm:</p>
                  <a href="#confirm_delete" class="confirmationItem">Confirm&nbsp;delete</a>
                </div>
              </div>
              `);
            let clickPopup = linksBlock.querySelector('.clickPopup');
            let clickTarget = linksBlock.querySelector('.clickTarget');
            let confirmationItem = linksBlock.querySelector('.confirmationItem');
            clickTarget.addEventListener('click', e => {
              clickPopup.classList.add('expanded');
              onClickOutsideOnce(clickPopup, () => clickPopup.classList.remove('expanded'));
            });
            clickPopup.addEventListener('blur', e => {
              if (!clickPopup.contains(e.relatedTarget)) { clickPopup.classList.remove('expanded'); }
            }, true);
            keyboardClickable(clickTarget);

            confirmationItem.onclick = e => {
              e.preventDefault();
              let hash = document.body.getAttribute('data-hash');
              let apiUrl = setProto(`//api.juick.com/messages?mid=${mid}&rid=${rid}&hash=${hash}`);
              xhrGetAsync(apiUrl, 3000, [], 'DELETE').then(response => {
                if (response.status == 200) {
                  linode.remove();
                  console.log(`Removed reply /${rid} successfully.`);
                } else {
                  console.warn('Unexpected result.');
                  console.warn(response);
                  linode.style.outline = '1px solid red';
                }
              });
              clickPopup.classList.remove('expanded');
            };
          }
        }
      });
    }
  }).catch(err => console.info(err));
}

function insertHoverMenu(container, idText, urlText) {
  container.insertAdjacentHTML('beforeend', /*html*/`
        <div class="hoverPopup">
          <div class="hoverTarget" tabindex="0">${svgIconHtml('link')}&nbsp;Links</div>
          <div class="hoverContainer">
            <p>Click to copy:</p>
        <a href="#copy_id" class="copyItem">${idText}</a>
        <a href="#copy_url" class="copyItem">${urlText}</a>
          </div>
        </div>
        `);
  let hoverPopup  = container.querySelector('.hoverPopup');
  let hoverTarget = container.querySelector('.hoverTarget');
      const copyAction = el => e => {
        e.preventDefault();
        selectAndCopyElementContents(el, true);
        el.classList.add('blinkOnce');
        setTimeout(() => {
          el.classList.remove('blinkOnce');
          hoverPopup.classList.remove('expanded');
        }, 700);
      };
  [].forEach.call(container.querySelectorAll('.copyItem'), copyItem => {
        copyItem.onclick = copyAction(copyItem);
      });
      hoverTarget.addEventListener('click', e => {
        hoverPopup.classList.add('expanded');
        onClickOutsideOnce(hoverPopup, () => hoverPopup.classList.remove('expanded'));
      });
      hoverTarget.addEventListener('mouseenter', e => hoverPopup.classList.add('expanded'));
      hoverPopup.addEventListener('mouseleave', e => hoverPopup.classList.remove('expanded'));
      hoverPopup.addEventListener('blur', e => {
        if (!hoverPopup.contains(e.relatedTarget)) { hoverPopup.classList.remove('expanded'); }
      }, true);
      keyboardClickable(hoverTarget);
}

function addCommentShareMenu() {
  let messageActionsBlock = document.querySelector('.msgthread .msg-cont > nav.l');
  let messageLink = document.querySelector('.msgthread .msg-ts > a');
  let mid = /\/(\d+)$/.exec(messageLink.pathname)[1];
  insertHoverMenu(
    messageActionsBlock,
    `#${mid}`,
    `${messageLink.href}`
    );

  let commentsBlock = document.querySelector('ul#replies');
  if (commentsBlock) {
    [].forEach.call(commentsBlock.children, linode => {
      let linksBlock = linode.querySelector('div.msg-links');
      let commentLink = linode.querySelector('div.msg-ts > a');
      if (!commentLink || !linksBlock) { return; }
      let mid = /\/(\d+)$/.exec(commentLink.pathname)[1];
      let rid = commentLink.hash.replace('#','');
      insertHoverMenu(
        linksBlock,
        `#${mid}/${rid}`,
        `${commentLink.href}`
        );
    });
  }
}

function addYearLinks() {
  let userId = getColumnUserName();
  let asideColumn = document.querySelector('aside#column > div');
  let footer = asideColumn.querySelector('#footer');
  let linksContainer = document.createElement('p');
  let years = [
    {y: (new Date()).getFullYear(), b: ''},
    {y: 2021, b: '?before=3006723'},
    {y: 2020, b: '?before=2984375'},
    {y: 2019, b: '?before=2959522'},
    {y: 2018, b: '?before=2931524'},
    {y: 2017, b: '?before=2893675'},
    {y: 2016, b: '?before=2857956'},
    {y: 2015, b: '?before=2816362'},
    {y: 2014, b: '?before=2761245'},
    {y: 2013, b: '?before=2629477'},
    {y: 2012, b: '?before=2183986'},
    {y: 2011, b: '?before=1695443'},
    {y: 2010, b: '?before=1140357'},
    {y: 2009, b: '?before=453764'},
    {y: 2008, b: '?before=20106'}
  ];
  linksContainer.innerHTML = years.map(item => `<a href="/${userId}/${item.b}">${item.y}</a>`).join(' ');
  asideColumn.insertBefore(linksContainer, footer);
}

function biggerAvatar() {
  let avatarImg = document.querySelector('#column #ctitle > a > img');
  if (avatarImg) {
    avatarImg.style.maxWidth = 'none';
    avatarImg.style.maxHeight = 'none';
  }
}

function loadTagsAsync(uid) {
  let hash = document.body.getAttribute('data-hash');
  return xhrGetAsync(setProto(`//api.juick.com/tags?user_id=${uid}&hash=${hash}`), 1000).then(response => {
    return JSON.parse(response.responseText);
  });
}

function makeTagsContainer(tags, numberLimit, sortBy='tag', uname, color=[0,0,0]) {
  const tagUrl = (uname)
    ? t => `/${uname}/?tag=${encodeURIComponent(t.tag)}`
    : t => `/tag/${encodeURIComponent(t.tag)}`;

  let [r, g, b] = color;
  let p0 = 0.7; // 70% of color range is used for color coding
  let maxC = 0.1;
  tags.forEach(t => { maxC = (t.messages > maxC) ? t.messages : maxC; });
  maxC = Math.log(maxC);

  if (numberLimit && (tags.length > numberLimit)) {
    tags = tags.sort((t1, t2) => t2.messages - t1.messages)
               .slice(0, numberLimit);
  }
  if (sortBy) {
    tags = tags.sort((t1, t2) => t1[sortBy].localeCompare(t2[sortBy]));
  }
  let aNodes = tags.map(t => {
    let p = (Math.log(t.messages) / maxC - 1) * p0 + 1; // normalize to [1-p0..1]
    return `<a title="${t.messages}" href="${tagUrl(t)}" style="color: rgba(${r},${g},${b},${p}) !important;">${t.tag}</a>`;
  });
  let tagsContainer = document.createElement('p');
  tagsContainer.classList.add('tagsContainer');
  tagsContainer.innerHTML = aNodes.join(' ');
  return tagsContainer;
}

function easyTagsUnderNewMessageForm() {
  getMyAccountAsync().then(account => {
    return loadTagsAsync(account.uid).then(tags => [account, tags]);
  }).then(([account, tags]) => {
    let color = parseRgbColor(computeStyle(document.createElement('a')).color);
    return makeTagsContainer(tags, 300, 'tag', account.uname, color);
  }).then(tagsContainer => {
    Array.from(document.querySelectorAll('section#content > a')).forEach(a => a.remove());
    let content = document.querySelector('section#content');
    let messageBox = content.querySelector('textarea.newmessage');
    content.insertAdjacentElement('beforeend', tagsContainer);
    const addTag = (box, newTag) => {
      let re = new RegExp(`(^.* |^)(\\*${escapeRegExp(newTag)})($|\\s[\\s\\S]*$)`, 'g');
      if (re.test(box.value)) {
        box.value = box.value.replace(re, '$1$3').replace(/(^.*? )( +)/, '$1').replace(/^ /, '');
      } else {
        box.value = box.value.replace(/(^.*)([\s\S]*)/g, `$1 *${newTag}$2`).replace(/(^.*? )( +)/, '$1').replace(/^ /, '');
      }
    };
    Array.from(tagsContainer.children).forEach(t => {
      let newTag = t.textContent;
      t.href = '';
      t.onclick = (e => { e.preventDefault(); addTag(messageBox, newTag); });
    });
    return;
  }
  ).catch( err => console.warn(err) );
}

function clearFileInput(inp) {
  try {
    inp.value = '';
    if (inp.value) {
      inp.type = '';
      inp.type = 'file';
    }
  } catch (e) {
    console.log(e);
    console.log('old browser having problems with cleaning file input');
  }
}

function clearImageInput(mode=undefined) {
  let form = document.querySelector('#oldNewMessage');
  if (!mode || mode == 'url') { form.querySelector('#image_url').value = ''; }
  if (!mode || mode == 'file') { clearFileInput(form.querySelector('#image_upload')); }
  form.classList.remove('withImage');
  let image = document.querySelector('#imagePreview img');
  if (image) { image.remove(); }
}

function showImagePreview(src) {
  let form = document.querySelector('#oldNewMessage');
  let preview = form.querySelector('#imagePreview');
  let image = preview.querySelector('img') || document.createElement('img');
  image.src = src;
  image.onerror = () => clearImageInput();
  preview.appendChild(image);
  form.classList.add('withImage');
}

function updateImageUrlPreview(imageUrlInput) {
  let form = document.querySelector('#oldNewMessage');
  clearFileInput(form.querySelector('#image_upload')); // clear file input
  setTimeout(() => showImagePreview(imageUrlInput.value), 0);
}

function updateImageFilePreview(imageInput) {
  let form = document.querySelector('#oldNewMessage');
  form.querySelector('#image_url').value = ''; // clear url input
  if (imageInput.files.length === 0) {
    clearImageInput();
  } else {
    let selFile = imageInput.files[0];
    let validTypes = ['image/jpeg', 'image/png'];
    if (validTypes.includes(selFile.type) && selFile.size < 10485760) {
      showImagePreview(window.URL.createObjectURL(selFile));
    } else {
      clearImageInput();
    }
  }
}

function addPostSharpFormUser() {
  getMyUserNameAsync().then(uname => {
    if (getColumnUserName() == uname) {
      addPostSharpForm();
    }
  }).catch(err => console.info(err));
}

function addPostSharpForm() {
  let content = document.querySelector('#content');
  let newMessageForm = /*html*/`
    <form id="oldNewMessage" action="/post" method="post" enctype="multipart/form-data">
      <textarea name="body" rows="1" placeholder="New message..."></textarea>
      <div id="charCounterBlock" class="empty"><div id="charCounter" style="width: 0%;"></div></div>
      <div id="bottomBlock">
        <div id="bottomLeftBlock">
          <input class="tags txt" name="tags" placeholder="Tags (space separated)">
          <div id="imgUploadBlock">
            <label for="image_upload" class="btn_like">Choose file</label>
            <input type="file" id="image_upload" name="attach" accept="image/jpeg,image/png">
            <input class="imgLink txt" id="image_url" name="img" placeholder="or paste link">
            <div class="info" title="JPG/PNG up to 10 MB">${svgIconHtml('question')}</div>
          </div>
          <div class="flexSpacer"></div>
          <input type="submit" class="subm" value="Send" disabled>
        </div>
        <div id="imagePreview">
          <a id="clear_button" href="javascript:void(0);" title="Remove attachment">${svgIconHtml('close')}</a>
        </div>
      </div>
    </form>`;
  content.insertAdjacentHTML('afterbegin', newMessageForm);
  let f = document.querySelector('#oldNewMessage');
  let ta = f.querySelector('textarea');
  let urlInput = f.querySelector('#image_url');
  let fileInput = f.querySelector('#image_upload');
  let clearButton = f.querySelector('#clear_button');
  let charCounter = f.querySelector('#charCounter');
  let charCounterBlock = f.querySelector('#charCounterBlock');
  let submitButton = f.querySelector('.subm');

  urlInput.addEventListener('paste', () => updateImageUrlPreview(urlInput));
  urlInput.addEventListener('change', () => updateImageUrlPreview(urlInput));
  fileInput.addEventListener('change', () => updateImageFilePreview(fileInput));
  clearButton.addEventListener('click', () => clearImageInput());
  ta.addEventListener('focus', () => {
    ta.parentNode.classList.add('active');
    document.querySelector('#oldNewMessage textarea').rows = 2;
  });
  ta.addEventListener('input', () => {
    const maxLen = 4096;
    let len = ta.value.length;
    submitButton.disabled = (len < 1 || len > maxLen);
    charCounterBlock.classList.toggle('invalid', len > maxLen);
    if (len <= maxLen) {
      charCounter.style.width = '' + (100.0 * len / maxLen) + '%';
      charCounter.textContent = '';
    } else {
      charCounter.style.width = '';
      charCounter.textContent = '' + len;
    }
  });
  autosize(ta);

  getMyAccountAsync().then(account => {
    return loadTagsAsync(account.uid).then(tags => [account, tags]);
  }).then(([account, tags]) => {
    let color = parseRgbColor(computeStyle(document.createElement('a')).color);
    return makeTagsContainer(tags, 60, 'tag', account.uname, color);
  }).then(tagsContainer => {
    let messageForm = document.getElementById('oldNewMessage');
    let tagsField = messageForm.querySelector('div > .tags');
    tagsField.parentNode.parentNode.parentNode.appendChild(tagsContainer);
    const addTag = (tagsField, newTag) => {
      let re = new RegExp(`(^|\\s)(${escapeRegExp(newTag)})(\\s|$)`, 'g');
      if (re.test(tagsField.value)) {
        tagsField.value = tagsField.value.replace(re, '$1$3').replace(/\s\s+/g, ' ').trim();
      } else {
        tagsField.value = (tagsField.value.trim() + ' ' + newTag).trim();
      }
    };
    Array.from(tagsContainer.children).forEach(t => {
      let newTag = t.textContent;
      t.href = '';
      t.onclick = (e => { e.preventDefault(); addTag(tagsField, newTag); });
    });
    return;
  }
  ).catch( err => console.warn(err) );
}

function sortTagsPage() {
  let uid = getColumnUid();
  let uname = getColumnUserName();
  loadTagsAsync(uid).then(tags => {
    let color = parseRgbColor(computeStyle(document.createElement('a')).color);
    return makeTagsContainer(tags, undefined, 'tag', uname, color);
  }).then(tagsContainer => {
    let contentSection = document.querySelector('section#content');
    setContent(contentSection, tagsContainer);
    return;
  }).catch( err => console.warn(err) );
}

function getLastArticleDate(html) {
  const re = /datetime\=\"([^\"]+) ([^\"]+)\"/;
  //const re = /\"timestamp\"\:\"([^\"]+) ([^\"]+)\"/;
  let [, dateStr, timeStr] = re.exec(html) || [];
  return (dateStr) ? new Date(`${dateStr}T${timeStr}`) : null;
}

function processPageAsync(url, retrievalFunction, timeout=110) {
  return new Promise(function(resolve, reject) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: setProto(url),
      onload: function(response) {
        let result = null;
        if (response.status != 200) {
          console.log(`${url}: failed with ${response.status}, ${response.statusText}`);
        } else {
          result = retrievalFunction(response.responseText);
        }
        setTimeout(() => resolve(result), timeout);
      }
    });
  });
}

function loadUserDatesAsync(unprocessedUsers, processedUsers=[]) {
  return new Promise(function(resolve, reject) {
    if (unprocessedUsers.length === 0) {
      resolve(processedUsers);
    } else {
      let user = unprocessedUsers.splice(0,1)[0];
      //let postsUrl = "http://api.juick.com/messages?uname=" + user.id;
      let postsUrl = '//juick.com/' + user.id + '/';
      let recsUrl = '//juick.com/' + user.id + '/?show=recomm';

      processPageAsync(postsUrl, getLastArticleDate).then(lastPostDate => {
        processPageAsync(recsUrl, getLastArticleDate).then(lastRecDate => {
          let date = (lastPostDate > lastRecDate) ? lastPostDate : lastRecDate;
          if (date) {
            user.date = date;
            user.a.appendChild(document.createTextNode (` (${date.getFullYear()}-${(date.getMonth()+1).pad(2)}-${date.getDate().pad(2)})` ));
          } else {
            console.log(`${user.id}: no posts or recommendations found`);
          }
          processedUsers.push(user);
          loadUserDatesAsync(unprocessedUsers, processedUsers).then(rr => resolve(rr));
        });
      });
    }
  });
}

function sortUsers() {
  let contentBlock = document.getElementById('content');
  let button = document.getElementById('usersSortingButton');
  button.parentNode.removeChild(button);
  let usersTable = document.querySelector('div.users');
  let unprocessedUsers = Array.from(usersTable.querySelectorAll('span > a')).map(anode => {
    let userId = anode.pathname.replace(/\//g, '');
    return {a: anode, id: userId, date: (new Date(1970, 1, 1))};
  });
  loadUserDatesAsync(unprocessedUsers).then(
    processedUsers => {
      processedUsers.sort((b, a) => (a.date > b.date) - (a.date < b.date));
      usersTable.parentNode.removeChild(usersTable);
      let ul = document.createElement('div');
      ul.className = 'users sorted';
      processedUsers.forEach(user => {
        let li = document.createElement('span');
        li.appendChild(user.a);
        ul.appendChild(li);
      });
      contentBlock.appendChild(ul);
      return;
    }
  ).catch( err => console.warn(err) );
}

function addUsersSortingButton() {
  let contentBlock = document.getElementById('content');
  let usersTable = document.querySelector('div.users');
  let button = document.createElement('button');
  button.id = 'usersSortingButton';
  button.textContent = 'Sort by date';
  button.onclick = sortUsers;
  contentBlock.insertBefore(button, usersTable);
}

function turnIntoCts(node, makeNodeCallback) {
  node.classList.add('cts');
  node.onclick = function(e){
    e.preventDefault();
    makeNodeCallback();
    node.onclick = '';
    node.classList.remove('cts');
  };
}

function makeCts(makeNodeCallback, titleHtml) {
  let ctsNode = document.createElement('div');
  let placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.innerHTML = titleHtml;
  ctsNode.appendChild(placeholder);
  turnIntoCts(ctsNode, makeNodeCallback);
  return ctsNode;
}

function makeTitle(embedType, reResult) {
  return (embedType.makeTitle)
    ? embedType.makeTitle(reResult)
    : naiveEllipsis(reResult[0], 55);
}

function makeNewNode(embedType, aNode, reResult, alwaysCts) {
  const withClasses = el => {
    if (embedType.className) {
      el.classList.add(...embedType.className.split(' '));
    }
    return el;
  };
  let isCts = alwaysCts
              || GM_getValue('cts_' + embedType.id, embedType.ctsDefault)
              || (embedType.ctsMatch && embedType.ctsMatch(aNode, reResult));
  if (isCts) {
    let div = makeCts(
      () => embedType.makeNode(aNode, reResult, div),
      'Click to show: ' + htmlEscape(makeTitle(embedType, reResult))
    );
    return withClasses(div);
  } else {
    return embedType.makeNode(aNode, reResult, withClasses(document.createElement('div')));
  }
}

function doFetchingEmbed(aNode, reResult, div, embedType, promiseCallback) {
  return doFetchingEmbed2(
    div,
    makeTitle(embedType, reResult),
    promiseCallback,
    () => {
      div.classList.add('loading');
      div.classList.remove('failed');
      embedType.makeNode(aNode, reResult, div);
    }
  );
}

function doFetchingEmbed2(div, title, promiseCallback, remakeCallback) {
  div.innerHTML = `<span>loading ${htmlEscape(title)}</span>`;
  div.classList.add('embed', 'loading');
  promiseCallback()
    .then(() => { div.classList.remove('loading'); div.classList.add('loaded'); })
    .catch(e => {
      let { reason, response, permanent } = e;
      console.log(
        (!!reason || !!response)
          ? { reason: reason, response: response, permanent: permanent, div: div, title: title }
          : e
      );
      if (permanent) {
        div.textContent = reason;
      } else {
        div.textContent = `Failed to load (${reason})`;
        div.classList.remove('loading');
        div.classList.add('failed');
        turnIntoCts(div, remakeCallback);
      }
    });
  return div;
}

function makeIframe(src, w, h, scrolling='no') {
  let iframe = document.createElement('iframe');
  iframe.style.width = w;
  iframe.style.height = h;
  iframe.frameBorder = 0;
  iframe.scrolling = scrolling;
  iframe.setAttribute('allowFullScreen', '');
  iframe.src = src;
  iframe.innerHTML = 'Cannot show iframes.';
  return iframe;
}

function makeResizableToRatio(element, ratio) {
  element.dataset['ratio'] = ratio;
  makeResizable(element, w => w * element.dataset['ratio']);
}

// calcHeight :: Number -> Number -- calculate element height for a given width
function makeResizable(element, calcHeight) {
  const setHeight = el => {
    if (document.body.contains(el) && (el.offsetWidth > 0)) {
      el.style.height = (calcHeight(el.offsetWidth)).toFixed(2) + 'px';
    }
  };
  window.addEventListener('resize', () => setHeight(element));
  setHeight(element);
}

function makeIframeWithHtmlAndId(myHTML) {
  let id = randomId();
  let script = `(function(html){
                  var iframe = document.createElement('iframe');
                  iframe.id='${id}';
                  iframe.onload = function(){var d = iframe.contentWindow.document; d.open(); d.write(html); d.close();};
                  document.body.appendChild(iframe);
                })(${JSON.stringify(myHTML)});`;
  window.eval(script);
  return id;
}

function makeIframeHtmlAsync(html, w, h, insertCallback, successCallback, failCallback) {
  return new Promise((resolve, reject) => {
    let iframeId = makeIframeWithHtmlAndId(html);
    let iframe = document.getElementById(iframeId);
    iframe.className = 'newIframe';
    iframe.width = w;
    iframe.height = h;
    iframe.frameBorder = 0;
    iframe.addEventListener('load', () => resolve(successCallback(iframe)), false);
    iframe.onerror = er => reject(failCallback(er));
    insertCallback(iframe);
  });
}

function loadScript(url, async=false, callback, once=false) {
  if (once && [].some.call(document.scripts, s => s.src == url)) {
    if (typeof callback == 'function') { callback(); }
    return;
  }

  let head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  if (async) { script.setAttribute('async', ''); }

  if (typeof callback == 'function') {
    script.onload = callback;
  }

  head.appendChild(script);
}

function addScript(scriptString, once=false) {
  if (once && [].some.call(document.scripts, s => s.text == scriptString)) { return; }

  let head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = scriptString;
  head.appendChild(script);
}

function splitScriptsFromHtml(html) {
  const scriptRe = /<script.*?(?:src="(.+?)".*?)?>([\s\S]*?)<\/\s?script>/gmi;
  let scripts = getAllMatchesAndCaptureGroups(scriptRe, html).map(m => {
    let [, url, s] = m;
    return (url)
      ? { call: function(){ loadScript(url, true); } }
      : { call: function(){ setTimeout(window.eval(s), 0); } };
  });
  let strippedHtml = html.replace(scriptRe, '');
  return [strippedHtml, scripts];
}

function extractDomain(url) {
  const domainRe = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/i;
  return domainRe.exec(url)[1];
}

function isDefaultLinkText(aNode) {
  return (aNode.textContent == extractDomain(aNode.href));
}

function urlReplace(match, p1, p2, p3) {
  let isBrackets = (p1 !== undefined);
  return (isBrackets)
    ? `<a href="${fixWwwLink(p2 || p3)}">${p1}</a>`
    : `<a href="${fixWwwLink(match)}">${extractDomain(match)}</a>`;
}

function urlReplaceInCode(match, p1, p2, p3) {
  let isBrackets = (p1 !== undefined);
  return (isBrackets)
    ? `<a href="${fixWwwLink(p2 || p3)}">${match}</a>`
    : `<a href="${fixWwwLink(match)}">${match}</a>`;
}

function messageReplyReplace(messageId) {
  return function(match, mid, rid) {
    let replyPart = (rid && rid != '0') ? '#' + rid : '';
    return `<a href="/m/${mid || messageId}${replyPart}">${match}</a>`;
  };
}

function juickFormat(txt, messageId, isCode) {
  const urlRe = /(?:\[([^\]\[]+)\](?:\[([^\]]+)\]|\(((?:[a-z]+:\/\/|www\.|ftp\.)(?:\([-\w+*&@#/%=~|$?!:;,.]*\)|[-\w+*&@#/%=~|$?!:;,.])*(?:\([-\w+*&@#/%=~|$?!:;,.]*\)|[\w+*&@#/%=~|$]))\))|\b(?:[a-z]+:\/\/|www\.|ftp\.)(?:\([-\w+*&@#/%=~|$?!:;,.]*\)|[-\w+*&@#/%=~|$?!:;,.])*(?:\([-\w+*&@#/%=~|$?!:;,.]*\)|[\w+*&@#/%=~|$]))/gi;
  const bqReplace = m => m.replace(/^(?:>|&gt;)\s?/gmi, '');
  return (isCode)
    ? formatText(txt, [
      { pr: 1, re: urlRe, with: urlReplaceInCode },
      { pr: 1, re: /\B(?:#(\d+))?(?:\/(\d+))?\b/g, with: messageReplyReplace(messageId) },
      { pr: 1, re: /\B@([\w-]+)\b/gi, with: '<a href="/$1">@$1</a>' },
    ])
    : formatText(txt, [
      { pr: 0, re: /((?:^(?:>|&gt;)\s?[\s\S]+?$\n?)+)/gmi, brackets: true, with: ['<q>', '</q>', bqReplace] },
      { pr: 1, re: urlRe, with: urlReplace },
      { pr: 1, re: /\B(?:#(\d+))?(?:\/(\d+))?\b/g, with: messageReplyReplace(messageId) },
      { pr: 1, re: /\B@([\w-]+)\b/gi, with: '<a href="/$1">@$1</a>' },
      { pr: 2, re: /\B\*([^\n]+?)\*((?=\s)|(?=$)|(?=[!\"#$%&'*+,\-./:;<=>?@[\]^_`{|}~()]+))/g, brackets: true, with: ['<b>', '</b>'] },
      { pr: 2, re: /\B\/([^\n]+?)\/((?=\s)|(?=$)|(?=[!\"#$%&'*+,\-./:;<=>?@[\]^_`{|}~()]+))/g, brackets: true, with: ['<i>', '</i>'] },
      { pr: 2, re: /\b\_([^\n]+?)\_((?=\s)|(?=$)|(?=[!\"#$%&'*+,\-./:;<=>?@[\]^_`{|}~()]+))/g, brackets: true, with: ['<span class="u">', '</span>'] },
      { pr: 3, re: /\n/g, with: '<br/>' },
    ]);
}

function juickPhotoLink(postId, ext) {
  return `//i.juick.com/p/${postId}.${ext}`;
}

function juickId([, userId, postId, replyId]) {
  let isReply = replyId && (replyId != '0');
  return '#' + postId + (isReply ? '/' + replyId : '');
}

function getEmbeddableLinkTypes() {
  return [
    {
      name: 'Juick',
      id: 'embed_juick',
      className: 'juickEmbed',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/juick\.com\/(?!tag\/)(?:m\/|([\w-]+)\/|)([\d]{6,}\b)(?:#(\d+))?/i,
      ctsMatch: function(aNode, reResult) {
        let [url, userId, msgId, replyId] = reResult;
        let thisPageMsgMatch = /\/(\d+)$/.exec(window.location.pathname);
        let isSameThread = thisPageMsgMatch && thisPageMsgMatch[1] == msgId;
        return !isSameThread && replyId && (+replyId) > 150;
      },
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, userId, msgId, replyId] = reResult;
        userId = userId || 'm';
        let apiUrl = setProto('//api.juick.com/thread?mid=' + msgId);

        let isReply = (replyId && replyId !== '0');
        let mrid = (isReply) ? parseInt(replyId, 10) : 0;
        let idStr = juickId(reResult);
        let linkStr = '/' + userId + '/' + msgId + (isReply ? '#' + mrid : '');

        if (GM_getValue('enable_move_into_view_on_same_page', true)) {
          let thisPageMsgMatch = /\/(\d+)$/.exec(window.location.pathname);
          let isSameThread = thisPageMsgMatch && thisPageMsgMatch[1] == msgId;
          if (isSameThread) {
            let linkedItem = Array.from(document.querySelectorAll('li.msg'))
                                  .find(x => x.id == replyId || (mrid == 0 && x.id == 'msg-' + msgId));
            if (linkedItem) {
              let thisMsg = aNode.closest('li.msg > div.msg-cont');
              let linkedMsg = linkedItem.querySelector('div.msg-cont');
              setMoveIntoViewOnHover(aNode, thisMsg, linkedMsg, 5, 30);
              return;
            }
          }
        }

        const callback = response => {
          let threadInfo = JSON.parse(response.responseText);
          let msg = (!isReply) ? threadInfo[0] : threadInfo.find(x => (x.rid == mrid));
          if (!msg) {
            throw { reason: `${idStr} does not exist`, response: response, permanent: true, url: apiUrl };
          }

          let withLikes = msg.likes && msg.likes > 0;
          let isReplyToOp = isReply && (!msg.replyto || msg.replyto == 0);
          let withReplies = msg.replies && msg.replies > 0;
          let isNsfw = msg.tags && msg.tags.some(t => t.toUpperCase() == 'NSFW');
          let isCode = msg.tags && msg.tags.some(t => t.toUpperCase() == 'CODE');

          if (isCode) { div.classList.add('codePost'); }

          let tagsStr = (msg.tags) ? '<div class="msg-tags">' + msg.tags.map(x => `<a href="/${msg.user.uname}/?tag=${encodeURIComponent(x)}">${x}</a>`).join('') + '</div>' : '';
          let photoStr = (msg.photo) ? `<div><a href="${juickPhotoLink(msg.mid, msg.attach)}"><img ${(isNsfw ? 'class="nsfw" ' : '')}src="${unsetProto(msg.photo.small)}"/></a></div>` : '';
          let replyStr = (isReply)
            ? ` in reply to <a class="whiteRabbit" href="/${userId}/${msg.mid}${isReplyToOp ? '' : '#' + msg.replyto}">#${msg.mid}${isReplyToOp ? '' : '/' + msg.replyto}</a>`
            : '';
          let likesTitle = (!!msg.recommendations) ? `title="${msg.recommendations.join(', ')}"` : '';
          let likesDiv = (withLikes) ? `<div class="likes" ${likesTitle}><a href="${linkStr}">${svgIconHtml('heart')}${msg.likes}</a></div>` : '';
          let commentsDiv = (withReplies) ? `<div class="replies" title="${[...new Set(threadInfo.slice(1).map(x => x.user.uname))].join(', ')}"><a href="${linkStr}">${svgIconHtml('comment')}${msg.replies}</a></div>` : '';
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="msg-avatar"><a href="/${msg.user.uname}/"><img src="//i.juick.com/a/${msg.user.uid}.png" alt="${msg.user.uname}"></a></div>
              <div class="top-right">
                <div class="top-right-1st">
                  <div class="title"><a href="/${msg.user.uname}/">@${msg.user.uname}</a></div>
                  <div class="date"><a href="${linkStr}">${msg.timestamp}</a></div>
                </div>
                <div class="top-right-2nd">${tagsStr}</div>
              </div>
            </div>
            <div class="desc">${juickFormat(msg.body, msgId, isCode)}</div>${photoStr}
            <div class="bottom">
              <div class="embedReply msg-links"><a href="${linkStr}">${idStr}</a>${replyStr}</div>
              <div class="right">${likesDiv}${commentsDiv}</div>
            </div>
            `;

          let allLinks = div.querySelectorAll('.desc a, .embedReply a.whiteRabbit');
          let embedContainer = div.parentNode;
          embedLinks(Array.from(allLinks).reverse(), embedContainer, true, div);
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      },
      makeTitle: function(reResult) {
        return juickId(reResult);
      },
      linkTextUpdate: function(aNode, reResult) {
        if (isDefaultLinkText(aNode)) {
          //var isUser = (reResult[1]);
          aNode.textContent = juickId(reResult); // + ((!isReply && isUser) ? ' (@' + reResult[1] + ')' : '');
        }
      }
    },
    {
      name: 'Jpeg and png images',
      id: 'embed_jpeg_and_png_images',
      className: 'picture compact',
      onByDefault: true,
      ctsDefault: false,
      re: /\.(jpe?g|png|svg)(:[a-zA-Z]+)?(?:\?[\w&;\?=]*)?$/i,
      makeNode: function(aNode, reResult, div) {
        div.innerHTML = `<a href="${aNode.href}"><img src="${aNode.href}"></a>`;
        return div;
      }
    },
    {
      name: 'Gif images',
      id: 'embed_gif_images',
      className: 'picture compact',
      onByDefault: true,
      ctsDefault: true,
      re: /\.gif(:[a-zA-Z]+)?(?:\?[\w&;\?=]*)?$/i,
      makeNode: function(aNode, reResult, div) {
        div.innerHTML = `<a href="${aNode.href}"><img src="${aNode.href}"></a>`;
        return div;
      }
    },
    {
      name: 'Video (webm, mp4, ogv)',
      id: 'embed_webm_and_mp4_videos',
      className: 'video compact',
      onByDefault: true,
      ctsDefault: false,
      re: /\.(webm|mp4|m4v|ogv)(?:\?[\w&;\?=]*)?$/i,
      makeNode: function(aNode, reResult, div) {
        div.innerHTML = `<video src="${aNode.href}" title="${aNode.href}" controls></video>`;
        return div;
      }
    },
    {
      name: 'Audio (mp3, ogg, weba, opus, m4a, oga, wav)',
      id: 'embed_sound_files',
      className: 'audio singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /\.(mp3|ogg|weba|opus|m4a|oga|wav)(?:\?[\w&;\?=]*)?$/i,
      makeNode: function(aNode, reResult, div) {
        div.innerHTML = `<audio src="${aNode.href}" title="${aNode.href}" controls></audio>`;
        return div;
      }
    },
    {
      name: 'YouTube videos (and playlists)',
      id: 'embed_youtube_videos',
      className: 'youtube resizableV singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.|m\.|gaming\.)?(?:youtu(?:(?:\.be\/|be\.com\/(?:v|embed)\/)([-\w]+)|be\.com\/watch)((?:(?:\?|&(?:amp;)?)(?:\w+=[-\.\w]*[-\w]))*)|youtube\.com\/playlist\?list=([-\w]*)(&(amp;)?[-\w\?=]*)?)/i,
      makeNode: function(aNode, reResult, div) {
        let [url, v, args, plist] = reResult;
        let iframeUrl;
        if (plist) {
          iframeUrl = '//www.youtube-nocookie.com/embed/videoseries?list=' + plist;
        } else {
          let pp = {}; args.replace(/^\?/, '')
                           .split('&')
                           .map(s => s.split('='))
                           .forEach(z => pp[z[0]] = z[1]);
          let embedArgs = { rel: '0' };
          if (pp.t) {
            const tre = /^(?:(\d+)|(?:(\d+)h)?(?:(\d+)m)?(\d+)s|(?:(\d+)h)?(\d+)m|(\d+)h)$/i;
            let [, t, h, m, s, h1, m1, h2] = tre.exec(pp.t);
            embedArgs['start'] = (+t) || ((+(h || h1 || h2 || 0))*60*60 + (+(m || m1 || 0))*60 + (+(s || 0)));
          }
          if (pp.list) {
            embedArgs['list'] = pp.list;
          }
          v = v || pp.v;
          let argsStr = Object.keys(embedArgs)
                              .map(k => `${k}=${embedArgs[k]}`)
                              .join('&');
          iframeUrl = `//www.youtube-nocookie.com/embed/${v}?${argsStr}`;
        }
        let iframe = makeIframe(iframeUrl, '100%', '360px');
        iframe.onload = () => makeResizableToRatio(iframe, 9.0 / 16.0);
        return setContent(div, iframe);
      }
    },
    {
      name: 'Vimeo videos',
      id: 'embed_vimeo_videos',
      className: 'vimeo resizableV',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/|album\/[\d]+\/video\/)?([\d]+)/i,
      makeNode: function(aNode, reResult, div) {
        let iframe = makeIframe('//player.vimeo.com/video/' + reResult[1], '100%', '360px');
        iframe.onload = () => makeResizableToRatio(iframe, 9.0 / 16.0);
        return setContent(div, iframe);
      }
    },
    {
      name: 'Dailymotion videos',
      id: 'embed_youtube_videos',
      className: 'dailymotion resizableV',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?dailymotion\.com\/video\/([a-zA-Z\d]+)(?:_[-%\w]*)?/i,
      makeNode: function(aNode, reResult, div) {
        let iframe = makeIframe('//www.dailymotion.com/embed/video/' + reResult[1], '100%', '360px');
        iframe.onload = () => makeResizableToRatio(iframe, 9.0 / 16.0);
        return setContent(div, iframe);
      }
    },
    {
      name: 'Coub clips',
      id: 'embed_coub_clips',
      className: 'coub resizableV',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?coub\.com\/(?:view|embed)\/([a-zA-Z\d]+)/i,
      makeNode: function(aNode, reResult, div) {
        let embedUrl = '//coub.com/embed/' + reResult[1] + '?muted=false&autostart=false&originalSize=false&startWithHD=false';
        let iframe = makeIframe(embedUrl, '100%', '360px');
        iframe.onload = () => makeResizableToRatio(iframe, 9.0 / 16.0);
        return setContent(div, iframe);
      }
    },
    {
      name: 'Twitch streams',
      id: 'embed_twitch',
      className: 'twitch resizableV',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?twitch\.tv\/(\w+)(?:\/v\/(\d+))?/i,
      makeNode: function(aNode, reResult, div) {
        let [, channel, video] = reResult;
        let url = (video)
          ? `https://player.twitch.tv/?video=v${video}&parent=juick.com&autoplay=false`
          : `https://player.twitch.tv/?channel=${channel}&parent=juick.com&autoplay=false`;
        let iframe = makeIframe(url, '100%', '378px');
        iframe.onload = () => makeResizableToRatio(iframe, 9.0 / 16.0);
        return setContent(div, iframe);
      }
    },
    {
      name: 'Steam games',
      id: 'embed_steam',
      className: 'steam singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/store\.steampowered\.com\/app\/(\d+)/i,
      makeNode: function(aNode, reResult, div) {
        let iframe = makeIframe('//store.steampowered.com/widget/' + reResult[1] + '/', '100%', '190px');
        return setContent(div, iframe);
      }
    },
    {
      name: 'Bandcamp music',
      id: 'embed_bandcamp_music',
      className: 'bandcamp',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(\w+)\.bandcamp\.com\/(track|album)\/([-%\w]+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, band, pageType, pageName] = reResult;

        const callback = response => {
          let videoUrl, videoH;
          const metaRe = /<\s*meta\s+(?:property|name)\s*=\s*\"([^\"]+)\"\s+content\s*=\s*\"([^\"]*)\"\s*>/gmi;
          let matches = getAllMatchesAndCaptureGroups(metaRe, response.responseText);
          matches.forEach(m => {
            if (m[1] == 'og:video') { videoUrl = m[2]; }
            if (m[1] == 'video_height') { videoH = parseInt(m[2], 10); }
          });
          let isAlbum = pageType == 'album';
          if (isAlbum) { videoUrl = videoUrl.replace('/tracklist=false', '/tracklist=true'); }
          videoUrl = videoUrl.replace('/artwork=small', '');
          let iframe = makeIframe(videoUrl, '100%', '600px');
          setContent(div, wrapIntoTag(iframe, 'div', 'bandcamp resizableV'));
          let calcHeight = w => w + videoH + (isAlbum ? 162 : 0);
          iframe.onload = () => makeResizable(iframe, calcHeight);
          div.classList.remove('embed');
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(url, 3000).then(callback));
      }
    },
    {
      name: 'SoundCloud music',
      id: 'embed_soundcloud_music',
      className: 'soundcloud',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?soundcloud\.com\/(([\w\-\_]*)\/(?:sets\/)?(?!tracks$)([-%\w]*))(?:\/)?/i,
      makeNode: function(aNode, reResult, div) {
        let embedUrl = '//w.soundcloud.com/player/?url=//soundcloud.com/' + reResult[1] + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true';
        return setContent(div, makeIframe(embedUrl, '100%', 450));
      }
    },
    {
      name: 'Mixcloud music',
      id: 'embed_mixcloud_music',
      className: 'mixcloud singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?mixcloud\.com\/(?!discover\/)([\w]+)\/(?!playlists\/)([-%\w]+)\/?/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, author, mix] = reResult;
        let apiUrl = 'https://www.mixcloud.com/oembed/?format=json&url=' + encodeURIComponent(url);

        const callback = response => {
          let json = JSON.parse(response.responseText);
          div.innerHTML = json.html;
          div.className = div.classList.remove('embed');
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'Яндекс.Музыка',
      id: 'embed_yandex_music',
      className: 'yandexMusic singleColumn',
      onByDefault: true,
      ctsDefault: true,
      re: /^(?:https?:)?\/\/music\.yandex\.ru(?!$|\/artist\/\d+$)(?:\/album\/(\d+))?(?:\/track\/(\d+))?/i,
      makeNode: function(aNode, reResult, div) {
        let [url, album, track] = reResult;
        let isTrack = !!track;
        let embedUrl = (isTrack)
          ? `https://music.yandex.ru/iframe/#track/${track}/${album ? album + '/' : ''}`
          : `https://music.yandex.ru/iframe/#album/${album}/`;
        return setContent(div, makeIframe(embedUrl, '100%', isTrack ? '100px' : '420px'));
      }
    },
    {
      name: 'Flickr images',
      id: 'embed_flickr_images',
      className: 'flickr',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:(?:www\.)?flickr\.com\/photos\/([\w@-]+)\/(\d+)|flic.kr\/p\/(\w+))(?:\/)?/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let apiUrl = 'https://www.flickr.com/services/oembed?format=json&url=' + encodeURIComponent(reResult[0]);

        const callback = response => {
          let json = JSON.parse(response.responseText);
          let imageUrl = (json.url) ? json.url : json.thumbnail_url; //.replace('_b.', '_z.');
          let typeStr = (json.flickr_type == 'photo') ? '' : ` (${json.flickr_type})`;
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                <a href="${json.web_page}">${json.title}</a>${typeStr} by <a href="${json.author_url}">${json.author_name}</a>
              </div>
            </div>
            <a href="${aNode.href}"><img src="${imageUrl}"></a>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'DeviantArt images',
      id: 'embed_deviantart_images',
      className: 'deviantart',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/([\w-]+)\.deviantart\.com\/art\/([-%\w]+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, userId, workId] = reResult;
        let apiUrl = 'https://backend.deviantart.com/oembed?format=json&url=' + encodeURIComponent(url);

        const callback = response => {
          let json = JSON.parse(response.responseText);
          let date = new Date(json.pubdate);
          let typeStr = (json.type == 'photo') ? '' : ` (${json.type})`;
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                <a href="${url}">${json.title}</a>${typeStr} by <a href="${json.author_url}">${json.author_name}</a>
              </div>
              <div class="date">${date.toLocaleString('ru-RU')}</div>
            </div>`;
          if ((json.type == 'rich') && json.html) {
            div.innerHTML += `<div class="desc">${json.html}...</div>`;
          } else {
            let imageClassStr = (json.safety == 'adult') ? 'class="rating_e"' : '';
            let imageUrl = json.fullsize_url || json.url || json.thumbnail_url;
            div.innerHTML += `<a href="${aNode.href}"><img ${imageClassStr} src="${imageUrl}"></a>`;
          }
        };

        // consider adding note 'Failed to load (maybe this article can\'t be embedded)'
        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'Imgur gifv videos',
      id: 'embed_imgur_gifv_videos',
      className: 'video compact',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:\w+\.)?imgur\.com\/([a-zA-Z\d]+)\.gifv/i,
      makeNode: function(aNode, reResult, div) {
        div.innerHTML = `<video src="//i.imgur.com/${reResult[1]}.mp4" title="${aNode.href}" controls loop></video>`;
        return div;
      }
    },
    {
      name: 'Imgur indirect links',
      id: 'embed_imgur_indirect_links',
      className: 'imgur singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:\w+\.)?imgur\.com\/(?:(gallery|a)\/)?(?!gallery|jobs|about|blog|apps)([a-zA-Z\d]+)(?:#\d{1,2}$|#([a-zA-Z\d]+))?(\/\w+)?$/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [, albumType, contentId, albumImageId] = reResult;

        let url = (albumType && albumImageId)
          ? 'http://imgur.com/' + albumImageId
          : 'http://imgur.com/' + (albumType ? albumType + '/' : '') + contentId;
        let apiUrl = 'https://api.imgur.com/oembed.json?url=' + encodeURIComponent(url);

        const callback = response => {
          let json = JSON.parse(response.responseText);
          let iframe = makeIframeHtmlAsync(
            json.html,
            '100%',
            '24px',
            iframe => div.appendChild(iframe),
            iframe => [iframe, iframe.contentWindow.document],
            e => ({ reason: e.message, permanent: false, url: apiUrl })
          ).then(([iframe, doc]) => {
            return waitAndRunAsync(
              () => !!doc.querySelector('iframe'),
              50,
              100,
              () => ([iframe, doc]),
              () => ({ reason: 'timeout', permanent: false, url: apiUrl })
            );
          }).then(([iframe, doc]) => {
            div.replaceChild(doc.querySelector('iframe'), iframe);
            div.querySelector('span').remove();
            div.classList.remove('embed');
          });
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'Gfycat indirect links',
      id: 'embed_gfycat_indirect_links',
      className: 'gfycat',
      onByDefault: true,
      ctsDefault: true,
      re: /^(?:https?:)?\/\/(?:\w+\.)?gfycat\.com\/([a-zA-Z\d]+)$/i,
      makeNode: function(aNode, reResult, div) {
        return setContent(div, makeIframe('//gfycat.com/ifr/' + reResult[1], '100%', 480));
      }
    },
    {
      name: 'Twitter',
      id: 'embed_twitter_status',
      className: 'twi',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?(?:mobile\.)?twitter\.com\/([\w-]+)\/status(?:es)?\/([\d]+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, userId, postId] = reResult;
        url = url.replace('mobile.','');

        const predicates = [
          {
            msg: response => (response.statusText ? `${response.status} - ${response.statusText}` : `${response.status}`),
            test: response => response.status != 200,
            permanent: response => response.status != 503
          },
          {
            msg: response => 'Account @' + userId + ' is suspended',
            test: response => response.finalUrl.endsWith('account/suspended'),
            permanent: response => true
          },
          {
            msg: response => 'Account @' + userId + ' is protected',
            test: response => response.finalUrl.indexOf('protected_redirect=true') != -1,
            permanent: response => true
          }
        ];
        const callback = response => {
          let images = [];
          let userGenImg = false;
          let isVideo = false;
          let videoUrl, videoW, videoH;
          let title, description;
          const metaRe = /<\s*meta\s+property\s*=\s*\"([^\"]+)\"\s+content\s*=\s*\"([^\"]*)\"\s*>/gmi;
          let matches = getAllMatchesAndCaptureGroups(metaRe, response.responseText);
          matches.forEach(m => {
            if (m[1] == 'og:title') { title = m[2]; }
            if (m[1] == 'og:description') {
              description = htmlDecode(m[2])
                .replace(/\n/g,'<br/>')
                .replace(/\B@(\w{1,15})\b/gmi, '<a href="//twitter.com/$1">@$1</a>')
                .replace(/#(\w+)/gmi, '<a href="//twitter.com/hashtag/$1">#$1</a>')
                .replace(/(?:https?:)?\/\/t\.co\/([\w]+)/gmi, '<a href="$&">$&</a>');
            }
            if (m[1] == 'og:image') { images.push(m[2]); }
            if (m[1] == 'og:image:user_generated') { userGenImg = true; }
            if (m[1] == 'og:video:url') { videoUrl = m[2]; isVideo = true; }
            if (m[1] == 'og:video:height') { videoH = +m[2]; }
            if (m[1] == 'og:video:width') { videoW = +m[2]; }
          });
          const timestampMsRe = /\bdata-time-ms\s*=\s*\"([^\"]+)\"/gi;
          let timestampMsResult = timestampMsRe.exec(response.responseText);
          let dateDiv = (timestampMsResult) ? `<div class="date">${new Date(+timestampMsResult[1]).toLocaleString('ru-RU')}</div>` : '';
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                ${title} (<a href="//twitter.com/${userId}">@${userId}</a>)
              </div>
              ${dateDiv}
            </div>
            <div class="desc">${description}</div>`;
          if (userGenImg) { div.innerHTML += images.map(x => { return `<a href="${x}"><img src="${x}"></a>`; }).join(''); }
          if (isVideo) {
            let { w, h } = fitToBounds(videoW, videoH, 620, 720);
            let ctsVideo = makeCts(
              () => setContent(ctsVideo, makeIframe(videoUrl, w + 'px', h + 'px')),
              `<img src="${images[0]}">${svgIconHtml('play')}`
            );
            div.appendChild(ctsVideo);
          }
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(url, 3000, predicates).then(callback));
      }
    },
    {
      name: 'Facebook',
      id: 'embed_facebook',
      className: 'fbEmbed singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.|m\.)?facebook\.com\/(?:[\w.]+\/(?:posts|videos|photos)\/[\w:./]+(?:\?[\w=%&.]+)?|(?:photo|video)\.php\?[\w=%&.]+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;

        const promiseCallback = () => {
          setTimeout(loadScript('https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.3', false, undefined, true), 0);
          div.insertAdjacentHTML('beforeend', `<div class="fb-post" data-href="${aNode.href}" data-width="640" />`);
          return waitAndRunAsync(
            () => !!div.querySelector('iframe[height]'),
            20,
            100,
            () => {},
            () => ({ reason: 'timeout', permanent: false })
          ).then(() => {
            div.querySelector('span').remove();
            div.classList.remove('embed');
          }).catch(e => {
            console.log('Juick tweaks: time out on facebook embedding, applying workaround.');
            let embedUrl = 'https://www.facebook.com/plugins/post.php?width=640&height=570&href=' + encodeURIComponent(reResult[0]);
            div.innerHTML = '';
            div.appendChild(makeIframe(embedUrl, '100%', 570));
            div.classList.remove('embed');
            div.classList.add('fallback');
          });
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, promiseCallback);
      }
    },
    {
      name: 'Telegram',
      id: 'embed_telegram',
      className: 'telegram singleColumn',
      onByDefault: false,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/t\.me\/(.+)\/(\d+)$/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [, channelId, postId] = reResult;

        const promiseCallback = () => {
          setTimeout(() => {
            let script = document.createElement('script');
            script.async = true;
            script.type = 'text/javascript';
            script.src = 'https://telegram.org/js/telegram-widget.js?4';
            script.dataset.telegramPost = `${channelId}/${postId}`;
            script.dataset.width = '100%';
            div.appendChild(script);
          }, 0);
          return waitAndRunAsync(
            () => !!div.querySelector('iframe'),
            30,
            100,
            () => {},
            () => ({ reason: 'timeout', permanent: false })
          ).then(() => {
            div.querySelector('span').remove();
            div.classList.remove('embed');
          });
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, promiseCallback);
      }
    },
    {
      name: 'Tumblr',
      id: 'embed_tumblr',
      className: 'tumblr singleColumn',
      onByDefault: true,
      ctsDefault: true,
      re: /^(?:https?:)?\/\/(?:([\w\-\_]+)\.)?tumblr\.com\/post\/([\d]*)(?:\/([-%\w]*))?/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let apiUrl = 'https://www.tumblr.com/oembed/1.0?url=' + reResult[0];

        const callback = response => {
          let json = JSON.parse(response.responseText);
          return makeIframeHtmlAsync(
            json.html,
            '100%',
            '24px',
            iframe => div.appendChild(iframe),
            iframe => [iframe, iframe.contentWindow.document],
            e => ({ reason: e.message, permanent: false, url: apiUrl })
          ).then(([iframe, doc]) => {
            return waitAndRunAsync(
              () => !!doc.querySelector('iframe[height]'),
              50,
              100,
              () => ([iframe, doc]),
              () => ({ reason: 'timeout', permanent: false, url: apiUrl })
            );
          }).then(([iframe, doc]) => {
            div.replaceChild(doc.querySelector('iframe[height]'), iframe);
            div.querySelector('span').remove();
            div.classList.remove('embed');
          });
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'Reddit',
      id: 'embed_reddit',
      className: 'reddit singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.|np\.|m\.)?reddit\.com\/r\/([\w]+)\/comments\/(\w+)(?:\/(?:\w+(?:\/(\w+)?)?)?)?/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let apiUrl = 'https://www.reddit.com/oembed?url=' + encodeURIComponent(reResult[0]);

        const callback = response => {
          let json = JSON.parse(response.responseText);
          let [h, ss] = splitScriptsFromHtml(json.html);
          div.innerHTML += h;
          ss.forEach(s => s.call());
          return waitAndRunAsync(
            () => { let iframe = div.querySelector('iframe'); return (iframe && (parseInt(iframe.height) > 30)); },
            30,
            100,
            () => {},
            () => ({ reason: 'timeout', permanent: false, url: apiUrl })
          ).then(iframe => {
            div.querySelector('iframe').style.margin = '0px';
            div.querySelector('span').remove();
            div.classList.remove('embed');
          });
        };

        // consider adding note 'Failed to load (maybe this article can\'t be embedded)'
        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'WordPress',
      id: 'embed_wordpress',
      className: 'wordpress singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(\w+)\.wordpress\.com\/(\d{4})\/(\d{2})\/(\d{2})\/([-\w%\u0400-\u04FF]+)(?:\/)?/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url,site,year,month,day,slug] = reResult;
        let apiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/${site}.wordpress.com/posts/slug:${slug}`;

        const callback = response => {
          let json = JSON.parse(response.responseText);
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                "<a href="${url}">${json.title}</a>" by <a href="${json.author.URL}">${json.author.name}</a>
              </div>
              <div class="date">${new Date(json.date).toLocaleString('ru-RU')}</div>
            </div>
            <hr/>
            <div class="desc">${json.content}</div>`;
        };

        // consider adding note 'Failed to load (maybe this article can\'t be embedded)'
        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'SlideShare',
      id: 'embed_slideshare',
      className: 'slideshare singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:\w+\.)?slideshare\.net\/(\w+)\/([-%\w]+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, author, id] = reResult;
        let apiUrl = 'http://www.slideshare.net/api/oembed/2?format=json&url=' + url;

        const callback = response => {
          let json = JSON.parse(response.responseText);
          let baseSize = 640;
          let newH = 1.0 * baseSize / json.width * json.height;
          let iframeStr = json.html
                              .match(/<iframe[^>]+>[\s\S]*?<\/iframe>/i)[0]
                              .replace(/width="\d+"/i, `width="${baseSize}"`)
                              .replace(/height="\d+"/i, `height="${newH}"`);
          div.innerHTML = iframeStr;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'Gist',
      id: 'embed_gist',
      className: 'gistEmbed singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/gist\.github\.com\/(?:([\w-]+)\/)?([A-Fa-f0-9]+)\b/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, , id] = reResult;
        let apiUrl = 'https://gist.github.com/' + id + '.json';

        const callback = response => {
          let json = JSON.parse(response.responseText);
          let date = new Date(json.created_at).toLocaleDateString('ru-RU');
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                "${json.description}" by <a href="https://gist.github.com/${json.owner}">${json.owner}</a>
              </div>
              <div class="date">${date}</div>
            </div>
            <link rel="stylesheet" href="${htmlEscape(json.stylesheet)}"></link>
            ${json.div}`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'JSFiddle',
      id: 'embed_jsfiddle',
      className: 'jsfiddle',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?(\/\/jsfiddle\.net\/(?:(?!embedded\b)[\w]+\/?)+)/i,
      makeNode: function(aNode, reResult, div) {
        let embedUrl = reResult[1].replace(/[^\/]$/, '$&/') + 'embedded/';
        return setContent(div, makeIframe(embedUrl, '100%', 500));
      }
    },
    {
      name: 'Codepen',
      id: 'embed_codepen',
      className: 'codepen singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/codepen\.io\/(\w+)\/(?:pen|full)\/(\w+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url] = reResult;
        let apiUrl = 'https://codepen.io/api/oembed?format=json&url=' + encodeURIComponent(url.replace('/full/', '/pen/'));

        const callback = response => {
          let json = JSON.parse(response.responseText);
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">"${json.title}" by <a href="${json.author_url}">${json.author_name}</a></div>
            </div>
            ${json.html}`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      }
    },
    {
      name: 'XKCD',
      id: 'embed_xkcd',
      className: 'xkcd singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/xkcd\.com\/(\d+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, xkcdId] = reResult;

        const callback = response => {
          let [, title] = /<div id="ctitle">([\s\S]+?)<\/div>/.exec(response.responseText) || [];
          let [, comic] = /<div id="comic">([\s\S]+?)<\/div>/.exec(response.responseText) || [];
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">${title}</div>
            </div>
            <a href="${url}" class="comic">${comic}</a>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(url, 3000).then(callback));
      },
      makeTitle: function(reResult) {
        return 'xkcd.com/' + reResult[1] + '/';
      },
      linkTextUpdate: function(aNode, reResult) {
        if (isDefaultLinkText(aNode)) {
          aNode.textContent = 'xkcd.com/' + reResult[1] + '/';
        }
      }
    },
    {
      name: 'lichess',
      id: 'embed_lichess',
      className: 'lichess singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/lichess\.org\/(study|)(?:\/?embed)?\/?((?=[a-z]*[A-Z0-9])[A-Za-z0-9\/]{8})/,
      makeNode: function(aNode, reResult, div) {
        let [, mode, rest] = reResult;
        let embedUrl = ['https://lichess.org', mode, 'embed', rest].filter(a => !!a).join('/');
        let iframe = makeIframe(embedUrl, '100%', '400px');
        iframe.onload = () => makeResizableToRatio(iframe, 397.0 / 600.0);
        return setContent(div, iframe);
      }
    },
    {
      name: 'Wikipedia',
      id: 'embed_wikipedia',
      className: 'wikipedia singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/([a-z]+)\.wikipedia\.org\/wiki\/([-A-Za-z0-9À-ž_+*&@#/%=~|$\(\),]+)$/,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, lang, entity] = reResult;
        let embedUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${entity}`;

        const callback = response => {
          let json = JSON.parse(response.responseText);
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title"><a href="${url}">${json.displaytitle}</a></div>
              <div class="lang">${json.lang}</div>
            </div>
            <div>
              ${json.thumbnail ? `<img src="${json.thumbnail.source}" style="float: right;">` : ''}
              <div class="extract">${json.extract_html}</div>
            </div>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(embedUrl, 3000).then(callback));
      },
      makeTitle: function(reResult) {
        return 'Wikipedia: ' + decodeURIComponent(reResult[2].replace(/_/g, ' '));
      },
      linkTextUpdate: function(aNode, reResult) {
        if (isDefaultLinkText(aNode)) {
          aNode.textContent = 'Wikipedia: ' + decodeURIComponent(reResult[2].replace(/_/g, ' '));
        }
      }
    },
    {
      name: 'arXiv',
      id: 'embed_arxiv',
      className: 'arxiv singleColumn',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:\w+\.)?arxiv\.org\/(?:abs|pdf)\/(\d+\.\d+)(v\d+)?/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, arxivId, rev] = reResult;
        let absUrl = 'https://arxiv.org/abs/' + arxivId + (rev || '');
        let pdfUrl = 'https://arxiv.org/pdf/' + arxivId + (rev || '');

        const callback = response => {
          const metaRe = /<\s*meta\s+name\s*=\s*\"([^\"]+)\"\s+content\s*=\s*\"([^\"]*)\"\s*\/?>/gmi;
          let matches = getAllMatchesAndCaptureGroups(metaRe, response.responseText).map(m => ({ k: m[1].toLowerCase(), v: m[2] }));
          let title = matches.find(x => x.k == 'citation_title').v;

          let [, dateline] = /<div class="dateline">\s*([\s\S]+?)<\/div>/.exec(response.responseText) || [];
          let [, abstract] = /<blockquote class="abstract\b.*?">\s*<span class="descriptor">[\s\S]*?<\/span>\s*([\s\S]+?)<\/blockquote>/.exec(response.responseText) || [];
          let authors = getAllMatchesAndCaptureGroups(/<a href="(\/find.+?)">(.+?)<\/a>/gi, response.responseText).map(m => ({ url: m[1], name: m[2] }));
          let authorsStr = authors.map(a => `<a href="${a.url}">${a.name}</a>`).join(', ');

          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title"><a href="${absUrl}">${title}</a> (<a href="${pdfUrl}">pdf</a>)</div>
              <div class="date">${dateline}</div>
            </div>
            <div class="abstract">${abstract}</div>
            <div class="bottom">
              <div class="authors">${authorsStr}</div>
            </div>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(absUrl, 3000).then(callback));
      },
      makeTitle: function(reResult) {
        return 'arXiv:' + reResult[1] + (reResult[2] || '');
      },
      linkTextUpdate: function(aNode, reResult) {
        if (isDefaultLinkText(aNode)) {
          aNode.textContent = 'arXiv:' + reResult[1] + (reResult[2] || '');
        }
      }
    },
    {
      name: 'Pixiv',
      id: 'embed_pixiv',
      className: 'pixiv',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/www\.pixiv\.net\/member_illust\.php\?((?:\w+=\w+&)*illust_id=(\d+)(?:&\w+=\w+)*)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, , illustId] = reResult;

        const predicates = [
          {
            msg: response => 'Private work',
            test: response => (response.status != 200) && response.responseText.includes('work private'),
            permanent: response => true
          },
          {
            msg: response => (response.statusText ? `${response.status} - ${response.statusText}` : `${response.status}`),
            test: response => response.status != 200,
            permanent: response => response.status != 503
          },
          {
            msg: response => 'Deleted work',
            test: response => response.responseText.includes('This work was deleted'),
            permanent: response => true
          }
        ];
        const callback = response => {
          let isMultipage = (url.includes('mode=manga') || response.responseText.includes('member_illust.php?mode=manga'));
          const metaRe = /<\s*meta\s+(?:property|name)\s*=\s*\"([^\"]+)\"\s+content\s*=\s*\"([^\"]*)\"\s*\/?>/gmi;
          let matches = getAllMatchesAndCaptureGroups(metaRe, response.responseText).map(m => ({ k: (m[1] || m[3]).toLowerCase(), v: m[2] }));
          let meta = {}; [].forEach.call(matches, m => { meta[m.k] = m.v; });
          let title = meta['twitter:title'] || meta['og:title'];
          let image = /* meta['twitter:image'] || meta['og:image'] || */ '//embed.pixiv.net/decorate.php?illust_id=' + illustId;
          let description = meta['twitter:description'] || meta['og:description'];

          let [, dateStr] = /<span\s+class=\"date\">([^<]+)<\/span>/.exec(response.responseText) || [];
          let [, authorId, authorName] = /<a\s+href="\/?member\.php\?id=(\d+)">\s*<img\s+src="[^"]+"\s+alt="[^"]+"\s+title="([^"]+)"\s\/?>/i.exec(response.responseText) || [];

          let dateDiv = (dateStr) ? `<div class="date">${dateStr}</div>` : '';
          let authorStr = (authorId) ? ` by <a href="//www.pixiv.net/member_illust.php?id=${authorId}">${authorName}</a>` : '';
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                ${isMultipage ? '(multipage) ' : ''}<a href="${url}">${title}</a>${authorStr}
              </div>
              ${dateDiv}
            </div>
            <a href="${aNode.href}"><img src="${image}"></a>
            ${description ? '<p>' + description + '</p>' : ''}`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(url.replace(/mode=\w+/, 'mode=medium'), 3000, predicates).then(callback));
      }
    },
    {
      name: 'Gelbooru',
      id: 'embed_gelbooru',
      className: 'gelbooru booru',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?:www\.)?(gelbooru\.com|safebooru\.org)\/index\.php\?((?:\w+=\w+&)*id=(\d+)(?:&\w+=\w+)*)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, domain, , illustId] = reResult;
        let apiUrl = `https://${domain}/index.php?page=dapi&s=post&q=index&id=${illustId}&json=1`;

        const callback = response => {
          const json = JSON.parse(response.responseText);
          if (json.count === 0) {
            throw { reason: illustId + ' is not available', response: response, permanent: true, url: apiUrl };
          }

          const post = json.post[0];
          const saucenaoUrl = `https://img3.saucenao.com/booru/${post.md5[0]}/${post.md5[1]}/${post.md5}_2.jpg`;
          let createdDateStr = (new Date(post.created_at)).toLocaleDateString('ru-RU');
          const changedDateStr = (new Date(1000 * parseInt(post.change, 10))).toLocaleDateString('ru-RU');
          if (createdDateStr != changedDateStr) { createdDateStr += ` (${changedDateStr})`; }
          const ratingStr = (post.rating == 's') ? '' : ` (${post.rating})`;
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                <a href="${url}">${post.id}</a>${ratingStr}${post.has_notes ? ' (notes)' : ''}${post.has_comments ? ' (comments)' : ''}
              </div>
              <div class="date">${createdDateStr}</div>
            </div>
            <div class="bottom-right">
              <div>
                <a href="https://www.iqdb.org/?url=${post.preview_url}">IQDB</a>, <a href="https://saucenao.com/search.php?url=${post.preview_url}">SauceNAO</a>
              </div>
            </div>
            <a href="${aNode.href}">
              <img class="rating_${post.rating}" src="${post.preview_url}" onerror="this.onerror=null;this.src='${saucenaoUrl}';">
            </a>
            `;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      },
      makeTitle: function([, domain, , illustId]) { return `${domain} (${illustId})`; },
      linkTextUpdate: function(aNode, [, , , illustId]) { aNode.textContent += ` (${illustId})`; }
    },
    {
      name: 'Danbooru',
      id: 'embed_danbooru',
      className: 'danbooru booru',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(danbooru|safebooru)\.donmai\.us\/post(?:s|\/show)\/(\d+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, domain, id] = reResult;
        url = url.replace('http:', 'https:');
        let urls = (domain == 'safebooru')
          ? [`https://${domain}.donmai.us/posts/${id}.json`]
          : [`https://${domain}.donmai.us/posts/${id}.json`, `https://safebooru.donmai.us/posts/${id}.json`];

        const callback = response => {
          let [finalUrl, finalDomain, ] = thisType.re.exec(response.finalUrl);
          let json = JSON.parse(response.responseText);
          if (!json.preview_file_url) {
            div.innerHTML = `<span>Can't show <a href="${finalUrl}">${id}</a> (<a href="${url}">${json.rating}</a>)</span>`;
            return;
          }

          let finalPreviewUrl = `https://${finalDomain}.donmai.us${json.preview_file_url}`;
          let saucenaoUrl = `https://img3.saucenao.com/booru/${json.md5[0]}/${json.md5[1]}/${json.md5}_2.jpg`;
          let tagsStr = [json.tag_string_artist, json.tag_string_character, json.tag_string_copyright]
                          .filter(s => s != '')
                          .map(s => (s.count(' ') > 1) ? naiveEllipsisRight(s, 40) : `<a href="https://${finalDomain}.donmai.us/posts?tags=${encodeURIComponent(s)}">${s}</a>`)
                          .join('<br>');
          let notesStr = (json.last_noted_at) ? ' (notes)' : '';
          let commentsStr = (json.last_commented_at) ? ' (comments)' : '';
          let ratingStr = (json.rating == 's') ? '' : ` (<a href="${url}">${json.rating}</a>)`;
          let createdDateStr = (new Date(json.created_at)).toLocaleDateString('ru-RU');
          let updatedDateStr = (new Date(json.updated_at)).toLocaleDateString('ru-RU');
          if (createdDateStr != updatedDateStr) { createdDateStr += ` (${updatedDateStr})`; }
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title"><a href="${finalUrl}">${id}</a>${ratingStr}${notesStr}${commentsStr}</div>
              <div class="date">${createdDateStr}</div>
            </div>
            <div class="bottom-right">
              <div class="booru-tags">${tagsStr}</div>
              <div>
                <a href="https://www.iqdb.org/?url=${finalPreviewUrl}">IQDB</a>, <a href="https://saucenao.com/search.php?url=${finalPreviewUrl}">SauceNAO</a>
              </div>
            </div>
            <a href="${finalUrl}">
              <img class="rating_${json.rating}" src="${finalPreviewUrl}" onerror="this.onerror=null;this.src='${saucenaoUrl}';">
            </a>
            `;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrFirstResponse(urls, 3000).then(callback));
      },
      makeTitle: function([, domain, id]) { return `${domain} (${id})`; },
      linkTextUpdate: function(aNode, [, , id]) {
        aNode.href = aNode.href.replace('http:', 'https:');
        aNode.textContent += ` (${id})`;
      }
    },
    {
      name: 'Konachan',
      id: 'embed_konachan',
      className: 'konachan booru',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/konachan\.(com|net)\/post\/show\/(\d+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, domain, id] = reResult;
        url = url.replace('.com/', '.net/');
        let unsafeUrl = url.replace('.net/', '.com/');
        let apiUrls = [ `https://konachan.net/post.json?tags=id:${id}`, `https://konachan.com/post.json?tags=id:${id}` ];

        const callback = response => {
          let json = (JSON.parse(response.responseText))[0];
          if (!json || !json.preview_url) {
            div.innerHTML = `<span>Can't show <a href="${url}">${id}</a> (<a href="${unsafeUrl}">${json.rating}</a>)</span>'`;
            return;
          }

          let saucenaoUrl = `https://img3.saucenao.com/booru/${json.md5[0]}/${json.md5[1]}/${json.md5}_2.jpg`;
          let createdDateStr = (new Date(1000 * parseInt(json.created_at, 10))).toLocaleDateString('ru-RU');
          let ratingStr = (json.rating == 's') ? '' : ` (<a href="${unsafeUrl}">${json.rating}</a>)`;
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title"><a href="${url}">${id}</a>${ratingStr}</div>
              <div class="date">${createdDateStr}</div>
            </div>
            <div class="bottom-right">
              <div>
                <a href="https://www.iqdb.org/?url=${json.preview_url}">IQDB</a>, <a href="https://saucenao.com/search.php?url=${json.preview_url}">SauceNAO</a>
              </div>
            </div>
            <a href="${url}"><img class="rating_${json.rating}" src="${json.preview_url}" onerror="this.onerror=null;this.src='${saucenaoUrl}';"></a>
            `;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrFirstResponse(apiUrls, 3000).then(callback));
      },
      makeTitle: function([, , id]) { return `konachan (${id})`; },
      linkTextUpdate: function(aNode, [, , id]) { aNode.textContent += ` (${id})`; }
    },
    {
      name: 'yande.re',
      id: 'embed_yandere',
      className: 'yandere booru',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/yande\.re\/post\/show\/(\d+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, id] = reResult;
        let apiUrl = 'https://yande.re/post.json?tags=id:' + id;

        const callback = response => {
          let json = (JSON.parse(response.responseText))[0];
          if (!json || !json.preview_url) {
            div.innerHTML = `<span>Can't show <a href="${url}">${id}</a> (${json.rating})</span>`;
            return;
          }

          let ratingStr = (json.rating == 's') ? '' : ` (${json.rating})`;
          let notesStr = (json.last_noted_at && json.last_noted_at !== 0) ? ' (notes)' : '';
          let commentsStr = (json.last_commented_at && json.last_commented_at !== 0) ? ' (comments)' : '';
          let createdDateStr = (new Date(1000 * json.created_at)).toLocaleDateString('ru-RU');
          let updatedDateStr = (new Date(1000 * json.updated_at)).toLocaleDateString('ru-RU');
          if (createdDateStr != updatedDateStr && json.updated_at != 0) { createdDateStr += ` (${updatedDateStr})`; }
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title"><a href="${url}">${id}</a>${ratingStr}${notesStr}${commentsStr}</div>
              <div class="date">${createdDateStr}</div>
            </div>
            <div class="bottom-right">
              <div>
                <a href="https://www.iqdb.org/?url=${json.preview_url}">IQDB</a>, <a href="https://saucenao.com/search.php?url=${json.preview_url}">SauceNAO</a>
              </div>
            </div>
            <a href="${url}"><img class="rating_${json.rating}" src="${json.preview_url}"></a>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      },
      makeTitle: function([, id]) { return `yande.re (${id})`; },
      linkTextUpdate: function(aNode, [, id]) { aNode.textContent += ` (${id})`; }
    },
    {
      name: 'anime-pictures.net',
      id: 'embed_anime_pictures_net',
      className: 'anime-pictures booru',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/anime-pictures\.net\/pictures\/view_post\/(\d+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, id] = reResult;

        const predicates = [
          {
            msg: response => 'Click to show ' + thisType.makeTitle(reResult),
            test: response => response.status == 503,
            permanent: response => false
          },
          {
            msg: response => (response.statusText ? `${response.status} - ${response.statusText}` : `${response.status}`),
            test: response => response.status != 200,
            permanent: response => true
          },
          {
            msg: response => 'Login required',
            test: response => response.responseText.includes('must be logged in'),
            permanent: response => true
          }
        ];
        const callback = response => {
          const metaRe = /<\s*meta\s+(?:(?:property|name)\s*=\s*\"([^\"]+)\"\s+)?content\s*=\s*\"([^\"]*)\"(?:\s+(?:property|name)\s*=\s*\"([^\"]+)\")?\s*>/gmi;
          let matches = getAllMatchesAndCaptureGroups(metaRe, response.responseText);
          let imageUrl = matches.find(m => (m[1] || m[3]) == 'og:image')[2];

          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                <a href="${url}">${id}</a>
              </div>
            </div>
            <div class="bottom-right">
              <a href="https://www.iqdb.org/?url=${imageUrl}">IQDB</a>
              <a href="https://saucenao.com/search.php?url=${imageUrl}">SauceNAO</a>
            </div>
            <a href="${aNode.href}"><img src="${imageUrl}"></a>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(url, 3000, predicates).then(callback));
      },
      makeTitle: function([, id]) { return `anime-pictures.net (${id})`; },
      linkTextUpdate: function(aNode, [, id]) { aNode.textContent += ` (${id})`; }
    },
    {
      name: 'derpibooru.org',
      id: 'embed_derpibooru',
      className: 'derpibooru booru',
      onByDefault: false,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/derpibooru\.org\/(?:images\/)?(\d+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, id] = reResult;
        let apiUrl = 'https://derpibooru.org/api/v1/json/images/' + id;

        const callback = response => {
          let json = JSON.parse(response.responseText);
          if (!json || !json.image) {
            div.innerHTML = `<span>Can't show <a href="${url}">${id}</a></span>`;
            console.log(response);
            return;
          }
          json = json.image;

          let createdDateStr = (new Date(json.created_at)).toLocaleDateString('ru-RU');
          const tagEncode = t => t.replace(/ /g, '+').replace(/:/g, '-colon-');
          let tagsStr = json.tags
                            .map(t => `<a href="https://derpibooru.org/tags/${tagEncode(t)}">${t}</a>`)
                            .join(', ');
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title"><a href="${url}">${json.description}</a></div>
              <div class="date">${createdDateStr}</div>
            </div>
            <a href="${url}"><img src="${json.representations.medium}"></a>
            <div class="booru-tags">${tagsStr}</div>
            <div class="bottom">
              <div class="source">
                <a href="${json.source_url}">Source</a>, uploaded by <a href="https://derpibooru.org/profiles/${json.uploader}">${json.uploader}</a>
              </div>
              <div class="right">
                <div class="faves">${svgIconHtml('star')}${json.faves}</div>
                <div class="votes">${svgIconHtml('heart')}${json.score} (${json.upvotes}↑ ${json.downvotes}↓)</div>
                <div class="replies">${svgIconHtml('comment')}${json.comment_count}</div>
            </div>
            </div>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(apiUrl, 3000).then(callback));
      },
      makeTitle: function([, id]) { return `derpibooru (${id})`; },
      linkTextUpdate: function(aNode, [, id]) { aNode.textContent += ` (${id})`; }
    },
    {
      name: 'Яндекс.Фотки',
      id: 'embed_yandex_fotki',
      className: 'picture compact',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/img-fotki\.yandex\.ru\/get\/\d+\/[\w\.]+\/[\w]+$/i,
      makeNode: function(aNode, reResult, div) {
        div.innerHTML = `<a href="${aNode.href}"><img src="${aNode.href}"></a>`;
        return div;
      }
    },
    {
      name: 'pikabu',
      id: 'embed_pikabu',
      className: 'pikabu',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/pikabu\.ru\/story\/([a-z0-9_]+)/i,
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url, ] = reResult;

        const callback = response => {
          const metaRe = /<\s*meta\s+(?:(?:property|name)\s*=\s*[\"']([^\"']+)[\"']\s+)?content\s*=\s*\"([^\"]*)\"(?:\s+(?:property|name)\s*=\s*\"([^\"]+)\")?(?:\s*(?:\w+=\"[^\"]*\"))*\s*\/?>/gmi;
          let matches = getAllMatchesAndCaptureGroups(metaRe, response.responseText).map(m => ({ k: (m[1] || m[3]).toLowerCase(), v: m[2] }));
          let meta = {}; [].forEach.call(matches, m => { meta[m.k] = m.v; });
          let title = htmlDecode(meta['twitter:title'] || meta['og:title']);
          let description = htmlDecode(longest([meta['og:description'], meta['twitter:description'], '']));
          let image = meta['twitter:image:src'];
          let imageStr = (image) ? `<a href="${url}"><img src="${image}" /></a>` : '';
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                <a href="${url}">${title}</a>
              </div>
            </div>
            ${imageStr}
            <div class="desc">${description}</div>`;
        };

        return doFetchingEmbed(aNode, reResult, div, thisType, () => xhrGetAsync(url, 3000).then(callback));
      }
    },
    {
      name: 'Use meta for other links (whitelist)',
      id: 'embed_whitelisted_domains',
      className: 'other',
      onByDefault: true,
      ctsDefault: false,
      re: /^(?:https?:)?\/\/(?!juick\.com\b).*/i,
      match: function(aNode, reResult) {
        let domain = aNode.hostname.replace(/^(?:www|m)\./, '');
        let domainsWhitelist = GM_getValue('domains_whitelist', getDefaultDomainWhitelist().join('\n')).split(/\r?\n/);
        return domainsWhitelist.some(w => matchWildcard(domain, w));
      },
      makeNode: function(aNode, reResult, div) {
        let thisType = this;
        let [url] = reResult;
        let domain = aNode.hostname;

        const checkContentType = response => {
          const headRe = /^([\w-]+): (.+)$/gmi;
          let headerMatches = getAllMatchesAndCaptureGroups(headRe, response.responseHeaders);
          let [, , contentType] = headerMatches.find(([, k, ]) => (k.toLowerCase() == 'content-type'));
          if (contentType && contentType.match(/^text\/html\b/i)) {
            return;
          } else {
            throw { reason: 'not text/html' };
          }
        };

        const callback = response => {
          const metaRe = /<\s*meta\s+(?:(?:property|name)\s*=\s*[\"']([^\"']+)[\"']\s+)?content\s*=\s*\"([^\"]*)\"(?:\s+(?:property|name)\s*=\s*\"([^\"]+)\")?(?:\s*(?:\w+=\"[^\"]*\"))*\s*\/?>/gmi;
          const titleRe = /<title>([\s\S]+?)<\/title>/gmi;
          let [, basicTitle] = titleRe.exec(response.responseText) || [];
          let matches = getAllMatchesAndCaptureGroups(metaRe, response.responseText).map(m => ({ k: (m[1] || m[3]).toLowerCase(), v: m[2] }));
          let meta = {}; [].forEach.call(matches, m => { meta[m.k] = m.v; });
          let title = meta['twitter:title'] || meta['og:title'] || meta['title'] || basicTitle || meta['sailthru.title'];
          let image = meta['twitter:image'] || meta['twitter:image:src'] || meta['og:image'] || meta['sailthru.image.full'];
          let description = longest([meta['og:description'], meta['twitter:description'], meta['description'], meta['sailthru.description']]);
          let isEnoughContent = title && description && (title.length > 0) && (description.length > 0);
          if (!isEnoughContent) {
            throw { reason: 'not enough meta content to embed' };
          }
          let imageStr = (image) ? `<a href="${url}"><img src="${image}" /></a>` : '';
          description = htmlDecode(description).replace(/\n+/g,'<br/>');
          div.innerHTML = /*html*/`
            <div class="top">
              <div class="title">
                <a href="${url}">${title}</a>
              </div>
            </div>
            ${imageStr}
            <div class="desc">${description}</div>`;
          div.classList.add(domain.replace(/\./g, '_'));
        };

        const unembed = e => {
          if (e.reason) { console.log(`${e.reason} - ${url}`); }
          div.remove();
          aNode.className = '';
        };

        return doFetchingEmbed(aNode, reResult, div, thisType,
                               () => xhrGetAsync(url, 1000, undefined, 'HEAD')
                                  .then(checkContentType)
                                  .then(() => { return xhrGetAsync(url, 1500).then(callback); })
                                  .catch(e => unembed(e))
        );
      }
    }
  ];
}

function getDefaultDomainWhitelist() {
  return [
    'lenta.ru',
    'meduza.io',
    'rbc.ru',
    'tjournal.ru',
    '*.newsru.com',
    '*.itar-tass.com',
    'tass.ru',
    'rublacklist.net',
    'mk.ru',
    'gazeta.ru',
    'republic.ru',
    'bash.im',
    'ixbt.com',
    'techxplore.com',
    'medicalxpress.com',
    'phys.org',
    'techcrunch.com',
    'bbc.com',
    'nplus1.ru',
    'elementy.ru',
    'news.tut.by',
    'imdb.com',
    'mastodon.social',
    'mastodonsocial.ru'
  ];
}

function embedLink(aNode, linkTypes, container, alwaysCts, afterNode) {
  let anyEmbed = false;
  let linkId = (aNode.href.replace(/^https?:/i, '').replace(/\'/gi,''));
  let sameEmbed = container.querySelector(`*[data-linkid='${linkId}']`); // do not embed the same thing twice
  if (sameEmbed) {
    if (GM_getValue('enable_arrows', true)) { aNode.classList.add('arrow'); }
    setHighlightOnHover(aNode, sameEmbed);
    //setMoveIntoViewOnHover(aNode, aNode, newNode, 5, 30);
  } else {
    anyEmbed = [].some.call(linkTypes, function(linkType) {
      if (GM_getValue(linkType.id, linkType.onByDefault)) {
        let reResult = linkType.re.exec(aNode.href);
        if (reResult) {
          if (linkType.match && (linkType.match(aNode, reResult) === false)) { return false; }

          let newNode = makeNewNode(linkType, aNode, reResult, alwaysCts);
          if (!newNode) { return false; }

          newNode.setAttribute('data-linkid', linkId);
          if (afterNode) {
            insertAfter(newNode, afterNode);
          } else {
            container.appendChild(newNode);
          }

          aNode.classList.add('embedLink');
          if (GM_getValue('enable_arrows', true)) { aNode.classList.add('arrow'); }
          if (GM_getValue('enable_link_text_update', true) && linkType.linkTextUpdate) { linkType.linkTextUpdate(aNode, reResult); }

          setHighlightOnHover(aNode, newNode);
          //setMoveIntoViewOnHover(aNode, aNode, newNode, 5, 30);
          return true;
        }
      }
    });
  }
  return anyEmbed;
}

function embedLinks(aNodes, container, alwaysCts, afterNode) {
  let anyEmbed = false;
  let embeddableLinkTypes = getEmbeddableLinkTypes();
  Array.from(aNodes).forEach(aNode => {
    let isEmbedded = embedLink(aNode, embeddableLinkTypes, container, alwaysCts, afterNode);
    anyEmbed = anyEmbed || isEmbedded;
  });
  return anyEmbed;
}

function splitUsersAndTagsLists(str) {
  let items = str.split(/[\s,]+/);
  let users = items.filter(x => x.startsWith('@')).map(x => x.replace('@','').toLowerCase());
  let tags = items.filter(x => x.startsWith('*')).map(x => x.replace('*','').toLowerCase());
  return [users, tags];
}

function articleInfo(article) {
  let tagNodes = article.querySelectorAll('.msg-tags > *');
  let tags = Array.from(tagNodes).map(d => d.textContent.toLowerCase());
  return { userId: getPostUserName(article), tags: tags };
}

function isFilteredX(x, filteredUsers, filteredTags) {
  let {userId, tags} = articleInfo(x);
  return (filteredUsers && userId && filteredUsers.indexOf(userId.toLowerCase()) !== -1)
         || (intersect(tags, filteredTags).length > 0);
}

function embedLinksToX(x, beforeNodeSelector, allLinksSelector, ctsUsers, ctsTags) {
  let isCtsPost = isFilteredX(x, ctsUsers, ctsTags);
  let allLinks = x.querySelectorAll(allLinksSelector);

  let existingContainer = x.querySelector('div.embedContainer');
  if (existingContainer) {
    embedLinks(allLinks, existingContainer, isCtsPost);
  } else {
    let embedContainer = document.createElement('div');
    embedContainer.className = 'embedContainer';

    let anyEmbed = embedLinks(allLinks, embedContainer, isCtsPost);
    if (anyEmbed) {
      let beforeNode = x.querySelector(beforeNodeSelector);
      x.insertBefore(embedContainer, beforeNode);
    }
  }
}

function embedLinksToArticles() {
  let [ctsUsers, ctsTags] = splitUsersAndTagsLists(GM_getValue('cts_users_and_tags', ''));
  let beforeNodeSelector = 'nav.l';
  let allLinksSelector = '.msg-txt > a, pre a';
  setTimeout(function() {
    Array.from(document.querySelectorAll('#content article[data-mid]')).forEach(article => {
      embedLinksToX(article, beforeNodeSelector, allLinksSelector, ctsUsers, ctsTags);
    });
  }, 50);
}

function embedLinksToPost() {
  let [ctsUsers, ctsTags] = splitUsersAndTagsLists(GM_getValue('cts_users_and_tags', ''));
  let beforeNodeSelector = '.msg-txt + *';
  let allLinksSelector = '.msg-txt > a, pre a';
  setTimeout(function() {
    Array.from(document.querySelectorAll('#content .msg-cont')).forEach(msg => {
      embedLinksToX(msg, beforeNodeSelector, allLinksSelector, ctsUsers, ctsTags);
    });
  }, 50);
}

function filterArticles() {
  let [filteredUsers, filteredTags] = splitUsersAndTagsLists(GM_getValue('filtered_users_and_tags', ''));
  let keepHeader = GM_getValue('filtered_posts_keep_header', true);
  Array.from(document.querySelectorAll('#content article[data-mid]'))
       .filter(article => isFilteredX(article, filteredUsers, filteredTags))
       .forEach(article => {
         if (keepHeader) {
           article.classList.add('filtered');
           while (article.children.length > 1) { article.removeChild(article.lastChild); }
         } else {
           article.remove();
         }
       });
}

function filterPostComments() {
  let [filteredUsers, filteredTags] = splitUsersAndTagsLists(GM_getValue('filtered_users_and_tags', ''));
  let keepHeader = GM_getValue('filtered_posts_keep_header', true);
  Array.from(document.querySelectorAll('#content #replies .msg-cont')).forEach(reply => {
    let isFilteredComment = isFilteredX(reply, filteredUsers, filteredTags);
    if (isFilteredComment) {
      reply.classList.add('filteredComment');
      reply.querySelector('.msg-txt').remove();
      reply.querySelector('.embedContainer')?.remove();
      reply.querySelector('.msg-media')?.remove();
      reply.querySelector('.msg-comment-target').remove();
      let linksDiv = reply.querySelector('.msg-links');
      linksDiv.querySelector('.a-thread-comment').remove();
      linksDiv.innerHTML = linksDiv.innerHTML.replace(' · ', '');
      if (!keepHeader) {
        reply.classList.add('headless');
        reply.querySelector('.msg-header').remove();
      }
    }
  });
}

function setHighlightOnHover(hoverTarget, highlightable) {
  highlightable.classList.toggle('highlightable', true);
  hoverTarget.addEventListener('mouseenter', e => highlightable.classList.toggle('hoverHighlight', true), false);
  hoverTarget.addEventListener('mouseleave', e => highlightable.classList.toggle('hoverHighlight', false), false);
}

function setMoveIntoViewOnHover(hoverTarget, avoidTarget, movable, avoidMargin=0, threshold=0) {
  if (!movable) { return; }

  function checkFullyVisible(node, threshold=0) {
    let rect = node.getBoundingClientRect();
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    let above = rect.top + threshold < 0;
    let below = rect.bottom - threshold - viewHeight >= 0;
    return !above && !below;
  }

  function resetMovementArtifacts(node) {
    node.removeEventListener('transitionend', afterBackTransition, false);
    node.classList.toggle('moved', false);
    node.classList.toggle('hoverHighlight', false);
  }

  function moveNodeIntoView(node, avoidNode, avoidMargin=0, threshold=0) {
    resetMovementArtifacts(node);
    node.classList.toggle('hoverHighlight', true);
    let onscreen = checkFullyVisible(node, threshold);
    if (!onscreen) {
      let parentNodeRect = node.parentNode.getBoundingClientRect();
      let avoidNodeRect = avoidNode.getBoundingClientRect();
      let [w, h] = [node.offsetWidth, node.offsetHeight];
      let vtop = parentNodeRect.top;
      let atop = avoidNodeRect.top - avoidMargin;
      let ah = avoidNodeRect.height + 2*avoidMargin;
      let wh = window.innerHeight;
      let isAbove = (vtop < atop);
      let moveAmount = isAbove ? (0-vtop-h+atop) : (0-vtop+atop+ah);
      let availableSpace = isAbove ? (atop - avoidMargin) : (wh - atop - ah + avoidMargin);
      if ((Math.abs(moveAmount) > threshold) && (availableSpace > threshold*2)) {
        let s = getComputedStyle(node);
        node.classList.toggle('moved', true);
        node.style.marginTop = `${moveAmount}px`;
        node.parentNode
            .querySelector('.movable + .placeholder')
            .setAttribute('style', `width: ${w}px; height: ${h}px; margin: ${s.margin};`);
      }
    }
  }

  function afterBackTransition(event) { resetMovementArtifacts(event.target); }

  function moveNodeBack(node) {
    const eventType = 'transitionend';
    if (node.classList.contains('moved')) {
      let parentNodeRect = node.parentNode.getBoundingClientRect();
      let nodeRect = node.getBoundingClientRect();
      if (Math.abs(parentNodeRect.top - nodeRect.top) > 1) {
        node.addEventListener(eventType, afterBackTransition, false);
      } else {
        resetMovementArtifacts(node);
      }
      node.style.marginTop = '';
    } else {
      node.classList.toggle('hoverHighlight', false);
    }
  }

  hoverTarget.addEventListener('mouseenter', e => { moveNodeIntoView(movable, avoidTarget, avoidMargin, threshold); }, false);
  hoverTarget.addEventListener('mouseleave', e => { moveNodeBack(movable); }, false);
  movable.parentNode.classList.toggle('movableContainer', true);
  movable.classList.toggle('movable', true);
  if (!movable.parentNode.querySelector('.movable + .placeholder')) {
    let pldr = document.createElement('div');
    pldr.className = 'placeholder';
    insertAfter(pldr, movable);
  }
}

function bringCommentsIntoViewOnHover() {
  let replies = Array.from(document.querySelectorAll('#replies li'));
  let nodes = {};
  replies.forEach(r => { nodes[r.id] = r.querySelector('div.msg-cont'); });
  replies.forEach(r => {
    let replyToLink = Array.from(r.querySelectorAll('.msg-links a')).find(a => /\d+/.test(a.hash));
    if (replyToLink) {
      let rtid = replyToLink.hash.replace(/^#/, '');
      setMoveIntoViewOnHover(replyToLink, nodes[r.id], nodes[rtid], 5, 30);
    }
  });
}

function checkReply(allPostsSelector, ...replySelectors) {
  getMyUserNameAsync().then(uname => {
    Array.from(document.querySelectorAll(allPostsSelector))
         .filter(p => (getPostUserName(p) != uname) && (!replySelectors.some(s => p.querySelector(s))))
         .forEach(p => p.classList.add('readonly'));
  }).catch(err => console.info(err));
}

function checkReplyArticles() {
  checkReply('#content article[data-mid]', 'nav.l > a.a-comment');
}

function checkReplyPost() {
  checkReply('#content div.msg-cont', 'a.a-thread-comment', '.msg-comment');
}

function markReadonlyPost() {
  if (document.title.match(/\B\*readonly\b/)) {
    document.querySelector('#content .msg-cont .msg-tags')
            .insertAdjacentHTML('beforeend', '<a class="virtualTag" href="#readonly">readonly</a>');
  }
}

function makeSettingsCheckbox(caption, id, defaultState) {
  let label = document.createElement('label');
  let cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = GM_getValue(id, defaultState);
  cb.onclick = (e => GM_setValue(id, cb.checked));
  label.appendChild(cb);
  label.appendChild(document.createTextNode(caption));
  return label;
}

function makeSettingsTextbox(caption, id, defaultString, placeholder) {
  let label = document.createElement('label');
  let wrapper = document.createElement('div');
  wrapper.className = 'ta-wrapper';
  let textarea = document.createElement('textarea');
  textarea.className = id;
  textarea.placeholder = placeholder;
  textarea.title = placeholder;
  textarea.value = GM_getValue(id, defaultString);
  textarea.oninput = (e => GM_setValue(id, textarea.value));
  wrapper.appendChild(textarea);
  label.appendChild(document.createTextNode('' + caption + ': '));
  label.appendChild(wrapper);
  return label;
}

function showUserscriptSettings() {
  let h1 = document.createElement('h1');
  h1.textContent = 'Tweaks';

  let uiFieldset = document.createElement('fieldset');
  { // UI
    let uiLegend = document.createElement('legend');
    uiLegend.textContent = 'UI';
    uiFieldset.appendChild(uiLegend);

    let list1 = document.createElement('ul');
    userscriptFeatures
      .filter(item => !!item.name && !!item.id)
      .map(item => makeSettingsCheckbox(item.name, item.id, item.enabledByDefault))
      .map(cb => wrapIntoTag(wrapIntoTag(cb, 'p'), 'li'))
      .forEach(item => list1.appendChild(item));
    uiFieldset.appendChild(list1);
  }

  let embeddingFieldset = document.createElement('fieldset');
  { // Embedding
    let embeddingLegend = document.createElement('legend');
    embeddingLegend.textContent = 'Embedding';

    let embeddingTable = document.createElement('table');
    embeddingTable.style.width = '100%';
    getEmbeddableLinkTypes().forEach(linkType => {
      let row = document.createElement('tr');
      row.appendChild(wrapIntoTag(makeSettingsCheckbox(linkType.name, linkType.id, linkType.onByDefault), 'td'));
      row.appendChild(wrapIntoTag(makeSettingsCheckbox('Click to show', 'cts_' + linkType.id, linkType.ctsDefault), 'td'));
      embeddingTable.appendChild(row);
    });

    let domainsWhitelist = makeSettingsTextbox('Domains whitelist ("*" wildcard is supported)', 'domains_whitelist', getDefaultDomainWhitelist().join('\n'), 'One domain per line. "*" wildcard is supported');

    let moveIntoViewOnSamePageCheckbox = makeSettingsCheckbox('Ссылки на ту же страницу не встраивать, а показывать при наведении', 'enable_move_into_view_on_same_page', true);
    let updateLinkTextCheckbox = makeSettingsCheckbox('Обновлять текст ссылок, если возможно (например, "juick.com" на #123456/7)', 'enable_link_text_update', true);
    let ctsUsersAndTags = makeSettingsTextbox('Всегда использовать "Click to show" для этих юзеров и тегов в ленте', 'cts_users_and_tags', '', '@users and *tags separated with space or comma');
    ctsUsersAndTags.style = 'display: flex; flex-direction: column; align-items: stretch;';

    setContent(
      embeddingFieldset,
      embeddingLegend,
      embeddingTable,
      wrapIntoTag(domainsWhitelist, 'p'),
      document.createElement('hr'),
      wrapIntoTag(ctsUsersAndTags, 'p'),
      wrapIntoTag(updateLinkTextCheckbox, 'p'),
      wrapIntoTag(moveIntoViewOnSamePageCheckbox, 'p')
    );
  }

  let filteringFieldset = document.createElement('fieldset');
  { // Filtering
    let filteringLegend = document.createElement('legend');
    filteringLegend.textContent = 'Filtering';

    let filteringUsersAndTags = makeSettingsTextbox('Убирать посты этих юзеров или с этими тегами из общей ленты', 'filtered_users_and_tags', '', '@users and *tags separated with space or comma');
    filteringUsersAndTags.style = 'display: flex; flex-direction: column; align-items: stretch;';
    let keepHeadersCheckbox = makeSettingsCheckbox('Оставлять заголовки постов', 'filtered_posts_keep_header', true);
    let filterCommentsCheckbox = makeSettingsCheckbox('Также фильтровать комментарии этих юзеров', 'filter_comments_too', false);

    setContent(
      filteringFieldset,
      filteringLegend,
      wrapIntoTag(filteringUsersAndTags, 'p'),
      wrapIntoTag(keepHeadersCheckbox, 'p'),
      wrapIntoTag(filterCommentsCheckbox, 'p')
    );
  }

  let resetButton = document.createElement('button');
  { // Reset button
    resetButton.textContent = 'Reset userscript settings to default';
    resetButton.onclick = function(e){
      if (!confirm('Are you sure you want to reset Tweaks settings to default?')) { return; }
      GM_listValues().slice().forEach(key => GM_deleteValue(key));
      showUserscriptSettings();
      alert('Done!');
    };
  }

  let versionInfoFieldset = document.createElement('fieldset');
  { // Version info
    let versionInfoLegend = document.createElement('legend');
    versionInfoLegend.textContent = 'Version info';
    let ver1 = document.createElement('p');
    let ver2 = document.createElement('p');
    ver1.textContent = 'Userscript version: ' + GM_info.script.version;
    ver2.textContent = 'Greasemonkey (or your script runner) version: ' + GM_info.version;
    setContent(versionInfoFieldset, versionInfoLegend, ver1, ver2);
  }

  let support = document.createElement('p');
  support.innerHTML = 'Feedback and feature requests <a href="//juick.com/killy/?tag=userscript">here</a>.';

  Array.from(document.querySelectorAll('#content article')).forEach(ar => ar.style.display = 'none');
  let article = document.createElement('article');
  let other = document.querySelector('#content article');
  other.parentNode.insertBefore(article, other);
  setContent(article, h1, uiFieldset, embeddingFieldset, filteringFieldset, resetButton, versionInfoFieldset, support);
  article.className = 'tweaksSettings';
  window.scrollTo(0, 0);
}

function addTweaksSettingsButton() {
  let tabsList = document.querySelector('#pagetabs > div');
  let aNode = document.createElement('a');
  aNode.textContent = 'Tweaks';
  aNode.href = '#tweaks';
  aNode.onclick = (e => { e.preventDefault(); showUserscriptSettings(); });
  tabsList.appendChild(aNode);
}

function addTweaksSettingsFooterLink() {
  let footerLinks = document.querySelector('#footer-right');
  let aNode = document.createElement('a');
  aNode.textContent = 'Tweaks';
  aNode.href = '#tweaks';
  aNode.onclick = (e => { e.preventDefault(); showUserscriptSettings(); });
  footerLinks.insertBefore(aNode, footerLinks.firstChild);
}

function updateUserRecommendationStats(userId, pagesPerCall) {
  let article = document.createElement('article');
  let userCounters = {};
  let totalRecs = 0;

  function recUpdate(depth, oldestMid, oldestDate) {
    if (depth <= 0) { return; }

    let beforeStr = (oldestMid) ? ('&before=' + oldestMid) : '';
    let url = `//juick.com/${userId}/?show=recomm${beforeStr}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url: setProto(url),
      onload: function(response) {
        if (response.status != 200) {
          console.log(`${userId}: failed with ${response.status}, ${response.statusText}`);
          return;
        }

        const articleRe = /<article[\s\S]+?<\/article>/gmi;
        let articles = response.responseText.match(articleRe);
        if (!articles) {
          console.log('no more articles in response');
          return;
        }

        totalRecs = totalRecs + articles.length;
        let hasMore = (articles.length > 15);
        let oldestArticle = articles[articles.length - 1];

        const midRe = /data-mid="(\d+)"/i;
        const dateRe = /datetime\=\"([^\"]+) ([^\"]+)\"/i;
        let [, oldestMid] = midRe.exec(oldestArticle);
        let [, oldestDatePart, oldestTimePart] = dateRe.exec(oldestArticle);
        oldestDate = new Date(`${oldestDatePart}T${oldestTimePart}`);

        const userRe = /<span>([-\w]+)<\/span>/i;
        const userAvatarRe = /<img src="\/i\/a\/(\d+)-[0-9a-fA-F]+\.png" alt="[^\"]+"\/?>/i;
        let authors = articles.map(article => {
          let postAuthorId = (userRe.exec(article))[1];
          let postAuthorAvatar = (userAvatarRe.exec(article) || {0:''})[0];
          return {id: postAuthorId, avatar: postAuthorAvatar};
        });
        for (let i in authors) {
          let id = authors[i].id;
          let avatar = authors[i].avatar;
          if (id in userCounters) {
            userCounters[id].recs = userCounters[id].recs + 1;
          } else {
            userCounters[id] = {id: id, avatar: avatar, recs: 1};
          }
        }

        let sortedUsers = Object.values(userCounters).sort((a, b) => b.recs - a.recs);

        removeAllFrom(article);

        if (hasMore && (depth == 1)) {
          let moreButton = document.createElement('button');
          moreButton.style = 'float: right;';
          moreButton.textContent = 'Check older recommendations';
          moreButton.onclick = (e => recUpdate(pagesPerCall, oldestMid, oldestDate));
          article.appendChild(moreButton);
        }

        let datePNode = document.createElement('p');
        datePNode.textContent = `${totalRecs} recommendations since ${oldestDate.toLocaleDateString('ru-RU')}`;
        article.appendChild(datePNode);

        let avgPNode = document.createElement('p');
        let now = new Date();
        let days = ((now - oldestDate) / 1000 / 60 / 60 / 24);
        let avg = totalRecs / days;
        avgPNode.textContent = avg > 1.0
          ? '' + avg.toFixed(3) + ' recommendations per day'
          : 'one recommendation in ' + (1 / avg).toFixed(2) + ' days';
        article.appendChild(avgPNode);

        let userStrings = sortedUsers.map(x => `<li><a href="/${x.id}/">${x.avatar}${x.id}</a> / ${x.recs}</li>`);
        let ulNode = document.createElement('ul');
        ulNode.className = 'recUsers';
        ulNode.innerHTML = userStrings.join('');
        article.appendChild(ulNode);

        if (hasMore) {
          setTimeout(() => recUpdate(depth - 1, oldestMid, oldestDate), 100);
        } else {
          console.log('no more recommendations');
        }
      }
    });

  } // recUpdate

  let contentBlock = document.querySelector('section#content');
  setContent(contentBlock, article);
  recUpdate(pagesPerCall, undefined, undefined);
}

function addIRecommendLink() {
  let userId = getColumnUserName();
  let asideColumn = document.querySelector('aside#column');
  let ustatsList = asideColumn.querySelector('#ustats > ul');
  let li2 = ustatsList.querySelector('li:nth-child(2)');
  let liNode = document.createElement('li');
  let aNode = document.createElement('a');
  aNode.textContent = 'Я рекомендую';
  aNode.href = '#irecommend';
  aNode.onclick = (e => { e.preventDefault(); updateUserRecommendationStats(userId, 3); });
  liNode.appendChild(aNode);
  insertAfter(liNode, li2);
}

function addMentionsLink() {
  let userId = getColumnUserName();
  let asideColumn = document.querySelector('aside#column');
  let ustatsList = asideColumn.querySelector('#ustats > ul');
  let li2 = ustatsList.querySelector('li:nth-child(2)');
  let liNode = document.createElement('li');
  let aNode = document.createElement('a');
  aNode.textContent = 'Упоминания';
  aNode.href = '/?search=%40' + userId;
  liNode.appendChild(aNode);
  insertAfter(liNode, li2);
}

function makeElementExpandable(element) {
  let aNode = document.createElement('a');
  aNode.className = 'expandLink';
  aNode.innerHTML = '<span>Expand</span>';
  aNode.href = '#expand';
  aNode.onclick = (e => {
    e.preventDefault();
    element.classList.remove('expandable');
    element.removeChild(aNode);
  });
  element.appendChild(aNode);
  element.classList.add('expandable');
}

function limitArticlesHeight () {
  let maxHeight = window.innerHeight * 0.7;
  Array.from(document.querySelectorAll('#content article[data-mid] > .msg-txt')).forEach(p => {
    if (p.offsetHeight > maxHeight) {
      makeElementExpandable(p);
    }
  });
}

function addStyle() {
  let article = document.querySelector('#content article') || document.querySelector('#content .msg-cont');
  let [br, bg, bb] = parseRgbColor(getComputedStyle(document.documentElement).backgroundColor, [255,255,255]);
  let [tr, tg, tb] = parseRgbColor(getComputedStyle(document.body).color, [34,34,34]);
  let [ar, ag, ab] = (article) ? parseRgbColor(getComputedStyle(article).backgroundColor, [br, bg, bb]) : [br, bg, bb];
  const rgba = (r,g,b,a) => `rgba(${r},${g},${b},${a})`;
  let bg10 = rgba(br, bg, bb, 1.0);
  let abg10 = rgba(ar, ag, ab, 1.0);
  let color10 = rgba(tr, tg, tb, 1.0);
  let color07 = rgba(tr, tg, tb, 0.7);
  let color03 = rgba(tr, tg, tb, 0.3);
  let color02 = rgba(tr, tg, tb, 0.2);

  if (GM_getValue('enable_tags_min_width', true)) {
    GM_addStyle('.tagsContainer a { min-width: 25px; display: inline-block; text-align: center; }');
  }
  GM_addStyle(/*css*/`
    .embedContainer { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; padding: 0; margin: 30px -3px 15px -3px; }
    .embedContainer > * { box-sizing: border-box; flex-grow: 1; margin: 3px; min-width: 49%; }
    .embedContainer > .compact { flex-grow: 0; }
    .embedContainer > .singleColumn { min-width: 90%; }
    .embedContainer > .codePost .desc { font-family: monospace; white-space: pre-wrap; font-size: 9pt; line-height: 120%; }
    .embedContainer .picture img { display: block; }
    .embedContainer img,
    .embedContainer video { max-width: 100%; max-height: 80vh; }
    .embedContainer audio { width: 100%; }
    .embedContainer iframe { overflow:hidden; resize: vertical; display: block; }
    .embedContainer > .embed { width: 100%; border: 1px solid ${color02}; padding: 8px; display: flex; flex-direction: column; }
    .embedContainer > .embed.loading,
    .embedContainer > .embed.failed { text-align: center; color: ${color07}; padding: 0; }
    .embedContainer > .embed.failed { cursor: pointer; }
    .embedContainer .embed .cts { margin: 0; }
    .embed .top,
    .embed .bottom { display: flex; flex-shrink: 0; justify-content: space-between; }
    .embed .top { margin-bottom: 8px; }
    .embed .lang,
    .embed .date,
    .embed .date > a,
    .embed .likes > a,
    .embed .replies > a,
    .embed .title { color: ${color07}; }
    .embed .date { font-size: small; text-align: right; }
    .embed .likes,
    .embed .faves,
    .embed .votes,
    .embed .replies { font-size: small; white-space:nowrap; margin-left: 12px; }
    .embed .likes .icon,
    .embed .faves .icon,
    .embed .votes .icon,
    .embed .replies .icon { width: 20px; height: 20px; }
    .embed .desc { margin-bottom: 8px; max-height: 55vh; overflow-y: auto; }
    .twi.embed > .cts > .placeholder { display: inline-block; }
    .embedContainer > .embed.twi .cts > .placeholder { border: 0; }
    .embedContainer > .bandcamp:not(.loading):not(.cts) { max-width: 480px; }
    .juickEmbed > .top > .top-right { display: flex; flex-direction: column; flex: 1; }
    .juickEmbed > .top > .top-right > .top-right-1st { display: flex; flex-direction: row; justify-content: space-between; }
    .juickEmbed > .bottom > .right { margin-top: 5px; display: flex; flex: 0; }
    .gistEmbed .gist-file .gist-data .blob-wrapper,
    .gistEmbed .gist-file .gist-data article { max-height: 70vh; overflow-y: auto; }
    .gistEmbed.embed.loaded { border-width: 0px; padding: 0; }
    .wordpress .desc { max-height: 70vh; overflow-y: auto; line-height: 160%; }
    .xkcd .comic { display: block; margin: 0 auto; }
    .arxiv .top { flex-direction: column; }
    .arxiv .date { text-align: left; }
    .arxiv .bottom { margin-top: 8px; }
    .tumblr { max-height: 86vh; overflow-y: auto; }
    .tumblr.loading iframe { visibility: hidden; height: 0px; }
    .reddit { max-height: 75vh; overflow-y: auto; }
    .reddit iframe { resize: none; }
    .reddit.loading > blockquote,
    .reddit.loading > div { display: none; }
    .fbEmbed:not(.fallback) iframe { resize: none; }
    .fbEmbed.loading > div { visibility: hidden; height: 0px; }
    .imgur iframe { border-width: 0px; }
    .imgur.loading iframe { visibility: hidden; height: 0px; }
    .embedContainer > .gelbooru.embed,
    .embedContainer > .danbooru.embed,
    .embedContainer > .konachan.embed,
    .embedContainer > .yandere.embed { width: 49%; }
    .embedContainer > .booru.embed { position: relative; }
    .danbooru.embed.loaded { min-height: 130px; }
    .danbooru.embed .booru-tags { display: none; }
    .danbooru.embed:hover .booru-tags { display: block; }
    .booru.embed .bottom-right { position:absolute; bottom: 8px; right: 8px; font-size: small; text-align: right; color: ${color07}; display: flex; flex-direction: column; }
    .derpibooru.embed > .bottom { margin-top: 5px; }
    .derpibooru.embed > .bottom > .right { display: flex; flex: 0; }
    article.nsfw .embedContainer img,
    article.nsfw .embedContainer iframe,
    .embed .rating_e,
    .embed img.nsfw { opacity: 0.1; }
    article.nsfw .embedContainer img:hover,
    article.nsfw .embedContainer iframe:hover,
    article.nsfw .embedContainer .msg-avatar img,
    .embed .rating_e:hover,
    .embed img.nsfw:hover { opacity: 1.0; }
    .embed.notEmbed { display: none; }
    .embedLink.arrow:not(.notEmbed):after { content: '\\00a0↓' } /* &nbsp; */
    .tweaksSettings * { box-sizing: border-box; }
    .tweaksSettings table { border-collapse: collapse; }
    .tweaksSettings tr { border-bottom: 1px solid transparent; }
    .tweaksSettings tr:hover { background: rgba(127,127,127,.1) }
    .tweaksSettings td > * { display: block; width: 100%; height: 100%; }
    .tweaksSettings > button { margin-top: 25px; }
    .tweaksSettings .ta-wrapper { width: 100%; height: 100%; }
    .tweaksSettings .ta-wrapper > textarea { width: 100%; height: 100%; }
    .tweaksSettings textarea.domains_whitelist { min-height: 72pt; }
    .embedContainer > .cts { width: 100%; }
    .embedContainer .cts > .placeholder { border: 1px dotted ${color03}; color: ${color07}; text-align: center; cursor: pointer; word-wrap: break-word; }
    .cts > .placeholder { position: relative; }
    .cts > .placeholder > .icon { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; color: ${bg10}; -webkit-filter: drop-shadow( 0 0 10px ${color10} ); filter: drop-shadow( 0 0 10px ${color10} ); }
    .embed .cts .icon { display: flex; align-items: center; justify-content: center; }
    .embed .cts .icon > svg { max-width: 100px; max-height: 100px; }
    .filtered header { overflow: hidden; }
    .filtered .msg-avatar { margin-bottom: 0px; }
    .filteredComment.headless .msg-links { margin: 0px; }
    article.readonly > .msg-txt,
    div.readonly > .msg-txt { opacity: 0.55; }
    .movable { transition: all 0.2s ease-out 0.2s; transition-property: margin, margin-top; }
    .movable.moved { position: absolute; z-index: 10; }
    .movable.hoverHighlight,
    .highlightable.hoverHighlight { outline: 1px solid ${color10} !important; }
    .movableContainer { position: relative; }
    .movableContainer > .placeholder { display: none; }
    .movableContainer .moved+.placeholder { display: block; }
    .recUsers img { height: 32px; margin: 2px; margin-right: 6px; vertical-align: middle; width: 32px; }
    .users.sorted > span { width: 300px; }
    a.virtualTag { border: 1px dotted ${color07}; border-radius: 15px; }
    .expandable { max-height: 50vh; overflow-y: hidden; position: relative; }
    .expandable:before { content:''; pointer-events:none; position:absolute; left:0; top:0; width:100%; height:100%; background:linear-gradient(to top, ${abg10} 15px, transparent 120px); }
    .expandable > a.expandLink { display: block; position:absolute; width: 100%; bottom: 2px; text-align: center; font-size: 10pt; color: ${color07}; }
    .expandable > a.expandLink > span { border: 1px dotted ${color07}; border-radius: 15px; padding: 0 15px 2px; background: ${abg10}; }

    #oldNewMessage { background: ${abg10}; margin-bottom: 20px; padding: 0; display: flex; flex-direction: column; }
    #oldNewMessage * { box-sizing: border-box; }
    #oldNewMessage > textarea { resize: vertical; padding: 12px 16px; }
    #oldNewMessage.active { padding: 8px; }
    #oldNewMessage #bottomBlock { display: flex; flex-direction: row; }
    #oldNewMessage:not(.active) #bottomBlock,
    #oldNewMessage:not(.active) #charCounterBlock,
    #oldNewMessage:not(.active) .tagsContainer { display: none; }
    #oldNewMessage #bottomLeftBlock { flex-grow: 1; display: flex; flex-direction: column; max-width: 100%; }
    #oldNewMessage .tags,
    #oldNewMessage .tagsContainer,
    #oldNewMessage .subm,
    #oldNewMessage #charCounterBlock,
    #oldNewMessage #imgUploadBlock { margin-top: 6px; }
    #oldNewMessage.active textarea,
    #oldNewMessage .txt { padding: 2px 4px; }
    #oldNewMessage textarea,
    #oldNewMessage .imgLink,
    #oldNewMessage .tags { border: 1px solid #ccc; }
    #oldNewMessage .subm,
    #oldNewMessage .btn_like { background: #eeeee5; border: 1px solid #ccc; color: black; padding: 2px 4px; width: 150px; cursor: pointer; text-align: center; }
    #oldNewMessage .subm[disabled] { color: #999; }
    #imgUploadBlock > * { display: inline-block; }
    #imgUploadBlock .info { width: 25px; height: 25px; vertical-align: text-bottom; }
    #imgUploadBlock #image_upload { visibility: hidden; width: 0; position: absolute; }
    #imgUploadBlock .imgLink { width: 150px; }
    #oldNewMessage:not(.withImage) #imagePreview { display: none; }
    #oldNewMessage #imagePreview { position: relative; margin: 6px 0 0 6px; }
    #oldNewMessage #imagePreview img { display: block; max-height: 120px; max-width: 150px; }
    #clear_button { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
    #clear_button > svg { position: absolute; right: 0%; top: 0%; width: 20%; height: 20%; }
    #clear_button:hover { background: rgba(255, 255, 255, 0.25); }
    .flexSpacer { flex-grow: 1; }
    #charCounterBlock > div { height: 100; }
    #charCounterBlock:not(.invalid) > div { background: #999; height: 1px; }
    #charCounterBlock.invalid { text-align: right; }
    #charCounterBlock.invalid > div { color: #c00; }
    ul#replies li .clickPopup,
    ul#replies li .hoverPopup { display: inline-block; float: right; }
    .clickPopup,
    .hoverPopup { position: relative; }
    .clickPopup .clickContainer,
    .hoverPopup .hoverContainer { visibility: hidden; position: absolute; z-index: 1; bottom: 100%; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; background: #fff; box-shadow: 0 0 3px rgba(0,0,0,.16); }
    .clickPopup .clickContainer > *,
    .hoverPopup .hoverContainer > * { margin: 2px 4px; }
    .clickPopup.expanded .clickContainer,
    .hoverPopup.expanded .hoverContainer,
    .hoverPopup:hover .hoverContainer { visibility: visible; }
    .clickPopup,
    .hoverPopup { margin-left: 15px; }
    .msgthread .hoverPopup { margin-left: 0; margin-right: 15px; color: #88958d; margin-top: 12px; }
    .clickPopup:not(.expanded) { cursor: pointer; }
    @keyframes highlight { 0% { outline-color: rgba(127, 127, 127 , 1.0); } 100% { outline-color: rgba(127, 127, 127 , 0.0); } }
    .blinkOnce { outline-width: 1px; outline-style: solid; animation: highlight 1s; }
    .confirmationItem { color: red; border: 1px solid red; padding: 2px 7px; }
    .confirmationItem:hover { background: #ffeeee; }
    `);
  if (GM_getValue('unset_code_style', false)) {
    GM_addStyle(`
      pre { background: unset; color: unset; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; font-size: 9pt; line-height: 120%; }
      `);
  }
}

// #endregion
