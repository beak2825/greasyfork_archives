// ==UserScript==
// @name           Alfies — Status Update Notifier
// @name:de        Alfies — Status Update Benachrichtigungen
// @description    Sends notifications when the order status gets updated
// @description:de Sendet Benachrichtigungen, wenn der Bestellungsstatus aktualisiert wird
// @version        1.4
// @grant          GM_notification
// @match          https://*.alfies.at/account/*
// @icon           https://external-content.duckduckgo.com/ip3/www.alfies.at.ico
// @require        https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license        GPL v3
// @author         incognico
// @namespace      https://greasyfork.org/users/931787
// @downloadURL https://update.greasyfork.org/scripts/486860/Alfies%20%E2%80%94%20Status%20Update%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/486860/Alfies%20%E2%80%94%20Status%20Update%20Notifier.meta.js
// ==/UserScript==

// various selectors
const orderStatusWrapper = '[class^=AccountOrderPage_accountorderwrapper__]';

const orderStatusClass = 'OrderStatus_orderstatus';
const subTreeItem = `[class^=${orderStatusClass}__statustreeitem__]`; // call .dataset.active on these to check

const headerList = '[class^=Header_profilenav__] > ul';

const orderStatusTitle = `[class^=${orderStatusClass}__] > p`;

// IDs to only create these once
const alfiesNotifierId = 'alfies-notifier';
const slideInAnimationId = 'alfies-notifier-slidein';

// need to remember last values to watch for changes
let lastStatusTitle = undefined;
let lastActiveStatus = undefined;

const disconnect = VM.observe(document.body, () => {
    // Is on order status page?
    const orderStatus = document.querySelector(orderStatusWrapper);
    if (orderStatus) {
        defineSlideInAnimation();
        createNotifierIfNotExists();
        watchTitleChanges();
        watchStatusTreeChanges();
    } else {
        destroyNotifier();
    }
});

const defineSlideInAnimation = () => {
    const slideInAnimation = document.getElementById(slideInAnimationId);
    if (!slideInAnimation) {
        const style = document.createElement('style');
        style.id = slideInAnimationId;
        style.textContent = `
                    @keyframes slidein {
                        from {
                            transform: translateY(-100%);
                        }
                        to {
                            transform: translateY(0);
                        }
                    }
                `;
        document.head.appendChild(style);
    }
};

const createNotifierIfNotExists = () => {
    const notifierExists = document.getElementById(alfiesNotifierId);
    if (!notifierExists) {
        const notifier = document.createElement('div');
        notifier.id = alfiesNotifierId;
        notifier.textContent = 'Alfies Status Update Notifier is active!';

        // assign style to the notifier
        const style = {
            color: '#72ff72',
            marginBottom: '10px',
            textAlign: 'center',
            fontSize: '1.5em',
            fontWeight: 'bold',
            border: '2px solid #00d900',
            padding: '10px',
            borderRadius: '10px',
            marginTop: '10px',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            boxShadow: '0 0 10px 0 rgba(0, 255, 0, 0.5)',
            // slide in animation
            animation: 'slidein 1s',
            animationFillMode: 'forwards',
        };
        Object.assign(notifier.style, style);

        // append notifier to the header list
        const header = document.querySelector(headerList);
        if (header) {
            header.appendChild(notifier);
        }
    }
};

const destroyNotifier = () => {
    const notifier = document.getElementById(alfiesNotifierId);
    if (notifier) {
        notifier.remove();
    }
};

const timeout = 10000;
const image = 'https://external-content.duckduckgo.com/ip3/www.alfies.at.ico';

const watchTitleChanges = () => {
    const statusTitle = document.querySelector(orderStatusTitle)?.textContent;
    if (statusTitle && statusTitle !== lastStatusTitle) {
        GM_notification({
            title: 'Alfies Status Change',
            text: statusTitle,
            timeout,
            image,
        });
    }
    lastStatusTitle = statusTitle;
};

const watchStatusTreeChanges = () => {
    const statusTreeItems = Array.from(document.querySelectorAll(subTreeItem));
    const activeStatus = statusTreeItems.filter(item => item.dataset.active === 'true');
    if (activeStatus.length && lastActiveStatus !== undefined && activeStatus.length !== lastActiveStatus.length) {
        const activeStatusNames = activeStatus.map(item => item.textContent);
        GM_notification({
            title: 'Alfies Status Checklist Update',
            text: activeStatusNames[activeStatusNames.length - 1],
            timeout,
            image,
        });
    }
    lastActiveStatus = activeStatus;
};
