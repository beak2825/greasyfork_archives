// ==UserScript==
// @name         Iconfont自由复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy paste in the iconfont
// @author       You
// @run-at	     document-end
// @match        https://www.iconfont.cn/*
// @icon data:image/png;base64,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
// @grant    GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463729/Iconfont%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/463729/Iconfont%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

let wait = null
function run() {
    const covers = document.querySelectorAll(".main .icon-cover")
    if (!covers || !covers.length) {
        return
    }
    const checkMark = document.querySelector(".btn-extra")
    if (checkMark) return // page hasn't changed.

    console.log("patch applied")
    const ElCopySvg = '<span title="复制" class="cover-item iconfont cover-item-line icon-fuzhidaima btn-extra"></span>' // icon to copy
    covers.forEach(c=>{
        const el = htmlToElement(ElCopySvg)
        el.addEventListener("click", copySVG);
        c.appendChild(el)
    })
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function copySVG(el) {
    const svg = this.parentElement.parentElement.querySelector(".icon-twrap svg")
    const img = this.parentElement.parentElement.querySelector(".icon-twrap img")
    if (!svg && !img) return
    if (svg) {
        const text = svg.outerHTML;
        GM_setClipboard(text)
    } else {
        //const imgEncoded = getBase64Image(img)
        //console.log(imgEncoded)
        GM_setClipboard(img.src)
    }
    this.classList.remove("icon-fuzhidaima")
    this.classList.add("icon-ok")
    setTimeout(()=>{
        this.classList.remove("icon-ok")
        this.classList.add("icon-fuzhidaima")
    }, 1000);
}

function addCSS(css) {
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
}

function observer(){
    const wrapper = document.querySelector(".wrapper")
    if (!wrapper) {
        setTimeout(observer, 200);
        return
    }
    console.log("observing")
    /// ---------------------------------
    /// mutation observer -monitors the Posts grid for infinite scrolling event-.
    /// ---------------------------------
    const observer1 = new MutationObserver(function(mutations) {
        if (mutations[0].target.classList.contains("icon-cover")) {
            console.log("change ignored")
            return
        }
        wait && clearTimeout(wait)
        wait = setTimeout(run, 200)
        console.log("changed")
    }).observe(document.querySelector('.wrapper'),     // target of the observer
     {
        // attributes: true,
        childList: true,
        subtree: true
        // characterData: true,
    }); // config of the observer
}

(function() {
    'use strict';
    observer();

    const css = `
    .block-icon-list li .icon-cover {
    height: auto;
    }
`
    addCSS(css)
})();