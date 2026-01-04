// ==UserScript==
// @name           Anti [ AdBlock Detector ]
// @name:ru        Анти [ Обнаружитель AdBlock-а ]
// @namespace      -
// @version        0.3
// @description    Today I saw a window asking me to disable AdBlock ._. If you also have a problem with this, then you can use this script
// @description:ru Сегодня я увидел окно с просьбой отключить AdBlock ._. Если у вас также есть проблема с этим, то вы можете использовать этот скрипт
// @author         Nudo#7346
// @match          *://moomoo.io/*
// @match          *://*.moomoo.io/*
// @match          *://*.io/*
// @icon           https://moomoo.io/img/favicon.png?v=1
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/454462/Anti%20%5B%20AdBlock%20Detector%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/454462/Anti%20%5B%20AdBlock%20Detector%20%5D.meta.js
// ==/UserScript==

(function() {
    const detected = {
        active: false,
        element: null
    }

    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!node.classList) {
                    continue
                }

                let allElements = Object.values(document.querySelectorAll("*"))

                allElements = allElements.filter((element) => element.classList.value.length && element.tagName === "DIV")

                for (const element of allElements) {
                    if (!element.textContent.match(/Support\sFree\s\w+/)) {
                        continue
                    }

                    detected.active = true
                    detected.element = element

                    observer.disconnect()

                    break
                }
            }
        }
    })

    const interval = setInterval(() => {
        if (!detected.active) return void 0

        if (detected.element.style.visibility === "hidden") return void 0

        detected.element.remove()

        console.log("Anti [ AdBlock Detector ]::success", detected.element)

        clearInterval(interval)
    })

    observer.observe(document, {childList: true, subtree: true})

    setTimeout(() => {
        observer.disconnect()
    }, 30000)
})()