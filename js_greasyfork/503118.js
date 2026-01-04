// ==UserScript==
// @name         Move Forum Topics
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Позволяет перемещать темы на форуме
// @author       Максим
// @match        forum.blackrussia.online
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503118/Move%20Forum%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/503118/Move%20Forum%20Topics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавим кнопки для движения тем
    const topics = document.querySelectorAll('.topic'); // Замените .topic на селектор ваших тем

    topics.forEach(topic => {
        const moveUpBtn = document.createElement('button');
        moveUpBtn.textContent = '↑';
        moveUpBtn.onclick = () => moveTopic(topic, 'up');

        const moveDownBtn = document.createElement('button');
        moveDownBtn.textContent = '↓';
        moveDownBtn.onclick = () => moveTopic(topic, 'down');

        topic.appendChild(moveUpBtn);
        topic.appendChild(moveDownBtn);
    });

    function moveTopic(topic, direction) {
        if (direction === 'up') {
            const prevTopic = topic.previousElementSibling;
            if (prevTopic) {
                topic.parentNode.insertBefore(topic, prevTopic);
            }
        } else if (direction === 'down') {
            const nextTopic = topic.nextElementSibling;
            if (nextTopic) {
                topic.parentNode.insertBefore(nextTopic, topic);
            }
        }
    }
})();


