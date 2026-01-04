// ==UserScript==
// @name         WIP TICKET FOURNI
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  Script Ouverture ticket opérateur
// @author       You
// @match        https://tck.mydstny.fr/Ticket/*
// @match        https://tck.mydstny.fr/Secure/Tickets/Ticket/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license Dstny

// @downloadURL https://update.greasyfork.org/scripts/510421/WIP%20TICKET%20FOURNI.user.js
// @updateURL https://update.greasyfork.org/scripts/510421/WIP%20TICKET%20FOURNI.meta.js
// ==/UserScript==

// -FONCTIONNEL
// Jira / Jaguar / Kosc / Networth / COVAGE / LIAZO / AIF / AXIONE
// -WIP
// SFR / Sewan
// -GALERE
// Orange

(function() {
    'use strict';

    let refticket;
    let dateticket;
    let fourniticket;
    // Initialisez un tableau pour stocker les correspondances trouvées
    const matches = [];
    const currentFourniticket = [];
    const currectRefticket = [];
    let maVariable;
    let url2;
    const urls = [];


let match;
            const fournisseurs = [];
        const references = [];

    function setRefTicket(value) {
    localStorage.setItem('refticket', value);
}

    function setDateTicket(value) {
    localStorage.setItem('dateticket', value);
}

    function setFourniTicket(value) {
    localStorage.setItem('fourniticket', value);
}

function getRefTicket() {
    return localStorage.getItem('refticket');
}

    function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
        return;
    }
    setTimeout(() => {
        waitForElement(selector, callback);
    }, 500); // Attendre 500ms avant de réessayer
}

    function waitForContentElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            const content = element.textContent.trim();
            // Vérifie que le contenu n'est ni vide ni égal à "Chargement..."
            if (content && content !== "Chargement...") {
                callback(element);
                return;
            }
        }
        setTimeout(() => {
            waitForContentElement(selector, callback);
        }, 500); // Attendre 500ms avant de réessayer
    }

    function waitForContentElement2(selector, callback) {
    const poll = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(poll);
            callback(element);
        }
    }, 100); // Check every 100 ms
}

function addTicketButton(referenceElement, index, currentFourniticket) {
    const button = document.createElement('button');
    button.textContent = "Ouvrir le Ticket";

    if (currentFourniticket.includes("ORANGE") || currentFourniticket.includes("SFR") || currentFourniticket.includes("SEWAN") || currentFourniticket.includes("EIT")) {
        button.textContent = "Ouvrir le Ticket (WIP)";
    }

    button.onclick = function() {
        handleTicketAction(index);
    };
    referenceElement.parentElement.appendChild(button);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Texte copié dans le presse-papier : ' + text);
    }).catch(function(err) {
        console.error('Erreur lors de la copie dans le presse-papier : ', err);
    });
}


    const contentElementSelectorTicketRef = '#js-contentDetail > div.row > div.col-md-4.col-lg-3 > div:nth-child(2) > div.panel-body > div.panel-table > div > ul > li > p > strong';
   //                                        #js-contentDetail > div.row > div.col-md-4.col-lg-3 > div:nth-child(2) > div.panel-body > div.panel-table > div > ul > li:nth-child(1) > p > strong
                  //                         #js-contentDetail > div.row > div.col-md-4.col-lg-3 > div:nth-child(2) > div.panel-body > div.panel-table > div > ul > li:nth-child(2) > p > strong
    const contentElementSelectorTicketDate = '#js-contentDetail > div.row > div.col-md-4.col-lg-3 > div:nth-child(2) > div.panel-body > div.panel-table > div > ul > li > div > span:nth-child(1)';
    const contentElementSelectorTicketFournisseur = '#allMessages > div:nth-child(5) > div > div.col-md-10.col-md-offset-1 > div > div > div';

//#layoutContainer > div.Layout__layout1 > div > ul
    function fetchTicketUrlFromSupportSite(refticket, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://support.aif.tel/portal/fr/myarea?viewId=192475000068551957",
        onload: function(response) {
            // Attendre 5 secondes avant d'analyser le contenu
            setTimeout(function() {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const link = doc.querySelector(`a[data-id="${refticket}_ticket"]`);
                console.log(response.responseText);

                if (link) {
                    callback(link.getAttribute('href'));
                } else {
                    callback(null);
                }
            }, 5000); // Attendre 5 secondes
        }
    });
}


    // Fonction pour récupérer l'URL associée à l'élément SEW-20231023-265186
