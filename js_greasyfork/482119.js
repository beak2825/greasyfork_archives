// ==UserScript==
// @name         Confluence Workflow - Management visuelle
// @namespace    Inetum/Confluence
// @version      0.1
// @description  Rajoute des fonctionnalités, améliore l'expérience globale du Confluence.
// @author       Philippe PELIZZARI
// @match        https://delivery.inetum.com/confluence/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inetum.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482119/Confluence%20Workflow%20-%20Management%20visuelle.user.js
// @updateURL https://update.greasyfork.org/scripts/482119/Confluence%20Workflow%20-%20Management%20visuelle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class PriorityManager {
        constructor() {
            this.priorityList = [
                {
                    priority: "Critique⠀",
                    correspondence: "Blocage",
                    description: "Problème urgent et sévère, impactant fortement les fonctionnalités ou la sécurité, nécessitant une résolution immédiate.",
                    image: "/jira/images/icons/priorities/critical.svg",
                    color: "#ff0000",
                    isDefault: false,
                },
                {
                    priority: "Majeur⠀",
                    correspondence: "Critique",
                    description: "Problème important affectant les fonctionnalités ou la performance, à résoudre rapidement pour minimiser les perturbations.",
                    image: "/jira/images/icons/priorities/major.svg",
                    color: "#ffaa00",
                    isDefault: false,
                },
                {
                    priority: "Normal",
                    correspondence: "Majeur",
                    description: "Trivial	Problème à traiter selon les ressources disponibles et les priorités supérieures déjà définie.",
                    image: "/jira/images/icons/priorities/trivial.svg",
                    color: "#7a8699",
                    isDefault: true,
                },
                {
                    priority: "Mineur",
                    correspondence: "Mineur",
                    description: "Problème mineur ou amélioration, à résoudre lorsque les tâches plus prioritaires sont terminées, sans impact sur le projet.",
                    image: "/jira/images/icons/priorities/minor.svg",
                    color: "#0088ff",
                    isDefault: false,
                },
                {
                    priority: "Annexe",
                    correspondence: "Simple",
                    description: "Activité secondaire, qui peut contribuer à l'amélioration du projet.",
                    image: "https://delivery.inetum.com/jira/secure/attachment/948542/icone-barre-oblique-verte.png",
                    color: "#abdf00",
                    isDefault: false,
                },
                {
                    priority: "À évaluer",
                    correspondence: "Important",
                    description: "Priorité non déterminée, nécessite une évaluation pour définir l'importance et l'impact sur le projet avant de l'attribuer à une priorité spécifique.",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png",
                    color: "#000000",
                    isDefault: false,
                },
            ];
        }

        findPriority(correspondence) {
            return this.priorityList.find(
                (item) => item.priority === correspondence.trim()
            );
        }

        findPriorityByCorrespondence(correspondence) {
            return this.priorityList.find(
                (item) => item.correspondence === correspondence.trim()
            );
        }

        updatePriorityElements(selector, updateFunction) {
            document.querySelectorAll(selector).forEach((element) => {
                const currentPriority = element.title || element.textContent.trim();
                const newPriority = this.findPriorityByCorrespondence(currentPriority);

                if (newPriority) {
                    updateFunction(element, newPriority);
                }
            });
        }
    }

    const priorityManager = new PriorityManager();

    class CustomAction {
        constructor() {

            if (!document.getElementById('menu__bar')) {
                document.getElementById('main').innerHTML += `<div id="menu__bar" style="margin-left: ${document.getElementById('footer').style.marginLeft}"></div>`

                /** On ajoute un observer pour le footer afin de suivre la sidebar */
                const config = { attributes: true, attributeFilter: ['style'] };
                const observerFooter = new MutationObserver((mutationsList, observer) => {
                    for(let mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            document.getElementById('menu__bar').style.marginLeft = document.getElementById('footer').style.marginLeft;
                        }
                    }
                });

                observerFooter.observe(document.getElementById('footer'), config);
            }
        }

        addButton(actionName, actionFunction, forceName = '') {
            if (document.querySelector(`#menu__bar #${forceName || actionName.replaceAll(' ', '')}`)) { return }

            const link = document.createElement('a');
            link.href = "#";
            link.innerHTML = actionName;

            const button = document.createElement('div');
            button.id = forceName || actionName.replaceAll(' ', '');
            button.className = "menu__bar__btn";
            button.appendChild(link);

            // Ajouter l'action personnalisée au lien
            link.addEventListener('click', actionFunction);

            document.getElementById('menu__bar').appendChild(button);
        }

        removeButton(actionName) {
            const button = document.getElementById(actionName);

            if (button) {
                button.parentNode.removeChild(button)
            }
        }

        closeSidebar() {
            return () => {
                document.querySelector('.ia-splitter-handle.tipsy-enabled').click()

                const b = document.getElementById('mSidebar').querySelector('a')
                b.innerHTML = b.innerHTML.includes('Fermer') ? b.innerHTML.replace('Fermer', 'Ouvrir') : b.innerHTML.replace('Ouvrir', 'Fermer');
            }
        }

        presentation() {
            return () => {
                document.getElementById('main').classList.toggle('full-page')
            }
        }

        refreshTables() {
            return () => {
                [...document.querySelectorAll('.refresh-action.refresh-issues-link')].map( _ => _.click())
                notify({type: 'refresh', content: 'Rafraîchissement des données en cours ...'})

                //@TODO: Fake notification, ajouter un observer
                setTimeout(() => {
                    notify({type: 'finish', content: 'Mise à jour des données JIRA réussi ...'})
                }, 1000)
            }
        }
    }


    executeActionOnUrlMatch("VBI+-+Suivi+des+livrables", document.getElementById('content'), (e) => {
        /** Changement des titres des headers de table */
        changeHeaderTable('Attribution', 'Responsable')
        changeHeaderTable('État', 'Status')
        changeHeaderTable('Résumé', 'Nom de l\'évolution')
        changeHeaderTable('Branche.', 'Nom de la branche')
        changeHeaderTable('Phase Test', 'Phase de test')
        changeHeaderTable('Version de correction', 'Nom du TAG')
        changeHeaderTable('Résultat obtenu', 'Résultat du TAG obtenu ?')
        changeHeaderTable('Nom bl prod', 'Nom du bon de livraison')

        changeHeaderTwoDimensionalTable('État', 'Étape du livrable')
        changeHeaderTwoDimensionalTable('T :', 'Total')

        orderColumnsTwoDimensionalTable('#livraison__team .two-dimensional-chart-table', [
            'Nouveau', 'Développement', 'Test', 'Tag à fournir', 'Bon de livraison', 'Livraison'
        ])

        /** Ajout d'un émoji */
        addEmoji('Philippe', '👦🏼');
        addEmoji('Logan', '🧑🏻');
        addEmoji('Vincent', '👴🏻');
        addEmoji('Rémy', '👶🏻');
        addEmoji('Armand', '👲🏻');

        /** On change les informations des cartes membres */
        [...document.querySelectorAll('#livraison__member .table-wrap')].map((node) => {
            if (node.innerText.includes('livrable') || !node.querySelector('.issue-link')) { return }

            const link = node.querySelector('.issue-link');
            let [number, demande] = link.innerText.trim().split(' ')

            if (parseInt(number) === 0) { demande = '❌ Aucun livrable en cours' }
            if (isNaN(parseInt(number))) { demande = '⏳ 1 livrable en cours' }
            if (parseInt(number) > 1) { demande = `⌛ ${number} livrables en cours` }

            link.innerText = demande

            if (!node.querySelector('img').src.includes('user-avatar')) {
                const image = node.querySelector('img').parentNode

                if (image.dataset.username === 'vbinot') { image.innerHTML = '👴🏻' }
                if (image.dataset.username === 'ppelizzari') { image.innerHTML = '👦🏼' }
                if (image.dataset.username === 'lleroy') { image.innerHTML = '🧑🏻' }
                if (image.dataset.username === 'rdellys') { image.innerHTML = '👶🏻' }
                if (image.dataset.username === 'aroncier') {image.innerHTML = '👲🏻' }

                image.classList.add('emoji-profile')
            }
        });

        /** On change la version "DM UEFE - G05R00C00" par "G05R00C00" */
        [...document.querySelectorAll('.aui tr > td:nth-child(4)')].map((node) => {
            if (node && node.innerText.includes('-')) {
                node.innerText = node.innerText.split('-')[1]
            }
        });

        /** Changement des priorités */
        [...document.querySelectorAll('.aui img')].map((node) => {
            const priority = priorityManager.findPriorityByCorrespondence(node.alt)

            if (priority && !node.attr?.updated) {
                node.setAttribute('updated', true)
                node.src = priority.image
            }
        });

        /** Ajout des alerts visuelles pour la date de livraison estimée */
        addAlert('Date de livraison estimée');

        setEmptyTable('livraison__avertissement', 'Bonne nouvelle Vincent tout est à l\'heure 📅')
        setEmptyTable('livraison__success', 'Aucun livrable terminé 😞')
        setEmptyTable('livraison__error', 'Good job la team 🎉')

        const customAction = new CustomAction();
        customAction.addButton(`${document.querySelector('.ia-fixed-sidebar.collapsed') ? 'Ouvrir' : 'Fermer'} le menu`, customAction.closeSidebar(), 'mSidebar');
        customAction.addButton('Présentation', customAction.presentation());
        customAction.addButton('Rafraîchir', customAction.refreshTables());
    });

    function changeHeaderTable(label, replace) {
        [...document.querySelectorAll('.jim-table-header-content')].map((node) => {
            if (node.innerText.toLowerCase() === label.toLowerCase()) {
                node.innerText = replace
            }
        })
    }

    function changeHeaderTwoDimensionalTable(label, replace) {
        [...document.querySelectorAll('.two-dimensional-chart-table th')].map((node) => {
            if (node.innerText.toLowerCase() === label.toLowerCase()) {
                node.innerText = replace
            }
        })
    }

    function orderColumnsTwoDimensionalTable(table, order) {
        if (document.querySelector(`${table} tr[data-order="true"]`)) { return }

        const correspondance = []
        order = order.map(_ => _.toLowerCase());

        document.querySelectorAll(`${table} tr:not(:first-child)`).forEach((tr, i) => {
            let reorderedRow = [];
            [...tr.children].forEach((td, j, a) => {
                // La dernière et la première colonne ne sont pas prisent en compte
                if (Object.is(a.length - 1, j) || i !== 0 && j === 0) { return }
                // On réindex les colonnes à cause du tableau bi-demensionnel
                if (i !== 0) { j-- }

                if (i === 0) {
                    correspondance[j] = document.querySelector(`${table} tr:not(:first-child) th:nth-child(${j + 1})`).innerText.trim().toLowerCase()
                }

                reorderedRow[order.indexOf(correspondance[j])] = td;
            });

            // filter(Boolean) réindex le tableau 0,1,2,3
            reorderedRow.filter(Boolean).forEach((_, k) => {
                if (i !== 0 ) { k++ }
                tr.children[k].outerHTML = _.outerHTML
            })

            tr.dataset.order = true;
        });
    }

    function addEmoji(field, emoji) {
        [...document.querySelectorAll('.aui tr > td')].map((node) => {
            if (node.innerText.toLowerCase().includes(field.toLowerCase()) && !node.innerText.includes(emoji)) {
                node.innerText = `${emoji} ${node.innerText}`
            }
        })
    }

    function setEmptyTable(id, message) {
        const nodeId = document.getElementById(id);
        if (nodeId && !nodeId.querySelector('.aui td') && !nodeId.querySelector('.jira-issues').innerText.includes(message)) {
            nodeId.querySelector('.jira-issues').innerHTML = `
                <div style="text-align: center; padding: 20px 0;">${message}</div>
            `
        }
    }

    function addAlert(field) {
        const index = [...document.querySelectorAll('#livraison__progress th')].findIndex(th => th.textContent.trim() === field);

        const alerts = [
            {days: 4 * 7, color: '#AAD8B0'}, // 1 mois vert
            {days: 2 * 7, color: '#FFEEAD'}, // 2 semaines jaune claire
            {days: 1 * 7, color: '#FFCC5C'}, // 1 semaine orange
            {days: 3, color: '#FF6F69'}, // 3 jours rouge pâle
            {days: 1, color: '#ff4141'} // 1 jour rouge
        ];

        [...document.querySelectorAll('#livraison__progress td:nth-child(' + index + ')')].forEach((node) => {
            const estimatedDate = new Date(node.innerText.replace('é', 'e'));

            for (const alert of alerts) {
                const now = new Date();

                now.setDate(now.getDate() + alert.days)
                console.log(now, estimatedDate, alert, now.getTime() <= estimatedDate.getTime());
                //  05 dec. 2023 / 02 janv. 2024 + 28j / 30 janv. 2024
                //  05 dec. 2023 / 19 dec. 2023 + 14j / 30 janv. 2024
                if (now.getTime() >= estimatedDate.getTime()) {
                    const transparency = (node.parentNode.classList.contains('rowAlternate')) ? 100 : 0
                    node.parentNode.style.setProperty('background', `linear-gradient(90deg, ${alert.color} 0%, rgb(255 255 255 / ${transparency}%) 45%, rgb(255 255 255 / ${transparency}%) 100%)`, 'important');

                }
            };
        });
    }

    function notify(message) {
        const numberOfNotification = document.getElementById('notify_me')?.querySelectorAll('.notify_me__box').length ?? 0;

        /** on créer la zone de notification si elle n'existe pas */
        if (!document.getElementById('notify_me')) {
            document.body.insertAdjacentHTML("afterend",`<div id="notify_me"></div>`)
        }

        switch (message.type){
            case 'refresh':
                message.emoji = '💨'
                message.title = 'Mise à jour'
                break;
            case 'finish':
                message.emoji = '✅'
                message.title = 'Terminé'
                break;
        }

        let notification = document.createElement('div');
        notification.className = "notify_me__box animation__slide_in_popup " + message.type;
        notification.style.bottom = `${120 + (numberOfNotification * 75)}px`;
        notification.innerHTML = `
            <div class="notify_me__box__emoji">${message.emoji}</div>
            <div class="notify_me__box__header">${message.title}</div>
            <div class="notify_me__box__content">${message.content}</div>
        `;

        document.getElementById('notify_me').appendChild(notification);

        setTimeout(() => {
            const first = document.querySelector('.notify_me__box:not(.animated):first-child')
            if (!first) { return }

            first.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(' + (120 + (numberOfNotification * 75)) + 'px)' }
            ], {
                duration: 600,
                easing: 'cubic-bezier(.93,.19,.71,.25)'
            });

            document.querySelector('.notify_me__box:first-child').classList += ' animated'

            setTimeout(() => {
                document.querySelector('.notify_me__box:first-child').remove();
            }, 599)
        }, 2000)
    }

    /**
    * On utilise un debounce car le module JIRA et Confluence génère beaucoup trop de changement dans DOM
    **/
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    /**
    * Création d'un observer sur les pages suivantes :
    *   - VBI+-+Suivi+des+livrables (VBI - Suivi des livrables)
    **/
    function executeActionOnUrlMatch(urlPart, node, observerAction) {
        if (window.location.href.includes(urlPart)) {
            const debouncedObserverAction = debounce((mutations) => {
                observerAction();
            }, 300);

            const observer = new MutationObserver(debouncedObserverAction);

            const observerConfig = {
                childList: true,
                subtree: true,
            };

            observer.observe(document.body ?? node, observerConfig);
        }
    }

    const css = `
    #livraison__member { display: flex; justify-content: space-between; margin-bottom: 20px; }
    #livraison__member .table-wrap { width: fit-content; min-width: 215px; padding: 20px 40px; box-shadow: inset 0 0 8px 2px #898989; background: #323232!important; margin: 0 }
    #livraison__member .table-wrap .email,
    #livraison__member .table-wrap .profile-full { display: none }
    #livraison__member .emoji-profile { font-size: 44px; margin-top: 14px; top: -8px; position: absolute; left: -4px; }
    #livraison__member .table-wrap table tr { background: initial; position: relative }
    #livraison__member .table-wrap table tr h4 a { color: white }
    #livraison__member .table-wrap td:nth-child(2) { position: absolute; left: 64px; top: 25px }

    #livraison__team .chart-summary { display: none }
    #livraison__team .two-dimensional-chart-module { width: 100% }
    #livraison__team .two-dimensional-chart { border-radius: 5px; width: 100% }
    #livraison__team .chart-border { border: none; padding: 0; width: 100% }
    #livraison__team .chart-border table tr:first-child,
    #livraison__team .chart-border table tr:nth-child(2) { background: linear-gradient(90deg, rgba(50,50,50,1) 0%, rgba(50,50,50,1) 45%, rgb(0 207 243) 100%) }
    #livraison__team .chart-border table tr th { background: initial!important; color:white; font-weight: bold; border: none; padding: 3px 10px; }
    #livraison__team .chart-border table tr td { padding: 3px 10px; }
    #livraison__team .chart-border .two-dimensional-chart-table .totals { background: unset }
    #livraison__team .jira-issue-status-lozenge { background: none; color: white; padding: 0; vertical-align: baseline; }

    #main.full-page {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0!important;
        z-index: 9999;
    }
    #main.full-page #breadcrumb-section,
    #main.full-page #page-metadata-banner,
    #main.full-page #navigation,
    #main.full-page #likes-and-labels-container,
    #main.full-page #comments-section { display: none }
    #main.full-page #menu__bar { margin-left: 0!important }

    #menu__bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        z-index: 9999;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #323232;
    }
    #menu__bar .menu__bar__btn { position: relative; width: 155px; height: 50px; margin: 20px; cursor: pointer; }
    #menu__bar .menu__bar__btn a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 30px;
        color: white;
        z-index: 1;
        font-weight: 400;
        letter-spacing: 1px;
        text-decoration: none;
        overflow: hidden;
        transition: 0.5s;
        backdrop-filter: blur(15px);
    }
    #menu__bar .menu__bar__btn:hover a { letter-spacing: 3px }
    #menu__bar .menu__bar__btn a::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        background: linear-gradient(to left, rgba(255, 255, 255, 0.15), transparent);
        transform: skewX(45deg) translateX(0);
        transition: 0.5s;
    }
    #menu__bar .menu__bar__btn:hover a::before { transform: skewX(45deg) translateX(200%) }
    #menu__bar .menu__bar__btn::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -5px;
        width: 30px;
        height: 10px;
        background: #f00;
        border-radius: 10px;
        transition: 0.5s;
    }
    #menu__bar .menu__bar__btn:hover::before {
        bottom: 0;
        height: 50%;
        width: 80%;
        border-radius: 30px;
        transition-delay: 0.5s;
    }
    #menu__bar .menu__bar__btn::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -5px;
        width: 30px;
        height: 10px;
        background: #f00;
        border-radius: 10px;
        transition: 0.5s;
    }
    #menu__bar .menu__bar__btn:hover::after {
        top: 0;
        height: 50%;
        width: 80%;
        border-radius: 30px;
        transition-delay: 0.5s;
    }
    #menu__bar .menu__bar__btn:nth-child(1)::before,
    #menu__bar .menu__bar__btn:nth-child(1)::after {
        background: #ff1f71;
        box-shadow: 0 0 5px #ff1f71, 0 0 15px #ff1f71, 0 0 30px #ff1f71, 0 0 60px #ff1f71;

    }
    #menu__bar .menu__bar__btn:nth-child(2)::before,
    #menu__bar .menu__bar__btn:nth-child(2)::after {
        background: #2bd2ff;
        box-shadow: 0 0 5px #2bd2ff, 0 0 15px #2bd2ff, 0 0 30px #2bd2ff, 0 0 60px #2bd2ff;
    }
    #menu__bar .menu__bar__btn:nth-child(3)::before,
    #menu__bar .menu__bar__btn:nth-child(3)::after {
        background: rgb(255 249 0);
        box-shadow: 0 0 5px rgb(255 249 0), 0 0 15px rgb(255 249 0), 0 0 30px rgb(255 249 0), 0 0 60px rgb(255 249 0);
    }

    @keyframes slideInPopup {
        0% { animation-timing-function: ease-in; opacity: 0; transform: translateY(100px); }
        38% { animation-timing-function: ease-out; opacity: 1; transform: translateY(0);}
        55% { animation-timing-function: ease-in; transform: translateY(55px); }
        72% { animation-timing-function: ease-out; transform: translateY(0); }
        81% { animation-timing-function: ease-in; transform: translateY(28px); }
        90% { animation-timing-function: ease-out; transform: translateY(0); }
        95% { animation-timing-function: ease-in; transform: translateY(8px); }
        100% { animation-timing-function: ease-out; transform: translateY(0); }
    }
    @keyframes slideOutPopup {
        0% { transform: translateY(0); }
        100% { transform: translateY(100px); }
    }

    #notify_me {}
    #notify_me .notify_me__box {
        background: rgb(175, 219, 251);
        width: fit-content;
        min-width: 300px;
        border-radius: 8px;
        box-shadow: rgb(128, 195, 255) 0px 0px 6px 2px;
        border: 2px solid rgb(193, 235, 255);
        margin: auto;
        position: absolute;
        bottom: 120px;
        right: 60px;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: repeat(2, 1fr);
        row-gap: 2px;
        z-index: 9998;
    }
    #notify_me .notify_me__box__emoji {
        font-size: 25px;
        grid-area: 1 / 1 / 3 / 2;
        background: linear-gradient(270deg, #afdbfb, white);
        padding: 11px;
        border-radius: 6px;}
    #notify_me .notify_me__box__header {
        color: rgb(40, 64, 86);
        text-transform: uppercase;
        font-weight: bold;
        font-size: 11px;
        grid-area: 1 / 2 / 2 / 3;
        margin-top: 11px;
    }
    #notify_me .notify_me__box__content {
        padding-right: 19px;
        font-size: 12px;
        color: white;
        grid-area: 2 / 2 / 3 / 3;
    }
    #notify_me .notify_me__box.finish {
        background: rgb(186 227 178);
        box-shadow: rgb(171 255 128) 0px 0px 6px 2px;
        border: 2px solid rgb(193 255 195);
    }
    #notify_me .notify_me__box.finish .notify_me__box__emoji { background: linear-gradient(270deg, rgb(186 227 178), white); }
    #notify_me .notify_me__box.finish .notify_me__box__header { color: rgb(49 97 62) }
    .animation__slide_in_popup { animation: slideInPopup 1000ms cubic-bezier(0.85, 0, 0.15, 1); 0s 1 normal both; }
    .animation__slide_out_popup { animation: slideOutPopup 600ms cubic-bezier(.93,.19,.71,.25); }
    `

    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(css);
    document.adoptedStyleSheets = [stylesheet];
})();