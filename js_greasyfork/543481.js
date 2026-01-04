// ==UserScript==
// @name         V2EX 纯净阅读助手
// @namespace    https://github.com/bitlumen
// @version      2025-07-23
// @description  在 V2EX 帖子页面生成一个纯净阅读界面，支持分页合并、删除回复、复制等功能。
// @author       enthem
// @match        https://*.v2ex.com/t/*
// @icon         data:image/jpeg;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543481/V2EX%20%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543481/V2EX%20%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const createButton = () => {
    const btn = document.createElement('button');
    btn.textContent = '纯净阅读';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '99999';
    btn.style.background = '#007bff';
    btn.style.color = '#fff';
    btn.style.padding = '8px 12px';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    btn.onclick = initPureReader;
    document.body.appendChild(btn);
  };

  const initPureReader = async () => {
    const topicId = location.href.match(/t\/(\d+)/)?.[1];
    if (!topicId) return alert('无法识别主题 ID');

    const style = document.createElement('style');
    style.innerHTML = `
      #pureModal {
        position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999;
        display: flex; justify-content: center; align-items: center;
      }
      #pureModalContent {
        width: 80%; max-height: 90%; background: #fff; border-radius: 8px;
        padding: 20px; overflow-y: auto; font-family: system-ui, sans-serif;
        box-shadow: 0 0 10px rgba(0,0,0,0.3); position: relative;
      }
      .copyBtn {
        position: sticky; top: 0; right: 0;
        background: #007bff; color: white; padding: 6px 12px;
        border: none; border-radius: 4px; cursor: pointer;
        margin-bottom: 10px;
      }
      .copyBtn:hover { background: #0056b3; }
      .v2item {
        margin-bottom: 10px;
        padding-bottom: 5px;
        position: relative;
      }
      .v2item .meta { color: #888; font-size: 12px; margin-bottom: 4px; }
      .v2item .username { font-weight: bold; }
      .v2item .reply { margin-top: 5px; }
      .deleteBtn {
        position: absolute; top: 5px; right: 5px;
        background: #ccc; color: #333; border: none;
        padding: 2px 6px; font-size: 12px;
        border-radius: 4px; cursor: pointer;
      }
      .deleteBtn:hover { background: #999; }
      #closeBtn {
        position: fixed; top: 20px; left: 20px; background: #ccc;
        border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;
      }
      #copyToast {
        position: fixed; bottom: 30px; right: 30px;
        background: #28a745; color: white; padding: 8px 14px;
        border-radius: 6px; font-size: 14px;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        z-index: 100000;
        animation: fadeOut 2s ease-out forwards;
      }
      @keyframes fadeOut {
        0% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translateY(10px); }
      }
      hr { border: none; border-top: 1px solid #eee; }
    `;
    document.head.appendChild(style);

    const fetchPage = async (p) => {
      const url = `/t/${topicId}?p=${p}`;
      const res = await fetch(url);
      return await res.text();
    };

    const parseTime = (raw) => {
      const ts = new Date(raw);
      if (isNaN(ts)) return raw;
      const pad = n => n.toString().padStart(2, '0');
      return `${ts.getFullYear()}-${pad(ts.getMonth()+1)}-${pad(ts.getDate())} ${pad(ts.getHours())}:${pad(ts.getMinutes())}:${pad(ts.getSeconds())}`;
    };

    const parseContent = (html) => {
      const dom = new DOMParser().parseFromString(html, 'text/html');
      const title = dom.querySelector('h1')?.innerText || '无标题';
      const topicTimeRaw = dom.querySelector('.header .gray span[title]')?.getAttribute('title') || '';
      const topicUser = dom.querySelector('.header small > a[href^="/member/"]');
      const topicUserName = topicUser?.innerText || '未知';
      const topicUserLink = topicUser?.href || '#';
      const topicContent = dom.querySelector('.topic_content .markdown_body')?.innerHTML || '';

      const replies = [...dom.querySelectorAll('.cell')].filter(cell => cell.querySelector('.reply_content'));
      const replyData = replies.map((cell, index) => {
        const user = cell.querySelector('strong > a');
        const username = user?.innerText || '未知';
        const userHref = user?.href || '#';
        const timeRaw = cell.querySelector('.ago')?.getAttribute('title') || '';
        const content = cell.querySelector('.reply_content')?.innerHTML || '';
        const floor = cell.querySelector('.no')?.innerText || (index + 1);
        return {
          index: floor,
          username,
          userHref,
          time: parseTime(timeRaw),
          content
        };
      });

      return {
        title,
        topicTime: parseTime(topicTimeRaw),
        topicUser: { name: topicUserName, href: topicUserLink },
        topicContent,
        replies: replyData
      };
    };

    const collectAllPages = async () => {
      let page = 1;
      const result = [];
      while (true) {
        const html = await fetchPage(page);
        const parsed = parseContent(html);
        result.push(parsed);
        if (!html.includes(`?p=${page + 1}`)) break;
        page++;
      }
      return result;
    };

    const renderHTML = (pages) => {
      const wrapper = document.createElement('div');
      wrapper.id = 'pureModal';

      const modal = document.createElement('div');
      modal.id = 'pureModalContent';

      const copyBtn = document.createElement('button');
      copyBtn.innerText = '📋 复制';
      copyBtn.className = 'copyBtn';

      const closeBtn = document.createElement('button');
      closeBtn.innerText = '❌ 关闭';
      closeBtn.id = 'closeBtn';
      closeBtn.onclick = () => wrapper.remove();

      const innerHTML = document.createElement('div');
      innerHTML.id = 'pureInner';

      const fragments = [];

      const first = pages[0];
      fragments.push(`
        <div class="v2item" id="topic_main">
          <h1 style="color: black;">${first.title}</h1>
          <div class="meta">作者：<a href="${first.topicUser.href}" class="username" target="_blank">${first.topicUser.name}</a> 发表于 ${first.topicTime}</div>
          <div class="reply">${first.topicContent}</div>
        </div>
        <hr />
      `);

      pages.forEach((p, pageIndex) => {
        const replies = pageIndex === 0 ? p.replies : p.replies;
        replies.forEach(reply => {
          const id = `reply_${reply.index}_${Math.random().toString(36).slice(2)}`;
          const hrId = `hr_${id}`;
          fragments.push(`
            <div class="v2item" id="${id}">
              <button class="deleteBtn" onclick="(function(){
                document.getElementById('${id}').remove();
                const hr = document.getElementById('${hrId}');
                if (hr) hr.remove();
              })()">❌ 删除</button>
              <div class="meta">${reply.index}楼 · <a href="${reply.userHref}" class="username" target="_blank">${reply.username}</a> 发表于 ${reply.time}</div>
              <div class="reply">${reply.content}</div>
            </div>
            <hr id="${hrId}" />
          `);
        });
      });

      innerHTML.innerHTML = fragments.join('\n');
      modal.appendChild(copyBtn);
      modal.appendChild(innerHTML);
      wrapper.appendChild(modal);
      wrapper.appendChild(closeBtn);
      document.body.appendChild(wrapper);

      copyBtn.onclick = () => {
        const temp = innerHTML.cloneNode(true);
        temp.querySelectorAll('.deleteBtn').forEach(btn => btn.remove());
        const html = temp.innerHTML;
        const blob = new Blob([html], { type: "text/html" });
        const data = [new ClipboardItem({ "text/html": blob })];
        navigator.clipboard.write(data).then(() => {
          const toast = document.createElement('div');
          toast.id = 'copyToast';
          toast.innerText = '✅ 复制完成';
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        });
      };
    };

    const all = await collectAllPages();
    renderHTML(all);
  };

  createButton();

})();
