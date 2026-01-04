// ==UserScript==
// @name         Gartic.io Anonim Menu
// @namespace    https://greasyfork.org/
// @version      2024-01-18
// @description  Press F2 to open and close the menu
// @author       anonimbiri
// @match        https://gartic.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @require https://update.greasyfork.org/scripts/482771/1321969/Malayala%20Kit.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481731/Garticio%20Anonim%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/481731/Garticio%20Anonim%20Menu.meta.js
// ==/UserScript==
 
const AnonimbiriAPI = {
    ws: null,
    isGame: false,
    playerId: null,
    unlimitedKick: false,
    autoSkip: false,
    antiAfk: false,
    noCooldown: false,
    autoGuessing: false,
    hint: null,
    wordListURL: null,
    wordList: [],
    hotkey: new KeyboardEvent('keyup', {
        key: "F2",
        keyCode: 113,
        ctrlKey: false,
        altKey: false,
        shiftKey: false
    }),
    debug: false,
};
 
var toastManager = new MalayalaKit.ToastManager();
 
const kit = new MalayalaKit.CreateMenu({
    title: "Anonim Menu",
    icon: "",
    size: { width: 500, height: 400 },
    position: { top: 50, left: 50 },
    hotkey: AnonimbiriAPI.hotkey,
});
 
