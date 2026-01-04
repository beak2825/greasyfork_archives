// ==UserScript==
// @name         EES
// @namespace    https://fazerog02.dev
// @version      0.0.1
// @description  This extention makes searching for only sites witten in English easy.
// @author       fazerog02
// @match        https://www.google.com/search*
// @icon         https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443307/EES.user.js
// @updateURL https://update.greasyfork.org/scripts/443307/EES.meta.js
// ==/UserScript==

const isDefaultHref = () => {
    return !(location.href.includes("gl=") || location.href.includes("hl="))
}

const getDefaultUrl = (url) => {
    if(url.includes("gl=")) url = url.replace(/&gl=../g, "").replace(/gl=..&/g, "")
    if(url.includes("hl=")) url = url.replace(/&hl=..\-../g, "").replace(/hl=..\-..&/g, "").replace(/&hl=../g, "").replace(/hl=..&/g, "")
    return url
}

const switchToDefault = () => {
    let new_href = getDefaultUrl(location.href)
    if(new_href !== location.href) location.href = new_href
}

const switchToEnglish = () => {
    let new_href = getDefaultUrl(location.href)
    if(new_href.includes("?")) {
        if(new_href[new_href.length-1] !== "?") new_href += "&"
        new_href += "gl=us&hl=en"
    }else {
        new_href += "?gl=us&hl=en"
    }
    if(new_href !== location.href) location.href = new_href
}

(function() {
    const options_area = document.getElementsByClassName("LHJvCe")[0]
    options_area.style.justifyContent = "normal"

    let div = document.createElement("div")
    div.style.display = "flex"

    let lang_label = document.createElement("span")
    lang_label.id = "LangLabel"
    lang_label.style.color = "#70757a"
    lang_label.style.marginLeft = "5px"
    lang_label.innerText = isDefaultHref() ? "Default" : "English"

    let switcher = document.createElement("label")
    switcher.style.display = "inline-block"
    switcher.style.width = "50px"
    switcher.style.height = "30px"
    switcher.style.margin = "10px 0"
    switcher.style.borderRadius = "15px"
    switcher.style.backgroundColor = isDefaultHref() ? "#e6f2ff" : "#5c5cd6"
    switcher.style.transform = "translateY(-5px)"
    switcher.style.transition = "background-color 200ms 0ms ease"

    let ball = document.createElement("div")
    ball.style.position = "absolute"
    ball.style.left = isDefaultHref() ? "5px" : "25px"
    ball.style.top = "50%"
    ball.style.transform = "translateY(-50%)"
    ball.style.zIndex = 10
    ball.style.width = "20px"
    ball.style.height = "20px"
    ball.style.borderRadius = "50%"
    ball.style.backgroundColor = "#fff"
    ball.style.transition = "left 200ms 0ms ease"

    let toggle = document.createElement("input")
    toggle.type = "checkbox"
    toggle.checked = !isDefaultHref()
    toggle.onclick = () => {
        let lang_label_ele = document.getElementById("LangLabel")
        if(toggle.checked) {
            switcher.style.backgroundColor = "#5c5cd6"
            ball.style.left = "25px"
            switchToEnglish()
            lang_label_ele.innerText = "English"
        }else {
            switcher.style.backgroundColor = "#e6f2ff"
            ball.style.left = "5px"
            switchToDefault()
            lang_label_ele.innerText = "Default"
        }
    }
    toggle.style.width = 0
    toggle.height = 0
    toggle.opacity = 0

    options_area.appendChild(div)
    div.appendChild(switcher)
    div.appendChild(lang_label)
    switcher.appendChild(toggle)
    switcher.appendChild(ball)
})()