// ==UserScript==
// @name         Fix Overlap
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fix the issue of label overlapping in confluence roadmap!
// @author       You
// @match        http://cf.myhexin.com/pages/*
// @icon         data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" stroke-width="2" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479833/Fix%20Overlap.user.js
// @updateURL https://update.greasyfork.org/scripts/479833/Fix%20Overlap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var containers = document.querySelectorAll('div.roadmap-macro-view')
    var positionArr = []
    if (containers.length) {
        start()
    }
    function normalizeContainers(){
        containers.forEach((container) => {
            var titles = container.querySelectorAll('g g:nth-child(3) text')
            positionArr = []
            for(let i = 0;i < titles.length;i++) {
                const target = titles[i];
                normalizeRect(target)
            }
            moveRect()
            setTimeout(() => {
                adjustSVGHeight(container)
            })
        })
    }
    function changeColor() {
        containers.forEach((container) => {
            var childs = container.querySelector('g g:nth-child(3)').children
            const groups = []
            let currentGroup = []
            childs.forEach((el) => {
                if(el.nodeName === 'line') {
                    currentGroup = [el]
                    groups.push(currentGroup)
                } else {
                    currentGroup.push(el)
                }
            })
            groups.forEach((group) => {
                const color = createColor()
                group.forEach((el, index) => {
                    if (!index) {
                        el.setAttribute('stroke', color)
                        return
                    }
                    el.setAttribute('fill', color)
                })
            })
        })
    }
    function createColor(){
        const r = Math.floor(Math.random()*255)
        const g = Math.floor(Math.random()*255)
        const b = Math.floor(Math.random()*255)
        return 'rgb('+ r +','+ g +','+ b + ')'
    }
    // 碰撞检测
    function isCollisionWithRect(o1, o2) {
        if (o1.x >= o2.x && o1.x >= o2.x + o2.width) {
            return false
        } else if (o1.x <= o2.x && o1.x + o1.width <= o2.x) {
            return false
        } else if (o1.y >= o2.y && o1.y >= o2.y + o2.height) {
            return false
        } else if (o1.y <= o2.y && o1.y + o1.height <= o2.y) {
            return false
        } else {
            return true
        }
    }
    function normalizeRect(target) {
        const o = target.getBoundingClientRect()
        const x = +target.getAttribute('x')
        const y = +target.getAttribute('y')
        positionArr.push({
            x,
            y,
            width: o.width,
            height: o.height,
            el: target
        })
    }
    function moveRect() {
        if (!positionArr.length) return
        let i = 1;
        while (i < positionArr.length) {
            let t2 = positionArr[i]
            for (let j = 0;j < i;j++) {
                let t1 = positionArr[j]
                const isCollision = isCollisionWithRect(t1, t2)
                if (!isCollision) continue
                const start = t1.y + t1.height
                t2.el.setAttribute('y', start)
                t2.y = start
            }
            i++
        }
    }
    function adjustSVGHeight(container) {
        const svg = container.querySelector('svg')
        const g = container.querySelector('g g:nth-child(3)')
        if (!svg || !g) return
        const h1 = svg.getBoundingClientRect().height
        const h2 = g.getBoundingClientRect().height
        if (h1 >= h2 + 70) return
        svg.setAttribute('height', h2 + 70)
    }
    function start(){
        normalizeContainers()
        changeColor()
    }
})();