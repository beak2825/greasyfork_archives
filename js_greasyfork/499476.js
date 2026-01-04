// ==UserScript==
// @name         Hero2con
// @namespace    https://staybrowser.com/
// @version      0.1.1
// @description  Enjoy the hero2con easily
// @author       Rarztuna
// @match        https://bbs.tunaground.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tunaground.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499476/Hero2con.user.js
// @updateURL https://update.greasyfork.org/scripts/499476/Hero2con.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const existingLabel = document.querySelector('label.posting_option');

    if (existingLabel) {
        const imageButton = document.createElement('button');
        imageButton.type = 'button';
        imageButton.textContent = '영서콘';
        imageButton.className = 'image_insert_button';
        existingLabel.insertAdjacentElement('afterend', imageButton);

        imageButton.addEventListener('click', showImageSelector);
    }

    function enableTextareaSave() {
        const textarea = document.querySelector('textarea[name="content"]');
        const threadId = textarea?.closest('.thread')?.id;
        if (textarea && threadId) {
            const savedContent = sessionStorage.getItem(`textarea_content_${threadId}`);
            savedContent && (textarea.value = savedContent);
            textarea.addEventListener('input', saveTextareaContent);
        }
    }

    function disableTextareaSave() {
        const textarea = document.querySelector('textarea[name="content"]');
        textarea?.removeEventListener('input', saveTextareaContent);
    }

    function saveTextareaContent(event) {
        const textarea = event.target;
        const threadId = textarea.closest('.thread')?.id;
        threadId && sessionStorage.setItem(`textarea_content_${threadId}`, textarea.value);
    }

    function clearTextareaContent() {
        const textarea = document.querySelector('textarea[name="content"]');
        const threadId = textarea?.closest('.thread')?.id;
        threadId && sessionStorage.removeItem(`textarea_content_${threadId}`);
    }

    function showImageSelector() {
        const modal = document.createElement('div');
        modal.className = 'image_modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'image_modal_content';

        const imageList = [
            'https://i.postimg.cc/7662kvVg/image.png',
            'https://i.postimg.cc/1XnVQHBJ/2.png',
            'https://i.postimg.cc/527gqxyz/2-1.png',
            'https://i.postimg.cc/dttPTNhv/3.png',
            'https://i.postimg.cc/VL2FmnFc/4.png',
            'https://i.postimg.cc/8cR0x4wx/1.png',
            'https://i.postimg.cc/W3n4pKmT/2.png',
            'https://i.postimg.cc/L5G8bT5c/3.png',
            'https://i.postimg.cc/k4zFYXmV/image.png',
            'https://i.postimg.cc/L8j0HnSR/image.png',
            'https://i.postimg.cc/y6wFms9J/image.png',
            'https://i.postimg.cc/mDGKZ8vv/image.png',
            'https://i.postimg.cc/NGDZY8pn/image.png',
            'https://i.postimg.cc/jqFH4PmJ/1.png',
            'https://i.postimg.cc/Dy4qjm3p/2.png',
            'https://i.postimg.cc/3w1p4v2N/3.png',
            'https://i.postimg.cc/sX0hKC6R/4.png',
            'https://i.postimg.cc/3xHDtBBW/5.png',
            'https://i.postimg.cc/R0SJBZ2B/6.png',
            'https://i.postimg.cc/TwhyKHRN/7.png',
            'https://i.postimg.cc/yxZkPg3F/8.png',
            'https://i.postimg.cc/yYFXnHrd/2.png',
            'https://i.postimg.cc/YSy1jqjX/image.png',
            'https://i.postimg.cc/ZntBqqSz/image.png'
        ];

        imageList.forEach(imageUrl => {
            const imageItem = document.createElement('img');
            imageItem.src = imageUrl;
            imageItem.className = 'image_item';
            imageItem.style.width = '75px'; 
            imageItem.style.cursor = 'pointer';
            imageItem.addEventListener('click', () => handleImageClick(imageUrl));
            modalContent.appendChild(imageItem);
        });

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    async function handleImageClick(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'image.png', { type: blob.type });

            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;

                const changeEvent = new Event('change');
                fileInput.dispatchEvent(changeEvent);
            }

            const modal = document.querySelector('.image_modal');
            modal && document.body.removeChild(modal);
        } catch (error) {
            console.error('이미지를 불러오는데 실패했습니다:', error);
        }
    }
})();
