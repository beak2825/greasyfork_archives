// ==UserScript==
// @name         BTAS-Beta
// @namespace    https://github.com/Dyebasedink/BTAS/tree/Beta
// @homepageURL  https://github.com/Dyebasedink/BTAS/tree/Beta
// @version      1.3.3
// @description  BTAS Beta Release Channel
// @author       Barry Y Yang; Jack SA Chen; Xingyu X Zhou
// @license      Apache-2.0
// @match        https://caas.pwchk.com/*
// @icon         https://www.google.com/s2/favicons?domain=pwchk.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/469395/BTAS-Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/469395/BTAS-Beta.meta.js
// ==/UserScript==
var $ = window.jQuery;

/**
 * This function creates and displays a flag using AJS.flag function
 * @param {string} type - The type of flag, can be one of the following: "success", "info", "warning", "error"
 * @param {string} title - The title of the flag
 * @param {string} body - The body of the flag
 * @param {string} close - The close of flag, can be one of the following: "auto", "manual", "never"
 */
function showFlag(type, title, body, close) {
    AJS.flag({
        type: type,
        title: title,
        body: body,
        close: close
    });
}

/**
 * This function registers a Tampermonkey search menu command
 * @param {Array} searchEngines - Search engines array containing the Jira, VT, AbuseIPDB
 */
function registerSearchMenu() {
    console.log('#### Code registerSearchMenu run ####');
    const LogSourceDomain = $('#customfield_10223-val').text().trim() || '*';
    const searchEngines = [
        {
            name: 'Jira',
            url:
                'https://caas.pwchk.com/issues/?jql=text%20~%20%22%s%22%20AND%20' +
                '%22Log%20Source%20Domain%22%20~%20%22%D%22%20' +
                'ORDER%20BY%20created%20DESC'
        },
        { name: 'Reputation', url: 'https://172.18.2.23/instance/execute/reputation/ip?ip=%s' },
        { name: 'VT', url: 'https://www.virustotal.com/gui/search/%s' },
        { name: 'AbuseIPDB', url: 'https://www.abuseipdb.com/check/%s' }
    ];
    searchEngines.forEach((engine) => {
        GM_registerMenuCommand(engine.name, () => {
            const selectedText = window.getSelection().toString();
            const searchURL = engine.url.replace('%s', selectedText).replace('%D', LogSourceDomain);
            if (selectedText.length === 0) {
                showFlag('error', 'No text selected', 'Please select some text and try again', 'auto');
            } else {
                window.open(searchURL, '_blank');
            }
        });
    });
}
/**
 * This function registers two Tampermonkey exception menu command
 * Add Exception: adds the currently selected text to an exception list stored in local storage
 * Clear Exception: clears the exception list from local storage
 */
let exceptionKey = localStorage.getItem('exceptionKey')?.split(',') || [];
let notifyKey = [...exceptionKey];
function registerExceptionMenu() {
    console.log('#### Code registerExceptionMenu run ####');
    GM_registerMenuCommand('Add Exception', () => {
        const selection = window.getSelection().toString().trim();
        if (!selection) {
            showFlag('error', 'No Issue Key selected', '', 'auto');
            return;
        }
        exceptionKey.push(selection);
        localStorage.setItem('exceptionKey', exceptionKey.toString());
        showFlag('success', '', `Added <strong>${selection}</strong> successfully`, 'auto');
    });

    GM_registerMenuCommand('Clear Exception', () => {
        localStorage.setItem('exceptionKey', '');
        exceptionKey = notifyKey = [];
        showFlag('success', 'Cleared All Issue Key', '', 'auto');
    });
}

/**
 * This function creates audio and checkbox controls and adds them to the Jira share button's parent node
 * @returns {Object} Object containing references to the audio control and audio checkbox, keep checkbox, prompt checkbox
 */
