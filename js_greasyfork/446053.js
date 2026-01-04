// ==UserScript==
// @name         Blinkist "Today's Free Blink" text scraper
// @description  This script combines the chapter texts into one text.
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @author       scr1ptst3r
// @match        https://www.blinkist.com/de/nc/reader/*
// @match        https://www.blinkist.com/en/nc/reader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blinkist.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/446053/Blinkist%20%22Today%27s%20Free%20Blink%22%20text%20scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/446053/Blinkist%20%22Today%27s%20Free%20Blink%22%20text%20scraper.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function () {
    'use strict';

    let ready1 = false
    let ready2 = false
    let ready3 = false
    let fullText = ""
    let part = 0
    let audioPart = 0
    let distance = 0

    function attachFileLink(contenturl,linktext) {
        const el=document.createElement("span")
        el.style.padding="2px 4px"
        el.style.fontSize="15px"
        el.style.marginTop="1px"
        el.style.width="95px"
        el.style.position="fixed"
        el.style.top=`${distance = distance + 25}px`
        el.style.right="25px"
        el.style.color="#fff"
        el.style.backgroundColor="rgb(108, 117, 125)"
        el.style.textAlign="left"
        el.innerHTML=`<a href="${contenturl}" target="_blank" onclick="this.parentElement.remove()" style="color:#fff" download="${contenturl.includes("blob") ? location.pathname.split('/').pop()+'.txt' : ''}">${linktext}</a>`
        document.body.appendChild(el)

        let t=900
        const timer = setInterval(()=>{
        --t
        if(t===-2){
        clearInterval(timer)
        el.remove()
        }
        },1000)

        console.log("scraper script: attached file link")
    }

    function createTxtUrl(input) {
        return window.URL.createObjectURL(new Blob([input],{type:'text/plain'}))
    }

    function showFullText() {
        if (document.querySelector(".reader-content__next").style.display === "none") {
            if (fullText.trim().length != document.querySelector(".reader-content").innerText.trim().length) {
                console.log(`scraper script: text complete:`)
                fullText = fullText.replace("Mark as finished","").trim().replace(/Beenden$/,"").trim()
                console.log(fullText)
                setTimeout(()=>{
                    attachFileLink(createTxtUrl(fullText),`txt file`)
                    fullText = fullText.replace(/\n/g, "<br>")
                    const blinkistWindow = window.open("", "Blinkist Text", "top=10,left=10,width=900,height=1000")
                    blinkistWindow.document.write(fullText)
                }, 2000)
            }

        } else {
            console.log(`scraper script: jumping to next text segment in 2 seconds`)
            setTimeout(function () {
                document.querySelector(".reader-content__next").click()
            }, 2000)
        }
    }

    function copySegmentText() {
        const segment = document.querySelector(".reader-content").innerText
        fullText += segment + "\n\n"
        console.log(`scraper script: text segment ${++part} added`)

        showFullText()

    }

    function startObserver(el) {
        const targetNode = document.querySelector(el)

        const config = { attributes: true, childList: true, subtree: true }

        const callback = function (mutationList, observer) {

            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {

                    if (document.querySelector(".reader-content") && document.querySelector(".reader-content").innerText.length > 0) {

                        if (!ready2) {
                            ready2 = true
                            console.log("scraper script: text ready")
                            startObserver(".reader-content")
                        }

                        if (!ready3) {
                            ready3 = true
                            copySegmentText()
                            attachFileLink(document.querySelector("[audio-url]").getAttribute("audio-url"),`Audio file ${++audioPart}`)
                        }

                    }

                    //btn
                    if (document.querySelector(".reader-content__next")) {
                        if (!ready1) {
                            ready1 = true
                            console.log("scraper script: button ready")
                            observer.disconnect()
                            document.querySelector(".reader-content__next").addEventListener("click", function () {
                                ready3 = false
                            })
                        }
                    }

                }
            }
        }

        const observer = new MutationObserver(callback)

        observer.observe(targetNode, config)
    }

    startObserver("body")

})();