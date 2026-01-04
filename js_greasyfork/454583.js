// ==UserScript==
// @name         Puppy Stats
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generates a puppy's stats according to Happy Paws' formula.
// @author       Kveikoira
// @match        https://www.furry-paws.com/litter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furry-paws.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454583/Puppy%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/454583/Puppy%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sport = "Show"

    let stats = document.evaluate('/html/body/div[3]/div[2]/div/div[2]/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent
    let cleaned = stats.replace(/\s/g, "")
    let matches = cleaned.match(/\d+/g)

    let agility = matches[0]
    let charisma = matches[1]
    let intelligence = matches[2]
    let speed = matches[3]
    let stamina = matches[4]
    let strength = matches[5]

    agility = parseInt(agility)
    charisma = parseInt(charisma)
    intelligence = parseInt(intelligence)
    speed = parseInt(speed)
    stamina = parseInt(agility)
    strength = parseInt(strength)

    let sport_main = 0
    let sport_other = 0

    switch(sport) {
        case "Agility":
            sport_main =+ agility + intelligence + speed
            sport_other =+ charisma + stamina + strength
            break
        case "Dock Diving":
            sport_main =+ agility + charisma + strength
            sport_other =+ intelligence + speed + stamina
            break
        case "Earthdog Trials":
            sport_main =+ intelligence + speed + strength
            sport_other =+ agility + charisma + stamina
            break
        case "Field Trials":
            sport_main =+ charisma + stamina + strength
            sport_other =+ agility + intelligence + speed
            break
        case "Flyball":
            sport_main =+ agility + speed + stamina
            sport_other =+ charisma + intelligence + strength
            break
        case "Frisbee":
            sport_main =+ agility + charisma + stamina
            sport_other =+ intelligence + speed + strength
            break
        case "Herding":
            sport_main =+ agility + intelligence + stamina
            sport_other =+ charisma + speed + strength
            break
        case "Hunting Trials":
            sport_main =+ charisma + intelligence + stamina
            sport_other =+ agility + speed + strength
            break
        case "Musical Freestyle":
            sport_main =+ agility + charisma + intelligence
            sport_other =+ speed + stamina + strength
            break
        case "Obedience":
            sport_main =+ agility + intelligence + strength
            sport_other =+ charisma + speed + stamina
            break
        case "Pulling":
            sport_main =+ agility + stamina + strength
            sport_other =+ charisma + intelligence + speed
            break
        case "Racing":
            sport_main =+ charisma + speed + stamina
            sport_other =+ agility + intelligence + strength
            break
        case "Rally-O":
            sport_main =+ charisma + speed + strength
            sport_other =+ agility + intelligence + stamina
            break
        case "Scent Hurdles":
            sport_main =+ charisma + intelligence + speed
            sport_other =+ agility + stamina + strength
            break
        case "Schutzhund":
            sport_main =+ intelligence + stamina + strength
            sport_other =+ agility + charisma +speed
            break
        case "Show":
            sport_main =+ charisma + intelligence + strength
            sport_other =+ agility + speed + stamina
            break
        case "Sledding":
            sport_main =+ speed + stamina + strength
            sport_other =+ agility + charisma + intelligence
            break
        case "Tracking":
            sport_main =+ intelligence + speed + stamina
            sport_other =+ agility + charisma + strength
            break
        case "Water Work":
            sport_main =+ agility + speed + strength
            sport_other =+ charisma + intelligence + stamina
            break
        default:

    }

    document.querySelector('[name="name"]').value = sport_main * 2 + sport_other
})();