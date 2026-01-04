// ==UserScript==
// @name        链接地址全在【当前/新建】标签页中打开
// @namespace   Open in self/new tab.
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.3
// @author      稻米鼠
// @description 2020-06-07 19:17:09
// @downloadURL https://update.greasyfork.org/scripts/404870/%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%85%A8%E5%9C%A8%E3%80%90%E5%BD%93%E5%89%8D%E6%96%B0%E5%BB%BA%E3%80%91%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/404870/%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%85%A8%E5%9C%A8%E3%80%90%E5%BD%93%E5%89%8D%E6%96%B0%E5%BB%BA%E3%80%91%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

/** 获取是否显示页面工具栏 **/
let isShowPageBar = GM_getValue('inNewPage', true);
console.log(isShowPageBar)
const menuNames = ['【当前】在当前标签打开链接', '【当前】在新标签打开链接']

const main = ()=>{
  document.querySelectorAll('a').forEach(el=>{
    if(isShowPageBar){
      if(/^_blank$/i.test(el.target)) return
      el.target = '_blank'
    }else{
      if(/^(_self)?$/i.test(el.target)) return
      el.target = '_self'
    }
    console.log(el.innerText)
  })
}

const init = (caption, captionRemove)=>{
  GM_unregisterMenuCommand(captionRemove)
  GM_registerMenuCommand(caption, ()=>{
    isShowPageBar = !isShowPageBar
    GM_setValue('inNewPage', isShowPageBar)
    main()
    alert('当前页面立刻生效，其他页面刷新后生效。')
  })
}
if(isShowPageBar){
  init(menuNames[1], menuNames[0])
}else{
  init(menuNames[0], menuNames[1])
}
main()
document.addEventListener('DOMNodeInserted', (e)=>{
  main()
})
window.addEventListener('load', ()=>{
  main()
})