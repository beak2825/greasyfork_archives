// ==UserScript==
// @name WME Map Nav History
// @name:de WME Karten-Navigations-Historie
// @name:en WME Map Navigation History
// @name:it WME Cronologia Navigazione Mappa
// @name:es WME Historial de Navegación de Mapas
// @name:fr WME Historique de Navigation Cartographique
// @name:nl WME Kaartnavigatie Geschiedenis
// @description:de Ermöglicht die Navigation durch die Kartenhistorie
// @description:en Navigate through map history with ease
// @description:it Naviga facilmente nella cronologia della mappa
// @description:es Navega fácilmente por el historial de mapas
// @description:fr Naviguez facilement dans l'historique des cartes
// @description:nl Navigeer gemakkelijk door de kaartgeschiedenis
// @namespace https://greasyfork.org/de/users/863740-horst-wittlich
// @version 2025.11.26
// @author hiwi234
// @include https://www.waze.com/editor*
// @include https://www.waze.com/*/editor*
// @include https://beta.waze.com/*
// @exclude https://www.waze.com/user/*editor/*
// @exclude https://www.waze.com/*/user/*editor/*
// @grant none
// @license MIT
// @description Navigate through map history using Alt + arrow keys, mouse control, clickable history sidebar, and location highlighting
// @downloadURL https://update.greasyfork.org/scripts/535961/WME%20Map%20Nav%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/535961/WME%20Map%20Nav%20History.meta.js
// ==/UserScript==

