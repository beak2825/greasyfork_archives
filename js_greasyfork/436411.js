// ==UserScript==
// @name                CBB - Shopify logs on esteroids
// @description         Useful logs in the console to identify store issues. Also, other useful CodeBlackBelt internal utilities.
// @version             1.1.2
// @author              Midefos
// @namespace           https://github.com/Midefos
// @match               *://*/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436411/CBB%20-%20Shopify%20logs%20on%20esteroids.user.js
// @updateURL https://update.greasyfork.org/scripts/436411/CBB%20-%20Shopify%20logs%20on%20esteroids.meta.js
// ==/UserScript==

// Those below variables can be changed to include new selectors.
var HIDDEN_VARIANT_SELECTORS = `select.product-form__variants, select.product-single__variants,
        	select.variant-selection__variants, .main-product__blocks input, #product-selectors,
			.ProductForm__Option select, #selected_variant, .no-js.product-form__option select`;

function watcher(selector, callback) {
    var interval = setInterval(function () {
        var element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 50);
}

function logInfo(message) {
    console.log(`%c [CBB] ${message} `, 'background: #096987; color: white; font-size: 13px;')
}

function logSuccess(message) {
    console.log(`%c [CBB] ${message} `, 'background: darkgreen; color: white; font-size: 13px;')
}

function logError(message) {
    console.log(`%c [CBB] ${message} `, 'background: darkred; color: white; font-size: 13px;')
}

function logWarning(message) {
    console.log(`%c [CBB] ${message} `, 'background: darkorange; color: white; font-size: 13px;')
}

function preventWindowBlockers() {
    watcher('div[style*="z-index: 999999999!important;"]', function (el1) {
        var el2 = el1.nextSibling;
        el1?.remove();
        el2?.remove();
    });

    watcher('div[style*="z-index:999999;"]', function (el1) {
        var el2 = el1.nextSibling;
        el1?.remove();
        el2?.remove();
    });
}

function automaticPassword() {
    var url = location.href;
    if (url.includes('/password') && url.includes('-theme-')) {
        document.querySelector('#password').value = '123456'
        document.querySelector('form[action="/password"] button').click();
    }
}

function init() {
    if (!isShopifyStore()) {
        logInfo(`Shopify store not found.`)
        return;
    }

    logInfo(`Shopify store found, loading app...`);

    preventWindowBlockers();
    automaticPassword();

    logThemeInfo();
    logInstalledApps();

    logPossibleHiddenVariantIds();
}

function isShopifyStore() {
    return unsafeWindow.Shopify
        && unsafeWindow.Shopify.shop;
}

function findScriptIncludes(text) {
    var scripts = document.querySelectorAll('script');
    for (var script of scripts) {
        var scriptContent = script.textContent;
        if (!scriptContent.includes(text)) continue;
        return scriptContent;

    }
    return null;
}

function logThemeInfo() {
    var themeInfo = `${unsafeWindow.BOOMR?.themeName} - (${unsafeWindow.BOOMR?.themeVersion})`;
    logInfo(`Theme: ${themeInfo}`);
}

function logInstalledApps() {
    var loadAppsScript = findScriptIncludes('asyncLoad()');
    if (!loadAppsScript) return;

    var startText = 'urls = ["';
    var appsText = loadAppsScript.substring(loadAppsScript.indexOf(startText) + startText.length)
    appsText = appsText.substring(0, appsText.indexOf('"];'))
    appsText = appsText.replaceAll('"', '').replaceAll('\\', '');

    var apps = appsText.split(',');
    var appIndex = 1;

    logInfo(`INSTALLED APPS:`);
    for (var app of apps) {
        logApp(app, appIndex);
        logCodeBlackBeltLoadingPerformance(app);
        logSpecialApp(app);
        appIndex++;
    }
}

function cleanAppUrl(appUrl) {
    var paramsStartIndex = appUrl.indexOf('?');
    if (paramsStartIndex) {
        return appUrl.substring(0, paramsStartIndex);
    }
    return appUrl;
}

function logApp(app, appIndex) {
    if (isCodeBlackBeltApp(app)) {
        logSuccess(`${appIndex}. ${cleanAppUrl(app)}`);
    } else {
        logInfo(`${appIndex}. ${cleanAppUrl(app)}`);
    }
}

function isCodeBlackBeltApp(app) {
    return isFBT(app)
        || isAB(app)
        || isCC(app);
}

function isFBT(app) {
    return app.includes('codeblackbelt')
        && app.includes('frequently-bought-together');
}

function isAB(app) {
    return app.includes('codeblackbelt')
        && app.includes('also-bought');
}

function isCC(app) {
    return app.includes('codeblackbelt')
        && app.includes('currency-converter-plus');
}

function logSpecialApp(app) {
    if (app.includes('shortly.js')) {
        logWarning(`Shortly App - Can cause XMLHttpRequest native implementation change.`);
        shortlyHandler();
    } else if (app.includes('searchserverapi')) {
				logWarning(`Searchanise App - Can cause problems with the cart content (updates the cart without advice).`);
		}
}

function shortlyHandler() {
    var shortlyXhrScript = findScriptIncludes('window.XMLHttpRequest = newXHR');
    if (shortlyXhrScript) {
        logError(`Found script which breaks XMLHttpRequest native implementation!`);
    } else {
        logSuccess(`Shortly broken code not found!`);
    }
}

function logCodeBlackBeltLoadingPerformance(app) {
    if (isFBT(app)) {
        fbtInitPerformance = performance.now();
        document.addEventListener('codeblackbelt:frequently-bought-together:rendered', function () {
            if (fbtInitPerformance) {
                var loadedPerformance = performance.now();
                logInfo(`Frequently Bought Together rendered after: ${(loadedPerformance - fbtInitPerformance) / 1000} seconds`);
                delete fbtInitPerformance;
            }
        });
    } else if (isAB(app)) {
        abInitPerformance = performance.now();
        document.addEventListener('codeblackbelt:also-bought:rendered', function () {
            if (abInitPerformance) {
                var loadedPerformance = performance.now();
                logInfo(`Also Bought rendered after: ${(loadedPerformance - abInitPerformance) / 1000} seconds`);
                delete abInitPerformance;
            }
        });
    } else if (isCC(app)) {
        ccInitPerformance = performance.now();
        document.addEventListener('codeblackbelt:currency-converter-plus:converted', function () {
            if (ccInitPerformance) {
                var loadedPerformance = performance.now();
                logInfo(`Currency Converter + first conversion after: ${(loadedPerformance - ccInitPerformance) / 1000} seconds`);
                delete ccInitPerformance;
            }
        });
    }
}

function logPossibleHiddenVariantIds() {
    var hiddenVariantIdNode = document.querySelector(HIDDEN_VARIANT_SELECTORS);
    if (hiddenVariantIdNode) {
        logSuccess(`Hidden variant selector found, currentID: ${hiddenVariantIdNode.value}, node element:`);
        console.log(hiddenVariantIdNode);
    } else {
        logWarning(`No hidden variant selector found`);
    }

}

init();