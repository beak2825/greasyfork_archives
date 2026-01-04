// ==UserScript==
// @name         BoxMap
// @namespace    https://bcmcreator.cn/
// @version      0.1
// @description  帮助萌新快速了解Box3.0（抄的）
// @author       创作喵
// @match        https://box3.codemao.cn/*
// @icon         https://static.box3.codemao.cn/img/QmUX51Fo1NTRP5H4cQa4UMcTCP7ZhyDwLvQsKM2zbStdMJ_520_216_cover.avif
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/468918/BoxMap.user.js
// @updateURL https://update.greasyfork.org/scripts/468918/BoxMap.meta.js
// ==/UserScript==
'use strict';
(async function main() {
    alert(`
        BoxMap:
        欢迎来到 Box3.0！
        祝你创作/游玩愉快！
    `);
    var main_Map = {
    Map : ()=>{
        alert(`
        BoxMap:
        地图编辑器：
        快去叫上朋友们一起合作吧
    `);
    },
    Code : ()=>{
        alert(`
        BoxMap:
        代码：
        -暂无-
    `);
    },
    Bulid : ()=>{
        alert(`
        BoxMap:
        建筑：
        -暂无-
    `);
    },
    Model : ()=>{
        alert(`
        BoxMap:
        模型编辑器：
        你可以用它来制作模型，
        发挥想象制作属于你的模型去吧，
        祝你上首页哦
    `);
    },
    Music : ()=>{
        alert(`
        BoxMap:
        音乐编辑器：
        你可以用它创作好听的音乐，
        记得发布让大家一起来听哦
    `);
    },
};
    window.gui = new lil.GUI({ title: 'BoxMap工具箱' });
    window.gui.domElement.style.top = 'unset';
    window.gui.domElement.style.bottom = '0';
    window.gui.domElement.style.userSelect = 'none';
    var page = gui.addFolder('编辑器');
    page.add(main_Map, 'Code').name('代码');
    page.add(main_Map, 'Bulid').name('建筑');
    page.add(main_Map, 'Model').name('模型');
    page.add(main_Map, 'Music').name('音乐');
    window.gui.add(main_Map, 'Map').name('地图');
})();