// ==UserScript==
// @name         Gemoo Downloader
// @version      2024-09-07
// @description  Download videos from Gemoo
// @author       Snoofz
// @match        https://gemoo.com/tools/upload-video/share/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemoo.com
// @grant        none
// @namespace https://greasyfork.org/users/1364648
// @downloadURL https://update.greasyfork.org/scripts/507385/Gemoo%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/507385/Gemoo%20Downloader.meta.js
// ==/UserScript==

class Log {
    static info(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #7289da;');
    }

    static tool(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #FFB6C1;');
    }

    static welcome(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 25px; color: #ff0000;');
    }

    static error(message) {
        console.error(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #dc3545;');
    }

    static success(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #28a745;');
    }
}

class UIManager {
    constructor() {
        this.UIContext = null;
        this.UIMenus = [];
        this.tabs = [];
        this.notificationStack = [];
        this.notificationHeight = 100;
        this.notificationMargin = 10;
    }

    getAllTabs() {
        return this.tabs;
    }

    createNotification(titleText, descriptionText) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-popup';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.left = '10px';
        notificationContainer.style.bottom = this.calculateNotificationBottom() + 'px';
        notificationContainer.style.transform = 'translateY(100%)';
        notificationContainer.style.backgroundColor = '#0e0e0e';
        notificationContainer.style.color = '#ffffff';
        notificationContainer.style.width = '300px';
        notificationContainer.style.padding = '20px';
        notificationContainer.style.borderRadius = '8px';
        notificationContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        notificationContainer.style.zIndex = '9999';
        notificationContainer.style.transition = 'transform 0.3s ease-in-out';

        const title = document.createElement('h2');
        title.textContent = titleText;
        title.style.fontSize = '22px';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        title.classList.add('rainbow-animation');

        const description = document.createElement('p');
        description.textContent = descriptionText;
        description.style.fontSize = '16px';
        description.style.textAlign = 'center';
        description.classList.add('rainbow-animation');

        notificationContainer.appendChild(title);
        notificationContainer.appendChild(description);

        document.body.appendChild(notificationContainer);

        setTimeout(() => {
            notificationContainer.style.transform = 'translateY(0)';
        }, 50);

