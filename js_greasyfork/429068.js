// ==UserScript==
// @name         bilibili 枝网查重 API 版
// @namespace    https://github.com/sparanoid/userscript
// @supportURL   https://github.com/sparanoid/userscript/issues
// @version      0.1.14
// @description  bilibili 枝网（asoulcnki.asia）查重 API 版
// @author       Sparanoid
// @license      AGPL
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        https://*.bilibili.com/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/429068/bilibili%20%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D%20API%20%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/429068/bilibili%20%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D%20API%20%E7%89%88.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  const DEBUG = true;
  const NAMESPACE = 'bilibili-asoulcnki';
  const apiBase = 'https://asoulcnki.asia';
  const refTag = '?utm_source=bilibili-asoulcnki-plugin&utm_campaign=tampermonkey'
  const feedbackUrl = 'https://t.bilibili.com/545085157213602473';

  console.log(`${NAMESPACE} loaded`);

  async function fetchResult(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  function debug(description = '', msg = '', force = false) {
    if (DEBUG || force) {
      console.log(`${NAMESPACE}: ${description}`, msg)
    }
  }

  function formatDate(timestamp) {
    let date = timestamp.toString().length === 10 ? new Date(+timestamp * 1000) : new Date(+timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  function rateColor(percent) {
    return `hsl(${100 - percent}, 70%, 45%)`;
  }

  function percentDisplay(num) {
    return num.toFixed(2).replace('.00', '');
  }

  function sanitize(string) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, match => map[match]);
  }

  function attachEl(item) {
    let injectWrap = item.querySelector('.con .info');

    // .text - comment content
    // .text-con - reply content
    let content = item.querySelector('.con .text') || item.querySelector('.reply-con .text-con');
    let id = item.dataset.id;

    // Simple way to attach element on replies initially loaded with comment
    // which wouldn't trigger mutation inside observeComments
    let replies = item.querySelectorAll('.con .reply-box .reply-item');
    if (replies.length > 0) {
      [...replies].map(reply => {
        attachEl(reply);
      });
    }

    if (injectWrap.querySelector('.asoulcnki')) {
      debug('already loaded for this comment');
    } else {
      // Insert asoulcnki check button
      let asoulcnkiEl = document.createElement('span');

      asoulcnkiEl.classList.add('asoulcnki', 'btn-hover', 'btn-highlight');
      asoulcnkiEl.innerHTML = '狠狠地查';
      asoulcnkiEl.addEventListener('click', e => {
        let contentPrepared = '';

        // Copy meme icons alt text
        for (let node of content.childNodes.values()) {
          if (node.nodeType === 3) {
            contentPrepared += node.textContent;
          } else if (node.nodeName === 'IMG' && node.nodeType === 1) {
            contentPrepared += node.alt;
          } else if (node.nodeName === 'BR' && node.nodeType === 1) {
            contentPrepared += '\n';
          } else if (node.nodeName === 'A' && node.nodeType === 1 && node.classList.contains('comment-jump-url')) {
            contentPrepared += node.href.replace(/https?:\/\/www\.bilibili\.com\/video\//, '');
          } else {
            contentPrepared += node.innerText;
          }
        }

        // Need regex to stripe `回复 @username  :`
        let contentProcessed = contentPrepared.replace(/回复 @.*:/, '');
        debug('content processed', contentProcessed);

        // ask to confirm if words count not enough
        if (contentProcessed.length < 10 && !confirm('内容过短（少于 10 字），可能无法得到正确结果，是否继续查询？')) return;

        fetchResult(`${apiBase}/v1/api/check`, {
          text: contentProcessed
        })
        .then(data => {
          debug('data returned', data);

          let resultContent = '';

          if (data.code !== 0) {
            resultContent = `返回结果错误，可能是文本内容过短，或请访问 <a href="${apiBase}/${refTag}" target="_blank">枝网</a> 查看服务是否正常\n枝网返回结果参考：${data?.code || ''} ${data?.message || ''}`;
          } else {
            let result = data.data;
            let startTime = result.start_time;
            let endTime = result.end_time;
            let rate = result.rate * 100;
            let relatedItems = result.related;

            resultContent = `<a href="${apiBase}/${refTag}" target="_blank">枝网</a>文本复制检测报告（油猴一键版 ${feedbackUrl}）
查重时间：${formatDate(Date.now())}
总文字复制比：<b style="color: ${rateColor(rate)}">${percentDisplay(rate)}%</b>\n`;

            if (relatedItems.length === 0) {
              resultContent += `一眼原创，再偷必究（查重结果仅作娱乐参考）`;
            } else {
              let selfOriginal = +relatedItems[0].reply.rpid === +id ? `（<span style="color: blue;">本文原创/原偷，已收录</span>）` : '';
              let relatedCountAlert = relatedItems.length === 5 ? `（最多只显示最近 5 次）` : '';

              resultContent += `重复次数：${relatedItems.length}${selfOriginal}${relatedCountAlert}\n`;

              relatedItems.map((item, idx) => {
                let rate = item.rate * 100;

                resultContent += `#${idx + 1} <span style="color: ${rateColor(rate)}">${percentDisplay(rate)}%</span> <a href="${item.reply_url.trim()}" title="${sanitize(item.reply.content)}" target="_blank">${item.reply_url.trim()}</a>
发布于：${formatDate(item.reply.ctime)}
作者：${item.reply.m_name} (UID <a href="https://space.bilibili.com/${item.reply.mid}" target="_blank">${item.reply.mid}</a>)\n\n`;
              });

              resultContent += `查重结果仅作娱乐参考，请注意辨别是否为原创`;
            }
          }

          // Insert result
          let resultWrap = document.createElement('div');

          resultWrap.style.position = 'relative';
          resultWrap.style.padding = '.5rem';
          resultWrap.style.margin = '.5rem 0';
          resultWrap.style.background = 'hsla(0, 0%, 50%, .1)';
          resultWrap.style.borderRadius = '4px';
          resultWrap.style.whiteSpace = 'pre';
          resultWrap.style.flexBasis = '100%';
          resultWrap.classList.add('asoulcnki-result');
          resultWrap.innerHTML = resultContent;

          // Create close button
          let asoulcnkiCloseBtn = document.createElement('span');
          asoulcnkiCloseBtn.classList.add('asoulcnki-close');
          asoulcnkiCloseBtn.innerHTML = '+';
          asoulcnkiCloseBtn.style.position = 'absolute';
          asoulcnkiCloseBtn.style.top = '.5rem';
          asoulcnkiCloseBtn.style.right = '.5rem';
          asoulcnkiCloseBtn.style.width = '16px';
          asoulcnkiCloseBtn.style.height = '16px';
          asoulcnkiCloseBtn.style.fontSize = '16px';
          asoulcnkiCloseBtn.style.lineHeight = '1';
          asoulcnkiCloseBtn.style.textAlign = 'center';
          asoulcnkiCloseBtn.style.transform = 'rotate(45deg)';
          asoulcnkiCloseBtn.style.cursor = 'pointer';
          asoulcnkiCloseBtn.addEventListener('click', e => {
            injectWrap.querySelector('.asoulcnki-result').remove();
          });

          resultWrap.append(asoulcnkiCloseBtn);

          // Remove previous result if exists
          if (injectWrap.querySelector('.asoulcnki-result')) {
            injectWrap.querySelector('.asoulcnki-result').remove();
          }
          injectWrap.append(resultWrap);
        })
        .catch(error => {
          alert(`枝网后端出错，请检查网络，报错信息：${error}`);
          debug('fetch error', error);
        });
      }, false);

      injectWrap.querySelector('.operation').before(asoulcnkiEl);

      // Insert comment ID link
      let idLink = document.createElement('a');

      idLink.innerHTML = '#';
      idLink.setAttribute('title', '当前评论 ID: ' + id);
      idLink.setAttribute('href', '#reply' + id);
      idLink.style.marginRight = '.25em';

      injectWrap.prepend(idLink);
    }
  }

  function observeComments(wrapper) {
    // .comment-list - general list for video, zhuanlan, and dongtai
    // .reply-box - replies attached to specific comment
    let commentLists = wrapper ? wrapper.querySelectorAll('.comment-list, .reply-box') : document.querySelectorAll('.comment-list, .reply-box');

    if (commentLists) {

      [...commentLists].map(commentList => {

        // Directly attach elements for pure static server side rendered comments
        // and replies list. Used by zhuanlan posts with reply hash in URL.
        // TODO: need a better solution
        [...commentList.querySelectorAll('.list-item, .reply-item')].map(item => {
          attachEl(item);
        });

        const observer = new MutationObserver((mutationsList, observer) => {

          for (const mutation of mutationsList) {

            if (mutation.type === 'childList') {

              debug('observed mutations', [...mutation.addedNodes].length);

              [...mutation.addedNodes].map(item => {
                attachEl(item);

                // Check if the comment has replies
                // I check replies here to make sure I can disable subtree option for
                // MutationObserver to get better performance.
                let replies = item.querySelectorAll('.con .reply-box .reply-item');

                if (replies.length > 0) {
                  observeComments(item)
                  debug(item.dataset.id + ' has rendered reply(ies)', replies.length);
                }
              })
            }
          }
        });
        observer.observe(commentList, { attributes: false, childList: true, subtree: false });
      });
    }
  }

  // .bb-comment loads directly for zhuanlan post. So load it directly
  observeComments();

  // .bb-comment loads dynamcially for dontai and videos. So observe it first
  const wrapperObserver = new MutationObserver((mutationsList, observer) => {

    for (const mutation of mutationsList) {

      if (mutation.type === 'childList') {

        [...mutation.addedNodes].map(item => {
          debug('mutation wrapper added', item);

          if (item.classList?.contains('bb-comment')) {
            debug('mutation wrapper added (found target)', item);

            observeComments(item);

            // Stop observing
            // TODO: when observer stops it won't work for dynamic homepage ie. https://space.bilibili.com/703007996/dynamic
            // so disable it here. This may have some performance impact on low-end machines.
            // wrapperObserver.disconnect();
          }
        })
      }
    }
  });
  wrapperObserver.observe(document.body, { attributes: false, childList: true, subtree: true });

}, false);
