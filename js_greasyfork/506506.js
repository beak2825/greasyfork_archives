// ==UserScript==
// @name         Combined ShadeReap and Agar.io Cheat GUI with Account Tracker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Custom ShadeReap Console GUI with multiple pages, features for Agar.io including cheats, script injector, and account tracker
// @author       Your Name
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506506/Combined%20ShadeReap%20and%20Agario%20Cheat%20GUI%20with%20Account%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/506506/Combined%20ShadeReap%20and%20Agario%20Cheat%20GUI%20with%20Account%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInjected = false;

    // Create the main container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '50px';
    container.style.width = '600px';
    container.style.height = '350px';
    container.style.backgroundColor = '#3a3a3a';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.2)';
    container.style.zIndex = '9999';
    container.style.cursor = 'move';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.userSelect = 'none';
    container.style.transform = 'translateY(100vh)';
    container.style.transition = 'transform 1s ease-out';
    document.body.appendChild(container);

    // Function to make the GUI draggable
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY;

        element.onmousedown = function(e) {
            isDragging = true;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
        };

        element.ontouchstart = function(e) {
            isDragging = true;
            startX = e.touches[0].clientX - element.offsetLeft;
            startY = e.touches[0].clientY - element.offsetTop;
        };

        document.onmousemove = function(e) {
            if (isDragging) {
                element.style.left = e.clientX - startX + 'px';
                element.style.top = e.clientY - startY + 'px';
            }
        };

        document.ontouchmove = function(e) {
            if (isDragging) {
                element.style.left = e.touches[0].clientX - startX + 'px';
                element.style.top = e.touches[0].clientY - startY + 'px';
            }
        };

        document.onmouseup = function() {
            isDragging = false;
        };

        document.ontouchend = function() {
            isDragging = false;
        };
    }

    makeDraggable(container);

    // Loading bar
    const loadingBar = document.createElement('div');
    loadingBar.style.width = '100%';
    loadingBar.style.height = '5px';
    loadingBar.style.backgroundColor = '#ff0000';
    loadingBar.style.borderRadius = '5px';
    loadingBar.style.position = 'absolute';
    loadingBar.style.bottom = '0';
    container.appendChild(loadingBar);

    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += 5;
        loadingBar.style.width = `${loadProgress}%`;
        if (loadProgress >= 100) {
            clearInterval(loadInterval);
            container.style.transform = 'translateY(0)';
            loadingBar.remove();
        }
    }, 50);

    // Create the header section
    const header = document.createElement('div');
    header.style.backgroundColor = '#454545';
    header.style.height = '50px';
    header.style.borderTopLeftRadius = '10px';
    header.style.borderTopRightRadius = '10px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '0 15px';
    header.style.color = '#fff';
    header.style.fontFamily = 'Arial, sans-serif';
    header.style.fontSize = '20px';
    header.innerHTML = `
        <div style="flex: 1; display: flex; align-items: center;">
            <span style="margin-right: 10px;">&#x1F480;</span> ShadeReap Console
        </div>
        <div id="statusCircle" style="width: 15px; height: 15px; border-radius: 50%; background-color: red; margin-right: 10px;"></div>
        <div id="closeBtn" style="cursor: pointer;">&#x2715;</div>
    `;
    container.appendChild(header);

    // Close button functionality
    document.getElementById('closeBtn').onclick = function() {
        container.style.display = 'none';
    };

    // Create the sidebar
    const sidebar = document.createElement('div');
    sidebar.style.backgroundColor = '#3a3a3a';
    sidebar.style.width = '70px';
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column';
    sidebar.style.alignItems = 'center';
    sidebar.style.paddingTop = '15px';
    container.appendChild(sidebar);

    // Add Home Button (Main Page)
    const homeBtn = document.createElement('div');
    homeBtn.style.width = '50px';
    homeBtn.style.height = '50px';
    homeBtn.style.marginBottom = '15px';
    homeBtn.style.fontSize = '32px';
    homeBtn.style.color = '#fff';
    homeBtn.style.cursor = 'pointer';
    homeBtn.innerHTML = '&#x1F3E0;';
    sidebar.appendChild(homeBtn);

    // Add Pencil Button (Script Executor)
    const pencilBtn = document.createElement('div');
    pencilBtn.style.width = '50px';
    pencilBtn.style.height = '50px';
    pencilBtn.style.marginBottom = '15px';
    pencilBtn.style.background = 'url("data:image/png;base64,...") center/cover no-repeat';
    pencilBtn.style.cursor = 'pointer';
    sidebar.appendChild(pencilBtn);

    // Add Game Controller Button (Cheats)
    const gameBtn = document.createElement('div');
    gameBtn.style.width = '50px';
    gameBtn.style.height = '50px';
    gameBtn.style.marginBottom = '15px';
    gameBtn.style.background = 'url("data:image/png;base64,...") center/cover no-repeat';
    gameBtn.style.cursor = 'pointer';
    sidebar.appendChild(gameBtn);

    // Add Syringe Button (Script Injector)
    const syringeBtn = document.createElement('div');
    syringeBtn.style.width = '50px';
    syringeBtn.style.height = '50px';
    syringeBtn.style.marginBottom = '15px';
    syringeBtn.style.background = 'url("data:image/png;base64,...") center/cover no-repeat';
    syringeBtn.style.cursor = 'pointer';
    sidebar.appendChild(syringeBtn);

    // Create the content area
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.padding = '15px';
    content.style.backgroundColor = '#4a4a4a';
    content.style.borderBottomLeftRadius = '10px';
    content.style.borderBottomRightRadius = '10px';
    container.appendChild(content);

    // Function to clear content area
    function clearContent() {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
    }

    // Create Main Page
    function createMainPage() {
        clearContent();

        const title = document.createElement('h2');
        title.style.color = '#fff';
        title.style.fontFamily = 'Arial, sans-serif';
        title.textContent = 'Main Page';
        content.appendChild(title);

        const hitboxBtn = document.createElement('button');
        hitboxBtn.style.backgroundColor = '#4a4a4a';
        hitboxBtn.style.color = '#fff';
        hitboxBtn.style.border = 'none';
        hitboxBtn.style.borderRadius = '5px';
        hitboxBtn.style.padding = '10px 20px';
        hitboxBtn.style.cursor = 'pointer';
        hitboxBtn.textContent = 'Increase Hitbox';
        hitboxBtn.onclick = function() {
            // Add hitbox increasing logic here
            alert('Hitbox increased!');
        };
        content.appendChild(hitboxBtn);
    }

    // Create Script Executor Page
    function createScriptExecutorPage() {
        clearContent();

        const textArea = document.createElement('textarea');
        textArea.style.width = '100%';
        textArea.style.height = '200px';
        textArea.style.marginBottom = '10px';
        textArea.style.border = 'none';
        textArea.style.borderRadius = '5px';
        textArea.style.padding = '10px';
        textArea.style.fontFamily = 'Consolas, monospace';
        textArea.style.fontSize = '14px';
        content.appendChild(textArea);

        const executeBtn = document.createElement('button');
        executeBtn.style.backgroundColor = '#4a4a4a';
        executeBtn.style.color = '#fff';
        executeBtn.style.border = 'none';
        executeBtn.style.borderRadius = '5px';
        executeBtn.style.padding = '10px 20px';
        executeBtn.style.cursor = 'pointer';
        executeBtn.style.marginRight = '10px';
        executeBtn.textContent = 'Execute';
        executeBtn.onclick = function() {
            const code = textArea.value;
            try {
                eval(code);
            } catch (e) {
                alert('Error executing script: ' + e.message);
            }
        };
        content.appendChild(executeBtn);
    }

    // Create Cheats Page
    function createCheatsPage() {
        clearContent();

        const title = document.createElement('h2');
        title.style.color = '#fff';
        title.style.fontFamily = 'Arial, sans-serif';
        title.textContent = 'Agar.io Cheats';
        content.appendChild(title);

        const sizeBtn = document.createElement('button');
        sizeBtn.style.backgroundColor = '#4a4a4a';
        sizeBtn.style.color = '#fff';
        sizeBtn.style.border = 'none';
        sizeBtn.style.borderRadius = '5px';
        sizeBtn.style.padding = '10px 20px';
        sizeBtn.style.cursor = 'pointer';
        sizeBtn.textContent = 'Increase Size';
        sizeBtn.onclick = function() {
            // Add size increasing logic here
            alert('Size increased!');
        };
        content.appendChild(sizeBtn);

        // Add more cheat buttons as needed
    }

    // Create Script Injector Page
    function createScriptInjectorPage() {
        clearContent();

        const title = document.createElement('h2');
        title.style.color = '#fff';
        title.style.fontFamily = 'Arial, sans-serif';
        title.textContent = 'Script Injector';
        content.appendChild(title);

        const scriptInput = document.createElement('textarea');
        scriptInput.style.width = '100%';
        scriptInput.style.height = '150px';
        scriptInput.style.border = 'none';
        scriptInput.style.borderRadius = '5px';
        scriptInput.style.padding = '10px';
        scriptInput.style.fontFamily = 'Consolas, monospace';
        scriptInput.style.fontSize = '14px';
        content.appendChild(scriptInput);

        const injectBtn = document.createElement('button');
        injectBtn.style.backgroundColor = '#4a4a4a';
        injectBtn.style.color = '#fff';
        injectBtn.style.border = 'none';
        injectBtn.style.borderRadius = '5px';
        injectBtn.style.padding = '10px 20px';
        injectBtn.style.cursor = 'pointer';
        injectBtn.textContent = 'Inject';
        injectBtn.onclick = function() {
            const scriptCode = scriptInput.value;
            const scriptElement = document.createElement('script');
            scriptElement.textContent = scriptCode;
            document.body.appendChild(scriptElement);
            alert('Script injected!');
        };
        content.appendChild(injectBtn);
    }

    // Attach event listeners for navigation
    homeBtn.onclick = createMainPage;
    pencilBtn.onclick = createScriptExecutorPage;
    gameBtn.onclick = createCheatsPage;
    syringeBtn.onclick = createScriptInjectorPage;

    // Initial page load
    createMainPage();

    // Account Tracker Logic (optional)
    let accounts = JSON.parse(localStorage.getItem('accountTracker') || '[]');

    function updateAccountTracker() {
        clearContent();

        const title = document.createElement('h2');
        title.style.color = '#fff';
        title.style.fontFamily = 'Arial, sans-serif';
        title.textContent = 'Account Tracker';
        content.appendChild(title);

        const accountList = document.createElement('ul');
        accountList.style.color = '#fff';
        accountList.style.listStyle = 'none';
        content.appendChild(accountList);

        accounts.forEach((account, index) => {
            const accountItem = document.createElement('li');
            accountItem.textContent = `${index + 1}: ${account}`;
            accountList.appendChild(accountItem);
        });

        const accountInput = document.createElement('input');
        accountInput.style.marginTop = '10px';
        accountInput.style.border = 'none';
        accountInput.style.borderRadius = '5px';
        accountInput.style.padding = '5px';
        accountInput.style.width = '100%';
        content.appendChild(accountInput);

        const addAccountBtn = document.createElement('button');
        addAccountBtn.style.backgroundColor = '#4a4a4a';
        addAccountBtn.style.color = '#fff';
        addAccountBtn.style.border = 'none';
        addAccountBtn.style.borderRadius = '5px';
        addAccountBtn.style.padding = '10px 20px';
        addAccountBtn.style.cursor = 'pointer';
        addAccountBtn.textContent = 'Add Account';
        addAccountBtn.onclick = function() {
            const newAccount = accountInput.value.trim();
            if (newAccount) {
                accounts.push(newAccount);
                localStorage.setItem('accountTracker', JSON.stringify(accounts));
                updateAccountTracker();
            }
        };
        content.appendChild(addAccountBtn);
    }

    // Optional Account Tracker
    const accountTrackerBtn = document.createElement('div');
    accountTrackerBtn.style.width = '50px';
    accountTrackerBtn.style.height = '50px';
    accountTrackerBtn.style.marginBottom = '15px';
    accountTrackerBtn.style.background = 'url("data:image/png;base64,...") center/cover no-repeat';
    accountTrackerBtn.style.cursor = 'pointer';
    sidebar.appendChild(accountTrackerBtn);
    accountTrackerBtn.onclick = updateAccountTracker;

    // Status circle color change logic
    setInterval(() => {
        const statusCircle = document.getElementById('statusCircle');
        statusCircle.style.backgroundColor = isInjected ? 'green' : 'red';
    }, 1000);

})();
