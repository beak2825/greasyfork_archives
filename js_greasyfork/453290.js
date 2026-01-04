// ==UserScript==
// @name:en         I AM Sure
// @name            朕知道了
// @name:zh         朕知道了
// @description:en  Never worried about that like 'Please type ... to confirm'
// @description     需要二次确认时，自动填入项目名称
// @description:zh  需要二次确认时，自动填入项目名称
// @version         1.0.3
// @author          sanko
// @namespace       https://github.com/sankoshine/gm-public
// @match           *://github.com/*/*/settings
// @match           *://vercel.com/*/*/settings
// @match           *://vercel.com/*/*/settings/general
// @downloadURL https://update.greasyfork.org/scripts/453290/%E6%9C%95%E7%9F%A5%E9%81%93%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/453290/%E6%9C%95%E7%9F%A5%E9%81%93%E4%BA%86.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const fill = async function (area) {
        if (!area) {
            return;
        }
        const text = area.getAttribute('pattern').replace(/\[(.).*?\]/g, '$1');
        area.value = text;
        area.dispatchEvent(new InputEvent('input', {
            inputType: 'insertText',
            data: text,
        }));
    };

    if (document.location.href.startsWith('https://github.com')) {
        await new Promise(r => setTimeout(r, 100));
        const buttons = document.querySelectorAll('#options_bucket > div.Box.color-border-danger details');
        if (buttons.length != 4) {
            return;
        }
        const areas = document.querySelectorAll('#options_bucket p > input:not(.js-synced-repo-owner-input)');
        if (areas.length != 4) {
            return;
        }
        for (const [k, v] of buttons.entries()) {
            v.querySelector('summary')?.addEventListener('click', async () => {
                await new Promise(r => setTimeout(r, 100));
                if (v.hasAttribute('open')) {
                    await fill(areas[k]);
                }
            });
        }
    } else if (document.location.href.startsWith('https://vercel.com')) {
        let button;
        for (let i = 0; i < 100; i++) {
            await new Promise(r => setTimeout(r, 100));
            button = document.querySelector(
                '#__next > div > div > div.dashboard-container > div.geist-wrapper > div > div:nth-child(2) > div:nth-child(8) > div > footer > div.fieldset_actions__VuXvZ > div > button');
            if (button) {
                break;
            }
        }
        button?.addEventListener('click', async () => {
            await new Promise(r => setTimeout(r, 100));
            await fill(document.querySelector('.input_input__WqafN[name="resourceName"]'));
            await fill(document.querySelector('.input_input__WqafN[name="verificationText"]'));
        });
    }
})();