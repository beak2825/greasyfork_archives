// ==UserScript==
// @name         VK Video - Добавить кнопки "Не интересно" и "Не рекомендовать автора"
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Добавляет кнопки "Не интересно" и "Не рекомендовать автора" под каждым видео на VK Видео
// @author       You
// @match        https://vkvideo.ru/*
// @icon         https://vk.com/images/icons/favicons/fav_vk_video_2x.ico
// @grant        none
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/530659/VK%20Video%20-%20%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%22%D0%9D%D0%B5%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BD%D0%BE%22%20%D0%B8%20%22%D0%9D%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D0%B4%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B0%22.user.js
// @updateURL https://update.greasyfork.org/scripts/530659/VK%20Video%20-%20%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%22%D0%9D%D0%B5%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BD%D0%BE%22%20%D0%B8%20%22%D0%9D%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D0%B4%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B0%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtons() {
        const videoCards = document.querySelectorAll('.VideoCard');

        videoCards.forEach(card => {
            // Check if buttons already exist
            if (card.querySelector('.custom-buttons-added')) {
                return;
            }

            const infoContent = card.querySelector('.VideoCard__infoContent');
            if (!infoContent) {
                return;
            }

            const actionsContainer = document.createElement('div');
            actionsContainer.style.marginTop = '8px';
            actionsContainer.classList.add('custom-buttons-added'); // Add a class to prevent duplicates


            const notInterestedBtn = document.createElement('button');
            notInterestedBtn.textContent = 'Не интересно';
            applyButtonStyle(notInterestedBtn);
            notInterestedBtn.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                event.stopPropagation();  // Prevent event bubbling

                const videoId = card.dataset.id;
                const ownerId = card.dataset.ownerId;

                // Call the correct function with ownerId and videoId
                if (typeof VideoShowcase !== 'undefined' && typeof VideoShowcase.setNotRecommendOwner === 'function') {
                    VideoShowcase.setNotRecommendOwner(ownerId, videoId.split("_")[1]); //video ID is after _
                    console.log(`"Не интересно" clicked for video ID: ${videoId}, owner ID: ${ownerId}`);
                } else {
                    console.error("VideoShowcase.setNotRecommendOwner is not available.");
                }
            });


            const notRecommendBtn = document.createElement('button');
            notRecommendBtn.textContent = 'Не рекомендовать автора';
            applyButtonStyle(notRecommendBtn);
            notRecommendBtn.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                event.stopPropagation(); //Prevent event bubbling

              if (window.VideoShowcase && window.VideoShowcase.setNotRecommendOwner) {
                  const videoId = card.dataset.id;
                  const ownerId = card.dataset.ownerId;
                  window.VideoShowcase.setNotRecommendOwner(ownerId, videoId.split("_")[1]); // Call the function with owner and video id
                  console.log(`"Не рекомендовать автора" clicked for video ID: ${videoId}, owner ID: ${ownerId}`);

              } else
              {
                  console.error("VideoShowcase.setNotRecommendOwner is not available.");
              }
            });

            actionsContainer.appendChild(notInterestedBtn);
            actionsContainer.appendChild(notRecommendBtn);
            infoContent.appendChild(actionsContainer);
        });
    }

    function applyButtonStyle(button) {
        button.style.marginRight = '8px';
        button.style.padding = '4px 8px';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = 'transparent';
        button.style.cursor = 'pointer';
        button.style.fontSize = '13px'; // Match VK's font size
        button.style.color = 'var(--vkui--color_text_subhead)'; // Use VKUI variable for color
    }


    // Initial run
    addButtons();

    // Observe for changes in the DOM (e.g., infinite scrolling, SPA navigation)
    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    //One time button check after full page load, to catch any missed by the observer
    window.addEventListener('load', () => {
        setTimeout(addButtons, 500); //wait a bit for full render
    });


})();