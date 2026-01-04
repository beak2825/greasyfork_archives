// ==UserScript==
// @name         Better NGB
// @namespace    Violentmonkey Scripts
// @version      0.05
// @description  To make NGB webpage better 
// @author       Eric
// @match        http://192.168.1.10:8080/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539501/Better%20NGB.user.js
// @updateURL https://update.greasyfork.org/scripts/539501/Better%20NGB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('keyup', function (e) {
        if (e.altKey && e.key.toLowerCase() == 'x') {
            if (!document.querySelector("[id$='roomNo']")) {
                document.querySelector("[id$='room-status-log']").click();
            }
            const box = setInterval(function () {
                const room = document.querySelector("[id$='roomNo']");
                if (room) {
                    room.value = prompt("room");
                    loadData();
                    clearInterval(box);
                }
            }, 500); // check every 500ms
        } else if (e.key == "Enter") {
            loadData();
        }
    });

    const lookup = {
        '02198': 'Liu Fei',
        '03111': 'Waraporn',
        '04449': 'Sui Feng Hai',
        '04631': 'Chen Dan',
        '04636': 'Li Na',
        '04638': 'Cao Feng',
        '04643': 'Wang Miao',
        '04653': 'Liu Shu Ting shuting',
        '04728': 'Max Tien',
        '04796': 'Ding Na',
        '04828': 'Sarifah Bte Mohamad Ali',
        '04911': 'Deng Yan',
        '04921': 'Cai Ming',
        '05864': 'Alif Khairi',
        '06225': 'Adli',
        '06337': 'Hafis',
        '06456': 'Kenny Ng',
        '07064': 'Tao Qun',
        '07067': 'zhao yu xin',
        '07173': 'Shao Shuang',
        '07508': 'Ang Bu Chuan',
        '07558': 'Arqam',
        '07583': 'Quoc Hung (Tony)',
        '07584': 'Dinh Hop (Ah He)',
        '07585': 'Van Canh (Ah Jing)',
        '07586': 'Hoang Le (Ah Lee)',
        '07587': 'Van Phuong (Ah Fang)',
        '07589': 'Van Quyet (Ah Trae)',
        '07625': 'Vo Van Nong (Wen Nong)',
        '07626': 'Van Sang (Wen Liang)',
        '07727': 'Md Alif',
        '07734': 'Manivannan',
        '07848': 'Gui Chang Yew Jerro (Ah Di)',
        '09322': 'Tin Aung Tun',
        '09329': 'Hein zin hlaing',
        '09330': 'Khun ye tun naing',
        '09973': 'Siti Nur Izatul',
        '10120': 'Pham Thi Ngoc Thuy',
        '10144': 'Khazila Binti Mohamad',
        '10217': 'QU CHANGLIN chang lin',
        '10443': 'Nguyen Khac Cuong',
        '10455': 'Umar Syafiq',
        '10463': 'Erika Kamali',
        '10467': 'hani'
    };

    function updateTable() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                const lastCell = cells[5];
                const id = lastCell.textContent.trim().padStart(5, '0');

                if (lookup.hasOwnProperty(id)) {
                    lastCell.textContent = `${lookup[id]} ${id}`;
                }
            }
        });
    }

    const timer = setInterval(function () {
        const table = document.querySelector('table')?.parentElement;
        if (table) {
            clearInterval(timer);
            const observer = new MutationObserver(() => {
                updateTable();
            });

            observer.observe(table, { childList: true, subtree: true });
        }
    }, 500); // check every 500ms
})();