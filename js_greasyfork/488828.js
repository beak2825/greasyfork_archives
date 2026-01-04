// ==UserScript==
// @name         PayGame Enhancer
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  try to take over the world
// @author       nkpl1337
// @match        https://paygame.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paygame.ru
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/488828/PayGame%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/488828/PayGame%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addEnhancerButton() {
        var settingsButton = document.querySelector('ul.twkenb-5.eQGnVo > li.twkenb-6.iymFNB > a[href="/settings"]');


        if (!document.querySelector('a[href="/enhancer"]')) {

            if (settingsButton) {
                var enhancerButtonLi = document.createElement('li');
                enhancerButtonLi.className = 'twkenb-6 iymFNB';
                enhancerButtonLi.innerHTML = `<a href="/enhancer">Enhancer</a>`;
                settingsButton.parentNode.parentNode.insertBefore(enhancerButtonLi, settingsButton.parentNode.nextSibling);


                enhancerButtonLi.querySelector('a').addEventListener('click', function(event) {
                    event.preventDefault(); 
                    createAndShowModal(); 
                });
            }
        }
    }



    addEnhancerButton();

    async function fetchLastVisit(username) {
        const response = await fetch(`https://paygame.ru/users/${username}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const lastVisitElement = doc.querySelector('.sc-1umcyo1-7.iJfDka'); 

        if (lastVisitElement) {
            let lastVisitText = lastVisitElement.innerText;

            lastVisitText = lastVisitText.replace('Был(а) в сети ', '');


            const dateRegex = /(\d{1,2}):(\d{2})/;
            const matches = lastVisitText.match(dateRegex);
            if (matches) {
                let hours = parseInt(matches[1], 10);
                let minutes = matches[2];


                hours += 3; 


                lastVisitText = lastVisitText.replace(dateRegex, `${hours}:${minutes}`);
            }

            return lastVisitText;
        } else {
            return "Последний визит неизвестен";
        }
    }



    async function addLastVisitInfo() {
        const userDivs = document.querySelectorAll('div.jvm2kw-22.fEuUxI');
        const visitedUsers = {};

        for (let userDiv of userDivs) {
            const username = userDiv.querySelector('span').textContent.trim(); 
            if (!visitedUsers[username]) { 
                try {
                    visitedUsers[username] = await fetchLastVisit(username);
                } catch (error) {
                    console.error(`Error fetching last visit for user ${username}:`, error);
                    visitedUsers[username] = "Ошибка при получении информации о визите";
                }
            }


            if (!userDiv.querySelector('.last-visit-info')) {

                const lastVisitSpan = document.createElement('span');
                lastVisitSpan.className = 'last-visit-info';

                lastVisitSpan.textContent = `(${visitedUsers[username]})`;


                userDiv.querySelector('span').appendChild(lastVisitSpan);
            }
        }
    }

    function createAndShowModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'kafpxB';
    modalContent.style.cssText = `
        margin: 0 auto;
        background-color: rgb(30, 31, 41);
        color: rgb(208, 210, 222);
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        width: 90%;
        max-width: 520px;
        z-index: 2;
    `;


    const tabsContainer = document.createElement('div');
    tabsContainer.style.cssText = `
        display: flex;
        justify-content: space-around;
        position: relative;
        margin-bottom: 20px;
    `;

    const tabIndicator = document.createElement('div');
    tabIndicator.style.cssText = `
        height: 3px;
        background-color: rgb(208, 210, 222);
        position: absolute;
        bottom: 0;
        transition: left 0.3s ease, width 0.3s ease;
    `;
    tabsContainer.appendChild(tabIndicator);

    const createTab = (text) => {
        const tab = document.createElement('button');
        tab.innerText = text;
        tab.style.cssText = `
            background: none;
            border: none;
            color: rgb(208, 210, 222);
            cursor: pointer;
            font-weight: bold;
            padding: 10px 20px;
            position: relative;
        `;
        return tab;
    };

    const tabCredits = createTab('Credits');
    const tabSettings = createTab('Settings');


    const contentContainer = document.createElement('div');

    const contentCredits = document.createElement('div');

    contentCredits.innerHTML = `
    <div class="ell6q2-2 beYlPD">
            <div class="ell6q2-5 jfTHWT">
            <a>Creator:</a>
                <a href="/users/nkpl" style="display: inline-block;">
                    <div class="ell6q2-6 fQyzoI"><span>nkpl</span></div>
                </a>
            </div>
            <a>Thx for help:</a>
<a href="/users/PayGame" style="display: inline-block;">
                    <div class="ell6q2-6 fQyzoI"><span>PayGame</span></div>
                </a>
        </div>
    </div>
`;

    contentCredits.style.display = 'none';

    const contentSettings = document.createElement('div');
    contentSettings.innerHTML = '<p>soon...</p>';
    contentSettings.style.display = 'none';


    const switchTab = (activeTab, inactiveTab, activeContent, inactiveContent) => {
        activeContent.style.display = 'block';
        inactiveContent.style.display = 'none';

        tabIndicator.style.width = `${activeTab.offsetWidth}px`;
        tabIndicator.style.left = `${activeTab.offsetLeft}px`;
    };

    tabCredits.onclick = () => switchTab(tabCredits, tabSettings, contentCredits, contentSettings);
    tabSettings.onclick = () => switchTab(tabSettings, tabCredits, contentSettings, contentCredits);



    tabsContainer.appendChild(tabCredits);
    tabsContainer.appendChild(tabSettings);
    modalContent.appendChild(tabsContainer);
    modalContent.appendChild(contentCredits);
    modalContent.appendChild(contentSettings);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);


    tabCredits.click();


    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
    setTimeout(() => { tabCredits.click(); }, 0);

    modalContent.addEventListener('click', (e) => e.stopPropagation());
}


    let debounceTimer;
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    const observer = new MutationObserver(debounce(function() {
        calculateAndDisplayTotalPrice();
        addLastVisitInfo(); 
        addEnhancerButton();
    }, 500));

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function extractPrice(priceStr) {
        const price = parseInt(priceStr.replace(/\D/g, ''), 10);
        return isNaN(price) ? 0 : price;
    }

    function calculateAndDisplayTotalPrice() {
        const priceElements = document.querySelectorAll('.jvm2kw-11.jaUfPr');
        let totalSum = 0;
        priceElements.forEach((elem) => {
            const priceText = elem.innerText;
            const price = extractPrice(priceText);
            totalSum += price;
        });

        const priceHeaderElement = document.querySelector('.yyemtn-0.cZDQgH span');
        if (priceHeaderElement) {

            const existingSumSpan = document.querySelector('.total-price-sum');
            if (existingSumSpan) {
                existingSumSpan.remove();
            }


            const sumSpan = document.createElement('span');
            sumSpan.className = 'total-price-sum';
            sumSpan.textContent = `(${totalSum}₽)`;


            priceHeaderElement.parentNode.insertBefore(sumSpan, priceHeaderElement.nextSibling);
        }
    }

    const username = window.location.pathname.split('/').pop(); 

    function loadNotes() {

        return localStorage.getItem('notes_' + username) || '';
    }

    function saveNotes(text) {

        localStorage.setItem('notes_' + username, text);
    }

    function addNotesSection() {
        const ratingBlock = document.querySelector('.sc-1umcyo1-9.owzzy');
        if (ratingBlock) {
            const notesBlock = document.createElement('div');

            notesBlock.setAttribute('style', 'margin-top: 20px; padding: 10px; background-color: rgb(28, 29, 38); border-radius: 8px; box-shadow:rgb(43, 45, 60) 0px 0px 0px 1px; ');
            const textarea = document.createElement('textarea');
            textarea.setAttribute('style', 'width: 100%; height: 100px; resize: none; background-color: rgb(25, 26, 35); color: white; border-radius: 8px; outline: none; border:none; box-shadow:rgb(43, 45, 60) 0px 0px 0px 1px;');
            textarea.placeholder = "Заметки о продавце...";
            textarea.value = loadNotes();


            textarea.addEventListener('input', function() {
                saveNotes(textarea.value);
            });

            notesBlock.appendChild(textarea);
            ratingBlock.parentNode.insertBefore(notesBlock, ratingBlock.nextSibling);
        }
    }

    addNotesSection();

})();
