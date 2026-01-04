// ==UserScript==
// @name         LZT_ContestPro
// @namespace    MeloniuM/LZT
// @version      1.0
// @description  Дополнение к розыгрышам на зелёнке
// @author       MeloniuM
// @license      MIT
// @match        http*://zelenka.guru/threads/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474976/LZT_ContestPro.user.js
// @updateURL https://update.greasyfork.org/scripts/474976/LZT_ContestPro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!XenForo._loadedScripts.contest) return;
    const closedTopic = document.querySelector('h1 > i.fa-lock');
    if (closedTopic) {
        console.log('Тема закрыта, лайк не ставим');
        return;
    }

    let $participateButton = $('.LztContest--Participate');
    if (!($participateButton.length)) return;
    $participateButton.get(0).scrollIntoView();
    //участие кнопкой Tab
    $(document).on('keydown', function(e){
        if(e.defaultPrevented) return;
        if (e.key == 'Tab' && $participateButton.is(':visible') && !$participateButton.hasClass('disabled')){
            e.preventDefault();
            $participateButton.click();
        }
    });

    //автолайк
    const likeButton = $('.firstPost a.LikeLink');
    const likeProbability = 0.5; // вероятность лайка 50%
    XenForo.ajax(likeButton.data('likesUrl'), {}, function(ajaxData){
        const countLeft = $(ajaxData.templateHtml).find('.likeCountLeft b').text().split(' ')[0];
        if (Number(countLeft) > 0){
            const randomValue = Math.random(); // генерируем случайное число от 0 до 1
            if (randomValue <= likeProbability) { // сравниваем с вероятностью лайка
                likeButton.click(); // если число меньше или равно вероятности лайка, ставим лайк
            }
        }else{
            console.log('Осталось 0 лайков');
        }
    });
})();