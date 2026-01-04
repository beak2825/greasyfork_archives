// ==UserScript==
// @name         Darktide shop filter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.7
// @description  Highlight items that match specific rules
// @author       zaks @ darkmass.gg discord, 0.7pre changes by Cautemoc
// @match        https://accounts.atoma.cloud/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atoma.cloud
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/457328/Darktide%20shop%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/457328/Darktide%20shop%20filter.meta.js
// ==/UserScript==

/*
* WARNING: Configurations aren't backwards compatible! 0.7pre (and forwards) will require configuration to be valid JSON.
* What this mostly means is that for example: `blessing: ["foo", "bar"],` will need to be `"blessing": ["foo", "bar"],` and that every last item in * each object must not have a comma at the end... sigh.
* You can use tool like https://jsoneditoronline.org to convert from the old format.
*/

/* globals GM_config, GM_configStruct */

(function() {
    'use strict';

    GM_config.init(
        {
            id: 'ArmouryFilterConfig',
            title: 'Armoury Exchange Filters',
            fields:
            {
                'DeEmphasizeLogic':
                {
                    'label': 'De-emphasize Style',
                    'type': 'select',
                    'options': ['none', 'hide', 'opacity'],
                    'default': 'none'
                },
                'Config':
                {
                    'label': 'Filtering Config JSON',
                    'type': 'textarea',
                    'default': `[
        {
            "character": ["veteran"],
            "item":["Power Sword"],
            "blessing":["Power Cycler"]
        },
        {
            "item":["Obscurus Mk II Blaze Force Sword"],
            "blessing":["Deflector"]
        },
        {
            "minStats":360
        },
        {
            "item":["(Reliquary)", "(Caged)", "(Casket)"],
            "blessing":["Toughness"],
            "perk":["Toughness"],
            "minRating": 80
        }
    ]`
            }
        },
        css:
        '#ArmouryFilterConfig{background:#000;border:1px solid #5df8ff;color:#fff;padding:15px}' +
        '#ArmouryFilterConfig_wrapper{display:flex;flex-direction:column;height:100%}' +
        '#ArmouryFilterConfig_Config_var{display:flex;flex:1;flex-direction:column}' +
        'textarea{flex:1 1 100%;margin-top:5px}' +
        '#ArmouryFilterConfig_resetLink{display:none}' +
        '.config_var{padding-top:15px}'
    });

    addFilteringButton()

    // ===== CONFIG START =====

    // Rules for matching items
    //
    // allows filtering based on character, item name, blessings, perks, total rating and minimum stat roll.
    //
    // 'character', 'item', 'blessing' and 'perk' need to be defined as arrays and are considered a match as long
    // as the item matches _any_ of the values in that array for each defined filter type.
    var targets = []

    var config = GM_config.get('Config')
    if (config) {
        targets = JSON.parse(config)
    }

    // Toggle how to de-emphasize items that don't match any filters.
    //
    // "none":    normal visibility (default)
    // "hide":    completely remove from the listing
    // "opacity": lower the opacity
    var deemphasizeLogic = GM_config.get('DeEmphasizeLogic')

    // ===== CONFIG END =====
    function determineRarityValue(rawValue) {
        switch (rawValue) {
            case 'Ⅰ':
                return 1
            case 'Ⅱ':
                return 2
            case 'Ⅲ':
                return 3
            case 'Ⅳ':
                return 4
            default:
                return 1
        }
    }

    function hit(element) {
        element.querySelector(".MuiBox-root > .item-title").style.color = "red"
    }

    function miss(element) {
        switch(deemphasizeLogic) {
            case "opacity":
                element.style.opacity = "0.33";
                break
            case "hide":
                element.style.display = "none"
                break
            case "none":
            default:
        }
    }

    function addFilteringButton() {
        const btn = document.createElement("button")
        btn.innerHTML = "<p>Armoury <br/> Filters</p>"
        btn.style.position = "fixed"
        btn.style.top = "100px"
        btn.style.right = "5px"
        btn.style.zIndex = "99"
        btn.style.cursor = "pointer"
        btn.style.color = "#fff"
        btn.style.backgroundColor = "#000"
        btn.style.border = "1px solid #5df8ff"
        btn.onclick = function(){GM_config.open()}
        document.body.appendChild(btn)
    }

    var charClass
    var item = {}

    let observer = new MutationObserver((mutations) => {
        if (document.querySelector("#enable-rule-based-filter")) {
            GM_config.title = 'Armoury Exchange Filter (DEPRECATED)<br /><p style="color:red" size="-2">Please migrate your configuration to the extension provided rule-based filtering</p>'
            console.log("Disabling shop filters userscript, please migrate your configuration to the extension provided rule-based filtering")
            observer.disconnect()
            return
        }

        mutations.forEach((mutation) => {
            if (!mutation.addedNodes) return

            // Get currently active character
            var characters = document.querySelectorAll('.char-list li button')
            for (let i = 0; i < characters.length; i++) {
                if (! characters[i].style.cssText.includes("transparent")) {
                    charClass = characters[i].querySelectorAll(".char-button div div")[1].innerHTML.split(" ")[0]
                    // console.log('charClass', charClass)
                }
            }

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                // do things to your newly added nodes here
                let node = mutation.addedNodes[i]

                if (! node.classList || ! node.querySelector(".MuiBox-root > .item-title")) {
                    continue
                }

                item.character = charClass
                item.name = node.querySelector(".MuiBox-root > .item-title").innerHTML

                if (node.querySelector("div:nth-child(2)").textContent == "Owned") {
                    item.stats = node.querySelector("div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div").textContent
                } else {
                    item.stats = node.querySelector("div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div").textContent
                }

                if (node.querySelector("div:nth-child(2)").textContent == "Owned") {
                    item.rating = node.querySelector("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)").textContent.substring(6)
                } else {
                    item.rating = node.querySelector("div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)").textContent.substring(6)
                }

                item.blessings = []
                item.blessingsRarity = []
                item.perks = []
                item.perksRarity = []

                if (node.querySelectorAll(".perks").length > 0) {
                    // If the item is a curio (has no stats block) and only has 1 perk block, it's a green curio which only has blessings
                    if (node.querySelectorAll(".stats").length == 0 && node.querySelectorAll(".perks").length == 1) {
                        let blessList = node.querySelectorAll(".perks")[0]
                        for (let i = 0; i < blessList.children.length; i++) {
                            item.blessings.push(blessList.children[i].querySelector("div:nth-child(2)").textContent)
                            item.blessingsRarity.push(determineRarityValue(blessList.children[i].querySelector("div:nth-child(1)").textContent))
                        }
                    } else {
                        // For all other items with perks listed, the first block will be perks and the second will be blessings
                        let perkList = node.querySelectorAll(".perks")[0]
                        for (let i = 0; i < perkList.children.length; i++) {
                            item.perks.push(perkList.children[i].querySelector("div:nth-child(2)").textContent)
                            item.perksRarity.push(determineRarityValue(perkList.children[i].querySelector("div:nth-child(1)").textContent))
                        }
                        if (node.querySelectorAll(".perks").length == 2) {
                            let blessList = node.querySelectorAll(".perks")[1]
                            for (let i = 0; i < blessList.children.length; i++) {
                                item.blessings.push(blessList.children[i].querySelector("div:nth-child(2)").textContent)
                                item.blessingsRarity.push(determineRarityValue(blessList.children[i].querySelector("div:nth-child(1)").textContent))
                            }
                        }
                    }
                }

                // console.log('item', JSON.stringify(item))

                var filterHit = false
                for (let i = 0; i < targets.length; i++) {
                    let target = targets[i]
                    if (target.character && ! target.character.includes(item.character)) {
                        continue
                    }
                    if (target.item && ! target.item.find(element => item.name.match(element))) {
                        continue
                    }
                    if (target.minStats && target.minStats > item.stats) {
                        continue
                    }
                    if (target.minRating && target.minRating > item.rating) {
                        continue
                    }
                    if (target.blessing) {
                        let found = false
                        for (let j = 0; j < item.blessings.length; j++) {
                            if (target.blessing.find(element => item.blessings[j].match(element))) {
                                if (target.minBlessingRarity) {
                                    if (item.blessingsRarity[j] >= target.minBlessingRarity[j]) {
                                        found = true
                                        break
                                    }
                                } else {
                                    found = true
                                    break
                                }
                            }
                        }
                        if (!found) {
                            continue
                        }
                    }
                    if (target.perk) {
                        let found = false
                        for (let j = 0; j < item.perks.length; j++) {
                            if (target.perk.find(element => item.perks[j].match(element))) {
                                if (target.minPerkRarity) {
                                    if (item.perksRarity[j] >= target.minPerkRarity[j]) {
                                        found = true
                                        break
                                    }
                                } else {
                                    found = true
                                    break
                                }
                            }
                        }
                        if (!found) {
                            continue
                        }
                    }
                    filterHit = true
                    break
                }
                if (filterHit) {
                    hit(node)
                } else {
                    miss(node)
                }
            }

        })
    })

    observer.observe(
        document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        })

})();