function fetchURLForTicket() {
    // URL de la page cible
    const targetURL = "https://bynow.service-now.com/mvno?id=mvno_request&liste=listeincidents";

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: targetURL,
                        onload: function(response) {
                            console.log("Requête GET effectuée sur l'URL : " + targetURL);

                            var parser = new DOMParser();
                            var doc = parser.parseFromString(response.responseText, "text/html");

                            // Recherchez la valeur du champ "Ref Liaison"
                            var refLiaisonInput = doc.querySelector('div.div.panels-container.list-group.div.table.ng-scope.ul.li:nth-child(1).div:nth-child(1).div.a');
                            var refLiaison = null;
                            console.log("refLiaisonInput : " + refLiaisonInput);

                            if (refLiaisonInput) {
                                refLiaison = refLiaisonInput.value;
                                console.log("Valeur du champ 'Ref Liaison' trouvée : " + refLiaison);

                                // Créez les éléments pour la valeur de "Ref Liaison"
                                var refLiaisonDtElement = document.createElement('dt');
                                refLiaisonDtElement.textContent = "Ref Liaison";
                                console.log("refLiaisonDtElement.textContent : " + refLiaisonDtElement.textContent);
                                var refLiaisonDdElement = document.createElement('dd');
                                refLiaisonDdElement.textContent = refLiaison;
                                console.log("refLiaisonDdElement.textContent : " + refLiaisonDdElement.textContent);
                            }
                        }
                    });
}








        // Fonction pour récupérer l'URL associée à l'élément SEW-20231023-265186
function fetchURLForTicketSEWAN() {
    // URL de la page cible
    const targetURL = "https://client-service.sewan.eu/fr-FR/support/";

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: targetURL,
                        onload: function(response) {
                            console.log("Requête GET effectuée sur l'URL : " + targetURL);

                            var parser = new DOMParser();
                            var doc = parser.parseFromString(response.responseText, "text/html");

                            // Recherchez la valeur du champ "Ref Liaison"
                            var refLiaisonInput = doc.querySelector('a');
                            var refLiaison = null;
                            console.log("refLiaisonInput : " + refLiaisonInput);

                            if (refLiaisonInput) {
                                refLiaison = refLiaisonInput.value;
                                console.log("Valeur du champ 'Ref Liaison' trouvée : " + refLiaison);

                                // Créez les éléments pour la valeur de "Ref Liaison"
                                var refLiaisonDtElement = document.createElement('dt');
                                refLiaisonDtElement.textContent = "Ref Liaison";
                                console.log("refLiaisonDtElement.textContent : " + refLiaisonDtElement.textContent);
                                var refLiaisonDdElement = document.createElement('dd');
                                refLiaisonDdElement.textContent = refLiaison;
                                console.log("refLiaisonDdElement.textContent : " + refLiaisonDdElement.textContent);
                            }
                        }
                    });
}










