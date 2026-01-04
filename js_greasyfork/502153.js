// ==UserScript==
// @name         我的文字修仙全靠刷
// @namespace    http://tampermonkey.net/
// @version      2024-07-30
// @description  自动战斗
// @license      MIT
// @author       You
// @match        https://setube.github.io/vue-XiuXianGame/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/502153/%E6%88%91%E7%9A%84%E6%96%87%E5%AD%97%E4%BF%AE%E4%BB%99%E5%85%A8%E9%9D%A0%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/502153/%E6%88%91%E7%9A%84%E6%96%87%E5%AD%97%E4%BF%AE%E4%BB%99%E5%85%A8%E9%9D%A0%E5%88%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var myPlayer = document.querySelector('.game-container-wrapper').__vue__._data.player;
    var isAttacking = false;
    var scriptActive = true; // 脚本是否活跃的状态
    var loopInterval;

    // 创建样式
    var style = document.createElement('style');
    style.innerHTML = `
        .toggle-switch {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 60px;
            height: 30px;
            background-color: #ccc;
            border-radius: 15px;
            cursor: pointer;
            z-index: 1000;
        }
        .toggle-switch .toggle-thumb {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 24px;
            height: 24px;
            background-color: #fff;
            border-radius: 50%;
            transition: all 0.3s;
        }
        .toggle-switch.active {
            background-color: #4caf50;
        }
        .toggle-switch.active .toggle-thumb {
            left: 33px;
        }
    `;
    document.head.appendChild(style);

    // 创建开关
    var toggleSwitch = document.createElement("div");
    toggleSwitch.className = "toggle-switch active";
    var toggleThumb = document.createElement("div");
    toggleThumb.className = "toggle-thumb";
    toggleSwitch.appendChild(toggleThumb);

    toggleSwitch.onclick = toggleScript;
    document.body.appendChild(toggleSwitch);

    function toggleScript() {
        scriptActive = !scriptActive;
        if (scriptActive) {
            toggleSwitch.classList.add("active");
            loopClickExploreButton();
        } else {
            toggleSwitch.classList.remove("active");
            clearInterval(loopInterval);
        }
    }

    function clickExploreButton() {
        if (!scriptActive) return;
        var buttons = document.querySelectorAll("button");
        if(myPlayer.level===40 && isAttacking){
            console.log("攻击世界boss");
            startAttackingWorldBoss();
            return;
        }
        buttons.forEach(function (button) {
            if (button.innerText === "继续探索" || button.innerText === "探索秘境"||button.innerText === "开始修炼" || button.innerText === "继续修炼"|| button.innerText === "突破境界") {


                if(!document.body.innerText.includes("实力不足提示")){
                    
                    button.click();
                    clickFightButtons();
                }else{
                    if (button.innerText === "开始修炼" || button.innerText === "继续修炼"|| button.innerText === "突破境界") {
                        console.log("开始修炼");
                        button.click();
                    }
                }

            }
        });
    }

    function attackTheWorldBoss() {
        if (!scriptActive) return;
        var buttons = document.querySelectorAll("button");
        buttons.forEach(function (button) {
            if (button.innerText === "世界BOSS" || button.innerText === "回到家里") {
                button.click();
                if(document.body.innerText.includes("BOSS还未刷新") ){
                    isAttacking = false;
                    return true;
                }
            }
        });
        buttons.forEach(function (button) {
            if (button.innerText === "攻击BOSS") {
                button.click();
            }
        });
        if (myPlayer.health === 0) {
            console.log("血量为0，停止攻击世界boss,三分钟后重试");
            isAttacking = false;
            document.querySelectorAll("button").forEach((button) => {
                console.log(button.innerText);
                if (button.innerText === "返回家里") {
                    button.click();
                }
            });
            return true;
        }
        buttons.forEach(function (button) {
            if (button.innerText === "发起战斗") {
                button.click();
            }
        });
        return false;
    }

    function startAttackingWorldBoss() {
        var attackInterval = setInterval(() => {
            if (isAttacking && scriptActive) {
                let stop = attackTheWorldBoss();
                if (stop) {
                    clearInterval(attackInterval);
                }
            }
        }, 100);
    }

    function resetVariable() {
        isAttacking = true;
    }
    setInterval(resetVariable, 180000);

    function clickFightButtons() {
        var fightIntervalId;
        function innerClickFightButtons() {
            if (!scriptActive) return;
            if(myPlayer.health === 0) {
                clearInterval(fightIntervalId);
                document.querySelectorAll("button").forEach((button) => {
                    if (button.innerText === "立马撤退") {
                        button.click();
                        if(!document.body.innerText.includes("撤退失败，请继续战斗。")){
                            clearInterval(fightIntervalId);
                            loopClickExploreButton();
                        }
                    }
                });
            }
            if(myPlayer.health < myPlayer.maxHealth * 0.1) {
                clearInterval(fightIntervalId);
                autoRest();
                return;
            }
            var fightButtonClicked = false;
            var buttons = document.querySelectorAll("button");
            buttons.forEach(function (button) {
                if (button.innerText === "发起战斗") {
                    button.click();
                    fightButtonClicked = true;
                }
            });
            if (fightButtonClicked) {
                return;
            }
        }
        fightIntervalId = setInterval(innerClickFightButtons, 100);
    }

    function autoRest() {
        if (!scriptActive) return;
        let healthValue = myPlayer.health;
        let maxHealth = myPlayer.maxHealth;
        console.log("血量低于最大血量的10%，开始打坐休息...");
        let restInterval = setInterval(() => {
            document.querySelectorAll("button").forEach((button) => {
                if (button.innerText === "回到家里") {
                    button.click();
                    clearInterval(restInterval);
                    console.log("发现“回到家里”按钮，停止打坐休息。");
                }
            });
            healthValue = myPlayer.health;
            if (healthValue < maxHealth) {
                document.querySelectorAll("button").forEach((button) => {
                    if (button.innerText === "打坐休息" || button.innerText === "继续打坐") {
                        button.click();
                    }
                });
            }
            healthValue = myPlayer.health;
            if (healthValue >= maxHealth) {
                document.querySelectorAll("button").forEach((button) => {
                    if (button.innerText === "继续干他") {
                        button.click();
                    }
                });
                clearInterval(restInterval);
                clickFightButtons();
            }
        }, 100);
    }

    function loopClickExploreButton() {
        loopInterval = setInterval(function () {
            clickExploreButton();
        }, 100);
    }

    loopClickExploreButton();
})();
