// ==UserScript==
// @name         Tower 3 Clone for GitHub
// @namespace    https://otherguy.io
// @version      0.1
// @description  Replace the GitHub Desktop button with a "Clone with Tower" button
// @author       Alexander Graf
// @homepage     https://github.com/otherguy/userscript-github-tower3/
// @match        *://github.com/*
// @icon         https://www.git-tower.com/assets/img/icons/tower-icon.1607416917.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418501/Tower%203%20Clone%20for%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/418501/Tower%203%20Clone%20for%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clonemenu = document.querySelector('get-repo .dropdown-menu ul');
    if(clonemenu){
        // Delete GitHub Desktop button
        clonemenu.querySelector('li>a[href="https://desktop.github.com"]').parentElement.remove()

        var li = document.createElement('li');
        li.classList.add('Box-row', 'Box-row--hover-gray', 'p-0');

        var btn = document.createElement('a');
        btn.classList.add('d-flex', 'flex-items-center', 'text-gray-dark', 'text-bold', 'no-underline', 'p-3');
        btn.innerHTML = '<svg version="1.1" class="octicon octicon-desktop-download mr-3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" width="16" height="16"><path d="M520.522,186.686c-2.63-3.087-6.482-4.868-10.541-4.868h-88.029l20.363-97.538c0.853-4.081-0.18-8.326-2.81-11.56c-2.628-3.237-6.576-5.114-10.743-5.114H319.85V27.689h24.458c7.645,0,13.845-6.197,13.845-13.845S351.953,0,344.308,0H267.7c-7.645,0-13.845,6.197-13.845,13.845s6.2,13.845,13.845,13.845h24.458v39.919h-108.91c-4.167,0-8.116,1.877-10.743,5.114c-2.63,3.234-3.661,7.479-2.81,11.56l20.363,97.538h-88.029c-4.056,0-7.908,1.78-10.541,4.868c-2.63,3.087-3.774,7.177-3.126,11.181l12.837,79.651c0.003,0.014,0.003,0.025,0.003,0.039l14.847,92.111c0.676,4.192,3.193,7.692,6.643,9.727c2.071,1.221,4.477,1.913,7.025,1.913h85.374v216.851c0,7.648,6.2,13.845,13.845,13.845H383.07c7.645,0,13.845-6.197,13.845-13.845V381.31h85.374c2.547,0,4.956-0.692,7.025-1.913c3.45-2.035,5.967-5.532,6.643-9.727l14.847-92.111c0.003-0.014,0.003-0.025,0.003-0.039l12.837-79.651C524.296,193.863,523.152,189.773,520.522,186.686zM405.008,127.478h-26.642v-32.18h33.36L405.008,127.478zM350.679,95.298v32.18H319.85v-32.18H350.679zM292.161,127.478h-30.832v-32.18h30.829v32.18H292.161zM233.64,95.298v32.18h-26.643l-6.717-32.18H233.64zM187.864,261.505h-61.201l-8.382-51.997h69.58v51.997H187.864zM292.161,261.505h-76.608v-51.997h76.608V261.505zM396.455,261.505h-76.608v-51.997h76.608V261.505zM485.346,261.505h-61.201v-51.997h69.58L485.346,261.505z"/></svg>'
            + 'Clone in Tower 3';
        btn.tabIndex = 0;
        btn.href = `gittower://openRepo/${clonemenu.parentElement.querySelector('tab-container div[role=tabpanel]:nth-child(3) input[type=text]').value}`

        li.appendChild(btn);
        clonemenu.insertBefore(li, clonemenu.childNodes[0]);
    }
})();
