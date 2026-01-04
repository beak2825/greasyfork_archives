// ==UserScript==
// @name         Io Record
// @namespace    http://tampermonkey.net/
// @version      0.0.10
// @author       Big watermelon
// @description  This script is in beta testing !! Record any io game (agma.io only for now)
// @match        *://agma.io/*
// @license      All Rights Reserved
// @icon         data:image/png;base64,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
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518087/Io%20Record.user.js
// @updateURL https://update.greasyfork.org/scripts/518087/Io%20Record.meta.js
// ==/UserScript==

/*

Copyright © 2024 Big watermelon. All Rights Reserved.
This work is proprietary and may not be copied, distributed, or modified without explicit permission.

*/

// FIXIT: on death doesnt show death screen cuz packet 12 is useless and sora is dumb
// FIXIT: make changelog fully text dependable otherwise people scared I'll hack them via XSS
// FIXIT: why shit drop works 1/4 times (on my OS)
// FIXIT: allow moving if spec mode while watching record
// TODO: next frame -> to keydown to allow fastforward
/* TODO: maybe some shits to show
            Interval: 29794 ms
            Packets:       965
            Bytes:      370 Ko

console.log(`Interval: ${Math.round(record[record.length - 1].timeStamp - record[0].timeStamp)}ms\nPackets: ${record.length\nBytes: ${Math.round(record.map(x=>x.data.byteLength).reduce((a, b)=>a+b)/1000)}Ko`);`

*/
// TODO: visual indicator when viewing record ?
/* TODO: optimize files deflate

pako.deflate(new Uint8Array(clip.map(({offset, data}) => new Uint8Array([
    ...new Uint8Array(new Uint32Array([offset]).buffer),
    ...new Uint8Array(data)
])).reduce((a, b) => [...a, ...b], [])))

*/
// TODO: make files into binaries
// FIXIT: depending server some clips may do shit ?
/* FIXIT: I know why cells disapear and it does weird shit
          some packets are missing like 10, 11, 12, 32
          so game doesnt really understand the state its in
*/
// FIXIT: change extension name and clip to binaries [Uint32 "offset", ... "packet"]
// TODO: allow multi file drop -> means add keybind for next/prev clip

