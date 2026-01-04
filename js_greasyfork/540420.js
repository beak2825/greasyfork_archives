// ==UserScript==
// @name        YouTube Player Bottom Bar Top Fix
// @namespace   http://tampermonkey.net/
// @match       https://www.youtube.com/*
// @run-at      document-start
// @grant       none
// @version     1.3
// @author      Sergi0
// @description Adds a toggle button to move YouTube's player control bar between top and bottom positions.
// @description:es Añade un botón para alternar la barra de controles del reproductor de YouTube entre arriba y abajo.
// @description:fr Ajoute un bouton pour basculer la barre de contrôle du lecteur YouTube entre le haut et le bas.
// @description:de Fügt eine Schaltfläche hinzu, um die Steuerleiste des YouTube-Players zwischen oben und unten zu wechseln.
// @description:it Aggiunge un pulsante per alternare la barra di controllo del lettore YouTube tra alto e basso.
// @icon        https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @license     MIT
// @homepage    https://greasyfork.org/es/scripts/540420-youtube-player-bottom-bar-top-fix
// @downloadURL https://update.greasyfork.org/scripts/540420/YouTube%20Player%20Bottom%20Bar%20Top%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/540420/YouTube%20Player%20Bottom%20Bar%20Top%20Fix.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Load saved preference (default: bottom/normal)
    let barOnTop = localStorage.getItem('ytBarPosition') === 'top';
    
    // Tooltip distance below the bar when it's on top (-80px to appear above)
    const TOOLTIP_DISTANCE = -80;

    function applyStyles() {
        if (!window.location.pathname.startsWith('/watch')) return;
        const bar = document.querySelector('.ytp-chrome-bottom');
        if (bar) {
            if (barOnTop) {
                bar.style.setProperty('top', '0', 'important');
                bar.style.setProperty('bottom', 'auto', 'important');
            } else {
                bar.style.removeProperty('top');
                bar.style.removeProperty('bottom');
            }
        }
    }

    function fixTooltipPosition() {
        if (!barOnTop || !window.location.pathname.startsWith('/watch')) return;

        const tooltips = document.querySelectorAll('.ytp-tooltip');
        const bar = document.querySelector('.ytp-chrome-bottom');
        
        if (!bar) return;

        tooltips.forEach(tooltip => {
            // Only process visible tooltips
            if (tooltip.offsetParent === null) return;

            const barRect = bar.getBoundingClientRect();
            
            // Calculate new position with configured distance
            const newTop = barRect.bottom + TOOLTIP_DISTANCE;
            
            // Disable top transition to prevent sliding animation
            tooltip.style.setProperty('transition', 'transform 0.2s cubic-bezier(0.05, 0, 0, 1), opacity 0.2s cubic-bezier(0.05, 0, 0, 1)', 'important');
            
            // Apply new position
            tooltip.style.setProperty('top', `${newTop}px`, 'important');
            
            // Change to ytp-top so arrow points up (towards the bar)
            if (tooltip.classList.contains('ytp-bottom')) {
                tooltip.classList.remove('ytp-bottom');
                tooltip.classList.add('ytp-top');
            }
        });
    }

    function resetTooltips() {
        const tooltips = document.querySelectorAll('.ytp-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.removeProperty('top');
            tooltip.style.removeProperty('transition');
            if (tooltip.classList.contains('ytp-top') && !tooltip.classList.contains('ytp-bottom')) {
                tooltip.classList.remove('ytp-top');
                tooltip.classList.add('ytp-bottom');
            }
        });
    }

    function createToggleButton() {
        // Remove existing button if present
        const existingBtn = document.getElementById('yt-bar-toggle-btn-fixed');
        if (existingBtn) {
            console.log('⚠️ Button already exists, not creating another');
            return;
        }

        // Verify we're on a video page
        if (!window.location.pathname.startsWith('/watch')) {
            console.log('⚠️ Not on /watch page, button not created');
            return;
        }

        console.log('✅ Creating toggle button...');

        // Create the button
        const btn = document.createElement('button');
        btn.id = 'yt-bar-toggle-btn-fixed';
        btn.textContent = barOnTop ? '↓ Bar Down' : '↑ Bar Up';
        btn.title = barOnTop ? 'Move bar to normal position' : 'Move bar to top';

        // Find the #player container
        const playerContainer = document.querySelector('#player');

        if (!playerContainer) {
            console.log('⚠️ #player not found');
            return;
        }

        // Ensure container has position relative
        if (!playerContainer.style.position || playerContainer.style.position === 'static') {
            playerContainer.style.position = 'relative';
        }

        // Button styles - Inside player container, center right
        Object.assign(btn.style, {
            position: 'absolute',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            zIndex: '1000',
            padding: '10px 18px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'auto'
        });

        console.log('✅ Button styles applied');

        // Hover effects
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            btn.style.color = 'black';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            btn.style.transform = 'translateY(-50%) scale(1.05)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            btn.style.color = 'white';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            btn.style.transform = 'translateY(-50%) scale(1)';
        });

        // Button functionality
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            barOnTop = !barOnTop;
            localStorage.setItem('ytBarPosition', barOnTop ? 'top' : 'bottom');
            btn.textContent = barOnTop ? '↓ Bar Down' : '↑ Bar Up';
            btn.title = barOnTop ? 'Move bar to normal position' : 'Move bar to top';
            applyStyles();
            
            // Reset or apply fix to tooltips based on new position
            if (!barOnTop) {
                resetTooltips();
            }
            
            console.log('🔄 Position changed to:', barOnTop ? 'TOP' : 'BOTTOM');
        });

        // Add directly to #player container
        playerContainer.appendChild(btn);
        console.log('✅ Button added to #player');
        console.log('📍 Button position:', btn.getBoundingClientRect());
    }

    function removeButtonIfNotOnWatch() {
        if (!window.location.pathname.startsWith('/watch')) {
            const btn = document.getElementById('yt-bar-toggle-btn-fixed');
            if (btn) btn.remove();
        }
    }

    // Try to create button every second if it doesn't exist
    setInterval(() => {
        if (window.location.pathname.startsWith('/watch')) {
            if (!document.getElementById('yt-bar-toggle-btn-fixed')) {
                console.log('🔄 Attempting to create button...');
                createToggleButton();
            }
        } else {
            removeButtonIfNotOnWatch();
        }
    }, 1000);

    // Observer that constantly monitors
    const observer = new MutationObserver(() => {
        if (window.location.pathname.startsWith('/watch')) {
            applyStyles();
            fixTooltipPosition(); // Apply tooltip fix
            if (!document.getElementById('yt-bar-toggle-btn-fixed')) {
                createToggleButton();
            }
        } else {
            removeButtonIfNotOnWatch();
        }
    });

    // Specific observer for tooltips (more efficient)
    const tooltipObserver = new MutationObserver((mutations) => {
        if (!barOnTop) return;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('ytp-tooltip')) {
                    // Small delay to let YouTube calculate initial position
                    setTimeout(() => fixTooltipPosition(), 10);
                }
            });
        });
    });

    // Debug function
    function debugInfo() {
        const info = {
            'Button exists': !!document.getElementById('yt-bar-toggle-btn-fixed'),
            'Pathname': window.location.pathname,
            'Is watch page': window.location.pathname.startsWith('/watch'),
            'localStorage barPosition': localStorage.getItem('ytBarPosition'),
            'Body exists': !!document.body,
            'Bar on top': barOnTop,
            'Tooltip distance': TOOLTIP_DISTANCE + 'px',
            'Timestamp': new Date().toLocaleTimeString()
        };

        console.log('=== YT BAR TOGGLE DEBUG ===');
        console.table(info);
        console.log('===========================');

        return info;
    }

    // Expose debug function globally
    window.ytBarToggleDebug = debugInfo;

    // Wait for body to exist
    function init() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Observer for tooltips
            tooltipObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            applyStyles();
            createToggleButton();

            // Initial debug
            setTimeout(() => {
                console.log('=== INIT COMPLETE ===');
                debugInfo();
            }, 2000);
        } else {
            setTimeout(init, 100);
        }
    }

    init();

    // Listener for SPA navigation
    document.addEventListener('yt-navigate-finish', () => {
        applyStyles();
        removeButtonIfNotOnWatch();
        if (window.location.pathname.startsWith('/watch')) {
            setTimeout(createToggleButton, 500);
        }
    });

    // Listener for when player state changes
    document.addEventListener('yt-player-updated', () => {
        applyStyles();
        fixTooltipPosition();
    });

    // Continuous fix for tooltips while moving mouse
    document.addEventListener('mousemove', () => {
        if (barOnTop) {
            fixTooltipPosition();
        }
    });
})();