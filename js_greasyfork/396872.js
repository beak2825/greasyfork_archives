// ==UserScript==
// @name         ClanEventHelper
// @namespace    https://greasyfork.org/ru/scripts/396872-claneventhelper
// @version      3.5
// @description  try to take over the world!
// @author       You
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/clan_info.+/
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/396872/ClanEventHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/396872/ClanEventHelper.meta.js
// ==/UserScript==

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
    if (!unsafeWindow.updateTable) {
        unsafeWindow.updateTable = updateTable;
    }
    const MAX_CLAN_MEMBERS_AMOUNT = 180;
    let inBattleImg = `<img src="https://dcdn.heroeswm.ru/i/clans/battle.gif" style="vertical-align: middle; width: 15px; height: 15px;" title="Проводит бой в ивенте" alt="Проводит бой в ивенте">`;
    let onlineImg = `<img src="https://dcdn.heroeswm.ru/i/clans/online.gif" style="vertical-align: middle; width: 15px; height: 15px;" title="В игре" alt="В игре">`;
    let isInCW;
    let tds;

    class ClanMember {
        constructor(id, nick, cl, eventPoints) {
            this.id = id;
            this.nick = nick;
            this.cl = cl;
            this.eventPoints = eventPoints;
        }
    }

    let clanId = new URLSearchParams(window.location.search).get("id");
    let inBattleCount;
    let clanMembers;
    let clanMembersByCL;
    let eventMaxWave;
    let currentWave;
    let pointsPool;
    let isInit = false;
    let docc;

    doGet(`https://${location.host}/clan_info.php?id=${clanId}`, processClanInfoResponse);


    function processClanInfoResponse(doc) {
        docc = doc;
        isInCW = docc.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(2) > img") == null;
        tds = docc.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(1)").querySelectorAll("td").length;
        doGet(`https://${location.host}/bselect.php?all=1`, processBselectResponse);
    }

    function processBselectResponse(doc) {
        inBattleCount = 0;
        clanMembers = [];
        clanMembersByCL = new Map();
        pointsPool = [];
        fillClanMembers();

        doc
            .querySelector("#hwm_no_zoom > div:nth-child(2) > div:nth-child(2)")
            .innerHTML
            .toString()
            .split("<br>")
            .filter(battle => battle.match(/<!--(\d{1,3})-->/))
            .forEach(battle => {
                clanMembers
                    .filter(member => (
                        battle.match(/<!--(\d{1,3})-->/)[1] === "140" ||
                        battle.match(/<!--(\d{1,3})-->/)[1] === "138" ||
                        battle.match(/<!--(\d{1,3})-->/)[1] === "143") &&
                        (battle.match(/pl_info\.php\?id=\d{1,10}/)[0] === member.id))
                    .forEach(member => {
                        member.isInEventBattle = true;
                        inBattleCount++;
                    })
            });
        main()
    }

    function main() {
        fillClanMembersByCl();
        setEventMaxWave();
        fillPointsPool();
        removeElement("members-table");
        removeElement("polzynok");
        if (!isInit) {
            addContainerToDOM();
        }

        if (isInCW && !isInit && tds === 5 || tds === 6 && !isInit) {

            setStyle();
        }
        addTableToDOM();
        setPolzynok();
        isInit = true;

    }

    setInterval(() => {
        doGet(`https://${location.host}/clan_info.php?id=${clanId}`, processClanInfoResponse);
    }, 5000);

    function updateTable() {
        let rng = document.getElementById('bestInput'); //rng - это Input
        let p = document.getElementById('one'); // p - абзац
        currentWave = pointsPool[rng.value - 1];
        p.innerHTML = `До волны: ${currentWave}`;
        removeElement("members-table");
        addTableToDOM();
    }

    function addContainerToDOM() {
        let s = `<center><div id="members-container" style="width:100%; background: white; border: 1px black solid"></div></center>`;
        document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1)").insertAdjacentHTML('afterend', s)

    }

    function addTableToDOM() {
        let s = `
            <table id="members-table" class="ololo">
                <thead class="bestP">
                    <td style="width:7%"><div style="">БУ</div></td>
                    <td colspan="2" style="width:20%"><div style="">Топ рез у</div></td>
                    <td style="width:80%"><div style="">Тянущие клан на дно</div></td>
                </thead>
        `;

        for (let [key, value] of clanMembersByCL.entries()) {
            let membersWithMaxWave = getMaxWaveCount(value);
            let membersWithNoMaxWave = getMembersWithoutMaxWave(value);
            let percentageWithMaxWave = (membersWithMaxWave / value.length) * 100;
            s += `
            <tr>
                <td>${key}</td>
                <td>${membersWithMaxWave} из ${value.length}</td>
                <td>${percentageWithMaxWave.toFixed(2)}%</td>
                <td>${membersArrayToString(membersWithNoMaxWave)} </td>
            </tr>`
        }
        let membersWithMaxWave = getMaxWaveCount(clanMembers);
        let percentageWithMaxWave = ((membersWithMaxWave / clanMembers.length) * 100).toFixed(2);

        s += `
            <tr>
                <td>Всего:</td>
                <td colspan="2">${membersWithMaxWave} из ${clanMembers.length} [${percentageWithMaxWave}%] <br> avg. wave: ${getAvgWave()}</td>
                <td>${getLostPointsTd(getLostPoints(clanMembers))}</td>
            </tr>
            <tr>
                <td>Красавчики:<br>${inBattleImg}: ${inBattleCount}</td>
                <td colspan="3">${membersArrayToString(getMembersWithMaxWave(clanMembers))}</td>
            </tr>
        </table>`;
        document.getElementById("members-container").insertAdjacentHTML('beforeend', s)
    }

    function getLostPointsTd(lostPoints) {
        let clanLostStr = `клан потерял <b style='color: red'>${lostPoints}</b> очков`;
        if (lostPoints === 0) {
            return `В клане все красавчики`
        }
        if (lostPoints === 0 && clanMembers.length < MAX_CLAN_MEMBERS_AMOUNT) {
            return `Из-за недостачи игроков ${clanLostStr}`
        }
        if (lostPoints > 0 && clanMembers.length < MAX_CLAN_MEMBERS_AMOUNT) {
            return `Из-за <b>?#A*&%!</b> и недостачи игроков ${clanLostStr}`
        }
        if (lostPoints > 0) {
            return `Из-за <b>?#A*&%!</b> ${clanLostStr}`
        }
        return ``
    }

    function fillPointsPool() {
        pointsPool = clanMembers
            .map(member => member.eventPoints)
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort((a, b) => a - b);
    }

    function fillClanMembers() {
        docc
            .querySelector(`body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody`)
            .querySelectorAll("tr")
            .forEach(tr => clanMembers.push(createClanMember(tr)));
    }

    function createClanMember(tr) {
        let startTd = isInCW ? 2 : 3;
        let clanMember = new ClanMember();
        if (!isInCW) {
            clanMember.online = /online/.test(tr.querySelector("td:nth-child(2) > img").src)
        }
        clanMember.id = tr.querySelector("td:nth-child(" + startTd + ") > a").getAttribute("href");
        clanMember.nick = tr.querySelector("a.pi").innerText;
        clanMember.cl = parseInt(tr.querySelector("td:nth-child(" + (startTd + 1) + ")").innerText);
        clanMember.eventPoints = parseFloat(tr.querySelector("td:nth-child(" + (startTd + 3) + ")")
            .innerText
            .trim()
            .replace(",", "")
        );
        clanMember.eventPoints = isNaN(clanMember.eventPoints) ? 0 : clanMember.eventPoints;
        return clanMember;
    }

    function setEventMaxWave() {
        eventMaxWave = Math.max(...clanMembers.map(o => o.eventPoints), 0);
        currentWave = JSON.parse(JSON.stringify(eventMaxWave));
    }

    function getAvgWave() {
        return (clanMembers.reduce((sum, member) => sum + member.eventPoints, 0) / clanMembers.length)
            .toFixed(2);
    }

    function fillClanMembersByCl() {
        clanMembers
            .sort((a, b) => a.cl - b.cl)
            .forEach(member =>
                clanMembersByCL.has(member.cl)
                    ? clanMembersByCL.get(member.cl).push(member)
                    : clanMembersByCL.set(member.cl, [member]));
    }

    function getMaxWaveCount(members) {
        return members.filter(member => member.eventPoints >= currentWave).length
    }

    function getMembersWithMaxWave(members) {
        return members
            .sort((a, b) => a.eventPoints - b.eventPoints)
            .filter(member => member.eventPoints >= currentWave)
            .map(member => `<a style="text-decoration: none;" href="${member.id}"><b>${member.nick}</b></a>`)

    }

    function getMembersWithoutMaxWave(members) {
        return members
            .sort((a, b) => a.eventPoints - b.eventPoints)
            .filter(member => member.eventPoints < currentWave)
            .map(member => `${member.online ? onlineImg : ``} <a style="text-decoration: none;" href="${member.id}"><b>${member.nick} </b></a>${member.isInEventBattle ? inBattleImg : ``} : <b style="color: red">${member.eventPoints - 0}</b>`);
    }

    function getLostPoints(members) {
        return members
                .filter(member => member.eventPoints < currentWave)
                .reduce((sum, member) => sum + parseInt((eventMaxWave * 100 - member.eventPoints * 100).toString()), 0)
            / 100 + (MAX_CLAN_MEMBERS_AMOUNT - clanMembers.length) * eventMaxWave;
    }

    function membersArrayToString(members) {
        return members.length === 0
            ? `Таких нет, все красавчики.`
            : members.reduce((resultStr, member, index) => resultStr + member + (index < members.length - 1 ? `<b style="color: blue">;</b> ` : ``), ``);
    }

    function removeElement(id) {
        let elem = document.getElementById(id);
        return elem ? elem.parentNode.removeChild(elem) : 0;
    }

    function setPolzynok() {
        let myDiv = `
                    <div id="polzynok">
                        <input id="bestInput" class ="myPolzynok" type="range" min="1" max="${pointsPool.length}" step="1" value="${pointsPool.length}" oninput="updateTable()">
                        </br>
                        <p class="bestP" id="one">До волны: ${currentWave}</p>
                    </div>
                     `;
        document.getElementById("members-container").insertAdjacentHTML("afterbegin", myDiv);
    }

    function setStyle() {
        let style = document.createElement('style');
        style.innerHTML = `
            .myPolzynok {
              -webkit-appearance: none;
              margin: 18px 0;
              width: 40%;
            }
            table.ololo td {
                text-align: center;
            }
            table.ololo {
              border-collapse: collapse;
            }
            table.ololo td {
              border: 2px solid #c0deff;
              padding: 5px;
            }
            table.ololo tr:first-child td {
              border-top: 0;
            }
            table.ololo tr td:first-child {
              border-left: 0;
            }
            table.ololo tr:last-child td {
              border-bottom: 0;
            }
            table.ololo tr td:last-child {
              border-right: 0;
            }
            .myPolzynok:focus {
              outline: none;
            }
            .myPolzynok:focus {
              outline: none;
            }
            .myPolzynok::-webkit-slider-runnable-track {
              width: 100%;
              height: 8.4px;
              cursor: pointer;
              animate: 0.2s;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              background: #3071a9;
              border-radius: 1.3px;
              border: 0.2px solid #010101;
            }
            .myPolzynok::-webkit-slider-thumb {
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              border: 1px solid #000000;
              height: 36px;
              width: 16px;
              border-radius: 3px;
              background: #ffffff;
              cursor: pointer;
              -webkit-appearance: none;
              margin-top: -14px;
            }
            .myPolzynok:focus::-webkit-slider-runnable-track {
              background: #367ebd;
            }
            .myPolzynok::-moz-range-track {
              width: 100%;
              height: 8.4px;
              cursor: pointer;
              animate: 0.2s;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              background: #3071a9;
              border-radius: 1.3px;
              border: 0.2px solid #010101;
            }
            .myPolzynok::-moz-range-thumb {
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              border: 1px solid #000000;
              height: 36px;
              width: 16px;
              border-radius: 3px;
              background: #ffffff;
              cursor: pointer;
            }
            .myPolzynok::-ms-track {
              width: 100%;
              height: 8.4px;
              cursor: pointer;
              animate: 0.2s;
              background: transparent;
              border-color: transparent;
              border-width: 16px 0;
              color: transparent;
            }
            .myPolzynok::-ms-fill-lower {
              background: #2a6495;
              border: 0.2px solid #010101;
              border-radius: 2.6px;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            }
            .myPolzynok::-ms-fill-upper {
              background: #3071a9;
              border: 0.2px solid #010101;
              border-radius: 2.6px;
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            }
            .myPolzynok::-ms-thumb {
              box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
              border: 1px solid #000000;
              height: 36px;
              width: 16px;
              border-radius: 3px;
              background: #ffffff;
              cursor: pointer;
            }
            .myPolzynok:focus::-ms-fill-lower {
              background: #3071a9;
            }
            .myPolzynok:focus::-ms-fill-upper {
              background: #367ebd;
            }
            .bestP {
                color: red;
                font-size: 20px !important;
                text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
            }
            thead.bestP td {
                color: red;
                border-bottom:1px solid black !important;
                border-top:1px solid black !important;
                font-size: 20px !important;
                text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
            }
            `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function doGet(url, callback) {
        console.log(url);
        let http = new XMLHttpRequest();
        http.open("GET", url, true); // false for synchronous request
        http.overrideMimeType("text/xml; charset=windows-1251");
        http.onreadystatechange = function () {//Call a function when the state changes
            if (http.readyState === 4 && http.status === 200) {
                return callback(new DOMParser().parseFromString(http.responseText, "text/html"));
            }
        };
        http.send(null);

    }
})(window);