// ==UserScript==
// @author	    Fiotux
// @namespace   https://greasyfork.org/en/users/1446209
// @license GNU General Public License v3.0
// @name         Rule34 Smash or Pass
// @version      1.2
// @description  Adds smash and pass buttons to rule34
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @downloadURL https://update.greasyfork.org/scripts/529945/Rule34%20Smash%20or%20Pass.user.js
// @updateURL https://update.greasyfork.org/scripts/529945/Rule34%20Smash%20or%20Pass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const img = document.querySelector('#image');
    const nextLink = document.querySelector('#next_search_link');

    function smash() {
        fetch(img.src)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const fileName = img.src.split('/').pop();
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
         			 location.href = nextLink.href;
            });
      
    }

    function pass() {
        location.href = nextLink.href;
    }

    if (img && nextLink) {
        const container = document.createElement('div');
        container.style.margin = '1em';

        const smashBtn = document.createElement('button');
        smashBtn.textContent = 'Smash';
        smashBtn.onclick = smash;
        container.appendChild(smashBtn);

        const passBtn = document.createElement('button');
        passBtn.textContent = 'Pass';
        passBtn.onclick = pass;
        container.appendChild(passBtn);

        document.addEventListener('keydown', (event) => {
            if (event.key === '.') smash();
            else if (event.key === '/') pass();
        });

        document.getElementById('image').insertAdjacentElement('afterend', container);
    }
})();
