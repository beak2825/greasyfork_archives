// ==UserScript==
// @name         Torn - Inactivity Logs Timestamp Comparison Analysis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds button on Torn Settings page to upload logs json file and compares each timestamp, then downloads a text file of periods where time between logs was at least one hour
// @author       You
// @match        https://www.torn.com/preferences.php*
// @downloadURL https://update.greasyfork.org/scripts/532025/Torn%20-%20Inactivity%20Logs%20Timestamp%20Comparison%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/532025/Torn%20-%20Inactivity%20Logs%20Timestamp%20Comparison%20Analysis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findTimestampGaps(logData) {
        const logs = Object.values(logData.log)

        // Sort logs by timestamp
        logs.sort((a, b) => a.timestamp - b.timestamp)

        const gaps = []
        let totalSeconds = 0

        const formatUnix = ts => {
            const date = new Date(ts * 1000)
            const yyyy = date.getFullYear()
            const mm = (date.getMonth() + 1).toString().padStart(2, '0')
            const dd = date.getDate().toString().padStart(2, '0')
            const hh = date.getHours().toString().padStart(2, '0')
            const mi = date.getMinutes().toString().padStart(2, '0')
            const ss = date.getSeconds().toString().padStart(2, '0')
            return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
        }

        const formatDiff = secs => {
            const days = Math.floor(secs / 86400)
            const hours = Math.floor((secs % 86400) / 3600)
            const minutes = Math.floor((secs % 3600) / 60)
            const seconds = secs % 60
            return `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
        }


        gaps.push(`PERIODS OF MORE THAN ONE HOUR BETWEEN LOGS`)
        gaps.push('')

        for (let i = 1; i < logs.length; i++) {
            const prev = logs[i - 1].timestamp
            const curr = logs[i].timestamp
            const diff = curr - prev

            if (diff > 3600) {
                totalSeconds += diff
                const hours = Math.floor(diff / 3600).toString().padStart(2, '0')
                const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
                const seconds = (diff % 60).toString().padStart(2, '0')

                const prevFormatted = `${formatUnix(prev)} (${prev})`
                const currFormatted = `${formatUnix(curr)} (${curr})`
                gaps.push(`Inactivity Time: ${hours}:${minutes}:${seconds} || ${prevFormatted} - ${currFormatted}`)
            }
        }

        if (gaps.length > 0) {
            gaps.push('')
            gaps.push(`SUM OF ALL PERIODS WHERE TIME BETWEEN LOGS IS AT LEAST ONE HOUR: ${formatDiff(totalSeconds)}`)
            const blob = new Blob([gaps.join('\n')], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'timestamp_gaps.txt'
            a.click()
            URL.revokeObjectURL(url)
        } else {
            alert('No gaps over 1 hour found.')
        }
    }



    const button = document.createElement('button');
    button.textContent = 'Start Log Timestamp Analysis';
    button.style.padding = '10px';
    button.style.margin = '10px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#333';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.margin = '10px';

    const header = document.querySelector('div.content-title > h4');
    if (header) {
        header.appendChild(button);
        header.appendChild(fileInput);
    }

    button.addEventListener('click', function() {
        if (fileInput.files.length === 0) {
            alert("Please upload a JSON file first.");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const logs = JSON.parse(e.target.result);
                findTimestampGaps(logs);
            } catch (error) {
                alert("Invalid JSON file.");
                console.error(error);
            }
        };

        reader.readAsText(file);
    });

})();
