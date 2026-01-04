// ==UserScript==
// @name         JS practice for S1
// @namespace    http://tampermonkey.net/
// @version      0.214
// @description  JS练习脚本
// @author       Lery
// @include      *://*.saraba1st.com/2b/*
// @include      *://*.stage1st.com/2b/*
// @include      *://stage1st.com/2b/*
// @include      *://*.stage1.cc/2b/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/store.js/1.3.20/store.min.js
// @downloadURL https://update.greasyfork.org/scripts/37462/JS%20practice%20for%20S1.user.js
// @updateURL https://update.greasyfork.org/scripts/37462/JS%20practice%20for%20S1.meta.js
// ==/UserScript==

  // 1. 自动对旧链接进行修改跳转
  const oldUrlPattern = /^([^.]+\\.)?(saraba1st|stage1(st)?)\\.(com|cc)\/2b\/read/;
  if (oldUrlPattern.test(location.href)) {
      const tid = location.href.split("tid-")[1].split(".html")[0];
      location.href = `https://${location.hostname}/2b/thread-${tid}-1-1.html`;
  }

  // 2. 修改网页标题后缀
  const titlePattern = /^(.+?)(?:论坛)?(?:\s*-\s*Stage1st)?\s*-\s*stage1\/s1\s+游戏动漫论坛$/;
  if (titlePattern.test(document.title)) {
      document.title = document.title.replace(titlePattern, '$1') + " - STAGE1ₛₜ";
  }

  // 3. 自动签到
  const signLink = document.querySelector('a[href*="study_daily_attendance-daily_attendance.html"]');
  if (signLink) {
      const pipeSeparator = signLink.nextElementSibling?.classList.contains('pipe')
          ? signLink.nextElementSibling
          : null;

      // 异步处理避免阻塞主线程
      setTimeout(() => {
          if (typeof ajaxget === 'function') {
              ajaxget(signLink.href);
          }

          pipeSeparator?.remove();
          signLink.remove();
      }, 100);
  }

  // 4. 点击更换漫区随机图
  const randomPic = document.querySelector('img[src^="https://ac.stage3rd.com/S1_ACG_randpic.asp"]');
  if (randomPic) {
      randomPic.addEventListener('click', function() {
          this.src = `https://ac.stage3rd.com/S1_ACG_randpic.asp?t=${Date.now()}`;
      });

      // 添加视觉反馈
      randomPic.style.cursor = 'pointer';
      randomPic.title = '点击更换图片';
  }

  // 5. 滚动位置记录（节流优化）
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
          // 添加滚动事件处理逻辑
      }, 500);
  });

  // 6. 自定义快捷入口函数
  function createLink(name, addr) {
      const node = document.createElement("li");
      const link = document.createElement("a");

      if (`${location.pathname}${location.search}` === `/2b/${addr}`) {
          node.className = "a";
      }

      link.href = addr;
      link.hideFocus = true;
      link.textContent = name;
      node.appendChild(link);

      return node;
  }

  // 7. 重构导航栏更新逻辑
  const navList = document.getElementById("nv")?.querySelector("ul");
  if (navList) {
      // 获取论坛跳转数据
      GM_xmlhttpRequest({
          method: "GET",
          url: `https://${location.hostname}/2b/forum.php?mod=ajax&action=forumjump`,
          onload: function(response) {
              try {
                  const match = response.responseText.match(/<div id="flsrchdiv">[\s\S]+?(?=<script)/);
                  if (!match) return;

                  const parser = new DOMParser();
                  const doc = parser.parseFromString(match[0], "text/html");
                  const forumItems = doc.querySelectorAll('.jump_bdl li:nth-child(3) p a');

                  // 清空现有导航
                  while (navList.firstChild) {
                      navList.removeChild(navList.firstChild);
                  }

                  // 添加收藏板块
                  if (forumItems.length) {
                      const namePattern = /.*?(?=论坛|$)/;
                      forumItems.forEach(item => {
                          const nameMatch = item.textContent.match(namePattern);
                          const name = nameMatch ? nameMatch[0] : item.textContent;
                          navList.appendChild(createLink(name, item.href));
                      });
                  }

                  // 添加默认快捷入口
                  [
                      ["抹布", "home.php?mod=space&do=friend&view=blacklist"],
                      ["客户端", "thread-1486168-1-1.html"],
                      ["我的回复", "home.php?mod=space&do=thread&view=me&type=reply"]
                  ].forEach(([name, url]) => {
                      navList.appendChild(createLink(name, url));
                  });

              } catch (error) {
                  console.error('导航更新失败:', error);
              }
          },
          onerror: function(error) {
              console.error('请求论坛数据失败:', error);
          }
      });
  }

  // 8. 阅读记录系统（优化存储和显示逻辑）
  const forumPattern = /forum\.php\?mod=(forumdisplay|viewthread)|(forum|thread)(-[0-9]+)+\.html/;
  if (forumPattern.test(location.href) && store.enabled) {
      const lasttime = store.get('lasttime') || {};
      const lastread = store.get('lastread') || {};
      const lastrc = store.get('lastrc') || {};

      // 帖内浏览处理
      if (unsafeWindow.tid) {
          // 记录浏览时间
          const now = new Date();
          const hoursSinceEpoch = now.getTime() / 3600000 + now.getTimezoneOffset() / 60;
          lasttime[unsafeWindow.tid] = hoursSinceEpoch || 1;
          store.set('lasttime', lasttime);

          // 记录当前回复数
          GM_xmlhttpRequest({
              method: "GET",
              url: `https://${location.hostname}/2b/api/mobile/index.php?module=viewthread&tid=${unsafeWindow.tid}`,
              onload: function(response) {
                  try {
                      const json = JSON.parse(response.responseText);
                      const replies = json.Variables?.thread?.replies || 1;
                      lastrc[unsafeWindow.tid] = replies;
                      store.set('lastrc', lastrc);
                  } catch (e) {
                      console.error('解析回复数失败:', e);
                  }
              }
          });

          // 记录当前页码
          const pageEl = document.querySelector('#pgt > div > div > strong');
          lastread[unsafeWindow.tid] = pageEl?.textContent || 1;
          store.set('lastread', lastread);

      }
      // 主题列表处理
      else {
          const table = document.querySelector('form[name="moderate"] table');
          if (table) {
              const tbodys = table.querySelectorAll('tbody[id^="normalthread_"]');

              tbodys.forEach(tbody => {
                  const [, tid] = tbody.id.split('_');
                  if (!tid) return;

                  const page = lastread[tid];
                  if (!page) return;

                  // 计算时间差颜色
                  const currentHours = new Date().getTime() / 3600000 + new Date().getTimezoneOffset() / 60;
                  const hoursDiff = currentHours - (lasttime[tid] || 0);
                  const fcolor = getTimeBasedColor(hoursDiff);

                  // 创建回页链接
                  const pageLink = createPageLink(tid, page, fcolor);

                  // 检查新回复
                  const replyEl = tbody.querySelector('tr > .num > .xi2');
                  const currentReplies = parseInt(replyEl?.textContent) || 0;
                  const oldReplies = lastrc[tid] || 0;

                  if (currentReplies > oldReplies) {
                      const newReplies = currentReplies - oldReplies;
                      const badge = createReplyBadge(newReplies, fcolor);
                      pageLink.style.borderRadius = '4px 0 0 4px';
                      tbody.querySelector('tr > th').append(pageLink, badge);
                  } else {
                      pageLink.style.borderRadius = '4px';
                      tbody.querySelector('tr > th').append(pageLink);
                  }
              });
          }
      }
  }

  // 辅助函数：根据时间差获取颜色
  function getTimeBasedColor(hours) {
      if (hours <= 1) return 'rgb(192,51,34)';
      if (hours <= 24) return `rgb(${192 - hours}, ${51 + hours/4}, ${34 + hours/2})`;
      if (hours <= 168) return `rgb(${168 - (hours-24)*5/9}, ${57 + (hours-24)/6}, ${46 + (hours-24)/4})`;
      return 'rgb(85,83,83)';
  }

  // 辅助函数：创建页码链接
  function createPageLink(tid, page, color) {
      const link = document.createElement('a');
      link.textContent = `回第${page}页`;
      link.style.cssText = `
          color: ${color};
          font-weight: bold;
          padding: 1px 3px;
          border: 1px solid ${color};
          margin-left: 5px;
          display: inline-block;
      `;

      const currentPage = document.querySelector('#pgt > div > strong')?.textContent || 1;
      const isOldUrl = document.querySelector(`#normalthread_${tid} a`)?.href.includes("forum.php");

      link.href = isOldUrl
          ? `forum.php?mod=viewthread&tid=${tid}&extra=page%3D${currentPage}&page=${page}`
          : `thread-${tid}-${page}-${currentPage}.html`;

      return link;
  }

  // 辅助函数：创建新回复标记
  function createReplyBadge(count, color) {
      const badge = document.createElement('span');
      badge.textContent = `+${count}`;
      badge.style.cssText = `
          color: #F6F7EB;
          background: ${color};
          font-weight: bold;
          padding: 1px 3px;
          border: 1px solid ${color};
          border-radius: 0 4px 4px 0;
          display: inline-block;
      `;
      return badge;
  }