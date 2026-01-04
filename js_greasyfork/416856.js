// ==UserScript==
// @name         canvas 转换成 svg
// @namespace    https://gist.github.com/liubiantao
// @version      0.3
// @description  把网页中的 canvas 转换成 svg
// @author       liubiantao
// @match        https://www.amap.com/
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/canvas2svg@1.0.16/canvas2svg.min.js
// @downloadURL https://update.greasyfork.org/scripts/416856/canvas%20%E8%BD%AC%E6%8D%A2%E6%88%90%20svg.user.js
// @updateURL https://update.greasyfork.org/scripts/416856/canvas%20%E8%BD%AC%E6%8D%A2%E6%88%90%20svg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    #canvas2svg {
        position: fixed;
        bottom: 20%;
        left: 1px;
        border: 1px solid #00b5ff;
        padding: 3px;
        font-size: 12px;
        cursor: pointer;
        border-radius: 3px;
        z-index: 111111;
        color: #00b5ff;
        background: #00b5ff1f;
    }
  `)

    function canvas2svg(){
        const gls = document.querySelectorAll('canvas')
        gls.forEach(gl => {
            const ctx = new C2S(1500, 1500);
            const glctx = gl.getContext('webgl') || gl.getContext('2d')
            ctx.drawImage(glctx.canvas, 0, 0);
            const svg = ctx.getSerializedSvg(true);
            console.log(svg)
        })
    }

    function addButton() {
        const btn = document.createElement('div')
        btn.innerText = 'canvas2svg'
        btn.id = 'canvas2svg'
        document.body.append(btn)
        document.querySelector('#canvas2svg').addEventListener('click', canvas2svg)
    }


    addButton()

})();