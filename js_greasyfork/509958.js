// ==UserScript==
// @name         VukaX
// @namespace    http://VukaX.net/
// @version      1.4.4.5
// @description  Poboljšano iskustvo na Vukajliji
// @match        https://vukajlija.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @connect      catbox.moe
// @connect      goalfullmatch.top
// @connect script.google.com
// @connect script.googleusercontent.com
// @author       Tsar
// @downloadURL https://update.greasyfork.org/scripts/509958/VukaX.user.js
// @updateURL https://update.greasyfork.org/scripts/509958/VukaX.meta.js
// ==/UserScript==




/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 197:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.displayGrobljeDefinitions = displayGrobljeDefinitions;
/**
 * Fetches and displays definitions from the "Groblje" section using GM.xmlHttpRequest.
 */
function displayGrobljeDefinitions() {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.location.pathname === '/') {
            try {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: 'https://vukajlija.com/groblje/definicije',
                    onload: (response) => {
                        if (response.status !== 200) {
                            console.error('Failed to fetch definitions:', response.status);
                            return;
                        }
                        // Parse the response HTML
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const definitions = doc.querySelectorAll('[id^="definition_"]');
                        const definitionsToDisplay = Array.from(definitions).slice(0, 5);
                        // Create a container for the definitions
                        const container = document.createElement('div');
                        container.className = 'bg-primary-alt-1 rounded-xl text-primary-content-dimmed p-4 mb-6';
                        container.style.marginTop = '20px';
                        const title = document.createElement('h3');
                        title.className = 'text-primary-content uppercase font-bold font-victor mb-4 tracking-wider';
                        title.textContent = 'Definicije sa Groblja';
                        container.appendChild(title);
                        definitionsToDisplay.forEach(def => {
                            var _a, _b, _c, _d;
                            const defTitle = (_b = (_a = def.querySelector('h1 a')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : 'No Title';
                            const defLink = (_d = (_c = def.querySelector('h1 a')) === null || _c === void 0 ? void 0 : _c.getAttribute('href')) !== null && _d !== void 0 ? _d : '#';
                            const defElement = document.createElement('div');
                            defElement.className = 'mb-4';
                            const defTitleLink = document.createElement('a');
                            defTitleLink.href = defLink;
                            defTitleLink.textContent = defTitle;
                            defTitleLink.target = '_blank';
                            defElement.appendChild(defTitleLink);
                            container.appendChild(defElement);
                        });
                        // Insert the container into the DOM
                        const radioMoravaElement = document.querySelector('.bg-primary-alt-1.rounded-xl.text-primary-content-dimmed.p-4.mb-6');
                        if (radioMoravaElement === null || radioMoravaElement === void 0 ? void 0 : radioMoravaElement.parentNode) {
                            radioMoravaElement.parentNode.insertBefore(container, radioMoravaElement.nextSibling);
                        }
                    },
                    onerror: (error) => {
                        console.error('Failed to fetch definitions:', error);
                    },
                });
            }
            catch (error) {
                console.error('An unexpected error occurred:', error);
            }
        }
    });
}


/***/ }),

/***/ 992:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pasteQuote = pasteQuote;
const tablerIcon_1 = __webpack_require__(855);
function addSingleQuoteButton(quote, replyInput) {
    var _a, _b, _c;
    const lastPage = ((_c = (_b = (_a = document.querySelectorAll("ul")) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.querySelector('li:last-of-type > a, li:last-of-type > span')) === null || _c === void 0 ? void 0 : _c.textContent) || '1';
    const singleQuoteButton = document.createElement("button");
    singleQuoteButton.style.alignSelf = 'right';
    singleQuoteButton.className = "quote-button";
    singleQuoteButton.innerHTML = tablerIcon_1.iconQuote;
    singleQuoteButton.style.cursor = "pointer";
    singleQuoteButton.type = "button";
    singleQuoteButton.title = "Kliknite da citirate ovu poruku"; // Set tooltip text
    singleQuoteButton.addEventListener("click", () => {
        localStorage.setItem('vukajlija-quote', quote);
        const urlObj = new URL(window.location.href);
        urlObj.searchParams.set('strana', lastPage);
        const url = urlObj.toString();
        if (url !== window.location.href) {
            window.location.href = url; // Navigate to the last page
        }
        else {
            pasteQuote(); // Paste the quote if already on the last page
        }
    });
    return singleQuoteButton;
}
// Function to paste the quote after navigation
function pasteQuote() {
    const quoteNow = localStorage.getItem('vukajlija-quote');
    const replyInputElement = document.querySelector("#post_body");
    if (replyInputElement && quoteNow) {
        replyInputElement.value += quoteNow; // Append the quote to the reply input field
        replyInputElement.scrollIntoView({ behavior: "smooth" }); // Scroll to the reply input field
        replyInputElement.focus(); // Focus on the reply input field
        localStorage.removeItem('vukajlija-quote');
    }
}
function addMultiquoteButtons(quote) {
    const multiquoteButton = document.createElement("button");
    multiquoteButton.className = "multiquote-button";
    multiquoteButton.innerHTML = tablerIcon_1.iconQuoteMulti;
    multiquoteButton.style.cursor = "pointer";
    multiquoteButton.type = "button";
    multiquoteButton.title = "Dodajte ovu poruku u memoriju"; // Set tooltip text
    const removeMultiquoteButton = document.createElement("button");
    removeMultiquoteButton.className = "remove-multiquote-button";
    removeMultiquoteButton.innerHTML = tablerIcon_1.iconQuoteRemove;
    removeMultiquoteButton.style.cursor = "pointer";
    removeMultiquoteButton.type = "button";
    removeMultiquoteButton.style.display = "none"; // Hidden initially
    removeMultiquoteButton.title = "Izbacite ovu poruku iz memorije";
    // Add event listener for multiquote button
    multiquoteButton.addEventListener("click", () => {
        const existingQuotes = JSON.parse(localStorage.getItem("vukajlija-multiquote") || "[]");
        if (!existingQuotes.includes(quote)) {
            existingQuotes.push(quote);
            localStorage.setItem("vukajlija-multiquote", JSON.stringify(existingQuotes));
        }
        multiquoteButton.style.display = "none"; // Hide "Add" button
        removeMultiquoteButton.style.display = "inline"; // Show "Remove" button
    });
    // Add event listener for removing quote from multiquote
    removeMultiquoteButton.addEventListener("click", () => {
        const existingQuotes = JSON.parse(localStorage.getItem("vukajlija-multiquote") || "[]");
        const updatedQuotes = existingQuotes.filter((q) => q !== quote);
        localStorage.setItem("vukajlija-multiquote", JSON.stringify(updatedQuotes));
        removeMultiquoteButton.style.display = "none"; // Hide "Remove" button
        multiquoteButton.style.display = "inline"; // Show "Add" button
    });
    return { multiquoteButton, removeMultiquoteButton };
}
function quoteForumPost() {
    const postsSelector = "#comments > li";
    const replyInputSelector = "textarea";
    const posts = document.querySelectorAll(postsSelector);
    const replyInput = document.querySelector(replyInputSelector);
    posts.forEach((post) => {
        var _a, _b, _c, _d, _e, _f, _g;
        if (post.querySelector('.quote-button') || post.querySelector('.multiquote-button') || post.querySelector('.remove-multiquote-button')) {
            return; // Avoid duplicate buttons
        }
        const author = ((_b = (_a = post.querySelectorAll("div > div")[1].querySelector('div > div > a')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "Unknown Author";
        const timestamp = new Date(((_d = (_c = post.querySelectorAll("div > div")[1].querySelectorAll('div > div > a')[1].querySelector('abbr')) === null || _c === void 0 ? void 0 : _c.title) === null || _d === void 0 ? void 0 : _d.trim()) || '').toLocaleString('sr-RS') || '';
        const content = ((_f = (_e = post.querySelectorAll('div')[0].querySelectorAll('div')[4]) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || "No content";
        const linkElement = post.querySelectorAll("div > div")[1].querySelectorAll('div > div > a')[1];
        const link = ((_g = linkElement === null || linkElement === void 0 ? void 0 : linkElement.href) === null || _g === void 0 ? void 0 : _g.trim()) || '';
        const quote = `CITAT\n[${author}, ${timestamp} | ${link}]\n${content}\nTATIC\n`;
        const singleQuoteButton = addSingleQuoteButton(quote, replyInput);
        const { multiquoteButton, removeMultiquoteButton } = addMultiquoteButtons(quote);
        // Append Buttons to Post
        const replyParent = post.querySelectorAll('div')[0].querySelectorAll('div')[3];
        const quoteSection = document.createElement('div');
        if (replyParent) {
            quoteSection.appendChild(singleQuoteButton);
            quoteSection.appendChild(multiquoteButton);
            quoteSection.appendChild(removeMultiquoteButton);
            quoteSection.style.display = 'flex'; // Enable flexbox
            quoteSection.style.flexDirection = 'row'; // Keep items in a row
            quoteSection.style.justifyContent = 'flex-end'; // Align items to the right
            quoteSection.style.marginLeft = 'auto'; // Push the section to the right
            replyParent.appendChild(quoteSection);
        }
    });
}
exports["default"] = quoteForumPost;


/***/ }),

/***/ 597:
/***/ ((__unused_webpack_module, exports) => {


// src/features/rekliOSajtu.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.radioMorava = radioMorava;
/**
 * Replaces the "Rekli o sajtu" section with "Radio Morava" audio player.
 */
function radioMorava() {
    const divs = document.querySelectorAll('.bg-primary-alt-1.rounded-xl.text-primary-content-dimmed.p-4.mb-6');
    divs.forEach(div => {
        const h3 = div.querySelector('h3');
        if (h3 && h3.textContent && h3.textContent.trim() === 'Rekli o sajtu') {
            div.id = 'radio-morava';
            div.innerHTML = '';
            const newTitle = document.createElement('h3');
            newTitle.className = 'text-primary-content uppercase font-bold font-victor mb-4 tracking-wider';
            newTitle.textContent = 'Radio Morava';
            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.src = 'https://e3.radiomorava.rs/listen/radiomorava/radiomorava128.mp3';
            audioPlayer.style.width = '100%';
            div.appendChild(newTitle);
            div.appendChild(audioPlayer);
        }
    });
}


/***/ }),

/***/ 606:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.displayRssFeed = displayRssFeed;
/**
 * Displays RSS feed items on forum pages using GM.xmlHttpRequest to fetch the feed.
 */
function displayRssFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.location.pathname.startsWith('/forum/')) {
            try {
                // Define the RSS feed URL
                const targetUrl = 'https://goalfullmatch.top/rss.php';
                // Use GM.xmlHttpRequest to fetch the RSS feed
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: targetUrl,
                    onload: (response) => {
                        if (response.status !== 200) {
                            console.error('Failed to fetch the RSS feed:', response.status);
                            return;
                        }
                        // Parse the RSS feed content
                        const parser = new DOMParser();
                        const rssDoc = parser.parseFromString(response.responseText, 'application/xml');
                        const items = rssDoc.querySelectorAll('item');
                        const itemsToDisplay = Array.from(items).slice(0, 20);
                        // Create a container for the RSS feed items
                        const container = document.createElement('div');
                        container.className = 'bg-primary-alt-1 rounded-xl text-primary-content-dimmed p-4 mb-6';
                        container.style.marginTop = '20px';
                        // Create and append the title
                        const title = document.createElement('h3');
                        title.className = 'text-primary-content uppercase font-bold font-victor mb-4 tracking-wider';
                        title.textContent = 'Sportski strimovi';
                        container.appendChild(title);
                        // Iterate over the items and append them to the container
                        itemsToDisplay.forEach((item) => {
                            var _a, _b, _c, _d;
                            const itemTitle = (_b = (_a = item.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : 'No Title';
                            const itemLink = (_d = (_c = item.querySelector('link')) === null || _c === void 0 ? void 0 : _c.textContent) !== null && _d !== void 0 ? _d : '#';
                            const itemElement = document.createElement('div');
                            itemElement.className = 'mb-2';
                            const itemLinkElement = document.createElement('a');
                            itemLinkElement.href = itemLink;
                            itemLinkElement.textContent = itemTitle;
                            itemLinkElement.target = '_blank';
                            itemLinkElement.style.textDecoration = 'none';
                            itemElement.appendChild(itemLinkElement);
                            container.appendChild(itemElement);
                        });
                        // Insert the container into the DOM
                        const referenceElement = document.querySelector('.bg-primary-alt-1.rounded-xl.text-primary-content-dimmed.p-4.mb-6');
                        if (referenceElement === null || referenceElement === void 0 ? void 0 : referenceElement.parentNode) {
                            referenceElement.parentNode.insertBefore(container, referenceElement.nextSibling);
                        }
                        else {
                            // If no reference element exists, append it to the body or another fallback container
                            document.body.appendChild(container);
                        }
                    },
                    onerror: (error) => {
                        console.error('Failed to fetch the RSS feed:', error);
                    },
                });
            }
            catch (error) {
                console.error('An unexpected error occurred:', error);
            }
        }
    });
}


