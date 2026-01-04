// ==UserScript==
// @name         ChatGPT Artefacts
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Claude-like Artefacts inside ChatGPT Code Blocks.
// @match        https://chatgpt.com/*
// @grant        GM_addElement
// @grant        GM_addStyle
// @author       @MartianInGreen
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509205/ChatGPT%20Artefacts.user.js
// @updateURL https://update.greasyfork.org/scripts/509205/ChatGPT%20Artefacts.meta.js
// ==/UserScript==

// @attribution  https://gist.github.com/CurtisAccelerate/64a20b1d5df6240119bb0a3f4b5abf31
// Base of script made by https://github.com/CurtisAccelerate @ https://gist.github.com/CurtisAccelerate/64a20b1d5df6240119bb0a3f4b5abf31 / https://x.com/BBacktesting/status/1804481588941533255

(function() {
    'use strict';

    // Check if we're in an artefact context
    if (window.location.href.includes('/artefact') || window.parent !== window) {
        return; // Exit early if we're in an artefact or iframe
    }

    let panel;
    let isDragging = false;
    let startX;
    let startWidth;

    let chatObserver = null;

    // ---------------- Library Management ---------------- //

    const LIBRARY_KEY = 'chatgpt_artefacts_library';

    function getLibrary() {
        const library = localStorage.getItem(LIBRARY_KEY);
        return library ? JSON.parse(library) : [];
    }

    function saveLibrary(library) {
        localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    }

    function addToLibrary(code, title = `Snippet ${new Date().toLocaleString()}`, isHTML = false) {
        const library = getLibrary();
        const id = Date.now();
        library.push({ id, title, code, isHTML });
        saveLibrary(library);
        updateLibraryUI();
        updateLibraryButtonVisibility();
    }    

    function removeFromLibrary(id) {
        let library = getLibrary();
        library = library.filter(item => item.id !== id);
        saveLibrary(library);
        updateLibraryUI();
        updateLibraryButtonVisibility();
    }

    function exportLibrary() {
        const library = getLibrary();
        const dataStr = JSON.stringify(library, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chatgpt_artefacts_library.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importLibrary(jsonData) {
        try {
            const importedLibrary = JSON.parse(jsonData);
            if (Array.isArray(importedLibrary)) {
                saveLibrary(importedLibrary);
                updateLibraryUI();
                updateLibraryButtonVisibility();
                alert('Library imported successfully!');
            } else {
                alert('Invalid library format.');
            }
        } catch (e) {
            alert('Failed to parse JSON.');
        }
    }

    // ---------------- UI Elements ---------------- //

    // Create the Library Button (Book Icon)
    const toggleButton = document.createElement("button");
    toggleButton.innerHTML = "📖"; // Book Icon
    // KEEP SIZES LIKE THIS! THEY MATCH THE SIZES OF THE OTHER BUTTONS IN THE CHATGPT UI
    toggleButton.style.fontSize = "10px";
    toggleButton.style.position = "fixed";
    toggleButton.style.bottom = "12px";
    toggleButton.style.right = "40px";
    toggleButton.style.width = "22px";
    toggleButton.style.height = "22px";
    toggleButton.style.backgroundColor = "#212121";
    toggleButton.style.color = "#fff";
    toggleButton.style.border = "2px solid #676767";
    toggleButton.style.borderRadius = "50%";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    toggleButton.style.zIndex = "10000";
    toggleButton.style.display = "flex"; // Make it visible
    toggleButton.style.justifyContent = "center";
    toggleButton.style.alignItems = "center";

    document.body.appendChild(toggleButton);

    // Create the Library Pop-up
    const libraryContainer = document.createElement('div');
    libraryContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 60%;
        background: #2c2c2c;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        border-radius: 8px;
        z-index: 12000;
        display: none;
        flex-direction: column;
        color: #e0e0e0;
        font-family: Arial, sans-serif;
    `;

    // Header
    const libraryHeader = document.createElement('div');
    libraryHeader.style.cssText = `
        padding: 15px;
        background: #1e1e1e;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: move;
    `;
    const libraryTitle = document.createElement('span');
    libraryTitle.textContent = "Library";
    libraryTitle.style.fontSize = "18px";
    const closeLibraryButton = document.createElement('button');
    closeLibraryButton.textContent = "✖";
    closeLibraryButton.style.cssText = `
        background: none;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
    `;
    closeLibraryButton.onclick = () => {
        libraryContainer.style.display = 'none';
        toggleButton.style.display = "flex";
    };
    libraryHeader.appendChild(libraryTitle);
    libraryHeader.appendChild(closeLibraryButton);
    libraryContainer.appendChild(libraryHeader);

    // Library Content
    const libraryContent = document.createElement('div');
    libraryContent.style.cssText = `
        padding: 20px;
        overflow-y: auto;
        flex-grow: 1;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-auto-rows: min-content;
        gap: 15px;
    `;
    libraryContainer.appendChild(libraryContent);

    // Footer with Add, Export, Import
    const libraryFooter = document.createElement('div');
    libraryFooter.style.cssText = `
        padding: 15px;
        background: #1e1e1e;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    `;
    const addButton = document.createElement('button');
    addButton.textContent = "➕ Add";
    addButton.style.cssText = `
        padding: 8px 16px;
        background: #4CAF50;
        border: none;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;
    addButton.onclick = () => {
        const title = prompt("Enter a title for the snippet:", `Snippet ${new Date().toLocaleString()}`);
        if (title === null) return; // Cancelled
        const code = prompt("Enter the code for the snippet:");
        if (code === null) return; // Cancelled
        addToLibrary(code, title);
    };

    const exportButton = document.createElement('button');
    exportButton.textContent = "⬇️ Export";
    exportButton.style.cssText = `
        padding: 8px 16px;
        background: #2196F3;
        border: none;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;
    exportButton.onclick = exportLibrary;

    const importButton = document.createElement('button');
    importButton.textContent = "⬆️ Import";
    importButton.style.cssText = `
        padding: 8px 16px;
        background: #FF9800;
        border: none;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;
    importButton.onclick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                importLibrary(event.target.result);
            };
            reader.readAsText(file);
        };
        fileInput.click();
    };

    libraryFooter.appendChild(addButton);
    const footerButtons = document.createElement('div');
    footerButtons.appendChild(exportButton);
    footerButtons.appendChild(importButton);
    libraryFooter.appendChild(footerButtons);
    libraryContainer.appendChild(libraryFooter);

    document.body.appendChild(libraryContainer);

    // Toggle Library Pop-up
    toggleButton.addEventListener("click", () => {
        libraryContainer.style.display = libraryContainer.style.display === "none" ? "flex" : "none";
        toggleButton.style.display = libraryContainer.style.display === "flex" ? "none" : "flex";
    });    

    // Update Library Button Visibility
    function updateLibraryButtonVisibility() {
        const library = getLibrary();
        if (library.length > 0) {
            toggleButton.style.display = "flex";
        } else {
            toggleButton.style.display = "none";
            libraryContainer.style.display = "none";
        }
    }

    // Update Library UI
    function updateLibraryUI() {
        libraryContent.innerHTML = '';
        const library = getLibrary();
        if (library.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = "Library is empty.";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.color = "#777";
            emptyMsg.style.gridColumn = "1 / -1";
            libraryContent.appendChild(emptyMsg);
            return;
        }

        library.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: #3c3c3c;
                border: 1px solid #555;
                border-radius: 8px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: #fff;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: default;
                height: 140px; /* Reduced height */
            `;
            card.addEventListener('mouseenter', () => {
                card.style.transform = "scale(1.02)";
                card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = "scale(1)";
                card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
            });

            const title = document.createElement('h3');
            title.textContent = item.title;
            title.style.cssText = `
                margin: 0 0 10px 0;
                font-size: 16px;
                word-break: break-word;
                height: 40px;
                overflow: hidden;
            `;
            card.appendChild(title);

            const actions = document.createElement('div');
            actions.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: auto;
            `;

            // Left Actions: Open Sidebar and Open in New Tab
            const leftActions = document.createElement('div');
            leftActions.style.cssText = `
                display: flex;
                gap: 5px;
            `;

            // Open in Sidebar Button
            const openSidebarButton = document.createElement('button');
            openSidebarButton.textContent = "🔍";
            openSidebarButton.title = "Open in Sidebar";
            openSidebarButton.style.cssText = `
                padding: 6px;
                background: #4CAF50;
                border: none;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                width: 32px;
                height: 32px;
            `;
            openSidebarButton.onclick = (e) => {
                e.stopPropagation();

                let htmlDoc;

                if (item.isHTML) {
                    htmlDoc = item.code;
                    createSlideOutPanel(htmlDoc, item.isHTML);
                } else {
                    const parser = new DOMParser();
                    htmlDoc = parser.parseFromString(item.code, 'text/html');
                }

                // Close the library pop-up
                libraryContainer.style.display = "none";
                toggleButton.style.display = "flex";

                createSlideOutPanel(htmlDoc, item.isHTML);
            };

            // Open in New Tab Button
            const openTabButton = document.createElement('button');
            openTabButton.textContent = "🌐";
            openTabButton.title = "Open in New Tab";
            openTabButton.style.cssText = `
                padding: 6px;
                background: #2196F3;
                border: none;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                width: 32px;
                height: 32px;
            `;
            openTabButton.onclick = (e) => {
                e.stopPropagation();

                let htmlDoc;

                if (item.isHTML) {
                    htmlDoc = item.code;
                    createSlideOutPanel(htmlDoc, item.isHTML);
                } else {
                    const parser = new DOMParser();
                    htmlDoc = parser.parseFromString(item.code, 'text/html');
                }

                openCodeInNewTab(htmlDoc, item.isHTML);
            };

            leftActions.appendChild(openSidebarButton);
            leftActions.appendChild(openTabButton);

            // Right Actions: Copy Code and Delete
            const rightActions = document.createElement('div');
            rightActions.style.cssText = `
                display: flex;
                gap: 5px;
            `;

            // Copy Code Button
            const copyButton = document.createElement('button');
            copyButton.textContent = "📋";
            copyButton.title = "Copy Code";
            copyButton.style.cssText = `
                padding: 6px;
                background: #9C27B0;
                border: none;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                width: 32px;
                height: 32px;
            `;
            copyButton.onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(item.code).then(() => {
                    // Temporarily change button text to indicate success
                    const originalText = copyButton.textContent;
                    copyButton.textContent = "✅";
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy code. Please try again.');
                });
            };

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "🗑️";
            deleteButton.title = "Delete";
            deleteButton.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: #e74c3c;
                width: 32px;
                height: 32px;
            `;
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Delete "${item.title}" from library?`)) {
                    removeFromLibrary(item.id);
                }
            };

            rightActions.appendChild(copyButton);
            rightActions.appendChild(deleteButton);

            actions.appendChild(leftActions);
            actions.appendChild(rightActions);

            card.appendChild(actions);

            libraryContent.appendChild(card);
        });
    }

    // Helper Function to Escape HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Function to Open Code in New Tab
    function openCodeInNewTab(codeBlock, isHTML) {
        const currentUrl = window.location.href;
        const newUrl = currentUrl + '/artefact';

        let codeBlockContent = codeBlock;
        let codeElement;
        let languageMatch;
        let language;

        if (!isHTML) {
            codeBlockContent = codeBlock.querySelector('code').innerText;
            codeElement = codeBlock.querySelector('code');
            languageMatch = codeElement ? codeElement.className.match(/language-(\w+)/) : null;
            language = languageMatch ? languageMatch[1] : 'unknown';
        } 

        if (language === 'html') {
            isHTML = true;
        }

        const newWindow = window.open(newUrl, '_blank');
        if (newWindow) {
            newWindow.document.open();
            if (isHTML) {
                newWindow.document.write(codeBlockContent);
            } else {
                // Get the content of the code block by removing the outer <div><code></code></div> structure
                console.log("Code block Language: " + language);

                if (language === 'mermaid') {
                    newWindow.document.write(`
                        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
                        <div class="mermaid">
                            ${codeBlockContent}
                        </div>
                        <script>
                            mermaid.initialize({ startOnLoad: true });
                        </script>
                    `);
                } if (language === 'md' || language === 'markdown') {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    doc.open();
                    // Use markdown library to properly render and parse markdown
                    doc.write(`
                        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                        <div id="content"></div>
                        <script>
                            document.getElementById('content').innerHTML = marked.parse(\`${codeBlockContent.replace(/`/g, '\\`')}\`);
                        </script>
                    `);
                    doc.close();
                } else {
                    // If not any of the additionally supported file types, assume it's plain text code
                    newWindow.document.write(`<pre>${escapeHtml(codeBlockContent)}</pre>`);
                }
            }

            // Update the URL display without navigating
            newWindow.history.pushState(null, '', newUrl);

            newWindow.document.close();
        } else {
            alert('Failed to open new tab. Please allow pop-ups for this site.');
        }
    }

    // Function to Create Slide-Out Panel

    function createSlideOutPanel(codeBlock, isHTML) {
        if (panel) {
            panel.remove();
        }

        panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 600px;
            height: 100%;
            background: #f7f7f8;
            box-shadow: -2px 0 5px rgba(0,0,0,0.3);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px;
            background: #282c34;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            background: #ff5f57;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            color: white;
        `;
        closeButton.onclick = () => panel.style.transform = 'translateX(100%)';

        header.appendChild(closeButton);
        panel.appendChild(header);

        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            padding: 10px;
            overflow-y: auto;
            flex-grow: 1;
        `;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            margin: 0;
            padding: 0;
        `;
        contentContainer.appendChild(iframe);
        panel.appendChild(contentContainer);

        document.body.appendChild(panel);

        console.log(codeBlock);

        let codeBlockContent = codeBlock;
        let codeElement;
        let languageMatch;
        let language;

        if (!isHTML) {
            codeBlockContent = codeBlock.querySelector('code').innerText;
            codeElement = codeBlock.querySelector('code');
            languageMatch = codeElement ? codeElement.className.match(/language-(\w+)/) : null;
            language = languageMatch ? languageMatch[1] : 'unknown';
        } 

        if (language === 'html') {
            isHTML = true;
        }

        if (isHTML === false) {
            // Get the content of the code block by removing the outer <div><code></code></div> structure
            console.log("Code block Language: " + language);

            if (language === 'mermaid') {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(`
                    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
                    <div class="mermaid">
                        ${codeBlockContent}
                    </div>
                    <script>
                        mermaid.initialize({ startOnLoad: true });
                    </script>
                `);
                doc.close();
            } if (language === 'md' || language === 'markdown') {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                // Use markdown library to properly render and parse markdown
                doc.write(`
                    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                    <div id="content"></div>
                    <script>
                        document.getElementById('content').innerHTML = marked.parse(\`${codeBlockContent.replace(/`/g, '\\`')}\`);
                    </script>
                `);
                doc.close();
            } else {
                // If not any of the additionally supported file types, assume it's plain text code
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(`<pre>${escapeHtml(codeBlockContent)}</pre>`);
                doc.close();
            }
            
        } else if (isHTML === true) {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(codeBlockContent);
            doc.close();
        }

        setTimeout(() => panel.style.transform = 'translateX(0)', 0);

        header.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', dragPanel);
        document.addEventListener('mouseup', stopDragging);

        // Close the panel if clicking outside
        document.addEventListener('click', function(event) {
            if (!panel.contains(event.target)) {
                panel.style.transform = 'translateX(100%)';
            }
        }, { once: true });
    }

    function addButtonsNextToCopy(codeBlock) {
        const outerContainer = codeBlock.closest('.relative');
        if (!outerContainer) return;

        const copyButtonContainer = outerContainer.querySelector('.absolute.bottom-0.right-2');
        if (!copyButtonContainer) return;

        // Check if the buttons are already added to prevent duplicates
        if (outerContainer.querySelector('.run-demo-button') || outerContainer.querySelector('.open-tab-button') || outerContainer.querySelector('.save-button')) {
            return;
        }

        // Create a new span for our custom buttons
        const customButtonsSpan = document.createElement('span');
        customButtonsSpan.className = 'custom-buttons-span';
        customButtonsSpan.style.cssText = `
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 5px;
        `;

        const buttonStyle = `
            padding: 0 8px;  /* Adjust padding to control the button's width */
            height: 24px;  /* Set the fixed height to 24px */
            background: #2f2f2f;
            border: none;
            color: #b4b4b4;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;  /* Center the text */
            transition: background 0.3s, color 0.3s;
            margin-left: 4px;
        `;

        // Create "Run Demo" button
        const runDemoButton = document.createElement('button');
        runDemoButton.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 4px; display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <div>Open Demo</div>
            </div>
        `;
        runDemoButton.className = 'run-demo-button custom-tooltip';
        runDemoButton.style.cssText = buttonStyle;
        runDemoButton.onclick = (e) => {
            e.stopPropagation();
            createSlideOutPanel(codeBlock, false);
        };

        // Create "Open in New Tab" button
        const openTabButton = document.createElement('button');
        openTabButton.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 4px; display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </div>
                <div>Tab</div>
            </div>
        `;
        openTabButton.className = 'open-tab-button custom-tooltip';
        openTabButton.style.cssText = buttonStyle;
        openTabButton.onclick = (e) => {
            e.stopPropagation();
            openCodeInNewTab(codeBlock);
        };

        // Create "Save" button
        const saveButton = document.createElement('button');
        saveButton.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 4px; display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                </div>
                <div>Save</div>
            </div>
        `;
        saveButton.className = 'save-button custom-tooltip';
        saveButton.style.cssText = buttonStyle;
        saveButton.onclick = (e) => {
            e.stopPropagation();
            const codeElement = codeBlock.querySelector('code');
            const isHTML = !codeElement;
            const codeText = isHTML ? codeBlock.innerHTML : codeBlock.outerHTML;
            const title = prompt("Enter a title for the saved snippet:", `Snippet ${new Date().toLocaleString()}`);
            if (title === null || title.trim() === "") {
                alert("Save cancelled or invalid title.");
                return;
            }
            addToLibrary(codeText, title.trim(), isHTML);
            alert(`"${title.trim()}" has been saved to your library.`);
        };        

        // Add hover effects
        [runDemoButton, openTabButton, saveButton].forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.background = '#3f3f3f';
                button.style.color = '#ffffff';
            });
            button.addEventListener('mouseout', () => {
                button.style.background = '#2f2f2f';
                button.style.color = '#b4b4b4';
            });
        });

        // Add hover text for the buttons
        runDemoButton.setAttribute('data-hover-text', 'Open Demo in Slideout Panel');
        openTabButton.setAttribute('data-hover-text', 'Open in New Tab');
        saveButton.setAttribute('data-hover-text', 'Save to Library');

        // Add the new buttons to the custom span
        customButtonsSpan.appendChild(runDemoButton);
        customButtonsSpan.appendChild(openTabButton);
        customButtonsSpan.appendChild(saveButton);

        // Insert the custom span before the existing span containing the "Copy code" button
        copyButtonContainer.insertBefore(customButtonsSpan, copyButtonContainer.firstChild);
    }

    function processCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.overflow-y-auto');
        codeBlocks.forEach(codeBlock => {
            if (codeBlock.closest('.markdown')) {
                addButtonsNextToCopy(codeBlock);
            }
        });
    }

    function observeChat() {
        chatObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const codeBlocks = node.querySelectorAll('.overflow-y-auto');
                            codeBlocks.forEach(codeBlock => {
                                if (codeBlock.closest('.markdown')) {
                                    addButtonsNextToCopy(codeBlock);
                                }
                            });
                        }
                    });
                }
            });
        });

        const chatContainer = document.querySelector('main');
        if (chatContainer) {
            chatObserver.observe(chatContainer, { childList: true, subtree: true });
        }
    }

    function checkAndReinitialize() {
        const chatContainer = document.querySelector('main');
        if (!chatContainer || !chatObserver) {
            console.log("ChatGPT Artefacts: Observer not running or chat container missing, reinitializing...");
            reinitializeProcessor();
        } else {
            // Check if the observer is still connected to the DOM
            const observerActive = Array.from(chatObserver.takeRecords()).length > 0 || 
                                   chatObserver.observe(chatContainer, { childList: true, subtree: true });

            if (!observerActive) {
                reinitializeProcessor();
            }
        }
    }    

    function setupPeriodicCheck() {
        setInterval(checkAndReinitialize, 10000); // Check every 10 seconds
    }    

    function addIndicator() {
        const indicator = document.createElement('div');
        indicator.textContent = 'Artefacts Active';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border-radius: 5px;
            font-size: 12px;
        `;
        document.body.appendChild(indicator);
        setTimeout(() => indicator.style.display = 'none', 3000);
    }

    function initializeProcessor() {
        addIndicator();
        processCodeBlocks();
        observeChat();
        setupPeriodicCheck();
        updateLibraryButtonVisibility();
        updateLibraryUI();
    }

    function reinitializeProcessor() {
        try {
            chatObserver.disconnect();
            chatObserver = null;
        } catch (e) { }

        processCodeBlocks();
        observeChat();
    }

    // Use MutationObserver to wait for the chat interface to load
    const bodyObserver = new MutationObserver((mutations) => {
        if (document.querySelector('main')) {
            bodyObserver.disconnect();
            setTimeout(initializeProcessor, 500); // Delay execution by 0.5 seconds
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Dragging functionality for the slide-out panel
    function startDragging(e) {
        isDragging = true;
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        document.documentElement.addEventListener('mousemove', dragPanel, false);
        document.documentElement.addEventListener('mouseup', stopDragging, false);
    }

    function dragPanel(e) {
        if (!isDragging) return;
        let newWidth = startWidth - (e.clientX - startX);
        if (newWidth < 300) newWidth = 300;
        if (newWidth > 900) newWidth = 900;
        panel.style.width = newWidth + 'px';
    }

    function stopDragging(e) {
        isDragging = false;
        document.documentElement.removeEventListener('mousemove', dragPanel, false);
        document.documentElement.removeEventListener('mouseup', stopDragging, false);
    }

})();

GM_addStyle(`
    .custom-tooltip {
        position: relative;
        z-index: 10;
    }
    .custom-tooltip::after {
        content: attr(data-hover-text);
        position: absolute;
        bottom: 120%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 11;
    }c
    .custom-tooltip:hover::after {
        opacity: 1;
    }
    .custom-tooltip:hover + [role="tooltip"] {
        display: none !important;
    }
`);
