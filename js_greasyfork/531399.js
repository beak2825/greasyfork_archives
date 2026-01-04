// ==UserScript==
// @name         BuiltWith Summary Panel
// @version      0.4
// @license      MIT
// @author       nov0id
// @description  Show condensed BuiltWith.com summary panel in the top right corner with animations and improved font styling
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      builtwith.com
// @namespace    https://rainbowlabllc.com/
// @downloadURL https://update.greasyfork.org/scripts/531399/BuiltWith%20Summary%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/531399/BuiltWith%20Summary%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const site = window.location.hostname.replace(/^www\./, '');
    const bwUrl = `https://builtwith.com/${site}`;

    // Create invisible hover target
    const hoverTarget = document.createElement('div');
    hoverTarget.style.position = 'fixed';
    hoverTarget.style.top = '10px';
    hoverTarget.style.right = '0';
    hoverTarget.style.width = '10px';
    hoverTarget.style.height = '33vh';
    hoverTarget.style.zIndex = 9998;
    hoverTarget.style.cursor = 'pointer';
    document.body.appendChild(hoverTarget);

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '-300px';
    panel.style.width = '300px';
    panel.style.maxHeight = '33vh';
    panel.style.overflowY = 'auto';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    panel.style.color = 'white';
    panel.style.zIndex = 9999;
    panel.style.borderRadius = '8px';
    panel.style.padding = '10px';
    panel.style.fontFamily = 'Segoe UI, Roboto, sans-serif';
    panel.style.fontSize = '12px';
    panel.style.transition = 'right 0.5s ease, opacity 0.3s ease';
    panel.style.opacity = '0.5';
    panel.style.pointerEvents = 'none';

    let hideTimeout;
    function showPanel() {
        clearTimeout(hideTimeout);
        panel.style.right = '10px';
        panel.style.opacity = '1';
        panel.style.pointerEvents = 'auto';
        panel.querySelectorAll('.content-item').forEach(el => el.style.visibility = 'visible');
    }

    function hidePanel() {
        hideTimeout = setTimeout(() => {
            panel.style.right = '-300px';
            panel.style.opacity = '0.5';
            panel.style.pointerEvents = 'none';
            panel.querySelectorAll('.content-item').forEach(el => el.style.visibility = 'hidden');
        }, 500);
    }

    hoverTarget.addEventListener('mouseenter', showPanel);
    panel.addEventListener('mouseenter', showPanel);
    hoverTarget.addEventListener('mouseleave', hidePanel);
    panel.addEventListener('mouseleave', hidePanel);

    const title = document.createElement('div');
    title.textContent = 'Tech Used (BuiltWith)';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    title.style.fontSize = '13px';
    title.classList.add('content-item');
    panel.appendChild(title);

    document.body.appendChild(panel);

    GM_xmlhttpRequest({
        method: 'GET',
        url: bwUrl,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const cards = doc.querySelectorAll('.card-body');

            cards.forEach(card => {
                const heading = card.querySelector('h6.card-title');
                const techs = card.querySelectorAll('h2 a.text-dark');
                if (heading && techs.length) {
                    const group = document.createElement('div');
                    group.style.marginBottom = '8px';
                    group.classList.add('content-item');

                    const cat = document.createElement('div');
                    cat.textContent = heading.textContent;
                    cat.style.color = '#ccc';
                    cat.style.fontWeight = 'bold';
                    cat.style.fontSize = '11.5px';
                    cat.style.marginBottom = '2px';
                    group.appendChild(cat);

                    techs.forEach(tech => {
                        const t = document.createElement('div');
                        t.textContent = '• ' + tech.textContent;
                        group.appendChild(t);
                    });

                    panel.appendChild(group);
                }
            });

            // Hide text initially
            panel.querySelectorAll('.content-item').forEach(el => el.style.visibility = 'hidden');
        }
    });
})();
