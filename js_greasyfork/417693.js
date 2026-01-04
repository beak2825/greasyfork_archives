// ==UserScript==
// @name        SCNU SSO auto captcha filler
// @name:zh-CN  SCNU SSO 验证码自动填充
// @namespace   https://github.com/fengkx/
// @match       https://sso.scnu.edu.cn/AccountService/openapi/login.html*
// @match       https://sso.scnu.edu.cn/AccountService/user/login.html*
// @match       https://sso.scnu.edu.cn/AccountService/user/index.html*
// @grant       none
// @version     2.0
// @author      fengkx
// @description scnu sso captcha auto filler using tensorflow.js 0.89~0.93 accuracy
// @description:zh-CN 基于 tensorflow.js SCNU SSO 验证码自动填充， 0.89~0.93 准确率
// @supportURL https://github.com/fengkx/scnu-sso-captcha
// @run-at document-end
// @require https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.7.0/dist/tf.min.js
// @require https://cdn.jsdelivr.net/npm/opencv.js@1.2.1/opencv.min.js
// @downloadURL https://update.greasyfork.org/scripts/417693/SCNU%20SSO%20auto%20captcha%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/417693/SCNU%20SSO%20auto%20captcha%20filler.meta.js
// ==/UserScript==

const WIDTH = 100
const IDICT = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const HEIGHT = 50

const $input = document.getElementById('rancode')
const img =
  document.getElementById('codeimg') || document.getElementById('code')

const $canvas = document.createElement('canvas')
$canvas.addEventListener('click', window.reloadcode)
$canvas.width = WIDTH
$canvas.height = HEIGHT
const isUseLite = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/.test(navigator.userAgent)
const modelDir = isUseLite ? 'js-model-lite' : 'js-model'
const modelVersion = 'v2'
const modelKey = `${modelVersion}/${modelDir}`
const MODEL_URL = `https://cdn.jsdelivr.net/gh/fengkx/scnu-sso-captcha@master/web-model/${modelKey}/model.json`;
console.debug(MODEL_URL)
console.log(
    `${'\n'} %c SCNU SSO auto captcha filler v2.0 %c https://github.com/fengkx/scnu-sso-captcha ${'\n'}${'\n'}`,
    'color: #000; background: #fffcc8; padding:5px 0;',
    'background: #fadfa3; padding:5px 0;'
  )
let model = null;
async function main() {
  const $img = img.cloneNode()
  $img.width = WIDTH
  $img.height = HEIGHT

  const ctx = $canvas.getContext('2d')
  $canvas.classList.add('input-addon')
  $canvas.style.right = '100px'
  $input.parentElement.appendChild($canvas)
  ctx.drawImage($img, 0, 0)
  const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
  const mat = cv.matFromImageData(imageData)
  let dst = new cv.Mat()
  let src = mat
  cv.cvtColor(src, src, cv.COLOR_BGR2GRAY, 0)
  cv.adaptiveThreshold(
    src,
    src,
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY_INV,
    15,
    15
  )
  cv.medianBlur(src, dst, 3)
  cv.imshow($canvas, dst)
  x = tf.browser.fromPixels($canvas)
  x = x.div(255)
  x = x.max(2).expandDims(2)
  console.debug(x.shape)
  x = await x.array()
  
  const old = Date.now()
  if(!model) {
    try {
      model = await tf.loadGraphModel('indexeddb://' + modelKey)
    } catch (e) {
      model = await tf.loadGraphModel(MODEL_URL)
      const saveResults = await model.save('indexeddb://' + modelKey)
    }
  }
  let p = model.predict(tf.tensor([x]))
  const used = (Date.now() - old) / 1000
  console.debug(used)
  p = await p.array()
  p = tf.tensor(p[0])
  p = p.argMax(1)
  p = await p.array()
  p = p.map((idx) => IDICT[idx]).join('')
  console.log(p)
  $input.value = p
}
document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState === 'complete') {
    main()
  }
});

img.addEventListener('load', main)
