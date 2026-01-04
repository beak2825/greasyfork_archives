// ==UserScript==
// @name         Pay 1 Title Banner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a banner for Pay 1 titles
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547125/Pay%201%20Title%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/547125/Pay%201%20Title%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pay1Titles = [
    "Bachchala Mall", "Max", "Survive", "Azrael", "Girl You Know It's True", "Love Reddy", "Dhoom Dhaam",
    "The Judgement", "Narayaneente Moonnanmakkal", "Fuss Class Dabhade", "Om Bheem Bush", "Royal", "Hathya",
    "Choo Mantar", "Forest", "Nodidavaru Enantare", "Housekeeping", "2K Love Story", "Am Ah", "Anpodu Kanmani",
    "Bad Boyz", "Jilabi", "Oru Jaathi Jaathkam", "I am Kathlan", "Gandhi Thatha Chettu", "Machante Maalaka",
    "Umbarro", "Aghathiyaa", "Peter Pan's Neverland Adventure", "Babygirl", "Flow", "The Monkey", "Conclave",
    "Swagg", "Mr Housekeeping", "Fire", "Murmur", "Nee Dharey Nee", "14 Days (Girlfriend Intlo", "Pelli Kani Prasad",
    "#ParyParvathy", "Vishnu Priya", "Gentlewoman", "Mukkam Post Devach Ghar", "Terrifier 3", "Chaari 111",
    "Yatra 2", "Lineman", "Anatomy of a Fall", "Joram", "Kagaz 2", "RAM: Rapid Action Mission",
    "Masthu Shades Unnai Raa", "Case of Kondana", "Munda Rockstar", "Juni", "Kismat", "For Regn", "Raktabeeej",
    "Jee Ve Sohneya Jee", "Joshua", "Byri", "J Baby", "Ranam Aram Thavarel", "The Teacher's lounge",
    "Hee Anokhi Gath", "ED Extra Decent", "28 Degree Celsius", "Buddy", "Chaurya Paatam", "Chiki Chiki Boom Boom",
    "Tuk Tuk", "Mithya", "Sri Ganesha", "EMI", "Vadakkan", "Vidyapathi", "Ouseppinte Osiyathu", "Abhilasham",
    "Akkada Ammayi Ikkada Abbayi", "We Live In Time", "Sarangapani Jathakam", "Arjun S/O Vyjayanthi", "Vaamana",
    "Manada Kadalu", "Demonte Colony 2", "Ten Hours", "Blackdog", "The Exorcism", "The Seed of the Sacred Fig",
    "Damaged", "Vermiglio", "Sumo", "Pariwar", "Rudhiram", "Yuddhakaanda Chapter 2", "Firefly",
    "Veera Chandrahasa", "Susheela Sujeet", "Blind Spot", "Ashi Hi Jamva Jamvi", "Ghatikachalam", "Eleven",
    "Gulkand", "Pune Highway", "Jora Kaiya Thattunga", "Devmanus", "Naale Rajaa Koli Majaa", "Romeo S3",
    "23 (Iravai Moodu)", "Sri Sri Sri Raajavaru", "Madras Matinee", "Sidlingu 2", "Maargan", "Show Time",
    "Edagaie Apaghatakke Karana", "3 BHK", "Oh Bhama Oyye Rama", "Hitman 2", "Paradha", "Chennai City Gangsters",
    "916 Konjoottan", "Kuladalli Keelyavudo", "The Forbidden Fairytale", "Padai Thalaivan", "Suryapet Junction",
    "United Kingdom of Kerala", "Oddity", "Jinn the Pet", "Handsome Guys", "Nadikar", "The 47", "The Legend of Ochi",
    "Badmashulu", "Sanju Weds Geetha", "Timmana Mottegalu", "Kanya Kumari", "Ravindra Nee evide", "Bun Butter Jam",
    "Demon Hunters", "Love Marriage", "Aksharsham: Operation Vajra Shakti", "Outhouse", "Atomic Blonde", "Perumani",
    "Sanju Weds Geetha 2", "Shoshana", "Soothravakyam", "The 100", "Bakasura Restaurant", "Kothalavadi", "Meesha",
    "Jenma Natchathiram", "Ye Re Ye Re Paisa 3", "Detective Ujjwalan", "Kanya Kumari"
    ];

    function createModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
            max-width: 500px;
        `;

        const message = document.createElement('p');
        message.textContent = 'This is an IN Pay 1 title. Reach out to your SME for further review.';
        message.style.marginBottom = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.cssText = `
            padding: 8px 20px;
            background-color: #0066c0;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;

        okButton.onclick = function() {
            modal.remove();
        };

        modalContent.appendChild(message);
        modalContent.appendChild(okButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    function checkForPay1Title() {
        const titleElement = document.querySelector('th.a-span3');
        if (titleElement && titleElement.textContent.trim() === 'Title') {
            const titleValueElement = titleElement.nextElementSibling;
            if (titleValueElement) {
                const titleText = titleValueElement.textContent.trim();
                if (pay1Titles.some(pay1Title => titleText.includes(pay1Title))) {
                    // Show modal for Crisp URLs
                    if (window.location.href.includes('crisp.amazon.com')) {
                        createModal();
                    }
                    // Remove the observer after finding a match
                    observer.disconnect();
                }
            }
        }
    }

    // Run the function when the page loads
    setTimeout(checkForPay1Title, 1000);

    // Use a MutationObserver to check for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                checkForPay1Title();
                return;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Disconnect the observer after 10 seconds to prevent long-running operations
    setTimeout(() => observer.disconnect(), 10000);
})();
