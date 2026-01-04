// ==UserScript==
// @name         sourcemap-searcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  网站sourcemap文件泄露检测器
// @author       wuuconix
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuuconix.link
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447335/sourcemap-searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/447335/sourcemap-searcher.meta.js
// ==/UserScript==

var judge = (url, protocol, origin, href) => {
    if (url.startsWith("//")) { //省略协议的写法
        url = `${protocol}${url}`
    } else if (url.startsWith("/")) { //文件位于网站根目录
        url = `${origin}${url}`
    } else if (url.startsWith("./")) { //使用相对路径
        url = href.slice(0, href.lastIndexOf("/")) + url.slice(1)
    } else if (!url.startsWith("http")) { //相对路径的js文件加上origin 构造完整url
        url = href.slice(0, href.lastIndexOf("/")) + "/" + url
    }
    if (url.includes("?")) { //针对那些后面有query的文件 比如index.js?max_age=31536000
        url = url.slice(0, url.indexOf("?"))
    }
    if ((url.endsWith(".js") && !url.endsWith(".min.js")) || (url.endsWith(".css") && !url.endsWith(".min.css"))) { //加上.map构造出sourcemap文件路径
        url = `${url}.map`
        console.log(url)
        fetch(url).then(res => {
            if (res.status == 200) {
                console.log(`------bingo------\n${url} 疑似存在sourcemap文件泄露\n`)
            }
        }).catch(e => {
            console.log(`fetch ${url} 失败: ${e}`)
        })
    }
}

var sms = () => {
    const scripts = document.querySelectorAll("script")
    const links = document.querySelectorAll("link")
    const { protocol, origin, href } = window.location //包含协议和域名
    for (let { src } of scripts) {
        judge(src, protocol, origin, href)
    }
    for (let { href: src } of links) {
        judge(src, protocol, origin, href)
    }
}

window.sms = sms