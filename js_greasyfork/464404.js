// ==UserScript==
// @name           hwmInnKeeper
// @author         Tamozhnya1
// @namespace      Tamozhnya1
// @version        4.2
// @description    Помощник игры в таверне: автоприём заявок, автоотклонение по черному списку, оповещение о начале игры, время в игре, фильтр заявок, количество напитков восстановления
// @include        *.heroeswm.ru/*
// @include        *.lordswm.com/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant 		   GM.xmlHttpRequest
// @grant 		   GM.notification
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/464404/hwmInnKeeper.user.js
// @updateURL https://update.greasyfork.org/scripts/464404/hwmInnKeeper.meta.js
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
const PlayerId = playerIdMatch ? playerIdMatch[1] : "";
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const win = window.wrappedJSObject || unsafeWindow;
const isHeartOnPage = (document.querySelector("canvas#heart") || document.querySelector("div#heart_js_mobile")) ? true : false;
const isMooving = location.pathname == '/map.php' && !document.getElementById("map_right_block");
const isNewInterface = document.querySelector("div#hwm_header") ? true : false;
const isMobileInterface = document.querySelector("div#btnMenuGlobal") ? true : false;
const isMobileDevice = mobileCheck(); // Там нет мышки
const isNewPersonPage = document.querySelector("div#hwm_no_zoom") ? true : false;

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

if(!PlayerId) {
    return;
}
const areas = {
    "Empire Capital": { tower: 50, resources: 150 },
    "Eagle Nest": { tower: 50, resources: 150 },
    "Harbour City": { tower: 50, resources: 150 },
    "East River": { tower: 75, resources: 200 },
    "Portal Ruins": { tower: 75, resources: 200 },
    "Mithril Coast": { tower: 75, resources: 200 },
    "The Wilderness": { tower: 75, resources: 200 },
    "Tiger Lake": { tower: 150, resources: 400 },
    "Dragons' Caves": { tower: 150, resources: 400 },
    "Great Wall": { tower: 150, resources: 400 },
    "Sublime Arbor": { tower: 150, resources: 400 },
    "Rogues' Wood": { tower: 100, resources: 300 },
    "Shining Spring": { tower: 100, resources: 300 },
    "Titans' Valley": { tower: 100, resources: 300 },
    "Wolf Dale": { tower: 100, resources: 300 },
    "Sunny City": { tower: 100, resources: 300 },
    "Fishing Village": { tower: 100, resources: 300 },
    "Peaceful Camp": { tower: 125, resources: 350 },
    "Magma Mines": { tower: 125, resources: 350 },
    "Kingdom Castle": { tower: 125, resources: 350 },
    "Lizard Lowland": { tower: 200, resources: 500 },
    "Bear Mountain": { tower: 200, resources: 500 },
    "Ungovernable Steppe": { tower: 200, resources: 500 },
    "Green Wood": { tower: 100, resources: 300 },
    "Fairy Trees": { tower: 100, resources: 300 },
    "Crystal Garden": { tower: 100, resources: 300 }
};
const locations = {
    "Empire Capital": "Столица Империи",
    "East River": "Восточная Река",
    "Tiger Lake": "Тигриное Озеро",
    "Rogues' Wood": "Лес Разбойников",
    "Wolf Dale": "Долина Волков",
    "Peaceful Camp": "Мирный Лагерь",
    "Lizard Lowland": "Равнина Ящеров",
    "Green Wood": "Зеленый Лес",
    "Eagle Nest": "Орлиное Гнездо",
    "Portal Ruins": "Руины Портала",
    "Dragons' Caves": "Пещеры Драконов",
    "Shining Spring": "Сияющий Родник",
    "Sunny City": "Солнечный Город",
    "Magma Mines": "Магма Шахты",
    "Bear Mountain": "Медвежья Гора",
    "Fairy Trees": "Магический Лес",
    "Harbour City": "Портовый Город",
    "Mithril Coast": "Мифриловый Берег",
    "Great Wall": "Великая Стена",
    "Titans' Valley": "Равнина Титанов",
    "Fishing Village": "Рыбачье село",
    "Kingdom Castle": "Замок Королевства",
    "Ungovernable Steppe": "Непокорная Степь",
    "Crystal Garden": "Кристальный Сад",
    "East Island": "Восточный Остров",
    "The Wilderness": "Дикие земли",
    "Sublime Arbor": "Великое Древо"
};

