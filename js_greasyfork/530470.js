// ==UserScript==
// @name         Mammouth.ai Auto Dark Mode
// @name:fr      Mammouth.ai Mode Sombre Automatique
// @namespace    http://violentmonkey.github.io/
// @version      2.0.1
// @description  Ajuste automatiquement le thème de Mammouth.ai selon les préférences du système
// @description:fr Ajuste automatiquement le thème de Mammouth.ai selon les préférences du système
// @author       AI Script Assistant
// @match        https://mammouth.ai/app/*
// @match        https://mammouth.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530470/Mammouthai%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530470/Mammouthai%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const THEME_KEY = 'nuxt-color-mode';
    const DEBUG = true;

    // Fonction de log
    function log(message) {
        if (DEBUG) console.log(`[Mammouth Auto Dark] ${message}`);
    }

    // Vérifie si le système préfère le mode sombre
    function systemPrefersDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Vérifie si la page est actuellement en mode sombre
    function isPageInDarkMode() {
        return localStorage.getItem(THEME_KEY) === 'dark' || document.documentElement.classList.contains('dark');
    }

    // Applique le thème souhaité
    function applyTheme(isDarkMode) {
        const theme = isDarkMode ? 'dark' : 'light';
        log(`Application du thème: ${theme}`);
        
        // Mise à jour du localStorage
        localStorage.setItem(THEME_KEY, theme);
        
        // Mise à jour des classes HTML
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
        
        // Si Nuxt est disponible, mettre à jour sa préférence de thème
        if (window.$nuxt && window.$nuxt.$colorMode) {
            window.$nuxt.$colorMode.preference = theme;
        }

        log(`Thème ${theme} appliqué`);
    }

    // Synchronise le thème avec les préférences système
    function syncThemeWithSystem() {
        const systemDark = systemPrefersDarkMode();
        const pageDark = isPageInDarkMode();
        
        log(`Système préfère le mode sombre: ${systemDark}, Page en mode sombre: ${pageDark}`);
        
        if (systemDark !== pageDark) {
            log('Différence détectée, mise à jour du thème');
            applyTheme(systemDark);
        } else {
            log('Le thème correspond déjà aux préférences système');
        }
    }

    // Configure l'écouteur pour les changements de préférences système
    function setupSystemPreferenceListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e) => {
            log(`Préférence système modifiée vers ${e.matches ? 'sombre' : 'clair'}`);
            applyTheme(e.matches);
        };
        
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', listener);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(listener);
        }
        
        log('Écouteur de préférences système configuré');
    }

    // Configure un MutationObserver pour détecter les changements SPA
    function setupObserver() {
        const observer = new MutationObserver(() => {
            log('Changements DOM significatifs détectés, vérification du thème');
            setTimeout(syncThemeWithSystem, 300);
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        log('MutationObserver configuré');
    }

    // Initialisation
    function initialize() {
        log('Initialisation du script Mode Sombre Automatique');
        log(`Préférences système: ${systemPrefersDarkMode() ? 'sombre' : 'clair'}`);
        log(`Thème actuel: ${localStorage.getItem(THEME_KEY) || 'non défini'}`);
        
        // Appliquer le thème initial
        syncThemeWithSystem();
        
        // Configurer les écouteurs pour les changements futurs
        setupSystemPreferenceListener();
        setupObserver();
        
        log('Initialisation terminée');
    }

    // Démarrer le script
    log('Script de Mode Sombre Automatique chargé');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();