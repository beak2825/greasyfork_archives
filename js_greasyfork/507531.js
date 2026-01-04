// ==UserScript==
// @name         音乐磁场自动回复隐藏帖
// @namespace    https://greasyfork.org/zh-CN/scripts/507531
// @version      1.2.1
// @description  自动回复音乐磁场论坛上的隐藏帖
// @author       zhenhappy<q505507538@gmail.com>
// @match        https://*.hifiti.com/thread-*.htm
// @match        https://*.hifiki.com/thread-*.htm
// @icon         https://www.hifini.com/favicon.ico
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507531/%E9%9F%B3%E4%B9%90%E7%A3%81%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E9%9A%90%E8%97%8F%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/507531/%E9%9F%B3%E4%B9%90%E7%A3%81%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E9%9A%90%E8%97%8F%E5%B8%96.meta.js
// ==/UserScript==

$(document).ready(function () {
    reply()
    optimizeLink()
})

function waitForElm(selector) {
    let time1, time2
    return new Promise(resolve => {
        if ($(selector).length > 0) return resolve($(selector))
        time1 = setTimeout(() => {
            resolve(null)
            clearTimeout(time1)
            clearInterval(time2)
        }, 3000)
        time2 = setInterval(() => {
            console.log(selector, $(selector).length)
            if ($(selector).length > 0) {
                resolve($(selector))
                clearTimeout(time1)
                clearInterval(time2)
            }
        }, 20)
    })
}

async function reply() {
    const warning = await waitForElm('.alert-warning')
    if (warning) {
        const message = await waitForElm('#message')
        if (message) {
            message.val('谢谢分享')
            setTimeout(() => {
                $('#submit').trigger('click')
            }, 500)
        }
    }
}

async function optimizeLink() {
    let pwd = ''
    const success = await waitForElm('.alert-success')
    if (success) {
        pwd = success.first().text().trim()
    }

    let href = ''
    let newHref = ''
    if (pwd) {
        href = $('p > a').first().attr('href')
        if (href && href.includes('pan.baidu.com')) {
            newHref = href.includes('?') ? `${href}&pwd=${pwd}` : `${href}?pwd=${pwd}`
        }
    }

    const downloadH5 = $('h5').filter(function () {
        return $(this).text().trim() === '下载'
    }).first()
    if (downloadH5.length) {
        downloadH5.next().remove()
        downloadH5.remove()
    }

    const passwordH5 = $('h5').filter(function () {
        return $(this).text().trim() === '提取码'
    }).first()
    if (passwordH5.length) {
        passwordH5.text('百度网盘')
        const newContent = `链接: <a href="${newHref}" target="_blank">${newHref}</a> 提取码: ${pwd}`
        passwordH5.next().next().html(newContent)
    }
}