/***/ }),

/***/ 951:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = addUserTooltips;
function addUserTooltips() {
    // Add styles for the tooltip
    const tooltipStyle = `
        .custom-tooltip {
            position: absolute;
            padding: 10px;
            background: #0b2b2b;
            border: 1px solid #ccc;
            border-radius: 20px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            display: none;
            z-index: 1000;
            max-width: 300px;
            overflow: auto;
            font-size: 14px;
            color: white;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = tooltipStyle;
    document.head.appendChild(styleSheet);
    // Create the tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    document.body.appendChild(tooltip);
    const primarySelector = "ol:nth-of-type(1) > li > .flex > span > a > img";
    const fallbackSelector = "ol:nth-of-type(1) > li > div > div > a > img";
    let selectedElement = document.querySelectorAll(primarySelector);
    if (selectedElement.length === 0) {
        selectedElement = document.querySelectorAll(fallbackSelector);
    }
    if (selectedElement.length === 0)
        return;
    let hideTimeout;
    // Add hover event listeners to avatar links
    selectedElement.forEach((link) => {
        if (link && link.parentElement) {
            const href = link.parentElement.getAttribute('href');
            link.addEventListener('mouseover', (event) => __awaiter(this, void 0, void 0, function* () {
                clearTimeout(hideTimeout);
                // Position the tooltip
                const rect = link.getBoundingClientRect();
                tooltip.style.left = `${rect.right + 10}px`;
                tooltip.style.top = `${rect.top}px`;
                tooltip.innerText = 'Učitavam...';
                tooltip.style.display = 'block';
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: href,
                        onload: (response) => {
                            var _a, _b;
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const content = (_b = (_a = doc.querySelector('.flex > div:nth-of-type(3)')) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
                            if (content) {
                                tooltip.innerHTML = content.innerHTML;
                            }
                            else {
                                tooltip.innerText = 'Sadžaj nije pronađen!';
                            }
                        },
                        onerror: () => {
                            tooltip.innerText = 'Greška u preuzimanju sadržaja!';
                        },
                    });
                }
                catch (err) {
                    tooltip.innerText = 'Greška u preuzimanju sadržaja!';
                }
            }));
            link.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 300); // Delay hiding for 300ms
            });
            tooltip.addEventListener('mouseover', () => {
                clearTimeout(hideTimeout);
            });
            tooltip.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 300);
            });
        }
    });
}


/***/ }),

/***/ 927:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Import modules
const modal_1 = __webpack_require__(382);
const modifyUi_1 = __webpack_require__(767);
const tooltip_1 = __webpack_require__(892);
const settingsButton_1 = __webpack_require__(306);
const postSection_1 = __webpack_require__(302);
const rssFeed_1 = __webpack_require__(606);
const radioMorava_1 = __webpack_require__(597);
const grobljeDefinitions_1 = __webpack_require__(197);
const quotePost_1 = __importDefault(__webpack_require__(992));
const userTooltips_1 = __importDefault(__webpack_require__(951));
const quotePost_2 = __webpack_require__(992);
const mediaEmbed_1 = __webpack_require__(893);
const shortcuts_1 = __webpack_require__(625);
const typingIndicator_1 = __webpack_require__(298);
const observePages_1 = __webpack_require__(492);
const poster_1 = __webpack_require__(501);
const settingsModal_1 = __webpack_require__(320);
const localStorage_1 = __webpack_require__(800);
const mediaEmbed_2 = __webpack_require__(893);
// Entry point for the script
window.addEventListener('load', () => {
    var _a;
    console.log('VukaX script is loading...');
    (0, settingsButton_1.addSettingsButton)();
    (0, settingsModal_1.injectSettingsModal)();
    (0, quotePost_2.pasteQuote)();
    const settings = (0, localStorage_1.loadSettings)();
    // Inject and set up the modal for displaying images
    (0, modal_1.injectModal)();
    (0, modal_1.setupModalClose)();
    const currentAuthor = ((_a = document.querySelectorAll('#profile-menu > div > div > div')[1].querySelector('a')) === null || _a === void 0 ? void 0 : _a.textContent) || 'Unknown';
    if (currentAuthor != 'Unknown' && (settings.postersGenerator || settings.postersGenerator === undefined)) {
        (0, poster_1.loadPosters)();
    }
    if (settings.userTooltips || settings.userTooltips === undefined) {
        (0, userTooltips_1.default)();
    }
    if (settings.uploadButton || settings.uploadButton === undefined) {
        (0, postSection_1.initializePostButtons)();
    }
    if (settings.quotePosts || settings.quotePosts === undefined) {
        (0, quotePost_1.default)();
    }
    if (settings.modifyUI || settings.modifyUI === undefined) {
        (0, modifyUi_1.modifyUi)();
        (0, observePages_1.observeChat)();
        (0, observePages_1.observeForum)();
    }
    // Conditionally initialize features based on user settings
    if (settings.grobljeDefinitions || settings.grobljeDefinitions === undefined) {
        (0, grobljeDefinitions_1.displayGrobljeDefinitions)();
    }
    if (settings.radioMorava || settings.radioMorava === undefined) {
        (0, radioMorava_1.radioMorava)();
    }
    if (settings.rssFeed || settings.rssFeed === undefined) {
        (0, rssFeed_1.displayRssFeed)();
    }
    if (settings.embedMedia || settings.embedMedia === undefined) {
        document.querySelectorAll('a').forEach(mediaEmbed_1.embedMedia);
        (0, mediaEmbed_2.addGenericEmbeds)();
    }
    if (settings.shortcuts || settings.shortcuts === undefined) {
        (0, tooltip_1.addKeyboardShortcutTooltip)();
        // Add keyboard shortcuts for navigation and interactions
        document.addEventListener('keydown', shortcuts_1.addShortcuts);
    }
    if (settings.typingIndicator) {
        // Set up the typing indicator if the global object is available
        const App = unsafeWindow.App; // Define unsafeWindow globally in your types
        if (App) {
            (0, typingIndicator_1.overrideTypingHandler)(App);
        }
        else {
            console.warn('App object not found. Typing indicator won’t be initialized.');
        }
    }
    console.log('VukaX script successfully initialized.');
});


/***/ }),

/***/ 269:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultSettings = void 0;
exports.defaultSettings = {
    postersGenerator: true,
    modifyUI: true,
    grobljeDefinitions: true,
    radioMorava: true,
    rssFeed: true,
    shortcuts: true,
    typingIndicator: true,
    embedMedia: true,
    uploadButton: true,
    quotePosts: true,
    userTooltips: true,
    // Set defaults for other features
};


/***/ }),

/***/ 382:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.injectModal = injectModal;
exports.setupModalClose = setupModalClose;
function injectModal() {
    const modalHTML = `
        <div id="imageModal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.8);">
            <span id="closeModal" style="position:absolute; top:20px; right:35px; color:#fff; font-size:40px; font-weight:bold; cursor:pointer;">&times;</span>
            <img id="modalImage" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); max-width:90%; max-height:90%;">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
