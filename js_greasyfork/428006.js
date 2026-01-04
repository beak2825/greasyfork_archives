// ==UserScript==
// @name         モザイク壁画
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This script's icon is SCP
// @author       You
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=hertzen.com
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://code.jquery.com/jquery-3.6.0.js
// @downloadURL https://update.greasyfork.org/scripts/428006/%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AF%E5%A3%81%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/428006/%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AF%E5%A3%81%E7%94%BB.meta.js
// ==/UserScript==

(async () => {
    'use strict'
    await import('https://html2canvas.hertzen.com/dist/html2canvas.min.js')
    const sideLen = 300,
          sideHalf = sideLen / 2
    const cv = $('<canvas>').appendTo('body').prop({
        width : sideLen,
        height : sideLen
    }).css({
        position : 'fixed',
        zIndex : 114514,
        cursor : 'move',
        borderRadius : '50%'
    }).on('mousedown',()=>{
        flag = true
    })
    let flag
    $(window).on('mouseup',()=>{
        flag = false
    }).on('mousemove',e=>{
        if(flag) jump(e.clientX - sideHalf, e.clientY - sideHalf)
    })
    let cx, cy
    const jump = (x,y) => {
        GM.setValue('save', [x, y].join('#'));
        [cx, cy] = [x, y]
        cv.css({
            left: x,
            top: y
        })
    }
    jump(...await GM.getValue('save', '100#100').then(v=>v.split('#').map(v=>Number(v))))
    const ctx = cv.get(0).getContext('2d')
    ctx.beginPath()
    ctx.arc(sideHalf, sideHalf, sideHalf, 0, 2 * Math.PI)
    ctx.clip()
    let cv2
    const main = () => {
        ctx.beginPath()
        ctx.drawImage(cv2, cx + $(window).scrollLeft() + 8, cy + $(window).scrollTop(), sideLen, sideLen, 0, 0, sideLen, sideLen)
        requestAnimationFrame(main)
    }
    $(async () => {
        cv2 = toMosaic(await html2canvas($('body').get(0)))
        main()
    })
    const toMosaic = cv => {
        const {width, height} = cv,
              ctx = cv.getContext('2d'),
              {data} = ctx.getImageData(0, 0, width, height),
              unit = 10
        for(let y = 0; y < height; y += unit){
            for(let x = 0; x < width; x += unit){
                const n = (x + y * width) * 4,
                      r = data[n],
                      g = data[n + 1],
                      b = data[n + 2]
                ctx.fillStyle = `rgb(${r},${g},${b})`
                ctx.fillRect(x, y, unit, unit)
            }
        }
        return cv
    };
})()