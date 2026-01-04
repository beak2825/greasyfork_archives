// ==UserScript==
// @name         网页手电筒
// @namespace    dongdong
// @version      0.1.4
// @description  网页手电筒。
// @author       dongdong
// @match        *
// @match        */*
// @match        */*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454129/%E7%BD%91%E9%A1%B5%E6%89%8B%E7%94%B5%E7%AD%92.user.js
// @updateURL https://update.greasyfork.org/scripts/454129/%E7%BD%91%E9%A1%B5%E6%89%8B%E7%94%B5%E7%AD%92.meta.js
// ==/UserScript==

(function() {
      document.querySelector('style').append(`canvas {
        position: fixed;
        left:0;
        top: 0;
        z-index: 9999;
        pointer-events: none;
    }`)
    document.body.appendChild(document.createElement('canvas'))
    const cvs = document.querySelector('canvas')
    const ctx = cvs.getContext('2d')
    cvs.width = document.documentElement.clientWidth
    cvs.height = document.documentElement.clientHeight
    const p = {
        x: 0,
        y: 0,
        r: 50
    }
    document.onmousemove = e => {
        p.x = e.clientX
        p.y = e.clientY
        render()
    }
    const render = () => {
        ctx.beginPath()
        ctx.clearRect(0, 0, cvs.width, cvs.height)
        var radial = ctx.createRadialGradient(p.x,p.y,p.r,p.x,p.y,p.r * 3);
        radial.addColorStop(0,'rgba(255, 255, 255, 0)');
        radial.addColorStop(1,'rgba(0, 0, 0, 0.5)');
        ctx.fillStyle = radial;
        ctx.fillRect(0,0,cvs.width, cvs.height);
    }
    render()
    window.onresize = () => {
        cvs.width = document.documentElement.clientWidth
        cvs.height = document.documentElement.clientHeight
        render()
    }
})();