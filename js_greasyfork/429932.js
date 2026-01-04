// ==UserScript==
// @name         bahamut image downloader
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  where the CORS
// @author       ChaosOp
// @match        https://forum.gamer.com.tw/C*
// @match        https://forum.gamer.com.tw/Co*
// @match        https://truth.bahamut.com.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429932/bahamut%20image%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/429932/bahamut%20image%20downloader.meta.js
// ==/UserScript==

let path = "";

(() => {
    'use strict';

    setInterval(() => {

        let path_now = window.location.href.replace(/\?w=[0-9]+/, "");

        if (GM_getValue(path_now, null)) {
            GM_deleteValue(path_now);
            download_image(path_now, true);
        }
        else if (path_now != path) {
            path = path_now;
            init_menu();
        }

    }, 500);

})();


function init_menu() {

    let init_array = [];

    let button = new_node("a", {
        innerText: "下載圖片",
        id: "download_image"
    });
    button.addEventListener('click', async () => {
        let page_count = 1;

        let url = path;
        if (!url.match(/page=[0-9]+/)) url = url.replace('php?', 'php?page=1&');
        if (get(".BH-pagebtnA").length === 2) page_count = parseInt(get(".BH-pagebtnA")[0].lastChild.innerText);

        let start = 1;
        if (get("#start_page").value > 0) start = parseInt(get("#start_page").value);

        let end = page_count;
        if (get("#end_page").value > 0) end = parseInt(get("#end_page").value);

        for (let page = start; page <= end; page++) {
            await fetch(url.replace(/page=[0-9]+/, `page=${page}`)).then(e => e.text()).then(html => {
                let doc = new DOMParser().parseFromString(html, "text/html");
                let node_arr = Array.from(get(".photoswipe-image", doc));

                let i = 0;
                let process = setInterval(async () => {
                    let url = node_arr[i].href;
                    if (url.match('https://truth.bahamut.com.tw')) {
                        GM_setValue(url, true);
                        window.open(url);
                    }
                    else await download_image(url);
                    i++;
                    if (i == node_arr.length) clearInterval(process);
                }, parseFloat(get(`#delay_val`).value));
            });
        }

    });
    init_array.push(button);

    ['start', 'end'].forEach(page_type => {
        let page = new_node("input", {
            value: 0,
            id: `${page_type}_page`
        });
        Object.assign(page.style, {
            'width': "27px",
            'height': '20px',
            'border-radius': '10px',
            'min-width': 0,
            'outline': '0px',
            'margin': '8px 0px'
        });
        init_array.push(page);
    });


    ['bar', 'val'].forEach((display_type, i, arr) => {
        let default_val = localStorage.image_downloader_delay;
        if (!default_val) default_val = '1000';
        let display = new_node("input", {
            value: default_val,
            id: `delay_${display_type}`
        });
        Object.assign(display.style, {
            'width': '50px',
            'height': '20px',
            'border-radius': '10px',
            'outline': '0px',
            'margin': '8px 0px'
        });
        display.addEventListener('change', () => {
            get(`#delay_${arr[(i + 1) % 2]}`).value = get(`#delay_${display_type}`).value;
            localStorage.image_downloader_delay = get(`#delay_${display_type}`).value;
        });

        if (display_type == 'bar') {
            display.style.width = '120px';
            Object.assign(display, {
                'type': 'range',
                'max': '10000',
                'value': default_val
            });
        }
        else if (display_type == 'val') {
            display.addEventListener('input', () => {
                let val = parseFloat(display.value);
                let err_msg = val > 10000 || val < 0 || !display.value.match(/^[0-9]+[0-9]*$/);;

                display.style.border = `2px solid ${err_msg ? "red" : "black"}`;
                get('#download_image').disabled = err_msg ? true : false;
            });
        }

        init_array.push(display);
    });


    ['頁數：', '～', '載圖間隔(ms)：'].forEach((type, i) => {
        let symbol = new_node("a", { innerText: `${type}` });
        Object.assign(symbol.style, {
            cursor: 'default',
            'min-width': '0px'
        });
        init_array.splice(i * 2 + 1, 0, symbol);
    });

    init_array.forEach(node => {
        get(".BH-menuE").appendChild(li_wrapper(node));
    });


}

async function download_image(url, close = false) {

    fetch(url)
        .then(e => e.blob())
        .then(blob => {
            let file_name = url.split("/").pop();

            let link = document.createElement("a");
            url = window.URL.createObjectURL(blob);

            Object.assign(link, {
                download: file_name,
                href: url
            });
            link.click();

            link = null;
            window.URL.revokeObjectURL(url);
        })
        .then(() => close ? window.close() : 0);

}

function get(selector, ref = document) {
    let node_list = ref.querySelectorAll(selector);
    if (node_list.length != 1) return node_list;
    else return node_list[0];
}

function new_node(tagname, properties) {
    let node = document.createElement(tagname);
    if (properties) {
        Object.keys(properties).forEach(property => {
            node[property] = properties[property];
        });
    }
    return node;
}

function li_wrapper(node) {
    let li = new_node('li');
    li.appendChild(node);
    return li;
}
