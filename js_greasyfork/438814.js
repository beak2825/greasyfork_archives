// ==UserScript==
// @name         KKBOX複製歌名
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  複製KKBOX歌手&30首歌名
// @author       YC白白
// @match        https://www.kkbox.com/tw/tc/song-list/*
// @match        https://www.kkbox.com/tw/tc/playlist/*
// @icon         https://www.google.com/s2/favicons?domain=kkbox.com
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/438814/KKBOX%E8%A4%87%E8%A3%BD%E6%AD%8C%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/438814/KKBOX%E8%A4%87%E8%A3%BD%E6%AD%8C%E5%90%8D.meta.js
// ==/UserScript==

/*
v0.1 支援熱門歌曲
v0.2 支援熱門歌曲 & 歷年精選
v0.3 美化「複製歌名」按鈕
*/

// 創copy的button
let copysongnames = document.createElement("button")
copysongnames.id = "copysongnames"
copysongnames.innerHTML = '複製歌名'
//copysongnames.style.height = "40px"
//copysongnames.style.width = "140px"
copysongnames.style.bottom = "15px"
copysongnames.style.left = "5px"
copysongnames.style.position = "relative"
copysongnames.style.border = "none"
//copysongnames.style.background = "#4CAF50"
copysongnames.classList.add("greenCss")
greenCss()
//document.body.prepend(copysongnames)
//insertAfter(copysongnames, document.getElementsByClassName("buttons")[0])
//document.getElementsByClassName("buttons")[0].appendChild(copysongnames)
document.getElementsByClassName("buttons")[0].append(copysongnames)
//buttons

//document.getElementsByClassName("buttons")[0].insertBefore(copysongnames, theFirstChild)
//document.getElementsByClassName("buttons")[0].insertBefore(copysongnames, document.getElementsByClassName("buttons")[0])
//let share = document.getElementsByClassName("action-preview")[0]
//share.parentElement.insertBefore(copysongnames,share)

copysongnames.onclick = function(){
    //歌名串
    let songname = document.querySelectorAll("a > div.text > h3")
    //let songnames = document.querySelector("a > img").alt + "\n"
    let songnames = document.querySelectorAll("div.title > h1")[0].innerHTML + "\n"
    for (let i = 0; i < songname.length; i++) {
        songnames += songname[i].innerHTML + "\n"
    }
    //console.log(songnames)

    const value = songnames
    const el = document.createElement('textarea')
    el.value = value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
}


// 新增一種可以插入在指定示素後面的function
function insertAfter(newElement,targetElement) {
    let parent = targetElement.parentNode
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement)
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling)
    }
}


function greenCss() {
    let cssStyle = document.createElement("style")
    cssStyle.id = "cssStyle"
    let cssStr = `
    .greenCss {
        background-color:#00bb10;
        border-radius:33px;
        color:#fff;
        cursor:pointer;
        display:inline-block;
        font-size:13px;
        margin-right:5px;
        overflow:hidden;
        padding:11px 0;
        text-align:center;
        white-space:nowrap;
        width:140px;
    }
    .greenCss:hover{
        background-color:#6ccc63;
    }
    .greenCss:active{
        background: #000000;   /* 黑色 */
        opacity: 0.5;    /* 設置不透明度（可以不設置） */
    }
    `
    cssStyle.innerHTML = cssStr
    document.querySelector("head").append(cssStyle)
}



/*
let itm = document.getElementsByClassName("action-preview")[0]
let cln = itm.cloneNode(true)
delete cln.dataset.id
delete cln.dataset.action
delete cln.dataset.type
//cln.onclick = aaa
//alert(cln.lastElementChild.innerHTML)
cln.lastElementChild.innerHTML = "複製歌名"
//document.querySelector(".action-preview > span")[1].innerHTML = "複製歌名"
//document.querySelectorAll(".action-preview > span")[1].innerHTML = "複製歌名"
// document.getElementsByClassName("action-open")[0].appendChild(cln)
// document.getElementsByClassName("action-open")[0].append(cln)
insertAfter(cln, document.getElementsByClassName("action-open")[0])

function aaa() {
    alert("abc")
}

*/

