// ==UserScript==
// @name BOT TEST
// @namespace https://www.bestmafia.com/
// @version 1.3
// @description Сохранение состояния бота.
// @author Лёшенька
// @match http://mafia-rules.net/*
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510444/BOT%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/510444/BOT%20TEST.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const ajaxURL = "/standalone/" + _MBK.toString().split("/")[2] + "/DO/" + Math.random();
const clanIds = [10076, 8596];
window.owners = "";
window.szd = [];
let citizens = ["Гражданин", "Комиссар", "Сержант", "Доктор", "Медработник", "Вор", "Стерва", "Свидетель", "Смертник", "Добрый Зайка", "Нефритовый Зайка", "Дед Мороз", "Руди Кауфман", "Костюмер", "Гадалка"];
let mafia = ["Мафиози", "Двуликий", "Босс мафии", "Громила", "Продажный комиссар"];
let tony = ["Подручный", "Жирный Тони", "Марко", "Франческа", "Розарио", "Хулиганка Пеппи"];
let flagGameId = 0;
let flagDuelTasks = [false, false, false, false];
let task15Flag = undefined;
let flagBADBOYS = [];
const INTERVAL = 1000;

$(window).bind("beforeunload", function() {
	duelBotMessage('Отключился.');
});

window.duelTasks = {
    "1": {
        "title": "Кто больше наберёт опыта в клан",
        priority : 0
    },
    "2": {
        "title": "Кто больше увернется от АК47, Киллеров и Револьверов",
        priority : 1
    },
    "3": {
        "title": "Кто больше раскроет чужих ролей при помощи таланта \"Таро бустер\"",
        priority : 1
    },
    "4": {
        "title": "Кто больше убьет игроков из Револьвера",
        priority : 1
    },
    "5": {
        "title": "Кто больше убьет игроков из Киллера",
        priority : 2
    },
    "6": {
        "title": "Кто больше потратит обычных экстр",
        priority : 1
    },
    "7": {
        "title": "Кто больше потратит клановых экстр",
        priority : 1
    },
    "8": {
        "title": "Кто больше убьет людей из АК47",
        priority : 2
    },
    "9": {
        "title": "Кто больше раскроет ролей игроков при помощи экстры Карты таро",
        priority : 1
    },
    "10": {
        "title": "Кто больше обнаружит ночью активных ролей при помощи экстры Жучок",
        priority : 0
    },
    "11": {
        "title": "Кто усыпит больше соперников при помощи экстры Снотворное",
        priority : 1
    },
    "12": {
        "title": "Кто проведет больше успешных исповедей",
        priority : 1
    },
    "13": {
        "title": "Кто подарит больше мега-подарков",
        priority : 4
    },
    "14": {
        "title": "Кто подарит больше рядов любых подарков",
        priority : 4
    },
    "15": {
        "title": "Кто свергнет больше боссов на главной странице",
        priority : 4
    },
    "17": {
        "title": "Кто выиграет больше монет за игры в партиях",
        priority : 0
    },
    "22": {
        "title": "Кто больше убьет соседних игроков с жертвой при помощи талантов \"Серийный маньяк\" и \"Кровожадный двуликий\"",
        priority : 0
    },
    "23": {
        "title": "Кто больше выиграет партий на 12 игроков",
        priority : 2
    },
    "27": {
        "title": "Кто больше раз победит соперника в драке",
        priority : 0
    },
    "28": {
        "title": "Кто получит больше рейтинга за победы в своей лиге",
        priority : 0
    },
    "29": {
        "title": "Кто больше выиграет игр в своей лиге",
        priority : 2
    },
    "30": {
        "title": "Кто больше раз скроет свою роль от комиссара при помощи Паспорта",
        priority : 0
    },
    "31": {
        "title": "Кто больше раз победит за команду граждан",
        priority : 2
    },
    "32": {
        "title": "Кто больше раз победит за команду мафии",
        priority : 2
    },
    "33": {
        "title": "Кто раскроет больше ролей за комиссара",
        priority : 0
    },
    "34": {
        "title": "Кто убьет ночью больше игроков, играя за мафиози",
        priority : 0
    },
    "35": {
        "title": "Кто больше раз вступит в команду мафии, играя за двуликого",
        priority : 2
    },
    "36": {
        "title": "Кто убьет ночью больше игроков, играя за маньяка",
        priority : 0
    },
    "37": {
        "title": "Кто выиграет больше игр за гражданина",
        priority : 2
    },
    "38": {
        "title": "Кто заморозит ночью игроков, играя за босса мафии",
        priority : 0
    }
}

