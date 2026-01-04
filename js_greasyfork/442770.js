// ==UserScript==
// @name         r/PlaceBigTemplate
// @namespace    https://www.reddit.com/r/Place/
// @version      1.0.4
// @description  Place template script
// @author       r/Place
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442770/rPlaceBigTemplate.user.js
// @updateURL https://update.greasyfork.org/scripts/442770/rPlaceBigTemplate.meta.js
// ==/UserScript==

const placeTemplateUrl = "https://drive.google.com/uc?export=download&id=1Wmyr9xqhqmLZ_12VtMa8BxK0ouKn1BkD";
const placeTemplateWidth = "2000px";
const placeTemplateHeight = "2000px";
const placeTemplateX = "0px";
const placeTemplateY = "0px";

if (window.top !== window.self) {
    window.addEventListener('load', () => {
			document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = placeTemplateUrl;
            i.style = "position: absolute;left: "+placeTemplateX+";top: "+placeTemplateY+";image-rendering: pixelated;width: "+placeTemplateWidth+";height: "+placeTemplateHeight+";";
            i.id = "template";
            console.log(i);
            return i;
        })());
    }, false);
}