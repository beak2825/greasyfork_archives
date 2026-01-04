// ==UserScript==
// @name         Randomus.ru
// @version      0.4
// @match        *://randomus.ru/*
// @run-at       document-start
// @description  Predictable number generation for Randomus.ru (https://randomus.ru)
// @author       Kaimi
// @homepage     https://kaimi.io/
// @license      GPLv3
// @namespace https://greasyfork.org/users/228137
// @downloadURL https://update.greasyfork.org/scripts/499729/Randomusru.user.js
// @updateURL https://update.greasyfork.org/scripts/499729/Randomusru.meta.js
// ==/UserScript==

// Initialize or retrieve persisted desired_numbers array
let storedNumbers = localStorage.getItem("desired_numbers");
let desired_numbers = storedNumbers ? JSON.parse(storedNumbers) : [62, 2, 39, 52, 335, 264];

var debug = false;
const selector = "p.subtitle.is-7.mb-3";

var num_from;
var num_to;
var button;
var file_path = undefined;

// Ensure the menu item is added after page load
window.addEventListener("load", () => {
    addMenuItem();

    num_from = document.getElementById('num_from').value;
    num_to = document.getElementById('num_to').value;
    button = document.getElementsByTagName('button')[0];

    onPageLoad();
}, false);

// Function to insert new menu item in the navbar (both desktop and mobile)
function addMenuItem() {
    // Check for desktop version (.navbar-dropdown)
    var dropdown = document.querySelector('.navbar-dropdown');
    
    if (dropdown) {
        // Desktop version found, add item to the dropdown
        insertMenuItem(dropdown);
    } else {
        // Check for mobile version (.navbar-menu and .navbar-burger)
        var burgerMenu = document.querySelector('.navbar-burger');
        var mobileMenu = document.querySelector('.navbar-menu');

        if (burgerMenu && mobileMenu) {
            // Ensure mobile menu is visible before adding menu item
            burgerMenu.addEventListener('click', () => {
                setTimeout(() => {
                    insertMenuItem(mobileMenu);
                }, 500); // Small delay to allow the menu to fully load
            });
        } else {
            console.error('Neither desktop nor mobile menu found.');
        }
    }
}

// Function to create and insert the new menu item
function insertMenuItem(parentElement) {
    // Create the new menu item
    const newMenuItem = document.createElement('a');
    newMenuItem.classList.add('navbar-item');
    newMenuItem.innerHTML = `
        <span class="icon">
            <svg class="svg-inline--fa fa-pencil-alt" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pencil-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                <path fill="currentColor" d="M497.9 142.1l-46.1-46.1c-12.5-12.5-32.8-12.5-45.3 0l-56 56 91.4 91.4 56-56c12.5-12.6 12.5-32.8 0-45.3zm-124 124L130.6 510.3c-3.6 3.6-8.2 6.4-13.3 8.1L9.4 511.9c-10.9 3.6-22.3-7.7-18.7-18.7l7.4-107.9c1.6-5.1 4.4-9.7 8.1-13.3L245.9 138l91.4 91.4-63.7 63.7 71.9 71.9z"></path>
            </svg>
        </span> Edit Desired Numbers`;

    // Add click event to prompt for editing desired_numbers
    newMenuItem.addEventListener('click', () => {
        const input = prompt("Enter the desired numbers (comma-separated):", desired_numbers.join(", "));
        if (input !== null) {
            desired_numbers = input.split(',').map(Number).filter(n => !isNaN(n));
            localStorage.setItem("desired_numbers", JSON.stringify(desired_numbers));
            alert("Desired numbers updated!");
        }
    });

    // Append the new item to the parent element
    parentElement.appendChild(newMenuItem);
}

async function onPageLoad() {
    // Replace first-pass image
    var resultImg = document.getElementById('result_main_image');

    if (resultImg && desired_numbers.length > 0) {
        show_loader("Генерируем результаты");
        resultImg.src = '';

        // Actual image
        await replaceImage();
        hide_loader();
    }
}

