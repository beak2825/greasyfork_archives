// ==UserScript==
// @name         Brick Hill True Value
// @version      0.2
// @description  Replaces average values with brick hill trade values in the trade tab.
// @author       Noah Cool Boy
// @match        https://www.brick-hill.com/trades
// @match        https://www.brick-hill.com/trades/
// @icon         https://www.google.com/s2/favicons?domain=brick-hill.com
// @namespace https://greasyfork.org/users/725966
// @downloadURL https://update.greasyfork.org/scripts/437582/Brick%20Hill%20True%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/437582/Brick%20Hill%20True%20Value.meta.js
// ==/UserScript==

(function () {

    let api = "https://brick-hill.trade/v1/api/extension/item/"
    let cache = {}
    let queue = []
    let busy = false
    let observer = new MutationObserver(refreshValues)

    function getItems() {
        let items = [...document.querySelectorAll(".item-card-tile")]
        return items.map(item => {
            return {
                avg: item.querySelector(".light-gray-text"),
                value: item.querySelector("span:last-child"),
                itemId: parseInt(item.querySelector("a").href.match(/\d+/)),
                item: item
            }
        })
    }

    function getValue() {
        if (queue.length == 0) {
             busy = false
            doTotal()


            return
        }

        let item = queue.shift()
        console.log(cache)
        if(cache[item.itemId]) {
            item.avg.innerText = "Val."
            item.value.innerText = cache[item.itemId]
            getValue()
            return
        }

        let xhr = new XMLHttpRequest()
        xhr.open("GET", api + item.itemId)
        xhr.responseType = "json"
        xhr.onload = function () {
            console.log("Requesting value for: " + xhr.response.item.value)
            if (xhr.response.status == "success") {
                item.avg.innerText = "Val."
                item.value.innerText = xhr.response.item.value
                cache[item.itemId] = xhr.response.item.value
            }
            getValue()
        }
        xhr.send()
    }

    function doTotal() {
        let items = getItems()
        let side1 = items.filter(v => document.querySelector("#viewtrades-v > .col-2-3 > div > :nth-child(2)").contains(v.avg))
        let side2 = items.filter(v => document.querySelector("#viewtrades-v > .col-2-3 > div > :nth-child(4)").contains(v.avg))
        document.querySelectorAll(".smedium-text")[0].innerText = "Total Value: " + side1.reduce((acc, cur) => acc + cache[cur.itemId], 0)
        document.querySelectorAll(".smedium-text")[1].innerText = "Total Value: " + side2.reduce((acc, cur) => acc + cache[cur.itemId], 0)

        observer.observe(document.querySelector("#viewtrades-v > .col-2-3"), {childList: true, subtree:true})
    }

    function refreshValues() {
            if (!busy) {
                busy = true
                queue = getItems()
                observer.disconnect();
                getValue()
            }
    }

    let a = setInterval(() => {
        if(!document.querySelector("#viewtrades-v > .col-2-3")) return
        clearInterval(a);
        observer.observe(document.querySelector("#viewtrades-v > .col-2-3"), {childList: true, subtree:true})
    }, 100)
})()



