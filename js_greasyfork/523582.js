// ==UserScript==
// @name         authorization Extractor(β)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Extract Discord Token and display it in a draggable and resizable box without popups
// @author       AARR
// @match        https://discord.com/*
// @grant        none
// @license      You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/523582/authorization%20Extractor%28%CE%B2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523582/authorization%20Extractor%28%CE%B2%29.meta.js
// ==/UserScript==

 (function() {
    'use strict';
 
    let initialBoxPosition = { x: 10, y: 10 };
 
    function makeElementDraggable(el) {
        el.onmousedown = function(event) {
            event.preventDefault();
 
            let shiftX = event.clientX - el.getBoundingClientRect().left;
            let shiftY = event.clientY - el.getBoundingClientRect().top;
 
            function moveAt(pageX, pageY) {
                const newX = Math.min(Math.max(0, pageX - shiftX), window.innerWidth - el.offsetWidth);
                const newY = Math.min(Math.max(0, pageY - shiftY), window.innerHeight - el.offsetHeight);
                el.style.left = newX + 'px';
                el.style.top = newY + 'px';
 
                const backgroundX = initialBoxPosition.x - newX;
                const backgroundY = initialBoxPosition.y - newY;
                el.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
            }
 
            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }
 
            document.addEventListener('mousemove', onMouseMove);
 
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
 
            document.addEventListener('mouseup', onMouseUp);
        };
 
        el.ondragstart = function() {
            return false;
        };
    }
 
    function addResizeButtons(el) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.right = '10px';
        buttonContainer.style.top = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        el.appendChild(buttonContainer);
    }
 
    function createUI() {
        const initialWidth = '300px';
        const initialHeight = '200px';
 
        const container = document.createElement('div');
        container.id = 'tokenContainer';
        container.style.position = 'fixed';
        container.style.top = initialBoxPosition.y + 'px';
        container.style.left = initialBoxPosition.x + 'px';
        container.style.backgroundColor = '#2f3136';
        container.style.color = '#ffffff';
        container.style.padding = '20px';
        container.style.borderRadius = '5px';
        container.style.zIndex = '1000';
        container.style.width = initialWidth;
        container.style.height = initialHeight;
        container.style.overflowY = 'auto';
        container.style.display = 'none';
 
 
        container.style.backgroundImage = 'url("https://i.imgur.com/UEcWaCc.png")';
        container.style.backgroundRepeat = 'repeat';
        container.style.backgroundSize = 'cover';
        container.style.backgroundAttachment = 'scroll';
        container.style.backgroundPosition = '0 0';
 
        document.body.appendChild(container);
 
        makeElementDraggable(container);
        addResizeButtons(container);
 
        const title = document.createElement('h2');
        title.textContent = 'AARR Discord Token Checker β';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';
        title.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        container.appendChild(title);
 
        const toolsLink = document.createElement('a');
        toolsLink.href = 'https://addons.mozilla.org/ja/firefox/user/18913255/';
        toolsLink.target = '_blank';
        toolsLink.textContent = '🔗other tools';
        toolsLink.style.display = 'inline-block';
        toolsLink.style.marginBottom = '10px';
        toolsLink.style.fontSize = '12px';
        toolsLink.style.color = '#00BFFF';
        toolsLink.style.textDecoration = 'underline';
        toolsLink.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        container.appendChild(toolsLink);
 
        const tokenDisplay = document.createElement('code');
        tokenDisplay.style.whiteSpace = 'pre-wrap';
        tokenDisplay.style.wordBreak = 'break-word';
        tokenDisplay.style.display = 'block';
        tokenDisplay.style.marginBottom = '10px';
        tokenDisplay.style.backgroundColor = '#000000';
        tokenDisplay.style.color = '#00FF00';
        tokenDisplay.textContent = 'Failed acquisition Wait for a while and press the “Retry” button';
        container.appendChild(tokenDisplay);
 
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.padding = '10px';
        copyButton.style.backgroundColor = '#7289da';
        copyButton.style.color = '#ffffff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '3px';
        copyButton.style.cursor = 'pointer';
        container.appendChild(copyButton);
 
        copyButton.addEventListener('click', function() {
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = tokenDisplay.getAttribute('data-token');
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert("copied your authorization to clipboard.");
        });
 
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Retry';
        retryButton.style.padding = '10px';
        retryButton.style.backgroundColor = '#ff9800';
        retryButton.style.color = '#ffffff';
        retryButton.style.border = 'none';
        retryButton.style.borderRadius = '3px';
        retryButton.style.cursor = 'pointer';
        container.appendChild(retryButton);
 
        retryButton.addEventListener('click', () => {
            location.reload();
        });
 
        return { container, tokenDisplay };
    }
 
    function createToggleImage(container) {
        const toggleImage = document.createElement('img');
        toggleImage.src = 'https://i.imgur.com/BP0Cwmb.png';
        toggleImage.style.position = 'fixed';
        toggleImage.style.width = '30px';
        toggleImage.style.height = '30px';
        toggleImage.style.cursor = 'pointer';
        toggleImage.style.zIndex = '1001';
        toggleImage.style.left = '105px';
        toggleImage.style.top = '0px';
        document.body.appendChild(toggleImage);
 
        toggleImage.addEventListener('click', () => {
            const isHidden = container.style.display === 'none';
            container.style.display = isHidden ? 'block' : 'none';
        });
    }
 
    function maskToken(token) {
        return '*'.repeat(token.length);
    }
 
    function getToken(tokenDisplay) {
        let token = localStorage.getItem('token');
        if (token) {
            token = token.slice(1, -1);
            tokenDisplay.textContent = maskToken(token);
            tokenDisplay.setAttribute('data-token', token);
        }
    }
 
    const { container, tokenDisplay } = createUI();
    createToggleImage(container);
    getToken(tokenDisplay);
})();