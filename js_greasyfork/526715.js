// ==UserScript==
// @name         Kittens Game - Progress Bars
// @namespace    https://greasyfork.org/en/scripts/526715-kittens-game-progress-bars
// @version      1.3
// @description  Adds progress bars to Kittens Game to see how close you are to an upgrade
// @author       Mashiro-chan
// @match        https://kittensgame.com/web/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526715/Kittens%20Game%20-%20Progress%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/526715/Kittens%20Game%20-%20Progress%20Bars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const init = () => {
        if (!game.resPool) {
            setTimeout(init, 100);
            return;
        }

        document.addEventListener("click", function(event) {
            const button = event.target.closest(".tab");
            if (button && !button.classList.contains("activeTab")) {
                updateButtons();
            }
        });

        var getButtons = () => {
            var buttons = [game.tabs.find(t => t.tabId == game.ui.activeTabId)]
                .flatMap(t => [...new Set(Object.keys(t).filter(k => /btn|button|panel|children/i.test(k)).flatMap(k => t[k]))])
                .filter(Boolean);
            while (buttons.some(x => !x.model)) {
                buttons = buttons.flatMap(x =>
                                          x.model
                                          ? x
                                          : [x.tradeBtn, x.race, x.embassyButton, x.children].flat().filter(Boolean)
                                         );
            }
            return buttons;
        };

        const extendPrices = prices => prices.map(p => ({
            'name': p.name,
            'have': game.resPool.get(p.name).value,
            'need': p.val
        })).map(p => ({
            ...p,
            'delta': p.need - p.have,
            'percent': p.have / p.need
        }));

        let progressBarColor = '#FF0000';

        const bodyClass = document.body.className.match(/scheme_([\w-]+)/);
        const themeName = bodyClass[1];
        const themeStylesheet = `theme_${themeName}.css`;
        const selector = `.scheme_${themeName} .btn.modern.disabled.limited span.btnTitle`;
        const sheet = [...document.styleSheets].find(s => s.href && s.href.includes(themeStylesheet));
        const rule = [...sheet.cssRules].find(r => r.selectorText === selector);

        progressBarColor = rule.style.color;

        const initButtonExtension = button => {
            const buttonContent = button.buttonContent;
            if (!buttonContent) return;

            const statusBar = document.createElement('div');
            statusBar.className = 'statusBar';
            Object.assign(statusBar.style, {
                display: 'none',
                position: 'absolute',
                bottom: '0px',
                left: '4%',
                height: '1px',
                width: '92%',
                pointerEvents: 'none'
            });
            buttonContent.appendChild(statusBar);
            button.statusBar = statusBar;

            const progressBar = document.createElement('div');
            progressBar.className = 'progressBar';
            Object.assign(progressBar.style, {
                display: 'inline-block',
                float: 'left',
                height: '100%',
                width: '0%',
                backgroundColor: progressBarColor,
                borderRadius: '2px 2px 2px 2px'
            });
            statusBar.appendChild(progressBar);
            statusBar.progressBar = progressBar;
        };

        const updateButtons = () => {
            document.querySelectorAll('.tabInner .btn.nosel .statusBar').forEach(el => {
                el.style.display = 'none';
            });

            getButtons()
                .filter(b => b.model.visible && !b.model.enabled && b.buttonContent.offsetParent)
                .filter(b => !/\((?:complete|in progress)\)/i.test(b.model.name))
                .forEach(button => {
                    if (!button.buttonContent.querySelector('.statusBar')) {
                        initButtonExtension(button);
                    }

                    const prices = extendPrices(button.model.prices);
                    const minPercent = Math.max(Math.min(1, ...prices.map(p => p.percent)), 0.01);
                    if (minPercent >= 1) return;

                    button.statusBar.style.display = 'inline-block';
                    button.statusBar.progressBar.style.width = (minPercent * 100) + '%';
                });
        };

        setInterval(() => {
            updateButtons();
        }, 100);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();