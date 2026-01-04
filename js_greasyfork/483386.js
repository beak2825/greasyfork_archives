
// ==UserScript==
// @name         PHDownloader
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Pornhub 视频一键下载 | pornhub.com
// @author       Hmhm
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.pornhubpremium.com/view_video.php?viewkey=*
// @icon         https://ci.phncdn.com/www-static/favicon.ico
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483386/PHDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/483386/PHDownloader.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  const videoWrap = document.querySelector(".video-wrapper")
  const signDom = document.querySelector(".video-wrapper .title-container")
  let remoteAddress
  for (let key in unsafeWindow) {
    if (key.startsWith('flashvars_')) {
      console.log(unsafeWindow[key])
      let flashvars = unsafeWindow[key]
      let mediaDefinitions = flashvars.mediaDefinitions
      mediaDefinitions.some(item => {
        if (item.remote) {
          remoteAddress = item.videoUrl  
        }
      })
    }
  }
  const list = await $.ajax(remoteAddress).then(data => {
    return data
  })
  const dom = document.createElement("div");
  let str = '<div>download list</div><ul class="download_list">';
  list.forEach(item => {
    const { videoUrl, quality } = item
    console.log(item)
    str += `<li><a href="${videoUrl}" target="_blank">${quality}P</a></li>`
  })
  str += '</ul>';
  dom.innerHTML = str
  const fragment = document.createDocumentFragment();
  fragment.appendChild(dom)
  videoWrap.insertBefore(fragment, signDom)
})();

