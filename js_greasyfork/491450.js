// ==UserScript==
// @name         BiliBili High Quality
// @description  BiliBili High Quality X
// @version      0.0.3
// @author       hcwhan
// @namespace    https://greasyfork.org/users/2566
// @match        https://*.bilibili.com/*
// @run-at       document-body
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/491450/BiliBili%20High%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/491450/BiliBili%20High%20Quality.meta.js
// ==/UserScript==


// 禁用 WebRTC
try {
  Object.defineProperty(unsafeWindow, 'webkitRTCPeerConnection', { value: undefined, enumerable: false, writable: false });
} catch (e) { }


// 去 P2P CDN
Object.defineProperty(unsafeWindow, 'PCDNLoader', { value: class { }, enumerable: false, writable: false });
Object.defineProperty(unsafeWindow, 'BPP2PSDK', { value: class { on() { } }, enumerable: false, writable: false });
Object.defineProperty(unsafeWindow, 'SeederSDK', { value: class { }, enumerable: false, writable: false });


// 设置高质量视频链接
const setHighQualityUrl = () => {
  if (!unsafeWindow.__playinfo__?.data.dash) { return }
  console.info('!!!!!!!!!! __playinfo__ - dash before', JSON.parse(JSON.stringify(unsafeWindow.__playinfo__.data.dash)))

  const setUposUrl = (info) => {
    const allUrls = [info.baseUrl, ...info.backupUrl].filter(Boolean)
    const uposUrl = allUrls.map((url) => new URL(url)).find((urlx) => /^upos-sz-\w+\.bilivideo\.com$/.test(urlx.hostname))?.toString()
    if (!uposUrl) {
      console.log('!!!!!!!!!! uposUrl not found, allUrls:', allUrls)
    }

    info.baseUrl = uposUrl
    info.base_url = uposUrl
    info.backupUrl = [uposUrl]
    info.backup_url = [uposUrl]
  }

  unsafeWindow.__playinfo__.data.dash.video.forEach((item) => setUposUrl(item))
  unsafeWindow.__playinfo__.data.dash.audio.forEach((item) => setUposUrl(item))

  console.info('!!!!!!!!!! __playinfo__ - dash after', JSON.parse(JSON.stringify(unsafeWindow.__playinfo__.data.dash)))
}
setHighQualityUrl()
