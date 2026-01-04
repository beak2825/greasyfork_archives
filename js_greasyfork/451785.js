/* jshint esversion: 6 */
// ==UserScript==
// @name         Book History
// @namespace    http://tampermonkey.net/
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version      0.9.3.1
// @description  Keeps a history of the last typed parts of a book
// @author       Varsag
// @license      MIT
// @match        http://klavogonki.ru/*
// @match        https://klavogonki.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/451785/Book%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/451785/Book%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* -= PARAMS =- */
    var cfg = new GM_configStruct({
        id: 'Config',
        title: 'Book History Configuration',
        fields: {
            size: {
                label: 'Number of stored parts',
                section: ['Settings', ' '],
                type: 'int',
                min: 1,
                default: 10
            },
            deleteCurrent: {
                label: 'Erase book',
                title: 'Erase the history of the current book',
                section: ['Actions', ' '],
                type: 'button',
                click: function() {
                    let voc = getVoc();
                    if (voc === null) alert('Failed! You should be on the book page or book\'s race page.');
                    GM_deleteValue('book_' + voc);
                    alert('The history of the current book has been successfully erased.');
                }
            },
            deleteAll: {
                label: 'Erase all',
                title: 'Erase the history of all books',
                type: 'button',
                click: function() {
                    let keys = GM_listValues();
                    keys.forEach(k => {
                        if (k.startsWith('book_')) {
                            GM_deleteValue(k);
                        }
                    });
                    alert('The history of all books has been successfully erased.');
                }
            },
        },
        events: {
            init: function() { GM_registerMenuCommand('Configuration', () => { this.open(); }); },
            save: function() { this.close(); }
        }
    });

    var modalCSS = `
<style>
	#book-history-modal {
		z-index: 9999;
        color: black;
	}

	#book-history-modal .modal__overlay {
	    position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    padding: 30px 0;
	    background: rgba(0,0,0,.6);
	    display: flex;
	    align-items: center;
	    flex-direction: column;
	    overflow-x: hidden;
	    overflow-y: auto;
	    z-index: 199;
	}

	#book-history-modal .modal__overlay:before {
		content: "";
		flex: 1;
	}

	#book-history-modal .modal__overlay:after {
		content: "";
		flex: 3;
	}

	#book-history-modal .modal__container {
	    position: relative;
		width: 900px;
        min-height: 500px;
        max-height: 700px;
	    background-color: #fcfcfc;
	    box-sizing: border-box;
	    box-shadow: 5px 5px 12px 4px rgb(0 0 0 / 20%) !important;
        outline: none;
	}

	#book-history-modal .modal__close {
	    position: absolute;
	    top: 0;
	    right: 0;
	    margin-top: 5px;
	    margin-right: 8px;
	    background: transparent;
	    border: 0;
	    cursor: pointer;
	}

	#book-history-modal .modal__close:before {
	    content: "\u2715";
	    font-size: 25px;
	    color: #9f9f9f;
	    transition: color .12s ease;
	}

    #book-history-modal .modal__close:hover:before {
        color: black;
    }

    #book-history-modal .modal-heading {
        position: absolute;
        width: 100%;
        padding: 12px;
        background: #fcfcfc;
        font-size: 22px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0px 4px 20px -3px rgb(0 0 0 / 30%) !important;
    }

    #book-history-modal .modal-heading span {
        width: 75%;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin: 0 auto;
    }

    #book-history-modal .modal-content {
        height: 100%;
        padding: 60px 0 20px 0;
        font-family: Verdana;
        font-size: 19px;
        line-height: 1.2em;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
        outline: none;
    }

    #book-history-modal .modal-content::-webkit-scrollbar {
        display: none;
    }

    #book-history-modal .history-part {
        display: flex;
        border-top: 1px solid #cecece;
    }

    #book-history-modal .history-part-number {
        max-width: 80px;
        padding: 8px 10px 7px 10px;
        font-size: 15px;
        font-weight: bold;
        background: #ebebeb;
        color: #4d4d4d;
    }

    #book-history-modal .history-part-text {
        padding: 7px 30px 7px 10px;
        white-space: pre-wrap;
        flex: 1;
    }

    #book-history-modal .empty-history-error {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 35px;
    }
</style>
`;

    var modalHTML = `
<div id="book-history-modal" style="display:none;">
    <div class="modal__overlay">
        <div class="modal__container after-open" tabindex="-1" role="dialog">
            <div class="modal-heading">
                <span></span>
                <button class="modal__close" aria-label="Close modal"></button>
            </div>
            <div class="modal-content" tabIndex="-1"></div>
        </div>
    </div>
</div>
`;

    const eventWrapper = (func) => {
        return (event) => {
            if (event.currentTarget !== event.target) { return; }
            func();
        }
    }

    var isModalCreated = false;
    var isModalOpened = false;
    function createModal() {
        document.querySelector('body').insertAdjacentHTML('beforeend', modalHTML);
        document.querySelector('head').insertAdjacentHTML('beforeend', modalCSS);

        document.querySelector('#book-history-modal .modal__close').addEventListener('click', eventWrapper(hideModal));
        document.querySelector('#book-history-modal .modal__overlay').addEventListener('click', eventWrapper(hideModal));
        isModalCreated = true;
    }

    function updateModal(data) {
        let partsHTML = '';
        if (data.parts.length) {
            let nLength = Math.max(...data.parts.map(([n, part]) => n.toString().length));
            data.parts.forEach(([n, part]) => {
                partsHTML += `
<div class="history-part">
    <div class="history-part-number"><span style="visibility:hidden;">
        ${'0'.repeat(nLength - n.toString().length)}</span>
        ${n.toString()}
    </div>
    <div class="history-part-text">${part}</div>
</div>`;
            });
        } else {
            partsHTML = '<div class="empty-history-error"><span>Empty history. For now...</span></div>';
        }
        document.querySelector('#book-history-modal .modal-heading span').innerHTML = data.name;
        document.querySelector('#book-history-modal .modal-content').innerHTML = partsHTML;
    }

    function showModal() {
        document.getElementById('book-history-modal').style.display = 'block';
        document.querySelector('body').style.overflow = 'hidden';
        let contentEl = document.querySelector('#book-history-modal .modal-content');
        contentEl.scrollTop = contentEl.scrollHeight;
        contentEl.focus();
        isModalOpened = true;
    }

    function hideModal() {
        document.getElementById('book-history-modal').style.display = 'none';
        document.querySelector('body').style.overflow = 'auto';
        isModalOpened = false;
    }

    function toggleModal() {
        if (isModalOpened) {
            hideModal();
        } else {
            showModal();
        }
    }

    function isGameEnd() {
        try {
            if (document.getElementById('bookinfo').style.display != 'none') return true;
        } catch (err) {
            return false;
        }
        return false;
    }

    function getErrorsText() {
        let textEl = document.querySelector('#errors_text p').cloneNode(true);
        textEl.querySelectorAll('s').forEach((item) => item.remove());
        return textEl.textContent.replaceAll('  ', ' ');
    }

    function getTextPart(id) {
        let text = '';
        let element = document.getElementById(id).cloneNode(true);
        element.innerHTML = element.innerHTML.replaceAll('<br>', '\n');
        if (element.children.length > 0) {
            [...element.children].forEach((a) => {
                if (a.style.display != 'none') {
                    text += a.textContent;
                }
                if (a.children.length > 0 && a.children[0].tagName == 'BR') {
                    text += '\n';
                }
            });
        } else {
            text += element.textContent;
        }
        return text;
    }

    function getFullText() {
        let text = getTextPart('beforefocus');
        text += getTextPart('typefocus');
        text += getTextPart('afterfocus');
        return text.replaceAll(' \n', '\n').replaceAll('\n ', '\n');
    }

    function getVoc() {
        try {
            let url = document.querySelector('#gamedesc .gametype-voc a');
            if (url) {
                url = url.href;
            } else {
                url = window.location.href;
            }
            return parseInt(url.match(/\/vocs\/(\d+?)\//)[1]);
        } catch (err) {
            return null;
        }
    }

    function getBookName() {
        try {
            let desc = document.querySelector('#gamedesc span');
            if (desc) {
                return desc.textContent.trim();
            }
            return document.querySelector('.user-title .title').childNodes[0].textContent.trim();
        } catch (err) {
            return null;
        }
    }

    function getBookInfo(withText=true) {
        try {
            let info = {};
            let descEl = document.getElementById('gamedesc');
            info.name = descEl.querySelector('.gametype-voc a').textContent.trim();
            info.n = parseInt(descEl.childNodes[1].textContent.trim().match(/^, (\d+)/)[1]);
            info.voc = parseInt(descEl.querySelector('.gametype-voc a').href.match(/\/vocs\/(\d+?)\//)[1]);
            if (withText) info.text = getFullText();
            return info;
        } catch (err) {
            return null;
        }
    }

    var isPartSaved = false;
    function addPart(info) {
        let id = 'book_' + info.voc;
        let data = JSON.parse(GM_getValue(id, '{"parts":[]}'));
        data.name = info.name;
        data.voc = info.voc;
        let numbers = data.parts.map(item => item[0]);
        if (!numbers.includes(info.n)) {
            data.parts.push([info.n, info.text]);
            data.parts = data.parts.slice(-cfg.get('size'));
            GM_setValue(id, JSON.stringify(data));
            bookData = data;
            if (isModalOpened) {
                updateModal(data);
                showModal();
            }
        }
        isPartSaved = true;
    }

    var bookData = null;
    var bookInfo = null;
    var bookVoc = null;
    let location = window.location.href;
    if (location.match(/\/g\/\?gmid/) || location.match(/\/vocs\/\d+?\//)) {
        var endId = setInterval(function() {
            if (isGameEnd()) {
                bookInfo = getBookInfo();
                if (bookInfo !== null) {
                    addPart(bookInfo);
                }
                clearInterval(endId);
            }
        }, 100);

        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key == 'ArrowDown') {
                if (bookVoc === null) {
                    bookVoc = getVoc();
                }
                if (bookVoc !== null) {
                    if (!isModalCreated) createModal();
                    let data = bookData;
                    if (data === null) {
                        data = GM_getValue('book_' + bookVoc, null);
                        if (data !== null) data = JSON.parse(data);
                    }
                    if (data !== null) {
                        updateModal(data);
                        toggleModal();
                        bookData = data;
                    } else {
                        let name = getBookName();
                        if (name) {
                            updateModal({name: name, voc: bookVoc, parts: []});
                            toggleModal();
                        }
                    }
                }
            }
            if (event.key === 'Escape' && isModalOpened) {
                hideModal();
            }
        }, false);

        window.addEventListener("beforeunload", function (event) {
            if (!isPartSaved && isGameEnd() && getBookInfo(false)) {
                let start = new Date().getTime();
                while (new Date().getTime() < start + 250 && !isPartSaved);
            }
        });
    }
})();