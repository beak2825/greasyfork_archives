// ==UserScript==
// @name         TinyPNG_JPG
// @name:zh-CN   熊猫压缩下载
// @namespace    https://github.com/lvjiaxuan/tinyimg-userscript
// @version      0.0.1
// @description  Download image compressed by https://tinypng.com
// @description:zh-cn 下载熊猫压缩后的图片
// @author       lvjiaxuan <471501748@qq.com> (https://github.com/lvjiaxuan)
// @match        *://*/*.png
// @match        *://*/*.jpg
// @connect      tinypng.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456612/TinyPNG_JPG.user.js
// @updateURL https://update.greasyfork.org/scripts/456612/TinyPNG_JPG.meta.js
// ==/UserScript==


const TINY_WEB_API = 'https://tinypng.com/web/shrink' // https://tinyjpg.com/web/shrink

const target = document.querySelector('img')
const src = target.src
let imgMime = 'jpeg'


GM_registerMenuCommand('tiny download.', async () => {

  if (!src || !target) {
    window.alert('Can\'t read src. Please refresh and try again.')
    return
  }

  const blobData = await canvasToBlob(imageToCanvas(target))
  const { url, ratio, outputSize, inputSize } = await new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://tinypng.com/web/shrink',
      data: blobData,
      headers: {
        // accept: '*/*',
        // 'accept-encoding': 'gzip, deflate, br',
        // 'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,de;q=0.7',
        // 'cache-control': 'no-cache',
        // origin: 'https://tinypng.com',
        // pragma: 'no-cache',
        // referer: 'https://tinypng.com/',
      },
      onerror: reject,
      onload(res) {
        const { input: { size: inputSize }, output: { size: outputSize, url, ratio } } = JSON.parse(res.response)
        resolve({
          url,
          ratio,
          outputSize,
          inputSize,
        })
      },
    })
  })

  console.log({ url, ratio, outputSize, inputSize })

  GM_download({
    url,
    name: Date.now() + `.${ imgMime }`,
    saveAs: true,
  })
})

// utils ===============================================================================

function imageToCanvas(image) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

async function canvasToBlob(canvas, quality = 1) {
  // jpeg 62717
  // png  94580
  // webp 11304
  return new Promise(resolve => canvas.toBlob(resolve, `image/${ imgMime }`, quality))
}

