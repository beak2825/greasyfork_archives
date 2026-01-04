// ==UserScript==
// @name         极简牛牛
// @namespace    http://tampermonkey.net/
// @version      2025-07-14
// @description  移除图片、文字、简化战斗面板，适用于上班摸鱼
// @author       moxida
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542255/%E6%9E%81%E7%AE%80%E7%89%9B%E7%89%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/542255/%E6%9E%81%E7%AE%80%E7%89%9B%E7%89%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加页面灰白和半透明效果
    const style = document.createElement('style');
    style.innerHTML = `
    html {
        filter: grayscale(100%);
        opacity: 0.7;
    }
    `;
    document.head.appendChild(style);

    //战斗面板
    function hideBattlePanel(){
        //怪物面板
        document.querySelector('.BattlePanel_monstersArea__2dzrY')?.style.setProperty('display', 'none');
        //角色状态
        document.querySelectorAll('.HitpointsBar_currentHp__5exLr, .ManapointsBar_currentMp__3xpqC,.CombatUnit_model__2qQML,.ProgressBar_innerBarContainer__3WP-N,.ProgressBar_text__102Yn').forEach(panel => {
            panel.style.display = 'none';
        });
        //掉落信息
        document.querySelector('.Header_lootContainer__1nMaY')?.style.setProperty('display', 'none');


    }

    //隐藏图标
    function hideSvgIcon() {
        document.querySelectorAll('svg[role="img"]').forEach(svg => {
            svg.style.display = 'none';
        });
    }
    //隐藏文本
    function hideText() {
        document.querySelectorAll('.BattlePanel_label__1lNyt').forEach(label => {
            label.textContent = '';
        });
        document.querySelectorAll('h1,.Header_actionName__31-L2,.Header_name__227rJ,.Header_totalLevel__8LY3Q,.Header_playerCount__1TDTK,.QueuedActions_queuedActions__2xerL,.HousePanel_name__1SBye,.SkillAction_name__2VPXa,.GatheringProductionSkillPanel_label__3xUHj').forEach(h1 => {
            h1.innerHTML = '';
        });
        document.querySelectorAll('span,button').forEach(label => {
            label.textContent = '';
        });
    }


    function controller(){
        hideSvgIcon();
        hideText();
        hideBattlePanel();
    }
    // 初始化隐藏
    controller();
    // 监听 DOM 变化，动态隐藏新增的 SVG
    const observer = new MutationObserver(controller);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();