// ==UserScript==
// @name         WaniKani Custom Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      1.5.4.1
// @description  A collection of custom scripts for editing the wanikani experience.
// @author       Wonderland-Nightmares
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @include      /^https://(www|preview).wanikani.com/subjects/(lesson|review)$/
// @resource     WKOF_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/wkof/wl-wanikani-wkof.user.js
// @resource     WKOF_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/wkof/wl-wanikani-wkof.user.css
// @resource     LOADER_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/dashboard-loader/wl-wanikani-dashboard-loader.user.js
// @resource     LOADER_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/dashboard-loader/wl-wanikani-dashboard-loader.user.css
// @resource     THEME_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/custom-themes/wl-wanikani-custom-themes.user.js
// @resource     DEFAULT_THEME_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/custom-themes/wl-wanikani-custom-themes-default.user.css
// @resource     DARK_THEME_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/custom-themes/wl-wanikani-custom-themes-dark.user.css
// @resource     WK_BREEZE_DARK_THEME_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/custom-themes/wl-wanikani-custom-themes-wanikani-breeze-dark.user.css
// @resource     INIT_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/dashboard-initialiser/wl-wanikani-dashboard-initialiser.user.js
// @resource     INIT_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/dashboard-initialiser/wl-wanikani-dashboard-initialiser.user.css
// @resource     DEBUG_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/debug/wl-wanikani-debug.user.js
// @resource     COMMON_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/common/wl-wanikani-common.user.js
// @resource     COMMON_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/common/wl-wanikani-common.user.css
// @resource     MAIN_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/main-summary/wl-wanikani-main-summary.user.js
// @resource     MAIN_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/main-summary/wl-wanikani-main-summary.user.css
// @resource     LEVEL_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/level-progress/wl-wanikani-level-progress.user.js
// @resource     LEVEL_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/level-progress/wl-wanikani-level-progress.user.css
// @resource     SRS_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/srs-summary/wl-wanikani-srs-summary.user.js
// @resource     SRS_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/srs-summary/wl-wanikani-srs-summary.user.css
// @resource     DIFFICULT_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/difficult-items/wl-wanikani-difficult-items.user.js
// @resource     DIFFICULT_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/difficult-items/wl-wanikani-difficult-items.user.css
// @resource     REFRESH_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/auto-refresh/wl-wanikani-auto-refresh.user.js
// @resource     ADDITIONAL_JS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/additional/wl-wanikani-additional.user.js
// @resource     ADDITIONAL_CSS https://raw.githubusercontent.com/wonderlands-nightmare/user-scripting/master/components/additional/wl-wanikani-additional.user.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422111/WaniKani%20Custom%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/422111/WaniKani%20Custom%20Dashboard.meta.js
// ==/UserScript==

