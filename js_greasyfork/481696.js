// ==UserScript==
// @name         RollerCoin little helper
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  This script just help to choose more profitable miner when you set miners in room and to notice games which have one play to rise difficulty level. Of course my ref link: https://rollercoin.com/?r=lcy2is9p
// @author       Heymdale
// @match        https://rollercoin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rollercoin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481696/RollerCoin%20little%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/481696/RollerCoin%20little%20helper.meta.js
// ==/UserScript==

(function() {

    let reloadInterval = 20000;
    let toReload = window.localStorage.getItem("toReload");
    let toBeep = window.localStorage.getItem("toBeep");
    // stopReload stops reload then there are green items.
    let stopReload = false
    const delimiter = " | ";
    const csvSeparator = ';';

    if (toReload === null){
        window.localStorage.setItem("toReload", "false");
        toReload = "false";
    }
    if (toBeep === null){
        window.localStorage.setItem("toBeep", "false");
        toBeep = "false";
    }

    window.addEventListener('load', function()
                            {
        waitHeadLine();
        window.setInterval(main, 1000);
    }, false);

    document.addEventListener('keydown', function(e) {
        if (event.keyCode === 49) {
            if (toReload == "true"){
                toReload = "false";
            }
            else{
                toReload = "true"
            }
            changeTitle();
            window.localStorage.setItem("toReload", toReload);
        }
        if (event.keyCode === 50) {
            if (toBeep == "true"){
                toBeep = "false";
            }
            else{
                toBeep = "true"
            }
            changeTitle();
            window.localStorage.setItem("toBeep", toBeep);
        }
        if (event.keyCode === 51) {
            showAbsolutePower();
        }
        if (event.keyCode === 52) {
            sortMinersByTruePower();
        }
        if (event.keyCode === 53) {
            sortMinersByTruePower(true);
        }
    });

    function isChooseGamePage() {
        return (window.location.href == "https://rollercoin.com/game/choose_game");
    }

    function beep() {
        let snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        snd.play();
    }

    function _main(){
        let mainToBeep = false
        stopReload = false
        let gameDivs = document.querySelectorAll(".choose-game-item-container");
        for (let i = 0; i < gameDivs.length; i++) {
            let progressBars = gameDivs[i].querySelectorAll(".progress-block");
            let difficulty = gameDivs[i].querySelectorAll(".game-information-number")[0].innerText
            let secondProgressBar = progressBars[progressBars.length - 2];
            let secondProgressBarDiv = secondProgressBar.firstChild.getAttribute("aria-valuenow");
            let lastProgressBar = progressBars[progressBars.length - 1];
            let thirdProgressBarDiv = lastProgressBar.firstChild.getAttribute("aria-valuenow");
            if (thirdProgressBarDiv == "100" && difficulty != "10"){
                let buttonText = gameDivs[i].querySelector(".btn-text").innerText;
                if (buttonText == 'START'){
                    gameDivs[i].style.color = "LightGreen";
                    // Page will not reload if there are game with one play to rise level
                    stopReload = true
                    if (toBeep == "true"){
                        mainToBeep = true;
                    }
                }
                else if (buttonText == 'WAIT...'){
                    gameDivs[i].style.color = "red";
                }
            }
            else if (secondProgressBarDiv == "100" && difficulty != "10"){
                let buttonText = gameDivs[i].querySelector(".btn-text").innerText;
                if (buttonText == 'START'){
                    gameDivs[i].style.color = "Cyan";
                }
                else if (buttonText == 'WAIT...'){
                    gameDivs[i].style.color = "Blue";
                }
            }
            else{
                gameDivs[i].style.color = "white";
            }
        }
        if (mainToBeep) {
            beep();
        }
    }

    // Function must spy for document and change headline when it appears,
    // because "onload" needed tag didn't exist.
    // All this function is kluge.
    // It try to change <h1> every time then document.body get or lost child.
    function waitHeadLine(){
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes.length) return
                if (!isChooseGamePage()) return
                if (document.querySelector("h1.choose-game-title") !== null) changeTitle();
            })
        })

        observer.observe(document.body, {
            childList: true
        })
    }

    // Added state of the userscript to headline
    function changeTitle(){
        let headLine = document.querySelector("h1.choose-game-title");
        let reloaderText = toReload == "true" ? "on" : "off";
        let beeperText = toBeep == "true" ? "on" : "off";
        if (headLine !== null)
        {
            headLine.innerText= "Play games to rise your power\n" +
                "Reloader:" + reloaderText + " Beeper:" + beeperText;
        }
    }


    /* Functions to show miner power */
    function showAbsolutePower(){
        let powerBonus = getPowerBonus();
        let globalPower = powerBonus[0];
        let globalBonus = powerBonus[1];
        console.log("g_pow = ", globalPower, "g_bonus = ", globalBonus)
        let cards = document.querySelectorAll(".item-card");
        cards.forEach((element) => {
            if (element.querySelectorAll(".item-card-result-power").length > 0) return;
            let powerEl = element.querySelector(".item-card-power");
            let bonusEl = element.querySelector(".item-card-bonus");
            let power = normalizePower(powerEl.innerText);
            let bonus= parseFloat(bonusEl.innerText) / 100;
            let resultPower = Math.round(power * (globalBonus+bonus) + bonus * (globalPower+power));
            console.log("power =", power, "bonus =", bonus * 100, "%\n", resultPower);
            let span = document.createElement("span");
            span.className = "item-card-result-power";
            span.append(delimiter, resultPower);
            bonusEl.parentElement.append(span)
        });
        let cardList = document.querySelector(".items-cards-wrapper");
        sortListByResultPower(cardList)
    }

    // функция сортировки
    function sortListByResultPower(list) {
        let listElements = Array.prototype.slice.call(list.children); // превращаем NodeList в настоящий массив
        // сортируем
        listElements.sort(function(a, b) {
            return (getValue(b)) - (getValue(a));
        })
        // очищаем родительский контейнер
        list.innerHTML = ''
        // вставляем элементы в новом порядке
        listElements.forEach(function(el) {
            list.appendChild(el)
        });
    }

    function getValue(a) {
        let resultPowerEl = a.querySelector(".item-card-result-power")
        return parseFloat(resultPowerEl.innerText.replace(delimiter, ""));
    }

    // Get current power and bonus from https://rollercoin.com/game page.
    // Power is calculate as "total power" / bonus, it's not raw power, but the best until we can manually set value
    function getPowerBonus(){
        let bonusPowerEl = document.querySelectorAll(".bonus-percent-power-wrapper");
        let bonusMultiplier = 1 + parseFloat(bonusPowerEl[0].innerText) / 100;
        let power = normalizePower(bonusPowerEl[1].innerText) / bonusMultiplier;
        return [power, bonusMultiplier]
    }

    // Normalize string power like "123.23 Ph/s" to Th/s
    function normalizePower(powStr) {
        let multiplier = 1;
        switch (powStr.trim().toLowerCase().slice(-4)) {
            case "gh/s":
                multiplier = 1/1000;
                break;
            case "ph/s":
                multiplier = 1000;
                break;
            case "eh/s":
                multiplier = 1000000;
                break;
            case "zh/s":
                multiplier = 1000000000;
                break;
        }
        return parseFloat(powStr) * multiplier;
    }


    //Start of sort miners block
    function sortMinersByTruePower(isShelvesLimit = false) {

        if (window.location.href != "https://rollercoin.com/storage/inventory/miners") return;

        let freeShelvesCount = 1;
        if (isShelvesLimit){
            freeShelvesCount = parseInt(window.prompt("How many free shelves do you have?", '1'));
            if (freeShelvesCount == null || isNaN(freeShelvesCount)) freeShelvesCount = 1;
            console.log('Free shelves count =', freeShelvesCount);
        }

        let currentPower = parseFloat(window.prompt("What's your RAW Power in Ph/s?", '0'));
        if (currentPower == null || isNaN(currentPower)) currentPower = 0;
        // Convert to Th/s
        currentPower *= 1000
        console.log('currentPower in Th/s =', currentPower);
        let currentBonus = parseFloat(window.prompt("What's your current bonus in %?", '0'));
        if (currentBonus == null || isNaN(currentBonus)) currentBonus = 0;
        console.log('currentBonus in % =', currentBonus);

        let minersBlock = document.querySelector('.inventory-parts-container.row');
        let minersElements = minersBlock.querySelectorAll('.card-wrapper');
        let tempMinersTable = {};
        let tempMinersIndex = 0;
        for (let i=0; i < minersElements.length; i++) {
            let minerInfo = {}
            minerInfo.name = getMinerName(minersElements[i]);
            minerInfo.level = getMinerLevel(minersElements[i]);
            minerInfo.power = getMinerPower(minersElements[i]);
            minerInfo.bonus = getMinerBonus(minersElements[i]);
            minerInfo.isSmall = isMinerSmall(minersElements[i]);
            minerInfo.quantity = getMinerQuantity(minersElements[i]);
            if ((minerInfo.bonus > 0) && (minerInfo.quantity > 1)) {
                tempMinersTable[tempMinersIndex] = {}
                for (let key in minerInfo) {
                    tempMinersTable[tempMinersIndex][key] = minerInfo[key];
                }
                //tempMinersTable[tempMinersIndex] = minerInfo;
                tempMinersTable[tempMinersIndex].quantity = 1;
                tempMinersIndex++;
                minerInfo.name += ' duplicate';
                minerInfo.bonus = 0;
                minerInfo.quantity -= 1;
            }
            tempMinersTable[tempMinersIndex] = minerInfo;
            tempMinersIndex++;
        }

        let sortedMiners = sortMiners(tempMinersTable, currentPower, currentBonus)

        if (isShelvesLimit) {
            let minersSortedByPower = sortMinersByPower(sortedMiners, freeShelvesCount)
            const firstLine = 'Name and Level' + csvSeparator + 'Power in Gh/s' + csvSeparator + 'Second miner Name and Level ' + csvSeparator + 'Second miner Power in Gh/s' + csvSeparator + 'Summary power in Gh/s\n';
            let csvData = firstLine + minersSortedByPower.map(row => row.join(csvSeparator)).join('\n')
            downloadAsFile("rollercoin_miners_sorted_by_power.csv", csvData);
            return
        }

        const firstLine = 'Num' + csvSeparator + 'Name and Level' + csvSeparator + 'Power in Gh/s' + csvSeparator + 'Second miner Name and Level ' + csvSeparator + 'Second miner Power in Gh/s\n';
        let csvData = convertToCSV(sortedMiners, firstLine);
        downloadAsFile("rollercoin_sorted_miners.csv", csvData);
    }

    function getMinerName(minerElement){ return minerElement.querySelector('.name-title').innerText;}
    function getMinerLevel(minerElement){
        let node = minerElement.querySelector('.card-badges').querySelector('img');
        if (node == null) return 1;
        let level = node.alt;
        if (level == 'Rating star') return 'star';
        return +level + 1;
    }
    function getMinerPower(minerElement){ return normalizePower(minerElement.querySelector('.power-value').innerText)}
    function getMinerBonus(minerElement){ return parseFloat(minerElement.querySelector('.bonus-power-value').innerText)}
    function isMinerSmall(minerElement){ return (parseInt(minerElement.querySelector('.size-value').innerText) == 1)}
    function getMinerQuantity(minerElement){ return parseInt(minerElement.querySelector('.quantity-value').innerText)}

    function sortMiners(minersTable, currentPower, currentBonus) {
        let calculatedPower = currentPower;
        let calculatedBonus = currentBonus;
        let sortedMiners = {};
        let smLine = 0;
        let keys = Object.keys(minersTable);
        while (keys.length > 0) {
            // Will start sortedMiners with line 1
            smLine++;
            let maxTruePower = 0;
            let maxTruePowerKey = keys[0];
            let secondMinerKeyIfFirstMinerSmall = NaN
            for (const key in keys) {
                let miner = minersTable[keys[key]];
                let bonus = calculatedBonus + miner.bonus
                let power = (calculatedPower + miner.power) * (100 + bonus) / 100;
                if (miner.isSmall) {
                    let maxSmallPairTruePower = power
                    let MaxPowerSecondMinerKey = NaN
                    for (let i=key; i < keys.length; i++) {
                        let secondMiner = minersTable[keys[i]];
                        if (!secondMiner.isSmall) continue;
                        // Check if second miner the same as first and have quantity more than one
                        if (i==key && secondMiner.quantity == 1) continue;
                        bonus = calculatedBonus + miner.bonus + secondMiner.bonus;
                        power = (calculatedPower + miner.power + secondMiner.power) * (100 + bonus) / 100;
                        if (power > maxSmallPairTruePower) {
                            maxSmallPairTruePower = power;
                            MaxPowerSecondMinerKey = keys[i];
                        }
                    }
                    power = maxSmallPairTruePower;
                    // throw up second miner key to temp variable
                    if (power > maxTruePower) {
                        secondMinerKeyIfFirstMinerSmall = MaxPowerSecondMinerKey;
                    }
                }
                if (power > maxTruePower) {
                    maxTruePower = power;
                    maxTruePowerKey = keys[key];
                }
            }
            let maxMiner = minersTable[maxTruePowerKey];
            let extraPower = maxMiner.power;
            let extraBonus = maxMiner.bonus;
            sortedMiners[smLine] = {};
            sortedMiners[smLine].nameLevel = maxMiner.name + ' level: ' + maxMiner.level;
            // Used power in GH/s cause various region used "," and "." to separate fractional part
            sortedMiners[smLine].power = parseInt(maxMiner.power * 1000);
            if (maxMiner.isSmall && !isNaN(secondMinerKeyIfFirstMinerSmall)){
                let maxSecondMiner = minersTable[secondMinerKeyIfFirstMinerSmall];
                extraPower += maxSecondMiner.power;
                extraBonus += maxSecondMiner.bonus;
                sortedMiners[smLine].secondMinerNameLevel = maxSecondMiner.name + ' level: ' + maxSecondMiner.level;
                // Used power in GH/s cause various region used "," and "." to separate fractional part
                sortedMiners[smLine].secondMinerPower = parseInt(maxSecondMiner.power * 1000);
                maxSecondMiner.quantity --;
                if (maxSecondMiner.quantity == 0) {
                    delete minersTable[secondMinerKeyIfFirstMinerSmall];
                }
            }
            calculatedPower += extraPower;
            calculatedBonus += extraBonus;
            maxMiner.quantity --;
            if (maxMiner.quantity == 0) {
                delete minersTable[maxTruePowerKey];
            }
            keys = Object.keys(minersTable);
        }
        return sortedMiners
    }

    function downloadAsFile(filename, data) {
        let a = document.createElement("a");
        let file = new Blob([data], {type: "text/plain"});
        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();
    }

    function sortMinersByPower(sortedMiners, shelvesCount){
        let result = [];
        let smallMiners = [];
        let pairsOfSmallMiners =[];
        let keys = Object.keys(sortedMiners)
        for (let i=0; i<keys.length && i<shelvesCount;i++){
            let shelf = sortedMiners[keys[i]];
            if ('secondMinerNameLevel' in shelf){
                smallMiners.push([shelf.nameLevel, shelf.power]);
                smallMiners.push([shelf.secondMinerNameLevel, shelf.secondMinerPower]);
            }
            else {
                result.push([shelf.nameLevel, shelf.power,,,shelf.power])
            }
        }
        smallMiners.sort((a, b) => b[1] - a[1])
        for (let i=0; i<smallMiners.length; i+=2) {
            result.push([smallMiners[i][0], smallMiners[i][1], smallMiners[i+1][0], smallMiners[i+1][1], smallMiners[i][1] + smallMiners[i+1][1]]);
        }
        result.sort((a, b) => b[4] - a[4])
        return result;
    }

    function convertToCSV(arr, firstLine) {
        return firstLine + (Object.keys(arr).map(key => {return ([key].concat(Object.values(arr[key])).join(csvSeparator))}).join('\n'))
    }

    //End of sort miners block


    /* Wrap all functions */
    function main(){
        if (isChooseGamePage()) _main();
    }

    setInterval(function(){
        if (toReload == "true" && stopReload == false) {
            if (isChooseGamePage()) document.location.reload();
        }
    }, reloadInterval);

})();