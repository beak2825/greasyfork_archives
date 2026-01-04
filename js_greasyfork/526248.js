// ==UserScript==
// @name         Discord Message ID Extractor
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Extract Message IDs from Discord messages and display them
// @author       AARR
// @match        https://discord.com/*
// @grant        none
// @license      You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/526248/Discord%20Message%20ID%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/526248/Discord%20Message%20ID%20Extractor.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let observer;
    let isBoxVisible = false;
    let initialBoxPosition = { x: 90, y: 110 };
    let copyFormat = 'simple';

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

    function addResizeButtons(el, initialWidth, initialHeight) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.right = '5px';
        buttonContainer.style.top = '5px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '5px';
        el.appendChild(buttonContainer);

        const enlargeButton = document.createElement('button');
        enlargeButton.textContent = '＋';
        enlargeButton.style.padding = '2px 5px';
        enlargeButton.style.fontSize = '10px';
        enlargeButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        enlargeButton.style.color = '#ffffff';
        enlargeButton.style.border = 'none';
        enlargeButton.style.borderRadius = '3px';
        enlargeButton.style.cursor = 'pointer';
        enlargeButton.style.transition = 'color 0.3s, background-color 0.3s';
        enlargeButton.onmouseenter = () => {
            enlargeButton.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
            enlargeButton.style.color = '#ffffff';
        };
        enlargeButton.onmouseleave = () => {
            enlargeButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
            enlargeButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(enlargeButton);

        const shrinkButton = document.createElement('button');
        shrinkButton.textContent = '－';
        shrinkButton.style.padding = '2px 5px';
        shrinkButton.style.fontSize = '10px';
        shrinkButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        shrinkButton.style.color = '#ffffff';
        shrinkButton.style.border = 'none';
        shrinkButton.style.borderRadius = '3px';
        shrinkButton.style.cursor = 'pointer';
        shrinkButton.style.transition = 'color 0.3s, background-color 0.3s';
        shrinkButton.onmouseenter = () => {
            shrinkButton.style.backgroundColor = 'rgba(244, 67, 54, 0.5)';
            shrinkButton.style.color = '#ffffff';
        };
        shrinkButton.onmouseleave = () => {
            shrinkButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
            shrinkButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(shrinkButton);

        enlargeButton.addEventListener('click', () => {
            el.style.height = (el.clientHeight + 150) + 'px';
        });

        shrinkButton.addEventListener('click', () => {
            el.style.width = initialWidth;
            el.style.height = initialHeight;
        });
    }

    const initialWidth = '170px';
    const initialHeight = '320px';

    const container = document.createElement('div');
    container.id = 'messageIdContainer';
    container.style.position = 'fixed';
    container.style.top = initialBoxPosition.y + 'px';
    container.style.left = initialBoxPosition.x + 'px';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.color = '#ffffff';
    container.style.padding = '5px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '1000';
    container.style.width = initialWidth;
    container.style.height = initialHeight;
    container.style.display = 'none';
    container.style.backgroundImage = 'url("https://i.imgur.com/hszPY7z.png")';
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    container.style.backgroundAttachment = 'fixed';
    container.style.backgroundRepeat = 'round';
    document.body.appendChild(container);

    makeElementDraggable(container);
    addResizeButtons(container, initialWidth, initialHeight);

    const title = document.createElement('h2');
    title.textContent = 'AARR Ex Message IDs';
    title.style.margin = '0 0 5px 0';
    title.style.fontSize = '15px';
    title.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.appendChild(title);

    const toolsLink = document.createElement('a');
    toolsLink.href = 'https://aarr-homepage.github.io/page/about5.html';
    toolsLink.target = '_blank';
    toolsLink.style.color = '#00BFFF';
    toolsLink.style.textDecoration = 'underline';
    toolsLink.style.display = 'inline-block';
    toolsLink.style.marginBottom = '10px';
    toolsLink.style.fontSize = '12px';
    toolsLink.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    toolsLink.textContent = '🔗other tools';
    container.appendChild(toolsLink);

    const formatButton = document.createElement('button');
    formatButton.textContent = 'Format: Simple IDs';
    formatButton.style.marginBottom = '10px';
    formatButton.style.fontSize = '12px';
    formatButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
    formatButton.style.color = '#ffffff';
    formatButton.style.border = 'none';
    formatButton.style.borderRadius = '3px';
    formatButton.style.cursor = 'pointer';
    formatButton.style.transition = 'color 0.3s, background-color 0.3s';
    formatButton.onmouseenter = () => {
        formatButton.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
        formatButton.style.color = '#ffffff';
    };
    formatButton.onmouseleave = () => {
        formatButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        formatButton.style.color = '#ffffff';
    };
    formatButton.addEventListener('click', () => {
        if (copyFormat === 'simple') {
            copyFormat = 'url';
            formatButton.textContent = 'Format: URL Format (/)';
        } else {
            copyFormat = 'simple';
            formatButton.textContent = 'Format: Simple IDs (,)';
        }
    });
    container.appendChild(formatButton);

    const messageIdList = document.createElement('ul');
    messageIdList.style.listStyleType = 'none';
    messageIdList.style.padding = '0';
    messageIdList.style.fontSize = '10px';
    messageIdList.style.height = 'calc(100% - 120px)';
    messageIdList.style.overflowY = 'scroll';
    messageIdList.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.appendChild(messageIdList);

    const startButton = document.createElement('button');
    startButton.textContent = ' Start ';
    startButton.style.marginTop = '5px';
    startButton.style.padding = '2px 5px';
    startButton.style.fontSize = '10px';
    startButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
    startButton.style.color = '#ffffff';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '3px';
    startButton.style.cursor = 'pointer';
    startButton.style.transition = 'color 0.3s, background-color 0.3s';
    startButton.onmouseenter = () => {
        startButton.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
        startButton.style.color = '#ffffff';
    };
    startButton.onmouseleave = () => {
        startButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        startButton.style.color = '#ffffff';
    };
    container.appendChild(startButton);

    const stopButton = document.createElement('button');
    stopButton.textContent = ' Stop ';
    stopButton.style.marginTop = '5px';
    stopButton.style.padding = '2px 5px';
    stopButton.style.fontSize = '10px';
    stopButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
    stopButton.style.color = '#ffffff';
    stopButton.style.border = 'none';
    stopButton.style.borderRadius = '3px';
    stopButton.style.cursor = 'pointer';
    stopButton.style.transition = 'color 0.3s, background-color 0.3s';
    stopButton.onmouseenter = () => {
        stopButton.style.backgroundColor = 'rgba(244, 67, 54, 0.5)';
        stopButton.style.color = '#ffffff';
    };
    stopButton.onmouseleave = () => {
        stopButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        stopButton.style.color = '#ffffff';
    };
    container.appendChild(stopButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.marginTop = '5px';
    resetButton.style.padding = '2px 5px';
    resetButton.style.fontSize = '10px';
    resetButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
    resetButton.style.color = '#ffffff';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '3px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.transition = 'color 0.3s, background-color 0.3s';
    resetButton.onmouseenter = () => {
        resetButton.style.backgroundColor = 'rgba(244, 67, 54, 0.5)';
        resetButton.style.color = '#ffffff';
    };
    resetButton.onmouseleave = () => {
        resetButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        resetButton.style.color = '#ffffff';
    };
    container.appendChild(resetButton);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy IDs';
    copyButton.style.marginTop = '5px';
    copyButton.style.padding = '2px 5px';
    copyButton.style.fontSize = '10px';
    copyButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
    copyButton.style.color = '#ffffff';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '3px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.transition = 'color 0.3s, background-color 0.3s';
    copyButton.onmouseenter = () => {
        copyButton.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
        copyButton.style.color = '#ffffff';
    };
    copyButton.onmouseleave = () => {
        copyButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        copyButton.style.color = '#ffffff';
    };
    container.appendChild(copyButton);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save File';
    saveButton.style.marginTop = '5px';
    saveButton.style.padding = '2px 5px';
    saveButton.style.fontSize = '10px';
    saveButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
    saveButton.style.color = '#ffffff';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '3px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.transition = 'color 0.3s, background-color 0.3s';
    saveButton.onmouseenter = () => {
        saveButton.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
        saveButton.style.color = '#ffffff';
    };
    saveButton.onmouseleave = () => {
        saveButton.style.backgroundColor = 'rgba(87, 87, 87, 0.5)';
        saveButton.style.color = '#ffffff';
    };
    container.appendChild(saveButton);

    function extractMessageIDs() {
        const messageElements = document.querySelectorAll('[id^="chat-messages-"]');
        const messageIds = new Set();
        messageElements.forEach(message => {
            const id = message.id.substring(14);
            messageIds.add(id);
        });
        return Array.from(messageIds);
    }

    function extractServerID() {
        const match = window.location.pathname.match(/\/channels\/(\d+)/);
        return match ? match[1] : 'your-server-id';
    }

    function updateMessageIDList() {
        const messageIds = extractMessageIDs();
        messageIds.forEach(id => {
            if (!Array.from(messageIdList.children).some(li => li.textContent === id)) {
                const listItem = document.createElement('li');
                listItem.textContent = id;
                listItem.style.color = '#3ad3e0';
                listItem.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                messageIdList.appendChild(listItem);
            }
        });
    }

    function copyMessageIDsToClipboard() {
        const serverID = extractServerID();
        const messageIds = Array.from(messageIdList.children).map(li => {
            if (copyFormat === 'simple') {
                return li.textContent.replace(/-/g, ',');
            } else {
                const ids = li.textContent.split('-');
                if (ids.length === 2) {
                    return `https://discord.com/channels/${serverID}/${ids[0]}/${ids[1]}`;
                } else {
                    return li.textContent;
                }
            }
        }).join('\n');
        navigator.clipboard.writeText(messageIds).then(() => {
        }).catch(err => {
            console.error('Failed to copy message IDs: ', err);
        });
    }

    function resetMessageIDList() {
        messageIdList.innerHTML = '';
        if (observer) {
            observer.disconnect();
        }
    }

    function saveMessageIDsToFile() {
        const serverID = extractServerID();
        const messageIds = Array.from(messageIdList.children).map(li => {
            if (copyFormat === 'simple') {
                return li.textContent.replace(/-/g, ',');
            } else {
                const ids = li.textContent.split('-');
                if (ids.length === 2) {
                    return `https://discord.com/channels/${serverID}/${ids[0]}/${ids[1]}`;
                } else {
                    return li.textContent;
                }
            }
        }).join('\n');
        const blob = new Blob([messageIds], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'message_ids.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    startButton.addEventListener('click', () => {
        if (observer) {
            observer.disconnect();
        }
        updateMessageIDList();
        observer = new MutationObserver(() => {
            setTimeout(updateMessageIDList, 1000);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    stopButton.addEventListener('click', () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    });

    copyButton.addEventListener('click', copyMessageIDsToClipboard);
    resetButton.addEventListener('click', resetMessageIDList);
    saveButton.addEventListener('click', saveMessageIDsToFile);

    const toggleImage = document.createElement('img');
    toggleImage.src = 'https://i.imgur.com/POHPOPN.png';
    toggleImage.style.position = 'fixed';
    toggleImage.style.width = '30px';
    toggleImage.style.height = '30px';
    toggleImage.style.cursor = 'pointer';
    toggleImage.style.zIndex = '1001';
    toggleImage.style.left = '70px';
    toggleImage.style.top = '0px';
    document.body.appendChild(toggleImage);

    toggleImage.addEventListener('click', () => {
        isBoxVisible = !isBoxVisible;
        container.style.display = isBoxVisible ? 'block' : 'none';
    });
})();