// ==UserScript==
// @name         [AO3] Mute Selectively
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Allow more flexible muting without resorting to a site skin
// @license      MIT
// @match        *://*.archiveofourown.org/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/467113/%5BAO3%5D%20Mute%20Selectively.user.js
// @updateURL https://update.greasyfork.org/scripts/467113/%5BAO3%5D%20Mute%20Selectively.meta.js
// ==/UserScript==

// Many thanks to a certain other nonnie

const standardSize = {
    titleFont: 30,
    headerFont: 20,
    tabFont: 19,
    refreshFont: 15,
    actionFont: 14,
    menuWidth: 600,
    menuHeight: 600
}

const mobileSize = {
    titleFont: 24,
    headerFont: 18,
    tabFont: 14,
    refreshFont: 13,
    actionFont: 12,
    menuWidth: 390,
    menuHeight: 500
}

var fontSizing = {}

var commentMute = []

function getMenuRules(darkmode) {

    var rules = {};

    rules['.AO3-MS-toggle'] = {
        'color': darkmode? '#f1f1f1' : '#1f1f1f',
        'background-color': darkmode? '#1f1f1f' : '#f1f1f1',
        'padding': '1px 4px',
        'margin': '0px 0px 0px 4px',
        'display': 'inline-block',
        'border': '1px solid ' + (darkmode? '#f1f1f1' : '#1f1f1f'),
    };

    rules['.AO3-MS-toggle a'] = {
        'text-decoration': 'none',
        'border': (darkmode? '#f1f1f1' : '#1f1f1f') + '!important',
        'color': (darkmode? '#f1f1f1' : '#1f1f1f') + '!important',
    };

    rules['.AO3-MS-usermenu'] = {
        'position': 'absolute',
        'display': 'inline-block',
        'color': darkmode? '#f1f1f1' : '#1f1f1f',
        'background-color': darkmode? '#1f1f1f' : '#f1f1f1',
        'margin': '0px 0px 0px 4px',
        'border-style': 'solid',
        'border-color': darkmode? '#f1f1f1 !important' : '#1f1f1f !important',
        'z-index': '100',
    };

    rules['.AO3-MS-usermenu-item'] = {
        'display': 'block',
        'position': 'relative',
        'padding': '3px 5px 2px 5px',
    };

    rules['.AO3-MS-usermenu-item-selected'] = {
        'background-color': darkmode? '#3f3f3f' : '#d1d1d1',
    };

    rules['.AO3-MS-usermenu-item a'] = {
        'color': darkmode? '#f1f1f1' : '#1f1f1f',
        'text-decoration': 'none',
        'display': 'inline-block',
        'width': '100%',
        'border': darkmode? '#f1f1f1' : '#1f1f1f',
    };

    rules['.AO3-MS-usermenu-item:hover'] = {
        'background-color': darkmode? '#555' : '#ddd',
    };

    rules['.AO3-MS-muted'] = {
        'display': 'none !important',
    };


    rules['.AO3-MS-collapseBlurb'] = {
        'padding': '20px',
    }

    rules['.AO3-MS-mutePhrase'] = {
        'margin': '0px 4px',
    }

    rules['#AO3-MS-settings'] = {
        'color': darkmode? '#f1f1f1' : '#1f1f1f',
        'background-color': darkmode? '#1f1f1f' : '#f1f1f1',
        'display': 'none',
        'flex-flow': 'column',
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'width': fontSizing.menuWidth + 'px',
        'height': fontSizing.menuHeight + 'px',
        'margin': '-' + (fontSizing.menuHeight / 2 ) + 'px -' + (fontSizing.menuWidth / 2) + 'px',
        'box-shadow': '10px 10px 20px rgba(0, 0, 0, 0.5)',
        'z-index': '100',
        'border': '1px solid ' + (darkmode? '#f1f1f1' : '#1f1f1f') + '!important',
        'font-size': fontSizing.actionFont + 'px',
    };

    rules['#AO3-MS-settings a'] = {
        'color': darkmode? '#aaa' : '#666',
    };

    rules['#AO3-MS-settings a:hover'] = {
        'color': darkmode? '#ddd' : '#333',
    };

    rules['#AO3-MS-title'] = {
        'margin': '10px 0px 0px',
        'text-align': 'center',
        'font-size': fontSizing.titleFont + 'px',
    };

    rules['#AO3-MS-closeMenu'] = {
        'position': 'absolute',
        'top': '0px',
        'right': '0px',
        'margin': '5px',
        'width': (fontSizing.actionFont + 10) + 'px',
        'height': (fontSizing.actionFont + 10) + 'px',
        'font-size': fontSizing.actionFont + 'px',
    };

    rules['#AO3-MS-tablist'] = {
        'margin': '10px 0px',
        'text-align': 'center',
        'border-bottom': '1px solid ' + (darkmode? '#f1f1f1' : '#1f1f1f'),
    };

    rules['.AO3-MS-tab'] = {
        'display': 'inline-block',
        'padding': '5px',
        'height': fontSizing.tabFont + 'px',
        'background-color': darkmode? '#2f2f2f' : '#eee',
        'border': '1px solid ' + (darkmode? '#e2e2e2' : '#2e2e2e') + '!important',
        'box-size': 'border-box',
    };

    rules['#AO3-MS-viewport'] = {
        'display': 'flex',
        'flex-flow': 'column',
        'flex': '1 1 auto',
        'bottom': '0px',
    };

    rules['.AO3-MS-view'] = {
        'display': 'none',
    };

    rules['.AO3-MS-active.AO3-MS-view'] = {
        'display': 'flex',
        'flex-flow': 'column',
        'height': '100%',
        'bottom': '0px',
    };

    rules['.AO3-MS-active.AO3-MS-tab'] = {
        'background': darkmode? '#555' : '#ccc',
        'color': (darkmode? '#ddd' : '#333') + '!important',
    };

    rules['.AO3-MS-header'] = {
        'position': 'inline-block',
        'left': '0px',
        'right': '0px',
        'top': '0px',
        'margin': '5px 10px',
        'font-size': fontSizing.headerFont + 'px',
        'text-align': 'center',
    };

    rules['.AO3-MS-sortbar'] = {
        'position': 'inline-block',
        'left': '0px',
        'right': '0px',
        'top': '0px',
        'margin': '5px 10px',
        'text-align': 'center',
    };


    rules['.AO3-MS-sortbar a'] = {
        'margin': '0px 5px',
        'text-decoration': 'none',
    };

    rules['.AO3-MS-list'] = {
        'flex': '1 1 auto',
        'height': '100px',
        'overflow-y': 'scroll',
    };

    rules['.AO3-MS-refresh'] = {
        'position': 'inline-block',
        'font-size': fontSizing.refreshFont + 'px',
        'margin': '0px 10px',
        'text-align': 'center',
    };

    rules['#AO3-MS-checkboxes'] = {
        'flex': '1 1 auto',
        'height': '100px',
        'padding': '10px',
        'overflow-y': 'scroll',
    };

    rules['.AO3-MS-padding'] = {
        'display': 'flex',
        'flex-flow': 'column',
        'flex': '1 1 auto',
        'padding': '10px',
    };

    rules['.AO3-MS-textarea, .AO3-MS-textarea:focus'] = {
        'position': 'inline-block',
        'left': '0px',
        'width': '100%',
        'display': 'flex',
        'flex-flow': 'column',
        'padding': '10px',
        'height': '100%',
        'resize': 'none',
        'box-sizing': 'border-box',
        'background-color': darkmode? '#3e3e3e' : '#e3e3e3',
        'color': darkmode? '#f1f1f1' : '#1f1f1f',
    };

    rules['#AO3-MS-viewport input[type="button"]'] = {
        'display': 'inline-block',
        'flex': '0 1 auto',
        'bottom': '0px',
        'margin': '5px 0px 0px 0px',
        'font-size': fontSizing.refreshFont + 'px',
        'box-shadow': '2px 1px 2px gray',
        'background-color': darkmode? '#3e3e3e' : '#e3e3e3',
        'color': darkmode? '#f1f1f1' : '#1f1f1f',
    };

    rules['#AO3-MS-viewport input[type="button"]:active'] = {
        'box-shadow': '0 0 0 ' + darkmode? '#333' : '#eee',
    };

    rules['#AO3-MS-css-reset,#AO3-MS-css-save'] = {
        'width': '100%',
    };

    rules['#AO3-MS-import-button'] = {
        'width': '100%',
    };

    rules['.AO3-MS-action'] = {
        'font-size': fontSizing.actionFont + 'px',
        'margin-left': '5px',
        'color': darkmode? '#7f7feb' : '#4d4dff !important',
    };

    rules['.AO3-MS-action:hover'] = {
        'font-size': fontSizing.actionFont + 'px',
        'margin-left': '5px',
        'color': darkmode? '#a5a5fa' : '#27279c !important',
    };

    rules['.AO3-MS-action:before'] = {
        'content': '"("',
    };

    rules['.AO3-MS-action:after'] = {
        'content': '")"',
    };

    rules['.AO3-MS-item'] = {
        'padding': '10px',
    };

    rules['.AO3-MS-item a'] = {
        'border': darkmode? '#333' : '#eee',
    };

    rules['.AO3-MS-filter:before'] = {
        'content': '\'"\'',
    };

    rules['.AO3-MS-filter:after'] = {
        'content': '\'"\'',
    };

    return rules;
}