async function replaceImage() {
    if (debug) {
        logVariable({ desired_numbers });
        logVariable({ num_from });
        logVariable({ num_to });
    }

    var resultImg = document.getElementById('result_main_image');

    if (resultImg) {
        // If there's an existing blob URL, revoke it
        if (resultImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(resultImg.src);
        }

        var number = desired_numbers.shift();
        localStorage.setItem("desired_numbers", JSON.stringify(desired_numbers));

        var imageSrc = await processImages(number, num_from, num_to);
        resultImg.src = imageSrc;

        // Add event listener to clean up the blob URL when the image is no longer needed
        resultImg.onload = () => {
            resultImg.classList.remove('fade');
            // Optional: if you want to revoke immediately after load
            // URL.revokeObjectURL(imageSrc);
        };

        appendTimestampToElement(file_path, selector);
    }
}

async function fetchHtml(url) {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, 'text/html');
}

function extractImagePath(doc) {
    const aTag = doc.querySelector('a[download]') || {};
    return aTag.href || null;
}

function loadImage(url) {
    if (debug) {
        logVariable({ url });
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processImages(want, from, to) {
    // Construct URLs for fetching the images
    const firstUrl = '/quick?from=' + want + '&to=' + want + '&count=1';
    const secondUrl = '/quick?from=' + from + '&to=' + to + '&count=1';

    // Optionally log URLs for debugging
    if (debug) {
        logVariable({ firstUrl });
        logVariable({ secondUrl });
    }

    // Some delay because of the server
    await delay(1000);


    // Fetch and load the first image
    let doc = await fetchHtml(firstUrl);
    let imagePath = extractImagePath(doc);
    const firstImage = await loadImage(imagePath);

    file_path = imagePath;

    // Fetch and load the second image
    doc = await fetchHtml(secondUrl);
    imagePath = extractImagePath(doc);
    const secondImage = await loadImage(imagePath);

    // Create a canvas element and get the drawing context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    const width = firstImage.width;
    const height = firstImage.height;
    canvas.width = width;
    canvas.height = height;

    // Draw the first image from height 0 to 400
    ctx.drawImage(firstImage, 0, 0, width, 400, 0, 0, width, 400);

    // Draw the second image from height 400 to 500
    ctx.drawImage(secondImage, 0, 400, width, 100, 0, 400, width, 100);

    // Draw the first image from height 500 to the rest of the canvas
    ctx.drawImage(firstImage, 0, 500, width, height - 500, 0, 500, width, height - 500);

    // Return the resulting image as a data URL
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
            }
            const url = URL.createObjectURL(blob);
            resolve(url);
        }, 'image/png');
    });
}

function appendTimestampToElement(filePath, selector) {
    const timestamp = parseTimestamp(filePath);
    if (!timestamp) return;

    const targetElement = document.querySelector(selector);
    if (!targetElement) {
        console.error("Target element not found.");
        return;
    }

    const textNode = Array.from(targetElement.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('в'));
    if (!textNode) {
        console.error("Text node containing date not found.");
        return;
    }

    textNode.textContent = timestamp;
}

function parseTimestamp(filePath) {
    const timestampMatch = filePath.match(/quickw_(\d+)_/);
    if (!timestampMatch) {
        console.error("Timestamp not found in the given string.");
        return null;
    }

    const timestamp = parseInt(timestampMatch[1], 10) * 1000;
    const date = new Date(timestamp);

    const optionsDate = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const formattedDate = date.toLocaleDateString('ru-RU', optionsDate);
    const formattedTime = date.toLocaleTimeString('ru-RU', optionsTime);

    return `${formattedDate} в ${formattedTime}`;
}

function logVariable(varObj) {
    const timestamp = new Date().toISOString();
    const varName = Object.keys(varObj)[0];
    const varValue = varObj[varName];
    const varType = typeof varValue;

    console.log(`[${timestamp}] ${varName} (${varType}):`, varValue);
}