        setTimeout(() => {
            notificationContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                this.removeNotification(notificationContainer);
                document.body.removeChild(notificationContainer);
            }, 300);
        }, 5000);

        this.makeDraggable(notificationContainer);

        this.notificationStack.push(notificationContainer);
    }

    calculateNotificationBottom() {
        let totalHeight = this.notificationMargin;
        this.notificationStack.forEach(notification => {
            totalHeight += notification.offsetHeight + this.notificationMargin;
        });
        return totalHeight;
    }

    removeNotification(notification) {
        const index = this.notificationStack.indexOf(notification);
        if (index !== -1) {
            this.notificationStack.splice(index, 1);
        }
        this.repositionNotifications();
    }

    repositionNotifications() {
        let totalHeight = this.notificationMargin;
        this.notificationStack.forEach(notification => {
            notification.style.bottom = totalHeight + 'px';
            totalHeight += notification.offsetHeight + this.notificationMargin;
        });
    }

    createMenu(elementId, titleText, width = '300px', height = 'auto') {
        const container = document.createElement('div');
        container.id = elementId;
        container.style.position = 'fixed';
        container.style.backgroundColor = '#0e0e0e';
        container.style.borderRadius = '8px';
        container.style.padding = '20px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        container.style.zIndex = '9999';
        container.style.width = width;
        container.style.height = height;

        container.style.top = `calc(50% - (${height} / 2))`;
        container.style.left = `calc(50% - (${width} / 2))`;

        container.style.userSelect = 'none';

        container.style.overflowY = 'auto';
        container.className = 'custom-scrollbar';

        const title = document.createElement('h2');
        title.textContent = titleText;
        title.style.color = '#ffffff';
        title.style.marginBottom = '20px';
        title.style.fontSize = '22px';
        title.style.textAlign = 'center';
        title.style.marginTop = '0px';
        title.classList.add('rainbow-animation');

        container.appendChild(title);

        document.body.appendChild(container);

        this.UIContext = container;

        return container;
    }

    makeDraggable(element) {
        let offsetX, offsetY;

        function handleMouseDown(event) {
            event.preventDefault();
            const boundingRect = element.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;

            console.log(`x: ${event.clientX}, y: ${event.clientY}, Offsetx: ${offsetX}, Offsety: ${offsetY}`)

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        function handleMouseMove(event) {
            moveElement(event.clientX, event.clientY);
        }

        function moveElement(clientX, clientY) {
            element.style.left = clientX - offsetX + 'px';
            element.style.top = clientY - offsetY + 'px';
        }

        function handleMouseUp() {
            cleanupListeners();
        }

        function handleTouchEnd() {
            cleanupListeners();
        }

        function cleanupListeners() {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        const titleBar = element.querySelector('h2');
        titleBar.addEventListener('mousedown', handleMouseDown);

        element.style.position = 'absolute';
        titleBar.style.cursor = 'move';
        titleBar.style.userSelect = 'none';
    }

    addButton(buttonText, buttonAction) {
        const button = document.createElement('button');
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.backgroundColor = '#1c1c1c';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginBottom = '10px';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '16px';
        button.addEventListener('click', buttonAction);
        button.classList.add('rainbow-animation');

        const buttonTextSpan = document.createElement('span');
        buttonTextSpan.textContent = buttonText;
        button.appendChild(buttonTextSpan);

        this.UIContext.appendChild(button);

        return button;
    }

    addLabel(labelText) {
        const label = document.createElement('h3');
        label.textContent = labelText;
        label.style.color = '#ffffff';
        label.style.marginBottom = '20px';
        label.style.fontSize = '18px';
        label.style.textAlign = 'center';
        label.classList.add('rainbow-animation');

        this.UIContext.appendChild(label);

        return label;
    }

    addSpacer(height) {
        const spacer = document.createElement('div');
        spacer.style.width = '100%';
        spacer.style.height = `${height}px`;
        spacer.style.marginBottom = `${height}px`;

        this.UIContext.appendChild(spacer);

        return spacer;
    }

    addTextInput(placeholderText, valueChangeAction) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholderText;
        input.style.width = 'calc(100% - 1px)';
        input.style.padding = '10px';
        input.style.marginBottom = '20px';
        input.style.borderRadius = '5px';
        input.addEventListener('input', valueChangeAction);
        input.style.backgroundColor = '#0e0e0e';
        input.classList.add('rainbow-animation');
        input.focus();

        this.UIContext.appendChild(input);
        input.focus();

        return input;
    }

    addSlider(min, max, step, currentValue, customText, valueChangeAction) {
        let textBubble = undefined;
        let hideTimeout = null;

        const sliderContainer = document.createElement('div');
        sliderContainer.style.width = 'calc(100% - 1px)';
        sliderContainer.style.marginBottom = '20px';
        sliderContainer.style.position = 'relative';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = currentValue;
        slider.step = step;
        slider.style.width = '100%';
        slider.style.borderRadius = '5px';

        const showBubble = () => {
            clearTimeout(hideTimeout);
            textBubble.style.opacity = 1;
            hideTimeout = setTimeout(() => {
                textBubble.style.opacity = 0;
            }, 3000);
        };

        slider.addEventListener('input', () => {
            valueChangeAction(slider.value);
            textBubble.textContent = `${customText}: ${slider.value}`;
            const sliderWidth = slider.offsetWidth;
            const bubbleWidth = textBubble.offsetWidth;
            const sliderValue = slider.value;
            const newPosition = (sliderValue / (max - min)) * sliderWidth;
            const adjustedPosition = Math.min(Math.max(newPosition, bubbleWidth / 2), sliderWidth - bubbleWidth / 2);
            textBubble.style.left = `${adjustedPosition}px`;
            showBubble();
        });

        slider.addEventListener('mousedown', showBubble);
        slider.addEventListener('touchstart', showBubble);

        slider.classList.add('rainbow-animation');

        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.top = 'calc(100% + 10px)';
        bubble.style.left = '50%';
        bubble.style.transform = 'translateX(-50%)';
        bubble.style.backgroundColor = '#f0f0f0';
        bubble.style.padding = '5px 10px';
        bubble.style.borderRadius = '5px';
        bubble.style.backgroundColor = '#181818';
        bubble.style.whiteSpace = 'nowrap';
        bubble.style.minWidth = '100px';
        bubble.style.transition = 'opacity 0.5s';
        bubble.style.opacity = 0;
        bubble.textContent = `${customText}: ${currentValue}`;
        textBubble = bubble;

        sliderContainer.appendChild(bubble);
        sliderContainer.appendChild(slider);

        this.contentContainer.appendChild(sliderContainer);

        return slider;
    }

    addLogo() {
        const logo = document.createElement('img');
        logo.src = 'https://github.com/Snoofz/Hailware-Assets/blob/main/snowly-icon.png?raw=true';
        logo.className = 'logo';
        logo.alt = 'Logo';
        logo.style.marginLeft = '35%';
        logo.classList.add('hue-shift-animation');

        this.UIContext.insertBefore(logo, this.UIContext.firstChild);

        return logo;
    }

    createTabMenu(tabs) {
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.borderBottom = '1px solid #cc0000';
        tabContainer.style.marginBottom = '20px';
        tabContainer.classList.add('rainbow-animation')

        const contentContainers = tabs.map(() => document.createElement('div'));

        tabs.forEach((tab, index) => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.title;
            tabButton.style.flex = '1';
            tabButton.style.padding = '10px';
            tabButton.style.backgroundColor = '#1c1c1c';
            tabButton.style.color = '#ffffff';
            tabButton.style.border = 'none';
            tabButton.style.cursor = 'pointer';
            tabButton.style.fontWeight = 'bold';
            tabButton.style.fontSize = '16px';
            tabButton.classList.add('rainbow-animation');

            tabButton.addEventListener('click', () => {
                contentContainers.forEach((container, idx) => {
                    if (idx !== index) {
                        container.style.display = 'none';
                    }
                });
                contentContainers[index].style.display = 'block';
            });

            this.tabs.push(tabButton);
            tabContainer.appendChild(tabButton);

            const uiTab = new UITab(tab.title, contentContainers[index], document.createElement('div'));
            uiTab.content.innerHTML = tab.content;
            tab.uiTab = uiTab;
        });

        this.UIContext.appendChild(tabContainer);

        contentContainers.forEach(container => {
            container.style.display = 'none';
            this.UIContext.appendChild(container);
        });

        if (contentContainers.length > 0) {
            contentContainers[0].style.display = 'block';
        }

        return {
            UITabs: tabs,
            Containers: contentContainers
        };
    }

    addTabsToTabMenu(existingTabs, newTabs) {
        const contentContainers = newTabs.map(() => document.createElement('div'));

        newTabs.forEach((tab, index) => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.title;
            tabButton.style.flex = '1';
            tabButton.style.padding = '10px';
            tabButton.style.backgroundColor = '#1c1c1c';
            tabButton.style.color = '#ffffff';
            tabButton.style.border = 'none';
            tabButton.style.cursor = 'pointer';
            tabButton.style.fontWeight = 'bold';
            tabButton.style.fontSize = '16px';
            tabButton.classList.add('rainbow-animation');

            tabButton.addEventListener('click', () => {
                contentContainers.forEach((container, idx) => {
                    if (idx !== index) {
                        container.style.display = 'none';
                    }
                });
                contentContainers[index].style.display = 'block';
            });

            existingTabs.push(tabButton);
            const uiTab = new UITab(tab.title, contentContainers[index], document.createElement('div'));
            uiTab.content.innerHTML = tab.content;
            tab.uiTab = uiTab;
        });

        existingTabs.forEach(tab => {
            this.UIContext.appendChild(tab);
        });

        contentContainers.forEach(container => {
            container.style.display = 'none';
            this.UIContext.appendChild(container);
        });

        if (contentContainers.length > 0) {
            contentContainers[0].style.display = 'block';
        }
    }

    showTabContent(index, tabs, contentContainer) {
        contentContainer.innerHTML = '';

        const content = document.createElement('div');
        content.innerHTML = tabs[index].content;
        content.style.color = '#ffffff';
        content.style.fontSize = '16px';
        contentContainer.appendChild(content);

        this.activeTabContent = content;
    }
}