function addMuteRules(muteByStyle) {

    var rules = {};

    rules[muteByStyle] = {
        'display': 'none !important',
    };

    return rules;
}

function makeStyleCode(rules) {
    var contents = "";

    for (var descriptor in rules) {
        if (! rules.hasOwnProperty(descriptor)) continue;

        contents += descriptor + " {\n";

        for (var property in rules[descriptor]) {
            if (! rules[descriptor].hasOwnProperty(property)) continue;

            contents += "    " + property + ": " + rules[descriptor][property] + ";\n";
        }

        contents += "}\n";
    }

    return contents;
}

function makeStyleSheet(str,identifier) {
    if (document.querySelectorAll('#' + identifier).length) {
        document.querySelector('#' + identifier).remove()
    }

    var sheet = document.createElement('style');
    sheet.innerHTML = str;
    sheet.id = identifier
    document.body.appendChild(sheet);
}

async function changeReason(identifier,index,reason) {
    let temp = await GM.getValue(identifier)
    temp[index][3] = reason

    await GM.setValue(identifier,temp)

    let affectedReasons = document.querySelectorAll('.AO3-MS-collapsed-' + temp[index][0] + ' .AO3-MS-mutePhraseReason')
    for (const r of affectedReasons) {
        if (!reason) {
            r.innerText = ''
        } else {
            r.innerText = ' (' + reason + ')'
        }
    }

    let refresh = refreshFilterList(identifier)
    refresh();
}

function makeBlurbFilterItem(identifier,index,value,refresh) {
    let element = document.createElement("div");
    element.className = "AO3-MS-item";
    let filter = document.createElement("span");
    filter.className = "AO3-MS-filter";

    let aTitle = document.createElement('a');
    aTitle.href = 'https://archiveofourown.org/works/' + value[0].split('work-')[1]
    aTitle.appendChild(document.createTextNode(value[1]));
    element.appendChild(aTitle)
    element.appendChild(document.createTextNode(' by '))

    let names = value[2].split(', ')
    for (let i = 0; i < names.length; i++) {
        let aName = document.createElement('a')
        let linkName = names[i].includes(' (')? names[i].split(' (')[1].split(')')[0] : names[i]
        aName.href = 'https://archiveofourown.org/users/' + linkName
        aName.appendChild(document.createTextNode(names[i]))
        element.appendChild(aName)
        if (i < names.length - 1) {
            element.appendChild(document.createTextNode(', '))
        }
    }

    let remove = makeActionLink("unmute", async function() {
        await delVal(identifier,value[0])
        await refresh();
    });
    element.appendChild(remove)

    let reason = document.createTextNode(' Reason: ' + value[3])
    element.appendChild(reason)

    let editReason = makeActionLink('edit reason', async function () {
        let newReason = prompt("Reason for muting " + value[1] + ":", value[3]);
        if (newReason === null) {
            return null;
        }
        await changeReason(identifier,index,newReason)
        await refresh();
    });
    element.appendChild(editReason)

    return element;
}

function makeUserFilterItem(identifier, index, value, refresh) {
    let element = document.createElement("div");
    element.className = "AO3-MS-item";
    let filter = document.createElement("span");
    filter.className = "AO3-MS-filter";

    let id = document.createTextNode('(UserID ' + value[0].split('user-')[1] + ') ')

    let aName = document.createElement('a');
    aName.href = 'https://archiveofourown.org/users/' + value[2]
    aName.appendChild(document.createTextNode(value[2]));

    let remove = document.createElement('a')
    remove.className = "AO3-MS-action";
    remove.href = "javascript:void(0)";
    remove.appendChild(document.createTextNode('edit'));
    remove.onclick = async function() {
        await toggleUser(element,remove,value[0],value[2])
    };

    let reason = document.createTextNode(' Reason: ' + value[3])

    let editReason = makeActionLink('edit reason', async function () {
        let newReason = prompt("Reason for muting " + value[2] + ":", value[3]);
        if (newReason === null) {
            return null;
        }
        await changeReason(identifier,index,newReason)
        await refresh();
    });

    element.appendChild(id)
    element.appendChild(aName)
    element.appendChild(remove)
    element.appendChild(reason)
    element.appendChild(editReason)

    return element;
}

