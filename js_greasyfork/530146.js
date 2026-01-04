// ==UserScript==
// @name         FarmRPG - Quick Tasks
// @namespace    duck.wowow
// @version      0.1.6
// @description  Adds buttons to easily complete farm tasks, PHRs and exchange center trades with a single click. Also adds a trade filter to the EC to hide unwanted trades in the future. EC trade filter is used by clicking 'Disable Trades' at the top of the EC page. Bottle Rocket Brawl included.
// @author       Odung
// @match        https://*.farmrpg.com/index.php
// @match        https://*.farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://cdn.jsdelivr.net/npm/luxon@3.3.0/build/global/luxon.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533208/FarmRPG%20-%20Quick%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/533208/FarmRPG%20-%20Quick%20Tasks.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const baseUrl = window.location.origin;
    const listeners = [];

    function observePage(element) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-page') {
                    removeListeners();
                    const page = mutation.target.getAttribute('data-page');
                    if (page === 'xfarm') farm();
                    else if (page === 'quests') quests();
                    else if (page === 'quest') quest();
                    else if (page === 'exchange') exchange();
                    else if (page === 'Bottle-Rocket-Brawl') rocketBrawl();
                }
            }
        });

        observer.observe(element, { attributes: true });
    }

    function removeListeners() {
        for (const { element, type, handler } of listeners) {
            element.removeEventListener(type, handler);
        }
        listeners.length = 0;
    }

    async function farm() {
        const id = getFarmId();
        if (!id) return;

        const now = luxon.DateTime.now().setZone("America/Chicago").startOf("day");
        const current = now.day;
        const farmData = await GM.getValue('farm', {chicken: 0, cow: 0, pig: 0, storehouse: 0, farmhouse: 0, raptor: 0});

        function createButton(title, url, id, selector) {
            const button = document.createElement('button');
            button.textContent = title;
            button.id = id;
            button.style.cssText = 'margin-left: 10px; display: flex; width: 50px; align-items: center; justify-content: center; padding:4px 8px;background:#003300;color:#fff;border:1px solid #006600;cursor:pointer;';

            const clickHandler = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    const response = await fetch(url, { method: 'POST' });
                    const body = await response.text();

                    if (body === 'success') {
                        farmData[id] = current;
                        await GM.setValue('farm', farmData);
                        button.remove();
                        const calendar = document.querySelector(selector)?.parentElement.querySelector('.f7-icons')?.parentElement;
                        if (calendar) calendar.remove();
                    } else {
                        button.textContent = 'Error';
                        setTimeout(() => {
                            button.textContent = title;
                        }, 1000);
                    }
                } catch (error) {
                    console.error(error);
                    button.textContent = 'Error';
                    setTimeout(() => {
                        button.textContent = title;
                    }, 1000);
                }
            };

            button.addEventListener('click', clickHandler);

            listeners.push({ element: button, type: 'click', handler: clickHandler });

            return button;
        }


        const observer = new MutationObserver(() => {
            const elements = [
                { selector: 'div.page:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1) > a:nth-child(1) > div:nth-child(1) > div:nth-child(1)', title: "Pet", url: `${baseUrl}/worker.php?go=petallchickens`, id: 'chicken' },
                { selector: 'div.page:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(2) > a:nth-child(1) > div:nth-child(1) > div:nth-child(1)', title: "Pet", url: `${baseUrl}/worker.php?go=petallcows`, id: 'cow' },
                { selector: 'div.page:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(3) > a:nth-child(1) > div:nth-child(1) > div:nth-child(1)', title: "Feed", url: `${baseUrl}/worker.php?go=feedallpigs`, id: 'pig' },
                { selector: 'div.page:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(4) > a:nth-child(1) > div:nth-child(1) > div:nth-child(1)', title: "Work", url: `${baseUrl}/worker.php?go=work&id=${id}`, id: 'storehouse' },
                { selector: 'div.page:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(5) > a:nth-child(1) > div:nth-child(1) > div:nth-child(1)', title: "Rest", url: `${baseUrl}/worker.php?go=rest&id=${id}`, id: 'farmhouse' },
                { selector: 'div.page:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(6) > a:nth-child(1) > div:nth-child(1) > div:nth-child(1)', title: "Pet", url: `${baseUrl}/worker.php?go=incuallraptors`, id: 'raptor' }
            ];

            let found = false;

            elements.forEach(({ selector, title, url, id }) => {
                const element = document.querySelector(selector);
                if (element) {
                    found = true;
                    if (farmData[id] !== current) {
                        const existingButton = element.querySelector('button');
                        if (existingButton) existingButton.remove();
                        element.appendChild(createButton(title, url, id, selector));
                    }
                }
            });

            if (found) observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function getFarmId() {
        const match = window.location.href.match(/id=(\d+)/);
        return match ? match[1] : null;
    }

    function quests() {
        const phrTitle = Array.from(document.querySelectorAll('.content-block-title')).find(e => e.textContent.trim().startsWith('Personal Requests'));
        if (!phrTitle) return;

        const phrs = phrTitle.nextElementSibling?.querySelectorAll('a.item-link.close-panel') || [];

        phrs.forEach(phr => {
            const text = phr.querySelector('.item-after')?.textContent.trim();
            if (text === 'READY!') {
                const href = phr.getAttribute('href');
                const idMatch = href.match(/id=(\d+)/);
                if (!idMatch) return;
                const id = idMatch[1];

                const placement = phr.parentElement;

                const button = document.createElement('button');
                button.textContent = 'Complete';
                button.id = `odung-phrs-${id}`;
                button.style.cssText = 'margin-left: auto; height:65px; background:#003300; color:#fff; border:1px solid #006600; cursor:pointer;';
                const clickHandler = async e => {
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                        const response = await fetch(`${baseUrl}/worker.php?go=collectquest&id=${id}`, { method: 'POST' });
                        const body = await response.text();

                        if (body === 'success') {
                            button.remove();
                            placement.closest('li')?.remove();
                            phrTitle.textContent = phrTitle.textContent.replace(/\((\d+)\)/, (_, n) => `(${n - 1})`);
                        } else {
                            button.textContent = 'Error';
                            setTimeout(() => {
                                button.textContent = 'Complete';
                            }, 1000);
                        }
                    } catch (error) {
                        console.error(error);
                        button.textContent = 'Error';
                        setTimeout(() => {
                            button.textContent = 'Complete';
                        }, 1000);
                    }
                };

                button.addEventListener('click', clickHandler);
                listeners.push({ element: button, type: 'click', handler: clickHandler });

                if (placement) {
                    const existingButton = placement.querySelector(`#odung-phrs-${id}`);
                    if (existingButton) existingButton.remove();
                    placement.style.cssText = 'display: flex; align-items: center; padding: 8px;';
                    placement.appendChild(button);
                }
            }
        });
    }

    function rocketBrawl() {
        function createButton(type, elementId) {
            const button = document.createElement('button');
            button.textContent = 'Quick Attack';
            button.id = `odung-brawl${elementId}`;
            button.style.cssText = 'width:100%;height:40px;padding:4px 8px;background:#003300;color:#fff;border:1px solid #006600;cursor:pointer;align-self:center';

            const clickHandler = async e => {
                e.preventDefault();
                e.stopPropagation();

                try {
                    const response = await fetch(`${baseUrl}/worker.php?type=${type}&go=brb_attack`, { method: 'POST' });
                    const data = await response.json();
                    if (data.error) {
                        button.textContent = 'Error';
                        setTimeout(() => {
                            button.textContent = 'Quick Attack';
                        }, 1000);
                    } else {
                        if (attacksLeft) {
                            const match = attacksLeft.textContent.match(/Attacks left:\s*(\d+)/);
                            if (match) {
                                const current = parseInt(match[1], 10);
                                attacksLeft.textContent = `Attacks left: ${Math.max(0, current - 1)}`;
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                    button.textContent = 'Error';
                    setTimeout(() => {
                        button.textContent = 'Quick Attack';
                    }, 1000);
                }
            };

            button.addEventListener('click', clickHandler);
            listeners.push({ element: button, type: 'click', handler: clickHandler });

            const existingButton = document.querySelector(`#${button.id}`);
            if (existingButton) existingButton.remove();

            return button;
        }

        const placement = document.querySelectorAll('.row.event-brb-row-no-bottom-margin')[2];
        if (!placement) return;

        const attacksLeft = Array.from(document.querySelectorAll('.card-content-inner')).find(el => el.firstChild?.nodeType === Node.TEXT_NODE && el.firstChild.textContent.trim().startsWith('Attacks left:'))?.firstChild;

        const smallAttack = createButton('small', 'smallRocketAttack');
        const mediumAttack = createButton('medium', 'mediumRocketAttack');
        const largeAttack = createButton('large', 'largeRocketAttack');

        placement.children[0].appendChild(smallAttack);
        placement.children[1].appendChild(mediumAttack);
        placement.children[2].appendChild(largeAttack);
    }

    function quest() {
        const id = document.querySelector('.accordion-helprequest')?.dataset.id;
        const activeQuest = document.querySelector('.button.btnblue.activebtn');
        let placement;
        if (activeQuest) placement = activeQuest;
        else placement = document.querySelector('.button.btngreen.collectbtn');

        const button = document.createElement('button');
        button.textContent = activeQuest ? 'Attempt Quick Complete' : 'Quick Complete';
        button.id = `odung-phr-${id}`;
        button.style.cssText = 'width:100%;height:40px;padding:4px 8px;background:#003300;color:#fff;border:1px solid #006600;cursor:pointer;align-self:center';
        const clickHandler = async e => {
            e.preventDefault();
            e.stopPropagation();

            try {
                const response = await fetch(`${baseUrl}/worker.php?go=collectquest&id=${id}`, { method: 'POST' });
                const body = await response.text();

                if (body === 'success') {
                    placement.remove();
                    button.remove();
                } else {
                    button.textContent = 'Error';
                    setTimeout(() => {
                        button.textContent = activeQuest ? 'Attempt Quick Complete' : 'Quick Complete';
                    }, 1000);
                }
            } catch (error) {
                console.error(error);
                button.textContent = 'Error';
                setTimeout(() => {
                    button.textContent = activeQuest ? 'Attempt Quick Complete' : 'Quick Complete';
                }, 1000);
            }
        };

        button.addEventListener('click', clickHandler);
        listeners.push({ element: button, type: 'click', handler: clickHandler });


        const existingButton = placement.parentElement.querySelector(`#odung-phr-${id}`);
        if (existingButton) existingButton.remove();
        placement.parentElement.insertBefore(button, placement.nextElementSibling);
    }

    function exchange() {
        const buttons = Array.from(document.querySelectorAll('.button.btngreen.acceptbtn'));
        const ids = buttons.map(btn => btn.dataset.id);
        const trades = {};

        buttons.forEach(btn => {
            const id = btn.dataset.id;
            const get = btn.dataset.get;
            const req = btn.dataset.req;

            trades[id] = { get, req, };
        });

        async function disableTrades() {
            const disabledTrades = await GM.getValue('disabled-trades', {});
            const contentBlocks = document.querySelectorAll('.page-content .content-block');
            if (!contentBlocks[1] || document.querySelector('.odung-ec')) return;

            const container = document.createElement('div');
            container.className = 'odung-ec';
            container.style.cssText = 'color:#fff;background:#0c131d';

            const header = document.createElement('div');
            header.textContent = 'Disable Trades';
            header.style.cssText = 'border:1px solid #666;background:#1a1b1d;padding:5px;cursor:pointer;';

            const list = document.createElement('div');
            list.style.cssText = 'display:none;margin-top:5px;';
            const clickHandler = () => {
                list.style.display = list.style.display === 'none' ? 'block' : 'none';
            };

            header.addEventListener('click', clickHandler);
            listeners.push({ element: header, type: 'click', handler: clickHandler });

            const toggleTrades = () => {
                buttons.forEach(btn => {
                    const id = btn.dataset.id, get = btn.dataset.get, req = btn.dataset.req;
                    const match = disabledTrades[id];
                    const shouldHide = match && match.get === get && match.req === req;
                    btn.style.display = shouldHide ? 'none' : '';
                    if (btn.previousElementSibling) btn.previousElementSibling.style.display = shouldHide ? 'none' : '';
                });
            };

            const createCheckbox = (id, trade, isChecked) => {
                const row = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = isChecked;
                const changeHandler = async () => {
                    if (checkbox.checked) disabledTrades[id] = trade;
                    else delete disabledTrades[id];
                    await GM.setValue('disabled-trades', disabledTrades);
                    toggleTrades();
                };

                checkbox.addEventListener('change', changeHandler);
                listeners.push({ element: checkbox, type: 'change', handler: changeHandler });

                const label = document.createElement('label');
                label.textContent = ` ${trade.req} > ${trade.get}`;
                label.prepend(checkbox);
                row.appendChild(label);
                list.appendChild(row);
            };

            Object.entries(disabledTrades).forEach(([id, trade]) => createCheckbox(id, trade, true));
            Object.entries(trades).forEach(([id, trade]) => {
                if (!disabledTrades[id]) createCheckbox(id, trade, false);
            });

            container.append(header, list);
            contentBlocks[1].prepend(container);
            toggleTrades();
        }

        disableTrades();

        buttons.forEach((btn, i) => {
            const row = btn.previousElementSibling?.querySelector('.row');
            if (!row) return;

            let children = Array.from(row.children);

            children.forEach(child => {
                child.classList.add('odung-33');
            });

            const newButton = document.createElement('button');
            newButton.textContent = 'Quick Accept';
            newButton.id = `odung-ec-${ids[i]}`;
            newButton.style.cssText = 'margin:0 5px;padding:4px 8px;font-size:12px;background:#003300;color:#fff;border:1px solid #006600;cursor:pointer;align-self:center';
            const clickHandler = async e => {
                try {
                    const response = await fetch(`${baseUrl}/worker.php?go=exchtradeaccept&id=${ids[i]}`, { method: 'POST' });
                    const body = await response.text();

                    if (body === 'success') {
                        newButton.remove();
                        btn.outerHTML = '<a href="#" class="button btngray" style="margin-bottom:15px">Trade Complete</a>';
                    } else {
                        newButton.textContent = 'Error';
                        setTimeout(() => {
                            newButton.textContent = 'Quick Accept';
                        }, 1000);
                    }
                } catch (error) {
                    console.error(error);
                    newButton.textContent = 'Error';
                    setTimeout(() => {
                        newButton.textContent = 'Quick Accept';
                    }, 1000);
                }
            };

            newButton.addEventListener('click', clickHandler);
            listeners.push({ element: newButton, type: 'click', handler: clickHandler });

            const existingButton = row.querySelector(`#odung-ec-${ids[i]}`);
            if (existingButton) existingButton.remove();

            children = Array.from(row.children);
            row.insertBefore(newButton, children[1]);

        });

        const style = document.createElement('style');
        style.textContent = `.odung-33 { width: calc((100% - 15px*1) / 3) !important; }`;
        document.head.appendChild(style);
    }

    const observer = new MutationObserver(mutations => {
        const element = document.querySelector('#fireworks');
        if (element) {
            observePage(element);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();