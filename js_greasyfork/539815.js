// ==UserScript==
// @name         OP.GG Total & Average Game Time Calculator (Robust Selector)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Enhance your OP.GG experience with this powerful match history analyzer! Automatically calculates your total playtime, average game duration, and most played champions. Features include: 🕒 Total and average game time tracking, 🏆 Most played champion statistics, 📊 Average laning scores, and 🔄 Auto-scroll functionality to load your entire match history. Perfect for players who want to track their gaming habits and performance over time!
// @author       SimronJ
// @match        https://*.op.gg/lol/summoners*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539815/OPGG%20Total%20%20Average%20Game%20Time%20Calculator%20%28Robust%20Selector%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539815/OPGG%20Total%20%20Average%20Game%20Time%20Calculator%20%28Robust%20Selector%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Parse time strings like "32m 21s" or "1h 12m 5s" into seconds
    function parseTimeToSeconds(timeString) {
        let h=0, m=0, s=0;
        const parts = timeString.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/);
        if (parts) {
            h = parseInt(parts[1]||0);
            m = parseInt(parts[2]||0);
            s = parseInt(parts[3]||0);
        }
        return h*3600 + m*60 + s;
    }
    // Format seconds into "Xh Ym Zs"
    function formatTime(sec) {
        const h = Math.floor(sec/3600);
        const m = Math.floor((sec%3600)/60);
        const s = sec%60;
        let str = '';
        if (h>0) str += h+'h ';
        if (m>0 || h>0) str += m+'m ';
        str += s+'s';
        return str.trim();
    }
    // Go through each .box-border entry, find time, sum, and count games with time
    // Also count champion occurrences
    function calculateStats() {
        const entries = document.querySelectorAll('.box-border');
        let totalTimeInSeconds = 0;
        let gamesWithTimeCount = 0;
        const championCounts = {};
        const championLaningScores = {}; // Store laning scores per champion
        let totalLaningScore = 0;
        let gamesWithLaningScore = 0;

        entries.forEach(entry => {
            // Find the champion image and get its alt text
            const championImg = entry.querySelector('.flex.items-center.gap-1 a img');
            if (championImg && championImg.alt) {
                const championName = championImg.alt;
                championCounts[championName] = (championCounts[championName] || 0) + 1;
                
                // Initialize champion laning scores if not exists
                if (!championLaningScores[championName]) {
                    championLaningScores[championName] = { total: 0, count: 0 };
                }
            }

            // Find laning score
            const laningElement = entry.querySelector('.text-xs.text-gray-500');
            if (laningElement) {
                const laningText = laningElement.textContent;
                const laningMatch = laningText.match(/Laning (\d+):/);
                if (laningMatch) {
                    const laningScore = parseInt(laningMatch[1]);
                    totalLaningScore += laningScore;
                    gamesWithLaningScore++;
                    
                    // Add to champion-specific laning score
                    if (championImg && championImg.alt) {
                        const championName = championImg.alt;
                        championLaningScores[championName].total += laningScore;
                        championLaningScores[championName].count++;
                    }
                }
            }

            // Find the one span that looks like a game-timer
            const spans = entry.querySelectorAll('span');
            for (let sp of spans) {
                const txt = sp.textContent.trim();
                if (/^\d+h\s*\d+m\s*\d+s$/.test(txt) || /^\d+m\s*\d+s$/.test(txt)) {
                    totalTimeInSeconds += parseTimeToSeconds(txt);
                    gamesWithTimeCount++;
                    break;
                }
            }
        });

        // Find the most frequent champion
        let mostFrequentChampion = 'N/A';
        let maxCount = 0;
        for (const champion in championCounts) {
            if (championCounts[champion] > maxCount) {
                maxCount = championCounts[champion];
                mostFrequentChampion = champion;
            }
        }

        // Calculate average laning scores
        const averageLaningScore = gamesWithLaningScore > 0 ? Math.round(totalLaningScore / gamesWithLaningScore) : 0;
        const mostPlayedChampionLaningScore = mostFrequentChampion !== 'N/A' && championLaningScores[mostFrequentChampion] ?
            Math.round(championLaningScores[mostFrequentChampion].total / championLaningScores[mostFrequentChampion].count) : 0;

        return {
            totalSeconds: totalTimeInSeconds,
            gamesWithTimeCount: gamesWithTimeCount,
            mostFrequentChampion: mostFrequentChampion,
            mostFrequentChampionGames: maxCount,
            averageLaningScore: averageLaningScore,
            mostPlayedChampionLaningScore: mostPlayedChampionLaningScore
        };
    }
    // Create or update floating widget
    function updateDisplay() {
        const { totalSeconds, gamesWithTimeCount, mostFrequentChampion, mostFrequentChampionGames, averageLaningScore, mostPlayedChampionLaningScore } = calculateStats();
        const avgSeconds = gamesWithTimeCount > 0 ? Math.floor(totalSeconds / gamesWithTimeCount) : 0;
        const totalStr = formatTime(totalSeconds);
        const avgStr   = formatTime(avgSeconds);
        let el = document.getElementById('time-stats-display');
        if (!el) {
            el = document.createElement('div');
            el.id = 'time-stats-display';
            Object.assign(el.style, {
                position:       'fixed',
                top:            '50%',
                left:           '10px',
                transform:      'translateY(-50%)',
                backgroundColor:'rgba(0,0,0,0.7)',
                color:          '#fff',
                padding:        '10px',
                borderRadius:   '5px',
                zIndex:         '10000',
                fontFamily:     'sans-serif',
                whiteSpace:     'pre-line'
            });
            document.body.appendChild(el);
        }
        el.textContent =
            `Total Played Time: ${totalStr}\n` +
            `Average per Game:  ${avgStr} (${gamesWithTimeCount} games)\n` +
            `Most Played Champion: ${mostFrequentChampion} (${mostFrequentChampionGames} games | ${mostPlayedChampionLaningScore} Avg Lane)\n` +
            `Average Laning Score: ${averageLaningScore}`;

        // Add scroll button if it doesn't exist
        let scrollButton = document.getElementById('auto-scroll-button');
        if (!scrollButton) {
            scrollButton = document.createElement('button');
            scrollButton.id = 'auto-scroll-button';
            scrollButton.textContent = 'Auto Scroll';
            Object.assign(scrollButton.style, {
                display: 'block',
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                width: '100%'
            });
            scrollButton.addEventListener('click', autoScroll);
            el.appendChild(scrollButton);
        }
    }

    // Function to handle auto-scrolling
    function autoScroll() {
        const button = document.getElementById('auto-scroll-button');
        button.textContent = 'Loading...';
        button.disabled = true;
        
        let lastHeight = document.body.scrollHeight;
        let noChangeCount = 0;
        
        const loadMore = () => {
            const showMoreButton = document.querySelector('button.text-13px.border-1.box-border.block.h-\\[40px\\].w-full.border.border-gray-250.bg-gray-0.px-0.py-\\[8px\\].text-center.text-gray-900.no-underline.md\\:rounded');
            
            if (showMoreButton) {
                showMoreButton.click();
                // Check if the page height changed after clicking
                setTimeout(() => {
                    const newHeight = document.body.scrollHeight;
                    if (newHeight === lastHeight) {
                        noChangeCount++;
                        if (noChangeCount >= 3) { // If height hasn't changed for 3 attempts
                            clearInterval(loadInterval);
                            button.textContent = 'Auto Scroll';
                            button.disabled = false;
                        }
                    } else {
                        noChangeCount = 0;
                        lastHeight = newHeight;
                    }
                }, 1000);
            } else {
                clearInterval(loadInterval);
                button.textContent = 'Auto Scroll';
                button.disabled = false;
            }
        };

        const loadInterval = setInterval(loadMore, 1500); // Try to load more every 1.5 seconds
    }

    // Watch for newly loaded games (infinite scroll)
    const observer = new MutationObserver(muts => {
        for (let m of muts) {
            if (m.addedNodes.length) {
                updateDisplay();
                break;
            }
        }
    });
    const container = document.querySelector('#content-container') || document.body;
    observer.observe(container, { childList: true, subtree: true });
    // Initial render
    updateDisplay();
})();