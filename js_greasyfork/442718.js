    // ==UserScript==
    // @name         peekabu v2
    // @namespace    http://tampermonkey.net/
    // @version      1.0.1
    // @description  private
    // @author       u/ny00m
    // @match        https://hot-potato.reddit.com/embed*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
    // @license      GPLv3
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442718/peekabu%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/442718/peekabu%20v2.meta.js
    // ==/UserScript==
    if (window.top !== window.self) {
        window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
                (function () {
                    const i = document.createElement("img");
                    i.src = "https://i.imgur.com/dfC5cUM.png";
                    i.onload = () => {
                        if (i.width === i.height) {
                            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
                        } else {
                            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
                        }
                    };
                    return i;
                })())
        }, false);
    }