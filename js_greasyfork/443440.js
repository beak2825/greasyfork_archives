// ==UserScript==
// @name         油管开播信息一键复制
// @namespace    67373tools
// @description  点击日期（视频框左下方那个，不是标题下面的那个）就可以复制油管开播信息，免得每次都要手动编辑。
// @version      0.0.2
// @author       旅行
// @match        *://*.youtube.com/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443440/%E6%B2%B9%E7%AE%A1%E5%BC%80%E6%92%AD%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/443440/%E6%B2%B9%E7%AE%A1%E5%BC%80%E6%92%AD%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';
   const days = {
     "0": "周日", "1": "周一", "2": "周二", "3": "周三",
     "4": "周四", "5": "周五", "6": "周六"
   }
   var postText

   setTimeout(()=>{
     var liveDate = document.querySelector('.style-scope.ytd-video-primary-info-renderer').innerText
     liveDate = liveDate.substring(liveDate.search("发布时间：")+5,100).split("\n")[0]
     var liveDay = liveDate.replace("年","-").replace("月","-").replace("日","")
     var liveTime = document.querySelector('.ytp-offline-slate-subtitle-text').innerText
     liveDay = new Date(liveDay)
     // console.log(liveDate, liveDay, liveTime)
     liveDay = days[liveDay.getDay()]
     postText = "🔴【开播通知】\n[" + liveDay + " " + liveDate.substring(0, 5) + liveTime + "]"
     var titleText = document.querySelector('.style-scope.ytd-video-primary-info-renderer').innerText
     titleText = titleText.substring(0, titleText.search("\n"))
     postText += "\n\n" + titleText + "\n"
     postText += document.URL.replace("https://www.youtube.com", "") + "\n\n"
     postText += "进去记得先点👍~"
     // document.querySelector('.ytp-offline-slate-subtitle-text').onclick = ()=> GM_setClipboard(postText)
     GM_registerMenuCommand("复制开播信息", () => {GM_setClipboard(postText)})
     console.log(postText)
   },5000)
})();

