// ==UserScript==
// @name         IMVU Badge Granting Automation (Username or CID)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automate badge granting on IMVU avatars page with manual username or CID input
// @author       heapsofjoy
// @match        https://avatars.imvu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525721/IMVU%20Badge%20Granting%20Automation%20%28Username%20or%20CID%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525721/IMVU%20Badge%20Granting%20Automation%20%28Username%20or%20CID%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cancelGranting = false;
    let useCid = false; // toggle between username and CID

    // Fetch CID for the entered username
    const getCid = (name) => {
        return fetch(`https://api.imvu.com/user?username=${name}`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                return Object.entries(data.denormalized)[0][1].data.legacy_cid;
            })
            .catch(err => {
                console.error("Error fetching CID:", err);
            });
    };

    // Start granting badges
    const startGrantingBadges = async (inputValue, outputBox, titleElement) => {
        let cid;
        if (useCid) {
            cid = inputValue; // use directly as CID
        } else {
            cid = await getCid(inputValue); // resolve username → CID
        }

        if (!cid) {
            showProgress(outputBox, 'Error: Unable to get CID for the input.');
            return;
        }

        cancelGranting = false;
        titleElement.innerText = `Granting badges for ${inputValue} (${useCid ? "CID" : "Username"})...`;

        const func = async (i) => {
            if (cancelGranting) return;

            const response = await fetch('https://avatars.imvu.com/api/service/grant_badge.php', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                referrer: `https://avatars.imvu.com/${inputValue}`,
                body: `sauce=${IMVU.sauce}&badgeid=badge-${cid}-${i}`,
                method: 'POST',
                mode: 'cors',
            });

            if (response.ok) {
                showProgress(outputBox, `Granted badge #${i}`);
            } else {
                showProgress(outputBox, `Failed to grant badge #${i}. Trying next.`);
            }
        };

        const recursive = async (i) => {
            if (cancelGranting) return;
            setTimeout(async () => {
                await func(i);
                recursive(i + 1);
            }, 2500);
        };

        recursive(1);
    };

    const showProgress = (outputBox, message) => {
        outputBox.textContent += `\n${message}`;
        outputBox.scrollTop = outputBox.scrollHeight;
    };

    const createPopoutButton = () => {
        const button = document.createElement('button');
        button.innerText = '▶';
        Object.assign(button.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '40px', height: '40px',
            borderRadius: '50%', backgroundColor: '#4CAF50', color: 'white', border: 'none',
            fontSize: '20px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        });

        button.addEventListener('click', () => {
            const popoutBox = document.getElementById('badge-granting-box');
            popoutBox.style.display = (popoutBox.style.display === 'none' || !popoutBox.style.display) ? 'block' : 'none';
        });

        document.body.appendChild(button);
    };

    const createInterfaceBox = () => {
        const box = document.createElement('div');
        box.id = 'badge-granting-box';
        Object.assign(box.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '340px', height: '440px',
            backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', padding: '15px', display: 'none'
        });

        const titleElement = document.createElement('h3');
        titleElement.innerText = 'Enter Username or CID';
        Object.assign(titleElement.style, { textAlign: 'center', marginBottom: '10px' });
        box.appendChild(titleElement);

        // Input + buttons container
        const inputContainer = document.createElement('div');
        Object.assign(inputContainer.style, { display: 'flex', marginBottom: '10px' });

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.placeholder = 'Enter IMVU username or CID';
        Object.assign(userInput.style, {
            flex: '1',
            padding: '6px 10px',
            fontSize: '14px',
            lineHeight: '18px',
            height: '32px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
            outline: 'none'
        });
        inputContainer.appendChild(userInput);

        // Fill from URL button
        const fillButton = document.createElement('button');
        fillButton.innerText = 'URL';
        Object.assign(fillButton.style, {
            marginLeft: '5px',
            padding: '0 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#eee',
            fontSize: '12px'
        });
        fillButton.addEventListener('click', () => {
            const match = window.location.pathname.match(/^\/([^\/]+)/);
            if (match) {
                userInput.value = match[1];
            }
        });
        inputContainer.appendChild(fillButton);

        // Mode toggle button
        const modeButton = document.createElement('button');
        modeButton.innerText = 'Username';
        Object.assign(modeButton.style, {
            marginLeft: '5px',
            padding: '0 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#eee',
            fontSize: '12px'
        });
        modeButton.addEventListener('click', () => {
            useCid = !useCid;
            modeButton.innerText = useCid ? 'CID' : 'Username';
        });
        inputContainer.appendChild(modeButton);

        box.appendChild(inputContainer);

        const outputBox = document.createElement('div');
        Object.assign(outputBox.style, {
            height: '250px', overflowY: 'auto', backgroundColor: '#f8f8f8',
            border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px',
            padding: '10px', whiteSpace: 'pre-wrap'
        });
        box.appendChild(outputBox);

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', justifyContent: 'space-between', marginTop: '10px' });

        const runButton = document.createElement('button');
        runButton.innerText = 'Start';
        Object.assign(runButton.style, {
            flex: '1', padding: '10px', backgroundColor: '#4CAF50', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '5px'
        });
        runButton.addEventListener('click', () => {
            const value = userInput.value.trim();
            if (!value) {
                showProgress(outputBox, 'Please enter a username or CID first.');
                return;
            }
            outputBox.textContent = ''; // Reset output
            showProgress(outputBox, `Starting badge granting for ${value} (${useCid ? "CID" : "Username"})...`);
            startGrantingBadges(value, outputBox, titleElement);
        });

        const stopButton = document.createElement('button');
        stopButton.innerText = 'Stop';
        Object.assign(stopButton.style, {
            flex: '1', padding: '10px', backgroundColor: '#f44336', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '5px'
        });
        stopButton.addEventListener('click', () => {
            cancelGranting = true;
            showProgress(outputBox, 'Process stopped. You can enter a new username or CID.');
            titleElement.innerText = 'Stopped';
        });

        buttonContainer.appendChild(runButton);
        buttonContainer.appendChild(stopButton);
        box.appendChild(buttonContainer);

        document.body.appendChild(box);
    };

    createPopoutButton();
    createInterfaceBox();
})();