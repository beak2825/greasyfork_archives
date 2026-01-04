// ==UserScript==
// @name         获取淘宝宝贝页面的图片网址
// @namespace    https://github.com/xuejianxianzun/getTaoBaoImgURL
// @version      0.2
// @description  可以获取头部宣传图、以及详细介绍里的图片网址，可以复制到下载器下载。使用方法：在详情页面右侧会出现一个按钮，点击获取图片网址。注意：1.如果要获取详细介绍里的图片，需要手动下拉页面，等详细介绍区域全部显示，再点击按钮。2.不会获取评论区图片。
// @author       You
// @match        https://detail.tmall.com/item.htm*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392891/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E5%AE%9D%E8%B4%9D%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%9B%BE%E7%89%87%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/392891/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E5%AE%9D%E8%B4%9D%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%9B%BE%E7%89%87%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

let result = new Set()

// 添加按钮
let btn = document.createElement('button')
btn.textContent = 'img url'
btn.style = `position: fixed;
right: 0;
border: none;
color: #fff;
top: 50%;
z-index: 99999;
background: rgb(255,0,54);
border-radius: 5px;
cursor: pointer;
padding: 5px 5px;`
document.body.append(btn)
btn.addEventListener('click', function() {
  this.disabled = true
  // 开始执行
  getHeadImg()
  getPostsImg()
})

// 这里获取的主要是顶部的几张预览图
function getHeadImg() {
  let el = document.getElementById('J_DetailMeta')
  let matchResult = el.innerHTML.match(/\/\/img\.alicdn\.com.*?(jpg|SS2)/g)
  /*
不带转义符的正则：
//img.alicdn.com.*?jpg
*/
  if (matchResult.length > 0) {
    matchResult.forEach(imgURL => {
      result.add('https:' + imgURL)
    })
  }
}

// 获取详细介绍里的图片
function getPostsImg() {
  let postsImg = document.querySelectorAll('.content.ke-post img')
  postsImg.forEach(img => {
    result.add(img.src)
  })

  // 输出结果
  for (const iterator of result.values()) {
    document.writeln(iterator + '<br>')
  }
}
