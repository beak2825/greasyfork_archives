// ==UserScript==
// @name         50 Plus Crossword Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Helper for https://www.50plus.de/spiele/raetsel/kreuzwortraetsel-*.html
// @author       You
// @match        https://www.50plus.de/spiele/raetsel/kreuzwortraetsel-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50plus.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492016/50%20Plus%20Crossword%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492016/50%20Plus%20Crossword%20Helper.meta.js
// ==/UserScript==


(function() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function send_input(character) {
        let e = new Event("keydown");
        e.which = character;
        document.dispatchEvent(e);
    }

    async function solve_selected_items(blocks, delay) {
        for (let block of blocks.children) {
            if (block.className.startsWith("selected")) {
                if (block.dataset.default !== "") {
                    send_input(block.dataset.default.charCodeAt());
                    await sleep(delay);
                }

            }
        }
    }

    const wait = setInterval(() => {
        let blocks = document.querySelector("#dsgame > kwr > div.sd-kwr-bg");
        if (blocks !== undefined) {
            console.log("[Helper] Preparing");
            clearInterval(wait);
            jQuery("iblock").bind("mousedown", async (event) => {
                if (event.which !== 2) { // only middle click
                    return
                }

                const elem_index = parseInt(event.currentTarget.dataset.x) + 12*parseInt(event.currentTarget.dataset.y) + 1
                const elem = blocks.querySelector(`block:nth-child(${elem_index})`);

                if (elem.dataset.default === "") { // Description
                    await solve_selected_items(blocks, 100);

                } else { // Character field
                    send_input(elem.dataset.default.charCodeAt());
                    document.querySelector(`#dsgame > kwr > div.sd-kwr-input > iblock:nth-child(${elem_index})`).dispatchEvent(new Event("mousedown"))
                }
            });

            const btn = document.createElement("button");
            btn.textContent = "Solve All";
            btn.onclick = () => {
                const inputs = document.querySelector("#dsgame > kwr > div.sd-kwr-input").childNodes;
                (async () => {
                    for (let i = 0; i < inputs.length; i++) {
                        if (blocks.childNodes[i].dataset.default !== "") {
                            inputs[i].dispatchEvent(new MouseEvent("mousedown", {
                                button: 1
                            }))
                            await sleep(20);

                        }
                    }
                })();
            }
            document.querySelector("#dsgame").appendChild(btn);
            console.log("[Helper] Done");

        }
    }, 1000)
    })();