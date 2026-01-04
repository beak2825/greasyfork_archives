// ==UserScript==
// @name         Add face button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds the ability to render faces on brick hill
// @author       MixaMega
// @match        https://*.brick-hill.com/shop/create
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brick-hill.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444061/Add%20face%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/444061/Add%20face%20button.meta.js
// ==/UserScript==

(function init() {
    function main(){
        var pants = document.querySelector("option[value='pants']")
        var face = pants.cloneNode(true)
        face.textContent = "Face"
        face.attributes.value.value = "face"
        pants.parentNode.append(face)
    }
    var target = document.querySelector("option[value='pants']")
    if (target) {
        console.log('Target already exists')
        return main()
    }


    const observer = new MutationObserver(() => {
        if (document.contains(document.querySelector("option[value='pants']"))) {
            observer.disconnect()
            return main()
        }
    })

    observer.observe(document, {
        childList: true,
        subtree: true,
    })
})()