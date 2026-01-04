// ==UserScript==
// @name         Torn City Add to Your List
// @namespace    https://www.torn.com/
// @version      1.3.1
// @description  Adds a button to player profiles to save them to a custom list and a new menu to access the list.
// @author       MossaJehad
// @match        https://www.torn.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/f/ff/Emojione_1F4CB.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/522721/Torn%20City%20Add%20to%20Your%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/522721/Torn%20City%20Add%20to%20Your%20List.meta.js
// ==/UserScript==

(function () {

    const LIST_KEY = 'customPlayerList';

    function getList() {
        const list = GM_getValue(LIST_KEY, []);
        return list;
    }


    function saveList(list) {
        GM_setValue(LIST_KEY, list);
    }

    function removePlayer(playerId) {
        const list = getList();
        const updatedList = list.filter(player => player.id !== playerId);
        saveList(updatedList);
        return updatedList;
    }

    const playerIdMatch = window.location.href.match(/XID=(\d+)/);
    let isDark = document.body.classList.contains('dark-mode') ? 1 : 0;
    let svgtheme = isDark ? 'url(#linear-gradient-dark-mode)' : 'url(#linear-gradient)';

    const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            if (document.body.classList.contains('dark-mode')) {
                isDark = 1;
            } else {
                isDark = 0;
            }
            updateSidebarButton();
        }
    });
});

    function addProfileButton() {
        const actionsContainer = document.querySelector('.buttons-wrap .buttons-list');
        if (!actionsContainer || document.querySelector('.add-to-your-list')) return;

        const addButton = document.createElement('a');
        addButton.className = 'profile-button add-to-your-list active';


        addButton.href = '#';
        addButton.style.textAlign = 'center';


        const playerName = document.querySelector('h4#skip-to-content').innerText.slice(0, -10);
        const leftDigit = document.querySelector('.box-value .digit-r .digit.left');
        const middleDigit = document.querySelector('.box-value .digit-m .digit');
        const rightDigit = document.querySelector('.box-value .digit-l .digit.left');

        const leftValue = leftDigit ? leftDigit.textContent.trim() : '';
        const middleValue = middleDigit ? middleDigit.textContent.trim() : '';
        const rightValue = rightDigit ? rightDigit.textContent.trim() : '';
        const playerLevel = `${leftValue}${middleValue}${rightValue}`;

        if (!playerIdMatch) return;
        const playerId = playerIdMatch[1];

        const list = getList();
        const isInList = list.some(player => player.id === playerId);

        addButton.innerHTML = isInList
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0" id="star" style="width: 25px;height: 25px;scale: 1.33;margin: 8px 0 0 0;" fill=${svgtheme}>
             <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"/>
        </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0" id="star" style="width: 25px;height: 25px;scale: 1.22;margin: 8px 0 0 0;" fill=${svgtheme}>
             <path d="M16.855,20.966c-0.224,0-0.443-0.05-0.646-0.146c-0.035-0.014-0.069-0.031-0.104-0.051l-4.107-2.343L7.891,20.77    c-0.035,0.02-0.07,0.037-0.106,0.053C7.297,21.051,6.7,20.997,6.264,20.68c-0.469-0.34-0.701-0.933-0.586-1.509l0.957-4.642    c-0.374-0.34-0.962-0.875-1.602-1.457l-1.895-1.725c-0.027-0.025-0.055-0.053-0.078-0.082c-0.375-0.396-0.509-0.97-0.34-1.492    C2.893,9.249,3.34,8.861,3.88,8.764C3.914,8.756,3.947,8.75,3.982,8.746l4.701-0.521l1.946-4.31    c0.017-0.038,0.036-0.075,0.06-0.11c0.262-0.473,0.764-0.771,1.309-0.771c0.543,0,1.044,0.298,1.309,0.77    c0.021,0.036,0.041,0.073,0.06,0.112l1.948,4.312l4.701,0.521c0.034,0.003,0.068,0.009,0.104,0.017    c0.539,0.1,0.986,0.486,1.158,1.012c0.17,0.521,0.035,1.098-0.34,1.494c-0.024,0.026-0.051,0.054-0.078,0.078l-3.498,3.184    l0.957,4.632c0.113,0.587-0.118,1.178-0.59,1.519C17.477,20.867,17.173,20.966,16.855,20.966z M8.706,14.402    c-0.039,0.182-0.466,2.246-0.845,4.082l3.643-2.077c0.307-0.175,0.684-0.175,0.99,0l3.643,2.075l-0.849-4.104    c-0.071-0.346,0.045-0.705,0.308-0.942l3.1-2.822l-4.168-0.461c-0.351-0.039-0.654-0.26-0.801-0.584l-1.728-3.821l-1.726,3.821    c-0.146,0.322-0.45,0.543-0.801,0.584l-4.168,0.461l3.1,2.822C8.676,13.682,8.788,14.053,8.706,14.402z"/>
        </svg>`;

        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            const list = getList();
            const playerEntry = { 'id': playerId, 'name': playerName, 'level': playerLevel };
            if (!list.some(player => player.id === playerId)) {
                list.push(playerEntry);
                saveList(list);
                updatePlayerListState();
                updateSidebarCount();
            } else {
                removePlayer(playerId);
                saveList(list);
                updatePlayerListState();
                updateSidebarCount();
            }
        });

        actionsContainer.appendChild(addButton);
    }

    function replaceMainContentWithList() {
        const mainContentWrapper = document.querySelector('#mainContainer');
        const mainItemsContainer = document.querySelector('.content-wrapper[role="main"]');

        if (!mainContentWrapper || !mainItemsContainer) return;

        mainItemsContainer.remove();

        const listContainer = document.createElement('div');
        listContainer.className = 'content';

        listContainer.innerHTML = `
        <style>
.content {
    width: 100%;
}

.your-list-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
}

