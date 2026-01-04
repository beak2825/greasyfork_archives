// ==UserScript==
// @name         Lemmy mlmym community bar customisation
// @namespace    https://greasyfork.org/
// @version      0.3
// @description  Allows customisation of the lemmy community bar
// @author       9point6
// @match        https://old.lemmy.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemmy.world
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474756/Lemmy%20mlmym%20community%20bar%20customisation.user.js
// @updateURL https://update.greasyfork.org/scripts/474756/Lemmy%20mlmym%20community%20bar%20customisation.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const INITIAL_COMMUNITIES = [
        'football',
        'unitedkingdom@feddit.uk',
        'android@lemdro.id',
    ];

    const LOCAL_STORAGE_KEY = 'lemmyCommunityBarSettings';

    const updateSettings = (newCommunitiesList) => {
        const settings = {
            settingsVersion: 1,
            communities: newCommunitiesList.filter((item) => typeof item === 'string')
        };

        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));

        return settings;
    }

    const loadSettings = () => {
        try {
            const existingSettings = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (existingSettings) {
                return JSON.parse(existingSettings);
            }
        } catch (ex) {}

        return updateSettings(INITIAL_COMMUNITIES);
    }

    const hideEditMenu = () => {
        const container = document.querySelector('#community-bar-editor');
        if (container) {
            container.remove();
        }
    }

    const createConfigButton = (icon, title, callback) => {
        const configButton = document.createElement('button');
        const configText = document.createTextNode(icon);

        configButton.title = title;
        configButton.style.padding = '0';
        configButton.style.fontSize = '10px';
        configButton.style.marginRight = '4px';
        configButton.style.cursor = 'pointer';
        configButton.style.background = 'none';
        configButton.style.border = 'none';
        configButton.style.transition = 'filter 0.1s ease-in-out, background-color 0.1s ease-in-out';

        configButton.append(configText);

        configButton.addEventListener('mouseover', (e) => {
            if (!configButton.disabled) {
                configButton.style.filter = 'brightness(1.2)';
                configButton.style.background = 'white';
            }
        });

        configButton.addEventListener('mouseout', (e) => {
            if (!configButton.disabled) {
                configButton.style.filter = 'none';
                configButton.style.background = 'none';
            }
        });

        configButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            callback();
        });

        return configButton;
    }

    const showEditMenu = () => {
        hideEditMenu();

        const settings = loadSettings();

        const communties = document.querySelector('.communities');
        const background = document.createElement('div');
        const container = document.createElement('ol');

        background.id = 'community-bar-editor';
        background.style.backgroundColor = 'rgba(0,0,0,0.5)';
        background.style.position = 'absolute';
        background.style.top = 0;
        background.style.left = 0;
        background.style.width = '100%';
        background.style.height = '100vh';
        background.style.zIndex = '102';

        container.style.backgroundColor = '#ccc';
        container.style.position = 'absolute';
        container.style.top = '8px';
        container.style.right = 0;
        container.style.padding = '4px';
        container.style.border = '1px #ccc solid';

        background.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideEditMenu();
        });

        background.append(container);
        communties.append(background);

        settings.communities.map((community, communityIndex) => {
            const item = document.createElement('li');
            const text = document.createTextNode(community);

            const deleteButton = createConfigButton('❌', 'Remove community from your favourites', () => {
                updateSettings(settings.communities.filter((communityName) =>
                    communityName !== community
                ));
                showEditMenu();
            });

            const upButton = createConfigButton('⬆️', 'Move this community up in the list', () => {
                const { communities } = settings;
                [
                    communities[communityIndex - 1],
                    communities[communityIndex]
                ] = [
                    communities[communityIndex],
                    communities[communityIndex - 1]
                ];

                updateSettings(communities);
                showEditMenu();
            });

            if (communityIndex === 0) {
                upButton.disabled = true;
                upButton.style.cursor = 'default';
            }

            const downButton = createConfigButton('⬇️', 'Move this community down in the list', () => {
                const { communities } = settings;
                [
                    communities[communityIndex + 1],
                    communities[communityIndex]
                ] = [
                    communities[communityIndex],
                    communities[communityIndex + 1]
                ];

                updateSettings(communities);
                showEditMenu();
            });

            if (communityIndex === settings.communities.length - 1) {
                downButton.disabled = true;
                downButton.style.cursor = 'default';
            }

            item.style.display = 'block';
            item.style.fontSize = '10px';
            item.style.fontWeight = '400';
            item.style.color = '#000';

            item.append(deleteButton);
            item.append(upButton);
            item.append(downButton);
            item.append(text);
            container.append(item);
        })

        const buttonRow = document.createElement('li');
        const addButton = document.createElement('button')
        const addText = document.createTextNode('add');
        const closeButton = document.createElement('button')
        const closeText = document.createTextNode('finish editing');
        const separatorText = document.createTextNode(' ');

        addButton.append(addText);
        closeButton.append(closeText);
        buttonRow.append(addButton);
        buttonRow.append(separatorText);
        buttonRow.append(closeButton);
        container.append(buttonRow);

        addButton.style.cursor = 'pointer';
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newCommunity = prompt('New community to add, make sure you include the instance suffix if it isn\'t a local community');
            updateSettings(settings.communities.concat(newCommunity));
            showEditMenu();
        })

        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideEditMenu();
            window.location.reload();
        })
    };

    const addFavouriteButton = () => {
        const { pathname } = window.location;
        if (!(pathname.startsWith('/c/') || pathname.startsWith('/post/'))) {
            return;
        }

        const { communities } = loadSettings();

        const thisCommunityTitle = document.querySelector('nav .title').textContent.trim();
        const alreadySubscribed = communities.includes(thisCommunityTitle);

        const sidebar = document.querySelector('.side');
        const blockButton = document.querySelector('.side .block');
        const favouriteButton = document.createElement('button');
        const favouriteText = document.createTextNode( alreadySubscribed ? 'unfavourite' : 'favourite');


        favouriteButton.style.fontSize = '10px';
        favouriteButton.style.fontWeight = 'bold';
        favouriteButton.style.display = 'inline-block';
        favouriteButton.style.padding = '1px 4px';
        favouriteButton.style.borderRadius = '4px';
        favouriteButton.style.border = '1px solid #444444';
        favouriteButton.style.color = 'white';
        favouriteButton.style.position = 'relative';
        favouriteButton.style.bottom = '1px';
        favouriteButton.style.cursor = 'pointer';
        favouriteButton.style.backgroundColor = alreadySubscribed ? '#cf6165' : 'green';
        favouriteButton.style.marginRight = '4px';

        favouriteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            updateSettings(
                alreadySubscribed
                ? communities.filter((title) => title !== thisCommunityTitle)
                : communities.concat(thisCommunityTitle)
            );

            window.location.reload();
        });

        favouriteButton.append(favouriteText);
        sidebar.insertBefore(favouriteButton, blockButton);
    }

    const addEditButton = () => {
        const more = document.querySelector('.communities .more');
        const communties = document.querySelector('.communities');
        const button = document.createElement('button');
        const buttonSpan = document.createElement('span');
        const buttonText = document.createTextNode('⚙️');

        buttonSpan.append(buttonText);
        button.append(buttonSpan);
        communties.append(button);

        more.style.right = '20px';

        button.title = 'Edit favourite communities';
        button.style.backgroundColor = '#ccc';
        button.style.position = 'absolute';
        button.style.top = 0;
        button.style.right = 0;
        button.style.border = 0;
        button.style.fontSize = '10px';
        button.style.cursor = 'pointer';
        buttonSpan.style.filter = 'brightness(0.5)';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const container = document.querySelector('#community-bar-editor');
            if (container) {
                hideEditMenu();
            } else {
                showEditMenu();
            }
        });
    }

    const addCommunityToBar = (name) => {
        const shortName = name.split('@')[0];

        const a = document.createElement('a');
        const link = document.createTextNode(shortName);
        const separator = document.createTextNode(" - ");

        a.appendChild(link);
        a.href = `/c/${name}`;
        a.title = `Go to !${name}`;


        const communities = document.querySelector('.communities')
        const firstLink = document.querySelector('.communities a:nth-child(5)')

        communities.insertBefore(separator, firstLink);
        communities.insertBefore(a, separator);
    }

    loadSettings().communities.reverse().map(addCommunityToBar)
    addEditButton();
    addFavouriteButton();

})();