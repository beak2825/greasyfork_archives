// ==UserScript==
// @name         枝网查重
// @namespace    https://greasyfork.org/
// @version      1.1.2
// @description  对B站A-SOUL评论区小作文进行一键枝网查重。
// @license      MIT
// @author       Kira Diana
// @match        https://*.bilibili.com/*
// @icon         https://i1.hdslb.com/bfs/face/55a7148e1c175c61c25e7ab7aee59abdac114fd4.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527581/%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/527581/%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  const DEBUG = true;
  const NAMESPACE = 'bilibili-asoulcnki';
  const asoulcnkiFrontend = 'https://asoulcnki.cbu.net'
  const apiBase = 'https://asoulcnki2.cbu.net';
  const refTag = '?utm_source=bilibili-asoulcnki-plugin&utm_campaign=tampermonkey'
  const feedbackUrl = 'https://space.bilibili.com/594527616';
 
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
    function pad(n) {
      return n < 10 ? '0'+n : ''+n
    }

    let date = new Date(timestamp * 1000)
    let year = date.getUTCFullYear()
    let month = pad(date.getMonth() + 1)
    let day = pad(date.getDate())
    let hour = pad(date.getHours())
    let minute = pad(date.getMinutes())
    let second = pad(date.getSeconds())
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
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
    let injectWrap
    if (item.tagName == 'BILI-COMMENT-RENDERER') {
      injectWrap = item.shadowRoot.querySelector('#main')
    } else if (item.tagName == 'BILI-COMMENT-REPLY-RENDERER') {
      injectWrap = item.shadowRoot.querySelector('#body')
    } else {
      return
    }
    let content = injectWrap.querySelector('bili-rich-text').shadowRoot.querySelector('#contents')

    if (injectWrap.querySelector('bili-comment-action-buttons-renderer').shadowRoot.querySelector('.asoulcnki')) {
      debug('already loaded for this comment');
      return
    }

    // Insert asoulcnki check button
    let asoulcnkiEl = document.createElement('span');
    let id = 0

    asoulcnkiEl.classList.add('asoulcnki', 'btn-hover', 'btn-highlight');
    asoulcnkiEl.innerText = '狠狠地查';
    asoulcnkiEl.style.marginLeft = '20px'
    asoulcnkiEl.style.color = '#9499A0'
    asoulcnkiEl.style.cursor = 'pointer'
    asoulcnkiEl.onmouseenter = e => {
      asoulcnkiEl.style.color = '#00AEEC'
    }
    asoulcnkiEl.onmouseout = e => {
      asoulcnkiEl.style.color = '#9499A0'
    }
    injectWrap.querySelector('bili-comment-action-buttons-renderer').shadowRoot.querySelector('#reply').after(asoulcnkiEl);

    asoulcnkiEl.addEventListener('click', e => {
      if (asoulcnkiEl.innerText == '正在查询') {
        return
      }
      asoulcnkiEl.innerText = '正在查询'
      let contentPrepared = '';

      // Copy meme icons alt text
      for (let node of content.childNodes.values()) {
        if (node.nodeType === 3) {
          contentPrepared += node.textContent;
        } else if (node.nodeName === 'IMG' && node.nodeType === 1) {
          // contentPrepared += node.alt;
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

        let resultHeaderContent = '';
        let resultContent = '';

        if (data.code !== 0) {
          resultContent = `<span>返回结果错误，可能是文本内容过短，或请访问 <a href="${apiBase}/${refTag}" target="_blank">枝网</a> 查看服务是否正常\n枝网返回结果参考：${data?.code || ''} ${data?.message || ''}</span>`;
        } else {
          let result = data.data;
          let startTime = result.start_time;
          let endTime = result.end_time;
          let rate = result.rate * 100;
          let relatedItems = result.related;
          resultHeaderContent = `<span><a href="${asoulcnkiFrontend}/${refTag}" target="_blank">枝网</a>文本复制检测报告（<a href="${feedbackUrl}" target="_blank">反馈</a>）</span>`
          resultHeaderContent += `<span class="copy-result-btn">复制报告</span>\n`

          resultContent = `<div class="result-content">查重时间：${formatDate(Date.now()/1000)}
数据范围：${formatDate(startTime)} 至 ${formatDate(endTime)}
总文字复制比：<b style="color: ${rateColor(rate)}">${percentDisplay(rate)}%</b>\n`;

          if (relatedItems.length === 0) {
            resultContent += `一眼原创，再偷必究（查重结果仅作娱乐参考）`;
          } else {
            let currentUid = injectWrap.querySelector('bili-comment-user-info').shadowRoot.querySelector('#user-name').getAttribute('data-user-profile-id')
            let currentCommentTimestamp = new Date(injectWrap.querySelector('bili-comment-action-buttons-renderer').shadowRoot.querySelector('#pubdate').innerText).valueOf() / 1000
            let originCommentTimestamp = +relatedItems[0].reply.ctime - new Date().getTimezoneOffset() * 60
            let isOriginal = +currentUid == +relatedItems[0].reply.mid && Math.abs(currentCommentTimestamp - originCommentTimestamp) < 60
            let selfOriginal = isOriginal ? `（<span style="color: blue;">本文原创/原偷，已收录</span>）` : '';
            let relatedCountAlert = relatedItems.length === 5 ? `（最多只显示最近 5 次）` : '';

            resultContent += `重复次数：${relatedItems.length}${selfOriginal}${relatedCountAlert}\n`;

            relatedItems.map((item, idx) => {
              let rate = item.rate * 100;
              let localTimestamp = item.reply.ctime - new Date().getTimezoneOffset() * 60
              resultContent += `#${idx + 1} <span style="color: ${rateColor(rate)}">${percentDisplay(rate)}%</span> <a href="${item.reply_url.trim()}" title="${sanitize(item.reply.content)}" target="_blank">${item.reply_url.trim()}</a>
发布于：${formatDate(localTimestamp)}
作者：${item.reply.m_name} (UID <a href="https://space.bilibili.com/${item.reply.mid}" target="_blank">${item.reply.mid}</a>)\n\n`;
            });

            resultContent += `查重结果仅作娱乐参考，请注意辨别是否为原创`;
            resultContent += `</div>`
          }
        }

        // Insert result
        let resultWrap = document.createElement('div');

        resultWrap.style.position = 'relative';
        resultWrap.style.padding = '.5rem';
        resultWrap.style.margin = '.5rem 0';
        resultWrap.style.fontSize = '15px';
        resultWrap.style.lineHeight = '22px';
        resultWrap.style.background = 'hsla(0, 0%, 50%, .1)';
        resultWrap.style.borderRadius = '4px';
        resultWrap.style.whiteSpace = 'pre';
        resultWrap.style.flexBasis = '100%';
        resultWrap.classList.add('asoulcnki-result');
        const nodes = Array.from(new DOMParser().parseFromString(resultHeaderContent + resultContent, 'text/html').body.childNodes)
        nodes.forEach(node => resultWrap.append(node))

        // Create close button
        let asoulcnkiCloseBtn = document.createElement('span');
        asoulcnkiCloseBtn.classList.add('asoulcnki-close');
        asoulcnkiCloseBtn.innerText = '+';
        asoulcnkiCloseBtn.style.position = 'absolute';
        asoulcnkiCloseBtn.style.top = '.5rem';
        asoulcnkiCloseBtn.style.right = '.5rem';
        asoulcnkiCloseBtn.style.width = '20px';
        asoulcnkiCloseBtn.style.height = '20px';
        asoulcnkiCloseBtn.style.fontSize = '20px';
        asoulcnkiCloseBtn.style.lineHeight = '1';
        asoulcnkiCloseBtn.style.textAlign = 'center';
        asoulcnkiCloseBtn.style.transform = 'rotate(45deg)';
        asoulcnkiCloseBtn.style.cursor = 'pointer';

        resultWrap.append(asoulcnkiCloseBtn);

        resultWrap.innerHTML += `<style>
          .asoulcnki-result a {
            color: #008AC5;
          }
          .asoulcnki-result a:hover {
            color: #00AEEC;
          }
          .copy-result-btn {
            margin-left: 5px;
            color: #008AC5;
            cursor: pointer;
          }
          .copy-result-btn:hover {
            color: #00AEEC;
          }
          .result-content {
            margin: 0;
            padding: 0;
          }
        </style>`

        // Remove previous result if exists
        if (injectWrap.querySelector('.asoulcnki-result')) {
          injectWrap.querySelector('.asoulcnki-result').remove();
        }
        injectWrap.append(resultWrap);
        injectWrap.querySelector('.asoulcnki-close').onclick = e => {
          injectWrap.querySelector('.asoulcnki-result').remove()
        }
        let copyResultBtn = injectWrap.querySelector('.copy-result-btn')
        copyResultBtn.onclick = e => {
          let resultText = '枝网文本复制检测报告\n' + resultWrap.querySelector('.result-content').textContent
          navigator.clipboard.writeText(/Windows/.test(navigator.userAgent) ? resultText.replaceAll('\n', '\r') : resultText)
          copyResultBtn.innerText = '已复制到剪贴板！'
          copyResultBtn.style.color = '#10B981'
          setTimeout(()=>{
            copyResultBtn.innerText = '复制报告'
            copyResultBtn.style.color = '#008AC5'
          }, 8000)
        }

        asoulcnkiEl.innerText = '狠狠地查'
      })
      .catch(error => {
        alert(`枝网后端出错，请检查网络，报错信息：${error}`);
        debug('fetch error', error);
        asoulcnkiEl.innerText = '狠狠地查'
      });
    }, false);
  }
 
  function observeComment(commentThread) {
    let biliCommentRenderer = commentThread.shadowRoot.querySelector('bili-comment-renderer')
    if (biliCommentRenderer.shadowRoot.querySelector('bili-comment-action-buttons-renderer').shadowRoot.querySelector('.asoulcnki')) {
      return
    }
    attachEl(biliCommentRenderer)

    let repliesContainer = commentThread.shadowRoot.querySelector('bili-comment-replies-renderer').shadowRoot.querySelector('#expander-contents')
    Array.from(repliesContainer.children).forEach(replyRenderer => {
      if (replyRenderer.tagName == 'BILI-COMMENT-REPLY-RENDERER') {
        attachEl(replyRenderer)
      }
    })

    const repliesObserver = new MutationObserver((mutationsList, observer) => {
      setTimeout(() => {
        mutationsList.forEach(mutation => {
          mutation.addedNodes.forEach(addedNode => {
            if (addedNode.tagName == 'BILI-COMMENT-REPLY-RENDERER') {
              attachEl(addedNode)
            }
          })
        })
      }, 100)
    })
    repliesObserver.observe(repliesContainer, { attributes: false, childList: true, subtree: false })
  }

  setInterval(() => {
    let biliCommentsList = document.querySelectorAll('bili-comments')
    biliCommentsList.forEach(biliComments=> {
      let commentThreadsContainer = biliComments.shadowRoot.querySelector('#feed');
      if (!commentThreadsContainer) {
        return
      }

      Array.from(commentThreadsContainer.children).forEach(commentThread => observeComment(commentThread))

      const commentThreadsObserver = new MutationObserver((mutationsList, observer) => {
        setTimeout(() => {
          for (const mutation of mutationsList) {
            if (mutation.type == 'childList') {
              mutation.addedNodes.forEach(addedNode => {
                if (addedNode.tagName == 'BILI-COMMENT-THREAD-RENDERER') {
                  observeComment(addedNode)
                }
              })
            }
          }
        }, 100)
      });
      commentThreadsObserver.observe(commentThreadsContainer, { attributes: false, childList: true, subtree: true });
    })
  }, 1000)
}, false);