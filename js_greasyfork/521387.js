// ==UserScript==
// @name         CordLink (Original)
// @namespace    http://tampermonkey.net/
// @version      2024-12-01p
// @description  Best Client for Bloxdhub
// @author       powq
// @match        https://bloxdhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxdhub.com
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/521387/CordLink%20%28Original%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521387/CordLink%20%28Original%29.meta.js
// ==/UserScript==




/* 
 * Copyright (c) 2024 powq
 * All rights reserved. You may not copy, modify, distribute, or use this software without explicit permission from the author (powq).
 */














(function() {
    'use strict';

    const enforceGradients = () => {
        const style = document.getElementById("gradient-fix-style");
        if (!style) {
            const gradientStyle = document.createElement('style');
            gradientStyle.id = "gradient-fix-style";
            gradientStyle.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

                :root {
                    --background-primary: #0a0a0a;
                    --background-secondary: #111111;
                    --background-tertiary: #1c1c1c;
                    --accent-primary: #6b5aed;
                    --accent-secondary: #4f3aff;
                    --accent-tertiary: #8b5cf6;
                    --text-primary: #f4f4f4;
                    --text-secondary: #a1a1a1;
                    --border-color: rgba(255,255,255,0.05);
                    --glassmorphic-border: rgba(255,255,255,0.1);
                }

                * {
                    box-sizing: border-box;
                    -webkit-tap-highlight-color: transparent;
                }

                body {
                    background: var(--gradient-bg, var(--background-primary)) !important;
                    font-family: 'Manrope', 'Inter', 'Segoe UI', Roboto, sans-serif;
                    color: var(--text-primary);
                    line-height: 1.6;
                    transition: background 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    overscroll-behavior: none;
                }

                .vencord-modal {
                    background: var(--background-secondary);
                    border-radius: 24px;
                    box-shadow:
                        0 50px 100px -20px rgba(0, 0, 0, 0.3),
                        0 30px 60px -30px rgba(0, 0, 0, 0.25);
                    width: 96%;
                    max-width: 1200px;
                    max-height: 92vh;
                    overflow-y: auto;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.85);
                    opacity: 0;
                    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
                    z-index: 1200;
                    padding: 40px;
                    border: 1px solid var(--glassmorphic-border);
                    background: linear-gradient(
                        145deg,
                        var(--background-secondary) 0%,
                        var(--background-tertiary) 100%
                    );
                    perspective: 1000px;
                    will-change: transform, opacity;
                }

                .vencord-modal::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(
                        45deg,
                        var(--accent-primary),
                        var(--accent-secondary),
                        var(--accent-tertiary)
                    );
                    z-index: -1;
                    border-radius: 26px;
                    opacity: 0.6;
                    filter: blur(80px);
                }

                .vencord-modal.show {
                    transform: translate(-50%, -50%) scale(1) rotateX(0);
                    opacity: 1;
                }

                .vencord-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid var(--border-color);
                }

                .vencord-modal-header h2 { // made by powq
                    margin: 0;
                    font-size: 2.2rem;
                    font-weight: 700;
                    background: linear-gradient(
                        90deg,
                        var(--accent-primary),
                        var(--accent-secondary)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .vencord-close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 2.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    line-height: 1;
                    opacity: 0.7;
                }

                .vencord-close-btn::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: all 0.3s ease;
                }

                .vencord-close-btn:hover {
                    opacity: 1; // pwoq
                    transform: rotate(180deg);
                }

                .vencord-close-btn:active::before {
                    width: 200%;
                    height: 200%;
                }

                .vencord-card-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 25px;
                    margin-top: 35px;
                }

                .vencord-card {
                    background: var(--background-tertiary);
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    padding: 25px;
                    text-align: center;
                    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
                    position: relative;
                    overflow: hidden;
                    box-shadow:
                        0 15px 30px -10px rgba(0, 0, 0, 0.2),
                        0 10px 20px -15px rgba(0, 0, 0, 0.15);
                    transform-style: preserve-3d;
                    will-change: transform;
                }

                .vencord-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 5px;
                    background: linear-gradient(
                        90deg,
                        var(--accent-primary),
                        var(--accent-secondary),
                        var(--accent-tertiary)
                    );
                }

                .vencord-card::after {
                    content: '';
                    position: absolute;
                    bottom: -100%;
                    left: 0;
                    right: 0;
                    height: 5px;
                    background: linear-gradient(
                        90deg,
                        var(--accent-tertiary),
                        var(--accent-secondary),
                        var(--accent-primary)
                    );
                    transition: bottom 0.3s ease;
                }

                .vencord-card h3 {
                    margin: 20px 0 15px;
                    font-size: 1.4rem;
                    font-weight: 700;
                    background: linear-gradient(
                        90deg,
                        var(--accent-primary),
                        var(--accent-secondary)
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .vencord-card p {
                    color: var(--text-secondary);
                    font-size: 1rem;
                    margin-bottom: 25px;
                    line-height: 1.6;
                    opacity: 0.8;
                }

                .vencord-use-btn {
                    background: linear-gradient(
                        135deg,
                        var(--accent-primary),
                        var(--accent-secondary),
                        var(--accent-tertiary)
                    );
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 12px 25px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                }

                .vencord-use-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        120deg,
                        transparent,
                        rgba(255,255,255,0.1),
                        transparent
                    );
                    transition: all 0.4s ease;
                    z-index: -1;
                }

                .vencord-use-btn:hover::before {
                    left: 100%;
                }

                .vencord-use-btn:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow:
                        0 15px 30px -10px rgba(0, 0, 0, 0.3),
                        0 10px 20px -15px rgba(0, 0, 0, 0.2);
                }

                .vencord-card:hover {
                    transform: translateY(-10px) rotateX(5deg) scale(1.03);
                    box-shadow:
                        0 25px 50px -15px rgba(0, 0, 0, 0.3),
                        0 15px 30px -20px rgba(0, 0, 0, 0.25);
                }

                .vencord-card:hover::after {
                    bottom: 0;
                }
            `;
            document.head.appendChild(gradientStyle);
        }
    };


(function() {
    'use strict';

    window.addEventListener('load', function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .navbar {
                background: transparent !important;
                border: none !important;
                margin: 0 !important;
                padding: 0.75rem 2rem !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
            }

            .post {
                background: transparent !important;
                color: inherit !important;
            }

            .post-composer {
                background: transparent !important;
                color: inherit !important;
            }

            .action-count {
                font-size: 0.9rem;
                font-weight: 500;
                color: #ffffff !important;
                min-width: 20px;
                text-align: center;
                display: inline-block !important;
                margin-left: 4px;
            }

            #post-textarea {
                color: #ffffff !important;
                background-color: transparent !important;
                border: 1px solid #ffffff !important;
                resize: none !important;
            }

            .action-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px;
                background: rgb(0 0 0 / 40%) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 12px;
                color: #94a3b8 !important;
                font-size: 0.9rem !important;
                cursor: pointer;
                transition: all 0.2s ease !important;
            }

            .action-btn:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #ffffff !important;
            }

            .dropdown-menu {
                background-color: rgb(203 58 58 / 50%) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) !important;
                color: #ffffff !important;
            }

            .sidenav {
                position: fixed;
                top: 60px;
                left: -280px;
                width: 280px;
                height: calc(100vh - 60px);
                background: transparent !important;
                border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
                transition: 0.3s;
                z-index: 999;
                overflow-y: auto;
                padding: 20px 0;
                box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3) !important;
            }

            .sidenav span {
                color: white !important;
            }

            .user-profile {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 16px;
                background: transparent !important;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
            }

            .notification-icon {
                background: transparent !important;
                border: none !important;
                border-radius: 10px;
                padding: 8px 12px;
                color: #8491a8 !important;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
            }

            .notification-icon i {
             font-size: 1.25rem;
             color: #fffefe;
              transition: all 0.4s ease;
            }

        `;
        document.head.appendChild(style);
    });

    const observer = new MutationObserver(() => {
        const postComposer = document.querySelector('.post-composer');
        if (postComposer) {
            postComposer.style.background = 'transparent';
            postComposer.style.color = 'inherit';
        }

        const post = document.querySelector('.post');
        if (post) {
            post.style.background = 'transparent';
            post.style.color = 'inherit';
        }

        const actionCount = document.querySelector('.action-count');
        if (actionCount) {
            actionCount.style.color = '#ffffff';
        }

        const postTextarea = document.querySelector('#post-textarea');
        if (postTextarea) {
            postTextarea.style.color = '#ffffff';
            postTextarea.style.backgroundColor = 'transparent';
        }

        const actionBtn = document.querySelector('.action-btn');
        if (actionBtn) {
            actionBtn.style.flex = '1';
            actionBtn.style.display = 'flex';
            actionBtn.style.alignItems = 'center';
            actionBtn.style.justifyContent = 'center';
            actionBtn.style.gap = '6px';
            actionBtn.style.padding = '8px';
            actionBtn.style.background = 'rgb(0 0 0 / 40%)';
            actionBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            actionBtn.style.borderRadius = '12px';
            actionBtn.style.color = '#94a3b8';
            actionBtn.style.fontSize = '0.9rem';
            actionBtn.style.cursor = 'pointer';
            actionBtn.style.transition = 'all 0.2s ease';
        }

        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.backgroundColor = 'rgb(203 58 58 / 50%)';
            dropdownMenu.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            dropdownMenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
            dropdownMenu.style.color = '#ffffff';
        }

        const sidenav = document.querySelector('.sidenav');
        if (sidenav) {
            sidenav.style.background = 'transparent';
            sidenav.style.borderRight = '1px solid rgba(255, 255, 255, 0.1)';
            sidenav.style.boxShadow = '4px 0 10px rgba(0, 0, 0, 0.3)';
        }

        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.style.background = 'transparent';
            userProfile.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }

        const notificationIcon = document.querySelector('.notification-icon');
        if (notificationIcon) {
            notificationIcon.style.background = 'transparent';
            notificationIcon.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }

        const bannerOverlayColor = window.getComputedStyle(document.querySelector('.banner-overlay'))['color'];
        const profileContentElement = document.querySelector('.profile-content');
        if (profileContentElement) {
            profileContentElement.style.color = bannerOverlayColor;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();










    const createCard = (title, content, gradientBackground) => {
        const card = document.createElement('div');
        card.classList.add('vencord-card');
        card.innerHTML = `
            <h3>${title}</h3>
            <p>${content}</p>
            <button class="vencord-use-btn">Apply</button>
        `;

        const useButton = card.querySelector('.vencord-use-btn');
        useButton.addEventListener('click', () => {
            // Save the gradient background to localStorage
            localStorage.setItem('selectedBackground', gradientBackground);


            document.documentElement.style.setProperty('--gradient-bg', gradientBackground);
        });

        return card;
    };

    const createDropdownItem = () => {
        const dropdownHeader = document.querySelector('.dropdown-header');
        if (dropdownHeader) {
            const item = document.createElement('a');
            item.classList.add('dropdown-item');
            item.innerHTML = `
                <i class="fa-solid fa-code" style="color: #7289da;"></i>
                CordLink
            `;

            dropdownHeader.parentElement.insertBefore(item, dropdownHeader.nextSibling);

            item.addEventListener('click', (event) => {
                event.preventDefault();
                openGui();
            });
        } else {
            console.warn('.dropdown-header not found');
        }
    };

    const openGui = () => {
        const modal = document.createElement('div');
        modal.classList.add('vencord-modal');
        modal.innerHTML = `
            <div class="vencord-modal-header">
                <h2>CordLink Styles</h2>
                <button class="vencord-close-btn">&times;</button>
            </div>
            <div class="vencord-card-container background-styles"></div>
            <div class="vencord-modal-header">
                <h2></h2>
            </div>
            <div class="vencord-card-container post-styles"></div>
        `;

        const closeBtn = modal.querySelector('.vencord-close-btn');
        closeBtn.addEventListener('click', () => closeModal(modal));

        const backgroundStyles = modal.querySelector('.background-styles');
        const postStyles = modal.querySelector('.post-styles');

const backgroundGradients = [
    'linear-gradient(135deg, #4a90e2 0%, #50e3c2 100%)', // Elegant Cool
    'linear-gradient(135deg, #fbc2eb 0%, #a18cd1 100%)', // Sunset Vibes
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', // Fresh Citrus
    'linear-gradient(135deg, #f4d03f 0%, #16a085 100%)', // Luxury Gold
    'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)', // Vivid Contrast
    'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', // Bold Orange & Pink
    'linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)', // Sky Bliss
    'linear-gradient(135deg, #f79d00 0%, #64f38c 100%)', // Tropical Dawn
    'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)', // Ocean Breeze
    'linear-gradient(135deg, #3a1c71 0%, #ffaf7b 100%)', // Sunset Mirage
    'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)', // Crimson Dusk
    'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)'  // Emerald Twilight
];

const backgroundTitles = [
    "Elegant Cool", "Sunset Vibes", "Fresh Citrus", "Luxury Gold",
    "Vivid Contrast", "Bold Orange & Pink", "Sky Bliss",
    "Tropical Dawn", "Ocean Breeze", "Sunset Mirage",
    "Crimson Dusk", "Emerald Twilight"
];

const backgroundContents = [
    "Cool and modern blue-teal gradient",
    "Dreamy pink and purple tones",
    "Fresh and vibrant coral hues",
    "Royal golden hues paired with green",
    "Striking purple and blue contrast",
    "Bold orange and pink energy",
    "Peaceful and uplifting sky hues",
    "Golden and green tropical mix",
    "Refreshing ocean-inspired colors",
    "Warm and serene sunset tones",
    "Rich crimson hues fading into deep magenta",
    "Lush emerald tones with a touch of mystery"
];

backgroundTitles.forEach((title, index) => {
    const card = createCard(title, backgroundContents[index], backgroundGradients[index]);
    backgroundStyles.appendChild(card);
});

const postStyleGradients = [
    'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)', // Midnight Fire
    'linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)', // Tropical Sunset
    'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',              // Aqua Sky
    'linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)',              // Royal Purple
    'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',              // Peach Dream
    'linear-gradient(135deg, #360033 0%, #0b8793 100%)',              // Deep Twilight
    'linear-gradient(135deg, #e53935 0%, #e35d5b 100%)',              // Ruby Sunset
    'linear-gradient(135deg, #6a3093 0%, #a044ff 100%)',              // Lavender Glow
    'linear-gradient(135deg, #43c6ac 0%, #f8ffae 100%)',              // Mint Sunrise
    'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',              // Orange Spark
];

const postTitles = [
    "Midnight Fire", "Tropical Sunset", "Aqua Sky", "Royal Purple",
    "Peach Dream", "Deep Twilight", "Ruby Sunset",
    "Lavender Glow", "Mint Sunrise", "Orange Spark"
];

const postContents = [
    "A fiery blend of midnight hues and gold",
    "A vibrant sunset with tropical vibes",
    "Refreshing blue tones of the ocean sky",
    "Deep and majestic purple gradient",
    "Soft and warm peachy tones",
    "Moody deep purple and teal",
    "Vivid red with ruby undertones",
    "Gentle lavender hues with a vibrant glow",
    "Fresh and minty with golden sunlight",
    "Energetic orange tones with a spark of fire"
];

postTitles.forEach((title, index) => {
    const card = createCard(title, postContents[index], postStyleGradients[index]);
    postStyles.appendChild(card);
});


postTitles.forEach((title, index) => {
    const card = createCard(title, postContents[index], postStyleGradients[index]);
    postStyles.appendChild(card);
});


        postTitles.forEach((title, index) => {
            const card = createCard(title, postContents[index], postStyleGradients[index]);
            postStyles.appendChild(card);
        });

        document.body.appendChild(modal);


        modal.offsetHeight;
        modal.classList.add('show');
    };

    const closeModal = (modal) => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    const savedBackground = localStorage.getItem('selectedBackground');
    if (savedBackground) {
        document.documentElement.style.setProperty('--gradient-bg', savedBackground);
    }

    enforceGradients();
    createDropdownItem();
})();