function setupModalClose() {
    const modal = document.getElementById('imageModal');
    const closeModal = document.getElementById('closeModal');
    if (modal && closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    else {
        console.error('Modal elements not found.');
    }
}


/***/ }),

/***/ 767:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.modifyUi = modifyUi;
const themeToggle_1 = __webpack_require__(226);
function modifyUi() {
    if (window.innerWidth >= 768) {
        styleMainMenu();
    }
    const header = getElement('body > div > div.flex.space-x-2.pr-5.lg\\:pl-8.text-secondary-content');
    const mainMenu = getElement('#main-menu');
    const mainSection = getElement('body > div > div.flex-1.overflow-hidden.flex.flex-row > div.flex-1.overflow-auto.h-full.p-4.md\\:p-8.md\\:pb-0.pb-0.lg\\:rounded-tl-3xl.bg-primary');
    const logoText = getElement('body > div > div.flex.space-x-2.pr-5.lg\\:pl-8.text-secondary-content > div.flex-1.text-5xl.text-shadow-thick.flex.flex-row.align-baseline a');
    const mainImage = getElement('#main-menu > a > img');
    const avatar = getElement('#profile-menu-toggle');
    const lightToggle = getElement('#theme-light-toggle');
    const darkToggle = getElement('#theme-dark-toggle');
    const searchForm = getElement('form');
    if (mainSection) {
        mainSection.classList.remove('lg:rounded-tl-3xl');
    }
    if (header && logoText && mainImage && avatar && mainMenu) {
        setupHeader(header, logoText, mainImage, avatar, mainMenu, lightToggle, darkToggle);
        setupMainMenu(mainMenu, searchForm, mainImage, header);
    }
    else {
        console.error('One or more elements for UI modification were not found.');
    }
    updateUserIcons();
}
// Helper function to safely query an element
function getElement(selector) {
    return document.querySelector(selector);
}
// Setup header modifications
function setupHeader(header, logoText, mainImage, avatar, mainMenu, lightToggle, darkToggle) {
    logoText.textContent = 'VukaX';
    logoText.style.display = 'block';
    (0, themeToggle_1.moveThemeToggle)(lightToggle, darkToggle, header);
    if (window.innerWidth >= 900) {
        mainImage.style.width = '3rem';
        mainImage.style.padding = '.1rem';
        if (mainImage.parentElement) {
            header.insertBefore(mainImage.parentElement, logoText.parentElement);
        }
        observeThemeToggle(lightToggle, darkToggle, header);
    }
}
// Setup main menu modifications for smaller screens
function setupMainMenu(mainMenu, searchForm, mainImage, header) {
    if (window.innerWidth < 900 && searchForm) {
        searchForm.style.display = 'block';
        const span = searchForm.querySelector('span');
        if (span) {
            span.style.display = 'block';
            span.classList.remove("relative", "left-8", "mt-1.5", "z-20", "text-secondary");
            span.style.position = 'absolute'; // Make the span position relative to the input field
            span.style.left = '-20px'; // Adjust horizontal alignment inside the input
            span.style.top = '50%'; // Vertically center it inside the input
            span.style.transform = 'translateY(-50%)'; // Ensure proper centering
            span.style.zIndex = '10'; // Place it above other elements if necessary
            span.style.color = 'black'; // Optional: Adjust text color
            span.style.pointerEvents = 'none'; // Prevent the span from blocking input clicks
            const searchIcon = span.querySelector('svg');
            if (searchIcon) {
                span.style.color = 'darkgreen';
            }
        }
        if (mainImage.parentElement) {
            mainMenu.insertBefore(searchForm, mainImage.parentElement.nextSibling);
        }
        adjustSearchFormInput(searchForm);
        centerMainMenu(mainMenu);
    }
}
// Observe theme toggle visibility changes
function observeThemeToggle(lightToggle, darkToggle, header) {
    const observer = new MutationObserver(() => {
        (0, themeToggle_1.moveThemeToggle)(lightToggle, darkToggle, header);
    });
    if (lightToggle)
        observer.observe(lightToggle, { attributes: true, attributeFilter: ['class'] });
    if (darkToggle)
        observer.observe(darkToggle, { attributes: true, attributeFilter: ['class'] });
}
// Adjust input styling within the search form
function adjustSearchFormInput(searchForm) {
    const searchFormInput = searchForm.querySelector('form input[id="q"]');
    if (searchFormInput) {
        searchFormInput.classList.remove('w-80');
        searchFormInput.style.width = '100%';
        searchFormInput.style.textAlign = 'left';
        searchFormInput.classList.remove('rounded-full');
    }
}
// Center align main menu elements
function centerMainMenu(mainMenu) {
    mainMenu.style.alignContent = 'center';
    mainMenu.style.justifyContent = 'center';
    mainMenu.style.alignItems = 'center';
}
// Update user icons' styles
function updateUserIcons() {
    const userIcons = document.querySelectorAll('img.rounded-full');
    userIcons.forEach((icon) => {
        icon.classList.replace('rounded-full', 'rounded-m');
        icon.classList.replace('p-2', 'p-1');
        icon.style.transition = 'none';
    });
}
function styleMainMenu() {
    const mainMenu = document.querySelector('#main-menu') || null;
    const mainMenuParent = (mainMenu === null || mainMenu === void 0 ? void 0 : mainMenu.parentElement) || null;
    const navMenu = (mainMenu === null || mainMenu === void 0 ? void 0 : mainMenu.querySelector("nav")) || null;
    const navMenuItems = (navMenu === null || navMenu === void 0 ? void 0 : navMenu.querySelectorAll("ul > li > a")) || null;
    if (mainMenu && mainMenuParent) {
        mainMenu.classList.remove('bg-gradient-to-b', 'from-secondary', 'to-primary');
        mainMenu.classList.add('bg-primary');
        mainMenuParent.style.borderRight = '1px solid darkcyan';
        if (navMenuItems) {
            navMenuItems.forEach((item) => {
                item.classList.replace('text-secondary-content-dimmed', 'text-secondary');
            });
        }
    }
}


/***/ }),

