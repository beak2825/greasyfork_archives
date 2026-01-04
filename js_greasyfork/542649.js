// ==UserScript==
// @name         Badminton - API
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Prokliky do api
// @author       Michal
// @match        https://bwfworldtour.bwfbadminton.com/tournament/*/results/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542649/Badminton%20-%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/542649/Badminton%20-%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function addStyle(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }


    function makeRequest(options) {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            GM_xmlhttpRequest(options);
        } else {

            fetch(options.url, {
                method: options.method || 'GET',
                headers: options.headers || {}
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(responseText => {
                if (options.onload) {
                    options.onload({
                        responseText: responseText,
                        status: 200,
                        statusText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Request error:', error);
                if (options.onerror) {
                    options.onerror(error);
                }
            });
        }
    }

    // Kompaktní CSS s lepším výkonem
    const minimalCSS = `
        .api-links-container {
            margin: 15px 0; padding: 15px; background: #fff; border: 2px solid #ddd; border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .api-links-container h4 { margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: 600; }
        .api-status { margin: 10px 0; padding: 10px 12px; font-weight: 500; border-radius: 4px; font-size: 14px; }
        .api-status.loading { background: #f0f0f0; color: #666; border: 1px solid #ddd; }
        .api-status.success { background: #f8f8f8; color: #333; border: 1px solid #ccc; }
        .api-status.error { background: #f5f5f5; color: #666; border: 1px solid #ddd; }
        #main-api-link {
            color: #fff !important; background: #ff0000 !important; padding: 10px 16px !important;
            border: 3px solid #000 !important; border-radius: 6px !important; text-decoration: none !important;
            font-weight: 900 !important; font-size: 14px !important; display: inline-block !important;
        }
        #api-link-display { margin: 8px 0; padding: 10px; background: #fff; border: 3px solid #000; border-radius: 4px; text-align: center; }
    `;

    const detailedCSS = `
        .api-link-btn {
            background: #f8f8f8; color: #333; border: 2px solid #ddd; padding: 8px 12px; margin: 3px;
            cursor: pointer; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-block;
            border-radius: 4px; transition: all 0.2s ease;
        }
        .api-link-btn:hover { background: #e8e8e8; border-color: #999; color: #000; }
        .api-link-btn.live { background: #333; color: #fff; border-color: #333; }
        .api-link-btn.live:hover { background: #555; }
        .court-group { margin: 15px 0; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden; }
        .court-title { background: #f0f0f0; color: #333; font-weight: 600; font-size: 14px; padding: 10px 12px; margin: 0; border-bottom: 1px solid #e0e0e0; }
        .match-item { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .match-item:last-child { border-bottom: none; }
        .match-item:hover { background: #f8f8f8; }
        .match-participants { font-size: 12px; color: #555; font-weight: 500; flex: 1; min-width: 180px; }
        .match-time { font-size: 11px; color: #777; font-weight: 400; white-space: nowrap; }
        #api-links { max-height: 60vh; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 4px; background: #fff; }
        #api-links:empty { border: none; }
    `;

    // Lazy load stylů
    addStyle(minimalCSS);

    const KNOWN_TOURNAMENTS = {
        'yonex-canada-open-2025': '9B0A466D-4601-4B6A-9FDE-60208870A5BC'
    };

    function extractTournamentId() {
        const urlMatch = window.location.pathname.match(/\/tournament\/(\d+)\//);
        return urlMatch ? urlMatch[1] : null;
    }

    function extractDate() {
        const urlMatch = window.location.pathname.match(/\/results\/(\d{4}-\d{2}-\d{2})/);
        return urlMatch ? urlMatch[1] : null;
    }

    function extractTournamentSlug() {
        const urlMatch = window.location.pathname.match(/\/tournament\/\d+\/([^\/]+)\//);
        return urlMatch ? urlMatch[1] : null;
    }

    function createApiLinksContainer() {
        const container = document.createElement('div');
        container.className = 'api-links-container';
        container.innerHTML = `
            <h4>Api urls</h4>
            <div class="api-status loading">Hledám API...</div>
            <div id="api-link-display" style="display: none;">
                <a id="main-api-link" href="#" target="_blank">ZOBRAZIT API</a>
            </div>
            <div id="api-links"></div>
        `;
        return container;
    }

    function findTournamentCode() {
        const slug = extractTournamentSlug();
        if (slug && KNOWN_TOURNAMENTS[slug]) {
            return KNOWN_TOURNAMENTS[slug];
        }

        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const content = script.textContent;
            const guidMatch = content.match(/[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/gi);
            if (guidMatch) {
                return guidMatch[0];
            }
        }

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if (value && typeof value === 'string') {
                const guidMatch = value.match(/[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/gi);
                if (guidMatch) {
                    return guidMatch[0];
                }
            }
        }

        return null;
    }

    function getMatchParticipants(match) {
        const participants = [];

        if (match.team1 && match.team1.players) {
            const team1Names = match.team1.players.map(p => (p.nameShort || p.nameDisplay).replace(/\s+/g, ' ')).join('/');
            participants.push(team1Names);
        }

        if (match.team2 && match.team2.players) {
            const team2Names = match.team2.players.map(p => (p.nameShort || p.nameDisplay).replace(/\s+/g, ' ')).join('/');
            participants.push(team2Names);
        }

        let result = '';
        if (participants.length === 2) {
            result = `${participants[0]} vs ${participants[1]}`;
        } else {
            result = participants.join(' vs ') || 'Neznámí hráči';
        }

        if (match.eventName) {
            result = `[${match.eventName}] ${result}`;
        }

        return result;
    }

    function getMatchTime(match) {
        if (match.matchTime) {
            try {
                const time = new Date(match.matchTime + 'Z').toLocaleTimeString('cs-CZ', {
                    timeZone: 'America/Toronto',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return time;
            } catch (e) {
                return '';
            }
        }
        return '';
    }

    function groupMatchesByCourt(matches) {
        const courts = {};

        matches.forEach(match => {
            const courtName = match.courtName || 'Neznámý kurt';
            if (!courts[courtName]) {
                courts[courtName] = [];
            }
            courts[courtName].push(match);
        });

        return courts;
    }

    function fetchMatches(tournamentId, date, tournamentCode) {
        const statusDiv = document.querySelector('.api-status');
        const linksDiv = document.getElementById('api-links');
        const apiLinkDisplay = document.getElementById('api-link-display');
        const mainApiLink = document.getElementById('main-api-link');

        if (!tournamentCode) {
            statusDiv.className = 'api-status error';
            statusDiv.textContent = '❌ API nenalezena';
            apiLinkDisplay.style.display = 'none';
            return;
        }

        statusDiv.className = 'api-status loading';
        statusDiv.textContent = 'Načítám...';
        apiLinkDisplay.style.display = 'none';

        const apiUrl = `https://extranet-lv.bwfbadminton.com/api/tournaments/day-matches?tournamentCode=${tournamentCode}&date=${date}&order=2&court=0`;

        makeRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    statusDiv.className = 'api-status success';
                    statusDiv.textContent = `${data.length || 0} zápasů`;

                    mainApiLink.href = apiUrl;
                    apiLinkDisplay.style.display = 'block';


                    addStyle(detailedCSS);

                    renderMatches(data, linksDiv, tournamentId);

                } catch (error) {
                    statusDiv.className = 'api-status error';
                    statusDiv.textContent = '❌ Chyba dat';
                    apiLinkDisplay.style.display = 'none';
                }
            },
            onerror: function(error) {
                statusDiv.className = 'api-status error';
                statusDiv.textContent = '❌ API nedostupná';
                apiLinkDisplay.style.display = 'none';
            }
        });
    }

    function renderMatches(data, linksDiv, tournamentId) {
        linksDiv.innerHTML = '';

        if (!data || data.length === 0) {
            linksDiv.innerHTML = '<div style="padding: 15px; text-align: center; color: #666;">❌ Žádné zápasy</div>';
            return;
        }

        const courtGroups = groupMatchesByCourt(data);

        Object.keys(courtGroups).sort().forEach(courtName => {
            const courtDiv = document.createElement('div');
            courtDiv.className = 'court-group';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'court-title';
            titleDiv.textContent = `🎾 ${courtName} (${courtGroups[courtName].length})`;
            courtDiv.appendChild(titleDiv);

            courtGroups[courtName].sort((a, b) => {
                if (a.matchTime && b.matchTime) {
                    return new Date(a.matchTime) - new Date(b.matchTime);
                }
                return 0;
            });

            courtGroups[courtName].forEach(match => {
                if (match.code) {
                    const matchDiv = document.createElement('div');
                    matchDiv.className = 'match-item';

                    const matchApiUrl = `https://extranet-lv.bwfbadminton.com/api/match-center/vue-live-single?tmtId=${tournamentId}&matchId=${match.code}`;

                    const button = document.createElement('a');
                    button.href = matchApiUrl;
                    button.target = '_blank';
                    button.className = 'api-link-btn';

                    if (match.matchStatus === 'L') {
                        button.className += ' live';
                        button.textContent = `🔴 ${match.code}`;
                    } else {
                        button.textContent = match.code;
                    }

                    matchDiv.appendChild(button);

                    const participantsSpan = document.createElement('span');
                    participantsSpan.className = 'match-participants';
                    participantsSpan.textContent = getMatchParticipants(match);
                    matchDiv.appendChild(participantsSpan);

                    const timeSpan = document.createElement('span');
                    timeSpan.className = 'match-time';
                    const timeInfo = [];

                    const matchTime = getMatchTime(match);
                    if (matchTime) timeInfo.push(`🕐 ${matchTime}`);
                    if (match.roundName) timeInfo.push(match.roundName);

                    timeSpan.textContent = timeInfo.join(' • ');
                    matchDiv.appendChild(timeSpan);

                    courtDiv.appendChild(matchDiv);
                }
            });

            linksDiv.appendChild(courtDiv);
        });
    }

    let currentUrl = window.location.href;
    let currentContainer = null;

    function cleanup() {
        if (currentContainer && currentContainer.parentNode) {
            currentContainer.parentNode.removeChild(currentContainer);
            currentContainer = null;
        }
    }

    function init() {
        const tournamentId = extractTournamentId();
        const date = extractDate();

        if (!tournamentId || !date) {
            cleanup();
            return;
        }

        cleanup();


        const targetElement = document.querySelector('.container, .main-content, main') || document.body;

        if (targetElement) {
            const container = createApiLinksContainer();
            targetElement.insertBefore(container, targetElement.firstChild);
            currentContainer = container;


            setTimeout(() => {
                const tournamentCode = findTournamentCode();
                if (tournamentCode) {
                    fetchMatches(tournamentId, date, tournamentCode);
                } else {

                    setTimeout(() => {
                        const tournamentCode2 = findTournamentCode();
                        if (tournamentCode2) {
                            fetchMatches(tournamentId, date, tournamentCode2);
                        } else {
                            const statusDiv = container.querySelector('.api-status');
                            statusDiv.className = 'api-status error';
                            statusDiv.textContent = '❌ API nenalezena';
                        }
                    }, 1000);
                }
            }, 300);
        }
    }

    function checkUrlChange() {
        if (window.location.href !== currentUrl) {
            console.log('BWF Script: URL changed, reloading...');
            currentUrl = window.location.href;
            setTimeout(init, 500);
        }
    }

    function setupUrlListeners() {

        window.addEventListener('popstate', () => setTimeout(init, 800));


        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href*="/results/"]');
            if (link) setTimeout(checkUrlChange, 600);
        });


        setInterval(checkUrlChange, 2000);


        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(init, 800);
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(init, 800);
        };
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                init();
                setupUrlListeners();
            }, 500);
        });
    } else {
        setTimeout(() => {
            init();
            setupUrlListeners();
        }, 300);
    }

})();