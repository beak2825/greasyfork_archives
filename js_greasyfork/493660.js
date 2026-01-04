// ==UserScript==
// @name         code2-haisheteam-auto-upload-website
// @namespace    code2-haisheteam
// @version      2024-04-28
// @description  自动发布更新
// @author       jk
// @match        http://code2.haisheteam.com/website
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493660/code2-haisheteam-auto-upload-website.user.js
// @updateURL https://update.greasyfork.org/scripts/493660/code2-haisheteam-auto-upload-website.meta.js
// ==/UserScript==

(function() {
  function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
  }
  window.addEventListener('load', () => {
    const header = document.getElementsByClassName('header-user-con')[0]
    async function loadFn(e) {
      const idx = e.target.dataset.idx
      const element = document.getElementById(`autorun-more-oper-btn-${idx}`)
      const mouseMoveEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
        // clientX: 100, // 设置鼠标在页面中的横坐标
        // clientY: 100  // 设置鼠标在页面中的纵坐标
      });
      element?.dispatchEvent(mouseMoveEvent);

      await delay(1000)
      const editbtn = document.getElementById(`autorun-edit-btn-${idx}`)
      editbtn?.click()
      element?.dispatchEvent(new MouseEvent('mouseleave', {
        bubbles: true,
        cancelable: true
      }))
      await delay(1000)
      const confirmBtn = document.querySelector('#app > div > div.content-box > div.content > div > div:nth-child(3) > div > div > footer > span > button:nth-child(3)')
      confirmBtn?.click()
      await delay(1000)
      const releaseBtn = document.getElementById(`autorun-release-btn-${idx}`)
      releaseBtn?.click()
      await delay(1000)
      const dialogReleaseBtn = document.getElementById('release-dialog-btn')
      dialogReleaseBtn?.click()
    }

    let count = 3
    while (count--) {
      const btn = document.createElement('button')
      btn.dataset.idx = count
      btn.innerText = `自动更新-${count}`
      header.append(btn)
      btn.addEventListener('click', loadFn)
    }
  })
  })();