/***/ 302:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addUploadButton = addUploadButton;
exports.initializePostButtons = initializePostButtons;
const tablerIcon_1 = __webpack_require__(855);
const upload_1 = __importDefault(__webpack_require__(725));
function addUploadButton() {
    var _a, _b;
    const form = document.querySelector('#new_post');
    const submitButton = form === null || form === void 0 ? void 0 : form.querySelector('input[type="submit"][value="Pošalji"]');
    const messageInput = document.querySelector('#message-input');
    const postBody = document.querySelector('#post_body');
    // File input setup
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    // Upload button creation
    const uploadButton = document.createElement('button');
    uploadButton.innerHTML = tablerIcon_1.iconUpload;
    uploadButton.id = "upload-button";
    uploadButton.classList.add('text-white', 'px-3', 'py-2', 'bg-accent', 'hover:bg-action', 'rounded-lg', 'text-sm', 'mx-8');
    uploadButton.type = 'button'; // Prevent form submission
    // Drag-and-Drop Setup
    const handleFileUpload = (file) => __awaiter(this, void 0, void 0, function* () {
        if (!file)
            return;
        try {
            const fileLink = yield (0, upload_1.default)(file);
            if (fileLink) {
                if (messageInput) {
                    messageInput.value += messageInput.value ? ` ${fileLink}` : fileLink;
                }
                if (postBody) {
                    postBody.value += postBody.value ? `\n ${fileLink}` : fileLink;
                }
            }
        }
        catch (error) {
            console.error('Error uploading file:', error);
        }
    });
    const handleFiles = (files) => {
        Array.from(files).forEach((file) => handleFileUpload(file));
    };
    const addDragAndDrop = (elements) => {
        elements.forEach((element) => {
            if (!element) {
                console.error('Drag-and-drop element is null or undefined.');
                return;
            }
            element.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                element.style.border = '2px dashed #00bfff'; // Visual feedback
            });
            element.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                element.style.border = ''; // Remove visual feedback
            });
            element.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                element.style.border = ''; // Remove visual feedback
                if (e.dataTransfer) {
                    handleFiles(e.dataTransfer.files);
                }
            });
        });
    };
    // Clipboard Setup
    const handlePaste = (e) => {
        var _a;
        const items = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.items;
        if (items) {
            Array.from(items).forEach((item) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file)
                        handleFileUpload(file);
                }
            });
        }
    };
    if (messageInput) {
        messageInput.addEventListener('paste', handlePaste);
    }
    if (postBody) {
        postBody.addEventListener('paste', handlePaste);
    }
    if (form && submitButton) {
        const submitSection = document.createElement('div');
        submitSection.id = 'submitSection';
        submitSection.appendChild(submitButton);
        submitSection.style.width = '100%';
        submitSection.style.display = 'flex';
        submitSection.style.flexDirection = 'row';
        submitSection.style.gap = '5%';
        submitSection.style.justifyContent = 'flex-start';
        submitSection.style.alignItems = 'center';
        (_a = postBody === null || postBody === void 0 ? void 0 : postBody.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(submitSection, postBody.nextSibling);
        // Add drag-and-drop functionality to both submitSection and postBody
        addDragAndDrop([submitSection, postBody]);
    }
    else if (messageInput) {
        const messageSection = document.createElement('div');
        messageSection.id = 'messageSection';
        const messageSectionInner = document.createElement('div');
        messageSectionInner.id = 'messageSectionInner';
        (_b = messageInput.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(messageSection, messageInput);
        messageSectionInner.appendChild(messageInput);
        messageSection.appendChild(messageSectionInner);
        messageSection.style.width = '100%';
        messageSection.style.display = 'flex';
        messageSection.style.flexDirection = 'column';
        messageSection.style.justifyContent = 'center';
        messageSection.style.alignItems = 'center';
        messageSectionInner.style.width = '90%';
        messageSectionInner.style.display = 'flex';
        messageSectionInner.style.flexDirection = 'row';
        messageInput.style.flexGrow = '1';
        uploadButton.style.flexGrow = '0';
        messageSectionInner.style.justifyContent = 'center';
        messageSectionInner.style.alignItems = 'center';
        messageSectionInner.style.gap = '5%';
        // Add drag-and-drop functionality to both messageSection and postBody
        addDragAndDrop([messageSection, postBody]);
        messageInput.addEventListener('paste', handlePaste);
    }
    else {
        console.error('Form or message input not found, unable to add upload button.');
        return;
    }
    // File input click handler
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });
    fileInput.addEventListener('change', (e) => {
        const target = e.target;
        if (target.files) {
            handleFiles(target.files);
        }
    });
    return uploadButton;
}
function addFinalizeMultiquoteButton() {
    const replyInputSelector = "textarea";
    const replyInput = document.querySelector(replyInputSelector);
    ///SAMO NA FORUMU!
    if (replyInput) {
        const finalizeMultiquoteButton = document.createElement("button");
        finalizeMultiquoteButton.classList.add('text-white', 'px-3', 'py-2', 'bg-accent', 'hover:bg-action', 'rounded-lg', 'text-sm', 'mx-8');
        finalizeMultiquoteButton.innerHTML = tablerIcon_1.iconQuoteMulti;
        finalizeMultiquoteButton.id = "finalize-multiquote-button";
        finalizeMultiquoteButton.type = "button";
        finalizeMultiquoteButton.addEventListener("click", () => {
            const multiquote = JSON.parse(localStorage.getItem("vukajlija-multiquote") || "[]");
            if (replyInput && multiquote.length > 0) {
                replyInput.value += multiquote.join("\n\n");
                replyInput.scrollIntoView({ behavior: "smooth" });
                localStorage.removeItem("vukajlija-multiquote");
            }
        });
        return finalizeMultiquoteButton;
    }
    return undefined;
}
function initializePostButtons() {
    var _a;
    // Select the form and relevant elements
    const form = document.querySelector('#new_post');
    const submitButton = (form === null || form === void 0 ? void 0 : form.querySelector('input[type="submit"]')) || null;
    const messageInput = document.querySelector("#message-input");
    // Create a container div for buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "row";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "10px";
    buttonContainer.style.justifyContent = "flex-end";
    // Generate buttons
    const uploadButton = addUploadButton(); // Get the upload button from the function
    const finalizeMultiquoteButton = addFinalizeMultiquoteButton(); // Generate finalize multiquote button
    // Append buttons to the container
    if (submitButton)
        buttonContainer.appendChild(submitButton);
    if (uploadButton)
        buttonContainer.appendChild(uploadButton);
    if (finalizeMultiquoteButton)
        buttonContainer.appendChild(finalizeMultiquoteButton);
    // Determine where to append the button container
    if (form) {
        form.appendChild(buttonContainer); // Add container inside the form
    }
    else if (messageInput) {
        // If form is not present, append buttons to the message section
        const messageSection = document.createElement('div');
        messageSection.id = 'messageSection';
        messageSection.style.display = 'flex';
        messageSection.style.flexDirection = 'row';
        messageSection.style.gap = '10px';
        (_a = messageInput.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(messageSection);
        // Append buttons to message section
        if (uploadButton)
            messageSection.appendChild(uploadButton);
        if (finalizeMultiquoteButton)
            messageSection.appendChild(finalizeMultiquoteButton);
    }
    else {
        console.error("Neither form nor message input found. Unable to initialize post buttons.");
    }
}


/***/ }),

/***/ 306:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addSettingsButton = addSettingsButton;
const settingsModal_1 = __webpack_require__(320);
const tablerIcon_1 = __webpack_require__(855);
function addSettingsButton() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const header = document.querySelector('body > div > div.flex.space-x-2.pr-5.lg\\:pl-8.text-secondary-content');
        const avatar = document.querySelector('#profile-menu-toggle');
        const button = document.createElement('button');
        button.innerHTML = tablerIcon_1.iconSettings;
        button.addEventListener('click', settingsModal_1.showSettingsModal);
        if (header) {
            const searchForm = header.querySelector('form');
            if (avatar && searchForm && ((_a = avatar.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement)) {
                (_b = avatar === null || avatar === void 0 ? void 0 : avatar.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement.insertBefore(button, avatar === null || avatar === void 0 ? void 0 : avatar.parentElement.previousElementSibling);
            }
        }
    });
}


/***/ }),

/***/ 226:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getVisibleToggle = getVisibleToggle;
exports.moveThemeToggle = moveThemeToggle;
function getVisibleToggle(lightToggle, darkToggle) {
    return lightToggle && !lightToggle.classList.contains('hidden')
        ? lightToggle
        : darkToggle && !darkToggle.classList.contains('hidden')
            ? darkToggle
            : null;
}
function moveThemeToggle(lightToggle, darkToggle, header) {
    var _a, _b;
    const themeToggle = getVisibleToggle(lightToggle, darkToggle);
    const avatar = document.querySelector('#profile-menu-toggle');
    if (themeToggle && ((_a = avatar === null || avatar === void 0 ? void 0 : avatar.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement)) {
        (_b = avatar === null || avatar === void 0 ? void 0 : avatar.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement.insertBefore(themeToggle, avatar === null || avatar === void 0 ? void 0 : avatar.parentElement.previousElementSibling);
    }
}


/***/ }),

