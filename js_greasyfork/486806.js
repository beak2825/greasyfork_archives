// ==UserScript==
// @name         Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.24.2 [Internal]
// @description  Helper is an automatic worker script for Travian.
// @author       LillaMilla, Vikica
// @include      *.travian.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486806/Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486806/Helper.meta.js
// ==/UserScript==

(function () {

    TravianHelper = {
        playerId: 0,
        fLists: {},
        villageData: {},
        enableSend: true,
        enableConfirm: true,
        foundOnFarmlist: false,
        confirmDelayMinMs: 300,
        confirmDelayMaxMs: 1000,
        nextVillageDelayMinMs: 350,
        nextVillageDelayMaxMs: 850,
        army: [],
        sendingOutAllFarmLists: false,
        sendingOutFarmList: false,
        sendingOutFarmListIdx: 0,
        villageIds: [],
        currentTask: -1, // 0 - farmlist sending, 0.1 - oasis farmlist sending, 1 - village check, 2 - building
        doVillageCheck: true,
        doVillageChecksWithoutFarming: false,
        quickVillageCheck: false,
        quickVillageCheckStep: -1,
        villageCheckTimes: { min: 1500, max: 1800 },
        quickAttackCheckEnabled: true,
        quickAttackCheckTimes: { min: 90, max: 150 },
        nextVillageCheckTime: 0,
        farmSendTimes: { min: 300, max: 330 },
        oasisFarmSendTimes: { min: 300, max: 330 },
        nextFarmSendTime: 0,
        nextOasisFarmSendTime: 0,
        farmSendingEndTime: 0,
        buildCheckTimes: { min: 30, max: 40 },
        nextBuildCheckTime: 0,
        goldClub: false,
        wheatWarningSeconds: 1800,
        wheatFillSeconds: 1800,
        heroGet: { villageId: 0, wood: 0, clay: 0, iron: 0, wheat: 0, originalHref: "" },
        heroResources: {wood: 0, clay: 0, iron: 0, wheat: 0},
        heroSaferResourceGet: true,
        oasisFarmLists: [],
        enableMessageNotification: true,
        previousMessageCount: 0,
        farmListProfiles: [],
        farmListProfileConnections: [],
        logs: [],
        checkTaskEnd: false,
        warehouseFullWarning: true,
        granaryFullWarning: false,
        fullnessWarningPercent: 90,
        farmListSent: false,
        farmCheckListIndex: 0,
        farmCheckBeforeSending: true,
        farmCheckHappened: false,
        farmCheckCount: 0,
        farmCheckNeeded: 1,
        enableReactivating: false,
        buildCheckDidSomething: false,
        autoBuildUseHeroResources: false,
        autoTrainUseHeroResources: false,
        auctionItemBackground: false,
        auctionShowSellerId: false,
        auctionReminders: [],
        auctionReminderSeconds: 600,
        autoUnfillBattleSimulator: true,
        stopSoundUntil: 0,
        autoAdventureEnabled: false,
        autoAdventureMaxTime: 3600,
        adventureCount: 0,
        autoAdventureStop: 0,
        heroHome: false
    };

    TravianHelper.addLog = function (log) {
        date = new Date();
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
        timeFormat = "[" + ((hours < 10) ? "0" : "") + hours + ":" + ((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds + "] ";

        log = timeFormat + log;

        TravianHelper.logs.push(log);

        if (TravianHelper.logs.length > 1000)
            TravianHelper.logs.splice(0, 1);
    }

    TravianHelper.createFarmlistProfile = function (name) {
        let profile = {
            name: name,
            minTime: TravianHelper.farmSendTimes.min,
            maxTime: TravianHelper.farmSendTimes.max,
            nextTime: new Date().getTime()
        }

        TravianHelper.farmListProfiles.push(profile);
    }

    TravianHelper.removeFarmListProfile = function (index) {
        if (index <= 0)
            return;
        TravianHelper.farmListProfiles.splice(index, 1);

        for (let i = TravianHelper.farmListProfileConnections - 1; i >= 0; i--) {
            if (TravianHelper.farmListProfileConnections[i].index == index) {
                TravianHelper.farmListProfileConnections.splice(i, 1);
                break;
            }
        }
    }

    TravianHelper.assignProfileToFarmlist = function (name, profileIndex) {
        for (let i = 0; i < TravianHelper.farmListProfileConnections.length; i++) {
            if (TravianHelper.farmListProfileConnections[i].name == name) {
                TravianHelper.farmListProfileConnections.splice(i, 1);
                break;
            }
        }
        TravianHelper.farmListProfileConnections.push({ name: name, index: profileIndex });
    }

    TravianHelper.getProfileForFarmList = function (name) {
        for (let i = 0; i < TravianHelper.farmListProfileConnections.length; i++) {
            if (TravianHelper.farmListProfileConnections[i].name == name) {
                return TravianHelper.farmListProfileConnections[i].index;
                break;
            }
        }
        return 0;
    }

    TravianHelper.checkNewMessages = async function () {
        var msg = document.getElementsByClassName("messages");

        if (msg.length > 0) {

            if (msg[0].classList.contains('v35'))
                return;

            if (msg[0].childElementCount == 0) {
                TravianHelper.previousMessageCount = 0;
                TravianHelper.setStorage();
            }
            else {
                var newMsgCount = Number(msg[0].children[0].innerHTML);
                if (newMsgCount > TravianHelper.previousMessageCount && TravianHelper.enableMessageNotification) {
                    TravianHelper.playMessageSound();
                }
                await TravianHelper.wait(4000);

                TravianHelper.previousMessageCount = newMsgCount;
                TravianHelper.setStorage();
            }
        }
    }

    TravianHelper.getResourcesFromHero_Safeguard = async function()
    {
        await TravianHelper.wait(20000);
        window.location.href = TravianHelper.heroGet.originalHref;
    }

    TravianHelper.ceilUpToAmount = function(amount, threshold)
    {
        return Math.ceil(amount / threshold) * threshold;
    }

    TravianHelper.getResourcesFromHero = async function (wood, clay, iron, wheat, initiator) {

        if (wood <= 0 && clay <= 0 && iron <= 0 && wheat <= 0)
            return;

        TravianHelper.getResourcesFromHero_Safeguard();

        if(TravianHelper.heroSaferResourceGet)
        {
            wood = TravianHelper.ceilUpToAmount(wood,100);
            clay = TravianHelper.ceilUpToAmount(clay,100);
            iron = TravianHelper.ceilUpToAmount(iron,100);
            wheat = TravianHelper.ceilUpToAmount(wheat,100);
        }

        if(wood <= 0)
            wood = 0;
        if(clay <= 0)
            clay = 0;
        if(iron <= 0)
            iron = 0;
        if(wheat <= 0)
            wheat = 0;

        var href = window.location.href;
        if (href.includes("hero/inventory")) {
            if (TravianHelper.heroGet.villageId != TravianHelper.getCurrentVillageIndex()) {
                TravianHelper.changeVillage(TravianHelper.heroGet.villageId);
            }
            else {
                while(document.getElementsByClassName("heroItem consumable inventory").length == 0)
                    await TravianHelper.wait(100);
                
                var heroCons = document.getElementsByClassName("heroItem consumable inventory");

                wood = TravianHelper.heroGet.wood;
                clay = TravianHelper.heroGet.clay;
                iron = TravianHelper.heroGet.iron;
                wheat = TravianHelper.heroGet.wheat;

                var hWood = 0;
                var hClay = 0;
                var hIron = 0;
                var hWheat = 0;

                var woodId = -1;
                var clayId = -1;
                var ironId = -1;
                var wheatId = -1;

                for (var i = 0; i < heroCons.length; i++) {
                    if (heroCons[i].children[1].classList.contains("item145")) {
                        hWood = Number(heroCons[i].children[2].innerHTML);
                        woodId = i;
                    }
                    else if (heroCons[i].children[1].classList.contains("item146")) {
                        hClay = Number(heroCons[i].children[2].innerHTML);
                        clayId = i;
                    }
                    else if (heroCons[i].children[1].classList.contains("item147")) {
                        hIron = Number(heroCons[i].children[2].innerHTML);
                        ironId = i;
                    }
                    else if (heroCons[i].children[1].classList.contains("item148")) {
                        hWheat = Number(heroCons[i].children[2].innerHTML);
                        wheatId = i;
                    }
                }

                if (hWood < wood || hClay < clay || hIron < iron || hWheat < wheat) {
                    console.log("no resources ");
                    TravianHelper.heroGet.wood = 0;
                    TravianHelper.heroGet.clay = 0;
                    TravianHelper.heroGet.iron = 0;
                    TravianHelper.heroGet.wheat = 0;
                    TravianHelper.setStorage();
                    window.location.href = TravianHelper.heroGet.originalHref;
                    return;
                }

                var sbs = document.getElementsByClassName("stockBarButton");


                if (wood > 0 && woodId != -1) {
                    heroCons[woodId].click()
                    await TravianHelper.wait(TravianHelper.generateRandomNumber(400, 500));
                    var curWood = Number(sbs[0].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].dataset.amount = wood;
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].click();
                    
                    var waitedTime = 0;
                    var maxWaited = 3000;
                    while(Number(sbs[0].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, '')) < curWood + wood) {
                        await TravianHelper.wait(100);
                        waitedTime += 100;
                        console.log("Waited time: " + waitedTime);
                        if(waitedTime > maxWaited)
                            break;
                    }

                    TravianHelper.heroGet.wood = 0;
                    TravianHelper.setStorage();
                }
                if (clay > 0 && clayId != -1) {
                    heroCons[clayId].click()
                    await TravianHelper.wait(TravianHelper.generateRandomNumber(400, 500));
                    var curClay = Number(sbs[1].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].dataset.amount = clay;
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].click();

                    var waitedTime = 0;
                    var maxWaited = 3000;
                    while(Number(sbs[1].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, '')) < curClay + clay){
                        await TravianHelper.wait(100);
                        waitedTime += 100;
                        console.log("Waited time: " + waitedTime);
                        if(waitedTime > maxWaited)
                            break;
                    }

                    TravianHelper.heroGet.clay = 0;
                    TravianHelper.setStorage();
                }
                if (iron > 0 && ironId != -1) {
                    heroCons[ironId].click()
                    await TravianHelper.wait(TravianHelper.generateRandomNumber(400, 500));
                    var curIron = Number(sbs[2].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].dataset.amount = iron;
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].click();

                    var waitedTime = 0;
                    var maxWaited = 3000;
                    while(Number(sbs[2].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, '')) < curIron + iron) {
                        await TravianHelper.wait(100);
                        waitedTime += 100;
                        console.log("Waited time: " + waitedTime);
                        if(waitedTime > maxWaited)
                            break;
                    }

                    TravianHelper.heroGet.iron = 0;
                    TravianHelper.setStorage();
                }
                if (wheat > 0 && wheatId != -1) {
                    heroCons[wheatId].click()
                    await TravianHelper.wait(TravianHelper.generateRandomNumber(400, 500));
                    var curWheat = Number(sbs[3].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].dataset.amount = wheat;
                    document.getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0].click();

                    var waitedTime = 0;
                    var maxWaited = 3000;
                    while(Number(sbs[3].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, '')) < curWheat + wheat){
                        await TravianHelper.wait(100);
                        waitedTime += 100;
                        console.log("Waited time: " + waitedTime);
                        if(waitedTime > maxWaited)
                            break;
                    }

                    TravianHelper.heroGet.wheat = 0;
                    TravianHelper.setStorage();
                }
                window.location.href = TravianHelper.heroGet.originalHref;

            }
        }
        else {
            TravianHelper.heroGet.villageId = TravianHelper.getCurrentVillageIndex();
            TravianHelper.heroGet.wood = wood;
            TravianHelper.heroGet.clay = clay;
            TravianHelper.heroGet.iron = iron;
            TravianHelper.heroGet.wheat = wheat;
            if(!initiator)
                TravianHelper.heroGet.originalHref = href;
            else
                TravianHelper.heroGet.originalHref = window.location.origin + "/dorf1.php";
            TravianHelper.setStorage();


            href = window.location.origin + "/hero/inventory";
            window.location.href = href;
        }

    }



    TravianHelper.checkFarmlistProfileTimes = function (delay) {
        var date = new Date();
        var time = date.getTime();
        for (var i = 0; i < TravianHelper.farmListProfiles.length; i++) {
            if (time + delay > TravianHelper.farmListProfiles[i].nextTime)
                return true;
        }
        return false;
    }

    TravianHelper.redClockCheck = async function()
    {
        await TravianHelper.wait(100);
        while(true) {

            var date = new Date();
            var time = date.getTime();

            if (TravianHelper.currentTask == -1 && TravianHelper.checkFarmlistProfileTimes(0) && time < TravianHelper.farmSendingEndTime) {
                let stime = document.getElementsByClassName("stime");
                let timer = stime[0].getElementsByClassName("timer");
                timer[0].style.color = "#ff0000"

            }
            else if (TravianHelper.currentTask == -1 && time > TravianHelper.nextVillageCheckTime) {
                let stime = document.getElementsByClassName("stime");
                let timer = stime[0].getElementsByClassName("timer");
                timer[0].style.color = "#ff0000"
            }
            else if (TravianHelper.currentTask == -1 && TravianHelper.checkFarmlistProfileTimes(15000) && time < TravianHelper.farmSendingEndTime) {
                let stime = document.getElementsByClassName("stime");
                let timer = stime[0].getElementsByClassName("timer");
                timer[0].style.color = "#ffff00"
            }
            else if (TravianHelper.currentTask == -1 && time + 15000 > TravianHelper.nextVillageCheckTime) {
                let stime = document.getElementsByClassName("stime");
                let timer = stime[0].getElementsByClassName("timer");
                timer[0].style.color = "#ffff00"
            }
            else {
                let stime = document.getElementsByClassName("stime");
                let timer = stime[0].getElementsByClassName("timer");
                timer[0].style.color = "#ffffff"
            }
            await TravianHelper.wait(100);
        }
    }

    TravianHelper.checkTasks = async function () {

        TravianHelper.redClockCheck();
        var href = window.location.href;

        if (TravianHelper.heroGet.wood > 0 || TravianHelper.heroGet.clay > 0 || TravianHelper.heroGet.iron > 0 || TravianHelper.heroGet.wheat > 0) {
            return;
        }

        if (href.includes("karte.php") || (href.includes("id=39") && href.includes("tt=3"))) {
            console.log("delaying task check");
            await TravianHelper.wait(120 * 1000);
        }

        if(TravianHelper.currentTask == -1 && ((href.includes("id=39") || href.includes("gid=16")) && href.includes("tt=2")))
        {
            console.log("delaying task check on send page");
            await TravianHelper.wait(15 * 1000);
        }




        while (true) {

            if (TravianHelper.checkTaskEnd)
                break;

            var date = new Date();
            var time = date.getTime();


            if (TravianHelper.currentTask == -1 && TravianHelper.checkFarmlistProfileTimes(0) && time < TravianHelper.farmSendingEndTime) {
                TravianHelper.SendOutAllFarmLists();

            }

            else if (TravianHelper.currentTask == -1 && time > TravianHelper.nextVillageCheckTime) {
                TravianHelper.nextVillageCheckTime = time + TravianHelper.generateRandomNumber(TravianHelper.villageCheckTimes.min * 1000, TravianHelper.villageCheckTimes.max * 1000);
                TravianHelper.setStorage();

                if (TravianHelper.doVillageCheck && (TravianHelper.doVillageChecksWithoutFarming || time < TravianHelper.farmSendingEndTime))
                    TravianHelper.getAllVillageData();
            }
            else if (TravianHelper.currentTask == -1 && time > TravianHelper.nextBuildCheckTime) {
                TravianHelper.nextBuildCheckTime = time + TravianHelper.generateRandomNumber(TravianHelper.buildCheckTimes.min * 1000, TravianHelper.buildCheckTimes.max * 1000);
                TravianHelper.currentTask = 2;
                TravianHelper.setStorage();
                TravianHelper.loadBuildableVillage();
            }

            for (var i = 0; i < TravianHelper.villageIds.length; i++) {
                var data = TravianHelper.villageData[TravianHelper.villageIds[i]];

                if (data["confirmedAttacks"] == null)
                    data["confirmedAttacks"] = 0;

                var nextTime = data["nextAttackTime"];
                if (time > nextTime && data["confirmedAttacks"] > 0) {
                    nextTime = TravianHelper.nextVillageCheckTime + (TravianHelper.villageCheckTimes.max + 60) * 1000;
                    data["confirmedAttacks"]--;
                    TravianHelper.setStorage();
                }
            }

            await TravianHelper.wait(100);


        }
    }

    TravianHelper.SetFarmsendingEndTimeFromNow = function (hour, min, seconds) {
        var date = new Date();
        var time = date.getTime();
        TravianHelper.farmSendingEndTime = time + (hour * 3600 + min * 60 + seconds) * 1000;
        TravianHelper.setStorage();
    }

    TravianHelper.SetStopSoundFromNow = function (hour, min, seconds) {
        var date = new Date();
        var time = date.getTime();
        TravianHelper.stopSoundUntil = time + (hour * 3600 + min * 60 + seconds) * 1000;
        TravianHelper.setStorage();
    }

    TravianHelper.printTimes = function () {
        var date = new Date();
        var time = date.getTime();
        console.log("Farm end time: " + (TravianHelper.farmSendingEndTime - time) / 1000);

        for (var i = 0; i < TravianHelper.farmListProfiles.length; i++) {
            console.log("Next farmtime (" + TravianHelper.farmListProfiles[i].name + "): " + ((TravianHelper.farmListProfiles[i].nextTime - time) / 1000));
        }
        console.log("Next village check: " + (TravianHelper.nextVillageCheckTime - time) / 1000);
        console.log("Next build check: " + (TravianHelper.nextBuildCheckTime - time) / 1000);
    }

    TravianHelper.getAllVillageData = function () {

        console.log("TravianHelper.getAllVillageData");
        TravianHelper.getVillages();
        TravianHelper.currentTask = 1;
        TravianHelper.setStorage();
        if (!TravianHelper.quickVillageCheck)
            TravianHelper.changeVillage(TravianHelper.villageIds[0]);
        else TravianHelper.getQuickVillageData();
    }

    TravianHelper.wait = async function (ms) {
        return await new Promise(r => setTimeout(r, ms));
    }

    TravianHelper.doQuickAttackCheck = async function () {
        if (!TravianHelper.quickAttackCheckEnabled)
            return;

        var atk = document.getElementsByClassName("listEntry attack");

        if (atk.length > 0) {
            TravianHelper.playAttackSound();
        }

        var waitLength = TravianHelper.generateRandomNumber(TravianHelper.quickAttackCheckTimes.min * 1000, TravianHelper.quickAttackCheckTimes.max * 1000);

        await TravianHelper.wait(waitLength);

        window.location.href = window.location.href;
    }

    

    TravianHelper.playAuctionSound = async function () {
        await TravianHelper.wait(100);
        var soundUrl = "https://cdn.pixabay.com/audio/2022/03/15/audio_1c64470d91.mp3";
        var audio = new Audio(soundUrl);
        audio.play();
    }

    TravianHelper.playFullStorageSound = async function () {
        var time = new Date().getTime()
        if(TravianHelper.stopSoundUntil > time)
            return;
        await TravianHelper.wait(100);
        var soundUrl = "https://cdn.pixabay.com/audio/2023/11/02/audio_1437d4e1b1.mp3";
        var audio = new Audio(soundUrl);
        audio.play();
    }

    TravianHelper.playErrorSound = async function () {
        await TravianHelper.wait(100);
        var soundUrl = "https://quicksounds.com/uploads/tracks/2032580081_642439491_1859100239.mp3";
        var audio = new Audio(soundUrl);
        audio.play();
    }
    TravianHelper.playMessageSound = async function () {
        
        var time = new Date().getTime()
        if(TravianHelper.stopSoundUntil > time)
            return;
        await TravianHelper.wait(100);
        var soundUrl = "https://naghma.me/files/1978.mp3";

        if(isMobileDevice())
            soundUrl = "https://cdn.freesound.org/previews/653/653820_200878-lq.mp3";

        var audio = new Audio(soundUrl);
        audio.play();
    }

    TravianHelper.playAttackSound = async function () {

        var mozillaLike = navigator.userAgent.includes("Firefox");

        var time = new Date().getTime()
        if(TravianHelper.stopSoundUntil > time)
            return;
        await TravianHelper.wait(100);
        var soundUrl = "https://cdn.pixabay.com/audio/2022/03/10/audio_5cb595572d.mp3";

        if(mozillaLike)
            soundUrl = "https://cdn.freesound.org/previews/547/547020_7295304-lq.mp3";

        var audio = new Audio(soundUrl);
        audio.play();
    }

    TravianHelper.playWheatSound = function () {
        var time = new Date().getTime()
        if(TravianHelper.stopSoundUntil > time)
            return;
        var soundUrl = "https://www.myinstants.com/media/sounds/im-very-hungry.mp3";
        var audio = new Audio(soundUrl);
        audio.play();
    }

    TravianHelper.confirmAttacks = function () {
        for (var i = 0; i < TravianHelper.villageIds.length; i++) {
            var data = TravianHelper.villageData[TravianHelper.villageIds[i]];

            if (data["confirmedAttacks"] == null)
                data["confirmedAttacks"] = 0;

            var confirmedAttacks = data["confirmedAttacks"];
            var attacks = data["attacks"];

            data["confirmedAttacks"] = attacks;
        }
        TravianHelper.setStorage();
    }

    TravianHelper.getCurrentVillageData = async function () {
        var href = window.location.href;
        if (!href.includes("dorf1.php")) {
            window.location.href = window.location.origin + "/dorf1.php";
            return;
        }

        var villageIndex = TravianHelper.getCurrentVillageIndex();
        if (TravianHelper.villageData[villageIndex] == null) {
            TravianHelper.villageData[villageIndex] = {};
            TravianHelper.villageIds.push(villageIndex);
        }
        var data = TravianHelper.villageData[villageIndex];

        var coordinates = document.getElementsByClassName("coordinatesGrid");

        for(var i = 0; i < coordinates.length; i++)
        {
            if(coordinates[i].dataset.did == villageIndex) {
                let coord = {x: coordinates[i].dataset.x, y: coordinates[i].dataset.y};
                data["coord"] = coord;
            }
        }

        var sbs = document.getElementsByClassName("stockBarButton");
        var wood = Number(sbs[0].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
        var clay = Number(sbs[1].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
        var iron = Number(sbs[2].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
        var wheat = Number(sbs[3].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));


        data["wood"] = wood;
        data["clay"] = clay;
        data["iron"] = iron;
        data["wheat"] = wheat;

        var woodFillStyle = sbs[0].getElementsByClassName("bar")[0].getAttribute("style");
        var clayFillStyle = sbs[1].getElementsByClassName("bar")[0].getAttribute("style");
        var ironFillStyle = sbs[2].getElementsByClassName("bar")[0].getAttribute("style");
        var wheatFillStyle = sbs[3].getElementsByClassName("bar")[0].getAttribute("style");

        var woodPercent = parseInt(woodFillStyle.substring(woodFillStyle.indexOf(":") + 1, woodFillStyle.indexOf("%")));
        var clayPercent = parseInt(clayFillStyle.substring(clayFillStyle.indexOf(":") + 1, clayFillStyle.indexOf("%")));
        var ironPercent = parseInt(ironFillStyle.substring(ironFillStyle.indexOf(":") + 1, ironFillStyle.indexOf("%")));
        var wheatPercent = parseInt(wheatFillStyle.substring(wheatFillStyle.indexOf(":") + 1, wheatFillStyle.indexOf("%")));

        var warnPercent = TravianHelper.fullnessWarningPercent;
        if ((TravianHelper.warehouseFullWarning && (woodPercent >= warnPercent || clayPercent >= warnPercent || ironPercent >= warnPercent))
            || (TravianHelper.granaryFullWarning && wheatPercent >= warnPercent)) {
            TravianHelper.playFullStorageSound();
            await TravianHelper.wait(1500);
        }

        var prods = document.getElementsByClassName("num");

        if (prods.length < 4)
            TravianHelper.playErrorSound();

        var prodWood = prods[0].innerHTML.replace(/\s+/g, "");
        var prodClay = prods[1].innerHTML.replace(/\s+/g, "");
        var prodIron = prods[2].innerHTML.replace(/\s+/g, "");
        var prodWheat = prods[3].innerHTML.replace(/\s+/g, "");
        prodWood = Number(prodWood.slice(1, prodWood.length - 1));
        prodClay = Number(prodClay.slice(1, prodClay.length - 1));
        prodIron = Number(prodIron.slice(1, prodIron.length - 1));
        prodWheat = prodWheat.slice(1, prodWheat.length - 1);

        if (prodWheat[0] == "−")
            prodWheat = -1 * Number(prodWheat.slice(2, prodWheat.length - 1));
        prodWheat = Number(prodWheat);
        data["prodWood"] = prodWood;
        data["prodClay"] = prodClay;
        data["prodIron"] = prodIron;
        data["prodWheat"] = prodWheat;

        if (prodWheat < 0 && (wheat / (-prodWheat) * 3600) < TravianHelper.wheatFillSeconds) {
            TravianHelper.getResourcesFromHero(0, 0, 0, 1 / 3600 * (TravianHelper.wheatFillSeconds + 60) * (-prodWheat) - wheat);
        }

        if (prodWheat < 0 && (wheat / (-prodWheat) * 3600) < TravianHelper.wheatWarningSeconds) {
            TravianHelper.playWheatSound();
            await TravianHelper.wait(2000);
        }

        var troopTable = document.getElementsByClassName("villageInfobox units");

        var units = troopTable[0].children[0].children[1];
        
        let troopsHome = [];
        
        if(units.getElementsByClassName("noTroops").length == 0) {
            for(let i = 0; i < units.childElementCount; i++) {
                var unitImage = units.children[i].getElementsByClassName("unit");
                var type = unitImage[0].classList[1];
                var numCont = units.children[i].getElementsByClassName("num");
                var num = Number(numCont[0].innerHTML);
                console.log(type + " " + num);
                troopsHome.push({type: type, count: num})
            }
        }

        data["troops"] = troopsHome;


        //getting if attacked
        var attacked = false;
        var tmove = document.getElementsByClassName("villageInfobox movements")
        if (tmove.length > 0) {

            var a1 = tmove[0].getElementsByClassName("a1");
            var a3 = tmove[0].getElementsByClassName("a3");

            var attackCount = 0;
            var nextTime = 0;

            if (a1.length > 0) {
                var a1Html = a1[0].innerHTML;
                var a1AttackCount = Number(a1[0].innerHTML.split(" ")[0])
                var a1Time = Number(a1[0].parentElement.nextElementSibling.children[0].getAttribute("value"));

                nextTime = a1Time;

                attackCount += a1AttackCount;
            }

            if (a3.length > 0) {
                var a3Html = a3[0].innerHTML;
                var a3AttackCount = Number(a3[0].innerHTML.split(" ")[0])
                var a3Time = Number(a3[0].parentElement.nextElementSibling.children[0].getAttribute("value"));

                if (nextTime > 0 && nextTime > a3Time)
                    nextTime = a3Time;
                else if (nextTime == 0)
                    nextTime = a3Time;

                attackCount += a3AttackCount;
            }

            data["attacks"] = attackCount;
            data["nextAttackTime"] = new Date().getTime() + nextTime * 1000;

            if (data["confirmedAttacks"] == null)
                data["confirmedAttacks"] = 0;

            if (data["confirmedAttacks"] > attackCount)
                data["confirmedAttacks"] = attackCount;

            var confirmedAttacks = data["confirmedAttacks"];

            if (confirmedAttacks < attackCount) {
                console.log("Attacks");
                TravianHelper.playAttackSound();
                await TravianHelper.wait(2000);
            }
        }
        else {
            data["attacks"] = 0;
            data["nextAttackTime"] = new Date().getTime();
            data["confirmedAttacks"] = 0;
        }

        var buildingNow = document.getElementsByClassName("buildingList");
        if (buildingNow.length > 0) {
            if (buildingNow[0].classList.length > 1)
                data["building"] = 0;
            else {
                var timers = buildingNow[0].getElementsByClassName("timer");
                var smallestTime = -1;

                for (let i = 0; i < timers.length; i++) {
                    var currTime = Number(timers[i].getAttribute("value"));
                    if (currTime < smallestTime || smallestTime == -1)
                        smallestTime = currTime
                }
                data["building"] = timers.length;
                data["buildingEnd"] = new Date().getTime() + (smallestTime) * 1000;
            }
        }
        else data["building"] = 0;

        data["attacked"] = attacked;
        TravianHelper.setStorage();

        if (TravianHelper.currentTask == 1) {
            var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.nextVillageDelayMinMs, TravianHelper.nextVillageDelayMaxMs);
            await TravianHelper.wait(confirmDelay);

            var villageId = TravianHelper.getCurrentVillageIndex();
            if (villageId == TravianHelper.villageIds[TravianHelper.villageIds.length - 1]) {
                TravianHelper.currentTask = -1;
                TravianHelper.setStorage();
            }
            else {
                TravianHelper.changeToNextVillage();
            }
        }
    }

    TravianHelper.getQuickVillageData = async function () {

        if (TravianHelper.quickVillageCheckStep == -1)
            TravianHelper.quickVillageCheckStep = 0;
        //Steps:
        //0 - Village statistics for attack and building check
        //1 - Resources
        //2 - Warehouse fullness, crop check


        var href = window.location.href;

        if (TravianHelper.quickVillageCheckStep == 0) {
            if (href.includes("village/statistics")) {
                var vilData = document.getElementsByClassName("vil fc");

                for (let i = 0; i < vilData.length; i++) {
                    var aElements = vilData[i].parentElement.children[2].getElementsByTagName("a");
                    let url = vilData[i].parentElement.children[0].getElementsByTagName("a")[0].href;
                    let villageId = url.split('newdid=')[1];

                    var data = TravianHelper.villageData[villageId];

                    data["building"] = aElements.length;

                    if (aElements.length > 0) {
                        data["buildingEnd"] = TravianHelper.nextVillageCheckTime + 10000;
                    }
                    data["attacks"] = 0;


                }

                var att1s = document.getElementsByClassName("att1");
                var att3s = document.getElementsByClassName("att3");

                for (let i = 0; i < att1s.length; i++) {
                    let url = att1s[i].parentElement.parentElement.parentElement.children[0].children[0].href;
                    let villageId = url.split('newdid=')[1];

                    var data = TravianHelper.villageData[villageId];
                    data["attacks"] = 1;
                }
                for (let i = 0; i < att3s.length; i++) {
                    let url = att3s[i].parentElement.parentElement.parentElement.children[0].children[0].href;
                    let villageId = url.split('newdid=')[1];

                    var data = TravianHelper.villageData[villageId];
                    data["attacks"] = 1;
                }
                if (typeof (data.confirmedAttacks) == 'undefined') {
                    data["confirmedAttacks"] = 0;
                }

                TravianHelper.quickVillageCheckStep++;

                TravianHelper.setStorage();
                await TravianHelper.wait(TravianHelper.generateRandomNumber(500, 1500));
                TravianHelper.getQuickVillageData();
            }
            else {
                window.location.href = window.location.origin + "/village/statistics/overview";
            }
        }
        else if (TravianHelper.quickVillageCheckStep == 1) {
            if (href.includes("village/statistics/resources")) {
                var vilData = document.getElementsByClassName("vil fc");
                for (let i = 0; i < vilData.length; i++) {
                    let url = vilData[i].parentElement.children[0].getElementsByTagName("a")[0].href;
                    let villageId = url.split('newdid=')[1];

                    var data = TravianHelper.villageData[villageId];

                    var woodText = vilData[i].parentElement.children[1].innerHTML;
                    var clayText = vilData[i].parentElement.children[2].innerHTML;
                    var ironText = vilData[i].parentElement.children[3].innerHTML;
                    var wheatText = vilData[i].parentElement.children[4].innerHTML;

                    var wood = parseInt(woodText.slice(1, -1).replace(/,/g, ''));
                    var clay = parseInt(clayText.slice(1, -1).replace(/,/g, ''));
                    var iron = parseInt(ironText.slice(1, -1).replace(/,/g, ''));
                    var wheat = parseInt(wheatText.slice(1, -1).replace(/,/g, ''));

                    data["wood"] = wood;
                    data["clay"] = clay;
                    data["iron"] = iron;
                    data["wheat"] = wheat;



                }

                TravianHelper.quickVillageCheckStep++;

                TravianHelper.setStorage();
                await TravianHelper.wait(TravianHelper.generateRandomNumber(500, 1500));
                TravianHelper.getQuickVillageData();

            }
            else {
                window.location.href = window.location.origin + "/village/statistics/resources";
            }
        }
        else if (TravianHelper.quickVillageCheckStep == 2) {
            if (href.includes("village/statistics/resources/warehouse")) {
                var vilData = document.getElementsByClassName("vil fc");

                var veryHungry = false;
                var fullResources = false;

                for (let i = 0; i < vilData.length; i++) {
                    let url = vilData[i].parentElement.children[0].getElementsByTagName("a")[0].href;
                    let villageId = url.split('newdid=')[1];

                    var data = TravianHelper.villageData[villageId];

                    var woodPercentText = vilData[i].parentElement.children[1].innerHTML;
                    let woodMatch = woodPercentText.match(/\d+/);
                    let woodPercent = woodMatch ? parseInt(woodMatch[0]) : null;

                    var clayPercentText = vilData[i].parentElement.children[2].innerHTML;
                    let clayMatch = clayPercentText.match(/\d+/);
                    let clayPercent = clayMatch ? parseInt(clayMatch[0]) : null;

                    var ironPercentText = vilData[i].parentElement.children[3].innerHTML;
                    let ironMatch = ironPercentText.match(/\d+/);
                    let ironPercent = ironMatch ? parseInt(ironMatch[0]) : null;

                    var wheatPercentText = vilData[i].parentElement.children[5].innerHTML;
                    let wheatMatch = wheatPercentText.match(/\d+/);
                    let wheatPercent = wheatMatch ? parseInt(wheatMatch[0]) : null;

                    if (TravianHelper.warehouseFullWarning && (woodPercent >= TravianHelper.fullnessWarningPercent
                        || clayPercent >= TravianHelper.fullnessWarningPercent
                        || ironPercent >= TravianHelper.fullnessWarningPercent))
                        fullResources = true;


                    if (vilData[i].parentElement.children[6].children[0].classList.contains("crit")) {
                        var timeLeft = Number(vilData[i].parentElement.children[6].children[0].getAttribute("value"));
                        if (timeLeft < TravianHelper.wheatWarningSeconds)
                            veryHungry = true;
                    }
                    else if (TravianHelper.granaryFullWarning && wheatPercent >= TravianHelper.fullnessWarningPercent)
                        fullResources = true;

                }

                if (veryHungry) {
                    TravianHelper.playWheatSound();
                    await TravianHelper.wait(2000);
                }
                if (fullResources) {
                    TravianHelper.playFullStorageSound();
                    await TravianHelper.wait(2000);
                }

                TravianHelper.quickVillageCheckStep = -1;
                TravianHelper.currentTask = -1;

                TravianHelper.setStorage();
                await TravianHelper.wait(TravianHelper.generateRandomNumber(500, 1500));

                window.location.href = window.location.origin + "/dorf2.php";

            }
            else {
                window.location.href = window.location.origin + "/village/statistics/resources/warehouse";
            }
        }
    }


    TravianHelper.farmCheck = async function () {
        var href = window.location.href;
        if (href.includes("build.php?id=39&gid=16&tt=99")) {
            console.log("on farmlist")

            var divContainer = document.createElement("div");
            divContainer.classList.add("submitButtonContainer");

            var skipButton = document.createElement("button");
            skipButton.innerText = "Skip current farm check";
            skipButton.type = "submit";
            skipButton.classList.add("textButtonV1");
            skipButton.classList.add("green");
    
            skipButton.addEventListener("click", function () {
                if(TravianHelper.farmListSent) {
                    TravianHelper.farmCheckHappened = true;
                    TravianHelper.farmCheckCount = Number(TravianHelper.farmCheckNeeded) - 1;
                    TravianHelper.clearTask();
                    TravianHelper.setStorage();
                    window.location.href = window.location.origin + "/dorf2.php";
                }
            });

            var targetka = document.getElementById("rallyPointFarmList");
            divContainer.appendChild(skipButton);
            targetka.insertBefore(divContainer, targetka.firstChild);

            await TravianHelper.wait(1000);
            var headers = document.getElementsByClassName("farmListWrapper");
            while(headers.length <= 0)
            {
                headers = document.getElementsByClassName("farmListWrapper");
                await TravianHelper.wait(100);
            }
            var listIndex = TravianHelper.farmCheckListIndex;
            for(let i = listIndex; i < headers.length; i++)
            {
                TravianHelper.farmCheckListIndex = i;
                TravianHelper.setStorage();

                if(listIndex + 5 < i)
                {
                    window.location.href = window.location.href;
                }


                let name = headers[i].getElementsByClassName("name")[0].innerHTML;
                if(name.toLowerCase().includes("beteg"))
                    continue;

                //opening if not open
                let closed = headers[i].classList.contains("collapsed");
                if(closed)
                {
                    let expandCollapse = headers[i].getElementsByClassName("expandCollapse");
                    expandCollapse[0].click();
                    let timeSpent = 0;
                    while(headers[i].classList.contains("collapsed") && timeSpent < 3000){
                        await TravianHelper.wait(100);
                        timeSpent += 100;
                    }
                    await TravianHelper.wait(1000);
                }
                
                //checking things
                let slots = headers[i].getElementsByClassName("slot");
                for(let j = 0; j < slots.length; j++)
                    {
                        let lastRaidState = slots[j].getElementsByClassName("lastRaidState");
                        if(slots[j].classList.contains("disabled")){
                            if(!TravianHelper.enableReactivating)
                                continue;

                            let autoDeactivated = document.getElementsByClassName("noticeBox deactivatedTargets");
                            if(autoDeactivated.length > 0)
                                continue;


                            if(lastRaidState.length > 0) {
                                if(lastRaidState[0].classList.contains("attack_won_withoutLosses_small")) {;
                                    TravianHelper.addLog("activated (" + i + ", " + j + ")");
                                    let openContextMenu = slots[j].getElementsByClassName("openContextMenu");
    
                                    if(openContextMenu.length > 0){
                                        openContextMenu[0].children[0].click();
                                        while(openContextMenu[0].childElementCount <= 1) {
                                            await TravianHelper.wait(100);
                                        }
                                        let activate = openContextMenu[0].children[1].getElementsByClassName("activate");
    
                                        activate[0].click();
                                        await TravianHelper.wait(200);
                                    }
                                }
                            }
                        }
                        else {
                            if(lastRaidState.length > 0) {
                                if(!lastRaidState[0].classList.contains("attack_won_withoutLosses_small")) {
                                    console.log("Attack with losses!");
                                    TravianHelper.addLog("deactivated (" + i + ", " + j + ")");
                                    let openContextMenu = slots[j].getElementsByClassName("openContextMenu");
    
                                    if(openContextMenu.length > 0){
                                        openContextMenu[0].children[0].click();
                                        while(openContextMenu[0].childElementCount <= 1) {
                                            await TravianHelper.wait(100);
                                        }
                                        let deactivate = openContextMenu[0].children[1].getElementsByClassName("deactivate");
    
                                        deactivate[0].click();
                                        await TravianHelper.wait(200);
                                    }
                                }
                            }
                        }
                    }

                    let open = headers[i].classList.contains("expanded");
                    if(open)
                    {
                        let expandCollapse = headers[i].getElementsByClassName("expandCollapse");
                        expandCollapse[0].click();
                        let timeSpent = 0;
                        while(headers[i].classList.contains("expanded") && timeSpent < 3000){
                            await TravianHelper.wait(100);
                            timeSpent += 100;
                        }
                        await TravianHelper.wait(1000);
                    }
            }
            console.log("farm check done")
            TravianHelper.farmCheckHappened = true;
            TravianHelper.farmCheckCount = 0;
            if(TravianHelper.currentTask == 0 && TravianHelper.farmCheckBeforeSending == true)
                TravianHelper.SendOutFarmList(0);
            else if(TravianHelper.currentTask == 0)
            {
                TravianHelper.sendingOutAllFarmLists = false;
                TravianHelper.currentTask = -1;
                TravianHelper.StopFarmList();
                href = window.location.origin + "/dorf2.php";
                window.location.href = href;
            }
        }
        else {
            href = window.location.origin + "/build.php?id=39&gid=16&tt=99";
            window.location.href = href;
        }
    }

    TravianHelper.SendOutAllFarmLists = function () {
        if (TravianHelper.currentTask == -1) {
            TravianHelper.currentTask = 0;
            TravianHelper.farmCheckCount ++;
            if(TravianHelper.farmCheckCount >= TravianHelper.farmCheckNeeded) {
                TravianHelper.farmCheckListIndex = 0;
                TravianHelper.farmCheckHappened = false;
            }
            TravianHelper.farmListSent = false;
            TravianHelper.sendingOutAllFarmLists = true;
            TravianHelper.setStorage();
            if (TravianHelper.getCurrentVillageIndex() != TravianHelper.villageIds[0])
                TravianHelper.changeVillage(TravianHelper.villageIds[0]);
            else TravianHelper.SendOutFarmList(0);
        }
    }

    TravianHelper.SendOutFarmList = async function (start) {

        if (TravianHelper.goldClub) {

            if (!TravianHelper.farmCheckHappened && TravianHelper.farmCheckBeforeSending) {
                TravianHelper.farmCheck();
                return;
            }

            var href = window.location.href;
            if (href.includes("build.php?id=39&gid=16&tt=99")) {
                console.log("on farmlist")

                await TravianHelper.wait(300);
                var headers = [];
                while (headers.length == 0) {

                    var headers = document.getElementsByClassName("farmListHeader");
                    await TravianHelper.wait(500);
                }

                if(!TravianHelper.farmListSent) {

                    if (TravianHelper.farmListProfiles.length == 1) {
                        var sendAllButton = document.getElementsByClassName("startAllFarmLists")[0];

                        sendAllButton.click();


                        var date = new Date();
                        var time = date.getTime();
                        TravianHelper.farmListProfiles[0].nextTime = time + TravianHelper.generateRandomNumber(TravianHelper.farmListProfiles[0].minTime * 1000, TravianHelper.farmListProfiles[0].maxTime * 1000);

                        TravianHelper.setStorage();

                        await TravianHelper.wait(100);

                        while (document.getElementsByClassName("cancelStartAllFarmLists").length > 0) {
                            await TravianHelper.wait(100);
                        }
                    }
                    else {

                        for (let k = 0; k < TravianHelper.farmListProfiles.length; k++) {

                            var date = new Date();
                            var time = date.getTime();

                            if (time > TravianHelper.farmListProfiles[k].nextTime) {
                                TravianHelper.farmListProfiles[k].nextTime = time + TravianHelper.generateRandomNumber(TravianHelper.farmListProfiles[k].minTime * 1000, TravianHelper.farmListProfiles[k].maxTime * 1000);
                            }
                            else continue;

                            TravianHelper.addLog("Sending farmlist: " + TravianHelper.farmListProfiles[k].name);

                            var maxWaitTime = 10000;

                            for (var i = 0; i < headers.length; i++) {
                                let listName = headers[i].children[1].children[0].innerHTML;
                                let send = headers[i].children[3];

                                if (k != TravianHelper.getProfileForFarmList(listName))
                                    continue;


                                send.click();

                                TravianHelper.setStorage();

                                var started = false;
                                var waited = 0;
                                while (!started) {
                                    started = send.classList.contains("disabled");
                                    await TravianHelper.wait(10);
                                    waited += 10;
                                    if (waited > maxWaitTime)
                                        break;
                                }
                                var ended = false;
                                while (!ended) {
                                    ended = !send.classList.contains("disabled");
                                    await TravianHelper.wait(10);
                                    waited += 10;
                                    if (waited > maxWaitTime)
                                        break;
                                }
                                await TravianHelper.wait(200);

                            }
                        }
                    }
                    TravianHelper.farmListSent = true;
                    TravianHelper.setStorage();
                }




                if(TravianHelper.farmCheckBeforeSending){
                    var buttonCount = document.getElementsByClassName("startFarmList").length;
                    await TravianHelper.wait(10 * (buttonCount + 1) + 100);
                    TravianHelper.sendingOutAllFarmLists = false;
                    TravianHelper.currentTask = -1;
                    TravianHelper.StopFarmList();
                    href = window.location.origin + "/dorf2.php";
                    window.location.href = href;
                }
                else {
                    if (!TravianHelper.farmCheckHappened) {
                        TravianHelper.farmCheck();
                        return;
                    }
                    else {
                        var buttonCount = document.getElementsByClassName("startFarmList").length;
                        await TravianHelper.wait(10 * (buttonCount + 1) + 100);
                        TravianHelper.sendingOutAllFarmLists = false;
                        TravianHelper.currentTask = -1;
                        TravianHelper.StopFarmList();
                        href = window.location.origin + "/dorf2.php";
                        window.location.href = href;
                    }
                }
            }
            else {
                href = window.location.origin + "/build.php?id=39&gid=16&tt=99";
                window.location.href = href;
            }
            return;
        }
        if (TravianHelper.fLists[TravianHelper.getCurrentVillageIndex()] == null) {
            TravianHelper.StopFarmList();
            return;
        }

        TravianHelper.sortFarmlist();
        TravianHelper.sendingOutFarmList = true;
        TravianHelper.sendingOutFarmListIdx = start;
        TravianHelper.enableConfirm = true;
        TravianHelper.enableSend = true;
        TravianHelper.setStorage();
        TravianHelper.trySendCurrentInFarmList();

    }
    TravianHelper.StopFarmList = function () {
        console.log("Stop farmlist");
        if (TravianHelper.sendingOutAllFarmLists) {
            var villageId = TravianHelper.getCurrentVillageIndex();
            if (villageId == TravianHelper.villageIds[TravianHelper.villageIds.length - 1]) {
                TravianHelper.sendingOutAllFarmLists = false;
                TravianHelper.currentTask = -1;
            }
            else {
                TravianHelper.changeToNextVillage();
            }
        }


        TravianHelper.sendingOutFarmList = false;
        TravianHelper.enableConfirm = false;
        TravianHelper.enableSend = false;
        TravianHelper.setStorage();
    }

    TravianHelper.getVillages = function () {

        var lEntries = document.getElementsByClassName("listEntry")

        if (lEntries.length > 0)
            TravianHelper.villageIds = [];

        for(let i = 0; i < lEntries.length; i++){
            TravianHelper.villageIds.push(lEntries[i].dataset.did);
        }
        TravianHelper.setStorage();
        return;
    }

    TravianHelper.changeVillage = function (index) {
        var href = window.location.origin + "/dorf1.php?newdid=" + index + "&";
        window.location.href = href;
    }

    TravianHelper.changeToNextVillage = function () {
        var villageId = TravianHelper.getCurrentVillageIndex();
        for (var i = 0; i < TravianHelper.villageIds.length - 1; i++) {
            if (villageId == TravianHelper.villageIds[i]) {
                TravianHelper.changeVillage(TravianHelper.villageIds[i + 1])
                break;
            }
        }
    }

    TravianHelper.getCurrentVillageIndex = function () {

        return document.getElementsByClassName("listEntry active")[0].dataset.did;
    }

    TravianHelper.getCurrentVillageCoord = function () {

        var activeVillage = document.getElementsByClassName("listEntry active")[0];
        
        const coordWrapper = activeVillage.querySelector('.coordinatesWrapper');
    
        const xElement = coordWrapper.querySelector('.coordinateX');
        const yElement = coordWrapper.querySelector('.coordinateY');
        
        // Replace any variant of dash (–, —, −) with a standard hyphen (-)
        const sanitizeDash = (str) => str.replace(/[\u2013\u2014\u2212]/g, '-').replace(/[^\d-]/g, '');

        const x = sanitizeDash(xElement.textContent);
        const y = sanitizeDash(yElement.textContent);

        return {
            x: Number(x),
            y: Number(y)
        };
    }

    TravianHelper.calcDistance = function (coord1, coord2) {
        var x = coord1.x - coord2.x;
        var y = coord1.y - coord2.y;
        return Math.sqrt(x * x + y * y);
    }

    TravianHelper.sortFarmlist = function () {
        var currCoord = TravianHelper.getCurrentVillageCoord();
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        var indexes = [];
        for (var i = 0; i < TravianHelper.fLists[villageIndex].fListElements.length; i++)
            indexes.push(i);

        indexes.sort(function (a, b) {
            var distanceA = TravianHelper.calcDistance(currCoord, TravianHelper.fLists[villageIndex].fListElements[a]);
            var distanceB = TravianHelper.calcDistance(currCoord, TravianHelper.fLists[villageIndex].fListElements[b]);
            return distanceA - distanceB;
        });

        var elements = [];
        var counts = [];

        for (var i = 0; i < indexes.length; i++) {
            var idx = indexes[i];
            elements.push(TravianHelper.fLists[villageIndex].fListElements[idx]);
            counts.push(TravianHelper.fLists[villageIndex].fListNumbers[idx]);
        }

        TravianHelper.fLists[villageIndex].fListElements = elements;
        TravianHelper.fLists[villageIndex].fListNumbers = counts;

        return { elements: elements, counts: counts };
    }

    TravianHelper.AddToFarmlist = function (coord, units) {

        var villageIndex = TravianHelper.getCurrentVillageIndex();

        if (TravianHelper.fLists[villageIndex] == null) {
            TravianHelper.fLists[villageIndex] = {};
            TravianHelper.fLists[villageIndex].fListElements = [];
            TravianHelper.fLists[villageIndex].fListNumbers = [];
        }

        for (var i = 0; i < TravianHelper.fLists[villageIndex].fListElements.length; i++) {
            if (coord.x == TravianHelper.fLists[villageIndex].fListElements[i].x && coord.y == TravianHelper.fLists[villageIndex].fListElements[i].y)
                return;
        }

        TravianHelper.fLists[villageIndex].fListElements.push(coord);
        TravianHelper.fLists[villageIndex].fListNumbers.push(units);
        TravianHelper.setStorage();
    }

    TravianHelper.DeleteFromFarmlist = function (index) {
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        if (TravianHelper.fLists[villageIndex] == null) {
            TravianHelper.fLists[villageIndex] = {};
            TravianHelper.fLists[villageIndex].fListElements = [];
            TravianHelper.fLists[villageIndex].fListNumbers = [];
        }

        TravianHelper.fLists[villageIndex].fListElements.splice(index, 1);
        TravianHelper.fLists[villageIndex].fListNumbers.splice(index, 1);
    }

    TravianHelper.getStorage = function () {
        if (localStorage.thP) {
            var obj = localStorage.thP.split(";");
            var storageObject = JSON.parse(obj[0]);

            for (var k in storageObject) {
                TravianHelper[k] = storageObject[k];
            }
        }
    }

    TravianHelper.generateRandomNumber = function (min, max) {
        var minN = Math.min(min, max);
        var maxN = Math.max(min, max);

        var number = Math.floor((minN + Math.random() * (maxN - minN + 1)));
        return number;
    }

    TravianHelper.setStorage = function () {
        var permanentObject = TravianHelper;
        var jsonPermanent = JSON.stringify(permanentObject);

        localStorage.thP = jsonPermanent;
    }


    TravianHelper.tryFillInUnits = async function () {
        if (TravianHelper.goldClub)
            return;

        if (TravianHelper.currentTask != 0)
            return;

        var villageIndex = TravianHelper.getCurrentVillageIndex();

        var xText = document.getElementsByClassName("text coordinates x");
        var yText = document.getElementsByClassName("text coordinates y");

        //send page
        if (xText.length > 0 && yText.length > 0) {
            TravianHelper.foundOnFarmlist = false;
            TravianHelper.setStorage();
            for (var i = 0; i < TravianHelper.fLists[villageIndex].fListElements.length; i++) {
                var elemCoord = TravianHelper.fLists[villageIndex].fListElements[i];
                var elemUnits = TravianHelper.fLists[villageIndex].fListNumbers[i];

                if (elemCoord.x == xText.xCoordInput.value && elemCoord.y == yText.yCoordInput.value) {

                    TravianHelper.foundOnFarmlist = true;
                    for (var j = 1; j <= 6; j++) {
                        var troop = document.getElementsByName("troop[t" + j + "]");
                        if (troop[0].value == "" && elemUnits[j - 1] > 0)
                            troop[0].value = elemUnits[j - 1];
                    }

                    var maxVals = [0, 0, 0, 0, 0, 0];

                    var large = document.getElementsByClassName("large");
                    if (large[0].getElementsByTagName("a").length > 0) {
                        maxVals[0] = large[0].getElementsByTagName("a")[0].innerHTML;
                        maxVals[0] = maxVals[0].slice(1, maxVals[0].length - 1)
                        maxVals[0] = parseInt(maxVals[0]);
                    }
                    if (large[1].getElementsByTagName("a").length > 0) {
                        maxVals[3] = large[1].getElementsByTagName("a")[0].innerHTML;
                        maxVals[3] = maxVals[3].slice(1, maxVals[3].length - 1)
                        maxVals[3] = parseInt(maxVals[3]);
                    }
                    if (large[2].getElementsByTagName("a").length > 0) {
                        maxVals[1] = large[2].getElementsByTagName("a")[0].innerHTML;
                        maxVals[1] = maxVals[1].slice(1, maxVals[1].length - 1)
                        maxVals[1] = parseInt(maxVals[1]);
                    }
                    if (large[3].getElementsByTagName("a").length > 0) {
                        maxVals[4] = large[3].getElementsByTagName("a")[0].innerHTML;
                        maxVals[4] = maxVals[4].slice(1, maxVals[4].length - 1)
                        maxVals[4] = parseInt(maxVals[4]);
                    }
                    if (large[4].getElementsByTagName("a").length > 0) {
                        maxVals[2] = large[4].getElementsByTagName("a")[0].innerHTML;
                        maxVals[2] = maxVals[2].slice(1, maxVals[2].length - 1)
                        maxVals[2] = parseInt(maxVals[2]);
                    }
                    if (large[5].getElementsByTagName("a").length > 0) {
                        maxVals[5] = large[5].getElementsByTagName("a")[0].innerHTML;
                        maxVals[5] = maxVals[5].slice(1, maxVals[5].length - 1)
                        maxVals[5] = parseInt(maxVals[5]);
                    }

                    TravianHelper.army = maxVals;

                    var good = true;
                    for (var j = 0; j < 6; j++)
                        if (elemUnits[j] > maxVals[j])
                            good = false;

                    if (!good) {
                        TravianHelper.StopFarmList();
                        TravianHelper.setStorage();
                    }
                    else if (TravianHelper.enableConfirm) {
                        console.log("found " + i + "/" + TravianHelper.fLists[villageIndex].fListElements.length);
                        var button = document.getElementsByClassName("textButtonV1");
                        var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                        await TravianHelper.wait(confirmDelay);
                        for (var j = 0; j < 6; j++)
                            TravianHelper.army[j] -= elemUnits[j];
                        TravianHelper.setStorage();
                        button[0].click();
                    }


                }
            }
        }
        //confirm page
        else {
            if (TravianHelper.foundOnFarmlist && TravianHelper.enableConfirm) {
                var buttony = document.getElementsByClassName("rallyPointConfirm");
                var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                await TravianHelper.wait(confirmDelay);
                buttony[0].click();
            }

        }
    }

    TravianHelper.CoordToIndex = function (coord) {
        return (200 - coord.y) * 401 + (coord.x + 201);
    }

    TravianHelper.getTotalFarmlistRequirement = function () {
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        var reqs = [0, 0, 0, 0, 0, 0];

        for (var i = 0; i < TravianHelper.fLists[villageIndex].fListNumbers.length; i++) {
            var elems = TravianHelper.fLists[villageIndex].fListNumbers[i];
            for (var j = 0; j < 6; j++)
                reqs[j] += elems[j];
        }
        return reqs;
    }
    TravianHelper.trySendCurrentInFarmList = function () {
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        if (TravianHelper.sendingOutFarmListIdx >= TravianHelper.fLists[villageIndex].fListElements.length) {
            TravianHelper.StopFarmList();
            TravianHelper.setStorage();
            return;
        }

        var index = TravianHelper.CoordToIndex(TravianHelper.fLists[villageIndex].fListElements[TravianHelper.sendingOutFarmListIdx]);

        var href = window.location.origin + "/build.php?gid=16&tt=2&eventType=4&targetMapId=" + index;
        window.location.href = href;
    }

    TravianHelper.getNextFarmlistIndex = function () {
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        for (var i = TravianHelper.sendingOutFarmListIdx + 1; i < TravianHelper.fLists[villageIndex].fListElements.length; i++) {
            var elemUnits = TravianHelper.fLists[villageIndex].fListNumbers[i];
            var good = true;
            for (var j = 0; j < 6; j++)
                if (elemUnits[j] > TravianHelper.army[j])
                    good = false;

            if (good)
                return i;
        }
        TravianHelper.StopFarmList();
        return TravianHelper.fLists[villageIndex].fListElements.length;
    }

    TravianHelper.clearAllBuildingList = function () {
        for (let i = 0; i < TravianHelper.villageIds.length; i++) {
            TravianHelper.villageData[TravianHelper.villageIds[i]].build = [];
        }
        TravianHelper.setStorage();
    }

    TravianHelper.clearAllTrainingList = function () {
        for (let i = 0; i < TravianHelper.villageIds.length; i++) {
            TravianHelper.villageData[TravianHelper.villageIds[i]].train = [];
        }
        TravianHelper.setStorage();
    }

    TravianHelper.clearAllScheduledSends = function () {
        for (let i = 0; i < TravianHelper.villageIds.length; i++) {
            TravianHelper.villageData[TravianHelper.villageIds[i]].scheduledSends = [];
        }
        TravianHelper.setStorage();
    }

    TravianHelper.clearTask = function () {
        TravianHelper.currentTask = -1;
        TravianHelper.sendingOutAllFarmLists = false;
        TravianHelper.setStorage();
    }

    TravianHelper.appendBuildingList = function () {
        console.log("append building list");

        var villageId = TravianHelper.getCurrentVillageIndex();

        if (TravianHelper.villageData[villageId] == null)
            return;

        if (TravianHelper.villageData[villageId].build == null || TravianHelper.villageData[villageId].build.length == 0)
            return;



        if (document.getElementsByClassName("buildingList").length == 0) {
            var v2 = document.getElementsByClassName("village2")[1] || document.getElementsByClassName("villageInfoWrapper")[0];

            let div = document.createElement("div");
            div.classList.add("buildingList");
            div.classList.add("selfMadeList");

            let div2 = document.createElement("div"); //throwaway filler
            let div3 = document.createElement("div"); //throwaway filler

            div.appendChild(div2);
            div.appendChild(div3);

            let ul = document.createElement("ul");
            div.appendChild(ul);

            v2.appendChild(div);
        }

        var ul = document.getElementsByClassName("buildingList")[0].children[2];


        var build = TravianHelper.villageData[villageId].build;

        var indexes = [];
        for (var i = 0; i < build.length; i++)
            indexes.push(i);


        var maxShow = 5;
        if(build.length < 10) {
            maxShow = build.length
        }

        for (let i = 0; i < maxShow; i++) {
            let li = document.createElement("li");

            var a = document.createElement("a");
            a.addEventListener('click', function (event) {
                li.remove();
                var index = indexes[i];
                for (var j = 0; j < indexes.length; j++) {
                    if (indexes[j] > index)
                        indexes[j]--;
                }
                TravianHelper.deleteBuildingListElement(index);
            });
            var img = document.createElement("img");
            img.classList.add("del");
            img.src = "/img/x.gif";
            a.appendChild(img);

            var nameDiv = document.createElement("div");
            nameDiv.innerHTML = build[i].buildingName + " (Index: " + build[i].buildingId + ")";

            li.appendChild(a);
            li.appendChild(nameDiv);

            ul.appendChild(li);
        }

        if(build.length >= 10)
        {
            let li = document.createElement("li");

            var a = document.createElement("a");
            a.innerHTML = "[show more]";

            a.addEventListener('click', function (event) {
                li.remove();
                TravianHelper.appendBuildingListFurther(build, ul);
            });

            li.appendChild(a);
            ul.appendChild(li);
        }

    }

    TravianHelper.appendBuildingListFurther = function(build, ul)
    {
        var indexes = [];
        for (var i = 0; i < build.length; i++)
            indexes.push(i);

        for (let i = 5; i < build.length; i++) {
            let li = document.createElement("li");

            var a = document.createElement("a");
            a.addEventListener('click', function (event) {
                li.remove();
                var index = indexes[i];
                for (var j = 0; j < indexes.length; j++) {
                    if (indexes[j] > index)
                        indexes[j]--;
                }
                TravianHelper.deleteBuildingListElement(index);
            });
            var img = document.createElement("img");
            img.classList.add("del");
            img.src = "/img/x.gif";
            a.appendChild(img);

            var nameDiv = document.createElement("div");
            nameDiv.innerHTML = build[i].buildingName + " (Index: " + build[i].buildingId + ")";

            li.appendChild(a);
            li.appendChild(nameDiv);

            ul.appendChild(li);
        }
    }


    TravianHelper.deleteBuildingListElement = function (index) {
        var villageIndex = TravianHelper.getCurrentVillageIndex();
        var data = TravianHelper.villageData[villageIndex];
        if (data["build"] == null) {
            data["build"] = [];
            return;
        }
        data.build.splice(index, 1);
        TravianHelper.setStorage();
    }


    TravianHelper.getCurrentBuildingDuration = function () {
        var dur = document.getElementsByClassName("inlineIcon duration");
        var formatedTime = dur[0].children[1].innerHTML;
        var timeComponents = formatedTime.split(":");
        var hours = parseInt(timeComponents[0]);
        var minutes = parseInt(timeComponents[1]);
        var seconds = parseInt(timeComponents[2]);

        return hours * 3600 + minutes * 60 + seconds;
    }

    TravianHelper.tryAddBuildingToBuildingList = function () {
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        var href = window.location.href;
        var buildingIndexLocation = href.indexOf("build.php?id=") + "build.php?id=".length;
        var bId = href.slice(buildingIndexLocation, href.indexOf("&"));

        var resource = document.getElementsByClassName("inlineIcon resource");

        if (resource.length > 0) {

            var title = document.getElementsByClassName("titleInHeader")[0];
            var titleValue = title.childNodes[0].textContent.trim();
            var bName = titleValue;

            var wood = Number(resource[0].children[1].innerHTML);
            var clay = Number(resource[1].children[1].innerHTML);
            var iron = Number(resource[2].children[1].innerHTML);
            var wheat = Number(resource[3].children[1].innerHTML);

            var dur = document.getElementsByClassName("inlineIcon duration");
            var formatedTime = dur[0].children[1].innerHTML;
            var timeComponents = formatedTime.split(":");
            var hours = parseInt(timeComponents[0]);
            var minutes = parseInt(timeComponents[1]);
            var seconds = parseInt(timeComponents[2]);

            var data = TravianHelper.villageData[villageIndex];


            if (data["build"] == null)
                data["build"] = [];

            var builds = data["build"];
            var buildObject = { buildingName: bName, buildingId: bId, wood: wood, clay: clay, iron: iron, wheat: wheat };


            builds.push(buildObject);
            TravianHelper.setStorage();
            return buildObject;

        }
    }

    TravianHelper.loadBuildableVillage = function () {
        console.log("load village");
        var villageIndex = TravianHelper.getCurrentVillageIndex();
        for (var i = 0; i < TravianHelper.villageIds.length; i++) {
            var data = TravianHelper.villageData[TravianHelper.villageIds[i]];

            if (data["checkNextOne"] == true) {
                if (villageIndex != TravianHelper.villageIds[i])
                    TravianHelper.changeVillage(TravianHelper.villageIds[i]);
                else {
                    TravianHelper.tryGetBuildingData();
                }
                return;
            }

            if (data.building > 1 && data.buildingEnd > new Date().getTime())
                continue;
            if(data.building > 1)
                data.building--;

            if (data["build"] != null && data["build"].length > 0) {
                var build = data["build"][0];

                if(!TravianHelper.autoBuildUseHeroResources){
                    if (build.wood > data.wood || build.clay > data.clay || build.iron > data.iron || build.wheat > data.wheat)
                        continue;
                }
                else {
                    let needWood = build.wood - data.wood;
                    let needClay = build.clay - data.clay;
                    let needIron = build.iron - data.iron;
                    let needWheat = build.wheat - data.wheat;

                    if(TravianHelper.heroSaferResourceGet) {
                        needWood = TravianHelper.ceilUpToAmount(needWood,100);
                        needClay = TravianHelper.ceilUpToAmount(needClay,100);
                        needIron = TravianHelper.ceilUpToAmount(needIron,100);
                        needWheat = TravianHelper.ceilUpToAmount(needWheat,100);
                    }

                    if(needWood > 0 || needClay > 0 || needIron > 0 || needWheat > 0) {
                        if(TravianHelper.heroResources.wood < needWood)
                            continue;
                        if(TravianHelper.heroResources.clay < needClay)
                            continue;
                        if(TravianHelper.heroResources.iron < needIron)
                            continue;
                        if(TravianHelper.heroResources.wheat < needWheat)
                            continue;

                        if (villageIndex != TravianHelper.villageIds[i])
                            TravianHelper.changeVillage(TravianHelper.villageIds[i]);
                        else
                            TravianHelper.getResourcesFromHero(needWood,needClay,needIron,needWheat, true);
                    }
                }

                TravianHelper.buildCheckDidSomething = true;
                TravianHelper.setStorage();

                if (villageIndex != TravianHelper.villageIds[i])
                    TravianHelper.changeVillage(TravianHelper.villageIds[i]);
                else
                    TravianHelper.tryStartBuilding();
                return;
            }
        }
        for (var i = 0; i < TravianHelper.villageIds.length; i++) {
            var data = TravianHelper.villageData[TravianHelper.villageIds[i]];

            var trains = data["train"];
            if(trains == null || trains.length == 0)
                continue;
            for(var j = trains.length - 1; j >= 0; j--) {
                var train = trains[j];
                if(!TravianHelper.autoTrainUseHeroResources){
                    if (train.wood > data.wood || train.clay > data.clay || train.iron > data.iron || train.wheat > data.wheat)
                        continue;
                }
                else {
                    let needWood = train.wood - data.wood;
                    let needClay = train.clay - data.clay;
                    let needIron = train.iron - data.iron;
                    let needWheat = train.wheat - data.wheat;

                    if(TravianHelper.heroSaferResourceGet) {
                        needWood = TravianHelper.ceilUpToAmount(needWood,100);
                        needClay = TravianHelper.ceilUpToAmount(needClay,100);
                        needIron = TravianHelper.ceilUpToAmount(needIron,100);
                        needWheat = TravianHelper.ceilUpToAmount(needWheat,100);
                    }

                    if(needWood > 0 || needClay > 0 || needIron > 0 || needWheat > 0) {
                        if(TravianHelper.heroResources.wood < needWood)
                            continue;
                        if(TravianHelper.heroResources.clay < needClay)
                            continue;
                        if(TravianHelper.heroResources.iron < needIron)
                            continue;
                        if(TravianHelper.heroResources.wheat < needWheat)
                            continue;

                        if (villageIndex != TravianHelper.villageIds[i])
                            TravianHelper.changeVillage(TravianHelper.villageIds[i]);
                        else
                            TravianHelper.getResourcesFromHero(needWood,needClay,needIron,needWheat, true);
                        continue;
                    }
                }
                TravianHelper.buildCheckDidSomething = true;
                TravianHelper.setStorage();

                if (villageIndex != TravianHelper.villageIds[i])
                    TravianHelper.changeVillage(TravianHelper.villageIds[i]);
                else
                    TravianHelper.tryStartTraining(j);
                return;
            }


        }
        for (var i = 0; i < TravianHelper.villageIds.length; i++) {
            var data = TravianHelper.villageData[TravianHelper.villageIds[i]];

            var demolishIndex = data["demolishIndex"];
            var demolishWait = data["demolishWait"];

            if(demolishIndex == null || demolishIndex == -1 || demolishWait > new Date().getTime())
                continue;

            TravianHelper.buildCheckDidSomething = true;
            TravianHelper.setStorage();

            if (villageIndex != TravianHelper.villageIds[i])
                TravianHelper.changeVillage(TravianHelper.villageIds[i]);
            else
                TravianHelper.doAutoDemolish();
            return;
        }
        for (var i = 0; i < TravianHelper.villageIds.length; i++) {
            var data = TravianHelper.villageData[TravianHelper.villageIds[i]];

            var scheduledSends = data["scheduledSends"];
            if(scheduledSends == null)
                continue;

            for(var j = data.scheduledSends.length - 1; j >= 0; j--)
            {
                if(TravianHelper.hasEnoughTroopsAtHome(data, data.scheduledSends[j]))
                {
                    TravianHelper.buildCheckDidSomething = true;
                    TravianHelper.setStorage();

                    if (villageIndex != TravianHelper.villageIds[i])
                        TravianHelper.changeVillage(TravianHelper.villageIds[i]);
                    else
                        TravianHelper.sendScheduledTroop(j);
                    return;
                }
            }
        }


        if(TravianHelper.autoAdventureEnabled && TravianHelper.adventureCount > 0 && TravianHelper.heroHome && TravianHelper.autoAdventureStop < new Date().getTime())
        {
            TravianHelper.doAutoAdventure();
            return;
        }

        TravianHelper.currentTask = -1;
        TravianHelper.setStorage();
        
        if(TravianHelper.buildCheckDidSomething) {
            TravianHelper.buildCheckDidSomething = false;
            TravianHelper.setStorage();
            if(!window.location.href.includes("dorf2.php"))
                window.location.href = window.location.origin + "/dorf2.php";
        }
    }

    TravianHelper.tryStartTraining = async function (trainIndex) {
        console.log("building");
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        let data = TravianHelper.villageData[villageIndex];
        if (data["train"] != null && data["train"].length > 0) {

            let dataTrain = data["train"];

            let elemTrain = dataTrain[trainIndex];
            var href = elemTrain.link;
            console.log(href);
            console.log(elemTrain);

            if (window.location.href.indexOf(href) == -1) {
                var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                await TravianHelper.wait(confirmDelay);
                window.location.href = href;
            }
            else {
                var trainButton = document.getElementsByClassName("textButtonV1 green startTraining");
                var wait = 0;
                var maxWait = 3000;
                while(trainButton.length == 0)
                {
                    trainButton = document.getElementsByClassName("textButtonV1 green startTraining");
                    await TravianHelper.wait(100);
                    wait += 100;
                    if(wait > maxWait)
                        break;
                }
                if (trainButton.length > 0) {
                    var wrappers = document.getElementsByClassName("innerTroopWrapper");
                    for(let i = 0; i < wrappers.length; i++) {
                        console.log(wrappers[i].classList);
                        if(wrappers[i].classList.contains(elemTrain.troopIndex))
                           {
                            var ctaText = wrappers[i].getElementsByClassName("cta")[0].getElementsByClassName("text");
                               console.log(ctaText);
                               ctaText[0].value = "" + elemTrain.amount;
                           }
                    }
                    await TravianHelper.wait(500);
                    var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                    await TravianHelper.wait(confirmDelay);
                    data["wood"] -= elemTrain.wood;
                    data["clay"] -= elemTrain.clay;
                    data["iron"] -= elemTrain.iron;
                    data["wheat"] -= elemTrain.wheat;
                    data["train"].splice(trainIndex, 1);
                    TravianHelper.setStorage();
                    trainButton[0].click()
                }
                else { 
                    data["wood"] = 0;
                    data["clay"] = 0;
                    data["iron"] = 0;
                    data["wheat"] = 0;
                    TravianHelper.setStorage();
                    TravianHelper.loadBuildableVillage();
                }
            }
        }

    }


    TravianHelper.tryStartBuilding = async function () {
        console.log("building");
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        var data = TravianHelper.villageData[villageIndex];


        if (data["build"] != null && data["build"].length > 0) {
            var elemBuild = data["build"][0];
            var index = elemBuild.buildingId;
            var href = window.location.origin + "/build.php?id=" + index;
            console.log(href);

            if (window.location.href.indexOf(href) == -1) {
                var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                await TravianHelper.wait(confirmDelay);
                window.location.href = href;
            }
            else {
                var buildButton = document.getElementsByClassName("textButtonV1 green build");

                if (buildButton.length > 0) {
                    data["building"] += 1;
                    if(data["building"] > 1)
                        data["buildingEnd"] = data["buildingEnd"];
                    else
                        data["buildingEnd"] = new Date().getTime() + (TravianHelper.getCurrentBuildingDuration() + 1) * 1000;
                    data["wood"] -= data["build"][0].wood;
                    data["clay"] -= data["build"][0].clay;
                    data["iron"] -= data["build"][0].iron;
                    data["wheat"] -= data["build"][0].wheat;
                    data["build"].splice(0, 1);
                    var build = data["build"];
                    if (build.length > 0) {
                        data["checkNextOne"] = true;
                    }
                    TravianHelper.setStorage();
                    var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                    await TravianHelper.wait(confirmDelay);
                    buildButton[0].click();
                }
                else { 
                    data.building++;
                    data.buildingEnd = new Date().getTime() + 300000;
                    TravianHelper.setStorage();
                    TravianHelper.loadBuildableVillage();
                }
            }
        }

    }


    TravianHelper.tryGetBuildingData = async function () {
        console.log("building");
        var villageIndex = TravianHelper.getCurrentVillageIndex();

        var data = TravianHelper.villageData[villageIndex];


        if (data["build"] != null && data["build"].length > 0) {
            var elemBuild = data["build"][0];
            var index = elemBuild.buildingId;
            var href = window.location.origin + "/build.php?id=" + index;
            console.log(href);

            if (window.location.href.indexOf(href) == -1) {
                var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                await TravianHelper.wait(confirmDelay);
                window.location.href = href;
            }
            else {

                var resource = document.getElementsByClassName("inlineIcon resource");
                console.log("getting building data for next building");
                if (resource.length > 0) {

                    var wood = Number(resource[0].children[1].innerHTML);
                    var clay = Number(resource[1].children[1].innerHTML);
                    var iron = Number(resource[2].children[1].innerHTML);
                    var wheat = Number(resource[3].children[1].innerHTML);

                    elemBuild.wood = wood;
                    elemBuild.clay = clay;
                    elemBuild.iron = iron;
                    elemBuild.wheat = wheat;

                    console.log("Wood: " + wood + " | Clay: " + clay + " | Iron: " + iron + " | Wheat: " + wheat);

                    data["checkNextOne"] = false;

                    TravianHelper.setStorage();
                    var confirmDelay = TravianHelper.generateRandomNumber(TravianHelper.confirmDelayMinMs, TravianHelper.confirmDelayMaxMs);
                    await TravianHelper.wait(confirmDelay);
                    href = window.location.origin + "/dorf1.php";
                    window.location.href = href
                }
                else {
                    data["build"].splice(0, 1);
                    data["checkNextOne"] = false;
                    TravianHelper.setStorage();
                    window.location.href = window.location.origin + "/dorf1.php";
                }
            }
        }

    }

    TravianHelper.getMissingResources = function () {
        var ub = document.getElementsByClassName("upgradeBuilding");
        if (ub.length == 0 || ub[0].classList.length > 1)
            return {
                wood: "NaN", clay: "NaN", iron: "NaN", wheat: "NaN"
            };

        var resource = document.getElementsByClassName("inlineIcon resource");

        if (resource.length > 0) {
            var reqWood = Number(resource[0].children[1].innerHTML);
            var reqClay = Number(resource[1].children[1].innerHTML);
            var reqIron = Number(resource[2].children[1].innerHTML);
            var reqWheat = Number(resource[3].children[1].innerHTML);
        }

        var sbs = document.getElementsByClassName("stockBarButton");
        if (sbs.length > 0) {
            var wood = Number(sbs[0].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
            var clay = Number(sbs[1].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
            var iron = Number(sbs[2].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
            var wheat = Number(sbs[3].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
        }

        var nWood = reqWood - wood;
        var nClay = reqClay - clay;
        var nIron = reqIron - iron;
        var nWheat = reqWheat - wheat;

        if (nWood < 0)
            nWood = 0;
        if (nClay < 0)
            nClay = 0;
        if (nIron < 0)
            nIron = 0;
        if (nWheat < 0)
            nWheat = 0;

        return { wood: nWood, clay: nClay, iron: nIron, wheat: nWheat };
    }

    TravianHelper.scheduleTraining = function(troopt, amount, wood, clay, iron, wheat)
    {
        var numAmount = Number(amount);
        if(!Number.isInteger(numAmount))
            return;

        var villageIndex = TravianHelper.getCurrentVillageIndex();
        var href = window.location.href;
        var data = TravianHelper.villageData[villageIndex];


        if (data["train"] == null)
            data["train"] = [];

        var trains = data["train"];
        var trainObject = { link: href, troopIndex: troopt, amount: numAmount, wood: wood, clay: clay, iron: iron, wheat: wheat };
        trains.push(trainObject);
        TravianHelper.setStorage();
    }


    TravianHelper.tryAppendTrainingOption = function () {
        var tt = document.getElementsByClassName("innerTroopWrapper");
        var wrappers = [];
        if (tt.length > 0) {
            for (var i = 0; i < tt.length; i++) {
                if (tt[i].childElementCount > 2)
                    wrappers.push(tt[i].children[2].children[1]);
                else
                    wrappers.push(tt[i].children[1].children[1]);
            }
        }
        else {
            var tt = document.getElementsByClassName("research");
            if (tt.length > 0) {
                for (var i = 0; i < tt.length; i++) {
                    if (tt[i].children[0].childElementCount > 1 && tt[i].children[0].children[1].classList[1] == "resourceWrapper")
                        wrappers.push(tt[i].children[0].children[1]);
                    else if (tt[i].children[1].children[1].classList[1] == "resourceWrapper")
                        wrappers.push(tt[i].children[1].children[1]);
                }
            }
            else {
                var tt = document.getElementsByClassName("buildingWrapper")
                if (tt.length > 0) {
                    for (var i = 0; i < tt.length; i++) {
                        wrappers.push(tt[i].children[2].children[1]);
                    }
                }
            }
        }


        var ctas = document.getElementsByClassName("cta");

        var reqs = [];
        for (var i = 0; i < wrappers.length; i++) {
            var reqWood = Number(wrappers[i].children[0].children[1].innerHTML);
            var reqClay = Number(wrappers[i].children[1].children[1].innerHTML);
            var reqIron = Number(wrappers[i].children[2].children[1].innerHTML);
            var reqWheat = Number(wrappers[i].children[3].children[1].innerHTML);

            reqs.push({ wood: reqWood, clay: reqClay, iron: reqIron, wheat: reqWheat });
        }
        console.log(reqs);


        for (let i = 0; i < ctas.length; i++) {
            var func = function (index, event) {
                // This function will be called whenever the input value changes
                var newValue = event.target.value;
                console.log("New value string: " + newValue);
                newValue = Number(newValue);
                if (newValue < 0)
                    newValue = 0;

                console.log(newValue);
                console.log("Index: " + index)
                wrappers[index].children[0].children[1].innerHTML = "" + (newValue * reqs[index].wood);
                wrappers[index].children[1].children[1].innerHTML = "" + (newValue * reqs[index].clay);
                wrappers[index].children[2].children[1].innerHTML = "" + (newValue * reqs[index].iron);
                wrappers[index].children[3].children[1].innerHTML = "" + (newValue * reqs[index].wheat);



                var reqWood = Number(wrappers[index].children[0].children[1].innerHTML);
                var reqClay = Number(wrappers[index].children[1].children[1].innerHTML);
                var reqIron = Number(wrappers[index].children[2].children[1].innerHTML);
                var reqWheat = Number(wrappers[index].children[3].children[1].innerHTML);

                var sbs = document.getElementsByClassName("stockBarButton");
                if (sbs.length > 0) {
                    var wood = Number(sbs[0].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    var clay = Number(sbs[1].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    var iron = Number(sbs[2].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    var wheat = Number(sbs[3].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                }

                var nWood = reqWood - wood;
                var nClay = reqClay - clay;
                var nIron = reqIron - iron;
                var nWheat = reqWheat - wheat;

                if (nWood < 0)
                    nWood = 0;
                if (nClay < 0)
                    nClay = 0;
                if (nIron < 0)
                    nIron = 0;
                if (nWheat < 0)
                    nWheat = 0;

                var heroGetter = document.getElementsByClassName("heroGetter");
                if (nWood > 0 || nClay > 0 || nIron > 0 || nWheat > 0)
                    heroGetter[index].innerText = "Get resources";
                else
                    heroGetter[index].innerText = "Has enough";
            }
            ctas[i].addEventListener('input', function (event) {
                func(i, event);
            });
        }

        for (let i = 0; i < wrappers.length; i++) {
            var button = document.createElement("a");

            var reqWood = Number(wrappers[i].children[0].children[1].innerHTML);
            var reqClay = Number(wrappers[i].children[1].children[1].innerHTML);
            var reqIron = Number(wrappers[i].children[2].children[1].innerHTML);
            var reqWheat = Number(wrappers[i].children[3].children[1].innerHTML);

            var sbs = document.getElementsByClassName("stockBarButton");
            if (sbs.length > 0) {
                var wood = Number(sbs[0].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                var clay = Number(sbs[1].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                var iron = Number(sbs[2].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                var wheat = Number(sbs[3].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
            }

            var nWood = reqWood - wood;
            var nClay = reqClay - clay;
            var nIron = reqIron - iron;
            var nWheat = reqWheat - wheat;

            if (nWood < 0)
                nWood = 0;
            if (nClay < 0)
                nClay = 0;
            if (nIron < 0)
                nIron = 0;
            if (nWheat < 0)
                nWheat = 0;
            if (nWood > 0 || nClay > 0 || nIron > 0 || nWheat > 0)
                button.innerText = "Get resources";
            else
                button.innerText = "Has enough";

            button.classList.add("textButtonV1");
            button.classList.add("green");
            button.classList.add("heroGetter");
            button.addEventListener("click", function () {
                var reqWood = Number(wrappers[i].children[0].children[1].innerHTML);
                var reqClay = Number(wrappers[i].children[1].children[1].innerHTML);
                var reqIron = Number(wrappers[i].children[2].children[1].innerHTML);
                var reqWheat = Number(wrappers[i].children[3].children[1].innerHTML);

                var sbs = document.getElementsByClassName("stockBarButton");
                if (sbs.length > 0) {
                    var wood = Number(sbs[0].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    var clay = Number(sbs[1].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    var iron = Number(sbs[2].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                    var wheat = Number(sbs[3].getElementsByClassName("value")[0].innerHTML.replace(/[^\d]/g, ''));
                }

                var nWood = reqWood - wood;
                var nClay = reqClay - clay;
                var nIron = reqIron - iron;
                var nWheat = reqWheat - wheat;

                if (nWood < 0)
                    nWood = 0;
                if (nClay < 0)
                    nClay = 0;
                if (nIron < 0)
                    nIron = 0;
                if (nWheat < 0)
                    nWheat = 0;

                TravianHelper.getResourcesFromHero(nWood, nClay, nIron, nWheat);
                console.log("Miu");
            });
            wrappers[i].parentElement.appendChild(button);
        }
        var troopWrappers = document.getElementsByClassName("innerTroopWrapper");
        {

            for(let i = 0; i < troopWrappers.length; i++)
            {
                var button2 = document.createElement("a");
                button2.innerText = "Schedule training";

                button2.classList.add("textButtonV1");
                button2.classList.add("green");
                button2.classList.add("trainScheduler");
    
                button2.addEventListener("click", function () {
                    var troopt = "";
                    for(let j = 0; j < troopWrappers[i].classList.length; j++)
                    {
                        if(troopWrappers[i].classList[j].includes("troopt"))
                        {
                            troopt = troopWrappers[i].classList[j];
                            break;
                        }
                    }

                    var resource = troopWrappers[i].getElementsByClassName("inlineIconList resourceWrapper");
                    var amount = troopWrappers[i].getElementsByClassName("text")[0].value;
                    var wood = Number(resource[0].children[0].children[1].innerHTML);
                    var clay = Number(resource[0].children[1].children[1].innerHTML);
                    var iron = Number(resource[0].children[2].children[1].innerHTML);
                    var wheat = Number(resource[0].children[3].children[1].innerHTML);

                    TravianHelper.scheduleTraining(troopt,amount,wood,clay,iron,wheat);
                    TravianHelper.tryAppendScheduledTrains();
                    console.log("Miu " + troopt);
                });
                button2.style.float = "right";
                troopWrappers[i].appendChild(button2);

            }
        }
        //adding existings
        TravianHelper.tryAppendScheduledTrains();
    }

    TravianHelper.tryAppendScheduledTrains = function(){

        var schedTrains = document.getElementsByClassName("scheduledTrain");
        var elementsArray = Array.from(schedTrains);

        elementsArray.forEach(function(element) {
        element.remove();  // Removes the element from the DOM
        });

        var villageIndex = TravianHelper.getCurrentVillageIndex();
        var data = TravianHelper.villageData[villageIndex];
        if (data["train"] == null)
            data["train"] = [];

        var train = data["train"];

        var href = window.location.href;

        for(let i = 0; i < train.length; i++)
        {
            if(href != train[i].link)
                continue;
            let troopt = train[i].troopIndex;
            let neededWrapper = document.getElementsByClassName("innerTroopWrapper " + troopt);
            var unitImage = neededWrapper[0].getElementsByClassName("unit");
            
            var container = document.getElementsByClassName("contentContainer")
            
            // Create a wrapper div to hold both the image and the text
            var wrapperDiv = document.createElement("div");
            wrapperDiv.style.display = "flex";  // Use flexbox to position the image and text side by side
            wrapperDiv.style.alignItems = "center";  // Align vertically in the center
            
            var a = document.createElement("a");
            a.style.position = "relative";
            a.style.left = "30px";  // Adjust the value as needed
            a.addEventListener('click', function (event) {
                train.splice(i ,1);
                TravianHelper.tryAppendScheduledTrains();
                TravianHelper.setStorage();
            });
            var esc = document.createElement("img");
            esc.classList.add("del");
            esc.src = "/img/x.gif";
            a.appendChild(esc);


            var img = document.createElement("img");
            img.src = '/img/x.gif';
            img.classList.add("unit");
            img.classList.add(unitImage[0].classList[1]);
            
            img.style.position = "relative";
            img.style.left = "35px";  // Adjust the value as needed
            
            // Create the text element
            var text = document.createElement("span");
            text.innerText = train[i].amount + " scheduled"  // Replace with your desired text
            text.style.position = "relative";
            text.style.left = "40px";  // Adjust the value as needed
            
            // Append the image and the text to the wrapper div
            wrapperDiv.classList.add("scheduledTrain");
            wrapperDiv.appendChild(a);
            wrapperDiv.appendChild(img);
            wrapperDiv.appendChild(text);
            container[0].appendChild(wrapperDiv);
        }
    }

    TravianHelper.setDemolish = function () {
        var demolish = document.getElementById("demolish");
        var buildingId = demolish.value;

        var villageIndex = TravianHelper.getCurrentVillageIndex();
        var data = TravianHelper.villageData[villageIndex];

        data["demolishIndex"] = buildingId;
        data["demolishWait"] = new Date().getTime()
        demolish.value = data["demolishIndex"];

        TravianHelper.setStorage();
    }

    TravianHelper.doAutoDemolish = async function() {
        console.log("auto demolish");
        await TravianHelper.wait(100);
        var villageIndex = TravianHelper.getCurrentVillageIndex();
        var data = TravianHelper.villageData[villageIndex];
        if(data["demolishIndex"] == null || data["demolishIndex"] == -1)
            return;
        
        var href = window.location.href;

        if(!href.includes("gid=15"))
        {
            window.location.href = window.location.origin + "/build.php?gid=15";
            return;
        }
        var demolish_building = document.getElementsByClassName("demolish_building");
        var timer = document.getElementsByClassName("timer");

        if(demolish_building.length > 0)
        {
            var demolishButton = demolish_building[0].getElementsByClassName("textButtonV1 green");
            if(demolishButton.length > 0)
            {
                var demolish = document.getElementById("demolish");
                var found = false;
                for(var i = 0; i < demolish.children.length; i++)
                {
                    if(demolish.children[i].value == data["demolishIndex"])
                        found = true;
                }
                if(found)
                {
                    demolish.value = data["demolishIndex"];
                }
                else {
                    data["demolishIndex"] = -1;
                    TravianHelper.setStorage();
                    await TravianHelper.wait(500);
                    window.location.href = window.location.origin + "/dorf2.php";
                    return;
                }
                await TravianHelper.wait(500);
                demolishButton[0].click()
            }

        }
        else if (timer.length > 1)
        {
            demolishTimer = timer[timer.length - 1];
            data["demolishWait"] = new Date().getTime() + (Number(demolishTimer.getAttribute("value")) + 1) * 1000;
            TravianHelper.setStorage();
            await TravianHelper.wait(500);
            window.location.href = window.location.origin + "/dorf2.php";
        }
        else {
            data["demolishWait"] = new Date().getTime() + 3600 * 1000;
            await TravianHelper.wait(500);
            TravianHelper.setStorage();
            return;
        }
    }

    TravianHelper.tryAppendBuildGui = function () {

        var res = TravianHelper.getMissingResources();
        if (!isNaN(TravianHelper.getMissingResources().wood)) {
            var videoButton = document.getElementsByClassName("videoFeatureButton");

            for (var i = 0; i < videoButton.length; i++) {
                videoButton[i].addEventListener('click', function () {
                    TravianHelper.checkTaskEnd = true;
                    var date = new Date();
                    var time = date.getTime();
                    var fset = (TravianHelper.farmSendingEndTime - time) / 1000;
                    var nfst = (TravianHelper.nextFarmSendTime - time) / 1000;
                    var noft = (TravianHelper.nextOasisFarmSendTime - time) / 1000;
                    var nvc = (TravianHelper.nextVillageCheckTime - time) / 1000;
                    var nbc = (TravianHelper.nextBuildCheckTime - time) / 1000;

                    for (var k = 0; k < TravianHelper.farmListProfiles.length; k++) {
                        var flpt = (TravianHelper.farmListProfiles[k].nextTime - time) / 1000;
                        if (flpt < 40 && fset >= 40) {
                            TravianHelper.farmListProfiles[k].nextTime += (40 - flpt) * 1000;
                        }
                    }

                    if (nfst < 40 && fset >= 40) {
                        TravianHelper.nextFarmSendTime += (40 - nfst) * 1000;
                    }
                    if (noft < 40 && fset >= 40) {
                        TravianHelper.nextOasisFarmSendTime += (40 - noft) * 1000;
                    }
                    if (nvc < 40) {
                        TravianHelper.nextVillageCheckTime += (40 - nvc) * 1000;
                    }
                    if (nbc < 40) {
                        TravianHelper.nextBuildCheckTime += (40 - nbc) * 1000;
                    }
                    TravianHelper.setStorage();
                    console.log('Button clicked');
                });
            }

            TravianHelper.createAddToBuildingListButton();
        }

        if (res.wood > 0 || res.clay > 0 || res.iron > 0 || res.wheat > 0) {
            var resource = document.getElementsByClassName("inlineIcon resource");

            var button = document.createElement("button");
            button.innerText = "Get resources";
            button.classList.add("textButtonV1");
            button.classList.add("green");
            button.addEventListener("click", function () {
                TravianHelper.getResourcesFromHero(res.wood, res.clay, res.iron, res.wheat);
                console.log("Miu");
            });

            resource[4].parentElement.appendChild(button);
        }

        if (window.location.href.includes("id=39")) {
            var buildRally = document.getElementsByClassName("build buildRallyPoint");

            if (buildRally.length > 0) {

                var button = document.createElement("button")
                button.innerText = "Confirm attacks";
                button.classList.add("textButtonV1");
                button.classList.add("green");

                button.addEventListener("click", function () {
                    TravianHelper.confirmAttacks();
                })

                buildRally[0].appendChild(button);
            }
        }
        if (window.location.href.includes("gid=15")) {
            var demolishNow = document.getElementsByClassName("demolish_building");

            if(demolishNow.length > 0) {

                var demoButton = document.createElement("button");
                demoButton.innerText = "Demolish fully";
                demoButton.classList.add("textButtonV1");
                demoButton.classList.add("green");
                demoButton.addEventListener("click", function () {
                    TravianHelper.setDemolish();
                    console.log("Miu");
                });

                demolishNow[0].appendChild(demoButton);
            }

            var rounds = document.getElementsByClassName("round");
            for(var i = 0; i < rounds.length; i++)
                if(rounds[i].innerHTML.includes("Demolish"))
                {
                    var villageIndex = TravianHelper.getCurrentVillageIndex();
                    var data = TravianHelper.villageData[villageIndex];
            
                    if(data["demolishIndex"] != null && data["demolishIndex"] != -1){
                        var buttonA = document.createElement("a");
                        buttonA.innerText = "Stop autodemolish here";
                        buttonA.classList.add("textButtonV1");
                        buttonA.classList.add("green");
                        buttonA.classList.add("heroGetter");
                        buttonA.addEventListener("click", function () {
                            data["demolishIndex"] = -1;
                            TravianHelper.setStorage();
                            console.log("Miu");
                        });
                        rounds[i].appendChild(buttonA);
                    }
                }
        }

        TravianHelper.tryAppendTrainingOption();
    }

    TravianHelper.addOasisFarmList = function (listName) {
        TravianHelper.oasisFarmLists.push(listName);
        TravianHelper.setStorage();
    }

    TravianHelper.removeOasisFarmList = function (name) {
        for (var i = 0; i < TravianHelper.oasisFarmLists.length; i++) {
            if (TravianHelper.oasisFarmLists[i] == name) {
                TravianHelper.oasisFarmLists.splice(i, 1);
                TravianHelper.setStorage();
                return;
            }
        }
    }

    function formatTime(seconds) {
        // Get the total minutes by dividing by 60
        const minutes = Math.floor(seconds / 60);
    
        // Get the remaining seconds (including the decimal part for milliseconds)
        const remainingSeconds = (seconds % 60).toFixed(1);
    
        // Format the output as `minutes:seconds.milliseconds`
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    TravianHelper.updateFarmlistTimers = async function (spawnedChildren)
    {
        while(true)
        {
            var date = new Date();
            var time = date.getTime();
            for (var i = TravianHelper.farmListProfiles.length - 1; i >= 0; i--) {
                var target = document.getElementById("rallyPointFarmList");

                var timeFormated = formatTime((TravianHelper.farmListProfiles[i].nextTime - time) / 1000);
                spawnedChildren[spawnedChildren.length - i - 1].textContent = 'Next farmlist send in (' + TravianHelper.farmListProfiles[i].name + '): ' + timeFormated; // Add some content or attributes to the new element
                await TravianHelper.wait(10);
            }
        }
    }

    TravianHelper.appendFarmlistPage = async function () {
        console.log("append farmlist page")
        var headers = document.getElementsByClassName("farmListHeader")
        while (headers.length == 0) {
            headers = document.getElementsByClassName("farmListHeader")
            await TravianHelper.wait(500);
        }

        var date = new Date();
        var time = date.getTime();

        if(TravianHelper.farmSendingEndTime > time) {
            var spawnedChildren = [];
            for (var i = TravianHelper.farmListProfiles.length - 1; i >= 0; i--) {
                var target = document.getElementById("rallyPointFarmList");
                const newChild = document.createElement('div');
                var timeFormated = formatTime((TravianHelper.farmListProfiles[i].nextTime - time) / 1000);
                newChild.textContent = 'Next farmlist send in (' + TravianHelper.farmListProfiles[i].name + '): ' + timeFormated; // Add some content or attributes to the new element
                target.insertBefore(newChild, target.firstChild);
                spawnedChildren.push(newChild);
            }
            TravianHelper.updateFarmlistTimers(spawnedChildren);
        }

        if( TravianHelper.farmListProfiles.length <= 1)
            return;
        for (let i = 0; i < headers.length; i++) {

            let selectElement = document.createElement("select");
            let listName = headers[i].children[1].children[0].innerHTML;

            // Clear existing options
            selectElement.innerHTML = "";
            selectElement.setAttribute("id", "flProfileSelect_" + i);

            // Add options from the array
            TravianHelper.farmListProfiles.forEach(function (item, index) {
                var option = document.createElement("option");
                option.text = item.name;
                option.value = index; // Set the value to the index of the item
                selectElement.add(option);
            });

            selectElement.selectedIndex = TravianHelper.getProfileForFarmList(listName);
            // Event listener for change in selection
            selectElement.addEventListener("change", function () {
                var selectedIndex = selectElement.value;
                console.log("Selected index:" + selectedIndex);
                TravianHelper.assignProfileToFarmlist(listName, selectedIndex);
                TravianHelper.setStorage();
            });

            headers[i].children[1].appendChild(selectElement);
            continue;
        }
    }

    TravianHelper.appendSettingsGui = function () {
        var options = document.getElementsByClassName("options optionsGame");
        var h4 = document.createElement("h4");
        h4.innerText = "Helper Settings";
        h4.classList.add("round");
        h4.classList.add("spacer");
        options[0].appendChild(h4);
        TravianHelper.createSettingsTable(options);

        var divContainer = document.createElement("div");
        divContainer.classList.add("submitButtonContainer");

        var saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.type = "submit";
        saveButton.classList.add("textButtonV1");
        saveButton.classList.add("green");

        saveButton.addEventListener("click", function () {
            var cdMinValue = document.getElementById("confirmMinDelay").value;
            var cdMaxValue = document.getElementById("confirmMaxDelay").value;
            TravianHelper.confirmDelayMinMs = cdMinValue;
            TravianHelper.confirmDelayMaxMs = cdMaxValue;

            var nvMinValue = document.getElementById("nextVillageDelayMin").value;
            var nvMaxValue = document.getElementById("nextVillageDelayMax").value;
            TravianHelper.nextVillageDelayMinMs = nvMinValue;
            TravianHelper.nextVillageDelayMaxMs = nvMaxValue;

            var vctMinValue = document.getElementById("villageCheckTimeMin").value;
            var vctMaxValue = document.getElementById("villageCheckTimeMax").value;
            TravianHelper.villageCheckTimes.min = vctMinValue;
            TravianHelper.villageCheckTimes.max = vctMaxValue;

            var bctMinValue = document.getElementById("buildCheckTimesMin").value;
            var bctMaxValue = document.getElementById("buildCheckTimesMax").value;
            TravianHelper.buildCheckTimes.min = bctMinValue;
            TravianHelper.buildCheckTimes.max = bctMaxValue;

            var wheatWarnerValue = document.getElementById("wheatWarningCooldown").value;
            TravianHelper.wheatWarningSeconds = wheatWarnerValue;

            var whcPercent = document.getElementById("warehouseWarnerPercent").value;
            TravianHelper.fullnessWarningPercent = whcPercent;

            var fcNeeded = document.getElementById("farmCheckNeeded").value;
            if(fcNeeded < 1)
                fcNeeded = 1;
            TravianHelper.farmCheckNeeded = fcNeeded;

            var playerId = document.getElementById("helperPlayerId").value;
            if(playerId < 1)
                playerId = 1;
            TravianHelper.playerId = playerId;

            var enableMessageNotification = document.getElementById("enableMessageNotification").checked;
            TravianHelper.enableMessageNotification = enableMessageNotification;

            var farmCheckBefore = document.getElementById("farmCheckBefore").checked;
            TravianHelper.farmCheckBeforeSending = farmCheckBefore;

            var whFullnessCheck = document.getElementById("warehouseFullnessCheck").checked;
            TravianHelper.warehouseFullWarning = whFullnessCheck;

            var gFullnessCheck = document.getElementById("granaryFullnessCheck").checked;
            TravianHelper.granaryFullWarning = gFullnessCheck;

            var goldClub = document.getElementById("goldClubCheck").checked;
            TravianHelper.goldClub = goldClub;

            var autoAdventureEnabled = document.getElementById("autoAdventureEnabled").checked;
            TravianHelper.autoAdventureEnabled = autoAdventureEnabled;

            var autoAdventureMaxTime = document.getElementById("autoAdventureMaxTime").value;
            TravianHelper.autoAdventureMaxTime = autoAdventureMaxTime;

            var heroSaferResourceGet = document.getElementById("heroSaferResourceGet").checked;
            TravianHelper.heroSaferResourceGet = heroSaferResourceGet;

            var autoBuildHeroResources = document.getElementById("autoBuildHeroResources").checked;
            TravianHelper.autoBuildUseHeroResources = autoBuildHeroResources;

            var autoTrainHeroResources = document.getElementById("autoTrainHeroResources").checked;
            TravianHelper.autoTrainUseHeroResources = autoTrainHeroResources;

            var enableReactivating = document.getElementById("enableReactivatingCheck").checked;
            TravianHelper.enableReactivating = enableReactivating;

            var auctionItemBackground = document.getElementById("auctionItemBackground").checked;
            TravianHelper.auctionItemBackground = auctionItemBackground;

            var auctionShowSellerId = document.getElementById("auctionShowSellerId").checked;
            TravianHelper.auctionShowSellerId = auctionShowSellerId;

            var auctionReminder = document.getElementById("auctionReminder").value;
            TravianHelper.auctionReminderSeconds = auctionReminder;

            var autoUnfillBattleSimulator = document.getElementById("autoUnfillBattleSimulator").checked;
            TravianHelper.autoUnfillBattleSimulator = autoUnfillBattleSimulator;

            var doQuickAttackCheck = document.getElementById("quickAttackCheck").checked;
            TravianHelper.quickAttackCheckEnabled = doQuickAttackCheck;

            var doVillageCheck = document.getElementById("doVillageCheck").checked;
            TravianHelper.doVillageCheck = doVillageCheck;

            var doVillageChecksWithoutFarming = document.getElementById("doVillageChecksWithoutFarming").checked;
            TravianHelper.doVillageChecksWithoutFarming = doVillageChecksWithoutFarming;

            var quickVillageCheck = document.getElementById("quickVillageCheck").checked;
            TravianHelper.quickVillageCheck = quickVillageCheck;

            var qacMinValue = document.getElementById("quickAttackCheckTimesMin").value;
            var qacMaxValue = document.getElementById("quickAttackCheckTimesMax").value;
            TravianHelper.quickAttackCheckTimes.min = qacMinValue;
            TravianHelper.quickAttackCheckTimes.max = qacMaxValue;

            TravianHelper.setStorage();
        });

        divContainer.appendChild(saveButton);
        options[0].appendChild(divContainer);

        TravianHelper.createTimeTable(options);
        var divContainer2 = document.createElement("div");
        divContainer2.classList.add("submitButtonContainer");

        var saveButton2 = document.createElement("button");
        saveButton2.innerText = "Set end time for now";
        saveButton2.type = "submit";
        saveButton2.classList.add("textButtonV1");
        saveButton2.classList.add("green");

        saveButton2.addEventListener("click", function () {
            var hourValue = Number(document.getElementById("farmListHour").value);
            var minValue = Number(document.getElementById("farmListMin").value);
            var secValue = Number(document.getElementById("farmListSec").value);

            TravianHelper.SetFarmsendingEndTimeFromNow(hourValue, minValue, secValue);

            var t = document.getElementById("farmListDate")
            const date = new Date(TravianHelper.farmSendingEndTime);
            const formattedDate = `${date.getFullYear()}.${TravianHelper.padZero(date.getMonth() + 1)}.${TravianHelper.padZero(date.getDate())}. ${TravianHelper.padZero(date.getHours())}:${TravianHelper.padZero(date.getMinutes())}:${TravianHelper.padZero(date.getSeconds())}`;

            t.textContent = "Farmlist end time: " + formattedDate;
        });

        divContainer2.appendChild(saveButton2);
        options[0].appendChild(divContainer2);

        var h4_1_2 = document.createElement("h4");
        h4_1_2.innerText = "Stop sound until";
        h4_1_2.classList.add("round");
        h4_1_2.classList.add("spacer");
        options[0].appendChild(h4_1_2);

        TravianHelper.createStopSoundTimeTable(options);
        var divContainer2_2 = document.createElement("div");
        divContainer2_2.classList.add("submitButtonContainer");

        var saveButton2_2 = document.createElement("button");
        saveButton2_2.innerText = "Stop sounds until";
        saveButton2_2.type = "submit";
        saveButton2_2.classList.add("textButtonV1");
        saveButton2_2.classList.add("green");

        saveButton2_2.addEventListener("click", function () {
            var hourValue = Number(document.getElementById("stopSoundHour").value);
            var minValue = Number(document.getElementById("stopSoundMin").value);
            var secValue = Number(document.getElementById("stopSoundSecond").value);

            TravianHelper.SetStopSoundFromNow(hourValue, minValue, secValue);

            var t = document.getElementById("stopSoundDate")
            const date = new Date(TravianHelper.stopSoundUntil);
            const formattedDate = `${date.getFullYear()}.${TravianHelper.padZero(date.getMonth() + 1)}.${TravianHelper.padZero(date.getDate())}. ${TravianHelper.padZero(date.getHours())}:${TravianHelper.padZero(date.getMinutes())}:${TravianHelper.padZero(date.getSeconds())}`;

            t.textContent = "Not playing sound until: " + formattedDate;
        });

        divContainer2_2.appendChild(saveButton2_2);
        options[0].appendChild(divContainer2_2);


        var h4_2 = document.createElement("h4");
        h4_2.innerText = "Profile Settings";
        h4_2.classList.add("round");
        h4_2.classList.add("spacer");
        options[0].appendChild(h4_2);

        var divContainer3 = document.createElement("div");
        divContainer3.classList.add("submitButtonContainer");

        var newButton2 = document.createElement("button");
        newButton2.innerText = "Create New Profile";
        newButton2.type = "submit";
        newButton2.classList.add("textButtonV1");
        newButton2.classList.add("green");

        newButton2.addEventListener("click", function () {
            TravianHelper.createFarmlistProfile("Profile " + (TravianHelper.farmListProfiles.length + 1));
            TravianHelper.createFarmlistProfileTable(options, Number(document.getElementById("flProfileSelect").value));
            TravianHelper.setStorage();
        });
        divContainer3.appendChild(newButton2);
        options[0].appendChild(divContainer3);

        TravianHelper.createFarmlistProfileTable(options, 0, null);

        var divContainer4 = document.createElement("div");
        divContainer4.classList.add("submitButtonContainer");

        var saveButton3 = document.createElement("button");
        saveButton3.innerText = "Save Profile";
        saveButton3.type = "submit";
        saveButton3.classList.add("textButtonV1");
        saveButton3.classList.add("green");

        saveButton3.addEventListener("click", function () {
            let selectedIndex = Number(document.getElementById("flProfileSelect").value);
            let minTime = Number(document.getElementById("flProfileMinTime").value);
            let maxTime = Number(document.getElementById("flProfileMaxTime").value);
            let nameInputValue = document.getElementById("profileNameInput").value;

            TravianHelper.farmListProfiles[selectedIndex].name = nameInputValue;
            TravianHelper.farmListProfiles[selectedIndex].minTime = minTime;
            TravianHelper.farmListProfiles[selectedIndex].maxTime = maxTime;
            TravianHelper.createFarmlistProfileTable(options, Number(document.getElementById("flProfileSelect").value));
            TravianHelper.setStorage();
        });

        divContainer4.appendChild(saveButton3);
        options[0].appendChild(divContainer4);

        var divContainer5 = document.createElement("div");
        divContainer5.classList.add("submitButtonContainer");

        var delButton = document.createElement("button");
        delButton.innerText = "Delete Profile";
        delButton.type = "submit";
        delButton.classList.add("textButtonV1");
        delButton.classList.add("green");

        delButton.addEventListener("click", function () {
            let selectedIndex = Number(document.getElementById("flProfileSelect").value);

            TravianHelper.removeFarmListProfile(selectedIndex);

            if (selectedIndex >= TravianHelper.farmListProfiles.length)
                selectedIndex = TravianHelper.farmListProfiles.length - 1;

            TravianHelper.createFarmlistProfileTable(options, selectedIndex);
            TravianHelper.setStorage();
        });
        divContainer5.appendChild(delButton);
        options[0].appendChild(divContainer5);


        var h4_3 = document.createElement("h4");
        h4_3.innerText = "Quick Actions";
        h4_3.classList.add("round");
        h4_3.classList.add("spacer");
        options[0].appendChild(h4_3);


        var divContainer_1 = document.createElement("div");
        divContainer_1.classList.add("submitButtonContainer");

        var Button_1 = document.createElement("button");
        Button_1.innerText = "Clear current task";
        Button_1.type = "submit";
        Button_1.classList.add("textButtonV1");
        Button_1.classList.add("green");

        Button_1.addEventListener("click", function () {
            TravianHelper.clearTask();
        });
        divContainer_1.appendChild(Button_1);
        options[0].appendChild(divContainer_1);

        var divContainer_2 = document.createElement("div");
        divContainer_2.classList.add("submitButtonContainer");

        var Button_2 = document.createElement("button");
        Button_2.innerText = "Clear all buildings scheduled";
        Button_2.type = "submit";
        Button_2.classList.add("textButtonV1");
        Button_2.classList.add("green");

        Button_2.addEventListener("click", function () {
            TravianHelper.clearAllBuildingList();
        });
        divContainer_2.appendChild(Button_2);
        options[0].appendChild(divContainer_2);

        var divContainer_3 = document.createElement("div");
        divContainer_3.classList.add("submitButtonContainer");

        var Button_3 = document.createElement("button");
        Button_3.innerText = "Clear all trainings scheduled";
        Button_3.type = "submit";
        Button_3.classList.add("textButtonV1");
        Button_3.classList.add("green");

        Button_3.addEventListener("click", function () {
            TravianHelper.clearAllTrainingList();
        });
        divContainer_3.appendChild(Button_3);
        options[0].appendChild(divContainer_3);

        var divContainer_5 = document.createElement("div");
        divContainer_5.classList.add("submitButtonContainer");

        var Button_5 = document.createElement("button");
        Button_5.innerText = "Clear all scheduled sends";
        Button_5.type = "submit";
        Button_5.classList.add("textButtonV1");
        Button_5.classList.add("green");

        Button_5.addEventListener("click", function () {
            TravianHelper.clearAllScheduledSends();
        });
        divContainer_5.appendChild(Button_5);
        options[0].appendChild(divContainer_5);


        var divContainer_4 = document.createElement("div");
        divContainer_4.classList.add("submitButtonContainer");

        var Button_4 = document.createElement("button");
        Button_4.innerText = "Get All Village Data";
        Button_4.type = "submit";
        Button_4.classList.add("textButtonV1");
        Button_4.classList.add("green");

        Button_4.addEventListener("click", function () {
            TravianHelper.getAllVillageData();
            window.location.href = window.location.origin + "/dorf2.php";
        });
        divContainer_4.appendChild(Button_4);
        options[0].appendChild(divContainer_4);


        var divContainer_6 = document.createElement("div");
        divContainer_6.classList.add("submitButtonContainer");

        var Button_6 = document.createElement("button");
        Button_6.innerText = "Play attack sound";
        Button_6.type = "submit";
        Button_6.classList.add("textButtonV1");
        Button_6.classList.add("green");

        Button_6.addEventListener("click", function () {
            TravianHelper.playAttackSound();
        });
        divContainer_6.appendChild(Button_6);
        options[0].appendChild(divContainer_6);

        var divContainer_7 = document.createElement("div");
        divContainer_7.classList.add("submitButtonContainer");


        var Button_7 = document.createElement("button");
        Button_7.innerText = "Play message sound";
        Button_7.type = "submit";
        Button_7.classList.add("textButtonV1");
        Button_7.classList.add("green");

        Button_7.addEventListener("click", function () {
            TravianHelper.playMessageSound();
        });
        divContainer_7.appendChild(Button_7);
        options[0].appendChild(divContainer_7);
    }

    // Function to pad zeros for single digits
    TravianHelper.padZero = function (num) {
        return (num < 10 ? '0' : '') + num;
    }

    TravianHelper.createFarmlistProfileTable = function (options, selectedIndex) {

        var tableContent = [];
        var main = document.getElementsByClassName("flProfile");

        if (main.length > 0)
            console.log("we already have one... " + main.length);

        var flTableMain = ((main.length == 0) ? (document.createElement("div")) : (main[0]));
        flTableMain.innerHTML = "";
        flTableMain.classList.add("flProfile");

        //Selector
        {
            const row = document.createElement("tr");

            const labelCell = document.createElement("td");
            const label = document.createElement("label");
            label.textContent = "Selected farmlist profile:";
            label.setAttribute("for", "epp");
            labelCell.appendChild(label);

            var selectElement = document.createElement("select");

            // Clear existing options
            selectElement.innerHTML = "";
            selectElement.setAttribute("id", "flProfileSelect");

            // Add options from the array
            TravianHelper.farmListProfiles.forEach(function (item, index) {
                var option = document.createElement("option");
                option.text = item.name;
                option.value = index; // Set the value to the index of the item
                selectElement.add(option);
            });

            selectElement.selectedIndex = selectedIndex;
            // Event listener for change in selection
            selectElement.addEventListener("change", function () {
                var selectedIndex = selectElement.value;
                TravianHelper.createFarmlistProfileTable(options, selectedIndex, tableContent);
            });

            row.appendChild(labelCell);
            row.appendChild(selectElement);
            flTableMain.appendChild(row);

            tableContent.push(row);
        }

        //Name input
        {
            const row = document.createElement("tr");

            const labelCell = document.createElement("td");
            const label = document.createElement("label");
            label.textContent = "Profile name:";
            label.setAttribute("for", "epp");
            labelCell.appendChild(label);

            const inputElement = document.createElement("input");
            inputElement.setAttribute("id", "profileNameInput");
            inputElement.type = "text";
            inputElement.maxLength = 15; // Maximum length of 15 characters

            // Set default text
            inputElement.value = TravianHelper.farmListProfiles[selectedIndex].name;

            row.appendChild(labelCell);
            row.appendChild(inputElement);
            flTableMain.appendChild(row);
            tableContent.push(row);
        }
        //Time intervals
        {
            const row = document.createElement("tr");

            const labelCell = document.createElement("td");
            const label = document.createElement("label");
            label.textContent = "Time Intervals:";
            label.setAttribute("for", "epp");
            labelCell.appendChild(label);

            const minInputCell = document.createElement("td");
            const minInput = document.createElement("input");
            minInput.setAttribute("type", "text");
            minInput.setAttribute("inputmode", "numeric");
            minInput.setAttribute("maxlength", "4");
            minInput.setAttribute("value", TravianHelper.farmListProfiles[selectedIndex].minTime);
            minInput.setAttribute("id", "flProfileMinTime");
            minInput.className = "text messageReport";
            minInput.style.width = "50px";
            minInputCell.appendChild(minInput);

            const maxInputCell = document.createElement("td");
            const maxInput = document.createElement("input");
            maxInput.setAttribute("type", "text");
            maxInput.setAttribute("inputmode", "numeric");
            maxInput.setAttribute("maxlength", "4");
            maxInput.setAttribute("value", TravianHelper.farmListProfiles[selectedIndex].maxTime);
            maxInput.setAttribute("id", "flProfileMaxTime");
            maxInput.className = "text messageReport";
            maxInput.style.width = "50px";
            maxInputCell.appendChild(maxInput);


            row.appendChild(labelCell);
            row.appendChild(minInputCell);
            row.appendChild(maxInputCell);
            flTableMain.appendChild(row);
            tableContent.push(row);
        }

        if (main.length == 0)
            options[0].appendChild(flTableMain);
        return tableContent;
    }

    TravianHelper.createSettingsTable = function (options) {
        const fields = [
            { label: "Confirm delay (ms)", min: "confirmMinDelay", max: "confirmMaxDelay", minMs: TravianHelper.confirmDelayMinMs, maxMs: TravianHelper.confirmDelayMaxMs },
            { label: "Next village delay (ms)", min: "nextVillageDelayMin", max: "nextVillageDelayMax", minMs: TravianHelper.nextVillageDelayMinMs, maxMs: TravianHelper.nextVillageDelayMaxMs },
            { label: "Village check cooldown (sec)", min: "villageCheckTimeMin", max: "villageCheckTimeMax", minMs: TravianHelper.villageCheckTimes.min, maxMs: TravianHelper.villageCheckTimes.max },
            { label: "Building check cooldown (sec)", min: "buildCheckTimesMin", max: "buildCheckTimesMax", minMs: TravianHelper.buildCheckTimes.min, maxMs: TravianHelper.buildCheckTimes.max },
            { label: "Quick attack check cooldown (sec)", min: "quickAttackCheckTimesMin", max: "quickAttackCheckTimesMax", minMs: TravianHelper.quickAttackCheckTimes.min, maxMs: TravianHelper.quickAttackCheckTimes.max }
        ];

        const table = document.createElement("table");
        table.className = "transparent set";
        table.setAttribute("cellpadding", "1");
        table.setAttribute("cellspacing", "1");
        table.setAttribute("id", "entriesPerPage");

        const tbody = document.createElement("tbody");

        fields.forEach(field => {
            const row = document.createElement("tr");

            const labelCell = document.createElement("td");
            const label = document.createElement("label");
            label.textContent = field.label;
            label.setAttribute("for", "epp");
            labelCell.appendChild(label);

            const minInputCell = document.createElement("td");
            const minInput = document.createElement("input");
            minInput.setAttribute("type", "text");
            minInput.setAttribute("inputmode", "numeric");
            minInput.setAttribute("maxlength", "4");
            minInput.setAttribute("value", field.minMs);
            minInput.setAttribute("id", field.min);
            minInput.setAttribute("name", field.min);
            minInput.className = "text messageReport";
            minInput.style.width = "50px";
            minInputCell.appendChild(minInput);

            const maxInputCell = document.createElement("td");
            const maxInput = document.createElement("input");
            maxInput.setAttribute("type", "text");
            maxInput.setAttribute("inputmode", "numeric");
            maxInput.setAttribute("maxlength", "4");
            maxInput.setAttribute("value", field.maxMs);
            maxInput.setAttribute("id", field.max);
            maxInput.setAttribute("name", field.max);
            maxInput.className = "text messageReport";
            maxInput.style.width = "50px";
            maxInputCell.appendChild(maxInput);

            row.appendChild(labelCell);
            row.appendChild(minInputCell);
            row.appendChild(maxInputCell);

            tbody.appendChild(row);

            // Check if this is the last field
            if (field === fields[fields.length - 1]) { 
                {
                const newRowID = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellID = document.createElement("td");
                const additionalLabelID = document.createElement("label");
                additionalLabelID.textContent = "Player ID";
                additionalLabelID.setAttribute("for", "helperPlayerId");
                additionalLabelCellID.appendChild(additionalLabelID);

                // Create input cell for the additional input field
                const additionalInputCellID = document.createElement("td");
                const additionalInputID = document.createElement("input");
                additionalInputID.setAttribute("type", "text");
                additionalInputID.setAttribute("inputmode", "numeric");
                additionalInputID.setAttribute("maxlength", "5");
                additionalInputID.setAttribute("value", TravianHelper.playerId); // Set default value
                additionalInputID.setAttribute("id", "helperPlayerId");
                additionalInputID.setAttribute("name", "helperPlayerId");
                additionalInputID.className = "text messageReport";
                additionalInputID.style.width = "50px";
                additionalInputCellID.appendChild(additionalInputID);

                newRowID.appendChild(additionalLabelCellID);
                newRowID.appendChild(additionalInputCellID);

                tbody.appendChild(newRowID);
                }

                // Create a new row for the additional input field
                const newRowMSG = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellMSG = document.createElement("td");
                const additionalLabelMSG = document.createElement("label");
                additionalLabelMSG.textContent = "Play message notification";
                additionalLabelMSG.setAttribute("for", "enableMessageNotification");
                additionalLabelCellMSG.appendChild(additionalLabelMSG);

                // Create input cell for the additional input field
                const msgCheckboxCell = document.createElement("td");
                const msgCheckbox = document.createElement("input");
                msgCheckbox.setAttribute("type", "checkbox");
                msgCheckbox.checked = TravianHelper.enableMessageNotification;
                msgCheckbox.setAttribute("id", "enableMessageNotification");
                msgCheckbox.setAttribute("name", "enableMessageNotification");
                msgCheckbox.className = "check";
                msgCheckboxCell.appendChild(msgCheckbox);

                newRowMSG.appendChild(additionalLabelCellMSG);
                newRowMSG.appendChild(msgCheckboxCell);

                tbody.appendChild(newRowMSG);



                // Create a new row for the additional input field
                const newRowA = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellA = document.createElement("td");
                const additionalLabelA = document.createElement("label");
                additionalLabelA.textContent = "Do quick attack checks";
                additionalLabelA.setAttribute("for", "quickAttackCheck");
                additionalLabelCellA.appendChild(additionalLabelA);

                // Create input cell for the additional input field
                const qaCheckboxCell = document.createElement("td");
                const qaCheckbox = document.createElement("input");
                qaCheckbox.setAttribute("type", "checkbox");
                qaCheckbox.checked = TravianHelper.quickAttackCheckEnabled;
                qaCheckbox.setAttribute("id", "quickAttackCheck");
                qaCheckbox.setAttribute("name", "quickAttackCheck");
                qaCheckbox.className = "check";
                qaCheckboxCell.appendChild(qaCheckbox);

                newRowA.appendChild(additionalLabelCellA);
                newRowA.appendChild(qaCheckboxCell);

                tbody.appendChild(newRowA);

                // Create a new row for the additional input field
                const newRowB = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellB = document.createElement("td");
                const additionalLabelB = document.createElement("label");
                additionalLabelB.textContent = "Do village checks";
                additionalLabelB.setAttribute("for", "doVillageCheck");
                additionalLabelCellB.appendChild(additionalLabelB);

                // Create input cell for the additional input field
                const dvcCheckboxCell = document.createElement("td");
                const dvcCheckbox = document.createElement("input");
                dvcCheckbox.setAttribute("type", "checkbox");
                dvcCheckbox.checked = TravianHelper.doVillageCheck;
                dvcCheckbox.setAttribute("id", "doVillageCheck");
                dvcCheckbox.setAttribute("name", "doVillageCheck");
                dvcCheckbox.className = "check";
                dvcCheckboxCell.appendChild(dvcCheckbox);

                newRowB.appendChild(additionalLabelCellB);
                newRowB.appendChild(dvcCheckboxCell);

                tbody.appendChild(newRowB);

                // Create a new row for the additional input field
                const newRowBFL = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellBFL = document.createElement("td");
                const additionalLabelBFL = document.createElement("label");
                additionalLabelBFL.textContent = "Do village checks without farming";
                additionalLabelBFL.setAttribute("for", "doVillageChecksWithoutFarming");
                additionalLabelCellBFL.appendChild(additionalLabelBFL);
                
                // Create input cell for the additional input field
                const dvcflCheckboxCell = document.createElement("td");
                const dvcflCheckbox = document.createElement("input");
                dvcflCheckbox.setAttribute("type", "checkbox");
                dvcflCheckbox.checked = TravianHelper.doVillageChecksWithoutFarming;
                dvcflCheckbox.setAttribute("id", "doVillageChecksWithoutFarming");
                dvcflCheckbox.setAttribute("name", "doVillageChecksWithoutFarming");
                dvcflCheckbox.className = "check";
                dvcflCheckboxCell.appendChild(dvcflCheckbox);
                
                newRowBFL.appendChild(additionalLabelCellBFL);
                newRowBFL.appendChild(dvcflCheckboxCell);
                
                tbody.appendChild(newRowBFL);

                // Create a new row for the additional input field
                const newRowC = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellC = document.createElement("td");
                const additionalLabelC = document.createElement("label");
                additionalLabelC.textContent = "Quick village check";
                additionalLabelC.setAttribute("for", "quickVillageCheck");
                additionalLabelCellC.appendChild(additionalLabelC);

                // Create input cell for the additional input field
                const qvcCheckboxCell = document.createElement("td");
                const qvcCheckbox = document.createElement("input");
                qvcCheckbox.setAttribute("type", "checkbox");
                qvcCheckbox.checked = TravianHelper.quickVillageCheck;
                qvcCheckbox.setAttribute("id", "quickVillageCheck");
                qvcCheckbox.setAttribute("name", "quickVillageCheck");
                qvcCheckbox.className = "check";
                qvcCheckboxCell.appendChild(qvcCheckbox);

                newRowC.appendChild(additionalLabelCellC);
                newRowC.appendChild(qvcCheckboxCell);

                tbody.appendChild(newRowC);


                // Create a new row for the additional input field
                const newRow = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell = document.createElement("td");
                const additionalLabel = document.createElement("label");
                additionalLabel.textContent = "Wheat Warning cooldown (sec)";
                additionalLabel.setAttribute("for", "wheatWarningCooldown");
                additionalLabelCell.appendChild(additionalLabel);

                // Create input cell for the additional input field
                const additionalInputCell = document.createElement("td");
                const additionalInput = document.createElement("input");
                additionalInput.setAttribute("type", "text");
                additionalInput.setAttribute("inputmode", "numeric");
                additionalInput.setAttribute("maxlength", "4");
                additionalInput.setAttribute("value", TravianHelper.wheatWarningSeconds); // Set default value
                additionalInput.setAttribute("id", "wheatWarningCooldown");
                additionalInput.setAttribute("name", "wheatWarningCooldown");
                additionalInput.className = "text messageReport";
                additionalInput.style.width = "50px";
                additionalInputCell.appendChild(additionalInput);

                newRow.appendChild(additionalLabelCell);
                newRow.appendChild(additionalInputCell);

                tbody.appendChild(newRow);

                const newRow2 = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell2 = document.createElement("td");
                const additionalLabel2 = document.createElement("label");
                additionalLabel2.textContent = "Warehouse and Granary check percent";
                additionalLabel2.setAttribute("for", "warehouseWarnerPercent");
                additionalLabelCell2.appendChild(additionalLabel2);

                // Create input cell for the additional input field
                const additionalInputCell2 = document.createElement("td");
                const additionalInput2 = document.createElement("input");
                additionalInput2.setAttribute("type", "text");
                additionalInput2.setAttribute("inputmode", "numeric");
                additionalInput2.setAttribute("maxlength", "2");
                additionalInput2.setAttribute("value", TravianHelper.fullnessWarningPercent); // Set default value
                additionalInput2.setAttribute("id", "warehouseWarnerPercent");
                additionalInput2.setAttribute("name", "warehouseWarnerPercent");
                additionalInput2.className = "text messageReport";
                additionalInput2.style.width = "50px";
                additionalInputCell2.appendChild(additionalInput2);

                newRow2.appendChild(additionalLabelCell2);
                newRow2.appendChild(additionalInputCell2);

                tbody.appendChild(newRow2);

                const newRow3 = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell3 = document.createElement("td");
                const additionalLabel3 = document.createElement("label");
                additionalLabel3.textContent = "Warehouse fullness check";
                additionalLabel3.setAttribute("for", "warehouseFullnessCheck");
                additionalLabelCell3.appendChild(additionalLabel3);

                // Create input cell for the additional input field
                const whCheckboxCell = document.createElement("td");
                const whCheckbox = document.createElement("input");
                whCheckbox.setAttribute("type", "checkbox");
                whCheckbox.checked = TravianHelper.warehouseFullWarning;
                whCheckbox.setAttribute("id", "warehouseFullnessCheck");
                whCheckbox.setAttribute("name", "warehouseFullnessCheck");
                whCheckbox.className = "check";
                whCheckboxCell.appendChild(whCheckbox);

                newRow3.appendChild(additionalLabelCell3);
                newRow3.appendChild(whCheckboxCell);

                tbody.appendChild(newRow3);

                const newRow4 = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell4 = document.createElement("td");
                const additionalLabel4 = document.createElement("label");
                additionalLabel4.textContent = "Granary fullness check";
                additionalLabel4.setAttribute("for", "granaryFullnessCheck");
                additionalLabelCell4.appendChild(additionalLabel4);

                // Create input cell for the additional input field
                const gCheckboxCell = document.createElement("td");
                const gCheckbox = document.createElement("input");
                gCheckbox.setAttribute("type", "checkbox");
                gCheckbox.checked = TravianHelper.granaryFullWarning;
                gCheckbox.setAttribute("id", "granaryFullnessCheck");
                gCheckbox.setAttribute("name", "granaryFullnessCheck");
                gCheckbox.className = "check";
                gCheckboxCell.appendChild(gCheckbox);

                newRow4.appendChild(additionalLabelCell4);
                newRow4.appendChild(gCheckboxCell);

                tbody.appendChild(newRow4);

                const newRow5 = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell5 = document.createElement("td");
                const additionalLabel5 = document.createElement("label");
                additionalLabel5.textContent = "Gold club";
                additionalLabel5.setAttribute("for", "goldClubCheck");
                additionalLabelCell5.appendChild(additionalLabel5);

                // Create input cell for the additional input field
                const gcCell = document.createElement("td");
                const gcCheckbox = document.createElement("input");
                gcCheckbox.setAttribute("type", "checkbox");
                gcCheckbox.checked = TravianHelper.goldClub;
                gcCheckbox.setAttribute("id", "goldClubCheck");
                gcCheckbox.setAttribute("name", "goldClubCheck");
                gcCheckbox.className = "check";
                gcCell.appendChild(gcCheckbox);

                newRow5.appendChild(additionalLabelCell5);
                newRow5.appendChild(gcCell);

                tbody.appendChild(newRow5);

                const newRow5b = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell5b = document.createElement("td");
                const additionalLabel5b = document.createElement("label");
                additionalLabel5b.textContent = "Enable auto-adventure";
                additionalLabel5b.setAttribute("for", "autoAdventureEnabled");
                additionalLabelCell5b.appendChild(additionalLabel5b);

                // Create input cell for the additional input field
                const aaCell = document.createElement("td");
                const aaCheckbox = document.createElement("input");
                aaCheckbox.setAttribute("type", "checkbox");
                aaCheckbox.checked = TravianHelper.autoAdventureEnabled;
                aaCheckbox.setAttribute("id", "autoAdventureEnabled");
                aaCheckbox.setAttribute("name", "autoAdventureEnabled");
                aaCheckbox.className = "check";
                aaCell.appendChild(aaCheckbox);

                newRow5b.appendChild(additionalLabelCell5b);
                newRow5b.appendChild(aaCell);

                tbody.appendChild(newRow5b);

                // Create a new row for the additional input field
                const newRowAAM = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellAAM = document.createElement("td");
                const additionalLabelAAM = document.createElement("label");
                additionalLabelAAM.textContent = "Auto adventure max time (sec)";
                additionalLabelAAM.setAttribute("for", "autoAdventureMaxTime");
                additionalLabelCellAAM.appendChild(additionalLabelAAM);

                // Create input cell for the additional input field
                const additionalInputCellAAM = document.createElement("td");
                const additionalInputAAM = document.createElement("input");
                additionalInputAAM.setAttribute("type", "text");
                additionalInputAAM.setAttribute("inputmode", "numeric");
                additionalInputAAM.setAttribute("maxlength", "4");
                additionalInputAAM.setAttribute("value", TravianHelper.autoAdventureMaxTime); // Set default value
                additionalInputAAM.setAttribute("id", "autoAdventureMaxTime");
                additionalInputAAM.setAttribute("name", "autoAdventureMaxTime");
                additionalInputAAM.className = "text messageReport";
                additionalInputAAM.style.width = "50px";
                additionalInputCellAAM.appendChild(additionalInputAAM);

                newRowAAM.appendChild(additionalLabelCellAAM);
                newRowAAM.appendChild(additionalInputCellAAM);

                tbody.appendChild(newRowAAM);


                const newRowSafe = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellSafe = document.createElement("td");
                const additionalLabelSafe = document.createElement("label");
                additionalLabelSafe.textContent = "Safer Resource get";
                additionalLabelSafe.setAttribute("for", "heroSaferResourceGet");
                additionalLabelCellSafe.appendChild(additionalLabelSafe);

                // Create input cell for the additional input field
                const safeCell = document.createElement("td");
                const safeCheckbox = document.createElement("input");
                safeCheckbox.setAttribute("type", "checkbox");
                safeCheckbox.checked = TravianHelper.heroSaferResourceGet;
                safeCheckbox.setAttribute("id", "heroSaferResourceGet");
                safeCheckbox.setAttribute("name", "heroSaferResourceGet");
                safeCheckbox.className = "check";
                safeCell.appendChild(safeCheckbox);

                newRowSafe.appendChild(additionalLabelCellSafe);
                newRowSafe.appendChild(safeCell);

                tbody.appendChild(newRowSafe);




                const newRow8 = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell8 = document.createElement("td");
                const additionalLabel8 = document.createElement("label");
                additionalLabel8.textContent = "Enable hero resources for autobuild";
                additionalLabel8.setAttribute("for", "autoBuildHeroResources");
                additionalLabelCell8.appendChild(additionalLabel8);

                // Create input cell for the additional input field
                const hrCell = document.createElement("td");
                const hrCheckbox = document.createElement("input");
                hrCheckbox.setAttribute("type", "checkbox");
                hrCheckbox.checked = TravianHelper.autoBuildUseHeroResources;
                hrCheckbox.setAttribute("id", "autoBuildHeroResources");
                hrCheckbox.setAttribute("name", "autoBuildHeroResources");
                hrCheckbox.className = "check";
                hrCell.appendChild(hrCheckbox);

                newRow8.appendChild(additionalLabelCell8);
                newRow8.appendChild(hrCell);

                tbody.appendChild(newRow8);

                const newRow8b = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell8b = document.createElement("td");
                const additionalLabel8b = document.createElement("label");
                additionalLabel8b.textContent = "Enable hero resources for autotrain";
                additionalLabel8b.setAttribute("for", "autoTrainHeroResources");
                additionalLabelCell8b.appendChild(additionalLabel8b);

                // Create input cell for the additional input field
                const hr2Cell = document.createElement("td");
                const hr2Checkbox = document.createElement("input");
                hr2Checkbox.setAttribute("type", "checkbox");
                hr2Checkbox.checked = TravianHelper.autoTrainUseHeroResources;
                hr2Checkbox.setAttribute("id", "autoTrainHeroResources");
                hr2Checkbox.setAttribute("name", "autoTrainHeroResources");
                hr2Checkbox.className = "check";
                hr2Cell.appendChild(hr2Checkbox);

                newRow8b.appendChild(additionalLabelCell8b);
                newRow8b.appendChild(hr2Cell);

                tbody.appendChild(newRow8b);

                const newRow7 = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell7 = document.createElement("td");
                const additionalLabel7 = document.createElement("label");
                additionalLabel7.textContent = "Farm check frequency";
                additionalLabel7.setAttribute("for", "farmCheckNeeded");
                additionalLabelCell7.appendChild(additionalLabel7);

                // Create input cell for the additional input field
                const additionalInputCell7 = document.createElement("td");
                const additionalInput7 = document.createElement("input");
                additionalInput7.setAttribute("type", "text");
                additionalInput7.setAttribute("inputmode", "numeric");
                additionalInput7.setAttribute("maxlength", "2");
                additionalInput7.setAttribute("value", TravianHelper.farmCheckNeeded); // Set default value
                additionalInput7.setAttribute("id", "farmCheckNeeded");
                additionalInput7.setAttribute("name", "farmCheckNeeded");
                additionalInput7.className = "text messageReport";
                additionalInput7.style.width = "50px";
                additionalInputCell7.appendChild(additionalInput7);

                newRow7.appendChild(additionalLabelCell7);
                newRow7.appendChild(additionalInputCell7);

                tbody.appendChild(newRow7);

                const newRowFC = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCellFC = document.createElement("td");
                const additionalLabelFC = document.createElement("label");
                additionalLabelFC.textContent = "Farm check before sending";
                additionalLabelFC.setAttribute("for", "farmCheckBefore");
                additionalLabelCellFC.appendChild(additionalLabelFC);

                // Create input cell for the additional input field
                const fcCell = document.createElement("td");
                const fcCheckbox = document.createElement("input");
                fcCheckbox.setAttribute("type", "checkbox");
                fcCheckbox.checked = TravianHelper.farmCheckBeforeSending;
                fcCheckbox.setAttribute("id", "farmCheckBefore");
                fcCheckbox.setAttribute("name", "farmCheckBefore");
                fcCheckbox.className = "check";
                fcCell.appendChild(fcCheckbox);

                newRowFC.appendChild(additionalLabelCellFC);
                newRowFC.appendChild(fcCell);

                tbody.appendChild(newRowFC);

                const newRow6 = document.createElement("tr");
                // Create label cell for the additional input field
                const additionalLabelCell6 = document.createElement("td");
                const additionalLabel6 = document.createElement("label");
                additionalLabel6.textContent = "Reactivate disabled farms";
                additionalLabel6.setAttribute("for", "enableReactivatingCheck");
                additionalLabelCell6.appendChild(additionalLabel6);

                                                // Create input cell for the additional input field
                const reCell = document.createElement("td");
                const reCheckbox = document.createElement("input");
                reCheckbox.setAttribute("type", "checkbox");
                reCheckbox.checked = TravianHelper.enableReactivating;
                reCheckbox.setAttribute("id", "enableReactivatingCheck");
                reCheckbox.setAttribute("name", "enableReactivatingCheck");
                reCheckbox.className = "check";
                reCell.appendChild(reCheckbox);

                newRow6.appendChild(additionalLabelCell6);
                newRow6.appendChild(reCell);

                tbody.appendChild(newRow6);

                const newRow9 = document.createElement("tr");

                // Create label cell for the additional input field
                const additionalLabelCell9 = document.createElement("td");
                const additionalLabel9 = document.createElement("label");
                additionalLabel9.textContent = "Auction reminder (seconds)";
                additionalLabel9.setAttribute("for", "auctionReminder");
                additionalLabelCell9.appendChild(additionalLabel9);

                // Create input cell for the additional input field
                const additionalInputCell9 = document.createElement("td");
                const additionalInput9 = document.createElement("input");
                additionalInput9.setAttribute("type", "text");
                additionalInput9.setAttribute("inputmode", "numeric");
                additionalInput9.setAttribute("maxlength", "4");
                additionalInput9.setAttribute("value", TravianHelper.auctionReminderSeconds); // Set default value
                additionalInput9.setAttribute("id", "auctionReminder");
                additionalInput9.setAttribute("name", "auctionReminder");
                additionalInput9.className = "text messageReport";
                additionalInput9.style.width = "50px";
                additionalInputCell9.appendChild(additionalInput9);

                newRow9.appendChild(additionalLabelCell9);
                newRow9.appendChild(additionalInputCell9);

                tbody.appendChild(newRow9);

                const newRow10 = document.createElement("tr");
                // Create label cell for the additional input field
                const additionalLabelCell10 = document.createElement("td");
                const additionalLabel10 = document.createElement("label");
                additionalLabel10.textContent = "Auction colored background";
                additionalLabel10.setAttribute("for", "auctionItemBackground");
                additionalLabelCell10.appendChild(additionalLabel10);

                                                // Create input cell for the additional input field
                const ibgCell = document.createElement("td");
                const ibgCheckbox = document.createElement("input");
                ibgCheckbox.setAttribute("type", "checkbox");
                ibgCheckbox.checked = TravianHelper.auctionItemBackground;
                ibgCheckbox.setAttribute("id", "auctionItemBackground");
                ibgCheckbox.setAttribute("name", "auctionItemBackground");
                ibgCheckbox.className = "check";
                ibgCell.appendChild(ibgCheckbox);

                newRow10.appendChild(additionalLabelCell10);
                newRow10.appendChild(ibgCell);

                tbody.appendChild(newRow10);

                const newRow11 = document.createElement("tr");
                // Create label cell for the additional input field
                const additionalLabelCell11 = document.createElement("td");
                const additionalLabel11 = document.createElement("label");
                additionalLabel11.textContent = "Auction - Show seller ID";
                additionalLabel11.setAttribute("for", "auctionShowSellerId");
                additionalLabelCell11.appendChild(additionalLabel11);

                                                // Create input cell for the additional input field
                const isidCell = document.createElement("td");
                const isidCheckbox = document.createElement("input");
                isidCheckbox.setAttribute("type", "checkbox");
                isidCheckbox.checked = TravianHelper.auctionShowSellerId;
                isidCheckbox.setAttribute("id", "auctionShowSellerId");
                isidCheckbox.setAttribute("name", "auctionShowSellerId");
                isidCheckbox.className = "check";
                isidCell.appendChild(isidCheckbox);

                newRow11.appendChild(additionalLabelCell11);
                newRow11.appendChild(isidCell);

                tbody.appendChild(newRow11);



                
                const newRow12 = document.createElement("tr");
                // Create label cell for the additional input field
                const additionalLabelCell12 = document.createElement("td");
                const additionalLabel12 = document.createElement("label");
                additionalLabel12.textContent = "Clear attacker troops in Combat Simulator";
                additionalLabel12.setAttribute("for", "autoUnfillBattleSimulator");
                additionalLabelCell12.appendChild(additionalLabel12);

                                                // Create input cell for the additional input field
                const clearCell = document.createElement("td");
                const clearCheckbox = document.createElement("input");
                clearCheckbox.setAttribute("type", "checkbox");
                clearCheckbox.checked = TravianHelper.autoUnfillBattleSimulator;
                clearCheckbox.setAttribute("id", "autoUnfillBattleSimulator");
                clearCheckbox.setAttribute("name", "autoUnfillBattleSimulator");
                clearCheckbox.className = "check";
                clearCell.appendChild(clearCheckbox);

                newRow12.appendChild(additionalLabelCell12);
                newRow12.appendChild(clearCell);

                tbody.appendChild(newRow12);

            }
        });

        table.appendChild(tbody);
        options[0].appendChild(table);
    }

    TravianHelper.createTimeTable = function (options) {
        const table = document.createElement("table");
        table.className = "transparent set";
        table.setAttribute("cellpadding", "1");
        table.setAttribute("cellspacing", "1");
        table.setAttribute("id", "entriesPerPage");

        const tbody = document.createElement("tbody");

        const fields = [
            { label: "Farmlist end time:", id: "farmListDate" },
            { label: "Hours:", id: "farmListHour" },
            { label: "Mins:", id: "farmListMin" },
            { label: "Seconds:", id: "farmListSec" }
        ];

        fields.forEach(field => {
            const row = document.createElement("tr");

            const labelCell = document.createElement("td");
            const label = document.createElement("label");
            label.textContent = field.label;

            if (field.id === "farmListDate") {
                const date = new Date(TravianHelper.farmSendingEndTime);
                const formattedDate = `${date.getFullYear()}.${TravianHelper.padZero(date.getMonth() + 1)}.${TravianHelper.padZero(date.getDate())}. ${TravianHelper.padZero(date.getHours())}:${TravianHelper.padZero(date.getMinutes())}:${TravianHelper.padZero(date.getSeconds())}`;
                label.textContent += " " + formattedDate;
            }

            label.setAttribute("for", "epp");
            labelCell.appendChild(label);
            row.appendChild(labelCell);

            if (field.id !== "farmListDate") {
                const inputCell = document.createElement("td");
                const input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("inputmode", "numeric");
                input.setAttribute("maxlength", "2");
                input.setAttribute("id", field.id);
                input.setAttribute("name", field.id);
                input.className = "text messageReport";
                input.style.width = "50px";
                inputCell.appendChild(input);
                row.appendChild(inputCell);
            }
            else {
                label.setAttribute("id", field.id);
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        options[0].appendChild(table);
    }

    TravianHelper.createStopSoundTimeTable = function (options) {
        const table = document.createElement("table");
        table.className = "transparent set";
        table.setAttribute("cellpadding", "1");
        table.setAttribute("cellspacing", "1");
        table.setAttribute("id", "entriesPerPage");

        const tbody = document.createElement("tbody");

        const fields = [
            { label: "Not playing sound until:", id: "stopSoundDate" },
            { label: "Hours:", id: "stopSoundHour" },
            { label: "Mins:", id: "stopSoundMin" },
            { label: "Seconds:", id: "stopSoundSecond" }
        ];

        fields.forEach(field => {
            const row = document.createElement("tr");

            const labelCell = document.createElement("td");
            const label = document.createElement("label");
            label.textContent = field.label;

            if (field.id === "stopSoundDate") {
                const date = new Date(TravianHelper.stopSoundUntil);
                const formattedDate = `${date.getFullYear()}.${TravianHelper.padZero(date.getMonth() + 1)}.${TravianHelper.padZero(date.getDate())}. ${TravianHelper.padZero(date.getHours())}:${TravianHelper.padZero(date.getMinutes())}:${TravianHelper.padZero(date.getSeconds())}`;
                label.textContent += " " + formattedDate;
            }

            label.setAttribute("for", "epp");
            labelCell.appendChild(label);
            row.appendChild(labelCell);

            if (field.id !== "stopSoundDate") {
                const inputCell = document.createElement("td");
                const input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("inputmode", "numeric");
                input.setAttribute("maxlength", "2");
                input.setAttribute("id", field.id);
                input.setAttribute("name", field.id);
                input.className = "text messageReport";
                input.style.width = "50px";
                inputCell.appendChild(input);
                row.appendChild(inputCell);
            }
            else {
                label.setAttribute("id", field.id);
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        options[0].appendChild(table);
    }

    calculateLoot = function () {
        var bounty = document.getElementsByClassName("averageRaidBounty")
        var total = 0;

        for (var i = 0; i < bounty.length; i++) {
            var asd = bounty[i].children[1].innerHTML
            var asd2 = asd.slice(1, asd.length - 1);
            var asd3 = asd2.replace(".", "");

            total += Number(asd3);
        }

        console.log(total);
    }

    calculateAuctionTime = function(targetTime){
        // Get the current Unix timestamp (in seconds, not milliseconds)
        const currentTime = Math.floor(Date.now() / 1000);

        // Calculate the difference in seconds
        const timeLeftInSeconds = targetTime - currentTime;

        // Convert to hours, minutes, and seconds
        const hours = Math.floor(timeLeftInSeconds / 3600);
        const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
        const seconds = timeLeftInSeconds % 60;

        console.log(`Time left: ${hours} hours, ${minutes} minutes, and ${seconds} seconds`);
    }

    TravianHelper.secondsSinceServerDayStart = function(serverTimestamp, serverTimezoneOffsetHours) {
        // Convert the server timestamp to a Date object in the local timezone
        let serverDate = new Date(serverTimestamp * 1000);  // Convert seconds to milliseconds
    
        // Adjust the server date to match the server's timezone by subtracting the offset
        let localOffsetMinutes = serverDate.getTimezoneOffset();  // Local timezone offset in minutes
        let serverOffsetMinutes = serverTimezoneOffsetHours * 60;  // Server timezone offset in minutes
    
        // Create a Date object representing the start of the server's day (midnight in server timezone)
        let startOfServerDay = new Date(
            serverDate.getFullYear(),
            serverDate.getMonth(),
            serverDate.getDate()
        );
    
        // Adjust the server's midnight to account for the timezone difference
        startOfServerDay.setMinutes(startOfServerDay.getMinutes() + localOffsetMinutes - serverOffsetMinutes);
    
        // Calculate the difference in seconds between the server time and the start of the server's day
        let secondsPassed = Math.floor((serverDate - startOfServerDay) / 1000);  // Difference in seconds
    
        return secondsPassed;
    }

    TravianHelper.checkFarmEfficiency = function(indexes, lootCapacity, minEfficiency, lessenEfficiency, maxEfficiency) {
        let farmWrappers = document.getElementsByClassName("farmListWrapper");


        let stime = document.getElementsByClassName("stime");
        let timer = stime[0].getElementsByClassName("timer");
        let timeValue = timer[0].getAttribute("value");

        let todaysSeconds = TravianHelper.secondsSinceServerDayStart(timeValue, -3);

        let averageSendTime = (Number(TravianHelper.farmListProfiles[0].minTime) + Number(TravianHelper.farmListProfiles[0].maxTime)) / 2;
        let expectedSendouts = todaysSeconds / averageSendTime;

        console.log("Average sendouts so far:" + expectedSendouts);

        for(let i = 0; i < indexes.length; i++)
        {
            let index = indexes[i];

            let slots = farmWrappers[index].getElementsByClassName("slot");
            console.log(slots);


            for(let j = 0; j < slots.length; j++) {

                if(slots[j].classList.contains("disabled"))
                    continue;

                let units = slots[j].getElementsByClassName("unit_small");

                let capacity = 0;
                let troopCount = 0;
                for(let k = 0; k < units.length; k++)
                {
                    let index = Number(units[k].classList[2].substring(1)) - 1;
                    let amount = Number(units[k].parentElement.children[1].innerHTML);
                    troopCount += amount;
                    capacity += lootCapacity[index] * amount;
                }


                let bounty = slots[j].getElementsByClassName("averageRaidBounty");
                let asd = bounty[i].children[1].innerHTML
                let asd2 = asd.slice(1, asd.length - 1);
                let asd3 = asd2.replace(".", "");

                let maxExpected = capacity * expectedSendouts;
                let efficiency = Number(asd3) / maxExpected;

                let target = slots[j].getElementsByClassName("target");

                let name = target[0].children[0].children[0].innerHTML;

                let slotString = "[" + index + ":" + j + "] ";
                if(efficiency < lessenEfficiency && troopCount > 1)
                {
                    console.log("%c" + slotString + name + " might need less (Efficiency: " + (100*efficiency).toFixed(2) + "%)", "color:orange");
                }
                if(efficiency < minEfficiency)
                {
                    console.log("%c" + slotString + name + " might better be deleted (Efficiency: " + (100*efficiency).toFixed(2) + "%)", "color:red");
                }
                else if (efficiency > maxEfficiency)
                {
                    console.log("%c" + slotString + name + " might need more (Efficiency: " + (100*efficiency).toFixed(2) + "%)", "color:green");
                }
            }
        }
    }

    calculateTroops = function (fListIndexes, speeds, tournamentSquare) {
        var minCounts = [0, 0, 0, 0, 0, 0];
        var maxCounts = [0, 0, 0, 0, 0, 0];
        var avgCounts = [0, 0, 0, 0, 0, 0];


        for (let k = 0; k < fListIndexes.length; k++) {
            var totalUnitHours = [0, 0, 0, 0, 0, 0];
            var fListIndex = fListIndexes[k];

            var fV2 = document.getElementsByClassName("slotsWrapper formV2");
            var headers = document.getElementsByClassName("farmListHeader");


            let listName = headers[fListIndex].children[1].children[0].innerHTML;

            var profileIndex = TravianHelper.getProfileForFarmList(listName);

            var children = fV2[fListIndex].children[0].children[1].children;


            for (let i = 0; i < children.length - 1; i++) {
                if (children[i].classList.contains("disabled"))
                    continue;

                var dist = Number(children[i].children[4].innerText);
                if (dist > 20 && tournamentSquare > 0) {
                    var dist20 = dist - 20;
                    dist20 /= (1 + 0.2 * tournamentSquare);
                    dist = 20 + dist20;
                }


                var t1 = false;
                var t2 = false;
                var t3 = false;
                var t4 = false;
                var t5 = false;
                var t6 = false;

                var unit1 = 0;
                var unit2 = 0;
                var unit3 = 0;
                var unit4 = 0;
                var unit5 = 0;
                var unit6 = 0;


                for (let j = 0; j < children[i].children[5].children[0].children.length; j++) {
                    if (children[i].children[5].children[0].children[j].children[0].classList.contains("t1")) {
                        t1 = t1 || children[i].children[5].children[0].children[j].children[0].classList.contains("t1");
                        unit1 = children[i].children[5].children[0].children[j].children[1].innerText;
                    }
                    if (children[i].children[5].children[0].children[j].children[0].classList.contains("t2")) {
                        t2 = t2 || children[i].children[5].children[0].children[j].children[0].classList.contains("t2");
                        unit2 = children[i].children[5].children[0].children[j].children[1].innerText;
                    }
                    if (children[i].children[5].children[0].children[j].children[0].classList.contains("t3")) {
                        t3 = t3 || children[i].children[5].children[0].children[j].children[0].classList.contains("t3");
                        unit3 = children[i].children[5].children[0].children[j].children[1].innerText;
                    }
                    if (children[i].children[5].children[0].children[j].children[0].classList.contains("t4")) {
                        t4 = t4 || children[i].children[5].children[0].children[j].children[0].classList.contains("t4");
                        unit4 = children[i].children[5].children[0].children[j].children[1].innerText;
                    }
                    if (children[i].children[5].children[0].children[j].children[0].classList.contains("t5")) {
                        t5 = t5 || children[i].children[5].children[0].children[j].children[0].classList.contains("t5");
                        unit5 = children[i].children[5].children[0].children[j].children[1].innerText;
                    }
                    if (children[i].children[5].children[0].children[j].children[0].classList.contains("t6")) {
                        t6 = t6 || children[i].children[5].children[0].children[j].children[0].classList.contains("t6");
                        unit6 = children[i].children[5].children[0].children[j].children[1].innerText;
                    }
                }

                var speed = -1;
                if (t1) {
                    if (speed == -1 || speeds[0] < speed)
                        speed = speeds[0];
                }
                if (t2) {
                    if (speed == -1 || speeds[1] < speed)
                        speed = speeds[1];
                }
                if (t3) {
                    if (speed == -1 || speeds[2] < speed)
                        speed = speeds[2];
                }
                if (t4) {
                    if (speed == -1 || speeds[3] < speed)
                        speed = speeds[3];
                }
                if (t5) {
                    if (speed == -1 || speeds[4] < speed)
                        speed = speeds[4];
                }
                if (t6) {
                    if (speed == -1 || speeds[5] < speed)
                        speed = speeds[5];
                }

                var totalWayHours = 2 * dist / speed;

                var sendsMin = Math.ceil(totalWayHours / (TravianHelper.farmListProfiles[profileIndex].minTime / 3600));
                var sendsMax = Math.ceil(totalWayHours / (TravianHelper.farmListProfiles[profileIndex].maxTime / 3600));

                if(totalWayHours * 3600 < TravianHelper.farmListProfiles[profileIndex].minTime)
                    totalWayHours = TravianHelper.farmListProfiles[profileIndex].minTime / 3600;

                minCounts[0] += sendsMax * unit1;
                minCounts[1] += sendsMax * unit2;
                minCounts[2] += sendsMax * unit3;
                minCounts[3] += sendsMax * unit4;
                minCounts[4] += sendsMax * unit5;
                minCounts[5] += sendsMax * unit6;

                maxCounts[0] += sendsMin * unit1;
                maxCounts[1] += sendsMin * unit2;
                maxCounts[2] += sendsMin * unit3;
                maxCounts[3] += sendsMin * unit4;
                maxCounts[4] += sendsMin * unit5;
                maxCounts[5] += sendsMin * unit6;

            }
        }

        for (let i = 0; i < 6; i++) {
            console.log("Unit " + (i + 1) + ": " + minCounts[i] + " - " + maxCounts[i]);
            console.log("%c Unit " + (i + 1) + " (average) : " + ((minCounts[i] + maxCounts[i])/2), "color:orange");
        }


    }

    TravianHelper.checkHeroResources = async function() {

        while(document.getElementsByClassName("heroItem consumable inventory").length == 0)
            await TravianHelper.wait(100);

        var heroCons = document.getElementsByClassName("heroItem consumable inventory");

                var hWood = 0;
                var hClay = 0;
                var hIron = 0;
                var hWheat = 0;

                for (var i = 0; i < heroCons.length; i++) {
                    if (heroCons[i].children[1].classList.contains("item145")) {
                        hWood = Number(heroCons[i].children[2].innerHTML);
                    }
                    else if (heroCons[i].children[1].classList.contains("item146")) {
                        hClay = Number(heroCons[i].children[2].innerHTML);
                    }
                    else if (heroCons[i].children[1].classList.contains("item147")) {
                        hIron = Number(heroCons[i].children[2].innerHTML);
                    }
                    else if (heroCons[i].children[1].classList.contains("item148")) {
                        hWheat = Number(heroCons[i].children[2].innerHTML);
                    }
                }

                TravianHelper.heroResources.wood = hWood;
                TravianHelper.heroResources.clay = hClay;
                TravianHelper.heroResources.iron = hIron;
                TravianHelper.heroResources.wheat = hWheat;
                TravianHelper.setStorage();
    }

    TravianHelper.createAddToBuildingListButton = function () {
        var level = document.getElementsByClassName("level");

        if (level.length != 0) {

            var button = document.createElement("button");
            button.innerText = "Add to build";
            button.classList.add("textButtonV1");
            button.classList.add("green");
            button.addEventListener("click", function () {
                TravianHelper.tryAddBuildingToBuildingList();
                console.log("Miu");
            });

            level[0].appendChild(button);
        }
    }

    TravianHelper.setAuctionReminder = function(timeLeft) {
        console.log(timeLeft);
        var date = new Date();
        var time = date.getTime() + timeLeft * 1000;

        TravianHelper.auctionReminders.push(time);
        TravianHelper.setStorage();
    }

    TravianHelper.checkAuctionReminders = async function() {

        let allReminded = [];
        for(let i = 0; i < TravianHelper.auctionReminders.length; i++)
            allReminded.push(false);

        while(true){
            await TravianHelper.wait(100);
            var date = new Date();
            var time = date.getTime();
            for(let i = 0; i < TravianHelper.auctionReminders.length; i++)
            {
                if(TravianHelper.auctionReminders[i] - time < TravianHelper.auctionReminderSeconds * 1000 && TravianHelper.auctionReminders[i] > time)
                {
                    if(!allReminded[i]) {
                        TravianHelper.playAuctionSound();
                        allReminded[i] = true;
                    }
                }
            }
        }
    }

    TravianHelper.calcDistance = function(c1,c2) {
        var xD = Math.abs(c1.x-c2.x);
        var yD = Math.abs(c1.y-c2.y);
        if(xD > 200)
            xD = 401 - xD;
        if(yD > 200)
            yD = 401 - yD;
        return Math.sqrt(xD*xD + yD*yD);
    }

    function sortByScoreAndProperty(array, secondaryProperty = 'dai') {
        return array.sort((a, b) => {
            return b.score/b.secondaryProperty - a.score / a.secondaryProperty;
        });
    }
    var globalOasesData = [];
    var selectedAnimalRadioButton = "easiestCavalry";
    var pointMinimum = 1;
    TravianHelper.interpretMapData = async function(jsonInfo) {

        await TravianHelper.wait(100);

        for(let i = 0; i < jsonInfo.tiles.length; i++)
        {
            let tileData = jsonInfo.tiles[i];
            let tileText = tileData.text;

            const pattern = /<div class="inlineIcon tooltipUnit" title=""><i class="unit (\w+)"><\/i><span class="value ">(\d+)<\/span><\/div>/g;
            const matches = [];
            let match;

            while ((match = pattern.exec(tileText)) !== null) {
                const type = match[1];  // e.g., "u31"
                const value = parseInt(match[2], 10);  // e.g., 4
                matches.push({ type, value });
            }
            {

                let totalScore = 0;
                for(let j = 0; j < matches.length; j++)
                {
                    switch(matches[j].type)
                    {
                        case "u31": 
                        case "u32": 
                        case "u33": 
                        case "u34": 
                            totalScore += matches[j].value;
                            break;
                        case "u35": 
                        case "u36": 
                            totalScore += matches[j].value * 2;
                            break;
                        case "u37": 
                        case "u38": 
                        case "u39": 
                            totalScore += matches[j].value * 3;
                            break;
                        case "u40":
                            totalScore += matches[j].value * 5;
                            break;
                    }
                }

                let dai = 0;
                let dac = 0;

                for(let j = 0; j < matches.length; j++)
                    {
                        switch(matches[j].type)
                        {
                            case "u31": 
                            dai += 25 * matches[j].value;
                            dac += 20 * matches[j].value;
                            break;
                            case "u32": 
                            dai += 35 * matches[j].value;
                            dac += 40 * matches[j].value;
                            break;
                            case "u33": 
                            dai += 40 * matches[j].value;
                            dac += 60 * matches[j].value;
                            break;
                            case "u34": 
                            dai += 66 * matches[j].value;
                            dac += 50 * matches[j].value;
                            break;
                            case "u35": 
                            dai += 70 * matches[j].value;
                            dac += 33 * matches[j].value;
                            break;
                            case "u36": 
                            dai += 80 * matches[j].value;
                            dac += 70 * matches[j].value;
                            break;
                            case "u37": 
                            dai += 140 * matches[j].value;
                            dac += 200 * matches[j].value;
                            break;
                            case "u38": 
                            dai += 380 * matches[j].value;
                            dac += 240 * matches[j].value;
                            break;
                            case "u39": 
                            dai += 170 * matches[j].value;
                            dac += 250 * matches[j].value;
                            break;
                            case "u40": 
                            dai += 440 * matches[j].value;
                            dac += 520 * matches[j].value;
                            break;
                        }
                    }

                let coord = TravianHelper.getCurrentVillageCoord();
                let distance = TravianHelper.calcDistance(coord,tileData.position);

                let data = {position: tileData.position, distance: distance, animals: matches, score: totalScore, dai: dai, dac: dac};
                let found = false;
                for(let j = 0; j < globalOasesData.length; j++)
                {
                    if(globalOasesData[j].position.x == data.position.x && globalOasesData[j].position.y == data.position.y){
                        found = true;
                        break;
                    }
                }
                if(!found)
                    globalOasesData.push(data);
            }
        }

        console.log("Selected button:" + selectedAnimalRadioButton);
        if(selectedAnimalRadioButton == "leastPoints")
            {
                globalOasesData.sort((a, b) => {
                    return a.score - b.score;
                });
                TravianHelper.createAnimalTableOnMap(globalOasesData, true);
            }
        else if(selectedAnimalRadioButton == "mostPoints")
            {
                globalOasesData.sort((a, b) => {
                    return b.score- a.score;
                });
                TravianHelper.createAnimalTableOnMap(globalOasesData, true);
            }
        else if(selectedAnimalRadioButton == "easiestCavalry")
            {
                globalOasesData.sort((a, b) => {
                    var bDefense =  b.dac;
                    var aDefense = a.dac;

                    if(aDefense == 0)
                        aDefense = 1;
                    if(bDefense == 0)
                        bDefense = 1;
                    return b.score / bDefense - a.score / aDefense;
                });
                TravianHelper.createAnimalTableOnMap(globalOasesData, true);
            }
        else if(selectedAnimalRadioButton == "easiestInfantry")
            {
                globalOasesData.sort((a, b) => {
                    var bDefense =  b.dai;
                    var aDefense = a.dai;

                    if(aDefense == 0)
                        aDefense = 1;
                    if(bDefense == 0)
                        bDefense = 1;
                    return b.score / bDefense - a.score / aDefense;
                });
                TravianHelper.createAnimalTableOnMap(globalOasesData, false);
            }
         else if(selectedAnimalRadioButton == "distance")
            {
                globalOasesData.sort((a, b) => {
                    return a.distance - b.distance;
                });
                TravianHelper.createAnimalTableOnMap(globalOasesData, false);
            }

        console.log(globalOasesData);
    }

    TravianHelper.interpretAuctionData = async function(jsonInfo) {

        await TravianHelper.wait(100);

        let buyBidTable = document.getElementsByClassName("currentBid")[0].children[1];

        for(let i = 0; i < jsonInfo.auctions.data.length; i++)
        {
            let auData = jsonInfo.auctions.data[i];
            if(auData.uid == TravianHelper.playerId)
            {
                console.log("Found: " + i);
                buyBidTable.children[i].children[1].style.backgroundColor = "lightgreen";
            }

            if(TravianHelper.auctionShowSellerId){
                let url = window.location.origin + "/profile/" + auData.uid;
    
                const link = document.createElement("a");
                link.href = url; // Set the URL
                link.textContent = "(id: " + auData.uid + ")"; // Set the text for the link
                link.target = "_blank"; // Optional: Opens link in a new tab
                        // Style the link
                link.style.marginLeft = "10px";       // Adds space around the link
                link.style.fontSize = "8px";     // Sets the text size
                link.style.display = "inline-block"; // Ensures margin is applied around the link

                buyBidTable.children[i].children[1].appendChild(link);
            }
        }
    }

    TravianHelper.appendAuctionTab = async function() {
        
        for(let i = TravianHelper.auctionReminders.length - 1; i >= 0; i--)
        {
            var date = new Date();
            var time = date.getTime();
            if(TravianHelper.auctionReminders[i] - time < TravianHelper.auctionReminderSeconds * 1000)
                {
                    TravianHelper.auctionReminders.splice(i,1);
                }
        }
        TravianHelper.setStorage();


        while(document.getElementsByClassName("currentBid").length == 0)
            await TravianHelper.wait(100);


        while(true) {
            await TravianHelper.wait(100);

            let bidTables = document.getElementsByClassName("currentBid");
            
            for(let j = 0; j < bidTables.length; j++){

                let bidTable = bidTables[j];
                let times = bidTable.getElementsByClassName("time");


                if(TravianHelper.auctionItemBackground) {
                    let icons = bidTables[0].getElementsByClassName("icon")

                    for(let i = 0; i < icons.length; i++) {
                        let computedStyle = window.getComputedStyle(icons[i])
                        icons[i].style.backgroundColor = computedStyle.borderColor;
                    }
                }
                for(let i = 0; i < times.length; i++) {
                    if(times[i].getElementsByClassName("auctionReminder").length > 0)
                        continue;
                    if(times[i].childElementCount == 0)
                        continue;
                    if(times[i].children[0].getAttribute("value") <= 0)
                        continue;

                    var link = document.createElement('a');
                    link.classList.add("auctionReminder");
                    link.href = '#';  // Set the href attribute
                    link.onclick = () => {TravianHelper.setAuctionReminder(times[i].children[0].getAttribute("value"));};  // Set the onclick event to call handleClick
                
                    // Create <img> element
                    var img = document.createElement('img');
                    img.src = '/img/x.gif';  // Set the source for the image
                    img.alt = 'Set reminder';  // Set alt text
                    img.classList.add('clock');  // Add the class 'clock' to the image
                    
                    // Append the image to the link
                    link.appendChild(img);
                    
                    // Append the link to the div with id 'link-container'
                    times[i].appendChild(link);
                }
            }
        }
    }

    TravianHelper.onMapChangeCoord = function(x,y)
    {
        var mcEnter = document.getElementById("mapCoordEnter");
        var xCoordText = mcEnter.getElementsByClassName("xCoord")[0].getElementsByClassName("text")[0];
        var yCoordText = mcEnter.getElementsByClassName("yCoord")[0].getElementsByClassName("text")[0];
        var button = mcEnter.getElementsByClassName("contents")[0].children[1];

        xCoordText.value = x;
        yCoordText.value = y;
        button.click();
    }

    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    }
    
    TravianHelper.createAnimalTableOnMap = function(oases,cavalryPower){

        var panels = document.querySelectorAll('.oasisPanel');

        // Step 2: Iterate over the NodeList and remove each element
        panels.forEach(function(panel) {
            panel.parentNode.removeChild(panel);
        });
                // Step 1: Get the contentOuterContainer
        var contentOuterContainer = document.getElementById("contentOuterContainer");
        var centerContainer = document.getElementById("center");

        // Step 2: Create a new div element for the panel
        var scrollablePanel = document.createElement("div");

        // Step 3: Add styles to make it scrollable, centered, and have the same width
        scrollablePanel.style.backgroundColor = "white";  // White background
        scrollablePanel.style.height = "200px";  // Set the height of the panel
        scrollablePanel.style.overflowY = "auto";  // Make it scrollable vertically
        scrollablePanel.style.border = "1px solid #ccc";  // Optional: add a border
        scrollablePanel.style.padding = "10px";  // Optional: add some padding
        scrollablePanel.style.width = contentOuterContainer.style.width + "px";  // Match the width of contentOuterContainer
        scrollablePanel.style.top = -100 + "px";

        scrollablePanel.style.position = "relative";
        scrollablePanel.style.gridColumnStart = 2;
        scrollablePanel.style.gridRowStart = 2;

        if (isMobileDevice()) {
            scrollablePanel.style.gridColumnStart = 1;
            scrollablePanel.style.gridRowStart = 2;
            scrollablePanel.style.width = "600px";
            scrollablePanel.style.top = 10 + "px";
        } 

        // Step 4: Create a container for radio buttons
        var radioContainer = document.createElement("div");
        radioContainer.style.marginBottom = "10px";  // Space between radio buttons and table
        // Add radio buttons for sorting options
        var sortOptions = [
            { id: "leastPoints", label: "Least points" },
            { id: "mostPoints", label: "Most points" },
            { id: "easiestCavalry", label: "Easiest cavalry" },
            { id: "easiestInfantry", label: "Easiest infantry" },
            { id: "distance", label: "Distance" }
        ];

        sortOptions.forEach(function(option) {
            var radioLabel = document.createElement("label");
            radioLabel.style.marginRight = "10px";  // Space between radio buttons

            var radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "sortOption";
            radioInput.value = option.id;
            radioInput.id = option.id;

            radioLabel.appendChild(radioInput);
            radioLabel.appendChild(document.createTextNode(option.label));

            if(option.id == selectedAnimalRadioButton)
                radioInput.checked = true;

            radioContainer.appendChild(radioLabel);

            // Add event listener to call the corresponding function
                radioInput.addEventListener('change', function() {
                    selectedAnimalRadioButton = option.id;
                    if(option.id == "leastPoints")
                        {
                            oases.sort((a, b) => {
                                return a.score- b.score;
                            });
                            TravianHelper.createAnimalTableOnMap(oases,cavalryPower);
                        }
                    else if(option.id == "mostPoints")
                    {
                        oases.sort((a, b) => {
                            return b.score- a.score;
                        });
                        TravianHelper.createAnimalTableOnMap(oases,cavalryPower);
                    }
                    else if(option.id == "easiestCavalry")
                    {
                        oases.sort((a, b) => {
                            let bDefense =  b.dac;
                            let aDefense = a.dac;

                            if(aDefense == 0)
                                aDefense = 1;
                            if(bDefense == 0)
                                bDefense = 1;

                            return b.score / bDefense - a.score / aDefense;
                        });
                        TravianHelper.createAnimalTableOnMap(oases,true);
                    }
                    else if(option.id == "easiestInfantry")
                    {
                        oases.sort((a, b) => {
                            let bDefense =  b.dai;
                            let aDefense = a.dai;

                            if(aDefense == 0)
                                aDefense = 1;
                            if(bDefense == 0)
                                bDefense = 1;
                            return b.score / bDefense - a.score / aDefense;
                        });
                        TravianHelper.createAnimalTableOnMap(oases,false);
                    }
                    else if(option.id == "distance")
                        {
                            globalOasesData.sort((a, b) => {
                                return a.distance - b.distance;
                            });
                            TravianHelper.createAnimalTableOnMap(oases,cavalryPower);
                        }
            });
        });

        let inputLabel = document.createElement('label');
        inputLabel.textContent = 'Minimum points: ';
    
        // Create the input element
        let input = document.createElement('input');
        input.type = 'number';
        input.value = pointMinimum; // Set initial value based on pointMinimum
        input.addEventListener('input', function() {
            // Update pointMinimum when input value changes
            pointMinimum = parseInt(input.value); // Parse input value as integer
            switch(selectedAnimalRadioButton)
            {
                case "leastPoints":
                case "mostPoints":
                case "distance":
                    TravianHelper.createAnimalTableOnMap(oases,cavalryPower);
                    break;
                case "easiestCavalry":
                        TravianHelper.createAnimalTableOnMap(oases,true);
                        break;
                case "easiestInfantry":
                        TravianHelper.createAnimalTableOnMap(oases,false);
                        break;

            }
        });
    
        // Append label and input to a div (or directly to radioContainer if needed)
        let inputContainer = document.createElement('div');
        inputContainer.appendChild(inputLabel);
        inputContainer.appendChild(input);

        radioContainer.appendChild(inputContainer);

        // Step 5: Create a table element
        var table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        // Create table header
        var thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Coordinate</th>
                <th>Animals</th>
                <th>Power</th>
                <th>Points</th>
                <th>Distance</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body with sample data
        var tbody = document.createElement("tbody");
        var animalNames = ["Rat", "Spider", "Snake", "Bat", "Wild boar", "Wolf", "Bear", "Crocodile", "Tiger", "Elephant"];
        var htmlString = "";
        for(let i = 0; i < oases.length; i++)
        {
            if(oases[i].score < pointMinimum)
                continue;

            htmlString += `<tr><td><a class="a arrow oasisFind" onclick="TravianHelper.onMapChangeCoord(`+oases[i].position.x+`, `+oases[i].position.y+`)" data-centermap="true">(` + oases[i].position.x + "|" + oases[i].position.y + ")</a></td><td>";
            for(let j = 0; j < oases[i].animals.length; j++)
            {
                htmlString += `<img class="unit ` + oases[i].animals[j].type + `" src = "/img/x.gif" alt = "Animal" style="width:16px; height:16px; margin-left: 10px"> ` + oases[i].animals[j].value;
            }
            var powerPerPoint = (cavalryPower?oases[i].dac:oases[i].dai) / oases[i].score;
            htmlString += `</td><td>` + (cavalryPower?oases[i].dac:oases[i].dai) + ` (`+ powerPerPoint.toFixed(1)+`)</td>`;
            htmlString += `<td>` + oases[i].score + `</td>`
            htmlString += `<td>` + oases[i].distance.toFixed(1) + `</td></tr>`
        }
        tbody.innerHTML = htmlString;
        table.appendChild(tbody);

        // Step 6: Append slider and table to the scrollable panel
        scrollablePanel.appendChild(radioContainer);
        scrollablePanel.appendChild(table);
        scrollablePanel.classList.add("oasisPanel");


        // Step 5: Insert the panel right after the contentOuterContainer
        center.appendChild(scrollablePanel)
    }
 
    TravianHelper.scheduleForEnoughTroops = function()
    {
        let table = document.getElementById("troops");

        let tableLine1 = table.children[0].children[0];
        let tableLine2 = table.children[0].children[1];
        let tableLine3 = table.children[0].children[2];


        let troopList = [];

        for(let i = 0; i < tableLine1.childElementCount; i++)
        {
            var elem = tableLine1.children[i];

            if (elem.childElementCount == 0)
                continue;

            var unit = elem.getElementsByClassName("unit");
            var type = unit[0].classList[1];
            var input = elem.getElementsByClassName("text")[0].value;
            var num = Number(input);

            if(num > 0)
                troopList.push({type: type, count: num});

        }
        for(let i = 0; i < tableLine2.childElementCount; i++)
        {
            var elem = tableLine2.children[i];

            if (elem.childElementCount == 0)
                continue;

            var unit = elem.getElementsByClassName("unit");
            var type = unit[0].classList[1];
            var input = elem.getElementsByClassName("text")[0].value;
            var num = Number(input);

            if(num > 0)
                troopList.push({type: type, count: num});
        }
        for(let i = 0; i < tableLine3.childElementCount; i++)
        {
            var elem = tableLine3.children[i];

            if (elem.childElementCount == 0)
                continue;

            var unit = elem.getElementsByClassName("unit");
            var type = unit[0].classList[1];
            var input = elem.getElementsByClassName("text")[0].value;
            var num = Number(input);

            if(num > 0)
                troopList.push({type: type, count: num});
        }

        var xCoord = document.getElementsByClassName("x");
        var yCoord = document.getElementsByClassName("y");

        if(xCoord[0].value.length == 0 || yCoord[0].value.length == 0)
            return;

        var x = xCoord[0].value;
        var y = yCoord[0].value;


        var option = document.getElementsByClassName("option")
        let checkNumber = 4;
        for(let i = 0; i < option[0].childElementCount; i++) {
            let child = option[0].children[i];
            if(child.childElementCount > 0) {
                let childOfChild = child.children[0];
                var checked = childOfChild.checked;
                if(checked)
                    checkNumber = i;
            }
        }


        var schedule = {troops: troopList, x: x, y: y, checkNumber: checkNumber};
        var villageIndex = TravianHelper.getCurrentVillageIndex();
        var data = TravianHelper.villageData[villageIndex];

        if(schedule.troops.length > 0)
        {
            if(data["scheduledSends"] == null)
                data["scheduledSends"] = [];

            data["scheduledSends"].push(schedule);
            TravianHelper.setStorage();
            console.log(schedule);
        }

    }

    TravianHelper.appendSendTroopPage = function() {
        
        var scheduleButton = document.createElement("button");
        scheduleButton.innerText = "Schedule for enough troops";
        scheduleButton.type = "submit";
        scheduleButton.classList.add("textButtonV1");
        scheduleButton.classList.add("green");

        scheduleButton.addEventListener("click", function () {
            console.log("Miu");
            TravianHelper.scheduleForEnoughTroops();
        });

        var mainPage = document.getElementsByClassName("gid16");
        mainPage[0].appendChild(scheduleButton);
    }

    TravianHelper.hasEnoughTroopsAtHome = function(data, schedule)
    {
        var troopsAtHome = data.troops;

        //type check
        for(let i = 0; i < schedule.troops.length; i++)
        {
            let found = false;
            for(let j = 0; j < troopsAtHome.length; j++)
            {
                if(schedule.troops[i].type == troopsAtHome[j].type) {
                    found = true;
                    if(schedule.troops[i].count > troopsAtHome[j].count)
                        return false;
                    break;
                }
            }
            if(!found)
                return false;
        }
        return true;
    }

    TravianHelper.sendScheduledTroop = async function(index) {
        var href = window.location.href;

        var villageIndex = TravianHelper.getCurrentVillageIndex();
        var data = TravianHelper.villageData[villageIndex];

        let schedule = data.scheduledSends[index];

        if(!href.includes("gid=36") && !href.includes("tt=2"))
        {
            window.location.href = window.location.origin + "/build.php?id=39&gid=16&tt=2";
        }
        else {
            var gid16 = document.getElementsByClassName("gid16")[0];

            if(gid16.getElementsByClassName("error").length > 0)
            {
                data.scheduledSends.splice(index, 1);
                TravianHelper.setStorage();
                window.location.href = window.location.href;
            }


            var xText = document.getElementsByClassName("text coordinates x");
            var yText = document.getElementsByClassName("text coordinates y");

            var onSend = xText.length > 0 && yText.length > 0;

            if(onSend){
                document.getElementsByClassName("x")[0].value = schedule.x;
                document.getElementsByClassName("y")[0].value = schedule.y;

                let table = document.getElementById("troops");

                let tableLine1 = table.children[0].children[0];
                let tableLine2 = table.children[0].children[1];
                let tableLine3 = table.children[0].children[2];

                for(let i = 0; i < tableLine1.childElementCount; i++)
                {
                    var elem = tableLine1.children[i];
                    if (elem.childElementCount == 0)
                        continue;
            
                    var unit = elem.getElementsByClassName("unit");
                    var type = unit[0].classList[1];
                    for(let j = 0; j < schedule.troops.length; j++)
                    {
                        if(type == schedule.troops[j].type)
                            elem.getElementsByClassName("text")[0].value = schedule.troops[j].count;
                    }
                }
                for(let i = 0; i < tableLine2.childElementCount; i++)
                {
                    var elem = tableLine2.children[i];
                    if (elem.childElementCount == 0)
                        continue;
            
                    var unit = elem.getElementsByClassName("unit");
                    var type = unit[0].classList[1];
                    for(let j = 0; j < schedule.troops.length; j++)
                    {
                        if(type == schedule.troops[j].type)
                            elem.getElementsByClassName("text")[0].value = schedule.troops[j].count;
                    }
                }
                for(let i = 0; i < tableLine3.childElementCount; i++)
                {
                   var elem = tableLine3.children[i];
                    if (elem.childElementCount == 0)
                        continue;
             
                    var unit = elem.getElementsByClassName("unit");
                    var type = unit[0].classList[1];
                    for(let j = 0; j < schedule.troops.length; j++)
                    {
                        if(type == schedule.troops[j].type)
                            elem.getElementsByClassName("text")[0].value = schedule.troops[j].count;
                    }
                }

                var option = document.getElementsByClassName("option")
                option[0].children[schedule.checkNumber].children[0].checked = true;
                await TravianHelper.wait(500);

                var sendButton = gid16.getElementsByClassName("textButtonV1 green ")[0];
                sendButton.click();
            }
            else //if not onsend 
            {
                await TravianHelper.wait(500);


                for(let i = 0; i < schedule.troops.length; i++)
                {
                    for(let j = 0; j < data.troops.length; j++) {
                        if(schedule.troops[i].type == data.troops[j].type)
                            data.troops[j].count -= schedule.troops[i].count;
                    }
                    
                }
                data.scheduledSends.splice(index, 1);
                TravianHelper.setStorage();
                var confirmButton = document.getElementsByClassName("textButtonV1 green rallyPointConfirm")[0];
                confirmButton.click();
            }




        }
    }

    function timeToSeconds(timeStr) {
        const timeParts = timeStr.split(':').map(Number); // Split time string and convert each part to a number
        const hours = timeParts[0];
        const minutes = timeParts[1];
        const seconds = timeParts[2];
    
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    TravianHelper.doAutoAdventure = async function() {
        var href = window.location.href;

        if(!href.includes("hero/adventures"))
        {
            await TravianHelper.wait(400);
            window.location.href = window.location.origin + "/hero/adventures";
        }
        else {
            var table = document.getElementsByClassName("borderGap adventureList");
            while (table.length == 0)
            {
                await TravianHelper.wait(100);
                table = document.getElementsByClassName("borderGap adventureList");
            }
            var tableContent = table[0].children[1];

            var bestIndex = -1;
            var bestSeconds = -1;

            for(let i = 0; i < tableContent.childElementCount; i++) {
                var advElem = tableContent.children[i];
                var durationElem = advElem.getElementsByClassName("duration");
                var seconds = timeToSeconds(durationElem[0].innerHTML);

                if(bestIndex == -1 || seconds < bestSeconds)
                {
                    bestIndex = i;
                    bestSeconds = seconds
                }
            }

            if(bestIndex == -1 || bestSeconds > TravianHelper.autoAdventureMaxTime)
            {
                TravianHelper.autoAdventureStop = new Date().getTime() + 600000;
                TravianHelper.setStorage();
                await TravianHelper.wait(400);
                window.location.href = window.location.origin + "/dorf2.php";
            }

            var startButton = tableContent.children[bestIndex].getElementsByClassName("textButtonV2 buttonFramed rectangle withText green")[0];

            if(startButton.classList.contains("disabled"))
            {
                TravianHelper.autoAdventureStop = new Date().getTime() + 600000;
                TravianHelper.setStorage();
                await TravianHelper.wait(400);
                window.location.href = window.location.origin + "/dorf2.php";
            }
            TravianHelper.autoAdventureStop = new Date().getTime() + bestSeconds * 1000;
            TravianHelper.setStorage();
            await TravianHelper.wait(400);
            startButton.click();
        }
    }


    TravianHelper.allPageCheck = function() {
        var adventure = document.getElementsByClassName("adventure");
        var adventureContent = adventure[0].getElementsByClassName("content");
        var adventureCount = 0;
        if(adventureContent.length > 0) {
            adventureCount = Number(adventure[0].getElementsByClassName("content")[0].innerHTML);
        }

        TravianHelper.adventureCount = adventureCount;
        TravianHelper.heroHome = document.getElementsByClassName("heroHome").length > 0;
    }

    TravianHelper.enlargePageSelectors = async function()
    {
        await TravianHelper.wait(500);
        // Select all elements with the class 'paginator'
        let paginators = document.querySelectorAll("div.paginator");
        while(paginators.length == 0)
        {
            paginators = document.querySelectorAll("div.paginator");
            await TravianHelper.wait(100);
        }

        // Loop through each element and set the font size
        paginators.forEach(element => {
            element.style.fontSize = "20px"; // Set desired font size
        });
    }

    TravianHelper.fixVillage = function()
    {
        // Select all divs with classes "listEntry", "village", and "active"
        const activeDivs = document.querySelectorAll('.listEntry.village.active');

        // Loop through each element and change the background color
        activeDivs.forEach(div => {
            div.style.backgroundColor = 'rgb(221, 198, 162)';
        });
    }

    TravianHelper.appendBattleSimulatorPage = async function()
    {
        let attackers = document.getElementsByClassName("troops attack");

        while(attackers.length == 0) {
            attackers = document.getElementsByClassName("troops attack");

            await TravianHelper.wait(100);
        }

        var select = document.getElementsByClassName("villageSelection")

        var a = document.createElement("a");
        a.innerHTML = "[clear troops]";

        a.style.marginLeft = "10px"
        a.addEventListener('click', function (event) {
            TravianHelper.clearOffensiveTroopsInBattleSim()
        });

        select[0].appendChild(a)
    }

    TravianHelper.clearOffensiveTroopsInBattleSim = async function()
    {
        let attackers = document.getElementsByClassName("troops attack");

        while(attackers.length == 0) {
            attackers = document.getElementsByClassName("troops attack");

            await TravianHelper.wait(100);
        }
        attackers = attackers[0];

        let unitClasses = ["unit1","unit2","unit3","unit4","unit5","unit6","unit7","unit8","unit9","unit10"]
        let icons = document.getElementsByClassName("troopIcons")[0];

        for(let i = 0; i < unitClasses.length; i++){
            let input = attackers.getElementsByClassName(unitClasses[i])[0];
            if(input.value > 0) {
                icons.children[i + 1].children[0].click()
            }

        await new Promise(r => setTimeout(r, 50));
        }
    }


    $(document).ready(function () {
        try {
            if (window.location.href.substring(0, window.location.href.length - 1) == window.location.origin) {
                console.log("index page - no script")
                return;
            }
            if (window.location.href.includes("gettertools") || window.location.href.includes("inactivesearch"))
                return;

            TravianHelper.fixVillage();

            TravianHelper.getStorage();
            TravianHelper.checkTaskEnd = false;

            if (TravianHelper.farmListProfiles.length == 0) {
                TravianHelper.createFarmlistProfile("Default");
            }
            var href = window.location.href;
            
            if (!href.includes("options")) {
                console.log("regular");


                if(isMobileDevice())
                    TravianHelper.enlargePageSelectors();

                TravianHelper.allPageCheck();
                
                if (href.includes("hero/inventory")){
                    TravianHelper.checkHeroResources();
                }

                if (href.includes("dorf1.php") || href.includes("dorf2.php")) {
                    TravianHelper.appendBuildingList();
                }
                else if (href.includes("build.php")) {
                    TravianHelper.tryAppendBuildGui();
                    if (href.includes("build.php") && href.includes("id=39") && href.includes("gid=16") && href.includes("tt=99")) {
                        TravianHelper.appendFarmlistPage();
                    }
                }
                if (href.includes("hero/auction"))
                {
                    TravianHelper.appendAuctionTab()
                }
                else {
                    TravianHelper.checkAuctionReminders();
                }

                if (href.includes("build.php") && href.includes("gid=16") && href.includes("tt=2"))
                {
                    TravianHelper.appendSendTroopPage();
                }

                if (TravianHelper.heroGet.wood > 0 || TravianHelper.heroGet.clay > 0 || TravianHelper.heroGet.iron > 0 || TravianHelper.heroGet.wheat > 0) {
                    {
                        TravianHelper.getResourcesFromHero(TravianHelper.heroGet.wood, TravianHelper.heroGet.clay, TravianHelper.heroGet.iron, TravianHelper.heroGet.wheat);
                    }
                }
                else if (href.includes("build.php") && href.includes("gid=16") && href.includes("tt=2") && TravianHelper.currentTask == 0) {
                    console.log("rally point send");
                    TravianHelper.tryFillInUnits();
                }
                else if (href.includes("build.php") && href.includes("gid=16") && href.includes("tt=1") && TravianHelper.currentTask == 0) {
                    console.log("rally point overview");
                    if (TravianHelper.sendingOutFarmList) {
                        TravianHelper.sendingOutFarmListIdx = TravianHelper.getNextFarmlistIndex();
                        TravianHelper.setStorage();
                        TravianHelper.trySendCurrentInFarmList();
                    }
                }
                else if (href.includes("build.php") && href.includes("gid=16") && href.includes("tt=3"))
                {
                    TravianHelper.appendBattleSimulatorPage();
                    if(TravianHelper.autoUnfillBattleSimulator)
                        TravianHelper.clearOffensiveTroopsInBattleSim();
                }
                else if (TravianHelper.currentTask == 0) {
                    TravianHelper.SendOutFarmList(0);
                }
                else if (TravianHelper.currentTask == 1) {

                    if (!TravianHelper.quickVillageCheck)
                        TravianHelper.getCurrentVillageData();
                    else TravianHelper.getQuickVillageData();
                }
                else if (TravianHelper.currentTask == -1 && href.includes("dorf1.php")) {
                    TravianHelper.getCurrentVillageData();
                }
                else if (TravianHelper.currentTask == 2) {

                    if(href.includes("dorf1.php"))
                        TravianHelper.getCurrentVillageData();
                    TravianHelper.loadBuildableVillage();
                }



                TravianHelper.checkTasks();
                TravianHelper.checkNewMessages();
                if (!href.includes("messages"))
                    TravianHelper.doQuickAttackCheck();
            }
            else TravianHelper.appendSettingsGui();


        } catch (e) {
            console.log("exception occured");
            TravianHelper.playErrorSound();
        }
    });

    // Intercept fetch API
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args)
            .then(response => {
                const clonedResponse = response.clone();
                
                // If the response contains a document (e.g. JSON, XML)
                clonedResponse.text().then(data => {
                    //console.log('Fetched document:', data);
                    // You can also apply more specific logic here if you want
                    // to check for certain URLs or content types
                });

                return response;
            });
    };

    // Intercept XMLHttpRequest API
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
        this.addEventListener('load', function() {
            if (this.responseType === '' || this.responseType === 'text') {
                //console.log('XHR Document Loaded:', this.responseText);
                //jsTest = JSON.parse(this.responseText);
                var jsonData = JSON.parse(this.responseText);
                if(jsonData.auctions != null)
                {
                    TravianHelper.interpretAuctionData(jsonData);
                }
                if(jsonData.tiles != null)
                {
                    TravianHelper.interpretMapData(jsonData);
                }
            }
        });
        return originalXhrOpen.apply(this, args);
    };

    repeatedWarning = async function()
    {
        while(true && !window.location.href.includes("karte.php"))
        {
            await TravianHelper.wait(5000);
            TravianHelper.playErrorSound();
        }
    }
})();
