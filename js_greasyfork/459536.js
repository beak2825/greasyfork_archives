// ==UserScript==
// @name         Github Open files in Editor
// @namespace    http://tampermonkey.net/GithubOpenFilesInEditor
// @version      0.2
// @description  Adds a button next to files on Github to quickly open it in your favorite IDE
// @author       Alexandre Blanc
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460197/Github%20Open%20files%20in%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/460197/Github%20Open%20files%20in%20Editor.meta.js
// ==/UserScript==

// For PhpStorm users, it requires plugin : IDE Remote Control
// For VSCode users on Mac OS, please add in your terminal:
//   defaults write com.google.Chrome URLAllowlist -array "vscode://*"

(function() {
    'use strict';
    let userSettings = {projectList: {}, editor: ''};
    let currentUrl = '';
    let project = '';

    const loadSettings = function() {
        if (!window.localStorage.getItem('ghofieSettings')) {
            return {projectList: {}, editor: 'phpstorm'};
        }
        userSettings = JSON.parse(window.localStorage.getItem('ghofieSettings'));
    }

    const saveSettings = function() {
        window.localStorage.setItem('ghofieSettings', JSON.stringify(userSettings))
        removeLinks();
        setLinks();
    }

    const handleUrlChange = function() {
        if (window.location.href === currentUrl) {
            return;
        }
        window.setTimeout(initSettingsPanel, 500);
        removeLinks();
        setLinks();
        currentUrl = window.location.href;
    }

    const initUrlChangeDetection = function() {
        setInterval(function() {
            handleUrlChange();
        },1000);
    }

    const icon = function (color) {
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"  width="16" height="16" x="0px" y="0px" viewBox="0 0 1000 1000" xml:space="preserve">
<g>
    <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)" fill="red">
        <path d="M267.3,4393.3c-47.8-23.9-100.4-76.5-124.3-124.3c-40.6-78.9-43-327.5-43-4159s2.4-4080.2,43-4159c23.9-47.8,76.5-100.4,124.3-124.3c78.9-40.6,353.8-43,4732.7-43c4378.9,0,4653.8,2.4,4732.7,43c47.8,23.9,100.4,76.5,124.3,124.3c40.6,78.9,43,327.5,43,4159s-2.4,4080.2-43,4159c-23.9,47.8-76.5,100.4-124.3,124.3c-78.9,40.6-353.8,43-4732.7,43C621.1,4436.3,346.2,4433.9,267.3,4393.3z M9314.4,2990.2v-860.5H5000H685.6l-7.2,836.6c-2.4,458.9,0,850.9,7.2,865.3c7.2,26.3,874.8,31.1,4319.2,26.3l4309.6-7.2V2990.2z M9321.6-1042.1l-7.2-2588.6H5000H685.6l-7.2,2588.6l-4.8,2586.2H5000h4326.3L9321.6-1042.1z"/>
        <path d="M8284.2,3140.8l-45.4-55l55,45.4c28.7,26.3,52.6,50.2,52.6,55C8346.3,3205.4,8327.2,3191,8284.2,3140.8z"/>
        <path d="M5425.5,927.5c-38.2-21.5-81.3-71.7-100.4-112.3c-16.7-38.2-294-855.7-611.9-1811.8c-621.5-1869.2-614.3-1845.3-499.6-1967.2c112.3-119.5,329.8-117.1,425.5,4.8c55,71.7,1221.4,3554.3,1221.4,3649.9C5860.5,905.9,5609.5,1044.6,5425.5,927.5z"/>
        <path d="M2248.8-227c-894-600-944.1-635.8-975.2-729c-31.1-88.4-28.7-105.2,11.9-191.2c40.6-81.3,162.5-172.1,965.7-707.5c800.7-537.8,932.2-616.7,1011.1-616.7c124.3,0,217.5,52.6,265.3,153c47.8,100.4,47.8,136.2,4.8,241.4c-28.7,66.9-148.2,157.8-741,552.1c-389.6,260.5-707.5,478-707.5,485.2c0,7.2,315.5,224.7,700.3,480.4c595.2,399.2,705.1,480.4,743.4,556.9c38.2,78.9,40.6,107.6,16.7,181.7c-35.9,124.3-121.9,196-248.6,210.3C3193,401.6,3181,394.4,2248.8-227z"/>
        <path d="M6601.5,365.8c-76.5-38.2-167.3-174.5-167.3-253.4c0-138.6,78.9-207.9,786.4-676.4c382.4-253.4,695.5-468.5,695.5-475.6c0-7.2-317.9-224.7-707.5-485.2c-592.8-394.4-712.3-485.2-741-552.1c-43-105.2-43-141,4.8-241.4c47.8-100.4,141-153,265.3-153c78.9,0,210.3,78.9,1011.1,616.7c1032.6,688.4,1039.8,695.6,975.2,896.3c-31.1,98-57.4,117.1-970.4,729C6766.4,427.9,6747.3,439.8,6601.5,365.8z"/>
    </g>
</g>
</svg>`
    };

    document.phpStormLink = function (link) {
        const hrefLink = `http://localhost:63342/api/file?file=${link}`;
        const linkWindow = window.open(hrefLink,'autoOpenInEditor');
        setTimeout(function() {
            linkWindow.close();
        },1000);
    };

    document.vsCodeLink = function (link) {
        const hrefLink = `vscode://file/${link}`;
        const linkWindow = window.open(hrefLink,'autoOpenInEditor');
        setTimeout(function() {
            linkWindow.close();
        },1000);
    };

    const setLinks = function() {
        const tabnavs = document.querySelectorAll('.tabnav [data-pjax="#repo-content-pjax-container"] .tabnav-tab');
        if (tabnavs.length === 0) {
            return;
        }

        project = document.querySelector('.AppHeader-context-full ul li:last-child a').href.split('/').pop();

        switch (Array.from(document.querySelectorAll('.tabnav-tabs[aria-label="Pull request tabs"] .tabnav-tab')).findIndex(el => el.classList.contains("selected"))) {
            case 0: console.log('setLinksInConversationTab'); setLinksInConversationTab(); break;
            case 1: console.log('setLinksInCommitsTab'); setLinksInCommitsTab(); break;
            case 3: console.log('setLinksInFilesChangedTab'); setLinksInFilesChangedTab(); break;
        }
    }

    const handleClickOnOpenInEditorLink = function (link) {
        const projectPath = userSettings.projectList[project] || '';
        switch (userSettings.editor) {
            case 'phpstorm': document.phpStormLink(projectPath + link); break;
            case 'vscode': document.vsCodeLink(projectPath + link); break;
        }
    }

    const setLinksInConversationTab = function() {
        let linkCounter = 0;
        document.querySelectorAll('turbo-frame[id^="review-thread-or-comment-id-"] summary a').forEach(function (a) {
            linkCounter++;
            const fileUrl = a.innerHTML;
            const ghofieLinkId = `js-open-in-phpstorm-${linkCounter}`;
            a.insertAdjacentHTML('afterend', `
                <div
                    id="${ghofieLinkId}"
                    title="Open file in editor"
                    data-link="${fileUrl}"
                    class="ghofie-link"
                    style="margin: 2px 5px 0px 0px"
                >
                    ${icon()}
                </div>
                `);

            document.getElementById(ghofieLinkId).addEventListener('click',function(e){
                e.preventDefault();
                handleClickOnOpenInEditorLink(e.currentTarget.dataset.link);

            });
        });
    }

    const setLinksInCommitsTab = function() {
        let linkCounter = 0;
        document.querySelectorAll(
            'diff-layout #files div.js-file div.file-header span.Truncate clipboard-copy'
        ).forEach(function (e) {
            linkCounter++;
            const fileUrl = e.value;
            const ghofieLinkId = `js-open-in-phpstorm-${linkCounter}`;
            e.insertAdjacentHTML('afterend', `
                <div
                    id="${ghofieLinkId}"
                    title="Open file in editor"
                    data-link="${fileUrl}"
                    class="ghofie-link"
                    style="margin: 2px 5px 0px 0px; cursor: pointer;"
                >
                    ${icon()}
                </div>
                `);

            document.getElementById(ghofieLinkId).addEventListener('click',function(e){
                e.preventDefault();
                handleClickOnOpenInEditorLink(e.currentTarget.dataset.link);

            });
        });
    }

    const setLinksInFilesChangedTab = function() {
        let linkCounter = 0;
        document.querySelectorAll(
            'div[data-target="diff-layout.mainContainer"] #files div.js-file div.file-header span.Truncate clipboard-copy'
        ).forEach(function (e) {
            linkCounter++;
            const fileUrl = e.value;
            const ghofieLinkId = `js-open-in-phpstorm-${linkCounter}`;
            e.insertAdjacentHTML('afterend', `
                <div
                    id="${ghofieLinkId}"
                    title="Open file in editor"
                    data-link="${fileUrl}"
                    class="ghofie-link"
                    style="margin: 2px 5px 0px 0px; cursor: pointer;"
                >
                    ${icon()}
                </div>
                `);

            document.getElementById(ghofieLinkId).addEventListener('click',function(e){
                e.preventDefault();
                handleClickOnOpenInEditorLink(e.currentTarget.dataset.link);

            });
        });
    }

    const removeLinks = function() {
        document.querySelectorAll('.ghofie-link').forEach(function (v) {
            v.parentElement.removeChild(v);
        });
    }

    const isConfigurationValid = function() {
        try {
            JSON.parse(document.getElementById("ghofie-project-list").value);
            return true;
        } catch (e) {
            return false;
        }
    };

    const toggleSettingsDisplay = function() {
        const element = document.getElementById('ghofie-settings');
        element.style.display = element.style.display == 'none' ? 'inline-block' : 'none'
        if (element.style.display == 'inline-block') {
            document.getElementById("ghofie-project-list").value = JSON.stringify(userSettings.projectList);
            document.getElementById('ghofie-editor-choice-' + userSettings.editor).checked = true;
        }
    };

    const initSettingsPanel = function() {
        if (document.querySelector('#ghofie-settings') !== null) {
            document.querySelector('#ghofie-settings').remove();
            document.querySelector('#js-btn-ghofie-settings').remove();
        }
        document.querySelector('.AppHeader-globalBar').insertAdjacentHTML('afterend', `
            <div class="row px-3 px-md-4 px-lg-5" id="ghofie-settings" style="display:none;width:100%;">
                <div class="form-group">
                    <h3>GitHub - Open file in editor</h3>
                    <label class="label-bold" for="ghofie-project-list">
                        Project association <i>{"${project}":"/home/src/localpath/"}</i>
                    </label>
                    <textarea class="form-control" rows="3" maxlength="650" id="ghofie-project-list" name="ghofie-settings"></textarea>
                    <label class="label-bold">Editor choice</label>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" id="ghofie-editor-choice-phpstorm" name="ghofie-editor-choice" value="phpstorm">
                        <label for="ghofie-editor-choice-phpstorm" class="form-check-label">PhpStorm</label>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" id="ghofie-editor-choice-vscode" name="ghofie-editor-choice" value="vscode">
                        <label for="ghofie-editor-choice-vscode" class="form-check-label">VS Code</label>
                    </div>
                    <button
                        id="ghofie-settings-save-button"
                        class="btn btn-secondary"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        `);

        let ghofieSettingsButton = document.createElement('a');
        ghofieSettingsButton.addEventListener('click', function (e) {
            e.preventDefault();
            toggleSettingsDisplay();
            return false;
        });
        ghofieSettingsButton.id = 'js-btn-ghofie-settings';
        ghofieSettingsButton.href = '#';
        ghofieSettingsButton.innerHTML = `${icon('#919191')}`;
        ghofieSettingsButton.classList.add('AppHeader-button');
        ghofieSettingsButton.classList.add('Button--secondary');

        document.querySelector('.AppHeader-globalBar-end notification-indicator').insertAdjacentElement('afterend', ghofieSettingsButton);

        document.getElementById('ghofie-settings-save-button').addEventListener(
            'click',
            function (e) {
                e.preventDefault();
                if (isConfigurationValid()) {
                    toggleSettingsDisplay();
                    userSettings.projectList = JSON.parse(document.getElementById("ghofie-project-list").value);
                    userSettings.editor = document.querySelector('input[name="ghofie-editor-choice"]:checked').value;
                    saveSettings();
                }
                return false;
            }
        );
    };


    loadSettings();
    initUrlChangeDetection();
})();