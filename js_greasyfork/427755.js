// ==UserScript==
// @name         PLONK - nielimitowana czarnolista dla serwisu Wykop
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This is PLONK!
// @author       xnoybis
// @match        https://*.wykop.pl/*
// @icon         https://www.google.com/s2/favicons?domain=wykop.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427755/PLONK%20-%20nielimitowana%20czarnolista%20dla%20serwisu%20Wykop.user.js
// @updateURL https://update.greasyfork.org/scripts/427755/PLONK%20-%20nielimitowana%20czarnolista%20dla%20serwisu%20Wykop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const plonk = {
        styles: `
            .plonk-toggle { display: block; position: fixed; z-index: 9999; bottom: 20px; right: 0px; transition: opacity .5s ease-in-out; opacity: .5; padding-left: 20px; cursor: pointer; }
            .plonk-toggle span { display: block; background-color: #fff; width: 32px; height: 32px; border-radius: 32px; margin-right: -16px; transition: all .5s ease-out; font-size: 16px; text-align: center; line-height: 24px; border: solid 3px #cc0000; }
            .plonk-toggle:hover { opacity: 1; }
            .plonk-toggle:hover span, .plonk-on .plonk-toggle span { margin-right: 20px; }
            .plonk-dialog { bottom: 0px; right: 200vw; position: fixed; width: 340px; max-width: 100%; background-color: #222; border-radius: 4px; z-index: 9998; box-shadow: 0 0 100px #000; border-left: solid 1px #111; border-top: solid 1px #111; opacity: 0; transition: opacity .3s ease-in-out; padding: 10px; padding-bottom: 72px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
            .plonk-on .plonk-dialog { display: block; opacity: 1; right: 0; }
            .plonk-icon { user-select: none; }
            .plonk-close { display: none; user-select: none; }
            .plonk-on .plonk-icon { display: none; }
            .plonk-on .plonk-close { display: block; margin-top: 2px; }
            .plonk-logo { position: absolute; height: 72px; bottom: 0; left: 0; padding: 20px; width: 100%; background-color: #111; line-height: 32px; font-size: 30px; color: #eee; font-weight: bold; text-transform: uppercase; }
            .plonk-logo span { font-size: 11px; color: #333; display: inline-block; margin-left: 10px; text-transform: none; }
            .plonk-dialog label { font-size: 11px; color: #777; text-transform: none; font-weight: normal; line-height: 11px; }
            .plonk-dialog textarea { resize: none; outline: none; border: solid 1px #777; margin-top: 10px; padding: 10px; height: 300px; word-wrap:break-word; }
            .plonk-dialog.saved textarea { border-color: #007700; }
            .plonk-status { font-size: 11px; color: #777; height: 15px; line-height: 15px; opacity: 0; transition: opacity .5s ease-in-out; margin-bottom: 10px; }
            .plonk-dialog.saved .plonk-status { color: #007700; opacity: 1; }
            .plonked { display: none; }
            .plonk-min .plonked { position: relative; height: 8px; }
            .plonk-min .plonked * { display: none; }
            .plonk-min .sub .plonked { display: block; margin: 10px 0; }
            .plonk-min .sub .plonked::before { margin-left: 76px; }
            .plonk-min .sub .plonked::before { width: calc(100% - 76px); }
            .plonk-min .plonked::before { display: block; width: 100%; border: solid 1px #111; cursor: pointer; opacity: .1; content: ''; height: 8px; position: absolute; top: 0; left: 0; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAkUlEQVRIibXUSQ4AIQhE0bLvf2d6ZaJRZCrY837YMASFEXv7a9UxRjbg05G8wK2nAhE9HgjqwUBcjwRSujuQ1X2Bgu4I1HQrUNafAYauB0i6EuDptwBVPwJsfQ806EugR5+BNh3A16rD9YsKOkSsQE2HcUFZfwYYuh4g6UqAp98CVP0IsPU90KAvgR59Btp0AD+CRUE9q4gHOQAAAABJRU5ErkJggg=='); }
        `,
        init: () => {
            // release the kraken
            plonk.prepare();
            plonk.filter();
        },
        filter: () => {
            // it's 21:37 - lock & load
            const commentStreams = document.querySelectorAll('.comments-stream');
            commentStreams.forEach(commentStream => {
                const entries = commentStream.querySelectorAll('.fix-tagline a em, .author.ellipsis a.showProfileSummary');

                entries.forEach(entry => {
                    let nick = '';
                    if (entry.tagName === 'EM') {
                        if (entry.innerText === '@') {
                            nick = entry.parentElement.innerText.replace('@', '');
                        }
                    } else {
                        nick = entry.innerText;
                    }

                    if (nick.length) {
                        if (plonk.data.list.toLowerCase().indexOf(nick.toLowerCase()) !== -1) {
                            // found a przegryw
                            const item = entry.closest('li');
                            if (item) {
                                item.classList.add('plonked');
                                item.setAttribute('title', nick);
                            }
                        }
                    }
                });
            });
        },
        timeout: null,
        clickedOutside: (target) => {
            const plonkElements = document.querySelectorAll('.plonk-dialog, .plonk-toggle');
            for (let e = 0; e < plonkElements.length; e++) {
                if (plonkElements[e].contains(target)) return false;
            }
            return true;
        },
        data: {
            options: {
                minimize: false
            },
            list: ''
        },
        prepare: () => {
            // adding DOM toys
            const listToggle = document.createElement('a');
            const toggleButton = document.createElement('span');
            const plonkIcon = document.createElement('i');
            plonkIcon.innerHTML = '&#x1F4A9;';
            plonkIcon.className = 'plonk-icon';

            const closeIcon = document.createElement('i');
            closeIcon.className = 'plonk-close';
            closeIcon.innerHTML = '&#x2716;&#xFE0F;';

            toggleButton.appendChild(plonkIcon);
            toggleButton.appendChild(closeIcon);

            listToggle.className = 'plonk-toggle';
            listToggle.appendChild(toggleButton);

            listToggle.addEventListener('click', (e) => {
                e.preventDefault();
                plonk.toggle();
            });

            const styleWrapper = document.createElement('style');
            styleWrapper.innerHTML = plonk.styles;

            const plonkDialog = document.createElement('div');
            plonkDialog.className = 'plonk-dialog';
            const plonkLogo = document.createElement('a');
            plonkLogo.className = 'plonk-logo';
            plonkLogo.setAttribute('href', 'https://en.wikipedia.org/wiki/Plonk_(Usenet)');
            plonkLogo.setAttribute('target', '_blank');
            plonkLogo.innerHTML = "Plonk";
            const plonkVersion = document.createElement('span');
            plonkVersion.innerHTML = 'v' + GM_info.script.version;
            plonkLogo.appendChild(plonkVersion);
            plonkDialog.appendChild(plonkLogo);

            const listLabel = document.createElement('label');
            listLabel.setAttribute('for', 'plonk-list');
            listLabel.innerHTML = 'Nicki oddzielone spacjami, lista zapisywana jest chwilę po wprowadzonych zmianach.';

            const plonkList = document.createElement('textarea');
            plonkList.className ='plonk-list';
            plonkList.setAttribute('id', 'plonk-list');
            plonkList.setAttribute('spellcheck', 'false');
            plonkList.addEventListener('input', plonk.sync);

            const plonkStatus = document.createElement('div');
            plonkStatus.className = 'plonk-status';

            plonkDialog.appendChild(listLabel);
            plonkDialog.appendChild(plonkList);
            plonkDialog.appendChild(plonkStatus);

            document.querySelector('head').appendChild(styleWrapper);
            document.querySelector('body').appendChild(listToggle);
            document.querySelector('body').appendChild(plonkDialog);

            document.addEventListener('click', (e) => {
                if (plonk.clickedOutside(e.target) && document.querySelector('body').classList.contains('plonk-on')) document.querySelector('body').classList.remove('plonk-on');
            });

            // loading storage
            const storage = localStorage.getItem('plonk');
            if (storage) {
                const storageData = JSON.parse(storage);
                plonk.data.list = plonk.clean(storageData.list || '');
                plonk.data.options = storageData.options || plonk.data.options;
                plonkList.value = plonk.data.list;

                if (plonk.data.options.minimize) {
                    document.querySelector('body').classList.add('plonk-min');
                } else {
                    document.querySelector('body').classList.remove('plonk-min');
                }
            }

            // start the purge and continue until morale improves
            plonk.filter();
            setInterval(plonk.filter, 1000);
        },
        sync: () => {
            const plonkDialog = document.querySelector('.plonk-dialog');
            if (plonkDialog) plonkDialog.classList.remove('saved');

            if (plonk.timeout) clearTimeout(plonk.timeout);
            plonk.timeout = setTimeout(() => {
                plonk.save();
            }, 3000);
        },
        clean: (list) => {
            // remove extra whitespace and duplicates
            const listArray = list.split(' ');
            const cleanList = [];
            listArray.forEach(nick => {
                nick = nick.trim();
                if (nick.length && !cleanList.includes(nick)) cleanList.push(nick);
            });
            return cleanList.join(' ');
        },
        save: () => {
            const plonkDialog = document.querySelector('.plonk-dialog');
            const plonkStatus = document.querySelector('.plonk-status');
            const plonkList = document.querySelector('.plonk-list');

            if (plonkDialog && plonkStatus) {
                plonk.data.list = plonk.clean(plonkList.value);
                const listArray = plonk.data.list.split(' ');

                // sort before saving
                listArray.sort((a, b) => {
                    if (a.toLowerCase() < b.toLowerCase()) { return -1; }
                    if (a.toLowerCase() > b.toLowerCase()) { return 1; }
                    return 0;
                });
                plonk.data.list = listArray.join(' ');
                plonkList.value = plonk.data.list;
                console.log(plonk.data);

                localStorage.setItem('plonk', JSON.stringify(plonk.data));

                plonkDialog.classList.add('saved');
                plonkStatus.innerHTML = 'Lista zapisana.';
                setTimeout(() => {
                    plonkDialog.classList.remove('saved');
                }, 5000);
                setTimeout(() => {
                    plonkStatus.innerHTML = '';
                }, 5500);
            }
        },
        toggle: () => {
            document.querySelector('body').classList.toggle('plonk-on');
        }
    }

    plonk.init();
})();