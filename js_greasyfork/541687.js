// ==UserScript==
// @name         STAR WARS - Enhanced Battle Effects & Chat Filter
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Complete Enhanced Attack/Heal Effects with Advanced Chat Filtering for Milky Way Idle
// @author       Grogu2484
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541687/STAR%20WARS%20-%20Enhanced%20Battle%20Effects%20%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/541687/STAR%20WARS%20-%20Enhanced%20Battle%20Effects%20%20Chat%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = {
        tracker0: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 1", healColor: { r: 0, g: 100, b: 255 } },
        tracker1: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 2", healColor: { r: 0, g: 100, b: 255 } },
        tracker2: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 3", healColor: { r: 0, g: 100, b: 255 } },
        tracker3: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 4", healColor: { r: 0, g: 100, b: 255 } },
        tracker4: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 5", healColor: { r: 0, g: 100, b: 255 } },
        tracker6: { enabled: true, heal: true, r: 255, g: 0, b: 0, name: "Enemies", healColor: { r: 255, g: 0, b: 0 } },
        missedLine: { enabled: true },
        moreEffect: { enabled: true },
        animationStyle: { value: 'smooth' },
        lineThickness: { value: 3 },
        particleCount: { value: 10 },
        glowIntensity: { value: 5 },
        soundEnabled: { enabled: false },
        chatFilter: {
            enabled: { enabled: true },
            hideChinese: { enabled: true },
            hideJapanese: { enabled: false },
            hideKorean: { enabled: false },
            hideArabic: { enabled: false },
            hideRussian: { enabled: false },
            hideSpam: { enabled: false },
            hideLinks: { enabled: false },
            hideAllCaps: { enabled: false },
            customWords: { value: '' },
            whitelistUsers: { value: '' },
            showHiddenCount: { enabled: false },
            fadeInsteadOfHide: { enabled: false }
        },
        controlPanel: {
            showNewBattleNotifications: { enabled: false },
            showToastNotifications: { enabled: true }
        }
    };

    const saved = localStorage.getItem("tracker_settings_enhanced");
    if (saved) Object.assign(settings, JSON.parse(saved));

    const AnimationManager = {
        maxPaths: 75,
        activePaths: new Set(),
        cooldown: false,
        stats: { total: 0, active: 0 },

        canCreate() {
            if (this.cooldown) return false;
            if (this.activePaths.size >= this.maxPaths) {
                this.triggerCooldown();
                return false;
            }
            return true;
        },

        addPath(path) { 
            this.activePaths.add(path);
            this.stats.total++;
            this.stats.active = this.activePaths.size;
        },
        
        removePath(path) { 
            this.activePaths.delete(path);
            this.stats.active = this.activePaths.size;
        },

        triggerCooldown() {
            this.activePaths.clear();
            const svg = document.getElementById('svg-container-enhanced');
            if (svg) svg.innerHTML = '';
            
            this.showEnhancedToast('🔥 Animation limit reached! Cooling down for 3 seconds...', 'warning');
            this.cooldown = true;
            setTimeout(() => {
                this.cooldown = false;
                this.showEnhancedToast('✨ Ready for more epic battles!', 'success');
            }, 3000);
        },

        showEnhancedToast(msg, type = 'info') {
            if (!settings.controlPanel.showToastNotifications.enabled) return;
            
            const toast = document.createElement('div');
            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">
                        ${type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
                    </span>
                    <span>${msg}</span>
                </div>
            `;
            
            const bgColor = type === 'warning' ? 'rgba(255,193,7,0.9)' : 
                           type === 'success' ? 'rgba(40,167,69,0.9)' : 
                           'rgba(23,162,184,0.9)';
            
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: ${bgColor};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 10000;
                font-weight: bold;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                animation: slideIn 0.5s ease-out;
            `;
            
            if (!document.getElementById('toast-animations')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'toast-animations';
                styleEl.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(styleEl);
            }
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.5s ease-in';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }
    };

    const ChatFilter = {
        hiddenCount: 0,
        totalMessages: 0,
        countDisplay: null,

        patterns: {
            chinese: /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/,
            japanese: /[\u3040-\u309F\u30A0-\u30FF]/,
            korean: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
            arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/,
            russian: /[\u0400-\u04FF]/,
            url: /(?:https?:\/\/|www\.)[^\s]+/i,
            allCaps: /^[A-Z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
        },

        init() {
            this.createCountDisplay();
            this.startObserver();
        },

        createCountDisplay() {
            if (this.countDisplay || !settings.chatFilter.showHiddenCount.enabled) return;
            
            this.countDisplay = document.createElement('div');
            this.countDisplay.style.cssText = `
                position: fixed;
                top: 50px;
                right: 10px;
                background: linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.9) 100%);
                border: 1px solid #0f3460;
                border-radius: 8px;
                padding: 8px 12px;
                color: #26de81;
                font-family: 'Segoe UI', sans-serif;
                font-size: 12px;
                font-weight: bold;
                z-index: 1001;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                cursor: pointer;
                display: ${settings.chatFilter.showHiddenCount.enabled ? 'block' : 'none'};
            `;
            
            this.updateCountDisplay();
            document.body.appendChild(this.countDisplay);
            
            this.countDisplay.addEventListener('click', () => {
                this.showFilteredMessages();
            });
        },

        updateCountDisplay() {
            if (!this.countDisplay) return;
            
            this.countDisplay.innerHTML = `
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 14px;">🛡️</span>
                    <div>
                        <div>Filtered: ${this.hiddenCount}</div>
                        <div style="font-size: 10px; opacity: 0.7;">Total: ${this.totalMessages}</div>
                    </div>
                </div>
            `;
        },

        showFilteredMessages() {
            const hiddenElements = document.querySelectorAll('[data-chat-hidden="true"]');
            const isCurrentlyShowing = hiddenElements.length > 0 && hiddenElements[0].style.display !== 'none';
            
            hiddenElements.forEach(el => {
                if (isCurrentlyShowing) {
                    if (settings.chatFilter.fadeInsteadOfHide.enabled) {
                        el.style.opacity = '0.3';
                    } else {
                        el.style.display = 'none';
                    }
                } else {
                    el.style.display = '';
                    el.style.opacity = '1';
                }
            });
            
            this.countDisplay.style.backgroundColor = isCurrentlyShowing ? 
                'rgba(255,107,107,0.2)' : 'rgba(38,222,129,0.2)';
                
            if (settings.controlPanel.showToastNotifications.enabled) {
                AnimationManager.showEnhancedToast(
                    isCurrentlyShowing ? '🙈 Hidden messages concealed' : '👁️ Hidden messages revealed',
                    'info'
                );
            }
        },

        shouldHideMessage(textContent, username = '') {
            if (!settings.chatFilter.enabled.enabled) return false;
            
            const whitelistedUsers = settings.chatFilter.whitelistUsers.value
                .split(',').map(u => u.trim().toLowerCase()).filter(u => u);
            if (whitelistedUsers.includes(username.toLowerCase())) return false;
            
            const text = textContent.trim();
            if (!text) return false;
            
            if (settings.chatFilter.hideChinese.enabled && this.patterns.chinese.test(text)) return true;
            if (settings.chatFilter.hideJapanese.enabled && this.patterns.japanese.test(text)) return true;
            if (settings.chatFilter.hideKorean.enabled && this.patterns.korean.test(text)) return true;
            if (settings.chatFilter.hideArabic.enabled && this.patterns.arabic.test(text)) return true;
            if (settings.chatFilter.hideRussian.enabled && this.patterns.russian.test(text)) return true;
            
            if (settings.chatFilter.hideLinks.enabled && this.patterns.url.test(text)) return true;
            if (settings.chatFilter.hideAllCaps.enabled && text.length > 5 && this.patterns.allCaps.test(text)) return true;
            
            if (settings.chatFilter.hideSpam.enabled) {
                const repeatedChars = /(.)\1{4,}/.test(text);
                const excessivePunctuation = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{5,}/.test(text);
                if (repeatedChars || excessivePunctuation) return true;
            }
            
            const customWords = settings.chatFilter.customWords.value
                .split(',').map(w => w.trim().toLowerCase()).filter(w => w);
            if (customWords.some(word => text.toLowerCase().includes(word))) return true;
            
            return false;
        },

        hideElement(element, reason = 'filtered') {
            element.setAttribute('data-chat-hidden', 'true');
            element.setAttribute('data-chat-filter-reason', reason);
            
            if (settings.chatFilter.fadeInsteadOfHide.enabled) {
                element.style.opacity = '0.3';
                element.style.filter = 'blur(1px)';
            } else {
                element.style.display = 'none';
            }
            
            this.hiddenCount++;
            this.updateCountDisplay();
        },

        processTextNode(node) {
            if (node.nodeType !== Node.TEXT_NODE) return;
            
            const text = node.textContent;
            if (!text || text.trim().length === 0) return;
            
            let username = '';
            let current = node.parentElement;
            while (current && !username) {
                const usernameEl = current.querySelector('[class*="username"], [class*="name"], [class*="user"]');
                if (usernameEl) username = usernameEl.textContent;
                current = current.parentElement;
            }
            
            if (this.shouldHideMessage(text, username)) {
                let messageContainer = node.parentElement;
                while (messageContainer && !messageContainer.classList.contains('message') && 
                       !messageContainer.querySelector('[class*="message"]')) {
                    messageContainer = messageContainer.parentElement;
                    if (messageContainer === document.body) break;
                }
                
                if (messageContainer && messageContainer !== document.body) {
                    this.hideElement(messageContainer, 'content-filter');
                }
            }
            
            this.totalMessages++;
        },

        startObserver() {
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            this.processTextNode(node);
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            const walker = document.createTreeWalker(
                                node,
                                NodeFilter.SHOW_TEXT,
                                null,
                                false
                            );
                            
                            let textNode;
                            while (textNode = walker.nextNode()) {
                                this.processTextNode(textNode);
                            }
                        }
                    }
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    function getCenter(el) {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width/2,
            y: rect.top + (el.innerText.trim() === '' ? 0 : rect.height/2)
        };
    }

    function createEnhancedPath(start, end, reverse = false) {
        const s = getCenter(start);
        const e = getCenter(end);
        const animStyle = settings.animationStyle.value;
        
        switch(animStyle) {
            case 'lightning':
                return createLightningPath(s, e, reverse);
            case 'pulse':
                return createPulsePath(s, e, reverse);
            default:
                return createSmoothPath(s, e, reverse);
        }
    }

    function createSmoothPath(s, e, reverse) {
        const h = -Math.abs(s.x - e.x) / (reverse ? 3 : 2);
        const c = { x: (s.x + e.x) / 2, y: Math.min(s.y, e.y) + h };
        return reverse ? 
            `M ${e.x} ${e.y} Q ${c.x} ${c.y}, ${s.x} ${s.y}` :
            `M ${s.x} ${s.y} Q ${c.x} ${c.y}, ${e.x} ${e.y}`;
    }

    function createLightningPath(s, e, reverse) {
        const points = [];
        const steps = 8;
        const zigzag = 15;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = s.x + (e.x - s.x) * t;
            const y = s.y + (e.y - s.y) * t;
            
            if (i > 0 && i < steps) {
                const offset = (Math.random() - 0.5) * zigzag;
                points.push(`L ${x + offset} ${y + offset}`);
            } else {
                points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
            }
        }
        
        return reverse ? points.reverse().join(' ') : points.join(' ');
    }

    function createPulsePath(s, e, reverse) {
        const midX = (s.x + e.x) / 2;
        const midY = (s.y + e.y) / 2;
        const controlOffset = 30;
        
        return reverse ?
            `M ${e.x} ${e.y} Q ${midX} ${midY - controlOffset} ${s.x} ${s.y}` :
            `M ${s.x} ${s.y} Q ${midX} ${midY - controlOffset} ${e.x} ${e.y}`;
    }

    function createEnhancedEffect(startEl, endEl, hpDiff, index, reverse = false) {
        let target, damage;
        
        if (reverse) {
            if (hpDiff >= 0) target = startEl.querySelector('.FullAvatar_fullAvatar__3RB2h');
            const divs = startEl.querySelector('.CombatUnit_splatsContainer__2xcc0')?.querySelectorAll('div');
            if (divs) {
                for (const div of divs) {
                    if (div.innerText.trim() === '') {
                        startEl = div;
                        damage = div;
                        break;
                    }
                }
            }
        } else {
            if (hpDiff >= 0) target = endEl.querySelector('.CombatUnit_monsterIcon__2g3AZ');
            const divs = endEl.querySelector('.CombatUnit_splatsContainer__2xcc0')?.querySelectorAll('div');
            if (divs) {
                for (const div of divs) {
                    if (div.innerText.trim() === '') {
                        endEl = div;
                        damage = div;
                        break;
                    }
                }
            }
        }

        const absHp = Math.abs(hpDiff);
        const baseThickness = settings.lineThickness.value;
        const thickness = absHp >= 1000 ? baseThickness + 3 : 
                         absHp >= 700 ? baseThickness + 2 : 
                         absHp >= 500 ? baseThickness + 1 : 
                         absHp >= 300 ? baseThickness : baseThickness - 1;
        
        const size = Math.min(8, Math.max(2, Math.floor(absHp/150)));

        let svg = document.getElementById('svg-container-enhanced');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.id = 'svg-container-enhanced';
            svg.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 190;
            `;
            svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            document.querySelector(".GamePage_mainPanel__2njyb")?.appendChild(svg);
            
            window.addEventListener('resize', () => {
                svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            });
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        const trackerId = reverse ? 'tracker6' : `tracker${index}`;
        const s = settings[trackerId];
        const glowIntensity = settings.glowIntensity.value;
        
        const colorSettings = hpDiff < 0 && s.healColor ? s.healColor : s;
        const color = `rgba(${colorSettings.r}, ${colorSettings.g}, ${colorSettings.b}, 1)`;
        
        const filterId = `glow-${trackerId}-${Date.now()}`;
        const defs = svg.querySelector('defs') || svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs"));
        
        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.id = filterId;
        filter.innerHTML = `
            <feGaussianBlur stdDeviation="${glowIntensity}" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        `;
        defs.appendChild(filter);
        
        path.style.cssText = `
            stroke: ${color}; 
            stroke-width: ${Math.max(1, thickness)}px; 
            fill: none; 
            stroke-linecap: round; 
            filter: url(#${filterId});
            opacity: ${hpDiff === 0 ? '0.6' : '1'};
        `;
        
        const pathD = createEnhancedPath(startEl, endEl, reverse);
        path.setAttribute('d', pathD);
        
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        
        svg.appendChild(path);
        AnimationManager.addPath(path);

        const cleanup = () => {
            try {
                if (path.parentNode) svg.removeChild(path);
                if (filter.parentNode) defs.removeChild(filter);
                AnimationManager.removePath(path);
            } catch(e) {}
        };

        requestAnimationFrame(() => {
            const animationSpeed = settings.animationStyle.value === 'lightning' ? '0.05s' : 
                                 settings.animationStyle.value === 'pulse' ? '0.2s' : '0.1s';
            
            path.style.transition = `stroke-dashoffset ${animationSpeed} linear`;
            path.style.strokeDashoffset = '0';
            
            if (hpDiff === 0) {
                if (settings.moreEffect.enabled && damage) {
                    damage.animate([
                        {transform: 'scale(1)', opacity: 1},
                        {transform: 'scale(1.3)', opacity: 0.5},
                        {transform: 'scale(1)', opacity: 1}
                    ], {duration: 800, easing: 'ease-out'});
                }
            } else {
                path.addEventListener('transitionend', () => {
                    if (settings.moreEffect.enabled) {
                        const endPoint = getPathEndPoint(pathD);
                        createEnhancedHitEffect(endPoint, svg, path, target, size, damage, color);
                    }
                }, {once: true});
            }
        });

        setTimeout(() => {
            path.style.transition = 'opacity 0.5s ease-out, stroke-dashoffset 0.5s ease-out';
            path.style.opacity = '0';
            path.style.strokeDashoffset = -length;
            setTimeout(cleanup, 500);
        }, settings.animationStyle.value === 'pulse' ? 1000 : 600);

        setTimeout(cleanup, 6000);
    }

    function getPathEndPoint(pathD) {
        const coords = pathD.split(' ');
        const lastCoords = coords[coords.length - 2] + ' ' + coords[coords.length - 1];
        const [x, y] = lastCoords.split(' ').map(parseFloat);
        return {x, y};
    }

    function createEnhancedHitEffect(point, container, path, target, size, damage, color) {
        const particleCount = settings.particleCount.value;
        
        const gradientId = `shockwave-${Date.now()}`;
        const defs = container.querySelector('defs') || container.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs"));
        
        const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        gradient.id = gradientId;
        gradient.innerHTML = `
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
            <stop offset="70%" style="stop-color:${color};stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
        `;
        defs.appendChild(gradient);

        const shockwave = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        shockwave.setAttribute("cx", point.x);
        shockwave.setAttribute("cy", point.y);
        shockwave.setAttribute("r", "0");
        shockwave.style.fill = `url(#${gradientId})`;
        container.appendChild(shockwave);

        shockwave.animate([
            {r: size, opacity: 1},
            {r: size * 6, opacity: 0}
        ], {
            duration: 600, 
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            shockwave.remove();
            if (gradient.parentNode) defs.removeChild(gradient);
        };

        for(let i = 0; i < particleCount; i++) {
            const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            particle.setAttribute("cx", point.x);
            particle.setAttribute("cy", point.y);
            particle.setAttribute("r", 1 + size/4);
            particle.style.fill = color;
            particle.style.filter = `blur(${Math.random() * 2}px)`;
            container.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const dist = size * 8 + Math.random() * size * 6;
            const duration = 500 + Math.random() * 300;
            
            particle.animate([
                {
                    transform: 'translate(0,0) scale(1)', 
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle)*dist/2}px, ${Math.sin(angle)*dist/2}px) scale(1.5)`, 
                    opacity: 0.7,
                    offset: 0.3
                },
                {
                    transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0.5)`, 
                    opacity: 0
                }
            ], {
                duration, 
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
        }

        if (target) {
            const shakeIntensity = Math.min(10, size * 2);
            const direction = point.x < window.innerWidth / 2 ? 1 : -1;
            
            target.animate([
                {transform: 'translate(0,0) rotate(0deg)'},
                {transform: `translate(${-shakeIntensity * direction}px,-${shakeIntensity/2}px) rotate(${direction}deg)`},
                {transform: `translate(${shakeIntensity/2 * direction}px,${shakeIntensity}px) rotate(${-direction/2}deg)`},
                {transform: `translate(${-shakeIntensity/4 * direction}px,-${shakeIntensity/4}px) rotate(0deg)`},
                {transform: 'translate(0,0) rotate(0deg)'}
            ], {
                duration: 150 + size * 15, 
                iterations: Math.max(1, Math.floor(size / 2)),
                easing: 'ease-out'
            });
        }

        if (damage) {
            const scaleMultiplier = 1 + size * 0.15;
            damage.animate([
                {
                    transform: 'scale(1) rotate(0deg)',
                    filter: 'brightness(1) saturate(1)'
                },
                {
                    transform: `scale(${scaleMultiplier}) rotate(${Math.random() * 4 - 2}deg)`,
                    filter: 'brightness(1.5) saturate(1.3)',
                    offset: 0.3
                },
                {
                    transform: `scale(${scaleMultiplier * 0.9}) rotate(0deg)`,
                    filter: 'brightness(1.2) saturate(1.1)',
                    offset: 0.7
                },
                {
                    transform: 'scale(1) rotate(0deg)',
                    filter: 'brightness(1) saturate(1)'
                }
            ], {
                duration: 1800, 
                easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            });
        }

        if (settings.soundEnabled.enabled) {
            playHitSound(size);
        }
    }

    function playHitSound(intensity) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800 + intensity * 100, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch(e) {}
    }

    function createEnhancedLine(from, to, hpDiff, reverse = false) {
        if (hpDiff === 0 && !settings.missedLine.enabled) return;
        
        const trackerId = reverse ? 'tracker6' : `tracker${from}`;
        const setting = settings[trackerId];
        if (!setting || (hpDiff >= 0 ? !setting.enabled : !setting.heal)) return;
        
        if (!AnimationManager.canCreate()) return;

        const playersContainer = document.querySelector(".BattlePanel_playersArea__vvwlB")?.children[0];
        const monsterContainer = document.querySelector(".BattlePanel_monstersArea__2dzrY")?.children[0];
        
        if (!playersContainer || !monsterContainer) return;

        const effectFrom = (reverse && hpDiff < 0) ? monsterContainer.children[from] : playersContainer.children[from];
        const effectTo = (!reverse && hpDiff < 0) ? playersContainer.children[to] : monsterContainer.children[to];

        if (!effectFrom || !effectTo) return;

        createEnhancedEffect(effectFrom, effectTo, hpDiff, reverse ? to : from, reverse);
    }

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const originalGet = dataProperty.get;

        dataProperty.get = function() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket) || 
                (!socket.url.includes("api.milkywayidle.com/ws") && !socket.url.includes("api-test.milkywayidle.com/ws"))) {
                return originalGet.call(this);
            }

            const message = originalGet.call(this);
            Object.defineProperty(this, "data", { value: message });
            return handleEnhancedMessage(message);
        };

        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
    }

    let monstersHP = [], monstersMP = [], monstersDmgCounter = [];
    let playersHP = [], playersMP = [], playersDmgCounter = [];
    let battleStats = { hits: 0, misses: 0, heals: 0 };

    function handleEnhancedMessage(message) {
        const obj = JSON.parse(message);
        
        if (obj?.type === "new_battle") {
            battleStats = { hits: 0, misses: 0, heals: 0 };
            
            monstersHP = obj.monsters.map(m => m.currentHitpoints);
            monstersMP = obj.monsters.map(m => m.currentManapoints);
            monstersDmgCounter = obj.monsters.map(m => m.damageSplatCounter);
            playersHP = obj.players.map(p => p.currentHitpoints);
            playersMP = obj.players.map(p => p.currentManapoints);
            playersDmgCounter = obj.players.map(p => p.damageSplatCounter);
            
            if (settings.controlPanel.showNewBattleNotifications.enabled) {
                AnimationManager.showEnhancedToast('⚔️ New battle started! May the best warrior win!', 'info');
            }
        } 
        else if (obj?.type === "battle_updated" && monstersHP.length) {
            const { mMap, pMap } = obj;
            const monsterIndices = Object.keys(mMap);
            const playerIndices = Object.keys(pMap);

            let castMonster = -1, castPlayer = -1;
            
            monsterIndices.forEach(i => {
                if (mMap[i].cMP < monstersMP[i]) castMonster = i;
                monstersMP[i] = mMap[i].cMP;
            });
            
            playerIndices.forEach(i => {
                if (pMap[i].cMP < playersMP[i]) castPlayer = i;
                playersMP[i] = pMap[i].cMP;
            });

            let hurtMonster = false, hurtPlayer = false;
            let monsterLifeSteal = {from: null, to: null, hpDiff: null};
            let playerLifeSteal = {from: null, to: null, hpDiff: null};

            monstersHP.forEach((mHP, mIndex) => {
                const monster = mMap[mIndex];
                if (!monster) return;

                const hpDiff = mHP - monster.cHP;
                if (hpDiff > 0) hurtMonster = true;
                
                const dmgSplat = monstersDmgCounter[mIndex] < monster.dmgCounter;
                monstersHP[mIndex] = monster.cHP;
                monstersDmgCounter[mIndex] = monster.dmgCounter;

                if (dmgSplat) {
                    if (hpDiff === 0) {
                        battleStats.misses++;
                    } else if (hpDiff > 0) {
                        battleStats.hits++;
                    } else {
                        battleStats.heals++;
                    }
                    
                    if (playerIndices.length > 0) {
                        const attacker = playerIndices.length > 1 ? castPlayer : playerIndices[0];
                        if (attacker !== undefined) createEnhancedLine(attacker, mIndex, hpDiff);
                    }
                }

                if (hpDiff < 0) {
                    if (castMonster > -1) {
                        createEnhancedLine(mIndex, castMonster, hpDiff, true);
                    } else {
                        monsterLifeSteal = {from: mIndex, to: mIndex, hpDiff};
                    }
                }
            });

            playersHP.forEach((pHP, pIndex) => {
                const player = pMap[pIndex];
                if (!player) return;

                const hpDiff = pHP - player.cHP;
                if (hpDiff > 0) hurtPlayer = true;
                
                const dmgSplat = playersDmgCounter[pIndex] < player.dmgCounter;
                playersHP[pIndex] = player.cHP;
                playersDmgCounter[pIndex] = player.dmgCounter;

                if (dmgSplat) {
                    if (hpDiff === 0) {
                        battleStats.misses++;
                    } else if (hpDiff > 0) {
                        battleStats.hits++;
                    } else {
                        battleStats.heals++;
                    }
                    
                    if (monsterIndices.length > 0) {
                        const attacker = monsterIndices.length > 1 ? castMonster : monsterIndices[0];
                        if (attacker !== undefined) createEnhancedLine(pIndex, attacker, hpDiff, true);
                    }
                }

                if (hpDiff < 0) {
                    if (castPlayer > -1) {
                        createEnhancedLine(castPlayer, pIndex, hpDiff);
                    } else {
                        playerLifeSteal = {from: pIndex, to: pIndex, hpDiff};
                    }
                }
            });

            if (hurtMonster && playerLifeSteal.from !== null) {
                createEnhancedLine(playerLifeSteal.from, playerLifeSteal.to, playerLifeSteal.hpDiff);
            }
            if (hurtPlayer && monsterLifeSteal.from !== null) {
                createEnhancedLine(monsterLifeSteal.from, monsterLifeSteal.to, monsterLifeSteal.hpDiff, true);
            }
        }

        return message;
    }

    function saveSettings() {
        localStorage.setItem("tracker_settings_enhanced", JSON.stringify(settings));
    }

    function resetToDefaults() {
        settings = {
            tracker0: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 1", healColor: { r: 0, g: 100, b: 255 } },
            tracker1: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 2", healColor: { r: 0, g: 100, b: 255 } },
            tracker2: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 3", healColor: { r: 0, g: 100, b: 255 } },
            tracker3: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 4", healColor: { r: 0, g: 100, b: 255 } },
            tracker4: { enabled: true, heal: true, r: 0, g: 255, b: 0, name: "Player 5", healColor: { r: 0, g: 100, b: 255 } },
            tracker6: { enabled: true, heal: true, r: 255, g: 0, b: 0, name: "Enemies", healColor: { r: 255, g: 0, b: 0 } },
            missedLine: { enabled: true },
            moreEffect: { enabled: true },
            animationStyle: { value: 'smooth' },
            lineThickness: { value: 3 },
            particleCount: { value: 10 },
            glowIntensity: { value: 5 },
            soundEnabled: { enabled: false },
            chatFilter: {
                enabled: { enabled: true },
                hideChinese: { enabled: true },
                hideJapanese: { enabled: false },
                hideKorean: { enabled: false },
                hideArabic: { enabled: false },
                hideRussian: { enabled: false },
                hideSpam: { enabled: false },
                hideLinks: { enabled: false },
                hideAllCaps: { enabled: false },
                customWords: { value: '' },
                whitelistUsers: { value: '' },
                showHiddenCount: { enabled: false },
                fadeInsteadOfHide: { enabled: false }
            },
            controlPanel: {
                showNewBattleNotifications: { enabled: false },
                showToastNotifications: { enabled: true }
            }
        };
        saveSettings();
        location.reload();
    }

    function toggleAllEffects() {
        const allEnabled = settings.tracker0.enabled && settings.tracker1.enabled && 
                          settings.tracker2.enabled && settings.tracker3.enabled && 
                          settings.tracker4.enabled && settings.tracker6.enabled;
        
        const newState = !allEnabled;
        
        ['tracker0', 'tracker1', 'tracker2', 'tracker3', 'tracker4', 'tracker6'].forEach(id => {
            settings[id].enabled = newState;
        });
        
        settings.moreEffect.enabled = newState;
        settings.missedLine.enabled = newState;
        
        saveSettings();
        
        if (settings.controlPanel.showToastNotifications.enabled) {
            AnimationManager.showEnhancedToast(
                newState ? '✅ All effects enabled!' : '❌ All effects disabled!',
                newState ? 'success' : 'warning'
            );
        }
        
        setTimeout(() => {
            const panel = document.querySelector("#tracker_settings_enhanced");
            if (panel) {
                panel.remove();
                createSettingsPanel();
            }
        }, 500);
    }

    function testChatFilters() {
        const testMessages = [
            { text: '你好世界', lang: 'Chinese' },
            { text: 'こんにちは', lang: 'Japanese' },
            { text: '안녕하세요', lang: 'Korean' },
            { text: 'مرحبا', lang: 'Arabic' },
            { text: 'Привет мир', lang: 'Russian' },
            { text: 'Check out this link: https://example.com', lang: 'Link' },
            { text: 'THIS IS ALL CAPS MESSAGE!!!', lang: 'All Caps' },
            { text: 'spammmmmmm message!!!!!', lang: 'Spam' }
        ];
        
        let results = testMessages.map(msg => {
            const shouldHide = ChatFilter.shouldHideMessage(msg.text);
            return `${shouldHide ? '🚫' : '✅'} ${msg.lang}: "${msg.text}"`;
        });
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.7); z-index: 9999; display: flex; 
            align-items: center; justify-content: center;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 30px;
                border-radius: 15px;
                color: white;
                border: 2px solid #0f3460;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                max-width: 500px;
                width: 90%;
            ">
                <h3 style="
                    text-align: center;
                    margin: 0 0 20px 0;
                    color: #26de81;
                    font-size: 18px;
                ">🧪 Chat Filter Test Results</h3>
                
                <div style="
                    background: rgba(0,0,0,0.3);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-family: monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    max-height: 300px;
                    overflow-y: auto;
                ">
                    ${results.join('<br>')}
                </div>
                
                <div style="text-align: center;">
                    <button onclick="this.closest('div').parentElement.remove()" style="
                        background: linear-gradient(45deg, #26de81, #20bf6b);
                        border: none;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.onclick = e => { if (e.target === modal) modal.remove(); };
    }

    function openEnhancedColorPicker(id, element) {
        const s = settings[id];
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.7); z-index: 9999; display: flex; 
            align-items: center; justify-content: center;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 30px;
                border-radius: 15px;
                color: white;
                border: 2px solid #0f3460;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                min-width: 300px;
            ">
                <h3 style="
                    text-align: center;
                    margin: 0 0 20px 0;
                    color: #4ecdc4;
                    font-size: 18px;
                ">Color Picker - ${s.name}</h3>
                
                <div style="
                    margin-bottom: 20px;
                    text-align: center;
                ">
                    <div style="
                        width: 100px;
                        height: 100px;
                        background: rgb(${s.r},${s.g},${s.b});
                        border: 3px solid white;
                        border-radius: 50%;
                        margin: 0 auto 15px auto;
                        box-shadow: 0 8px 30px rgba(${s.r},${s.g},${s.b},0.4);
                        transition: all 0.3s ease;
                    " id="color-preview"></div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    ${['r', 'g', 'b'].map(c => `
                        <div style="text-align: center;">
                            <label style="
                                display: block;
                                margin-bottom: 8px;
                                color: ${c === 'r' ? '#ff6b6b' : c === 'g' ? '#26de81' : '#4ecdc4'};
                                font-weight: bold;
                            ">${c.toUpperCase()}</label>
                            <input type="range" min="0" max="255" value="${s[c]}" 
                                   data-color="${c}" style="
                                width: 100%;
                                accent-color: ${c === 'r' ? '#ff6b6b' : c === 'g' ? '#26de81' : '#4ecdc4'};
                                margin-bottom: 5px;
                            ">
                            <input type="number" min="0" max="255" value="${s[c]}" 
                                   data-color="${c}" style="
                                width: 60px;
                                padding: 4px;
                                border: 1px solid #0f3460;
                                border-radius: 4px;
                                background: rgba(255,255,255,0.1);
                                color: white;
                                text-align: center;
                            ">
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="cancel-btn" style="
                        background: linear-gradient(45deg, #6c757d, #5a6268);
                        border: none;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">Cancel</button>
                    <button id="ok-btn" style="
                        background: linear-gradient(45deg, #26de81, #20bf6b);
                        border: none;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">Apply</button>
                </div>
            </div>
        `;

        const preview = modal.querySelector('#color-preview');
        const inputs = modal.querySelectorAll('[data-color]');
        
        function updatePreview() {
            const color = `rgb(${s.r},${s.g},${s.b})`;
            preview.style.background = color;
            preview.style.boxShadow = `0 8px 30px rgba(${s.r},${s.g},${s.b},0.4)`;
        }
        
        inputs.forEach(input => {
            input.addEventListener('input', e => {
                const color = e.target.dataset.color;
                const value = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                inputs.forEach(i => {
                    if (i.dataset.color === color) i.value = value;
                });
                s[color] = value;
                updatePreview();
            });
        });

        modal.querySelector('#ok-btn').onclick = () => {
            element.style.background = `rgb(${s.r},${s.g},${s.b})`;
            element.style.boxShadow = `0 4px 15px rgba(${s.r},${s.g},${s.b},0.4)`;
            saveSettings();
            modal.remove();
        };
        
        modal.querySelector('#cancel-btn').onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };

        document.body.appendChild(modal);
    }

    function createSettingsPanel() {
        const target = document.querySelector("div.SettingsPanel_profileTab__214Bj");
        if (!target || target.querySelector("#tracker_settings_enhanced")) return;

        const panelHTML = `
            <div id="tracker_settings_enhanced" style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 12px;
                padding: 20px;
                margin: 15px 0;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                backdrop-filter: blur(10px);
                color: #fff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            ">
                <div style="
                    text-align: center;
                    color: #ff6b6b;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                    background: linear-gradient(45deg, #ff6b6b, #ffd93d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">
                    ⚔️ STAR WARS Enhanced ⚔️
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="
                        color: #4ecdc4;
                        margin: 0 0 10px 0;
                        font-size: 16px;
                        border-bottom: 2px solid #4ecdc4;
                        padding-bottom: 5px;
                    ">Combat Trackers</h3>
                    <div id="player-trackers"></div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="
                        color: #26de81;
                        margin: 0 0 10px 0;
                        font-size: 16px;
                        border-bottom: 2px solid #26de81;
                        padding-bottom: 5px;
                    ">💬 Chat Filtering</h3>
                    <div id="chat-settings"></div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="
                        color: #ff9f43;
                        margin: 0 0 10px 0;
                        font-size: 16px;
                        border-bottom: 2px solid #ff9f43;
                        padding-bottom: 5px;
                    ">Visual Effects</h3>
                    <div id="effect-settings"></div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="
                        color: #a55eea;
                        margin: 0 0 10px 0;
                        font-size: 16px;
                        border-bottom: 2px solid #a55eea;
                        padding-bottom: 5px;
                    ">Advanced Settings</h3>
                    <div id="advanced-settings"></div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3 style="
                        color: #fd79a8;
                        margin: 0 0 10px 0;
                        font-size: 16px;
                        border-bottom: 2px solid #fd79a8;
                        padding-bottom: 5px;
                    ">🎛️ Control Panel</h3>
                    <div id="control-panel"></div>
                </div>
                
                <div style="text-align: center; margin-top: 15px;">
                    <button id="reset-settings" style="
                        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
                        border: none;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(255,107,107,0.3);
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Reset to Defaults
                    </button>
                </div>
            </div>
        `;

        target.insertAdjacentHTML("beforeend", panelHTML);
        const panel = target.querySelector("#tracker_settings_enhanced");
        
        const playerTrackers = panel.querySelector("#player-trackers");
        ['tracker0', 'tracker1', 'tracker2', 'tracker3', 'tracker4', 'tracker6'].forEach(id => {
            const s = settings[id];
            const isEnemy = id === 'tracker6';
            const icon = isEnemy ? '👹' : '👤';
            
            playerTrackers.insertAdjacentHTML("beforeend", `
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    margin: 5px 0;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    <span style="margin-right: 8px; font-size: 16px;">${icon}</span>
                    <span style="font-weight: bold; margin-right: 10px; min-width: 80px;">${s.name}</span>
                    
                    <label style="display: flex; align-items: center; margin-right: 15px; cursor: pointer;">
                        <input type="checkbox" data-id="${id}" data-prop="enabled" ${s.enabled ? "checked" : ""} style="
                            margin-right: 5px;
                            transform: scale(1.2);
                            accent-color: #4ecdc4;
                        ">
                        <span style="color: #4ecdc4;">Damage</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; margin-right: 15px; cursor: pointer;">
                        <input type="checkbox" data-id="${id}" data-prop="heal" ${s.heal ? "checked" : ""} style="
                            margin-right: 5px;
                            transform: scale(1.2);
                            accent-color: #26de81;
                        ">
                        <span style="color: #26de81;">Heal</span>
                    </label>
                    
                    <div class="color-picker-container" style="position: relative;">
                        <div class="color-box" data-id="${id}" style="
                            width: 30px;
                            height: 30px;
                            background: rgb(${s.r},${s.g},${s.b});
                            border: 2px solid #fff;
                            border-radius: 50%;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(${s.r},${s.g},${s.b},0.4);
                        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>
                    </div>
                </div>
            `);
        });

        const chatSettings = panel.querySelector("#chat-settings");
        chatSettings.innerHTML = `
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 10px;">
                    <input type="checkbox" data-id="chatFilter" data-prop="enabled" ${settings.chatFilter.enabled.enabled ? "checked" : ""} style="
                        margin-right: 8px;
                        transform: scale(1.3);
                        accent-color: #26de81;
                    ">
                    <span style="font-weight: bold; color: #26de81;">Enable Chat Filtering</span>
                </label>
            </div>
            
            <div id="chat-options" style="${settings.chatFilter.enabled.enabled ? '' : 'opacity: 0.5; pointer-events: none;'}">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideChinese" ${settings.chatFilter.hideChinese.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff6b6b;
                        ">
                        <span>🇨🇳 Hide Chinese</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideJapanese" ${settings.chatFilter.hideJapanese.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff6b6b;
                        ">
                        <span>🇯🇵 Hide Japanese</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideKorean" ${settings.chatFilter.hideKorean.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff6b6b;
                        ">
                        <span>🇰🇷 Hide Korean</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideArabic" ${settings.chatFilter.hideArabic.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff6b6b;
                        ">
                        <span>🇸🇦 Hide Arabic</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideRussian" ${settings.chatFilter.hideRussian.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff6b6b;
                        ">
                        <span>🇷🇺 Hide Russian</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideSpam" ${settings.chatFilter.hideSpam.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff9f43;
                        ">
                        <span>🚫 Hide Spam</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideLinks" ${settings.chatFilter.hideLinks.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff9f43;
                        ">
                        <span>🔗 Hide Links</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="hideAllCaps" ${settings.chatFilter.hideAllCaps.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #ff9f43;
                        ">
                        <span>📢 Hide ALL CAPS</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="chatFilter" data-prop="fadeInsteadOfHide" ${settings.chatFilter.fadeInsteadOfHide.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.1);
                            accent-color: #4ecdc4;
                        ">
                        <span>🌫️ Fade Instead of Hide</span>
                    </label>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; color: #ffd93d; font-weight: bold;">🚫 Custom Words to Hide (comma-separated):</label>
                    <input type="text" data-id="chatFilter" data-prop="customWords" value="${settings.chatFilter.customWords.value}" 
                           placeholder="word1, word2, phrase3" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 6px;
                        border: 1px solid #0f3460;
                        background: rgba(255,255,255,0.1);
                        color: white;
                        font-size: 14px;
                    ">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #26de81; font-weight: bold;">✅ Whitelisted Users (comma-separated):</label>
                    <input type="text" data-id="chatFilter" data-prop="whitelistUsers" value="${settings.chatFilter.whitelistUsers.value}" 
                           placeholder="username1, username2" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 6px;
                        border: 1px solid #0f3460;
                        background: rgba(255,255,255,0.1);
                        color: white;
                        font-size: 14px;
                    ">
                </div>
                
                <div style="text-align: center; margin-top: 10px;">
                    <button id="test-filter" style="
                        background: linear-gradient(45deg, #4ecdc4, #26de81);
                        border: none;
                        color: white;
                        padding: 6px 12px;
                        border-radius: 15px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Test Filters
                    </button>
                </div>
            </div>
        `;

        const effectSettings = panel.querySelector("#effect-settings");
        effectSettings.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" data-id="missedLine" data-prop="enabled" ${settings.missedLine.enabled ? "checked" : ""} style="
                        margin-right: 8px;
                        transform: scale(1.2);
                        accent-color: #ffd93d;
                    ">
                    <span>Show Missed Attacks</span>
                </label>
                
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" data-id="moreEffect" data-prop="enabled" ${settings.moreEffect.enabled ? "checked" : ""} style="
                        margin-right: 8px;
                        transform: scale(1.2);
                        accent-color: #ffd93d;
                    ">
                    <span>Enhanced Effects</span>
                </label>
            </div>
            
            <div style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #ffd93d;">Animation Style:</label>
                <select data-id="animationStyle" data-prop="value" style="
                    width: 100%;
                    padding: 8px;
                    border-radius: 6px;
                    border: none;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    font-size: 14px;
                ">
                    <option value="smooth" ${settings.animationStyle.value === 'smooth' ? 'selected' : ''}>Smooth Arc</option>
                    <option value="lightning" ${settings.animationStyle.value === 'lightning' ? 'selected' : ''}>Lightning Bolt</option>
                    <option value="pulse" ${settings.animationStyle.value === 'pulse' ? 'selected' : ''}>Pulse Wave</option>
                </select>
            </div>
        `;

        const advancedSettings = panel.querySelector("#advanced-settings");
        advancedSettings.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #a55eea;">Line Thickness:</label>
                    <input type="range" min="1" max="8" value="${settings.lineThickness.value}" 
                           data-id="lineThickness" data-prop="value" style="
                        width: 100%;
                        accent-color: #a55eea;
                    ">
                    <span style="font-size: 12px; color: #ccc;">Current: ${settings.lineThickness.value}px</span>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #a55eea;">Particle Count:</label>
                    <input type="range" min="5" max="30" value="${settings.particleCount.value}" 
                           data-id="particleCount" data-prop="value" style="
                        width: 100%;
                        accent-color: #a55eea;
                    ">
                    <span style="font-size: 12px; color: #ccc;">Current: ${settings.particleCount.value}</span>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 5px; color: #a55eea;">Glow Intensity:</label>
                    <input type="range" min="1" max="10" value="${settings.glowIntensity.value}" 
                           data-id="glowIntensity" data-prop="value" style="
                        width: 100%;
                        accent-color: #a55eea;
                    ">
                    <span style="font-size: 12px; color: #ccc;">Current: ${settings.glowIntensity.value}</span>
                </div>
                
                <div>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" data-id="soundEnabled" data-prop="enabled" ${settings.soundEnabled.enabled ? "checked" : ""} style="
                            margin-right: 8px;
                            transform: scale(1.2);
                            accent-color: #a55eea;
                        ">
                        <span>Sound Effects</span>
                    </label>
                </div>
            </div>
        `;

        const controlPanel = panel.querySelector("#control-panel");
        controlPanel.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" data-id="controlPanel" data-prop="showNewBattleNotifications" ${settings.controlPanel.showNewBattleNotifications.enabled ? "checked" : ""} style="
                        margin-right: 8px;
                        transform: scale(1.2);
                        accent-color: #fd79a8;
                    ">
                    <span>🔔 Battle Start Notifications</span>
                </label>
                
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" data-id="controlPanel" data-prop="showToastNotifications" ${settings.controlPanel.showToastNotifications.enabled ? "checked" : ""} style="
                        margin-right: 8px;
                        transform: scale(1.2);
                        accent-color: #fd79a8;
                    ">
                    <span>💬 Toast Notifications</span>
                </label>
                
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" data-id="chatFilter" data-prop="showHiddenCount" ${settings.chatFilter.showHiddenCount.enabled ? "checked" : ""} style="
                        margin-right: 8px;
                        transform: scale(1.2);
                        accent-color: #fd79a8;
                    ">
                    <span>📊 Chat Filter Counter</span>
                </label>
                
                <div style="text-align: center;">
                    <button id="quick-toggle-all" style="
                        background: linear-gradient(45deg, #fd79a8, #fdcb6e);
                        border: none;
                        color: white;
                        padding: 6px 12px;
                        border-radius: 15px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Toggle All Effects
                    </button>
                </div>
            </div>
        `;

        panel.addEventListener("change", e => {
            const { id, prop } = e.target.dataset;
            if (id && prop) {
                if (e.target.type === 'checkbox') {
                    if (id === 'chatFilter' && prop === 'enabled') {
                        settings[id][prop].enabled = e.target.checked;
                        const chatOptions = panel.querySelector('#chat-options');
                        if (chatOptions) {
                            chatOptions.style.opacity = e.target.checked ? '1' : '0.5';
                            chatOptions.style.pointerEvents = e.target.checked ? 'auto' : 'none';
                        }
                    } else if (id === 'chatFilter') {
                        settings[id][prop].enabled = e.target.checked;
                        if (prop === 'showHiddenCount') {
                            if (e.target.checked && !ChatFilter.countDisplay) {
                                ChatFilter.createCountDisplay();
                            } else if (!e.target.checked && ChatFilter.countDisplay) {
                                ChatFilter.countDisplay.remove();
                                ChatFilter.countDisplay = null;
                            }
                        }
                    } else if (id === 'controlPanel') {
                        settings[id][prop].enabled = e.target.checked;
                    } else {
                        settings[id][prop] = e.target.checked;
                    }
                } else if (e.target.type === 'range') {
                    settings[id][prop] = parseInt(e.target.value);
                    const span = e.target.nextElementSibling;
                    if (span) span.textContent = `Current: ${e.target.value}${id === 'lineThickness' ? 'px' : ''}`;
                } else if (e.target.type === 'text') {
                    if (id === 'chatFilter') {
                        settings[id][prop].value = e.target.value;
                    } else {
                        settings[id][prop] = e.target.value;
                    }
                } else {
                    settings[id][prop] = e.target.value;
                }
                saveSettings();
            }
        });

        panel.addEventListener("click", e => {
            if (e.target.classList.contains('color-box')) {
                openEnhancedColorPicker(e.target.dataset.id, e.target);
            }
            if (e.target.id === 'reset-settings') {
                resetToDefaults();
            }
            if (e.target.id === 'test-filter') {
                testChatFilters();
            }
            if (e.target.id === 'quick-toggle-all') {
                toggleAllEffects();
            }
        });
    }

    function createPerformanceMonitor() {
        const monitor = document.createElement('div');
        monitor.id = 'performance-monitor';
        monitor.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(monitor);

        setInterval(() => {
            if (monitor.style.display === 'block') {
                monitor.innerHTML = `
                    FPS: ${Math.round(performance.now() % 1000 / 16.67)}<br>
                    Active Paths: ${AnimationManager.stats.active}<br>
                    Total Effects: ${AnimationManager.stats.total}<br>
                    Battle Stats:<br>
                    • Hits: ${battleStats.hits}<br>
                    • Misses: ${battleStats.misses}<br>
                    • Heals: ${battleStats.heals}<br>
                    Chat Filter:<br>
                    • Filtered: ${ChatFilter.hiddenCount}<br>
                    • Total: ${ChatFilter.totalMessages}
                `;
            }
        }, 100);

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    function initializeEnhancedTracker() {
        hookWS();
        createPerformanceMonitor();
        
        if (settings.chatFilter.enabled.enabled) {
            ChatFilter.init();
        }
        
        function waitForSettings() {
            createSettingsPanel();
            setTimeout(waitForSettings, 500);
        }
        waitForSettings();

        setTimeout(() => {
            const features = [];
            if (settings.chatFilter.enabled.enabled) features.push('Chat Filtering');
            features.push('Enhanced Hit Tracker');
            
            if (settings.controlPanel.showToastNotifications.enabled) {
                AnimationManager.showEnhancedToast(
                    `🚀 ${features.join(' + ')} loaded! Press Ctrl+Shift+P for performance stats.`, 
                    'success'
                );
            }
        }, 2000);
        
        const originalSaveSettings = saveSettings;
        saveSettings = function() {
            originalSaveSettings();
            
            if (settings.chatFilter.enabled.enabled && !ChatFilter.countDisplay) {
                ChatFilter.init();
            } else if (!settings.chatFilter.enabled.enabled && ChatFilter.countDisplay) {
                ChatFilter.countDisplay.remove();
                ChatFilter.countDisplay = null;
            }
            
            if (ChatFilter.countDisplay) {
                ChatFilter.countDisplay.style.display = 
                    settings.chatFilter.showHiddenCount.enabled ? 'block' : 'none';
            }
        };
    }

    initializeEnhancedTracker();

})();