/* global W, OpenLayers */
(function() {
'use strict';

console.log('WME Nav History Ultimate: Starting...');

// Language system
const SUPPORTED_LANGUAGES = ['de', 'en', 'it', 'es', 'fr', 'nl'];
const detectedLanguage = navigator.language.split('-')[0] || 'en';
const LANGUAGE = SUPPORTED_LANGUAGES.includes(detectedLanguage) ? detectedLanguage : 'en';
const TRANSLATIONS = {
    de: {
        scriptLoaded: 'Script erfolgreich geladen',
        back: 'Zurück',
        forward: 'Vorwärts',
        history: 'Verlauf',
        bookmarks: 'Lesezeichen',
        statistics: 'Statistiken',
        settings: 'Einstellungen',
        search: 'Suche in Verlauf, Lesezeichen...',
        delete: 'Löschen',
        add: 'Hinzufügen',
        close: 'Schließen',
        noHistory: 'Kein Verlauf verfügbar',
        noBookmarks: 'Keine Lesezeichen vorhanden',
        noAreas: 'Keine Arbeitsbereiche definiert',
        controls: 'Steuerung:',
        hints: 'Hinweise:',
        shortcuts: 'Shortcuts:',
        updateTitle: 'WME Nav History Update!',
        updateNew: 'Neu:',
        updateFeature1: 'Anleitung verschwindet im Klappentext',
        updateFeature2: 'Mehr Einträge gleichzeitig sichtbar',
        updateFeature3: 'Mehrsprachigkeit: 🇬🇧 Englisch, 🇮🇹 Italienisch, 🇪🇸 Spanisch, 🇫🇷 Französisch, 🇳🇱 Niederländisch',
        clearConfirm: 'Verlauf wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
        clearSuccess: 'Verlauf gelöscht',
        bookmarkAdded: 'Lesezeichen "{name}" hinzugefügt',
        bookmarkRemoved: 'Lesezeichen entfernt',
        bookmarkName: 'Name für Lesezeichen:',
        bookmarkDesc: 'Beschreibung (optional):',
        bookmarkDelete: 'Lesezeichen "{name}" wirklich löschen?',
        visits: 'Besuche',
        created: 'Erstellt',
        autoSave: 'Automatisches Speichern',
        autoSaveDesc: 'Positionen automatisch speichern',
        trackingMode: 'Tracking-Modus',
        trackingModeDesc: 'Häufigere Positionsspeicherung (1s statt 2s)',
        notifications: 'Benachrichtigungen',
        notificationsDesc: 'Popup-Meldungen oben rechts anzeigen',
        sortOrder: 'Verlauf Sortierung',
        newestFirst: 'Neueste zuerst',
        oldestFirst: 'Älteste zuerst',
        dataManagement: 'Datenmanagement',
        export: 'Export',
        import: 'Import',
        exportDesc: 'Speichert alle Daten als JSON-Datei',
        importDesc: 'Lädt gespeicherte Daten (Merge oder Ersetzen)',
        positions: 'Positionen',
        totalDistance: 'Gesamtdistanz',
        sessionDistance: 'Session-Distanz',
        sessionTime: 'Session-Zeit',
        avgZoom: 'Ø Zoom',
        marked: 'Markiert',
        sessionPos: 'Session Pos.',
        current: 'Aktuell',
        markButton: 'Position markieren',
        unmarkButton: 'Position entfernen',
        bookmarkButton: 'Als Lesezeichen speichern',
        instructionsTitle: 'Anleitung & Shortcuts',
        altLeft: 'Alt + ← Vorherige Position',
        altRight: 'Alt + → Nächste Position',
        clickHistory: 'Klick auf Historie-Eintrag für direkten Sprung',
        starButton: '★ Button Position markieren',
        bookmarkButtonDesc: '🔖 Button Als Lesezeichen speichern',
        historyStores: 'Die Historie speichert bis zu 100 Positionen',
        autoSavePositions: 'Neue Positionen werden beim Verschieben der Karte automatisch gespeichert',
        autoLoadHistory: 'Verlauf wird automatisch gespeichert und beim nächsten Start geladen',
        markedHighlight: 'Markierte Positionen werden in der Liste hervorgehoben',
        highlightPersist: 'Hervorhebungen bleiben auch nach Neustart erhalten',
        exportImport: 'Alle Daten können über Export/Import gesichert werden',
        shortcutsLine: 'Alt+←/→ Navigation | Ctrl+B Lesezeichen | Ctrl+H Verlauf | Ctrl+Shift+S Export',
        navigatedTo: 'Navigiert zu:',
        navigationError: 'Navigationsfehler:',
        backTo: 'Zurück zu:',
        forwardTo: 'Vorwärts zu:',
        alreadyAtStart: 'Bereits am Anfang des Verlaufs',
        alreadyAtEnd: 'Bereits am Ende des Verlaufs',
        noSearchResults: 'Keine Suchergebnisse gefunden',
        duration: 'Verweildauer:',
        workAreaAdded: 'Arbeitsbereich "{name}" hinzugefügt',
        workAreaRemoved: 'Arbeitsbereich entfernt',
        navigatedToWorkArea: 'Navigiert zu Arbeitsbereich:',
        workAreaNavigationError: 'Fehler beim Navigieren zum Arbeitsbereich:',
        bookmarkError: 'Fehler beim Hinzufügen des Lesezeichens:',
        dataExported: 'Daten exportiert: {positions} Positionen, {bookmarks} Lesezeichen',
        dataMerged: 'Daten erfolgreich zusammengeführt',
        dataReplaced: 'Daten erfolgreich ersetzt',
        importComplete: 'Import abgeschlossen: {positions} Positionen, {bookmarks} Lesezeichen',
        importError: 'Fehler beim Importieren:',
        invalidFileStructure: 'Ungültige Dateistruktur',
        mergeOrReplace: 'Möchten Sie die Daten zusammenführen (OK) oder komplett ersetzen (Abbrechen)?',
        autoSaveEnabled: 'Automatisches Speichern aktiviert',
        autoSaveDisabled: 'Automatisches Speichern deaktiviert',
        trackingModeEnabled: 'Tracking-Modus aktiviert',
        trackingModeDisabled: 'Tracking-Modus deaktiviert',
        notificationsEnabled: 'Popup-Benachrichtigungen aktiviert',
        notificationsDisabled: 'Popup-Benachrichtigungen deaktiviert',
        sortingChanged: 'Sortierung geändert auf:',
        scriptActivated: 'Navigation History+ Ultimate aktiviert - Verlauf repariert',
        workAreaName: 'Name für Arbeitsbereich:',
        position: 'Position',
        of: 'von',
        noHistoryAvailable: 'Kein Verlauf vorhanden',
        initializing: 'Initialisierung...'
    },
    en: {
        scriptLoaded: 'Script successfully loaded',
        back: 'Back',
        forward: 'Forward',
        history: 'History',
        bookmarks: 'Bookmarks',
        statistics: 'Statistics',
        settings: 'Settings',
        search: 'Search in history, bookmarks...',
        delete: 'Delete',
        add: 'Add',
        close: 'Close',
        noHistory: 'No history available',
        noBookmarks: 'No bookmarks available',
        noAreas: 'No work areas defined',
        controls: 'Controls:',
        hints: 'Hints:',
        shortcuts: 'Shortcuts:',
        updateTitle: 'WME Nav History Update!',
        updateNew: 'New:',
        updateFeature1: 'Instructions hidden in collapsible section',
        updateFeature2: 'More entries visible at once',
        updateFeature3: 'Multi-language support: 🇬🇧 English, 🇮🇹 Italian, 🇪🇸 Spanish, 🇫🇷 French, 🇳🇱 Dutch',
        clearConfirm: 'Really delete history? This action cannot be undone.',
        clearSuccess: 'History deleted',
        bookmarkAdded: 'Bookmark "{name}" added',
        bookmarkRemoved: 'Bookmark removed',
        bookmarkName: 'Bookmark name:',
        bookmarkDesc: 'Description (optional):',
        bookmarkDelete: 'Really delete bookmark "{name}"?',
        visits: 'Visits',
        created: 'Created',
        autoSave: 'Auto Save',
        autoSaveDesc: 'Automatically save positions',
        trackingMode: 'Tracking Mode',
        trackingModeDesc: 'More frequent position saving (1s instead of 2s)',
        notifications: 'Notifications',
        notificationsDesc: 'Show popup messages in top right',
        sortOrder: 'History Sorting',
        newestFirst: 'Newest first',
        oldestFirst: 'Oldest first',
        dataManagement: 'Data Management',
        export: 'Export',
        import: 'Import',
        exportDesc: 'Saves all data as JSON file',
        importDesc: 'Loads saved data (merge or replace)',
        positions: 'Positions',
        totalDistance: 'Total Distance',
        sessionDistance: 'Session Distance',
        sessionTime: 'Session Time',
        avgZoom: 'Avg Zoom',
        marked: 'Marked',
        sessionPos: 'Session Pos.',
        current: 'Current',
        markButton: 'Mark position',
        unmarkButton: 'Remove position',
        bookmarkButton: 'Save as bookmark',
        instructionsTitle: 'Instructions & Shortcuts',
        altLeft: 'Alt + ← Previous Position',
        altRight: 'Alt + → Next Position',
        clickHistory: 'Click history entry to jump directly',
        starButton: '★ Button Mark position',
        bookmarkButtonDesc: '🔖 Button Save as bookmark',
        historyStores: 'History stores up to 100 positions',
        autoSavePositions: 'New positions are automatically saved when moving the map',
        autoLoadHistory: 'History is automatically saved and loaded on next start',
        markedHighlight: 'Marked positions are highlighted in the list',
        highlightPersist: 'Highlights persist even after restart',
        exportImport: 'All data can be backed up via export/import',
        shortcutsLine: 'Alt+←/→ Navigation | Ctrl+B Bookmark | Ctrl+H History | Ctrl+Shift+S Export',
        navigatedTo: 'Navigated to:',
        navigationError: 'Navigation error:',
        backTo: 'Back to:',
        forwardTo: 'Forward to:',
        alreadyAtStart: 'Already at the beginning of history',
        alreadyAtEnd: 'Already at the end of history',
        noSearchResults: 'No search results found',
        duration: 'Duration:',
        workAreaAdded: 'Work area "{name}" added',
        workAreaRemoved: 'Work area removed',
        navigatedToWorkArea: 'Navigated to work area:',
        workAreaNavigationError: 'Error navigating to work area:',
        bookmarkError: 'Error adding bookmark:',
        dataExported: 'Data exported: {positions} positions, {bookmarks} bookmarks',
        dataMerged: 'Data successfully merged',
        dataReplaced: 'Data successfully replaced',
        importComplete: 'Import complete: {positions} positions, {bookmarks} bookmarks',
        importError: 'Import error:',
        invalidFileStructure: 'Invalid file structure',
        mergeOrReplace: 'Do you want to merge the data (OK) or completely replace (Cancel)?',
        autoSaveEnabled: 'Auto save enabled',
        autoSaveDisabled: 'Auto save disabled',
        trackingModeEnabled: 'Tracking mode enabled',
        trackingModeDisabled: 'Tracking mode disabled',
        notificationsEnabled: 'Popup notifications enabled',
        notificationsDisabled: 'Popup notifications disabled',
        sortingChanged: 'Sorting changed to:',
        scriptActivated: 'Navigation History+ Ultimate activated - History fixed',
        workAreaName: 'Work area name:',
        position: 'Position',
        of: 'of',
        noHistoryAvailable: 'No history available',
        initializing: 'Initializing...'
    },
    it: {
        scriptLoaded: 'Script caricato con successo',
        back: 'Indietro',
        forward: 'Avanti',
        history: 'Cronologia',
        bookmarks: 'Segnalibri',
        statistics: 'Statistiche',
        settings: 'Impostazioni',
        search: 'Cerca in cronologia, segnalibri...',
        delete: 'Elimina',
        add: 'Aggiungi',
        close: 'Chiudi',
        noHistory: 'Nessuna cronologia disponibile',
        noBookmarks: 'Nessun segnalibro disponibile',
        noAreas: 'Nessuna area di lavoro definita',
        controls: 'Controlli:',
        hints: 'Suggerimenti:',
        shortcuts: 'Scorciatoie:',
        updateTitle: 'Aggiornamento WME Nav History!',
        updateNew: 'Nuovo:',
        updateFeature1: 'Istruzioni nascoste in sezione collassabile',
        updateFeature2: 'Più voci visibili contemporaneamente',
        updateFeature3: 'Supporto multilingue: 🇬🇧 Inglese, 🇮🇹 Italiano, 🇪🇸 Spagnolo, 🇫🇷 Francese, 🇳🇱 Olandese',
        clearConfirm: 'Eliminare davvero la cronologia? Questa azione non può essere annullata.',
        clearSuccess: 'Cronologia eliminata',
        bookmarkAdded: 'Segnalibro "{name}" aggiunto',
        bookmarkRemoved: 'Segnalibro rimosso',
        bookmarkName: 'Nome segnalibro:',
        bookmarkDesc: 'Descrizione (opzionale):',
        bookmarkDelete: 'Eliminare davvero il segnalibro "{name}"?',
        visits: 'Visite',
        created: 'Creato',
        autoSave: 'Salvataggio Automatico',
        autoSaveDesc: 'Salva automaticamente le posizioni',
        trackingMode: 'Modalità Tracciamento',
        trackingModeDesc: 'Salvataggio più frequente (1s invece di 2s)',
        notifications: 'Notifiche',
        notificationsDesc: 'Mostra messaggi popup in alto a destra',
        sortOrder: 'Ordinamento Cronologia',
        newestFirst: 'Più recenti prima',
        oldestFirst: 'Più vecchi prima',
        dataManagement: 'Gestione Dati',
        export: 'Esporta',
        import: 'Importa',
        exportDesc: 'Salva tutti i dati come file JSON',
        importDesc: 'Carica dati salvati (unisci o sostituisci)',
        positions: 'Posizioni',
        totalDistance: 'Distanza Totale',
        sessionDistance: 'Distanza Sessione',
        sessionTime: 'Tempo Sessione',
        avgZoom: 'Zoom Medio',
        marked: 'Marcato',
        sessionPos: 'Pos. Sessione',
        current: 'Attuale',
        markButton: 'Marca posizione',
        unmarkButton: 'Rimuovi posizione',
        bookmarkButton: 'Salva come segnalibro',
        instructionsTitle: 'Istruzioni e Scorciatoie',
        altLeft: 'Alt + ← Posizione Precedente',
        altRight: 'Alt + → Posizione Successiva',
        clickHistory: 'Clicca voce cronologia per saltare direttamente',
        starButton: '★ Button Marca posizione',
        bookmarkButtonDesc: '🔖 Button Salva come segnalibro',
        historyStores: 'La cronologia memorizza fino a 100 posizioni',
        autoSavePositions: 'Le nuove posizioni vengono salvate automaticamente quando si sposta la mappa',
        autoLoadHistory: 'La cronologia viene salvata automaticamente e caricata al prossimo avvio',
        markedHighlight: 'Le posizioni marcate sono evidenziate nell\'elenco',
        highlightPersist: 'Le evidenziazioni persistono anche dopo il riavvio',
        exportImport: 'Tutti i dati possono essere sottoposti a backup tramite esportazione/importazione',
        shortcutsLine: 'Alt+←/→ Navigazione | Ctrl+B Segnalibro | Ctrl+H Cronologia | Ctrl+Shift+S Esporta',
        navigatedTo: 'Navigato a:',
        navigationError: 'Errore di navigazione:',
        backTo: 'Indietro a:',
        forwardTo: 'Avanti a:',
        alreadyAtStart: 'Già all\'inizio della cronologia',
        alreadyAtEnd: 'Già alla fine della cronologia',
        noSearchResults: 'Nessun risultato di ricerca trovato',
        duration: 'Durata:',
        workAreaAdded: 'Area di lavoro "{name}" aggiunta',
        workAreaRemoved: 'Area di lavoro rimossa',
        navigatedToWorkArea: 'Navigato all\'area di lavoro:',
        workAreaNavigationError: 'Errore nella navigazione all\'area di lavoro:',
        bookmarkError: 'Errore nell\'aggiunta del segnalibro:',
        dataExported: 'Dati esportati: {positions} posizioni, {bookmarks} segnalibri',
        dataMerged: 'Dati uniti con successo',
        dataReplaced: 'Dati sostituiti con successo',
        importComplete: 'Importazione completata: {positions} posizioni, {bookmarks} segnalibri',
        importError: 'Errore di importazione:',
        invalidFileStructure: 'Struttura file non valida',
        mergeOrReplace: 'Vuoi unire i dati (OK) o sostituire completamente (Annulla)?',
        autoSaveEnabled: 'Salvataggio automatico attivato',
        autoSaveDisabled: 'Salvataggio automatico disattivato',
        trackingModeEnabled: 'Modalità tracciamento attivata',
        trackingModeDisabled: 'Modalità tracciamento disattivata',
        notificationsEnabled: 'Notifiche popup attivate',
        notificationsDisabled: 'Notifiche popup disattivate',
        sortingChanged: 'Ordinamento cambiato in:',
        scriptActivated: 'Navigation History+ Ultimate attivato - Cronologia riparata',
        workAreaName: 'Nome area di lavoro:',
        position: 'Posizione',
        of: 'di',
        noHistoryAvailable: 'Nessuna cronologia disponibile',
        initializing: 'Inizializzazione...'
    },
    es: {
        scriptLoaded: 'Script cargado exitosamente',
        back: 'Atrás',
        forward: 'Adelante',
        history: 'Historial',
        bookmarks: 'Marcadores',
        statistics: 'Estadísticas',
        settings: 'Configuración',
        search: 'Buscar en historial, marcadores...',
        delete: 'Eliminar',
        add: 'Añadir',
        close: 'Cerrar',
        noHistory: 'Sin historial disponible',
        noBookmarks: 'Sin marcadores disponibles',
        noAreas: 'Sin áreas de trabajo definidas',
        controls: 'Controles:',
        hints: 'Consejos:',
        shortcuts: 'Atajos:',
        updateTitle: '¡Actualización de WME Nav History!',
        updateNew: 'Nuevo:',
        updateFeature1: 'Instrucciones ocultas en sección desplegable',
        updateFeature2: 'Más entradas visibles a la vez',
        updateFeature3: 'Soporte multiidioma: 🇬🇧 Inglés, 🇮🇹 Italiano, 🇪🇸 Español, 🇫🇷 Francés, 🇳🇱 Holandés',
        clearConfirm: '¿Eliminar historial? Esta acción no se puede deshacer.',
        clearSuccess: 'Historial eliminado',
        bookmarkAdded: 'Marcador "{name}" añadido',
        bookmarkRemoved: 'Marcador eliminado',
        bookmarkName: 'Nombre del marcador:',
        bookmarkDesc: 'Descripción (opcional):',
        bookmarkDelete: '¿Eliminar marcador "{name}"?',
        visits: 'Visitas',
        created: 'Creado',
        autoSave: 'Guardado Automático',
        autoSaveDesc: 'Guardar posiciones automáticamente',
        trackingMode: 'Modo Seguimiento',
        trackingModeDesc: 'Guardado más frecuente (1s en lugar de 2s)',
        notifications: 'Notificaciones',
        notificationsDesc: 'Mostrar mensajes emergentes arriba a la derecha',
        sortOrder: 'Ordenar Historial',
        newestFirst: 'Más recientes primero',
        oldestFirst: 'Más antiguos primero',
        dataManagement: 'Gestión de Datos',
        export: 'Exportar',
        import: 'Importar',
        exportDesc: 'Guarda todos los datos como archivo JSON',
        importDesc: 'Carga datos guardados (fusionar o reemplazar)',
        positions: 'Posiciones',
        totalDistance: 'Distancia Total',
        sessionDistance: 'Distancia de Sesión',
        sessionTime: 'Tiempo de Sesión',
        avgZoom: 'Zoom Promedio',
        marked: 'Marcado',
        sessionPos: 'Pos. Sesión',
        current: 'Actual',
        markButton: 'Marcar posición',
        unmarkButton: 'Quitar posición',
        bookmarkButton: 'Guardar como marcador',
        instructionsTitle: 'Instrucciones y Atajos',
        altLeft: 'Alt + ← Posición Anterior',
        altRight: 'Alt + → Posición Siguiente',
        clickHistory: 'Haz clic en entrada del historial para saltar directamente',
        starButton: '★ Button Marcar posición',
        bookmarkButtonDesc: '🔖 Button Guardar como marcador',
        historyStores: 'El historial almacena hasta 100 posiciones',
        autoSavePositions: 'Las nuevas posiciones se guardan automáticamente al mover el mapa',
        autoLoadHistory: 'El historial se guarda automáticamente y se carga en el próximo inicio',
        markedHighlight: 'Las posiciones marcadas se resaltan en la lista',
        highlightPersist: 'Los resaltados persisten incluso después del reinicio',
        exportImport: 'Todos los datos se pueden hacer copia de seguridad mediante exportación/importación',
        shortcutsLine: 'Alt+←/→ Navegación | Ctrl+B Marcador | Ctrl+H Historial | Ctrl+Shift+S Exportar',
        navigatedTo: 'Navegado a:',
        navigationError: 'Error de navegación:',
        backTo: 'Atrás a:',
        forwardTo: 'Adelante a:',
        alreadyAtStart: 'Ya al principio del historial',
        alreadyAtEnd: 'Ya al final del historial',
        noSearchResults: 'No se encontraron resultados de búsqueda',
        duration: 'Duración:',
        workAreaAdded: 'Área de trabajo "{name}" añadida',
        workAreaRemoved: 'Área de trabajo eliminada',
        navigatedToWorkArea: 'Navegado al área de trabajo:',
        workAreaNavigationError: 'Error al navegar al área de trabajo:',
        bookmarkError: 'Error al añadir marcador:',
        dataExported: 'Datos exportados: {positions} posiciones, {bookmarks} marcadores',
        dataMerged: 'Datos fusionados exitosamente',
        dataReplaced: 'Datos reemplazados exitosamente',
        importComplete: 'Importación completada: {positions} posiciones, {bookmarks} marcadores',
        importError: 'Error de importación:',
        invalidFileStructure: 'Estructura de archivo inválida',
        mergeOrReplace: '¿Desea fusionar los datos (OK) o reemplazar completamente (Cancelar)?',
        autoSaveEnabled: 'Guardado automático activado',
        autoSaveDisabled: 'Guardado automático desactivado',
        trackingModeEnabled: 'Modo seguimiento activado',
        trackingModeDisabled: 'Modo seguimiento desactivado',
        notificationsEnabled: 'Notificaciones popup activadas',
        notificationsDisabled: 'Notificaciones popup desactivadas',
        sortingChanged: 'Ordenamiento cambiado a:',
        scriptActivated: 'Navigation History+ Ultimate activado - Historial reparado',
        workAreaName: 'Nombre del área de trabajo:',
        position: 'Posición',
        of: 'de',
        noHistoryAvailable: 'Sin historial disponible',
        initializing: 'Inicializando...'
    },
    fr: {
        scriptLoaded: 'Script chargé avec succès',
        back: 'Retour',
        forward: 'Suivant',
        history: 'Historique',
        bookmarks: 'Signets',
        statistics: 'Statistiques',
        settings: 'Paramètres',
        search: 'Rechercher dans l\'historique, signets...',
        delete: 'Supprimer',
        add: 'Ajouter',
        close: 'Fermer',
        noHistory: 'Aucun historique disponible',
        noBookmarks: 'Aucun signet disponible',
        noAreas: 'Aucune zone de travail définie',
        controls: 'Contrôles:',
        hints: 'Conseils:',
        shortcuts: 'Raccourcis:',
        updateTitle: 'Mise à jour WME Nav History!',
        updateNew: 'Nouveau:',
        updateFeature1: 'Instructions masquées dans une section repliable',
        updateFeature2: 'Plus d\'entrées visibles à la fois',
        updateFeature3: 'Support multilingue: 🇬🇧 Anglais, 🇮🇹 Italien, 🇪🇸 Espagnol, 🇫🇷 Français, 🇳🇱 Néerlandais',
        clearConfirm: 'Supprimer vraiment l\'historique? Cette action ne peut pas être annulée.',
        clearSuccess: 'Historique supprimé',
        bookmarkAdded: 'Signet "{name}" ajouté',
        bookmarkRemoved: 'Signet supprimé',
        bookmarkName: 'Nom du signet:',
        bookmarkDesc: 'Description (optionnel):',
        bookmarkDelete: 'Supprimer vraiment le signet "{name}"?',
        visits: 'Visites',
        created: 'Créé',
        autoSave: 'Sauvegarde Automatique',
        autoSaveDesc: 'Enregistrer automatiquement les positions',
        trackingMode: 'Mode Suivi',
        trackingModeDesc: 'Enregistrement plus fréquent (1s au lieu de 2s)',
        notifications: 'Notifications',
        notificationsDesc: 'Afficher les messages contextuels en haut à droite',
        sortOrder: 'Tri de l\'Historique',
        newestFirst: 'Plus récent en premier',
        oldestFirst: 'Plus ancien en premier',
        dataManagement: 'Gestion des Données',
        export: 'Exporter',
        import: 'Importer',
        exportDesc: 'Enregistre toutes les données en tant que fichier JSON',
        importDesc: 'Charge les données enregistrées (fusionner ou remplacer)',
        positions: 'Positions',
        totalDistance: 'Distance Totale',
        sessionDistance: 'Distance de Session',
        sessionTime: 'Temps de Session',
        avgZoom: 'Zoom Moyen',
        marked: 'Marqué',
        sessionPos: 'Pos. Session',
        current: 'Actuel',
        markButton: 'Marquer la position',
        unmarkButton: 'Retirer la position',
        bookmarkButton: 'Enregistrer comme signet',
        instructionsTitle: 'Instructions et Raccourcis',
        altLeft: 'Alt + ← Position Précédente',
        altRight: 'Alt + → Position Suivante',
        clickHistory: 'Cliquez sur l\'entrée d\'historique pour sauter directement',
        starButton: '★ Button Marquer la position',
        bookmarkButtonDesc: '🔖 Button Enregistrer comme signet',
        historyStores: 'L\'historique stocke jusqu\'à 100 positions',
        autoSavePositions: 'Les nouvelles positions sont automatiquement enregistrées lors du déplacement de la carte',
        autoLoadHistory: 'L\'historique est automatiquement enregistré et chargé au prochain démarrage',
        markedHighlight: 'Les positions marquées sont mises en évidence dans la liste',
        highlightPersist: 'Les mises en évidence persistent même après le redémarrage',
        exportImport: 'Toutes les données peuvent être sauvegardées via l\'exportation/importation',
        shortcutsLine: 'Alt+←/→ Navigation | Ctrl+B Signet | Ctrl+H Historique | Ctrl+Shift+S Exporter',
        navigatedTo: 'Navigué vers:',
        navigationError: 'Erreur de navigation:',
        backTo: 'Retour à:',
        forwardTo: 'Suivant à:',
        alreadyAtStart: 'Déjà au début de l\'historique',
        alreadyAtEnd: 'Déjà à la fin de l\'historique',
        noSearchResults: 'Aucun résultat de recherche trouvé',
        duration: 'Durée:',
        workAreaAdded: 'Zone de travail "{name}" ajoutée',
        workAreaRemoved: 'Zone de travail supprimée',
        navigatedToWorkArea: 'Navigué vers la zone de travail:',
        workAreaNavigationError: 'Erreur de navigation vers la zone de travail:',
        bookmarkError: 'Erreur lors de l\'ajout du signet:',
        dataExported: 'Données exportées: {positions} positions, {bookmarks} signets',
        dataMerged: 'Données fusionnées avec succès',
        dataReplaced: 'Données remplacées avec succès',
        importComplete: 'Importation terminée: {positions} positions, {bookmarks} signets',
        importError: 'Erreur d\'importation:',
        invalidFileStructure: 'Structure de fichier invalide',
        mergeOrReplace: 'Voulez-vous fusionner les données (OK) ou remplacer complètement (Annuler)?',
        autoSaveEnabled: 'Sauvegarde automatique activée',
        autoSaveDisabled: 'Sauvegarde automatique désactivée',
        trackingModeEnabled: 'Mode suivi activé',
        trackingModeDisabled: 'Mode suivi désactivé',
        notificationsEnabled: 'Notifications popup activées',
        notificationsDisabled: 'Notifications popup désactivées',
        sortingChanged: 'Tri modifié en:',
        scriptActivated: 'Navigation History+ Ultimate activé - Historique réparé',
        workAreaName: 'Nom de la zone de travail:',
        position: 'Position',
        of: 'de',
        noHistoryAvailable: 'Aucun historique disponible',
        initializing: 'Initialisation...'
    },
    nl: {
        scriptLoaded: 'Script succesvol geladen',
        back: 'Terug',
        forward: 'Volgende',
        history: 'Geschiedenis',
        bookmarks: 'Bladwijzers',
        statistics: 'Statistieken',
        settings: 'Instellingen',
        search: 'Zoeken in geschiedenis, bladwijzers...',
        delete: 'Verwijderen',
        add: 'Toevoegen',
        close: 'Sluiten',
        noHistory: 'Geen geschiedenis beschikbaar',
        noBookmarks: 'Geen bladwijzers beschikbaar',
        noAreas: 'Geen werkgebieden gedefinieerd',
        controls: 'Bediening:',
        hints: 'Tips:',
        shortcuts: 'Sneltoetsen:',
        updateTitle: 'WME Nav History Update!',
        updateNew: 'Nieuw:',
        updateFeature1: 'Instructies verborgen in inklapbare sectie',
        updateFeature2: 'Meer items tegelijk zichtbaar',
        updateFeature3: 'Meertalige ondersteuning: 🇬🇧 Engels, 🇮🇹 Italiaans, 🇪🇸 Spaans, 🇫🇷 Frans, 🇳🇱 Nederlands',
        clearConfirm: 'Geschiedenis echt verwijderen? Deze actie kan niet ongedaan gemaakt worden.',
        clearSuccess: 'Geschiedenis verwijderd',
        bookmarkAdded: 'Bladwijzer "{name}" toegevoegd',
        bookmarkRemoved: 'Bladwijzer verwijderd',
        bookmarkName: 'Bladwijzernaam:',
        bookmarkDesc: 'Beschrijving (optioneel):',
        bookmarkDelete: 'Bladwijzer "{name}" echt verwijderen?',
        visits: 'Bezoeken',
        created: 'Gemaakt',
        autoSave: 'Automatisch Opslaan',
        autoSaveDesc: 'Posities automatisch opslaan',
        trackingMode: 'Traceermodus',
        trackingModeDesc: 'Vaker opslaan (1s in plaats van 2s)',
        notifications: 'Meldingen',
        notificationsDesc: 'Pop-upberichten rechtsboven weergeven',
        sortOrder: 'Geschiedenissortering',
        newestFirst: 'Nieuwste eerst',
        oldestFirst: 'Oudste eerst',
        dataManagement: 'Gegevensbeheer',
        export: 'Exporteren',
        import: 'Importeren',
        exportDesc: 'Slaat alle gegevens op als JSON-bestand',
        importDesc: 'Laadt opgeslagen gegevens (samenvoegen of vervangen)',
        positions: 'Posities',
        totalDistance: 'Totale Afstand',
        sessionDistance: 'Sessieafstand',
        sessionTime: 'Sessietijd',
        avgZoom: 'Gem. Zoom',
        marked: 'Gemarkeerd',
        sessionPos: 'Sessie Pos.',
        current: 'Huidige',
        markButton: 'Positie markeren',
        unmarkButton: 'Positie verwijderen',
        bookmarkButton: 'Opslaan als bladwijzer',
        instructionsTitle: 'Instructies en Sneltoetsen',
        altLeft: 'Alt + ← Vorige Positie',
        altRight: 'Alt + → Volgende Positie',
        clickHistory: 'Klik op geschiedenisitem om direct te springen',
        starButton: '★ Button Positie markeren',
        bookmarkButtonDesc: '🔖 Button Opslaan als bladwijzer',
        historyStores: 'Geschiedenis slaat tot 100 posities op',
        autoSavePositions: 'Nieuwe posities worden automatisch opgeslagen bij het verplaatsen van de kaart',
        autoLoadHistory: 'Geschiedenis wordt automatisch opgeslagen en geladen bij volgende start',
        markedHighlight: 'Gemarkeerde posities worden in de lijst gemarkeerd',
        highlightPersist: 'Markeringen blijven behouden na herstart',
        exportImport: 'Alle gegevens kunnen via export/import worden geback-upt',
        shortcutsLine: 'Alt+←/→ Navigatie | Ctrl+B Bladwijzer | Ctrl+H Geschiedenis | Ctrl+Shift+S Exporteren',
        navigatedTo: 'Genavigeerd naar:',
        navigationError: 'Navigatiefout:',
        backTo: 'Terug naar:',
        forwardTo: 'Volgende naar:',
        alreadyAtStart: 'Al aan het begin van de geschiedenis',
        alreadyAtEnd: 'Al aan het einde van de geschiedenis',
        noSearchResults: 'Geen zoekresultaten gevonden',
        duration: 'Duur:',
        workAreaAdded: 'Werkgebied "{name}" toegevoegd',
        workAreaRemoved: 'Werkgebied verwijderd',
        navigatedToWorkArea: 'Genavigeerd naar werkgebied:',
        workAreaNavigationError: 'Fout bij navigeren naar werkgebied:',
        bookmarkError: 'Fout bij toevoegen bladwijzer:',
        dataExported: 'Gegevens geëxporteerd: {positions} posities, {bookmarks} bladwijzers',
        dataMerged: 'Gegevens succesvol samengevoegd',
        dataReplaced: 'Gegevens succesvol vervangen',
        importComplete: 'Import voltooid: {positions} posities, {bookmarks} bladwijzers',
        importError: 'Importfout:',
        invalidFileStructure: 'Ongeldige bestandsstructuur',
        mergeOrReplace: 'Wilt u de gegevens samenvoegen (OK) of volledig vervangen (Annuleren)?',
        autoSaveEnabled: 'Automatisch opslaan ingeschakeld',
        autoSaveDisabled: 'Automatisch opslaan uitgeschakeld',
        trackingModeEnabled: 'Traceermodus ingeschakeld',
        trackingModeDisabled: 'Traceermodus uitgeschakeld',
        notificationsEnabled: 'Pop-upmeldingen ingeschakeld',
        notificationsDisabled: 'Pop-upmeldingen uitgeschakeld',
        sortingChanged: 'Sortering gewijzigd naar:',
        scriptActivated: 'Navigation History+ Ultimate geactiveerd - Geschiedenis gerepareerd',
        workAreaName: 'Werkgebiednaam:',
        position: 'Positie',
        of: 'van',
        noHistoryAvailable: 'Geen geschiedenis beschikbaar',
        initializing: 'Initialiseren...'
    }
};

function t(key) {
    return TRANSLATIONS[LANGUAGE]?.[key] || TRANSLATIONS.en[key] || key;
}

// Global variables - keeping Ultimate features but using Original API
const SCRIPT_VERSION = '2025.11.22';
let navigationHistory = [];
let currentIndex = -1;
let isInitialized = false;
let lastSaveTime = 0;
let bookmarks = [];
let workAreas = [];
let tags = [];
let sessionStartTime = Date.now();
let distanceTracker = { totalDistance: 0, sessionDistance: 0 };
let settings = {
    autoSave: true,
    trackingMode: false,
    smartNotifications: true,
    maxHistoryEntries: 100,
    saveInterval: 2000,
    sortOrder: 'newest' // 'newest' oder 'oldest'
};
let currentTab = 'history';
let searchQuery = '';
let highlightedPositions = {};

// Core utility functions
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function formatDistance(km) {
    if (km < 1) return Math.round(km * 1000) + 'm';
    return km.toFixed(2) + 'km';
}

function formatCoords(lat, lon) {
    return lat.toFixed(5) + ', ' + lon.toFixed(5);
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}

function formatSessionTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return hours + 'h ' + (minutes % 60) + 'm';
    if (minutes > 0) return minutes + 'm ' + (seconds % 60) + 's';
    return seconds + 's';
}

function generateLocationName(lat, lon, zoom, customName = null) {
    if (customName) return customName;

    const workArea = workAreas.find(area =>
        lat >= area.bounds.south && lat <= area.bounds.north &&
        lon >= area.bounds.west && lon <= area.bounds.east
    );

    if (workArea) return workArea.name + ' - Zoom ' + zoom;
    return 'Zoom ' + zoom + ' - ' + formatCoords(lat, lon);
}

function showNotification(message, type = 'info', duration = 3000) {
    if (!settings.smartNotifications) return;

    console.log('WME Nav History: ' + message);

    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:6px;color:white;font-weight:600;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.3);opacity:0;transform:translateX(100%);transition:all 0.3s ease;background:' + ({
        info: '#4a89dc',
        success: '#5cb85c',
        warning: '#f0ad4e',
        error: '#d9534f'
    }[type] || '#4a89dc');

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, duration);
}

