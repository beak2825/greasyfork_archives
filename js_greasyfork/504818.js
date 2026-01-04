// ==UserScript==
// @name         sklad_helper
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  my_sklad_helper
// @author       Salmon
// @license      MIT
// @match        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(sklad_info).php*/
// @include      /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(sklad_info).php*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504818/sklad_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/504818/sklad_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let users = [38, 125, 86, 54, 163, 194, 20, 92];
    let storage = +location.href.match(/id=\d+/gi)[0].match(/\d+/gi)[0];
    if (!users.includes(storage)) {
        return;
    }

    const error_artsLS = JSON.parse(localStorage.getItem('error_artsLS'));
    if (error_artsLS === null) localStorage.setItem('error_artsLS', JSON.stringify([]));
    const error_arts = error_artsLS;

    let link;
    if (location.href.includes('https://my.lordswm.com')) link = 'https://my.lordswm.com';
    if (location.href.includes('https://www.heroeswm.ru')) link = 'https://www.heroeswm.ru';
    if (location.href.includes('https://www.lordswm.com')) link = 'https://www.lordswm.com';

    const createEl = (el, style, innerText, type, placeholder, value) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        if (type) element.type = type;
        return element;
    }

    const error_arts_block = createEl('div', '', `Errors on arts: ${error_arts.join(' ')}`);
    error_arts_block.style.display = error_arts.length !== 0 ? 'block' : 'none';
    const clear_error_arts_btn = createEl('button', 'margin-left: 5px; height: 20px; color: red;', 'clear');
    clear_error_arts_btn.addEventListener('click', () => {
        error_arts.length = 0;
        error_arts_block.innerText = '';
        localStorage.setItem('error_artsLS', JSON.stringify(error_arts));
    });
    error_arts_block.appendChild(clear_error_arts_btn);

    const al = createEl('select', 'width: 70px;');
    const filter = createEl('select', 'width: 350px');
    const rep_limit = createEl('select', 'width: 60px;');
    const no_filter = createEl('option','', '','','','');
    const blimit = createEl('select', 'width:75px', '', '');
    const save_all_btn = createEl('button', '', 'Сохранить');
    const bcost = createEl('input', 'width: 60px;', '','','price');
    const preloader_block = createEl('img', 'border-radius: 50%; width: 300px; height: 300px; position:absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: none');
    preloader_block.src = 'https://i.pinimg.com/originals/ab/c9/d1/abc9d12a9b1082b357cba7edfb2422ed.gif';
    
    const pick_all_btn = createEl('input', '', '', 'checkbox');
    const put_changes_btn = createEl('button', 'width: 106px', 'Изменить')
    const take_off_all_btn = createEl('button', 'margin-left: 15px; margin-right: 15px', 'Забрать');
    const items_in_inventory = createEl('ul', 'display: none; flex-direction: column; justify-content: center; align-items: center');
    const panel = createEl('div', 'width: 100%; height: 25px; display: flex; gap: 4px; border-bottom: 1px solid black; padding-bottom: 4px;');

    if (location.href == `${link}/sklad_info.php?id=${storage}`) {
        let table = [...document.getElementsByClassName('wbwhite')];
        table.length === 4 ? table = table[3] : table = table[2];
        let text = table.innerText.split('\n');
        text = text.slice(text.indexOf('Части артефактов:'));
        text = text.map(el => el.trim());
        let imp = text.filter(el => el.includes('Имперск')).sort((a,b) => b.localeCompare(a));
        let fear = text.filter(el => el.includes('страх')).sort((a,b) => b.localeCompare(a));
        let magma = text.filter(el => el.includes('Магма')).sort((a,b) => b.localeCompare(a));
        let sky = text.filter(el => el.includes('Небесн')).sort((a,b) => b.localeCompare(a));
        let dark = text.filter(el => el.includes('тьмы')).sort((a,b) => b.localeCompare(a));
        let block = createEl('div', 'display: flex; flex-direction: column; margin-left: 8px; border-top: 1px solid black; margin-top: 7px; gap: 5px;');
        let impBlock = createEl('div', 'display: flex; flex-direction: column');
        let fearBlock = createEl('div', 'display: flex; flex-direction: column');
        let magmaBlock = createEl('div', 'display: flex; flex-direction: column');
        let skyBlock = createEl('div', 'display: flex; flex-direction: column');
        let darkBlock = createEl('div', 'display: flex; flex-direction: column');
        imp.forEach(el => impBlock.append(createEl('div', '', el)));
        fear.forEach(el => fearBlock.append(createEl('div', '', el)));
        magma.forEach(el => magmaBlock.append(createEl('div', '', el)));
        sky.forEach(el => skyBlock.append(createEl('div', '', el)));
        dark.forEach(el => darkBlock.append(createEl('div', '', el)));
        block.append(impBlock);
        block.append(darkBlock);
        block.append(skyBlock);
        block.append(magmaBlock);
        block.append(fearBlock);
        table.append(block);
    }

    filter.appendChild(no_filter);
    document.body.appendChild(preloader_block);
    items_in_inventory.id = 'items_in_inventory';

    for (let i = 0; i < 21; i++) {
        let option = createEl('option');
        option.value = i;
        option.innerHTML = i;
        blimit.appendChild(option);
    }
    for (let i = 0; i < 10; i++) {
        let option = createEl('option');
        option.value = i;
        option.innerHTML = i;
        al.appendChild(option);
    }
    for (let i = 0; i < 100; i++) {
        let option = createEl('option');
        option.value = i;
        option.innerHTML = i;
        rep_limit.appendChild(option);
    }

    let element = document.getElementsByTagName('tbody');
    element = element[element.length -1];

    let table = document.getElementsByTagName('table');
    table = table[table.length - 1];

    table.insertAdjacentElement('beforebegin', panel);
    let select_to_put = [...document.getElementsByName('p_art_id')[0].children];
    select_to_put.splice(0,1);

    let select_to_put_block = document.getElementsByName('f')[0];
    let sign = select_to_put_block.children[1].value;
    let sklad_id = select_to_put_block.children[0].value;

    let items_to_put = [];
    let put_arts_btn = createEl('button', 'width: 100%; margin-right: 35px;', 'put arts');
    let put_arts_func = () => {
        preloader_block.style.display = 'block';
        const urls = [];
        items_to_put.forEach(el => {
            urls.push(`${link}/sklad_info.php?id=${sklad_id}&sign=${sign}&p_art_id=${el.id}`)
        });
        Promise.allSettled(urls.map(u=>fetch(u))).then(responses =>
            Promise.allSettled(responses.map(res => {
            if (res.status !== 'fulfilled') {
                let id = res.url.match(/art_id=\d+/);
                if (id !== null) id = +id[0].match(/\d+/)[0];
                let item = items_to_put.filter(el => el.id == id);
                error_arts.push(item[0].name);
                localStorage.setItem('error_artsLS', JSON.stringify(error_arts));
            }
        }))).then(texts => {
            preloader_block.style.display = 'none';
            location.reload();
        })
    };
    put_arts_btn.addEventListener('click', put_arts_func);

    items_in_inventory.appendChild(error_arts_block);
    items_in_inventory.appendChild(put_arts_btn);
    select_to_put.forEach(el => {
        let item = createEl('li', 'cursor: pointer; width: 100%', el.innerText);
        item.addEventListener('click', () => {
            if (items_to_put.map(el => el.id).includes(item.id)) {
                items_to_put = items_to_put.filter(el => el.id !== item.id);
                item.style.background = 'none';
            } else {
                items_to_put.push({id: item.id, name: item.innerText});
                item.style.background = 'wheat';
            }
        })
        item.id = el.value;
        items_in_inventory.appendChild(item);
    })
    let put_arts_btn2 = put_arts_btn.cloneNode(true);
    put_arts_btn2.addEventListener('click', put_arts_func);
    items_in_inventory.appendChild(put_arts_btn2);

    let select_block_visibility_btn = createEl('div', 'cursor: pointer; display: flex; justify-content: center; align-items: center; width: 100%;');
    let select_block_visibility_btn_text = createEl('div', 'width: 80px; background: white; height: 20px; border: 1px solid black; border-radius: 3px; display: flex; justify-content: center; align-items: center;','Arts');
    select_block_visibility_btn.appendChild(select_block_visibility_btn_text);

    select_block_visibility_btn.addEventListener('click', () => {
        if (items_in_inventory.style.display == 'none') {
            document.getElementById('items_in_inventory').style.display = 'flex';
        } else if (items_in_inventory.style.display == 'flex') items_in_inventory.style.display = 'none';
    })
    select_to_put_block.appendChild(select_block_visibility_btn);
    select_to_put_block.appendChild(items_in_inventory);

    let options = [];

    let my_element = [...element.children];
    if (location.href.includes('cat=5')) {
        my_element.splice(0, 1);
        if (my_element[my_element.length - 1].innerHTML.includes('Сделать комплектом') || my_element[my_element.length - 1].innerHTML.includes('Make a set')) {
            my_element.pop();
        }
    } else {
        my_element.splice(0, 2);
    }

    let current_filter = '';

    my_element.map((el, i) => {
        const checkbox_wrap = createEl('div', 'display: table-cell; vertical-align: inherit; unicode-bidi: isolate; text-align: -webkit-center;')
        const checkbox = createEl('input', '','', 'checkbox');
        checkbox.id = i;
        checkbox_wrap.appendChild(checkbox);
        el.appendChild(checkbox_wrap);
        let name = el.getElementsByTagName('font')[0].innerText.match(/\'.+\'/gi)[0].replaceAll("'", "");
        options.push(name);
    })
    options = [...new Set(options)];
    options.forEach(el => {
        let opt = createEl('option');
        opt.value = el;
        opt.innerHTML = el;
        filter.appendChild(opt);
    });

    filter.addEventListener('change', (e) => {
        current_filter = e.target.value;
        my_element.map((el, i) => {
            if (el.getElementsByTagName('font')[0].innerText.includes(e.target.value)) {
                el.style.display = 'table-row';
            } else {
                el.style.display = 'none';
            }
        });

    })
    pick_all_btn.addEventListener('click', () => {
        my_element.map((el, i) => {
            if (current_filter === '') {
                document.getElementById(i).checked = !document.getElementById(i).checked
            } else if (el.getElementsByTagName('font')[0].innerText.match(/\'.+\'/gi)[0].replaceAll("'", "") === current_filter) {
                let ele = el.getElementsByTagName('input');
                ele = ele[ele.length - 1];
                ele.checked = !ele.checked;
            }
        })
    })
    const save_changes = () => {
        const urls = [];
        preloader_block.style.display = 'block';
        my_element.map((el, i) => {
            if (document.getElementById(i).checked === true) {
                const inputs = [...el.getElementsByTagName('input')];
                const selects = [...el.getElementsByTagName('select')];
                const id = inputs.filter(el => el.name === 'id')[0].value;
                const al = selects.filter(el => el.name === 'al')[0].value;
                const cat = inputs.filter(el => el.name === 'cat')[0].value;
                const sign = inputs.filter(el => el.name === 'sign')[0].value;
                const bcost = inputs.filter(el => el.name === 'bcost')[0].value;
                const action = inputs.filter(el => el.name === 'action')[0].value;
                const inv_id = inputs.filter(el => el.name === 'inv_id')[0].value;
                const set_id = inputs.filter(el => el.name === 'set_id')[0].value;
                const blimit = selects.filter(el => el.name === 'blimit')[0].value;
                const rep_limit = selects.filter(el => el.name === 'rep_limit')[0].value;

                urls.push(`${link}/sklad_info.php?id=${id}&sign=${sign}&cat=${cat}&action=${action}&inv_id=${inv_id}&set_id=${set_id}&blimit=${blimit}&bcost=${bcost}&al=${al}&rep_limit=${rep_limit}`);
            }
        });
        Promise.allSettled(urls.map(u=>fetch(u))).then(responses =>
            Promise.allSettled(responses.map(res => res))).then(texts => {
            preloader_block.style.display = 'none';
            location.reload();
        })
    }
    save_all_btn.addEventListener('click', () => save_changes());

    const get_arts = () => {
        const urls = [];
        preloader_block.style.display = 'block';
        my_element.map((el, i) => {
            if (document.getElementById(i).checked === true) {
                const inputs = [...el.getElementsByTagName('input')];
                const selects = [...el.getElementsByTagName('select')];
                const id = inputs.filter(el => el.name === 'id')[0].value;
                const cat = inputs.filter(el => el.name === 'cat')[0].value;
                const sign = inputs.filter(el => el.name === 'sign')[0].value;
                const action = inputs.filter(el => el.name === 'action')[0].value;
                const inv_id = inputs.filter(el => el.name === 'inv_id')[0].value;
                const set_id = inputs.filter(el => el.name === 'set_id')[0].value;

                urls.push(`${link}/sklad_info.php?id=${id}&sign=${sign}&cat=${cat}&action=get_art&inv_id=${inv_id}&set_id=${set_id}`);
            }
        })
        Promise.allSettled(urls.map(u=>fetch(u))).then(responses =>
            Promise.allSettled(responses.map(res => res))).then(texts => {
            preloader_block.style.display = 'none';
            location.reload();
        })
    };
    take_off_all_btn.addEventListener('click', () => get_arts());

    put_changes_btn.addEventListener('click', () => {
        my_element.map((el, i) => {
            if (document.getElementById(i).checked === true) {
                const inputs = [...el.getElementsByTagName('input')];
                const selects = [...el.getElementsByTagName('select')];
                if (bcost.value !== '') inputs.filter(el => el.name === 'bcost')[0].value = bcost.value;
                if (blimit.value !== '') selects.filter(el => el.name === 'blimit')[0].value = blimit.value;

                selects.filter(el => el.name === 'al')[0].value = al.value;
                selects.filter(el => el.name === 'rep_limit')[0].value = rep_limit.value;
            }
        })
    })

    panel.appendChild(filter);
    panel.appendChild(put_changes_btn);
    panel.appendChild(blimit);
    panel.appendChild(bcost);
    panel.appendChild(al);
    panel.appendChild(rep_limit);
    panel.appendChild(save_all_btn);
    panel.appendChild(take_off_all_btn);
    panel.appendChild(pick_all_btn);

})();