class UITab {
    constructor(title, contentContainer, content) {
        this.title = title;
        this.contentContainer = contentContainer;
        this.content = content;
        this.isHidden = true;
    }

    static getContentContainer() {
        return this.contentContainer;
    }

    addButton(buttonText, buttonAction) {
        const button = document.createElement('button');
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.backgroundColor = '#1c1c1c';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginBottom = '10px';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '16px';
        button.addEventListener('click', buttonAction);
        button.classList.add('rainbow-animation');

        const buttonTextSpan = document.createElement('span');
        buttonTextSpan.textContent = buttonText;
        button.appendChild(buttonTextSpan);

        this.contentContainer.appendChild(button);

        return button;
    }

    addLabel(labelText) {
        const label = document.createElement('h3');
        label.innerHTML = labelText;
        label.style.color = '#ffffff';
        label.style.marginBottom = '20px';
        label.style.fontSize = '18px';
        label.style.textAlign = 'center';
        label.classList.add('rainbow-animation');

        this.contentContainer.appendChild(label);

        return label;
    }

    addTextInput(placeholderText, valueChangeAction) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholderText;
        input.style.width = 'calc(100% - 1px)';
        input.style.padding = '10px';
        input.style.marginBottom = '20px';
        input.style.borderRadius = '5px';
        input.addEventListener('input', valueChangeAction);
        input.style.backgroundColor = '#0e0e0e';
        input.classList.add('rainbow-animation');
        input.focus();
        this.contentContainer.appendChild(input);
        input.focus();
        return input;
    }

    addSpacer(height) {
        const spacer = document.createElement('div');
        spacer.style.width = '100%';
        spacer.style.height = `${height}px`;
        spacer.style.marginBottom = `${height}px`;

        this.contentContainer.appendChild(spacer);

        return spacer;
    }

    addSlider(min, max, step, currentValue, customText, valueChangeAction) {
        let textBubble = undefined;
        let hideTimeout = null;

        const sliderContainer = document.createElement('div');
        sliderContainer.style.width = 'calc(100% - 1px)';
        sliderContainer.style.marginBottom = '20px';
        sliderContainer.style.position = 'relative';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = currentValue;
        slider.step = step;
        slider.style.width = '100%';
        slider.style.borderRadius = '5px';

        const showBubble = () => {
            clearTimeout(hideTimeout);
            textBubble.style.opacity = 1;
            hideTimeout = setTimeout(() => {
                textBubble.style.opacity = 0;
            }, 3000);
        };

        slider.addEventListener('input', () => {
            valueChangeAction(slider.value);
            textBubble.textContent = `${customText}: ${slider.value}`;
            const sliderWidth = slider.offsetWidth;
            const bubbleWidth = textBubble.offsetWidth;
            const sliderValue = slider.value;
            const newPosition = (sliderValue / (max - min)) * sliderWidth;
            const adjustedPosition = Math.min(Math.max(newPosition, bubbleWidth / 2), sliderWidth - bubbleWidth / 2);
            textBubble.style.left = `${adjustedPosition}px`;
            showBubble();
        });

        slider.addEventListener('mousedown', showBubble);
        slider.addEventListener('touchstart', showBubble);

        slider.classList.add('rainbow-animation');

        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.top = 'calc(100% + 10px)';
        bubble.style.left = '50%';
        bubble.style.transform = 'translateX(-50%)';
        bubble.style.backgroundColor = '#f0f0f0';
        bubble.style.padding = '5px 10px';
        bubble.style.borderRadius = '5px';
        bubble.style.backgroundColor = '#181818';
        bubble.style.whiteSpace = 'nowrap';
        bubble.style.minWidth = '100px';
        bubble.style.transition = 'opacity 0.5s';
        bubble.style.opacity = 0;
        bubble.textContent = `${customText}: ${currentValue}`;
        textBubble = bubble;

        sliderContainer.appendChild(bubble);
        sliderContainer.appendChild(slider);

        this.contentContainer.appendChild(sliderContainer);

        return slider;
    }

    showContent() {
        const allTabs = this.contentContainer.parentElement.querySelectorAll('.tab-content');
        allTabs.forEach(tab => {
            tab.style.display = 'none';
        });

        if (this.isHidden) {
            this.contentContainer.style.display = 'block';
            this.isHidden = false;
        }
    }
}

