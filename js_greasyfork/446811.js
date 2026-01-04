// ==UserScript==
// @name         Auto_Award_Profile_RUS
// @namespace    https://steamcommunity.com/tradeoffer/new/?partner=159892417&token=m2nYmjZz
// @version      2.7
// @description  Steam
// @author       BLYFIN
// @include      /https://steamcommunity\.com/(id|profiles)/[^\/]+/?$/
// @connect      steamcommunity.com
// @connect      steampowered.com
// @license      AGPL-3.0
// @icon         https://icon-icons.com/downloadimage.php?id=135152&root=2248/ICO/512/&file=steam_icon_135152.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/446811/Auto_Award_Profile_RUS.user.js
// @updateURL https://update.greasyfork.org/scripts/446811/Auto_Award_Profile_RUS.meta.js
// ==/UserScript==

let Version = '2.7';
let Vmode = false;
let Vgoal = 0;
let Vleft = 0;
let Vname = '';
let Vpoint = 0;
let Vpoint_now = -1;
let Vtimer = -1;
(() => {
    'use strict';
    addPanel();
    loadConf();
    if (checkSelf()) {
        document.getElementById('p_dashang').style.display = 'none';
    } else {
        if (Vmode && checkTarget()) {
            panelSwitch();
            getMyPoint();
            window.onload = autoAward;
        } else {
            getMyPoint();
        }
    }
})();
function addPanel() {
    function genButton(text, foo) {
        let a = document.createElement('a');
        let s = genSpan(text);
        a.className = 'pagebtn';
        a.addEventListener('click', foo)
        a.appendChild(s);
        return a;
    }
    function genDiv(cls) {
        let d = document.createElement('div');
        if (cls) { d.className = cls };
        return d;
    }
    function genDivBox(title) {
        let d = genDiv('showcase_content_bg');
        if (title) {
            d.appendChild(genLabel(title));
            d.appendChild(genBr());
        }
        return d;
    }
    function genSpan(text) {
        let s = document.createElement('span');
        s.className = 'commentthread_header_label';
        s.textContent = text;
        return s;
    }
    function genLabel(text, bind) {
        let s = document.createElement('label');
        s.className = 'commentthread_header_label';
        s.textContent = text;
        if (bind) { s.setAttribute('for', bind); }
        return s;
    }
    function genInput(name, title, value, tips, enable) {
        let d = genDiv();
        if (title) { d.appendChild(genLabel(title + '  ', name)); }
        let i = document.createElement('input');
        i.name = name;
        i.id = name;
        i.style.textAlign = 'right';
        i.style.border = 'none';
        i.style.width = '140px';
        if (value) { i.value = value; }
        if (tips) { i.placeholder = tips; }
        if (enable != null) {
            i.disabled = !enable;
            if (enable == false) {
                i.style.background = '#3b3b3b';
                i.style.color = '#fff';
            } else {
                i.style.background = '#fff';
                i.style.color = '#3b3b3b';
            }
        }
        d.appendChild(i);
        return d;
    }
    function genTextArea(name, value, tips) {
        let d = genDiv();
        let i = document.createElement('textarea');
        i.name = name;
        i.id = name;
        i.style.width = '100%';
        i.style.height = '200px';
        i.style.resize = 'vertical';
        i.style.fontSize = '12px';
        if (value) { i.value = value; }
        if (tips) { i.placeholder = tips; }
        d.appendChild(i);
        return d;
    }
    function genLink(text, href, tips) {
        let a = document.createElement('a');
        a.href = href;
        a.text = text;
        if (tips) { a.setAttribute('data-tooltip-html', tips); }
        a.style.textDecoration = 'underline';
        a.className = 'whiteLink';
        return a;
    }
    function genSpace() {
        return genSpan('    ');
    }
    function genBr() {
        return document.createElement('br');
    }
    function genMidBtn(text, foo) {
        let a = document.createElement('a');
        let s = genSpan(text);
        a.className = 'btn_profile_action btn_medium';
        a.addEventListener('click', foo)
        a.appendChild(s);
        return a;
    }
    let bSwitch = genMidBtn('C', panelSwitch);
    let btnArea = document.querySelector('.profile_header_actions');
    btnArea.appendChild(genSpace());
    btnArea.appendChild(bSwitch);
    btnArea.appendChild(genSpace());

    let panelArea = document.querySelector('.profile_rightcol');
    let panel = genDiv('profile_count_link_preview');
    panel.id = 'autoaward';
    panel.style.display = 'none';
    let pTitle = genDiv('profile_count_link ellipsis');
    pTitle.style.textAlign = 'center';

    let pTips1 = genLabel('АвтоПоинт' + Version + ' - ByBLYFIN+Chr_');

    let pLink1 = genLink('Наградить автора', 'https://steamcommunity.com/id/_880005553535_/', 'Спасибо за поддержку');
    let pSpare = genLabel(' | ');

    pTitle.appendChild(pTips1);
    pTitle.appendChild(genBr());
    pTitle.appendChild(pLink1);
    pTitle.appendChild(pSpare);

    let pContent = document.createElement('div');
    pContent.className = 'profile_customization_block';
    pContent.style.paddingTop = '0';
    panelArea.insertBefore(panel, panelArea.children[0]);
    panel.appendChild(pTitle);
    panel.appendChild(pContent);

    let dAwardOption = genDivBox('【панель управления】');
    dAwardOption.id = 'p_dashang';

    let iRecvAmount = genInput('recv_amount', 'Получит баллов：', '', 'Кратно 100', true);
    let iSendAmount = genInput('send_amount', 'Спишется баллов：', '', 'Кратно 300', false);
    let myPoint = genInput('my_point', 'Мои баллы：', '', 'Счет оставшихся баллов', false);
    let process = genInput('process', 'текущий прогресс：', '', 'Не установлен', false);

    iRecvAmount.children[1].textAlign = 'center';
    iRecvAmount.children[1].type = 'number';
    iRecvAmount.children[1].setAttribute('step', '100');
    iRecvAmount.children[1].setAttribute('min', '0');
    iRecvAmount.children[1].setAttribute('max', '6600');
    iRecvAmount.children[1].addEventListener('input', calcPoint);
    myPoint.setAttribute('data-tooltip-html', 'Нажмите, чтобы обновить');
    myPoint.addEventListener('click', getMyPoint);

    let btnSetGoal = genButton('Цель', setGoal);
    let btnClearGoal = genButton('Перезагрузить', resetGoal);
    let btnStart = genButton('Старт', startAward);

    dAwardOption.appendChild(iRecvAmount);
    dAwardOption.appendChild(iSendAmount);
    dAwardOption.appendChild(myPoint);
    dAwardOption.appendChild(process);
    dAwardOption.appendChild(genBr());
    dAwardOption.appendChild(btnSetGoal);
    dAwardOption.appendChild(genSpace());
    dAwardOption.appendChild(btnClearGoal);
    dAwardOption.appendChild(genSpace());
    dAwardOption.appendChild(btnStart);
    pContent.appendChild(dAwardOption);

    let dHistory = genDivBox('【История】(Потраченных очков)');
    let txtHistory = genTextArea('op_history', '', 'Здесь отображается история операций');
    let btnTotal = genButton('Статистика баллов', historyReport);
    let btnClear = genButton('Очистить историю', clearHistory);
    let txtTips2 = genLabel('Слишком много записей в истории может быть проблематичным, пожалуйста, обратите внимание на очистку записей.', '');
    dHistory.appendChild(txtHistory);
    dHistory.appendChild(btnTotal);
    dHistory.appendChild(genSpace());
    dHistory.appendChild(btnClear);
    dHistory.appendChild(genBr());
    dHistory.appendChild(txtTips2)
    pContent.appendChild(dHistory);
}
// 自动打赏
function autoAward() {
    const max = 50; // максимальное количество попыток
    let tries = 0; // в екущее время

    retry(reviewAward, 50);

    // Обработка кнопок вознаграждения
    function reviewAward() {
        let reward = document.querySelector('.profile_header_actions>a[href*="AddProfileAward"]');
        if (reward) {
            reward.click();
            tries = 0;
            retry(waitLoad, 600);
        } else {
            retry(reviewAward, 100);
        }
    }
    // Дождитесь полной загрузки
    function waitLoad() {
        let doms = document.querySelectorAll('button[class^=awardmodal_Button_] span[class^=awardmodal_Points_]');
        let tips = document.querySelector('div[class^=awardmodal_Description_]')
        if (doms && tips) {
            tips.textContent = 'Закройте окно подсказки, чтобы прервать операцию';
            tries = 0;
            checkPoint();
        } else {
            retry(waitLoad, 600);
        }
    }
    // Проверьте количество поинтов, чтобы определить была ли операция успешной
    function checkPoint() {
        if (Vpoint_now >= 0) {
            document.getElementById('my_point').value = numAddDot(Vpoint_now);
            if (Vpoint > Vpoint_now) { // Баллы изменились, награда успешна
                log('向 ' + Vname + ' награда ' + (Vpoint - Vpoint_now).toString() + ' 点');
                Vleft -= (Vpoint - Vpoint_now);
                Vpoint = Vpoint_now;
                saveConf();
                updateProcess();
            }
            if (Vpoint < 300) { // Недостаточно очков, остановите операцию
                throw 'Недостаточно очков, операция завершена';
            }
            if (Vleft <= 0) { // Вознаграждение завершено, завершите операцию
                throw 'Награда отправлена';
            }
            tries = 0;
            selectReward();
        } else {
            retry(checkPoint, 300);
        }
    }
    // Выберите награду
    function selectReward() {
        let btns = document.querySelectorAll('button[class^=awardmodal_Button_]');
        let max = 0;
        for (let btn of btns) { // Найдите самый большой хер
            if (btn.classNames().toString().search('Disabled') != -1) {
                continue; // Пропуск варианта, который был вознагражден
            }
            let point = btn.querySelector('span[class^=awardmodal_Points_]');
            let tmp = Number(point.textContent.replace(/,/g, ''));
            if (tmp <= Vleft && tmp <= Vpoint_now) {
                if (tmp > max) {
                    max = tmp;
                }
            }
        }
        if (max == 0) { //Если нет подходящего предмета награды, операция будет прекращена
            throw 'Нет подходящей награды, пожалуйста, измените оценку'
        }
        for (let btn of btns) { // Найдите самый большой совет
            if (btn.classNames().toString().search('Disabled') != -1) {
                // Пропустить уже предложенные варианты
                continue;
            }
            let point = btn.querySelector('span[class^=awardmodal_Points_]');
            let tmp = Number(point.textContent.replace(/,/g, ''));
            if (tmp == max) {
                btn.click();
                break;
            }
        }
        tries = 0;
        retry(sendReward, 100);
    }
    function sendReward() {
        let btns = document.querySelector('div[class^=awardmodal_Actions_]');
        if (btns) {
            if (btns.childElementCount == 1) {
                btns.querySelector('button.Primary').click();
                tries = 0;
                retry(sendReward2, 100);
            } else { // Есть несколько элементов, представляющих недостаточное количество баллов;
                throw 'Недостаточно баллов, операция отменена';
            }
        } else {
            retry(sendReward, 100);
        }
    }
    // Отправка наград
    function sendReward2() {
        let btn = document.querySelector('div[class^=awardmodal_Actions_] button.Primary');
        if (btn) { // Он будет обновлен после награды
            btn.click();
            // Отключить обновление
            noReload(true);
            closePanel();
            closePanel();
            retry(waitAnimation, 1000);
        } else { // Есть несколько элементов, представляющих недостаточное количество баллов;
            throw 'Недостаточно баллов, операция отменена';
        }
    }
    // дождитесь окончания анимации
    function waitAnimation() {
        // обновить баланс
        noReload(false);
        Vpoint_now = -1;
        getMyPoint();
        // следующий раунд наград
        retry(reviewAward, 50);
    }
    // закрыть панель
    function closePanel() {
        let close = document.querySelector('.closeButton');
        if (close) {
            close.click();
        }
    }
    // автоматический повтор
    function retry(foo, t) {
        console.log(foo.name);
        if (tries++ <= max) {
            setTimeout(() => {
                try {
                    foo();
                } catch (e) {
                    log(e);
                    if (e.toString().search('конец операции') != -1) {
                        Vmode = false;
                        saveConf();
                    } else if (e.toString().search('операция завершена') != -1) {
                        Vmode = false;
                        saveConf();
                        closePanel();
                    } else {
                        closePanel();
                    }
                }
            }, t);
        } else {

            log('Время ожидания операции истекло, автоматическое обновление');
            window.location.reload();
        }
    }
}
// поставить цель
function setGoal() {
    let goal = Number(numRemoveDot(document.getElementById('send_amount').value));
    if (Vpoint_now < 0) {
        ShowAlertDialog('Подсказка', 'Текущие баллы еще не отправлены, пожалуйста, подождите!');
        return;
    }
    if (goal != goal || goal <= 0) {
        ShowAlertDialog('ошибка', 'Наградные баллы должны быть больше 0!');
        return;
    }
    Vmode = true;
    Vgoal = goal;
    Vleft = goal;
    Vname = document.querySelector('.persona_name .actual_persona_name').textContent.strip();
    Vpoint = Vpoint_now;
    saveConf();
    updateProcess();
    ShowAlertDialog('подсказка', 'Цель установлена, ожидается запуск.<br><br>Нажмите [Старт], чтобы начать!<br><br>Нажмите [Сброс], чтобы прервать операцию (обновление страницы вручную не прерывает работу скрипта)!<br><br>一После того, как вознаграждение за обзор закончено, вы можете вручную изменить обзор, чтобы продолжить работу.');
}
// цель
function resetGoal() {
    Vmode = false;
    Vgoal = 0;
    Vleft = 0;
    Vname = '';
    Vpoint = Vpoint_now;
    saveConf();
    document.getElementById('send_amount').value = '';
    document.getElementById('recv_amount').value = '';
    updateProcess('');
    calcPoint();
    window.location.reload();
}
// Авто
function startAward() {
    if (Vmode) {
        if (!checkTarget()) {
            if (confirm('Непоследовательные операции! Рекомендуется выполнить сброс\n\nНажмите【Подтвердить】для прекращения операции, нажмите【Отмена】для игнорирования ошибки и продолжения')) {
                return;
            }
        }
        autoAward();
    } else {
        ShowAlertDialog('ошибка', 'Цель еще не поставлена!');
    }
}
function log(message) {
    console.log(message)
    let iHistory = document.getElementById('op_history');
    iHistory.value += message + '\n';
    iHistory.scrollTop = iHistory.scrollHeight;
    GM_setValue('history', iHistory.value.strip());
}
function calcPoint() {
    let send = document.getElementById('send_amount');
    let recv = document.getElementById('recv_amount');
    let mine = document.getElementById('my_point');
    let rtmp = Number(recv.value);
    let mtmp = Number(numRemoveDot(mine.value));
    if (rtmp != rtmp || recv.value == '') {
        send.value = '';
        mine.style.color = '#fff';
    } else {
        rtmp = Math.ceil(rtmp / 100) * 300;
        if (rtmp > 19800) {
            rtmp = 19800;
        }
        send.value = numAddDot(rtmp);
        mine.style.color = (rtmp > mtmp) ? '#f00' : '#fff';
    }
}
function getMyPoint() {
    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://store.steampowered.com/points/shop/',
        onload: (response) => {
            if (response.status == 200) {
                let t = response.responseText.match(/\{\&quot\;points\&quot\;\:\&quot\;(\d+)\&quot\;/);
                console.log(t)
                t = t ? t[1] : -1;
                if (t < 0) {
                    log('Не удалось получить баллы, автоматическое обновление');
                    window.location.reload();
                }
                Vpoint_now = Number(t);
                document.getElementById('my_point').value = numAddDot(Vpoint_now);
                calcPoint();
            }
        },
        onerror: (response) => {
            window.location.reload();
        }
    });
}
function clearHistory() {
    GM_setValue('history', '');
    document.getElementById('op_history').value = '';
}
function historyReport() {
    let list = document.getElementById('op_history').value.split('\n');
    let dic = {};
    for (let txt of list) {
        let match = txt.match(/в пути (.*) награда (\d+) Поинтов/);
        if (match) {
            console.log(match)
            let name = match[1].replace(/\s/g, '');
            let value = Number(match[2]);
            if (dic[name] == undefined) {
                dic[name] = value;
            } else {
                dic[name] += value;
            }
        }
    }
    console.log(JSON.stringify(dic))
    log('====Статистика баллов====')
    for (let n in dic) {
        log(n + ' 共计 ' + dic[n] + ' 点');
    }
    log('====Статистика баллов====')
}
function panelSwitch() {
    let panel = document.getElementById('autoaward');
    if (panel.style.display == 'none') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}
