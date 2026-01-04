// ==UserScript==
// @name         Productivity Booster
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unleash your potential with this revolutionary productivity tool!
// @author       ThomasBlackwell
// @match        *://*/*
// @exclude      *://*/*captcha*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492374/Productivity%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/492374/Productivity%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const productivityBooster = () => {
        const randomQuotes = [
            "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "The only way to do great work is to love what you do.",
            "Don't watch the clock; do what it does. Keep going.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Hardships often prepare ordinary people for an extraordinary destiny.",
            "Believe you can and you're halfway there.",
            "The only limit to our realization of tomorrow will be our doubts of today.",
            "In the middle of difficulty lies opportunity.",
            "Dream big and dare to fail.",
            "You are never too old to set another goal or to dream a new dream.",
            "The secret of getting ahead is getting started.",
            "Do what you can with all you have, wherever you are.",
            "You are what you do, not what you say you'll do.",
            "It's not whether you get knocked down, it's whether you get up.",
            "Believe you can and you're halfway there.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
            "The only way to do great work is to love what you do.",
            "Don't watch the clock; do what it does. Keep going.",
            "The best time to plant a tree was 20 years ago. The second best time is now.",
            "Your limitation—it's only your imagination.",
            "Push yourself, because no one else is going to do it for you.",
            "Great things never come from comfort zones.",
            "Dream it. Wish it. Do it.",
            "Success doesn’t just find you. You have to go out and get it.",
            "The harder you work for something, the greater you’ll feel when you achieve it.",
            "Dream bigger. Do bigger.",
            "Don’t stop when you’re tired. Stop when you’re done.",
            "Wake up with determination. Go to bed with satisfaction.",
            "Do something today that your future self will thank you for.",
            "Little things make big days.",
            "It’s going to be hard, but hard does not mean impossible.",
            "Don’t wait for opportunity. Create it.",
            "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
            "The key to success is to focus on goals, not obstacles.",
            "Dream it. Believe it. Build it.",
            "Remember why you started.",
            "The only way to do great work is to love what you do.",
            "You have to expect things of yourself before you can do them.",
            "Motivation is what gets you started. Habit is what keeps you going.",
            "Don't let yesterday take up too much of today.",
            "It’s not whether you get knocked down, it’s whether you get up.",
            "The harder you work for something, the greater you’ll feel when you achieve it.",
            "We may encounter many defeats but we must not be defeated.",
            "Do what you can with all you have, wherever you are.",
            "Start where you are. Use what you have. Do what you can.",
            "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.",
            "You learn more from failure than from success. Don’t let it stop you. Failure builds character.",
            "It’s not whether you get knocked down, it’s whether you get up.",
            "If you are working on something that you really care about, you don’t have to be pushed. The vision pulls you.",
            "We may encounter many defeats but we must not be defeated.",
            "The only limit to our realization of tomorrow is our doubts of today.",
            "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine."
        ];

        const getRandomQuote = () => {
            return randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        };

        const displayQuote = () => {
            const quoteElement = document.createElement('div');
            quoteElement.innerHTML = `<p>${getRandomQuote()}</p>`;
            quoteElement.style.position = 'fixed';
            quoteElement.style.bottom = '10px';
            quoteElement.style.right = '10px';
            quoteElement.style.background = 'rgba(0, 0, 0, 0.7)';
            quoteElement.style.color = 'white';
            quoteElement.style.padding = '10px';
            quoteElement.style.borderRadius = '5px';
            quoteElement.style.zIndex = '9999';
            document.body.appendChild(quoteElement);

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px';
            closeButton.style.right = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.border = 'none';
            closeButton.style.background = 'transparent';
            closeButton.style.color = 'white';
            closeButton.style.fontSize = '16px';
            closeButton.style.padding = '0';
            closeButton.style.lineHeight = '1';
            closeButton.style.outline = 'none';
            closeButton.addEventListener('click', () => {
                quoteElement.remove();
            });
            quoteElement.appendChild(closeButton);

            document.body.appendChild(quoteElement);
        };

        // Check if the page is a CAPTCHA
        const isCaptchaPage = () => {
            return window.location.href.includes("captcha");
        };

        // Show the motivational quote popup
        if (!isCaptchaPage()) {
            displayQuote();
        }
    };

    // Runs the code
    productivityBooster();
})();
