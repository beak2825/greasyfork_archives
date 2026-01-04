// ==UserScript==
// @name:ja     好き嫌い.com コメントビューア
// @name        Suki-Kira.com Comment Viewer
// @namespace   https://greasyfork.org/users/1310758
// @description:ja 好き嫌い.com ( https://suki-kira.com/ ) のコメントビューア
// @description Viewer comments on suki-kira.com (https://suki-kira.com/)
// @match       https://suki-kira.com/people/*
// @match       https://suki-kira.com/p/*/c/*
// @license     MIT License
// @author      pachimonta
// @grant       GM_addStyle
// @grant       GM.setValue
// @grant       GM_getValue
// @noframes
// @version     2025-10-13_001
// @downloadURL https://update.greasyfork.org/scripts/503801/Suki-Kiracom%20Comment%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/503801/Suki-Kiracom%20Comment%20Viewer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Helper functions
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const likeVoteText = '👍';
  const dislikeVoteText = '👎';
  const attentionMessage = $('.attention') ? $('.attention').textContent.trim() : '';
  const manual = String.raw`<h2 class="userscript-h2">UserScriptの説明</h2>
<ul class="userscript-manual">
  <li>コメントの時刻表示に年と曜日と秒数を追加します。</li>
  <li>コメントへの投票のグラフとボタンを小さく表示します。</li>
  <li>長いコメントを折りたたまないように変更します。</li>
  <li>「なりすまし防止用ID」を表示します。</li>
  <li>コメントのページナビゲーションの追加と訂正をします。</li>
  <li>投稿者ID（なりすまし防止用IDとは異なります）を表示します。投稿を非表示にするときにサーバーから返される64桁の文字列の一部をIDとして表示します。IDなしは自分の投稿です。</li>
  <li>ページ内の表示されている投稿の回数が2回以上が緑、4回以上はピンクで投稿者のIDが強調されます。返信数でも同様に返信番号が強調されます。</li>
  <li>[返信]を押したときの位置を履歴に入れます。</li>
  <li>コメント投稿フォーム（テキストエリア）に入力した内容がローカルストレージに保存されるのはサイト側の機能です。</li>
  <li>投稿フォームの下の各切り替えボタンを押すと、各表示形式を切り替えます。</li>
</ul>`;
  const blockTagsList = `DIV`.trim().split(/\s+/);
  const blockTags = new Set(blockTagsList);
