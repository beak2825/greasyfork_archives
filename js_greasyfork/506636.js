// ==UserScript==
// @name         DuoAgent
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Access Duolingo accounts using tokens with improved GUI and features
// @author       NowaysZ and Interstellar
// @match        https://www.duolingo.com/learn
// @icon         https://cdn.discordapp.com/attachments/1268766304677007434/1275415373453463583/download.gif?ex=66c5cea1&is=66c47d21&hm=8cecf7cdf5ec172341da396a52b28d4b006a9e31bd8d652b3fca37a7fa5b37a4&
// @grant        none
// @license MIT2
// @downloadURL https://update.greasyfork.org/scripts/506636/DuoAgent.user.js
// @updateURL https://update.greasyfork.org/scripts/506636/DuoAgent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get token from cookie
    function getTokenFromCookie() {
        const cookie = document.cookie
            .split('; ')
            .find(cookie => cookie.startsWith('jwt_token='));
        return cookie ? cookie.split('=')[1] : '';
    }

    // Function to set token to cookie
    function setTokenToCookie(token) {
        document.cookie = `jwt_token=${token}; path=/`;
    }
// Các license key hợp lệ
    const validKeys = ['nowaysZGUImaker', 'interstellarAdmin', 'InterBot'];

    // Hiển thị giao diện nhập license key
    function showLicensePrompt() {
        const licenseKey = prompt("Please enter the license key to continue:");
        if (validKeys.includes(licenseKey)) {
            alert("License key valid! Now, you can use our tool.");
            // Thực hiện các hành động tiếp theo tại đây nếu license key hợp lệ
        } else {
            alert("License key invalid. Please try again.");
            // Thực hiện các hành động khác hoặc reload trang
            location.reload();
        }
    }

    // Kiểm tra nếu người dùng đã nhập license key hợp lệ trước đó
    const userKey = localStorage.getItem('userLicenseKey');
    if (!validKeys.includes(userKey)) {
        showLicensePrompt();
    } else {
        alert("License key đã được xác nhận trước đó.");
        // Thực hiện các hành động khác tại đây
        location.reload();
    }
// Kiểm tra trạng thái dark mode
function isDarkModeEnabled() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Tạo UI container
const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '50px';
container.style.right = '20px';

// Đặt background dựa trên trạng thái dark mode
if (isDarkModeEnabled()) {
    container.style.background = 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))'; // Gradient cho dark mode
} else {
    container.style.background = 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.3))'; // Gradient cho light mode
}

container.style.backdropFilter = 'blur(40px)'; // Tăng hiệu ứng làm mờ
container.style.padding = '15px';
container.style.border = '1px solid #9c9c9c';
container.style.borderRadius = '12px';
container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
container.style.zIndex = '9999';
container.style.width = '350px';
container.style.height = '670px';
container.style.maxWidth = '90%';
container.style.fontFamily = 'Arial, sans-serif';
document.body.appendChild(container);

// ?????
const macosTitleBar = document.createElement('div')
    macosTitleBar.style.height = '45px';
    macosTitleBar.style.marginTop = '-15px';
    macosTitleBar.style.marginLeft = '-15px';
    macosTitleBar.style.background = '#ececec';
    macosTitleBar.style.borderTopLeftRadius = '7px';
    macosTitleBar.style.borderTopRightRadius = '7px';
    macosTitleBar.style.display = 'flex';
    macosTitleBar.style.alignItems = 'center';
    macosTitleBar.style.width = '348px';
    container.appendChild(macosTitleBar);

    // Header container
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.justifyContent = 'space-between';
    container.appendChild(headerContainer);

    // Title
    const title = document.createElement('h2');
    title.textContent = 'DuoAgent';
    title.style.marginTop = '10px';
    title.style.fontSize = '20px';
    title.style.color = '#333';
    headerContainer.appendChild(title);

    // Version label
    const versionLabel = document.createElement('div');
    versionLabel.textContent = '1.0 Alpha 2';
    versionLabel.style.backgroundColor = '#dc3545';
    versionLabel.style.marginTop = '-13px';
    versionLabel.style.marginRight = '80px'
    versionLabel.style.color = '#fff';
    versionLabel.style.padding = '5px 10px';
    versionLabel.style.borderRadius = '5px';
    versionLabel.style.fontSize = '12px';
    headerContainer.appendChild(versionLabel);

    // Button container (to align "Next" and "Hide" buttons)
const nextBtnContainer = document.createElement('div');
    nextBtnContainer.style.display = 'flex';
    nextBtnContainer.style.alignItems = 'center';
    headerContainer.appendChild(nextBtnContainer);
 // Button container (to align "Next" and "Hide" buttons)
    const hideShowBtnContainer = document.createElement('div');
    hideShowBtnContainer.style.display = 'flex';
    hideShowBtnContainer.style.alignItems = 'center';
    headerContainer.appendChild(hideShowBtnContainer);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.style.marginRight = '-57px';
    nextBtn.style.marginTop = '-13px';
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
    nextBtnContainer.appendChild(nextBtn);

// Hide/Show button
const hideShowBtn = document.createElement('button');
hideShowBtn.textContent = 'Hide';
hideShowBtn.style.padding = '10px 15px';
hideShowBtn.style.marginTop = '-107px';
hideShowBtn.style.marginRight = '-7px';
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
hideShowBtnContainer.appendChild(hideShowBtn);
// Thiết lập chiều cao ban đầu của container (ví dụ: 670px)
let originalHeight = container.clientHeight;
let isHidden = false;