.your-list-container h3 {
    margin: 0 0 20px 0;
    font-size: 22px;
    text-align: center;
}

.remove-all-btn {
    display: flex;
    margin: 0 auto 20px auto;
    color: #fff;
    border: none;
    cursor: pointer;
    justify-content: space-around;
    align-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
}

.player-table {
    width: 100%;
}

.player-table td{
    text-align: center;
}


.remove-btn {
    background: none;
    border: none;
    padding: 4px;
    color: #ff4d4d;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s ease;
}

.remove-btn:hover {
    color: #d93636;
}

.player-tr {
    background: #aaa;
}

.player-tr:hover {
    background: #bbb;
}

</style>
<div class="your-list-container">
    <h3>Your Player List</h3>
    <div class="mission-tooltip">
        <button id="rall" class="remove-all-btn ladda-button cancel torn-btn btn-dark-bg" data-style="slide-right">
           <span class="ladda-label">Remove All</span>
           <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 60 60" style="margin-left: 10px;">
              <path fill="#FFF" d="M36 26v11c0 1.66-1.34 3-3 3h-10c-1.66 0-3-1.34-3-3V26h16zm-2 0v11c0 .55-.45 1-1 1h-10c-.55 0-1-.45-1-1V26h12zm-9-5c0-.55.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1zm0 7c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1v-6zm4 0c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1v-6zm-6-6h-4c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1h-4v-1c0-1.66-1.34-3-3-3h-4c-1.66 0-3 1.34-3 3v1z"></path>
           </svg>
        </button>
    </div>
    <table class="player-table title-black top-round" style="border-radius: 7px 7px 0 0;">
        <thead class="users-list-title top-round m-top10">
            <tr>
                <th>Name</th>
                <th>Level</th>
                <th>ID</th>
                <th style="width: 33px;">Del</th>
            </tr>
        </thead>
        <tbody>
            ${getList()
                .map(
                    player => `
                    <tr class="player-tr">
                        <td class="player-name">
                            <a href="/profiles.php?XID=${player.id}" target="_blank" id="player-${player.id}" style=" font-family: visitor1; color: white; text-decoration: none; font-size: 16px; text-shadow: 0px 0px 3px #000000;">
                                ${player.name}
                            </a>
                        </td>
                        <td class="player-level" style="color: white;">${player.level}</td>
                        <td class="player-id" style="color: white;">${player.id}</td>
                        <td>
                            <button class="remove-btn delete" data-player-id="${player.id}">×</button>
                        </td>
                    </tr>
                    `
                )
                .join('')}
        </tbody>
    </table>