(function() {
    'use strict';

    if (unsafeWindow.top !== unsafeWindow.self || document.querySelector('title')?.textContent?.includes('Just a moment'))
        return;

    const settings = Object.assign({
        saveRecordKey: 'o',
        pauseKey: ' ',
        nextFrameKey: 'ArrowRight',
        escapeViewKey: 'Escape',
        recordAnimations: false,
        recordLeaderboard: false,
        recordMovingBorders: true,
        recordFor: 10000,
        fetchChangeLog: true
    }, GM_getValue('settings', {}));

    const SCRIPT_VERSION = GM_info?.script?.version;
    let clientVersion = 'Unknown';

    function versionAlert(clipVersion, errorDetail) {
        swal({
            title: 'Io Record',
            text: `<span style="color:red;font-weight:bold;">An error occured while loading this clip.</span>
            <br>
            <span>Clip Version: ${clipVersion}</span>
            <br>
            <span>Io Record Version: ${SCRIPT_VERSION},${clientVersion}</span>
            <br>
            <span>If your the script isn't up to date you may not be able to view some clips.</span>
            <br>
            <span style="font-size:12pt;">${errorDetail}</span>`,
            html: true,
            type: 'error'
        });
    }
    function versionDiff(a, b) { // a < b
        a = a.split('.');
        b = b.split('.');
        while (a.length && b.length) {
            if (Number(a.shift()) < Number(b.shift()))
                return true;
        }
        return false;
    }
    function serializeArray(frames) {
        return SCRIPT_VERSION + ',' + clientVersion + '\n' + frames.map(frame => Math.round(frame.timeStamp - frames[0].timeStamp) + ': ' + btoa(String.fromCharCode(...new Uint8Array(frame.data)))).join('\n');
    }
    function deserializeString(frames) {
        const [framesep, offsetsep] = frames.includes('\n') ? ['\n', ': '] : ['|', ':'];
        frames = frames.split(framesep);
        const [s, c] = (frames[0].includes(offsetsep) ? '0.0.8,ag255' : frames.shift()).split(',');
        try {            
            return frames.map(frame => {
                const [offset, base64Data] = frame.split(offsetsep);
                const binaryString = atob(base64Data);
                const buffer = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++)
                    buffer[i] = binaryString.charCodeAt(i);
                return { id: buffer[0], offset: Number(offset), data: buffer.buffer };
            });
        } catch (error) {
            if (versionDiff(s, SCRIPT_VERSION) || c < clientVersion)
                versionAlert(s + ',' + c, error.name + ': ' + error.message);
            throw error;
        }
    }

    const MANDATORY_PACKETS = [10, 11, 12, 20, 32, 33, 48, 49, 50, 65, 66],
          CLEAR_ALL = { data: new Uint8Array([20]).buffer },
          FAKE_CELL_UPDATE = { data: new Uint8Array([10, 0, 0, 0, 0, 0, 0]).buffer };

    const record = [];
    let isPaused = true,
        viewedRecord = null,
        wsOnmessage,
        frameIndex = 0;

    unsafeWindow.addEventListener('keydown', event => viewedRecord && Object.values(settings).includes(event.key) && event.stopImmediatePropagation());
    unsafeWindow.addEventListener('keyup', event => {
        if ($('input, textarea').is(':focus')) return;
        if (viewedRecord) {
            if (event.key == settings.nextFrameKey) {
                if (frameIndex >= viewedRecord.length) return;
                isPaused = true;
                let current;
                do {
                    wsOnmessage(current = viewedRecord[frameIndex++]);
                } while (frameIndex <= viewedRecord.length && current.id != 10);
            } else if (event.key == settings.pauseKey) {
                if (isPaused) {
                    isPaused = false;
                    goto();
                } else {
                    isPaused = true;
                }
            } else if (event.key == settings.escapeViewKey) {
                frameIndex = 0;
                wsOnmessage(CLEAR_ALL);
                viewedRecord = null;
            }
        } else if (event.key == settings.saveRecordKey) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob([serializeArray(record)], { type: 'text/plain' }));
            const d = new Date();
            link.download = `agma-clip.bin`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            return;
        }
        event.stopImmediatePropagation();
        event.preventDefault();
    });

    function recordPacket(message) {
        const { timeStamp, data } = message;
        const id = new DataView(data).getUint8(0);
        if (
            id == 11 && data.byteLength == 3
            || id == 12 && data.byteLength == 5
        )
            return;
        if (viewedRecord) {
            if (id == 10) return isPaused && wsOnmessage(FAKE_CELL_UPDATE);
            else if (id == 11 || id == 12 || id == 17) return; // prevents spectator movement
        }
        wsOnmessage(message);
        while (timeStamp - record[0]?.timeStamp > settings.recordFor)
            record.shift();
        if (
            viewedRecord
            || !settings.recordAnimations && id == 33
            || !settings.recordLeaderboard && [48, 49, 50].includes(id)
            || !settings.recordMovingBorders && [65, 66].includes(id)
            || !MANDATORY_PACKETS.includes(id)
        )
            return;
        record.push({ timeStamp, data });
    }

    function goto() {
        if (!viewedRecord) return;
        if (!frameIndex)
            wsOnmessage(CLEAR_ALL);
        const current = viewedRecord[frameIndex++];
        MANDATORY_PACKETS.includes(current.id) && wsOnmessage(current);
        if (isPaused)
            return;
        if (viewedRecord[frameIndex])
            setTimeout(goto, viewedRecord[frameIndex].offset - current.offset);
        else setTimeout(() => {
            frameIndex = 0;
            wsOnmessage(CLEAR_ALL);
            isPaused = true;
        }, 10);
    }

    const originalDefineProperty = unsafeWindow.Object.defineProperty;
    unsafeWindow.Object.defineProperty = function(obj, prop, descriptor) {
        if (obj instanceof WebSocket && obj.url.includes('.agma.io')) {
            obj.addEventListener('message', recordPacket);
            originalDefineProperty(obj, 'onmessage', {
                set: function(onmessage) { wsOnmessage = onmessage; },
                get: function() { return wsOnmessage; }
            });
        }
        return originalDefineProperty(obj, prop, descriptor);
    }

    /* Temporarily disabled

    const originalSend = unsafeWindow.WebSocket.prototype.send;
    unsafeWindow.WebSocket.prototype.send = function() {
        // this just prevents mouse position
        if (!arguments[0]?.getUint8(0) && viewedRecord != null) return;
        return originalSend.apply(this, arguments);
    }

    */

    Object.defineProperties(HTMLBodyElement.prototype, { // risky but mandatory
        ondragstart: { get: () => null, set: () => null, configurable: true },
        ondrop: { get: () => null, set: () => null, configurable: true },
        ondragenter: { get: () => null, set: () => null, configurable: true },
        ondragover: { get: () => null, set: () => null, configurable: true }
    });

    let loaded = false;
    unsafeWindow.addEventListener('load', () => {
        if (loaded || typeof swal == 'undefined') return;
        loaded = true;
        for (const { src } of document.scripts) {
            if (clientVersion = src.match("ag[0-9]+")?.[0])
                break;
        }
        if (settings.fetchChangeLog) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://api.github.com/repos/Grosse-pasteque/io-record/contents/CHANGELOG', true);
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer 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');
                xhr.setRequestHeader('X-GitHub-Api-Version', '2022-11-28');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const changelog = atob(JSON.parse(xhr.responseText).content);
                            if (changelog[0] != GM_getValue('changelog', '0')) {
                                GM_setValue('changelog', changelog[0])
                                swal({ title: '', text: changelog.slice(1), html: true })
                            }
                        } else {
                            console.error('Error:', xhr.status, xhr.statusText);
                        }
                    }
                };
                xhr.send();
            } catch (e) {
                console.error("IO-Record, couldn't fetch CHANGELOG:", e);
            }
        }
        const canvas = document.getElementById('canvas');
        canvas.addEventListener("dragenter", event => {
            event.preventDefault();
            canvas.style.border = '5px solid green';
        });
        canvas.addEventListener("dragover", event => event.preventDefault());
        canvas.addEventListener("dragleave", event => {
            if (event.target != canvas) return;
            event.preventDefault();
            canvas.style.border = '';
        });
        canvas.addEventListener('drop', event => {
            canvas.style.border = '';
            const file = event.dataTransfer.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                frameIndex = 0;
                isPaused = false;
                viewedRecord = deserializeString(e.target.result);
                goto();
            };
            reader.readAsText(file);
            event.preventDefault();
        });
        const settingPageId = Math.random() * 10e17;

        const settingTab = document.createElement('button');
        settingTab.id = 'settingTab' + settingPageId;
        settingTab.className = 'setting-tablink';
        settingTab.onclick = openSettingPage.bind(null, settingPageId);
        settingTab.innerText = 'Io Record';

        const settingPage = document.createElement('div');
        settingPage.id = 'settingPage' + settingPageId;
        settingPage.className = 'setting-tabcontent';
        settingPage.innerHTML = `
            <div class="col-md-10 col-md-offset-1 stng" style="padding-left:20px;padding-right:10px;max-height:550px;overflow:hidden auto;margin:0;width:calc(100% - 5px);">
                <span class="hotkey-paragraph"> Keybinds</span>
                <div class="row stng-row">
                    Save Record
                    <div class="hotkey-input" data-name="saveRecordKey">${settings.saveRecordKey}</div>
                    <br>
                    Pause View
                    <div class="hotkey-input" data-name="pauseKey">${settings.pauseKey}</div>
                    <br>
                    Next Frame
                    <div class="hotkey-input" data-name="nextFrameKey">${settings.nextFrameKey}</div>
                    <br>
                    Escape Viewed Record
                    <div class="hotkey-input" data-name="escapeViewKey">${settings.escapeViewKey}</div>
                </div>
                <span class="hotkey-paragraph"> Record</span>
                <div class="row stng-row">
                    Animations
                    <input type="checkbox" data-name="recordAnimations" ${settings.recordAnimations ? "checked" : ''}>
                    <br>
                    Leaderboard
                    <input type="checkbox" data-name="recordLeaderboard" ${settings.recordLeaderboard ? "checked" : ''}>
                    <br>
                    Moving borders
                    <input type="checkbox" data-name="recordMovingBorders" ${settings.recordMovingBorders ? "checked" : ''}>
                </div>
                <span class="hotkey-paragraph"> Other</span>
                <div class="row stng-row">
                    Records Length (seconds)
                    <input type="number" min="0" class="hotkey-input" style="outline:none;border:none;" value="${~~(settings.recordFor / 1000)}">
                    <br>
                    Fetch Change Log
                    <input type="checkbox" data-name="fetchChangeLog" ${settings.fetchChangeLog ? "checked" : ''}>
                </div>
            </div>
        `;

        function onchange() {
            settings[this.dataset.name] = this.checked;
        }
        function onclick() {
            this.classList.add('selected');
            const handle = event => {
                if (event.type === 'keyup')
                    settings[this.dataset.name] = this.innerText = event.key;
                this.classList.remove('selected');
                unsafeWindow.removeEventListener('mousedown', handle);
                unsafeWindow.removeEventListener('keyup', handle);
                event.preventDefault();
                event.stopPropagation()
            };
            unsafeWindow.addEventListener('mousedown', handle);
            unsafeWindow.addEventListener('keyup', handle)
        }
        function oncontextmenu(event) {
            this.innerText = '';
            settings[this.dataset.name] = null;
            event.preventDefault()
        }
        settingPage.querySelectorAll('input[type=checkbox]').forEach(input => input.onchange = onchange.bind(input));
        settingPage.querySelector('input[type=number]').onchange = event => settings.recordFor = 1000 * event.target.value;
        settingPage.querySelectorAll('div.hotkey-input').forEach(hotkey => {
            hotkey.oncontextmenu = oncontextmenu.bind(hotkey);
            hotkey.onclick = onclick.bind(hotkey);
        });

        const style = document.createElement('style');
        style.innerHTML = `
            #settingPage${settingPageId} input {
                position: absolute;
                display: inline-block;
                right: 0;
            }
            #settingPage${settingPageId} .hotkey-input {
                max-width: 90px;
            }
            #settingPage${settingPageId} > div::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            #settingPage${settingPageId} > div::-webkit-scrollbar-track {
                background: #282934;
                border-radius: 10px;
            }
            #settingPage${settingPageId} > div::-webkit-scrollbar-thumb {
                background-color: #df8500;
                border-radius: 10px;
                border: 2px solid #282934;
            }
        `;

        const setting = document.getElementById('setting');
        setting.firstElementChild.appendChild(settingTab);
        setting.appendChild(settingPage);
        document.body.appendChild(style);
    });
    unsafeWindow.onbeforeunload = () => void GM_setValue('settings', settings);
    console.log(`🎥 Io Record - ${SCRIPT_VERSION} loaded!`);
})();