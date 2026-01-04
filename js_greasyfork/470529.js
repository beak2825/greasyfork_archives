// ==UserScript==
// @name         标小智白嫖插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  免登陆下载PNG/SVG图
// @author       ka1D0u
// @match        https://www.logosc.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470529/%E6%A0%87%E5%B0%8F%E6%99%BA%E7%99%BD%E5%AB%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/470529/%E6%A0%87%E5%B0%8F%E6%99%BA%E7%99%BD%E5%AB%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

// @grant
// ==/UserScript==


GM_addStyle(`
    .display-actions .display-action--bp {
        color: #8403fc;
    }
    .display-actions .display-action--bp::before {
        content: "\\E764";
    }
`);


(function () {
    'use strict'

    const downSvgString2Svg = (svgString, filename = 'image.svg') => {
        var svgDownloadLink = document.createElement('a')
        svgDownloadLink.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)
        svgDownloadLink.download = filename
        svgDownloadLink.click()
    }

    const downSvgString2Png = (svgString, width, height, filename = 'image.png') => {
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')

        canvas.width = width
        canvas.height = height

        var image = new Image()
        image.onload = () => {
            context.drawImage(image, 0, 0)
            var pngDownloadLink = document.createElement('a')
            pngDownloadLink.href = canvas.toDataURL('image/png')
            pngDownloadLink.download = filename
            pngDownloadLink.click()
        }
        image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)
    }

    const $_BPTEXT = '白嫖'
    const $_INSERT_PATH = 'a.display-action.display-action--buy'


    const addBPButton = (e) => {
        var bqElement = e.cloneNode(true)

        bqElement.classList.remove('display-action--buy')
        bqElement.classList.add('display-action--bp')
        bqElement.removeAttribute('style')

        var spanElement = bqElement.querySelector('span.display-action-text')
        spanElement.textContent = $_BPTEXT
        // .../.../.../svg
        var parentElement1 = e.parentNode
        var parentElement2 = parentElement1.parentNode
        var parentElement3 = parentElement2.parentNode
        bqElement.addEventListener('click', () => {
            // find svg object
            var svgElement = parentElement3.querySelector('svg')

            if (svgElement != undefined) {
                var svgString = new XMLSerializer().serializeToString(svgElement)
                //
                downSvgString2Svg(svgString)
                //
                downSvgString2Png(
                    svgString,
                    svgElement.clientWidth,
                    svgElement.clientHeight,
                    'image.png'
                )
            }
        })
        e.parentNode.insertBefore(bqElement, e.nextSibling)
        e.parentNode.removeChild(e)
    }

    const loadBPButton = () => {
        var elements = document.querySelectorAll($_INSERT_PATH)

        if (elements != undefined && elements.length > 0) {
            elements.forEach((e) => {
                let buttonTexts = e.parentNode.querySelectorAll('span')


                if (buttonTexts != undefined && buttonTexts.length > 0) {

                    let isExist = false
                    buttonTexts.forEach((bt) => {
                        if (bt.textContent == $_BPTEXT) {
                            isExist = true
                        }
                    })

                    if (!isExist) {
                        addBPButton(e)
                        console.log('[.] add BP button')
                    }
                }
            })
        }
    }

    // loop check and load
    let __bploop__ = setInterval(() => {
        loadBPButton()
    }, 1000 * 2)

    __bploop__
})()