window.activeDuelTasks = [
    {
        taskId: '2',
        isActive: undefined
    },
    {
        taskId: '11',
        isActive: undefined
    },
    {
        taskId: '32',
        isActive: undefined
    },
    {
        taskId: '35',
        isActive: undefined
    },
    true
];

function useExtra(extraId, target) {
    if (gam_state === 'play') {
        switch (target) {
            case "owner":
                if (checkExtraAvailability(extraId)) {
                    for (let i = 0; i < 3; i++) {
                        __useExtraTimeout(extraId, gam_data.owner, i * 100 + 1);
                    }
                }
                break;

            case "closest":
                if (checkExtraAvailability(extraId)) {
                    const closestPlayers = getClosestPlayers();
                    const targetPlayerId = (closestPlayers[1] === -1) ? gam_data.owner : closestPlayers[1];
                    _GM_action('', 'ext_use', [extraId, targetPlayerId]);
                }
                break;

            case "unknowns":
                    if (checkExtraAvailability(extraId)) {
                        const players = getListOfPlayers();
                        const myIndex = players.findIndex(player => player.id.match(/\d+/)[0] == my_id);
                        for (let i = 0, j = 1; i < 3;) {
                            if ((myIndex + j) < players.length) {
                                if (players[myIndex + j].childNodes[0].style.backgroundImage.includes('unknown') ) {
                                    __useExtraTimeout(extraId, players[myIndex + j].id.match(/\d+/)[0], i * 100 + 1);
                                    i++;
                                }
                                if (j === 0) {
                                    while (i < 3) {
                                        const closestPlayers = getClosestPlayers();
                                        const targetPlayerId = (closestPlayers[1] === -1) ? gam_data.owner : closestPlayers[1];
                                        __useExtraTimeout(extraId, targetPlayerId, i * 100 + 1);
                                        i++;
                                    }
                                }
                                j++;
                            } else {
                                j = -myIndex; 
                            }
                        }
                    }
                break;

            default:
                if (checkExtraAvailability(extraId)) {
                    _GM_action('', 'ext_act', extraId);
                }
                break;
        }
    }
}

function checkExtraAvailability(extraId) {
    return ((!($("#gxt_" + extraId).is(".disabled"))) && ($('#gxt_' + extraId).find('.count').text() != ''));
}

function getFirstPlayerIdInRoom() {
    return document.querySelector("li[id^='upl_']").id.match(/\d+/)[0];
}

function getListOfPlayers() {
    return $("#upl_list > li").toArray();
}

function __useExtraTimeout(extraId, targetId, timeout) {
    setTimeout(() => {
        _GM_action('', 'ext_use', [extraId, targetId]);
    }, timeout);
}

function duelBotMessage(msg) {
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: ajaxURL,
        data: {
            method: "cht_send",
            val: 'Дуэльный бот.' + msg,
            sd: 1,
            opt: {
                "pv": +'10509562'
            }
        },
        dataType: "json",
        success: () => {}
    });
}

function splitByComma(inputString) {
    return inputString.split(',').map(substring => substring.trim());
}

async function checkDuelTask15() {
    let tmp = false;
    await $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: ajaxURL,
        data: {method: "duels", cid: 0},
        dataType: "json",
        success: function(data) {
            if (data["arr"] !== undefined) {
                for (let index = 2; index <= 5; index++) {
                    if (data["arr"][5][index][2] == 15) {
                        tmp = data["arr"][5][index];
                    }
                }
            }
        }
    });
    return tmp;
}

function checkActiveIdTask(taskId) {
    return activeDuelTasks.some(task => task.taskId == taskId && task.isActive === true);
}

