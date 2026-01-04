// ==UserScript==
// @name         深大内部网原神主题
// @namespace    https://github.com/AnotiaWang
// @version      0.2.2
// @description  将深大的统一身份认证页改造成原神主题
// @author       AnotiaWang
// @match        https://authserver.szu.edu.cn/authserver/login*
// @match        http://ehall.szu.edu.cn/new/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474125/%E6%B7%B1%E5%A4%A7%E5%86%85%E9%83%A8%E7%BD%91%E5%8E%9F%E7%A5%9E%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/474125/%E6%B7%B1%E5%A4%A7%E5%86%85%E9%83%A8%E7%BD%91%E5%8E%9F%E7%A5%9E%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(() => {
    const posterUrl = 'https://ys.mihoyo.com/main/_nuxt/img/poster.47f71d4.jpg'
    const logoUrl = 'https://ys.mihoyo.com/main/_nuxt/img/logo-header-cut.f78aabc.png'
    const videoUrl = 'https://ys.mihoyo.com/main/_nuxt/videos/bg.3e78e80.mp4'
    const image12Plus = 'data:image/png;base64,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'

    const { href } = window.location

    // 统一身份认证页
    if (href.startsWith('https://authserver.szu.edu.cn')) {
        const bgElement = document.querySelector('body > div.auth_bg')
        // 暂时只适配桌面版布局
        if (!bgElement) return
        bgElement.style = 'inset: 0; width: 100%; height: 100%'
        bgElement.removeChild(document.querySelector('body > div.auth_bg > img'))

        const navbarElement = document.createElement('div')

        const videoElement = document.createElement('video')
        Object.assign(videoElement, {
            poster: posterUrl,
            style: 'object-fit: cover; width: 100%; height: 100%;',
            loop: 'loop',
            muted: 'muted',
            autoplay: true,
            disablePictureInPicture: true,
            controlsList: 'nodownload',
        })

        const srcElement = document.createElement('source')
        srcElement.src = videoUrl
        srcElement.type = 'audio/mp4'
        videoElement.appendChild(srcElement)
        bgElement.appendChild(videoElement)

        // 隐藏页脚 Copyright
        document.querySelector('body > div.auth_page_wrapper > div.auth_login_footer').style.display = 'none'

        // 修改 logo
        const logoElement = document.querySelector('body > div.auth_page_wrapper > div.auth_logo > img')
        logoElement.src = logoUrl
        logoElement.addEventListener("dragstart", e => e.preventDefault())

        // 优化登录框样式
        const loginFormElement = document.querySelector('body > div.auth_page_wrapper > div.auth_login_content > div.auth_login_right > div > div.auth_tab_content')
        loginFormElement.style.borderRadius = '0 0 10px 10px'
        loginFormElement.style.opacity = 0.8

        const loginFormTitleElement = document.querySelector('#accountLogin')
        loginFormTitleElement.style.borderRadius = '10px 10px 0 0'
        loginFormTitleElement.style.opacity = 0.8
        loginFormTitleElement.style.paddingTop = '14px'

        const sheet = new CSSStyleSheet()
        sheet.replaceSync('input { border-radius: 0 6px 6px 0 };')
        document.adoptedStyleSheets = [sheet]

        for (const elem of document.getElementsByClassName('auth_icon')) {
            elem.style.borderRadius = '6px 0 0 6px'
        }

        document.querySelector('#casLoginForm > p:nth-child(4) > div').style.borderRadius = '4px'
        document.querySelector('#accountLogin > span').style.fontSize = '16px'

        document.querySelector('body > div.auth_page_wrapper > div.auth_login_content').style.marginTop = '180px'

        // 隐藏选择语言框的文本
        const langSelectElement = document.querySelector('body > div.auth-language')
        langSelectElement.removeChild(langSelectElement.firstChild)
        langSelectElement.firstChild.childNodes[1].style = 'border-radius: 4px; padding: 3px; opacity: 0.5; color: chocolate;'

        // 12+
        const twelvePlusElement = document.createElement('img')
        twelvePlusElement.src = image12Plus
        twelvePlusElement.style = 'position: fixed; left: 30px; bottom: 30px; width: 100px; height: 130px; cursor: pointer;'
        twelvePlusElement.onclick = () => alert('诶嘿')
        twelvePlusElement.addEventListener("dragstart", e => e.preventDefault())
        document.body.appendChild(twelvePlusElement)
    }
    else if (href.startsWith('http://ehall.szu.edu.cn/new/index.html')) {
        // 咕咕咕
    }
})();