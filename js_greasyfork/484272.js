// ==UserScript==
// @name         Video Area Inverter
// @namespace    twitch.tv/simplevar
// @version      2024-01-08
// @description  Dark mode but for videos. Remembered your options per channel. ctrl+i to show/hide options, 'i' to toggle the area
// @author       SimpleVar
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      The Unlicense
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484272/Video%20Area%20Inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/484272/Video%20Area%20Inverter.meta.js
// ==/UserScript==

(() => {
    'use strict';

    setTimeout(() =>
    {
        const style = document.createElement("style");
        document.head.appendChild(style); // must append before you can access sheet property
        style.sheet.addRule('.html5-video-container', 'height: 100% !important')
        style.sheet.addRule('.html5-video-player', 'overflow: visible !important; z-index: unset')
        style.sheet.addRule('#player-container', 'z-index: 1')
        style.sheet.addRule('#ytd-player', 'overflow: visible !important')
        style.sheet.addRule('body[data-darkverysimpleunique="x"] .darkverysimpleunique', 'opacity: 1')
        style.sheet.addRule('body[data-darkverysimpleuniqueui="x"] .darkverysimpleuniqueui', 'opacity: 1')
        style.sheet.addRule('.darkverysimpleuniqueinput', 'pointer-events: none; user-select: auto;')
        style.sheet.addRule('body[data-darkverysimpleuniqueui="x"] .darkverysimpleuniqueinput', 'pointer-events: auto;')
        style.sheet.addRule('.darkverysimpleunique', 'position: absolute; pointer-events: none; transition: opacity 200ms; opacity: 0; border: 3px solid black; backdrop-filter: invert(1); box-sizing: border-box; box-shadow: black 0 0 0 2px; border-radius: calc(var(--height) * var(--radius) * 0.1px); height: calc(var(--height) * 1%); aspect-ratio: var(--aspect); left: 50%; transform: translateX(calc(var(--left) / var(--aspect) * 1%))')
        style.sheet.addRule('.darkverysimpleuniqueui', 'position: absolute; pointer-events: none; user-select: none; transition: opacity 80ms; opacity: 0; bottom: 0; right: 0; transform: translateY(100%); display: flex; align-items: baseline; font-size: medium; background-color: rgba(10, 10, 10, 0.9); padding-bottom: 0.334em; color: #eee')
    }, 100)
    document.body.addEventListener('keydown', e => {
        const anyModifier = e.altKey | e.ctrlKey | e.shiftKey | e.metaKey
        if (e.key === 'i' && !anyModifier) {
            e.preventDefault()
            e.stopPropagation()
            const x = document.body.dataset.darkverysimpleunique === 'x'
            document.body.dataset.darkverysimpleunique = x ? '' : 'x'
        }
        if (e.key === 'i' && e.ctrlKey) {
            e.preventDefault()
            e.stopPropagation()
            const x = document.body.dataset.darkverysimpleuniqueui === 'x'
            document.body.dataset.darkverysimpleuniqueui = x ? '' : 'x'
        }
    }, {passive: false, capture: true})

    function waitTruthy(pollInterval, fn) {
        return new Promise((res, _) => {
            poll()
            function poll() {
                const x = fn()
                if (x) res(x)
                else setTimeout(poll, pollInterval)
            }
        })
    }

    async function waitEl(elOrSelector, predicate = undefined, pollInterval = 100, knownParent = undefined) {
        if (!(elOrSelector instanceof HTMLElement)) {
            knownParent ??= document
            elOrSelector = await waitTruthy(pollInterval, () => knownParent.querySelector(elOrSelector))
        }
        if (predicate) await waitTruthy(pollInterval, () => predicate(elOrSelector))
        return elOrSelector
    }

    ;(async () => {
        const ch = (await waitEl('.ytd-channel-name a.yt-formatted-string')).getAttribute('href')
        const vid = await waitEl('video')
        fixVideoElement(vid, ch)
    })();
    /*
    new MutationObserver(muts => {
         for (const m of muts) {
             for (const el of m.addedNodes) {
                 if (el.tagName === 'video') setTimeout(fixVideoElement, 1000, el)
             }
         }
    }).observe(document.body, { childList: true, subtree: true });
    */

    function fixVideoElement(el, ch) {
        if (el.__eww_9832475) return
        el.__eww_9832475 = true
        el.style.position = 'relative'
        const area = document.createElement('div')
        el.parentElement.appendChild(area)
        area.className = 'darkverysimpleunique'
        const ui = document.createElement('div')
        el.parentElement.parentElement.parentElement.appendChild(ui)
        ui.className = 'darkverysimpleuniqueui'
        const STOP = e => { e.stopPropagation() };
        const chStorageKey = 'darkverysimpleuniqueedges_' + ch
                debugger
        let memberedEdges = null
        try { memberedEdges = JSON.parse(localStorage.getItem(chStorageKey) ?? '{}') } catch {}
        if (!(memberedEdges instanceof Object)) memberedEdges = null
        const edges = Object.assign({left: 0, top: 0, height: 0, aspect: 0, radius: 0}, memberedEdges ?? {})
        const mkInp = (key, label, min, max) => {
            if (label) {
                const lbl = document.createElement('label')
                lbl.textContent = label
                lbl.style.marginLeft = '1ch'
                ui.appendChild(lbl)
            }
            const inp = document.createElement('input')
            ui.appendChild(inp)
            inp.className = 'darkverysimpleuniqueinput'
            inp.type = 'number'
            inp.min = min
            inp.max = max
            inp.step = 0.025
            inp.style.width = '6ch'
            inp.style.fontSize = 'inherit'
            const storageKey = 'darkverysimpleuniqueedge' + key
            inp.value = (memberedEdges && memberedEdges[key]) ?? localStorage.getItem(storageKey)
            if (!inp.value && inp.value !== 0) inp.value = key === 'aspect' ? 1 : 25
            const onChange = e => {
                e && STOP(e);
                edges[key] = inp.value
                if (key === 'radius') area.style.setProperty('--radius', +(inp.value ?? 25))
                else if (key === 'height') area.style.setProperty('--height', +(edges.height ?? 25))
                else if (key === 'aspect') area.style.setProperty('--aspect', +(inp.value ?? 100) * 0.01)
                else if (key === 'left') area.style.setProperty('--left', +(inp.value ?? 0))
                else area.style[key] = (50 - +(inp.value ?? 0)) + '%'
                localStorage.setItem(storageKey, inp.value)
                localStorage.setItem(chStorageKey, JSON.stringify(edges))
            };
            onChange()
            inp.__onChange = onChange
            const stoppedEvents = [
                'click', 'dblclick', 'auxclick', 'contextmenu', 'wheel', 'scroll', 'tap', 'pointerdown', 'pointerup', 'touchstart', 'mouseleave', 'mousedown',
                'panmove', 'panstart', 'panend', 'pinchin', 'pinchout', 'mouseover', 'mousemove', 'focusin', 'gesturechange', 'gestureend', 'keyup',
            ];
            for (const ev of stoppedEvents) inp.addEventListener('click', STOP)
            inp.addEventListener('keydown', e => {
                STOP(e)
                let dy = 0
                switch (e.key) {
                    case 'ArrowUp': dy = 1; break;
                    case 'ArrowDown': dy = -1; break;
                }
                if (dy) {
                    dy *= (e.ctrlKey | e.shiftKey) ? 5 : 0.1
                    inp.value = dy + +(inp.value ?? 0)
                }
            })
            inp.addEventListener('input', onChange)
            return inp
        };
        mkInp('top', 'T=', 0, 100)
        mkInp('height', 'H=', 0, 100)
        mkInp('left', 'L=', undefined, undefined)
        mkInp('aspect', 'W=', 0, undefined)
        mkInp('radius', 'radius=', 0, 50)
    }

})()