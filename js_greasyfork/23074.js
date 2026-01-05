// ==UserScript==
// @name         显示半次元（bcy.net）图片的大图url（下载辅助）
// @namespace    http://www.saber.xn--6qq986b3xl/?p=3013
// @version      0.9
// @description  显示半次元图片的大图url，可以复制下来使用下载软件批量下载
// @author       雪见仙尊
// @match        https://bcy.net/*/detail/*
// @match        https://www.bcy.net/*/detail/*
// @grant       unsafeWindow
// @run-at		  document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/23336/%E6%98%BE%E7%A4%BA%E5%8D%8A%E6%AC%A1%E5%85%83%EF%BC%88bcynet%EF%BC%89%E5%9B%BE%E7%89%87%E7%9A%84%E5%A4%A7%E5%9B%BEurl%EF%BC%88%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/23336/%E6%98%BE%E7%A4%BA%E5%8D%8A%E6%AC%A1%E5%85%83%EF%BC%88bcynet%EF%BC%89%E5%9B%BE%E7%89%87%E7%9A%84%E5%A4%A7%E5%9B%BEurl%EF%BC%88%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9%EF%BC%89.meta.js
// ==/UserScript==

/*
 *@作者：雪见仙尊
 *@博客：https://saber.love
 *@转载重用请保留此信息
 *@QQ群：562729095
 */

document.body.insertAdjacentHTML(
  'beforeend',
  `<div id="shouUrl" style="position: fixed; right: 0px; top: 100px; padding: 15px 20px; background: rgb(46, 178, 234); color: rgb(255, 255, 255); border-radius: 5px; text-align: center; line-height: 24px; font-size: 16px; cursor: pointer;">显示大图url</div>`
)
document.querySelector('#shouUrl').addEventListener('click', () => {
  const data = unsafeWindow.__ssr_data
  let result = ''
  if (data) {
    let urlsArray = data.detail.post_data.multi
    // 多张图片输出网址
    if (urlsArray.length > 1) {
      for (const item of urlsArray) {
        result += item.original_path + '<br>'
      }
      let newW = window.open()
      newW.document.write(result)
    } else if (urlsArray.length === 1) {
      // 单张图片直接打开
      window.open(urlsArray[0].original_path)
    }
  } else {
    alert('无法获取，请联系作者。')
  }
})