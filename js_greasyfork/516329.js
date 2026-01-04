// ==UserScript==
// @name         NitroType Ban Check (NTL / ntcomps)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Check if a user is banned and update their status
// @match        https://www.nitrotype.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fontawesome.com/icons/ban
// @connect      ntleaderboards.onrender.com
// @connect      ntcomps.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/516329/NitroType%20Ban%20Check%20%28NTL%20%20ntcomps%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516329/NitroType%20Ban%20Check%20%28NTL%20%20ntcomps%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let NT_COMPS_TOKEN;
    const NT_TOKEN = `Bearer ${localStorage.getItem("player_token")}`;
    const VALID_PAGE_PATTERNS = [{
            pattern: "https://www.nitrotype.com/leagues",
            handler: global_handleLeaguesPage
        },
        {
            pattern: "https://www.nitrotype.com/racer/",
            handler: global_handleUserPage
        },
        {
            pattern: "https://www.nitrotype.com/team/",
            handler: global_handleTeamPage
        },
    ];

    function init() {
        console.log("[BAN_CHECK_LOG] - Init. Checking page type.");
        const location = window.location.href;
        const validPage = VALID_PAGE_PATTERNS.find(({
            pattern
        }) => location.startsWith(pattern));

        if (validPage) {
            console.log("[BAN_CHECK_LOG]] - Valid page, getting NTComps Token.");
            get_NTCOMPS_TOKEN().then(token => {
                NT_COMPS_TOKEN = token.replace(/\n/g, '');
                main(validPage.handler);
            }).catch(error => {
                console.error(error);
            });
        } else {
            console.log("[BAN_CHECK_LOG]] - Invalid page, skipping token retrieval.");
        }
    }

    function main(handler) {
        console.log("[BAN_CHECK_LOG]] - Token updated, handling page.");
        handler();
    }

    function global_handleUserPage() {
        console.log("[BAN_CHECK_LOG]] - Handling User Page.");
        const username = getUsernameFromUrl();
        if (username) {
            getStatusAndColor(username)
                .then(({
                    finalStatus,
                    color
                }) => {
                    console.log(`[BAN_CHECK_LOG] - Status for user ${username} determined as ${finalStatus}, updating.`);
                    updateProfileStatus(finalStatus, color);
                })
                .catch(error => {
                    console.error("Error processing user:", error);
                });
        }

        function updateProfileStatus(finalStatus, color) {
            const playerNameContainer = document.querySelector('.profile-title');
            const statusLabel = document.createElement('span');
            statusLabel.textContent = finalStatus;
            statusLabel.style.color = color;
            statusLabel.style.marginLeft = "10px";
            if (playerNameContainer) {
                playerNameContainer.appendChild(statusLabel);
            }
        }

        function getUsernameFromUrl() {
            const pathParts = window.location.pathname.split('/');
            return pathParts[pathParts.length - 1];
        }
    }

    function global_handleTeamPage() {
        console.log(`[BAN_CHECK_LOG] - Handling Team page`);
        let countdown = 1;

        const countdownInterval = setInterval(() => {
            countdown--;

            if (countdown < 0) {
                clearInterval(countdownInterval);

                checkUserBansTeam();
            }
        }, 1000);


        async function updateUsersTeamApplications(userMap) {
            for (const [displayName, username] of Object.entries(userMap)) {
                try {
                    const {
                        finalStatus,
                        color
                    } = await getStatusAndColor(username);
                    console.log(`[BAN_CHECK_LOG] - Status for user ${username} determined as ${finalStatus}, updating.`);
                    await updateUserStatusTeamApplications(finalStatus, color, username, displayName);
                } catch (error) {
                    console.error(`Error processing user ${username}:`, error);
                }
            }
        }
        async function updateUsersTeam(userMap) {
            for (const [displayName, username] of Object.entries(userMap)) {
                try {
                    const {
                        finalStatus,
                        color
                    } = await getStatusAndColor(username);
                    console.log(`[BAN_CHECK_LOG] - Status for user ${username} determined as ${finalStatus}, updating.`);
                    await updateUserStatusTeam(finalStatus, color, username, displayName);
                } catch (error) {
                    console.error(`Error processing user ${username}:`, error);
                }
            }
        }


        async function checkUserBansTeam() {
            const applicationsMap = await fetchTeamApplications();
            const userMap = await fetchTeamActivity();
            document.querySelector('.table-cell.table-cell--races.table-filter').click();
            if (applicationsMap){
                console.log(`[BAN_CHECK_LOG] - Checking Team Applications`);
                updateUsersTeamApplications(applicationsMap);
            }
            if (userMap) {
                console.log(`[BAN_CHECK_LOG] - User Activity Retrieved, updating users`);
                updateUsersTeam(userMap);
            } else {
                console.error("Failed to retrieve user map.");
            }


        }

        function updateUserStatusTeamApplications(finalStatus, color, username, displayName) {
            //console.log("Checking team applications", finalStatus, color, username, displayName);
            const team_table = document.querySelector(".table.table--a.table--striped.well.well--m.well--b");
            const playerNameContainers = team_table.querySelectorAll('.player-name--container[title]');
            const playerNameContainer = Array.from(playerNameContainers).find(container => {
                const nameSpan = container.querySelector('.type-ellip');
                const isNameMatch = nameSpan && nameSpan.textContent.trim() === displayName.trim();

                if (isNameMatch) {
                    return container;
                }

                return false;
            });
            //console.log(playerNameContainer);
            const parentCont = playerNameContainer.parentElement;
            const titleCont = parentCont.nextElementSibling;
            const statusLabel = document.createElement('span');
            statusLabel.textContent = finalStatus;
            statusLabel.style.color = color;
            statusLabel.style.fontWeight = "bold";
            const existingStatusLabel = playerNameContainer.querySelector('.status-label');
            if (existingStatusLabel) {
                existingStatusLabel.remove();
            }
            if (titleCont) {
                statusLabel.classList.add('status-label');
                titleCont.innerHTML = '';
                titleCont.appendChild(statusLabel);
            }


        }

        function updateUserStatusTeam(finalStatus, color, username, displayName) {
            const team_table = document.querySelector('.table.table--striped.table--selectable.table--team.table--teamOverview');
            const playerNameContainers = team_table.querySelectorAll('.player-name--container[title]');
            const playerNameContainer = Array.from(playerNameContainers).find(container => {
                const nameSpan = container.querySelector('.type-ellip');
                const isNameMatch = nameSpan && nameSpan.textContent.trim() === displayName.trim();

                if (isNameMatch) {
                    return container;
                }

                return false;
            });
            //console.log(playerNameContainer);
            const parentCont = playerNameContainer.parentElement;
            const titleCont = parentCont.nextElementSibling;
            const statusLabel = document.createElement('span');
            statusLabel.textContent = finalStatus;
            statusLabel.style.color = color;
            statusLabel.style.fontWeight = "bold";
            const existingStatusLabel = playerNameContainer.querySelector('.status-label');
            if (existingStatusLabel) {
                existingStatusLabel.remove();
            }
            if (titleCont) {
                statusLabel.classList.add('status-label');
                titleCont.innerHTML = '';
                titleCont.appendChild(statusLabel);
            }

        }
        async function fetchTeamApplications() {
            try {
                const response = await fetch("https://www.nitrotype.com/api/v2/teams/applications", {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        authorization: NT_TOKEN,
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                    },
                    referrer: "https://www.nitrotype.com/team/FASZ",
                    referrerPolicy: "same-origin",
                    method: "GET",
                    mode: "cors",
                    credentials: "include"
                });

                const data = await response.json(); // Convert the response to JSON
                const memberMap = {};

                // Populate memberMap based on data.results
                data.results.forEach(member => {
                    const { displayName, username } = member;
                    memberMap[displayName || username] = username;
                });

                console.log(memberMap); // Log memberMap for inspection
                return memberMap; // Return the populated memberMap
            } catch (error) {
                console.error("Error fetching team applications:", error);
                return null;
            }
        }


        async function fetchTeamActivity() {
            try {
                const TEAM = window.location.pathname.split('/').pop();
                const response = await fetch(`https://www.nitrotype.com/api/v2/teams/${TEAM}`, {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        authorization: NT_TOKEN,
                    },
                    referrer: `https://www.nitrotype.com/team/${TEAM}`,
                    referrerPolicy: "same-origin",
                    method: "GET",
                    mode: "cors",
                    credentials: "include"
                });

                const data = await response.json();
                if (data.status === "OK") {
                    const members = data.results.members;
                    members.sort((a, b) => b.played - a.played);

                    const memberMap = {};

                    members.forEach(member => {
                        const {
                            displayName,
                            username
                        } = member;
                        memberMap[displayName || username] = username;
                    });
                    console.log(memberMap);
                    return memberMap;
                } else {
                    console.error("Error: ", data.status);
                    return null;
                }
            } catch (error) {
                console.error("Fetch error: ", error);
                return null;
            }
        }


    }

    function global_handleLeaguesPage() {
        console.log(`[BAN_CHECK_LOG] - Handling Leagues page`);
        let countdown = 1;

        const countdownInterval = setInterval(() => {
            countdown--;

            if (countdown < 0) {
                clearInterval(countdownInterval);
                checkUserBans();
            }
        }, 1000);
        async function fetchUserActivity() {
            try {
                const response = await fetch("https://www.nitrotype.com/api/v2/leagues/user/activity", {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        authorization: NT_TOKEN,
                    },
                    referrer: "https://www.nitrotype.com/leagues",
                    referrerPolicy: "same-origin",
                    method: "GET",
                    mode: "cors",
                    credentials: "include"
                });

                const data = await response.json();
                if (data.status === "OK") {
                    const standings = data.results.standings;
                    standings.sort((a, b) => b.experience - a.experience);

                    const userMap = {};

                    standings.forEach(user => {
                        const {
                            displayName,
                            username
                        } = user;
                        userMap[displayName || username] = username;
                    });
                    return userMap;
                } else {
                    console.error("Error: ", data.status);
                    return null;
                }
            } catch (error) {
                console.error("Fetch error: ", error);
                return null;
            }
        }
        async function updateUsers(userMap) {
            for (const [displayName, username] of Object.entries(userMap)) {
                try {
                    const {
                        finalStatus,
                        color
                    } = await getStatusAndColor(username);
                    console.log(`[BAN_CHECK_LOG] - Status for user ${username} determined as ${finalStatus}, updating.`);
                    await updateUserStatus(finalStatus, color, username, displayName);
                } catch (error) {
                    console.error(`Error processing user ${username}:`, error);
                }
            }
        }


        async function checkUserBans() {

            const userMap = await fetchUserActivity();

            if (userMap) {
                console.log(`[BAN_CHECK_LOG] - User Activity Retrieved, updating users`);
                updateUsers(userMap);
            } else {
                console.error("Failed to retrieve user map.");
            }

        }

        function updateUserStatus(finalStatus, color, username, displayName) {
            const playerNameContainers = document.querySelectorAll('.player-name--container[title]');
            const playerNameContainer = Array.from(playerNameContainers).find(container => {
                const nameSpan = container.querySelector('.type-ellip');
                const isNameMatch = nameSpan && nameSpan.textContent.trim() === displayName.trim();

                if (isNameMatch) {
                    return container;
                }

                return false;
            });
            const parentCont = playerNameContainer.parentElement;
            const titleCont = parentCont.nextElementSibling;
            const statusLabel = document.createElement('span');
            statusLabel.textContent = finalStatus;
            statusLabel.style.color = color;
            statusLabel.style.fontWeight = "bold";
            const existingStatusLabel = playerNameContainer.querySelector('.status-label');
            if (existingStatusLabel) {
                existingStatusLabel.remove();
            }
            if (titleCont) {
                statusLabel.classList.add('status-label');
                titleCont.innerHTML = '';
                titleCont.appendChild(statusLabel);
            }

        }
    }


    function get_NTCOMPS_TOKEN() {
        const targetUrl = 'https://www.ntcomps.com/racers/search';
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                url: targetUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const tokenElement = doc.querySelector('input[name="authenticity_token"]');
                        if (tokenElement) {
                            const tokenValue = tokenElement.value;
                            resolve(tokenValue);
                        } else {
                            reject('authenticity_token element not found.');
                        }
                    } else {
                        reject(`Failed to fetch page: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('Error fetching the page: ' + error);
                }
            });
        });
    }

    async function getStatusAndColor(username, retries = 3, delay = 1000) {
        let attempts = 0;

        while (attempts < retries) {
            try {
                const NTL_status = await ntleaderboards_check(username);
                const NTC_status = await ntcomps_check(username);
                //console.log(NTL_status, NTC_status);
                const {
                    finalStatus,
                    color
                } = determineFinalStatus(NTL_status, NTC_status);

                return {
                    finalStatus,
                    color
                };
            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed:`, error);

                if (attempts < retries) {
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.error("Max retries reached. Throwing error.");
                    throw error;
                }
            }
        }
    }

    // Function to check if a user is banned from ntleaderboards
    // return "Not Banned" (legit or not found) / Banned" (and flagged) / "Banned, but not bot" (if banned but no flag)
    function ntleaderboards_check(username) {
        console.log(`[BAN_CHECK_LOG] - Waiting for ${username} status from ntleaderboards.`);
        const url = `https://ntleaderboards.onrender.com/is_user_banned/${username}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = response.responseText;
                        let banned_status;
                        if (data === "N") {
                            banned_status = "Not Banned";
                        } else {
                            if (data.includes("flag")) {
                                banned_status = "Banned";
                            } else {
                                banned_status = "Banned, but not bot";
                            }
                        }
                        resolve(banned_status);
                    } else {
                        reject(`Request failed with status: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('Error fetching data: ' + error);
                }
            });
        });
    }

    // Function to check racer status from ntcomps // Return "Flagged" or "Legit" or "Not found"
    async function ntcomps_check(searchString) {
        console.log(`[BAN_CHECK_LOG] - Waiting for ${searchString} status from ntcomps.`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://www.ntcomps.com/racers/search",
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                },
                data: `authenticity_token=${encodeURIComponent(NT_COMPS_TOKEN)}&racer%5Bsearch_string%5D=${encodeURIComponent(searchString)}&racer%5Bflagged%5D=0&commit=Search+racer`,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const rows = doc.querySelectorAll("tbody tr");

                        for (const row of rows) {
                            const cells = row.querySelectorAll("td");
                            if (cells.length >= 6) {
                                const racerName = cells[2].textContent.trim();

                                if (racerName.toLowerCase() === searchString.toLowerCase()) {
                                    const status = cells[5].textContent.trim();
                                    resolve(status);
                                    return;
                                }
                            }
                        }
                        resolve("Not found");
                    } else {
                        console.error('Request failed with status:', response.status);
                        reject("Error");
                    }
                },
                onerror: function(error) {
                    console.error('Error occurred:', error);
                    reject("Error");
                }
            });
        });
    }

    //Possible Final Statuses
    //"Bot (100%)" if Banned / Flagged at both - RED
    //"Bot (ntcomps)" if Flagged at ntcomps only - RED
    //"Bot (NTL)" if Flagged at NTL only - RED
    //"NTL banned (not bot?)" - When banned at NTL only, but not for botting - ORANGE
    //"Legit" - Not banned, not Flagged at both - GREEN
    //GRAY color should mean ERROR
    function determineFinalStatus(NTL_status, NTC_status) {
        console.log({"NTL":NTL_status, "NTC": NTC_status});
        const statusMap = {
            "Not Banned": {
                "Flagged on NTcomps": {
                    finalStatus: "Bot (ntcomps)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Flagged on both platforms": {
                    finalStatus: "Bot (100%)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Flagged on NTLeaderboards": {
                    finalStatus: "Bot (NTL)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Legit": {
                    finalStatus: "Legit",
                    color: "rgb(0, 255, 0)"
                }, // Green
                "Not found": {
                    finalStatus: "Unknown player",
                    color: "rgb(255, 255, 0)"
                } // Yellow
            },
            "Banned": {
                "Flagged on NTcomps": {
                    finalStatus: "Bot (ntcomps)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Flagged on both platforms": {
                    finalStatus: "Bot (100%)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Flagged on NTLeaderboards": {
                    finalStatus: "Bot (NTL)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Legit": {
                    finalStatus: "Bot (NTL)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Not found": {
                    finalStatus: "Bot (NTL)",
                    color: "rgb(255, 0, 0)"
                } // Red
            },
            "Banned, but not bot": {
                "Flagged on NTcomps": {
                    finalStatus: "Bot (ntcomps)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Flagged on both platforms": {
                    finalStatus: "Bot (100%)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Flagged on NTLeaderboards": {
                    finalStatus: "Bot (NTL)",
                    color: "rgb(255, 0, 0)"
                }, // Red
                "Legit": {
                    finalStatus: "NTL banned (not bot?)",
                    color: "rgb(255, 165, 0)"
                }, // Orange
                "Not found": {
                    finalStatus: "NTL banned (not bot?)",
                    color: "rgb(255, 165, 0)"
                } // Orange
            }
        };
        const result = statusMap[NTL_status]?.[NTC_status];
        return result || {
            finalStatus: "Unknown status",
            color: "rgb(128, 128, 128)"
        }; // Default to gray color for unknown cases
    }

    init();

})();