// ==UserScript==
// @name         LineStore Download Sticker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  find strickers URL on LineStore quickly
// @author       Sentencedot
// @match        https://store.line.me/stickershop/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395698/LineStore%20Download%20Sticker.user.js
// @updateURL https://update.greasyfork.org/scripts/395698/LineStore%20Download%20Sticker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Element.prototype.hasClass = function(className){
        if(typeof(className) !== "string")
            throw "the argument must be String type"
        return this.classList.contains(className)
    }

    var play_span = document.querySelector("img.FnImage").nextElementSibling
    var StrickerPageID = window.location.pathname.replace(/\/stickershop\/product\/([a-f\d]+).*/, '$1')
    var StrickerTitle = document.querySelector("p.mdCMN38Item01Ttl")

    if(play_span.hasClass("MdIcoPlay_b") || play_span.hasClass("MdIcoAni_b") || play_span.hasClass("MdIcoSound_b"))
        var downloadLink = `https://sdl-stickershop.line.naver.jp/stickershop/v1/product/${StrickerPageID}/iphone/stickerpack@2x.zip`
    else
        var downloadLink = `https://sdl-stickershop.line.naver.jp/stickershop/v1/product/${StrickerPageID}/iphone/stickers@2x.zip`

    var DownloadElement = document.createElement("a")
    DownloadElement.setAttribute("href",downloadLink)
    DownloadElement.setAttribute("download",StrickerTitle.innerText + ".zip")
    DownloadElement.setAttribute("id","download")
    document.body.appendChild(DownloadElement)

    StrickerTitle.addEventListener('click',()=>{
        document.querySelector("a#download").click()
    })

    document.querySelectorAll('li.mdCMN09Li.FnStickerPreviewItem').forEach(ele=>{
    var data = JSON.parse(ele.dataset.preview)
    var element = document.createElement('a');
    var text = document.createTextNode("點我下載")

    element.appendChild(text)
    element.setAttribute('download',data.id+".png");

    if(data.animationUrl)
        element.setAttribute('href', data.animationUrl)
    else
        element.setAttribute('href', data.staticUrl)

    ele.appendChild(element);

    })
})();