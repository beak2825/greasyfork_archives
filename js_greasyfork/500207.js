// ==UserScript==
// @name         Pages Speed Monitor
// @version      0.6
// @description  Exibe em tempo real a quantidade de dados recebidos e enviados no site. Limitações na detecção de upload de arquivos.
// @author       Elias Henrique
// @icon         data:image/png;base64,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
// @match        *://*/*
// @grant        none
// @license      MIT
// @grant        GM_addStyle
// @namespace https://gist.github.com/elias-henrique/13a632657a7351d6615432835d0c41bd
// @downloadURL https://update.greasyfork.org/scripts/500207/Pages%20Speed%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/500207/Pages%20Speed%20Monitor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle('@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css");');

    let isFirstTime = false;
    const trafficDiv = document.createElement('div');
    trafficDiv.style.position = 'fixed';
    trafficDiv.style.zIndex = '999999';
    trafficDiv.style.right = '0';
    trafficDiv.style.bottom = '0';
    trafficDiv.style.fontSize = '11px';
    trafficDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    trafficDiv.style.color = '#33ff33';
    trafficDiv.style.padding = '5px';

    if (!isFirstTime) {
        document.body.appendChild(trafficDiv);
        isFirstTime = true;
    }

    let totalReceivedSize = 0;
    let receivedLastSecond = 0;
    let totalUploadedSize = 0;
    let uploadedLastSecond = 0;

    function formatBytes(bytes) {
        if (bytes < 1024) {
            return bytes.toFixed(2) + ' Kb';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' Kb';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' Mb';
        }
    }

    function formatTime(ms) {
        if (ms < 1000) {
            return ms + '/ms';
        } else {
            return (ms / 1000).toFixed(2) + '/s';
        }
    }

    function updateTraffic() {
        const resources = window.performance.getEntriesByType('resource');
        let loadTime = (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart);
        const now = performance.now();
        const receivedThisSecond = resources.reduce((acc, entry) => {
            if (now - entry.responseEnd < 1000) {
                return acc + entry.transferSize;
            } else {
                return acc;
            }
        }, 0);

        // Calcule a velocidade de download no último segundo
        receivedLastSecond = receivedThisSecond;
        totalReceivedSize += receivedThisSecond;

        // Calcule a velocidade de upload no último segundo
        const uploadedThisSecond = totalUploadedSize - uploadedLastSecond;
        uploadedLastSecond = totalUploadedSize;

        trafficDiv.innerHTML = `<i class="bi bi-hourglass-bottom"> ${formatTime(loadTime)} </i>  | <b><i class="bi bi-arrow-down"></i> ${formatBytes(totalReceivedSize)} • <i class="bi bi-speedometer"></i> ${formatBytes(receivedThisSecond)} | <i class="bi bi-arrow-up"></i> ${formatBytes(uploadedThisSecond)}</b>`;
    }

    document.body.addEventListener('change', function (event) {
        if (event.target && event.target.tagName === 'INPUT' && event.target.type === 'file') {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                totalUploadedSize += files[i].size;
            }
            updateTraffic();
        }
    });

    setInterval(updateTraffic, 1000);
})();
