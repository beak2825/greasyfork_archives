// ==UserScript==
// @name 自动关闭标签页
// @namespace https://greasyfork.org/zh-CN/users/459661-cycychenyi
// @version 0.1
// @description 有些应用（比如腾讯会议）通过分享链接启动，该脚本在打开链接 10 s 后自动关闭标签页。
// @author cycychenyi
// @match https://www.google.com/
// @downloadURL https://update.greasyfork.org/scripts/459043/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/459043/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==
 
setTimeout(window.close, 10000);
