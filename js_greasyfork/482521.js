// ==UserScript==
// @name         巴哈編輯器與留言區圖片網址格式化
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=qwert535286
// @version      0.0.6
// @description  貼上 Twitter 圖片連結時，改成巴哈能認出來的格式
// @author       笑翠鳥
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @match        https://forum.gamer.com.tw/post1.php?*
// @match        https://home.gamer.com.tw/artwork_new.php?*
// @match        https://home.gamer.com.tw/artwork_edit.php?*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482521/%E5%B7%B4%E5%93%88%E7%B7%A8%E8%BC%AF%E5%99%A8%E8%88%87%E7%95%99%E8%A8%80%E5%8D%80%E5%9C%96%E7%89%87%E7%B6%B2%E5%9D%80%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482521/%E5%B7%B4%E5%93%88%E7%B7%A8%E8%BC%AF%E5%99%A8%E8%88%87%E7%95%99%E8%A8%80%E5%8D%80%E5%9C%96%E7%89%87%E7%B6%B2%E5%9D%80%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(() => {
    function fmtImgUrl(url) {
        switch(true) {
            case /pbs\.twimg\.com\/media\/[a-zA-Z0-9\-\_]+\?format=(jpg|jpeg|png|webp)/.test(url):
                return url.split('&')[0].replace('?format=', '.').replace('webp', 'jpg')
        }
    }

    window.addEventListener('load', () => {
        const $iframeEditor = document.getElementById('editor').contentWindow.document.body

        $iframeEditor.addEventListener('paste', e => {
            const clipboardTxt = e.clipboardData.getData('text')
            const fmtUrl = fmtImgUrl(clipboardTxt)

            if (fmtUrl) {
                const $img = document.createElement('img')
                $img.src = fmtUrl
                $iframeEditor.querySelector(`[href="${clipboardTxt}"]`).replaceWith($img)
            }
        })

        document.querySelectorAll('textarea').forEach($area => {
            $area.addEventListener('paste', e => {
                const fmtUrl = fmtImgUrl(e.clipboardData.getData('text'))

                if (fmtUrl) {
                    e.preventDefault()
                    e.target.value = `${e.target.value.trim()} ${fmtUrl}`.trim()
                }
            })
        })
    })
})()