/***/ 892:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addKeyboardShortcutTooltip = addKeyboardShortcutTooltip;
const tablerIcon_1 = __webpack_require__(855);
function addKeyboardShortcutTooltip() {
    const searchForm = document.querySelector('form');
    if (!searchForm || window.innerWidth < 900) {
        console.warn('Search form not found or small screen. Tooltip will not be added.');
        return;
    }
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'tooltip-container';
    tooltipContainer.style.position = 'relative';
    tooltipContainer.style.display = 'inline-flex';
    tooltipContainer.style.alignItems = 'center';
    tooltipContainer.style.marginRight = '10px';
    tooltipContainer.style.gap = '5px';
    const infoIcon = document.createElement('span');
    infoIcon.innerHTML = tablerIcon_1.iconInfo;
    infoIcon.style.cursor = 'pointer';
    const tooltipText = document.createElement('div');
    tooltipText.className = 'tooltip-text';
    tooltipText.style.visibility = 'hidden';
    tooltipText.style.width = '330px';
    tooltipText.style.backgroundColor = '#333';
    tooltipText.style.color = '#fff';
    tooltipText.style.textAlign = 'left';
    tooltipText.style.borderRadius = '5px';
    tooltipText.style.padding = '10px';
    tooltipText.style.position = 'absolute';
    tooltipText.style.zIndex = '1000';
    tooltipText.style.top = '125%';
    tooltipText.style.left = '50%';
    tooltipText.style.transform = 'translateX(-100%)';
    tooltipText.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    tooltipText.style.fontSize = '12px';
    tooltipText.style.lineHeight = '1.5';
    tooltipText.style.whiteSpace = 'pre-wrap';
    tooltipText.innerHTML = `
        <strong>Shortcuts:</strong><br>
        🔑 Alt+~: 🏠 Početna<br>
        🔑 Alt+1: 🖼️ Posteri<br>
        🔑 Alt+2: 📄 Forum<br>
        🔑 Alt+3: 💬 Čet<br>
        🔑 Alt+4: ⭐ Autori<br>
        🔑 Alt+P: 🔍 Pretraga<br>
        🔑 Alt+M: ✏️ Piši (čet/forum)<br>
        🔑 Alt+K: 📝 Nova defka ili tema<br>
        🔑 Alt+U: 📤 Šalji fajl<br>
        🔑 Alt+Enter: 📨 Objavi(forum)
    `;
    [infoIcon].forEach((icon) => {
        icon.addEventListener('mouseenter', () => {
            tooltipText.style.visibility = 'visible';
        });
        icon.addEventListener('mouseleave', () => {
            tooltipText.style.visibility = 'hidden';
        });
    });
    tooltipContainer.appendChild(infoIcon);
    tooltipContainer.appendChild(tooltipText);
    if (searchForm.parentElement) {
        searchForm.parentElement.insertBefore(tooltipContainer, searchForm.nextSibling);
    }
}


/***/ }),

/***/ 800:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.saveSettings = saveSettings;
exports.loadSettings = loadSettings;
// src/utils/localStorage.ts
const featureSettings_1 = __webpack_require__(269);
const SETTINGS_KEY = 'vukaXFeatureSettings';
function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function loadSettings() {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    return storedSettings ? JSON.parse(storedSettings) : featureSettings_1.defaultSettings;
}


/***/ }),

/***/ 893:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.embedMedia = embedMedia;
exports.addGenericEmbeds = addGenericEmbeds;
const patterns = {
    imgRegex: /\.(jpeg|jpg|png|gif|bmp|webp)$/i,
    videoRegex: /\.(mp4|webm|ogg)$/i,
    ibbRegex: /https:\/\/ibb\.co\/([\w\d]+)/,
    ytRegex: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})(?:[&?].*?t=(\d+))?/,
    spotifyRegex: /(?:https?:\/\/)?(?:open\.)?spotify\.com\/track\/([\w\-]+)/,
    twitterXRegex: /https:\/\/x\.com\/(\w+)\/status\/(\d+)/,
};
/**
 * Embeds media based on the anchor link's href.
 * @param anchor - The anchor element whose href will be processed.
 */
function embedMedia(anchor) {
    return __awaiter(this, void 0, void 0, function* () {
        const href = anchor.href;
        // Handle ibb.co links
        const ibbMatch = href.match(patterns.ibbRegex);
        if (ibbMatch) {
            const imageId = ibbMatch[1];
            const directImageUrl = `https://i.ibb.co/${imageId}/image.png`;
            createThumbnail(directImageUrl, anchor);
            return;
        }
        // Handle image links
        if (patterns.imgRegex.test(href)) {
            createThumbnail(href, anchor);
            return;
        }
        // Handle video links
        if (patterns.videoRegex.test(href)) {
            createVideoEmbed(href, anchor);
            return;
        }
        // Handle YouTube links
        const ytMatch = href.match(patterns.ytRegex);
        if (ytMatch) {
            createYouTubeEmbed(ytMatch, anchor);
            return;
        }
        // Handle Spotify links
        const spotifyMatch = href.match(patterns.spotifyRegex);
        if (spotifyMatch) {
            createSpotifyEmbed(spotifyMatch[1], anchor);
            return;
        }
        // Handle Twitter links
        const twitterXMatch = href.match(patterns.twitterXRegex);
        if (twitterXMatch) {
            createTwitterEmbed(twitterXMatch[1], twitterXMatch[2], anchor);
            return;
        }
    });
}
/**
 * Creates a thumbnail for an image link.
 * @param href - The URL of the image.
 * @param anchor - The anchor element to replace.
 */
function createThumbnail(href, anchor) {
    var _a;
    const img = document.createElement('img');
    img.src = href;
    img.style.maxWidth = window.innerWidth <= 768 ? '100%' : '50%';
    img.style.cursor = 'pointer';
    img.alt = 'Thumbnail image';
    img.addEventListener('click', () => {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        if (modal && modalImg) {
            modal.style.display = 'block';
            modalImg.src = href;
        }
    });
    (_a = anchor.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(img, anchor.nextSibling);
    anchor.remove();
}
/**
 * Creates a video embed.
 * @param href - The URL of the video.
 * @param anchor - The anchor element to replace.
 */
function createVideoEmbed(href, anchor) {
    var _a;
    const video = document.createElement('video');
    video.src = href;
    video.controls = true;
    video.style.maxWidth = window.innerWidth <= 768 ? '100%' : '50%';
    video.style.maxHeight = '800px';
    (_a = anchor.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(video, anchor.nextSibling);
    anchor.remove();
}
/**
 * Creates a YouTube embed.
 * @param match - The match result for YouTube link regex.
 * @param anchor - The anchor element to replace.
 */
function createYouTubeEmbed(match, anchor) {
    var _a;
    const videoId = match[1];
    const startTime = match[2] ? `&start=${match[2]}` : '';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?${startTime}`;
    iframe.style.maxWidth = window.innerWidth <= 768 ? '100%' : '50%';
    iframe.allowFullscreen = true;
    iframe.style.border = 'none';
    (_a = anchor.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(iframe, anchor.nextSibling);
    anchor.remove();
}
/**
 * Creates a Spotify embed.
 * @param trackId - The Spotify track ID.
 * @param anchor - The anchor element to replace.
 */
function createSpotifyEmbed(trackId, anchor) {
    var _a;
    const iframe = document.createElement('iframe');
    iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
    iframe.style.width = '50%';
    iframe.style.height = '380px';
    iframe.allow = 'encrypted-media';
    iframe.style.border = 'none';
    (_a = anchor.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(iframe, anchor.nextSibling);
    anchor.remove();
}
/**
 * Creates a Twitter embed.
 * @param username - The Twitter username.
 * @param tweetId - The ID of the tweet.
 * @param anchor - The anchor element to replace.
 */
function createTwitterEmbed(username, tweetId, anchor) {
    var _a;
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'twitter-tweet';
    blockquote.dataset.theme = 'dark';
    // Apply styles for transparent rounded corners
    blockquote.style.borderRadius = '16px'; // Rounded corners
    blockquote.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Fully transparent background
    const a = document.createElement('a');
    a.href = `https://twitter.com/${username}/status/${tweetId}`;
    blockquote.appendChild(a);
    // Insert the blockquote element after the anchor and remove the anchor
    (_a = anchor.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(blockquote, anchor.nextSibling);
    anchor.remove();
    // Load Twitter widgets
    if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
    }
    else {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        document.head.appendChild(script);
    }
}
function addGenericEmbeds() {
    const primarySelector = "ol:nth-of-type(1) > li > .flex > span:nth-of-type(2) > span:nth-of-type(2)";
    const fallbackSelector = "ol:nth-of-type(1) > li > div > div:nth-of-type(2) > div:nth-of-type(2)";
    let selectedElements = document.querySelectorAll(primarySelector);
    if (selectedElements.length === 0) {
        selectedElements = document.querySelectorAll(fallbackSelector);
    }
    if (selectedElements.length === 0)
        return;
    selectedElements.forEach((element) => __awaiter(this, void 0, void 0, function* () {
        const anchor = element.querySelector('a');
        if (!(anchor === null || anchor === void 0 ? void 0 : anchor.href))
            return;
        try {
            const metadata = yield fetchMetadata(anchor.href);
            if (metadata) {
                createEmbed(element, metadata); // Correct argument order
            }
        }
        catch (error) {
            console.error(`Error embedding content for ${anchor.href}:`, error);
        }
    }));
}
/**
 * Fetch metadata via Google Apps Script
 * @param {string} url - The URL to fetch metadata for
 * @returns {Promise<{title: string; description: string; image: string | null} | null>}
 */
function fetchMetadata(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz_ELBsI2-8WtEwJTVBCfgF626BCjaDD689h4B2o_TzmyfNK9WUnHO_ifkgL1SO4BUQ/exec';
        const apiUrl = `${googleScriptUrl}?url=${encodeURIComponent(url)}`;
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.title && data.description) {
                            resolve({
                                title: data.title,
                                description: data.description,
                                image: data.image || null, // Handle cases where image is absent
                            });
                        }
                        else {
                            console.error('Incomplete metadata:', data);
                            resolve({ title: '', description: '', image: null });
                        }
                    }
                    catch (error) {
                        console.error('Error parsing metadata response:', error);
                        reject(error);
                    }
                },
                onerror: (error) => {
                    console.error('Error fetching metadata via Google Apps Script:', error);
                    reject(error);
                },
            });
        });
    });
}
function createEmbed(element, metadata) {
    var _a;
    const embed = document.createElement('div');
    embed.className = 'metadata-embed';
    embed.style.display = 'flex';
    embed.style.alignItems = 'flex-start';
    embed.style.border = '1px solid #ccc';
    embed.style.borderRadius = '8px';
    embed.style.padding = '10px';
    embed.style.margin = '10px 0';
    embed.style.fontFamily = 'Arial, sans-serif';
    embed.style.cursor = 'pointer';
    embed.style.transition = 'transform 0.2s ease';
    embed.style.backgroundColor = '#f2f2f2';
    // Create the image container
    const imageContainer = document.createElement('div');
    if (metadata.image) {
        const img = document.createElement('img');
        img.src = metadata.image;
        img.alt = 'Preview Image';
        img.style.width = '100px';
        img.style.height = 'auto';
        img.style.maxHeight = '80px';
        img.style.borderRadius = '5px';
        img.style.marginRight = '10px';
        imageContainer.appendChild(img);
    }
    // Create the content container
    const contentContainer = document.createElement('div');
    contentContainer.style.flex = '1'; // Take the remaining space
    contentContainer.innerHTML = `
        <strong style="font-size: 14px; color: #333;">${metadata.title}</strong><br>
        <p style="font-size: 12px; color: #666; margin: 5px 0;">${metadata.description}</p>
    `;
    // Add hover effect
    embed.addEventListener('mouseover', () => {
        embed.style.transform = 'scale(1.02)';
    });
    embed.addEventListener('mouseout', () => {
        embed.style.transform = 'scale(1)';
    });
    // Make the embed clickable (linking to the original URL)
    embed.addEventListener('click', () => {
        const anchor = element.querySelector('a');
        if (anchor && anchor.href) {
            window.open(anchor.href, '_blank');
        }
    });
    // Append image and content containers to the embed
    if (metadata.image)
        embed.appendChild(imageContainer);
    embed.appendChild(contentContainer);
    // Insert the embed after the selected element
    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(embed, element.nextSibling);
}


