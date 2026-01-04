// ==UserScript==
// @name         動畫瘋-動畫封面顯示
// @namespace    Anong0u0
// @version      0.1.2
// @description  一個簡單的腳本，讓你可以欣賞巴哈為你精心挑選的封面
// @author       Anong0u0
// @match        https://ani.gamer.com.tw/animeVideo.php?*
// @icon         https://i.imgur.com/2aijUa9.png
// @grant        none
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/490463/%E5%8B%95%E7%95%AB%E7%98%8B-%E5%8B%95%E7%95%AB%E5%B0%81%E9%9D%A2%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/490463/%E5%8B%95%E7%95%AB%E7%98%8B-%E5%8B%95%E7%95%AB%E5%B0%81%E9%9D%A2%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

const video = document.querySelector("video");
let previewImgUrl = video.poster;

let lastClick = 0;
video.addEventListener("contextmenu", (e)=>
{
    if(Date.now()-lastClick < 400) open(previewImgUrl)
    lastClick = Date.now();
});

const previewImg = document.createElement("img");
previewImg.id = "previewImg";
previewImg.hidden = true;
previewImg.src = previewImgUrl;
document.body.append(previewImg);

const previewLink = document.createElement("a")
previewLink.href = previewImgUrl
previewLink.target = "_blank"
previewLink.innerText = "預覽封面"
previewLink.id = "previewLink"
document.querySelector(".anime_name > button").insertAdjacentElement("afterend", previewLink);

previewLink.onmouseenter = ()=>{previewImg.hidden = false;}
previewLink.onmouseleave = ()=>{previewImg.hidden = true;}
previewLink.addEventListener("mousemove", (e)=>
{
    previewImg.style.left = `${e.clientX+20}px`
    previewImg.style.top = `${e.clientY+30-Number(getComputedStyle(previewImg).height.slice(0,-2))}px`
})

new MutationObserver(()=>
{
    previewImgUrl = video.poster
    previewImg.src = previewImgUrl
    previewLink.href = previewImgUrl
}).observe(video, {attributes:true})

const css = document.createElement("style")
css.innerHTML = `

.loading {
    opacity: 0.6;
    width: 200px;
    height: 120px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
}
.video-google-AD{background:unset}

.R18 {
    display: none;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 200px;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    background-color: #0005;
}
video-js:hover .R18 {display: block;}

img#previewImg {
    position: fixed;
    z-index: 2000;
    max-width: 100vw;
    max-height: 65vh;
    min-width: 40vw;
    border: 3px solid #FFF;
}

#previewLink {
    position: relative;
    left: 10px;
    top: 3px;
    font-size: 1.5em;
    cursor: pointer;
    color: var(--videoplayer-anime-title);
}

#previewLink:hover {color: var(--anime-primary-hover);}
`
document.body.append(css)


