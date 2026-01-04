// ==UserScript==
// @name         BEFACS extractor
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Extraction des déclarations depuis BEFACS avec onglets Actifs, Archives et Paramètres. La createdDate est transformée pour être lisible (dd-MM-yyyy HH:mm). Les champs numéro CO et MRN sont supprimés. Le select box affiche uniquement le nom et la valeur renvoyée reste le numéro. Une checkbox dans Paramètres active le mode déboguage qui affiche l'URL de requête. Le CSV est encodé en UTF-8 pour préserver les accents.
// @author       Minou
// @license      Proprietary – All rights reserved. Unauthorized reuse is prohibited.
// @match        https://befacs.finbel.intra/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529680/BEFACS%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/529680/BEFACS%20extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Décalage du contenu de la page pour ne pas cacher le panneau
    document.body.style.marginLeft = "300px";

    /**********************
     * Création du panneau
     **********************/
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.left = '0';
    panel.style.top = '0';
    panel.style.width = '300px';
    panel.style.height = '100%';
    panel.style.backgroundColor = '#f7f7f7';
    panel.style.borderRight = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.overflowY = 'auto';
    panel.style.zIndex = '9999';
    document.body.appendChild(panel);

    const title = document.createElement('h3');
    title.textContent = "Recherche / Export";
    panel.appendChild(title);

    /**********************************************
     * Création des onglets : Actifs, Archives, Paramètres
     **********************************************/
    const tabContainer = document.createElement('div');
    tabContainer.style.display = 'flex';
    tabContainer.style.justifyContent = 'space-around';
    tabContainer.style.marginBottom = '10px';
    panel.appendChild(tabContainer);

    const tabActifs = document.createElement('button');
    tabActifs.textContent = "🛃 Actifs";
    const tabArchives = document.createElement('button');
    tabArchives.textContent = "📦 Archives";
    const tabParams = document.createElement('button');
    tabParams.textContent = "🔨 Paramètres";
    [tabActifs, tabArchives, tabParams].forEach(btn => {
        btn.style.flex = "1";
        tabContainer.appendChild(btn);
    });

    /***************************************
     * Création des sections pour chaque onglet
     ***************************************/
    const sectionActifs = document.createElement('div');
    const sectionArchives = document.createElement('div');
    const sectionParams = document.createElement('div');

    // Affichage par défaut : Actifs visible
    sectionActifs.style.display = "block";
    sectionArchives.style.display = "none";
    sectionParams.style.display = "none";

    panel.appendChild(sectionActifs);
    panel.appendChild(sectionArchives);
    panel.appendChild(sectionParams);

    /**********************************************
     * Fonctions utilitaires pour créer des champs
     **********************************************/
    function createInputField(labelText, inputProps) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';
        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        const input = document.createElement('input');
        Object.assign(input, inputProps);
        input.style.width = "100%";
        container.appendChild(label);
        container.appendChild(input);
        return { container, input };
    }

    function createSelectField(labelText, optionsArr) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';
        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        const select = document.createElement('select');
        select.style.width = "100%";
        // Option par défaut
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Sélectionner --";
        select.appendChild(defaultOption);
        optionsArr.forEach(optData => {
            const opt = document.createElement('option');
            opt.value = optData.value;
            // Afficher uniquement le texte
            opt.textContent = optData.label;
            select.appendChild(opt);
        });
        container.appendChild(label);
        container.appendChild(select);
        return { container, select };
    }

    function createRadioGroup(labelText, optionsArr, groupName) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';
        const title = document.createElement('p');
        title.textContent = labelText;
        container.appendChild(title);
        optionsArr.forEach(optData => {
            const label = document.createElement('label');
            label.style.marginRight = '5px';
            const radio = document.createElement('input');
            radio.type = "radio";
            radio.name = groupName;
            radio.value = optData.value;
            if(optData.default) radio.checked = true;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + optData.label));
            container.appendChild(label);
        });
        return container;
    }

    /**********************************************
     * Construction du formulaire dans la section Actifs
     **********************************************/
    // Les champs numéro CO et numéro MRN sont supprimés

    // Liste des entrepôts : texte uniquement, valeur reste le numéro
    const entrepots = [
        { label: "Cacesa", value: "29005" },
        { label: "Cacesa chez WFS", value: "21005" },
        { label: "Cainiao (3 decl)", value: "000047" },
        { label: "CargoTec chez B&B", value: "51001" },
        { label: "ECDC 3", value: "6003" },
        { label: "EDT", value: "37002" },
        { label: "F4U chez BeCargo", value: "19001" },
        { label: "F4U chez ECDC", value: "6002" },
        { label: "Flying", value: "000054" },
        { label: "FMCS", value: "000052" },
        { label: "FTL chez Challenge", value: "13001" },
        { label: "HSH", value: "000048" },
        { label: "LCA", value: "3004" },
        { label: "LGG", value: "000009" },
        { label: "NVCargo", value: "25001" },
        { label: "Tongda", value: "45002" },
        { label: "ViaEurope", value: "20001" },
        { label: "ViaEurope chez SCS", value: "7003" },
        { label: "Yun chez WFS", value: "21005" },
        { label: "YunExpress", value: "000007" }
    ];
    const { container: lieuContainer, select: lieuSelect } = createSelectField("Code lieu :", entrepots);
    sectionActifs.appendChild(lieuContainer);

    const poolOptionsActifs = [
        { label: "Aérien", value: "aerien" },
        { label: "Hors-délai", value: "delai" },
        { label: "Fedex", value: "fedex" },
        { label: "Tout", value: "", default: true }
    ];
    const poolGroupActifs = createRadioGroup("Pool :", poolOptionsActifs, "pool");
    sectionActifs.appendChild(poolGroupActifs);

    const statutOptionsActifs = [
        { label: "Nouveau", value: "NEW" },
        { label: "En attente", value: "ON_HOLD" },
        { label: "Soumis", value: "SUBMITTED" },
        { label: "Cancel request", value: "CANCEL_REQUEST" },
        { label: "New no PN", value: "NEW_NO_PN" },
        { label: "Tout", value: "", default: true }
    ];
    const statutGroupActifs = createRadioGroup("Statut :", statutOptionsActifs, "status");
    sectionActifs.appendChild(statutGroupActifs);

    // Deux boutons d'export dans l'onglet Actifs :
    const exportBtnMission = document.createElement('button');
    exportBtnMission.textContent = "Exporter pour la mission";
    exportBtnMission.style.width = "100%";
    exportBtnMission.style.marginBottom = "5px";
    sectionActifs.appendChild(exportBtnMission);

    const exportBtnTotalite = document.createElement('button');
    exportBtnTotalite.textContent = "Exporter la totalité";
    exportBtnTotalite.style.width = "100%";
    sectionActifs.appendChild(exportBtnTotalite);

    // Zone de debug (texte URL) cachée par défaut et activée en mode déboguage
    const queryDisplay = document.createElement('textarea');
    queryDisplay.style.width = "100%";
    queryDisplay.style.height = "80px";
    queryDisplay.readOnly = true;
    queryDisplay.style.marginTop = "10px";
    queryDisplay.style.display = "none"; // cachée par défaut
    sectionActifs.appendChild(queryDisplay);

    /**********************************************
     * Construction du formulaire dans la section Archives
     **********************************************/
    const sectionArchivesClone = sectionActifs.cloneNode(true);
    sectionArchivesClone.querySelector("textarea").value = "";
    sectionArchives.appendChild(sectionArchivesClone);

    /**********************************************
     * Construction du formulaire dans la section Paramètres
     **********************************************/
    const sizeField = createInputField("Nombre maximal d'extractions (size) :", {
        type: "number",
        value: "500",
        min: "1"
    });
    sectionParams.appendChild(sizeField.container);

    // Checkbox de déboguage dans Paramètres
    const debugContainer = document.createElement('div');
    debugContainer.style.marginBottom = '8px';
    const debugLabel = document.createElement('label');
    debugLabel.textContent = "Mode déboguage : ";
    const debugCheckbox = document.createElement('input');
    debugCheckbox.type = "checkbox";
    debugCheckbox.checked = false; // désactivé par défaut
    debugContainer.appendChild(debugLabel);
    debugContainer.appendChild(debugCheckbox);
    sectionParams.appendChild(debugContainer);

    // Cadre d'information sur le script
    const infoContainer = document.createElement('div');
    infoContainer.style.border = "1px solid #ccc";
    infoContainer.style.padding = "10px";
    infoContainer.style.marginTop = "10px";
    infoContainer.innerHTML = "<strong>BEFACS extractor</strong><br>Version : 1.8<br>Auteur(s) : Minou";
    sectionParams.appendChild(infoContainer);

    /**********************************************
     * Navigation entre onglets
     **********************************************/
    function hideAllSections() {
        sectionActifs.style.display = "none";
        sectionArchives.style.display = "none";
        sectionParams.style.display = "none";
    }
    tabActifs.addEventListener('click', () => { hideAllSections(); sectionActifs.style.display = "block"; });
    tabArchives.addEventListener('click', () => { hideAllSections(); sectionArchives.style.display = "block"; });
    tabParams.addEventListener('click', () => { hideAllSections(); sectionParams.style.display = "block"; });

    /**********************************************
     * Mise à jour de l'URL de requête pour déboguage
     **********************************************/
    function updateQueryDisplay(endpoint) {
        // Les champs numéro CO et numéro MRN sont supprimés (envoyés vides)
        const coNumber = "";
        const mrn = "";
        const locationCode = lieuSelect.value.trim();
        let status;
        document.querySelectorAll('input[name="status"]').forEach(radio => {
            if(radio.checked) status = radio.value;
        });
        let pool;
        document.querySelectorAll('input[name="pool"]').forEach(radio => {
            if(radio.checked) pool = radio.value;
        });
        const sizeValue = sizeField.input.value.trim() || "500";
        const apiUrl = `https://befacs.finbel.intra/api/control-orders/${endpoint}?` +
            `coNumber=${encodeURIComponent(coNumber)}&declarationType=&highestColor=&mrn=${encodeURIComponent(mrn)}` +
            `&spsFiche=&arrivalTranspMeans=&travelDoc=&transportEquipment=&locationCode=${encodeURIComponent(locationCode)}` +
            `&status=${encodeURIComponent(status)}&createdDate=&pool=${encodeURIComponent(pool)}` +
            `&assignedTo=&page=0&size=${encodeURIComponent(sizeValue)}`;
        queryDisplay.value = apiUrl;
        return apiUrl;
    }

    /**********************************************
     * Fonctions de formatage de date pour le nom de fichier (uniquement)
     **********************************************/
    function zeroPad(n) {
        return n < 10 ? "0" + n : "" + n;
    }
    function fixISO(isoString) {
        return isoString.replace(/(\.\d{3})\d*Z$/, '$1Z');
    }
    function formatDateShort(isoString) {
        if (!isoString) return "";
        const fixedIso = fixISO(isoString);
        const d = new Date(fixedIso);
        if (isNaN(d.getTime())) return "";
        const day = zeroPad(d.getUTCDate());
        const month = zeroPad(d.getUTCMonth() + 1);
        const year = d.getUTCFullYear();
        const hours = zeroPad(d.getUTCHours());
        const minutes = zeroPad(d.getUTCMinutes());
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
    function formatDateOnly(isoString) {
        if (!isoString) return "";
        const fixedIso = fixISO(isoString);
        const d = new Date(fixedIso);
        if (isNaN(d.getTime())) return "";
        const day = zeroPad(d.getUTCDate());
        const month = zeroPad(d.getUTCMonth() + 1);
        const year = d.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }
    function getCurrentDate(withTime) {
        const d = new Date();
        if (withTime) {
            return formatDateShort(d.toISOString());
        } else {
            return formatDateOnly(d.toISOString());
        }
    }

    /**********************************************
     * Fonction utilitaire : délai (sleep)
     **********************************************/
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**********************************************
     * Fonction d'échappement CSV
     **********************************************/
    function escapeCSV(value) {
        if (value === null || value === undefined) value = "";
        value = String(value);
        value = value.replace(/"/g, '""');
        return `"${value}"`;
    }

    /**********************************************
     * Fonction d'exportation
     * mode: "mission" ou "totalite"
     * endpoint: "all" (ou "archived")
     **********************************************/
    async function exportData(endpoint, mode) {
        const baseUrl = updateQueryDisplay(endpoint);
        try {
            const response = await fetch(baseUrl);
            const data = await response.json();

            alert(`Nombre de déclarations reçues : ${data.numberOfElements}`);

            const csvRows = [];
            let headers = [];
            if (mode === "mission") {
                headers = [
                    "CO",
                    "MRN",
                    "Date Décla",
                    "AWB",
                    "Nom importateur",
                    "Adresse",
                    "CP",
                    "Ville",
                    "Pays",
                    "Art",
                    "Description art princ",
                    "HSCode",
                    "UCR",
                    "Valeur",
                    "Résultats",
                    "ASM",
                    "Contenu contrôlé"
                ];
            } else if (mode === "totalite") {
                headers = [
                    "CO",
                    "MRN",
                    "Date Décla",
                    "AWB",
                    "Nom importateur",
                    "Adresse",
                    "CP",
                    "Ville",
                    "Pays",
                    "Description art princ",
                    "HSCode",
                    "UCR",
                    "Valeur",
                    "Résultats",
                    "ASM",
                    "Contenu contrôlé"
                ];
            }
            csvRows.push(headers.map(escapeCSV).join(";"));

            // Traitement séquentiel de chaque CO avec délai de 0,5 sec entre chaque requête
            for (const co of data.content) {
                const declUrl = `https://befacs.finbel.intra/api/declaration/h7/${encodeURIComponent(co.coNumber)}`;
                try {
                    const respDecl = await fetch(declUrl);
                    const declData = await respDecl.json();

                    const coNumberVal = co.coNumber || "";
                    const mrnVal = (declData.declaration && declData.declaration.mrn) || "";
                    // Transformation de createdDate pour l'affichage lisible
                    const createdDateVal = co.createdDate ? formatDateShort(co.createdDate) : "";
                    const travelDocVal = co.travelDoc || "";
                    const importerName = declData.declaration && declData.declaration.importer ? (declData.declaration.importer.name || "") : "";
                    const importerStreet = declData.declaration && declData.declaration.importer && declData.declaration.importer.address ? (declData.declaration.importer.address.streetAndNumber || "") : "";
                    const importerPostCode = declData.declaration && declData.declaration.importer && declData.declaration.importer.address ? (declData.declaration.importer.address.postCode || "") : "";
                    const importerCity = declData.declaration && declData.declaration.importer && declData.declaration.importer.address ? (declData.declaration.importer.address.city || "") : "";
                    const importerCountry = declData.declaration && declData.declaration.importer && declData.declaration.importer.address ? (declData.declaration.importer.address.country || "") : "";
                    
                    const goodsItems = (declData.goodsShipment && declData.goodsShipment.goodsShipmentItem) ? declData.goodsShipment.goodsShipmentItem : [];
                    const nbGoodsItems = goodsItems.length;
                    
                    if (mode === "mission") {
                        const descriptionOfGoods = (nbGoodsItems > 0 && goodsItems[0].commodity) ? (goodsItems[0].commodity.descriptionOfGoods || "") : "";
                        const commodityCode = (nbGoodsItems > 0 && goodsItems[0].commodity) ? (goodsItems[0].commodity.commodityCode || "") : "";
                        const ucrVal = (nbGoodsItems > 0) ? (goodsItems[0].ucr || "") : "";
                        // Récupérer "amount" depuis goodsItems[0].commodity.intrinsicValue
                        const intrinsicValue = (nbGoodsItems > 0 && goodsItems[0].commodity && goodsItems[0].commodity.intrinsicValue) ? (goodsItems[0].commodity.intrinsicValue.amount || "") : "";
                        const rowValues = [
                            coNumberVal,          // CO (non échappé)
                            mrnVal,
                            createdDateVal,
                            travelDocVal,
                            importerName,
                            importerStreet,
                            importerPostCode,
                            importerCity,
                            importerCountry,
                            nbGoodsItems,         // Art : nombre d'articles
                            descriptionOfGoods,
                            commodityCode,
                            ucrVal,
                            intrinsicValue,
                            "",                   // Résultats
                            "",                   // ASM
                            ""                    // Contenu contrôlé
                        ];
                        const rowCO = coNumberVal;
                        const rowRest = rowValues.slice(1).map(escapeCSV).join(";");
                        csvRows.push(rowCO + ";" + rowRest);
                    } else if (mode === "totalite") {
                        if (nbGoodsItems > 0) {
                            for (const item of goodsItems) {
                                const descriptionOfGoods = (item.commodity) ? (item.commodity.descriptionOfGoods || "") : "";
                                const commodityCode = (item.commodity) ? (item.commodity.commodityCode || "") : "";
                                const ucrVal = item.ucr || "";
                                // Récupérer "amount" depuis item.commodity.intrinsicValue
                                const intrinsicValue = (item.commodity && item.commodity.intrinsicValue) ? (item.commodity.intrinsicValue.amount || "") : "";
                                const rowValues = [
                                    coNumberVal,          // CO (non échappé)
                                    mrnVal,
                                    createdDateVal,
                                    travelDocVal,
                                    importerName,
                                    importerStreet,
                                    importerPostCode,
                                    importerCity,
                                    importerCountry,
                                    descriptionOfGoods,
                                    commodityCode,
                                    ucrVal,
                                    intrinsicValue,
                                    "",                   // Résultats
                                    "",                   // ASM
                                    ""                    // Contenu contrôlé
                                ];
                                const rowCO = coNumberVal;
                                const rowRest = rowValues.slice(1).map(escapeCSV).join(";");
                                csvRows.push(rowCO + ";" + rowRest);
                            }
                        } else {
                            const rowValues = [
                                coNumberVal,
                                mrnVal,
                                createdDateVal,
                                travelDocVal,
                                importerName,
                                importerStreet,
                                importerPostCode,
                                importerCity,
                                importerCountry,
                                "", "", "", "", "", "", ""
                            ];
                            const rowCO = coNumberVal;
                            const rowRest = rowValues.slice(1).map(escapeCSV).join(";");
                            csvRows.push(rowCO + ";" + rowRest);
                        }
                    }
                } catch (err) {
                    console.error(`Erreur pour le CO ${co.coNumber}:`, err);
                }
                await sleep(500);
            }

            const csvContent = csvRows.join("\n");
            // Préfixer avec BOM UTF-8 pour préserver les accents
            const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
            const csvUrl = URL.createObjectURL(blob);

            const selectedOption = lieuSelect.options[lieuSelect.selectedIndex]?.text || "Aucun";
            let fileName = "";
            if (mode === "mission") {
                const missionNumber = prompt("Veuillez saisir le numéro de mission :");
                fileName = `${missionNumber || "MISSION"}_${getCurrentDate(false)}_${selectedOption}.csv`;
            } else if (mode === "totalite") {
                fileName = `EXPORT_${getCurrentDate(true)}_${selectedOption}.csv`;
            }

            const a = document.createElement('a');
            a.href = csvUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(csvUrl);
        } catch (err) {
            console.error("Erreur lors de l'exportation :", err);
            alert("Erreur lors de l'exportation. Consultez la console pour plus de détails.");
        }
    }

    /**********************************************
     * Gestion des clics sur les boutons Export dans Actifs et Archives
     **********************************************/
    exportBtnMission.addEventListener('click', () => {
        exportData("all", "mission");
    });
    exportBtnTotalite.addEventListener('click', () => {
        exportData("all", "totalite");
    });
    sectionArchives.querySelector("button").addEventListener('click', () => {
        exportData("archived", "mission");
    });

    // Mise à jour de l'URL de requête lors des changements (pour Actifs)
    [lieuSelect].forEach(el => el.addEventListener('input', () => updateQueryDisplay("all")));
    // Mise à jour pour Archives (pour les champs clonés)
    const archivesInputs = sectionArchives.querySelectorAll("input, select");
    archivesInputs.forEach(el => el.addEventListener('input', () => updateQueryDisplay("archived")));

    updateQueryDisplay("all");

    // Gestion du mode déboguage : afficher ou cacher le textarea queryDisplay selon la checkbox
    debugCheckbox.addEventListener('change', () => {
        const debugEnabled = debugCheckbox.checked;
        queryDisplay.style.display = debugEnabled ? "block" : "none";
    });

})();
