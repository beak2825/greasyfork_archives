// ==UserScript==
// @name         批量获取抖音链接
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  日常工作自动化脚本
// @author       Aturan
// @license      MIT
// @match        https://www.douyin.com/search/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/470200/%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E6%8A%96%E9%9F%B3%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/470200/%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E6%8A%96%E9%9F%B3%E9%93%BE%E6%8E%A5.meta.js
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
    let csvString = [['视频链接', '点赞数', '评论数', '收藏数', '转发数'], ...dataList].map((val) => val.map((item) => `"${item}"`).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv,charset=UTF-8' });
    const csvUrl = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = `抖音导出链接数据_${new Date().getTime()}.csv`;
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
      background: '#fff',
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
      await sleep(1000);
    }

    $(document).scrollTop(0);

    while (running) {
      try {
        console.log('处理链接:', cursor);
        const result = await run(cursor);
        if (result) {
          textList.push([result.text, result.likes, result.comments, result.collects, result.shares]);
          cursor++;
        } else {
          running = false;
        }
      } catch (err) {
        console.error(err);
        cursor++;
      }
    }

    alert('全部处理完毕，可以点击导出!');
  }

  async function run(index) {
    const $list = $('#douyin-right-container .videoImage').parents('[data-e2e=scroll-list]').children('li');
    if ($list.eq(index).length === 0) {
      return;
    }
    $list.eq(index).find('a').get(0).click();
    await sleep(300);
    await wait(() => location.search.includes('modal_id'), 1000);
    await wait(() => $('[data-e2e=video-player-share]').length > 0);
    $('[data-e2e=video-player-share]').get(0).click();
    await wait(() => $('[data-e2e=video-share-container] button').eq(2).length > 0);
    const text = $('[data-e2e=video-share-container] button').eq(2).find('img').attr('alt');
    const likes = $('[data-e2e=video-player-digg]').text();
    const comments = $('[data-e2e=feed-comment-icon]').text();
    const collects = $('[data-e2e=video-player-collect]').text();
    const shares = $('[data-e2e=video-player-share]').text();
    $('.bFdMjgdW').get(0).click();
    await sleep(300);
    await wait(() => !location.search.includes('modal_id'));
    return { text, likes: formatCount(likes), comments: formatCount(comments), collects: formatCount(collects), shares: formatCount(shares) };
  }

  function formatCount(text) {
    return /\d+/.test(text) ? text : '0';
  }

  async function wait(fn, timeout = 3000) {
    if (!fn.start_at) {
      fn.start_at = Date.now();
    }
    const result = await fn();
    if (result) {
      return;
    }
    if (timeout && Date.now() - fn.start_at > timeout) {
      throw new Error('处理超时');
    }
    await sleep(300);
    return await wait(fn, timeout);
  }

  function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
})();