// FIXED: Using EXACT same functions as working original
function saveCurrentPosition() {
    if (!isInitialized || !W.map) return;

    const now = Date.now();
    // Use trackingMode setting but keep Original timing logic
    if (now - lastSaveTime < (settings.trackingMode ? 1000 : settings.saveInterval)) return;

    const center = W.map.getCenter();
    const zoom = W.map.getZoom();

    const lastEntry = navigationHistory[currentIndex];
    if (lastEntry &&
        Math.abs(lastEntry.lat - center.lat) < 0.00001 &&
        Math.abs(lastEntry.lon - center.lon) < 0.00001 &&
        lastEntry.zoom === zoom) {
        return;
    }

    // Calculate distance for Ultimate features
    if (lastEntry) {
        const distance = calculateDistance(lastEntry.lat, lastEntry.lon, center.lat, center.lon);
        distanceTracker.totalDistance += distance;
        distanceTracker.sessionDistance += distance;
    }

    // Entferne alle Einträge nach dem aktuellen Index (für Verzweigungen)
    navigationHistory = navigationHistory.slice(0, currentIndex + 1);

    const newEntry = {
        id: Date.now(),
        lat: center.lat,
        lon: center.lon,
        zoom: zoom,
        timestamp: now,
        name: generateLocationName(center.lat, center.lon, zoom),
        marked: false,
        starred: false,
        tags: [],
        notes: '',
        duration: lastEntry ? now - lastEntry.timestamp : 0
    };

    navigationHistory.push(newEntry);
    currentIndex++;
    lastSaveTime = now;

    // Begrenze auf Einstellungen aber keep Original logic
    if (navigationHistory.length > settings.maxHistoryEntries) {
        const removedEntry = navigationHistory.shift();
        currentIndex--;

        // Update highlighted positions for Ultimate features
        if (removedEntry.marked && highlightedPositions[0]) {
            delete highlightedPositions[0];
        }

        const newHighlightedPositions = {};
        Object.keys(highlightedPositions).forEach(oldIndex => {
            const newIndex = parseInt(oldIndex) - 1;
            if (newIndex >= 0) {
                newHighlightedPositions[newIndex] = highlightedPositions[oldIndex];
            }
        });
        highlightedPositions = newHighlightedPositions;
    }

    updateNavigationButtons();
    updateHistoryList();
    saveToStorage();
}

