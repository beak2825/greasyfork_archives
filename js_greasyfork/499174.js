// ==UserScript==
// @name         Neopets: The Void Within - Quick access
// @name:es      Neopets: The Void Within - Acceso rápido
// @namespace    Nyu@Clraik
// @version      1.1
// @description  Have an easy access to TVW plot main page
// @description:es  Accede de forma rápida al plot TVW
// @author       Nyu
// @exclude      *://*.neopets.com/tvw/*
// @match        *://*.neopets.com/*
// @icon         https://images.neopets.com/homepage/marquee/icons/TVW_event_icon.png
// @downloadURL https://update.greasyfork.org/scripts/499174/Neopets%3A%20The%20Void%20Within%20-%20Quick%20access.user.js
// @updateURL https://update.greasyfork.org/scripts/499174/Neopets%3A%20The%20Void%20Within%20-%20Quick%20access.meta.js
// ==/UserScript==


if (window.top === window.self) {
    const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })

    const divElement = document.createElement('div')
    divElement.classList.add('tvwQA')
    divElement.onclick = function() {
        localStorage.setItem('TVWQAclickedToday', today)
        location.href="https://www.neopets.com/track.php?id=2613"
    }

    const styleElement = document.createElement('style')
    styleElement.textContent = `
.tvwQA {
    width: 100px;
    height: 100px;
    background-size: 100%;
    cursor: pointer;
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 100;
    background-image: url('https://images.neopets.com/homepage/marquee/icons/TVW_event_icon.png');
}
.tvwQA:hover {
    transform: scale(1.1);
}
`
    const clickedToday = localStorage.getItem('TVWQAclickedToday')

    if (!clickedToday || clickedToday !== today) {
        const img = document.createElement('img')
        img.src = "https://images.neopets.com/plots/tvw/header/images/notif-icon.png"
        img.width = 30
        img.style.float = 'inline-start'
        divElement.prepend(img)
    }

    document.body.appendChild(divElement)
    document.head.appendChild(styleElement)
}
