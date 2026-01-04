// ==UserScript==
// @name         Teamwork new IL Code fetcher
// @namespace    http://tampermonkey.net/
// @version      3000.0.1
// @license      MIT
// @description  Fetches a new IL Code on Teamwork
// @author       Mensura - Tom Daniel
// @match        https://mensura.teamwork.com/
// @match        https://mensura.teamwork.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500801/Teamwork%20new%20IL%20Code%20fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/500801/Teamwork%20new%20IL%20Code%20fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ilCodeButtonId = 'newIlCodeButton';
    const ilCodeTextId = 'newIlCodeTxt'

    const init = async () => {
        const containerEl = [...document.getElementById('mainNav')?.childNodes||[]]?.find(e => e instanceof HTMLDivElement);
        if (!containerEl) {
            console.log("ContainerEl not found, retrying...");
            setTimeout(init, 200)
            return;
        }
        console.log("ContainerEl FOUND");

        containerEl.insertAdjacentHTML('beforebegin', createHtml());
        console.log("HTML ADDED");
        console.log(document.getElementById(ilCodeButtonId));
        document.getElementById(ilCodeButtonId).onclick = async () => {
            document.getElementById(ilCodeTextId).innerHTML = "";
            let code = await getNewCode();
            if (code == null) code = "(Not found, try starring the IL project)"
            document.getElementById(ilCodeTextId).innerHTML = code;
        };
    };

    const createHtml = () => `
<div class="my-4">
    <button
        id="${ilCodeButtonId}"
        type="button"
        class="flex mx-auto my-1 text-body-4 text-[color:--lsds-c-sidebar-drawer-icon-color-on-surface] hover:text-[color:--lsds-c-sidebar-drawer-list-item-color-on-hover]"
        data-identifier="ls-nav-sidebar-projects-starred"
    >Nieuwe IL Code</button>
    <p
        id="${ilCodeTextId}"
        class="text-center mt-2"
        style="font-size: 20px; color: white; mix-blend-mode: difference;"
    ></p>
</div>`;

    const getNewCode = async () => {
        const highestCode = await getHighestCode();
        if (!highestCode) return null;

        const highestNum = Number(/IL([0-9]+)[0-9-_]*/.exec(highestCode)[1]);
        const newNum = highestNum + 1;
        return `IL${newNum.toString().padStart(3, '0')}`;
    };

    const getHighestCode = async () => {
        let highestCode = null;
        for (let page = 1; page <= 5; page++) {
            highestCode = await getHighestCodeForPage(page);
            if (highestCode != null) return highestCode;
        }

        return null;
    };

    const getHighestCodeForPage = async (page) => {
        return await fetch(`https://mensura.teamwork.com/projects/api/v3/tasks.json?orderMode=desc&orderBy=createdat&onlyStarredProjects=true&page=${page}&includeCompletedTasks=true&pageSize=100`)
            .then(r => r.json())
            .then(tasksObj => {
            const tasks = tasksObj.tasks;
            let highestNum = 0;
            let highestCode = null;
            tasks.forEach(task => {
                const match = /[^a-zA-Z0-9]*(IL([0-9]+)[0-9-_]*)/.exec(task.name);
                if (!match) return;
                const num = Number(match[2]);
                if (num > highestNum) {
                    highestNum = num;
                    highestCode = match[1];
                }
            });
            return highestCode;
        });
    };

    init();
})();