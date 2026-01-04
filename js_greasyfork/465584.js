// ==UserScript==
// @name         blhxjysx
// @namespace    https://github.com/Less01
// @version      0.0.3
// @description  碧蓝幻想救援筛选脚本的简化版，用于手机alook等浏览器
// @author       Less01
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465584/blhxjysx.user.js
// @updateURL https://update.greasyfork.org/scripts/465584/blhxjysx.meta.js
// ==/UserScript==

(function() {
    let opacity = 0.25;
    let playerCount = 5;
    let enemyHp = 50;

    const targetNode = document.querySelector("#wrapper>.contents");
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(
        (mutationsList) => {
            for (let mutation of mutationsList) {
                // mutation.target.id == "prt-search-list"
                if (mutation.target.className == "prt-raid-list") {
                    let raid_list = mutation.target.querySelectorAll(".btn-multi-raid");
                    for (let raid of raid_list) {
                        let count = raid.querySelector(".prt-flees-in").innerText.replace(/\/\d+/, "");
                        let hp = raid.querySelector(".prt-raid-gauge-inner").getAttribute("style").slice(7, -2);
                        if (count >= playerCount || hp <= enemyHp) {
                            raid.style.opacity = opacity;
                        }
                    }
                }
            }
        }
    );

    function run() {
        if (/^#quest\/assist(\/multi\/\d+|\/event)?$/.test(location.hash)) {
            observer.observe(targetNode, config);
        } else {
            observer.disconnect();
        }
    }
    run();
    window.addEventListener('hashchange', run);
})();