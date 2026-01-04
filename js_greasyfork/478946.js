// ==UserScript==
// @name         B 站直播 SC 提示
// @namespace    xin
// @version      0.1
// @description  show bilibili sc as normal comments on bottom left
// @author       You
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478946/B%20%E7%AB%99%E7%9B%B4%E6%92%AD%20SC%20%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/478946/B%20%E7%AB%99%E7%9B%B4%E6%92%AD%20SC%20%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    console.log("Hello World");
    setup();
})();

function setup() {
    setTimeout(() => {
        if (!get_sc_panel()) return setup();
        observe_panel();
    }, 1000)
}

async function start() {

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };
    let id = 0;

    let sc_cards = Array.from(get_scs());
    if (sc_cards.length == 0) {
        console.log('无 SC');
        return;
    }
    sc_cards.forEach(card => {
        card.dataset.id = id++;
    });

    let sc_cards_text_map = await get_all_card_details(sc_cards);

    // Callback function to execute when mutations are observed
    const callback = async (mutationList, observer) => {
        console.log('检测到 SC 变化 ');
        log_sc_count();
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(addedNode => {
                    addedNode.dataset.id = id++;
                    console.log('增加一个 sc ', addedNode.dataset.id);
                    sc_cards.push(addedNode);
                    get_sc_detail(addedNode).then(text => sc_cards_text_map[addedNode.dataset.id] = text).then(() => render());
                });
                mutation.removedNodes.forEach(removedNode => {
                    console.log('移除一个 sc ', removedNode.dataset.id);
                    sc_cards = sc_cards.filter(card => card.dataset.id === removedNode.dataset.id);
                    if (sc_cards_text_map[removedNode.dataset.id]) {
                        delete sc_cards_text_map[removedNode.dataset.id];
                    }
                    render();
                });
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    log_sc_count();

    // Start observing the target node for configured mutations
    if (get_sc_wrapper()) {
        console.log('obser sc');
        observer.observe(get_sc_wrapper(), config);
    }

    render();

    function render() {
        console.log(sc_cards_text_map);
        render_scs(Object.values(sc_cards_text_map));
    }
}

function observe_panel() {
    // let is_started = false;
    const observer = new MutationObserver(handle_mutation_event);

    observer.observe(get_sc_panel(), { childList: true, subtree: true });

    function handle_mutation_event(mutationList) {
        if (mutationList.some(mutation => mutation.type === 'childList' && Array.from(mutation.addedNodes).some(node => node?.classList?.contains('pay-note-panel') ?? false))) {
            console.log('start')
            start();
        }
    }

    start();
}

function get_sc_panel() {
    return document.querySelector('#pay-note-panel-vm');
}

function get_sc_wrapper() {
    return document.querySelector('#pay-note-panel-vm .card-wrapper');
}

function get_scs() {
    return document.querySelectorAll('#pay-note-panel-vm .card-item-box');
}

function log_sc_count() {
    console.log('目前已有 sc ' + get_scs().length + ' 个');
}

async function get_all_card_details(sc_cards) {
    // return ['测试测 his', '1123123ddd'];
    const sc_card_details = {}
    for (let i = 0; i < sc_cards.length; i++) {
        const sc_card = sc_cards[i];
        sc_card_details[sc_card.dataset.id] = await get_sc_detail(sc_card);
    }
    return sc_card_details;
}

async function get_sc_detail(card) {
    if (get_sc_detail_node()) {
        get_active_sc_card()?.click();
        await wait_time(150);
    }
    card.click();
    await wait_time(150);
    const detail = get_sc_detail_node();
    if (detail) {
        while(!detail.querySelector('.input-contain .text')) {
            await wait_time(100);
        }
        const text = detail.querySelector('.input-contain .text');
        console.log(text);
        card?.click();
        return text.innerText;
    } else {
        card?.click();
        return;
    }
}

function get_active_sc_card() {
    return document.querySelector('#pay-note-panel-vm .card-item-box.active');
}

function get_sc_detail_node() {
    return document.querySelector('#pay-note-panel-vm .detail-info');
}

function render_scs(sc_details) {
    const ol = document.createElement('ol');
    const id = 'xxx-sc-lists';
    ol.id = id;
    ol.style.position = 'absolute';
    ol.style.bottom = '24px';
    ol.style.left = '24px';
    ol.style.zIndex = '99999';
    sc_details.map(detail => {
        const li = document.createElement('li');
        li.style.color = 'rgba(255,255,255,0.8)';
        li.style.fontSize = '1.5rem';
        li.style.textShadow = '1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000';
        li.appendChild(document.createTextNode(detail));
        return li;
    }).forEach(element => {
        ol.appendChild(element);
    })
    document.querySelector(`#${id}`)?.remove();
    document.querySelector('.web-player-danmaku').appendChild(ol);
}

function wait_time(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    });
}