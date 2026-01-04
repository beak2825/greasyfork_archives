// ==UserScript==
// @name        lintcode-to-markdown
// @namespace   Violentmonkey Scripts
// @match       https://www.lintcode.com/problem/*/description
// @grant       none
// @version     0.1
// @author      devrsi0n
// @description lintcode.com description to markdown
// @downloadURL https://update.greasyfork.org/scripts/398810/lintcode-to-markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/398810/lintcode-to-markdown.meta.js
// ==/UserScript==

const markdownButtonText = 'markdown';
const titleButtonText = 'title';
const codeButtonText = 'code';

(function insertButtons() {
  const parent = document.querySelector('.problem-description-switch');
  if (!parent) {
    setTimeout(insertButtons, 1000);
    return;
  }
  parent.appendChild(initTitleButton());
  parent.appendChild(initMarkdownButton());
  parent.appendChild(initCodeButton());
})();

function initMarkdownButton() {
  const mdBtn = document.createElement('button');
  mdBtn.innerHTML = markdownButtonText;
  mdBtn.style = 'color:white;background:green;margin-left:10px;padding:5px';
  mdBtn.addEventListener('click', markdownButtonHandler);
  return mdBtn;
}

function markdownButtonHandler(event) {
  let str = '';

  const title = document.querySelector('.problem-header-title').childNodes[2]
    .nodeValue;
  str += `# ${title}\n<${location.href}>`;
  str += '\n\n';

  str += '## Description\n';
  const descriptionElements = document.querySelectorAll(
    '#scroll-content > div > div.ml-problem-detail.dynamic-width-content > div.ml-problem-detail-content > div > div.ant-card.ant-card-bordered.ant-card-wider-padding.ant-card-padding-transition > div > div > div.problem-description-col > div:nth-child(1) > div.markdown-wrapper > div > p'
  );
  for (const element of descriptionElements) {
    str += `${element.innerText.trim()}\n`;
  }
  str += '\n';

  str += '## Difficulty\n';
  const difficulty = document.querySelector(
    '#scroll-content > div > div.ml-problem-detail.dynamic-width-content > div.ml-problem-detail-content > div > div.ant-card.ant-card-bordered.ant-card-wider-padding.ant-card-padding-transition > div > div > div.statistics-col > div > ul > li:nth-child(1) > span.problem-statistics-column-value > span'
  );
  str += `${difficulty.innerText.trim()}`;
  str += '\n\n';

  str += '## Example\n';
  const example =
    document.querySelector(
      'div.problem-description-col > div:nth-of-type(3) > div.markdown-wrapper > div.rendered-markdown'
    ) ||
    document.querySelector(
      'div.problem-description-col > div:nth-of-type(4) > div.markdown-wrapper > div.rendered-markdown'
    );
  str += `\`\`\`
${example.innerText.trim()}
\`\`\``;
  str += '\n\n';
  const notice = document.querySelector(
    '#scroll-content > div > div.ml-problem-detail.dynamic-width-content > div.ml-problem-detail-content > div > div.ant-card.ant-card-bordered.ant-card-padding-transition > div > div > div.problem-description-col > div.ant-alert.ant-alert-info > span.ant-alert-message > div > div > div'
  );
  if (notice) {
    str += '## Notice\n';
    str += notice.innerText.trim();
  }

  copyToClipboard(str);

  copiedBlink(event.target, markdownButtonText);
}

function initTitleButton() {
  const btn = document.createElement('button');
  btn.innerHTML = titleButtonText;
  btn.style = 'color:white;background:green;margin-left:10px;padding:5px';
  btn.addEventListener('click', titleButtonHandler);
  return btn;
}

const TITLE_RE = /\/problem\/([\w-]+)\//;
function titleButtonHandler(event) {
  const url = location.href;
  const title = TITLE_RE.exec(url)[1];
  copyToClipboard(title);

  copiedBlink(event.target, titleButtonText);
}

function initCodeButton() {
  const btn = document.createElement('button');
  btn.innerHTML = codeButtonText;
  btn.style = 'color:white;background:green;margin-left:10px;padding:5px';
  btn.addEventListener('click', codeButtonHandler);
  return btn;
}

function codeButtonHandler(event) {
  const code = document.querySelector('#brace-editor > div.ace_scroller > div');
  copyToClipboard(code.innerText);

  copiedBlink(event.target, codeButtonText);
}

function copiedBlink(dom, originalText) {
  dom.innerHTML = 'copied!';
  setTimeout(() => {
    dom.innerHTML = originalText;
  }, 1000);
}

function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
