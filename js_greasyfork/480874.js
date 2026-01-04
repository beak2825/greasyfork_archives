// ==UserScript==
// @name Easy Markdown for StackExchange
// @name:zh-CN 在StackExchange中显示Markdown
// @version 2.4
// @author Murphy Lo (http://github.com/MurphyLo)
// @description Adds "Markdown" and "Copy" buttons to display original Markdown content in StackExchange sites.
// @description:zh-CN 在StackExchange网站上添加“Markdown”和“Copy”按钮，以显示原始Markdown内容
// @license GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @match https://*.stackoverflow.com/questions/*
// @match https://*.superuser.com/questions/*
// @match https://*.serverfault.com/questions/*
// @match https://*.stackexchange.com/questions/*
// @match https://*.askubuntu.com/questions/*
// @match https://*.math.stackexchange.com/questions/*
// @match https://*.tex.stackexchange.com/questions/*
// @match https://*.english.stackexchange.com/questions/*
// @match https://*.gaming.stackexchange.com/questions/*
// @match https://*.physics.stackexchange.com/questions/*
// @match https://*.chemistry.stackexchange.com/questions/*
// @match https://*.biology.stackexchange.com/questions/*
// @match https://*.programmers.stackexchange.com/questions/*
// @match https://*.electronics.stackexchange.com/questions/*
// @grant none
// @namespace https://greasyfork.org/users/1224148
// @downloadURL https://update.greasyfork.org/scripts/480874/Easy%20Markdown%20for%20StackExchange.user.js
// @updateURL https://update.greasyfork.org/scripts/480874/Easy%20Markdown%20for%20StackExchange.meta.js
// ==/UserScript==

// This script is a modified version of an original script by Manish Goregaokar (http://stackapps.com/users/10098/manishearth)
// Original script: https://github.com/Manishearth/Manish-Codes/raw/master/StackExchange/PrintPost.user.js
// The original script is licensed under the GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// Modifications made by Murphy Lo

(async function() {
    'use strict';

    // Function to fetch content of a post
    async function fetchMarkdown(postId) {
        const response = await fetch(`/posts/${postId}/edit-inline`);
        // Check user login status.
        if (response.status === 404) {
            return "--- Please LOG IN StackExchange/Stackoverflow to view and copy the Markdown content. ---";
        }

        const data = await response.text();
        let markdown = data.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/)[1];
        // Decode HTML entities
        return decodeHtmlEntities(markdown);
    }

    // Function to decode HTML entities from the content into Markdown plain text
    function decodeHtmlEntities(str) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = str;
        return tempElement.textContent;
    }

    // Function to show markdown content in a modal
    function showMarkdown(event) {
        // Prevent the default action
        event.preventDefault();

        // Disable scrolling on the main page
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        // Add paddingRight to fixed positioned elements
        const fixedElements = document.querySelectorAll('header.s-topbar');
        fixedElements.forEach(el => el.style.paddingRight = `${scrollbarWidth}px`);

        // Create a modal to display the markdown (updated style)
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            z-index: 5051;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: none;
            background-color: rgba(0,0,0,0.5);`;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #FFF;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 70%;
            max-height: 90%;
            overflow-y: auto;
            box-sizing: border-box;
            border-radius: 5px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);`;

        // Updated close button style
        const closeButton = document.createElement('span');
        closeButton.style.cssText = `
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            margin-left: 10px;`;
        closeButton.textContent = '✕';
        closeButton.onmouseover = () => closeButton.style.color = 'black';
        closeButton.onmouseout = () => closeButton.style.color = '#aaa';

        const markdownElement = document.createElement('pre');
        markdownElement.style.cssText = `
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-y: auto;`;
        markdownElement.textContent = this.markdownContent;

        modalContent.appendChild(closeButton);
        modalContent.appendChild(markdownElement);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal behaviors
        function closeModal() {
            // Removing the modal from the DOM
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleKeyDown);

            // Re-enable scrolling on the main page and remove the paddingRight
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            // Remove paddingRight from fixed positioned elements
            const fixedElements = document.querySelectorAll('header.s-topbar');
            fixedElements.forEach(el => el.style.paddingRight = '');
        }

        // Click `x` to close modal
        closeButton.onclick = closeModal;
        // Press `Esc` to close modal
        const handleKeyDown = (event) => event.keyCode === 27 && closeModal(); // 27 is the keyCode for the Esc key
        document.addEventListener('keydown', handleKeyDown);
        // Click modal background to close modal
        modal.onclick = (e) => e.target === modal && closeModal();
    }

    // Function to copy text to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            // console.log('Markdown content copied to clipboard');
        } catch (err) {
            console.error('Failed to copy Markdown content: ', err);
        }
    }

    // Add "Markdown" and "Copy" buttons to each post
    const posts = document.querySelectorAll('.question, .answer');
    for (const post of posts) {
        const postMenu = post.querySelector('.d-flex.gs8.s-anchors.s-anchors__muted.fw-wrap');
        const separator = document.createElement('span');
        separator.className = 'lsep';
        separator.textContent = '|';
        postMenu.appendChild(separator);

        // Add Markdown button
        const printButton = document.createElement('a');
        printButton.href = '#';
        printButton.textContent = 'Markdown';
        printButton.title = 'View this post\'s Markdown content';
        printButton.onclick = showMarkdown;
        printButton.style.cssText = `
            background-color: #f5f5f5;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;`;
        printButton.onmouseover = () => printButton.style.backgroundColor = '#e0e0e0';
        printButton.onmouseout = () => printButton.style.backgroundColor = '#f5f5f5';

        const printButtonWrapper = document.createElement('div');
        printButtonWrapper.className = 'flex--item';
        printButtonWrapper.appendChild(printButton);

        postMenu.appendChild(printButtonWrapper);

        // Add Copy button
        const copyButton = document.createElement('a');
        copyButton.href = '#';
        copyButton.textContent = 'Copy';
        copyButton.title = 'Copy this post\'s Markdown content to clipboard';
        copyButton.onclick = (event) => {
            event.preventDefault();
            copyToClipboard(printButton.markdownContent);
            copyButton.textContent = 'Copied!';
            setTimeout(() => copyButton.textContent = 'Copy', 2000);
        };
        copyButton.style.cssText = `
            background-color: #f5f5f5;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 5px;
            transition: background-color 0.3s;`;
        copyButton.onmouseover = () => copyButton.style.backgroundColor = '#e0e0e0';
        copyButton.onmouseout = () => copyButton.style.backgroundColor = '#f5f5f5';

        const copyButtonWrapper = document.createElement('div');
        copyButtonWrapper.className = 'flex--item';
        copyButtonWrapper.appendChild(copyButton);

        postMenu.appendChild(copyButtonWrapper);

        // Fetch and store markdown content
        const postId = post.dataset.questionid || post.dataset.answerid;
        printButton.markdownContent = await fetchMarkdown(postId);
    }
})();
