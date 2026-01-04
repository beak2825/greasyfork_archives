// ==UserScript==
// @name         Gitlab, open file in phpstorm
// @namespace    micoli.phpstorm.openlinks
// @version      0.8
// @description  add a link to phpstorm in gitlab ci merge requests files
// @author       You
// @match        https://gitlab.com/*
// @downloadURL https://update.greasyfork.org/scripts/397451/Gitlab%2C%20open%20file%20in%20phpstorm.user.js
// @updateURL https://update.greasyfork.org/scripts/397451/Gitlab%2C%20open%20file%20in%20phpstorm.meta.js
// ==/UserScript==

(function () {
    // defaults write com.google.Chrome URLWhitelist -array "phpstorm://*
    'use strict';
    let config = {};
    let linkCounter = 0;

    document.querySelectorAll('a[href*="redirectFromReferer"]').forEach((link)=> {
        link.href = link.href+'?referer='+window.location.href
    });

    const project = $('nav.breadcrumbs  ul.js-breadcrumbs-list li a')[1].pathname;

    const loadPreferences = function () {
        if (!window.localStorage.getItem('openInPhpStormSettings')) {
            return {};
        }
        config = JSON.parse(window.localStorage.getItem('openInPhpStormSettings'));
    }

    const savePreferences = function () {
        window.localStorage.setItem('openInPhpStormSettings', JSON.stringify(config))
        removeLinks();
        setLinks();
    }

    const icon = function (color) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 128 128" width="16" height="16">
            <path  d="M61,87H35a2,2,0,0,0,0,4H61a2,2,0,0,0,0-4Z"/>
            <path fill="${color || '#A12681'}" d="M52.32,42.24a5.52,5.52,0,0,0-2-2.14,5.82,5.82,0,0,0-3.09-.82H41V50.57h6.88A4.71,4.71,0,0,0,51.64,49,5.81,5.81,0,0,0,53,45,5.91,5.91,0,0,0,52.32,42.24Zm0,0a5.52,5.52,0,0,0-2-2.14,5.82,5.82,0,0,0-3.09-.82H41V50.57h6.88A4.71,4.71,0,0,0,51.64,49,5.81,5.81,0,0,0,53,45,5.91,5.91,0,0,0,52.32,42.24ZM114.15,70.4l11.77-11.59a7.87,7.87,0,0,0,1.93-6.73L114.23,17.82a7.78,7.78,0,0,0-4.75-5.09L85.06,8.27A7.08,7.08,0,0,0,83,8a8.92,8.92,0,0,0-5,1.48l-9.51,7-1.35-4A7.73,7.73,0,0,0,62,7.87L26,.12A5.62,5.62,0,0,0,24.77,0a7.84,7.84,0,0,0-5.41,2.2L2.08,20.91a9,9,0,0,0-2,6.83L11.87,92.1a5,5,0,0,0,4.7,3.9H25v3a4,4,0,0,0,4,4h8.37l.76,6.32a7.18,7.18,0,0,0,4.24,5.35l34.85,12.9a7.87,7.87,0,0,0,2.69.43,9.17,9.17,0,0,0,4.5-1.1l41.53-25a4.33,4.33,0,0,0,1.6-5.62ZM80.4,12.7A5.08,5.08,0,0,1,83,12c.47,0,25.41,4.61,25.41,4.61a4,4,0,0,1,1.88,2.14l.07.28.1.27L124,53.21a4.12,4.12,0,0,1-.87,2.75L112.23,66.68,103,48.83V29a4,4,0,0,0-4-4H63.8ZM73.73,51.21l-3.14-.67a27.09,27.09,0,0,1-4.89-1.22,8.8,8.8,0,0,1-3.24-2.12,5.26,5.26,0,0,1-1.46-4,6,6,0,0,1,2.5-5.34,12,12,0,0,1,7-1.87,15.4,15.4,0,0,1,4.76.68,15.86,15.86,0,0,1,4.14,2.1l.11.09-2,2.82a.45.45,0,0,0,0,.09.62.62,0,0,1-.22-.11A14.76,14.76,0,0,0,73.77,40a9.55,9.55,0,0,0-7.1.16A3.05,3.05,0,0,0,64.84,43a2.66,2.66,0,0,0,1,2.11,5.17,5.17,0,0,0,2,1c.51.16,1.48.4,2.9.72L72,47a29.44,29.44,0,0,1,5,1.36,7,7,0,0,1,2.79,2.07A6.18,6.18,0,0,1,81,54.57,6.45,6.45,0,0,1,78.59,60a11.2,11.2,0,0,1-7.07,2,16.38,16.38,0,0,1-10.41-3.35L61,58.56s1.91-2.93,1.91-2.93a.57.57,0,0,1,.19.1,17,17,0,0,0,4.08,2.08c3.48,1.26,6.41,1,8.24-.17a3.41,3.41,0,0,0,1.74-2.92C77.16,53.56,76.58,52,73.73,51.21ZM25,29V92H16.57a1,1,0,0,1-.76-.62L4,27a5.08,5.08,0,0,1,1-3.39L22.29,4.92A3.91,3.91,0,0,1,24.77,4c.18,0,36.4,7.78,36.4,7.78a3.86,3.86,0,0,1,2.2,2L65.14,19l-8.06,6H29A4,4,0,0,0,25,29ZM41,61.91s0,.08-.09.09H37.1a.13.13,0,0,1-.1-.09V36.17A.38.38,0,0,1,37,36a.41.41,0,0,1,.16,0H47a11.27,11.27,0,0,1,5.31,1.2,8.57,8.57,0,0,1,3.46,3.26,9.56,9.56,0,0,1,.07,9.11,7.82,7.82,0,0,1-3.31,3.09A12,12,0,0,1,47,53.85H41Zm82.91,36.56-41.53,25a5.22,5.22,0,0,1-2.44.53,3.9,3.9,0,0,1-1.3-.18l-34.85-12.9a3.35,3.35,0,0,1-1.66-2.08L41.4,103H99a4,4,0,0,0,4-4V57.54l21,40.58A.37.37,0,0,1,123.88,98.47ZM51.64,49A5.81,5.81,0,0,0,53,45a5.91,5.91,0,0,0-.67-2.8,5.52,5.52,0,0,0-2-2.14,5.82,5.82,0,0,0-3.09-.82H41V50.57h6.88A4.71,4.71,0,0,0,51.64,49Z"/>
        </svg>`
    };

    const phpStormMimeLink = function(link){
        const prefix = config[project] || '';
        document.location = `phpstorm://open?file=${prefix}${link}`;
    };

    document.phpStormRestApiLink = function (link) {
        const prefix = config[project] || '';
        const hrefLink = `http://localhost:63342/api/file?file=${prefix}${link}`;
        const linkWindow = window.open(hrefLink,'autoOpen');
        setTimeout(function(){
            linkWindow.close();
        },1000);
    };

    const openLinkInHiddenForm = function (action,parameters) {
        let hiddenDiv = document.getElementById('phpstorm-autoform');

        if (hiddenDiv){
            hiddenDiv.parentNode.removeChild(hiddenDiv);
        }
        console.log(action);
        document.querySelector('body').insertAdjacentHTML('beforeEnd',
            `<form id='phpstorm-autoform' action="${action}" target="_hiddenTarget" method='GET'>
           <input name="file" value="${parameters.file}"/>
           <iframe name="_hiddenTarget" width="0" height="0"></iframe>
        </form>
        `);

        document.getElementById('phpstorm-autoform').submit();
    };

    const setLinks = function () {
        document.querySelectorAll('.diff-file').forEach(function (divDiffFile) {
            let jsEditInPhpStormButtonFound = false;
            let linkCounter = 0;
            divDiffFile.querySelectorAll('button[data-testid="diff-file-copy-clipboard"]').forEach( function (buttonClipboard) {
                const fileUrl = JSON.parse(buttonClipboard.getAttribute('data-clipboard-text'))['text'];

                divDiffFile.querySelectorAll('.js-edit-in-phpstorm').forEach(function (buttonEditInPhpStorm) {
                    if (buttonEditInPhpStorm.getAttribute('data-link') === fileUrl) {
                        jsEditInPhpStormButtonFound = true;
                    }
                });

                if (jsEditInPhpStormButtonFound) {
                    return;
                }

                linkCounter++;
                const jsEditInPhpStormId = `js-edit-in-phpstorm-${divDiffFile.id}-${linkCounter}`;
                buttonClipboard
                    .insertAdjacentHTML('afterend', `
                <div
                    id="${jsEditInPhpStormId}"
                    title="Edit file in phpStorm"
                    data-link="${fileUrl}"
                    class="btn btn-transparent js-edit-in-phpstorm"
                    style="margin-top: -6px;"
                >
                    ${icon()}
                </div>
                `);

                document.getElementById(jsEditInPhpStormId).addEventListener('click',function(event){
                    document.phpStormRestApiLink(event.currentTarget.dataset.link);
                });
            });
        });

        document.querySelectorAll('.js-edit-in-phpstorm').forEach(function (buttonEditInPhpStorm) {
            let buttonClipboardFound = false;
            buttonEditInPhpStorm.parentNode.querySelectorAll('.diff-file button[data-testid="diff-file-copy-clipboard"]').forEach( function (buttonClipboard) {
                const fileUrl = JSON.parse(buttonClipboard.getAttribute('data-clipboard-text'))['text'];
                if(buttonEditInPhpStorm.getAttribute('data-link') === fileUrl) {
                    buttonClipboardFound = true;
                }
            });
            if(!buttonClipboardFound) {
                buttonEditInPhpStorm.remove();
            }
        });
    }

    const removeLinks = function () {
        document.querySelectorAll('.js-edit-in-phpstorm').forEach(function (v) {
            v.parentElement.removeChild(v);
        });
        document.querySelectorAll('.file-header-content .file-title-name').forEach(function (v) {
            v.class = v.class.replace(/rgx-add-phpstorm-done/, '');
        });
    }

    const isConfigurationValid = function () {
        try {
            JSON.parse(document.getElementById("open-in-phpstorm-map").value);
            return true;
        } catch (e) {
            return false;
        }
    };

    const togglePref = function () {
        var element = document.getElementById('open-in-phpstorm-settings');
        element.style.display = element.style.display == 'none' ? 'inline-block' : 'none'
        if (element.style.display == 'inline-block') {
            document.getElementById("open-in-phpstorm-map").value = JSON.stringify(config);
        }
    };

    const initPreferenceButton = function () {
        document.querySelector('.alert-wrapper').insertAdjacentHTML('afterEnd', `

            <div class="container-fluid">
                <div
                    class="row"
                    id="open-in-phpstorm-settings"
                    style="display:none;width:600px;"
                >
                    <div class="form-group col-md-9">
                        <label class="label-bold" for="open-in-phpstorm-map">
                        "Open in phpstorm" project association
                        </label>
                        <textarea class="form-control" rows="3" maxlength="650" id="open-in-phpstorm-map" name="open-in-phpstorm-settings"></textarea>
                    </div>
                    <div class="form-group col-md-9">
                        <pre>{"${project}":"/home/src/localpath/"}</pre>
                        <button
                            id="js-btn-save-in-phpstorm-settings"
                            class="btn btn-secondary"
                            style="float:left;"
                        >
                            Save ${icon('#919191')} Preferences
                        </button>
                    </div>
                </div>
            </div>
        `);

        document.querySelector('.dropdown-menu.dropdown-menu-right .current-user').parentNode.insertAdjacentHTML('afterend', `
          <li >
            <a title="PhpStorm Settings" id="js-btn-open-in-phpstorm-settings" data-qa-selector="open_in_phpstorm_settings_link" href="#">${icon('#919191')} "Open in PhpStorm" Settings</a>
          </li>
        `);

        document.getElementById('js-btn-open-in-phpstorm-settings').addEventListener('click', function () {
            togglePref();
            return false;
        });

        document.getElementById('js-btn-save-in-phpstorm-settings').addEventListener('click', function () {
            if (isConfigurationValid()) {
                togglePref();
                config = JSON.parse(document.getElementById("open-in-phpstorm-map").value);
                savePreferences();
            }
            return false;
        });
    };


    console.log('started');
    loadPreferences();
    setLinks();
    window.setTimeout(initPreferenceButton, 50);
    window.setInterval(setLinks, 1500);
})();