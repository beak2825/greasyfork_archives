// ==UserScript==
// @name         Outil d'amélioration de JIRA
// @namespace    Inetum/Jira
// @version      0.1
// @description  Rajoute des fonctionnalités, améliore l'expérience globale du JIRA et des priorités.
// @author       Philippe PELIZZARI
// @match        https://delivery.inetum.com/jira/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inetum.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482118/Outil%20d%27am%C3%A9lioration%20de%20JIRA.user.js
// @updateURL https://update.greasyfork.org/scripts/482118/Outil%20d%27am%C3%A9lioration%20de%20JIRA.meta.js
// ==/UserScript==

(function () {
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

    function updatePriorityTable() {
        let i = 0;
        document.querySelectorAll(".priorities-table .priority-row").forEach((row) => {
            const priority = priorityManager.priorityList[i];
            row.querySelector(".priority-icon-cell img").src = priority.image;
            row.querySelector(".priority-name").textContent = priority.priority;
            row.querySelector("td:nth-child(3)").textContent = priority.description;
            row.querySelector(".priority-color").style.backgroundColor = priority.color;
            row.querySelector(".priority-color").dataset.color = priority.color;

            i++;
        });
    }

    function updateGhxPriority(ghx, newPriority) {
        ghx.title = newPriority.priority;
        ghx.querySelector("img").src = newPriority.image;
    }

    function updateListItem(itemTextElement, newPriority) {
        itemTextElement.childNodes.forEach((node) => {
            if (
                node.nodeType === Node.TEXT_NODE &&
                node.textContent.trim() === itemTextElement.innerText.trim()
            ) {
                node.textContent = " " + newPriority.priority;
            }
        });
        itemTextElement.querySelector("img").src = newPriority.image;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        priorityManager.updatePriorityElements(
                            ".ghx-priority",
                            updateGhxPriority
                        );

                        const priorityId = document.getElementById("priority-val");
                        if (priorityId) {
                            const newPriority = priorityManager.findPriorityByCorrespondence(priorityId.innerText);
                            if (newPriority) {
                                priorityId.querySelector("img").src = newPriority.image;
                                priorityId.childNodes.forEach((node) => {
                                    if (
                                        node.nodeType === Node.TEXT_NODE &&
                                        node.textContent.trim() === priorityId.innerText.trim()
                                    ) {
                                        node.textContent = " " + newPriority.priority;
                                    }
                                });
                            }
                        }

                        const inputSelector = document.getElementById("priority-single-select")?.querySelector("input");
                        if (inputSelector) {
                            const newPriority = priorityManager.findPriorityByCorrespondence(inputSelector.value);
                            if (newPriority) {
                                inputSelector.value = newPriority.priority;
                                document.getElementById("priority-single-select").querySelector(".aui-ss-entity-icon").src = newPriority.image;
                            }
                        }

                        priorityManager.updatePriorityElements("#priority-suggestions .aui-list-item-link", updateListItem);
                    }
                });
            }
        });
    });

    const observerConfig = {
        childList: true,
        subtree: true,
    };

    observer.observe(document.body, observerConfig);
    updatePriorityTable();

    /** Affichage en fonction des URL */
    function executeActionOnUrlMatch(urlPart, observerAction) {
        if (window.location.href.includes(urlPart)) {
            const observer = new MutationObserver((mutations) => {
                observerAction();
            });

            const observerConfig = {
                childList: true,
                subtree: true,
            };

            observer.observe(document.body, observerConfig);
        }
    }

    function setTitleEmoji(selector) {
        const element = document.querySelector('.ghx-column-title[original-title="' + selector + '"]');
        if (element && selector && !element.innerText.includes(chooseEmoji(selector).emoji)) {
            element.innerText = chooseEmoji(selector).emoji + " " + element.innerText;
        }
    }

    function chooseEmoji(string) {
        const emoji = string.toLowerCase();
        return emoji === "heureux" ? {emoji: "💚", color: "vert"} : emoji === "neutre" ? {emoji: "😶", color: "jaune"} : emoji === "en colère" ? {emoji: "🤬", color: "rouge"} : {emoji: "⚪", color: "gris"};
    }

    function quickEditIssue() {
        /** Ajout du bouton pour modifier rapidement une JIRA */
        document.querySelectorAll(".ghx-issue").forEach((ticket) => {
            if (!ticket.querySelector("#edit-issue")) {
                ticket.onclick = function () { this.click(); };

                const id = ticket.dataset.issueId;
                const hasHiddenFooter = ticket.querySelector('.ghx-card-footer .ghx-type').style.display === 'none' ? true : false
                ticket.querySelector(".ghx-card-footer .ghx-flags").insertAdjacentHTML("afterend",
                                                                                       `<a id="edit-issue" title="Modifier ce ticket ( Type 'e' )" class="toolbar-trigger issueaction-edit-issue ${hasHiddenFooter ? 'hidden-footer' : ''}" href="/jira/secure/EditIssue!default.jspa?id=${id}" resolved="" style="color:#8993a4;margin-left: auto;">
                        <span class="icon aui-icon aui-icon-small aui-iconfont-edit"></span>
                    </a>`
                );
            }
        });
    }

    function headerRight(status = {color: 'bleue', emoji: ''}) {
        const imgAssignee = document.getElementById('assignee-val')?.querySelector('img').src.replace('small', 'large')
        const linkToJira = document.getElementById('issuekey-val').querySelector('a').outerHTML
        const buttonAction = document.getElementById('ghx-detail-head').querySelector('.ghx-controls').outerHTML
        const createdAt = document.getElementById('created-val')?.querySelector('time').innerHTML
        const updatedAt = document.getElementById('updated-val').querySelector('time').innerHTML
        const name = document.getElementById('summary-val').innerText

        /** Ajout des informations de base d'un ticket */
        let preHeaderHTML = `
            <div class="pre__header">
                <div class="pre__header__photo"><img src="${imgAssignee}"></div>
                <div class="pre__header__jira">
                    <dd id="issuekey-val" class="ghx-detail-description ghx-fieldtype-undefined ghx-fieldname-issuekey" data-field-id="issuekey" title="issue.key">${linkToJira}</dd>
                </div>
                <div class="pre__header__actions">${buttonAction}</div>
                <div class="pre__header__creation">Création: ${createdAt}</div>
                <div class="pre__header__modification">Mise à jour: ${updatedAt}</div>
                <div class="pre__header__title ${status.color}"><span style="padding-right: 8px">${status.emoji}</span>${name}</div>
            </div>
        `;

        /** Ajout des pièces jointes */
        document.querySelectorAll('.attachment-content').forEach((node) => {
            const filename = node.querySelector('.attachment-title').outerHTML
            const dateAdded = node.querySelector('.attachment-date').innerHTML
            const size = node.querySelector('.attachment-size').innerText

            preHeaderHTML += `<div class="pre__file"><div><span>🎃</span> ${filename}</div><div>${dateAdded}</div><div>${size}</div></div>`
        });

        return preHeaderHTML
    }

    function footerRight(preHeaderHTML, boxHTML) {
        document.querySelector(".jira__view__details")?.remove();
        document.querySelector(".ghx-detail-view .ui-resizable-outer").insertAdjacentHTML("afterend", `<div class="jira__view__details">${preHeaderHTML + boxHTML}</div>`);
        document.getElementById("ghx-detail-issue").style.display = "none";
        document.getElementById("ghx-detail-contents").style.height = 0;
    }

    function addPriorityStyleHeader(header, priority, emoji) {
        if (header.ariaLabel.toLowerCase().includes(priority)) {
            const span = header.querySelector(".ghx-heading span:not(.ghx-info)");
            header
                .querySelector(".ghx-heading")
                .classList.add("ghx-heading-custom", priority);
            span.innerText = emoji + " " + span.innerText;
        }
    }

    function changeLabelForm(field, label) {
        const selector = document.querySelector('label[for="' + field + '"]');

        if (selector && selector.innerText !== label) {
            [...document.querySelectorAll('label[for="' + field + '"]')].map((node) => {node.innerText = label});
        }
    }



    function stopDragAndDropEventListenerIssue(types) {
        document.querySelectorAll('.ghx-issue').forEach((node) => {
            if (types.some(v => node.closest('.ghx-swimlane').querySelector('.ghx-swimlane-header').ariaLabel.toLowerCase().includes(v))) {

                if (!node.hasListener) {
                    node.addEventListener('mousedown', function(event) {
                        /** On stop tout de suite le drag and drop */
                        event.stopPropagation();

                        const mousePos = { x: event.clientX, y: event.clientY };
                        const mouseMoveHandler = (e) => {
                            if (Math.abs(mousePos.x - e.clientX) > 20) {
                                notify({
                                    type: 'error',
                                    content: 'Vous ne pouvez pas déplacer la carte, elle est actuellement en "erreur".<br>Veuillez d\'abord la corriger avant de déplacer à nouveau la carte.'
                                })
                            }
                        };

                        this.addEventListener('mousemove', mouseMoveHandler);
                        document.addEventListener('mouseup', () => {
                            this.removeEventListener('mousemove', mouseMoveHandler);
                        }, { once: true });
                    }, true);

                    node.hasListener = true;
                }
            }
        });
    }

    function notify(message) {
        if (document.getElementById('notify_me')) { return false; }
        document.body.classList.add('no-selection');

        switch (message.type){
            case 'error':
                message.title = message.title ?? '⛔ Carte en erreur'
                break;
        }

        document.body.insertAdjacentHTML("afterend", `
            <div id="notify_me" class="animation__fade_in">
                <div class="notify_me__box animation__slide_in_popup">
                    <div class="notify_me__box__header">${message.title}</div>
                    <div class="notify_me__box__content">${message.content}</div>
                    <div class="notify_me__box__footer ${message.type}">Fermer</div>
                </div>
            </div>
        `)

        /** Quand on clique sur le bouton pour fermer la notification */
        document.querySelector('.notify_me__box__footer').addEventListener('click', () => {
            /** On enlève la surbrillance pour éviter les bugs d'affichage quand la notification apparaît */
            document.body.classList.remove('no-selection')

            /** Animation */
            document.querySelector('.notify_me__box').classList.remove('animation__slide_in_popup')
            document.querySelector('.notify_me__box').classList.add('animation__slide_out_popup')
            document.getElementById('notify_me').classList.remove('animation__fade_in')
            document.getElementById('notify_me').classList.add('animation__fade_out')

            setTimeout(() => {
                document.getElementById('notify_me').remove();
            }, 600)
        }, {once: true})
    }





    function removeInformationTicket(label) {
        document.querySelector('strong[title="' + label + '"]').closest(".item").style.display = 'none';
    }

    function removeInformationQuickTicket(label) {
        /** Si la fênetre d'édition rapide est ouverte */
        if (document.getElementById('edit-issue-dialog')) {
            if (label === 'Pièce jointe') {
                document.getElementById('edit-issue-dialog').querySelector('.content .field-group+fieldset').style.display = 'none';
            } else {
                document.getElementById('edit-issue-dialog').querySelector('label[for="' + label + '"]').closest(".field-group").style.display = 'none';
            }
        }
    }

    function removeModuleJira(label) {
        document.querySelector('button[aria-label="' + label + '"]')?.closest(".module").remove()
    }

    /** Date string en date française */
    function stringToDate(string, format, local = 'fr-FR') {
        let date, time, day, mounth, year = '';

        if (local === 'fr-FR') {
            [date, time] = string.split(' ');
            [day, mounth, year] = date.split('/');
            date = `${mounth}/${day}/${year} ${time ?? ''}`
        }

        return new Intl.DateTimeFormat(local, {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    }

    /** HUMEUR */
    executeActionOnUrlMatch("rapidView=4394", () => {
        /** On cache les icônes inutiles sur les cartes */
        document.querySelectorAll(".ghx-card-footer").forEach((node) => {
            node.querySelector('.ghx-type').style.display = "none";
            node.querySelector('.ghx-flags').style.display = "none";
        });

        /** On redéfini la zone à droite pour la rendre plus jolie et plus utile */

        if (document.getElementById("ghx-detail-issue") && !(document.getElementById("ghx-detail-issue").style.display === 'none')) {
            const status = document.getElementById("status-val").querySelector("span").innerText.charAt(0) + document.getElementById("status-val").querySelector("span").innerText.toLowerCase().slice(1);
            let amelioration = document.getElementById("customfield_18266-val");
            let risque = document.getElementById("customfield_18270-val");

            amelioration = amelioration.querySelector(".flooded") ? amelioration.querySelector(".flooded").innerHTML : amelioration.innerText
            risque = risque.querySelector(".flooded") ? risque.querySelector(".flooded").innerHTML : risque.innerText


            const preHeaderHTML = headerRight(chooseEmoji(status));

            let boxHTML = `
                <div class="box vert">
                    <div class="box__header">💭 COMMENTAIRES / IDÉES ...</div>
                    <div class="box__content description">${amelioration !== 'Aucune' ? amelioration : '-'}</div>
                </div>
                <div class="box rouge">
                    <div class="box__header">💥 IRRITANTS / RISQUES / PROBLÈMES ...</div>
                    <div class="box__content description">${risque !== 'Aucune' ? risque : '-'}</div>
                </div>
            `;

            document.querySelector(".jira__view__details")?.remove();
            document.querySelector(".ghx-detail-view .ui-resizable-outer").insertAdjacentHTML("afterend", `<div class="jira__view__details">${preHeaderHTML + boxHTML}</div>`);
            document.getElementById("ghx-detail-issue").style.display = "none";
            document.getElementById("ghx-detail-contents").style.height = 0;
        }

        quickEditIssue()

        setTitleEmoji("JE NE SAIS PAS");
        setTitleEmoji("EN COLÈRE");
        setTitleEmoji("NEUTRE");
        setTitleEmoji("HEUREUX");

        changeLabelForm("customfield_18270", "Irritants, Risques, Problèmes");
        changeLabelForm("customfield_18266", "Commentaires, Idées");

        removeInformationQuickTicket('assignee-field');
        removeInformationQuickTicket('reporter-field');
        removeInformationQuickTicket('comment');

    });

    /** CONGES */
    executeActionOnUrlMatch("rapidView=4402", () => {
        changeLabelForm("customfield_13226", "Date de début des congés");
        changeLabelForm("customfield_13227", "Date de fin des congés");

        removeInformationQuickTicket('reporter-field');
        removeInformationQuickTicket('description');
        removeInformationQuickTicket('comment');
        removeInformationQuickTicket('Pièce jointe');


        if (document.getElementById("ghx-detail-issue") && !(document.getElementById("ghx-detail-issue").style.display === 'none')) {
            /** Ajout des informations de base d'un ticket */
            let preHeaderHTML = headerRight()


            /** Récupération des dates hors date création et mise à jour */
            let boxDatesHTML = '';
            document
                .getElementById("details-module-dates")
                .querySelectorAll(".item-details .dates")
                .forEach((node) => {
                const label = node.querySelector("dt")?.innerText;
                const value = node.querySelector("dd")?.innerText;

                if (!label.includes("Création") && !label.includes("Mise à jour")) {
                    boxDatesHTML += `<div class="box__field"><div class="box__label">${label}</div><div class="box__value">${value !== 'Aucune' ? stringToDate(value, 'rr') : '-'}</div></div>`;
                }
            });

            let boxHTML = `
                <div class="box rose">
                    <div class="box__header">📅 DATES</div>
                    <div class="box__content">${boxDatesHTML}</div>
                </div>
            `;

            footerRight(preHeaderHTML, boxHTML)
        }

        if (document.getElementById('header-details-user-fullname').dataset.displayname === 'Philippe Pelizzari') {
            document.querySelectorAll('.ghx-issue').forEach((node) => {
                if (node.parentNode.dataset.columnId === '32982') {
                    if (!node.hasListener) {
                        node.addEventListener('mousedown', function(event) {

                            const mousePos = { x: event.clientX, y: event.clientY };
                            const mouseMoveHandler = (e) => {
                                if (Math.abs(mousePos.x - e.clientX) > 20) {
                            document.getElementById('ghx-pool').querySelector('.ghx-zone-overlay .ghx-zone-overlay-column:nth-child(3)').remove();
                                    notify({
                                        type: 'error',
                                        title: 'Validation des congés',
                                        content: 'Vous n\'êtes pas autorisé à valider les demandes de congé.'
                                    })
                                }
                            };

                            this.addEventListener('mousemove', mouseMoveHandler);
                            document.addEventListener('mouseup', () => {
                                this.removeEventListener('mousemove', mouseMoveHandler);
                            }, { once: true });
                        }, true);

                        node.hasListener = true;
                    }
                }
            });
        }

        quickEditIssue()

    });

    /** LIVRABLE */
    executeActionOnUrlMatch("rapidView=4413", () => {
        changeLabelForm("summary", "Nom de l'évolution");
        changeLabelForm("customfield_12801", "Nom de la branche");
        changeLabelForm("customfield_12079", "Avancement du développement");
        changeLabelForm("customfield_13176", "Phase de test");
        changeLabelForm("customfield_13201", "Nom du TAG");
        changeLabelForm("customfield_12519", "Résultat du TAG obtenu ?");
        changeLabelForm("customfield_13193", "Nom du bon de livraison");
        changeLabelForm("customfield_13412", "Date d'envoi du bon de livraison");

        /** Information visuelle (barre au dessus d'une row de ticket) */
        document.querySelectorAll(".ghx-swimlane-header").forEach((header) => {
            if (header && !header.querySelector(".ghx-heading-custom")) {
                addPriorityStyleHeader(header, "urgent", "🛑");
                addPriorityStyleHeader(header, "erreur", "⚠️");
                addPriorityStyleHeader(header, "avertissement", "⌛");
                addPriorityStyleHeader(header, "avancer", "✅");
            }
        });


        if (document.getElementById("ghx-detail-issue") && !(document.getElementById("ghx-detail-issue").style.display === 'none')) {
            const imgAssignee = document.getElementById('assignee-val').querySelector('img').src.replace('small', 'large')
            const linkToJira = document.getElementById('issuekey-val').querySelector('a').outerHTML
            const buttonAction = document.getElementById('ghx-detail-head').querySelector('.ghx-controls').outerHTML
            const createdAt = document.getElementById('created-val').querySelector('time').innerHTML
            const updatedAt = document.getElementById('updated-val').querySelector('time').innerHTML
            const name = document.getElementById('summary-val').innerText

            /** Ajout des informations de base d'un ticket */
            let preHeaderHTML = headerRight()


            /** Récupération des dates hors date création et mise à jour */
            let boxDatesHTML = '';
            document
                .getElementById("details-module-dates")
                .querySelectorAll(".item-details .dates")
                .forEach((node) => {
                const label = node.querySelector("dt")?.innerText.slice(0, -1);
                const value = node.querySelector("dd")?.innerText;

                if (!label.includes("Création") && !label.includes("Mise à jour")) {
                    boxDatesHTML += `<div class="box__field"><div class="box__label">${label === 'Envoyé' ? 'Date d\'envoi du bon de livraison' : label}</div><div class="box__value">${value !== 'Aucune' ? stringToDate(value, 'rr') : '-'}</div></div>`;
                }
            });

            /** Récupération des informations */
            let boxInformationsHTML = '';
            document
                .getElementById("details-module")
                .querySelectorAll(".mod-content > ul > li")
                .forEach((node) => {
                const label = node.querySelector("strong label")?.innerText;
                let value = node.querySelector(".value")?.innerText;

                if (label === 'Version(s) corrigée(s):') {
                    value = value.split('-')[1] ?? '-';
                }

                if (label === 'Priorité:') {
                    value = `<img height="16" width="16" style="vertical-align: middle;" src="${priorityManager.findPriority(value).image}" /> ${value}`;
                }

                boxInformationsHTML += `<div class="box__field"><div class="box__label">${label ?? 'État de la carte'}</div><div class="box__value">${value !== 'Aucune' ? value : '-'}</div></div>`;
            });

            /** Recupération del a description */
            let boxDescriptionHTML = document.querySelector(".user-content-block")?.innerHTML;
            if (boxDescriptionHTML && boxDescriptionHTML.includes("Cliquer pour ajouter une description")) {
                boxDescriptionHTML = "";
            }

            let boxHTML = `
                <div class="box rose">
                    <div class="box__header">📅 DATES</div>
                    <div class="box__content">${boxDatesHTML}</div>
                </div>
                <div class="box jaune">
                    <div class="box__header">🔧 INFORMATIONS</div>
                    <div class="box__content">${boxInformationsHTML}</div>
                </div>
                <div class="box bleue">
                    <div class="box__header">📄 DESCRIPTION</div>
                    <div class="box__content description">${boxDescriptionHTML}</div>
                </div>
            `;

            document.querySelector(".jira__view__details")?.remove();
            document.querySelector(".ghx-detail-view .ui-resizable-outer").insertAdjacentHTML("afterend", `<div class="jira__view__details">${preHeaderHTML + boxHTML}</div>`);
            document.getElementById("ghx-detail-issue").style.display = "none";
            document.getElementById("ghx-detail-contents").style.height = 0;

        }

        quickEditIssue()
        stopDragAndDropEventListenerIssue(['erreur'])
    });

    const authorizedType = [
        'Livraison',
        'Humeur'
    ]

    /** Vue détaillé de chaque ticket */
    executeActionOnUrlMatch("jira/browse", (e) => {
        const ticketType = document.getElementById('type-val').innerText.trim()
        console.log(ticketType);
        if (!authorizedType.includes(ticketType)) {
            return false;
        }

        switch (ticketType) {
            case 'Livraison':
                /** Changement des libellés */
                changeLabelForm("customfield_12801", "Nom de la branche");
                changeLabelForm("customfield_12079", "Avancement du développement");
                changeLabelForm("customfield_13176", "Phase de test");
                changeLabelForm("customfield_13201", "Nom du TAG");
                changeLabelForm("customfield_12519", "Résultat du TAG obtenu ?");
                changeLabelForm("customfield_13193", "Nom du bon de livraison");
                changeLabelForm("customfield_13412", "Date d'envoi du bon de livraison");

                /** Suppression des champs inutiles */
                removeInformationTicket('Affecte la/les version(s)');
                removeInformationTicket('Composants');
                removeInformationTicket('Étiquettes');

                /** Suppression des modules inutiles */
                removeModuleJira('CI Builds');
                removeModuleJira('Agile');
                removeModuleJira('CucumberStudio');
                removeModuleJira('Clockify');

                document.getElementById('datesmodule').querySelectorAll('.dates').forEach((node) => {
                    const label = node.querySelector("dt")?.innerText.slice(0, -1);
                    const value = node.querySelector("dd")?.innerText;

                    if (!label.includes("Création") && !label.includes("Mise à jour") && !node.querySelector("dd .text-time")) {
                        node.querySelector("dd").innerHTML = `
                           <span class="text-time">${value !== 'Aucune' ? stringToDate(value, 'rr') : '-'}</span>
                       `;
                    }
                });

                break;
            case 'Humeur':
                changeLabelForm("customfield_18270", "Irritants, Risques, Problèmes");
                changeLabelForm("customfield_18266", "Commentaires, Idées");

                removeInformationTicket('Priorité');
                removeInformationTicket('Affecte la/les version(s)');
                removeInformationTicket('Composants');
                removeInformationTicket('Étiquettes');
                removeInformationTicket('Résolution');
                removeInformationTicket('Version(s) corrigée(s)');

                removeInformationQuickTicket('assignee-field');
                removeInformationQuickTicket('reporter-field');
                removeInformationQuickTicket('comment');

                /** Suppression des modules inutiles */
                removeModuleJira('CI Builds');
                removeModuleJira('Agile');
                removeModuleJira('CucumberStudio');
                removeModuleJira('Clockify');

                break;
        }

    });

    /** Modification, ajout de classe CSS */
    const css = `
        .no-selection { user-select: none; }
        .ghx-extra-field {
            padding: 0px 10px;
            border-radius: 20px;
            color: white;
            font-size: 10px;
            margin-bottom: 2px;
        }

        .ghx-extra-fields .ghx-extra-field-row:first-child .ghx-extra-field {
            background: #0747a6;
        }

        .ghx-extra-fields .ghx-extra-field-row:not(:first-child) .ghx-extra-field {
            background: #5bbfe7;
        }

        .ghx-heading-custom {
            color: white;
            padding: 2px 0px;
            border-radius: 2px;
        }

        .ghx-heading-custom.urgent { background: black; }
        .ghx-heading-custom.erreur { background: #f53053; }
        .ghx-heading-custom.avertissement { background: #ffc417; }
        .ghx-heading-custom.avancer { background: #64bd05; }
        .ghx-detail-contents { background: none; }
        .ghx-card-footer .hidden-footer {
            position: absolute;
            left: 92px;
            top: 11px;
         }

        .bleue { background: rgb(122 199 255)!important }
        .vert { background: rgb(127, 217, 122)!important }
        .jaune { background: rgb(255 215 0)!important }
        .rouge { background: rgb(255, 100, 63)!important }
        .gris { background: #dcdfe5!important }

        .box {
            background: #f4f5f7;
            border-radius: 5px;
            margin: 10px 20px 20px 10px;
            box-shadow: 9px 9px 0px 0px grey, 9px 9px 0 3px rgb(236 237 240);
            border: 3px solid rgb(236 237 240);
            position: relative;
            display: block;
        }

        .box.rose { box-shadow: 9px 9px 0px 0px pink, 9px 9px 0 3px rgb(236 237 240); }
        .box.jaune { box-shadow: 9px 9px 0px 0px gold, 9px 9px 0 3px rgb(236 237 240); }
        .box.bleue { box-shadow: 9px 9px 0px 0px rgb(122 199 255), 9px 9px 0 3px rgb(236 237 240); }
        .box.rouge { box-shadow: 9px 9px 0px 0px rgb(255 100 63), 9px 9px 0 3px rgb(236 237 240); }
        .box.vert { box-shadow: 9px 9px 0px 0px rgb(127 217 122), 9px 9px 0 3px rgb(236 237 240); }

        .box__header {
            width: 100%;
            font-weight: bold;
            text-align: center;
            backdrop-filter: blur(5px);
            color: #545454;
            background: white;
            border-bottom: 3px solid rgb(236 237 240);
            padding: 6px 0;
            font-family: monospace
        }

        .box__field { display: flex; width: 100%; }
        .box__label:first-child { margin-top:0; }
        .box__label:last-child { margin-bottom:0; }
        .box__label {
            padding: 3px 0px 3px 15px;
            color: black;
            font-weight: bold;
            font-size:11px;
            margin: 2px 0;
            flex: 1 0 50%;
        }
        .box__field:nth-child(2n+1) { background: #efefef; }
        .rose .box__field:nth-child(2n+1) { background: rgb(255 192 203 / 15%); }
        .jaune .box__field:nth-child(2n+1) { background: rgb(255 215 0 / 8%); }
        .bleue .box__field:nth-child(2n+1) { background: rgb(122 199 255 / 15%); }
        .box__value { flex: 1 0 50%; text-align: center; }
        .box__content { background: white; color: #545454; }
        .box__content.description { padding: 10px; }

        .pre__header {
            display: grid;
            grid-template-columns: auto repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 5px 10px;
            padding: 11px 11px 7px;
            background: #f1f1f1;
            text-wrap: nowrap;
        }

        .pre__header__photo { grid-area: 1 / 1 / 3 / 2; }
        .pre__header__jira { grid-area: 1 / 2 / 2 / 3; }
        .pre__header__actions { grid-area: 1 / 3 / 2 / 4; }
        .pre__header__creation { grid-area: 2 / 2 / 3 / 3; font-size: 11px; }
        .pre__header__modification { grid-area: 2 / 3 / 3 / 4; font-size: 11px; text-align: right;}
        .pre__header__title {grid-area: 3 / 1 / 4 / 4;
            text-align: center;
            border: 2px dotted rgb(255 255 255 / 30%);
            border-radius: 1px;
            background: #7ac7ff;
            color: white;
            height: 19px;
            font-family: initial;
        }
        .pre__header__title.bleue span { padding-right: 0!important; }
        .pre__header__photo img { border-radius: 5px; }
        .pre__header__actions .ghx-controls { display: flex;justify-content: flex-end; }
        .pre__header__actions .ghx-controls .ghx-actions { height: 0; padding: 3px 8px; line-height: 0; }
        .pre__file {
             background: #f1f1f1;
             display: flex;
             padding-left: 11px;
             column-gap: 20px;
             align-items: baseline;
             font-size: 11px;
             color: #172b4d;
        }


        .jira__view__details .pre__file:nth-last-child(1 of .pre__file) {
             padding-bottom: 8px;
        }
        #ghx-detail-view .pre__file:last-child { margin-bottom: 7px; }
        .pre__file div:first-child { font-weight: bold; font-size: 12px; }
        .pre__file div:first-child span { font-size: 17px; color: white; margin-right: 4px; }

        .issue-main-column .property-list .wrap { display: flex; padding: initial; }
        .issue-main-column .property-list .item .name { width: 229px; margin-left: initial; }
        .item-details dl > dt { width: 200px; }

        @keyframes slideInPopup {
        	0% { animation-timing-function: ease-in; opacity: 0; transform: translateY(-250px); }
        	38% { animation-timing-function: ease-out; opacity: 1; transform: translateY(0);}
        	55% { animation-timing-function: ease-in; transform: translateY(-65px); }
        	72% { animation-timing-function: ease-out; transform: translateY(0); }
        	81% { animation-timing-function: ease-in; transform: translateY(-28px); }
        	90% { animation-timing-function: ease-out; transform: translateY(0); }
        	95% { animation-timing-function: ease-in; transform: translateY(-8px); }
        	100% { animation-timing-function: ease-out; transform: translateY(0); }
        }

        @keyframes slideOutPopup {
            0% { transform: translateY(0); }
        	100% { transform: translateY(-250px); }
        }

        @keyframes fadeInOpacity {
        	0% { opacity: 0; }
        	100% { opacity: 1; }
        }

        @keyframes fadeOutOpacity {
        	0% { opacity: 1; }
        	100% { opacity: 0; }
        }

        #notify_me {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            background: #424242c7;
            z-index: 9999;
        }

        #notify_me .notify_me__box {
            background: #2a2a2a;
            width: fit-content;
            border-radius: 8px;
            box-shadow: 0px 0px 16px 2px #afafaf;
            border: 2px solid #404040;
            margin: auto;
            padding: 11px;
            position: absolute;
            top: 100px;
            left: 0;
            right: 0;

        }

        #notify_me .notify_me__box__header {
            color: white;
            padding: 5px 12px;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 11px;
        }

        #notify_me .notify_me__box__content {
            padding: 5px 12px;
            font-size: 12px;
            color: #959595;
        }

        #notify_me .notify_me__box__footer {
            border-radius: 3px;
            padding: 5px 12px;
            text-align: center;
            color: white;
            text-transform: uppercase;
            font-size: 10px;
            font-weight: bold;
            margin: 9px 11px 5px;
            cursor: pointer;
        }

        #notify_me .notify_me__box__footer.error { background: #a13636; }

        .animation__fade_in {animation: fadeInOpacity 600ms cubic-bezier(.93,.19,.71,.25); }
        .animation__fade_out {animation: fadeOutOpacity 600ms cubic-bezier(.93,.19,.71,.25); }
        .animation__slide_in_popup { animation: slideInPopup 1000ms cubic-bezier(0.85, 0, 0.15, 1); 0s 1 normal both; }
        .animation__slide_out_popup { animation: slideOutPopup 600ms cubic-bezier(.93,.19,.71,.25); }
    `;

    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(css);
    document.adoptedStyleSheets = [stylesheet];
})();
