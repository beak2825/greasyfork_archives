// ==UserScript==
// @name        Key-Based Config
// @author      Callum Latham <callumtylerlatham@gmail.com> (https://github.com/ctl2/key-based-config)
// @exclude     *
// @description A script for interfacing with my Key-Based Config UI.
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

const FRAME_URL = 'https://callumlatham.com/key-based-config/';
const STYLE = {
    'position': 'fixed',
    'height': '100vh',
    'width': '100vw'
};

let isOpen = false;

function kbcConfigure(storageKey, title, metaTree, isFixed = false, customStyle = {}) {
    return new Promise((resolve, reject) => {
        if (isOpen) {
            reject(new Error('A Key-Based Config iFrame is already open.'));
        } else if (typeof GM.getValue !== 'function' || typeof GM.setValue !== 'function') {
            reject(new Error('The key-based config script requires GM.getValue and GM.setValue permissions.'));
        } else {
            const iframe = document.createElement('iframe');
            const style = {
                ...STYLE,
                ...customStyle
            }

            iframe.src = FRAME_URL;

            for (const [property, value] of Object.entries(style)) {
                iframe.style[property] = value;
            }

            window.document.body.appendChild(iframe);

            isOpen = true;

            // Listen for iFrame communication
            window.addEventListener('message', async (message) => {
                switch (message.data.event) {
                    case 'open':
                        // Pass initialisation data
                        const valueForest = await GM.getValue(storageKey, []);

                        iframe.contentWindow.postMessage({title, metaTree, valueForest, isFixed}, '*');

                        break;

                    case 'close':
                        // Close iFrame
                        isOpen = false;
                        iframe.remove();

                        window.setTimeout(() => {
                            // Save changes
                            GM.setValue(storageKey, message.data.valueForest);

                            // Resolve promise
                            resolve(message.data.valueForest);
                        }, 1);

                        break;

                    case 'error':
                        // Close iFrame
                        isOpen = false;
                        iframe.remove();

                        // Resolve promise
                        reject(message.data.reason);

                        break;

                    default:
                        // No need to error the promise here; I'm probably just observing a message from another script
                }
            });
        }
    });
}
