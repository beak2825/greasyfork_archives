// ==UserScript==
// @name         Utilify Webpack
// @namespace    discord.gg/C2ZJCZXKTu
// @version      1.1
// @description Gentle Webpack for Utilify development. 
// @author       Vin
// @match        *://www.kogama.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505595/Utilify%20Webpack.user.js
// @updateURL https://update.greasyfork.org/scripts/505595/Utilify%20Webpack.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        return date.toLocaleString('en-GB', options);
    }

    function webpackInjected() {
        console.log("%cWebpack Injected Successfully! 🎉", "color: #FF69B4; font-weight: bold; font-size: 16px;");
    }

    function getSelfCSS() {
        const styles = Array.from(document.styleSheets)
            .filter(sheet => !sheet.href || sheet.href.startsWith(window.location.origin))
            .reduce((acc, sheet) => {
                try {
                    const rules = Array.from(sheet.cssRules);
                    rules.forEach(rule => {
                        if (rule instanceof CSSStyleRule) {
                            acc.push(rule.cssText);
                        }
                    });
                } catch (e) {
                    console.warn('Could not access CSS rules from stylesheet:', e);
                }
                return acc;
            }, []);

        return styles;
    }

    function displaySelfCSS(styles) {
        console.groupCollapsed("%cCustom CSS Styles", "color: #FFB6C1; font-weight: bold; font-size: 14px;");
        styles.forEach((cssText, index) => {
            console.groupCollapsed(`%cStyle ${index + 1}`, "color: #FF69B4; font-weight: bold; font-size: 12px;");
            console.log(`%c${cssText}`, "color: #FFF;");
            console.groupEnd();
        });
        console.groupEnd();
    }

    function reloadUtilify() {
        console.clear();
        webpackInjected();
        Object.keys(window.utilify).forEach(command => {
            if (typeof window.utilify[command] === 'function') {
                console.log(`%cModule ${command} has been reloaded & injected`, "color: #32CD32; font-weight: bold;");
            }
        });
    }

    window.utilify = {
        finduser: function(UID) {
            const url = `https://www.kogama.com/profile/${UID}`;
            fetch(url, { method: 'GET' })
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const scripts = Array.from(doc.getElementsByTagName('script'));
                    let userData = null;

                    scripts.forEach(script => {
                        const content = script.innerHTML;
                        if (content.includes('options.bootstrap')) {
                            const match = content.match(/options\.bootstrap\s*=\s*(\{[\s\S]*?\});/);
                            if (match && match[1]) {
                                try {
                                    userData = JSON.parse(match[1]);
                                } catch (e) {
                                    console.error('Error parsing user data:', e);
                                }
                            }
                        }
                    });

                    if (userData && userData.object) {
                        const obj = userData.object;
                        console.groupCollapsed(`%cUser Data for UID: ${UID}`, "color: #D8BFD8; font-weight: bold; font-size: 14px;");
                        console.log("%cUsername: %c" + obj.username, "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cDescription: %c" + obj.description, "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cLevel: %c" + obj.level, "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cXP: %c" + obj.xp, "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cLevel Progress: %c" + obj.level_progress + "%", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cGold: %c" + obj.gold, "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cSilver: %c" + obj.silver, "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cRanking: %c" + obj.leaderboard_rank, "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cFriends: %c" + (obj.friend_count > 0 ? obj.friend_count : "Anti-social :("), "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cLast Online: %c" + formatTimestamp(obj.last_ping), "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.log("%cAccount Created: %c" + formatTimestamp(obj.created), "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
                        console.groupEnd();
                    } else {
                        console.log("%cNo user object data found for UID:", "color: #F44336; font-weight: bold;", UID);
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch user data:", error);
                });
        },
        credits: function() {
            console.groupCollapsed("%cUtilify Credits", "color: #D8BFD8; font-weight: bold; font-size: 14px;");
            console.log("%cMain Developer: %cSimon", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.log("%cLogistics: %cAwoi, v7xp", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.log("%cBug Hunters: %cUXNU, TUNA, RAPTOR, FLAVIUS", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.log("%cAdditional Credits: %cSNOWY, IDEALISM", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.log("%cWebpackVersion: %c1.1", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.log("%cDate: %cAugust 2024", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.groupEnd();
        },
        discord: function() {
            console.groupCollapsed("%cJoin Us on Discord", "color: #D8BFD8; font-weight: bold; font-size: 14px;");
            console.log("%cDiscord Invite: %cAVAILABLE_SOON", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.groupEnd();
        },
        webpack: function() {
            console.groupCollapsed("%cWebpack Status", "color: #D8BFD8; font-weight: bold; font-size: 14px;");
            console.log("%cWebpack Status: %cReady", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.groupCollapsed("%cAvailable Commands", "color: #D8BFD8; font-weight: bold; font-size: 12px;");
            console.log("%cutilify.finduser(UID): %cFetches and displays user data for the given UID", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.log("%cutilify.credits(): %cDisplays credits and acknowledgments", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.log("%cutilify.discord(): %cShows the Discord invite link", "color: #FFB6C1; font-weight: bold;", "color: #E6E6FA;");
            console.groupEnd();
            console.groupEnd();
        },
        wemetinseptember: function() {
            console.groupCollapsed("%cSpecial Message", "color: #D8BFD8; font-weight: bold; font-size: 14px;");
            console.log("%cThis command is meant for somebody awesome. If you found it, you are either the one I aim for or someone that just knows a lot. Either way, I hope you're okay. I will always be willing to help you out! You will always matter even if you hate the fact I breathe.", "color: #FFB6C1; font-weight: bold;");
            console.groupEnd();
        },
        selfCSS: function() {
            const styles = getSelfCSS();
            displaySelfCSS(styles);
        },
        reload: reloadUtilify // New reload command
    };

    setTimeout(() => {
        console.clear();
    }, 2500);
    setTimeout(() => {
        webpackInjected();
    }, 4100);

})();