function makeTagFilterItem(identifier,index,value,refresh) {
    let element = document.createElement("div");
    element.className = "AO3-MS-item";
    let filter = document.createElement("span");
    filter.className = "AO3-MS-filter";

    let tagName = document.createElement('a');
    tagName.href = value[1]
    tagName.appendChild(document.createTextNode(value[2]));
    element.appendChild(tagName)

    let remove = makeActionLink("unmute", async function() {
        await delVal(identifier,value[0])
        await refresh();
    });
    element.appendChild(remove)

    let reason = document.createTextNode(' Reason: ' + value[3])
    element.appendChild(reason)

    let editReason = makeActionLink('edit reason', async function () {
        let newReason = prompt("Reason for muting " + value[2] + ":", value[3]);
        if (newReason === null) {
            return null;
        }
        await changeReason(identifier,index,newReason)
        await refresh();
    });
    element.appendChild(editReason)

    return element;
}

function refreshFilterList(identifier) {
    let refresh = async function() {
        // Load the array first to prevent visual glitches.
        let array = await GM.getValue(identifier,[]),
            list = document.querySelector('#AO3-MS-list-' + identifier)

        while (list.firstChild !== null) {
            list.removeChild(list.firstChild);
        }

        if (identifier === 'blurblist') {
            for (let i = 0; i < array.length; ++i) {
                list.appendChild(makeBlurbFilterItem(identifier, i, array[i], refresh));
            }
        } else if (identifier === 'userlist') {
            for (let i = 0; i < array.length; ++i) {
                list.appendChild(makeUserFilterItem(identifier, i, array[i], refresh));
            }
        } else if (identifier === 'taglist') {
            for (let i = 0; i < array.length; ++i) {
                list.appendChild(makeTagFilterItem(identifier, i, array[i], refresh));
            }
        }

    };

    return refresh;
}

async function sortList(listType, sortBy, reverse) {

    let list = await GM.getValue(listType,[]);
    if (!list.length) return;

    let i = 2; // sortBy === 'Name'
    if (sortBy === 'Title') i = 1;
    if (sortBy === 'Date') i = 4;

    if (sortBy === 'id') {
        list.sort(function(a, b) {
            let x = a[0].split('-')[1]*1;
            let y = b[0].split('-')[1]*1;
            return x - y;
        });
    } else if (sortBy === 'Date') {
        list.sort(function(a, b) {
            let x = (a[i]? a[i]: 0);
            let y = (b[i]? b[i]: 0);
            return x - y;
        });
    }else {
        list.sort(function(a, b) {
            let x = a[i].toLowerCase();
            let y = b[i].toLowerCase();
            if (x < y) return -1;
            if (y < x) return 1;
            return 0;
        });
    }
    if (reverse) list.reverse();

    await GM.setValue(listType, list);
    let refresh = refreshFilterList(listType);
    refresh();
}

function makeSortButton(container, listType, title) {
    let a = document.createElement('a');
    a.href = "javascript:void(0)";
    a.appendChild(document.createTextNode(title + '↕'));

    a.onclick = function() {
        let reverse = a.innerText.includes('↓')
        sortList(listType, title, reverse)
        a.innerText = a.innerText.slice(0, -1) + (reverse? '↑' : '↓')
    }

    container.appendChild(a)
}

function makeFilterList(container, identifier, title) {
    let header = document.createElement("div");
    header.className = "AO3-MS-header";
    header.appendChild(document.createTextNode(title));

    let sortBar = document.createElement("div");
    sortBar.className = "AO3-MS-sortbar";

    if (identifier === 'blurblist') {
        makeSortButton(sortBar, identifier, "Title")
        makeSortButton(sortBar, identifier, "Author")
    } else {
        makeSortButton(sortBar, identifier, "Name")
    }
    makeSortButton(sortBar, identifier, "Date")

    let list = document.createElement("div");
    list.id = "AO3-MS-list-" + identifier;
    list.className = "AO3-MS-list";

    let refresh = refreshFilterList(identifier)
    refresh();

    container.appendChild(header);
    container.appendChild(sortBar);
    container.appendChild(list);

    return refresh;
}

function formatListNameForId(val) {
    val = String(val).charAt(0).toUpperCase() + String(val).slice(1)
    return val.split('list')[0] + 's'
}

function makeMutingTab(viewport, listType, header) {

    // Create the tab showing blocked entries
    let mutelist = document.createElement('div');
    mutelist.id = 'AO3-MS-muted' + formatListNameForId(listType);
    viewport.appendChild(mutelist);

    let listRefresh = makeFilterList(mutelist, listType, header);

    return async function() {
        await listRefresh();
    };
}

async function addCheckbox(container, identifier, caption, hover) {
    var item = document.createElement("div");

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "AO3-MS-settings-" + identifier;

    checkbox.checked = await GM.getValue(identifier, false);
    checkbox.onclick = async function() {
        await GM.setValue(identifier, checkbox.checked);
    };

    var label = document.createElement("label");
    label.appendChild(document.createTextNode(caption));
    label.setAttribute('for', "AO3-MS-settings-" + identifier);
    label.setAttribute('title', hover);

    item.appendChild(checkbox);
    item.appendChild(label);
    container.appendChild(item);

    var refresh = async function() {
        checkbox.checked = await GM.getValue(identifier, false);
    };

    return refresh;
}

