// ==UserScript==
// @name         HWM Elements transfer helper
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Даёт возможность массово передавать элементы другому игроку.
// @author       JamesPshevcky
// @include        /^https{0,1}:\/\/(www|my|mirror)\.(heroeswm|178\.248\.235\.15|lordswm)\.(ru|com)\/(home|transfer|pl_info*|el_transfer|inventory)\.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539608/HWM%20Elements%20transfer%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/539608/HWM%20Elements%20transfer%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IMAGE_MAP = {
        'abrasive': '/i/abrasive.gif',
        'snake_poison': '/i/snake_poison.gif',
        'tiger_tusk': '/i/tiger_tusk.gif',
        'ice_crystal': '/i/ice_crystal.gif',
        'moon_stone': '/i/moon_stone.gif',
        'fire_crystal': '/i/fire_crystal.gif',
        'meteorit': '/i/meteorit.gif',
        'witch_flower': '/i/witch_flower.gif',
        'wind_flower': '/i/wind_flower.gif',
        'fern_flower': '/i/fern_flower.gif',
        'badgrib': '/i/badgrib.gif'
    };
    const EL_MAP = {
        'abrasive': 'Абразив',
        'snake_poison': 'Змеиный яд',
        'tiger_tusk': 'Клык тигра',
        'ice_crystal': 'Ледяной кристалл',
        'moon_stone': 'Лунный камень',
        'fire_crystal': 'Огненный кристалл',
        'meteorit': 'Осколок метеорита',
        'witch_flower': 'Цветок ведьм',
        'wind_flower': 'Цветок ветров',
        'fern_flower': 'Цветок папоротника',
        'badgrib': 'Ядовитый гриб'
    };
    const weapCostMap = {
        'D' : {
            'abrasive': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'moon_stone': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'E' : {
            'meteorit': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'badgrib': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'A' : {
            'witch_flower': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'wind_flower': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'W' : {
            'snake_poison': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'ice_crystal': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'F' : {
            'tiger_tusk': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'fire_crystal': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
    };
    const armCostMap = {
        'D' : {
            'abrasive': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'moon_stone': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'E' : {
            'meteorit': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'A' : {
            'wind_flower': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'W' : {
            'ice_crystal': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'F' : {
            'fire_crystal': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
    };
    const jewCostMap = {
        'D' : {
            'tiger_tusk': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'wind_flower': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'E' : {
            'tiger_tusk': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'meteorit': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
        'A' : {
            'meteorit': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'wind_flower': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
        },
        'W' : {
            'ice_crystal': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'witch_flower': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
        },
        'F' : {
            'abrasive': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45],
            'fire_crystal': [1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45]
        },
    };
    const fern_flow = [0, 2, 6, 12, 20, 30]


    GM_addStyle(`
        #elementsTransferContainer {
            position: fixed;
            top: 75px;
            left: 10px;
            z-index: 9998;
            background-color: #f5f3ea;
            border-radius: 5px;
            padding: 10px;
            box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgba(0, 0, 0, 0.25);
            display: none;
            max-width: 35%;
        }

        #mainButton {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: optimizeQuality;
            position: fixed;
            top: 50px;
            left: 10px;
            padding: 10px 20px;
            border: 1px;
            font-size: 100%;
            font-family: verdana, geneva, arial cyr;
            border-radius: 5px;
            background-color: #f5f3ea;
            color: #592C08;
            cursor: pointer;
            z-index: 9999;
            box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgba(0, 0, 0, 0.25);
        }

        #mainButton:hover {
            background-color: #e0d8c0;
        }

        #elTable {
            width: 100%;
            margin: 10px 0;
            font-size: 100%;
            font-family: verdana, geneva, arial cyr;
            border-radius: 5px;
            background-color: #f5f3ea;
            box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgba(0, 0, 0, 0.25);
        }

        #elTable th, #elTable td {
            border: 1px solid #ddd;
            background-color: #f5f3ea;
            padding: 4px;
            text-align: center;
        }

        #elTable th {
            background-color: #f5f3ea;
        }

        #elTable input {
            background-color: white;
            width: 100%;
            padding: 0;
            margin: 0;
            display: block;
            box-sizing: border-box;
        }

        .inputContainer {
            margin-bottom: 10px;
            padding: 10px;
            gap: 20px;
            background-color: #f5f3ea;
            border-radius: 5px;
        }
        .select {
            display: inline;
            margin: 0 auto;
        }
        #crTable{
            table-layout: fixed;
            border: 1px solid grey;
        }
        #crTable th, #crTable td {
            width: 40px;
            height: 20px;
            padding: 0;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #ddd;
        }

        #crTable img {
            max-width: 75%;
            max-height: 75%;
            display: block;
            margin: 0 auto;
            object-fit: contain;
        }
        }
        #crTable tr{
            display: block;
        }
        #goldImg{
            display: inline;
            width: 4%;
            margin-left: 2.5%;
            vertical-align: bottom;
        }
        #gold {
            display: inline;
            width: 13%;
        }

        .inputContainer label {
            display: inline;
            margin-bottom: 5px;
            text-indent: initial;
            line-height: normal;
            font-style: normal;
            text-align: start;
            border-spacing: 2px;
            white-space: normal;
            font-variant: normal;
        }

        .inputContainer input {
            display: inline-block;
            text-rendering: auto;
            color: fieldtext;
            letter-spacing: normal;
            word-spacing: normal;
            line-height: normal;
            text-transform: none;
            text-indent: 0px;
            text-shadow: none;
            text-align: start;
            appearance: auto;
            -webkit-rtl-ordering: logical;
            cursor: text;
            background-color: field;
            margin: 0em;
            padding: 1px 0px;
            border-width: 2px;
            border-style: inset;
            border-color: light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
            border-image: initial;
        }

        #sendButton {            
            padding: 8px;
            background-color: #f5f3ea;
            border: 1px solid #b19673;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        }

        #sendButton:hover {
            background-color: #e0d8c0;
        }

        .element-image {
            width: 40px;
            height: 40px;
            display: block;
            margin: 0 auto;
        }
    `);

    const container = document.createElement('div');
    container.id = 'elementsTransferContainer';
    const button1 = document.createElement('button');
    button1.textContent = 'Список элементов';
    button1.id = 'mainButton';

    const inputContainer = document.createElement('div');
    const recipientContainer = document.createElement('div');
    recipientContainer.className = 'inputContainer';

    const recipientLabel = document.createElement('label');
    recipientLabel.textContent = 'Ник: ';
    recipientLabel.placeholder = 'Введите ник получателя...';

    const recipientInput = document.createElement('input');
    recipientInput.type = 'text';
    recipientInput.id = 'recipientInput';

    const goldImg = document.createElement('img');
    goldImg.src = '/i/r/48/gold.png';
    goldImg.text = 'Золото';
    goldImg.id = 'goldImg';
    const gold = document.createElement('input');
    gold.type = 'number';
    gold.id = 'gold';


    recipientContainer.appendChild(recipientLabel);
    recipientContainer.appendChild(recipientInput);


    const commentLabel = document.createElement('label');
    commentLabel.textContent = ' Комментарий: ';

    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.id = 'commentInput';

    recipientContainer.appendChild(commentLabel);
    recipientContainer.appendChild(commentInput);
    recipientContainer.appendChild(goldImg);
    recipientContainer.appendChild(gold);

    const sendButtonContainer = document.createElement('div');

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Отправить';
    sendButton.id = 'sendButton';

    sendButtonContainer.appendChild(sendButton);

    // Добавляем элементы в контейнер ввода
    inputContainer.appendChild(recipientContainer);
    inputContainer.appendChild(sendButtonContainer);

    const selT = document.createElement('select');
    selT.id = 'typ';
    const typs = {'weapon' : 'Оружие', 'armor' : 'Броня', 'jewerly' : 'Ювелирка'};
    for (let t in typs){
        const typ = document.createElement('option');
        typ.value = t;
        typ.text = typs[t];
        selT.appendChild(typ);
    }


    const selCfg = ['AllFr', 'AllTo', 'DFr', 'DTo', 'EFr', 'ETo', 'AFr', 'ATo', 'WFr', 'WTo', 'FFr', 'FTo' ];
    const selFr = ['AllFr', 'DFr', 'EFr', 'AFr', 'WFr', 'FFr'];
    const selTo = ['AllTo', 'DTo', 'ETo', 'ATo', 'WTo', 'FTo'];
    const vallist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const selectsFr = selFr.map(id => {
        const selectF = document.createElement('select');
        selectF.id = id;
        vallist.forEach(v => {
            const option = document.createElement('option');
            option.value = v;
            option.textContent = `${v}%`;
            selectF.appendChild(option);
        });

        return selectF;
    });
    const selectsTo = selTo.map(id => {
        const selectT = document.createElement('select');
        selectT.id = id;
        vallist.forEach(v => {
            const option = document.createElement('option');
            option.value = v;
            option.textContent = `${v}%`;
            selectT.appendChild(option);
        });

        return selectT;
    });
    selectsTo.slice(1,).forEach(sel => {
        sel.addEventListener('change', function(){craftCalc()});
    });
    selectsFr.slice(1,).forEach(sel => {
        sel.addEventListener('change', function(){craftCalc()});
    });
    const allFr = selectsFr[0];
    allFr.addEventListener('change', function(){
        const FrValue = allFr.value;
            selectsFr.slice(1,).forEach(sel1 => {
                sel1.value = FrValue});
        craftCalc()
    });
    const allTo = selectsTo[0];
    allTo.addEventListener('change', function(){
        const ToValue = allTo.value;
            selectsTo.slice(1,).forEach(sel1 => {
                sel1.value = ToValue});
        craftCalc()
    });
    selT.addEventListener('change', function(){craftCalc()});
    inputContainer.appendChild(selT);
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'cashback';
    input.addEventListener('change', function(){craftCalc()});
    input.placeholder = 'Откат(пар)...';
    inputContainer.appendChild(input);
    const crTable = document.createElement('table');
    crTable.id = 'crTable';
    const header = document.createElement('tr');
    const headerCells = [
        { id: 'typ', values: { weapon: '/i/mods_png/I12.png', armor: '/i/mods_png/D12.png', jewerly: '/i/mods_png/N12.png' } },
        { img: '/i/mods_png/E12.png' },
        { img: '/i/mods_png/A12.png' },
        { img: '/i/mods_png/W12.png' },
        { img: '/i/mods_png/F12.png' }
    ];
    const emptyHead = document.createElement('th');
    header.appendChild(emptyHead);
    const head = document.createElement('th');
    const txt = document.createElement('a');
    txt.text = 'Все';
    head.appendChild(txt);
    header.appendChild(head);
    crTable.appendChild(header);
    headerCells.forEach(cellData => {
        const head = document.createElement('th');

        if (cellData.id) {
            // Первая ячейка с динамическим изображением
            const img = document.createElement('img');
            img.id = 'dynamicHeaderImg';
            img.src = cellData.values.weapon; // Значение по умолчанию
            head.appendChild(img);

            // Обновляем изображение при изменении select
            selT.addEventListener('change', function() {
                const selectedValue = this.value;
                img.src = cellData.values[selectedValue];
            });
        } else {
            // Остальные ячейки с фиксированными изображениями
            const img = document.createElement('img');
            img.src = cellData.img;
            head.appendChild(img);
        }

        header.appendChild(head);

    });
    crTable.appendChild(header);
    const row1 = document.createElement('tr');
    const cell1 = document.createElement('td');
    const from = document.createElement('a');
    from.text = 'С ';
    const to = document.createElement('a');
    to.text = 'По ';
    cell1.appendChild(from);
    row1.appendChild(cell1);
    selectsFr.forEach(select => {
        const cellI = document.createElement('td');
        cellI.appendChild(select);
        row1.appendChild(cellI);
    });
    crTable.appendChild(row1);
    const row2 = document.createElement('tr');
    const cell2 = document.createElement('td');
    cell2.appendChild(to);
    row2.appendChild(cell2);
    selectsTo.forEach(select => {
        const cellI = document.createElement('td');
        cellI.appendChild(select);
        row2.appendChild(cellI);
    });
    crTable.appendChild(row2);
    inputContainer.appendChild(crTable);

    const elTable = document.createElement('table');
    elTable.id = 'elTable';
    elTable.style.display = 'none';

    container.appendChild(inputContainer);
    container.appendChild(elTable);
    document.body.appendChild(button1);
    document.body.appendChild(container);
    const tableHeader = document.createElement('tr');
    for (let headerText in IMAGE_MAP){
        const th = document.createElement('th');
        const img = document.createElement('img');
        img.src = IMAGE_MAP[headerText] || '';
        img.style.cssText = 'width: 40px; height: 40px; display: block; margin: 0 auto;';
        img.alt = EL_MAP[headerText];
        img.title = EL_MAP[headerText];
        th.appendChild(img);
        tableHeader.appendChild(th);
    };
    elTable.appendChild(tableHeader);
    let isOpen = false;
    let isFill = false;
    const elementsInput = {};
    button1.addEventListener('click', async function() {
        if (elTable.rows.length == 1){
            const elements = await getUserElements();
            const row = document.createElement('tr');
            const rowI = document.createElement('tr');
            for (let item in EL_MAP){
                const val = document.createElement('td');
                val.textContent = (elements[item] ?? 0);
                row.appendChild(val);
                const iCell = document.createElement('td');
                const input = document.createElement('input')
                input.id = item;
                input.type = 'number';
                iCell.appendChild(input);
                rowI.appendChild(iCell);
            };
            const modeTo = {};
            const modeFr = {};


            elTable.appendChild(row);
            elTable.appendChild(rowI);
        }
        if (isOpen) {
            container.style.display = 'none';
            elTable.style.display = 'none';
            button1.textContent = 'Передача элементов';
        } else {
            elTable.style.display = 'block';
            inputContainer.style.display = 'block';
            container.style.display = 'block';
            button1.textContent = 'Свернуть таблицу';
        }
        isOpen = !isOpen;



    });

    sendButton.addEventListener('click', function(){
        for (let item in EL_MAP){
            const elem = document.getElementById(item).value;
            if (elem != 0){
                elementsInput[item] = elem;
            };
        }
        transferResources(recipientInput.value, commentInput.value, elementsInput, gold.value)
    });

    function getPlayerIDFromTopMenu(){
        const PlayerLink = new URL(document.querySelector('a[href*="pl_hunter_stat.php?id="]').href);
        if (!PlayerLink){
            const PlayerLink = new URL(document.querySelector('.home_inside_margins.home_pers_column a[href*="pl_info.php?id="]').href);
        };
        const PlayerID = PlayerLink.searchParams.get('id');
        return PlayerID;
    }
    async function fetchPageData(relativeUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://${window.location.hostname}${relativeUrl}`,
                responseType: "arraybuffer",
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const decoder = new TextDecoder("windows-1251");
                        resolve(decoder.decode(response.response));
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }
    async function getPlayerElementsByID(){
        const elements = [
            "Абразив", "Змеиный яд", "Клык тигра", "Ледяной кристалл",
            "Лунный камень", "Огненный кристалл", "Осколок метеорита",
            "Цветок ведьм", "Цветок ветров", "Цветок папоротника", "Ядовитый гриб"
        ];
        const elRegex = elements.map(item =>
                                     item.split(/\s+/).map(word =>
                                                           word[0].toUpperCase() + word.slice(1).toLowerCase()
                                                          ).join('\\s+')
                                    ).join('|');
        const regex = new RegExp(`^\\s*(${elRegex}):\\s*(\\d+)`, 'i'); // 'i' для регистронезависимости
        const plID = getPlayerIDFromTopMenu();
        const plPageData = await fetchPageData(`/pl_info.php?id=${plID}`);
        const parser = new DOMParser();
        const plPageDoc = parser.parseFromString(plPageData, "text/html");
        const tdElement = Array.from(plPageDoc.querySelectorAll('td.wb')).find(td =>
                                                                               elements.some(item => td.textContent.includes(item)));
        const textEl = (tdElement.textContent || tdElement.innerText).split('\n');
        const matches = textEl.filter(item => regex.test(item));

        const result = {};
        matches.forEach(match => {
            const name = match.split(':')[0].trim();
            const count = parseInt(match.split(':')[1]);
            result[name] = count;
        });
        return result;
    }
    async function getUserElements(){
        const elements = [
            'abrasive', 'snake_poison',
            'tiger_tusk', 'ice_crystal',
            'moon_stone', 'fire_crystal',
            'meteorit', 'witch_flower',
            'wind_flower', 'fern_flower',
            'badgrib'
        ];
        const elRegex = elements.map(item =>
                                     item.split(/\s+/).map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join('\\s+')).join('|');
        const regex = new RegExp(`^\\s*(${elRegex})\\s*/\((\d+)\)/`, 'i');
        const PageData = await fetchPageData(`/el_transfer.php`);
        const parser = new DOMParser();
        const PageDoc = parser.parseFromString(PageData, "text/html");
        const selectElement = Array.from((PageDoc.querySelector('select[name="eltype"]')).options).filter(option =>
                                                                                                        elements.some(item => option.value.includes(item)));
        const result = {};
        selectElement.forEach(match => {
            const name = match.value;
            const count = parseInt(match.innerText.split('(')[1]);
            result[name] = count;
        });
        return result;
    }

    function fillCraftElements(typ, modeFr, modeTo){
        const elements = {'abrasive': 0,'snake_poison': 0,'tiger_tusk': 0,'ice_crystal': 0,'moon_stone': 0,'fire_crystal': 0,'meteorit': 0,'witch_flower': 0,'wind_flower': 0,'fern_flower': 0,'badgrib': 0};
        const modsCountTo = Object.keys(modeTo)
                .filter(key => modeTo[key] != '0')
                .length;
        const modsCountFr = Object.keys(modeFr)
                .filter(key => modeFr[key] != '0')
                .length;
                elements.fern_flower = fern_flow[modsCountTo-modsCountFr];
        for (let mod in modeTo){
            if (modeFr[mod] == 0 && modeTo[mod] != 0) {
                switch(typ) {
                    case 'weapon':
                        for (let md in weapCostMap[mod]){
                            elements[md] += (weapCostMap[mod][md][modeTo[mod]-1]);
                        }
                        break;
                    case 'armor':
                        for (let md in armCostMap[mod]){
                            elements[md] += (armCostMap[mod][md][modeTo[mod]-1]);
                        }
                        break;
                    case 'jewerly':
                        for (let md in jewCostMap[mod]){
                            elements[md] += (jewCostMap[mod][md][modeTo[mod]-1]);
                        }
                        break;
                };
            }
            if (modeFr[mod] != 0 && modeFr[mod] != modeTo[mod]){
                switch(typ) {
                    case 'weapon':
                        for (let md in weapCostMap[mod]){
                            elements[md] += (weapCostMap[mod][md][modeTo[mod]-1] - weapCostMap[mod][md][modeFr[mod]-1]);
                            if (elements[md] !=0){ elements[md] += 1}
                        }
                        break;
                    case 'armor':
                        for (let md in armCostMap[mod]){
                            elements[md] += (armCostMap[mod][md][modeTo[mod]-1] - armCostMap[mod][md][modeFr[mod]-1]);
                            if (elements[md] !=0){ elements[md] += 1}
                        }
                        break;
                    case 'jewerly':
                        for (let md in jewCostMap[mod]){
                            elements[md] += (jewCostMap[mod][md][modeTo[mod]-1] - jewCostMap[mod][md][modeFr[mod]-1]);
                            if (elements[md] !=0){ elements[md] += 1}
                        }
                        break;
                };
            }
        }
        return elements;
    }
    function transferResources(nick, comment, resources, gold) {
        // Открываем новую вкладку с целевой страницей
        const newTab = window.open('/el_transfer.php', '_blank');

        // Ждем загрузки новой вкладки
        newTab.onload = function() {
            // Для каждой пары "ресурс: количество"
            Object.entries(resources).forEach(([resourceName, count], index) => {
                // Используем setTimeout для последовательной отправки
                setTimeout(() => {
                    // Получаем форму
                    const form = newTab.document.forms['f'];

                    // Заполняем поля формы
                    form.nick.value = nick;
                    form.eltype.value = resourceName;
                    form.count.value = count;
                    form.gold.value = gold;
                    form.comment.value = comment;
                    form.sendtype.value = 1;

                    // Находим кнопку отправки
                    const submitButton = Array.from(newTab.document.querySelectorAll('input[type="submit"]'))
                    .find(btn => btn.value === "Передать");
                    console.log('sbmbtn: ', submitButton)

                    // Отправляем форму
                    if (submitButton) {
                        //console.log('form value: ', form.nick.value, form.eltype.value, form.count.value, form.gold.value, form.comment.value, form.sendtype.value);
                        submitButton.click();
                    }
                }, index * 1000); // Задержка между отправками (1 секунда)
            });
        };
    }
    function craftCalc(){
        const modeTo = {};
        const modeFr = {};
        selectsTo.forEach(sel => {
            selectsTo.forEach(sel => {
                const selMod = sel.id.slice(0, 1);
                modeTo[selMod] = sel.value;
            });
            selectsFr.forEach(sel => {
                const selMod = sel.id.slice(0, 1);
                modeFr[selMod] = sel.value;
            });
            const elems = fillCraftElements(selT.value, modeFr, modeTo);
            for (let elem in elems){
                document.getElementById(elem).value = elems[elem];
            };
            for (let mod in modeTo){
                if (modeTo[mod] != 0){
                    switch(selT.value){
                        case 'weapon':
                            for (let el in weapCostMap[mod]){
                                document.getElementById(el).value -= document.getElementById("cashback").value
                            }
                        break;
                        case 'armor':
                            for (let el in armCostMap[mod]){
                                document.getElementById(el).value -= document.getElementById("cashback").value
                            }
                        break;
                        case 'jewerly':
                            for (let el in jewCostMap[mod]){
                                document.getElementById(el).value -= document.getElementById("cashback").value
                            }
                        break;
                    }
                }
            }
        });
    }

})();