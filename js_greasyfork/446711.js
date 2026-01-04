// ==UserScript==
// @name         音量增强器
// @name:en_US   Volume Booster
// @name:zh-CN   音量增强器
// @namespace    System233
// @version      0.3
// @description  增强页面音视频音量
// @description:zh-CN  增强页面音视频音量
// @description:en_US  Increase page audio and video volume
// @author       System233
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/446711/%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/446711/%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

// Copyright (c) 2022 System233
// 
// This software is released under the GPL-3.0 License.
// https://opensource.org/licenses/GPL-3.0



(function () {
    'use strict';

    const setup = () => {
        // 热键配置：当前为CTRL+Shift
        const hotKeys = {
            Control: true,
            Shift: true,
            Alt: false,
        };
        /** @type {HTMLElement} */
        let currentNode = null;
        /** @type {(node:HTMLElement)=>void} */
        const setupNode = node => {
            if(!node){
                return;
            }
            if ('volumeBoost' in node) {
                return;
            }
            const audioCtx = new AudioContext();
            const gainNode = audioCtx.createGain();
            const mediaSource = audioCtx.createMediaElementSource(node);
            gainNode.connect(audioCtx.destination);
            mediaSource.connect(gainNode);
            let volume = 1;
            Object.defineProperty(node, 'volumeBoost', {
                get() {
                    return volume;
                },
                set(value) {
                    volume = Math.max(value, 0);
                    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
                }
            })
        }
        const META_CLEANUP = 'VolumeBoosterCleanup';
        const current = {
            Control: false,
            Shift: false,
            Alt: false,
        }
        const keys = Object.keys(current);
        const cleanup = (node) => {
            if (node && Reflect.has(node, META_CLEANUP)) {
                Reflect.get(node, META_CLEANUP).call();

            }
        }
        const check = () => keys.findIndex(x => current[x] != hotKeys[x]) == -1;

        let lastNode=null;
        const selectNode = (node) => {
            setupNode(node);
            cleanup(lastNode);
            if (!node) {
                return;
            }
            lastNode = node;

            const { border, boxSizing } = node.style;
            node.style.border = '.5em solid red';
            node.style.boxSizing = 'border-box';
            const rect = node.getBoundingClientRect();
            if (rect.top + rect.height > window.innerHeight
                || rect.top < 0
                || rect.left < 0
                || rect.left + rect.width > window.innerWidth) {
                node.scrollIntoView();
            }

            const META_KEY = 'VolumeBooster';
            /** @type {HTMLDivElement} */
            const volumeBooster = Reflect.get(node, META_KEY) || document.createElement('div');
            volumeBooster.style.color = 'red';
            volumeBooster.style.position = 'absolute';
            volumeBooster.style.right = 0;
            volumeBooster.style.top = 0;
            volumeBooster.style.background = '#ccc';
            volumeBooster.style.padding = '0.2em';
            volumeBooster.style.zIndex = 10000;
            volumeBooster.innerHTML = `${Math.round(node.volumeBoost * 100)}%`;
            if (!volumeBooster.parentNode) {
                node.parentNode.append(volumeBooster);
                Reflect.set(node, META_KEY, volumeBooster);
            }

            Reflect.set(node, META_CLEANUP, () => {
                node.style.border = border;
                node.style.boxSizing = boxSizing;
                volumeBooster.remove();
            });
        }

        const boost = (step) => {
            if (currentNode) {
                currentNode.volumeBoost += step;
                selectNode(currentNode);
            }
        }

        const moveNextNode = (next) => {
            const nodes = Array.from(document.querySelectorAll('video,audio'));
            if (!nodes.length) {
                return;
            }
            const index = Math.max(currentNode ? nodes.findIndex(node => node == currentNode) : 0, 0);
            const nextIndex = (index + next + nodes.length) % nodes.length;
            currentNode=nodes[nextIndex];
        }

        
        /** @type {(HTMLVideoElement|HTMLAudioElement)[]} */
        let active = false;
        const press = (key, press) => {
            if (key in current) {
                current[key] = press
            }
            active = check();
        }
        document.addEventListener('keyup', e => press(e.key, false));
        document.addEventListener('keydown', e => press(e.key, true));
        
        document.addEventListener('keyup', e => !active&&selectNode(null));
        document.addEventListener('keydown', e => {
            if (active) {
                if(!currentNode){
                    moveNextNode(0);
                }
                switch (e.key) {
                    case 'ArrowUp': boost(.1); break;
                    case 'ArrowDown': boost(-.1); break;
                    case 'ArrowLeft': moveNextNode(-1); break;
                    case 'ArrowRight': moveNextNode(1); break;
                }
                selectNode(currentNode);
            }

        })
    }

    window.addEventListener('load', setup);
})();