hideShowBtn.addEventListener('click', () => {
    if (isHidden) {
        // Khi nhấn "Show", tăng chiều cao dần dần về chiều cao ban đầu và khôi phục độ trong suốt
        container.style.transition = 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out';
        container.style.maxHeight = originalHeight + 'px';
        container.style.opacity = '1';
        hideShowBtn.style.opacity = '1';
        hideShowBtn.textContent = 'Hide';
    } else {
        // Khi nhấn "Hide", giảm chiều cao dần dần về 55px và làm mờ container
        container.style.transition = 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out';
        hideShowBtn.style.opacity = '1';
        container.style.opacity = '0.01'; // Làm mờ container
        hideShowBtn.textContent = 'Show';
    }
    isHidden = !isHidden;
});
    // Active token display
    const activeTokenDisplay = document.createElement('div');
    activeTokenDisplay.style.margin = '10px 0';
    activeTokenDisplay.style.marginTop = '-10px';
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


    // Description
    const desc = document.createElement('p');
    desc.textContent = 'Enter a token and click "Add Token". Click on a token slot to use it.';
    desc.style.margin = '10px 0 20px';
    desc.style.fontSize = '14px';
    desc.style.color = '#555';
    desc.style.textAlign = 'center';
    container.appendChild(desc);

    // Token input and button container
    const tokenInputContainer = document.createElement('div');
    tokenInputContainer.style.display = 'flex';
    tokenInputContainer.style.flexDirection = 'column';
    tokenInputContainer.style.alignItems = 'center';
    tokenInputContainer.style.marginBottom = '20px';
    container.appendChild(tokenInputContainer);

    // Token input field
    const tokenInput = document.createElement('input');
    tokenInput.placeholder = 'Enter token';
    tokenInput.style.width = '100%';
    tokenInput.style.padding = '12px';
    tokenInput.style.border = '1px solid #ddd';
    tokenInput.style.borderRadius = '8px';
    tokenInput.style.marginBottom = '10px';
    tokenInputContainer.appendChild(tokenInput);

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.width = '100%';
    tokenInputContainer.appendChild(buttonsContainer);

    // Add token button
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

    // Clear tokens button
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

    // Token slots container
    const tokenList = document.createElement('div');
    tokenList.style.display = 'flex';
    tokenList.style.flexWrap = 'wrap';
    tokenList.style.gap = '15px';
    container.appendChild(tokenList);

    // Create token slot function
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
        slot.onmouseover = () => {
            slot.style.backgroundColor = '#218838'
        };
        slot.onmouseout = () => {
            slot.style.backgroundColor = '#28a745'
        };
        tokenList.appendChild(slot);
        return slot;
    };

    // Create slots
    const tokenSlots = [createTokenSlot('Slot 1'), createTokenSlot('Slot 2'), createTokenSlot('Slot 3')];

    // Add token button click event
    addTokenBtn.addEventListener('click', () => {
        const token = tokenInput.value.trim();
        if (token) {
            addToken(token);
            tokenInput.value = '';
        } else {
            alert('Please enter a valid token.');
        }
    });

    // Clear tokens button click event
    clearTokensBtn.addEventListener('click', () => {
        displayClearTokenTable();
    });

    // Token slot click events
    tokenSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const token = slot.getAttribute('data-token');
            if (token) {
                setTokenToCookie(token);
                activeTokenDisplay.textContent = `Active Token: ${token}`;
                setTimeout(() => {
                    window.location.reload(); // Simulate auto-reload
                }, 1000);
            }
        });
    });

    // Add token to slot function
    function addToken(token) {
        for (const slot of tokenSlots) {
            if (!slot.getAttribute('data-token')) {
                slot.setAttribute('data-token', token);
                slot.innerHTML = `<strong>Token</strong><br>${token.slice(0, 10)}...`; // Show only first 10 characters for readability
                break;
            }
        }
    }

    // Display table to select tokens to be deleted
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
        cancelBtn.style.borderRadius = '8px';
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
            activeTokenDisplay.textContent = getTokenFromCookie() || 'No active token'; // Update display
            document.body.removeChild(tableContainer);
        });

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.removeChild(tableContainer);
        });
    }

    // Show the next section
    function showNextSection() {
        const nextSection = document.createElement('div');
        nextSection.style.position = 'fixed';
        nextSection.style.marginRight = '0px'
        nextSection.style.marginTop = '30px'
        nextSection.style.top = '20px';
        nextSection.style.right = '20px';
        nextSection.style.backgroundColor = '#fff';
        nextSection.style.padding = '15px';
        nextSection.style.border = '1px solid #ddd';
        nextSection.style.borderRadius = '7px';
        nextSection.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        nextSection.style.zIndex = '9999';
        nextSection.style.width ='350px';
        nextSection.style.height = '670px';
        nextSection.style.maxWidth = '90%';
        nextSection.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(nextSection);

        // Add "Back" button
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

// Create "Connect" status
const connectStatus = document.createElement('div');
connectStatus.style.width = '255px';
connectStatus.style.height = '40px';
connectStatus.style.borderRadius = '8px';
connectStatus.style.textAlign = 'center';
connectStatus.style.marginTop = '10px';
connectStatus.style.marginLeft = '68px'
connectStatus.style.fontFamily = 'Arial, sans-serif';
connectStatus.style.display = 'flex'; // Use flex to align items horizontally
connectStatus.style.alignItems = 'center'; // Align items vertically
connectStatus.style.justifyContent = 'center'; // Center items horizontally
connectStatus.style.backgroundColor = '#dc3545'; // Default color
connectStatus.style.color = '#fff'; // Default color

// Create icon element
const icon = document.createElement('img');
icon.src = 'https://cdn.discordapp.com/attachments/1270359834012942429/1274293675064688670/image.png?ex=66d82377&is=66d6d1f7&hm=5c5063215da800c7d962b1e15a2b51287ce49a1a94aa333eca2f3e9ccbc34963&';
icon.style.width = '34px'; // Adjust size as needed
icon.style.height = '34px'; // Adjust size as needed
icon.style.marginRight = '10px'; // Space between icon and text

// Append icon and text to connectStatus
if (window.location.origin === 'https://www.duolingo.com' && !document.cookie.includes('auth_token')) {
    connectStatus.style.backgroundColor = '#34c759'; // Change background color
    connectStatus.textContent = 'Connected';
    connectStatus.insertBefore(icon, connectStatus.firstChild); // Add icon before text
} else {
    connectStatus.textContent = 'Error';
}

nextSection.appendChild(connectStatus);
nextSection.appendChild(statusTitle);
nextSection.appendChild(sectionTitle);
nextSection.appendChild(setBtn);
nextSection.appendChild(TOSBtn);
nextSection.appendChild(firstDesc);
nextSection.appendChild(secondDesc);
nextSection.appendChild(thirdDesc);
nextSection.appendChild(fourthDesc)
nextSection.appendChild(patreonBtn);
    }
