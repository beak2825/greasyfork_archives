// ==UserScript==
// @name         Discourse Thread Backup
// @namespace    polv
// @version      0.2.7
// @description  Backup a thread
// @author       polv
// @match        *://forum.enlightenedstates.com/*
// @match        *://forums.learnnatively.com/*
// @license      MIT
// @supportURL   https://community.wanikani.com/t/a-way-to-backup-discourse-threads/63679/9
// @source       https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/wk-com-backup.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meta.discourse.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517950/Discourse%20Thread%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/517950/Discourse%20Thread%20Backup.meta.js
// ==/UserScript==
     
// @ts-check
(function () {
  'use strict';
     
  /**
   *
   * @param {Object} [opts] Number for thread, or `true` for `?print=true`, or Object specifying options
   * @param {boolean} [opts.x1000=false]
   * @param {number} [opts.thread_id]
   * @param {number} [opts.start]
   * @param {number} [opts.end]
   * @param {number} [opts.max]
   * @returns {Promise}
   */
  async function backupThread(opts) {
    let x1000 = false;
    let thread_id = 0;
    let start = 0;
    let end = 0;
    let max = 0;
     
    switch (typeof opts) {
      case 'boolean':
        x1000 = opts;
        break;
      case 'number':
        thread_id = opts;
        break;
      case 'object':
        if (opts) {
          for (const k of Object.keys(opts)) {
            const v = opts[k];
            switch (k) {
              case 'x1000':
                x1000 = v;
                break;
              case 'thread_id':
                thread_id = v;
                break;
              case 'start':
                start = v;
                break;
              case 'end':
                end = v;
                break;
              case 'max':
                max = v;
                break;
            }
          }
        }
    }
     
    if (typeof thread_id === 'boolean') {
      x1000 = thread_id;
      thread_id = 0;
    }
     
    let thread_slug = '';
    let thread_title = '';
     
    if (!thread_id) {
      const [pid, tid, slug] = location.pathname.split('/').reverse();
      thread_id = Number(tid);
      if (!thread_id) {
        thread_slug = tid;
        thread_id = Number(pid);
      } else {
        thread_slug = slug;
      }
    }
    if (!thread_id) return;
     
    const url =
      location.origin + '/t/' + (thread_slug || '-') + '/' + thread_id;
     
    const output = [];
    let cursor = start;
     
    const markBatch = 500;
    let lastMark = 0;
     
    while (true) {
      let nextCursor = cursor;
     
      const jsonURL =
        location.origin +
        '/t/-/' +
        thread_id +
        (cursor ? '/' + cursor : '') +
        '.json' +
        (x1000 ? '?print=true' : '');
     
      const obj = await fetch(jsonURL).then((r) => r.json());
     
      if (x1000) {
        // TODO: ?print=true is rate limited. Not sure for how long.
        x1000 = false;
        setTimeout(() => {
          fetch(jsonURL);
        }, 1 * 60 * 1000);
      }
     
      if (!thread_slug) {
        thread_slug = obj.slug;
      }
      if (!thread_title) {
        thread_title = obj.unicode_title || obj.title;
      }
     
      obj.post_stream.posts.map((p) => {
        const { username, cooked, polls, post_number, actions_summary } = p;
     
        if (end) {
          if (post_number > end) return;
        }
        if (max) {
          if (post_number - start > max) return;
        }
     
        if (post_number > nextCursor) {
          nextCursor = post_number;
     
          const lines = [];
     
          lines.push(
            `#${post_number}: ${username} ${actions_summary
              .filter((a) => a.count)
              .map((a) => `❤️ ${a.count}`)
              .join(', ')}`,
          );
          if (polls?.length) {
            lines.push(
              `<details style="display:none"><summary>Poll results</summary>${polls
                .map((p) => {
                  const pre = document.createElement('pre');
                  pre.setAttribute('data-poll-name', p.name);
                  pre.textContent = JSON.stringify(
                    p,
                    (k, v) => {
                      if (/^(assign)_/.test(k)) return;
                      if (v === null || v === '') return;
                      return v;
                    },
                    2,
                  );
                  return pre.outerHTML;
                })
                .join('')}</details>`,
            );
          }
          lines.push(
            `<div class="cooked">${cooked
              .replace(/(<a[^>]+\bhref=")(\/\/)/g, `$1https:$2`)
              .replace(/(<a[^>]+\bhref=")\//g, `$1${location.origin}/`)
              .replace(/(<img[^>]+)>/g, '$1 loading="lazy">')}</div>`,
          );
     
          output.push(
            `<section data-post-number="${post_number}">${lines.join(
              '\n',
            )}</section>`,
          );
        }
      });
     
     if (cursor >= nextCursor) {
        break;
      }
     
      if (end) {
        if (nextCursor > end) break;
      }
      if (max) {
        if (nextCursor - start > max) break;
      }
     
      if (cursor > (lastMark + 1) * markBatch) {
        lastMark = Math.floor(cursor / markBatch);
        console.log(`Downloading at ${url}/${cursor}`);
      }
     
      cursor = nextCursor;
    }
     
    console.log('Downloaded ' + url);
     
    if (!thread_slug) {
      thread_slug = String(thread_id);
    }
     
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob(
        [
          `<html>`,
          ...[
            `<head>`,
            ...[
              `<link rel="canonical" href="${url}">`,
              `<style>
            main {max-width: 1000px; margin: 0 auto;}
            .cooked {margin: 2em;}
            .spoiler:not(:hover):not(:active) {filter:blur(5px);}
            </style>`,
              Array.from(
                document.querySelectorAll(
                  'meta[charset], link[rel="icon"], link[rel="canonical"], link[rel="stylesheet"], style',
                ),
              )
                .map((el) => el.outerHTML)
                .join('\n'),
              `<title>${text2html(thread_title)}</title>`,
            ],
            `</head>`,
            `<body>`,
            ...[
              `<h1>${text2html(thread_title)}</h1>`,
              `<p><a href="${url}" target="_blank">${text2html(
                decodeURI(url),
              )}</a>・<a href="${url}${
                start ? '/' + start : ''
              }.json" target="_blank">JSON</a></p>`,
              `<main>${output.join('\n<hr>\n')}</main>`,
              `<script>${
                /* js */ `
              window.cdn = "${getCDN()}"
              ${renderAll}
              ${buildPoll}
              ${html2html}
              renderAll();`
              }</script>`,
            ],
            `</body>`,
          ],
          `</html>`,
        ],
        {
          type: 'text/html',
        },
      ),
    );
    a.download = decodeURIComponent(thread_slug) + '.html';
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }
     
  function text2html(s) {
    const div = document.createElement('div');
    div.innerText = s;
    const { innerHTML } = div;
    div.remove();
    return innerHTML;
  }
     
  function html2html(s) {
    const div = document.createElement('div');
    div.innerHTML = s;
    const { innerHTML } = div;
    div.remove();
    return innerHTML;
  }
     
  function getCDN() {
    // @ts-ignore
    return (document.querySelector('img.avatar').src || '')
      .replace(/(:\/\/[^/]+\/[^/]+).+$/g, '$1')
      .replace('/user_avatar', '');
  }
     
  function renderAll() {
    doRender();
    addEventListener('scroll', doRender);
     
    function doRender() {
      document
        .querySelectorAll('[data-post-number]:not([data-polls="done"])')
        .forEach((post) => {
          const rect = post.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            buildPoll(post);
          }
        });
    }
  }
     
  function buildPoll(post) {
    const main = /** @type {HTMLElement} */ (post);
    if (main.getAttribute('data-polls') === 'done') return;
     
    main.querySelectorAll('.poll').forEach((p) => {
      const preEl = main.querySelector(
        `pre[data-poll-name="${p.getAttribute('data-poll-name')}"]`,
      );
      if (!preEl) return;
      const obj = JSON.parse(preEl.textContent || '');
     
      const el = p.querySelector('.info-number');
      if (el) {
        el.textContent = obj.voters || el.textContent;
      }
     
      const ul = p.querySelector('ul');
      if (ul) {
        ul.classList.add('results');
      }
     
      // @ts-ignore
      const baseURL = window.cdn;
      if (obj.options) {
        const { voters, preloaded_voters } = obj;
        obj.options.map((op) => {
          const li = p.querySelector(`li[data-poll-option-id="${op.id}"]`);
          if (li) {
            const percent = voters
              ? Math.round((op.votes / voters) * 100) + '%'
              : '';
            li.innerHTML = /*html */ `
              <div class="option">
                <p>
                  <span class="percentage">${percent}</span>${html2html(
              li.innerHTML,
            )}</span>
                </p>
              </div>
              <div class="bar-back"><div style="${
                percent ? 'width: ' + percent : ''
              }" class="bar"></div></div>
              ${
                preloaded_voters && preloaded_voters[op.id]
                  ? `<ul class="poll-voters-list"><div class="poll-voters">
                ${preloaded_voters[op.id]
                  .map(
                    (v) => /* html */ `
                  <li>
                    <a class="trigger-user-card" data-user-card="${
                      v.username
                    }" aria-hidden="true"
                      ><img
                        alt=""
                        width="24"
                        height="24"
                        src="${
                          v.avatar_template.startsWith('//')
                            ? 'https:'
                            : baseURL
                        }${v.avatar_template.replace('{size}', '24')}"
                        title="${v.username}"
                        aria-hidden="true"
                        loading="lazy"
                        tabindex="-1"
                        class="avatar"
                    /></a>
                  </li>
                  `,
                  )
                  .join('\n')}</div></ul>`
                  : ''
              }`;
          }
        });
      }
    });
    main.setAttribute('data-polls', 'done');
  }
    
  Object.assign(window, { backupThread });
})();