/*
 * より多いblockTagsList
ADDRESS
ARTICLE
ASIDE
BLOCKQUOTE
BR
CENTER
DD
DETAILS
DIV
DL
DT
FIELDSET
FIGCAPTION
FIGURE
FOOTER
FORM
H1
H2
H3
H4
H5
H6
HEADER
HGROUP
HR
LEGEND
LI
MAIN
NAV
OL
P
PRE
RTC
SEARCH
SECTION
SUMMARY
TABLE
TR
UL
XMP
*/
  const CSS = String.raw`
    *, *:before, *:after {
      box-sizing: border-box !important;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
    }
    @keyframes shake {
        0% { transform: translateY(0); }
        25% { transform: translateY(-2px); }
        50% { transform: translateY(2px); }
        75% { transform: translateY(-2px); }
        100% { transform: translateY(0); }
    }
    :root {
      --post-count-2-plus-color: #009933;
      --post-count-4-plus-color: #ff00ff;
    }
    section:has(blockquote:not(:empty)) {
      background-color: #ffcccc;
      padding: .5rem;
      border-bottom: solid 3px #ff9999;
    }
    blockquote {
      margin: .5rem 0 1rem .5rem !important;
      padding: .5rem;
    }
    h2.userscript-h2 {
      font-size: 1rem;
      line-height: 1;
      margin: 0;
      padding: 0;
    }
    .toggleButtons {
      display: inline-block;
      margin: .5rem 0;
    }
    .toggleButtons button {
      opacity: .8;
      font-size: .8rem;
      margin: 0 .5rem;
    }
    .toggleButtons button:hover {
      opacity: inherit;
    }
    ins, .text-xs-center table {
      display: none;
    }
    .container.sk-container {
      overflow: inherit !important;
    }
    #submit-comment {
      position: sticky;
      bottom: 0;
      z-index: 1;
      margin: .5rem 0;
      padding-bottom: .1rem;
    }
    [id^="/p/"]:hover {
      background-color: #efefef;
    }
    a[data-postid][data-res]:not([data-res="1"],[data-res="2"],[data-res="3"]) {
      color: var(--post-count-4-plus-color);
      font-weight: bold;
    }
    a[data-postid]:is([data-res="1"],[data-res="2"],[data-res="3"]) {
      color: var(--post-count-2-plus-color);
      font-weight: bold;
    }
    a[data-postid]:not([data-res]) {
      color: #373a3c !important;
    }
    [itemprop="datePublished"] {
      color: #373a3c;
    }
    .cBanBtn, [data-nguser], [id^="commentReply-"] {
      color: #373a3c;
    }
    .id11 {
      display: inline-block;
      color: #373a3c;
    }
    .id11.count2plus {
      position: relative;
      cursor: pointer;
    }
    .id11.count2plus::before {
      content: "ID:";
      color: var(--post-count-2-plus-color);
      text-decoration: underline;
      position: absolute;
      left: 0;
      top: 0;
    }
    .id11.count4plus::before {
      color: var(--post-count-4-plus-color);
    }
    .comment_body {
      display: inline-block;
      width: 100%;
      overflow-wrap: normal;
      max-height: 10rem;
      height: auto;
      line-height: normal;
      padding-left: 1rem;
    }
    [data-tooltip] {
      position: relative;
      --tooltipLeft: 0px;
    }
    [data-tooltip]:focus::after,
    [data-tooltip]:hover::after {
      font-size: 12px;
      font-family: inherit;
      font-weight: normal;
      content: attr(data-tooltip);
      text-decoration: none;
      position: absolute;
      top: 60px;
      left: var(--tooltipLeft);
      background-color: rgba(255, 255, 239, .9);
      color: #000;
      word-break: break-word;
      width: min(800px, 60dvw);
      overflow-wrap: break-word;
      display: inline-block;
      white-space: break-spaces;
      z-index: 12;
      margin-top: 8px;
      padding: 4px;
      border: 1px solid #000;
      border-radius: 8px;
    }
    form#comment-submit-modal [name="name_id"] {
      width: fit-content;
      height: 2.5rem;
      margin: 0;
      display: inline-block;
      line-height: 1;
    }
    form#comment-submit-modal [name="type"] {
      width: fit-content;
      margin: 0;
      display: inline-block;
      line-height: 1;
    }
    form#comment-submit-modal [name="body"] {
      width: 100%;
      min-height: 1.75rem;
      box-sizing: border-box;
    }
    form#comment-submit-modal [type="submit"] {
      width: fit-content;
      display: inline-block;
      margin: 0 0 0 .4rem;
    }
    .action_panel {
      margin-top: 5px !important;
    }
    .comment-container {
      padding: 0 0 .8rem 0 !important;
      margin: 0 !important;
    }
    button.upvote, button.downvote {
      display: inline-block;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      padding: 0;
      appearance: none;
    }
    progress {
      width: 5rem;
      height: 1rem;
      background-color: #0275d8;
      border-color: transparent;
      border-radius: .28rem;
      border-style: none;
    }
    progress[value="0"][max="0"] {
      background-color: #ccc;
    }
    progress[value="0"][max="0"]::-webkit-progress-bar {
      background-color: #ccc;
    }
    progress::-webkit-progress-bar {
      background-color: #0275d8;
    }
    progress::-webkit-progress-value {
      background-color: #d9534f;
    }
    progress::-moz-progress-bar {
      background-color: #d9534f;
    }
    [count] {
      min-width: 2rem;
      vertical-align: top;
      margin: 0;
      padding: 0;
      display: inline-block;
      transition: transform 0.1s ease-in-out;
    }
    [count]:hover:not([clicked], :active) {
      animation: shake 0.5s infinite;
      cursor: pointer;
    }
    [count]::after {
      position: sticky;
      font-size: 0.7rem;
      content: attr(count);
      font-weight: bold;
    }
    :is(a[href^="/people/"], a[href^="https://suki-kira.com/people/"]) {
      &:is([href$="/like"], [href*="/like?"], [href*="/like/"]) {
        color: #d9534f !important;
        &:is(:focus, :hover) {
          color: #c9302c !important;
        }
      }
      &:is([href$="/dislike"], [href*="/dislike?"], [href*="/dislike/"]) {
        color: #0275d8 !important;
        &:is(:focus, :hover) {
          color: #025aa5 !important;
        }
      }
      &[href*="?"]:not(.anchor, [href$="/like"], [href*="/like?"], [href*="/like/"], [href$="/dislike"], [href*="/dislike?"], [href*="/dislike/"]) {
        color: #818a91 !important;
        &:is(:focus, :hover) {
          color: #687077 !important;
        }
      }
    }
    .anchor {
      color: var(--post-count-2-plus-color) !important;
    }
    .comment-container + hr {
      margin: .4rem 0 0 0;
    }
    .comment.container hr:not(.comment-container + hr) {
      display: none;
    }
    body {
      line-height: revert !important;
      letter-spacing: revert !important;
    }
    .comment-container {
      border-width: 1px;
      border-style: none solid solid none;
      border-color: #ddd;
    }
    [class*="comment_options_"] {
      user-select: none;
      padding: 0 3px;
    }
    .comment_vote_default.text-vote {
      display: none;
    }
    .comment_vote_simple:is([itemprop="comment"], .action_panel) {
      display: none;
    }
    .comment_vote_none:is([itemprop="comment"], .action_panel) {
      display: none;
    }
    .comment_vote_none.text-vote {
      display: none;
    }
    .comment_id_simple.id64Hex {
      display: none;
    }
    .comment_id_default.id11 {
      display: none;
    }
    .comment_id_default.id64Hex {
      display: none;
    }
    .comment_body_simple.comment_body {
      color: #373a3c;
      font-size: 100%;
      border-color: #000;
    }
    .comment_body_simple.comment_body.text-muted {
      color: #373a3c !important;
    }
    .comment_body_simple.comment_body[style*="font-size:"] {
      font-size: 100% !important;
    }
    .comment_body_simple.comment_body[style*="font-weight:bold"] {
      font-weight: normal !important;
    }
    .comment_body_default.comment_body {
      color: inherit;
      font-size: 95%;
      font-weight: inherit;
      border-color: #fff;
    }
    .comment_body_default.comment_body.text-muted {
      color: #818a91 !important;
    }
    .comment_body_default.comment_body[style*="font-size:80%"] {
      font-size: 80% !important;
    }
    .comment_body_default.comment_body[style*="font-size:85%"] {
      font-size: 85% !important;
    }
    .comment_body_default.comment_body[style*="font-size:90%"] {
      font-size: 90% !important;
    }
    .comment_body_default.comment_body[style*="font-size:95%"] {
      font-size: 95% !important;
    }
    .comment_body_default.comment_body[style*="font-size:100%"] {
      font-size: 100% !important;
    }
    .comment_body_default.comment_body[style*="font-size:105%"] {
      font-size: 105% !important;
    }
    .comment_body_default.comment_body[style*="font-size:110%"] {
      font-size: 110% !important;
    }
    .comment_body_default.comment_body[style*="font-size:115%"] {
      font-size: 115% !important;
    }
    .comment_body_default.comment_body[style*="font-size:120%"] {
      font-size: 120% !important;
    }
    .comment_body_default.comment_body[style*="font-size:125%"] {
      font-size: 125% !important;
    }
    .comment_body_default.comment_body[style*="font-weight:bold"] {
      font-weight: bold !important;
    }
    .comment_options_simple:is(.cBanBtn, [data-nguser], .comment-link-copy) {
      display: none;
    }
    .comment_options_simple[id^="commentReply-"] {
      display: inline-block;
    }
    .comment_options_none:is(.cBanBtn, [data-nguser], [id^="commentReply-"], .comment-link-copy) {
      display: none;
    }
    .comment_options_default:is(.cBanBtn, [data-nguser], [id^="commentReply-"]) {
      display: inline-block;
    }
  `;

  const sanitizeHtml = (content) => {
    return content.replace(/[\s"'`<>]/g, match => `&#${String(match.codePointAt(0))};`);
  };
  const getCookieValue = (key) => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=');
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
      }
    }
    return undefined;
  };
  const encodeCookieValue = (val) => {
    return encodeURIComponent(val).replace(/%25/g, '%').replace(/%2F/g, '/').replace(/%2B/g, '+');
  };
  function getTextWithLineBreaks(element) {
    let str = "";

    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.replace(/\s+/g, " ");
        str += /\s$/.test(str) ? text.trimStart() : text;
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName;

        if (tag === "BR") {
          str += "\n";
          return;
        }

        const isBlock = blockTags.has(tag);

        if (isBlock && str && !str.endsWith("\n")) {
          str += "\n";
        }

        node.childNodes.forEach(traverse);

        if (isBlock && str && !str.endsWith("\n")) {
          str += "\n";
        }
      }
    }

    traverse(element);

    return str
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
      .join("\n");
  }
  const likeOrDislikePathname = (location.pathname.match(new RegExp('^/people/[^/]+/[^/]+/((?:dis)?like)(?:/|$)'))?.[1] || '') || '';

  const skId = ($('input[name="id"][value]')?.value) || ($('[itemprop="sku"][content]')?.getAttribute('content'));
  const subjectName = location.pathname.startsWith('/people/') && $('meta[name="keywords"][content]')?.getAttribute('content');
  const resultPath = subjectName ? `/people/result/${encodeURIComponent(subjectName)}` : skId ? `/people/result/${encodeURIComponent(skId)}` : '';
  const cookieSkId = resultPath ? encodeCookieValue(skId) : null;
  const resultIdPath = resultPath?.replace(new RegExp('[^/]+$'), encodeURIComponent(skId));
  const voteForm = $('form[id="vote-form"][action]');
  if (voteForm) {
    const textLink = String.raw`
<div style="text-align:center">
コメント表示：
[<a href="${resultPath}" class="text-muted">最新</a> <a href="${resultPath}/?prc=-1" class="text-muted">1-</a>]
[<a href="${resultPath}/like" class="text-danger">好き派のみ</a> <a href="${resultPath}/like?prc=-1" class="text-danger">1-</a>]
[<a href="${resultPath}/dislike" class="text-primary">嫌い派のみ</a> <a href="${resultPath}/dislike?prc=-1" class="text-primary">1-</a>]
</div>
`;
    const target = $('.vote.container') ? $('.vote.container') : voteForm;
    target.insertAdjacentHTML('afterend', textLink);
  }
  if (resultPath) {
    if (getCookieValue(`sk_${cookieSkId}`) === undefined) {
      [
        `/people/comment/${cookieSkId}`,
        resultPath,
        resultPath !== resultIdPath ? resultIdPath : null,
        '/people/result'
      ].filter(Boolean).forEach(path => {
        document.cookie = `sk_${cookieSkId}=1; path=${path}; Secure`;
      });
    }
  }

  /*
  if (skId && $('meta[itemprop="dateModified"][content]')) {
    const formatString = input => input.replace('T', ' ').replace('+09:00', '');
    const dateModified = formatString($('meta[itemprop="dateModified"]').getAttribute('content'));
    const skCommentJson = {};
    skCommentJson.id = skId;
    skCommentJson.time = dateModified;
    skCommentJson.p = 0;
    const skComment = encodeURIComponent(JSON.stringify([{ ...skCommentJson }]));
    if (getCookieValue('sk_comment') !== skComment) {
      document.cookie = `sk_comment=${skComment}; path=/people/vote/healthcheck; Secure`;
    }
  }
  */
  let newForm;
  const selectLikeType = $('[id="select-like-type"]');
  if (selectLikeType) {
    $$('option', selectLikeType).forEach((elem) => {
      if (elem.innerText.trim() === '好き派') {
        elem.value = '1';
        elem.classList.add('text-danger');
        if (getCookieValue(`sk_${cookieSkId}`) === 1) {
          elem.selected = true;
        }
      } else if (elem.innerText.trim() === '嫌い派') {
        elem.value = '0';
        elem.classList.add('text-primary');
        if (getCookieValue(`sk_${cookieSkId}`) === 0) {
          elem.selected = true;
        }
      }
    });
    $$('[id*="-ad-"], #comment-top').forEach((elem) => {
      elem.remove();
    });
    // $('[id^="comment-inline-ad-"]').remove();
    // $('[id="fullscreen-ad-container"]').remove();
    newForm = $('form[id="comment-submit-modal"]');
    newForm.removeAttribute('class');
    $('[data-dismiss="modal"]', newForm).remove();
    $('[id="name-id-confirm"]', newForm).replaceWith($('[id="name-id"]'));
    $('[id="name-id"]').setAttribute('name', 'name_id');
    $('[id="name-id"]').removeAttribute('id');
    $('[id="select-like-type-confirm"]', newForm).replaceWith($('[id="select-like-type"]'));
    $('[id="select-like-type"]').after($('[id="comment-submit"]'));
    $('[id="select-like-type"]').removeAttribute('id');
    $('[id="add-comment-body"]', newForm).replaceWith($('[id="comment-body"]'));
    $('[id="comment-body"]').setAttribute('rows', '3');
    $('[id="comment-submit"]').replaceWith($('[id="add-comment-btn"]'));
    $('[id="add-comment-btn"]').removeAttribute('disabled');
    $('[id="add-comment-btn"]').removeAttribute('data-toggle');
    $('[id="add-comment-btn"]').removeAttribute('data-target');
    $('[id="add-comment-btn"]').removeAttribute('id');
    $('.form-group').replaceWith($('.form-group').cloneNode());
    $('.form-group').append(newForm);
    newForm.addEventListener('submit', (event) => {
      const likeType = $('select[name="type"]', event.target.closest('form')).value;
      const cookieLikeType = $('select[name="type"]', event.target.closest('form')).value;
      if (getCookieValue(`sk_${cookieSkId}`) !== likeType) {
        [
          `/people/comment/${cookieSkId}`,
          resultPath,
          resultPath !== resultIdPath ? resultIdPath : null
        ].filter(Boolean).forEach(path => {
          document.cookie = `sk_${cookieSkId}=${cookieLikeType}; path=${path}; Secure`;
        });
      }
    }, { passive: false, capture: true });
  }
  const comment = $('.comment');
  if (comment) {
    $('[id="comment"]').insertAdjacentHTML('beforebegin', manual);
    function searchClass(base, styles) {
      for (const lastpart of styles) {
        if ($(`.${base}_${lastpart}`)) {
          return lastpart;
        }
      }
      return null;
    }
    const changeClassForSelectors = (base, nextStyle = null) => {
      let selectors;
      let currentStyle = null;
      if (base === 'comment_options') {
        selectors = '.cBanBtn, [data-nguser], [id^="commentReply-"], .comment-link-copy';
        if (!nextStyle) {
          currentStyle = searchClass(base, ['default', 'simple', 'none']);
          // The toggle can be set to simple, default, or none.
          nextStyle = currentStyle === 'simple' ? 'default' : currentStyle === 'none' ? 'simple' : 'none';
        }
      } else if (base === 'comment_body') {
        selectors = '.comment_body';
        if (!nextStyle) {
          currentStyle = searchClass(base, ['default', 'simple']);
          // The toggle can be set to simple, default.
          nextStyle = currentStyle === 'simple' ? 'default' : 'simple';
        }
      } else if (base === 'comment_id') {
        selectors = '.id11, .id64Hex';
        if (!nextStyle) {
          currentStyle = searchClass(base, ['default', 'simple', 'visual']);
          // The toggle can be set to simple, default, or visual.
          nextStyle = currentStyle === 'simple' ? 'default' : currentStyle === 'visual' ? 'simple' : 'visual';
        }
      } else if (base === 'comment_vote') {
        selectors = '[itemprop="comment"], .action_panel, .text-vote';
        if (!nextStyle) {
          currentStyle = searchClass(base, ['default', 'simple', 'none']);
          // The toggle can be set to simple, default, or none.
          nextStyle = currentStyle === 'simple' ? 'default' : currentStyle === 'default' ? 'none' : 'simple';
        }
      }
      if (currentStyle) {
        const elements = $$(`:is(${selectors})`, comment);
        elements.forEach(element => {
          element.classList.remove(`${base}_${currentStyle}`);
          element.classList.add(`${base}_${nextStyle}`);
        });
        GM.setValue(base, nextStyle);
      } else {
        const elements = $$(`:is(${selectors})`, comment);
        elements.forEach(element => {
          element.classList.add(`${base}_${nextStyle}`);
        });
      }
    };

    const toggleButtons = document.createElement('div');
    toggleButtons.className = 'toggleButtons';

    toggleButtons.insertAdjacentHTML('beforeend', '<button data-class="comment_options">非表示等表示切替</button><button data-class="comment_body">コメント表示切替</button><button data-class="comment_id">ID表示切替</button><button data-class="comment_vote">投票表示切替</button>');

    toggleButtons.addEventListener('click', (event) => {
      if (event.target.matches('button[data-class^="comment_"]')) {
        changeClassForSelectors(event.target.dataset.class);
      }
    });
    if (attentionMessage) {
      const elem = document.createElement('section');
      elem.insertAdjacentHTML('beforeend', '<div>投稿する前に（サイトによる注意書き）</div><blockquote></blockquote>');
      elem.lastChild.textContent = attentionMessage;
      $('[id="comment"]').before(elem);
    }
    // comment.before($('#submit-comment'));
    if (selectLikeType) {
      $('h2', $('#submit-comment')).remove();

      const next = $('.form-group').nextElementSibling;
      if (next.tagName === 'STYLE') {
        next.remove();
      }
    }
    GM_addStyle(CSS);
    // マウスオーバー・クリックを監視して同一IDのレス内容をすべてツールチップ表示
    let isProcessing = false;
    const popupTooltip = (event) => {
      let mode;
      if (event.target.matches('.id11:is(.count2plus, .count4plus)')) {
        mode = 'id';
      } else if (event.target.matches('.anchor')) {
        mode = 'refer';
      } else if (event.target.matches('[data-res]')) {
        mode = 'reply';
      }
      // ダブルクリックでなければリンク先を開かないようにする
      if (event.detail !== 2) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      if (!mode) {
        return;
      }
      // すでに処理中の場合は何もしない
      if (isProcessing) {
        return;
      }
      // 処理が開始されたことを示す
      isProcessing = true;
      if (mode !== 'reply') {
        const Rect = event.target.getBoundingClientRect();
        const RectParent = event.target.closest('.comment.container').getBoundingClientRect();
        const elementX = Rect.left - RectParent.left + window.scrollX;
        const tooltipLeft = `${String(parseInt(-elementX+32))}px`;
        // ツールチップの位置を合わせる
        if (event.target.style.getPropertyValue('--tooltipLeft') !== tooltipLeft) {
          event.target.style.setProperty('--tooltipLeft', tooltipLeft);
        }
      }
      // すでに生成済みなのでこれより以下スルー
      if ('tooltip' in event.target.dataset && event.target.dataset.tooltip.length) {
        isProcessing = false;
        return;
      }
      let elements;
      if (mode === 'id') {
        const id64 = event.target.closest('[data-id64]').dataset.id64;
        elements = $$(`[itemprop="review"][data-id64="${id64}"]`, comment);
      } else if (mode === 'reply') {
        elements = Array.from(event.target.classList)
          .filter(className => /^reply_number_\d+$/.test(className))
          .map(className => className.slice(13))
          .map(number => $(`[itemprop="review"][id$="/${number}"]`, comment))
          .filter(Boolean);
      } else if (mode === 'refer') {
        elements = $$(`[itemprop="review"][id$="/${event.target.getAttribute('data-target')}"]`, comment);
      }
      const tooltip = [];
      elements.forEach((elem) => {
        const res = document.importNode(elem, true);
        $$('.id11', res).forEach(e => e.remove());
        $$('.cBanBtn', res).forEach(e => e.remove());
        $$('[data-nguser]', res).forEach(e => e.remove());
        $$('[id^="commentReply-"]', res).forEach(e => e.remove());
        $$('.text-vote', res).forEach(e => e.remove());
        $$('[itemprop="comment"]', res).forEach(e => e.remove());
        $$('.action_panel', res).forEach(e => e.remove());
        // 改行の連続は2個まで
        tooltip.push(getTextWithLineBreaks(res).replace(/(\r?\n){2,}/g, '\n\n').trim()+'\n');
      });
      if (tooltip.length) {
        event.target.dataset.tooltip = tooltip.join("\n");
      }

      // 他のイベントが同時に発生しないように、少し待機させてからフラグをリセット
      setTimeout(() => {
        isProcessing = false;
      }, 10); // この待機時間は調整が必要かもしれません
    };
    ['mouseover', 'focusin', 'click'].forEach(event => comment.addEventListener(event, popupTooltip));
    document.addEventListener('keydown', function(event) {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'ArrowLeft') {
          $('a[rel="prev"]').click();
        } else if (event.key === 'ArrowRight') {
          $('a[rel="next"]').click();
        }
      }
    });
    let workerCode = String.raw`
      self.onmessage = function(event) {
        let { commentId, skId, token } = event.data;
        let Url = 'https://suki-kira.com/people/vote/ng_user/?index=' + encodeURIComponent(commentId);
        let formData = 'pid=' + encodeURIComponent(skId);
        try {
          let xhr = new XMLHttpRequest();
          xhr.open('POST', Url);
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.send(formData);
          xhr.onload = async function() {
            if (xhr.status !== 200) {
              return;
            }
            const id64 = xhr.responseText;
            const msgUint8 = new TextEncoder().encode(id64);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
            self.postMessage({"commentId":commentId,"id64":id64,"hashHex":hashHex,"token":token});
          };
          xhr.onloadend = function() {
            xhr = null;
          };
        } catch (e) {
          if(e !== null) {
            console.error(e);
          }
        }
      };
    `;
    function replaceElementTag(oldElement, newTagName) {
      const newElement = document.createElement(newTagName);

      for (const { name, value } of Array.from(oldElement.attributes)) {
        newElement.setAttribute(name, value);
      }

      while (oldElement.firstChild) {
        newElement.appendChild(oldElement.firstChild);
      }

      oldElement.replaceWith(newElement);

      return newElement;
    }
    const nextSiblingTrim = (elem => {
      // 要素の次の兄弟ノードを取得
      let nextSibling = elem.nextSibling;

      // 次の兄弟ノードが存在する限りループ
      while (nextSibling) {
        // テキストノードであるかを確認
        if (nextSibling.nodeType === Node.TEXT_NODE) {
          // テキストノードの内容をtrimして空白か確認
          if (nextSibling.textContent.trim() === '') {
            // 空白の場合はノードを削除
            nextSibling.remove();
          } else {
            // 空白でない場合はループを終了
            break;
          }
        } else {
          // テキストノードでない場合はループを終了
          break;
        }
        // 次の兄弟ノードを取得
        nextSibling = elem.nextSibling;
      }
    });
    const itemReviews = $$('[itemprop="review"]', comment);
    const itemReviewLength = itemReviews.length;
    let blob = new Blob([workerCode], {
      type: 'application/javascript'
    });
    let worker = new Worker(URL.createObjectURL(blob));
    let workerMessageCount = 0;
    const idCount = new Map();
    worker.onmessage = function(event) {
      if (event.data.error) {
        console.error('Error:', event.data.error);
        return;
      }
      const token = event.data.token;
      const itemReview = $(`[id*="ommentVote-like-"][id$="-${token}"]`).closest('[itemprop="review"]');
      const dateElem = $('[itemprop="datePublished"]', itemReview);
      const id64 = event.data.id64;
      itemReview.dataset.id64 = id64;
      if (idCount.has(id64)) {
        idCount.set(id64, idCount.get(id64) + 1);
      } else {
        idCount.set(id64, 1);
        GM_addStyle(`[data-id64="${id64}"] .id64Hex { border-radius: .28rem; border-right: solid .8rem #${event.data.hashHex.slice(6,12)}; border-left: solid .8rem #${event.data.hashHex.slice(18,24)}; }`);
      }
      const idHtml = id64.length === 64 ? sanitizeHtml(`${id64.substring(0, 4)}${id64.substring(21, 24)}${id64.substring(43, 47)}`) : sanitizeHtml(id64.substring(0, 11));
      dateElem.insertAdjacentHTML('beforeend', ` <span class="id11">ID:${idHtml}</span>`);
      if (++workerMessageCount !== itemReviewLength) {
        return;
      }
      itemReviews.forEach((elem) => {
        const id64 = elem.dataset.id64;
        if (idCount.get(id64) < 2) {
          return;
        }
        const id11 = $('.id11', elem);
        id11.setAttribute('tabindex', '0');
        id11.classList.add('count2plus');
        if (idCount.get(id64) > 4) {
          id11.classList.add('count4plus');
        }
      });
    };
    const addWeekdayToDatetime = (datetimeStr) => {
      const tIndex = datetimeStr.indexOf('T');
      let datePart, timePart;
      if (tIndex > -1) {
        datePart = datetimeStr.slice(0, tIndex);
        timePart = datetimeStr.slice(tIndex + 1, -6);
      } else {
        const spaceIndex = datetimeStr.indexOf(' ');
        datePart = datetimeStr.slice(0, spaceIndex);
        timePart = datetimeStr.slice(spaceIndex + 1);
      }
      const [year, month, day] = datePart.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      const weekday = weekdays[date.getDay()];
      return `${datePart}(${weekday}) ${timePart}`;
    };

    itemReviews.forEach((elem) => {
      $$('p.comment_body', elem).forEach(function(p) {
        replaceElementTag(p, 'div');
      });
      const commentBody = $('.comment_body', elem);

      const nextElementSibling = elem.closest('.comment-container')?.nextElementSibling;
      if (nextElementSibling && nextElementSibling.matches('hr')) {
        replaceElementTag(nextElementSibling, 'br');
      }
      $$('details', elem).forEach(function(detail) {
        commentBody.insertAdjacentHTML('beforeend', $('.comment_body', detail).innerHTML);
        detail.remove();
      });
      const commentId = elem.id.replace(/.*?(\d+)$/, '$1');
      const commentInfo = $('.comment_info', elem);
      const commentInfoFirstChild = commentInfo.firstChild;
      // firstChildがテキストノードであることを確認
      if (commentInfoFirstChild.nodeType === Node.TEXT_NODE) {
        // <a>要素を作成
        const a = document.createElement('a');
        // a.href = `${resultPath}/${likeOrDislikePathname}?i=${commentId}#${commentId}`;
        a.href = `/p/${skId}/c/${commentId}#${commentId}`;
        a.target = '_blank';
        a.dataset.postid = commentId;
        a.textContent = commentInfoFirstChild.data.trim(); // テキストを<a>要素に設定
        // 元のテキストノードを<a>要素と入れ替え
        commentInfo.replaceChild(a, commentInfoFirstChild);
      }
      const token = $(`[id*="ommentVote-like-"]`, elem).id.match(/[^-]+$/)?.[0] || null;
      const author = $('[itemprop="author"]', elem);
      if (author.hasAttribute('span')) {
        const clone = document.importNode(author, false);
        const match = clone.outerHTML.match(/ ([^@ ]+@(?:好き|嫌い)派)/u);
        const authorText = match[0].substring(1);
        /*
        if (/[\da-fA-F]{8}/.test(authorText)) {
          const color = authorText.substring(0, 8);
          author.style.borderLeftColor = `rgba(from #${color} r g b / alpha)`;
          author.style.borderLeftStyle = 'solid';
          author.style.borderLeftWidth = '.5rem';
        }
        */
        // author.prepend(`匿名@${authorText.substring(10)}`);
        author.prepend(authorText);
      }
      const upvoteCount = parseInt($('[itemprop="upvoteCount"][content]', elem).getAttribute('content'));
      const downvoteCount = parseInt($('[itemprop="downvoteCount"][content]', elem).getAttribute('content'));
      const dateElem = $('[itemprop="datePublished"]', elem);
      const resButton = $(`[id="commentReply-${commentId}"]`, elem);
      const insertElement = resButton ? resButton : dateElem;
      insertElement.insertAdjacentHTML('afterend', ` <span class="pull-xs-right text-vote"><button class="upvote text-danger" count="${upvoteCount}">${likeVoteText}</button> <progress value="${upvoteCount}" max="${upvoteCount + downvoteCount}"></progress> <button class="downvote text-primary" count="${downvoteCount}">${dislikeVoteText}</button></span>`);
      const selectors = '.text-vote, [itemprop="datePublished"], .cBanBtn, [data-nguser], [id^="commentReply-"], .comment-link-copy';
      $$(`:is(${selectors})`, elem).forEach(element => {
        nextSiblingTrim(element);
      });
      const opacity = (upvoteCount + downvoteCount) * 0.04 + 0.4;
      $('progress', elem).style.opacity = opacity;

      dateElem.textContent = addWeekdayToDatetime(dateElem.getAttribute('content'));
      $$('.anchor[data]', elem).forEach((span) => {
        const a = document.createElement('a');
        a.className = "anchor";
        a.textContent = span.textContent;
        const target = span.getAttribute('data')?.replace(/\D+/g, "");
        a.dataset.target = target;
        a.target = '_blank';
        a.href = `${resultIdPath || `/p/${skId}/c/${target}`}?c=${target}#${target}`;
        span.replaceWith(a);
      });
      author.insertAdjacentHTML('beforebegin', '<span class="id64Hex"></span> ');
      worker.postMessage({
        "commentId": commentId,
        "skId": skId,
        "token": token
      });
    });
    itemReviews.forEach((elem) => {
      $$('.anchor', elem).forEach((anchor) => {
        const target = anchor.dataset.target;
        const targetResElement = $(`[data-postid="${target}"]`);
        if (!targetResElement) {
          return;
        }
        const commentId = elem.id.replace(/.*?(\d+)$/, '$1');
        if (targetResElement.classList.contains(`reply_number_${commentId}`)) {
          return;
        }
        targetResElement.classList.add(`reply_number_${commentId}`);
        targetResElement.dataset.res = String((parseInt(targetResElement.dataset.res) || 0) + 1);
      });
    });
    comment.addEventListener('click', function(event) {
      const clickedElement = event.target;
      if (clickedElement.hasAttribute('clicked')) {
        return;
      }
      if (clickedElement.matches('[id^="commentReply-"]')) {
        history.pushState({scrollY: window.scrollY}, '');
      }
      const itemReview = clickedElement.closest('[itemprop="review"]');
      if (!itemReview) {
        return;
      }
      const itemId = itemReview.id.match(/[^/-]+$/)?.[0] || null;
      const voteType = clickedElement.classList.contains('upvote') ? 'like' : clickedElement.classList.contains('downvote') ? 'dislike' : null;
      if (!voteType) {
        return;
      }
      const upvoteCount = parseInt($('[itemprop="upvoteCount"][content]', itemReview).getAttribute('content'));
      const downvoteCount = parseInt($('[itemprop="downvoteCount"][content]', itemReview).getAttribute('content'));
      if ($(`:is([id^="commentVote-like-${itemId}-${upvoteCount}-${downvoteCount}-"], [id^="commentVote-dislike-${itemId}-${upvoteCount}-${downvoteCount}-"]).clicked`, itemReview)) {
        $$('.upvote, .downvote', itemReview).forEach(v => v.toggleAttribute('clicked', true));
        return;
      }
      clickedElement.setAttribute('count', String(+clickedElement.getAttribute('count') + 1));
      const progress = $('progress', itemReview);
      if (voteType === 'like') {
        progress.value = String(+progress.value + 1);
      }
      progress.setAttribute('max', String(+progress.getAttribute('max') + 1));
      $$('.upvote, .downvote', itemReview).forEach(v => v.toggleAttribute('clicked', true));
      $(`[id^="commentVote-${voteType}-${itemId}-${upvoteCount}-${downvoteCount}-"]`, itemReview).click();
    });
    if ($('#comment-body')) {
      $('#comment-body').scrollIntoView({"behavior":"smooth","block":"end"});
      // $('#comment-body').focus();
      $('#comment-body').toggleAttribute('required', true);
    }
    let checkSelectLikeType = (e) => {
      let target = e.target ? e.target : e;
      if (target.value === '1') {
        target.classList.remove('text-primary');
        target.classList.add('text-danger');
        return;
      }
      target.classList.remove('text-danger');
      target.classList.add('text-primary');
    };
    if (newForm) {
      checkSelectLikeType($('select[name="type"]', newForm));
      $('select[name="type"]', newForm).addEventListener('change', checkSelectLikeType);
      newForm.after(toggleButtons);
    } else {
      comment.append(toggleButtons);
    }
    const setClassForSelectors = (base, myDefault) => {
      changeClassForSelectors(base, GM_getValue(base, myDefault));
    };
    setClassForSelectors('comment_vote', 'simple');
    setClassForSelectors('comment_id', 'simple');
    setClassForSelectors('comment_body', 'default');
    setClassForSelectors('comment_options', 'simple');
  }
  if (location.search && location.search !== '?cm') {
    $$('.container div a[href$="?cm"]:not(.page-link)').forEach((elem) => {
      if (/<(?:すべて表示|好き派のみ|嫌い派のみ)>/.test(elem.textContent.trim()) === false) {
        return;
      }
      elem.href = elem.href.replace(/\?cm$/, location.search);
    });
  }
  const pathname = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  $$('.pagination').forEach((elem) => {
    const nextCommentElement = $('a[rel="prev"][href]', elem);
    const prevCommentElement = $('a[rel="next"][href]', elem);
    const startCommentElement = $('a[rel="start"][href]', elem);
    if (!startCommentElement) {
      const startUrl = `${location.pathname}?cm`;
      const textLink = `<li class="page-item first-page">\n<a href="${sanitizeHtml(startUrl)}" class="page-link" data-ci-pagination-page="1" rel="start">‹‹ 最新へ</a>\n</li>`;
      elem.insertAdjacentHTML('afterbegin', textLink);
    }
    if (nextCommentElement && !nextCommentElement.getAttribute('href').includes("?prc=")) {
      nextCommentElement.href = `${location.pathname}?prc=${$('.comment-container').id}`;
    } else if (!nextCommentElement && location.search.includes('?nxc=')) {
      const nextUrl = `${location.pathname}?prc=${$('.comment-container').id}`;
      const textLink = `<li class="page-item prev-page">\n<a href="${sanitizeHtml(nextUrl)}" class="page-link" data-ci-pagination-page="0" rel="prev">‹ 次へ</a>\n</li>`;
      $(':is(a[rel="next"][href], li)', elem).insertAdjacentHTML('afterend', textLink);
    }
    if (prevCommentElement && prevCommentElement.getAttribute('href').match(/\?nxc=[1-2]$/)) {
      prevCommentElement.closest('.next-page').remove();
    }
    if (location.search !== '?prc=-1') {
      const lastUrl = `${location.pathname}?prc=-1`;
      const textLink = `<li class="page-item last-page">\n<a href="${sanitizeHtml(lastUrl)}" class="page-link" data-ci-pagination-page="1" rel="last">最初へ ››</a>\n</li>`;
      $('li:last-child', elem).insertAdjacentHTML('afterend', textLink);
    }
  });
  if (/^#\d+$/.test(location.hash) && new RegExp('^/p/[0-9]+/c/[0-9]+').test(location.pathname)) {
    $(`[id="comment"]`).scrollIntoView({ behavior: 'smooth' });
  }
  function removeDisabledFromOptions() {
    const likeType = $('#like-option, #dislike-option');

    if (likeType) {
      likeType.toggleAttribute('disabled', false);
    }
  }

  removeDisabledFromOptions();

  const observer = new MutationObserver(removeDisabledFromOptions);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();