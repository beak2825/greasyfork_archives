// ==UserScript==
// @name         Bandcamp: Auto Play Discover
// @name:en      Bandcamp: Auto Play Discover
// @name:ru      Bandcamp: Автовоспроизведение на Discover
// @name:zh      Bandcamp： 自动播放发现
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-playing tracks on https://bandcamp.com/discover page
// @description:ru Автоматическое воспроизведение треков на странице hhttps://bandcamp.com/discover
// @author       Grihail

// @match        https://bandcamp.com/discover*

// @icon         https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @grant        none
// @license       CC-BY
// @downloadURL https://update.greasyfork.org/scripts/485600/Bandcamp%3A%20Auto%20Play%20Discover.user.js
// @updateURL https://update.greasyfork.org/scripts/485600/Bandcamp%3A%20Auto%20Play%20Discover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var AllLi
    var cur

    String.prototype.float = function() {
        return parseFloat(this.replace(',', '.')).toFixed(3);
      }
    function refreshList() {
        var allLiElements = document.querySelectorAll("ul.items li");
        AllLi = allLiElements
    }

    function LoadMore(id){
        var position = AllLi.length - id;


        if(position <= 5){
            var more = document.querySelector("button[data-test='view-more']");
            if(more){
                more.click();
                refreshList();
            }
        }
    }

    function seekControlCheck() {

        var seekControl = document.querySelector("input.seek-control");
        try {


            if (seekControl.value.float() > "0.995".float() || seekControl.value.float() == "1.00".float()) {
                refreshList();
                for (var i = 0; i < AllLi.length; i++) {
                    //ищем кнопку в ли с датой aria-label pause

                    var btn = AllLi[i].querySelector("button[aria-label='Pause']");
                    if (btn) {
                        LoadMore(i);
                        // если наша кнопка есть с паузой в aria
                        var next = AllLi[i + 1].querySelector("button[aria-label='Play']");
                        // Проверяем, существует ли кнопка play для следующей песни
                        if (next) {
                            // Нажимаем на кнопку play
                            next.click();
                            cur = i;

                        }else{
                            var next1 = AllLi[i + 2].querySelector("button[aria-label='Play']");
                            if(next1){
                                next1.click();
                                cur = i+2;
                            }else{
                                var next2 = AllLi[i + 3].querySelector("button[aria-label='Play']");
                                if(next2){
                                    next2.click();
                                    cur = i+3;
                                }else{
                                    LoadMore(i);
                                }
                            }
                        }
                        break
                    }else{
                        if(cur > 1){
                            var nextcur = AllLi[cur + 1].querySelector("button[aria-label='Play']");
                            if (nextcur) {
                                nextcur.click();
                                cur = i+1;
                            }
                        }
                    }
                }
            }else{
                for (var s = 0; s < AllLi.length; s++) {
                    //ищем кнопку в ли с датой aria-label pause

                    var btna = AllLi[s].querySelector("button[aria-label='Pause']");
                    if(btna){
                        cur = s;
                        break
                    }

                }
            }

        } catch (error) {
         //не играет музыка

        }
    }

    refreshList();
    setInterval(refreshList, 10000);
    setInterval(seekControlCheck,500); //смотрим за окончанием трека
})();