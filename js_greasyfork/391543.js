// ==UserScript==
// @name         Automate Arcanum
// @name:hu      Automata Arcanum
// @namespace    https://greasyfork.org/users/390287
// @version      0.001
// @description  Plays (mostly) automatically instead of you. Work very much in progress.
// @description:hu  Automatizáló script az Arcanum játékhoz.
// @author       Yoyó
// @icon         https://i.ibb.co/Y7W0Zwd/pinkieemote.png
// @match        http://www.lerpinglemur.com/arcanum/
// @match        https://game312933.konggames.com/gamez/0031/2933/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391543/Automate%20Arcanum.user.js
// @updateURL https://update.greasyfork.org/scripts/391543/Automate%20Arcanum.meta.js
// ==/UserScript==

//user settings
var timeToIdle = 3; //how many ticks should it take for the idle stuff to kick in. default 3
var stamToKeep = 80; // stamina to keep for stuff, in percentage. default 80
var tickTime = 2000; // how many milliseconds should a tick take. default 2000

//program starts here

var idleTimer = 0;
var idling = 0;
const data = {
    "qa": { //for quick action
        "Clean Stables":{
            "stam":-0.08,
            "virtue":0.1,
            "gold":0.2
        },
        "Buy Scroll":{
            "gold":-10,
            "scrolls":1
        }
    }
}

var repetitionIsTheKeyToSuccess = window.setInterval (function(){
    let stamXPath="//div[@class='vitals']//table[@class='bars']//div[@class='stamina']//span[@class='bar-text']";
    let stamText = document.evaluate(stamXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let stamValues = stamText.textContent.split("/");
    let currentStam = parseFloat(stamValues[0]);
    let maxStam = parseFloat(stamValues[1]);
    let goldXPath = "//div[@class='resource-list']/tr[@class='item-name']/td[text()='gold']/following-sibling::td[@class='num-align']";
    let goldText = document.evaluate(goldXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let goldValues = goldText.textContent.split("/");
    let currentGold = parseInt(goldValues[0]);
    let maxGold = parseInt(goldValues[1]);
    let pumpkinXPath = "//div[@class='resource-list']/tr[contains(@class,'item-name')]/td[text()='pumpkins🎃']/following-sibling::td[@class='num-align']";
    let pumpkinText = document.evaluate(pumpkinXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let pumpkinValues = pumpkinText.textContent.split("/");
    let currentPump = parseInt(pumpkinValues[0]);
    let maxPump = parseInt(pumpkinValues[1]);
    let toStam = maxStam*stamToKeep/100;
    let jackoXPath = `//div[@class='resource-list']/tr[contains(@class,'item-name')]/td[text()="jack o' lantern🎃"]/following-sibling::td[@class='num-align']`;
    let jackoText = document.evaluate(jackoXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let jackoValues = jackoText.textContent.split("/");
    let currentJacko = parseInt(jackoValues[0]);
    let maxJacko = parseInt(jackoValues[1]);

    let runningXPath = "//div[@class='vitals']/div[@class='running']/div/span/text()";
    let runningText = document.evaluate(runningXPath, document, null, XPathResult.STRING_TYPE, null);

    let restXPath = "//div[@class='vitals']/div[@class='separate']/button[2]";
    let restButton = document.evaluate(restXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let studyXPath = "//span[@class='action-btn runnable']/button[text()='study']";
    let studyButton = document.evaluate(studyXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let filchXPath = "//span[@class='action-btn runnable']/button[text()='filch pumpkins🎃']";
    let filchButton = document.evaluate(filchXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let carveXPath = "//span[@class='action-btn runnable']/button[text()='carve lantern🎃']";
    let carveButton = document.evaluate(carveXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    let cleanStableXPath = "//span[contains(@class,'action-btn')]/button[text()='Clean Stables']";
    let cleanStableButton = document.evaluate(cleanStableXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!cleanStableButton.disabled && currentGold < maxGold && currentStam > toStam) {
        let needToRun = (maxGold - currentGold)/data.qa["Clean Stables"].gold;
        while (needToRun > 0 && !cleanStableButton.disabled && currentStam > toStam) {
            cleanStableButton.click();
            currentStam = currentStam + data.qa["Clean Stables"].stam;
            needToRun = needToRun - 1;
        }
    }

    let upgradeXPath = "//div[@class='upgrade-list'][1]/span[@class='action-btn' and not(@class='locked')]/button[@class='wrapped-btn' and not(@disabled)]";
    let upgradeButton = document.evaluate(upgradeXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (upgradeButton != null) {
        upgradeButton.click();
    }

    let buyScrollXPath = "//span[@class='action-btn']/button[text()='Buy scroll' and not(@disabled)]";
    let buyScrollButton = document.evaluate(buyScrollXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (buyScrollButton !== null && currentGold == maxGold) {
        buyScrollButton.click();
    }

    if (idling === 0) {
        idleTimer = idleTimer + 1;
    }
    if (idleTimer >= timeToIdle) {
        idleTimer = 0;
        idling = 1;
    }
    if (idling == 100) {
        if (runningText.stringValue != "studying scrolls") {
            if(runningText.stringValue != "resting") {
                idling = 0;
            }
        }
    }
    if (idling == 2) {
        if (currentPump == maxPump && runningText.stringValue === "") {
            idling = 1;
        }
    }
    if (idling == 3) {
        if (currentJacko == maxJacko) {
            idling = 2;
            filchButton.click();
        }
    }
    if (idling == 1) {
        if (currentStam <= maxStam && runningText.stringValue === "") {
            restButton.click();
        }
        if (currentStam == maxStam && runningText.stringValue === "") {
            if (filchButton !== null) {
                if (!filchButton.disabled) {
                    filchButton.click();
                    idling = 2;
                } else if (carveButton !== null) {
                    carveButton.click();
                    idling = 3;
                } else if (studyButton !== null) {
                    if (!studyButton.disabled) {
                        studyButton.click();
                        idling = 100;
                    }
                }
            } else if (studyButton !== null) {
                if (!studyButton.disabled) {
                    studyButton.click();
                    idling = 100;
                }
            }
        }
    }
},tickTime);