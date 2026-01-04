// ==UserScript==
// @name         pawoo.net 顯示轉嘟與最愛
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  把隱藏的轉嘟與最愛顯示出來
// @author       BeenYan
// @match        https://pawoo.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pawoo.net
// @license      GPL
// @run-at       document-start
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/472165/pawoonet%20%E9%A1%AF%E7%A4%BA%E8%BD%89%E5%98%9F%E8%88%87%E6%9C%80%E6%84%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/472165/pawoonet%20%E9%A1%AF%E7%A4%BA%E8%BD%89%E5%98%9F%E8%88%87%E6%9C%80%E6%84%9B.meta.js
// ==/UserScript==

/**
 *  DATA struct {
 *      id: string, // 搜索文章識別符號
 *      favourites_count: number, // 最愛人數
 *      reblogs_count: number, // 轉嘟人數
 *  }
 */

const delay = ms => new Promise(res => setTimeout(res, ms));
const DATA = new Map();

class DataInfo {
    constructor(reblogs, favourites) {
      this.reblogs_count = reblogs;
      this.favourites_count = favourites;
    }
}

function number_dom(parent, num) {
    parent.classList.add('icon-button--with-counter');
    GM_addElement(parent, 'span', {
        class: 'icon-button__counter',
        textContent: num
    });
}

async function get_action_bar(id) {
    const ACTION_BAR = document.querySelectorAll(`div[data-id="${id}"] .status__action-bar__button`);
    if (ACTION_BAR.length === 0) {
        await delay(1000);
        return get_action_bar(id);
    }

    return ACTION_BAR;
}

async function save(dataList) {
    /**
     * 0 => 回覆
     * 1 => 轉嘟
     * 2 => 最愛
     */
    for (const data of dataList) {
        const target = data.reblog?? data;
        DATA.set(target.id, new DataInfo(target.reblogs_count, target.favourites_count))
    }

    console.log(DATA);
}

(function(open) {
    unsafeWindow.XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            if (this.responseURL.startsWith('https://pawoo.net/api/v1/timelines/') !== true) {
                return;
            }

            const DATA_LIST = JSON.parse(this.response);
            save(DATA_LIST);
        }, false);
        open.apply(this, arguments);
    };

    window.onload = () => {
        console.log('loading');

        const ItemList = document.querySelector('.item-list');
        const observer = new MutationObserver((mutations) => {
            const TargetList = mutations
                .filter(m => m.attributeName === 'class' && m.target.classList.length === 3 && [...m.target.classList]
                .some(c => c === 'focusable'))
                .map(m => m.target);
            if (!TargetList.length) return;
            for (const Target of TargetList) {
                const ID = Target.querySelector('[data-id].status').getAttribute('data-id');
                const ButtonList = Target.querySelectorAll('.status__action-bar__button');
                const Info = DATA.get(ID);
                if (Info === undefined) {
                    console.info('Info not found');
                    return;
                }

                number_dom(ButtonList[1], Info.reblogs_count);
                number_dom(ButtonList[2], Info.favourites_count);
            }
        });

        observer.observe(ItemList, {
            attributes: true,
            subtree: true,
        });
    }
})(unsafeWindow.XMLHttpRequest.prototype.open);

window.addEventListener('keydown', (event) => {
    const KEY = event.key;
    if (KEY !== "F5") {
        return;
    }

    location.reload(true);
    event.preventDefault();
})
