// ==UserScript==
// @name           marumaru 更換影片 與 歌詞播放延遲
// @namespace      Anong0u0
// @version        0.3.4
// @description    可更換 marumaru 片源為你指定的 youtube 影片，並且提供更精確的校時
// @author         Anong0u0
// @match          https://www.marumaru-x.com/*-song/play-*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=marumaru-x.com
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-start
// @license        Beerware
// @downloadURL https://update.greasyfork.org/scripts/492048/marumaru%20%E6%9B%B4%E6%8F%9B%E5%BD%B1%E7%89%87%20%E8%88%87%20%E6%AD%8C%E8%A9%9E%E6%92%AD%E6%94%BE%E5%BB%B6%E9%81%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/492048/marumaru%20%E6%9B%B4%E6%8F%9B%E5%BD%B1%E7%89%87%20%E8%88%87%20%E6%AD%8C%E8%A9%9E%E6%92%AD%E6%94%BE%E5%BB%B6%E9%81%B2.meta.js
// ==/UserScript==

const delay = (ms = 0) => new Promise((r)=>{setTimeout(r, ms)})
const waitElementLoad = (elementSelector, selectCount = 1, tryTimes = 1, interval = 0) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        while(true)
        {
            if(selectCount != 1) {if((result = document.querySelectorAll(elementSelector)).length >= selectCount) break;}
            else {if(result = document.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) return reject(new Error("Wait Timeout"));
            await delay(interval);
        }
        resolve(result);
    })
}

const id = GM_getValue("id", {})
const songID = document.URL.split("/").pop()

// ===== 更改片源 ======

if (songID in id) document.querySelectorAll("[data-video-id]").forEach((e)=>e.setAttribute("data-video-id", id[songID]))
const oldLink = document.createElement("div")
const newLink = document.createElement("div")
const linkArea = document.querySelector(".alert")

oldLink.innerHTML = linkArea.innerHTML
oldLink.style.width = "max-content"
newLink.style.width = "max-content"
linkArea.innerHTML=""
linkArea.append(oldLink)
if (songID in id)
{
    oldLink.style["text-decoration"] = "line-through"
    newLink.innerHTML = `替換影片：<a href="https://youtu.be/${id[songID]}" target="_blank">https://youtu.be/${id[songID]}</a>`
    linkArea.append(newLink)
}

const button = document.createElement("div")
button.style = "position: absolute;top: 0;width: 100%;height: 100%;display: flex;align-items: center;margin-left: 8px"
button.innerHTML = `<button type="button" class="btn btn-dark ml-4"><i class="bi bi-arrow-repeat"></i>更換影片</button>`
new ResizeObserver(() => {
    const width = Math.max(getComputedStyle(oldLink).width.match(/[\d.]+/), getComputedStyle(newLink).width.match(/[\d.]+/)) + "px"
    button.style.left = width
    button.style.width = `calc(100% - ${width})`
}).observe(oldLink);
linkArea.append(button)

const origVid = oldLink.querySelector("a").href.split("/").pop()
button.querySelector("button").onclick = ()=>
{
    const res = prompt(`請輸入欲替換的 Youtube影片 的 網址 或 ID\n此歌曲原始ID為: ${origVid}`, origVid)
    if(!res) return;
    const vid = res.length==11 ? res : res.match(/(?<=\/|v=)[A-Za-z0-9_\-]{11}/)?.[0]
    if(!vid)
    {
        alert("youtube網址或ID錯誤，未替換")
        return
    }
    id[songID] = vid
    if (vid == origVid) delete id[songID]
    GM_setValue("id", id)
    location.reload()
}

// ===== 更改延遲 ======

const delayNum = GM_getValue("delayNum", {})
const delayDiv = document.createElement("div")
delayDiv.hidden = true
delayDiv.innerHTML = `
<div class="dropdown-menu delayInput">
  <span class="minus x10"><<</span>
  <span class="minus x1"><</span>
  <div class="s"><input id="delayInput" type="number" value="${delayNum[songID] || 0}" step="0.1"></div>
  <span class="plus x1">></span>
  <span class="plus x10">>></span>
</div>
<style>
.delayInput * {box-sizing: border-box;}
.delayInput {
    display:block;
    overflow:unset;
    min-width: unset;
    width: max-content;
    left: -90% !important;
    top: 100% !important;
    position: absolute;
    z-index: 114514;
    transform: unset !important;
}

.delayInput input {
	font-size: 1rem;
	height: 34px;
	background-color: #fff;
    border: none;
	float: left;
	width: 60px;
	line-height: 32px;
	text-align: center;
	font-family: "helveticaneuecyrbold";
    padding: 0;
}
.delayInput input::-webkit-outer-spin-button,
.delayInput input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.delayInput .s {display:inline}
.delayInput .s::after {
    content: "s";
    font-size: 0.8rem;
    float: left;
    text-align: center;
    line-height: 37px;
    color: #888;
    background-color: #fff;
    right: 34%;
    position: absolute;
    height: 0;
}

.delayInput span {
    line-height: 33px;
    font-size: 16px;
    font-weight: bolder;
    letter-spacing: -5px;
    text-align: center;
    display: block;
    width: 32px;
    float: left;
    height: 34px;
    cursor: pointer;
    transition: all 0.3s;
    padding-right: 4px;
}
.delayInput span:hover {
	background-color: #d5d5d5;
}
</style>
`

const delayInput = delayDiv.querySelector("#delayInput")

for(const np of ["minus", "plus"])
{
    const npNum = np=="plus" ? 1 : -1
    for(const multiple of ["x1", "x10"])
    {
        const multipleNum = multiple=="x10" ? 1 : 0.1
        delayDiv.querySelector(`span.${np}.${multiple}`).onclick = () =>
        {
            delayInput.value = (Number(delayInput.value) + npNum*multipleNum).toFixed(1)
            delayInput.oninput()
        }
    }
}

const timeStore = []
delayInput.oninput = () =>
{
    const value = Number(delayInput.value)
    if (Number.isInteger(value)) delayInput.value = String(value)
    if (songID in id)
    {
        $player.lyrics.forEach((e, i)=>
        {
            e.st = timeStore[i].st-value
            e.et = timeStore[i].et-value
        })
    }
    else
    {
        $player.lyricsEarlyTime = value
    }
    $player.stopLyrics()
    $player.playLyrics()
    const t = GM_getValue("delayNum", {})
    t[songID] = value
    GM_setValue("delayNum", t)
}

(async ()=>
{
    const timeBtns = [...await waitElementLoad("button.dropdown-toggle[data-original-title=歌詞提早設定]", 2, 0, 100)]
    let lastBtn = null;
    timeBtns.forEach((btn)=>btn.addEventListener("click", ()=>
    {
        btn.parentElement.append(delayDiv)
        delayDiv.hidden = !delayDiv.hidden
        if (lastBtn == btn) return
        delayDiv.hidden = false
        lastBtn = btn
    }))
    document.addEventListener("click", (e) =>
    {
        if (!(delayDiv.contains(e.target) || timeBtns.some((btn)=>btn.contains(e.target))))
        {
            delayDiv.hidden = true
        }
    });
    document.querySelectorAll("button.dropdown-toggle[data-original-title=歌詞提早設定] ~ .dropdown-menu").forEach((e)=>e.remove());


    while(typeof $player == 'undefined') await delay(100)
    while($player?.lyrics?.length === 0) await delay(100);
    $player.lyrics.forEach((e, i)=>{timeStore[i] = {st: e.st, et: e.et}})
    delayInput.oninput()
})()



