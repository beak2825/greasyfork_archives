// ==UserScript==
// @name         GGn Improved Report Page
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Reformat and make filling reports easier.
// @author       You
// @match        https://gazellegames.net/reportsv2.php*
// @match        https://gazellegames.net/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522161/GGn%20Improved%20Report%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/522161/GGn%20Improved%20Report%20Page.meta.js
// ==/UserScript==

const extraLogOptions = [
    'New version',
    'New P2P repack',
    'New version (3 latest builds)',
    'Obsolete update',
    'Trumped by scene',
    'New P2P release',
    'Trumped by milestone release',
    'Dupe',
    'Trumped by unaltered DRM free release',
    'Trumped by unaltered scene release',
    'Trumped by release w/bundled DLC',
    'Trumped by properly archived release',
    'Trumped by properly cracked release',
    'Trumped by upload with known version',
    'Trumped by release without advertising',
    'Trumped by upload with DRM removed',
    'Dead. Never seeded.',
    'Cheat codes are not allowed',
    'Bundled',
];

const commentOptions = [
    'Marked trumpable',
    'Unmarked trumpable',
    'Fixed NFO',
    'Initial release co-exists',
    'Last 3 EA builds co-exist',
    'Latest milestone co-exists',
    'Different editions co-exist',
    'Updates for current and previous milestone remain',
    'Updated description',
    'Updated title',
];

const isMakeReportPage = location.href.indexOf('action=report') != -1;
const isGroupPage = location.href.startsWith('https://gazellegames.net/torrents.php');

function isOstGroup() {
    return document.querySelector('#group_nofo_bigdiv .head')?.textContent?.startsWith('OST Information');
}

function addOptions(parent, options) {
    for (const option of options) {
        const opt = document.createElement('option');
        opt.setAttribute('value', option);
        opt.appendChild(document.createTextNode(option));
        parent.appendChild(opt);
    }
}

function addDatalist(id, options) {
    const list = document.createElement('datalist');
    list.setAttribute('id', id);
    addOptions(list, options);
    document.body.appendChild(list);
}

function addDatalists() {
    addDatalist('extralog', extraLogOptions);
    addDatalist('reportcomment', commentOptions);
}

function setInputList(id, selector) {
    const inputs = document.querySelectorAll(selector);
    for (const input of inputs) {
        input.setAttribute('list', id);
    }
}

function setInputLists() {
    setInputList('extralog', 'input[name=log_message]');
    setInputList('reportcomment', 'input[name=comment]');
}

function makeReportCreatorDropdown() {
    let lastTextArea;
    const onReportTypeChange = () => {
        const reportTextArea = document.querySelector('textarea[name=extra]');
        if (!reportTextArea || lastTextArea === reportTextArea) {
            return;
        }
        const selector = document.createElement('select');
        const emptyOpt = document.createElement('option');
        emptyOpt.setAttribute('value', 'Report text');
        emptyOpt.appendChild(document.createTextNode('Report text'));
        selector.appendChild(emptyOpt);
        addOptions(selector, extraLogOptions);
        selector.style.display = 'block';
        selector.style.width = '300px';
        selector.style.marginBottom = '5px';
        selector.multiple = false;
        reportTextArea.parentElement.insertBefore(selector, reportTextArea);
        selector.onchange = () => {
            reportTextArea.value = selector.value;
        };
    };
    const config = { childList: true };
    const observer = new MutationObserver(onReportTypeChange);
    observer.observe(document.querySelector('#dynamic_form'), config);
    onReportTypeChange();
}

function addReportRow(beforeRow, labelText, dataHtml, important = false) {
    const row = document.createElement('tr');
    const label = document.createElement('td');
    label.appendChild(document.createTextNode(labelText));
    label.classList.add('label');
    if (important) {
        label.classList.add('badish');
    }
    label.style.paddingTop = label.style.paddingBottom = '1px';
    row.appendChild(label);
    const data = document.createElement('td');
    data.colspan = '3';
    data.innerHTML = dataHtml;
    data.style.paddingTop = data.style.paddingBottom = '1px';
    row.appendChild(data);
    beforeRow.parentElement.insertBefore(row, beforeRow);
}

function showHideReport(report, show) {
    const multiResolveCheckbox = report.querySelector('input[name=multi]');
    if (show && report.style.display === 'none') {
        report.style.display = '';
        if (report.multi !== undefined) {
            multiResolveCheckbox.checked = report.multi;
        }
    } else if (!show && report.style.display === '') {
        report.style.display = 'none';
        report.multi = multiResolveCheckbox.checked;
        multiResolveCheckbox.checked = false;
    }
}

function showHideReports(reportsByType, opts) {
    for (const trumpReport of reportsByType.trump) {
        showHideReport(trumpReport, opts.trump);
    }
    for (const dupeReport of reportsByType.dupe) {
        showHideReport(dupeReport, opts.dupe);
    }
    for (const otherReport of reportsByType.other) {
        showHideReport(otherReport, opts.other);
    }
    for (const freeReport of reportsByType.free) {
        showHideReport(freeReport, opts.free);
    }
}

