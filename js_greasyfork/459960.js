// ==UserScript==
// @name        Percent in Contests Lolz.guru
// @namespace   percent_in_contests_lolzguru
// @match       https://lolz.guru/threads/*
// @match       https://zelenka.guru/threads/*
// @grant       none
// @version     1.1
// @license MIT
// @author      its_niks, d3clin3
// @description Расширение, которое показывает шанс победы в процентах.
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/459960/Percent%20in%20Contests%20Lolzguru.user.js
// @updateURL https://update.greasyfork.org/scripts/459960/Percent%20in%20Contests%20Lolzguru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function () {
        var element = document.querySelector('body > div.breadBoxTop > div > nav > fieldset > span > span:nth-child(4) > a > span');
        var element2 = document.getElementsByClassName('crumbs')[0];
        if(element2.children.length == 4) {
        if (element2.textContent.indexOf("Розыгрыши") !== -1){

            var post_body = document.getElementsByClassName('contestThreadBlock')[0];
            var users = Number(post_body.textContent.split('Приняли участие: ')[1].split(' пользова')[0])
            var contest_sum = post_body.textContent.split('(')[1].split(')')[0].split(' x ')
            if (contest_sum.length == 1) {
                var winners = 1;
            } else {
                var winners = Number(contest_sum[1]);
            }
            var percent = String(1/users*100*winners).substr(0, 4)

            var div = document.createElement('div');

            div.className = "marginBlock";
            div.innerHTML= `<span class="info-separator m-right"></span>Шанс на победу: ${percent}%`;
            var container = document.getElementsByClassName('contestThreadBlock')[0];
            container.insertBefore(div, container.childNodes[2]);
        } else if (element2.textContent.indexOf("Giveaways") !== -1){
            var post_body = document.getElementsByClassName('contestThreadBlock')[0];
            var users = Number(post_body.textContent.split('Took part: ')[1].split(' user')[0])
            var percent = String(1/users*100).substr(0, 4)

            var div = document.createElement('div');

            div.className = "marginBlock";
            div.innerHTML= `<span class="info-separator m-right"></span>Chance to win: ${percent}%`;
            var container = document.getElementsByClassName('contestThreadBlock')[0];
            container.insertBefore(div, container.childNodes[2]);
        }
    }
})

})();