async function makeFilterTab(viewport) {
    // Create the tab with the general settings.
    var general = document.createElement("div");
    general.id = "AO3-MS-general";
    viewport.appendChild(general);

    var header = document.createElement("div");
    header.className = "AO3-MS-header";
    header.appendChild(document.createTextNode("Filter Settings"));
    general.appendChild(header);

    var refresh = document.createElement("div");
    refresh.className = "AO3-MS-refresh";
    refresh.appendChild(document.createTextNode("Refresh the page to make new extension settings take effect."));
    general.appendChild(refresh);

    var checkboxes = document.createElement("div");
    checkboxes.id = "AO3-MS-checkboxes";
    general.appendChild(checkboxes);

    var refreshList = [];

    refreshList.push(
        await addCheckbox(checkboxes, "mute",
                          "Remove 'Hidden content' messages (aka total mute).",
                          "When unchecked, the content vanishes without trace for works and series.\n"+
                          "When checked, it will display a message to indicate a work/series has been hidden.\n"+
                          "Note that this means you'll only be able to unmute items from the menu.\n"+
                          "Bookmarks and comments by a muted user will not have hidden content indicators."));
    refreshList.push(
        await addCheckbox(checkboxes, "addReason",
                          "Ask me for a reason whenever something/someone is muted.",
                          "When unchecked, it will mute in one click and leave the reason blank.\n" +
                          "When checked, it will prompt for a reason before the mute goes through."));
    refreshList.push(
        await addCheckbox(checkboxes, "showName",
                          "Show name/title in hidden content message for works and series.",
                          "If there is a hidden content message, it defaults to a generic 'Hidden content' message.\n"+
                          "If you check this box, then it will display the name of the user who posted the content.\n"+
                          "If the specific work/series was muted, it will also display the title."));
    refreshList.push(
        await addCheckbox(checkboxes, "showReason",
                          "Show reason for muting in hidden content message for works and series.",
                          "If there is a hidden content message, it defaults to a generic 'Hidden content' message.\n"+
                          "If this box is checked, it will display the reason you entered for muting the content."));
    refreshList.push(
        await addCheckbox(checkboxes, "showTagToggles",
                          "Show tag toggles for all blurbs in works listings.",
                          "If left unchecked, will only show toggles on individual works and page headings. \n"+
                          "May not be recommended for older/slower mobile devices.\n"+
                          "By default, tag toggles will show at the header of every tag page and tag work listing, and on individual works."));
    refreshList.push(
        await addCheckbox(checkboxes, "forceMobile",
                          "Display in mobile-friendly view even on larger screens.",
                          "Displays a smaller window with smaller font."));

    refreshList.push(
        await addCheckbox(checkboxes, "darkmode",
                          "Use darkmode theme.",
                          "You can also use the CSS tab to set up a custom style."));

    return async function() {
        for (var i = 0; i < refreshList.length; ++i) {
            await refreshList[i]();
        }
    };
}

// Unicode fix from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

async function getFilterSettings() {
    var settings = {};

    settings.userlist = await GM.getValue('userlist');
    settings.blurblist = await GM.getValue('blurblist');
    settings.taglist = await GM.getValue('taglist');

    var booleanNames = [
        'addReason',
        'mute',
        'showName',
        'showReason',
        'forceMobile',
        'showTagToggles',
        'darkmode',
    ];

    for (var i = 0; i < booleanNames.length; ++i) {
        var name = booleanNames[i];
        settings[name] = await GM.getValue(name, false);
    }

    settings['custom-css'] = await loadCustomCSS();

    return settings;
}

async function saveFilterSettings(settings) {

    await GM.setValue('userlist',settings.userlist)
    await GM.setValue('blurblist',settings.blurblist)

    var booleanNames = [
        'addReason',
        'mute',
        'showName',
        'showReason',
        'forceMobile',
        'showTagToggles',
        'darkmode',
    ];

    for (let i = 0; i < booleanNames.length; ++i) {
        var name = booleanNames[i];
        if (settings.hasOwnProperty(name)) {
            GM.setValue(name, settings[name]);
        }
    }

    if (settings.hasOwnProperty('custom-css')) {
        GM.setValue('custom-css', settings['custom-css']);
    }
}



async function updateExport() {
    var exportText = document.getElementById("AO3-MS-export");
    var settings = await getFilterSettings();

    exportText.value = utf8_to_b64(JSON.stringify(settings));
    exportText.select();
    exportText.focus();
}

async function doImport() {
    var importText = document.getElementById("AO3-MS-import");

    try {
        var settings = JSON.parse(b64_to_utf8(importText.value));
        await saveFilterSettings(settings);
        updateExport();
    } catch (e) {
        alert("Invalid data.");
    }
}

function makeImportTab(viewport) {
    // Make tab to import settings & filters
    var contMain = document.createElement("div");
    contMain.id = "AO3-MS-importMain";
    viewport.appendChild(contMain);

    var header = document.createElement("div");
    header.className = "AO3-MS-header";
    header.appendChild(document.createTextNode("Import settings & filters"));
    contMain.appendChild(header);

    var refresh = document.createElement("div");
    refresh.className = "AO3-MS-refresh";
    refresh.appendChild(document.createTextNode("Refresh the page to make new extension settings take effect."));
    contMain.appendChild(refresh);

    var padder = document.createElement("div")
    padder.className = "AO3-MS-padding"
    contMain.appendChild(padder)

    var importText = document.createElement("textarea");
    importText.id = "AO3-MS-import";
    importText.className = "AO3-MS-textarea";
    padder.appendChild(importText);

    var importButton = document.createElement("input");
    importButton.id = "AO3-MS-import-button";
    importButton.type = "button";
    importButton.value = "Import";
    importButton.onclick = doImport;
    padder.appendChild(importButton);

}

function makeExportTab(viewport) {

    // Create the tab with save and export boxes.
    var contMain = document.createElement("div");
    contMain.id = "AO3-MS-exportMain";
    viewport.appendChild(contMain);

    var exportHeader = document.createElement("div");
    exportHeader.className = "AO3-MS-header";
    exportHeader.appendChild(document.createTextNode("Export settings & filters"));
    contMain.appendChild(exportHeader);

    var padder = document.createElement("div")
    padder.className = "AO3-MS-padding"
    contMain.appendChild(padder)

    var exportText = document.createElement("textarea");
    exportText.id = "AO3-MS-export";
    exportText.className = "AO3-MS-textarea";
    exportText.readOnly = true;
    padder.appendChild(exportText);

    return updateExport;
}

function getDefaultRules() {
    var rules = {};

    var blockedBackground = 'none';
    var blockedColor = 'none';

    rules['.AO3-MS-collapseBlurb'] = {
        'background-color': blockedBackground,
        'color': blockedColor,
        'padding': '20px',
    }

    return rules;
}

async function loadCustomCSS() {
    var result = await GM.getValue('custom-css', null);
    if (result === null) {
        result = makeStyleCode(getDefaultRules());
    }
    return result;
}

async function updateCSS() {
    var cssText = document.getElementById("AO3-MS-css");
    cssText.value = await loadCustomCSS();
}

async function saveCSS() {
    var cssText = document.getElementById("AO3-MS-css");
    await GM.setValue('custom-css', cssText.value);
}

async function resetCSS() {
    await GM.deleteValue('custom-css');
    await updateCSS();
}

