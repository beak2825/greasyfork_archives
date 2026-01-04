// ==UserScript==
// @name         Clone in VSCode
// @namespace    https://github.com/spacemeowx2
// @version      0.2
// @description  Clone Github respository in VSCode
// @author       space
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419515/Clone%20in%20VSCode.user.js
// @updateURL https://update.greasyfork.org/scripts/419515/Clone%20in%20VSCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(actions, uri) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'btn btn-sm'; // js-toggler-target
        button.innerText = 'Clone in VSCode';
        button.addEventListener('click', () => {
            location.href = `vscode://vscode.git/clone?url=${encodeURIComponent(uri)}`
        })
        li.append(button);
        actions.append(li);
    }
    function getGitUri() {
        const [emptyUri] = [...document.querySelectorAll('button.js-git-protocol-clone-url')].map(i => i.getAttribute('data-url')).filter(i => i.startsWith('git'))
        const [normalUri] = [...document.querySelectorAll('input[data-autoselect]')].map(i => i.value).filter(i => i.startsWith('git'))
        return emptyUri || normalUri
    }
    const actions = document.querySelector('.pagehead-actions')
    if (actions) {
        const uri = getGitUri();
        if (uri) {
            createButton(actions, uri);
        }
    }
})();