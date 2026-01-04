// ==UserScript==
// @name         我們的浮游城 顯示原始數值
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  display raw stats
// @author       Cryon
// @include      https://ourfloatingcastle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422824/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E9%A1%AF%E7%A4%BA%E5%8E%9F%E5%A7%8B%E6%95%B8%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/422824/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E9%A1%AF%E7%A4%BA%E5%8E%9F%E5%A7%8B%E6%95%B8%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    let rarity = {
        "傳說": 2.6,
        "神話": 2.2,
        "史詩": 2.0,
        "頂級": 1.7,
        "精良": 1.4,
        "上等": 1.2,
        "普通": 1.0,
        "次等": 0.85,
        "劣質": 0.7,
        "垃圾般": 0.3,
    }


    function init() {
        // console.log("test")
    }

    function update() {
        let stats = {}
        let section = document.querySelector("section")
        if(section != null) {
            stats.atk = section.getElementsByClassName("css-1ogakd7").item(0)
        }
        if(stats.atk == null || stats.atk.lastChild.data.endsWith(")")) {
            return;
        }

        stats.def = stats.atk.nextSibling
        stats.mine = stats.def.nextSibling
        stats.dur = stats.mine.nextSibling

        let quality = stats.atk.previousSibling
        if(!quality.firstChild.data.startsWith("品質")) {
            stats.recycle = quality
            quality = quality.previousSibling
        } else {
            stats.recycle = document.createElement("div")
            stats.recycle.classList.add("css-0")
            stats.recycle.appendChild(document.createTextNode("回收價："))

            let price = 0.0
            for(let key in stats) {
                if(stats.hasOwnProperty(key) && key != "recycle") {
                    price += stats[key].lastChild.data * (key == "dur" ? 0.32 : 0.4)
                }
            }
            stats.recycle.appendChild(document.createTextNode(price.toFixed(0)))

            stats.atk.parentNode.insertBefore(stats.recycle, stats.atk)
        }

        let rarityMultiplier = rarity[quality.lastChild.data]
        // console.log(rarityMultiplier)

        for(let key in stats) {
            if(stats.hasOwnProperty(key)) {
                stats[key].appendChild(document.createTextNode(" (" + (stats[key].lastChild.data / rarityMultiplier).toFixed(2) + ")"))
                // console.log(key, stats[key])
            }
        }


    }

    init();

    //setTimeout(init,1000);
    setInterval(update,500);
})();