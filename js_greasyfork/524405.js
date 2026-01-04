// ==UserScript==
// @name         Kbo cheats
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @license      MIT
// @description  easy cheats
// @author       You
// @match        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/home.php*/
// @include      /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/home.php*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524405/Kbo%20cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/524405/Kbo%20cheats.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const common_btn_style = 'border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s;transition: filter .15s;'

    let startStop = false;

    const convert_date = (date) => {
        let t = new Date(date);
        let minutes = t.getMinutes() < 10 ? `0${t.getMinutes()}` : t.getMinutes();
        let hours = t.getHours() < 10 ? `0${t.getHours()}` : t.getHours();
        return `${hours}:${minutes}`
    }

    const createEl = (el, style, innerText, className, placeholder) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        if (className) element.className = className;
        if (placeholder) element.placeholder = placeholder;
        return element;
    }

    const links = ['https://my.lordswm.com', 'https://www.heroeswm.ru'];
    const link = location.href.slice(0, 22) === 'https://my.lordswm.com' ? links[0] : links[1];

    const fetchXml = (callback, link, id) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', link);
        xhr.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/html; charset=windows-1251');
        }

        xhr.addEventListener('load', () => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(xhr.responseText, "text/html");
            callback(doc, id);
        })
        xhr.send();
    }

    let startStopBtn = createEl('div', `${common_btn_style} width: 120px;`, `${startStop ? 'stop' : 'start'}`);

    const heroesLS = JSON.parse(localStorage.getItem('heroesLS'));
    if (heroesLS === null) {
        localStorage.setItem('heroesLS', JSON.stringify([]));
        location.reload();
    }

    let heroes = heroesLS;

    const timerCheatsLS = JSON.parse(localStorage.getItem('timerCheatsLS'));
    if (timerCheatsLS === null) {
        localStorage.setItem('timerCheatsLS', JSON.stringify(60000));
        location.reload();
    }
    let timer = timerCheatsLS;

    let servicesBlock = document.getElementById('hwm_no_zoom');

    let goldImg = createEl('img', 'height: 14px; width: 14px');
    goldImg.src = 'https://cfcdn.lordswm.com/i/r/48/gold.png?v=3.23de65';
    let container = createEl('div', 'posotion: relative; background: transparent; width: 100%; min-height: 100px;');
    let timerInput = createEl('input', 'width: 45px;','','','timer');
    let timerBtn = createEl('div',`${common_btn_style} width: 80px;`,'Set timer');
    let timerBlock = createEl('div', 'width: 30px;', `T: ${timer/1000}`)
    let myBlock = createEl('div', 'margin-top: 15px; display: flex; width: 85%; min-height: 100px;');
    let addHeroBlock = createEl('div', 'margin-left: 10px; width: 560px; height: 25px; display: flex; justify-content: space-around; border-bottom: 1px solid black');
    let preloaderBlock = createEl('div', 'width: 400px; display: flex; justify-content: center; margin-top: 10px;');
    let balanceBlock = createEl('div', 'display: flex; flex-wrap: wrap; gap: 5px; margin-top: 15px; padding: 10px;');
    const kittyGif = createEl('img', 'width: 150px; height: 50px; display: none');
    kittyGif.src = 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1';

    let inputId = createEl('input', 'width: 100px;','','','hero id');
    let nickName = createEl('input', 'width: 100px;','','','hero nickname');
    let addIdBtn = createEl('div', `${common_btn_style} width: 80px;`, 'ADD');

    timerBtn.addEventListener('click', () => {
        timer = timerInput.value * 1000;
        localStorage.setItem('timerCheatsLS', JSON.stringify(timer));
        timerBlock.innerText = `T: ${timerInput.value}`;
    })

    addIdBtn.addEventListener('click', () => {
        let heroBlock = createEl('div','display: flex; flex-direction: column; min-width: 200px; min-height: 100px; font-weight: bold;');
        heroes.push({id: inputId.value, nick: nickName.value});
        localStorage.setItem('heroesLS', JSON.stringify(heroes))
        heroBlock.id = inputId.value;
        balanceBlock.append(heroBlock)

        let deleteBtn = createEl('div', 'cursor: pointer;', 'X');
        deleteBtn.addEventListener('click', () => {
            heroBlock.remove();
            heroes = heroes.filter(el => el.id !== heroBlock.id);
            localStorage.setItem('heroesLS', JSON.stringify(heroes));
        })
        let infoBlock = createEl('div', 'display: flex; justify-content: space-around;');
        infoBlock.append(createEl('div', '', nickName.value));
        infoBlock.append(deleteBtn);
        heroBlock.append(infoBlock);
    });

    let interval;

    startStopBtn.addEventListener('click', () => {
        if (startStop) {
            startStop = !startStop;
            startStopBtn.innerText = 'start';
            kittyGif.style.display = 'none';
            clearInterval(interval);
        } else if (!startStop) {
            startStop = !startStop;
            kittyGif.style.display = 'block';
            startStopBtn.innerText = 'stop';
            interval = setInterval(() => {
                for (let i = 0; i < heroes.length; i++) {
                    fetchXml(checkCharBalance, `${link}/pl_info.php?id=${heroes[i].id}`, heroes[i].id)
                }
            }, timer)
        }
    })


    for (let i = 0; i < heroes.length; i++) {
        let heroBlock = createEl('div','display: flex; flex-direction: column; min-width: 200px; min-height: 100px; font-weight: bold;');
        heroBlock.id = heroes[i].id;
        balanceBlock.append(heroBlock);

        let deleteBtn = createEl('div', 'cursor: pointer;', 'X');
        deleteBtn.addEventListener('click', () => {
            heroBlock.remove();
            heroes = heroes.filter(el => el.id !== heroes[i].id);
            localStorage.setItem('heroesLS', JSON.stringify(heroes));
        })
        let infoBlock = createEl('div', 'display: flex; justify-content: space-around;');
        infoBlock.append(createEl('div', '', heroes[i].nick));
        infoBlock.append(deleteBtn);
        heroBlock.append(infoBlock);
    }

    myBlock.classList.add('myBlock')
    myBlock.classList.add('home_container_block');

    myBlock.append(container);
    addHeroBlock.append(inputId);
    addHeroBlock.append(nickName);
    addHeroBlock.append(addIdBtn);
    addHeroBlock.append(startStopBtn);
    addHeroBlock.append(timerBlock);
    addHeroBlock.append(timerInput);
    addHeroBlock.append(timerBtn);
    container.append(addHeroBlock);
    container.append(preloaderBlock)
    container.append(balanceBlock);
    preloaderBlock.append(kittyGif);

    document.body.appendChild(myBlock)

    const checkCharBalance = (doc, id) => {
        let el = [...doc.getElementsByTagName('img')];
        el = el.filter(img => img.title === 'Золото');

        //let nickName = doc.getElementsByTagName('h1')[0].innerText;
        let balance = el[0].parentElement.nextSibling.firstChild.innerText;

        let balanceBlock = createEl('div', 'font-weight: bold', balance);
        let timeBlock = createEl('div', '', convert_date(new Date()));

        let block = createEl('div', 'display: flex; width: 100px; gap: 10px;');
        let clone = goldImg.cloneNode(true);

        block.append(balanceBlock);
        block.append(clone);
        block.append(timeBlock);

        let parent = document.getElementById(id);
        let lastBalance = [...parent.children];
        if (lastBalance.length === 0) {
            document.getElementById(id).append(block);
        } else {
            lastBalance = lastBalance[lastBalance.length - 1];
            lastBalance = Number(lastBalance.firstChild.innerText.replaceAll(',', ''));
            let newBalance = Number(balance.replaceAll(',', ''));
            if (newBalance > lastBalance) {
                block.append(createEl('div', 'font-weight: bold; color: green', `(+${newBalance - lastBalance})`))
            } else if (newBalance < lastBalance) {
                block.append(createEl('div', 'font-weight: bold; color: red', `(${newBalance - lastBalance})`))
            }

            document.getElementById(id).append(block);
        }

    }

    })();