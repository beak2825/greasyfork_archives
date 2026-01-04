// ==UserScript==
// @name         Super Turtle Idle Auto Click 超级乌龟放置自动点击
// @name:en      Super Turtle Idle Auto Click
// @name:zh      超级乌龟放置自动点击
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  for v0.4.0
// @author       销锋镝铸 XiaofengdiZhu
// @supportURL   https://gist.github.com/XiaofengdiZhu/6745adff8f1f6648bb6e36a67667004d
// @license      MIT
// @match        https://gltyx.github.io/super-turtle-idle/
// @match        https://super-turtle-idle.g8hh.com.cn/
// @match        https://super-turtle-idle.g8hh.com/
// @match        https://superturtleidle.github.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497610/Super%20Turtle%20Idle%20Auto%20Click%20%E8%B6%85%E7%BA%A7%E4%B9%8C%E9%BE%9F%E6%94%BE%E7%BD%AE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/497610/Super%20Turtle%20Idle%20Auto%20Click%20%E8%B6%85%E7%BA%A7%E4%B9%8C%E9%BE%9F%E6%94%BE%E7%BD%AE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let rpgPlayerImg = did("rpgPlayerImg");
    let jesterWrapper = did("jesterWrapper");
    let mysteryList = did("mysteryList");
    setInterval(() => {
        //自动点击左下角乌龟 Auto click the turtle at left bottom
        if (!clickCooldown) {
            turtleClick();
        }
        //自动点击复活 Auto click for reviving
        if (!rpgPlayer.alive) {
            rpgPlayerImg.click();
        }
        //自动点击小丑龟 Auto click jester turtle
        if (jesterWrapper.hasChildNodes()) {
            jesterWrapper.firstChild.click();
        }
        //自动打开礼物敌人 Auto open mystery present enemy
        if (stats.currentEnemy == "E15") {
            did("E15enemy").firstChild.dispatchEvent(new MouseEvent('contextmenu', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            }));
        }
        //自动打开礼物敌人的礼物 Auto open mystery presents
        if(mysteryList.hasChildNodes()){
            let endGame;
            for(let mystery of mysteryList.children){
                if(mystery.id.startsWith("endGame")){
                    endGame = mystery;
                }
                else{
                    mystery.click();
                }
            }
            endGame.click();
        }
    }, 50);
})();