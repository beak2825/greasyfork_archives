// ==UserScript==
// @name         Pocket Waifu Coin Hack
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1.6
// @description  Please Enjoy! Also using this script may get you banned, I am working on mitigating that
// @author       ZenbladeJS
// @match        https://osapi.nutaku.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537958/Pocket%20Waifu%20Coin%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/537958/Pocket%20Waifu%20Coin%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const developerMode = false;

    // Base URLs
    const DEV_BASE = 'http://127.0.0.1:5500/';
    const PROD_BASE = 'https://raw.githubusercontent.com/ZenbladeJS/webScripts/main/';

    // Globals
    const systemGlobal = {}
    const global = {}
    global.symbol = Symbol("global")
    systemGlobal.log = function(data, ...rest) {
        console.log('[Web Scripts] ' + data, ...rest);
    };
    const log = systemGlobal.log;
    global.failedScripts = []; // track failed scripts

    // Scripts to load
    const systemScripts = [
        { name: 'Script Manager', file: 'scriptManager.js' },
        { name: 'User Script List', file: 'userScriptList.js'}
    ]
    systemGlobal.userScripts = []

    // State
    let isScriptLoaded = {};

    // Fetch Script Variables
    const maxRetries = 3;
    let systemScriptsLoaded = 0;
    let userScriptsLoaded = 0;
    let needsReload = false;

    // Eval one cached script
    const evalSystemScript = ({script}) => {
        eval('({systemGlobal, global}) => {' + script + '}')({systemGlobal, global});
    }
    systemGlobal.evalUserScript = (script) => {
    }
    const evalCachedScript = function(script, isSystemScript = false) {
        const cachedScript = localStorage.getItem(script.name);
        if (isScriptLoaded[script.name]) return;
        if (!cachedScript) return log('[' + script.name + '] No cached script found to evaluate.');

        log('Evaluating cached script for ' + script.name + '...');
        try {
            if (isSystemScript) {
                evalSystemScript({name: script.name, file: script.file, script: cachedScript});
            } else {
                systemGlobal.evalUserScript({name: script.name, file: script.file, script: cachedScript})
            }
            isScriptLoaded[script.name] = true;
            log(script.name + ' Loaded!');
        } catch (e) {
            log('Error evaluating cached script for ' + script.name + ':', e);
        } 
    };

    

    // Fetch script
    const checkIfScriptsLoaded = (isSystemScript) => {
        isSystemScript ? systemScriptsLoaded++ : userScriptsLoaded++
        if (isSystemScript ? systemScriptsLoaded === systemScripts.length : userScriptsLoaded === systemGlobal.userScripts.length) {
            // All fetches done!
            if (needsReload) {
                log((isSystemScript ? 'System' : 'User') + ' scripts updated → reloading page...');
                location.reload();
            } else {
                log('All scripts up to date!');
            }
        }
    }
    const fetchScript = function(script, isSystemScript = false) {
        const url = (developerMode ? DEV_BASE : PROD_BASE) + script.file;
        const xhr = new XMLHttpRequest();
        xhr[global.symbol] = true;
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
    
        xhr.onload = function() {
            if (xhr.status !== 200) {
                log('Failed to fetch script ' + script.name + ':', xhr.status, xhr.statusText);
            } else {
                const newScript = xhr.responseText;
                const cachedScript = localStorage.getItem(script.name);
    
                if (cachedScript !== newScript) {
                    localStorage.setItem(script.name, newScript);
                    log('Updated cached script for ' + script.name);
                    needsReload = true; // mark reload needed
                }
            }
    
            checkIfScriptsLoaded(isSystemScript)
        };
    
        xhr.onerror = function() {
            script._retryCount++;
            if (script._retryCount <= maxRetries) {
                log('ERROR during fetch for ' + script.name + ' (attempt ' + script._retryCount + '), retrying...');
                setTimeout(() => fetchScript(script), 1000); // retry after 1 sec
            } else {
                log(script.name + ' FAILED to load after ' + maxRetries + ' retries!');
                global.failedScripts.push(script.name);
        
                checkIfScriptsLoaded(isSystemScript)
            }
        };
    
        xhr.send();
    };

    // Kickoff
    log('Script Loader initializing...');
    systemScripts.forEach(script => {
        script._retryCount = 0;
        evalCachedScript(script, true);
        fetchScript(script, true);
    });
    
    systemGlobal.userScripts.forEach(script => {
        script._retryCount = 0;
        evalCachedScript(script, false);
        fetchScript(script, false);
    });

})();