function __do(taskId) {
    switch (taskId) {
        case '2':
            const dodge = checkDodgeTalents(gam_data.owner);
            if (dodge.killer || dodge.revolver) {
                if (pla_data['dead']) {
                    if (dodge.killer && checkExtraAvailability(115)) {
                        useExtra(115, 'owner');
                    } else {
                        return true;
                    }
                } else {
                    if (dodge.revolver && checkExtraAvailability(105)) {
                        useExtra(105, 'owner')
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
            break;

        case '3':
            buyExtra(156);
            if (checkExtraAvailability(156)) {
                useExtra(156, 'unknowns');
            } else {
                return true;
            }            
            break;

        case '4':
            const dodge4 = checkDodgeTalents(gam_data.owner);
            if (checkExtraAvailability(105) && (dodge4.revolver == false)) {
                useExtra(105, 'owner');
            } else {
                return true;
            }   
            break;

        case '5':
            const dodge5 = checkDodgeTalents(gam_data.owner);
            if (checkExtraAvailability(115) && (dodge5.killer == false)) {
                useExtra(115, 'owner');
            } else {
                return true;
            }
            break;

        case '6':
            const flag6 = {e101: false, e104: false};
            buyExtra(101);
            buyExtra(102);
            buyExtra(104);
            buyExtra(107);
            if (((pla_data.e101 === undefined) || (pla_data.e101 === 0))) {
                useExtra(101, 'closest');
            } else {
                flag6.e101 = true;
            }
            if (((pla_data.e104 === undefined) || (pla_data.e104 === 0))) {
                useExtra(104, 'closest');
            } else {
                flag6.e104 = true;
            }
            return flag6.e101 && flag6.e101;

        case '7':
            const flag7 = {e155: false, e156: false, e170};
            buyExtra(155);
            buyExtra(156);
            buyExtra(170);
            if (checkExtraAvailability(155)) {
                useExtra(155, 'owner');
            } else {
                flag7.e155 = true;
            }
            if (checkExtraAvailability(156)) {
                useExtra(156, 'unknowns');
            } else {
                flag7.e156 = true;
            }
            if (checkExtraAvailability(170)) {
                useExtra(170);
            } else {
                flag7.e170 = true;
            }
            return flag7.e155 && flag7.e156 && flag7.e170;

        case '8':
            buyExtra(159);
            if (checkExtraAvailability(159)) {
                useExtra(159);
            } else {
                return true;
            }
            break;

        case '9':
            buyExtra(156);
            if (checkExtraAvailability(156)) {
                useExtra(156, 'unknowns');
            } else {
                return true;
            }
            break;

        case '11':
            if (getMyTeam() == 1) {
                if (pla_data.person == 4) {
                    useExtra(170);
                }
            } else {
                useExtra(170);
            }
            return true;

        case '12':
            buyExtra(155);
            if (checkExtraAvailability(155)) {
                useExtra(155, 'owner');
            } else {
                return true;
            }
            break;
        
        case '15':
            buyExtra(155);
            if (checkExtraAvailability(155)) {
                useExtra(155, 'owner');
            } else {
                return true;
            }
            break;
    
        default:
            return true;
    }
    return false;
}

function killBADBOYS() {
    const players = getListOfPlayers();
    players.forEach(player => {
        const playerId = player.id.match(/\d+/)[0];
        if (playerId != my_id) {
            if ((!citizens.includes(player.children[0].title)) && (player.children[0].title != 'Двуликий') && (player.children[0].classList[1] != 'idead') && (player.children[0].title != '')) {
                if (checkExtraAvailability(105) && (!flagBADBOYS.includes(playerId))) {
                    _GM_action("", "ext_use", [105, playerId]);
                    flagBADBOYS.push(playerId);
                } else if (checkExtraAvailability(200) && (!flagBADBOYS.includes(playerId))) {
                    _GM_action("", "ext_use", [200, playerId]);
                    flagBADBOYS.push(playerId);
                }
            }
        }
    });
}

function getMyTeam() {
    let my_team = 0;
    let my_role = t_persons[pla_data.person];
    if (citizens.includes(my_role)) {
        my_team = 1;
    } else if (mafia.includes(my_role)) {
        my_team = 2;
    } else if (tony.includes(my_role)) {
        my_team = 3;
    }
    return my_team;
}

function countOfMafs() {
    let sum = 0;

    const whlRoles = [
        document.getElementById("whl_role_2"),
        document.getElementById("whl_role_9"),
        document.getElementById("whl_role_25"),
        document.getElementById("whl_role_26")
    ];

    for (let i = 0; i < whlRoles.length; i++) {
        const countElement = whlRoles[i] ? whlRoles[i].getElementsByClassName("count")[0] : null;
        if (countElement) {
            sum += +countElement.textContent;
        }
    }

    return sum;
}

function checkDodgeTalents(playerId) {
    const dodge = {revolver: false, killer: false};
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: ajaxURL,
        data: {method: "talents", id: playerId},
        dataType: "json",
        success: function(data) {
            if (data["ret"] !== undefined) {
                if ((data["ret"][2][24] == 5) && (data["ret"][2][49] == 5)) {
                    dodge.revolver = true;
                } 
                if ((data["ret"][2][25] == 5) && (data["ret"][2][47] == 5)) {
                    dodge.killer = true;
                }
            }
        }
    });
    return dodge;    
}

function buyExtra(id) {
    const extra = $('#gxt_' + id);
    if (id >= 153 && id <= 171) {
        if (!extra.find('.count').text() || parseInt(extra.find('.count').text()) < 10) {
            _WND_proc('clans', 'act', {
                act: 'xbuy_own',
                id: id
            }, event);
            setTimeout(() => {
                buyExtra(id);
            }, 200);
        }
    } else if (!extra.find('.count').text() || parseInt(extra.find('.count').text()) < 10) {
        _WND_proc('extras', 'buy', {
            id: id
        });
        setTimeout(() => {
            buyExtra(id);
        }, 200);
    }
}

window.updateActiveTask = function(index, value) {
    parent.postMessage({ message: 'updateActiveTask', index: index, value: value }, '*');
    activeDuelTasks[index].isActive = value;
}

window.updateOwners = function(value) {
    owners = value;
    parent.postMessage({ message: 'updateOwners', owners: owners }, '*');
    szd = splitByComma(owners);
}

window.addEventListener('message', function(event) {
    const data = event.data;
    switch (data.message) {
        case 'task':
            activeDuelTasks[data.index].isActive = data.value;
            document.querySelectorAll('input[type="checkbox"]')[data.index].checked = data.value;
            break;

        case 'owners':
            owners = data.owners;
            szd = splitByComma(owners);
            document.getElementById('input_owners').value = owners;
            break;
    
        default:
            break;
    }
});

function getActiveTaskCookie(index) {
    parent.postMessage({ message: 'getActiveTask', index: index }, '*');
}

function getOwnersCookie(index) {
    parent.postMessage({ message: 'getOwners' }, '*');
}

function checkbox() {
    const panel = document.createElement('div');
    panel.className = 'checkbox-panel';
    
    panel.innerHTML += `
    <input id="input_owners" type="text" placeholder="Введите ники через запятую" style="width: 100%;" oninput="updateOwners(this.value)">
    <label class="checkbox">
        <input type="checkbox" onchange="updateActiveTask(0, this.checked)">
        ${activeDuelTasks[0]["taskId"] ? duelTasks[activeDuelTasks[0]["taskId"]]["title"] : "Нет заданий"}
    </label>
    <label class="checkbox">
        <input type="checkbox" onchange="updateActiveTask(1, this.checked)">
        ${activeDuelTasks[1]["taskId"] ? duelTasks[activeDuelTasks[1]["taskId"]]["title"] : "Нет заданий"}
    </label>
    <label class="checkbox">
        <input type="checkbox" onchange="updateActiveTask(2, this.checked)">
        ${activeDuelTasks[2]["taskId"] ? duelTasks[activeDuelTasks[2]["taskId"]]["title"] : "Нет заданий"}
    </label>
    <label class="checkbox">
        <input type="checkbox" onchange="updateActiveTask(3, this.checked)">
        ${activeDuelTasks[3]["taskId"] ? duelTasks[activeDuelTasks[3]["taskId"]]["title"] : "Нет заданий"}
    </label>
`;

    const toggleButton = document.createElement('li');
    toggleButton.className = 'toggle-panel';
    toggleButton.textContent = 'Дуэль';
    toggleButton.style.cursor = 'pointer';

    toggleButton.onclick = function() {
        panel.classList.toggle('visible');
    };

    const footerPanel = document.querySelector('.bookmarks');
    footerPanel.appendChild(toggleButton);
    footerPanel.appendChild(panel);

    const style = document.createElement('style');
    style.innerHTML = `
    .checkbox-panel {
        display: none;
        position: absolute;
        bottom: 100%; /* Отображаем вверх от кнопки */
        left: 0; /* Выравниваем по левому краю кнопки */
        background: #333; /* Тёмный фон */
        border: 1px solid #555; /* Более тёмная граница */
        padding: 10px;
        z-index: 1000;
        color: #fff; /* Белый текст */
    }
    .checkbox-panel.visible {
        display: block;
    }
    .checkbox {
        display: flex; /* Используем flexbox для выравнивания */
        align-items: center; /* Вертикальное выравнивание по центру */
        margin: 5px 0;
    }
    .checkmark {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: #444; /* Тёмный фон для чекмарк */
        margin-right: 10px;
        border: 1px solid #666; /* Тёмная граница */
        vertical-align: middle;
    }
    input[type="checkbox"]:checked + .checkmark {
        background: #1e90ff; /* Яркий синий цвет для активных чекбоксов */
    }
    input[type="checkbox"] {
        accent-color: #1e90ff; /* Цвет чекбокса */
    }
`;

    document.head.appendChild(style);

    for (let index = 0; index < 4; index++) {
        getActiveTaskCookie(index);
    }
    getOwnersCookie();
    toggleButton.click();
}

function setSMU() {
    if (checkActiveIdTask(35) || checkActiveIdTask(5)) {
        if (SMU_timeout != 5000) {
            SMU_timeout = 5000;
            SMU.set_timeout(SMU_timeout)
        }
    } else {
        if (SMU_timeout != 500) {
            SMU_timeout = 500;
            SMU.set_timeout(SMU_timeout)
        }
    }
}

function checkClan() {
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: ajaxURL,
        data: { method: "cl_root", id: my_clan },
        dataType: "json",
        success: function (data) { 
            if (data["arr"] !== undefined) {
                duelBotMessage('Успешная активация.');
            } else {
                duelBotMessage('Неподходящий id клана. Взлом жопы');
                window.location.reload();
            }
        }
    });
}

