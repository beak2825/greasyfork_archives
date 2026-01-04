// ==UserScript==
// @name         数组游戏-作弊脚本
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  git汉化游戏 数组游戏 的作弊脚本
// @author       yuyanMC
// @match        https://gltyx.github.io/array-game/
// @match        https://array-game.g8hh.com/
// @match        https://demonin.com/games/arrayGame/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464227/%E6%95%B0%E7%BB%84%E6%B8%B8%E6%88%8F-%E4%BD%9C%E5%BC%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464227/%E6%95%B0%E7%BB%84%E6%B8%B8%E6%88%8F-%E4%BD%9C%E5%BC%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".tab>h1")[0].onclick=function(){
        game.array[0] = game.array[0].pow10();
    };
    $(".tab>h1")[1].onclick=function(){
        game.array[1] = game.array[1].pow10();
    };
    $(".tab>h1")[2].onclick=function(){
        game.array[2] = game.array[2].pow10();
    };
    $(".challenge")[0].onclick=function(){
        finishChallenge();
        if(game.challengesBeaten[0] >= 6){
            return;
        }
        game.challengesBeaten[0] = game.challengesBeaten[0] + 1;
    };
    $(".challenge")[1].onclick=function(){
        finishChallenge();
        if(game.challengesBeaten[1] >= 6){
            return;
        }
        game.challengesBeaten[1] = game.challengesBeaten[1] + 1;
    };
    $(".challenge")[2].onclick=function(){
        finishChallenge();
        if(game.challengesBeaten[2] >= 6){
            return;
        }
        game.challengesBeaten[2] = game.challengesBeaten[2] + 1;
    };
    $(".challenge")[3].onclick=function(){
        finishChallenge();
        if(game.challengesBeaten[3] >= 6){
            return;
        }
        game.challengesBeaten[3] = game.challengesBeaten[3] + 1;
    };
})();