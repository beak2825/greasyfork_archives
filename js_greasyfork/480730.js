// ==UserScript==
// @name         Gallery Mitaku
// @namespace    http://yu.net/
// @version      2.2
// @description  Change Lightbox
// @author       Yu
// @require      https://update.greasyfork.org/scripts/480727/1285876/LighboxModern.js
// @match        https://mitaku.net/ero-cosplay/*
// @match        https://mitaku.net/sexy-set/*
// @match        https://mitaku.net/nude/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mitaku.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480730/Gallery%20Mitaku.user.js
// @updateURL https://update.greasyfork.org/scripts/480730/Gallery%20Mitaku.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".LightboxModern .LightboxTool.FadeIn,.LightboxModern.FadeIn{visibility:visible;opacity:100%}*{box-sizing:border-box}.LightboxModern{position:fixed;top:0;left:0;background-color:#202020;width:100%;height:100%;opacity:0%;transition:1s;visibility:hidden;z-index:9999}.LightboxModern .Progress{width:0%;height:12px;background-color:#62bdff;transition:width .5s}.LightboxModern .ImageWrapper{position:absolute;width:100%;height:100%;display:flex;justify-content:center;align-items:center;opacity:0%;transition:opacity .5s}.LightboxModern .ImageWrapper.FadeIn{opacity:100%}.LightboxModern .ImageWrapper img{width:100%;height:100%;object-fit:contain}.LightboxModern .ImageWrapper .ImagePadding{padding:20em;position:absolute;z-index:10}.LightboxModern .Swiper{position:absolute;top:0;left:0;width:100%;height:100%;z-index:20}.LightboxModern .LightboxTool{visibility:hidden;position:relative;width:100%;height:calc(100% - 12px);opacity:0%;transition:.5s;z-index:21}.LightboxModern .LightboxTool .ToolHeader{position:absolute;width:100%;top:0;display:flex;justify-content:space-between}.LightboxModern .LightboxTool .ToolFooter{position:absolute;width:100%;bottom:0;display:flex;justify-content:center;gap:10px}button{background-color:coral;border:unset;padding:.65em 1em;font-size:1em}")
    const box = document.createElement("article")
    box.classList.add("box")


    const imgElements = document.querySelectorAll(".msacwl-slider-wrap img")
    const images = []
    for(const img of imgElements) {
        images.push(img.getAttribute("data-src"))
    }

    const button = document.createElement("button")
    button.style.position = "fixed"
    button.style.bottom = "0"
    button.style.right = "10px"
    button.style.zIndex = "999"

    button.innerText = "Lightbox"
    button.onclick = () => {
        document.documentElement.requestFullscreen()
        new LightboxModern(box, { images })
    }
    
    document.body.append(button)
    document.body.append(box)
})();