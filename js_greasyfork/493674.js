// ==UserScript==
// @name         Scratch Hammer
// @namespace    https://scratch.mit.edu/
// @version      20240602
// @description  Scratchのファイルサイズの5MB制限を突破する
// @author       Yukkku
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493674/Scratch%20Hammer.user.js
// @updateURL https://update.greasyfork.org/scripts/493674/Scratch%20Hammer.meta.js
// ==/UserScript==

// @ts-check

(() => {
    'use strict';

    /**
     * project.jsonの中身を削減する
     * @param {string} json
     * @returns string
     */
    const compress = (json) => {
        /**
         * uuidを`n`個生成する
         * @param {number} n
         * @returns {string[]}
         */
        const makeUids = n => {
            const soup = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            /** @type {(i: number) => string} */
            const id = i => i === 0 ? '' : id(Math.floor((i - 1) / soup.length)) + soup[(i - 1) % soup.length];
            /** @type {string[]} */
            let r = [];
            for (let i = 1; r.length < n; i++) {
                let f = id(i);
                // オブジェクトのプロパティの順序について, 非負整数だけ例外なのでそれを除外
                if (!/^(0|[1-9][0-9]*)$/.exec(f)) r.push(f);
            }
            return r;
        };
        /**
         * オブジェクトが空か判定する
         * @param {any} v
         * @returns {boolean}
         */
        const isEmpty = v => {
            for (const _ in v) return false;
            return true;
        };

        const knownExtentions = new Set(['motion', 'looks', 'sound', 'event', 'control', 'sensing', 'operator', 'data']);
        // 自動で型変換がされるので短くなるように数値に変えていい型
        const nocast = {
            looks_sayforsecs: ['MESSAGE'],
            looks_say: ['MESSAGE'],
            looks_thinkforsecs: ['MESSAGE'],
            looks_think: ['MESSAGE'],
            looks_switchcostumeto: ['COSTUME'],
            looks_switchbackdropto: ['BACKDROP'],
            looks_switchbackdroptoandwait: ['BACKDROP'],
            sound_play: ['SOUND_MENU'],
            sound_playuntildone: ['SOUND_MENU'],
            sensing_keypressed: ['KEY_OPTION'],
            data_setvariableto: ['VALUE'],
            data_addtolist: ['ITEM'],
            data_insertatlist: ['ITEM'],
            data_replaceitemoflist: ['ITEM'],
        };

        const val = JSON.parse(json);
        delete val.meta.vm;
        delete val.meta.agent;
        for (const target of val.targets) {
            // 不要な諸々を消す
            if (target.tempo === 60) delete target.tempo;
            if (target.volume === 100) delete target.volume;
            if (target.videoTransparency === 50) delete target.videoTransparency;
            if (target.videoState === 'on') delete target.videoState;
            if (target.textToSpeechLanguage === 'null') delete target.textToSpeechLanguage;
            if (isEmpty(target.lists)) delete target.lists;
            if (isEmpty(target.broadcasts)) delete target.broadcasts;
            if (isEmpty(target.comments)) delete target.comments;
            if (target.x === 0) delete target.x;
            if (target.y === 0) delete target.y;
            if (target.direction === 90) delete target.direction;
            if (target.size === 100) delete target.size;
            if (target.visible === true) delete target.visible;
            if (target.currentCostume === 0) delete target.currentCostume;
            if (target.rotationStyle === 'all around') delete target.rotationStyle;
            if (target.draggable === false) delete target.draggable;
            for (const costume of target.costumes)
                if (costume.md5ext === `${costume.assetId}.${costume.dataFormat}`) delete costume.md5ext;
            for (const blockId in target.blocks) {
                const block = target.blocks[blockId];
                if (Array.isArray(block)) continue;
                if (isEmpty(block.inputs)) delete block.inputs;
                if (isEmpty(block.fields)) delete block.fields;
                if (knownExtentions.has(block.opcode.split('_')[0]))
                    for (const inputName in block.inputs) {
                        if (nocast[block.opcode]?.has?.(inputName)) continue;
                        const input = block.inputs[inputName];
                        for (let i = 1; i < input.length; i++) {
                            if (typeof input[i] === 'string' || input[i] == null) continue;
                            if (![4, 5, 6, 7, 8, 10].includes(input[i][0])) continue;
                            const v = JSON.parse(JSON.stringify(Number(input[i][1])));
                            if (typeof v === 'number' && String(v) === input[i][1]) input[i][1] = v;
                        }
                    }
            }
            // BlockIdを短く貼りかえる
            /** @type {Map<string, string>} */
            const mp = new Map();
            {
                const ids = Object.keys(target.blocks);
                const uids = makeUids(Object.keys(target.blocks).length);
                for (let i = 0; i < ids.length; i++) mp.set(ids[i], uids[i]);
            }
            const nb = Object.create(null);
            for (const blockId in target.blocks) {
                const block = target.blocks[blockId];
                nb[mp.get(blockId) ?? blockId] = block;
                if (Array.isArray(block)) continue;
                if (isEmpty(block.inputs)) delete block.inputs;
                if (isEmpty(block.fields)) delete block.fields;
                if (typeof block.next === 'string') block.next = mp.get(block.next) ?? block.next;
                if (typeof block.parent === 'string') block.parent = mp.get(block.parent) ?? block.parent;
                for (const inputName in block.inputs) {
                    const input = block.inputs[inputName];
                    for (let i = 1; i < input.length; i++)
                        if (typeof input[i] === 'string') input[i] = mp.get(input[i]) ?? input[i];
                }
            }
            for (const commentId in target.comments) {
                const comment = target.comments[commentId];
                if (typeof comment.blockId === 'string') comment.blockId = mp.get(comment.blockId) ?? comment.blockId;
            }
            target.blocks = nb;
        }
        return JSON.stringify(val);
    };

    // sendメソッド自体を書き換えてやって, プロジェクトの情報を送ろうとしている時だけ処理を変える
    XMLHttpRequest.prototype._send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = async function (...data) {
        let zip;
        try {
            if (data.length === 1
                && this.method === 'put'
                && new URL(this.url).origin === 'https://projects.scratch.mit.edu'
            ) {
                zip = new JSZip();
                zip.file('project.json', compress(data[0]).replaceAll('\\b', '\\u\\b0008'));
                zip = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
            } else {
                throw 0;
            }
        } catch (_) {
            this._send(...data);
            return;
        }

        this.setRequestHeader('Content-Type', 'application/zip');
        this._send(zip);
    };
})();
