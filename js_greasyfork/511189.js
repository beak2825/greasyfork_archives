// ==UserScript==
// @name         protocol_search_new
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  hwm protocol searching
// @author       Salmon
// @match        /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(pl_transfers).php*/
// @include      /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(pl_transfers).php*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511189/protocol_search_new.user.js
// @updateURL https://update.greasyfork.org/scripts/511189/protocol_search_new.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Constants
    const create_el = (el, style, innerText, className, placeholder) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        if (className) element.className = className;
        if (placeholder) element.placeholder = placeholder;
        return element;
    }

    const convert_date = (date) => {
        let t = new Date(date);
        let seconds = t.getSeconds() < 10 ? `0${t.getSeconds()}` : t.getSeconds();
        let minutes = t.getMinutes() < 10 ? `0${t.getMinutes()}` : t.getMinutes();
        let hours = t.getHours() < 10 ? `0${t.getHours()}` : t.getHours();
        let day = t.getDate() < 10 ? `0${t.getDate()}` : t.getDate();
        let month = t.getMonth() + 1 < 10 ? `0${t.getMonth() + 1}` : t.getMonth() + 1;
        let year = t.getFullYear();
        return `${day}.${month}.${year}    ${hours}:${minutes}:${seconds}`
    }

    const links = ['https://my.lordswm.com', 'https://www.heroeswm.ru'];
    const pers_id = location.href.match(/id=\d+/gi)[0].match(/\d+/gi)[0];
    const link = location.href.slice(0, 22) === 'https://my.lordswm.com' ? links[0] : links[1];
    const common_btn_style = 'border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s;transition: filter .15s;'

    //variable
    let stop_page = 0;
    let temp_stats = [];
    let current_page = 0;
    let stats = {market: {}, direct: {}};
    let all_pages_amount = 0;
    let records_visibility = false;
    let container_visibility = false;
    let heroes_stat_block_visibility = false;
    let my_data;
    let variable_data = [];

    //Local Storage data
    const parsing_toogle = JSON.parse(localStorage.getItem('parsing_toogle'));
    if (parsing_toogle === null) localStorage.setItem('parsing_toogle', JSON.stringify(false));
    let start_stop = parsing_toogle;

    //UI
    let game_container = document.getElementsByClassName('hwm_pagination')[0];
    const hidden_warhouse = document.getElementsByClassName('global_a_hover')[0].parentElement;

    const container = create_el('div', 'border-bottom: 1px solid black; min-width: 300px; display: none; margin-top: 15px; margin-bottom: 15px');
    const menu = create_el('div');
    const parsed_data_block = create_el('div', 'display: flex; gap: 3px; flex-wrap: wrap;', '');
    parsed_data_block.classList.add('parsed_block');
    const info_block = create_el('div');
    const no_info_block = create_el('div', 'display: none;', 'Can`t find any data. Try to parse!');
    const save_data_btn = create_el('div', `${common_btn_style} width: 250px; display: none`, 'SAVE DATA');
    const range_block = create_el('div', 'display: flex; gap: 3px; justify-content: center; margin-bottom: 5px; padding: 5px; border-bottom: 1px solid gray');
    const start_range = create_el('input', 'width: 50px', '', '', 'START');
    const stop_range = create_el('input', 'width: 50px', '', '', 'STOP');
    const start_search_btn = create_el('div',`${common_btn_style} width: 150px;`, `${start_stop ? 'Stop parsing' : 'Start parsing'}`);
    const loader_block = create_el('div', 'display: flex; font-weight: bold; justify-content: center');
    const search_input = create_el('input', '', '', '', 'Enter search value');
    const records_block = create_el('div', 'text-align: left; padding: 5px; display: none','', 'global_a_hover');
    const statistic_container = create_el('div', 'display: flex; justify-content: center; flex-direction: column; align-items: center;', '');
    const statistic_block = create_el('div', 'display: flex; gap: 10px;')
    const heroes_stat_block = create_el('div', 'display: none; flex-direction: column');
    let gold_img = create_el('img', 'width: 15px; height: 15px; margin-left: 3px;');
    gold_img.src = 'https://cfcdn.lordswm.com/i/r/48/gold.png?v=3.23de65';

    search_input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let words = search_input.value.split(' ');
            for (let i = 0; i < words.length - 1; i++) {
                words[i] = words[i].toLowerCase() + '.+';
            }
            words = words.join('');
            let filtered = variable_data.filter(el => el.toLowerCase().match(new RegExp(words, 'gi')) !== null);
            records_block.innerHTML = filtered.join('');
        }
    })

    const container_visibility_btn = create_el('div', `${common_btn_style} width: 250px;`, `${container_visibility ? 'Hide menu' : 'Show menu'}`);
    container_visibility_btn.addEventListener('click', () => {
        container_visibility = !container_visibility;
        container.style.display = `${container_visibility ? 'block' : 'none'}`;
        container_visibility_btn.innerText = `${container_visibility ? 'Hide menu' : 'Show menu'}`
    })
    const pages_amount = create_el('div', 'font-weight: bold');
    const current_page_amount = create_el('div', 'font-weight: bold', `${current_page}`);
    const show_detailed_stats_btn = create_el('div', `${common_btn_style} margin: 15px; width: 150px; display: none;`, 'Detailed stats');
    show_detailed_stats_btn.addEventListener('click', () => {
        heroes_stat_block_visibility = !heroes_stat_block_visibility;
        heroes_stat_block.style.display = `${heroes_stat_block_visibility ? 'flex' : 'none'}`;
        show_detailed_stats_btn.innerText = `${heroes_stat_block_visibility ? 'Hide detailed' : 'Show detailed'}`
    })

    if (game_container) {
        game_container = game_container.parentElement;
        game_container.appendChild(container_visibility_btn);
        game_container.appendChild(container);
    } else {
        hidden_warhouse.appendChild(container_visibility_btn);
        hidden_warhouse.appendChild(container);
    }
    range_block.appendChild(start_range);
    range_block.appendChild(stop_range);
    range_block.appendChild(start_search_btn);
    statistic_container.appendChild(statistic_block);
    statistic_container.appendChild(show_detailed_stats_btn);
    statistic_container.appendChild(heroes_stat_block);
    menu.appendChild(statistic_container);
    menu.appendChild(loader_block);
    menu.appendChild(range_block);
    menu.appendChild(parsed_data_block);
    container.appendChild(no_info_block);
    container.appendChild(info_block);
    container.appendChild(menu);
    container.appendChild(search_input);
    container.appendChild(save_data_btn);

    const show_data = (data) => {
        for (let i = 0; i < data.data.length; i++) {
            let t = new Date(data.data[i].time);
            let delete_btn = create_el('div','position: absolute; top: 0; right: 2; z-index: 99999;', '✗');
            delete_btn.addEventListener('click', () => {
                let question = confirm('Delete ?');
                if (question) {
                    let filtered = data.data.filter(el => el.time !== data.data[i].time);
                    delete_from_db(filtered);
                    info.remove();
                }

            })
            let info = create_el('div', `${common_btn_style} min-width: 50px; position: relative; padding: 3px;`, `Pages: ${data.data[i].range_id}\n${convert_date(t)}`);
            info.appendChild(delete_btn);
            info.classList.add('info_item');

            const create_stats = (information, lab) => {
                let label = create_el('div', 'font-weight: bold; border-bottom: 1px solid black', `${lab}`)
                let container = create_el('div', '');
                container.appendChild(label)
                let total_record = create_el('div', 'display: flex;');
                let hero_block = create_el('div', 'display: flex; flex-wrap: wrap; max-width: 1200px;');
                let total_element_block = create_el('div','text-align: left; width: 150px', 'TOTAL')
                let total_price_block = create_el('div', 'text-align: left; font-weight: bold;', '');
                let total_amount_block = create_el('div', 'text-align: left; font-weight: bold; width: 60px', '');

                let total_price = 0;
                let total_amount = 0;
                information.forEach(el => {
                    let record = create_el('div', 'display: flex; border-bottom: 1px solid black');
                    let element = create_el('div', 'text-align: left; width: 150px', `${el[0]}`);
                    let element2 = create_el('div', 'text-align: center; font-weight: bold; color: red; border-bottom: 1px solid red; width: 100%', `${el[0]}`);
                    let amount = create_el('div', 'text-align: left; width: 60px', `${el[1].amount} шт`);
                    let price = create_el('div', 'text-align: left;', `${el[1].price}`);
                    let block = create_el('div', 'display: flex; flex-direction: column; border-bottom: 1px solid black; flex-grow: 1; gap: 3px; border: 1px solid black');
                    block.appendChild(label.cloneNode(true));
                    block.appendChild(element2);
                    record.appendChild(element);
                    record.appendChild(amount);
                    record.appendChild(price);
                    record.appendChild(gold_img.cloneNode(true));
                    container.appendChild(record)
                    total_price += el[1].price;
                    total_amount += el[1].amount;
                    for (let i = 0; i < el[1].heroes.length; i++) {
                        let wrapper = create_el('div', 'display: flex; gap: 2px; width: 300px;');
                        let hero = create_el('div', 'width: 150px', `${el[1].heroes[i].hero}`);
                        let amount = create_el('div', 'text-align: left; width: 50px', `${el[1].heroes[i].amount} шт`);
                        let price = create_el('div', 'text-align: left; width: 50px', `${el[1].heroes[i].price}`);
                        wrapper.appendChild(hero)
                        wrapper.appendChild(amount)
                        wrapper.appendChild(price)
                        wrapper.appendChild(gold_img.cloneNode(true));
                        block.appendChild(wrapper);
                    }
                    hero_block.appendChild(block);
                });
                total_price_block.innerText = total_price;
                total_amount_block.innerText = `${total_amount} шт`;
                total_record.appendChild(total_element_block);
                total_record.appendChild(total_amount_block);
                total_record.appendChild(total_price_block);
                total_record.appendChild(gold_img.cloneNode(true));
                container.appendChild(total_record);
                statistic_block.appendChild(container);
                heroes_stat_block.appendChild(hero_block)
            }

            info.addEventListener('click', () => {
                show_detailed_stats_btn.style.display = 'block';
                records_block.innerHTML = data.data[i].data.flat(Infinity).join('');
                variable_data = data.data[i].data.flat(Infinity);
                statistic_block.innerHTML = '<div></div>';
                heroes_stat_block.innerHTML = '<div></div>';
                create_stats(data.data[i].stats.market, 'MARKET');
                create_stats(data.data[i].stats.direct, 'PROTOCOL');
            })
            parsed_data_block.appendChild(info);
            document.querySelector('.parsed_block').addEventListener('click', function (event) {
                if (event.target.classList.contains('info_item')) {
                    document.querySelectorAll('.info_item').forEach(item => item.style.color = '#592c08');
                    event.target.style.color = '#4f4bcb';
                }
            });
        }
        current_page = data.parsed_pages_amount;
        const records_block_visibility_btn = create_el('div',`${common_btn_style} width: 250px; margin-bottom: 15px; margin-top: 15px;`, `${records_visibility ? 'Hide records' : 'Show records'}`);
        records_block_visibility_btn.addEventListener('click', () => {
            records_visibility = !records_visibility;
            records_block.style.display = `${records_visibility ? 'block' : 'none'}`;
            records_block_visibility_btn.innerText = `${records_visibility ? 'Hide records' : 'Show records'}`;
        })
        info_block.appendChild(pages_amount);
        container.appendChild(records_block_visibility_btn);
        container.appendChild(records_block);
    }

    const check_all_pages_count = async (id) => {
        let res = await fetch(`${link}/pl_transfers.php?id=${id}&page=100050000`);
        let data = await res.text();
        let last_page = Number(data.match(/href="#">\d+/gi)[0].match(/\d+/gi)[0]);
        pages_amount.innerText = `Total pages: ${last_page}`;
        all_pages_amount = last_page;
    }
    check_all_pages_count(pers_id);

    //Database functions
    let request = indexedDB.open('protocolDB', 1);
    let db;
    let object_store_create;

    request.onupgradeneeded = async (event) => {
        db = event.target.result;
        object_store_create = db.createObjectStore('search_protocol', { keyPath: 'id' });
    };

    request.onerror = function(event) {};

    request.onsuccess = function(event) {
        db = event.target.result;
        get_data_from_DB(pers_id);
    };

    const add_data_to_db = (char_id, parsed_pages_amount, data, stats) => {
        let transaction = db.transaction(['search_protocol'], 'readwrite');
        let object_store = transaction.objectStore('search_protocol');

        let data_object = {id: char_id, data: []};
        let my_data = {range_id: `${start_range.value}-${stop_range.value}`, parsed_pages_amount: parsed_pages_amount, all_pages_amount, data: data, time: Date.now(), stats};
        data_object.data.push(my_data);

        let request = object_store.add(data_object);

        request.onsuccess = function(event) {
            location.reload();
        };
        request.onerror = function(event) {};
    }

    const get_data_from_DB = (id) => {
        let transaction = db.transaction(['search_protocol'], 'readwrite');
        let objectStore = transaction.objectStore('search_protocol');

        let request = objectStore.get(id);

        request.onsuccess = function(event) {
            let data = event.target.result;
            if (!data) {
                no_info_block.style.display = 'block';
                no_info_block.append(pages_amount);
            } else {
                show_data(data);
                my_data = data;
            }
        };
    }

    const update_db = (parsed_pages_amount, data, stats) => {
        var transaction = db.transaction(['search_protocol'], 'readwrite');
        var objectStore = transaction.objectStore('search_protocol');

        my_data.data.push({range_id: `${start_range.value}-${stop_range.value}`, parsed_pages_amount: parsed_pages_amount, all_pages_amount, data: data, time: Date.now(), stats})
        var request = objectStore.put(my_data);

        request.onsuccess = function(event) {
            location.reload();
        };

        request.onerror = function(event) {};
    }

    const delete_from_db = (filtered) => {
        var transaction = db.transaction(['search_protocol'], 'readwrite');
        var objectStore = transaction.objectStore('search_protocol');

        my_data.data = filtered;
        var request = objectStore.put(my_data);
    }

    let parsed_pages = [];

    const fetch_xml = (page) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', `${link}/pl_transfers.php?id=${pers_id}&page=${page}`);
        xhr.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/html; charset=windows-1251');
        }

        xhr.addEventListener('load', () => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText, "text/html");
            var global_elem = doc.getElementsByClassName('global_a_hover')[1];
            var list = global_elem.innerHTML.split('<br>');
            list.pop();
            for (let i = 0; i < list.length; i++) {
                let obj = {};
                let element = list[i].match(/Куплен "\S+ \S+"|Куплен "\S+\S+"|Получен элемент "\S+ \S+"|Получен элемент "\S+\S+"/gi);
                let amount = list[i].match(/\d+ шт/gi);
                let price = list[i].match(/за \d+/gi);
                let hero = list[i].match(/<b>.+<\/b>/gi);
                let heroLink = list[i].match(/pl_info.php?id=\d+/gi);

                if (element !== null && element[0].includes('Куплен')) {
                    obj.type = 'Куплен';
                    element = element[0].replace('Куплен','').replaceAll('"','').trim();
                }
                if (element !== null && element[0].includes('Получен')) {
                    obj.type = 'Получен';
                    element = element[0].replace('Получен элемент','').replaceAll('"','').trim();
                }
                amount === null ? amount = 1 : amount = +amount[0].match(/\d+/gi)[0];
                price === null ? price = 0 : price = +price[0].match(/\d+/gi)[0];
                if (hero !== null) {
                    hero = hero[0].replace('<b>', (''));
                    hero = hero.replace('</b>', (''));
                }
                if (heroLink !== null) heroLink = heroLink[0];

                obj.element = element;
                obj.amount = amount;
                obj.price = price;
                obj.hero = hero;
                obj.heroLink = heroLink;

                temp_stats.push(obj);

                let art_id = list[i].match(/--\d+/gi);
                if (art_id !== null) {
                    art_id = art_id[0].match(/\d+/gi)[0];
                } else {
                    art_id = '';
                }
                list[i] = `<span style="font-weight: bold";>${art_id} </span>` + list[i] + `<br>`;
            }
            temp_stats = temp_stats.filter(el => el.element !== null);
            temp_stats = temp_stats.sort((a,b) => a.element.localeCompare(b.element));
            let res = {};
            let res2 = {};

            for (let i = 0; i < temp_stats.length; i++) {
                if (temp_stats[i].type === 'Куплен') {
                    if (res.hasOwnProperty(temp_stats[i].element)) {
                        res[temp_stats[i].element].amount += temp_stats[i].amount;
                        res[temp_stats[i].element].price += temp_stats[i].price;
                        if (res[temp_stats[i].element].heroes.findIndex(el => el.hero === temp_stats[i].hero) !== -1) {
                            let index = res[temp_stats[i].element].heroes.findIndex(el => el.hero === temp_stats[i].hero);
                            res[temp_stats[i].element].heroes[index].amount += temp_stats[i].amount;
                            res[temp_stats[i].element].heroes[index].price += temp_stats[i].price;
                        } else {
                            res[temp_stats[i].element].heroes.push({hero: temp_stats[i].hero, amount: temp_stats[i].amount, price: temp_stats[i].price, heroLink: temp_stats[i].heroLink})
                        }
                    } else {
                        res[temp_stats[i].element] = {amount: temp_stats[i].amount, price: temp_stats[i].price, heroes: []};
                        res[temp_stats[i].element].heroes.push({hero: temp_stats[i].hero, amount: temp_stats[i].amount, price: temp_stats[i].price, heroLink: temp_stats[i].heroLink});
                    }
                } else if (temp_stats[i].type === 'Получен') {
                    if (res2.hasOwnProperty(temp_stats[i].element)) {
                        res2[temp_stats[i].element].amount += temp_stats[i].amount;
                        res2[temp_stats[i].element].price += temp_stats[i].price;
                        if (res2[temp_stats[i].element].heroes.findIndex(el => el.hero === temp_stats[i].hero) !== -1) {
                            let index = res2[temp_stats[i].element].heroes.findIndex(el => el.hero === temp_stats[i].hero);
                            res2[temp_stats[i].element].heroes[index].amount += temp_stats[i].amount;
                            res2[temp_stats[i].element].heroes[index].price += temp_stats[i].price;
                        } else {
                            res2[temp_stats[i].element].heroes.push({hero: temp_stats[i].hero, amount: temp_stats[i].amount, price: temp_stats[i].price, heroLink: temp_stats[i].heroLink})
                        }
                    } else {
                        res2[temp_stats[i].element] = {amount: temp_stats[i].amount, price: temp_stats[i].price, heroes: []};
                        res2[temp_stats[i].element].heroes.push({hero: temp_stats[i].hero, amount: temp_stats[i].amount, price: temp_stats[i].price, heroLink: temp_stats[i].heroLink});
                    }
                }
            }

            stats.market = Object.entries(res);
            stats.direct = Object.entries(res2);

            list.unshift(`<div>Page ${current_page + 1}</div>`);
            parsed_pages = [...parsed_pages, list];
            current_page_amount.innerText = `${current_page}`;
            current_page = current_page + 1;
            loader_block.innerText = `Progress: ${current_page}/${stop_page + 1}`

            if (xhr.status === 200 && start_stop && current_page > stop_page) {
                if (my_data) {
                    update_db(current_page, parsed_pages, stats)
                } else {
                    add_data_to_db(pers_id, current_page, parsed_pages, stats);
                }
                current_page_amount.innerText = `${current_page}`;
                current_page = 0;
                stop_page = 0;
                start_stop = !start_stop;
                localStorage.setItem('parsingToogle', start_stop);
            } else if (xhr.status === 200 && start_stop && current_page <= stop_page) {
                fetch_xml(current_page, pers_id);
            }
        })
        xhr.send();
    }

    save_data_btn.addEventListener('click', () => {
        if (my_data) {
            update_db(current_page, parsed_pages, stats);
        } else {
            add_data_to_db(pers_id, current_page, parsed_pages, stats);
        }
    })

    start_search_btn.addEventListener('click', () => {
        if (!start_range.value || !stop_range.value) {
            alert('Set range!');
            return;
        } else if (start_range.value && stop_range.value) {
            if (current_page === undefined || current_page === 0) {
                current_page = Number(start_range.value) - 1;
            } else {
                current_page = current_page;
            }
            stop_page = Number(stop_range.value) - 1;
        }
        loader_block.innerText = `Progress: ${current_page}/${stop_page + 1}`
        save_data_btn.style.display = 'block';
        start_stop = !start_stop;
        localStorage.setItem('parsingToogle', start_stop);
        start_search_btn.innerText = `${start_stop ? 'Stop parsing' : 'Start parsing'}`;
        if (start_stop) fetch_xml(current_page);
    })

})();