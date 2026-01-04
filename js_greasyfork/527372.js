// ==UserScript==
// @name         Nova Hill Better Pages
// @version      0.1
// @description  This script allows you to enter a page number in user crates.
// @author       fajay
// @match        https://nova-hill.com/user/*
// @match        https://nova-hill.com/customize/
// @icon         https://www.google.com/s2/favicons?domain=nova-hill.com
// @grant        none
// @run-at document-end
// @namespace nova
// @downloadURL https://update.greasyfork.org/scripts/527372/Nova%20Hill%20Better%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/527372/Nova%20Hill%20Better%20Pages.meta.js
// ==/UserScript==

// Sorry about the api............

let pages = null

let interval = setInterval(() => {
    let pages = location.href.startsWith("https://nova-hill.com/user/") ? document.querySelector("#crate-v .center-text") : document.querySelector(".page-holder")
    if (!pages) return

    clearInterval(interval)

    function hook() {
        pages.children[1].addEventListener("click", () => {
            let pageNum = pages.children[1]
            let pageInput = document.createElement("input")
            pageInput.type = "number"
            pageInput.value = pageNum.value
            pages.insertBefore(pageInput, pageNum)
            pageNum.style.display = "none"
            pageInput.focus()

            pageInput.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    pageInput.blur()
                }
            });

            pageInput.addEventListener("blur", () => {
                // navigation time
                let currentPage = parseInt(pageNum.innerText)
                let targetPage = parseInt(pageInput.value)
                let previousPage = -1

                pageInput.remove()
                pageNum.style.display = ""

                let interval = setInterval(() => {
                    pageNum = pages.children[1]
                    currentPage = parseInt(pageNum.innerText)
                    console.log(currentPage, targetPage)
                    if (previousPage == currentPage) return
                    if (targetPage == currentPage || (pages.children[0].disabled && targetPage < currentPage) || (pages.children[2].disabled && targetPage > currentPage)) {
                        clearInterval(interval)
                        if (location.href.startsWith("https://nova-hill.com/customize")) {
                            hook() 
                        }
                        return
                    } else if (targetPage < currentPage) {
                        pages.children[0].click()
                    } else {
                        pages.children[2].click()
                    }
                    previousPage = currentPage
                }, 250)
            })
        })
    }

    hook()
}, 1000)