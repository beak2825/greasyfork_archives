// ==UserScript==
// @name         SJTU jAccount验证码自动识别
// @namespace    shatyuka
// @version      1.0
// @description  自动识别SJTU jAccount验证码
// @author       Shatyuka
// @require      https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js
// @match        https://jaccount.sjtu.edu.cn/jaccount/jalogin*
// @downloadURL https://update.greasyfork.org/scripts/432482/SJTU%20jAccount%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/432482/SJTU%20jAccount%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

function execute() {
    let input = document.getElementById('captcha')
    let captchaImg = document.getElementById('captcha-img')
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = captchaImg.width
    canvas.height = captchaImg.height
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(captchaImg, 0, 0)

    Tesseract.recognize(canvas, 'eng', {
        tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyz0123456789'
    }).then(data => {
        input.value = data.data.text.replace(/\s/ig,'')
    })
}

let intervalHandler = window.setInterval(() => {
    if (document.getElementById('captcha-img')) {
        window.clearInterval(intervalHandler)
        execute()
    }
}, 500)