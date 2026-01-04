// ==UserScript==
// @name         Columns toggler for boot.dev solutions
// @namespace    https://github.com/DanilShapilov
// @homepage     https://github.com/DanilShapilov/bootdev_solution_cols_toggler
// @version      1.1
// @description  On boot.dev solutions viewer allows you to hide columns and resize sidebar
// @author       Danil Shapilov
// @match        https://www.boot.dev/solution/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542987/Columns%20toggler%20for%20bootdev%20solutions.user.js
// @updateURL https://update.greasyfork.org/scripts/542987/Columns%20toggler%20for%20bootdev%20solutions.meta.js
// ==/UserScript==
/*
Originally by: @luigiMinardi (MIT License)
https://greasyfork.org/en/scripts/542933-hide-show-sidebar-on-boot-dev-solution-pages

*/
// just a quick sctipt, no refactoring
const makeBtn = () => {
    let button = document.createElement("input");

    button.type = "button";


    // Style button to be similar to boot.dev button
    button.style.background = "radial-gradient(circle at center, hsla(0, 0%, 100%, .3), transparent 70%), linear-gradient(to bottom, #c4d1db, #a3b3c7)";
    button.style.borderColor = "#d7dee6";
    button.style.color = "rgb(24 27 38/1)"
    button.style.fontWeight = 600;
    button.style.borderWidth = "1px";
    button.style.borderRadius = "9999px";
    button.style.paddingTop = ".25rem";
    button.style.paddingBottom = ".25rem";
    button.style.paddingLeft = ".5rem";
    button.style.paddingRight = ".5rem";
    button.style.cursor = "pointer"

    return button
}
// left, middle, right cols
const selectors = [
    "#__nuxt > div > div.static-bgimage.bg-image-blue.h-full.w-full.overflow-auto > div > div > div.flex-shrink-1.flex.h-full.w-min.flex-col.overflow-y-auto.border-r.border-gray-400.pt-4",
    ".cm-mergeViewEditors > :first-child",
    ".cm-mergeViewEditors > :last-child"
]

const active = "🙂"
const inactive = "😑"


const intervalId = setInterval(checkIfFullyLoaded, 300)
function checkIfFullyLoaded() {
    const sidebar = document.querySelector(selectors[0])
    if (sidebar == null) {
        // page not loaded fully continue to wait
    } else {
        clearInterval(intervalId)
        doTheThing()
    }
}

function toggleCol(s, btn) {
    let col = document.querySelector(s);
    if (col.style.display !== "none") {
        col.style.display = 'none';
        btn.value = inactive;
    } else {
        col.style.removeProperty("display");
        btn.value = active;
    }
}


function doTheThing() {
    let page = document.getElementById('__nuxt')
    const wrapper = document.createElement("div")
    wrapper.style.position = "fixed"
    wrapper.style.bottom = ".5rem"
    wrapper.style.left = "3rem";
    wrapper.style.display = "flex"
    wrapper.style.gap = ".125rem"
    wrapper.style.transition = ".3s"
    setTimeout(() => {
        wrapper.style.opacity = "0.25"
    }, 1000)

    wrapper.addEventListener("mouseover", (e) => {
        wrapper.style.opacity = "1"
    })
    wrapper.addEventListener("mouseout", (e) => {
        wrapper.style.opacity = "0.25"
    })

    const sideBtn = makeBtn()
    sideBtn.value = "◀️"
    sideBtn.onclick = function () {
        if (sidebar.style.width == "100px") {
            sideBtn.value = "◀️"
            sidebar.style.width = ""
        } else {
            sideBtn.value = "▶️"
            sidebar.style.width = "100px"
        }
    }
    wrapper.appendChild(sideBtn)


    const btns = []
    for (const s of selectors) {
        const btn = makeBtn()
        btn.value = active;
        btn.onclick = function () {
            // if one of cols inactive, toggle them, like only show old/new changes
            const midBtn = btns[1]
            const lastBtn = btns[2]
            const isMidColPressed = this === midBtn
            const isLastColPressed = this === lastBtn
            if (isMidColPressed && midBtn.value == active && lastBtn.value == inactive) {
                toggleCol(selectors[2], lastBtn)
            }
            if (isLastColPressed && lastBtn.value == active && midBtn.value == inactive) {
                toggleCol(selectors[1], midBtn)
            }
            toggleCol(s, btn)


        };
        btns.push(btn)
        wrapper.appendChild(btn)
    }


    const sidebar = document.querySelector(selectors[0])
    // persist state when select file
    sidebar.querySelectorAll("button").forEach(fileBtn => {
        fileBtn.addEventListener("click", (e) => {
            btns.forEach(btn => (btn.value == inactive ? btn.click() : void 0))
        })
    })
    page.appendChild(wrapper)
}