</div>
`;

        const lastElement = mainContentWrapper.lastElementChild;
        mainContentWrapper.insertBefore(listContainer, lastElement);

        const removeButtons = listContainer.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const playerId = this.getAttribute('data-player-id');
                const updatedList = removePlayer(playerId);
                if (updatedList.length === 0) {
                    listContainer.style.width = "100%";
                    listContainer.innerHTML = '<div style="width: 100%; margin: 0 auto; padding: 20px;"><h3 style="margin: 0 0 20px 0; font-size: 22px; text-align: center;">Your list is empty</h3></div>';
                } else {
                    replaceMainContentWithList();
                }
                updateSidebarCount();
            });
        });

        const removeAllButton = listContainer.querySelector('#rall');
        if (removeAllButton) {
            removeAllButton.addEventListener('click', function () {
                saveList([]);
                listContainer.style.width = "100%";
                listContainer.innerHTML = '<div style="width: 100%; margin: 0 auto; padding: 20px;"><h3 style="margin: 0 0 20px 0; font-size: 22px; text-align: center;">Your list is empty</h3></div>';
                updateSidebarCount();
            });
        }
    }

observer.observe(document.body, { attributes: true });

function addSidebarButton() {
    const enemiesListElement = document.querySelector('#nav-enemies_list');
    if (!enemiesListElement || document.querySelector('.your-list-button')) return;

    const listButton = document.createElement('div');
    listButton.className = 'area-desktop___bpqAS your-list-button';

    listButton.innerHTML = `
        <div class="area-row___iBD8N" id="yourList">
            <a href="#" class="desktopLink___SG2RU">
                <span class="svgIconWrap___AMIqR">
                    ${isDark ?
                        '<span class="defaultIcon___iiNis mobile___paLva">' :
                        '<span class="defaultIcon___iiNis desktop___LfsR8">'
                    }
                        <svg xmlns="http://www.w3.org/2000/svg" stroke="transparent" stroke-width="0" width="20" height="16" viewBox="0 1 20 16">
                            <g>
                                <path d="M13.88,13.06c-2.29-.53-4.43-1-3.39-2.94C13.63,4.18,11.32,1,8,1S2.36,4.3,5.51,10.12c1.07,2-1.15,2.43-3.39,2.94C.13,13.52,0,14.49,0,16.17V17H16v-.83C16,14.49,15.87,13.52,13.88,13.06Z"></path>
                            </g>
                        </svg>
                    </span>
                </span>
                <span class="linkName___FoKha">Your List</span>
            </a>
            <div role="button" tabindex="0" class="info___cuq1T">
                <span class="amount___p8QZX">0</span>
                <span class="arrow___tKP13 disabled___nQBDP"></span>
            </div>
        </div>
    `;

    listButton.querySelector('#yourList').addEventListener('click', (e) => {
        e.preventDefault();
        replaceMainContentWithList();
    });

    enemiesListElement.appendChild(listButton);
    updateSidebarCount();
}

function updateSidebarButton() {
    const listButton = document.querySelector('.your-list-button');
    if (listButton) {
        const currentCount = listButton.querySelector('.amount___p8QZX')?.textContent || '0';

        listButton.innerHTML = `
            <div class="area-row___iBD8N" id="yourList">
                <a href="#" class="desktopLink___SG2RU">
                    <span class="svgIconWrap___AMIqR">
                        ${isDark ?
                            '<span class="defaultIcon___iiNis mobile___paLva">' :
                            '<span class="defaultIcon___iiNis desktop___LfsR8">'
                        }
                            <svg xmlns="http://www.w3.org/2000/svg" stroke="transparent" stroke-width="0" width="20" height="16" viewBox="0 1 20 16">
                                <g>
                                    <path d="M13.88,13.06c-2.29-.53-4.43-1-3.39-2.94C13.63,4.18,11.32,1,8,1S2.36,4.3,5.51,10.12c1.07,2-1.15,2.43-3.39,2.94C.13,13.52,0,14.49,0,16.17V17H16v-.83C16,14.49,15.87,13.52,13.88,13.06Z"></path>
                                </g>
                            </svg>
                        </span>
                    </span>
                    <span class="linkName___FoKha">Your List</span>
                </a>
                <div role="button" tabindex="0" class="info___cuq1T">
                    <span class="amount___p8QZX">${currentCount}</span>
                    <span class="arrow___tKP13 disabled___nQBDP"></span>
                </div>
            </div>
        `;
    }
}

function updateSidebarCount() {
    const list = getList();
    const listButtonAmount = document.querySelector('.your-list-button .amount___p8QZX');
    if (listButtonAmount) {
        listButtonAmount.textContent = list.length;
    }
}
    function updatePlayerListState() {
        const list = getList();
        const playerId = playerIdMatch[1];
        const addButton = document.querySelector('.add-to-your-list');
        if(addButton) {
            addButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0" id="star" fill=${svgtheme} style="width: 25px;height: 25px;scale: 1.33;margin: 8px 0 0 0;">
             <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"/>
        </svg>`
        }
    }

    window.addEventListener('load', () => {
        addProfileButton();
        addSidebarButton();
        updateSidebarCount();
    });
})();