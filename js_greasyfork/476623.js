// ==UserScript==
// @name         Outils script support
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Plusieurs outils d'automatisations pour le support
// @author       Tony Gargaud, Florian Villeret, Clément Bahuaud
// @match        https://tck.mydstny.fr/Ticket/*
// @match        https://tck.mydstny.fr/Secure/Tickets/Ticket/Detail?ticketId=*
// @match        https://tck.mydstny.fr/Secure/Tickets/Dashboard
// @match        https://tck.mydstny.fr/Tickets
// @match        https://tck.mydstny.fr/Tickets?refresh
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.6.3/jquery-ui-timepicker-addon.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476623/Outils%20script%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/476623/Outils%20script%20support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
        'use strict';

        const currentURL = window.location.href;
        //-------------PARTIE DU SCRIPT DANS LES TICKETS---------------
        if (currentURL.startsWith("https://tck.mydstny.fr/Ticket/") || currentURL.startsWith("https://tck.mydstny.fr/Secure/Tickets/Ticket/Detail?ticketId=")) {


            function getFreezeEnding(duration) {
                let now = new Date();

                switch (duration) {
                    case '4h':
                        now.setHours(now.getHours() + 4);
                        break;
                    case '1j':
                        do {
                            now.setDate(now.getDate() + 1);
                        } while (!(now.getDay() % 6))
                            now.setHours(15);
                        now.setMinutes(30);
                        break;
                }

                return `${now.getDate().toString().padStart(2, '0')}%2F${(now.getMonth() + 1).toString().padStart(2, '0')}%2F${now.getFullYear()}+${now.getHours().toString().padStart(2, '0')}%3A${now.getMinutes().toString().padStart(2, '0')}`;
            }

            // Fonction pour fermer le ticket
            var ticketfourni = false;
            function closeTicket() {
                console.log(ticketfourni)
                const ticketProviders = document.querySelectorAll('.ticket-provider');
                for (const provider of ticketProviders) {
                    const spans = provider.querySelectorAll('span');
                    for (const span of spans) {
                        if (span.textContent.trim() === 'En cours...') {
                            ticketfourni = true;

                        }
                    }
                }
                switch (ticketfourni){
                    case true:
                        alert('Erreur ! Tous vos tickets fournisseurs doivent être clôturés avant de procéder à la clôture du ticket.');
                        break;
                    case false:
                        var ticketId = window.location.pathname.split('/').pop();
                        var userConfirmation = window.confirm("Voulez-vous ajouter un message de clôture personnalisé?");
                        var closingComment = "";

                        if (userConfirmation) {
                            closingComment = window.prompt("Entrez votre message de clôture:");
                        }

                        GM_xmlhttpRequest({
                            method: "POST",
                            url: `https://tck.mydstny.fr/Ticket/${ticketId}`,
                            headers: {
                                "User-Agent": "Mozilla/5.0",
                                "Content-Type": "application/x-www-form-urlencoded",
                                "X-Requested-With": "XMLHttpRequest"
                            },
                            data: `closingType=DEFAULT&closingResolution=YES&closingResponsibleEntity=OPENIP&closingDate=&closingComment=${encodeURIComponent(closingComment)}&closingTechnicalScore=&closingReactivityScore=&closingInvolvementScore=&ticketAction=closing`,
                            onload: function(response) {
                                if (response.status === 200) {
                                    location.reload();
                                } else {
                                    alert("Erreur lors de la tentative de fermeture du ticket.");
                                }
                            }
                        });
                        break;
                }
            }

            function freezeTicket(duration) {
                const ticketId = window.location.pathname.split('/').pop();

                GM_xmlhttpRequest({
                    method: "POST",
                    url: `https://tck.mydstny.fr/Ticket/${ticketId}`,
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    data: `freezeEnding=${getFreezeEnding(duration)}&freezeComment=gel&ticketAction=freeze`,
                    onload: function(response) {
                        if (response.status === 200) {
                            location.reload();
                        } else {
                            alert("Erreur lors de la tentative de gel du ticket.");
                        }
                    }
                });
            }

            // Création des boutons pour le gel

            function createFreezeButton(duration) {
                const freezeButton = document.createElement('button');
                freezeButton.type = "button";
                freezeButton.className = "btn btn-icon btn-sm";
                freezeButton.title = `Geler pour ${duration}`;
                freezeButton.textContent = `❄️ ${duration}`;

                freezeButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    freezeTicket(duration);
                });

                const listItemForFreeze = document.createElement('li');
                listItemForFreeze.setAttribute("role", "presentation");
                listItemForFreeze.appendChild(freezeButton);

                return listItemForFreeze;
            }

            // Ajout des boutons au DOM
            const freezeButton4h = createFreezeButton('4h');
            const freezeButton1j = createFreezeButton('1j');

            const navControl = document.querySelector('.nav-control-btn');

            if (navControl) {
                navControl.insertBefore(freezeButton1j, navControl.firstChild);
                navControl.insertBefore(freezeButton4h, navControl.firstChild);
            }

            // Créer le bouton de verrouillage dans sa propre balise <li>
            const lockButton = document.createElement('button');
            lockButton.type = "button";
            lockButton.className = "btn btn-icon btn-sm";
            lockButton.title = `Fermer le ticket`;
            lockButton.textContent = "🔒 Clôture";

            lockButton.addEventListener('click', function(e) {
                e.preventDefault();
                closeTicket();
            });

            const listItemForLock = document.createElement('li');
            listItemForLock.setAttribute("role", "presentation");
            listItemForLock.appendChild(lockButton);

            function addRelanceText() {
                if (typeof CKEDITOR !== "undefined" && CKEDITOR.instances) {
                    for (let editor in CKEDITOR.instances) {
                        if (CKEDITOR.instances.hasOwnProperty(editor)) {
                            CKEDITOR.instances[editor].setData("<p>Suite à notre précédent post, avez-vous un retour à nous fournir ?</p><p>Dans l'attente d'une réponse de votre part, nous restons à votre disposition pour toute nouvelle demande.</p>");
                        }
                    }
                }
                const publicRadioInput = document.querySelector('input[id="rd_addPostVisibility_2"]');
                if (publicRadioInput) {
                    publicRadioInput.checked = true;
                    publicRadioInput.dispatchEvent(new Event('change')); // ou new Event('click')
                } else {
                    alert("L'élément d'input pour le label 'Public' n'a pas été trouvé.");
                }
            }


            // Fonction pour simuler un clic sur le bouton "Nouveau message"
            function clickNewMessageButton() {
                const newMessageButton = document.querySelector('button.btn.btn-gradient[data-toggle="modal"][data-target="#addPostModal"]');
                if (newMessageButton) {
                    newMessageButton.click();
                } else {
                    alert("Le bouton 'Nouveau message' n'a pas été trouvé.");
                }
            }

            // Créer le bouton de relance dans sa propre balise <li>
            const relanceButton = document.createElement('button');
            relanceButton.type = "button";
            relanceButton.className = "btn btn-icon btn-sm";
            relanceButton.title = `Relance`;
            relanceButton.innerHTML = 'Relance';

            relanceButton.addEventListener('click', function(e) {
                e.preventDefault();
                clickNewMessageButton();
                setTimeout(addRelanceText, 500); // Ajouter un délai pour s'assurer que la modal est bien ouverte
            });

            const listItemForRelance = document.createElement('li');
            listItemForRelance.setAttribute("role", "presentation");
            listItemForRelance.appendChild(relanceButton);



            if (navControl) {
                navControl.insertBefore(listItemForRelance, navControl.firstChild);
            }

            if (navControl) {
                navControl.insertBefore(listItemForLock, navControl.firstChild);
            }




        }
        //-------------PARTIE DU SCRIPT SUR LA LISTE DES TICKETS---------------


    })();
})();