// FIXED: Using EXACT same navigation as working original
function navigateToPosition(position, index) {
    if (!position || !isInitialized || !W.map) return;

    try {
        // EXACT same method as working original
        const lonlat = new OpenLayers.LonLat(position.lon, position.lat);
        W.map.setCenter(lonlat, position.zoom);

        if (typeof index !== 'undefined') {
            currentIndex = index;
            updateNavigationButtons();
            updateHistoryList();
        }

        showNotification(t('navigatedTo') + ' ' + position.name, 'success');
    } catch (error) {
        console.error('WME Map Nav History: Navigation error:', error);
        showNotification(t('navigationError') + ' ' + error.message, 'error');
    }
}

// FIXED: Using same key handling as original
function handleKeyDown(e) {
    if (!isInitialized) return;

    // Don't interfere with input fields
    if (document.activeElement.tagName.toLowerCase() === 'input' ||
        document.activeElement.tagName.toLowerCase() === 'textarea') {
        return;
    }

    if (e.altKey && e.keyCode === 37) { // Alt + Left
        navigateBack();
        e.preventDefault();
    }
    else if (e.altKey && e.keyCode === 39) { // Alt + Right
        navigateForward();
        e.preventDefault();
    }
    else if (e.ctrlKey && e.keyCode === 66) { // Ctrl + B
        addBookmarkCurrentPosition();
        e.preventDefault();
    }
    else if (e.ctrlKey && e.keyCode === 72) { // Ctrl + H
        switchTab('history');
        e.preventDefault();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === 83) { // Ctrl + Shift + S
        exportData();
        e.preventDefault();
    }
}