// ## In the future, the alert sound will be migrated to another server, and more fun music will be added.
function createNotifyControls() {
    console.log('#### Code createNotifyControls run ####');
    const operationsBar = $('div.saved-search-operations.operations');
    const audioControl = $('<span></span>');

    function createAudioControl(parentNode) {
        const currentDate = new Date();
        const audioURL =
            currentDate.getHours() >= 9 && currentDate.getHours() < 21
                ? 'https://aspirepig-1251964320.cos.ap-shanghai.myqcloud.com/12221.wav'
                : 'https://aspirepig-1251964320.cos.ap-shanghai.myqcloud.com/alerts.wav';
        audioControl.html(`<audio src="${audioURL}" type="audio/mpeg" controls></audio>`);
        parentNode.prepend(audioControl);
    }

    function createCheckbox(parentNode, localStorageKey) {
        const checkbox = $('<span></span>');
        const value = localStorage.getItem(localStorageKey);
        checkbox.html(
            `<input type="checkbox" name="${localStorageKey}" ${value == 'true' ? 'checked' : ''}>${localStorageKey}`
        );
        checkbox.find('input').on('click', () => {
            localStorage.setItem(localStorageKey, checkbox.find('input').prop('checked'));
        });
        parentNode.prepend(checkbox);
        return checkbox;
    }
    createAudioControl(operationsBar);
    const audioCheckbox = createCheckbox(operationsBar, 'audioNotify');
    const keepCheckbox = createCheckbox(operationsBar, 'keepAudio');
    const promptCheckbox = createCheckbox(operationsBar, 'prompt');

    return { audioControl, audioCheckbox, keepCheckbox, promptCheckbox };
}
/**
 * Check for updates in the issues list and play a sound if new issues are found
 * @param {Object} NotifyControls - Object containing the audio control, audio checkbox, keep checkbox, prompt checkbox
 */
function checkupdate(NotifyControls) {
    console.log('#### Code checkupdate run ####');
    const { audioControl, audioCheckbox, keepCheckbox, promptCheckbox } = NotifyControls;
    const table = $('tbody');
    if (!table.length) return;

    let Tickets = '';
    table.find('tr').each(function () {
        const summary = $(this).find('.summary p').text().trim();
        const issuekey = $(this).find('.issuekey a.issue-link').attr('data-issue-key');
        if (!notifyKey.includes(issuekey)) {
            notifyKey.push(issuekey);
            Tickets += `${summary}==${issuekey}\n`;
        }
    });
    if (Tickets || keepCheckbox.find('input').prop('checked')) {
        if (audioCheckbox.find('input').prop('checked')) {
            audioControl.find('audio').get(0).currentTime = 0;
            audioControl.find('audio').get(0).play();
        }
    }

    $('.aui-banner').remove();
    let overdueTickets = '';
    table.find('tr').each(function () {
        const issuekey = $(this).find('.issuekey a.issue-link').attr('data-issue-key');
        const datetime = new Date($(this).find('.updated time').attr('datetime'));
        const currentTime = new Date();
        const diffMs = currentTime - datetime;
        const diffMinutes = Math.floor(diffMs / 60000);
        if (diffMinutes > 30) {
            overdueTickets += `${issuekey}, `;
        }
    });
    if (overdueTickets && promptCheckbox.find('input').prop('checked')) {
        AJS.banner({
            body: `ticket: <strong>${overdueTickets}</strong><br>30 minutes have passed since the customer responded, please handle it as soon as possible`
        });
    }
    // console.info(`#### checkupdate_end: ${notifyKey} ####`);
}

/**
 * This function checks for specific keywords within a string
 * Advises the user to double-check and contact L2 or TL if suspicious.
 * @param {Array} keywords - An array of strings containing the high risk keywords to check for
 */
function checkKeywords() {
    console.log('#### Code checkKeywords run ####');
    const keywords = ['keyword1', 'mimikatz', 'keyword3'];
    const strToCheck = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().toLowerCase();
    const matchedKeyword = keywords.find((keyword) => strToCheck.includes(keyword.toLowerCase()));
    if (matchedKeyword) {
        AJS.banner({
            body: `High Risk Keyword: <strong>${matchedKeyword}</strong><br>Please double-check it, and if it seems suspicious, contact L2 or TL.`
        });
    }
}

