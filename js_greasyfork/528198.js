// ==UserScript==
// @name         mywordle cheat
// @description  get the answer for a mywordle
// @icon         https://i.imgur.com/ORAaPzD.png
// @version      1

// @author       VillainsRule
// @namespace    https://github.com/VillainsRule/Greasyfork

// @match        *://mywordle.strivemath.com/?word=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528198/mywordle%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/528198/mywordle%20cheat.meta.js
// ==/UserScript==

document.body.insertAdjacentHTML('beforeend', `
    <style>
        .mwc {
            position: absolute;
            top: 10px;
            left: 15px;
            font-size: 16px;
        }

        .mwc-get {
            cursor: pointer;
            text-decoration: underline;

        }
    </style>

    <span class="mwc mwc-get">get answer</span>
`);

document.querySelector('.mwc-get').onclick = () => {
    let root = document.querySelector('#root > div');
    let reactName = Object.keys(root).find(key => key.startsWith('__reactFiber$'));
    let reactData = root[reactName];
    let word = reactData.return.updateQueue.lastEffect.next.next.deps[0].word;

    if (!word) alert('it\'s likely the cheat was "patched", open an issue on github\nhttps://github.com/VillainsRule/Greasyfork/issues');

    let text = document.querySelector('.mwc');

    text.innerHTML = `answer: <u>${word}</u>`;
    text.classList.remove('mwc-get');
}