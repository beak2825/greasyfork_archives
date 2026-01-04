// ==UserScript==
// @name          [hwm]_change_fraction
// @author        http://www.heroeswm.ru/pl_info.php?id=2058822
// @description   Change fraction/talent/build from any page in one click
// @version       5.4
// @license       lol
// @namespace     https://www.heroeswm.ru/
// @include       https://www.heroeswm.ru/*
// @include       https://my.lordswm.com/*
// @exclude       https://www.heroeswm.ru/war.php*
// @exclude       https://www.heroeswm.ru/radio_files/*
// @exclude       https://www.heroeswm.ru/cgame.php*
// @exclude       https://my.lordswm.com/war.php*
// @exclude       https://my.lordswm.com/radio_files/*
// @exclude       https://my.lordswm.com/cgame.php*
// @downloadURL https://update.greasyfork.org/scripts/515451/%5Bhwm%5D_change_fraction.user.js
// @updateURL https://update.greasyfork.org/scripts/515451/%5Bhwm%5D_change_fraction.meta.js
// ==/UserScript==
const creIDRegex = /portraits\/(.*?)anip\d/;
const creIds = [];
let xmlHttp = new XMLHttpRequest();
let host = location.host;
let httpType = location.href.substring(0, location.href.indexOf(':'));
let loadingGif = " <img width=15 src='http://dcdn2.heroeswm.ru/i/loading.gif'>";
let crossSpan = "<span style='cursor:pointer;background:#d33;color:white;padding:0px 4px 2px 4px;border-radius:3px;box-shadow:2px 2px 3px black;'><b>x</b></span>";
let stateListOpen = 0;
let divListFractions = false;
let divListTalents = false;
let currentFractionId = 0;
let meFractionId = 0;

// vars for change fraction/build
let talentUrl = false;
let armyParams = false;
let artsId = -1;

let useType = localStorage['cf#useType'];
let TYPE_FRACTION = "0";
let TYPE_TALENT = "1";
let TYPE_BUILD = "2";
if (!useType) useType = TYPE_FRACTION;
let colorBase = "#FFD871";
let backgroundBase = "#6B6C6A";
let buildArmy = -1;
let buildTalent = -1;
let buildArts = -1;
let savedBuildId = -1;

let fractions = [];
fractions[10] = "Рыцарь";
fractions[11] = "Рыцарь света";
fractions[20] = "Некромант";
fractions[21] = "Некромант - повелитель смерти";
fractions[30] = "Маг";
fractions[31] = "Маг-разрушитель";
fractions[40] = "Эльф";
fractions[41] = "Эльф-заклинатель";
fractions[50] = "Варвар";
fractions[51] = "Варвар крови";
fractions[52] = "Варвар-шаман";
fractions[60] = "Темный эльф";
fractions[61] = "Темный эльф-укротитель";
fractions[70] = "Демон";
fractions[71] = "Демон тьмы";
fractions[80] = "Гном";
fractions[81] = "Гном огня";
fractions[90] = "Степной варвар";
fractions[100] = "Фараон";

let talents = [];
let arts = ['<i>Снять всё</i>'];
let builds = [];
let spanFractions;

let mobNames = [];
mobNames[1] = ['conscript', 'marksman', 'swordman'/*squire*/, 'impergriffin', 'inquisitor', 'paladin', 'archangel'];
mobNames[101] = ['brute', 'crossbowman'/*crossman*/, 'vindicator', 'battlegriffon', 'zealot', 'champion', 'seraph2'];
mobNames[2] = ['sceletonarcher'/*skeletonarcher*/, 'plaguezombie', 'spectre', 'vampirelord', 'archlich', 'wraith', 'spectraldragon'];
mobNames[102] = ['sceletonwar', 'rotzombie', 'poltergeist', 'vampireprince', 'masterlich', 'banshee', 'ghostdragon'];
mobNames[3] = ['mastergremlin', 'obsgargoly', 'steelgolem', 'archmage', 'djinn_sultan', 'rakshasa_raja', 'titan'];
mobNames[103] = ['saboteurgremlin', 'elgargoly', 'magneticgolem', 'battlemage', 'djinn_vizier', 'rakshasa_kshatra', 'stormtitan'];
mobNames[4] = ['sprite', 'bladedancer'/*wardancer*/, 'hunterelf'/*masterhunter*/, 'ddeld'/*druideld*/, 'silverunicorn', 'ancienent', 'emeralddragon'];
mobNames[104] = ['dryad_'/*dryad*/, 'winddancer'/*wdancer*/, 'arcaneelf', 'ddhigh', 'pristineunicorn', 'savageent', 'crystaldragon'];
mobNames[5] = ['hobgoblin', 'hobwolfrider'/*wolfraider*/, 'orcchief', 'ogremagi', 'thunderbird', 'cyclopking', 'abehemoth'/*ancientbehemoth*/];
mobNames[105] = ['goblinarcher', 'boarrider', 'orcrubak', 'ogrebrutal', 'firebird_'/*firebird*/, 'cyclopod_'/*cyclopod*/, 'dbehemoth'];
mobNames[205] = ['goblinmag', 'boarrider', 'orcshaman', 'ogremagi', 'darkbird', 'cyclopod_'/*cyclopod*/, 'dbehemoth'];
mobNames[6] = ['assasin'/*assassin*/, 'fury', 'minotaurguard_'/*minotaurguard*/, 'grimrider', 'deephydra', 'matriarch', 'blackdragon'];
mobNames[106] = ['stalker', 'bloodsister', 'taskmaster', 'briskrider', 'foulhydra', 'mistress', 'reddragon'];
mobNames[7] = ['familiar', 'fdemon'/*hornedoverseer*/, 'cerberus', 'succubusm'/*succubusmis*/, 'stallion', 'pitlord_'/*pitlord*/, 'archdevil'];
mobNames[107] = ['vermin', 'jdemon', 'firehound'/*hotdog*/, 'seducer', 'hellstallion'/*hellkon*/, 'pitspawn'/*pity*/, 'archdemon'];
mobNames[8] = ['shieldguard', 'skirmesher', 'blackbearrider', 'berserker', 'runepatriarch', 'thunderlord', 'magmadragon'];
mobNames[108] = ['mountaingr', 'harpooner', 'whitebearrider', 'battlerager', 'runekeeper', 'flamelord', 'lavadragon'];
mobNames[9] = ['trapper', 'ncentaur', 'mauler', 'sdaughter', 'executioner', 'foulwyvern', 'untamedcyc'];
mobNames[10] = ['scorp', 'duneraider', 'shakal', 'dromad', 'zhrica', 'slon', 'anubis'];