(function () {
    /*************************************************
     *  ANCHOR Variable initialisation
     *************************************************/
    // WKOF modules required
    const wkofSettingsModules = 'Menu, Settings';
    const wkofDataModules = 'Apiv2, ItemData';

    // Dashboard resources
    const dashboardResources = {
        additional: {
            js: 'ADDITIONAL_JS',
            css: 'ADDITIONAL_CSS'
        },
        autoRefresh: {
            js: 'REFRESH_JS',
            css: ''
        },
        common: {
            js: 'COMMON_JS',
            css: 'COMMON_CSS'
        },
        customTheme: {
            js: 'THEME_JS',
            1: { // Default theme
                css: 'DEFAULT_THEME_CSS'
            },
            2: { // Dark theme
                css: 'DARK_THEME_CSS'
            }         
        },
        customCompatibilityTheme: {
            js: '',
            1: { // No compatibility theme
                css: ''
            },
            2: { // WaniKani Breeze Dark compatibility theme
                css: 'WK_BREEZE_DARK_THEME_CSS'
            }            
        },
        dashboardInitialiser: {
            js: 'INIT_JS',
            css: 'INIT_CSS'
        },
        dashboardLoader: {
            js: 'LOADER_JS',
            css: 'LOADER_CSS'
        },
        debug: {
            js: 'DEBUG_JS',
            css: ''
        },
        difficultItems: {
            js: 'DIFFICULT_JS',
            css: 'DIFFICULT_CSS'
        },
        levelProgress: {
            js: 'LEVEL_JS',
            css: 'LEVEL_CSS'
        },
        mainSummary: {
            js: 'MAIN_JS',
            css: 'MAIN_CSS'
        },
        srsSummary: {
            js: 'SRS_JS',
            css: 'SRS_CSS'
        },
        wkof: {
            js: 'WKOF_JS',
            css: 'WKOF_CSS'
        }
    }

    // WKOF settings check variables
    let wkofIntervalCounter = 0;


    /*************************************************
     *  ANCHOR Actual script execution code
     *************************************************/
    // Setup WKOF resources
    addResources(['wkof', 'dashboardLoader']);
    wkofInstallCheck();

    // Start loader if on dashboard
    if (window.location.href.match(dashboardUrlRegEx)) {
        dashboardLoader();
    }

    // Setup WKOF settings
    wkof.include(wkofSettingsModules);
    wkof.ready(wkofSettingsModules)
        .then(loadWkofMenu)
        .then(loadWkofSettings);
    
    // Setup interval to check for when WKOF and WK Custom Dashboard settings are loaded
    let wkofInterval = setInterval(() => {
        wkofIntervalCounter++;
        // First check for general WKOF settings
        if (wkof.settings) {
            console.log('WKOF settings have loaded.');
            // Second check for WK Custom Dashboard settings
            if (wkof.settings[scriptId]) {
                console.log('WK Custom Dashboard settings have loaded.');
                // Clear interval item and execute dashboard code
                clearInterval(wkofInterval);
                wkofExecution();
            }
        }
        
        // Fail test - if more than 10 seconds display failure and clear interval
        if (wkofIntervalCounter == 20) {
            wkofSettingsLoadFailed = true;
            clearInterval(wkofInterval);
            // Add error message to loader
            dashboardLoader(false, true);
        }
    }, 500)
    
    function wkofExecution() {
        addResources(['dashboardInitialiser', 'debug', 'common']);
        initialiseDashboardInitialiserComponent();
        
        if (window.location.href.match(dashboardUrlRegEx)) {
            wkof.include(wkofDataModules);
            wkof.ready(wkofDataModules)
                .then(getWkofDataObject)
                .then((data) => {
                    addResources(['customTheme', 'customCompatibilityTheme', 'mainSummary', 'levelProgress', 'srsSummary', 'difficultItems', 'autoRefresh']);
                    wkofItemsData.AllData = data;
                    wlWanikaniDebug('data', '==Main Executor== Data retrieved from WKOF:', wkofItemsData.AllData);
                    setCustomDashboardTheme();
                    setCustomDashboardCompatibilityTheme();
                })
                .then(() => {
                    initialiseMainSummaryComponent();
                    initialiseLevelProgressComponent();
                    initialiseSrsSummaryComponent();
                    initialiseDifficultItemsComponent();
                    autoRefreshOnNextReviewHour(wkofItemsData.AllData.SummaryData);
                    setTextColour();
                    dashboardLoader(true);
                });
        }

        if (window.location.href.match(sessionUrlRegEx)) {
            addResources(['additional']);
            skipReviewLessonSummary();
        }
    }


    /*************************************************
     *  ANCHOR Retrieves CSS and JS code through GM and adds to page
     *  Required to be in executor script due to GM functions
     *************************************************/
    function addResources(resourceNames) {
        $.each(resourceNames, (index, resourceName) => {
            const jsResource = dashboardResources[resourceName].js;
            let cssResource = '';

            // Add JS resource if specified
            if (jsResource != '') {
                const functionJs = GM_getResourceText(jsResource);

                let script = document.createElement('script');
                script.innerHTML = functionJs;
                script.type = 'text/javascript';
                script.className = 'custom-js ' + jsResource.replaceAll('_', '-').toLowerCase();

                document.body.appendChild(script);
            }

            // Required for custom themes since GM is not available in other files
            if (resourceName == 'customTheme') {
                customThemeCss = {
                    1: GM_getResourceText(dashboardResources[resourceName][1].css),
                    2: GM_getResourceText(dashboardResources[resourceName][2].css)
                }
            }
            else if (resourceName == 'customCompatibilityTheme') {
                customCompatibilityThemeCss = {
                    1: '',
                    2: GM_getResourceText(dashboardResources[resourceName][2].css)
                }
            }
            else {
                cssResource = dashboardResources[resourceName].css;
            }

            // Add CSS resource if specified
            if (cssResource != '') {
                const styleCss = GM_getResourceText(cssResource);
                
                if (resourceName == 'wkof') {
                    wcdDialogCss = styleCss;
                }
                else if (resourceName == 'additional') {
                    lessonSkipButtonCss = styleCss;
                }
                else {
                    GM_addStyle(styleCss);
                }
            }
        });
    };
})();
