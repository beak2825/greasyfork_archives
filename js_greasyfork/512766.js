// ==UserScript==
// @name        PWAs anywhere mod
// @namespace   https://greasyfork.org/users/1381439
// @match       *://*/*
// @version     1.0.1
// @author      OctoSpacc
// @license     ISC
// @description Allow installing any webpage as a progressive web app
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/512766/PWAs%20anywhere%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/512766/PWAs%20anywhere%20mod.meta.js
// ==/UserScript==

var originalManifest = document.querySelector('link[rel="manifest"]');

var menuEntries = {
        injectCustom: ['Make pwa or edit icon, colors. Reload site after click!', injectCustomManifest],
        iconUrl: ['Icon url', customIconUrl],
        bgColor: ['Background color', customBackgroundColor],
        themeColor: ['Theme color', customThemeColor],
        customName: ['Name', customAppName],
        delAll: ['Delete custom icon, colors and name for current site', deleteAll],
        dontInject: ['Remove pwa or return original', dontInjectCustom],
};

function menuRegister(key) {
        var entry = menuEntries[key];
        GM_registerMenuCommand(entry[0], entry[1]);
}

function makeManifestElem(href) {
        var manifestElem = document.createElement('link');
        manifestElem.rel = 'manifest';
        manifestElem.href = href;
        return manifestElem;
}

function removeCurrentManifest() {
        var manifestElem = document.querySelector('link[rel="manifest"]');
        if (manifestElem) {
                manifestElem.parentElement.removeChild(manifestElem);
        }
}

function createAndInjectManifest() {
        var iconElem = (document.querySelector('link[rel~="apple-touch-icon"]') || document.querySelector('link[rel~="icon"]'));
        var manifestElem = makeManifestElem('data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify({
                name: (customAppNm || document.title || location.href),
                start_url: location.href,
                scope: (location.protocol + '//' + location.hostname + '/'),
                display: "standalone",
                background_color: (customBgColor || getComputedStyle(document.body).backgroundColor),
                theme_color: (customThColor || undefined),
                icons: [{
                        src: (customIcUrl || (iconElem && iconElem.href) || (location.href + '/favicon.ico')),
                        sizes: "any",
                        purpose: "any",
                }, ],
        })));
        document.head.appendChild(manifestElem);
        menuRegister('iconUrl');
        menuRegister('bgColor');
        menuRegister('themeColor');
        menuRegister('customName');
        menuRegister('delAll');
        menuRegister('dontInject');
}

function customIconUrl() {
        GM_setValue((location.hostname + '_ic'), prompt('Optional URL to custom icon (suggested: PNG >= 128x128)? (Will try to get one automatically if unspecified.)'));
}

function customBackgroundColor() {
        GM_setValue((location.hostname + '_bg'), prompt('CSS color value #RRGGBB named-color rgb hsl...'));
}

function customThemeColor() {
        GM_setValue((location.hostname + '_th'), prompt('CSS color value #RRGGBB named-color rgb hsl...'));
}

function customAppName() {
        GM_setValue((location.hostname + '_nm'), prompt('Name'));
}

function deleteAll() {
        if (confirm('Delete custom icon url, colors and name for current site?') === true) {
                GM_deleteValue(location.hostname + '_ic');
                GM_deleteValue(location.hostname + '_bg');
                GM_deleteValue(location.hostname + '_th');
                GM_deleteValue(location.hostname + '_nm');
        }
}

function dontInjectCustom() {
        GM_deleteValue(location.hostname + '_pwa');
}

if (GM_getValue(location.hostname + '_ic')) {
        var customIcUrl = GM_getValue(location.hostname + '_ic');
}

if (GM_getValue(location.hostname + '_bg')) {
        var customBgColor = GM_getValue(location.hostname + '_bg');
}

if (GM_getValue(location.hostname + '_th')) {
        var customThColor = GM_getValue(location.hostname + '_th');
}

if (GM_getValue(location.hostname + '_nm')) {
        var customAppNm = GM_getValue(location.hostname + '_nm');
}

if (GM_getValue(location.hostname + '_pwa')) {
        if (originalManifest) {
                removeCurrentManifest();
                createAndInjectManifest();
        } else {
                createAndInjectManifest();
        }

} else {
        menuRegister('injectCustom');
}

function injectCustomManifest() {
        GM_setValue((location.hostname + '_pwa'), true);
}