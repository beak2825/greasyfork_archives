// ==UserScript==
// @name         Neopets: Neoboards - Copy Username
// @description  Sick of trying to copy a username and visiting a lookup? Me too! This script adds a mention action that copies the username to your clipboard. Simply paste and away you go.
// @namespace    https://greasyfork.org/en/users/547396
// @author       https://greasyfork.org/en/users/547396
// @match        *://*.neopets.com/neoboards/topic.phtml*
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/424029/Neopets%3A%20Neoboards%20-%20Copy%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/424029/Neopets%3A%20Neoboards%20-%20Copy%20Username.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get User
    const board = document.getElementById('boardTopic'),
          posts = board.querySelectorAll('.boardPostByline');

    let i = 0;

    for ( i; i < posts.length; i++ ) {
        const postBlock = posts[i],
              heading = postBlock.getElementsByClassName('postAuthorName')[0],
              author = heading.innerText;

        heading.style.display = 'inline';

        createInput( postBlock, author );
    }

    // Create Input
    function createInput( post, author ) {
        const inputContainer = document.createElement('div'),
              inputEl = document.createElement('input'),
              copyBtn = document.createElement('button');

        inputEl.value = author;
        copyBtn.innerText = 'mention';

        inputContainer.appendChild(inputEl);
        inputContainer.appendChild(copyBtn);
        post.appendChild(inputContainer);

        post.style.position = 'relative';

        inputEl.style.height = '5px';
        inputEl.style.opacity = '0';

        copyBtn.type = 'button';
        copyBtn.style.backgroundColor = '#bfaecf';
        copyBtn.style.color = '#ffffff';
        copyBtn.style.border = '1px solid #bfaecf';
        copyBtn.style.outline = 'none';
        copyBtn.style.position = 'absolute';
        copyBtn.style.top = '0';
        copyBtn.style.right = '0';
        copyBtn.style.fontSize = '10px';
        copyBtn.style.cursor = 'pointer';

        copyBtn.addEventListener('click', copyUsername.bind( event, inputEl, inputContainer ), false);
    }

    // Copy Username
    function copyUsername( name, post ) {
        const dataInput = name;

        dataInput.select();
        dataInput.setSelectionRange(0, 99999);
        document.execCommand('copy');

        appendMessage( post );
    }

    // Post Message
    function appendMessage( post ) {
        const message = document.createElement('div');

        message.innerHTML = 'Username Copied';
        post.appendChild(message);

        message.style.font = '9px courier, monospace';
        message.style.opacity = '0.7';

        setTimeout( function() {
            post.removeChild(message);
        }, 1000 );
    }
})();