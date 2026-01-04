// ==UserScript==
// @name         Drawaria Custom Options
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a mods menu with custom functionality to Drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497144/Drawaria%20Custom%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/497144/Drawaria%20Custom%20Options.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Function to hide the socbuttons element
function hideSocButtons() {
    var socButtons = document.getElementById('socbuttons');
    if (socButtons) {
        socButtons.style.display = 'none';
    }
}
// Función para ocultar y eliminar el botón de Discord
    function removeDiscordButton() {
        var discordButton = document.getElementById('discordprombox');
        if (discordButton) {
            // Oculta el botón de Discord
            discordButton.style.display = 'none';
            // Elimina el botón de Discord del DOM
            //discordButton.parentNode.removeChild(discordButton);
        }
    }

// Function to generate stars
function stars() {
    // Remove any existing stars container
    var existingStarsContainer = document.getElementById('starsContainer');
    if (existingStarsContainer) {
        existingStarsContainer.remove();
    }

    // Create a container for the stars
    var starsContainer = document.createElement('div');
    starsContainer.id = 'starsContainer';
    starsContainer.style.position = 'fixed';
    starsContainer.style.top = '0';
    starsContainer.style.left = '0';
    starsContainer.style.width = '100%';
    starsContainer.style.height = '100%';
    starsContainer.style.zIndex = '-1';
    starsContainer.style.background = 'black'; // Set the background to black
    document.body.appendChild(starsContainer);

    // Generate stars
    for (var i = 0; i < 500; i++) {
        var star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = 'white'; // Set the star color to white
        star.style.borderRadius = '50%';
        star.style.boxShadow = '0 0 10px white';
        star.style.top = Math.random() * document.body.clientHeight + 'px';
        star.style.left = Math.random() * document.body.clientWidth + 'px';
        starsContainer.appendChild(star);

        // Call the function to hide the socbuttons element
        hideSocButtons();
        // Add an event listener to reapply the styles when the window is resized
        window.addEventListener('resize', makeLoginboxBlack);
        // Call makeElementsBlack to make elements black while stars are being generated
        makeElementsBlack();
        makeLoginboxBlack();
        removeDiscordButton();
    }
}


// Function to make elements inside the loginbox black
function makeLoginboxBlack() {
    var loginbox = document.querySelector('.loginbox');
    if (loginbox) {
        var elements = loginbox.querySelectorAll('*');
        elements.forEach(function(element) {
            element.style.color = 'white';
            element.style.backgroundColor = 'black';
            element.style.borderColor = 'white';
            loginbox.style.borderRadius = '1px';
            loginbox.style.background = '#000000';

        });
    }
}

// Function to make elements inside the login-midcol div black, excluding loginbox
function makeElementsBlack() {
    var loginMidCol = document.getElementById('login-midcol');
    if (loginMidCol) {
        // Select only direct children of login-midcol
        var elements = loginMidCol.querySelectorAll('*');
        elements.forEach(function(element) {
            element.style.color = 'white';
            element.style.backgroundColor = 'black';
            element.style.borderColor = 'white';
            // Add more styles as needed
            loginMidCol.style.background = '#000000';
        });
    }
}

    // Create the options menu container
    var modsMenuContainer = document.createElement('div');
    modsMenuContainer.className = 'dropdown d-inline';
    modsMenuContainer.style.marginLeft = '10px'; // Add some space between the existing menu and the new one

    // Create the options menu button
    var modsMenuButton = document.createElement('button');
    modsMenuButton.className = 'btn btn-primary dropdown-toggle';
    modsMenuButton.type = 'button';
    modsMenuButton.id = 'modsMenuButton';
    modsMenuButton.textContent = 'Custom Options';
    modsMenuButton.setAttribute('data-toggle', 'dropdown');
    modsMenuButton.setAttribute('aria-haspopup', 'true');
    modsMenuButton.setAttribute('aria-expanded', 'false');

    // Create the options menu dropdown
    var modsMenuDropdown = document.createElement('div');
    modsMenuDropdown.className = 'dropdown-menu';
    modsMenuDropdown.setAttribute('aria-labelledby', 'modsMenuButton');

    // Create the options menu items
    var modsMenuItems = [
        { text: 'Stars Background', id: 'stars', action: stars },
        { text: 'Play Song', id: 'playSong', action: playSong },
        { text: 'Join Random Room', id: 'joinRandomRoom', action: joinRandomRoom },
        { text: 'Free Input Name', id: 'infiniteInputName', action: infiniteInputName },
        { text: 'Replace Logo', id: 'replaceLogo', action: replaceLogo }
    ];

    // Add the options menu items to the dropdown
    modsMenuItems.forEach(function(item) {
        var menuItem = document.createElement('a');
        menuItem.className = 'dropdown-item';
        menuItem.href = '#';
        menuItem.id = item.id;
        menuItem.textContent = item.text;
        menuItem.onclick = item.action;
        modsMenuDropdown.appendChild(menuItem);
    });

    // Append the button and dropdown to the container
    modsMenuContainer.appendChild(modsMenuButton);
    modsMenuContainer.appendChild(modsMenuDropdown);

    // Append the options menu to the existing loginbox
    var loginbox = document.querySelector('.loginbox');
    if (loginbox) {
        loginbox.appendChild(modsMenuContainer);
    } else {
        console.error('Loginbox not found. Could not add mods menu.');
        return;
    }

    // Function to play a song
    function playSong() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.mp3';
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (file) {
                var audio = new Audio(URL.createObjectURL(file));
                audio.loop = true;
                audio.play();
            }
        };
        input.click();
    }

    // Function to join a random room
    function joinRandomRoom() {
       // Find the "Quick Play" button
    var quickPlayButton = document.getElementById('quickplay');
    if (quickPlayButton) {
        // Simulate a click on the "Quick Play" button
        quickPlayButton.click();
    } else {
        console.error('Quick Play button not found. Could not join the main room.');
    }
}

    // Function to remove the maxlength attribute from the input name
    function infiniteInputName() {
        var playerNameInput = document.getElementById('playername');
        if (playerNameInput) {
            playerNameInput.removeAttribute('maxlength');
        }
    }

    // Function to replace the logo
    function replaceLogo() {
        var logoImage = document.querySelector('.img-fluid');
        if (logoImage) {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png, image/jpeg';
            input.onchange = function(e) {
                var file = e.target.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        logoImage.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        }
    }
})();