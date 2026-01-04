// ==UserScript==
// @name         giveaway.su 验证码自动识别
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动识别验证码
// @author       Stackia maxinimize

// @match        https://giveaway.su/giveaway/view/*
// @supportURL   https://steamcn.com/t474510-1-1
// @downloadURL https://update.greasyfork.org/scripts/438083/giveawaysu%20%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/438083/giveawaysu%20%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function () {

    function greyscale(imageData) {
        const threshold = 220
        for (let x = 0; x < imageData.width; x++) {
            for (let y = 0; y < imageData.height; y++) {
                let idx = (x + y * imageData.width) * 4
                let r = imageData.data[idx]
                let g = imageData.data[idx + 1]
                let b = imageData.data[idx + 2]

                let grey = 0.299 * r + 0.587 * g + 0.114 * b
                grey = grey < threshold ? 0 : 255
                imageData.data[idx] = grey
                imageData.data[idx + 1] = grey
                imageData.data[idx + 2] = grey
                imageData.data[idx + 3] = 255
            }
        }
    }

    function execute() {
        let input = $('input.form-control')
        let detectCaptchaBtn = $('<button type="button" class="btn btn-sm btn-success">尝试识别</button>')
        detectCaptchaBtn.css({
            'margin-top': '20px'
        })
        $('#form-captcha').append(detectCaptchaBtn)
        detectCaptchaBtn.click(() => {
            detectCaptchaBtn.html('<i class="fa fa-cog fa-spin"></i> 识别中')
            window.setTimeout(() => {
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                let captchaImg = $('img[data-captcha]')[0]
                canvas.width = captchaImg.width
                canvas.height = captchaImg.height
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(captchaImg, 0, 0)
                let imageData = ctx.getImageData(1, 1, canvas.width - 2, canvas.height - 2) // 去黑边
                greyscale(imageData) // 灰度化 二值化

                /*
                let canvas2 = document.createElement('canvas')
                let ctx2 = canvas.getContext('2d')
                ctx2.putImageData(imageData, 0, 0);
                var bw = document.createElement("img");
                bw.src = canvas2.toDataURL();
                $('#form-captcha').append(bw);
                */

                Tesseract.recognize(imageData, {
                    lang: 'eng',
                    tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                })
                    .then(data => {
                    input.focus()
                    input.keydown()
                    input.val(data.text.replace(/\s/ig,''))
                    input.keyup()
                    detectCaptchaBtn.text(data.confidence+'%准确率')
                    detectCaptchaBtn.attr("disabled","true")
                    //console.log(data)
                })
            }, 300)
        })

        if($('button.btn-success:contains("尝试识别")')) {
            $('button.btn-success:contains("尝试识别")')[0].click();
        }
    }

    let intervalHandler = window.setInterval(() => {
        if ($('#form-captcha')[0]) {
            window.clearInterval(intervalHandler)
            execute()
        }
    }, 500)
    })()