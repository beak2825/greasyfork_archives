// ==UserScript==
// @name         DVD Logo Screensaver
// @version      2.0
// @description  Classic bouncing DVD logo with 21 vibrant colors! Watch it bounce around your screen, change colors on corner hits, and teleport on hover. Pure nostalgia meets interactive fun!
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1126616
// @author       Useless Things Series, Enhanced by UnknownQwertyz
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/470842/DVD%20Logo%20Screensaver.user.js
// @updateURL https://update.greasyfork.org/scripts/470842/DVD%20Logo%20Screensaver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dvdAnimation = {
        dvdLogo: null,
        containerWidth: 0,
        containerHeight: 0,
        x: 0,
        y: 0,
        dx: 3,
        dy: 3,
        cornerHits: 0,
        isVisible: true,

        // 21 vibrant DVD logo color variations
        images: [
            'https://i.ibb.co/BBkFmwK/dvdlogo-01.png',
            'https://i.ibb.co/GP6qcDb/dvdlogo-02.png',
            'https://i.ibb.co/QYG8Lzr/dvdlogo-03.png',
            'https://i.ibb.co/bWMQvFx/dvdlogo-04.png',
            'https://i.ibb.co/dLVrN6r/dvdlogo-05.png',
            'https://i.ibb.co/kJFZxpk/dvdlogo-06.png',
            'https://i.ibb.co/QrhnfTF/dvdlogo-07.png',
            'https://i.ibb.co/tMPGdJj/dvdlogo-08.png',
            'https://i.ibb.co/f2RDDyV/dvdlogo-09.png',
            'https://i.ibb.co/kq0p5TT/dvdlogo-10.png',
            'https://i.ibb.co/fXL06T8/dvdlogo-11.png',
            'https://i.ibb.co/xH52XPW/dvdlogo-12.png',
            'https://i.ibb.co/njL7hzs/dvdlogo-13.png',
            'https://i.ibb.co/1GPx3Mf/dvdlogo-14.png',
            'https://i.ibb.co/T0GBZ1R/dvdlogo-15.png',
            'https://i.ibb.co/pPgRdwx/dvdlogo-16.png',
            'https://i.ibb.co/fpCwPfm/dvdlogo-17.png',
            'https://i.ibb.co/YNHWMnH/dvdlogo-18.png',
            'https://i.ibb.co/R9C2XLG/dvdlogo-19.png',
            'https://i.ibb.co/d7pwDMK/dvdlogo-20.png',
            'https://i.ibb.co/6Fzpmcz/dvdlogo-21.png'
        ],
        currentImageIndex: 0,

        initialize: function() {
            // Create DVD logo element
            this.dvdLogo = document.createElement('div');
            this.dvdLogo.style.cssText = `
                width: 150px;
                height: 100px;
                position: fixed;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                z-index: 999999;
                pointer-events: auto;
                cursor: pointer;
                transition: transform 0.1s ease;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
            `;

            document.body.appendChild(this.dvdLogo);

            // Set initial dimensions
            this.updateDimensions();

            // Random starting position
            this.x = Math.random() * (this.containerWidth - 150);
            this.y = Math.random() * (this.containerHeight - 100);

            // Event listeners
            this.dvdLogo.addEventListener('mouseover', this.onHover.bind(this));
            this.dvdLogo.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            this.dvdLogo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });

            // Handle window resize
            window.addEventListener('resize', this.updateDimensions.bind(this));

            // Keyboard shortcut to toggle visibility (Ctrl + D)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    this.toggleVisibility();
                }
            });

            this.changeImage();
        },

        updateDimensions: function() {
            this.containerWidth = window.innerWidth;
            this.containerHeight = window.innerHeight;
        },

        moveLogo: function() {
            if (!this.isVisible) return;

            this.x += this.dx;
            this.y += this.dy;

            let hitCorner = false;

            // Check horizontal boundaries
            if (this.x + 150 >= this.containerWidth || this.x <= 0) {
                this.dx = -this.dx;
                this.changeImage();

                // Check if it's a corner hit
                if ((this.y <= 5) || (this.y + 100 >= this.containerHeight - 5)) {
                    hitCorner = true;
                }
            }

            // Check vertical boundaries
            if (this.y + 100 >= this.containerHeight || this.y <= 0) {
                this.dy = -this.dy;
                this.changeImage();

                // Check if it's a corner hit
                if ((this.x <= 5) || (this.x + 150 >= this.containerWidth - 5)) {
                    hitCorner = true;
                }
            }

            // Celebrate corner hits!
            if (hitCorner) {
                this.cornerHits++;
                this.celebrateCornerHit();
            }

            this.dvdLogo.style.left = this.x + 'px';
            this.dvdLogo.style.top = this.y + 'px';
        },

        changeImage: function() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            this.dvdLogo.style.backgroundImage = `url("${this.images[this.currentImageIndex]}")`;
        },

        onHover: function() {
            // Teleport to random position on hover
            this.x = Math.floor(Math.random() * (this.containerWidth - 150));
            this.y = Math.floor(Math.random() * (this.containerHeight - 100));
            this.changeImage();

            // Add a fun spin effect
            this.dvdLogo.style.transition = 'transform 0.3s ease';
            this.dvdLogo.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                this.dvdLogo.style.transform = 'rotate(0deg) scale(1)';
            }, 300);
        },

        celebrateCornerHit: function() {
            // Visual celebration for hitting a corner
            this.dvdLogo.style.transition = 'transform 0.2s ease';
            this.dvdLogo.style.transform = 'scale(1.3) rotate(15deg)';
            setTimeout(() => {
                this.dvdLogo.style.transform = 'scale(1) rotate(0deg)';
            }, 200);

            // Show corner hit notification
            this.showNotification(`🎯 Corner Hit #${this.cornerHits}!`);
        },

        toggleVisibility: function() {
            this.isVisible = !this.isVisible;
            this.dvdLogo.style.display = this.isVisible ? 'block' : 'none';

            if (this.isVisible) {
                this.showNotification('📺 DVD Logo: ON');
            } else {
                this.showNotification('📺 DVD Logo: OFF');
            }
        },

        showNotification: function(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 9999999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 16px;
                font-weight: bold;
                pointer-events: none;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    };

    // Animation loop
    function animate() {
        dvdAnimation.moveLogo();
        requestAnimationFrame(animate);
    }

    // Start the magic!
    dvdAnimation.initialize();
    animate();

    console.log('🎬 DVD Logo Screensaver loaded! Hover to teleport. Press Ctrl+D to toggle.');
})();
