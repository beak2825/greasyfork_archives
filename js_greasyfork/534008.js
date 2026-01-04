// ==UserScript==
// @name         Custom ShellShock Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Custom theme for ShellShock.io with background and skybox fixes
// @author       Anonymous
// @match        *://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534008/Custom%20ShellShock%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/534008/Custom%20ShellShock%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ensure the custom background image is applied
    function setCustomBackground() {
        document.body.style.backgroundImage = "url('https://images.wallpapersden.com/image/download/obito-uchiha-cool-4k_bGllbm6UmZqaraWkpJRoa2lprWdlaW4.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
    }
    setCustomBackground();

    // Ensure the skybox is set to the base64 image
    function setSkybox() {
        const sky = document.querySelector('.skybox'); // Adjust the selector based on the game's DOM
        if (sky) {
            sky.style.backgroundImage = "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhISEhIVFRUWFRcVFRUVFRUVFRUVFRcYFhUVFRUYHSggGBolGxcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQFy0dHR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0rKy0tLS0tLS0tNi0tLSstK//AABEIALEBHAMBIgACEQEDEQH/xAAbAAADAQEBAQEAAAAAAAAAAAADBAUCAQAGB//EADUQAAIBAgMFCAEEAgEFAAAAAAABAgMRBCExBUFRcYESIjJhkbHB8KETQtHhI3IzFFJigsL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAhEQACAgMAAwADAQAAAAAAAAAAAQIRAyExEjJBBCJhQv/aAAwDAQACEQMRAD8A/...')";
            sky.style.backgroundSize = "cover";
            sky.style.backgroundRepeat = "no-repeat";
            sky.style.backgroundAttachment = "fixed";
        }
    }
    setSkybox();

    // Observer to apply the skybox fix whenever the skybox is re-rendered
    new MutationObserver(setSkybox).observe(document.body, { childList: true, subtree: true });

    // Modify the kill message
    const originalFunction = window.someKillFunction; // Replace `someKillFunction` with the actual function name that handles kill messages
    window.someKillFunction = function(killer, victim) {
        const message = `${killer} obliterated ${victim}`;
        originalFunction.call(this, killer, victim, message);
    };

    // Ensure scope colors are set for specific weapons
    const customScopeColor = "#880808";
    const css = `
        .scope-crackshot { border-color: ${customScopeColor} !important; }
        .scope-rpegg { border-color: ${customScopeColor} !important; }
        .scope-free-ranger { border-color: ${customScopeColor} !important; }
    `;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();