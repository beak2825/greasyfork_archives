// ==UserScript==
// @name         Youtube Subscriptions Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add features and general improvements to YouTube Subscriptions page.
// @author       Rubén Pardo
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462329/Youtube%20Subscriptions%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/462329/Youtube%20Subscriptions%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
     setInterval(main, 1000);
})();

const categories = {
    "News": [
        "Negocios TV",
        "Catalan News",
        "Russell Brand",
        "The Duran",
        "Weeb Union",
        "Military Summary",
        "Gregory Mannarino",
        "Jose Luis Cava",
        "HistoryLegends",
        "Stoic Finance",
        "Patrick Boyle",
        "Vox",
        "Michael Cowan",
        "The Plain Bagel",
        "Trabajar Desde Casa",
        "Cosas Militares",
        "Defense Politics Asia",
        "Arte de invertir",
        "Firstpost",
        "Marc Vidal",
        "Redacted",
        "Emil Cosman",
        "Steven Van Metre",
        "Zeihan on Geopolitics",
        "Judge Napolitano - Judging Freedom",
        "Alexander Mercouris",
        "TOP DE IMPACTO"
    ],
    "Music": [
        "Tartalo Music",
        "Audio Library — Music for content creators",
        "ThePrimeThanatos",
        "ThePrimeCronus",
        "Brandon Fiechter's Music",
        "Michael Ghelfi Studios",
        "Antti Martikainen Music",
        "Peter Crowley's Fantasy Dream",
        "MrEpicOSTs",
        "The Enigma TNG",
        "Epic Music Empire",
        "BrunuhVille",
        "Derek Fiechter's Music",
        "HDSounDI",
        "Two Steps From Hell",
        "Adrian von Ziegler",
        "Instrumental Core",
        "BausicProductions"
    ],
    "Coding": [
        "Dave's Garage",
        "ArjanCodes",
        "Marques Brownlee",
        "NVIDIA Developer",
        "Continuous Delivery",
        "StatQuest with Josh Starmer",
        "Platzi",
        "mCoding",
        "Traversy Media"
    ],
    "Science": [
        "Steve Brunton",
        "Seeker",
        "Journey to the Microcosmos",
        "Arvin Ash",
        "Dr. Trefor Bazett",
        "Two Minute Papers",
        "Dot CSV",
        "CrashCourse",
        "Quanta Magazine",
        "sentdex",
        "3Blue1Brown",
        "The Thought Emporium",
        "Zach Star"
    ],
    "Japanese": [
        "Learn Japanese with JapanesePod101.com",
        "Learn Japanese From Zero!",
        "日本語の森"
    ],
    "Misc": [
        "Good Mythical Morning",
        "Eli the Computer Guy",
        "Mr.Puzzle",
        "Shadiversity",
        "GDC",
        "thejuicemedia",
        "LastWeekTonight",
        "Zach Star"
    ]
}

function extractAsStrList(elmList) {
    let l = []
    for(const elm of elmList) {
        l.push(elm.textContent.trim())
    }
    return l
}

function extractAsTime(re) {
    const [n, q] = re?.slice(1) ?? [0, ""]
    if (q == "minut" || q == "minuts") return parseInt(n);
    if (q == "hora" || q == "hores") return 60 * parseInt(n);
    if (q == "dia" || q == "dies") return 60 * 24 * parseInt(n);
    if (q == "setmana" || q == "setmanes") return 60 * 24 * 7 * parseInt(n);
    if (q == "mes" || q == "mesos") return 60 * 24 * 30 * parseInt(n);
    return 0;
}

function extractAsNum(re) {
    const [xn, xq] = re?.slice(1) ?? ["0", ""]
    const [n, q] = [parseFloat(xn.replace(",", ".")), xq.trim()]
    if (q == "" ) return n;
    if (q == "k") return 1000 * n;
    if (q == "M") return 1000 * 1000 * n;
    return 0;
}