function makeColorsTab(viewport) {
    // Create the tab with the custom CSS editor.
    var colors = document.createElement("div");
    colors.id = "AO3-MS-colors";
    viewport.appendChild(colors);

    var cssHeader = document.createElement("div");
    cssHeader.className = "AO3-MS-header";
    cssHeader.appendChild(document.createTextNode("Custom styling"));
    colors.appendChild(cssHeader);

    var refresh = document.createElement("div");
    refresh.className = "AO3-MS-refresh";
    refresh.appendChild(document.createTextNode("Refresh the page to make new extension settings take effect."));
    colors.appendChild(refresh);

    var padder = document.createElement("div")
    padder.className = "AO3-MS-padding"
    colors.appendChild(padder)

    var css = document.createElement("textarea");
    css.id = "AO3-MS-css";
    css.className = "AO3-MS-textarea";
    padder.appendChild(css);

    var cssSave = document.createElement("input");
    cssSave.id = "AO3-MS-css-save";
    cssSave.className = "AO3-MS-css-button";
    cssSave.type = "button";
    cssSave.value = "Save";
    cssSave.onclick = async function () {
        await GM.setValue('custom-css',css.value)
    };
    padder.appendChild(cssSave);

    var cssReset = document.createElement("input");
    cssReset.id = "AO3-MS-css-reset";
    cssReset.className = "AO3-MS-css-button";
    cssReset.type = "button";
    cssReset.value = "Reset to Default";
    cssReset.onclick = resetCSS;
    padder.appendChild(cssReset);

    css.onchange = saveCSS;

    return updateCSS;
}

function toggleSettings() {
    var settings = document.getElementById("AO3-MS-settings");
    if (settings === null) return;

    if (settings.style.display == "flex") {
        settings.style.top = "-50%";
        settings.style.display = "none";
    } else {
        settings.style.display = "flex";
        settings.style.top = "50%";
    }
}

function addTab(container, name, view, active, action) {
    var classView = "AO3-MS-view";
    var classActive = "AO3-MS-active";
    var classTab = "AO3-MS-tab";

    var link = document.createElement("a");
    link.className = classTab;
    link.href = "javascript:void(0)";
    var text = document.createTextNode(name);
    link.appendChild(text);
    container.appendChild(link);

    var viewElement = document.getElementById(view);
    viewElement.className = classView;

    link.onclick = function(e) {
        var views = document.getElementsByClassName(classView);
        for (let i = 0; i < views.length; ++i) {
            views[i].className = classView;
        }

        var tabs = document.getElementsByClassName(classTab);
        for (let i = 0; i < tabs.length; ++i) {
            tabs[i].className = classTab;
        }

        viewElement.className += " " + classActive;
        link.className += " " + classActive;

        if (action !== undefined && action !== null) {
            action();
        }
    };

    if (active) {
        viewElement.className += " " + classActive;
        link.className += " " + classActive;
    }
}

function makeActionLink(text, action) {
    var link = document.createElement("a");
    link.href = "javascript:void(0)";
    link.className = "AO3-MS-action";
    link.onclick = action;
    link.appendChild(document.createTextNode(text));
    return link;
}


async function makeSettings() {
    // Create the settings window.
    var settings = document.createElement("div");
    settings.id = "AO3-MS-settings";

    var header = document.createElement("div");
    header.id = "AO3-MS-title";
    header.appendChild(document.createTextNode("Selective Muting"));
    settings.appendChild(header);

    var closeButton = document.createElement("input");
    closeButton.id = "AO3-MS-closeMenu";
    closeButton.type = "button";
    closeButton.value = "X";
    closeButton.onclick = function () {
        toggleSettings()
    };
    header.appendChild(closeButton);

    var tabs = document.createElement("div");
    tabs.id = "AO3-MS-tablist";
    settings.appendChild(tabs);

    var viewport = document.createElement("div");
    viewport.id = "AO3-MS-viewport";
    settings.appendChild(viewport);

    document.body.appendChild(settings);

    // Create the tabs and add them.
    var blurblistRefresh = await makeMutingTab(viewport, 'blurblist', 'Works & Series');
    var userlistRefresh = await makeMutingTab(viewport, 'userlist', 'Users');
    var taglistRefresh = await makeMutingTab(viewport, 'taglist', 'Tags');
    var generalRefresh = await makeFilterTab(viewport);
    var colorsRefresh = await makeColorsTab(viewport);
    var importRefresh = await makeImportTab(viewport);
    var exportRefresh = await makeExportTab(viewport);

    addTab(tabs, "Works/Series", "AO3-MS-mutedBlurbs", true, blurblistRefresh);
    addTab(tabs, "Users", "AO3-MS-mutedUsers", false, userlistRefresh);
    addTab(tabs, "Tags", "AO3-MS-mutedTags", false, taglistRefresh);
    addTab(tabs, "Settings", "AO3-MS-general", false, generalRefresh);
    addTab(tabs, "CSS", "AO3-MS-colors", false, colorsRefresh);
    addTab(tabs, "Import", "AO3-MS-importMain", false, importRefresh);
    addTab(tabs, "Export", "AO3-MS-exportMain", false, exportRefresh);
}

async function makeCollapseBlurb(blurb,blurbInfo) {
    const seriesList = Array.from(blurb?.classList).filter((c) =>
            c.startsWith('series-'),
        );
    const workList = Array.from(blurb?.classList).filter((c) =>
            c.startsWith('work-'),
        );

    let container = document.createElement('li')
    container.classList.add('AO3-MS-collapseBlurb')
    container.classList.add('blurb')

    for (const c of seriesList) {
        container.classList.add('AO3-MS-collapsed-' + c)
    }

    for (const c of workList) {
        container.classList.add('AO3-MS-collapsed-' + c)
    }

    container.classList.add(blurb.id)
    blurb.parentElement.insertBefore(container,blurb)

    await addToCollapseBlurb(container, blurbInfo, blurb)
}

async function addToCollapseBlurb(container, blurbInfo, blurb) {
    let mutePhrase = document.createElement('span')
    mutePhrase.classList.add('AO3-MS-mutePhrase')
    mutePhrase.innerText = 'Hidden content'

    let reason = document.createElement('span')
    reason.classList.add('AO3-MS-mutePhraseReason')

    if (blurbInfo[1].split('/tags/').length > 1) {
        if (blurb) {
            makeTogglebox(container, '(show)', container) // Add a * or something in front to fast unmute? Ugh
        }
        if (container.innerText.includes('because of tag:')) {
            mutePhrase.innerHTML = ', <a href="' + blurbInfo[1] + '">' + blurbInfo[2] + '</a>'
        } else if (await GM.getValue('showName')) {
            mutePhrase.innerHTML += ' because of tag: <a href="' + blurbInfo[1] + '">' + blurbInfo[2] + '</a>'
        }
        if (await GM.getValue('showReason') && blurbInfo[3]) {
            reason.innerText += ' (' + blurbInfo[3] + ')'
        }
        container.appendChild(mutePhrase)
        container.appendChild(reason)
    } else if (blurbInfo[0].split('work').length > 1 || blurbInfo[0].split('series').length > 1) {
        if (blurb) makeTogglebox(blurb,'m',container)
        if (await GM.getValue('showName')) {
            mutePhrase.innerText += ': ' + blurbInfo[1] + ' by ' + blurbInfo[2]
        }
        if (await GM.getValue('showReason') && blurbInfo[3]) {
            reason.innerText += ' (' + blurbInfo[3] + ')'
        }
        container.appendChild(mutePhrase)
        container.appendChild(reason)
    } else if (!blurb?.classList?.contains('bookmark')) {
        if (await GM.getValue('showName')) {
            mutePhrase.innerText += ' by ' + blurbInfo[2]
        }
        if (await GM.getValue('showReason') && blurbInfo[3]) {
            reason.innerText += ' (' + blurbInfo[3] + ')'
        }
        container.appendChild(mutePhrase)
        container.appendChild(reason)
        if (blurb) makeTogglebox(blurb,'X',container)
    }
}

