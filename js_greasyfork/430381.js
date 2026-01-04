// ==UserScript==
// @name         Jisho Radical Search
// @version      1.1
// @description  Adds a search bar for radicals to Jisho.org, allowing for the filtering of radicals by name.
// @namespace    @Archie_B_Goode/JishoRadicalSearch
// @author       @Archie_B_Goode
// @match        https://jisho.org/*
// @icon         https://www.google.com/s2/favicons?domain=jisho.org
// @downloadURL https://update.greasyfork.org/scripts/430381/Jisho%20Radical%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/430381/Jisho%20Radical%20Search.meta.js
// ==/UserScript==

var radicalNamesTable = [
    ["one", "ground"],
    ["line", "stick", "rod"],
    ["dot", "drop"],
    ["slash", "bend", "slide", "no"],
    ["second", "latter", "nose", "hook"],
    ["barb", "hook"],
    ["two", "ni"],
    ["lid"],
    ["person", "human"],
    ["person", "human", "leader"],
    ["hat", "person", "human", "enter"],
    ["legs"],
    ["enter"],
    ["eight", "fins"],
    ["horns", "flowers", "eight"],
    ["inverted box", "wide", "head"],
    ["cloth cover", "crown", "forehead"],
    ["ice"],
    ["desk", "table"],
    ["container", "inbox", "open box", "receptacle"],
    ["sword"],
    ["sword", "knife"],
    ["power", "force", "ka"],
    ["embrace", "wrap", "prison"],
    ["spoon", "hi"],
    ["box", "cage"],
    ["ten", "complete", "cross"],
    ["divination", "oracle", "toe"],
    ["seal", "stamp"],
    ["cliff"],
    ["private"],
    ["again", "right hand", "stool"],
    ["repeater", "noma"],
    ["nine", "kyuu"],
    ["hook", "yu"],
    ["stairs"],
    ["gun"],
    ["scooter", "road", "walk"],
    ["mouth", "opening"],
    ["enclosure", "country"],
    ["earth", "dirt", "soil"],
    ["scholar", "bachelor", "samurai"],
    ["go", "winter"],
    ["evening", "sunset", "ta"],
    ["big", "very"],
    ["woman", "female", "girl"],
    ["child", "seed"],
    ["roof"],
    ["inch", "unit of measurement"],
    ["small", "insignificant"],
    ["small", "insignificant", "triceratops", "three drops"],
    ["lame", "pirate"],
    ["corpse", "flag"],
    ["sprout"],
    ["mountain"],
    ["river"],
    ["river"],
    ["work", "construction"],
    ["oneself"],
    ["cloth", "turban", "scarf", "city"],
    ["dry"],
    ["short thread", "poop"],
    ["dotted cliff", "roof", "canopy"],
    ["long stride", "stretch", "move", "yoga"],
    ["two hands", "arch", "twenty"],
    ["ceremony", "shot", "arrow"],
    ["bow"],
    ["snout", "pig head", "wolverine"],
    ["snout", "pig head", "shuriken"],
    ["hair", "bristle"],
    ["step", "loiter"],
    ["heart"],
    ["hand", "fingers"],
    ["water", "tsunami"],
    ["beast", "dog", "fur", "animal"],
    ["grass", "flowers"],
    ["building", "village", "city"],
    ["building", "hill", "mound"],
    ["alligator"],
    ["dead", "death"],
    ["escalator"],
    ["bend", "slash", "slide", "no"],
    ["old", "elderly", "coffin"],
    ["heart"],
    ["spear", "halberd", "drunkard"],
    ["door", "house"],
    ["hand"],
    ["branch"],
    ["strike", "whip", "rap", "tap"],
    ["script", "literature", "writing"],
    ["dipper", "scoop", "ladle"],
    ["axe"],
    ["way", "direction", "square", "road"],
    ["have not"],
    ["sun", "day"],
    ["say"],
    ["moon", "month", "body"],
    ["tree"],
    ["yawn", "lack"],
    ["stop"],
    ["death", "decay", "yakuza"],
    ["weapon", "lance"],
    ["compare", "compete"],
    ["fur", "hair"],
    ["clan"],
    ["steam", "breath", "energy", "air"],
    ["water"],
    ["fire"],
    ["fire", "boil"],
    ["claw", "nail", "talon"],
    ["father"],
    ["mix", "trigrams"],
    ["split wood"],
    ["slice", "one sided"],
    ["cow"],
    ["dog"],
    ["altar", "spirit"],
    ["king", "ball", "jade"],
    ["legs", "origin"],
    ["well"],
    ["wing"],
    ["lame"],
    ["five"],
    ["barracks", "flowers", "grass", "sprout"],
    ["oneself", "bed"],
    ["do not", "mother", "mom", "window"],
    ["dark", "profound", "mysterious"],
    ["tile"],
    ["sweet"],
    ["life", "live"],
    ["use", "task"],
    ["field", "rice paddy"],
    ["bolt of cloth", "coat rack"],
    ["sickness", "illness"],
    ["footsteps", "tent"],
    ["white"],
    ["skin"],
    ["dish", "plate"],
    ["eye"],
    ["spear", "pike"],
    ["arrow"],
    ["stone", "rock"],
    ["altar", "display", "jackhammer"],
    ["track"],
    ["two branch tree", "two-branch tree", "grain"],
    ["cave", "hole"],
    ["stand", "erect"],
    ["clothes"],
    ["thirty", "world"],
    ["giant", "titan"],
    ["bookshelf"],
    ["do not", "mother", "mom", "window"],
    ["net"],
    ["fang"],
    ["melon"],
    ["bamboo"],
    ["rice"],
    ["thread", "string", "silk"],
    ["can", "earthen jar", "earthenware jar"],
    ["sheep"],
    ["feathers", "wings"],
    ["rake", "beard", "and"],
    ["plow", "three-branch tree", "three branch tree"],
    ["ear"],
    ["brush"],
    ["meat"],
    ["oneself"],
    ["arrive", "mole"],
    ["millstone", "mortar"],
    ["tongue"],
    ["boat"],
    ["stopping", "roots"],
    ["color", "colour", "prettiness"],
    ["tiger stripes"],
    ["insect", "bug"],
    ["blood"],
    ["walk", "enclosure", "go", "do"],
    ["clothes"],
    ["west", "cover"],
    ["minister", "official", "servant"],
    ["see"],
    ["horn", "angle", "corner"],
    ["speech", "say"],
    ["valley"],
    ["beans"],
    ["pig"],
    ["cat", "badger"],
    ["shellfish"],
    ["red"],
    ["run"],
    ["foot", "leg"],
    ["body"],
    ["cart", "car"],
    ["spicy", "bitter"],
    ["morning", "landslide"],
    ["west", "sake", "wine", "alcohol"],
    ["divide", "distinguish", "choose", "sickle"],
    ["village", "mile"],
    ["opposite", "dancing legs"],
    ["wheat"],
    ["metal", "gold"],
    ["long", "grow", "leader"],
    ["gate"],
    ["slave", "capture"],
    ["old bird", "short-tailed bird", "turkey"],
    ["rain"],
    ["green", "blue"],
    ["wrong", "criminal"],
    ["cover", "suffocate", "obstruct"],
    ["hill"],
    ["excuse"],
    ["even", "uniformly", "alike", "simultaneous"],
    ["face"],
    ["leather", "rawhide"],
    ["leek"],
    ["sound"],
    ["big shell", "geoduck"],
    ["wind"],
    ["fly"],
    ["eat", "food"],
    ["neck", "head"],
    ["fragrant"],
    ["mouths", "products"],
    ["horse"],
    ["bone"],
    ["tall", "high"],
    ["hair"],
    ["fight"],
    ["herbs", "sacrificial wine"],
    ["tripod", "bully"],
    ["ghost", "demon", "oni"],
    ["dragon"],
    ["tanned leather", "korea"],
    ["fish"],
    ["bird"],
    ["salt"],
    ["deer"],
    ["hemp", "flax"],
    ["turtle", "tortoise"],
    ["mohawk", "stalk", "stem", "foot", "base"],
    ["yellow"],
    ["black"],
    ["millet"],
    ["embroidery", "needlework"],
    ["nothing"],
    ["tooth", "molar"],
    ["frog", "amphibian"],
    ["sacrificial tripod"],
    ["drum"],
    ["rat", "mouse"],
    ["nose"],
    ["even", "uniformly"],
    ["flute"]
]

