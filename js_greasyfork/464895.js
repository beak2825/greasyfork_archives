// ==UserScript==
// @name         骑士进度条2 MOD自定义倍速
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  骑士进度条2 MOD自定义倍速，点击游戏标题右侧修改倍速，即时生效
// @author       Ymmzy
// @match        https://progress-knight2-mod.g8hh.com/
// @match        https://gityxs.github.io/progress-knight2-mod/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=g8hh.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464895/%E9%AA%91%E5%A3%AB%E8%BF%9B%E5%BA%A6%E6%9D%A12%20MOD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/464895/%E9%AA%91%E5%A3%AB%E8%BF%9B%E5%BA%A6%E6%9D%A12%20MOD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==
/* eslint-env jquery */

const getValue = function (key, defaultValue) {
    let value = JSON.parse(window.localStorage.getItem(key))
    return value || defaultValue
}

const setValue = function (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

console.log("加载倍速模块")
var customSpeed = getValue("customSpeed", 1); //不需要手动修改，初始1倍速度，点击游戏右上角版本号左边可动态自定义倍速并储存，下次进入游戏自动读取

//这种可能会卡
/*const oldUpdate = update;
update = function(needUpdateUI = true) {
    for (let i = 1; i < customSpeed; i++) oldUpdate(false)
    oldUpdate(true)
}*/

applySpeed = function(value) {
    if (value == 0) return 0
    if (value == Infinity) return Infinity
    return value * getGameSpeed() / updateSpeed * customSpeed
}

applySpeedOnBigInt = function(value) {
    if (value == 0n) return 0n
    return value * BigInt(Math.floor(getGameSpeed())) / BigInt(Math.floor(updateSpeed)) * BigInt(customSpeed)
}

increaseRealtime = function() {
    if (!canSimulate()) return;
    gameData.realtime += 1.0 / updateSpeed * customSpeed
    gameData.realtimeRun += 1.0 / updateSpeed * customSpeed
    gameData.rebirthOneTime += 1.0 / updateSpeed * customSpeed
    gameData.rebirthTwoTime += 1.0 / updateSpeed * customSpeed
    gameData.rebirthThreeTime += 1.0 / updateSpeed * customSpeed
    gameData.rebirthFourTime += 1.0 / updateSpeed * customSpeed
    gameData.rebirthFiveTime += 1.0 / updateSpeed * customSpeed

    if (gameData.boost_active) {
        gameData.boost_timer -= 1.0 / updateSpeed * customSpeed
        if (gameData.boost_timer < 0) {
            gameData.boost_timer = 0
            gameData.boost_active = false
            gameData.boost_cooldown = getBoostCooldownSeconds()
        }
    }
    else {
        gameData.boost_cooldown -= 1.0 / updateSpeed * customSpeed
        if (gameData.boost_cooldown < 0) gameData.boost_cooldown = 0
    }
}

applyMilestones = function() {
    if (((gameData.requirements["Magic Eye"].isCompleted()) && (gameData.requirements["Rebirth note 2"].isCompleted())) ||
        (gameData.requirements["Almighty Eye"].isCompleted())){
        for (taskName in gameData.taskData) {
            const task = gameData.taskData[taskName]
            const effect = gameData.taskData["Cosmic Recollection"].getEffect()
            const maxlevel = Math.floor(task.level * (effect == 0 ? 1 : effect))
            if (maxlevel > task.maxLevel)
                task.maxLevel = maxlevel
        }
    }

    if (canSimulate()) {
        if (gameData.requirements["Deal with the Devil"].isCompleted() && gameData.requirements["Rebirth note 3"].isCompleted()) {
            if (gameData.evil == 0)
                gameData.evil = 1
            for (let i = 0; i < customSpeed; i++){
                if (gameData.evil < getEvilGain())
                    gameData.evil *= Math.pow(1.001, 1)
            }
        }

        if (gameData.requirements["Hell Portal"].isCompleted()) {
            if (gameData.evil == 0)
                gameData.evil = 1
            for (let i = 0; i < customSpeed; i++){
                if (gameData.evil < getEvilGain()) {
                    const exponent = gameData.requirements["Mind Control"].isCompleted() ? 1.07 : 1.01
                    gameData.evil *= Math.pow(exponent, 1)
                }
            }
        }

        if (gameData.requirements["Galactic Emperor"].isCompleted()) {
            if (gameData.essence == 0)
                gameData.essence = 1
            for (let i = 0; i < customSpeed; i++){
                if (gameData.essence < getEssenceGain() * 10)
                    gameData.essence *= Math.pow(1.002, 1)
                if (gameData.essence == Infinity)
                    gameData.essence = 1e308
            }
        }
    }
}

let timer = setInterval(() => {
    if (typeof $ == "function" && $("#body > div.w3-margin > div.header > img").length > 0) {
        clearInterval(timer)
        $("#body > div.w3-margin > div.header > h3").append(`   <span id="customSpeed" class="version" style="font-size: medium">自定义倍速</span>`)
        $("#customSpeed").text("自定义倍速x" + customSpeed)
        $("#customSpeed").on("click", () => {
            let input = prompt("自定义倍速（仅限正数）\n存储在localStorage中，下次进入游戏自动读取", customSpeed)
            if (isNaN(Number(input)) == false && Number(input) > 0) {
                customSpeed = input * 1
                setValue("customSpeed", customSpeed)
                $("#customSpeed").text("自定义倍速x" + customSpeed)
            } else {
                alert("输入有误,仅限正数")
            }
        })
    }
}, 100)