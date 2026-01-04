// ==UserScript==
// @name         Torn Employee Identifier
// @namespace    https://greasyfork.org/
// @version      0.1.01
// @description  Identify company colleagues on profile pages before you cause HR issues
// @author       AngelofDev [3689828]
// @match        https://www.torn.com/profiles.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533478/Torn%20Employee%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/533478/Torn%20Employee%20Identifier.meta.js
// ==/UserScript==

var tornAPI = "";
var colleagues = {};
var directorId = null;
var refresh_counter = 0;

function getAPI() {
    tornAPI = GM_getValue("tornApiKey");
    if (!tornAPI) {
        const apiPrompt = prompt("First Time Setup | Please enter your Public API Key (found in your Torn Settings under 'API Keys')");
        if (apiPrompt) {
            GM_setValue("tornApiKey", apiPrompt);
            tornAPI = apiPrompt;
        }
    }
}

function addUI() {
    const container = document.querySelector('.profile-container');
    if (!container) return;

    const noticeWrapper = document.createElement('div');
    noticeWrapper.id = "company-colleague-wrapper";
    noticeWrapper.style.marginBottom = '10px';
    noticeWrapper.style.padding = '10px';
    noticeWrapper.style.borderRadius = '8px';
    noticeWrapper.style.fontWeight = 'bold';
    noticeWrapper.style.display = 'none';

    // Different background for director
    noticeWrapper.classList.add("torn-colleague-marker");
    document.head.insertAdjacentHTML("beforeend", `
        <style>
            .torn-colleague-marker.colleague { background-color: #fff59d; border: 2px solid #fbc02d; }
            .torn-colleague-marker.director { background-color: #c5e1a5; border: 2px solid #689f38; }
        </style>
    `);

    noticeWrapper.innerText = ""; // We’ll set this dynamically

    const descBlock = container.querySelector('#profile-container-description');
    if (descBlock) {
        descBlock.parentNode.insertBefore(noticeWrapper, descBlock);
    }
}

function getData() {
    if (!tornAPI) return;

    const dataURL = `https://api.torn.com/company/?selections=profile&key=${tornAPI}`;
    $.getJSON(dataURL, function(data) {
        if (!data || !data.company || !data.company.employees) return;

        // Store colleagues
        colleagues = Object.keys(data.company.employees).reduce((map, id) => {
            map[id] = true;
            return map;
        }, {});

        // Store director ID
        directorId = data.company.director.toString();

        checkProfile();
    });
}

function getProfileIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("XID");
}

function checkProfile() {
    const profileId = getProfileIdFromURL();
    const notice = document.getElementById('company-colleague-wrapper');

    if (!profileId || !notice) return;

    if (profileId === directorId) {
        notice.textContent = "🧑‍💼 This person is your company's **Director**";
        notice.classList.remove("colleague");
        notice.classList.add("director");
        notice.style.display = 'block';
    } else if (colleagues[profileId]) {
        notice.textContent = "👥 This person is a **colleague** from your company";
        notice.classList.remove("director");
        notice.classList.add("colleague");
        notice.style.display = 'block';
    } else {
        notice.style.display = 'none';
    }
}

function renderData() {
    if (refresh_counter === 0) {
        getData();
    }
    refresh_counter = (refresh_counter + 1) % 60;
}

$(window).on('load', function () {
    setTimeout(function () {
        getAPI();
        addUI();
        getData(); // initial load
        setInterval(renderData, 1000); // refresh every second
    }, 1000);
});