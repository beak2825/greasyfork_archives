// ==UserScript==
// @name         BAC Alliance template
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BAC for r/place
// @author       Midokuni
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442713/BAC%20Alliance%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/442713/BAC%20Alliance%20template.meta.js
// ==/UserScript==

// Only need to change this for adding/removing/changing templates
// Each {} set is 1 blueprint. 
// image = url to the image of the blueprint
// label = nothing, just something descriptive
// pos = Position of the top left pixel of the blueprint. [x, y]
//                                                  |
// size = Size of the blueprint [width ----, height | ]
//                                                  |
// opacity = set this to 1. to change only on emergency.
let data = [
    // No need to update image url for BLUE ARCHIVE. 
    // Just update pos/size if needed
    // Updates to the images are to be done in the github repository.
    {
        image: "https://raw.githubusercontent.com/Midokuni/rplace/main/img/arona-b3.png",
        label: "Blue Archive Base 3 - Arona + Shiroko",
        pos: [1621, 441],
        size: [90/3, 139/3],
        opacity: 1,
    },
    {
        image: "https://raw.githubusercontent.com/Midokuni/rplace/main/img/hifu-b1fix.png",
        label: "Blue Archive Base 1 - Hifumi + Forkbot",
        pos: [136, 963],
        size: [162/3, 156/3],
        opacity: 1,
    },
    // The following two use pos = 0,0 and size = 1000,1000 because they are images that cover the entire canvas 
    // (well entire canvas before expansion that is)
    // From what I noticed these are what most people are using.
    {
        image: "https://cdn.discordapp.com/attachments/959631989168824332/960458070784376912/tempsheetoratsiIva.png",
        label: "Jerma Sus",
        pos: [0, 0],
        size: [1000, 1000],
        opacity: 1,
    },
    {
        image: "https://www.dropbox.com/s/jr4crnn654mjxwz/overlay.png?raw=1",
        label: "Gacha Alliance",
        pos: [0,0],
        size: [2000,2000],
        opacity: 1,
    },
    {
        image: "https://raw.githubusercontent.com/Midokuni/rplace/main/img/miyu-nb1.png",
        label: "Blue Archive Miyu",
        pos: [16, 944],
        size: [138/3, 144/3],
        opacity: 1
    }
]

if (window.top !== window.self) {
    window.addEventListener('load', () => {
        for(let d of data) {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = d.image;
                i.style = `position: absolute; opacity: ${d.opacity};left: ${d.pos[0]}px;top: ${d.pos[1]}px;image-rendering: pixelated;width: ${d.size[0]}px;height: ${d.size[1]}px;`;
                console.log(d.label, i);
                return i;
            })());
        }
    }, false);
}