/***/ }),

/***/ 492:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observeChat = observeChat;
exports.observeForum = observeForum;
const mediaEmbed_1 = __webpack_require__(893);
// Function to observe and handle dynamic content in the chat section
function observeChat() {
    const chatContainer = document.documentElement;
    if (!chatContainer)
        return;
    // Embed media for existing links
    const existingAnchors = chatContainer.querySelectorAll('a');
    existingAnchors.forEach(anchor => (0, mediaEmbed_1.embedMedia)(anchor));
    // Use MutationObserver to listen for new messages being added
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node;
                    const anchors = element.querySelectorAll('a');
                    anchors.forEach(anchor => (0, mediaEmbed_1.embedMedia)(anchor));
                }
            });
            // Modify user icons
            const userIcons = document.querySelectorAll('img.rounded-full');
            userIcons.forEach(icon => {
                icon.classList.replace('rounded-full', 'rounded-m');
                icon.classList.replace('p-2', 'p-1');
                icon.style.transition = 'none';
            });
        });
    });
    observer.observe(chatContainer, { childList: true, subtree: true });
}
// Function to observe and handle dynamic content in the forum section
function observeForum() {
    const forumContainer = document.querySelector('#comments');
    if (!forumContainer)
        return;
    // Embed media for existing links
    const existingAnchors = forumContainer.querySelectorAll('a');
    existingAnchors.forEach(anchor => (0, mediaEmbed_1.embedMedia)(anchor));
    // Use MutationObserver to listen for new messages being added
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node;
                    const anchors = element.querySelectorAll('a');
                    anchors.forEach(anchor => (0, mediaEmbed_1.embedMedia)(anchor));
                }
            });
            // Modify user icons
            const userIcons = document.querySelectorAll('img.rounded-full');
            userIcons.forEach(icon => {
                icon.classList.replace('rounded-full', 'rounded-m');
                icon.classList.replace('p-2', 'p-1');
                icon.style.transition = 'none';
            });
        });
    });
    observer.observe(forumContainer, { childList: true, subtree: true });
}


/***/ }),

