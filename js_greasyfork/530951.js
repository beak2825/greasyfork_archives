// ==UserScript==
// @name         XOTA PANNEL ✨(AD BLOCKER✅)
// @namespace    http://xota.com/
// @version      1.1
// @description AD BLOCKER FOR MULTIPLE WEBSITES: NETFLIX,YOUTUBE,X,TIKTOK,ETC..
// @author       julx
// @license MIT
// @icon https://raw.githubusercontent.com/juliantopyu/XOTAICONS/refs/heads/main/WhatsApp_Image_2025-03-26_at_20.24.13-removebg-preview.png
// @match        *://*/*
// @match        https://www.youtube.com/
// @match        https://www.tiktok.com/
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @resource     font1 https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap
// @resource     font2 https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap
// @resource     font3 https://fonts.googleapis.com/css2?family=Monoton&display=swap
// @resource     discordIcon https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png
// @resource     youtubeIcon https://www.google.com/s2/favicons?domain=youtube.com
// @resource     twitterIcon https://www.google.com/s2/favicons?domain=twitter.com
// @resource     facebookIcon https://www.google.com/s2/favicons?domain=facebook.com
// @resource     redditIcon https://www.google.com/s2/favicons?domain=reddit.com
// @resource     twitchIcon https://www.google.com/s2/favicons?domain=twitch.tv
// @resource     xotaIcon https://raw.githubusercontent.com/juliantopyu/XOTAICONS/refs/heads/main/WhatsApp_Image_2025-03-26_at_20.24.13-removebg-preview.png
// @downloadURL https://update.greasyfork.org/scripts/530951/XOTA%20PANNEL%20%E2%9C%A8%28AD%20BLOCKER%E2%9C%85%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530951/XOTA%20PANNEL%20%E2%9C%A8%28AD%20BLOCKER%E2%9C%85%29.meta.js
// ==/UserScript==

GM_addStyle(`
  @import url('https://fonts.googleapis.com/css2?family=Bungee+Shade&family=Press+Start+2P&family=Monoton&display=swap');

  #xota-panel {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 300px;
    background: linear-gradient(135deg, #ff00cc 0%, #3333ff 100%);
    border: 3px solid #00ffff;
    border-radius: 15px 0 0 15px;
    box-shadow: 0 0 25px rgba(255, 0, 204, 0.7),
                0 0 50px rgba(51, 51, 255, 0.5);
    padding: 20px;
    z-index: 9999;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    font-family: 'Press Start 2P', cursive;
  }

  #xota-panel:hover {
    box-shadow: 0 0 35px rgba(255, 0, 204, 0.9),
                0 0 70px rgba(51, 51, 255, 0.7);
    right: 5px;
  }

  #xota-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    font-family: 'Monoton', cursive;
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #fff;
    text-shadow: 0 0 10px #00ffff,
                 0 0 20px #ff00cc,
                 0 0 30px #3333ff;
    animation: glow 2s ease-in-out infinite alternate;
  }

  #xota-logo {
    width: 50px;
    height: 50px;
    object-fit: contain;
    filter: drop-shadow(0 0 10px #00ffff)
            drop-shadow(0 0 20px #ff00cc);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }

  @keyframes glow {
    from {
      text-shadow: 0 0 10px #00ffff,
                   0 0 20px #ff00cc,
                   0 0 30px #3333ff;
    }
    to {
      text-shadow: 0 0 15px #00ffff,
                   0 0 25px #ff00cc,
                   0 0 35px #3333ff,
                   0 0 45px #ff00cc;
    }
  }

  .xota-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: none;
    border-radius: 8px;
    background: linear-gradient(to right, #ff00cc, #3333ff);
    color: white;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .xota-button:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
  }

  .xota-button:active {
    transform: scale(0.98);
  }

  .xota-button:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 45%,
      rgba(255, 255, 255, 0.5) 48%,
      rgba(255, 255, 255, 0) 52%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% {
      left: -50%;
      top: -50%;
    }
    100% {
      left: 150%;
      top: 150%;
    }
  }

  .xota-button i {
    margin-right: 10px;
    font-size: 1.2rem;
    width: 20px;
    text-align: center;
  }

  .site-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3a 100%);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 500px;
    width: 90%;
    border: 3px solid #00ffff;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
    animation: pulse 2s infinite;
    max-height: 80vh;
    overflow-y: auto;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
    }
    50% {
      box-shadow: 0 0 50px rgba(0, 255, 255, 1);
    }
    100% {
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
    }
  }

  .modal h2 {
    color: white;
    font-family: 'Bungee Shade', cursive;
    margin-bottom: 20px;
  }

  .modal p {
    color: white;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    margin-bottom: 20px;
  }

  .modal-close {
    background: #ff3366;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-family: 'Press Start 2P', cursive;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 20px;
  }

  .modal-close:hover {
    background: #ff0044;
    transform: scale(1.1);
  }

  .button-active {
    animation: buttonClick 0.5s ease;
  }

  @keyframes buttonClick {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); background: #00ffff; }
    100% { transform: scale(1); }
  }

  #save-settings {
    background: #00cc66;
    margin-top: 10px;
  }

  #save-settings:hover {
    background: #00aa55;
  }

  .setting-item {
    margin-bottom: 15px;
    text-align: left;
  }

  .setting-item label {
    display: block;
    color: white;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
    margin-bottom: 5px;
  }

  .setting-item input[type="checkbox"] {
    margin-right: 10px;
    transform: scale(1.3);
  }

  .setting-item input[type="text"] {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: none;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
  }

  .popular-sites {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 20px 0;
  }

  .site-toggle {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .site-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .site-toggle input {
    margin-right: 8px;
  }

  /* INSANE EYE TOGGLE BUTTON - POSITIONED ON TOP */
  #xota-eye-toggle {
    position: absolute;
    right: calc(100% + 15px);
    top: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(45deg, #ff00cc, #3333ff);
    border: 3px solid #00ffff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 0 20px rgba(255, 0, 204, 0.7),
                0 0 40px rgba(51, 51, 255, 0.5);
    transition: all 0.3s ease;
    animation: eyeFloat 3s infinite ease-in-out;
  }

  @keyframes eyeFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }

  #xota-eye-toggle:hover {
    transform: scale(1.2) rotate(10deg);
    box-shadow: 0 0 30px rgba(255, 0, 204, 0.9),
                0 0 60px rgba(51, 51, 255, 0.7),
                0 0 90px rgba(0, 255, 255, 0.5);
    animation: none;
  }

  #xota-eye-toggle i {
    font-size: 24px;
    color: white;
    text-shadow: 0 0 10px #00ffff;
    transition: all 0.3s ease;
  }

  #xota-eye-toggle:hover i {
    transform: scale(1.3);
    text-shadow: 0 0 15px #00ffff,
                 0 0 30px #ff00cc;
  }

  /* EYE SPARKLE EFFECTS */
  .eye-sparkle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    filter: drop-shadow(0 0 5px cyan);
  }

  /* PANEL STATES */
  .panel-hidden {
    transform: translateY(-50%) translateX(calc(100% + 20px)) !important;
  }

  .panel-hidden #xota-eye-toggle {
    right: calc(100% + 35px);
  }
`);