function elementById(id) {
    return document.getElementById(id);
}
function send_get(url)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType('text/plain; charset=windows-1251');
    xhr.send(null);

    if(xhr.status == 200)
        return xhr.responseText;

    return null;
};

function $$(val, begin, end) {
    let id = val.indexOf(begin);
    let temp = val.substr(id + begin.length);
    return temp.substr(0, temp.indexOf(end));
}

function xy(obj) {
    let x = 0;
    let y = 0;
    while (obj) {
        x += obj.offsetLeft;
        y += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return {x: x, y: y};
}

function send(method, url, params, afterSend) {
    xmlHttp.open(method, url, true);
    if (method === "POST") {
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    xmlHttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlHttp.onreadystatechange = afterSend;
    xmlHttp.send(params);
}

function afterSend() {
    if (isResponseSuccess()) {
        if (talentUrl) {
            send("GET", talentUrl, null, afterSend);
            talentUrl = false;
        } else if (armyParams) {
            send("POST", httpType + "://" + host + "/army_apply.php", armyParams, afterSend);
            armyParams = false;
        } else if (artsId > -1) {
            let artsUri = artsId === 0 ? "all_off=100" : ("all_on=" + artsId);
            send("GET", httpType + "://" + host + "/inventory.php?" + artsUri, null, afterSend);
            artsId = -1;
        } else {
            location.href = httpType + "://" + host + "/home.php";
        }
    }
}

function determineSign() {
    console.log("1. sign: " + sign);
    if (!sign) {
        send("GET", httpType + "://" + host + "/inventory.php", null,
             function () {
            if (isResponseSuccess()) {
                sign = $$(xmlHttp.responseText, 'sign=', '"');
                console.log("2. sign: " + sign);
                localStorage['cf#sign#' + currentPlayerId] = sign;
            }
        }
            );
    }
}

function validateSign() {
    if (!sign) {
        alert("sign is undefined!");
    }
}

function editSpan(id) {
    return "<span id=editBuild_" + id + " style='cursor:pointer;border:1px solid #888;border-radius:3px;box-shadow:2px 2px 3px black;padding:0 2 1 2;'><img style='vertical-align:middle;' width=12 src='http://dcdn.heroeswm.ru/i/2repair_ico.gif'></span>";
}

function findSpanFractionsPlace() {
    let spanFractionsText = "| <span id='spanFractions' style = 'position:relative; z-index:100'></span>";
    let fixedElement = document.querySelector("body > center :nth-child(1) :nth-child(1) :nth-child(1) :nth-child(1)");
    if (fixedElement instanceof HTMLTableRowElement) {
        fixedElement.insertCell().innerHTML = spanFractionsText;
    } else {
        fixedElement = document.querySelector("body > center :nth-child(1) :nth-child(1)");
        if (fixedElement.tagName === "CENTER") {
            fixedElement.innerHTML += spanFractionsText;
        } else {
            document.querySelector("body > center :nth-child(1)").innerHTML += spanFractionsText;
        }
    }
    spanFractions = elementById('spanFractions');
    spanFractions.innerHTML = "<a class=pi href='castle.php'>Фракции <font style='font-size:8px;'>▼</font></a>";
    spanFractions.addEventListener(
        "mouseenter",
        function () {
            if (stateListOpen === 0) {
                divListFractions.style.visibility = "visible";
                stateListOpen = 1;
            }
        }
    );
    spanFractions.addEventListener(
        "mouseleave",
        function () {
            stateListOpen = 2;
            setTimeout(hiddenListFractions, 100);
        }
    );
}

function getCurrentPlayerId() {
    return /pl_id=(\d+)/.exec(document.cookie)[1];
}

function getFractionImg(id) {
    return "https://dcdn.heroeswm.ru/i/f/r" + id + ".png";
}

function initListFractions() {
    divListFractions = document.createElement('div');
    document.body.appendChild(divListFractions);
    divListFractions.style.left = xy(spanFractions).x + "px";
    divListFractions.style.top = (xy(spanFractions).y + spanFractions.parentNode.clientHeight - 1) + "px";
    divListFractions.style.position = "absolute";
    divListFractions.style.background = backgroundBase;
    divListFractions.style.visibility = "hidden";
    divListFractions.style.border = "1px solid #5D413A";
    divListFractions.style.zIndex = "1000";

    let innerInfo = "<table>";
    for (let fractionsKey in fractions) {
        let fractionId = (fractionsKey % 10) * 100 + Math.floor(fractionsKey / 10);
        let addStyle = fractionId === currentFractionId ? "border:1px dashed #ddd9cd;font-weight:bold" : "";
        innerInfo += "<tr style='color:" + colorBase + ";cursor:pointer'" +
            " id=frac_" + fractionsKey + ">" +
            "<td style='background-color:#F5F3EA'><img width='20' height='20' src='" + getFractionImg(fractionId) + "'></td>" +
            "<td id=td_frac_" + fractionsKey + " style='color:" + colorBase + ";" + addStyle + "'>" + fractions[fractionsKey] + "</td></tr>";
    }
    // use talents/builds
    let classes = ["wbwhite", "wbwhite", "wbwhite"];
    let checked = ["", "", ""];
    classes[useType] = "wblight";
    checked[useType] = "checked=checked"
    innerInfo += "<tr><td colspan=2><table class=wb width=100%>" +
        "<tr><td class=wblight rowspan=3 width=50% align=center>Использовать:</td>" +
        "<td class=" + classes[0] + "><input name=radio type=radio id=radio_0 " + checked[0] + "><label for=radio_0>Фракции</label></td></tr>" +
        "<tr><td class=" + classes[1] + "><input name=radio type=radio id=radio_1 " + checked[1] + "><label for=radio_1>Навыки</label></td></tr>" +
        "<tr><td class=" + classes[2] + "><input name=radio type=radio id=radio_2 " + checked[2] + "><label for=radio_2>Билды</label></td></tr>" +
        "<tr><td class=wbwhite colspan=2 align=center><input id=buildManager type=submit value='Билд-менеджер' " + (useType !== TYPE_BUILD ? "disabled" : "") + "></td></tr>" +
        "</table></td></tr>";
    innerInfo += "</table>";
    divListFractions.innerHTML = innerInfo;
    for (let radioId = 0; radioId < 3; radioId++) {
        elementById('radio_' + radioId).onclick = function () {
            useType = this.id.split('_')[1];
            localStorage['cf#useType'] = useType;
            elementById('buildManager').disabled = useType !== TYPE_BUILD;
            elementById('radio_' + useType).parentNode.className = "wblight";
            elementById('radio_' + (useType + 1) % 3).parentNode.className = "wbwhite";
            elementById('radio_' + (useType + 2) % 3).parentNode.className = "wbwhite";
            loadTalentsFromLocalStorage();
            initListTalents();
        };
    }
    elementById('buildManager').onclick = function () {
        buildArmy = -1;
        buildTalent = -1;
        buildArts = -1;
        let divPopup = document.createElement('div');
        divPopup.style.width = "100%";
        divPopup.style.minHeight = "100%";
        divPopup.style.position = "fixed";
        divPopup.style.top = "0px";
        divPopup.style.backgroundColor = "rgba(0,0,0,0.5)";
        divPopup.style.zIndex = "1002";
        divPopup.addEventListener(
            "mouseup",
            function (e) {
                let target = e.target || e.srcElement;
                if (target === divPopup) {
                    document.body.removeChild(divPopup);
                    hiddenListFractions();
                }
            }
        );
        document.body.appendChild(divPopup);

        let divBuildManager = document.createElement('div');
        divBuildManager.align = "center";
        divBuildManager.style.top = "0px";
        divBuildManager.style.margin = "50px auto 0px auto";
        divBuildManager.style.backgroundColor = backgroundBase;
        divBuildManager.style.width = "620px";
        divBuildManager.style.boxShadow = "10px 10px 10px #000";
        divBuildManager.style.zIndex = "1003";
        divPopup.appendChild(divBuildManager);
        if (currentFractionId > 0) {
            generateBuildContent(divBuildManager, divPopup, currentFractionId);
        } else {
            let alertMessage = 'Невозможно определить текущую фракцию! Попробуйте создать навык, чтобы он отображался в "Быстрых ссылках"';
            let pattern = /\/i\/f\/r(\d+)\.png/;
            if (location.href.endsWith(`pl_info.php?id=${currentPlayerId}`)) {
                let match = document.body.innerHTML.match(pattern);
                console.log(match);
                if (match) {
                    currentFractionId = parseInt(match[1]);
                    generateBuildContent(divBuildManager, divPopup, currentFractionId);
                } else {
                    alert(alertMessage);
                }
            } else {
                send("GET", `pl_info.php?id=${currentPlayerId}`, null,
                     function () {
                    if (isResponseSuccess()) {
                        let match = xmlHttp.responseText.match(pattern);
                        if (match) {
                            currentFractionId = parseInt(match[1]);
                            generateBuildContent(divBuildManager, divPopup, currentFractionId);
                        } else {
                            alert(alertMessage);
                        }
                    }
                }
                    );
            }
        }

    };

    for (let fractionsKey in fractions) {
        elementById('frac_' + fractionsKey).onclick = function () {
            let val = this.id.split("_")[1];
            elementById('td_frac_' + val).innerHTML += loadingGif;
            let classId = val % 10;
            let fractionId = classId * 100 + Math.floor(val / 10);
            setFraction(fractionId)
        };
    }

    divListFractions.addEventListener(
        "mouseenter",
        function () {
            stateListOpen = 1;
        }
    );

    divListFractions.addEventListener(
        "mouseleave",
        function (e) {
            stateListOpen = 2;
            if (!e) e = event;
            let x = e.clientX;
            let y = e.clientY;
            if (x < xy(divListFractions).x ||
                x >= xy(divListFractions).x + divListFractions.clientWidth ||
                y < xy(divListFractions).y ||
                y >= xy(divListFractions).y + divListFractions.clientHeight)
                setTimeout(hiddenListFractions, 100);
        }
    );
}

function initFractionsListeners() {
    for (let fractionId in fractions) {
        elementById('frac_' + fractionId).addEventListener(
            "mouseenter",
            function () {
                let val = this.id.split("_")[1];
                let fractionId = (val % 10) * 100 + Math.floor(val / 10);
                meFractionId = fractionId;
                if (useType === TYPE_TALENT) {
                    if (talents[fractionId]) {
                        let innerInfo = "<table width=100%>";
                        for (let talentId in talents[fractionId]) {
                            let t = getTalent(fractionId, talentId);
                            if (t !== -1) {
                                innerInfo += "<tr><td style='cursor:pointer;color:" + colorBase + "' " +
                                    "id=talent_" + talentId + " title='" + t[0] + "'> • " + t[1] + "</td></tr>";
                            }
                        }
                        divListTalents.innerHTML = innerInfo + "</table>";
                        divListTalents.style.visibility = "visible";
                        divListTalents.style.top = xy(this).y;
                        divListTalents.style.left = xy(this).x - divListTalents.clientWidth - 1;
                        // listeners
                        for (let talentId in talents[fractionId]) {
                            if (!talents[fractionId][talentId]) {
                                continue;
                            }
                            elementById('talent_' + talentId).addEventListener(
                                "mouseenter",
                                function () {
                                    this.style.background = "#757575";
                                    this.style.color = "white";
                                }
                            );
                            elementById('talent_' + talentId).addEventListener(
                                "mouseleave",
                                function () {
                                    this.style.background = backgroundBase;
                                    this.style.color = colorBase;
                                }
                            );
                            elementById('talent_' + talentId).onclick = function () {
                                talentUrl = this.title;
                                this.innerHTML += loadingGif;
                                let fractionId = this.title.match(/prace=(\d+)&/)[1];
                                setFraction(fractionId);
                            };
                        }
                    } else {
                        divListTalents.style.visibility = "hidden";
                    }
                } else if (useType === TYPE_BUILD) {
                    let val = this.id.split("_")[1];
                    let fractionId = (val % 10) * 100 + Math.floor(val / 10);
                    if (builds[fractionId]) {
                        let innerInfo = "<table width=100%>";
                        for (let buildId in builds[fractionId]) {
                            let buildTitle = getBuildTitle(fractionId, buildId);
                            innerInfo += "<tr><td style='cursor:pointer;color:" + colorBase + "' " +
                                "id=talent_" + buildId + " title='" + buildTitle.title + "'> " + buildTitle.buildName + "</td></tr>";
                        }
                        divListTalents.innerHTML = innerInfo + "</table>";
                        divListTalents.style.visibility = "visible";
                        divListTalents.style.top = xy(this).y;
                        divListTalents.style.left = xy(this).x - divListTalents.clientWidth - 1;
                        // listeners
                        for (let buildId in builds[fractionId]) {
                            elementById('talent_' + buildId).addEventListener(
                                "mouseenter",
                                function () {
                                    this.style.background = "#757575";
                                    this.style.color = "white";
                                }
                            );
                            elementById('talent_' + buildId).addEventListener(
                                "mouseleave",
                                function () {
                                    this.style.background = backgroundBase;
                                    this.style.color = colorBase;
                                }
                            );
                            elementById('talent_' + buildId).onclick = function () {
                                this.innerHTML += loadingGif;
                                let buildId = this.id.split("_")[1];
                                let build = builds[meFractionId][buildId].split('|');
                                talentUrl = getTalent(meFractionId, build[2])[0];
                                let a = build[1].split('+');
                                armyParams = "";
                                for (let i in a) {
                                    armyParams += "&countv" + (i * 1 + 1) + "=" + a[i];
                                }
                                armyParams = armyParams.substr(1);
                                artsId = build[3];
                                setFraction(meFractionId);
                            };
                        }
                    } else {
                        divListTalents.style.visibility = "hidden";
                    }

                }
                this.style.background = "#757575";
                elementById('td_' + this.id).style.color = "white";
            }
        );
        elementById('frac_' + fractionId).addEventListener(
            "mouseleave",
            function () {
                this.style.background = backgroundBase;
                elementById('td_' + this.id).style.color = colorBase;
            }
        );
    }
}

function setFraction(fractionId) {
    validateSign()
    send("GET", httpType + "://" + host + "/castle.php?change_clr_to=" + fractionId + "&sign=" + sign, null, afterSend);
}

function initListTalents() {
    if (useType === TYPE_FRACTION) {
        talents = [];
        if (divListTalents) {
            divListTalents.style.visibility = "hidden";
        }
        initFractionsListeners();
    } else {
        if (!divListTalents) {
            divListTalents = document.createElement('div');
            document.body.appendChild(divListTalents);
            divListTalents.style.position = "absolute";
            divListTalents.style.background = backgroundBase;
            divListTalents.style.zIndex = "1001";
            divListTalents.style.border = "1px solid #5D413A";
            divListTalents.style.visibility = "hidden";
            divListTalents.style.width = "150";
            divListTalents.addEventListener(
                "mouseenter",
                function () {
                    stateListOpen = 3;
                }
            );
            divListTalents.addEventListener(
                "mouseleave",
                function (e) {
                    stateListOpen = 2;
                    if (!e) e = event;
                    let x = e.clientX;
                    let y = e.clientY;
                    if (x >= xy(divListFractions).x + divListFractions.clientWidth ||
                        y >= xy(divListFractions).y + divListFractions.clientHeight ||
                        x < xy(divListFractions).x)
                        hiddenListFractions();
                }
            );
        }
        if (!currentPlayerId) {
            divListFractions.style.color = "red";
            divListFractions.style.background = "white";
            divListFractions.innerHTML = "Невозможно определить ID персонажа!<br>Перейдите на другую страницу!";
        } else {
            initFractionsListeners();
        }
    }
}

function loadTalentsFromLocalStorage() {
    let skillwheels = document.getElementsByTagName("a");
    let prace = "";
    let load = false;
    for (let i in skillwheels) {
        let href = skillwheels[i].href;
        if (href && href.indexOf("skillwheel.php?setuserperk=") > -1) {
            prace = href.split("prace=")[1];
            prace = prace.substr(0, prace.indexOf('&'));
            let buildid = href.split("buildid=")[1];
            if (!talents[prace]) {
                talents[prace] = [];
                load = true;
            }
            if (load) {
                talents[prace][buildid] = href + "|" + skillwheels[i].innerHTML;
            }
        }
    }
    if (prace !== "") {
        currentFractionId = parseInt(prace);
        localStorage['cf#' + currentPlayerId + '#race#' + prace] = talents[prace];
    }
    for (let localKey in localStorage) {
        if (localKey.indexOf('cf#' + currentPlayerId + '#race#') > -1) {
            talents[localKey.split("#")[3]] = localStorage[localKey].split(",");
        }
    }
    loadArtsFromLocalStorage();
    loadBuildsFromLocalStorage();
}

function loadArtsFromLocalStorage() {
    for (let i = 0; i < 11; i++) {
        let art = localStorage['cf#' + currentPlayerId + '#arts#' + i];
        if (art) {
            arts[i] = art;
        }
    }
}

function loadBuildsFromLocalStorage() {
    for (let localKey in localStorage) {
        if (localKey.indexOf('cf#' + currentPlayerId + '#build#') > -1) {
            builds[localKey.split("#")[3]] = localStorage[localKey].split(",");
        }
    }
}

function addBuildToLocalStorage() {
    if (!builds[currentFractionId])
        builds[currentFractionId] = [];
    let buildId = savedBuildId > -1 ? savedBuildId : builds[currentFractionId].length;
    savedBuildId = -1;
    builds[currentFractionId][buildId] =
        elementById('buildName').value + '|' + buildArmy + '|' + buildTalent + '|' + buildArts;
    localStorage['cf#' + currentPlayerId + '#build#' + currentFractionId] = builds[currentFractionId];
    //alert(builds[currentFractionId]);
    fillBuilds(currentFractionId);
}

function deleteBuildFromLocalStorage(buildId) {
    builds[currentFractionId].splice(buildId, 1);
    if (builds[currentFractionId].length > 0) {
        localStorage['cf#' + currentPlayerId + '#build#' + currentFractionId] = builds[currentFractionId];
    } else {
        delete localStorage['cf#' + currentPlayerId + '#build#' + currentFractionId];
    }
    fillBuilds(currentFractionId);
}

function hiddenListFractions() {
    if (stateListOpen === 2) {
        divListFractions.style.visibility = "hidden";
        if (divListTalents) {
            divListTalents.style.visibility = "hidden";
        }
        stateListOpen = 0;
    }
}
const parser = new DOMParser();
function autoFill(){
    try{
        const id_input = {};
        for (const creId of creIds){
            id_input[creId] = document.querySelector(`input[cre_id="${creId}"]`);
        }
        const pl_id = getCurrentPlayerId();
        const charHTML = send_get(`pl_info.php?id=${pl_id}`);
        const doc = parser.parseFromString(charHTML, "text/html");
        const curCreDivs = Array.from(doc.querySelectorAll(".cre_creature72"));
        const curCreCpunts = {};
        for (const div of curCreDivs){
            const match = div.querySelector(".cre_mon_image1").src.match(creIDRegex);
            if (!match) continue;
            const id = match[1];
            const count = div.querySelector("#add_now_count").textContent;
            curCreCpunts[id] = count;
        }
        for (const creId of creIds){
            if (!curCreCpunts[creId]) continue;
            id_input[creId].value = curCreCpunts[creId];
        }
    }
    catch (e){
        console.error(e);
    }
}
function generateBuildContent(div, divPopup, fractionId) {
    let contentAll = "<table class=wb width=670 cellpadding=0 cellspacing=0 style='height:100%;background:#FFF'>" +
        "<tr class=wblight><td align=center style='padding:4;' colspan=2>" +
        "<table width=100%><tr align=center>" +
        "<td><b>Текущая фракция:</b> <img width=15 height=15 border=0 align=absmiddle src='" + getFractionImg(fractionId) + "'></td>" +
        "<td width=25 id=crossClose>" + crossSpan + "</td>" +
        "</tr></table></td></tr>";
    // all builds

    contentAll += "<tr><td style='padding:4px;' rowspan=2 width=250 valign=top>" +
        "<table class=wb style='height:100%' width=100% cellpadding=0 cellspacing=0 id=listBuilds>" +
        "<tr><td class=wblight style='padding:4;height:5;' colspan=4><b>Сохранённые билды:</b></td></tr>" +
        "<tr><td class=wbwhite style='padding:4;' valign=top>" +
        "<span style='color:red'><b>Нет билдов!</b></span>" +
        "</td></tr>" +
        "</table>" +
        "</td>";


    // army
    contentAll += "" +
        "<td style='padding:4;'><table class=wb width=100% cellpadding=0 cellspacing=0>" +
        "<tr><td class=wblight style='padding:4;' colspan=7><b>Наберите армию:</b></td></tr>" +
        "<button id='cre_autofill'>Автозаполнение кол-ва существ</button>" +
        "<tr>";

    let contentValues = "<tr align=center>";
    for (let mobId in mobNames[fractionId]) {
        creIds.push(mobNames[fractionId][mobId]);
        contentAll += "<td class=wblight><img src='https://dcdn3.heroeswm.ru/i/portraits/" + mobNames[fractionId][mobId] + "anip40.png' width=60 height=50 border=0></td>";
        contentValues += "<td class=wbwhite style='padding:4px;'><input type=text size=1 maxlength=3 style='border:1px solid #777' cre_id = "+mobNames[fractionId][mobId]+" id=countArmy_" + mobId + "></td>";
    }
    contentAll += "</tr>" + contentValues + "</tr>";
    contentAll += "</table></td></tr>";

    // talents & inventory
    contentAll += "<tr>" +
        "<td style='padding:4;'><table class=wb width=100% cellpadding=0 cellspacing=0>" +
        "<tr>" +
        "<td class=wblight style='padding:4;'><b>Выберите навык:</b></td>" +
        "<td class=wblight style='padding:4;'><b>Выберите комплект артов:</b></td>" +
        "</tr>" +
        "<tr><td class=wbwhite style='padding:4;'>";
    if (talents[fractionId]) {
        for (let talentId in talents[fractionId]) {
            if (talents[fractionId][talentId]) {
                let del = talents[fractionId][talentId].indexOf("|");
                let skillHref = talents[fractionId][talentId].substr(0, del);
                let skillName = talents[fractionId][talentId].substr(del + 1);
                contentAll += "<input type=radio name=radioTalent id=radioTalent_" + talentId + " title='" +
                    skillName + "'><label for=radioTalent_" + talentId + ">" + skillName + "</label><br>";
            }
        }
    } else {
        contentAll += "<span><b style='color:red'>Нет навыков!</b></span>";
    }
    contentAll += "</td>" +
        "<td class=wbwhite style='padding:4;'>" +
        "<span id=setArts><b style='color:red'>Нет комплектов!</b></span>" +
        "<br><input type=submit id=updateArts value='Обновить комплекты'>" +
        "</td></tr>";
    contentAll += "</table></td></tr>";

    contentAll +=
        "<tr align=center>" +
        "<td style='padding:4;'>" +
        "<table class=wb style='height:100%' width=100% cellpadding=0 cellspacing=0 style='background:#FFF'>" +
        "<tr><td class=wblight style='padding:4;height:5;' colspan=4><b>Экспорт/импорт билдов:</b></td></tr>" +
        "<tr align=center><td class=wbwhite><input type=submit id=exportBuilds value='Экспорт в блокнот(ГВД) ->'>" +
        "<br><br><input type=submit id=importBuilds value='<- Импорт из блокнота(ГВД)'></td></tr>" +
        "</table>" +
        "</td>";
    // build
    contentAll +=
        //"<tr align=center>" +
        "<td style='padding:4px;' colspan=1><table class=wb width=100% cellpadding=0 cellspacing=0 style='background:#FFF'>" +
        "<tr class=wblight><td style='padding:4;' colspan=2><span id=buildCap style='color:red'><b>Билд:</b></span></td></tr>" +
        "<tr class=wbwhite><td style='padding:4;' colspan=2 align=center><table width=80%>" +
        "<tr><td style='padding:2;' width=25%>Имя:</td><td><input type=text maxlength=32 size=16 style='border:1px solid #777' id=buildName></td></tr>" +
        "<tr><td style='padding:2;'>Армия:</td><td id=buildArmy><i>без армии</i></td></tr>" +
        "<tr><td style='padding:2;'>Навык:</td><td id=buildTalent><i>без навыка</i></td></tr>" +
        "<tr><td style='padding:2;'>Арты:</td><td id=buildArts><i>без артов</i></td></tr>" +
        "</table></td></tr>" +
        "<tr class=wbwhite align=center>" +
        "<td style='padding:4;' width=50%><input type=submit id=saveBuild disabled value='Сохранить билд'></td>" +
        "<td style='padding:4;' width=50%><input type=submit id=cancelBuild value='Очистить форму'></td>" +
        "</table></td></tr>";
    // end
    contentAll += "</table>";
    div.innerHTML = contentAll;
    document.querySelector("#cre_autofill").onclick = autoFill;
    fillSetArts();
    fillBuilds(fractionId);

    // listeners
    elementById('crossClose').onclick = function () {
        document.body.removeChild(divPopup);
        hiddenListFractions();
    };
    let radioTalents = document.getElementsByName('radioTalent');
    for (let i in radioTalents) {
        if (radioTalents[i].id) {
            radioTalents[i].onclick = function () {
                let talentId = this.id.split('_')[1];
                elementById('buildTalent').innerHTML = "<b>" + this.title + "</b>";
                buildTalent = talentId;
                checkBuild();
            }
        }
    }
    for (let i = 0; i < 7; i++) {
        elementById('countArmy_' + i).onkeypress = function (e) {
            if (this.value == '0') this.value = '';
            e = e || event;
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            let chr = getChar(e);
            if (chr == null) return;
            if (chr < '0' || chr > '9') {
                return false;
            }
        }
        elementById('countArmy_' + i).onkeyup = function (e) {
            generateBuildArmy();
            elementById('buildArmy').innerHTML = "<b>" + buildArmy + "</b>";
            checkBuild();
        }
    }
    elementById('updateArts').onclick = function () {
        elementById('setArts').innerHTML += loadingGif;
        send("GET", httpType + "://" + host + "/inventory.php", null,
             function () {
            if (isResponseSuccess()) {
                let text = xmlHttp.responseText.split("set_id=");
                if (text.length > 1) {
                    arts = ["<i>Снять всё</i>"];
                    for (let i = 1; i < text.length; i++) {
                        let setId = $$(text[i], '"', '"');
                        let setName = $$(text[i], '>', '<');
                        arts[setId] = setName;
                        localStorage['cf#' + currentPlayerId + '#arts#' + setId] = setName;
                    }
                    fillSetArts();
                } else {
                    elementById('setArts').innerHTML = "<b style='color:red'>Недоступна страница<br> инвентаря, попробуйте<br> позже!</b>";
                }
            }
        }
            );
    };
    elementById('buildName').onkeyup = function () {
        checkBuild();
    };
    elementById('saveBuild').onclick = function () {
        addBuildToLocalStorage();
    };
    elementById('cancelBuild').onclick = function () {
        clearForm();
    };
    elementById('exportBuilds').onclick = function () {
        exportBuilds();
    };
    elementById('importBuilds').onclick = function () {
        importBuilds();
    };
}

function getChar(event) {
    let which = event.which;    // other
    if (which == null) {
        which = event.keyCode;
    }   // IE
    if (which != 0) {
        if (which < 32) {
            return null;
        }
        return String.fromCharCode(which);
    }
    return null;
}

function generateBuildArmy() {
    buildArmy = "";
    for (let i = 0; i < 7; i++) {
        let intValue = parseInt(elementById('countArmy_' + i).value);
        if (!intValue) intValue = 0;
        buildArmy += intValue;
        if (i < 6) buildArmy += '+';
    }
}

function fillSetArts() {
    let innerText = "";
    if (arts.length === 0) {
        return;
    }
    for (let i in arts) {
        if (i > 0) {
            innerText += "<br>";
        }
        innerText += "<input type=radio name=radioArts id=radioArts_" + i + ">" +
            "<label for=radioArts_" + i + ">" + (i > 0 ? (i + ". ") : "") +
            arts[i] + "</label>";
    }
    elementById('setArts').innerHTML = innerText;
    // listeners
    let radioArts = document.getElementsByName('radioArts');
    for (let i in radioArts) {
        if (radioArts[i].id) {
            radioArts[i].onclick = function () {
                let setId = this.id.split('_')[1];
                elementById('buildArts').innerHTML = "<b>" + setId + ". " + arts[setId] + "</b>";
                buildArts = setId;
                checkBuild();
            }
        }
    }
}

function fillBuilds(fractionId) {
    let innerText = "<tr><td class=wblight style='padding:4px;height:5px;' colspan=4><b>Сохранённые билды:</b></td></tr>";
    //alert(builds[fractionId] + ": " + builds[fractionId].length);
    if (!builds[fractionId] || builds[fractionId].length === 0) {
        innerText += "<tr><td class=wbwhite style='padding:4px;' valign=top>" +
            "<span style='color:red'><b>Нет билдов!</b></span>" +
            "</td></tr>";
    } else {
        for (let buildId in builds[fractionId]) {
            let buildTitle = getBuildTitle(fractionId, buildId);
            innerText += "<tr class=wbwhite>" +
                "<td width=10  style='padding:4;height:5;'>" + (buildId * 1 + 1) + ".</td>" +
                "<td title='" + buildTitle.title + "'><b>" + buildTitle.buildName + "</b></td>" +
                "<td align=center width=25 title='Редактировать билд'>" + editSpan(buildId) + "</td>" +
                "<td align=center width=25 title='Удалить билд' id=deleteBuild_" + buildId + ">" + crossSpan + "</td>" +
                "</tr>";
        }
        innerText += "<tr class=wblight><td colspan=4>&nbsp;</td></tr>";
    }
    elementById('listBuilds').innerHTML = innerText;
    // listeners
    for (let i in builds[fractionId]) {
        elementById('deleteBuild_' + i).onclick = function () {
            let buildId = this.id.split('_')[1];
            if (confirm("Вы действительно хотите удалить этот билд?"))
                deleteBuildFromLocalStorage(buildId);
        };
        elementById('editBuild_' + i).onclick = function () {
            let buildId = this.id.split('_')[1];
            loadBuild(buildId);
        }
    }
}

function getBuildTitle(fractionId, buildId) {
    let build = builds[fractionId][buildId].split('|');
    let talent = getTalent(fractionId, build[2]);
    let art = build[3] === "-1" ? "<без артов>" : arts[build[3]];
    talent = talent === -1 ? "<без навыка>" : talent[1];
    let army = build[1] === "-1" ? "<без армии>" : build[1];
    return {buildName: build[0], title: army + " | " + talent + " | " + art};
}

function checkBuild() {
    if (elementById('buildName').value !== "") {
        elementById('saveBuild').disabled = false;
        elementById('buildCap').style.color = "green";
    } else {
        elementById('saveBuild').disabled = true;
        elementById('buildCap').style.color = "red";
    }
}

function getTalent(fractionId, talentId) {
    if (talents[fractionId] && talents[fractionId][talentId]) {
        let talent = talents[fractionId][talentId];
        let i = talent.indexOf("|");
        return [talent.substr(0, i), talent.substr(i + 1)];
    } else {
        return -1;
    }
}

function loadBuild(buildId) {
    savedBuildId = buildId;
    let fractionId = currentFractionId;
    fillBuilds(fractionId);
    let build = builds[fractionId][buildId].split('|');
    let buildName = build[0];
    let talent = getTalent(fractionId, build[2]);
    if (talent === -1) {
        buildTalent = -1;
        talent = "<i>без навыка</i>";
    } else {
        buildTalent = talent[0].split("buildid=")[1];
        setRadioButton('radioTalent_' + buildTalent, true);
        talent = "<b>" + talent[1] + "</b>";
    }
    let art;
    if (build[3] === "-1") {
        buildArts = -1;
        art = "<i>без артов</i>";
    } else {
        buildArts = build[3];
        setRadioButton('radioArts_' + buildArts, true);
        art = "<b>" + arts[build[3]] + "</b>";
    }
    if (build[1] === "-1") {
        buildArmy = -1;
        build = "<i>без армии</i>";
        for (let i = 0; i < 7; i++) {
            elementById('countArmy_' + i).value = "";
        }
    } else {
        buildArmy = build[1];
        let army = build[1].split('+');
        for (let i in army) {
            elementById('countArmy_' + i).value = army[i];
        }
        build = "<b>" + build[1] + "</b>";
    }
    elementById('editBuild_' + buildId).style.border = "1px solid #F00";
    elementById('editBuild_' + buildId).style.background = "#FCC";
    elementById('buildName').value = buildName;
    elementById('buildArmy').innerHTML = build;
    elementById('buildTalent').innerHTML = talent;
    elementById('buildArts').innerHTML = art;
    checkBuild();
}

function clearForm() {
    fillBuilds(currentFractionId);
    setRadioButton('radioArts_' + buildArts, false);
    setRadioButton('radioTalent_' + buildTalent, false);
    savedBuildId = -1;
    buildArmy = -1;
    buildArts = -1;
    buildTalent = -1;
    for (let i = 0; i < 7; i++) {
        elementById('countArmy_' + i).value = "";
    }
    elementById('buildName').value = "";
    elementById('buildArmy').innerHTML = "<i>без армии</i>";
    elementById('buildTalent').innerHTML = "<i>без навыка</i>";
    elementById('buildArts').innerHTML = "<i>без артов</i>";
    checkBuild();
}

function setRadioButton(id, value) {
    if (elementById(id)) {
        elementById(id).checked = value;
    }
}

function exportBuilds() {
    send("GET", httpType + "://" + host + "/sms.php?notebook=1", null,
         function () {
        if (isResponseSuccess()) {
            let maxLength = 2990;
            let html = document.createElement('html');
            html.innerHTML = xmlHttp.responseText;
            let noteText = html.getElementsByTagName('textarea')[0].innerHTML;
            let exportContent = "\n[exb]";
            for (let fractionId in builds) {
                exportContent += fractionId + ";" + builds[fractionId] + "^";
            }
            exportContent += "[/exb]";
            let endNoteText = noteText.split("[/exb]")[1] || "";
            noteText = noteText.split("\n[exb]")[0] + endNoteText;
            let dLength = maxLength - noteText.length - exportContent.length;
            if (dLength < 0) {
                alert("Ошибка! Не хватает " + -dLength + " символа(ов) для хранения в блокноте! (макс. = " + maxLength + ")");
            } else {
                if (confirm("Вы действительно хотите сохранить билды в гвд-блокнот?\n(данные в блокноте могут измениться)")) {
                    let content = urlEncode(noteText + exportContent);
                    send("POST", httpType + "://" + host + "/sms.php", "action=savenotebook&data=" + content,
                         function () {
                        if (isResponseSuccess()) {
                            alert("Билды сохранены в блокнот!");
                        }
                    }
                        );
                }
            }
        }
    }
        );
}

function importBuilds() {
    if (confirm("Вы действительно хотите импортировать билды?\n(текущие билды могут измениться/удалиться)")) {
        send("GET", httpType + "://" + host + "/sms.php?notebook=1", null,
             function () {
            if (isResponseSuccess()) {
                let html = document.createElement('html');
                html.innerHTML = xmlHttp.responseText;
                let noteText = html.getElementsByTagName('textarea')[0].innerHTML;
                let importContent = $$(noteText, "\n[exb]", "[/exb]");
                let blds = importContent.split("^");
                let x = "";
                for (let i = 0; i < blds.length - 1; i++) {
                    let c = blds[i].split(";");
                    builds[c[0]] = c[1].split(",");
                    localStorage['cf#' + currentPlayerId + '#build#' + c[0]] = builds[c[0]];
                }
                alert("Билды импортированы!");
                fillBuilds(currentFractionId);
            }
        }
            );
    }
}

function urlEncode(s) {
    let ans = "";
    for (let i = 0; i < s.length; i++) {
        let c = s.charCodeAt(i);
        if (c > 127) {
            if (c > 1024) {
                if (c === 1025) {
                    c = 1016;
                } else if (c === 1105) {
                    c = 1032;
                }
                ans += "%" + (c - 848).toString(16);
            }
        } else {
            ans += c === 43 ? "%2b" : s.charAt(i);
        }
    }
    return ans;
}

function isResponseSuccess() {
    return xmlHttp.readyState === 4 && xmlHttp.status === 200;
}

function showAllLocalStorageStorage() {
    let debugInfo = "";
    let i = 1;
    for (let localKey in localStorage) {
        //        if (localKey.indexOf("cf#") > -1)
        debugInfo += i++ + ". " + localKey + ": " + localStorage[localKey] + "<br>";
        //        delete localStorage[localKey];
    }
    document.body.innerHTML = debugInfo;
}

//showAllLocalStorageStorage();
let currentPlayerId = getCurrentPlayerId();
let sign = localStorage['cf#sign#' + currentPlayerId];
console.log("currentPlayerId: " + currentPlayerId)
determineSign();

findSpanFractionsPlace();
loadTalentsFromLocalStorage();
initListFractions();
initListTalents();
