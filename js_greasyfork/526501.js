// ==UserScript==
// @name         Javgg auto click
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  javgg.net auto click when ad page to download
// @match        https://javgg.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javgg.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526501/Javgg%20auto%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/526501/Javgg%20auto%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // auto click to skip adds
    const clickButton = () => {
        const button =
              document.querySelector("#AD_160")
        if (button) button.click()
        else setTimeout(clickButton, 500)
        console.log(button)
    }
    window.addEventListener("DOMcontentloaded", clickButton())
    //replace blockec button by normal download button
    const nodes = [...document.querySelectorAll(".btndll")];
    nodes.forEach(node=>{
        var link = document.createElement('a');
        link.id = 'link1';
        link.href =node.href;
        link.innerHTML = node.innerHTML
        node.parentNode.insertBefore(link, node);
        node.parentNode.removeChild(node);
    })
})();