// ==UserScript==
// @name         PonkSmoke
// @namespace    f
// @version      4.2.1
// @description  try to take over r/place!
// @author       cum
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442693/PonkSmoke.user.js
// @updateURL https://update.greasyfork.org/scripts/442693/PonkSmoke.meta.js
// ==/UserScript==

function makeOverlay(id, url, width, height, x, y) {
    x *= 50;
    y *= 50;
    width *= 50;
    height *= 50;
    const div = document.createElement("div");
    div.className = "Template";
    div.id = id;
    div.style = `height:${height}px; width:${width}px; position: absolute; inset: 0px; transform: translateX(${x}px) translateY(${y}px); background-size: cover; image-rendering: pixelated; background-image: url('${url}'); opacity: 0.3;`;
    document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-camera")[0].shadowRoot.children[0].children[0].children[0].appendChild(div);
}

if (window.top !== window.self) {
    window.addEventListener('load', () => {
        makeOverlay("poke",     "https://i.imgur.com/Xj96Ywl.png",     48, 48, 1646, 1074);

        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByClassName("bottom-controls")[0].appendChild(
        (function () {
            const slider = document.createElement("div");
            slider.style = "height: 36px; width: 200px; position: absolute;  right: 100px; top: 0;  background-color: #FFF;pointer-events: all;border-radius: 26px;";
            const input = document.createElement("input");
            input.type = 'range';
            input.min = '0';
            input.max = '1';
            input.step = '0.1';
            input.value = '0.3';
            input.style = "margin: 10px;left: 0;right: 0;top: 0;bottom: 0;box-sizing: border-box;position: absolute;";
            input.addEventListener('input', (event) => {
                document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-camera")[0].shadowRoot.children[0].children[0].children[0].querySelectorAll(".Template").forEach(element => {element.style.opacity = event.currentTarget.value});
            });
            slider.appendChild(input);
            return slider;
        })()
        );

        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByClassName("bottom-controls")[0].appendChild(
        (function () {
            const toggle = document.createElement("div");
            toggle.style = "height: 36px; width: 100px; position: absolute;  right: 350px; top: 0;  background-color: #FFF;pointer-events: all;border-radius: 26px; display: flex; justify-content: space-around; align-items: center;";
            const input = document.createElement("input");
            input.type = 'checkbox';
            input.name = "toggle";
            input.addEventListener('click', (event) => {
                console.log(event.currentTarget.checked);
                document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-camera")[0].shadowRoot.children[0].children[0].children[0].querySelectorAll(".Template").forEach(element => {
                    if (event.currentTarget.checked) {
                        element.style["-webkit-mask-image"] = `url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/sun.svg")`;
                        element.style["-webkit-mask-repeat"] = "repeat";
                        element.style["-webkit-mask-size"] = "50px";
                    } else {
                        element.style["-webkit-mask-image"] = null;
                        element.style["-webkit-mask-repeat"] = null;
                        element.style["-webkit-mask-size"] = null;
                    }
                });
            });
            const label = document.createElement("label");
            label.style = "color: black;";
            label.innerHTML = "Toggle dot";
            label.for = "toggle";
            toggle.appendChild(input);
            toggle.appendChild(label);
            return toggle;
        })()
        );

    }, false);
}