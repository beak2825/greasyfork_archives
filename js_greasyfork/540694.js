// ==UserScript==
// @name         PowderScripts - Copy Search to CSV
// @version      2025-06-25
// @description  Injects a button onto the ChickenPet search page that lets you copy the results to your clipboard.
// @namespace    https://github.com/Aviivix/powderscripts
// @author       You
// @match        https://chicken.pet/search*
// @icon         https://github.com/Aviivix/powderscripts/blob/main/tocsv.png?raw=true
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540694/PowderScripts%20-%20Copy%20Search%20to%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/540694/PowderScripts%20-%20Copy%20Search%20to%20CSV.meta.js
// ==/UserScript==

(function() {
    const results = document.getElementsByClassName("card-simple bg-light")
    var header = document.getElementsByClassName("row align-items-center g-2")[0]
    // ugh global variable my behated i need to get better at this
    csv_string = ""
    // Yeah this sucks, keep scrolling
    header.outerHTML = '<div class="row align-items-center g-2"><div class="col-auto"><div class="child-thumb"></div></div><div class="col-4 col-lg-2">Name &amp; owner    </div><div class="col-3 col-lg-2">        Age &amp; karyotype</div><div class="col-2 col-lg-1">Status</div><div class="col-9 col-lg-3">Genes</div><div class="col-9 col-lg-3" align="right"><button onclick="(function(){navigator.clipboard.writeText(csv_string);})()" style="front-family: var(--font-lexend); font-weight: bold;">Copy to Clipboard <img src="https://github.com/Aviivix/powderscripts/blob/main/tocsv.png?raw=true" width="32px"></button></div></div>'
    // Doing it like this because sometime I want to make it so you can customize the arrangement of these
    var chickens = {}
    for (let x = 0; x < results.length; x++) {
        let data = results[x].children[0].children
        let genes = data[4].innerText.replace("\n", " ").split(" ")
        let chicken_data = {
            "id": data[1].children[0].href.match("[0-9]+")[0],
            "name": data[1].children[0].innerText,
            "owner": data[1].children[1].children[0].innerText,
            "age": data[2].innerText.match(".* old")[0],
            "karyo": data[2].innerText.match(" Z[ZW]+")[0],
            "base": genes[0],
            "over": genes[2],
            "flair": genes[4],
            "peep": genes[6],
            "body": genes[8],
            "comb": genes[10],
            "eyespot": genes[12],
            "feet": genes[14],
            "pattern": genes[16],
            "tail": genes[18],
            "wattle": genes[20]
        }
        chickens[chicken_data.id] = chicken_data
    }
    for (let x = 0; x < Object.keys(chickens).length; x++) {
        let c = chickens[Object.keys(chickens)[x]]
        // Yeah this sucks, keep scrolling
        csv_string += `${c.id}\t${c.name}\t${c.owner}\t${c.age}\t${c.karyo}\t${c.base}\t${c.over}\t${c.flair}\t${c.peep}\t${c.body}\t${c.comb}\t${c.eyespot}\t${c.feet}\t${c.pattern}\t${c.tail}\t${c.wattle}\n`
    }
})();