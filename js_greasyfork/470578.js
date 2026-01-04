// ==UserScript==
// @name         QQ邮箱-自动批量删除邮件-清空收件箱
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮助你自动删除收件箱中的邮件，省去一页页勾选删除
// @author       You
// @match        *://mail.qq.com/cgi-bin/mail_list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470578/QQ%E9%82%AE%E7%AE%B1-%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E9%82%AE%E4%BB%B6-%E6%B8%85%E7%A9%BA%E6%94%B6%E4%BB%B6%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/470578/QQ%E9%82%AE%E7%AE%B1-%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E9%82%AE%E4%BB%B6-%E6%B8%85%E7%A9%BA%E6%94%B6%E4%BB%B6%E7%AE%B1.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function is_no_mail() {
  const tips_bar = document.getElementById("tips_bar")
  if (!tips_bar) return false
  if (!tips_bar.children[0]) return false
  return tips_bar.children[0].className == "nomail" && tips_bar.children[0].children[0] && tips_bar.children[0].children[0].innerHTML == "没有邮件"
}

async function delete_this_page() {
  if (is_no_mail()) {
    GM_setValue("auto_delete_qq_mail", false)
    button.textContent = '开始自动删除'
    return
  }
  const select_all_button = document.getElementById("ckb_selectAll")
  if (!select_all_button) return
  if (!select_all_button.checked) select_all_button.click()
  const delete_button = document.getElementById("quick_del")
  if (!select_all_button.checked) return
  delete_button.click()
  setTimeout(() => {
    console.log('timeout')
    document.getElementById('readmailbtn_link').click()
  }, 60000)
  await sleep(1000)
  console.log("delete done")
}

function create_button() {
  const quick_del_button = document.getElementById('quick_del')
  if (!quick_del_button) return
  let button = document.createElement('button')
  button.className = 'btn_gray btn_space'
  if (GM_getValue("auto_delete_qq_mail") === true) {
    button.textContent = '取消自动删除'
  } else {
    button.textContent = '开始自动删除'
  }
  button.onclick = function () {
    if (GM_getValue("auto_delete_qq_mail") === true) {
      GM_setValue("auto_delete_qq_mail", false)
      button.textContent = '开始自动删除'
    } else {
      GM_setValue("auto_delete_qq_mail", true)
      button.textContent = '取消自动删除'
    }
  }
  quick_del_button.parentElement.insertBefore(button, quick_del_button)
  let on_click_delete_button = document.createElement('button')
  on_click_delete_button.className = 'btn_gray btn_space'
  on_click_delete_button.textContent = '一键删除'
  on_click_delete_button.onclick = function () {
    delete_this_page()
  }
  quick_del_button.parentElement.insertBefore(on_click_delete_button, quick_del_button)
}

async function dispatch() {
  for (; ;) {
    await sleep(100)
    if (GM_getValue("auto_delete_qq_mail") === true) {
      await delete_this_page()
    }
  }
}

(function () {
  'use strict';
  create_button()
  dispatch()
  // Your code here...
})();