// ==UserScript==
// @name         hwm_roulette
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  hwm_roulette_script
// @author       Salmon
// @match        https://my.lordswm.com/roulette.php*
// @match        https://www.heroeswm.ru/roulette.php*
// @include      https://my.lordswm.com/roulette.php*
// @include      https://www.heroeswm.ru/roulette.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481164/hwm_roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/481164/hwm_roulette.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //common styles
    const styledBtn = 'border: none; overflow: hidden; width:350px; margin-bottom: 4px; margin-top: 4px; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s;transition: filter .15s;'

    //constants
    const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];

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

    const fetchXml = (callback, link) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', link);
        xhr.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/html; charset=windows-1251');
        }

        xhr.addEventListener('load', () => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(xhr.responseText, "text/html");
            callback(doc);
        })
        xhr.send();
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


    //Resource amount
    let resourceAmount = document.getElementById('ResourceAmount').innerText.replace(',', '');
    let resourceAmountStop = JSON.parse(localStorage.getItem('resourceAmountStop'));
    if (resourceAmountStop === null) localStorage.setItem('resourceAmountStop', JSON.stringify(0));
    const setResourceAmountStop = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'сумма остановки', 'number');
    const setResourceAmountStopBtn = createEl('button', styledBtn, 'Задать сумму остановки');
    const toogleResourceAmountStop = JSON.parse(localStorage.getItem('toogleResourceAmountStop'));
    if (toogleResourceAmountStop === null) localStorage.setItem('toogleResourceAmountStop', JSON.stringify(false));
    const toogleResourceAmountStopBtn = createEl('button', styledBtn, `${toogleResourceAmountStop ? 'Выключить остановку по сумме' : 'Включить остановку по сумме'}`);
    const resourceAmountStopInfoBlock = createEl('div', 'font-weight: bold;', `Сумма остановки: ${resourceAmountStop}`);

    setResourceAmountStopBtn.addEventListener('click', () => {
        localStorage.setItem('resourceAmountStop', JSON.stringify(setResourceAmountStop.value));
        location.reload();
    });

    toogleResourceAmountStopBtn.addEventListener('click', () => {
        localStorage.setItem('toogleResourceAmountStop', JSON.stringify(!toogleResourceAmountStop));
        location.reload();
    });

    //Bets sorted by higher bet
    let betsAmountHTML = document.getElementsByTagName('table')[17];
    let betsAmountBlock = [...betsAmountHTML.getElementsByTagName('tr')];
    let label = betsAmountBlock.shift();
    betsAmountBlock = betsAmountBlock.sort((a, b) => Number(b.firstChild.innerText.replace(',', '')) - Number(a.firstChild.innerText.replace(',', '')));
    betsAmountBlock = betsAmountBlock.reduce((acc, el) => {
        acc += `<tr>${el.innerHTML}</tr>`;
        return acc;
    }, label.innerHTML)
    betsAmountHTML.innerHTML = `<tbody>${betsAmountBlock}</tbody>`;

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

    let playMultiNums = JSON.parse(localStorage.getItem('playMultiNums'));
    if (playMultiNums === null) localStorage.setItem('playMultiNums', JSON.stringify(false));

    let playToogle = JSON.parse(localStorage.getItem('playToogle'));
    if (playToogle === null) localStorage.setItem('playToogle', JSON.stringify(false));

    if (Number(resourceAmount) > Number(resourceAmountStop) && toogleResourceAmountStop) {
        localStorage.setItem('playToogle', JSON.stringify(false));
    };

    const playStyleLabel = createEl('div', 'text-align: center; font-size: 14px; font-weight: bold; ', `Сейчас включен режим ${playOneNum ? '1 число по кругу' : '4 числа по кругу'}`)
    const setPlayOneNum = createEl('button', styledBtn, 'Играть 1 число по кругу');
    const setPlayMultiNums = createEl('button', styledBtn, 'Играть 4 числа по кругу');
    const setPlayToogle = createEl('button', styledBtn, `${playToogle ? 'Остановить скрипт' : 'Запустить скрипт'}`)

    setPlayOneNum.addEventListener('click', () => {
        localStorage.setItem('playOneNum', JSON.stringify(true));
        localStorage.setItem('playMultiNums', JSON.stringify(false));
        location.reload();
    });

    setPlayMultiNums.addEventListener('click', () => {
        localStorage.setItem('playOneNum', JSON.stringify(false));
        localStorage.setItem('playMultiNums', JSON.stringify(true));
        location.reload();
    });

    setPlayToogle.addEventListener('click', () => {
        let toogle = playToogle;
        localStorage.setItem('playToogle', JSON.stringify(!playToogle));
        location.reload();
    });

    //History
    let hour = new Date(Date.now()).getHours();
    let minutes = new Date(Date.now()).getMinutes();
    if (hour < 1) hour = '0' + hour;
    if (minutes < 10) minutes = '0' + minutes;

    let toogleShowHistory = JSON.parse(localStorage.getItem('toogleShowHistory'));
    if (toogleShowHistory === null) localStorage.setItem('toogleShowHistory', JSON.stringify(false));
    let toogleShowHistoryLs = toogleShowHistory;
    const showHistoryBtn = createEl('button', styledBtn, `${toogleShowHistoryLs ? 'Скрыть историю' : 'Показать историю'}`);
    const clearHistoryBtn = createEl('button', styledBtn, 'Очистить историю');

    const historyBlock = createEl('div', 'display: flex; flex-direction: column; align-items: center;');
    historyBlock.style.display = toogleShowHistoryLs ? 'flex' : 'none';
    const historyBet = createEl('div', 'display: flex;');

    let historyString = JSON.parse(localStorage.getItem('historyString'));
    if (historyString === null) localStorage.setItem('historyString', JSON.stringify(historyBlock.innerHTML));

    showHistoryBtn.addEventListener('click', () => {
        toogleShowHistoryLs = !toogleShowHistoryLs;
        historyBlock.style.display = toogleShowHistoryLs ? 'flex' : 'none';
        localStorage.setItem('toogleShowHistory', JSON.stringify(toogleShowHistoryLs));
        showHistoryBtn.innerText = toogleShowHistoryLs ? 'Скрыть историю' : 'Показать историю';
        clearHistoryBtn.style.visibility = toogleShowHistoryLs && historyString.length > 0 ? 'visible' : 'hidden';
    });

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.setItem('historyString', JSON.stringify(''));
        location.reload();
    })

    clearHistoryBtn.style.visibility = toogleShowHistoryLs && historyString.length > 0 ? 'visible' : 'hidden';

    historyBlock.innerHTML = historyString;

    panel.appendChild(playStyleLabel);
    panel.appendChild(setPlayOneNum);
    panel.appendChild(setPlayMultiNums);
    panel.appendChild(setPlayToogle);
    panel.appendChild(setMoneyValue);
    panel.appendChild(setMoneyValueInfoBlock);
    panel.appendChild(setMoneyValueBtn);
    panel.appendChild(setResourceAmountStop);
    panel.appendChild(setResourceAmountStopBtn);
    panel.appendChild(resourceAmountStopInfoBlock);
    panel.appendChild(toogleResourceAmountStopBtn);

    document.body.appendChild(panel);

    //Gameplays
    if (playOneNum === true) {
        let temporaryNumsArray = JSON.parse(localStorage.getItem('temporaryNumsArray'));
        let numsCounter = JSON.parse(localStorage.getItem('numsCounter'));

        if (numsCounter == null) {
            localStorage.setItem('numsCounter', JSON.stringify(0));
            location.reload();
        }

        if (!temporaryNumsArray) {
            localStorage.setItem('temporaryNumsArray', JSON.stringify(nums));
            location.reload();
        }

        const playBlock = createEl('div', 'diplay: flex; flex-directon: column');
        const setNumsCounterInput = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'количество прокруток всех чисел', 'number');
        const setNumsCounterBtn = createEl('button', styledBtn, 'Задать');
        const numsCounertInfoBlock = createEl('div', 'font-weight: bold;', '');

        resetBtn.addEventListener('click', () => {
            localStorage.setItem('numsCounter', JSON.stringify(0));
            localStorage.setItem('temporaryNumsArray', JSON.stringify(nums));
            location.reload();
        })

        playBlock.appendChild(setNumsCounterInput);
        playBlock.appendChild(setNumsCounterBtn);
        playBlock.appendChild(numsCounertInfoBlock);
        playBlock.appendChild(resetBtn);

        numsCounertInfoBlock.innerText = `Осталось прокруток ${temporaryNumsArray.length} | Следующее число ${temporaryNumsArray.at(0)}`;

        setNumsCounterBtn.addEventListener('click', () => {
            let num = Number(setNumsCounterInput.value);
            if (num > 0) {
                localStorage.setItem('numsCounter', JSON.stringify(num * nums.length));
                let temp = [];
                for (let i = 0; i < num; i++) {
                    temp = [...temp, ...nums];
                }
                localStorage.setItem('temporaryNumsArray', JSON.stringify(temp));
                location.reload();
            }
        });


        panel.appendChild(playBlock);
        panel.appendChild(showHistoryBtn);
        panel.appendChild(historyBlock);
        panel.appendChild(clearHistoryBtn);

        let checkMyBet = [...document.getElementsByTagName('center')];
        checkMyBet = checkMyBet[3].parentElement;
        checkMyBet = checkMyBet.getElementsByTagName('tr')[1].getElementsByTagName('td')[1].innerText;

        if (playToogle) {
            if (checkMyBet.includes('Straight up')) {
                return;
            } else if (temporaryNumsArray.length && numsCounter > 0) {
                let gameLinkId = Number(link.match(/\d+/gi)[0]) + 1;
                let gameLink = link.replace(/\d+/gi, gameLinkId);
                betInput.value = moneyValue;
                betType.value = `Straight up ${temporaryNumsArray[0]}`;
                temporaryNumsArray.shift();
                localStorage.setItem('temporaryNumsArray', JSON.stringify(temporaryNumsArray));
                historyBet.innerHTML = `<a target='_blank' href=${gameLink}>Время:${hour}:${minutes} - баланс: ${resourceAmount}</a>`;
                historyBlock.appendChild(historyBet);
                localStorage.setItem('historyString', JSON.stringify(historyBlock.innerHTML));
                betBtn.click();
            } else {
                return;
            }
        }
    }

    if (playMultiNums === true) {
        let multiNumsMainArray = JSON.parse(localStorage.getItem('multiNumsMainArray'));
        let multiNumsAdditionalArray = JSON.parse(localStorage.getItem('multiNumsAdditionalArray'));
        let gameIndex = localStorage.getItem('gameIndex');
        let multiNumsCounter = localStorage.getItem('multiNumsCounter');
        let multiNumsCounterBase = localStorage.getItem('multiNumsCounterBase');

        if (multiNumsMainArray === null) {
            localStorage.setItem('multiNumsMainArray', JSON.stringify([]));
            location.reload();
        }

        if (multiNumsAdditionalArray === null) {
            localStorage.setItem('multiNumsAdditionalArray', JSON.stringify([]));
            location.reload();
        }

        if (gameIndex === null) {
            localStorage.setItem('gameIndex', 0);
            location.reload();
        }

        if (multiNumsCounter === null) {
            localStorage.setItem('multiNumsCounter', 0);
            location.reload();
        }

        if (multiNumsCounterBase === null) {
            localStorage.setItem('multiNumsCounterBase', 0);
            location.reload();
        }

        const playBlock = createEl('div', 'diplay: flex; flex-directon: column');

        const setmultiNumsMainArray = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'основной массив', 'text');
        const setmultiNumsAdditionalArray = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'дополнительный массив', 'text');
        const setmultiNumsCounter = createEl('input', 'height: 25px; width: 350px; border: 1px solid #592c08; border-radius: 5px;', '', 'число повторений', 'number');
        const setMainArrayBtn = createEl('button', styledBtn, 'Задать числа основного массива');
        const setAdditionalArrayBtn = createEl('button', styledBtn, 'Задать числа дополнительного массива');
        const setMultiNumsCounterBtn = createEl('button', styledBtn, 'Задать числа повторений');

        const multiNumsMainArrayInfoBlock = createEl('div', 'font-weight: bold;', `Основной массив: ${multiNumsMainArray}`);
        const multiNumsAdditionalArrayInfoBlock = createEl('div', 'font-weight: bold;', `Дополнительный массив: ${multiNumsAdditionalArray}`);
        const multiNumsCounterInfoBlock = createEl('div', 'font-weight: bold;', `Количество повторений: ${multiNumsCounter}`);

        setMainArrayBtn.addEventListener('click', () => {
            let nums = setmultiNumsMainArray.value;
            nums = nums.split(' ');
            localStorage.setItem('multiNumsMainArray', JSON.stringify(nums));
            location.reload();
        });

        setAdditionalArrayBtn.addEventListener('click', () => {
            let nums = setmultiNumsAdditionalArray.value;
            nums = nums.split(' ');
            localStorage.setItem('multiNumsAdditionalArray', JSON.stringify(nums));
            location.reload();
        })

        setMultiNumsCounterBtn.addEventListener('click', () => {
            if (!setmultiNumsCounter.value) {
                alert('Необходимо указать число');
            } else {
                localStorage.setItem('multiNumsCounter', Number(setmultiNumsCounter.value));
                localStorage.setItem('multiNumsCounterBase', Number(setmultiNumsCounter.value));
                location.reload();
            }
        })

        resetBtn.addEventListener('click', () => {
            localStorage.setItem('multiNumsMainArray', JSON.stringify([]));
            localStorage.setItem('multiNumsAdditionalArray', JSON.stringify([]));
            localStorage.setItem('gameIndex', 0);
            localStorage.setItem('multiNumsCounter', 0);
            localStorage.setItem('multiNumsCounterBase', 0);
            location.reload();
        })

        playBlock.appendChild(br);
        playBlock.appendChild(setmultiNumsMainArray);
        playBlock.appendChild(multiNumsMainArrayInfoBlock);
        playBlock.appendChild(setMainArrayBtn);
        playBlock.appendChild(br.cloneNode(true));
        playBlock.appendChild(setmultiNumsAdditionalArray);
        playBlock.appendChild(multiNumsAdditionalArrayInfoBlock);
        playBlock.appendChild(setAdditionalArrayBtn);
        playBlock.appendChild(br.cloneNode(true));
        playBlock.appendChild(multiNumsCounterInfoBlock);
        playBlock.appendChild(setmultiNumsCounter);
        playBlock.appendChild(setMultiNumsCounterBtn);
        playBlock.appendChild(resetBtn);
        panel.appendChild(playBlock);
        panel.appendChild(showHistoryBtn);
        panel.appendChild(historyBlock);
        panel.appendChild(clearHistoryBtn);

        let checkMyBet = [...document.getElementsByTagName('center')];
        checkMyBet = checkMyBet[3].parentElement;
        let checkMyFirstBet = checkMyBet.getElementsByTagName('tr')[1].getElementsByTagName('td')[1].innerText;
        let checkMySecondBet = '';
        let checkMyThirdBet = '';
        let checkMyFourthBet = '';

        if (checkMyBet.getElementsByTagName('tr')[2]) checkMySecondBet = checkMyBet.getElementsByTagName('tr')[2].getElementsByTagName('td')[1].innerText;
        if (checkMyBet.getElementsByTagName('tr')[3]) checkMyThirdBet = checkMyBet.getElementsByTagName('tr')[3].getElementsByTagName('td')[1].innerText;
        if (checkMyBet.getElementsByTagName('tr')[4]) checkMyFourthBet = checkMyBet.getElementsByTagName('tr')[4].getElementsByTagName('td')[1].innerText;

        if (playToogle && Number(multiNumsCounter) > 0) {
            if (multiNumsMainArray.length < 4) {
                localStorage.setItem('playToogle', JSON.stringify(false));
                alert('в основном списке меньше 4 чисел!');
                location.reload();
            }
            if (+gameIndex >= 4) {
                let gameLinkId = Number(link.match(/\d+/gi)[0]) + 1;
                let gameLink = link.replace(/\d+/gi, gameLinkId);
                localStorage.setItem('gameIndex', 0);
                localStorage.setItem('multiNumsCounter', Number(multiNumsCounter) - 1);
                historyBet.innerHTML = `<a target='_blank' href=${gameLink}>Время:${hour}:${minutes} - баланс: ${resourceAmount}</a>`;
                historyBlock.appendChild(historyBet);
                localStorage.setItem('historyString', JSON.stringify(historyBlock.innerHTML));
                location.reload();
            }
            const checkLastBet = (doc) => {
                let lastNumber = doc.getElementsByTagName('table')[1];
                lastNumber = lastNumber.firstChild;
                lastNumber = lastNumber.firstChild.getElementsByTagName('b')[0].innerText;

                if (multiNumsAdditionalArray.indexOf(lastNumber) !== -1) {
                    multiNumsAdditionalArray = multiNumsAdditionalArray.filter(el => el !== lastNumber);
                    localStorage.setItem('multiNumsAdditionalArray', JSON.stringify(multiNumsAdditionalArray));
                }

                if (multiNumsMainArray.indexOf(lastNumber) !== -1) {
                    multiNumsMainArray = multiNumsMainArray.filter(el => el !== lastNumber);
                    multiNumsMainArray.push(multiNumsAdditionalArray[0]);
                    localStorage.setItem('multiNumsMainArray', JSON.stringify(multiNumsMainArray));
                    multiNumsAdditionalArray.shift();
                    localStorage.setItem('multiNumsAdditionalArray', JSON.stringify(multiNumsAdditionalArray));
                    localStorage.setItem('multiNumsCounter', Number(multiNumsCounterBase));
                    location.reload();
                }
                if (checkMyFirstBet.includes('Straight up') && checkMySecondBet.includes('Straight up') && checkMyThirdBet.includes('Straight up') && checkMyFourthBet.includes('Straight up')) {
                    return;
                } else {
                    betInput.value = moneyValue;
                    betType.value = `Straight up ${multiNumsMainArray[gameIndex]}`;
                    localStorage.setItem('gameIndex', Number(gameIndex) + 1);
                    betBtn.click();
                }
            }
            fetchXml(checkLastBet, link);
        }
    }

})();