function getBlurbs(arrayName,value) {
    let blurbuser = arrayName.split('list')[0],
        toHide = ''

    if (blurbuser === 'blurb') {
        toHide = '.' + value[0]
    } else if (blurbuser === 'user') {
        value[1].split(',').forEach(w => {
            toHide += ',' + w + '.' + value[0]
        })
        toHide = toHide.substring(1)
    } else if (blurbuser === 'tag') {
        toHide = '.blurb:has(a[href$="' + value[1] + '"])'
    }

    if (!toHide) return null

    return document.querySelectorAll(toHide)
}

async function addVal(arrayName,value) {
    // Add the entry to the saved array
    let temp = await GM.getValue(arrayName,[])
    for (let i = 0; i < temp.length; ++i) {
        if (temp[i][0] === value[0]) {
            return null;
        }
    }

    let reason = ''
    if (value[3] == 'undefined' && await GM.getValue('addReason',false)) {
        let muteObj = value[1]
        if (arrayName === 'userlist') {
            muteObj = value[2]
        }
        reason = prompt("Reason for muting " + muteObj + ":", '');

        if (reason === null) {
            return '';
        }
    }
    if (value[3] == undefined) value.push(reason);

    value.push(Date.now());
    temp.push(value);
    await GM.setValue(arrayName,temp)

    // Collapse/mute all works on the page that meet the criteria
    let mute = await GM.getValue('mute', false)
    let blurbs = []

    if (arrayName === 'taglist') {
        blurbs = document.querySelectorAll('.blurb:has(a[href$="' + value[1] + '"])')
    } else {
        blurbs = getBlurbs(arrayName,value)
    }

    for (let blurb of blurbs) {
        if (!mute &&
            (arrayName === 'blurblist' || blurb.classList.contains('work') || blurb.classList.contains('series')) ) {
            const collapseBlurb = document.querySelector('.' + blurb.id)
            if (!collapseBlurb) {
                await makeCollapseBlurb(blurb, value)
            } else {
                await addToCollapseBlurb(collapseBlurb, value)
            }
        }
        blurb.classList.add('AO3-MS-muted')
    }

    let refresh = refreshFilterList(arrayName)
    refresh()

    return true
}

async function delVal(arrayName,key) {
    // Remove the entry from the saved array
    let temp = await GM.getValue(arrayName,false)
    let value = [];

    let i = 0;
    while (i < temp.length) {
        if (temp[i][0] === key) {
            value = temp[i];
            temp.splice(i, 1);
        } else {
            ++i;
        }
    }
    await GM.setValue(arrayName,temp)

    // Uncollapse/unmute all works on the page that meet the criteria
    let mute = await GM.getValue('mute',false)

    let blurbs = getBlurbs(arrayName,value)

    if (!mute) {
        for (let c of document.querySelectorAll('.AO3-MS-collapsed-' + key)) {
            c.remove();
        }
    }

    for (let blurb of blurbs) {
        blurb.classList.remove('AO3-MS-muted')
    }

    if(arrayName === 'userlist') {
        let delMe = []

        for (let i = 0; i < commentMute.length; i++) {
            if (commentMute[i].includes(value[0])) {
                let delMe = commentMute.splice(i,1)
                delMe ? makeStyleSheet(makeStyleCode(addMuteRules(commentMute.join(','))),'AO3-MS-muteByStyle') : null
            }
        }
        setInitialMute('blurblist')
    }

    let refresh = refreshFilterList(arrayName)
    refresh()
}

async function getVal(arrayName, key, localArray) {
    let temp = []
    if (localArray) {
        temp = arrayName
    } else {
        temp = await GM.getValue(arrayName, []);
    }
    if (!temp) return null;

    for (let i = 0; i < temp.length; ++i) {
        if (temp[i][0] === key) {
            return temp[i]
        }
    }
    return null;
}

function getBlurbUserID(blurb) {
    for (let e of blurb.classList) {
        if (e.includes('user-')) {
            return e;
        }
    }
    if (document.querySelector('#main.dashboard') && document.querySelector('#subscription_subscribable_type')?.value === 'User') {
        return document.querySelector('#subscription_subscribable_id')?.value
    }
    return null;
}

async function toggleBlurb(blurb,toggleboxA) {

    let blurbInfo = [];
    if (blurb) {
        for (let e of blurb.classList) {
            if (e.includes('work-') || e.includes('series-')) {
                blurbInfo.push(e)
                break;
            }
        }
        // record title
        blurbInfo.push(blurb.querySelectorAll('.heading a')[1].textContent)

        // record creators
        if (!blurb.querySelectorAll('h4.heading [rel="author"]').length) {
            blurbInfo.push('(Anonymous creator)')
        } else {
            let authorNames = ''
            blurb.querySelectorAll('h4.heading [rel="author"]').forEach (a => {
                authorNames += ', ' + a.innerText
            })
            authorNames = authorNames.substring(2)
            blurbInfo.push(authorNames)
        }

    } else if (document.querySelectorAll('h2.title.heading').length) {
        blurbInfo.push(getIdFromWorkPage())
        blurbInfo.push(document.querySelector('h2.title.heading').textContent.substring(1).trim())
        if (!document.querySelectorAll('a[rel="author"]').length) {
            blurbInfo.push('(Anonymous creator)')
        } else {
            blurbInfo.push(document.querySelector('a[rel="author"]').innerText)
        }
    } else if (document.querySelectorAll('.series-show h2.heading').length) {
        blurbInfo.push(getIdFromSeriesPage())
        blurbInfo.push(document.querySelector('.series-show h2.heading').textContent.substring(1).trim())
        if (!document.querySelectorAll('a[rel="author"]').length) {
            blurbInfo.push('(Anonymous creator)')
        } else {
            blurbInfo.push(document.querySelector('a[rel="author"]').innerText)
        }
    }

    if(toggleboxA.textContent == 'M') {
        await addVal('blurblist',blurbInfo) && !blurb ? toggleboxA.textContent = 'm' : ''
        // The M->m change only actually matters on title pages; on blurblists M vs m are actually in two different blurbs
    } else {
        await delVal('blurblist',blurbInfo[0])
        if (blurb) {
            blurb.classList.remove('AO3-MS-muted')
            toggleboxA.closest('.blurb').remove()
        } else {
            toggleboxA.textContent = 'M'
        }
    }
}

