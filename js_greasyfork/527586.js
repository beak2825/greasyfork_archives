// ==UserScript==
// @name         Hacker News Tweaks (Modern)
// @namespace    HackerNewsReadabilityTweaks
// @homepage     https://github.com/Meekelis/Hacker-News-ReadabilityTweaks
// @version      1.0
// @description  Improve Hacker News readability with larger fonts, modern styling.
// @match        *://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527586/Hacker%20News%20Tweaks%20%28Modern%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527586/Hacker%20News%20Tweaks%20%28Modern%29.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const css = `
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5em 0;
      border-bottom: 1px solid #e1e1e1;
      background: #f9f9f9;
    }
    .comment-header__details {
      display: flex;
      gap: 0.5em;
      align-items: center;
    }
    .comment-header__username {
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }
    .comment-header__timestamp a {
      color: #888;
      text-decoration: none;
    }
    .comment-header__actions {
      display: flex;
      gap: 0.5em;
      align-items: center;
    }
    .comment-header__link {
      font-size: 0.9em;
      color: #0077cc;
      text-decoration: none;
    }
    .comment-header__toggle {
      display: inline-block;
      width: 2em;
      text-align: center;
      background: none;
      border: none;
      color: #0077cc;
      cursor: pointer;
      font-size: 0.9em;
      line-height: 1;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
  document.querySelectorAll('.comhead').forEach(comhead => {
    const origToggle = comhead.querySelector('a.togg');
    if (origToggle) { origToggle.style.display = 'none'; }
    const userEl = comhead.querySelector('a.hnuser');
    if (!userEl) return;
    const username = userEl.textContent.trim();
    const userHref = userEl.href;
    const ageEl = comhead.querySelector('.age');
    const ageLink = ageEl ? ageEl.querySelector('a') : null;
    const timestamp = ageLink ? ageLink.textContent.replace(/^on\s+/i, '').trim() : '';
    const timeHref = ageLink ? ageLink.href : '#';
    const datetime = ageEl ? ageEl.getAttribute('title') : '';
    let nextHref = '#';
    const navs = comhead.querySelector('.navs');
    if (navs) {
      const nextLink = Array.from(navs.querySelectorAll('a')).find(a => /next/i.test(a.textContent));
      if (nextLink) { nextHref = nextLink.href; }
    }
    const toggleId = origToggle ? origToggle.id : 'toggle';
    const newHeader = document.createElement('div');
    newHeader.className = 'comment-header';
    newHeader.innerHTML = `
      <div class="comment-header__details">
        <a href="${userHref}" class="comment-header__username" target="_blank" rel="noopener noreferrer">
          ${username}
        </a>
        <time datetime="${datetime}" class="comment-header__timestamp">
          <a href="${timeHref}" rel="noopener noreferrer">
            ${timestamp}
          </a>
        </time>
      </div>
      <div class="comment-header__actions">
        <a href="${nextHref}" class="comment-header__link" rel="noopener noreferrer">
          Next
        </a>
        <button class="comment-header__toggle" id="new-toggle-${toggleId}" aria-expanded="true">–</button>
      </div>
    `;
    comhead.innerHTML = '';
    comhead.appendChild(newHeader);
    const defaultCell = comhead.closest('td.default');
    if (!defaultCell) return;
    const commentText = defaultCell.querySelector('.comment');
    if (!commentText) return;
    const collapseBtn = newHeader.querySelector('.comment-header__toggle');
    collapseBtn.addEventListener('click', function(event) {
      event.preventDefault();
      const button = event.target;
      const commentRow = button.closest('.athing.comtr');
      if (!commentRow) return;
      const isCollapsed = button.textContent === '+';
      let nextSibling = commentRow.nextElementSibling;
      while (nextSibling && nextSibling.classList.contains('athing') && nextSibling.classList.contains('comtr')) {
        const indentOfSibling = parseInt(nextSibling.querySelector('.ind').getAttribute('indent') || '0', 10);
        const indentOfCurrent = parseInt(commentRow.querySelector('.ind').getAttribute('indent') || '0', 10);
        if (indentOfSibling > indentOfCurrent) {
          nextSibling.style.display = isCollapsed ? '' : 'none';
        } else { break; }
        nextSibling = nextSibling.nextElementSibling;
      }
      button.textContent = isCollapsed ? '–' : '+';
      button.setAttribute('aria-expanded', (!isCollapsed).toString());
    });
  });
})();
(function(){
  'use strict';
  const style1 = `
  <style>
    :root {
      --accent: #ff6600;
      --accent-light: rgba(255,102,0,0.1);
      --spacing: 0.5rem;
      --radius: 8px;
      --grey: #757575;
      --bg: #f9f9f9;
      --font-main: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    }
    html, body, td, .title, .comment, .default { font-family: var(--font-main); }
    html, body { margin: 0; padding: 0; }
    body, td, .title, .pagetop, .comment { font-size: 1rem; line-height: 1.5; }
    .votelinks, html[op='news'] .title { vertical-align: inherit; }
    .comment-tree .votelinks,
    html[op='threads'] .votelinks,
    html[op='newcomments'] .votelinks { vertical-align: top; }
    span.titleline { font-size: 1rem; line-height: 1.2; margin: var(--spacing) 0; display: block; font-weight: bold; }
    html[op='item'] span.titleline { font-size: 1.0rem; }
    html[op='news'] #hnmain>tbody>tr:nth-child(3)>td>table,
    html[op='newest'] #hnmain>tbody>tr:nth-child(3)>td>table,
    html[op='ask'] #hnmain>tbody>tr:nth-child(3)>td>table,
    html[op='newcomments'] #hnmain>tbody>tr:nth-child(3)>td>table,
    html[op='shownew'] #hnmain>tbody>tr:nth-child(3)>td>table,
    html[op='submitted'] #hnmain>tbody>tr:nth-child(3)>td>table,
    html[op='favorites'] #hnmain>tbody>tr:nth-child(3)>td>table:nth-child(2),
    html[op='front'] #hnmain>tbody>tr:nth-child(3)>td>table:nth-child(2),
    html[op='show'] #hnmain>tbody>tr:nth-child(3)>td>table:nth-child(2) { margin-left: var(--spacing); }
    .sitebit.comhead { margin-left: var(--spacing); }
    .subtext, .subline { font-size: 0.75rem; }
    #hnmain { background: var(--bg); }
    #hnmain>tbody>tr:first-child>td { padding: var(--spacing); }
    #hnmain>tbody>tr:first-child>td>table>tbody>tr:first-child>td { padding-right: var(--spacing)!important; }
    .hnname { font-size: 1.4em; font-weight: bold; }
    .comment, .toptext { max-width: 40em; margin: auto; }
    .toptext, a, a:visited { color: #333; text-decoration: none; transition: color 0.2s; }
    input { padding: var(--spacing); }
    input, textarea { background: white; border: 1px solid var(--grey); padding: 6px; border-radius: var(--radius); transition: box-shadow 0.2s; }
    input:focus, textarea:focus { box-shadow: 0 0 5px var(--accent); }
    input[type="text"]:hover { text-decoration: none; }
    input[type='button'] { cursor: pointer; }
    .downvoted .commtext { color: var(--grey); }
    .quote { margin: 16px; border: 1px solid var(--accent-light); border-left: 6px solid var(--accent); padding: 16px; color: var(--grey); background: var(--accent-light); border-radius: var(--radius); font-size: 0.9em; }
    .hidden { display: none; }
    .showComment a, .hideComment, .hideComment:link, .hideComment:visited { color: var(--accent); text-decoration: underline; }
    .hideComment { margin-left: var(--spacing); }
    .votelinks { min-width: 32px; }
    .votearrow { background: var(--accent-light); border-radius: var(--radius); color: var(--accent); display: block; width: 24px; height: 24px; font-size: 16px; position: relative; top: 2px; transition: background 0.1s, color 0.2s; }
    .votearrow:hover { background: var(--accent); color: white; }
    .votearrow:after { content: "⇧"; }
    body:has(form[action="login"]) { padding: 32px; }
  </style>`;
  document.head.insertAdjacentHTML("beforeend", style1);
  const style2 = `
  <style>
    .modern-downvoted {
      background: linear-gradient(135deg, #eef6ff, #f7fbff);
      padding: 12px 16px;
      border-left: 4px solid #007BFF;
      border-radius: 4px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 16px;
      color: #333;
    }
    .modern-downvoted a {
      color: #007BFF;
      text-decoration: none;
      font-weight: 500;
    }
    .modern-downvoted a:hover {
      text-decoration: underline;
    }
    pre.modern-code {
      position: relative;
      background: #f7f7f7;
      color: #333;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: auto;
      font-family: 'Fira Code', Consolas, "Courier New", monospace;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 1em;
    }
    pre.modern-code code {
      font-family: 'Fira Code', Consolas, "Courier New", monospace;
      color: inherit;
    }
    .copy-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
      color: #666;
    }
    .copy-button:hover {
      color: #000;
    }
    .copy-button.svg-icon {
      width: 20px;
      height: 20px;
      display: block;
    }
  </style>`;
  document.head.insertAdjacentHTML("beforeend", style2);
  document.querySelectorAll('.commtext a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  document.querySelectorAll('.commtext:not(.c00)').forEach(e => {
    e.parentElement.classList.add('downvoted');
  });
  const quotes = document.evaluate("//p[starts-with(., '>')] | //span[starts-with(., '>')]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0; i < quotes.snapshotLength; i++){
    let n = quotes.snapshotItem(i),
        t = Array.from(n.childNodes).find(x => x.nodeType === Node.TEXT_NODE);
    if (t){
      let p = document.createElement('p');
      p.className = 'quote';
      p.innerText = t.data.replace(">", "").trim();
      n.replaceChild(p, n.firstChild);
    } else {
      n.classList.add('quote');
      n.innerText = n.innerText.replace(">", "").trim();
    }
  }
  const copyIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path></svg>`;
  const checkIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-icon"><path d="M20.285 5.715a1 1 0 00-1.414 0L9 15.586l-3.871-3.87a1 1 0 00-1.414 1.414l4.578 4.578a1 1 0 001.414 0l10.578-10.578a1 1 0 000-1.414z" fill="currentColor"/></svg>`;
  document.querySelectorAll('pre').forEach(block => {
    block.classList.add('modern-code');
    const btn = document.createElement('button');
    btn.className = 'copy-button svg-icon';
    btn.innerHTML = copyIcon;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(block.innerText).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = checkIcon;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = copyIcon;
        }, 2000);
      });
    });
    block.style.position = 'relative';
    block.appendChild(btn);
  });
  document.querySelectorAll('.comment.downvoted .commtext').forEach(e => {
    if (!e.querySelector('.modern-downvoted')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'modern-downvoted';
      wrapper.innerHTML = e.innerHTML;
      e.innerHTML = '';
      e.appendChild(wrapper);
    }
  });
})();
