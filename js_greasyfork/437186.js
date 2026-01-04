// ==UserScript==
// @name           [HWM] All Class Change
// @description    Смена фракции и класса с домашней страницы
// @author         Komdosh (original ElMarado (Идею дал HWM_Quick_Class_Change от Рианти))
// @version        2.1.0
// @include        https://www.heroeswm.ru/home.php*
// @include        https://www.lordswm.com/home.php*
// @include        https://178.248.235.15/home.php*
// @icon           https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @license        GPL-3.0+
// @namespace https://greasyfork.org/users/13829
// @downloadURL https://update.greasyfork.org/scripts/437186/%5BHWM%5D%20All%20Class%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/437186/%5BHWM%5D%20All%20Class%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //***************************************************************************
    function requestInventoryCollection(onResult) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', encodeURI("/inventory.php"));
            xhr.overrideMimeType('text/xml; charset=windows-1251');
            xhr.onload = async function(){
                if (xhr.status === 200)
                {
                    //  setInterval();
                    var div = document.createElement( 'div' );
                    div.id = 'kom-inventory-classes';
                    div.style.display = 'none';
                    div.innerHTML = xhr.responseText;
                    document.getElementsByTagName('body')[0].appendChild( div );
                    var respDoc = document.getElementsByTagName('body')[0].lastChild;

                    const collection = respDoc.querySelectorAll("#inv_expandedBlock>div");

                    var collectionItems = [];
                    for(var i = 0; i < collection.length; ++i){
                        const name = collection[i].querySelector('div').innerText.trim();
                        if(collection[i].querySelector('.btn_disabled') == null){
                            collectionItems.push({name: name, idx: i+1});
                        }
                    }

                    onResult(collectionItems);

                    respDoc.remove();
                }
                else {
                    console.log('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        });
    }

    const _ajaxTimeout = 5000;
    let sign = document.body.innerHTML.match(/sign=([a-z0-9]+)/);
    if (sign) sign = sign[1];
    else return;

    const allClasses = [
        [1, 'Рыцарь', 0, 'https://dcdn.heroeswm.ru/i/f/r1.png?v=1.1'],
        [1, 'Рыцарь света', 1, 'https://dcdn.heroeswm.ru/i/f/r101.png?v=1.1'],
        [2, 'Некромант', 0, 'https://dcdn.heroeswm.ru/i/f/r2.png?v=1.1'],
        [2, 'Некромант - повелитель смерти', 1, 'https://dcdn.heroeswm.ru/i/f/r102.png?v=1.1'],
        [3, 'Маг', 0, 'https://dcdn.heroeswm.ru/i/f/r3.png?v=1.1'],
        [3, 'Маг - разрушитель', 1, 'https://dcdn.heroeswm.ru/i/f/r103.png?v=1.1'],
        [4, 'Эльф', 0, 'https://dcdn.heroeswm.ru/i/f/r4.png?v=1.1'],
        [4, 'Эльф - заклинатель', 1, 'https://dcdn.heroeswm.ru/i/f/r104.png?v=1.1'],
        [5, 'Варвар', 0, 'https://dcdn.heroeswm.ru/i/f/r5.png?v=1.1'],
        [5, 'Варвар крови', 1, 'https://dcdn.heroeswm.ru/i/f/r105.png?v=1.1'],
        [5, 'Варвар - шаман', 2, 'https://dcdn.heroeswm.ru/i/f/r205.png?v=1.1'],
        [6, 'Темный эльф', 0, 'https://dcdn.heroeswm.ru/i/f/r6.png?v=1.1'],
        [6, 'Темный эльф - укротитель', 1, 'https://dcdn.heroeswm.ru/i/f/r106.png?v=1.1'],
        [7, 'Демон', 0, 'https://dcdn.heroeswm.ru/i/f/r7.png?v=1.1'],
        [7, 'Демон тьмы', 1, 'https://dcdn.heroeswm.ru/i/f/r107.png?v=1.1'],
        [8, 'Гном', 0, 'https://dcdn.heroeswm.ru/i/f/r8.png?v=1.1'],
        [8, 'Гном огня', 1, 'https://dcdn.heroeswm.ru/i/f/r108.png?v=1.1'],
        [9, 'Степной варвар', 0, 'https://dcdn.heroeswm.ru/i/f/r9.png?v=1.1'],
        [9, 'Степной варвар ярости', 1, 'https://dcdn.heroeswm.ru/i/f/r109.png?v=1.1'],
        [10, 'Фараон', 0, 'https://dcdn.heroeswm.ru/i/f/r10.png?v=1.1']
    ];

    const SHOWING_FRACTION = 'SHOWING_FRACTION';
    let showingFraction = JSON.parse(localStorage.getItem(SHOWING_FRACTION));
    if (showingFraction == null) {
        showingFraction = {};
        for (const frIdx in allClasses) {
            const fraction = allClasses[frIdx];
            showingFraction[fraction[1]] = true;
        }

        localStorage.setItem(SHOWING_FRACTION, JSON.stringify(showingFraction));
    }

    const SHOWING_FRACTION_INV_COLLECTION = 'SHOWING_FRACTION_INV_COLLECTION';
    let showingFractionInvCollection = JSON.parse(localStorage.getItem(SHOWING_FRACTION_INV_COLLECTION));
    if (showingFractionInvCollection == null) {
        showingFractionInvCollection = {};
        for (const frIdx in allClasses) {
            const fraction = allClasses[frIdx];
            showingFractionInvCollection[fraction[1]] = '';
        }

        localStorage.setItem(SHOWING_FRACTION_INV_COLLECTION, JSON.stringify(showingFractionInvCollection));
    }

    // Делаем запрос на сервер.
    // target - адрес
    // params - передаваемые параметры
    // ajaxCallback - что выполнить при удачном исходе
    // timeoutHandler - что выполнить при неудачном (не получаем ответа в течении _ajaxTimeout мс)
    function postRequest(target, params, ajaxCallback, timeoutHandler) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                ajaxCallback(xmlhttp.responseText);
            }
        }
        xmlhttp.open('GET', target + params, true);
        xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
        xmlhttp.timeout = _ajaxTimeout;
        xmlhttp.ontimeout = function () {
            timeoutHandler();
        }
        xmlhttp.send(params);
    }

    // Сообщение игроку, если за 7 сек не получили ответа от сервера на смену класса/фракции
    function showError() {
        document.body.style.cursor = 'default';
        alert('Ошибка, проверьте связь с интернетом.');
    }

    // функция смены класса/фракции
    function changeFractClass(fr, cl, fractionName) {
        document.body.style.cursor = 'progress';

        postRequest("/castle.php", '?change_clr_to=' + (cl ? cl + '0' + fr : fr) + '&sign=' + sign,
                    function () {
            const invCollection = showingFractionInvCollection[fractionName];

            if (invCollection != null && invCollection != '') {
                setTimeout(function () {
                    postRequest("/inventory.php", '?all_on=' + invCollection + '&rand=' + (Math.random() * 1000000), function () {
                        setTimeout(function () {
                            location.reload();
                        }, 300);
                    }, function () {
                        showError();
                    });
                }, 250);
            } else {
                setTimeout(function () {
                    location.reload();
                }, 300);
            }
        },
                    function () {
            showError();
        }
                   );
    }

    // получаем место вставки иконок класса

    const icons = document.querySelectorAll("a[href*='castle.php?change_faction_dialog']");
    const characterNameDiv = icons[0].parentNode;
    let icon = document.querySelectorAll("a[href*='castle.php?change_faction_dialog']")[0].querySelector('img');
    const cur_ico = 'https://dcdn.heroeswm.ru/i/f/' + icon.src.substring(icon.src.lastIndexOf("/") + 1, icon.src.length);
    // выводим все иконки

    let cur_fr;

    const fractionChangeContentDiv = document.createElement('div');
    createChangeFractionContent();
    characterNameDiv.append(document.createElement('br'));
    characterNameDiv.append(fractionChangeContentDiv);

    function createFractionImg(fraction, createOnClick) {
        const fractionImg = document.createElement('img');
        fractionImg.src = fraction[3];
        fractionImg.title = `Изменить на: ${fraction[1]}`;
        fractionImg.height = 15;
        fractionImg.width = 15;

        let style = "margin-left: 5px;";

        if (createOnClick) {
            style += "cursor: pointer;";
        }
        fractionImg.style = style;

        if (createOnClick) {
            fractionImg.onclick = function () {
                changeFractClass(fraction[0], fraction[2], fraction[1]);
                fractionImg.style.cursor = "cursor: progress; margin-left: 5px";
            };
        }

        return fractionImg;
    }

    function createChangeFractionContent() {
        fractionChangeContentDiv.innerHTML = '';
        for (const frIdx in allClasses) {
            const fraction = allClasses[frIdx];
            if (!showingFraction[fraction[1]]) {
                continue;
            }
            if (fraction[3] === cur_ico) {
                cur_fr = fraction[1];
            } else {
                fractionChangeContentDiv.append(createFractionImg(fraction, true));
            }
        }
        fractionChangeContentDiv.append(createSettingsLink());
    }

    function createSettingsLink() {
        const settingsLink = document.createElement('a');
        settingsLink.href = '#';
        settingsLink.style = 'margin-left: 5px';
        settingsLink.text = '(+)';
        let isSettingsOpen = false;
        let settingsContentDiv = null;
        settingsLink.onclick = () => {
            isSettingsOpen = !isSettingsOpen;
            settingsLink.text = isSettingsOpen ? '(-)' : '(+)';

            if (isSettingsOpen) {
                settingsContentDiv = document.createElement('div');
                const inventoryCollections = [];
                for (const frIdx in allClasses) {
                    const fraction = allClasses[frIdx];

                    const fractionAvailableDiv = document.createElement('div');
                    const fractionCheckbox = document.createElement('input');
                    fractionCheckbox.type = 'checkbox';
                    fractionCheckbox.value = fraction[1];
                    fractionCheckbox.checked = showingFraction[fraction[1]];
                    fractionCheckbox.onchange = (event) => {
                        showingFraction[fraction[1]] = event.currentTarget.checked;
                        localStorage.setItem(SHOWING_FRACTION, JSON.stringify(showingFraction));
                    };
                    fractionAvailableDiv.append(fractionCheckbox);
                    fractionAvailableDiv.append(createFractionImg(fraction, false));

                    const inventoryCollection = document.createElement('select');

                    const inventoryCollectionOption = document.createElement('option');
                    inventoryCollectionOption.value = '';
                    inventoryCollectionOption.innerText = '---';
                    inventoryCollection.append(inventoryCollectionOption);

                    inventoryCollection.onchange = (event)=>{
                        showingFractionInvCollection[fraction[1]] = parseInt(event.target.value);
                        localStorage.setItem(SHOWING_FRACTION_INV_COLLECTION, JSON.stringify(showingFractionInvCollection));
                    };

                    inventoryCollections.push({fraction: fraction[1], selectDOM: inventoryCollection});

                    fractionAvailableDiv.append(inventoryCollection);

                    settingsContentDiv.append(fractionAvailableDiv);
                    characterNameDiv.append(settingsContentDiv);
                }

                requestInventoryCollection((items)=>{
                    if(items == null){
                        return;
                    }
                    for(var i = 0; i < items.length; ++i){
                        for(var j = 0; j<inventoryCollections.length; ++j){
                            const inventoryCollectionOption = document.createElement('option');
                            inventoryCollectionOption.value = ''+items[i].idx;
                            inventoryCollectionOption.innerText = items[i].name;
                            inventoryCollections[j].selectDOM.append(inventoryCollectionOption);
                        }
                    }

                    for(var s = 0; s < inventoryCollections.length; ++s){
                        inventoryCollections[s].selectDOM.value = showingFractionInvCollection[inventoryCollections[s].fraction];
                    }

                });
            } else {
                if (settingsContentDiv) {
                    createChangeFractionContent();
                    settingsContentDiv.remove();
                }
            }
        };
        return settingsLink;
    }
})();