(function() {
    'use strict';

    // Initialize settings
    const defaultSettings = {
        adBlockEnabled: true,
        blockedSites: ['youtube.com', 'twitter.com', 'facebook.com', 'reddit.com', 'twitch.tv'],
        panelVisible: true
    };

    let settings = GM_getValue('xotaSettings', defaultSettings);

    // Popular sites with icons
    const popularSites = [
        { domain: 'youtube.com', name: 'YouTube', icon: 'https://www.google.com/s2/favicons?domain=youtube.com' },
        { domain: 'twitter.com', name: 'Twitter', icon: 'https://www.google.com/s2/favicons?domain=twitter.com' },
        { domain: 'facebook.com', name: 'Facebook', icon: 'https://www.google.com/s2/favicons?domain=facebook.com' },
        { domain: 'reddit.com', name: 'Reddit', icon: 'https://www.google.com/s2/favicons?domain=reddit.com' },
        { domain: 'twitch.tv', name: 'Twitch', icon: 'https://www.google.com/s2/favicons?domain=twitch.tv' },
        { domain: 'instagram.com', name: 'Instagram', icon: 'https://www.google.com/s2/favicons?domain=instagram.com' },
        { domain: 'tiktok.com', name: 'TikTok', icon: 'https://www.google.com/s2/favicons?domain=tiktok.com' },
        { domain: 'netflix.com', name: 'Netflix', icon: 'https://www.google.com/s2/favicons?domain=netflix.com' }
    ];

    // Create panel container
    const panel = document.createElement('div');
    panel.id = 'xota-panel';
    if (!settings.panelVisible) panel.classList.add('panel-hidden');

    // Add header with logo
    const header = document.createElement('div');
    header.id = 'xota-header';

    // Create XOTA logo image
    const logoImg = document.createElement('img');
    logoImg.id = 'xota-logo';
    logoImg.src = 'https://raw.githubusercontent.com/juliantopyu/XOTAICONS/refs/heads/main/WhatsApp_Image_2025-03-26_at_20.24.13-removebg-preview.png';
    logoImg.alt = 'XOTA Logo';

    // Create header text
    const headerText = document.createElement('span');
    headerText.textContent = 'XOTA';

    // Add both to header
    header.appendChild(logoImg);
    header.appendChild(headerText);
    panel.appendChild(header);

    // Create Discord icon element
    const discordIcon = document.createElement('img');
    discordIcon.className = 'site-icon';
    discordIcon.src = 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png';
    discordIcon.alt = 'Discord';

    // Create settings modal
    const settingsModal = document.createElement('div');
    settingsModal.className = 'modal';
    settingsModal.id = 'settings-modal';

    // Create Discord modal
    const discordModal = document.createElement('div');
    discordModal.className = 'modal';
    discordModal.id = 'discord-modal';

    // Add buttons
    const buttons = [
        {
            icon: '<i class="fa fa-cog"></i>',
            text: 'AD-BLOCK SETTINGS',
            action: () => showModal('settings-modal')
        },
        {
            icon: discordIcon.outerHTML,
            text: 'JOIN DISCORD',
            action: () => showModal('discord-modal')
        }
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'xota-button';
        button.innerHTML = `${btn.icon} ${btn.text}`;

        button.addEventListener('click', function() {
            this.classList.add('button-active');
            setTimeout(() => {
                this.classList.remove('button-active');
            }, 500);
            btn.action();
        });

        panel.appendChild(button);
    });

    // Build settings modal content
    const settingsContent = document.createElement('div');
    settingsContent.className = 'modal-content';
    settingsContent.innerHTML = `
        <h2>XOTA AD-BLOCK SETTINGS</h2>

        <div class="setting-item">
            <label>
                <input type="checkbox" id="ad-block-toggle" ${settings.adBlockEnabled ? 'checked' : ''}>
                ENABLE AD-BLOCK
            </label>
        </div>

        <h3>POPULAR SITES</h3>
        <div class="popular-sites" id="popular-sites-container">
            <!-- Popular sites will be added here -->
        </div>

        <div class="setting-item">
            <label for="blocked-sites">CUSTOM SITES (comma separated):</label>
            <input type="text" id="blocked-sites" value="${settings.blockedSites.filter(site =>
                !popularSites.map(p => p.domain).includes(site)).join(', ')}">
        </div>

        <button id="save-settings" class="xota-button">
            <i class="fa fa-save"></i> SAVE SETTINGS
        </button>
        <button class="modal-close">CLOSE</button>
    `;

    settingsModal.appendChild(settingsContent);

    // Build Discord modal content
    const discordContent = document.createElement('div');
    discordContent.className = 'modal-content';
    discordContent.innerHTML = `
        <h2>JOIN XOTA DISCORD!</h2>
        <p>CLICK BELOW TO JOIN OUR AWESOME COMMUNITY</p>
        <button id="discord-join" class="xota-button" style="margin: 0 auto;">
            <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" class="site-icon" alt="Discord">
            JOIN NOW
        </button>
        <button class="modal-close">CLOSE</button>
    `;

    discordModal.appendChild(discordContent);

    // Create INSANE EYE TOGGLE BUTTON (ON TOP OF PANEL)
    const eyeToggle = document.createElement('div');
    eyeToggle.id = 'xota-eye-toggle';
    eyeToggle.innerHTML = `<i class="fa ${settings.panelVisible ? 'fa-eye' : 'fa-eye-slash'}"></i>`;

    eyeToggle.addEventListener('click', function() {
        // Toggle panel visibility
        settings.panelVisible = !settings.panelVisible;
        GM_setValue('xotaSettings', settings);

        // Update icon
        this.innerHTML = `<i class="fa ${settings.panelVisible ? 'fa-eye' : 'fa-eye-slash'}"></i>`;

        // Toggle panel class
        panel.classList.toggle('panel-hidden');

        // Create insane sparkle effect
        createSparkles(this);

        // Crazy bounce animation
        this.style.transform = 'scale(1.5) rotate(20deg)';
        setTimeout(() => {
            this.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    });

    function createSparkles(element) {
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'eye-sparkle';

            // Random position around the eye
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            sparkle.style.left = '50%';
            sparkle.style.top = '50%';

            // Random animation
            const animName = `sparkleAnim${Date.now()}${i}`;
            const duration = 0.5 + Math.random() * 0.5;

            GM_addStyle(`
                @keyframes ${animName} {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            ${Math.cos(angle) * distance}px,
                            ${Math.sin(angle) * distance}px
                        ) scale(${Math.random() * 0.5 + 0.5});
                        opacity: 0;
                    }
                }
            `);

            sparkle.style.animation = `${animName} ${duration}s forwards`;
            element.appendChild(sparkle);

            // Remove after animation
            setTimeout(() => sparkle.remove(), duration * 1000);
        }
    }

    // Add eye toggle to panel (POSITIONED ON TOP)
    panel.appendChild(eyeToggle);

    // Add modals to body
    document.body.appendChild(settingsModal);
    document.body.appendChild(discordModal);
    document.body.appendChild(panel);

    // Populate popular sites
    const popularSitesContainer = document.getElementById('popular-sites-container');
    popularSites.forEach(site => {
        const siteToggle = document.createElement('div');
        siteToggle.className = 'site-toggle';
        siteToggle.innerHTML = `
            <input type="checkbox" id="site-${site.domain}" ${settings.blockedSites.includes(site.domain) ? 'checked' : ''}>
            <img src="${site.icon}" class="site-icon" alt="${site.name}">
            <label for="site-${site.domain}">${site.name}</label>
        `;
        popularSitesContainer.appendChild(siteToggle);
    });

    // Modal control functions
    function showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    function hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            hideModal(this.closest('.modal').id);
        });
    });

    // Save settings handler
    document.getElementById('save-settings').addEventListener('click', function() {
        const adBlockEnabled = document.getElementById('ad-block-toggle').checked;
        const blockedSites = [...settings.blockedSites];

        // Get popular sites selections
        popularSites.forEach(site => {
            const checkbox = document.getElementById(`site-${site.domain}`);
            if (checkbox.checked && !blockedSites.includes(site.domain)) {
                blockedSites.push(site.domain);
            } else if (!checkbox.checked && blockedSites.includes(site.domain)) {
                const index = blockedSites.indexOf(site.domain);
                blockedSites.splice(index, 1);
            }
        });

        // Add custom sites
        const customSites = document.getElementById('blocked-sites').value
            .split(',')
            .map(site => site.trim().toLowerCase())
            .filter(site => site.length > 0 && !popularSites.map(p => p.domain).includes(site));

        settings = {
            ...settings,
            adBlockEnabled,
            blockedSites: [...new Set([...blockedSites, ...customSites])]
        };

        GM_setValue('xotaSettings', settings);
        GM_notification({
            text: 'Settings saved successfully!',
            title: 'XOTA SETTINGS',
            timeout: 2000
        });

        // Reload to apply changes
        setTimeout(() => location.reload(), 1000);
    });

    // Discord join button
    document.getElementById('discord-join').addEventListener('click', () => {
        GM_openInTab('https://discord.gg/NCsAVKkq', { active: true });
        hideModal('discord-modal');
    });

    // Apply ad-blocking if enabled for current site
    const currentHost = window.location.hostname.replace('www.', '');
    if (settings.adBlockEnabled && settings.blockedSites.some(site => currentHost.includes(site))) {
        applyAdBlocking();
    }

    function applyAdBlocking() {
        console.log('XOTA Ad-blocker active on this site');

        // Advanced ad-blocking selectors
        const adSelectors = [
            // Universal ad selectors
            'div[class*="ad"]',
            'div[class*="Ad"]',
            'div[id*="ad"]',
            'div[id*="Ad"]',
            'iframe[src*="ads"]',
            'iframe[src*="ad."]',
            'img[src*="ad"]',
            'ins.adsbygoogle',
            'div.ad-container',
            'div.ad-wrapper',

            // Platform-specific selectors
            '#player-ads', // YouTube
            '.ytp-ad-module', // YouTube
            '.video-ads', // YouTube
            '[data-testid="placementTracking"]', // Twitter
            '[data-testid="ad"]', // Twitter
            '[aria-label="Ad"]', // Twitter
            '.ad-banner', // Common
            '.ad-sidebar', // Common
            '.ad-popup', // Common
            '.ad-overlay', // Common
            '.ad-notice', // Common
            '.advert', // Common
            '.sponsored-content', // Common
            '.promoted-content', // Common
            '.paid-content' // Common
        ];

        // Remove ad elements
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
                console.log('Blocked ad element:', el);
            });
        });

        // Block ad scripts
        const adScripts = Array.from(document.scripts).filter(script =>
            script.src && (script.src.includes('adservice') ||
                          script.src.includes('adsbygoogle') ||
                          script.src.includes('doubleclick') ||
                          script.src.includes('advertising'))
        );

        adScripts.forEach(script => {
            script.remove();
            console.log('Blocked ad script:', script.src);
        });
    }
})();