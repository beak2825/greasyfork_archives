// ==UserScript==
// @name         CoDesign转ABC色值
// @namespace    https://codesign.qq.com/
// @version      0.2
// @description  CoDesign转ABC调色板
// @author       Bubble
// @match        https://codesign.qq.com/app/design/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463961/CoDesign%E8%BD%ACABC%E8%89%B2%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/463961/CoDesign%E8%BD%ACABC%E8%89%B2%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Codesgin注入成功')

    const colorPalette = {
        "#005ed9": "$theme1",
        "#0090ff": "$theme2",
        "#459eff": "$theme3",
        "#c6e2ff": "$theme4",
        "#a2cfff": "$theme5",
        "#80bdff": "$theme6",
        "#2680f7": "$B2",
        "#5199f8": "$B3",
        "#e9f2fe": "$B4",
        "#d4e6fd": "$B5",
        "#85baff": "$B6",
        "#000000": "$S1",
        "#ffffff": "$S2",
        "#2680f7": "$S3",
        "#385068": "$S4",
        "#000000": "$T1",
        "#7a8794": "$T2",
        "#aab4bf": "$T3",
        "#d9dbe3": "$P1",
        "#d9dbe3": "$P2",
        "#dadbe0": "$P3",
        "#eff3f6": "$P4",
        "#f5f7fb": "$P5",
        "#e6eaee": "$P6",
        "#e52d5b": "$R1",
        "#ff3366": "$R2",
        "#ff5b84": "$R3",
        "#ffeaef": "$R4",
        "#ffd6e0": "$R5",
        "#e5892d": "$Y1",
        "#ff9933": "$Y2",
        "#ffad5b": "$Y3",
        "#fff4ea": "$Y4",
        "#ffebd6": "$Y5",
        "#08a446": "$G1",
        "#1ec761": "$G2",
        "#23cf67": "$G3",
        "#e3fced": "$G4",
        "#bbf2d1": "$G5",
        "#e65f20": "$O1",
        "#ff793b": "$O2",
        "#ff9563": "$O3",
        "#fd9800": "$C1",
        "#0a8cea": "$C2",
        "#67ce0e": "$C3",
        "#ff6464": "$C4",
        "#fec166": "$C5",
        "#6cbaf2": "$C6"
    };

    const run = async () => {
        const doms = document.querySelector('.inspector-nav code')?.childNodes ?? [];
        if(!doms.length){
            return;
        }
        const filteredArr = Array.from(doms).filter(item => (item.nodeType === 3 && item.data !== "\n") || item.classList && Array.from(item.classList).includes('property'));
        let obj = {};
        for (let i = 0; i < filteredArr.length; i+=2) {
            const value = filteredArr[i+1].data.trim();
            if (colorPalette[value.toLowerCase()]) {
                filteredArr[i+1].data = value + ' -> ' + colorPalette[value.toLowerCase()]
            }
            obj[filteredArr[i].innerText] = filteredArr[i+1]
        }
    }
    function main() {
        setTimeout(() => {
            let observerOptions = {
                childList: true, // 观察目标子节点的变化，添加或删除
                subtree: true, //默认是false，设置为true后可观察后代节点
            }
            var observer = new MutationObserver(run);
            observer.observe(document.querySelector('.no-zoom-wrapper'), observerOptions)
        }, 2000)
    }

    window.onload = main
})();
