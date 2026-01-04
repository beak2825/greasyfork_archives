// ==UserScript==
// @name         VK change accounts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       KoctrX
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40828/VK%20change%20accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/40828/VK%20change%20accounts.meta.js
// ==/UserScript==

(function () {
    document.body.onkeydown = function(e) {
        if (!e.altKey || !e.ctrlKey) return;
        CVK.showHidePanel();
    };

    CVK = {
        accounts: [],
        remixsid: 'remixsid',
        id: 'fix21323',
        co: 'cookie_accounts',
        showHidePanel: () => {
            let block = document.getElementById(CVK.id);
            block.style.display = block.style.display === 'none' ? 'block': 'none';
        },
        addAccount: () => {
            let sid = CVK.getCookie(CVK.remixsid);
            if (!CVK.remixsid) return;
            if (CVK.findSid(sid)) return;

            let name = window.prompt('Введите название аккаунта:', `Аккаунт ${CVK.accounts.length}`);
            if (!name) return;

            if (!window.confirm(`Вы хотите сохранить данный аккаунт для быстрого входа, под именем: ${name}?`)) return;

            CVK.accounts.push({name, sid});
            CVK.updateAccouts();
            CVK.render();
        },
        updateAccouts: () => {
            let data = JSON.stringify(CVK.accounts);
            document.cookie = `${CVK.co}=${data};path=/;`;
        },
        delAccount: (id) => {
            if (!CVK.accounts.length) return;

            CVK.accounts.splice(id, 1);
            CVK.updateAccouts();
            CVK.render();
        },
        render: () => {
            CVK.blockId();
            CVK.renderAccounts();
        },
        out: () => {
            document.cookie = `${CVK.remixsid}=null;path=/`;
            document.location.reload();
        },
        renderAccounts: () => {
            let block = document.getElementById(CVK.id);
            block.innerHTML = '';

            let bl = CVK.crObj({
                n: 'div',
                i: '<hr>Список аккаунтов<hr>',
                a: [['style', 'text-align: center;']]
            });
            if (!CVK.accounts.length) {
                bl.appendChild(CVK.crObj({
                    n: 'div',
                    i: 'Доступных аккаунтов нет!'
                }));
            } else {
                let div = CVK.crObj({
                    n: 'div'
                });

                for (let q = 0; q < CVK.accounts.length; q++) {
                    div.appendChild(CVK.crObj({
                        n: 'button',
                        i: CVK.accounts[q].name,
                        a: [['class', 'flat_button button_wide secondary'], ['onclick', 'CVK.change(' + q + ')'],
                            ['style', 'color: #00a06d;background: rgb(0,0,0,0.1);']]
                    }));
                    div.appendChild(CVK.crObj({
                        n: 'button',
                        i: 'Удалить',
                        a: [['class', 'flat_button button_wide secondary'], ['onclick', 'CVK.delAccount(' + q + ')'],
                            ['style', 'color: #f00;']]
                    }));
                }
                bl.appendChild(div);
            }

            if (!CVK.findSid(CVK.getCookie(CVK.remixsid))) {
                bl.appendChild(CVK.crObj({
                    n: 'hr'
                }));
                bl.appendChild(CVK.crObj({
                    n: 'a',
                    i: 'Добавить',
                    a: [['onclick', 'CVK.addAccount()'],
                        ['class', 'ui_actions_menu_item _im_action im-action im-action_invite'],
                        ['href', 'javascript://']]
                }));
            }
            bl.appendChild(CVK.crObj({
                n: 'button',
                i: 'Выйти',
                a: [['class', 'flat_button button_wide secondary'], ['onclick', 'CVK.out();'],
                    ['style', 'background: #4a76a8;color: #ffffff;border: 1px solid #ffffff;']]
            }));

            block.appendChild(bl);
        },
        crObj: (e) => {
            if (e.n) {
                let element = document.createElement(e.n);
                if (e.i) element.innerHTML = e.i;

                if (e.a) {
                    for (let q = 0; q < e.a.length; q++) {
                        element.setAttribute(e.a[q][0], `${e.a[q][1]}`);
                    }
                }

                return element;
            } else {
                return CVK.throwError('Ошибка при рендере!');
            }
        },
        throwError: (err) => {
            console.error(err);
        },
        blockId: () => {
            if (!document.getElementById(CVK.id)) {
                let block = document.getElementById('side_bar_inner');
                block.appendChild(CVK.crObj({
                    n: 'div',
                    a: [['id', CVK.id]]
                }));
            }
        },
        findSid: (sid) => {
            if (!CVK.accounts.length) return false;
            for (let q = 0; q < CVK.accounts.length; q++) {
                if (CVK.accounts[q].sid == sid) return true;
            }
            return false;
        },
        change: (q) => {
            document.cookie = `${CVK.remixsid}=${CVK.accounts[q].sid};path=/`;
            document.location.reload();
        },
        getAccountsCoookie: () => {
            let data = CVK.getCookie(CVK.co);
            if (!data) return;
            try {
                data = JSON.parse(data);
            } catch (err) {
                CVK.throwError(err);
                return;
            }
            if (!data.length) return;
            CVK.accounts = data;
        },
        getCookie: (name) => {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
    };

    CVK.getAccountsCoookie();
    CVK.render();
})();