function checkSelf() {
    return document.querySelector("#account_pulldown").textContent.strip() ==
        document.querySelector('.persona_name .actual_persona_name').textContent.strip();
}
function checkTarget() {
    return document.querySelector('.persona_name .actual_persona_name').textContent.strip() == Vname;
}
function numAddDot(num) {
    return (num + '').replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,');
}
function numRemoveDot(num) {
    return num.replace(/,/g, '')
}
function updateProcess(msg) {
    if (msg != null) {
        document.getElementById('process').value = msg;
    } else {
        document.getElementById('process').value = ((Vgoal - Vleft) / Vgoal * 100).toFixed(1) + '% ' + numAddDot(Vgoal - Vleft);
    }
}
function loadConf() {
    let mode = GM_getValue('mode');
    Vmode = mode ? true : false;
    if (Vmode) {
        let goal = GM_getValue('goal');
        Vgoal = goal ? goal : 0;
        document.getElementById('send_amount').value = numAddDot(Vgoal);
        document.getElementById('recv_amount').value = Vgoal / 3;
        let left = GM_getValue('left');
        Vleft = left ? left : 0;
        let point = GM_getValue('point');
        Vpoint = point ? point : 0;
        let name = GM_getValue('name');
        Vname = name ? name : '';
        updateProcess();
    }
    let history = GM_getValue('history');
    if (history) {
        let iHistory = document.getElementById('op_history')
        iHistory.value = history + '\n';
        iHistory.scrollTop = iHistory.scrollHeight;
    }
}
function saveConf() {
    GM_setValue('mode', Vmode);
    GM_setValue('goal', Vgoal);
    GM_setValue('left', Vleft);
    GM_setValue('name', Vname);
    GM_setValue('point', Vpoint);
}
function noReload(enable = false) {
    if (enable && Vtimer == -1) {
        Vtimer = setInterval(() => {
            window.stop();
        }, 100);
    } else if (!enable) {
        clearInterval(Vtimer);
        Vtimer = -1;
    }
}