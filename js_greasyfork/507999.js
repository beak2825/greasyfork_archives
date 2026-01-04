// ==UserScript==
// @name         Neopets Topic Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight visited topics on Neopets forums
// @author       Moxsee
// @match        https://www.neopets.com/neoboards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507999/Neopets%20Topic%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/507999/Neopets%20Topic%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the visited topics from localStorage
    function getVisitedTopics() {
        let visited = localStorage.getItem('neopetsVisitedTopics');
        return visited ? JSON.parse(visited) : [];
    }

    // Function to save visited topics to localStorage
    function saveVisitedTopic(topicId) {
        let visited = getVisitedTopics();
        if (!visited.includes(topicId)) {
            visited.push(topicId);
            localStorage.setItem('neopetsVisitedTopics', JSON.stringify(visited));
        }
    }

    // Function to highlight visited topics
    function highlightVisitedTopics() {
        const visited = getVisitedTopics();
        visited.forEach(topicId => {
            const topicElement = document.querySelector(`a[href*="topic=${topicId}"]`);
            if (topicElement) {
                topicElement.style.backgroundColor = '#E6E6FA'; // Highlight color
                topicElement.style.color = '#000'; // Text color
            }
        });
    }

    // Add an event listener to track when a topic is clicked
    function trackTopicVisit() {
        const topics = document.querySelectorAll('a[href*="topic="]');
        topics.forEach(topic => {
            topic.addEventListener('click', function() {
                const topicId = this.href.match(/topic=(\d+)/)[1]; // Extract the topic ID
                saveVisitedTopic(topicId);
            });
        });
    }

    // Run highlighting and tracking functions when the page loads or changes
    document.addEventListener('DOMContentLoaded', function() {
        highlightVisitedTopics();
        trackTopicVisit();
    });

    // Also observe for dynamically loaded content
    const observer = new MutationObserver(() => {
        highlightVisitedTopics();
        trackTopicVisit();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();