// Add content to the next section
const statusTitle = document.createElement('h3');
statusTitle.textContent = 'Status';
statusTitle.style.margin = '0 0 10px';
statusTitle.style.marginRight = '10000px';
statusTitle.style.marginTop = '-33px'
statusTitle.style.fontSize = '20px';
statusTitle.style.color = '#333';
statusTitle.style.textAlign = 'left';
    // Add "Join our Discord at:" label
const discordLabel = document.createElement('h3');
discordLabel.textContent = 'Join our Discord at:';
discordLabel.style.fontSize = '20px';
discordLabel.style.color = '#000';
discordLabel.style.marginRight = '10px';
discordLabel.style.marginTop = '-30px';
    // Add "Discord" button with icon
const disBtn = document.createElement('button');
disBtn.style.padding = '10px';
disBtn.style.marginLeft = '278px'
disBtn.style.marginTop = '120px'
disBtn.style.backgroundColor = '#5665ec'; // Blue background
disBtn.style.borderRadius = '12px'; // Rounded corners
disBtn.style.border = 'none';
disBtn.style.cursor = 'pointer';
disBtn.style.width = '40px'; // Adjust width to fit the icon
disBtn.style.height = '40px'; // Adjust height to fit the icon
disBtn.style.display = 'inline-flex';
disBtn.style.alignItems = 'center';
disBtn.style.justifyContent = 'center';
disBtn.style.transition = 'background-color 0.3s, transform 0.3s';

const discordIcon = document.createElement('img');
discordIcon.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFeZiimaIf-goC1QoE7-eaIrElIJKEPhLkg&s';
discordIcon.style.width = '24px';
discordIcon.style.height = '24px';
discordIcon.alt = 'Discord Icon';
disBtn.appendChild(discordIcon);

// Add hover effect for the Discord button
disBtn.onmouseover = () => {
    disBtn.style.transform = 'scale(1.05)';
};
disBtn.onmouseout = () => {
    disBtn.style.transform = 'scale(1)';
};

// Add click event to navigate to Discord link
disBtn.onclick = () => {
    window.open('https://discord.gg/sVsrMNzj', '_blank');
};
        // Add "Visit our tool at:" label
const githubLabel = document.createElement('h3');
githubLabel.textContent = 'Visit our tool at:';
githubLabel.style.fontSize = '20px';
githubLabel.style.color = '#000';
githubLabel.style.marginRight = '10px';
githubLabel.style.marginTop = '-30px';
    // Add "Github" button with icon
const gitBtn = document.createElement('button');
gitBtn.style.padding = '10px';
gitBtn.style.marginLeft = '278px'
gitBtn.style.marginTop = '20px'
gitBtn.style.backgroundColor = '#000000'; // Blue background
gitBtn.style.borderRadius = '12px'; // Rounded corners
gitBtn.style.border = 'none';
gitBtn.style.cursor = 'pointer';
gitBtn.style.width = '40px'; // Adjust width to fit the icon
gitBtn.style.height = '40px'; // Adjust height to fit the icon
gitBtn.style.display = 'inline-flex';
gitBtn.style.alignItems = 'center';
gitBtn.style.justifyContent = 'center';
gitBtn.style.transition = 'background-color 0.3s, transform 0.3s';

const githubIcon = document.createElement('img');
githubIcon.src = 'https://cdn.discordapp.com/attachments/1265479273209139200/1268477872952180746/github-6980894_960_720.webp?ex=66d81314&is=66d6c194&hm=dd38329c65f3e28b720e4cd00617cf7004da0359755e3d4402c8197e96d2bf41&';
githubIcon.style.width = '24px';
githubIcon.style.height = '24px';
githubIcon.alt = 'Github Icon';
gitBtn.appendChild(githubIcon);

// Add hover effect for the Discord button
gitBtn.onmouseover = () => {
    gitBtn.style.transform = 'scale(1.05)';
};
gitBtn.onmouseout = () => {
    gitBtn.style.transform = 'scale(1)';
};

// Add click event to navigate to Discord link
gitBtn.onclick = () => {
    window.open('https://github.com/baolong7651/DuoAG-Basic', '_blank');
};
   // Create the button element
    const patreonBtn = document.createElement('button');
    patreonBtn.style.display = 'flex';
    patreonBtn.style.alignItems = 'center';
    patreonBtn.style.padding = '8px 33px';
    patreonBtn.style.marginLeft = '166px';
    patreonBtn.style.marginTop = '-454px';
    patreonBtn.style.background = 'linear-gradient(45deg, #d4a5f9, #7ebafc, #ff9a8b)'; // Gradient background
    patreonBtn.style.color = '#fff';
    patreonBtn.style.border = 'none';
    patreonBtn.style.borderRadius = '8px';
    patreonBtn.style.cursor = 'pointer';
    patreonBtn.style.fontSize = '16px';
    patreonBtn.style.transition = 'background-color 0.3s, transform 0.3s';

    // Add icon to the button
    const patreonicon = document.createElement('img');
    patreonicon.src = 'https://cdn.discordapp.com/attachments/1270361411452932216/1275801063982895114/tai_xuong-removebg-preview.png?ex=66d85954&is=66d707d4&hm=60208c4af0bc8df140410e875f7a01b75ceac0ec78d8ec1226c36788312c1c41&';
    patreonicon.style.width = '28px'; // Adjust the size as needed
    patreonicon.style.height = '28px';
    patreonicon.style.marginRight = '8px'; // Space between icon and text
    patreonBtn.appendChild(patreonicon);

    // Add text to the button
    const btnText = document.createElement('span');
    btnText.textContent = 'Patreon';
    patreonBtn.appendChild(btnText);
    // Hover effects