async function toggleUser(blurb,togglebox,userID,username) {

    if (togglebox.parentNode.querySelectorAll('.AO3-MS-usermenu').length){
        togglebox.parentNode.querySelector('.AO3-MS-usermenu').remove()
        return null;
    }

    let usermenu = document.createElement('div');
    usermenu.id = 'AO3-MS-usermenu-' + userID;
    usermenu.classList.add('AO3-MS-usermenu')

    if(!blurb) {
        // Prevent the menu from being enormous on profile pages
        usermenu.style.fontSize = fontSizing.refreshFont + 'px'
        usermenu.style.display = 'block'
    }

    let items = [['.work','Works'],
                 ['.work,.series','Works & Series'],
                 ['.comment','Comments'],
                 ['','Mute all'],
                 ['none','Unmute']]

    const currEntry = await getVal('userlist',userID)
    let reason = ''

    async function createItem(item) {
        let container = document.createElement('span')
        container.classList.add('AO3-MS-usermenu-item')
        usermenu.appendChild(container)

        // check what the current option is, and highlight it
        if (currEntry) {
            if (currEntry[1] === item[0]) {
                container.classList.add('AO3-MS-usermenu-item-selected')
            }
        } else if (item[0] === 'none') {
            container.classList.add('AO3-MS-usermenu-item-selected')
        }

        let a = document.createElement('a')
        a.href = "javascript:void(0)";
        a.appendChild(document.createTextNode(item[1]));
        container.appendChild(a)

        a.onclick = async function() {
            if (currEntry) {
                if (item[0] != currEntry[1]) {
                    reason = currEntry[3]
                    await delVal('userlist',userID)
                }
            }
            if (item[0] != 'none') {
                let newEntry = [userID,item[0],username,reason];
                await addVal('userlist',newEntry);
            }

            // remove all menues on the page because things have probably changed
            let rl = document.querySelectorAll('.AO3-MS-usermenu')
            for (let ri of rl) {
                ri.remove()
            }
        }
        item.push(container)
    }

    for (let i = 0; i < items.length; i++) {
        await createItem(items[i])
    }

    togglebox.parentElement.appendChild(usermenu)

    // Fix if it's likely to get squished -- not great, but eh
    if (blurb && (await GM.getValue('forceMobile',false) || window.innerWidth < 900)) {
        usermenu.style.display = 'block'
    }
}

function makeTogglebox(blurb, tType, pin) {
    let togglebox = document.createElement('div');
    let toggleboxA = document.createElement('a');
    togglebox.classList.add('AO3-MS-toggle');
    togglebox.appendChild(toggleboxA);

    toggleboxA.href = "javascript:void(0)";
    toggleboxA.appendChild(document.createTextNode(tType));

    if (blurb) {
        if (tType == 'X') {
            toggleboxA.onclick = async function() {
                let username = blurb.querySelector('.heading a[rel="author"]').textContent
                await toggleUser(blurb,togglebox,getBlurbUserID(blurb),username)
            };
        } else if (tType == '(show)') {
            if (blurb.className.includes(' work_') || blurb.className.includes(' series_')) {
                toggleboxA.onclick = function () {
                    let originalBlurbId = blurb.className.split(' work_')
                    if (originalBlurbId.length > 1) {
                        originalBlurbId = 'work_' + originalBlurbId[1].split(' ')[0]
                    } else {
                        originalBlurbId = 'series_' + blurb.className.split(' series_')[1].split(' ')[0]
                    }
                    let originalBlurb = document.querySelector('#' + originalBlurbId)
                    originalBlurb.classList.remove('AO3-MS-muted')
                    blurb.remove()
                }
            }
        } else {
            toggleboxA.onclick = async function() {
                await toggleBlurb(blurb,toggleboxA)
            };
        }
    } else {
        if (tType == 'X') {
            toggleboxA.onclick = async function() {
                let username = document.querySelector('h2.heading').innerText.split(' ')[0]
                await toggleUser(false,togglebox,getIdFromProfilePage(),username)
            }
        } else {
            toggleboxA.onclick = async function() {
                await toggleBlurb(false,toggleboxA)
            };
        }
    }

    if (tType == 'X') {
        pin.append(togglebox)
    } else {
        pin.prepend(togglebox)
    }
}

function addMuteButtonToBlurbs() {
    const blurbs = document.querySelectorAll('.blurb.work,.blurb.series,.blurb.bookmark');

    for (let blurb of blurbs) {
        let blurbTitle = blurb.querySelector('.heading')

        makeTogglebox(blurb,'M',blurbTitle)

        if(blurb.querySelectorAll('h4.heading a').length == 3 && !blurb.classList.contains('bookmark')) {
            makeTogglebox(blurb,'X',blurbTitle)
        }
    }
}

async function setInitialMute(identifier) {
    let entries = await GM.getValue(identifier,[]);
    if (!entries) {
        return null;
    }

    let mute = await GM.getValue('mute',false),
        blurbs = ''

    for (const entry of entries) {
        if (identifier === 'userlist') {
            let typeToHide = ''
            if (entry[1].includes('work')) {
                entry[1].split(',').forEach(w => {
                    typeToHide += ',' + w + '.' + entry[0]
                })
            } else {
                typeToHide = ',.work.' + entry[0] + ',.series.' + entry[0]
            }
            typeToHide = typeToHide.substring(1)
            typeToHide ? blurbs = document.querySelectorAll(typeToHide) : null
        } else if (identifier === 'taglist') {
            blurbs = document.querySelectorAll('.blurb:has(a[href$="' + entry[1] + '"])')
        } else {
            blurbs = document.querySelectorAll('.' + entry[0])
        }

        for (let blurb of blurbs) {
            if (!mute) {
                const collapseBlurb = document.querySelector('.' + blurb.id)
                if (!collapseBlurb) {
                    await makeCollapseBlurb(blurb,entry)
                } else {
                    await addToCollapseBlurb(collapseBlurb, entry)
                }
            }
            blurb.classList.add('AO3-MS-muted')
        }
    }
}

function getIdFromWorkPage() {
    if (document.querySelectorAll('li.download a').length > 1) {
        if (isNaN(document.querySelectorAll('li.download a')[1].href.split('/')[4])) {
            return null;
        } else {
            return 'work-' + document.querySelectorAll('li.download a')[1].href.split('/')[4]
        }
    }
    return null;
}

function getIdFromSeriesPage() {
    let parts = window.location.pathname.split('/')
    for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i] === 'series' && !isNaN(parts[i+1])) {
            return 'series-' + parts[i+1]
        }
    }
    return null
}

