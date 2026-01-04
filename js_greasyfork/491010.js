// ==UserScript==
// @name         AutoQuizPlease
// @namespace    https://github.com/SOLiNARY
// @version      0.2
// @description  Autofills lohotron inputs
// @author       Ramin Quluzade
// @license      MIT License
// @match        https://baku.quizplease.ru/lottery*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizplease.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491010/AutoQuizPlease.user.js
// @updateURL https://update.greasyfork.org/scripts/491010/AutoQuizPlease.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Genders = {
        Male: 0,
        Female: 1
    }
    const TeamNames = ['Noldor', 'Легенды Найт-Сити'];
    const PlayerName = 'Ramin Quluzade';
    const PlayerEmail = 'quluzade.ramin@gmail.com';
    const PlayerPhone = '+994506654920';
    const PlayerDob = '06.11.1990';
    const PlayerGender = Genders.Male;
    let teamIndex = 0;

    if (document.querySelectorAll('select.lototron-input[name=game_id] option').length > 1) {
        document.querySelector('select.lototron-input[name=game_id]').selectedIndex = 1;
    }
    document.querySelector('label.lototron__label[for=team]').textContent += ' [Нажми чтобы сменить]';
    document.querySelector('label.lototron__label[for=team]').addEventListener('click', () => {
        teamIndex = TeamNames[teamIndex + 1] === undefined ? 0 : teamIndex + 1;
        document.querySelector('input.lototron-input[data-field=team]').value = TeamNames[teamIndex];
    });
    document.querySelector('input.lototron-input[data-field=team]').value = TeamNames[teamIndex];
    document.querySelector('input.lototron-input[data-field=name]').value = PlayerName;
    document.querySelector('input.lototron-input[data-field=email]').value = PlayerEmail;
    document.querySelector('input.lototron-input[data-field=phone]').value = PlayerPhone;
    document.querySelector('input.lototron-input[data-field=date_of_birth][name*=day]').value = PlayerDob.substr(0, 2);
    document.querySelector('input.lototron-input[data-field=date_of_birth][name*=month]').value = PlayerDob.substr(3, 2);
    document.querySelector('input.lototron-input[data-field=date_of_birth][name*=year]').value = PlayerDob.substr(6, 4);
    document.querySelectorAll('div.filter-radio input[name*=gender]')[PlayerGender].click();
})();