// ==UserScript==
// @name         ASF Free Packages Command Generator
// @namespace    https://greasyfork.org/users/101223
// @version      0.8.4
// @description  Generate ASF commands and client commands from steamdb.info
// @author       Splash
// @match        https://steamdb.info/freepackages/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @connect      store.steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/395325/ASF%20Free%20Packages%20Command%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/395325/ASF%20Free%20Packages%20Command%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let packages,
    steamDB;
    const packagesDescriptor = {
        configurable: true,
        set: function (value) {
            packages ??= value;
        },
        get: function (key, value) {
            return packages;
        }
    };
    Object.defineProperty(unsafeWindow, 'SteamDB', {
        set: function (value) {
            steamDB = value;
            Object.defineProperty(steamDB, 'FreePackageData', packagesDescriptor);
        },
        get: function (key, value) {
            return steamDB;
        }
    });
    Object.defineProperty(unsafeWindow, 'g_FreePackageData', packagesDescriptor);
    unsafeWindow.addEventListener('load', function () {
        if (packages)
            reload();
    });
    function reload() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://store.steampowered.com/dynamicstore/userdata/?_=${new Date().getTime()}`,
            onload: function (response) {
                const data = JSON.parse(response.response),
                asfCommandPrefix = '!addlicense ',
                clientCommandPrefix = 'app_license_request ';
                let idsLimit = 50,
                subs = [],
                subsNoDemos = [],
                apps = [],
                appsNoDemos = [],
                tmpEl,
                asfCommandAll = '',
                asfCommandNoDemos = '',
                clientCommandAll = '',
                clientCommandNoDemos = '';
                idsLimit = idsLimit <= 0 ? Infinity : idsLimit;
                for (let i = 0; i < packages.length; i++) {
                    const [subid, appids, parents, name, demo] = packages[i];
                    let isValid = !data.rgOwnedPackages.includes(subid);
                    if (isValid) {
                        for (const parent of parents) {
                            if (!data.rgOwnedApps.includes(parent)) {
                                isValid = !1;
                                break;
                            }
                        }
                    }
                    if (isValid) {
                        let n = 0;
                        for (const appid of appids) {
                            if (data.rgOwnedApps.includes(appid))
                                n++;
                        }
                        if (n === appids.length) {
                            isValid = !1;
                        }
                    }
                    if (!isValid)
                        continue;
                    if (subs.length < idsLimit) {
                        subs[subs.length] = +subid;
                    }
                    if (apps.length < idsLimit) {
                        for (const appid of appids) {
                            if (!(data.rgOwnedApps.includes(appid) || apps.includes(appid))) {
                                apps[apps.length] = +appid;
                                if (apps.length >= idsLimit)
                                    break;
                            }
                        }
                    }
                    if (!demo) {
                        if (subsNoDemos.length < idsLimit) {
                            subsNoDemos[subsNoDemos.length] = +subid;
                        }
                        if (appsNoDemos.length < idsLimit) {
                            for (const appid of appids) {
                                if (!(data.rgOwnedApps.includes(appid) || appsNoDemos.includes(appid))) {
                                    appsNoDemos[appsNoDemos.length] = +appid;
                                    if (appsNoDemos.length >= idsLimit)
                                        break;
                                }
                            }
                        }
                    }
                    if (subs.length >= idsLimit && apps.length >= idsLimit && subsNoDemos.length >= idsLimit && appsNoDemos.length >= idsLimit)
                        break;
                }
                for (let i = 0; i < apps.length; i += 30) {
                    console.log(asfCommandPrefix + apps.slice(i, i + 30).map(item => 'a/' + item).join(','));
                }

                asfCommandAll = asfCommandPrefix + subs.join(',');
                asfCommandNoDemos = asfCommandPrefix + subsNoDemos.join(',');
                clientCommandAll = clientCommandPrefix + apps.join(' ');
                clientCommandNoDemos = clientCommandPrefix + appsNoDemos.join(' ');
                tmpEl = document.createElement('div');
                tmpEl.innerHTML = `<div>${data.rgOwnedPackages.length == 0 ? "<span style=\"user-select: none;\" title=\"Owned packages list is empty!\">❓</span>" : ""}<a href="javascript:;" title="Total: ${subs.length} sub${subs.length > 1 ? 's' : ''}\nCommand: \n${asfCommandAll}">Click here to copy ASF command! (${subs.length} sub${subs.length > 1 ? 's' : ''})✔️</a>&nbsp;&nbsp;<a href="javascript:;" title="Total (Exclude Demos): ${subsNoDemos.length} sub${subsNoDemos.length > 1 ? 's' : ''}\nCommand: \n${asfCommandNoDemos}">Exclude Demos (${subsNoDemos.length} sub${subsNoDemos.length > 1 ? 's' : ''})❎</a>&nbsp;&nbsp;<a href="javascript:;">Reload Userdata🔄</a></div><div>${data.rgOwnedPackages.length == 0 ? "<span style=\"user-select: none;\" title=\"Owned packages list is empty!\">❓</span>" : ""}<a href="javascript:;" title="Total: ${apps.length} app${apps.length > 1 ? 's' : ''}\nCommand: \n${clientCommandAll}">Click here to copy client command! (${apps.length} app${apps.length > 1 ? 's' : ''})✔️</a>&nbsp;&nbsp;<a href="javascript:;" title="Total (Exclude Demos): ${appsNoDemos.length} app${appsNoDemos.length > 1 ? 's' : ''}\nCommand: \n${clientCommandNoDemos}">Exclude Demos (${appsNoDemos.length} app${appsNoDemos.length > 1 ? 's' : ''})❎</a><a href="steam://nav/console" style="margin-left:5px;">Open Steam Console🎮</a></div><textarea style="top:-999px;left:-999px;width:0px;height:0px;position:absolute"></textarea></div>`;
                let gd_txta = tmpEl.querySelector('textarea'),
                gd_copy = (gd_str) => {
                    gd_txta.value = gd_str;
                    gd_txta.select();
                    document.execCommand('copy');
                };
                tmpEl.childNodes[0].querySelectorAll('a')[0].addEventListener('click', () => {
                    gd_copy(asfCommandAll);
                });
                tmpEl.childNodes[0].querySelectorAll('a')[1].addEventListener('click', () => {
                    gd_copy(asfCommandNoDemos);
                });
                tmpEl.childNodes[0].querySelectorAll('a')[2].addEventListener('click', () => {
                    tmpEl.remove();
                    reload();
                });
                tmpEl.childNodes[1].querySelectorAll('a')[0].addEventListener('click', () => {
                    gd_copy(clientCommandAll);
                });
                tmpEl.childNodes[1].querySelectorAll('a')[1].addEventListener('click', () => {
                    gd_copy(clientCommandNoDemos);
                });
                document.querySelector('div.container div.panel').after(tmpEl);
            }
        });
    }
})();