function SewanFetch() {
    'use strict';

    function retrieveRefLiaisonValue() {
        // Sélectionnez l'élément avec la classe "dl-flex"
        var dlElement = document.querySelector('a');
        if (!dlElement) {
            console.log("Élément details-link has-tooltip non trouvé." + dlElement);
            return;
        }
        console.log("Élément details-link has-tooltip trouvé." + dlElement);

        // Trouver tous les liens dans l'élément avec la classe "dl-flex"
        var links = dlElement.querySelectorAll('a');
         console.log("links = " + links);
        var serLink = null;

        for (var i = 0; i < links.length; i++) {
            var linkText = links[i].textContent.trim();
            // Si le texte du lien commence par "SER" suivi de chiffres
            if (/^SEW-\d+$/.test(linkText)) {
                serLink = links[i];
                break;
            }
        }

        if (!serLink) {
            console.log("Lien SER non trouvé.");
            return;
        }
        console.log("Lien SER trouvé : " + serLink.href);

        // Utilisez l'URL du lien pour récupérer l'identifiant
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://client-service.sewan.eu/fr-FR/support/',
            onload: function(response) {
                console.log("Requête GET effectuée sur l'URL : https://client-service.sewan.eu/fr-FR/support/");

                var parser = new DOMParser();
                var doc = parser.parseFromString(response.responseText, "text/html");

                // Trouvez l'élément qui contient l'identifiant
                var tdElements = doc.querySelectorAll('td');
                var identifiant = null;
                for (var i = 0; i < tdElements.length - 1; i++) {
                    if (tdElements[i].textContent.trim() === "Identifiant") {
                        identifiant = tdElements[i + 1].textContent.trim();
                        break;
                    }
                }

                if (identifiant) {
                    console.log("Identifiant trouvé : " + identifiant);

                    // Accédez à l'URL de la deuxième page avec l'identifiant
                    var secondURL = "https://pdmanager.as48504.oip/mng-edit.php?username=" + encodeURIComponent(identifiant);
                    console.log("Accès à la deuxième URL avec l'identifiant : " + secondURL);

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: secondURL,
                        onload: function(response) {
                            console.log("Requête GET effectuée sur la deuxième URL : " + secondURL);

                            var parser = new DOMParser();
                            var doc = parser.parseFromString(response.responseText, "text/html");

                            // Recherchez la valeur du champ "Ref Liaison"
                            var refLiaisonInput = doc.querySelector('input#reflien');
                            var refLiaison = null;

                            if (refLiaisonInput) {
                                refLiaison = refLiaisonInput.value;
                                console.log("Valeur du champ 'Ref Liaison' trouvée : " + refLiaison);

                                // Créez les éléments pour la valeur de "Ref Liaison"
                                var refLiaisonDtElement = document.createElement('dt');
                                refLiaisonDtElement.textContent = "Ref Liaison";

                                var refLiaisonDdElement = document.createElement('dd');
                                refLiaisonDdElement.textContent = refLiaison;

                                // Ajoutez les éléments de la valeur de "Ref Liaison" à la liste
                                dlElement.appendChild(refLiaisonDtElement);
                                dlElement.appendChild(refLiaisonDdElement);
                            }
                        }
                    });
                }
            }
        });
    }

    // Appel de la fonction principale
    retrieveRefLiaisonValue();
};


// Call the main function




// Example usage
//const distantWebsiteURL = "https://example.com"; // Replace with the actual URL
//const variableToMatch = "yourVariable"; // Replace with the variable you're searching for
//const contentElementSelector = "#mainContent > div.entitylist > div > div.view-grid.has-pagination > table > tbody > tr:nth-child(1) > td:nth-child(1) > a";
//checkAndRetrieve(distantWebsiteURL, variableToMatch);