const general = new MalayalaKit.Tab("General");
general.addSwitch({
    label: "Unlimited Kick",
    value: false,
    onchange: (value) => {
        AnonimbiriAPI.unlimitedKick = value;
        toastManager.showToast({ message: 'Unlimited Kick is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});
general.addSwitch({
    label: "Auto Skip",
    value: false,
    onchange: (value) => {
        AnonimbiriAPI.autoSkip = value;
        toastManager.showToast({ message: 'Auto Skip is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});
general.addSwitch({
    label: "Anti Afk",
    value: false,
    onchange: (value) => {
        AnonimbiriAPI.antiAfk = value;
        toastManager.showToast({ message: 'Anti Afk is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});
general.addSwitch({
    label: "No Cooldown For Room Change",
    value: false,
    onchange: (value) => {
        AnonimbiriAPI.noCooldown = value;
        toastManager.showToast({ message: 'No Cooldown For Room Change is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});
general.addHotkey({
    label: "Menu Hotkey",
    style: "border",
    value: AnonimbiriAPI.hotkey,
    onlistener: function (event) {
        AnonimbiriAPI.hotkey = event;
        toastManager.showToast({ message: 'Menu Opening Hotkey Set To ' + event.key, type: 'info' });
    }
});
kit.addTab(general);
 
const guess = new MalayalaKit.Tab("Guess");
guess.addSwitch({
    label: "Auto Guessing",
    value: false,
    onchange: (value) => {
        AnonimbiriAPI.autoGuessing = value;
        toastManager.showToast({ message: 'Auto Guessing is ' + (value ? 'ON' : 'OFF'), type: 'info' });
    },
});
guess.addInput({
    label: "Word List",
    placeholder: "wordList.txt",
    type: "text",
    value: AnonimbiriAPI.wordListURL,
    onchange: (value) => {
        AnonimbiriAPI.wordListURL = value;
        fetch(AnonimbiriAPI.wordListURL)
            .then(response => response.text())
            .then(data => {
            AnonimbiriAPI.wordList = data.split('\n').map(word => word.trim().toLowerCase());
        }).catch(error => AnonimbiriAPI.debug && console.error('Error:', error));
    },
});
kit.addTab(guess);
 
let fakeWinText = "anonimbiri";
const local = new MalayalaKit.Tab("Local");
local.addInput({
    label: "Fake Win text",
    placeholder: "Enter Fake Win text",
    type: "text",
    value: fakeWinText,
    onchange: (value) => {
        fakeWinText = value;
    },
});
local.addButton({
    label: "Send Fake Win",
    style: "border",
    buttonLabel: "Send Fake Win",
    onclick: () => {
        const event = new MessageEvent("message", {
            data: `42["26","${fakeWinText}",10,11,10000]`,
        });
        AnonimbiriAPI.ws.dispatchEvent(event);
    },
});
kit.addTab(local);
 
let intervalId = null;
let spamText = "anonimbiri";
const spam = new MalayalaKit.Tab("Spam");
spam.addSwitch({
    label: "Spam",
    value: false,
    onchange: (value) => {
        if (value) {
            intervalId = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * (spamText.length + 1));
                const newText = spamText.replace(/(‎{${randomIndex}})/, '$1.');
                AnonimbiriAPI.ws.send(`42[11,${AnonimbiriAPI.playerId},"${newText}"]`);
            }, 800);
        } else {
            clearInterval(intervalId);
        }
        toastManager.showToast({ message: 'Spam Has ' + (value ? 'Started' : 'Heen Stopped'), type: 'info' });
    },
});
spam.addInput({
    label: "Spam text",
    placeholder: "Enter Spam text",
    type: "text",
    value: spamText,
    onchange: (value) => {
        spamText = value;
    },
});
kit.addTab(spam);
 
let intervalHint = null;
let index = 0;
window.WebSocket = class extends WebSocket {
    constructor(...args) {
        super(...args);
        AnonimbiriAPI.ws = this;
        this.addEventListener("message", (e) => {
            AnonimbiriAPI.debug && console.log("%c<--- Received data:", "color: pink", e.data);
            const messageData = JSON.parse(e.data.slice(2));
            if (messageData[0] === "45" && AnonimbiriAPI.unlimitedKick) {
                const OriginalDate = window.Date;
                window.Date = class extends Date {
                    static now() {
                        return super.now() * 2123;
                    }
                };
                setTimeout(() => {
                    window.Date = OriginalDate;
                }, 2000);
                return;
            } else if (messageData[0] === "5") {
                AnonimbiriAPI.isGame = true;
                AnonimbiriAPI.playerId = messageData[2];
            } else if (messageData[0] === "16" && AnonimbiriAPI.autoSkip) {
                AnonimbiriAPI.ws.send(`42[25,${AnonimbiriAPI.playerId}]`);
            } else if (messageData[0] === "34") {
                AnonimbiriAPI.ws.send(`42[30,${AnonimbiriAPI.playerId}]`);
                AnonimbiriAPI.ws.send(`42[30,${AnonimbiriAPI.playerId}]`);
                AnonimbiriAPI.ws.send(`42[30,${AnonimbiriAPI.playerId}]`);
            } else if (messageData[0] === "19" && AnonimbiriAPI.antiAfk) {
                window.Date = class extends Date {
                    static now() {
                        return super.now() / 2123;
                    }
                };
            } else if (messageData[0] === "23") {
                !AnonimbiriAPI.debug && console.clear();
                const nickElements = document.querySelectorAll('.nick');
                nickElements.forEach((nickElement) => {
                    const nickName = nickElement.innerText;
                    if (
                        nickName.startsWith('‎') &&
                        !nickElement.parentElement.querySelector('.cheater') &&
                        !nickElement.parentElement.parentElement.classList.contains('you')
                    ) {
                        const newElement = document.createElement('span');
                        newElement.classList.add('cheater');
                        newElement.style = 'color:pink; font-weight: bold; font-family: "Lucida Console", "Courier New", monospace;';
                        newElement.innerText = `🎮 Cheater`;
                        nickElement.parentElement.appendChild(newElement);
                    }
                });
            } else if (messageData[0] ==="30") {
                AnonimbiriAPI.hint = messageData[1].join('');
                if(!AnonimbiriAPI.autoGuessing && !AnonimbiriAPI.hint && intervalHint) return;
                setInterval(() => {
                    const hints = guessWord(AnonimbiriAPI.hint);
                    if (index < hints.length) AnonimbiriAPI.ws.send(`42[13,${AnonimbiriAPI.playerId},"${hints[index++]}"]`), AnonimbiriAPI.wordList.splice(AnonimbiriAPI.wordList.indexOf(hints[index++]), 1);
                    else clearInterval(intervalHint);
                }, 1000);
 
            } else if (messageData[0] ==="19" && intervalHint) {
                AnonimbiriAPI.hint = null;
                clearInterval(intervalHint);
                fetch(AnonimbiriAPI.wordListURL)
                    .then(response => response.text())
                    .then(data => {
                    AnonimbiriAPI.wordList = data.split('\n').map(word => word.trim().toLowerCase());
                }).catch(error => AnonimbiriAPI.debug && console.error('Error:', error));
            } else if (messageData[0] ==="13" && AnonimbiriAPI.wordList.length !== 0) {
                const index = AnonimbiriAPI.wordList.indexOf(messageData[1].toLowerCase());
                index !== -1 && AnonimbiriAPI.wordList.splice(index, 1)
            }
        });
    }
 
    send(data) {
        AnonimbiriAPI.debug && console.log("%c---> Sent data:", "color: pink", data);
        const newData = JSON.parse(data.slice(2));
        if (newData[1] && newData[1].nick) {
            newData[1].nick = `‎${newData[1].nick}`;
            data = data.slice(0, 2) + JSON.stringify(newData);
            super.send(data);
        } else if (newData[0] === "46") {
        } else {
            super.send(data);
        }
    }
};
 
function guessWord(guessedPattern) {
    if (!guessedPattern) return;
    const wordList = AnonimbiriAPI.wordList.map(word => word.toLowerCase());
    const length = guessedPattern.length;
    const possibleWords = [];
 
    for (let i = 0; i < wordList.length; i++) {
        const word = wordList[i];
        if (word.length === length) {
            let match = true;
 
            for (let j = 0; j < length; j++) {
                if (guessedPattern[j] !== '_' && guessedPattern[j] !== word[j]) {
                    match = false;
                    break;
                }
            }
 
            if (match) {
                possibleWords.push(word);
            }
        }
    }
 
    return possibleWords;
}
 
// I'll just leave it here that such a method exists and works
/*function requestText (url) {
    return fetch(url).then((d) => {return d.text()})
}
function requestBuffer (url) {
    return fetch(url).then((d) => {return d.arrayBuffer()})
}
 
Node.prototype.appendChild = new Proxy(Node.prototype.appendChild, {
    apply: async function (target, thisArg, [element]) {
        if (element.tagName === "SCRIPT" && element.src.includes('room')) {
            let text = await requestText(element.src);
            text = text.replace(/this\._lang\.violatingRules/g, '"dememe"'); // this is the wrong code lol
            let blob = new Blob([text]);
            element.src = URL.createObjectURL(blob);
        }
        return Reflect.apply(target, thisArg, [element]);
    }
});*/
 
const observer = new MutationObserver(() => {
    const input = document.querySelector('input[name="chat"]');
    input?.disabled && input.querySelector('input[name="chat"]').replaceWith(
        Object.assign(document.createElement('input'), {
            type: 'text',
            name: 'chat',
            className: 'mousetrap',
            placeholder: '🔓 Chat Unlocked',
            autocomplete: 'off',
            autocorrect: 'off',
            autocapitalize: 'off',
            maxLength: 100,
            value: '',
        })
    );
    if (document.querySelector('#popUp') && AnonimbiriAPI.noCooldown) {
        const OriginalDate = window.Date;
        window.Date = class extends Date {
            static now() {
                return super.now() * 2123;
            }
        };
        setTimeout(() => {
            window.Date = class extends Date {
                static now() {
                    return super.now() / 2123;
                }
            };
        }, 500);
        document.querySelector('.ic-playHome').click();
    }
});
 
observer.observe(document.body, { childList: true, subtree: false });
 
const keyupEvent = (e) => {
    if (e.keyCode === 13) {
        const chatInput = document.querySelector('input[name="chat"]');
        AnonimbiriAPI.ws.send(`42[11,${AnonimbiriAPI.playerId},"${chatInput.value}"]`);
        chatInput.value = '';
    }
};
 
window.addEventListener('keyup', keyupEvent);
window.AnonimbiriAPI = AnonimbiriAPI;
kit.render();