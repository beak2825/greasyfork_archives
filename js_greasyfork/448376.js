// ==UserScript==
// @name         NGA论坛AC娘表情包(明日方舟ver)
// @namespace    http://kayanoruiko.cc
// @version      1.3.0
// @author       kayanouriko
// @description  为 NGA 论坛添加额外的表情包发送功能
// @homepage     https://bbs.nga.cn/read.php?tid=32772711
// @icon         https://ak.hypergryph.com/favicon.ico
// @license      MIT
// @match        *://bbs.nga.cn/thread.php?*
// @match        *://bbs.nga.cn/read.php?*
// @match        *://bbs.nga.cn/post.php?*
// @match        *://ngabbs.com/thread.php?*
// @match        *://ngabbs.com/read.php?*
// @match        *://ngabbs.com/post.php?*
// @match        *://nga.178.com/thread.php?*
// @match        *://nga.178.com/read.php?*
// @match        *://nga.178.com/post.php?*
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/448376/NGA%E8%AE%BA%E5%9D%9BAC%E5%A8%98%E8%A1%A8%E6%83%85%E5%8C%85%28%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9Fver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448376/NGA%E8%AE%BA%E5%9D%9BAC%E5%A8%98%E8%A1%A8%E6%83%85%E5%8C%85%28%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9Fver%29.meta.js
// ==/UserScript==

