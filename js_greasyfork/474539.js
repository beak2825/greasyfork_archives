// ==UserScript==
// @name         AQ Ruffle Enhance
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  A set of enhancements for serious AdventureQuest play!
// @author       You
// @match        https://*.battleon.com/game/web*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=battleon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474539/AQ%20Ruffle%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/474539/AQ%20Ruffle%20Enhance.meta.js
// ==/UserScript==

const gameSwf = document.getElementsByClassName("base")[0].src;
const baseSwf = window.location.origin + '/game/flash/';
const MAX_PLAYERS = 5;
const MENU_BAR_HEIGHT = 20;

const serverOptions = [
    { value: 'aq', name: 'aq' },
    { value: 'guardian', name: 'guardian' },
    { value: 'new', name: 'new' }
];

const renderOptions = [
    { value: 'webgpu', name: "WebGPU" },
    { value: 'wgpu-webgl', name: "WGPU" },
    { value: 'webgl', name: "WebGL" },
    { value: 'canvas', name: 'Canvas2D' }
];

const links = [
    { url: 'https://account.battleon.com/', name: 'Manage Account' },
    { url: 'https://aq-char-info.firebaseapp.com/', name: 'Char Info' },
    { url: 'https://battleon.com/', name: 'Home' },
    { url: 'https://adventurequestwiki.fandom.com/wiki/AdventureQuestWiki_Wiki', name: 'Wiki' },
    { url: 'https://forums2.battleon.com/f/tt.asp?forumid=1', name: 'Forums' },
    { url: 'https://discord.com/invite/FQsFCGV', name: 'Discord' },
];

const defaultPlayerConfig = {
    url: gameSwf,
    base: baseSwf,
    preferredRenderer: "webgl",
    warnOnUnsupportedContent: false,
};

const createElement = (tag, options = {}) => Object.assign(document.createElement(tag), options);

const renderDropdown = (options, selectOptions = {}) => {
    const select = createElement('select', selectOptions);
    options.forEach((option) => {
        const selectOption = createElement('option', {
            value: option.value,
            text: option.name,
            selected: defaultPlayerConfig.preferredRenderer === option.value
        });
        select.appendChild(selectOption);
    });

    return select;
};

const renderOptionGroup = (dropdown, button) => {
    const optionGroup = createElement('span');
    optionGroup.appendChild(dropdown);
    optionGroup.appendChild(button);

    return optionGroup;
};

const resizeWindows = () => {
    const container = document.getElementById('container');
    container.style.width = window.innerWidth;
    const playerContainers = Array.from(document.getElementsByClassName('player-container'));

    if (playerContainers.length === 0) {
        addWindow();
        resizeWindows();
        return;
    }

    // Thanks to nivp for the window resize algorithm!
    const availableHeight = window.innerHeight - MENU_BAR_HEIGHT;
    let max_width = 0;
    let max_height = 0;

    // maximize cell size through column search
    for (let i = 1; i <= playerContainers.length; i++) {
        let temp_height = availableHeight / Math.ceil(playerContainers.length / i);
        let temp_width = temp_height * 4 / 3;
        if (temp_width * i > (window.innerWidth * i) / (i + 1) && temp_width * i <= window.innerWidth) {
            max_width = temp_width;
            max_height = temp_height;
        }
    }

    // maximize cell size through row search
    for (let i = 1; i <= playerContainers.length; i++) {
        let temp_width = window.innerWidth / Math.ceil(playerContainers.length / i);
        let temp_height = temp_width * 3 / 4;
        if (
            temp_height * i > (availableHeight * i) / (i + 1) &&
            temp_height * i <= availableHeight
        ) {
            max_width = temp_width;
            max_height = temp_height;
        }
    }

    playerContainers.forEach((player) => {
        player.style.width = max_width;
        player.style.height = max_height;

        const rufflePlayer = player.getElementsByTagName('ruffle-player')[0];
        const playerMenuBar = player.getElementsByClassName('player-menu-bar')[0];

        rufflePlayer.style.height = max_height;
        rufflePlayer.style.width = max_height * 4 / 3;
        playerMenuBar.style.width = max_height * 4 / 3;
    });
};

const addWindow = () => {
    const container = document.getElementById('container');
    const player = window.RufflePlayer.newest().createPlayer();
    player.style = 'margin: 0 auto;';

    const playerContainer = createElement('div', {
        className: 'player-container',
        style: 'display: flex; flex-direction: column; align-items: center;'
    });
    const playerMenuBar = createElement('div', {
        className: 'player-menu-bar',
        style: `height: ${MENU_BAR_HEIGHT}px; background-color: grey; display: flex; justify-content: center;`
    });


    const killWindowButton = createElement('button', {
        innerText: 'x',
        onclick: () => {
            playerContainer.remove();
            document.getElementById('add-button').disabled = false;
            document.getElementById('add-all-button').disabled = false;
            resizeWindows();
        }
    });

    const refreshPlayerButton = createElement('button', {
        innerText: 'Refresh',
        onclick: () => player.reload()
    });

    const dropdown = renderDropdown(renderOptions, { className: 'player-dropdown' });
    const changeRendererButton = createElement('button', {
        innerText: 'Change Renderer',
        onclick: () => {
            const selectedValue = dropdown.value;
            const playerConfig = Object.assign({}, defaultPlayerConfig);
            playerConfig.preferredRenderer = selectedValue;
            player.load(playerConfig);
        }
    });

    const rendererGroup = renderOptionGroup(dropdown, changeRendererButton);

    playerMenuBar.appendChild(rendererGroup);
    playerMenuBar.appendChild(refreshPlayerButton);
    playerMenuBar.appendChild(killWindowButton);

    playerContainer.appendChild(playerMenuBar);
    playerContainer.appendChild(player);
    container.appendChild(playerContainer);

    player.load(defaultPlayerConfig);
};

