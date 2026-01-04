// ==UserScript==
// @name         Auto Birthday Mapper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  auto your gilded lol
// @author       You
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422655/Auto%20Birthday%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/422655/Auto%20Birthday%20Mapper.meta.js
// ==/UserScript==
// document.getElementsByClassName('superBrieFactoryHUD-factoryRoom break_room level_5 superBrieFactoryHUD-factoryRoom-level mousehuntActionButton tiny')[0], 'click');
// break_room, mixing_room, quality_assurance_room, pumping_room

(function() {
    const interval = setInterval(function() {
        check()
    }, 5000);
})();

check()
function findCommonElements(arr1, arr2) {
    if (arr1 == null || arr2 == null) return;
    return arr1.some(item => arr2.includes(item))
}


function check() {
    if (user.environment_name != "SUPER|brie+ Factory"){
        return
    }
    let remaining_mice = JSON.parse(localStorage.getItem("tsitu-maptem-mapmice"));
    if (remaining_mice == null) {
        return;
    }
    if (remaining_mice.length == 0 && user.bait_name != "Speedy Coggy Colby"){
        console.log("switch cheese to colby");
        hg.utils.TrapControl.setBait('speed_coggy_colby_cheese').go();
        hg.utils.TrapControl.setTrinket(2174).go();
    }
    let super_magic = {"break_room": "data"}
    var b1 = {"break_room": 1,
              "mixing_room": 0,
             "quality_assurance_room": 3,
              "pumping_room": 2,
             }
    let magic_dict = {
        "mixing_room": [
            "Force Fighter Blue",
            "Force Fighter Green",
            "Force Fighter Pink",
            "Force Fighter Red",
            "Force Fighter Yellow",
            "Super FighterBot MegaSupreme",
        ],
        "quality_assurance_room": [
            "Cupcake Candle Thief",
            "Cupcake Cutie",
            "Sprinkly Sweet Cupcake Cook",
            "Cupcake Camo",
            "Cupcake Runner"
        ],
        "break_room": ["Breakdancer",
                       "Fete Fromager",
                       "Dance Party",
                       "El Flamenco",
                       "Para Para Dancer"],
        "pumping_room": [
            "Reality Restitch",
            "Time Punk",
            "Time Tailor",
            "Time Thief",
            "Space Party-Time Plumber"
        ]}
    let magic2_dict = {"SB": ["Cheesy Party",
                              "Birthday",
                              "Buckethead",
                              "Present",
                              "Pintail",
                              "Dinosuit",
                              "Sleepwalker",
                              "Terrible Twos" ] }
    // mixing document.getElementsByClassName('superBrieFactoryHUD-factoryRoom')[0].children[1].click()

    for (const check_room of Object.keys(magic_dict)){
        console.log("checking", check_room);
        if (findCommonElements(magic_dict[check_room], remaining_mice)){
            if (user.bait_name != "Speedy Coggy Colby"){
                console.log("switch cheese to colby");
                hg.utils.TrapControl.setBait('speed_coggy_colby_cheese').go();
            }
            if (user.quests.QuestSuperBrieFactory.factory_atts.current_room == check_room) return;
            console.log(check_room, "present")
            document.getElementsByClassName('superBrieFactoryHUD-factoryRoom')[b1[check_room]].children[1].click()
            return;
        }
    }
    if (user.bait_name != "SUPER|brie+"){
        for (const check_bait of Object.keys(magic2_dict)){
            if (findCommonElements(magic2_dict[check_bait], remaining_mice)){
                console.log("switch cheese to sb+");
                hg.utils.TrapControl.setBait('super_brie_cheese').go();
                hg.utils.TrapControl.setTrinket(2780).go();
            }
        }
    }
}