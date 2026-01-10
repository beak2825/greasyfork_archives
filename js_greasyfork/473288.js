// ==UserScript==
// @name               Auto Refresh Twitter (X) Timeline
// @name:fr            Actualisation automatique de la timeline Twitter (X)
// @name:es            Actualización automática de la línea de tiempo de Twitter (X)
// @name:de            Automatische Aktualisierung der Twitter (X) Timeline
// @name:it            Aggiornamento automatico della timeline di Twitter (X)
// @name:zh-CN         自动刷新 Twitter (X) 时间轴
// @namespace          https://gist.github.com/4lrick/bedb39b069be0e4c94dc20214137c9f5
// @version            2.5
// @description        Automatically refreshes the Twitter (X) timeline every 5 seconds without refreshing the tab.
// @description:fr     Actualise automatiquement la timeline Twitter (X) toutes les 5 secondes sans rafraîchir l'onglet.
// @description:es     Refresca automáticamente el timeline de Twitter (X) cada 5 segundos sin refrescar la pestaña.
// @description:de     Aktualisiert automatisch die Twitter (X) Timeline alle 5 Sekunden ohne das Tab neu zu laden.
// @description:it     Aggiorna automaticamente la timeline di Twitter (X) ogni 5 secondi senza aggiornare la scheda.
// @description:zh-CN  在不刷新标签页的情况下, 每5秒自动刷新Twitter（X）时间轴。
// @author             4lrick
// @match              https://x.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @license            GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/473288/Auto%20Refresh%20Twitter%20%28X%29%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/473288/Auto%20Refresh%20Twitter%20%28X%29%20Timeline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let refreshInterval = GM_getValue('refreshInterval', 5);
    let refreshIntervalId;
    let menuCommandId;

    function isAtTopOfPage() {
        const tablist = document.querySelector('[role="tablist"]');
        const timeline = document.querySelector('main [role="region"]');

        if (tablist && timeline) {
            const tablistBottom = tablist.getBoundingClientRect().bottom;
            const timelineTop = timeline.getBoundingClientRect().top;

            return tablistBottom <= timelineTop + 1;
        }
        return false;
    }

    function refreshTimeline() {
        if (window.location.href.startsWith('https://x.com/home')) {
            if (isAtTopOfPage()) {
                const refreshButton = document.querySelector('[href="/home"]');
                if (refreshButton) {
                    refreshButton.click();
                    window.scrollY = 0;
                }
            }
        }
    }

    function setCustomInterval() {
        if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
        }
        refreshIntervalId = setInterval(refreshTimeline, refreshInterval * 1000);
        updateMenuCommand();
    }

    function settings() {
        const newInterval = prompt("Enter refresh interval in seconds:", refreshInterval);
        if (newInterval !== null) {
            const parsedInterval = parseInt(newInterval);
            if (!isNaN(parsedInterval) && parsedInterval > 0) {
                refreshInterval = parsedInterval;
                GM_setValue('refreshInterval', refreshInterval);
                setCustomInterval();
            } else {
                alert("Please enter a valid positive number.");
            }
        }
    }

    function updateMenuCommand() {
        if (menuCommandId) {
            GM_unregisterMenuCommand(menuCommandId);
        }
        menuCommandId = GM_registerMenuCommand(`Set Refresh Interval (current: ${refreshInterval}s)`, settings);
    }

    updateMenuCommand();
    setCustomInterval();
})();