"use strict";
const main = {
    stickers: [
        {
            class: 'smile_a2',
            src: './mon_202207/22/-klbw3Q2q-jij8K5T8S2s-2s.gif',
            alt: '有何贵干',
            name: '灵知'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/22/-klbw3Q2q-5mbmK5T8S2s-2s.gif',
            alt: '呆',
            name: '闪灵'
        },
        {
            class: 'smile_a2',
            src: './mon_202207/22/-klbw3Q2q-9iy2K5T8S2s-2s.gif',
            alt: '壁咚',
            name: '傀影'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/22/-klbw3Q2q-g6sjK6T8S2s-2s.gif',
            alt: '哼',
            name: '黑键'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/22/-klbw3Q2q-cbsqK7T8S2s-2s.gif',
            alt: 'goodjob',
            name: '莫斯提马'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/22/-klbw3Q2q-1odzK7T8S2s-2s.gif',
            alt: '黑枪',
            name: '安比尔'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/22/-klbw3Q2q-fl71K6T8S2s-2s.gif',
            alt: '哭笑',
            name: '老鲤'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/22/-klbw3Q2q-90w2K6T8S2s-2s.gif',
            alt: '嘲笑',
            name: '年'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/23/-klbw3Q2q-6vorK7T8S2s-2s.gif',
            alt: '咦',
            name: '非亚梅塔'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/23/-klbw3Q2q-178sK6T8S28-2f.gif',
            alt: '闪光',
            name: '银灰'
        },
        {
            class: 'smile_a2',
            src: './mon_202207/25/-klbw3Q2q-krugK6T8S2n-2n.gif',
            alt: '威吓',
            name: '史尔特尔'
        },
        {
            class: 'smile_a2',
            src: './mon_202207/25/-klbw3Q2q-9abvK5T8S2s-2s.gif',
            alt: '抢镜头',
            name: '阿米娅'
        },
        {
            class: 'smile_a2',
            src: './mon_202207/26/-klbw3Q2q-db9rK6T8S2s-2s.gif',
            alt: '恨',
            name: '刻俄柏'
        },
        {
            class: '',
            src: './mon_202207/26/-klbw3Q2q-6mvpK6T8S2s-2s.gif',
            alt: '恨[饼]',
            name: '刻俄柏[饼]'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/26/-klbw3Q2q-ik14K5T8S2d-1y.gif',
            alt: '羡慕',
            name: '雪雉'
        },
        {
            class: 'smile_a2',
            src: './mon_202207/31/-klbw3Q0-3piyK4T8S2i-2i.gif',
            alt: '怒',
            name: '送葬人'
        },
        {
            class: 'smile_a2',
            src: './mon_202207/31/-klbw3Q0-l8qzK7T8S2s-2s.gif',
            alt: 'lucky',
            name: '梅'
        },
        {
            class: 'smile_ac',
            src: './mon_202207/31/-klbw3Q0-e1z6K7T8S2s-2s.gif',
            alt: '怒',
            name: '伊芙利特'
        }
    ],
    init() {
        this.addObserver();
        this.onload();
    },
    addObserver() {
        const callback = async (mutationList) => {
            const isReplace = await GM.getValue('acchan-stickers-replace', false);
            if (isReplace) {
                this.replaceAllMatchStickers();
            }
            const mutation = mutationList.find(mutation => {
                return mutation.type === 'childList' && mutation.addedNodes.length < 2;
            });
            mutation?.addedNodes.forEach(node => {
                const element = node;
                if (/^commonwindow\d+$/.test(element.id) &&
                    element.querySelector('.tip_title .title').innerText === '插入表情') {
                    this.addButton(element.id);
                }
            });
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },
    addButton(boxId) {
        if (document.getElementById('acchan-arknights'))
            return;
        const lastButtonElement = document.querySelector(`#${boxId} .div3 .block_txt_big:last-child`);
        lastButtonElement?.insertAdjacentHTML('afterend', `<button id="acchan-arknights" class="block_txt_big">AC娘(明日方舟ver)</button>`);
        document.getElementById('acchan-arknights')?.addEventListener('click', () => {
            this.buttonOnClickAction();
        });
        const lastDivElement = document.querySelector(`#${boxId} .div3 > span > div:last-child`);
        lastDivElement?.insertAdjacentHTML('afterend', `<div id="acchan-arknights-stickers" style="display: none;">${this.addStickers()}</div>`);
    },
    addStickers() {
        let html = '';
        for (const sticker of this.stickers) {
            html += `<img height="60px" style="margin: 0px 2px;" onclick="postfunc.addText('[img]${sticker.src}[/img]');postfunc.selectSmilesw._.hide();" src="https://img.nga.178.com/attachments/${sticker.src.slice(2)}" alt="${sticker.name} ${sticker.alt}" title="${sticker.name} ${sticker.alt}">`;
        }
        return html;
    },
    async buttonOnClickAction() {
        const boxElement = document.getElementById('acchan-arknights-stickers');
        if (boxElement) {
            if (boxElement.style.display === 'none') {
                boxElement.style.display = '';
                const divs = boxElement.parentElement?.parentElement?.querySelectorAll('span > div:not(#acchan-arknights-stickers)');
                divs?.forEach(node => {
                    const element = node;
                    element.style.display = 'none';
                });
            }
            const spanElement = boxElement.parentElement?.parentElement?.querySelector('div > span');
            if (spanElement) {
                const isReplace = await GM.getValue('acchan-stickers-replace', false);
                const element = spanElement;
                element.innerHTML = `
                <p>
                    <input type="checkbox" id="acchan-arknights-stickers-checkbox" ${isReplace ? 'checked="checked"' : ''}>
                    <label for="acchan-arknights-stickers-checkbox">替换帖子内原版AC娘表情</label>
                </p>
                <a href="/read.php?tid=32772711" target="_blank" style="text-decoration: underline !important;color: rgb(189, 126, 109) !important;float:right !important;">降夜飞霜@NGA制作</a>
                `;
                const checkboxElement = document.getElementById('acchan-arknights-stickers-checkbox');
                checkboxElement?.addEventListener('change', event => {
                    const isChecked = event.target.checked;
                    GM.setValue('acchan-stickers-replace', isChecked);
                });
            }
        }
    },
    async onload() {
        const isReplace = await GM.getValue('acchan-stickers-replace', false);
        if (!isReplace)
            return '';
        window.onload = this.replaceAllMatchStickers();
    },
    replaceAllMatchStickers() {
        const images = document.querySelectorAll('img.smile_ac,img.smile_a2');
        images.forEach(image => {
            const element = image;
            const alt = element.getAttribute('alt') ?? '';
            const className = element.getAttribute('class') ?? '';
            const sticker = this.stickers.find(e => {
                return e.class === className && e.alt === alt;
            });
            if (sticker) {
                element.setAttribute('src', `https://img.nga.178.com/attachments/${sticker.src.slice(2)}`);
            }
        });
    }
};
main.init();