function handleTicketAction(index) {
    // Logs pour débogage
    const currentFourniticket = fournisseurs[index]; // Récupérer l'entrée spécifique liée à l'index du bouton cliqué
    const currectRefticket = references[index]; // Récupérer la référence liée à l'index
    dateticket = localStorage.getItem('dateticket');

    console.log("Valeur de currentFourniticket:", currentFourniticket);
    console.log("Valeur de currectRefticket:", currectRefticket);
    console.log("Valeur de dateticket:", dateticket);

    let maVariable = `${currectRefticket}`;
    copyToClipboard(maVariable); // Copier la référence associée au bouton cliqué dans le presse-papier
    console.log("Référence copiée dans le presse-papier:", maVariable);

    // Variable pour stocker l'URL spécifique au bouton cliqué
    let url = "";

    // Vérifier le fournisseur et construire l'URL correspondante
    if (currentFourniticket.includes("KOSC")) {
        url = `https://extranet.kosc-telecom.fr/tickets/${currectRefticket}`;
    } else if (currentFourniticket.includes("Networth")) {
        url = `https://snaic.netw.fr/ng/#/support/detail/${currectRefticket}`;
    } else if (currentFourniticket.includes("AIF")) {
        url = `https://support.aif.tel/portal/fr/ticket/${currectRefticket}`;
    } else if (currentFourniticket.includes("ALPHALINK")) {
        url = `https://extranet.alphalink.fr/trouble_ticket/tickets?utf8=%C3%A2%C2%9C%C2%93&search_ticket_search[ticket_category_id]=&search_ticket_search[status_does_not_equal_all][]=closed&search_ticket_search[reference]=${currectRefticket}&search_ticket_search[manager_id][]=&search_ticket_search[created_by][]=&search_ticket_search[service_identifier]=&search_ticket_search[description]=&search_ticket_search[resume]=&search_ticket_search[gfrt_depass]=0&search_ticket_search[customer_id]=&search_ticket_search[is_frozen]=0&search_ticket_search[created_at_gte]=&search_ticket_search[created_at_lte]=&search_ticket_search[updated_at_gte]=&search_ticket_search[updated_at_lte]=&code_my_view=&search_form=true&per_page=15`;
    } else if (currentFourniticket.includes("Sewan")) {
        url = `https://assistance.sewan.fr/hc/fr/requests/${currectRefticket}`;
    } else if (currentFourniticket.includes("JIRA")) {
        url = `https://destinygroup.atlassian.net/browse/${currectRefticket}`;
    } else if (currentFourniticket.includes("GIS")) {
        url = `https://destinygroup.atlassian.net/servicedesk/customer/portal/72/${currectRefticket}`;
    } else if (currentFourniticket.includes("BICS")) {
        url = `https://my.bics.com/SupportCenter/support-cases`;
    } else if (currentFourniticket.includes("TELESOFT")) {
        url = `https://openip.facturationtelecom.fr/vga/vga_tic_glo.php`;
    } else if (currentFourniticket.includes("D4SP")) {
        url = `https://destinygroup.atlassian.net/browse/${currectRefticket}`;
    } else if (currentFourniticket.includes("EIT") || currentFourniticket.includes("BTBD")) {
        url = `https://bynow.service-now.com/mvno?id=mvno_request&liste=listeincidents`;
    } else if (currentFourniticket.includes("Bouygues")) {
        url = `https://prod-supportexploitation.bouyguestelecom-entreprises.fr/client/ticket/view/${currectRefticket}`;
    } else if (currentFourniticket.includes("LIAZO")) {
        url = `https://portal.ielo-liazo.com/private/tickets/?view=open&id=${currectRefticket}`;
    } else if (currentFourniticket.includes("COVAGE")) {
        url = `https://sav.covage.com/support/incidents/${currectRefticket}`;
    } else if (currentFourniticket.includes("EURAFIBRE")) {
        url = `https://helpdesk.eurafibre.fr/marketplace/formcreator/front/issue.php`;
    } else if (currentFourniticket.includes("AXIONE")) {
        url = `https://support.axione.fr/SelfService/Display.html?id=${currectRefticket}`;
    } else if (currentFourniticket.includes("ORANGE")) {
        url = `https://www.e-sav-signalisation.operateurs.orange-business.com/ipsiteTT/userDomainFormDisplay.do`;
    } else if (currentFourniticket.includes("SFR")) {
        url = `https://extranet.sfr.com/ope/ExtranetOperateur/home/ExtranetOperateurPage#`;
    } else if (currentFourniticket.includes("JAGUAR")) {
        url = `https://espaceclient-xpr.freepro.com/app/tickets/view/${currectRefticket}`;
    }

    // Ouvrir l'URL associée au bouton cliqué
    if (url) {
        console.log("Ouverture de l'URL:", url);
        window.open(url, '_blank'); // Ouvrir l'URL spécifique dans un nouvel onglet
    } else {
        console.warn("URL non trouvée pour l'index spécifié.");
    }
}



    function formatDate(dateString) {
    const currentYear = new Date().getFullYear();
    const monthNames = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    const parts = dateString.split(' ');

    const day = parts[0].padStart(2, '0');
    const monthIndex = monthNames.indexOf(parts[1]);
    const month = (monthIndex + 1).toString().padStart(2, '0'); // +1 car les indices des mois commencent à 0 (janvier = 0, février = 1, etc.)

    return `${currentYear}${month}${day}`;
}

    function processMatches(fournisseurs) {
    // Répétez l'opération pour chaque correspondance trouvée
    for (let i = 0; i < fournisseurs.length; i++) {
        const currentFourniticket = fournisseurs[i];
        console.log(fournisseurs[i]);
        const contentElementSelectorTicketRef2 = `#js-contentDetail > div.row > div.col-md-4.col-lg-3 > div:nth-child(2) > div.panel-body > div.panel-table > div > ul > li:nth-child(${i + 1}) > p > strong`;
        // Si le currentFourniticket contient "Networth", traitez la date et créez le bouton
        if (currentFourniticket.includes("Networth")) {
            // if (currentFourniticket > 8 chiffres)
            // utilisez tous et formatez si autre chose que chiffre
            // else
            // CurrentFourniticket => formatage date
            waitForContentElement(contentElementSelectorTicketDate, function(contentElement) {
                const dateticket = contentElement.textContent.trim();
                const formattedDate = formatDate(dateticket);
                console.log("Date trouvée:", formattedDate);
                setDateTicket(formattedDate);
                addTicketButton(document.querySelector(contentElementSelectorTicketRef2), i, currentFourniticket);
            });
        } else {
            if (currentFourniticket.includes("KOSC") ||
                currentFourniticket.includes("ORANGE") ||
                currentFourniticket.includes("SFR") ||
                currentFourniticket.includes("Sewan") ||
                currentFourniticket.includes("ALPHALINK") ||
                currentFourniticket.includes("AIF") ||
                currentFourniticket.includes("JAGUAR") ||
                currentFourniticket.includes("EIT") ||
                currentFourniticket.includes("BTBD") ||
                currentFourniticket.includes("LIAZO") ||
                currentFourniticket.includes("COVAGE") ||
                currentFourniticket.includes("AXIONE") ||
                currentFourniticket.includes("D4SP") ||
                currentFourniticket.includes("EURAFIBRE") ||
                currentFourniticket.includes("TELESOFT") ||
                currentFourniticket.includes("BICS") ||
                currentFourniticket.includes("Bouygues") ||
                currentFourniticket.includes("GIS") ||
                currentFourniticket.includes("JIRA")) {
                addTicketButton(document.querySelector(contentElementSelectorTicketRef2), i, currentFourniticket);
            }
        }
    }
}


    // Fonction pour traiter le contenu de `#information-content`
    function processPosts() {
        const informationContentSelector = `#information-content`;
        const informationContentElement = document.querySelector(informationContentSelector);

        if (!informationContentElement) {
            console.log("Élément #information-content non trouvé.");
            return;
        }

        // Sélectionner tous les postes dans `#information-content`
        const posts = informationContentElement.querySelectorAll('.post');
        console.log("Nombre de postes trouvés:", posts.length);

        posts.forEach((post, index) => {
            const postContent = post.textContent.trim();
            console.log(`Post ${index + 1}:`, postContent);

            // Ici, tu peux définir les conditions spécifiques pour ajouter un bouton
            if (postContent.includes("0045CCB4")) {
                console.log("Condition Networth remplie pour le post:", postContent);
                addTicketButton(post, index, postContent);
            } else if (postContent.includes("KOSC") || postContent.includes("ORANGE") || postContent.includes("SFR") ||
                postContent.includes("Sewan") || postContent.includes("AIF AIRMOB") || postContent.includes("JAGUAR") ||
                postContent.includes("EIT") || postContent.includes("LIAZO") || postContent.includes("COVAGE") ||
                postContent.includes("AXIONE") || postContent.includes("D4SP") || postContent.includes("EURAFIBRE") ||
                postContent.includes("Bouygues") || postContent.includes("GIS") || postContent.includes("JIRA")) {
                console.log("Condition fournisseur remplie pour le post:", postContent);
                addTicketButton(post, index, postContent);
            }
        });
    }


