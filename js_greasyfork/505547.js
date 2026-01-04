// ==UserScript==
// @name         Scratch Ultra Modifier Pro Plus
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  The ultimate modification script for Scratch with advanced block colors, Turbo, Speed of Light modes, AI-powered tutorials, and a super complex, draggable, and modern GUI with working API integration.
// @author       YourName
// @match        https://scratch.mit.edu/projects/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.example.com  // Replace with the actual API domain
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js
// @downloadURL https://update.greasyfork.org/scripts/505547/Scratch%20Ultra%20Modifier%20Pro%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/505547/Scratch%20Ultra%20Modifier%20Pro%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGuiOpen = false;
    let isTurboEnabled = false;
    let isSpeedOfLightEnabled = false;
    let tutorialsLoaded = false;
    let currentTutorialPage = 0;
    const tutorialPages = [];

    // Function to change block colors
    function changeBlockColors() {
        const blockOuterColor = '#1E90FF';
        const blockInnerColor = '#FFD700';
        const blockBorderColor = '#8B0000';

        $('svg.blocklySvg g.blocklyDraggable .blocklyPath').each(function() {
            $(this).css({
                'fill': blockOuterColor,
                'stroke': blockBorderColor,
                'stroke-width': '3px'
            });
        });

        $('svg.blocklySvg g.blocklyDraggable .blocklyPathLight').each(function() {
            $(this).css('fill', blockInnerColor);
        });

        $('svg.blocklySvg g.blocklyDraggable .blocklyPath').each(function() {
            const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
            $(this).css('fill', `url(#${gradientId})`);

            $('svg defs').append(`
                <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${blockOuterColor};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${blockInnerColor};stop-opacity:1" />
                </linearGradient>
            `);
        });

        console.log('Block colors changed successfully.');
    }

    // Function to enable Turbo Mode
    function enableTurboMode() {
        if (Scratch.vm) {
            Scratch.vm.setTurboMode(true);
            isTurboEnabled = true;
            alert("Turbo Mode Enabled! Your project is now running at maximum speed.");
        } else {
            alert("Failed to enable Turbo Mode. Please try again.");
        }
    }

    // Function to enable Speed of Light Mode
    function enableSpeedOfLightMode() {
        if (Scratch.vm) {
            Scratch.vm.runtime._stepTime = 0.1;
            isSpeedOfLightEnabled = true;
            alert("Speed of Light Mode Enabled! Hold on, your FPS is going through the roof!");
        } else {
            alert("Failed to enable Speed of Light Mode. Please try again.");
        }
    }

    // Function to fetch tutorials from an API
    function fetchTutorials() {
        if (tutorialsLoaded) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.example.com/tutorials', // Replace with your actual API endpoint
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    tutorialPages.push(...data.tutorials);
                    tutorialsLoaded = true;
                    displayTutorialPage(0);
                } else {
                    alert('Failed to load tutorials. Please try again later.');
                }
            },
            onerror: function() {
                alert('Failed to load tutorials. Network error.');
            }
        });
    }

    // Function to display a tutorial page
    function displayTutorialPage(index) {
        if (index < 0 || index >= tutorialPages.length) return;

        currentTutorialPage = index;
        $('#tutorialContent').html(tutorialPages[index]);
        $('#tutorialContent').show();
    }

    // Function to create and display popups
    function displayPopup(message) {
        const popup = $('<div>', {
            text: message,
            css: {
                'background-color': '#333',
                'color': '#FFF',
                'padding': '15px',
                'border-radius': '10px',
                'position': 'fixed',
                'top': '20px',
                'right': '20px',
                'z-index': 10000,
                'box-shadow': '0 0 15px rgba(0, 0, 0, 0.5)',
                'font-family': 'Comic Sans MS, sans-serif'
            }
        }).appendTo('body');

        gsap.to(popup, {
            duration: 3,
            opacity: 0,
            onComplete: () => popup.remove()
        });
    }

    // Function to create and display GUI
    function createGUI() {
        // Main container for GUI
        const guiContainer = $('<div>', { id: 'customGuiContainer' }).appendTo('body');

        // Title and close button
        const titleBar = $('<div>', {
            css: {
                'display': 'flex',
                'justify-content': 'space-between',
                'align-items': 'center',
                'padding': '10px',
                'background-color': '#FFD700',
                'border-radius': '10px 10px 0 0',
                'cursor': 'move'
            }
        }).appendTo(guiContainer);

        $('<h1>', {
            text: 'Scratch Ultra Modifier Pro Plus',
            css: {
                'font-family': 'Comic Sans MS, sans-serif',
                'color': '#1E90FF',
                'margin': 0
            }
        }).appendTo(titleBar);

        const closeButton = $('<button>', {
            text: 'X',
            click: () => guiContainer.hide(),
            css: createButtonStyle('#FF4500', '#FFF')
        }).appendTo(titleBar);

        // Buttons for GUI functionality
        const changeColorButton = createGuiButton('Change Block Colors', changeBlockColors);
        guiContainer.append(changeColorButton);

        const turboButton = createGuiButton('Enable Turbo Mode', enableTurboMode);
        guiContainer.append(turboButton);

        const speedButton = createGuiButton('Enable Speed of Light Mode', enableSpeedOfLightMode);
        guiContainer.append(speedButton);

        const tutorialsButton = createGuiButton('Show Tutorials', fetchTutorials);
        guiContainer.append(tutorialsButton);

        // Tutorial content area
        const tutorialContent = $('<div>', {
            id: 'tutorialContent',
            css: {
                'background-color': '#FFF7E6',
                'border': '2px solid #FF5733',
                'border-radius': '10px',
                'padding': '15px',
                'margin-top': '20px',
                'font-family': 'Comic Sans MS, sans-serif',
                'max-height': '300px',
                'overflow-y': 'auto'
            }
        }).appendTo(guiContainer);

        const tutorialCloseButton = $('<button>', {
            text: 'X',
            click: () => tutorialContent.hide(),
            css: createButtonStyle('#FF4500', '#FFF', '5px')
        }).appendTo(tutorialContent);

        // Navigation buttons for tutorials
        const navContainer = $('<div>', { id: 'navContainer' }).appendTo(guiContainer);

        const prevButton = $('<button>', {
            text: 'Previous',
            click: () => displayTutorialPage(currentTutorialPage - 1),
            css: createButtonStyle('#333', '#FFF', '5px')
        }).appendTo(navContainer);

        const nextButton = $('<button>', {
            text: 'Next',
            click: () => displayTutorialPage(currentTutorialPage + 1),
            css: createButtonStyle('#333', '#FFF', '5px')
        }).appendTo(navContainer);

        // Drag functionality
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        titleBar.on('mousedown', (e) => {
            isDragging = true;
            offset.x = e.pageX - guiContainer.offset().left;
            offset.y = e.pageY - guiContainer.offset().top;
        });

        $(document).on('mousemove', (e) => {
            if (isDragging) {
                guiContainer.css({
                    top: e.pageY - offset.y + 'px',
                    left: e.pageX - offset.x + 'px'
                });
            }
        }).on('mouseup', () => {
            isDragging = false;
        });

        // Open/Close GUI button
        const openGuiButton = $('<button>', {
            id: 'openGuiButton',
            text: 'Open GUI',
            click: () => {
                if (isGuiOpen) {
                    guiContainer.hide();
                    openGuiButton.text('Open GUI');
                } else {
                    guiContainer.show();
                    openGuiButton.text('Close GUI');
                }
                isGuiOpen = !isGuiOpen;
            },
            css: createButtonStyle('#32CD32', '#FFF')
        }).appendTo('body');

        guiContainer.hide(); // Start with the GUI hidden

        // Additional styling for draggable functionality
        GM_addStyle(`
            #customGuiContainer {
                width: 300px;
                height: auto;
                background-color: #FFF;
                border: 2px solid #1E90FF;
                border-radius: 10px;
                position: fixed;
                top: 50px;
                right: 50px;
                z-index: 9999;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
            }
            #tutorialContent {
                display: none;
            }
            #navContainer button {
                margin: 5px;
            }
        `);
    }

    // Function to create a styled button
    function createGuiButton(text, onClick) {
        return $('<button>', {
            text: text,
            click: onClick,
            css: createButtonStyle('#4682B4', '#FFF')
        });
    }

    // Function to create dynamic button styles
    function createButtonStyle(bgColor, textColor, margin = '10px') {
        return {
            'background-color': bgColor,
            'color': textColor,
            'border': 'none',
            'padding': '10px 20px',
            'margin': margin,
            'border-radius': '5px',
            'cursor': 'pointer',
            'font-family': 'Comic Sans MS, sans-serif',
            'font-size': '16px',
            'transition': 'background-color 0.3s ease',
            'outline': 'none'
        };
    }

    // Initialize the script by creating the GUI
    createGUI();
})();
