// ==UserScript==
// @name         SCBOY摸鱼插件
// @namespace    https://www.scboy.cc/
// @version      0.16
// @description  将 SCBoy 论坛改造成简洁表格风格：全局纯白黑字，隐藏头像和侧栏，论坛列表页+帖子详情页完全表格化。
// @author       (Based on original by )
// @match        https://www.scboy.cc/*
// @icon         https://www.scboy.cc/view/img/favicon.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.scboy.cc
// @run-at       document-end
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/546927/SCBOY%E6%91%B8%E9%B1%BC%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/546927/SCBOY%E6%91%B8%E9%B1%BC%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /****************** 全局样式 ******************/
  GM_addStyle(`
    html, body { margin:0; padding:0; background:#FFFFFF !important; color:#000000 !important; }
    * { color:#000000 !important; }
    a { color:#000000 !important; text-decoration:none !important; }
    a:hover { text-decoration:underline !important; }
    img[class*="avatar"], .avatar, .media-left img { display:none !important; }
    .aside, .sidebar, .sidenav, .right-container { display:none !important; }
    #scboy-root { width:100vw; min-height:100vh; padding:16px; background:#FFFFFF; }
    table { border-collapse:collapse; width:100%; table-layout: fixed; }
    table th, table td { border:1px solid #CCC; padding:8px; word-wrap:break-word; }
    table th { background:#f0f0f0; font-weight:bold; text-align:center; }
    table tbody tr:nth-child(even) { background:#f9f9f9; }
    table tbody tr:hover { background:#f1f1f1; }
    .sc-nav-table td { width:20%; text-align:center; background:#f0f0f0; font-weight:bold; }
    .scboy-thread-title { font-weight:bold; color:#000000 !important; display:block; }
    .scboy-radar-content { font-weight:bold; color:#000000 !important; }
    /* 隐藏原始内容 (列表页和详情页通用) */
    #main, #header, #footer, .card-header, .card-footer, .nav, .navbar, .breadcrumb,
    .pagination, .form, .btn-toolbar, .dropdown, .modal, .badge,
    .haya-post-info-thread-see-him, .haya-post-info-post-see-him,
    .icon, .approve_gold_name, .badges, .js-sc-follow-add, .post_update, .icon-warning,
    .social-share, .floor-parent, .floor, #replyform*, #floor_*, #pushfloor_*, #floor_expand_*,
    #floor_pagination_*, .btn, .text-grey, .mr-3, .ml-2, .mr-2, .ml-0, .mr-0, .mr-1, .ml-1,
    .d-none, .hidden, .hide, .small, .text-muted, .text-right, .justify-content-between,
    .d-flex, .media-left, .dl-horizontal, .dl, .dd, .pull-right, .pull-left,
    .card-thread .media-body > div:not(:has(h4)),
    .media-body > .d-flex,
    .message .d-flex,
    .xs_show, .hidden-sm, .hidden-xs /* 列表页特定隐藏 */
     { display: none !important; }
    /* 定义详情页表格列宽 */
    #sc-main-table:not(.sc-main-table-list) col:nth-child(1) { width: 70%; } /* 内容 */
    #sc-main-table:not(.sc-main-table-list) col:nth-child(2) { width: 10%; } /* 作者 */
    #sc-main-table:not(.sc-main-table-list) col:nth-child(3) { width: 10%; } /* 时间 */
    #sc-main-table:not(.sc-main-table-list) col:nth-child(4) { width: 10%; } /* 点赞 */
    /* 定义列表页表格列宽 */
    #sc-main-table.sc-main-table-list col:nth-child(1) { width: 45%; } /* 主题 */
    #sc-main-table.sc-main-table-list col:nth-child(2) { width: 10%; } /* 注意! (雷达) */
    #sc-main-table.sc-main-table-list col:nth-child(3) { width: 15%; } /* 作者 */
    #sc-main-table.sc-main-table-list col:nth-child(4) { width: 15%; } /* 时间 */
    #sc-main-table.sc-main-table-list col:nth-child(5) { width: 15%; } /* 回复 */
    #sc-pagination { margin-top:12px; text-align:center; }
  `);

  /****************** 通用辅助函数 ******************/
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $1 = (sel, root = document) => root.querySelector(sel);
  const txt = (el) => el ? el.textContent.trim() : "";
  const isForumListPage = () => location.search.startsWith("?forum-");
  const isThreadPage = () => location.search.startsWith("?thread-");

  /****************** 导航栏 ******************/
  function renderNavHTML() {
    return `
      <table class="sc-nav-table">
        <tr>
          <td><a href="https://www.scboy.cc/">首页</a></td>
          <td><a href="/?forum-2.htm">乔伊雷酒吧</a></td>
          <td><a href="/?forum-1.htm">科普鲁星区</a></td>
          <td><a href="/?forum-13.htm">直播讨论</a></td>
          <td><a href="https://www.scboy.cc/?bet-home.htm">老板二楼请</a></td>
        </tr>
      </table>
    `;
  }

  /****************** 列表页逻辑 ******************/
  function parseThreadItem(li) {
    // 标题
    const titleAnchor = $1('div.subject > a.xs-thread-a', li);
    const title = txt(titleAnchor) || '(无标题)';
    let url = titleAnchor ? titleAnchor.href : '';
    if (url && url.startsWith('/')) url = location.origin + url;
    const rel = url.replace(location.origin + '/', '');
    // 作者
    const authorEl = $1('.username.text-grey.mr-1.hidden-sm[uid]', li);
    const author = txt(authorEl);
    // 时间
    const timeEl = $1('.date.text-grey.hidden-sm', li);
    const time = txt(timeEl);
    // 回复数
    let replyCount = '';
    const replyIcon = $1('i.icon-comment-o', li);
    if (replyIcon && replyIcon.parentElement) {
      replyCount = txt(replyIcon.parentElement);
    }
    return { title, url, rel, author, time, replyCount };
  }

  function renderListTableHTML(rows, pagination) {
    return `
      <table class="sc-main-table sc-main-table-list" id="sc-main-table">
        <colgroup>
          <col><col><col><col><col> <!-- 由 CSS 定义宽度 -->
        </colgroup>
        <thead>
          <tr>
            <th>主题</th><th>注意!</th><th>作者</th><th>时间</th><th>回复</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr data-tid="${r.rel}">
              <td><a class="scboy-thread-title" href="${r.url}">${r.title}</a></td>
              <td><div class="scboy-radar-content"></div></td>
              <td>${r.author}</td>
              <td>${r.time}</td>
              <td>${r.replyCount}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <div id="sc-pagination">${pagination || ''}</div>
    `;
  }

  // 雷达用户
  const RADAR_USERS = [
    { id:29, name:'F91' }, { id:9, name:'蟑螂' }, { id:10, name:'鹅' },
    { id:56789, name:'兔兔' }, { id:14, name:'八甲神牛' }, { id:89053, name:'乌龟' }
  ];

  function normalizeRel(url) {
    try { return new URL(url, location.origin).pathname + new URL(url, location.origin).search; }
    catch { return url; }
  }

  function fetchUserPages(user, cb) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.scboy.cc/?user-${user.id}.htm`,
      onload: res => {
        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
        const anchors = $$('a[href*="?thread-"]', doc);
        const set = new Set(anchors.map(a => normalizeRel(a.href)));
        cb({ user, set });
      }
    });
  }

  function runRadar() {
    const rows = $$('#sc-main-table tbody tr');
    if (rows.length === 0) return;
    let pending = RADAR_USERS.length;
    const maps = [];
    RADAR_USERS.forEach(u => {
      fetchUserPages(u, data => {
        maps.push(data); pending--;
        if (pending === 0) {
          rows.forEach(tr => {
            const rel = tr.getAttribute('data-tid');
            const box = tr.querySelector('.scboy-radar-content');
            const hits = maps.filter(m => m.set.has(rel)).map(m => `有${m.user.name}`);
            box.textContent = hits.join(' ');
          });
        }
      });
    });
  }

  function reformatForumPage() {
    const items = $$('li.media.thread.tap');
    const rows = items.map(li => parseThreadItem(li));
    const pagination = $1('nav ul.pagination')?.outerHTML || '';
    document.body.innerHTML = `<div id="scboy-root">${renderNavHTML()}${renderListTableHTML(rows, pagination)}</div>`;
    // 尝试运行雷达功能
    try {
        runRadar();
    } catch (e) {
        console.error("SCBoy 表格模式雷达功能出错:", e);
    }
    // --- 修改列表页标题 ---
    document.title = "工作簿2 - SCBoy 列表页";
  }

  /****************** 详情页逻辑 ******************/
  function parseThread() {
    const rows = [];
    // --- 主楼 ---
    const mainCard = $1(".card.card-thread");
    if (mainCard) {
        // 第一行：主楼标题 (更精确地定位 h4 并移除标签)
        let threadTitleEl = $1("h4.break-all", mainCard);
        if (threadTitleEl) {
            const titleClone = threadTitleEl.cloneNode(true);
            $$(".badge", titleClone).forEach(b => b.remove());
            const threadTitle = txt(titleClone);
            if (threadTitle) {
                rows.push({
                    content: `<strong>${threadTitle}</strong>`,
                    author: "",
                    date: "",
                    like: ""
                });
            }
        }
        // 第二行：主楼正文、作者、时间、点赞
        const mainContentEl = $1(".message.break-all[isfirst='1']", mainCard);
        const mainContent = mainContentEl?.innerHTML || "";
        const mainAuthor = txt($1(".username a.text-muted.font-weight-bold", mainCard));
        const mainDate = txt($1(".date.text-grey", mainCard));
        const mainLike = txt($1(".haya-post-like-thread-user-count", mainCard));
        rows.push({
            content: mainContent,
            author: mainAuthor,
            date: mainDate,
            like: mainLike
        });
    }
    // --- 回复列表 ---
    $$("li.media.post").forEach((li) => {
        const postContent = $1(".message.break-all", li)?.innerHTML || "";
        const postAuthor = txt($1(".username a.text-muted.font-weight-bold", li));
        const postDate = txt($1(".text-right .date.text-grey", li));
        const postLike = txt($1(".haya-post-like-post-user-count", li));
        rows.push({
            content: postContent,
            author: postAuthor,
            date: postDate,
            like: postLike
        });
        // --- 楼中楼回复 ---
        $$("div[id^='reply_'] .text-left.media", li).forEach(sub => {
            const subContentSpan = $1("span", sub);
            const subContent = subContentSpan ? subContentSpan.innerHTML : "";
            const subAuthor = txt($1("a.text-muted.font-weight-bold", sub));
            const subDateDiv = $1(".text-muted.text-right", sub);
            const subDate = subDateDiv ? txt(subDateDiv) : "";
            const subLike = "";
            rows.push({
                content: `<em>// ${subContent}</em>`,
                author: subAuthor,
                date: subDate,
                like: subLike
            });
        });
    });
    return rows;
  }

  function renderThreadTableHTML(rows) {
    const trs = rows.map(r => `
      <tr>
        <td>${r.content}</td>
        <td>${r.author}</td>
        <td>${r.date}</td>
        <td>${r.like}</td>
      </tr>`).join("");
    return `
      <table id="sc-main-table">
        <colgroup>
           <col><col><col><col> <!-- 由 CSS 定义宽度 -->
        </colgroup>
        <thead>
          <tr>
             <th>内容</th>
             <th>作者</th>
             <th>时间</th>
             <th>点赞</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>
    `;
  }

  function reformatThreadPage() {
    const rows = parseThread();
    document.body.innerHTML = `<div id="scboy-root">${renderNavHTML()}${renderThreadTableHTML(rows)}</div>`;
    // --- 修改详情页标题 ---
    document.title = "工作簿2 - SCBoy 详情页";
  }

  /****************** 启动入口 ******************/
  if (isForumListPage()) {
    reformatForumPage();
  } else if (isThreadPage()) {
    reformatThreadPage();
  }

})();