patreonBtn.onmouseover = () => {
    patreonBtn.style.transform = 'scale(1.05)';
};
patreonBtn.onmouseout = () => {
    patreonBtn.style.transform = 'scale(1)';
};
// Add click event to navigate to Patreon link
patreonBtn.onclick = () => {
    window.open('https://www.patreon.com/fr-FR', '_blank');
};
// Add "Terms of Service" button
const TOSBtn = document.createElement('button');
TOSBtn.style.position = 'relative';
TOSBtn.style.padding = '20px 50px';
TOSBtn.style.marginRight = '10px';
TOSBtn.style.marginTop = '10px';
TOSBtn.style.backgroundColor = '#0080ff'; // Updated background color
TOSBtn.style.color = '#fff';
TOSBtn.style.border = 'none';
TOSBtn.style.borderRadius = '8px';
TOSBtn.style.cursor = 'pointer';
TOSBtn.style.textAlign = 'center';
TOSBtn.style.fontSize = '16px';
TOSBtn.style.display = 'inline-flex';
TOSBtn.style.alignItems = 'center';
TOSBtn.style.justifyContent = 'center';
TOSBtn.style.gap = '10px'; // Khoảng cách giữa icon và text
TOSBtn.style.transition = 'background-color 0.3s, transform 0.3s';

// Add icon to the button
const TOSIcon = document.createElement('img');
TOSIcon.src = 'https://cdn.discordapp.com/attachments/1270361411452932216/1280540169652666439/ege4AuZ.png?ex=66d87377&is=66d721f7&hm=43b9f35ca1e5aa7869a911143af7d4e922cbe8f91255c97ca657363400f81f55&';
TOSIcon.style.width = '40px'; // Tăng kích thước icon
TOSIcon.style.height = '40px';
TOSIcon.style.objectFit = 'contain'; // Đảm bảo icon không bị biến dạng
TOSIcon.style.position = 'absolute';
TOSIcon.style.left = '10px'; // Điều chỉnh vị trí icon trong nút

// Wrap the text in a span to control text placement
const TOSText = document.createElement('span');
TOSText.textContent = 'Terms of Service';
TOSText.style.left = '10px'; // Điều chỉnh vị trí icon trong nút

// Append icon and text to the button
TOSBtn.appendChild(TOSIcon);
TOSBtn.appendChild(TOSText);

// Add hover effects
TOSBtn.onmouseover = () => {
    TOSBtn.style.transform = 'scale(1.05)';
};
TOSBtn.onmouseout = () => {
    TOSBtn.style.transform = 'scale(1)';
};

// Add click event to the button
TOSBtn.addEventListener('click', () => {
    showTOSSection();
});
    // Show the TOS section
    function showTOSSection() {
        const TOSSection = document.createElement('div');
        TOSSection.style.position = 'fixed';
        TOSSection.style.marginRight = '0px'
        TOSSection.style.marginTop = '30px'
        TOSSection.style.top = '20px';
        TOSSection.style.right = '20px';
        TOSSection.style.backgroundColor = '#fff';
        TOSSection.style.padding = '15px';
        TOSSection.style.overflow = 'auto';
        TOSSection.style.border = '1px solid #ddd';
        TOSSection.style.borderRadius = '7px';
        TOSSection.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        TOSSection.style.zIndex = '9999';
        TOSSection.style.width ='350px';
        TOSSection.style.height = '670px';
        TOSSection.style.maxWidth = '90%';
        TOSSection.style.fontFamily = 'Arial, sans-serif';
        TOSSection.appendChild(backTOSBtn);
        TOSSection.appendChild(TOSTitle);
        TOSSection.appendChild(TOSTitle1);
        TOSSection.appendChild(TOSDesc1);
        TOSSection.appendChild(TOSTitle2);
        TOSSection.appendChild(TOSDesc2);
        TOSSection.appendChild(TOSTitle3);
        TOSSection.appendChild(TOSDesc3);
        TOSSection.appendChild(TOSTitle4);
        TOSSection.appendChild(TOSDesc4);
        TOSSection.appendChild(anotherTOSDesc4);
        TOSSection.appendChild(TOSTitle5);
        TOSSection.appendChild(TOSDesc5);
        TOSSection.appendChild(TOSTitle6);
        TOSSection.appendChild(TOSDesc6);
        TOSSection.appendChild(anotherTOSDesc6);
        TOSSection.appendChild(TOSTitle7);
        TOSSection.appendChild(TOSDesc7);
        TOSSection.appendChild(anotherTOSDesc7);
        TOSSection.appendChild(TOSTitle8);
        TOSSection.appendChild(TOSDesc8);
        TOSSection.appendChild(TOSTitle9);
        TOSSection.appendChild(TOSDesc9);
        TOSSection.appendChild(TOSTitle10);
        TOSSection.appendChild(TOSDesc10);
        backTOSBtn.addEventListener('click', () => {
            document.body.removeChild(TOSSection);
        });
        document.body.appendChild(TOSSection);
    };
    // Add "Back" button
        const backTOSBtn = document.createElement('button');
        backTOSBtn.textContent = 'Back';
        backTOSBtn.style.padding = '10px 15px';
        backTOSBtn.style.backgroundColor = '#dc3545';
        backTOSBtn.style.color = '#fff';
        backTOSBtn.style.border = 'none';
        backTOSBtn.style.borderRadius = '15px';
        backTOSBtn.style.cursor = 'pointer';
        backTOSBtn.style.fontSize = '14px';
        backTOSBtn.style.transition = 'background-color 0.3s, transform 0.3s';
        backTOSBtn.onmouseover = () => {
            backTOSBtn.style.backgroundColor = '#c82333';
            backTOSBtn.style.transform = 'scale(1.05)';
        };
        backTOSBtn.onmouseout = () => {
            backTOSBtn.style.backgroundColor = '#dc3545';
            backTOSBtn.style.transform = 'scale(1)';
        };