/***/ 501:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadPosters = loadPosters;
// Wait for the DOM to load
function loadPosters() {
    const mainMenu = document.querySelector('#main-menu > nav > ul');
    if (!mainMenu) {
        console.error("Main menu not found. Aborting.");
        return;
    }
    const forumItem = mainMenu.querySelectorAll('li')[1];
    const mainMenuItemStyle = mainMenu.querySelectorAll('li')[2];
    const mainMenuItemLinkStyle = mainMenu.querySelectorAll('li > a')[2];
    if (!forumItem || !mainMenuItemStyle || !mainMenuItemLinkStyle) {
        console.error("Menu item styles not found. Aborting.");
        return;
    }
    // Create "Posteri" button
    const posterMenuItem = createMenuItem(mainMenuItemStyle, mainMenuItemLinkStyle);
    mainMenu.insertBefore(posterMenuItem, forumItem);
    const posterLink = posterMenuItem.querySelector('a');
    if (posterLink) {
        posterLink.id = 'posters-button';
    }
    posterLink === null || posterLink === void 0 ? void 0 : posterLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Opening Poster generator...");
        showPosterGenerator();
    });
}
function createMenuItem(baseItemStyle, baseLinkStyle) {
    const menuItem = document.createElement('li');
    const menuLink = document.createElement('a');
    menuLink.textContent = 'Posteri';
    menuLink.href = '#';
    const excludedClasses = ['active', 'selected', 'current']; // Add any other classes that indicate active state
    if (baseItemStyle.classList) {
        baseItemStyle.classList.forEach((className) => {
            if (!excludedClasses.includes(className)) {
                menuItem.classList.add(className);
            }
        });
    }
    if (baseLinkStyle.classList) {
        baseLinkStyle.classList.forEach((className) => {
            if (!excludedClasses.includes(className)) {
                menuLink.classList.add(className);
            }
        });
    }
    menuItem.appendChild(menuLink);
    return menuItem;
}
// Display Poster Generator UI
function showPosterGenerator() {
    const mainContent = document.querySelector('.w-full.md\\:w-auto') || document.body;
    if (!mainContent) {
        console.error("Main content area not found. Aborting.");
        return;
    }
    mainContent.innerHTML = ""; // Clear existing content
    const container = buildPosterGeneratorUI();
    mainContent.appendChild(container);
    const canvas = document.getElementById('posterCanvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
        drawStaticCanvas(ctx, canvas);
        integratePosterLogic(ctx, canvas);
    }
}
// Build the Poster Generator UI
function buildPosterGeneratorUI() {
    const container = createElementWithStyles('div', {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    });
    const heading = createElementWithStyles('h1', {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px'
    });
    heading.textContent = 'Poster Generator';
    container.appendChild(heading);
    container.appendChild(createInputSection());
    container.appendChild(createCanvasSection());
    container.appendChild(createDownloadSection());
    return container;
}
// Create the input section
function createInputSection() {
    const inputContainer = createElementWithStyles('div', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px'
    });
    const fileInput = createInputField('file', 'imageInput', 'image/*', 'Dodajte sliku');
    const headerInput = createInputField('text', 'headerText', '', 'Gornji tekst');
    const termInput = createInputField('text', 'termText', '', 'Donji tekst');
    const generateButton = createElementWithStyles('button', {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });
    generateButton.id = 'generateButton';
    generateButton.textContent = 'Generiši poster';
    inputContainer.append(fileInput, headerInput, termInput, generateButton);
    return inputContainer;
}
// Create an input field
function createInputField(type, id, accept, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    if (accept)
        input.accept = accept;
    if (placeholder)
        input.placeholder = placeholder;
    Object.assign(input.style, {
        padding: '10px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        color: 'black'
    });
    return input;
}
// Create the canvas section
function createCanvasSection() {
    const canvasContainer = createElementWithStyles('div', {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0'
    });
    const canvasWrapper = createElementWithStyles('div', {
        width: '100%',
        maxWidth: '600px',
        aspectRatio: '800 / 600',
        position: 'relative'
    });
    const canvas = document.createElement('canvas');
    canvas.id = 'posterCanvas';
    canvas.width = 800;
    canvas.height = 600;
    Object.assign(canvas.style, {
        width: '100%',
        height: '100%',
        border: '1px solid black'
    });
    canvasWrapper.appendChild(canvas);
    canvasContainer.appendChild(canvasWrapper);
    return canvasContainer;
}
// Create the download section
function createDownloadSection() {
    const downloadContainer = createElementWithStyles('div', {
        textAlign: 'center'
    });
    const downloadLink = createElementWithStyles('a', {
        display: 'none',
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        borderRadius: '5px',
        textDecoration: 'none'
    });
    downloadLink.id = 'downloadLink';
    downloadLink.download = `poster_${new Date().toISOString()}.png`;
    downloadLink.textContent = 'Preuzmi poster';
    downloadContainer.appendChild(downloadLink);
    return downloadContainer;
}
// Draw static canvas content
function drawStaticCanvas(ctx, canvas) {
    var _a;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Upper black area
    ctx.fillRect(0, 0, canvas.width, 50);
    // Lower black area
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    // Add "VukaX" to upper-left corner
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText('VukaX', 30, 30);
    const currentAuthor = ((_a = document.querySelectorAll('#profile-menu > div > div > div')[1].querySelector('a')) === null || _a === void 0 ? void 0 : _a.textContent) || 'Unknown';
    // Add "Car, currentDate" to upper-right corner
    const today = new Date().toLocaleDateString('sr-RS');
    ctx.textAlign = 'right';
    ctx.fillText(`${currentAuthor}, ${today}`, canvas.width - 30, 30);
}
// Integrate logic for interactive inputs
function integratePosterLogic(ctx, canvas) {
    var _a;
    const imageInput = document.getElementById('imageInput');
    const headerText = document.getElementById('headerText');
    const termText = document.getElementById('termText');
    const downloadLink = document.getElementById('downloadLink');
    let uploadedImage = null;
    imageInput.addEventListener('change', (event) => {
        var _a, _b;
        const file = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                uploadedImage = img;
                updateCanvas();
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
    const updateCanvas = () => {
        drawStaticCanvas(ctx, canvas);
        if (uploadedImage) {
            const imgAspectRatio = uploadedImage.width / uploadedImage.height;
            const imageHeight = canvas.height - 200; // 50px top, 100px bottom
            const imageWidth = imageHeight * imgAspectRatio;
            const x = (canvas.width - imageWidth) / 2;
            ctx.drawImage(uploadedImage, x, 50, imageWidth, imageHeight);
        }
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(headerText.value, canvas.width / 2, canvas.height - 100);
        ctx.font = 'bold 24px Arial';
        ctx.fillText(termText.value, canvas.width / 2, canvas.height - 50);
    };
    (_a = document.getElementById('generateButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        downloadLink.href = canvas.toDataURL();
        downloadLink.style.display = 'inline-block';
    });
    headerText.addEventListener('input', updateCanvas);
    termText.addEventListener('input', updateCanvas);
}
// Helper function to create elements with styles
function createElementWithStyles(tag, styles) {
    const element = document.createElement(tag);
    Object.assign(element.style, styles);
    return element;
}


/***/ }),

/***/ 320:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.injectSettingsModal = injectSettingsModal;
exports.showSettingsModal = showSettingsModal;
const localStorage_1 = __webpack_require__(800);
function injectSettingsModal() {
    var _a, _b, _c;
    // Create the modal element
    const modal = document.createElement('div');
    modal.id = 'settingsModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.width = '400px';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    modal.style.zIndex = '1000';
    modal.style.fontFamily = `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
    // Load saved settings
    const settings = (0, localStorage_1.loadSettings)();
    // Modal content
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; font-size: 1.5rem; color: #333;">VukaX podešavanja</h2>
            <button id="closeSettingsButton" style="
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #666;
                text-color: #c3c3c3;
            ">&times;</button>
        </div>
        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
        <label style="display: block; margin-bottom: 10px; color: black">
            <input type="checkbox" id="postersGenerator" ${settings.postersGenerator ? 'checked' : ''}>
            Dodaj generator postera u glavni meni.
        </label>
        <label style="display: block; margin-bottom: 10px; color: black">
            <input type="checkbox" id="modifyUIToggle" ${settings.modifyUI ? 'checked' : ''}>
            Izvrši bazične promene izgleda sajta.
        </label>
        <label style="display: block; margin-bottom: 10px; color: black">
            <input type="checkbox" id="grobljeDefinitionsToggle" ${settings.grobljeDefinitions ? 'checked' : ''}>
            Na stranici sa defkama dodaj defke sa groblja u sajdbar.
        </label>
        <label style="display: block; margin-bottom: 10px; ; color: black">
            <input type="checkbox" id="radioMoravaToggle" ${settings.radioMorava ? 'checked' : ''}>
            Zameni "Rekli su o sajtu" Radio Morava plejerom.
        </label>
        <label style="display: block; margin-bottom: 20px; ; color: black">
            <input type="checkbox" id="rssFeedToggle" ${settings.rssFeed ? 'checked' : ''}>
            Na forumu dodaj linkove ka najnovijim utakmicama u sajdbar.
        </label>
                <label style="display: block; margin-bottom: 20px; ; color: black">
            <input type="checkbox" id="typingIndicatorToggle" ${settings.typingIndicator ? 'checked' : ''}>
            Vidi ko trenutno kucka na četu.
        </label>
                <label style="display: block; margin-bottom: 20px; ; color: black">
            <input type="checkbox" id="embedMediaToggle" ${settings.embedMedia ? 'checked' : ''}>
            Embeduj linkove fajlova, Jutjuba, Spotifaja, Tvitera...
        </label>
                <label style="display: block; margin-bottom: 20px; ; color: black">
            <input type="checkbox" id="shortcutsToggle" ${settings.shortcuts ? 'checked' : ''}>
            Omogući prečice na tastaturi.
        </label>
                <label style="display: block; margin-bottom: 20px; ; color: black">
            <input type="checkbox" id="uploadButtonToggle" ${settings.uploadButton ? 'checked' : ''}>
            Omogući dugme za upload svih fajlova (preko catbox.moe).
        </label>
        <label style="display: block; margin-bottom: 10px; color: black">
            <input type="checkbox" id="quotePosts" ${settings.quotePosts ? 'checked' : ''}>
            Dodaj dugme za citiranje na forumu.
        </label>
        <label style="display: block; margin-bottom: 10px; color: black">
            <input type="checkbox" id="userTooltips" ${settings.userTooltips ? 'checked' : ''}>
            Dodaj korisničke informacije kada pređeš mišem preko slike.
        </label>
        <div style="display: flex; justify-content: space-between;">
            <button id="saveSettingsButton" style="
                background-color: #007bff;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.2s;
            ">Sačuvaj</button>
            <button id="closeSettingsButtonFooter" style="
                background-color: #6c757d;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.2s;
            ">Zatvori</button>
        </div>
    `;
    document.body.appendChild(modal);
    // Add functionality for buttons
    (_a = document.getElementById('saveSettingsButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        const newSettings = {
            postersGenerator: document.getElementById('postersGenerator').checked,
            modifyUI: document.getElementById('modifyUIToggle').checked,
            grobljeDefinitions: document.getElementById('grobljeDefinitionsToggle').checked,
            radioMorava: document.getElementById('radioMoravaToggle').checked,
            rssFeed: document.getElementById('rssFeedToggle').checked,
            embedMedia: document.getElementById('embedMediaToggle').checked,
            shortcuts: document.getElementById('shortcutsToggle').checked,
            uploadButton: document.getElementById('uploadButtonToggle').checked,
            typingIndicator: document.getElementById('typingIndicatorToggle').checked,
            quotePosts: document.getElementById('quotePosts').checked,
            userTooltips: document.getElementById('userTooltips').checked
        };
        (0, localStorage_1.saveSettings)(newSettings);
        alert('Izmene sačuvane. Osvežite stranicu da vidite promene.');
    });
    // Close modal with top-right button
    (_b = document.getElementById('closeSettingsButton')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    // Close modal with footer close button
    (_c = document.getElementById('closeSettingsButtonFooter')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}
function showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'block';
    }
}


/***/ }),