function extract() {
    let items = []
    for (const item of document.querySelectorAll(`div#contents div#items ytd-grid-video-renderer`)) {
        const metaElement = item.querySelector(`div#details div#metadata`)
        const channelName = metaElement.querySelector(`ytd-channel-name div#text-container`).textContent.trim()
        const metaline = extractAsStrList(metaElement.querySelectorAll(`div#metadata-line span`)) ?? [""]
        const meta = {
            channelName,
            spectators: extractAsNum(metaline[0].match(/([\d,]+)(.*)espectadors$/)),
            views: extractAsNum(metaline[0].match(/([\d,]+)(.*)visualitzacions$/)),
            ago: extractAsTime((metaline[1] ?? "").match(/fa (\d+) (minuts|minut|hora|hores|dia|dies|setmana|setmanes|mes|mesos)/))
        }
        items.push({element: item, ...meta})
    }
    return items
}

function slice(items, window = 720) {
    let slices = []
    for (const item of items) {
        const i = Math.floor(item.ago / window)
        slices[i] = [...(slices[i] ?? []), item]
    }
    return slices
}

function groupBy(items, by = "channelName") {
    let groups = {}
    for (const item of items) {
        const key = item[by]
        groups[key] = [...(groups[key] ?? []), item]
    }
    return Object.values(groups)
}

function priority(item) {
    return (item.views + item.spectators*16) / item.ago
}

function trim(slices, max = 6, window = 720) {
    for (const slice of slices) {
        if (!slice || !slice[0]) continue
        const n = max * (Math.floor(slice[0].ago / 1440) + 1)
        for (const group of groupBy(slice ?? [])) {
            const items = group.sort((a, b) => priority(a) < priority(b)).slice(n) ?? []
            for (const item of items) {
                //console.log(item.element)
                item.element.remove()
                //item.element.style.backgroundColor = "rgba(130,130,100,0.5)"
            }
        }
    }
}

function attach(element, child) {
    element.appendChild(child)
}

let selection = "All"
function createButton(name, action = e => {selection = e.target.name}) {
    const e = document.createElement("button")
    e.style.border = "None"
    e.style.margin = "3px"
    e.style.borderRadius = "5px"
    e.style.padding = "5px"
    e.style.backgroundColor = "rgba(100, 100, 100, 0.4)"
    e.style.color = "rgb(220, 220, 220)"
    e.name = name
    e.innerHTML = name
    e.onclick = action
    e.onmouseover = () => { e.style.backgroundColor = "rgba(180, 180, 180, 0.4)"; e.style.cursor = "pointer" }
    e.onmouseleave = () => { e.style.backgroundColor = "rgba(100, 100, 100, 0.4)"; e.style.cursor = "default" }
    return e
}

function createMenu() {
    const existingMenu = document.querySelector(`div#the-menu-123`)
    if (existingMenu) {
        //existingMenu.remove()
        return
    }

    const header = document.querySelector(`ytd-page-manager ytd-browse div#header`)
    const menu = document.createElement("div")
    menu.id = "the-menu-123"

    attach(menu, createButton("All"))
    for (const category of Object.keys(categories)) {
        attach(menu, createButton(category))
    }
    attach(menu, createButton("Rest"))
    header.appendChild(menu)
}


function filterByCategory(items) {
    const channels = categories[selection] ?? []
    for (const item of items) {
        if (selection == "Rest") {
            const listedChannels = Object.values(categories).flat()
            item.element.style.display = listedChannels.find(x => x == item.channelName) ? "None" : ""
        } else if (selection == "All" || channels.find(x => x == item.channelName)) {
            item.element.style.display = ""
        } else {
            item.element.style.display = "None"
        }
    }
}

function stylize(items) {
    const frame = document.querySelector(`ytd-page-manager ytd-browse ytd-two-column-browse-results-renderer[page-subtype="subscriptions"]`)
    frame.classList.remove("grid-5-columns")
    frame.style.width = "100%"
    for (const item of items) {
        item.element.style.width = "274px"
        const thumbail = item.element.querySelector(`ytd-thumbnail`)
        thumbail.style.width = "274px"
        thumbail.style.height = "154px"
    }
}

function main() {
    if (!window.location.href.startsWith("https://www.youtube.com/feed/subscriptions")) return
    createMenu()
    const items = extract()
    stylize(items)
    filterByCategory(items)
    trim(slice(items))
}