/**
 * This function initializes the edit notification functionality.
 * It adds click event listeners to the "Edit" button based on certain conditions,
 * and generates a specific HTML element for the edit notification.
 */
function editNotify() {
    console.log('#### Code editNotify run ####');
    const orgNotifydict = {
        'esf': 'Please escalated according to the Label tags and document.<br>\
        https://172.18.2.13/books/customers/page/esf-cortex-endpoint-group-jira-organization-mapping',
        'swireproperties':
            'Please escalated according to the group, hostname value.<br>\
        Check if additional Participants need to be added through HK_MSS_SOP.doc',
        'lsh-hk':
            'Please escalated according to the Label tags and document.<br>\
        http://172.18.2.13/books/customers/page/lsh-hk-lei-shing-hong-hk'
    };
    const LogSourceDomain = $('#customfield_10223-val').text().trim();
    const orgNotify = orgNotifydict[LogSourceDomain];
    const Labels = $('.labels-wrap .labels li a span').text();
    const LogSource = $('#customfield_10204-val').text().trim();
    function addEditonClick() {
        // # Add a click event listener to the "Edit" button
        if (
            LogSourceDomain.includes('esf') ||
            LogSourceDomain.includes('swireproperties') ||
            LogSourceDomain.includes('lsh-hk')
        ) {
            $('#edit-issue').on('click', () => {
                showFlag('warning', `${LogSourceDomain} ticket`, `${orgNotify}`, 'manual');
            });
        }
        // # Add a click event listener to the "Edit" button for LogCollector tickets
        if (LogSource.includes('LogCollector')) {
            $('#edit-issue').on('click', () => {
                showFlag(
                    'warning',
                    'LogCollector ticket',
                    'When processing a ticket containing "LogCollector" in the Log Source<br>\
                Please do NOT escalate to the customer and contact Jones/Franky first to confirm if it is due to other reasons',
                    'manual'
                );
            });
        }
        // # Add a click event listener to the "Edit" button for kerrypropshk tickets
        if (LogSourceDomain.includes('kerrypropshk')) {
            if (Labels === 'UnassignedGroup') {
                $('#edit-issue').on('click', () => {
                    showFlag(
                        'warning',
                        'kerrypropshk UnassignedGroup ticket',
                        'Please note that if the host starts with cn/sz/bj/sh, Do NOT escalate it on Jira.<br>\
                    Instead, share the issue key and MDE link with Desen and Barry.<br>\
                    Then, choose "Won\'t Do" as the Resolution and Resolve this issue.<br>\
                    In the Comments, mention that the host belongs to PRC and has been handed over to the SH team for handling.',
                        'manual'
                    );
                });
            } else {
                $('#edit-issue').on('click', () => {
                    showFlag(
                        'warning',
                        'kerrypropshk ticket',
                        'Please copy the description to the comments for the customer',
                        'manual'
                    );
                });
            }
        }
    }
    addEditonClick();

    function generateEditnotify() {
        const toolbar = $('.aui-toolbar2-primary');
        const element = $('<div id="generateEditnotify"></div>');
        toolbar.append(element);
    }
    generateEditnotify();
}

/**
 * Creates a new button and adds it to the DOM.
 * @param {string} id - The ID attribute for the new button element.
 * @param {string} text - The text content to display on the new button.
 * @param {string} onClick - The function to call when the button is clicked.
 */
function addButton(id, text, onClick) {
    console.log(`#### Add Button: ${text}  ####`);
    const toolbar = $('.aui-toolbar2-primary');
    toolbar.append(`
        <div class="aui-buttons pluggable-ops">
        <a id="${id}" onclick="${onClick}" class="aui-button toolbar-trigger">
            <span class="trigger-label">${text}</span>
        </a>
        </div>
    `);
    $('#' + id).click(onClick);
}
/**
 * Creates three buttons on a JIRA issue page to handle Cortex XDR alerts
 * The buttons allow users to generate a description of the alerts, open the alert card page and timeline page
 */
