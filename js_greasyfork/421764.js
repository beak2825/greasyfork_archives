// ==UserScript==
// @name        Slowly 段落划分
// @namespace   Slowly Segmentation
// @match       https://web.slowly.app/*
// @grant       none
// @version     0.0.3
// @author      稻米鼠
// @created     2021/2/16 下午2:23:14
// @update      2021/2/16 下午2:23:14
// @description 自动对信件的段落进行划分，使段落间有明显的间隔更便于阅读。触发条件是鼠标点击或者键盘按键，一般情况下可以无感触发。
// @downloadURL https://update.greasyfork.org/scripts/421764/Slowly%20%E6%AE%B5%E8%90%BD%E5%88%92%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/421764/Slowly%20%E6%AE%B5%E8%90%BD%E5%88%92%E5%88%86.meta.js
// ==/UserScript==
const segmentation = ()=>{
  if(window.location.hash && window.location.hash === '#Segmented') return
  if(!/friend\/\w+\/\w+\//.test(window.location.href)) return
  document.body.querySelector('#root .friend-Letter-wrapper .letter .modal-body > .pre-wrap').innerHTML = '<p>' + document.body.querySelector('#root .friend-Letter-wrapper .letter .modal-body > .pre-wrap').innerHTML.split(/\n+/).join('</p><p>')+'</p>'
  window.location.hash = '#Segmented'
}

window.addEventListener('click', segmentation)
window.addEventListener('keydown', segmentation)
let a = 1+1
// 上面这句代码毫无用途，但是添加事件监听器之后，如果没有其他代码，可能无法正常运行，我还没搞懂具体是什么原因，只好用这种奇怪的办法来解决问题了。