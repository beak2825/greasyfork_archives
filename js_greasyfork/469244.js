// ==UserScript==
// @name         星阵围棋快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  星阵围棋棋盘操作快捷键
// @author       司马咔咔
// @match        https://19x19.com/engine/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=19x19.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469244/%E6%98%9F%E9%98%B5%E5%9B%B4%E6%A3%8B%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/469244/%E6%98%9F%E9%98%B5%E5%9B%B4%E6%A3%8B%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keysMap = {
        index: 0,
        map: {},
        path: window.location.pathname.split('/', 3)[2],
        pageInfo: {
            'analyse': {
                keys: ['', 'NGYXHBJLZTSQDC', 'NPMDBWRAHFTCOS'],
                root: '.fun-body'
            },
            'sgf': {
                keys: ['', 'LZTSYGNCBFMX', 'AHFTIPNSCWMD'],
                root: '.engine-fun'
            },
        },
        moveKeys: ['0', 'ARROWUP', '', '', 'ARROWDOWN', '9'],
        get n() {
            return this.groups[1].length / 2
        },
        get groups(){
            return this.pageInfo[this.path].keys
        },
        get keysGroupList() {
            return [this.groups[this.index].substring(0, this.n), this.groups[this.index].substring(this.n)]
        },
        get keysList() {
            return this.groups[this.index]
        },
        get root() {
            return this.pageInfo[this.path].root
        },
        next: function() {
            if (this.index === this.groups.length - 1) {
                this.index = 0
            } else {
                this.index += 1
            }
        },
        tipSet: function(key, line, i){
            const end = this.index === 1 ? 999 : -1
            const span = document.querySelector(`${this.root}:${line}-child li:nth-child(${i+1}) button .fun-txt .txt`);
            span.innerText = span.innerText.slice(0, end) + key;
        },
        keySet: function() {
            this.keysGroupList.forEach((list, line_index)=>{
                let line = line_index ? 'last' : 'first';
                let key = '';
                for (let i=0; i < this.n; i++) {
                    if (this.index) {
                        key = list[i];
                        this.map[key] = `${this.root}:${line}-child li:nth-child(${i+1}) button`;
                    }
                    this.tipSet(key, line, i)
                }
            });
        }
    }

    document.addEventListener('keydown', (e)=>{
        const key = e.key.toUpperCase();
        console.log(e, key);
        if (e.key === '`') {
            keysMap.next();
            keysMap.keySet();
        } else if (keysMap.moveKeys.includes(key)) {
            document.querySelectorAll('.move-item')[keysMap.moveKeys.indexOf(key)].click();
        } else if (keysMap.keysList.includes(key)) {
            document.querySelector(keysMap.map[key]).click();
        }
    })
})();