const matchedRadicalClassName = "radical_matched"
const ElementRadicalArea = document.getElementById("radical_area")
const ElementRadicalTable = document.getElementsByClassName("radical_table")[0]
const ElementArrayRadicalButtons = Array.from(ElementRadicalTable.querySelectorAll("li.radical"))

function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function onRadicalSearchSubmit(e) {
    var queries = e.target.value.toLowerCase().split(",")

    for (radicalButton of ElementArrayRadicalButtons) {
        radicalButton.classList.remove(matchedRadicalClassName)
    }

    if (queries[0].length > 0) {
        for (var query of queries) {
            query = query.trim()
            if (query.length > 0) {
                for (const [index, names] of radicalNamesTable.entries()) {
                    var match = false
                    for (var name of names) {
                        if (name.includes(query)) {
                            match = true
                            break
                        }
                    }

                    var radicalButton = ElementArrayRadicalButtons[index]
                    if (match) {
                        radicalButton.classList.add(matchedRadicalClassName)
                    }
                }
            }
        }
    }
}

function setupSearchBar() {
    var searchBar = document.createElement("input")
    searchBar.setAttribute("form", "radical_name_search") //This is needed so pressing Enter doesn't submit the dictionary search.
    searchBar.setAttribute("placeholder", "Type radical names here, separated by commas.")
    searchBar.addEventListener("change", onRadicalSearchSubmit)

    ElementRadicalArea.insertBefore(searchBar, ElementRadicalTable)
}

function setupTooltips() {
    for (const [index, button] of ElementArrayRadicalButtons.entries()) {
        button.setAttribute("title", radicalNamesTable[index].join(", "))
    }
}

function fitSearchBar() {
    //When #radical is present in the URL, the Search Area is expanded before the UserScript has the chance to run
    //So the Search Area is set to the size of the Radical Area WITHOUT the Search Bar and cuts the Radical Area short.
    //To fix this we set the size of the Search Area size to the Radical Area size again.
    if (window.location.hash == "#radical") {
        var searchSub = document.querySelector("#search_sub")
        searchSub.style.height = `${ElementRadicalArea.offsetHeight}px`
    }
}

(function() {
    'use strict';

    GM_addStyle(`li.radical.${matchedRadicalClassName} { background-color: lime }`)

    setupSearchBar()
    setupTooltips()
    fitSearchBar()
})();