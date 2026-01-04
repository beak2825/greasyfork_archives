// ==UserScript==
// @name         Discord open servers
// @autor        Hader Araujo
// @namespace    http://tampermonkey.net/
// @description  code: Discord open servers
// @include      https://discord.com/channels/@me*
// @include      https://discord.com/invite/*
// @license      MIT
// @version      0.18
// @grant        GM_openInTab
// @grant        window.close
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/459867/Discord%20open%20servers.user.js
// @updateURL https://update.greasyfork.org/scripts/459867/Discord%20open%20servers.meta.js
// ==/UserScript==
 
 
(function () {
    'use strict';
 
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
 
    const oneSecond = 1000
 
    function executeWithSleepBegin(delay, func) {
 
        setTimeout(() => {
            func.call()
        }, delay);
 
    };
 
 
    if (window.location.href.includes('https://discord.com/invite/')) {
 
        executeWithSleepBegin(oneSecond * 7, () => {
 
            document.querySelector('section div button').click()
            
            executeWithSleepBegin(oneSecond * 10, () => {
                // window.close();
            })
        })
 
    }
 
    if (window.location.href.includes('https://discord.com/channels/@me')) {
 
        const params = window.location.search.replace('?p=', '').split('&callback=');
 
        const discordServerToOpen = params[0];
        const callback = params[1];
 
        console.log('discordServerToOpen: ' + discordServerToOpen);
        console.log('callback: ' + callback);
 
        if (!discordServerToOpen || !callback) {
            return;
        }
 
        const minServerToEnter = 3;
        const maxServerToEnter = 5;
 
        const minChannelToEnter = 1;
        const maxChannelToEnter = 4;
 
        const minTimeBetweenChannels = 2;
        const maxTimeBetweenChannels = 6;
 
        console.log("inicio");
        let toFinish = 0;
 
        const qtdServersToEnter = randomInt(minServerToEnter, maxServerToEnter);
        console.log('max i == ' + qtdServersToEnter);
        for (let i = 0; i < qtdServersToEnter; i++) {
 
            const randomTimeBetweenServer = (maxChannelToEnter * maxTimeBetweenChannels * i) + 10;
            console.log("randomTimeBetweenServer: " + i + "  :" + randomTimeBetweenServer);
            toFinish = randomTimeBetweenServer;
            executeWithSleepBegin(oneSecond * randomTimeBetweenServer, () => {
                let allServers = document.querySelectorAll('div[aria-label="Servers"] > div');
                let serverQtd = allServers.length;
                let randomServer = allServers[randomInt(0, serverQtd)]
 
                console.log("server " + (new Date()).toISOString());
 
                randomServer.querySelector('div foreignObject > div').click()

                executeWithSleepBegin(oneSecond * 1, () => {
                    if (document.querySelector('div[id="app-mount"] > div:nth-child(4) > div  > div:nth-child(3) > div:nth-child(2) > div > div > form > div:nth-child(2) > button')) {
                        document.querySelector('div[id="app-mount"] > div:nth-child(4) > div  > div:nth-child(3) > div:nth-child(2) > div > div > form > div:nth-child(2) > button').click()
                    }
                });
 
                const qtdChannelToEnter = randomInt(minChannelToEnter, maxChannelToEnter);
                console.log('max j == ' + qtdChannelToEnter);
                for (let j = 0; j < qtdChannelToEnter; j++) {
 
                    const randomTimeBetweenChannels = randomInt(minTimeBetweenChannels, maxTimeBetweenChannels) * (j + 1);
                    console.log("randomTimeBetweenChannels: " + j + "  :" + randomTimeBetweenChannels);
                    executeWithSleepBegin(oneSecond * randomTimeBetweenChannels, () => {
                        channels();
                    })
 
                }
            })
        }
 
        toFinish += 3;
 
        console.log("toFinish " + toFinish);
        executeWithSleepBegin(oneSecond * toFinish, () => {
 
            var url = randomInt(0, 1)? 'https://discord.com/invite/': 'https://discord.gg/';
            url += discordServerToOpen;
 
            console.log('URL to open: ' + url);
 
            GM_openInTab (url, { active: true, insert: true });
 
            executeWithSleepBegin(oneSecond * 2, () => {
                console.log('callback: ' + callback);
                if (callback != '-'){
                    window.open(callback, "_self")
                }
            })
 
        });
 
        function channels() {
            let allChannels = document.querySelectorAll('ul[aria-label="Channels"] li');
            let channelQtd = allChannels.length;
            let randomChannel = allChannels[randomInt(0, channelQtd)]
 
            console.log("chanelQtd " + (new Date()).toISOString());
 
            randomChannel.querySelector('a').click()
 
            executeWithSleepBegin(oneSecond * 1, () => {
                if (document.querySelector('div form > div > button')) {
                    document.querySelector('div form > div > button').click()
                }
            });

            executeWithSleepBegin(oneSecond * 1, () => {
                if (document.querySelector('button[aria-label="Disconnect"]')) {
                    document.querySelector('button[aria-label="Disconnect"]').click()
                }
            });

            executeWithSleepBegin(oneSecond * 1, () => {
                if (document.querySelector('div[id="app-mount"] > div:nth-child(4) > div  > div:nth-child(3) > div:nth-child(2) > div > div > form > div:nth-child(2) > button')) {
                    document.querySelector('div[id="app-mount"] > div:nth-child(4) > div  > div:nth-child(3) > div:nth-child(2) > div > div > form > div:nth-child(2) > button').click()
                }
            });
        }
    }
 
})();