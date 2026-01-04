// ==UserScript==
// @name         Fiction Novel Download Buttons
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds download buttons for TXT, PDF, EPUB on supported fanfiction sites
// @author       AI
// @match        *://*.fanfiction.net/*
// @match        *://archiveofourown.org/works/*
// @match        *://literotica.com/*
// @match        *://asianfanfics.com/*
// @match        *://wattpad.com/*
// @match        *://dreame.com/*
// @match        *://inkitt.com/*
// @match        *://getinkspired.com/*
// @match        *://webnovel.com/*
// @match        *://libri7.com/*
// @match        *://fictionpress.com/*
// @match        *://starslibrary.net/*
// @match        *://fimfiction.net/*
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/547689/Fiction%20Novel%20Download%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/547689/Fiction%20Novel%20Download%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to create buttons
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.margin = '0 5px';
        btn.style.padding = '5px 10px';
        btn.style.cursor = 'pointer';
        btn.onclick = onClick;
        return btn;
    }

    // Load jsPDF dynamically
    function loadJsPDF(callback) {
        if (window.jspdf) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Helper for waiting for element
    function waitForElement(selector, callback, timeout = 15000) {
        const startTime = Date.now();
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            } else if (Date.now() - startTime > timeout) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Download functions
    function downloadAsTxt(content, filename) {
        if (!content) {
            alert('No content to download.');
            return;
        }
        alert('Preparing TXT download...');
        const blob = new Blob([content], {type: 'text/plain'});
        GM_download({url: URL.createObjectURL(blob), name: filename, saveAs: true});
        alert('Download started: ' + filename);
    }

    function downloadAsPdf(content, filename) {
        alert('Generating PDF...');
        loadJsPDF(() => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const lines = doc.splitTextToSize(content, 180);
            doc.text(lines, 10, 10);
            const pdfBlob = doc.output('blob');
            GM_download({url: URL.createObjectURL(pdfBlob), name: filename, saveAs: true});
            alert('PDF download started: ' + filename);
        });
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Initialize site-specific UI
    function init() {
        const hostname = window.location.hostname;
        if (hostname.includes('fanfiction.net')) {
            injectFanFictionNet();
        } else if (hostname.includes('archiveofourown.org')) {
            injectAO3();
        } else if (hostname.includes('literotica.com')) {
            injectLiterotica();
        } else if (hostname.includes('asianfanfics.com')) {
            injectAsianFanfics();
        } else if (hostname.includes('wattpad.com')) {
            injectWattpad();
        } else if (hostname.includes('dreame.com')) {
            injectDreame();
        } else if (hostname.includes('inkitt.com')) {
            injectInkitt();
        } else if (hostname.includes('getinkspired.com')) {
            injectInkspired();
        } else if (hostname.includes('webnovel.com')) {
            injectWebNovel();
        } else if (hostname.includes('libri7.com')) {
            injectLibri7();
        } else if (hostname.includes('fictionpress.com')) {
            injectFictionPress();
        } else if (hostname.includes('starslibrary.net')) {
            injectStarsLibrary();
        } else if (hostname.includes('fimfiction.net')) {
            injectFimFiction();
        }
    }

    // --------- Site-specific functions ---------

    function injectFanFictionNet() {
        waitForElement('.story-info-right', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getFanFictionContent();
                    downloadAsTxt(content, 'FanFiction.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getFanFictionContent();
                    downloadAsPdf(content, 'FanFiction.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                container.appendChild(dlDiv);
            }
        });
    }

    function getFanFictionContent() {
        const storyDiv = document.querySelector('.storytext');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectAO3() {
        waitForElement('div#chapter-inner, div#workskin', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getAO3Content();
                    downloadAsTxt(content, 'AO3_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getAO3Content();
                    downloadAsPdf(content, 'AO3_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                container.appendChild(dlDiv);
            }
        });
    }

    function getAO3Content() {
        const chapterDiv = document.querySelector('div#chapter-inner, div#workskin');
        if (!chapterDiv) {
            alert('Story content not found.');
            return '';
        }
        return chapterDiv.innerText;
    }

    function injectLiterotica() {
        waitForElement('.storytext, .story', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getLiteroticaContent();
                    downloadAsTxt(content, 'Literotica_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getLiteroticaContent();
                    downloadAsPdf(content, 'Literotica_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getLiteroticaContent() {
        const storyDiv = document.querySelector('.storytext, .story');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectAsianFanfics() {
        waitForElement('.story-content', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getAsianFanficsContent();
                    downloadAsTxt(content, 'AsianFanfics_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getAsianFanficsContent();
                    downloadAsPdf(content, 'AsianFanfics_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getAsianFanficsContent() {
        const storyDiv = document.querySelector('.story-content');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectWattpad() {
        waitForElement('div#story, div.p-story__content', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getWattpadContent();
                    downloadAsTxt(content, 'Wattpad_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getWattpadContent();
                    downloadAsPdf(content, 'Wattpad_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getWattpadContent() {
        const storyDiv = document.querySelector('div#story, div.p-story__content');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectDreame() {
        waitForElement('.reading-content', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getDreameContent();
                    downloadAsTxt(content, 'Dreame_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getDreameContent();
                    downloadAsPdf(content, 'Dreame_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getDreameContent() {
        const storyDiv = document.querySelector('.reading-content');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectInkitt() {
        waitForElement('.story-body', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getInkittContent();
                    downloadAsTxt(content, 'Inkitt_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getInkittContent();
                    downloadAsPdf(content, 'Inkitt_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getInkittContent() {
        const storyDiv = document.querySelector('.story-body');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectInkspired() {
        waitForElement('.story-content, .story-body', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getInkspiredContent();
                    downloadAsTxt(content, 'Inkspired_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getInkspiredContent();
                    downloadAsPdf(content, 'Inkspired_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getInkspiredContent() {
        const storyDiv = document.querySelector('.story-content, .story-body');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectWebNovel() {
        waitForElement('.chapter-inner, .reading-content', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getWebNovelContent();
                    downloadAsTxt(content, 'Webnovel_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getWebNovelContent();
                    downloadAsPdf(content, 'Webnovel_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getWebNovelContent() {
        const storyDiv = document.querySelector('.chapter-inner, .reading-content');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectLibri7() {
        waitForElement('.storytext', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getLibri7Content();
                    downloadAsTxt(content, 'Libri7_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getLibri7Content();
                    downloadAsPdf(content, 'Libri7_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getLibri7Content() {
        const storyDiv = document.querySelector('.storytext');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectFictionPress() {
        waitForElement('.storytext, .story-body', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getFictionPressContent();
                    downloadAsTxt(content, 'FictionPress_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getFictionPressContent();
                    downloadAsPdf(content, 'FictionPress_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getFictionPressContent() {
        const storyDiv = document.querySelector('.storytext, .story-body');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectStarsLibrary() {
        waitForElement('.story-text', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getStarsLibraryContent();
                    downloadAsTxt(content, 'StarsLibrary_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getStarsLibraryContent();
                    downloadAsPdf(content, 'StarsLibrary_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getStarsLibraryContent() {
        const storyDiv = document.querySelector('.story-text');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    function injectFimFiction() {
        waitForElement('#story', (container) => {
            if (!document.getElementById('ficlab-download-container')) {
                const dlDiv = document.createElement('div');
                dlDiv.id = 'ficlab-download-container';
                dlDiv.style.marginTop = '10px';

                const txtBtn = createButton('Download TXT', () => {
                    const content = getFimFictionContent();
                    downloadAsTxt(content, 'FimFiction_Story.txt');
                });
                const pdfBtn = createButton('Download PDF', () => {
                    const content = getFimFictionContent();
                    downloadAsPdf(content, 'FimFiction_Story.pdf');
                });
                const epubBtn = createButton('Download EPUB', () => {
                    alert('EPUB export not implemented yet.');
                });

                dlDiv.appendChild(txtBtn);
                dlDiv.appendChild(pdfBtn);
                dlDiv.appendChild(epubBtn);
                document.body.appendChild(dlDiv);
            }
        });
    }

    function getFimFictionContent() {
        const storyDiv = document.querySelector('#story');
        if (!storyDiv) {
            alert('Story content not found.');
            return '';
        }
        return storyDiv.innerText;
    }

    // --------- Initialize on script load ---------
    init();

})();

// ==UserScript==
// @name         Fiction Novel Download Buttons with EPUB & Improvements
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds download buttons (TXT, PDF, EPUB) with improved UX, content extraction, and dynamic handling.
// @author       AI
// @match        *://*.fanfiction.net/*
// @match        *://archiveofourown.org/works/*
// @match        *://literotica.com/*
// @match        *://asianfanfics.com/*
// @match        *://wattpad.com/*
// @match        *://dreame.com/*
// @match        *://inkitt.com/*
// @match        *://getinkspired.com/*
// @match        *://webnovel.com/*
// @match        *://libri7.com/*
// @match        *://fictionpress.com/*
// @match        *://starslibrary.net/*
// @match        *://fimfiction.net/*
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT 
// ==/UserScript==

(function() {
    'use strict';

    // Load CSS for floating toolbar and notifications
    GM_addStyle(`
        #ficlab-toolbar {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 8px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        }
        #ficlab-toolbar button {
            margin: 2px 4px;
            padding: 5px 10px;
            cursor: pointer;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 3px;
            font-size: 14px;
        }
        #ficlab-toolbar button:hover {
            background: #0056b3;
        }
        #ficlab-notification {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #222;
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            opacity: 0.9;
        }
    `);

    // Create floating toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'ficlab-toolbar';
    document.body.appendChild(toolbar);

    // Notification function
    function notify(message, duration=3000) {
        let notif = document.getElementById('ficlab-notification');
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'ficlab-notification';
            document.body.appendChild(notif);
        }
        notif.innerText = message;
        notif.style.display = 'block';
        clearTimeout(notif.timeout);
        notif.timeout = setTimeout(() => {
            notif.style.display = 'none';
        }, duration);
    }

    // Utility to create buttons
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onClick;
        return btn;
    }

    // Load jsPDF for PDF export
    function loadJsPDF(callback) {
        if (window.jspdf) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Load EPUB library (epub-gen)
    function loadEpubGen(callback) {
        if (window.epubGenLoaded) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/epub-gen@0.0.18/build/epub.min.js';
        script.onload = () => {
            window.epubGenLoaded = true;
            callback();
        };
        document.head.appendChild(script);
    }

    // Site-specific handlers
    const siteHandlers = [
        {
            match: /fanfiction\.net/,
            selector: '.storytext',
            getContent: () => {
                const el = document.querySelector('.storytext');
                return el ? el.innerHTML : '';
            },
            filenameBase: 'FanFiction'
        },
        {
            match: /archiveofourown\.org/,
            selector: 'div#chapter-inner, div#workskin',
            getContent: () => {
                const el = document.querySelector('div#chapter-inner, div#workskin');
                return el ? el.innerHTML : '';
            },
            filenameBase: 'AO3_Story'
        },
        {
            match: /literotica\.com/,
            selector: '.storytext, .story',
            getContent: () => {
                const el = document.querySelector('.storytext, .story');
                return el ? el.innerHTML : '';
            },
            filenameBase: 'Literotica_Story'
        },
        {
            match: /asianfanfics\.com/,
            selector: '.story-content',
            getContent: () => {
                const el = document.querySelector('.story-content');
                return el ? el.innerHTML : '';
            },
            filenameBase: 'AsianFanfics_Story'
        },
        // Add more site handlers as needed
    ];

    // Detect current site handler
    function getSiteHandler() {
        const hostname = window.location.hostname;
        for (const handler of siteHandlers) {
            if (handler.match.test(hostname)) {
                return handler;
            }
        }
        return null;
    }

    const currentHandler = getSiteHandler();

    // Basic content extraction with fallback
    function getContent() {
        if (!currentHandler) return '';
        try {
            const content = currentHandler.getContent();
            if (!content || content.trim() === '') {
                notify('Story content not found or empty.');
                return '';
            }
            return content;
        } catch (e) {
            notify('Error extracting content.');
            return '';
        }
    }

    // Create download functions
    async function downloadTxt() {
        const content = getContent();
        if (!content) return;
        const blob = new Blob([content], {type: 'text/plain'});
        GM_download({url: URL.createObjectURL(blob), name: currentHandler.filenameBase + '.txt', saveAs: true});
        notify('TXT download started.');
    }

    async function downloadPdf() {
        const content = getContent();
        if (!content) return;
        notify('Generating PDF...');
        loadJsPDF(() => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const lines = doc.splitTextToSize(content, 180);
            doc.text(lines, 10, 10);
            const blob = doc.output('blob');
            GM_download({url: URL.createObjectURL(blob), name: currentHandler.filenameBase + '.pdf', saveAs: true});
            notify('PDF download started.');
        });
    }

    async function downloadEpub() {
        const content = getContent();
        if (!content) return;
        notify('Generating EPUB...');
        loadEpubGen(() => {
            // Prepare EPUB structure
            const options = {
                title: currentHandler.filenameBase,
                author: 'Author', // Could be improved with site-specific metadata
                content: [
                    {
                        title: 'Chapter 1',
                        data: content
                    }
                ]
            };
            new window.Epub(options).generate().then((epubBlob) => {
                GM_download({url: URL.createObjectURL(epubBlob), name: currentHandler.filenameBase + '.epub', saveAs: true});
                notify('EPUB download started.');
            }).catch((err) => {
                notify('EPUB generation failed.');
                console.error(err);
            });
        });
    }

    // Add buttons to toolbar
    function setupButtons() {
        // TXT
        const btnTxt = createButton('Download TXT', downloadTxt);
        // PDF
        const btnPdf = createButton('Download PDF', downloadPdf);
        // EPUB
        const btnEpub = createButton('Download EPUB', downloadEpub);
        // Append to toolbar
        toolbar.innerHTML = ''; // Clear previous
        toolbar.appendChild(btnTxt);
        toolbar.appendChild(btnPdf);
        toolbar.appendChild(btnEpub);
    }

    // Initialize
    function init() {
        // Add buttons
        setupButtons();

        // Optional: Observe for content load if needed
        // For now, we assume static content or user clicks to download
    }

    // Run init
    init();

})();

// ==UserScript==
// @name         Fiction Novel Download Buttons with EPUB & Improvements
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds download buttons (TXT, PDF, EPUB) with improved UX, content extraction, and dynamic handling.
// @author       AI
// @match        *://*.fanfiction.net/*
// @match        *://archiveofourown.org/works/*
// @match        *://literotica.com/*
// @match        *://asianfanfics.com/*
// @match        *://wattpad.com/*
// @match        *://dreame.com/*
// @match        *://inkitt.com/*
// @match        *://getinkspired.com/*
// @match        *://webnovel.com/*
// @match        *://libri7.com/*
// @match        *://fictionpress.com/*
// @match        *://starslibrary.net/*
// @match        *://fimfiction.net/*
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT 
// ==/UserScript==

(function() {
    'use strict';

    // Load CSS for floating toolbar and notifications
    GM_addStyle(`
        #ficlab-toolbar {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 8px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        }
        #ficlab-toolbar button {
            margin: 2px 4px;
            padding: 5px 10px;
            cursor: pointer;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 3px;
            font-size: 14px;
        }
        #ficlab-toolbar button:hover {
            background: #0056b3;
        }
        #ficlab-notification {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #222;
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            opacity: 0.9;
        }
    `);

    // Create floating toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'ficlab-toolbar';
    document.body.appendChild(toolbar);

    // Notification function
    function notify(message, duration=3000) {
        let notif = document.getElementById('ficlab-notification');
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'ficlab-notification';
            document.body.appendChild(notif);
        }
        notif.innerText = message;
        notif.style.display = 'block';
        clearTimeout(notif.timeout);
        notif.timeout = setTimeout(() => {
            notif.style.display = 'none';
        }, duration);
    }

    // Utility to create buttons
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onClick;
        return btn;
    }

    // Load jsPDF for PDF export
    function loadJsPDF(callback) {
        if (window.jspdf) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Load EPUB library (epub-gen)
    function loadEpubGen(callback) {
        if (window.epubGenLoaded) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/epub-gen@0.0.18/build/epub.min.js';
        script.onload = () => {
            window.epubGenLoaded = true;
            callback();
        };
        document.head.appendChild(script);
    }

    // Site-specific handlers array
    const siteHandlers = [
        {
            match: /fanfiction\.net/,
            selector: '.storytext',
            getContent: () => {
                const el = document.querySelector('.storytext');
                return el ? el.innerText : '';
            },
            filenameBase: 'FanFiction'
        },
        {
            match: /archiveofourown\.org/,
            selector: 'div#chapter-inner, div#workskin',
            getContent: () => {
                const el = document.querySelector('div#chapter-inner, div#workskin');
                return el ? el.innerText : '';
            },
            filenameBase: 'AO3_Story'
        },
        {
            match: /literotica\.com/,
            selector: '.storytext, .story',
            getContent: () => {
                const el = document.querySelector('.storytext, .story');
                return el ? el.innerText : '';
            },
            filenameBase: 'Literotica_Story'
        },
        {
            match: /asianfanfics\.com/,
            selector: '.story-content',
            getContent: () => {
                const el = document.querySelector('.story-content');
                return el ? el.innerText : '';
            },
            filenameBase: 'AsianFanfics_Story'
        },
        {
            match: /wattpad\.com/,
            selector: 'div#story, div.p-story__content',
            getContent: () => {
                const el = document.querySelector('div#story, div.p-story__content');
                return el ? el.innerText : '';
            },
            filenameBase: 'Wattpad_Story'
        },
        {
            match: /dreame\.com/,
            selector: '.reading-content',
            getContent: () => {
                const el = document.querySelector('.reading-content');
                return el ? el.innerText : '';
            },
            filenameBase: 'Dreame_Story'
        },
        {
            match: /inkitt\.com/,
            selector: '.story-body',
            getContent: () => {
                const el = document.querySelector('.story-body');
                return el ? el.innerText : '';
            },
            filenameBase: 'Inkitt_Story'
        },
        {
            match: /getinkspired\.com/,
            selector: '.story-content, .story-body',
            getContent: () => {
                const el = document.querySelector('.story-content, .story-body');
                return el ? el.innerText : '';
            },
            filenameBase: 'Inkspired_Story'
        },
        {
            match: /webnovel\.com/,
            selector: '.chapter-inner, .reading-content',
            getContent: () => {
                const el = document.querySelector('.chapter-inner, .reading-content');
                return el ? el.innerText : '';
            },
            filenameBase: 'Webnovel_Story'
        },
        {
            match: /libri7\.com/,
            selector: '.storytext',
            getContent: () => {
                const el = document.querySelector('.storytext');
                return el ? el.innerText : '';
            },
            filenameBase: 'Libri7_Story'
        },
        {
            match: /fictionpress\.com/,
            selector: '.storytext',
            getContent: () => {
                const el = document.querySelector('.storytext');
                return el ? el.innerText : '';
            },
            filenameBase: 'FictionPress_Story'
        },
        {
            match: /starslibrary\.net/,
            selector: '.story-text',
            getContent: () => {
                const el = document.querySelector('.story-text');
                return el ? el.innerText : '';
            },
            filenameBase: 'StarsLibrary_Story'
        },
        {
            match: /fimfiction\.net/,
            selector: '#story',
            getContent: () => {
                const el = document.querySelector('#story');
                return el ? el.innerText : '';
            },
            filenameBase: 'FimFiction_Story'
        }
    ];

    // Detect current site handler
    function getSiteHandler() {
        const hostname = window.location.hostname;
        for (const handler of siteHandlers) {
            if (handler.match.test(hostname)) {
                return handler;
            }
        }
        return null;
    }

    const currentHandler = getSiteHandler();

    // Content extraction
    function getContent() {
        if (!currentHandler) {
            notify('Site not supported for content extraction.');
            return '';
        }
        try {
            const content = currentHandler.getContent();
            if (!content || content.trim() === '') {
                notify('Story content not found or empty.');
                return '';
            }
            return content;
        } catch (e) {
            notify('Error extracting content.');
            return '';
        }
    }

    // Download functions
    async function downloadTxt() {
        const content = getContent();
        if (!content) return;
        const blob = new Blob([content], {type: 'text/plain'});
        GM_download({url: URL.createObjectURL(blob), name: currentHandler.filenameBase + '.txt', saveAs: true});
        notify('TXT download started.');
    }

    async function downloadPdf() {
        const content = getContent();
        if (!content) return;
        notify('Generating PDF...');
        loadJsPDF(() => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const lines = doc.splitTextToSize(content, 180);
            doc.text(lines, 10, 10);
            const blob = doc.output('blob');
            GM_download({url: URL.createObjectURL(blob), name: currentHandler.filenameBase + '.pdf', saveAs: true});
            notify('PDF download started.');
        });
    }

    async function downloadEpub() {
        const content = getContent();
        if (!content) return;
        notify('Generating EPUB...');
        loadEpubGen(() => {
            const options = {
                title: currentHandler.filenameBase,
                author: 'Author', // Could be improved with site-specific metadata
                content: [
                    {
                        title: 'Chapter 1',
                        data: content
                    }
                ]
            };
            new window.Epub(options).generate().then((epubBlob) => {
                GM_download({url: URL.createObjectURL(epubBlob), name: currentHandler.filenameBase + '.epub', saveAs: true});
                notify('EPUB download started.');
            }).catch((err) => {
                notify('EPUB generation failed.');
                console.error(err);
            });
        });
    }

    // Setup buttons
    function setupButtons() {
        // Clear previous buttons
        toolbar.innerHTML = '';

        // Create buttons
        const btnTxt = createButton('Download TXT', downloadTxt);
        const btnPdf = createButton('Download PDF', downloadPdf);
        const btnEpub = createButton('Download EPUB', downloadEpub);

        // Append to toolbar
        toolbar.appendChild(btnTxt);
        toolbar.appendChild(btnPdf);
        toolbar.appendChild(btnEpub);
    }

    // Initialize
    function init() {
        setupButtons();
    }

    // Run on script load
    init();

})();