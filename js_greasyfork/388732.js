// ==UserScript==
// @name         微信文章查看优化
// @namespace    https://1silencer.github.io/
// @version      1.2
// @author       Silencer
// @description  微信公众号文章的边距取消
// @match        *://mp.weixin.qq.com/s*
// @icon         https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @downloadURL https://update.greasyfork.org/scripts/388732/%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E6%9F%A5%E7%9C%8B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/388732/%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E6%9F%A5%E7%9C%8B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

function setElStyle(EL, SKey, SVal) {
  eval(`document.querySelector('${EL}').style.${SKey}='${SVal}'`)

}

setElStyle('.rich_media_area_primary_inner', 'maxWidth', 'none')
document.querySelectorAll('img').forEach((img) => {
  img.style.marginLeft = '0'
})