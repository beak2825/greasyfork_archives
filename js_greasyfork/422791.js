// ==UserScript==
// @name         Brick Hill Outfit Randomizer
// @version      1.3
// @description  Adds a button to randomize your avatar
// @author       Noah Cool Boy
// @match        https://www.brick-hill.com/customize/
// @namespace https://greasyfork.org/users/725966
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/422791/Brick%20Hill%20Outfit%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/422791/Brick%20Hill%20Outfit%20Randomizer.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(a => setTimeout(a, ms))
}


let int = setInterval(async () => {
    if (!document.querySelector(".avatar-buttons"))
        return await sleep(10)
    clearInterval(int)

    let outfitCard = document.querySelector(".avatar-buttons")
    let buttons = document.createElement("div")
    buttons.className = "inline"
    buttons.style.marginTop = "5px"
    buttons.innerHTML = `<button class="yellow thin" onclick="rand()"><svg class="svg-icon-large" style="height: 24px; fill: white;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#fff;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal;solid-color:#fff;solid-opacity:1" d="M1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3v6a1 1 0 0 0 1 1h3.25a1 1 0 0 0 .75-.34 1 1 0 0 0 .75.34H11v-2h-1v-4a1 1 0 0 0-1-1 1 1 0 0 0-1 1v4H6v-6a1 1 0 0 0-1-1H2V9h4a1 1 0 0 0 .66-.25A4.02 4.02 0 0 1 4.56 7H1zm12.44 0a4.02 4.02 0 0 1-2.1 1.75A1 1 0 0 0 12 9h4v2h2V8a1 1 0 0 0-1-1h-3.56z"/><path d="M8 0a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3Zm0 2h2c.56 0 1 .44 1 1v2c0 .56-.44 1-1 1H8c-.56 0-1-.44-1-1V3c0-.56.44-1 1-1Z" color="#fff" font-family="sans-serif" font-weight="400" overflow="visible" style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#fff;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal;solid-color:#fff;solid-opacity:1"/><path style="fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" d="M13 13h10v10H13Z"/><path style="stroke-width:4.75267;stroke-linecap:round;stroke-linejoin:round" d="M16.75 20.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM19 18a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm2.25-2.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg></button><div class="button-hint" style="font-weight: 600; margin-top: 5px;">RAND</div>`
    // No judging please ^
    outfitCard.appendChild(buttons)

    let types = Object.fromEntries([...document.querySelectorAll(".optional-types label")].map(v => [v.attributes.for.value, v.innerText]))
    document.rand = function () {
        let modal = document.createElement("div")
        modal.className = "modal"
        modal.innerHTML = `<div class="modal-content"><span class="close">x</span>Random Outfit Generator<hr>What would you like to randomize?<br>${Object.values(types).map(v => `<div class="option"><input type="checkbox" checked><label>${v}</label><br></div>`).join("")}<div class="colors"><input type="checkbox"><label>Body Colors</label><br></div><div class="modal-buttons"><button class="green">Randomize!</button></div></div>`
        modal.querySelector(".close").addEventListener("click", () => {
            modal.remove()
        });
        [...modal.querySelectorAll("input")].forEach(v => { // Is this an "On God" or "Fr" moment
            v.parentNode.querySelector("label").addEventListener("click", () => v.getAttribute("checked") === null ? v.setAttribute("checked", "") : v.removeAttribute("checked"))
        })
        modal.querySelector("button").addEventListener("click", () => {
            randomize(modal)
        })
        outfitCard.appendChild(modal)
    }

    function wait(ms) {
        return new Promise(a => {
            setTimeout(a, ms)
        })
    }

    function randomize(modal) {
        modal.querySelector(".close").remove()
        modal.querySelector("button").remove()
        let status = document.createElement("span")
        modal.querySelector(".modal-content").appendChild(status)
        let opts = [...modal.querySelectorAll(".option")].map(v => v.innerText.trim())
        setTimeout(async () => {
            let inventory = {}
            if (window.localStorage.randomizer_cache && window.localStorage.randomizer_cache_date && Date.now() - window.localStorage.randomizer_cache_date < 1000 * 60 * 60 * 24) {
                inventory = JSON.parse(window.localStorage.randomizer_cache)
            } else {
                for (let x = 0; x < opts.length; x++) {
                    let type = opts[x]
                    inventory[type] = []
                    let apiType = Object.keys(types).find(key => types[key] == type)
                    let cursor = ""
                    while (true) {
                        let req = new XMLHttpRequest()
                        req.open("GET", `https://api.brick-hill.com/v1/user/${document.querySelector("meta[name=user-data]").attributes["data-id"].value}/crate?limit=100&cursor=${cursor}&types[]=${apiType}`, false)
                        req.withCredentials = true
                        req.send()
                        let data = JSON.parse(req.responseText)
                        inventory[type] = inventory[type].concat(data.data.map(v => v.item.id))
                        cursor = data.next_cursor

                        await wait(5)
                        status.innerText = `Getting ${type}`

                        if (!cursor)
                            break
                    }
                }

                window.localStorage.randomizer_cache = JSON.stringify(inventory)
                window.localStorage.randomizer_cache_date = Date.now()
            }
            opts = [...modal.querySelectorAll(".option")].map(v => [v.innerText.trim(), v.querySelector("input").checked])
            opts = opts.filter(v => v[1]).map(v => v[0])
            Object.keys(inventory).filter(v => !opts.includes(v)).forEach(v => delete inventory[v])
            if (inventory.Hats) {
                inventory.Hats2 = inventory.Hats
                inventory.Hats3 = inventory.Hats
            }
            let messages = ["Shuffling the stuff", "Doing things", "Randomizing the avatar", "Making your new outfit", "Tiny computer is thinking", "Generating a combo", "The machine is hard at work"]
            status.innerText = messages[Math.floor(Math.random() * messages.length)]
            console.log(inventory)
            let outfit = {
                rebase: false,
                instructions: [],
                _token: document.querySelector("meta[name=csrf-token]").content
            }
            Object.keys(inventory).filter(v => v.length).forEach(v => outfit.instructions.push({ [inventory[v][Math.floor(Math.random() * inventory[v].length)]]: "wear" }))

            let bodyColors = modal.querySelector(".colors > input")
            if (bodyColors.checked) {
                outfit.colors = {}
                let bodyParts = ["torso", "left_arm", "right_arm", "left_leg", "right_leg", "head"]
                bodyParts.forEach(key => outfit.colors[key] = Array(6).fill(0).map(v => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]).join(""))
            }

            let token = document.cookie.match(/XSRF-TOKEN=([a-zA-Z0-9%]+)/s)[1] // Turbo power brain mode
            let req = new XMLHttpRequest()
            req.open("POST", `https://api.brick-hill.com/v1/user/render/process`, false)
            req.setRequestHeader("X-XSRF-TOKEN", token)
            req.setRequestHeader("Content-Type", "application/json")
            req.withCredentials = true
            req.send(JSON.stringify(outfit))

            setTimeout(() => {
                location.reload()
            }, 1000) // Increase user satisfaction
        }, 1)
    }
}, 10);