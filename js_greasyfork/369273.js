// ==UserScript==
// @name         Tildenhancer
// @namespace    http://tildes.net/
// @version      0.1
// @description  Tweaks
// @author       thykka
// @match        https://tildes.net/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/369273/Tildenhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/369273/Tildenhancer.meta.js
// ==/UserScript==
(function(d,f){"use strict";var h=function(d){if("object"!==typeof d.document)throw Error("Cookies.js requires a `window` with a `document` object");var b=function(a,e,c){return 1===arguments.length?b.get(a):b.set(a,e,c)};b._document=d.document;b._cacheKeyPrefix="cookey.";b._maxExpireDate=new Date("Fri, 31 Dec 9999 23:59:59 UTC");b.defaults={path:"/",secure:!1};b.get=function(a){b._cachedDocumentCookie!==b._document.cookie&&b._renewCache();a=b._cache[b._cacheKeyPrefix+a];return a===f?f:decodeURIComponent(a)};
b.set=function(a,e,c){c=b._getExtendedOptions(c);c.expires=b._getExpiresDate(e===f?-1:c.expires);b._document.cookie=b._generateCookieString(a,e,c);return b};b.expire=function(a,e){return b.set(a,f,e)};b._getExtendedOptions=function(a){return{path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==f?a.secure:b.defaults.secure}};b._isValidDate=function(a){return"[object Date]"===Object.prototype.toString.call(a)&&!isNaN(a.getTime())};
b._getExpiresDate=function(a,e){e=e||new Date;"number"===typeof a?a=Infinity===a?b._maxExpireDate:new Date(e.getTime()+1E3*a):"string"===typeof a&&(a=new Date(a));if(a&&!b._isValidDate(a))throw Error("`expires` parameter cannot be converted to a valid Date instance");return a};b._generateCookieString=function(a,b,c){a=a.replace(/[^#$&+\^`|]/g,encodeURIComponent);a=a.replace(/\(/g,"%28").replace(/\)/g,"%29");b=(b+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);c=c||{};a=a+"="+b+(c.path?";path="+
c.path:"");a+=c.domain?";domain="+c.domain:"";a+=c.expires?";expires="+c.expires.toUTCString():"";return a+=c.secure?";secure":""};b._getCacheFromString=function(a){var e={};a=a?a.split("; "):[];for(var c=0;c<a.length;c++){var d=b._getKeyValuePairFromCookieString(a[c]);e[b._cacheKeyPrefix+d.key]===f&&(e[b._cacheKeyPrefix+d.key]=d.value)}return e};b._getKeyValuePairFromCookieString=function(a){var b=a.indexOf("="),b=0>b?a.length:b,c=a.substr(0,b),d;try{d=decodeURIComponent(c)}catch(k){console&&"function"===
typeof console.error&&console.error('Could not decode cookie with key "'+c+'"',k)}return{key:d,value:a.substr(b+1)}};b._renewCache=function(){b._cache=b._getCacheFromString(b._document.cookie);b._cachedDocumentCookie=b._document.cookie};b._areEnabled=function(){var a="1"===b.set("cookies.js",1).get("cookies.js");b.expire("cookies.js");return a};b.enabled=b._areEnabled();return b},g=d&&"object"===typeof d.document?h(d):h;"function"===typeof define&&define.amd?define(function(){return g}):"object"===
typeof exports?("object"===typeof module&&"object"===typeof module.exports&&(exports=module.exports=g),exports.Cookies=g):d.Cookies=g})("undefined"===typeof window?this:window);

(function(Cookies) {
    'use strict';

    // SETTINGS
    const DEFAULTS = {
        fontSize: 0,
        votesOnLeft: false,
        moveCommentBoxUp: false,
        nightModeSwitcher: false,
        nightStartHour: 18,
        dayStartHour: 6,
        nightThemeName: 'black',
        dayThemeName: 'white',
    };
    function clearSettings() {
        GM_setValue('tildenhancer_v0_1', {});
        SETTINGS = DEFAULTS;
        console.log('Tildenhancer settings reset to defaults');
    }
    //clearSettings();

    function getSettings() {
        let settings = Object.assign({}, DEFAULTS, GM_getValue('tildenhancer_v0_1', {}));
        console.log('Getting settings', settings);
        return settings;
    }
    function saveSettings() {
        GM_setValue('tildenhancer_v0_1', SETTINGS);
        console.log('Saved settings', SETTINGS);
        commitTweaks();
    }
    var SETTINGS = getSettings();
    const THEME_CLASS_PREFIX = 'theme-';
    const NIGHT_THEME_CLASS = THEME_CLASS_PREFIX + SETTINGS.nightThemeName;
    const DAY_THEME_CLASS = THEME_CLASS_PREFIX + SETTINGS.dayThemeName;
    const THEME_CLASS_REGEX = new RegExp('\\b' + THEME_CLASS_PREFIX);


    // NIGHT MODE SWITCHER
    function classIsTheme(c) {
        return THEME_CLASS_REGEX.test(c);
    }
    function classIsNotTheme(c) {
        return !classIsTheme(c);
    }
    function getCurrentTheme() {
        return Array.from(document.body.classList)
            .filter(classIsTheme).join(' ').trim();
    }
    function removeAllThemeClasses() {
        document.body.className = Array.from(document.body.classList)
            .filter(classIsNotTheme).join(' ').trim();
    }
    function checkTime() {
        var currentHour = new Date().getHours();
        var currentTheme = getCurrentTheme();

        if(
            currentHour >= SETTINGS.dayStartHour &&
            currentHour < SETTINGS.nightStartHour &&
            currentTheme != DAY_THEME_CLASS
        ) {
            // activate light theme
            removeAllThemeClasses();
            document.body.classList.add(DAY_THEME_CLASS);

            Cookies.set('theme', SETTINGS.dayThemeName);

        } else if (
            (currentHour >= SETTINGS.nightStartHour ||
            currentHour < SETTINGS.dayStartHour) &&
            currentTheme != NIGHT_THEME_CLASS
        ) {
            // activate dark theme
            removeAllThemeClasses();
            document.body.classList.add(NIGHT_THEME_CLASS);

            Cookies.set('theme', SETTINGS.nightThemeName);

        }
    }

    // COMMENT BOX UP
    function swapCommentsWithCommentBox() {
        let container = document.querySelector('.topic-full');
        let comments = document.querySelector('.topic-comments');
        let commentBox;
        if(container) {
            if(comments) commentBox = comments.nextElementSibling;
            if(commentBox) container.insertBefore(commentBox, comments);
        }
    }

    // SETTINGS UI
    function isSettingsPage() {
        return !!location.href.match(/tildes\.net\/settings/);
    }
    function createSettingsUI() {
        var container = document.querySelector('main');
        if(!container) return;
        var settingsContainer = document.createElement('section');
        var settingsList = document.createElement('ul');
        var settingElements = Object.keys(SETTINGS).map(createSettingComponent);
        settingElements.filter(s => s !== false).forEach(s => settingsList.appendChild(s));
        settingsContainer.appendChild(settingsList);
        settingsContainer.appendChild(createResetButton());
        container.appendChild(settingsContainer);
    }
    function createResetButton() {
        var btn = document.createElement('button');
        btn.innerText = 'Reset Tildenhancer settings';
        btn.onclick = clearSettings;
        return btn;
    }
    function createSettingComponent(setting) {
        var key = setting;
        var type = typeof SETTINGS[key];
        var element;
        switch(type) {
            case 'number':
                element = createInputElement('number', key, SETTINGS[key]);
                break;
            case 'string':
                element = createInputElement('text', key, SETTINGS[key]);
                break;
            case 'boolean':
                element = createInputElement('checkbox', key, SETTINGS[key]);
                break;
            default:
                console.log(key, SETTINGS[key], type);
                return false;
        }
        element.addEventListener('change', function(e) {
            var el = e.target;
            if(el.type == 'checkbox') {
                handleSettingChange(key, el.checked);
            } else {
                handleSettingChange(key, el.value);
            }
        });
        return element;
    }
    function handleSettingChange(setting, value) {
        let typedValue;
        if(SETTINGS.hasOwnProperty(setting)) {
            var type = typeof SETTINGS[setting];
            switch(type) {
                case 'number':
                    if(setting == 'fontSize') {
                        if(value == 0) {
                            SETTINGS[setting] = 0;
                            break;
                        }
                        SETTINGS[setting] = Math.max(8, parseFloat(value));
                        break;
                    }
                    SETTINGS[setting] = parseFloat(value);
                    break;
                case 'string':
                    SETTINGS[setting] = ""+value;
                    break;
                case 'boolean':
                    SETTINGS[setting] = !!value;
                    break;
                default:
                    console.error(type, setting, value, SETTINGS[value]);
            }
            saveSettings();
        }
    }
    function createInputElement(type, label, value) {
        var container = document.createElement('li');
        var inputElement = document.createElement('input');
        inputElement.setAttribute('type', type);
        if(type == 'checkbox') {
            inputElement.checked = value;
        } else {
            inputElement.value = value;
        }
        var labelElement = document.createElement('label');
        var labelText = document.createElement('span');
        labelText.innerText = label;
        labelElement.appendChild(inputElement);
        labelElement.appendChild(labelText);
        container.appendChild(labelElement);
        return container;
    }
    if(isSettingsPage()) createSettingsUI();

    var tweakElements = [];
    function commitTweaks() {
        const themeTweaks = [{
            active: !!SETTINGS.fontSize,
            css: `:root {
font-size: calc(${Math.max(8, SETTINGS.fontSize)} / 16 * 100%);
}`
        },{
            active: SETTINGS.votesOnLeft,
            css: `.topic {
grid-template-areas: "voting title" "voting metadata" "voting content" "voting info";
grid-template-columns: auto 1fr;
}`
        }];
        tweakElements.forEach(el => {
            el.parentNode.removeChild(el)
        });
        tweakElements = tweakElements.filter(el => el.parentElement);
        themeTweaks.filter(tweak => tweak.active)
            .forEach(tweak => tweakElements.push(GM_addStyle(tweak.css)));

        if(SETTINGS.nightModeSwitcher) {
            checkTime();
            setInterval(checkTime, 1000 * 60);
        }

    }

    commitTweaks();
    if(SETTINGS.moveCommentBoxUp) swapCommentsWithCommentBox();

})(Cookies);