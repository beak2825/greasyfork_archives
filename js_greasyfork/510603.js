// ==UserScript==
// @name         JVC Auto-Refresh Topics
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Actualise automatiquement la liste des topics sur jeuxvideo.com sans rafraîchir la page
// @author       HulkDu92
// @match        https://www.jeuxvideo.com/forums/*.htm
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510603/JVC%20Auto-Refresh%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/510603/JVC%20Auto-Refresh%20Topics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .topic-item {
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .topic-item.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    class TopicUpdater {
        constructor() {
            this.topicListSelector = '.topic-list';
            this.updateInterval = 5000;
            this.topics = new Map();
            this.init();
        }

        init() {
            this.loadExistingTopics();
            this.startUpdating();
        }

        loadExistingTopics() {
            const topicItems = document.querySelectorAll(`${this.topicListSelector} li[data-id]`);
            topicItems.forEach(item => {
                // Vérifiez si c'est un topic épinglé par les modos
                if (!(item.querySelector('.icon-topic-pin') && item.querySelector('.icon-topic-pin.topic-pin-off'))) {
                    const id = item.getAttribute('data-id');
                    this.topics.set(id, item.outerHTML);
                } else {
                    item.style.display = 'none'; // Masque le topic
                }
            });
        }

        async fetchNewTopics() {
            console.log("fetchNewTopics");
            const response = await fetch(location.href); // Récupère la page actuelle
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            return doc.querySelectorAll(`${this.topicListSelector} li[data-id]`);
        }

        async updateTopics() {
            console.log("updateTopics");
            const newTopics = await this.fetchNewTopics();
            let delay = 0; // Délai initial

            newTopics.forEach(item => {
                const id = item.getAttribute('data-id');
                // Vérifiez si c'est un topic épinglé par les modos
                if (!this.topics.has(id) && !(item.querySelector('.icon-topic-pin') && item.querySelector('.icon-topic-pin.topic-pin-off'))) {
                    this.topics.set(id, item.outerHTML);
                    setTimeout(() => {
                        this.addTopicToDOM(item);
                    }, delay);
                    delay += 200;
                } else if (this.topics.has(id)) {
                    // Si le topic existe déjà, on doit le mettre à jour
                    this.updateTopicInDOM(item);
                }
            });
        }

        addTopicToDOM(topicItem) {
            console.log("addTopicToDOM:");
            const topicList = document.querySelector(this.topicListSelector);
            const topicHead = topicList.querySelector('.topic-head');
            if (topicHead) {
                const newTopic = topicItem.cloneNode(true);
                newTopic.classList.add('topic-item');
                topicList.insertBefore(newTopic, topicHead.nextSibling); // Insère le nouveau topic juste après topic-head

                setTimeout(() => {
                    newTopic.classList.add('show');
                }, 10); // 10 ms pour s'assurer que l'élément est rendu
            }
        }

        updateTopicInDOM(topicItem) {
            console.log("updateTopicInDOM:");
            const topicList = document.querySelector(this.topicListSelector);
            const existingTopic = topicList.querySelector(`li[data-id='${topicItem.getAttribute('data-id')}']`);

            if (existingTopic) {
                existingTopic.replaceWith(topicItem.cloneNode(true)); // Remplace l'ancien topic par le nouveau
                console.log(`Topic mis à jour : ${topicItem.innerText}`);
            }
        }

        startUpdating() {
            setInterval(() => {
                this.updateTopics(); // Appelle la méthode d'actualisation des topics
            }, this.updateInterval);
        }
    }

    // Fonction principale d'entrée
    function main() {
        new TopicUpdater();
    };

    main();
})();