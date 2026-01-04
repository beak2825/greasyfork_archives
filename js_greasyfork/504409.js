// ==UserScript==
// @name        百度网盘回到旧版
// @namespace   https://github.com/jqtmviyu/UserScripts
// @match       https://pan.baidu.com/disk/main*
// @version     0.3
// @author      jqtmviyu
// @description 检测到ai助手,自动跳转回旧版网页
// @downloadURL https://update.greasyfork.org/scripts/504409/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/504409/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==
function redirectToHomeWithPath() {
  // 旧版网页的回收站/分享用不了,排除掉
  if (/^#\/(recyclebin|share)/.test(window.location.hash)) {
      return; // 如果匹配任一前缀，则退出脚本
  }
  // 获取当前页面的 URL
  const currentUrl = window.location.href
  // 使用 URL 构造函数解析当前 URL
  const url = new URL(currentUrl)
  // 获取 path 参数
  const pathParam = url.searchParams.get('path')
  // 构建新的 URL
  const newUrl = `https://pan.baidu.com/disk/home?from=newversion&stayAtHome=true#/all?path=${encodeURIComponent(
    pathParam
  )}&vmode=list`
  // 重定向到新的 URL
  window.location.href = newUrl
}

// 调用
redirectToHomeWithPath()
