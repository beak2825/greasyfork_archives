// ==UserScript==
// @name                Welcome
// @name:zh-TW          歡迎蒞臨
// @name:zh-CN          歡迎蒞臨
// @namespace           veringsek
// @match               http://meet.google.com/*
// @match               https://meet.google.com/*
// @grant               none
// @version             0.0.6
// @author              veringsek
// @description         Welcome is a Microsoft Edge Extension to automatically accept when people request to join your Google Meet meeting.
// @description:zh-TW   歡迎蒞臨是一個微軟 Edge 瀏覽器的擴充功能，能自動允許使用者加入 Google Meet 會議。
// @description:zh-CN   歡迎蒞臨是一個微軟 Edge 瀏覽器的擴充功能，能自動允許使用者加入 Google Meet 會議。
// @downloadURL https://update.greasyfork.org/scripts/444848/Welcome.user.js
// @updateURL https://update.greasyfork.org/scripts/444848/Welcome.meta.js
// ==/UserScript==

function ScanningProcess(actions) {
    this.actions = actions;
    this.stage = 0;
    this.runner = null;
}
ScanningProcess.prototype.run = function () {
    if (this.stage >= this.actions.length) return false;
    let action = this.actions[this.stage];
    this.runner = setInterval(() => {
        if (action.func()) {
            clearInterval(this.runner);
            this.stage += 1;
            this.run();
        }
    }, action.duration);
    return true;
};

function toggleWelcome(welcome) {
    if (welcome === undefined) {
        globalThis.welcome = !globalThis.welcome;
    } else {
        globalThis.welcome = welcome;
    }
    let icnWelcome = document.getElementById('icnWelcome');
    let btnWelcome = document.getElementById('btnWelcome');
    let tipWelcome = document.getElementById('tipWelcome');
    if (globalThis.welcome) {
        console.log(`Welcome is on.`);
        document.getElementById('svgWelcomeOn').style.display = '';
        document.getElementById('svgWelcomeOff').style.display = 'none';
        btnWelcome.style.background = ``;
        tipWelcome.innerHTML = 'Everyone is welcomed to this meeting now.';
    } else {
        console.log(`Welcome is off.`);
        document.getElementById('svgWelcomeOff').style.display = '';
        document.getElementById('svgWelcomeOn').style.display = 'none';
        btnWelcome.style.background = `#ea4335`;
        tipWelcome.innerText = 'Permission is needed to join this meeting.';
    }
}

const DIV_BUTTONS = 'R5ccN';
const TARGET = 3;

globalThis.sp = new ScanningProcess([{
    func: function () {
        let divButtons;
        try {
            divButtons = document.getElementsByClassName(DIV_BUTTONS)[0];

            let divWelcome = divButtons.children[TARGET].cloneNode(true);
            let btnWelcome = divWelcome.getElementsByTagName('button')[0];
            btnWelcome.id = 'btnWelcome';
            btnWelcome.addEventListener('click', ev => toggleWelcome());
            btnWelcome.setAttribute('data-tooltip-id', 'tipWelcome');

            let icnGoogleMaterial = divWelcome.getElementsByTagName('i')[0];
            icnGoogleMaterial.style.display = 'none';

            let icnWelcome = document.createElement('span');
            icnWelcome.id = 'icnWelcome';

            let svgWelcomeOff = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgWelcomeOff.id = 'svgWelcomeOff';
            svgWelcomeOff.style.display = 'none';
            svgWelcomeOff.setAttribute('viewBox', '0 0 576 512');
            let pathWelcomeOff = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathWelcomeOff.setAttribute('d', `M560 448H480V50.75C480 22.75 458.5 0 432 0h-288C117.5 0 96 22.75 96 50.75V448H16C7.125 448 0 455.1 0 464v32C0 504.9 7.125 512 16 512h544c8.875 0 16-7.125 16-16v-32C576 455.1 568.9 448 560 448zM384 288c-17.62 0-32-14.38-32-32s14.38-32 32-32s32 14.38 32 32S401.6 288 384 288z`);
            svgWelcomeOff.appendChild(pathWelcomeOff);
            icnWelcome.appendChild(svgWelcomeOff);

            let svgWelcomeOn = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgWelcomeOn.id = 'svgWelcomeOn';
            svgWelcomeOn.style.display = 'none';
            svgWelcomeOn.setAttribute('viewBox', '0 0 576 512');
            let pathWelcomeOn = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathWelcomeOn.setAttribute('d', `M560 448H512V113.5c0-27.25-21.5-49.5-48-49.5L352 64.01V128h96V512h112c8.875 0 16-7.125 16-15.1v-31.1C576 455.1 568.9 448 560 448zM280.3 1.007l-192 49.75C73.1 54.51 64 67.76 64 82.88V448H16c-8.875 0-16 7.125-16 15.1v31.1C0 504.9 7.125 512 16 512H320V33.13C320 11.63 300.5-4.243 280.3 1.007zM232 288c-13.25 0-24-14.37-24-31.1c0-17.62 10.75-31.1 24-31.1S256 238.4 256 256C256 273.6 245.3 288 232 288z`);
            svgWelcomeOn.appendChild(pathWelcomeOn);
            icnWelcome.appendChild(svgWelcomeOn);

            let tipWelcome = divWelcome.querySelector('*[role=tooltip]');
            tipWelcome.id = 'tipWelcome';

            icnGoogleMaterial.parentElement.insertBefore(icnWelcome, icnGoogleMaterial);

            divButtons.insertBefore(divWelcome, divButtons.children[TARGET]);

            toggleWelcome(false);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    duration: 1000
}, {
    func: function () {
        if (!globalThis.welcome) return false;
        try {
            let btnAccept = document.querySelector('*[role=dialog]')?.getElementsByTagName('button')[1];
            if (btnAccept.getAttribute('data-mdc-dialog-action') === 'accept') {
                btnAccept.click();
            }
        } catch {
            return false;
        }
    },
    duration: 500
}]);
globalThis.sp.run();