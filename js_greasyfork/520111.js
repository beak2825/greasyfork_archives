// ==UserScript==
// @name         Greasyfork Update Checks
// @description  Display today's script installations and update checks.
// @icon         https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @version      1.8
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://greasyfork.org/*
// @match        https://sleazyfork.org/*
// @grant        GM_xmlhttpRequest
// @connect      api.greasyfork.org
// @connect      api.sleazyfork.org
// @downloadURL https://update.greasyfork.org/scripts/520111/Greasyfork%20Update%20Checks.user.js
// @updateURL https://update.greasyfork.org/scripts/520111/Greasyfork%20Update%20Checks.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
    function displayScriptStats() {
        document.head.appendChild(Object.assign(document.createElement('style'), {
            textContent: '.script-list-installs, .script-list-update-checks { opacity: 1; }'
        }));
  
        function addStat(element, label, className) {
            const list = element.querySelector('.inline-script-stats');
            if (!list) return;
  
            const dt = document.createElement('dt');
            const dd = document.createElement('dd');
  
            dt.className = className;
            dd.className = className;
            dt.textContent = label;
            dd.textContent = '...';
  
            list.lastElementChild.parentNode.insertBefore(dt, list.lastElementChild.nextSibling);
            dt.after(dd);
  
            return dd;
        }
  
        document.querySelectorAll('li[data-script-id]').forEach(script => {
            const installsElement = addStat(script, 'Installs', 'script-list-installs');
            const checksElement = addStat(script, 'Checks', 'script-list-update-checks');
  
            script.dataset.installsElement = installsElement.id = `installs-${script.dataset.scriptId}`;
            script.dataset.checksElement = checksElement.id = `checks-${script.dataset.scriptId}`;
        });
    }
  
    const collectScriptIds = () => 
        Array.from(document.querySelectorAll('li[data-script-id]'))
            .map(el => ({
                scriptId: el.getAttribute('data-script-id'),
                element: el
            }));
    
    function getCurrentLanguage() {
        const pathMatch = window.location.pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
        if (pathMatch) {
            return pathMatch[1];
        }
        
        return document.documentElement.lang || 'en';
    }
  
    function fetchStats(scriptInfo) {
        return new Promise((resolve) => {
            const domain = window.location.hostname.includes('sleazyfork') ? 'sleazyfork.org' : 'greasyfork.org';
            const language = getCurrentLanguage();
            const apiUrl = `https://api.${domain}/${language}/scripts/${scriptInfo.scriptId}/stats.json`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                responseType: 'json',
                onload: function(response) {
                    try {
                        const data = response.response;
                        
                        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
                            resolve({ installs: 0, checks: 0 });
                            return;
                        }
                        
                        const dates = Object.keys(data).sort();
                        const latestDate = dates[dates.length - 1];
                        
                        if (!data[latestDate] || typeof data[latestDate] !== 'object') {
                            resolve({ installs: 0, checks: 0 });
                            return;
                        }
                        
                        const stats = {
                            installs: data[latestDate].installs || 0,
                            checks: data[latestDate].update_checks || 0
                        };
                        
                        resolve(stats);
                    } catch (error) {
                        console.error(error);
                        resolve({ installs: 0, checks: 0 });
                    }
                },
                onerror: function(error) {
                    console.error(error);
                    resolve({ installs: 0, checks: 0 });
                }
            });
        });
    }
  
    function updateStats(scriptInfo, stats) {
        if (!stats) return;
  
        const element = scriptInfo.element;
        const installsElement = document.getElementById(element.dataset.installsElement);
        const checksElement = document.getElementById(element.dataset.checksElement);
  
        if (installsElement) installsElement.textContent = formatNumber(stats.installs);
        if (checksElement) checksElement.textContent = formatNumber(stats.checks);
    }
  
    async function init() {
        displayScriptStats();
        const scriptInfos = collectScriptIds();
  
        const fetchPromises = scriptInfos.map(async (scriptInfo) => {
            try {
                const stats = await fetchStats(scriptInfo);
                updateStats(scriptInfo, stats);
            } catch (error) {
                console.error(error);
                updateStats(scriptInfo, { installs: 0, checks: 0 });
            }
        });
  
        await Promise.all(fetchPromises);
    }
  
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();