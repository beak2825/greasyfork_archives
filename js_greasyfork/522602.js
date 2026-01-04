// ==UserScript==
// @name         评课社区文件/链接汇总
// @version      1.5
// @namespace    http://tampermonkey.net/
// @include      /^https:\/\/icourse.club\/course\/\d+\/?$/
// @description  点击右下角的书本图标，打开界面
// @license MIT
// @icon         https://icourse.club/static/image/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522602/%E8%AF%84%E8%AF%BE%E7%A4%BE%E5%8C%BA%E6%96%87%E4%BB%B6%E9%93%BE%E6%8E%A5%E6%B1%87%E6%80%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/522602/%E8%AF%84%E8%AF%BE%E7%A4%BE%E5%8C%BA%E6%96%87%E4%BB%B6%E9%93%BE%E6%8E%A5%E6%B1%87%E6%80%BB.meta.js
// ==/UserScript==

(() => {
  const files = {};
  const otherLinks = {};

  [...document.getElementsByTagName('a')].map(el => {
      if (el.href && !el.closest('#pdfs-to-download') && !el.href.startsWith('javascript:')) {
          if (/\.\w+$/.test(el.href) && !el.href.endsWith('.htm') && !el.href.endsWith('.html'))
              files[el.href] = el;
          else if (!el.href.startsWith('/') && !el.href.includes('icourse.club') && el.href !== 'https://pi-review.com/universities/257')
              otherLinks[el.href] = el;
      }
  })

  const panel = document.createElement('div');
  panel.style.cssText = 'position: fixed; top: 0; right: 0; background: white; padding: 8px; z-index: 9999; border: 1px solid black;';
  document.body.appendChild(panel);
  panel.style.visibility = 'hidden';

  const toggle = document.createElement('button');
  toggle.style.cssText = `color: white;
background-color: #1caaea;
display: inline;
width: 36px;
height: 36px;
position: fixed;
bottom: 25px;
right: 30px;
border-radius: 7px;
border: none;`
toggle.innerText = '📚';
  toggle.onclick = () => {
      panel.style.visibility = panel.style.visibility === 'hidden' ? 'visible' : 'hidden';
  }
  document.body.appendChild(toggle);


  if (Object.keys(files).length === 0 && Object.keys(otherLinks).length === 0) {
      toggle.style.opacity = "0.3";
      toggle.style.pointerEvents = 'none';
      toggle.title = 'No files or links found';
  }

  const container = document.createElement('div');
  panel.appendChild(container);
  container.id = "pdfs-to-download";
  container.style.cssText = 'display: flex; flex-direction: column;';

  const selected = new Set(Object.keys(files));
  let activeEl;

  const title = document.createElement('div');
  title.style.cssText = 'display: flex; gap: 4px; align-items: center; padding-bottom: 4px;';
  container.appendChild(title);

  const selectAll = document.createElement('input');
  selectAll.type = 'checkbox';
  selectAll.style.cssText = 'margin-bottom: 4px;';
  selectAll.style.visibility = Object.keys(files).length ? 'visible' : 'hidden';
  selectAll.checked = true;
  selectAll.onchange = () => {
      selectAll.indeterminate = false;
      if (selectAll.checked) {
          Object.keys(files).forEach(url => selected.add(url));
      } else {
          selected.clear();
      }
      [...container.children].forEach(row => {
          row.children[0].checked = selectAll.checked;
      })
  }
  title.appendChild(selectAll);

  const downloadAll = document.createElement(Object.keys(files).length ? 'button' : 'div');
  downloadAll.style.cssText = 'flex-grow: 1; text-align: left;';

  if (Object.keys(files).length) {
      downloadAll.className = 'btn btn-white btn-flat btn-downvote btn-do';
      downloadAll.innerText = 'Download selected';
      downloadAll.onclick = () => {
          selected.forEach(url => {
              const a = document.createElement('a');
              a.href = url;
              a.download = files[url];
              a.click();
          })
      }
  }
  title.appendChild(downloadAll);

  const close = document.createElement('div');
  close.style.cssText = 'cursor: pointer; user-select: none;';
  close.innerText = '❌';
  close.onclick = () => {
      panel.style.visibility = 'hidden';
  }
  title.appendChild(close);

  Object.entries(files).map(([url, el]) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 4px;';
      const checkbox = document.createElement('input');
      checkbox.style.cssText = 'margin-bottom: 4px;';
      checkbox.type = 'checkbox';
      checkbox.checked = selected.has(url);
      checkbox.onchange = () => {
          if (checkbox.checked) {
              selected.add(url);
          } else {
              selected.delete(url);
          }
          if (selected.size === Object.keys(files).length) {
              selectAll.indeterminate = false;
              selectAll.checked = true;
          }
          else if (selected.size === 0) {
              selectAll.indeterminate = false;
              selectAll.checked = false;
          }
          else {
              selectAll.indeterminate = true;
              selectAll.checked = true;
          }
      }
      row.appendChild(checkbox);

      const a = document.createElement('a');
      a.href = url;
      a.innerText = el.innerText;
      a.download = el.innerText;
      row.appendChild(a);

      const pad = document.createElement('div');
      pad.style.flexGrow = 1;
      row.appendChild(pad);

      const goto = document.createElement('div');
      goto.style.cssText = 'color: gray; font-size: 0.8em; cursor: pointer; user-select: none;';
      goto.innerText = '🔙'
      goto.onclick = () => {
          if (activeEl) {
              activeEl.style.outline = '';
          }
          activeEl = el;
          el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
          });
          el.style.outline = '2px solid red';
      }
      row.appendChild(goto);

      container.appendChild(row);
  })

  if (Object.keys(files).length && Object.keys(otherLinks).length) {
      const hr = document.createElement('div');
      hr.style.cssText = 'border-top: 1px solid black; margin: 8px 0;';
      container.appendChild(hr);
  }

  Object.entries(otherLinks).map(([url, el]) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 4px;';
      const checkbox = document.createElement('input');
      checkbox.style.cssText = 'margin-bottom: 4px; visibility: hidden;';
      checkbox.type = 'checkbox';
      row.appendChild(checkbox);

      const a = document.createElement('a');
      a.href = url;
      a.innerText = el.innerText;
      row.appendChild(a);

      const pad = document.createElement('div');
      pad.style.flexGrow = 1;
      row.appendChild(pad);

      const goto = document.createElement('div');
      goto.style.cssText = 'color: gray; font-size: 0.8em; cursor: pointer; user-select: none;';
      goto.innerText = '🔙'
      goto.onclick = () => {
          el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
          });
          el.style.outline = '2px solid red';
          if (activeEl) {
              activeEl.style.outline = '';
          }
          activeEl = el;
      }
      row.appendChild(goto);

      container.appendChild(row);
  })
})()
