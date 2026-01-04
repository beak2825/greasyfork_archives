// ==UserScript==
// @name         Chronos - Assistant de création d'affaires
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Masque des champs inutiles, ajoute une aide à la saisie du nom d'affaire, personnalise les options et offre un guide de conversion d'heures
// @author       Vous
// @match        https://chronos.chronos-ga.com/espace_commerce/base_contacts/affaire*detail.asp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531033/Chronos%20-%20Assistant%20de%20cr%C3%A9ation%20d%27affaires.user.js
// @updateURL https://update.greasyfork.org/scripts/531033/Chronos%20-%20Assistant%20de%20cr%C3%A9ation%20d%27affaires.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // PARTIE COMMERCIAUX :

    // Liste des ID à ordonner en premier
    const ordreCommerciauxPrioritaires = [
        '2477',  // LANDAES, Olivier
        '2475',  // DEJONGHE, Cyril
        '2474',  // THIBAUT, Gabriel
        '2483',  // RENARD, Valentin
        '2471',  // HARMAND, Rémi
        '2480',  // RICHIR, Vincent
    ];

    function reorganiserListeCommerciauxSiNecessaire() {
        const selectCommercial = document.getElementById('id_commercial');

        if (!selectCommercial) {
            // Réessayer plus tard si l'élément n'est pas encore chargé
            setTimeout(reorganiserListeCommerciauxSiNecessaire, 500);
            return;
        }

        // Convertir les options en tableau
        const options = Array.from(selectCommercial.options);

        // Séparer les options prioritaires et le reste
        const optionsPrioritaires = ordreCommerciauxPrioritaires.map(id =>
            options.find(option => option.value === id)
        ).filter(option => option !== undefined);

        const autresOptions = options.filter(option =>
            !ordreCommerciauxPrioritaires.includes(option.value)
        );

        // Réorganiser les options
        selectCommercial.innerHTML = '';

        // Ajouter d'abord l'option vide par défaut
        const optionVide = options.find(option => option.value === '');
        if (optionVide) {
            selectCommercial.appendChild(optionVide);
        }

        // Ajouter les options prioritaires
        optionsPrioritaires.forEach(option => {
            selectCommercial.appendChild(option);
        });

        // Ajouter les autres options
        autresOptions.forEach(option => {
            selectCommercial.appendChild(option);
        });

        // MODIFICATION: Ne pas présélectionner de commercial
        // Laisser le champ vide par défaut
        if (optionVide) {
            selectCommercial.value = '';
        }
    }

    // ======================================
    // PARTIE 0: OVERLAY BLUR COMMUN
    // ======================================

    // Fonction pour créer un overlay avec effet de flou
    function createBlurOverlay() {
        // Vérifier si un overlay existe déjà
        if (document.getElementById('blur-overlay')) {
            return document.getElementById('blur-overlay');
        }

        // Créer l'élément overlay
        const overlay = document.createElement('div');
        overlay.id = 'blur-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent noir */
            backdrop-filter: blur(5px); /* Effet de flou */
            -webkit-backdrop-filter: blur(5px); /* Pour Safari */
            z-index: 9999; /* Juste en dessous des popups */
            display: none; /* Caché par défaut */
        `;

        document.body.appendChild(overlay);

        // Ajouter le gestionnaire de clic directement à l'overlay
        overlay.addEventListener('click', function(event) {
            // S'assurer que le clic est sur l'overlay lui-même et non un élément enfant
            if (event.target === this) {
                // Récupérer l'ID de la popup associée
                const popupId = this.dataset.associatedPopup;

                // Fermer l'overlay
                this.style.display = 'none';

                // Fermer la popup associée si elle existe
                if (popupId) {
                    const popup = document.getElementById(popupId);
                    if (popup) {
                        document.body.removeChild(popup);
                    }
                }
            }
        });

        return overlay;
    }

    // Fonction pour afficher l'overlay et y associer un élément popup
    function showOverlay(popupElement) {
        const overlay = createBlurOverlay();

        // Enregistrer la référence à l'élément popup
        overlay.dataset.associatedPopup = popupElement.id;

        // Afficher l'overlay
        overlay.style.display = 'block';
    }

    // Fonction pour masquer l'overlay
    function hideOverlay() {
        const overlay = document.getElementById('blur-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.dataset.associatedPopup = '';
            overlay.onclick = null;
        }
    }

    // ======================================
    // PARTIE 1: MASQUER LES CHAMPS INUTILES
    // ======================================

    // Fonction pour masquer un élément directement
    function hideElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.style.display = 'none';
                console.log(`Élément masqué: ${selector}`);
            }
        });
    }

    // Fonction pour masquer un champ en fonction de son libellé (label)
    function hideFieldByLabel(labelText) {
        const labels = Array.from(document.querySelectorAll('label'));
        labels.forEach(label => {
            if (label.textContent.includes(labelText)) {
                const blocChamp = label.closest('.bloc_champ');
                if (blocChamp) {
                    blocChamp.style.display = 'none';
                    console.log(`Champ masqué par label: "${labelText}"`);
                }
            }
        });
    }

    // Fonction pour masquer un champ en fonction de son ID
    function hideFieldById(id) {
        const element = document.getElementById(id);
        if (element) {
            const blocChamp = element.closest('.bloc_champ');
            if (blocChamp) {
                blocChamp.style.display = 'none';
                console.log(`Champ masqué par ID: "${id}"`);
            }
        }
    }

    // Fonction principale pour masquer les champs
    function hideFields() {
        console.log("Début du masquage des champs...");

        // Masquer les champs spécifiques par label
        hideFieldByLabel('Code');
        hideFieldByLabel('Reporting');
        hideFieldByLabel('Av-p.offre');
        hideFieldByLabel('TJM');
        hideFieldByLabel('CJM');

        // Masquer également par ID (au cas où la méthode par label ne fonctionne pas)
        hideFieldById('code_affaire');
        hideFieldById('id_affaire_groupe_reporting');
        hideFieldById('libelle_avant_vente');
        hideFieldById('prix_valorisation');
        hideFieldById('cjm');

        console.log("Masquage des champs terminé");
    }

    // ======================================
    // PARTIE 2: FENÊTRE DE CHAT POUR LE NOM D'AFFAIRE
    // ======================================

    // Créer la fenêtre de chat
    function createChatWindow() {
        // Vérifier si la fenêtre existe déjà
        if (document.getElementById('affaire-chat-popup')) {
            return;
        }

        // Créer l'overlay flou
        showOverlay({id: 'affaire-chat-popup'});

        // Créer la fenêtre de chat
        const chatWindow = document.createElement('div');
        chatWindow.id = 'affaire-chat-popup';
        chatWindow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            padding: 20px;
            z-index: 10000;
            width: 400px;
            font-family: Arial, sans-serif;
        `;

        // Contenu de la fenêtre
        chatWindow.innerHTML = `
            <h3 style="margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                Assistant de nommage d'affaire
            </h3>

            <div style="margin-bottom: 15px;">
                <label for="details-input" style="display: block; margin-bottom: 5px; font-weight: bold;">DÉTAILS:</label>
                <input type="text" id="details-input" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <small style="color: #666; display: block; margin-top: 3px;">Lettres, chiffres, # et accents uniquement</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="prestations-select" style="display: block; margin-bottom: 5px; font-weight: bold;">PRESTATIONS:</label>
                <select id="prestations-select" style="width: 100%; padding: 8px; background-color: white; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                    <option value="">-- Sélectionnez --</option>
                    <option value="Webmarketing">Webmarketing</option>
                    <option value="Developpement">Developpement</option>
                    <option value="Design">Design</option>
                    <option value="Hebergement Spécifique">Hebergement Spécifique</option>
                    <option value="TMA">TMA</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="initial-input" style="display: block; margin-bottom: 5px; font-weight: bold;">INITIAL DU SITE (max 5 car.):</label>
                <input type="text" id="initial-input" maxlength="5" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; text-transform: uppercase;">
                <small style="color: #666; display: block; margin-top: 3px;">Automatiquement converti en majuscules</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">APERÇU:</label>
                <div id="preview-text" style="padding: 8px; background-color: #f5f5f5; border-radius: 4px; min-height: 20px; font-family: monospace;"></div>
            </div>

            <div style="text-align: right;">
                <button id="delete-button" style="padding: 8px 15px; margin-right: 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Supprimer</button>
                <button id="cancel-button" style="padding: 8px 15px; margin-right: 10px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Annuler</button>
                <button id="validate-button" style="padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Valider</button>
            </div>
        `;

        // Ajouter la fenêtre au document
        document.body.appendChild(chatWindow);

        // Pré-remplir les champs avec la valeur actuelle s'il y en a une
        const currentValue = document.getElementById('nom_affaire').value.trim();
        if (currentValue) {
            // Tenter de décomposer la valeur actuelle en parties
            const parts = currentValue.split(' - ');
            if (parts.length >= 1) document.getElementById('details-input').value = parts[0];
            if (parts.length >= 2) {
                // Vérifier si le second élément correspond à une prestation connue
                const prestationSelect = document.getElementById('prestations-select');
                const prestation = parts[1];
                let found = false;

                for (let i = 0; i < prestationSelect.options.length; i++) {
                    if (prestationSelect.options[i].value === prestation) {
                        prestationSelect.selectedIndex = i;
                        found = true;
                        break;
                    }
                }

                // Si aucune prestation correspondante n'est trouvée, ajouter aux détails
                if (!found && parts.length === 2) {
                    document.getElementById('details-input').value += ' - ' + parts[1];
                }
            }
            if (parts.length >= 3 && parts[2] !== "Mensualisé") {
                document.getElementById('initial-input').value = parts[2];
            }
        }

        // MODIFICATION: Configurer le champ DÉTAILS pour accepter lettres, chiffres, accents et #
        const detailsInput = document.getElementById('details-input');
        detailsInput.addEventListener('input', function(e) {
            // Supprimer tous les caractères spéciaux sauf les lettres, chiffres, espaces, accents et #
            // Regex qui accepte les lettres (incluant accents), chiffres, espaces et #
            const sanitizedValue = this.value.replace(/[^a-zA-ZÀ-ÿ0-9 #]/g, '');

            // Si la valeur a été modifiée, mettre à jour le champ
            if (this.value !== sanitizedValue) {
                this.value = sanitizedValue;
            }

            updatePreview();
        });

        // Configurer le champ INITIAL pour forcer les majuscules
        const initialInput = document.getElementById('initial-input');
        initialInput.addEventListener('input', function(e) {
            // Convertir en majuscules
            const upperValue = this.value.toUpperCase();

            // Si la valeur a été modifiée, mettre à jour le champ
            if (this.value !== upperValue) {
                this.value = upperValue;
            }

            updatePreview();
        });

        // Ajouter les autres écouteurs d'événements
        document.getElementById('prestations-select').addEventListener('change', updatePreview);

        document.getElementById('cancel-button').addEventListener('click', function() {
            document.body.removeChild(chatWindow);
            hideOverlay();
        });

        // Nouveau bouton Supprimer
        document.getElementById('delete-button').addEventListener('click', function() {
            // Vider le champ nom_affaire
            document.getElementById('nom_affaire').value = '';
            document.body.removeChild(chatWindow);
            hideOverlay();
        });

        document.getElementById('validate-button').addEventListener('click', function() {
            // Vérifier si tous les champs obligatoires sont remplis
            const details = document.getElementById('details-input').value.trim();
            const prestation = document.getElementById('prestations-select').value.trim();
            const initial = document.getElementById('initial-input').value.trim();

            // Vérifier que tous les champs sont remplis
            if (!details) {
                alert('Veuillez remplir le champ DÉTAILS');
                return;
            }

            if (!prestation) {
                alert('Veuillez sélectionner une PRESTATION');
                return;
            }

            if (!initial) {
                alert('Veuillez saisir les INITIALES du site');
                return;
            }

            const formattedText = document.getElementById('preview-text').textContent;

            // Si l'option Forfait et périodique sont sélectionnés, ajouter "- Mensualisé"
            const typeSelect = document.getElementById('id_type');
            const modeFacturationSelect = document.getElementById('mode_facturation');

            let finalText = formattedText;

            if (typeSelect && modeFacturationSelect &&
                typeSelect.value === "2" &&
                modeFacturationSelect.value === "2") {
                if (!finalText.includes("- Mensualisé")) {
                    finalText += " - Mensualisé";
                }
            }

            document.getElementById('nom_affaire').value = finalText;
            document.body.removeChild(chatWindow);
            hideOverlay();
        });

        // Empêcher la propagation des clics dans la fenêtre
        chatWindow.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // Mettre à jour l'aperçu initial
        updatePreview();
    }

    // Mettre à jour l'aperçu
    function updatePreview() {
        const details = document.getElementById('details-input').value.trim();
        const prestation = document.getElementById('prestations-select').value.trim();
        const initial = document.getElementById('initial-input').value.trim();

        let formattedText = '';

        if (details) {
            formattedText += details;
        }

        if (prestation) {
            if (formattedText) {
                formattedText += ' - ' + prestation;
            } else {
                formattedText += prestation;
            }
        }

        if (initial) {
            if (formattedText) {
                formattedText += ' - ' + initial;
            } else {
                formattedText += initial;
            }
        }

        document.getElementById('preview-text').textContent = formattedText;
    }

    // ======================================
    // PARTIE 3: MODIFICATION DES CHAMPS TYPE ET FACTURATION
    // ======================================

    // Fonction pour modifier l'option "Forfait" en "Forfait (ponctuel ou périodique)"
    function updateTypeOptions() {
        const typeSelect = document.getElementById('id_type');
        if (typeSelect) {
            // Trouver l'option "Forfait"
            const forfaitOption = Array.from(typeSelect.options).find(option => option.value === "2" && option.textContent.trim() === "Forfait");

            if (forfaitOption) {
                // Modifier le texte de l'option
                forfaitOption.textContent = "Forfait (ponctuel ou périodique)";
                console.log("Option 'Forfait' renommée en 'Forfait (ponctuel ou périodique)'");
            }

            // Ajouter un écouteur pour gérer le changement de type
            typeSelect.addEventListener('change', handleTypeChange);
        }
    }

    // Fonction pour supprimer "- Mensualisé" du libellé
    function removeMensualiseFromLabel() {
        const nomAffaire = document.getElementById('nom_affaire');
        if (nomAffaire && nomAffaire.value.includes(" - Mensualisé")) {
            nomAffaire.value = nomAffaire.value.replace(" - Mensualisé", "");
            console.log("Mention '- Mensualisé' supprimée du libellé");
        }
    }

    // Vérifier si les conditions sont remplies pour ajouter ou supprimer "- Mensualisé"
    function checkForMensualisé() {
        const typeSelect = document.getElementById('id_type');
        const facturable = document.getElementById('facturable');
        const modeFacturation = document.getElementById('mode_facturation');
        const nomAffaire = document.getElementById('nom_affaire');

        if (typeSelect && facturable && modeFacturation && nomAffaire) {
            const isTypeCorrect = typeSelect.value === "2"; // Forfait
            const isFacturableCorrect = facturable.value === "1"; // Oui
            const isModeCorrect = modeFacturation.value === "2"; // Périodique

            if (isTypeCorrect && isFacturableCorrect && isModeCorrect) {
                // Vérifier si "- Mensualisé" n'est pas déjà présent
                if (nomAffaire.value.trim() && !nomAffaire.value.includes("- Mensualisé")) {
                    nomAffaire.value += " - Mensualisé";
                    console.log("Ajout de la mention '- Mensualisé' au libellé");
                }
            } else {
                // Si les conditions ne sont pas réunies, supprimer "- Mensualisé"
                removeMensualiseFromLabel();
            }
        }
    }

    // Fonction pour gérer le changement du champ Type
    function handleTypeChange() {
        const typeSelect = document.getElementById('id_type');
        const facturable = document.getElementById('facturable');
        const modeFacturation = document.getElementById('mode_facturation');

        // Si "Forfait (ponctuel ou périodique)" est sélectionné
        if (typeSelect && typeSelect.value === "2") {
            console.log("Forfait sélectionné, mise à jour des options associées");

            // Forcer "Facturable" à "oui"
            if (facturable && facturable.value !== "1") {
                facturable.value = "1";
                // Déclencher l'événement change pour activer les handlers
                facturable.dispatchEvent(new Event('change'));
            }

            // Forcer "Mode facturation" à "periodique"
            if (modeFacturation && modeFacturation.value !== "2") {
                modeFacturation.value = "2";
                // Déclencher l'événement change pour activer les handlers
                modeFacturation.dispatchEvent(new Event('change'));
            }

            // Vérifier si on doit ajouter "- Mensualisé"
            checkForMensualisé();
        } else {
            // Si le type n'est pas "Forfait", supprimer "- Mensualisé"
            removeMensualiseFromLabel();
        }
    }

    // Fonction pour gérer le changement du champ Facturable
    function handleFacturableChange() {
        // Vérifier si on doit ajouter ou supprimer "- Mensualisé"
        checkForMensualisé();
    }

    // Fonction pour gérer le changement du champ Mode facturation
    function handleModeFacturationChange() {
        // Vérifier si on doit ajouter ou supprimer "- Mensualisé"
        checkForMensualisé();
    }

    // ======================================
    // PARTIE 4: GUIDE DE CONVERSION D'HEURES
    // ======================================

    // Créer une popup avec le tableau de conversion d'heures
    function showHoursConversionPopup() {
        // Vérifier si la popup existe déjà
        if (document.getElementById('hours-conversion-popup')) {
            return;
        }

        // Créer l'overlay flou
        showOverlay({id: 'hours-conversion-popup'});

        // Créer la popup
        const popup = document.createElement('div');
        popup.id = 'hours-conversion-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            padding: 20px;
            z-index: 10000;
            min-width: 250px;
            font-family: Arial, sans-serif;
        `;

        // Contenu de la popup
        popup.innerHTML = `
            <h3 style="margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; text-align: center">
                Conversion jours → heures
            </h3>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Décimale</th>
                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Heures</th>
                </tr>
                <tr>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">0,15</td>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">1h</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">0,30</td>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">2h</td>
                </tr>
                <tr>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">0,45</td>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">3h</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">0,60</td>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">4h</td>
                </tr>
                <tr>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">0,75</td>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">5h</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">0,90</td>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">6h</td>
                </tr>
                <tr>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">1</td>
                    <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">7h</td>
                </tr>
            </table>
        `;

        // Ajouter la popup au document
        document.body.appendChild(popup);

        // Empêcher la propagation des clics dans la fenêtre
        popup.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // Ajouter l'écouteur d'événement pour le bouton Fermer
        document.getElementById('close-conversion-button').addEventListener('click', function() {
            document.body.removeChild(popup);
            hideOverlay();
        });
    }

    // Ajouter un bouton de conversion d'heures
    function addHoursConversionButton() {
        // Rechercher la section budget où placer le bouton
        const blocBudget = document.getElementById('bloc_budget');

        if (blocBudget) {
            // Créer un nouveau div pour contenir le bouton (semblable aux autres champs)
            const newBlocChamp = document.createElement('div');
            newBlocChamp.className = 'bloc_champ champ_info';

            // Créer une structure similaire aux autres champs du budget
            newBlocChamp.innerHTML = `
                <label>
                    Conversion
                </label>
                <div>
                    <div style="width: 100%; text-align: left;">
                        <button id="hours-conversion-button" type="button" style="
                            padding: 5px 10px;
                            background-color: #de2a45;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            margin-left: 0;
                        ">Guide d'heures</button>
                    </div>
                </div>
            `;

            // Ajouter le bloc à la fin de la section budget
            blocBudget.appendChild(newBlocChamp);

            // Ajouter l'écouteur d'événement au bouton
            document.getElementById('hours-conversion-button').addEventListener('click', showHoursConversionPopup);

            console.log("Bouton de conversion ajouté à la section budget");
            return;
        }

        // Fallback si la section budget n'est pas trouvée
        // Trouver un bon emplacement pour le bouton (par exemple, près du menu ou de la barre d'outils)
        const navMenu = document.querySelector('nav') || document.querySelector('.menu') || document.querySelector('header');

        if (!navMenu) {
            // Si aucun élément de navigation n'est trouvé, ajouter le bouton au début du document
            const button = createConversionButton();
            document.body.insertBefore(button, document.body.firstChild);
            return;
        }

        // Créer le bouton
        const button = createConversionButton();

        // Ajouter le bouton à la fin de l'élément de navigation
        navMenu.appendChild(button);
    }

    // Créer le bouton de conversion (méthode de secours)
    function createConversionButton() {
        const button = document.createElement('button');
        button.id = 'hours-conversion-button';
        button.textContent = 'Guide de conversion heures';
        button.style.cssText = `
            margin: 10px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        // Ajouter l'écouteur d'événement
        button.addEventListener('click', showHoursConversionPopup);

        return button;
    }

    // Fonction d'initialisation du script
    function initScript() {
        console.log("Initialisation du script Chronos...");

        // Masquer les champs inutiles
        hideFields();

        // Créer l'overlay blur dès le départ (il est caché par défaut)
        createBlurOverlay();

        // Modifier les options du champ Type
        updateTypeOptions();

        // Ajouter les écouteurs d'événements pour les champs qui déclenchent l'ajout ou la suppression de "- Mensualisé"
        addEventListeners();

        // Vérifier et mettre à jour les options si "Forfait" est déjà sélectionné
        handleTypeChange();

        // Ajouter l'écouteur d'événement pour le champ nom_affaire
        handleNomAffaireField();

        // Exécuter la réorganisation des commerciaux si nécessaire
        reorganiserListeCommerciauxSiNecessaire();

        // Vérifier que le DOM est complètement chargé avant d'ajouter le bouton
        // Attendre plus longtemps car le bloc budget pourrait être chargé de façon asynchrone
        console.log("Planification de l'ajout du bouton de conversion d'heures...");
        setTimeout(function() {
            console.log("Tentative d'ajout du bouton de conversion...");
            addHoursConversionButton();
        }, 2000);

        console.log("Script Chronos initialisé avec succès!");
    }

    // Ajouter les écouteurs d'événements pour 'facturable' et 'mode_facturation'
    function addEventListeners() {
        const facturable = document.getElementById('facturable');
        if (facturable) {
            facturable.addEventListener('change', handleFacturableChange);
        }

        const modeFacturation = document.getElementById('mode_facturation');
        if (modeFacturation) {
            modeFacturation.addEventListener('change', handleModeFacturationChange);
        }
    }

    // Gérer le champ 'nom_affaire' et ajouter un icône
    function handleNomAffaireField() {
        const nomAffaireField = document.getElementById('nom_affaire');
        if (nomAffaireField) {
            nomAffaireField.addEventListener('click', createChatWindow);

            // Ajouter un indice visuel que le champ a une action spéciale
            nomAffaireField.style.cursor = 'pointer';
            nomAffaireField.title = 'Cliquez pour ouvrir l\'assistant de nommage';

            // Ajouter un petit icône à côté du champ
            const parentDiv = nomAffaireField.parentElement;
            if (parentDiv) {
                const helperIcon = document.createElement('i');
                helperIcon.className = 'fa fa-magic';
                helperIcon.style.cssText = 'margin-left: 5px; color: #4CAF50; cursor: pointer;';
                helperIcon.title = 'Assistant de nommage';
                helperIcon.addEventListener('click', createChatWindow);
                parentDiv.appendChild(helperIcon);
            }
        }
    }

    // Exécuter l'initialisation au chargement de la page
    function executeInitOnPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initScript, 1000);
            });
        } else {
            setTimeout(initScript, 1000);
        }
    }

    // Tentative d'ajout manuel du bouton si tout le reste échoue
    window.addEventListener('load', function() {
        setTimeout(function() {
            console.log("Vérification de la présence du bouton de conversion d'heures");

            // Vérifier si le bouton existe déjà
            if (!document.getElementById('hours-conversion-button')) {
                console.log("Le bouton n'a pas été trouvé, tentative d'ajout direct au bloc budget");

                // Rechercher le bloc budget et y ajouter le bouton en priorité
                const blocBudget = document.getElementById('bloc_budget');
                if (blocBudget) {
                    console.log("Bloc budget trouvé, ajout du bouton");

                    // Créer un nouveau div pour contenir le bouton
                    const newBlocChamp = document.createElement('div');
                    newBlocChamp.className = 'bloc_champ champ_info';

                    // Créer une structure similaire aux autres champs du budget
                    newBlocChamp.innerHTML = `

                        <div>
                            <div style="width: 100%; text-align: left;">
                                <button id="hours-conversion-button" type="button" style="
                                    padding: 5px 10px;
                                    background-color: #de2a45;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 14px;
                                    margin-left: 20px;
                                    width : 100% ;
                                    height : 25px ;
                                ">Conversion jours → heures</button>
                            </div>
                        </div>
                    `;

                    // Ajouter le bloc à la fin de la section budget
                    blocBudget.appendChild(newBlocChamp);

                    // Ajouter l'écouteur d'événement au bouton
                    const addedButton = document.getElementById('hours-conversion-button');
                    if (addedButton) {
                        addedButton.addEventListener('click', showHoursConversionPopup);
                        console.log("Écouteur d'événement ajouté au bouton");
                    }
                } else {
                    // Si le bloc budget n'est pas trouvé, ajouter le bouton en position fixe
                    console.log("Bloc budget non trouvé, ajout du bouton en position fixe");
                    const button = createConversionButton();
                    // Positionner le bouton de manière fixe en haut à droite
                    button.style.position = 'fixed';
                    button.style.top = '10px';
                    button.style.right = '10px';
                    button.style.zIndex = '9999';
                    document.body.appendChild(button);
                }
            } else {
                console.log("Le bouton existe déjà");
            }
        }, 2000);
    });

    // Lancer l'initialisation au début du chargement
    executeInitOnPageLoad();

})();