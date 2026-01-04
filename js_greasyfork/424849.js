// ==UserScript==
// @name        no Plugins
// @namespace   https://greasyfork.org/users/756764
// @version     2025.4.29
// @author      ivysrono
// @description 微软软件下载

// @match       https://www.microsoft.com/*/software-download/windows*

// @run-at      document-start

// @inject-into auto

// @downloadURL https://update.greasyfork.org/scripts/424849/no%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/424849/no%20Plugins.meta.js
// ==/UserScript==

/**
 * 在微软官网下载 Windows ISO 镜像
 * https://www.microsoft.com/en-us/software-download/windows10
 * https://www.microsoft.com/zh-cn/software-download/windows10ISO
 */
if (location.host === 'www.microsoft.com') {
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Linux',
  });
}

/**
 * Viewhance 扩展支持 DASH HLS MSS
 * 伪装 ua 需要在 document-start 进行。
 */

/**
 * 国务院领导视频报道集仍有部分无法原生播放，难以完美支持，仅保留测试链接。
 * 以下伪装为iPad可以获取m3u8
 * https://politics.cntv.cn/special/gwyvideo/likeqiang/201907/2019072301/index.shtml
 * https://politics.cntv.cn/special/gwyvideo/likeqiang/201911/2019110403/index.shtml
 * 以下伪装为Android手机可以直接观看
 * https://politics.cntv.cn/special/gwyvideo/likeqiang/202012/2020122401/
 * https://politics.cntv.cn/special/gwyvideo/xiaojie/202010/2020101201/
 * https://politics.cntv.cn/special/gwyvideo/2019/202010/2020101706/
 */
