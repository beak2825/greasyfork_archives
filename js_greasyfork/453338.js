// ==UserScript==
// @name         Musescore Downloader
// @name:zh      Musescore 增强脚本
// @version      1.3.0
// @description  download pdf or print any sheets!
// @description:zh  去广告+任意下载乐谱
// @author       Charlie
// @match        https://musescore.com/*
// @namespace    https://greasyfork.org/users/890174
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/453338/Musescore%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/453338/Musescore%20Downloader.meta.js
// ==/UserScript==

GM_addStyle(`
.SUG3q > .hei_M:nth-child(3) > .AFyen:nth-child(2),
.YaB2I > section :nth-last-child(n+2),
aside > div:nth-last-child(2),
aside > div:nth-child(2),
aside > div:nth-child(3),
header > *:not(nav),
.hFMfR > .AFyen,
footer,
._9aj2,
.p6izg,
.TnQwe,
.U8wvj,
.jxGLy,
.YRlfn,
.YMprF,
.MXIPY {
	display: none !important;
}
.dXt6a {
	background-color: #e1effe !important;
	padding: .3em .8em !important;
	border-left: 5px solid #1a4f9f !important;
	font-size: 14px !important;
}
.ZvxB2, .AJXCt {
	background-color: #e1effe7c !important;
	padding: .6em .8em !important;
	border-radius: 4px !important;
	outline: 1.5px solid #1a4f9f !important;
    flex-direction: column !important;
}
aside a {
	padding: 0 .3em !important;
	transition: background-color ease-out .15s !important;
}
aside a:hover {
	background-color: #45f !important;
	color: #f3f3ff !important;
}
aside > div:nth-child(5) {
	border: none !important;
}
aside > div:nth-child(4),
aside > div:nth-child(5) {
	padding: 12px 20px !important;
}
aside > div:nth-child(4) > div {
	display: flex !important;
	place-items: center !important;
    flex-direction: column !important;
}
aside > div:nth-child(4) > div > .Pl3iC {
	margin-right: 16px !important;
}
aside > div:nth-child(4) > div.PI5Hd.g1QZl.CgHMj > section:nth-child(2) {
    width: 100% !important;
}
.oQdm2 {
    max-width: unset !important;
}
aside table {
	background-color: #e1effe7c !important;
	padding: .3em .6em !important;
	border-radius: 3px !important;
	outline: 1.5px solid #1a4f9f !important;
}
aside table tr {
	padding-bottom: 5px !important;
}
.a0naR,
.Au_pg,
.Al3lQ {
	height: 32px !important;
	width: 32px !important;
	color: transparent !important;
	border-radius: 5px !important;
}
.hyzNL {
	max-height: unset !important;
}
.dXt6a section {
	margin: 0 !important;
}`)

