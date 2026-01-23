// ==UserScript==
// @name         WME RTC Plus
// @namespace    http://tampermonkey.net/
// @version      2026.01.12
// @description  RTC Management mit Kreisen, Perimeter-Sperrungen, GPX Import/Export
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @author       Hiwi234
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/471989/WME%20RTC%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/471989/WME%20RTC%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let uOpenLayers;
    let uWaze;
    let radiusLayer, infoLayer;
    let polygonControl, freehandControl, dragControl;
    let eventListeners = [];
    let modificationHistory = [];
    let presetCircleMode = false;
    let presetCircleCenter = null;
    const DEBUG = true;
    const EARTH_RADIUS = 6371000;

    // Translations
    const translations = {
        en: {
            tabTitle: 'RTC +',
            title: 'WME RTC Plus',
            enableCircle: 'Enable Circle Drawing',
            enableFreehand: 'Enable Free Hand Drawing',
            selectStreets: 'Select / Start',
            undoLastCircle: 'Undo',
            clearCircles: 'Clear Circles',
            displayOptions: 'Display Options:',
            showRadius: 'Show Radius',
            showDiameter: 'Show Diameter',
            showArea: 'Show Area',
            imperialUnits: 'Imperial Units (ft/mi)',
            filterOptions: 'Filter Options:',
            onlyDrivable: 'Only drivable segments',
            perimeterBlocking: 'Perimeter Blocking:',
            blockInbound: 'Block perimeter inbound only',
            blockInboundHint: '(hollow circle - exit allowed)',
            rtcSettings: 'RTC Settings:',
            rtcReason: 'Closure reason:',
            rtcDuration: 'Duration:',
            rtcHours: 'hrs',
            rtcMinutes: 'min',
            rtcDefaultReason: 'Perimeter closure',
            rtcModeDuration: 'Duration',
            rtcModeEndDate: 'End date',
            rtcEndDate: 'End',
            deleteRtcsInArea: 'Delete RTCs in area',
            deletingRtcs: 'Deleting RTCs...',
            rtcsDeleted: '✓ {0} RTCs deleted',
            noRtcsFound: 'No RTCs found in area',
            currentRadius: 'Current Radius',
            circlesCleared: 'Circles cleared',
            noCirclesToUndo: 'No circles to undo',
            removedCircle: 'Removed last circle',
            remaining: 'remaining',
            errorRemoving: 'Error removing circle',
            selectedSegments: 'Selected {0} segments',
            noSegmentsFound: 'No segments found in circles',
            appliedRestrictions: '✓ Applied RTC to {0} segments (inbound blocked)',
            noModification: '⚠ No segments needed modification ({0} processed)',
            presetCircle: 'Preset Circle:',
            presetRadius: 'Radius:',
            presetHint: 'Create Circle',
            clickForCenter: 'Click for center',
            circleCreated: 'Circle created ({0}m)',
            moveCircles: 'Move circles',
            moveHint: 'Drag circles to move them',
            createMapComment: 'Create Map Comment',
            mapCommentOptions: 'Map Comment Options:',
            commentTitle: 'Title:',
            commentDesc: 'Description:',
            expiresIn: 'Expires in:',
            days: 'days',
            createFromCircle: 'Create from last circle',
            noCircleToConvert: 'No circle to convert',
            mapCommentCreated: 'Map Comment created!',
            selectCircleFirst: 'Draw a circle first',
            brushMode: 'Segment Brush',
            brushModeHint: 'Paint to select segments',
            brushErase: 'Erase mode',
            brushModeActive: 'Segment brush active',
            exportRtcs: 'Export RTCs',
            importRtcs: 'Import RTCs',
            exportedRtcs: '✓ {0} RTCs exported',
            importedRtcs: '✓ {0} RTCs imported',
            noRtcsToExport: 'No RTCs to export',
            importExport: 'Import/Export:',
            exportTypeRtcs: 'RTCs',
            exportTypeCircles: 'Circles',
            exportedCircles: '✓ {0} circles exported',
            importedCircles: '✓ {0} circles imported',
            noCirclesToExport: 'No circles to export',
            exportTypeGpx: 'GPX',
            importedGpx: '✓ GPX imported: {0} segments matched',
            exportedGpx: '✓ GPX exported',
            gpxNoSegments: 'No segments matched from GPX'
        },
        de: {
            tabTitle: 'RTC +',
            title: 'WME RTC Plus',
            enableCircle: 'Kreis zeichnen aktivieren',
            enableFreehand: 'Freihand zeichnen aktivieren',
            selectStreets: 'Auswahl / Start',
            undoLastCircle: 'Zurück',
            clearCircles: 'Kreise löschen',
            displayOptions: 'Anzeigeoptionen:',
            showRadius: 'Radius anzeigen',
            showDiameter: 'Durchmesser anzeigen',
            showArea: 'Fläche anzeigen',
            imperialUnits: 'Imperiale Einheiten (ft/mi)',
            filterOptions: 'Filteroptionen:',
            onlyDrivable: 'Nur befahrbare Segmente',
            perimeterBlocking: 'Perimeter-Sperrung:',
            blockInbound: 'Nur eingehenden Verkehr sperren',
            blockInboundHint: '(hohler Kreis - Ausfahrt erlaubt)',
            rtcSettings: 'RTC Einstellungen:',
            rtcReason: 'Sperrgrund:',
            rtcDuration: 'Sperrdauer:',
            rtcHours: 'Std',
            rtcMinutes: 'Min',
            rtcDefaultReason: 'Perimeter-Sperrung',
            rtcModeDuration: 'Dauer',
            rtcModeEndDate: 'Enddatum',
            rtcEndDate: 'Ende',
            deleteRtcsInArea: 'RTCs im Bereich löschen',
            deletingRtcs: 'Lösche RTCs...',
            rtcsDeleted: '✓ {0} RTCs gelöscht',
            noRtcsFound: 'Keine RTCs im Bereich gefunden',
            currentRadius: 'Aktueller Radius',
            circlesCleared: 'Kreise gelöscht',
            noCirclesToUndo: 'Keine Kreise zum Rückgängigmachen',
            removedCircle: 'Letzten Kreis entfernt',
            remaining: 'übrig',
            errorRemoving: 'Fehler beim Entfernen',
            selectedSegments: '{0} Segmente ausgewählt',
            noSegmentsFound: 'Keine Segmente in Kreisen gefunden',
            appliedRestrictions: '✓ RTC auf {0} Segmente angewendet (Einfahrt gesperrt)',
            noModification: '⚠ Keine Segmente mussten geändert werden ({0} verarbeitet)',
            presetCircle: 'Vorbereiteter Kreis:',
            presetRadius: 'Radius:',
            presetHint: 'Kreis Erstellen',
            clickForCenter: 'Klicke für Mittelpunkt',
            circleCreated: 'Kreis erstellt ({0}m)',
            moveCircles: 'Kreise verschieben',
            moveHint: 'Kreise ziehen zum Verschieben',
            createMapComment: 'Map Comment erstellen',
            mapCommentOptions: 'Map Comment Optionen:',
            commentTitle: 'Titel:',
            commentDesc: 'Beschreibung:',
            expiresIn: 'Läuft ab in:',
            days: 'Tagen',
            createFromCircle: 'Aus letztem Kreis erstellen',
            noCircleToConvert: 'Kein Kreis vorhanden',
            mapCommentCreated: 'Map Comment erstellt!',
            selectCircleFirst: 'Erst einen Kreis zeichnen',
            brushMode: 'Segment-Pinsel',
            brushModeHint: 'Malen um Segmente auszuwählen',
            brushErase: 'Löschen-Modus',
            brushModeActive: 'Segment-Pinsel aktiv',
            exportRtcs: 'RTCs exportieren',
            importRtcs: 'RTCs importieren',
            exportedRtcs: '✓ {0} RTCs exportiert',
            importedRtcs: '✓ {0} RTCs importiert',
            noRtcsToExport: 'Keine RTCs zum Exportieren',
            importExport: 'Import/Export:',
            exportTypeRtcs: 'RTCs',
            exportTypeCircles: 'Kreise',
            exportedCircles: '✓ {0} Kreise exportiert',
            importedCircles: '✓ {0} Kreise importiert',
            noCirclesToExport: 'Keine Kreise zum Exportieren',
            exportTypeGpx: 'GPX',
            importedGpx: '✓ GPX importiert: {0} Segmente gematcht',
            exportedGpx: '✓ GPX exportiert',
            gpxNoSegments: 'Keine Segmente aus GPX gematcht'
        },
        fr: {
            tabTitle: 'RTC +',
            title: 'WME RTC Plus',
            enableCircle: 'Activer le dessin de cercle',
            enableFreehand: 'Activer le dessin à main levée',
            selectStreets: 'Sélection / Démarrer',
            undoLastCircle: 'Annuler',
            clearCircles: 'Effacer les cercles',
            displayOptions: "Options d'affichage:",
            showRadius: 'Afficher le rayon',
            showDiameter: 'Afficher le diamètre',
            showArea: 'Afficher la surface',
            imperialUnits: 'Unités impériales (ft/mi)',
            filterOptions: 'Options de filtre:',
            onlyDrivable: 'Segments praticables uniquement',
            perimeterBlocking: 'Blocage du périmètre:',
            blockInbound: 'Bloquer uniquement le trafic entrant',
            blockInboundHint: '(cercle creux - sortie autorisée)',
            currentRadius: 'Rayon actuel',
            circlesCleared: 'Cercles effacés',
            noCirclesToUndo: 'Aucun cercle à annuler',
            removedCircle: 'Dernier cercle supprimé',
            remaining: 'restant(s)',
            errorRemoving: 'Erreur lors de la suppression',
            selectedSegments: '{0} segments sélectionnés',
            noSegmentsFound: 'Aucun segment trouvé dans les cercles',
            appliedRestrictions: '✓ Restrictions de direction appliquées à {0} segments (sortie préservée)',
            noModification: '⚠ Aucun segment à modifier ({0} traités)',
            presetCircle: 'Cercle prédéfini:',
            presetRadius: 'Rayon:',
            presetHint: 'Créer Cercle',
            clickForCenter: 'Cliquez pour centre',
            circleCreated: 'Cercle créé ({0}m)',
            moveCircles: 'Déplacer les cercles',
            moveHint: 'Glisser pour déplacer',
            createMapComment: 'Créer Map Comment',
            mapCommentOptions: 'Options Map Comment:',
            commentTitle: 'Titre:',
            commentDesc: 'Description:',
            expiresIn: 'Expire dans:',
            days: 'jours',
            createFromCircle: 'Créer depuis dernier cercle',
            noCircleToConvert: 'Aucun cercle disponible',
            mapCommentCreated: 'Map Comment créé!',
            selectCircleFirst: 'Dessinez un cercle d\'abord',
            brushMode: 'Pinceau segments',
            brushModeHint: 'Peindre pour sélectionner',
            brushErase: 'Mode effacer',
            brushModeActive: 'Pinceau segments actif',
            exportRtcs: 'Exporter RTCs',
            importRtcs: 'Importer RTCs',
            exportedRtcs: '✓ {0} RTCs exportés',
            importedRtcs: '✓ {0} RTCs importés',
            noRtcsToExport: 'Aucun RTC à exporter',
            importExport: 'Import/Export:',
            exportTypeRtcs: 'RTCs',
            exportTypeCircles: 'Cercles',
            exportedCircles: '✓ {0} cercles exportés',
            importedCircles: '✓ {0} cercles importés',
            noCirclesToExport: 'Aucun cercle à exporter',
            exportTypeGpx: 'GPX',
            importedGpx: '✓ GPX importé: {0} segments matchés',
            exportedGpx: '✓ GPX exporté',
            gpxNoSegments: 'Aucun segment matché depuis GPX'
        },
        it: {
            tabTitle: 'RTC +',
            title: 'WME RTC Plus',
            enableCircle: 'Attiva disegno cerchio',
            enableFreehand: 'Attiva disegno a mano libera',
            selectStreets: 'Selezione / Avvia',
            undoLastCircle: 'Annulla',
            clearCircles: 'Cancella cerchi',
            displayOptions: 'Opzioni di visualizzazione:',
            showRadius: 'Mostra raggio',
            showDiameter: 'Mostra diametro',
            showArea: 'Mostra area',
            imperialUnits: 'Unità imperiali (ft/mi)',
            filterOptions: 'Opzioni filtro:',
            onlyDrivable: 'Solo segmenti percorribili',
            perimeterBlocking: 'Blocco perimetrale:',
            blockInbound: 'Blocca solo traffico in entrata',
            blockInboundHint: '(cerchio vuoto - uscita consentita)',
            currentRadius: 'Raggio attuale',
            circlesCleared: 'Cerchi cancellati',
            noCirclesToUndo: 'Nessun cerchio da annullare',
            removedCircle: 'Ultimo cerchio rimosso',
            remaining: 'rimanenti',
            errorRemoving: 'Errore nella rimozione',
            selectedSegments: '{0} segmenti selezionati',
            noSegmentsFound: 'Nessun segmento trovato nei cerchi',
            appliedRestrictions: '✓ Restrizioni di direzione applicate a {0} segmenti (uscita preservata)',
            noModification: '⚠ Nessun segmento da modificare ({0} elaborati)',
            presetCircle: 'Cerchio predefinito:',
            presetRadius: 'Raggio:',
            presetHint: 'Crea Cerchio',
            clickForCenter: 'Clicca per centro',
            circleCreated: 'Cerchio creato ({0}m)',
            moveCircles: 'Sposta i cerchi',
            moveHint: 'Trascina per spostare',
            createMapComment: 'Crea Map Comment',
            mapCommentOptions: 'Opzioni Map Comment:',
            commentTitle: 'Titolo:',
            commentDesc: 'Descrizione:',
            expiresIn: 'Scade tra:',
            days: 'giorni',
            createFromCircle: 'Crea dall\'ultimo cerchio',
            noCircleToConvert: 'Nessun cerchio disponibile',
            mapCommentCreated: 'Map Comment creato!',
            selectCircleFirst: 'Prima disegna un cerchio',
            brushMode: 'Pennello segmenti',
            brushModeHint: 'Dipingi per selezionare',
            brushErase: 'Modalità cancella',
            brushModeActive: 'Pennello segmenti attivo',
            exportRtcs: 'Esporta RTCs',
            importRtcs: 'Importa RTCs',
            exportedRtcs: '✓ {0} RTCs esportati',
            importedRtcs: '✓ {0} RTCs importati',
            noRtcsToExport: 'Nessun RTC da esportare',
            importExport: 'Import/Export:',
            exportTypeRtcs: 'RTCs',
            exportTypeCircles: 'Cerchi',
            exportedCircles: '✓ {0} cerchi esportati',
            importedCircles: '✓ {0} cerchi importati',
            noCirclesToExport: 'Nessun cerchio da esportare',
            exportTypeGpx: 'GPX',
            importedGpx: '✓ GPX importato: {0} segmenti matchati',
            exportedGpx: '✓ GPX esportato',
            gpxNoSegments: 'Nessun segmento matchato da GPX'
        },
        es: {
            tabTitle: 'RTC +',
            title: 'WME RTC Plus',
            enableCircle: 'Activar dibujo de círculo',
            enableFreehand: 'Activar dibujo a mano alzada',
            selectStreets: 'Selección / Iniciar',
            undoLastCircle: 'Deshacer',
            clearCircles: 'Borrar círculos',
            displayOptions: 'Opciones de visualización:',
            showRadius: 'Mostrar radio',
            showDiameter: 'Mostrar diámetro',
            showArea: 'Mostrar área',
            imperialUnits: 'Unidades imperiales (ft/mi)',
            filterOptions: 'Opciones de filtro:',
            onlyDrivable: 'Solo segmentos transitables',
            perimeterBlocking: 'Bloqueo de perímetro:',
            blockInbound: 'Bloquear solo tráfico entrante',
            blockInboundHint: '(círculo hueco - salida permitida)',
            currentRadius: 'Radio actual',
            circlesCleared: 'Círculos borrados',
            noCirclesToUndo: 'No hay círculos para deshacer',
            removedCircle: 'Último círculo eliminado',
            remaining: 'restantes',
            errorRemoving: 'Error al eliminar',
            selectedSegments: '{0} segmentos seleccionados',
            noSegmentsFound: 'No se encontraron segmentos en los círculos',
            appliedRestrictions: '✓ Restricciones de dirección aplicadas a {0} segmentos (salida preservada)',
            noModification: '⚠ Ningún segmento necesitó modificación ({0} procesados)',
            presetCircle: 'Círculo predefinido:',
            presetRadius: 'Radio:',
            presetHint: 'Crear Círculo',
            clickForCenter: 'Clic para centro',
            circleCreated: 'Círculo creado ({0}m)',
            moveCircles: 'Mover los círculos',
            moveHint: 'Arrastra para mover',
            createMapComment: 'Crear Map Comment',
            mapCommentOptions: 'Opciones Map Comment:',
            commentTitle: 'Título:',
            commentDesc: 'Descripción:',
            expiresIn: 'Expira en:',
            days: 'días',
            createFromCircle: 'Crear desde último círculo',
            noCircleToConvert: 'No hay círculo disponible',
            mapCommentCreated: '¡Map Comment creado!',
            selectCircleFirst: 'Primero dibuja un círculo',
            brushMode: 'Pincel segmentos',
            brushModeHint: 'Pintar para seleccionar',
            brushErase: 'Modo borrar',
            brushModeActive: 'Pincel segmentos activo',
            exportRtcs: 'Exportar RTCs',
            importRtcs: 'Importar RTCs',
            exportedRtcs: '✓ {0} RTCs exportados',
            importedRtcs: '✓ {0} RTCs importados',
            noRtcsToExport: 'No hay RTCs para exportar',
            importExport: 'Import/Export:',
            exportTypeRtcs: 'RTCs',
            exportTypeCircles: 'Círculos',
            exportedCircles: '✓ {0} círculos exportados',
            importedCircles: '✓ {0} círculos importados',
            noCirclesToExport: 'No hay círculos para exportar',
            exportTypeGpx: 'GPX',
            importedGpx: '✓ GPX importado: {0} segmentos matcheados',
            exportedGpx: '✓ GPX exportado',
            gpxNoSegments: 'Ningún segmento matcheado desde GPX'
        },
        nl: {
            tabTitle: 'RTC +',
            title: 'WME RTC Plus',
            enableCircle: 'Cirkel tekenen inschakelen',
            enableFreehand: 'Vrije hand tekenen inschakelen',
            selectStreets: 'Selectie / Start',
            undoLastCircle: 'Ongedaan',
            clearCircles: 'Cirkels wissen',
            displayOptions: 'Weergaveopties:',
            showRadius: 'Straal tonen',
            showDiameter: 'Diameter tonen',
            showArea: 'Oppervlakte tonen',
            imperialUnits: 'Imperiale eenheden (ft/mi)',
            filterOptions: 'Filteropties:',
            onlyDrivable: 'Alleen berijdbare segmenten',
            perimeterBlocking: 'Perimeterblokkering:',
            blockInbound: 'Alleen inkomend verkeer blokkeren',
            blockInboundHint: '(holle cirkel - uitgang toegestaan)',
            currentRadius: 'Huidige straal',
            circlesCleared: 'Cirkels gewist',
            noCirclesToUndo: 'Geen cirkels om ongedaan te maken',
            removedCircle: 'Laatste cirkel verwijderd',
            remaining: 'resterend',
            errorRemoving: 'Fout bij verwijderen',
            selectedSegments: '{0} segmenten geselecteerd',
            noSegmentsFound: 'Geen segmenten gevonden in cirkels',
            appliedRestrictions: '✓ Richtingsbeperkingen toegepast op {0} segmenten (uitgang behouden)',
            noModification: '⚠ Geen segmenten hoefden te worden gewijzigd ({0} verwerkt)',
            presetCircle: 'Vooraf ingestelde cirkel:',
            presetRadius: 'Straal:',
            presetHint: 'Cirkel Maken',
            clickForCenter: 'Klik voor middelpunt',
            circleCreated: 'Cirkel gemaakt ({0}m)',
            moveCircles: 'Cirkels verplaatsen',
            moveHint: 'Sleep om te verplaatsen',
            createMapComment: 'Map Comment maken',
            mapCommentOptions: 'Map Comment Opties:',
            commentTitle: 'Titel:',
            commentDesc: 'Beschrijving:',
            expiresIn: 'Verloopt over:',
            days: 'dagen',
            createFromCircle: 'Maken van laatste cirkel',
            noCircleToConvert: 'Geen cirkel beschikbaar',
            mapCommentCreated: 'Map Comment gemaakt!',
            selectCircleFirst: 'Teken eerst een cirkel',
            brushMode: 'Segment-penseel',
            brushModeHint: 'Schilderen om te selecteren',
            brushErase: 'Wis-modus',
            brushModeActive: 'Segment-penseel actief',
            exportRtcs: 'RTCs exporteren',
            importRtcs: 'RTCs importeren',
            exportedRtcs: '✓ {0} RTCs geëxporteerd',
            importedRtcs: '✓ {0} RTCs geïmporteerd',
            noRtcsToExport: 'Geen RTCs om te exporteren',
            importExport: 'Import/Export:',
            exportTypeRtcs: 'RTCs',
            exportTypeCircles: 'Cirkels',
            exportedCircles: '✓ {0} cirkels geëxporteerd',
            importedCircles: '✓ {0} cirkels geïmporteerd',
            noCirclesToExport: 'Geen cirkels om te exporteren',
            exportTypeGpx: 'GPX',
            importedGpx: '✓ GPX geïmporteerd: {0} segmenten gematcht',
            exportedGpx: '✓ GPX geëxporteerd',
            gpxNoSegments: 'Geen segmenten gematcht uit GPX'
        }
    };

    let currentLang = 'en';

    function detectLanguage() {
        try {
            // 1. WME I18n Sprache (Benutzereinstellung im Editor)
            if (window.I18n?.currentLocale) {
                const locale = window.I18n.currentLocale();
                const lang = locale.split('-')[0].toLowerCase();
                if (translations[lang]) return lang;
            }

            // 2. Fallback: Browser-Sprache
            const browserLang = navigator.language?.substring(0, 2) || 'en';
            if (translations[browserLang]) return browserLang;

            return 'en';
        } catch (e) {
            return 'en';
        }
    }

    function t(key, ...args) {
        let text = translations[currentLang]?.[key] || translations['en'][key] || key;
        args.forEach((arg, i) => {
            text = text.replace(`{${i}}`, arg);
        });
        return text;
    }

    function log(message, data = null) {
        if (DEBUG) {
            console.log(`[WME RTC Plus] ${message}`, data || '');
        }
    }

    function warn(message, data = null) {
        console.warn(`[WME RTC Plus] ${message}`, data || '');
    }

    // Befahrbare Segment-Typen (roadType Werte)
    // 1=Street, 2=Primary, 3=Freeway, 4=Ramp, 6=Major Highway, 7=Minor Highway, 21=Narrow Street
    const DRIVABLE_ROAD_TYPES = new Set([1, 2, 3, 4, 6, 7, 21]);

    function isDrivableSegment(segment) {
        const type = segment?.attributes?.roadType;
        return type && DRIVABLE_ROAD_TYPES.has(type);
    }

    // Settings Storage
    const STORAGE_KEY = 'wme-rtc-plus-settings';

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (e) { return {}; }
    }

    function saveSettings(settings) {
        try {
            const current = loadSettings();
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...settings }));
        } catch (e) { warn('Settings save error:', e); }
    }

    function addEventListenerWithCleanup(element, event, handler) {
        if (!element) return;
        element.addEventListener(event, handler);
        eventListeners.push({ element, event, handler });
    }

    function cleanupEventListeners() {
        eventListeners.forEach(({ element, event, handler }) => {
            try {
                element.removeEventListener(event, handler);
            } catch (e) {
                warn('Error removing event listener:', e);
            }
        });
        eventListeners = [];
    }

    function initializeScript() {
        uWaze = window.W;
        uOpenLayers = window.OpenLayers;

        if (!uWaze || !uOpenLayers || !uWaze.map) {
            log('WME objects not ready, retrying...');
            setTimeout(initializeScript, 500);
            return;
        }

        currentLang = detectLanguage();
        log(`Initializing with language: ${currentLang}`);
        radiusInit();
    }

    function addSidePanel() {
        try {
            const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-rtc-plus");

            tabLabel.innerText = t('tabTitle');
            tabLabel.title = 'WME RTC Plus';

            setupSidebarContent(tabPane);
        } catch (error) {
            log('New API failed, using fallback:', error);
            addSidePanelFallback();
        }
    }

    function addSidePanelFallback() {
        let userTabs = document.getElementById('user-info');
        if (!userTabs) {
            setTimeout(addSidePanelFallback, 1000);
            return;
        }

        let navTabs = userTabs.getElementsByClassName('nav-tabs')[0];
        let tabContent = userTabs.getElementsByClassName('tab-content')[0];

        if (!navTabs || !tabContent) {
            setTimeout(addSidePanelFallback, 1000);
            return;
        }

        let tab = document.createElement('li');
        tab.innerHTML = `<a href="#sidepanel-wme-rtc-plus" data-toggle="tab">${t('tabTitle')}</a>`;
        navTabs.appendChild(tab);

        let tabPane = document.createElement('section');
        tabPane.id = "sidepanel-wme-rtc-plus";
        tabPane.className = "tab-pane";
        tabContent.appendChild(tabPane);

        setupSidebarContent(tabPane);
    }

    function setupSidebarContent(tabPane) {
        tabPane.innerHTML = `
            <div style="padding:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <h4 style="margin:0;">${t('title')}</h4>
                    <span style="font-size:9px;color:#999;">v2026.01.03.24</span>
                </div>
                <div id="circles-current-radius" style="font-size:10px;color:#666;margin-bottom:4px;"></div>

                <div style="margin-bottom:6px;">
                    <label style="display:flex;align-items:center;cursor:pointer;margin-bottom:2px;font-size:11px;">
                        <input type="checkbox" id="wme-circles-edit-mode" style="margin-right:4px;">${t('enableCircle')}
                    </label>
                    <label style="display:flex;align-items:center;cursor:pointer;margin-bottom:2px;font-size:11px;">
                        <input type="checkbox" id="wme-freehand-edit-mode" style="margin-right:4px;">${t('enableFreehand')}
                    </label>
                    <label style="display:flex;align-items:center;cursor:pointer;margin-bottom:2px;font-size:11px;">
                        <input type="checkbox" id="wme-circles-move-mode" style="margin-right:4px;">${t('moveCircles')}
                    </label>
                    <label style="display:flex;align-items:center;cursor:pointer;font-size:11px;">
                        <input type="checkbox" id="wme-brush-mode" style="margin-right:4px;">🖌️ ${t('brushMode')}
                    </label>
                    <label style="display:none;align-items:center;cursor:pointer;font-size:11px;margin-left:18px;" id="brush-erase-label">
                        <input type="checkbox" id="wme-brush-erase" style="margin-right:4px;">🧹 ${t('brushErase')}
                    </label>
                    <div id="brush-mode-hint" style="display:none;font-size:9px;color:#666;margin-left:18px;">${t('brushModeHint')}</div>
                </div>

                <div style="padding:4px;background:#e3f2fd;border-radius:3px;margin-bottom:6px;">
                    <div style="display:flex;align-items:center;gap:4px;">
                        <span style="font-size:10px;">📐</span>
                        <span style="font-size:10px;">${t('presetRadius')}</span>
                        <input type="number" id="wme-preset-radius" min="5" max="5000" value="500" style="width:60px;padding:2px 4px;border:1px solid #ccc;border-radius:3px;font-size:11px;">
                        <span style="font-size:11px;">m</span>
                        <button id="wme-preset-circle-btn" style="flex:1;padding:4px;background:#2196F3;color:white;border:none;border-radius:3px;cursor:pointer;font-size:11px;">📍</button>
                    </div>
                    <button id="wme-preset-cancel-btn" style="width:100%;padding:4px;background:#f44336;color:white;border:none;border-radius:3px;cursor:pointer;margin-top:4px;display:none;font-size:11px;">❌</button>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-bottom:6px;">
                    <button id="wme-circles-select" style="padding:4px;background:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">${t('selectStreets')}</button>
                    <button id="wme-circles-undo" style="padding:4px;background:#2196F3;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">↩️ ${t('undoLastCircle')}</button>
                    <button id="wme-circles-clear" style="padding:4px;background:#f44336;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">🗑️ ${t('clearCircles')}</button>
                    <button id="wme-circles-delete-rtcs" style="padding:4px;background:#ff5722;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">🗑️ RTCs</button>
                </div>

                <details style="margin-bottom:6px;">
                    <summary style="cursor:pointer;padding:3px;background:#f5f5f5;border-radius:3px;font-size:10px;"><strong>${t('displayOptions')}</strong></summary>
                    <div style="padding:4px;background:#f5f5f5;border-radius:0 0 3px 3px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-size:10px;">${t('showRadius')}</span>
                            <label class="ts"><input type="checkbox" id="show-radius"><span class="sl"></span></label>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-size:10px;">${t('showDiameter')}</span>
                            <label class="ts"><input type="checkbox" id="show-diameter"><span class="sl"></span></label>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-size:10px;">${t('showArea')}</span>
                            <label class="ts"><input type="checkbox" id="show-area"><span class="sl"></span></label>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:10px;">${t('imperialUnits')}</span>
                            <label class="ts"><input type="checkbox" id="use-imperial"><span class="sl"></span></label>
                        </div>
                    </div>
                </details>

                <div style="display:flex;justify-content:space-between;align-items:center;padding:4px;background:#f5f5f5;border-radius:3px;margin-bottom:6px;">
                    <span style="font-size:10px;">${t('onlyDrivable')}</span>
                    <label class="ts"><input type="checkbox" id="filter-drivable-only"><span class="sl"></span></label>
                </div>

                <details style="margin-bottom:6px;">
                    <summary style="cursor:pointer;padding:3px;background:#e8f5e8;border-radius:3px;font-size:10px;"><strong>${t('perimeterBlocking')}</strong></summary>
                    <div style="padding:4px;background:#e8f5e8;border-radius:0 0 3px 3px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <div style="font-size:10px;">${t('blockInbound')}</div>
                                <div style="font-size:8px;color:#666;">${t('blockInboundHint')}</div>
                            </div>
                            <label class="ts"><input type="checkbox" id="block-inbound-only"><span class="sl"></span></label>
                        </div>
                        <div id="rtc-duration-settings" style="margin-top:6px;padding-top:6px;border-top:1px solid #c8e6c9;display:none;">
                            <div style="margin-bottom:4px;">
                                <label style="font-size:9px;margin-right:6px;"><input type="radio" name="rtc-mode" id="rtc-mode-duration" checked> ${t('rtcModeDuration')}</label>
                                <label style="font-size:9px;"><input type="radio" name="rtc-mode" id="rtc-mode-enddate"> ${t('rtcModeEndDate')}</label>
                            </div>
                            <div id="rtc-duration-inputs" style="display:flex;align-items:center;gap:3px;flex-wrap:wrap;">
                                <input type="number" id="rtc-duration-days" min="0" max="365" value="0" style="width:35px;padding:2px;border:1px solid #ccc;border-radius:3px;font-size:9px;">
                                <span style="font-size:9px;">${t('days')}</span>
                                <input type="number" id="rtc-duration-hours" min="0" max="23" value="24" style="width:35px;padding:2px;border:1px solid #ccc;border-radius:3px;font-size:9px;">
                                <span style="font-size:9px;">${t('rtcHours')}</span>
                                <input type="number" id="rtc-duration-minutes" min="0" max="59" value="0" style="width:35px;padding:2px;border:1px solid #ccc;border-radius:3px;font-size:9px;">
                                <span style="font-size:9px;">${t('rtcMinutes')}</span>
                            </div>
                            <div id="rtc-enddate-inputs" style="display:none;">
                                <div style="display:flex;align-items:center;gap:3px;">
                                    <input type="date" id="rtc-end-date" style="padding:2px;border:1px solid #ccc;border-radius:3px;font-size:9px;flex:1;">
                                    <input type="time" id="rtc-end-time" value="23:59" style="width:60px;padding:2px;border:1px solid #ccc;border-radius:3px;font-size:9px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </details>

                <details style="margin-bottom:6px;">
                    <summary style="cursor:pointer;padding:3px;background:#fff3e0;border-radius:3px;font-size:10px;"><strong>💬 ${t('createMapComment')}</strong></summary>
                    <div style="padding:4px;background:#fff3e0;border-radius:0 0 3px 3px;">
                        <input type="text" id="wme-mc-title" maxlength="30" placeholder="${t('commentTitle')}" style="width:100%;padding:3px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;font-size:10px;margin-bottom:3px;">
                        <textarea id="wme-mc-desc" rows="1" placeholder="${t('commentDesc')}" style="width:100%;padding:3px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;resize:vertical;font-size:10px;margin-bottom:3px;"></textarea>
                        <div style="display:flex;align-items:center;gap:3px;margin-bottom:4px;">
                            <span style="font-size:9px;">${t('expiresIn')}</span>
                            <input type="number" id="wme-mc-days" min="1" max="365" value="30" style="width:40px;padding:2px;border:1px solid #ccc;border-radius:3px;font-size:9px;">
                            <span style="font-size:9px;">${t('days')}</span>
                        </div>
                        <button id="wme-create-mapcomment-btn" style="width:100%;padding:4px;background:#ff9800;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">💬 ${t('createFromCircle')}</button>
                    </div>
                </details>

                <div style="padding:4px;background:#e8eaf6;border-radius:3px;">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;">
                        <label style="font-size:9px;"><input type="radio" name="export-type" id="export-type-rtcs" checked> ${t('exportTypeRtcs')}</label>
                        <label style="font-size:9px;"><input type="radio" name="export-type" id="export-type-circles"> ${t('exportTypeCircles')}</label>
                        <label style="font-size:9px;"><input type="radio" name="export-type" id="export-type-gpx"> ${t('exportTypeGpx')}</label>
                    </div>
                    <div style="display:flex;gap:3px;">
                        <button id="wme-export-rtcs-btn" style="flex:1;padding:3px;background:#3f51b5;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">Export</button>
                        <button id="wme-import-rtcs-btn" style="flex:1;padding:3px;background:#3f51b5;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;">Import</button>
                    </div>
                    <input type="file" id="wme-import-rtcs-file" accept=".json,.gpx" style="display:none;">
                </div>

                <style>
                    .ts{position:relative;display:inline-block;width:32px;height:16px;}
                    .ts input{opacity:0;width:0;height:0;}
                    .sl{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#ccc;transition:.2s;border-radius:16px;}
                    .sl:before{position:absolute;content:"";height:12px;width:12px;left:2px;bottom:2px;background:white;transition:.2s;border-radius:50%;}
                    input:checked+.sl{background:#4CAF50;}
                    input:checked+.sl:before{transform:translateX(16px);}
                    details summary{list-style:none;}
                    details summary::-webkit-details-marker{display:none;}
                    details summary::before{content:'▶';font-size:8px;margin-right:4px;display:inline-block;transition:transform .2s;}
                    details[open] summary::before{transform:rotate(90deg);}
                </style>
            </div>
        `;

        const checkbox = tabPane.querySelector('#wme-circles-edit-mode');
        const freehandCheckbox = tabPane.querySelector('#wme-freehand-edit-mode');
        const moveCheckbox = tabPane.querySelector('#wme-circles-move-mode');
        const clearButton = tabPane.querySelector('#wme-circles-clear');
        const selectButton = tabPane.querySelector('#wme-circles-select');
        const undoButton = tabPane.querySelector('#wme-circles-undo');
        const showRadiusCheckbox = tabPane.querySelector('#show-radius');
        const showDiameterCheckbox = tabPane.querySelector('#show-diameter');
        const showAreaCheckbox = tabPane.querySelector('#show-area');
        const useImperialCheckbox = tabPane.querySelector('#use-imperial');
        const filterDrivableCheckbox = tabPane.querySelector('#filter-drivable-only');
        const blockInboundCheckbox = tabPane.querySelector('#block-inbound-only');
        const presetRadiusInput = tabPane.querySelector('#wme-preset-radius');
        const presetCircleBtn = tabPane.querySelector('#wme-preset-circle-btn');
        const presetCancelBtn = tabPane.querySelector('#wme-preset-cancel-btn');
        const mapCommentBtn = tabPane.querySelector('#wme-create-mapcomment-btn');
        const mcTitleInput = tabPane.querySelector('#wme-mc-title');
        const mcDescInput = tabPane.querySelector('#wme-mc-desc');
        const mcDaysInput = tabPane.querySelector('#wme-mc-days');

        // Details elements für Klappmenüs
        const detailsDisplay = tabPane.querySelector('details:nth-of-type(1)');
        const detailsPerimeter = tabPane.querySelector('details:nth-of-type(2)');
        const detailsMapComment = tabPane.querySelector('details:nth-of-type(3)');

        // Einstellungen laden und anwenden
        const settings = loadSettings();
        if (settings.showRadius) showRadiusCheckbox.checked = true;
        if (settings.showDiameter) showDiameterCheckbox.checked = true;
        if (settings.showArea) showAreaCheckbox.checked = true;
        if (settings.useImperial) useImperialCheckbox.checked = true;
        if (settings.filterDrivable) filterDrivableCheckbox.checked = true;
        if (settings.blockInbound) blockInboundCheckbox.checked = true;
        if (settings.presetRadius) presetRadiusInput.value = settings.presetRadius;
        if (settings.detailsDisplayOpen) detailsDisplay?.setAttribute('open', '');
        if (settings.detailsPerimeterOpen) detailsPerimeter?.setAttribute('open', '');
        if (settings.detailsMapCommentOpen) detailsMapComment?.setAttribute('open', '');
        if (settings.rtcDays) tabPane.querySelector('#rtc-duration-days').value = settings.rtcDays;
        if (settings.rtcHours) tabPane.querySelector('#rtc-duration-hours').value = settings.rtcHours;
        if (settings.rtcMinutes) tabPane.querySelector('#rtc-duration-minutes').value = settings.rtcMinutes;

        // Einstellungen bei Änderung speichern
        const saveAllSettings = () => {
            saveSettings({
                showRadius: showRadiusCheckbox.checked,
                showDiameter: showDiameterCheckbox.checked,
                showArea: showAreaCheckbox.checked,
                useImperial: useImperialCheckbox.checked,
                filterDrivable: filterDrivableCheckbox.checked,
                blockInbound: blockInboundCheckbox.checked,
                presetRadius: presetRadiusInput.value,
                detailsDisplayOpen: detailsDisplay?.hasAttribute('open'),
                detailsPerimeterOpen: detailsPerimeter?.hasAttribute('open'),
                detailsMapCommentOpen: detailsMapComment?.hasAttribute('open'),
                rtcDays: tabPane.querySelector('#rtc-duration-days')?.value,
                rtcHours: tabPane.querySelector('#rtc-duration-hours')?.value,
                rtcMinutes: tabPane.querySelector('#rtc-duration-minutes')?.value
            });
        };

        // Event Listener für Speicherung
        [showRadiusCheckbox, showDiameterCheckbox, showAreaCheckbox, useImperialCheckbox,
         filterDrivableCheckbox, blockInboundCheckbox].forEach(el => {
            el?.addEventListener('change', saveAllSettings);
        });
        presetRadiusInput?.addEventListener('change', saveAllSettings);
        detailsDisplay?.addEventListener('toggle', saveAllSettings);
        detailsPerimeter?.addEventListener('toggle', saveAllSettings);
        detailsMapComment?.addEventListener('toggle', saveAllSettings);
        tabPane.querySelector('#rtc-duration-days')?.addEventListener('change', saveAllSettings);
        tabPane.querySelector('#rtc-duration-hours')?.addEventListener('change', saveAllSettings);
        tabPane.querySelector('#rtc-duration-minutes')?.addEventListener('change', saveAllSettings);

        function formatLength(meters, useImperial = false) {
            if (useImperial) {
                let feet = meters * 3.28084;
                if (feet >= 5280) {
                    let miles = feet / 5280;
                    return `${Math.round(miles * 100) / 100} mi`;
                } else {
                    return `${Math.round(feet)} ft`;
                }
            } else {
                if (meters > 1000) {
                    return `${Math.round((meters / 1000) * 100) / 100} km`;
                } else {
                    return `${Math.round(meters)} m`;
                }
            }
        }

        function formatArea(squareMeters, useImperial = false) {
            if (useImperial) {
                let squareFeet = squareMeters * 10.7639;
                if (squareFeet >= 27878400) {
                    let squareMiles = squareFeet / 27878400;
                    return `${Math.round(squareMiles * 100) / 100} mi²`;
                } else if (squareFeet >= 43560) {
                    let acres = squareFeet / 43560;
                    return `${Math.round(acres * 100) / 100} ac`;
                } else {
                    return `${Math.round(squareFeet)} ft²`;
                }
            } else {
                if (squareMeters > 1000000) {
                    return `${Math.round((squareMeters / 1000000) * 100) / 100} km²`;
                } else {
                    return `${Math.round(squareMeters)} m²`;
                }
            }
        }

        let updateTimeout;
        function updateAllAnnotations() {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                if (!infoLayer || !radiusLayer) return;

                try {
                    infoLayer.destroyFeatures();

                    if (!radiusLayer.features || radiusLayer.features.length === 0) {
                        return;
                    }

                    radiusLayer.features.forEach(feature => {
                        if (!feature || !feature.geometry) return;

                        if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
                            const components = feature.geometry.components?.[0]?.components;
                            if (components && components.length > 90) {
                                addCircleAnnotations(feature);
                            } else if (components) {
                                addFreehandAnnotations(feature);
                            }
                        }
                    });
                } catch (error) {
                    warn('Error updating annotations:', error);
                }
            }, 100);
        }

        function addCircleAnnotations(f) {
            try {
                let minX = f.geometry.bounds.left;
                let minY = f.geometry.bounds.bottom;
                let maxX = f.geometry.bounds.right;
                let maxY = f.geometry.bounds.top;

                let startX = (minX + maxX) / 2;
                let startY = (minY + maxY) / 2;

                let startPoint = new uOpenLayers.Geometry.Point(startX, startY);
                let endPoint = new uOpenLayers.Geometry.Point(maxX, startY);
                let radius = new uOpenLayers.Geometry.LineString([startPoint, endPoint]);
                let len = radius.getGeodesicLength(new uOpenLayers.Projection("EPSG:900913"));

                let area = Math.PI * len * len;

                let showRadius = showRadiusCheckbox?.checked;
                let showDiameter = showDiameterCheckbox?.checked;
                let showArea = showAreaCheckbox?.checked;
                let useImperial = useImperialCheckbox?.checked;

                let centerStyle = {
                    strokeColor: "#c40606",
                    strokeWidth: 2,
                    pointRadius: 5,
                    fillOpacity: 0.2
                };

                let labelText = [];

                if (showRadius) {
                    labelText.push('R: ' + formatLength(len, useImperial));
                }

                if (showDiameter) {
                    labelText.push('Ø: ' + formatLength(len * 2, useImperial));
                }

                if (showArea) {
                    labelText.push('A: ' + formatArea(area, useImperial));
                }

                let lineStyle = {
                    strokeColor: "#c40606",
                    strokeWidth: 3,
                    label: labelText.join(' | '),
                    labelAlign: "left",
                    labelXOffset: "20",
                    labelYOffset: "10",
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3
                };

                let center = new uOpenLayers.Feature.Vector(startPoint, {}, centerStyle);
                if (labelText.length > 0) {
                    let radiusLine = new uOpenLayers.Feature.Vector(radius, { 'length': len }, lineStyle);
                    infoLayer.addFeatures([center, radiusLine]);
                } else {
                    infoLayer.addFeatures([center]);
                }
            } catch (error) {
                warn('Error adding circle annotations:', error);
            }
        }

        function addFreehandAnnotations(f) {
            try {
                let bounds = f.geometry.getBounds();
                let minX = bounds.left;
                let minY = bounds.bottom;
                let maxX = bounds.right;
                let maxY = bounds.top;

                let centerX = (minX + maxX) / 2;
                let centerY = (minY + maxY) / 2;
                let width = maxX - minX;
                let height = maxY - minY;
                let diameter = Math.max(width, height);

                let centerPoint = new uOpenLayers.Geometry.Point(centerX, centerY);
                let endPoint = new uOpenLayers.Geometry.Point(centerX + diameter/2, centerY);
                let diameterLine = new uOpenLayers.Geometry.LineString([centerPoint, endPoint]);
                let len = diameterLine.getGeodesicLength(new uOpenLayers.Projection("EPSG:900913"));

                let area = f.geometry.getArea();

                let showRadius = showRadiusCheckbox?.checked;
                let showDiameter = showDiameterCheckbox?.checked;
                let showArea = showAreaCheckbox?.checked;
                let useImperial = useImperialCheckbox?.checked;

                let centerStyle = {
                    strokeColor: "#c40606",
                    strokeWidth: 2,
                    pointRadius: 5,
                    fillOpacity: 0.2
                };

                let labelText = [];

                if (showRadius) {
                    labelText.push('R: ' + formatLength(len / 2, useImperial));
                }

                if (showDiameter) {
                    labelText.push('Ø: ' + formatLength(len, useImperial));
                }

                if (showArea) {
                    labelText.push('A: ' + formatArea(area, useImperial));
                }

                let lineStyle = {
                    strokeColor: "#c40606",
                    strokeWidth: 3,
                    label: labelText.join(' | '),
                    labelAlign: "left",
                    labelXOffset: "20",
                    labelYOffset: "10",
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3
                };

                let center = new uOpenLayers.Feature.Vector(centerPoint, {}, centerStyle);
                if (labelText.length > 0) {
                    let diameterLineFeature = new uOpenLayers.Feature.Vector(diameterLine, { 'diameter': len }, lineStyle);
                    infoLayer.addFeatures([center, diameterLineFeature]);
                } else {
                    infoLayer.addFeatures([center]);
                }
            } catch (error) {
                warn('Error adding freehand annotations:', error);
            }
        }

        // Register global event listener for annotation updates (used by drag control)
        document.addEventListener('updateAnnotations', updateAllAnnotations);

        addEventListenerWithCleanup(showRadiusCheckbox, 'change', updateAllAnnotations);
        addEventListenerWithCleanup(showDiameterCheckbox, 'change', updateAllAnnotations);
        addEventListenerWithCleanup(showAreaCheckbox, 'change', updateAllAnnotations);
        addEventListenerWithCleanup(useImperialCheckbox, 'change', updateAllAnnotations);

        // Toggle RTC duration settings visibility
        const rtcDurationSettings = tabPane.querySelector('#rtc-duration-settings');
        const rtcDurationInputs = tabPane.querySelector('#rtc-duration-inputs');
        const rtcEnddateInputs = tabPane.querySelector('#rtc-enddate-inputs');
        const rtcModeDuration = tabPane.querySelector('#rtc-mode-duration');
        const rtcModeEnddate = tabPane.querySelector('#rtc-mode-enddate');
        const rtcEndDateInput = tabPane.querySelector('#rtc-end-date');

        // Initial state based on saved settings
        if (blockInboundCheckbox.checked && rtcDurationSettings) {
            rtcDurationSettings.style.display = 'block';
        }

        addEventListenerWithCleanup(blockInboundCheckbox, 'change', () => {
            if (rtcDurationSettings) {
                rtcDurationSettings.style.display = blockInboundCheckbox.checked ? 'block' : 'none';
                // Set default end date to tomorrow and min to today
                if (blockInboundCheckbox.checked && rtcEndDateInput) {
                    const today = new Date();
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    rtcEndDateInput.min = today.toISOString().split('T')[0];
                    rtcEndDateInput.value = tomorrow.toISOString().split('T')[0];
                }
            }
        });

        // Toggle between duration and end date mode
        const updateRtcMode = () => {
            if (rtcModeDuration?.checked) {
                rtcDurationInputs.style.display = 'flex';
                rtcEnddateInputs.style.display = 'none';
            } else {
                rtcDurationInputs.style.display = 'none';
                rtcEnddateInputs.style.display = 'block';
            }
        };
        addEventListenerWithCleanup(rtcModeDuration, 'change', updateRtcMode);
        addEventListenerWithCleanup(rtcModeEnddate, 'change', updateRtcMode);

        addEventListenerWithCleanup(checkbox, 'click', (e) => {
            if (e.target.checked) {
                freehandCheckbox.checked = false;
                moveCheckbox.checked = false;
                freehandControl.deactivate();
                dragControl.deactivate();
                polygonControl.activate();
            } else {
                polygonControl.deactivate();
            }
        });

        addEventListenerWithCleanup(freehandCheckbox, 'click', (e) => {
            if (e.target.checked) {
                checkbox.checked = false;
                moveCheckbox.checked = false;
                polygonControl.deactivate();
                dragControl.deactivate();
                freehandControl.activate();
            } else {
                freehandControl.deactivate();
            }
        });

        // DragFeature Control - recreated on demand
        function createDragControl() {
            log('Creating new DragFeature control, layer has ' + (radiusLayer.features?.length || 0) + ' features');
            const ctrl = new uOpenLayers.Control.DragFeature(radiusLayer, {
                onStart: function(feature, pixel) {
                    log('Drag started');
                },
                onDrag: function(feature, pixel) {
                    if (!this._lastUpdate || Date.now() - this._lastUpdate > 100) {
                        this._lastUpdate = Date.now();
                        document.dispatchEvent(new CustomEvent('updateAnnotations'));
                    }
                },
                onComplete: function(feature, pixel) {
                    log('Drag completed');
                    document.dispatchEvent(new CustomEvent('updateAnnotations'));
                }
            });
            return ctrl;
        }

        dragControl = createDragControl();
        uWaze.map.addControl(dragControl);

        function activateDragMode() {
            log('activateDragMode called');

            // Remove old control completely
            if (dragControl) {
                try {
                    dragControl.deactivate();
                    uWaze.map.removeControl(dragControl);
                } catch(e) {}
            }

            // Create fresh control and add it
            dragControl = createDragControl();
            uWaze.map.addControl(dragControl);

            // Activate it
            dragControl.activate();

            log('Drag mode activated, control.active=' + dragControl.active);
        }

        addEventListenerWithCleanup(moveCheckbox, 'click', (e) => {
            if (e.target.checked) {
                checkbox.checked = false;
                freehandCheckbox.checked = false;
                polygonControl.deactivate();
                freehandControl.deactivate();
                activateDragMode();
                updateStatusMessage(t('moveHint'), '#2196F3');
            } else {
                if (dragControl) {
                    dragControl.deactivate();
                    log('Drag mode deactivated');
                }
                updateStatusMessage('', '#4CAF50');
            }
        });

        // Track pending reactivation
        let reactivateTimer = null;

        function scheduleReactivation() {
            if (!moveCheckbox || !moveCheckbox.checked) return;

            // Clear any pending timer
            if (reactivateTimer) clearTimeout(reactivateTimer);

            // Wait for WME and other scripts to finish, then reactivate
            reactivateTimer = setTimeout(() => {
                if (moveCheckbox && moveCheckbox.checked) {
                    activateDragMode();
                }
            }, 2000); // Wait 2 seconds for everything to settle
        }

        // On zoom: schedule reactivation after everything finishes
        uWaze.map.events.register('zoomend', null, function() {
            log('zoomend event fired');

            if (radiusLayer && radiusLayer.redraw) radiusLayer.redraw();
            if (infoLayer && infoLayer.redraw) infoLayer.redraw();

            scheduleReactivation();

            document.dispatchEvent(new CustomEvent('updateAnnotations'));
        });

        // Also reactivate after map move completes
        uWaze.map.events.register('moveend', null, function() {
            if (moveCheckbox && moveCheckbox.checked) {
                scheduleReactivation();
            }
        });

        addEventListenerWithCleanup(clearButton, 'click', (e) => {
            clearAllCircles();
            updateStatusMessage(t('circlesCleared'), '#4CAF50');
        });

        addEventListenerWithCleanup(undoButton, 'click', (e) => {
            undoLastCircle();
        });

        addEventListenerWithCleanup(selectButton, 'click', (e) => {
            selectSegmentsInCircles();
        });

        // Delete RTCs Button
        const deleteRtcsBtn = tabPane.querySelector('#wme-circles-delete-rtcs');
        addEventListenerWithCleanup(deleteRtcsBtn, 'click', (e) => {
            deleteRtcsInCircles();
        });

        // Brush Mode - basiert auf Freihand-Zeichnung mit breiter Linie
        const brushCheckbox = tabPane.querySelector('#wme-brush-mode');
        const brushHint = tabPane.querySelector('#brush-mode-hint');
        let brushModeActive = false;
        let brushControl = null;
        let brushLayer = null;
        let brushSelectedSegments = new Set(); // Speichert alle ausgewählten Segment-IDs
        let brushHistory = []; // History für Undo - speichert Snapshots der Auswahl

        // Erstelle separaten Layer für Brush mit breiter Linie
        brushLayer = new uOpenLayers.Layer.Vector("WME Brush Layer", {
            displayInLayerSwitcher: false,
            visibility: true,
            style: {
                strokeColor: "#2196F3",
                strokeOpacity: 0.6,
                strokeWidth: 20, // 20 Pixel breit
                strokeLinecap: "round"
            }
        });
        uWaze.map.addLayer(brushLayer);

        // Brush Control - wie Freihand aber für Selektion
        brushControl = new uOpenLayers.Control.DrawFeature(brushLayer, uOpenLayers.Handler.Path, {
            handlerOptions: {
                freehand: true,
                freehandToggle: null
            }
        });
        uWaze.map.addControl(brushControl);

        // Wenn Brush-Zeichnung fertig ist, finde geschnittene Segmente
        brushControl.events.on({
            'featureadded': function(e) {
                if (!brushModeActive) return;

                const brushGeom = e.feature.geometry;
                if (!brushGeom) return;

                // Prüfe ob Löschen-Modus aktiv
                const brushEraseCheckbox = tabPane.querySelector('#wme-brush-erase');
                const eraseMode = brushEraseCheckbox?.checked || false;

                log(`Brush Event: eraseMode=${eraseMode}, brushSelectedSegments.size=${brushSelectedSegments.size}`);

                // Speichere aktuellen Zustand für Undo BEVOR Änderungen
                brushHistory.push(new Set(brushSelectedSegments));
                if (brushHistory.length > 50) brushHistory.shift(); // Max 50 Schritte

                // Erstelle Buffer um die Linie
                const resolution = uWaze.map.getResolution();
                const bufferSize = eraseMode ? 10 * resolution : 20 * resolution;

                // Finde alle Segmente die die Brush-Linie schneiden
                const segments = uWaze.model.segments.getObjectArray();
                let changeCount = 0;
                let checkedCount = 0;

                for (const segment of segments) {
                    if (!segment.attributes?.roadType) continue;

                    // Filter: nur befahrbare
                    if (filterDrivableCheckbox?.checked) {
                        if (!isDrivableSegment(segment)) continue;
                    }

                    const segGeom = segment.getOLGeometry?.() || segment.geometry;
                    if (!segGeom) continue;

                    checkedCount++;

                    // Prüfe ob Segment die Brush-Linie schneidet oder nah dran ist
                    const distance = brushGeom.distanceTo(segGeom);

                    let threshold;
                    if (eraseMode) {
                        threshold = Math.min(5 * resolution, 3);
                    } else {
                        threshold = bufferSize;
                    }

                    if (distance < threshold) {
                        const segId = segment.getID();

                        if (eraseMode) {
                            // LÖSCHEN-MODUS: Entferne NUR dieses eine Segment
                            if (brushSelectedSegments.has(segId)) {
                                brushSelectedSegments.delete(segId);
                                if (window._gpxSegmentIds) {
                                    window._gpxSegmentIds.delete(segId);
                                }
                                changeCount++;
                                log(`Brush Erase: Segment ${segId} entfernt`);
                            }
                        } else {
                            // NORMAL-MODUS: Füge Segment zur Auswahl hinzu
                            if (!brushSelectedSegments.has(segId)) {
                                brushSelectedSegments.add(segId);
                                changeCount++;
                            }
                        }
                    }
                }

                log(`Brush: ${checkedCount} Segmente geprüft, ${changeCount} geändert, ${brushSelectedSegments.size} IDs gesamt`);

                // Lösche die Brush-Linie
                brushLayer.removeAllFeatures();

                // Aktualisiere WME Selektion
                const allSegments = Array.from(brushSelectedSegments)
                    .map(id => uWaze.model.segments.getObjectById(id))
                    .filter(Boolean);

                log(`Brush: ${allSegments.length} Segmente geladen von ${brushSelectedSegments.size} IDs`);

                if (allSegments.length > 0) {
                    uWaze.selectionManager.setSelectedModels(allSegments);
                    if (eraseMode) {
                        const notLoaded = brushSelectedSegments.size - allSegments.length;
                        const notLoadedText = notLoaded > 0 ? ` (+${notLoaded} nicht geladen)` : '';
                        updateStatusMessage(`🧹 ${allSegments.length} Segmente (-${changeCount} entfernt)${notLoadedText}`, '#ff9800');
                    } else {
                        updateStatusMessage(`🖌️ ${allSegments.length} Segmente (+${changeCount} neu)`, '#2196F3');
                    }
                } else if (brushSelectedSegments.size > 0) {
                    // IDs vorhanden aber nicht geladen - NICHT deselektieren!
                    if (eraseMode) {
                        updateStatusMessage(`🧹 ${changeCount} entfernt (${brushSelectedSegments.size} IDs gespeichert)`, '#ff9800');
                    } else {
                        updateStatusMessage(`🖌️ ${brushSelectedSegments.size} Segmente (nicht im Viewport)`, '#2196F3');
                    }
                } else {
                    uWaze.selectionManager.unselectAll();
                    window._gpxSegmentIds = null;
                    updateStatusMessage(`🧹 Alle Segmente entfernt`, '#ff9800');
                }
            }
        });

        // Brush Undo Funktion
        function undoBrushSelection() {
            if (brushHistory.length === 0) {
                return false; // Keine History
            }

            // Letzten Zustand wiederherstellen
            brushSelectedSegments = brushHistory.pop();

            // WME Selektion aktualisieren
            const allSegments = Array.from(brushSelectedSegments)
                .map(id => uWaze.model.segments.getObjectById(id))
                .filter(Boolean);

            if (allSegments.length > 0) {
                uWaze.selectionManager.setSelectedModels(allSegments);
            } else {
                uWaze.selectionManager.unselectAll();
            }

            updateStatusMessage(`↩️ ${allSegments.length} Segmente`, '#2196F3');
            return true;
        }
        addEventListenerWithCleanup(brushCheckbox, 'change', (e) => {
            brushModeActive = e.target.checked;
            brushHint.style.display = brushModeActive ? 'block' : 'none';

            // Zeige/verstecke Löschen-Checkbox
            const brushEraseLabel = tabPane.querySelector('#brush-erase-label');
            if (brushEraseLabel) {
                brushEraseLabel.style.display = brushModeActive ? 'flex' : 'none';
            }

            if (brushModeActive) {
                // Deaktiviere andere Modi
                checkbox.checked = false;
                freehandCheckbox.checked = false;
                moveCheckbox.checked = false;
                polygonControl.deactivate();
                freehandControl.deactivate();
                if (dragControl) dragControl.deactivate();

                // WICHTIG: Übernehme Segment-IDs
                brushSelectedSegments.clear();

                // 1. Zuerst: Global gespeicherte GPX-IDs übernehmen (falls vorhanden)
                if (window._gpxSegmentIds && window._gpxSegmentIds.size > 0) {
                    for (const id of window._gpxSegmentIds) {
                        brushSelectedSegments.add(id);
                    }
                    log(`Brush: ${brushSelectedSegments.size} GPX-Segment-IDs übernommen`);
                }

                // 2. Dann: Aktuelle WME-Selektion hinzufügen (falls zusätzliche Segmente)
                try {
                    const currentSelection = uWaze.selectionManager.getSelectedFeatures() || [];
                    let addedFromSelection = 0;
                    for (const feature of currentSelection) {
                        if (feature?.model?.type === 'segment') {
                            const segId = feature.model.attributes?.id || feature.model.getID?.();
                            if (segId && !brushSelectedSegments.has(segId)) {
                                brushSelectedSegments.add(segId);
                                addedFromSelection++;
                            }
                        }
                    }
                    if (addedFromSelection > 0) {
                        log(`Brush: +${addedFromSelection} Segmente aus aktueller Auswahl`);
                    }
                } catch (e) {
                    // Fallback: Keine Übernahme
                }

                // Aktiviere Brush
                brushControl.activate();
                updateStatusMessage(t('brushModeActive') + (brushSelectedSegments.size > 0 ? ` (${brushSelectedSegments.size})` : ''), '#2196F3');
                log('Brush-Modus aktiviert');
            } else {
                brushControl.deactivate();
                brushLayer.removeAllFeatures();
                // Löschen-Checkbox zurücksetzen
                const brushEraseCheckbox = tabPane.querySelector('#wme-brush-erase');
                if (brushEraseCheckbox) brushEraseCheckbox.checked = false;
                // Auswahl bleibt erhalten beim Deaktivieren
                updateStatusMessage('', '#4CAF50');
                log('Brush-Modus deaktiviert');
            }
        });

        // Import/Export Buttons
        const exportBtn = tabPane.querySelector('#wme-export-rtcs-btn');
        const importBtn = tabPane.querySelector('#wme-import-rtcs-btn');
        const importFile = tabPane.querySelector('#wme-import-rtcs-file');
        const exportTypeRtcs = tabPane.querySelector('#export-type-rtcs');
        const exportTypeCircles = tabPane.querySelector('#export-type-circles');
        const exportTypeGpx = tabPane.querySelector('#export-type-gpx');

        addEventListenerWithCleanup(exportBtn, 'click', (e) => {
            if (exportTypeGpx?.checked) {
                exportSelectedAsGpx();
            } else if (exportTypeCircles?.checked) {
                exportCirclesInArea();
            } else {
                exportRtcsInArea();
            }
        });

        addEventListenerWithCleanup(importBtn, 'click', (e) => {
            importFile.click();
        });

        addEventListenerWithCleanup(importFile, 'change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const fileName = file.name.toLowerCase();

                // GPX-Datei erkennen (unabhängig von Radio-Button)
                if (fileName.endsWith('.gpx')) {
                    importGpxFile(file);
                } else if (exportTypeCircles?.checked) {
                    importCirclesFromFile(file);
                } else {
                    importRtcsFromFile(file);
                }
                e.target.value = ''; // Reset für erneuten Import
            }
        });

        // Preset Circle Event Handlers
        addEventListenerWithCleanup(presetCircleBtn, 'click', (e) => {
            startPresetCircleMode();
        });

        addEventListenerWithCleanup(presetCancelBtn, 'click', (e) => {
            cancelPresetCircleMode();
        });

        // Map Comment Event Handler
        addEventListenerWithCleanup(mapCommentBtn, 'click', (e) => {
            createMapCommentFromCircle();
        });

        function createMapCommentFromCircle() {
            try {
                if (!radiusLayer || !radiusLayer.features || radiusLayer.features.length === 0) {
                    updateStatusMessage(t('selectCircleFirst'), '#ff9800');
                    return;
                }

                const lastFeature = radiusLayer.features[radiusLayer.features.length - 1];
                if (!lastFeature || !lastFeature.geometry) {
                    updateStatusMessage(t('noCircleToConvert'), '#ff9800');
                    return;
                }

                // Get SDK
                let sdk = null;
                try {
                    if (typeof getWmeSdk === 'function') {
                        sdk = getWmeSdk({ scriptId: 'wme-circles', scriptName: 'WME Circles' });
                    }
                } catch (e) {
                    warn('SDK not available:', e);
                }

                if (!sdk || !sdk.DataModel || !sdk.DataModel.MapComments) {
                    updateStatusMessage('SDK not available', '#f44336');
                    warn('WME SDK not available for Map Comments');
                    return;
                }

                // Convert OpenLayers geometry to GeoJSON
                const geometry = lastFeature.geometry;
                const coords = [];

                // Mercator to WGS84 conversion
                function mercatorToWgs84(x, y) {
                    const lon = (x / 20037508.34) * 180;
                    let lat = (y / 20037508.34) * 180;
                    lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                    return [lon, lat];
                }

                // Get polygon points
                if (geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
                    const ring = geometry.components[0];
                    if (ring && ring.components) {
                        for (const point of ring.components) {
                            const [lon, lat] = mercatorToWgs84(point.x, point.y);
                            coords.push([lon, lat]);
                        }
                    }
                }

                if (coords.length < 4) {
                    updateStatusMessage('Invalid geometry', '#f44336');
                    return;
                }

                // Build GeoJSON
                const geoJson = {
                    type: 'Polygon',
                    coordinates: [coords]
                };

                // Get form values
                const title = mcTitleInput?.value || '';
                const desc = mcDescInput?.value || '';
                const days = parseInt(mcDaysInput?.value) || 30;

                // Calculate end date
                const endDate = Date.now() + (days * 24 * 60 * 60 * 1000);

                log('Creating Map Comment with geometry:', geoJson);

                // Create Map Comment via SDK
                const result = sdk.DataModel.MapComments.addComment({
                    geometry: geoJson,
                    subject: String(title).substring(0, 30),
                    body: String(desc).substring(0, 2000),
                    endDate: endDate
                });

                if (result) {
                    updateStatusMessage('✅ ' + t('mapCommentCreated') + ' (ID: ' + result.id + ')', '#4CAF50');
                    log('Map Comment created:', result);

                    // Clear form
                    if (mcTitleInput) mcTitleInput.value = '';
                    if (mcDescInput) mcDescInput.value = '';
                } else {
                    updateStatusMessage('✅ ' + t('mapCommentCreated'), '#4CAF50');
                }

            } catch (error) {
                warn('Error creating Map Comment:', error);
                updateStatusMessage('Error: ' + error.message, '#f44336');
            }
        }

        function startPresetCircleMode() {
            presetCircleMode = true;
            presetCircleCenter = null;

            // Deactivate other drawing modes
            checkbox.checked = false;
            freehandCheckbox.checked = false;
            polygonControl.deactivate();
            freehandControl.deactivate();

            // Update UI
            presetCircleBtn.style.background = '#ff9800';
            presetCircleBtn.textContent = '⏳ ' + t('clickForCenter');
            presetCancelBtn.style.display = 'block';

            updateStatusMessage(t('clickForCenter'), '#2196F3');

            // Add map click handler
            uWaze.map.events.register('click', null, onPresetMapClick);
        }

        function cancelPresetCircleMode() {
            presetCircleMode = false;
            presetCircleCenter = null;

            // Reset UI
            presetCircleBtn.style.background = '#2196F3';
            presetCircleBtn.textContent = '📍 ' + t('presetHint');
            presetCancelBtn.style.display = 'none';

            updateStatusMessage('', '#4CAF50');

            // Remove map click handler
            uWaze.map.events.unregister('click', null, onPresetMapClick);
        }

        function onPresetMapClick(e) {
            if (!presetCircleMode) return;

            // Get click position - this returns WGS84 coordinates directly
            const lonlat = uWaze.map.getLonLatFromPixel(e.xy);
            if (!lonlat) {
                warn('Could not get coordinates from click');
                return;
            }

            const radius = parseInt(presetRadiusInput?.value) || 100;

            log(`Preset click at: ${lonlat.lon}, ${lonlat.lat}, radius: ${radius}m`);

            // lonlat.lon and lonlat.lat are already in WGS84
            createPresetCircle(lonlat.lon, lonlat.lat, radius);

            // Reset mode
            cancelPresetCircleMode();

            updateStatusMessage(t('circleCreated', radius), '#4CAF50');
        }

        function createPresetCircle(centerLon, centerLat, radiusMeters) {
            try {
                // centerLon, centerLat are already in WGS84
                log(`Creating circle at WGS84: ${centerLon}, ${centerLat}`);

                // WGS84 to Mercator conversion
                function wgs84ToMercator(lon, lat) {
                    const x = lon * 20037508.34 / 180;
                    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
                    y = y * 20037508.34 / 180;
                    return [x, y];
                }

                // Create circle points using geodesic calculation
                const points = [];
                const steps = 100;

                for (let i = 0; i <= steps; i++) {
                    const bearing = (i / steps) * 360;
                    const destPoint = destinationPoint(
                        [centerLon, centerLat],
                        radiusMeters,
                        bearing
                    );

                    // Convert to Mercator for OpenLayers
                    const [mx, my] = wgs84ToMercator(destPoint[0], destPoint[1]);
                    points.push(new uOpenLayers.Geometry.Point(mx, my));
                }

                // Create polygon
                const ring = new uOpenLayers.Geometry.LinearRing(points);
                const polygon = new uOpenLayers.Geometry.Polygon([ring]);
                const feature = new uOpenLayers.Feature.Vector(polygon);

                // Add to layer
                radiusLayer.addFeatures([feature]);

                // Force redraw
                if (radiusLayer.redraw) radiusLayer.redraw();

                // Update annotations
                setTimeout(() => {
                    const event = new CustomEvent('updateAnnotations');
                    document.dispatchEvent(event);
                }, 100);

                log(`Created preset circle: ${radiusMeters}m`);

            } catch (error) {
                warn('Error creating preset circle:', error);
                console.error(error);
            }
        }

        // Geodesic destination point calculation
        function destinationPoint(start, distanceMeters, bearingDegrees) {
            const toRadians = (deg) => deg * Math.PI / 180;
            const toDegrees = (rad) => rad * 180 / Math.PI;

            const startLon = Number(start[0]);
            const startLat = Number(start[1]);
            const dist = Number(distanceMeters);
            const bearing = Number(bearingDegrees);

            const lon1 = toRadians(startLon);
            const lat1 = toRadians(startLat);
            const bearingRad = toRadians(bearing);
            const angularDist = dist / EARTH_RADIUS;

            const lat2 = Math.asin(
                Math.sin(lat1) * Math.cos(angularDist) +
                Math.cos(lat1) * Math.sin(angularDist) * Math.cos(bearingRad)
            );
            const lon2 = lon1 + Math.atan2(
                Math.sin(bearingRad) * Math.sin(angularDist) * Math.cos(lat1),
                Math.cos(angularDist) - Math.sin(lat1) * Math.sin(lat2)
            );
            return [toDegrees(lon2), toDegrees(lat2)];
        }

        function updateStatusMessage(message, color = '#4CAF50') {
            const statusElement = document.getElementById('circles-current-radius');
            if (statusElement) {
                statusElement.innerHTML = message;
                statusElement.style.color = color;
                setTimeout(() => {
                    statusElement.innerHTML = '';
                    statusElement.style.color = '';
                }, 4000);
            }
        }

        function selectSegmentsInCircles() {
            const toSelect = [];
            const segments = uWaze.model.segments.getObjectArray();
            const blockInboundOnly = blockInboundCheckbox?.checked;

            if (!segments || segments.length === 0) {
                warn('No segments found');
                return;
            }

            if (blockInboundOnly) {
                log('Finding perimeter segments for hollow circle blocking...');

                for (const drawnFeature of radiusLayer.features) {
                    const circleGeometry = drawnFeature.geometry;
                    const bounds = circleGeometry.getBounds();
                    const circleCenter = {
                        x: (bounds.left + bounds.right) / 2,
                        y: (bounds.bottom + bounds.top) / 2
                    };

                    const radius = Math.abs(bounds.right - bounds.left) / 2;
                    // Toleranz für Segmente die den Kreis knapp berühren (5% des Radius)
                    const tolerance = radius * 0.05;

                    for (const segment of segments) {
                        if (!segment.attributes?.roadType) continue;

                        if (filterDrivableCheckbox.checked) {
                            if (!isDrivableSegment(segment)) continue;
                        }

                        const segGeom = segment.getOLGeometry ? segment.getOLGeometry() : segment.geometry;
                        if (!segGeom) continue;

                        const coords = segGeom.components || segGeom.getVertices?.();
                        if (!coords || coords.length < 2) continue;

                        // Prüfe Start- und Endpunkt
                        const startPoint = coords[0];
                        const endPoint = coords[coords.length - 1];

                        if (!startPoint?.x || !endPoint?.x) continue;

                        const startDist = Math.hypot(startPoint.x - circleCenter.x, startPoint.y - circleCenter.y);
                        const endDist = Math.hypot(endPoint.x - circleCenter.x, endPoint.y - circleCenter.y);

                        // Prüfe ob Punkte innen oder außen sind (mit Toleranz)
                        const startInside = startDist < (radius + tolerance);
                        const endInside = endDist < (radius + tolerance);
                        const startStrictInside = startDist < (radius - tolerance);
                        const endStrictInside = endDist < (radius - tolerance);

                        // Ein Segment ist ein Perimeter-Segment wenn:
                        // 1. Ein Punkt klar innen und einer klar außen
                        // 2. Mindestens ein Punkt berührt den Perimeter (innerhalb Toleranz)
                        // 3. Das Segment schneidet den Kreis geometrisch

                        let isPerimeterSegment = false;

                        // Fall 1: Ein Punkt innen, einer außen
                        if (startStrictInside !== endStrictInside) {
                            isPerimeterSegment = true;
                        }
                        // Fall 2: Mindestens ein Punkt liegt nah am Perimeter
                        else if (Math.abs(startDist - radius) <= tolerance || Math.abs(endDist - radius) <= tolerance) {
                            isPerimeterSegment = true;
                        }
                        // Fall 3: Segment kreuzt den Kreis (beide außen aber intersects)
                        else if (!startInside && !endInside && circleGeometry.intersects(segGeom)) {
                            isPerimeterSegment = true;
                        }
                        // Fall 4: Prüfe ob irgendein Zwischenpunkt den Kreis kreuzt
                        else if (coords.length > 2) {
                            for (let i = 1; i < coords.length - 1; i++) {
                                const midPoint = coords[i];
                                if (midPoint?.x) {
                                    const midDist = Math.hypot(midPoint.x - circleCenter.x, midPoint.y - circleCenter.y);
                                    if (Math.abs(midDist - radius) <= tolerance) {
                                        isPerimeterSegment = true;
                                        break;
                                    }
                                }
                            }
                        }

                        if (isPerimeterSegment) {
                            if (shouldBlockSegmentInbound(segment, segGeom, circleCenter, radius)) {
                                // Duplikate vermeiden
                                if (!toSelect.find(s => s.getID() === segment.getID())) {
                                    toSelect.push(segment);
                                    log(`✓ Perimeter-Segment gefunden: ${segment.getID()} (${segment.attributes.primaryStreetID ? 'Straße' : 'unbenannt'})`);
                                }
                            }
                        }
                    }
                }

                log(`=== Gefundene Perimeter-Segmente: ${toSelect.length} ===`);
                toSelect.forEach(s => log(`  - Segment ${s.getID()}`));
            } else {
                for (const segment of segments) {
                    if (!segment.attributes?.roadType) continue;

                    if (filterDrivableCheckbox.checked) {
                        if (!isDrivableSegment(segment)) continue;
                    }

                    const segGeom = segment.getOLGeometry ? segment.getOLGeometry() : segment.geometry;
                    if (!segGeom) continue;

                    let isInCircle = false;

                    for (const drawnFeature of radiusLayer.features) {
                        if (drawnFeature.geometry.intersects(segGeom)) {
                            isInCircle = true;
                            break;
                        }
                    }

                    if (isInCircle) {
                        toSelect.push(segment);
                    }
                }
            }

            log(`Selected ${toSelect.length} segments${blockInboundOnly ? ' (perimeter only)' : ''}`);

            if (toSelect.length > 0) {
                if (blockInboundOnly) {
                    applyDirectionRestrictions(toSelect);
                } else {
                    uWaze.selectionManager.setSelectedModels(toSelect);
                    updateStatusMessage(t('selectedSegments', toSelect.length), '#4CAF50');
                }
            } else {
                updateStatusMessage(t('noSegmentsFound'), '#ff9800');
            }

            checkbox.checked = false;
            freehandCheckbox.checked = false;
            polygonControl.deactivate();
            freehandControl.deactivate();
        }

        function exportRtcsInArea() {
            log('=== Export Button geklickt ===');

            if (!radiusLayer || !radiusLayer.features || radiusLayer.features.length === 0) {
                updateStatusMessage('Erst einen Kreis zeichnen', '#ff9800');
                log('Export abgebrochen: Kein Kreis vorhanden');
                return;
            }

            log(`radiusLayer hat ${radiusLayer.features.length} Features`);

            const segments = uWaze.model.segments.getObjectArray();
            log(`${segments.length} Segmente im Model`);

            const segmentsInCircle = [];

            // Finde alle Segmente im Kreis
            for (const segment of segments) {
                if (!segment.attributes?.roadType) continue;

                const segGeom = segment.getOLGeometry ? segment.getOLGeometry() : segment.geometry;
                if (!segGeom) continue;

                for (const drawnFeature of radiusLayer.features) {
                    if (drawnFeature.geometry.intersects(segGeom)) {
                        segmentsInCircle.push(segment);
                        break;
                    }
                }
            }

            log(`${segmentsInCircle.length} Segmente im Kreis gefunden`);

            if (segmentsInCircle.length === 0) {
                updateStatusMessage('Keine Segmente im Kreis gefunden', '#ff9800');
                return;
            }

            // Finde alle RTCs auf diesen Segmenten
            const rtcsToExport = [];
            const segmentIds = new Set(segmentsInCircle.map(s => s.getID()));

            log(`Prüfe roadClosures...`);
            log(`W.model.roadClosures existiert: ${!!W.model.roadClosures}`);

            if (W.model.roadClosures) {
                const allClosures = W.model.roadClosures.getObjectArray();
                log(`${allClosures.length} Closures im Model insgesamt`);

                for (const closure of allClosures) {
                    const attrs = closure.attributes;
                    if (!attrs) continue;

                    log(`Closure prüfen: segID=${attrs.segID}, in Set: ${segmentIds.has(attrs.segID)}`);

                    if (segmentIds.has(attrs.segID)) {
                        rtcsToExport.push({
                            segmentId: attrs.segID,
                            reason: attrs.reason || '',
                            direction: attrs.direction,
                            startDate: attrs.startDate,
                            endDate: attrs.endDate,
                            permanent: attrs.permanent || false
                        });
                        log(`  → RTC hinzugefügt für Segment ${attrs.segID}`);
                    }
                }
            } else {
                warn('W.model.roadClosures nicht verfügbar!');

                // Alternative: Prüfe ob Closures auf den Segmenten selbst gespeichert sind
                log('Versuche Closures direkt von Segmenten zu lesen...');
                for (const segment of segmentsInCircle) {
                    const closures = segment.attributes?.roadClosures || segment.attributes?.closures;
                    if (closures && closures.length > 0) {
                        log(`Segment ${segment.getID()} hat ${closures.length} Closures`);
                        for (const c of closures) {
                            rtcsToExport.push({
                                segmentId: segment.getID(),
                                reason: c.reason || '',
                                direction: c.direction,
                                startDate: c.startDate,
                                endDate: c.endDate,
                                permanent: c.permanent || false
                            });
                        }
                    }
                }
            }

            log(`${rtcsToExport.length} RTCs zum Export gefunden`);

            if (rtcsToExport.length === 0) {
                updateStatusMessage(t('noRtcsToExport') + ' (0 RTCs auf ' + segmentsInCircle.length + ' Segmenten)', '#ff9800');
                return;
            }

            // Export als JSON
            const exportData = {
                version: 1,
                exportDate: new Date().toISOString(),
                segmentCount: segmentsInCircle.length,
                rtcs: rtcsToExport
            };

            log('Erstelle Download...');

            try {
                const jsonStr = JSON.stringify(exportData, null, 2);
                log(`JSON erstellt: ${jsonStr.length} Zeichen`);

                const blob = new Blob([jsonStr], { type: 'application/json' });
                log(`Blob erstellt: ${blob.size} Bytes`);

                const url = URL.createObjectURL(blob);
                log(`URL erstellt: ${url}`);

                const a = document.createElement('a');
                a.href = url;
                a.download = `wme-rtcs-export-${new Date().toISOString().slice(0,10)}.json`;
                a.style.display = 'none';
                document.body.appendChild(a);

                log('Starte Download...');
                a.click();

                // Cleanup nach kurzer Verzögerung
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    log('Cleanup abgeschlossen');
                }, 100);

                updateStatusMessage(t('exportedRtcs', rtcsToExport.length), '#4CAF50');
                log(`✓ ${rtcsToExport.length} RTCs exportiert`);
            } catch (err) {
                warn('Export Fehler:', err);
                console.error('Export Fehler Details:', err);
                updateStatusMessage('Export Fehler: ' + err.message, '#f44336');
            }
        }

        function importRtcsFromFile(file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    if (!data.rtcs || !Array.isArray(data.rtcs)) {
                        updateStatusMessage('Ungültiges Dateiformat', '#f44336');
                        return;
                    }

                    log(`Importiere ${data.rtcs.length} RTCs...`);
                    importRtcs(data.rtcs);

                } catch (err) {
                    warn('Import Fehler:', err);
                    updateStatusMessage('Fehler beim Lesen der Datei', '#f44336');
                }
            };

            reader.readAsText(file);
        }

        function importRtcs(rtcList) {
            if (rtcList.length === 0) {
                updateStatusMessage('Keine RTCs zum Importieren', '#ff9800');
                return;
            }

            const cab = require("Waze/Modules/Closures/Models/ClosureActionBuilder");
            const sc = require("Waze/Modules/Closures/Models/SharedClosure");

            let importedCount = 0;
            let errorCount = 0;
            let currentIndex = 0;

            const importNext = () => {
                if (currentIndex >= rtcList.length) {
                    updateStatusMessage(t('importedRtcs', importedCount) + (errorCount > 0 ? ` (${errorCount} Fehler)` : ''), '#4CAF50');
                    return;
                }

                const rtc = rtcList[currentIndex];
                currentIndex++;

                const segment = W.model.segments.getObjectById(rtc.segmentId);
                if (!segment) {
                    log(`Segment ${rtc.segmentId} nicht gefunden, überspringe...`);
                    errorCount++;
                    importNext();
                    return;
                }

                W.selectionManager.setSelectedModels([segment]);

                const closureDetails = {
                    closures: [],
                    attributions: [],
                    reason: (rtc.reason || 'Import') + String.fromCharCode(160),
                    direction: rtc.direction || 3,
                    startDate: rtc.startDate,
                    endDate: rtc.endDate,
                    location: "",
                    permanent: rtc.permanent || false,
                    segments: [segment],
                    closuresType: 'roadClosure',
                    reverseSegments: {}
                };

                const closure = new sc(closureDetails, {
                    dataModel: W.model,
                    segmentSelection: W.selectionManager.getSegmentSelection(),
                    isNewClosure: true,
                    closedNodesMap: {}
                });

                if (closure.closureNodes?.models) {
                    for (const n of closure.closureNodes.models) {
                        n.attributes.isClosed = false;
                    }
                }

                const action = cab.add(closure, W.loginManager.user, W.model);

                W.controller.save({ actions: [action] }).then(() => {
                    importedCount++;
                    updateStatusMessage(`Importiere... ${currentIndex}/${rtcList.length}`, '#2196F3');
                    importNext();
                }).catch((err) => {
                    errorCount++;
                    log(`Import Fehler für Segment ${rtc.segmentId}: ${err.errors?.[0]?.attributes?.details || err.message}`);
                    importNext();
                });
            };

            updateStatusMessage(`Importiere... 0/${rtcList.length}`, '#2196F3');
            importNext();
        }

        // Kreise Export/Import Funktionen
        function exportCirclesInArea() {
            log('=== Kreise Export ===');

            if (!radiusLayer || !radiusLayer.features || radiusLayer.features.length === 0) {
                updateStatusMessage(t('noCirclesToExport'), '#ff9800');
                return;
            }

            // Mercator zu WGS84 Konvertierung
            function mercatorToWgs84(x, y) {
                const lon = (x / 20037508.34) * 180;
                let lat = (y / 20037508.34) * 180;
                lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lon, lat];
            }

            const circles = [];

            for (const feature of radiusLayer.features) {
                if (!feature.geometry) continue;

                const geom = feature.geometry;
                const coords = [];

                if (geom.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
                    const ring = geom.components?.[0];
                    if (ring && ring.components) {
                        for (const point of ring.components) {
                            const [lon, lat] = mercatorToWgs84(point.x, point.y);
                            coords.push([lon, lat]);
                        }
                    }
                }

                if (coords.length > 0) {
                    // Berechne Mittelpunkt und Radius
                    const bounds = geom.getBounds();
                    const centerX = (bounds.left + bounds.right) / 2;
                    const centerY = (bounds.bottom + bounds.top) / 2;
                    const [centerLon, centerLat] = mercatorToWgs84(centerX, centerY);

                    // Radius in Metern berechnen
                    const startPoint = new uOpenLayers.Geometry.Point(centerX, centerY);
                    const endPoint = new uOpenLayers.Geometry.Point(bounds.right, centerY);
                    const radiusLine = new uOpenLayers.Geometry.LineString([startPoint, endPoint]);
                    const radiusMeters = radiusLine.getGeodesicLength(new uOpenLayers.Projection("EPSG:900913"));

                    circles.push({
                        type: 'circle',
                        center: [centerLon, centerLat],
                        radiusMeters: Math.round(radiusMeters),
                        coordinates: coords
                    });
                }
            }

            if (circles.length === 0) {
                updateStatusMessage(t('noCirclesToExport'), '#ff9800');
                return;
            }

            const exportData = {
                version: 1,
                type: 'circles',
                exportDate: new Date().toISOString(),
                circles: circles
            };

            try {
                const jsonStr = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `wme-circles-export-${new Date().toISOString().slice(0,10)}.json`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                updateStatusMessage(t('exportedCircles', circles.length), '#4CAF50');
                log(`✓ ${circles.length} Kreise exportiert`);
            } catch (err) {
                warn('Export Fehler:', err);
                updateStatusMessage('Export Fehler: ' + err.message, '#f44336');
            }
        }

        function importCirclesFromFile(file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    if (data.type === 'circles' && data.circles && Array.isArray(data.circles)) {
                        importCircles(data.circles);
                    } else {
                        updateStatusMessage('Ungültiges Dateiformat (keine Kreise)', '#f44336');
                    }
                } catch (err) {
                    warn('Import Fehler:', err);
                    updateStatusMessage('Fehler beim Lesen der Datei', '#f44336');
                }
            };

            reader.readAsText(file);
        }

        function importCircles(circleList) {
            if (circleList.length === 0) {
                updateStatusMessage('Keine Kreise zum Importieren', '#ff9800');
                return;
            }

            // WGS84 zu Mercator Konvertierung
            function wgs84ToMercator(lon, lat) {
                const x = lon * 20037508.34 / 180;
                let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
                y = y * 20037508.34 / 180;
                return [x, y];
            }

            let importedCount = 0;

            for (const circle of circleList) {
                try {
                    let points = [];

                    if (circle.coordinates && circle.coordinates.length > 0) {
                        // Verwende gespeicherte Koordinaten
                        for (const coord of circle.coordinates) {
                            const [mx, my] = wgs84ToMercator(coord[0], coord[1]);
                            points.push(new uOpenLayers.Geometry.Point(mx, my));
                        }
                    } else if (circle.center && circle.radiusMeters) {
                        // Erstelle Kreis aus Mittelpunkt und Radius
                        const steps = 100;
                        for (let i = 0; i <= steps; i++) {
                            const bearing = (i / steps) * 360;
                            const destPoint = destinationPoint(circle.center, circle.radiusMeters, bearing);
                            const [mx, my] = wgs84ToMercator(destPoint[0], destPoint[1]);
                            points.push(new uOpenLayers.Geometry.Point(mx, my));
                        }
                    }

                    if (points.length > 2) {
                        const ring = new uOpenLayers.Geometry.LinearRing(points);
                        const polygon = new uOpenLayers.Geometry.Polygon([ring]);
                        const feature = new uOpenLayers.Feature.Vector(polygon);
                        radiusLayer.addFeatures([feature]);
                        importedCount++;
                    }
                } catch (err) {
                    warn('Fehler beim Importieren eines Kreises:', err);
                }
            }

            if (radiusLayer.redraw) radiusLayer.redraw();

            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('updateAnnotations'));
            }, 100);

            updateStatusMessage(t('importedCircles', importedCount), '#4CAF50');
            log(`✓ ${importedCount} Kreise importiert`);
        }

        // GPX Import/Export Funktionen
        function exportSelectedAsGpx() {
            log('=== GPX Export ===');

            // Exportiere ausgewählte Segmente oder Segmente im Kreis
            const selectedSegments = uWaze.selectionManager?.getSelectedFeatures?.() || [];
            let segmentsToExport = [];

            if (selectedSegments.length > 0) {
                // Ausgewählte Segmente exportieren
                segmentsToExport = selectedSegments.filter(f => f?.model?.type === 'segment').map(f => f.model);
            } else if (radiusLayer?.features?.length > 0) {
                // Segmente im Kreis exportieren
                const allSegments = uWaze.model.segments.getObjectArray();
                for (const segment of allSegments) {
                    if (!segment?.attributes?.roadType) continue;
                    const segGeom = segment.getOLGeometry?.() || segment.geometry;
                    if (!segGeom) continue;

                    for (const drawnFeature of radiusLayer.features) {
                        if (drawnFeature.geometry.intersects(segGeom)) {
                            segmentsToExport.push(segment);
                            break;
                        }
                    }
                }
            }

            if (segmentsToExport.length === 0) {
                updateStatusMessage('Keine Segmente zum Exportieren', '#ff9800');
                return;
            }

            // GPX erstellen
            const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="WME Circles" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>WME Segments Export</name>
    <time>${new Date().toISOString()}</time>
  </metadata>`;

            let gpxTracks = '';

            // Mercator zu WGS84
            const toWGS84 = (x, y) => {
                const lon = x * 180 / 20037508.34;
                let lat = y * 180 / 20037508.34;
                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return { lon, lat };
            };

            for (const segment of segmentsToExport) {
                const streetName = getSegmentStreetName(segment) || 'Unbekannt';
                const segId = segment.attributes?.id || segment.getID?.();

                let coords = [];
                const geom = segment.getOLGeometry?.() || segment.geometry || segment.attributes?.geometry;

                if (geom?.components) {
                    coords = geom.components.map(c => toWGS84(c.x, c.y));
                } else if (geom?.coordinates) {
                    coords = geom.coordinates.map(c => ({ lon: c[0], lat: c[1] }));
                } else if (geom?.getVertices) {
                    coords = geom.getVertices().map(v => toWGS84(v.x, v.y));
                }

                if (coords.length > 0) {
                    gpxTracks += `
  <trk>
    <name>${streetName} (${segId})</name>
    <trkseg>`;
                    for (const c of coords) {
                        gpxTracks += `
      <trkpt lat="${c.lat.toFixed(7)}" lon="${c.lon.toFixed(7)}"/>`;
                    }
                    gpxTracks += `
    </trkseg>
  </trk>`;
                }
            }

            const gpxContent = gpxHeader + gpxTracks + '\n</gpx>';

            // Download
            const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wme-segments-${new Date().toISOString().slice(0,10)}.gpx`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            updateStatusMessage(t('exportedGpx') + ` (${segmentsToExport.length})`, '#4CAF50');
        }

        function getSegmentStreetName(segment) {
            if (!segment?.attributes) return null;
            const primaryStreet = segment.attributes.primaryStreetID;
            if (primaryStreet && uWaze?.model?.streets) {
                const street = uWaze.model.streets.getObjectById(primaryStreet);
                if (street?.attributes?.name) return street.attributes.name;
            }
            return segment.attributes.streetName || null;
        }

        function importGpxFile(file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const parser = new DOMParser();
                    const gpxDoc = parser.parseFromString(e.target.result, 'text/xml');

                    // Prüfe auf Parse-Fehler
                    const parseError = gpxDoc.querySelector('parsererror');
                    if (parseError) {
                        log('GPX Parse-Fehler: ' + parseError.textContent);
                        updateStatusMessage('GPX Parse-Fehler', '#f44336');
                        return;
                    }

                    // Extrahiere alle Track-Punkte und Route-Punkte
                    const points = [];

                    // Track Points (trkpt) - mit und ohne Namespace
                    let trkpts = gpxDoc.querySelectorAll('trkpt');
                    if (trkpts.length === 0) {
                        trkpts = gpxDoc.getElementsByTagNameNS('*', 'trkpt');
                    }
                    log(`GPX: ${trkpts.length} trkpt Elemente gefunden`);

                    for (const pt of trkpts) {
                        const lat = parseFloat(pt.getAttribute('lat'));
                        const lon = parseFloat(pt.getAttribute('lon'));
                        if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
                            points.push({ lat, lon });
                        }
                    }

                    // Route Points (rtept)
                    let rtepts = gpxDoc.querySelectorAll('rtept');
                    if (rtepts.length === 0) {
                        rtepts = gpxDoc.getElementsByTagNameNS('*', 'rtept');
                    }
                    log(`GPX: ${rtepts.length} rtept Elemente gefunden`);

                    for (const pt of rtepts) {
                        const lat = parseFloat(pt.getAttribute('lat'));
                        const lon = parseFloat(pt.getAttribute('lon'));
                        if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
                            points.push({ lat, lon });
                        }
                    }

                    // Waypoints (wpt)
                    let wpts = gpxDoc.querySelectorAll('wpt');
                    if (wpts.length === 0) {
                        wpts = gpxDoc.getElementsByTagNameNS('*', 'wpt');
                    }
                    log(`GPX: ${wpts.length} wpt Elemente gefunden`);

                    for (const pt of wpts) {
                        const lat = parseFloat(pt.getAttribute('lat'));
                        const lon = parseFloat(pt.getAttribute('lon'));
                        if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
                            points.push({ lat, lon });
                        }
                    }

                    if (points.length === 0) {
                        // Debug: Zeige XML-Struktur
                        log('GPX XML Root: ' + gpxDoc.documentElement?.tagName);
                        log('GPX XML Children: ' + Array.from(gpxDoc.documentElement?.children || []).map(c => c.tagName).join(', '));
                        updateStatusMessage('Keine Punkte in GPX gefunden', '#ff9800');
                        return;
                    }

                    // Debug: Erste 3 Punkte zeigen
                    log(`GPX: ${points.length} Punkte gefunden`);
                    if (points.length > 0) {
                        log(`GPX Erster Punkt: ${points[0].lat.toFixed(5)}, ${points[0].lon.toFixed(5)}`);
                    }

                    // Zur GPX-Position zoomen (Mittelpunkt der Punkte)
                    const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
                    const avgLon = points.reduce((s, p) => s + p.lon, 0) / points.length;

                    log(`GPX Zentrum: ${avgLat.toFixed(5)}, ${avgLon.toFixed(5)}`);

                    // Starte Auto-Scroll mit Kontrolle
                    startGpxAutoScroll(points);

                } catch (err) {
                    warn('GPX Import Fehler:', err);
                    updateStatusMessage('GPX Fehler: ' + err.message, '#f44336');
                }
            };

            reader.readAsText(file);
        }

        // GPX-Linie auf der Karte zeichnen
        function drawGpxLine(gpxPoints) {
            removeGpxLine(); // Alte Linie entfernen

            try {
                const OL = window.OpenLayers || window.OL;
                if (!OL || !uWaze?.map?.olMap) return;

                // Layer erstellen
                const layer = new OL.Layer.Vector('GPX Route', {
                    displayInLayerSwitcher: false,
                    uniqueName: 'rtcplus_gpx_route'
                });

                // Punkte in Mercator konvertieren
                const points = gpxPoints.map(p => {
                    const mercX = p.lon * 20037508.34 / 180;
                    const mercY = Math.log(Math.tan((90 + p.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;
                    return new OL.Geometry.Point(mercX, mercY);
                });

                // Linie erstellen
                const line = new OL.Geometry.LineString(points);
                const feature = new OL.Feature.Vector(line, {}, {
                    strokeColor: '#FF00FF',
                    strokeWidth: 4,
                    strokeOpacity: 0.7,
                    strokeDashstyle: 'dash'
                });

                layer.addFeatures([feature]);
                uWaze.map.olMap.addLayer(layer);

                gpxAutoScroll.gpxLayer = layer;
                log('GPX-Linie gezeichnet');
            } catch (e) {
                warn('GPX-Linie zeichnen fehlgeschlagen:', e);
            }
        }

        function removeGpxLine() {
            if (gpxAutoScroll.gpxLayer) {
                try {
                    uWaze.map.olMap.removeLayer(gpxAutoScroll.gpxLayer);
                    gpxAutoScroll.gpxLayer.destroy();
                } catch (e) {}
                gpxAutoScroll.gpxLayer = null;
            }
        }

        // GPX Auto-Scroll mit Benutzer-Kontrolle
        let gpxAutoScroll = {
            active: false,
            paused: false,
            gpxPoints: [],
            scrollPositions: [],
            currentIndex: 0,
            collectedSegmentIds: new Set(),
            timeoutId: null,
            gpxLayer: null
        };

        function startGpxAutoScroll(gpxPoints) {
            // GPX-Linie auf der Karte zeichnen
            drawGpxLine(gpxPoints);

            // Scroll-Positionen berechnen
            const scrollPositions = [];
            let lastLat = null, lastLon = null;
            const MIN_DISTANCE = 300; // 300m Schritte

            for (const p of gpxPoints) {
                if (lastLat === null) {
                    scrollPositions.push({ lat: p.lat, lon: p.lon });
                    lastLat = p.lat;
                    lastLon = p.lon;
                } else {
                    const R = 6371000;
                    const dLat = (p.lat - lastLat) * Math.PI / 180;
                    const dLon = (p.lon - lastLon) * Math.PI / 180;
                    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                              Math.cos(lastLat * Math.PI / 180) * Math.cos(p.lat * Math.PI / 180) *
                              Math.sin(dLon/2) * Math.sin(dLon/2);
                    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                    if (dist >= MIN_DISTANCE) {
                        scrollPositions.push({ lat: p.lat, lon: p.lon });
                        lastLat = p.lat;
                        lastLon = p.lon;
                    }
                }
            }

            // Letzten Punkt
            const lastPoint = gpxPoints[gpxPoints.length - 1];
            if (scrollPositions.length === 0 ||
                scrollPositions[scrollPositions.length-1].lat !== lastPoint.lat) {
                scrollPositions.push({ lat: lastPoint.lat, lon: lastPoint.lon });
            }

            gpxAutoScroll = {
                active: true,
                paused: false,
                gpxPoints: gpxPoints,
                scrollPositions: scrollPositions,
                currentIndex: 0,
                collectedSegmentIds: new Set(),
                timeoutId: null
            };

            log(`GPX Auto-Scroll: ${scrollPositions.length} Positionen`);

            // UI anzeigen
            showGpxAutoScrollUI();

            // Zoom setzen
            try {
                if (uWaze?.map?.olMap?.zoomTo) {
                    uWaze.map.olMap.zoomTo(17);
                }
            } catch (e) {}

            // Starten
            gpxScrollNext();
        }

        function gpxScrollNext() {
            if (!gpxAutoScroll.active) return;
            if (gpxAutoScroll.paused) return;

            const { scrollPositions, currentIndex, gpxPoints } = gpxAutoScroll;

            if (currentIndex >= scrollPositions.length) {
                // Fertig!
                finishGpxAutoScroll();
                return;
            }

            const pos = scrollPositions[currentIndex];

            // Zur Position scrollen
            try {
                const mercX = pos.lon * 20037508.34 / 180;
                const mercY = Math.log(Math.tan((90 + pos.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

                if (uWaze?.map?.setCenter) {
                    uWaze.map.setCenter({ lon: mercX, lat: mercY });
                }
            } catch (e) {}

            // UI aktualisieren
            updateGpxAutoScrollUI();

            // Segmente sammeln nach kurzer Wartezeit
            gpxAutoScroll.timeoutId = setTimeout(() => {
                // Segmente matchen
                const matches = matchGpxToSegmentsLocal(gpxPoints);
                const newSegments = [];

                for (const seg of matches) {
                    const segId = seg.attributes?.id || seg.getID?.();
                    if (segId && !gpxAutoScroll.collectedSegmentIds.has(segId)) {
                        gpxAutoScroll.collectedSegmentIds.add(segId);
                        newSegments.push(seg);
                    }
                }

                // INKREMENTELL zur Auswahl hinzufügen (nicht ersetzen!)
                if (newSegments.length > 0) {
                    try {
                        const currentSelection = uWaze.selectionManager.getSelectedFeatures() || [];
                        const currentSegments = currentSelection
                            .filter(f => f?.model?.type === 'segment')
                            .map(f => f.model);

                        // Neue Segmente zur bestehenden Auswahl hinzufügen
                        const combinedSelection = [...currentSegments, ...newSegments];
                        uWaze.selectionManager.setSelectedModels(combinedSelection);
                    } catch (e) {
                        // Fallback: Nur neue Segmente auswählen
                        try {
                            const current = uWaze.selectionManager.getSelectedDataModelObjects?.() || [];
                            uWaze.selectionManager.setSelectedModels([...current, ...newSegments]);
                        } catch (e2) {}
                    }
                }

                // UI aktualisieren
                updateGpxAutoScrollUI();

                // Nächste Position
                gpxAutoScroll.currentIndex++;
                gpxScrollNext();

            }, 800); // 800ms pro Position für zuverlässiges Laden
        }

        function showGpxAutoScrollUI() {
            let ui = document.getElementById('gpx-autoscroll-ui');
            if (ui) ui.remove();

            ui = document.createElement('div');
            ui.id = 'gpx-autoscroll-ui';
            ui.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.92);
                color: white;
                padding: 12px 16px;
                border-radius: 10px;
                z-index: 99999;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                min-width: 380px;
            `;

            document.body.appendChild(ui);
            updateGpxAutoScrollUI();
        }

        function updateGpxAutoScrollUI() {
            const ui = document.getElementById('gpx-autoscroll-ui');
            if (!ui) return;

            const { scrollPositions, currentIndex, collectedSegmentIds, paused } = gpxAutoScroll;
            const total = scrollPositions.length;
            const percent = total > 0 ? Math.round((currentIndex / total) * 100) : 0;

            // Zähle aktuell ausgewählte Segmente
            let selectedCount = 0;
            try {
                const selection = uWaze.selectionManager.getSelectedFeatures() || [];
                selectedCount = selection.filter(f => f?.model?.type === 'segment').length;
            } catch (e) {
                selectedCount = collectedSegmentIds.size;
            }

            ui.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 13px; font-weight: bold;">🗺️ GPX Import</span>
                            <span style="font-size: 12px; color: #aaa;">${currentIndex}/${total}</span>
                        </div>
                        <div style="background: #333; border-radius: 4px; height: 8px; overflow: hidden;">
                            <div style="background: #4CAF50; height: 100%; width: ${percent}%; transition: width 0.2s;"></div>
                        </div>
                    </div>
                    <div style="text-align: center; min-width: 70px;">
                        <div style="font-size: 18px; font-weight: bold; color: #4CAF50;">${selectedCount}</div>
                        <div style="font-size: 9px; color: #888;">ausgewählt</div>
                    </div>
                    <button id="gpx-pause-btn" style="background: ${paused ? '#4CAF50' : '#ff9800'}; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;" title="${paused ? 'Fortsetzen' : 'Pause'}">
                        ${paused ? '▶' : '⏸'}
                    </button>
                    <button id="gpx-stop-btn" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 14px;" title="Beenden & Auswählen">
                        ✓
                    </button>
                    <button id="gpx-cancel-btn" style="background: #666; color: white; border: none; padding: 8px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;" title="Abbrechen">
                        ✕
                    </button>
                </div>
            `;

            // Event Listener
            document.getElementById('gpx-pause-btn')?.addEventListener('click', toggleGpxPause);
            document.getElementById('gpx-stop-btn')?.addEventListener('click', finishGpxAutoScroll);
            document.getElementById('gpx-cancel-btn')?.addEventListener('click', cancelGpxAutoScroll);
        }

        function toggleGpxPause() {
            gpxAutoScroll.paused = !gpxAutoScroll.paused;

            if (!gpxAutoScroll.paused) {
                // Fortsetzen
                gpxScrollNext();
            }

            updateGpxAutoScrollUI();
        }

        function finishGpxAutoScroll() {
            if (gpxAutoScroll.timeoutId) {
                clearTimeout(gpxAutoScroll.timeoutId);
            }

            const collectedIds = gpxAutoScroll.collectedSegmentIds;
            const gpxPoints = gpxAutoScroll.gpxPoints;

            log(`GPX Auto-Scroll Sammlung beendet: ${collectedIds.size} Segment-IDs`);

            if (collectedIds.size === 0) {
                const ui = document.getElementById('gpx-autoscroll-ui');
                if (ui) ui.remove();
                gpxAutoScroll.active = false;
                updateStatusMessage(t('gpxNoSegments'), '#ff9800');
                return;
            }

            // PRUNE: Finde den optimalen Pfad durch die gesammelten Segmente
            updateGpxAutoScrollUIText('Berechne optimale Route...');

            setTimeout(() => {
                const prunedIds = pruneSegmentIds(collectedIds, gpxPoints);
                log(`GPX Prune: ${prunedIds.length} Segmente auf optimalem Pfad`);

                // WICHTIG: Speichere IDs SOFORT global für Brush-Modus
                window._gpxSegmentIds = new Set(prunedIds);
                log(`GPX: ${window._gpxSegmentIds.size} Segment-IDs global gespeichert`);

                // Speichere für Auswahl-Durchgang
                gpxAutoScroll.prunedIds = prunedIds;
                gpxAutoScroll.currentIndex = 0;

                // Starte Auswahl-Durchgang
                updateGpxAutoScrollUIText('Wähle Segmente aus...');
                selectPrunedSegments();
            }, 100);
        }

        function updateGpxAutoScrollUIText(text) {
            const ui = document.getElementById('gpx-autoscroll-ui');
            if (ui) {
                const titleSpan = ui.querySelector('span');
                if (titleSpan) titleSpan.textContent = '🗺️ ' + text;
            }
        }

        // PRUNE: Bilde eine Kette entlang der GPX-Route, entferne tote Arme
        function pruneSegmentIds(collectedIds, gpxPoints) {
            const segments = uWaze.model.segments.getObjectArray();

            // Sammle Segment-Daten mit GPX-Position
            const segmentMap = new Map();
            for (const seg of segments) {
                const id = seg.attributes?.id || seg.getID?.();
                if (!id || !collectedIds.has(id)) continue;

                const coords = getSegmentCoordsWGS84(seg);
                if (!coords || coords.length < 2) continue;

                // Berechne GPX-Position (wo auf der GPX-Linie liegt dieses Segment)
                const midPt = { lat: coords[Math.floor(coords.length/2)][1], lon: coords[Math.floor(coords.length/2)][0] };
                const gpxPos = findGpxPosition(midPt, gpxPoints);

                segmentMap.set(id, {
                    id: id,
                    coords: coords,
                    fromNode: seg.attributes?.fromNodeID,
                    toNode: seg.attributes?.toNodeID,
                    gpxPos: gpxPos
                });
            }

            if (segmentMap.size === 0) return [...collectedIds];

            // Baue Node-zu-Segment Index
            const nodeToSegs = new Map();
            for (const [id, sd] of segmentMap) {
                if (sd.fromNode) {
                    if (!nodeToSegs.has(sd.fromNode)) nodeToSegs.set(sd.fromNode, []);
                    nodeToSegs.get(sd.fromNode).push(sd);
                }
                if (sd.toNode) {
                    if (!nodeToSegs.has(sd.toNode)) nodeToSegs.set(sd.toNode, []);
                    nodeToSegs.get(sd.toNode).push(sd);
                }
            }

            // Sortiere alle Segmente nach GPX-Position
            const sortedSegs = [...segmentMap.values()].sort((a, b) => a.gpxPos - b.gpxPos);

            // Finde Start-Segment (niedrigste GPX-Position)
            const startSeg = sortedSegs[0];
            if (!startSeg) return [...collectedIds];

            // Bestimme Start-Node (der Node der NICHT in GPX-Richtung zeigt)
            const startCoord = startSeg.coords[0];
            const endCoord = startSeg.coords[startSeg.coords.length - 1];
            const startGpxPos = findGpxPosition({ lat: startCoord[1], lon: startCoord[0] }, gpxPoints);
            const endGpxPos = findGpxPosition({ lat: endCoord[1], lon: endCoord[0] }, gpxPoints);

            // currentNode ist der Exit-Node (höhere GPX-Position)
            let currentNode = startGpxPos < endGpxPos ? startSeg.toNode : startSeg.fromNode;

            // Baue Kette
            const chain = [startSeg.id];
            const usedIds = new Set([startSeg.id]);
            let lastGpxPos = startSeg.gpxPos;

            for (let step = 0; step < 2000; step++) {
                // Finde nächstes Segment über currentNode
                const candidates = nodeToSegs.get(currentNode) || [];
                let bestNext = null;
                let bestScore = -Infinity;

                for (const cand of candidates) {
                    if (usedIds.has(cand.id)) continue;

                    // Score basiert auf:
                    // 1. GPX-Position muss vorwärts sein (höher als lastGpxPos)
                    // 2. Aber nicht zu weit springen
                    const posDiff = cand.gpxPos - lastGpxPos;

                    // Muss vorwärts sein (oder minimal rückwärts für Kurven)
                    if (posDiff < -50) continue; // Nicht mehr als 50m zurück

                    // Score: Vorwärts ist gut, aber nicht zu weit springen
                    let score = 100;
                    if (posDiff > 0 && posDiff < 500) {
                        score = 200 - posDiff * 0.1; // Nähere Segmente bevorzugen
                    } else if (posDiff >= 500) {
                        score = 50; // Weite Sprünge sind schlecht
                    }

                    if (score > bestScore) {
                        bestScore = score;
                        bestNext = cand;
                    }
                }

                if (!bestNext) {
                    // Keine direkte Verbindung - versuche Lücke zu überbrücken
                    // Suche das nächste Segment auf der GPX-Linie das noch nicht verwendet wurde
                    let nextOnGpx = null;
                    let minPosDiff = Infinity;

                    for (const sd of sortedSegs) {
                        if (usedIds.has(sd.id)) continue;
                        const posDiff = sd.gpxPos - lastGpxPos;
                        if (posDiff > 0 && posDiff < minPosDiff) {
                            minPosDiff = posDiff;
                            nextOnGpx = sd;
                        }
                    }

                    if (nextOnGpx && minPosDiff < 200) {
                        // Springe zum nächsten Segment (Lücke akzeptieren)
                        bestNext = nextOnGpx;
                        log(`GPX Prune: Lücke übersprungen (${Math.round(minPosDiff)}m)`);
                    } else {
                        break; // Keine Fortsetzung möglich
                    }
                }

                // Füge Segment hinzu
                chain.push(bestNext.id);
                usedIds.add(bestNext.id);
                lastGpxPos = bestNext.gpxPos;

                // Update currentNode
                if (bestNext.fromNode === currentNode) {
                    currentNode = bestNext.toNode;
                } else {
                    currentNode = bestNext.fromNode;
                }

                // Sind wir am Ende der GPX-Linie?
                const gpxTotalLen = gpxPoints.length > 1 ?
                    findGpxPosition(gpxPoints[gpxPoints.length-1], gpxPoints) : 0;
                if (lastGpxPos >= gpxTotalLen * 0.95) {
                    break;
                }
            }

            log(`GPX Prune: Kette mit ${chain.length} Segmenten (von ${segmentMap.size} geflooded)`);
            return chain;
        }

        // Finde Position auf GPX-Linie (kumulative Distanz in Metern)
        function findGpxPosition(pt, gpxPoints) {
            let cumDist = 0;
            let bestDist = Infinity;
            let bestPos = 0;

            for (let i = 0; i < gpxPoints.length - 1; i++) {
                const segLen = haversineDistance(
                    gpxPoints[i].lat, gpxPoints[i].lon,
                    gpxPoints[i+1].lat, gpxPoints[i+1].lon
                );

                // Projektion auf dieses Segment
                const proj = projectPointToSegment(
                    pt.lat, pt.lon,
                    gpxPoints[i].lat, gpxPoints[i].lon,
                    gpxPoints[i+1].lat, gpxPoints[i+1].lon
                );

                if (proj.dist < bestDist) {
                    bestDist = proj.dist;
                    bestPos = cumDist + proj.t * segLen;
                }

                cumDist += segLen;
            }

            return bestPos;
        }

        // Projiziere Punkt auf Liniensegment
        function projectPointToSegment(pLat, pLon, aLat, aLon, bLat, bLon) {
            const dLat = bLat - aLat;
            const dLon = bLon - aLon;
            const lenSq = dLat * dLat + dLon * dLon;

            let t = 0;
            if (lenSq > 0) {
                t = Math.max(0, Math.min(1, ((pLat - aLat) * dLat + (pLon - aLon) * dLon) / lenSq));
            }

            const projLat = aLat + t * dLat;
            const projLon = aLon + t * dLon;

            return {
                t: t,
                dist: haversineDistance(pLat, pLon, projLat, projLon)
            };
        }

        // Distanz von Punkt zu Segment (für Flood-Matching)
        function distToSegment(pt, coords) {
            let minD = Infinity;
            for (let i = 0; i < coords.length - 1; i++) {
                const d = pointToLineDist(pt.lat, pt.lon, coords[i][1], coords[i][0], coords[i+1][1], coords[i+1][0]);
                if (d < minD) minD = d;
            }
            return minD;
        }

        function pointToLineDist(pLat, pLon, aLat, aLon, bLat, bLon) {
            const dLat = bLat - aLat, dLon = bLon - aLon;
            const lenSq = dLat * dLat + dLon * dLon;
            const t = lenSq > 0 ? Math.max(0, Math.min(1, ((pLat - aLat) * dLat + (pLon - aLon) * dLon) / lenSq)) : 0;
            return haversineDistance(pLat, pLon, aLat + t * dLat, aLon + t * dLon);
        }

        function pointToSegmentDistanceSimple(point, coords) {
            let minDist = Infinity;
            for (let i = 0; i < coords.length - 1; i++) {
                const dist = pointToLineDistSimple(
                    point.lat, point.lon,
                    coords[i][1], coords[i][0],
                    coords[i+1][1], coords[i+1][0]
                );
                if (dist < minDist) minDist = dist;
            }
            return minDist;
        }

        function pointToLineDistSimple(pLat, pLon, aLat, aLon, bLat, bLon) {
            const dLat = bLat - aLat;
            const dLon = bLon - aLon;
            const lenSq = dLat * dLat + dLon * dLon;
            let t = lenSq > 0 ? Math.max(0, Math.min(1, ((pLat - aLat) * dLat + (pLon - aLon) * dLon) / lenSq)) : 0;
            const projLat = aLat + t * dLat;
            const projLon = aLon + t * dLon;
            return haversineDistance(pLat, pLon, projLat, projLon);
        }

        // Auswahl-Durchgang: Scrolle nochmal und wähle die geprunten Segmente aus
        function selectPrunedSegments() {
            const { scrollPositions, currentIndex, prunedIds } = gpxAutoScroll;

            if (currentIndex >= scrollPositions.length) {
                // Fertig!
                finishGpxSelection();
                return;
            }

            const pos = scrollPositions[currentIndex];

            // Scrollen
            try {
                const mercX = pos.lon * 20037508.34 / 180;
                const mercY = Math.log(Math.tan((90 + pos.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;
                uWaze.map.setCenter({ lon: mercX, lat: mercY });
            } catch (e) {}

            // UI Update
            const ui = document.getElementById('gpx-autoscroll-ui');
            if (ui) {
                const total = scrollPositions.length;
                const percent = Math.round((currentIndex / total) * 100);
                const progressDiv = ui.querySelector('div > div > div:nth-child(2)');
                if (progressDiv) {
                    progressDiv.innerHTML = `<div style="background: #2196F3; height: 100%; width: ${percent}%;"></div>`;
                }
            }

            // Warte und wähle Segmente
            gpxAutoScroll.timeoutId = setTimeout(() => {
                // Finde und wähle Segmente
                const prunedSet = new Set(prunedIds);
                const segments = uWaze.model.segments.getObjectArray();
                const toAdd = [];

                for (const seg of segments) {
                    const id = seg.attributes?.id || seg.getID?.();
                    if (prunedSet.has(id)) {
                        toAdd.push(seg);
                    }
                }

                if (toAdd.length > 0) {
                    try {
                        const current = uWaze.selectionManager.getSelectedFeatures() || [];
                        const currentSegs = current.filter(f => f?.model?.type === 'segment').map(f => f.model);
                        const currentIds = new Set(currentSegs.map(s => s.attributes?.id));
                        const newSegs = toAdd.filter(s => !currentIds.has(s.attributes?.id));
                        if (newSegs.length > 0) {
                            uWaze.selectionManager.setSelectedModels([...currentSegs, ...newSegs]);
                        }
                    } catch (e) {}
                }

                gpxAutoScroll.currentIndex++;
                selectPrunedSegments();
            }, 500);
        }

        function finishGpxSelection() {
            const ui = document.getElementById('gpx-autoscroll-ui');
            if (ui) ui.remove();

            gpxAutoScroll.active = false;

            // Zähle ausgewählte Segmente
            let count = 0;
            try {
                const sel = uWaze.selectionManager.getSelectedFeatures() || [];
                count = sel.filter(f => f?.model?.type === 'segment').length;
            } catch (e) {}

            if (count > 0) {
                updateStatusMessage(t('importedGpx', count), '#4CAF50');
            } else {
                updateStatusMessage('Segmente konnten nicht ausgewählt werden', '#ff9800');
            }

            // GPX-Linie nach kurzer Zeit entfernen
            setTimeout(() => removeGpxLine(), 5000);
        }

        function showGpxFinishedUI(totalSegments) {
            let ui = document.getElementById('gpx-finished-ui');
            if (ui) ui.remove();

            ui = document.createElement('div');
            ui.id = 'gpx-finished-ui';
            ui.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 10px 14px;
                border-radius: 8px;
                z-index: 99999;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            `;

            ui.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 12px;">🗺️ GPX: ${totalSegments} Segmente</span>
                    <button id="gpx-reselect-btn" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;" title="Segmente im aktuellen Bereich auswählen">
                        Auswählen
                    </button>
                    <button id="gpx-clear-btn" style="background: #666; color: white; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;" title="GPX-Linie entfernen">
                        ✕
                    </button>
                </div>
            `;

            document.body.appendChild(ui);

            document.getElementById('gpx-reselect-btn')?.addEventListener('click', () => {
                reselectGpxSegments();
            });

            document.getElementById('gpx-clear-btn')?.addEventListener('click', () => {
                removeGpxLine();
                ui.remove();
                window._gpxSegmentIds = null;
            });
        }

        function reselectGpxSegments() {
            const segmentIds = window._gpxSegmentIds;
            if (!segmentIds || segmentIds.size === 0) {
                updateStatusMessage('Keine GPX-Segmente gespeichert', '#ff9800');
                return;
            }

            const segments = uWaze.model.segments.getObjectArray();
            const toSelect = segments.filter(seg => {
                const segId = seg.attributes?.id || seg.getID?.();
                return segId && segmentIds.has(segId);
            });

            if (toSelect.length > 0) {
                // Zur bestehenden Auswahl hinzufügen
                try {
                    const currentSelection = uWaze.selectionManager.getSelectedFeatures() || [];
                    const currentSegments = currentSelection
                        .filter(f => f?.model?.type === 'segment')
                        .map(f => f.model);

                    const existingIds = new Set(currentSegments.map(s => s.attributes?.id || s.getID?.()));
                    const newSegments = toSelect.filter(s => {
                        const id = s.attributes?.id || s.getID?.();
                        return !existingIds.has(id);
                    });

                    uWaze.selectionManager.setSelectedModels([...currentSegments, ...newSegments]);
                    updateStatusMessage(`+${newSegments.length} Segmente ausgewählt`, '#4CAF50');
                } catch (e) {
                    uWaze.selectionManager.setSelectedModels(toSelect);
                    updateStatusMessage(`${toSelect.length} Segmente ausgewählt`, '#4CAF50');
                }
            } else {
                updateStatusMessage('Keine passenden Segmente im Bereich', '#ff9800');
            }
        }

        function cancelGpxAutoScroll() {
            if (gpxAutoScroll.timeoutId) {
                clearTimeout(gpxAutoScroll.timeoutId);
            }

            gpxAutoScroll.active = false;

            // GPX-Linie entfernen
            removeGpxLine();

            const ui = document.getElementById('gpx-autoscroll-ui');
            if (ui) ui.remove();

            updateStatusMessage('GPX Import abgebrochen', '#ff9800');
        }

        // Lokales Matching ohne UI-Update (für Auto-Scroll)
        // LÄNGENBASIERTER ANSATZ: Segment muss signifikante Strecke entlang GPX abdecken
        function matchGpxToSegmentsLocal(gpxPoints) {
            if (!uWaze?.model?.segments) return [];
            if (gpxPoints.length < 2) return [];

            const segments = uWaze.model.segments.getObjectArray();
            const MAX_DISTANCE = 15; // 15 Meter maximale Abweichung

            // Filtere gültige Segmente
            const validSegments = segments.filter(seg => {
                if (!seg?.attributes) return false;
                if (seg.isDeleted?.()) return false;
                const roadType = seg.attributes.roadType;
                return roadType && [1, 2, 3, 4, 6, 7, 17, 20, 21].includes(roadType);
            });

            if (validSegments.length === 0) return [];

            // Berechne GPX-Gesamtlänge und erstelle Lookup für schnelle Distanzprüfung
            let gpxTotalLength = 0;
            const gpxCumDist = [0];
            for (let i = 1; i < gpxPoints.length; i++) {
                const d = haversineDistance(
                    gpxPoints[i-1].lat, gpxPoints[i-1].lon,
                    gpxPoints[i].lat, gpxPoints[i].lon
                );
                gpxTotalLength += d;
                gpxCumDist.push(gpxTotalLength);
            }

            const matchedSegments = [];

            for (const seg of validSegments) {
                const segCoordsWGS = getSegmentCoordsWGS84(seg);
                if (!segCoordsWGS || segCoordsWGS.length < 2) continue;

                // Finde Start- und End-Position des Segments auf der GPX-Linie
                let minGpxPos = Infinity;
                let maxGpxPos = -Infinity;
                let allPointsClose = true;

                for (const segPt of segCoordsWGS) {
                    // Finde nächsten Punkt auf GPX-Linie und dessen Position
                    let bestDist = Infinity;
                    let bestGpxPos = -1;

                    for (let i = 0; i < gpxPoints.length - 1; i++) {
                        const result = pointToLineWithPosition(
                            segPt[1], segPt[0],
                            gpxPoints[i].lat, gpxPoints[i].lon,
                            gpxPoints[i+1].lat, gpxPoints[i+1].lon,
                            gpxCumDist[i], gpxCumDist[i+1]
                        );

                        if (result.dist < bestDist) {
                            bestDist = result.dist;
                            bestGpxPos = result.position;
                        }
                    }

                    if (bestDist > MAX_DISTANCE) {
                        allPointsClose = false;
                        break;
                    }

                    if (bestGpxPos < minGpxPos) minGpxPos = bestGpxPos;
                    if (bestGpxPos > maxGpxPos) maxGpxPos = bestGpxPos;
                }

                if (!allPointsClose) continue;

                // Berechne wie viel GPX-Strecke das Segment abdeckt
                const gpxCoverage = maxGpxPos - minGpxPos;

                // Berechne Segment-Länge
                let segLength = 0;
                for (let i = 1; i < segCoordsWGS.length; i++) {
                    segLength += haversineDistance(
                        segCoordsWGS[i-1][1], segCoordsWGS[i-1][0],
                        segCoordsWGS[i][1], segCoordsWGS[i][0]
                    );
                }

                // KRITISCH: Die GPX-Abdeckung muss mindestens 50% der Segment-Länge sein
                // Das filtert Segmente die quer zur Route liegen
                const coverageRatio = gpxCoverage / Math.max(segLength, 1);

                if (coverageRatio < 0.5) continue;

                // Zusätzlich: Segment muss mindestens 10m GPX-Strecke abdecken
                // (filtert sehr kurze Kreuzungssegmente)
                if (gpxCoverage < 10 && segLength > 20) continue;

                matchedSegments.push({
                    segment: seg,
                    gpxCoverage: gpxCoverage,
                    segLength: segLength,
                    coverageRatio: coverageRatio,
                    startPos: minGpxPos,
                    endPos: maxGpxPos
                });
            }

            // Sortiere nach GPX-Position (von Start nach Ende)
            matchedSegments.sort((a, b) => a.startPos - b.startPos);

            console.log(`[WME RTC Plus] GPX Length-Based: ${gpxPoints.length} Punkte → ${matchedSegments.length} Segmente`);

            return matchedSegments.map(m => m.segment);
        }

        // Punkt-zu-Linie mit Position auf der Linie
        function pointToLineWithPosition(pLat, pLon, aLat, aLon, bLat, bLon, aPos, bPos) {
            const dLat = bLat - aLat;
            const dLon = bLon - aLon;
            const lengthSq = dLat * dLat + dLon * dLon;

            let t = 0;
            if (lengthSq > 0) {
                t = Math.max(0, Math.min(1, ((pLat - aLat) * dLat + (pLon - aLon) * dLon) / lengthSq));
            }

            const projLat = aLat + t * dLat;
            const projLon = aLon + t * dLon;

            return {
                dist: haversineDistance(pLat, pLon, projLat, projLon),
                position: aPos + t * (bPos - aPos)
            };
        }

        // Finde ein Verbindungssegment zwischen zwei nicht direkt verbundenen Segmenten
        function findBridgeSegment(segA, segB, segmentsByNode, excludeIds) {
            const aFromNode = segA.attributes?.fromNodeID;
            const aToNode = segA.attributes?.toNodeID;
            const bFromNode = segB.attributes?.fromNodeID;
            const bToNode = segB.attributes?.toNodeID;

            // Suche Segmente die beide verbinden können
            const aNodes = [aFromNode, aToNode].filter(n => n);
            const bNodes = [bFromNode, bToNode].filter(n => n);

            for (const aNode of aNodes) {
                const connectedToA = segmentsByNode.get(aNode) || [];
                for (const bridge of connectedToA) {
                    const bridgeId = bridge.attributes?.id || bridge.getID?.();
                    if (excludeIds.has(bridgeId)) continue;

                    const bridgeFrom = bridge.attributes?.fromNodeID;
                    const bridgeTo = bridge.attributes?.toNodeID;

                    // Prüfe ob dieses Segment auch mit B verbunden ist
                    if (bNodes.includes(bridgeFrom) || bNodes.includes(bridgeTo)) {
                        return bridge;
                    }
                }
            }

            return null;
        }

        // Bestimme welcher Node der Exit-Node ist basierend auf GPX-Richtung
        function determineExitNode(segment, currentPoint, gpxPoints, currentIndex) {
            const fromNode = segment.attributes?.fromNodeID;
            const toNode = segment.attributes?.toNodeID;

            if (!fromNode || !toNode) return null;

            // Hole Segment-Koordinaten
            const segCoords = getSegmentCoordsWGS84(segment);
            if (!segCoords || segCoords.length < 2) return toNode;

            // Segment Start und Ende
            const segStart = segCoords[0];
            const segEnd = segCoords[segCoords.length - 1];

            // Finde nächsten GPX-Punkt (Richtung)
            let nextPoint = null;
            for (let i = currentIndex + 1; i < Math.min(currentIndex + 10, gpxPoints.length); i++) {
                const dist = haversineDistance(currentPoint.lat, currentPoint.lon, gpxPoints[i].lat, gpxPoints[i].lon);
                if (dist > 20) { // Mindestens 20m entfernt
                    nextPoint = gpxPoints[i];
                    break;
                }
            }

            if (!nextPoint) return toNode;

            // Welches Ende ist näher am nächsten GPX-Punkt?
            const distToStart = haversineDistance(nextPoint.lat, nextPoint.lon, segStart[1], segStart[0]);
            const distToEnd = haversineDistance(nextPoint.lat, nextPoint.lon, segEnd[1], segEnd[0]);

            // Der Exit-Node ist der, der näher am nächsten GPX-Punkt ist
            // Normalerweise: fromNode = Start, toNode = Ende
            return (distToEnd < distToStart) ? toNode : fromNode;
        }

        // Präzise Distanzberechnung wie im Hausnummern-Script mit OpenLayers
        function getDistanceToSegmentPrecise(point, segment) {
            try {
                // Versuche OpenLayers distanceTo für präzise Berechnung
                if (uOpenLayers?.Geometry?.Point && typeof segment.getOLGeometry === 'function') {
                    // GPX-Punkt zu Web Mercator konvertieren
                    const mercX = point.lon * 20037508.34 / 180;
                    const mercY = Math.log(Math.tan((90 + point.lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

                    const olPoint = new uOpenLayers.Geometry.Point(mercX, mercY);
                    const segOLGeom = segment.getOLGeometry();

                    if (segOLGeom) {
                        const distResult = olPoint.distanceTo(segOLGeom, { details: true });
                        if (distResult && distResult.x1 !== undefined && distResult.y1 !== undefined) {
                            // Konvertiere zurück zu WGS84 für Haversine-Distanz
                            const closestLon = distResult.x1 * 180 / 20037508.34;
                            let closestLat = distResult.y1 * 180 / 20037508.34;
                            closestLat = 180 / Math.PI * (2 * Math.atan(Math.exp(closestLat * Math.PI / 180)) - Math.PI / 2);

                            return haversineDistance(point.lat, point.lon, closestLat, closestLon);
                        }
                    }
                }
            } catch (e) {
                // Fallback auf manuelle Berechnung
            }

            // Fallback: Manuelle WGS84 Distanzberechnung
            return getDistanceToSegmentFast(point, segment);
        }

        // Berechne Bearing zwischen zwei Punkten
        function calculateBearing(lat1, lon1, lat2, lon2) {
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const lat1Rad = lat1 * Math.PI / 180;
            const lat2Rad = lat2 * Math.PI / 180;

            const y = Math.sin(dLon) * Math.cos(lat2Rad);
            const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

            let bearing = Math.atan2(y, x) * 180 / Math.PI;
            return (bearing + 360) % 360; // Normalisiere zu 0-360°
        }

        // Berechne Bearing eines Segments
        function getSegmentBearing(segment) {
            const segCoords = getSegmentCoordsWGS84(segment);
            if (!segCoords || segCoords.length < 2) return null;

            const start = segCoords[0];
            const end = segCoords[segCoords.length - 1];

            return calculateBearing(start[1], start[0], end[1], end[0]);
        }

        // Schnelle Distanzberechnung (Fallback)
        function getDistanceToSegmentFast(point, seg) {
            const segCoords = getSegmentCoordsWGS84(seg);
            if (!segCoords || segCoords.length < 2) return Infinity;

            let minDist = Infinity;
            for (let j = 0; j < segCoords.length - 1; j++) {
                const d = pointToSegmentHaversine(
                    point.lon, point.lat,
                    segCoords[j][0], segCoords[j][1],
                    segCoords[j+1][0], segCoords[j+1][1]
                );
                if (d < minDist) minDist = d;
            }
            return minDist;
        }

        // Haversine Distanz in Metern
        function haversineDistance(lat1, lon1, lat2, lon2) {
            const R = 6371000; // Erdradius in Metern
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        }

        // Punkt-zu-Segment Distanz mit Haversine (wie im Hausnummern-Script)
        function pointToSegmentHaversine(px, py, ax, ay, bx, by) {
            const dx = bx - ax;
            const dy = by - ay;
            const lengthSq = dx * dx + dy * dy;

            let t = 0;
            if (lengthSq > 0) {
                t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
            }

            const projX = ax + t * dx;
            const projY = ay + t * dy;

            return haversineDistance(py, px, projY, projX);
        }

        // Einfache Distanzberechnung: Punkt zu Liniensegment in Metern
        function distPointToSegment(px, py, x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const lenSq = dx * dx + dy * dy;

            let t = 0;
            if (lenSq > 0) {
                t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
                t = Math.max(0, Math.min(1, t));
            }

            const nearestX = x1 + t * dx;
            const nearestY = y1 + t * dy;

            // Haversine-ähnliche Distanz in Metern
            const dLon = (px - nearestX) * 111320 * Math.cos(py * Math.PI / 180);
            const dLat = (py - nearestY) * 110540;

            return Math.sqrt(dLon * dLon + dLat * dLat);
        }

        function matchGpxToSegments(gpxPoints) {
            if (!uWaze?.model?.segments) {
                updateStatusMessage('Keine Segmente verfügbar', '#f44336');
                return;
            }

            const segments = uWaze.model.segments.getObjectArray();
            log(`GPX Matching: ${gpxPoints.length} Punkte, ${segments.length} Segmente verfügbar`);

            if (segments.length === 0) {
                updateStatusMessage('Keine Segmente geladen - bitte näher zoomen', '#f44336');
                return;
            }

            // Verwende die verbesserte lokale Matching-Funktion
            const matchedSegments = matchGpxToSegmentsLocal(gpxPoints);

            log(`GPX: ${matchedSegments.length} Segmente gematcht`);

            if (matchedSegments.length === 0) {
                updateStatusMessage(t('gpxNoSegments') + ` (${gpxPoints.length} Punkte)`, '#ff9800');
                return;
            }

            const segmentArray = matchedSegments;
            uWaze.selectionManager.setSelectedModels(segmentArray);

            updateStatusMessage(t('importedGpx', matchedSegments.size), '#4CAF50');
        }

        // Winkel auf -180 bis 180 normalisieren
        function normalizeAngle(angle) {
            while (angle > 180) angle -= 360;
            while (angle < -180) angle += 360;
            return angle;
        }

        // Segment-Koordinaten in WGS84 extrahieren
        function getSegmentCoordsWGS84(segment) {
            const geom = segment.getOLGeometry?.() || segment.geometry || segment.attributes?.geometry;
            if (!geom) return null;

            const toWGS84 = (x, y) => {
                if (Math.abs(x) <= 180 && Math.abs(y) <= 90) return [x, y];
                const lon = x * 180 / 20037508.34;
                let lat = y * 180 / 20037508.34;
                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lon, lat];
            };

            let coords = [];

            if (geom.components && geom.components.length > 0) {
                coords = geom.components.map(c => toWGS84(c.x, c.y));
            } else if (geom.getVertices) {
                coords = geom.getVertices().map(v => toWGS84(v.x, v.y));
            } else if (geom.coordinates && Array.isArray(geom.coordinates)) {
                if (Array.isArray(geom.coordinates[0])) {
                    coords = geom.coordinates.map(c => [c[0], c[1]]);
                }
            }

            return coords.length >= 2 ? coords : null;
        }

        // Robuste Distanz-Berechnung zu einem Segment
        function getDistanceToSegment(pointLon, pointLat, segment) {
            // Methode 1: OpenLayers distanceTo (präziseste Methode)
            try {
                // GPX-Punkt zu Web Mercator konvertieren
                const mercX = pointLon * 20037508.34 / 180;
                const mercY = Math.log(Math.tan((90 + pointLat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;

                if (uOpenLayers?.Geometry?.Point) {
                    const olPoint = new uOpenLayers.Geometry.Point(mercX, mercY);
                    const segGeom = segment.getOLGeometry?.();

                    if (segGeom && olPoint.distanceTo) {
                        const distResult = olPoint.distanceTo(segGeom, { details: true });

                        if (distResult && distResult.x1 !== undefined) {
                            // Nächster Punkt auf Segment (Web Mercator)
                            const closestLon = distResult.x1 * 180 / 20037508.34;
                            let closestLat = distResult.y1 * 180 / 20037508.34;
                            closestLat = 180 / Math.PI * (2 * Math.atan(Math.exp(closestLat * Math.PI / 180)) - Math.PI / 2);

                            // Haversine Distanz
                            return haversineDistance(pointLat, pointLon, closestLat, closestLon);
                        }
                    }
                }
            } catch (e) {
                // Fallback verwenden
            }

            // Methode 2: Manuelle Berechnung
            return manualDistanceToSegment(pointLon, pointLat, segment);
        }

        // Manuelle Distanz-Berechnung als Fallback
        function manualDistanceToSegment(pointLon, pointLat, segment) {
            // Segment-Koordinaten extrahieren
            let coords = [];

            // Versuche verschiedene Wege die Geometrie zu bekommen
            const geom = segment.getOLGeometry?.() || segment.geometry || segment.attributes?.geometry;

            if (!geom) return Infinity;

            // Web Mercator zu WGS84
            const toWGS84 = (x, y) => {
                // Prüfe ob bereits WGS84 (kleine Zahlen)
                if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
                    return [x, y];
                }
                // Web Mercator konvertieren
                const lon = x * 180 / 20037508.34;
                let lat = y * 180 / 20037508.34;
                lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lon, lat];
            };

            // Koordinaten aus verschiedenen Formaten extrahieren
            if (geom.components && geom.components.length > 0) {
                // OpenLayers LineString
                coords = geom.components.map(c => toWGS84(c.x, c.y));
            } else if (geom.getVertices) {
                // OpenLayers mit getVertices
                const verts = geom.getVertices();
                coords = verts.map(v => toWGS84(v.x, v.y));
            } else if (geom.coordinates && Array.isArray(geom.coordinates)) {
                // GeoJSON Format
                if (Array.isArray(geom.coordinates[0])) {
                    // [[lon, lat], [lon, lat], ...]
                    coords = geom.coordinates.map(c => [c[0], c[1]]);
                }
            }

            if (coords.length < 2) return Infinity;

            // Minimale Distanz zu allen Liniensegmenten
            let minDist = Infinity;

            for (let i = 0; i < coords.length - 1; i++) {
                const dist = pointToLineDistance(
                    pointLon, pointLat,
                    coords[i][0], coords[i][1],
                    coords[i+1][0], coords[i+1][1]
                );
                if (dist < minDist) minDist = dist;
            }

            return minDist;
        }

        // Punkt-zu-Linie Distanz (WGS84 Koordinaten, Ergebnis in Metern)
        function pointToLineDistance(px, py, ax, ay, bx, by) {
            // Projektion des Punktes auf die Linie
            const dx = bx - ax;
            const dy = by - ay;
            const lengthSq = dx * dx + dy * dy;

            let t = 0;
            if (lengthSq > 0) {
                t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
            }

            const projX = ax + t * dx;
            const projY = ay + t * dy;

            return haversineDistance(py, px, projY, projX);
        }

        // Haversine Distanz in Metern
        function haversineDistance(lat1, lon1, lat2, lon2) {
            const R = 6371000; // Erdradius in Metern
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        }

        function deleteRtcsInCircles() {
            if (!radiusLayer || !radiusLayer.features || radiusLayer.features.length === 0) {
                updateStatusMessage('Erst einen Kreis zeichnen', '#ff9800');
                return;
            }

            updateStatusMessage(t('deletingRtcs'), '#2196F3');
            log('Suche RTCs im markierten Bereich...');

            const segments = uWaze.model.segments.getObjectArray();
            const segmentsInCircle = [];

            // Finde alle Segmente im Kreis
            for (const segment of segments) {
                if (!segment.attributes?.roadType) continue;

                const segGeom = segment.getOLGeometry ? segment.getOLGeometry() : segment.geometry;
                if (!segGeom) continue;

                for (const drawnFeature of radiusLayer.features) {
                    if (drawnFeature.geometry.intersects(segGeom)) {
                        segmentsInCircle.push(segment);
                        break;
                    }
                }
            }

            if (segmentsInCircle.length === 0) {
                updateStatusMessage(t('noRtcsFound'), '#ff9800');
                return;
            }

            log(`${segmentsInCircle.length} Segmente im Bereich gefunden`);

            // Finde alle RTCs auf diesen Segmenten
            const closuresToDelete = [];
            const segmentIds = new Set(segmentsInCircle.map(s => s.getID()));
            const now = Date.now();

            // Hole alle Closures aus dem Model
            if (W.model.roadClosures) {
                const allClosures = W.model.roadClosures.getObjectArray();
                log(`Prüfe ${allClosures.length} Closures insgesamt...`);

                for (const closure of allClosures) {
                    if (closure.attributes && segmentIds.has(closure.attributes.segID)) {
                        // Debug: Zeige Closure-Daten
                        const attrs = closure.attributes;
                        log(`Closure auf Segment ${attrs.segID}: Start=${attrs.startDate}, Ende=${attrs.endDate}`);

                        // Nur aktive/zukünftige RTCs (nicht abgelaufene)
                        // endDate kann ein String oder Timestamp sein
                        let endTime;
                        if (attrs.endDate) {
                            endTime = typeof attrs.endDate === 'number' ? attrs.endDate : new Date(attrs.endDate).getTime();
                        }

                        if (!endTime || endTime > now) {
                            closuresToDelete.push(closure);
                            log(`  → Wird gelöscht (aktiv/zukünftig)`);
                        } else {
                            log(`  → Übersprungen (abgelaufen, Ende war ${new Date(endTime).toLocaleString()})`);
                        }
                    }
                }
            }

            if (closuresToDelete.length === 0) {
                updateStatusMessage(t('noRtcsFound'), '#ff9800');
                return;
            }

            log(`${closuresToDelete.length} RTCs zum Löschen gefunden`);

            // Prüfe ob WMEAC verfügbar ist
            if (typeof WMEAC !== 'undefined' && WMEAC.removeClosure) {
                log('Using WMEAC.removeClosure...');
                WMEAC.removeClosure(closuresToDelete,
                    () => {
                        log(`✓ ${closuresToDelete.length} RTCs gelöscht`);
                        updateStatusMessage(t('rtcsDeleted', closuresToDelete.length), '#4CAF50');
                    },
                    (err) => {
                        warn('WMEAC Lösch-Fehler:', err);
                        updateStatusMessage('Fehler beim Löschen', '#f44336');
                    }
                );
                return;
            }

            // Fallback: RTCs einzeln löschen um Fehler bei abgelaufenen zu umgehen
            try {
                const cab = require("Waze/Modules/Closures/Models/ClosureActionBuilder");
                const sc = require("Waze/Modules/Closures/Models/SharedClosure");

                let deletedCount = 0;
                let errorCount = 0;
                let currentIndex = 0;

                const deleteNext = () => {
                    if (currentIndex >= closuresToDelete.length) {
                        // Fertig
                        if (deletedCount > 0) {
                            updateStatusMessage(t('rtcsDeleted', deletedCount) + (errorCount > 0 ? ` (${errorCount} Fehler)` : ''), deletedCount > 0 ? '#4CAF50' : '#ff9800');
                        } else {
                            updateStatusMessage('Keine RTCs gelöscht (alle abgelaufen?)', '#ff9800');
                        }
                        return;
                    }

                    const closure = closuresToDelete[currentIndex];
                    currentIndex++;

                    const seg = W.model.segments.getObjectById(closure.attributes.segID);
                    if (!seg) {
                        errorCount++;
                        deleteNext();
                        return;
                    }

                    W.selectionManager.setSelectedModels([seg]);

                    const sclo = new sc(
                        {
                            segments: [seg],
                            closures: [closure],
                            reverseSegments: {}
                        },
                        {
                            dataModel: W.model,
                            segmentSelection: W.selectionManager.getSegmentSelection(),
                            isNew: true
                        }
                    );

                    const action = cab.delete(W.model, sclo);

                    W.controller.save({ actions: [action] }).then(() => {
                        deletedCount++;
                        log(`✓ RTC ${currentIndex}/${closuresToDelete.length} gelöscht`);
                        updateStatusMessage(`Lösche RTCs... ${currentIndex}/${closuresToDelete.length}`, '#2196F3');
                        deleteNext();
                    }).catch((err) => {
                        // Bei Fehler (z.B. abgelaufen) weitermachen
                        errorCount++;
                        log(`✗ RTC ${currentIndex} Fehler: ${err.errors?.[0]?.attributes?.details || err.message}`);
                        deleteNext();
                    });
                };

                // Starte das Löschen
                updateStatusMessage(`Lösche RTCs... 0/${closuresToDelete.length}`, '#2196F3');
                deleteNext();

            } catch (e) {
                warn('Fehler beim RTC-Löschen:', e);
                updateStatusMessage('Fehler: ' + e.message, '#f44336');
            }
        }

        function shouldBlockSegmentInbound(segment, segGeom, circleCenter, radius) {
            try {
                const coords = segGeom.components || segGeom.getVertices?.();

                if (!coords?.length || coords.length < 2) {
                    warn(`Invalid coordinates for segment ${segment.getID()}`);
                    return false;
                }

                // Punkt A (Start) und Punkt B (Ende) des Segments
                const startPoint = coords[0];
                const endPoint = coords[coords.length - 1];

                if (!startPoint?.x || !endPoint?.x || !circleCenter?.x) {
                    warn(`Invalid point data for segment ${segment.getID()}`);
                    return false;
                }

                // Distanz von A und B zum Kreismittelpunkt berechnen
                const startDist = Math.hypot(
                    startPoint.x - circleCenter.x,
                    startPoint.y - circleCenter.y
                );
                const endDist = Math.hypot(
                    endPoint.x - circleCenter.x,
                    endPoint.y - circleCenter.y
                );

                // Toleranz für Randberührung (5% des Radius)
                const tolerance = radius * 0.05;

                // Prüfe ob Punkte innen oder außen sind
                const startInside = startDist < (radius - tolerance);
                const endInside = endDist < (radius - tolerance);
                const startOnEdge = Math.abs(startDist - radius) <= tolerance;
                const endOnEdge = Math.abs(endDist - radius) <= tolerance;

                let blockDirection;

                if (startInside && !endInside) {
                    // A ist innen, B ist außen → Einfahrt ist B→A, also B→A sperren
                    blockDirection = 'B→A';
                } else if (!startInside && endInside) {
                    // A ist außen, B ist innen → Einfahrt ist A→B, also A→B sperren
                    blockDirection = 'A→B';
                } else if (startOnEdge || endOnEdge) {
                    // Mindestens ein Punkt liegt auf dem Rand
                    // Der Punkt der weiter vom Zentrum entfernt ist, ist die "Außenseite"
                    if (startDist > endDist) {
                        // A ist weiter außen → Einfahrt von A-Seite → A→B sperren
                        blockDirection = 'A→B';
                    } else {
                        // B ist weiter außen → Einfahrt von B-Seite → B→A sperren
                        blockDirection = 'B→A';
                    }
                } else if (!startInside && !endInside) {
                    // Beide außen aber Segment kreuzt den Kreis
                    // Der Punkt der näher am Zentrum ist, ist die "Einfahrtsseite"
                    if (startDist < endDist) {
                        // A ist näher am Zentrum → Einfahrt von A-Seite → B→A sperren
                        blockDirection = 'B→A';
                    } else {
                        // B ist näher am Zentrum → Einfahrt von B-Seite → A→B sperren
                        blockDirection = 'A→B';
                    }
                } else {
                    // Beide klar innen - sollte nicht als Perimeter-Segment erkannt werden
                    // Aber wir behandeln es trotzdem: der weiter außen liegende Punkt bestimmt die Richtung
                    if (startDist > endDist) {
                        blockDirection = 'A→B';
                    } else {
                        blockDirection = 'B→A';
                    }
                    log(`Segment ${segment.getID()}: Beide Punkte nah am Rand, verwende Distanz-Logik → ${blockDirection}`);
                }

                // Richtungsinfo speichern für spätere Verwendung
                segment._circleDirectionInfo = {
                    startPoint, endPoint, startDist, endDist, circleCenter,
                    blockDirection: blockDirection
                };

                log(`Segment ${segment.getID()}: A-Dist=${Math.round(startDist)}m, B-Dist=${Math.round(endDist)}m → Sperre ${blockDirection}`);

                return true;
            } catch (error) {
                warn(`Error in shouldBlockSegmentInbound for segment ${segment.getID()}:`, error);
                return false;
            }
        }

        function applyDirectionRestrictions(segments) {
            log(`=== Perimeter-Sperrung: ${segments.length} Segmente ===`);

            // Segmente selektieren
            uWaze.selectionManager.setSelectedModels(segments);

            // Modus prüfen: Dauer oder Enddatum
            const useDuration = document.querySelector('#rtc-mode-duration')?.checked !== false;

            const now = new Date();
            let end;

            if (useDuration) {
                // Dauer aus UI lesen
                const durationDays = parseInt(document.querySelector('#rtc-duration-days')?.value) || 0;
                const durationHours = parseInt(document.querySelector('#rtc-duration-hours')?.value) || 24;
                const durationMinutes = parseInt(document.querySelector('#rtc-duration-minutes')?.value) || 0;
                const totalMinutes = (durationDays * 24 * 60) + (durationHours * 60) + durationMinutes;

                if (totalMinutes <= 0) {
                    updateStatusMessage('Bitte Dauer eingeben', '#ff9800');
                    return;
                }

                end = new Date(now.getTime() + totalMinutes * 60 * 1000);
                log(`RTC Dauer: ${durationDays}d ${durationHours}h ${durationMinutes}m`);
            } else {
                // Enddatum aus UI lesen
                const endDateStr = document.querySelector('#rtc-end-date')?.value;
                const endTimeStr = document.querySelector('#rtc-end-time')?.value || '23:59';

                if (!endDateStr) {
                    updateStatusMessage('Bitte Enddatum eingeben', '#ff9800');
                    return;
                }

                end = new Date(`${endDateStr}T${endTimeStr}`);

                if (end <= now) {
                    updateStatusMessage('Enddatum muss in der Zukunft liegen', '#ff9800');
                    return;
                }

                log(`RTC Enddatum: ${endDateStr} ${endTimeStr}`);
            }

            const formatDate = (d) => {
                const pad = (n) => ('0' + n).slice(-2);
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            };
            const startStr = formatDate(now);
            const endStr = formatDate(end);

            log(`Start: ${startStr}, Ende: ${endStr}`);

            // Segmente nach Richtung gruppieren
            const segmentsAtoB = [];
            const segmentsBtoA = [];

            for (const segment of segments) {
                try {
                    const dirInfo = segment._circleDirectionInfo;
                    if (!dirInfo) {
                        warn(`Segment ${segment.getID()}: Keine Richtungsinfo`);
                        continue;
                    }

                    if (dirInfo.blockDirection === 'A→B') {
                        // A→B sperren (direction = A_TO_B = 1)
                        segmentsAtoB.push(segment);
                        log(`✓ Segment ${segment.getID()}: RTC sperrt A→B`);
                    } else {
                        // B→A sperren (direction = B_TO_A = 2)
                        segmentsBtoA.push(segment);
                        log(`✓ Segment ${segment.getID()}: RTC sperrt B→A`);
                    }

                    delete segment._circleDirectionInfo;

                } catch (error) {
                    warn('Error:', error);
                }
            }

            // Closures über WME Action System erstellen
            try {
                // Prüfe ob WMEAC (Advanced Closures) verfügbar ist
                if (typeof WMEAC !== 'undefined' && WMEAC.addClosure) {
                    log('Using WMEAC.addClosure...');

                    const allSegs = [...segmentsAtoB, ...segmentsBtoA];
                    W.selectionManager.setSelectedModels(allSegs);

                    let successCount = 0;
                    let errorCount = 0;
                    const totalExpected = (segmentsAtoB.length > 0 ? 1 : 0) + (segmentsBtoA.length > 0 ? 1 : 0);

                    const checkDone = () => {
                        if (successCount + errorCount >= totalExpected) {
                            if (successCount > 0) {
                                updateStatusMessage(`✓ RTCs erstellt`, '#4CAF50');
                            } else {
                                updateStatusMessage(`Fehler beim Erstellen`, '#f44336');
                            }
                        }
                    };

                    if (segmentsAtoB.length > 0) {
                        W.selectionManager.setSelectedModels(segmentsAtoB);
                        WMEAC.addClosure({
                            segments: segmentsAtoB,
                            reason: "Perimeter-Sperrung",
                            direction: 1,
                            startDate: startStr,
                            endDate: endStr,
                            location: "",
                            permanent: false
                        }, () => { successCount++; checkDone(); }, (err) => { warn('A→B Error:', err); errorCount++; checkDone(); });
                    }

                    if (segmentsBtoA.length > 0) {
                        setTimeout(() => {
                            W.selectionManager.setSelectedModels(segmentsBtoA);
                            WMEAC.addClosure({
                                segments: segmentsBtoA,
                                reason: "Perimeter-Sperrung",
                                direction: 2,
                                startDate: startStr,
                                endDate: endStr,
                                location: "",
                                permanent: false
                            }, () => { successCount++; checkDone(); }, (err) => { warn('B→A Error:', err); errorCount++; checkDone(); });
                        }, 1000);
                    }

                    return;
                }

                // Fallback: Eigene Implementation
                log('WMEAC not available, using internal implementation...');

                const cab = require("Waze/Modules/Closures/Models/ClosureActionBuilder");
                const sc = require("Waze/Modules/Closures/Models/SharedClosure");

                if (segmentsAtoB.length === 0 && segmentsBtoA.length === 0) {
                    updateStatusMessage('Keine RTCs erstellt', '#ff9800');
                    return;
                }

                const createClosureForSegments = (segs, direction) => {
                    if (segs.length === 0) return null;

                    log(`Creating closure for ${segs.length} segments, direction=${direction}`);
                    log(`Segment IDs: ${segs.map(s => s.getID()).join(', ')}`);

                    // Segmente für diese Richtung selektieren
                    W.selectionManager.setSelectedModels(segs);

                    const closureDetails = {
                        closures: [],
                        attributions: [],
                        reason: "Perimeter-Sperrung" + String.fromCharCode(160),
                        direction: direction,
                        startDate: startStr,
                        endDate: endStr,
                        location: "",
                        permanent: false,
                        segments: segs,
                        closuresType: 'roadClosure',
                        reverseSegments: {}
                    };

                    log(`Closure details:`, JSON.stringify({
                        reason: closureDetails.reason,
                        direction: closureDetails.direction,
                        startDate: closureDetails.startDate,
                        endDate: closureDetails.endDate,
                        segmentCount: closureDetails.segments.length
                    }));

                    const closure = new sc(closureDetails, {
                        dataModel: W.model,
                        segmentSelection: W.selectionManager.getSegmentSelection(),
                        isNewClosure: true,
                        closedNodesMap: {}
                    });

                    log(`Closure created, closureNodes: ${closure.closureNodes?.models?.length || 0}`);

                    // ClosureNodes setzen (wie in Advanced Closures)
                    if (closure.closureNodes?.models) {
                        for (const n of closure.closureNodes.models) {
                            n.attributes.isClosed = false;
                        }
                    }

                    return cab.add(closure, W.loginManager.user, W.model);
                };

                // Sequentiell speichern um Konflikte zu vermeiden
                const saveWithCallback = (segs, direction, dirName, onSuccess, onError) => {
                    if (segs.length === 0) {
                        onSuccess(0);
                        return;
                    }

                    const action = createClosureForSegments(segs, direction);
                    if (!action) {
                        onSuccess(0);
                        return;
                    }

                    const t = { actions: [action] };

                    W.controller.save(t).then(function() {
                        log(`✓ ${segs.length} ${dirName} RTCs gespeichert`);
                        onSuccess(segs.length);
                    }).catch(function(err) {
                        warn(`${dirName} Save Error:`, err);
                        let errorDetails = '';
                        if (err.errors) {
                            err.errors.forEach(e => {
                                warn(`Error details:`, JSON.stringify(e.attributes || e));
                                if (e.attributes?.details) {
                                    errorDetails = e.attributes.details;
                                }
                            });
                        }

                        // Spezifische Fehlermeldung für überlappende RTCs
                        if (errorDetails.includes('overlapped')) {
                            err.userMessage = 'RTC existiert bereits für diesen Zeitraum! Bitte erst bestehende RTCs löschen.';
                        }

                        onError(err);
                    });
                };

                // Erst A→B, dann B→A
                saveWithCallback(segmentsAtoB, 1, 'A→B',
                    function(countA) {
                        // A→B erfolgreich, jetzt B→A
                        saveWithCallback(segmentsBtoA, 2, 'B→A',
                            function(countB) {
                                const total = countA + countB;
                                if (total > 0) {
                                    updateStatusMessage(`✓ ${total} RTCs erstellt`, '#4CAF50');
                                } else {
                                    updateStatusMessage('Keine RTCs erstellt', '#ff9800');
                                }
                            },
                            function(err) {
                                // B→A fehlgeschlagen, aber A→B war erfolgreich
                                if (countA > 0) {
                                    updateStatusMessage(`⚠ ${countA} RTCs erstellt, B→A fehlgeschlagen`, '#ff9800');
                                } else {
                                    let details = '';
                                    if (err.errors) {
                                        err.errors.forEach(e => {
                                            if (e.attributes?.details) details += e.attributes.details + ' ';
                                        });
                                    }
                                    updateStatusMessage(`Fehler: ${details || err.message || 'Unbekannt'}`, '#f44336');
                                }
                            }
                        );
                    },
                    function(err) {
                        // A→B fehlgeschlagen
                        let details = err.userMessage || '';
                        if (!details && err.errors) {
                            err.errors.forEach(e => {
                                if (e.attributes?.details) details += e.attributes.details + ' ';
                            });
                        }
                        updateStatusMessage(`Fehler: ${details || err.message || 'Unbekannt'}`, '#f44336');
                    }
                );

            } catch (e) {
                warn('Action System Fehler:', e);
                updateStatusMessage('Action System nicht verfügbar', '#f44336');
            }
        }

        function undoLastCircle() {
            try {
                // 1. Prüfe ob Brush-Modus aktiv und History vorhanden
                if (brushModeActive && brushHistory && brushHistory.length > 0) {
                    if (undoBrushSelection()) {
                        return;
                    }
                }

                // 2. Prüfe ob es Kreise zum Entfernen gibt
                if (radiusLayer && radiusLayer.features && radiusLayer.features.length > 0) {
                    const lastFeature = radiusLayer.features[radiusLayer.features.length - 1];

                    if (lastFeature) {
                        radiusLayer.removeFeatures([lastFeature]);

                        if (radiusLayer.redraw) radiusLayer.redraw();

                        updateAllAnnotations();

                        const remaining = radiusLayer.features.length;
                        updateStatusMessage(`✓ ${t('removedCircle')} (${remaining} ${t('remaining')})`, '#2196F3');
                        return;
                    }
                }

                // 3. Keine Kreise - versuche WME Undo
                if (W.controller && W.controller.undo) {
                    W.controller.undo();
                    updateStatusMessage('↩️ WME', '#2196F3');
                } else if (W.model && W.model.actionManager) {
                    W.model.actionManager.undo();
                    updateStatusMessage('↩️ WME', '#2196F3');
                } else {
                    updateStatusMessage(t('noCirclesToUndo'), '#ff9800');
                }
            } catch (error) {
                warn('Error undoing:', error);
                updateStatusMessage(t('errorRemoving'), '#f44336');
            }
        }

        function clearAllCircles() {
            try {
                // Deactivate controls first
                if (polygonControl) polygonControl.deactivate();
                if (freehandControl) freehandControl.deactivate();
                if (dragControl) dragControl.deactivate();

                // Clear checkboxes
                if (checkbox) checkbox.checked = false;
                if (freehandCheckbox) freehandCheckbox.checked = false;
                if (moveCheckbox) moveCheckbox.checked = false;

                // Remove features one by one (more reliable than destroyFeatures)
                if (infoLayer && infoLayer.features) {
                    const infoFeatures = [...infoLayer.features];
                    infoFeatures.forEach(f => {
                        try {
                            infoLayer.removeFeatures([f]);
                        } catch (e) {
                            log('Error removing info feature');
                        }
                    });
                }

                if (radiusLayer && radiusLayer.features) {
                    const radiusFeatures = [...radiusLayer.features];
                    radiusFeatures.forEach(f => {
                        try {
                            radiusLayer.removeFeatures([f]);
                        } catch (e) {
                            log('Error removing radius feature');
                        }
                    });
                }

                // Force redraw
                if (infoLayer && infoLayer.redraw) infoLayer.redraw();
                if (radiusLayer && radiusLayer.redraw) radiusLayer.redraw();

            } catch (error) {
                warn('Error clearing circles:', error);
            }
        }
    }

    function radiusInit() {
        radiusLayer = new uOpenLayers.Layer.Vector("WME Circle Control Layer", {
            displayInLayerSwitcher: true,
            uniqueName: "__CircleControlLayer",
            visibility: true,
            style: {
                "fillColor": "#c40606",
                "fillOpacity": 0.2,
                "strokeColor": "#c40606",
                "strokeOpacity": 1,
                "strokeWidth": 1,
                "strokeLinecap": "round",
                "strokeDashstyle": "solid",
                "pointRadius": 6,
                "pointerEvents": "visiblePainted",
                "labelAlign": "cm",
                "labelOutlineColor": "white",
                "labelOutlineWidth": 3
            }
        });

        infoLayer = new uOpenLayers.Layer.Vector("WME Circle Visual Layer", {
            displayInLayerSwitcher: true,
            uniqueName: "__DrawCircleDisplayLayer",
            visibility: true
        });

        let polygonHandler = uOpenLayers.Handler.RegularPolygon;
        polygonControl = new uOpenLayers.Control.DrawFeature(radiusLayer, polygonHandler, {
            handlerOptions: {
                sides: 100
            }
        });

        let polygonHandlerFreehand = uOpenLayers.Handler.Polygon;
        freehandControl = new uOpenLayers.Control.DrawFeature(radiusLayer, polygonHandlerFreehand, {
            handlerOptions: {
                freehand: true,
                freehandToggle: null
            }
        });

        // Drag control is created in setupSidebarContent via setupDragControl()

        uWaze.map.addLayer(radiusLayer);
        uWaze.map.addLayer(infoLayer);
        uWaze.map.addControl(polygonControl);
        uWaze.map.addControl(freehandControl);
        // dragControl is added via setupDragControl() in setupSidebarContent

        addSidePanel();

        polygonControl.handler.callbacks.move = function (e) {
            let linearRing = new uOpenLayers.Geometry.LinearRing(e.components[0].components);
            let geometry = new uOpenLayers.Geometry.Polygon([linearRing]);
            let polygonFeature = new uOpenLayers.Feature.Vector(geometry, null);
            let polybounds = polygonFeature.geometry.getBounds();
            let minX = polybounds.left;
            let minY = polybounds.bottom;
            let maxX = polybounds.right;
            let maxY = polybounds.top;
            let startX = (minX + maxX) / 2;
            let startY = (minY + maxY) / 2;
            let startPoint = new uOpenLayers.Geometry.Point(startX, startY);
            let endPoint = new uOpenLayers.Geometry.Point(maxX, startY);
            let radius = new uOpenLayers.Geometry.LineString([startPoint, endPoint]);
            let len = radius.getGeodesicLength(new uOpenLayers.Projection("EPSG:900913"));

            let unit = 'm';
            if (len > 1000) {
                len = Math.round((len / 1000) * 100) / 100;
                unit = "km";
            } else {
                len = Math.round(len);
            }

            let rad = document.getElementById('circles-current-radius');
            if (rad) {
                rad.innerHTML = 'Current Radius: ' + len + ' ' + unit;
            }

            infoLayer.destroyFeatures();

            let centerStyle = {
                strokeColor: "#ff9800",
                strokeWidth: 2,
                pointRadius: 3,
                fillOpacity: 0.3
            };

            let lineStyle = {
                strokeColor: "#ff9800",
                strokeWidth: 2,
                label: len + ' ' + unit,
                labelAlign: "left",
                labelXOffset: "15",
                labelYOffset: "5",
                labelOutlineColor: "white",
                labelOutlineWidth: 2,
                strokeDashstyle: "dash"
            };

            let center = new uOpenLayers.Feature.Vector(startPoint, {}, centerStyle);
            let radiusLine = new uOpenLayers.Feature.Vector(radius, {}, lineStyle);

            infoLayer.addFeatures([center, radiusLine]);
        }

        polygonControl.events.on({
            'featureadded': function (e) {
                let rad = document.getElementById('circles-current-radius');
                if (rad) {
                    rad.innerHTML = '';
                }
                setTimeout(() => {
                    const event = new CustomEvent('updateAnnotations');
                    document.dispatchEvent(event);
                }, 100);
            }
        });

        freehandControl.events.on({
            'featureadded': function (e) {
                let rad = document.getElementById('circles-current-radius');
                if (rad) {
                    rad.innerHTML = '';
                }
                setTimeout(() => {
                    const event = new CustomEvent('updateAnnotations');
                    document.dispatchEvent(event);
                }, 100);
            }
        });
    }

    if (W?.userscripts?.state?.isReady) {
        log('WME already ready, initializing...');
        initializeScript();
    } else {
        log('Waiting for WME ready event...');
        document.addEventListener("wme-ready", initializeScript, { once: true });
    }

})();
