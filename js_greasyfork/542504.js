// ==UserScript==
// @name         Blookedex Integration (Original Style)
// @namespace    http://tampermonkey.net/
// @version      2025-05-23
// @description  An efficient theme selector with blookedex integrations (maintains original profile style)
// @author       fsscooter
// @match        *://tri.pengpowers.xyz/*
// @match        *://coplic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blooket.com
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542504/Blookedex%20Integration%20%28Original%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542504/Blookedex%20Integration%20%28Original%20Style%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const version = "2025-05-23";

    // Cookie management functions
    function setCookie(e,t,o){let i=new Date;i.setTime(i.getTime()+864e5*o);let n="expires="+i.toUTCString();document.cookie=`${e}=${encodeURIComponent(t)}; ${n}; path=/; secure; samesite=Lax`}
    function getCookie(e){let t=e+"=",o=decodeURIComponent(document.cookie),i=o.split(";");for(let n of i){for(;" "===n.charAt(0);)n=n.substring(1);if(0===n.indexOf(t))return n.substring(t.length,n.length)}return null}
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    const themes = [
        { name: "blooket", primary: "#9A48AA", secondary: "#08C2D0", background: "#08C2D0",
          scrollbar: { track: "#083a3d", thumb: "#0b7075", hover: "#10a5ac" } },
        { name: "sunset", primary: "#E44C51", secondary: "#FFA41B", background: ["#5d87e3", "#ff3b8c"],
          scrollbar: { track: "#3a1a1c", thumb: "#7a3639", hover: "#b84d51" } },
        { name: "forest", primary: "#2E8B57", secondary: "#A3C586", background: ["#1B512D", "#A4DE02"],
          scrollbar: { track: "#183a06", thumb: "#2a630c", hover: "#4e9329" } },
        { name: "ocean", primary: "#0077B6", secondary: "#90E0EF", background: ["#00B4D8", "#03045E"],
          scrollbar: { track: "#002b3d", thumb: "#005073", hover: "#0077b6" } },
        { name: "midnight", primary: "#1C1C2E", secondary: "#3E3E55", background: ["#3A3A7C", "#0F0F2D"],
          scrollbar: { track: "#0a0a14", thumb: "#1c1c2e", hover: "#3e3e55" } },
        { name: "sunrise", primary: "#FFA07A", secondary: "#FFD700", background: ["#FFDEE9", "#B5FFFC"],
          scrollbar: { track: "#3a1a0c", thumb: "#7a3419", hover: "#b84d26" } },
        { name: "aurora", primary: "#7F00FF", secondary: "#00FF87", background: ["#00FFC3", "#3E1E68"],
          scrollbar: { track: "#1a003d", thumb: "#3d007a", hover: "#7f00ff" } },
        { name: "space", primary: "#4B0082", secondary: "#9370DB", background: ["#1F2833", "#0B0C10"],
          scrollbar: { track: "#0a0a14", thumb: "#1c1c2e", hover: "#3e3e55" } },
        { name: "peach", primary: "#FFADAD", secondary: "#FFD6A5", background: ["#FFEACD", "#FFDAC1"],
          scrollbar: { track: "#3a1a1c", thumb: "#7a3639", hover: "#b84d51" } },
        { name: "ice", primary: "#A0E9FD", secondary: "#CAF0F8", background: ["#B2EBF2", "#E0F7FA"],
          scrollbar: { track: "#083a3d", thumb: "#0b7075", hover: "#10a5ac" } },
        { name: "coral", primary: "#148cdf", secondary: "#ee7de9", background: ["#ef1284", "#00b898"],
          scrollbar: { track: "#1a003d", thumb: "#3d007a", hover: "#7f00ff" } },
        { name: "charcoal", primary: "#111a24", secondary: "#f8ee00", background: ["#aba400", "#1f3042"],
          scrollbar: { track: "#0a0a14", thumb: "#1c1c2e", hover: "#3e3e55" } },
        { name: "cotton candy", primary: "#ffcbcb", secondary: "#c9fdff", background: ["#9db1ea", "#e47e98"],
          scrollbar: { track: "#1a003d", thumb: "#3d007a", hover: "#7f00ff" } },
        { name: "minecraft", primary: "#61371f", secondary: "#70b237", background: ["#3c44aa", "#3ab3da"],
          customShopkeeper: ["https://hollowvr.github.io/onlineassets/steveblooket.png", "1"],
          customStore: "https://hollowvr.github.io/onlineassets/mcstoreblooket.svg",
          scrollbar: { track: "#1a2b06", thumb: "#2a630c", hover: "#4e9329" } },
        { name: "easter", primary: "#F8DC8A", secondary: "#F4A8CF", background: ["#B6E7B9", "#93DE8B"],
          scrollbar: { track: "#1a2b06", thumb: "#2a630c", hover: "#4e9329" } },
        { name: "halloween", primary: "#F86D01", secondary: "#18e810", background: ["#A805F7", "#DA03F6"],
          customShopkeeper: ["https://hollowvr.github.io/onlineassets/jackolanternblooket.png","1.3"],
          scrollbar: { track: "#3a1a0c", thumb: "#7a3419", hover: "#b84d26" } },
        { name: "usa", primary: "#424173", secondary: "#B52A3A", background: "repeating-linear-gradient(-5deg,#dbdbdb,#dbdbdb 60px,#B52A3A 60px,#B52A3A 120px);",
          customShopkeeper: ["https://upload.wikimedia.org/wikipedia/commons/5/5a/Donald_Trump_cutout.png", "1.5"],
          customStore: "https://hollowvr.github.io/onlineassets/usastoreblooket.svg",
          scrollbar: { track: "#1a003d", thumb: "#3d007a", hover: "#7f00ff" } },
        { name: "summer", primary: "#72D6E4", secondary: "#D8A93F", background: ["#89CDDA", "#FBDCA5"],
          scrollbar: { track: "#083a3d", thumb: "#0b7075", hover: "#10a5ac" } },
        { name: "autumn", primary: "#C16A19", secondary: "#DFA628", background: ["#AD3B2D", "#D8284D"],
          scrollbar: { track: "#3a1a0c", thumb: "#7a3419", hover: "#b84d26" } },
        { name: "winter", primary: "#96CEFE", secondary: "#6C80BE", background: ["#A4F4FF", "#75A5C3"],
          scrollbar: { track: "#002b3d", thumb: "#005073", hover: "#0077b6" } },
        { name: "christmas", primary: "#C9001C", secondary: "#1FB34F", background: "radial-gradient(ellipse at bottom, #4e9a51 0%, #3d7b42 40%, #2f5e34 100%);",
          customShopkeeper: ["https://ac.blooket.com/marketassets/blooks/santaclaus.svg", "1"],
          customStore: "https://ac.blooket.com/dashclassic/assets/StoreWinter-DOhqNDCZ.svg",
          scrollbar: { track: "#1a2b06", thumb: "#2a630c", hover: "#4e9329" } },
        { name: "mardi gras", primary: "#A016FC", secondary: "#27DA3B", background: "linear-gradient(45deg,rgba(47, 163, 75, 1) 0%, rgba(140, 71, 151, 1) 50%, rgba(255, 204, 40, 1) 100%);",
          scrollbar: { track: "#1a003d", thumb: "#3d007a", hover: "#7f00ff" } },
        { name: "haze", primary: "#4e4c29", customSidebar: "linear-gradient(to right, rgba(0,0,0,0) 40%, #4287f566 130%),repeating-linear-gradient(135deg,#535b1f 0%, rgba(83,91,31,0.8) 40%, #4b462c 70%, rgba(75,70,44,0.8) 100%)",
          secondary: "#f8de99", background: ["#fdbb35", "#ad1f25"],
          scrollbar: { track: "#3a1a0c", thumb: "#7a3419", hover: "#b84d26" } },
        { name: "midnight flare", primary: "rgba(0, 20, 80, 0.8)", secondary: "#6c757d",
          background: ["#1a2b99", "#141414"],
          scrollbar: { track: "#0a0a14", thumb: "#1c1c2e", hover: "#3e3e55" } },
        { name: "twilight", primary: "rgba(38, 50, 56, 0.8)", secondary: "#b0bec5", background: ["#1a2327", "#37474f"],
          scrollbar: { track: "#0a0a14", thumb: "#1c1c2e", hover: "#3e3e55" } },
        { name: "blood moon", primary: "rgba(102, 0, 0, 0.8)", secondary: "#2f2f2f", background: ["#3e1414", "#000000"],
          scrollbar: { track: "#0a0a14", thumb: "#1c1c2e", hover: "#3e3e55" } },
        { name: "kraken", primary: "rgba(0, 51, 102, 0.8)", secondary: "#1abc9c", background: "linear-gradient(to bottom, #7db9e8 -5%, #005073 10%, #003e58 25%, #002a3d 55%, #000022 80%)",
          customShopkeeper: ["https://ac.blooket.com/marketassets/blooks/kraken.svg","1"],
          scrollbar: { track: "#002b3d", thumb: "#005073", hover: "#0077b6" } },
        { name: "pittsburgh", primary: "#000000", secondary: "#E0B800", background: ["#FFD700 0%", "#D4AF37 40%", "#B8860B 80%", "#2F1C00 100%"],
          scrollbar: { track: "#0a0a14", thumb: "#1c1c2e", hover: "#3e3e55" } },
        { name: "USSR", primary: "#C60300", secondary: "#F9D700", background: "radial-gradient(#ff0000, #a60000)",
          customShopkeeper: ["https://hollowvr.github.io/onlineassets/karlmarxblooket.png", "1.7"],
          customStore: "https://hollowvr.github.io/onlineassets/ussrstoreblooket.png",
          scrollbar: { track: "#3a1a0c", thumb: "#7a3419", hover: "#b84d26" } }
    ];

    if (getCookie("blxdextheme") == null) {
        setCookie("blxdextheme", "5") // Default to sunrise theme
    }
    const theme = Number(getCookie("blxdextheme"))
    let background = "#fff"
    if (Array.isArray(themes[theme].background)) {
        background = 'linear-gradient('+themes[theme].background[0]+', '+themes[theme].background[1]+')';
    } else {
        background = themes[theme].background;
    }

    console.log("Blookedex extension initialized");

    // Add styles
    const style = document.createElement('style');
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

    .blookedex-btnClose {
        transition:all .2s ease;
    }

    .blookedex-btnCloseGrandparent:hover .blookedex-btnClose {
        fill:#fff;
    }
    @keyframes blookedex-packImgKeyframes {
        from {transform:translateY(-50%) rotateY(90deg) scale(.1)}
        to {transform:translateY(-50%) rotateY(20deg) scale(1)}
    }
    .blookedex-packImg {
        animation: .5s cubic-bezier(.08,.54,.55,1.07) blookedex-packImgKeyframes;
    }
    .blookedex-buyBtn {
        transition: filter .25s;
    }
    .blookedex-buyBtn:hover {
        filter:brightness(110%);
    }
    .blookedex-buyBtn:hover > :first-child {
        transform:translateY(-2px);
    }
    .blookedex-buyBtn:hover > :nth-child(3) {
        transform:translateY(2px);
    }

    /* Custom styles for your page */
    .styles__background___2J-JA-camelCase {
        background: ${background} !important;
    }

    .styles__sidebar___1XqWi-camelCase {
        background-color: ${themes[theme].primary} !important;
    }

    /* Original profile container styling */
    .styles__profileContainer___CSuIE-camelCase {
        background-color: ${themes[theme].primary} !important;
    }

    .styles__pageButton___1wFuu-camelCase {
        color: white !important;
    }

    .styles__pageButton___1wFuu-camelCase:hover {
        background-color: ${themes[theme].secondary} !important;
    }

    .styles__header___153FZ-camelCase {
        color: ${themes[theme].secondary} !important;
        text-shadow: 2px 2px 0 rgba(0,0,0,0.2) !important;
    }

    /* Scrollbar styles */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: ${themes[theme].scrollbar.track};
    }

    ::-webkit-scrollbar-thumb {
        background: ${themes[theme].scrollbar.thumb};
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${themes[theme].scrollbar.hover};
    }

    /* Blookedex page styles */
    .blookedex-page {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .blookedex-theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        width: 100%;
        max-width: 800px;
    }

    .blookedex-theme-card {
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        transition: transform 0.2s;
        color: white;
        text-align: center;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .blookedex-theme-card:hover {
        transform: scale(1.03);
    }

    .blookedex-section {
        position: relative;
        background-color: rgba(239, 239, 239, 0.133);
        backdrop-filter: blur(10px);
        border: 1px solid rgb(108, 117, 125);
        border-radius: 20px;
        width: 50rem;
        padding: 20px;
    }

    .blookedex-title {
        font-family: Titan One;
        font-size: 44px;
        font-weight: 700;
        margin: 15px 5% 10px;
        color: #efefef;
        text-shadow: 0 0 10px rgba(0,0,0,0.2);
    }

    .blookedex-default-btn {
        background: ${themes[theme].secondary};
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 1.2em;
        cursor: pointer;
        transition: filter 0.2s;
        margin-top: 10px;
        font-family: 'Nunito', sans-serif;
        font-weight: 700;
    }

    .blookedex-default-btn:hover {
        filter: brightness(1.1);
    }
    `;
    document.head.appendChild(style);

    // Apply theme to specific elements
    const applyTheme = () => {
        // Apply to background
        const bgElement = document.querySelector('.styles__background___2J-JA-camelCase');
        if (bgElement) {
            bgElement.style.background = background;
        }

        // Apply to sidebar (solid color, not gradient)
        const sidebar = document.querySelector('.styles__sidebar___1XqWi-camelCase');
        if (sidebar) {
            sidebar.style.background = Array.isArray(themes[theme].primary) ? themes[theme].primary[0] : themes[theme].primary;
            sidebar.style.backgroundImage = 'none';
        }

        // Apply to cashier if theme has custom shopkeeper
        if (themes[theme].customShopkeeper) {
            const cashier = document.getElementById('phill');
            if (cashier) {
                cashier.src = themes[theme].customShopkeeper[0];
                cashier.style.transform = `rotate(10deg) scale(${themes[theme].customShopkeeper[1]})`;
            }
        }

        // Apply to store if theme has custom store
        if (themes[theme].customStore) {
            const store = document.getElementById('market');
            if (store) {
                store.src = themes[theme].customStore;
                store.style.filter = "drop-shadow(0 0 5px #0004)";
            }
        }

        // Add Blookedex tab to sidebar
        insertTab();
    };

    const insertTab = () => {
        const sidebar = document.querySelector('.styles__sidebar___1XqWi-camelCase');
        if (!sidebar || sidebar.dataset.injected === "true") return;

        // Clone an existing tab
        const existingTab = document.querySelector('.styles__pageButton___1wFuu-camelCase');
        if (!existingTab) return;

        const newTab = existingTab.cloneNode(true);
        newTab.href = "/stats?blookedex=true";
        newTab.querySelector('.styles__pageIcon___3OSy9-camelCase').className = "styles__pageIcon___3OSy9-camelCase fas fa-adjust";
        newTab.querySelector('.styles__pageText___1eo7q-camelCase').textContent = "Blookedex";

        // Insert before the bottom row
        const bottomRow = document.querySelector('.styles__bottomRow___3OozA-camelCase');
        if (bottomRow) {
            sidebar.insertBefore(newTab, bottomRow);
            sidebar.dataset.injected = "true";
        }
    };

    const createBlookedexPage = () => {
        // Hide existing content
        const profileBody = document.querySelector('.arts__profileBody___eNPbH-camelCase');
        if (profileBody) profileBody.style.display = "none";

        // Create new page container
        const page = document.createElement('div');
        page.className = "blookedex-page";

        // Add background
        page.innerHTML = `
    <div class="styles__background___2J-JA-camelCase">
        <div class="styles__blooksBackground___3oQ7Y-camelCase"
             style="background-image: url(&quot;/media/misc/background.png&quot;);
                    animation: animatedBackground 9s linear infinite;
                    -moz-animation: animatedBackground 9s linear infinite;
                    -webkit-animation: animatedBackground 9s linear infinite;
                    -ms-animation: animatedBackground 9s linear infinite;
                    -o-animation: animatedBackground 9s linear infinite;
        ">
        </div>
    </div>
`;


        // Add version section
        const versionSection = document.createElement('div');
        versionSection.className = "blookedex-section";
        versionSection.innerHTML = `
            <div class="blookedex-title">Version Info</div>
            <div style="font-size: 2em;">Current Version: ${version}</div>
            <a href="https://greasyfork.org/en/scripts/536421-blookedex-integration" style="font-size: 2em;">Check Updates</a>
        `;
        page.appendChild(versionSection);

        // Add theme selection section
        const themeSection = document.createElement('div');
        themeSection.className = "blookedex-section";
        themeSection.innerHTML = `<div class="blookedex-title">Select a Theme</div>`;

        const themesContainer = document.createElement('div');
        themesContainer.style = "display: flex; flex-wrap: wrap; gap: 10px; width: 100%; justify-content: center;";

        themes.forEach((t, i) => {
            let bg = t.background;
            if (Array.isArray(bg)) {
                bg = `linear-gradient(${bg[0]}, ${bg[1]})`;
            }

            const themeCard = document.createElement('div');
            themeCard.style = `
                width: 120px;
                height: 100px;
                border: 2px solid ${theme === i ? themes[theme].secondary : 'rgba(228, 232, 236, 0.2)'};
                border-radius: 10px;
                background: rgba(239, 239, 239, 0.133);
                --primary: ${Array.isArray(t.primary) ? t.primary[0] : t.primary};
                --secondary: ${t.secondary};
                --bgGradient: ${bg};
            `;
            themeCard.onclick = () => {
                setCookie("blxdextheme", String(i));
                location.reload();
            };

            // Add preview bar
            themeCard.innerHTML = `
                <div style="width: 100%; height: 80%; background: var(--bgGradient); border-radius: 10px; cursor: pointer; overflow: hidden; position: relative;">
                    <div style="position: absolute; left: 0px; top: 0px; height: 100%; background: var(--primary); width: 20px; box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 10px, rgba(0, 0, 0, 0.05) -3px 0px 0px inset; display: flex; flex-direction: column; gap: 5px; padding: 5px; align-items: center;">
                        <div style="height:3px;width:15px;background:#efefefee;border-radius:10px;"></div>
                        <div style="height:8px;width:18px;background:${t.secondary};border-radius:2px;"></div>
                        <div style="height:2px;width:10px;background:#efefefee;border-radius:10px;"></div>
                        <div style="height:2px;width:13px;background:#efefefee;border-radius:10px;"></div>
                        <div style="height:2px;width:15px;background:#efefefee;border-radius:10px;"></div>
                        <div style="height:2px;width:10px;background:#efefefee;border-radius:10px;"></div>
                        <div style="height:2px;width:8px;background:#efefefee;border-radius:10px;"></div>
                        <div style="height:2px;width:13px;background:#efefefee;border-radius:10px;"></div>
                    </div>
                </div>
                <div style="margin-left: 7px;">${t.name}</div>
            `;

            themesContainer.appendChild(themeCard);
        });

        themeSection.appendChild(themesContainer);
        page.appendChild(themeSection);

        // Add default theme button section
        const defaultSection = document.createElement('div');
        defaultSection.className = "blookedex-section";
        defaultSection.innerHTML = `
            <div class="blookedex-title">Set to default</div>
            <button class="blookedex-default-btn" id="blookedex-default-btn">Reset to Default Theme</button>
        `;
        page.appendChild(defaultSection);

        // Add to body
        document.body.appendChild(page);

        // Add event listener for reset button
        document.getElementById('blookedex-default-btn').addEventListener('click', () => {
            deleteCookie("blxdextheme");
            location.reload();
        });
    };

    // Initialize
    applyTheme();

    // Check if we're on the blookedex page
    if (window.location.href.includes("stats?blookedex=true")) {
        createBlookedexPage();
    }

    // Watch for dynamic changes
    const observer = new MutationObserver(() => {
        applyTheme();

        // Re-check for blookedex page if needed
        if (window.location.href.includes("stats?blookedex=true")) {
            if (!document.querySelector('.blookedex-page')) {
                createBlookedexPage();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();