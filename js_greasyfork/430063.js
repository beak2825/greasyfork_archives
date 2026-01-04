// ==UserScript==
// @name         巴哈編輯器樓層連結轉換
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=qwert535286
// @version      0.5.6
// @description  把編輯器裡的樓層號碼轉換成連結，如果不想限制只抓 # 號開頭，則會抓三位數以上的數字
// @author       笑翠鳥
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @match        https://forum.gamer.com.tw/post1.php?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430063/%E5%B7%B4%E5%93%88%E7%B7%A8%E8%BC%AF%E5%99%A8%E6%A8%93%E5%B1%A4%E9%80%A3%E7%B5%90%E8%BD%89%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/430063/%E5%B7%B4%E5%93%88%E7%B7%A8%E8%BC%AF%E5%99%A8%E6%A8%93%E5%B1%A4%E9%80%A3%E7%B5%90%E8%BD%89%E6%8F%9B.meta.js
// ==/UserScript==

(() => {
    // post1.php 的編輯簽名黨按鈕
    GM_addStyle(`
        [href="https://home.gamer.com.tw/editSignWeb.php"] + .__generate-floor-link {
            margin-left: 8px;
        }
    `)


    function getBsnSna() {
        const generate = link => {
            const url = new URL(link)
            return [url.searchParams.get('bsn'), url.searchParams.get('snA')]
        }

        switch(true) {
            case location.href.includes('C.php'):
                return generate(location.href)
            case location.href.includes('post1.php'): // post 頁面不會每次都有 snA，我不知道為什麼
                return generate(`https://forum.gamer.com.tw/${document.form1.action}`)
            case location.href.includes('Co.php'):
                return generate(`https://${document.querySelector('a[data-gtm="選單下滑-查看全文"]').href}`)
            default:
                return []
        }
    }

    function insertButton() {
        const actionTmpl = `
            <button class="__generate-floor-link" type="button" style="margin-left: 8px">樓層轉換</button>
            <label style="display: inline-flex; align-items: center; height: 24px; padding: 4px; color: #a6a6a6; font-size: 13.333333px; vertical-align: middle;">
                <input type="checkbox" name="no_floor_mark" />&nbsp;不限 # 號
            </label>
        `

        const [position, target] = location.href.includes('post1.php')
          ? ['afterend', '[href="https://home.gamer.com.tw/setting/forum_sign_edit.php"]']
          : ['beforeend', '.option .toolbar']
        document.querySelector(target).insertAdjacentHTML(position, actionTmpl)
    }

    function replaceFloorLink(content, bahaLink, hasMark) {
        const tags = 'font|span|i|b|u|strike'
        const regexStyle = reg => `((<(${tags})[^>]*>)*)${reg}((</(${tags})>)*)`

        const isAorImg = /(<a[^>]*>.*?<\/a>|<img[^>]*>)/g
        const hasLink = new RegExp(`<a[^>]*>${regexStyle('(#?)([0-9]+)')}</a>`, 'g')
        const regex = new RegExp(regexStyle(hasMark ? '(#)([0-9]+)' : '(#?)([0-9]{3,})'), 'g')

        return content
            .replace(hasLink, '$1$4$5$6') // 還原原本的樓層網址
            .split(isAorImg) // <a>, <img> split 後不會消失，而是單獨變成一行
            .map(line => isAorImg.test(line) ? line : line.replace(regex, `<a href="${bahaLink}&to=$5">$1$4$5$6</a>`))
            .join('')
            .replace(/color:\s?rgb\((<a[^>]*>)?(\d*)(<\/a>)?,\s?(<a[^>]*>)?(\d*)(<\/a>)?,\s?(<a[^>]*>)?(\d*)(<\/a>)?\);/g, 'color:rgb($2, $5, $8);') // 把被換成連結的 style:rgb 換回來，勾選不帶 # 號時會發生
            .replace(/color:\s?(#?[\w\d]*)<a[^>]*>(.*?)<\/a>([\w\d]*);/g, 'color:$1$2$3;') // 把被換成連結的 style:#色碼 換回來
    }

    window.addEventListener('load', () => {
        const [bsn, sna] = getBsnSna()
        if (!bsn || !sna) return

        insertButton()

        const bahaLink = `https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${sna}`
        const $iframeEditor = document.getElementById('editor').contentWindow.document.body

        document.querySelector('.__generate-floor-link').addEventListener('click', () => {
            $iframeEditor.innerHTML = replaceFloorLink($iframeEditor.innerHTML, bahaLink, !document.querySelector('[name="no_floor_mark"]').checked)
        })
    })
})()