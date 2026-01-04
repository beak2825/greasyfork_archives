// ==UserScript==
// @name         roulette_phone_friendly
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  roulette_phone_friendly_new
// @author       Salmon
// @match        /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(roulette).php*/
// @include      /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(roulette).php*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514526/roulette_phone_friendly.user.js
// @updateURL https://update.greasyfork.org/scripts/514526/roulette_phone_friendly.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //common styles
    const styledBtn = 'border: none; overflow: hidden; width:350px; margin-bottom: 4px; margin-top: 4px; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s;transition: filter .15s;'

    //constants

    const createEl = (el, style, innerText, placeholder, type) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        if (placeholder) element.placeholder = placeholder;
        if (type) element.type = type;
        return element;
    }

    let link = [...document.getElementsByTagName('a')];
    link = link.filter(el => el.innerText === 'Прошлая игра');
    if (link[1] === undefined) {
        setTimeout(() => location.reload(), 10000);
        return;
    } else {
        link = link[1].href;
    }

    //show/hide Script panel
    let toogleRouletteScript = JSON.parse(localStorage.getItem('toogleRouletteScript'));
    if (toogleRouletteScript === null) localStorage.setItem('toogleRouletteScript', JSON.stringify(true));
    let toogleShow = toogleRouletteScript;
    const toogleRouletteScriptBtn = createEl('div', 'width: 90px; height: 90px; border-radius: 100%; background: wheat; cursor: pointer; position: absolute; z-index: 99999; top: 110px; left: 5px;');
    toogleRouletteScriptBtn.addEventListener('click', () => {
        toogleShow = !toogleShow;
        localStorage.setItem('toogleRouletteScript', JSON.stringify(toogleShow));
        panel.style.visibility = toogleShow ? 'visible' : 'hidden';
    })
    toogleRouletteScriptBtn.innerHTML = `<div><img style='width: 90px; height: 90px' src='https://cfcdn.lordswm.com/i/new_top/_panelRoulette.png'/></div>`;
    document.body.appendChild(toogleRouletteScriptBtn);

    //Bet value
    let moneyValue = JSON.parse(localStorage.getItem('moneyValue'));
    if (moneyValue === null) localStorage.setItem('moneyValue', JSON.stringify(1000));
    const setMoneyValue = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'ставка', 'number');
    const setMoneyValueBtn = createEl('button', styledBtn, 'Задать ставку');
    const setMoneyValueInfoBlock = createEl('div', 'font-weight: bold;', `Ставка: ${moneyValue}`);

    setMoneyValueBtn.addEventListener('click', () => {
        localStorage.setItem('moneyValue', JSON.stringify(setMoneyValue.value));
        location.reload();
    });

    //Bet buttons and inputs
    let betInput = [...document.getElementsByTagName('input')]
    betInput = betInput.filter(el => el.name === 'bet')[0];

    let betType = [...document.getElementsByTagName('input')]
    betType = betType.filter(el => el.name === 'bettype')[0];

    let betBtn = [...document.getElementsByTagName('input')]
    betBtn = betBtn.filter(el => el.value === 'Поставить!')[0];

    //Creating panel element and playstyle buttons
    const panel = createEl('div', 'position: absolute; top: 150px; right: 30px; width: 450px; heigth: 250px; background-color: wheat; padding: 7px; text-align: center;', '');
    panel.style.visibility = toogleShow ? 'visible' : 'hidden';

    const resetBtn = createEl('div', 'width: 40px; height: 40px; cursor: pointer;');
    resetBtn.innerHTML = `<div><img style='width: 40px; height: 40px' src='https://cfcdn.lordswm.com/i/pl_info/btn_reset.png'/></div>`;
    const br = createEl('div', 'border-radius: 7px; border-bottom: 4px solid rgb(218, 183, 97); ; border-top: 4px solid rgb(218, 183, 97); margin: 6px;');

    //Setting Gameplays
    let playOneNum = JSON.parse(localStorage.getItem('playOneNum'));
    if (playOneNum === null) localStorage.setItem('playOneNum', JSON.stringify(true));

    let playToogle = JSON.parse(localStorage.getItem('playToogle'));
    if (playToogle === null) localStorage.setItem('playToogle', JSON.stringify(false));

    const setPlayToogle = createEl('button', styledBtn, `${playToogle ? 'Остановить скрипт' : 'Запустить скрипт'}`)

    setPlayToogle.addEventListener('click', () => {
        let toogle = playToogle;
        localStorage.setItem('playToogle', JSON.stringify(!playToogle));
        location.reload();
    });

    panel.appendChild(setPlayToogle);
    panel.appendChild(setMoneyValue);
    panel.appendChild(setMoneyValueInfoBlock);
    panel.appendChild(setMoneyValueBtn);

    document.body.appendChild(panel);

    //Gameplays
    if (playOneNum === true) {
        let num_to_play_ls = JSON.parse(localStorage.getItem('num_to_play_ls'));
        let num_to_play_count_ls = JSON.parse(localStorage.getItem('num_to_play_count_ls'));

        if (num_to_play_ls == null) {
            localStorage.setItem('num_to_play_ls', JSON.stringify(0));
            location.reload();
        } else if (num_to_play_count_ls == null) {
            localStorage.setItem('num_to_play_count_ls', JSON.stringify(0));
            location.reload();
        }

        const playBlock = createEl('div', 'diplay: flex; flex-directon: column');
        const setNumToPlayInput = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'вказати число, яке потрібно ловити', 'number');
        const setNumCountInput = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'кількість спінів', 'number');
        const setNumToPlayBtn = createEl('button', styledBtn, 'Зберегти вказане число');
        const setNumCountBtn = createEl('button', styledBtn, 'Зберегти кількість спінів');
        const numToPlayInfoBlock = createEl('div', 'font-weight: bold; font-size: 15px;', '');
        const numsCounterInfoBlock = createEl('div', 'font-weight: bold; font-size: 15px;', '');

        resetBtn.addEventListener('click', () => {
            localStorage.setItem('num_to_play_ls', JSON.stringify(0));
            localStorage.setItem('num_to_play_count_ls', JSON.stringify(0));
            location.reload();
        })

        setNumToPlayBtn.addEventListener('click', () => {
            if (setNumToPlayInput.value.length !== 0) {
                localStorage.setItem('num_to_play_ls', JSON.stringify(Number(setNumToPlayInput.value)));
                location.reload();
            } else {
                alert('Вкажіть число!')
            }
        })

        setNumCountBtn.addEventListener('click', () => {
            if (setNumCountInput.value.length !== 0) {
                localStorage.setItem('num_to_play_count_ls', JSON.stringify(Number(setNumCountInput.value)));
                location.reload();
            } else {
                alert('Вкажіть кількість спінів!')
            }
        })

        playBlock.appendChild(setNumToPlayInput);
        playBlock.appendChild(setNumToPlayBtn);
        playBlock.appendChild(setNumCountInput);
        playBlock.appendChild(setNumCountBtn);
        playBlock.appendChild(numToPlayInfoBlock);
        playBlock.appendChild(numsCounterInfoBlock);

        numToPlayInfoBlock.innerText = `Зараз ловимо число ${num_to_play_ls}`;
        numsCounterInfoBlock.innerText = `Залишилося спінів ${num_to_play_count_ls}`;

        panel.appendChild(playBlock);

        let checkMyBet = [...document.getElementsByTagName('center')];
        checkMyBet = checkMyBet[3].parentElement;
        checkMyBet = checkMyBet.getElementsByTagName('tr')[1].getElementsByTagName('td')[1].innerText;
        if (num_to_play_count_ls <= 0) {
            playToogle = false;
            localStorage.setItem('playToogle', JSON.stringify(playToogle));
        }
        if (playToogle) {
            if (checkMyBet.includes('Straight up')) {
                return;
            } else {
                betInput.value = moneyValue;
                betType.value = `Straight up ${num_to_play_ls}`;
                localStorage.setItem('num_to_play_count_ls', JSON.stringify(Number(num_to_play_count_ls - 1)));
                betBtn.click();
            }
        }
    }

})();