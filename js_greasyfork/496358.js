// ==UserScript==
// @name         Really sympathies
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  Lotti, Punsh
// @author       You
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496358/Really%20sympathies.user.js
// @updateURL https://update.greasyfork.org/scripts/496358/Really%20sympathies.meta.js
// ==/UserScript==

(function() {
    const users = document.querySelectorAll(".userText")

    let html = document.createElement("div")

    users.forEach(user => {
        let link = user.querySelector("span a.username")

        fetch(`https://lolz.live/${link.getAttribute("href")}`).then(resul => resul.text().then(htmlText => {
            let noReaction = 0

            html.innerHTML = htmlText

            let reaction = Number(html.querySelector(".count").textContent.replace(" ", ""))

            fetch(`https://lolz.live/${link.getAttribute("href")}likes?type=gotten&content_type=post&stats=1`).then(resul => {
                resul.text().then(htmlText => {
                    html.innerHTML = htmlText

                    let allReaction = html.querySelectorAll(".node ")

                    allReaction.forEach(el => {
                        if (el.querySelector(".muted").textContent.toLowerCase().indexOf("розыгрыш") !== -1) {
                            noReaction += Number(el.querySelector(".counter").textContent.replace(" ", ""))
                        }
                    })

                    const element = `<i class="userCounterIcon fas fa-heart"></i>${reaction - noReaction}`
                    if (user.querySelector(".userCounters span")) {
                        user.querySelector(".userCounters span").innerHTML = element
                    } else {
                        user.insertAdjacentHTML("beforeend", `<span class="userCounter item muted">${element}</span>`)
                    }
                })
            })
        }))
    })

    const observ = new MutationObserver(obser => {
        const window = `<div style="position: absolute; left: -999999px; top: -999999px; width: 100px; height: 100px; overflow: scroll;"><div style="height: 200px; width: 100%;"></div></div>`

        const reaction = document.querySelectorAll(".memberCardInner")

        if (obser[0].addedNodes[0]) {
            if (obser[0].addedNodes[0].outerHTML == window) {
                let link = reaction[reaction.length - 1].querySelector(".username.NoOverlay").getAttribute("href")
                let noReaction = 0

                fetch(`https://lolz.live/${link}likes?type=gotten&content_type=post&stats=1`).then(resul => {
                    resul.text().then(htmlText => {
                        html.innerHTML = htmlText

                        let allReaction = html.querySelectorAll(".node ")

                        allReaction.forEach(el => {
                            if (el.querySelector(".muted").textContent.toLowerCase().indexOf("розыгрыш") !== -1) {
                                noReaction += Number(el.querySelector(".counter").textContent.replace(" ", ""))
                            }
                        })

                        const element = `<i class="counterIcon likeCounterIcon"></i>${Number(reaction[reaction.length - 1].querySelector("a.counter").textContent.replace(" ", "")) - noReaction}`
                        reaction[reaction.length - 1].querySelector("a.counter").innerHTML = element
                    })
                })
            }
        }
    })

    observ.observe(document.body, {
        childList: true,
        subtree: false
    })
})();