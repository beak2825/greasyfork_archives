// ==UserScript==
// @name         百度网盘替换标题
// @namespace    https://greasyfork.org/zh-CN
// @version      1.1.0
// @description  百度网盘替换标题显示完整标题
// @author       冰冻大西瓜
// @license      AGPL-3.0-only
// @match        https://pan.baidu.com/s/*
// @match        https://pan.baidu.com/share/init?surl=*&pwd=*
// @grant        GM_addStyle
// @note         2024年2月24日 如果链接含提取码,自动跳转
// @downloadURL https://update.greasyfork.org/scripts/488084/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%9B%BF%E6%8D%A2%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/488084/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%9B%BF%E6%8D%A2%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

if (!window.location.href.includes('share/init?surl')) {
  GM_addStyle(`
/* 隐藏无用按钮,为完整标题展示腾出显示空间 */
.slide-show-right a:is([title="保存到手机"],[title="举报"]){
  display: none;
}
/* 取消对标题长度的限制,防止标题内容被隐藏 */
h2.file-name{
  max-width:unset !important;
}
/* 改变按钮位置,为完整标题腾出显示空间 */
.slide-show-center{
  float: right !important;
}
`)

  const showTitle = document.querySelector('.file-name')
  const sourceTitle = document.title.split('_免费')[0]
  // 创建观察实例,监听标题变化
  const observer = new MutationObserver(() => {
    showTitle.innerHTML = sourceTitle
    // 标题替换完成后停止观察 === 会先于 && 执行
    showTitle.innerHTML === sourceTitle && observer.disconnect()
  })

  observer.observe(showTitle, { childList: true })
} else {
  // 如果有提取码,自动跳转
  const accessCode = document.getElementById('accessCode').value

  accessCode && document.getElementById('submitBtn').click()
}
