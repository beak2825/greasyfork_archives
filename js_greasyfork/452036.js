// ==UserScript==
// @name         Furry Paws Quick Names
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Auto populates the dog's name with its genetic information.
// @author       Kyyh
// @match        https://www.furry-paws.com/dog/index/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furry-paws.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452036/Furry%20Paws%20Quick%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/452036/Furry%20Paws%20Quick%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURATION

    // if you're aiming for a single stat allele (chacha chacha), you can just replace all 3 options with the same stat
    // aptitude and stats must be equal to how they are shown in-game, if you want 'Hunting Trials' do not input 'hunting trials'

    let desired_aptitude = "Hunting Trials"
    let desired_stat_1 = "cha"
    let desired_stat_2 = "int"
    let desired_stat_3 = "stm"

    // get genotype and aptitudes from dog page and separate
    let genotype = document.evaluate('//*[@id="tab_about"]/table/tbody/tr[17]/td/text()', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent
    let separated_genotype = genotype.split(' ')

    let aptitude = document.evaluate('//*[@id="tab_about"]/table/tbody/tr[18]/td', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent
    let separated_aptitude = aptitude.split(', ')

    // count HH and hh
    let HH_count = 0
    let hh_count = 0

    for (let i = 0; i < separated_genotype.length; i++) {
        if (separated_genotype[i] === "HH") {
            HH_count++
        }
    }

    for (let i = 0; i < separated_genotype.length; i++) {
        if (separated_genotype[i] === "hh") {
            hh_count++
        }
    }

    // calculate quality
    let quality = ((HH_count * 25 / 6) + ((24 - HH_count - hh_count) * 25 / 8)).toFixed(1)

    // look for aptitude
    let has_aptitude = separated_aptitude.includes(desired_aptitude)
    let indicator = ""
    if (has_aptitude) {
        indicator = "*"
    }

    // get litter size
    let litter = separated_genotype[14]

    // stats
    let stat1 = separated_genotype[15]
    let stat2 = separated_genotype[16]

    let stat11 = stat1.slice(0, 3)
    let stat12 = stat1.slice(3)
    let stat21 = stat2.slice(0, 3)
    let stat22 = stat2.slice(3)

    function check_stat(allele) {
        if(allele == desired_stat_1 || allele == desired_stat_2 || allele == desired_stat_3) {
            return true
        } else {
            return false
        }
    }

    let stats_indicator = ""

    if (check_stat(stat11) === true) { stats_indicator = stats_indicator + "X" } else { stats_indicator = stats_indicator + "-" }
    if (check_stat(stat12) === true) { stats_indicator = stats_indicator + "X" } else { stats_indicator = stats_indicator + "-" }

    stats_indicator = stats_indicator + " "

    if (check_stat(stat21) === true) { stats_indicator = stats_indicator + "X" } else { stats_indicator = stats_indicator + "-" }
    if (check_stat(stat22) === true) { stats_indicator = stats_indicator + "X" } else { stats_indicator = stats_indicator + "-" }

    // new name
    let new_name = indicator + quality + " " + HH_count + "/" + hh_count + " " + litter + " " + stats_indicator
    document.getElementById("change_name").value = new_name

    let has_litter = false

    if(litter === "lala" || litter === "Lla" || litter === "LL") {
        has_litter = true
    }

    if (has_aptitude && has_litter) { document.getElementById("main_dog_name").style = "background-color: green !important;" }
})();