setTimeout(() => {
    "use strict"
    const ZH = navigator.language == "zh-CN"

    async function download() {
        const Window = window.open()
        const id = location.pathname.match(/\/[^\/]*$/)[0].slice(1)
        const length = unsafeWindow.UGAPP.store.page.data.score.pages_count
        Window.document.write(`
<!DOCTYPE html>
<head>
<title>${document.getElementsByTagName('h1')[0].innerText}</title>
<style>
    body {
        margin: 0;
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        place-items: center;
        justify-content: center;
        color: rgb(49, 63, 78);
        background-color: rgb(237, 242, 247);
        transform-origin: top;
        transition: background-color ease .3s;
        will-change: background-color;
        overflow-x: scroll;
    }

    svg {
        width: 100vw;
        height: auto;
        display: block;
        margin: auto;
    }

    .card {
        display: flex;
        text-align: center;
        place-items: center;
        font-size: 1.2em;
        width: ${ ZH ? 360 : 480 }px;
        box-shadow: 10px 10px 8px rgba(0, 0, 0, 0.07);
        padding: 1.5em 2em;
        background-color: rgb(255, 255, 255);
        border-radius: 8px;
        transition: all ease-out .3s;
        overflow: hidden;
        white-space: nowrap;
    }

    body > * {
        animation: 1.5s intro;
    }

    @keyframes intro {
        0%, 20% { opacity: 0; }
        100%    { opacity: 1; }
    }

    .card-icon {
        display: flex;
        flex-direction: column;
        place-items: center;
        margin-right: 3em;
        font-weight: bold;
    }

    .card-text {
        flex: 1;
    }

    b {
        color: rgb(49, 140, 252);
    }

    .spinner, .spinner * { box-sizing: border-box; }
    .spinner {
      height: 40px;
      width: 40px;
      top: calc( -10px * 2 / 3);
      margin-left: calc(10px / 3);
      margin-bottom: calc(10px / 3);
    }
    .spinner .sq {
      height: 10px;
      width: 10px;
      top: calc( -10px * 2 / 3);
      margin-right: calc(10px / 3);
      margin-top: calc(10px / 3);
      background: rgb(49, 140, 252);
      float: left;
      position: relative;
      opacity: 0;
      animation: spinner 6s infinite;
    }
    ${Array(9).fill().map((_, i) => `.spinner .sq:nth-child(${i+1}) { animation-delay: calc(300ms * ${8-i}); }`).join("\n")}
    .spinner .clear { clear: both; }
    @keyframes spinner {
      0% { opacity: 0; }
      5% { opacity: 1; top: 0; }
      50.9% { opacity: 1; top: 0; }
      55.9% { opacity: 0; top: inherit; }
    }

    @media print {
        @page {
            margin: 0;
        }
        button {
            display: none;
        }
        svg {
            width: 21cm;
            height: 29.7cm;
        }
    }

    .btn-group {
        position: fixed;
        left: 32px;
        top: 24px;
    }
    button {
        font-size: 1.4em;
        font-weight: bold;
        box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.1);
        padding: .4em ${ ZH ? 1.5 : 0.8 }em;
        margin-right: 1.2em;
        background-color: rgb(255, 255, 255);
        color: rgb(49, 63, 78);
        border-radius: 4px;
        cursor: pointer;
        outline: 1.5px solid rgb(49, 63, 78);
        border: none;
        transition: all ease-out .2s;
    }
    button:hover {
        background-color: rgb(235, 235, 235);
    }
    button:active {
        outline-color: black;
        transform: scale(0.97);
    }

    .hint {
        margin: 1em 0;
        color: #a7b2be;
    }
</style>
</head>
<body>
<div class="card">
    <div class="card-icon">
        <div class="spinner">
            <div class="sq"></div>
            <div class="sq"></div>
            <div class="sq"></div>
            <div class="sq clear"></div>
            <div class="sq"></div>
            <div class="sq"></div>
            <div class="sq clear"></div>
            <div class="sq"></div>
            <div class="sq"></div>
        </div>
        <div class="card-icon-text">${ ZH ? "下载中" : "Downloading" }</div>
    </div>
        <div class="card-text">
            ${ ZH ? `已下载 <b id="download-status">0</b> 页，共 <b>${length}</b> 页`
                  : `<b id="download-status">0</b> page(s) loaded, <b>${length}</b> total` }
        </div>
    </div>
    <span class="hint">${ ZH ? "点击左上方的 <b>打印</b> 按钮，选择 <b>另存为PDF</b> 即可下载乐谱。" : "To download the sheet, click <b>PRINT</b> button on the top left then select <b>Export PDF</b>." }</span>
</body>`)
        Window.onbeforeunload = e => {
            e.preventDefault()
            e.returnValue = "QwQ"
            return "awa"
        }

        let data = Array(length).fill(""), cnt = 0

        async function getData() {
            return Promise.all(
                data.filter(e => e.length == 0).map((_, i) => new Promise(async (res, rej) => {
                    let url = await fetch(`https://musescore.com/api/jmuse?id=${id}&type=img&v2=1&index=${i}`, {
                        headers: { authorization: "8c022bdef45341074ce876ae57a48f64b86cdcf5" }
                    }).then(e => e.json()).then(e => e.info.url).catch(rej)
                    data[i] = await fetch(url).then(e => e.text()).catch(rej)
                    Window.document.getElementById("download-status").innerText = ++cnt
                    res()
                }))
            ).catch((err) => console.error(err))
        }

        setTimeout(() => {
            Window.document.getElementsByClassName("hint")[0].innerText = ZH ? "如果长时间没反应就不要傻等着了，现在或者等会再试试吧。" : "If the process stoped, you can try again now or later."
        }, 8 * 1000)

        await getData()

        setTimeout(async () => {
            Window.document.getElementsByClassName("card-icon-text")[0].innerText = ZH ? "解析中" : "Decoding"
            if(cnt != length) {
                Window.document.getElementsByClassName("card-text")[0].innerText = ZH ? "下载失败，请稍后再试。" : "Download failed, try again later."
                return
            }
            setTimeout(() => {
                Window.document.body.style.background = "white"
                Window.document.body.innerHTML = data.join("") + `<div class="btn-group"><button onclick="print()">${ ZH ? "打印" : "PRINT" }</button>`
                const svgs = [...Window.document.getElementsByTagName("svg")]
                svgs.forEach((e) => e.setAttribute("viewBox", `0 0 ${e.width.baseVal.value} ${e.height.baseVal.value}`))
                Window.scrollTo(0, 0)
            }, 400)
        }, 400)
    }

    const btns = [...document.getElementsByTagName("button")]
    btns.filter(el => {
        const val = el.attributes.getNamedItem("name")?.value
        return val == "download" || val == "print"
    }).forEach(el => {
        const type = el.attributes.getNamedItem("name").value
        const fakeEl = el.cloneNode(true)
        fakeEl.style.border = "2px #0dbc79 solid"
        if(type == "download") fakeEl.style.background = "#0dbc79"
        fakeEl.onclick = download
        el.parentNode.replaceChild(fakeEl, el)
    })
}, 500)