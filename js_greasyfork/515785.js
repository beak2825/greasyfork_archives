// ==UserScript==
// @name         ColorHunt带标签复制
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  复制ColorHunt颜色时携带html标签，支持自定义标签名、字体大小和宽度
// @author       Byron
// @match        https://colorhunt.co/palette/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=colorhunt.co
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515785/ColorHunt%E5%B8%A6%E6%A0%87%E7%AD%BE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/515785/ColorHunt%E5%B8%A6%E6%A0%87%E7%AD%BE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const div = document.createElement("div")

    div.innerHTML = `<p style="font-size: large;font-weight: bold;margin: 0 0 10px;">复制选项</p>`

    div.style = "position: fixed;right: 15px;bottom: 20px;padding: 10px 15px;border: solid black 1px;background: white;border-radius: 10px;box-shadow: 3px 3px 0 0 black;overflow:hidden;width:210px;height:250px;display: flex;flex-direction: column;gap: 15px;transition:300ms cubic-bezier(0.65, 0.05, 0.36, 1);"

    // closeButton
    const closeButton = document.createElement("span")
    closeButton.innerText = "✕"
    closeButton.onclick = ()=>{
        document.body.removeChild(div)
    }
    closeButton.style = "position: absolute;top: 12px;right: 7px;width: 15px;height: 15px;display: flex;align-items: center;justify-content: center;user-select: none;cursor: pointer;"

    div.appendChild(closeButton)

    // minimizeButton
    const minimizeButton = document.createElement("span")

    const max = " ", // ▢
        min = "–"
    function setDivMax(){
        div.style.height = "250px"
        div.style.width = "210px"
        div.style.cursor = "auto"
        minimizeButton.innerText = min
        localStorage.setItem("byron-script-div-size", min)
    }
    function setDivMin(){
        div.style.height = "20px"
        div.style.width = "90px"
        div.style.cursor = "pointer"
        minimizeButton.innerText = max
        localStorage.setItem("byron-script-div-size", max)
    }
    minimizeButton.innerText = min
    minimizeButton.onclick = e=>{
        e.preventDefault()
        e.stopPropagation()
        if(minimizeButton.innerText == min){
            setDivMin()
        }else{
            setDivMax() // "⇱⇲"
        }

    }
    minimizeButton.style = "position: absolute;top: 12px;right: 30px;width: 15px;height: 15px;display: flex;align-items: center;justify-content: center;user-select: none;cursor: pointer;font-size:18px"

    div.appendChild(minimizeButton)

    // tagNameInput
    const tagNameInputLabel = document.createElement("label"),
        tagNameInput = document.createElement("input")
    tagNameInput.placeholder = "默认 font"
    tagNameInputLabel.innerHTML = "标签名"
    tagNameInputLabel.appendChild(tagNameInput)
    tagNameInput.onchange = e=>{
        localStorage.setItem("byronScriptTagName", e.target.value)
    }
    let beforeTagName = localStorage.getItem("byronScriptTagName")
    if (beforeTagName) tagNameInput.value = beforeTagName
    div.appendChild(tagNameInputLabel)

    // fontSizeInput
    const fontSizeSelectorLabel = document.createElement("label"),
        fontSizeSelector = document.createElement("select")
    fontSizeSelector.innerHTML = `<option value="40px" label="巨大"/>
    <option value="22px" label="大号"/>
    <option value="medium" label="标准"/>
    <option value="13px" label="小号"/>
    <option value="8px" label="巨小"/>`
    fontSizeSelector.value = "medium"
    fontSizeSelector.style="width: 100%;border: 1px solid #ececec;height: 38px;font-size: 14px;padding-left: 16px;box-sizing: border-box;border-radius: 40px;"

    fontSizeSelector.onchange = e=>{
        localStorage.setItem("byronScriptFontSize", e.target.value)
    }
    let beforeFontSize = localStorage.getItem("byronScriptFontSize")
    if (beforeFontSize) fontSizeSelector.value = beforeFontSize

    fontSizeSelectorLabel.innerHTML = "字体大小"
    fontSizeSelectorLabel.appendChild(fontSizeSelector)
    div.appendChild(fontSizeSelectorLabel)

    // fontWeightSelector
    const fontWeightSelectorLabel = document.createElement("label"),
        fontWeightSelector = document.createElement("select")
    fontWeightSelector.innerHTML = `<option value="bolder" label="巨粗"/>
    <option value="bold" label="粗"/>
    <option value="normal" label="标准"/>
    <option value="lighter" label="细"/>`
    fontWeightSelector.value = "normal"
    fontWeightSelector.style="width: 100%;border: 1px solid #ececec;height: 38px;font-size: 14px;padding-left: 16px;box-sizing: border-box;border-radius: 40px;"

    fontWeightSelector.onchange = e=>{
        localStorage.setItem("byronScriptFontWeight", e.target.value)
    }
    let beforeFontWeight = localStorage.getItem("byronScriptFontWeight")
    if (beforeFontWeight) fontWeightSelector.value = beforeFontWeight

    fontWeightSelectorLabel.innerHTML = "字体宽度"
    fontWeightSelectorLabel.appendChild(fontWeightSelector)
    div.appendChild(fontWeightSelectorLabel)

    div.onclick = setDivMax

    let divSize = localStorage.getItem("byron-script-div-size") || min
    if(divSize == max) setDivMin()
    document.body.appendChild(div)

    document.onclick = e=>{
        const target = e.target,
              tagName = target.tagName,
              color = target.getAttribute("data-copy")
        if(tagName != "SPAN" || !color) return
        e.preventDefault()
        const copyTagName = tagNameInput.value || "font",
            copyFontSize = fontSizeSelector.value || "medium",
            copyFontWeight = fontWeightSelector.value || "normal"

        let textStyles = `color:${color};`
        if(copyFontSize != "medium"){
            textStyles += `font-size:${copyFontSize};`
        }
        if(copyFontWeight != "normal"){
            textStyles += `font-weight:${copyFontWeight};`
        }

        navigator.clipboard.writeText(`<${copyTagName} style="${textStyles}"></${copyTagName}>`);
   }
})();