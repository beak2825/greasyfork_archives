// ==UserScript==
// @name         Greasyfork Code Copier
// @description  Add a copy button for script code.
// @icon         https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @version      1.5
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://greasyfork.org/*/scripts/*
// @match        https://sleazyfork.org/*/scripts/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518206/Greasyfork%20Code%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/518206/Greasyfork%20Code%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function createSVGIcon(path) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 384 512");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        
        const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconPath.setAttribute("d", path);
        iconPath.setAttribute("fill", "currentColor");
        
        svg.appendChild(iconPath);
        return svg;
    }

    function createCopyButton(scriptUrl) {
        const initialIconPath = 'M145.5 68c5.3-20.7 24.1-36 46.5-36s41.2 15.3 46.5 36c1.8 7.1 8.2 12 15.5 12l18 0c8.8 0 16 7.2 16 16l0 32-96 0-96 0 0-32c0-8.8 7.2-16 16-16l18 0c7.3 0 13.7-4.9 15.5-12zM192 0c-32.8 0-61 19.8-73.3 48L112 48C91.1 48 73.3 61.4 66.7 80L64 80C28.7 80 0 108.7 0 144L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-304c0-35.3-28.7-64-64-64l-2.7 0c-6.6-18.6-24.4-32-45.3-32l-6.7 0C253 19.8 224.8 0 192 0zM320 112c17.7 0 32 14.3 32 32l0 304c0 17.7-14.3 32-32 32L64 480c-17.7 0-32-14.3-32-32l0-304c0-17.7 14.3-32 32-32l0 16c0 17.7 14.3 32 32 32l96 0 96 0c17.7 0 32-14.3 32-32l0-16zM208 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM136 272a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm40-16c-8.8 0-16 7.2-16 16s7.2 16 16 16l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0zm0 96c-8.8 0-16 7.2-16 16s7.2 16 16 16l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0zm-64 40a24 24 0 1 0 0-48 24 24 0 1 0 0 48z';
        const alternateIconPath = 'M145.5 68c5.3-20.7 24.1-36 46.5-36s41.2 15.3 46.5 36c1.8 7.1 8.2 12 15.5 12l18 0c8.8 0 16 7.2 16 16l0 32-96 0-96 0 0-32c0-8.8 7.2-16 16-16l18 0c7.3 0 13.7-4.9 15.5-12zM192 0c-32.8 0-61 19.8-73.3 48L112 48C91.1 48 73.3 61.4 66.7 80L64 80C28.7 80 0 108.7 0 144L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-304c0-35.3-28.7-64-64-64l-2.7 0c-6.6-18.6-24.4-32-45.3-32l-6.7 0C253 19.8 224.8 0 192 0zM320 112c17.7 0 32 14.3 32 32l0 304c0 17.7-14.3 32-32 32L64 480c-17.7 0-32-14.3-32-32l0-304c0-17.7 14.3-32 32-32l0 16c0 17.7 14.3 32 32 32l96 0 96 0c17.7 0 32-14.3 32-32l0-16zM208 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm91.3 171.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L160 345.4l-52.7-52.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l64 64c6.2 6.2 16.4 6.2 22.6 0l128-128z';
        
        const copyButton = document.createElement("a");
        copyButton.className = "install-help-link";
        copyButton.href = "javascript:void(0)";
        copyButton.style.marginLeft = "5px";
        copyButton.style.borderRadius = "10%";
        
        const icon = createSVGIcon(initialIconPath);
        
        copyButton.appendChild(icon);
        
        copyButton.addEventListener("click", function(event) {
            event.preventDefault();
            
            icon.firstChild.setAttribute("d", alternateIconPath);
            
            GM_xmlhttpRequest({
                method: "GET",
                url: scriptUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        GM_setClipboard(response.responseText);
                        
                        setTimeout(() => {
                            icon.firstChild.setAttribute("d", initialIconPath);
                        }, 500);
                    } else {
                        setTimeout(() => {
                            icon.firstChild.setAttribute("d", initialIconPath);
                        }, 500);
                    }
                },
                onerror: function() {
                    setTimeout(() => {
                        icon.firstChild.setAttribute("d", initialIconPath);
                    }, 500);
                }
            });
        });
        
        return copyButton;
    }

    function createLinesIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 640 512");
        svg.setAttribute("width", "14");
        svg.setAttribute("height", "14");
        svg.style.marginRight = "5px";
        svg.style.position = "relative";
        svg.style.top = "0";
        
        const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconPath.setAttribute("d", "M399.1 1.1c-12.7-3.9-26.1 3.1-30 15.8l-144 464c-3.9 12.7 3.1 26.1 15.8 30s26.1-3.1 30-15.8l144-464c3.9-12.7-3.1-26.1-15.8-30zm71.4 118.5c-9.1 9.7-8.6 24.9 1.1 33.9L580.9 256 471.6 358.5c-9.7 9.1-10.2 24.3-1.1 33.9s24.3 10.2 33.9 1.1l128-120c4.8-4.5 7.6-10.9 7.6-17.5s-2.7-13-7.6-17.5l-128-120c-9.7-9.1-24.9-8.6-33.9 1.1zm-301 0c-9.1-9.7-24.3-10.2-33.9-1.1l-128 120C2.7 243 0 249.4 0 256s2.7 13 7.6 17.5l128 120c9.7 9.1 24.9 8.6 33.9-1.1s8.6-24.9-1.1-33.9L59.1 256 168.4 153.5c9.7-9.1 10.2-24.3 1.1-33.9z");
        iconPath.setAttribute("fill", "currentColor");
        
        svg.appendChild(iconPath);
        return svg;
    }

    function countLines(scriptUrl) {
        GM_xmlhttpRequest({
            method: "GET",
            url: scriptUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const totalLines = response.responseText.split('\n').length;
                    const correctedLines = Math.max(0, totalLines - 2);
                    displayLineCount(correctedLines);
                }
            }
        });
    }

    function formatLineCount(count) {
        return count >= 1000 ? count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : count.toString();
    }

    function displayLineCount(count) {
        const wrapLinesLabel = document.querySelector('label[for="wrap-lines"]');
        if (wrapLinesLabel) {
            let lineCountContainer = document.getElementById('line-count-display');
            
            if (!lineCountContainer) {
                lineCountContainer = document.createElement('div');
                lineCountContainer.id = 'line-count-display';
                lineCountContainer.style.fontSize = '13px';
                lineCountContainer.style.display = 'flex';
                lineCountContainer.style.alignItems = 'center';
                
                const containerDiv = document.createElement('div');
                containerDiv.style.display = 'flex';
                containerDiv.style.justifyContent = 'space-between';
                containerDiv.style.alignItems = 'center';
                containerDiv.style.width = '100%';
                
                const parentDiv = wrapLinesLabel.parentNode;
                
                const wrapLinesDiv = document.createElement('div');
                wrapLinesDiv.appendChild(document.getElementById('wrap-lines'));
                wrapLinesDiv.appendChild(wrapLinesLabel);
                
                containerDiv.appendChild(wrapLinesDiv);
                containerDiv.appendChild(lineCountContainer);
                
                parentDiv.replaceWith(containerDiv);
            }
            
            const linesIcon = createLinesIcon();
            
            lineCountContainer.innerHTML = '';
            
            lineCountContainer.appendChild(linesIcon);
            
            const textSpan = document.createElement('span');
            textSpan.style.fontSize = '13px';
            textSpan.style.position = 'relative';
            textSpan.textContent = formatLineCount(count);
            lineCountContainer.appendChild(textSpan);
        }
    }

    function initialize() {
        const installButton = document.querySelector(".install-link");
        if (installButton) {
            const scriptUrl = installButton.href;
            
            const helpLink = document.querySelector(".install-help-link");
            if (helpLink) {
                const copyButton = createCopyButton(scriptUrl);
                
                helpLink.parentNode.insertBefore(copyButton, helpLink.nextSibling);
                
                countLines(scriptUrl);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();