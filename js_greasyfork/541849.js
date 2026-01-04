// ==UserScript==
// @name         🔧 Roblox Enhancer Pack (Verified Icon BADGE + Robux Modifier)
// @namespace    https://github.com/yourusername
// @version      1.0
// @description  Ajoute le badge de vérification RoVerify + modifie la valeur Robux affichée sur certaines pages
// @author       Toi
// @match        https://www.roblox.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541849/%F0%9F%94%A7%20Roblox%20Enhancer%20Pack%20%28Verified%20Icon%20BADGE%20%2B%20Robux%20Modifier%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541849/%F0%9F%94%A7%20Roblox%20Enhancer%20Pack%20%28Verified%20Icon%20BADGE%20%2B%20Robux%20Modifier%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** ✅ RoVerify Badge Injection ***/
    class Checkmark {
        constructor(profileSelectors) {
            this.profileSelectors = profileSelectors;
            this.badgeConfig = {
                spaceCharacter: ' ',
                src: this.svgBadge,
                title: 'Verified',
                alt: 'Verified Badge',
                style: {
                    width: '28px',
                    height: '28px',
                    marginBottom: '2px'
                }
            };
        }

        svgBadge = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E`;

        createSpaceElement() {
            let spaceElement = document.createElement('span');
            spaceElement.textContent = this.badgeConfig.spaceCharacter;
            return spaceElement;
        }

        createVerifiedBadge(profileElement) {
            let fontSize = parseFloat(window.getComputedStyle(profileElement).fontSize);
            let iconSize = fontSize * 0.9;
            let verifiedBadge = document.createElement('img');
            verifiedBadge.className = 'profile-verified-badge-icon';
            verifiedBadge.src = this.badgeConfig.src;
            verifiedBadge.title = this.badgeConfig.title;
            verifiedBadge.alt = this.badgeConfig.alt;
            verifiedBadge.style.width = iconSize + 'px';
            verifiedBadge.style.height = iconSize + 'px';
            return verifiedBadge;
        }

        appendBadgeToProfile(profileElement) {
            profileElement.style.marginBottom = this.badgeConfig.style.marginBottom;
            profileElement.appendChild(this.createSpaceElement());
            profileElement.appendChild(this.createVerifiedBadge(profileElement));
        }

        findAndModifyProfiles() {
            let profileNameElements = document.querySelectorAll(this.profileSelectors.join(', '));
            profileNameElements.forEach(profileElement => this.appendBadgeToProfile(profileElement));
        }
    }

    class ProfileBadgeManager {
        constructor() {
            this.checkmark = new Checkmark([
                '.profile-name',
                '.age-bracket-label-username',
                '.user-name-container',
                '.user.PrimaryName',
                '.MuiGrid-root .MuiGrid-item .css-1g4gkv0-Grid-root-userName'
            ]);
        }

        init() {
            setTimeout(() => this.checkmark.findAndModifyProfiles(), 2300);
        }
    }

    /*** 🪙 Robux Display Modifier ***/
    function robuxModifierInit() {
        const robuxSpan = document.querySelector('#nav-robux-amount');
        const isOnTransactionsPage = window.location.href.includes('/transactions');

        if (robuxSpan && isOnTransactionsPage) {
            // Create edit button
            const btn = document.createElement('button');
            btn.textContent = '✏️ Changer Robux';
            btn.style.marginLeft = '10px';
            btn.style.padding = '2px 6px';
            btn.style.fontSize = '12px';
            btn.style.cursor = 'pointer';

            btn.onclick = () => {
                const newValue = prompt('Entrez la nouvelle valeur des Robux à afficher :', robuxSpan.textContent);
                if (newValue !== null) {
                    GM_setValue('customRobuxValue', newValue);
                    robuxSpan.textContent = newValue;
                }
            };

            // Ajouter le bouton après le span
            robuxSpan.parentElement.appendChild(btn);

            // Charger valeur si déjà définie
            const savedValue = GM_getValue('customRobuxValue', null);
            if (savedValue !== null) {
                robuxSpan.textContent = savedValue;
            }
        }
    }

    /*** 🔁 Init All ***/
    window.addEventListener('load', () => {
        // Init RoVerify
        new ProfileBadgeManager().init();

        // Init Robux modifier
        robuxModifierInit();
    });

})();
