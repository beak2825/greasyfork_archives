// ==UserScript==
// @name         [UNITOSHKA] - LastThreads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Знай какие последние темы ты посетил!
// @author       Unitoshka.fun
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481702/%5BUNITOSHKA%5D%20-%20LastThreads.user.js
// @updateURL https://update.greasyfork.org/scripts/481702/%5BUNITOSHKA%5D%20-%20LastThreads.meta.js
// ==/UserScript==

(async function() {
    var path = window.location.pathname;
    //await GM.setValue("threads", null);
    //await GM.setValue("threads_url", null);

    if (window.location.pathname === '/') {
        const threads = JSON.parse(await GM.getValue("threads"))
        const threads_url = JSON.parse(await GM.getValue("threads_url"))

        console.log(threads)

        const header = document.querySelector("#header")
        const breadbox = document.querySelector(".breadBoxTop ")

        breadbox.style = "margin: 0em auto 0.75em;"

        const themes_div = document.createElement("div")
        themes_div.style = "width: 100%; height: 20px; padding-left: 80px; padding-right: 80px; box-sizing: border-box; display: flex; justify-content: center; align-content: center; margin-top: 10px; gap: 45px;"

        for (var thread_ in threads) {
            var titleThread
            const thread = document.createElement("a")
            thread.href = threads_url[thread_]

            if(threads[thread_].length >= 61) {
                titleThread = minify(threads[thread_], 61)
            } else {
                titleThread = threads[thread_]
            }

            thread.textContent = titleThread
            thread.style = "font-weight: 450; font-size: 15px;"
            themes_div.append(thread)
        }

        header.parentNode.insertBefore(themes_div, header.nextSibling);
    }

    if (window.location.pathname.includes("threads")) {
        var list_threads = []
        var urls_threads = []

        const threads = await GM.getValue("threads")
        const threads_url = await GM.getValue("threads_url")

        const titleBar = document.querySelector(".titleBar").querySelector("h1").title

        if (threads !== null && threads_url !== null) {
            list_threads = threads
            urls_threads = threads_url

            const list = JSON.parse(list_threads)
            const list_urls = JSON.parse(urls_threads)
            console.log(list_threads)

            if (list_threads.includes(titleBar) === false) {
                if(list.length <= 3) {
                    list.unshift(titleBar)
                    list_urls.unshift(window.location.href)
                } else if(list.length >= 4) {
                    list.pop()
                    list_urls.pop()
                    list_urls.unshift(window.location.href)
                    list.unshift(titleBar)
                }
            }

            await GM.setValue("threads", JSON.stringify(list));
            await GM.setValue("threads_url", JSON.stringify(list_urls));
        } else {
            list_threads.push(titleBar)
            urls_threads.push(window.location.href)
            await GM.setValue("threads", JSON.stringify(list_threads));
            await GM.setValue("threads_url", JSON.stringify(urls_threads));
        }
    }
})();

function minify(text, length) {
    return text.substring(0, length) + '...';
}