// ==UserScript==
// @name         Krunker Infinite Kr (Visual Only)
// @namespace    https://discord.gg/4T6HGWTBd7
// @version      1.0
// @description   Infinite Kr
// @author       Jaguar
// @match        https://krunker.io/*
// @icon        https://media.discordapp.net/attachments/1139643669385846934/1140016348806778930/images.jpg?width=247&height=130
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472957/Krunker%20Infinite%20Kr%20%28Visual%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472957/Krunker%20Infinite%20Kr%20%28Visual%20Only%29.meta.js
// ==/UserScript==

// Discord- https://discord.gg/4T6HGWTBd7
// GitHub- https://github.com/Documantation12

const menuKRCountElement = document.getElementById('menuKRCount');
const hasLogin = localStorage.getItem('krunker_haslogin');
if (hasLogin === 'true') {
    if (menuKRCountElement) {
        let currentNumber = parseInt(menuKRCountElement.textContent) || 0;
        setInterval(() => {
            menuKRCountElement.innerHTML = `${(currentNumber += 100) || 0} <span style="color:#fbc02d">KR</span>`;
        }, 1);
    } else {
        console.log("Menu KR Count element not found.");
    }
} else {
    const userResponse = confirm("Please log in to see your KR count.\nPress OK to log in or Cancel to continue without logging in.");
    if (userResponse) {
        localStorage.setItem('krunker_haslogin', 'true');
    }
}
