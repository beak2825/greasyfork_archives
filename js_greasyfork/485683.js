// ==UserScript==
// @name         滚动条美化-仿macos
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.0.1
// @description  使得windows中浏览器的滚动条更加美观
// @author       XboxYan、冰冻大西瓜
// @match        *://*/*
// @license      AGPL-3.0-or-later
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485683/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96-%E4%BB%BFmacos.user.js
// @updateURL https://update.greasyfork.org/scripts/485683/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96-%E4%BB%BFmacos.meta.js
// ==/UserScript==

/* global GM_addStyle */
GM_addStyle(`
body{
  margin: 0;
  scrollbar-gutter: auto;
  background-color: transparent;
    
}
::-webkit-scrollbar{
  background-color: transparent;
  width: 12px;

}
::-webkit-scrollbar-thumb{
  background-color: transparent;
  border-radius: 8px;
  background-clip: content-box;
  border: 2px solid transparent;

}
body[scroll]::-webkit-scrollbar-thumb,
::-webkit-scrollbar-thumb:hover{
  background-color: rgba(0,0,0,.5);
}`)

window.addEventListener('scroll', ev => {
  document.body.toggleAttribute('scroll', true)
  window.timer && clearTimeout(window.timer)
  window.timer = setTimeout(() => {
    document.body.toggleAttribute('scroll')
  }, 800)
})
