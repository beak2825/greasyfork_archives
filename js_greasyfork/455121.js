
// ==UserScript==
// @name        图片放大器
// @namespace   https://greasyfork.org/zh-CN/users/289884
// @description 图片看不清? 双击放大,单击返回
// @include     http*
// @version     0.1
// @author      ay
// @grant       none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455121/%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455121/%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%99%A8.meta.js
// ==/UserScript==


(function () {
  function createImg() {
    let c = document.createElement('img')
    c.onclick = () => { c.style.display = 'none' }
    return c
  }
  const IMG = createImg();
  document.body.appendChild(IMG)
  setTimeout(() => {
    const img =
      document.querySelectorAll('img') || []
    console.log(img);
    Array.from(img).map(e => {
      e.ondblclick = (e) => {
        IMG.src = e.srcElement.currentSrc
        IMG.style.width = '90vh'
        IMG.style.display = 'block'
        IMG.style.position = 'absolute'
        IMG.style.top = '50%'
        IMG.style.left = '50%'
        IMG.style.top = '50%'
        IMG.style.zIndex = '99999'
        IMG.style.transform = 'translate(-50%, -50%)'
      }
    })
  }, 1000);
})()