function navigateBack() {
    if (currentIndex > 0) {
        currentIndex--;
        navigateToPosition(navigationHistory[currentIndex]);
        updateNavigationButtons();
        updateHistoryList();
        showNotification(t('backTo') + ' ' + navigationHistory[currentIndex].name, 'info');
    } else {
        showNotification(t('alreadyAtStart'), 'warning');
    }
}

function navigateForward() {
    if (currentIndex < navigationHistory.length - 1) {
        currentIndex++;
        navigateToPosition(navigationHistory[currentIndex]);
        updateNavigationButtons();
        updateHistoryList();
        showNotification(t('forwardTo') + ' ' + navigationHistory[currentIndex].name, 'info');
    } else {
        showNotification(t('alreadyAtEnd'), 'warning');
    }
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('nav-history-back');
    const forwardBtn = document.getElementById('nav-history-forward');

    if (backBtn) {
        backBtn.disabled = currentIndex <= 0;
        backBtn.style.opacity = currentIndex <= 0 ? '0.5' : '1';
    }

    if (forwardBtn) {
        forwardBtn.disabled = currentIndex >= navigationHistory.length - 1;
        forwardBtn.style.opacity = currentIndex >= navigationHistory.length - 1 ? '0.5' : '1';
    }

    // Update status display for Ultimate features
    const statusElement = document.getElementById('nav-status');
    if (statusElement) {
        if (navigationHistory.length > 0) {
            statusElement.textContent = t('position') + ' ' + (currentIndex + 1) + ' ' + t('of') + ' ' + navigationHistory.length;
        } else {
            statusElement.textContent = t('noHistoryAvailable');
        }
    }
}

// Position highlighting from original - FIXED
function togglePositionHighlight(index) {
    const position = navigationHistory[index];
    if (!position) return;

    if (highlightedPositions[index]) {
        delete highlightedPositions[index];
        position.marked = false;
    } else {
        highlightedPositions[index] = true;
        position.marked = true;
    }

    updateHistoryList();
    saveToStorage();
}

// FIXED: History list update using exact original logic
function updateHistoryList() {
    const historyContainer = document.getElementById('nav-history-list');
    if (!historyContainer) return;

    // Handle search and filtering
    let filteredHistory = searchQuery ?
        navigationHistory.filter(entry =>
            entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formatCoords(entry.lat, entry.lon).includes(searchQuery)
        ) : [...navigationHistory];

    // Apply sorting
    if (settings.sortOrder === 'oldest') {
        filteredHistory.sort((a, b) => a.timestamp - b.timestamp);
    } else {
        filteredHistory.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (filteredHistory.length === 0) {
        historyContainer.innerHTML = '<div class="no-history">' + (searchQuery ? t('noSearchResults') : t('noHistory')) + '</div>';
        return;
    }

    let html = '';
    filteredHistory.forEach((entry) => {
        const actualIndex = navigationHistory.indexOf(entry);
        const isCurrent = actualIndex === currentIndex;
        const isMarked = entry.marked || false;
        const time = formatTime(entry.timestamp);

        html += `
            <div class="history-item ${isCurrent ? 'current' : ''} ${isMarked ? 'marked' : ''}" data-index="${actualIndex}">
                <div class="history-item-header">
                    <span class="history-item-time">${time}</span>
                    <div class="history-item-controls">
                        ${isCurrent ? '<span class="current-marker">' + t('current') + '</span>' : ''}
                        <button class="mark-button ${isMarked ? 'marked' : ''}" data-index="${actualIndex}" title="${isMarked ? t('unmarkButton') : t('markButton')}">
                            ${isMarked ? '★' : '☆'}
                        </button>
                        <button class="bookmark-button" data-index="${actualIndex}" title="${t('bookmarkButton')}">
                            🔖
                        </button>
                    </div>
                </div>
                <div class="history-item-location">
                    ${entry.name}
                </div>
                <div class="history-item-coords">
                    ${formatCoords(entry.lat, entry.lon)}
                </div>
                ${entry.duration ? '<div class="history-item-duration">' + t('duration') + ' ' + formatSessionTime(entry.duration) + '</div>' : ''}
            </div>
        `;
    });

    historyContainer.innerHTML = html;

    // FIXED: Event Listener - exactly like original
    historyContainer.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('mark-button') || e.target.classList.contains('bookmark-button')) {
                return;
            }
            const index = parseInt(this.dataset.index);
            navigateToPosition(navigationHistory[index], index);
        });
    });

    // FIXED: Marker buttons - exactly like original
    historyContainer.querySelectorAll('.mark-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            togglePositionHighlight(index);
        });
    });

    // Event Listener für Bookmark-Buttons
    historyContainer.querySelectorAll('.bookmark-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            const entry = navigationHistory[index];
            if (entry) {
                const name = prompt(t('bookmarkName'), entry.name);
                if (name) addBookmark(name, entry.lat, entry.lon, entry.zoom);
            }
        });
    });
}

// Bookmark management - Ultimate features with Original API
function addBookmark(name, lat, lon, zoom, description = '', tags = []) {
    const bookmark = {
        id: Date.now(),
        name: name || generateLocationName(lat, lon, zoom),
        lat: lat,
        lon: lon,
        zoom: zoom,
        timestamp: Date.now(),
        description: description,
        tags: tags,
        visits: 0,
        lastVisited: null
    };

    bookmarks.push(bookmark);
    saveToStorage();
    updateUI();
    showNotification(t('bookmarkAdded').replace('{name}', bookmark.name), 'success');
    return bookmark;
}

function addBookmarkCurrentPosition() {
    if (!W || !W.map) return;

    try {
        const center = W.map.getCenter();
        const zoom = W.map.getZoom();

        const name = prompt(t('bookmarkName'));
        if (name) {
            const description = prompt(t('bookmarkDesc')) || '';
            addBookmark(name, center.lat, center.lon, zoom, description);
        }
    } catch (error) {
        console.error('Error adding bookmark:', error);
        showNotification(t('bookmarkError') + ' ' + error.message, 'error');
    }
}

function removeBookmark(id) {
    bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    saveToStorage();
    updateUI();
    showNotification(t('bookmarkRemoved'), 'info');
}

function navigateToBookmark(bookmark) {
    bookmark.visits++;
    bookmark.lastVisited = Date.now();
    navigateToPosition(bookmark);
    saveToStorage();
    updateUI();
}

// Work area management
function addWorkArea() {
    if (!W || !W.map) return;

    try {
        const center = W.map.getCenter();
        const zoom = W.map.getZoom();

        const name = prompt(t('workAreaName'));
        if (!name) return;

        const offset = 0.01 / Math.pow(2, zoom - 10);

        const workArea = {
            id: Date.now(),
            name: name,
            bounds: {
                north: center.lat + offset,
                south: center.lat - offset,
                east: center.lon + offset,
                west: center.lon - offset
            },
            created: Date.now(),
            visits: 0,
            color: '#' + Math.floor(Math.random()*16777215).toString(16)
        };

        workAreas.push(workArea);
        saveToStorage();
        updateUI();
        showNotification(t('workAreaAdded').replace('{name}', name), 'success');
    } catch (error) {
        console.error('Error adding work area:', error);
    }
}

function removeWorkArea(id) {
    workAreas = workAreas.filter(area => area.id !== id);
    saveToStorage();
    updateUI();
    showNotification(t('workAreaRemoved'), 'info');
}

