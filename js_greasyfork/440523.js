// ==UserScript==
// @name         💊 jb51-clear
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  脚本之家/jb51清理美化插件
// @author       zhangzhihao
// @license MIT
// @match        https://www.jb51.net/article/*
// @icon         https://www.jb51.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440523/%F0%9F%92%8A%20jb51-clear.user.js
// @updateURL https://update.greasyfork.org/scripts/440523/%F0%9F%92%8A%20jb51-clear.meta.js
// ==/UserScript==
(function(){

    const stylesheet = `
    #content .jb51code {
      width: 100%
    }
    #main .main-left {
      width: 100%
    }
    #wrapper {
      padding: 20px
    }
    `

    const beautify = () => {
        const $head = document.querySelector('head')
        // 加载个样式表好控制
        const $style = document.createElement('style')
        $style.innerText = stylesheet
        $head.appendChild($style)
    }

    const clear = () => {
        // 广告位
        const $topbar = document.querySelector('#topbar')
        const $header = document.querySelector('#header')
        const $footer = document.querySelector('#footer')
        const $nav = document.querySelector('#nav')
        const $submenu = document.querySelector('#submenu')
        const $googleAutoPlaced = document.querySelector('.google-auto-placed')
        const $googleEsf = document.querySelector('#google_esf')
        const $adsbygoogle = document.querySelector('.adsbygoogle')
        const $lbdBot = document.querySelector('.lbd_bot')
        const $ewm = document.querySelector('#ewm')
        const $lbdList = document.querySelectorAll('.lbd')
        const $xgcomm = document.querySelector('.xgcomm')
        const $mainR = document.querySelector('.main-right')
        const $mainL = document.querySelector('.main-left')

        // 主体
        const $container = document.querySelector('#container')
        const $main = $container.querySelector('#main')

        $topbar && $topbar.parentNode?.removeChild($topbar)
        $header && $header.parentNode?.removeChild($header)
        $footer && $footer.parentNode?.removeChild($footer)
        $nav && $nav.parentNode?.removeChild($nav)
        $submenu && $submenu.parentNode?.removeChild($submenu)
        $googleAutoPlaced && $googleAutoPlaced.parentNode?.removeChild($googleAutoPlaced)
        $googleEsf && $googleEsf.parentNode?.removeChild($googleEsf)
        $adsbygoogle && $adsbygoogle.parentNode?.removeChild($adsbygoogle)
        $lbdBot && $lbdBot.parentNode?.removeChild($lbdBot)
        $ewm && $ewm.parentNode?.removeChild($ewm)
        $xgcomm && $xgcomm.parentNode?.removeChild($xgcomm)
        $mainR && $mainR.parentNode?.removeChild($mainR)
        $lbdList && Array.from($lbdList).forEach($1bd => $1bd.parentNode?.removeChild($1bd))

        Array.from($container.children).forEach($child => {
            if ($child !== $main) {
                $child && $child.parentNode?.removeChild($child)
            }
        })
    }

    clear()
    beautify()
})();