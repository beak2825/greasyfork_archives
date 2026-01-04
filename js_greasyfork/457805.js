// ==UserScript==
// @name        PCI+ DEVELOPMENT
// @version     1.16.0
// @author      thisisausername190
// @description Improve your tower mapping experience!
// @grant       none
// @run-at      document-start
// @include     https://*.cellmapper.net/*
// @include     https://*.antennasearch.com/*
// @include     https://*.google.com/maps*
// @include     https://*.bing.com/maps*
// @namespace   thisisausername190
// @license     NA
// @downloadURL https://update.greasyfork.org/scripts/457805/PCI%2B%20DEVELOPMENT.user.js
// @updateURL https://update.greasyfork.org/scripts/457805/PCI%2B%20DEVELOPMENT.meta.js
// ==/UserScript==
(() => {
    "use strict";
    var __webpack_modules__ = {
        943: (__unused_webpack_module, exports) => {
            var __webpack_unused_export__;
            __webpack_unused_export__ = {
                value: true
            };
            exports.a = void 0;
            const capitalACharCode = "A".charCodeAt(0);
            const capitalZCharCode = "Z".charCodeAt(0);
            const isUpper = (input, index) => {
                const charCode = input.charCodeAt(index);
                return capitalACharCode <= charCode && capitalZCharCode >= charCode;
            };
            const toKebabCase = camelCased => {
                let kebabCased = "";
                for (let i = 0; i < camelCased.length; i++) {
                    const prevUpperCased = i > 0 ? isUpper(camelCased, i - 1) : true;
                    const currentUpperCased = isUpper(camelCased, i);
                    const nextUpperCased = i < camelCased.length - 1 ? isUpper(camelCased, i + 1) : true;
                    if (!prevUpperCased && currentUpperCased || currentUpperCased && !nextUpperCased) {
                        kebabCased += "-";
                        kebabCased += camelCased[i].toLowerCase();
                    } else {
                        kebabCased += camelCased[i];
                    }
                }
                return kebabCased;
            };
            const escapeAttrNodeValue = value => value.replace(/(&)|(")|(\u00A0)/g, (function(_, amp, quote) {
                if (amp) return "&amp;";
                if (quote) return "&quot;";
                return "&nbsp;";
            }));
            const attributeToString = attributes => name => {
                const value = attributes[name];
                const formattedName = toKebabCase(name);
                const makeAttribute = value => `${formattedName}="${value}"`;
                if (value instanceof Date) {
                    return makeAttribute(value.toISOString());
                } else switch (typeof value) {
                  case "boolean":
                    if (value) {
                        return formattedName;
                    } else {
                        return "";
                    }

                  default:
                    return makeAttribute(escapeAttrNodeValue(value.toString()));
                }
            };
            const attributesToString = attributes => {
                if (attributes) {
                    return " " + Object.keys(attributes).filter((attribute => attribute !== "children")).map(attributeToString(attributes)).filter((attribute => attribute.length)).join(" ");
                } else {
                    return "";
                }
            };
            const contentsToString = contents => {
                if (contents) {
                    return contents.map((elements => Array.isArray(elements) ? elements.join("\n") : elements)).join("\n");
                } else {
                    return "";
                }
            };
            const isVoidElement = tagName => [ "area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr" ].indexOf(tagName) > -1;
            function createElement(name, attributes = {}, ...contents) {
                const children = attributes && attributes.children || contents;
                if (typeof name === "function") {
                    return name(children ? {
                        children,
                        ...attributes
                    } : attributes, contents);
                } else {
                    const tagName = toKebabCase(name);
                    if (isVoidElement(tagName) && !contents.length) {
                        return `<${tagName}${attributesToString(attributes)}>`;
                    } else {
                        return `<${tagName}${attributesToString(attributes)}>${contentsToString(contents)}</${tagName}>`;
                    }
                }
            }
            exports.a = createElement;
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        __webpack_require__.g = function() {
            if (typeof globalThis === "object") return globalThis;
            try {
                return this || new Function("return this")();
            } catch (e) {
                if (typeof window === "object") return window;
            }
        }();
    })();
    var __webpack_exports__ = {};
    (() => {
        function calculateDistance(lat1, lon1, lat2, lon2, forceMetric) {
            function toRad(Value) {
                return Value * Math.PI / 180;
            }
            var R = 6371;
            var dLat = toRad(lat2 - lat1);
            var dLon = toRad(lon2 - lon1);
            lat1 = toRad(lat1);
            lat2 = toRad(lat2);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            const kilometers_to_miles = .6214;
            if (window.pciPlus_distanceUnit === "km" || forceMetric) {
                return d;
            } else {
                return d * kilometers_to_miles;
            }
        }
        function copyToClipboard(text) {
            if (window.location.href.includes("cellmapper") && isMobileDevice && window.CMApp == undefined) {
                navigator.share({
                    title: "CellMapper",
                    text
                });
            } else if (navigator?.clipboard?.writeText != undefined) {
                navigator.clipboard.writeText(text);
            } else {
                var dummy = document.createElement("textarea");
                document.body.appendChild(dummy);
                dummy.value = text;
                dummy.select();
                document.execCommand("copy");
                document.body.removeChild(dummy);
            }
        }
        function genNodeTitle(netType) {
            let title;
            if (netType == "NR") {
                title = "gNB";
            } else if (netType == "LTE") {
                title = "eNB";
            } else if (netType == "UMTS") {
                title = "NB";
            } else if (netType == "GSM") {
                title = "BTS ID";
            } else if (netType == "CDMA") {
                title = "Base";
            }
            return title;
        }
        function getLatLngCenter(latLngInDegr) {
            function rad2degr(rad) {
                return rad * 180 / Math.PI;
            }
            function degr2rad(degr) {
                return degr * Math.PI / 180;
            }
            var LATIDX = 0;
            var LNGIDX = 1;
            var sumX = 0;
            var sumY = 0;
            var sumZ = 0;
            for (var i = 0; i < latLngInDegr.length; i++) {
                var lat = degr2rad(latLngInDegr[i][LATIDX]);
                var lng = degr2rad(latLngInDegr[i][LNGIDX]);
                sumX += Math.cos(lat) * Math.cos(lng);
                sumY += Math.cos(lat) * Math.sin(lng);
                sumZ += Math.sin(lat);
            }
            var avgX = sumX / latLngInDegr.length;
            var avgY = sumY / latLngInDegr.length;
            var avgZ = sumZ / latLngInDegr.length;
            var lng = Math.atan2(avgY, avgX);
            var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
            var lat = Math.atan2(avgZ, hyp);
            return [ rad2degr(lat), rad2degr(lng) ];
        }
        function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
            var targetNodes, btargetsFound;
            if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt); else targetNodes = $(iframeSelector).contents().find(selectorTxt);
            if (targetNodes && targetNodes.length > 0) {
                btargetsFound = true;
                targetNodes.each((function() {
                    var jThis = $(this);
                    var alreadyFound = jThis.data("alreadyFound") || false;
                    if (!alreadyFound) {
                        var cancelFound = actionFunction(jThis);
                        if (cancelFound) btargetsFound = false; else jThis.data("alreadyFound", true);
                    }
                }));
            } else {
                btargetsFound = false;
            }
            var controlObj = waitForKeyElements.controlObj || {};
            var controlKey = selectorTxt.replace(/[^\w]/g, "_");
            var timeControl = controlObj[controlKey];
            if (btargetsFound && bWaitOnce && timeControl) {
                clearInterval(timeControl);
                delete controlObj[controlKey];
            } else {
                if (!timeControl) {
                    timeControl = setInterval((function() {
                        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                    }), 300);
                    controlObj[controlKey] = timeControl;
                }
            }
            waitForKeyElements.controlObj = controlObj;
        }
        var ppDeveloperMode = __webpack_require__.g.ppDeveloperMode;
        var devLogger = __webpack_require__.g.devLogger;
        function initDevUtils() {
            if (window.location.href.includes("cellmapper.net")) {
                ppDeveloperMode = isDeveloperMode();
                devLogger = returnDevLogger();
            }
        }
        function isDeveloperMode() {
            if (!window.location.href.includes("cellmapper.net")) {
                return;
            }
            if (window.CMApp !== undefined) {
                return true;
            }
            return window.getParamOrCookie("pciPlus_developmentInstance") === true;
        }
        function returnDevLogger() {
            if (!window.location.href.includes("cellmapper.net")) {
                return;
            }
            if (ppDeveloperMode) {
                console.log("[PCI+] Operating in developer mode.");
                return console.log;
            } else {
                return () => {};
            }
        }
        async function getUser(uid) {
            const {API_URL, handleResponse} = window;
            if (uid == 40859) {
                window.userCache[uid] = {
                    id: 40859,
                    premium: false,
                    totalPoints: 1011154,
                    totalCells: 1158,
                    totalLocatedTowers: 446,
                    userName: "5Giscold⁺"
                };
            } else if (window.userCache[uid] !== undefined) {} else {
                const userInfoReqParams = {
                    UID: String(uid)
                };
                let userRes = await fetch(API_URL + "getUserInfo?" + new URLSearchParams(userInfoReqParams), {
                    credentials: "include"
                });
                let userData = handleResponse(await userRes.json());
                window.userCache[uid] = {
                    id: uid,
                    premium: userData.premium,
                    totalCells: userData.totalCells,
                    totalLocatedTowers: userData.totalLocatedTowers,
                    totalPoints: userData.totalPoints,
                    userName: userData.userName
                };
            }
            return window.userCache[uid];
        }
        function changeStatusIcon(flip) {
            if (window.userID != 145674) {
                return;
            }
            const cmgmUrl = "data:image/png;base64, AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAL8OAAC/DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM3I3gDSzOADoJbHP5qSwTK7vMoYt7fIGZeOwDqYjsM4////AKulygAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqpPdAK6Z3SiBX9DaaUTD6HBTwNNsTsDTYDvA7GxRvNCinMUinJPEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALqu3QD//+YAm3rehnE23/9YFdr/UhPT/0wP0f9HCdD/TyLC/31su3sAAIgAsa3KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuZ3pALyi6BmgdOfUfD7m/2If3/9WE9r/Tg3W/0oL0/9QGc//d1nGysC70hO4rtQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBou0AwaPtDLWL7XCpeu29m2nq6IxW5u6ETuPvg1Dh4ola4bGbed9aw7zaBryu3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADZ0O0A7v3pAMmu7QrAn+4puJHsLriT7C7DpO4k4Mr0Bv///wD//f4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALmx0wC/ttUCmYzGPpuRwjPI0MwHZF2VAP///wAAAAAAAAAAAP//6wD///8Aw8XMCpGHvziWi8M92t3aAamiyQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAp43eAK2W3i+EXtThcErI63ddwK6Gc7+Ainu+UYJ0uTh/crg5iHq+VX1rvYRqUbu4VjW772RLudeZkMEikYbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALmm3gD//9kCnnrgkX8/5/9rJOP/YybY/2Itz/9fMMj5XjLF9VovwvVUKMP6TB3F/z8Nxv80BMb/Px26/3douYH///8ArKXKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvqPoAL+m5yCleOnajErt/3Ut6P9nH+T/Xxjg/1gT3P9RD9j/SwrU/0UG0f8+A8//OAHL/zMDx/8+FcX/cFbEyr210RKuo9EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADCo+4Aw6buCbSK7V2tfu69oGru7Y1R6v58POb/bSzh/2Eh3P9aG9n/VhrW/1cd1f9dKNX9aDnW5X1W2q+Xd95Ox8DXA7Wl2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADMt+0A7vfyAMKk6w25k+0zs4rtZqp87Iuic+qjoHHpvpxt572VZuWhmWzkiKJ65l6tiugpzrTwCLiW6gD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK2lzAC2r88ElIbFR5eMwjvBxsoJc3G2AP//4QAAAAAA4dDyAOHR8gXezfIM5NTzDPHl9wTv4vcAAAAAAP//6QBqXa0AvLbLC4t/vUKOg79JzsvXA7GqzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr5ThALWd4jGRatvld0/N73xhw7aIeL9pmJDAMbS0xxP//8sC///uAf//6QD///EA///7Aenq1QSzsMgYkYa+M3lqum5fTre6RTC081hJs+Kak8Itjoa/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL6q4gD//6sBtZPoiqRt8f+EQe3/cTHg/2w50v1uRcntcU/DzHRYv618ZL+bgGu/k35pv5N1X7yeaU+6sGRHvNVTM7vuPh67/iYMuf8VBLf/Jxuw/25ltYr///8BqaHJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwKLqAMKp5gy9l/DCtIH2/5dZ8v98Me3/cyfp/2sj5P9jId3/XyDW/1og0f9WH83/URvL/0sVyf9ED8n/PAjJ/zIDxv8lAcH/GgG7/xQEuP8nF7r/ZFG+wrOmxwyWiMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGpPEAyavuAcWh8jrDnfSeuIv04Jth8PyGQu3/di/p/2oj5P9hGuD/WBPd/1EO2f9LCtX/RQbS/z8Ez/87BMz/NwfI/zgQxv9CIsj+VTnN5W5T1J+Nctk60MbHAZ+L0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzLLvAM256QTHp/Ajt4/ucqx97bSibe3YlV7r7otR5/x/ROT/djri/3A13v9tNdz/bTfa+W872ul4StvTglndqJFt4GmsjOcs177yBMuw7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALyr3wDFs+YEqJbSU6WZzEa+wM0MWDe1APX83QAAAP8A0b3sB7+e7Bq6le0zuZPtWrCH62Wqf+plqH3qZayE6mWxjOpSsYrqKcip7xfp2fkEwZjuAODa3QD///8At6/LFIZ8u1aLgr5Yz8rYBLWvzgAAAAAAAAAAAAAAAAAAAAAAtprjALqh4y2pgubimnXc9JuC0bqhkMxkraXKJ8THyweSjsYA///IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///qAP///wDGw80MmJDBNHNpt3JXULHKNDCs+UxGruaXjsEyiH+8AAAAAAAAAAAAAAAAAMGu5ADY8c8CtpXpkbB79/+pbvn/n2vt/5hv4P2WdtbjmH/QsJ2KzYGSgsRMlIrAOqWfxSqioMAYmpm4EZmYuBGhncAYo53FK5CFvzt+brtVdmS6j15NtrxHOLPtKB6v/g8QrP8GFKn/Hyan/2pjs5P///8Cq6XLAAAAAAAAAAAAw6brAMOq6BHAmvHKu4j6/7F4+/+pb/n/o2n2/51l8f+XZOn/kmXh/oNa1vptQ8rxa0TF5WlFwtdnRb/RZEO+0WE/vtddOr7lVDC+80givfs4Frz/JQu6/xQEtv8GA7H/Agis/wgVqv8iJrL/Y1S9xrWmzRCgk8oAAAAAAAAAAADLrPIAzbHyAsek8jfFn/STwZf34LmJ+Pyveff/pWz1/51j8v+WXvD/jlbr/3U15P9fGt3/WBbY/1IT1f9ND9L/RwvP/0AGzf85A8v/MAHG/yUBwf8bArz/FQW4/xkNt/8rIrz8Sj/F4G1b0ZSUe9s24tLbAbGe2wAAAAAAAAAAAAAAAAAAAAAAyK3uAM/A6wPHqfElxaHyYsKa9KW8kPXas4T0+Kl38v6fa+//kFfq/3Av4/9fG97/VhTZ/08P1v9KDNP/RgvR/0QNz/9DEsz/RR3K/00ry/leP9DlbVDUrYRp2mipjeUm8tP8A9ex8wAAAAAAAAAAAAAAAADEsOcFpI7TWaGRy024tcsP////APP03ABsAP8AzrrqBMip8B7FpPFIwp3yc76W8pa6kfHApnfsy5Jd59mOWeboiVTk6INP4diDT+DNi1vhyY9j4aqRaeF5nHfjSraU6yjhw/cHAAC2APv56wD///8AqJ3FFXx0uWR9c7hdx7/SBbqg4zqsg+jmnXXg9ZuA08GhkM1vq6PKJ8vRygYAAAAA+//YAAAAAADg0/EA4dTxA9fB8QrPs/EMxaTvHMSk7y3Epe4txaXvHMmm8A/Xu/MM8uT7Bv///wD///8A/vz2AP///wHVy9IIkoi+MXBotXxLSKzJLTCo/EdErOmUi8BAt5XprLN9+f+vdP3/qHHz/55x5P2ZeNjimoLQqZ2My2Wmmsk2tLDKFtPjyAXx/9gB7fvWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPr/1gD//+QD3ODOB6iixB6If7tAc2m2eFlRsbk6OKvnISqn/wwipP8FH6T/HCel/2hhs7DBnPLgvo36/7d//f+ydv7/rnH8/6du9v+fbO3/mW3i/JZz2fCVd9PPmoLQuZqFzY2ZhcptopLMaaaZzVmonM5YpprNWJOFw2SBcrxudWO5d3pnvqdlULi8UkC12jwtsvQlHK/+ERGt/wcVqP8DHqT/AiGi/wkhpv8lKbP/aVrB5Mel8jLFn/SCw5n21b6O+fu3gfv/r3b7/6lu+f+jafb/nmTy/5hi7f+TYef/j2Di/41h3f+LYtr+iWHY+4Zg1fuDXtX7b0jN/VQnxP9GGsL/PRLB/zAMvv8gBrv/EQO2/wUCsf8CCKz/BxWp/xMirP8rMbb8TEPE1nBd0oOcg+Azya7vAMq07QHHp/AbxaHyXcOb9ai/k/fguYj4+rB79/+nb/X/n2bz/5hf8P+RWu3/jFXq/4dQ5/+CTOX/fUni/3lG4P9xQN3/WyXV/z0GzP8vAMb/JgLB/x4EvP8bCbr/IRO6/zAmvvxIPcTkZVXOsIZu2mepi+Uc+9T8Ac+u7wAAAAAAAAAAAAAAAADIre4AyK7uBcen8CLGovJYw53zlb2T9Le3ivPdsILy86h38P2gbe39mGXr/pJe6P+KV+X/hVPj/4BP4f94Rt3/ZC/X/lko0v1dM9L4Yj3S4m1M1cV8W9majW7eW6eJ5Sjdu/QItZPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN7Y6AC8jfUAzrXvC8mq8SLHp/JMwp3xY76W8Wq8lfCOuJDvnbSL7aGxiOywrYLroauB6p2le+iOnnPmZ62H6Ve2kOsp0rHzEf/+/wHz5PsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//Af///wD///8A///+AH///gB///+B///4fh//+AAf//AAH//wAA//8AAP//wAP//Dw8P/wBgD/4AAAf+AAAH/gAAB/+AAB/4cADh+A//AfAAAADwAAAA8AAAAPwAAAPDgAAcAHgBwAAD/AAAAAAAAAAAACAAAAB8AAAD/8AAH8=";
            const cmUrl = "images/logo.png";
            const logo = document.querySelector('[alt="Cellmapper Logo"]');
            devLogger("Switching logo:", logo);
            if (!logo) {
                return;
            }
            if (flip) {
                logo.src = cmgmUrl;
            } else {
                logo.src = cmUrl;
            }
        }
        function hookSidebarAccount() {
            function userHistoryCallback() {
                devLogger("hookSidebarAccount callback activated");
                let usernameNode = document.querySelector("#accountTable > tbody > tr:nth-child(1) > td > a");
                usernameNode.onclick = () => {
                    window.getUserHistory(window.userID, 0);
                    return false;
                };
                if (window.userID === 145674) {
                    if (window.pciPlus_enableCmgmIntegration || $.cookie("pciPlus_enableCmgmIntegration") === "true") {
                        changeStatusIcon(true);
                    }
                }
                if (window.userID === 64479) {
                    let measureButton = document.getElementById("measureButton");
                    if (measureButton != undefined) {
                        measureButton.innerHTML = "M";
                        measureButton.title = "Fine... I relent.";
                    }
                }
                const premiumIcon = '<span class="premiumIndicator" style="color: gold;">&#x2605;</span>';
                if (window.userID != undefined && window.userID != null) {
                    getUser(window.userID).then((user => {
                        devLogger("found user:", user, "for userid", window.userID);
                        if (user.premium == true) {
                            const marketingTableItem = $('.collapsableSection:contains("Marketing")').parent().parent();
                            if (marketingTableItem[0]) {
                                devLogger("Found 'Marketing' table row, even though user is premium; removing");
                                marketingTableItem.remove();
                            }
                            let name = user.userName;
                            let sidebarEl = $("#accountTable > tbody > tr").find(`a:contains('${name}')`);
                            if (!sidebarEl[0].innerHTML.includes("premiumIndicator")) {
                                sidebarEl[0].innerHTML += premiumIcon;
                            }
                            let topBarEl = $("#account");
                            if (topBarEl[0] !== null && !topBarEl[0].innerHTML.includes("premiumIndicator")) {
                                $("#account")[0].innerHTML += premiumIcon;
                            }
                        }
                    }));
                }
            }
            waitForKeyElements("#accountTable > tbody > tr:nth-child(1) > td > a", userHistoryCallback);
        }
        var src_elements = __webpack_require__(943);
        function textToHtml(input) {
            return $.parseHTML(input)[0];
        }
        function genTooltip(title) {
            title = title.replaceAll("\n", "<br/>");
            return src_elements.a("a", {
                href: "#",
                "data-html": "true",
                "data-toggle": "tooltip",
                "data-placement": "left",
                title
            }, "⁺");
        }
        function clearCoverage(unselectTower, forceFullRemove) {
            let {currentSite, netType, MCC, MNC, map, getTowersInView, getNetworkTitle, select_interaction} = window;
            window.MainCoverageLayer.getLayers().array_ = [];
            if (forceFullRemove) {
                for (let layer of [ ...map.getLayers().getArray() ]) {
                    try {
                        if (layer.values_.type === "CoveragePolygonLayer") {
                            map.removeLayer(layer);
                        }
                    } catch {}
                }
            }
            map.removeLayer(window.MainCoverageLayer);
            map.addLayer(window.MainCoverageLayer);
            window.towersInMainCoverageLayer = [];
            if (window.CoveragePolygonLayer != null) {
                window.CoveragePolygonLayer.getSource().clear();
            }
            if (unselectTower) {
                select_interaction.getFeatures().clear();
            }
            if (window.MCC != null && window.MNC != null && !Number.isNaN(window.MCC) && !Number.isNaN(window.MNC)) {
                getNetworkTitle(MCC, MNC);
            }
        }
        function clearToastTimeout(toastId) {
            if (window[`${toastId}Timeout`]) {
                clearTimeout(window[`${toastId}Timeout`]);
            } else {}
        }
        function createCustomToastWithId(toastId, toastHeader) {
            if (document.querySelector(`#${toastId}`) == null) {
                devLogger(`Creating ${toastId}`);
                let toast = textToHtml(src_elements.a("div", {
                    style: "position: unset; min-width: 10rem;",
                    id: toastId,
                    role: "alert",
                    class: "toast fade d-none",
                    "data-autohide": "false"
                }, src_elements.a("div", {
                    class: "toast-header"
                }, src_elements.a("strong", {
                    id: `${toastId}HeaderTitle`,
                    class: "mr-auto",
                    style: "min-width: 1rem;"
                }, toastHeader ? toastHeader : "PCI+"), src_elements.a("small", null, "now"), src_elements.a("button", {
                    type: "button",
                    id: `${toastId}CloseButton`,
                    class: "ml-2 mb-1 close toast-close-button",
                    "data-dismiss": "toast",
                    "aria-label": "Close",
                    style: ""
                }, src_elements.a("span", null, "×"))), src_elements.a("div", {
                    id: `${toastId}Body`,
                    class: "toast-body"
                })));
                $("#toastContainer").prepend(toast);
            }
        }
        function createToastContainer() {
            if (document.querySelector("#toastContainer") !== null) {
                return;
            }
            let toastContainer = textToHtml(src_elements.a("div", {
                id: "toastContainer",
                style: "position: absolute; top: 100px; right: 0; z-index: 9999;",
                class: "toast-container p-1"
            }));
            $("body").append(toastContainer);
        }
        function setupToastTimeout(toastId, timeout) {
            let toastTimeout = setTimeout((() => {
                $(`#${toastId}`).toast("dispose");
                $(`#${toastId}`).addClass("d-none");
            }), timeout);
            window[`${toastId}Timeout`] = toastTimeout;
        }
        class PPToast {
            constructor(toastId, timeout, toastHeader) {
                this.toastId = toastId;
                if (timeout) {
                    this.toastTimeout = timeout;
                }
                if (toastHeader) {
                    this.toastHeader = toastHeader;
                }
                createToastContainer();
                createCustomToastWithId(this.toastId, toastHeader);
                $(`#${this.toastId}`).on("mouseover", (() => {
                    if (this.isVisible() && this.toastTimeout) {
                        this.showToast();
                        this.clearTimeout();
                        this.setupTimeout(this.toastTimeout);
                    }
                }));
            }
            setupTimeout(timeout) {
                this.clearTimeout();
                setupToastTimeout(this.toastId, timeout);
                this.toastTimeout = timeout;
            }
            clearTimeout() {
                clearToastTimeout(this.toastId);
            }
            hideToast() {
                clearToastTimeout(this.toastId);
                $(`#${this.toastId}`).toast("hide");
            }
            showToast() {
                if (this.toastTimeout) {
                    this.setupTimeout(this.toastTimeout);
                }
                $(`#${this.toastId}`).toast("show");
                $(`#${this.toastId}`).removeClass("d-none");
            }
            setContents(contents) {
                $(`#${this.toastId}Body`).html(contents);
            }
            getContents() {
                return document.querySelector(`${this.toastId}Body`).innerHTML;
            }
            clearContents() {
                return $(`#${this.toastId}Body`).empty();
            }
            appendContents(addedContents) {
                return $(`#${this.toastId}Body`).append(addedContents);
            }
            getSelector() {
                return `#${this.toastId}`;
            }
            isVisible() {
                if ($(this.getSelector()).css("opacity") == "0") {
                    return false;
                } else {
                    return true;
                }
            }
            getHeader() {
                return this.toastHeader;
            }
            setHeader(header) {
                this.toastHeader = header;
                $(`#${this.toastId}HeaderTitle`).text(header);
            }
            onClose(callback) {
                $(`#${this.toastId}CloseButton`).on("click", (() => {
                    callback();
                }));
            }
        }
        async function refreshMap(hideToast) {
            if (!hideToast) {
                let toast = new PPToast("mapRefreshedToast", 3e3);
                toast.setContents("Map Refreshed");
                toast.showToast();
            }
            if (window.savedFeatures) {
                window.savedFeatures.clear();
            }
            if (!window.pciPlus_useCustomTowerRendering) {
                window.updateMNClist();
            } else {
                const {MCC, MNC, netType, towerLayer} = window;
                window.getTowersInView(MCC, MNC, true, netType);
                const map_refresh_delay = 150;
                towerLayer.setVisible(false);
                await new Promise((r => setTimeout(r, map_refresh_delay)));
                towerLayer.setVisible(true);
            }
        }
        function toggleCCISmallCellLayer(enable) {
            const shouldEnable = enable != undefined ? enable : window.pciPlus_showCrownCastleSmallCells;
            if (shouldEnable == true) {
                enableCCISmallCellLayer();
            } else {
                disableCCISmallCellLayer();
            }
        }
        function enableCCISmallCellLayer() {
            if ($("#cciPopup")[0] == undefined) {
                createPopup();
            }
            disableCCISmallCellLayer();
            const smallCellFeatureServerUrl = "https://services7.arcgis.com/HJ6NuXYZF6fDjms9/ArcGIS/rest/services/SmallCells_(View)/FeatureServer/0/query?where=SCU_TYPE%20IN%20(%27Tenant%20Pole%27,%20%27Strand%20Mount%27,%20%27Customer%20Enclosure%27,%20%27Building%20Attachment%27)&resultType=standard&outFields=*&returnGeometry=true&resultOffset=0&resultRecordCount=100000&f=geojson";
            const squareImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSkUqIhYRcchQBcGCqIijVqEIFUKt0KqDyaU/QpOGJMXFUXAtOPizWHVwcdbVwVUQBH9AXF2cFF2kxO+SQosY7zju4b3vfbn7DhBqJaZZbWOApttmKhEXM9kVMfSKIHpo9mFEZpYxK0lJ+I6vewT4fhfjWf51f44uNWcxICASzzDDtInXiac2bYPzPnGEFWWV+Jx41KQLEj9yXfH4jXPBZYFnRsx0ao44QiwWWlhpYVY0NeJJ4qiq6ZQvZDxWOW9x1koV1rgnf2E4py8vcZ3WIBJYwCIkiFBQwQZKsBGjXSfFQorO4z7+AdcvkUsh1wYYOeZRhgbZ9YP/we/eWvmJcS8pHAfaXxznYwgI7QL1quN8HztO/QQIPgNXetNfrgHTn6RXm1r0COjeBi6um5qyB1zuAP1PhmzKrhSkJeTzwPsZfVMW6L0FOle9vjXOcfoApKlXyRvg4BAYLlD2ms+7O1r79m9No38/a3ZypE1skTwAAAAGYktHRADTANMA06cDtvEAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfnAxERFxv6kk+NAAAFeklEQVR42u3bXYhUVQDA8f+xD3dDFMNZP16ylR5Mg/A1P3qRcNX1pSdbeg5Si7C3cFF6KwqjIHrUMHo12U0rcP0I6TtwC8xVgxQZo7KE/Ng4PcwNIubM7oTemXv2/4OLcO4Is3P+nj33zhUkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSVkLFXmf84F1wGrgYWAZUAPmAPc4jbfVLeAacAWYAMaBE8AY8Jsfz//XAwwBR4BJIHp09JgEDhdzMts8p68X2AlcMqKuPS4CLxRzpRY2AecMpjLHBDBgts23F3sNpLLHPuA+M25YDHxtFJU/vgQWzfS7HP3Ax8CD03jtZWCkuNo+DfwYY/zZ9eAORBFCDXgAWFHcXdoILJzGXz0HrC/+nHFBLwZOTiPmMeDVGOMHptbRyAeLi/W1U7x0ori9enkmBd0LfAo82uI1Z4HtMcZRc+qqsAeAN4vfrilfAY8B18t+f7M69LnsnSLm/fV6fciYu0+McaSYuwMtXrYKeH2mrNCbgFbbh+EY427TqcRqvRsYbvGSAWA056B7iwu6fmPOJuo9wK4W++mVZW49yt5yPNsi5v3GXMktyC7gvcTpZcAzua7QPTRu5yxudgFYr9eHarXaKROp5Co9F/gmsVhdKsZv5LZCP5mIGWCbMVd6lf4d2JE4vaSY++y2HE8nxo/GGD80i8pHfQg4njg9lNuWYz6N52vvanJus1+aZLP1GAQONjk1CSwAruayQq9LxHzZmLNapQ8C9San7i4ayGbLsSYxPmIG2Rlts4FKBr08MT7m/GfnaJsNVDLohxLj485/dsbbbKCSQd+fGL/g/GfnQpsN3N4L05J+yBvAvU0uIpz+DIUQUg305BJ0TFwVO/szJ+hSepvlx6+cGLQMWjJoyaAlg5ZBSwYtGbRk0JJBy6Alg5YMWjJoyaBl0JJBSwYtGbRk0DJoyaAlg5YMWjJoGbRk0JJBSwYtGbQMWjJoyaAlg5YMWgYtGbRk0JJBy6Alg5YMWjJoyaBl0JJBSwYtGbRk0DJoyaAlg5YMWjJoGbRk0JJBSwYtGbQMWjJoyaAlg5YMWgYtGbRk0JJBSwYtg5YMWjJoyaAlg5ZBSwYtGbRk0DJoyaAlg5YMWuq2oG/6Uc94N3IK+o9mgyGEBc5zXkIIfe00UNWgf0mMLzWB7Cxts4FKBv1DYnyl85+dFYnxMzkF/X1ifJ3zn53H22ygkkGfSIwPOP/Z2ZAYP55T0GPAX03GF4YQBm0gmwvCLUCzi8JJ4FhOQf8KfJI4t9MUsvFiYvwj4GpOQQPsS4yvDSG49aj+6jwIrE6cfre091Hiz9wDTABLmpw7V6/Xt9ZqtVOmUcmY5wHf0vyW3UVgGZl9sQJwHXgtca6/r69vh2lU1juk7z+/UlbMZa/QAL3AaaA/cX53jHHYPiq1Or8MvJQ4fRZ4pFjMSlH2w0l/AttbnB8OIewxkyxiBthWZsydCBpgBHi7xfldIYQDIYS5JtO9e+YQwvtTxPwWcLj099ahz6QHOAmsavGac8COGOMhE+q6uxlv0Po5nM+BNWXunTu5Qv9zgbiRxl2PlH7gUAjhuF++dEXIW0IIJ4GDU8R8FtjciZg7uUL/O9ojNG7rTKUOjAJHgXHgfIzxiqndkXj7imhX0Hg2YwCoTeOvTgDrgfMz+fNbBHwBRI9KH58BC10OGmYDe42issc+Grdk9R8baDw7bSTVOM4AT5jt1HdAnqfxlanRdOfxE/Bc8ZtVbWxDniouBCeNqOPHLRrfIWzt5pBDReKeR+N/t6wBlhd3RfqAOcC9/tu/rW4C14q7ShPAdzQezj9GSY+ASpIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZKU9Df+RhTy4sYw6AAAAABJRU5ErkJggg==";
            const {ol, map} = window;
            const odasVectorSource = new ol.source.Vector({
                format: new ol.format.GeoJSON,
                url: smallCellFeatureServerUrl
            });
            const odasVectorLayer = new ol.layer.Vector({
                source: odasVectorSource,
                zIndex: 2,
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [ .5, .75 ],
                        scale: .15,
                        color: window.darkMode ? "#a96ade" : "#540a93",
                        src: squareImage
                    })
                })
            });
            odasVectorLayer.setProperties({
                isCrownCastleLayer: true
            });
            window.map.addLayer(odasVectorLayer);
        }
        function disableCCISmallCellLayer() {
            const {map} = window;
            for (let i of Object.values(map.getLayers().getArray())) {
                if (i.getProperties().isCrownCastleLayer == true) {
                    map.removeLayer(i);
                }
            }
        }
        function createPopup() {
            const {ol} = window;
            const popup = textToHtml(src_elements.a("div", {
                id: "cciPopup",
                class: "ol-popup"
            }, src_elements.a("div", {
                id: "popup-content"
            })));
            document.body.appendChild(popup);
            $("#popup-closer").on("click", (() => {
                overlay.setPosition(undefined);
                $("#popup-closer").blur();
                return false;
            }));
            window.map.on("click", (() => {
                if ($("#cciPopup").is(":visible")) {
                    overlay.setPosition(undefined);
                }
            }));
            const overlay = new ol.Overlay({
                element: $("#cciPopup")[0]
            });
            window.pciPlus_cciOverlay = overlay;
            window.map.addOverlay(overlay);
        }
        const default_saturation = 50;
        const default_lightness = 40;
        const default_saturation_dark = 80;
        const default_lightness_dark = 80;
        const pci_loading_color = "#6d480e";
        const pci_loading_color_dark = "#e6ac53";
        const inline_link_color = "#18BC9C";
        const verified_tower_color = "#4abe00";
        const unverified_tower_color = "#ff0000";
        const smallcell_tower_color = "#12dbdb";
        const decommissioned_tower_color = "#696969";
        const table_header_primary_background_color = "#2c3e50";
        const table_header_sub_background_color = "#657482";
        const unverified_pci_color = "#c45858";
        const das_pci_color = "#0da3a3";
        const gray_mode_colors = {
            primary: "#48494b",
            secondary: "#606263",
            tertiary: "#7e8182",
            text: "white"
        };
        const dark_mode_colors = {
            primary: "#232323",
            secondary: "#434345",
            tertiary: "#747778",
            text: "#e3e3e3"
        };
        const black_mode_colors = {
            primary: "#000000",
            secondary: "#232323",
            tertiary: "#606263",
            text: "#e3e3e3"
        };
        const carrierColors = {
            "310-410": {
                backgroundColor: "#00A8E0",
                textColor: "white"
            },
            "311-480": {
                backgroundColor: "#cd040b",
                textColor: "white"
            },
            "310-260": {
                backgroundColor: "#E20074",
                textColor: "white"
            },
            "310-120": {
                backgroundColor: "#fee100",
                textColor: "black"
            },
            "313-340": {
                backgroundColor: "#F2811D",
                textColor: "white"
            },
            "311-580": {
                backgroundColor: "#00529b",
                textColor: "white"
            }
        };
        const tablesToMove = [ {
            id: "select_provider_table",
            name: "Select Provider",
            needsHeader: true,
            collapsed: false,
            dualCol: false
        }, {
            id: "accountTable",
            name: "Account",
            needsHeader: true,
            collapsed: false,
            dualCol: true
        }, {
            id: "mapsettings",
            name: "Base Map",
            needsHeader: false,
            collapsed: true,
            dualCol: false
        }, {
            id: "whatsnew",
            name: "What's New",
            needsHeader: false,
            collapsed: true,
            dualCol: false
        }, {
            id: "locsearch",
            name: "Location Search",
            needsHeader: false,
            collapsed: true,
            dualCol: false
        }, {
            id: "towersearch",
            name: "Tower Search",
            needsHeader: false,
            collapsed: true,
            dualCol: false
        }, {
            id: "pcipscsearch",
            name: "BSIC/PCI/PSC Search",
            needsHeader: false,
            collapsed: true,
            dualCol: false
        }, {
            id: "cellsearch",
            name: "Cell Search",
            needsHeader: false,
            collapsed: true,
            dualCol: false
        }, {
            id: "settings",
            name: "Settings",
            needsHeader: true,
            collapsed: true,
            dualCol: true
        }, {
            id: "ppSettings",
            name: "PCI+ Settings",
            needsHeader: false,
            collapsed: true,
            dualCol: true
        }, {
            id: "filters",
            name: "Filters",
            needsHeader: true,
            collapsed: true,
            dualCol: true
        }, {
            id: "lacs",
            name: "Regions",
            needsHeader: false,
            collapsed: true,
            dualCol: true
        }, {
            id: "bands",
            name: "Bands",
            needsHeader: false,
            collapsed: true,
            dualCol: true
        }, {
            id: "frequencies",
            name: "Frequencies",
            needsHeader: false,
            collapsed: true,
            dualCol: true
        }, {
            id: "bandwidths",
            name: "Bandwidths",
            needsHeader: false,
            collapsed: true,
            dualCol: true
        } ];
        function disableCmDarkMode() {
            window.map.on("postcompose", (function(e) {
                document.querySelector("canvas").style.filter = "none";
            }));
            window.map.updateSize();
            $("#DarkMode").parent().parent().css("display", "none");
        }
        function handleInitialDarkMode() {
            devLogger("pci+ dark mode launching:", window.darkMode);
            if (window.darkMode) {
                disableCmDarkMode();
                enableDarkMode();
            } else {
                disableDarkMode();
            }
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event => {
                devLogger("System theme changed, checking for dark mode");
                if (window.pciPlus_useTheme == "sync") {
                    togglePciPlusDarkMode();
                }
            }));
        }
        function togglePciPlusDarkMode(freshStartup) {
            const {pciPlus_useTheme} = window;
            let action = "";
            if (pciPlus_useTheme == "light" && window.darkMode) {
                disableDarkMode();
                action = "disabling";
            } else if (pciPlus_useTheme.includes("dark")) {
                enableDarkMode();
                action = "enabling";
            } else if (pciPlus_useTheme == "sync") {
                let useDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                devLogger("system says to use dark mode", freshStartup);
                if (useDark) {
                    enableDarkMode();
                    action = "enabling";
                } else {
                    disableDarkMode();
                    action = "disabling;";
                }
            }
            if (action.length > 0) {
                toggleCCISmallCellLayer();
            }
        }
        function enableDarkMode() {
            const {map} = window;
            devLogger("starting up, enabling dark mode");
            disableCmDarkMode();
            window.darkMode = true;
            $.cookie("darkMode", "true");
            let mapSource = map.getLayers().getArray()[0];
            mapSource.on("prerender", (evt => {
                if (!window.darkMode) {
                    return;
                }
                if (evt.context) {
                    const context = evt.context;
                    context.filter = "grayscale(80%) invert(100%) ";
                    context.globalCompositeOperation = "source-over";
                }
            }));
            mapSource.on("postrender", (evt => {
                if (evt.context) {
                    const context = evt.context;
                    context.filter = "none";
                }
            }));
            let layers = map.getLayers();
            if (layers.getLength() > 0) {
                layers.removeAt(0);
            }
            map.getLayers().insertAt(0, mapSource);
            map.updateSize();
            $("#select_provider_table").addClass("table-color-dynamic");
            $("#accountTable").addClass("table-color-dynamic");
            $(".navbar").removeClass("bg-primary");
            for (let i of tablesToMove) {
                devLogger("adding table class to table:", i.id, $(i.id));
                $(`${i.id}`).addClass("table-color-dynamic");
            }
            $(".colorThemeStylesheet").remove();
            const theme = window.pciPlus_useTheme;
            let {primary, secondary, tertiary, text} = gray_mode_colors;
            if (theme == "darker" || theme == "sync") {
                ({primary, secondary, tertiary, text} = dark_mode_colors);
            } else if (theme == "darkest") {
                ({primary, secondary, tertiary, text} = black_mode_colors);
            }
            let darkModeStylesheet = document.createElement("style");
            darkModeStylesheet.id = "darkModeStylesheet";
            darkModeStylesheet.classList.add("colorThemeStylesheet");
            darkModeStylesheet.textContent = `\n\n  a, a:hover { \n    color: #07f2c4;\n  }\n\n  .nav-link:hover {\n    color: #07f2c4 !important;\n  }\n\n  /* Undo that for children of attribute_text */\n  .attribute_text > a {\n    color: #07614f;\n  }\n\n  \n  #map_canvas {\n    background-color: ${secondary}\n  }\n\n  .table, .table-color-dynamic {\n    background-color: ${primary};\n    color: ${text};\n  }\n  \n\n  .table-striped tbody tr:nth-of-type(odd) {\n    background-color: ${primary};\n  }\n\n  .table-striped tbody tr:nth-of-type(even) {\n    background-color: ${secondary};\n  }\n\n  .full .ts-control, .ts-dropdown {\n    background-color: ${primary};\n    color: ${text};\n  }\n\n  .modal-content {\n    background-color: ${primary};\n    color: ${text};\n  }\n\n  .aProviderCell {\n    background-color: ${primary};\n    color: ${text};\n  }\n\n  .aProviderCell:hover {\n    background-color: silver;\n    color: black;\n  }\n\n  #ppSidebar, .modal_dialog_base {\n    background-color: ${primary};\n  }\n\n  #tabs-1, #tabs-2 {\n    background-clip: content-box;\n    background-color: ${primary};\n  }\n\n  #ppSidebarNav {\n    background-color: ${primary}\n  }\n\n  \n\n  .form-control, .form-control:focus, select, .popover, .popover-header {\n    background-color: ${primary};\n    color: ${text};\n  }\n\n  .nav-link {\n    color: ${text} !important;\n  }\n\n  .toast-header, .toast-body, .toast-close-button {\n    background-color: ${secondary};\n    color: ${text};\n  }\n  \n  .warningText {\n    color: #f7a1a1;\n  }\n\n  /* Theme navbar */\n  .navbar {\n    background-color: ${secondary};\n  }\n\n  /* Color Sidebar */\n  .collapsedSection:not(.subHeaderColor), .collapsableSection:not(.subHeaderColor), .table > thead > tr:not(.subHeaderColor) {\n    background-color: ${secondary};\n    color: ${text};\n  }\n\n  /* Color non-sidebar */\n  .button-nav, .modal_top_header {\n    background-color: ${secondary};\n    color: ${text};\n  }\n\n  .subHeaderColor {\n    background-color: ${tertiary};\n    color: ${text};\n  }\n\n  .aProviderCell:not(.actionsTableCell) {\n    border: 1px solid lightgray;\n    border-style: solid;\n  }\n\n  .actionsTableCell {\n    border: 1px solid lightgray;\n    border-style: inset !important; \n  }\n  \n  \n  \n  `;
            document.head.appendChild(darkModeStylesheet);
            window.updateLinkback();
            window.updateMNClist();
        }
        function disableDarkMode() {
            const {map} = window;
            disableCmDarkMode();
            window.darkMode = false;
            $.cookie("darkMode", "false");
            $(".colorThemeStylesheet").remove();
            let lightStylesheet = document.createElement("style");
            lightStylesheet.id = "lightModeStylesheet";
            lightStylesheet.classList.add("colorThemeStylesheet");
            lightStylesheet.textContent = `\n\n  .warningText {\n    color: #e81010;\n  }\n  \n  #ppSidebar {\n    background-color: white;\n  }\n\n  /** Theme table headers **/\n  .primaryHeaderColor {\n    background-color: ${table_header_primary_background_color};\n  }\n\n  /** Theme actions table borders **/\n  .aProviderCell {\n    border: 1px solid black;\n  }\n\n  .aProviderCell:not(.actionsTableCell) {\n    border-style: outset;\n  }\n  `;
            document.body.appendChild(lightStylesheet);
            window.updateLinkback();
            window.updateMNClist();
        }
        function reloadPage() {
            window.location.href = window.location.href + (window.CMApp !== undefined ? "&app=true&restorestate=true" : "");
        }
        function showTiles(inMCC, inMNC) {
            if (window.tilesEnabled !== true) {
                devLogger("[PCI+] Tiles are disabled, ignoring command to show");
                return;
            }
            const {clearLayer, API_URL, netType, showBand, ol, map, updateLegend} = window;
            clearLayer("SignalTrails");
            const tileProviderUrl = `${API_URL}getTile?MCC=${inMCC}&MNC=${inMNC}&RAT=${netType}&z={z}&x={x}&y={y}&band=${showBand}`;
            var tileLayer = new ol.layer.Tile({
                visible: true,
                name: "SignalTrails",
                preload: 0,
                source: new ol.source.XYZ({
                    url: tileProviderUrl,
                    maxZoom: 16
                })
            });
            tileLayer.setZIndex(1);
            map.addLayer(tileLayer);
            updateLegend(netType);
        }
        function toggleSetting(setting, newSetting, originalEvent) {
            devLogger("toggling", setting, newSetting);
            if (!(typeof newSetting == "undefined")) {
                if (typeof window[setting] == typeof newSetting) {
                    if (window.pciPlus_randomizeSectorColors && setting == "pciPlus_randomizeSectorColors" && newSetting == true) {
                        devLogger("Easter egg already enabled, returning");
                        return;
                    }
                    devLogger("setting value of", setting, "to", newSetting);
                    window[setting] = newSetting;
                    if ($(`#${setting}`)[0] !== undefined) {
                        if (typeof window[setting] === "boolean") {
                            const settingType = $(`#${setting}`).prop("tagName");
                            if (settingType == "INPUT") {
                                $(`#${setting}`).prop("checked", newSetting);
                            } else if (settingType == "A") {
                                $(`#${setting}`).attr("data-state", String(newSetting));
                            }
                        } else if (typeof window[setting] === "string") {
                            $(`#${setting}`).val(newSetting);
                        }
                    }
                } else {
                    devLogger("Type mismatch when applying new setting for", setting, "new setting:", newSetting);
                    return;
                }
            } else if (($(`#${setting}`)[0] === undefined || $(`#${setting}`).prop("tagName") == "A") && typeof window[setting] === "boolean") {
                devLogger("No checkbox, so set to opposite of current value");
                window[setting] = !window[setting];
            } else {
                if (typeof window[setting] === "boolean") {
                    let state;
                    const settingType = $(`#${setting}`).prop("tagName");
                    if (settingType == "INPUT") {
                        state = $(`#${setting}`).prop("checked");
                    } else if (settingType == "A") {
                        state = $(`#${setting}`).attr("data-state") === "true";
                    }
                    window[setting] = state;
                } else if (typeof window[setting] === "string") {
                    let val = $(`#${setting}`).val();
                    window[setting] = val;
                } else {
                    devLogger("We can't change this setting, we don't recognize the type.", setting);
                    return;
                }
            }
            $.cookie(`${setting}`, window[setting], {
                expires: 3600
            });
            let preference = settings.find((obj => obj.key == setting));
            if (preference.callbackOnSettingChanged !== undefined) {
                preference.callbackOnSettingChanged(window[setting], originalEvent);
            }
            return window[setting];
        }
        function increaseTileVisibility(state) {
            const {API_URL, map, netType, clearLayer, MCC, MNC, showBand, ol} = window;
            if (state == false) {
                clearLayer("SignalTrails");
                showTiles(MCC, MNC);
                new PPToast("largerTilesEnabledToast").hideToast();
            } else if (state == true) {
                if (!window.tilesEnabled) {
                    const toast = new PPToast("tilesNotEnabledToast");
                    toast.setContents("To use this feature, please enable Signal Trails.");
                    toast.setupTimeout(5e3);
                    toast.showToast();
                    toggleSetting("pciPlus_showLargeTiles", false);
                    return;
                }
                clearLayer("SignalTrails");
                const tileProviderUrl = `${API_URL}getTile?MCC=${MCC}&MNC=${MNC}&RAT=${netType}&z={z}&x={x}&y={y}&band=${showBand}`;
                const largerTileLayer = new ol.layer.Tile({
                    visible: true,
                    name: "SignalTrails",
                    preload: Number.MAX_SAFE_INTEGER,
                    source: new ol.source.XYZ({
                        url: tileProviderUrl,
                        tileSize: [ 768, 768 ]
                    })
                });
                largerTileLayer.setZIndex(1);
                map.addLayer(largerTileLayer);
                const toast = new PPToast("largerTilesEnabledToast");
                toast.setContents(src_elements.a("span", null, src_elements.a("b", null, "Show Large Tiles⁺"), " is enabled! Use the button below to disable.", src_elements.a("br", null), src_elements.a("br", null), src_elements.a("button", {
                    id: "largerTilesEnabledToastButton",
                    class: "btn btn-info"
                }, "Disable")));
                toast.showToast();
                $("#largerTilesEnabledToastButton").on("click", (() => {
                    toggleSetting("pciPlus_showLargeTiles", false);
                    toast.hideToast();
                }));
            }
        }
        function initializeIcons() {
            const {ol, getTowerIconImage} = window;
            const oldBadgeSetting = window.showIcons;
            window.showIcons = true;
            const icons = {
                dot: {
                    verified: {
                        MACRO: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: verified_tower_color,
                            src: "images/dot.png"
                        }),
                        PICO: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: verified_tower_color,
                            src: "images/dot.png"
                        }),
                        COW: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: verified_tower_color,
                            src: "images/dot.png"
                        }),
                        MICRO: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: verified_tower_color,
                            src: "images/dot.png"
                        }),
                        DECOMMISSIONED: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: decommissioned_tower_color,
                            src: "images/dot.png"
                        }),
                        DAS: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: smallcell_tower_color,
                            src: "images/dot.png"
                        })
                    },
                    unverified: {
                        MACRO: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: unverified_tower_color,
                            src: "images/dot.png"
                        }),
                        PICO: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: unverified_tower_color,
                            src: "images/dot.png"
                        }),
                        MICRO: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: unverified_tower_color,
                            src: "images/dot.png"
                        }),
                        COW: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: unverified_tower_color,
                            src: "images/dot.png"
                        }),
                        DAS: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: unverified_tower_color,
                            src: "images/dot.png"
                        }),
                        DECOMMISSIONED: new ol.style.Icon({
                            anchor: [ .5, .5 ],
                            color: decommissioned_tower_color,
                            src: "images/dot.png"
                        })
                    }
                },
                badge: {
                    verified: {
                        MACRO: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "MACRO"
                            }, true)
                        }),
                        PICO: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "PICO"
                            }, true)
                        }),
                        COW: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "COW"
                            }, true)
                        }),
                        MICRO: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "MICRO"
                            }, true)
                        }),
                        DAS: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "DAS"
                            }, true)
                        }),
                        DECOMMISSIONED: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "DECOMMISSIONED"
                            }, true)
                        })
                    },
                    unverified: {
                        MACRO: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "MACRO"
                            }, false)
                        }),
                        PICO: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "PICO"
                            }, false)
                        }),
                        COW: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "COW"
                            }, false)
                        }),
                        MICRO: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "MICRO"
                            }, false)
                        }),
                        DAS: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "DAS"
                            }, false)
                        }),
                        DECOMMISSIONED: new ol.style.Icon({
                            anchor: [ .5, .75 ],
                            src: getTowerIconImage({
                                TOWER_TYPE: "DECOMMISSIONED"
                            }, false)
                        })
                    }
                }
            };
            window.showIcons = oldBadgeSetting;
            const styles = {
                dot: {
                    verified: {
                        MACRO: new ol.style.Style({
                            image: icons.dot.verified.MACRO
                        }),
                        PICO: new ol.style.Style({
                            image: icons.dot.verified.PICO
                        }),
                        COW: new ol.style.Style({
                            image: icons.dot.verified.COW
                        }),
                        DAS: new ol.style.Style({
                            image: icons.dot.verified.DAS
                        }),
                        DECOMMISSIONED: new ol.style.Style({
                            image: icons.dot.verified.DECOMMISSIONED
                        }),
                        MICRO: new ol.style.Style({
                            image: icons.dot.verified.MICRO
                        })
                    },
                    unverified: {
                        MACRO: new ol.style.Style({
                            image: icons.dot.unverified.MACRO
                        }),
                        PICO: new ol.style.Style({
                            image: icons.dot.unverified.PICO
                        }),
                        COW: new ol.style.Style({
                            image: icons.dot.unverified.COW
                        }),
                        DAS: new ol.style.Style({
                            image: icons.dot.unverified.DAS
                        }),
                        DECOMMISSIONED: new ol.style.Style({
                            image: icons.dot.unverified.DECOMMISSIONED
                        }),
                        MICRO: new ol.style.Style({
                            image: icons.dot.unverified.MICRO
                        })
                    }
                },
                badge: {
                    verified: {
                        MACRO: new ol.style.Style({
                            image: icons.badge.verified.MACRO
                        }),
                        PICO: new ol.style.Style({
                            image: icons.badge.verified.PICO
                        }),
                        COW: new ol.style.Style({
                            image: icons.badge.verified.COW
                        }),
                        DAS: new ol.style.Style({
                            image: icons.badge.verified.DAS
                        }),
                        DECOMMISSIONED: new ol.style.Style({
                            image: icons.badge.verified.DECOMMISSIONED
                        }),
                        MICRO: new ol.style.Style({
                            image: icons.badge.verified.MICRO
                        })
                    },
                    unverified: {
                        MACRO: new ol.style.Style({
                            image: icons.badge.unverified.MACRO
                        }),
                        PICO: new ol.style.Style({
                            image: icons.badge.unverified.PICO
                        }),
                        COW: new ol.style.Style({
                            image: icons.badge.unverified.COW
                        }),
                        DAS: new ol.style.Style({
                            image: icons.badge.unverified.DAS
                        }),
                        DECOMMISSIONED: new ol.style.Style({
                            image: icons.badge.unverified.DECOMMISSIONED
                        }),
                        MICRO: new ol.style.Style({
                            image: icons.badge.unverified.MICRO
                        })
                    }
                }
            };
            window.iconCache = icons;
            window.iconStyleCache = styles;
        }
        function generateIconStyle(towerType, verified, towerLabel) {
            const {ol} = window;
            const verifiedText = verified ? "verified" : "unverified";
            const iconStyle = window.showIcons ? "badge" : "dot";
            if (window.showTowerLabels == true) {
                const pcsDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                return new ol.style.Style({
                    text: new ol.style.Text({
                        text: towerLabel,
                        font: "bold 11px Helvetica, verdana",
                        textAlign: "center",
                        textBaseline: "middle",
                        offsetX: 0,
                        offsetY: window.pciPlus_colorizeByTac ? 31 : 25,
                        backgroundStroke: new ol.style.Stroke({
                            color: verified ? verified_tower_color : unverified_tower_color,
                            width: 1
                        }),
                        backgroundFill: new ol.style.Fill({
                            color: (() => {
                                if (window.pciPlus_useTheme == "darker" || window.pciPlus_useTheme == "sync" && pcsDark) {
                                    return dark_mode_colors.secondary;
                                } else if (window.pciPlus_useTheme == "darkest") {
                                    return black_mode_colors.secondary;
                                } else if (window.darkMode) {
                                    return gray_mode_colors.secondary;
                                } else {
                                    return "white";
                                }
                            })()
                        }),
                        fill: new ol.style.Fill({
                            color: window.darkMode ? (() => {
                                const theme = window.pciPlus_useTheme;
                                switch (theme) {
                                  case "darker":
                                    return dark_mode_colors.text;

                                  case "sync":
                                    return pcsDark ? dark_mode_colors.text : "black";

                                  case "darkest":
                                    return black_mode_colors.text;

                                  case "dark":
                                    return gray_mode_colors.text;
                                }
                            })() : "black"
                        }),
                        padding: [ 3, 3, 3, 3 ]
                    }),
                    image: window.iconCache[iconStyle][verifiedText][towerType]
                });
            } else {
                return window.iconStyleCache[iconStyle][verifiedText][towerType];
            }
        }
        function generateTowerLabel(siteID, regionID, towerType, towerBandArray, estimatedBandData, towerAttributes) {
            const {getNameOrId} = window;
            let towerName = getNameOrId(siteID, {
                TOWER_TYPE: towerType,
                TOWER_NAME: towerAttributes.TOWER_NAME
            });
            let towerText = towerName;
            let towerBands = [];
            if (towerBandArray != undefined && towerBandArray.length > 0) {
                towerBands = towerBandArray;
            }
            if (estimatedBandData != undefined && estimatedBandData.length > 0) {
                for (let i = 0; i < estimatedBandData.length; i++) {
                    if (!towerBands.includes(estimatedBandData[i].bandNumber) && !towerBands.includes(estimatedBandData[i].bandNumber + "*")) {
                        if (estimatedBandData[i].bandNumber > 0) {
                            towerBands.push(estimatedBandData[i].bandNumber + "*");
                        }
                    }
                }
            }
            towerBands = towerBands.sort((function(a, b) {
                return parseInt(String(a).replace("*", "")) - parseInt(String(b).replace("*", ""));
            }));
            if (towerBands.length > 1) {
                towerText += "\nBands " + towerBands;
            } else if (towerBands.length == 1) {
                towerText += "\nBand " + towerBands;
            }
            if (window.pciPlus_colorizeByTac) {
                towerText = `ID: ${towerName}\nB: ${towerBands.toString().replaceAll(",", "/")}\nR: ${regionID}`;
            }
            let towerLabel = window.showTowerLabels ? towerText : "";
            if (towerType == "DAS" && window.pciPlusFilter_hideDas == "hideLabels" || (towerType == "MACRO" || towerType == "DECOMMISSIONED") && window.pciPlusFilter_hideMacro == "hideLabels") {
                towerLabel = "";
            }
            return towerLabel + "";
        }
        function generateTowerFeature(tower) {
            const {getNameOrId, ol, showTowerLabels, showIcons, getTowerIconImage, isLoggedIn} = window;
            if (window.iconCache == undefined) {
                initializeIcons();
            }
            let towerFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([ parseFloat(String(tower.longitude)), parseFloat(String(tower.latitude)) ], "EPSG:4326", "EPSG:3857")),
                name: tower.siteID,
                draggable: isLoggedIn
            });
            return towerFeature;
        }
        function styleFeature(feature) {
            if (window.savedFeatures.get(feature) !== undefined) {
                return window.savedFeatures.get(feature);
            }
            const tower = feature.values_;
            const verified = tower.towerMover != undefined && tower.towerMover > 0;
            const towerType = tower.towerAttributes.TOWER_TYPE != undefined && tower.towerAttributes.TOWER_TYPE != "MACRO" ? tower.towerAttributes.TOWER_TYPE : "MACRO";
            let towerLabel;
            if (window.showTowerLabels) {
                towerLabel = generateTowerLabel(tower.base, tower.regionID, tower?.towerAttributes?.TOWER_TYPE, tower.bands, tower.estimatedBandData, tower.towerAttributes);
            }
            let iconStyle = generateIconStyle(towerType, verified, towerLabel);
            if (window.showIcons) {
                if (window.showIcons && iconStyle && iconStyle.getImage()) {
                    iconStyle.getImage().setScale(.1);
                }
            }
            window.savedFeatures.set(feature, iconStyle);
            return iconStyle;
        }
        function genColorStyle(signal, showAllStrengths, showText) {
            const {ol} = window;
            let color;
            if (signal >= -62) {
                color = [ 4, 48, 3 ];
            } else if (signal < -62 && signal >= -66 && showAllStrengths) {
                color = [ 9, 105, 8 ];
            } else if (signal < -66 && signal >= -70 && showAllStrengths) {
                color = [ 17, 163, 15 ];
            } else if (signal < -70 && signal >= -80 && showAllStrengths) {
                color = [ 106, 204, 37 ];
            } else if (signal < -80 && signal >= -90 && showAllStrengths) {
                color = [ 204, 198, 37 ];
            } else if (signal < -90 && signal >= -100 && showAllStrengths) {
                color = [ 171, 76, 12 ];
            } else if (signal < -100 && signal >= -110 && showAllStrengths) {
                color = [ 171, 12, 12 ];
            } else {
                color = [ 66, 3, 3 ];
                return;
            }
            let text = null;
            if (showText) {
                text = new ol.style.Text({
                    font: "15px tahoma,sans-serif",
                    stroke: new ol.style.Stroke({
                        color: "#000000",
                        width: 1
                    }),
                    backgroundFill: new ol.style.Fill({
                        color: "#FFFFFF"
                    }),
                    text: "Signal: " + signal
                });
            }
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "black",
                    width: .5,
                    lineDash: null
                }),
                fill: new ol.style.Fill({
                    color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.50)`
                }),
                text
            });
        }
        function createFCCTileLayer(carrier, rat, showAllStrengths, showText) {
            const {ol} = window;
            return new ol.layer.VectorTile({
                source: new ol.source.VectorTile({
                    attributions: ' | Polygons © <a href="https://coveragemap.com/signal-strength-map">CoverageMap</a>' + ', <a href="https://broadbandmap.fcc.gov/provider-detail/mobile?zoom=4.00&vlon=-101.637908&vlat=44.179968&providers=131425_400_on&env=0&pct_cvg=0"> FCC',
                    format: new ol.format.MVT,
                    url: `https://map.coveragemap.com/api/fcc/getHexagons?version=4&z={z}&x={x}&y={y}&technology=${rat == "NR" ? "5g" : "lte"}&provider=${carrier}`
                }),
                style: a => {
                    const signalStrength = a.get("signal") | -100;
                    return genColorStyle(signalStrength, showAllStrengths, showText);
                }
            });
        }
        function toggleFccLayer(state) {
            const setting = window.pciPlus_showFccPolygons;
            const {MCC, MNC, map, fccPolygonLayer, netType} = window;
            if (state == false) {
                devLogger("Disabling polygons");
                if (window.fccPolygonLayer) {
                    map.removeLayer(fccPolygonLayer);
                    return;
                } else {
                    devLogger("FCC Polygon layer not on map, nothing to disable");
                }
            }
            if (setting === "off") {
                devLogger("Can't toggle FCC layer, preference is already set to 'Off'");
                return;
            }
            const plmn = `${MCC}${MNC}`;
            const supportedCarriers = {
                310260: "TMO",
                310410: "ATT",
                311480: "VZW",
                313340: "DISH",
                311580: "USC"
            };
            if (supportedCarriers[plmn] == undefined) {
                devLogger("Tried to enable FCC tiles, but carrier is not supported");
                toggleSetting("pciPlus_showFccPolygons", "off");
                return;
            }
            if (!(netType == "LTE" || netType == "NR")) {
                devLogger("This RAT is not supported.");
                toggleSetting("pciPlus_showFccPolygons", "off");
                return;
            }
            const layer = createFCCTileLayer(supportedCarriers[plmn], netType, setting === "detailed" || setting === "detailedwithtext", setting === "detailedwithtext");
            window.map.removeLayer(window.fccPolygonLayer);
            window.fccPolygonLayer = layer;
            map.addLayer(window.fccPolygonLayer);
        }
        function generateCellMapperUrl(inputs, usePciPlusLink) {
            let {MCC, MNC, type, latitude, longitude, zoom, showTowers, showTowerLabels, clusterEnabled, tilesEnabled, showOrphans, showFrequencyOnly, showNoFrequencyOnly, showBandwidthOnly, DateFilterType, showHex, showVerifiedOnly, showUnverifiedOnly, showLTECAOnly, showENDCOnly, showBand, mapType, darkMode, ppTowerId, ppRegionId} = inputs;
            if (usePciPlusLink && ppTowerId && ppRegionId) {
                return "https://cellmapper.net/map?" + new URLSearchParams({
                    MCC: String(MCC || window.MCC || 0),
                    MNC: String(MNC || window.MNC || 0),
                    type: String(type || window.netType || "LTE"),
                    latitude: String(latitude || window.latitude || 0),
                    longitude: String(longitude || window.longitude || 0),
                    zoom: String(zoom || 18),
                    ppT: String(ppTowerId),
                    ppL: String(ppRegionId)
                });
            }
            return "https://www.cellmapper.net/map?" + new URLSearchParams({
                MCC: String(MCC || window.MCC || 0),
                MNC: String(MNC || window.MNC || 0),
                type: String(type || window.netType || "LTE"),
                latitude: String(latitude || window.latitude || 0),
                longitude: String(longitude || window.longitude || 0),
                zoom: String(zoom || window.zoom || 18),
                showTowers: String(showTowers || window.showTowers || true),
                showTowerLabels: String(showTowerLabels || window.showTowerLabels || true),
                clusterEnabled: String(clusterEnabled || window.clusterEnabled || true),
                tilesEnabled: String(tilesEnabled || window.tilesEnabled || true),
                showOrphans: String(showOrphans || window.showOrphans || false),
                showNoFrequencyOnly: String(showNoFrequencyOnly || window.showNoFrequencyOnly || false),
                showFrequencyOnly: String(showFrequencyOnly || window.showFrequencyOnly || false),
                showBandwidthOnly: String(showBandwidthOnly || window.showBandwidthOnly || false),
                DateFilterType: String(DateFilterType || window.DateFilterType || "Last"),
                showHex: String(showHex || window.showHex || false),
                showVerifiedOnly: String(showVerifiedOnly || window.showVerifiedOnly || false),
                showUnverifiedOnly: String(showUnverifiedOnly || window.showUnverifiedOnly || false),
                showLTECAOnly: String(showLTECAOnly || window.showLTECAOnly || false),
                showENDCOnly: String(showENDCOnly || window.showENDCOnly || false),
                showBand: String(showBand || window.showBand || 0),
                mapType: String(mapType || window.mapType || "roadmap"),
                darkMode: String(darkMode || window.darkMode || false)
            });
        }
        function getCarrierName(MCC, MNC) {
            const list = window.MNCList;
            let entries = Object.entries(list);
            let filtered = entries.reduce(((obj, [key, value]) => {
                let filteredValue = value.filter((o => o.countryID == MCC && o.providerID == MNC));
                if (filteredValue.length > 0) {
                    let mappedValue = filteredValue.map((o => o.providerName));
                    obj[key] = mappedValue;
                }
                return obj;
            }), {});
            const name = Object.values(filtered)[0][0];
            if (name.length == 0) {
                return `${MCC}-${MNC}`;
            }
            if (name == "AT&T Mobility" || name == "T-Mobile USA" || name == "Viaero Wireless" || name == "Union Telephone Company") {
                return name.split(" ")[0];
            } else {
                return name;
            }
        }
        async function getUserHistory(userId, currentOffset, continuingSession, oldOffset) {
            const {API_URL, handleResponse, getExtraContent, bootbox, moveToTower} = window;
            const dateOptions = {
                day: "2-digit",
                weekday: "short",
                year: "numeric",
                month: "short"
            };
            if ($("#userHistoryModal").is(":visible")) {
                $("#userHistoryModal").modal("hide");
                $(".modal-backdrop").remove();
            }
            devLogger("Getting custom user history");
            const reqParams = {
                UID: String(userId),
                offset: String(currentOffset)
            };
            let res = await fetch(API_URL + "getUserHistory?" + new URLSearchParams(reqParams), {
                credentials: "include"
            });
            let locatedTowersData = handleResponse(await res.json());
            devLogger("user history data:", locatedTowersData);
            let arrOfTableItems = [];
            for (let i of locatedTowersData) {
                let dateAndTime = new Date(i.timestamp).toLocaleString();
                let dateOnly = new Date(i.timestamp).toLocaleDateString(undefined, dateOptions);
                let actionType;
                if (i.latitude == -1) {
                    actionType = src_elements.a("b", null, "Restored Calculated Location");
                } else if (i.latitude == 0) {
                    let restoreOffer = src_elements.a("a", {
                        onclick: `restoreDeletedTower(${i.mcc}, ${i.mnc}, '${i.rat}', ${i.lac}, ${i.base})`,
                        href: "#",
                        "data-toggle": "tooltip",
                        title: "Revive",
                        style: "position: absolute;"
                    }, " *");
                    actionType = src_elements.a("b", null, "Deleted", i.cell === undefined ? restoreOffer : "");
                } else {
                    const id = i.base + i.lac + i.rat + "onclicker";
                    actionType = src_elements.a("a", {
                        id,
                        href: generateCellMapperUrl({
                            MCC: i.mcc,
                            MNC: i.mnc,
                            type: i.rat,
                            latitude: i.latitude,
                            longitude: i.longitude,
                            zoom: 18,
                            ppRegionId: i.lac,
                            ppTowerId: i.base
                        }, true),
                        onclick: `\n            if (isMobileDevice) { toggleMobile() };\n            moveToTower(${i.mcc}, ${i.mnc}, '${i.rat}', ${i.latitude}, ${i.longitude});\n            return false;\n            `
                    }, "View");
                }
                let potentialCellBaseNumber = i.cell !== undefined && i.rat == "LTE" ? Math.trunc(i.cell / 256) : false;
                let towerIdNumber = potentialCellBaseNumber || i.base;
                let towerNameWithLookupPrompt = src_elements.a("span", null, potentialCellBaseNumber ? "<i>" + towerIdNumber + "</i>" : towerIdNumber, src_elements.a("a", {
                    href: "#",
                    "data-toggle": "tooltip",
                    title: "View History",
                    style: towerIdNumber != undefined ? "position: absolute;" : "display: none;",
                    onclick: `window.getTowerOverrideHistory(${i.mcc}, ${i.mnc}, '${i.rat}', ${i.lac}, ${towerIdNumber}, 0)`
                }, " *"));
                const showName = window.pciPlus_showCarrierNameInHistory;
                const plmnCombo = `${i.mcc}-${i.mnc}`;
                let output = src_elements.a("tr", {
                    style: "text-align: center;"
                }, src_elements.a("td", {
                    title: dateAndTime
                }, dateOnly), " ", src_elements.a("td", null, actionType), " ", src_elements.a("td", {
                    style: showName && carrierColors[plmnCombo] != undefined ? `color: ${carrierColors[plmnCombo].backgroundColor}` : ""
                }, showName ? getCarrierName(i.mcc, i.mnc) : plmnCombo), src_elements.a("td", null, i.rat), src_elements.a("td", null, i.lac !== undefined ? i.lac : ""), src_elements.a("td", null, i.cell !== undefined ? i.cell : ""), src_elements.a("td", null, i.base !== undefined || i.cell !== undefined ? towerNameWithLookupPrompt : ""));
                arrOfTableItems.push(output);
            }
            let {totalCells, totalLocatedTowers, totalPoints, userName, premium} = await getUser(userId);
            let userInfoString = src_elements.a("h6", {
                style: "text-align: center;",
                title: `Points Per Cell: ${Math.round(totalPoints / totalCells)}`
            }, "User", src_elements.a("b", {
                title: "User ID: " + userId
            }, userName + (premium ? "<span title='Premium User' style='color: gold'>&#x2605;</span></a>" : "")), "has uploaded ", src_elements.a("b", null, totalPoints.toLocaleString()), " points, discovered", " ", src_elements.a("b", null, totalCells.toLocaleString()), " cells, and modified", " ", src_elements.a("b", null, totalLocatedTowers.toLocaleString()), " towers.", src_elements.a("br", null));
            let userCellsTable = src_elements.a("table", {
                class: "table table-striped table-sm"
            }, src_elements.a("thead", null, src_elements.a("tr", null, src_elements.a("th", null, "Date"), src_elements.a("th", null, "Status"), src_elements.a("th", null, "Provider"), src_elements.a("th", null, "RAT"), src_elements.a("th", null, "Region"), src_elements.a("th", null, "Cell"), src_elements.a("th", null, "Tower"))), src_elements.a("tbody", null, arrOfTableItems));
            let displayTable = src_elements.a("div", null, userInfoString, locatedTowersData.length > 0 ? userCellsTable : "");
            let footerElements = {};
            if (userId !== window.userID) {
                footerElements["Contact"] = src_elements.a("button", {
                    type: "button",
                    class: "btn btn-warning btn-contact",
                    "data-dismiss": "modal",
                    onclick: `window.open('https://docs.cellmapper.net/mw/Special:EmailUser/${userName}', '_blank');`,
                    style: "float: left;",
                    title: `Contact ${userName} via Mediawiki`
                }, "Contact");
            }
            footerElements["PageNum"] = src_elements.a("div", {
                style: "margin-right: auto;"
            }, `(Page: ${1 + currentOffset / 20})`);
            footerElements["Previous"] = src_elements.a("div", {
                class: "btn-group dropup"
            }, src_elements.a("button", {
                type: "button",
                class: "btn btn-info btn-prev",
                "data-mult": "20"
            }, "Previous"), src_elements.a("button", {
                type: "button",
                class: "btn btn-info dropdown-toggle dropdown-toggle-split",
                "data-toggle": "dropdown",
                "aria-haspopup": "true",
                "aria-expanded": "false"
            }, src_elements.a("span", {
                class: "sr-only"
            }, "Toggle Dropdown")), src_elements.a("div", {
                class: "dropdown-menu"
            }, src_elements.a("button", {
                "data-mult": "100",
                class: "dropdown-item btn-prev",
                type: "button"
            }, "x100 (5)"), src_elements.a("button", {
                "data-mult": "200",
                class: "dropdown-item btn-prev",
                type: "button"
            }, "x200 (10)"), src_elements.a("button", {
                "data-mult": "1000",
                class: "dropdown-item btn-prev",
                type: "button"
            }, "x1000 (50)"), src_elements.a("button", {
                "data-mult": "5000",
                class: "dropdown-item btn-prev",
                type: "button"
            }, "x5000 (250)")));
            footerElements["Next"] = src_elements.a("div", {
                class: "btn-group dropup"
            }, src_elements.a("button", {
                "data-mult": "20",
                type: "button",
                class: "btn btn-info btn-next"
            }, "Next"), src_elements.a("button", {
                type: "button",
                class: "btn btn-info dropdown-toggle dropdown-toggle-split",
                "data-toggle": "dropdown",
                "aria-haspopup": "true",
                "aria-expanded": "false"
            }, src_elements.a("span", {
                class: "sr-only"
            }, "Toggle Dropdown")), src_elements.a("div", {
                class: "dropdown-menu"
            }, src_elements.a("button", {
                "data-mult": "100",
                class: "dropdown-item btn-next",
                type: "button"
            }, "x100 (5)"), src_elements.a("button", {
                "data-mult": "200",
                class: "dropdown-item btn-next",
                type: "button"
            }, "x200 (10)"), src_elements.a("button", {
                "data-mult": "1000",
                id: "next-100",
                class: "dropdown-item btn-next",
                type: "button"
            }, "x1000 (50)"), src_elements.a("button", {
                "data-mult": "5000",
                id: "next-1000",
                class: "dropdown-item btn-next",
                type: "button"
            }, "x5000 (250)")));
            footerElements["Close"] = src_elements.a("button", {
                type: "button",
                class: "btn btn-info btn-close",
                "data-dismiss": "modal",
                onclick: "$('#userHistoryModal').modal('hide'); $('.modal-backdrop').remove();"
            }, "Close");
            if (locatedTowersData.length > 0) {
                let modal = src_elements.a("div", {
                    id: "userHistoryModal",
                    class: "modal fade",
                    tabindex: "-1",
                    role: "dialog"
                }, src_elements.a("div", {
                    class: "modal-dialog modal-lg",
                    role: "document"
                }, src_elements.a("div", {
                    class: "modal-content"
                }, src_elements.a("div", {
                    class: "modal-body"
                }, displayTable), src_elements.a("div", {
                    class: "modal-footer"
                }, Object.values(footerElements)))));
                if (document.querySelector("#userHistoryModal") == null) {
                    $("body").append('<div id="userHistoryModal"></div>');
                }
                $("#userHistoryModal").replaceWith(modal);
                $("#userHistoryModal").modal("show");
                $("#userHistoryModal").on("hidden.bs.modal", (() => {
                    const modals = document.querySelectorAll("#userHistoryModal");
                    for (let modal of modals) {
                        $(modal).remove();
                    }
                    bootbox.hideAll();
                    $(".modal-backdrop").remove();
                }));
                $(".btn-next").on("click", (e => {
                    let multiplier = parseInt(e.target.getAttribute("data-mult"));
                    let newOffset = currentOffset + 1 * multiplier;
                    devLogger("going up from", currentOffset, "to", newOffset);
                    getUserHistory(userId, newOffset, true, currentOffset);
                }));
                $(".btn-prev").on("click", (e => {
                    let multiplier = parseInt(e.target.getAttribute("data-mult"));
                    let newOffset = currentOffset - 1 * multiplier;
                    devLogger("going down from", currentOffset, "to", newOffset);
                    if (currentOffset < 20 && newOffset < 0) {
                        devLogger("Reached the end");
                        const reachedEndToast = new PPToast("userHistoryEndDialogReachedToast", 3e3);
                        reachedEndToast.setContents("You've reached the end, cannot continue");
                        reachedEndToast.showToast();
                        return;
                    } else if (currentOffset > 20 && newOffset < 0) {
                        getUserHistory(userId, 0);
                        return;
                    }
                    getUserHistory(userId, newOffset);
                }));
            } else {
                if (continuingSession) {
                    const reachedEndToast = new PPToast("userHistoryEndDialogReachedToast", 3e3);
                    const returnPageNum = 1 + oldOffset / 20;
                    reachedEndToast.setContents(`You overshot! Returning to page ${returnPageNum}`);
                    devLogger("old/new:", oldOffset, currentOffset);
                    if (oldOffset == currentOffset - 20) {
                        reachedEndToast.setContents(`You've reached the end! Returning to page ${returnPageNum}`);
                    }
                    reachedEndToast.showToast();
                    getUserHistory(userId, oldOffset);
                    return;
                }
                bootbox.alert({
                    message: displayTable,
                    size: "large",
                    closeButton: false,
                    onEscape: () => {
                        bootbox.hideAll();
                    }
                });
            }
        }
        const preferenceCategories = {
            general: {
                name: "General",
                collapsed: false
            },
            filters: {
                name: "PCI+ Filters",
                collapsed: false,
                shouldShow: () => $.cookie("pciPlus_useCustomTowerRendering") === "true"
            },
            map: {
                name: "Map Settings",
                collapsed: true
            },
            extras: {
                name: "Extras",
                collapsed: true
            },
            keyboard: {
                name: "Keyboard Shortcuts",
                collapsed: true
            }
        };
        let selectCidRenderOptions = [ {
            value: "None",
            name: "None"
        }, {
            value: "SectorId",
            name: "Sector ID"
        }, {
            value: "GlobalId",
            name: "Global Cell ID"
        }, {
            value: "enbId",
            name: "Tower ID"
        }, {
            value: "direction",
            name: "Direction"
        }, {
            value: "enbAndSector",
            name: "Tower + Sector ID"
        }, {
            value: "sectorAndPci",
            name: "PCI + Sector ID"
        }, {
            value: "bandAndSector",
            name: "Band + Sector ID"
        } ];
        let distanceUnitOptions = [ {
            value: "mi",
            name: "Miles"
        }, {
            value: "km",
            name: "Kilometers"
        } ];
        let sectorColorOptions = [ {
            value: "none",
            name: "None"
        }, {
            value: "sidebar",
            name: "Sidebar Only"
        }, {
            value: "map",
            name: "Map Only"
        }, {
            value: "both",
            name: "Both"
        } ];
        let sectorColorGenerationOptions = [ {
            value: "none",
            name: "None"
        }, {
            value: "contrastify",
            name: "Contrastify"
        }, {
            value: "fix",
            name: "Override"
        } ];
        let settings = [ {
            key: "pciPlus_enableCmgmIntegration",
            name: "Enable CMGM⁺",
            description: "Use CMGM alongside CellMapper and PCI+. If you aren't sure what this means, leave this setting disabled.",
            category: "extras",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: state => {
                changeStatusIcon(state);
            }
        }, {
            key: "pciPlus_showSidebar",
            name: "Show Sidebar⁺",
            description: "Replace dropdown menu with persistent sidebar",
            category: "extras",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackShouldShowSetting: () => {
                if (window.isMobileDevice) {
                    return false;
                }
                return true;
            },
            callbackOnSettingChanged: () => reloadPage()
        }, {
            key: "pciPlus_showApiCopyButton",
            name: "Show API Copy Button⁺",
            description: "Share CellMapper links that directly perform an action",
            category: "extras",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: state => {
                $("#modifyTowerLocationCopyButton").css("display", state ? "block" : "none");
            }
        }, {
            key: "pciPlus_showTrueSectors",
            name: "Show True Coverage⁺",
            description: "Show sectors on pinned sites as though they weren't pinned",
            category: "general",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined
        }, {
            key: "pciPlus_allowSelectMultipleTowers",
            name: "Multi-Site View⁺",
            description: "Select multiple towers at once to see overlapping coverage",
            category: "general",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackShouldShowSetting: () => {
                if (window.isMobileDevice) {
                    return false;
                }
                return true;
            }
        }, {
            key: "pciPlus_combineUlDlFreq",
            name: "Combine UL/DL Freq⁺",
            description: "Combine UL/DL frequencies in the sidebar",
            category: "extras",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined
        }, {
            key: "pciPlus_showBearingInMeasure",
            name: "Azimuth in Measure⁺",
            description: "Show bearing/azimuth in tooltip when using Measure",
            category: "extras",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackShouldShowSetting: () => {
                window.pciPlus_showBearingInMeasure = false;
                $.cookie("pciPlus_showBearingInMeasure", false);
                return false;
            }
        }, {
            key: "pciPlus_lookupAddressWhenMoving",
            name: "Verify Pin Address⁺",
            description: "Shows address in toast when dragging a tower",
            category: "map",
            settingType: "boolean",
            defaultValue: true,
            selectOptions: undefined,
            callbackShouldShowSetting: () => false
        }, {
            key: "pciPlus_useCustomTowerRendering",
            name: '<span class="warningText">Use PCI+ Rendering⁺</span>',
            description: "Use PCI+ to render towers on the map. Warning: some features not supported!",
            category: "map",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: () => {
                reloadPage();
            },
            warning: {
                warningTitle: "Warning!",
                warningHtml: src_elements.a("span", null, "PCI+ Rendering is in ", src_elements.a("b", null, "beta"), ". This means that some functionality is not currently available, including:", src_elements.a("br", null), src_elements.a("ul", null, src_elements.a("li", null, src_elements.a("i", null, "Bands"), " tab"), src_elements.a("li", null, src_elements.a("i", null, "Regions"), " tab"), src_elements.a("li", null, src_elements.a("i", null, "Bandwidths"), " tab"), src_elements.a("li", null, src_elements.a("i", null, "Frequencies"), " tab"), src_elements.a("li", null, '"Group Towers" Setting')), "You may also experience bugs or other issues. Using PCI+ Rendering is optional.")
            }
        }, {
            key: "pciPlus_onlyShowSelectedBandSectors",
            name: "Band Selector Filters Sectors⁺",
            description: "When you have a band selected, only polygons associated with that band will be rendered on the map",
            category: "map",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined
        }, {
            key: "pciPlus_promptForClipboardCoords",
            name: "Check for Copied Coords⁺",
            description: "Automatically check for coordinates on your clipboard and prompt to jump straight there",
            category: "map",
            settingType: "boolean",
            defaultValue: true,
            selectOptions: undefined,
            callbackShouldShowSetting: () => true
        }, {
            key: "pciPlus_hideCountryInSelect",
            name: "Hide Country in Selector⁺",
            description: "Hide country in sidebar Select Provider TomSelect",
            category: "extras",
            settingType: "boolean",
            defaultValue: true,
            selectOptions: undefined,
            callbackOnSettingChanged: state => {}
        }, {
            key: "pciPlus_hideMacroSiteLabel",
            name: "Hide Macro Label⁺",
            description: "Hides the 'Macro' keyword in tower labels. DAS, COW, etc are unaffected.",
            category: "extras",
            settingType: "boolean",
            defaultValue: true,
            selectOptions: undefined,
            callbackOnSettingChanged: () => {
                window.updateMNClist();
            },
            callbackShouldShowSetting: () => true
        }, {
            key: "pciPlus_showCarrierNameInHistory",
            name: "Show Carrier Name In History⁺",
            description: "Show the operator's name in the User History view, as opposed to just the MCC + MNC pair",
            category: "extras",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined
        }, {
            key: "pciPlus_doColorsBySite",
            name: "Increase Visibility in Multi-Site⁺",
            description: "Show sector colors per-tower, rather than per-sector (only when Multi-Site View is enabled)",
            category: "map",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackShouldShowSetting: () => {
                if (window.isMobileDevice) {
                    return false;
                }
                return true;
            }
        }, {
            key: "pciPlus_dontUnloadTowers",
            name: "Keep All Towers Loaded⁺",
            description: "Leave all towers loaded on map, even when out of view. This minimizes lag when moving the map. <b>A fast computer is strongly recommended.</b>",
            category: "map",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: state => {
                if (state == true) {
                    refreshMap();
                }
            },
            warning: {
                warningTitle: "Warning!",
                warningHtml: src_elements.a("span", null, "This feature will prevent towers from being removed when you move the map.", src_elements.a("br", null), src_elements.a("br", null), "This has the advantage of preventing lag when panning or zooming, but it requires far more resources. The lag will increase over time until you refresh the map ", src_elements.a("i", null, "(Shift+Y)"), " or reload the page.", src_elements.a("br", null), src_elements.a("br", null), src_elements.a("b", {
                    style: "font-size: 105%;"
                }, "This feature requires a powerful computer. Use at your own risk."))
            }
        }, {
            key: "pciPlus_useStylingMethod",
            name: "Use Styling Method⁺",
            description: "Change the way your towers are styled. This has no visual impact, but has significant performance implications.",
            category: "map",
            defaultValue: "layer",
            selectOptions: [ {
                value: "layer",
                name: "Layer (Fast, Recommended)"
            }, {
                value: "feature",
                name: "Feature (Slower, More Compatibile)"
            } ],
            settingType: "PPMultiSetting",
            callbackOnSettingChanged: state => {
                if (state == "layer") {
                    window.towerLayer.setStyle(styleFeature);
                } else {
                    window.towerLayer.setStyle();
                }
                refreshMap();
            }
        }, {
            key: "pciPlus_showNrInLtePciSearch",
            name: "Combine LTE/NR PCI Search⁺",
            description: "Show NR gNBs mixed within LTE PCI Search results, and vice versa. This makes it easier to find NR gNB splits, but comes with the disadvantage of lower search speed.",
            category: "extras",
            settingType: "boolean",
            defaultValue: true,
            selectOptions: undefined
        }, {
            key: "pciPlus_colorizeByTac",
            name: "Show Tower TACs⁺",
            description: "Colorize dots by TAC instead of verified/unverified, useful for finding patterns",
            category: "general",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: () => {
                refreshMap(true);
                window.showIcons = false;
                $("#doDisplayIcons").prop("checked", false);
                $.cookie("showIcons", false);
            }
        }, {
            key: "pciPlus_showCrownCastleSmallCells",
            name: "Crown Castle Overlay⁺",
            description: "Show Crown Castle Small Cells on the map. Information may be outdated.",
            category: "general",
            settingType: "boolean",
            defaultValue: "false",
            selectOptions: undefined,
            callbackOnSettingChanged: () => {
                toggleCCISmallCellLayer();
            },
            callbackShouldShowSetting: () => {
                let shouldEnable = $.cookie("pciPlus_showCrownCastleSmallCells") == "true";
                toggleCCISmallCellLayer(shouldEnable);
                return true;
            }
        }, {
            key: "pciPlus_showLargeTiles",
            name: "Show Large Tiles⁺",
            description: "Temporarily increases the size of signal trails on the map, for easier viewing at high zoom levels.",
            category: "general",
            settingType: "PPToggleLink",
            defaultValue: false,
            selectOptions: undefined,
            dontUseCookie: true,
            callbackOnSettingChanged: state => {
                increaseTileVisibility(state);
            }
        }, {
            key: "pciPlus_showFccPolygons",
            name: "Show FCC Polygons⁺",
            description: "Overlay the map with polygons showing FCC data (via CoverageMap)",
            category: "general",
            settingType: "PPMultiSetting",
            defaultValue: "off",
            selectOptions: [ {
                name: "Off",
                value: "off"
            }, {
                name: "Minimal",
                value: "minimal"
            }, {
                name: "Detailed",
                value: "detailed"
            }, {
                name: "Detailed w/ Text",
                value: "detailedwithtext"
            } ],
            callbackOnSettingChanged: state => {
                if (state === "off") {
                    toggleFccLayer(false);
                } else {
                    toggleFccLayer(true);
                }
            }
        }, {
            key: "pciPlus_useTheme",
            name: "Color Theme⁺",
            description: "Optionally change CellMapper's theme. Replaces CM Dark Mode implementation.\nLight: The default theme we know and love\nDark: A new custom theme, built from the ground up for PCI+\nSystem: Automatically determine based on your system which theme to use",
            category: "general",
            settingType: "PPMultiSetting",
            defaultValue: "light",
            selectOptions: [ {
                value: "sync",
                name: "Auto"
            }, {
                value: "light",
                name: "Light"
            }, {
                value: "darker",
                name: "Dark"
            }, {
                value: "darkest",
                name: "OLED Black"
            } ],
            callbackOnSettingChanged: state => {
                togglePciPlusDarkMode();
            },
            callbackShouldShowSetting: () => {
                window.darkMode = $.cookie("darkMode") === "true";
                togglePciPlusDarkMode(true);
                return true;
            }
        }, {
            key: "pciPlus_randomizeSectorColors",
            name: "Color Randomizer⁺",
            description: "Randomizes sector colors for each site upon click (easter egg)",
            category: "map",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackShouldShowSetting: () => {
                if ($.cookie("pciPlus_randomizeSectorColors") === "true") {
                    return true;
                } else {
                    return false;
                }
            },
            callbackOnSettingChanged: state => {
                if (state === false) {
                    let randomizeSectorColorsElement = $("#pciPlus_randomizeSectorColors")[0].parentNode.parentNode;
                    if (randomizeSectorColorsElement) {
                        randomizeSectorColorsElement.parentNode.removeChild(randomizeSectorColorsElement);
                    }
                } else if (state === true) {
                    let prefInfo = settings.find((obj => obj.key == "pciPlus_randomizeSectorColors"));
                    let element = createBoolSetting(prefInfo.name, prefInfo.key, prefInfo.description);
                    let sectorColorsSetting = $("#pciPlus_customSectorColors")[0].parentNode.parentNode;
                    sectorColorsSetting.parentNode.insertBefore(element, sectorColorsSetting);
                }
            }
        }, {
            key: "pciPlus_customSectorColors",
            name: "Show Sector Colors⁺",
            description: "Set sector colors with more specificity",
            category: "map",
            settingType: "PPMultiSetting",
            defaultValue: "both",
            selectOptions: sectorColorOptions
        }, {
            key: "pciPlus_fixCmSectorColors",
            name: "Patch Sector Colors⁺",
            description: `Patch default sector colors\n        - None: Makes no changes\n        - Contrastify: Improves contrast but doesn't modify colors\n        - Override: Improves contrast + changes colors to prevent visual conflicts (like EARFCN 66786 & 5035)`,
            category: "map",
            settingType: "PPMultiSetting",
            defaultValue: "contrastify",
            selectOptions: sectorColorGenerationOptions
        }, {
            key: "pciPlus_selectCidRenderType",
            name: "Show in Render⁺",
            description: "Change what text apperas in the rendered sector coverage polygons",
            category: "map",
            settingType: "PPMultiSetting",
            defaultValue: "SectorId",
            selectOptions: selectCidRenderOptions,
            callbackOnSettingChanged: () => {
                clearCoverage(true);
            }
        }, {
            key: "pciPlus_distanceUnit",
            name: "Unit of Distance⁺",
            description: "Changes the unit of distance used for Measure and PCI Search",
            category: "map",
            settingType: "PPMultiSetting",
            defaultValue: "mi",
            selectOptions: distanceUnitOptions,
            callbackOnSettingChanged: () => {
                if (window.pciPlus_distanceUnit == "mi") {
                    window.imperialUnits = true;
                } else {
                    window.imperialUnits = false;
                }
            },
            callbackShouldShowSetting: () => {
                const state = $.cookie("pciPlus_distanceUnit") !== "km";
                if (state) {
                    window.imperialUnits = true;
                } else {
                    window.imperialUnits = false;
                }
                $("#ImperialUnits").parent().parent().remove();
                return true;
            }
        } ];
        let filters = [ {
            key: "pciPlusFilter_hidePico",
            name: "Hide Picocells⁺",
            description: "Hide all towers flagged as picocells",
            category: "filters",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: () => {
                refreshMap();
            }
        }, {
            key: "pciPlusFilter_hideMicro",
            name: "Hide Microcells⁺",
            description: "Hide all towers marked as microcells",
            category: "filters",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: () => {
                refreshMap();
            }
        }, {
            key: "pciPlusFilter_hideDecom",
            name: "Hide Decom⁺",
            description: "Hide all towers marked as decommissioned",
            category: "filters",
            settingType: "boolean",
            defaultValue: false,
            selectOptions: undefined,
            callbackOnSettingChanged: () => {
                refreshMap();
            }
        }, {
            key: "pciPlusFilter_hideDas",
            name: "Hide DAS⁺",
            description: "Customize how DAS nodes are displayed",
            category: "filters",
            settingType: "PPMultiSetting",
            defaultValue: "defaultShowAll",
            selectOptions: [ {
                value: "defaultShowAll",
                name: "Default (Show All)"
            }, {
                value: "showDasOnly",
                name: "Show Only DAS"
            }, {
                value: "hideLabels",
                name: "Hide DAS Labels"
            }, {
                value: "hideDas",
                name: "Hide DAS Towers"
            } ],
            callbackOnSettingChanged: () => {
                refreshMap();
            },
            callbackShouldShowSetting: () => {
                const cookieVal = $.cookie("pciPlusFilter_hideDas");
                if (cookieVal === "true" || cookieVal === "false") {
                    $.cookie("pciPlusFilter_hideDas", "defaultShowAll");
                }
                return true;
            }
        }, {
            key: "pciPlusFilter_hideMacro",
            name: "Hide Macros⁺",
            description: "Hide towers marked as Macrocells",
            category: "filters",
            settingType: "PPMultiSetting",
            defaultValue: "defaultShowAll",
            selectOptions: [ {
                value: "defaultShowAll",
                name: "Default (Show All)"
            }, {
                value: "hideVerified",
                name: "Hide Verified"
            }, {
                value: "hideUnverified",
                name: "Hide Unverified"
            }, {
                value: "hideLabels",
                name: "Hide Macro Labels"
            }, {
                value: "hideAll",
                name: "Hide All Macros"
            } ],
            callbackOnSettingChanged: () => {
                refreshMap();
            }
        }, {
            key: "pciPlusFilter_filterByTac",
            name: "Show Only TAC⁺",
            description: "Show only towers in this TAC (or TACs)",
            category: "filters",
            settingType: "PPInput",
            defaultValue: "",
            dontUseCookie: true,
            selectOptions: undefined,
            inputPlaceholder: "eg. 15174,15279",
            callbackOnSettingChanged: () => {
                refreshMap();
            }
        }, {
            key: "pciPlusFilter_filterByOnlyBand",
            name: "Tower Has Band⁺",
            description: "Show only towers with this band, or only these bands. Depending on the separator, you can get different behavior.\n'|': Single-band tower with one of the listed bands (XOR)\n'&': Tower has all bands (AND)\nAnything else: Tower has one of the included bands (OR)",
            category: "filters",
            settingType: "PPInput",
            defaultValue: "",
            dontUseCookie: true,
            selectOptions: undefined,
            inputPlaceholder: "eg. 2",
            callbackOnSettingChanged: () => {
                refreshMap();
            }
        }, {
            key: "pciPlusFilter_filterByTowerIdRegex",
            name: "Tower ID Filter⁺",
            description: "Show only tower IDs that match this filter. Use a raw number separated by a hyphen (eg. 40000-50000) or a regular expression.",
            category: "filters",
            settingType: "PPInput",
            defaultValue: "",
            dontUseCookie: true,
            selectOptions: undefined,
            inputPlaceholder: "eg. 400-500, /48[1-8]../",
            callbackShouldShowSetting: () => {
                if ($.cookie("pciPlusFilter_filterByTowerIdRegex") != "") {
                    $.cookie("pciPlusFilter_filterByTowerIdRegex", "");
                }
                return true;
            },
            callbackOnSettingChanged: () => {
                window.pciPlusFilter_filterByTowerIdRegex = window.pciPlusFilter_filterByTowerIdRegex.replaceAll("/", "");
                $.cookie("pciPlusFilter_filterByTowerIdRegex", window.pciPlusFilter_filterByTowerIdRegex);
                let isValid = true;
                try {
                    new RegExp(window.pciPlusFilter_filterByTowerIdRegex);
                } catch {
                    isValid = false;
                }
                if (!isValid) {
                    const toast = new PPToast("regexNotValidToast", 3e3);
                    toast.setContents(src_elements.a("div", null, "That regex is not valid! For more information, see", src_elements.a("a", {
                        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"
                    }, "this FAQ"), "."));
                    toast.showToast();
                } else {
                    refreshMap();
                }
            }
        }, {
            key: "pciPlusFilter_filterByUser",
            name: "Tower Pinned By⁺",
            description: "Show only towers pinned by this particular user.\nAdd an '!' character to the beginning of the shortcut to exclude towers pinned by this user.",
            category: "filters",
            settingType: "PPInput",
            defaultValue: "",
            selectOptions: undefined,
            dontUseCookie: true,
            inputPlaceholder: "eg. '5Gisgold'",
            callbackOnSettingChanged: (_state, originalEvent) => {
                let {pciPlusFilter_filterByUser: enteredUserId} = window;
                if (enteredUserId[0] == "!") {
                    enteredUserId = enteredUserId.replace("!", "");
                }
                const toast = new PPToast("towerUserFilterToast", 5e3);
                if (enteredUserId == "") {
                    window.pciPlusFilter_filterByUser_id = undefined;
                    return;
                }
                let finalUserId;
                if (!Number.isSafeInteger(Number(enteredUserId))) {
                    const {userCache} = window;
                    let user = Object.values(userCache).filter((user => String(user.userName).toLowerCase() == String(enteredUserId).toLowerCase()))[0];
                    if (user == undefined) {
                        toast.setContents("Unfortunately, that user isn't yet in the database. View details for a tower that they've contributed to, then try again.");
                        toast.showToast();
                        return;
                    }
                    finalUserId = user.id;
                } else {
                    finalUserId = parseInt(enteredUserId);
                }
                if (originalEvent.shiftKey) {
                    getUserHistory(finalUserId, 0);
                    $("#pciPlusFilter_filterByUser").val("");
                    return;
                } else {
                    window.pciPlusFilter_filterByUser_id = finalUserId;
                }
                refreshMap();
            }
        } ];
        settings.push(...filters);
        function warnOrToggle(setting, newSetting, originalEvent) {
            const {bootbox} = window;
            const oldValue = window[setting];
            let preference = settings.find((obj => obj.key == setting));
            devLogger("passed in:", setting, newSetting, preference);
            if (typeof preference.warning == "undefined" || preference.settingType === "boolean" && window[setting] === true) {
                toggleSetting(setting, newSetting !== undefined ? newSetting : undefined, originalEvent);
                return;
            }
            const {warningTitle, warningHtml} = preference.warning;
            bootbox.confirm({
                centerVertical: true,
                closeButton: false,
                buttons: {
                    confirm: {
                        className: "btn-danger",
                        label: "Enable"
                    },
                    cancel: {
                        label: "Cancel",
                        className: "btn-secondary"
                    }
                },
                callback: res => {
                    if (res) {
                        toggleSetting(setting, newSetting !== undefined ? newSetting : undefined, originalEvent);
                    } else {
                        if (preference.settingType == "boolean") {
                            $(`#${setting}`).prop("checked", oldValue);
                        } else if (preference.settingType == "PPMultiSetting") {
                            $(`#${setting}`).val(oldValue);
                        }
                    }
                },
                title: warningTitle,
                message: warningHtml
            });
        }
        function createBoolSetting(name, id, explanation) {
            const node = textToHtml(src_elements.a("tr", {
                style: "border-top: 1px solid #dee2e6"
            }, src_elements.a("td", {
                style: "border: 0; vertical-align: middle;",
                title: explanation ? explanation : ""
            }, name.replace("⁺", genTooltip(explanation))), src_elements.a("td", {
                style: "float: right; border: 0; vertical-align: middle; padding-right: 0.5rem;"
            }, src_elements.a("input", {
                type: "checkbox",
                id,
                checked: "checked"
            }))));
            node.querySelector("input").onclick = event => {
                warnOrToggle(id, undefined, event);
            };
            return node;
        }
        function createMultiSetting(name, id, options, explanation) {
            let optionsHtml = options.map((option => src_elements.a("option", {
                value: option.value
            }, option.name)));
            const node = textToHtml(src_elements.a("tr", {
                style: "border-top: 1px solid #dee2e6"
            }, src_elements.a("td", {
                style: "border: 0; vertical-align: middle;",
                title: explanation ? explanation : ""
            }, name.replace("⁺", genTooltip(explanation))), src_elements.a("td", {
                style: "width: 100%; max-width: 10.5rem; float: right; border: 0;"
            }, src_elements.a("select", {
                id
            }, optionsHtml))));
            node.querySelector("select").onchange = event => {
                warnOrToggle(id, undefined, event);
            };
            return node;
        }
        function createHeaderForElement(text, dualCol, collapsedByDefault, useSubColor, id) {
            let colspanText = dualCol ? "2" : "1";
            let arrowToShow = collapsedByDefault ? "&#xf150;" : "&#xf151;";
            let isCollapsed = collapsedByDefault ? "collapsedSection" : "collapsableSection";
            let header = src_elements.a("thead", null, src_elements.a("tr", {
                class: isCollapsed,
                style: "cursor: pointer;"
            }, src_elements.a("td", {
                id: id ? id : "",
                class: useSubColor ? "subHeaderColor" : "primaryHeaderColor",
                colspan: colspanText
            }, text, " ", src_elements.a("i", {
                class: "fa caretIcon"
            }, arrowToShow))));
            return header;
        }
        function pp_removeAllTowers() {
            window.vectorSourceTowers.clear(), window.select_interaction.getFeatures().clear(), 
            window.Towers = [];
            window.refreshTowers();
            window.ppRendering_listOfTowers = [];
        }
        function handleFiltering(item) {
            if (window.showTowers == false) {
                if (window.Towers.length > 0) {
                    pp_removeAllTowers();
                }
                return false;
            }
            if (window.showBand != 0 && !(item.bandNumbers.includes(window.showBand) || item.bandNumbers.includes(String(window.showBand) + "*"))) {
                return false;
            }
            if (!window.showOrphans && !item.visible && !(item.towerAttributes.TOWER_TYPE == "DECOMMISSIONED")) {
                return false;
            }
            const {DateFilterType, startDate, endDate} = window;
            if (DateFilterType == "FirstSeen" && !(item.firstseendate >= startDate && item.firstseendate <= endDate)) {
                return false;
            }
            if (DateFilterType == "Last" && !(item.lastseendate >= startDate && item.lastseendate <= endDate)) {
                return false;
            }
            if (window.showFrequencyOnly && item.frequencyData == false) {
                return false;
            }
            if (window.showNoFrequencyOnly && item.frequencyData == true) {
                return false;
            }
            if (window.showBandwidthOnly && item.bandwidthData == false) {
                return false;
            }
            const isVerified = item.towerMover !== null && item.towerMover >= 0;
            if (window.showVerifiedOnly && !isVerified) {
                return false;
            }
            if (window.showUnverifiedOnly && isVerified) {
                return false;
            }
            if (window.showLTECAOnly && item.RATSubType !== "LTE-A") {
                return false;
            }
            if (window.showENDCOnly && item.towerAttributes.TOWER_ENDC_AVAILABLE != true) {
                return false;
            }
            const dasFilter = window.pciPlusFilter_hideDas;
            if (dasFilter !== "defaultShowAll") {
                if (dasFilter == "showDasOnly" && item.towerAttributes.TOWER_TYPE !== "DAS") {
                    return false;
                } else if (dasFilter == "hideDas" && item.towerAttributes.TOWER_TYPE == "DAS") {
                    return false;
                }
            }
            const macroFilter = window.pciPlusFilter_hideMacro;
            if (macroFilter !== "defaultShowAll" && (item.towerAttributes.TOWER_TYPE == "MACRO" || item.towerAttributes.TOWER_TYPE == "DECOMMISSIONED")) {
                if (macroFilter === "hideVerified" && isVerified) {
                    return false;
                } else if (macroFilter == "hideUnverified" && !isVerified) {
                    return false;
                } else if (macroFilter == "hideAll") {
                    return false;
                }
            }
            let tacFilterValue = window.pciPlusFilter_filterByTac;
            if (tacFilterValue.length > 0) {
                const usableTacs = tacFilterValue.split(/[\s,|\+]/);
                if (!usableTacs.includes(item.regionID)) {
                    return false;
                }
            }
            let onlyBandsValue = window.pciPlusFilter_filterByOnlyBand;
            if (onlyBandsValue.length > 0) {
                const matchOperator = onlyBandsValue.match(/(?:\d+([+&|,\s])?)/)[1] || "None";
                const onlyBandsStringArr = onlyBandsValue.split(matchOperator);
                let onlyBandsNumberArr = onlyBandsStringArr.map((val => parseInt(val)));
                let checker = (arr, target) => target.every((v => arr.includes(v)));
                if (matchOperator == "None") {
                    if (!(item.bandNumbers.length == 1 && item.bandNumbers[0] == onlyBandsNumberArr[0])) {
                        return false;
                    }
                } else if (matchOperator == "&") {
                    if (!(checker(onlyBandsNumberArr, item.bandNumbers) && onlyBandsNumberArr.length == item.bandNumbers.length)) {
                        return false;
                    }
                } else if (matchOperator == "|") {
                    if (!(item.bandNumbers.length == 1 && onlyBandsNumberArr.includes(item.bandNumbers[0]))) {
                        return false;
                    }
                } else {
                    if (!checker(onlyBandsNumberArr, item.bandNumbers)) {
                        return false;
                    }
                }
            }
            if (window.pciPlusFilter_filterByUser_id != undefined) {
                let towerUserMatch = item.towerMover == window.pciPlusFilter_filterByUser_id;
                if (window.pciPlusFilter_filterByUser[0] == "!") {
                    if (towerUserMatch) {
                        return false;
                    }
                } else {
                    if (!towerUserMatch) {
                        return false;
                    }
                }
            }
            if (window.pciPlusFilter_hidePico) {
                if (item.towerAttributes.TOWER_TYPE != undefined && item.towerAttributes.TOWER_TYPE == "PICO") {
                    return false;
                }
            }
            if (window.pciPlusFilter_hideMicro) {
                if (item.towerAttributes.TOWER_TYPE != undefined && item.towerAttributes.TOWER_TYPE == "MICRO") {
                    return false;
                }
            }
            if (window.pciPlusFilter_hideDecom) {
                if (item.towerAttributes.TOWER_TYPE != undefined && item.towerAttributes.TOWER_TYPE == "DECOMMISSIONED") {
                    return false;
                }
            }
            const regexFilter = window.pciPlusFilter_filterByTowerIdRegex;
            if (regexFilter.length > 0) {
                const towerId = item.siteID;
                if (window.pciPlusFilter_filterByTowerIdRegex.match(/^\d+\-\d+$/)) {
                    const [start, end] = regexFilter.split("-");
                    if (!(parseInt(towerId) >= parseInt(start) && parseInt(towerId) <= parseInt(end))) {
                        return false;
                    }
                } else {
                    const re = new RegExp(window.pciPlusFilter_filterByTowerIdRegex);
                    if (!re.test(towerId)) {
                        return false;
                    }
                }
            }
            return true;
        }
        async function pp_getTowersInView(inMCC, inMNC, clear, inNetType) {
            const {map, showHex, getCentre, API_URL, ol, correctLongitude, showFrequencyOnly, showMineOnly, showUnverifiedOnly, showENDCOnly, handleResponse, removeAllTowers, removeInvisibleTowers, markerExists, refreshTowers, updateLinkback} = window;
            if (inMCC == null || inMNC == null) {
                return;
            }
            if (!window.mapBounds) {
                return;
            }
            if (!window.showTowers) {
                return;
            }
            $("#doHex").prop("checked", showHex);
            if (map.getView().getCenter()[1] === 0) {
                getCentre(inMCC);
            }
            const getTowersParams = {
                MCC: String(inMCC),
                MNC: String(inMNC),
                RAT: inNetType,
                boundsNELatitude: String(ol.extent.getTopRight(window.mapBounds)[1]),
                boundsNELongitude: String(correctLongitude(ol.extent.getTopRight(window.mapBounds)[0])),
                boundsSWLatitude: String(ol.extent.getBottomLeft(window.mapBounds)[1]),
                boundsSWLongitude: String(correctLongitude(ol.extent.getBottomLeft(window.mapBounds)[0])),
                filterFrequency: String(showFrequencyOnly),
                showOnlyMine: String(showMineOnly),
                showUnverifiedOnly: String(showUnverifiedOnly),
                showENDCOnly: String(showENDCOnly)
            };
            const towersRes = fetch(API_URL + "getTowers?" + new URLSearchParams(getTowersParams), {
                credentials: "include"
            }).then((towersRes => towersRes.json())).then((towersJson => {
                const towers = handleResponse(towersJson);
                if (clear) {
                    removeAllTowers();
                    window.ppRendering_listOfTowers = [];
                } else {
                    if (!window.pciPlus_dontUnloadTowers) {
                        removeInvisibleTowers();
                    }
                }
                for (const index in towers) {
                    const item = towers[index];
                    const shouldShow = handleFiltering(item);
                    if (!shouldShow) {
                        continue;
                    }
                    const towerMarker = generateTowerFeature(item);
                    towerMarker.setProperties({
                        MCC: inMCC,
                        MNC: inMNC,
                        LAC: item.regionID,
                        regionID: item.regionID,
                        bands: item.bandNumbers,
                        orphan: !item.visible,
                        arfcns: item.channels,
                        frequencyData: item.frequencyData,
                        bandwidths: item.bandwidths,
                        estimatedBandData: item.estimatedBandData,
                        base: item.siteID,
                        system: item.RAT,
                        subSystem: item.RATSubType,
                        towerMover: item.towerMover,
                        towerAttributes: item.towerAttributes,
                        firstseendate: new Date(item.firstseendate),
                        lastseendate: new Date(item.lastseendate)
                    });
                    if (item.towerAttributes.TOWER_NAME != null) {
                        towerMarker.set("towerName", item.towerAttributes.TOWER_NAME);
                    }
                    if (item.towerMover !== null && item.towerMover > 0) {
                        towerMarker.set("verified", true);
                    } else {
                        towerMarker.set("verified", false);
                    }
                    if (window.pciPlus_useStylingMethod == "feature") {
                        let style = styleFeature(towerMarker);
                        towerMarker.setStyle(style);
                    }
                    const ppSiteId = `${inMCC}-${inMNC}-${item.regionID}-${item.siteID}`;
                    if (!window.ppRendering_listOfTowers.includes(ppSiteId) && item.RAT == window.netType) {
                        towerMarker.setId(ppSiteId);
                        window.Towers.push(towerMarker);
                        window.vectorSourceTowers.addFeature(towerMarker);
                        window.ppRendering_listOfTowers.push(ppSiteId);
                    } else {}
                }
                updateLinkback();
            }));
        }
        function toggleTowers() {
            const {refreshTowers} = window;
            window.showTowers = !window.showTowers;
            $.cookie("showTowers", window.showTowers, {
                expires: 3600
            });
            refreshTowers();
            if (window.pciPlus_useCustomTowerRendering) {
                pp_getTowersInView(window.MCC, window.MNC, true, window.netType);
            }
            $("#doDisplayTowers").prop("checked", window.showTowers);
            if (!window.showTowers) {
                pp_removeAllTowers();
                disableCCISmallCellLayer();
            } else {
                if (window.pciPlus_showCrownCastleSmallCells) {
                    enableCCISmallCellLayer();
                }
            }
        }
        function getCarrierStyle(plmn) {
            if (carrierColors[plmn]) {
                return `border: 0.2em solid ${carrierColors[plmn].backgroundColor};`;
            } else {
                return "";
            }
        }
        async function showProvidersDialog(latitude, longitude, altLocation) {
            const {API_URL, handleResponse, bootbox, getNetworkInfo, MCC, MNC} = window;
            if (altLocation?.type == "cached" || altLocation?.type == "provider") {
                latitude = altLocation.latitude;
                longitude = altLocation.longitude;
            } else {
                window.lastProviderLookupLocation = [ Number(latitude), Number(longitude) ];
                devLogger("lplc", window.lastProviderLookupLocation);
            }
            const getNetworksAvailableParams = {
                latitude: String(latitude),
                longitude: String(longitude)
            };
            let networksAvailableRes = await fetch(API_URL + "getNetworksAvailable?" + new URLSearchParams(getNetworksAvailableParams), {
                credentials: "include"
            });
            let networksAvailableAsJson = await networksAvailableRes.json();
            let networksAvailable = handleResponse(networksAvailableAsJson);
            var perRow = 4;
            if (window.screen.availWidth < 600) {
                perRow = 3;
            }
            if (window.isMobileDevice) {
                perRow = 2;
            }
            let providers = [];
            for (const [index, item] of networksAvailable.entries()) {
                if (item.totalPoints < 1e3 && item.theCellProvider.providerName !== "Dish Network") {
                    continue;
                }
                if (index % perRow == 0 && index != 0) {
                    providers.push("</tr><tr>");
                }
                let plmnH = `${item.theCellProvider.countryID}-${item.theCellProvider.providerID}`;
                let plmnC = `${item.theCellProvider.countryID},${item.theCellProvider.providerID}`;
                let shownName;
                if (item.theCellProvider.providerName.toLocaleLowerCase().includes("sprint")) {
                    shownName = src_elements.a("b", null, "Sprint", src_elements.a("br", null), `(${plmnH})`);
                } else {
                    shownName = src_elements.a("b", null, item.theCellProvider.providerName);
                }
                providers.push(src_elements.a("td", {
                    style: `vertical-align: middle; border-collapse: separate; text-align: center; cursor: pointer; ${getCarrierStyle(plmnH)}`,
                    title: plmnH,
                    onclick: `selectProvider(${plmnC})`,
                    class: "aProviderCell"
                }, shownName));
            }
            devLogger("altLocation:", altLocation);
            const shortenedCachedLat = altLocation?.latitude.toFixed(3);
            const shortenedCachedLon = altLocation?.longitude.toFixed(3);
            const usingCachedLocationMessage = src_elements.a("div", {
                style: "text-align: center; font-style: italic;"
            }, "Country not found, using ", altLocation?.type == "cached" ? "cached" : "network", " location", ` (${shortenedCachedLat}, ${shortenedCachedLon}).`);
            let providersDiv = src_elements.a("table", {
                class: "table table-color-dynamic",
                style: "border-collapse: separate; border-spacing: 0px;"
            }, altLocation?.type != undefined ? usingCachedLocationMessage : null, src_elements.a("tr", null, providers));
            let bootboxAlert = $("<div>");
            bootboxAlert.append(providersDiv);
            bootboxAlert.prop("title", "Select a provider");
            bootbox.alert(providersDiv, (() => {
                getNetworkInfo(MCC, MNC);
                return true;
            }));
        }
        async function showCountryClick(inLatitude, inLongitude) {
            let {API_URL, handleResponse} = window;
            inLatitude = Number(inLatitude);
            inLongitude = Number(inLongitude);
            $(".contextmenu").remove();
            if (window.showBand != 0) {
                devLogger("Custom band is set, resetting to 0");
                window.showBand = 0;
            }
            const reqParams = {
                latitude: String(inLatitude),
                longitude: String(inLongitude)
            };
            let res = await fetch(API_URL + "getCountryFromLatLng?" + new URLSearchParams(reqParams), {
                credentials: "include"
            });
            let inCountry = handleResponse(await res.json());
            if (inCountry.CountryID == -1) {
                return;
            }
            devLogger("country id returned for location:", inCountry.CountryID);
            let altLocation;
            if (inCountry.CountryID == 0 && window.lastProviderLookupLocation !== undefined) {
                altLocation = {
                    type: "cached",
                    latitude: window.lastProviderLookupLocation[0],
                    longitude: window.lastProviderLookupLocation[1]
                };
            } else if (inCountry.CountryID == 0 && window.lastProviderLookupLocation == undefined) {
                if (window.MCC == undefined || window.MCC == null || Number.isNaN(window.MCC)) {
                    return;
                }
                const params = {
                    MCC: String(window.MCC)
                };
                const res = await fetch(API_URL + "getLatLngFromCountry?" + new URLSearchParams(params), {
                    credentials: "include"
                });
                const loc = handleResponse(await res.json());
                if (!loc.Latitude || !loc.Longitude) {
                    return;
                }
                altLocation = {
                    type: "provider",
                    latitude: loc.Latitude,
                    longitude: loc.Longitude
                };
            }
            if (inCountry.CountryID == 0 && window.lastProviderLookupLocation == undefined && altLocation == undefined) {
                let toast = new PPToast("countryClickFailedToast", 2e3);
                toast.setContents("Sorry, we didn't get that. Try again?");
                toast.showToast();
                return;
            }
            window.dontCentreMap = true;
            await showProvidersDialog(inLatitude, inLongitude, altLocation?.type !== undefined ? altLocation : null);
            window.dontCentreMap = false;
        }
        function kb_selectProvider() {
            const {ol, map, correctLongitude} = window;
            let currentLocation = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
            showCountryClick(currentLocation[1], correctLongitude(currentLocation[0]));
        }
        function selectProvider(inMCC, inMNC, inNetType) {
            let {getNetworkInfo, bootbox, clearBands, MNCSelectBox} = window;
            let mapInView = !$("#sidebar").is(":visible");
            window.MCC = inMCC;
            window.MNC = inMNC;
            let defaultNetType = "LTE";
            if (inMCC === 313 && inMNC === 340) {
                defaultNetType = "NR";
            }
            window.netType = inNetType || defaultNetType;
            window.ARFCNList = [];
            window.BandwidthList = [];
            window.BandList = [];
            window.LACList = [];
            clearBands();
            clearCoverage();
            MNCSelectBox.setValue(inMCC + "" + inMNC);
            $.cookie("selectedProvider", inMCC + "" + inMNC, {
                expires: 3600
            });
            getNetworkInfo(inMCC, inMNC);
            bootbox.hideAll();
            window.showTiles(inMCC, inMNC);
            if (window.isMobileDevice && mapInView) {
                window.toggleMobile();
            }
        }
        function kb_switchLteNr() {
            const {NetSelectBox} = window;
            let netTypesAsText = Object.keys(NetSelectBox.options);
            if (!netTypesAsText.includes("NR") || !netTypesAsText.includes("LTE")) {
                console.log("[PCI+] 4G/5G unavailable on this carrier.");
                let toast = new PPToast("ratUnavailableToast", 3e3);
                toast.setContents("4G/5G unavailable on this carrier.");
                toast.showToast();
                return;
            }
            let currentNetType = window.netType;
            if (currentNetType == "LTE") {
                selectProvider(window.MCC, window.MNC, "NR");
            } else if (currentNetType == "NR") {
                selectProvider(window.MCC, window.MNC, "LTE");
            } else {}
        }
        function kb_switchSectorColors(toast) {
            let currentSetting = sectorColorOptions.find((s => s.value == window.pciPlus_customSectorColors));
            let currentSettingIndex = sectorColorOptions.indexOf(currentSetting);
            devLogger("currentSettingIndex:", currentSettingIndex);
            let nextSetting;
            if (typeof sectorColorOptions[currentSettingIndex + 1] == "undefined") {
                nextSetting = sectorColorOptions[0];
            } else {
                nextSetting = sectorColorOptions[currentSettingIndex + 1];
            }
            devLogger("nextSetting:", nextSetting);
            toggleSetting("pciPlus_customSectorColors", nextSetting.value);
            toast.setContents(`Show Sector Colors: <b>${nextSetting.name}</b>`);
            toast.setupTimeout(3e3);
            toast.showToast();
        }
        function kb_switchToPreviousCarrier() {
            let toast = new PPToast("lastCarrierSwitchToast", 3e3);
            if (!window.prevCarrier) {
                toast.setContents("Carrier has not yet been set, cannot switch.");
                toast.showToast();
                return;
            }
            const lastCarrier = window.prevCarrier[window.prevCarrier.length - 2];
            let currentCarrier;
            if (Number.isNaN(window.MCC) || Number.isNaN(window.MNC)) {
                if (window.prevCarrier.length < 1) {
                    toast.setContents("Carrier has been unset - switch carriers before continuing.");
                    toast.showToast();
                    return;
                }
                currentCarrier = window.prevCarrier[window.prevCarrier.length - 1];
            } else {
                currentCarrier = {
                    MCC: window.MCC,
                    MNC: window.MNC
                };
            }
            let currentCarrierName = window.MNCSelectBox.options["" + currentCarrier.MCC + currentCarrier.MNC].text.split(" - ")[0].trim();
            if (lastCarrier == undefined || currentCarrierName == lastCarrier.name) {
                toast.setContents("You haven't switched networks yet!");
                toast.showToast();
                return;
            }
            const {MCC, MNC, name} = lastCarrier;
            devLogger("Switching to", MCC, MNC);
            toast.setContents(`Switched to <b>${name}</b>`);
            toast.showToast();
            selectProvider(MCC, MNC);
        }
        function kb_toggleMultiSite(toast) {
            toggleSetting("pciPlus_allowSelectMultipleTowers", !window.pciPlus_allowSelectMultipleTowers);
            toast.setContents(`Multi-Site View: <b>${window.pciPlus_allowSelectMultipleTowers ? "Enabled" : "Disabled"}</b>`);
            toast.setupTimeout(3e3);
            toast.showToast();
        }
        function toggleSection(inSection) {
            if (!window.pciPlus_showSidebar) {
                return;
            }
            if (inSection == "General") {
                $("#tabs-2").css("display", "none");
                $("#ppDetailsToggle").css("font-weight", "unset");
                $("#tabs-1").css("display", "block");
                $("#ppGeneralToggle").css("font-weight", "bolder");
            } else if (inSection == "Details") {
                $("#tabs-1").css("display", "none");
                $("#ppGeneralToggle").css("font-weight", "unset");
                $("#tabs-2").css("display", "block");
                $("#ppDetailsToggle").css("font-weight", "bolder");
            } else {
                if ($("#tabs-1").is(":visible")) {
                    toggleSection("Details");
                } else {
                    toggleSection("General");
                }
            }
        }
        function kb_toggleTowerDetails() {
            if (window.pciPlus_showSidebar) {
                toggleSection();
            } else {
                if ($("#modal_tower_details").hasClass("visible")) {
                    window.toggleTowerInfo(false);
                } else {
                    window.toggleTowerInfo(true);
                }
            }
        }
        function kb_showTrueSectors(toast) {
            toggleSetting("pciPlus_showTrueSectors", !window.pciPlus_showTrueSectors);
            toast.setContents(`Show True Coverage: <b>${window.pciPlus_showTrueSectors ? "Enabled" : "Disabled"}</b>`);
            toast.setupTimeout(3e3);
            toast.showToast();
        }
        function kb_scrollSidebar(_, event) {
            let element = "#modal_tower_details_content";
            if (window.pciPlus_showSidebar == true) {
                element = "#ppSidebar";
            }
            $(element).stop();
            if (event.key == "Home") {
                $(element).animate({
                    scrollTop: 0
                });
            } else if (event.key == "PageDown") {
                $(element).animate({
                    scrollTop: "+=500px"
                }, 300);
            } else if (event.key == "PageUp") {
                $(element).animate({
                    scrollTop: "-=500px"
                }, 300);
            } else if (event.key == "End") {
                $(element).animate({
                    scrollTop: $(element)[0].scrollHeight
                });
            }
        }
        function kb_modifyTowerLocation() {
            if (window.currentSite != undefined) {
                $("#dialog-form-tower-locationdialog").modal("toggle");
                setTimeout((() => {
                    $("#combined_input").focus();
                }), 375);
            } else {
                const toast = new PPToast("KbModifyTowerLocationToast", 3e3);
                toast.setContents("No tower is selected!");
                toast.showToast();
            }
        }
        const keyboardShortcuts = [ {
            name: "Show True Sectors",
            triggers: [ "t", "T" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: toast => kb_showTrueSectors(toast)
        }, {
            name: "Switch LTE/NR",
            triggers: [ "s", "S" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => kb_switchLteNr()
        }, {
            name: "Clear Map",
            triggers: [ "q", "Q" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => clearCoverage(true)
        }, {
            name: "Show/Hide Towers",
            triggers: [ "w", "W" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => toggleTowers()
        }, {
            name: "Switch Sector Colors",
            triggers: [ "l", "L" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: toast => kb_switchSectorColors(toast)
        }, {
            name: "Report A Problem",
            triggers: [ "r", "R" ],
            requiresShift: true,
            requiresCtrl: true,
            showInList: false,
            callback: (_toast, event) => {
                event.preventDefault();
                window.updateMNClist();
                if (event.ctrlKey && event.shiftKey) {
                    window.bootbox.alert({
                        centerVertical: true,
                        closeButton: false,
                        size: "large",
                        title: "Report An Error",
                        message: 'Are you experiencing a problem with CellMapper or PCI+? <br/> If so, please consider reporting it in <a href="https://discord.com/channels/980652545938702376/980652545938702379">#feedback.</a> <br/><br/> (<a href="#" onclick="window.location.reload()">Reload Page</a>)',
                        callback: () => {}
                    }).find(".modal-content").css({
                        "text-align": "center"
                    });
                }
                return;
            }
        }, {
            name: "Toggle Trails",
            triggers: [ "r", "R" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => window.toggleTrails()
        }, {
            name: "Toggle Multi-Site View",
            triggers: [ "m", "M" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: toast => kb_toggleMultiSite(toast)
        }, {
            name: "Previous Carrier",
            triggers: [ "b", "B" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => kb_switchToPreviousCarrier()
        }, {
            name: "Refresh Map",
            triggers: [ "y", "Y" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => refreshMap()
        }, {
            name: "Toggle Tower Details",
            triggers: [ "e", "E" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => kb_toggleTowerDetails()
        }, {
            name: "Select Provider",
            triggers: [ "p", "P", "z", "Z" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => kb_selectProvider()
        }, {
            name: "Open Tower Modify",
            triggers: [ "g", "G" ],
            requiresCtrl: false,
            requiresShift: true,
            showInList: true,
            callback: () => kb_modifyTowerLocation()
        }, {
            name: "Scroll Sidebar",
            triggers: [ "Home", "PageUp", "PageDown", "End" ],
            requiresCtrl: false,
            requiresShift: false,
            showInList: false,
            callback: (_, event) => kb_scrollSidebar(_, event)
        } ];
        function createInputSetting(name, id, inputPlaceholder, explanation) {
            const node = textToHtml(src_elements.a("tr", {
                style: "border-top: 1px solid #dee2e6"
            }, src_elements.a("td", {
                style: "border: 0; vertical-align: middle;",
                title: explanation ? explanation : ""
            }, name.replace("⁺", genTooltip(explanation))), src_elements.a("td", {
                style: "width: 100%; max-width: 10.5rem; float: right; border: 0;"
            }, src_elements.a("input", {
                id,
                type: "search",
                class: "form-control",
                placeholder: inputPlaceholder
            }))));
            node.querySelector("input").onkeyup = event => {
                if (event.key == "Enter") {
                    warnOrToggle(id, undefined, event);
                }
                if (event.target.value == "") {
                    warnOrToggle(id, undefined, event);
                }
            };
            return node;
        }
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, (function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
            }));
        }
        function createToggleLinkSetting(name, id, explanation) {
            const node = textToHtml(src_elements.a("tr", {
                style: "border-top: 1px solid #dee2e6"
            }, src_elements.a("td", {
                style: "border: 0; vertical-align: middle;",
                title: explanation ? explanation : ""
            }, name.replace("⁺", genTooltip(explanation))), src_elements.a("td", {
                style: "float: right; border: 0; vertical-align: middle; padding-right: 0.5rem;"
            }, src_elements.a("a", {
                class: "toggleLink",
                "data-state": "false",
                href: "#",
                id
            }, "(Toggle)"))));
            node.querySelector(".toggleLink").onclick = event => {
                warnOrToggle(id, undefined, event);
            };
            return node;
        }
        function hookSettingsMenu() {
            let ppSettingsMenu = document.createElement("table");
            document.getElementById("modal_mapsettings_content").append(ppSettingsMenu);
            let caretIcon = window.pciPlus_showSidebar ? "&#xf150;" : "&#xf151;";
            ppSettingsMenu.outerHTML = src_elements.a("table", {
                style: "border-width: 0px; width: 100%; table-layout: auto; margin-bottom: 1rem;",
                id: "ppSettings",
                class: "table table-striped table-sm"
            }, src_elements.a("thead", null, src_elements.a("tr", {
                class: "",
                style: ""
            }, src_elements.a("td", {
                colspan: "2"
            }, src_elements.a("b", null, "PCI+ Settings")))), src_elements.a("tbody", null, src_elements.a("div", {
                id: "ppDiv"
            })));
            if (window.pciPlus_showSidebar) {
                $("#ppSettings").css("margin-bottom", "0px");
            }
            let settingsMenu = document.querySelector("#ppSettings > tbody");
            for (let categoryName of Object.keys(preferenceCategories)) {
                let category = preferenceCategories[categoryName];
                let defaultCollapseState;
                if (window.getParamOrCookie("pciPlus_showSidebar")) {
                    defaultCollapseState = category.collapsed ? "display:contents" : "display: none";
                } else {
                    defaultCollapseState = !category.collapsed ? "display:contents" : "display: none";
                }
                let tableStyle = "margin-top: 0.25rem; margin-bottom: unset; table-layout: inherit;";
                if (category.shouldShow !== undefined && category.shouldShow() == false) {
                    tableStyle = "display: none; table-layout: inherit;";
                } else {}
                let categoryTable = textToHtml(src_elements.a("table", {
                    class: "table table-striped table-sm",
                    style: tableStyle,
                    id: `${categoryName}SettingsTable`
                }, createHeaderForElement(`↳ ${category.name}`, true, category.collapsed, true), src_elements.a("tbody", {
                    style: defaultCollapseState,
                    id: `${categoryName}SettingsTableBody`
                })));
                settingsMenu.append(categoryTable);
            }
            for (let i of settings) {
                window[i.key] = i.defaultValue;
                if (!i.dontUseCookie) {
                    window[i.key] = window.getParamOrCookie(`${i.key}`, i.defaultValue);
                } else {
                    window[i.key] = i.defaultValue;
                }
                if (i.callbackShouldShowSetting !== undefined) {
                    let shouldShow = i.callbackShouldShowSetting();
                    if (shouldShow === false) {
                        continue;
                    }
                }
                let element;
                if (i.settingType == "boolean") {
                    element = createBoolSetting(i.name, i.key, i.description);
                } else if (i.settingType == "PPMultiSetting") {
                    element = createMultiSetting(i.name, i.key, i.selectOptions, i.description);
                } else if (i.settingType == "PPInput") {
                    element = createInputSetting(i.name, i.key, i.inputPlaceholder, i.description);
                } else if (i.settingType == "PPToggleLink") {
                    element = createToggleLinkSetting(i.name, i.key, i.description);
                } else {
                    devLogger("Something went wrong, and the setting type didn't match on first check for. returning. Key:", i.key);
                    return;
                }
                document.getElementById(`${i.category}SettingsTableBody`).append(element);
                if (i.settingType == "boolean") {
                    $(`#${i.key}`).prop("checked", window[i.key]);
                } else if (i.settingType == "PPMultiSetting" || i.settingType == "PPInput") {
                    $(`#${i.key}`).val(window[i.key]);
                } else if (i.settingType == "PPToggleLink") {
                    $(`#${i.key}`).attr("state", String(window[i.key]));
                } else {
                    devLogger("Something went wrong on the 2nd trip, returning. key:", i.key, "type:", i.settingType);
                    return;
                }
            }
            for (const shortcut of keyboardShortcuts) {
                let possibleTriggers = [ ...new Set(shortcut.triggers.map((char => toTitleCase(char)))) ];
                if (shortcut.showInList == false) {
                    continue;
                }
                let shortcuts = [];
                for (const i of possibleTriggers) {
                    shortcuts.push(src_elements.a("span", null, shortcut.requiresShift ? "Shift + " : "", i));
                    shortcuts.push(src_elements.a("br", null));
                }
                const shortcutElement = src_elements.a("tr", null, src_elements.a("td", {
                    style: "vertical-align: middle;"
                }, shortcut.name), src_elements.a("td", {
                    style: "text-align: center; vertical-align: middle;"
                }, shortcuts));
                $("#keyboardSettingsTableBody").append(shortcutElement);
            }
        }
        function changeWindowTitle() {
            let {netType, currentSite, pciPlus_allowSelectMultipleTowers} = window;
            let selectedMatch = /\b\w{1,3}\s[\d\-]{1,10}\*?\s\((.+)\)/;
            let notSelectedMatch = /\b(.+)\s\(/;
            let currentTitle = document.title;
            let potentialSelectedMatch = currentTitle.match(selectedMatch);
            let potentialNotSelectedMatch = currentTitle.match(notSelectedMatch);
            let currentNetworkName;
            if (potentialSelectedMatch) {
                currentNetworkName = potentialSelectedMatch[1];
            } else if (potentialNotSelectedMatch) {
                currentNetworkName = potentialNotSelectedMatch[1];
            } else {
                devLogger(`[PCI+] Couldn't read the window title`);
            }
            let siteName;
            if (currentSite.towerAttributes.TOWER_NAME === undefined) {
                siteName = String(currentSite.siteID);
            } else {
                siteName = currentSite.towerAttributes.TOWER_NAME;
            }
            document.title = `${genNodeTitle(netType)} ${siteName}${pciPlus_allowSelectMultipleTowers ? "*" : ""} (${currentNetworkName}) - Cellular Coverage and Tower Map`;
        }
        async function addJumpCoverage() {
            const {API_URL, MCC, MNC, netType, handleResponse, ol} = window;
            const cellIdRegex = /^(?:Cell\sIdentifier|Cell\sID)\s?(\d+)/;
            const siteEnb = window.currentSite.siteID;
            const siteLac = window.currentSite.regionID;
            const towerCoverageRequestParams = {
                MCC: String(MCC),
                MNC: String(MNC),
                Region: String(siteLac),
                RAT: netType,
                Site: String(siteEnb)
            };
            const towerCoverageRes = await fetch(API_URL + "/getTowerCoverage?" + new URLSearchParams(towerCoverageRequestParams), {
                credentials: "include"
            });
            const coverageAreas = handleResponse(await towerCoverageRes.json());
            const cellNodes = [ ...document.querySelectorAll("[id^='detailsTable']") ];
            for (let i of cellNodes) {
                try {
                    let cellIdNode = i.rows[1];
                    const cellText = cellIdNode.innerText;
                    let cidMatchOutput = cellText.match(cellIdRegex);
                    if (cidMatchOutput === null) {
                        continue;
                    } else {
                        cidMatchOutput = cidMatchOutput[1];
                    }
                    let coordinates = coverageAreas[cidMatchOutput];
                    if (coordinates == undefined) {
                        console.log("[PCI+] Coordinates not found! Coordinates: ", coordinates, "Coverage Areas:", coverageAreas);
                        break;
                    }
                    let finalCoordinates;
                    if (!coordinates[0]) {
                        console.log("[PCI+] No location data for cell", cidMatchOutput);
                        continue;
                    } else {
                        finalCoordinates = getLatLngCenter(coordinates);
                    }
                    const [lat, long] = finalCoordinates;
                    const zoom = window.map.getView().getZoom();
                    cellIdNode.innerHTML = `<td width="50%">Cell Identifier</td><td style="color:${inline_link_color}; cursor:pointer;" href='#' onclick='if (isMobileDevice) { toggleMobile(); } centreMap(${lat},${long}, true, ${zoom > 18 ? zoom : 18}); highlightByCid(${cidMatchOutput})'>${cidMatchOutput}</td>`;
                } catch (err) {
                    devLogger("[PCI+] We hit a snag, breaking out of the loop:", err);
                    break;
                }
            }
        }
        function centreMap(latitude, longitude, shouldZoomIn, zoom) {
            const {map, bootbox, ol} = window;
            if (latitude == undefined || longitude == undefined) {
                devLogger("Can't centre map, latitude or longitude is undefined");
                return;
            }
            function isInvalidCoord(coord) {
                return coord == 0 || coord == null || coord == undefined || Number.isNaN(coord);
            }
            if (isInvalidCoord(latitude) || isInvalidCoord(longitude)) {
                devLogger("Not centering map; location provided is invalid or (0,0)");
                return;
            }
            if (typeof shouldZoomIn == "undefined" || shouldZoomIn !== false) {
                map.getView().setZoom(zoom || 18);
                map.getView().setCenter(ol.proj.transform([ longitude, latitude ], "EPSG:4326", "EPSG:3857"));
                bootbox.hideAll();
            }
        }
        function getFullSiteName(currentSite) {
            if (typeof currentSite.towerAttributes.TOWER_NAME == "undefined") {
                return currentSite.siteID;
            } else {
                return currentSite.towerAttributes.TOWER_NAME;
            }
        }
        async function searchOpenCellid(OPENCELLID_KEY) {
            let locations = [];
            const currentSite = window.currentSite;
            const currentSiteCells = Object.keys(window.currentSite.cells);
            for (let i of currentSiteCells) {
                devLogger("searching cell:", i);
                let res = await fetch(`https://opencellid.org/cell/get?` + new URLSearchParams({
                    key: OPENCELLID_KEY,
                    mcc: String(currentSite.Provider.countryID),
                    mnc: String(currentSite.Provider.providerID),
                    lac: String(currentSite.regionID),
                    cellid: String(i),
                    radio: currentSite.RAT,
                    format: "json"
                }));
                let openCellIdLocation = await res.json();
                devLogger("res:", openCellIdLocation);
                let cellCoords = [ openCellIdLocation.lat, openCellIdLocation.lon ];
                if (cellCoords[0] != undefined && cellCoords[1] != undefined) {
                    devLogger("Pushing cell coords:", cellCoords);
                    locations.push(cellCoords);
                } else {
                    devLogger(`Not pushing cell ${i} to the list since we didn't get proper coords.`, cellCoords);
                }
            }
            devLogger("locations:", locations);
            if (locations.length > 0) {
                let avgLocation = getLatLngCenter(locations);
                return {
                    ok: true,
                    coords: avgLocation
                };
            } else {
                return {
                    ok: false
                };
            }
        }
        async function searchUnwiredLabs(UNWIREDLABS_TOKEN) {
            let siteLocation = [];
            let currentSite = window.currentSite;
            let currentSiteCells = currentSite.cells;
            let currentSiteKeys = Object.keys(currentSite.cells);
            let cellsToPass = [];
            for (let i of currentSiteKeys) {
                let newObj = {
                    lac: Number(currentSite.regionID),
                    cid: Number(i),
                    psc: currentSiteCells[i].PCI || undefined,
                    signal: "-45"
                };
                cellsToPass.push(newObj);
            }
            devLogger("Cells:", cellsToPass);
            let res = await fetch("https://us1.unwiredlabs.com/v2/process.php", {
                method: "POST",
                body: JSON.stringify({
                    token: UNWIREDLABS_TOKEN,
                    radio: currentSite.RAT,
                    mcc: String(currentSite.Provider.countryID),
                    mnc: String(currentSite.Provider.providerID),
                    cells: cellsToPass,
                    address: 1
                })
            });
            let returnedRes = await res.json();
            devLogger("Returned res:", returnedRes);
            if (returnedRes.lat == undefined || returnedRes.lon == undefined) {
                return {
                    ok: false
                };
            } else {
                siteLocation = [ returnedRes.lat, returnedRes.lon ];
                return {
                    ok: true,
                    coords: siteLocation,
                    accuracy: returnedRes.accuracy,
                    balance: returnedRes.balance
                };
            }
        }
        async function doCalculate() {
            const OPENCELLID_KEY = "pk.aee98c7a94cb0f145aeec135d02c1f97";
            const UNWIREDLABS_KEY = "pk.93be6ad03d6ac78192202e419a8a2144";
            let toast = new PPToast("thirdPartyLookupResult");
            let finalLocation = [];
            let provider;
            let cacheUsed = false;
            let unwiredVars = {
                accuracy: "",
                remainingCredits: 100
            };
            const {currentSite, globalThirdPartyLookupList} = window;
            if (globalThirdPartyLookupList[currentSite.siteID]) {
                const {lat, lon, provider: cachedProvider, unwiredVars: cachedUnwiredVars} = globalThirdPartyLookupList[currentSite.siteID];
                finalLocation = [ lat, lon ];
                provider = cachedProvider;
                cacheUsed = true;
                if (cachedUnwiredVars) {
                    unwiredVars = cachedUnwiredVars;
                }
                devLogger("Lookup: result is cached, skipping search");
            }
            if (finalLocation.length == 0) {
                devLogger("Lookup: Searching Unwired Labs");
                let unwiredResult = await searchUnwiredLabs(UNWIREDLABS_KEY);
                if (unwiredResult.ok === false) {} else {
                    devLogger("we found unwired result:", unwiredResult);
                    finalLocation = [ unwiredResult.coords[0], unwiredResult.coords[1] ];
                    provider = "Unwired Labs";
                    let accuracy = "";
                    if (window.pciPlus_distanceUnit == "km") {
                        accuracy = unwiredResult.accuracy + "m";
                    } else if (window.pciPlus_distanceUnit == "mi") {
                        accuracy = (unwiredResult.accuracy / 1609).toFixed(1) + "mi";
                    }
                    unwiredVars.accuracy = accuracy;
                    unwiredVars.remainingCredits = unwiredResult.balance;
                }
            }
            if (finalLocation.length == 0) {
                devLogger("Lookup: Searching OpenCellID");
                let opencidResult = await searchOpenCellid(OPENCELLID_KEY);
                if (opencidResult.ok == false) {} else {
                    finalLocation = [ opencidResult.coords[0], opencidResult.coords[1] ];
                    provider = "OpenCellID";
                }
            }
            if (finalLocation.length > 0) {
                const isDish = window.currentSite.Provider.countryID == 313 && window.currentSite.Provider.providerID == 340;
                devLogger("Centering map on results, location:", finalLocation);
                if (finalLocation[0] != -1 && finalLocation[1] != -1) {
                    centreMap(finalLocation[0], finalLocation[1], true, isDish ? 20 : 16);
                }
                if (provider == "Unwired Labs") {
                    toast.setContents(`According to ${provider}, <b>${genNodeTitle(window.currentSite.RAT)} ${getFullSiteName(window.currentSite)}</b> is within ${unwiredVars.accuracy}\n        of (${finalLocation[0].toFixed(2)}, ${finalLocation[1].toFixed(2)}). \n        ${!cacheUsed ? `<br/><br/>PCI+ has ${unwiredVars.remainingCredits} requests remaining today.` : ""}`);
                } else if (provider == "OpenCellID") {
                    toast.setContents(`According to ${provider}, <b>${genNodeTitle(window.currentSite.RAT)} ${getFullSiteName(window.currentSite)}</b> is near (${finalLocation[0].toFixed(2)}, ${finalLocation[1].toFixed(2)}).`);
                }
                toast.setupTimeout(1e4);
            } else {
                toast.setupTimeout(5e3);
                toast.setContents("Couldn't find location.");
            }
            toast.showToast();
            const siteId = parseInt(currentSite.siteID);
            window.globalThirdPartyLookupList[siteId] = {
                lat: finalLocation[0] ?? -1,
                lon: finalLocation[1] ?? -1,
                provider,
                unwiredVars: provider == "Unwired Labs" ? {
                    accuracy: unwiredVars.accuracy
                } : undefined
            };
        }
        function generateCellContents(title, text, icon) {
            return textToHtml(src_elements.a("td", {
                style: `\n        padding: 6px;\n        user-select: none;\n        vertical-align: middle;\n        text-align: center;\n        ${title.length == 0 ? "opacity: 0.3; cursor: auto;" : "cursor: pointer;"}\n        `,
                title,
                class: `${title.length == 0 ? "hoverDisabled" : ""} aProviderCell actionsTableCell`
            }, icon, " ", src_elements.a("b", null, text)));
        }
        function addToTable(text, title, icon, href, id, onclick, replace) {
            const actionsTable = document.querySelector("#actionsTableBody > table > tbody");
            if (!actionsTable) {
                return;
            }
            const currentChildNodes = [ ...actionsTable.getElementsByTagName("td") ];
            if (currentChildNodes.length == 0) {
                $("#actionsTableBody > table").append(textToHtml(src_elements.a("tr", null)));
            } else if (currentChildNodes.length % 3 == 0 && currentChildNodes.length != 0) {
                $("#actionsTableBody > table").append(textToHtml(src_elements.a("tr", null)));
            }
            let tableCell = generateCellContents(title, text, icon);
            tableCell.onclick = onclick;
            if (href.includes("#dialog-form")) {
                tableCell.onclick = () => $(href).modal("show");
            }
            tableCell.id = id;
            if (replace) {
                devLogger("replacing on", id, tableCell);
                $("#" + id).replaceWith(tableCell);
            } else {
                $("#actionsTableBody > table > tbody > tr:last-child").append(tableCell);
            }
        }
        const moveToTowerLocation = () => addToTable(`Jump to ${true ? "Tower" : 0} Location⁺`, "Move to the tower's location on the map", "🌐", "", "", (async ev => {
            if (ev.shiftKey && ev.altKey && ev.ctrlKey) {
                await doCalculate();
                return;
            }
            centreMap(window.currentSite.latitude, window.currentSite.longitude, true, 18);
        }));
        const copyTowerLink = () => {
            const {currentSite, isMobileDevice} = window;
            let copyTowerOnclick = () => {
                let newLink = `https://www.cellmapper.net/map?MCC=${window.MCC}&MNC=${window.MNC}&type=${currentSite.RAT}&latitude=${currentSite.latitude.toFixed(5)}&longitude=${currentSite.longitude.toFixed(5)}&zoom=17&ppT=${currentSite.siteID}&ppL=${currentSite.regionID}`;
                copyToClipboard(newLink);
                if (!isMobileDevice) {
                    let toast = new PPToast("ppLinkCopied", 3e3);
                    toast.setHeader(genNodeTitle(currentSite.RAT) + " " + getFullSiteName(currentSite));
                    toast.setContents(src_elements.a("span", null, "Link Copied -", src_elements.a("a", {
                        href: newLink,
                        target: "_blank"
                    }, "(Open in new tab)")));
                    toast.showToast();
                }
            };
            addToTable("Copy Link To Tower⁺", "PCI+ Exclusive! Users without PCI+ installed will not get the full experience.", "🔗", "#", "pciPlusCopyTowerLink", copyTowerOnclick);
        };
        const doTowerLookup = () => addToTable("Request Tower Lookup⁺", "Look up tower location using Unwired or OpenCellID", "🔎", "#", "pciPlusLookupTower", (() => doCalculate()));
        function createActionsTableSection() {
            let actionsTableEl = textToHtml(src_elements.a("table", {
                id: "pciPlusActionsTableSection",
                class: "table table-sm"
            }, createHeaderForElement("Actions", false, false, false, "actionsTableHeader"), src_elements.a("tbody", {
                id: "actionsTableBody",
                style: ""
            })));
            $(actionsTableEl).insertAfter("#modal_tower_details_content > table:nth-child(1)");
        }
        function createActionsTableContainer() {
            let tableCellsToAdd = [];
            const newTable = textToHtml(src_elements.a("table", {
                id: "pciPlusActionsTableContainer",
                class: "table-color-dynamic",
                style: "margin-bottom: 0px;"
            }, src_elements.a("tbody", null)));
            $("#actionsTableBody").append(newTable);
        }
        function transformCmActionsLinks() {
            createActionsTableContainer();
            const emojiMap = {
                "Delete Tower": "❌",
                "Restore Calculated Location": "↩️",
                "Move to Lat/Lng": "📌",
                "Change Tower Type": "⚙️"
            };
            const actionsElement = $("#modal_tower_details_content > table:nth-child(1)").find("ul")[0];
            if (actionsElement == undefined) {
                return;
            }
            const cmElements = [ ...actionsElement.children ];
            for (const i of Object.keys(emojiMap)) {
                const cmElement = cmElements.filter((el => el.innerText == i))[0];
                if (cmElement == undefined) {
                    addToTable(i, "", emojiMap[i], "", "", (() => {
                        event.preventDefault();
                    }));
                } else {
                    const linkElement = cmElement.firstElementChild;
                    const href = linkElement.getAttribute("href");
                    addToTable(i, i, emojiMap[i], href, linkElement.id, linkElement.onclick);
                }
            }
            $("#modal_tower_details_content > table:nth-child(1)").find("td:contains('Actions')").parent().css("display", "none");
        }
        const cmgm_user_id = "pciplus+cmgm=magic";
        const cmgm_update_tac_url = "https://cmgm.us/api/pciplus/updateTac.php";
        const cmgm_tac_update_denied_url = "https://cmgm.us/api/pciplus/updateTacDeny.php";
        const cmgm_get_towers_url = "https://cmgm.us/api/pciplus/getTowers.php";
        const cmgm_update_pcis_url = "https://cmgm.us/api/pciplus/updatePCIs.php";
        const cmgm_add_split_url = "https://cmgm.us/api/pciplus/addNB.php";
        const cmgm_edit_url = "https://cmgm.us/database/Edit.php";
        const cmgm_append_split_name = "Add<br/> CMGM Split⁺";
        const cmgm_append_split_icon = "➗";
        const cmgm_append_split_description = "Mark a CMGM split of another site";
        const addEmptyCmgmSplit = () => addToTable(cmgm_append_split_name, "", cmgm_append_split_icon, "#", "cmgmMarkSplitAction", (() => {}));
        function addActions(actionFuncs, requireUnverified) {
            const {currentSite} = window;
            function dontAddAction(func, funcsArray) {
                return func == addEmptyCmgmSplit && funcsArray.indexOf(addEmptyCmgmSplit) == funcsArray.length - 1 && !window.pciPlus_enableCmgmIntegration;
            }
            for (const currentFunction of actionFuncs) {
                if (requireUnverified && !(currentSite.towerMover === 0)) {
                    break;
                }
                if (dontAddAction(currentFunction, actionFuncs)) {
                    devLogger("Skipping CMGM Action, since CMGM is disabled and there are none after it");
                } else {
                    currentFunction();
                }
            }
        }
        function initActionsTable() {
            createActionsTableSection();
            transformCmActionsLinks();
            const actionsPriorityOne = [ moveToTowerLocation, copyTowerLink ];
            addActions(actionsPriorityOne, false);
            const actionsRequireUnverified = [ doTowerLookup, addEmptyCmgmSplit ];
            addActions(actionsRequireUnverified, true);
        }
        function linkPciInSidebar(jNode) {
            try {
                let {netType, currentSite} = window;
                if (!jNode) {}
                let pciNode;
                if (netType == "LTE" || netType == "NR" || netType == "GSM") {
                    pciNode = jNode[0].rows[3];
                } else if (netType == "UMTS") {
                    pciNode = jNode[0].rows[4];
                } else if (netType == "CDMA") {
                    return;
                }
                let pulledText = pciNode.innerText;
                let pulledPci = pulledText.match(/(?:PCI|PSC|BSIC)[\t|\s]?([0-9]+).*/);
                if (pulledPci !== null) {
                    pulledPci = pulledPci[1];
                } else {
                    return;
                }
                pciNode.innerHTML = `<td width=50%>PCI</td> <td class="pciLink${pulledPci}" style="color:#18BC9C; cursor:pointer;" href='#' onclick= handlePCIPSCSearch(` + pulledPci + "," + currentSite.regionID + ")>" + pulledText.substring(4) + "</td>";
                $(`.pciLink${pulledPci}`).on("click", (evt => {
                    evt.target.style.color = window.darkMode ? pci_loading_color_dark : pci_loading_color;
                }));
            } catch (err) {
                devLogger("Error adding PCI to sidebar:", err);
            }
        }
        /*!
 * long-press-event - v2.4.6
 * Pure JavaScript long-press-event
 * https://github.com/john-doherty/long-press-event
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
        function createLongPressEvent() {
            !function(e, t) {
                "use strict";
                var n = null, a = "PointerEvent" in e || e.navigator && "msPointerEnabled" in e.navigator, i = "ontouchstart" in e || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0, o = a ? "pointerdown" : i ? "touchstart" : "mousedown", r = a ? "pointerup" : i ? "touchend" : "mouseup", m = a ? "pointermove" : i ? "touchmove" : "mousemove", u = a ? "pointerleave" : i ? "touchleave" : "mouseleave", s = 0, c = 0, l = 10, v = 10;
                function f(e) {
                    p(), e = function(e) {
                        if (void 0 !== e.changedTouches) return e.changedTouches[0];
                        return e;
                    }(e), this.dispatchEvent(new CustomEvent("long-press", {
                        bubbles: !0,
                        cancelable: !0,
                        detail: {
                            clientX: e.clientX,
                            clientY: e.clientY,
                            offsetX: e.offsetX,
                            offsetY: e.offsetY,
                            pageX: e.pageX,
                            pageY: e.pageY
                        },
                        clientX: e.clientX,
                        clientY: e.clientY,
                        offsetX: e.offsetX,
                        offsetY: e.offsetY,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        screenX: e.screenX,
                        screenY: e.screenY
                    })) || t.addEventListener("click", (function e(n) {
                        t.removeEventListener("click", e, !0), function(e) {
                            e.stopImmediatePropagation(), e.preventDefault(), e.stopPropagation();
                        }(n);
                    }), !0);
                }
                function d(a) {
                    p(a);
                    var i = a.target, o = parseInt(function(e, n, a) {
                        for (;e && e !== t.documentElement; ) {
                            var i = e.getAttribute(n);
                            if (i) return i;
                            e = e.parentNode;
                        }
                        return a;
                    }(i, "data-long-press-delay", "1500"), 10);
                    n = function(t, n) {
                        if (!(e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame && e.mozCancelRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame)) return e.setTimeout(t, n);
                        var a = (new Date).getTime(), i = {}, o = function() {
                            (new Date).getTime() - a >= n ? t.call() : i.value = requestAnimFrame(o);
                        };
                        return i.value = requestAnimFrame(o), i;
                    }(f.bind(i, a), o);
                }
                function p(t) {
                    var a;
                    (a = n) && (e.cancelAnimationFrame ? e.cancelAnimationFrame(a.value) : e.webkitCancelAnimationFrame ? e.webkitCancelAnimationFrame(a.value) : e.webkitCancelRequestAnimationFrame ? e.webkitCancelRequestAnimationFrame(a.value) : e.mozCancelRequestAnimationFrame ? e.mozCancelRequestAnimationFrame(a.value) : e.oCancelRequestAnimationFrame ? e.oCancelRequestAnimationFrame(a.value) : e.msCancelRequestAnimationFrame ? e.msCancelRequestAnimationFrame(a.value) : clearTimeout(a)), 
                    n = null;
                }
                "function" != typeof e.CustomEvent && (e.CustomEvent = function(e, n) {
                    n = n || {
                        bubbles: !1,
                        cancelable: !1,
                        detail: void 0
                    };
                    var a = t.createEvent("CustomEvent");
                    return a.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), a;
                }, e.CustomEvent.prototype = e.Event.prototype), e.requestAnimFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(t) {
                    e.setTimeout(t, 1e3 / 60);
                }, t.addEventListener(r, p, !0), t.addEventListener(u, p, !0), t.addEventListener(m, (function(e) {
                    var t = Math.abs(s - e.clientX), n = Math.abs(c - e.clientY);
                    (t >= l || n >= v) && p();
                }), !0), t.addEventListener("wheel", p, !0), t.addEventListener("scroll", p, !0), 
                t.addEventListener(o, (function(e) {
                    s = e.clientX, c = e.clientY, d(e);
                }), !0);
            }(window, document);
        }
        function getMapCoordsFromClientCoords(clientX, clientY) {
            const {map, ol} = window;
            let pixel = [ clientX - map.getTargetElement().getBoundingClientRect().left, clientY - map.getTargetElement().getBoundingClientRect().top ];
            let mapCoords = map.getCoordinateFromPixel(pixel);
            let [lon, lat] = ol.proj.transform(mapCoords, "EPSG:3857", "EPSG:4326");
            return [ lat, lon ];
        }
        function getMapCenter() {
            const coords = window.ol.proj.transform(window.map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
            return [ coords[1], coords[0] ];
        }
        function showContextMenu(event, iosEvent) {
            let {isMobileDevice, longitude, latitude, correctLongitude, map, ol, MCC, MNC, netType, userID, bootbox} = window;
            devLogger("Opening context menu");
            let latLong;
            if (event) {
                latLong = ol.proj.transform(event.coordinate, "EPSG:3857", "EPSG:4326");
            } else if (iosEvent) {
                latLong = [ iosEvent.longitude, iosEvent.latitude ];
            } else {
                latLong = getMapCenter().reverse();
            }
            const coords_decimal_places = 5;
            let [lat, long] = [ latLong[1].toFixed(coords_decimal_places), correctLongitude(latLong[0]).toFixed(coords_decimal_places) ];
            const formattedLatLong = lat + ", " + long;
            devLogger("Coordinates: (", formattedLatLong + ")");
            const currentZoom = map.getView().getZoom();
            let generatedCellMapperUrl = `https://www.cellmapper.net/map?MCC=${MCC}&MNC=${MNC}&type=${netType}&latitude=${lat}&longitude=${long}&zoom=${currentZoom.toFixed(1)}`;
            $(".popover-header").css("text-align", "center");
            let menuHtml = "";
            menuHtml += `\n    <a class="menuItem" href="#" onclick="closeMobileMenu(); showCountryClick(${lat}, ${long})">Select Provider</a><br />\n    ${window.userID !== null && window.userCache[userID].premium ? `<a class="menuItem" id="locateClosestTowerMenuItem" href='#' onclick="locateClosestTower('${lat}', '${long}');">Closest Tower</a><br />` : ""}\n    <a class="menuItem" href='#' onclick="closeMobileMenu(); clearCoverage(true, true)">Clear Map</a><br />\n\n    <hr class="menuItem" style="padding:1px; margin: 1px; text-align: center;" />`;
            if (MCC >= 310 && MCC <= 316) {
                menuHtml += `<a class="menuItem" href="https://www.antennasearch.com/HTML/search/search.php?address=${lat}%2C${long}" target="_blank" rel="noreferrer">AntennaSearch</a><br />`;
            }
            menuHtml += `<a class="menuItem" href="https://www.google.com/maps/@${lat},${long},20z" target="_blank" rel="noreferrer">Google Maps</a><br />\n    `;
            if (window.pciPlus_enableCmgmIntegration) {
                menuHtml += `\n    <a class="menuItem" href="https://cmgm.us/database/Edit.php?q=${lat},${long}&locsearch" target="_blank" rel="noreferrer">CMGM Edit</a>\n    <a class="menuItem" href="https://cmgm.us/database/Map.php?latitude=${lat}&longitude=${long}&zoom=18&pin_style=carrier" target="_blank" rel="noreferrer">(Map)</a>\n    <br />`;
            }
            devLogger("formatted lat/lng:", formattedLatLong);
            menuHtml += `<a href="https://www.google.com/maps?layer=c&cbll=${lat},${long}" target="_blank" rel="noreferrer">Google Street View</a><br />\n    <a class="menuItem" href="https://bing.com/maps/default.aspx?cp=${lat}~${long}&dir=0&lvl=21&style=b&pciPlusBirdsEye=true" target="_blank" rel="noreferrer">View Bird's Eye</a><br />\n    <hr class="menuItem" id=copyPadding style="padding:1px; margin: 1px; text-align: center;" />\n    <a class="menuItem" id=locationAsText title="${formattedLatLong}" href='#' onclick='copyToClipboard("${formattedLatLong}"); parsedCoordinates.push("${formattedLatLong.replace(" ", "")}")'>Copy Coords</a><br />\n    <a class="menuItem" id=locationAsUrl title="${generatedCellMapperUrl}" href='#' onclick='copyToClipboard("${generatedCellMapperUrl}")'>Copy URL</a><br />\n     `;
            $(".popover-body").css("text-align", "center");
            if (!isMobileDevice) {
                $(".popover-header").css("text-align", "center");
                $(".popover-body").css("text-align", "center");
                $(".popover-body").html(menuHtml);
            } else {
                let contextMenuDialog = bootbox.alert({
                    size: "small",
                    message: menuHtml
                });
                devLogger(contextMenuDialog);
                contextMenuDialog.find(".modal-body").css({
                    "text-align": "center",
                    display: "grid",
                    "grid-auto-flow": "row",
                    "grid-row-gap": "15px"
                });
                contextMenuDialog.find(".modal-footer").css({
                    display: "none"
                });
            }
        }
        function patchAppOnly() {
            const refreshControlEl = textToHtml(src_elements.a("div", {
                id: "cmAppRefreshControl",
                class: "refresh-control ol-unselectable ol-control",
                style: "pointer-events: auto;"
            }, src_elements.a("button", {
                title: "Refresh Map Page"
            }, src_elements.a("i", {
                class: "z fa fa-power-off"
            }))));
            refreshControlEl.onclick = () => {
                refreshMap(true);
            };
            const refreshControlControl = new window.ol.control.Control({
                element: refreshControlEl
            });
            var controls = window.map.getControls();
            controls.insertAt(controls.getLength(), refreshControlControl);
        }
        function patchMobileWebOnly(select_interaction, toggleMobile, isMobileDevice, $) {
            select_interaction.getFeatures().on("add", (e => {
                let marker = e.element;
                if (marker.get("base") != undefined && isMobileDevice) {
                    toggleMobile();
                }
            }));
            var dialog;
            let icon = document.querySelector(".navbar-brand");
            icon.onclick = () => {
                if ($("#sidebar").is(":visible")) {
                    toggleMobile();
                } else {
                    showContextMenu();
                }
                return false;
            };
            let meta = document.createElement("meta");
            meta.name = "viewport";
            meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
            document.getElementsByTagName("head")[0].appendChild(meta);
        }
        function patchIosAppOnly() {
            devLogger("Hiding navbar!");
            $(".navbar").css("display", "none");
            const movedModals = [ "#modal_searchtools_details", "#modal_account_details", "#modal_mapsettings_details", "#modal_tower_details", "#modal_provider_details" ];
            for (const modal of movedModals) {
                $(modal).css("left", "0px");
                $(modal).addClass("hidden");
            }
            const mergedModals = [ "#modal_provider_details", "#modal_filters_details" ];
            for (const modal of mergedModals) {
                $(`${modal}`).addClass("visible");
                $(`${modal}`).removeClass("hidden");
            }
            $(".modal_dialog_base").css({
                "max-height": "100%",
                "max-width": "100%",
                width: "100%",
                height: "100%",
                top: "unset"
            });
            $("#ppSettings > tbody").append($("#modal_filters_details > .modal_top_header"));
            $("#ppSettings > tbody").append($("#modal_filters_details_content"));
            $("#modal_account_details").prepend($("#modal_select_provider_content"));
            $("#modal_account_details").prepend($("#modal_select_provider > .modal_top_header"));
            $("#modal_account_details").append($("#whatsnew"));
            $(".modal-close-button").css("display", "none");
            $("#button-menu-button").css("display", "none");
            window.toggleModal = () => {};
            window.toggleTowerInfo = () => showModal("modal_tower_details");
            const modalIds = {
                0: "map_canvas",
                1: "modal_tower_details",
                2: "modal_account_details",
                3: "modal_mapsettings_details",
                4: "modal_searchtools_details"
            };
            function showModal(modalToToggle) {
                const toggleableModals = Object.values(modalIds);
                for (let modalId of toggleableModals) {
                    if (modalId != modalToToggle) {
                        $("#" + modalId).addClass("hidden");
                        $("#" + modalId).removeClass("visible");
                    }
                }
                const modalId = `#${modalToToggle}`;
                $(modalId).removeClass("hidden");
                $(modalId).addClass("visible");
                const modalTagNumber = Object.values(modalIds).indexOf(modalToToggle);
                window.webkit.messageHandlers.highlightTab.postMessage(modalTagNumber);
            }
            window.changeIosNavTab = tabId => {
                devLogger("Opening Tab With ID:", tabId, "called:", modalIds[tabId]);
                showModal(modalIds[tabId]);
            };
            createLongPressEvent();
            const mapEl = document.getElementById("map_canvas");
            mapEl.setAttribute("data-long-press-delay", "500");
            mapEl.addEventListener("long-press", (e => {
                window.ppIosLongPressDone = true;
                const [lat, lon] = getMapCoordsFromClientCoords(e.detail.clientX, e.detail.clientY);
                showContextMenu(null, {
                    latitude: lat,
                    longitude: lon
                });
            }));
        }
        function patchAllMobile() {
            document.getElementById("NETSelect-ts-control").setAttribute("readonly", "readonly");
            document.getElementById("BandSelect-ts-control").setAttribute("readonly", "readonly");
            $("#location_search")[0].type = "search";
            $("#tower_search")[0].type = "search";
            $("#pcipsc_search")[0].type = "search";
            $("#cell_search")[0].type = "search";
            $("#datefrom")[0].type = "search";
            $("#dateto")[0].type = "search";
            $("#tac_search")[0].type = "search";
            $("#MNCSelect-ts-control")[0].type = "search";
            document.oncontextmenu = () => {};
            waitForKeyElements(".modal-dialog", (() => {
                $(".modal-dialog").css("margin", "auto");
                $(".modal-dialog").css("margin-top", "3%");
            }));
            $(".ol-attribution").hide();
            window.pciPlus_allowSelectMultipleTowers = false;
            $.cookie("pciPlus_allowSelectMultipleTowers", false);
            window.pciPlus_doColorsBySite = false;
            $.cookie("pciPlus_doColorsBySite", false);
        }
        function patchMobile() {
            let {select_interaction, toggleMobile, isMobileDevice} = window;
            console.log("[PCI+] Adding patches for mobile devices...");
            if (window.CMApp !== undefined) {
                patchAppOnly();
            } else if (window.navigator.userAgent.match(/CellMapperIos/i)) {
                patchIosAppOnly();
            } else {
                patchMobileWebOnly(select_interaction, toggleMobile, isMobileDevice, $);
            }
            patchAllMobile();
        }
        function getCommaSeparatedPcis(cells) {
            let pciList = [];
            for (let i of Object.values(cells)) {
                if (!pciList.includes(i.PCI)) {
                    pciList.push(i.PCI);
                }
            }
            const pciListString = pciList.toString();
            return pciListString;
        }
        function getCreateUrl(currentSite) {
            const pciListString = getCommaSeparatedPcis(currentSite.cells);
            let createArgs = {
                pciplus: String(true),
                plmn: `${currentSite.Provider.countryID}${currentSite.Provider.providerID}`,
                latitude: String(currentSite.latitude),
                longitude: String(currentSite.longitude),
                pci: pciListString
            };
            if (currentSite.RAT == "LTE") {
                createArgs.LTE_1 = currentSite.siteID;
                createArgs.region_lte = currentSite.regionID;
            } else if (currentSite.RAT == "NR") {
                createArgs.NR_1 = currentSite.siteID;
                createArgs.region_nr = currentSite.regionID;
            }
            return cmgm_edit_url + "?" + new URLSearchParams(createArgs);
        }
        function updateCreateUrl() {
            const {currentSite, pciPlus_enableCmgmIntegration} = window;
            const createLinkElements = document.querySelectorAll(".cmgmCreateLink");
            if (!pciPlus_enableCmgmIntegration) {
                return;
            }
            if (createLinkElements == null) {
                return;
            }
            const newCreateLink = getCreateUrl(currentSite);
            for (let element of [ ...createLinkElements ]) {
                element.href = newCreateLink;
            }
        }
        async function doOverride(inMCC, inMNC, inRAT, inLAC, inBase, inCellId, lat, lng, inAction, inAttribute, inValue, towerProperName, copyLinkOnly) {
            const {API_URL, handleResponse, select_interaction, CoveragePolygonLayer, moveTower, removeTowerFromMap, currentTranslate, map, getTowersInView, currentTranslateList} = window;
            let requestParams = {
                MCC: String(inMCC),
                MNC: String(inMNC),
                Region: String(inLAC),
                RAT: inRAT,
                Site: String(inBase),
                CellID: String(inCellId),
                Latitude: String(lat),
                Longitude: String(lng)
            };
            if (inAction) {
                requestParams.action = inAction;
            }
            if (inAttribute) {
                requestParams.attribute = inAttribute;
                requestParams.attribute_value = inValue;
            }
            const overrideCallUrl = API_URL + "overrideData?" + new URLSearchParams(requestParams);
            if (copyLinkOnly) {
                copyToClipboard(overrideCallUrl);
                return;
            }
            let res = await fetch(overrideCallUrl, {
                credentials: "include"
            });
            let overrideResponseText = handleResponse(await res.json());
            let baseName = towerProperName || inBase ? String(towerProperName || inBase) : "";
            if (overrideResponseText == "OKAY") {
                if (!(inAttribute == "TOWER_TYPE" && inValue == "DAS") && !window.isMobileDevice) {
                    let toast = new PPToast("overrideSuccessfulToast" + baseName, 5e3);
                    if (baseName.length > 0) {
                        toast.setHeader(genNodeTitle(inRAT) + " " + baseName);
                    }
                    toast.setContents("Action successful. It may take some time for your changes to propagate.");
                    toast.showToast();
                }
                select_interaction.getFeatures().clear();
                if (currentTranslateList[inBase]) {
                    map.removeInteraction(currentTranslateList[inBase]);
                }
                if (CoveragePolygonLayer) {
                    CoveragePolygonLayer.getSource().clear();
                }
                if (lat == 0 && lng == 0) {
                    removeTowerFromMap(inMCC, inMNC, inRAT, inLAC, inBase);
                }
                if (inAttribute == "TOWER_TYPE" && inValue == "DAS") {
                    removeTowerFromMap(inMCC, inMNC, inRAT, inLAC, inBase);
                    let toast = new PPToast("mapRefreshingToast" + baseName, 5e3);
                    if (baseName.length > 0) {
                        toast.setHeader(genNodeTitle(inRAT) + " " + baseName);
                    }
                    toast.setContents("Action Successful. DAS split loading...");
                    toast.showToast();
                    setTimeout((function() {
                        if (window.MCC == inMCC && window.MNC == inMNC) {
                            getTowersInView(inMCC, inMNC, false, inRAT);
                        } else {
                            devLogger("Not refreshing, MCC/MNC don't match");
                        }
                    }), 5e3);
                }
                devLogger("coords:", lat, lng);
                if (inAction && inValue && inAttribute) {
                    devLogger("meta change, switch label", inAction, inValue, inAttribute);
                    moveTower(inMCC, inMNC, inRAT, inLAC, inBase, null, null, null, window.currentSite.towerMover > 0 ? true : false, inAttribute == "TOWER_TYPE" ? inValue : null);
                    return;
                }
                if (lat == -1 && lng == -1) {
                    moveTower(inMCC, inMNC, inRAT, inLAC, inBase, null, null, null, false);
                    return;
                }
                if (lat != 0 && lng != 0) {
                    moveTower(inMCC, inMNC, inRAT, inLAC, inBase, null, lat, lng, true);
                    window.currentSite.latitude = Number(lat);
                    window.currentSite.longitude = Number(lng);
                    if (window.pciPlus_enableCmgmIntegration) {
                        updateCreateUrl();
                    }
                }
            }
        }
        function handleTowerModify(copyOnly) {
            let {currentSite} = window;
            devLogger("called to modify tower, copy:", copyOnly);
            const latLongRegex = /^((?:-?(?:90|(?:\d|[1-8]\d)(?:\.\d+){0,1})))\,{1}\s?((?:-?(?:180|(?:\d|\d\d|1[0-7]\d)(?:\.\d+){0,1})))$/;
            let combinedInput = $("#combined_input")[0];
            let combinedInputValue = combinedInput.value;
            let latitudeInput = $("#latitude_input")[0];
            let latitudeInputValue = latitudeInput.value;
            let longitudeInput = $("#longitude_input")[0];
            let longitudeInputValue = longitudeInput.value;
            if (combinedInputValue.length > 0) {
                let coordinates = combinedInputValue.trim();
                let matchedCoordinates = coordinates.match(latLongRegex);
                devLogger("Found coords for match:", combinedInputValue, matchedCoordinates);
                var latitude = matchedCoordinates[1];
                var longitude = matchedCoordinates[2];
            } else if (latitudeInputValue.length > 0 && longitudeInputValue.length > 0) {
                var latitude = latitudeInputValue.trim();
                var longitude = longitudeInputValue.trim();
            } else {
                $("#toastMessageBody").html("Please fill out all fields correctly.");
                $("#toastMessage").toast("show");
                return;
            }
            doOverride(currentSite.Provider.countryID, currentSite.Provider.providerID, currentSite.RAT, parseInt(currentSite.regionID), parseInt(currentSite.siteID), null, latitude, longitude, null, null, null, currentSite.towerAttributes.TOWER_NAME || currentSite.siteID, copyOnly ? true : undefined);
            $("#latitude_input").val("");
            $("#longitude_input").val("");
            $("#combined_input").val("");
        }
        function modifyTowerPopup() {
            const latLongRegex = /^((?:-?(?:90|(?:\d|[1-8]\d)(?:\.\d+){0,1})))\,{1}\s?((?:-?(?:180|(?:\d|\d\d|1[0-7]\d)(?:\.\d+){0,1})))$/;
            let inputDialogFieldsetElement = $("#dialog-form-tower-locationdialog").find("fieldset")[0];
            let coordinatesInput = document.createElement("div");
            coordinatesInput.innerHTML = `\n    <label \n      for="coordinates_input">\n      Combined Coordinates\n    </label>\n    <input \n      type="text"\n      name="combined_input"\n      id="combined_input"\n      class="form-control text ui-widget-content ui-corner-all"\n      placeholder="12.34567, -98.7654"\n      data-error="Invalid coordinates"\n      >\n    </input>\n    `;
            inputDialogFieldsetElement.oninput = e => {
                const hasData = e.target.value.length > 0;
                document.getElementById("latitude_input").required = !hasData;
                document.getElementById("longitude_input").required = !hasData;
            };
            const copyButton = src_elements.a("button", {
                style: `margin-right: auto; display: ${window.pciPlus_showApiCopyButton ? "block" : "none"}`,
                class: "btn btn-warning",
                id: "modifyTowerLocationCopyButton"
            }, "Copy");
            $("#modifyTowerLocationForm").find(".modal-footer").prepend(copyButton);
            $("#modifyTowerLocationCopyButton").on("click", (() => {
                event.preventDefault();
                const copyFeedbackToast = new PPToast("apiLinkCopyFeedbackToast" + window.currentSite.siteID, 3e3);
                if ($("#modifyTowerLocationForm")[0].checkValidity()) {
                    handleTowerModify(true);
                    $("#dialog-form-tower-locationdialog").modal("hide");
                    copyFeedbackToast.setContents("Override link copied!");
                    copyFeedbackToast.showToast();
                } else {
                    devLogger("failed!");
                    copyFeedbackToast.setContents("Please fill out all fields");
                    copyFeedbackToast.showToast();
                }
            }));
            $("#modifyTowerLocationForm").on("submit", (e => {
                if ($("#modifyTowerLocationForm")[0].checkValidity()) {
                    handleTowerModify();
                    $("#dialog-form-tower-locationdialog").modal("hide");
                }
                e.preventDefault();
                return false;
            }));
            inputDialogFieldsetElement.append(coordinatesInput);
            $("#modifyTowerLocationForm")[0].checkValidity = () => {
                devLogger("checking validity");
                if ($("#combined_input")[0].checkValidity() && $("#combined_input")[0].value.trim().match(latLongRegex)) {
                    devLogger("Combined Validity checks PASSED");
                    return true;
                } else if ($("#latitude_input")[0].checkValidity() && $("#longitude_input")[0].checkValidity() && $("#latitude_input")[0].value.length > 0 && $("#longitude_input")[0].value.length > 0) {
                    devLogger("Separate Validity checks PASSED");
                    return true;
                } else {
                    devLogger("All validity checks FAILED");
                    return false;
                }
            };
        }
        const is_key_down = (() => {
            const state = {};
            window.addEventListener("keyup", (e => state[e.key] = false));
            window.addEventListener("keydown", (e => state[e.key] = true));
            window.addEventListener("blur", (() => {
                let keys = Object.getOwnPropertyNames(state);
                keys.forEach((prop => {
                    delete state[prop];
                }));
            }));
            return key => state.hasOwnProperty(key) && state[key] || false;
        })();
        async function getTowers(MCC, MNC, siteId, siteIds, showFields) {
            if (siteId == undefined && siteIds == undefined) {
                throw new Error("Not a valid Site ID!");
            } else if (siteId !== undefined && siteIds !== undefined) {
                throw new TypeError("You cannot pass both a siteId and array of siteIds!");
            }
            let idList = siteId || siteIds.toString();
            const cmgmReqParams = {
                id: String(idList),
                plmn: `${MCC}${MNC}`
            };
            if (showFields) {
                cmgmReqParams.properties = showFields;
            }
            const res = await fetch(cmgm_get_towers_url + "?" + new URLSearchParams(cmgmReqParams), {
                cache: "no-cache"
            });
            const cmgmResult = await res.json();
            devLogger("CMGM returned:", cmgmResult);
            if (cmgmResult.hasOwnProperty("error")) {
                throw new Error(cmgmResult.error);
            } else {
                if (siteId !== undefined) {
                    return cmgmResult[siteId];
                } else if (siteIds !== undefined) {
                    return cmgmResult;
                }
            }
        }
        async function addSplitTower(position, splitId, cmgmId) {
            const {userID} = window;
            devLogger("starting add split tower");
            let userName;
            if (userID == null) {
                userName = "Anonymous";
            } else {
                userName = (await getUser(userID)).userName;
            }
            devLogger("username:", userName);
            const reqForm = new FormData;
            reqForm.set("userID", cmgm_user_id);
            reqForm.set("username", userName);
            reqForm.set("id", String(cmgmId));
            reqForm.set("splitId", String(splitId));
            reqForm.set("pos", position);
            devLogger("form:", reqForm, cmgm_user_id, userName, cmgmId, splitId, position);
            const req = await fetch(cmgm_add_split_url, {
                method: "POST",
                body: reqForm
            });
            let res = await req.json();
            if (res.hasOwnProperty("error") || !req.ok || !res.ok) {
                const errorText = res.error;
                devLogger("Error occured adding split:", errorText);
                return {
                    ok: false,
                    pinCoordsIncluded: null,
                    coordsToPin: null,
                    error: errorText
                };
            }
            let cmgmSuccessResponse = res;
            const pinCoordsIncluded = !(cmgmSuccessResponse.splitPinCoordinates == undefined || cmgmSuccessResponse.splitPinCoordinates == null || cmgmSuccessResponse.splitPinCoordinates.latitude == null || cmgmSuccessResponse.splitPinCoordinates.longitude == null);
            let returnObj = {
                ok: true,
                pinCoordsIncluded
            };
            if (pinCoordsIncluded) {
                returnObj.coordsToPin = {
                    latitude: cmgmSuccessResponse.splitPinCoordinates.latitude,
                    longitude: cmgmSuccessResponse.splitPinCoordinates.longitude
                };
            }
            return returnObj;
        }
        async function lookupTowerMoveLocation(latitude, longitude, towerMoveToast) {
            let originalLatLng = [ latitude, longitude ].toString();
            window.lastMovedTowerOriginalLatLng = originalLatLng;
            let jsonRes;
            try {
                let res = await fetch("https://nominatim.openstreetmap.org/reverse?" + new URLSearchParams({
                    lat: latitude,
                    lon: longitude,
                    format: "json",
                    limit: "1",
                    callback: "?"
                }));
                jsonRes = await res.json();
                devLogger("res:", jsonRes);
            } catch (err) {
                devLogger("Fetching address for pin location failed:", err);
                return;
            }
            let location;
            if (jsonRes.address.house_number == undefined && jsonRes.address.road == undefined) {
                devLogger("Didn't get an address");
                return;
            } else if (jsonRes.address.house_number == undefined && jsonRes.address.road !== undefined) {
                location = jsonRes.address.road;
            } else {
                location = `${jsonRes.address.house_number} ${jsonRes.address.road}`;
            }
            devLogger("final location:", location);
            if (towerMoveToast.isVisible()) {
                let endLatLng = [ latitude, longitude ].toString();
                devLogger("endlatlng", endLatLng);
                if (endLatLng != window.lastMovedTowerOriginalLatLng) {
                    devLogger("not the same! We won't replace");
                } else {
                    $("#towerMoveToastQuestion")[0].innerHTML = $("#towerMoveToastQuestion")[0].innerHTML.replace(/(the current location|the provided location)/, `<b>${location}</b>`);
                }
            }
        }
        async function handleTowerMove_handleTowerMove(marker, latitude, longitude, altSite, altMessage, callbackTowerNotMoved, callbackTowerMoved) {
            devLogger("prompted for tower move to", latitude, longitude);
            const towerMCC = marker?.get("MCC") ?? altSite.Provider.countryID;
            const towerMNC = marker?.get("MNC") ?? altSite.Provider.providerID;
            const towerRAT = marker?.get("system") ?? altSite.RAT;
            const towerLAC = marker?.get("regionID") ?? altSite.regionID;
            let towerId = marker?.get("base") ?? altSite.siteID;
            let towerMoveToast = new PPToast("towerMoveToast" + towerId);
            let towerName = towerId;
            if (altSite) {
                towerName = getFullSiteName(altSite);
            } else {
                if (marker.get("towerAttributes").TOWER_TYPE !== undefined && marker.get("towerAttributes").TOWER_TYPE == "DAS") {
                    towerName = marker.get("towerAttributes").TOWER_NAME;
                }
            }
            let q = document.createElement("div");
            q.id = "towerMoveToastQuestion";
            q.innerHTML = altMessage ?? `Are you sure you would like to move <b>${genNodeTitle(towerRAT)} ${towerName}</b> to the ${altSite ? "provided" : "current"} location?`;
            let yesButton = document.createElement("button");
            yesButton.onclick = () => {
                window.doOverride(towerMCC, towerMNC, towerRAT, towerLAC, towerId, null, latitude, longitude, null, null, null, towerName);
                devLogger("overriding tower", towerMCC, towerMNC, towerRAT, towerLAC, towerId, null, latitude, longitude, null, null, null, towerName);
                if (callbackTowerMoved) {
                    callbackTowerMoved();
                }
                towerMoveToast.clearTimeout();
                towerMoveToast.hideToast();
            };
            yesButton.innerText = "Yes";
            yesButton.classList.add("btn");
            yesButton.classList.add("btn-danger");
            let noButton = document.createElement("button");
            noButton.onclick = () => {
                towerMoveToast.clearTimeout();
                towerMoveToast.hideToast();
                if (callbackTowerNotMoved) {
                    callbackTowerNotMoved();
                }
            };
            noButton.innerText = "No";
            noButton.classList.add("btn");
            noButton.classList.add("btn-success");
            let copyButton = document.createElement("button");
            copyButton.innerText = "Copy";
            copyButton.classList.add("btn");
            copyButton.classList.add("btn-warning");
            copyButton.setAttribute("style", "float: right;");
            copyButton.onclick = () => {
                doOverride(towerMCC, towerMNC, towerRAT, towerLAC, towerId, null, parseFloat(latitude), parseFloat(longitude), null, null, null, towerName, true);
                towerMoveToast.hideToast();
                const copySuccessfulToast = new PPToast("apiLinkCopySuccessToast" + towerId, 3e3);
                copySuccessfulToast.setContents("Override link copied!");
                copySuccessfulToast.showToast();
                if (callbackTowerMoved) {
                    callbackTowerMoved();
                }
            };
            let messageBody = document.createElement("div");
            messageBody.appendChild(q);
            messageBody.appendChild(document.createElement("br"));
            messageBody.appendChild(yesButton);
            messageBody.append(" ");
            messageBody.appendChild(noButton);
            if (window.pciPlus_showApiCopyButton) {
                messageBody.appendChild(copyButton);
            }
            towerMoveToast.onClose((() => {
                if (callbackTowerNotMoved) {
                    callbackTowerNotMoved();
                }
            }));
            towerMoveToast.setContents(messageBody);
            towerMoveToast.showToast();
            towerMoveToast.setupTimeout(2e4);
            if (window.pciPlus_lookupAddressWhenMoving) {
                lookupTowerMoveLocation(latitude, longitude, towerMoveToast);
            }
        }
        function addCmgmSplitAction(currentSite) {
            addToTable(cmgm_append_split_name, cmgm_append_split_description, cmgm_append_split_icon, "#", "cmgmMarkSplitAction", (() => {
                const toast = new PPToast("cmgmMarkSplitActionClickToast");
                renderToast_enterSplitMode(toast, currentSite);
                if (window.cmgmSplitMode) {
                    devLogger("Reclicked action, split cancelled");
                    toast.hideToast();
                    window.cmgmSplitMode = undefined;
                    return;
                }
                window.cmgmSplitMode = {
                    cm: window.currentSite
                };
            }), true);
        }
        function handleCmgmSplitOriginProvided(marker) {
            const toast = new PPToast("cmgmMarkSplitActionClickToast");
            renderToast_askSplitConfirm(toast, marker);
        }
        async function handleSplitMakeRequest(clickedSiteMarker, originSite, toast) {
            const mcc = clickedSiteMarker.get("MCC");
            const mnc = clickedSiteMarker.get("MNC");
            const clickedSiteId = clickedSiteMarker.get("base");
            const clickedSiteRat = clickedSiteMarker.get("system");
            let cmgmInfo;
            let cmgmError = false;
            try {
                cmgmInfo = await getTowers(mcc, mnc, clickedSiteId);
            } catch (err) {
                cmgmError = err;
            }
            devLogger("cmgm response:", cmgmInfo, cmgmError);
            if (originSite.siteID == clickedSiteMarker.get("base")) {
                toast.setContents("The site cannot be a split of itself!");
                toast.setupTimeout(5e3);
                toast.showToast();
                return;
            } else if (originSite.Provider.countryID != mcc && originSite.Provider.ProviderID != mnc) {
                toast.setContents("You can't set a split across two networks!");
                toast.setupTimeout(5e3);
                toast.showToast();
                return;
            } else if (cmgmError == "Error: No results found for anything in query.") {
                toast.setContents("That site isn't on CMGM, so you can't set a split of it.");
                toast.setupTimeout(5e3);
                toast.showToast();
                return;
            } else if (cmgmError) {
                devLogger("CMGM presented an error:", cmgmError);
                toast.setContents(src_elements.a("span", null, "CMGM returned an error.", src_elements.a("br", null), src_elements.a("code", null, cmgmError)));
                toast.setupTimeout(5e3);
                toast.showToast();
            } else {
                toast.hideToast();
            }
            const siteFullName = genNodeTitle(originSite.RAT) + " " + getFullSiteName(originSite);
            let lteTds = [];
            for (let i = 1; i <= 9; i++) {
                const td = renderCmgmPositionTableCell("LTE", i, originSite, cmgmInfo);
                lteTds.push(td);
            }
            let nrTds = [];
            for (let i = 1; i <= 3; i++) {
                const td = renderCmgmPositionTableCell("NR", i, originSite, cmgmInfo);
                nrTds.push(td);
            }
            bootbox.dialog({
                size: "large",
                closeButton: false,
                onEscape: () => {
                    $(".cmgmSplitLocButton").off("click");
                },
                message: src_elements.a("div", null, src_elements.a("p", null, "Where does ", src_elements.a("b", null, siteFullName), " belong?"), src_elements.a("table", {
                    class: "table table-lg w-5"
                }, src_elements.a("tr", null, lteTds), src_elements.a("br", null), src_elements.a("tr", null, nrTds)))
            });
            $(`.cmgmSplitLocButton`).on("click", (async event => {
                const buttonClicked = event.target.innerText;
                const res = await addSplitTower(buttonClicked, parseInt(originSite.siteID), parseInt(cmgmInfo.id));
                if (res && res.ok) {
                    if (res.pinCoordsIncluded && (originSite.towerMover == undefined || originSite.towerMover < 1)) {
                        await handleTowerMove_handleTowerMove(null, res.coordsToPin.latitude, res.coordsToPin.longitude, originSite, `CMGM sent a new location for <b>${siteFullName}</b>. <br/>Would you like to move it to the provided location?`, (() => {
                            renderToast_cmgmConfirmedSuccess(originSite, siteFullName, clickedSiteRat, clickedSiteId);
                        }));
                    } else {
                        renderToast_cmgmConfirmedSuccess(originSite, siteFullName, clickedSiteRat, clickedSiteId);
                    }
                } else {
                    const toast = new PPToast("CMGMError", 5e3);
                    toast.setContents(`CMGM encountered an error${res.error ? ":<br/><code>" + res.error + "</code>" : "."}`);
                    toast.showToast();
                }
                $(".cmgmSplitLocButton").off("click");
                window.bootbox.hideAll();
            }));
        }
        function renderCmgmPositionTableCell(rat, num, cm, cmgmInfo) {
            let currentSelectorName = `${rat}_${num}`;
            if (cmgmInfo[currentSelectorName]) {
                return src_elements.a("td", {
                    class: "aProviderCell cellDisabled"
                }, src_elements.a("i", null, cmgmInfo[currentSelectorName]));
            } else {
                return src_elements.a("td", {
                    class: `aProviderCell cmgmSplitLocButton hoverPointer ${rat !== cm.RAT ? "cellDisabled" : ""}`
                }, currentSelectorName);
            }
        }
        function renderToast_cmgmConfirmedSuccess(originSite, siteFullName, clickedSiteRat, clickedSiteId) {
            const completedToast = new PPToast("CmgmSplitSuccessfulToast" + originSite.siteID);
            completedToast.setHeader("CMGM");
            completedToast.setContents(`<b>${siteFullName}</b> is now a split of <b>${genNodeTitle(clickedSiteRat)} ${clickedSiteId}</b>!`);
            completedToast.setupTimeout(5e3);
            completedToast.showToast();
        }
        function renderToast_askSplitConfirm(toast, marker) {
            toast.setupTimeout(99999999999);
            const clickedSiteId = parseInt(marker.get("base"));
            const clickedSiteRat = marker.get("system");
            const originSite = window.cmgmSplitMode.cm;
            const originSiteId = originSite.siteID;
            const originSiteRat = originSite.RAT;
            toast.setContents(src_elements.a("span", null, "Are you sure you want to mark", " ", src_elements.a("b", null, genNodeTitle(originSiteRat), " ", originSiteId), " ", "as a split of", " ", src_elements.a("b", null, genNodeTitle(clickedSiteRat), " ", clickedSiteId), "?", src_elements.a("br", null), src_elements.a("br", null), src_elements.a("button", {
                class: "btn btn-danger",
                id: "cmgmYesMarkSplitButton"
            }, "Yes"), src_elements.a("button", {
                class: "btn btn-success",
                id: "cmgmNoMarkSplitButton"
            }, "No")));
            $("#cmgmYesMarkSplitButton").on("click", (() => {
                devLogger(`CMGM: setting ${originSiteId} as split of ${clickedSiteId}`);
                handleSplitMakeRequest(marker, originSite, toast);
                window.cmgmSplitMode = undefined;
            }));
            $("#cmgmNoMarkSplitButton").on("click", (() => {
                devLogger("cancel split operation");
                toast.hideToast();
                window.cmgmSplitMode = undefined;
            }));
        }
        function renderToast_enterSplitMode(toast, currentSite) {
            toast.setHeader("CMGM");
            toast.onClose((() => {
                devLogger("Split Action was cancelled");
                window.cmgmSplitMode = undefined;
            }));
            toast.setContents(src_elements.a("span", null, "You've enetered split mode for", " ", src_elements.a("b", null, genNodeTitle(currentSite.RAT), " ", getFullSiteName(currentSite)), ".", src_elements.a("br", null), "Click the primary ", genNodeTitle(currentSite.RAT), " to continue."));
            toast.showToast();
        }
        function addTranslate(marker, siteId) {
            let translateInteraction = new ol.interaction.Translate({
                features: new ol.Collection([ marker ])
            });
            translateInteraction.on("translatestart", (evt => {
                if (evt.mapBrowserEvent.originalEvent.button === 1) {
                    devLogger("Middle button pressed, ignore translate");
                    event.preventDefault();
                    return false;
                }
                startCoords = ol.proj.transform(marker.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
                if (CoveragePolygonLayer != null) CoveragePolygonLayer.setVisible(false);
                return true;
            }));
            let endCoords;
            translateInteraction.on("translateend", (evt => {
                endCoords = ol.proj.transform(marker.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
                if (CoveragePolygonLayer != null) CoveragePolygonLayer.setVisible(true);
                if (diff(endCoords[0], startCoords[0]) || diff(endCoords[1], startCoords[1])) {
                    handleTowerMove(marker, endCoords[1], endCoords[0]);
                }
                return translateInteraction;
            }));
            map.addInteraction(translateInteraction);
            currentTranslate = translateInteraction;
            currentTranslateList[siteId] = translateInteraction;
        }
        function overrideSelectInteractionEventListener() {
            var originalInteractionEventListener = select_interaction.features_.listeners_.add[0];
            select_interaction.features_.listeners_.add[0] = async e => {
                const {toggleTowerInfo} = window;
                if (window.ppIosLongPressDone) {
                    window.ppIosLongPressDone = false;
                    select_interaction.getFeatures().clear();
                    devLogger("Detected iOS long-press, goodbye");
                    return;
                }
                let marker = e.element;
                devLogger("user clicked:", e);
                if ($(".ol-tooltip").length > 0) {
                    e.stopPropagation();
                    return false;
                }
                if (marker.get("measure") != undefined) {
                    return false;
                }
                if (marker.get("base") == undefined && marker.get("CID") != undefined) {
                    devLogger("Clicked sector with marker", marker);
                    toggleSection("Details");
                    if (isMobileDevice) {
                        toggleTowerInfo(true);
                    }
                    let cidsOnCurrentTower = Object.keys(currentSite.cells);
                    if (pciPlus_allowSelectMultipleTowers && !cidsOnCurrentTower.includes(marker.get("CID"))) {
                        devLogger("Clicked sector not in currently selected tower, returning");
                        return;
                    }
                    if (window.pciPlus_showSidebar) {
                        $("html,body,#ppSidebar").animate({
                            scrollTop: $("#detailsTable" + marker.get("CID")).offset().top - $("#detailsTable" + marker.get("CID")).parent().offset().top - $("#detailsTable" + marker.get("CID")).parent().scrollTop()
                        }, 400, (function() {
                            $(`#detailsTable${marker.get("CID")}`).fadeOut(100).fadeIn(100);
                        }));
                    } else {
                        let detailsTableCell = $("#detailsTable" + marker.get("CID"));
                        $("#modal_tower_details_content").animate({
                            scrollTop: detailsTableCell.offset().top - $("#modal_tower_details_content").offset().top + $("#modal_tower_details_content").scrollTop()
                        }, 400, (function() {
                            detailsTableCell.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                        }));
                    }
                    $(`#detailsTable${marker.get("CID")}`).css("border-style", "dashed");
                    if (prevHighlightedSector != undefined && prevHighlightedSector != marker) {
                        let prevHighlightedCid = prevHighlightedSector.get("CID");
                        prevHighlightedSector.setStyle(sectorStyles[prevHighlightedCid]);
                        $(`#detailsTable${prevHighlightedCid}`).css("border-style", "solid");
                    }
                    if (marker.getStyle() == sectorStyles[marker.get("CID")]) {
                        marker.setStyle(sectorStylesHighlighted[marker.get("CID")]);
                        prevHighlightedSector = marker;
                    } else {
                        marker.setStyle(sectorStyles[marker.get("CID")]);
                    }
                    return;
                }
                if (marker.get("base") != undefined) {
                    if (window.cmgmSplitMode !== undefined) {
                        handleCmgmSplitOriginProvided(marker, cmgmSplitMode);
                        return;
                    }
                    if (window.currentTranslateList[marker.get("base")] && isMobileDevice) {
                        devLogger("Removing translate interaction for", marker.get("base"));
                        map.removeInteraction(currentTranslateList[marker.get("base")]);
                    }
                    if (pciPlus_showSidebar) {
                        toggleSection("Details");
                        $("#ppSidebar").animate({
                            scrollTop: 0
                        }, 500);
                    }
                    if (is_key_down("Shift") && !pciPlus_allowSelectMultipleTowers) {
                        toggleSetting("pciPlus_allowSelectMultipleTowers", true);
                        let multiSiteEnabledToast = new PPToast("keyboardShortcutToast", 3e3);
                        multiSiteEnabledToast.setContents(`Multi-Site View: <b>${pciPlus_allowSelectMultipleTowers ? "Enabled" : "Disabled"}</b>`);
                        multiSiteEnabledToast.showToast();
                    }
                    getBaseStation(marker.get("MCC"), marker.get("MNC"), marker.get("LAC"), marker.get("base"));
                    addTranslate(marker, marker.get("base"));
                    return;
                }
                if (marker.get("SCU_TYPE") != undefined) {
                    devLogger("CCI SC clicked, showing popup");
                    let coordinates = e.element.getGeometry().getCoordinates();
                    const {CC_ADDRESS, CC_CITY, CC_ZIP_CODE, FORMATTED_ADDRESS, NAME, SCU, SCU_TYPE, STUSPS} = marker.values_;
                    const table = src_elements.a("table", {
                        class: "table table-sm",
                        style: "border-radius: 8px; margin-bottom: 0px; border: unset;"
                    }, src_elements.a("tbody", null, src_elements.a("tr", null, src_elements.a("td", {
                        width: "30%"
                    }, "Node Type"), src_elements.a("td", null, SCU_TYPE)), src_elements.a("tr", null, src_elements.a("td", {
                        width: "30%"
                    }, "Address"), src_elements.a("td", null, FORMATTED_ADDRESS)), src_elements.a("tr", null, src_elements.a("td", {
                        width: "30%"
                    }, "Market"), src_elements.a("td", null, NAME))));
                    $("#cciPopup").empty();
                    $("#cciPopup").append(table);
                    devLogger("coordinate to set:", coordinates);
                    $("#cciPopup").show();
                    window.pciPlus_cciOverlay.setPosition(coordinates);
                    return;
                }
                originalInteractionEventListener(e);
            };
        }
        function addWhatsNew() {
            let whatsNew = src_elements.a("table", {
                id: "whatsnew",
                class: "table table-sm"
            }, src_elements.a("thead", null, src_elements.a("tr", {
                class: "",
                style: ""
            }, src_elements.a("td", null, "What's New"))), src_elements.a("tbody", {
                style: ""
            }));
            $("#ppSettings").after(whatsNew);
            if (window.pciPlus_showSidebar == false) {
                $("#whatsnew").css("margin-bottom", "0px");
            }
        }
        let changelog = [ {
            version: "1.16.0",
            releaseDate: "xxxx-xx-xx",
            changes: {
                new: [ "<b>Add preliminary support for iOS App</b>", "<b>Add support for FCC Signal Strength polygons (via CoverageMap)</b>", "<b>Add 'Dark' and 'OLED Black' Color Themes (@codyingaround, @RaccoonCast)</b>", "<b>On popular sites, prioritize Premium contributors (@RaccoonCast)</b>", "Automatically solve CAPTCHAs on CellMapper Wiki", "<b>Significantly improve tower rendering performance (especially with labels disabled)</b>", "Launch PCI+ immediately if <code>injectPciPlus</code> window variable is set (enabling use as a bookmarklet)", "Add new basemap layers (OSM Transit, LARIAC Satellite, MassGIS Satellite)", "Mouse over name in User History to get User ID", "'Band Selector Filters Sectors' setting allows users to hide irrelevant sectors", "Add button to locate site based on detected clipboard coordinates (@RaccoonCast)", "Rewritten Wiki rendering for CellMapper allows faster processing and fewer bugs", "CMGM: Append splits from within PCI+", "Add 'Large Tiles' toggle, to help view undermapped layers (@RaccoonCast)", "Use MCC location as tertiary backup for Select Provider", "Display realtime status of in-progress PCI Search (@RaccoonCast)", "Add button to filter by hidden frequency bands", "Show carrier color in User History if carrier name is enabled", "AntennaSearch results page links directly to Maprad.io (@RaccoonCast)", "<b>Modified towers show updated position and style immediately, with no waiting period</b>", "Add interactive link to edit redirected wiki pages (@RaccoonCast)", "Add 'PCI + Sector ID' rendering option", "Add 'Copy' button for PCI Search results (@RaccoonCast)", "Show location for 'Restored Calculated Location' in Tower History (@RaccoonCast)", "Shift + Enter in 'Pinned by User' input shows User History", "Input <code>lat, lng, zoom</code> into Location Search to precisely center map (@RaccoonCast)" ],
                improvement: [ "Hide CMGM 'Carrier not supported' message (@lukeiamyourda)", "Assign class name to actions table cells for easier custom theming (@RaccoonCast)", "Make disabled actions more obvious (@RaccoonCast)", "Add description for API copy button (@RaccoonCast)", "Improve precision of Unwired Labs location lookups", "Refresh map when PCI+ Input Filter cleared (@codyingaround)", "Hide Macros filter should also apply to decommissioned towers (@codyingaround)", "Also add class name to DL/UL Speed table rows (@RaccoonCast)", "Offer to open copied tower link in new tab (@RaccoonCast)", "Improve handling of ppT/ppL links (@RaccoonCast)", "Update styles for PCI+ Settings to improve readability", "Add tooltips in PCI+ Settings, to better explain the role of each preference", "Use PCI+ links in User History", "Don't use nominatim for coordinate location searches", "Clarify names of some US operators in User History", "Improve loading sequence for CMGM info table", "Show block names for n77 (3.7GHz) and DoD (3.45GHz)", "Improve coordinate filter for clipboard check", "Improve speed of map with Signal Trails enabled", "Improve PCI+ Rendering performance with towers disabled", "Reduce unnecessary toasts on mobile devices", "Disable session persistence for Tower ID & Band filters", "Reduce Tower Search result zoom from 20 to 19 (@RaccoonCast)", "Improve toast wording for various CMGM actions (@RaccoonCast)", "Modify changelog generator for updated Discord markdown specifications", "Improve DAS Safety Check failure notification (@RaccoonCast)", "PCI+ Rendering now in Beta (previously Alpha)", "Don't Title Case modern CMGM <code>cellsite_type</code>s", "Use updated clipboard APIs for improved reliability", "Improve wording of CMGM prompts on unverified / missing sites", "Organize 'Base Map' list into categories, reducing visual clutter", "Use more precise location in Tower History", "Fully cache third-party lookup results, avoiding duplicate requests", "Use locale-formatted numbers for User History statistics", "Don't clear map when closing Tower Details modal if Multi-Site is enabled (@mystica555)" ],
                patch: [ "Show ★ symbol in top bar pane for Premium users (@RaccoonCast)", "Frequency / Band information may appear multiple times in cell details table (@RaccoonCast)", "Close Bing Maps side menu when Bird's eye launched from external link", "Fix support for ESRI maps at high zoom level (@RaccoonCast)", "Captcha may incorrectly disappear", "Page may not load correctly if captcha is presented at startup", "Separate 'Low Accuracy' and 'Decommissioned' toggles for users of PCI+ Rendering (@lukeiamyourda)", "Don't centre map if provided location is invalid (@RaccoonCast)", "Band selector may be incorrectly re-organized after switching RAT", "Translate event may trigger upon middle-click on Windows or macOS", "Prevent 'Marketing' table from incorrectly appearing for users with Premium", "Remove unnecessary 200px padding on modals" ],
                bug: [ "Rapid successive CMGM interactions may cause errors on high-latency connections (@RaccoonCast, @lukeiamyourda)", "Sidebar may be scaled incorrectly on some monitors", "CellMapper link may be added to incorrect Google Maps menus (@RaccoonCast)", "Various issues could cause sidebar to fail to load (@RaccoonCast)", "Keyboard shortcut handler could present errors when some keys were pressed (@RaccoonCast)", "Users upgrading from PCI+ 1.14 may experience issues with 'Hide DAS' filter", "Map may load with incorrect color theme background", "Premium indicator ★ may incorrectly appear multiple times", "Tower Locator + Contributors may not load correctly on high-latency connections", "CDMA towers not handled correctly in some instances", "Reduce probability of sectors being incorrectly retained on the map", "PCI Search may fail with CMGM enabled if fewer than 15 results are returned", "'Group Towers' setting may be incorrectly left enabled with PCI+ Rendering", "Keyboard shortcuts with multiple modifiers may accidentally trigger other shortcuts", "Carrier PLMN may appear undefined in sidebar", "<code>showBand</code> parameter in URL may not work correctly", "User History modal may not fully disappear from page", "CMGM may recieve incorrect coordinates when a site is created via PCI+ (@RaccoonCast)", "CMGM address may be incorrectly formatted if CMGM reported an unsupported value", "User History modal may display rows with incorrect width", "'Blank' basemap may not be reflected correctly in the selection box if loaded via mapType attribute", "Injector settings may be reset in the event of an update to the browser or extension (@RaccoonCast)", "Some PCI+ filters may not work on Chrome for Android mobile devices (@RaccoonCast)", "Revived tower may not appear if window RAT is different than tower RAT (@RaccoonCast)", "Fix capitalization in 'Tower Pinned By' filter placeholder", "Tower Search may fail with Hex IDs (@RaccoonCast)" ]
            }
        }, {
            version: "1.15.0",
            releaseDate: "2023-05-01",
            changes: {
                new: [ "DAS Safety Check prevents conflicts when splitting towers", "New Dark Mode brings usability improvements and automatic switching", "PCI+ Actions Panel replaces default CM bulleted list", "API 'Copy' button allow PCI+ users to send a tower move action to others", "Google Maps: 'Open in CellMapper' action in Street View vertical-ellipsis menu", "Filter Towers by the user that pinned them (@RaccoonCast)", "PCI+ Filter to remove Picocells", "Middle-click to enter Street View on desktop", "<code>&ppC</code> URL parameter for Cell Search (supports iOS Siri Shortcut)", "Optionally overlay Crown Castle's Small Cell Map (c/o @RaccoonCast)", "Show Tower ID in User History for deleted LTE cells (@RaccoonCast)", "'Refresh' control for App users (@RaccoonCast)", "Dev: Add Chrome Extension Publish to CI deploy pipeline", "Show 'Legacy' button in T-Mobile US NR Tower History" ],
                improvement: [ "Prepend stacked toasts to modal top instead of appending them at the bottom", "Don't prompt for CMGM TAC update if NR TAC is invalid", "Don't prompt for CMGM TAC update if tower is decommissioned (@RaccoonCast)", "Automatically focus combined input after using Shift+G shortcut", "Make sidebar float on map, allowing for easier stylesheet modification", "Update map immediately after Show Towers is re-renabled with PCI+ Rendering enabled", "Add minimum width size for toasts (@RaccoonCast)", "New filtering options for DAS towers (@codyingaround, @RaccoonCast)", "Add element ID to Tower History modal (@RaccoonCast)", "PCI+ Rendering now automatically refershes when changing a default CellMapper filter", "Override CM 'Imperial Units' setting with PCI+ 'Unit of Distance' setting", "Fully block CM telemetry to avoid errors + sharing bad data", "Significantly speed up map refresh", "Clarify context menu copy actions (@codyingaround, @mystica555)", "Tower Move toast timeout increased to 20s (from 10s)" ],
                patch: [ "Bing Maps: Improve reliability of 'Bird's Eye' launch", "<b>Remove bug which could cause duplicate locator/contributors</b>", "Significantly speed up loading of contributors", "Mobile towers could be dragged accidentally while moving the map", "Draggable tower interaction may be removed from incorrect tower after a different one is moved", "Enable use of enter key in Modify Tower Location", "Enabled Band filter to also work on sites with estimated bands", "Map may show load carrier towers after tower is marked as DAS", "Clarify FS/LS on DAS is Parent date (@RaccoonCast)", "Copy/Share context menu will appear upon select in Android Chrome / CMApp", "Band Selector will reset upon switching RAT (@RaccoonCast)" ],
                bug: [ "Star may appear multiple times in the Account tab (@RaccoonCast)", "Some user history buttons may incorrectly move forward instead of backward (@RaccoonCast)", "'First Seen' filter end date was incorrectly compared to tower 'Last Updated' value (@RaccoonCast)", "PCI search may fail to complete with CMGM integration enabled", "DAS icons could in some cases appear green immediately after map is loaded", "CMGM site type may display incorrect capitalization if a record uses legacy site types (@RaccoonCast)", "PCI+ Settings could display misaligned borders for some setting types", "Cell Search functionality may not open result correctly", "Towers may be duplicated if PCI+ rendering was not initialized immediately (@RaccoonCast)", "PCI+ Rendering may log errors to console before Map is initialized", "Error toast may not appear if an incorrect tower move location is submitted", "PCI+ may incorrectly show CMGM TAC popup if RAT is switched mid-request on high-latency connections (@RaccoonCast)", "Clipboard functionality may not work correctly for users of the CellMapper app", "Patches may fail to apply if one or more cells was missing an ARFCN and Patch Sector Colors was enabled", "Clarified types for FDD / TDD Freq Band Names" ]
            }
        }, {
            version: "1.14.0",
            releaseDate: "2023-03-05",
            changes: {
                new: [ "<b>PCI+ Rendering</b> - A new, faster, method of loading and filtering towers. [Alpha]", "Preference Categories - sort preferences and make it easier to toggle the ones you use most often", "AntennaSearch: displays ASR, FAA, and Callsign in search results", "Move 'My contributions only' to Filters section for mobile app users", "CMGM: Show table with important information (Build, Evidence, Photos, Street View)", "CMGM: Automatically update PCIs upon clicking a site with CMGM Integration enabled", "CMGM: Prompt to update TAC in CMGM if database does not match CellMapper", "CMGM: Show verified site address versus approximated one from Nominatim (@RaccoonCast)", "Fully Rewritten User History dialog, with support for quick pagination", "Home, End, PgUp, and PgDown keys will scroll sidebar even when not focused", "Show site coordinates in Tower History view (@mystica555)", "Show operator name in User History view (@RaccoonCast, @codyingaround)" ],
                improvement: [ "Enable LTE+NR PCI Search by default", "Re-add CellMapper default keyboard shortcuts", "Increased the size of post-update changelog for improved readability", "Trim extraneous spaces in combined lat/lng input", "Improve pen/stylus support for freehand drawing in Measure", "Show source of result for Request Tower Lookup" ],
                patch: [ "Show T-Mobile US n2 sites when n25 is selected [requires PCI+ Rendering] (@RaccoonCast)", "Hide Modify Tower forms after Esc key pressed", "Show ★ symbol in 'Account' pane for Premium users", "Allow multiple toasts to exist on screen at the same time (@RaccoonCast)" ],
                bug: [ "Missing space in Override Confirmation toast (@RaccoonCast)", "Removed unnecessary header for 'What's New' when Sidebar was disabled", "'Show Low Accuracy' option may not correctly reflect filter status", "State of preference in sidebar may be inaccurate if toggled with keyboard shortcuts (@RaccoonCast)", "Error could occur if user was not in userCache upon tower history lookup", "Moving DAS tower could show unformatted Cell ID in confirmation prompt", "Quick-Select Tower Types text could be selected accidentally", "Multiple Legacy wiki pages could be rendered simultaneously for users on high-latency connections", "DAS Cell IDs were not correctly represented when performing a third-party location lookup", "Coordinates were not updated immediately when site is pinned, potentially resulting in incorrect coordinates passed to CMGM (@RaccoonCast)", "Removed unnecessary [PCI+] indicator in some toasts", "HTML tags could incorrectly appear in generated Markdown changelog" ]
            }
        }, {
            version: "1.13.0",
            releaseDate: "2023-01-13",
            changes: {
                new: [ "Support for CellMapper App (Beta, requires patcher)", "AntennaSearch shows FCC callsign in search results (@RaccoonCast)", "Moving your mouse over an active toast will reset its dismiss timeout" ],
                improvement: [ "CMGM: Add support for NR Creation", "CMGM: Clarify whether a pin is verified or unverified in CMGM", "Remove vestigial remnants of Small Cell parsing code", "Tower Lookup toast will no longer disappear until manually dismissed" ],
                patch: [ "Ensure that TomSelects do not retain focus after enter key pressed (c/o @RaccoonCast)", "Disabled keyboard input on mobile for Band and RAT selectors", "Patched issue which caused 'Search' button in keyboard Select Provider to fail on mobile", "Don't draw line in app when your location is calculated at (0,0)", "<b>Remove annoying 'Zoom in to display more towers' alert</b>", "Show close button for CellMapper 'Message' toast" ],
                bug: [ "Window Title may not accurately update after selecting a DAS tower", "NR results may appear in LTE PCI search results when combination setting was disabled", "LTE results may show NR TAC in header tooltip when combination setting was disabled" ]
            }
        }, {
            version: "1.12.2",
            releaseDate: "2022-12-22",
            changes: {
                new: [ "Use cached location for Select Provider if available (@RaccoonCast)", "Show colored border for some carriers in Select Provider (@RaccoonCast)" ],
                improvement: [ "Dev: Automatically sign Firefox build, deploy with GitHub Actions", "NR PCI Searching now enabled for CMGM" ],
                patch: [ "Signal Trails setting is not respected when switching RAT", "&tilesEnabled parameter is not respected when passed to CM at launch", "Signal Trails cookie is not stored after setting is changed" ],
                bug: [ "NetSelectBox was not updated when clicking PCI Search results of a different RAT (@RaccoonCast)", "Measure button may show incorrect icon (@RaccoonCast)" ]
            }
        }, {
            version: "1.12.1",
            releaseDate: "2022-12-22",
            changes: {
                new: [ "Show legacy wiki pages for oDAS towers" ],
                improvement: [ "Cross LTE/NR search can also be performed from NR origin (@RaccoonCast)", "Highlight NR gNBs in PCI search results" ],
                patch: [ "Added checks for invalid / non-numeric lat/long values passed to centreMap" ],
                bug: [ "Firefox Developer Hub automated tests may fail, preventing upload", "Show Low Accuracy cookie may be incorrectly updated to the wrong value (@RaccoonCast)" ]
            }
        }, {
            version: "1.12.0",
            releaseDate: "2022-12-15",
            changes: {
                new: [ "Add quick-select buttons for changing tower type", "Dev: Add support for direct installation of PCI+ as a Chrome (MV3) and Firefox (MV2) extension", "Add support for NR PCI Search", "New setting to allow combination LTE+NR PCI Searches", "Add CMGM results to same-TAC PCI Search results" ],
                improvement: [ "CMGM status now added to tower details more cleanly, allows for delayed response from CMGM server (@RaccoonCast)", "Use PPToast in the event of Select Provider errors", "Significantly speed up 'Hide Country' feature", "Hide scrollbar on sidebar for Firefox users", "Moved AntennaSearch search buttons above the sidebar, making them easier to use", "Utilize userCache for User History lookups, improving speed and reducing external API calls", "PCI Search now supports DAS tower names" ],
                patch: [ "Low Accuracy Towers filter may not be preserved across sessions (@RaccoonCast, @codyingaround)", "Prevent automatically map refresh after tower override (except for DAS)" ],
                bug: [ "Sidebar may be able to scroll horizontally", "Tower may still be selected after coverage is cleared", "Clipboard check may throw errors if unsupported by browser" ]
            }
        }, {
            version: "1.11.1",
            releaseDate: "2022-11-29",
            changes: {
                new: [ "Added Shift-P shortcut for Select Provider (@codyingaround)" ],
                bug: [ "Sector Coverage Area may show N/A on high latency connections (@RaccoonCast)", "Toast close button may not be visible on some devices (@RaccoonCast)" ]
            }
        }, {
            version: "1.11.0",
            releaseDate: "2022-11-29",
            changes: {
                new: [ "Added Shift-E shortcut to toggle between 'General' and 'Details' tabs (@RaccoonCast)", "Added ability to view previous changelogs", "Hide 'Macro' labels on towers (others are unaffected)", "Show 'Coverage Area' of sector polygons", "Added all sorts of support for CMGM", "Added custom color labels for DAS (Blue) and Decom (Gray) towers when 'Display Tower Labels' is off", "Added option to colorize dots by TAC" ],
                improvement: [ "Modified sidebar to fit CM's new navbar height", "Dev: Improved type organization & decreased build time", "Dev: Cleaned up use of unsupported HTML tags", "Support DAS IDs in window title", "Added Dark Mode support for links created by PCI+", "Add separator for PCI+ actions in actions panel", "Removed wiki small cell parsing from build (natively replaced by new CM functionality)", "Added close option to PCI+ toasts (should help on mobile)", "Improve random color formula so similar numbers shouldn't produce similar results" ],
                patch: [ "Changed 'Bands' to 'Band' when there is only 1 band present on a tower", "Tower icons now scale properly when enabled, so they don't look gigantic upon zooming in", "Shortened 'DECOMMISSIONED' to 'Decom' in tower names (@codyingaround)" ],
                bug: [ "Fixed an issue parsing location from context menu on mobile", "Reviving a tower with a different RAT than the selected one meant the tower may not be visible after jumping", "NR PCI search may not clarify that it's actually searching LTE, if there were no results found", "PCI Search may show 'In-LAC Results' header even when results did not exist", "Some toasts may incorrectly appear persistently on the map (@RaccoonCast)", "Fixed issue with sidebar not scrolling to the correct extents", "updateMNClist may not check for NaN correctly", "clearCoverage may call GetNetworkTitle even when it is not ready to be called" ]
            }
        }, {
            version: "1.10.0",
            releaseDate: "2022-11-12",
            changes: {
                new: [ "Added 'Revive Deleted Towers' — If you accidentally delete something, you may now be able to restore it from within the history modal.", "Added 'Contact' button to User History modal", "View tower history from within user history modal", "View LTE TAC on mouseover of NR TAC in tower details (@RaccoonCast)", "Added 'Points Per Cell' stat in User History menu (hover mouse over stats to view)" ],
                improvement: [ "User History and Small Cell feedback now use PPToast (@RaccoonCast)", "Updated README to improve iOS installation instructions", "(Dev) Expanded scope of type-checking", "Remove use of !important to override modal_table class for sidebar (@RaccoonCast)", "Add class selectors to elements of details table (@RaccoonCast)", "Don't duplicate frequency for TDD when 'Combine' UL/DL Freq' is enabled", "Show toast after location lookup, including precision info for Unwired Labs results", "Ignore beginning/end whitespace on Lat/Lng input", "(Dev) Markdown changelog is now also generated alongside HTML for upload to #changelog" ],
                patch: [ "Show sector details on mobile after details modal has already been closed" ],
                bug: [ "Event listener override may cause errors on mobile devices", "links with <code>?ppT=&ppL=</code> may not show tower details panel on mobile", "Context Menu may not be able to trigger Select Provider on mobile", "getBaseStation patches may trigger an infinite loop if getBaseStation errors", "Jump to Tower Location doesn't show context on hover", "'Edit Site' links may not appear on older browsers, and Firefox", "Provider selected via Right Click → Select Provider may not persist upon page reload", "Bootstrap may not remove toasts from DOM correctly, causing problems with interaction below toast", "Moving tower with separate lat/lng inputs could result in a tower being moved to the wrong location (@lukeiamyourda)", "Google Maps menu may not update correctly after the first time it's opened" ]
            }
        }, {
            version: "1.9.0",
            releaseDate: "2022-10-22",
            changes: {
                new: [ "Add optional persistent sidebar" ],
                improvement: [ "Auto-update prompt should now appear in most cases, even if PCI+ is otherwise unable to load", "(Dev) Changelog will be processed and generated automatically at build-time" ],
                patch: [ "Shorten Tower Search placeholder (@RaccoonCast)", "Signal trails may re-appear upon band change despite being disabled (@RaccoonCast)", "Reduced animation length in tower details table", "Dish Wireless could incorrectly default to 4G rather than 5G", "Remove annoying table open/close animation" ],
                bug: [ "Temporarily disabled Azimuth in Measure", "Shift+B Shortcut may not work correctly after changing netType", "Country may not properly be hidden from Provider select", "Visiting a link with <code>ppT</code> parameter may not show tower details panel" ]
            }
        }, {
            version: "1.8.4",
            releaseDate: "2022-10-15",
            changes: {
                bug: [ "Combined lat/lng input may not function properly after CM update" ]
            }
        }, {
            version: "1.8.3",
            releaseDate: "2022-10-14",
            changes: {
                improvement: [ "Improve callback support for preference toggling" ],
                bug: [ "CM Update 2022-10-14 broke hooks on the 'Modify Tower' modal", "CM Update 2022-10-14 broke hooks for keyboard shortcuts" ]
            }
        }, {
            version: "1.8.2",
            releaseDate: "2022-10-10",
            changes: {
                bug: [ "'View Bird's Eye' on CellMapper may show an incorrect or imprecise location (@codyingaround)" ]
            }
        }, {
            version: "1.8.1",
            releaseDate: "2022-10-08",
            changes: {
                new: [ "Lookup sites using Unwired and OpenCellID (see #changelog for details)" ],
                patch: [ "Prevent map clicks from closing active tower and removing polygons (@mystica555)", "Show menu by default for desktop users" ],
                bug: [ 'Custom PCI+ "Edit" parameters for particular site may not appear properly', "Sidebar scrolling broken for small cells", "Sidebar scrolling broken after clicking on sector polygon", "Deleted users' history may not be navigable via prev/next buttons (@RaccoonCast)", "TAC Search not patched to behave properly on Chrome for Android (@RaccoonCast)", "PCI search could throw uncaught errors upon searching TAC without PCI", "Sidebar sector colors do not match map sector colors with 'Override' enabled (@RaccoonCast)", "Clicking small cell towers after they had initially been loaded onto the map may not show tower details view (@RaccoonCast)" ]
            }
        }, {
            version: "1.8.0",
            releaseDate: "2022-10-02",
            changes: {
                bug: [ "Fixed incorrect spacing in Tower Search results popup", "Deleted user accounts may not show history table", "Fixed addSettings breaking plugin for new PCI+ version", "Revert measure distance to control (rather than context menu)" ]
            }
        }, {
            version: "1.7.2",
            releaseDate: "2022-09-19",
            changes: {
                bug: [ "Clicking on polygons may throw an error due to missing assignment when patching interaction event listener" ]
            }
        }, {
            version: "1.7.1",
            releaseDate: "2022-09-19",
            changes: {
                improvement: [ "PCI+ now runs at document-start, to prevent issues with custom query parameters" ],
                bug: [ "Override in sidebar hook could cause errors to be thrown if OL controls were not present" ]
            }
        }, {
            version: "1.7.0",
            releaseDate: "2022-09-19",
            changes: {
                new: [ "Add <code>?ppS</code> query parameter, for performing location searches", "Add option to hide country in sidebar" ],
                improvement: [ "Preserve tower in search bar when using <code>?ppT</code> query parameter" ],
                bug: [ "User History modal may report a number of towers 'located', rather than 'modified' (@RaccoonCast)", "Move Measure to Context Menu (until CM fixes ol-control bug introduced on 2022-09-19)", "Update Select Provider to support TomSelect (cm 2022-09-19)", "Update Shift+S shortcut to support TomSelect (cm 2022-09-19)", "Re-add 'What's New' menu for PCI+ changelogs (cm 2022-09-19)" ]
            }
        }, {
            version: "1.6.1",
            releaseDate: "2022-09-12",
            changes: {
                bug: [ "1.6.1: PCI+ may prompt to jump to copied coordinates (@RaccoonCast)" ]
            }
        }, {
            version: "1.6.0",
            releaseDate: "2022-09-12",
            changes: {
                new: [ "'Shift+B' Shortcut to switch back to the previous carrier (@RaccoonCast, @codyingaround)", "Custom query parameters (see #info for more details)", "'Copy Link to Tower' for other PCI+ users in sidebar", "Sector + Band setting for coverage render", "Add FCC block to sidebar for US networks", "New 'Blank' map under Map Settings", "Show address in prompt to move tower", "Automatically detect and prompt to jump to coordinates on your clipboard", "Added Easter Egg (can you find it?)", "Jump-to-section buttons for AntennaSearch (@RaccoonCast)", "'Patch Sector Colors' setting; mouse over the setting to learn more", "Show progress indicator for PCI Search (@RacoonCast)", "Added force disable option for update prompts", "Add separate field for TAC input for sidebar PCI search", "'Shift + Y' Shortcut to refresh map (@RaccoonCast)" ],
                improvement: [ "Center all modals on mobile", "Tower move modals will now stay in place if you mouse over them", "Made 'Copy as URL' zoom setting more intuitive", "PCI+ settings table striped for improved readability", "Converted several more modules to typescript", "Support prewritten callbacks to determine at runtime whether settings should be rendered", "Switch to semver (rather than betaN versioning)", "Show alert in console if cell doesn't have location data", "Notify user upon failed Shift+S (instead of just logging to console)", "Improved styling of Tower Move modal buttons", "Disabled Multi-Site View on mobile", "Improve toast styling & simplify creation" ],
                patch: [ "Align user history data to center of column", "User history table is no longer shown if the user has never pinned a tower", "Expanded location search recognition", "Use PPToast for Location Search errors (rather than bootbox alert)", "Carrier may not switch in sidebar after calling moveToTower (@RaccoonCast)", "Regions list may not be updated after switching providers", "Show PLMNs for Sprint networks in Select Provider (@codyingaround)", "Hide copyright notice on map for mobile users" ],
                bug: [ "Changelog may fail to render when not all categories are included", "Persistent Pins setting hidden for now (features are on by default)", "PCI+ may attempt to search non-integer LTE TAC when NR tac is misreported (@codyingaround)", "Move to lat/lng may not work correctly on mobile if context menu has been triggered (@RaccoonCast)", "PCI+ may (incorrectly) calculate bearing in multi-line measure", "Toast timeouts may not fire when moving a tower", "Buttons in toast may still be clickable after toast disappears", "Some toast timeouts may not be cancelled", "Tower Search may not prompt to do a location search", "Tower Search could fail when resulting in with multiple items (@RaccoonCast)", "highlightByCid script could be added to DOM multiple times", "PCI+ may not correctly credit multiple Twitter accounts on one changelog line" ]
            }
        }, {
            version: "1.5.0-beta12",
            releaseDate: "2022-07-28",
            changes: {
                new: [ `'Persistent Pins' setting allows Small Cell pins to survive a map clear`, "'Sector Colors by Site' setting allows you to more easily differentiate individual sites in Multi-Site View", "'Azimuth in Measure' setting shows azimuth alongside distance in Measure tooltip", "Added setting to combine UL/DL frequency in render (@RaccoonCast)", "'Copy' options use Share menu on mobile devices (@RaccoonCast)", `Activate Multi-Site View by shift-clicking a tower (@codyingaround)`, "Automatically alert users when a PCI+ update is available", "Display a changelog after PCI+ updates", "Show First/Last Seen timestamp in sidebar (@RaccoonCast)", "Customizable sector color settings (@RaccoonCast)", "User stats shown inside history table" ],
                improvement: [ "Original small cell eNBs disappear when Persistent Pins is enabled", "Targeted NR PCI searches will use LTE TAC (NR/256)", "User History elements can now be opened in a new tab", "Small cell pins show site details when clicked (instead of doing nothing)", "\"Measure\" icon is now more obvious (a 📏 instead of an 'M')", "Add <code>title</code>s to changelog & settings (mouse over this text to test!)", "Update CMGM shortcut from .ml to .us (@RaccoonCast)", "Rewrote much of PCI+ in TypeScript (work still ongoing), now compiled with Webpack", "Moved custom settings into a new tab, added context (on hover), simplified creation process", "Add 'Map' button for CMGM in Context Menu (@RaccoonCast)", "Removed unused CM wiki hooks from beta8" ],
                patch: [ `Clicking a rendered cell may not switch you back to the 'details' tab in the sidebar`, "'Select Provider' on mobile could hide the map", "Deleted wiki pages could still appear on the sidebar (@RaccoonCast)", "On mobile, the page could zoom instead of the map, making elements abnormally large", "Some inputs may not function correctly for users on Android (@RaccoonCast)", "Tower Search input could accept non-numeric characters (@RaccoonCast)", "Active bands may not be cleared when switching providers (@RaccoonCast)", "Add DISH Wireless to 'Select Provider' menu for USA", "Sector may not be highlighted in sidebar if selected, unselected, then selected again", "Toasts could disappear before the delay had finished, especially when moving a tower", "Esc key does not correctly apply to all toasts (@RaccoonCast)", "User History view allows continuing to a negative index", "PCI search with no results could pop up a still-empty alert (@RaccoonCast)", "User History table may not work correctly on mobile" ],
                bug: [ `'Display Towers' & 'Display Tower Labels' may not apply to small cell pins (@RaccoonCast)`, "Check boxes may not update correctly when using keyboard shortcuts", "PCI searches could use an incorrect netType if the currently selected site is not of the same RAT as the map (@RaccoonCast)", "Copying latitude/longitude could return values with different decimal precision (@codyingaround)", "Small cells may not disappear when switching RAT or operator", "Some settings may not respect cookie values when a new CM window is opened", "Tower Search on mobile may not hide the sidebar once search results are available", "Measure button could appear in the wrong place on devices with a nonstandard resolution (@RaccoonCast)", "View button may not appear on Wiki pages while on mobile", "Keyboard shortcuts may not trigger with caps lock enabled (@RaccoonCast)", "Sectors may be cleared in some cases it wasn't necessary", "Coverage polygons may fail to render if getTowerCoverage returns a CID not returned by getTower", "Coverage render shows 'eNB' even if RAT is not LTE (@RaccoonCast)", "Measure could treat a right-click as a left-click", "Empty parentheses could appear in PCI search if a site has no bands (@RaccoonCast)", "PCI+ may incorrectly activate Multi-Site View after a browser shortcut that included Shift was activated" ]
            }
        }, {
            version: "1.5.0-beta11",
            releaseDate: "2022-05-29",
            changes: {
                new: [ "<b>Added pins for small cells - see README for details</b>", "<b>Google Street View & CellMapper support on Bing Maps</b>", "Performing a PCI search in NR mode will now search LTE eNBs", "Window title updates with the selected tower", "Added PCI Search + Jump to Sector support for GSM & UMTS <small><i>(sorry I forgot about you, legacy RATs)</i></small>", "<i>Shift+S</i> shortcut to switch between LTE and NR", "<i>Shift+Q</i> shortcut to clear map", "<i>Shift+R</i> shortcut to hide/show signal trails", "<i>Shift+L</i> shortcut to toggle sector colors", "<i>Shift+W</i> shortcut to hide towers", "<i>Shift+M</i> shortcut for Multi-Site View" ],
                patch: [ "Patch: Improve sidebar readability & remove scroll bar" ],
                bug: [ '"Select Provider" implementation could cause more frequent captcha popups', "Selected sites could be interacted with while in Measure mode", "Measure Distance line could be drawn underneath tower", "Sector ID was not rendered correctly when viewing an NR site", "Update measure color", "Google Maps menu items now close properly after clicking" ]
            }
        }, {
            version: "1.5.0-beta10",
            releaseDate: "2022-05-02",
            changes: {
                bug: [ "Temporarily disable handleResponse override due to captcha issues", "Some map objects could be interacted with with while in measurement mode" ]
            }
        }, {
            version: "1.5.0-beta9",
            releaseDate: "2022-05-01",
            changes: {
                new: [ '<b>"Measure Distance" button!</b> (located below zoom +/- toward the top right of the map)', 'Add "Jump to Location" link', "Add <i>Shift+T</i> shortcut for True Coverage", 'Changelog now appears under the "What\'s New" menu on CellMapper', "Add <code>eNB:Sector</code> pattern option for render", "Tower Search now offers to do a location search (in case you've entered data into the wrong field)" ],
                patch: [ 'Improve "Select Provider" on mobile', '"Select Provider" now fails more gracefully when it can\'t find the current country', "Shift+C and Shift+X shortcuts no longer break input boxes", "Captcha no longer breaks if you click outside the modal" ],
                bug: [ "Add MCC/MNC parameters to CMGM menu item", 'Resolved rare "Jump to Sector" error when a cell has very little GPS data', "Google Maps support re-implemented after site update", "AntennaSearch support re-implemented after site update", "Non-targeted searches showed incorrect distance to PCI matches", `AntennaSearch no longer appears as an option for non-US operators` ]
            }
        }, {
            version: "1.5.0-beta8",
            releaseDate: "2022-04-09",
            changes: {
                improvement: [ "Significant code refactor", "PCI+ now uses async fetch(), not $.ajax()", "PCI Search now works properly in dense areas", "Highlighted cells now disappear properly when clicking off of them", "Added new multi-site mode", "Added [Gulp](https://gulpjs.com) alongside [gulp-concat](https://www.npmjs.com/package/gulp-concat) and [gulp-monkeyscript](https://github.com/TomONeill/", "Added selection between eNB, Sector ID, or GCI in cell renders", 'Added "Clear Coverage" option in context menu', "Add CMGM link for Cast", "Add Direction option to show in render", "Added option to choose between Kilometers and Miles as a unit of distance in the search results", "Added support for context menu on mobile devices (tap the CellMapper icon in the top left)" ]
            }
        }, {
            version: "1.5.0-beta7",
            releaseDate: "2022-04-02",
            changes: {
                improvement: [ "Hotfix for zoom issue on moitors of smaller resolution" ]
            }
        }, {
            version: "1.5.0-beta6",
            releaseDate: "2022-04-02",
            changes: {
                improvement: [ "Tower search no longer shows a dialog if there is only 1 search result", "Network-wide PCI search results no longer reload the page upon being clicked", "Improved Google Maps context menu responsiveness when initiated after leaving Street View while Globe View is enabled", 'Added "View" button to wiki section on main CM page', "PCI+ no longer causes errors when visiting Wiki pages.", "Fix code formatting inconsistencies", 'Added "Show True Coverage" setting', 'Added "Hide CID in Render" setting', 'Google Maps "View Bird\'s Eye" setting now follows current rotation', "Jump to coverage based on CID now zooms the map according to the size of the sector you're viewing, and centers your view of the sector.", 'Clicking "Map" in title bar now calls `clearCoverage()`' ]
            }
        }, {
            version: "1.5.0-beta5",
            releaseDate: "2022-03-09",
            changes: {
                improvement: [ "Fix potential crash when interacting with eNBs that contained cells with no PCIs", 'Add new "combined coordinates" option to "Move to Lat/Lng" menu, to allow for easier copy/pasting', "Update README with installation instructions", 'Add "Jump to Sector", by clicking on Cell Identifier in the sidebar', "PCI+ now shows that it's active in the title bar, with a `⁺` icon next to the Map link.", "User History is now hooked separately. PCI+ no longer overrides generatedLoggedInContent().", 'PCI Searching now shows both same-TAC and "local" (within current view) results, regardless of search method.', "PCI searching without specifying a TAC now searches only the sites currently on the map, not the ones in your cache.", "AntennaSearch links now include: Copy Location, Maprad, Crown Castle Infra Map" ]
            }
        }, {
            version: "1.5.0-beta4",
            releaseDate: "2022-02-28",
            changes: {
                improvement: [ "Fix Google Maps hooking on slower browsers" ]
            }
        }, {
            version: "1.5.0-beta3",
            releaseDate: "2022-02-28",
            changes: {
                improvement: [ "Add Bird's Eye and AntennaSearch to Google Maps", "Fix user history on sidebar", "Increase frequency of Google Maps menu checks" ]
            }
        }, {
            version: "1.5.0-beta2",
            releaseDate: "2022-02-27",
            changes: {
                improvement: [ "Add AntennaSearch integration (CellMapper, Google Maps, Google Street View, Bing Maps)", 'Add Google Maps integration ("Open in CellMapper")', "General code cleanup", "Clicking your account name in the sidebar now opens recent history", "Updated README" ]
            }
        }, {
            version: "1.5.0-beta1",
            releaseDate: "2022-02-26",
            changes: {
                improvement: [ "Add distance measurement in PCI search results", 'Add "unverified" color to search results', 'Fix for "Select Provider" in Firefox' ]
            }
        }, {
            version: "1.4.1",
            releaseDate: "2022-02-21",
            changes: {
                improvement: [ "Fix Google Maps link in context menu" ]
            }
        }, {
            version: "1.4.0",
            releaseDate: "2022-02-21",
            changes: {
                improvement: [ "Add new right-click menu (AntennaSearch, Bird's eye, etc)", "Small code cleanup" ]
            }
        }, {
            version: "1.3.3",
            releaseDate: "2022-02-19",
            changes: {
                improvement: [ "Remove unnecessary debug logs" ]
            }
        }, {
            version: "1.3.2",
            releaseDate: "2022-02-19",
            changes: {
                improvement: [ "Fix bug which did not allow non-local PCI results to be opened in the same tab" ]
            }
        }, {
            version: "1.3.1",
            releaseDate: "2022-02-17",
            changes: {
                improvement: [ "Fixed issue with href handling after a PCI search was performed" ]
            }
        }, {
            version: "1.3.0",
            releaseDate: "2022-02-11",
            changes: {
                improvement: [ "Results now work if you open in a new tab", "Zoom now defaults to 18 everywhere (vs 16)" ]
            }
        } ];
        const titles = {
            new: "New Features in PCI+",
            improvement: "Improvements or changes to existing PCI+ features",
            patch: "Changes to pre-existing behavior in CellMapper or other sites",
            bug: "Bug fixes for existing problems in PCI+"
        };
        function swapAt(input, removeAt) {
            let re = /@([\w\d]+)/g;
            let matches = input.match(re);
            if (matches == null) {
                return input;
            } else {
                for (const matchedAt of matches) {
                    let name = matchedAt.substring(1);
                    let newStr;
                    if (removeAt) {
                        newStr = name;
                    } else {
                        newStr = `<a target="_blank" href="https://twitter.com/${name}">@${name}</a>`;
                    }
                    input = input.replaceAll(matchedAt, newStr);
                }
            }
            return input;
        }
        const createElegantChangelog = changelog => {
            let changelogElements = [];
            let newA;
            if (changelog.changes.new) {
                newA = changelog.changes.new.map((change => {
                    change = swapAt(change);
                    return src_elements.a("li", {
                        style: "margin: 5px 0;",
                        title: titles["new"]
                    }, change);
                }));
                let newHtmlList = src_elements.a("div", null, src_elements.a("h5", {
                    title: "New Features in PCI+"
                }, "New Features"), src_elements.a("ul", null, newA));
                changelogElements.push(newHtmlList);
            }
            let improvementA;
            if (changelog.changes.improvement) {
                improvementA = changelog.changes.improvement.map((change => {
                    change = swapAt(change);
                    return src_elements.a("li", {
                        style: "margin: 5px 0;",
                        title: titles.improvement
                    }, change);
                }));
                let improvementHtmlList = src_elements.a("div", null, src_elements.a("h5", {
                    title: "Improvements or changes to existing PCI+ features"
                }, "Improvements"), src_elements.a("ul", null, improvementA));
                changelogElements.push(improvementHtmlList);
            }
            let patchA;
            if (changelog.changes.patch) {
                patchA = changelog.changes.patch.map((change => {
                    change = swapAt(change);
                    return src_elements.a("li", {
                        style: "margin: 5px 0;",
                        title: titles.patch
                    }, change);
                }));
                let patchHtmlList = src_elements.a("div", null, src_elements.a("h5", {
                    title: "Changes to pre-existing behavior in CellMapper or other sites"
                }, "Patches"), src_elements.a("ul", null, patchA));
                changelogElements.push(patchHtmlList);
            }
            let fixA;
            if (changelog.changes.bug) {
                fixA = changelog.changes.bug.map((change => {
                    change = swapAt(change);
                    return src_elements.a("li", {
                        style: "margin: 5px 0;",
                        title: titles.bug
                    }, change);
                }));
                let bugHtmlList = src_elements.a("div", null, src_elements.a("h5", {
                    title: "Bug fixes for existing problems with PCI+"
                }, "Bug Fixes"), src_elements.a("ul", null, fixA));
                changelogElements.push(bugHtmlList);
            }
            return src_elements.a("div", null, changelogElements);
        };
        const createPlainChangelog = changelog => {
            let newA;
            if (changelog.changes.new) {
                newA = changelog.changes.new.map((change => {
                    change = swapAt(change);
                    return src_elements.a("li", {
                        title: titles["new"]
                    }, change);
                }));
            } else {
                newA = src_elements.a("div", null);
            }
            let pciPlusChangelog = src_elements.a("tr", null, src_elements.a("td", null, `&nbsp; PCI+ ${changelog.version}:`, src_elements.a("ul", null, newA, src_elements.a("li", {
                style: "margin: 7px 0; list-style: none;"
            }, src_elements.a("a", {
                style: "color: #3498db; font-style: italic; font-size: 109%;",
                href: "#",
                onclick: "popupChangelog()"
            }, changelog.changes.new !== undefined ? "(View more)" : "(View all changes)")))));
            return pciPlusChangelog;
        };
        function generatePciPlusChangelog(plainVersion, changelogVersion) {
            if (changelogVersion === undefined) {
                changelogVersion = 0;
            }
            let changelogToUse = changelog[changelogVersion];
            devLogger("showing changelog", changelogVersion, changelogToUse);
            if (plainVersion) {
                let pciPlusChangelog = createPlainChangelog(changelogToUse);
                return pciPlusChangelog;
            } else {
                let pciPlusChangelog = createElegantChangelog(changelogToUse);
                return pciPlusChangelog;
            }
        }
        function addPciPlusChangelog() {
            let pciPlusChangelog = generatePciPlusChangelog(true);
            addWhatsNew();
            let whatsNewInfo = $("#whatsnew > tbody");
            whatsNewInfo.append(pciPlusChangelog);
        }
        function overrideKeyboardShortcuts() {
            let keyboardShortcutToast = new PPToast("keyboardShortcutToast");
            keyboardShortcutToast.hideToast();
            const originalFunction = $._data($(document.documentElement)[0], "events").keydown[0].handler;
            if (typeof originalFunction != "undefined") {
                $._data($(document.documentElement)[0], "events").keydown[0].handler = event => {
                    if (document.activeElement.nodeName == "INPUT") {
                        return;
                    }
                    const isSpecialKey = String(event.key).length > 1;
                    if (event.shiftKey || event.ctrlKey || isSpecialKey) {
                        for (let shortcut of keyboardShortcuts) {
                            if (shortcut.triggers.includes(event.key) && (shortcut.requiresCtrl ? event.ctrlKey : !event.ctrlKey) && (shortcut.requiresShift ? event.shiftKey : !event.shiftKey)) {
                                shortcut.callback(keyboardShortcutToast, event);
                                return;
                            }
                        }
                        originalFunction(event);
                    }
                };
            }
        }
        function addMeasureDistance() {
            let {ol} = window;
            var draggableTowerInteractions = [];
            let sketch;
            let helpTooltipElement;
            let helpTooltip;
            let measureTooltipElement;
            let measureTooltip;
            let emptyVectorSource = new ol.source.Vector({});
            window.emptyVectorSource = emptyVectorSource;
            let measurementVectors = new ol.layer.Vector({
                source: emptyVectorSource,
                zIndex: 100,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(255, 255, 255, 0.2)"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#ff0000",
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: "#c71e1e"
                        })
                    })
                })
            });
            window.map.addLayer(measurementVectors);
            let measureButton = document.createElement("button");
            measureButton.innerHTML = "📏";
            measureButton.title = "Measure";
            measureButton.id = "measureButton";
            let handleMeasureButton = () => {
                if ($(".ol-tooltip").length > 0) {
                    if (document.querySelector(".measure-help-tooltip")) {
                        document.querySelector(".measure-help-tooltip").parentNode.removeChild(document.querySelector(".measure-help-tooltip"));
                    }
                    window.map.removeInteraction(window.draw);
                    for (let i of document.querySelectorAll(".ol-tooltip-static")) {
                        i.parentNode.removeChild(i);
                    }
                    measurementVectors.getSource().clear();
                    for (let i of document.querySelectorAll(".ol-tooltip")) {
                        i.parentNode.removeChild(i);
                    }
                    if (draggableTowerInteractions) {
                        for (let i of draggableTowerInteractions) {
                            window.map.addInteraction(i);
                        }
                    }
                    draggableTowerInteractions = [];
                } else {
                    for (let i of window.map.getInteractions().getArray()) {
                        let listenersForInteraction = i.listeners_;
                        if (listenersForInteraction != null) {
                            if (listenersForInteraction.hasOwnProperty("translatestart")) {
                                draggableTowerInteractions.push(i);
                            }
                        }
                    }
                    for (let i of draggableTowerInteractions) {
                        window.map.removeInteraction(i);
                    }
                    doMeasurement(sketch, helpTooltipElement, helpTooltip, measureTooltipElement, measureTooltip);
                }
            };
            measureButton.addEventListener("click", handleMeasureButton, false);
            let measureButtonElement = document.createElement("div");
            measureButtonElement.className = "ol-measure-button ol-unselectable ol-control";
            measureButton.setAttribute("style", "margin-top: 10px;");
            window.handleMeasure = handleMeasureButton;
            let existingZoomControls = document.querySelector("#map_canvas > div > div.ol-overlaycontainer-stopevent > div.ol-zoom.ol-unselectable.ol-control");
            existingZoomControls.appendChild(measureButton);
            let measureButtonControl = new ol.control.Control({
                element: measureButtonElement
            });
            window.map.addControl(measureButtonControl);
            $(".ol-measure-button").css({
                position: "fixed",
                top: "255px",
                left: "unset",
                right: "8px"
            });
        }
        function doMeasurement(sketch, helpTooltipElement, helpTooltip, measureTooltipElement, measureTooltip) {
            const {pciPlus_distanceUnit, ol} = window;
            const pointerMoveHandler = function(evt) {
                if (evt.dragging) {
                    return;
                }
                let helpMsg = "Click the Measure button to exit";
                if (sketch) {
                    helpMsg = "Click the last point to finish the line";
                }
                helpTooltipElement.innerHTML = helpMsg;
                helpTooltip.setPosition(evt.coordinate);
                helpTooltipElement.classList.remove("hidden");
            };
            window.map.on("pointermove", pointerMoveHandler);
            window.map.getViewport().addEventListener("mouseout", (function() {
                helpTooltipElement.classList.add("hidden");
            }));
            window.draw;
            const formatLength = function(line) {
                const length = ol.sphere.getLength(line);
                const KM_TO_MI = .62137119;
                const M_TO_FT = 3.28084;
                let output;
                if (length > 100) {
                    if (pciPlus_distanceUnit == "mi") {
                        output = `${Math.round(length * KM_TO_MI / 1e3 * 100) / 100} mi`;
                    } else if (pciPlus_distanceUnit == "km") {
                        output = `${Math.round(length / 1e3 * 100) / 100} km`;
                    }
                } else {
                    if (pciPlus_distanceUnit == "mi") {
                        output = `${Math.round(length * M_TO_FT * 100) / 100} ft`;
                    } else if (pciPlus_distanceUnit == "km") {
                        output = `${Math.round(length * 100) / 100} m`;
                    }
                }
                return output;
            };
            const getBearing = ([lat1, lon1], [lat2, lon2]) => {
                const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
                const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
                const theta = Math.atan2(y, x);
                const brng = (theta * 180 / Math.PI + 360) % 360;
                function fixOffset(degrees) {
                    if (degrees + 90 > 360) {
                        return degrees + 90 - 360;
                    } else {
                        return degrees + 90;
                    }
                }
                return brng.toFixed(1);
            };
            function addInteraction() {
                window.draw = new ol.interaction.Draw({
                    freehandCondition: ol.events.condition.shiftKeyOnly || ol.events.condition.penOnly,
                    source: window.emptyVectorSource,
                    type: "LineString",
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: "rgba(255, 255, 255, 0.2)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: window.darkMode ? "white" : "rgba(0, 0, 0, 0.5)",
                            lineDash: [ 10, 10 ],
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({
                                color: "rgba(0, 0, 0, 0.7)"
                            }),
                            fill: new ol.style.Fill({
                                color: "rgba(255, 255, 255, 0.2)"
                            })
                        })
                    }),
                    condition: e => {
                        if (e.originalEvent.buttons == 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                window.map.addInteraction(window.draw);
                createMeasureTooltip();
                createHelpTooltip();
                let listener;
                window.draw.on("drawstart", (function(evt) {
                    sketch = evt.feature;
                    let tooltipCoord = evt.coordinate;
                    listener = sketch.getGeometry().on("change", (function(evt) {
                        const geom = evt.target;
                        let output;
                        let coordinates = geom.getCoordinates();
                        let startCoords = ol.proj.transform(coordinates[0], "EPSG:3857", "EPSG:4326");
                        let endCoords = ol.proj.transform(coordinates[1], "EPSG:3857", "EPSG:4326");
                        let bearing = getBearing(startCoords, endCoords) + "°";
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                        let isSingleLine = (() => {
                            if (coordinates.length == 2 || coordinates.length == 3 && coordinates[coordinates.length - 1].toString() === coordinates[coordinates.length - 2].toString()) {
                                return true;
                            } else {
                                return false;
                            }
                        })();
                        if (window.pciPlus_showBearingInMeasure && isSingleLine) {
                            measureTooltipElement.innerHTML = `${output}<br/>${bearing}`;
                        } else {
                            measureTooltipElement.innerHTML = `${output}`;
                        }
                        measureTooltip.setPosition(tooltipCoord);
                    }));
                }));
                window.draw.on("drawend", (function(evt) {
                    evt.feature.set("measure", true);
                    let text = measureTooltipElement.innerText;
                    if (text == "0 ft" || text == "0 m") {
                        measureTooltipElement.innerText = window.prompt("Enter Marker Name:");
                    }
                    measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
                    measureTooltip.setOffset([ 0, -7 ]);
                    sketch = null;
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    ol.Observable.unByKey(listener);
                }));
            }
            function createHelpTooltip() {
                if (helpTooltipElement) {
                    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                }
                helpTooltipElement = document.createElement("div");
                helpTooltipElement.className = "ol-tooltip hidden measure-help-tooltip";
                helpTooltip = new ol.Overlay({
                    element: helpTooltipElement,
                    offset: [ 15, 0 ],
                    positioning: "center-left"
                });
                window.map.addOverlay(helpTooltip);
            }
            function createMeasureTooltip() {
                if (measureTooltipElement) {
                    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                }
                measureTooltipElement = document.createElement("div");
                measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
                measureTooltip = new ol.Overlay({
                    element: measureTooltipElement,
                    offset: [ 0, -15 ],
                    positioning: "bottom-center",
                    stopEvent: false,
                    insertFirst: false
                });
                window.map.addOverlay(measureTooltip);
            }
            addInteraction();
            let measureStyle = document.createElement("style");
            measureStyle.textContent = ` \n  /* [PCI+] Set styles for Measure elements */\n  \n  .ol-tooltip {\n    position: relative;\n    background: rgba(0, 0, 0, 0.5);\n    border-radius: 4px;\n    color: white;\n    padding: 4px 8px;\n    opacity: 0.7;\n    white-space: nowrap;\n    font-size: 12px;\n    cursor: default;\n    user-select: none;\n  }\n  .ol-tooltip-measure {\n    opacity: 1;\n    font-weight: bold;\n    text-align: center;\n  }\n  .ol-tooltip-static {\n    background-color: #F26161;\n    color: white;\n    border: 1px solid white;\n    font-weight: bolder;rgba\n    font-size: 85%;\n    opacity: 1.0;\n    text-align: center;\n    \n  }\n  .ol-tooltip-measure:before,\n  .ol-tooltip-static:before {\n    border-top: 6px solid rgba(0, 0, 0, 0.5);\n    border-right: 6px solid transparent;\n    border-left: 6px solid transparent;\n    content: "";\n    position: absolute;\n    bottom: -6px;\n    margin-left: -7px;\n    left: 50%;\n  }\n  .ol-tooltip-static:before {\n    border-top-color: #f26161;\n  }`;
            document.head.appendChild(measureStyle);
        }
        function patchCellmapperStylesheet() {
            let newStyles = document.createElement("style");
            newStyles.textContent = `\n\n  /* Remove CellMapper +200px padding for modals */\n  .modal-dialog {\n    top: unset;\n  }\n  \n  /* Increase sidebar cell border width to see sector colors */\n  [id^="detailsTable"] {\n    border-width: 3.85px!important;\n  }\n\n  /* Hide Firefox scroll bar in sidebar */\n  #side_bottom {\n    overflow: -moz-scrollbars-none;\n    scrollbar-width: none;\n  }\n  \n  /* Hide Chrome scroll bar in sidebar */\n  ::-webkit-scrollbar { \n    display: none; \n  }\n\n  /* Remove annoying TomSelect thing where focus stays in the search box after you hit enter */\n  div[class="item"] + input[id$="ts-control"] {\n    display: none!important;\n  }\n\n  /* Add styles for CCI Overlay Popup */\n  .ol-popup {\n    position: absolute;\n    background-color: white;\n    box-shadow: 0 1px 4px rgba(0,0,0,0.2);\n    /*padding: 15px;*/\n    border-radius: 10px;\n    border: 1px solid #cccccc;\n    bottom: 18px;\n    left: -150px;\n    min-width: 280px;\n  }\n  .ol-popup:after, .ol-popup:before {\n    top: 100%;\n    border: solid transparent;\n    content: " ";\n    height: 0;\n    width: 0;\n    position: absolute;\n    pointer-events: none;\n  }\n  .ol-popup:after {\n    border-top-color: white;\n    border-width: 10px;\n    left: 50%;\n    \n  }\n  .ol-popup:before {\n    border-top-color: #cccccc;\n    border-width: 11px;\n    left: 50%;\n  }\n\n  .toast-close-button {\n    color: #3c4242;\n  }\n\n  #ppSidebar {\n    background-color: white;\n  }\n\n  /** \n   * Set style for CM App refresh control \n   * This is only applicable for CMApp, which has a different stylesheet than CM desktop\n   **/\n  .refresh-control {\n    bottom: 104px;\n    right: 0.5em;\n  }\n\n  /** T-Mobile NR 'Legacy' Button for Tower History **/\n  .btn-legacy {\n    float: left;\n    margin-right: auto !important;\n  }\n\n  /** Re-add navbar background **/\n  .navbar {\n    background-color: #2C3E50;\n  }\n\n  .subHeaderColor {\n    background-color: ${table_header_sub_background_color};\n  }\n\n  /* Allow for disabling hover on some items */\n  .hoverDisabled {\n    pointer-events: none;\n  }\n\n  /* Enable hover pointer on some items */\n  .hoverPointer {\n    cursor: pointer;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n\n  /* Disable some events */\n  .cellDisabled {\n    opacity: 0.3;\n    pointer-events: none;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n\n  /* Float element to the right */\n  .floatRight {\n    float: right;\n  }\n\n  /* Make element invisible */\n  .hidden {\n    visibility: hidden;\n  }\n\n\n \n  \n  `;
            document.head.appendChild(newStyles);
        }
        function changeNetType(newNetType) {
            const {clearBands, getTilesAvailable, getTowersInView, toggleMobile, showTiles, MCC, MNC} = window;
            clearBands();
            window.NetSelectBox.setValue(newNetType);
            if (window.netType != newNetType) {
                window.showBand = 0;
            }
            window.netType = newNetType;
            getTilesAvailable(MCC, MNC, window.netType);
            getTowersInView(MCC, MNC, true, window.netType);
            if (window.tilesEnabled) {
                showTiles(MCC, MNC);
            }
            clearCoverage();
            if (window.isMobileDevice) {
                toggleMobile();
            }
        }
        function popupChangelog(updated, versionInView) {
            if (versionInView === undefined) {
                devLogger("Didn't recieve version!");
                versionInView = 0;
            }
            devLogger("Version:", versionInView);
            window.bootbox.dialog({
                centerVertical: true,
                closeButton: false,
                size: "large",
                buttons: {
                    prev: {
                        className: "btn-secondary btn-navi-prev",
                        label: "Prev",
                        callback: () => {
                            if (versionInView + 1 === changelog.length) {
                                let t = new PPToast("reachedBeginningToast", 3e3);
                                t.setContents("You've reached the end!");
                                t.showToast();
                                popupChangelog(false, versionInView);
                            } else {
                                popupChangelog(false, versionInView + 1);
                            }
                        }
                    },
                    next: {
                        className: "btn-secondary btn-navi btn-navi-next",
                        label: "Next",
                        callback: () => {
                            if (versionInView - 1 < 0) {
                                let t = new PPToast("reachedEndToast", 3e3);
                                t.setContents("You've reached the end!");
                                t.showToast();
                                popupChangelog(false, versionInView);
                            } else {
                                popupChangelog(false, versionInView - 1);
                            }
                        }
                    },
                    ok: {
                        className: "btn-primary",
                        label: "Ok"
                    }
                },
                callback: () => {},
                title: `<center>${updated ? "PCI+ Updated!" : "PCI+ " + changelog[versionInView].version + ' <span style="font-size: 0.7em;">(' + changelog[versionInView].releaseDate + ")</span>"} </center>`,
                message: generatePciPlusChangelog(false, versionInView)
            });
            $(".btn-navi").css({
                float: "left",
                "margin-right": "auto"
            });
            $(".btn-navi-prev").css("margin-right", "inherit");
        }
        function genBandTitle(netType) {
            let title;
            if (netType == "NR") {
                title = "n";
            } else {
                title = "B";
            }
            return title;
        }
        function hslToHex(h, s, l) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, "0");
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }
        function genRandomColor(seed) {
            const {MD5} = window;
            if (seed) {
                if (seed < 360) {
                    let colorAsHex = hslToHex(seed, default_saturation, default_lightness);
                    return colorAsHex;
                }
                let colorAsHex = hslToHex(parseInt(MD5(String(.25 * seed)), 16) % 360, window.darkMode ? default_saturation_dark : default_saturation, window.darkMode ? default_lightness_dark : default_lightness);
                return colorAsHex;
            }
            let randomHue = Math.floor(Math.random() * 360);
            let colorAsHex = hslToHex(randomHue % 360, window.darkMode ? default_saturation_dark : default_saturation, window.darkMode ? default_lightness_dark : default_lightness);
            return colorAsHex;
        }
        function hexToHsl(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            var r = parseInt(result[1], 16);
            var g = parseInt(result[2], 16);
            var b = parseInt(result[3], 16);
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > .5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                  case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;

                  case g:
                    h = (b - r) / d + 2;
                    break;

                  case b:
                    h = (r - g) / d + 4;
                    break;
                }
                h /= 6;
            }
            s = s * 100;
            s = Math.round(s);
            l = l * 100;
            l = Math.round(l);
            h = Math.round(360 * h);
            return [ h, s, l ];
        }
        function correctCmColor(hex) {
            const {darkMode} = window;
            let colorInHsl = hexToHsl(hex ?? (darkMode ? "#ffffff" : "#000000"));
            let convertedHex = hslToHex(colorInHsl[0], darkMode ? default_saturation_dark : default_saturation, darkMode ? default_lightness_dark : default_lightness);
            return convertedHex;
        }
        async function pp_getFreq(MCC, technology, channel) {
            const {API_URL, handleResponse, frequencyCache, _renderGetFrequency} = window;
            if (frequencyCache[MCC]?.[technology]?.[channel]) {
                return frequencyCache[MCC][technology][channel];
            }
            const requestParams = {
                MCC,
                RAT: technology,
                Channel: channel
            };
            const res = await fetch(API_URL + "getFrequency?" + new URLSearchParams(requestParams), {
                credentials: "include"
            });
            const freqData = handleResponse(await res.json());
            devLogger("returned:", freqData);
            if (frequencyCache[MCC] == undefined) {
                frequencyCache[MCC] = [];
            }
            if (frequencyCache[MCC][technology] == undefined) {
                frequencyCache[MCC][technology] = [];
            }
            window.frequencyCache[MCC][technology][channel] = freqData;
        }
        async function getTowerCoverage(cMCC, cMNC, cLAC, cTowerId, color, highlight) {
            let {API_URL, netType, deg2dir, handleResponse, ol, map, currentSite, pciPlus_allowSelectMultipleTowers, pciPlus_selectCidRenderType, pciPlus_showTrueSectors, pciPlus_customSectorColors, pciPlus_doColorsBySite, MCC} = window;
            devLogger("going for details of site", currentSite, "aka", cTowerId);
            if (!pciPlus_allowSelectMultipleTowers) {
                clearCoverage(false);
                devLogger("Clearing existing sectors to start");
            }
            if (window.CoveragePolygonLayer != null) {
                devLogger("Checking for existing tower or CoveragePolygonLayer");
                if (pciPlus_allowSelectMultipleTowers && !window.towersInMainCoverageLayer.includes(cTowerId) && window.MainCoverageLayer.getLayers().array_.length === 0) {
                    devLogger(`Pushing this coverage to main layer, since multi-site wasn't enabled when it was selected`);
                    window.MainCoverageLayer.getLayers().array_.push(window.CoveragePolygonLayer);
                } else {}
                map.removeLayer(window.CoveragePolygonLayer);
            }
            const towerCoverageParams = {
                MCC: String(cMCC),
                MNC: String(cMNC),
                Region: String(cLAC),
                Site: String(cTowerId),
                RAT: netType
            };
            const towerCoverageRes = await fetch(API_URL + "/getTowerCoverage?" + new URLSearchParams(towerCoverageParams), {
                credentials: "include"
            });
            let cellsCoverage = handleResponse(await towerCoverageRes.json());
            let cellPolygons = [];
            let randomBaseColor = genRandomColor();
            for (let cellIndex of Object.keys(cellsCoverage)) {
                const cellCoords = cellsCoverage[cellIndex];
                if (currentSite.cells[cellIndex] == undefined) {
                    devLogger("Cell in getTowerCoverage, but not currentSite - ignoring");
                    continue;
                }
                let polyCoords = [];
                $.each(cellCoords, ((index, latlng) => {
                    if (currentSite.towerMover && latlng != undefined) {
                        if (pciPlus_showTrueSectors) {
                            let currentSiteLatLng = [ currentSite.latitude, currentSite.longitude ];
                            if (latlng[0] === currentSiteLatLng[0] && latlng[1] === currentSiteLatLng[1]) {
                                if (cellCoords.length == 1) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    }
                    if (latlng == undefined || latlng[0] == undefined || latlng[1] == undefined) {
                        devLogger("Something is wrong with j:", latlng);
                        return;
                    } else {
                        polyCoords.push(ol.proj.transform([ parseFloat(String(latlng[1])), parseFloat(String(latlng[0])) ], "EPSG:4326", "EPSG:3857"));
                    }
                    if (!polyCoords || polyCoords.length == 0 || polyCoords.length == 0) {
                        devLogger("Couldn't calculate polygon coordinates");
                        return;
                    }
                }));
                if (!polyCoords || polyCoords.length == 0 || typeof polyCoords[0] == "undefined") {
                    devLogger(`Something is wrong with polygon coords for ${cellIndex}, continuing`);
                    continue;
                }
                let baseColor;
                if (!window.sectorColors[cellIndex] || window.pciPlus_customSectorColors == "sidebar" || window.pciPlus_customSectorColors == "none") {
                    devLogger(`Rendering sector colors for ${String(cellIndex)} in black`);
                    baseColor = window.darkMode ? "white" : "#000000";
                } else if (pciPlus_doColorsBySite && pciPlus_allowSelectMultipleTowers && (pciPlus_customSectorColors == "map" || pciPlus_customSectorColors == "both")) {
                    let randomSeed = parseInt(Object.keys(currentSite.cells)[0]) * parseInt(currentSite.siteID);
                    baseColor = genRandomColor(randomSeed);
                } else if (window.pciPlus_randomizeSectorColors) {
                    baseColor = randomBaseColor;
                } else {
                    if (window.pciPlus_fixCmSectorColors === "contrastify") {
                        baseColor = correctCmColor(window.sectorColors[cellIndex]);
                    } else if (window.pciPlus_fixCmSectorColors === "fix") {
                        let index = Object.keys(currentSite.cells).indexOf(String(cellIndex));
                        let arfcn = currentSite.channels[index];
                        baseColor = genRandomColor(arfcn);
                    } else {
                        if (window.darkMode) {
                            baseColor = correctCmColor(window.sectorColors[cellIndex]);
                        } else {
                            baseColor = "#" + window.sectorColors[cellIndex];
                        }
                    }
                }
                let fillColor = ol.color.asArray(baseColor);
                fillColor = fillColor.slice();
                fillColor[3] = .1;
                let strokeColor = ol.color.asArray(baseColor);
                strokeColor = strokeColor.slice();
                strokeColor[3] = 1;
                let fillStyle = new ol.style.Fill({
                    color: fillColor
                });
                let strokeStyle = new ol.style.Stroke({
                    color: strokeColor,
                    width: 2
                });
                const sectorId = currentSite.cells[cellIndex].Sector;
                const pci = currentSite.cells[cellIndex].PCI;
                let finalText = "";
                switch (pciPlus_selectCidRenderType) {
                  case "GlobalId":
                    {
                        finalText = "Cell " + String(cellIndex);
                        break;
                    }

                  case "SectorId":
                    {
                        finalText = "Cell " + sectorId;
                        break;
                    }

                  case "enbId":
                    {
                        finalText = genNodeTitle(window.netType) + " " + cTowerId;
                        break;
                    }

                  case "direction":
                    {
                        const bearing = currentSite.cells[cellIndex].Bearing;
                        if (typeof bearing == "undefined") {
                            finalText = "Cell " + sectorId;
                            break;
                        }
                        const direction = deg2dir(bearing);
                        finalText = `Cell ${sectorId} (${direction} ${bearing}°)`;
                        break;
                    }

                  case "enbAndSector":
                    {
                        finalText = `${genNodeTitle(window.netType)} ${cTowerId}:${sectorId}`;
                        break;
                    }

                  case "sectorAndPci":
                    {
                        finalText = `Cell ${sectorId} (${pci})`;
                        break;
                    }

                  case "bandAndSector":
                    {
                        let index = Object.keys(currentSite.cells).indexOf(String(cellIndex));
                        let channel = currentSite.channels[index];
                        let band = window.frequencyCache[MCC][netType][channel];
                        if (!(band == undefined)) {
                            finalText = `Cell ${sectorId} (${genBandTitle(netType)}${band.bandNumber})`;
                        } else {
                            finalText = `Cell ${sectorId}`;
                        }
                        break;
                    }

                  case "None":
                    {
                        break;
                    }

                  default:
                    {
                        break;
                    }
                }
                const cellText = new ol.style.Text({
                    font: "13px Calibri,sans-serif",
                    fill: new ol.style.Fill({
                        color: "#ededed"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#1f1f1f",
                        width: 3
                    }),
                    text: finalText
                });
                window.sectorStyles[cellIndex] = new ol.style.Style({
                    stroke: strokeStyle,
                    fill: fillStyle,
                    text: cellText
                });
                window.sectorStylesHighlighted[cellIndex] = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: strokeColor,
                        width: 4
                    }),
                    fill: fillStyle
                });
                polyCoords.push(polyCoords[0]);
                let finalPolygon = new ol.Feature({
                    geometry: new ol.geom.Polygon([ polyCoords ])
                });
                finalPolygon.set("CID", cellIndex);
                finalPolygon.setStyle(window.sectorStyles[cellIndex]);
                if (window.pciPlus_onlyShowSelectedBandSectors) {
                    const arfcn = currentSite.channels[Object.keys(currentSite.cells).indexOf(String(cellIndex))];
                    const cellFreqInfo = await pp_getFreq(MCC, netType, arfcn) ?? {
                        bandNumber: 0
                    };
                    const cellBand = cellFreqInfo.bandNumber;
                    if (window.showBand != 0 && window.showBand != cellBand) {} else {
                        cellPolygons.push(finalPolygon);
                    }
                } else {
                    cellPolygons.push(finalPolygon);
                }
            }
            const polygonVectorSource = new ol.source.Vector({
                features: cellPolygons
            });
            const polygonVectorLayer = new ol.layer.Vector({
                source: polygonVectorSource
            });
            polygonVectorLayer.set("type", "CoveragePolygonLayer");
            map.removeLayer(window.CoveragePolygonLayer);
            window.CoveragePolygonLayer = polygonVectorLayer;
            map.addLayer(window.CoveragePolygonLayer);
            window.ppUpdatedCoveragePolygonLayer = cTowerId;
            if (!window.towersInMainCoverageLayer.includes(cTowerId)) {
                window.towersInMainCoverageLayer.push(cTowerId);
            } else {
                return;
            }
            if (pciPlus_allowSelectMultipleTowers) {
                window.MainCoverageLayer.getLayers().push(polygonVectorLayer);
                window.map.removeLayer(window.MainCoverageLayer);
                window.map.addLayer(window.MainCoverageLayer);
            }
        }
        async function handlePCIPSCSearch(input_pci, input_tac) {
            const {currentSite, netType, API_URL, MCC, MNC, handleResponse} = window;
            let pciPsc;
            let customTac;
            let pciSearchBox = $("#pcipsc_search").val();
            let tacSearchBox = $("#tac_search").val();
            if (input_tac) {
                customTac = input_tac;
            } else if (tacSearchBox.length > 0) {
                customTac = parseInt(tacSearchBox);
            } else {
                customTac = 0;
            }
            if (input_pci) {
                pciPsc = input_pci;
            } else if (pciSearchBox.length > 0) {
                pciPsc = parseInt(pciSearchBox);
            } else {
                if (customTac > 0) {
                    let toast = new PPToast("NoPciProvidedWithTac", 3e3);
                    toast.setContents("You need to provide both a PCI and a TAC!");
                    toast.showToast();
                    devLogger("No PCI provided with TAC");
                    return;
                }
                return;
            }
            let tacBoxInput = $("#tac_search").val();
            let isTargetedSearch = typeof input_pci !== "undefined";
            let isLacSpecified = customTac !== 0 ? true : false;
            devLogger("stats:", input_pci, pciPsc, customTac);
            let technology;
            if (isTargetedSearch) {
                technology = currentSite.RAT;
            } else {
                technology = netType;
            }
            let pciLoadToast = new PPToast("pciLoadingToast" + pciPsc);
            pciLoadToast.setHeader(`PCI+ [${pciPsc}]`);
            pciLoadToast.clearContents();
            let pciLoadToastTimeout;
            pciLoadToastTimeout = setTimeout((() => {
                if (!$(".modal-body").is(":visible")) {
                    pciLoadToast.showToast();
                }
            }), 200);
            const pciSearchRequest = {
                MCC: String(MCC),
                MNC: String(MNC),
                Identity: String(pciPsc),
                RAT: technology
            };
            pciLoadToast.appendContents(`Searching ${technology}...`);
            const pciSearchResult = await fetch(API_URL + `getPhysicalIdentity?` + new URLSearchParams(pciSearchRequest), {
                credentials: "include"
            });
            let towerData = handleResponse(await pciSearchResult.json());
            if (window.pciPlus_showNrInLtePciSearch && (technology == "LTE" || technology == "NR")) {
                const secondaryRat = technology == "LTE" ? "NR" : "LTE";
                const pciSearchRequestNrCompanion = {
                    MCC: String(MCC),
                    MNC: String(MNC),
                    Identity: String(pciPsc),
                    RAT: secondaryRat
                };
                pciLoadToast.appendContents(`<br/> Searching ${secondaryRat}...`);
                const pciSearchResultNrCompanion = await fetch(API_URL + `getPhysicalIdentity?` + new URLSearchParams(pciSearchRequestNrCompanion), {
                    credentials: "include"
                });
                towerData.push(...handleResponse(await pciSearchResultNrCompanion.json()));
            }
            let siteIdsWithPci = [];
            let sameTacSearchResults = [];
            for (let i of towerData) {
                if (customTac) {
                    if (parseInt(i.regionID) == customTac || window.pciPlus_showNrInLtePciSearch && (i.RAT == "NR" && parseInt(i.regionID) / 256 == customTac || i.RAT == "LTE" && parseInt(i.regionID) * 256 == customTac)) {
                        sameTacSearchResults.push(i);
                        let index = towerData.indexOf(i);
                        towerData.splice(index, 1);
                        continue;
                    }
                }
            }
            if (isTargetedSearch) {
                let getDistance = item => calculateDistance(currentSite.latitude, currentSite.longitude, item.latitude, item.longitude);
                sameTacSearchResults.sort(((a, b) => getDistance(a) > getDistance(b) ? 1 : -1));
                towerData.sort(((a, b) => getDistance(a) > getDistance(b) ? 1 : -1));
            } else {
                let getDistance = item => calculateDistance(...getMapCenter(), item.latitude, item.longitude);
                if (isLacSpecified) {
                    sameTacSearchResults.sort(((a, b) => getDistance(a) > getDistance(b) ? 1 : -1));
                }
                towerData.sort(((a, b) => getDistance(a) > getDistance(b) ? 1 : -1));
            }
            function generateTowerListItem(item, listType, cmgmIn) {
                let title = genNodeTitle(item.RAT);
                let bandList;
                if (item.bandNumbers.length > 0) {
                    bandList = (item.RAT == "NR" ? "n" : "B") + item.bandNumbers.sort(((a, b) => a - b)).toString().replaceAll(",", "/");
                } else {
                    bandList = "";
                }
                let distanceNum;
                let distance = " [";
                if (isTargetedSearch) {
                    distanceNum = calculateDistance(currentSite.latitude, currentSite.longitude, item.latitude, item.longitude);
                    distance += String(distanceNum.toFixed(1));
                } else {
                    distanceNum = calculateDistance(...getMapCenter(), item.latitude, item.longitude);
                    distance += "≈" + String(distanceNum.toFixed(1));
                }
                distance += window.pciPlus_distanceUnit;
                distance += "]";
                let styleInfo = "";
                if (!item.towerMover) {
                    styleInfo = `color: ${unverified_pci_color};`;
                } else if (typeof item.towerAttributes.TOWER_TYPE !== "undefined" && item.towerAttributes.TOWER_TYPE == "DAS" && item.towerMover !== undefined) {
                    styleInfo = `color: ${das_pci_color};`;
                }
                if ((technology == "LTE" || technology == "NR") && item.RAT == "NR") {
                    styleInfo += `background-color: ${window.darkMode ? "darkblue" : "yellow"};`;
                }
                let targetedSite;
                if (input_pci && item.siteID === currentSite.siteID) {
                    targetedSite = true;
                } else {
                    targetedSite = false;
                }
                let newItemUrl = generateCellMapperUrl({
                    MCC: MCC || 0,
                    MNC: MNC || 0,
                    type: technology || 0,
                    latitude: item.latitude || 0,
                    longitude: item.longitude || 0,
                    zoom: 18
                });
                let runOnclick = `\n      centreMap(${item.latitude}, ${item.longitude}, true);\n      if (netType !== "${item.RAT}") { changeNetType("${item.RAT}"); }\n      return false;\n      `;
                let siteName;
                if (typeof item.towerAttributes.TOWER_NAME !== "undefined") {
                    siteName = item.towerAttributes.TOWER_NAME;
                } else {
                    siteName = String(item.siteID);
                }
                let formattedTitle, formattedSiteId = "";
                if (targetedSite) {
                    formattedTitle = `<i>${title}</i>`;
                    formattedSiteId = `<i>${siteName}</i>`;
                } else {
                    formattedTitle = title;
                    formattedSiteId = siteName;
                }
                let metadata = "";
                if (listType === "hyperlocal") {
                    metadata = " <small>" + (bandList.length == 0 ? "" : `(${bandList})`) + "</small>";
                } else {
                    metadata = " <small>" + item.regionID + (bandList.length == 0 ? "" : ` (${bandList})`) + "</small>";
                }
                let nrLteTacTooltip;
                if (window.pciPlus_showNrInLtePciSearch) {
                    if (item.RAT === "NR" && technology == "LTE") {
                        if (isLacSpecified && customTac == item.regionID / 256) {} else {
                            nrLteTacTooltip = src_elements.a("a", {
                                href: "#",
                                "data-toggle": "tooltip",
                                title: `NR ${Number(item.regionID)} ÷ 256 = LTE ${Math.round(parseInt(item.regionID) / 256)}`
                            }, "*");
                        }
                    } else if (item.RAT === "LTE" && technology == "NR") {
                        if (isLacSpecified && customTac == item.regionID * 256) {} else {
                            nrLteTacTooltip = src_elements.a("a", {
                                href: "#",
                                "data-toggle": "tooltip",
                                title: `LTE ${Number(item.regionID)} × 256 = NR ${Math.round(parseInt(item.regionID) * 256)}`
                            }, "*");
                        }
                    }
                } else {
                    nrLteTacTooltip = "";
                }
                window.pciPlus_showNrInLtePciSearch && item.RAT !== technology ? `<a href='#' style="font-size: smaller;" data-toggle='tooltip' title='NR ${Number(item.regionID)} ÷ 256 = LTE ${Math.round(parseInt(item.regionID) / 256)}'>*</a>` : "";
                let cmgm = "";
                if (cmgmIn == null || cmgmIn == undefined || cmgmIn[item.siteID] == undefined || !window.pciPlus_enableCmgmIntegration) {} else {
                    cmgm = src_elements.a("span", null, src_elements.a("small", null, "-", src_elements.a("a", {
                        href: cmgmIn[item.siteID].url,
                        target: "_blank"
                    }, "CMGM")));
                }
                outputText += src_elements.a("span", null, src_elements.a("a", {
                    style: styleInfo,
                    class: "pciSearchResult",
                    href: newItemUrl,
                    onclick: runOnclick
                }, formattedTitle, " ", formattedSiteId), distance, metadata, nrLteTacTooltip, cmgm, src_elements.a("br", null));
                siteIdsWithPci.push(`${formattedTitle} ${formattedSiteId}${distance.replaceAll("[", "(").replaceAll("]", ")")}`);
            }
            let headerTooltipModal;
            if (technology == "LTE") {
                headerTooltipModal = `<a href='#' data-toggle='tooltip' title='LTE ${customTac} × 256 = NR ${Number(customTac) * 256}'> *</a>`;
            } else if (technology == "NR") {
                headerTooltipModal = `<a href='#' data-toggle='tooltip' title='NR ${customTac} ÷ 256 = LTE ${Number(customTac) / 256}'> *</a>`;
            }
            let outputText = `<b> ${isTargetedSearch ? "Targeted" : "General"} search for ${technology == "NR" ? "NR PCI" : "PCI"} ` + String(pciPsc) + (!isLacSpecified ? "" : " in LAC " + customTac) + (isLacSpecified && window.pciPlus_showNrInLtePciSearch ? headerTooltipModal : "") + "</b><br/>";
            if (towerData.length > 0) {
                outputText += "<br/>";
                let cmgmResults;
                if (window.pciPlus_enableCmgmIntegration) {
                    let siteIds = [];
                    for (let i of sameTacSearchResults) {
                        siteIds.push(parseInt(i.siteID));
                    }
                    for (let i = 0; i < 15; i++) {
                        if (towerData[i] == undefined) {
                            break;
                        }
                        siteIds.push(parseInt(towerData[i].siteID));
                    }
                    try {
                        pciLoadToast.appendContents("<br/> Searching CMGM...");
                        cmgmResults = await getTowers(MCC, MNC, undefined, siteIds, "id");
                    } catch (err) {
                        devLogger("CMGM Experienced an error while PCI Searching:", err);
                    }
                }
                devLogger("hyperlocal:", isLacSpecified, sameTacSearchResults);
                if (isLacSpecified && sameTacSearchResults.length > 0) {
                    devLogger("PCI Search CMGM Results:", cmgmResults);
                    outputText += `<b>In-LAC results</b> <br />`;
                    $.each(sameTacSearchResults, ((i, item) => generateTowerListItem(item, "hyperlocal", cmgmResults)));
                    outputText += "<br />";
                }
                outputText += `<b>${isLacSpecified && sameTacSearchResults.length > 0 ? "Other r" : "Nearby r"}esults </b><br />`;
                $.each(towerData, ((i, item) => generateTowerListItem(item, "networkwide", cmgmResults)));
            } else {
                outputText += "<br />No results found :(";
            }
            $(".modal-body").css("text-align", "left");
            const alert = bootbox.alert(outputText);
            alert.on("shown.bs.modal", (() => {
                const footer = alert[0].querySelector(".modal-footer");
                const button = textToHtml(src_elements.a("button", {
                    style: "margin-right: auto; display: block",
                    class: "btn btn-warning",
                    title: "Copy results to clipboard"
                }, "Copy"));
                button.onclick = () => {
                    const text = String(siteIdsWithPci.toString().replaceAll(",", "\n"));
                    copyToClipboard(text);
                };
                footer.insertBefore(button, footer.querySelector("button"));
            }));
            if (pciLoadToastTimeout) {
                clearTimeout(pciLoadToastTimeout);
            }
            pciLoadToast.hideToast();
            $(`.pciLink${pciPsc}`).css({
                color: inline_link_color
            });
        }
        async function handleTowerSearch(input_id, returnData) {
            let {API_URL, MCC, MNC, netType, handleResponse, bootbox, isMobileDevice, toggleMobile} = window;
            let towerId;
            if (input_id) {
                towerId = input_id;
            } else {
                towerId = $("#tower_search").val();
            }
            if (towerId == atob("Y21nbWZ0dw==") || towerId == atob("Y21nbSBmdHc=")) {
                let easterEggClaimedToast = new PPToast("easterEggToast");
                easterEggClaimedToast.setContents("Nice job! Color Randomizer has been enabled :)");
                easterEggClaimedToast.setupTimeout(5e3);
                easterEggClaimedToast.showToast();
                toggleSetting("pciPlus_randomizeSectorColors", true);
                if ($("#ppSettings > thead > tr")[0].classList[0] == "collapsedSection") {
                    $("#ppSettings > thead > tr > td").trigger("click");
                }
                $("#tower_search").val("");
                $("#towersearch > thead > tr > td").trigger("click");
                return;
            } else if (towerId == "reset") {
                window.removeAllTowers();
                $("#tower_search").val("");
                return;
            }
            towerId = towerId.trim().replace(/[^0-9a-fA-FXx]/, "");
            const getSiteParams = {
                MCC: String(MCC),
                MNC: String(MNC),
                Site: towerId,
                RAT: netType
            };
            const towerSearchRes = await fetch(API_URL + "/getSite?" + new URLSearchParams(getSiteParams), {
                credentials: "include"
            });
            let responseData = await towerSearchRes.json();
            devLogger("response Data:", responseData);
            const askLocationSearchHtml = `Did you mean to do a <a href='#' onclick="\n      bootbox.hideAll();\n      $('#locsearch > thead > tr > td').click()\n      $('#towersearch > thead > tr > td').click()\n      $('#tower_search').val('')\n      $('#location_search').val('${towerId}');\n      handleLocationSearch()\n    "\n    >location search</a>?`;
            if (responseData.responseData === "Cannot search this field") {
                bootbox.alert(`That's not a valid Tower ID. <br /> <br />` + askLocationSearchHtml);
                return;
            }
            const towerData = handleResponse(responseData);
            if (returnData) {
                return towerData;
            }
            if (towerData.length === 1) {
                let item = towerData[0];
                centreMap(item.latitude, item.longitude, true, 19);
                if (isMobileDevice) {
                    toggleMobile();
                }
            } else if (towerData.length === 0) {
                bootbox.alert("No towers were found. <br/ ><br/>" + askLocationSearchHtml);
            } else {
                let output = "<b>Results of tower search of " + parseInt(towerId) + "</b><br />";
                $.each(towerData, (function(i, item) {
                    let title = genNodeTitle(netType);
                    output += `<a href='#' onclick='if (isMobileDevice) {toggleMobile()}; centreMap(${item.latitude},${item.longitude},true,20)'>${title} ${item.siteID}</a><br/>`;
                }));
                bootbox.alert(output);
            }
        }
        async function getNetworkTitle(MCC, MNC) {
            let {API_URL, handleResponse} = window;
            let origTitle = document.title;
            const networkTitleReqParams = {
                MCC: String(MCC),
                MNC: String(MNC)
            };
            let networkTitleRes = await fetch(API_URL + "getNetworkTitle?" + new URLSearchParams(networkTitleReqParams), {
                credentials: "include"
            });
            let networkTitleJson = await networkTitleRes.json();
            const networkInfo = handleResponse(networkTitleJson);
            if (document.title == origTitle) {
                document.title = `${networkInfo.providerName} (${networkInfo.countryName}) = Cellular Coverage and Tower Map`;
                return true;
            } else {
                devLogger("Title has changed since init, ignore request to change");
                return false;
            }
        }
        function toggleTowerLabels() {
            const {MCC, MNC, netType} = window;
            window.showTowerLabels = !window.showTowerLabels;
            $.cookie("showTowerLabels", window.showTowerLabels, {
                expires: 3600
            });
            clearCoverage();
            pp_removeAllTowers();
            window.getTowersInView(MCC, MNC, true, netType);
            window.updateLinkback();
        }
        function toggleHex() {
            let {getTowersInView, updateLinkback, MCC, MNC, netType} = window;
            window.showHex = !window.showHex;
            $.cookie("showHex", window.showHex, {
                expires: 3600
            });
            getTowersInView(MCC, MNC, true, netType);
            updateLinkback();
        }
        const bands = {
            71: {
                A: [ [ 663, 698 ], [ 617, 622 ] ],
                B: [ [ 668, 673 ], [ 622, 627 ] ],
                C: [ [ 673, 678 ], [ 627, 632 ] ],
                D: [ [ 678, 683 ], [ 632, 637 ] ],
                E: [ [ 683, 688 ], [ 637, 642 ] ],
                F: [ [ 688, 693 ], [ 642, 647 ] ],
                G: [ [ 693, 698 ], [ 647, 652 ] ]
            },
            12: {
                A: [ [ 698, 704 ], [ 728, 734 ] ],
                B: [ [ 704, 710 ], [ 734, 740 ] ],
                C: [ [ 710, 716 ], [ 740, 746 ] ],
                D: [ [], [ 716, 722 ] ],
                E: [ [], [ 722, 728 ] ]
            },
            5: {
                A: [ [ 824, 835 ], [ 869, 880 ] ],
                A2: [ [ 845, 846.5 ], [ 890, 891.5 ] ],
                B: [ [ 835, 845 ], [ 880, 890 ] ],
                B2: [ [ 846.5, 849 ], [ 891.5, 894 ] ]
            },
            66: {
                A1: [ [ 1695, 1700 ], [] ],
                B1: [ [ 1700, 1710 ], [] ],
                A: [ [ 1710, 1720 ], [ 2110, 2120 ] ],
                B: [ [ 1720, 1730 ], [ 2120, 2130 ] ],
                C: [ [ 1730, 1735 ], [ 2130, 2135 ] ],
                D: [ [ 1735, 1740 ], [ 2135, 2140 ] ],
                E: [ [ 1740, 1745 ], [ 2140, 2145 ] ],
                F: [ [ 1745, 1755 ], [ 2145, 2155 ] ],
                G: [ [ 1755, 1760 ], [ 2155, 2160 ] ],
                H: [ [ 1760, 1765 ], [ 2160, 2165 ] ],
                I: [ [ 1765, 1770 ], [ 2165, 2170 ] ],
                J: [ [ 1770, 1780 ], [ 2170, 2180 ] ]
            },
            25: {
                A: [ [ 1850, 1870 ], [ 1930, 1945 ] ],
                D: [ [ 1865, 1870 ], [ 1945, 1950 ] ],
                B: [ [ 1870, 1885 ], [ 1950, 1965 ] ],
                E: [ [ 1885, 1890 ], [ 1965, 1970 ] ],
                F: [ [ 1890, 1895 ], [ 1970, 1975 ] ],
                C: [ [ 1895, 1910 ], [ 1975, 1990 ] ],
                G: [ [ 1910, 1915 ], [ 1990, 1995 ] ]
            },
            41: {
                BRS_1: [ 2496, 2502 ],
                EBS_A1: [ 2502, 2507.5 ],
                EBS_A2: [ 2507.5, 2513 ],
                EBS_A3: [ 2513, 2518.5 ],
                EBS_B1: [ 2518.5, 2524 ],
                EBS_B2: [ 2524, 2529.5 ],
                EBS_B3: [ 2529.5, 2535 ],
                EBS_C1: [ 2535, 2540.5 ],
                EBS_C2: [ 2540.5, 2546 ],
                EBS_C3: [ 2546, 2551.5 ],
                EBS_D1: [ 2551.5, 2557 ],
                EBS_D2: [ 2557, 2562.5 ],
                EBS_D3: [ 2562.5, 2568 ],
                EBS_JA1: [ 2568, 2568.33333 ],
                EBS_JA2: [ 2568.33333, 2568.66666 ],
                EBS_JA3: [ 2568.66666, 2569 ],
                EBS_JB1: [ 2569, 2569.33333 ],
                EBS_JB2: [ 2569.33333, 2569.66666 ],
                EBS_JB3: [ 2569.66666, 2570 ],
                EBS_JC1: [ 2570, 2570.33333 ],
                EBS_JC2: [ 2570.33333, 2570.66666 ],
                EBS_JC3: [ 2570.66666, 2571 ],
                EBS_JD1: [ 2571, 2571.33333 ],
                EBS_JD2: [ 2571.33333, 2571.66666 ],
                EBS_JD3: [ 2571.66666, 2572 ],
                EBS_A4: [ 2572, 2578 ],
                EBS_B4: [ 2578, 2584 ],
                EBS_C4: [ 2584, 2590 ],
                EBS_D4: [ 2590, 2596 ],
                EBS_G4: [ 2596, 2602 ],
                F4: [ 2602, 2608 ],
                E4: [ 2608, 2614 ],
                BRS_KH1: [ 2614, 2614.33333 ],
                BRS_KH2: [ 2614.33333, 2614.66666 ],
                BRS_KH3: [ 2614.66666, 2615 ],
                EBS_KG1: [ 2615, 2615.33333 ],
                EBS_KG2: [ 2615.33333, 2615.66666 ],
                EBS_KG3: [ 2615.66666, 2616 ],
                BRS_KF1: [ 2616, 2616.33333 ],
                BRS_KF2: [ 2616.33333, 2616.66666 ],
                BRS_KF3: [ 2616.66666, 2617 ],
                BRS_KE1: [ 2617, 2617.33333 ],
                BRS_KE2: [ 2617.33333, 2617.66666 ],
                BRS_KE3: [ 2617.66666, 2618 ],
                BRS_2: [ 2618, 2624 ],
                E1: [ 2624, 2629.5 ],
                E2: [ 2629.5, 2635 ],
                E3: [ 2635, 2640.5 ],
                F1: [ 2640.5, 2646 ],
                F2: [ 2646, 2651.5 ],
                F3: [ 2651.5, 2657 ],
                BRS_H1: [ 2657, 2662.5 ],
                BRS_H2: [ 2662.5, 2668 ],
                BRS_H3: [ 2668, 2673.5 ],
                EBS_G1: [ 2673.5, 2679 ],
                EBS_G2: [ 2679, 2684.5 ],
                EBS_G3: [ 2684.5, 2690 ]
            },
            77: {
                A1: [ 3700, 3720 ],
                A2: [ 3720, 3740 ],
                A3: [ 3740, 3760 ],
                A4: [ 3760, 3780 ],
                A5: [ 3780, 3800 ],
                B1: [ 3800, 3820 ],
                B2: [ 3820, 3840 ],
                B3: [ 3840, 3860 ],
                B4: [ 3860, 3880 ],
                B5: [ 3880, 3900 ],
                C1: [ 3900, 3920 ],
                C2: [ 3920, 3940 ],
                C3: [ 3940, 3960 ],
                C4: [ 3960, 3980 ],
                "DoD-A": [ 3450, 3460 ],
                "DoD-B": [ 3460, 3470 ],
                "DoD-C": [ 3470, 3480 ],
                "DoD-D": [ 3480, 3490 ],
                "DoD-E": [ 3490, 3500 ],
                "DoD-F": [ 3500, 3510 ],
                "DoD-G": [ 3510, 3520 ],
                "DoD-H": [ 3520, 3530 ],
                "DoD-I": [ 3530, 3540 ],
                "DoD-J": [ 3540, 3550 ]
            }
        };
        function getFreqBlockName(inBand, inUlFreq, inDlFreq) {
            if (inBand == 17) {
                inBand = 12;
            } else if (inBand == 2) {
                inBand = 25;
            } else if (inBand == 4) {
                inBand = 66;
            }
            if (!bands[inBand]) {
                return false;
            }
            let blocks = bands[inBand];
            let foundBlocks = [];
            if (inUlFreq === inDlFreq) {
                for (let i of Object.values(blocks)) {
                    if (inUlFreq >= i[0] && inUlFreq <= i[1]) {
                        let block = Object.keys(blocks)[Object.values(blocks).indexOf(i)];
                        foundBlocks.push(block);
                    }
                }
            } else {
                for (let i of Object.values(blocks)) {
                    if (inUlFreq >= i[0][0] && inUlFreq <= i[0][1] && inDlFreq >= i[1][0] && inDlFreq <= i[1][1]) {
                        let block = Object.keys(blocks)[Object.values(blocks).indexOf(i)];
                        foundBlocks.push(block);
                    }
                }
            }
            return foundBlocks;
        }
        async function _renderCalculateFrequency(res, cid, isEstimated) {
            const {netType, pciPlus_combineUlDlFreq} = window;
            let table = $(`#detailsTable${cid} > tbody`);
            let rxTxFreqs;
            let estimatedWarning = (() => {
                if (isEstimated) {
                    return src_elements.a("a", {
                        href: "#",
                        "data-toggle": "tooltip",
                        "data-placement": "center",
                        title: "Estimated data"
                    }, "*");
                } else {
                    return "";
                }
            })();
            if (pciPlus_combineUlDlFreq) {
                rxTxFreqs = src_elements.a("tr", {
                    class: "detailsTableCombinedFrequency"
                }, src_elements.a("td", {
                    title: "Uplink / Downlink Frequency"
                }, "UL / DL Frequency", estimatedWarning), src_elements.a("td", null, `${res.rxFrequency} MHz ${res.modulation === "TDD" ? "" : "/ " + res.txFrequency + " MHz"}`));
            } else {
                rxTxFreqs = src_elements.a("tr", {
                    class: "detailsTableUplinkFrequency"
                }, src_elements.a("td", null, "Uplink Frequency", estimatedWarning), src_elements.a("td", null, res.rxFrequency, " MHz"));
                rxTxFreqs = src_elements.a("tr", {
                    class: "detailsTableDownlinkFrequency"
                }, src_elements.a("td", null, "Downlink Frequency", estimatedWarning), src_elements.a("td", null, res.txFrequency, " MHz"));
            }
            let blockName = (() => {
                let freqBlockName = getFreqBlockName(res.bandNumber, res.rxFrequency, res.txFrequency);
                if (!freqBlockName || freqBlockName.length == 0) {
                    return "";
                }
                const {MCC} = window;
                if (MCC < 310 || MCC > 316) {
                    return "";
                }
                let blocks = freqBlockName.toString().replace(",", "/");
                if (freqBlockName.length > 1) {
                    blocks = "Blocks " + blocks;
                } else {
                    blocks = "Block " + blocks;
                }
                if (res.bandName == "BRS/EBS") {
                    blocks = blocks.replaceAll("Block", "Channel");
                }
                blocks = "—" + blocks;
                return blocks;
            })();
            let bands = src_elements.a("tr", {
                class: "detailsTableFrequencyBandNameNumber"
            }, src_elements.a("td", null, "Frequency Band"), src_elements.a("td", null, src_elements.a("span", {
                class: "detailsTableFreqBandBandName"
            }, res.bandName), src_elements.a("span", {
                class: "detailsTableFreqBandBandNumber"
            }, `(${genBandTitle(window.currentSite.RAT)}${res.bandNumber}`), src_elements.a("span", {
                class: "detailsTableFreqBandModulation"
            }, `${res.modulation})`), src_elements.a("span", {
                class: "detailsTableFreqBandBlockName"
            }, " ", blockName)));
            const tableHtml = table.html();
            const tableHtmlHasDetails = new RegExp("detailsTable[A-z]*Freq").test(tableHtml);
            if (!(tableHtml == undefined || tableHtmlHasDetails)) {
                table.append(rxTxFreqs);
                table.append(bands);
            }
        }
        function closeMobileMenu() {
            if (window.isMobileDevice) {
                $(".bootbox.modal").modal("hide");
            }
        }
        function addTimeToSidebar(jNode) {
            try {
                let {currentSite} = window;
                let arr = [ ...jNode[0].childNodes[1].childNodes ];
                const cellIdRegex = /^(?:Cell\sIdentifier|Cell\sID)\s?(\d+)/;
                let match = arr[0].innerText.match(cellIdRegex);
                if (!match) {
                    devLogger("Can't add time, found no match CID in", arr[0].innerText);
                    return;
                }
                let cid = match[1];
                let fsIndex = arr.indexOf(arr.find((i => i.innerText.includes("First"))));
                let lsIndex = arr.indexOf(arr.find((i => i.innerText.includes("Last"))));
                let fsTimeCell = new Date(currentSite.cells[cid].FirstSeen).toLocaleString();
                let lsTimeCell = new Date(currentSite.cells[cid].LastSeen).toLocaleString();
                let table = document.getElementById(`detailsTable${cid}`);
                if (typeof table !== "undefined") {
                    table.rows[fsIndex + 1].children[1].setAttribute("title", fsTimeCell);
                    table.rows[lsIndex + 1].children[1].setAttribute("title", lsTimeCell);
                }
            } catch (err) {
                devLogger("Error adding time to sidebar:", err);
            }
        }
        function patchGetBaseStation() {
            const origGetBaseStation = window.getBaseStation;
            window.getBaseStation = async (MCC, MNC, LAC, site, marker) => {
                const {pciPlus_customSectorColors, sectorColors, pciPlus_fixCmSectorColors} = window;
                let ogCurrentSite = window.currentSite;
                devLogger("og:", ogCurrentSite);
                origGetBaseStation(MCC, MNC, LAC, site, marker);
                devLogger("got base station");
                let notReadyCount = 0;
                async function checkifReady() {
                    if (notReadyCount > 200) {
                        devLogger("Failed to get base station");
                        return false;
                    } else if (window.currentSite === ogCurrentSite) {
                        devLogger("not ready yet", window.currentSite, notReadyCount);
                        notReadyCount++;
                        const sleep = ms => new Promise((r => setTimeout(r, ms)));
                        await sleep(50);
                        await checkifReady();
                    } else {
                        devLogger("ready, continuing", window.currentSite);
                        await executePatches();
                        return true;
                    }
                }
                return await checkifReady();
                async function executePatches() {
                    const {currentSite, _renderUserStats} = window;
                    devLogger("Running post-getBaseStation patches");
                    if (window.pciPlus_showSidebar) {
                        let tables = [ ...document.querySelector("#modal_tower_details_content").children ];
                        for (let i of tables) {
                            i.classList.remove("modal_table");
                        }
                    }
                    if (currentSite.towerAttributes.TOWER_TYPE !== undefined && currentSite.towerAttributes.TOWER_TYPE == "DAS") {
                        const detailsTable = $("#modal_tower_details_content > table:nth-child(1)");
                        detailsTable.find('td:contains("First Seen")').text("First Seen (Parent)");
                        detailsTable.find('td:contains("Last Seen")').text("Last Seen (Parent)");
                    }
                    $("#modal_tower_details_content > table:nth-child(1)").addClass("table-color-dynamic");
                    $("#divcontentdata").parent().parent().parent().parent().addClass("table-color-dynamic");
                    const detailRowClasses = {
                        "Cell Identifier": "detailsTableCid",
                        "Cell ID": "detailsTableCid",
                        "System Subtype": "detailsTableSystemSubtype",
                        PCI: "detailsTablePci",
                        "RNC-ID": "detailsTableRncId",
                        Bandwidth: "detailsTableBandwidth",
                        EARFCN: "detailsTableEARFCN",
                        UARFCN: "detailsTableUARFCN",
                        ARFCN: "detailsTableARFCN",
                        "Maximum Signal (RSRP)": "detailsTableMaxSignalRSRP",
                        "Maximum Signal (RSSI)": "detailsTableMaxSignalRSSI",
                        Direction: "detailsTableDirection",
                        "First Seen": "detailsTableFirstSeenDate",
                        "Last Seen": "detailsTableLastSeenDate",
                        "5G ENDC Available": "detailsTableEndcAvailable",
                        Actions: "detailsTableActionsPanel",
                        "Max / Avg DL Speed": "detailsTableDlSpeed",
                        "Max / Avg UL Speed": "detailsTableUlSpeed"
                    };
                    const tables = Array.from($("#modal_tower_details_content")[0].childNodes);
                    for (const table of tables.filter((t => t.id.startsWith("detailsTable")))) {
                        const rows = Array.from($(`#${table.id} > tbody`)[0].children);
                        for (const row of rows) {
                            const rowNameCell = row.querySelector("td:nth-child(1)");
                            const className = detailRowClasses[rowNameCell.innerText];
                            if (className) {
                                row.classList.add(className);
                            }
                        }
                    }
                    for (let cell of Object.keys(window.currentSite.cells)) {
                        if (pciPlus_customSectorColors == "map" || pciPlus_customSectorColors == "none") {
                            $(`#detailsTable${cell}`).css("border-color", "#000000");
                        } else if (window.pciPlus_fixCmSectorColors !== "none") {
                            switch (window.pciPlus_fixCmSectorColors) {
                              case "contrastify":
                                {
                                    $(`#detailsTable${cell}`).css("border-color", correctCmColor(window.sectorColors[cell]));
                                    break;
                                }

                              case "fix":
                                {
                                    let index = Object.keys(window.currentSite.cells).indexOf(String(cell));
                                    let arfcn = window.currentSite.channels[index];
                                    let newColor = genRandomColor(arfcn);
                                    $(`#detailsTable${cell}`).css("border-color", newColor);
                                    break;
                                }
                            }
                        }
                        $(`#detailsTable${cell}`).css("border-width", "3.85px");
                        $(`#detailsTable${cell}`).addClass("table-color-dynamic");
                    }
                    async function renderContributitors() {
                        const ogSiteId = Number(site);
                        await getUser(parseInt(currentSite.towerAttributes.TOWER_MOVER_ID)).then((locator => {
                            if (parseInt(window.currentSite.siteID) !== ogSiteId) {
                                return;
                            } else {
                                _renderUserStats(locator.id, "towerLocators");
                            }
                        }));
                        createContributorContainers();
                        let contributorsNum = 0;
                        let nonPremiumContributorsNum = 0;
                        for (let user of currentSite.towerAttributes.TOWER_CONTRIBUTORS) {
                            if (parseInt(window.currentSite.siteID) !== ogSiteId) {
                                return;
                            }
                            getUser(user).then((contributor => {
                                window.userCache[contributor.id].userName = contributor.userName.replaceAll("-", "&#8209;");
                                if (contributor.premium) {
                                    _renderUserStats(contributor.id, "premiumContributors");
                                } else {
                                    nonPremiumContributorsNum++;
                                    const domCounter = $("#nonPremiumContributorsToggleNumber");
                                    const nonPremiumNum = parseInt(domCounter.text());
                                    domCounter.text(nonPremiumNum + 1);
                                    _renderUserStats(contributor.id, "nonPremiumContributors");
                                }
                                contributorsNum++;
                                if (contributorsNum >= 20 && nonPremiumContributorsNum >= 10) {
                                    $("#nonPremiumContributors").addClass("collapse hide");
                                    $("#nonPremiumContributorsToggle").removeClass("d-none");
                                    $("#nonPremiumContributorsToggleSpacer").removeClass("d-none");
                                }
                            }));
                        }
                    }
                    await renderContributitors();
                }
            };
        }
        function createContributorContainers() {
            let premiumList = src_elements.a("span", {
                id: "premiumContributors"
            });
            $("#towerContributors").append(premiumList);
            const nonPremiumToggle = src_elements.a("a", {
                id: "nonPremiumContributorsToggle",
                href: "#",
                class: "d-none",
                style: "color: blue; user-select: none; padding-left: 5px;"
            }, `(Show&nbsp;<span id="nonPremiumContributorsToggleNumber">0</span>&nbsp;More)`);
            $("#towerContributors").append(nonPremiumToggle);
            let nonPremiumList = src_elements.a("span", null, src_elements.a("span", {
                id: "nonPremiumContributors",
                class: ""
            }, src_elements.a("br", {
                id: "nonPremiumContributorsToggleSpacer",
                class: "d-none"
            })));
            $("#towerContributors").append(nonPremiumList);
            $("#nonPremiumContributorsToggle").on("click", (event => {
                const toggleText = $("#nonPremiumContributorsToggle").text();
                if (toggleText.includes("Show")) {
                    $("#nonPremiumContributors").removeClass("hide");
                    $("#nonPremiumContributors").addClass("show");
                    $("#nonPremiumContributorsToggle").text(toggleText.replaceAll("Show", "Hide"));
                } else if (toggleText.includes("Hide")) {
                    $("#nonPremiumContributors").removeClass("show");
                    $("#nonPremiumContributors").addClass("hide");
                    $("#nonPremiumContributorsToggle").text(toggleText.replaceAll("Hide", "Show"));
                }
                event.preventDefault();
            }));
        }
        async function handleUpdates() {
            const updateUrl = "https://greasyfork.org/scripts/439545-cellmapper-pci/code/CellMapper%20PCI+.user.js";
            const greasyForkApiUrl = "https://greasyfork.org/en/scripts/439545-cellmapper-pci.json";
            const {getParamOrCookie, bootbox} = window;
            console.log("[PCI+] Checking for updates...");
            let installedVersion;
            let secondInstalledVersion;
            let latestVersion;
            try {
                installedVersion = changelog[0].version;
                secondInstalledVersion = changelog[1].version;
                let greasyForkResponse = await fetch(greasyForkApiUrl);
                let pciPlusApiResults = await greasyForkResponse.json();
                devLogger("Update API response:", pciPlusApiResults);
                if (pciPlusApiResults == undefined) {
                    throw new Error("Update API did not return valid results");
                }
                latestVersion = pciPlusApiResults.version;
            } catch (err) {
                console.log("[PCI+] Something went wrong while checking for updates. You may not be on the latest version.");
                return;
            }
            devLogger(`latest: ${latestVersion}, installed: ${installedVersion}`);
            if (latestVersion == secondInstalledVersion) {
                devLogger("You're one version ahead of latest; skipping update prompt");
            } else if ($.cookie("pciPlus_skipUpdateCheck") === "true") {
                devLogger("Cookie present, skipping update check");
            } else if (window.ppBrowserExtension === true) {
                devLogger("Using browser extension, so skipping update check");
            } else if (latestVersion != installedVersion) {
                let out = `<div style="text-align: center; font-size: medium;"> Please update to PCI+ <b>${latestVersion}.</b>\n    </div>`;
                bootbox.confirm({
                    centerVertical: true,
                    closeButton: false,
                    buttons: {
                        confirm: {
                            className: "btn-primary",
                            label: "Update"
                        },
                        cancel: {
                            label: "Cancel",
                            className: "btn-danger"
                        }
                    },
                    callback: res => {
                        if (res) {
                            window.open(updateUrl, "_blank");
                        }
                    },
                    title: "<center>Update Available</center>",
                    message: out
                });
                return;
            }
            let lastKnownVersion = getParamOrCookie("pciPlus_version");
            if (lastKnownVersion != installedVersion) {
                if (lastKnownVersion == undefined) {
                    devLogger("saving version cookie for the first time");
                    $.cookie("pciPlus_version", installedVersion);
                }
                devLogger(`we updated, from ${lastKnownVersion} to ${installedVersion}`);
                popupChangelog();
                $.cookie("pciPlus_version", installedVersion, {
                    expires: new Date("9999-01-01")
                });
            }
        }
        function patchDefaultSectorColours() {
            window.showSectorColours = true;
            let sectorColoursSetting = document.getElementById("SectorColours").parentNode.parentNode;
            sectorColoursSetting.parentNode.removeChild(sectorColoursSetting);
        }
        function changeMapType(newType) {
            const {ol, baseAttrib, map} = window;
            devLogger("Changing map type to", newType);
            let baseLayer;
            switch (newType) {
              case "roadmap":
              case "osm_street":
                baseLayer = new ol.source.OSM({
                    attributions: [ baseAttrib, '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.' ],
                    crossOrigin: "anonymous",
                    transition: 0
                });
                break;

              case "osm_transport":
                baseLayer = new ol.source.XYZ({
                    attributions: [ baseAttrib, "© OpenStreetMap and Thunderforest" ],
                    crossOrigin: "anonymous",
                    url: "https://b.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391",
                    maxZoom: 21
                });
                break;

              case "esri_satellite":
                baseLayer = new ol.source.XYZ({
                    attributions: [ baseAttrib, "Powered by Esri", "Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community" ],
                    attributionsCollapsible: false,
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                    maxZoom: 18,
                    crossOrigin: "anonymous"
                });
                break;

              case "esri_topo":
                baseLayer = new ol.source.XYZ({
                    attributions: [ baseAttrib, 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>' ],
                    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
                    maxZoom: 18
                });
                break;

              case "losangelescounty_aerial":
                baseLayer = new ol.source.XYZ({
                    attributions: [ baseAttrib, 'Tiles courtesy of <a href="https://lariac-lacounty.hub.arcgis.com/pages/lariac6-documents-data">Los Angeles Region Imagery Acquisition Consortium</a>' ],
                    url: "https://svc.pictometry.com/Image/BCC27E3E-766E-CE0B-7D11-AA4760AC43ED/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=PICT-LARIAC6--pCqXruF2NL&STYLE=default&FORMAT=image/png&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
                    maxZoom: 21
                });
                break;

              case "massachusetts_aerial":
                baseLayer = new ol.source.XYZ({
                    attributions: [ baseAttrib, "Tiles courtesy of <a href=https://massgis.maps.arcgis.com/apps/OnePane/basicviewer/index.html?appid=47689963e7bb4007961676ad9fc56ae9>MassGIS</a>" ],
                    url: "https://tiles.arcgis.com/tiles/hGdibHYSPO59RG1h/arcgis/rest/services/orthos2021/MapServer/tile/{z}/{y}/{x}"
                });
                break;

              case "usgs_satellite":
                baseLayer = new ol.source.XYZ({
                    attributions: [ baseAttrib, 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>' ],
                    url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
                    maxZoom: 18
                });
                break;

              case "blank":
                baseLayer = new ol.source.XYZ({
                    url: "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                });
                break;
            }
            let layers = map.getLayers();
            if (layers.getLength() > 0) {
                layers.removeAt(0);
            }
            let toAddLayer = new ol.layer.Tile({
                source: baseLayer
            });
            layers.insertAt(0, toAddLayer);
            window.mapType = newType;
            if (window.darkMode) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
            window.updateLinkback();
        }
        function addCustomBasemaps() {
            const mapList = textToHtml(src_elements.a("select", {
                id: "map_select_layer"
            }, src_elements.a("optgroup", {
                label: "Maps"
            }, src_elements.a("option", {
                value: "osm_street",
                selected: "true"
            }, "OpenStreetMap"), src_elements.a("option", {
                value: "osm_transport"
            }, "OpenStreetMap Transit"), src_elements.a("option", {
                value: "esri_topo"
            }, "ESRI Topographical")), src_elements.a("optgroup", {
                label: "Aerial"
            }, src_elements.a("option", {
                value: "esri_satellite"
            }, "ESRI Satellite"), src_elements.a("option", {
                value: "usgs_satellite"
            }, "USGS Satellite"), src_elements.a("option", {
                value: "losangelescounty_aerial"
            }, "LARIAC Satellite"), src_elements.a("option", {
                value: "massachusetts_aerial"
            }, "MassGIS Satellite")), src_elements.a("optgroup", {
                label: "Misc"
            }, src_elements.a("option", {
                value: "blank"
            }, "Blank"))));
            const cmOptions = $("#map_select_layer")[0].querySelectorAll("option");
            for (const option of cmOptions) {
                if (mapList.querySelector(`[value='${option.value}']`) == null) {
                    devLogger(`Failed to find CM option ${option.value}, adding to Misc`);
                    mapList.querySelector('[label="Misc"]').appendChild(option);
                }
            }
            $("#map_select_layer").replaceWith(mapList);
            $("#map_select_layer").on("change", (evt => {
                const selector = evt.target;
                changeMapType(selector.value);
            }));
            if (window.mapType && window.mapType !== "roadmap") {
                $("#map_select_layer").val(window.mapType);
            } else {
                $("#map_select_layer").val("osm_street");
            }
        }
        async function checkAndPromptCoordinates() {
            try {
                let regex = /^\s*[-+]?([1-8]?\d\.\d+?|90\.0+?)[,~\s]\s*([-+]?(?:180\.0+?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))\s*$/;
                let clipboard;
                try {
                    clipboard = await navigator.clipboard.readText();
                } catch (err) {
                    devLogger("Couldn't read clipboard", err);
                    return;
                }
                if (clipboard.match(regex)) {
                    devLogger("detected coordinates on the clipboard");
                    let matchedCoords = clipboard.match(regex);
                    let [lat, long] = [ matchedCoords[1], matchedCoords[2] ];
                    if (window.parsedCoordinates.includes([ lat, long ].toString())) {
                        devLogger("already prompted for these coords, not prompting again");
                        return;
                    }
                    let jumpClipboardCoordsToast = new PPToast("clipboardToast");
                    let jumpButton = document.createElement("button");
                    jumpButton.classList.add("btn");
                    jumpButton.classList.add("btn-info");
                    jumpButton.innerText = "Jump";
                    jumpButton.onclick = () => {
                        centreMap(parseFloat(matchedCoords[1]), parseFloat(matchedCoords[2]), true, 19);
                        jumpClipboardCoordsToast.clearTimeout();
                        jumpClipboardCoordsToast.hideToast();
                    };
                    let pinButton = document.createElement("button");
                    pinButton.classList.add("btn");
                    pinButton.classList.add("btn-primary");
                    pinButton.innerText = "Pin";
                    pinButton.onclick = () => {
                        const lat = matchedCoords[1];
                        const lon = matchedCoords[2];
                        if (window.currentSite != undefined) {
                            handleTowerMove_handleTowerMove(null, lat, lon, window.currentSite);
                        }
                        jumpClipboardCoordsToast.clearTimeout();
                        jumpClipboardCoordsToast.hideToast();
                    };
                    let noButton = document.createElement("button");
                    noButton.classList.add("btn");
                    noButton.classList.add("btn-secondary");
                    noButton.classList.add("floatRight");
                    noButton.innerText = "Close";
                    noButton.onclick = () => {
                        jumpClipboardCoordsToast.clearTimeout();
                        jumpClipboardCoordsToast.hideToast();
                    };
                    let offerBody = document.createElement("div");
                    let question = document.createElement("p");
                    question.innerHTML = "PCI+ found coordinates on your clipboard. <br/> What would you like to do?";
                    question.style.fontSize = "larger;";
                    offerBody.append(question);
                    offerBody.append(document.createElement("br"));
                    offerBody.append(jumpButton);
                    if (window.currentSite != undefined && $("#modal_tower_details_content").is(":visible") && (window.currentSite.towerMover == undefined || window.currentSite.towerMover < 1)) {
                        offerBody.append(" ");
                        offerBody.append(pinButton);
                    }
                    offerBody.append(" ");
                    offerBody.append(noButton);
                    jumpClipboardCoordsToast.setContents(offerBody);
                    jumpClipboardCoordsToast.setupTimeout(1e4);
                    jumpClipboardCoordsToast.showToast();
                    window.parsedCoordinates.push([ lat, long ].toString());
                } else {
                    devLogger("no coordinates detected");
                }
            } catch (err) {
                devLogger("Couldn't read clipboard. Error:", err);
            }
        }
        function addEventListeners() {
            $("#BandSelect").on("change", (() => {
                clearCoverage();
            }));
            $(document).on("keydown", (e => {
                if (e.key == "Escape") {
                    devLogger("Esc pressed, hiding all bootbox alerts");
                    window.bootbox.hideAll();
                    $("#modifyTowerLocationForm").find("button.btn.btn-secondary").click();
                    $("#modifyTowerTypeForm").find("button.btn.btn-secondary").click();
                }
            }));
            window.map.on("singleclick", (function(e) {
                if ($(".ol-tooltip").length > 0) {
                    e.stopPropagation();
                    return false;
                }
                if (window.prevHighlightedSector) {
                    let cid = window.prevHighlightedSector.get("CID");
                    window.prevHighlightedSector.setStyle(window.sectorStyles[cid]);
                    $(`#detailsTable${cid}`).css("border-style", "solid");
                }
            }));
            window.map.on("contextmenu", (event => {
                showContextMenu(event);
            }));
            window.map.getViewport().addEventListener("mousedown", (event => {
                const {ol, map, correctLongitude} = window;
                if (event.which == 2) {
                    const [lat, lon] = getMapCoordsFromClientCoords(event.clientX, event.clientY);
                    window.open(`https://www.google.com/maps?layer=c&cbll=${lat},${correctLongitude(lon)}`, "_blank");
                }
            }));
            if (window.CMApp == undefined) {
                let mapButton = document.querySelector("#navbarResponsive > ul:nth-child(1) > li:nth-child(1)");
                mapButton.onclick = () => {
                    clearCoverage();
                    return false;
                };
            }
            window.parsedCoordinates = [];
            $(window).on("focus", (() => {
                if (window.pciPlus_promptForClipboardCoords) {
                    devLogger("window focused, checking for coordinates");
                    checkAndPromptCoordinates();
                }
            }));
            window.MNCSelectBox.on("item_add", (item => {
                const updatedMCC = parseInt(item.substring(0, 3));
                const updatedMNC = parseInt(item.substring(3));
                let currentCarrierName = window.MNCSelectBox.options["" + updatedMCC + updatedMNC].text.split(" - ")[0].trim();
                devLogger("ITEM ADDED:", item, "PLMN:", updatedMCC, updatedMNC, "from previous:", currentCarrierName);
                toggleSetting("pciPlus_showLargeTiles", false);
                if (!window.prevCarrier) {
                    devLogger("no prevCarrier, returning");
                    return;
                }
                if (window.pciPlus_showFccPolygons !== "off") {
                    toggleFccLayer(true);
                }
                if (window.prevCarrier[window.prevCarrier.length - 1].MCC === updatedMCC && window.prevCarrier[window.prevCarrier.length - 1].MNC === updatedMNC) {
                    if (window.prevCarrier[window.prevCarrier.length - 1].netType !== window.netType) {
                        window.prevCarrier[window.prevCarrier.length - 1].RAT = window.netType;
                        devLogger("Detected duplicate carrier, did netType change?");
                    }
                    devLogger("Would be duplicate, not adding to list");
                    return;
                }
                window.showTiles(updatedMCC, updatedMNC);
                window.showBand = 0;
                window.prevCarrier.push({
                    MCC: updatedMCC,
                    MNC: updatedMNC,
                    name: currentCarrierName
                });
            }));
            window.select_interaction.listeners_.select[0] = () => {
                devLogger("map select fired, pci+ cancelling evt");
            };
            if (window.map.listeners_.click) {
                window.map.listeners_.click[0] = () => {
                    if ($(".contextmenu").is(":visible")) {
                        $(".contextmenu").remove();
                    }
                };
            }
            $._data(document.body).events.click[0].handler = elem => {
                devLogger("PCI+ saw table click", elem);
                $(elem.currentTarget).closest("table").find("tbody").toggle();
                $(elem.currentTarget).closest("table").find("tfoot").toggle();
                $(elem.currentTarget).closest("tr").toggleClass("collapsedSection collapsableSection");
                $("body").find(".collapsableSection").find(".caretIcon").html("&#xf151");
                $("body").find(".collapsedSection").find(".caretIcon").html("&#xf150");
                $("body").find(".collapsableSection").css("cursor", "pointer");
                $("body").find(".collapsedSection").css("cursor", "pointer");
                $("body").find(".collapsedSection").css("user-select", "none");
                $("body").find(".collapsableSection").css("user-select", "none");
            };
        }
        async function handleLocationSearch() {
            const {bootbox} = window;
            let inputLocation = $("#location_search").val();
            inputLocation = inputLocation.replaceAll("~", ",");
            devLogger("final input location:", inputLocation);
            const coordinateRegex = /^[-+]?([1-8]?\d\.\d+?|90\.0+?)[,~\s]\s*([-+]?(?:180\.0+?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))(?:[,~\s]\s?)*(\d+\.?\d*)?$/;
            if (inputLocation.match(coordinateRegex)) {
                const match = inputLocation.match(coordinateRegex);
                const [lat, long] = [ match[1], match[2] ];
                let zoom = parseFloat(match[3] ?? "20");
                centreMap(parseFloat(lat), parseFloat(long), true, zoom);
                return;
            }
            try {
                let res = await fetch("https://nominatim.openstreetmap.org/search?" + new URLSearchParams({
                    q: inputLocation,
                    format: "json",
                    limit: "1"
                }));
                let foundLocation = await res.json();
                if (foundLocation[0]) {
                    devLogger("Found location:", foundLocation);
                    centreMap(foundLocation[0].lat, foundLocation[0].lon, true, 20);
                } else {
                    devLogger("Couldn't find location!");
                    let noResultsToast = new PPToast("locationSearchNoResults", 5e3);
                    noResultsToast.setContents("Sorry, we couldn't find that location.");
                    noResultsToast.showToast();
                }
            } catch (err) {
                devLogger("Something went wrong seaching nominatim for location:", err);
                let searchFailedToast = new PPToast("locationSearchFailed", 5e3);
                searchFailedToast.setContents("Sorry, there was a problem searching. Please try again in a moment.");
                searchFailedToast.showToast();
            }
        }
        function waitForKeyElementsNoJq(selectorTxt, actionFunction, bWaitOnce) {
            var targetNodes, btargetsFound;
            targetNodes = document.querySelectorAll(selectorTxt);
            if (targetNodes && targetNodes.length > 0) {
                btargetsFound = true;
                targetNodes.forEach((function(element) {
                    var alreadyFound = element.dataset.found == "alreadyFound" ? "alreadyFound" : false;
                    if (!alreadyFound) {
                        var cancelFound = actionFunction(element);
                        if (cancelFound) btargetsFound = false; else element.dataset.found = "alreadyFound";
                    }
                }));
            } else {
                btargetsFound = false;
            }
            var controlObj = waitForKeyElementsNoJq.controlObj || {};
            var controlKey = selectorTxt.replace(/[^\w]/g, "_");
            var timeControl = controlObj[controlKey];
            if (btargetsFound && bWaitOnce && timeControl) {
                clearInterval(timeControl);
                delete controlObj[controlKey];
            } else {
                if (!timeControl) {
                    timeControl = setInterval((function() {
                        waitForKeyElementsNoJq(selectorTxt, actionFunction, bWaitOnce);
                    }), 100);
                    controlObj[controlKey] = timeControl;
                }
            }
            waitForKeyElementsNoJq.controlObj = controlObj;
        }
        function highlightByCid(cid) {
            const {ol} = window;
            let coverageUids = window.CoveragePolygonLayer.values_.source.uidIndex_;
            let marker;
            for (let i of Object.values(coverageUids)) {
                if (i["values_"].CID == cid) {
                    marker = i;
                }
            }
            if (typeof marker == "undefined") {
                return;
            }
            let baseColour = window.sectorColors[cid];
            if (typeof baseColour == "undefined") {
                baseColour = "#000000";
            } else {
                baseColour = "#" + baseColour;
            }
            let fillColour = window.ol.color.asArray(baseColour);
            fillColour = fillColour.slice();
            fillColour[0] = 255;
            fillColour[1] = 255;
            fillColour[2] = 255;
            fillColour[3] = .5;
            let strokeColor = window.ol.color.asArray(baseColour);
            strokeColor = strokeColor.slice();
            strokeColor[0] = 87;
            strokeColor[1] = 154;
            strokeColor[2] = 250;
            strokeColor[3] = 1;
            if (window.prevHighlightedSector != undefined) {
                var CID = window.prevHighlightedSector.get("CID");
                window.prevHighlightedSector.setStyle(window.sectorStyles[CID]);
                $("#detailsTable" + CID).css("border-style", "solid");
            }
            if (marker.getStyle() == window.sectorStyles[marker.get("CID")]) {
                marker.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: strokeColor,
                        width: 3
                    }),
                    fill: new ol.style.Fill({
                        color: fillColour
                    })
                }));
                window.prevHighlightedSector = marker;
            } else {
                marker.setStyle(window.sectorStyles[marker.get("CID")]);
            }
            let extent = marker.getGeometry().getExtent();
            window.map.getView().fit(extent);
            window.map.getView().setZoom(window.map.getView().getZoom() - .5);
            if (window.pciPlus_showSidebar) {
                $("html,body,#ppSidebar").animate({
                    scrollTop: $("#detailsTable" + cid).offset().top - $("#detailsTable" + cid).parent().offset().top - $("#detailsTable" + cid).parent().scrollTop()
                }, 500);
            } else {
                let detailsTableCell = $("#detailsTable" + cid);
                $("#modal_tower_details_content").animate({
                    scrollTop: detailsTableCell.offset().top - $("#modal_tower_details_content").offset().top + $("#modal_tower_details_content").scrollTop()
                }, 400, (function() {
                    detailsTableCell.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }));
            }
            $("#detailsTable" + marker.get("CID")).css("border-style", "dashed");
        }
        function waitForMapLoggedIn() {
            setTimeout((() => {
                if (window.isLoggedIn) {
                    return;
                } else {
                    devLogger("not logged in yet");
                    waitForMapLoggedIn();
                }
            }), 100);
        }
        async function q_gotoAndLoadTower(tower, tac, MCC, MNC, cid, latitude, longitude) {
            const {API_URL, handleResponse, getBaseStation} = window;
            devLogger("CID PASSED IN:", cid);
            let loggedInReq = await fetch(API_URL + "getIsLoggedIn", {
                credentials: "include"
            });
            let loggedInRes = handleResponse(await loggedInReq.json());
            let serverLoggedIn = loggedInRes.loginCheckResponseCode == "LOGGEDIN";
            if (serverLoggedIn) {
                waitForMapLoggedIn();
                await getBaseStation(MCC, MNC, parseInt(tac), parseInt(tower), undefined);
                if (latitude !== undefined && longitude !== undefined && window.zoom >= 17) {
                    const currentLat = window.currentSite.latitude;
                    const currentLon = window.currentSite.longitude;
                    if (calculateDistance(latitude, longitude, currentLat, currentLon, true) > 300) {
                        centreMap(window.currentSite.latitude, window.currentSite.longitude, true, 17);
                        let distance = calculateDistance(latitude, longitude, currentLat, currentLon) + " " + window.pciPlus_distanceUnit;
                        devLogger(`Tower Location changed by ${distance}, updated URL`);
                    } else {
                        devLogger("Distance unchanged, no need to update");
                    }
                } else {
                    devLogger("Lat/Lng not provided, or zoom is bad, forcing update", latitude, longitude);
                    if (window.currentSite !== undefined && window.currentSite.latitude !== undefined && window.currentSite.longitude !== undefined) {
                        centreMap(window.currentSite.latitude, window.currentSite.longitude, true, 17);
                    }
                }
                const data = await handleTowerSearch(String(tower), true);
                if (data.length > 1) {
                    await handleTowerSearch(String(tower));
                } else if (data.length == 0) {
                    return;
                }
                if (window.pciPlus_showSidebar) {
                    toggleSection("Details");
                } else {
                    window.toggleTowerInfo(true);
                }
                waitForKeyElementsNoJq("#divcontentdata", (jNode => {
                    if (cid) {
                        setTimeout((() => {
                            highlightByCid(cid);
                        }), 150);
                    }
                }), true);
            }
        }
        async function q_searchCell(MCC, MNC, RAT, cid, tac) {
            const {API_URL, handleResponse} = window;
            const params = {
                MCC,
                MNC,
                Cell: String(cid),
                RAT
            };
            let siteId;
            if (RAT == "LTE") {
                siteId = Math.trunc(cid / 256);
            } else {
                const req = await fetch(API_URL + "getCell?" + new URLSearchParams(params), {
                    credentials: "include"
                });
                const res = handleResponse(await req.json());
                if (res.length == 0) {
                    const toast = new PPToast("ppSFailedToast", 3e3);
                    toast.setContents("CID not found.");
                    toast.showToast();
                    return;
                }
                siteId = res[0].siteID;
            }
            q_gotoAndLoadTower(siteId, tac ? tac : 0, MCC, MNC, cid);
        }
        function q_searchLocation(location) {
            $("#location_search").val(location);
            $("#locsearch > thead > tr > td").click();
            window.dontCentreMap = true;
            handleLocationSearch();
        }
        function q_towerSearch(tower) {
            handleTowerSearch(tower);
            $("#tower_search").val(tower);
            $("#towersearch > thead > tr > td").click();
        }
        async function parseCustomQueryParams(queryParams) {
            const urlSearchParams = new URLSearchParams(queryParams || window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            devLogger("Parsing params:", params);
            if (params.ppT && params.MCC && params.MNC && !params.ppL) {
                return q_towerSearch(params.ppT);
            }
            if (params.ppT && params.ppL && params.MCC && params.MNC) {
                return await q_gotoAndLoadTower(params.ppT, params.ppL, params.MCC, params.MNC, null, params.latitude, params.longitude);
            }
            if (params.ppS) {
                devLogger("Found param location search:", params.ppS);
                q_searchLocation(params.ppS);
            }
            if (params.MCC && params.MNC && params.type && params.ppC) {
                return await q_searchCell(params.MCC, params.MNC, params.type, parseInt(params.ppC), params.ppL);
            }
        }
        function addTacField() {
            let pciPscSearchTd = $("#pcipsc_search").parent();
            pciPscSearchTd.css({
                display: "flex"
            });
            $("#pcipsc_search").css({
                width: "50%",
                left: "0px"
            });
            document.getElementById("pcipsc_search").placeholder = "PCI/PSC";
            let tacField = src_elements.a("input", {
                id: "tac_search",
                class: "form-control",
                type: "text",
                placeholder: "LAC",
                onclick: "handlePCIPSCSearch"
            });
            pciPscSearchTd.append(tacField);
            $("#tac_search").on("keypress", (evt => {
                if (evt.key == "Enter") {
                    handlePCIPSCSearch();
                }
            }));
            $("#tac_search").css({
                width: "50%",
                right: "0px"
            });
        }
        function moveToTower(MCC, MNC, RAT, latitude, longitude) {
            centreMap(latitude, longitude, true, 20);
            selectProvider(MCC, MNC, RAT);
            clearCoverage(false);
        }
        function setupCarrierSwitchback() {
            if (window.carrierSwitchbackSetup === true) {
                return;
            }
            if (window.savedFeatures) {
                window.savedFeatures.clear();
            }
            window.prevCarrier = [];
            let currentCarrierName = document.querySelector(`option[value="${window.MCC}${window.MNC}"]`).innerText.split(" - ")[0].trim();
            if (!(window.MCC == undefined || window.MNC == undefined)) {
                window.prevCarrier.push({
                    MCC: window.MCC,
                    MNC: window.MNC,
                    RAT: window.netType,
                    name: currentCarrierName
                });
            }
            window.carrierSwitchbackSetup = true;
        }
        function updateCountryName(elid) {
            if (window.pciPlus_hideCountryInSelect) {
                let el = document.querySelector(elid);
                let splitName = el.innerText.split(" - ");
                let newName = splitName[0] + " - " + splitName[2];
                if (!newName.includes("undefined")) {
                    el.innerText = newName;
                }
            }
        }
        async function hideCountryInSelect(toggle) {
            if (window.pciPlus_hideCountryInSelect || toggle) {
                let elid = "#select_provider_table > tbody > tr > td > div:nth-child(3) > div.ts-control > div";
                if (toggle) {
                    updateCountryName(elid);
                }
                waitForKeyElements(elid, (() => {
                    updateCountryName(elid);
                }));
            }
        }
        function createSidebar() {
            const sidebar = textToHtml(src_elements.a("div", {
                id: "ppSidebar"
            }));
            const tab1 = textToHtml(src_elements.a("div", {
                id: "tabs-1"
            }));
            const tab2 = textToHtml(src_elements.a("div", {
                id: "tabs-2",
                style: "display: none;"
            }));
            let ppSidebarNav = textToHtml(src_elements.a("div", {
                id: "ppSidebarNav",
                style: `background-clip: border-box; padding-bottom: 1rem;`
            }, src_elements.a("nav", {
                class: "navbar navbar-expand navbar-dark bg-primary",
                style: "height: 4rem;"
            }, src_elements.a("ul", {
                class: "navbar-nav nav-fill mr-auto w-100"
            }, src_elements.a("li", {
                class: "nav-item"
            }, src_elements.a("a", {
                class: "nav-link",
                onclick: "toggleSection('General')",
                href: "#"
            }, " ", src_elements.a("i", {
                class: "fa fa-home"
            }), " General")), src_elements.a("li", {
                class: "nav-item"
            }, src_elements.a("a", {
                class: "nav-link",
                onclick: "toggleSection('Details')",
                href: "#"
            }, " ", src_elements.a("i", {
                class: "z fa fa-book"
            }), " Details"))))));
            sidebar.appendChild(ppSidebarNav);
            sidebar.appendChild(tab1);
            sidebar.appendChild(tab2);
            return sidebar;
        }
        function post_cleanupMenuRelics() {
            $(".modal_dialog_content_base").css({
                "overflow-y": "inherit"
            });
            $("#modal_tower_details").remove();
            window.toggleTowerInfo = () => {
                toggleSection("Details");
            };
        }
        function pre_cleanupMenuRelics() {
            $("#fulltoggle").css({
                display: "none"
            });
        }
        function setupSettingsTab(settingsTables) {
            let settingsTab = document.querySelector("#tabs-1");
            const arrowDownCaret = src_elements.a("i", {
                class: "fa caretIcon"
            }, "");
            const arrowUpCaret = src_elements.a("i", {
                class: "fa caretIcon"
            }, "");
            for (let table of settingsTables) {
                if (table.needsHeader) {
                    let header = createHeaderForElement(table.name, table.dualCol, table.collapsed);
                    let element = document.getElementById(table.id);
                    element.insertBefore(textToHtml(header), element.firstChild);
                }
                let tableElement = document.getElementById(table.id);
                settingsTab.appendChild(tableElement);
                let tableClassList = [ ...document.querySelector(`#${table.id} > thead > tr`).classList ];
                if (tableClassList.includes("collapsableSection") || tableClassList.includes("collapsedSection")) {} else {
                    $(`#${table.id} > thead > tr`)[0].classList.add(table.collapsed ? "collapsedSection" : "collapsableSection");
                    if (tableElement.innerHTML.includes("caretIcon")) {
                        $(`${table.id}`).find(".caretIcon").remove();
                    }
                    let caretToAdd = textToHtml(table.collapsed ? arrowDownCaret : arrowUpCaret);
                    $(`#${table.id} > thead > tr > td`)[0].appendChild(caretToAdd);
                }
                if (table.collapsed) {
                    $(`#${table.id} > tbody`).hide();
                    if (document.querySelector(`#${table.id} > tfoot`) != null) {
                        $(`#${table.id} > tfoot`).hide();
                    }
                }
                $(`#${table.id} > thead > tr`).css("cursor", "pointer");
                $(`#${table.id}`).css("margin-bottom", "1rem");
                $(`#${table.id}`).removeClass("modal_table");
            }
        }
        function setupTowerDetailsTab() {
            document.querySelector("#tabs-2").appendChild(document.querySelector("#modal_tower_details_content"));
            $("#modal_tower_details_content").css("max-height", "unset");
        }
        function modifySidebarUx() {
            let ppSidebar = createSidebar();
            document.getElementById("map_canvas").appendChild(ppSidebar);
            $("#ppSidebar").css({
                position: "fixed",
                top: 0,
                width: "20%",
                "padding-top": "71px",
                "padding-bottom": "0.5rem",
                height: "100%",
                "overflow-y": "auto",
                "overflow-x": "hidden",
                "scrollbar-width": "none",
                "user-select": "text",
                "-webkit-user-select": "text",
                "max-width": "385px",
                "min-width": "385px"
            });
            pre_cleanupMenuRelics();
            setupTowerDetailsTab();
            setupSettingsTab(tablesToMove);
            let towerDetailsSyle = document.createElement("style");
            towerDetailsSyle.textContent = `\n    /* [PCI+] Set bottom margin for sidebar elements */\n    #modal_tower_details_content > table {\n      margin-bottom: 1rem !important;\n    }\n    `;
            document.head.appendChild(towerDetailsSyle);
            post_cleanupMenuRelics();
        }
        function showBandTilesAndTowers(inBand) {
            window.showBand = parseInt(inBand);
            const {MCC, MNC, netType, BandList, getTowersInView} = window;
            if (!window.pciPlus_useCustomTowerRendering) {
                for (let band in BandList) if (band != inBand && parseInt(inBand) != 0) {
                    window.BandList[band]["show"] = false;
                } else {
                    window.BandList[band]["show"] = true;
                }
            }
            if (window.tilesEnabled) {
                window.showTiles(window.MCC, window.MNC);
            }
            if (window.mapBounds) {
                getTowersInView(MCC, MNC, false, netType);
            }
        }
        function restoreDeletedTower(MCC, MNC, RAT, LAC, site) {
            try {
                const {bootbox, doOverride, API_URL, getBaseStation} = window;
                let toast = new PPToast("towerRevivalToast", 5e3);
                devLogger("Restoring tower", MCC, MNC, RAT, LAC, site);
                bootbox.confirm({
                    centerVertical: true,
                    closeButton: false,
                    buttons: {
                        confirm: {
                            className: "btn-danger",
                            label: "Revive"
                        },
                        cancel: {
                            label: "Cancel",
                            className: "btn-success"
                        }
                    },
                    callback: confirmed => {
                        if (!confirmed) {
                            devLogger("Revival cancelled");
                            return;
                        }
                        const requestSearchParams = {
                            MCC: String(MCC),
                            MNC: String(MNC),
                            Region: String(LAC),
                            RAT,
                            Site: String(site)
                        };
                        async function getSiteAlreadyExists() {
                            let res = await fetch(API_URL + "getTowerInformation?" + new URLSearchParams(requestSearchParams), {
                                credentials: "include"
                            });
                            let resJson = await res.json();
                            devLogger("res:", res, resJson);
                            if (resJson.responseData !== undefined) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        getSiteAlreadyExists().then((res => {
                            if (res === true) {
                                toast.setContents("That site already exists, no need to revive!");
                                toast.showToast();
                                selectProvider(MCC, MNC, RAT);
                                try {
                                    getBaseStation(MCC, MNC, LAC, site);
                                } catch (err) {
                                    devLogger("Error getting base station:", err);
                                }
                                if (window.MCC != MCC || window.MNC != MNC) {
                                    selectProvider(MCC, MNC);
                                }
                                centreMap(window.currentSite.latitude, window.currentSite.longitude, true, 17);
                                return;
                            } else {
                                doOverride(MCC, MNC, RAT, LAC, site, null, -1, -1);
                                toast.setContents("Attempting to revive! Please hold...");
                                toast.setupTimeout(7e3);
                                toast.showToast();
                                setTimeout((async () => {
                                    let currentCurrent = window.currentSite;
                                    selectProvider(MCC, MNC, RAT);
                                    try {
                                        getBaseStation(MCC, MNC, LAC, site);
                                    } catch (err) {
                                        devLogger("Failed to get tower after revive:", err);
                                    }
                                    if (currentCurrent === window.currentSite) {
                                        toast.setContents("Revival request submitted. It may take a few minutes to re-appear on the map.");
                                        toast.setupTimeout(5e3);
                                        toast.showToast();
                                        return;
                                    }
                                    moveToTower(MCC, MNC, RAT, window.currentSite.latitude, window.currentSite.longitude);
                                }), 5e3);
                            }
                        })).catch((err => {
                            devLogger("Failed to get/set deleted tower, more:", err);
                        }));
                    },
                    title: `<center>Revive Tower</center>`,
                    message: `Are you sure that you want to revive <b>${genNodeTitle(RAT)} ${site}</b>? \n      <br/><br/>\n      This process is not guaranteed, and may not work on on all towers. The best way to revive a tower is still to re-map it manually.`
                });
            } catch (err) {
                devLogger("Revival failed:", err);
            }
        }
        function addLteTacToNrTacTitle() {
            let qsElement = document.querySelector("#modal_tower_details_content > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)");
            if (window.netType !== "NR") {
                return;
            }
            devLogger("element changed:", qsElement);
            const tacString = qsElement.innerHTML.split(" / ");
            const nrTac = tacString[2];
            const lteTac = parseInt(nrTac) / 256;
            if (!Number.isSafeInteger(lteTac)) {
                return;
            }
            let newHtml = `${tacString[0]} / ${tacString[1]} / <span title="LTE TAC: ${lteTac}">${tacString[2]}</span>`;
            devLogger("new output:", newHtml);
            qsElement.innerHTML = newHtml;
        }
        function getNameOrId(siteID, towerAttributes, shouldShowMacroName) {
            const {showHex, pciPlus_hideMacroSiteLabel, capitalize} = window;
            let towerName;
            if (towerAttributes.TOWER_NAME == null) {
                towerName = siteID;
            } else {
                towerName = towerAttributes.TOWER_NAME;
            }
            if (shouldShowMacroName === undefined) {
                shouldShowMacroName = false;
            }
            if (towerAttributes.TOWER_TYPE != null && !showHex) {
                if (towerAttributes.TOWER_TYPE == "MACRO" && !shouldShowMacroName && pciPlus_hideMacroSiteLabel) {
                    return towerName;
                } else {
                    if (towerAttributes.TOWER_TYPE === "MACRO") {
                        return towerName + " (Macro)";
                    }
                    if (towerAttributes.TOWER_TYPE === "DECOMMISSIONED") {
                        return towerName + " (Decom)";
                    }
                    return towerName + ` (${towerAttributes.TOWER_TYPE})`;
                }
            } else {
                if (showHex) {
                    return parseInt(towerName, 10).toString(16).toUpperCase();
                } else {
                    return towerName;
                }
            }
        }
        const cmgmStatusVerified = cmgmEditUrl => src_elements.a("tr", null, src_elements.a("td", {
            id: "cmgmNameAndId"
        }, "CMGM"), src_elements.a("td", null, "✅", src_elements.a("a", {
            target: "_blank",
            href: cmgmEditUrl
        }, "Verified — Edit")));
        const cmgmStatusUnverified = cmgmEditUrl => src_elements.a("tr", null, src_elements.a("td", {
            id: "cmgmNameAndId"
        }, "CMGM"), src_elements.a("td", null, "🔶", src_elements.a("a", {
            target: "_blank",
            href: cmgmEditUrl
        }, "Unverified — Edit")));
        const cmgmStatusErrored = src_elements.a("tr", null, src_elements.a("td", {
            id: "cmgmNameAndId"
        }, "CMGM"), src_elements.a("td", null, "🛑", src_elements.a("span", null, "Error! Contact support@cmgm.us")));
        const cmgmStatusUnsupported = src_elements.a("tr", null, src_elements.a("td", {
            id: "cmgmNameAndId"
        }, "CMGM"), src_elements.a("td", null, "❌", src_elements.a("span", null, "Not Supported")));
        const cmgmStatusAbsent = cmgmCreateUrl => src_elements.a("tr", null, src_elements.a("td", {
            id: "cmgmNameAndId"
        }, "CMGM"), src_elements.a("td", null, "➕", src_elements.a("a", {
            target: "_blank",
            class: "cmgmCreateLink",
            href: cmgmCreateUrl
        }, "Not Found — Create")));
        const cmgmKnown = (cmgmConcealed, cmgmSiteType, cmgmEvLinks, cmgmPhotoLinks, cmgmSvLinks, cmgmTags) => src_elements.a("span", null, src_elements.a("tr", null, src_elements.a("td", null, "Build"), src_elements.a("td", null, cmgmConcealed, " ", cmgmSiteType)), src_elements.a("tr", null, src_elements.a("td", null, "Evidence"), src_elements.a("td", null, cmgmEvLinks)), src_elements.a("tr", null, src_elements.a("td", null, "Photos"), src_elements.a("td", null, cmgmPhotoLinks)), src_elements.a("tr", null, src_elements.a("td", null, "Street View"), src_elements.a("td", null, cmgmSvLinks)), src_elements.a("tr", null, src_elements.a("td", null, "Tags"), src_elements.a("td", null, cmgmTags)));
        const cmgmUnknown = (siteNotSupportedByCmgm, errorOccured) => src_elements.a("td", null, siteNotSupportedByCmgm || errorOccured ? "Unfortunately, CMGM doesn't support creating records like this yet :(" : "No CMGM records were found for this site.");
        const cmgmLoading = src_elements.a("td", null, "...");
        function buildCmgmComponents() {
            let cellDetailsTable = document.querySelector("#modal_tower_details_content > table:nth-child(1) > tbody");
            let lastRow = cellDetailsTable.childNodes[cellDetailsTable.childNodes.length - 1];
            let blankRow = textToHtml(src_elements.a("tr", {
                id: "cmgmStatus"
            }, src_elements.a("td", null, "CMGM"), src_elements.a("td", null, "...")));
            cellDetailsTable.insertBefore(blankRow, lastRow);
            let blankTableElement = textToHtml(src_elements.a("table", {
                class: "table table-striped table-sm"
            }, createHeaderForElement("CMGM", true, false, false, "cmgmTableHeader"), src_elements.a("tbody", {
                id: "cmgmTableBody",
                style: ""
            })));
            const towerDetailsContent = document.getElementById("modal_tower_details_content");
            towerDetailsContent.insertBefore(blankTableElement, towerDetailsContent.children[2]);
            $("#cmgmTableBody").html(cmgmLoading);
        }
        /**
 * @author RaccoonCast
 * @param cmgmResponse | Search response for particular site from CMGM
 */
        async function organizeCmgmData(cmgmResponse) {
            let cmgmSiteType = "Unknown";
            let cmgmConcealed = "Unknown";
            let cmgmEvLinks = [];
            let cmgmPhotoLinks = [];
            let cmgmSvLinks = [];
            let cmgmTags = [];
            if (cmgmResponse == null || cmgmResponse == undefined) {
                return {
                    ok: false
                };
            }
            for (let cmgm_field of Object.keys(cmgmResponse)) {
                if (cmgmResponse[cmgm_field] !== null && cmgmResponse[cmgm_field] != "") {
                    if (cmgm_field == "cellsite_type_normalized") {
                        cmgmSiteType = cmgmResponse[cmgm_field];
                    }
                    if (cmgm_field == "concealed") {
                        cmgmConcealed = cmgmResponse[cmgm_field];
                    }
                    if (cmgm_field.toLowerCase().match(/^evidence_[a-z]$/)) {
                        cmgmEvLinks.push(src_elements.a("a", {
                            target: "_blank",
                            href: cmgmResponse[cmgm_field]
                        }, cmgm_field));
                    }
                    if (cmgm_field.startsWith("photo_")) {
                        cmgmPhotoLinks.push(src_elements.a("a", {
                            target: "_blank",
                            href: cmgmResponse[cmgm_field]
                        }, cmgm_field));
                    }
                    if (cmgm_field.match(/^sv_[a-z]$/)) {
                        cmgmSvLinks.push(src_elements.a("a", {
                            target: "_blank",
                            href: cmgmResponse[cmgm_field],
                            title: `Date: ${cmgmResponse[cmgm_field + "_date"] || "Unknown"}`
                        }, cmgm_field));
                    }
                    if (cmgm_field.match("tags")) {
                        let cmgmTagsArr = cmgmResponse[cmgm_field].split(",");
                        const {latitude, longitude} = window.currentSite;
                        for (let tag of cmgmTagsArr) {
                            cmgmTags.push(src_elements.a("a", {
                                target: "_blank",
                                href: `https://cmgm.us/database/Map.php?latitude=${latitude}&longitude=${longitude}&zoom=15&tags=${tag}`
                            }, `#${tag}`));
                        }
                    }
                }
            }
            if (cmgmResponse.cellsite_type_normalized == undefined || cmgmResponse.cellsite_type_normalized == null) {
                cmgmSiteType = cmgmResponse.old_cellsite_type;
                switch (cmgmSiteType) {
                  case "utility_big":
                    {
                        cmgmSiteType = "Transmission Tower";
                        break;
                    }

                  case "misc-tree":
                    {
                        cmgmSiteType = "Tree (Misc)";
                        break;
                    }
                }
                cmgmSiteType = toTitleCase(cmgmSiteType.replace("Frp", "FRP").replaceAll("_", " "));
            }
            cmgmEvLinks = cmgmEvLinks.map(((item, index) => item.replace(/evidence_([a-z])/, ((_str, match1) => "EV_" + match1.toUpperCase())) + (index < cmgmEvLinks.length - 1 ? " | " : "")));
            cmgmPhotoLinks = cmgmPhotoLinks.map(((item, index) => item.replace(/photo_([a-z])/, ((_str, match1) => "PH_" + match1.toUpperCase())) + (index < cmgmPhotoLinks.length - 1 ? " | " : "")));
            cmgmSvLinks = cmgmSvLinks.map(((item, index) => item.replace(/sv_([a-z])/, ((_str, match1) => "SV_" + match1.toUpperCase())) + (index < cmgmSvLinks.length - 1 ? " | " : "")));
            cmgmTags = cmgmTags.map(((item, index) => item + (index < cmgmTags.length - 1 ? " | " : "")));
            devLogger("cmgmSiteType", cmgmSiteType);
            return {
                ok: true,
                cmgmId: parseInt(cmgmResponse.id),
                cmgmSiteType: cmgmSiteType ? cmgmSiteType : "Unknown",
                cmgmConcealed: cmgmConcealed === "true" ? "Concealed" : "Unconcealed",
                cmgmEvLinks: cmgmEvLinks.length > 0 ? cmgmEvLinks : "No Evidence",
                cmgmPhotoLinks: cmgmPhotoLinks.length > 0 ? cmgmPhotoLinks : "No Photos",
                cmgmSvLinks: cmgmSvLinks.length > 0 ? cmgmSvLinks : "No Street View",
                cmgmTags: cmgmTags.length > 0 ? cmgmTags : "No Tags"
            };
        }
        async function updateTac(RAT, region, cmgmId) {
            const {userID} = window;
            let userName;
            if (userID == null) {
                userName = "Anonymous";
            } else {
                userName = (await getUser(userID)).userName;
            }
            let regionName = (() => {
                if (RAT == "LTE") {
                    return "region_lte";
                } else if (RAT == "NR") {
                    return "region_nr";
                } else {
                    throw new Error("RAT Not Supported!");
                }
            })();
            const reqForm = new FormData;
            reqForm.set("userID", cmgm_user_id);
            reqForm.set("username", userName);
            reqForm.set(regionName, String(region));
            reqForm.set("id", String(cmgmId));
            const req = await fetch(cmgm_update_tac_url, {
                method: "POST",
                body: reqForm
            });
            const res = await req.json();
            if (res.hasOwnProperty("error") || !req.ok) {
                devLogger("Error occured updating TAC:", res.error);
                return;
            }
            return res.changed === "true";
        }
        async function updateTacDeny(cmgmId) {
            const reqForm = new FormData;
            reqForm.set("userID", cmgm_user_id);
            reqForm.set("id", String(cmgmId));
            const req = await fetch(cmgm_tac_update_denied_url, {
                method: "POST",
                body: reqForm
            });
            const res = await req.json();
            if (res.hasOwnProperty("error")) {
                throw new Error(res.error);
            }
            devLogger("Tac Deny Response:", res);
            return res;
        }
        function checkCmgmTac(cmgmResponse, currentSite) {
            try {
                const {netType} = window;
                const currentTac = currentSite.regionID;
                let cmgmTac = currentSite.RAT == "NR" ? cmgmResponse.region_nr : cmgmResponse.region_lte;
                if (cmgmTac == "") {
                    cmgmTac = "<i>None</i>";
                }
                if (currentTac != cmgmTac) {
                    devLogger("CMGM: TACs do not match!", cmgmTac, currentTac);
                    const lastCheckedDateString = cmgmResponse.tac_check_date;
                    if (lastCheckedDateString !== "" && lastCheckedDateString !== undefined && lastCheckedDateString !== null) {
                        let lastCheckedDate = new Date(lastCheckedDateString);
                        let currentDate = new Date;
                        const oneDay = 24 * 60 * 60 * 1e3;
                        function daysBetween(one, another) {
                            return Math.abs(+one - +another) / oneDay;
                        }
                        let diffDate = daysBetween(lastCheckedDate, currentDate);
                        if (!(diffDate > 3)) {
                            devLogger(`It's only been ${diffDate} days since this was last updated! Not prompting for TAC update`);
                            return;
                        }
                    } else {
                        devLogger("Never checked before");
                    }
                    if (currentSite.RAT == "NR" && parseInt(currentTac) % 256 != 0) {
                        devLogger(`Not a valid NR TAC (${currentTac}), returning.`);
                        return;
                    }
                    if (currentSite.towerAttributes.hasOwnProperty("TOWER_TYPE") && currentSite.towerAttributes.TOWER_TYPE == "DECOMMISSIONED") {
                        devLogger("Tower is decommissioned, not prompting TAC update");
                        return;
                    }
                    let toast = new PPToast("CMGMTacToast", 3e3, "CMGM");
                    toast.setContents(src_elements.a("span", null, "Would you like to update the CMGM TAC?", src_elements.a("br", null), src_elements.a("br", null), "CMGM TAC: ", cmgmTac, src_elements.a("br", null), "CM TAC: ", currentTac, src_elements.a("br", null), src_elements.a("br", null), src_elements.a("button", {
                        id: "cmgmTacYes",
                        class: "btn btn-danger"
                    }, "Yes"), " ", src_elements.a("button", {
                        id: "cmgmTacNo",
                        class: "btn btn-success"
                    }, "No")));
                    toast.setupTimeout(1e4);
                    toast.showToast();
                    $("#cmgmTacYes").on("click", (async () => {
                        let toast = new PPToast("CMGMTacToast");
                        let didUpdate = await updateTac(currentSite.RAT, parseInt(currentSite.regionID), parseInt(cmgmResponse.id));
                        toast.clearTimeout();
                        devLogger("did the toast update?", didUpdate);
                        if (didUpdate) {
                            toast.setContents(src_elements.a("span", null, "CMGM TAC changed from ", src_elements.a("b", null, cmgmTac), " to ", src_elements.a("b", null, currentTac)));
                        } else {
                            toast.setContents("TAC update failed — try again");
                        }
                        toast.setupTimeout(5e3);
                        toast.showToast();
                    }));
                    $("#cmgmTacNo").on("click", (() => {
                        updateTacDeny(parseInt(cmgmResponse.id));
                        let toast = new PPToast("CMGMTacToast");
                        toast.clearTimeout();
                        toast.hideToast();
                    }));
                } else {
                    devLogger("CMGM: TACs do match", cmgmTac, currentTac);
                }
            } catch (err) {
                devLogger("There was an error with CMGM:", err);
            }
        }
        function updateSidebarAddress(cmgmResponse) {
            try {
                const {address, city, state, zip} = cmgmResponse;
                const addressSlices = [ address, city, state, zip ];
                if (addressSlices.includes(" ") || addressSlices.includes(undefined) || addressSlices.includes(null) || addressSlices.includes("")) {
                    devLogger("CMGM Address not complete, exiting");
                    return;
                }
                let addressElement = document.querySelector("[id^='approxAddr']").parentElement.parentElement;
                if (addressElement == null) {
                    return false;
                }
                addressElement.children[0].innerText = "CMGM Address⁺";
                addressElement.children[0].title = "This address is sourced from CMGM, which is generally more accurate than Nominatim. It is generated by Google Maps and is usually reviewed manually.";
                const normalizedAddr = `${address}, ${city}, ${state} ${zip}`;
                addressElement.children[1].innerHTML = normalizedAddr;
            } catch (err) {}
        }
        function addCmgmId(id) {
            if (id == undefined) {
                return;
            }
            let cmgmHeader = document.querySelector("#cmgmNameAndId");
            if (cmgmHeader !== null) {
                cmgmHeader.innerHTML = cmgmHeader.innerHTML.replace("CMGM", `CMGM (#${id})`);
            }
        }
        function getEditUrl(cmgmId) {
            const cmgmEditUrl = `${cmgm_edit_url}?id=${cmgmId}`;
            return cmgmEditUrl;
        }
        async function updatePCIs(siteId, MCC, MNC, pciList) {
            const cmgmFormdata = new FormData;
            cmgmFormdata.append("id", String(siteId));
            cmgmFormdata.append("plmn", `${MCC}${MNC}`);
            cmgmFormdata.append("pci", pciList);
            const req = await fetch(cmgm_update_pcis_url, {
                method: "POST",
                body: cmgmFormdata
            });
            const pciResponse = await req.json();
            return pciResponse;
        }
        async function updateCmgmPcis() {
            const {currentSite} = window;
            if (!window.pciPlus_enableCmgmIntegration) {
                devLogger("CMGM is not enabled, not making request.");
                return;
            }
            let pciResponse = await updatePCIs(parseInt(currentSite.siteID), currentSite.Provider.countryID, currentSite.Provider.providerID, getCommaSeparatedPcis(currentSite.cells));
            const toast = new PPToast("cmgmPciToast");
            toast.setHeader("CMGM");
            if (pciResponse.changed === "true") {
                toast.setContents("PCIs updated!");
            } else if (pciResponse.hasOwnProperty("error")) {
                toast.setContents(`PCIs could not be updated! Error: \n<code>${pciResponse.error}</code>`);
            } else {
                return;
            }
            toast.setupTimeout(3e3);
            toast.showToast();
        }
        function showCmgmError(err) {
            const toast = new PPToast("CMGMError", 5e3);
            toast.setHeader("CMGM");
            toast.setContents(`CMGM experienced an error: <br/> <code>${err}</code>`);
            toast.showToast();
        }
        async function cmgmInit() {
            try {
                const {currentSite, pciPlus_enableCmgmIntegration} = window;
                const siteNotSupportedByCmgm = currentSite.RAT != "NR" && currentSite.RAT != "LTE" || currentSite.towerAttributes.TOWER_TYPE == "DAS";
                if (pciPlus_enableCmgmIntegration) {
                    buildCmgmComponents();
                    let cmgmTower;
                    let errorOccured = false;
                    let cmgmAbsent = false;
                    if (!siteNotSupportedByCmgm) {
                        try {
                            cmgmTower = await getTowers(currentSite.Provider.countryID, currentSite.Provider.providerID, parseInt(currentSite.siteID));
                        } catch (err) {
                            devLogger("CMGM Error occured:", err.message);
                            if (err.message == "No results found for anything in query.") {
                                devLogger("Site is not in CMGM.");
                                cmgmAbsent = true;
                            } else if (err.message == "This carrier is not supported by CMGM, only the major US networks are supported.") {
                                errorOccured = true;
                            } else {
                                errorOccured = true;
                                showCmgmError(err.message);
                            }
                        }
                    }
                    devLogger("CMGM RESPONSE:", cmgmTower);
                    if (cmgmTower == undefined && !(errorOccured || cmgmAbsent || siteNotSupportedByCmgm)) {
                        throw new Error(`Response was not readable!`);
                    }
                    let {ok, cmgmId, cmgmConcealed, cmgmSiteType, cmgmEvLinks, cmgmPhotoLinks, cmgmSvLinks, cmgmTags} = await organizeCmgmData(cmgmTower);
                    if (ok == false) {
                        const tableHeader = document.getElementById("cmgmTableHeader");
                        if (tableHeader) {
                            tableHeader.colSpan = 1;
                        }
                        $("#cmgmTableBody").html(cmgmUnknown(siteNotSupportedByCmgm, errorOccured));
                    } else {
                        $("#cmgmTableBody").html(cmgmKnown(cmgmConcealed, cmgmSiteType, cmgmEvLinks, cmgmPhotoLinks, cmgmSvLinks, cmgmTags));
                    }
                    const cmgmStatusEl = document.getElementById("cmgmStatus");
                    if (cmgmStatusEl !== null) {
                        if (siteNotSupportedByCmgm) {
                            cmgmStatusEl.outerHTML = cmgmStatusUnsupported;
                        } else if (errorOccured == true && cmgmAbsent == false) {
                            cmgmStatusEl.outerHTML = cmgmStatusErrored;
                        } else if (ok && cmgmTower.status == "verified") {
                            cmgmStatusEl.outerHTML = cmgmStatusVerified(getEditUrl(cmgmId));
                        } else if (ok && cmgmTower.status == "unverified") {
                            cmgmStatusEl.outerHTML = cmgmStatusUnverified(getEditUrl(cmgmId));
                        } else if (cmgmAbsent) {
                            cmgmStatusEl.outerHTML = cmgmStatusAbsent(getCreateUrl(window.currentSite));
                        }
                    }
                    if (ok && window.currentSite.siteID == currentSite.siteID && !siteNotSupportedByCmgm) {
                        addCmgmId(cmgmTower.id);
                        checkCmgmTac(cmgmTower, currentSite);
                        updateCmgmPcis();
                        updateSidebarAddress(cmgmTower);
                    } else {
                        if ((window.currentSite.towerMover == undefined || window.currentSite.towerMover < 1) && !siteNotSupportedByCmgm) {
                            addCmgmSplitAction(currentSite);
                        }
                    }
                }
            } catch (err) {
                devLogger(err);
                showCmgmError(err.message);
            }
        }
        function calculateSectorArea(cid) {
            const {pciPlus_distanceUnit, CoveragePolygonLayer} = window;
            if (CoveragePolygonLayer == undefined) {
                devLogger("CoveragePolygonLayer not found, returning");
                return "N/A";
            }
            let sectorPolygons = CoveragePolygonLayer.getSource().getFeatures();
            let marker;
            for (let i of Object.values(sectorPolygons)) {
                if (i["values_"].CID == cid) {
                    marker = i;
                }
            }
            if (marker == undefined || marker == null) {
                devLogger("Marker could not be found, returning. cid:", cid);
                return "N/A";
            }
            let area = marker.getGeometry().getArea();
            if (area === 0) {
                return "N/A";
            }
            let output = "";
            if (pciPlus_distanceUnit == "km") {
                if (area > 1e4) {
                    output = Math.round(area / 1e6 * 100) / 100 + " " + "km<sup>2</sup>";
                } else {
                    output = Math.round(area * 100) / 100 + " " + "m<su1p>2</sup>";
                }
            } else {
                if (area > 25900) {
                    output = (area / 259e4).toFixed(2) + " " + "mi<sup>2</sup>";
                } else {
                    output = (area * 10.764).toLocaleString(undefined, {
                        maximumFractionDigits: 0
                    }) + " sq ft";
                }
            }
            return output;
        }
        function addCellArea() {
            const {currentSite} = window;
            let notReadyCount = 0;
            (function checkifReady() {
                let timer = setTimeout((() => {
                    if (notReadyCount > 200) {
                        devLogger("Failed to parse distances");
                        return false;
                    } else if (parseInt(window.currentSite.siteID) == window.ppUpdatedCoveragePolygonLayer) {
                        devLogger("polygons ready, continuing");
                        clearInterval(timer);
                        executeAreaAdd();
                    } else {
                        devLogger("not ready yet, still", window.ppUpdatedCoveragePolygonLayer);
                        notReadyCount++;
                        checkifReady();
                    }
                }), 50);
            })();
            function executeAreaAdd() {
                for (let cell of Object.keys(currentSite.cells)) {
                    const table = document.querySelector(`#detailsTable${cell} > tbody`);
                    let directionCell = $(table).find("tr:contains(Direction)")[0];
                    if (directionCell === null) {
                        return;
                    }
                    let area = calculateSectorArea(cell);
                    let areaNode = textToHtml(src_elements.a("tr", {
                        class: "detailsTableSectorCoverageArea"
                    }, src_elements.a("td", {
                        title: "May not be representative of actual coverage."
                    }, "Coverage Area⁺"), src_elements.a("td", null, area)));
                    $(directionCell).before(areaNode);
                }
            }
        }
        async function getUsername(uid) {
            const {API_URL, handleResponse} = window;
            let user = await getUser(uid);
            let username = user.userName;
            return src_elements.a("a", {
                href: "#",
                onclick: `getUserHistory(${uid}, 0)`
            }, src_elements.a("span", {
                title: `Points: ${user.totalPoints} Cells: ${user.totalCells} Towers modified: ${user.totalLocatedTowers}`
            }, username, user.premium ? '<span title="Premium User" style="color: gold">&#x2605;</span>' : ""));
        }
        async function getTowerOverrideHistory(inMCC, inMNC, inRAT, inLAC, inSite, inOffset, showMetadata = false, isLegacy) {
            const {API_URL, handleResponse, UUID, getUserStats, capitalize, dateOptions} = window;
            const getTowerHistoryReqParams = {
                MCC: String(inMCC),
                MNC: String(inMNC),
                Region: String(inLAC),
                RAT: inRAT,
                Site: String(inSite),
                offset: String(inOffset),
                metadata: String(showMetadata)
            };
            const res = await fetch(API_URL + "getTowerOverrideHistory?" + new URLSearchParams(getTowerHistoryReqParams), {
                credentials: "include"
            });
            let towerHistoryData = handleResponse(await res.json());
            let finalTable;
            let tableCellsToAdd = [];
            let dialog;
            if (showMetadata) {
                for (const i of towerHistoryData) {
                    const dateAndTime = new Date(i.date + " UTC").toLocaleString();
                    const dateOnly = new Date(i.date + " UTC").toLocaleDateString(undefined, dateOptions);
                    const attributeTypeRaw = i.attribute;
                    const attributeType = (attributeTypeRaw => {
                        if (attributeTypeRaw == "TOWER_TYPE") {
                            return "Tower Type";
                        }
                    })(attributeTypeRaw);
                    let output = src_elements.a("tr", {
                        style: "text-align: center;"
                    }, src_elements.a("td", {
                        title: dateAndTime
                    }, dateOnly), " ", src_elements.a("td", null, attributeType), " ", src_elements.a("td", null, capitalize(i.value)), " ", src_elements.a("td", null, await getUsername(i.uid)), src_elements.a("td", null, String(i.cell_or_tower)));
                    tableCellsToAdd.push(output);
                }
                finalTable = src_elements.a("table", {
                    class: "table table-striped",
                    style: "table-layout: auto;"
                }, src_elements.a("thead", null, src_elements.a("tr", null, src_elements.a("th", null, "Date"), src_elements.a("th", null, "Attribute"), src_elements.a("th", null, "Value"), src_elements.a("th", null, "User"), src_elements.a("th", null, "Cell/Tower"))), src_elements.a("tbody", null, tableCellsToAdd));
            } else {
                for (const i of towerHistoryData) {
                    let dateAndTime = new Date(i.timestamp).toLocaleString();
                    let dateOnly = new Date(i.timestamp).toLocaleDateString(undefined, dateOptions);
                    let actionType;
                    if (i.latitude == -1) {
                        actionType = src_elements.a("b", null, "Restored Calculated Location", " ", src_elements.a("a", {
                            href: "#",
                            title: "View",
                            "data-toggle": "tooltip",
                            onclick: `\n                selectProvider(${i.mcc}, ${i.mnc}, '${i.rat}');\n                handleTowerSearch('${i.base}', true).then(res => {\n                  const { latitude, longitude } = res[0];\n                  centreMap(latitude, longitude);\n            })`
                        }, "*"));
                    } else if (i.latitude == 0) {
                        actionType = src_elements.a("b", null, "Deleted");
                    } else {
                        actionType = src_elements.a("a", {
                            href: generateCellMapperUrl({
                                MCC: i.mcc,
                                MNC: i.mnc,
                                type: i.rat,
                                latitude: i.latitude,
                                longitude: i.longitude,
                                zoom: 18
                            }),
                            onclick: `\n              if (isMobileDevice) { toggleMobile() };\n              moveToTower(${i.mcc}, ${i.mnc}, '${i.rat}', ${i.latitude}, ${i.longitude});\n              return false;`
                        }, `(${i.latitude.toFixed(3)}, ${i.longitude.toFixed(3)})`);
                    }
                    let output = src_elements.a("tr", {
                        style: "text-align: center;"
                    }, src_elements.a("td", {
                        title: dateAndTime
                    }, dateOnly), " ", src_elements.a("td", null, actionType), src_elements.a("td", null, await getUsername(i.uid)), src_elements.a("td", null, i.cell !== undefined ? i.cell : ""), src_elements.a("td", null, i.base !== undefined ? i.base : ""));
                    tableCellsToAdd.push(output);
                }
                finalTable = src_elements.a("table", {
                    class: "table table-striped",
                    style: "table-layout: auto;"
                }, src_elements.a("thead", null, src_elements.a("tr", null, src_elements.a("th", null, "Date"), src_elements.a("th", null, "Location"), src_elements.a("th", null, "User"), src_elements.a("th", null, "Cell"), src_elements.a("th", null, "Tower"))), src_elements.a("tbody", null, tableCellsToAdd));
            }
            let showLegacy = inMCC == 310 && inMNC == 260 && inRAT == "NR" && isLegacy == undefined;
            let legacyButton = {
                label: "Legacy",
                className: `btn btn-legacy btn-warning ${showLegacy ? "" : "d-none"}`,
                callback: () => {
                    getTowerOverrideHistory(inMCC, inMNC, inRAT, inLAC, parseInt(inSite) * 2, inOffset, showMetadata, true);
                }
            };
            if (tableCellsToAdd.length > 0) {
                dialog = bootbox.dialog({
                    message: finalTable,
                    size: "large",
                    closeButton: false,
                    buttons: {
                        Legacy: legacyButton,
                        Previous: {
                            label: "Previous",
                            className: "btn-info",
                            callback: function() {
                                getTowerOverrideHistory(inMCC, inMNC, inRAT, inLAC, inSite, inOffset - 20, showMetadata, isLegacy);
                            }
                        },
                        Next: {
                            label: "Next",
                            className: "btn-info",
                            callback: function() {
                                getTowerOverrideHistory(inMCC, inMNC, inRAT, inLAC, inSite, inOffset + 20, showMetadata, isLegacy);
                            }
                        },
                        Close: {
                            label: "Close",
                            className: "btn-info",
                            callback: function() {}
                        }
                    }
                });
            } else {
                dialog = bootbox.dialog({
                    message: "No history found.",
                    size: "small",
                    buttons: {
                        Legacy: legacyButton,
                        Close: {
                            label: "Close",
                            className: "btn-info",
                            callback: function() {}
                        }
                    }
                });
            }
            dialog.on("shown.bs.modal", (() => {
                dialog.attr("id", "towerHistoryModal");
            }));
        }
        function persistShowLowAccuracy(queryParams) {
            const {getParamOrCookie, updateLinkback} = window;
            const urlSearchParams = new URLSearchParams(queryParams || window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            let showOrphansParamVal = params.showOrphans || "null";
            let showLowAccuracyCookieVal = $.cookie("showOrphans") || "false";
            devLogger("orphans param, cookie: ", showOrphansParamVal, showLowAccuracyCookieVal);
            if (showOrphansParamVal == "null") {
                devLogger("using cookie");
                window.showOrphans = showLowAccuracyCookieVal === "true";
            } else {
                window.showOrphans = showOrphansParamVal === "true";
            }
            $("#doLowAccuracy").prop("checked", window.showOrphans);
            $.cookie("showLowAccuracy", showLowAccuracyCookieVal, {
                expires: 3600
            });
        }
        function setValueAndHandleTowerModifyType(value) {
            document.getElementById("towertype_input").value = value;
            window.handleTowerModifyType();
        }
        function patchModifyTowerPopup() {
            let possibleOptions = [ ...document.getElementById("towertype_input").options ];
            let tableCellsToAdd = [];
            let inc = 0;
            for (const i of possibleOptions) {
                if (inc % (window.isMobileDevice ? 2 : 4) == 0 && inc != 0) {
                    tableCellsToAdd.push("</tr><tr>");
                }
                let optionText = i.innerText;
                let optionValue = i.value;
                if (optionText === "Decomissioned") {
                    optionText = "Decom";
                }
                let tableCell = src_elements.a("td", {
                    style: "text-align: center; cursor: pointer; user-select: none;",
                    "data-dismiss": "modal",
                    title: optionValue,
                    onclick: `ppSetValueAndHandleTowerModifyType('${optionValue}')`,
                    class: "aProviderCell"
                }, src_elements.a("b", null, optionText));
                tableCellsToAdd.push(tableCell);
                inc++;
            }
            const typeTable = src_elements.a("span", null, src_elements.a("br", null), src_elements.a("table", {
                class: "table"
            }, src_elements.a("tbody", null, src_elements.a("tr", null, tableCellsToAdd))));
            $("#modifyTowerTypeForm").find(".modal-body").append(typeTable);
        }
        async function generateWikiPage(MCC, MNC, LAC, RAT, towerId) {
            devLogger("called to generate wiki page", MCC, MNC, LAC, RAT, towerId);
            let networks = [];
            networks.push(MNC);
            if (MCC === "302" && (MNC === "220" || MNC === "610" || MNC === "880")) {
                networks = [ 220, 610, 880 ];
            }
            for (let network of networks) {
                let pagesAdded = 0;
                let dasPagesAdded = 0;
                const das_parent_id = window.currentSite?.towerAttributes?.TOWER_PARENT;
                for (let wikiPage of [ await genWikiType(`${MCC}_${network}_${das_parent_id}`, true, undefined, das_parent_id), await genWikiType(`${MCC}_${network}_${LAC}_${towerId}`, false), await genWikiType(`${MCC}_${network}_${towerId}`, false) ]) {
                    if (wikiPage.isDas && window.currentSite?.towerAttributes?.TOWER_TYPE !== "DAS") {
                        devLogger("Skipping DAS wiki check, because the currentSite isn't DAS");
                        continue;
                    }
                    const title = wikiPage?.args?.title;
                    const res = wikiPage?.res;
                    const page = wikiPage?.pageText;
                    if (page.includes("currently no text") || wikiPageIsEmpty(page)) {
                        devLogger(`No text for ${title}, skipping`);
                        continue;
                    }
                    devLogger(`Found content on page ${title}`);
                    pagesAdded++;
                    if (wikiPage.isDas) {
                        dasPagesAdded++;
                    }
                    let pageContainer = textToHtml(src_elements.a("tr", null, src_elements.a("td", {
                        style: wikiPage.isDas ? "font-style: italic;" : ""
                    }, src_elements.a("b", null, pagesAdded > 1 ? wikiPage.prefix || title.replaceAll("_", " ") : wikiPage.prefix), page)));
                    const {currentSite: wCurrentSite} = window;
                    if (!(wCurrentSite.siteID == towerId || towerId == das_parent_id && wikiPage.isDas)) {
                        devLogger(`Detected site deviation; cancelling wiki render for ${title}`);
                        return;
                    }
                    $("#divcontentdata > tr").append(pageContainer);
                    if (!wikiPage.isDas) {
                        addViewEdit(title, res.url.replaceAll("render", "edit"));
                    }
                    resizeElements();
                }
                if (pagesAdded == 0 || dasPagesAdded == 1 && pagesAdded == 1) {
                    addAddData(`${MCC}_${network}_${towerId}`);
                }
                return pagesAdded > 0;
            }
        }
        async function genWikiType(title, isDasParent, prefix, dasParentId) {
            let params = {
                action: "render",
                title
            };
            if (isDasParent && !prefix) {
                prefix = `Legacy Page (${genNodeTitle(window.currentSite?.RAT)} ${dasParentId})`;
            }
            if (isDasParent && window.currentSite?.towerAttributes?.TOWER_TYPE !== "DAS") {
                return {
                    isDas: true
                };
            }
            let res = await fetch("https://docs.cellmapper.net/mw/index.php?" + new URLSearchParams(params));
            let resText = await res.text();
            return {
                args: params,
                res,
                pageText: resText,
                isDas: isDasParent,
                prefix: prefix || ""
            };
        }
        function addAddData(title) {
            $("#divcontentdata").append(src_elements.a("tr", null, src_elements.a("td", null, src_elements.a("div", {
                style: "text-align: left;"
            }, src_elements.a("a", {
                target: "_blank",
                href: `https://docs.cellmapper.net/mw/index.php?action=edit&title=${title}`
            }, src_elements.a("b", null, "Add Data"))))));
        }
        function addViewEdit(title, editUrl) {
            const wikiButtons = src_elements.a("span", {
                id: "viewEditButtons",
                style: "text-align: right;"
            }, src_elements.a("br", null), src_elements.a("div", null, src_elements.a("a", {
                target: "_blank",
                href: `https://docs.cellmapper.net/mw/${title}`
            }, src_elements.a("b", null, "View")), "    ", src_elements.a("a", {
                style: "margin-right: 0.5em;",
                target: "_blank",
                href: editUrl
            }, src_elements.a("b", null, "Edit"))));
            $("#divcontentdata").append(wikiButtons);
        }
        function resizeElements() {
            $("#divcontentdata img").each((function(i, item) {
                $(item).css("width", "100%");
                $(item).css("height", "auto");
            }));
            $("#divcontentdata table").each((function(i, item) {
                $(item).css("width", "100%");
            }));
        }
        function wikiPageIsEmpty(html) {
            const doc = (new DOMParser).parseFromString(html, "text/html");
            if (doc.getElementsByClassName("mw-parser-output")[0].children.length === 0) {
                return true;
            } else {
                return false;
            }
        }
        async function renderWikiPages(jNode, marker) {
            devLogger("Generating wiki page");
            const {currentSite} = window;
            const MCC = currentSite.Provider.countryID;
            const MNC = currentSite.Provider.providerID;
            $("#divcontentdata").append("<tr></tr>");
            await generateWikiPage(MCC, MNC, currentSite.regionID, currentSite.RAT, currentSite.siteID);
        }
        function toggleTrails() {
            const {MCC, MNC, clearLayer, updateLinkback, showTiles} = window;
            clearLayer("SignalTrails");
            window.tilesEnabled = !window.tilesEnabled;
            if (window.tilesEnabled) {
                showTiles(MCC, MNC);
            } else {
                toggleSetting("pciPlus_showLargeTiles", false);
            }
            updateLinkback();
            $.cookie("tilesEnabled", window.tilesEnabled, {
                expires: 3600
            });
            $("#doTrails").prop("checked", window.tilesEnabled);
        }
        function persistSignalTrails(queryParams) {
            const {getParamOrCookie, updateLinkback, clearLayer} = window;
            const urlSearchParams = new URLSearchParams(queryParams || window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            let tilesEnabledParam = params.tilesEnabled !== undefined ? params.tilesEnabled : "null";
            let tilesEnabledCookie = $.cookie("tilesEnabled") || "true";
            devLogger("tile param, cookie:", tilesEnabledParam, tilesEnabledCookie);
            if (tilesEnabledParam == "null") {
                devLogger("using tile cookie");
                window.tilesEnabled = tilesEnabledCookie === "true";
            } else {
                devLogger("using tile param");
                window.tilesEnabled = tilesEnabledParam === "true";
            }
            $("#doTrails").prop("checked", window.tilesEnabled);
            $.cookie("showLowAccuracy", tilesEnabledCookie, {
                expires: 3600
            });
            updateLinkback();
            if (window.tilesEnabled === false) {
                clearLayer("SignalTrails");
            }
        }
        function updateLineWithCheck(towerId) {
            const {updateLineToTower, CMApp} = window;
            if (!(CMApp.getLongitude() == 0 && CMApp.getLongitude() == 0)) {
                updateLineToTower(String(towerId));
            }
        }
        async function app_handle_cell(MCC, MNC, LAC, cellId, RAT) {
            const {API_URL, app_cell_cache, handleResponse, updateLineToTower, moveToCurrentLocation, mapMoved} = window;
            if (app_cell_cache[`${MCC}-${LAC}-${cellId}-${RAT}`] == null) {
                const requestParams = {
                    MCC,
                    MNC,
                    LAC,
                    Cell: cellId,
                    RAT
                };
                let res = await fetch(API_URL + "getTowerFromCellID?" + new URLSearchParams(requestParams), {
                    credentials: "include"
                });
                const towerId = handleResponse(await res.json());
                window.app_cell_cache[`${MCC}-${LAC}-${cellId}-${RAT}`] = towerId;
                updateLineWithCheck(String(towerId));
            } else {
                let cacheLoc = app_cell_cache[`${MCC}-${LAC}-${cellId}-${RAT}`];
                updateLineWithCheck(cacheLoc);
            }
        }
        function patchCmToastMessage() {
            let toastMessageButton = document.querySelector("#toastMessage > div.toast-header > button");
            if (toastMessageButton != null) {
                toastMessageButton.setAttribute("style", "color: #3c4242;");
            }
        }
        function fixOlControlStyles() {
            let newStyles = document.createElement("style");
            newStyles.textContent = `\n  \n  /* Move controls back */\n  .copy-linkback-control {\n    bottom: 70px !important;\n  }\n\n  .currentlocation-control {\n    bottom: 100px !important;\n  }\n\n  .currentprovider-control {\n    bottom: 130px !important;\n  }\n\n  /* Make controls larger */\n  .ol-control {\n    font-size: 1.25em !important;\n  }\n  \n  `;
            document.head.appendChild(newStyles);
        }
        function patchRemoveZoomInToast() {
            (function($) {
                var oldPluginFunction = $.fn.toast;
                $.fn.toast = function() {
                    const toastMessage = document.getElementById("toastMessageBody").innerText;
                    if (this[0].id == "toastMessage" && toastMessage === "Zoom in to display more towers") {
                        return;
                    }
                    return oldPluginFunction.apply(this, arguments);
                };
            })(jQuery);
        }
        function initPciPlusRendering() {
            $("#lacs").css("display", "none");
            $("#bands").css("display", "none");
            $("#frequencies").css("display", "none");
            $("#bandwidths").css("display", "none");
            $("#doCluster").prop("checked", false);
            window.toggleClustering();
            $("#doCluster").parent().parent().css("display", "none");
            window.BandSelectBox.on("blur", (() => {
                window.removeAllTowers();
            }));
            $('#filters > tbody > tr > td:contains("Decommissioned")')[0].innerText = "Show Low Accuracy Towers";
        }
        function toggleAccuracy() {
            var doLowAccuracy = $("#doLowAccuracy").prop("checked");
            if (doLowAccuracy) {
                window.showOrphans = true;
            } else {
                window.showOrphans = false;
            }
            window.refreshTowers();
            $.cookie("showOrphans", doLowAccuracy, {
                expires: 3600
            });
            window.updateLinkback();
        }
        async function towerSearch(towerId) {
            const getSiteParams = {
                MCC: String(window.currentSite.Provider.countryID),
                MNC: String(window.currentSite.Provider.providerID),
                Site: String(towerId),
                RAT: "LTE"
            };
            const towerSearchRes = await fetch(window.API_URL + "/getSite?" + new URLSearchParams(getSiteParams), {
                credentials: "include"
            });
            let responseData = window.handleResponse(await towerSearchRes.json());
            return responseData;
        }
        async function checkDasSafety() {
            let max_enb_id = 1048575;
            if (window.currentSite.RAT != "LTE") {
                return;
            }
            const toast = new PPToast("DASConflictToast", 1e4);
            for (let cell of Object.values(window.currentSite.cells)) {
                let sector = cell.Sector;
                let potentialNewSiteId = parseInt("" + window.currentSite.siteID + sector);
                if (potentialNewSiteId > max_enb_id) {
                    devLogger(`eNB ${potentialNewSiteId} would be over max, skip`);
                    continue;
                }
                let responseData = await towerSearch(potentialNewSiteId);
                if (responseData.length > 0 && !responseData.includes("Too many requests")) {
                    devLogger("WARNING: Conflict found!");
                    toast.setContents(src_elements.a("span", null, src_elements.a("b", null, "Conflict found!"), src_elements.a("br", null), "PCI+ prevented you from setting the type to DAS, because doing so would interfere with", " ", `eNB ${potentialNewSiteId}.`, src_elements.a("span", {
                        style: `display: ${window.currentSite?.towerAttributes?.TOWER_TYPE === "MICRO" ? "none" : "block"}`
                    }, src_elements.a("hr", {
                        style: "margin-top: 0.5rem; margin-bottom: 0.5rem;"
                    }), "Would you like to set the type to ", src_elements.a("b", null, "Micro"), " instead?", src_elements.a("br", null), src_elements.a("br", null), src_elements.a("button", {
                        class: "btn btn-danger",
                        id: "setToMicroInsteadButtonYes"
                    }, "Yes"), " ", src_elements.a("button", {
                        class: "btn  btn-success",
                        id: "setToMicroInsteadButtonNo"
                    }, "No"))));
                    $("#setToMicroInsteadButtonYes").on("click", (() => {
                        const {currentSite} = window;
                        doOverride(currentSite.Provider.countryID, currentSite.Provider.providerID, currentSite.RAT, parseInt(currentSite.regionID), parseInt(currentSite.siteID), null, null, null, "setAttribute", "TOWER_TYPE", "MICRO");
                        toast.hideToast();
                    }));
                    $("#setToMicroInsteadButtonNo").on("click", (() => {
                        toast.hideToast();
                    }));
                    toast.showToast();
                    return false;
                } else {
                    devLogger("No conflict found for", potentialNewSiteId);
                }
            }
            return true;
        }
        function HandleTowerSplit(MCC, MNC, RAT, LAC, base) {
            const msg = src_elements.a("p", null, "This will split the tower into individual cells. This is useful to indicate distributed antenna systems. The tower will be checked for potential conflicts before being split.");
            bootbox.confirm({
                message: msg,
                buttons: {
                    confirm: {
                        label: "Yes",
                        className: "btn-success"
                    },
                    cancel: {
                        label: "No",
                        className: "btn-danger pull-right"
                    }
                },
                callback: function(success) {
                    if (success) {
                        checkDasSafety().then((dasIsSafe => {
                            if (dasIsSafe) {
                                doOverride(MCC, MNC, RAT, LAC, base, null, null, null, "setAttribute", "TOWER_TYPE", "DAS");
                            } else {}
                        }));
                    }
                }
            });
        }
        function pp_refreshTowers() {
            const ogFilters = window.filterStatus ?? null;
            const {showBand, showOrphans, DateFilterType, startDate, endDate, showFrequencyOnly, showNoFrequencyOnly, showBandwidthOnly, showVerifiedOnly, showUnverifiedOnly, showLTECAOnly, showENDCOnly} = window;
            let filterStatus = {
                showBand: showBand != 0,
                showOrphans,
                dateFilter: DateFilterType,
                startDate,
                endDate,
                showFrequencyOnly,
                showNoFrequencyOnly,
                showBandwidthOnly,
                showVerifiedOnly,
                showUnverifiedOnly,
                showLTECAOnly,
                showENDCOnly
            };
            for (let i of filters) {
                filterStatus[i.key] = window[i.key];
            }
            window.filterStatus = filterStatus;
            if (JSON.stringify(filterStatus) !== JSON.stringify(ogFilters)) {
                devLogger("filters changed!", filterStatus);
                if (ogFilters !== null) {
                    refreshMap();
                }
            }
        }
        function patchGetUserStats() {
            let ogGetUserStats = window.getUserStats;
            window.getUserStats = (a, b) => {
                if (b == "towerLocators" || b == "towerContributors") {} else {
                    ogGetUserStats(a, b);
                }
            };
        }
        async function updateMNClist() {
            const {API_URL, handleResponse} = window;
            window.ppRendering_listOfTowers = [];
            let networksRes = await fetch(API_URL + "getAllNetworks", {
                credentials: "include"
            });
            const networks = handleResponse(await networksRes.json());
            window.MNCList = networks;
            for (let country of Object.keys(networks)) {
                window.MNCSelectBox.addOptionGroup(country, {
                    value: country,
                    label: country
                });
                for (let network of networks[country]) {
                    if (!network.visible) {
                        continue;
                    }
                    window.MNCSelectBox.addOption({
                        optgroup: country,
                        value: `${network.countryID}${network.providerID}`,
                        text: network.providerName + (window.pciPlus_hideCountryInSelect ? " - " : ` - ${country} - `) + network.countryID + network.providerID
                    });
                }
            }
            let {MCC, MNC} = window;
            devLogger("cookie check", $.cookie("selectedProvider"), MCC, MNC);
            if (MCC == null || Number.isNaN(MCC) || MNC == null || Number.isNaN(MNC)) {
                let selectedProviderCookie = $.cookie("selectedProvider");
                devLogger("check 1 passed, cookie:", selectedProviderCookie);
                if (typeof selectedProviderCookie !== "undefined") {
                    devLogger("activating cookied info");
                    window.MCC = parseInt($.cookie("selectedProvider").substring(0, 3));
                    window.MNC = parseInt($.cookie("selectedProvider").substring(3));
                }
            }
            devLogger("MCC/MNC going into set:", MCC, MNC);
            if (MCC != null && MNC != null && !Number.isNaN(MCC) && !Number.isNaN(MNC)) {
                window.MNCSelectBox.setValue(MCC + "" + MNC, true);
                window.getNetworkInfo(MCC, MNC);
            }
        }
        function patchHandleResponse() {
            const ogHandleResponse = window.handleResponse;
            window.handleResponse = response => {
                if (response.statusCode && response.statusCode == "NEED_RECAPTCHA") {
                    $("#dialog-requests-exceeded").modal("show");
                }
                if (response.responseData && response.responseData == "RECAPTCHA_OK") {
                    if (window.MCC == null || window.MNC == null || window.Towers.length == 0 || typeof window.MNCList == "string") {
                        updateMNClist();
                    }
                }
                return ogHandleResponse(response);
            };
        }
        async function getTilesAvailable(MCC, MNC, RAT) {
            const {API_URL, handleResponse} = window;
            const params = {
                MCC,
                MNC,
                RAT
            };
            const req = await fetch(API_URL + "getAllLayers?" + new URLSearchParams(params), {
                credentials: "include"
            });
            if (!req.ok) {
                return;
            }
            const bands = handleResponse(await req.json());
            window.BandSelectBox.clearOptions();
            window.BandSelectBox.clear();
            window.BandSelectBox.addOption({
                value: 0,
                text: `All Bands`
            });
            if (window.showBand == 0) {
                window.BandSelectBox.setValue(0);
            }
            function addBandOption(band) {
                window.BandSelectBox.addOption({
                    value: band,
                    text: `Band ${band}`
                });
            }
            for (const band of bands) {
                if (window.showBand == band) {
                    window.BandSelectBox.clear();
                    window.BandSelectBox.removeOption(band);
                    window.BandSelectBox.removeItem(band, true);
                    addBandOption(band);
                    window.BandSelectBox.setValue(band);
                } else {
                    addBandOption(band);
                }
                if (band) {
                    window.getBandName(RAT, band);
                }
            }
        }
        function addFilterCustomBand() {
            const spChildren = [ ...$("#select_provider_table > tbody > tr > td")[0].children ];
            const bandSelect = document.getElementById("BandSelect");
            let indexToPutItIn = spChildren.indexOf(bandSelect) - 1;
            spChildren[indexToPutItIn].outerHTML = src_elements.a("span", null, " ", src_elements.a("a", {
                id: "bandFilterCustomBand",
                href: "#"
            }, "(Custom)"), src_elements.a("br", null));
            $("#bandFilterCustomBand").on("click", (() => {
                const customBand = window.prompt("What band?");
                if (Number.isNaN(Number(customBand))) {
                    const toast = new PPToast("customBandFailedToast", 5e3);
                    toast.setContents(`<code>${customBand}</code> is not a valid band number!`);
                    toast.showToast();
                    return;
                }
                window.BandSelectBox.addOption({
                    value: customBand,
                    text: `Band ${customBand} (Custom)`
                });
                window.BandSelectBox.setValue(customBand);
            }));
        }
        function moveTower(inMCC, inMNC, inSystem, inLAC, inBase, inCell, inLat, inLng, setVerified, newTowerType) {
            const {ol} = window;
            function getMarker(regionId, towerId) {
                return window.vectorSourceTowers.getFeatureById(`${inMCC}-${inMNC}-${regionId}-${towerId}`);
            }
            let marker = getMarker(inLAC, inBase);
            if (!marker) {
                devLogger("Marker is not on map; cannot move");
                return;
            }
            if (inLat && inLng) {
                const newLocation = ol.proj.transform([ parseFloat(String(inLng)), parseFloat(String(inLat)) ], "EPSG:4326", "EPSG:3857");
                devLogger("found marker:", marker);
                marker.getGeometry().setCoordinates(newLocation);
            }
            const markerProperties = marker.getProperties();
            devLogger("got marker props:", markerProperties);
            const markerType = newTowerType ? newTowerType : markerProperties?.towerAttributes?.TOWER_TYPE ?? "MACRO";
            devLogger("marker type:", newTowerType, markerType);
            if (setVerified != undefined) {
                let towerLabel;
                if (window.showTowerLabels) {
                    towerLabel = generateTowerLabel(markerProperties.base, markerProperties.regionId, markerType, markerProperties.bands, markerProperties.estimatedBandData, markerProperties.towerAttributes);
                }
                devLogger("marker new label:", towerLabel);
                const newMarkerStyle = generateIconStyle(markerType, setVerified == true ? true : false, towerLabel);
                marker.setStyle(newMarkerStyle);
                if (newTowerType == "MICRO" && window.pciPlusFilter_hideMicro || newTowerType == "DAS" && window.pciPlusFilter_hideDas || newTowerType == "DECOMMISSIONED" && window.pciPlusFilter_hideDecom || newTowerType == "MACRO" && window.pciPlusFilter_hideMacro || newTowerType == "PICO" && window.pciPlusFilter_hidePico) {
                    devLogger(`newTowerType is ${newTowerType}, which is filtered; removing`);
                    window.removeTowerFromMap(markerProperties.MCC, markerProperties.MNC, markerProperties.system, markerProperties.regionId, markerProperties.base);
                }
            }
        }
        function patchStopJqueryWikiGet() {
            (function($) {
                var oldPluginFunction = $.get;
                $.get = function(url, data, callback, type) {
                    if (url.startsWith("https://docs.cellmapper.net")) {
                        devLogger("CM called for wiki page; redirecting");
                        $("#divcontentdata").append(src_elements.a("span", {
                            style: "display: none;"
                        }, "Edit"));
                        url = `https://docs.cellmapper.net/mw/index.php?action=render&title=404${window.MD5(String((new Date).getTime()))}`;
                    }
                    return oldPluginFunction.apply(this, [ url, data, callback, type ]);
                };
            })(jQuery);
        }
        function toggleTowerInfo(state) {
            const towerDetailsPanel = $("#modal_tower_details");
            if (!state) {
                state = !towerDetailsPanel.is(":visible");
            }
            if (state == true) {
                towerDetailsPanel.addClass("visible").animate({
                    left: "15px"
                }, 250);
            } else {
                towerDetailsPanel.removeClass("visible").animate({
                    left: "-500px"
                }, 250);
                if (window.isMobileDevice) {
                    devLogger("Skipping clear because this is a mobile device");
                } else if (window.pciPlus_allowSelectMultipleTowers) {
                    devLogger("Skipping clear because PCI+ Multi-Select is active");
                } else {
                    clearCoverage();
                }
            }
        }
        async function patchCellMapper(queryParams) {
            var {ol, isMobileDevice} = window;
            window.ppDeveloperMode = false;
            initDevUtils();
            handleUpdates();
            patchRemoveZoomInToast();
            patchStopJqueryWikiGet();
            window.generateTowerIcon = generateTowerFeature;
            let towersInMainCoverageLayer = [];
            let MainCoverageLayer = new ol.layer.Group({
                layers: []
            });
            window.map.addLayer(MainCoverageLayer);
            window.MainCoverageLayer = MainCoverageLayer;
            window.towersInMainCoverageLayer = towersInMainCoverageLayer;
            if (window.CMApp == undefined) {
                document.querySelector("#navbarResponsive > ul:nth-child(1) > li:nth-child(1) > a").innerHTML = ' <i class="nav-logos fas fa-map"></i> Map⁺ ';
            }
            addTacField();
            window.calculateDistance = calculateDistance;
            window.copyToClipboard = copyToClipboard;
            window.genNodeTitle = genNodeTitle;
            window.getLatLngCenter = getLatLngCenter;
            window.toggleSetting = toggleSetting;
            window.warnOrToggle = warnOrToggle;
            hookSettingsMenu();
            addPciPlusChangelog();
            window.centreMap = centreMap;
            window.clearCoverage = clearCoverage;
            window.getTowerCoverage = getTowerCoverage;
            window.handlePCIPSCSearch = handlePCIPSCSearch;
            waitForKeyElements("[id='divcontentdata']", (jNode => {
                changeWindowTitle();
                addJumpCoverage();
                initActionsTable();
                addLteTacToNrTacTitle();
                addCellArea();
                cmgmInit();
                renderWikiPages(jNode);
            }));
            if (isMobileDevice) {
                patchMobile();
            }
            modifyTowerPopup();
            window.handleTowerModifyLocation = handleTowerModify;
            window.handleTowerSearch = handleTowerSearch;
            document.getElementById("tower_search").placeholder = "ex. 12345, 00ABA, 0x1234";
            window.currentTranslateList = [];
            overrideSelectInteractionEventListener();
            window.showCountryClick = showCountryClick;
            overrideKeyboardShortcuts();
            addMeasureDistance();
            hookSidebarAccount();
            window.toggleSection = toggleSection;
            if (window.pciPlus_showSidebar && window.isMobileDevice == false) {
                modifySidebarUx();
            }
            waitForKeyElements("[id^='detailsTable']", (jNode => {
                linkPciInSidebar(jNode);
                addTimeToSidebar(jNode);
            }));
            patchCellmapperStylesheet();
            window.getNetworkTitle = getNetworkTitle;
            window.toggleTowers = toggleTowers;
            window.toggleTowerLabels = toggleTowerLabels;
            window.toggleHex = toggleHex;
            window.changeNetType = changeNetType;
            window._renderCalculateFrequency = _renderCalculateFrequency;
            window.selectProvider = selectProvider;
            window.handleTowerMove = handleTowerMove_handleTowerMove;
            window.showProvidersDialog = showProvidersDialog;
            window.popupChangelog = popupChangelog;
            window.closeMobileMenu = closeMobileMenu;
            patchGetBaseStation();
            patchDefaultSectorColours();
            window.getUserHistory = getUserHistory;
            addCustomBasemaps();
            window.changeMapType = changeMapType;
            if (window.mapType != "osm_street") {
                changeMapType(window.mapType);
            }
            addEventListeners();
            window.handleLocationSearch = handleLocationSearch;
            window.highlightByCid = highlightByCid;
            window.moveToTower = moveToTower;
            waitForKeyElements(`option[value="${window.MCC}${window.MNC}"]`, (() => {
                devLogger("MNC Selected");
                setupCarrierSwitchback();
                devLogger("Safe to hide country now!");
                hideCountryInSelect();
            }), true);
            window.globalThirdPartyLookupList = [];
            window.calcLoc = doCalculate;
            if (!window.isMobileDevice && !window.pciPlus_showSidebar) {
                window.toggleMenu();
            }
            window.showBandTilesAndTowers = showBandTilesAndTowers;
            window.restoreDeletedTower = restoreDeletedTower;
            window.getNameOrId = getNameOrId;
            window.getTowerOverrideHistory = getTowerOverrideHistory;
            persistShowLowAccuracy(queryParams);
            window.toggleAccuracy = toggleAccuracy;
            window.doOverride = doOverride;
            window.ppSetValueAndHandleTowerModifyType = setValueAndHandleTowerModifyType;
            patchModifyTowerPopup();
            window.showTiles = showTiles;
            window.toggleTrails = toggleTrails;
            persistSignalTrails(queryParams);
            window.app_handle_cell = app_handle_cell;
            patchCmToastMessage();
            if (!isMobileDevice && window.CMApp == undefined) {
                fixOlControlStyles();
            }
            if (window.pciPlus_useCustomTowerRendering) {
                initPciPlusRendering();
                window.ppRendering_listOfTowers = [];
                window.getTowersInView = pp_getTowersInView;
                window.refreshTowers = pp_refreshTowers;
                window.removeAllTowers = pp_removeAllTowers;
                refreshMap(true);
            }
            window.HandleTowerSplit = HandleTowerSplit;
            handleInitialDarkMode();
            window.enableDarkMode = enableDarkMode;
            window.disableDarkMode = disableDarkMode;
            window.theID = 0;
            window._paq.push = data => {
                devLogger("Telemetry upload blocked by PCI+: ", data);
            };
            patchGetUserStats();
            patchHandleResponse();
            window.getTilesAvailable = getTilesAvailable;
            addFilterCustomBand();
            window.moveTower = moveTower;
            window.savedFeatures = new Map;
            if (window.pciPlus_useStylingMethod == "layer") {
                window.towerLayer.setStyle(styleFeature);
            }
            window.toggleTowerInfo = toggleTowerInfo;
            parseCustomQueryParams(queryParams);
        }
        function addJumpButtons() {
            function scrollToTable(table) {
                let tablesObj = {
                    regTowers: 1,
                    nonRegTowers: 2,
                    multipleAntennas: 3,
                    singleAntennas: 4
                };
                let correctTable = `resultsTable${String(tablesObj[table])}`;
                $(`#${correctTable}`).prev().prev()[0].scrollIntoView({
                    behavior: "smooth"
                });
            }
            let buttonLocation = document.querySelector("#div2").parentNode;
            let jumpButtons = textToHtml(src_elements.a("div", {
                class: "float-left2 jumpButtons",
                style: "text-align: center;"
            }, src_elements.a("button", {
                class: "jumpButton",
                id: "regTowers"
            }, "Registered"), src_elements.a("button", {
                class: "jumpButton",
                id: "nonRegTowers"
            }, "Non-Registered"), src_elements.a("button", {
                class: "jumpButton",
                id: "multipleAntennas"
            }, "Multiple"), src_elements.a("button", {
                class: "jumpButton",
                id: "singleAntennas"
            }, "Single"), src_elements.a("hr", null)));
            buttonLocation.insertBefore(jumpButtons, document.querySelector("#div3"));
            $(".jumpButton").css({
                width: "fit-content",
                fontSize: "small",
                borderRadius: "8px"
            });
            $("#checkboxes > label").css({
                "margin-bottom": "0.1rem"
            });
            $(".jumpButton").on("click", (event => {
                let clickedButton = event.target;
                scrollToTable(clickedButton.id);
            }));
        }
        function addMapradLink() {
            const linkLocation = document.getElementById("checkboxes");
            const coordRegex = /^\s*[-+]?([1-8]?\d\.\d+?|90\.0+?)[,~\s]\s*([-+]?(?:180\.0+?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))\s*$/;
            const location = new URLSearchParams(window.location.search).get("address");
            let lat, lng;
            const coordMatch = location.match(coordRegex);
            if (coordMatch) {
                lat = coordMatch[1];
                lng = coordMatch[2];
            } else {
                console.log("Couldn't add maprad.io link, location must be in the form of coordinates");
                return;
            }
            $("#antennaCheck").parent().parent().parent().css("margin-bottom", "0");
            linkLocation.appendChild(textToHtml(src_elements.a("br", null)));
            const el = textToHtml(src_elements.a("a", {
                href: `https://maprad.io/us/search/coordinates/200/${lat},${lng}?source=US`,
                target: "_blank",
                style: "\n    margin-left: auto;\n    padding-left: 2.5rem;\n    padding-top: 0px;\n    margin-top: 0px;\n    font-weight: bold;\n    color: deeppink;\n"
            }, "(Maprad.io)"));
            linkLocation.appendChild(el);
        }
        function addFccCallsigns() {
            window.copyToClipboard = copyToClipboard;
            const resultsTables = [ {
                id: "resultsTable1",
                param: "registration_number",
                name: "ASR #",
                width: 10
            }, {
                id: "resultsTable2",
                param: "faa_study_number",
                name: "FAA #",
                width: 25
            }, {
                id: "resultsTable3",
                param: "call_sign",
                name: "Call Sign",
                width: 10
            }, {
                id: "resultsTable4",
                param: "call_sign",
                name: "Call Sign",
                width: 10
            } ];
            for (const tableObj of resultsTables) {
                const table = document.querySelector(`#${tableObj.id} > tbody`);
                const tableHeader = table.querySelector("tr.thead-dark");
                const tableOwnerNameCell = tableHeader.querySelector("th:nth-child(2)");
                let extraHeader = textToHtml(src_elements.a("th", {
                    style: `width: ${tableObj.width}%`
                }, tableObj.name));
                tableHeader.insertBefore(extraHeader, tableHeader.lastElementChild);
                if (tableOwnerNameCell !== null) {
                    tableOwnerNameCell.style.width = `${70 - tableObj.width}%`;
                }
                let singleAntennaRecords = [ ...table.children ];
                singleAntennaRecords.shift();
                for (let record of singleAntennaRecords) {
                    let potentialLink = record.querySelector("a");
                    if (potentialLink !== null) {
                        const urlParams = new URLSearchParams(new URL(decodeURIComponent(potentialLink.href)).search);
                        let potentialMatch = urlParams.get(tableObj.param);
                        if (potentialMatch !== null) {
                            let extraHeader = textToHtml(src_elements.a("td", null, src_elements.a("a", {
                                style: "color: black; cursor: pointer;",
                                href: "#",
                                onclick: `copyToClipboard('${potentialMatch}')`
                            }, potentialMatch)));
                            record.insertBefore(extraHeader, record.lastElementChild);
                        }
                    }
                }
            }
        }
        async function patchAntennaSearch() {
            const currentUrl = window.location.href;
            let searchPage = "";
            if (currentUrl.match(/search.php/)) {
                addJumpButtons();
                addMapradLink();
                console.log("added jump buttons");
                waitForKeyElementsNoJq("#resultsTable4 > tbody > tr.thead-dark > th:nth-child(3)", (() => {
                    addFccCallsigns();
                    console.log("added extra columns");
                }), true);
                return;
            } else if (currentUrl.match(/nonregTower/)) {
                searchPage = "functionNonregTower.php";
            } else if (currentUrl.match(/regTower/)) {
                searchPage = "functionRegTower.php";
            } else if (currentUrl.match(/antenna/)) {
                searchPage = "functionAntenna.php";
            }
            getCoordinatesWhenReady();
            function getCoordinatesWhenReady() {
                let coords;
                try {
                    coords = JSON.parse(JSON.stringify(mapkit.maps[0].overlays[0].coordinate));
                } catch (err) {
                    coords = undefined;
                }
                if (coords != undefined) {
                    doThisWithTheResult(coords);
                    return;
                } else {
                    setTimeout((() => {
                        getCoordinatesWhenReady();
                    }), 500);
                }
            }
            function doThisWithTheResult(coordinates) {
                const [lat, long] = [ coordinates.latitude, coordinates.longitude ];
                let buttonsElement = document.createElement("div");
                buttonsElement.innerHTML = `\n  <button style="margin-left: 15px;" onclick="window.open('https://www.cellmapper.net/map?MCC&MNC&type=LTE&latitude=${lat}&longitude=${long}&zoom=18&showTowers=true', '_blank')">Open in CellMapper</button>\n  <button onclick="window.open('https://www.google.com/maps?layer=c&cbll=${lat},${long}', '_blank')">Google Street View</button>\n  <button onclick="window.open('https://www.google.com/maps/@?api=1&map_action=map&center=${lat}%2C${long}&zoom=20&basemap=satellite', '_blank')">Google Satellite View</button>\n  <button onclick="window.open('https://bing.com/maps/default.aspx?cp=${lat}~${long}&style=b&lvl=22', '_blank')">Bird's Eye View</button>\n  <button onclick="window.open('https://maprad.io/us/search/coordinates/200/${lat},${long}?source=US', '_blank')">Maprad.io</button>\n  <button onclick="window.open('https://www.crowncastle.com/infrastructure-solutions/?level=16&center=${long},${lat}', '_blank')">Crown Castle</button>\n  <button onclick="copyToClipboard('${lat.toFixed(5)}, ${long.toFixed(5)}')">Copy Location</button>\n  `;
                for (let child of buttonsElement.children) {
                    child.style.marginTop = "5px";
                    child.style.marginRight = "5px";
                }
                const mapElement = document.getElementsByClassName("row")[1];
                mapElement.appendChild(buttonsElement);
            }
        }
        function parseMapsUrl() {
            const mapsUrlRegex = /https\:\/\/www.google.com\/maps\/(?:place\/.*\/)?@(?<lat>\-?\d+(?:\.\d+))\,(?<long>\-?\d+(?:\.\d+)?)\,(?:(?<defaultViewZoom>\d+(?:\.\d+)?)z)?(?:(?<flatSatelliteAltitude>\d+)\m)?\,?(?:(?<globeAltitude>\d{1,3})\a)?\,?(?:(?<streetViewZoom>\d{1,2}(?:\.\d+)?)\y)?\,?(?:(?<horizontalRotation>\d+(?:\.\d+)?)\h)?\,?(?:(?<verticalRotation>\d{1,2}\.\d{1,2})t)?/;
            const currentUrl = window.location.href;
            const matchResult = currentUrl.match(mapsUrlRegex);
            if (matchResult === null) {
                return false;
            }
            return matchResult.groups;
        }
        function addStreetViewButtons(jNode) {
            const newItem = document.createElement("div");
            newItem.innerHTML = `\n    <div class="goog-menuitem" role="menuitem" id=":pp" style="user-select: none;">\n      <div class="goog-menuitem-content" style="user-select: none;">\n        Open in CellMapper\n      </div>\n    </div>\n    `;
            newItem.onclick = () => {
                const mapCoords = parseMapsUrl();
                if (mapCoords) {
                    console.log("cm button clicked", mapCoords);
                    const {lat, long} = mapCoords;
                    window.open(`https://www.cellmapper.net/map?MCC&MNC&type=LTE&latitude=${lat}&longitude=${long}&zoom=18&showTowers=true`, "_blank");
                }
            };
            jNode.insertBefore(newItem, jNode.children[jNode.children.length]);
        }
        function getBingRotationValue() {
            const possibleBingRotations = [ 0, 90, 180, 270 ];
            let mapsUrlGroups = parseMapsUrl();
            if (mapsUrlGroups && mapsUrlGroups.horizontalRotation != undefined) {
                let rotation = mapsUrlGroups.horizontalRotation;
                function calcDifference(a, b) {
                    let d = Math.abs(a - b);
                    return d > 180 ? 360 - d : d;
                }
                function calcClosest(a, bs) {
                    let ds = bs.map((function(b) {
                        return calcDifference(a, b);
                    }));
                    return bs[ds.indexOf(Math.min.apply(null, ds))];
                }
                let closestCompatible = calcClosest(rotation, possibleBingRotations);
                console.log(`[PCI+] Closest Bing-readable direction to ${rotation}° is ${closestCompatible}°`);
                return closestCompatible;
            } else {
                console.log(`[PCI+] Unable to determine direction, defaulting to 0°`);
                return 0;
            }
        }
        function patchMenu() {
            const parseCoordsRegex = /(\-?\d+\.\d+)\,\s(\-?\d+\.\d+)/;
            let jNode = document.querySelector('[role="menu"]');
            const latLongText = document.querySelector('[role="menu"]').children[0].innerText;
            const regexMatchOutput = latLongText.match(parseCoordsRegex);
            const [lat, long] = [ regexMatchOutput[1], regexMatchOutput[2] ];
            document.querySelector('[role="menu"]').children[6].remove();
            document.querySelector('[role="menu"]').children[6].remove();
            document.querySelector('[role="menu"]').children[6].remove();
            document.querySelector('[role="menu"]').children[6].remove();
            const birdsEyeRotation = getBingRotationValue();
            let newNode = document.createElement("div");
            newNode.innerHTML += `<li aria-checked="false" data-index="11" role="menuitemradio" tabindex="01" jsaction="click: actionmenu.select; keydown: actionmenu.keydown;"\n    onclick="window.open('https://bing.com/maps/default.aspx?cp=${lat}~${long}&style=b&dir=${birdsEyeRotation}&lvl=22&pciPlusBirdsEye=true', '_blank')"\n    class="nbpPqf-menu-x3Eknd fxNQSd" jsan="0.aria-checked,7.nbpPqf-menu-x3Eknd,0.data-index,0.role,0.tabindex,0.ved,0.vet,0.jsaction">\n    <div jstcache="336" class="nbpPqf-menu-x3Eknd-text" jsan="7.nbpPqf-menu-x3Eknd-text">View Bird's Eye</div></div></li>`;
            newNode.innerHTML += `<li aria-checked="false" data-index="12" role="menuitemradio" tabindex="11" jsaction="click: actionmenu.select; keydown: actionmenu.keydown;"\n        onclick="window.open('https://www.cellmapper.net/map?MCC&MNC&type=LTE&latitude=${lat}&longitude=${long}&zoom=18&showTowers=true', '_blank')"\n        class="nbpPqf-menu-x3Eknd fxNQSd" jsan="0.aria-checked,7.nbpPqf-menu-x3Eknd,0.data-index,0.role,0.tabindex,0.ved,0.vet,0.jsaction">\n        <div jstcache="336" class="nbpPqf-menu-x3Eknd-text" jsan="7.nbpPqf-menu-x3Eknd-text">Open in CellMapper</div></div></li>`;
            newNode.innerHTML += `<li aria-checked="false" data-index="13" role="menuitemradio" tabindex="12" jsaction="click: actionmenu.select; keydown: actionmenu.keydown;"\n        onclick="window.open('https://www.antennasearch.com/HTML/search/search.php?address=${lat}%2C${long}', '_blank')"\n        class="nbpPqf-menu-x3Ekn fxNQSd" jsan="0.aria-checked,7.nbpPqf-menu-x3Eknd,0.data-index,0.role,0.tabindex,0.ved,0.vet,0.jsaction">\n        <div jstcache="336" class="nbpPqf-menu-x3Eknd-text" jsan="7.nbpPqf-menu-x3Eknd-text">Open in AntennaSearch</div></div></li>`;
            newNode.innerHTML += `<li aria-checked="false" data-index="9" role="menuitemradio" tabindex="0" jsaction="click: actionmenu.select; keydown: actionmenu.keydown;" jstcache="316" jsinstance="*9" class="nbpPqf-menu-x3Eknd fxNQSd" jsan="0.aria-checked,7.nbpPqf-menu-x3Eknd,0.data-index,0.role,0.tabindex,0.jsaction"><div jstcache="317" style="display:none"></div><div jstcache="318" style="display:none"></div><span jstcache="319" style="display:none"></span><div jstcache="320" class="nbpPqf-menu-x3Eknd-text-haAclf" jsan="7.nbpPqf-menu-x3Eknd-text-haAclf,t-nsjBiGFs4q0"><div jstcache="336" class="nbpPqf-menu-x3Eknd-text" jsan="7.nbpPqf-menu-x3Eknd-text">Measure distance</div><div jstcache="337" style="display:none"></div></div></li>`;
            jNode.append(newNode);
        }
        async function checkReady() {
            let menu = document.querySelector('[role="menu"]');
            if (menu === null) {
                return;
            } else if (menu.innerText.includes("CellMapper")) {
                return;
            } else if (document.querySelector('[role="menu"]').children[9] != undefined) {
                patchMenu();
            } else {
                setTimeout((() => {
                    console.log("checking again");
                    checkReady();
                }), 100);
            }
        }
        function patchGoogleMaps() {
            function contextMenuCallback(jNode) {
                checkReady();
                return true;
            }
            waitForKeyElementsNoJq("#action-menu", contextMenuCallback, false);
            waitForKeyElementsNoJq(".goog-menu.goog-menu-BvBYQ", (jNode => {
                if (jNode.children[0].innerText == "Print") {
                    addStreetViewButtons(jNode);
                }
            }), false);
        }
        function patchBingMaps() {
            function menuOpenedCallback() {
                if (!(document.querySelector("#transientLens > div.transientLensActions > ul").childNodes.length > 5)) {
                    console.log("[PCI+] Editing context menu whiel in Bird's Eye is not supported on this version of Bing Maps. Exit Bird's Eye View then try again.");
                    return false;
                } else {}
                let [lat, long] = document.querySelector("#transientLens > div.transientLensActions > ul > li:nth-child(10) > a > div.actionText").innerText.replace(" ", "").split(",");
                let googleStreetViewListItem = document.createElement("li");
                googleStreetViewListItem.innerHTML = `\n      <div class="transientLensSeparator""></div>\n\n      <a href="#" \n      onclick="window.open('https://www.cellmapper.net/map?MCC&MNC&type=LTE&latitude=${lat}&longitude=${long}&zoom=18&showTowers=true', '_blank'); document.getElementById('transientLens').style='visibility: hidden;'"\n      class="nearby" \n      data-tag="nearby">\n      <div class="icon"></div>\n      <div class="actionText">Open in CellMapper</div></a>\n\n      <a href="#" \n      onclick="window.open('https://www.google.com/maps?layer=c&cbll=${lat},${long}', '_blank'); document.getElementById('transientLens').style='visibility: hidden;'" \n      class="streetsideEnabled" \n      data-tag="streetsideEnabled">\n      <div class="icon"></div>\n      <div class="actionText">Google Street View</div></a>\n      `;
                document.querySelector("#transientLens > div.transientLensActions > ul").append(googleStreetViewListItem);
            }
            waitForKeyElementsNoJq('[id="transientLens"]', menuOpenedCallback);
            const qps = Object.fromEntries(new URLSearchParams(window.location.search).entries());
            function enableBirdsEye() {
                console.log("[PCI+] Enabling Birds Eye");
                const mapControl = ".azure-maps-control-container";
                waitForKeyElementsNoJq(mapControl, (() => {
                    const button = document.querySelector(mapControl).querySelector("[aria-label^='Bird']");
                    button.click();
                }), true);
                document.querySelector(".panelClose").click();
                if (docReadyEventListner) {
                    removeEventListener(docReadyEventListner);
                }
            }
            if (qps.style == "b" || qps.style == "g" || qps.pciPlusBirdsEye == "true") {
                let docReadyEventListner = document.addEventListener("readystatechange", (event => {
                    if (document.readyState == "complete") {
                        enableBirdsEye(docReadyEventListner);
                    }
                }));
            }
        }
        function solveCaptcha() {
            const captchaAnswers = {
                "type 12345": "12345",
                "type the answer 3+2-1": "4",
                "type def": "def",
                "type abc": "abc",
                "type hij": "hij",
                "type 54321": "54321",
                "type the number seven": "7"
            };
            const captchaAnswerField = document.querySelector('[name="wpCaptchaWord"]');
            waitForKeyElementsNoJq('[for="wpCaptchaWord"]', (() => {
                const jNode = document.querySelector('[for="wpCaptchaWord"]');
                const captcha = jNode.innerText;
                const captchaAnswer = captchaAnswers[captcha];
                console.log("Found Captcha:", captcha, "with answer", captchaAnswer);
                if (captchaAnswer == undefined) {
                    const captchaParentElement = captchaAnswerField.parentElement;
                    const warning = textToHtml(src_elements.a("b", null, " ", "PCI+ doesn't know about this captcha yet! Please send a screenshot of this page in", " ", src_elements.a("a", {
                        href: "https://discord.com/channels/980652545938702376/980652545938702379"
                    }, "#feedback"), "."));
                    captchaParentElement.appendChild(warning);
                } else {
                    captchaAnswerField.value = captchaAnswer;
                    document.getElementById("wpSave").click();
                }
            }));
        }
        function addRedirectLink() {
            const textAreaSelector = "[aria-label='Wikitext source editor']";
            const redirectMatch = /\#REDIRECT\s\[\[([A-z0-9\-\_\:]+)\]\]/;
            waitForKeyElementsNoJq(textAreaSelector, (() => {
                const content = document.querySelector(textAreaSelector).textContent;
                const match = content.match(redirectMatch);
                if (match) {
                    if (document.getElementById("mw-previewheader") !== null) {
                        return;
                    }
                    const title = match[1];
                    const gotoPrompt = src_elements.a("div", {
                        style: "font-size: larger; margin-left: -7px; padding-left: 47px; background: transparent url(/mw/resources/src/mediawiki.action/images/redirect-ltr.png?926f7) bottom left no-repeat; background-image: linear-gradient(transparent,transparent),url(/mw/resources/src/mediawiki.action/images/redirect-ltr.svg?c4628);"
                    }, " ", src_elements.a("a", {
                        href: `https://docs.cellmapper.net/mw/index.php?action=edit&title=${title}`
                    }, title.replaceAll("_", " ")));
                    let gotoPromptEl = document.createElement("span");
                    gotoPromptEl.className = "mw-content-ltr";
                    gotoPromptEl.innerHTML = gotoPrompt;
                    document.querySelector("#content").insertBefore(gotoPromptEl, document.querySelector("#bodyContent"));
                }
            }), true);
        }
        function patchWiki() {
            solveCaptcha();
            addRedirectLink();
        }
        const patchedSites = {
            antennaSearch: /antennasearch.com/,
            cellmapperWiki: /https\:\/\/docs\.cellmapper\.net/,
            cellmapper: /cellmapper\.net\/map/,
            googleMaps: /google.com\/maps/,
            bingMaps: /bing.com\/maps/
        };
        function init(queryParams) {
            if (window.pciPlusLoaded !== undefined) {
                console.log("[PCI+] PCI+ already loaded, skipping.");
                return;
            }
            window.pciPlusLoaded = true;
            const currentUrl = window.location.href;
            if (currentUrl.match(patchedSites.antennaSearch)) {
                patchAntennaSearch();
                window.copyToClipboard = copyToClipboard;
                console.log("[PCI+] Patched AntennaSearch");
            } else if (currentUrl.match(patchedSites.cellmapperWiki)) {
                patchWiki();
                console.log("[PCI+] Patched CellMapper Wiki");
            } else if (currentUrl.match(patchedSites.cellmapper)) {
                patchCellMapper(queryParams);
                console.log("[PCI+] Patched CellMapper");
            } else if (currentUrl.match(patchedSites.googleMaps)) {
                patchGoogleMaps();
                console.log("[PCI+] Patched Google Maps");
            } else if (currentUrl.match(patchedSites.bingMaps)) {
                patchBingMaps();
                console.log("[PCI+] Patched Bing Maps");
            } else {
                console.log("[PCI+] No code injected to", currentUrl);
            }
        }
        try {
            const currentScript = document.currentScript;
            if (currentScript.attributes.getNamedItem("id").textContent === "pciPlusExtensionScript") {
                window.ppBrowserExtension = true;
                console.log("[PCI+] is running as a browser extension.");
            } else {
                console.log("[PCI+] is running as a userscript.");
                window.ppBrowserExtension = false;
            }
        } catch (err) {
            console.log("[PCI+] is running as a userscript.");
            window.ppBrowserExtension = false;
        }
        const qp = window.location.search;
        if (window.location.href.match(patchedSites.bingMaps)) {
            init(qp);
        } else {
            window.addEventListener("load", (() => {
                init(qp);
            }));
        }
        if (window.CMApp !== undefined || window.injectPciPlus !== undefined) {
            console.log("Detected CM app, injecting PCI+ code.");
            init(qp);
            updateMNClist();
        }
    })();
})();