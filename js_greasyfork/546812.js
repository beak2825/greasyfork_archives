// ==UserScript==
// @name         Premier League button
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Přidává tlačítka pro proklik na detail zápasů Premier League
// @author       Michal
// @match        https://www.premierleague.com/en/matches*
// @match        https://www.premierleague.com/matches*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546812/Premier%20League%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/546812/Premier%20League%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .pl-btn {
            background: #000;
            color: #fff;
            border: none;
            padding: 2px 6px;
            font-size: 9px;
            cursor: pointer;
            margin-top: 2px;
            display: block;
        }
    `;

    let apiMatches = [];
    let processedCards = new Set();
    let currentUrl = '';

    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    };

    const getUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            competition: params.get('competition') || '568',
            season: params.get('season') || '2025',
            month: params.get('month') || String(new Date().getMonth() + 1).padStart(2, '0')
        };
    };

    const buildApiUrl = ({ competition, season, month }) => {
        const year = new Date().getFullYear();
        const startDate = `${year}-${month}-01`;
        const nextMonth = month === '12' ? '01' : String(parseInt(month) + 1).padStart(2, '0');
        const nextYear = month === '12' ? year + 1 : year;
        const endDate = `${nextYear}-${nextMonth}-01`;
        
        return `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v2/matches?competition=${competition}&season=${season}&kickoff%3E${startDate}&kickoff%3C${endDate}&_limit=200`;
    };

    const fetchApiData = async () => {
        try {
            const params = getUrlParams();
            const apiUrl = buildApiUrl(params);
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('API fetch error:', error);
            return [];
        }
    };

    const getTeamNames = (card) => {
        const homeElement = card.querySelector('.match-card__team--home [data-testid="matchCardTeamFullName"]');
        const awayElement = card.querySelector('.match-card__team--away [data-testid="matchCardTeamFullName"]');
        
        return homeElement && awayElement ? {
            home: homeElement.textContent.trim(),
            away: awayElement.textContent.trim()
        } : null;
    };

    const findMatchInApi = (teamNames) => 
        apiMatches.find(match => 
            match.homeTeam.name === teamNames.home && 
            match.awayTeam.name === teamNames.away
        );

    const createButton = (matchId) => {
        const button = document.createElement('button');
        button.className = 'pl-btn';
        button.textContent = 'LIVE';
        
        const openMatch = () => window.open(`https://www.premierleague.com/en/match/${matchId}/?tab=preview`, '_blank');
        
        button.onclick = (e) => {
            e.stopPropagation();
            openMatch();
        };
        
        button.onmousedown = (e) => {
            if (e.button === 1) {
                e.preventDefault();
                e.stopPropagation();
                openMatch();
            }
        };
        
        button.onauxclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openMatch();
        };
        
        return button;
    };

    const enhanceCard = (card) => {
        if (processedCards.has(card)) return;

        const teamNames = getTeamNames(card);
        if (!teamNames) return;

        const apiMatch = findMatchInApi(teamNames);
        if (!apiMatch) return;

        processedCards.add(card);
        card.style.position = 'relative';
        card.appendChild(createButton(apiMatch.matchId));
    };

    const processCards = () => {
        const cards = document.querySelectorAll('[data-testid="matchCard"]');
        [...cards].forEach(enhanceCard);
    };

    const resetState = () => {
        processedCards.clear();
        apiMatches = [];
    };

    const handleUrlChange = async () => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            resetState();
            apiMatches = await fetchApiData();
            setTimeout(processCards, 1000);
        }
    };

    const setupUrlWatcher = () => {
        const observer = new MutationObserver(handleUrlChange);
        observer.observe(document.body, { childList: true, subtree: true });
        
        setInterval(handleUrlChange, 2000);
    };

    const setupCardWatcher = () => {
        const observer = new MutationObserver((mutations) => {
            const hasNewCards = mutations.some(mutation => 
                [...mutation.addedNodes]
                    .filter(node => node.nodeType === 1)
                    .some(node => 
                        node.getAttribute?.('data-testid') === 'matchCard' ||
                        node.querySelectorAll?.('[data-testid="matchCard"]').length > 0
                    )
            );

            if (hasNewCards) {
                setTimeout(processCards, 100);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const init = async () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        addStyles();
        currentUrl = window.location.href;
        apiMatches = await fetchApiData();
        
        setupUrlWatcher();
        setupCardWatcher();
        
        setTimeout(processCards, 1000);
        setInterval(() => apiMatches.length > 0 && processCards(), 5000);
    };

    init();

})();