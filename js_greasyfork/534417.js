// ==UserScript==
// @name         ↻ Refresh Script (QA Tool)
// @namespace    https://bowHip.org/foster | https://gist.github.com/qp5
// @version      1.0
// @description  🔸Use with creating scripts: Creates a button to refresh your Script without having to reload website server.  read More↗
// @author       jAdkins
// @match        https://*/*
// @License      Free usage, use this QA Tool however you like. 
// @Email        adkinscc@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/534417/%E2%86%BB%20Refresh%20Script%20%28QA%20Tool%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534417/%E2%86%BB%20Refresh%20Script%20%28QA%20Tool%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

// 🟨🟨 START YOUR SCRIPT HERE 🟨🟨 //

    function scriptName() {
        const div = document.createElement('div');
        div.textContent = 'Hello, world!';
        return div;
    }

// << END YOUR SCRIPT HERE >>
//_____________________________________________________________________________________________________________


// This code below adds " ↻ " icon at top of Browser that refreshes the your script.

    function setup() {
        const wrap = document.createElement('div');
        wrap.id = '↻-refresh';
        const content = myScript(); //🟨 << ADD NAME OF SCRIPT HERE
        wrap.appendChild(content);
        document.body.appendChild(wrap);
    }

    function cleanup() {
        document.getElementById('↻-refresh')?.remove();
    }

    function refreshScript() {
        cleanup();
        setup();
    }

function injectButton() {
    if (!document.getElementById('refresh-icon')) {
        const refreshIcon = document.createElement('div');
        refreshIcon.id = 'refresh-icon';
        refreshIcon.textContent = '↻';
        refreshIcon.title = 'Refreshes your script';
        refreshIcon.style.position = 'fixed';
        refreshIcon.style.top = '10px';
        refreshIcon.style.left = '50%';
        refreshIcon.style.right = '25px';
        refreshIcon.style.width = '32px';
        refreshIcon.style.height = '32px';
        refreshIcon.style.lineHeight = '28px'; // vertical centering
        refreshIcon.style.fontSize = '14px';   // shrink text too
        refreshIcon.style.padding = '0';
        refreshIcon.style.borderRadius = '55%';
        refreshIcon.style.fontWeight = '200';
        refreshIcon.style.background = '#444';
        refreshIcon.style.color = '#fff';
        refreshIcon.style.fontSize = '18px';
        refreshIcon.style.textAlign = 'center';
        refreshIcon.style.userSelect = 'none';
        refreshIcon.style.cursor = 'pointer';
        refreshIcon.style.zIndex = '9999';
        refreshIcon.style.padding = '0';   // <- Important: no padding!

        document.body.appendChild(refreshIcon);

                   let rotation = 0;

            refreshIcon.addEventListener('click', () => {
                rotation += 360;
                refreshIcon.style.transition = 'transform 0.5s';
                refreshIcon.style.transform = `rotate(${rotation}deg)`;

            setTimeout(() => {
            }, 400);
        });
    }
}

    const tryAdd = setInterval(() => {
        if (!document.getElementById('refresh-icon')) {
            injectButton();
        } else {
            clearInterval(tryAdd);  // Stop once it's added
        }
    }, 500);  // Check faster but only until it succeeds

    // First launch
    setup();

})();
