// ==UserScript==
// @name         OwopTp
// @version      0.1.3
// @description  Press T to open the teleport window
// @author       SuperOP535
// @match        *.ourworldofpixels.com/*
// @namespace    https://greasyfork.org/users/200700
// @downloadURL https://update.greasyfork.org/scripts/371111/OwopTp.user.js
// @updateURL https://update.greasyfork.org/scripts/371111/OwopTp.meta.js
// ==/UserScript==

(() => {
    let storage;
    if (typeof localStorage === 'undefined') {
        const a = document.head.appendChild(document.createElement('iframe'));
        storage = a.contentWindow.localStorage;
    } else storage = localStorage;

    const min = -16777215, max = 16777215;

    function teleport(x, y) { OWOP.emit((1111111*6) + 28, +x, +y); }
    function getAllSavedLocations() { return JSON.parse(storage.getItem('owoptp_locations')) || {}; }

    function saveNewLocation(name, x, y) {
        var current = getAllSavedLocations();
        current[name] = [x, y];
        storage.setItem('owoptp_locations', JSON.stringify(current));
    }

    function getSavedLocation(name) { return getAllSavedLocations()[name]; }

    function deleteSavedLocation(name) {
        var current = getAllSavedLocations();
        delete current[name];
        storage.setItem('owoptp_locations', JSON.stringify(current));
    }

    function updateSavedLocationList(elm) {
        elm.innerHTML = '';
        Object.keys(getAllSavedLocations()).forEach(key => {
            const locations = getSavedLocation(key);
            elm.appendChild(OWOP.util.mkHTML('br'));
            elm.appendChild(OWOP.util.mkHTML('button', {
                onclick: () => {
                    teleport(locations[0], locations[1]);
                }, innerHTML: key
            }));
            elm.appendChild(OWOP.util.mkHTML('button', {
                onclick: () => {
                    deleteSavedLocation(key);
                    updateSavedLocationList(elm);
                }, innerHTML: 'X', style: 'float:right;'
            }));
            elm.appendChild(OWOP.util.mkHTML('button', {
                onclick: () => {
                    location.hash = '#loc:' + locations[0] + ':' + locations[1];
                }, innerHTML: '#', style: 'float:right;'
            }));
        });
    }

    function checkCoordLimit(elm) { if(elm.value > max) elm.value = max; else if(elm.value < min) elm.value = min; }

    function showTeleport() {
        OWOP.windowSys.addWindow(new OWOP.windowSys.class.window('Teleport', {
            closeable: true,
            centerOnce: true
        }, (wdow) => {
            wdow.addObj(document.createTextNode('X:\u00a0'));
            var x = OWOP.util.mkHTML('input', {
                type: 'number',
                min: -16777215, max: 16777215,
                value: OWOP.mouse.tileX,
                onkeyup: () => {
                    checkCoordLimit(x);
                }
            }); wdow.addObj(x);

            wdow.addObj(OWOP.util.mkHTML('br'));

            wdow.addObj(document.createTextNode('Y:\u00a0'));
            var y = OWOP.util.mkHTML('input', {
                type: 'number',
                min: -16777215, max: 16777215,
                value: OWOP.mouse.tileY,
                onkeyup: () => {
                    checkCoordLimit(y);
                }
            }); wdow.addObj(y);

            wdow.addObj(OWOP.util.mkHTML('br'));

            wdow.addObj(OWOP.util.mkHTML('button', {
                onclick: () => {
                    teleport(x.value, y.value);
                }, innerHTML: 'Teleport', style: 'width: 100%'
            }));

            wdow.addObj(OWOP.util.mkHTML('br'));
            const name = OWOP.util.mkHTML('input', {
                type: 'text',
                maxLength: 100
            }); wdow.addObj(name);
            wdow.addObj(OWOP.util.mkHTML('button', {
                onclick: () => {
                    saveNewLocation(name.value, x.value, y.value);
                    updateSavedLocationList(div);
                }, innerHTML: 'Add'
            }));

            var div = OWOP.util.mkHTML('div');
            updateSavedLocationList(div);
            wdow.addObj(div);
        }));
    }

    function checkForHashloc(e) {
        if(!location.hash) return;
        const parts = location.hash.split(':');
        const first = parts.shift().slice(1).toLowerCase();
        if(first == 'pos' || first == 'loc') {
            if(parts.length < 2) return alert('Invalid hashloc detected!');
            const x = +parts.shift(), y = +parts.shift();
            if(isNaN(x)) return alert('Invalid X position in hashloc');
            if(isNaN(y)) return alert('Invalid Y position in hashloc');
            setTimeout(teleport, typeof OWOP === 'undefined' ? 4321 : 0, x, y);
        }
    }

    if(typeof OWOP !== 'undefined') checkForHashloc();
    window.addEventListener('load', checkForHashloc);
    window.addEventListener('hashchange', checkForHashloc);
    window.addEventListener('keydown', e => e.key.toLowerCase() == 't' && document.activeElement.tagName.toLowerCase() != 'input' &&
                            document.activeElement.tagName.toLowerCase() != 'textarea' ? showTeleport() : null);
})();