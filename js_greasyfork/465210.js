// ==UserScript==
// @name:ko           Hitomi 페이지 스크롤러
// @name              Hitomi page scroller

// @description:ko    위아래로 스크롤하여 페이지를 넘길 수 있으며, "Fit"모드 이미지 넓이를 조절 할 수 있습니다.
// @description       You can scroll up and down to turn the page and adjust the "Fit" mode image area.

// @namespace         -
// @version           2025.09.11
// @author            ndaesik
// @icon              https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hitomi.la
// @match             https://*.la/reader/*

// @grant             GM.getValue
// @grant             GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/465210/Hitomi%20page%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/465210/Hitomi%20page%20scroller.meta.js
// ==/UserScript==
if (window.location.hostname === 'hitomi.la') {
(async () => {
if (await GM.getValue("fitMode") == undefined) GM.setValue("fitMode", "75")
document.querySelector("#fitHorizontal").parentElement.insertAdjacentHTML("beforeend", `<li style="padding:8px 12px"><input id="meme" type="range" min="30" max="100" value="`+await GM.getValue("fitMode")+`"></li>`)
document.querySelector("#meme").addEventListener("change", function() {
let fit = document.querySelector("#meme").value,
    tem = document.createElement("style")
    tem.innerText = `.spread1 .fitHorizontal img {max-width:`+ fit +`%!important;}`
    document.head.appendChild(tem)
    GM.setValue("fitMode", fit)
})
let def = 0, mov = 2, move = where => {(def != mov) ? def = def + 1 : (document.querySelector("li:not(.disabled) #"+where+"Panel")?.click(), window.scrollTo({ top: 0 }), def = 0)}
if (window.location.href.indexOf("#") > -1 && document.body.scrollHeight > 150) {
    window.onwheel = e => {
        if (document.querySelector("#comicImages img").height > 0) {
            let ele = document.querySelector("#comicImages")
            if (e.deltaY > 0 && ele.scrollHeight - ele.scrollTop <= ele.clientHeight + 2 ) move("next")
            if (e.deltaY < 0 && ele.scrollTop == 0 ) move("prev")
        }
    }
}
let st = document.createElement("style")
st.innerText = `
body {overflow:scroll!important; height:unset!important}
li>#fitHorizontal+li{display:none}
li.active>#fitHorizontal+li,#fitHorizontal{display:inline-block}
#comicImages {padding-top:41px; position: fixed; width: 100%; height: 100%; overflow-y: scroll;}
.navbar {position:fixed; width:100vw; z-index:1}
.fitVertical img {max-height:calc(100vh - 41px)!important; width:auto!important}
.spread1 .fitHorizontal img {max-width:`+ document.querySelector("#meme").value +`%;}`
document.head.appendChild(st)
})()}