// Show the next section
    function showSettingsSection() {
        const settingsSection = document.createElement('div');
        settingsSection.style.position = 'fixed';
        settingsSection.style.marginRight = '0px'
        settingsSection.style.marginTop = '30px'
        settingsSection.style.top = '20px';
        settingsSection.style.right = '20px';
        settingsSection.style.backgroundColor = '#fff';
        settingsSection.style.padding = '15px';
        settingsSection.style.border = '1px solid #ddd';
        settingsSection.style.borderRadius = '7px';
        settingsSection.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        settingsSection.style.zIndex = '9999';
        settingsSection.style.width ='350px';
        settingsSection.style.height = '670px';
        settingsSection.style.maxWidth = '90%';
        settingsSection.style.fontFamily = 'Arial, sans-serif';
        settingsSection.appendChild(backSetBtn);
        settingsSection.appendChild(statsContainer);
        settingsSection.appendChild(toggleLabel);
        settingsSection.appendChild(settingsTitle);
        settingsSection.appendChild(disBtn);
        settingsSection.appendChild(discordLabel);
        settingsSection.appendChild(gitBtn);
        settingsSection.appendChild(githubLabel);
        backSetBtn.addEventListener('click', () => {
            document.body.removeChild(settingsSection);
        });
        document.body.appendChild(settingsSection);
    };
    // Add "Back" button
        const backSetBtn = document.createElement('button');
        backSetBtn.textContent = 'Back';
        backSetBtn.style.padding = '10px 15px';
        backSetBtn.style.backgroundColor = '#dc3545';
        backSetBtn.style.color = '#fff';
        backSetBtn.style.border = 'none';
        backSetBtn.style.borderRadius = '15px';
        backSetBtn.style.cursor = 'pointer';
        backSetBtn.style.fontSize = '14px';
        backSetBtn.style.transition = 'background-color 0.3s, transform 0.3s';
        backSetBtn.onmouseover = () => {
            backSetBtn.style.backgroundColor = '#c82333';
            backSetBtn.style.transform = 'scale(1.05)';
        };
        backSetBtn.onmouseout = () => {
            backSetBtn.style.backgroundColor = '#dc3545';
            backSetBtn.style.transform = 'scale(1)';
        };
// Create the button element
const setBtn = document.createElement('button');
setBtn.style.display = 'flex';
setBtn.style.alignItems = 'center';
setBtn.style.padding = '10px 35px';
setBtn.style.marginLeft = '0px';
setBtn.style.marginTop = '65px';
setBtn.style.backgroundColor = '#b4baba';
setBtn.style.color = '#000';
setBtn.style.border = 'none';
setBtn.style.borderRadius = '8px';
setBtn.style.cursor = 'pointer';
setBtn.style.fontSize = '16px';
setBtn.style.transition = 'background-color 0.3s, transform 0.3s';

// Create the icon element
const icon = document.createElement('img');
icon.src = 'https://cdn.discordapp.com/attachments/1265663796467466294/1280535854250721301/RtZQlyF.png?ex=66d86f72&is=66d71df2&hm=60c8f969c002be8ea2387668d7042025c22f54a4bee489b5ff2b9f4324414f8e&';
icon.alt = 'Settings Icon';
icon.style.borderRadius = '10px';
icon.style.width = '25px';
icon.style.height = '25px';
icon.style.marginRight = '12px'; // Space between icon and text

// Add icon and text to the button
setBtn.appendChild(icon);
setBtn.appendChild(document.createTextNode('Setting'));

// Hover effects
setBtn.onmouseover = () => {
    setBtn.style.transform = 'scale(1.05)';
};
setBtn.onmouseout = () => {
    setBtn.style.transform = 'scale(1)';
};

