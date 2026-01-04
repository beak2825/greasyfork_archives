// ==UserScript==
// @name         Hunger Games Teams
// @namespace    Keir
// @version      1.1
// @description  Script to add teams to ice poseidons hunger games map
// @author       KeirStarmer
// @match        https://map.iceposeidon.com/
// @match        https://hungergames.iceposeidon.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iceposeidon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503781/Hunger%20Games%20Teams.user.js
// @updateURL https://update.greasyfork.org/scripts/503781/Hunger%20Games%20Teams.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const jsonURL = 'https://cxwatcher.github.io/teams.json';
    fetch(jsonURL)
        .then(response => response.json())
        .then(teamColors => {
            const teams = {};
            for (const [username, color] of Object.entries(teamColors)) {
                if (!teams[color]) {
                    teams[color] = [];
                }
                teams[color].push(username);
            }
            function changeUserBoxColor() {
                const usernames = document.querySelectorAll('.username');
                usernames.forEach(function(username) {
                    const name = username.textContent.trim();
                    if (teamColors[name]) {
                        username.closest('.user-marker-inner').style.backgroundColor = teamColors[name];
                    }
                });
            }

            window.addEventListener('load', changeUserBoxColor);
            new MutationObserver(changeUserBoxColor).observe(document.body, {childList: true, subtree: true});

            const gulagDiv = document.querySelector('.gulag');
            if (gulagDiv) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.marginTop = '10px';
                const buttonState = {};
                for (const [color, members] of Object.entries(teams)) {
                    const teamButton = document.createElement('button');
                    teamButton.textContent = `${color.charAt(0).toUpperCase() + color.slice(1)} Team`;
                    teamButton.style.margin = '5px';
                    teamButton.style.backgroundColor = color;
                    teamButton.style.color = color === 'yellow' || color === 'white' ? 'black' : 'white';
                    teamButton.style.border = 'none';
                    teamButton.style.padding = '5px';
                    teamButton.style.borderRadius = '5px';
                    teamButton.style.display = 'block';

                    buttonContainer.appendChild(teamButton);

                    buttonState[color] = false;

                    teamButton.addEventListener('click', () => {
                        const usernames = document.querySelectorAll('.username');
                        if (!buttonState[color]) {
                            usernames.forEach(function(username) {
                                const name = username.textContent.trim();
                                if (teamColors[name] === color) {
                                    username.closest('.user-marker-inner').style.display = 'block';
                                } else {
                                    username.closest('.user-marker-inner').style.display = 'none';
                                }
                            });
                            buttonState[color] = true;
                        } else {
                            usernames.forEach(function(username) {
                                username.closest('.user-marker-inner').style.display = 'block';
                            });
                            buttonState[color] = false;
                        }
                    });
                }
                gulagDiv.insertAdjacentElement('afterend', buttonContainer);
            }

            // Insert data list to the bottom left
            const dataListContainer = document.createElement('div');
            dataListContainer.style.position = 'fixed';
            dataListContainer.style.bottom = '10px';
            dataListContainer.style.left = '10px';
            dataListContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            dataListContainer.style.color = 'white';
            dataListContainer.style.padding = '10px';
            dataListContainer.style.borderRadius = '5px';
            dataListContainer.style.zIndex = '1000';
            dataListContainer.style.maxHeight = '80vh';
            dataListContainer.style.overflowY = 'auto';

            const dataList = document.createElement('ul');
            dataList.id = 'data-list';
            dataList.style.listStyleType = 'none';
            dataList.style.padding = '0';
            dataList.style.margin = '0';

            dataListContainer.appendChild(dataList);
            document.body.appendChild(dataListContainer);

           const toggledUsers = {};
function updateList() {
    fetch('https://appapi.iceposeidon.com/public')
        .then(response => response.json())
        .then(data => {
            const sortedData = data.sort((a, b) => a.lives_remaining - b.lives_remaining);
            const list = document.getElementById('data-list');
            list.innerHTML = '';

            sortedData.forEach(entry => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `https://kick.com/${entry.name}`;
                link.textContent = entry.name;
                link.target = '_blank';
                const livesText = document.createTextNode(` - ${entry.lives_remaining}`);
                listItem.appendChild(link);
                listItem.appendChild(livesText);
                list.appendChild(listItem);
                const nameLower = entry.name.toLowerCase();
                listItem.addEventListener('mouseover', () => {
                    if (Object.keys(toggledUsers).length === 0) {
                        const usernames = document.querySelectorAll('.username');
                        usernames.forEach(function (username) {
                            const name = username.textContent.trim().toLowerCase();
                            if (name === nameLower) {
                                username.closest('.user-marker-inner').style.display = 'block';
                            } else {
                                username.closest('.user-marker-inner').style.display = 'none';
                            }
                        });
                    }
                });

                listItem.addEventListener('mouseout', () => {
                    if (Object.keys(toggledUsers).length === 0) {
                        const usernames = document.querySelectorAll('.username');
                        usernames.forEach(function (username) {
                            username.closest('.user-marker-inner').style.display = 'block';
                        });
                    }
                });
                listItem.addEventListener('click', () => {
                    const usernames = document.querySelectorAll('.username');

                    if (toggledUsers[nameLower]) {
                        usernames.forEach(function (username) {
                            if (username.textContent.trim().toLowerCase() === nameLower) {
                                username.closest('.user-marker-inner').style.display = 'none';
                            }
                        });
                        listItem.style.backgroundColor = '';
                        delete toggledUsers[nameLower];
                    } else {
                        usernames.forEach(function (username) {
                            if (username.textContent.trim().toLowerCase() === nameLower) {
                                username.closest('.user-marker-inner').style.display = 'block';
                            } else if (!toggledUsers[username.textContent.trim().toLowerCase()]) {
                                username.closest('.user-marker-inner').style.display = 'none';
                            }
                        });

                        listItem.style.backgroundColor = 'green';
                        toggledUsers[nameLower] = true;
                    }
                    usernames.forEach(function (username) {
                        const name = username.textContent.trim().toLowerCase();
                        if (toggledUsers[name]) {
                            username.closest('.user-marker-inner').style.display = 'block';
                        }
                    });
                });

                if (toggledUsers[nameLower]) {
                    listItem.style.backgroundColor = 'green';
                }
            });

            const usernames = document.querySelectorAll('.username');
            usernames.forEach(function (username) {
                const nameLower = username.textContent.trim().toLowerCase();
                if (toggledUsers[nameLower]) {
                    username.closest('.user-marker-inner').style.display = 'block';
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

            updateList();
            setInterval(updateList, 10000);

        })
        .catch(error => console.error('Error fetching team colors:', error));
})();