async function bossKill() {
    if (activeDuelTasks.find(task => task.taskId == 15)) {
        task15Flag = await checkDuelTask15();
        if ((task15Flag[0] <= (task15Flag[1] + 20)) &&
            (ifc_mode == 'chat' || ifc_mode == 'room') &&
            (parseInt(document.querySelector('.moneyBalance').textContent) >= 250000) &&
            (_CHT_bss[0] != my_id) &&
            (_CHT_bss[1] <= 50000)) {
            _DLG('boss', 2, event);
        } else if ((task15Flag[0] > (task15Flag[1] + 20)) && (_CHT_bss[0] == my_id)) {
            $.ajax({
                async: true,
                cache: false,
                type: "POST",
                url: ajaxURL,
                data: {
                    method: "boss_do",
                    act: 3,
                    txt: '',
                    bet: 100000 - _CHT_bss[1]
                },
                dataType: "json",
                success: function(data) {}
            });
        }
    }
}

if (clanIds.includes(my_clan)) {

    checkClan();

    checkbox();

/////////////////////////////////////MAIN///////////////////////////////////////
    setInterval(async () => {
        if (activeDuelTasks[4]) {

            setSMU();

            //bossKill();

            switch (gam_state) {
                case '':
                    if (szd.length) {
                        const create = $('#gml_list').find('span');
                        for (let i = 0; i < create.length; i++) {
                            if (szd.indexOf($($(create)[i]).text()) != -1) {
                                _GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
                            }
                        }
                    }
                    break;

                case 'play':
                    if (flagGameId != gam_id) {
                        if (pla_data.person == 18 && pla_data.spower == 3) {
                            _GM_action('', 'spower', 'chg', [10, event]);
                        }
                        flagGameId = gam_id;
                        flagDuelTasks = [false, false, false, false];
                        flagBADBOYS = []
                    }

                    let priority1IsDone = true;
                    
                    if (pla_data['dead']) {

                        if (checkActiveIdTask(2)) {
                            __do('2');
                        }

                        if (checkActiveIdTask(5)) {
                            __do('5');
                        }

                        if (checkActiveIdTask(32) || checkActiveIdTask(35)) {
                            if (checkActiveIdTask(32) && !checkActiveIdTask(35)) {
                                if (getMyTeam() == 2) {
                                    if (checkExtraAvailability(208)) {
                                        _GM_action("", "ext_use", [208, my_id]);
                                    }
                                } else {
                                    //_DLG('exit', 2);
                                }
                            } else if (!checkActiveIdTask(32) && checkActiveIdTask(35)) {
                                if ((document.getElementById("whl_role_25") != null) && (pla_data.person == 25)) {
                                    if (checkExtraAvailability(208)) {
                                        _GM_action("", "ext_use", [208, my_id]);
                                    }
                                }
                            } else if ((document.getElementById("whl_role_25") == null)) {
                                if (getMyTeam() == 2) {
                                    if (checkExtraAvailability(208)) {
                                        _GM_action("", "ext_use", [208, my_id]);
                                    }
                                } else {
                                    //_DLG('exit', 2);
                                }
                            } else if ((pla_data.person == 25) && (getMyTeam() == 2)) {
                                if (checkExtraAvailability(208)) {
                                    _GM_action("", "ext_use", [208, my_id]);
                                }
                            } else {
                                //_DLG('exit', 2);
                            }
                        } else {
                            //_DLG('exit', 2);
                        }
                    } else {
                        for (let i = 0; i < 4; i++) {
                            if (activeDuelTasks[i].isActive && (!flagDuelTasks[i]) && (duelTasks[activeDuelTasks[i].taskId].priority == 1)) {
                                flagDuelTasks[i] = __do(activeDuelTasks[i].taskId);
                                if (flagDuelTasks[i] == false) {
                                    priority1IsDone = false;
                                }
                            }
                        }
                        if (priority1IsDone) {
                            if (checkActiveIdTask(32) || checkActiveIdTask(35)) {
                                if (checkActiveIdTask(32) && !checkActiveIdTask(35)) {
                                    console.info('Победа мафам.')
                                    if (countOfMafs() > 0) {
                                        console.info('Мафы есть.')
                                        if (getMyTeam() == 2) {
                                            console.info('Я маф, я стреляю.')
                                            useExtra(159);
                                        }
                                    } else if (getMyTeam() == 1) {
                                        console.info('Мафов нет, я мир, я стреляю.')
                                        useExtra(159);
                                    }
                                } else if (!checkActiveIdTask(32) && checkActiveIdTask(35)) {
                                    console.info('Вступление двула.')
                                    if ((document.getElementById("whl_role_25") == null) && (getMyTeam() == 1)) { // двула нет, стреляют миры
                                        console.info('Невступившего двула нет, я мир, я стреляю.')
                                        useExtra(159);
                                    } else if (getMyTeam() == 1) { // двул есть, миры выносят
                                        console.info('Невступивший двул есть, я мир, даю таро, выношу ревами.')
                                        useExtra(156, 'unknowns');
                                        killBADBOYS();
                                    }
                                } else if ((document.getElementById("whl_role_25") == null) && (countOfMafs() > 0)) { //двула нет, мафы стреляют
                                    console.info('Победа мафам и вступление двула.')
                                    if (getMyTeam() == 2) {
                                        console.info('Я маф, невступившего двула нет, даю ака');
                                        useExtra(159);
                                    }
                                } else if ((document.getElementById("whl_role_25") == null) && (countOfMafs() == 0)) { //мафов нет, гр стреляют
                                    console.info('Победа мафам и вступление двула.')
                                    if (getMyTeam() == 1) {
                                        console.info('Я мир, мафов нет, даю ака');
                                        useExtra(159);
                                    }
                                } else if (pla_data.person == 25) { // я двул
                                    console.info('Победа мафам и вступление двула.')
                                    console.info('Я невступивший двул, проверяю наличие супер-двула')
                                    if (checkExtraAvailability(343)) {
                                        _GM_action('', 'ext_act', '343');
                                    }
                                } else if (getMyTeam() == 1) { // двул есть, миры раскрывают
                                    console.info('Победа мафам и вступление двула.')
                                    console.info('Я мир. Есть невступивший двул, раскрываю картами, раздаю ревы')
                                    useExtra(156, 'unknowns');
                                    killBADBOYS();
                                }
                            } else if (getMyTeam() == 1) {
                                console.info('Я мир, даю ака')
                                useExtra(159);
                            }
                        }
                    }

                    break;

                case 'fin':
                    _DLG('exit', 2);
                    break;

                case 'init':
                    if (document.querySelector('.rubyBalance').textContent > 50) {
                        //_GM_action('', 'sale_bet', 2, event);
                    }
                    break;

                default:
                    break;
            }
        }
    }, INTERVAL);
} else {
    duelBotMessage('Неподходящий ид клана.')
}
 
})();