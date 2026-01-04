// ==UserScript==
// @name         Steal Bing AI
// @namespace    Anong0u0
// @version      0.3.8
// @description  把Bing AI幹過來Google搜尋頁面使用
// @author       Anong0u0
// @match        https://www.google.com/*
// @match        https://www.google.cat/*
// @match        https://www.google.com.tw/*
// @match        https://www.google.com.hk/*
// @icon         https://i.ibb.co/cKBDpt7/bing.png
// @grant        none
// @noframes
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/461463/Steal%20Bing%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/461463/Steal%20Bing%20AI.meta.js
// ==/UserScript==

const country = "tw", // or "us"
      language = "zh-hant", // or "en"
      postfix = " 用繁體中文回覆"; // or " reply with english"

const getXY = (element) =>
{
    let x = 0, y = 0;
    while (element)
    {
        x += element.offsetLeft - element.scrollLeft + element.clientLeft;
        y += element.offsetTop - element.scrollLeft + element.clientTop;
        element = element.offsetParent;
    }
    return {x: x, y: y}
}

const steal = () =>
{
    const search_content = document.querySelector("textarea.gLFyf")?.value ?? document.URL.match(/(?<=q=)[^&]*/),
          search_url = `https://www.bing.com/search?q=${encodeURIComponent(search_content)}${postfix}&cc=${country}&setlang=${language}&showconv=1`,
          div = document.createElement("div"),
          svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" style="vertical-align: middle;margin-right: 6px;" fill="none"><path fill="#000" class="cdxscopei" d="M5.5 0a5.5 5.5 0 0 1 4.383 8.823l4.147 4.147a.75.75 0 0 1-.976 1.133l-.084-.073-4.147-4.147A5.5 5.5 0 1 1 5.5 0Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"></path></svg>`;
    div.id = "bingAI"
    div.innerHTML = `
    <style>
        /*.GyAeWb {max-width: 100vw;}*/
        .srp {--rhs-width: 450px;}
        /*div.M8OgIe {order:-3;}
        #center_col {order: -2;}*/
        .TQc1id {
            display: flex;
            flex-direction: column;
        }
        :not(.TQc1id[jscontroller]) > #bingAI {display:none;}
        #rcnt > #bingAI {display:block;}
        :not(.TQc1id) > #bingAI {margin-left: var(--rhs-margin);}
        #bingAI {
            /*order: -1;*/
            margin-bottom: 24px;
            height: fit-content;
        }
        iframe#bing {
            width: 450px;
            height: 70vh;
            border: 0;
            border-radius: 10px;
        }
        input#fullscreen {
            width: 40px;
            height: 40px;
            z-index: 64;
            position: fixed;
            border-radius: 20px;
            transition: box-shadow 200ms ease-in-out 0s, transform 300ms ease 0s;
        }
        input#fullscreen:hover {
            box-shadow: rgb(187, 187, 187) 0px 0px 8px 3px !important;
            transform: rotate(180deg) !important;
        }
        #startBing {
            max-width: 450px;
            width: fit-content;
            /*color: #fff;
            background: linear-gradient(90deg, #2870EA 10.79%, #1B4AEF 87.08%);*/
            background: url(https://www.bing.com/cdx/bg-sprite.png);
            background-size: 300% 200%;
            background-position: 50% 0%;
            border-radius: 10px;
            cursor: pointer;
        }
        #startBing div {
            color: black;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        #startBing b {color: #174AE4;}
        #gptDiv {flex: 0 !important;}
    </style>

    <div id="startBing"><div style="padding: 16px;">${svgIcon}Ask BingAI for <b>${search_content}</b></div></div>`

    if(document.querySelector(".TQc1id")) document.querySelector(".TQc1id").prepend(div)
    else if(document.querySelector("#gptDiv")) document.querySelector("#gptDiv").append(div)
    else document.querySelector("#rcnt").append(div)

    let fulled = false;
    const fullSrc = "https://i.imgur.com/rvtSN7N.png",
          nofullSrc = "https://i.imgur.com/abfxZpZ.png";
    const button = document.createElement("input")
    button.style.display = "none"
    button.hidden = true
    button.type = "image"
    button.src = fullSrc
    button.id = "fullscreen"
    document.body.append(button)
    const locate = () =>
    {
        if(fulled == false)
        {
            const xy = getXY(div)
            button.style.top = `${xy.y + 20 - document.documentElement.scrollTop}px`
            button.style.left = `${xy.x + div.clientWidth - 70}px`
        }
        else
        {
            button.style.top = `22px`
            if (window.innerWidth >= 1400) button.style.left = `${window.innerWidth - 405}px`
            else if (window.innerWidth >= 1275) button.style.left = `${window.innerWidth - 335}px`
            else if (window.innerWidth >= 1165) button.style.left = `${window.innerWidth - 270}px`
            else if (window.innerWidth >= 965) button.style.left = `895px`
            else if (window.innerWidth >= 410) button.style.left = `${window.innerWidth - 70}px`
            else button.style.left = `340px`
        }
    }
    window.addEventListener("resize", locate)
    window.addEventListener('scroll', locate);
    const style = document.createElement("style")
    style.innerHTML = `html{overflow:-moz-hidden-unscrollable;height:100%;}body::-webkit-scrollbar{display:none;}body{-ms-overflow-style:none;height:100%;width:calc(100vw+18px);overflow:auto;}
    iframe#bing {width:100vw;height:100vh;border: 0;border-radius: 0;z-index: 256;position: fixed;top: 0;left: 0;}
    input#fullscreen {z-index: 512;}`
    button.onclick = () =>
    {
        fulled = !fulled;
        if (fulled)
        {
            document.body.append(style)
            button.src = nofullSrc;
            window.history.pushState("page", "", `https://www.google.com/url?q=${encodeURIComponent(search_url)}`);
        }
        else
        {
            style.remove();
            button.src = fullSrc;
            window.history.back();
        }
        locate();
    }

    const div2 = document.querySelector("div#startBing")
    div2.onclick = () =>
    {
        div2.remove();
        div.innerHTML+=`<iframe id="bing" src="${search_url}"></iframe>`;
        locate()
        button.style.display = "block"
        button.hidden = false
    }
    if (search_content.endsWith("?")) div2.onclick();
}

if(window.location.pathname == "/search") steal();


