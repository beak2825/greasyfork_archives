// ==UserScript==
// @name         Alook Userscript Installer Helper (Auto Install)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      GPL3
// @description  [Auto-Install Version] Helps Alook browser install scripts from GreasyFork, OpenUserJS, and any raw .user.js links. Features auto-trigger, emoji support, and run-at detection.
// @author       King1x32
// @match        *://*/*.user.js
// @icon         https://www.google.com/s2/favicons?domain=alookweb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538791/Alook%20Userscript%20Installer%20Helper%20%28Auto%20Install%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538791/Alook%20Userscript%20Installer%20Helper%20%28Auto%20Install%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Check if running on a compatible browser (Alook/Via)
    let isVia = window.via && typeof window.via.addon === "function";
    let Base64 = {encode: s=>btoa(unescape(encodeURIComponent(s))), decode: s=>decodeURIComponent(escape(window.atob(s)))};
    let zhBase64 = { // This encoding part is kept for compatibility with Alook's addon format
        encode: function (input) {
            let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            let output = "";
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            let i = 0;
            input = this.utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) { enc3 = enc4 = 64;
                } else if (isNaN(chr3)) { enc4 = 64; }
                output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        },
        utf8_encode: function(_string) {
            return _string.replace(/([\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF])/g, str => {
                return '\\u' + str.charCodeAt(0).toString(16)
            })
        }
    };

    function tryGetExec(result, idx, fallback) { if (!result || result.length < idx + 1) return fallback; else return result[idx]; }

    async function addonApp(scriptUrl) {
        try {
            let scriptContent = await (await (fetch(scriptUrl))).text();
            
            // IMPROVEMENT: Use more robust regex to capture full names/authors with spaces and special characters.
            let version = tryGetExec(/\/\/\s*@version\s*([^\s\n]*)/.exec(scriptContent), 1, "1.0");
            let author = tryGetExec(/\/\/\s*@author\s*([^\n]*)/.exec(scriptContent), 1, "unknown");
            let name = tryGetExec(/\/\/\s*@name\s*([^\n]*)/.exec(scriptContent), 1, "unknown script");

            let matchRules = scriptContent.match(/\/\/\s*@(match|include)\s*([^\s\n]*)/g);
            let match = ".*"; // Default if not found
            if (matchRules) {
                match = matchRules
                    .map(s => tryGetExec(/\/\/\s*@(match|include)\s*([^\s]*)/.exec(s), 2, ""))
                    .filter(s => s)
                    .map(s => s.replace(/\*/g, ".*")) // Use compatible replace method
                    .join("@@");
            }
            
            // IMPROVEMENT: Automatically detect the run-at time.
            let runAtValue = 2; // Default to 2 (DOMContentLoaded)
            const runAtMatch = /\/\/\s*@run-at\s*([^\s\n]*)/.exec(scriptContent);
            if (runAtMatch && runAtMatch[1].trim() === 'document-start') {
                runAtValue = 1; // Set to 1 for earliest execution
            }

            let codeStr = Base64.encode(`(function (){${scriptContent}})();`);
            var appJson = {
                author: author.trim(),
                id: "1", // Alook seems to ignore this, so "1" is fine.
                runat : runAtValue,
                version : version.trim(),
                name: name.trim(),
                url: match,
                code: codeStr,
            };
            var appStr = JSON.stringify(appJson);
            var addon_result = zhBase64.encode(appStr);

            window.via.addon(addon_result);
        } catch (error) {
            alert("An error occurred while preparing the script: " + error);
            console.error(error);
        }
    }

    function FindAndCreateInstallBtn(selectStr) {
        let installBtn = document.querySelector(selectStr);
        if (!installBtn) return false;

        var button = document.createElement("a");
        button.append(isVia ? "Install for Alook" : "Browser not supported");
        button.className = installBtn.className;
        button.style.color = "black";
        button.style.background = "lightgreen";
        button.style.marginLeft = "10px";
        button.href = "javascript:void(0);"; // Prevent navigation

        // IMPROVEMENT: No more confirmation prompt. Install directly.
        button.onclick = () => {
            if (isVia) {
                addonApp(installBtn.href);
            }
        };
        installBtn.parentNode.insertBefore(button, installBtn.nextSibling);
        return true;
    };

    // --- MAIN CONTROLLER ---
    if (!isVia) return; // Exit if not on a compatible browser

    // If it's a raw .user.js page, trigger installation automatically on load.
    if (location.href.endsWith('.user.js')) {
        // Wait for the body to be sure the page content (the script text) is loaded.
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            addonApp(location.href);
        } else {
            window.addEventListener('DOMContentLoaded', () => addonApp(location.href));
        }
    } else {
        // If it's a script repository site, find the existing install button and add our own.
        let targets = [
            "a.install-link", // Greasy Fork
            "a.btn.btn-info[type='text/javascript']", // OpenUserJS
        ];
        for (let i = 0; i < targets.length; ++i) {
            if (FindAndCreateInstallBtn(targets[i])) break;
        }
    }

})();