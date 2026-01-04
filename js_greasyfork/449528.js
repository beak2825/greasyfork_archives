// ==UserScript==
// @name        巴哈弹幕转 dplayer
// @namespace   https://xmdhs.com
// @match       https://ani.gamer.com.tw/animeVideo.php?sn=*
// @version     0.0.1
// @author      xmdhs
// @description 提取巴哈的弹幕
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/449528/%E5%B7%B4%E5%93%88%E5%BC%B9%E5%B9%95%E8%BD%AC%20dplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/449528/%E5%B7%B4%E5%93%88%E5%BC%B9%E5%B9%95%E8%BD%AC%20dplayer.meta.js
// ==/UserScript==

(async () => {
    GM_addStyle(`.ahveuiw:after{content: "" !important;}`)

    const b = document.createElement("button")
    b.textContent = "复制 dplayer 格式弹幕"
    b.addEventListener('click', e => {
        e.preventDefault()
        const dm = getDm(animefun.danmu)
        const text = JSON.stringify(dm)
        GM_setClipboard(text);
    })
    b.className = "ahveuiw"

    document.querySelector(".anime_name").appendChild(b)

    function getDm(d) {
        let dm = {}
        dm.code = 0
        dm.data = []
        for (const v of d) {
            dm.data.push([
                v.time / 10,
                v.position ? v.position : 0,
                color2Number(v.color),
                "[Gamer]" + String(v.sn),
                v.text
            ])
        }
        return dm
    }


    function color2Number(color) {
        if (color[0] === '#') {
            color = color.substring(1)
        }
        if (color.length === 3) {
            color = `${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`;
        }
        return (parseInt(color, 16) + 0x000000) & 0xffffff;
    }
})()