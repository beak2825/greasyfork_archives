// ==UserScript==
// @name         Suno DL Button
// @namespace    http://tampermonkey.net/
// @version      2025-01-24a
// @description  Adds a download button to suno song pages and the player bar.
// @author       Root
// @match        https://suno.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524480/Suno%20DL%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/524480/Suno%20DL%20Button.meta.js
// ==/UserScript==

const button_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M8 22h8c2.828 0 4.243 0 5.121-.878C22 20.242 22 18.829 22 16v-1c0-2.828 0-4.242-.879-5.121c-.768-.768-1.946-.865-4.121-.877m-10 0c-2.175.012-3.353.109-4.121.877C2 10.758 2 12.172 2 15v1c0 2.829 0 4.243.879 5.122c.3.3.662.497 1.121.627"/><path stroke-linejoin="round" d="M12 2v13m0 0l-3-3.5m3 3.5l3-3.5"/></g></svg>';

function addButton() {
    const metaAudio = document.querySelector('meta[property="og:audio"]');
    const audio = document.querySelector('audio');
    const songUrl = audio.src !== '' && audio.src != metaAudio ? audio.src : metaAudio.content;

    if (metaAudio !== null && metaAudio.content !== '') {
        const playerBar = document.querySelector('div[aria-label="Playbar: More actions"]');
        const buttonsContainer = playerBar !== null ? playerBar.children[0] : document.querySelector('#main-container>div>div>:nth-child(3)');

        // already added the button, early return, or remove
        const oldBtn = document.querySelector('#suno-dl-btn');
        if (oldBtn) {
            if (oldBtn.parentNode !== buttonsContainer) {
                oldBtn.parentNode.removeChild(oldBtn);
            } else {
                if (oldBtn.href !== songUrl) {
                    oldBtn.href = songUrl;
                }
                return;
            }
        }

        if (buttonsContainer !== null) {
            const btn = document.createElement('a');
            btn.id = 'suno-dl-btn';
            btn.href = songUrl;
            btn.target = '_blank';
            btn.innerHTML = button_svg;
            btn.classList = 'relative inline-block enabled:hover:text-currentColor font-sans font-medium text-center before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:border before:border-transparent before:bg-transparent after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:bg-transparent after:opacity-0 enabled:hover:after:opacity-100 transition duration-75 before:transition before:duration-75 after:transition after:duration-75 cursor-pointer py-4 text-[17px] leading-[24px] rounded-md text-primary bg-quaternary enabled:before:hover:bg-primary/10 disabled:brightness-50 px-6 flex-1 md:flex-none';
            buttonsContainer.appendChild(btn);
        }
    }
}

(function() {
    const observer = new MutationObserver(mutations => {
        addButton();
    });
    observer.observe(document, { childList:true, subtree:true });
})();