main();
async function main() {
    getGamblersGuildLevel();
    if(location.pathname == "/tavern.php") {
        const tavernRef = document.querySelector("a[href='/tavern.php']");
        if(tavernRef) {
            tavernRef.parentNode.appendChild(document.createTextNode(" / "));
            const showOptionsRef = addElement("a", { href: "javascript:void(0)", innerHTML: isEn ? "Filter settings" : "Настройка фильтра" }, tavernRef.parentNode);
            showOptionsRef.addEventListener("click", showOptions);
        }
        applyFilter();
        
        //<td align=center colspan=6 bgcolor="#ffffff">С Вами хочет сыграть <b><a style='text-decoration:none;' href='pl_info.php?id=8458698'>Dealalan</a> <i>(5)</i></b> . Согласиться? (<a href='acard_game.php?id=8458698'><b>Да</b></a>&nbsp;/&nbsp;<a href='cancel_card_game.php?action=retreat'><b>Нет</b></a>)<Br><BR></td>
        const challengeCell = [...document.querySelectorAll("td:not(:has(td))")].find(x => x.innerHTML.includes(isEn ? "joins your challenge" : "С Вами хочет сыграть"));
        if(challengeCell) {
            const opponentRef = challengeCell.querySelector("a[href^='pl_info.php?id=']");
            const opponentId = getUrlParamValue(opponentRef.href, "id");
            const acromageOpponentMark = addElement("input", { id: "acromageOpponentMark", type: "checkbox", title: isEn ? "Mark player for auto reject" : "Пометить игрока для автопропуска" }, opponentRef, "afterend");
            const autoRejectOpponent = getBool(`acromageOpponentMark${opponentId}`);
            acromageOpponentMark.checked = autoRejectOpponent;
            acromageOpponentMark.addEventListener("change", function() { setValue(`acromageOpponentMark${opponentId}`, this.checked); });
            
            if(getPlayerBool("autoRejectBlackListPlayers") && autoRejectOpponent) {
                location.href = 'cancel_card_game.php?action=retreat';
            } else if(getPlayerBool("autoAcceptGame")) {
                const acceptGameRef = challengeCell.querySelector("a[href^='acard_game.php?id=']");
                if(acceptGameRef) {
                    location.href = acceptGameRef.href;
                }
            }
        }
    }
    if(location.pathname == "/cgame.php") {
        const cardsPngPath = "https://qcdn.heroeswm.ru/i/mobile_view/icons_add/cards.png";
        const favicon = document.querySelector("link[rel~='icon']") || addElement("link", { rel: "icon" }, document.head);
        favicon.href = cardsPngPath;
                
        // const finished_head = document.querySelector("div#finished_head");
        // await sleep(200);
        // const gameNotFinished = finished_head.innerHTML.length == 0; // это не работает. После загрузки див - пустой, нужна пауза.
        // const isPlayerGame = document.body.innerHTML.match(new RegExp(`|plid|${PlayerId}|`)) ? true : false;// это - не работает. plid - это игрок открывший страницу игры
        // console.log(`gameNotFinished: ${gameNotFinished}, isPlayerGame: ${isPlayerGame}, gamefinished: ${win.gamefinished}`);
        // if(gameNotFinished && isPlayerGame) {
            if(document.hidden) {
                if(getPlayerBool("gameNotification")) {
                    GM.notification(isEn ? "Game started" : "Игра началась", "ГВД", cardsPngPath, function() { window.focus(); });
                }
                if(getPlayerBool("gameSoundNotification")) {
                    new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a").play();
                }
            }
            const gameId = getUrlParamValue(location.href, "gameid");
            const gameDurationData = JSON.parse(getPlayerValue("gameDurationData", "{}"));
            if(gameDurationData.gameId != gameId) {
                setPlayerValue("gameDurationData", JSON.stringify({ gameId: gameId, gameStart: Date.now() }));
            }
            if(getPlayerBool("showGameDuration")) {
                const settingsBtn = document.querySelector("div#settings_btn");
                //const gameDurationPanel = addElement("div", { id: "gameDurationPanel", style: "position: absolute; background-color: #77b5fa; font-size: 1em; top: 0.1em; left: 1.7em;" }, settingsBtn);
                const gameDurationPanel = addElement("div", { id: "gameDurationPanel", style: "position: absolute; background-color: transparent; font-size: 1em; top: 0.1em; left: 1.7em;" }, settingsBtn);
                tick();
            }
        //}
    }
    if(location.pathname == "/pl_info.php") {
        const opponentId = getUrlParamValue(location.href, "id");
        const gamesPlayedCell = [...document.querySelectorAll("td:not(:has(td))")].find(x => x.innerText == (isEn ? "  Games played:" : "  Всего игр:")); ///console.log(gamesPlayedCell);
        const gamesPlayedRow = gamesPlayedCell.closest("tr"); //console.log(gamesPlayedRow);
        if(gamesPlayedRow
        //&& getBool(`acromageOpponentMark${opponentId}`)
        ) {
            const acromageOpponentMark = addElement("input", { id: "acromageOpponentMark", type: "checkbox", title: isEn ? "Mark player for auto reject" : "Пометить игрока для автопропуска", style: "vertical-align: super;" }, gamesPlayedRow.cells[2]);
            acromageOpponentMark.checked = getBool(`acromageOpponentMark${opponentId}`);
            acromageOpponentMark.addEventListener("change", function() { setValue(`acromageOpponentMark${opponentId}`, this.checked); });
        }
    }
    if(getPlayerBool("showDrinksQuantity")) {
        await processFreeHpDrink();
        let todayDrinkQuantity = JSON.parse(getPlayerValue("todayDrinkQuantity", "{}"));
        //todayDrinkQuantity.date = 0;
        if(dateOnly(todayDrinkQuantity.date || 0) < dateOnly(Date.now())) {
            const gamblersGuildLevel = parseInt(getPlayerValue("gamblersGuildLevel", 0));
            //console.log(`gamblersGuildLevel: ${gamblersGuildLevel}`);
            if(gamblersGuildLevel >= 12) {
                const drinks = gamblersGuildLevel - 10;
                todayDrinkQuantity = { date: Date.now(), remains: drinks, total: drinks };
                setPlayerValue("todayDrinkQuantity", JSON.stringify(todayDrinkQuantity));
            }
        }
        //console.log(todayDrinkQuantity);
        const tavernMenuItem = isNewInterface ? document.querySelector("div#MenuTavern") : getParent(document.querySelector("div#breadcrumbs a[href='tavern.php']"), "td", 3);
        if(tavernMenuItem && dateOnly(todayDrinkQuantity.date || 0) == dateOnly(Date.now())) {
            if(!isNewInterface) {
                tavernMenuItem.style.position = "relative";
            }
            const left = isNewInterface ? "67%" : "90%";
            tavernMenuItem.insertAdjacentHTML("beforeend", `<div id=remainsDrinkQuantity title="${isEn ? "Drinks in the tavern" : "Напитков в таверне"}" style="position: absolute; left: ${left} !important; bottom: .1em !important; text-align: right; color: #f5c140; font-weight: bold; font-size: 130%; text-shadow: 0px 0px 2px #000, 0px 0px 2px #000;">${todayDrinkQuantity.remains}</div>`);
        }
    }
}
function tick() {
    if(win.gamefinished) {
        return;
    }
    setTimeout(tick, 1000);
    const gameDurationPanel = document.getElementById("gameDurationPanel");
    if(gameDurationPanel) {
        const gameDurationData = JSON.parse(getPlayerValue("gameDurationData", "{}"));
        if(gameDurationData.gameStart) {
            const gameDurationSeconds = Math.floor((Date.now() - gameDurationData.gameStart) / 1000);
            const gameDurationMinutes = Math.floor(gameDurationSeconds / 60);
            const seconds = gameDurationSeconds % 60;
            gameDurationPanel.innerHTML = `<b>&nbsp;${gameDurationMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}&nbsp;</b>`;
        }
    }
}
function showOptions() {
    if(showPupupPanel(GM_info.script.name, onScriptOptionToggle)) {
       return;
    }
    const fieldsMap = [];
    fieldsMap.push([addElement("b", { innerText: isEn ? "Select locations" : "Выберите районы" })]);
    let i = 0;
    let fieldsRow = [];
    for(const area in areas) {
        i++;
        const div = addElement("div", { innerHTML: `<input id="areaCheckbox${i}" type=checkbox><label for=areaCheckbox${i}>${isEn ? area : locations[area]} (${areas[area].tower}/${areas[area].resources})</label>`});
        div.querySelector("input").checked = getPlayerBool(`show${area}`, true);
        div.querySelector("input").addEventListener("click", function() { setPlayerValue(`show${area}`, this.checked); });

        fieldsRow.push(div);
        if(i % 4 == 0) {
            fieldsMap.push(fieldsRow);
            fieldsRow = [];
        }
    }
    fieldsMap.push(fieldsRow);
    fieldsMap.push([]);

    // Уровень противника
    const levelFromCaption = addElement("b", { innerText: isEn ? "Partner level from" : "Уровень противника от" });
    const minLevelSelect = addElement("select");
    minLevelSelect.addEventListener("change", function() { setPlayerValue("minLevel", this.value); });

    const levelToCaption = addElement("b", { innerText: isEn ? "to" : "до" });
    const maxLevelSelect = addElement("select");
    maxLevelSelect.addEventListener("change", function() { setPlayerValue("maxLevel", this.value); });
    const opponentLevels = {};
    opponentLevels[-1] = isEn ? "Any" : "Любой";
    for(let i = 0; i <= 20; i++) {
        opponentLevels[i] = i.toString();
    }
    for(const opponentLevel in opponentLevels) {
        let option = addElement("option", { value: opponentLevel, innerHTML: opponentLevels[opponentLevel] }, minLevelSelect);
        if(opponentLevel == getPlayerValue("minLevel", "-1")) {
            option.setAttribute("selected", "selected");
        }
        option = addElement("option", { value: opponentLevel, innerHTML: opponentLevels[opponentLevel] }, maxLevelSelect);
        if(opponentLevel == getPlayerValue("maxLevel", "-1")) {
            option.setAttribute("selected", "selected");
        }
    }
    fieldsMap.push([levelFromCaption, minLevelSelect, levelToCaption, maxLevelSelect]);

    // Тип игры
    const gameTypeCaption = addElement("b", { innerText: isEn ? "Game type" : "Тип игры" });
    const gameTypeSelect = addElement("select");
    gameTypeSelect.addEventListener("change", function() { setPlayerValue("gameType", this.value); });
    const gameTypes = {"-1": isEn ? "Any" : "Любой", "1": isEn ? "One desk" : "Одна колода", "8": isEn ? "Infinite desk" : "Бесконечная колода"};
    for(const gameType in gameTypes) {
        const option = addElement("option", { value: gameType, innerHTML: gameTypes[gameType] }, gameTypeSelect);
        if(gameType == getPlayerValue("gameType", "-1")) {
            option.setAttribute("selected", "selected");
        }
    }
    fieldsMap.push([gameTypeCaption, gameTypeSelect]);

    // Время на ход
    const moveTimeFromCaption = addElement("b", { innerText: isEn ? "Turn time from" : "Время на ход от"});
    const minTimeSelect = addElement("select");
    minTimeSelect.addEventListener("change", function() { setPlayerValue("minTime", this.value); });

    const moveTimeToCaption = addElement("b", { innerText: isEn ? "to" : "до" });
    const maxTimeSelect = addElement("select");
    maxTimeSelect.addEventListener("change", function() { setPlayerValue("maxTime", this.value); });
    const moveTimes = {"-1": isEn ? "Any" : "Любая", "15": isEn ? "15 sec" :"15 сек.", "30": isEn ? "30 sec" : "30 сек.", "40": isEn ? "40 sec" : "40 сек."};
    for(const moveTime in moveTimes) {
        let option = addElement("option", { value: moveTime, innerHTML: moveTimes[moveTime] }, minTimeSelect);
        if(moveTime == getPlayerValue("minTime", "-1")) {
            option.setAttribute("selected", "selected");
        }
        option = addElement("option", { value: moveTime, innerHTML: moveTimes[moveTime] }, maxTimeSelect);
        if(moveTime == getPlayerValue("maxTime", "-1")) {
            option.setAttribute("selected", "selected");
        }
    }
    fieldsMap.push([moveTimeFromCaption, minTimeSelect, moveTimeToCaption, maxTimeSelect]);

    // Величина ставки
    const betValueFromCaption = addElement("b", { innerText: isEn ? "Bet value from" : "Величина ставки от" });
    const minBetSelect = addElement("select");
    minBetSelect.addEventListener("change", function() { setPlayerValue("minBet", this.value); });

    const betValueToCaption = addElement("b", { innerText: isEn ? "to" : "до" });
    const maxBetSelect = addElement("select");
    maxBetSelect.addEventListener("change", function() { setPlayerValue("maxBet", this.value); });
    const betValues = { "-1": isEn ? "Any" : "Любая", "0": "0", "40": "40", "100": "100", "300": "300", "600": "600", "1000": "1000",
        "2000": "2000", "3000": "3000", "4000": "4000", "5000": "5000", "6000": "6000", "7000": "7000",
        "10000": "10000", "11000": "11000", "12000": "12000", "20000": "20000", "25000": "25000", "30000": "30000",
        "35000": "35000", "40000": "40000", "50000": "50000" };
    for(const betValue in betValues) {
        let option = addElement("option", { value: betValue, innerHTML: betValues[betValue] }, minBetSelect);
        if(betValue == getPlayerValue("minBet", "-1")) {
            option.setAttribute("selected", "selected");
        }
        option = addElement("option", { value: betValue, innerHTML: betValues[betValue] }, maxBetSelect);
        if(betValue == getPlayerValue("maxBet", "-1")) {
            option.setAttribute("selected", "selected");
        }
    }
    fieldsMap.push([betValueFromCaption, minBetSelect, betValueToCaption, maxBetSelect]);
    
    const autoAcceptGameLable = addElement("label", { for: "autoAcceptGameCheckbox", innerText: (isEn ? "Auto accept game" : "Автопринятие заявки") + "\t" });
    const autoAcceptGameCheckbox = addElement("input", { id: "autoAcceptGameCheckbox", type: "checkbox" });
    autoAcceptGameCheckbox.checked = getPlayerBool("autoAcceptGame");
    autoAcceptGameCheckbox.addEventListener("change", function() { setPlayerValue("autoAcceptGame", this.checked); });

    const autoRejectBlackListPlayersLable = addElement("label", { for: "autoRejectBlackListPlayersCheckbox", innerText: (isEn ? "Auto reject black list players" : "Автоотклонение игроков из черного списка") + "\t" });
    const autoRejectBlackListPlayersCheckbox = addElement("input", { id: "autoRejectBlackListPlayersCheckbox", type: "checkbox" });
    autoRejectBlackListPlayersCheckbox.checked = getPlayerBool("autoRejectBlackListPlayers");
    autoRejectBlackListPlayersCheckbox.addEventListener("change", function() { setPlayerValue("autoRejectBlackListPlayers", this.checked); });

    fieldsMap.push([autoAcceptGameLable, autoAcceptGameCheckbox, autoRejectBlackListPlayersLable, autoRejectBlackListPlayersCheckbox]);
    
    const gameSoundNotificationLable = addElement("label", { for: "gameSoundNotificationCheckbox", innerText: (isEn ? "Game notification sound" : "Оповещение об игре звуковое") + "\t" });
    const gameSoundNotificationCheckbox = addElement("input", { id: "gameSoundNotificationCheckbox", type: "checkbox" });
    gameSoundNotificationCheckbox.checked = getPlayerBool("gameSoundNotification");
    gameSoundNotificationCheckbox.addEventListener("change", function() { setPlayerValue("gameSoundNotification", this.checked); });

    const gameNotificationLable = addElement("label", { for: "gameNotificationCheckbox", innerText: (isEn ? "windows" : "виндовс") + "\t" });
    const gameNotificationCheckbox = addElement("input", { id: "gameNotificationCheckbox", type: "checkbox" });
    gameNotificationCheckbox.checked = getPlayerBool("gameNotification");
    gameNotificationCheckbox.addEventListener("change", function() { setPlayerValue("gameNotification", this.checked); });

    fieldsMap.push([gameSoundNotificationLable, gameSoundNotificationCheckbox, gameNotificationLable, gameNotificationCheckbox]);
    
    const showGameDurationLable = addElement("label", { for: "showGameDurationCheckbox", innerText: (isEn ? "Show game duration" : "Показывать время боя") + "\t" });
    const showGameDurationCheckbox = addElement("input", { id: "showGameDurationCheckbox", type: "checkbox" });
    showGameDurationCheckbox.checked = getPlayerBool("showGameDuration");
    showGameDurationCheckbox.addEventListener("change", function() { setPlayerValue("showGameDuration", this.checked); });

    const showDrinksQuantityLable = addElement("label", { for: "showDrinksQuantityCheckbox", innerText: (isEn ? "Show tavern drinks" : "Показывать количество напитков в таверне") + "\t" });
    const showDrinksQuantityCheckbox = addElement("input", { id: "showDrinksQuantityCheckbox", type: "checkbox" });
    showDrinksQuantityCheckbox.checked = getPlayerBool("showDrinksQuantity");
    showDrinksQuantityCheckbox.addEventListener("change", function() { setPlayerValue("showDrinksQuantity", this.checked); });

    fieldsMap.push([showGameDurationLable, showGameDurationCheckbox, showDrinksQuantityLable, showDrinksQuantityCheckbox]);

    createPupupPanel(GM_info.script.name, getScriptReferenceHtml() + " " + getSendErrorMailReferenceHtml(), fieldsMap, onScriptOptionToggle);
}
function onScriptOptionToggle(isShown) {
    if(isShown) {
        setTimeout("clearTimeout(Timer)", 0); // Вкл/выкл таймер обновления страницы (взаимодействие со скриптом на странице)
    } else {
        setTimeout("Refresh()", 0);
        applyFilter();
    }
}
function applyFilter() {
    const options = { minBet: parseInt(getPlayerValue("minBet", "-1")), maxBet: parseInt(getPlayerValue("maxBet", "-1")), gameType: parseInt(getPlayerValue("gameType", -1)), minLevel: parseInt(getPlayerValue("minLevel", -1)), maxLevel: parseInt(getPlayerValue("maxLevel", -1)), minTime: parseInt(getPlayerValue("minTime", -1)), maxTime: parseInt(getPlayerValue("maxTime", -1)) };
    //console.log(options);
    let currentTavern;
    const bets = Array.from(document.querySelectorAll("table[class='wb'] > tbody > tr")).filter(x => x.querySelector("img[src*='gold.png']")).map(x => {
        if(x.cells.length == 6) {
            if(!x.cells[0].hasAttribute("location")) {
                x.cells[0].setAttribute("location", x.cells[0].innerHTML);
            }
            currentTavern = x.cells[0].getAttribute("location");
            const locationName = isEn ? currentTavern : locations[currentTavern];
            x.cells[0].innerHTML = `${locationName}<br><span title="${isEn ? "Tower height" : "Высота башни"}">${areas[currentTavern].tower}</span> / <span title="${isEn ? "Resources" : "Ресурсов"}">${areas[currentTavern].resources}</span>`;
        }
        const bet = {
            tavern: currentTavern,
            level: parseInt(x.querySelector("a[href^='pl_info.php']").parentNode.querySelector("i").innerText.replace("(", "").replace(")", "")),
            gameType: x.querySelector("img[src*='1koloda']") ? 1 : 8,
            time: parseInt((new RegExp(`(\\d+) ${isEn ? "sec" : "сек"}.`)).exec(x.innerHTML)[1]),
            betValue: parseInt(x.querySelector("img[src*='gold.png']").parentNode.nextElementSibling.innerText.replace(",", "")),
            mayEnter: x.querySelector("a[href^='join_to_card_game.php']") ? true : false
        };
        bet.enabled = bet.mayEnter
            && (options.gameType == -1 || options.gameType == bet.gameType)
            && (options.minLevel == -1 || options.minLevel <= bet.level)
            && (options.maxLevel == -1 || options.maxLevel >= bet.level)
            && (options.minTime == -1 || options.minTime <= bet.time)
            && (options.maxTime == -1 || options.maxTime >= bet.time)
            && (options.minBet == -1 || options.minBet <= bet.betValue)
            && (options.maxBet == -1 || options.maxBet >= bet.betValue);
        x.style.display = getPlayerBool(`show${bet.tavern}`, true) ? "" : "none";
        x.style.backgroundColor = bet.enabled ? "green" : "gray";
        if(bet.mayEnter) {
            x.querySelector("a[href^='join_to_card_game.php']").style.pointerEvents = bet.enabled ? "" : "none";
        }
        //console.log(bet);
        return bet;
    });
}
async function processFreeHpDrink() {
    let todayDrinkQuantity = JSON.parse(getPlayerValue("todayDrinkQuantity", "{}"));
    const healthRestoreTime = healthTimer();
    if(location.pathname == "/tavern.php" || healthRestoreTime > 0 && (Date.now() - (todayDrinkQuantity.date || 0)) > 15 * 60 * 1000) {
        const doc = location.pathname == "/tavern.php" ? document : await getRequest("/tavern.php");
        //<td align="center" width="100%">Таверна угощает - эликсир восстановления! Сегодня доступно <b>1</b> из <b>2</b>.<br><a href="/tavern.php?action=free_hp_drink"><b>Выпить</b></a></td>
        const free_hp_drinkRef = doc.querySelector("a[href='/tavern.php?action=free_hp_drink']");
        if(free_hp_drinkRef) {
            const free_hp_drinkCell = free_hp_drinkRef.closest("td");
            const drinkQuantityExec = new RegExp(`<b>(\\d+)</b>.+<b>(\\d+)</b>`).exec(free_hp_drinkCell.innerHTML);//            console.log(drinkQuantityExec);
            if(drinkQuantityExec) {
                const remains = parseInt(drinkQuantityExec[1]);
                const total = parseInt(drinkQuantityExec[2]);
                todayDrinkQuantity = { date: Date.now(), remains: remains, total: total };
                setPlayerValue("todayDrinkQuantity", JSON.stringify(todayDrinkQuantity));
                console.log(todayDrinkQuantity);
            }
            if(location.pathname == "/tavern.php") {
                free_hp_drinkRef.addEventListener("click", function() {
                    const todayDrinkQuantity = JSON.parse(getPlayerValue("todayDrinkQuantity"));
                    if(todayDrinkQuantity.remains > 0) {
                        todayDrinkQuantity.remains--;
                        setPlayerValue("todayDrinkQuantity", JSON.stringify(todayDrinkQuantity));
                    }
                });
            }
        } else if(healthRestoreTime > 0) {
            setPlayerValue("todayDrinkQuantity", JSON.stringify({ date: Date.now(), remains: 0, total: 0 }));
        }
    }
}
function dateOnly(timeStamp) { const date = new Date(timeStamp); date.setHours(0, 0, 0, 0); return date.getTime(); }
function healthTimer() {
    if(isHeartOnPage) {
        const health_amount = document.getElementById("health_amount");
        const heart_js_mobile_click = document.getElementById("heart_js_mobile_click");
        let heart; // 78 %
        let maxHeart; // 100 %
        let timeHeart; // 405 сек.
        
        if(heart_js_mobile_click) {
            //var hwm_heart=19;var hwm_max_heart=100;var hwm_time_heart=360;
            heart = win.hwm_heart;
            maxHeart = win.hwm_max_heart;
            timeHeart = win.hwm_time_heart;
        } else if(health_amount) {
            const res = /top_line_draw_canvas_heart\((\d+), (\d+), ([\d\.]+)\);/.exec(document.body.innerHTML); // top_line_draw_canvas_heart(0, 100, 405.5);
            if(res) {
                heart = parseInt(res[1]);
                maxHeart = parseInt(res[2]);
                timeHeart = parseFloat(res[3]);
            }
        } else {
            heart = win.heart;
            maxHeart = win.max_heart;
            timeHeart = win.time_heart;
        }
        //console.log(`healthTimer heart: ${heart}, maxHeart: ${maxHeart}, timeHeart: ${timeHeart}`);
        let restSeconds = timeHeart * (maxHeart - heart) / maxHeart;
        return restSeconds;
    }
}
function getGamblersGuildLevel() {
    if(location.pathname == "/home.php") {
        const gamblersGuildName = isEn ? 'Gamblers\' guild' : 'Гильдия Картежников';
        const enchantersText = isEn ? 'Enchanters' : 'Оружейников';
        if(isNewPersonPage) {
            const homeContainerBlocks = Array.from(document.querySelectorAll("div#set_mobile_max_width > div > div.home_container_block"));
            if(homeContainerBlocks) {
                const guildsDiv = homeContainerBlocks.find(x => x.innerHTML.includes(enchantersText));
                Array.from(guildsDiv.querySelectorAll("div[id=row]")).find(x => {
                    const guildName = x.querySelector("span.home_guild_text").innerText;
                    if(gamblersGuildName.includes(guildName)) {
                        setPlayerValue("gamblersGuildLevel", parseInt(x.querySelector("div#bartext span").innerText));
                        return true;
                    }
                    return false;
                });
            }
        } else {
            const skillInfoCell = Array.from(document.querySelectorAll("td:not(:has(td))")).find(x => (x.innerHTML.includes(isEn ? 'Knight' : 'Рыцарь') || x.innerHTML.includes('Кавалер')) && x.innerHTML.includes(enchantersText));
            if(skillInfoCell) {
                const guildRegex = new RegExp(`&nbsp;&nbsp;${gamblersGuildName}: (\\d{1,2}) \\(`, "g");
                if(guildRegex) {
                    setPlayerValue("gamblersGuildLevel", parseInt(guildRegex.exec(skillInfoCell.innerHTML)[1]));
                }
            }
        }
    }
}
// API
function getURL(url) { window.location.href = url; }
function createDataList(inputElement, dataListId, buttonsClass) {
    const datalist = addElement("datalist", { id: dataListId });
    const valuesData = getValue("DataList" + dataListId);
    let values = [];
    if(valuesData) {
        values = valuesData.split(",");
    }
    for(const value of values) {
        addElement("option", { value: value }, datalist);
    }
    inputElement.parentNode.insertBefore(datalist, inputElement.nextSibling);
    inputElement.setAttribute("list", dataListId);

    const clearListButton = addElement("input", { type: "button", value: "x", title: LocalizedString.ClearList, class: buttonsClass, style: "min-width: 20px; width: 20px; text-align: center; padding: 2px 2px 2px 2px;" });
    clearListButton.addEventListener("click", function() { if(window.confirm(LocalizedString.ClearList)) { deleteValue("DataList" + dataListId); datalist.innerHTML = ""; } }, false);
    inputElement.parentNode.insertBefore(clearListButton, datalist.nextSibling);

    return datalist;
}
function showCurrentNotification(html) {
    //GM_setValue("CurrentNotification", `{"Type":"1","Message":"The next-sibling combinator is made of the code point that separates two compound selectors. The elements represented by the two compound selectors share the same parent in the document tree and the element represented by the first compound selector immediately precedes the element represented by the second one. Non-element nodes (e.g. text between elements) are ignored when considering the adjacency of elements."}`);
    if(!isHeartOnPage) {
        return;
    }
    let currentNotificationHolder = document.querySelector("div#currentNotificationHolder");
    let currentNotificationContent = document.querySelector("div#currentNotificationContent");
    if(!currentNotificationHolder) {
        currentNotificationHolder = addElement("div", { id: "currentNotificationHolder", style: "display: flex; position: fixed; transition-duration: 0.8s; left: 50%; transform: translateX(-50%); bottom: -300px; width: 200px; border: 2px solid #000000; background-image: linear-gradient(to bottom, #EAE0C8 0%, #DBD1B9 100%); font: 10pt sans-serif;" }, document.body);
        currentNotificationContent = addElement("div", { id: "currentNotificationContent", style: "text-align: center;" }, currentNotificationHolder);
        const divClose = addElement("div", { title: isEn ? "Close" : "Закрыть", innerText: "x", style: "border: 1px solid #abc; flex-basis: 15px; height: 15px; text-align: center; cursor: pointer;" }, currentNotificationHolder);
        divClose.addEventListener("click", function() {
            const rect = currentNotificationHolder.getBoundingClientRect();
            currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
        });
    }
    currentNotificationContent.innerHTML = html;
    const rect = currentNotificationHolder.getBoundingClientRect();
    currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
    currentNotificationHolder.style.bottom = "0";
    setTimeout(function() { currentNotificationHolder.style.bottom = `${-rect.height-1}px`; }, 3000);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Array and object
function groupBy(list, keyFieldOrSelector) { return list.reduce(function(t, item) { const keyValue = typeof keyFieldOrSelector === 'function' ? keyFieldOrSelector(item) : item[keyFieldOrSelector]; (t[keyValue] = t[keyValue] || []).push(item); return t; }, {}); };
function getKeyByValue(object, value) { return Object.keys(object).find(key => object[key] === value); }
function findKey(obj, selector) { return Object.keys(obj).find(selector); }
function pushNew(array, newValue) { if(array.indexOf(newValue) == -1) { array.push(newValue); } }
function sortBy(field, reverse, evaluator) {
    const key = evaluator ? function(x) { return evaluator(x[field]); } : function(x) { return x[field]; };
    return function(a, b) { return a = key(a), b = key(b), (reverse ? -1 : 1) * ((a > b) - (b > a)); }
}
// HttpRequests
function getRequest(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: data,
            onload: function(response) { resolve(response); },
            onerror: function(error) { reject(error); }
        });
    });
}
function fetch({ url, method = 'GET', type = 'document', body = null }) {
    return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.responseType = type;

          xhr.onload = () => {
            if (xhr.status === 200) return resolve(xhr.response);
            throwError(`Error with status ${xhr.status}`);
          };

          xhr.onerror = () => throwError(`HTTP error with status ${xhr.status}`);

          xhr.send(body);

          function throwError(msg) {
            const err = new Error(msg);
            err.status = xhr.status;
            reject(err);
          }
    });
}
// Storage
function getValue(key, defaultValue) { return GM_getValue(key, defaultValue); };
function setValue(key, value) { GM_setValue(key, value); };
function deleteValue(key) { return GM_deleteValue(key); };
function getPlayerValue(key, defaultValue) { return getValue(`${key}${PlayerId}`, defaultValue); };
function setPlayerValue(key, value) { setValue(`${key}${PlayerId}`, value); };
function deletePlayerValue(key) { return deleteValue(`${key}${PlayerId}`); };
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    //console.log(`valueName: ${valueName}, value: ${value}, ${typeof(value)}`)
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function setOrDeleteNumberValue(key, value) {
    if(!value || value == "" || isNaN(Number(value))) {
        deleteValue(key);
    } else {
        setValue(key, value);
    }
}
function setOrDeleteNumberPlayerValue(key, value) { setOrDeleteNumberValue(key + PlayerId, value); }
function getStorageKeys(filter) { return listValues().filter(filter); }
// Html DOM
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function addStyle(css) { addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function getNearestAncestorSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextSibling) {
            return parentNode.nextSibling;
        }
    }
}
function getNearestAncestorElementSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextElementSibling) {
            return parentNode.nextElementSibling;
        }
    }
}
function nextSequential(node) { return node.firstChild || node.nextSibling || getNearestAncestorSibling(node); }
function nextSequentialElement(element) { return element.firstElementChild || element.nextElementSibling || getNearestAncestorElementSibling(element); }
function getSequentialsUntil(firstElement, lastElementTagName) {
    let currentElement = firstElement;
    const resultElements = [currentElement];
    while((currentElement = nextSequential(currentElement)) && currentElement.nodeName.toLowerCase() != lastElementTagName.toLowerCase()) {
        resultElements.push(currentElement);
    }
    if(currentElement) {
        resultElements.push(currentElement);
    }
    return resultElements;
}
function findChildrenTextContainsValue(selector, value) { return Array.from(document.querySelectorAll(selector)).reduce((t, x) => { const match = Array.from(x.childNodes).filter(y => y.nodeName == "#text" && y.textContent.includes(value)); return [...t, ...match]; }, []); }
// Popup panel
function createPupupPanel(panelName, panelTitle, fieldsMap, panelToggleHandler) {
    const backgroundPopupPanel = addElement("div", { id: panelName, style: "position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); z-index: 200;" }, document.body);
    backgroundPopupPanel.addEventListener("click", function(e) { if(e.target == this) { hidePupupPanel(panelName, panelToggleHandler); }});
    const topStyle = isMobileDevice ? "" : "top: 50%; transform: translateY(-50%);";
    const contentDiv = addElement("div", { style: `${topStyle} padding: 5px; display: flex; flex-wrap: wrap; position: relative; margin: auto; padding: 0; width: fit-content; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); border: 1mm ridge rgb(211, 220, 50);` }, backgroundPopupPanel);
    if(panelTitle) {
        addElement("b", { innerHTML: panelTitle, style: "text-align: center; margin: auto; width: 90%; display: block;" }, contentDiv);
    }
    const divClose = addElement("span", { id: panelName + "close", title: isEn ? "Close" : "Закрыть", innerHTML: "&times;", style: "cursor: pointer; font-size: 20px; font-weight: bold;" }, contentDiv);
    divClose.addEventListener("click", function() { hidePupupPanel(panelName, panelToggleHandler); });

    addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);

    if(fieldsMap) {
        let contentTable = addElement("table", { style: "flex-basis: 100%; width: min-content;"}, contentDiv);
        for(const rowData of fieldsMap) {
            if(rowData.length == 0) { // Спомощью передачи пустой стороки-массива, указываем, что надо начать новую таблицу после брейка
                addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);
                contentTable = addElement("table", undefined, contentDiv);
                continue;
            }
            const row = addElement("tr", undefined, contentTable);
            for(const cellData of rowData) {
                const cell = addElement("td", undefined, row);
                if(cellData) {
                    if(typeof(cellData) == "string") {
                        cell.innerText = cellData;
                    } else {
                        cell.appendChild(cellData);
                    }
                }
            }
        }
    }
    if(panelToggleHandler) {
        panelToggleHandler(true);
    }
    return contentDiv;
}
function showPupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    if(backgroundPopupPanel) {
        backgroundPopupPanel.style.display = '';
        if(panelToggleHandler) {
            panelToggleHandler(true);
        }
        return true;
    }
    return false;
}
function hidePupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    backgroundPopupPanel.style.display = 'none';
    if(panelToggleHandler) {
        panelToggleHandler(false);
    }
}
// Script autor and url
function getScriptLastAuthor() {
    let authors = GM_info.script.author;
    if(!authors) {
        const authorsMatch = GM_info.scriptMetaStr.match(/@author(.+)\n/);
        authors = authorsMatch ? authorsMatch[1] : "";
    }
    const authorsArr = authors.split(",").map(x => x.trim()).filter(x => x);
    return authorsArr[authorsArr.length - 1];
}
function getDownloadUrl() {
    let result = GM_info.script.downloadURL;
    if(!result) {
        const downloadURLMatch = GM_info.scriptMetaStr.match(/@downloadURL(.+)\n/);
        result = downloadURLMatch ? downloadURLMatch[1] : "";
        result = result.trim();
    }
    return result;
}
function getScriptReferenceHtml() { return `<a href="${getDownloadUrl()}" title="${isEn ? "Check for update" : "Проверить обновление скрипта"}" target=_blanc>${GM_info.script.name} ${GM_info.script.version}</a>`; }
function getSendErrorMailReferenceHtml() { return `<a href="sms-create.php?mailto=${getScriptLastAuthor()}&subject=${isEn ? "Error in" : "Ошибка в"} ${GM_info.script.name} ${GM_info.script.version} (${GM_info.scriptHandler} ${GM_info.version})" target=_blanc>${isEn ? "Bug report" : "Сообщить об ошибке"}</a>`; }
// Server time
function getServerTime() { return Date.now() - parseInt(getValue("ClientServerTimeDifference", 0)); }
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время // Это та дата, которая в toUTCString покажет время по москве
function toServerTime(clientTime) { return clientTime -  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function toClientTime(serverTime) { return serverTime +  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function truncToFiveMinutes(time) { return Math.floor(time / 300000) * 300000; }
function today() { const now = new Date(getServerTime()); now.setHours(0, 0, 0, 0); return now; }
function tomorrow() { const today1 = today(); today1.setDate(today1.getDate() + 1); return today1; }
async function requestServerTime() {
    if(parseInt(getValue("LastClientServerTimeDifferenceRequestDate", 0)) + 6 * 60 * 60 * 1000 < Date.now()) {
        setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
        const responseText = await getRequestText("/time.php");
        const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
        if(responseParcing) {
            setValue("ClientServerTimeDifference", Date.now() - parseInt(responseParcing[1]) * 1000);
        }
    } else {
        setTimeout(requestServerTime, 60 * 60 * 1000);
    }
}
// dateString - игровое время, взятое со страниц игры. Оно всегда московское // Как результат возвращаем серверную дату
function parseDate(dateString, isFuture = false, isPast = false) {
    //console.log(dateString)
    if(!dateString) {
        return;
    }
    const dateStrings = dateString.split(" ");

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const gameDate = getGameDate();
    let year = gameDate.getUTCFullYear();
    let month = gameDate.getUTCMonth();
    let day = gameDate.getUTCDate();
    const timePart = dateStrings.find(x => x.includes(":"));
    if(timePart) {
        var time = timePart.split(":");
        hours = parseInt(time[0]);
        minutes = parseInt(time[1]);
        if(time.length > 2) {
            seconds = parseInt(time[2]);
        }
        if(dateStrings.length == 1) {
            let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            if(isPast && result > gameDate) {
                result.setUTCDate(result.getUTCDate() - 1);
            }
            if(isFuture && result < gameDate) {
                result.setUTCDate(result.getUTCDate() + 1);
            }
            //console.log(`result: ${result}, gameDate: ${gameDate}`)
            result.setUTCHours(result.getUTCHours() - 3);
            return result;
        }
    }

    const datePart = dateStrings.find(x => x.includes("-"));
    if(datePart) {
        const date = datePart.split("-");
        month = parseInt(date[isEn ? (date.length == 3 ? 1 : 0) : 1]) - 1;
        day = parseInt(date[isEn ? (date.length == 3 ? 2 : 1) : 0]);
        if(date.length == 3) {
            const yearText = isEn ? date[0] : date[2];
            year = parseInt(yearText);
            if(yearText.length < 4) {
                year += Math.floor(gameDate.getUTCFullYear() / 1000) * 1000;
            }
        } else {
            if(isFuture && month == 0 && gameDate.getUTCMonth() == 11) {
                year += 1;
            }
        }
    }
    if(dateStrings.length > 2) {
        const letterDateExec = /(\d{2}):(\d{2}) (\d{2}) (.{3,4})/.exec(dateString);
        if(letterDateExec) {
            //console.log(letterDateExec)
            day = parseInt(letterDateExec[3]);
            //const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthShortNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
            month = monthShortNames.findIndex(x => x.toLowerCase() == letterDateExec[4].toLowerCase());
            if(isPast && Date.UTC(year, month, day, hours, minutes, seconds) > gameDate.getTime()) {
                year -= 1;
            }
        }
    }
    //console.log(`year: ${year}, month: ${month}, day: ${day}, time[0]: ${time[0]}, time[1]: ${time[1]}, ${new Date(year, month, day, parseInt(time[0]), parseInt(time[1]))}`);
    let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    result.setUTCHours(result.getUTCHours() - 3);
    return result;
}
// Misc
async function initUserName() {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        //console.log(document.querySelector("h1").innerText)
        setPlayerValue("UserName", document.querySelector("h1").innerText);
    }
    if(location.pathname == "/home.php") {
        //console.log(document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText)
        const userNameRef = document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`);
        if(userNameRef) {
            setPlayerValue("UserName", userNameRef.innerText);
        }
    }
    if(!getPlayerValue("UserName")) {
        const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
        setPlayerValue("UserName", doc.querySelector("h1").innerText);
    }
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function showBigData(data) { console.log(data); /*addElement("TEXTAREA", { innerText: data }, document.body);*/ }
function round0(value) { return Math.round(value * 10) / 10; }
function round00(value) { return Math.round(value * 100) / 100; }
function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
// MutationObserver
function observe(targets, handler, config = { childList: true, subtree: true }) {
    targets = Array.isArray(targets) ? targets : [targets];
    targets = targets.map(x => { if(typeof x === 'function') { return x(document); } return x; }); // Можем передавать не элементы, а их селекторы
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        for(const target of targets) {
            if(target) {
                observer.observe(target, config);
            }
        }
    });
    for(const target of targets) {
        if(target) {
            ob.observe(target, config);
        }
    }
}
// UpdatePanels
// Если используется url, то это должна быть та же локация с другими параметрами
async function refreshUpdatePanels(panelSelectors, postProcessor, url = location.href) {
    panelSelectors = Array.isArray(panelSelectors) ? panelSelectors : [panelSelectors];
    let freshDocument;
    for(const panelSelector of panelSelectors) {
        const updatePanel = panelSelector(document);
        //console.log(panelSelector.toString())
        //console.log(updatePanel)
        if(updatePanel) {
            freshDocument = freshDocument || await getRequest(url);
            const freshUpdatePanel = panelSelector(freshDocument);
            if(!freshUpdatePanel) {
                console.log(updatePanel)
                continue;
            }
            if(postProcessor) {
                postProcessor(freshUpdatePanel);
            }
            updatePanel.innerHTML = freshUpdatePanel.innerHTML;
            Array.from(updatePanel.querySelectorAll("script")).forEach(x => {
                x.insertAdjacentElement("afterend", addElement("script", { innerHTML: x.innerHTML })); // Передобавляем скрипты, как элементы, что они сработали
                x.remove();
            });
        }
    }
    if(typeof win.hwm_hints_init === 'function') win.hwm_hints_init();
    return freshDocument;
}
