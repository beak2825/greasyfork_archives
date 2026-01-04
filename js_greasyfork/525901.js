// ==UserScript==
// @name         auto_sell
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automatic selling resources
// @author       Salmon
// @license      MIT
// @match        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/*/
// @include      /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/525901/auto_sell.user.js
// @updateURL https://update.greasyfork.org/scripts/525901/auto_sell.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let link;
    if (location.href.includes('https://my.lordswm.com')) link = 'https://my.lordswm.com';
    if (location.href.includes('https://www.heroeswm.ru')) link = 'https://www.heroeswm.ru';
    if (location.href.includes('https://www.lordswm.com')) link = 'https://www.lordswm.com';

    setTimeout(() => {location.reload()}, 10000)

    let currentId = document.cookie.match(/pl_id=\d*/gi).join('');
    currentId = currentId.match(/\d+/gi)[0];

    const resources = [...document.getElementsByClassName('sh_ResourcesItem')];
    const [wood, ore, mercury, sulphur, crystal, gem] = [resources[1], resources[2], resources[3], resources[4], resources[5], resources[6]];

    const createEl = (el, style, innerText, type) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        if (type) element.type = type;
        return element;
    }

    let cheked_resources_to_sell = JSON.parse(localStorage.getItem('cheked_resources_to_sell'));
    if (!cheked_resources_to_sell) {
        localStorage.setItem('cheked_resources_to_sell',JSON.stringify([]));
        location.reload();
    }

    let resources_to_sell = JSON.parse(localStorage.getItem('resources_to_sell'));
    if (!resources_to_sell) {
        localStorage.setItem('resources_to_sell',JSON.stringify([]));
        location.reload();
    }

    let oreCount = Number(ore.lastChild.innerText);
    let gemCount = Number(gem.lastChild.innerText);
    let woodCount = Number(wood.lastChild.innerText);
    let mercuryCount = Number(mercury.lastChild.innerText);
    let sulphurCount = Number(sulphur.lastChild.innerText);
    let crystalCount = Number(crystal.lastChild.innerText);
    let leatherCount;
    let mythrilOreCount;
    let obsidianCount;
    let fairyPowderCount;
    let mythrilCount;
    let nickelCount;
    let orihalkCount;
    let steelCount;

    const fetch_xml = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', `${link}/pl_info.php?id=${currentId}`);
        xhr.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/html; charset=windows-1251');
        }

        xhr.addEventListener('load', () => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText, "text/html");
            var list = [...doc.getElementsByClassName('wb')];
            list = list[13].innerText;
            leatherCount = list.match(/Кожа:.\d+/gi);
            leatherCount !== null ? leatherCount = Number(leatherCount[0].match(/\d+/gi)[0]) : leatherCount = 0;
            mythrilOreCount = list.match(/Мифриловая руда:.\d+/gi);
            mythrilOreCount !== null ? mythrilOreCount = Number(mythrilOreCount[0].match(/\d+/gi)[0]) : mythrilOreCount = 0;
            obsidianCount = list.match(/Обсидиан:.\d+/gi);
            obsidianCount !== null ? obsidianCount = Number(obsidianCount[0].match(/\d+/gi)[0]) : obsidianCount = 0;
            fairyPowderCount = list.match(/Волшебный порошок:.\d+/gi);
            fairyPowderCount !== null ? fairyPowderCount = Number(fairyPowderCount[0].match(/\d+/gi)[0]) : fairyPowderCount = 0;
            mythrilCount = list.match(/Мифрил:.\d+/gi);
            mythrilCount !== null ? mythrilCount = Number(mythrilCount[0].match(/\d+/gi)[0]) : mythrilCount = 0;
            nickelCount = list.match(/Никель:.\d+/gi);
            nickelCount !== null ? nickelCount = Number(nickelCount[0].match(/\d+/gi)[0]) : nickelCount = 0;
            orihalkCount = list.match(/Орихалк:.\d+/gi);
            orihalkCount !== null ? orihalkCount = Number(orihalkCount[0].match(/\d+/gi)[0]) : orihalkCount = 0;
            steelCount = list.match(/Сталь:.\d+/gi);
            steelCount !== null ? steelCount = Number(steelCount[0].match(/\d+/gi)[0]) : steelCount= 0;

            resources_to_sell = [{name: 'Древесина', link: `${link}/ecostat_details.php?id=1`, id: 1, count: woodCount},{name: 'Руда', link: `${link}/ecostat_details.php?id=2`, id:2, count: oreCount},
                             {name: 'Ртуть', link: `${link}/ecostat_details.php?id=3`, id:3, count:mercuryCount},{name: 'Сера', link: `${link}/ecostat_details.php?id=4`, id:4, count: sulphurCount},
                             {name: 'Кристаллы', link: `${link}/ecostat_details.php?id=5`, id:5, count:crystalCount},{name: 'Самоцветы', link: `${link}/ecostat_details.php?id=6`,id:6, count:gemCount},
                             {name: 'Кожа', link: `${link}/ecostat_details.php?id=8`,id:8, count: leatherCount},{name: 'Мифриловая руда', link: `${link}/ecostat_details.php?id=77`,id:77, count:mythrilOreCount},
                             {name: 'Обсидиан', link: `${link}/ecostat_details.php?id=80`,id:80, count:obsidianCount}, {name: 'Волшебный порошок', link: `${link}/ecostat_details.php?id=11`,id:11, count:fairyPowderCount},
                             {name: 'Мифрил', link: `${link}/ecostat_details.php?id=55`,id:55, count:mythrilCount}, {name: 'Никель', link: `${link}/ecostat_details.php?id=10`,id:10, count:nickelCount},
                             {name: 'Орихалк', link: `${link}/ecostat_details.php?id=81`,id:81, count:orihalkCount},{name: 'Сталь', link: `${link}/ecostat_details.php?id=9`,id:9, count:steelCount}];

            localStorage.setItem('resources_to_sell',JSON.stringify(resources_to_sell));
            localStorage.setItem('auto_sell_step',(1));
            location.reload();
        })
        xhr.send();
    }

    const admin_container = document.getElementById('set_mobile_max_width');

    const panel = createEl('div', 'width: 100%; display: flex; flex-wrap: wrap; gap: 10px;', '');
    for (let i = 0; i < resources_to_sell.length; i++) {
        let item = createEl('div', 'display: flex; align-items: center; justify-content: center;');
        let name = createEl('div', '', resources_to_sell[i].name);
        let checkbox = createEl('input');
        checkbox.type = 'checkbox';
        checkbox.id = resources_to_sell[i].id;

        cheked_resources_to_sell.forEach(el => {
            if (el.id == checkbox.id) {
                checkbox.checked = 'checked';
            }
        })
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                cheked_resources_to_sell.push(resources_to_sell[i]);
                localStorage.setItem('cheked_resources_to_sell',JSON.stringify(cheked_resources_to_sell));
            } else if (!checkbox.checked) {
                cheked_resources_to_sell = cheked_resources_to_sell.filter(el => el.id !== Number(checkbox.id));
                localStorage.setItem('cheked_resources_to_sell',JSON.stringify(cheked_resources_to_sell));
            }
        })
        item.append(name);
        item.append(checkbox);
        panel.append(item);
    }

    if (location.href.includes('ecostat')) {
        admin_container.insertAdjacentElement('afterbegin', panel);
    }

    let my_object_auto_sell = (localStorage.getItem('my_object_auto_sell'));
    if (!my_object_auto_sell) {
        localStorage.setItem('my_object_auto_sell',(''));
    }

    let auto_sell_step = (localStorage.getItem('auto_sell_step'));
    if (!auto_sell_step) {
        localStorage.setItem('auto_sell_step',(0));
    }

    if (auto_sell_step == 0 && location.href !== `${link}/ecostat.php`) {
        location.href = `${link}/ecostat.php`;
    }

    if (auto_sell_step == 0 && location.href == `${link}/ecostat.php`) {
        fetch_xml();
    }

    if (auto_sell_step == 1 && location.href !== `${link}/ecostat.php`) {
        location.href = `${link}/ecostat.php`;
    } else if (auto_sell_step == 1 && location.href == `${link}/ecostat.php`) {
        for (let i = 0; i < resources_to_sell.length; i++) {
            if (resources_to_sell[i].count == 0) {
                cheked_resources_to_sell = cheked_resources_to_sell.filter(el => el.id !== resources_to_sell[i].id);
                localStorage.setItem('cheked_resources_to_sell',JSON.stringify(cheked_resources_to_sell));
            }
        }

        if (cheked_resources_to_sell.length !== 0) {
            localStorage.setItem('auto_sell_step',(2));
            location.href = cheked_resources_to_sell[0].link;
        }
    }

    if (auto_sell_step == 2) {
        if (location.href.includes('ecostat_details')) {
            let table_buy = [...document.getElementsByTagName('thead')[1].nextElementSibling.children];
            let most_profit = table_buy.map(el => +el.children[1].innerText);
            most_profit = most_profit.indexOf(Math.max(...most_profit));
            localStorage.setItem('auto_sell_step',(3));
            localStorage.setItem('my_object_auto_sell' ,table_buy[most_profit].children[0].children[0].href);
            table_buy[most_profit].children[0].children[0].click();
        }
    }

    if (auto_sell_step == 3) {
        if (location.href.includes(my_object_auto_sell)) {
            let a = [...document.getElementsByTagName('a')];
            a = a.filter(el => el.href.includes('map.php?cx'));
            localStorage.setItem('auto_sell_step',(4));
            a[0].click();
        }
    }

    if (auto_sell_step == 4) {
        if (location.href.includes('map.php?cx')) {
            let go_btn = document.getElementById('dbut0');
            localStorage.setItem('auto_sell_step',(5));
            go_btn.click();
        }
    }

    if (auto_sell_step == 5 && location.href.includes('map.php?cx')) {
        let go_btn = document.getElementById('dbut0');
        go_btn.click();
    }

    if (auto_sell_step == 5 && location.href != my_object_auto_sell) {
        location.href = my_object_auto_sell;
        localStorage.setItem('auto_sell_step',(6));
    }

    if (auto_sell_step == 6 && location.href != my_object_auto_sell) {
        location.href = my_object_auto_sell;
    } else if (auto_sell_step == 6 && location.href == my_object_auto_sell) {
        let res_elems = [...document.getElementsByClassName('wblight')];

        res_elems = res_elems.filter(el => el.firstChild.innerText.includes(cheked_resources_to_sell[0].name));
        if (res_elems[0].getElementsByTagName('nobr').length !== 0) {
            let nobr = res_elems[0].getElementsByTagName('nobr');
            nobr[0].firstChild.value = '100';
            nobr[0].lastChild.click();
        }
        localStorage.setItem('auto_sell_step',(0));
    }
})();