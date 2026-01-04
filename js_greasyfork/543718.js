// ==UserScript==
// @name         Guess the Scummer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  A forum guessing game
// @author       GeorgeBailey
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg
// @match        *://*.mafiascum.net/viewtopic.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543718/Guess%20the%20Scummer.user.js
// @updateURL https://update.greasyfork.org/scripts/543718/Guess%20the%20Scummer.meta.js
// ==/UserScript==

// This small, self-contained function runs immediately before the page is visible.
(function() {
    const style = document.createElement('style');
    style.textContent = `
        dl.postprofile,
        div.signature,
        .post a[href*="memberlist.php?mode=viewprofile"] {
            visibility: hidden !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);
})();

window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const STORAGE_KEY = 'mafiaScumGTSData';
    const originalPostData = {};

    // --- DATA MANAGEMENT ---
    async function loadData() {
        const defaultData = {
            global: { wins: 0, losses: 0, userStats: {} },
            threads: {},
            revealedPosts: {}
        };
        const savedData = await GM_getValue(STORAGE_KEY, {});
        const mergedData = { ...defaultData, ...savedData };
        mergedData.global = { ...defaultData.global, ...mergedData.global };
        return mergedData;
    }

    async function saveData(data) {
        await GM_setValue(STORAGE_KEY, data);
    }

    async function resetScoreData() {
        if (confirm('Are you sure you want to reset your Guess that scummer score and all stats?')) {
            await GM_setValue(STORAGE_KEY, {
                global: { wins: 0, losses: 0, userStats: {} },
                threads: {},
                revealedPosts: {}
            });
            alert('Score data and stats have been reset. The page will now reload.');
            location.reload();
        }
    }

    // --- ANONYMIZING & REVEAL LOGIC ---
    function anonymizeText() {
        return '?'.repeat(Math.floor(Math.random() * 9) + 1);
    }

    function tagAllQuotes() {
        document.querySelectorAll('blockquote cite').forEach(cite => {
            const postLink = cite.querySelector('a[data-post-id]');
            const userLink = cite.querySelector('a[href*="memberlist.php?mode=viewprofile"]');
            if (postLink && userLink && !userLink.dataset.quotedPostId) {
                const quotedPostIdNum = postLink.dataset.postId;
                userLink.dataset.quotedPostId = `p${quotedPostIdNum}`;
                userLink.dataset.originalName = userLink.textContent.trim();
                userLink.classList.add('anonymized-quote');
            }
        });
    }

    async function updateRevealedQuotes() {
        const storedData = await loadData();
        const revealedPosts = storedData.revealedPosts || {};
        document.querySelectorAll('.anonymized-quote').forEach(el => {
            const quotedPostId = el.dataset.quotedPostId;
            const originalName = el.dataset.originalName;
            if (revealedPosts[quotedPostId]) {
                el.textContent = originalName;
            } else {
                el.textContent = anonymizeText();
            }
        });
    }

    function handleVisualElements(postElement) {
        postElement.querySelectorAll('.avatar-container:not(.anonymized-avatar)').forEach(container => {
            container.classList.add('anonymized-avatar');
            container.innerHTML = '';
            container.style.width = '120px';
            container.style.height = '120px';
            container.style.border = '2px dashed #999';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.textContent = '?';
            container.style.fontSize = '80px';
            container.style.color = '#999';
            container.style.fontWeight = 'bold';
        });
        const bannerSelectors = [
            '.profile-rank img[src*="i.ibb.co"]',
            '.profile-rank img[src*="i.imgur.com"]'
        ];
        postElement.querySelectorAll(bannerSelectors.join(', ')).forEach(img => {
            img.style.display = 'none';
        });
        // Hide the Scumday indicator
        postElement.querySelectorAll('img.scumday').forEach(img => {
            const parentDd = img.closest('dd');
            if (parentDd) {
                parentDd.style.display = 'none';
            }
        });
    }

    function handleTextFields(postElement, loggedInUsername) {
        postElement.querySelectorAll('a[href*="memberlist.php?mode=viewprofile"]').forEach(el => {
            const currentName = el.textContent.trim();
            if (loggedInUsername && currentName.toLowerCase() === loggedInUsername.toLowerCase()) return;
            if (el.classList.contains('anonymized-quote')) return;
            if (el.classList.contains('anonymized-text')) return;
            el.classList.add('anonymized-text');
            el.textContent = anonymizeText();
            el.style.textShadow = 'none';
            el.style.color = 'inherit';
        });
        postElement.querySelectorAll('.signature').forEach(el => {
            if (el.classList.contains('anonymized-text')) return;
            el.classList.add('anonymized-text');
            if (el.innerHTML.trim() !== '') {
                el.textContent = anonymizeText();
            }
        });
        postElement.querySelectorAll('.profile-posts a, .profile-contact .contact-icon').forEach(el => {
            if (el.classList.contains('anonymized-text')) return;
            el.classList.add('anonymized-text');
            el.textContent = anonymizeText();
        });
        postElement.querySelectorAll('.profile-rank, .profile-joined, .profile-custom-field, .profile-pronoun-only').forEach(field => {
            if (field.classList.contains('anonymized-text')) return;
            field.classList.add('anonymized-text');
            field.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
                    node.nodeValue = anonymizeText();
                }
            });
        });
    }

    // --- UI AND EVENT HANDLING ---
    function displayFinalState(postElement, finalData, isCorrect, currentThreadTitle) {
        const panel = postElement.querySelector('.postprofile');
        if (!panel || panel.querySelector('.final-ui-wrapper')) return;
        panel.style.position = 'relative';
        panel.style.paddingBottom = '60px';
        const finalUiWrapper = document.createElement('div');
        finalUiWrapper.classList.add('final-ui-wrapper');
        finalUiWrapper.style.position = 'absolute';
        finalUiWrapper.style.bottom = '10px';
        finalUiWrapper.style.left = '50%';
        finalUiWrapper.style.transform = 'translateX(-50%)';
        finalUiWrapper.style.width = '100%';
        finalUiWrapper.style.textAlign = 'center';
        const message = document.createElement('div');
        message.textContent = (isCorrect === undefined) ? 'Revealed' : (isCorrect ? 'Correct!' : 'Revealed');
        message.style.color = (isCorrect === undefined) ? 'orange' : (isCorrect ? 'lime' : 'orange');
        message.style.fontWeight = 'bold';
        message.style.fontSize = '16px';
        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.marginTop = '8px';
        const threadData = (currentThreadTitle && finalData.threads[currentThreadTitle]) ? finalData.threads[currentThreadTitle] : { wins: 0, losses: 0 };
        scoreDisplay.innerHTML = `Thread Score: <span style="color: lime; font-weight: bold;">${threadData.wins}</span> - <span style="color: red; font-weight: bold;">${threadData.losses}</span>`;
        finalUiWrapper.appendChild(message);
        finalUiWrapper.appendChild(scoreDisplay);
        panel.appendChild(finalUiWrapper);
    }

    async function displayStatsFooter(currentThreadTitle) {
        const generateStatsAsText = (statsData, title) => {
            if (!statsData || !statsData.userStats || Object.keys(statsData.userStats).length === 0) return 'No stats recorded yet.';
            const stats = statsData.userStats;
            const totalWins = statsData.wins;
            const totalLosses = statsData.losses;
            const totalGuesses = totalWins + totalLosses;
            let text = `--- Guess that scummer ---\nCategory: ${title}\n---------------------------------\n\n`;
            let mostWins = { name: 'N/A', count: 0 };
            let mostLosses = { name: 'N/A', count: 0 };
            for (const username in stats) {
                if (stats[username].wins > mostWins.count) mostWins = { name: username, count: stats[username].wins };
                if (stats[username].losses > mostLosses.count) mostLosses = { name: username, count: stats[username].losses };
            }
            if (mostWins.count > 0) text += `Most Correct Guesses: ${mostWins.name} (${mostWins.count})\n`;
            if (mostLosses.count > 0) text += `Most Failed Guesses: ${mostLosses.name} (${mostLosses.count})\n`;
            text += '\n--- Full Tally ---\n';
            const sortedUsernames = Object.keys(stats).sort((a, b) => {
                const totalA = (stats[a].wins || 0) + (stats[a].losses || 0);
                const totalB = (stats[b].wins || 0) + (stats[b].losses || 0);
                return totalB - totalA;
            });
            sortedUsernames.forEach(username => {
                const userData = stats[username];
                text += `${username}: ${userData.wins} - ${userData.losses}\n`;
            });
            text += `\n---------------------------------\nTotal: ${totalWins} - ${totalLosses} (${totalGuesses} Total Guesses)\n`;
            return text;
        };
        const generateStatsBlockHTML = (statsData, title) => {
            if (!statsData || !statsData.userStats || Object.keys(statsData.userStats).length === 0) return '';
            const stats = statsData.userStats;
            const totalWins = statsData.wins;
            const totalLosses = statsData.losses;
            const totalGuesses = totalWins + totalLosses;
            let statsHTML = `<h3 style="margin: 10px 0; color: white;">${title}</h3>`;
            let mostWins = { name: 'N/A', count: 0 };
            let mostLosses = { name: 'N/A', count: 0 };
            for (const username in stats) {
                if (stats[username].wins > mostWins.count) mostWins = { name: username, count: stats[username].wins };
                if (stats[username].losses > mostLosses.count) mostLosses = { name: username, count: stats[username].losses };
            }
            if (mostWins.count > 0) statsHTML += `<div>Most Correct Guesses: <strong style="color: lime">${mostWins.name}</strong> (${mostWins.count})</div>`;
            if (mostLosses.count > 0) statsHTML += `<div style="margin-top: 5px;">Most Failed Guesses: <strong style="color: red">${mostLosses.name}</strong> (${mostLosses.count})</div>`;
            statsHTML += `<hr style="border-color: #444; margin: 15px 0;">`;
            const sortedUsernames = Object.keys(stats).sort((a, b) => {
                const totalA = (stats[a].wins || 0) + (stats[a].losses || 0);
                const totalB = (stats[b].wins || 0) + (stats[b].losses || 0);
                return totalB - totalA;
            });
            const userListHTML = sortedUsernames.map(username => {
                const userData = stats[username];
                return `<div style="margin-bottom: 4px;">${username}: <strong style="color: lime;">${userData.wins}</strong> - <strong style="color: red;">${userData.losses}</strong></div>`;
            }).join('');
            statsHTML += userListHTML;
            statsHTML += `<hr style="border-color: #444; margin: 15px 0;">`;
            statsHTML += `<div style="font-weight: bold;">Total Guesses: ${totalGuesses} (<span style="color: lime;">${totalWins}</span> - <span style="color: red;">${totalLosses}</span>)</div>`;
            return statsHTML;
        };
        const storedData = await loadData();
        const globalStats = storedData.global;
        const threadStats = storedData.threads[currentThreadTitle];
        let statsContainer = document.getElementById('anonymizer-stats');
        const resetLink = document.getElementById('anonymizer-reset-link');
        if (!resetLink) return;
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.id = 'anonymizer-stats';
            statsContainer.style.color = '#ccc';
            statsContainer.style.textAlign = 'center';
            statsContainer.style.marginTop = '20px';
            statsContainer.style.borderTop = '1px solid #555';
            statsContainer.style.paddingTop = '20px';
            resetLink.insertAdjacentElement('afterend', statsContainer);
        }
        statsContainer.innerHTML = '';
        const buildSection = (statsData, title) => {
            if (!statsData || !statsData.userStats || Object.keys(statsData.userStats).length === 0) return null;
            const sectionWrapper = document.createElement('div');
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy Stats';
            copyButton.style.padding = '4px 8px';
            copyButton.style.marginTop = '15px';
            copyButton.style.border = '1px solid #888';
            copyButton.style.backgroundColor = '#555';
            copyButton.style.color = '#ddd';
            copyButton.style.cursor = 'pointer';
            copyButton.addEventListener('click', () => {
                const textToCopy = generateStatsAsText(statsData, title);
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => { copyButton.textContent = 'Copy Stats'; }, 2000);
                });
            });
            const statsContent = document.createElement('div');
            statsContent.innerHTML = generateStatsBlockHTML(statsData, title);
            sectionWrapper.appendChild(statsContent);
            sectionWrapper.appendChild(copyButton);
            return sectionWrapper;
        };
        const threadSection = buildSection(threadStats, `Thread Stats: "${currentThreadTitle}"`);
        const globalSection = buildSection(globalStats, 'Global Stats');
        if (threadSection) statsContainer.appendChild(threadSection);
        if (threadSection && globalSection) {
            const separator = document.createElement('hr');
            separator.style.borderColor = '#444';
            separator.style.margin = '20px 0';
            separator.style.borderStyle = 'dashed';
            statsContainer.appendChild(separator);
        }
        if (globalSection) statsContainer.appendChild(globalSection);
    }

    function createResetLink() {
        const copyrightDiv = document.querySelector('div.copyright');
        if (copyrightDiv && !document.getElementById('anonymizer-reset-link')) {
            const resetLink = document.createElement('a');
            resetLink.id = 'anonymizer-reset-link';
            resetLink.textContent = 'Reset Guess that scummer Score';
            resetLink.href = '#';
            resetLink.style.color = 'orange';
            resetLink.style.display = 'block';
            resetLink.style.textAlign = 'center';
            resetLink.style.marginTop = '20px';
            resetLink.style.marginBottom = '20px';
            resetLink.addEventListener('click', (event) => {
                event.preventDefault();
                resetScoreData();
            });
            copyrightDiv.insertAdjacentElement('afterend', resetLink);
        }
    }

    async function checkUsernameAndReveal(event, currentThreadTitle) {
        const postId = event.target.dataset.postId;
        const postElement = document.getElementById(postId);
        const inputField = postElement.querySelector(`.reveal-input[data-post-id="${postId}"]`);
        const pageData = originalPostData[postId];
        let storedData = await loadData();
        const userInput = inputField.value.trim();
        const correctUsername = pageData.username;

        if (!correctUsername) return;

        const reveal = async () => {
            const panel = postElement.querySelector('.postprofile');
            const signature = postElement.querySelector('.signature');
            if (panel && pageData.profileHTML) {
                panel.innerHTML = pageData.profileHTML;
                panel.className = pageData.profileClassName;
                panel.title = pageData.profileTitle;
            }
            if (signature && pageData.signatureHTML) signature.innerHTML = pageData.signatureHTML;
            const makeVisible = (el) => el.style.setProperty('visibility', 'visible', 'important');
            if (panel) makeVisible(panel);
            if (signature) makeVisible(signature);
            postElement.querySelectorAll('a[href*="memberlist.php?mode=viewprofile"]').forEach(makeVisible);
            await updateRevealedQuotes();
        };

        const updateUserStats = (isWin) => {
            const globalUserStats = storedData.global.userStats;
            if (!globalUserStats[correctUsername]) globalUserStats[correctUsername] = { wins: 0, losses: 0 };
            if (isWin) {
                storedData.global.wins++;
                globalUserStats[correctUsername].wins++;
            } else {
                storedData.global.losses++;
                globalUserStats[correctUsername].losses++;
            }
            if (currentThreadTitle) {
                if (!storedData.threads[currentThreadTitle]) storedData.threads[currentThreadTitle] = { wins: 0, losses: 0, userStats: {} };
                const threadUserStats = storedData.threads[currentThreadTitle].userStats;
                if (!threadUserStats[correctUsername]) threadUserStats[correctUsername] = { wins: 0, losses: 0 };
                if (isWin) {
                    storedData.threads[currentThreadTitle].wins++;
                    threadUserStats[correctUsername].wins++;
                } else {
                    storedData.threads[currentThreadTitle].losses++;
                    threadUserStats[correctUsername].losses++;
                }
            }
        };

        if (userInput.toLowerCase() === correctUsername.toLowerCase()) {
            updateUserStats(true);
            storedData.revealedPosts[postId] = true;
            await saveData(storedData);
            await reveal();
            displayFinalState(postElement, storedData, true, currentThreadTitle);
            displayStatsFooter(currentThreadTitle);
        } else {
            pageData.guessCount++;
            const counterElement = postElement.querySelector(`.reveal-counter[data-post-id="${postId}"]`);
            if (counterElement) counterElement.textContent = pageData.guessCount;
            if (counterElement) counterElement.style.visibility = 'visible';
            if (pageData.guessCount >= 2) {
                updateUserStats(false);
                storedData.revealedPosts[postId] = true;
                await saveData(storedData);
                await reveal();
                displayFinalState(postElement, storedData, false, currentThreadTitle);
                displayStatsFooter(currentThreadTitle);
            } else {
                inputField.style.borderColor = 'red';
                setTimeout(() => {
                    inputField.style.borderColor = '#888';
                }, 1000);
            }
        }
    }

    async function processPage() {
        const storedData = await loadData();
        const loggedInUserElement = document.querySelector('.header-profile .username');
        const loggedInUsername = loggedInUserElement ? loggedInUserElement.textContent.trim().toLowerCase() : null;
        const threadTitleElement = document.querySelector('h2.topic-title a');
        const currentThreadTitle = threadTitleElement ? threadTitleElement.textContent.trim() : "Default Thread";
        tagAllQuotes();

        document.querySelectorAll('.post').forEach(postElement => {
            const panel = postElement.querySelector('dl.postprofile');
            if (!postElement.id || !panel) return;
            const postId = postElement.id;
            const authorUsernameElement = panel.querySelector('.username, .username-coloured');
            const authorUsername = authorUsernameElement ? authorUsernameElement.textContent.trim() : null;
            const makeVisible = () => {
                 const sig = postElement.querySelector('.signature');
                 panel.style.setProperty('visibility', 'visible', 'important');
                 if (sig) sig.style.setProperty('visibility', 'visible', 'important');
                 postElement.querySelectorAll('a[href*="memberlist.php?mode=viewprofile"]').forEach(link => {
                     link.style.setProperty('visibility', 'visible', 'important');
                 });
            };

            if (loggedInUsername && authorUsername && loggedInUsername === authorUsername.toLowerCase()) {
                makeVisible();
                return;
            }

            if (storedData.revealedPosts[postId]) {
                displayFinalState(postElement, storedData, undefined, currentThreadTitle);
                makeVisible();
            } else {
                const signatureElement = postElement.querySelector('.signature');
                const contentElement = postElement.querySelector('.content');
                originalPostData[postId] = {
                    profileHTML: panel.innerHTML,
                    profileClassName: panel.className,
                    profileTitle: panel.title,
                    signatureHTML: signatureElement ? signatureElement.innerHTML : null,
                    contentHTML: contentElement ? contentElement.innerHTML : null,
                    username: authorUsername || '',
                    guessCount: 0
                };
                panel.classList.remove('vla');
                panel.title = '';
                handleVisualElements(postElement);
                handleTextFields(postElement, loggedInUsername);
                const inputWrapper = document.createElement('div');
                inputWrapper.style.width = '120px';
                inputWrapper.style.margin = '15px 0 0 0';
                const counterElement = document.createElement('div');
                counterElement.dataset.postId = postId;
                counterElement.classList.add('reveal-counter');
                counterElement.style.color = 'red';
                counterElement.style.fontSize = '16px';
                counterElement.style.fontWeight = 'bold';
                counterElement.style.textAlign = 'center';
                counterElement.style.height = '20px';
                counterElement.style.visibility = 'hidden';
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.placeholder = 'Enter username...';
                inputField.dataset.postId = postId;
                inputField.classList.add('reveal-input');
                inputField.style.display = 'block';
                inputField.style.width = '100%';
                inputField.style.margin = '5px 0';
                inputField.style.padding = '5px';
                inputField.style.border = '1px solid #888';
                inputField.style.backgroundColor = 'white';
                inputField.style.color = 'black';
                inputField.style.boxSizing = 'border-box';
                const submitButton = document.createElement('button');
                submitButton.textContent = 'Submit';
                submitButton.dataset.postId = postId;
                submitButton.style.display = 'block';
                submitButton.style.width = '100%';
                submitButton.style.padding = '5px';
                submitButton.style.border = '1px solid #888';
                submitButton.style.backgroundColor = '#555';
                submitButton.style.color = '#ddd';
                submitButton.style.cursor = 'pointer';
                inputField.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        submitButton.click();
                    }
                });
                inputWrapper.appendChild(counterElement);
                inputWrapper.appendChild(inputField);
                inputWrapper.appendChild(submitButton);
                panel.appendChild(inputWrapper);
                submitButton.addEventListener('click', (event) => checkUsernameAndReveal(event, currentThreadTitle));
                makeVisible();
            }
        });
        updateRevealedQuotes();
        createResetLink();
        displayStatsFooter(currentThreadTitle);
    }

    const tryToRun = setInterval(() => {
        const posts = document.querySelectorAll('.post');
        const copyright = document.querySelector('div.copyright');
        if (posts.length > 0 && copyright) {
            clearInterval(tryToRun);
            processPage();
        }
    }, 200);
});