function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${url}`));
        document.head.appendChild(script);
    });
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.36/Tone.min.js')
    .then(() => {
        console.log('Tone.js loaded');
        Log.welcome("Gemoo Downloader");

        function isPlayerInArray(playerName) {
            return players.some(playerElement => playerElement.textContent.includes(playerName));
        }
        let uiManager = new UIManager();

        let mainMenu = uiManager.createMenu("epicUI", "Gemoo Downloader", "250px", "165px");
        uiManager.makeDraggable(mainMenu);

        let tabs = uiManager.createTabMenu([{
            title: 'Main',
            content: '<p>This is the content of Tab 1</p>'
        }]);
        tabs = tabs.UITabs;

        tabs[0].uiTab.addButton("Download Video", () => {
            uiManager.createNotification('Hailware', `Downloading Video...`);
            document.querySelector('.video-play').click();

            const checkVideoSrc = () => {
                const videoElement = document.getElementById('videoId');
                const videoSrc = videoElement.getAttribute('src');

                if (videoSrc) {
                    console.log(videoSrc);

                    fetch(videoSrc)
                        .then(response => response.blob())
                        .then(blob => {
                            const blobUrl = window.URL.createObjectURL(blob);

                            const anchor = document.createElement('a');
                            anchor.href = blobUrl;
                            anchor.download = 'video.mp4';
                            document.body.appendChild(anchor);
                            anchor.click();
                            document.body.removeChild(anchor);

                            window.URL.revokeObjectURL(blobUrl);
                            uiManager.createNotification('Hailware', `Video downloaded! Enjoy!`);
                        })
                        .catch(err => {
                            console.error('Error downloading the video:', err);
                        });

                    clearInterval(interval);

                }
            };

            const interval = setInterval(checkVideoSrc, 500);
        });
    });
