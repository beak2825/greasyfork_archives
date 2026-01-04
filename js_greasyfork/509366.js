// ==UserScript==
// @name         Cookie Clicker Editor
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  A draggable, resizable menu with smooth transitions, themes, and more buttons. Includes a minimize button to hide/show the menu. For Cookie Clicker
// @author       Imnotwraith
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509366/Cookie%20Clicker%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/509366/Cookie%20Clicker%20Editor.meta.js
// ==/UserScript==




(function() {
    'use strict';

    // Add the menu HTML to the page
    const menuHTML = `
    <div id="customMenu" style="display: none; position: fixed; top: 50px; left: 50px; width: 400px; height: auto; min-height: 400px; background-color: rgba(0, 0, 0, 0.8); border: 1px solid #444; z-index: 9999; resize: both; overflow: hidden; opacity: 0; transition: opacity 0.5s ease, visibility 0.5s ease;">
        <div id="menuHeader" style="background-color: #555; padding: 10px; cursor: move; text-align: center;">
            <span style="font-weight: bold; color: white;">Imnotwraith Developer Tool</span>
            <button id="minimizeMenu" style="float: right; color: white; background-color: orange; border: none; margin-left: 5px;">_</button>
            <button id="closeMenu" style="float: right; color: white; background-color: red; border: none;">X</button>
        </div>
        <div id="menuTabs" style="text-align: center; margin: 10px 0;">
            <button id="tabMain" style="background-color: #ccc; color: black; border: 1px solid #888; padding: 10px 15px; margin-right: 5px; cursor: pointer;">Main</button>
            <button id="tabAbout" style="background-color: #ccc; color: black; border: 1px solid #888; padding: 10px 15px; margin-right: 5px; cursor: pointer;">About</button>
            <button id="tabThemes" style="background-color: #ccc; color: black; border: 1px solid #888; padding: 10px 15px; cursor: pointer;">Themes</button>
        </div>
        <div id="tabContentMain" style="display: none; padding: 20px; text-align: center;">
            <div id="buttonContainer" style="display: flex; flex-wrap: wrap; justify-content: center;">
                <button class="toggleButton" id="loopMoneyButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Loop Money</button>
                <button class="toggleButton" id="button2" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Save Game</button>
                <button class="toggleButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Button 3</button>
                <button class="toggleButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Button 4</button>
                <button class="toggleButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Button 5</button>
                <button class="toggleButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Button 6</button>
                <button class="toggleButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Button 7</button>
                <button class="toggleButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Button 8</button>
                <button class="toggleButton" style="background-color: #777; color: white; border: none; padding: 10px; margin: 10px; cursor: pointer;">Button 9</button>
            </div>
        </div>
        <div id="tabContentAbout" style="display: none; padding: 20px; text-align: center;">
            <h2 style="color: white;">About This Menu</h2>
            <p style="color: white;">This is a customizable draggable and resizable menu.</p>
        </div>
        <div id="tabContentThemes" style="display: none; padding: 20px; text-align: center;">
            <h3 style="color: white;">Choose Your Colors</h3>
            <label style="color: white;">Menu Background Color:</label>
            <input type="color" id="menuBgColor" value="#000000" style="margin: 5px;">
            <br>
            <label style="color: white;">Text Color:</label>
            <input type="color" id="textColor" value="#ffffff" style="margin: 5px;">
            <br>
            <button id="applyTheme" style="background-color: #777; color: white; border: none; padding: 10px 20px; margin-top: 10px; cursor: pointer;">Apply Theme</button>
        </div>
    </div>
    <div id="toggleButton" style="display: none; position: fixed; bottom: 20px; left: 20px; width: 50px; height: 50px; background-color: rgba(255, 0, 0, 0.8); color: white; border: none; border-radius: 50%; text-align: center; line-height: 50px; cursor: pointer; z-index: 10000;">+</div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHTML);

    const menu = document.getElementById('customMenu');
    const toggleButton = document.getElementById('toggleButton');
    const menuHeader = document.getElementById('menuHeader');
    const closeMenu = document.getElementById('closeMenu');
    const minimizeMenu = document.getElementById('minimizeMenu');
    const tabMain = document.getElementById('tabMain');
    const tabAbout = document.getElementById('tabAbout');
    const tabThemes = document.getElementById('tabThemes');
    const tabContentMain = document.getElementById('tabContentMain');
    const tabContentAbout = document.getElementById('tabContentAbout');
    const tabContentThemes = document.getElementById('tabContentThemes');
    const menuBgColorInput = document.getElementById('menuBgColor');
    const textColorInput = document.getElementById('textColor');
    const applyThemeButton = document.getElementById('applyTheme');
    const loopMoneyButton = document.getElementById('loopMoneyButton');
    const button2 = document.getElementById('button2');

    let isHidden = true;
    let loopMoneyInterval;

    // Show menu smoothly
    const showMenuSmoothly = () => {
        menu.style.display = 'block'; // Make sure it's set to block first
        menu.style.opacity = '0';
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.top = `${(window.innerHeight - menu.clientHeight) / 2}px`;
            menu.style.left = `${(window.innerWidth - menu.clientWidth) / 2}px`;
        }, 10); // Allow display change to take effect
    };

    // Hide menu smoothly
    const hideMenuSmoothly = () => {
        menu.style.opacity = '0';
        setTimeout(() => {
            menu.style.visibility = 'hidden';
            menu.style.display = 'none'; // Set display to none after opacity transition
        }, 500); // matches the transition time
        toggleButton.style.display = 'block'; // Show the toggle button
    };

    // Minimize menu
    minimizeMenu.addEventListener('click', () => {
        hideMenuSmoothly();
        isHidden = true;
        clearInterval(loopMoneyInterval); // Stop the loop if menu is minimized
    });

    // Close menu on 'X' button click
    closeMenu.addEventListener('click', () => {
        menu.style.display = 'none'; // Set display to none immediately
        toggleButton.style.display = 'block'; // Show the toggle button
        clearInterval(loopMoneyInterval); // Stop the loop if menu is closed
    });

    // Show menu on toggle button click
    toggleButton.addEventListener('click', () => {
        showMenuSmoothly();
        isHidden = false;
        toggleButton.style.display = 'none'; // Hide the toggle button when menu is shown
    });

    // Tab switching functionality
    const switchTab = (mainDisplay, aboutDisplay, themesDisplay) => {
        tabContentMain.style.display = mainDisplay;
        tabContentAbout.style.display = aboutDisplay;
        tabContentThemes.style.display = themesDisplay;
    };

    tabMain.addEventListener('click', () => switchTab('block', 'none', 'none'));
    tabAbout.addEventListener('click', () => switchTab('none', 'block', 'none'));
    tabThemes.addEventListener('click', () => switchTab('none', 'none', 'block'));

    // Show Main tab by default
    tabMain.click();

    // Initial setup
    setTimeout(() => {
        showMenuSmoothly();
        isHidden = false; // Menu is now visible
    }, 100);

    // Apply theme colors
    applyThemeButton.addEventListener('click', () => {
        const menuBgColor = menuBgColorInput.value;
        const textColor = textColorInput.value;

        menu.style.backgroundColor = menuBgColor;
        menuHeader.style.color = textColor;
        tabMain.style.color = textColor;
        tabAbout.style.color = textColor;
        tabThemes.style.color = textColor;
        tabContentMain.style.color = textColor;
        tabContentAbout.style.color = textColor;
        tabContentThemes.style.color = textColor;

        // Adjust button colors
        const buttons = document.querySelectorAll('#buttonContainer button');
        buttons.forEach(button => {
            button.style.backgroundColor = textColor;
        });
    });

    // Loop Money functionality
    loopMoneyButton.addEventListener('click', () => {
        loopMoneyButton.classList.toggle('active');
        loopMoneyButton.style.backgroundColor = loopMoneyButton.classList.contains('active') ? '#4caf50' : '#777';

        if (loopMoneyButton.classList.contains('active')) {
            loopMoneyInterval = setInterval(() => {
                Game.Earn(1000); // Adjust this line as needed
            }, 1); // Adjust interval as necessary
        } else {
            clearInterval(loopMoneyInterval);
        }
    });

    // Button 2 functionality
    button2.addEventListener('click', () => {
        Game.Tosave = true;
        //alert('Game.Tosave is set to true'); // Optional alert for feedback
    });

    // Draggable functionality
    let isDragging = false;
    let offsetX, offsetY;

    menuHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        menuHeader.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        menuHeader.style.cursor = 'move';
    });
})();
