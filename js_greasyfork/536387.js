// ==UserScript==
// @name         Roblox FACS Numbering
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add numbers next to FACS names for easier reference | Discord: https://discord.gg/BE7k9Xxm5z
// @author       Cloud Guy
// @license      MIT
// @match        https://create.roblox.com/docs/art/characters/facial-animation/facs-poses-reference*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536387/Roblox%20FACS%20Numbering.user.js
// @updateURL https://update.greasyfork.org/scripts/536387/Roblox%20FACS%20Numbering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FACS = ['EyesLookDown','EyesLookLeft','EyesLookRight','EyesLookUp','JawDrop','LeftEyeClosed','LeftLipCornerPuller','LeftLipStretcher','LeftLowerLipDepressor','LeftUpperLipRaiser','LipsTogether','Pucker','RightEyeClosed','RightLipCornerPuller','RightLipStretcher','RightLowerLipDepressor','RightUpperLipRaiser','ChinRaiser','ChinRaiserUpperLip','FlatPucker','Funneler','LowerLipSuck','LipPresser','MouthLeft','MouthRight','UpperLipSuck','LeftCheekPuff','LeftDimpler','LeftLipCornerDown','RightCheekPuff','RightDimpler','RightLipCornerDown','JawLeft','JawRight','Corrugator','LeftBrowLowerer','LeftOuterBrowRaiser','LeftNoseWrinkler','LeftInnerBrowRaiser','RightBrowLowerer','RightOuterBrowRaiser','RightNoseWrinkler','RightInnerBrowRaiser','LeftCheekRaiser','LeftEyeUpperLidRaiser','RightCheekRaiser','RightEyeUpperLidRaiser','TongueDown','TongueOut','TongueUp'];

    const PAIRS = {
        'LeftEyeClosed': 'RightEyeClosed',
        'RightEyeClosed': 'LeftEyeClosed',
        'LeftLipCornerPuller': 'RightLipCornerPuller',
        'RightLipCornerPuller': 'LeftLipCornerPuller',
        'LeftLipStretcher': 'RightLipStretcher',
        'RightLipStretcher': 'LeftLipStretcher',
        'LeftLowerLipDepressor': 'RightLowerLipDepressor',
        'RightLowerLipDepressor': 'LeftLowerLipDepressor',
        'LeftUpperLipRaiser': 'RightUpperLipRaiser',
        'RightUpperLipRaiser': 'LeftUpperLipRaiser',
        'LeftCheekPuff': 'RightCheekPuff',
        'RightCheekPuff': 'LeftCheekPuff',
        'LeftDimpler': 'RightDimpler',
        'RightDimpler': 'LeftDimpler',
        'LeftLipCornerDown': 'RightLipCornerDown',
        'RightLipCornerDown': 'LeftLipCornerDown',
        'LeftBrowLowerer': 'RightBrowLowerer',
        'RightBrowLowerer': 'LeftBrowLowerer',
        'LeftOuterBrowRaiser': 'RightOuterBrowRaiser',
        'RightOuterBrowRaiser': 'LeftOuterBrowRaiser',
        'LeftNoseWrinkler': 'RightNoseWrinkler',
        'RightNoseWrinkler': 'LeftNoseWrinkler',
        'LeftInnerBrowRaiser': 'RightInnerBrowRaiser',
        'RightInnerBrowRaiser': 'LeftInnerBrowRaiser',
        'LeftCheekRaiser': 'RightCheekRaiser',
        'RightCheekRaiser': 'LeftCheekRaiser',
        'LeftEyeUpperLidRaiser': 'RightEyeUpperLidRaiser',
        'RightEyeUpperLidRaiser': 'LeftEyeUpperLidRaiser',
        'JawLeft': 'JawRight',
        'JawRight': 'JawLeft',
        'MouthLeft': 'MouthRight',
        'MouthRight': 'MouthLeft',
        'EyesLookLeft': 'EyesLookRight',
        'EyesLookRight': 'EyesLookLeft',
        'EyesLookUp': 'EyesLookDown',
        'EyesLookDown': 'EyesLookUp'
    };

    const THEME = {
        primary: '#60A5FA',
        primaryDark: '#3B82F6',
        accent: '#93C5FD',
        background: '#111216',
        cardBg: '#1a1b20',
        textPrimary: '#ffffff',
        textSecondary: '#cccccc',
        highlight: 'rgba(96, 165, 250, 0.10)',
        highlightHover: 'rgba(96, 165, 250, 0.18)',
        inactive: '#3a3b40',
        inactiveDark: '#2a2b30',
        shadow: 'rgba(0, 0, 0, 0.3)'
    };

    const elemCache = {
        sections: [],
        tocItems: [],
        lastHighlighted: '',
        sidebar: null,
        discordButton: null,
        toggleButton: null,
        indicator: null,
        marker: null
    };

    function addStyles() {
        const css = `
            .facs-highlight {
                background: linear-gradient(135deg, ${THEME.highlight} 0%, rgba(96, 165, 250, 0.18) 100%);
                font-weight: 600;
                border-radius: 8px;
                box-shadow: 0 4px 12px ${THEME.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05);
                opacity: 1;
                transform: translateX(0);
                transition: all 0.2s ease-out;
            }

            .facs-highlight-sidebar {
                border-left: 3px solid ${THEME.primary};
                padding-left: 8px;
            }

            .facs-highlight:hover {
                background: linear-gradient(135deg, ${THEME.highlightHover} 0%, rgba(96, 165, 250, 0.28) 100%);
                transform: translateX(4px) scale(1.02);
                box-shadow: 0 6px 20px ${THEME.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.1);
                transition: all 0.15s ease-out;
            }

            .toc-active {
                background: linear-gradient(135deg, rgba(0, 162, 255, 0.15) 0%, rgba(0, 102, 204, 0.25) 100%);
                font-weight: 600;
                border-left: 3px solid ${THEME.primary};
                padding-left: 8px;
                border-radius: 8px;
                box-shadow: 0 2px 8px ${THEME.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .toc-active:hover {
                background: linear-gradient(135deg, rgba(0, 162, 255, 0.25) 0%, rgba(0, 102, 204, 0.35) 100%);
                transform: translateX(4px);
            }

            #facs-discord {
                position: fixed;
                top: 15px;
                right: 20px;
                background: linear-gradient(135deg, ${THEME.inactive} 0%, ${THEME.inactiveDark} 100%);
                color: ${THEME.textSecondary};
                padding: 10px;
                border-radius: 12px;
                text-decoration: none;
                z-index: 9999;
                box-shadow: 0 4px 16px ${THEME.shadow};
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid ${THEME.cardBg};
                width: 40px;
                height: 40px;
            }

            #facs-discord:hover {
                transform: scale(1.15) translateY(-4px);
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 4px 15px rgba(255, 255, 255, 0.1);
                background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%);
                color: ${THEME.textPrimary};
                border-color: #7289DA;
                animation: pulse 1.5s infinite;
            }

            #facs-highlight-toggle {
                position: fixed;
                top: 70px;
                right: 20px;
                background: linear-gradient(135deg, ${THEME.inactive} 0%, ${THEME.inactiveDark} 100%);
                color: ${THEME.textPrimary};
                padding: 8px 12px;
                border-radius: 10px;
                border: none;
                font-weight: 500;
                font-size: 12px;
                font-family: system-ui, -apple-system, sans-serif;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 3px 12px ${THEME.shadow};
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: auto;
                letter-spacing: 0.025em;
            }

            #facs-highlight-toggle:hover {
                transform: scale(1.08) translateY(-2px);
                box-shadow: 0 8px 25px rgba(96, 165, 250, 0.3), 0 4px 12px ${THEME.shadow};
                animation: togglePulse 1.5s infinite;
            }

            #facs-highlight-toggle.enabled {
                background: linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%);
            }

            #facs-highlight-toggle.enabled:hover {
                background: linear-gradient(135deg, ${THEME.accent} 0%, ${THEME.primary} 100%);
            }

            #facs-scrollbar-indicator {
                position: fixed;
                top: 15%;
                width: 3px;
                height: 70%;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 2px;
                z-index: 9998;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            #facs-indicator-marker {
                position: absolute;
                left: -2px;
                width: 7px;
                height: 18px;
                background: ${THEME.primary};
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(96, 165, 250, 0.4);
                transition: all 0.15s ease;
                opacity: 0;
            }

            @keyframes pulse {
                0%, 100% { box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 4px 15px rgba(255, 255, 255, 0.1), 0 0 0 0 rgba(88, 101, 242, 0.7); }
                50% { box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 4px 15px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(88, 101, 242, 0); }
            }

            @keyframes togglePulse {
                0%, 100% { box-shadow: 0 8px 25px rgba(96, 165, 250, 0.3), 0 4px 12px ${THEME.shadow}, 0 0 0 0 rgba(96, 165, 250, 0.7); }
                50% { box-shadow: 0 8px 25px rgba(96, 165, 250, 0.3), 0 4px 12px ${THEME.shadow}, 0 0 0 8px rgba(96, 165, 250, 0); }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    const createTextNodeWalker = (root) => {
        return document.createTreeWalker(
            root || document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
    };

    const throttle = (callback, delay) => {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return callback(...args);
        };
    };

    function numberFACS() {
        try {
            const walker = createTextNodeWalker();
            let node;

            function processTextNodes(deadline) {
                const startTime = performance.now();

                while ((node = walker.nextNode()) && (performance.now() - startTime < 10)) {
                    const text = node.textContent.trim();
                    const index = FACS.indexOf(text);
                    if (index !== -1 && !text.match(/^\d+\.\s/)) {
                        node.textContent = `${index + 1}. ${text}`;
                    }
                }

                if (node) {
                    requestIdleCallback(processTextNodes);
                } else {
                    numberSidebarElements();
                }
            }

            requestIdleCallback(processTextNodes);
        } catch (e) {
            console.log('FACS numbering error:', e);
        }
    }

    function numberSidebarElements() {
        try {
            const sidebarLinksSelector = 'nav a, .toc a, aside a, [class*="sidebar"] a, [class*="navigation"] a, [class*="nav"] a';
            const sidebarLinks = document.querySelectorAll(sidebarLinksSelector);

            const fragment = document.createDocumentFragment();

            sidebarLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const facsName = href.substring(1);
                    const index = FACS.indexOf(facsName);

                    if (index !== -1) {
                        const text = link.textContent.trim();
                        if (!text.match(/^\d+\.\s/)) {
                            const updatedLink = link.cloneNode(true);
                            updatedLink.textContent = `${index + 1}. ${text}`;
                            fragment.appendChild(updatedLink);
                            link.parentNode.replaceChild(updatedLink, link);
                        }
                    }
                }
            });

            const sidebarContainers = document.querySelectorAll('nav, .toc, aside, [class*="sidebar"], [class*="navigation"], [class*="nav"]');

            sidebarContainers.forEach(container => {
                const walker = createTextNodeWalker(container);
                let node;

                while (node = walker.nextNode()) {
                    const text = node.textContent.trim();
                    const index = FACS.indexOf(text);
                    if (index !== -1 && !node.textContent.match(/^\d+\.\s/)) {
                        node.textContent = `${index + 1}. ${text}`;
                    }
                }
            });
        } catch (e) {
            console.log('Sidebar numbering error:', e);
        }
    }

    function forceNumberAllFACS() {
        try {
            const walker = createTextNodeWalker();
            let node;

            const facsIndexMap = new Map();
            FACS.forEach((name, index) => {
                facsIndexMap.set(name, index);
            });

            while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                const index = facsIndexMap.get(text);
                if (index !== undefined) {
                    node.textContent = `${index + 1}. ${text}`;
                    continue;
                }

                for (let i = 0; i < FACS.length; i++) {
                    if (text === FACS[i] || text.endsWith(FACS[i])) {
                        if (!text.startsWith(`${i + 1}.`)) {
                            node.textContent = `${i + 1}. ${FACS[i]}`;
                        }
                        break;
                    }
                }
            }

            numberSidebarElements();
        } catch (e) {
            console.log('Force numbering error:', e);
        }
    }

    function addDiscord() {
        try {
            if (document.getElementById('facs-discord') || elemCache.discordButton) return;

            const link = document.createElement('a');
            link.id = 'facs-discord';
            link.href = 'https://discord.gg/BE7k9Xxm5z';
            link.target = '_blank';
            link.rel = 'noopener';
            link.title = 'Join My Discord';

            link.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink: 0;">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.3-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
            </svg>`;

            link.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.1) translateY(-2px)';
                }, 100);
            });

            elemCache.discordButton = link;
            document.body.appendChild(link);
        } catch (e) {
            console.log('Discord button error:', e);
        }
    }

    function addHighlightToggle() {
        try {
            if (document.getElementById('facs-highlight-toggle') || elemCache.toggleButton) return;

            const toggleButton = document.createElement('button');
            toggleButton.id = 'facs-highlight-toggle';
            toggleButton.title = 'Toggle FACS Highlighting';

            document.body.setAttribute('data-facs-highlight', 'disabled');
            toggleButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    <path d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Toggle Highlight
            `;

            toggleButton.addEventListener('click', toggleHighlightMode);

            elemCache.toggleButton = toggleButton;
            document.body.appendChild(toggleButton);
        } catch (e) {
            console.log('Highlight toggle button error:', e);
        }
    }

    function toggleHighlightMode() {
        const button = elemCache.toggleButton || document.getElementById('facs-highlight-toggle');
        if (!button) return;

        button.style.transform = 'scale(1.05) translateY(-2px)';
        button.style.transition = 'transform 0.1s ease';

        setTimeout(() => {
            button.style.transform = 'scale(1) translateY(0)';
            button.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 100);

        const isHighlightEnabled = document.body.getAttribute('data-facs-highlight') !== 'disabled';
        if (isHighlightEnabled) {
            document.body.setAttribute('data-facs-highlight', 'disabled');
            button.classList.remove('enabled');
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    <path d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Toggle Highlight
            `;

            document.querySelectorAll('.facs-highlight').forEach(el => {
                el.style.transition = 'all 0.15s ease-out';
                el.style.background = 'transparent';
                el.style.boxShadow = 'none';

                requestAnimationFrame(() => {
                    el.classList.remove('facs-highlight', 'facs-highlight-sidebar');
                    setTimeout(() => {
                        el.style.cssText = '';
                    }, 150);
                });
            });

            document.querySelectorAll('.toc-active').forEach(el => {
                el.style.transition = 'all 0.25s ease';
                el.style.transform = 'scale(0.95)';
                el.style.opacity = '0.7';

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        el.classList.remove('toc-active');
                        el.style.transform = '';
                        el.style.opacity = '';
                        el.style.transition = '';
                    }, 250);
                });
            });

            if (elemCache.indicator) {
                elemCache.indicator.style.opacity = '0';
            }
        } else {
            document.body.setAttribute('data-facs-highlight', 'enabled');
            button.classList.add('enabled');
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                Toggle Highlight
            `;

            highlightPairs();
            checkActiveSection();
        }
    }

    function highlightPairs() {
        try {
            const isHighlightEnabled = document.body.getAttribute('data-facs-highlight') !== 'disabled';
            if (!isHighlightEnabled) return;

            document.querySelectorAll('.facs-highlight').forEach(el => {
                el.classList.remove('facs-highlight', 'facs-highlight-sidebar');
                el.style.cssText = '';
            });

            const hash = window.location.hash.slice(1);
            if (!hash) return;

            const matchedFACS = FACS.find(f => f.toLowerCase() === hash.toLowerCase());
            if (!matchedFACS) return;

            const pair = PAIRS[matchedFACS];
            if (!pair && matchedFACS !== 'neutral') return;

            const fragment = document.createDocumentFragment();

            const walker = createTextNodeWalker();
            let node;

            const targetTexts = new Set([matchedFACS]);
            if (pair) targetTexts.add(pair);

            function processNodes(deadline) {
                const startTime = performance.now();

                while ((node = walker.nextNode()) && (performance.now() - startTime < 5)) {
                    const text = node.textContent.replace(/^\d+\.\s*/, '').trim();
                    if (targetTexts.has(text)) {
                        const parent = node.parentElement;
                        if (parent) {
                            parent.classList.add('facs-highlight');

                            parent.style.opacity = '0';
                            parent.style.transform = 'translateX(-8px)';

                            requestAnimationFrame(() => {
                                parent.style.opacity = '1';
                                parent.style.transform = 'translateX(0)';

                                if (parent.tagName === 'A' || parent.closest('nav, .toc')) {
                                    parent.classList.add('facs-highlight-sidebar');
                                }
                            });
                        }
                    }
                }

                if (node) {
                    requestAnimationFrame(() => processNodes());
                } else {
                    elemCache.lastHighlighted = hash;
                    updateScrollbarIndicator();
                }
            }

            requestAnimationFrame(processNodes);
        } catch (e) {
            console.log('Highlight error:', e);
        }
    }

    function addScrollbarIndicator() {
        try {
            if (document.getElementById('facs-scrollbar-indicator') || elemCache.indicator) return;

            let sidebar = document.querySelector('nav, .sidebar, [class*="sidebar"], [class*="navigation"]');
            if (!sidebar) {
                const facsElements = document.querySelectorAll('a[href^="#EyesLook"], a[href^="#JawDrop"]');
                if (facsElements.length > 0) {
                    sidebar = facsElements[0].closest('nav, div, ul, ol') || facsElements[0].parentElement;
                }
            }

            if (!sidebar) return;

            elemCache.sidebar = sidebar;

            const indicator = document.createElement('div');
            indicator.id = 'facs-scrollbar-indicator';

            const marker = document.createElement('div');
            marker.id = 'facs-indicator-marker';

            indicator.appendChild(marker);

            const updateIndicatorPosition = () => {
                const sidebarRect = elemCache.sidebar.getBoundingClientRect();
                indicator.style.left = `${sidebarRect.right + 8}px`;
            };

            elemCache.indicator = indicator;
            elemCache.marker = marker;

            updateIndicatorPosition();

            window.addEventListener('resize', throttle(updateIndicatorPosition, 100));

            document.body.appendChild(indicator);
        } catch (e) {
            console.log('Scrollbar indicator error:', e);
        }
    }

    function updateScrollbarIndicator() {
        try {
            const indicator = elemCache.indicator || document.getElementById('facs-scrollbar-indicator');
            const marker = elemCache.marker || document.getElementById('facs-indicator-marker');

            if (!indicator || !marker) return;

            const isHighlightEnabled = document.body.getAttribute('data-facs-highlight') !== 'disabled';
            if (!isHighlightEnabled) {
                indicator.style.opacity = '0';
                return;
            }

            const activeHighlight = document.querySelector('.facs-highlight');
            if (activeHighlight) {
                indicator.style.opacity = '1';

                const facsMap = new Map();
                FACS.forEach(name => facsMap.set(name, true));

                const allFacsItems = document.querySelectorAll('a[href^="#"], nav a, .sidebar a');
                let facsIndex = -1;
                let totalFacs = 0;
                const currentHash = window.location.hash.slice(1);

                allFacsItems.forEach((item) => {
                    const href = item.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        const facsName = href.substring(1);
                        if (facsMap.has(facsName)) {
                            if (item.classList.contains('facs-highlight') || item.textContent.includes(currentHash)) {
                                facsIndex = totalFacs;
                            }
                            totalFacs++;
                        }
                    }
                });

                if (facsIndex >= 0 && totalFacs > 0) {
                    const relativePosition = facsIndex / Math.max(1, totalFacs - 1);
                    const indicatorHeight = indicator.offsetHeight;
                    const markerPosition = relativePosition * (indicatorHeight - 18);

                    marker.style.top = `${Math.max(0, Math.min(markerPosition, indicatorHeight - 18))}px`;
                    marker.style.opacity = '1';
                } else {
                    marker.style.opacity = '0';
                }
            } else {
                marker.style.opacity = '0';
                indicator.style.opacity = '0';
            }
        } catch (e) {
            console.log('Scrollbar indicator update error:', e);
        }
    }

    function collectElements() {
        const facsSet = new Set(FACS);

        elemCache.sections = Array.from(document.querySelectorAll('h2, h3, h4')).filter(heading => {
            const headingText = heading.textContent;
            for (const facs of FACS) {
                if (headingText.includes(facs)) {
                    return true;
                }
            }
            return heading.id && facsSet.has(heading.id);
        });

        elemCache.tocItems = Array.from(document.querySelectorAll('nav a[href^="#"], .toc a[href^="#"]'));
    }

    function updateTOCActiveState(sectionId) {
        const isHighlightEnabled = document.body.getAttribute('data-facs-highlight') !== 'disabled';
        if (!isHighlightEnabled) return;

        const tocItems = elemCache.tocItems.length ? elemCache.tocItems :
            document.querySelectorAll('nav a[href^="#"], .toc a[href^="#"]');

        tocItems.forEach(item => {
            item.classList.remove('toc-active');
        });

        const activeItem = tocItems.find(item => item.getAttribute('href') === `#${sectionId}`);
        if (activeItem) {
            activeItem.classList.add('toc-active');
        }
    }

    function checkActiveSection() {
        try {
            const isHighlightEnabled = document.body.getAttribute('data-facs-highlight') !== 'disabled';
            if (!isHighlightEnabled) return;

            if (elemCache.sections.length === 0 || elemCache.tocItems.length === 0) {
                collectElements();
            }

            const scrollPosition = window.scrollY || document.documentElement.scrollTop;

            const viewportHeight = window.innerHeight;
            const referencePoint = scrollPosition + (viewportHeight * 0.2);

            let activeSection = null;
            let minDistance = Infinity;

            elemCache.sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollPosition;
                const distance = Math.abs(sectionTop - referencePoint);

                if (distance < minDistance) {
                    minDistance = distance;
                    activeSection = section;
                }
            });

            if (activeSection) {
                let sectionId = activeSection.id;

                if (!sectionId) {
                    for (const facs of FACS) {
                        if (activeSection.textContent.includes(facs)) {
                            sectionId = facs;
                            break;
                        }
                    }
                }

                if (sectionId && sectionId !== window.location.hash.slice(1)) {
                    history.replaceState(null, null, `#${sectionId}`);
                    highlightPairs();
                    updateTOCActiveState(sectionId);
                }
            }
        } catch (e) {
            console.log('Section check error:', e);
        }
    }

    function init() {
        addStyles();

        numberFACS();

        requestIdleCallback(() => {
            forceNumberAllFACS();
            addDiscord();
            addHighlightToggle();
            addScrollbarIndicator();
            collectElements();

            setTimeout(() => {
                checkActiveSection();
            }, 500);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('hashchange', () => {
        highlightPairs();

        const hash = window.location.hash.slice(1);
        if (hash) {
            updateTOCActiveState(hash);
        }
    });

    window.addEventListener('scroll', throttle(checkActiveSection, 150), { passive: true });

    const observer = new MutationObserver(function(mutations) {
        const needsUpdate = mutations.some(mutation =>
            mutation.type === 'childList' ||
            (mutation.type === 'attributes' && mutation.target.nodeName !== 'BODY')
        );

        if (needsUpdate) {
            clearTimeout(window.facsUpdateTimeout);
            window.facsUpdateTimeout = setTimeout(() => {
                forceNumberAllFACS();
                collectElements();
                checkActiveSection();
            }, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id', 'href']
    });
})();