// ==UserScript==
// @name         ChatGPT TOC for Questions
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a floating table of contents (TOC) for your questions on the ChatGPT chat page.
// @author       BruceYu
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @source       https://github.com/13ruceYu/tampermonkey-chatgpt-toc-questions
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511963/ChatGPT%20TOC%20for%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/511963/ChatGPT%20TOC%20for%20Questions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        // Create and style the floating TOC container
        const tocContainer = document.createElement('div');
        tocContainer.id = 'toc-container';
        tocContainer.style.position = 'fixed';
        tocContainer.style.top = '60px';
        tocContainer.style.right = '40px';
        tocContainer.style.width = '36px';
        tocContainer.style.height = '36px';
        tocContainer.style.overflow = 'hidden';
        tocContainer.style.backgroundColor = '#f8f8f8';
        tocContainer.style.border = '1px solid #ddd';
        tocContainer.style.zIndex = '1000';
        tocContainer.style.opacity = '0.95';
        tocContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        tocContainer.classList.add('toc-container')
        document.body.appendChild(tocContainer);

        const tocIcon = document.createElement('div');
        tocIcon.classList.add('toc-icon')
        tocIcon.style.color = '#666';
        tocIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h18v2H4zm0 6h18v2H4zM26 6h2v2h-2zm0 6h2v2h-2zm0 6h2v2h-2zm0 6h2v2h-2z"/></svg>'

        tocContainer.appendChild(tocIcon)
        $('.toc-icon').find('svg').css({ width: '36px', height: '36px', padding: '6px' })

        const tocTitle = document.createElement('h3');
        tocTitle.innerText = 'Questions';
        tocTitle.style.fontSize = '16px';
        tocTitle.style.marginTop = '0';
        tocTitle.style.marginBottom = '10px';
        tocTitle.style.color = '#333';
        tocContainer.appendChild(tocTitle);

        const tocList = document.createElement('ul');
        tocList.style.listStyleType = 'none';
        tocList.style.paddingLeft = '0';
        tocList.style.margin = '0';
        tocContainer.appendChild(tocList);

        $('#toc-container').hover(
            function () {
                $(this).css({ overflow: 'auto' }).animate({ width: '240px', height: '400px', padding: '8px 12px' }, 100);
                $(this).find('.toc-icon').css({ display: 'none' })
            }, function () {
                $(this).css({ overflow: 'hidden' }).animate({ width: '36px', height: '36px', padding: '0px' }, 100);
                $(this).find('.toc-icon').css({ display: 'block' })
            })

        function updateTOC() {
            tocList.innerHTML = ''; // Clear the list
            let questions = document.querySelectorAll('.whitespace-pre-wrap'); // Modify this to suit the selector of the questions in ChatGPT

            questions && questions.forEach((question, index) => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '8px';
                listItem.style.textOverflow = 'ellipsis';
                listItem.style.overflow = 'hidden';
                listItem.style.whiteSpace = 'nowrap';

                const questionLink = document.createElement('a');
                questionLink.href = '#';
                questionLink.innerText = `${index + 1}. ${question.innerText}`;
                questionLink.title = `${question.innerText}`;
                questionLink.style.textDecoration = 'none';
                questionLink.style.color = '#007bff';
                questionLink.style.cursor = 'pointer';

                // Scroll to the question when clicked
                questionLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    question.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });

                listItem.appendChild(questionLink);
                tocList.appendChild(listItem);
            });
        }

        // Update TOC whenever a new message is added
        const observer = new MutationObserver(() => {
            updateTOC();
        });

        const chatContainer = document.querySelector('main'); // Modify if necessary based on actual ChatGPT layout
        if (chatContainer) {
            observer.observe(chatContainer, { childList: true, subtree: true });
        }

        // Initial TOC population
        updateTOC();
    }, 1000)


})();
