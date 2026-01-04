// ==UserScript==
// @name         Kraland - Avatars personnalisés
// @namespace    http://tampermonkey.net/
// @version      4.4.0
// @description  Affiche les avatars améliorés des PJs avec couleurs de faction, bordures stylisées, infos profil (fonction + domiciliation) en ligne. Version stable visuellement harmonieuse (v4.4.0). 🦝
// @author       Racket Raccoon / Th3rd
// @match        http://www.kraland.org/*
// @match        https://www.kraland.org/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlNjBmMGYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1wYXctcHJpbnQtaWNvbiBsdWNpZGUtcGF3LXByaW50Ij48Y2lyY2xlIGN4PSIxMSIgY3k9IjQiIHI9IjIiLz48Y2lyY2xlIGN4PSIxOCIgY3k9IjgiIHI9IjIiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjE2IiByPSIyIi8+PHBhdGggZD0iTTkgMTBhNSA1IDAgMCAxIDUgNXYzLjVhMy41IDMuNSAwIDAgMS02Ljg0IDEuMDQ1UTYuNTIgMTcuNDggNC40NiAxNi44NEEzLjUgMy41IDAgMCAxIDUuNSAxMFoiLz48L3N2Zz4=
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542019/Kraland%20-%20Avatars%20personnalis%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/542019/Kraland%20-%20Avatars%20personnalis%C3%A9s.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Définition des constantes visuelles de base (taille des avatars, opacité, tailles de police)
    const AVATAR_SIZE = '75px';
    const PNJ_SIZE = '50px';
    const FONT_SMALL = '0.85em';
    const OPACITY_LIGHT = '0.9';
 
    // Couleurs associées à chaque drapeau de nation
    const flagColors = {
        'f1.png': '#B22222', 'f2.png': '#8B5A2B', 'f3.png': '#DAA520', 'f4.png': '#055cb5',
        'f5.png': '#025e19', 'f6.png': '#7A1C81', 'f7.png': '#262424', 'f8.png': '#008080', 'f9.png': '#556B2F'
    };
 
    // Cache pour éviter de refaire des requêtes inutiles aux profils
    const functionCache = {};
 
    // Icônes Lucide
    const lucideIcons = {
        briefcase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;margin-right:4px;vertical-align:middle;opacity:0.7"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3h-8v4h8V3z"/></svg>',
        mapPin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;margin-right:4px;vertical-align:middle;opacity:0.7"><path d="M12 21s6-5.686 6-10a6 6 0 1 0 -12 0c0 4.314 6 10 6 10z"/><circle cx="12" cy="11" r="2"/></svg>',
        user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;margin-right:4px;vertical-align:middle;opacity:0.7"><path d="M20 21v-2a4 4 0 0 0 -4-4H8a4 4 0 0 0 -4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        link: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;margin-right:4px;vertical-align:middle;opacity:0.7"><path d="M10 13a5 5 0 0 1 7 0l1.5 1.5a5 5 0 0 1 0 7 5 5 0 0 1 -7 0L10 20a5 5 0 0 1 0-7m-6-6a5 5 0 0 1 7 0l1.5 1.5a5 5 0 0 1 0 7 5 5 0 0 1 -7 0L4 10a5 5 0 0 1 0-7"/></svg>'
    };
 
    // Applique une typographie à la cellule de nom
    function styleNameCell(nameCell) {
        nameCell.style.fontFamily = "'Roboto', sans-serif";
        nameCell.style.lineHeight = '1.6';
    }
 
    // Crée une <div> contenant une info stylisée (fonction ou domiciliation)
    function createInfoDiv(content, options = {}) {
        const div = document.createElement('div');
        div.innerHTML = content;
        div.style.fontSize = FONT_SMALL;
        div.style.opacity = OPACITY_LIGHT;
        if (options.color) div.style.color = options.color;
        if (options.italic) div.style.fontStyle = 'italic';
        if (options.bold) div.style.fontWeight = 'bold';
        if (options.marginTop) div.style.marginTop = options.marginTop;
        if (options.className) div.className = options.className;
        return div;
    }
 
    // Insère sous le nom du PJ sa fonction et éventuellement sa domiciliation
    function insertFunctionBelowName(row, functionText, domiciliationText = '', placeholder = false) {
        const nameCell = row.querySelectorAll('td')[1];
        if (nameCell?.querySelector('.avatar-function')) return;
 
        styleNameCell(nameCell);
 
        const isLoading = placeholder && functionText === 'Chargement...';
        const isEmpty = !functionText || functionText === '-' || (!placeholder && functionText === 'Chargement...');
 
        const funcDiv = createInfoDiv(
            isLoading ? 'Chargement...' : (isEmpty ? lucideIcons.briefcase + 'Aucune fonction' : lucideIcons.briefcase + functionText),
            {
                color: isEmpty ? '#666' : (isLoading ? '#999' : ''),
                italic: isEmpty || isLoading,
                bold: !(isEmpty || isLoading),
                marginTop: '0.1em',
                className: 'avatar-function'
            }
        );
        nameCell.appendChild(funcDiv);
 
        if (domiciliationText) {
            const domDiv = createInfoDiv(lucideIcons.mapPin + domiciliationText, { italic: true });
            nameCell.appendChild(domDiv);
        }
 
        const nameLink = nameCell.querySelector('a');
        if (nameLink) {
            nameLink.style.fontWeight = 'bold';
            nameLink.style.fontSize = '1.1em';
        }
    }
 
    // Applique une couleur de fond (semi-transparente) à toute la ligne du PJ selon sa nationnalité
    function colorRow(row, color) {
        row.querySelectorAll('td').forEach(cell => {
            cell.style.setProperty('background-color', `${color}4D`, 'important');
            cell.style.setProperty('background-clip', 'padding-box', 'important');
        });
 
        // Cible aussi directement la cellule contenant l’avatar s’il y a un lien avec l’id
        const avatarCell = row.querySelector('td.tdbc');
        if (avatarCell) {
            avatarCell.style.setProperty('background-color', `${color}4D`, 'important');
        }
    }
 
    // Crée un conteneur autour de l'avatar avec style et bordure
    function createAvatarWrapper(img, color, linkHref) {
        const isPNJ = img.src.includes('/npc/');
        const wrapper = document.createElement('a');
        wrapper.href = linkHref || '#';
        wrapper.style.display = 'inline-block';
        wrapper.style.position = 'relative';
        wrapper.style.width = isPNJ ? PNJ_SIZE : AVATAR_SIZE;
        wrapper.style.height = isPNJ ? PNJ_SIZE : AVATAR_SIZE;
        wrapper.style.backgroundColor = 'transparent';
        wrapper.style.zIndex = '1';
        if (isPNJ) {
            wrapper.style.border = `3px solid ${color}`;
            wrapper.style.borderRadius = '0';
        } else {
            wrapper.style.borderRadius = '50%';
        }
 
 
        img.style.width = isPNJ ? 'auto' : AVATAR_SIZE;
        img.style.height = isPNJ ? 'auto' : AVATAR_SIZE;
        img.style.maxHeight = isPNJ ? PNJ_SIZE : '';
        img.style.maxWidth = isPNJ ? 'none' : '';
        img.style.zIndex = '2';
 
        let imgContainer;
        if (isPNJ) {
            wrapper.style.border = `3px solid ${color}`;
            wrapper.style.borderRadius = '0';
 
            imgContainer = document.createElement('div');
            imgContainer.style.width = PNJ_SIZE;
            imgContainer.style.height = PNJ_SIZE;
            imgContainer.style.overflow = 'hidden';
            imgContainer.style.display = 'flex';
            imgContainer.style.alignItems = 'center';
            imgContainer.style.justifyContent = 'center';
            imgContainer.style.position = 'relative';
            img.style.position = 'relative';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.transform = 'none';
            imgContainer.appendChild(img);
        } else {
            img.style.borderRadius = '50%';
            img.style.position = 'relative';
            imgContainer = img;
 
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.inset = '0';
            overlay.style.borderRadius = '50%';
            overlay.style.boxShadow = `inset 0 0 0 4px ${color}`;
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '3';
            wrapper.appendChild(overlay);
        }
 
        wrapper.appendChild(imgContainer);
        return wrapper;
    }
 
    // Traitement des avatars pour les personnages joueurs (PJs)
    function handlePJAvatar(img, row, td) {
        const flagImg = Array.from(row.querySelectorAll('img')).find(img => {
            const file = img.src.split('/').pop();
            return flagColors.hasOwnProperty(file);
        });
 
        const color = flagImg ? flagColors[flagImg.src.split('/').pop()] : '#888';
        const link = td.querySelector('a[href*="main.php?p=6_1_0_1"]');
        const match = link?.href.match(/p1=(\d+)/);
 
        const wrapper = createAvatarWrapper(img, color, link?.href);
        td.replaceChildren(wrapper);
 
        // Ajout fond sur la cellule AVATAR
        td.style.setProperty('background-color', `${color}4D`, 'important');
 
        colorRow(row, color); // garde la coloration des autres cellules
 
        // Vérifie si le personnage est recherché (n'importe où dans la cellule de nom)
        const nameCell = row.querySelectorAll('td')[1];
        if (nameCell) {
            const originalHTML = nameCell.innerHTML;
            if (/\[recherchée?\]/i.test(originalHTML)) {
                nameCell.innerHTML = originalHTML.replace(/\s*\[recherchée?\]/gi, '');
                // Ajout du label "Recherché"
                const label = document.createElement('div');
                label.textContent = 'RECHERCHÉ';
                Object.assign(label.style, {
                    position:      'absolute',
                    bottom:        '2px',
                    left:          '50%',
                    transform:     'translateX(-50%)',
                    background:    'rgba(192,57,43,0.9)',
                    color:         '#fff',
                    padding:       '2px 6px',
                    fontSize:      '1em',
                    borderRadius:  '4px',
                    pointerEvents: 'none',
                    whiteSpace:    'nowrap',
                    zIndex:        '6',
                    fontFamily:    "'Roboto', sans-serif",
                    lineHeight:    '1.6'
                });
                wrapper.appendChild(label);
            }
        }
 
        if (match) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        fetchFunctionFromProfile(match[1], row);
                        observer.disconnect();
                    }
                });
            });
            observer.observe(row);
        }
    }
 
    // Traitement des avatars pour les PNJs (mise en forme différente)
    function handlePNJAvatar(img, row) {
        const td = img.closest('td.tdbc');
        if (!td) return;
 
        const flagImg = Array.from(row.querySelectorAll('img')).find(img => {
            const file = img.src.split('/').pop();
            return flagColors.hasOwnProperty(file);
        });
        const color = flagColors[flagImg?.src.split('/').pop()] || '#444';
        colorRow(row, color);
 
        td.replaceChildren(createAvatarWrapper(img, color));
 
        const nameCell = row.querySelectorAll('td')[1];
        if (nameCell) {
            styleNameCell(nameCell);
            const nameLink = nameCell.querySelector('a');
            if (nameLink) {
                nameLink.style.fontWeight = 'normal';
                nameLink.style.fontSize = '1.1em';
            }
 
            let nameText = nameCell.innerHTML;
            nameText = nameText.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '').replace(/<br><br>/g, '<br>');
 
            const regex = /(.+?)\s*\[(.+?)\]/;
            const match = nameText.match(regex);
            if (match) {
                const name = match[1].trim();
                const rawTitle = match[2].trim();
                const title = rawTitle.replace(/^\p{L}/u, c => c.toUpperCase()); // Majuscule Unicode
 
                let titleIcon = title === 'Capturé' ? lucideIcons.link : lucideIcons.user;
                let titleHtml = `${titleIcon}<i>${title}</i>`;
                let nameHtml = `<a href="${nameLink.href}" style="font-weight: bold; font-size: 1.1em;">${name}</a>`;
                if (!nameText.includes(titleHtml)) {
                    nameCell.innerHTML = `${nameHtml}<br>${titleHtml}`;
                } else {
                    nameCell.innerHTML = nameHtml;
                }
            }
        }
    }
 
    // Récupère les infos "fonction" et "domiciliation" depuis la page de profil d’un personnage
    async function fetchFunctionFromProfile(persoId, row) {
        if (functionCache[persoId] !== undefined) {
            insertFunctionBelowName(row, functionCache[persoId].func, functionCache[persoId].dom);
            return;
        }
 
        insertFunctionBelowName(row, 'Chargement...', '', true);
 
        try {
            const res = await fetch(`main.php?p=6_1_0_1&p1=${persoId}`);
            if (!res.ok) throw new Error('Network response was not ok');
 
            const buffer = await res.arrayBuffer();
            const html = new TextDecoder('iso-8859-1').decode(buffer);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const tds = Array.from(doc.querySelectorAll('td'));
            const fonction = tds.find(td => td.textContent.trim() === 'Fonction')?.nextElementSibling?.textContent.trim() || '';
            const domiciliation = tds.find(td => td.textContent.trim() === 'Domiciliation')?.nextElementSibling?.textContent.trim() || '';
            functionCache[persoId] = { func: fonction, dom: domiciliation };
 
            row.querySelector('.avatar-function')?.remove();
            insertFunctionBelowName(row, fonction, domiciliation);
        } catch (error) {
            insertFunctionBelowName(row, 'Erreur de chargement', '', true);
        }
    }
 
    // Vérifie si une ligne <tr> appartient à un groupe (nécessaire pour ne pas traiter les lignes isolées)
    function isInsideGroupRow(row) {
        let prev = row?.previousElementSibling;
        while (prev) {
            if (prev.tagName === 'TR' && prev.textContent.includes('Groupe')) return true;
            prev = prev.previousElementSibling;
        }
        return false;
    }
 
    // Traite toutes les lignes du tableau pour modifier les avatars
    function resizeAvatars() {
        document.querySelectorAll('table .tdbc img').forEach(img => {
            const src = img.src;
            if (src.includes('img.kraland.org/2/mat/')) return;
 
            const td = img.closest('td.tdbc');
            const row = img.closest('tr');
            if (!row || !td || !isInsideGroupRow(row)) return;
            if (row.querySelector('a[href*="order.php?p1=200"]')) return;
 
            const isPNJ = src.includes('img.kraland.org/2/npc/');
            if (isPNJ) return handlePNJAvatar(img, row);
            handlePJAvatar(img, row, td);
        });
    }
 
    // Ajoute un séparateur entre deux groupes affichés dans la même table
    function insertGroupSeparator() {
        const rows = document.querySelectorAll('table tr');
        let groupCount = 0;
 
        rows.forEach(row => {
            const hdr = row.querySelector('th a[href*="order.php"]');
            const isSpecial = row.querySelector('th a[href="order.php?p1=3004"]');
            if (!hdr || isSpecial) return;
 
            groupCount++;
            const next = row.nextElementSibling;
 
            if (groupCount > 1 && next && next.querySelector('td')) {
                const sep = document.createElement('tr');
                sep.innerHTML = '<td colspan="2">&nbsp;</td>';
                row.parentNode.insertBefore(sep, row);
            }
        });
    }
 
    // Lancement du traitement une fois que le DOM est chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            resizeAvatars();
            insertGroupSeparator();
        });
    } else {
        resizeAvatars();
        insertGroupSeparator();
    }
 
    // Ajout de styles CSS pour les en-têtes de groupe arrondis
    const style = document.createElement('style');
    style.textContent = `
    .thb {
      padding: 8px;
      text-align: center;
      border-radius: 15px;
      border-left: none !important;
      border-right: none !important;
      border-top: none !important;
       border-bottom: none !important;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    `;
    document.head.appendChild(style);
})();