function cortexAlertHandler() {
    console.log('#### Code cortexAlertHandler run ####');
    /**
     * Extracts the log information and organization name from the current JIRA issue page
     * @param {Object} orgDict - A dictionary that maps organization name to navigator name
     * @returns {Object} An object that contains the organization's name, organization's navigator URL, raw log information
     */
    const orgDict = {
        'bossini': 'https://bossini.xdr.sg.paloaltonetworks.com/',
        'hkuniversity': 'https://cpos.xdr.sg.paloaltonetworks.com/',
        'citysuper': 'https://citysuper.xdr.sg.paloaltonetworks.com/',
        'esf-dc': 'https://esf.xdr.us.paloaltonetworks.com/',
        'glshk': 'https://glshk.xdr.us.paloaltonetworks.com/',
        'kerrylogistics': 'https://kerrylogistics.xdr.us.paloaltonetworks.com/',
        'k11-hk': 'https://k11.xdr.sg.paloaltonetworks.com/',
        'newworld': 'https://nwcs.xdr.sg.paloaltonetworks.com/',
        'nws': 'https://nws.xdr.sg.paloaltonetworks.com/',
        'toppanmerrill': 'https://tpm-apac.xdr.us.paloaltonetworks.com/',
        'welab': 'https://welabbank.xdr.sg.paloaltonetworks.com/'
    };
    function extractLog(orgDict) {
        const LogSourceDomain = $('#customfield_10223-val').text().trim();
        const orgNavigator = orgDict[LogSourceDomain];
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        return { LogSourceDomain, orgNavigator, rawLog };
    }
    const { LogSourceDomain, orgNavigator, rawLog } = extractLog(orgDict);

    /**
     * Parse the relevant information from the raw log data
     * @param {Array} rawLog - An array of JSON strings representing the raw log data
     * @returns {Array} An array of objects containing the alert relevant information
     */
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { cortex_xdr } = JSON.parse(log);
                const { source, alert_id, name, description } = cortex_xdr;
                const isPANNGFW = source === 'PAN NGFW';
                const alert = { source, alert_id, name, description };
                if (isPANNGFW) {
                    const { action_local_ip, action_local_port, action_remote_ip, action_remote_port, action_pretty } =
                        cortex_xdr;
                    acc.push({
                        ...alert,
                        action_local_ip,
                        action_local_port,
                        action_remote_ip,
                        action_remote_port,
                        action_pretty
                    });
                } else {
                    const {
                        action_file_name,
                        action_file_path,
                        action_file_sha256,
                        actor_process_image_name,
                        actor_process_image_path,
                        actor_process_image_sha256,
                        host_name,
                        host_ip,
                        user_name,
                        actor_process_command_line
                    } = cortex_xdr;
                    const filename = action_file_name || actor_process_image_name;
                    const filepath = action_file_path || actor_process_image_path;
                    const sha256 = action_file_sha256 || actor_process_image_sha256;
                    acc.push({
                        ...alert,
                        host_name,
                        host_ip,
                        user_name,
                        actor_process_command_line,
                        filename,
                        filepath,
                        sha256
                    });
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);

    /**
     * Define three functions for handling alert information:
     * generateDescription creates a description for each alert, and displays the combined description in an alert box
     * openCard opens a new window to display the alert card page for each alert
     * openTimeline opens a new window to display the timeline page for each alert
     */
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const {
                source,
                name,
                action_local_ip,
                action_local_port,
                action_remote_ip,
                action_remote_port,
                action_pretty,
                host_name,
                host_ip,
                user_name,
                actor_process_command_line,
                filename,
                filepath,
                sha256,
                description
            } = info;
            if (source === 'PAN NGFW') {
                const desc = `Observed ${name}\nSrcip: ${action_local_ip}   Srcport: ${action_local_port}\nDstip: ${action_remote_ip}   Dstport: ${action_remote_port}\nAction: ${action_pretty}\n\nPlease help to verify if this activity is legitimate.\n`;
                alertDescriptions.push(desc);
            } else {
                const desc = `Observed ${
                    description || name
                }\nHost: ${host_name}   IP: ${host_ip}\nusername: ${user_name}\ncmd: ${actor_process_command_line}\nfilename: ${filename}\nfilepath:\n${filepath}\nhttps://www.virustotal.com/gui/file/${sha256}\n\nPlease help to verify if it is legitimate, if not please remove it and perform a full scan.\n`;
                alertDescriptions.push(desc);
            }
            const toolbarSha256 = $('.aui-toolbar2-inner');
            // console.info(`toolbar_sha256: ${toolbarSha256.clone().children().remove().end().text().trim()}`);
            // console.info(`sha256: ${sha256}`);
            if (sha256 && !toolbarSha256.clone().children().remove().end().text().trim().includes(sha256)) {
                toolbarSha256.append(`${sha256} `);
            }
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    }
    function openCard() {
        for (const info of alertInfo) {
            const { source, alert_id } = info;
            if (orgNavigator) {
                let cardURL;
                switch (source) {
                    case 'XDR Analytics':
                        cardURL = `${orgNavigator}card/analytics2/${alert_id}`;
                        break;
                    case 'Correlation':
                        cardURL = `${orgNavigator}alerts/${alert_id}`;
                        break;
                    default:
                        cardURL = `${orgNavigator}card/alert/${alert_id}`;
                        break;
                }
                window.open(cardURL, '_blank');
            } else {
                showFlag('error', '', `There is no <strong>${LogSourceDomain}</strong> Navigator on Cortex`, 'auto');
            }
        }
    }
    function openTimeline() {
        for (const info of alertInfo) {
            const { source, alert_id } = info;
            if (orgNavigator) {
                let timelineURL;
                switch (source) {
                    case 'Correlation':
                        showFlag(
                            'error',
                            '',
                            `Source of the Alert is <strong>${source}</strong>, There is no Timeline on Cortex`,
                            'auto'
                        );
                        break;
                    default:
                        timelineURL = `${orgNavigator}forensic-timeline/alert_id/${alert_id}`;
                        break;
                }
                timelineURL && window.open(timelineURL, '_blank');
            } else {
                showFlag('error', '', `There is no <strong>${LogSourceDomain}</strong> Navigator on Cortex`, 'auto');
            }
        }
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openCard', 'Card', openCard);
    addButton('openTimeline', 'Timeline', openTimeline);
}