function navigateToWorkArea(workArea) {
    const centerLat = (workArea.bounds.north + workArea.bounds.south) / 2;
    const centerLon = (workArea.bounds.east + workArea.bounds.west) / 2;

    try {
        // EXACT same method as working original
        const lonlat = new OpenLayers.LonLat(centerLon, centerLat);
        W.map.setCenter(lonlat, 15);

        workArea.visits++;
        saveToStorage();
        updateUI();
        showNotification(t('navigatedToWorkArea') + ' ' + workArea.name, 'info');
    } catch (error) {
        console.error('Error navigating to work area:', error);
        showNotification(t('workAreaNavigationError') + ' ' + error.message, 'error');
    }
}

// Data management - Ultimate features
function saveToStorage() {
    try {
        const data = {
            version: SCRIPT_VERSION,
            history: navigationHistory,
            currentIndex: currentIndex,
            bookmarks: bookmarks,
            workAreas: workAreas,
            tags: tags,
            distanceTracker: distanceTracker,
            settings: settings,
            highlightedPositions: highlightedPositions,
            lastSave: Date.now()
        };
        localStorage.setItem('wme-nav-history-ultimate', JSON.stringify(data));
    } catch (error) {
        console.error('WME Nav History: Storage error:', error);
    }
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem('wme-nav-history-ultimate');
        if (data) {
            const parsed = JSON.parse(data);
            const savedVersion = parsed.version || '0.0.0';
            
            navigationHistory = parsed.history || [];
            currentIndex = parsed.currentIndex || -1;
            bookmarks = parsed.bookmarks || [];
            workAreas = parsed.workAreas || [];
            tags = parsed.tags || [];
            distanceTracker = parsed.distanceTracker || { totalDistance: 0, sessionDistance: 0 };
            settings = Object.assign(settings, parsed.settings || {});
            highlightedPositions = parsed.highlightedPositions || {};

            if (currentIndex >= navigationHistory.length) {
                currentIndex = navigationHistory.length - 1;
            }
            
            // Check for version update - only show if new version is higher
            console.log('WME Nav History: Saved version:', savedVersion, 'Current version:', SCRIPT_VERSION);
            if (savedVersion !== SCRIPT_VERSION && compareVersions(SCRIPT_VERSION, savedVersion) > 0) {
                console.log('WME Nav History: Showing update notification');
                showUpdateNotification(savedVersion, SCRIPT_VERSION);
            } else {
                console.log('WME Nav History: No update notification needed');
            }
        }
    } catch (error) {
        console.error('WME Nav History: Load error:', error);
    }
}

function compareVersions(v1, v2) {
    // Compare version strings (e.g., "2025.11.20" vs "2025.11.19")
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;
        
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    
    return 0;
}

