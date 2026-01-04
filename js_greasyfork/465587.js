// ==UserScript==
// @name         Grundo's Café stamp album helper
// @namespace    github.com/windupbird144
// @version      0.5
// @description  Extend features of the stamp album on Grundo's Café
// @author       supercow64, eleven
// @match        https://www.grundos.cafe/stamps/album/?page_id=*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465587/Grundo%27s%20Caf%C3%A9%20stamp%20album%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/465587/Grundo%27s%20Caf%C3%A9%20stamp%20album%20helper.meta.js
// ==/UserScript==

const prefix = "https://grundoscafe.b-cdn.net/items"

function removePrefix(url) {
    return url.replace(prefix, "")
}

(function () {
    'use strict';

    // Fetch the database of stamps remotely. We expect the host of the external resource to manage
    // the E-Tag header, use no-cache to only reload the resource if it has been update.
    //
    // The entry stamp_database in localStorage overwrites the default resource.
    // This is useful for testing. You can upload an experimental database to e.g. Github Gists,
    // write the link into localStorage and work with your development version
    fetch(localStorage.getItem("stamp_database") ?? "https://raw.githubusercontent.com/rowanberryyyy/gc-stamp-album-helper/main/stamps.json", { cache: "no-cache" })
        .then(res => res.json())
        .then(main)

    function main(database) {

        const table = document.querySelector(`#stamp_tbl`)
        const cells = table.querySelectorAll("td img")

        // Double click for a shop wizard searchg
        table.addEventListener('dblclick', e => {
            // Any element with 'name' in its dataset is considered shop wizard searchable
            const name = e.target?.dataset?.name
            if (name) {
                // A stamp was clicked
                e.stopPropagation()
                e.preventDefault()
                // Open the shop wizard in a new tab
                searchWizard(name)
            }
        })

        table.addEventListener('click', e => {
            const slot = e?.target?.dataset?.position
            if (typeof slot === "string") {
                updateInfo(+slot)
            }
        })


        // The url stores a query parameter page_id=? which indicates the current album
        const page = +new URLSearchParams(window.location.search).get("page_id")

        // Update the album slots
        for (let slot = 0; slot < cells.length; slot++) {
            // This identifies if we have a stamp, wheteher it is collected and a database entry
            const cell = cells[slot]
            const collected = cell.title
            const databaseEntry = database[page] ? database[page][slot] : undefined
            // Update the dataset for the shop wizard functionality
            if (databaseEntry) {
                cell.dataset.position = slot
                cell.dataset.name = databaseEntry[0]
                cell.dataset.rarity = databaseEntry[1]
                cell.dataset.description = databaseEntry[2]
                cell.dataset.collected = !!collected
            }
            // Uncollected stamp fill the slot with database info
            if (databaseEntry && !collected) {
                cell.src = `${prefix}/${databaseEntry[3]}`
                cell.title = `${databaseEntry[0]} - r${databaseEntry[1]} : ${databaseEntry[2]}`
                cell.style.opacity = 0.25
            }
        }


        // Open the url in a new tab and fill the form fields
        function openAndFill(url, formFields) {
            const w = window.open(url)
            w.addEventListener("DOMContentLoaded", () => {
                const document = w.document
                for (let [name, value] of Object.entries(formFields)) {
                    const formField = document.querySelector(name)
                    if (formField) {
                        formField.value = value
                    }
                }
            })
        }

        function encodeQuery(key, value) {
            const tmp = new URLSearchParams()
            tmp.set(key, value)
            return tmp.toString()
        }

        const searchWizard = (query) => window.open(`/market/wizard?${encodeQuery("query",query)}`)
        const searchTradingPost = (query) => openAndFill('/island/tradingpost/browse/', { "#id_category" : 2, "#id_query" : query })
        const searchAuctionHouse = () => window.open("/auctions")
        const searchSDB = (query) => window.open(`/safetydeposit/?page=1&${encodeQuery("query", query)}`)
        const searchJellyneo = (query) => window.open(`https://items.jellyneo.net/search/?${encodeQuery("name", query)}`)
        const searchShop = () => window.open(`/viewshop/?shop_id=58`)

        // Show a rich info box at the bottom
        table.insertAdjacentHTML("beforeend", `<tbody>
    <tr>
    <td colspan="5">
      <div id="stampinfo" hidden>
        <div class="name">name</div>
        <div class="rarity"></div>
        <div class="cols">
        <div class="arrow" data-delta="-1"><</div>
        <div class="image"><img src=""/></div>
        <div class="labels">
           <div><label>Position: </label><span class="position"></span></div>
           <div><label>Status: </label><span class="status"></span></div>
           <div class="links">
             <img data-search="wizard" src="https://neopialive.s3.us-west-1.amazonaws.com/misc/wiz.png" />
             <img data-search="trading" src="https://neopialive.s3.us-west-1.amazonaws.com/misc/tp.png" />
             <img data-search="auction-house" src="https://i.ibb.co/vYzmPxV/auction25.gif" />
             <img data-search="sdb" src="https://neopialive.s3.us-west-1.amazonaws.com/misc/sdb.gif" />
             <img data-search="jn" src="https://i.ibb.co/cvGsCw4/fishnegg25.gif" />
             <img data-search="shop" src="/static/images/misc/shopkeeper/58.gif" />
           </div>
        </div>
        <div class="arrow" data-delta="1">></div>
        </div>
      </div>
    </td>
    </tr>
    </tbody><style>
    #stampinfo {
      margin-top: 1em;
      padding: 1em;
      border: 1px solid #aaa;
    }
    #stampinfo .arrow {
       font-size: 2em;
       display: flex;
       align-items: center;
       user-select: none;
       cursor: pointer;
    }
    #stampinfo > div {
       text-align: center;
    }
    #stampinfo .labels {
       text-align: left;
       display: grid;
       row-gap: 0.5em;
    }
    #stampinfo .image {
       padding: 0 2em 0 1em;
       user-select: none;
    }
    #stampinfo label,
    #stampinfo .name {
       font-weight: bold;
    }
    .cols {
       display: grid;
       grid-template-columns: min-content auto 1fr min-content;
    }
    img[data-search] { height: 25px; }
    #compare-user {
        margin-top: 1em;
    }
    [data-collected="true"] { color: darkgreen }
    [data-collected="false"] { color: darkred }
    #stamp_tbl td {
        position: relative;
    }
    [data-diff]:after {
        position: absolute;
        content: "";
        border: 1px solid #aaa;
        height: 10px;
        width: 10px;
        left: 5px;
        top: 5px;
    }
    [data-diff=""]::after { display: none; }
    [data-diff="minus"]::after { background: rgba(255,0,0,0.7); }
    [data-diff="plus"]::after { background: rgba(0,255,0,0.7); }

    </style>`)

        const stampinfo = table.querySelector("#stampinfo")

        const infos = {
            img: stampinfo.querySelector("img"),
            name: stampinfo.querySelector(".name"),
            rarity: stampinfo.querySelector(".rarity"),
            position: stampinfo.querySelector(".position"),
            status: stampinfo.querySelector(".status")
        }

        let currentPos = 0

        function updateInfo(pos) {
            const stampImage = cells[pos]
            if (!stampImage) return
            const { src, dataset } = stampImage
            if (!dataset) return
            const { name, rarity, collected } = dataset
            if (!name) return
            infos.img.src = src
            infos.name.textContent = name
            infos.rarity.textContent = "r" + rarity
            infos.position.textContent = pos + 1
            infos.status.textContent = collected === "true" ? "collected" : "not collected"
            infos.status.dataset.collected = collected
            stampinfo.hidden = false
            currentPos = pos
            return true
        }

        stampinfo.addEventListener("click", (e) => {
            // Move left or right to the next stamp, skipping over empty slots
            let delta = parseInt(e?.target?.dataset?.delta, 10)
            if (Math.abs(delta) !== 1) return;
            let target = currentPos + delta
            while (true) {
                if (updateInfo(target)) break; // returns true if the info was updated
                if (target < 0) break;
                if (target > 25) break;
                target = target + delta
            }
        })

        stampinfo.addEventListener("click", (e) => {
            const search = e.target.dataset.search
            const query = cells[currentPos].dataset.name
            const searchFunction = {
                "wizard": searchWizard,
                "trading": searchTradingPost,
                "auction-house": searchAuctionHouse,
                "sdb": searchSDB,
                "jn": searchJellyneo,
                "shop" : searchShop
            }[search]
            if (searchFunction) {
                return searchFunction(query)
            }
        })

        const jellyneoLinks = {
            [1]: "/mystery-island-album-avatar-list/",
            [2]: "/virtupets-album-avatar-list/",
            [3]: "/tyrannia-album-avatar-list/",
            [4]: "/haunted-woods-album-avatar-list/",
            [5]: "/neopia-central-album-avatar-list/",
            [6]: "/neoquest-album-avatar-list/",
            [7]: "/snowy-valley-album-avatar-list/",
            [8]: "/meridell-vs-darigan-album-avatar-list/",
            [9]: "/lost-desert-album-avatar-list/",
            [10]: "/battledome-album-avatar-list/",
            [11]: "/coins-album-avatar-list/",
            [12]: "/battle-for-meridell-album-avatar-list/",
            [13]: "/neoquest-ii-album-avatar-list/",
            [15]: "/space-station-coins-album-avatar-list/",
            [16]: "/evil-coconuts-album-avatar-list/"
        }

        const jellyneoLink = jellyneoLinks[page]
        if (jellyneoLink) {
            table.nextElementSibling?.insertAdjacentHTML("afterend", `<a href="https://items.jellyneo.net/search${jellyneoLink}" target="_blank"/><center><img src="https://i.ibb.co/cvGsCw4/fishnegg25.gif" /> Album info <img src="https://i.ibb.co/cvGsCw4/fishnegg25.gif" /></center></a>`)
        }

        // Show diff form
        const compareUser = localStorage.getItem("compare-user") ?? ""

        table.nextElementSibling.insertAdjacentHTML("beforeend", `<form action="#" id="compare-user">
           <label for="compare-user">Compare against another user</label><br>
           <input type="text" name="compare-user" value="${compareUser}" />
           <input type="submit" value="Compare" />
           <button name="clear">Clear</button>
           <div class="error"></div>
        </form>`)

        const diff = table.parentElement.querySelector("#compare-user")
        const error = diff.querySelector(".error")
        const setError = (msg) => error.textContent = msg
        const clearError = () => error.textContent = ""

        // Read the key compare-user from localstorage, make a fetch request to their stamp album and run the diff function
        function applyDiffHTTP(username) {
            return fetch(`/stamps/album/?page_id=${page}&owner=${username}`)
                .then(res => res.text())
                .then((html) => {
                    if (html.includes("That user does not exist!")) {
                        throw new Error("That user user does not exist!")
                    } else {
                        applyDiff(html)
                    }
                })
        }

        // Change the name in the compare-user form field, save it to local storage and run applyDiffFromLocalStorage immediately
        table.parentElement.addEventListener("submit", async (e) => {
            e.preventDefault()
            let username = diff.querySelector(`[name="compare-user"]`).value.trim()
            if (!username?.length) {
                setError("Please enter a valid username")
                return
            }
            setError("Loading...")
            applyDiffHTTP(username)
                .then(() => {
                    clearError()
                    localStorage.setItem("compare-user", username)
                })
                .catch((err) => {
                    setError(err.message)
                })
        })

        // Stop comparing against another user
        table.parentElement.addEventListener("click", (e) => {
            if (e.target.name !== "clear") return
            e.stopPropagation()
            e.preventDefault()
            localStorage.removeItem("compare-user");
            const username = diff.querySelector(`[name="compare-user"]`)
            if (username) {
                username.value = ""
            }
            cells.forEach((cell) => {
                cell.parentElement.dataset.diff = ""
            })
        })

        function applyDiff(html) {
            // regex to get all stamp images on this html page
            // match(/src="\/images.+?"/g).map(e => e.match(/\/images.+\.\w+/)[0])
            for (let cell of cells) {
                cell.parentElement.dataset.diff = ""
                const have = cell.dataset.collected === "true"
                const otherHas = html.includes(removePrefix(cell.src))
                if (have && !otherHas) {
                    cell.parentElement.dataset.diff = "plus"
                } else if (!have && otherHas) {
                    cell.parentElement.dataset.diff = "minus"
                }
            }
        }

        if (compareUser) {
            applyDiffHTTP(compareUser)
        }
    }
})();