function getIdFromProfilePage() {
    if(document.querySelectorAll('.meta').length) {
        let parts = document.querySelector('.meta').innerText.split('\n')
        for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i] === 'My user ID is:' && !isNaN(parts[i+1])) {
                return 'user-' + parts[i+1]
            }
        }
    } else if (document.querySelector('#main.dashboard') && document.querySelector('#subscription_subscribable_type')?.value === 'User') { // dashboard, logged in
        return 'user-' + document.querySelector('#subscription_subscribable_id')?.value
    }
    return null
}

async function toggleTag (tagInfo, toggleboxA) {
    let entries = await GM.getValue('taglist',[]);
    let blurbInfo = [];

    if (toggleboxA.innerText === "M") {
        toggleboxA.innerText = "m"
        await addVal('taglist', tagInfo)
    } else {
        toggleboxA.innerText = 'M'
        await delVal('taglist', tagInfo[0])
    }
}

function makeTagTogglebox(tType, pin, tagInfo) {
    let togglebox = document.createElement('div');
    let toggleboxA = document.createElement('a');
    togglebox.classList.add('AO3-MS-toggle');
    togglebox.appendChild(toggleboxA);

    toggleboxA.href = "javascript:void(0)";
    toggleboxA.appendChild(document.createTextNode(tType));

    toggleboxA.onclick = async function() {
        await toggleTag(tagInfo, toggleboxA)
    };

    pin.append(togglebox)
}

function makeTagKey(tagLink) {
    return tagLink.split('/')[2].replaceAll(/[^a-zA-Z0-9 :]/g, '_');
}

async function setTagMute() {
    let parts = window.location.pathname.split('/')
    let h2 = document.querySelector('h2')

    let tagInfo = []
    tagInfo.push('')

    if (parts[1] === 'tags' && parts[2]) {

        if (parts[3]) {
            // If you are on the tag's works or bookmarks listing
            if (await GM.getValue('showTagToggles', false)) return; // abort early, this will be taken care of in addTogglesToWorkTags()
            if (['works', 'bookmarks'].includes(parts[3])) {
                let a = h2?.querySelector('a')
                tagInfo.push(a.href.split('.org')[1] + '/works') // tagLink
                tagInfo.push(a.innerText) // tagName
            }
        } else {
            // If you're directly on the tag page
            tagInfo.push(window.location.pathname + '/works') // tagLink
            tagInfo.push(h2?.innerText) // tagName
        }
        tagInfo[0] = makeTagKey(tagInfo[1])
        let tType = 'M'
        if (await getVal('taglist', tagInfo[0])) tType = 'm'

        makeTagTogglebox(tType, h2, tagInfo)
    }
}

async function addTogglesToWorkTags() {
    const tags = document.querySelectorAll('a.tag')
    const taglist = await GM.getValue('taglist', [])

    for (const tag of tags) {
        let tagInfo = []
        const tagLink = tag.href.split('.org')[1]
        const tagKey = makeTagKey(tagLink)

        tagInfo.push(tagKey)
        tagInfo.push(tagLink)
        tagInfo.push(tag.innerText)

        const tType = await getVal(taglist, tagKey, true) ? 'm' : 'M'

        const container = tag.parentNode
        if (container.tagName !== 'LI') {
            const newContainer = document.createElement('span')
            tag.after(newContainer)
            newContainer.appendChild(tag)
        }
        makeTagTogglebox(tType, tag.parentNode, tagInfo)
    }
}

function addSeriesToWorkClassLists() {
    const works = document.querySelectorAll('li.work:has(.series a)')
    for (const work of works) {
        const links = work.querySelector('ul.series').querySelectorAll('a')
        for (const a of links) {
            const seriesClass = 'series-' + a.href.split('/')[4]
            work.classList.add(seriesClass)
        }
    }
}

async function setTitleMute() {
    let blurbId = ''

    async function determineMm(blurbId) {
        if (await getVal('blurblist',blurbId)) {
            return 'm'
        }
        return 'M'
    }

    if (document.querySelectorAll('h2.title.heading').length) { // work or chapter page
        blurbId = getIdFromWorkPage()
        blurbId ? makeTogglebox(false,await determineMm(blurbId),document.querySelector('h2.title.heading')) : null
        if (!await GM.getValue('showTagToggles', true)) addTogglesToWorkTags() // only fire here if the setting is off -- otherwise it's already run
    } else if (document.querySelectorAll('.series-show h2.heading').length) { // series page
        blurbId = getIdFromSeriesPage()
        blurbId ? makeTogglebox(false,await determineMm(blurbId),document.querySelector('.series-show h2.heading')) : null
    } else if (document.querySelector('.profile-show h2.heading') || document.querySelector('.dashboard h2.heading')) { // profile or dashboard
        blurbId = getIdFromProfilePage()
        blurbId ? makeTogglebox(false,'X',document.querySelector('h2.heading')) : null
    }
}

function addToNavBar() {
    let searchNode = document.querySelector('li.search'),
        li = document.createElement('li'),
        a = document.createElement('a')

    a.href = 'javascript:void(0)'
    a.appendChild(document.createTextNode('Muting'))
    a.onclick = function() {
        toggleSettings();
    };

    li.classList.add('dropdown')
    li.appendChild(a)

    searchNode.parentNode.insertBefore(li,searchNode)
}

(async function() {
    'use strict';

    const filterSettings = await getFilterSettings();
    const darkmode = await GM.getValue('darkmode', false);
    const useMobile = (window.innerWidth < 900 ? true : false);

    fontSizing = standardSize

    if (useMobile || await GM.getValue('forceMobile',false)) {fontSizing = mobileSize}

    fontSizing.menuWidth > (window.innerWidth - 10) ? fontSizing.menuWidth = window.innerWidth -10 : ''
    fontSizing.menuHeight > (window.innerHeight -10) ? fontSizing.menuHeight = window.innerHeight -10 : ''

    addToNavBar();
    makeSettings();

    var userlist = await GM.getValue('userlist',[])

    for (const u of userlist) {
        if (u[1] === '.comment') {
            commentMute.push('.comment.' + u[0])
        } else if (!u[1]) {
            commentMute.push('.' + u[0] + ':not(.work,.series)')
        }
    }
    var muteByStyle = commentMute.join(',')

    makeStyleSheet(makeStyleCode(getMenuRules(darkmode)),'AO3-MS-mainStyle');
    makeStyleSheet(filterSettings['custom-css'],'AO3-MS-custom-css');
    makeStyleSheet(makeStyleCode(addMuteRules(commentMute.join(','))),'AO3-MS-muteByStyle')

    addSeriesToWorkClassLists();

    await setInitialMute('userlist');
    await setInitialMute('blurblist');
    await setInitialMute('taglist');
    await setTitleMute();
    await setTagMute();
    if (await GM.getValue('showTagToggles', false)) addTogglesToWorkTags()

    addMuteButtonToBlurbs();
})();