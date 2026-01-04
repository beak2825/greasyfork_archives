// ==UserScript==
// @name         DIYscript
// @version      0.0.5
// @description  去除知乎回答赞赏；去除B站屏蔽广告插件提示与卡片；去除虎扑游戏广告；IT之家资讯移动端网页跳转pc页面；CSDN外链自动跳转；PMS样式修改
// @author       KilianShen
// @match        *://www.zhihu.com/question/*
// @match        *://www.bilibili.com/*
// @match        *://bbs.hupu.com/*
// @match        *://m.ithome.com/*
// @match        *://link.csdn.net/?target=*
// @match        *://cowork.apexsoft.com.cn/*
// @run-at       document-idle
// @icon         data:image/png;base64,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
// @grant        GM_addStyle
// @license      MIT
// @homepage     https://github.com/KilianShen
// @namespace sqphub.cn
// @downloadURL https://update.greasyfork.org/scripts/491964/DIYscript.user.js
// @updateURL https://update.greasyfork.org/scripts/491964/DIYscript.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const websites = [
    {
      match: '*://www.zhihu.com/question/*',
      js: () => {
        GM_addStyle('.Reward {display:none;}');
      },
    },
    {
      match: '*://www.bilibili.com/*',
      js: () => {
        GM_addStyle('.adblock-tips {display:none !important;}');
        GM_addStyle('.bili-video-card:has(.extension-tips-v2) {display:none;}');
        GM_addStyle('.feed-card:has(.extension-tips-v2) {display:none;}');
        GM_addStyle('.extension-tips-v2 {opacity:0;}');
        setTimeout(() => {
          var parentElement = document.getElementsByClassName('carousel-item');
          for (const element of parentElement) {
            element.removeAttribute('data-target-url');
          }
        }, 500);
      },
    },
    {
      match: '*://bbs.hupu.com/*',
      js: () => {
        GM_addStyle('.index_game-center-entrance-container-title__BNope {display:none;}');
        const gameAbSwiper = document.getElementById('game-center-entrance-container');
        gameAbSwiper.style.display = 'none';
      },
    },
    {
      match: '*://m.ithome.com/*',
      js: () => {
        if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          const pcUrl = location.href
            .replace('https://m.', 'https://www.')
            .replace('/html/', '/0/')
            .replace(/\/(\d{3})(\d{3})./, '/$1/$2.');
          location.assign(pcUrl);
        }
      },
    },
    {
      match: '*://link.csdn.net/?target=*',
      js: () => {
        const url = new URL(location.href);
        const targetUrl = decodeURIComponent(url.searchParams.get('target'));
        location.assign(targetUrl);
      },
    },
    {
      match: '*://cowork.apexsoft.com.cn/*',
      js: () => {
        // 高亮代办事务
        function changeMenuColor() {
          const menus = Array.from(document.getElementsByClassName('menu_text'));
          menus.forEach(item => {
            if (item.innerHTML.includes('（')) {
              item.innerHTML = item.innerHTML;
              var newInnerHTML = item.innerHTML.replace(/（(.*)）/, function (match) {
                return Number(match[1]) > 0 ? '<span style="color:#f00;font-weight:bold;font-size:16px">' + match + '</span>' : match;
              });
              item.innerHTML = newInnerHTML;
            };
          });
        }
        // 高亮今日工作量
        function changeWorkloadColor() {
          const workload = document.getElementById('jrgzl');
          if (!workload) return;
          const workingHours = Number(workload.innerText);
          if (workingHours >= 8) {
            workload.style.color = '#00b400';
          } else {
            workload.style.color = '#f00';
          }
          workload.style.fontWeight = 'bold';
          workload.style.fontSize = '24px';
        }

        fetchLogService();
        // 高亮未写日志
        function fetchLogService() {
          const startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
          const endDate = new Date().toISOString().split('T')[0];
          fetch("/plug-in/cowork/logService.jsp?MOD=CXWDQSRZ", {
            "headers": {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "zh-CN,zh-TW;q=0.9,zh-HK;q=0.8,zh;q=0.7",
              "cache-control": "no-cache",
              "content-type": "application/x-www-form-urlencoded",
              "pragma": "no-cache",
              "proxy-connection": "keep-alive",
              "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `${location.origin}/plug-in/cowork/mylog_miss.jsp`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `startDate=${startDate}&endDate=${endDate}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
          }).then(resp => resp.json()).then(res => {
            console.log('res', res);
            const { CODE, RESULT = [] } = res;
            if (CODE === '1' && RESULT.length > 0) {
              var element = document.querySelector('[code="ygcx"]');
              if (!element) return;
              const _innerText = element.innerText;
              if (RESULT.length === 1 && isToday(RESULT[0]["日期"])) {
                // 只有当天日志未写
                element.innerHTML = `${_innerText}（${RESULT.length}）${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate()}`
              } else {
                element.innerHTML = `${_innerText}（${RESULT.length}）`
              }
            }
          });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => text());
        } else {
          test();
        }

        function test() {
          setTimeout(() => {
            changeMenuColor();
          }, 300);
        }

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
          this.addEventListener('load', function () {
            if (url === '/plug-in/cowork/service.jsp?MOD=QUERY_USER_DBSX' || url === '/plug-in/cowork/kjxmList.jsp?mod=1 ') {
              test();
            } else if (url === '/plug-in/cowork/logService.jsp?MOD=RWCX_JRGZL') {
              changeWorkloadColor()
            }
          });
          originalOpen.apply(this, arguments);
        };

        function isToday(dateString) {
          const today = new Date();
          const formattedToday = today.getFullYear() +
            String(today.getMonth() + 1).padStart(2, '0') +
            String(today.getDate()).padStart(2, '0');
          return formattedToday === dateString;
        }
      }
    }
  ];

  /** 执行对应匹配规则下的js, 有判断条件时需先满足 */
  for (const website of websites) {
    if (isMatch(website.match)) {
      website.js();
    }
  }

  /** 检测当前网址与指定规则是否匹配 */
  function isMatch(originalPattern) {
    return location.href.includes(originalPattern.replaceAll('*', ''));
  }
})();
