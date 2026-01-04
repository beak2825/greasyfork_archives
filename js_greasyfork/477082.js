// ==UserScript==
// @name         北邮人论坛冲浪小助手
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  查看某个用户的发帖历史，渲染 meme 图和图片链接
// @author       hahaMonster
// @match        https://bbs.byr.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477082/%E5%8C%97%E9%82%AE%E4%BA%BA%E8%AE%BA%E5%9D%9B%E5%86%B2%E6%B5%AA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477082/%E5%8C%97%E9%82%AE%E4%BA%BA%E8%AE%BA%E5%9D%9B%E5%86%B2%E6%B5%AA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
 
(function () {
  'use strict';
 
  let url = "";
 
 
  function main() {
    waitPageReady().then(r => {
      renderMemes()
      addSearchButton()
    })
  }
 
  /**
   * 等待页面加载完成
   * @returns {Promise<unknown>}
   */
  function waitPageReady() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (document.readyState === 'complete') {
          clearInterval(interval);
          resolve();
        }
      }, 100)
    })
  }
 
  /**
   * 添加memes的搜索按钮
   * 会显示一个小眼睛，点击后会弹出一个小窗口，显示该用户的发帖历史
   */
  function addSearchButton() {
    const targets = document.querySelectorAll('a');
 
    // filter out the links not contains /user/query
    const filteredTargets = Array.from(targets).filter((target) => {
      // if parent node is u-login-id, then skip
      if (target.parentNode.className === 'u-login-id') {
        return false;
      }
      return target.href.includes('/user/query') && !target.href.includes('IWhisper');
    })
 
 
    filteredTargets.forEach((target) => {
      // add a badge in the right
      const badge = document.createElement('span');
      badge.innerText = '👀';
      badge.style.color = 'red';
      badge.style.fontSize = '12px';
      badge.style.marginLeft = '5px';
      badge.style.cursor = 'pointer';
      target.parentNode.insertBefore(badge, target.nextSibling);
 
      // add click to badge
      badge.addEventListener('click', (event) => {
        // get href
        const href = target.href;
        // get user id  /user/query/xxx
        const userId = href.split('/').pop();
        const uri = `https://api.memes.bupt.site/post/author/${userId}`;
        // get request
        fetch(uri).then(response => response.json())
          .then(data => {
 
            data = data.data
 
            // add a small panel with three columns
            const panel = document.createElement('div');
            panel.style.position = 'fixed';
            panel.style.top = '0';
            panel.style.right = '0';
            panel.style.width = '50%';
            panel.style.height = '100%';
            panel.style.backgroundColor = 'white';
            panel.style.zIndex = '9999';
            panel.style.overflow = 'scroll';
            panel.style.padding = '10px';
            panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            panel.style.display = 'flex';
            panel.style.flexDirection = 'column';
            panel.style.alignItems = 'center';
            // round corner
            panel.style.borderTopLeftRadius = '10px';
            panel.style.borderBottomLeftRadius = '10px';
 
 
            // add a close button
            const closeBtn = document.createElement('span');
            closeBtn.innerText = '🙈';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '10px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '20px';
 
            // add a table
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.border = '1px solid #ccc';
            table.style.marginTop = '30px';
 
            // center
            table.style.textAlign = 'center';
 
            // gap
            table.style.borderSpacing = '0';
 
 
            // add table header
            const thead = document.createElement('thead');
            const tr = document.createElement('tr');
            const th1 = document.createElement('th');
            const th2 = document.createElement('th');
            const th3 = document.createElement('th');
            th1.innerText = '时间';
            th2.innerText = '标题';
            th3.innerText = '板块';
 
            // add table body
            const tbody = document.createElement('tbody');
 
            // add table header to table
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
            thead.appendChild(tr);
            table.appendChild(thead);
 
            // add table body to table
            data.forEach((item) => {
              const tr = document.createElement('tr');
              const td1 = document.createElement('td');
              const td2 = document.createElement('td');
              const td3 = document.createElement('td');
              td1.innerText = item.pubDate;
              td2.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
              td3.innerText = item.board;
              tr.appendChild(td1);
              tr.appendChild(td2);
              tr.appendChild(td3);
              tbody.appendChild(tr);
            })
 
            table.appendChild(tbody);
 
            // add table to panel
            panel.appendChild(closeBtn);
 
            // add table to panel
            panel.appendChild(table);
 
            // add panel to body
            document.body.appendChild(panel);
 
            // add click to close button
            closeBtn.addEventListener('click', (event) => {
              document.body.removeChild(panel);
            })
            // click outside to close
            document.addEventListener('click', (event) => {
              const target = event.target;
              if (target !== panel && document.contains(panel)) {
                document.body.removeChild(panel);
              }
            })
 
 
          });
      })
 
    })
  }
 
  /**
   * 渲染memes的链接和任意的第三方图片
   *
   */
  function renderMemes() {
    // find by class "a-content-wrap"
    const contentWrap = document.querySelector('.a-content-wrap');
    if (contentWrap == null) {
      return
    }
 
    // if has https://memes.bupt.site/share/meme/
    if (containsAny(contentWrap.textContent, ['https://memes.bupt.site/share/meme/'])) {
      const reg = /https:\/\/memes.bupt.site\/share\/meme\/\w+/g
      const memeUrl = contentWrap.textContent.match(reg)[0]
      // remove all child
      while (contentWrap.firstChild) {
        contentWrap.removeChild(contentWrap.firstChild);
      }
      // replace with iframe
      const iframe = document.createElement('iframe');
      iframe.src = memeUrl + "?from=bbs";
      iframe.style.width = '50%';
      iframe.style.height = '500px';
      iframe.style.border = 'none';
      contentWrap.appendChild(iframe);
      return;
    }
 
    // if it has single image end with .jpg, .png, .gif
    if (containsAny(contentWrap.textContent, ['.jpg', '.png', '.gif', '.jpeg', '.webp', '.bmp'])) {
      const reg = /https?:\/\/\S+\.( jpg|png|gif|jpeg|webp|bmp )/g
      const imageUrls = contentWrap.textContent.match(reg)
      // remove all child
      while (contentWrap.firstChild) {
        contentWrap.removeChild(contentWrap.firstChild);
      }
      // replace with image
      imageUrls.forEach((imageUrl) => {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.style.width = '50%';
        image.style.height = 'auto';
        contentWrap.appendChild(image);
      })
    }
 
 
  }
 
 
  /**
   * 判断字符串是否包含某些字符
   * @param str
   * @param substrings
   * @returns {boolean}
   */
  function containsAny(str, substrings) {
 
    for (let i = 0; i !== substrings.length; i++) {
      let substring = substrings[i];
      if (str.indexOf(substring) !== -1) {
        return true;
      }
    }
    return false;
  }
 
 
  setInterval(() => {
    if (url === window.location.href) {
      return
    }
    main()
    url = window.location.href;
  }, 500)
 
 
})();