function makeOnChangeHandler(radio, reportsByType, opts) {
    opts = {
        trump: false,
        dupe: false,
        other: false,
        free: false,
        ...opts,
    };
    radio.addEventListener('change', () => {
        if (!radio.checked) return;
        showHideReports(reportsByType, opts);
    });
}


const OFF = 'rgb(43, 78, 102)';
const ON = 'rgb(27, 49, 64)';
const OST = {
    ARTIST: {
        name: 'artist',
        msg: 'artist in filenames',
    },
    CAPITAL: {
        name: 'capitalized',
        msg: 'properly capitalized track names',
    },
    DIRECTORY: {
        name: 'directory',
        msg: 'correct directory name',
    },
    LOGCUE: {
        name: 'log+cue',
        msg: 'log+cue',
    },
    COVER: {
        name: 'cover',
        msg: 'cover art as separate file',
    },
};


function makeOstButton(name, state, stateChange) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.style.marginLeft = button.style.marginRight = '8px';
    button.addEventListener('click', () => {
        state[name] = !state[name];
        button.style.backgroundColor = state[name] ? ON : OFF;
        stateChange();
    });
    return button;
}

function createOstButtonsForRow(row, textBox, trumpVerb) {
    const state = {};
    const stateChange = () => {
        const msg = [];
        for (const trumpType of Object.values(OST)) {
            if (state[trumpType.name]) {
                msg.push(trumpType.msg);
            }
        }
        textBox.value = msg.length === 0 ? '' : `${trumpVerb} by upload with ${msg.join(' + ')}`;
        textBox.title = textBox.value;
    };
    for (const trumpType of Object.values(OST)) {
        state[trumpType.name] = false;
        row.appendChild(makeOstButton(trumpType.name, state, stateChange));
    }
}

function addOstButtonsGroupPage() {
    const trumpReasonInput = document.querySelector('input[name="trump_reason"]');
    const buttonsRow = document.createElement('div');
    trumpReasonInput.parentElement.appendChild(buttonsRow);
    createOstButtonsForRow(buttonsRow, trumpReasonInput, 'Trumpable');
    trumpReasonInput.addEventListener('keyup', () => {
        trumpReasonInput.title = trumpReasonInput.value;
    });
    trumpReasonInput.style.width = '500px';
}

function addOstButtons(report) {
    const extraLog = report.querySelector('input[name="log_message"]');
    extraLog.setAttribute('size', '60');
    extraLog.addEventListener('keyup', () => {
        extraLog.title = extraLog.value;
    });
    const buttonsRow = document.createElement('tr');
    const label = document.createElement('td');
    label.setAttribute('class', 'label');
    label.style.paddingTop = label.style.paddingBottom = '1px';
    buttonsRow.appendChild(label);
    const data = document.createElement('td');
    data.colspan = '3';
    createOstButtonsForRow(data, extraLog, 'Trumped')
    data.style.paddingTop = data.style.paddingBottom = '1px';
    buttonsRow.appendChild(data);
    const logRow = extraLog.parentElement.parentElement;
    logRow.parentElement.insertBefore(buttonsRow, logRow);
}

