// ==UserScript==
// @name         EventHelper
// @namespace    https://greasyfork.org/ru/scripts/399402-eventhelper
// @version      5.24
// @description  test
// @author       achepta
// @connect daily.heroeswm.ru
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/(leader_rogues|pirate_event|tj_single|hunting_event|leader_winter|pl_warlog|leader_guild|ambush_single_event)\.php.*/
// @grant unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/428171/EventHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/428171/EventHelper.meta.js
// ==/UserScript==


//TODO
// 1. Fit troops
// 2. Check if LeG lvl < 9
// 3. Show previous wave
// 4. Multilang support
(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

    let header;
    let body;
    let currentLevel;
    let pl_id = getCookie("pl_id");
    let host = location.host;
    let battleCount = 0;
    let pageCount = 0;
    let maxPages = 50;
    let loadStarted = false;
    let currentHeroFaction;
    let currentHeroClass;
    let heroCreatures = {};
    let selectedCellData;
    let lg_lvl = getLgLvl();

    let allClasses = [
        [1, 'Рыцарь', 0, 'r1.png'],
        [1, 'Рыцарь света', 1, 'r101.png'],
        [2, 'Некромант', 0, 'r2.png'],
        [2, 'Некромант - повелитель смерти', 1, 'r102.png'],
        [3, 'Маг', 0, 'r3.png'],
        [3, 'Маг - разрушитель', 1, 'r103.png'],
        [4, 'Эльф', 0, 'r4.png'],
        [4, 'Эльф - заклинатель', 1, 'r104.png'],
        [5, 'Варвар', 0, 'r5.png'],
        [5, 'Варвар крови', 1, 'r105.png'],
        [5, 'Варвар - шаман', 2, 'r205.png'],
        [6, 'Темный эльф', 0, 'r6.png'],
        [6, 'Темный эльф - укротитель', 1, 'r106.png'],
        [7, 'Демон', 0, 'r7.png'],
        [7, 'Демон тьмы', 1, 'r107.png'],
        [8, 'Гном', 0, 'r8.png'],
        [8, 'Гном огня', 1, 'r108.png'],
        [9, 'Степной варвар', 0, 'r9.png'],
        [10, 'Фараон', 0, 'r10.png']
    ];

    let allFactions = [
        [-1, 'All', ''],
        [1, 'Рыцарь', 'r1.png'],
        [2, 'Некромант', 'r2.png'],
        [3, 'Маг', 'r3.png'],
        [4, 'Эльф', 'r4.png'],
        [5, 'Варвар', 'r5.png'],
        [6, 'Темный эльф', 'r6.png'],
        [7, 'Демон', 'r7.png'],
        [8, 'Гном', 'r8.png'],
        [9, 'Степной варвар', 'r9.png'],
        [10, 'Фараон', 'r10.png'],
        [0, 'Нейтрал', 'r_neut.png']
    ]


    doGet(`https://${host}/home.php`, doc => {
        set("hero_combat_lvl", doc.body.innerText.match(/(Боевой уровень|Combat level): (\d{1,2})/)
            ? doc.body.innerText.match(/(Боевой уровень|Combat level): (\d{1,2})/)[2]
            : doc.body.innerText.match(/(Боевой уровень|Combat level)\n\t\t\t\t(\d{1,2})/)[2]);
        set("hero_leader_lvl", Math.min((doc.body.innerText.match(/(Гильдия Лидеров|Leaders' Guild): (\d{1,2})/)
            ? doc.body.innerText.match(/(Гильдия Лидеров|Leaders' Guild): (\d{1,2})/)[2]
            : doc.body.innerText.match(/(Лидеров|Leaders')(\d{1,2})/)[2]) - 0, 10).toString());
        lg_lvl = getLgLvl()
    })

    function getLgLvl() {
        return location.href.includes("leader_guild")
            ? Math.min(get('hero_leader_lvl', "10") - 0, 10)
            : Math.max(Math.min(get('hero_leader_lvl', "10") - 0, 10), 9)
    }

    /* PIRATE REGION */
    if (/pirate_event/.test(location.href)) {
        let trs = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > table > tbody").childNodes;

        let items = [];
        for (let i = 0; i < trs.length; i++) {
            if (i > 0) {
                let item_info = {};

                item_info.name = trs[i].querySelector("td:nth-child(1) > img").title;
                item_info.weight = trs[i].querySelector("td:nth-child(2)").innerText - 0;
                item_info.buy_price = trs[i].querySelector("td:nth-child(3) > table > tbody > tr > td:nth-child(3)").innerText.replace(/,/g, "") - 0;
                item_info.sell_price = trs[i].querySelector("td:nth-child(4) > table > tbody > tr > td:nth-child(2)").innerText.replace(/,/g, "") - 0;
                item_info.buy_form = trs[i].querySelector("td:nth-child(5)").innerHTML;
                item_info.opt_price = (item_info.sell_price - item_info.buy_price) / item_info.weight;
                console.log(item_info.weight + " " + item_info.buy_price + " " + item_info.sell_price + " " + item_info.opt_price);
                if (item_info.buy_form.toString().length > 100) {
                    items.push(item_info)
                }
            }
        }
        items = sortByKey(items, "opt_price").reverse();
        let template = createTemplateForPirateEvent(items);
        let target_td = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(3)");
        target_td.removeChild(target_td.childNodes[0]);
        target_td.insertAdjacentHTML("beforeend", template);
    }

    function createTemplateForPirateEvent(items) {
        let final_str = `
            <table width="100%" class="wbwhite" cellpadding="2">
                <tr>
                    <td class="wbwhite">Название</td>
                    <td class="wbwhite">Лучшая прибыль</td>
                    <td class="wbwhite">Купить</td>
                </tr>`;
        items.forEach(item => {
            final_str += `
                <tr>
                    <td class="wbwhite">${item.name}</td>
                    <td class="wbwhite">${item.opt_price.toFixed(2)}</td>
                    <td class="wbwhite">${item.buy_form.toString()}</td>
                </tr>`;
        })

        return final_str + `</table>`;
    }

    /* END PIRATE REGION */


    /* LEADER  REGION */
    if (/(leader_rogues|leader_winter)/.test(location.href)) {
        if (document.body.innerHTML.includes("leader_rogues.php?action=cancel_merc")) {
            addFilteringArea()
            processFilters()
            return
        }
        if (location.href.includes("?show_2x2_form=1") || location.href.includes("?show_merc_dialog=1")) {
            return
        }

        setLoading()
        getResources(getWaveInfo, createLeaderTemplate)
    }


    if (/(leader_guild)/.test(location.href)) {
        setLoading()
        getResources(getTodayBandits, createBanditsTemplate)
    }

    async function getResources(getExamples, showExamples) {
        await Promise.all([getHeroCreatures(), getExamples()]).then(() => {
            setExampleBattles(showExamples())
        })
    }

    function setLoading() {
        document
            .querySelector("body")
            .insertAdjacentHTML("beforeend", `
                <div style="display: flex; justify-content: center;"  id="loading" >
                    <img style="margin-top: 20px" src="https://pa1.narvii.com/6688/155054f4fa7490e4ebb3928c3a6385f0686d7e09_hq.gif" width="400" alt="">
                </div>`)
    }

    function addFilteringArea() {
        document.querySelector("#Global > div.TextBlock.TextBlockMIDDLE > div > div").insertAdjacentHTML("afterbegin",
            getFilteringAreaTemplate())
        setBlockedWavesListener()
        setBlockedHeroesListener()
        setBlockedLeadershipListener()
    }

    function setBlockedWavesListener() {
        $('save-blocked-waves').addEventListener('click', () => {
            set("blocked_waves", "[" + $('waves-list').value + "]")
        })
    }

    function setBlockedHeroesListener() {
        $('save-blocked-heroes').addEventListener('click', () => {
            set("blocked_heroes", "[" + $('heroes-list').value + "]")
        })
    }

    function setBlockedLeadershipListener() {
        $('save-blocked-leadership').addEventListener('click', () => {
            set("blocked_leadership", $('blocked-leadership').value)
        })
    }

    function processFilters() {
        if (document.querySelector("#Global > div.TextBlock.TextBlockMIDDLE > div > div > table > tbody")) {
            let trs = Array.from(document.querySelector("#Global > div.TextBlock.TextBlockMIDDLE > div > div > table > tbody").childNodes)
            processBlockedWaves(trs)
            processBlockedHeroes(trs)
            processBlockedLeadership(trs)
        }
    }

    function processBlockedWaves(trs) {
        let blockedWaves = get("blocked_waves", [])
        trs.forEach(tr => {
            let waveId = tr.textContent.match(/(Ур\.: |Lv\.: )(\d{1,3})/)[2]
            if (blockedWaves.includes(waveId - 0)) {
                removeElement(tr)
            }
        })
    }

    function processBlockedHeroes(trs) {
        let blockedHeroes = get("blocked_heroes", [])
        trs.forEach(tr => {
            let heroName = tr.textContent.match(/([А-Яа-яёЁa-zA-Z0-9_* ()-]+) \[\d{1,2}]/)[1]
            if (blockedHeroes.includes(heroName)) {
                removeElement(tr)
            }
        })
    }

    function processBlockedLeadership(trs) {
        let blockedLeadership = get("blocked_leadership", "0")
        trs.forEach(tr => {
            let leadership = tr.textContent.match(/\d{1,2},\d{3}/)[0].replaceAll(",", "")
            if (blockedLeadership - 0 > leadership - 0) {
                removeElement(tr)
            }
        })
    }

    function getHeroCreatures() {
        return new Promise(((resolve, reject) => {
            doGet(`https://${host}/leader_army.php`, doc => {
                processLeaderArmyResponse(doc)
                resolve()
            })
        }))
    }

    function processLeaderArmyResponse(doc) {
        let bodyHTML = doc
            .body
            .innerHTML
            .toString()

        let matchesId = findAll(/obj\[\d{1,3}]\['monster_id'] = '([a-z_-]+)'/g, bodyHTML)
        let matchesCount = findAll(/obj\[\d{1,3}]\['count'] = (\d+)/g, bodyHTML)
        let matchesCost = findAll(/obj\[\d{1,3}]\['cost'] = (\d+)/g, bodyHTML)
        let matchesName = findAll(/obj\[\d{1,3}]\['name'] = '([А-Яа-яёЁa-zA-Z`_ -]+)'/g, bodyHTML)
        let matchesPortrait = findAll(/obj\[\d{1,3}]\['lname'] = '([a-z_-]+)'/g, bodyHTML)
        let matchesVersion = findAll(/obj\[\d{1,3}]\['version'] = '(\d{1,3})'/g, bodyHTML)
        let matchesRarity = findAll(/obj\[\d{1,3}]\['rarity'] = (\d{1,3})/g, bodyHTML)
        let matchesRace = findAll(/obj\[\d{1,3}]\['race'] = (\d{1,3})/g, bodyHTML)

        matchesId.forEach((id, index) => {
            heroCreatures[id[1]] = {
                'count': matchesCount[index][1],
                'cost': matchesCost[index][1],
                'name': matchesName[index][1],
                'portrait': matchesPortrait[index][1],
                'version': matchesVersion[index][1],
                'rarity': matchesRarity[index][1],
                'race': matchesRace[index][1],
            }
        })
    }

    function getWaveInfo() {
        return new Promise(((resolve, reject) => {
            if (document.getElementsByClassName("CheckpointCurrent")[0]) {
                currentLevel = document.getElementsByClassName("CheckpointCurrent")[0].innerHTML.match(/\d{1,3}/);
            } else {
                currentLevel = "60";
            }
            const dailyEventByWaveId = "https://daily.heroeswm.ru/wartab/r/4/w/";

            doGet(dailyEventByWaveId + currentLevel, doc => {
                if (doc.querySelector("#wave" + currentLevel)) {
                    header = createRecordsContainerHeader(doc.querySelector("#wave" + currentLevel).querySelector("div.spoiler-head-1").firstElementChild);
                    body = doc.querySelector("#wave" + currentLevel).querySelector("div.spoiler-body-1");
                }
                if (!header) {
                    header = "no such wave";
                    body = "empty body"
                }
                resolve()
            })
        }))
    }

    function getTodayBandits() {
        return new Promise(((resolve, reject) => {
            const dailyURl = "https://daily.heroeswm.ru/leader/lg_daily.php?gl="
            doGet(dailyURl + lg_lvl, doc => {
                if (doc.querySelector("div.spoiler-head-1")) {
                    header = createRecordsContainerHeader(doc.querySelector("div.spoiler-head-1").firstElementChild);
                    body = doc.querySelector("div.spoiler-body-1");
                }
                if (!header) {
                    header = "no battles";
                    body = "empty body"
                }
                resolve()
            })
        }))
    }

    function createRecordsContainerHeader(table) {
        return `
            <div class="records-container-header">
                <div>${table.querySelector("td:nth-child(2)").innerHTML}</div>
            </div>
        `
    }

    function setExampleBattles(template) {
        removeElement($('loading'))
        document.querySelector("body").insertAdjacentHTML("beforeend",
            createStyle() + template);
        if (body !== "empty body") {
            processBody()
        }
    }

    function processBody() {
        let recordsData = []
        Array.from(body.getElementsByTagName("table")).filter(table => table.innerText.length > 30).forEach((table, tableId) => {
            if (table.innerText.length < 30) {
                return
            }
            recordsData.push(getRecordData(table, tableId))
        })
        processRecords(recordsData)
    }

    function getRecordData(table, tableId) {
        let recordData = {}
        recordData.id = tableId
        recordData.players = getRecordPlayers(table)
        recordData.result = getRecordResult(table)
        recordData.creatures = getRecordCreatures(table)
        return recordData
    }

    function getRecordPlayers(table) {
        return table.getElementsByTagName("tr")[0].children[0].innerHTML
    }

    function getRecordResult(table) {
        return table.getElementsByTagName("tr")[0].children[2].innerHTML
    }

    function getRecordCreatures(table) {
        let creatureTd = table.getElementsByTagName("tr")[0].children[1]
        let creatures = []
        let tempCreatures = []
        Array
            .from(creatureTd.getElementsByClassName('cre_creature'))
            .forEach((cre) => {
                if (cre.innerText === "+") {
                    creatures.push([...tempCreatures])
                    tempCreatures = []
                } else {
                    let creatureData = getCreatureData(cre)
                    if (creatureData) {
                        tempCreatures.push(creatureData)
                    }
                }
            })
        if (tempCreatures.length > 0) {
            creatures.push([...tempCreatures])
        }
        return creatures
    }

    function getCreatureData(creature) {
       try {
           let creatureData = {}
           creatureData.rarity = creature.getElementsByTagName('img')[0].src.match(/fon_lvl(\d)/)[1]
           creatureData.portrait = creature.getElementsByTagName('img')[1].src.match(/portraits\/(\w+)p33/)[1]
           creatureData.id = creature.getElementsByTagName('a')[0].href.split('name=')[1]
           creatureData.amount = creature.getElementsByClassName('cre_amount')[0].innerText
           return creatureData
       } catch (e) {
           return null
       }
    }

    function processRecords(records) {
        processRecordsAsync(records)
    }

    let timeoutId;

    function processRecordsAsync(records, index = 0) {
        if (index === records.length) {
            return
        }
        timeoutId = setTimeout(() => {
            addRecord(records[index])
            window.clearTimeout(timeoutId)
            processRecordsAsync(records, index + 1)
        })
    }

    function addRecord(record) {
        console.log(record.id)

        let playersCreaturesInfo = []
        let playersCreatures = record.creatures.reduce((result, playerCreatures, playerId) => {
            let playerCreaturesHTML = ""
            let playerCheckersHTML = ""
            let rowData = []
            playerCreatures.forEach((creature, cellId) => {
                playerCreaturesHTML += `<div id="creature-${record.id}-${playerId}-${cellId}">${getNewCreatureIcon(creature, creature.amount)}</div>`
                playerCheckersHTML += getReplaceCell(rowData, record.id, playerId, cellId, creature.id, creature.amount)
            })
            playersCreaturesInfo.push(rowData)
            result += `
            <div class="record-player-creatures" id="creatures-${record.id}-${playerId}">
                <div id="creatures-${record.id}-${playerId}-leadership" class="player-leadership"></div>
                <div id="creatures-${record.id}-${playerId}-creatures" class="player-creatures-row">${playerCreaturesHTML}</div>
                <div id="creatures-${record.id}-${playerId}-checkers">${playerCheckersHTML}</div>
                <div id="creatures-${record.id}-${playerId}-apply"></div>
            </div>`
            return result
        }, "")

        let recordContainer = `
        <div class="record-container" id="record-${record.id}">
            <div class="record-number"><div>${record.id + 1}</div></div>
            <div class="record-players" id="record-${record.id}-players"><div>${record.players}</div></div>
            <div class="record-result" id="record-${record.id}-result"><div>${record.result}</div></div>
            <div class="record-players-creatures" id="record-${record.id}-creatures">${playersCreatures}</div>
        </div>
        `
        $('main-data').insertAdjacentHTML("beforeend", recordContainer)

        if (playersCreaturesInfo.reduce((result, current) => result + current.length, 0) > 11) {
            $(`creatures-${record.id}-${0}`).classList.add("extra_margin")
        }

        playersCreaturesInfo.forEach((rowData, playerId) => {
            for (let i in [...Array(rowData.length).keys()]) {
                setReplaceCellListener(rowData, record.id, playerId, i)
            }
            setApplyButton(record.id, playerId, rowData)
            setLeaderShip(record.id, playerId, rowData)
            setApplyArmyListener(record.id, playerId, rowData)
        })
    }

    function isAllPresent(rowData) {
        let isAllPresent = true;
        rowData.forEach(cre => {
            if (!cre[2]) {
                isAllPresent = false
            }
        })
        return isAllPresent
    }

    function getReplaceCell(rowData, recordId, playerId, cellId, creId, creAmount) {
        let checkResult = `<div class="cre_check" id="replace-creature-${recordId}-${playerId}-${cellId}">`
        if (heroCreatures.hasOwnProperty(creId)) {
            if (creAmount - 0 <= heroCreatures[creId]['count'] - 0) {
                rowData.push([creId, creAmount, true])
                checkResult += `<img style="z-index: 3" src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-check-icon.png" alt="">`
            } else {
                rowData.push([creId, creAmount, false])
                checkResult += `<img style="z-index: 3" src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-error-icon.png" alt="" title="Not enough, you have only ${heroCreatures[creId]['count']}">`
            }
        } else {
            rowData.push([creId, creAmount, false])
            checkResult += `<img style="z-index: 3" src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-error-icon.png" alt="" title="Missing">`
        }
        checkResult += `</div>`
        return checkResult
    }

    function setReplaceCellListener(rowData, recordId, playerId, cellId) {
        let replaceCell = $(`replace-creature-${recordId}-${playerId}-${cellId}`)
        replaceCell.addEventListener('click', () => {
            createOverlay()
            setSelectNewCreatureTemplate(rowData, recordId, playerId, cellId)
            replaceCell.style.background = '#608FBF'
            selectedCellData = [recordId, playerId, cellId]
        })
    }

    function setApplyArmyListener(recordId, playerId, rowData) {
        $(`creatures-${recordId}-${playerId}-apply-button`).addEventListener('click', () => {
            sendApplyArmy(rowData)
        })
    }

    function setApplyButton(recordId, playerId, rowData) {
        $(`creatures-${recordId}-${playerId}-apply`).insertAdjacentHTML('afterend', `     
            <div>
                <button id="creatures-${recordId}-${playerId}-apply-button" class="btn-gradient blue" onclick="">${isAllPresent(rowData) ? "Apply" : "Partly apply"}</button>
            </div>
        `)
    }

    function setSelectNewCreatureTemplate(rowData, recordId, playerId, cellId) {
        let replaceCreatureTarget = $(`replace-creature-${recordId}-${playerId}-${cellId}`)
        let newCreatureTemplate = `
            <div id="select-new-creature" style="position: absolute; background: #608FBF; border: 3px solid cyan;  width: 300px; height: 400px; z-index: 4; display: flex; flex-direction: column">
                <div id="select-new-creature-faction" style="display: flex; flex-direction: row; flex-wrap: wrap"></div>
                <div id="new-creatures" style="overflow-y: auto; display: flex; flex-direction: column"></div>
            </div>`
        replaceCreatureTarget.insertAdjacentHTML('afterend', newCreatureTemplate)
        $(`select-new-creature`).style.left = replaceCreatureTarget.offsetLeft.toString()
        fillNewCreatures(-1, rowData, recordId, playerId, cellId)
        allFactions.forEach((faction, index) => {
            $(`select-new-creature-faction`).insertAdjacentHTML('beforeend', getHTMLFactionSelect(faction))
            $(`faction-select${faction[0]}`).addEventListener('click', () => {
                $(`new-creatures`).innerHTML = ''
                fillNewCreatures(faction[0], rowData, recordId, playerId, cellId)
            })
        })
    }

    function fillNewCreatures(constraint, rowData, recordId, playerId, cellId) {

        let remainingLeadership = getRemainingLeadership(rowData, cellId)
        Object
            .entries(heroCreatures)
            .forEach(([key, value], index) => {
                if (!checkExistingInRowData(key, rowData) && (constraint === -1 ? true : value['race'] - 0 === constraint)) {
                    let newAmount = Math.min(Math.floor(Math.min(remainingLeadership, (10 + lg_lvl) * 400) / (value['cost'] - 0)), value['count'] - 0)
                    if (newAmount > 0) {
                        $('new-creatures').insertAdjacentHTML('beforeend', `
                            <div id="new-creature-${index}" style="display: flex; flex-direction: row;">
                                ${getNewCreatureIcon(value, newAmount)}
                                <div style="margin: auto">
                                    <p style="text-decoration: underline; cursor: pointer">${value['name']}</p>
                                </div>
                            </div>`)
                        $(`new-creature-${index}`).addEventListener('click', () => {
                            let replaceTarget = $(`creature-${recordId}-${playerId}-${cellId}`)
                            replaceTarget.innerHTML = getNewCreatureIcon(value, newAmount)
                            $(`replace-creature-${recordId}-${playerId}-${cellId}`).innerHTML = `<img style="z-index: 3" src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/24/sign-check-icon.png" alt="">`
                            rowData[cellId] = [key, newAmount, true]
                            setLeaderShip(recordId, playerId, rowData)
                            removeOverlay()
                        })
                    }
                }
            })
    }

    function getNewCreatureIcon(creatureData, newAmount) {
        return `
        <div class="cre_creature" style="cursor: pointer">
            <img src="https://dcdn.heroeswm.ru/i/army_html/fon_lvl${creatureData['rarity']}.png?v=1" width="60" height="50" class="cre_mon_image2" alt="">
            <img src="https://dcdn.heroeswm.ru/i/portraits/${creatureData['portrait']}p33.png" height="50" alt="" class="cre_mon_image1">
            <img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl1_120x100_woa_right.png?v=1" height="50" class="cre_mon_image2" alt="">
            <div class="cre_amount" id="add_now_count">${newAmount}</div>
        </div>`
    }

    function getHTMLFactionSelect(faction) {
        let factionSelectBody = ``
        if (faction[0] === -1) {
            factionSelectBody = `<b>All</b>`
        } else {
            factionSelectBody = `<img src="https://dcdn.heroeswm.ru/i/f/${faction[2]}" alt="${faction[1]}" title="${faction[1]}" style="width: 30px; height: 30px">`
        }
        return `
        <div id="faction-select${faction[0]}" style="justify-content: center; display: flex; align-items: center; width: 50px; height: 50px; cursor: pointer">
            ${factionSelectBody}
        </div>
        `
    }

    function checkExistingInRowData(name, rowData) {
        let isExist = false
        rowData.forEach(cre => {
            if (name === cre[0]) {
                isExist = true
            }
        })
        return isExist
    }

    function setLeaderShip(recordId, playerId, rowData) {
        let allPresent = isAllPresent(rowData)
        $(`creatures-${recordId}-${playerId}-apply-button`).innerText = allPresent ? "Apply" : "Partly apply"
        $(`creatures-${recordId}-${playerId}-leadership`).innerHTML = `
            <img height="24" src="https://dcdn.heroeswm.ru/i/icons/attr_leadership.png?v=1" alt="" title="Лидерство сборки">
            <span id="leadership-number-${recordId}-${playerId}" style="margin-bottom: 5px; color: ${allPresent ? "green" : "red"}">
                ${getLeadership(rowData)}
            </span>`
    }

    function getLeadership(rowData) {
        return rowData.filter(cre => cre[2]).reduce((leadership, cre) => leadership + (heroCreatures[cre[0]]['cost'] - 0) * (cre[1] - 0), 0)
    }

    function getRemainingLeadership(rowData, cellId) {
        return (10 + lg_lvl) * 1000
            - getLeadership(rowData)
            + (rowData[cellId][1] - 0)
            * (heroCreatures.hasOwnProperty(rowData[cellId][0]) && heroCreatures[rowData[cellId][0]]['count'] >= rowData[cellId][1] - 0
                ? heroCreatures[rowData[cellId][0]]['cost'] - 0
                : 0)
    }

    function sendApplyArmy(rowData) {
        doPost(`https://${host}/leader_army_apply.php`, getApplyArmyForm(rowData), () => {
            location.reload()
        })
    }

    function getApplyArmyForm(rowData) {
        let formData = new FormData()
        formData.append('idx', "0")
        rowData.filter(cre => cre[2]).forEach((creData, index) => {
            formData.append(`countv${index + 1}`, creData[1])
            formData.append(`mon_id${index + 1}`, creData[0])
        })
        return formData
    }

    function createOverlay() {
        let bg = $('bgOverlay');
        if (!bg) {
            bg = `<div id="bgOverlay"></div>`;
            document.body.insertAdjacentHTML('afterbegin', bg);
        } else {
            return
        }
        bg = $('bgOverlay')
        bg.style.position = 'absolute';
        bg.style.left = '0px';
        bg.style.width = '100%';
        bg.style.background = "#000000";
        bg.style.opacity = "0.3";
        bg.style.zIndex = "2";
        bg.style.top = '0px';
        bg.style.height = `${getScrollHeight()}px`;
        $('bgOverlay').addEventListener('click', () => {
            removeOverlay()
        })
    }

    function removeOverlay() {
        removeElement($('select-new-creature'))
        removeElement($('bgOverlay'))
        $(`replace-creature-${selectedCellData[0]}-${selectedCellData[1]}-${selectedCellData[2]}`).style.background = ''
        selectedCellData = [-1, -1]
    }

    if (location.href.includes(`pl_warlog.php?id=${pl_id}`)) {
        document.getElementsByClassName("hwm_pagination global_inside_shadow")[0].insertAdjacentHTML('afterend', `  <button id="copy-battles">Copy battles</button>`)
                document.getElementById('copy-battles').addEventListener('click', () => {
                    let battles = document
                        .body
                        .innerHTML
                        .toString()
                        .match(/warid=\d{10}&amp;show_for_all=L[a-zA-Z0-9]{10}/g)
                        .map(e => e.replaceAll("&amp;", "&"))
                        .join("~")
                    navigator
                        .clipboard
                        .writeText(battles).then(() => {
                        $('copy-battles').innerText = "Copied!"
                    })
                })
    }

    /* END LEADER  REGION */


    if (/tj_single/.test(location.href)) {
        mainTJSolo();
    }

    function mainTJSolo() {
        document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > center")
            .insertAdjacentHTML("beforeend", createStyle() + createTJSoloTemplate());
        $(`statbut`).addEventListener('click', () => {
            processCollectBattles()
        })
    }


    /* HUNT EVENT REGION */
    let huntEventLvL;
    let classCounter = 0;
    let result = ``;
    let isForStat = true;
    if (/hunting_event/.test(location.href)) {
        mainHuntEvent();
        getCurrentFaction();
        huntEventLvL = getHuntEventLvl()
        let huntlvlinfo = localStorage.getItem('huntlvl' + huntEventLvL);
        if (huntlvlinfo) {
            result = huntlvlinfo;
            updateHuntStatBody();
            for (let i = 0; i < allClasses.length; i++) {
                document
                    .getElementById(`fc${allClasses[i][0]}-${allClasses[i][2]}`)
                    .getElementsByTagName("img")[0]
                    .addEventListener("click", () => {
                        isForStat = false
                        changeFactionAndClass(allClasses[i][0], allClasses[i][2]);
                    });
            }
        }
    }

    function getCurrentFaction() {
        doGet(`https://${host}/pl_info.php?id=${pl_id}`, processPlInfoResponse)
    }

    function getHuntEventLvl() {
        let searchParams = new URLSearchParams(window.location.search);
        return searchParams.get("sel_level")
            ? searchParams.get("sel_level")
            : document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > div.Global > div.TextBlock.TextBlockBOTTOM > div > b").innerHTML.toString().match(/\d{1,3}/)[0];
    }

    function mainHuntEvent() {
        document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > div")
            .insertAdjacentHTML("afterend", createStyle() + createHuntTemplate());
        $(`statbut`).addEventListener('click', () => {
            processCollectHunts()
        })
    }

    function processPlInfoResponse(docc) {
        let mainImgs = docc.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > b").getElementsByTagName("img");
        let factionImg = mainImgs[mainImgs.length - 1].src;
        setCurrentFactionAndClass(factionImg)
    }

    function setCurrentFactionAndClass(imgLink) {
        for (let i = 0; i < allClasses.length; i++) {
            if (imgLink.indexOf(allClasses[i][3]) > 0) {
                currentHeroFaction = allClasses[i][0];
                currentHeroClass = allClasses[i][2];
                break;
            }
        }
    }

    function processCollectHunts() {
        result = '';
        getClassHuntData()
    }

    function getClassHuntData() {
        if (classCounter === allClasses.length) {
            classCounter = 0
            document.getElementById("statbut").innerHTML = "Done";
            isForStat = false;
            console.log(currentHeroFaction, currentHeroClass)
            changeFactionAndClass(currentHeroFaction, currentHeroClass);
            document.getElementById("progress").innerHTML = "Текущая фракция - " + getFactionName(currentHeroFaction, currentHeroClass);

            for (let i = 0; i < allClasses.length; i++) {
                document
                    .getElementById(`fc${allClasses[i][0]}-${allClasses[i][2]}`)
                    .getElementsByTagName("img")[0]
                    .addEventListener("click", function () {
                        changeFactionAndClass(allClasses[i][0], allClasses[i][2]);
                    });
            }
            localStorage.setItem('huntlvl' + huntEventLvL, result);
            return;
        }
        document.getElementById("statbut").innerHTML = "Processing...";
        document.getElementById("progress").innerHTML = "Текущая фракция - " + getFactionName(allClasses[classCounter][0], allClasses[classCounter][2]);
        changeFactionAndClass(allClasses[classCounter][0], allClasses[classCounter][2]);
    }

    function processHuntResponse(docc) {
        result +=
            `<div class="faction-hunt-data"><div class="cre_creature" id="fc${allClasses[classCounter][0]}-${allClasses[classCounter][2]}"> <img style="vertical-align: middle" src="https://dcdn.heroeswm.ru/i/f/${allClasses[classCounter][3]}?v=1.1"></div>` +
            Array
                .from(docc.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > div.Global > div.TextBlock.TextBlockBOTTOM > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr")
                    .querySelectorAll("div.cre_creature"))
                .reduce((result, current) => result + current.outerHTML, "")
            + `</div><br>`;
        updateHuntStatBody();
        window.scrollTo(0, document.body.scrollHeight);
        classCounter++;
        getClassHuntData();
    }

    function updateHuntStatBody() {
        document.getElementById("statbody").innerHTML = result;
    }

    /* END HUNT EVENT REGION */


    /* AMBUSH EVENT REGION */
    if (/ambush_single_event/.test(location.href)) {
        doGet(`https://${host}/pl_info.php?id=${pl_id}`, processPlInfoTroopsResponse)
    }

    function processPlInfoTroopsResponse(docc) {
        let creaturesData = []
        Array.from(docc.getElementsByClassName("cre_creature72")).forEach(creature => {
            let creatureInfo = {"rarity": "1"}
            if (creature.getElementsByTagName('img')[0].src.includes("empty")) {
                return
            }
            creatureInfo.portrait = creature.getElementsByTagName('img')[0].src.match(/portraits\/(\w+)_?anip40/)[1] + "ani"
            creatureInfo.amount = creature.getElementsByClassName('cre_amount72')[0].innerText
            creaturesData.push(creatureInfo)
        })
        showAmbushCreatures(creaturesData)
    }

    function showAmbushCreatures(creaturesData) {
        let creaturesMultiplier = document.querySelector(" div.TextBlock.TextBlockTOP > div > table > tbody > tr:nth-child(3) > td:nth-child(8) > b").innerText
        creaturesMultiplier = creaturesMultiplier.match(/\d{1,3}/)[0]-0
        document.body.insertAdjacentHTML("beforeend", createStyle() + `<center>
        <div id="ambush-creatures">
            <div>Current amounts</div><div id="current-ambush-creatures"></div><br>
            <div>current +<input type="text" id="your-creatures-multiplier" style="width: 30px;" value="1">%</div><div id="future-ambush-creatures"></div><br>
        </div></center>`)
        creaturesData.forEach(creature => {
            let defaultAmount = creature.amount
            $(`current-ambush-creatures`).insertAdjacentHTML("beforeend", getNewCreatureIcon(creature, Math.round(defaultAmount*(1+0.01*creaturesMultiplier))))
            $(`future-ambush-creatures`).insertAdjacentHTML("beforeend", getNewCreatureIcon(creature, Math.round(defaultAmount*(1+0.01*(creaturesMultiplier+1)))))
        })
        $(`your-creatures-multiplier`).addEventListener('input', () => {
            $(`future-ambush-creatures`).innerHTML = ""
            let newMultiplier = $(`your-creatures-multiplier`).value-0
            creaturesData.forEach(creature => {
                $(`future-ambush-creatures`).insertAdjacentHTML("beforeend", getNewCreatureIcon(creature, Math.round(creature.amount*(1+0.01*(creaturesMultiplier+newMultiplier)))))
            })
        })
    }

    /* END AMBUSH EVENT REGION */

    function getFactionName(fr, cl) {
        for (let i = 0; i < allClasses.length; i++) {
            if (allClasses[i][0] === fr && allClasses[i][2] === cl) {
                return allClasses[i][1]
            }
        }
    }

    function changeFactionAndClass(fr, cl) {
        let formData = new FormData()
        formData.append('fract', fr)
        doPost(`https://${host}/castle.php`, formData, () => {
            changeClass(cl);
        });
    }

    function changeClass(cl) {
        let formData = new FormData()
        formData.append('classid', cl)
        doPost(`https://${host}/castle.php`, formData, () => {
            if (isForStat) {
                doGet(`https://${host}/hunting_event.php?sel_level=${huntEventLvL}`, processHuntResponse)
            } else {
                setTimeout(() => {
                    location.reload()
                }, 300)
            }
        });
    }

    function createStyle() {
        return `
        <style>
            .record-container {
                background: #eeeeee;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                
                border-radius: 20px;
                border: 2px solid rgba(102,152,203,1);
                margin: 5px;
            }
            
            .record-players, .record-result, .record-number {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 5px;
                border-radius: 20px;
                border: 2px solid rgb(26,55,86);
                padding: 4px;
            }
            
            .record-number {
                min-width: 5%;
                font-weight: bold;
                font-size: 18px;
            }
            
            .record-result {
                min-width: 10%;
            }
            .record-players {
                min-width: 15%;
            }
            
            .record-players-creatures {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: center;
                overflow-x: auto;
                margin-left: 25px
            }
            
            .extra_margin {
                margin-left: 120px !important;
            }
           
            .record-player-creatures {
                display: flex;
                flex-direction: column;
                align-content: center;
                margin: 5px;
                border-radius: 20px;
                border: 2px solid rgb(26,55,86);
                padding: 4px;
            }
            .player-creatures-row {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
            }
            .player-leadership {
                display: flex;
                align-items: center;
                margin: auto;
            }
            
            .records-container-header {
                background: url("https://media3.giphy.com/media/YFFG4W2MvihirVoSQU/giphy.gif") repeat;
                background-size: 6%;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: center;
                width: 100%;       
            }
            
            .records-container-header > div {
                padding: 10px;
                vertical-align: center;
                background: #f8f8f2;
                border-radius: 20px;
                border: 2px solid rgb(26,55,86);
            }

            .cre_check {
                cursor: pointer; 
                width: 60px; 
                height:auto; 
                position: relative;
                display:inline-block;
            }
            
            .faction-hunt-data {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
            }
            
            .btn-gradient {
                text-decoration: none;
                color: white;
                padding: 5px;
                display: inline-block;
                cursor: pointer;
                position: relative;
                border: 1px solid rgba(0,0,0,0.21);
                border-bottom: 4px solid rgba(0,0,0,0.21);
                border-radius: 4px;
                text-shadow: 0 1px 0 rgba(0,0,0,0.15);
            }
        
            .btn-gradient.blue:active {background: #608FBF;}
            .btn-gradient.blue {
                background: rgba(102,152,203,1);
                background: linear-gradient(to bottom, rgba(102,152,203,1) 0%, rgba(92,138,184,1) 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#6698cb', endColorstr='#5c8ab8', GradientType=0 );
            }
            .bestP {
                color: red !important;
                font-size: 20px !important;
                text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
            }
            .progress {
                margin-left: 30px;
                font-size: 14px !important;
                text-shadow: none;
            }
            input[id^="spoiler"] {
                /*display: none;*/
            }
    
            input[id^="spoiler"] + label {
                display: block;
                text-align: center;
                font-size: 14px;
                cursor: pointer;
                transition: all .6s;
                min-width: 1280px;
            }
    
            input[id^="spoiler"] ~ .spoiler {
                width: 90%;
                height: 0;
                overflow: hidden;
                opacity: 0;
                transition: all .6s;
            }
    
            input[id^="spoiler"]:checked + label + .spoiler {
                height: auto;
                opacity: 1;
            }
            
            .wrapper {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                color: black;
                letter-spacing: 1px;
            }
            .wrapperStat {
                display: flex;
                flex-direction: row;
                justify-content: center;
                text-align: center;
                align-items: center;
                padding: 5px;
            }
        </style>
        `
    }

    function createHuntTemplate() {
        return `
            <div class="wrapper">
                <center>
                    <div style="width: 75%">
                        <div class="wrapperStat bestP">
                            <div><button id="statbut" class="btn-gradient blue">Load hunt stat</button></div>
                            <div id="progress" class="progress"></div>
                        </div>
                        <div id="statbody">
                        </div>
                    </div>
                </center>
            </div>
        `
    }

    function createLeaderTemplate() {
        return `
            <div class="wrapper">
                <center>
                    <div><p class="bestP">You are on ${currentLevel} lvl</p></div>
                    <div>
                        <input type="checkbox" id="spoiler"/>
                        <label for="spoiler">
                            ${header}
                        </label>
                        <div class="spoiler" id="main-data"></div>
                    </div>
                </center>
            </div>
        `
    }

    function createBanditsTemplate() {
        return `
            <div class="wrapper">
                <center>
                    <div>
                        <input type="checkbox" id="spoiler"/>
                        <label for="spoiler">
                            ${header}
                        </label>
                        <div class="spoiler" id="main-data">
                        </div>
                    </div>
                </center>
            </div>
        `
    }

    function createTJSoloTemplate() {
        return `         
            <div class="wrapper">
                <center>
                    <div style="width: 75%" >
                        <table>
                            <tr id="stat">
                                <td class="bestP">
                                    <div class="wrapperStat">
                                        <div><button id="statbut" class="btn-gradient blue">Load battles</button></div>
                                        <div id="progress" class="progress"></div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </center>
            </div>
        `
    }

    function getFilteringAreaTemplate() {
        return `
                <style>
                    .filters-container {
                        
                    }
                    .filtering-item {
                        display: flex;
                        align-items: center;
                        flex-direction: row;
                        flex-wrap: nowrap;
                    }
                    .filtering-item textarea {
                        width: 70%;
                    }
                </style>
                <br/>
                <div class="filters-container">
                    <div class="filtering-item">
                        <textarea id="waves-list">${get("blocked_waves", []).slice(1, -1)}</textarea>
                        <button id="save-blocked-waves">Block waves</button>
                    </div>
                    <div class="filtering-item">
                        <textarea id="heroes-list">${get("blocked_heroes", []).slice(1, -1)}</textarea>
                        <button id="save-blocked-heroes">Block heroes</button>
                    </div>
                    <div class="filtering-item">
                        <textarea id="blocked-leadership">${get("blocked_leadership", "")}</textarea>
                        <button id="save-blocked-leadership">Block leadership <</button>
                    </div>
                </div>
                <br/>`
    }

    function processCollectBattles() {
        if (!loadStarted) {
            collectBattles();
            loadStarted = true;
            document.getElementById("statbut").innerHTML = "Processing...";
        }
    }

    function collectBattles() {
        if (pageCount < maxPages) {
            doGet(`https://${host}/pl_warlog.php?id=${pl_id}&page=${pageCount}`, processResponse);
            pageCount++
        }
    }

    function processResponse(docc) {
        let arr = docc.querySelector("body > center > table > tbody > tr > td").innerHTML.toString().split("\n");
        if (arr.length < 39) { //don't remember what can go wrong
            arr = docc.querySelector("body > center > table:nth-child(2) > tbody > tr > td").innerHTML.toString().split("\n");
        }
        arr = arr.slice(2, 42);

        for (let i = 0; i < arr.length; i++) {
            let currwarid = arr[i].match(/warid=\d{10}/g)[0].match(/\d{10}/g)[0] - 0;

            if (/--117--/.test(arr[i])) {
                if (/<b>/.test(arr[i].split("vs")[1])) {
                    continue
                }
                battleCount++;
                document.getElementById("progress").innerHTML = "Найдено боев: " + battleCount.toString();
            }
            if (currwarid <= 1153329634) {
                let wins = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(1) > b:nth-child(6)").textContent - 0;
                document.getElementById("progress").innerHTML = "Найдено боев: " + battleCount.toString() + " Осталось боев:" + ((wins * 7 + 20) - battleCount).toString();
                document.getElementById("statbut").innerHTML = "Done";
                return
            }
        }
        collectBattles()
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function doGet(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            onload: function (res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }

    function doPost(url, params, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: params,
            onload: callback,
        });
    }

    function removeElement(element) {
        element.parentNode.removeChild(element)
    }

    function $(id, where = document) {
        return where.getElementById(id);
    }

    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;

    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
    }

    function getScrollHeight() {
        return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    }

    function findAll(regexPattern, sourceString) {
        let output = []
        let match
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
        while (match = regexPatternWithGlobal.exec(sourceString)) {
            delete match.input
            output.push(match)
        }
        return output
    }

    function sortByKey(array, key) {
        return array.sort((a, b) => {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
})(window);