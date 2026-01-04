// ==UserScript==
// @name         Mastodon Translate
// @namespace    https://jabberwocky.moe/@alice
// @version      1.23.0
// @description  Provides a translate toot option for Mastodon users via Google Translate. Works with Mastodon 3.2.1
// @author       tomo@uchuu.io / https://niu.moe/@tomo / umonaca / alice@jabberwocky.moe
// @match        https://*/web/*
// @match        https://*/settings/preferences/appearance
// @connect      translate.uchuu.io
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_xmlHttpRequest
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/414983/Mastodon%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/414983/Mastodon%20Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set Defaults if not set
    if(!localStorage.getItem('lang')) {
        localStorage.setItem('lang', GM_getValue('lang', 'en'));
    };

    function stripMentions(text) {
        var regex = /(@[a-z0-9]+)/;
        var mentions = [];

        var cleanText = text.replace(regex, function(match) {
            mentions.push(match);
            return '';
        }).trim();

        return {
            mentions,
            text: cleanText
        };
    }

    function getTranslation(status, language) {
        var statusDetail = stripMentions(status.querySelector('div.status__content').textContent);
        var encodedText = encodeURIComponent(statusDetail.text);
        var url = "https://translate.uchuu.io/"+language+'/'+encodedText;

        GM.xmlHttpRequest({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: url,
            onload: function(res) {
                var resJson = JSON.parse(res.responseText);
                var translatedText = statusDetail.mentions.join(' ') + ' ' + resJson.text;

                var translateArea = document.createElement('p');
                translateArea.classList.add('toot__translation');
                translateArea.innerHTML = '<br>Translated: '+translatedText;

                status.querySelector('div.status__content').appendChild(translateArea);

                document.querySelector('li.translate__toot').remove();
                if (document.querySelector('div.dropdown-menu') !== null) {
                    status.querySelector('i.fa.fa-ellipsis-h').click();
                };
            },
            onabort: function() {
                console.log('There was an abort');
            },
            ontimeout: function() {
                console.log('It timeout');
            },
            onerror: function() {
                console.log('There was an error');
            }
        });
    }

    function addTranslateLink(status) {
        setTimeout(function() {
            var dropdown = document.querySelector('div.dropdown-menu ul');
            var separator = dropdown.querySelector('li.dropdown-menu__separator');

            var listItem = document.createElement('li');
            listItem.classList.add('dropdown-menu__item');
            listItem.classList.add('translate__toot');

            var link = document.createElement('a');
            link.setAttribute('href', '#');
            link.setAttribute('target', '_blank');
            
            var target_lang = localStorage.getItem('lang');
            if (target_lang == 'zh-CN') {
                link.textContent = '翻译嘟文';
            } else if (target_lang == 'zh-HK') {
                link.textContent = '翻譯嘟文';
            } else if (target_lang == 'zh-TW') {
                link.textContent = '翻譯嘟文';
            } else {
                link.textContent = 'Translate Toot';
            };

            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (status.querySelectorAll('p.toot__translation').length === 0) {
                    link.textContent = 'Loading...';
                    getTranslation(status, localStorage.getItem('lang'));
                }; 
            }, false);

            listItem.appendChild(link);
            dropdown.insertBefore(listItem, separator);
        }, 100);
    }

    function saveSettings(event) {
        if (event.target.tagName.toLowerCase() === 'button' && event.target.getAttribute('type') === 'submit') {
            event.preventDefault();

            var input = document.getElementById('translation_locale');
            var selectedLanguage = input.options[input.selectedIndex].value;

            if (selectedLanguage == 'zh-HK') {
                localStorage.setItem('lang', 'zh-TW');
            } else {
                localStorage.setItem('lang', selectedLanguage);
            };

            setTimeout(function() {
                document.querySelector('body').removeEventListener('click', saveSettings, false);
                actions.children[0].click();
            }, 500);
        }
    }

    function chromeClickChecker(event) {
        return(
            event.target.tagName.toLowerCase() === 'i' &&
            event.target.classList.contains('fa-ellipsis-h') &&
            document.querySelector('div.dropdown-menu') === null
        );
    }

    function firefoxClickChecker(event) {
        return(
            event.target.tagName.toLowerCase() === 'button' &&
            event.target.classList.contains('icon-button') &&
            document.querySelector('div.dropdown-menu') === null
        );
    }

    function activateMastodonTranslate() {
        document.querySelector('body').addEventListener('click', function(event) {
            if (chromeClickChecker(event) || firefoxClickChecker(event)) {
                // Get the status for this event
                var status = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
                addTranslateLink(status);
            };
        }, false);
    }

    // Launch Script
    console.log(`Translate Script v${GM.info.script.version} Activating...`);
    window.addEventListener("load", function() {
        if (window.innerWidth > 630) {
            // Checks we're on a mastodon instance
            var settingsEl = document.querySelector('i.fa.fa-fw.fa-cog').parentElement;
            var settingsUrl = settingsEl.getAttribute('href');
            if (settingsUrl === '/settings/preferences') {
                activateMastodonTranslate();
            } else {
                // Other cases
            }
        } else {
            console.log('Sorry, desktop only');
        }
    }, false);

    if (window.location.pathname === '/settings/preferences/appearance') {
        // We're on the settings page
        var form = document.querySelector('form.simple_form');
        var actions = document.querySelector('div.actions');

        var settingsGroup = form.querySelectorAll('div.fields-group')[2].cloneNode(true);
        settingsGroup.children[0].remove();

        var languageArea = form.querySelector('div.fields-group').cloneNode(true);
        languageArea.classList.remove('fields-row__column');
        languageArea.classList.remove('fields-row__column-6');

        var interface_lang = languageArea.querySelector("select[name='user[locale]']").value;

        var label = languageArea.querySelector(".select .optional[for=user_locale]");
        label.setAttribute('for', 'translation_locale');
        if (interface_lang == 'zh-CN') {
            label.textContent = '使用以下语言翻译';
        } else if (interface_lang == 'zh-HK') {
            label.textContent = '使用以下語言翻譯';
        } else if (interface_lang == 'zh-TW') {
            label.textContent = '使用以下語言翻譯';
        } else {
            label.textContent = 'Translation Language';
        };

        var selector = languageArea.querySelector("select[name='user[locale]']");
        selector.setAttribute('id', 'translation_locale');
        selector.value = localStorage.getItem('lang');

        settingsGroup.appendChild(languageArea);

        form.insertBefore(settingsGroup, form.firstChild);

        document.querySelector('body').addEventListener('click', saveSettings, false);
    }
})();