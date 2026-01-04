// ==UserScript==
// @name         RYM User Reception
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Create a section illustrating the user reception of the release on RateYourMusic
// @author       https://greasyfork.org/users/1320826-polachek
// @match        https://rateyourmusic.com/release/*
// @match        https://rateyourmusic.com/film/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538641/RYM%20User%20Reception.user.js
// @updateURL https://update.greasyfork.org/scripts/538641/RYM%20User%20Reception.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .rym-reception {
            margin-top: 0px;
            line-height: 1.8;
            padding: 10px 0;
            border-top: 1px solid var(--mono-d);
        }
        .rym-reception div {
            display: flex;
            align-items: center;
            font-family: var(--font-family-sans-serif);
            transition: font-size 0.3s;
        }
        .rym-reception .emoji {
            margin-right: 8px;
            font-size: 1.2em;
        }
        .rym-reception .top-item {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .rym-reception .other-items {
            font-size: 0.95em;
            opacity: 0.9;
        }

        .rym-meter {
    display: flex;
    align-items: center;
    margin-top: 15px;
    padding: 10px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 1;
}

.rym-meter::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.0);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.0);
    z-index: 1;
    border-radius: 8px;
}

        .rym-meter-circle {
    position: absolute;
    left: 10px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    z-index: 0;
}

.rym-meter-percentage {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.4em;
    color: white;
    position: relative;
    z-index: 2;
}

        .rym-meter-circle::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
        }

.rym-meter-label {
    margin-left: 15px;
    font-weight: bold;
    font-size: 1.1em;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 5px;
    position: relative;
    z-index: 2;
}

        .rym-meter-acclaim { background: radial-gradient(circle at 30% 30%, #FFD700, #D4AF37); }
        .rym-meter-very-positive { background: radial-gradient(circle at 30% 30%, #2E8B57, #006400); }
        .rym-meter-positive { background: radial-gradient(circle at 30% 30%, #32CD32, #228B22); }
        .rym-meter-mixed { background: radial-gradient(circle at 30% 30%, #FFA500, #FF8C00); }
        .rym-meter-negative { background: radial-gradient(circle at 30% 30%, #FF4500, #B22222); }
        .rym-meter-panned { background: radial-gradient(circle at 30% 30%, #555, #000); }
    `);

    function initUserReception() {
        const statsContainer = $('.catalog_stats.hide-for-small');
        if (!statsContainer.length) return;

        let chartData = [];
        const hiddenTable = $('#chart_div table');

        if (hiddenTable.length) {
            hiddenTable.find('tbody tr').each(function() {
                const rating = parseFloat($(this).find('td:first').text().trim());
                const count = parseInt($(this).find('td:last').text().trim());
                if (!isNaN(rating) && !isNaN(count)) {
                    chartData.push([rating, count]);
                }
            });
        }

        if (chartData.length === 0) {
            const scriptContent = $('script:contains("drawChart1")').text();
            const regex = /data\.addRows\(\[([\s\S]*?)\]\)/;
            const match = scriptContent.match(regex);

            if (match && match[1]) {
                try {
                    const dataString = '[' + match[1].replace(/\s/g, '') + ']';
                    chartData = JSON.parse(dataString);
                } catch (e) {
                    console.error('RYM User Reception: Erro ao analisar dados', e);
                    return;
                }
            }
        }

        if (chartData.length === 0) return;

        const categoryMap = {
            'loved it': [5.0],
            'really liked it': [4.0, 4.5],
            'liked it': [3.0, 3.5],
            'tolerated it': [2.5],
            'didn\'t like it': [1.5, 2.0],
            'despised it': [0.5, 1.0]
        };

        const emojiMap = {
            'loved it': '🥰',
            'really liked it': '🤩',
            'liked it': '😏',
            'tolerated it': '😐',
            'didn\'t like it': '😒',
            'despised it': '😖'
        };

        const categoryCounts = {};
        let total = 0;

        Object.keys(categoryMap).forEach(category => {
            categoryCounts[category] = 0;
        });

        chartData.forEach(([rating, count]) => {
            for (const [category, ratings] of Object.entries(categoryMap)) {
                if (ratings.includes(rating)) {
                    categoryCounts[category] += count;
                    total += count;
                    break;
                }
            }
        });

        if (total === 0) return;

        const receptionData = [];
        Object.keys(categoryCounts).forEach(category => {
            const percentage = ((categoryCounts[category] / total) * 100).toFixed(1);
            receptionData.push({
                category,
                percentage,
                emoji: emojiMap[category]
            });
        });

        receptionData.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

        const positivePercentage = (
            categoryCounts['loved it'] +
            categoryCounts['really liked it'] +
            categoryCounts['liked it']
        ) / total * 100;

        let ratingClass, ratingLabel;
        const roundedPercentage = Math.round(positivePercentage);

        if (roundedPercentage >= 95) {
            ratingClass = 'rym-meter-acclaim';
            ratingLabel = 'ACCLAIM';
        } else if (roundedPercentage >= 80) {
            ratingClass = 'rym-meter-very-positive';
            ratingLabel = 'VERY<br>POSITIVE';
        } else if (roundedPercentage >= 60) {
            ratingClass = 'rym-meter-positive';
            ratingLabel = 'POSITIVE';
        } else if (roundedPercentage >= 40) {
            ratingClass = 'rym-meter-mixed';
            ratingLabel = 'MIXED';
        } else if (roundedPercentage >= 20) {
            ratingClass = 'rym-meter-negative';
            ratingLabel = 'NEGATIVE';
        } else {
            ratingClass = 'rym-meter-panned';
            ratingLabel = 'PANNED';
        }

const meterHTML = `
<div class="rym-meter">
    <div class="rym-meter-circle ${ratingClass}"></div>
    <div class="rym-meter-percentage">
        ${roundedPercentage}%
    </div>
    <div class="rym-meter-label">
        ${ratingLabel}
    </div>
</div>
`;

        let topItemHTML = '';
        let otherItemsHTML = '';

        receptionData.forEach((item, index) => {
            const line = `<div><span class="emoji">${item.emoji}</span> ${item.percentage}% ${item.category}</div>`;

            if (index === 0) {
                topItemHTML = `<div class="top-item">${line}</div>`;
            } else {
                otherItemsHTML += `<div class="other-items">${line}</div>`;
            }
        });

        const sectionHTML = `
<div class="header">User reception</div>
${meterHTML}
<div class="rym-reception">
    ${topItemHTML}
    ${otherItemsHTML}
</div>
        `;

        statsContainer.append(sectionHTML);
    }

    const checkReady = setInterval(() => {
        if ($('#chart_div').length && $('script:contains("drawChart1")').length) {
            clearInterval(checkReady);
            initUserReception();
        }
    }, 500);

    setTimeout(() => {
        clearInterval(checkReady);
        if ($('.rym-reception').length === 0) {
            initUserReception();
        }
    }, 5000);
})();