/***/ 625:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addShortcuts = addShortcuts;
/**
* Adds keyboard shortcuts for the website.
* @param event - The keydown event.
*/
function addShortcuts(event) {
    if (event.altKey) {
        switch (event.code) {
            case 'Backquote':
                event.preventDefault();
                window.location.href = 'https://vukajlija.com';
                break;
            case 'Digit1':
                event.preventDefault();
                const postersButton = document.querySelector('#posters-button');
                if (postersButton) {
                    postersButton.click();
                }
                break;
            case 'Digit2':
                event.preventDefault();
                window.location.href = 'https://vukajlija.com/forum/teme';
                break;
            case 'Digit3':
                event.preventDefault();
                window.location.href = 'https://vukajlija.com/cet/kafana';
                break;
            case 'Digit4':
                event.preventDefault();
                window.location.href = 'https://vukajlija.com/autori/popularni/definicije/2024';
                break;
            case 'KeyP':
                event.preventDefault();
                focusInput('input[name="q"]');
                break;
            case 'KeyM':
                event.preventDefault();
                focusMessageInput();
                break;
            case 'KeyK':
                event.preventDefault();
                handleNewPostNavigation();
                break;
            case 'KeyU':
                event.preventDefault();
                clickButton('button[type="button"]');
                break;
            case 'Enter':
                event.preventDefault();
                clickButton('input[type="submit"]');
                break;
        }
    }
}
function focusInput(selector) {
    const input = document.querySelector(selector);
    input === null || input === void 0 ? void 0 : input.focus();
}
function focusMessageInput() {
    const chatInput = document.querySelector('#message-input');
    const forumInput = document.querySelector('#post_body');
    (chatInput === null || chatInput === void 0 ? void 0 : chatInput.focus()) || (forumInput === null || forumInput === void 0 ? void 0 : forumInput.focus());
}
function handleNewPostNavigation() {
    if (window.location.href.includes('recnik/definicije')) {
        window.location.href = 'https://vukajlija.com/recnik/definicije/new';
    }
    else if (window.location.href.includes('forum')) {
        window.location.href = 'https://vukajlija.com/forum/teme/new';
    }
}
function clickButton(selector) {
    const button = document.querySelector(selector);
    button === null || button === void 0 ? void 0 : button.click();
}


/***/ }),

/***/ 855:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.iconUpload = exports.iconQuoteMulti = exports.iconQuoteRemove = exports.iconQuote = exports.iconInfo = exports.iconSettings = void 0;
exports.iconSettings = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>';
exports.iconInfo = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-info-circle" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" /><polyline points="11 12 12 12 12 16 13 16" /></svg>';
exports.iconQuote = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-quote"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" /><path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" /></svg>';
exports.iconQuoteRemove = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-quote-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1m4 4v3c0 2.667 -1.333 4.333 -4 5" /><path d="M19 11h-4m-1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 .66 -.082 1.26 -.245 1.798m-1.653 2.29c-.571 .4 -1.272 .704 -2.102 .912" /><path d="M3 3l18 18" /></svg>';
exports.iconQuoteMulti = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-quote"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5a2 2 0 0 1 2 2v6c0 3.13 -1.65 5.193 -4.757 5.97a1 1 0 1 1 -.486 -1.94c2.227 -.557 3.243 -1.827 3.243 -4.03v-1h-3a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 2 -2z" /><path d="M18 5a2 2 0 0 1 2 2v6c0 3.13 -1.65 5.193 -4.757 5.97a1 1 0 1 1 -.486 -1.94c2.227 -.557 3.243 -1.827 3.243 -4.03v-1h-3a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 2 -2z" /></svg>';
exports.iconUpload = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg>';


/***/ }),

/***/ 298:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addUserToTypingIndicator = addUserToTypingIndicator;
exports.overrideTypingHandler = overrideTypingHandler;
const activeTypers = new Set();
const typingTimeouts = new Map();
/**
 * Adds a user to the typing indicator and schedules their removal after a delay.
 * @param username - The username of the user typing.
 */
function addUserToTypingIndicator(username) {
    // Add the user to the active typers set
    activeTypers.add(username);
    updateTypingIndicator();
    // Clear any existing timeout for this user
    if (typingTimeouts.has(username)) {
        clearTimeout(typingTimeouts.get(username));
    }
    // Schedule removal of the user after a delay
    const timeout = setTimeout(() => {
        activeTypers.delete(username);
        typingTimeouts.delete(username);
        updateTypingIndicator();
    }, 2000); // 2 seconds timeout (adjustable)
    typingTimeouts.set(username, timeout);
}
/**
 * Updates the typing indicator in the DOM to show currently typing users.
 */
function updateTypingIndicator() {
    let typingIndicator = document.getElementById('typing-indicator');
    if (!typingIndicator) {
        typingIndicator = createTypingIndicatorElement();
    }
    // Update the indicator text based on the number of active typers
    if (activeTypers.size > 0) {
        const usernames = Array.from(activeTypers).join(', ');
        typingIndicator.textContent = activeTypers.size === 1
            ? `Trenutno kucka: ${usernames}...`
            : `Trenutno kuckaju: ${usernames}...`;
    }
    else {
        typingIndicator.textContent = ''; // Clear the text if no one is typing
    }
}
/**
 * Creates the typing indicator element in the DOM if it doesn't exist.
 * @returns The created or existing typing indicator element.
 */
function createTypingIndicatorElement() {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.style.color = 'gray';
    typingIndicator.style.fontStyle = 'italic';
    typingIndicator.style.marginBottom = '.1rem';
    const messageSection = document.querySelector('#messageSection');
    const messageInput = document.querySelector('#message-input');
    if (messageSection) {
        messageSection.appendChild(typingIndicator);
    }
    else if (messageInput && messageInput.parentElement) {
        messageInput.parentElement.insertBefore(typingIndicator, messageInput.nextSibling);
    }
    else {
        console.warn('Message section not found. Typing indicator cannot be added.');
    }
    return typingIndicator;
}
/**
 * Overrides the default `App.hello.received` function to intercept typing events.
 * @param App - The global app object from `unsafeWindow`.
 */
function overrideTypingHandler(App) {
    if (App && App.hello && App.hello.received) {
        const originalReceived = App.hello.received;
        App.hello.received = function (data) {
            var _a;
            if (data.event_type === 'typing' && ((_a = data.user) === null || _a === void 0 ? void 0 : _a.username)) {
                addUserToTypingIndicator(data.user.username);
            }
            originalReceived.call(this, data);
        };
    }
    else {
        console.warn('App.hello.received not found. Typing indicator won’t be initialized.');
    }
}


/***/ }),

/***/ 725:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Function to upload an image/video to Catbox and append URL to the textarea
function uploadMediaToCatbox(file) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a loading notification element
        const loadingNotification = document.createElement('div');
        loadingNotification.innerText = 'Šaljem na Catbox...';
        loadingNotification.style.position = 'fixed';
        loadingNotification.style.bottom = '20px';
        loadingNotification.style.right = '20px';
        loadingNotification.style.padding = '10px';
        loadingNotification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        loadingNotification.style.color = 'white';
        loadingNotification.style.borderRadius = '5px';
        document.body.appendChild(loadingNotification);
        const errorNotification = document.createElement('div');
        errorNotification.innerText = 'Slanje nije uspelo!';
        errorNotification.style.position = 'fixed';
        errorNotification.style.bottom = '20px';
        errorNotification.style.right = '20px';
        errorNotification.style.padding = '10px';
        errorNotification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        errorNotification.style.color = 'white';
        errorNotification.style.borderRadius = '5px';
        const successNotification = document.createElement('div');
        successNotification.innerText = 'Slanje uspešno!';
        successNotification.style.position = 'fixed';
        successNotification.style.bottom = '20px';
        successNotification.style.right = '20px';
        successNotification.style.padding = '10px';
        successNotification.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
        successNotification.style.color = 'white';
        successNotification.style.borderRadius = '5px';
        // Return a promise for the upload process
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', file);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: formData,
                onload: function (response) {
                    // Remove the loading notification
                    loadingNotification.remove();
                    if (response.status === 200) {
                        const directUrl = response.responseText.trim();
                        document.body.appendChild(successNotification);
                        setTimeout(() => {
                            successNotification.remove();
                        }, 5000);
                        resolve(directUrl); // Resolving with the URL after successful upload
                    }
                    else {
                        document.body.appendChild(errorNotification);
                        setTimeout(() => {
                            errorNotification.remove();
                        }, 5000);
                        reject(new Error('Failed to upload media.')); // Rejecting on failure
                    }
                },
                onerror: function (error) {
                    // Remove the loading notification
                    loadingNotification.remove();
                    document.body.appendChild(errorNotification);
                    setTimeout(() => {
                        errorNotification.remove();
                    }, 5000);
                    reject(new Error('An error occurred during the upload.')); // Rejecting on error
                }
            });
        });
    });
}
exports["default"] = uploadMediaToCatbox;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(927);
/******/ 	
/******/ })()
;