// ==UserScript==
// @name         一键复制
// @namespace    http://tampermonkey.net/
// @version      2.0.7
// @description  适用于Chrome浏览器，火狐浏览器用户请移至「谷歌浏览器」使用
// @author       sdkkdsdalsjlajdsalsdk
// @match        https://ktt.pinduoduo.com/groups/detail/*
// @match        https://pro.qunjielong.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475075/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/475075/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  const href = window.location.href;
  const isKttPage = href.indexOf('https://ktt.pinduoduo.com/groups/detail/') > -1;
  const isQjlPage = href.indexOf('https://pro.qunjielong.com/#/seq/seq-detail?actId=') > -1;
 
  /**
   * toast
   */
  function showToast(msg) {
    const ToastNode = $(`<div class="toast-content" style="position: fixed;z-index: 100;top: 0;left: 0;width: 100vw;height: 100vh;display: flex;justify-content: center;align-items: center;color: #fff">
      <div class="toast" style="background-color: rgba(36, 36, 37, 0.81);border-radius: 10px;padding: 10px;justify-content: center;align-items: center;">
        <span>${msg}</span>
      </div>
    </div>`);
    $('body').before(ToastNode);
    // $('body').insertAdjacentHTML('beforeend', ToastNode);
    setTimeout(function() {
      $('.toast-content').hide();
    }, 1500);
  }
 
  /**
   * 抓取快团团笔记内容
   */
  async function pickKttNoteDetail() {
    const title = $("div[class^='Header_title'] span[class^='Header_name']").html();
    const note = $("div[class^='ImageText_imageText']");
    const items = note.children();
    const mediaItems = []; // 只抓取图片、文字、视频
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.className.indexOf('ImageText_img') > -1) {
        const imgNode = item.children && item.children[0];
        mediaItems.push({
          type: 'image',
          value: imgNode.src,
        });
      }
 
      if (item.tagName === 'PRE') {
        const textNode = item.children && item.children[0];
        if (textNode && textNode.className.indexOf('ImageText_desc') > -1) {
          mediaItems.push({
            type: 'text',
            value: textNode.innerHTML,
          });
        }
      }
 
      if (item.tagName === 'VIDEO') {
        mediaItems.push({
          type: 'outerVideo',
          value: item.src,
        });
      }
    }
 
    const pasteContent = JSON.stringify([
      {
        type: 'title',
        value: title,
      },
      ...mediaItems,
    ]);
 
    // 仅仅是复制到剪切板
    // 顺序：油猴一键复制后，在笔记后台点击复制笔记
    navigator.clipboard.writeText(pasteContent);
    console.log(pasteContent);
    showToast('复制成功');
  }
 
  /**
   * 抓取群接龙团详情
   * @returns {Promise<void>}
   */
  async function pickQjlNoteDetail() {
    const title = $('.content-main section')[0]?.querySelector('.ng-star-inserted>.pre-line')?.textContent;
    const note = $('.ant-card-body section')[2];
    const items = note.children;
    const mediaItems = []; // 只抓取图片、文字、视频
    for (let i = 0; i < items.length; i++) {
      const item = items[i]?.children;
 
      // 做下代码保护
      if (!item || !item[0]) {
        continue;
      }
 
      // 大图
      if (item[0].className.indexOf('good-big-img') > -1) {
        mediaItems.push({
          type: 'image',
          value: item[0].src,
          imgType: 'big',
        });
      }
 
      // 小图
      if (item[0].className.indexOf('good-small-box') > -1) {
        const imagesNode = Array.from(item[0].children);
        imagesNode.forEach(img => {
          mediaItems.push({
            type: 'image',
            value: img.src,
            imgType: 'small',
          });
        })
      }
 
      // 文本
      if (item[0].className.indexOf('pre-line') > -1) {
        const textNode = item[0];
        mediaItems.push({
          type: 'text',
          value: textNode.textContent,
        });
      }
 
      // 视频
      if (item[0].className.indexOf('video-box') > -1) {
        const videoNode = item[0].children[0];
        mediaItems.push({
          type: 'outerVideo',
          value: videoNode.src,
        });
      }
    }
 
    const pasteContent = JSON.stringify([
      {
        type: 'title',
        value: title,
      },
      ...mediaItems,
    ]);
 
    // 仅仅是复制到剪切板
    // 顺序：油猴一键复制后，在笔记后台点击复制笔记
    navigator.clipboard.writeText(pasteContent);
    console.log(pasteContent);
    showToast('复制成功');
  }
 
  /**
   * 返回「复制笔记内容」按钮
   * 用于复制笔记内容
   * @returns {*|jQuery|HTMLElement}
   */
  function renderNoteCopyBtn() {
    const $btn = $('<a id="btn_copy_note">一键复制</a>');
    let btnCss = null;
 
    $btn.hover(
      function() {
        $(this).css({
          'background-color': '#356fd4',
          border: '1px solid #356fd4',
        });
      },
      function() {
        $(this).css({
          'background-color': '#1989fa',
          border: '1px solid #1989fa',
        });
      },
    );
 
    if (isKttPage) {
      btnCss = {
        display: 'flex',
        height: '24px',
        position: 'absolute',
        top: '10px',
        right: '230px',
        padding: '4px 8px',
        color: '#fff',
        cursor: 'pointer',
        border: '1px solid #1989fa',
        'z-index': 999,
        'align-items': 'center',
        'margin-right': '10px',
        'border-radius': '4px',
        'background-color': '#1989fa',
      };
 
      // 点击事件
      $btn.click(pickKttNoteDetail);
    }
    if (isQjlPage) {
      btnCss = {
        display: 'flex',
        height: '32px',
        position: 'absolute',
        top: '16px',
        right: '230px',
        padding: '4px 8px',
        color: '#fff',
        cursor: 'pointer',
        border: '1px solid #1989fa',
        'z-index': 999,
        'align-items': 'center',
        'margin-right': '10px',
        'border-radius': '4px',
        'background-color': '#1989fa',
      };
 
      // 点击事件
      $btn.click(pickQjlNoteDetail);
    }
 
    $btn.css(btnCss);
 
    return $btn;
  }
 
  /**
   * 添加
   */
  function initUI() {
    // 快团团
    if (isKttPage) {
      const noteCopyBtn = renderNoteCopyBtn();
      $('body').before(noteCopyBtn);
    }
 
    // 群接龙
    if (isQjlPage) {
      const noteCopyBtn = renderNoteCopyBtn();
      $('body').before(noteCopyBtn);
    }
  }
 
  /**
   * 检查下DOM节点是否已经挂载
   * @returns {boolean}
   */
  let count = 0;
  function checkDomIsReady() {
    count++; // 做个兜底，避免无限调用
    let dom = null;
 
    if (isKttPage) {
      dom = $("div[class^='ImageText_imageText']");
    }
 
    if (isQjlPage) {
      dom = $('#rich-text .ant-card-body .ng-star-inserted');
    }
 
    if (dom?.length || count > 100) {
      clearInterval(interval);
      interval = null;
      initUI();
    }
  }
 
  // 初始化
  let interval = setInterval(checkDomIsReady, 100);
})();