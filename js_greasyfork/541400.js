// ==UserScript==
// @name         Blacket/Triangulet Game Modal Opener
// @version      2.5.0
// @description  Adds a Games button to Blacket/Triangulet
// @match        https://blacket.org/*
// @match        https://tri.pengpowers.xyz/*
// @match        https://coplic.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1479014
// @downloadURL https://update.greasyfork.org/scripts/541400/BlacketTriangulet%20Game%20Modal%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/541400/BlacketTriangulet%20Game%20Modal%20Opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Insert games panel
    function addGamesPanel() {
        const infoPanel = document.querySelector('.styles__infoContainer___2uI-S-camelCase');
        if (!infoPanel || document.querySelector('#gamesPanel')) return;

        const clone = infoPanel.cloneNode(false);
        clone.id = 'gamesPanel';

        // Header row
        const headerRow = document.createElement('div');
        headerRow.className = 'styles__headerRow___1tdPa-camelCase';
        headerRow.style.display = 'flex';
        headerRow.style.alignItems = 'center';

        const icon = document.createElement('i');
        icon.className = 'fas fa-gamepad styles__headerIcon___1ykdN-camelCase';
        icon.setAttribute('aria-hidden', 'true');
        icon.style.marginRight = '0.5vw';

        const headerText = document.createElement('div');
        headerText.className = 'styles__infoHeader___1lsZY-camelCase';
        headerText.textContent = 'Games';

        headerRow.appendChild(icon);
        headerRow.appendChild(headerText);
        clone.appendChild(headerRow);

        // Styled button like "Upgrade Now!"
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'styles__button___1_E-G-camelCase styles__upgradeButton___3UQMv-camelCase';
        buttonWrapper.setAttribute('role', 'button');
        buttonWrapper.setAttribute('tabindex', '0');
        buttonWrapper.style.cursor = 'pointer';
        buttonWrapper.onclick = createGamesModal;

        const buttonLink = document.createElement('a');
        buttonLink.href = '#';
        buttonLink.style.textDecoration = 'none';

        const shadow = document.createElement('div');
        shadow.className = 'styles__shadow___3GMdH-camelCase';

        const edge = document.createElement('div');
        edge.className = 'styles__edge___3eWfq-camelCase';
        edge.style.backgroundColor = 'var(--secondary)';

        const front = document.createElement('div');
        front.className = 'styles__front___vcvuy-camelCase styles__upgradeButtonInside___396BT-camelCase';
        front.style.backgroundColor = 'var(--secondary)';
        front.textContent = 'Games';

        buttonLink.appendChild(shadow);
        buttonLink.appendChild(edge);
        buttonLink.appendChild(front);
        buttonWrapper.appendChild(buttonLink);
        clone.appendChild(buttonWrapper);

        infoPanel.parentNode.insertBefore(clone, infoPanel.nextSibling);
    }

    // Modal logic
    function createGamesModal() {
        if (document.getElementById('bigModal')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'modalBackdrop';
        Object.assign(backdrop.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2147483645,
        });
        document.body.appendChild(backdrop);

        const modal = document.createElement('div');
        modal.id = 'bigModal';
        modal.className = 'bb_bigModal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            zIndex: 2147483646,
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 0 10px black',
            fontFamily: '"Nunito", sans-serif',
            userSelect: 'none',
        });

        const title = document.createElement('div');
        title.className = 'bb_bigModalTitle';
        title.textContent = 'Games';
        title.style.fontSize = '1.6rem';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '0.5rem';
        modal.appendChild(title);

        const desc = document.createElement('div');
        desc.className = 'bb_bigModalDescription';
        desc.textContent = 'Choose a game to play:';
        desc.style.marginBottom = '1rem';
        modal.appendChild(desc);

        const games = [
            ['Play Chrome Dino Game', 'https://chromedino.com/'],
            ["Play Five Nights at Penguin's", 'https://fnap2tuff.glitch.me'],
            ['Play Slope', 'slope'],
            ['Play Minecraft Classic', 'https://classic.minecraft.net/'],
            ['Play Eaglercraft', 'https://eaglercraft.com'],
        ];

        for (const [text, url] of games) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = text;
            link.style.display = 'block';
            link.style.color = '#6cf';
            link.style.margin = '0.5rem 0';
            link.onclick = (e) => {
                e.preventDefault();
                closeModal();
                if (url === 'slope') return launchSlopeGame();
                launchIframeGame(url);
            };
            modal.appendChild(link);
        }

        modal.appendChild(document.createElement('hr'));

        const closeBtn = document.createElement('div');
        closeBtn.className = 'styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase';
        closeBtn.setAttribute('role', 'button');
        closeBtn.setAttribute('tabindex', '0');
        closeBtn.style.width = '30%';
        closeBtn.style.marginBottom = '1.5vh';
        closeBtn.style.cursor = 'pointer';

        const shadowDiv = document.createElement('div');
        shadowDiv.className = 'styles__shadow___3GMdH-camelCase';
        closeBtn.appendChild(shadowDiv);

        const edgeDiv = document.createElement('div');
        edgeDiv.className = 'styles__edge___3eWfq-camelCase';
        edgeDiv.style.backgroundColor = '#2f2f2f';
        closeBtn.appendChild(edgeDiv);

        const frontDiv = document.createElement('div');
        frontDiv.className = 'styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase';
        frontDiv.style.backgroundColor = '#2f2f2f';
        frontDiv.textContent = 'Close';
        closeBtn.appendChild(frontDiv);

        closeBtn.onclick = closeModal;
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);
    }

    function closeModal() {
        const modal = document.getElementById('bigModal');
        const backdrop = document.getElementById('modalBackdrop');
        if (modal) modal.remove();
        if (backdrop) backdrop.remove();
    }

    function launchIframeGame(url) {
        document.body.innerHTML = '';
        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            border: 'none',
            zIndex: '9999'
        });
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(createOverlayX, 300);
    }

    function launchSlopeGame() {
        document.body.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.id = 'slopeCanvas';
        Object.assign(canvas.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'block',
            zIndex: '9999'
        });
        document.body.appendChild(canvas);

        const slopeScript = document.createElement('script');
        slopeScript.src = 'https://cdn.jsdelivr.net/gh/iygiyfg/assets/slope.js';
        document.body.appendChild(slopeScript);

        setTimeout(createOverlayX, 500);
    }

    function createOverlayX() {
        if (document.getElementById('x-overlay')) return;

        const font = document.createElement('link');
        font.href = 'https://fonts.googleapis.com/css2?family=Titan+One&display=swap';
        font.rel = 'stylesheet';
        document.head.appendChild(font);

        const overlay = document.createElement('div');
        overlay.id = 'x-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '2147483647',
            pointerEvents: 'none'
        });

        const x = document.createElement('div');
        x.textContent = 'X';
        x.id = 'x';
        Object.assign(x.style, {
            position: 'absolute',
            top: '1vw',
            right: '1vw',
            fontSize: '2.5vw',
            color: 'red',
            fontFamily: '"Titan One", cursive',
            cursor: 'pointer',
            pointerEvents: 'auto'
        });
        x.onclick = () => location.reload();

        overlay.appendChild(x);
        document.body.appendChild(overlay);
    }

    // Wait for info panel to exist
    const observer = new MutationObserver(() => {
        if (document.querySelector('.styles__infoContainer___2uI-S-camelCase')) {
            observer.disconnect();
            addGamesPanel();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();


