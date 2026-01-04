// ==UserScript==
// @name:vi Mega.nz File Sorter (Size & Type)
// @name:en Mega.nz File Sorter (Size & Type)
// @name Mega.nz File Sorter (Size & Type)
// @namespace    https://greasyfork.org/vi/users/1195312-renji-yuusei
// @version 0.6
// @description:vi Thêm nút sắp xếp theo kích thước và loại tệp trên mega.nz
// @description:en Add buttons to sort by size and file type on mega.nz
// @description Add buttons to sort by size and file type on mega.nz
// @author JethaLal_420 (modified by RenjiYuusei)
// @match https://mega.nz/folder/*
// @icon https://www.google.com/s2/favicons?domain=mega.nz
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519869/Meganz%20File%20Sorter%20%28Size%20%20Type%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519869/Meganz%20File%20Sorter%20%28Size%20%20Type%29.meta.js
// ==/UserScript==

(function() {
'use strict';

// Global variable declarations
let listViewBtn, blockViewBtn, sortBySizeBtn, sortByTypeBtn;

// Function to create button with enhanced properties
const createBtn = (text, id, onClick) => {
    const button = document.createElement('button');
    Object.assign(button, {
        innerHTML: text,
        id: id,
        className: 'mega-sort-btn',
        style: `
            padding: 8px 12px;
            margin: 0 5px;
            border-radius: 4px;
            background: #ff0000;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        `
    });
    button.addEventListener('click', onClick);
    button.addEventListener('mouseover', () => button.style.opacity = '0.8');
    button.addEventListener('mouseout', () => button.style.opacity = '1');
    return button;
};

// Function to sort by size with better error handling
const sortBySize = async () => {
    try {
        listViewBtn.click();
        const sizeBtn = await waitForElement('.size', 5000); // Wait up to 5 seconds
        if (sizeBtn) {
            sizeBtn.click();
            setTimeout(() => sizeBtn.click(), 100); // Second click for descending order
        }
        blockViewBtn.click();
    } catch (error) {
        console.error('Error sorting by size:', error);
        alert('Unable to sort by size. Please try again.');
    }
};

// Function to sort by type with better error handling
const sortByType = async () => {
    try {
        listViewBtn.click();
        const typeBtn = await waitForElement('.type', 5000);
        if (typeBtn) {
            typeBtn.click();
        }
        blockViewBtn.click();
    } catch (error) {
        console.error('Error sorting by type:', error);
        alert('Unable to sort by type. Please try again.');
    }
};

// Utility function to wait for element to appear in DOM
const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found after ${timeout}ms`));
        }, timeout);
    });
};

// Function to check and insert buttons with better error handling
const checkAndInsertBtns = async () => {
    try {
        listViewBtn = document.querySelector('.listing-view');
        blockViewBtn = document.querySelector('.block-view');

        if (listViewBtn && blockViewBtn && !sortBySizeBtn) {
            const parentNode = document.querySelector('.fm-breadcrumbs-wrapper');
            const childNode = document.querySelector('.fm-breadcrumbs-block');

            if (!parentNode || !childNode) {
                throw new Error('Button insertion location not found');
            }

            sortBySizeBtn = createBtn('Sort by Size', 'sortbysize', sortBySize);
            sortByTypeBtn = createBtn('Sort by Type', 'sortbytype', sortByType);

            parentNode.insertBefore(sortBySizeBtn, childNode);
            parentNode.insertBefore(sortByTypeBtn, childNode);
        }
    } catch (error) {
        console.error('Error initializing buttons:', error);
    }
};

// Create observer and initialize
try {
    const observer = new MutationObserver(checkAndInsertBtns);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    checkAndInsertBtns();
} catch (error) {
    console.error('Error initializing observer:', error);
}

})();