// Click event
setBtn.addEventListener('click', () => {
    showSettingsSection();
});

         // Tạo phần FPS và Ping
    const statsContainer = document.createElement('div');
    statsContainer.style.marginTop = '20px';
    statsContainer.style.fontSize = '14px';
    statsContainer.style.color = 'black';
    statsContainer.style.backgroundColor = '#b3b4b5';
    statsContainer.style.border = '3px solid #6f7070';
    statsContainer.style.borderRadius = '5px';
    const fpsDisplay = document.createElement('div');
    fpsDisplay.textContent = 'FPS: 0';
    fpsDisplay.style.marginLeft = '10px';
    statsContainer.appendChild(fpsDisplay);
    const pingDisplay = document.createElement('div');
    pingDisplay.textContent = 'Ping: 0 ms';
    pingDisplay.style.marginLeft = '10px';
    statsContainer.appendChild(pingDisplay);

    // Hàm cập nhật FPS
    let lastFrameTime = performance.now();
    function updateFPS() {
        const now = performance.now();
        const fps = Math.round(1000 / (now - lastFrameTime));
        lastFrameTime = now;
        fpsDisplay.textContent = `FPS: ${fps}`;
        requestAnimationFrame(updateFPS);
    }
    updateFPS();

    // Hàm cập nhật Ping
    function updatePing() {
        const start = performance.now();
        fetch('https://www.duolingo.com/learn') // Thay đổi URL này thành URL của máy chủ bạn
            .then(response => response.text())
            .then(() => {
                const ping = Math.round(performance.now() - start);
                pingDisplay.textContent = `Ping: ${ping} ms`;
            })
            .catch(() => {
                pingDisplay.textContent = 'Ping: Error';
            })
            .finally(() => {
                setTimeout(updatePing, 5000); // Cập nhật ping mỗi 5 giây
            });
    }
    updatePing();

    // Tạo label và công tắc Toggle Dark Mode
    const toggleLabel = document.createElement('label');
    toggleLabel.style.display = 'flex';
    toggleLabel.style.alignItems = 'center';
    toggleLabel.style.justifyContent = 'space-between';
    toggleLabel.style.marginTop = '20px'; // Thêm khoảng cách từ trên xuống
    toggleLabel.style.fontSize = '16px';

    // Thêm biểu tượng dark mode vào bên trái của văn bản
    const darkModeIcon = document.createElement('img');
    darkModeIcon.src = 'https://cdsassets.apple.com/live/7WUAS350/images/inline-icons/ios-17-dark-mode-icon.png';
    darkModeIcon.style.width = '24px'; // Kích thước biểu tượng
    darkModeIcon.style.height = '24px';
    darkModeIcon.style.marginRight = '-80px'; // Giảm khoảng cách giữa icon và văn bản
    toggleLabel.appendChild(darkModeIcon);

    // Tạo văn bản Toggle Dark Mode
    const toggleText = document.createElement('span');
    toggleText.textContent = 'Toggle Dark Mode';
    toggleLabel.appendChild(toggleText);

    // Tạo công tắc bật/tắt
    const toggleSwitch = document.createElement('div');
    toggleSwitch.style.position = 'relative';
    toggleSwitch.style.width = '50px';
    toggleSwitch.style.height = '25px';
    toggleSwitch.style.background = '#ccc';
    toggleSwitch.style.borderRadius = '25px';
    toggleSwitch.style.cursor = 'pointer';
    toggleSwitch.style.transition = 'background-color 0.3s ease';
    toggleLabel.appendChild(toggleSwitch);

    const toggleKnob = document.createElement('div');
    toggleKnob.style.position = 'absolute';
    toggleKnob.style.top = '2px';
    toggleKnob.style.left = '2px';
    toggleKnob.style.width = '21px';
    toggleKnob.style.height = '21px';
    toggleKnob.style.background = 'white';
    toggleKnob.style.borderRadius = '50%';
    toggleKnob.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    toggleKnob.style.transition = 'left 0.3s ease';
    toggleSwitch.appendChild(toggleKnob);

    // Hàm chuyển đổi Dark Mode với animation
    function toggleDarkMode() {
        if (isDarkModeEnabled()) {
            // Chuyển về Light Mode
            container.classList.remove('dark-mode');
            container.style.background = 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.3))';
            container.style.color = 'black';
            container.style.border = '1px solid #ddd';
            toggleSwitch.style.background = '#ccc';
            toggleKnob.style.left = '2px';
        } else {
            // Chuyển sang Dark Mode
            container.classList.add('dark-mode');
            container.style.background = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5))';
            container.style.color = 'white';
            container.style.border = '1px solid #333';
            toggleSwitch.style.background = '#4caf50';
            toggleKnob.style.left = '27px';
        }
    }

    // Gán sự kiện click cho công tắc
    toggleSwitch.addEventListener('click', function() {
        toggleDarkMode();
    });

    // Cho phép kéo công tắc
    var isDragging = false;
    toggleKnob.addEventListener('mousedown', function() {
        isDragging = true;
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            var rect = toggleSwitch.getBoundingClientRect();
            var offsetX = e.clientX - rect.left;
            if (offsetX > rect.width / 2) {
                toggleSwitch.style.background = '#4caf50';
                toggleKnob.style.left = '27px';
                container.classList.add('dark-mode');
                container.style.background = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5))';
                container.style.color = 'white';
                container.style.border = '1px solid #333';
            } else {
                toggleSwitch.style.background = '#ccc';
                toggleKnob.style.left = '2px';
                container.classList.remove('dark-mode');
                container.style.background = 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.3))';
                container.style.color = 'black';
                container.style.border = '1px solid #ddd';
            }
        }
    })
     // Add content to the next section
        const settingsTitle = document.createElement('h3');
        settingsTitle.textContent = 'Settings';
        settingsTitle.style.margin = '0 0 10px';
        settingsTitle.style.marginRight = '-10px';
        settingsTitle.style.marginTop = '-135px'
        settingsTitle.style.fontSize = '20px';
        settingsTitle.style.color = '#333';
        settingsTitle.style.textAlign = 'center';
    // Add content to the next section
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'More Features';
        sectionTitle.style.margin = '0 0 10px';
        sectionTitle.style.marginRight = '-10px';
        sectionTitle.style.marginTop = '-75px'
        sectionTitle.style.fontSize = '20px';
        sectionTitle.style.color = '#333';
        sectionTitle.style.textAlign = 'center';
    const firstDesc = document.createElement('p');
        firstDesc.textContent = 'MIT License Copyright © 2024 Interstellar, NowaysZ'
        firstDesc.style.margin = '0';
        firstDesc.style.marginTop = '15px'
        firstDesc.style.fontSize = '14px';
        firstDesc.style.color = '#080808';
        firstDesc.style.textAlign = 'center';
        firstDesc.style.fontFamily = 'Arial, San-Serif';

    const secondDesc = document.createElement('p');
        secondDesc.textContent = 'Permission is granted to use, copy, modify, and distribute the Software, subject to the following conditions:';
        secondDesc.style.margin = 'px';
        secondDesc.style.marginTop = '15px'
        secondDesc.style.fontSize = '14px';
        secondDesc.style.color = '#080808';
        secondDesc.style.textAlign = 'center';
        secondDesc.style.fontFamily = 'Arial, San-Serif';

      const thirdDesc = document.createElement('p');
        thirdDesc.textContent = 'No Copying or Modification: You may not copy, modify, or transform the graphical user interface (GUI) of the Software. No Illegal Use: The Software must not be used for illegal activities or unethical purposes, including unauthorized access or theft. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY';
        thirdDesc.style.margin = '0';
        thirdDesc.style.marginTop = '15px'
        thirdDesc.style.fontSize = '14px';
        thirdDesc.style.color = '#080808';
        thirdDesc.style.textAlign = 'center';
        thirdDesc.style.fontFamily = 'Arial, San-Serif';
     const fourthDesc = document.createElement('p');
        fourthDesc.textContent = 'You should read the MIT License and Terms of Service before using our tool';
        fourthDesc.style.margin = '0';
        fourthDesc.style.marginTop = '15px'
        fourthDesc.style.fontSize = '16px';
        fourthDesc.style.color = '#333';
        fourthDesc.style.textAlign = 'center';
    // Add content to the TOS section
        const TOSTitle = document.createElement('h3');
        TOSTitle.textContent = 'Terms of Service';
        TOSTitle.style.margin = '0 0 10px';
        TOSTitle.style.marginRight = '-15px';
        TOSTitle.style.marginTop = '-25px'
        TOSTitle.style.fontSize = '20px';
        TOSTitle.style.color = '#333';
        TOSTitle.style.textAlign = 'center';

    const TOSTitle1 = document.createElement('p');
        TOSTitle1.textContent = '1. Introduction'
        TOSTitle1.style.margin = '0';
        TOSTitle1.style.marginTop = '5px'
        TOSTitle1.style.fontSize = '14px';
        TOSTitle1.style.color = '#080808';
        TOSTitle1.style.textAlign = 'left';
        TOSTitle1.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc1 = document.createElement('p');
        TOSDesc1.textContent = '- Welcome to DuoAgent. DuoAgent is a tool designed to help manage accounts using tokens. By using DuoAgent, you agree to comply with and be bound by the following terms and conditions'
        TOSDesc1.style.margin = '0';
        TOSDesc1.style.marginTop = '5px'
        TOSDesc1.style.fontSize = '14px';
        TOSDesc1.style.color = '#080808';
        TOSDesc1.style.textAlign = 'left';
        TOSDesc1.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle2 = document.createElement('p');
        TOSTitle2.textContent = '2. Acceptance of Terms'
        TOSTitle2.style.margin = '0';
        TOSTitle2.style.marginTop = '5px'
        TOSTitle2.style.fontSize = '14px';
        TOSTitle2.style.color = '#080808';
        TOSTitle2.style.textAlign = 'left';
        TOSTitle2.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc2 = document.createElement('p');
        TOSDesc2.textContent = '- By accessing and using DuoAgent, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use DuoAgent.'
        TOSDesc2.style.margin = '0';
        TOSDesc2.style.marginTop = '5px'
        TOSDesc2.style.fontSize = '14px';
        TOSDesc2.style.color = '#080808';
        TOSDesc2.style.textAlign = 'left';
        TOSDesc2.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle3 = document.createElement('p');
        TOSTitle3.textContent = '3. Use of DuoAgent'
        TOSTitle3.style.margin = '0';
        TOSTitle3.style.marginTop = '5px'
        TOSTitle3.style.fontSize = '14px';
        TOSTitle3.style.color = '#080808';
        TOSTitle3.style.textAlign = 'left';
        TOSTitle3.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc3 = document.createElement('p');
        TOSDesc3.textContent = '- DuoAgent is provided for the purpose of managing accounts via tokens. You agree to use DuoAgent only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else use of DuoAgent.'
        TOSDesc3.style.margin = '0';
        TOSDesc3.style.marginTop = '5px'
        TOSDesc3.style.fontSize = '14px';
        TOSDesc3.style.color = '#080808';
        TOSDesc3.style.textAlign = 'left';
        TOSDesc3.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle4 = document.createElement('p');
        TOSTitle4.textContent = '4. User Responsibilities'
        TOSTitle4.style.margin = '0';
        TOSTitle4.style.marginTop = '5px'
        TOSTitle4.style.fontSize = '14px';
        TOSTitle4.style.color = '#080808';
        TOSTitle4.style.textAlign = 'left';
        TOSTitle4.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc4 = document.createElement('p');
        TOSDesc4.textContent = '- Account Security: You are responsible for maintaining the confidentiality of your tokens and any activities that occur under your tokens.'
        TOSDesc4.style.margin = '0';
        TOSDesc4.style.marginTop = '5px'
        TOSDesc4.style.fontSize = '14px';
        TOSDesc4.style.color = '#080808';
        TOSDesc4.style.textAlign = 'left';
        TOSDesc4.style.fontFamily = 'Arial, San-Serif';
    const anotherTOSDesc4 = document.createElement('p');
        anotherTOSDesc4.textContent = '- Prohibited Uses: You may not use DuoAgent for any illegal or unauthorized purpose. You agree not to, in the use of DuoAgent, violate any laws in your jurisdiction (including but not limited to copyright laws).'
        anotherTOSDesc4.style.margin = '0';
        anotherTOSDesc4.style.marginTop = '5px'
        anotherTOSDesc4.style.fontSize = '14px';
        anotherTOSDesc4.style.color = '#080808';
        anotherTOSDesc4.style.textAlign = 'left';
        anotherTOSDesc4.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle5 = document.createElement('p');
        TOSTitle5.textContent = '5. Intellectual Property'
        TOSTitle5.style.margin = '0';
        TOSTitle5.style.marginTop = '5px'
        TOSTitle5.style.fontSize = '14px';
        TOSTitle5.style.color = '#080808';
        TOSTitle5.style.textAlign = 'left';
        TOSTitle5.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc5 = document.createElement('p');
        TOSDesc5.textContent = '- All content included on DuoAgent, such as text, graphics, logos, and software, is the property of DuoAgent or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of DuoAgent.'
        TOSDesc5.style.margin = '0';
        TOSDesc5.style.marginTop = '5px'
        TOSDesc5.style.fontSize = '14px';
        TOSDesc5.style.color = '#080808';
        TOSDesc5.style.textAlign = 'left';
        TOSDesc5.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle6 = document.createElement('p');
        TOSTitle6.textContent = '6. Copying and Redistribution'
        TOSTitle6.style.margin = '0';
        TOSTitle6.style.marginTop = '5px'
        TOSTitle6.style.fontSize = '14px';
        TOSTitle6.style.color = '#080808';
        TOSTitle6.style.textAlign = 'left';
        TOSTitle6.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc6 = document.createElement('p');
        TOSDesc6.textContent = '- You may not copy, distribute, or create derivative works based on DuoAgent without prior written consent from us.'
        TOSDesc6.style.margin = '0';
        TOSDesc6.style.marginTop = '5px'
        TOSDesc6.style.fontSize = '14px';
        TOSDesc6.style.color = '#080808';
        TOSDesc6.style.textAlign = 'left';
        TOSDesc6.style.fontFamily = 'Arial, San-Serif';
    const anotherTOSDesc6 = document.createElement('p');
        anotherTOSDesc6.textContent = '- Unauthorized use of DuoAgent`s content is strictly prohibited and may violate copyright laws.'
        anotherTOSDesc6.style.margin = '0';
        anotherTOSDesc6.style.marginTop = '5px'
        anotherTOSDesc6.style.fontSize = '14px';
        anotherTOSDesc6.style.color = '#080808';
        anotherTOSDesc6.style.textAlign = 'left';
        anotherTOSDesc6.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle7 = document.createElement('p');
        TOSTitle7.textContent = '7. Disclaimers'
        TOSTitle7.style.margin = '0';
        TOSTitle7.style.marginTop = '5px'
        TOSTitle7.style.fontSize = '14px';
        TOSTitle7.style.color = '#080808';
        TOSTitle7.style.textAlign = 'left';
        TOSTitle7.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc7 = document.createElement('p');
        TOSDesc7.textContent = '- Availability: DuoAgent is provided on an "as is" and "as available" basis. We do not guarantee that DuoAgent will be available at all times or without interruptions.'
        TOSDesc7.style.margin = '0';
        TOSDesc7.style.marginTop = '5px'
        TOSDesc7.style.fontSize = '14px';
        TOSDesc7.style.color = '#080808';
        TOSDesc7.style.textAlign = 'left';
        TOSDesc7.style.fontFamily = 'Arial, San-Serif';
    const anotherTOSDesc7 = document.createElement('p');
        anotherTOSDesc7.textContent = '- Warranties: We do not warrant that DuoAgent will meet your requirements or that it will be error-free or that defects will be corrected.'
        anotherTOSDesc7.style.margin = '0';
        anotherTOSDesc7.style.marginTop = '5px'
        anotherTOSDesc7.style.fontSize = '14px';
        anotherTOSDesc7.style.color = '#080808';
        anotherTOSDesc7.style.textAlign = 'left';
        anotherTOSDesc7.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle8 = document.createElement('p');
        TOSTitle8.textContent = '8. Limitation of Liability'
        TOSTitle8.style.margin = '0';
        TOSTitle8.style.marginTop = '5px'
        TOSTitle8.style.fontSize = '14px';
        TOSTitle8.style.color = '#080808';
        TOSTitle8.style.textAlign = 'left';
        TOSTitle8.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc8 = document.createElement('p');
        TOSDesc8.textContent = '- In no event shall DuoAgent be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use or the inability to use DuoAgent.'
        TOSDesc8.style.margin = '0';
        TOSDesc8.style.marginTop = '5px'
        TOSDesc8.style.fontSize = '14px';
        TOSDesc8.style.color = '#080808';
        TOSDesc8.style.textAlign = 'left';
        TOSDesc8.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle9 = document.createElement('p');
        TOSTitle9.textContent = '9. Changes to the Terms of Service'
        TOSTitle9.style.margin = '0';
        TOSTitle9.style.marginTop = '5px'
        TOSTitle9.style.fontSize = '14px';
        TOSTitle9.style.color = '#080808';
        TOSTitle9.style.textAlign = 'left';
        TOSTitle9.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc9 = document.createElement('p');
        TOSDesc9.textContent = '- We reserve the right to modify these Terms of Service at any time. Any changes will be effective immediately upon posting on this page. Your continued use of DuoAgent following the posting of changes constitutes your acceptance of such changes.'
        TOSDesc9.style.margin = '0';
        TOSDesc9.style.marginTop = '5px'
        TOSDesc9.style.fontSize = '14px';
        TOSDesc9.style.color = '#080808';
        TOSDesc9.style.textAlign = 'left';
        TOSDesc9.style.fontFamily = 'Arial, San-Serif';
    const TOSTitle10 = document.createElement('p');
        TOSTitle10.textContent = '10. Contact Information'
        TOSTitle10.style.margin = '0';
        TOSTitle10.style.marginTop = '5px'
        TOSTitle10.style.fontSize = '14px';
        TOSTitle10.style.color = '#080808';
        TOSTitle10.style.textAlign = 'left';
        TOSTitle10.style.fontFamily = 'Arial, San-Serif';
    const TOSDesc10 = document.createElement('p');
        TOSDesc10.textContent = '- If you have any questions about these Terms of Service, please contact us at https://discord.gg/b82gQ4fT.'
        TOSDesc10.style.margin = '0';
        TOSDesc10.style.marginTop = '5px'
        TOSDesc10.style.fontSize = '14px';
        TOSDesc10.style.color = '#080808';
        TOSDesc10.style.textAlign = 'left';
        TOSDesc10.style.fontFamily = 'Arial, San-Serif';
    // Add click event to the "Next" button to show the next section
    nextBtn.addEventListener('click', () => {
        showNextSection();
    });
    // Automatically update the active token display with the token from cookies
    activeTokenDisplay.textContent = getTokenFromCookie() || 'No active token'
})();
