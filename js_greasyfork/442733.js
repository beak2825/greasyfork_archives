// ==UserScript==
// @name         Sla SpecialForce
// @version      0.2
// @description  ...
// @author       L
// @match        https://yang.yandex-team.ru/requester/project/11861*
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/442733/Sla%20SpecialForce.user.js
// @updateURL https://update.greasyfork.org/scripts/442733/Sla%20SpecialForce.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/SpecialForce/SlaYang/SlaYang.service.ts
class SlaYangService {
    constructor(token, chat) {
        this.token = token;
        this.chat = chat;
    }
    sendMessageTelegram(message) {
        window.open(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${this.chat}&text=${message}&parse_mode=Markdown`, '_blank', 'resizable=no,top=10,left=300,width=100,height=100');
    }
}

;// CONCATENATED MODULE: ./src/SpecialForce/SlaYang/SlaYang.controller.ts

const API_KEY = '';
const chat = '';
class SlaYangController {
    constructor(_telegram) {
        this._telegram = _telegram;
    }
    createMessage(table) {
        const pools = [...table.children];
        return pools
            .map((el) => {
            const poolName = el.querySelector('.td-pool-name').innerText.match(/^(.+ - .+) \//);
            const stats = el.querySelector('.async-td_cell_progress').innerText;
            const status = el.querySelector('.async-td_cell_display-status').innerText;
            return {
                name: poolName !== null ? poolName[1].replace(/_/g, '-') : 'error name pool',
                stats,
                status
            };
        })
            .map((el) => {
            return `${el.name}: ${el.stats} - ${el.status}`;
        });
    }
    createMessageInAlert(messages) {
        return messages.join('\n');
    }
    createMessageInTelegram(messages) {
        return messages.join(`${'%0A'}`);
    }
    postMessageTelegram(table) {
        const message = this.createMessage(table);
        if (window.confirm(this.createMessageInAlert(message))) {
            this._telegram.sendMessageTelegram(`*${new Date().toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow'
            })}*${'%0A'}${this.createMessageInTelegram(message)}`);
        }
    }
}
const slaYang = new SlaYangController(new SlaYangService(API_KEY, chat));

;// CONCATENATED MODULE: ./src/SpecialForce/SlaYang/SlaYang.ts

const DELAY = 10;
const createBtnSla = () => {
    const warn = document.querySelector('.project-overview-table__warn');
    const btn = document.createElement('button');
    btn.textContent = 'Отправить Sla';
    btn.className = 'Button2 Button2_view_action Button2_size_m';
    btn.style.padding = '0 5px';
    btn.addEventListener('click', () => {
        const table = document.querySelector('t-table>t-tbody');
        slaYang.postMessageTelegram(table);
    });
    warn.append(btn);
};
setTimeout(createBtnSla, DELAY * 1000);

;// CONCATENATED MODULE: ./src/Directions/specialForce/index.ts


/******/ })()
;