// ==UserScript==
// @name         Free Logo Design Utils
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Little utils for free logo design
// @author       EpicOreo
// @license      GNU GPLv3
// @match        https://logo-maker.freelogodesign.org/en/logo/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freelogodesign.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471544/Free%20Logo%20Design%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/471544/Free%20Logo%20Design%20Utils.meta.js
// ==/UserScript==

function openSVG(svg) {
  const as_text = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([as_text], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const win = open(url);
  win.onload = (evt) => URL.revokeObjectURL(url);
}


(function() {
    'use strict';
    setTimeout(()=>{
        console.log("START!")
        let logo = null;
        let svgs = document.getElementsByTagName("svg");
        for (let i in [...Array(svgs.length-1).keys()]){
            if (svgs[i].style.width === "100%" && svgs[i].style.backgroundRepeat == "repeat"){
                svgs[i].remove()
            } else if (svgs[i].width.baseVal.value === 512 && svgs[i].height.baseVal.value === 512 && svgs[i].style.overflow == "visible") {
                logo = svgs[i]
            }
        }
        // fl-menubar-section
        const flMenuBarSection = document.getElementsByClassName("fl-menubar-section")[0]
        const downloadSVGButton = document.createElement("button")
        downloadSVGButton.addEventListener("click", ()=>{
            if (logo != 0) {
                let w = prompt("Width in px (default 512px)")
                let h = prompt("Height in px (default 512px)")
                const newSVG = logo.cloneNode(true);
                if (w) {newSVG.width.baseVal.value = w}
                if (h) {newSVG.height.baseVal.value = h}                
                if (confirm("Do you want to open? (Ctrl+S / CMD+S to save)")){
                    openSVG(newSVG)
                }
            } else{
                alert("Logo Not Found!")
            }
        })
        downloadSVGButton.classList = "fl-button fl-button-icon fl-button-primary"
        downloadSVGButton.innerText = "Download SVG"
        flMenuBarSection.appendChild(downloadSVGButton);
    }, 100)
    // Your code here...
})();