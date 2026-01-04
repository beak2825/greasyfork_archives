// ==UserScript==
// @name         Ladderr
// @version      0.5.9
// @description  Access your remote files directly from qBittorrent Web UI, just like in the desktop app.
// @author       luffier
// @namespace    ladderr
// @license      MIT
// @copyright    2023, luffier (https://github.com/Luffier)
// @match        https://*/
// @match        http://*/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAkFBMVEUAAAAxxP4xw/4wxP4uw/8xxP4ww/4xw/4py/8xxP4ww/4zxP4xxP8wxP4wxP4wxP4wxP4wxP4wxP4wxP4wxP4wxP8vw/8yw/8wxP4xxP4wxP4wxP8wxP4wxP4ww/4xxP4wxP4xxP8xwv8ws/8xxv8xxP8xxP8vxP4xxf4xxv4vxP4wxf4yw/8vx/8wwv4xxP/uOx+5AAAAL3RSTlMA65pkPIzXtQbJeicZxvn18d3PubCDUArl2r6ooJRuamBCHQUSwHZbWEhGNTMgFcZCVYAAAAD3SURBVDjLZZPZkoIwEACDCKtgkEM5VARl76v//+/2ZYXMpN+6qqkiyYx5MJCbmZij0Rwp0hnLxQsuCE5ecMImMxWdFxQki4zsvSBjXOQGv0ayg9tiKXyr4AuKeKaDWgU1bB0yriq4ErhaEqkgYuvqgbMKzhxc7bEqsJSRg6VVQYsim4zLBOHOoYa7CH5g7fpduVmrL6aMdxG8wVoQ8CqCBI9eBD1xKLDyXvybiyiNvnv9NsIDBu91G0cbyANBDqkRE/TyJKjEhJlPeDaSPaNjoT/FHYlYq9jfk5VYq3alKKicoAKf2Iht3rg0m2YgF78cGsXH/8H+ALCrJ8qsl2pUAAAAAElFTkSuQmCC
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// @sandbox      raw
// @homepageURL  https://github.com/Luffier/ladderr
// @supportURL   https://github.com/Luffier/ladderr/issues
// @downloadURL https://update.greasyfork.org/scripts/479135/Ladderr.user.js
// @updateURL https://update.greasyfork.org/scripts/479135/Ladderr.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(() => {
    'use strict';

    /* VARIABLES */

    // Global styles
    const style = `
    <style>
        #ladderrSettingsMenu {
            background-color: var(--color-background-popup);
            color: var(--color-text-default);
            position: absolute;
            z-index: 9999;
            top: 100px;
            width: 500px;
            left: 200px;
            font-size: 12px;
            box-shadow: black 1px 0 6px;
            border-radius: 5px;
        }
        #ladderrSettingsMenu .header {
            background-color: var(--color-background-default);
            border-bottom: 1px solid var(--color-border-default);
            border-radius: 5px 5px 0 0;
        }
        #ladderrSettingsMenu .header h3 {
            padding: 5px 10px 4px 12px;
        }
        #ladderrSettingsMenu .main {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
        }
        #ladderrSettingsMenu .main .variable {
            display: flex;
            align-items: center;
            padding-bottom: 10px;
            flex-grow: 1;
        }
        #ladderrSettingsMenu .main .variable label:first-child {
            width: 90px;
            font-weight: bold;
        }
        #ladderrSettingsMenu .main .variable input[type="text"] {
            flex-grow: 1;
        }
        #ladderrSettingsMenu .main .variable input[type="checkbox"] {
            margin-right: 1em;
        }
        #ladderrSettingsMenu .footer {
            display: flex;
            justify-content: center;
            padding-bottom: 10px;
        }
        #ladderrSettingsMenu .footer button {
            margin: 0px 10px;
        }
    </style>
    `;

    // Helper for whenPageReady function
    const Ladderr = {
        url: location.protocol + location.hostname + location.port,
        basePathLocal: null,
        basePathRemote: null,
        dClickOpen: null,
        pageTimeout: true,
        pageTimer: null,
        panelCollapsed: null,
        panelTabSelected: null,
        warnDangerousFiles: true,
        dangerousExtensions: '.exe,.com,.cmd,.bat,.pif,.scr,.vbs,.js,.wsf,.wsh,.hta,.cpl,.dll,.msi,.msp,.cab,.ps1,.py,.reg,.inf,.url,.vbe,.jse,.lnk,.scf,.application,.gadget,.appref-ms,.shb,.shs'
    }

    /* FUNCTIONS */

    // Single element selector shorthand
    const $ = document.querySelector.bind(document);

    // Multiple elements selector shorthand
    const $$ = document.querySelectorAll.bind(document);

    // Create element
    function createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    // Function to replicate the `on` function in jQuery
    function addEventListener(el, eventName, eventHandler, selector) {
        if (selector) {
            const wrappedHandler = (e) => {
                if (e.target && e.target.matches(selector)) {
                    eventHandler(e);
                }
            };
            el.addEventListener(eventName, wrappedHandler, true);
            return wrappedHandler;
        } else {
            el.addEventListener(eventName, eventHandler, true);
            return eventHandler;
        }
    }

    // Encode string to Base64 UTF-8
    function toBase64String(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    // Checks if the current page is a qBittorrent Web UI page
    function isCurrentPageValid() {
        const appNameElement = document.getElementsByName('application-name');
        if (appNameElement.length > 0) {
            return appNameElement[0].getAttribute('content') === 'qBittorrent';
        }
        return false;
    }

    // Executes the callback after the page finishes loading
    function whenPageReady(callback, intervalTime) {
        Ladderr.pageTimer = Date.now();
        console.debug('[Ladderr] Waiting for page to load');
        const observerCallback = (mutations, observer) => {
            if (Ladderr.pageTimeout) {
                clearTimeout(Ladderr.pageTimeout);
                Ladderr.pageTimeout = setTimeout(() => {
                    clearTimeout(Ladderr.pageTimeout);
                    Ladderr.pageTimeout = null;
                    observer.disconnect();
                    if (isCurrentPageValid()) {
                        console.debug(`[Ladderr] Page ready in ${Date.now() - Ladderr.pageTimer}ms!`);
                        callback();
                    } else {
                        console.debug(`[Ladderr] Page is not a qBittorrent Web UI`);
                    }
                }, intervalTime)
            } else {
                observer.disconnect();
            }
        };
        const observer = new MutationObserver(observerCallback);
        observer.observe($('body'), {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    // Create menu items for the different context menus
    function createContextMenuItems() {
        // Torrents queue list ("Open destination folder" context menu item)
        const queueMenuItem = $('#queueingMenuItems');
        const openDestinationMenutItem = createElement(`
        <li>
            <a><img src="images/directory.svg" alt="Open destination folder">
                <span>Open destination folder</span>
            </a>
        </li>
        `);
        addEventListener(openDestinationMenutItem, 'click', openDestinationFolder);
        queueMenuItem.after(openDestinationMenutItem);

        // Torrent files ("Open" context menu item)
        const torrentFilesMenu = $('#torrentFilesMenu');
        const openMenuItem = createElement(`
        <li>
            <a><img src="images/folder-documents.svg" alt="Open"> Open</a>
        </li>
        `);
        addEventListener(openMenuItem, 'click', openDirectly);
        torrentFilesMenu.append(openMenuItem);

        // Torrent files ("Open containing folder" context menu item)
        const openContainingMenuItem = createElement(`
        <li>
            <a><img src="images/directory.svg" alt="Open containing folder"> Open containing folder</a>
        </li>
        `);
        addEventListener(openContainingMenuItem, 'click', openContainingFolder);
        torrentFilesMenu.append(openContainingMenuItem);
    }

    // Save Ladderr settings to localStorage
    async function saveSettings() {
        const basePathRemote = $('#ladderrSettingsMenu_pathRemote').value;
        const basePathLocal = $('#ladderrSettingsMenu_pathLocal').value;
        const dClickOpen = $('#ladderrSettingsMenu_dClickOpen').checked;
        const warnDangerousFiles = $('#ladderrSettingsMenu_warnDangerous').checked;
        const dangerousExtensions = $('#ladderrSettingsMenu_dangerousExtensions').value;
        await GM.setValue(Ladderr.url + 'pathRemote', basePathRemote);
        await GM.setValue(Ladderr.url + 'pathLocal', basePathLocal);
        await GM.setValue(Ladderr.url + 'dClickOpen', `${dClickOpen}`);
        await GM.setValue(Ladderr.url + 'warnDangerousFiles', `${warnDangerousFiles}`);
        await GM.setValue(Ladderr.url + 'dangerousExtensions', dangerousExtensions);
        Ladderr.basePathRemote = basePathRemote;
        Ladderr.basePathLocal = basePathLocal;
        Ladderr.dClickOpen = dClickOpen;
        Ladderr.warnDangerousFiles = warnDangerousFiles;
        Ladderr.dangerousExtensions = dangerousExtensions;
        $('#torrentsTableDiv table').removeEventListener('dblclick', handleMainDClick, true);
        if (dClickOpen) {
            addEventListener($('#torrentsTableDiv table'), 'dblclick', handleMainDClick);
        }
    }

    // Load Ladderr settings from localStorage
    async function loadSettings() {
        const basePathRemote = await GM.getValue(Ladderr.url + 'pathRemote', Ladderr.basePathRemote);
        const basePathLocal = await GM.getValue(Ladderr.url + 'pathLocal', Ladderr.basePathLocal);
        const dClickOpen = (await GM.getValue(Ladderr.url + 'dClickOpen', Ladderr.dClickOpen)) === 'true';
        const warnDangerousFiles = (await GM.getValue(Ladderr.url + 'warnDangerousFiles', Ladderr.warnDangerousFiles)) === 'true';
        const dangerousExtensions = await GM.getValue(Ladderr.url + 'dangerousExtensions', Ladderr.dangerousExtensions);
        $('#ladderrSettingsMenu_pathRemote').value = basePathRemote;
        $('#ladderrSettingsMenu_pathLocal').value = basePathLocal;
        $('#ladderrSettingsMenu_dClickOpen').checked = dClickOpen;
        $('#ladderrSettingsMenu_warnDangerous').checked = warnDangerousFiles;
        $('#ladderrSettingsMenu_dangerousExtensions').value = dangerousExtensions;
        Ladderr.basePathRemote = basePathRemote;
        Ladderr.basePathLocal = basePathLocal;
        Ladderr.dClickOpen = dClickOpen;
        Ladderr.warnDangerousFiles = warnDangerousFiles;
        Ladderr.dangerousExtensions = dangerousExtensions;
        if (dClickOpen) {
            addEventListener($('#torrentsTableDiv table'), 'dblclick', handleMainDClick);
        }
    }

    // Create Ladderr settings menu
    function createSettingsMenu() {
        // Settings menu
        const ladderrSettingsMenu = createElement(`
            <div id="ladderrSettingsMenu">
                <div class="header">
                    <h3>Ladderr Settings Menu</h3>
                </div>
                <div class="main">
                    <div class="variable">
                        <label>· Remote path:</label><input type="text" id="ladderrSettingsMenu_pathRemote" size="10" />
                    </div>
                    <div class="variable">
                        <label>· Local path:</label><input type="text" id="ladderrSettingsMenu_pathLocal" size="10" />
                    </div>
                    <div class="variable">
                        <input type="checkbox" id="ladderrSettingsMenu_dClickOpen"/><label for="ladderrSettingsMenu_dClickOpen">Open destination folder with double-click</label>
                    </div>
                    <div class="variable">
                        <input type="checkbox" id="ladderrSettingsMenu_warnDangerous"/><label for="ladderrSettingsMenu_warnDangerous">Warn when opening dangerous file types</label>
                    </div>
                    <div class="variable">
                        <label>· Extensions:</label><input type="text" id="ladderrSettingsMenu_dangerousExtensions" size="10" />
                    </div>
                </div>
                <div class="footer">
                    <button id="ladderrSettingsMenu_saveBtn" title="Save settings" class="saveclose_buttons">Save</button>
                    <button id="ladderrSettingsMenu_closeBtn" title="Close window" class="saveclose_buttons">Close</button>
                </div>
            </div>
        `);
        $('#desktop').append(ladderrSettingsMenu);
        ladderrSettingsMenu.style.display = 'none';

        addEventListener($('#ladderrSettingsMenu_saveBtn'), 'click', () => {
            saveSettings();
            $('#ladderrSettingsMenu').style.display = 'none';
        });
        addEventListener($('#ladderrSettingsMenu_closeBtn'), 'click', () => {
            $('#ladderrSettingsMenu').style.display = 'none';
        });

        // Open settings context menu item
        const ladderrSettingsIcon = createElement(`
            <li>
                <a id="ladderrOptions">
                    <img class="MyMenuIcon" src="images/configure.svg" alt="Ladderr Options" width="16" height="16" style="filter: hue-rotate(180deg);">Ladderr Options
                </a>
            </li>
        `);
        $('#preferencesLink').parentNode.after(ladderrSettingsIcon);
        addEventListener(ladderrSettingsIcon, 'click', () => {
            loadSettings();
            $('#ladderrSettingsMenu').style.display = 'block';
        });
    }

    function getDangerousFileExtension(filename) {
        const extensions = Ladderr.dangerousExtensions?.split(',');
        return extensions?.find(x => filename?.endsWith(x));
    }


    function openUriLink(action=null) {
        if (Ladderr.basePathRemote == null || Ladderr.basePathLocal == null) {
            console.log('[Ladderr] Please configure your local and remote paths');
            return;
        }

        // Get 'Save path' column index
        const torrentTable = $('#torrentsTableDiv table');
        const torrentTableHeader = torrentTable.querySelector('thead tr');
        const torrentTableHeaders = Array.from(torrentTableHeader.children);

        // Get torrent remote path
        const torrentRow = torrentTable.querySelector('tbody tr.selected');
        const pathHeader = torrentTableHeader.querySelector('th.column_save_path');
        const pathHeaderIndex = torrentTableHeaders.indexOf(pathHeader);
        const pathRemote = torrentRow.querySelector(`td:nth-child(${pathHeaderIndex + 1})`).textContent;

        // Get torrent filename path
        const fileTableHeader = $('#torrentFilesTableFixedHeaderDiv table thead tr');
        const fileTableHeaders = Array.from(fileTableHeader.children);
        const fileProgressHeader = fileTableHeader.querySelector('th.column_progress');
        const fileProgressHeaderIndex = fileTableHeaders.indexOf(fileProgressHeader);
        const pathParts = [];
        let previousLevel = null;
        let fileIndex = null;
        let fileRow = null;
        let isRowFolder = null;
        let isTreeDone = true;
        let isTargetDone = true;
        while (fileIndex != 0) {
            if (fileRow == null) {
                fileRow = $('#torrentFilesTableDiv table tbody tr.selected');
                if (action === 'openDestination') {
                    fileRow = $('#torrentFilesTableDiv table tbody tr[data-row-id="0"]');
                }
                isTargetDone = (fileRow.querySelector(`td:nth-child(${fileProgressHeaderIndex + 1}) div div`).textContent !== '0.0%');
            } else {
                fileRow = fileRow.previousSibling;
            }
            fileIndex = fileRow.getAttribute('data-row-id');
            const fileName = fileRow.querySelector('span[id^="filesTablefileName"]');
            isRowFolder = (fileRow.querySelector('.filesTableCollapseIcon') != null);
            if (isRowFolder) {
                const rowCollapseIcon = fileRow.querySelector('.filesTableCollapseIcon');
                let folderLevel = getComputedStyle(rowCollapseIcon).marginLeft;
                folderLevel = parseInt(folderLevel.substring(0, folderLevel.length - 2));
                if (folderLevel < previousLevel || previousLevel == null) {
                    if (previousLevel !== null) {
                        isTreeDone = !isTreeDone ? false : (fileRow.querySelector(`td:nth-child(${fileProgressHeaderIndex + 1}) div div`).textContent !== '0.0%');
                    }
                    previousLevel = folderLevel;
                    pathParts.push(fileName.textContent);
                }
            } else if (pathParts.length === 0) {
                let folderLevel = getComputedStyle(fileName).marginLeft;
                folderLevel = parseInt(folderLevel.substring(0, folderLevel.length - 2)) - 39;
                previousLevel = folderLevel;
                pathParts.push(fileName.textContent);
            }
        }

        if ((action === 'openFolder' && !isTreeDone) ||
            (action === 'openDirectly' && !isTargetDone) ||
            (action === 'openDestination' && isRowFolder && !isTargetDone)) {
            console.log('[Ladderr] Can\'t open folder or file for not initialized torrents');
            return;
        }

        let protocol = '';
        if (action === 'openDirectly') {
            protocol = 'ladderr-open:';
        } else if (action === 'openFolder') {
            if (isTargetDone) {
                protocol = 'ladderr-select:';
            } else {
                protocol = 'ladderr-open:';
                pathParts.shift();
            }
        } else if (action === 'openDestination') {
            protocol = 'ladderr-open:';
            if (!isRowFolder) {
                pathParts.shift();
            }
        }

        const pathLocal = pathRemote.replace(Ladderr.basePathRemote, Ladderr.basePathLocal).replaceAll('/', '\\');
        let fileNamePath = pathParts.reverse().join('\\');
        if (fileNamePath.length > 0) {
            fileNamePath = `\\${fileNamePath}`;
        }
        const remotePath = pathLocal + fileNamePath;
        const encodedRemotePath = toBase64String(remotePath)
        const uri = `${protocol}${encodedRemotePath}`;

        const dangerousFileExtension = getDangerousFileExtension(fileNamePath);
        if (Ladderr.warnDangerousFiles && dangerousFileExtension && protocol === 'ladderr-open:') {
            if (!confirm(`Are you sure you want to open this ${dangerousFileExtension} file? This file type could potentially be harmful.`)) {
                return;
            }
        }

        console.debug('[Ladderr] Remote path: ', remotePath);
        console.debug('[Ladderr] URI created: ', uri);
        window.open(uri, '_self');
    }

    function openContainingFolder() {
        openUriLink('openFolder');
    }

    function openDirectly() {
        openUriLink('openDirectly');
    }

    function openDestinationFolder() {
        const panel = $('#propertiesPanel_wrapper');
        Ladderr.panelTabSelected = $('#propertiesTabs li.selected').id;
        Ladderr.panelCollapsed = panel.classList.contains('collapsed');
        if (Ladderr.panelCollapsed || Ladderr.panelTabSelected != 'PropFilesLink') {
            const filesTableObserver = new MutationObserver((mutations, observer) => {
                if ($('#filesTablefileName0')) {
                    observer.disconnect();
                    openUriLink('openDestination');
                    $(`#${Ladderr.panelTabSelected}`).click();
                    if ($('#propertiesPanel_wrapper').classList.contains('expanded') && Ladderr.panelCollapsed) {
                        $('#propertiesPanel_collapseToggle').click();
                    }
                }
            });
            filesTableObserver.observe($('#torrentFilesTableDiv table tbody'), { childList: true });

            if (!panel.classList.contains('expanded')) {
                $('#propertiesPanel_collapseToggle').click();
            }
            if ($('#propertiesTabs li.selected').id != 'PropFilesLink'){
                $('#PropFilesLink').click();
            }
        } else {
            openUriLink('openDestination');
        }
    }

    function handleContentDClick(event) {
        let element = event.target;
        while (element) {
            if (element === this) {
                openDirectly();
                break;
            }
            element = element.parentNode;
        }
    }

    function handleMainDClick(event) {
        event.stopPropagation();
        let element = event.target;
        while (element) {
            if (element === this) {
                openDestinationFolder();
                break;
            }
            element = element.parentNode;
        }
    }

    function processPage() {
        createSettingsMenu();
        loadSettings();
        createContextMenuItems();
        addEventListener($('#torrentFilesTableDiv table'), 'dblclick', handleContentDClick);
    }

    whenPageReady(() => {
        $('head').append(createElement(style));
        processPage();
    }, 250);

})();