function reformatReports() {
    if (isMakeReportPage) {
        return;
    }
    const reports = document.querySelectorAll('#all_reports > div');
    const reportsByType = {
        trump: [],
        dupe: [],
        other: [],
        free: [],
    };
    // Loop over reports, reformat, and add to type groups.
    for (const report of reports) {
        const label = report.querySelector('tbody tr:first-child td:first-child');
        label.style.paddingTop = label.style.paddingBottom = 0;
        const reportDetailData = label.nextElementSibling;
        if (!reportDetailData) continue; // Probably no available reports.
        const reportDetailHtml = reportDetailData.innerHTML;
        const reportedTorrent = reportDetailHtml.slice(0, reportDetailHtml.indexOf('[DL]</a>') + 8);
        const uploader = /uploaded by (.*?<\/span>)/.exec(reportDetailHtml)[1];
        const reporter = /reported by (.*?<\/span>)/.exec(reportDetailHtml)[1];
        const reportType = /for the reason: (.*?<\/strong>)/.exec(reportDetailHtml)[1];
        const otherGroupReports = /<a href="(reportsv2[.]php\?view=group[^"]+)">There (?:is|are) ([0-9]+)/.exec(reportDetailHtml);
        const otherUserReports = /<a href="(reportsv2[.]php\?view=uploader[^"]+)">There (?:is|are) ([0-9]+)/.exec(reportDetailHtml);
        const otherTorrentReports = /<a href="(reportsv2[.]php\?view=torrent[^"]+)">\s*([0-9]+)/.exec(reportDetailHtml);

        const internalLinks = /<a href="(torrents[.]php\?torrentid=[0-9]+)">\s*There (?:is|are) ([0-9]+) internal/.exec(reportDetailHtml);
        const filledRequestsRegex = /<div>\s*<a href="(user[.]php\?id=[0-9]+)">([^<]+)<\/a>\s*used this torrent to fill <a href="(requests[.]php\?action=view[^"]+)">\s*this\s+request<\/a>\s*(<span class="time"[^/]+\/span>)/g;
        let filledRequest;
        const filledRequests = [];
        while (filledRequest = filledRequestsRegex.exec(reportDetailHtml)) {
            const requestId = /id=([0-9]+)/.exec(filledRequest[3])[1];
            filledRequests.push(`<a href="${filledRequest[3]}">${requestId}</a> by <a href="${filledRequest[1]}">${filledRequest[2]}</a>`);
        }
        if (reportType === '<strong>Trump</strong>') {
            reportsByType.trump.push(report);
        } else if (reportType === '<strong>Dupe</strong>') {
            reportsByType.dupe.push(report);
        } else if (reportType === '<strong>Freely Available</strong>') {
            reportsByType.free.push(report);
        } else {
            reportsByType.other.push(report);
        }
        reportDetailData.innerHTML = reportedTorrent;
        const reportRow = label.parentElement.nextElementSibling;
        let extraUploaderReports = '';
        if (otherUserReports) {
            extraUploaderReports = ` (<a href="${otherUserReports[1]}">${(Number.parseInt(otherUserReports[2]) + 1)} report(s) for this user</a>)`;
        }
        addReportRow(reportRow, 'Report type:', `<span style="color: #bf6a6a">${reportType}</span>`);
        addReportRow(reportRow, 'Uploaded by:', uploader + extraUploaderReports);
        addReportRow(reportRow, 'Reported by:', reporter);
        if (otherGroupReports) {
            addReportRow(reportRow, 'Same Group Reports:', `<a href="${otherGroupReports[1]}">${Number.parseInt(otherGroupReports[2]) + 1} reports in group</a>`);
        }
        if (otherTorrentReports) {
            addReportRow(reportRow, 'Same Torrent Reports:', `<a style="color: #bf6a6a; font-weight: bold" href="${otherTorrentReports[1]}">${Number.parseInt(otherTorrentReports[2]) + 1} reports for this torrent</a>`);
        }
        if (internalLinks) {
            addReportRow(reportRow, 'Internal Links:', `<a href="${internalLinks[1]}">${internalLinks[2]} internal links to this torrent</a>`);
        }
        if (filledRequests.length > 0) {
            addReportRow(reportRow, 'Requests Filled From Torrent:', filledRequests.join(', '));
        }
        const isOst = report.querySelector('input[name="categoryid"]').value == 4;
        if (isOst) {
            addOstButtons(report);
        }
    }
    const filtersForm = document.querySelector('.filters-form');
    const reportTypeFilterDiv = document.createElement('div');
    const allRadio = makeRadio(reportTypeFilterDiv, 'All', true);
    makeOnChangeHandler(allRadio, reportsByType, {
        trump: true,
        dupe: true,
        other: true,
        free: true,
    });
    const trumpRadio = makeRadio(reportTypeFilterDiv, 'Trump');
    makeOnChangeHandler(trumpRadio, reportsByType, {trump: true});
    const dupeRadio = makeRadio(reportTypeFilterDiv, 'Dupe');
    makeOnChangeHandler(dupeRadio, reportsByType, {dupe: true});
    const freeRadio = makeRadio(reportTypeFilterDiv, 'Free');
    makeOnChangeHandler(freeRadio, reportsByType, {free: true});
    const otherRadio = makeRadio(reportTypeFilterDiv, 'Other');
    makeOnChangeHandler(otherRadio, reportsByType, {other: true});
    filtersForm.parentElement.insertBefore(reportTypeFilterDiv, filtersForm.nextElementSibling);
}

function makeRadio(div, name, checked = false) {
    const lowerName = name.toLowerCase();
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'reportType';
    radio.value = lowerName;
    radio.id = lowerName;
    radio.checked = checked;
    div.appendChild(radio);
    const label = document.createElement('label');
    label.setAttribute('for', lowerName);
    label.style.marginRight = '20px';
    label.appendChild(document.createTextNode(name));
    div.appendChild(label);
    return radio;
}

function run(runTiming) {
    console.log(`GGn Improved Report Page: running ${runTiming}`);
    if (isGroupPage) {
        if (isOstGroup()) {
            addOstButtonsGroupPage();
        }
        return;
    }
    addDatalists();
    setInputLists();
    if (isMakeReportPage) {
        makeReportCreatorDropdown();
    }
    reformatReports();
}

if (document.readyState === 'complete') {
    run('immediately');
} else {
    window.addEventListener('load', () => {
        run('after load');
    });
}