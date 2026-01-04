// ==UserScript==
// @name         Display Case Flushie Helper
// @namespace    swervelord
// @version      1.7
// @description  Adds “Add All” and “Withdraw Sets” buttons to Torn display case. Automatically adds inventory to display, and withdraws full plushie/flower sets while leaving one full set behind of each type.
// @author       swervelord
// @match        https://www.torn.com/displaycase.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540376/Display%20Case%20Flushie%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/540376/Display%20Case%20Flushie%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PLUSHIE_SET = [
        "Camel Plushie", "Chamois Plushie", "Jaguar Plushie", "Kitten Plushie", "Lion Plushie",
        "Monkey Plushie", "Nessie Plushie", "Panda Plushie", "Red Fox Plushie", "Sheep Plushie",
        "Stingray Plushie", "Teddy Bear Plushie", "Wolverine Plushie"
    ];

    const FLOWER_SET = [
        "African Violet", "Banana Orchid", "Ceibo Flower", "Cherry Blossom", "Crocus",
        "Dahlia", "Edelweiss", "Heather", "Orchid", "Peony", "Tribulus Omanense"
    ];

    const STYLE = `
        .tm-dc-btn {
            background: #2d2d2d;
            color: #fff;
            border: 1px solid #0006;
            padding: 3px 8px;
            margin-left: 6px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 4px;
            box-shadow: 0 0 5px #00e1ff;
        }
        .tm-dc-btn:hover {
            filter: brightness(1.15);
        }
    `;
    const styleTag = document.createElement('style');
    styleTag.textContent = STYLE;
    document.head.appendChild(styleTag);

    function onAddPage() {
        const timer = setInterval(() => {
            const clearAllAnchor = document.querySelector('.clear-action');
            if (!clearAllAnchor) return;
            clearInterval(timer);

            const btn = document.createElement('button');
            btn.textContent = 'Add All';
            btn.className = 'tm-dc-btn';
            btn.onclick = () => {
                document.querySelectorAll('li.clearfix').forEach(row => {
                    const nameSpan = row.querySelector('.name-wrap .t-overflow');
                    const qtyInput = row.querySelector('input[name="amount"]');
                    if (!nameSpan || !qtyInput) return;

                    const baseName = nameSpan.textContent.trim();
                    if (!(PLUSHIE_SET.includes(baseName) || FLOWER_SET.includes(baseName))) return;

                    const infoText = row.querySelector('.info-wrap')?.textContent || '';
                    const match = infoText.match(/(\d+)x/);
                    const count = parseInt(match?.[1] || '1', 10);

                    qtyInput.value = count;
                    qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
                });
            };

            clearAllAnchor.after(btn);
        }, 300);
    }

    function onManagePage() {
        const timer = setInterval(() => {
            const undoLink = document.querySelector('.undo a');
            if (!undoLink) return;
            clearInterval(timer);

            const btn = document.createElement('button');
            btn.textContent = 'Withdraw Sets';
            btn.className = 'tm-dc-btn';
            btn.onclick = () => {
                const plushieCounts = {};
                const flowerCounts = {};
                const rows = document.querySelectorAll('li[id^="item"]');

                rows.forEach(row => {
                    const nameEl = row.querySelector('.desc .bold');
                    const amtEl = row.querySelector('.desc .amount');
                    if (!nameEl || !amtEl) return;

                    const name = nameEl.textContent.trim();
                    const count = parseInt(amtEl.textContent.replace('x', '').trim(), 10);
                    if (isNaN(count)) return;

                    if (PLUSHIE_SET.includes(name)) plushieCounts[name] = count;
                    if (FLOWER_SET.includes(name)) flowerCounts[name] = count;
                });

                const minInSet = (setArr, countObj) =>
                    Math.min(...setArr.map(item => countObj[item] || 0));

                const plushieMin = Math.max(0, minInSet(PLUSHIE_SET, plushieCounts) - 1);
                const flowerMin = Math.max(0, minInSet(FLOWER_SET, flowerCounts) - 1);

                rows.forEach(row => {
                    const nameEl = row.querySelector('.desc .bold');
                    const amtEl = row.querySelector('.desc .amount');
                    const input = row.querySelector('input[name="item"]');
                    if (!nameEl || !amtEl || !input) return;

                    const name = nameEl.textContent.trim();
                    const count = parseInt(amtEl.textContent.replace('x', '').trim(), 10);

                    if (PLUSHIE_SET.includes(name)) {
                        input.value = count >= plushieMin ? plushieMin : '';
                    }

                    if (FLOWER_SET.includes(name)) {
                        input.value = count >= flowerMin ? flowerMin : '';
                    }
                });
            };

            undoLink.after(btn);
        }, 300);
    }

    if (location.hash === '#add') onAddPage();
    else if (location.hash === '#manage') onManagePage();
})();
