// ==UserScript==
// @name         BLF Voice Chat Script
// @namespace    http://tampermonkey.net/
// @license      GPL-3
// @version      2024-09-09
// @description  Allows you to use voice chat on Bullet Force
// @author       You
// @match        https://games.crazygames.com/en_US/bullet-force-multiplayer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crazygames.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509430/BLF%20Voice%20Chat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/509430/BLF%20Voice%20Chat%20Script.meta.js
// ==/UserScript==

let ws = undefined;

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

    clear() {
        while (this.contentContainer.firstChild) {
            this.contentContainer.removeChild(this.contentContainer.firstChild);
        }
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

let isRecording = false;
let mediaRecorder;
let audioChunks = [];
let audioContext = new AudioContext();

function waitForUnityInstance(callback) {
    const interval = setInterval(() => {
        const unityInstance = Crazygames.getUnityInstance();
        if (unityInstance && unityInstance.SendMessage) {
            clearInterval(interval);
            setTimeout(() => {
                callback();
            }, 3500);
        }
    }, 1000);
}

function generateRandomChannelId() {
    return "Lobby" + Math.floor(Math.random() * 42992);
}

function generateRandomPartyId(username) {
    return username + "'s Party" + Math.floor(Math.random() * 42992);
}

let uiManager = new UIManager();

let reconnectInterval = 1000;
const maxReconnectInterval = 30000;
let currentChannel = generateRandomChannelId();


function switchChannel(newChannelId) {
    ws.send(JSON.stringify({
        type: 'join',
        channelId: newChannelId
    }));
    currentChannel = newChannelId;
}

function setUsername(newUsername) {
    ws.send(JSON.stringify({
        "type": "setusername",
        "username": newUsername
    }));
}

let mutes = [];
let userVolumes = [];
let selfUsername = "";
let isInParty = false;
let tabs = undefined;
let updatedVolumes = [];

waitForUnityInstance(() => {
   (function() {
    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
        const options = args[1] || {};

        if (args[0].includes("https://server.blayzegames.com/OnlineAccountSystem/leftV2.php")) {
            if (isInParty) return;
            switchChannel(generateRandomChannelId());
            tabs[1].uiTab.clear();
        }

        if (args[0].includes('https://server.blayzegames.com/OnlineAccountSystem/community/is_live_now.php') && options.body instanceof Blob) {
            console.log('Body is a Blob for account roles:');

            const reader = new FileReader();
            reader.onloadend = function() {
                const blobContent = reader.result;

                const params = new URLSearchParams(blobContent);
                const username = params.get('username');

                if (username) {
                    console.log('Parsed Username:', username);
                    selfUsername = username;
                    setUsername(username);
                } else {
                    console.log('Username not found in the request body.');
                }
            };
            reader.readAsText(options.body);
        }

        else if (args[0].includes('https://server.blayzegames.com/OnlineAccountSystem/store-match/register_in_store_match.php') && options.body instanceof Blob) {
            console.log('Body is a Blob for store match:');

            const reader = new FileReader();
            reader.onloadend = function() {
                const blobContent = reader.result;

                const params = new URLSearchParams(blobContent);
                const gameName = params.get('game_name');

                if (gameName) {
                    console.log('Parsed Game Name:', decodeURIComponent(gameName));
                    switchChannel(decodeURIComponent(gameName));
                } else {
                    console.log('Game name not found in the request body.');
                }
            };
            reader.readAsText(options.body);
        }

        else if (options.body) {
            if (options.headers && options.headers['Content-Type'] && options.headers['Content-Type'].includes('application/json')) {
                console.log('Body (JSON):', JSON.parse(options.body));
            } else {
                console.log('Body:', options.body);
            }
        } else {
            console.log('No body in request.');
        }

        // Intercept and modify the response for "get-account-rolesV2.php"
        if (args[0].includes('https://server.blayzegames.com/OnlineAccountSystem/get-account-rolesV2.php')) {
            const response = await originalFetch.apply(this, args);

            const modifiedBody = {
                status: 3,
                role: 6,
                creator: 1
            };

            // Create a new response with the modified body
            const modifiedResponse = new Response(JSON.stringify(modifiedBody), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });

            return modifiedResponse; // Return the modified response
        }

        // For other requests, just return the original fetch
        return originalFetch.apply(this, args);
    };
})();

    function setUpVC() {
        let mainMenu = uiManager.createMenu("epicUI", "Bullet Force VC Module", "400px", "500px");
        uiManager.makeDraggable(mainMenu);

        tabs = uiManager.createTabMenu([{
                title: 'Devices',
                content: '<p>This is the content of Tab 1</p>'
            },
            {
                title: 'Users',
                content: '<p>This is the content of Tab 2</p>'
            },
            {
                title: 'Invites',
                content: '<p>This is the content of Tab 3</p>'
            },
            {
                title: 'Recent Users',
                content: '<p>This is the content of Tab 3</p>'
            },
        ]);

        tabs = tabs.UITabs;

        let recentUsers = JSON.parse(localStorage.getItem('recentUsers')) || [];

        tabs[3].uiTab.clear();
        recentUsers.forEach(username => {
            tabs[3].uiTab.addLabel(`${username}`);

            tabs[3].uiTab.addButton(`Invite ${username} to party`, () => {
                let party = generateRandomPartyId(selfUsername);
                ws.send(JSON.stringify({
                    type: 'invite',
                    username: username,
                    channelId: party,
                    inviterName: selfUsername
                }));
                switchChannel(party);
                isInParty = true;
            });
        });

        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    console.log(`${device.kind}: ${device.label} (ID: ${device.deviceId})`);
                    tabs[0].uiTab.addButton(`${device.label}`, () => {
                        setDefaultDevice(device.deviceId, device.kind);
                    });
                });
            })
            .catch(err => {
                console.error("Error accessing devices: ", err);
            });

        ws = new WebSocket('wss://finger.hri7566.info');

        ws.addEventListener("open", () => {
            console.log("Connected to WebSocket server");
            switchChannel(currentChannel);
        });

        ws.addEventListener("message", async (e) => {
            try {
                let data = JSON.parse(e.data);
                console.log(data);

                if (data.type === "receiveInvite") {
                    uiManager.createNotification("VC", `You've been invited to ${data.inviterName}'s party!`);
                    tabs[2].uiTab.addButton(`Join ${data.inviterName}'s Party`, () => {
                        switchChannel(data.channelId);
                        isInParty = true;
                        tabs[2].uiTab.clear();
                    });
                }

                if (data.type === "inviteConfirmation") {
                    uiManager.createNotification("VC", `You've invited ${data.userInvited} to a party!`);
                }

                if (data.type === "userJoin") {
                    const user = { username: data.username, volume: 100 };
                    userVolumes.push(user);

                    tabs[1].uiTab.addLabel(`${data.username}`);

                    let storedMutes = JSON.parse(localStorage.getItem('mutes')) || [];
                    let isMuted = storedMutes.includes(data.username);
                    let muteButtonLabel = isMuted ? `Unmute ${data.username}` : `Mute ${data.username}`;

                    let muteButton = tabs[1].uiTab.addButton(muteButtonLabel, () => {
                        if (isMuted) {
                            storedMutes = storedMutes.filter(username => username !== data.username);
                            localStorage.setItem('mutes', JSON.stringify(storedMutes));
                            isMuted = false;
                            muteButton.textContent = `Mute ${data.username}`;
                            console.log(`${data.username} has been unmuted`);
                            mutes = mutes.filter(username => username !== data.username);
                        } else {
                            storedMutes.push(data.username);
                            localStorage.setItem('mutes', JSON.stringify(storedMutes));
                            isMuted = true;
                            muteButton.textContent = `Unmute ${data.username}`;
                            console.log(`${data.username} has been muted`);
                            mutes.push(data.username);
                        }
                    });

                    let storedVolumes = JSON.parse(localStorage.getItem('userVolumes')) || [];
                    let userVolume = (storedVolumes.find(u => u.username === data.username) || { volume: 100 }).volume;

                    tabs[1].uiTab.addSlider(0, 1, 0.1, userVolume, `Volume for ${data.username}`, (newValue) => {
                        user.volume = newValue;
                        updatedVolumes = storedVolumes.filter(u => u.username !== data.username);
                        updatedVolumes.push({ username: data.username, volume: newValue });
                        localStorage.setItem('userVolumes', JSON.stringify(updatedVolumes));
                        console.log(`Updated volume for ${data.username}: ${newValue}`);
                    });

                    let recentUsers = JSON.parse(localStorage.getItem('recentUsers')) || [];

                    recentUsers = recentUsers.filter(u => u !== data.username);

                    recentUsers.unshift(data.username);

                    if (recentUsers.length > 10) recentUsers = recentUsers.slice(0, 10);

                    localStorage.setItem('recentUsers', JSON.stringify(recentUsers));

                    tabs[3].uiTab.clear();
                    recentUsers.forEach(username => {
                        tabs[3].uiTab.addLabel(`${username}`);

                        tabs[3].uiTab.addButton(`Invite ${username} to party`, () => {
                            let party = generateRandomPartyId(selfUsername);
                            ws.send(JSON.stringify({
                                type: 'invite',
                                username: username,
                                channelId: party,
                                inviterName: selfUsername
                            }));
                            switchChannel(party);
                            isInParty = true;
                        });
                    });
                }

                if (data.type === 'voice') {
                    if (mutes.includes(data.username)) return;

                    const userVolume = updatedVolumes.find(user => user.username === data.username)?.volume || 1.0;

                    let base64Audio = data.voiceData;
                    if (base64Audio && base64Audio.startsWith("data:audio")) {
                        playAudioFromBase64(base64Audio, userVolume);
                    }
                }

            } catch (error) {
                console.error("Error in message event:", error);
            }
        });

        let mediaRecorder;
        let isRecording = false;
        let sendInterval;

        let captureInterval;
        const captureIntervalMs = 1000;

        async function startVoiceCapture() {
            if (!isRecording) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    let reader = new FileReader();
                    reader.onloadend = () => {
                        let base64AudioMessage = reader.result;
                        ws.send(JSON.stringify({
                            type: 'voice',
                            channelId: currentChannel,
                            voiceData: base64AudioMessage
                        }));
                        audioChunks = [];
                    };
                    reader.readAsDataURL(audioBlob);
                };

                mediaRecorder.start();

                captureInterval = setInterval(() => {
                    if (isRecording) {
                        mediaRecorder.stop();
                        mediaRecorder.start();
                    }
                }, captureIntervalMs);

                isRecording = true;
                console.log("Voice recording started");
                uiManager.createNotification("VC", "Voice chat was enabled");
            }
        }

        function stopVoiceCapture() {
            if (isRecording) {
                clearInterval(captureInterval);
                captureInterval = null;
                mediaRecorder.stop();
                isRecording = false;
                console.log("Voice recording stopped");
                uiManager.createNotification("VC", "Voice chat was disabled");
            }
        }

        let audioContext = new AudioContext();

        function playAudioFromBase64(base64Audio, volume) {
            let audio = new Audio(base64Audio);
            audio.volume = volume;
            audio.play().catch(error => console.error('Playback error:', error));
        }


        function toggleVoiceCapture() {
            if (!isRecording) {
                startVoiceCapture();
            } else {
                stopVoiceCapture();
            }
        }

        function toggleMainMenu() {
            if (mainMenu.style.display === 'none') {
                mainMenu.style.display = 'block';
            } else {
                mainMenu.style.display = 'none';
            }
        }

        function resetMenuPosition() {
            mainMenu.style.top = `calc(50% - (${mainMenu.style.height} / 2))`;
            mainMenu.style.left = `calc(50% - (${mainMenu.style.width} / 2))`;
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === "/") {
                toggleVoiceCapture();
            }
            if (event.key === 'Insert') {
                toggleMainMenu();
            } else if (event.key === 'Delete') {
                resetMenuPosition();
            }
        });

        function setDefaultDevice(deviceId, kind) {
            const constraints = {};

            if (kind === 'audioinput') {
                constraints.audio = { deviceId: { exact: deviceId } };
            } else if (kind === 'videoinput') {
                constraints.video = { deviceId: { exact: deviceId } };
            }

            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    console.log(`Default ${kind} set to device with ID: ${deviceId}`);
                })
                .catch(err => {
                    console.error(`Error setting default ${kind}: `, err);
                });
        }
    }
    setUpVC();
});