function MDEAlertHandler() {
    console.log('#### Code MDEAlertHandler run ####');
    function extractLog() {
        const LogSourceDomain = $('#customfield_10223-val').text().trim();
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        return { LogSourceDomain, rawLog };
    }
    const { LogSourceDomain, rawLog } = extractLog();
    // console.info(`LogSourceDomain: ${LogSourceDomain}`);
    // console.info(`rawLog: ${rawLog}`);

    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { mde } = JSON.parse(log);
                const { title, id, computerDnsName, relatedUser, evidence } = mde;
                const alert = { title, id, computerDnsName };
                const userName = relatedUser ? relatedUser.userName : 'N/A';
                let extrainfo = '';
                if (evidence) {
                    const tmp = [];
                    for (const evidenceItem of evidence) {
                        if (evidenceItem.entityType === 'File') {
                            const description = `filename:${evidenceItem.fileName}\nfilePath:${evidenceItem.filePath}\nsha1:${evidenceItem.sha1}\n`;
                            tmp.push(description);
                        }
                        if (evidenceItem.entityType === 'Process') {
                            const description = `cmd:${evidenceItem.processCommandLine}\naccount:${evidenceItem.accountName}\nsha1:${evidenceItem.sha1}\n`;
                            tmp.push(description);
                        }
                    }
                    const uniqueDescriptions = Array.from(new Set(tmp));
                    extrainfo = uniqueDescriptions.join('\n');
                }
                acc.push({ ...alert, userName, extrainfo });
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    // console.info(`alertInfo: ${alertInfo}`);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { title, computerDnsName, userName, extrainfo } = info;
            const desc = `Observed ${title}\nHost: ${computerDnsName}\nusername: ${userName}\n${extrainfo}\nPlease help to verify if it is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    }
    function openMDE() {
        let MDEURL = '';
        for (const info of alertInfo) {
            const { id } = info;
            if (id) {
                MDEURL += `https://security.microsoft.com/alerts/${id}\n`;
            }
        }
        showFlag('info', 'MDE URL:', `${MDEURL}`, 'manual');
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openMDE', 'MDE', openMDE);
}

