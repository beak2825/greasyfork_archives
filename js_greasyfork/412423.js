// ==UserScript==
// @name         Auto SimpleMMO
// @namespace    https://simple-mmo.com/
// @version      0.0.1
// @description  Plays SMMO for you
// @author       Aldo-f
// @match        https://web.simple-mmo.com/travel
// @match        http://web.simple-mmo.com/travel
// @match        https://web.simple-mmo.com/jobs/view/*
// @match        http://web.simple-mmo.com/jobs/view/*
// @match        https://web.simple-mmo.com/npcs/attack/*
// @match        http://web.simple-mmo.com/npcs/attack/*
// @downloadURL https://update.greasyfork.org/scripts/412423/Auto%20SimpleMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/412423/Auto%20SimpleMMO.meta.js
// ==/UserScript==

// global vars
gPages = {
    'job': "https://web.simple-mmo.com/jobs/view/*",
    'travel': "https://web.simple-mmo.com/travel",
    'travel': "https://web.simple-mmo.com/npcs/attack/*",
};
gBtn = {
    'me': "body > div:nth-child(3) > main > div.container-two > div:nth-child(3) > div.row > div:nth-child(1) .kt-widget25__item",
    'enemy': "#enemyBox .kt-widget25__item",
    'job': "body > div:nth-child(3) > main > div.container-two a.btn.btn-success",
    'step': "#travel button.btn.btn-primary.stepbuttonnew",
    'jobConfirm': "body > div.swal2-container.swal2-center.swal2-shown div.swal2-actions > button.swal2-confirm.swal2-styled"
};

// on all pages
(function loop() {
    console.log('loop')
    let rand = getRandom()
    console.log(rand)
    setTimeout(function () {
        if (autoClick())
            if (doJob())
                if (doAttack())
                    if (loop());
    }, rand)
}())

function autoClick() {
    console.log("autoClick")
    let btn = gBtn.step
    if ($(btn).length > 0) {
        console.log("found btn step")
        $(btn).trigger("click")
        setTimeout(e => { }, 12000)
    }
    return 1
}

function doJob() {
    console.log("doJob")
    let btn = gBtn.job
    if ($(btn).length > 0) {
        console.log("found btn job")
        $(btn).trigger("click")
        setTimeout(e => { }, 1000)
        let confirm = gBtn.jobConfirm
        $(confirm).trigger("click")
    }
    return 1
}

function doAttack() {
    console.log("doAttack")
    let uri = "https://web.simple-mmo.com/npcs/attack/*"
    let special_btn = "#attackButton_special"
    let btn = "#attackButton"

    let enemy = checkHp(gBtn.enemy)
    let me = checkHp(gBtn.me)

    if (enemy.current > 50) {
        var special = true
    }

    if (special && $(special_btn).length > 0) {
        console.log("found special-attack btn")
        var attack_btn = special_btn
    } else if ($(btn).length > 0) {
        console.log("found attack btn")
        var attack_btn = btn
    } else {
        // not possible to attack
        console.log("not possible to attack")
    }

    if (attack_btn) {
        $(attack_btn).trigger("click")
    }
    return 1
}

function checkHp(target) {
    data = {};

    data.percent = $(target).children("#user-hp-percent").val();
    if (!data.percent)
        data.percent = $(target).children("#npc-hp-percent").val();

    data.current = $(target).children("#your-hp").val();
    if (!data.current)
        data.current = $(target).children("#their-hp").val();

    console.log(data);
    return data;
}

function getRandom() {
    let min = 3500
    if (Math.random() > 0.95) min = 25000
    return Math.round(Math.random() * (8000)) + min
}
