// ==UserScript==
// @name         DailyIndieGame Tool
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Add handy features to DailyIndieGame
// @icon         http://www.dailyindiegame.com/dailyindiegame.png
// @author       Bisumaruko
// @include      http*://*dailyindiegame.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/29121/DailyIndieGame%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/29121/DailyIndieGame%20Tool.meta.js
// ==/UserScript==

// notify users newer version script available
if (confirm("[DailyIndieGame Tool] This script is no longer maintained, please click yes to install the upgraded version of this script\n[DailyIndieGame Tool] 此腳本已不再維護，請點擊確認安裝此腳本的升級版本")) {
    GM_openInTab('https://greasyfork.org/scripts/32865-steam-bundle-sites-extension/code/Steam%20Bundle%20Sites%20Extension.user.js');
}

(function() {
    'use strict';

    const pathname = location.pathname;

    var $ = selector => document.querySelector(selector),
        $$ = selector => Array.from(document.querySelectorAll(selector));

    if (pathname.includes('/account_page')) {
        let style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = `
            .DIGRetrive {
                padding: 5px;
                box-sizing: border-box;
                border: 1px solid #424242;
            }
            .DIGRetrive > textarea {
                width: 100%;
                height: 150px;
                box-sizing: border-box;
                resize: none;
            }
            .DIGRetrive > div {
                padding-top: 5px;
            }
            .DIGRetrive button {
                width: 130px;
                height: 25px;
                margin-right: 10px;
                border: none;
                background-color: #FD5E0F;
                color: rgb(49, 49, 49);
                font-family: Ropa Sans;
                font-size: 15px;
                font-weight: 600;
                outline: none;
                cursor: pointer;
            }
            .DIGRetrive label {
                margin-right: 10px;
            }
        `;

        document.head.appendChild(style);

        let DIGRetrive = document.createElement('div');

        DIGRetrive.className = 'DIGRetrive';
        DIGRetrive.innerHTML = `
            <textarea></textarea>
            <div>
                <button class="DIGButtonRetrieve">Retrieve</button>
                <button class="DIGButtonCopy">Copy</button>
                <button class="DIGButtonReset">Reset</button>
                <label><input type="checkbox" class="DIGCheckboxTitle">Include Game Title</label>
                <label><input type="checkbox" class="DIGCheckboxJoin">Join Keys</label>
            </div>
        `;

        $('#TableKeys').parentNode.insertBefore(DIGRetrive, $('#TableKeys'));

        $('.DIGButtonRetrieve').addEventListener('click', () => {
            let keys = [],
                trs = $$('#TableKeys tr'),
                separator = $('.DIGCheckboxJoin').checked ? ',' : "\n";

            for (let tr of trs) {
                let tds = tr.querySelectorAll('td'),
                    title = tds[2].textContent.trim(),
                    key = tds[4].textContent.trim();

                if (!key.includes('-')) continue;
                if ($('.DIGCheckboxTitle').checked) key = title + ', ' + key;
                keys.push(key);
            }

            $('.DIGRetrive > textarea').textContent = keys.join(separator);
        });

        $('.DIGButtonCopy').addEventListener('click', () => {
            $('.DIGRetrive > textarea').select();
    		document.execCommand('copy');
        });

        $('.DIGButtonReset').addEventListener('click', () => {
            $('.DIGRetrive > textarea').textContent = '';
        });
    }

    if (pathname === '/account_digstore.html' || pathname === '/account_trades.html') {
        let style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = `
            .DIGEasyBuy button {
                padding: 4px 8px;
                outline: none;
            }
            .DIGEasyBuy_checkbox {
                display: none;
            }
            .DIGEasyBuy_checked {
                background-color: #222; !important
            }
        `;

        document.head.appendChild(style);

        let target = $('#form3').closest('tr').firstElementChild,
            DIGEasyBuy = document.createElement('div');

        DIGEasyBuy.className = 'DIGEasyBuy';
        DIGEasyBuy.innerHTML = `
            <button class="DIGButtonPurchase DIG3_Orange_15_Form">Purchase</button>
            <button class="DIGButtonSelectAll DIG3_Orange_15_Form">Select All</button>
        `;

        while (target.lastChild) {
            target.removeChild(target.lastChild);
        }

        target.appendChild(DIGEasyBuy);

        $('.DIGButtonPurchase').addEventListener('click', function () {
            let purchase = async function () {
                let button = $('.DIGButtonPurchase'),
                    list = $$('.DIGEasyBuy_checkbox:checked'),
                    headers = new Headers(),
                    bought = 0,
                    balance = parseFloat($('a[href^="account_transac"]').parent('div').text().slice(19)) || 0;

                button.disabled = true;
                button.textContent = 'Purchasing...';

                headers.append('Content-Type', 'application/x-www-form-urlencoded');

                console.log('Start purchasing, initial balance: ' + balance + ' DIG points');

                for (let item of list) {
                    let id = parseInt(item.dataset.id),
                        price = parseInt(item.dataset.price),
                        res;

                    if (!id || isNaN(price)) continue;
                    if (balance - price < 0) {
                        console.log('Current balance: ' + balance + ', game price: ' + price);
                        msg.alert('Not enough DIG points');
                        break;
                    }

                    let url = location.origin + '/account_buy.html',
                        init = {
                            method: 'POST',
                            headers: headers,
                            body: 'quantity=1&xgameid=' + id + '&xgameprice1=' + price + '&send=Purchase',
                            mode: 'same-origin',
                            credentials: 'same-origin',
                            cache: 'no-store',
                            referrer: location.origin + '/account_buy_' + id + '.html'
                        };

                    if (pathname === '/account_trades.html') {
                        url = location.origin + '/account_buytrade_' + id + '.html';
                        init.body = 'gameid=' + id + '&send=Purchase';
                        init.referrer = url;
                    }

                    try {
                        res = await fetch(url, init);

                        if (res.ok) {
                            item.click();
                            bought++;
                            balance -= price;
                        } else msg.alert('Purchase failed, server responded an error');
                    } catch (e) {
                        console.log(e);
                        msg.alert('An error occured while making purchase request');
                    }
                }

                if (bought) window.location = location.origin + '/account_page.html';
                else {
                    button.disabled = false;
                    button.textContent = 'Purchase';
                }
            };

            try {
                purchase();
            } catch (e) {
                console.log(e);
                msg.alert('An error occured while preparing pruchase');
            }
        });

        $('.DIGButtonSelectAll').addEventListener('click', function () {
            let checkboxes = $$('.DIGEasyBuy_checkbox');

            for (let checkbox of checkboxes) {
                if (this.textContent === 'Select All' && !checkbox.checked) checkbox.click();
                if (this.textContent === 'Cancel' && checkbox.checked) checkbox.click();
            }
            this.textContent = this.textContent === 'Select All' ? 'Cancel' : 'Select All';
        });

        let games = $$('a[href^="account_buy"]');

        for (let game of games) {
            let row = game.closest('tr'),
                checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.className = 'DIGEasyBuy_checkbox';
            checkbox.dataset.id = game.href.replace(/\D/g,'');
            checkbox.dataset.price = parseInt(game.closest('td').previousElementSibling.textContent) || 0;
            checkbox.addEventListener('change', function () {
                let row = this.closest('tr');

                if (this.checked) row.classList.add('DIGEasyBuy_checked');
                else row.classList.remove('DIGEasyBuy_checked');
            });

            row.firstElementChild.appendChild(checkbox);
            row.addEventListener('click', function () {
                this.querySelector('input[type="checkbox"]').click();
            });
        }
    }

    var msg = {
        box: null,
        init() {
            let style = document.createElement('style');

            style.type = 'text/css';
            style.innerHTML = `
                .DIGTool_msg {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 10px 20px;
                    border: 1px solid #424242;
                    background-color: rgb(32, 32, 32);
                    color: #FFF;
                    font-size: larger;
                }
                .DIGTool_msg-show {
                    display: block;
                }
            `;
            document.head.appendChild(style);

            let DIGTool_msg = document.createElement('div');

            DIGTool_msg.classList.add('DIGTool_msg');
            document.body.appendChild(DIGTool_msg);
            this.box = DIGTool_msg;
        },
        alert(text) {
            this.box.textContent = text;
            this.box.classList.add('DIGTool_msg-show');
            setTimeout(this.hide.bind(this), 3000);
        },
        hide() {
            this.box.classList.remove('DIGTool_msg-show');
        }
    };

    msg.init();

})();
