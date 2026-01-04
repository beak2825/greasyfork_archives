// ==UserScript==
// @name         🔥Noob Client🔥
// @namespace    http://tampermonkey.net/
// @version      2024-11-01
// @description  Cinderace pvp client
// @author       GEORGECR
// @match        https://bloxd.io/
// @match        https://bloxd.io/?utm_source=pwa
// @icon         https://i.postimg.cc/vZrNmvZY/channels4-profile-1.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517616/%F0%9F%94%A5Noob%20Client%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/517616/%F0%9F%94%A5Noob%20Client%F0%9F%94%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fast_refresh() {
        document.title = "Bloxd.io - Noob Client";
        const maintext = document.querySelector('.Title.FullyFancyText');
        if (maintext) {
            maintext.style.webkitTextStroke = "0px";
            maintext.textContent = "🔥NOOB CLIENT🔥";
            maintext.style.textShadow = "10px 5px 5px #ff6723";
            maintext.style.color = "#ffb02e";
            maintext.style.fontSize = "55px";
            maintext.style.whiteSpace = 'normal';
        }

        const background = document.querySelector(".HomeBackground");
        if (background) {
            background.style.backgroundImage = 'url(https://i.postimg.cc/dQnpqmXd/image.png)';
        }

        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.textContent = "";
            crosshair.style.backgroundImage = "url(https://piskel-imgstore-b.appspot.com/img/354b6bd7-1cd8-11ef-8822-bbb60d940ece.gif)";
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "19px";
            crosshair.style.height = "19px";
        }

        document.querySelectorAll(".HotBarItem").forEach(hotbar => {
            hotbar.style.borderRadius = "12px";
            hotbar.style.borderColor = "#000000";
            hotbar.style.backgroundColor = "transparent";
            hotbar.style.boxShadow = "none";
            hotbar.style.outline = "transparent";
        });

        document.querySelectorAll(".SelectedItem").forEach(slot => {
            slot.style.backgroundColor = "transparent";
            slot.style.boxShadow = "none";
            slot.style.borderRadius = "15px";
            slot.style.borderColor = "#ff6723";
            slot.style.outline = "transparent";
        });
    }

    setInterval(fast_refresh, 70);
    const UI_aesthetics = () => {
        ['LogoContainer', 'cube', 'HomeScreenBottomLeft'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(el => el.remove());
        });

        ['GameAdsBanner', 'HomeBannerInner'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(ads => {
                ads.style.opacity = '0';
                ads.style.transform = 'translateX(100%)';
            });
        });

        ['TitleContainer'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(optionsTR => {
                optionsTR.style.width = "600px";
                optionsTR.style.height = "80px";
            });
        });

        ['PlayerNamePreview'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(optionsTL => {
                optionsTL.style.color = "white";
                optionsTL.style.textShadow = "none";
            });
        });

        ['SocialBarInner'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(socialbox => {
                socialbox.style.backgroundColor = "#000000";
                socialbox.style.opacity = '1';
            });
        });

        document.querySelectorAll('.AvailableGame').forEach(item => {
            item.style.border = "none";
            item.style.borderRadius = "0px";
            item.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.4)";
        });

        document.querySelectorAll('.AvailableGameTextInner').forEach(name => {
            name.style.textShadow = "none";
        });

        document.querySelectorAll('.AvailableGameTextWrapperBackground').forEach(removebox => {
            removebox.style.opacity = "0";
        });
    };

    document.addEventListener('DOMContentLoaded', UI_aesthetics);
    setInterval(UI_aesthetics, 1000);

    // Create a CPS counter UI with preferred styling
    const cpsDisplay = document.createElement('div');
    cpsDisplay.style.position = 'fixed';
    cpsDisplay.style.top = '91%';
    cpsDisplay.style.left = '0.5%';
    cpsDisplay.style.backgroundColor = '#ffb02e';
    cpsDisplay.style.color = '#ff6723';
    cpsDisplay.style.opacity = '70%';
    cpsDisplay.style.padding = '5px 55px';
    cpsDisplay.style.fontSize = '16px';
    cpsDisplay.style.zIndex = '1000';
    cpsDisplay.style.fontWeight = 'bold';
    cpsDisplay.textContent = 'CPS: 0';
    document.body.appendChild(cpsDisplay);

    // CPS tracking variables
    let clickTimes = [];
    let lastClickTime = 0;

    const updateCPS = () => {
        const now = performance.now();
        clickTimes = clickTimes.filter(time => now - time <= 1000);
        const cps = clickTimes.length;
        cpsDisplay.textContent = `CPS: ${cps}`;
        if (cps === 0 && now - lastClickTime > 1000) {
            cpsDisplay.textContent = 'CPS: 0';
        }
    };

    document.addEventListener('click', () => {
        const now = performance.now();
        clickTimes.push(now);
        lastClickTime = now;
        updateCPS();
    });

    setInterval(updateCPS, 100);

    const keys = [
        { key: 'W', top: '5px', left: '50%' },
        { key: 'A', top: '60px', left: '31.5%' },
        { key: 'S', top: '60px', left: '50%' },
        { key: 'D', top: '60px', left: '68%' },
        { key: 'LMB', top: '115px', left: '35.5%', width: '77px' },
        { key: 'RMB', top: '115px', left: '64%', width: '77px' },
        { key: '―――', top: '170px', left: '50%', height: '25px', width: '160px', fontSize: '18px' }
    ];

    const container = document.createElement("div");
    Object.assign(container.style, {
        zIndex: "10000",
        width: "300px",
        height: "300px",
        transform: "translate(-50%, -50%)",
        top: "86%",
        left: "4.7%",
        position: "fixed",
        opacity: "70%"
    });
    document.body.appendChild(container);

    const createKeyElement = ({ key, top, left, width = '50px', height = '50px', fontSize = '24px' }) => {
        const element = document.createElement('div');
        Object.assign(element.style, {
            position: 'fixed',
            color: '#ff6723',
            top,
            left,
            transform: 'translateX(-50%)',
            zIndex: '10000',
            fontWeight: 'bold',
            backgroundColor: '#ffb02e',
            fontSize,
            height,
            width,
            textAlign: 'center',
            lineHeight: height
        });
        element.textContent = key;
        container.appendChild(element);
        return element;
    };

    const keyElements = keys.reduce((acc, keyConfig) => {
        acc[keyConfig.key] = createKeyElement(keyConfig);
        return acc;
    }, {});

    const updateKeyStyle = (key, active) => {
        if (keyElements[key]) {
            keyElements[key].style.backgroundColor = active ? "#ff6723" : "#ffb02e";
            keyElements[key].style.color = active ? "#ffb02e" : "#ff6723";
        }
    };

    document.addEventListener('keydown', ({ key }) => {
        const upperKey = key.toUpperCase();
        if (keyElements[upperKey]) updateKeyStyle(upperKey, true);
        if (key === ' ') updateKeyStyle('―――', true);
    });

    document.addEventListener('keyup', ({ key }) => {
        const upperKey = key.toUpperCase();
        if (keyElements[upperKey]) updateKeyStyle(upperKey, false);
        if (key === ' ') updateKeyStyle('―――', false);
    });

    document.addEventListener('mousedown', ({ button }) => {
        if (button === 0) updateKeyStyle('LMB', true);
        if (button === 2) updateKeyStyle('RMB', true);
    });

    document.addEventListener('mouseup', ({ button }) => {
        if (button === 0) updateKeyStyle('LMB', false);
        if (button === 2) updateKeyStyle('RMB', false);
    });

    // Add Noob Controls UI
    const noobControls = document.createElement('div');
    Object.assign(noobControls.style, {
        position: 'fixed',
        width: '300px',
        height: '60px',
        top: '90%',
        left: '90%',
        transform: 'translateX(-50%)',
        backgroundColor: '#000000',
        opacity: '80%',
        borderRadius: '10px',
        zIndex: '10001',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)'
    });

    const createButton = (text, onClick) => {
        const button = document.createElement('button');
        Object.assign(button.style, {
            color: '#ffb02e',
            backgroundColor: '#ff6723',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.3)'
        });
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    };

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '70%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ff6723',
            color: '#ffb02e',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '18px',
            fontWeight: 'bold',
            zIndex: '10002',
            textAlign: 'center',
            opacity: '1',
            transition: 'opacity 1s ease-out'
        });
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 1000);
        }, 1000);
    };

    const noobClickerButton = createButton('Noob Clicker', () => showNotification('Noob Clicker Activated'));
    const noobHaxButton = createButton('Noob Hax', () => showNotification('Noob Hax Activated'));

    noobControls.appendChild(noobClickerButton);
    noobControls.appendChild(noobHaxButton);

    document.body.appendChild(noobControls);

})();