const addAllWindows = () => {
    const playerContainers = document.getElementsByTagName('ruffle-player');
    for (let i = playerContainers.length; i < MAX_PLAYERS; i++) {
        addWindow();
    }
};

const renderMenuBar = () => {
    const menuBar = createElement('div', {
        style: `height: ${MENU_BAR_HEIGHT}px; width: 100%; display: flex; justify-content: space-between;`
    });

    const addButton = createElement("button", {
        id: 'add-button',
        innerText: '+Add',
        onclick: () => {
            addWindow();
            const playerContainers = document.getElementsByTagName('ruffle-player');
            document.getElementById('add-button').disabled = playerContainers.length === MAX_PLAYERS;
            document.getElementById('add-all-button').disabled = playerContainers.length === MAX_PLAYERS;
            resizeWindows();
        }
    });

    const addAllButton = createElement("button", {
        id: 'add-all-button',
        innerText: `+Max (${MAX_PLAYERS})`,
        onclick: () => {
            addAllWindows();
            document.getElementById('add-button').disabled = true;
            addAllButton.disabled = true;
            resizeWindows();
        }
    });

    const killAllButton = createElement('button', {
        id: 'kill-all-button',
        innerText: 'Kill Windows',
        onclick: () => {
            const playerContainers = Array.from(document.getElementsByClassName('player-container'));
            playerContainers.forEach((playerContainer) => {
                playerContainer.remove();
            });
            document.getElementById('add-button').disabled = false;
            document.getElementById('add-all-button').disabled = false;
            addWindow();
            resizeWindows();
        }
    });

    const rendererDropdown = renderDropdown(renderOptions);
    const changeRendererButton = createElement('button', {
        innerText: 'Change Renderers',
        onclick: () => {
            const selectedValue = rendererDropdown.value;
            const players = Array.from(document.getElementsByTagName('ruffle-player'));
            players.forEach((player) => {
                const playerConfig = Object.assign({}, defaultPlayerConfig);
                playerConfig.preferredRenderer = selectedValue;
                defaultPlayerConfig.preferredRenderer = selectedValue;
                player.load(playerConfig);
            });

            const playerDropdowns = Array.from(document.getElementsByClassName('player-dropdown'));
            playerDropdowns.forEach((dropdown) => {
                dropdown.value = selectedValue
            });
        }
    });

    const rendererOptionsGroup = renderOptionGroup(rendererDropdown, changeRendererButton);

    const goToServer = createElement('button', {
        textContent: 'New Tab',
        onclick: () => {
            const select = document.getElementById('server-select');
            window.open(`https://${select.value}.battleon.com/game/web`);
        }
    });

    const dropdown = renderDropdown(serverOptions, {
        id: 'server-select'
    });

    const buttonGroup = createElement('div');
    buttonGroup.appendChild(addButton);
    buttonGroup.appendChild(addAllButton);
    buttonGroup.appendChild(killAllButton);

    const linksGroup = createElement('div');
    links.forEach((link, index) => {
        const newLink = createElement('a', {
            textContent: link.name,
            href: link.url,
            target: '_blank',
            rel: 'noopener',
            style: 'font-size: 16px;'
        });

        linksGroup.appendChild(newLink);
        if (index !== links.length - 1) {
            const sep = createElement('span', {
                textContent: '|',
                style: 'font-size: 16px; margin: 5px;'
            });

            linksGroup.appendChild(sep);
        }
    });

    const selectGroups = createElement('div');
    const serverOptionsGroup = renderOptionGroup(dropdown, goToServer);

    selectGroups.appendChild(rendererOptionsGroup);
    selectGroups.appendChild(serverOptionsGroup);

    menuBar.appendChild(buttonGroup);
    menuBar.appendChild(linksGroup);
    menuBar.appendChild(selectGroups);

    const playersGroup = createElement('div', {
        id: "container",
        style: 'display: flex; flex-wrap: wrap; justify-content: center;'
    });

    document.body.appendChild(playersGroup);
    playersGroup.appendChild(menuBar);
}

const checkForRuffle = () => {
    const checker = setInterval(() => {
        if (window.RufflePlayer && window.RufflePlayer.invoked) {
            clearInterval(checker);

            window.addEventListener('resize', () => {
                let timer;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    resizeWindows();
                }, 250);
            });

            document.body.style.margin = 0;
            document.getElementById('main').remove();

            renderMenuBar();
            addWindow();
            resizeWindows();

            window.onbeforeunload = (e) => {
                return 'Are you sure you want to quit?'
            }
        }
    }, 100);

    setTimeout(() => {
        clearInterval(checker);
        if (!window.RufflePlayer && window.confirm('I could not detect the Ruffle Plugin. Would you like to attempt importing Ruffle?')) {
            const script = createElement('script', {
                type: 'text/javascript',
                src: 'https://unpkg.com/@ruffle-rs/ruffle'
            });
            document.getElementsByTagName('head')[0].appendChild(script);
            checkForRuffle();
        }
    }, 2000);
}

(function() {
    'use strict';
    checkForRuffle();
})();