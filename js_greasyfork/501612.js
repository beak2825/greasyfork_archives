// ==UserScript==
// @name        DAMGrid EM Manipulator
// @version     1.0.1
// @description Provides features for Energy Manager to make you rich
// @license     MIT
// @match       https://energymanager.trophyapi.com/*
// @match       https://energymanagergame.com/*
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1338817
// @downloadURL https://update.greasyfork.org/scripts/501612/DAMGrid%20EM%20Manipulator.user.js
// @updateURL https://update.greasyfork.org/scripts/501612/DAMGrid%20EM%20Manipulator.meta.js
// ==/UserScript==


// Remove the blocking overlays for unavaliable plants
function removeBlocks() {
    document.querySelectorAll('div').forEach(el => {
        if (el.getAttribute('style') === 'z-index:10;position:absolute;width:100%;height:100%;text-align:center;display:flex;justify-content:center;align-items:center;flex-direction:column;') {
            const parent = el.parentElement;
            const listing = parent.children[1];
            listing.classList.remove('not-active-light');
            el.remove();
        }
    });
}

// Remove the tip and side panel
function removeLoginOverlays() {
    document.querySelectorAll('div').forEach(el => {
        if (el.getAttribute('id') === 'login-tip') {
            setTimeout(() => {
                el.remove();
                const menu_icon = document.getElementById('pane-close-helper-icon');
                simulateClick(menu_icon);
            }, 2000);
        }
    });
}

function notify(message) {
    const notification = document.createElement('div');
        notification.setAttribute('id', 'mass-sell-notification');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px';
        notification.style.width = '250px';
        notification.style.height = '80px';
        notification.style.display = 'flex';
        notification.style.flexDirection = 'row';
        notification.style.alignItems = 'center';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        notification.style.color = 'white';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '2000';
        setTimeout(() => {
            notification.remove();
        }, 3000);

        const notificationIcon = document.createElement('img');
        notificationIcon.setAttribute('src', 'https://cdn-icons-png.freepik.com/512/8625/8625350.png?fd=1&filename=notification_8625350.png');
        notificationIcon.style.width = '30px';
        notificationIcon.style.height = '30px';
        notificationIcon.style.marginRight = '15px';
        notificationIcon.style.marginLeft = '10px';
        notificationIcon.style.display = 'block';
        notification.appendChild(notificationIcon);
        document.body.appendChild(notification);

        const notificationText = document.createElement('p');
        notificationText.style.fontSize = '20px';
        notificationText.style.marginTop = 'auto';
        notificationText.style.display = 'flex';
        notificationText.style.alignItems = 'center';
        notificationText.innerText = message;
        notification.appendChild(notificationText);
}

// Check and create a button to mass-sell plants
function checkMassSellButton() {
    function massSell() {
        console.log('Mass selling plants');

        const input = document.getElementById('mass-sell-input');
        const count = parseInt(input.value);

        let buttons = document.getElementsByClassName('btn-box btn-box-yellow');
        let singleSellButton = Array.from(buttons).find(el => el.parentElement.innerText.includes('Sell plant'));
        let type = 'plant';

        if (!singleSellButton) {
            buttons = document.getElementsByClassName('btn-box btn-box-red');
            singleSellButton = Array.from(buttons).find(el => el.parentElement.innerText.includes('Sell unit'));
            type = 'vessel';
        }

        const onclick = singleSellButton.getAttribute('onclick');
        const plantId = onclick.split('id=')[1].split('&')[0];

        const url = `https://energymanagergame.com/sell.php?id=${plantId}&type=${type}`;

        injectScriptOnce(`
            (function() {
                for (var i = 0; i < ${count}; i++) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '${url}');
                    xhr.send();
                }
            })();
        `);

        notify(`Selling ${count}...`);
    }

    document.querySelectorAll('button').forEach(el => {
        if ((el.getAttribute('class') === 'btn-box btn-box-yellow' && el.parentElement.innerText === ' Sell plant') ||
            (el.getAttribute('class') === 'btn-box btn-box-red' && el.parentElement.innerText === ' Sell unit')) {
            if (document.getElementById('mass-sell-div')) {
                return;
            }
            const parent = el.parentElement;
            const div = document.createElement('div');
            div.setAttribute('id', 'mass-sell-div');
            div.style.marginTop = '10px';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            const input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('id', 'mass-sell-input');
            input.setAttribute('min', '1');
            input.setAttribute('max', '999');
            input.setAttribute('value', '100');
            input.style.width = '50px';
            input.style.marginRight = '10px';
            input.style.border = 'none';
            input.style.backgroundColor = 'rgba(190, 190, 190, 0.3)';
            input.style.borderRadius = '5px';
            input.style.padding = '5px';
            div.appendChild(input);
            const button = document.createElement('button');
            button.setAttribute('class', 'btn-box btn-box-yellow');
            button.style.backgroundColor = 'rgb(0, 184, 230)';
            button.innerText = 'Mass Sell';
            button.onclick = massSell;
            div.appendChild(button);
            parent.appendChild(div);
        }
    });
}

// Utility function to inject a script once
function injectScriptOnce(code) {
    const script = document.createElement('script');
    script.textContent = code;
    document.head.appendChild(script);
    script.remove();
}

const main = function() {
    setInterval(() => {
        removeBlocks();
        checkMassSellButton();
    }, 1000);

    removeLoginOverlays();

    // Inject the simulateClick function
    injectScriptOnce(`
        function simulateClick(element) {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        }
    `);
}

main();