function fetchTicketDetails() {
    waitForContentElement(contentElementSelectorTicketRef, function(contentElement) {
        const regex = /Fournisseur\s*:\s*(.*?)Référence du ticket/g;
        const ticketRefRegex = /Référence du ticket\s*:\s*(.*?)Date et heure de déclaration/g;
        const fullHtml = document.documentElement.innerHTML;


        while ((match = regex.exec(fullHtml)) !== null) {
            let foundFournisseur = match[1].trim().replace(/<br>/g, '').trim();
            fournisseurs.push(foundFournisseur);
        }
        while ((match = ticketRefRegex.exec(fullHtml)) !== null) {
            let foundReference = match[1].trim().replace(/<br>|\.|\s/g, '').trim();
            if (foundReference.includes("https://destinygroupatlassiannet/browse/")) {
                foundReference = foundReference.replace("https://destinygroupatlassiannet/browse/", "");
        } else if (foundReference.includes("#")) {
                foundReference = foundReference.replace("#", "");
        }
            references.push(foundReference);
            fetchURLForTicket();
        }

        // Affichez les fournisseurs et les références dans la console pour déboguer
        console.log("Fournisseurs trouvés :", fournisseurs);
        console.log("Références trouvées :", references);

        // Maintenant que les fournisseurs et les références sont correctement extraits, appelez la fonction processMatches
        processMatches(fournisseurs, references);
         processPosts();

    });
}


// Appeler fetchTicketDetails sans callback
fetchTicketDetails();

})();