// ==UserScript==
// @name         吾爱后台管理全选
// @namespace    https://greasyfork.org/zh-CN/scripts/479744
// @version      1.0.1
// @description  吾爱后台管理全选(除第一个)
// @author       冰冻大西瓜
// @match        https://www.52pojie.cn/forum.php?mod=modcp&action=thread&op=post*
// @license      AGPL-3.0-only
// @grant        GM_addStyle
// @note         2024年6月14日 更新分表样式,提高管理效率
// @downloadURL https://update.greasyfork.org/scripts/479744/%E5%90%BE%E7%88%B1%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479744/%E5%90%BE%E7%88%B1%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

const target = document.querySelector('.mtm.mbm')
const btn = document.createElement('button')

btn.innerText = '除第一条 全选'

btn.style.margin = '0 10px'
btn.onclick = function () {
  /* 获取所有列表 */
  const inputs = document.querySelectorAll('input[name="delete[]"]')
  inputs.forEach((item, index) => {
    // 除第一个全选
    if (index !== 0) {
      item.checked = true
    }
  })
}
target.appendChild(btn)

const delBtn = document.querySelector('#deletesubmit')
const delBtn2 = document.createElement('button')
delBtn2.innerText = '删除'

delBtn2.style.margin = '0 10px'
delBtn2.onclick = function () {
  delBtn.click()
}
target.appendChild(delBtn2)

// 简化帖子分表
const table = document.querySelector('td[colspan="3"]>span.ftid')
GM_addStyle(`
#posttableid_ctrl {
  display: none;
  }`)
const searchsubmit = document.querySelector('#searchsubmit')
// 获取分表内容
const posttableid_ctrl_menu = Array.from(document.querySelectorAll('#posttableid_ctrl_menu ul li'))
// 获取分表第一项名称
const posttableid_ctrl_menu_first = posttableid_ctrl_menu.at(0).textContent
// 获取分表最后一项名称
const posttableid_ctrl_menu_last = posttableid_ctrl_menu.at(-1).textContent

const select = table.querySelector('#posttableid')

const box = document.createElement('span')
box.innerHTML = `
      <button id="tableFirst" type="button">${posttableid_ctrl_menu_first}</button>
      <button id="tableLast" type="button">${posttableid_ctrl_menu_last}</button>`
// 添加点击事件
box.addEventListener('click', event => {
  if (event.target.nodeName === 'BUTTON') {
    console.log(event.target)
    select.querySelector('option').value = event.target.textContent.split('post_')[1]
    searchsubmit.click()
  }
})

table.appendChild(box)
