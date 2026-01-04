// ==UserScript==
// @name         Duolingo Account Manager
// @namespace    http://tampermonkey.net/
// @version      1.2.1.1 https://discord.gg/NYxtshxq68
// @description  Access Duolingo accounts using tokens with improved GUI and one of the best management script ever.
// @author       Cube Cloud https://discord.gg/NYxtshxq68
// @match        *://*.duolingo.com/*
// @grant        none
// @license      MIT
// @icon https://raw.githubusercontent.com/bingcube/source/refs/heads/main/image-removebg-preview%20(25).png
// @downloadURL https://update.greasyfork.org/scripts/506527/Duolingo%20Account%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/506527/Duolingo%20Account%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'MyCloud-SF-Pro-Rounded-Semibold';
            src: url('https://ourcloud2.vercel.app/fonts/MyCloud-SF-Pro-Rounded-Semibold.ttf') format('truetype');
        }
        body, div, span, input, button, textarea {
            font-family: 'MyCloud-SF-Pro-Rounded-Semibold', Arial, sans-serif;
        }
    `;
    document.head.appendChild(style);

    function getTokenFromCookie() {
        const cookie = document.cookie
            .split('; ')
            .find(cookie => cookie.startsWith('jwt_token='));
        return cookie ? cookie.split('=')[1] : '';
    }

    function setTokenToCookie(token) {
        document.cookie = `jwt_token=${token}; path=/`;
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.background = '#fff'; 
    container.style.padding = '15px';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '12px';
    container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    container.style.zIndex = '9999';
    container.style.width = '350px';
    container.style.height = '570px';
    container.style.maxWidth = '90%';
    document.body.appendChild(container);





    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.justifyContent = 'space-between';
    container.appendChild(headerContainer);


    const title = document.createElement('h2');
    title.textContent = 'DuoAgent';
    title.style.margin = '0';
    title.style.fontSize = '20px';
    title.style.color = '#333';
    headerContainer.appendChild(title);


    const versionLabel = document.createElement('div');
    versionLabel.textContent = '1.0 Alpha 2';
    versionLabel.style.backgroundColor = '#dc3545';
    versionLabel.style.marginTop = '-10px';
    versionLabel.style.color = '#fff';
    versionLabel.style.padding = '5px 10px';
    versionLabel.style.borderRadius = '5px';
    versionLabel.style.fontSize = '12px';
    headerContainer.appendChild(versionLabel);


    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';
    headerContainer.appendChild(buttonContainer);


    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.style.marginRight = '10px';
    nextBtn.style.marginTop = '-10px';
    nextBtn.style.padding = '10px 15px';
    nextBtn.style.backgroundColor = '#28a745';
    nextBtn.style.color = '#fff';
    nextBtn.style.border = 'none';
    nextBtn.style.borderRadius = '15px';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.fontSize = '14px';
    nextBtn.style.transition = 'background-color 0.3s, transform 0.3s';
    nextBtn.onmouseover = () => {
        nextBtn.style.backgroundColor = '#218838';
        nextBtn.style.transform = 'scale(1.05)';
    };
    nextBtn.onmouseout = () => {
        nextBtn.style.backgroundColor = '#28a745';
        nextBtn.style.transform = 'scale(1)';
    };
    buttonContainer.appendChild(nextBtn);


    const hideShowBtn = document.createElement('button');
    hideShowBtn.textContent = 'Hide';
    hideShowBtn.style.padding = '10px 15px';
    hideShowBtn.style.marginTop = '-10px';
    hideShowBtn.style.backgroundColor = '#007bff';
    hideShowBtn.style.color = '#fff';
    hideShowBtn.style.border = 'none';
    hideShowBtn.style.borderRadius = '15px';
    hideShowBtn.style.cursor = 'pointer';
    hideShowBtn.style.fontSize = '14px';
    hideShowBtn.style.transition = 'background-color 0.3s, transform 0.3s';
    hideShowBtn.onmouseover = () => {
        hideShowBtn.style.backgroundColor = '#0056b3';
        hideShowBtn.style.transform = 'scale(1.05)';
    };
    hideShowBtn.onmouseout = () => {
        hideShowBtn.style.backgroundColor = '#007bff';
        hideShowBtn.style.transform = 'scale(1)';
    };
    buttonContainer.appendChild(hideShowBtn);

    let isHidden = false;
    hideShowBtn.addEventListener('click', () => {
        if (isHidden) {
            container.style.height = 'auto';
            container.style.overflow = 'visible';
            hideShowBtn.textContent = 'Hide';
        } else {
            container.style.height = '50px';
            container.style.overflow = 'hidden';
            hideShowBtn.textContent = 'Show';
        }
        isHidden = !isHidden;
    });


    const activeTokenDisplay = document.createElement('div');
    activeTokenDisplay.style.margin = '10px 0';
    activeTokenDisplay.style.padding = '10px';
    activeTokenDisplay.style.border = '1px solid #ddd';
    activeTokenDisplay.style.borderRadius = '8px';
    activeTokenDisplay.style.backgroundColor = '#f8f9fa';
    activeTokenDisplay.style.fontSize = '14px';
    activeTokenDisplay.style.color = '#333';
    activeTokenDisplay.style.textAlign = 'center';
    activeTokenDisplay.style.wordWrap = 'break-word';
    activeTokenDisplay.style.overflow = 'hidden';
    activeTokenDisplay.style.textOverflow = 'ellipsis';
    activeTokenDisplay.textContent = getTokenFromCookie() || 'No active token';
    container.appendChild(activeTokenDisplay);



    const desc = document.createElement('p');
    desc.textContent = 'Enter a token and click "Add Token". Click on a token slot to use it.';
    desc.style.margin = '10px 0 20px';
    desc.style.fontSize = '14px';
    desc.style.color = '#555';
    desc.style.textAlign = 'center';
    container.appendChild(desc);


    const tokenInputContainer = document.createElement('div');
    tokenInputContainer.style.display = 'flex';
    tokenInputContainer.style.flexDirection = 'column';
    tokenInputContainer.style.alignItems = 'center';
    tokenInputContainer.style.marginBottom = '20px';
    container.appendChild(tokenInputContainer);


    const tokenInput = document.createElement('input');
    tokenInput.placeholder = 'Enter token...';
    tokenInput.style.width = '100%';
    tokenInput.style.padding = '12px';
    tokenInput.style.border = '1px solid #ddd';
    tokenInput.style.borderRadius = '8px';
    tokenInput.style.marginBottom = '10px';
    tokenInputContainer.appendChild(tokenInput);


    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.width = '100%';
    tokenInputContainer.appendChild(buttonsContainer);


    const addTokenBtn = document.createElement('button');
    addTokenBtn.textContent = 'Add Token';
    addTokenBtn.style.flex = '1';
    addTokenBtn.style.marginRight = '10px';
    addTokenBtn.style.padding = '12px 24px';
    addTokenBtn.style.backgroundColor = '#007bff';
    addTokenBtn.style.color = '#fff';
    addTokenBtn.style.border = 'none';
    addTokenBtn.style.borderRadius = '8px';
    addTokenBtn.style.cursor = 'pointer';
    addTokenBtn.style.transition = 'background-color 0.3s, transform 0.3s';
    addTokenBtn.onmouseover = () => {
        addTokenBtn.style.backgroundColor = '#0056b3';
        addTokenBtn.style.transform = 'scale(1.05)';
    };
    addTokenBtn.onmouseout = () => {
        addTokenBtn.style.backgroundColor = '#007bff';
        addTokenBtn.style.transform = 'scale(1)';
    };
    buttonsContainer.appendChild(addTokenBtn);


    const clearTokensBtn = document.createElement('button');
    clearTokensBtn.textContent = 'Clear Tokens';
    clearTokensBtn.style.flex = '1';
    clearTokensBtn.style.marginLeft = '10px';
    clearTokensBtn.style.padding = '12px 24px';
    clearTokensBtn.style.backgroundColor = '#dc3545';
    clearTokensBtn.style.color = '#fff';
    clearTokensBtn.style.border = 'none';
    clearTokensBtn.style.borderRadius = '8px';
    clearTokensBtn.style.cursor = 'pointer';
    clearTokensBtn.style.transition = 'background-color 0.3s, transform 0.3s';
    clearTokensBtn.onmouseover = () => {
        clearTokensBtn.style.backgroundColor = '#c82333';
        clearTokensBtn.style.transform = 'scale(1.05)';
    };
    clearTokensBtn.onmouseout = () => {
        clearTokensBtn.style.backgroundColor = '#dc3545';
        clearTokensBtn.style.transform = 'scale(1)';
    };
    buttonsContainer.appendChild(clearTokensBtn);


    const tokenList = document.createElement('div');
    tokenList.style.display = 'flex';
    tokenList.style.flexWrap = 'wrap';
    tokenList.style.gap = '15px';
    container.appendChild(tokenList);


    const createTokenSlot = (id) => {
        const slot = document.createElement('div');
        slot.id = id;
        slot.textContent = id;
        slot.style.width = '120px';
        slot.style.height = '120px';
        slot.style.backgroundColor = '#28a745';
        slot.style.color = '#fff';
        slot.style.display = 'flex';
        slot.style.flexDirection = 'column';
        slot.style.justifyContent = 'center';
        slot.style.alignItems = 'center';
        slot.style.borderRadius = '12px';
        slot.style.cursor = 'pointer';
        slot.style.fontSize = '12px';
        slot.style.textAlign = 'center';
        slot.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
        slot.onmouseover = () => slot.style.backgroundColor = '#218838';
        slot.onmouseout = () => slot.style.backgroundColor = '#28a745';
        tokenList.appendChild(slot);
        return slot;
    };


    const tokenSlots = [createTokenSlot('Slot 1'), createTokenSlot('Slot 2'), createTokenSlot('Slot 3')];


    addTokenBtn.addEventListener('click', () => {
        const token = tokenInput.value.trim();
        if (token) {
            addToken(token);
            tokenInput.value = '';
        } else {
            alert('Please enter a valid token.');
        }
    });


    clearTokensBtn.addEventListener('click', () => {
        displayClearTokenTable();
    });


    tokenSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const token = slot.getAttribute('data-token');
            if (token) {
                setTokenToCookie(token);
                activeTokenDisplay.textContent = `Active Token: ${token}`;
                setTimeout(() => {
                    window.location.reload(); 
                }, 1000);
            }
        });
    });


    function addToken(token) {
        for (const slot of tokenSlots) {
            if (!slot.getAttribute('data-token')) {
                slot.setAttribute('data-token', token);
                slot.innerHTML = `<strong>Token</strong><br>${token.slice(0, 10)}...`; 
                break;
            }
        }
    }


    function displayClearTokenTable() {
        const tableContainer = document.createElement('div');
        tableContainer.style.position = 'fixed';
        tableContainer.style.top = '50%';
        tableContainer.style.left = '50%';
        tableContainer.style.transform = 'translate(-50%, -50%)';
        tableContainer.style.backgroundColor = '#fff';
        tableContainer.style.padding = '20px';
        tableContainer.style.border = '1px solid #ddd';
        tableContainer.style.borderRadius = '12px';
        tableContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        tableContainer.style.zIndex = '10000';
        tableContainer.style.width = '300px';
        tableContainer.style.maxWidth = '90%';
        tableContainer.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(tableContainer);

        const tableTitle = document.createElement('h3');
        tableTitle.textContent = 'Select Tokens to Delete';
        tableTitle.style.margin = '0 0 20px';
        tableTitle.style.fontSize = '18px';
        tableTitle.style.color = '#333';
        tableTitle.style.textAlign = 'center';
        tableContainer.appendChild(tableTitle);

        const form = document.createElement('form');
        tableContainer.appendChild(form);

        tokenSlots.forEach((slot, index) => {
            const token = slot.getAttribute('data-token');
            if (token) {
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.marginBottom = '10px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'tokens';
                checkbox.value = index;
                checkbox.style.marginRight = '10px';

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(`Slot ${index + 1}: ${token.slice(0, 10)}...`));
                form.appendChild(label);
            }
        });

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-between';
        buttonsContainer.style.marginTop = '20px';
        form.appendChild(buttonsContainer);

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.flex = '1';
        confirmBtn.style.marginRight = '10px';
        confirmBtn.style.padding = '10px 20px';
        confirmBtn.style.backgroundColor = '#007bff';
        confirmBtn.style.color = '#fff';
        confirmBtn.style.border = 'none';
        confirmBtn.style.borderRadius = '8px';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.style.transition = 'background-color 0.3s, transform 0.3s';
        confirmBtn.style.borderRadius = '15px';
        confirmBtn.onmouseover = () => {
            confirmBtn.style.backgroundColor = '#0056b3';
            confirmBtn.style.transform = 'scale(1.05)';
        };
        confirmBtn.onmouseout = () => {
            confirmBtn.style.backgroundColor = '#007bff';
            confirmBtn.style.transform = 'scale(1)';
        };
        buttonsContainer.appendChild(confirmBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.flex = '1';
        cancelBtn.style.marginLeft = '10px';
        cancelBtn.style.padding = '10px 20px';
        cancelBtn.style.backgroundColor = '#dc3545';
        cancelBtn.style.color = '#fff';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '15px';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.style.transition = 'background-color 0.3s, transform 0.3s';
        cancelBtn.onmouseover = () => {
            cancelBtn.style.backgroundColor = '#c82333';
            cancelBtn.style.transform = 'scale(1.05)';
        };
        cancelBtn.onmouseout = () => {
            cancelBtn.style.backgroundColor = '#dc3545';
            cancelBtn.style.transform = 'scale(1)';
        };
        buttonsContainer.appendChild(cancelBtn);

        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedTokens = Array.from(form.tokens).filter(input => input.checked).map(input => parseInt(input.value));
            selectedTokens.forEach(index => {
                const slot = tokenSlots[index];
                slot.removeAttribute('data-token');
                slot.textContent = slot.id;
            });
            activeTokenDisplay.textContent = getTokenFromCookie() || 'No active token'; 
            document.body.removeChild(tableContainer);
        });

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.removeChild(tableContainer);
        });
    }


    function showNextSection() {
        const nextSection = document.createElement('div');
        nextSection.style.position = 'fixed';
        nextSection.style.top = '20px';
        nextSection.style.right = '20px';
        nextSection.style.backgroundColor = '#fff';
        nextSection.style.padding = '15px';
        nextSection.style.border = '1px solid #ddd';
        nextSection.style.borderRadius = '12px';
        nextSection.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        nextSection.style.zIndex = '9999';
        nextSection.style.width ='350px';
        nextSection.style.height = '570px';
        nextSection.style.maxWidth = '90%';
        nextSection.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(nextSection);


        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back';
        backBtn.style.padding = '10px 15px';
        backBtn.style.backgroundColor = '#dc3545';
        backBtn.style.color = '#fff';
        backBtn.style.border = 'none';
        backBtn.style.borderRadius = '15px';
        backBtn.style.cursor = 'pointer';
        backBtn.style.fontSize = '14px';
        backBtn.style.transition = 'background-color 0.3s, transform 0.3s';
        backBtn.onmouseover = () => {
            backBtn.style.backgroundColor = '#c82333';
            backBtn.style.transform = 'scale(1.05)';
        };
        backBtn.onmouseout = () => {
            backBtn.style.backgroundColor = '#dc3545';
            backBtn.style.transform = 'scale(1)';
        };
        nextSection.appendChild(backBtn);

        backBtn.addEventListener('click', () => {
            document.body.removeChild(nextSection);
        });


const connectStatus = document.createElement('div');
connectStatus.style.width = '100%';
connectStatus.style.padding = '10px';
connectStatus.style.borderRadius = '15px';
connectStatus.style.textAlign = 'center';
connectStatus.style.marginTop = '10px';
connectStatus.style.fontFamily = 'Arial, sans-serif';
connectStatus.style.display = 'flex'; 
connectStatus.style.alignItems = 'center'; 
connectStatus.style.justifyContent = 'center'; 
connectStatus.style.backgroundColor = '#dc3545'; 
connectStatus.style.color = '#fff'; 


const icon = document.createElement('img');
icon.src = 'https://cdn.discordapp.com/attachments/1267100749679169538/1268055033044402288/Anh_chup_man_hinh_2024-07-25_181612.png?ex=66ab07c7&is=66a9b647&hm=38c654acc72acff7a3756a6f0cb0befc70a0f47e80409fcef715d1b1255a8709&';
icon.style.width = '20px'; 
icon.style.height = '20px'; 
icon.style.marginRight = '10px'; 


if (window.location.origin === 'https://www.duolingo.com' && !document.cookie.includes('auth_token')) {
    connectStatus.style.backgroundColor = '#34c759'; 
    connectStatus.textContent = 'Connected';
    connectStatus.insertBefore(icon, connectStatus.firstChild); 
} else {
    connectStatus.textContent = 'Error';
}

nextSection.appendChild(connectStatus);
nextSection.appendChild(disBtn);
nextSection.appendChild(gitBtn);
nextSection.appendChild(donBtn);
nextSection.appendChild(sectionTitle);
nextSection.appendChild(setBtn);
nextSection.appendChild(firstDesc);
nextSection.appendChild(secondDesc);
nextSection.appendChild(thirdDesc);
    }


const disBtn = document.createElement('button');
disBtn.style.padding = '10px 40px';
disBtn.style.marginRight = '10px';
disBtn.style.marginTop = '10px';
disBtn.style.backgroundColor = '#5665ec'; 
disBtn.style.color = '#fff';
disBtn.style.border = 'none';
disBtn.style.borderRadius = '15px';
disBtn.style.cursor = 'pointer';
disBtn.style.width = '150px';
disBtn.style.fontSize = '16px';
disBtn.style.transition = 'background-color 0.3s, transform 0.3s';
disBtn.onmouseover = () => {
    disBtn.style.backgroundColor = '#4a54d1'; 
    disBtn.style.transform = 'scale(1.05)';
};
disBtn.onmouseout = () => {
    disBtn.style.backgroundColor = '#5665ec'; 
    disBtn.style.transform = 'scale(1)';
};



disBtn.appendChild(document.createTextNode('Discord'));

disBtn.addEventListener('click', () => {
    alert('Discord Button clicked');
});



const donBtn = document.createElement('button');
donBtn.textContent = 'Donate';
donBtn.style.padding = '10px 55px';
donBtn.style.marginRight = '-10px';
donBtn.style.marginTop = '10px';
donBtn.style.backgroundImage = 'url(https://raw.githubusercontent.com/baolong7651/DuoAG/main/asset/purple-gradient-background-5472-x-3648-i2xtxsy5ijm2ik4e.jpg?token=GHSAT0AAAAAACVKNSNLHKZIDKXRVF3GOY22ZVUT67Q)';
donBtn.style.backgroundSize = 'cover'; 
donBtn.style.backgroundPosition = 'center'; 
donBtn.style.backgroundColor = 'transparent'; 
donBtn.style.color = '#fff';
donBtn.style.border = 'none';
donBtn.style.borderRadius = '8px';
donBtn.style.cursor = 'pointer';
donBtn.style.fontSize = '16px';
donBtn.style.transition = 'background-color 0.3s, transform 0.3s';
donBtn.onmouseover = () => {
    donBtn.style.transform = 'scale(1.05)';
};
donBtn.onmouseout = () => {
    donBtn.style.transform = 'scale(1)';
};

donBtn.addEventListener('click', () => {
    alert('Donate Button clicked buck');
});

const gitBtn = document.createElement('button');
gitBtn.textContent = 'Github';
gitBtn.style.padding = '10px 40px';
gitBtn.style.marginRight = '-10px';
gitBtn.style.marginTop = '-20px'
gitBtn.style.backgroundColor = '#050505';
gitBtn.style.color = '#fff'
gitBtn.style.border = 'none';
gitBtn.style.borderRadius = '15px';
gitBtn.style.cursor = 'pointer';
gitBtn.style.fontSize = '16px';
gitBtn.style.width = '150px';
gitBtn.style.transition = 'background-color 0.3s, transform 0.3s';
gitBtn.onmouseover = () => {
    gitBtn.style.transform = 'scale(1.05)';
};
gitBtn.onmouseout = () => {
    gitBtn.style.transform = 'scale(1)';
};
gitBtn.addEventListener('click', () => {
    alert('Github Button clicked');
});


const setBtn = document.createElement('button');
setBtn.textContent = 'Setting';
setBtn.style.padding = '10px 40px';
setBtn.style.marginLeft = '170px';
setBtn.style.marginTop = '106px';
setBtn.style.backgroundColor = '#808080';
setBtn.style.color = '#fff'
setBtn.style.border = 'none';
setBtn.style.borderRadius = '15px';
setBtn.style.width = '150px';
setBtn.style.cursor = 'pointer';
setBtn.style.fontSize = '16px';
setBtn.style.transition = 'background-color 0.3s, transform 0.3s';
setBtn.onmouseover = () => {
    setBtn.style.transform = 'scale(1.05)';
};
setBtn.onmouseout = () => {
    setBtn.style.transform = 'scale(1)';
};

setBtn.addEventListener('click', () => {
    alert('Setting Button clicked');
});

        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'More Features';
        sectionTitle.style.margin = '0 0 10px';
        sectionTitle.style.marginRight = '-10px';
        sectionTitle.style.marginTop = '-175px'
        sectionTitle.style.fontSize = '20px';
        sectionTitle.style.color = '#333';
        sectionTitle.style.textAlign = 'center';

const firstDesc = document.createElement('p');
        firstDesc.textContent = 'MIT License Copyright (c) 2024 Interstellar, NowaysZ'
        firstDesc.style.margin = '0';
        firstDesc.style.marginTop = '20px'
        firstDesc.style.fontSize = '14px';
        firstDesc.style.color = '#080808';
        firstDesc.style.textAlign = 'center';
        firstDesc.style.fontFamily = 'Arial, San-Serif';

    const secondDesc = document.createElement('p');
        secondDesc.textContent = 'Permission is granted to use, copy, modify, and distribute the Software, subject to the following conditions:';
        secondDesc.style.margin = 'px';
        secondDesc.style.marginTop = '25px'
        secondDesc.style.fontSize = '14px';
        secondDesc.style.color = '#080808';
        secondDesc.style.textAlign = 'center';
        secondDesc.style.fontFamily = 'Arial, San-Serif';

      const thirdDesc = document.createElement('p');
        thirdDesc.textContent = 'No Copying or Modification: You may not copy, modify, or transform the graphical user interface (GUI) of the Software. No Illegal Use: The Software must not be used for illegal activities or unethical purposes, including unauthorized access or theft. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY';
        thirdDesc.style.margin = '0';
        thirdDesc.style.marginTop = '30px'
        thirdDesc.style.fontSize = '14px';
        thirdDesc.style.color = '#080808';
        thirdDesc.style.textAlign = 'center';
        thirdDesc.style.fontFamily = 'Arial, San-Serif';


    nextBtn.addEventListener('click', () => {
        showNextSection();
    });


    activeTokenDisplay.textContent = getTokenFromCookie() || 'No active token'



})();