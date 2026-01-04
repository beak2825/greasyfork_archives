// ==UserScript==
// @name         レビュー依頼コメントのコピー
// @namespace    https://github.com
// @version      0.0.9
// @description  レビューやリリース時にslackに貼る形式をクリップボードにコピーする要素をGitHubのページに追加します
// @include      /^https://github.com/.*/pull/\d*/
// @include      /^https://github.com/.*/issues/\d*/
// @author       proshunsuke
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393805/%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC%E4%BE%9D%E9%A0%BC%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/393805/%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC%E4%BE%9D%E9%A0%BC%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

const copy = (e) => {
  const titleElement = document.querySelector('.js-issue-title');
  const title = titleElement.innerText.trim();
  const url = location.href.replace(/\/pull\/(\d*).*/g, '/pull/$1');
  const reviewComment = `\`\`\`
${title}
${url}
\`\`\``;
  const clipboardCopyElement = e.target.querySelector('clipboard-copy');
  clipboardCopyElement.setAttribute('value', reviewComment);
  clipboardCopyElement.click();
};

const lastNavElement = document.querySelector('li.d-inline-flex[data-view-component="true"]:last-of-type');

const reviewCommentElement = lastNavElement.cloneNode(true);
reviewCommentElement.querySelector('span').textContent = '　Copy review Comment';
reviewCommentElement.querySelector('a').setAttribute('href', 'javascript:void(0)');

const newClipboardCopyElement = document.querySelector('clipboard-copy.Link--onHover').parentNode.cloneNode(true);
const oldSvgElement = reviewCommentElement.querySelector('svg');
oldSvgElement.parentNode.replaceChild(newClipboardCopyElement, oldSvgElement);
lastNavElement.parentNode.appendChild(reviewCommentElement);

reviewCommentElement.addEventListener('click', copy);