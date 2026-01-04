// ==UserScript==
// @name         移动端 每日一文
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  仅供移动端使用，对页面进行了优化升级
// @author       Legendary
// @match        https://meiriyiwen.com/
// @icon         https://meiriyiwen.com/images/apple-icon.png
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/445001/%E7%A7%BB%E5%8A%A8%E7%AB%AF%20%E6%AF%8F%E6%97%A5%E4%B8%80%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/445001/%E7%A7%BB%E5%8A%A8%E7%AB%AF%20%E6%AF%8F%E6%97%A5%E4%B8%80%E6%96%87.meta.js
// ==/UserScript==

;(function () {
  // 获取需要的 DOM 节点
  const title_dom = document.querySelector('.container .articleTitle') // 标题
  const author_dom = document.querySelector('.container .articleAuthorName') // 作者
  const p_wrap_dom = document.querySelector('.articleContent') // 段落容器
  const p_list = document.querySelectorAll('.articleContent p') // 段落列表

  // 封装一个获取文章内容的函数
  function getCopyContent() {
    let temp_str = ''
    temp_str += `《${title_dom.innerText} - ${author_dom.innerText}》\n\n`
    p_list.forEach(p => (temp_str += p.innerText + '\n\n'))
    return temp_str
  }

  // 封装一个实现复制功能的方法
  function copy(copy_value = '') {
    const copy_container = document.createElement('textarea')
    copy_container.setAttribute('readonly', 'readonly') // 设置只读属性防止手机上弹出软键盘
    copy_container.value = copy_value
    document.body.appendChild(copy_container)
    copy_container.select()
    document.execCommand('copy')
    copy_container.remove()
    alert('复制成功')
  }

  // 移除无用界面
  function delUselessContent() {
    // 移除 logo
    document.querySelector('.logo').remove()
    // 移除底部的重复功能
    document.querySelectorAll('.header')[1].remove()
    document.querySelector('.randomBox').remove()
    document.querySelector('.footer').remove()
    document.querySelector('.footer-bottom').remove()
  }

  // 修改页面的不合理布局
  function changePage() {
    const page_title = `${title_dom.innerText} by ${author_dom.innerText}`
    document.title = page_title
    author_dom.style.fontSize = '14px'
    const author = author_dom.innerText
    const a_author = document.createElement('a')
    a_author.innerText = author
    a_author.setAttribute('href', `https://baike.baidu.com/item/${author}`)
    author_dom.innerHTML = ''
    author_dom.appendChild(a_author)
    // 修改段落的字体
    // p_wrap_dom.style.fontFamily = '楷体'
    p_wrap_dom.style.fontSize = '1em'
    p_wrap_dom.style.padding = '0 0.9em'
    title_dom.style.margin = '10px'
  }

  window.addEventListener('load', function () {
    // 修改页面的不合理布局
    changePage()
    // 移除无用界面
    delUselessContent()
    // 获取头部的功能菜单列表
    var menu_list = document.querySelectorAll('.header a')
    // 实现刷新功能
    menu_list[0].innerText = '刷新'
    // 实现复制功能
    menu_list[1].innerText = '复制'
    menu_list[1].setAttribute('href', 'javascript:;')
    // 给复制按钮绑定复制事件
    menu_list[1].addEventListener('click', function () {
      copy(getCopyContent())
    })
  })
})()
