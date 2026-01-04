// ==UserScript==
// @name         Ultra+ Timer
// @description  made with much love
// @version      0.0.5
// @author       Cazka#1820
// @match        *://florr.io/*
// @license      MIT
// @namespace    https://greasyfork.org/users/541070
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/460462/Ultra%2B%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/460462/Ultra%2B%20Timer.meta.js
// ==/UserScript==

const bosses = [
    {
        name: 'Beetle',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Bubble',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Cactus',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Centipede',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Cockroach',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Crab',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Fly',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Hornet',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Jellyfish',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Leech',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Moth',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Queen Ant',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Queen Fire Ant',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Rock',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Sandstorm',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Shell',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
    {
        name: 'Spider',
        set spawnedAt(v) {
            GM_setValue(this.name, v);
        },
        get spawnedAt() {
            return GM_getValue(this.name, null);
        },
    },
];

const menu = document.body.appendChild(document.createElement('div'));
menu.style.padding = '15px';
menu.style.background = '#ffffff3f';
menu.style['border-radius'] = '10px';
menu.style.display = GM_getValue('menuDisplay', 'block');
menu.style.position = 'absolute';
menu.style['pointer-events'] = 'none';
menu.style.bottom = '5px';
menu.style.right = '5px';

const table = menu.appendChild(document.createElement('table'));
table.style['font-family'] = 'Ubuntu';
table.style['border-collapse'] = 'collapse';
table.style.width = `100%`;

updateTable();
setInterval(updateTable, 5000);

// Tampermonkey menu
GM_registerMenuCommand('Toggle Menu', (event) => {
    const newValue = GM_getValue('menuDisplay', 'block') == 'block' ? 'none' : 'block';
    GM_setValue('menuDisplay', newValue);
    menu.style.display = newValue;
});

// functions
function updateTable() {
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    bosses.sort((a, b) => {
        if (a.spawnedAt == null && b.spawnedAt == null) {
            return a.name.localeCompare(b.name);
        }

        return (a.spawnedAt ?? Infinity) - (b.spawnedAt ?? Infinity);
    });
    bosses.forEach((x) => {
        const minutes = Math.floor((Date.now() - x.spawnedAt) / 1000 / 60);
        if (minutes > 240) {
            x.spawnedAt = null;
        }
    });
    bosses.forEach((x, i) => {
        const tr = table.insertRow();

        // Mob
        const td1 = tr.insertCell();
        if (i !== 0) {
            td1.style['padding-top'] = '5px';
        }
        if (i !== bosses.length - 1) {
            td1.style['padding-bottom'] = '5px';
        }
        td1.style['padding-right'] = '20px';

        td1.appendChild(document.createTextNode(x.name));

        // minutes ago
        const td2 = tr.insertCell();
        if (i !== 0) {
            td2.style['padding-top'] = '5px';
        }
        if (i !== bosses.length - 1) {
            td2.style['padding-bottom'] = '5px';
        }
        td2.style['pointer-events'] = 'auto';
        td2.style.cursor = 'pointer';

        td2.appendChild(document.createTextNode(toTimeSpanString(x.spawnedAt)));

        td2.onclick = (e) => {
            if (e.shiftKey) {
                const input = window.prompt(`Manually set the timer of ${x.name}`);
                if (isNaN(input)) {
                    return;
                }

                x.spawnedAt = Date.now() - input * 60 * 1000;

                updateTable();
                return;
            }
            if (!window.confirm(`Do you really want to reset the timer of ${x.name}?`)) {
                return;
            }
            x.spawnedAt = Date.now();
            updateTable();
        };
        td2.addEventListener('contextmenu', (e) => e.preventDefault());
    });
}
function toTimeSpanString(timestamp) {
    if (timestamp == null) {
        return 'N/A';
    }

    const minutes = Math.floor((Date.now() - timestamp) / 1000 / 60);

    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
}
