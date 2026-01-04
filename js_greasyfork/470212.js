// ==UserScript==
// @name         批量获取快手链接
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  日常工作自动化脚本
// @author       Aturan
// @license      MIT
// @match        https://www.kuaishou.com/search/video*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/470212/%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E5%BF%AB%E6%89%8B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/470212/%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E5%BF%AB%E6%89%8B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const textList = [];
  let cursor = 0;
  let running = false;

  $(() => {
    const $runBtn = createBtn(0, '运行');
    const $exportBtn = createBtn(1, '导出');
    $runBtn.on('click', () => {
      if (running) {
        return;
      }
      const result = window.prompt('请输入要加载的页数');
      if (!result) {
        return;
      }
      if (!/^\d+$/.test(result)) {
        alert('请输入有效页面');
        return;
      }
      const pages = Number(result);
      load(pages);
    });
    $exportBtn.on('click', () => {
      if (running) {
        return;
      }
      if (textList.length === 0) {
        alert('没有可导出的数据');
        return;
      }
      handleExport(textList);
    });
  });

  function handleExport(dataList) {
    let csvString = [['视频链接', '点赞数'], ...dataList].map((val) => val.map((item) => `"${item}"`).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv,charset=UTF-8' });
    const csvUrl = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = `快手导出链接数据_${new Date().getTime()}.csv`;
    link.href = csvUrl;
    link.click();
  }

  function createBtn(index, text) {
    const $div = $('<div />');
    $div.css({
      width: '50px',
      height: '50px',
      borderRadius: '50px',
      position: 'fixed',
      top: `${135 + 60 * index}px`,
      right: '8px',
      background: '#000',
      color: '#fff',
      zIndex: 99999,
      textAlign: 'center',
      lineHeight: '50px',
      cursor: 'pointer',
    });
    $div.text(text);
    $div.appendTo('body');
    return $div;
  }

  async function load(pages) {
    console.log('要加载的页数:', pages);
    let page = 0;
    running = true;
    while (page < pages) {
      console.log('加载下一页:', page + 1);
      $(document).scrollTop(999999);
      page++;
      await sleep(2000);
    }

    $(document).scrollTop(0);

    while (running) {
      try {
        console.log('获取链接:', cursor);
        const result = await run(cursor);
        if (result) {
          textList.push([result.text, result.likes]);
          cursor++;
        } else {
          running = false;
        }
      } catch (err) {
        console.error(err);
        running = false;
      }
    }
  }

  async function run(index) {
    const $list = $('.video-container .video-item');
    if ($list.eq(index).length === 0) {
      return;
    }
    $list.eq(index).find('.card-link').get(0).click();
    await sleep(700);
    await wait(() => location.pathname.includes('short-video'));
    const text = location.href.split('?')[0];
    const likes = formatCount($('.like-item').text());
    $('.close-page').get(0).click();
    await wait(() => location.search.includes('search'));
    await sleep(700);
    return { text, likes };
  }

  function formatCount(text) {
    return /\d+/.test(text) ? text : '0';
  }

  async function wait(fn) {
    const result = await fn();
    if (result) {
      return;
    } else {
      await sleep(300);
      return wait(fn);
    }
  }

  function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
})();
