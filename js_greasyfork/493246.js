// ==UserScript==
// @name         mc百科页面焕新
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Display each mod in a card layout with miniature covers in the top right corner, with modal preview.
// @author       klnon
// @match        https://www.mcmod.cn/modlist.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493246/mc%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2%E7%84%95%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493246/mc%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2%E7%84%95%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const blocks = document.querySelectorAll('.modlist-block');
        const listContainer = document.createElement('div');
        listContainer.style.margin = '20px auto';
        listContainer.style.display = 'flex';
        listContainer.style.flexWrap = 'wrap';
        listContainer.style.justifyContent = 'center';

        // Create a modal to display mod details
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'none';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';

        const modalContent = document.createElement('iframe');
        modalContent.style.width = '80%';
        modalContent.style.height = '80%';
        modalContent.style.borderRadius = '10px';
        modalContent.style.border = 'none';

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Function to open modal
        function openModal(url) {
            modalContent.src = url;
            modal.style.display = 'flex';
        }

        // Function to close modal
        modal.addEventListener('click', function() {
            modal.style.display = 'none';
            modalContent.src = '';
        });

        blocks.forEach(block => {
            const modCard = document.createElement('div');
            modCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            modCard.style.border = '1px solid #ccc';
            modCard.style.borderRadius = '10px';
            modCard.style.transition = '0.3s';
            modCard.style.width = '300px';
            modCard.style.margin = '10px';
            modCard.style.padding = '10px';
            modCard.style.backgroundColor = '#fff';
            modCard.style.textAlign = 'left';
            modCard.style.position = 'relative';
            modCard.style.cursor = 'pointer';

            modCard.onmouseover = function() {
                this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.6)';
            };
            modCard.onmouseout = function() {
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            };

            const title = block.querySelector('.title').innerHTML;
            const description = block.querySelector('.intro-content span') ? block.querySelector('.intro-content span').textContent.trim() : '无描述';
            const link = block.querySelector('.title a').getAttribute('href');

            const coverImage = block.querySelector('.cover img');
            coverImage.style.width = '100%';
            coverImage.style.height = 'auto';

            const coverDiv = document.createElement('div');
            coverDiv.style.position = 'absolute';
            coverDiv.style.top = '10px';
            coverDiv.style.right = '10px';
            coverDiv.style.width = '60px';
            coverDiv.style.height = '40px';
            coverDiv.style.overflow = 'hidden';
            coverDiv.appendChild(coverImage);

            const contentDiv = document.createElement('div');
            contentDiv.style.paddingRight = '70px';
            contentDiv.innerHTML = `<div class="title"><strong>${title}</strong></div><hr style="margin: 10px 0;"><p>${description}</p>`;

            modCard.appendChild(contentDiv);
            modCard.appendChild(coverDiv);
            modCard.addEventListener('click', () => openModal(link));

            listContainer.appendChild(modCard);
        });

        const contentArea = document.querySelector('.modlist-list-frame');
        contentArea.innerHTML = '';
        contentArea.appendChild(listContainer);

        document.body.style.visibility = 'visible';
    });
})();