function showUpdateNotification(oldVersion, newVersion) {
    const notification = document.createElement('div');
    notification.innerHTML = 
        '<button id="update-notification-close" style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.2);border:none;color:white;font-size:20px;width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s ease;font-weight:bold;line-height:1;" onmouseover="this.style.background=\'rgba(255,255,255,0.3)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.2)\'">×</button>' +
        '<div style="font-weight:700;font-size:16px;margin-bottom:10px;color:#fff;">' +
            '🎉 ' + t('updateTitle') +
        '</div>' +
        '<div style="font-size:13px;margin-bottom:8px;color:#fff;">' +
            'Version ' + oldVersion + ' → ' + newVersion +
        '</div>' +
        '<div style="font-size:12px;line-height:1.5;color:#f0f0f0;">' +
            '✨ <strong>' + t('updateNew') + '</strong><br>' +
            '• ' + t('updateFeature1') + '<br>' +
            '• ' + t('updateFeature2') + '<br>' +
            '• ' + t('updateFeature3') +
        '</div>';
    notification.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        padding: 25px 30px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-width: 320px;
        max-width: 400px;
        opacity: 0;
        transition: opacity 0.4s ease;
        border: 2px solid rgba(255,255,255,0.2);
    `;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.4s ease;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(notification);

    setTimeout(() => {
        overlay.style.opacity = '1';
        notification.style.opacity = '1';
    }, 100);

    const closeNotification = () => {
        overlay.style.opacity = '0';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 400);
    };

    const closeButton = notification.querySelector('#update-notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeNotification);
    }

    overlay.addEventListener('click', closeNotification);
    setTimeout(closeNotification, 8000);
}

function clearHistory() {
    if (confirm(t('clearConfirm'))) {
        highlightedPositions = {};
        navigationHistory = [];
        currentIndex = -1;
        distanceTracker.sessionDistance = 0;
        updateNavigationButtons();
        updateHistoryList();
        saveToStorage();
        showNotification(t('clearSuccess'), 'info');
    }
}

function exportData() {
    const exportData = {
        navigationHistory: navigationHistory,
        bookmarks: bookmarks,
        workAreas: workAreas,
        tags: tags,
        distanceTracker: distanceTracker,
        settings: settings,
        exportDate: new Date().toISOString(),
        version: '2025.08.13-Ultimate-Fixed-History'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'wme-nav-history-' + new Date().toISOString().split('T')[0] + '.json');
    linkElement.click();

    showNotification(t('dataExported').replace('{positions}', navigationHistory.length).replace('{bookmarks}', bookmarks.length), 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!importedData || typeof importedData !== 'object') {
                    throw new Error(t('invalidFileStructure'));
                }

                const merge = confirm(t('mergeOrReplace'));

                if (merge) {
                    if (importedData.navigationHistory && Array.isArray(importedData.navigationHistory)) {
                        navigationHistory = [...navigationHistory, ...importedData.navigationHistory];
                    }
                    if (importedData.bookmarks && Array.isArray(importedData.bookmarks)) {
                        bookmarks = [...bookmarks, ...importedData.bookmarks];
                    }
                    if (importedData.workAreas && Array.isArray(importedData.workAreas)) {
                        workAreas = [...workAreas, ...importedData.workAreas];
                    }
                    if (importedData.tags && Array.isArray(importedData.tags)) {
                        tags = [...new Set([...tags, ...importedData.tags])];
                    }
                    showNotification(t('dataMerged'), 'success');
                } else {
                    navigationHistory = importedData.navigationHistory || [];
                    bookmarks = importedData.bookmarks || [];
                    workAreas = importedData.workAreas || [];
                    tags = importedData.tags || [];

                    if (importedData.distanceTracker) {
                        distanceTracker.totalDistance = importedData.distanceTracker.totalDistance || 0;
                    }

                    if (importedData.settings) {
                        settings = Object.assign(settings, importedData.settings);
                    }

                    showNotification(t('dataReplaced'), 'success');
                }

                currentIndex = Math.max(0, navigationHistory.length - 1);

                navigationHistory = navigationHistory.filter(entry =>
                    entry && typeof entry.lat === 'number' && typeof entry.lon === 'number'
                );

                updateUI();
                saveToStorage();

                showNotification(t('importComplete').replace('{positions}', navigationHistory.length).replace('{bookmarks}', bookmarks.length), 'success');
            } catch (error) {
                console.error('Import error:', error);
                showNotification(t('importError') + ' ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// UI Updates for Ultimate features
function updateUI() {
    updateNavigationButtons();
    updateContent();
}

function updateContent() {
    const contentArea = document.getElementById('nav-content-area');
    if (!contentArea) return;

    while (contentArea.firstChild) {
        contentArea.removeChild(contentArea.firstChild);
    }

    // Set full height for statistics and settings tabs
    if (currentTab === 'statistics' || currentTab === 'settings') {
        contentArea.classList.add('full-height');
    } else {
        contentArea.classList.remove('full-height');
    }

    switch(currentTab) {
        case 'history':
            renderHistoryContent(contentArea);
            break;
        case 'bookmarks':
            renderBookmarksContent(contentArea);
            break;
        case 'areas':
            renderWorkAreasContent(contentArea);
            break;
        case 'statistics':
            renderStatisticsContent(contentArea);
            break;
        case 'settings':
            renderSettingsContent(contentArea);
            break;
    }
}

function renderHistoryContent(container) {
    // Clear container first
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create history list container if it doesn't exist
    let historyList = document.getElementById('nav-history-list');
    if (!historyList) {
        historyList = document.createElement('div');
        historyList.id = 'nav-history-list';
        historyList.className = 'history-list';
        historyList.style.cssText = 'max-height: 800px; overflow-y: auto;';
        container.appendChild(historyList);
    } else {
        container.appendChild(historyList);
    }

    // Update the history list content
    updateHistoryList();
}

function renderBookmarksContent(container) {
    if (bookmarks.length === 0) {
        const noBookmarks = document.createElement('div');
        noBookmarks.textContent = t('noBookmarks');
        noBookmarks.style.cssText = 'padding:20px;text-align:center;color:#666;font-style:italic;';
        container.appendChild(noBookmarks);
        return;
    }

    bookmarks.forEach(bookmark => {
        const item = document.createElement('div');
        item.style.cssText = 'padding:12px;border-bottom:1px solid #eee;cursor:pointer;transition:background 0.2s;border-left:3px solid #28a745;';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;';

        const name = document.createElement('span');
        name.textContent = bookmark.name;
        name.style.cssText = 'font-weight:600;color:#2c3e50;';
        header.appendChild(name);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(t('bookmarkDelete').replace('{name}', bookmark.name))) {
                removeBookmark(bookmark.id);
            }
        });
        header.appendChild(deleteBtn);

        item.appendChild(header);

        const details = document.createElement('div');
        details.style.cssText = 'font-size:11px;color:#666;margin-bottom:3px;';
        details.textContent = formatCoords(bookmark.lat, bookmark.lon) + ' | ' + t('visits') + ': ' + bookmark.visits;
        item.appendChild(details);

        if (bookmark.description) {
            const description = document.createElement('div');
            description.textContent = bookmark.description;
            description.style.cssText = 'font-size:12px;color:#666;margin:5px 0;font-style:italic;';
            item.appendChild(description);
        }

        item.addEventListener('click', () => navigateToBookmark(bookmark));
        container.appendChild(item);
    });
}

function renderWorkAreasContent(container) {
    if (workAreas.length === 0) {
        const noAreas = document.createElement('div');
        noAreas.textContent = t('noAreas');
        noAreas.style.cssText = 'padding:20px;text-align:center;color:#666;font-style:italic;';
        container.appendChild(noAreas);
        return;
    }

    workAreas.forEach(area => {
        const item = document.createElement('div');
        item.style.cssText = 'padding:12px;border-bottom:1px solid #eee;cursor:pointer;transition:background 0.2s;';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;';

        const nameContainer = document.createElement('div');
        nameContainer.style.cssText = 'display:flex;align-items:center;gap:8px;';

        const colorIndicator = document.createElement('span');
        colorIndicator.style.cssText = 'width:12px;height:12px;border-radius:50%;background:' + area.color;
        nameContainer.appendChild(colorIndicator);

        const name = document.createElement('span');
        name.textContent = area.name;
        name.style.cssText = 'font-weight:600;color:#2c3e50;';
        nameContainer.appendChild(name);

        header.appendChild(nameContainer);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:12px;';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(t('bookmarkDelete').replace('{name}', area.name))) {
                removeWorkArea(area.id);
            }
        });
        header.appendChild(deleteBtn);

        item.appendChild(header);

        const details = document.createElement('div');
        details.style.cssText = 'font-size:11px;color:#666;';
        details.textContent = t('visits') + ': ' + area.visits + ' | ' + t('created') + ': ' + formatDate(area.created);
        item.appendChild(details);

        item.addEventListener('click', () => navigateToWorkArea(area));
        container.appendChild(item);
    });
}

function renderStatisticsContent(container) {
    const sessionTime = Date.now() - sessionStartTime;
    const avgZoom = navigationHistory.length > 0 ?
        navigationHistory.reduce((sum, entry) => sum + entry.zoom, 0) / navigationHistory.length : 0;

    // Calculate marked positions count
    const markedCount = navigationHistory.filter(e => e.marked).length;

    // Get session positions (positions added this session)
    const sessionPositions = navigationHistory.filter(entry =>
        entry.timestamp >= sessionStartTime
    ).length;

    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));gap:8px;padding:10px;width:100%;';

    const stats = [
        { value: navigationHistory.length.toString(), label: t('positions') },
        { value: bookmarks.length.toString(), label: t('bookmarks') },
        { value: markedCount.toString(), label: t('marked') },
        { value: sessionPositions.toString(), label: t('sessionPos') },
        { value: formatDistance(distanceTracker.totalDistance), label: t('totalDistance') },
        { value: formatDistance(distanceTracker.sessionDistance), label: t('sessionDistance') },
        { value: formatSessionTime(sessionTime), label: t('sessionTime') },
        { value: avgZoom.toFixed(1), label: t('avgZoom') }
    ];

    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.style.cssText = 'text-align:center;padding:8px;background:#f8f9fa;border-radius:4px;border:1px solid #e9ecef;min-width:0;';

        const value = document.createElement('div');
        value.textContent = stat.value;
        value.style.cssText = 'font-size:14px;font-weight:bold;color:#4a89dc;margin-bottom:2px;word-break:break-all;';
        statItem.appendChild(value);

        const label = document.createElement('div');
        label.textContent = stat.label;
        label.style.cssText = 'font-size:9px;color:#666;text-transform:uppercase;letter-spacing:0.3px;line-height:1.1;word-break:break-word;';
        statItem.appendChild(label);

        statsGrid.appendChild(statItem);
    });

    container.appendChild(statsGrid);
}

function renderSettingsContent(container) {
    const settingsContainer = document.createElement('div');
    settingsContainer.style.cssText = 'padding:10px;';

    // Auto Save Setting
    const autoSaveContainer = document.createElement('div');
    autoSaveContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const autoSaveTitle = document.createElement('h4');
    autoSaveTitle.textContent = t('autoSave');
    autoSaveTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    autoSaveContainer.appendChild(autoSaveTitle);

    const autoSaveLabel = document.createElement('label');
    autoSaveLabel.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;';

    const autoSaveCheckbox = document.createElement('input');
    autoSaveCheckbox.type = 'checkbox';
    autoSaveCheckbox.checked = settings.autoSave;
    autoSaveCheckbox.addEventListener('change', () => {
        settings.autoSave = autoSaveCheckbox.checked;
        saveToStorage();
        showNotification(settings.autoSave ? t('autoSaveEnabled') : t('autoSaveDisabled'), 'info');
    });
    autoSaveLabel.appendChild(autoSaveCheckbox);

    const autoSaveText = document.createElement('span');
    autoSaveText.textContent = t('autoSaveDesc');
    autoSaveLabel.appendChild(autoSaveText);

    autoSaveContainer.appendChild(autoSaveLabel);
    settingsContainer.appendChild(autoSaveContainer);

    // Tracking Mode Setting
    const trackingContainer = document.createElement('div');
    trackingContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const trackingTitle = document.createElement('h4');
    trackingTitle.textContent = t('trackingMode');
    trackingTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    trackingContainer.appendChild(trackingTitle);

    const trackingLabel = document.createElement('label');
    trackingLabel.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;';

    const trackingCheckbox = document.createElement('input');
    trackingCheckbox.type = 'checkbox';
    trackingCheckbox.checked = settings.trackingMode;
    trackingCheckbox.addEventListener('change', () => {
        settings.trackingMode = trackingCheckbox.checked;
        saveToStorage();
        showNotification(settings.trackingMode ? t('trackingModeEnabled') : t('trackingModeDisabled'), 'info');
    });
    trackingLabel.appendChild(trackingCheckbox);

    const trackingText = document.createElement('span');
    trackingText.textContent = t('trackingModeDesc');
    trackingLabel.appendChild(trackingText);

    trackingContainer.appendChild(trackingLabel);
    settingsContainer.appendChild(trackingContainer);

    // Notifications Setting
    const notificationsContainer = document.createElement('div');
    notificationsContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const notificationsTitle = document.createElement('h4');
    notificationsTitle.textContent = t('notifications');
    notificationsTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    notificationsContainer.appendChild(notificationsTitle);

    const notificationsLabel = document.createElement('label');
    notificationsLabel.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;';

    const notificationsCheckbox = document.createElement('input');
    notificationsCheckbox.type = 'checkbox';
    notificationsCheckbox.checked = settings.smartNotifications;
    notificationsCheckbox.addEventListener('change', () => {
        settings.smartNotifications = notificationsCheckbox.checked;
        saveToStorage();
        showNotification(settings.smartNotifications ? t('notificationsEnabled') : t('notificationsDisabled'), 'info');
    });
    notificationsLabel.appendChild(notificationsCheckbox);

    const notificationsText = document.createElement('span');
    notificationsText.textContent = t('notificationsDesc');
    notificationsLabel.appendChild(notificationsText);

    notificationsContainer.appendChild(notificationsLabel);
    settingsContainer.appendChild(notificationsContainer);

    // Sort Order Setting
    const sortContainer = document.createElement('div');
    sortContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const sortTitle = document.createElement('h4');
    sortTitle.textContent = t('sortOrder');
    sortTitle.style.cssText = 'margin:0 0 8px 0;color:#2c3e50;font-size:14px;';
    sortContainer.appendChild(sortTitle);

    const sortSelect = document.createElement('select');
    sortSelect.style.cssText = 'width:100%;padding:6px;border:1px solid #e1e4e8;border-radius:4px;font-size:12px;';
    sortSelect.innerHTML = `
        <option value="newest" ${settings.sortOrder === 'newest' ? 'selected' : ''}>${t('newestFirst')}</option>
        <option value="oldest" ${settings.sortOrder === 'oldest' ? 'selected' : ''}>${t('oldestFirst')}</option>
    `;
    sortSelect.addEventListener('change', () => {
        settings.sortOrder = sortSelect.value;
        saveToStorage();
        updateUI();
        showNotification(t('sortingChanged') + ' ' + (settings.sortOrder === 'newest' ? t('newestFirst') : t('oldestFirst')), 'info');
    });
    sortContainer.appendChild(sortSelect);

    settingsContainer.appendChild(sortContainer);

    // Data Management
    const dataContainer = document.createElement('div');
    dataContainer.style.cssText = 'margin-bottom:15px;padding:12px;background:white;border-radius:6px;border:1px solid #e1e4e8;';

    const dataTitle = document.createElement('h4');
    dataTitle.textContent = t('dataManagement');
    dataTitle.style.cssText = 'margin:0 0 10px 0;color:#2c3e50;font-size:14px;';
    dataContainer.appendChild(dataTitle);

    const buttonGrid = document.createElement('div');
    buttonGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'nav-history-button';
    exportBtn.innerHTML = '📤<br>' + t('export');
    exportBtn.style.cssText = 'min-height:40px;font-size:11px;padding:6px;';
    exportBtn.addEventListener('click', exportData);
    buttonGrid.appendChild(exportBtn);

    const importBtn = document.createElement('button');
    importBtn.className = 'nav-history-button';
    importBtn.innerHTML = '📥<br>' + t('import');
    importBtn.style.cssText = 'min-height:40px;background:linear-gradient(135deg, #28a745, #1e7e34);font-size:11px;padding:6px;';
    importBtn.addEventListener('click', importData);
    buttonGrid.appendChild(importBtn);

    dataContainer.appendChild(buttonGrid);

    const description = document.createElement('div');
    description.style.cssText = 'font-size:10px;color:#666;line-height:1.3;';
    description.innerHTML = '<strong>' + t('export') + ':</strong> ' + t('exportDesc') + '<br><strong>' + t('import') + ':</strong> ' + t('importDesc');
    dataContainer.appendChild(description);

    settingsContainer.appendChild(dataContainer);
    container.appendChild(settingsContainer);
}

function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update header
    const headerTitle = document.getElementById('nav-header-title');
    const headerControls = document.getElementById('nav-header-controls');

    if (headerTitle && headerControls) {
        while (headerControls.firstChild) {
            headerControls.removeChild(headerControls.firstChild);
        }

        switch(tabName) {
            case 'history':
                headerTitle.textContent = t('history');
                const clearBtn = document.createElement('button');
                clearBtn.className = 'nav-history-button clear-history-button';
                clearBtn.textContent = '🗑️ ' + t('delete');
                clearBtn.addEventListener('click', clearHistory);
                headerControls.appendChild(clearBtn);
                break;

            case 'bookmarks':
                headerTitle.textContent = t('bookmarks');
                const addBookmarkBtn = document.createElement('button');
                addBookmarkBtn.className = 'nav-history-button';
                addBookmarkBtn.style.cssText = 'padding:4px 8px;font-size:12px;';
                addBookmarkBtn.textContent = '➕ ' + t('add');
                addBookmarkBtn.addEventListener('click', addBookmarkCurrentPosition);
                headerControls.appendChild(addBookmarkBtn);
                break;

            case 'statistics':
                headerTitle.textContent = t('statistics');
                break;

            case 'settings':
                headerTitle.textContent = t('settings');
                break;
        }
    }

    updateUI();
}

// FIXED: Using EXACT same sidebar creation as working original
async function createSidebarTab() {
    try {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-nav-history-ultimate");
        tabLabel.innerText = 'NAV+';
        tabLabel.title = 'Ultimate Navigation History';

        await W.userscripts.waitForElementConnected(tabPane);

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .nav-history-button {
                padding: 8px 15px;
                cursor: pointer;
                background: #4a89dc;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                min-width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }

            .nav-history-button:hover {
                background: #5d9cec;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                transform: translateY(-1px);
            }

            .nav-history-button:active {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }

            .nav-history-button:disabled {
                background: #b5b5b5;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .nav-history-container {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 10px 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            }

            .clear-history-button {
                background: #dc3545;
                padding: 6px 12px;
                font-size: 12px;
                min-width: auto;
            }

            .clear-history-button:hover {
                background: #c82333;
            }

            .history-section {
                margin-top: 20px;
                background: #fff;
                border-radius: 6px;
                border: 1px solid #e1e4e8;
            }

            .history-header {
                padding: 15px;
                border-bottom: 1px solid #e1e4e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
                border-radius: 6px 6px 0 0;
            }

            .history-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .history-list {
                max-height: 800px;
                overflow-y: auto;
            }

            .history-item {
                padding: 12px 15px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                transition: background-color 0.2s ease;
                position: relative;
            }

            .history-item:hover {
                background-color: #f8f9fa;
            }

            .history-item.current {
                background-color: #e8f4fd;
                border-left: 4px solid #4a89dc;
            }

            .history-item.marked {
                border-left: 4px solid #ffd700;
                background-color: #fffbf0;
            }

            .history-item.starred {
                border-left: 4px solid #ffd700;
                background-color: #fffbf0;
            }

            .history-item.current.marked {
                border-left: 4px solid #4a89dc;
                background: linear-gradient(to right, #e8f4fd, #fffbf0);
            }

            .history-item:last-child {
                border-bottom: none;
            }

            .history-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }

            .history-item-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .history-item-time {
                font-size: 12px;
                color: #666;
                font-weight: 600;
            }

            .current-marker {
                font-size: 10px;
                background: #4a89dc;
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: 600;
            }

            .mark-button, .bookmark-button {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                padding: 2px 4px;
                border-radius: 3px;
                transition: all 0.2s ease;
                color: #ccc;
            }

            .mark-button:hover, .bookmark-button:hover {
                background: rgba(0,0,0,0.1);
                color: #ffd700;
            }

            .mark-button.marked {
                color: #ffd700;
            }

            .history-item-location {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 3px;
                font-size: 13px;
            }

            .history-item-coords {
                font-size: 11px;
                color: #7f8c8d;
                font-family: monospace;
            }

            .history-item-duration {
                font-size: 11px;
                color: #666;
                margin-top: 3px;
            }

            .no-history {
                padding: 20px;
                text-align: center;
                color: #666;
                font-style: italic;
            }

            .nav-tabs {
                display: flex;
                background: linear-gradient(135deg, #e9ecef, #dee2e6);
                border-radius: 8px;
                margin-bottom: 15px;
                overflow: hidden;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            }

            .nav-tab-btn {
                flex: 1;
                padding: 8px 4px;
                background: transparent;
                border: none;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 9px;
                text-align: center;
                line-height: 1.1;
                color: #495057;
            }

            .nav-tab-btn:hover {
                background: rgba(74, 137, 220, 0.1);
            }

            .nav-tab-btn.active {
                background: linear-gradient(135deg, #4a89dc, #357abd);
                color: white;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
            }

            .nav-search {
                width: 100%;
                padding: 10px 15px;
                border: 2px solid #e9ecef;
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                margin-bottom: 15px;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
            }

            .nav-search:focus {
                outline: none;
                border-color: #4a89dc;
                box-shadow: 0 0 0 3px rgba(74, 137, 220, 0.1);
            }

            .nav-section {
                background: white;
                border-radius: 6px;
                border: 1px solid #e1e4e8;
                margin: 10px 0;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .nav-header {
                padding: 12px 15px;
                background: linear-gradient(135deg, #f1f3f4, #e8eaed);
                border-bottom: 1px solid #e1e4e8;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                color: #2c3e50;
            }

            .nav-content {
                max-height: 800px;
                overflow-y: auto;
                scrollbar-width: thin;
            }

            .nav-content.full-height {
                max-height: none;
                overflow-y: visible;
            }

            .nav-content::-webkit-scrollbar {
                width: 6px;
            }

            .nav-content::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            .nav-content::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(styleSheet);

        tabPane.innerHTML = `
            <div class="nav-history-container">
                <h5 style="margin-top: 0; color: #2c3e50;">WME Navigation History</h5>
                <p style="color: #4CAF50; display: flex; align-items: center; gap: 5px; margin: 0 0 5px 0;">
                    <span style="font-size: 18px;">✓</span> ${t('scriptLoaded')}
                </p>
                <div id="nav-status" style="font-size:10px;color:#666;margin:0 0 15px 0;">Initialisierung...</div>

                <input type="text" class="nav-search" placeholder="${t('search')}" id="nav-search-input">

                <div style="display: flex; gap: 15px; margin: 20px 0;">
                    <button id="nav-history-back" class="nav-history-button">
                        <span style="font-size: 16px;">⬅️</span> ${t('back')}
                    </button>
                    <button id="nav-history-forward" class="nav-history-button">
                        ${t('forward')} <span style="font-size: 16px;">➡️</span>
                    </button>
                </div>

                <div class="nav-tabs">
                    <button class="nav-tab-btn active" data-tab="history">📍<br>${t('history')}</button>
                    <button class="nav-tab-btn" data-tab="bookmarks">🔖<br>${t('bookmarks')}</button>
                    <button class="nav-tab-btn" data-tab="statistics">📊<br>${t('statistics')}</button>
                    <button class="nav-tab-btn" data-tab="settings">⚙️<br>${t('settings')}</button>
                </div>

                <div class="nav-section">
                    <div class="nav-header">
                        <strong id="nav-header-title">${t('history')}</strong>
                        <div id="nav-header-controls" style="display:flex;gap:5px;">
                            <button class="nav-history-button clear-history-button" id="clear-history">
                                🗑️ ${t('delete')}
                            </button>
                        </div>
                    </div>
                    <div id="nav-content-area" class="nav-content">
                        <div id="nav-history-list" class="history-list">
                            <div class="no-history">${t('noHistory')}</div>
                        </div>
                    </div>
                </div>

                <details style="margin-top:15px;background:white;border-radius:6px;border:1px solid #e1e4e8;">
                    <summary style="padding:12px 15px;cursor:pointer;font-weight:600;color:#2c3e50;user-select:none;list-style:none;display:flex;align-items:center;gap:8px;">
                        <span style="font-size:14px;">ℹ️</span> ${t('instructionsTitle')}
                    </summary>
                    <div style="padding:0 15px 15px 15px;">
                        <strong style="color: #2c3e50;">${t('controls')}</strong>
                        <ul style="padding-left: 20px; color: #4a5568; margin: 10px 0;">
                            <li>${t('altLeft')}</li>
                            <li>${t('altRight')}</li>
                            <li>${t('clickHistory')}</li>
                            <li>${t('starButton')}</li>
                            <li>${t('bookmarkButtonDesc')}</li>
                        </ul>

                        <strong style="color: #2c3e50;">${t('hints')}</strong>
                        <ul style="padding-left: 20px; color: #4a5568; margin: 10px 0;">
                            <li>${t('historyStores')}</li>
                            <li>${t('autoSavePositions')}</li>
                            <li>${t('autoLoadHistory')}</li>
                            <li>${t('markedHighlight')}</li>
                            <li>${t('highlightPersist')}</li>
                            <li>${t('exportImport')}</li>
                        </ul>

                        <strong style="color: #2c3e50;">${t('shortcuts')}</strong><br>
                        <span style="font-size: 11px; color: #666;">
                            ${t('shortcutsLine')}
                        </span>
                    </div>
                </details>
            </div>
        `;

        const backBtn = tabPane.querySelector('#nav-history-back');
        const forwardBtn = tabPane.querySelector('#nav-history-forward');
        const clearBtn = tabPane.querySelector('#clear-history');
        const searchInput = tabPane.querySelector('#nav-search-input');

        backBtn.addEventListener('click', navigateBack);
        forwardBtn.addEventListener('click', navigateForward);
        clearBtn.addEventListener('click', clearHistory);

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            updateUI();
        });

        // Tab switching
        tabPane.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });

        updateNavigationButtons();
        updateHistoryList();
        showNotification(t('scriptActivated'), 'success');

        return true;
    } catch (error) {
        console.error('WME Map Nav History: Error creating sidebar tab:', error);
        return false;
    }
}

// FIXED: Using EXACT same initialization as working original
function initializeScript() {
    if (isInitialized) return;

    try {
        loadFromStorage();

        // EXACT same event registration as working original
        W.map.events.register('moveend', null, saveCurrentPosition);
        document.addEventListener('keydown', handleKeyDown);

        createSidebarTab();

        isInitialized = true;
        saveCurrentPosition();

        console.log('WME Map Nav History Ultimate: Successfully initialized with fixed history display');
    } catch (error) {
        console.error('WME Map Nav History: Initialization error:', error);
        isInitialized = false;
    }
}

// EXACT same initialization check as working original
if (W?.userscripts?.state.isInitialized) {
    initializeScript();
} else {
    document.addEventListener("wme-initialized", initializeScript, {
        once: true,
    });
}

})();