function HTSCAlertHandler() {
    console.log('#### Code HTSCAlertHandler run ####');
    function decodeHtml(encodedString) {
        const tmpElement = document.createElement('span');
        tmpElement.innerHTML = encodedString;
        return tmpElement.innerText;
    }

    function extractLog() {
        const LogSourceDomain = $('#customfield_10223-val').text().trim();
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        return { LogSourceDomain, rawLog };
    }
    const { LogSourceDomain, rawLog } = extractLog();
    // console.info(`LogSourceDomain: ${LogSourceDomain}`);
    // console.info(`rawLog: ${rawLog}`);

    const parseLog = (rawLog) => {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const formatJson = log.substring(log.indexOf('{')).trim();
                // const logObj = JSON.parse(formatJson);
                const logObj = JSON.parse(formatJson.replace(/\\\(n/g, '\\n('));
                const eventEvidence = decodeHtml(logObj.event_evidence);
                const alert = {
                    attackType: logObj.tag,
                    hostRisk: logObj.hostRisk,
                    srcIP: logObj.src_ip,
                    eventEvidence,
                    hostName: logObj.hostName,
                    dstIP: logObj.dst_ip
                };
                acc.push(alert);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    };
    const alertInfo = parseLog(rawLog);
    // console.info(`alertInfo: ${alertInfo}`);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { attackType, hostRisk, srcIP, hostName, dstIP, eventEvidence } = info;
            const desc = `Observed ${attackType} Attack\nhostRisk: ${hostRisk}\nSrc_IP: ${srcIP}\nhostname: ${hostName}\nDst_IP: ${dstIP}\nevent_evidence: ${eventEvidence}\n\nPlease help to verify if this activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function CBAlertHandler() {
    console.log('#### Code CBAlertHandler run ####');

    function extractLog() {
        const LogSourceDomain = $('#customfield_10223-val').text().trim();
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        return { LogSourceDomain, rawLog };
    }

    // For Swire
    function parseLeefLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            const cb_log = {};
            try {
                const log_obj = log.split('\t');
                log_obj.forEach((log_item) => {
                    try {
                        const [key, value] = log_item.split('=');
                        cb_log[key] = value;
                    } catch (error) {
                        console.error(`Error: ${error.message}`);
                    }
                });
                if (log.trim() !== '') {
                    acc.push({
                        AlertTitle: cb_log.watchlist_name,
                        HostName: cb_log.computer_name,
                        HostIp: cb_log.interface_ip,
                        UserName: cb_log.username,
                        CmdLine: cb_log.cmdline,
                        CBlink: cb_log.link_process,
                        Filepath: cb_log.path,
                        Sha256: cb_log.process_sha256
                    });
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    // For Jetco and other CEF log tickets
    function parseCefLog(rawLog) {
        function cefToJson(cefLog) {
            let json = {};
            let fields = cefLog.split(' ');

            for (let i = 0; i < fields.length; i++) {
                let field = fields[i].split('=');
                let key = field[0];
                let value = field.slice(1).join('=');

                if (value) {
                    value = value.replace(/\\\\=/g, '=').replace(/\\\\s/g, ' ');

                    if (key === 'filePath' || key === 'msg' || key === 'start' || key === 'rt') {
                        let nextFieldIndex = i + 1;
                        while (nextFieldIndex < fields.length && !fields[nextFieldIndex].includes('=')) {
                            value += ' ' + fields[nextFieldIndex];
                            nextFieldIndex++;
                        }
                    }
                    json[key] = value;
                }
            }
            return json;
        }

        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                // Determine whether the log is empty
                if (Object.keys(log).length !== 0) {
                    // Split CEF log
                    let cef_log = log.split('|');
                    // Parsing CEF Header
                    const cef_log_header = cef_log.slice(1, 7);
                    // Parsing CEF Extends
                    const cef_log_extends = cefToJson(cef_log[7]);

                    acc.push({
                        AlertTitle: cef_log_header[4],
                        // for some like "server error" tickets
                        HostName: cef_log_extends.dhost ? cef_log_extends.dhost : cef_log_extends.dvchost,
                        HostIp: cef_log_extends.dst,
                        UserName: cef_log_extends.duser,
                        FileName: cef_log_extends.fname,
                        FilePath: cef_log_extends.filePath,
                        Sha256: cef_log_extends.fileHash,
                        Msg: cef_log_extends.msg
                    });
                }
                return acc;
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }, []);
        return alertInfo;
    }

    const { LogSourceDomain, rawLog } = extractLog();
    let alertInfo;
    if (LogSourceDomain == 'swireproperties') {
        alertInfo = parseLeefLog(rawLog);
    } else if (LogSourceDomain == 'jetco') {
        alertInfo = parseCefLog(rawLog);
    } else {
        alertInfo = '';
    }

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { AlertTitle } = info;
            let desc = `Observed ${AlertTitle}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && index != 'AlertTitle' && index != 'CBlink') {
                    desc += `${index}: ${value}\n`;
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        alert(alertMsg);
    }
    function openCB() {
        let CBURL = '';
        for (const info of alertInfo) {
            const { CBlink } = info;
            if (CBlink) {
                CBURL += `${CBlink}\n`;
            }
        }
        showFlag('info', 'CB URL:', `${CBURL}`, 'manual');
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openCB', 'CB', openCB);
}

(function () {
    'use strict';

    registerSearchMenu();
    registerExceptionMenu();

    // Filter page: audio control registration and regular issues table update
    if (window.location.href.includes('filter=15200') && !window.location.href.includes('MSS')) {
        console.log('#### Code includes filter run ####');
        const NotifyControls = createNotifyControls();

        setInterval(() => {
            $('.aui-button.aui-button-primary.search-button').click();
            setTimeout(checkupdate(NotifyControls), 5000);
        }, 180000);
        setInterval(() => {
            notifyKey = [];
            window.location.href = 'https://caas.pwchk.com/issues/?filter=15200';
        }, 1800000);
    }

    // Issue page: Alert Handler
    setInterval(() => {
        if ($('#issue-content').length && !$('#generateDescription').length && !$('.aui-banner-error').length) {
            console.log('#### Code Issue page: Alert Handler ####');
            checkKeywords();

            const handlers = {
                'cortex-xdr-json': cortexAlertHandler,
                'mde-api-json': MDEAlertHandler,
                'sangfor-ccom-json': HTSCAlertHandler,
                'CarbonBlack': CBAlertHandler,
                'carbonblack_cef': CBAlertHandler
            };
            const DecoderName = $('#customfield_10807-val').text().trim();
            const handler = handlers[DecoderName];
            if (handler) {
                handler();
            }
        }
    }, 3000);

    // Issue page: Edit Notify
    setInterval(() => {
        if ($('#issue-content').length && !$('#generateEditnotify').length) {
            console.log('#### Code Issue page: Edit Notify ####');
            editNotify();
        }
    }, 3000);
})();
