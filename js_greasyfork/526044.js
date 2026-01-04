// ==UserScript==
// @name         BTAS
// @namespace    https://github.com/Mr-Tree-S/BTAS
// @homepageURL  https://github.com/Mr-Tree-S/BTAS
// @version      4.1.0
// @description  Blue Team Auxiliary Script
// @author       Barry, Jack, Xingyu, Mike
// @license      Apache-2.0
// @match        https://login.microsoftonline.com/*
// @match        https://security.microsoft.com/*
// @include      https://caas*.com/*
// @include      https://mss*mss.com/*
// @icon         https://avatars.githubusercontent.com/u/42169240?v=4
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js
// @require      https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// @connect      myqcloud.com
// @connect      172.18.4.200
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526044/BTAS.user.js
// @updateURL https://update.greasyfork.org/scripts/526044/BTAS.meta.js
// ==/UserScript==

var $ = window.jQuery;

/**
 * This function creates and displays a flag using AJS.flag function
 * @param {string} type - The type of flag, can be one of the following: "success", "info", "warning", "error"
 * @param {string} title - The title of the flag
 * @param {string} body - The body of the flag
 * @param {string} close - The close of flag, can be one of the following: "auto", "manual", "never"
 */
function security_microsoft() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var current_domain = urlParams.get('current');
    var customers = {};
    const cachedWebsiteContent = GM_getValue('cachedWebsiteContent', null);
    console.log(cachedWebsiteContent);
    cachedWebsiteContent.forEach((item, index) => {
        if (item && item['category'] == 'mde' && item['url']) {
            customers[item['name']] = item['url'];
        }
    });
    var customer = customers[current_domain];
    if (customer) {
        console.log('account11', customer);
    } else {
        customer = current_domain;
    }
    if (current_domain == 'none') {
        let urls = localStorage.getItem('urls').toString().split(',');
        for (var i = 0; i < urls.length; i++) {
            if (i == 0) {
                window.location.href = urls[i];
            } else {
                GM_openInTab(urls[i], {
                    active: false, // 设置为 false，以在后台打开，不激活新标签页
                    insert: true // 设置为 true，将新标签页插入到当前标签页之后
                });
            }
        }
        localStorage.removeItem('urls');
    }
    setTimeout(() => {
        document.getElementById('O365_MainLink_Me').click();
        console.log('account1');
    }, 9000);
    setTimeout(() => {
        var account = document.getElementById('mectrl_currentAccount_secondary').textContent;
        console.log(account, customer);
        if (
            !account.includes(customer) &&
            !customer.includes(account.split('@')[1].split('.')[0]) &&
            current_domain != 'none'
        ) {
            let urls = [];
            urlParams.forEach(function (value, key) {
                if (key.includes('url')) {
                    urls.push(value);
                }
            });
            localStorage.setItem('urls', urls);
            document.getElementById('mectrl_body_signOut').click();
        } else {
            urlParams.forEach(function (value, key) {
                if (key.includes('url')) {
                    GM_openInTab(value, {
                        active: false, // 设置为 false，以在后台打开，不激活新标签页
                        insert: true // 设置为 true，将新标签页插入到当前标签页之后
                    });
                }
            });
            window.close();
        }
    }, 9900);
}

function switch_user_microsoft() {
    console.log('login.microsoft', $('#idDiv_SAOTCC_Title').text().trim());
    if (
        $('#login_workload_logo_text').text().trim() == '您已注销帐户' ||
        $('#login_workload_logo_text').text().trim() == 'You signed out of your account'
    ) {
        window.location.href = 'https://security.microsoft.com/homepage?&current=none';
    }
    if (
        (document.title == '登录到您的帐户' && $('#idDiv_SAOTCC_Title').text().trim() != '输入验证码') ||
        (document.title == 'Sign in to your account' && $('#idDiv_SAOTCC_Title').textContent.trim() != 'Enter code')
    ) {
        setTimeout(() => {
            var inputElement = document.querySelectorAll('.form-control')[0];
            inputElement.addEventListener('input', function (event) {
                var inputValue = inputElement.value;
                if (inputValue.includes('@')) {
                    $('#idSIButton9').click();
                    setTimeout(() => {
                        $('#idSIButton9').click();
                    }, 1500);
                }
            });
        }, 1600);
    } else {
        setTimeout(() => {
            var inputElement = document.querySelectorAll('.form-control')[0];
            inputElement.addEventListener('keyup', function (event) {
                var inputValue = inputElement.value;
                console.log(inputValue); // 打印当输入框的内容在元素失去焦点时的值
                if (inputValue.length == 6) {
                    $('#idSubmit_SAOTCC_Continue').click();
                }
            });
        }, 800);
    }
}

function addCss() {
    const ss = $(`
	    <style> 
            .red_highlight{
                color:red;
                font-weight: bold;
            }
            .black_highlight{
                color:black;
                font-weight: bold;
            }
            .aui-dropdown2{
                max-width: 550px !important;
            }
            .aui-dropdown2 .aui-dropdown2-checkbox, .aui-dropdown2 .aui-dropdown2-radio, .aui-dropdown2 .aui-icon-container {
                padding-top: 10px;
                padding-left: 35px;
            }
            #reply{
                column-count: 2;
            }
            .aui-flag{
                  border: 4px solid rgb(222,184,135) ;
            }
            .fix-button{
                background-color: rgb(222,184,135);
                color:white;
				z-index: 100;
                margin-right: 12px;
			}
         
	    </style>
	    `);
    $('head').append(ss);

    function hideAllFlag() {
        $('.aui-flag').toggle();
    }
    const button = $('<div>')
        .attr('id', 'hide-reminder')
        .addClass('aui-button toolbar-trigger  fix-button aui-button-primary')
        .append($('<span>').addClass('trigger-label').text('NOTICE'))
        .click(hideAllFlag);

    const checkExist = setInterval(function () {
        const targetDiv = document.getElementById('aui-flag-container');
        const toolbar = $('.aui-header-secondary');

        if (targetDiv) {
            toolbar.prepend(button);
            clearInterval(checkExist); // 停止检查
        }
    }, 100); // 每100毫秒检查一次
}

function showFlag(type, title, body, close) {
    AJS.flag({
        type: type,
        title: DOMPurify.sanitize(title),
        body: DOMPurify.sanitize(body),
        close: close
    });

    // addButton('hide-reminder', 'Hide Reminder', hideAllFlag);

    // 为 flag 的内容区域添加滚动条样式
    const flagBody = $('#aui-flag-container > div > div');
    flagBody.css({
        'overflow': 'auto',
        'max-height': '150px' // 添加最大高度，超出部分将出现滚动条
    });

    // 为 flag 的container区域添加滚动条样式
    const flagContainer = $('#aui-flag-container');
    flagContainer.css({
        'overflow': 'auto',
        'overflow-x': 'hidden', //隐藏水平滚动条
        'max-height': '90%' // 添加最大高度，超出部分将出现滚动条
    });
}

/**
 * This function shows alert message in dialog and create a copy button
 * @param {string} body - Alert Message String
 */
function showDialog(body) {
    // avoid editor treat double backslash as breakline and avoid xss attack
    body = DOMPurify.sanitize(body.replace(/\\\\/g, '\\'));

    // Create custom dialog style
    const customDialogContent = AJS.$(`<section
            id="custom-dialog"
            class="aui-dialog2 aui-dialog2-large aui-layer"
            role="dialog"
            tabindex="-1"
            data-aui-modal="true"
            data-aui-remove-on-hide="true"
            aria-labelledby="dialog-show-button--heading"
            aria-describedby="dialog-show-button--description"
            hidden
        >
            <header class="aui-dialog2-header">
                <h2 class="aui-dialog2-header-main" id="dialog-show-button--heading">Description</h2>
            </header>
            <div class="aui-dialog2-content" id="dialog-show-button--description">
                <p style="word-wrap: break-word; white-space: pre-line">${body}</p>
            </div>
            <footer class="aui-dialog2-footer">
                <div class="aui-dialog2-footer-actions">
                    <button id="dialog-copy-button" class="aui-button aui-button-primary">Copy</button>
                    <button id="dialog-close-button" class="aui-button aui-button-link">Close</button>
                </div>
            </footer>
        </section>`);

    // Show the dialog
    AJS.dialog2(customDialogContent).show();

    // Close the dialog
    AJS.$('#dialog-close-button').on('click', function (e) {
        e.preventDefault();
        AJS.dialog2(customDialogContent).hide();
        //tippy.destroy();
    });

    // Init tippy instance
    tippy('#dialog-copy-button', {
        content: 'Copy Success',
        placement: 'bottom',
        trigger: 'click'
    });

    // Copy description text
    AJS.$('#dialog-copy-button').on('click', function () {
        const textToCopy = customDialogContent.find('#dialog-show-button--description').text().trim();

        // Create Clipboard instance
        const clipboard = new ClipboardJS('#dialog-copy-button', {
            text: function () {
                return textToCopy;
            }
        });

        // Copy success
        clipboard.on('success', function (e) {
            clipboard.destroy();
            e.clearSelection();
        });
    });
}

/**
 * This function registers a Tampermonkey search menu command
 * @param {Array} searchEngines - Search engines array containing the Jira, VT, AbuseIPDB
 */
function registerSearchMenu() {
    console.log('#### Code registerSearchMenu run ####');
    const LogSourceDomain = $('#customfield_10223-val').text().trim() || '*';
    const Host = function () {
        let search = {
            'Source IP(s) and Hostname(s)': $('#customfield_10206-val').text().trim(),
            'Destination IP(s) and Hostname(s)': $('#customfield_10208-val').text().trim()
        };
        if (search['Source IP(s) and Hostname(s)']) {
            return `AND 'Source IP(s) and Hostname(s)' ~ '${search['Source IP(s) and Hostname(s)']}'`;
        } else if (search['Destination IP(s) and Hostname(s)']) {
            return `AND 'Destination IP(s) and Hostname(s)' ~ '${search['Destination IP(s) and Hostname(s)']}'`;
        } else {
            return '';
        }
    };
    let cachedEntry = GM_getValue('cachedEntry', null);

    let url = `${
        cachedEntry['hk']
    }/issues/?jql=text ~ "%s" AND "Log Source Domain" ~ "%D" ${Host()} ORDER BY created DESC`;
    if (window.location.href.includes(cachedEntry['macao'].split('//')[1])) {
        url = `${cachedEntry['macao']}/issues/?jql=text ~ "%s" ORDER BY created DESC`;
    }
    console.log('===url', url);

    const searchEngines = [
        {
            name: 'Jira',
            url: url
        },
        { name: 'VT', url: 'https://www.virustotal.com/gui/search/%s' },
        { name: 'AbuseIPDB', url: 'https://www.abuseipdb.com/check/%s' },
        {
            name: 'Base64 Decode',
            url: `https://cyberchef.org/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)&input=%b`
        }
    ];
    searchEngines.forEach((engine) => {
        GM_registerMenuCommand(engine.name, () => {
            const selectedText = window.getSelection().toString();
            const searchURL = engine.url
                .replace('%s', selectedText)
                .replace('%D', LogSourceDomain)
                .replace('%b', btoa(selectedText));
            if (selectedText.length === 0) {
                showFlag('error', 'No text selected', 'Please select some text and try again', 'auto');
            } else {
                window.open(searchURL, '_blank');
            }
        });
    });
}

/**
 * This function registers custom add/remove quick reply menus in Tampermonkey
 * Add custom reply: input custom reply and store in local
 * Remove quick reply: remove all local storage custom replies
 */
function registerCustomQuickReplyMenu() {
    GM_registerMenuCommand('Add Custom Quick Reply', () => {
        const userInput_name = prompt('Enter saved quick reply name (the name should be unique)').toString();
        const userInput_reply = prompt('Enter a custom quick reply (<br> is used for line break)').toString();
        if (userInput_name !== null && userInput_reply !== null) {
            const key = `customReply_${userInput_name}`;
            // local save
            localStorage.setItem(key, userInput_reply);
        }
    });

    GM_registerMenuCommand('Remove Custom Quick Reply', () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('customReply_')) {
                localStorage.removeItem(key);
            }
        }
        showFlag('success', 'Cleared All Custom Replies', '', 'auto');
    });
    GM_registerMenuCommand('MDE Assist', () => {
        let MDE_Assist_ = localStorage.getItem('MDE_Assist');
        const MDE_Assist = prompt(
            'Whether MDE Assist is enabled(Example:enable  1, disable   0)',
            MDE_Assist_
        ).toString();
        localStorage.setItem('MDE_Assist', MDE_Assist);
    });
}

/**
 * This function create a Quick Reply button in editor
 */
function QuickReply() {
    const replyButton = `<button class="aui-button aui-dropdown2-trigger" aria-controls="is-radio-checked">Quick Reply</button>
    <aui-dropdown-menu id="is-radio-checked">
    <aui-section id="reply">
       <aui-item-radio interactive>Close ticket</aui-item-radio>
        <aui-item-radio interactive>Monitor ticket</aui-item-radio>
        <aui-item-radio interactive>Waiting ticket</aui-item-radio>
        <aui-item-radio interactive>Waiting Full Scan</aui-item-radio>
        <aui-item-radio interactive>Ask for Whitelist</aui-item-radio>
        <aui-item-radio interactive>Whitelist Done</aui-item-radio>
		<aui-item-radio interactive>Agent recover</aui-item-radio>
        <aui-item-radio interactive>Leaked Credentials</aui-item-radio>
		<aui-item-radio interactive>Compromised Accounts</aui-item-radio>
		<aui-item-radio interactive>Log resume</aui-item-radio>
		<aui-item-radio interactive>关闭工单</aui-item-radio> 
		<aui-item-radio interactive>Haeco high severity</aui-item-radio>
        <aui-item-radio interactive>Haeco medium severity</aui-item-radio>
        <aui-item-radio interactive>Haeco low severity</aui-item-radio>
    </aui-section>
    </aui-dropdown-menu>`;
    const commentBar = $($('.aui-toolbar2-primary')[1]);
    commentBar.append(replyButton);

    const commentBarSection = document.querySelector('aui-section#reply');
    const replyComment = {
        'Close ticket': 'Dear Customer,<br>Thanks for your reply, we will close this ticket.<br>Best Regards.',
        'Monitor ticket': 'Dear Customer,<br>Thanks for your reply, we will keep monitor.<br>Best Regards.',
        'Waiting ticket': 'Dear Customer,<br>Thanks, we look forward to hearing from you.',
        'Waiting Full Scan':
            'Dear Customer,<br>Full scan have been triggered , if suspicious files detected new MDE alert/ticket will be created.',
        'Ask for Whitelist': 'Dear Customer,<br>Can we add the ticket to white list?<br>Best Regards.',
        'Whitelist Done':
            'Dear Customer,<br>We have informed the relevant parties to add this ticket to the white list and will close this ticket<br>Best Regards.',
        'Haeco high severity':
            '<h2><strong><span style="color: red;" data-mce-style="color: red;"><samp>[The ticket is escalated to High Severity]</samp></span></strong></h2><br>',
        'Haeco medium severity':
            '<h2><span style="color: rgb(255, 171, 0);" data-mce-style="color: #ffab00;"><strong><samp>[The ticket is escalated to Medium Severity]</samp></strong></span></h2><br>',
        'Haeco low severity':
            '<h2><span style="color: rgb(76, 154, 255);" data-mce-style="color: #4c9aff;"><strong><samp>[The ticket is de-escalated to Low Severity]</samp></strong></span></h2><br>',
        'Leaked Credentials':
            '<p>Dear Client,</p><p>Our Cyber Threat Intelligence investigated the incident and found &lt;Number&gt; leaked credentials related to your organization exposed in dark web. The credentials are listed below:</p><table width="962" class="mce-item-table"><tbody><tr><td width="137"><div><p><strong>EMAIL/USERNAME</strong></p></div></td><td width="137"><div><p><strong>PASSWORD TYPE</strong></p></div></td><td width="137"><div><p><strong>PASSWORD</strong></p></div></td><td width="137"><div><p><strong>SOURCE</strong></p></div></td><td width="137"><div><p><strong>PRICE</strong></p></div></td><td width="137"><div><p><strong>POSTED DATE</strong></p></div></td><td width="137"><div><p><strong>SERVICE</strong></p></div></td></tr><tr><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td></tr></tbody></table><p>[Source Detail from Kela]</p><p>&lt;SOURCE Details/Description&gt;</p><p>[Service if disclose need check]</p><p>As per our open-source investigation through passive means, we observe that:</p><p>&lt; SERVICE&gt; appear to be &lt;SERVICE USAGE&gt;</p><p>[Recommendation]</p><p>We recommend confirming that the service coverage is to customers only, or whether it also includes staff and/or third-party, and evaluate if accounts with administrative privileges require a password change. &nbsp;We also recommend to heighten monitoring of customer login to indicate anomalies in location or timing, and review password policies and evaluate if there is a need to strengthen (e.g., mandate password rotation regularly). A further recommendation is to reach out to these account holders if the accounts are still active, and request that they change their passwords.</p><p>Please do not hesitate to reach out to us if you have any queries. Thank you.</p><p>Best Regards,<br>Cyber Threat Intelligence Team</p>',
        'Compromised Accounts':
            '<p>Dear Client,</p><p>Our Cyber Threat Intelligence investigated the incident and found&nbsp;&lt;Number&gt; compromised accounts related to your organisation exposed in dark web. The credentials are listed below:</p><table width="962" class="mce-item-table"><tbody><tr><td width="137"><div><p><strong>EMAIL/USERNAME</strong></p></div></td><td width="137"><div><p><strong>PASSWORD TYPE</strong></p></div></td><td width="137"><div><p><strong>PASSWORD</strong></p></div></td><td width="137"><div><p><strong>SOURCE</strong></p></div></td><td width="137"><div><p><strong>PRICE</strong></p></div></td><td width="137"><div><p><strong>POSTED DATE</strong></p></div></td><td width="137"><div><p><strong>SERVICE</strong></p></div></td></tr><tr><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td><td width="137"><br data-mce-bogus="1"></td></tr></tbody></table><p>[Source Detail from Kela]</p><p>&lt;SOURCE Details/Description&gt;</p><p>[Service if disclose need check]</p><p>As per our open-source investigation through passive means, we observe that:</p><p>&lt; SERVICE&gt; appear to be &lt;SERVICE USAGE&gt;&nbsp;</p><p>[Recommendation]</p><p>We recommend confirming that the service coverage is to customers only, or whether it also includes staff and/or third-party, and evaluate if accounts with administrative privileges require a password change. &nbsp;We also recommend to heighten monitoring of customer login to indicate anomalies in location or timing, and review password policies and evaluate if there is a need to strengthen (e.g., mandate password rotation regularly). A further recommendation is to reach out to these account holders if the accounts are still active, and request that they change their passwords.</p><p>Please do not hesitate to reach out to us if you have any queries. Thank you.</p><p>Best Regards,<br>Cyber Threat Intelligence Team</p>',
        'Log resume':
            'Dear Customer,<br>Thanks for your reply, <br>Log resumed, we will close this ticket.<br>Best Regards.',
        'Agent recover':
            'Dear Customer,<br>Thanks for your reply,<br>The agent is now active and we will close this case<br>Best Regards.',
        '关闭工单': '尊敬的客户，<br>感谢您的回复，我们将关闭此工单。 <br>祝您生活愉快。<br>'
    };

    // Check local storage at initialization time
    function getAllCustomReply() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('customReply_')) {
                const storedReply = localStorage.getItem(key).toString();
                const storeReplyName = key.split('_')[1].toString();
                replyComment[storeReplyName] = storedReply;
                $('#reply').append(`<aui-item-radio interactive>${storeReplyName}</aui-item-radio>`);
            }
        }
    }
    getAllCustomReply();

    try {
        if (commentBarSection !== null) {
            commentBarSection.addEventListener('change', function (e) {
                if (e.target.hasAttribute('checked')) {
                    tinymce.activeEditor.setContent('');
                    let replyValue = replyComment[e.target.textContent];
                    tinymce.activeEditor.execCommand('mceInsertContent', false, replyValue);
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

/**jsonView */
function jsonToTree(data) {
    let flag = false;
    let html = '<ul class="code-java" style="list-style-type: none;margin-top: 0px;padding-left: 20px;">';
    if (Array.isArray(data)) {
        let temp = '[';
        data.forEach((element) => {
            temp += jsonToTree(element);
        });
        html += temp + '],';
    } else if (data != null && typeof data === 'object' && Object.keys(data).length !== 0) {
        flag = true;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                html += '<li class="code-quote">"' + key + '": ';
                if (Array.isArray(data[key])) {
                    let temp = '[';
                    data[key].forEach((element) => {
                        temp += jsonToTree(element);
                    });
                    html += temp + '],';
                } else if (typeof data[key] === 'object') {
                    try {
                        if (Object.keys(data[key]).length == 0) {
                            html += '{},';
                        } else {
                            const str = jsonToTree(data[key]);
                            html += str;
                        }
                    } catch (TypeError) {
                        html += '"",';
                    }
                } else {
                    html += '"' + data[key].toString() + '",';
                }
                html += '</li>';
            }
        }
    } else {
        html += '"' + data.toString() + '",';
    }
    if (flag === true) {
        html = '{' + html + '},';
    }
    html += '</ul>';
    return html;
}

function ToWhitelist() {
    const summary = $('#summary-val').text().trim();
    var LogSourceDomain = $('#customfield_10223-val').text().trim();
    let DecoderName = $('#customfield_10807-val').text().trim().toLowerCase();
    let Component = 'Wazuh';
    if (DecoderName.includes('mde') || DecoderName.includes('m365')) {
        Component = 'MDE';
    }
    if (DecoderName.includes('cortex')) {
        Component = 'Cortex';
    }
    let whitelist = {
        summary: summary,
        LogSourceDomain: LogSourceDomain,
        Component: Component,
        MSS: window.location.href
    };
    localStorage.setItem('whitelist', JSON.stringify(whitelist));
    let cachedEntry = GM_getValue('cachedEntry', null);
    window.open(`${cachedEntry['hk']}/plugins/servlet/desk/portal/2/create/100`, '_blank');
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

    GM_registerMenuCommand('JsonViewer', () => {
        var isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                showFlag('error', 'Please select json format data', '', 'auto');
                return false;
            }
            return true;
        };
        let selection = window.getSelection().toString().trim();
        if (!selection) {
            showFlag('error', 'No Issue Key selected', '', 'auto');
            return;
        } else if (isJson(selection)) {
            var jsonData = jsonToTree(JSON.parse(selection));
            /**  var jsonView = document.createElement('pre');
            jsonView.textContent = JSON.stringify(jsonData,null,2);
            **/
            showDialog(jsonData, 'Json Format');
        }
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
                ? 'https://gitee.com/aspirepig/aspirepig/raw/master/12221.wav'
                : 'https://gitee.com/aspirepig/aspirepig/raw/master/alerts.wav';
        audioControl.html(`<audio id="myAudio" src="${audioURL}" type="audio/mpeg" controls></audio>`);
        parentNode.prepend(audioControl);
    }

    function createCheckbox(parentNode, localStorageKey, checkStatus) {
        const checkbox = $('<span></span>');
        const value = localStorage.getItem(localStorageKey);
        checkbox.html(
            `<input type="checkbox" name="${localStorageKey}" ${
                value == 'true' ? 'checked' : checkStatus ? 'checked' : ''
            }>${localStorageKey}`
        );
        checkbox.find('input').on('click', () => {
            localStorage.setItem(localStorageKey, checkbox.find('input').prop('checked'));
        });
        parentNode.prepend(checkbox);
        return checkbox;
    }
    createAudioControl(operationsBar);
    const audioCheckbox = createCheckbox(operationsBar, 'audioNotify', false);
    const keepCheckbox = createCheckbox(operationsBar, 'keepAudio', false);
    const promptCheckbox = createCheckbox(operationsBar, 'prompt', true);

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
    let cachedEntry = GM_getValue('cachedEntry', null);

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
        if (diffMinutes > 30 && diffMinutes < 120) {
            overdueTickets += `<a href="${cachedEntry['hk']}/browse/${issuekey}" target="_blank">${issuekey}</a>, `;
        }
    });
    if (overdueTickets && promptCheckbox.find('input').prop('checked')) {
        GM_addStyle(`
        .aui-banner.aui-banner-warning {
            background-color: #ffab00 !important;
            color: black !important;
        }
    `);
        AJS.banner({
            body: `Ticket: ${overdueTickets}<br>30 minutes have passed since the ticket's status changed, please handle it as soon as possible`,
            type: 'warning'
        });
    }
}

/**
 * This function checks for specific keywords within a string
 * Advises the user to double-check and contact L2 or TL if suspicious.
 */
function checkKeywords() {
    console.log('#### Code checkKeywords run ####');
    function check(keywords) {
        const rawLog = $('#customfield_10219-val').text().trim().toLowerCase();
        const summary = $('#summary-val').text().trim().toLowerCase();
        let Raw_Crotex_alert = $('.code-java').text().trim().toLowerCase();

        for (const keyword of keywords) {
            if (
                rawLog.includes(keyword['keyword'].toLowerCase()) ||
                Raw_Crotex_alert.includes(keyword['keyword'].toLowerCase()) ||
                summary.includes(keyword['keyword'].toLowerCase())
            ) {
                AJS.banner({
                    body: `\"${keyword['keyword']}\" was found in the ticket, it is maybe used for "${keyword['remark']}", please double-check and contact L2 or TL if suspicious.`
                });
            }
        }
    }
    function fetchData(url, apiKey) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'api-key': apiKey
            },
            timeout: 4000, // 超过4秒未获取到文件则使用缓存文件
            onload: function (response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText)['data'];
                    console.log(data);
                    let cachedEntry = {};
                    data['website'].forEach((item, index) => {
                        if (item && item['name'] == 'hk' && item['url']) {
                            cachedEntry['hk'] = item['url'];
                        }
                        if (item && item['name'] == 'macao' && item['url']) {
                            cachedEntry['macao'] = item['url'];
                        }
                        GM_setValue('cachedEntry', cachedEntry);
                    });
                    GM_setValue('cachedMappingContent', data['mapping']);
                    GM_setValue('cachedKeywordsContent', data['keywords']);
                    GM_setValue('cachedWebsiteContent', data['website']);
                    GM_setValue('cachedWhitehashContent', data['whitehash']);
                } else {
                    console.error('Error fetching cachedContent:', response.status);
                }
            },
            ontimeout: function () {
                if (cachedKeywordsContent == null || cachedWebsiteContent == null || cachedWhitehashContent == null) {
                    showFlag('Error', 'BTAS缓存数据获取失败', '未连接到 VPN，请连接后刷新页面', 'auto');
                }
            },
            onerror: function (error) {
                console.error('Error:', error);
            }
        });
    }

    const url = 'https://172.18.4.200/api/7vVKD9hF/message/';
    const apiKey = 'Tnznjha3yhJgA7YG';
    const cachedKeywordsContent = GM_getValue('cachedKeywordsContent', null);
    if (cachedKeywordsContent == null) {
        fetchData(url, apiKey);
    }
    check(cachedKeywordsContent);
}

/**
 * This function is used for checking ATT&CK field
 */
function checkATTCK() {
    const status = $('#opsbar-transitions_more > span').text().trim();
    const attck = $('#rowForcustomfield_10220 > div > strong > label').text();
    if (status == 'Waiting for customer' && attck == '') {
        AJS.banner({ body: `The ATT&CK field is not filled in` });
    }
}

/**
 * This function is used for popping up MSS ticket considerations when clicked "Edit" and "Resolved" button or page loading.
 * Ticket Considerations file is store in cloud server
 * @param {Object} pageData - Gets the specified fields from the jira page
 */
function ticketNotify(pageData) {
    console.log('#### Code ticketNotify run ####');

    function fetchOrgNotifydict() {
        // 从本地存储获取缓存的文件内容和上次更新时间
        const cachedContent = GM_getValue('cachedFileContent', null);

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://172.18.4.200/api/7vVKD9hF/notifys/',
            headers: {
                'api-key': 'Tnznjha3yhJgA7YG'
            },
            timeout: 4000, // 超过4秒未获取到文件则使用缓存文件
            onload: function (response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText)['data'];

                    // 本地无缓存，第一次获取文件保存到本地
                    if (cachedContent == null) {
                        // 更新本地存储中的文件内容和更新时间
                        GM_setValue('cachedFileContent', data);
                        checkNotify(data.items, pageData);
                    }
                    // 如果本地存储中有缓存，并且文件内容有变化
                    if (cachedContent !== null && JSON.stringify(cachedContent) !== JSON.stringify(data)) {
                        // 更新本地存储中的文件内容
                        GM_setValue('cachedFileContent', data);
                        // 使用最新文件
                        checkNotify(data.items, pageData);
                    }
                    // 本地存在缓存，且内容相同则使用缓存文件
                    if (cachedContent !== null && JSON.stringify(cachedContent) == JSON.stringify(data)) {
                        checkNotify(cachedContent.items, pageData);
                    }
                } else {
                    console.error('Error fetching orgNotifydict:', response.status);
                }
            },
            ontimeout: function () {
                if (cachedContent !== null) {
                    checkNotify(cachedContent.items, pageData);
                } else {
                    showFlag('Error', '文件获取失败', '未连接到 VPN，请连接后刷新页面', 'auto');
                }
            },
            onerror: function (error) {
                console.error('Error:', error);
            }
        });
    }
    fetchOrgNotifydict();

    function checkNotify(Notifydict, pageData) {
        // get button path
        const buttonMap = {
            Edit: '#edit-issue',
            Resolve: '#action_id_761',
            None: ''
        };
        const searchStrings = [];

        // 查找并高亮指定字符串的函数
        function highlightTextInElement(selector, searchStrings) {
            const element = $(selector);
            if (element.length === 0) {
                console.error('未找到指定的元素');
                return;
            }
            let text;
            if (selector == '#description-val') {
                text = element.html();
            } else {
                text = element.text().trim();
            }

            // 对每个字符串进行高亮处理
            searchStrings.forEach((searchString) => {
                // 在文本中查找并替换匹配的字符串
                text = text.replace(
                    new RegExp(searchString, 'gi'),
                    (match) => `<span style="background-color: yellow;">${match}</span>`
                );
            });
            if (text.includes('</')) {
                text = text.replace(/document/g, '?');
            }
            // 将替换后的文本重新设置为元素的 HTML 内容
            element.html(text);
        }

        function checkProperties(properties, pageData, ticketname) {
            const condition = (property) => {
                const propertyArray = property.propertiesVal.split(',');
                let isAllConditionsMet = false;
                for (const val of propertyArray) {
                    try {
                        if (!property.conditionOptions) {
                            let isTrue = pageData[property.propertiesKey]
                                .toLowerCase()
                                .includes(val.trim().toLowerCase().replace('!', ''));
                            if (val.trim().toLowerCase().includes('!')) {
                                isTrue = !isTrue;
                            }
                            if (isTrue) {
                                if (property.propertiesKey == 'RawLog' || property.propertiesKey == 'Description') {
                                    searchStrings.push(val.trim());
                                }
                                isAllConditionsMet = true; // 如果任何一个属性满足条件，返回 true
                            }
                        }
                        switch (property.conditionOptions) {
                            case 'contain':
                                if (pageData[property.propertiesKey].toLowerCase().includes(val.trim().toLowerCase())) {
                                    isAllConditionsMet = true;
                                    if (property.propertiesKey == 'RawLog' || property.propertiesKey == 'Description') {
                                        searchStrings.push(val.trim());
                                    }
                                }
                                break;
                            case 'not contain':
                                if (
                                    !pageData[property.propertiesKey].toLowerCase().includes(val.trim().toLowerCase())
                                ) {
                                    isAllConditionsMet = true;
                                }
                                break;
                            case 'equal':
                                if (pageData[property.propertiesKey].toLowerCase() === val.trim().toLowerCase()) {
                                    isAllConditionsMet = true;
                                }
                                break;
                            case 'not equal':
                                if (pageData[property.propertiesKey].toLowerCase() !== val.trim().toLowerCase()) {
                                    isAllConditionsMet = true;
                                }
                                break;
                            default:
                                console.log('Unknown.');
                        }
                    } catch (error) {
                        if (
                            error.name === 'TypeError' &&
                            error.message == "Cannot read properties of undefined (reading 'includes')"
                        ) {
                            console.warn(`${ticketname} 提醒未加条件，请检查配置`);
                        }
                    }
                }
                return isAllConditionsMet; // 如果所有属性都不满足条件，则返回 false
            };
            properties = JSON.parse(properties);
            return properties.reduce((acc, property) => {
                return acc && condition(property);
            }, true);
        }
        let cachedEntry = GM_getValue('cachedEntry', null);
        let projectMap = {};
        projectMap[cachedEntry['hk'].split('//')[1]] = 'HK';
        projectMap[cachedEntry['macao'].split('//')[1]] = 'MO';

        for (const notify of Notifydict) {
            const { ticketname, starttime, endtime, message, properties, button, status, project } = notify;
            const isInTimeRange =
                (!starttime || new Date() >= new Date(starttime)) && (!endtime || new Date() <= new Date(endtime));
            const clickButton = buttonMap[button];

            if (status == 'Disable' || !isInTimeRange || projectMap[window.location.host] !== project) {
                continue;
            }

            if (checkProperties(properties, pageData, ticketname)) {
                if (clickButton == '') {
                    showFlag('warning', `${ticketname}`, `${message.replace(/\r?\n/g, '<br>')}`, 'manual');
                } else {
                    $(clickButton).on('click', () => {
                        showFlag('warning', `${ticketname}`, `${message.replace(/\r?\n/g, '<br>')}`, 'manual');
                    });
                }

                let selector;
                if (project == 'HK') {
                    selector = '#field-customfield_10219 > div:first-child > div:nth-child(2)';
                } else if (project == 'MO') {
                    if (properties.includes('Description')) {
                        selector = '#description-val';
                    } else {
                        selector = '#field-customfield_10904 > div.twixi-wrap.verbose > div';
                    }
                }
                highlightTextInElement(selector, searchStrings);
            }
        }
    }
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
    // 重复添加的按钮不会被显示
    if ($('#' + id).length === 0) {
        const button = $('<a>')
            .attr('id', id)
            .addClass('aui-button toolbar-trigger')
            .append($('<span>').addClass('trigger-label').text(text))
            .click(onClick);
        toolbar.append($('<div>').addClass('aui-buttons pluggable-ops').append(button));
    }
}

function monitorList() {
    var summaryElements = document.querySelectorAll('.summary');
    summaryElements.forEach(function (element) {
        if (
            element.textContent.includes('WebAvailability') ||
            element.textContent.includes('SWIFT login activity and select activity detected')
        ) {
            var audio = document.getElementById('myAudio');
            audio.play();
        }
    });
    var time_to_first_response = document.querySelectorAll('.sla-tag.sla-tag-ongoing');
    time_to_first_response.forEach(function (element) {
        console.log(element.outerText.replace('min', ''), element.outerText.replace('min', '') < 30);
        if (element.outerText.includes('min') && element.outerText.replace('min', '') < 30) {
            var audio = document.getElementById('myAudio');
            audio.play();
            console.log('出现特殊情况');
        }
    });
}

/**
 * Creates three buttons on a JIRA issue page to handle Cortex XDR alerts
 * The buttons allow users to generate a description of the alerts, open the alert card page and timeline page
 */
function cortexAlertHandler(...kwargs) {
    console.log('#### Code cortexAlertHandler run ####');
    const { LogSourceDomain, summary } = kwargs[0];
    const rawLog = $('#field-customfield_10232 > div.twixi-wrap.verbose > div > div > div > pre').text();
    /**
     * Extracts the log information and organization name from the current JIRA issue page
     * @param {Object} orgDict - A dictionary that maps organization name to navigator name
     * @returns {Object} An object that contains the organization's name, organization's navigator URL, raw log information
     */
    let orgDict = {};
    const cachedWebsiteContent = GM_getValue('cachedWebsiteContent', null);
    if (cachedWebsiteContent != null) {
        cachedWebsiteContent.forEach((item, index) => {
            if (item && item['category'] == 'cortex' && item['url']) {
                orgDict[item['name']] = item['url'];
            }
        });
    } else {
        alert('cachedWebsiteContent is empty,please connect VPN get information');
    }
    const orgNavigator = orgDict[LogSourceDomain];

    /**
     * Parse the relevant information from the raw log data
     * @param {Array} rawLog - An array of JSON strings representing the raw log data
     * @returns {Array} An array of objects containing the alert relevant information
     */
    function parseLog(rawLog) {
        let alertInfo = [];
        try {
            const { timestamp, data, rule } = JSON.parse(rawLog);
            let rule_description = rule['description'].split(':')[-1];
            const { cortex_xdr } = data;
            const { source, alert_id, name, description } = cortex_xdr;
            const isPANNGFW = source === 'PAN NGFW';
            let dotIndex = timestamp.lastIndexOf('.');

            dateTimeStr = timestamp.slice(0, dotIndex) + '+0800';
            const alert = { source, alert_id, name, description, dateTimeStr, rule_description };
            if (isPANNGFW) {
                const {
                    action_local_ip,
                    action_local_port,
                    action_remote_ip,
                    action_remote_port,
                    action_pretty,
                    alert_link
                } = cortex_xdr;
                alertInfo.push({
                    ...alert,
                    action_local_ip,
                    action_local_port,
                    action_remote_ip,
                    action_remote_port,
                    action_pretty,
                    alert_link
                });
            } else {
                const {
                    action_local_ip,
                    action_file_macro_sha256,
                    action_file_name,
                    action_file_path,
                    action_file_sha256,
                    action_process_image_name,
                    action_process_image_sha256,
                    action_process_image_command_line,
                    action_external_hostname,
                    actor_process_image_name,
                    actor_process_image_path,
                    actor_process_image_sha256,
                    actor_process_command_line,
                    causality_actor_process_image_name,
                    causality_actor_process_command_line,
                    causality_actor_process_image_path,
                    causality_actor_process_image_sha256,
                    os_actor_process_image_name,
                    os_actor_process_image_path,
                    os_actor_process_command_line,
                    os_actor_process_image_sha256,
                    action_pretty,
                    host_name,
                    host_ip,
                    user_name,
                    alert_link
                } = cortex_xdr;
                const action_list = {
                    action_file_name,
                    action_file_path,
                    action_file_sha256,
                    action_process_image_name,
                    action_process_image_sha256,
                    action_process_image_command_line
                };
                const actor_list = {
                    actor_process_image_name,
                    actor_process_image_path,
                    actor_process_image_sha256,
                    actor_process_command_line
                };
                const causality_actor_list = {
                    causality_actor_process_image_name,
                    causality_actor_process_command_line,
                    causality_actor_process_image_path,
                    causality_actor_process_image_sha256
                };
                const os_actor_list = {
                    os_actor_process_image_name,
                    os_actor_process_image_path,
                    os_actor_process_command_line,
                    os_actor_process_image_sha256
                };

                function countValidProperties(obj) {
                    const validPropsCount = Object.keys(obj).reduce((count, key) => {
                        if (obj[key] !== undefined) {
                            count++;
                        }
                        return count;
                    }, 0);
                    return validPropsCount;
                }

                const actionPropsCount = countValidProperties(action_list) ? countValidProperties(action_list) + 1 : 0;
                const actorPropsCount = countValidProperties(actor_list);
                const causalityPropsCount = countValidProperties(causality_actor_list);
                const osPropsCount = countValidProperties(os_actor_list);
                const maxCount = Math.max(actionPropsCount, actorPropsCount, causalityPropsCount, osPropsCount);

                const action_cmd_length = action_process_image_command_line
                    ? action_process_image_command_line.length
                    : 0;
                const actor_cmd_length = actor_process_command_line ? actor_process_command_line.length : 0;
                const causality_cmd_length = causality_actor_process_command_line
                    ? causality_actor_process_command_line.length
                    : 0;
                const os_cmd_length = os_actor_process_command_line ? os_actor_process_command_line.length : 0;
                const lengths = [action_cmd_length, actor_cmd_length, causality_cmd_length, os_cmd_length];
                const maxLength = Math.max(...lengths);

                let filename;
                let filepath;
                let sha256;
                let cmd;

                if (action_cmd_length === maxLength && actionPropsCount === maxCount) {
                    if (!WhiteFilehash(action_file_sha256 || action_process_image_sha256)) {
                        sha256 = action_file_sha256 || action_process_image_sha256;
                    }
                    filename = action_file_name || action_process_image_name;
                    filepath = action_file_path;
                    cmd = action_process_image_command_line;
                } else if (actor_cmd_length === maxLength && actorPropsCount === maxCount) {
                    if (!WhiteFilehash(actor_process_image_sha256)) {
                        sha256 = actor_process_image_sha256;
                    }
                    filename = actor_process_image_name;
                    filepath = actor_process_image_path;
                    cmd = actor_process_command_line;
                } else if (causality_cmd_length === maxLength && causalityPropsCount === maxCount) {
                    if (!WhiteFilehash(causality_actor_process_image_sha256)) {
                        sha256 = causality_actor_process_image_sha256;
                    }
                    filename = causality_actor_process_image_name;
                    filepath = causality_actor_process_image_path;
                    cmd = causality_actor_process_command_line;
                } else if (os_actor_process_image_name && osPropsCount === maxCount) {
                    if (!WhiteFilehash(os_actor_process_image_sha256)) {
                        sha256 = os_actor_process_image_sha256;
                    }
                    filename = os_actor_process_image_name;
                    filepath = os_actor_process_image_path;
                    cmd = os_actor_process_command_line;
                }

                alertInfo.push({
                    ...alert,
                    host_name,
                    host_ip,
                    alert_link,
                    user_name,
                    filename,
                    filepath,
                    cmd,
                    sha256,
                    action_pretty,
                    action_local_ip,
                    action_file_macro_sha256,
                    action_external_hostname
                });
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }

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
            let {
                source,
                name,
                action_local_ip,
                action_local_port,
                action_remote_ip,
                action_remote_port,
                action_pretty,
                description,
                alert_link,
                rule_description,
                action_external_hostname
            } = info;
            let unPanNgfw = [
                'host_name',
                'host_ip',
                'sha256',
                'action_file_macro_sha256',
                'filepath',
                'filename',
                'cmd',
                'user_name',
                'action_local_ip'
            ];
            if (description && description.includes('xdr_data')) {
                console.log(rule_description);
                description = rule_description;
            }
            const cachedMappingContent = GM_getValue('cachedMappingContent', null);
            console.log('===', cachedMappingContent);
            if (source === 'PAN NGFW') {
                const desc = `Observed ${name}\ntimestamp: ${dateTimeStr}\nSrcip: ${action_local_ip}   Srcport: ${action_local_port}\nDstip: ${action_remote_ip}   Dstport: ${action_remote_port}\nAction: ${action_pretty}\n${
                    LogSourceDomain === cachedMappingContent['cca'] ? 'Cortex Portal: ' + alert_link + '\n' : ''
                }\n\nPlease help to verify if this activity is legitimate.\n`;
                alertDescriptions.push(desc);
            } else {
                let comment = '\nPlease help to verify if this activity is legitimate.\n';
                if (
                    summary.toLowerCase().includes('wildfire malware') ||
                    summary.toLowerCase().includes('local analysis malware')
                ) {
                    comment = '\nPlease verify if the File is legitimate.   IF NOT, please Remove the File.\n';
                }
                let desc = `Observed ${
                    description || name
                }\ntimestamp: ${dateTimeStr} \n<span class="red_highlight">action_external_hostname: ${action_external_hostname}\n</span>action: ${action_pretty}\n`;
                for (const key of unPanNgfw) {
                    console.log(key);
                    if (Object.hasOwnProperty.call(info, key)) {
                        const value = info[key];
                        console.log(key, value);
                        if (value !== undefined) {
                            if (key == 'event_evidence') {
                                desc += `${key}: ${value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}\n`;
                            } else {
                                desc += `${key}: ${value}\n`;
                            }
                        }
                    }
                }
                if (info['action_file_macro_sha256'] || info['sha256']) {
                    desc += `<a href="https://www.virustotal.com/gui/file/${
                        info['action_file_macro_sha256'] || info['sha256']
                    }">https://www.virustotal.com/gui/file/${info['action_file_macro_sha256'] || info['sha256']}</a>\n`;
                }
                alertDescriptions.push(desc + comment);
            }
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
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

function HTSCAlertHandler(...kwargs) {
    console.log('#### Code HTSCAlertHandler run ####');
    const { rawLog } = kwargs[0];
    function decodeHtml(encodedString) {
        const tmpElement = document.createElement('span');
        tmpElement.innerHTML = encodedString;
        return tmpElement.innerText;
    }

    const parseLog = (rawLog) => {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const formatJson = log.substring(log.indexOf('{')).trim();
                // const logObj = JSON.parse(formatJson);
                const logObj = JSON.parse(formatJson.replace(/\\\(n/g, '\\n('));
                const eventEvidence = decodeHtml(logObj.event_evidence).split('End time')[0];
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
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function VMCEFAlertHandler(...kwargs) {
    const { rawLog } = kwargs[0];

    function parseCefLog(rawLog) {
        function cefToJson(cefLog) {
            let json = {};
            let fields = cefLog.split(' ');

            for (let i = 0; i < fields.length; i++) {
                let field = fields[i].split('=');
                let key = field[0];
                let value = field.slice(1).join('=');

                if (value) {
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
                        Summary: cef_log_header[4],
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
    const alertInfo = parseCefLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { Summary } = info;
            let desc = `Observed ${Summary}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && index != 'Summary' && index != 'CBlink') {
                    desc += `${index}: ${value}\n`;
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function CBAlertHandler(...kwargs) {
    console.log('#### Code CBAlertHandler run ####');
    const { rawLog } = kwargs[0];

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
                        Summary: cb_log.watchlist_name,
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

    const alertInfo = parseLeefLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { Summary } = info;
            let desc = `Observed ${Summary}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && index != 'Summary' && index != 'CBlink') {
                    desc += `${index}: ${value}\n`;
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
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

function WineventAlertHandler(...kwargs) {
    console.log('#### Code WineventAlertHandler run ####');
    let { rawLog, summary, LogSourceDomain } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    summary = summary.replace(/[\[(].*?[\])]/g, '');
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { win } = JSON.parse(log);
                raw_alert += 1;
                const { eventdata, system } = win;
                const alertHost = system.computer;
                const systemTime = system.systemTime;
                acc.push({ systemTime, summary, alertHost, eventdata });
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);

    function generateDescription() {
        const cachedMappingContent = GM_getValue('cachedMappingContent', null);

        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        if (LogSourceDomain == cachedMappingContent['gga']) {
            alertDescriptions.push(`Log Details:\n`);
        }
        for (const info of alertInfo) {
            let desc = `Observed${info.summary}\nHost: ${info.alertHost}\n`;
            const date = new Date(info.systemTime.split('.')[0]);
            date.setHours(date.getHours() + 16);
            desc += `systemTime(<span class="red_highlight">UTC+8</span>): ${date.toISOString().split('.')[0]}\n`;
            for (const key in info.eventdata) {
                if (Object.hasOwnProperty.call(info.eventdata, key)) {
                    const value = info.eventdata[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += '\n' + 'Please help to verify if this activity is legitimate.' + '\n';
            alertDescriptions.push(desc);
        }
        if (LogSourceDomain == cachedMappingContent['gga']) {
            let kibana = $('#field-customfield_10308').text().trim().split(' ')[36];
            let newUrl = kibana.replace(
                /https:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
                'https://' + cachedMappingContent['gga_url']
            );
            alertDescriptions.push(`\n${newUrl}\n`);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function FortigateAlertHandler(...kwargs) {
    let { rawLog, summary, LogSourceDomain } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    summary = summary.split(']')[1].trim();
    function ParseFortigateLog(rawLog) {
        const alertInfos = rawLog.reduce((acc, log) => {
            if (log == '') {
                return acc;
            }
            let jsonData = {};
            const regex = /(\w+)=(["'].*?["']|\S+)/g;
            let matchresult;
            raw_alert += 1;
            while ((matchresult = regex.exec(log)) !== null) {
                let key = matchresult[1];
                let value = matchresult[2];
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }
                jsonData[key] = value;
            }
            acc.push(jsonData);
            return acc;
        }, []);
        return [...new Set(alertInfos)];
    }

    const alertInfos = ParseFortigateLog(rawLog);
    function ExtractAlertInfo(ExtractAlertInfo) {
        const extract_alert_infos = alertInfos.reduce((acc, alertInfo) => {
            const {
                date,
                time,
                srcip,
                srcport,
                srccountry,
                dstip,
                dstport,
                dstcountry,
                hostname,
                url,
                referralurl,
                action,
                devname,
                user,
                cfgattr,
                msg,
                forwardedfor,
                analyticscksum,
                from,
                to,
                remip
            } = alertInfo;
            let arr = [];
            if (summary.toLowerCase().includes('infected file detected in fortigate')) {
                let vt_url;
                if (url) {
                    vt_url = 'https://www.virustotal.com/gui/domain/' + url.split('/')[2];
                } else {
                    vt_url = 'https://www.virustotal.com/gui/ip-address/' + srcip;
                }
                let sum = 'https://www.virustotal.com/gui/search/' + analyticscksum;
                arr.push(`<a href="${vt_url}">${vt_url}</a>`);
                arr.push(`<a href="${sum}">${sum}</a>`);
            } else if (summary.toLowerCase().includes('connection attempt')) {
                let vt_url = 'https://www.virustotal.com/gui/ip-address/' + dstip;
                arr.push(`<a href="${vt_url}">${vt_url}</a>`);
            } else if (summary.toLowerCase().includes('connection to newly registered domain')) {
                let vt_url = 'https://www.virustotal.com/gui/domain/' + hostname;
                arr.push(`<a href="${vt_url}">${vt_url}</a>`);
            } else if (summary.toLowerCase().includes('non-office hour successful vpn login')) {
                let vt_url = 'https://www.virustotal.com/gui/ip-address/' + remip;
                arr.push(`<a href="${vt_url}">${vt_url}</a>`);
            }

            const extract_alert_info = {
                datetime: `${date} ${time}`,
                srcip: srcip ? `${srcip}:${srcport}[${srccountry}]` : undefined,
                dstip: dstip ? `${dstip}:${dstport}[${dstcountry}]` : undefined,
                hostname: hostname,
                devname: devname,
                user: user,
                url: url,
                action: action,
                cfgattr: cfgattr,
                msg: msg,
                referralurl: referralurl,
                forwardedfor: forwardedfor || undefined,
                analyticscksum: analyticscksum,
                from: from,
                to,
                remip: remip,
                VT: arr.length > 0 ? arr : undefined
            };
            acc.push(extract_alert_info);
            return acc;
        }, []);
        return extract_alert_infos;
    }
    function ExtractAlertInfo_sonicwall(ExtractAlertInfo) {
        const extract_alert_infos = alertInfos.reduce((acc, alertInfo) => {
            acc.push({
                time: alertInfo.time,
                msg: alertInfo.msg,
                src: alertInfo.src,
                srcZone: alertInfo.srcZone,
                natSrc: alertInfo.natSrc,
                dst: alertInfo.dst,
                dstZone: alertInfo.dstZone,
                natDst: alertInfo.natDst,
                proto: alertInfo.proto
            });
            return acc;
        }, []);
        return extract_alert_infos;
    }
    let extract_alert_infos = '';
    const cachedMappingContent = GM_getValue('cachedMappingContent', null);
    if (LogSourceDomain == cachedMappingContent['mma']) {
        extract_alert_infos = ExtractAlertInfo_sonicwall(alertInfos);
    } else {
        extract_alert_infos = ExtractAlertInfo(alertInfos);
    }

    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of extract_alert_infos) {
            let desc = `Observed ${summary}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined) {
                    desc += `${index}: ${value}\n`;
                }
            });
            let comment = '\nPlease help to verify if this activity is legitimate.\n';
            if (summary.toLowerCase().includes('to malware ip(s)') || summary.toLowerCase().includes('to tor ip(s)')) {
                comment = '\nPlease verify if the IP is legitimate.   If NOT, please block the dst ip\n';
            }
            desc += comment;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function CSAlertHandler(...kwargs) {
    let { rawLog } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    function parseCefLog(rawLog) {
        function cefToJson(cefLog) {
            let json = {};
            let fields = cefLog.split(' ');

            for (let i = 0; i < fields.length; i++) {
                let field = fields[i].split('=');
                let key = field[0];
                let value = field.slice(1).join('=');

                if (value) {
                    if (key === 'filePath' || key === 'msg' || key === 'cs5' || key === 'start' || key === 'rt') {
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
                    raw_alert += 1;
                    acc.push({
                        CreateTime: cef_log[0].split(' localhost ')[0],
                        Summary: cef_log_header[4],
                        // for some like "server error" tickets
                        HostName: cef_log_extends.dhost ? cef_log_extends.dhost : cef_log_extends.dvchost,
                        HostIp: cef_log_extends.dst,
                        UserName: cef_log_extends.duser,
                        FileName: cef_log_extends.fname,
                        FilePath: cef_log_extends.filePath,
                        Command: cef_log_extends.cs5,
                        Sha256: cef_log_extends.fileHash,
                        Msg: cef_log_extends.msg,
                        CSLink: cef_log_extends.cs6 ? cef_log_extends.cs6 : cef_log_extends.cs1
                    });
                }
                return acc;
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }, []);
        return alertInfo;
    }

    const alertInfo = parseCefLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            const { Summary } = info;
            let desc = `Observed ${Summary}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && index != 'Summary' && index != 'CSLink') {
                    desc += `${index}: ${value}\n`;
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    function openCS() {
        let CSURL = '';
        let cs_url = [];
        for (const info of alertInfo) {
            const { CSLink } = info;
            if (CSLink && !cs_url.includes(CSLink)) {
                CSURL += `${CSLink.replace('hXXps', 'https').replace(/[\[\]]/g, '')}<br><br>`;
            }
            cs_url.push(CSLink);
        }
        showFlag('info', 'CS URL:', `${CSURL}`, 'manual');
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openCS', 'CS', openCS);
}

function SophosAlertHandler(...kwargs) {
    let { rawLog } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                log.replace(/[\[(].*?[\])]/g, '');
                const { sophos, logsource } = JSON.parse(log);
                raw_alert += 1;
                const summary = sophos.name;
                const createtime = sophos.rt.split('.')[0] + 'Z';
                const alertHost = sophos.dhost;
                const alertUser = sophos.suser;
                const alertID = sophos.id;
                const alertIP = sophos?.source_info?.ip || sophos?.data?.source_info?.ip || '';
                const alertExtraInfo = {
                    'Sha256': sophos.appSha256,
                    'Filename': sophos?.data?.fileName ? sophos.data.fileName : undefined,
                    'Processname': sophos?.data?.processName ? sophos.data.processName : undefined,
                    'Process': sophos?.data?.process ? sophos.data.process : undefined,
                    'Clean Up Result': sophos?.core_remedy_items?.items[0]?.result
                };
                acc.push({ summary, createtime, alertHost, alertIP, alertUser, alertID, logsource, alertExtraInfo });
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${info.summary}\nHost: ${info.alertHost} IP: ${info.alertIP || 'N/A'}\nUser: ${
                info.alertUser
            }\ncreatetime:(<span class="red_highlight">GMT</span>)${info.createtime}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            if (!info.summary.includes('Failed to protect computer')) {
                desc += '\n' + 'Please help to verify if this activity is legitimate.' + '\n';
            }
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    function openSophos() {
        let searchID = '';
        for (const info of alertInfo) {
            const { alertHost, alertID, logsource } = info;
            if (alertID || alertHost) {
                searchID += `<strong>[${logsource}] ${alertHost}</strong>:<br>${alertID}<br><br>`;
            }
        }
        showFlag('info', 'Host and Alert ID', `${searchID}`, 'manual');
        GM_openInTab('https://cloud.sophos.com/manage/enterprise/alerts-list', {
            active: false, // 设置为 false，以在后台打开，不激活新标签页
            insert: true // 设置为 true，将新标签页插入到当前标签页之后
        });
    }

    addButton('generateDescription', 'Description', generateDescription);
    addButton('openSophos', 'Open Sophos', openSophos);
}

function SpemAlertHandler(...kwargs) {
    const { rawLog, summary } = kwargs[0];

    function parseLog(rawLog) {
        let logObject = {};
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                logArray = log.split(',');
                logArray[10] = 'Action:' + logArray[10];
                for (const index of logArray) {
                    const [key, value] = index.split(/:(.+)/, 2);
                    logObject[key] = value;
                }
                acc.push({
                    'Summary': logObject['Event Description'] !== undefined ? logObject['Event Description'] : summary,
                    'User Name': logObject['User Name'],
                    'Local Host IP': logObject['Local Host IP'],
                    'Local Port': logObject['Local Port'],
                    'Remote Host IP': logObject['Remote Host IP'],
                    'Remote Port': logObject['Remote Port'],
                    'Application': logObject['Application'],
                    'SHA-256': logObject['SHA-256'],
                    'Intrusion URL': logObject['Intrusion URL'],
                    'Action': logObject['Action']
                });
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            let desc = `Observed ${info['Summary']}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && value !== ' ' && index != 'Summary') {
                    desc += `${index}: ${value}\n`;
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function AwsAlertHandler(...kwargs) {
    const { rawLog, summary } = kwargs[0];
    var raw_alert = 0;
    const DecoderName = $('#customfield_10807-val').text().trim().toLowerCase();
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { aws } = JSON.parse(log);
                if (DecoderName == 'aws-guardduty') {
                    let EventTime = aws.service.eventFirstSeen.split('.')[0] + 'Z';
                    const action = aws.service.action;
                    if (action && action.actionType == 'AWS_API_CALL') {
                        acc.push({
                            EventTime: EventTime,
                            actionType: action.actionType,
                            Api_Name: action?.awsApiCallAction?.api,
                            userName: aws?.resource?.accessKeyDetails?.userName,
                            RemoteIP: action?.awsApiCallAction?.remoteIpDetails?.ipAddressV4,
                            RemoteIP_country: action?.awsApiCallAction?.remoteIpDetails?.country.countryName
                        });
                    } else if (action && action.actionType == 'KUBERNETES_API_CALL') {
                        acc.push({
                            EventTime: EventTime,
                            actionType: action.actionType,
                            userName: aws?.resource?.accessKeyDetails?.userName,
                            sourceIPs: action?.kubernetesApiCallAction?.sourceIPs,
                            requestUri: action?.kubernetesApiCallAction?.requestUri
                        });
                    } else if (action && action.actionType == 'PORT_PROBE') {
                        acc.push({
                            EventTime: EventTime,
                            actionType: action.actionType,
                            localPort: action?.portProbeAction?.portProbeDetails.localPortDetails.port,
                            RemoteIP: action?.portProbeAction?.portProbeDetails.remoteIpDetails.ipAddressV4,
                            RemoteIP_country:
                                action?.portProbeAction?.portProbeDetails.remoteIpDetails.country.countryName
                        });
                    } else if (action && action.actionType == 'NETWORK_CONNECTION') {
                        acc.push({
                            EventTime: EventTime,
                            actionType: action.actionType,
                            localIp: action?.networkConnectionAction?.localIpDetails.ipAddressV4,
                            localPortDetails: action?.networkConnectionAction?.localPortDetails.port,
                            remoteIp: action?.networkConnectionAction?.remoteIpDetails.ipAddressV4,
                            remotePortDetails: action?.networkConnectionAction?.remotePortDetails.port,
                            instanceId: aws?.resource?.instanceDetails?.instanceId,
                            platform: aws?.resource?.instanceDetails?.platform,
                            remoteIpcountryName: action?.networkConnectionAction?.remoteIpDetails?.country?.countryName
                        });
                    } else if (aws.service.featureName == 'RuntimeMonitoring') {
                        console.log('===', aws.service);
                        let process = aws.service.runtimeDetails.process;
                        let data = {};
                        const uniqueSet = new Set();
                        if (Array.isArray(process.lineage)) {
                            process.lineage.forEach((item) => {
                                console.log('===', item);
                                if (!data['lineage']) {
                                    data['lineage'] = [];
                                }
                                const key = `${item.executablePath}-${item.userid}`;
                                if (uniqueSet.has(key)) return false;
                                uniqueSet.add(key);
                                data['lineage'].push({
                                    executablePath: item['executablePath'],
                                    name: item['name'],
                                    userid: item['userId']
                                });
                            });
                        } else {
                            data['lineage'] = [];
                            let lineage = process.lineage;
                            data['lineage'].push({
                                executablePath: lineage['executablePath'],
                                name: lineage['name'],
                                userid: lineage['userId']
                            });
                        }
                        acc.push({
                            EventTime: EventTime,
                            accountId: aws?.accountId,
                            resourceType: aws?.resource?.resourceType,
                            instanceId: aws?.resource?.instanceDetails?.instanceId,
                            instanceType: aws?.resource?.instanceDetails?.instanceType,
                            user: process.user,
                            pwd: process.pwd,
                            lineage: data['lineage']
                        });
                    }
                } else if (summary.toLowerCase().includes('multiple sms request for same source ip')) {
                    let headers = aws.logEvents.message.httpRequest.headers;
                    let host, content;
                    headers.forEach((item) => {
                        if (item.name === 'host') {
                            host = item.value;
                        }
                        if (item.name == 'content-type') {
                            content = item.value;
                        }
                    });
                    acc.push({
                        log_file: aws.log_info.log_file,
                        clientIp: aws.logEvents.message.httpRequest.clientIp,
                        httpMethod: aws.logEvents.message.httpRequest.httpMethod,
                        uri: aws.logEvents.message.httpRequest.uri,
                        host: host,
                        content_type: content
                    });
                } else {
                    acc.push({
                        EventTime: aws?.eventTime,
                        EventName: aws?.eventName,
                        SourceIP: aws?.sourceIPAddress || aws?.internal_ip,
                        ExternalIP: aws?.external_ip,
                        Domain: aws?.domain,
                        User: aws?.userIdentity?.arn,
                        UserAgent: aws?.userAgent,
                        PrincipalId: aws?.userIdentity?.principalId,
                        Result: aws?.errorCode,
                        QueryType: aws?.query_type,
                        Action: aws?.action,
                        requestParameters: JSON.stringify(aws?.requestParameters),
                        responseElements: JSON.stringify(aws?.responseElements)
                    });
                }
                raw_alert += 1;
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${summary.split(']')[1]}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (Array.isArray(info[index])) {
                    info[index].forEach((item) => {
                        desc += '\n';
                        for (let subKey in item) {
                            if (item.hasOwnProperty(subKey) && item[subKey] !== '') {
                                desc += `${subKey}: ${item[subKey]}\n`;
                            }
                        }
                    });
                } else if (value !== undefined && value !== ' ' && index != 'Summary') {
                    if (index == 'EventTime') {
                        desc += `EventTime(<span class="red_highlight">GMT</span>): ${value}\n`;
                    } else {
                        desc += `${index}: ${value}\n`;
                    }
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function AzureAlertHandler(...kwargs) {
    const { rawLog } = kwargs[0];

    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { eventhub, azure } = JSON.parse(log);
                const { ExtendedProperties, Entities } = eventhub;
                let entities = {};
                if (Entities) {
                    Entities.forEach(function (entity) {
                        if (entity.Type === 'host') {
                            entities['host'] = entity['HostName'];
                        }
                        if (entity.Type === 'network-connection') {
                            entities['SourceIP'] = entity['SourceAddress']['Address'];
                        }
                    });
                }
                acc.push({
                    AlertType: eventhub['AlertType'],
                    StartTimeUtc: eventhub['StartTimeUtc'],
                    Severity: eventhub['Severity'],
                    Intent: eventhub['Intent'],
                    Description: eventhub['Description'],
                    summary: azure['ThreatDescription'] || eventhub['AlertDisplayName'],
                    Protocol: azure['Protocol'],
                    SourceIP: azure['SourceIp'],
                    SourcePort: azure['SourcePort'],
                    DestinationIp: azure['DestinationIp'],
                    DestinationPort: azure['DestinationPort'],
                    URL: azure['Url'],
                    Action: azure['Action'],
                    ExtendedProperties: JSON.stringify(ExtendedProperties, null, 4),
                    ...entities,
                    alerturi: eventhub['AlertUri']
                });
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            let desc = `Observed ${info.summary}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && value !== '' && index !== 'summary') {
                    if (index == 'StartTimeUtc') {
                        desc += `StartTimeUtc(<span class="red_highlight">GMT</span>): ${value.split('.')[0]}\n`;
                    } else {
                        desc += `${index}: ${value}\n`;
                    }
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    function openAzure() {
        let AzureURL = '';
        for (const info of alertInfo) {
            const { alerturi } = info;
            if (alerturi) {
                AzureURL += `${alerturi.replace('hXXps', 'https').replace(/\[|\]/g, '')}<br><br>`;
            }
        }
        showFlag('info', 'Azure URL:', `${AzureURL}`, 'manual');
    }

    addButton('generateDescription', 'Description', generateDescription);
    addButton('openAzure', 'Azure', openAzure);
}

function paloaltoAlertHandler(...kwargs) {
    const { rawLog, summary } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                let logArray = log.split(',');
                let logType = logArray[3];
                if (logType == 'GLOBALPROTECT') {
                    acc.push({
                        'Createtime': logArray[1],
                        'src ip': logArray[15],
                        'user': logArray[12]
                    });
                }
                if (logType == 'TRAFFIC') {
                    acc.push({
                        'Createtime': logArray[1],
                        'Summary': summary.split(']')[1],
                        'Source IP': logArray[7],
                        'Destination IP': logArray[8],
                        'Destination Port': logArray[25],
                        'Destination Location': logArray[42] != 0 ? logArray[42] : logArray[39]
                    });
                }
                if (logType == 'THREAT') {
                    let really = false,
                        malware_potential = [];
                    for (let i = 0; i < logArray.length; i++) {
                        if (logArray[i].includes('"') && i > 100) {
                            if (really) {
                                malware_potential.push(logArray[i]);
                            }
                            really = !really;
                        }
                        if (really) {
                            malware_potential.push(logArray[i]);
                        }
                    }
                    let vt_url = 'https://www.virustotal.com/gui/search/' + logArray[31].replace('"', '').split('/')[0];
                    let description = `</br>Timestamp: ${logArray[0].split(' ').slice(0, 3).join(' ')}</br>
Device: ${logArray[0].split(' ').slice(3, 5).join(' ')}</br>
Log Details:
    <ul><li>Event Time: ${logArray[1]}</li>
    <li>Log ID: ${logArray[2]}</li>
    <li>Type: ${logArray[3]}(${logArray[4]})</li>
    <li>Severity: ${logArray[34]}</li>
    <li>Rule Triggered: ${logArray[11]}</li>
    <li>Vulnerability: ${logArray[32]}</li>
    <li>Threat ID: ${logArray[34]}</li></ul>
Network Information:
    <ul><li>Source IP: ${logArray[7]}</li>
    <li>Destination IP: ${logArray[8]}</li>
    <li>URL/filename : ${logArray[31]}</li>
    <li>VT : <a href="${vt_url}">${vt_url}</a></li>
    <li>Source Zone: ${logArray[16]}</li>
    <li>Destination Zone: ${logArray[17]}</li>
    <li>Ingress Interface: ${logArray[18]}</li>
    <li>Egress Interface: ${logArray[19]}</li></ul>
Traffic Details:
    <ul><li>Protocol: ${logArray[29]}</li>
    <li>Application: ${logArray[14]}</li>
    <li>Direction: ${logArray[35]}</li>
    <li>Session ID: ${logArray[36]}</li></ul>
Vulnerability Information:</br>
    <ul><li>Exploit Type: ${logArray[69]}</li>
    <li>Attack Vector: ${logArray[111]}</li>
    <li>Affected Technology: ${logArray[112]},${logArray[113]}</li>
    <li>Malware Potential:${malware_potential}</li>
                                                    </ul>`;
                    raw_alert += 1;
                    acc.push(description);
                }
            } catch (error) {
                console.error(`Error:${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let arr = summary.split(']');
            let desc = `Observed ${arr[arr.length - 1]}\n`;
            if (typeof info == 'string') {
                desc += info;
            } else {
                Object.entries(info).forEach(([index, value]) => {
                    if (value !== undefined && value !== '' && index !== 'Summary') {
                        desc += `${index}: ${value}\n`;
                    }
                });
            }
            let comment = '\nPlease help to verify if this activity is legitimate.\n</br>';
            if (summary.toLowerCase().includes('to malware ip(s)') || summary.toLowerCase().includes('to tor ip(s)')) {
                comment = '\nPlease verify if the IP is legitimate.   If NOT, please block the dst ip\n';
            }
            desc += comment;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function ImpervaincCEFAlertHandler(...kwargs) {
    const { rawLog } = kwargs[0];

    function parseCefLog(rawLog) {
        function cefToJson(cefLog) {
            let json = {};
            let fields = cefLog.split(' ');

            for (let i = 0; i < fields.length; i++) {
                let field = fields[i].split('=');
                let key = field[0];
                let value = field.slice(1).join('=');

                if (value) {
                    if (key === 'filePath' || key === 'msg' || key === 'start' || key === 'rt' || key === 'cs1') {
                        let nextFieldIndex = i + 1;
                        while (nextFieldIndex < fields.length && !fields[nextFieldIndex].includes('=')) {
                            value += ' ' + fields[nextFieldIndex];
                            nextFieldIndex++;
                        }
                    }
                    if (value == 'n/a') {
                        json[key] = undefined;
                    } else {
                        json[key] = value;
                    }
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
                    let createtime = cef_log[0].split('CEF:')[0];
                    // Parsing CEF Header
                    const cef_log_header = cef_log.slice(1, 7);
                    // Parsing CEF Extends
                    const cef_log_extends = cefToJson(cef_log[7]);

                    acc.push({
                        summary: cef_log_extends.cs1,
                        // for some like "server error" tickets
                        createtime: createtime,
                        username: cef_log_extends.duser,
                        srcIP: cef_log_extends.src,
                        dstIP: cef_log_extends.dst,
                        dstPort: cef_log_extends.dpt,
                        protocol: cef_log_extends.proto
                    });
                }
                return acc;
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }, []);
        return alertInfo;
    }
    const alertInfo = parseCefLog(rawLog);

    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const { summary } = info;
            let desc = `Observed ${summary}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && index != 'summary' && index != 'CBlink') {
                    desc += `${index}: ${value}\n`;
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function AzureGraphAlertHandler(...kwargs) {
    const { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    if (summary.toLowerCase().includes('successful azure/o365 login from malware-ip')) {
        return;
    }
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { azure } = JSON.parse(log);
                let properties = {};
                raw_alert += 1;
                if (azure.targetResources) {
                    for (const resource of azure.targetResources) {
                        if (summary.toLowerCase().includes('conditional access policy updated')) {
                            const { initiatedBy, targetResources, activityDateTime, activityDisplayName, result } =
                                azure;

                            const alertExtraInfo = {
                                userPrincipalName: initiatedBy?.user?.userPrincipalName
                                    ? initiatedBy?.user?.userPrincipalName
                                    : undefined,
                                displayName: targetResources[0]?.displayName
                                    ? targetResources[0]?.displayName
                                    : undefined,
                                activityDateTime: activityDateTime ? activityDateTime : undefined,
                                activityDisplayName: activityDisplayName ? activityDisplayName : undefined,
                                result: result ? result : undefined
                            };
                            acc.push({ alertExtraInfo });
                        } else {
                            if (resource.type == 'User') {
                                const resourceProperties = { TargetUser: resource.userPrincipalName };
                                properties = { ...properties, ...resourceProperties };
                            }
                            for (const prop of resource.modifiedProperties) {
                                properties = { ...properties, [prop['displayName']]: prop['newValue'] };
                            }
                            const activityDateTime = azure.activityDateTime.split('.')[0] + 'Z';
                            acc.push({
                                activityDateTime: activityDateTime,
                                AppDisplayName: azure?.appDisplayName || azure?.initiatedBy?.app?.displayName,
                                SourceUser: azure?.userPrincipalName || azure?.initiatedBy?.user?.userPrincipalName,
                                IpAddress: azure?.ipAddress || azure?.initiatedBy?.user?.ipAddress,
                                Location:
                                    azure?.location?.countryOrRegion && azure?.location?.state && azure?.location?.city
                                        ? `${azure?.location?.countryOrRegion}\\${azure?.location?.state}\\${azure?.location?.city}`
                                        : undefined,
                                ...properties,
                                Result: azure?.status?.failureReason || azure.result,
                                AdditionalInfo: azure?.additionalDetails[0]?.value
                                    ? azure?.additionalDetails[0]?.value
                                    : undefined
                            });
                        }
                    }
                } else {
                    const activityDateTime = azure.createdDateTime;
                    acc.push({
                        activityDateTime: activityDateTime,
                        AppDisplayName: azure?.appDisplayName || azure?.initiatedBy?.app?.displayName,
                        SourceUser: azure?.userPrincipalName || azure?.initiatedBy?.user?.userPrincipalName,
                        IpAddress: azure?.ipAddress || azure?.initiatedBy?.user?.ipAddress,
                        Location:
                            azure?.location?.countryOrRegion && azure?.location?.state && azure?.location?.city
                                ? `${azure?.location?.countryOrRegion}\\${azure?.location?.state}\\${azure?.location?.city}`
                                : undefined,
                        ...properties,
                        DeviceName: azure.deviceDetail.displayName || 'N/A',
                        failureReason: azure?.status?.failureReason || azure.result
                    });
                }
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        if (summary.toLowerCase().includes('conditional access policy updated')) {
            for (const info of alertInfo) {
                console.log(info['alertExtraInfo']['userPrincipalName']);
                let desc = `Observed  the user "${
                    info['alertExtraInfo']['userPrincipalName']
                }" was on (<span class="red_highlight">GMT</span>)${
                    info['alertExtraInfo']['activityDateTime'].split('.')[0]
                }ZS Updated the conditional access policy "${info['alertExtraInfo']['displayName']}"\n\n`;
                for (const key in info.alertExtraInfo) {
                    if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                        const value = info.alertExtraInfo[key];
                        if (
                            value !== undefined &&
                            key != 'userPrincipalName' &&
                            key != 'displayName' &&
                            key != 'activityDateTime'
                        ) {
                            desc += `${key}: ${value}\n`;
                        }
                    }
                }
                desc += `\nIt is recommended that you verify that the user has permission to change the conditional access policy and that the action is a legitimate update known to the user. Thanks!\n`;
                alertDescriptions.push(desc);
            }
        } else {
            for (const info of alertInfo) {
                let desc = `Observed ${summary.split(']')[1]}\n`;
                console.log(info);
                for (const key in info) {
                    if (Object.hasOwnProperty.call(info, key)) {
                        const value = info[key];
                        if (value !== undefined && value !== '' && key != 'summary' && key != 'alerturi') {
                            if (key == 'activityDateTime') {
                                desc += `activityDateTime(<span class="red_highlight">GMT</span>): ${value}\n`;
                            } else {
                                desc += `${key}: ${value}\n`;
                            }
                        }
                    }
                }
                desc += `\nPlease verify if the activity is legitimate.\n`;
                alertDescriptions.push(desc);
            }
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function ProofpointAlertHandler(...kwargs) {
    const { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const BraceIndex = log.toString().indexOf('{');
                const lastBraceIndex = log.toString().lastIndexOf('}');
                // If the braces are found
                if (BraceIndex !== -1) {
                    raw_alert += 1;
                    console.log(`${raw_alert} iteration 'is being processed`);
                    // Intercepts a substring from the beginning of the brace to the end of the string
                    json_text = log.toString().substr(BraceIndex, lastBraceIndex);
                    try {
                        let json_alert = JSON.parse(json_text);
                        if (json_alert.hasOwnProperty('messagesDelivered')) {
                            for (const message of json_alert['messagesDelivered']) {
                                const { subject, sender, senderIP, recipient } = message;
                                const alertExtraInfo = {
                                    subject: subject ? subject : undefined,
                                    sender: sender ? sender : undefined,
                                    recipient: recipient ? recipient : undefined,
                                    senderIP: senderIP ? senderIP : undefined
                                };
                                acc.push({ alertExtraInfo });
                            }
                        } else if (json_alert['sourcetype'].includes('clicksPermitted')) {
                            json_alert['clickTime'] = json_alert['clickTime'].split('.')[0];
                            json_alert['threatTime'] = json_alert['threatTime'].split('.')[0];
                            acc.push({ alertExtraInfo: json_alert });
                            console.log('hellO');
                        } else {
                            const {
                                subject,
                                sender,
                                senderIP,
                                recipient,
                                headerFrom,
                                messageTime,
                                threatsInfoMap,
                                sourcetype,
                                spamScore,
                                phishScore,
                                cluster,
                                completelyRewritten,
                                id,
                                QID,
                                GUID
                            } = json_alert;
                            let alertExtraInfo = {
                                sourcetype: sourcetype ? sourcetype : undefined,
                                messageTime: messageTime ? messageTime : undefined,
                                subject: subject ? subject : undefined,
                                senderIP: senderIP ? senderIP : undefined,
                                sender: sender ? sender : undefined,
                                recipient: recipient ? recipient : undefined,
                                headerFrom: headerFrom ? headerFrom : undefined,
                                spamScore: spamScore ? spamScore : undefined,
                                phishScore: phishScore ? phishScore : undefined,
                                cluster: cluster ? cluster : undefined,
                                completelyRewritten: completelyRewritten ? completelyRewritten : undefined,
                                id: id ? id : undefined,
                                QID: QID ? QID : undefined,
                                GUID: GUID ? GUID : undefined
                            };
                            alertExtraInfo = Object.assign({}, alertExtraInfo, threatsInfoMap[0]);
                            acc.push({ alertExtraInfo });
                        }
                    } catch (error) {
                        console.log('Unable to parse JSON data, handling exception: ' + error);
                        var split_str = json_text
                            .split('"messagesDelivered" :')[1]
                            .split('"messagesBlocked" :')[0]
                            .slice(1, -2);
                        const json_alerts = JSON.parse(split_str);
                        for (const alert of json_alerts) {
                            const { subject, sender, senderIP, recipient } = alert;
                            console.log(subject, recipient);
                            const alertExtraInfo = {
                                subject: subject ? subject : undefined,
                                sender: sender ? sender : undefined,
                                recipient: recipient ? recipient : undefined,
                                senderIP: senderIP ? senderIP : undefined
                            };
                            acc.push({ alertExtraInfo });
                        }
                    }
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    console.log('reduce the methods iterated altogether' + num_alert + ' times');
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${summary.split(']')[1]}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        if (key == 'messageTime' || key == 'clickTime' || key == 'threatTime') {
                            desc += `${key}(<span class="red_highlight">GMT</span>): ${value.split('.')[0]}\n`;
                        } else {
                            desc += `${key}: ${value}\n`;
                        }
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function ZscalerAlertHandler(...kwargs) {
    const { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const BraceIndex = log.toString().indexOf('{');
                const lastBraceIndex = log.toString().lastIndexOf('}');

                // If the braces are found
                if (BraceIndex !== -1) {
                    raw_alert += 1;
                    // Intercepts a substring from the beginning of the brace to the end of the string
                    json_text = log.toString().substr(BraceIndex, lastBraceIndex);
                    const json_alert = JSON.parse(json_text);
                    const { PrivateIP, PublicIP, Username, Customer, Hostname } = json_alert;
                    const alertExtraInfo = {
                        Hostname: Hostname ? Hostname : undefined,
                        PublicIP: PublicIP ? PublicIP : undefined,
                        PrivateIP: PrivateIP ? PrivateIP : undefined,
                        Username: Username ? Username : undefined,
                        Customer: Customer ? Customer : undefined
                    };
                    acc.push({ alertExtraInfo });
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${summary.split(']')[1]}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease verify if the ip is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n'); //Can achieve automatic deduplication
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function PulseAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    if (rawLog == '') {
        var rawLog = $('#customfield_10219-val').text().trim().split('\n');
    }
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.includes('PulseSecure')) {
                    var firstIndex = log.indexOf('PulseSecure:');
                    let time_text = '';
                    if (summary.toLowerCase().includes('suspicious geolocation ip login success')) {
                        time_text = log.toString().substr(0, firstIndex);
                    } else {
                        time_text = log.toString().substr(firstIndex + 13);
                        const first_bar = time_text.indexOf(':');
                        time_text = time_text.toString().substr(0, first_bar + 6);
                    }
                    const lastIndex = log.toString().lastIndexOf('Vendor)');
                    let alert_text = log
                        .toString()
                        .substr(lastIndex + 7)
                        .replace('[][] -', '');
                    const lastIndex_ = alert_text.toString().lastIndexOf(' - ');
                    alert_text = alert_text.substr(lastIndex_ + 2);
                    let first = log.indexOf('- ');
                    let second = log.indexOf(' - [');
                    let vpn_name = log.toString().substring(first + 2, second) + ' ';
                    const alert_content = '\n' + vpn_name + alert_text + ' On ' + time_text + '\n';
                    acc.push(alert_content);
                    raw_alert += 1;
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        let desc = `Observed ${summary.split(']')[1]}\n`;
        desc += alertInfo;
        desc += `\n\nPlease verify if the login is legitimate.\n`;
        alertDescriptions.push(desc);
        const alertMsg = [...new Set(alertDescriptions)].join('\n'); //Can achieve automatic deduplication
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function Risky_Countries_AlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const json_alert = JSON.parse(log);
                if (json_alert.hasOwnProperty('azure')) {
                    const {
                        createdDateTime,
                        userDisplayName,
                        userPrincipalName,
                        ipAddress,
                        appDisplayName,
                        deviceDetail,
                        status
                    } = json_alert['azure'];
                    const { failureReason, additionalDetails } = status;
                    const { displayName, operatingSystem } = deviceDetail;

                    const alertExtraInfo = {
                        createdEventDateTime: createdDateTime ? createdDateTime : undefined,
                        userDisplayName: userDisplayName ? userDisplayName : undefined,
                        userPrincipalName: userPrincipalName ? userPrincipalName : undefined,
                        appDisplayName: appDisplayName ? appDisplayName : undefined,
                        ipAddress: ipAddress ? ipAddress : undefined,
                        operatingSystem: operatingSystem ? operatingSystem : undefined,
                        DeviceName: displayName ? displayName : 'N/A',
                        failureReason: failureReason ? failureReason : undefined,
                        additionalDetails: additionalDetails ? additionalDetails : undefined
                    };
                    acc.push({ alertExtraInfo });
                }
                if (json_alert.hasOwnProperty('office_365')) {
                    let alertExtraInfo;
                    if (json_alert['office_365'].hasOwnProperty('Data')) {
                        console.log(JSON.parse(json_alert['office_365']['Data']));
                        let data = JSON.parse(json_alert['office_365']['Data']);
                        alertExtraInfo = {
                            CreationEventTime: data['wsrt'] ? data['wsrt'] : undefined,
                            Username: data['f3u'] ? data['f3u'] : undefined,
                            Workload: data['wl'] ? data['wl'] : undefined,
                            Reason: data['ad'] ? data['ad'] : undefined
                        };
                    } else if (!json_alert['office_365'].hasOwnProperty('ClientIP')) {
                        let data = json_alert['office_365'];
                        alertExtraInfo = {
                            CreationEventTime: data['CreationTime'] ? data['CreationTime'] : undefined,
                            Operation: data['Operation'] ? data['Operation'] : undefined,
                            ResultStatus: data['ResultStatus'] ? data['ResultStatus'] : undefined,
                            UserId: data['UserId'] ? data['UserId'] : undefined,
                            ObjectId: data['ObjectId'] ? data['ObjectId'] : undefined,
                            UserKey: data['UserKey'] ? data['UserKey'] : undefined
                        };
                    } else {
                        const {
                            CreationTime,
                            Operation,
                            Workload,
                            ClientIP,
                            UserId,
                            ResultStatusDetail,
                            UserAgent,
                            ActorIpAddress,
                            DeviceProperties,
                            UserKey
                        } = json_alert['office_365'];

                        let devicename = '';
                        DeviceProperties.forEach((item) => {
                            if (item.Name === 'DisplayName') {
                                devicename = item.Value;
                            }
                        });
                        alertExtraInfo = {
                            CreationEventTime: CreationTime ? CreationTime : undefined,
                            Operation: Operation ? Operation : undefined,
                            Workload: Workload ? Workload : undefined,
                            UserId: UserId ? UserId : undefined,
                            ClientIP: ClientIP ? ClientIP : undefined,
                            ActorIpAddress: ActorIpAddress ? ActorIpAddress : undefined,
                            UserAgent: UserAgent ? UserAgent : undefined,
                            DeviceName: devicename ? devicename : 'N/A',
                            UserKey: UserKey ? UserKey : undefined,
                            ResultStatusDetail: ResultStatusDetail ? ResultStatusDetail : undefined
                        };
                    }

                    acc.push({ alertExtraInfo });
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        console.log(alertInfo);
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');

            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        if (key == 'CreationEventTime') {
                            desc += `CreationEventTime(<span class="red_highlight">GMT</span>): ${value}\n`;
                        } else {
                            desc += `${key}: ${value}\n`;
                        }
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function Agent_Disconnect_AlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    let LogSource = $('#customfield_10204-val').text().trim().split('\n');
    if (LogSource.length == 1 && LogSource[0] == '') {
        LogSource = $('#customfield_10854-val').text().trim().split('\n');
    }
    function parseLog(LogSource) {
        const alertInfo = LogSource.reduce((acc, log) => {
            try {
                log = log.replace(/\s/g, '');
                if (log == 'Show' || log == 'Hide' || log.length == 0) {
                    console.log('ss');
                } else {
                    acc.push(log);
                    console.log(log);
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    let alertInfo = [...new Set(parseLog(LogSource))];
    function generateDescription() {
        const alertDescriptions = [];

        const lastindex = summary.lastIndexOf(']');
        let desc = `Observed ${summary.substr(lastindex + 1)}, kindly please help to check it.\n`;
        desc += `\nagent name:  ${alertInfo.join(',')}`;
        alertDescriptions.push(desc);
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    function openMDE() {
        let KQL = '';
        KQL += `name=${alertInfo.join(' or name=')} \n`;
        showFlag('info', 'KQL:', `${KQL}`, 'manual');
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openKQL', 'KQL', openMDE);
}

function MdbAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    if (rawLog.length == 0 || rawLog.length == 1) {
        rawLog = $('#customfield_10219-val').text().trim().split('\n');
    }
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.length == 0) {
                    return acc;
                }
                if (summary.toLowerCase().includes('syslog: user missed the password more than one time')) {
                    let log_ = log.split(';')[1].split(' ');
                    let time_host = log.split(' sshd')[0].split(' ');
                    let user = '';
                    if (log_.length > 7) {
                        user = log_[8].split('=')[1];
                    }
                    let description = `Observed user<span class='black_highlight'> ${user}</span> multiple ssh login failed from ${
                        log_[6].split('=')[1]
                    }\nCreateTime: ${time_host
                        .slice(0, time_host.length - 1)
                        .join(' ')}\nHostname: <span class='black_highlight'> ${
                        time_host[time_host.length - 1]
                    }</span>\n`;

                    acc.push(description);
                }
                if (summary.toLowerCase().includes('sshd: insecure connection attempt')) {
                    let log_ = log.split(' ');
                    console.log('log', log_);
                    let description = `Observed insecure connection attempt from ${
                        log_[log_.length - 3]
                    }\nCreateTime: ${log_.slice(0, log_.length - 11).join(' ')}\n`;
                    acc.push(description);
                }
                if (
                    summary
                        .toLowerCase()
                        .includes('anomaly: suspected lateral movement - linux containing session opened')
                ) {
                    let log_ = log.split('>')[1] + '\n';
                    console.log('log', log_);
                    acc.push(log_);
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        if (summary.toLowerCase().includes('anomaly: suspected lateral movement - linux containing session opened')) {
            const Log_source = $('#customfield_10204-val').text().trim();
            alertDescriptions.push(`Observed  session opened on <span class='black_highlight'>${Log_source}</span>\n`);
        }
        for (const info of alertInfo) {
            alertDescriptions.push(info);
        }
        if (summary.toLowerCase().includes('sshd: insecure connection attempt')) {
            alertDescriptions.push('Kindly help to verify if the connection is legitimate\n');
        }
        if (summary.toLowerCase().includes('syslog: user missed the password more than one time')) {
            alertDescriptions.push('Kindly help to verify if the login is legitimate\n');
        }
        if (summary.toLowerCase().includes('anomaly: suspected lateral movement - linux containing session opened')) {
            alertDescriptions.push('Kindly help to verify if the session is legitimate\n');
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function AlicloudAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const BraceIndex = log.toString().indexOf('{');
                const lastBraceIndex = log.toString().lastIndexOf('}');
                if (BraceIndex !== -1) {
                    raw_alert += 1;
                    // Intercepts a substring from the beginning of the brace to the end of the string
                    json_text = log.toString().substr(BraceIndex, lastBraceIndex);
                    let time_1 = log.toString().substr(0, BraceIndex).split(' ');
                    let time = time_1.slice(time_1.length - 4, time_1.length - 2).join(' ');
                    time = time_1[0] + ' ' + time;
                    try {
                        const json_alert = JSON.parse(json_text);
                        let {
                            eventId,
                            uuid,
                            eventName,
                            resourceName,
                            sourceIpAddress,
                            userIdentity,
                            intranet_ip,
                            internet_ip,
                            instance_id,
                            extend_content,
                            detail,
                            requestParameters,
                            responseElements
                        } = json_alert['alicloud'];
                        let alertExtraInfo = {
                            createTime: time,
                            eventId: eventId ? eventId : undefined,
                            uuid: uuid ? uuid : undefined,
                            eventName: eventName ? eventName : undefined,
                            InstanceId: resourceName ? resourceName : undefined,
                            sourceIpAddress: sourceIpAddress ? sourceIpAddress : undefined,
                            userName: userIdentity?.userName ? userIdentity?.userName : undefined,
                            internet_ip: internet_ip ? internet_ip : undefined,
                            intranet_ip: intranet_ip ? intranet_ip : undefined,
                            instance_id: instance_id ? instance_id : undefined,
                            extend_content: extend_content ? extend_content : undefined,
                            responseElements: responseElements ? JSON.stringify(responseElements) : undefined
                        };
                        console.log('===', requestParameters, time);

                        if (detail != undefined) {
                            detail = JSON.parse(detail);
                            alertExtraInfo = Object.assign({}, alertExtraInfo, detail);
                        }
                        if (requestParameters != undefined) {
                            alertExtraInfo = Object.assign({}, alertExtraInfo, requestParameters);
                        }

                        console.log(alertExtraInfo);
                        acc.push({ alertExtraInfo });
                    } catch (error) {
                        console.log('Unable to parse JSON data, handling exception: ' + error);
                    }
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function DstAlertHandler(...kwargs) {
    var rawLog = $('#field-customfield_10904').text().trim().split('\n');
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const json_alert = JSON.parse(log);
                const { system, eventdata } = json_alert['win'];
                const alertExtraInfo = {
                    computer: system?.computer ? system?.computer : undefined,
                    commandLine: eventdata?.commandLine ? eventdata?.commandLine : undefined
                };
                acc.push({ alertExtraInfo });
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            let desc = ``;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function ThreatMatrixAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const json_alert = JSON.parse(log);
                console.log(json_alert['threatmatrix']);
                const {
                    account_telephone,
                    account_login,
                    application_name,
                    customer_event_type,
                    input_ip_address,
                    event_datetime,
                    input_ip_city,
                    input_ip_geo,
                    input_ip_isp,
                    input_ip_organization,
                    policy,
                    tmx_risk_rating,
                    request_result
                } = json_alert['threatmatrix'];
                const alertExtraInfo = {
                    account_telephone: account_telephone ? account_telephone : undefined,
                    account_login: account_login ? account_login : undefined,
                    application_name: application_name ? application_name : undefined,
                    customer_event_type: customer_event_type ? customer_event_type : undefined,
                    input_ip_address: input_ip_address ? input_ip_address : undefined,
                    input_ip_city: input_ip_city ? input_ip_city : undefined,
                    input_ip_geo: input_ip_geo ? input_ip_geo : undefined,
                    input_ip_isp: input_ip_isp ? input_ip_isp : undefined,
                    input_ip_organization: input_ip_organization ? input_ip_organization : undefined,
                    policy: policy ? policy : undefined,
                    tmx_risk_rating: tmx_risk_rating ? tmx_risk_rating : undefined,
                    request_result: request_result ? request_result : undefined,
                    event_datetime: event_datetime ? event_datetime.split('.')[0] : undefined
                };
                acc.push({ alertExtraInfo });
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease verify if the login is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function DarktraceAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    var breach_Url;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const BraceIndex = log.toString().indexOf('{');
                const lastBraceIndex = log.toString().lastIndexOf('}');
                const logarray = log.toString().split(' ');
                if (BraceIndex !== -1) {
                    raw_alert += 1;
                    // Intercepts a substring from the beginning of the brace to the end of the string
                    json_text = log.toString().substr(BraceIndex, lastBraceIndex);
                    const json_alert = JSON.parse(json_text);
                    let alertExtraInfo = {},
                        Resource_paths = [];
                    breach_Url = json_alert['breachUrl'] + '<br>' + json_alert['incidentEventUrl'];
                    let year = ' 20' + $('#created-val').text().trim().split('/')[2].split(' ')[0]; //动态产生工单的年份
                    let time_str = logarray.slice(0, 3).join(' ') + year;
                    if (!time_str.includes(':')) {
                        time_str = logarray.slice(0, 4).join(' ').replace('  ', ' ') + year;
                    }

                    if (json_alert.hasOwnProperty('model')) {
                        const { device, triggeredComponents, model } = json_alert;
                        let User_agent = '',
                            Message;
                        alertExtraInfo = {
                            AlertTime: formatCurrentDateTime(time_str),
                            hostname: device?.hostname ? device?.hostname : undefined,
                            ip: device?.ip ? device?.ip : undefined,
                            credentials: device?.credentials ? device?.credentials : undefined,
                            subnetlabel: device?.ips ? device?.ips[0].subnetlabel : undefined,
                            typename: device?.typename ? device?.typename : undefined,
                            User_agent: User_agent ? User_agent : undefined,
                            saas_info: device?.customFields?.saasinfo
                                ? device.customFields.saasinfo.saas_info
                                : undefined,
                            Message: Message ? Message : undefined,
                            description: model?.description ? model?.description.replace(/\\\n/g, ' ') : undefined
                        };
                        triggeredComponents[0]['triggeredFilters'].forEach((item) => {
                            if (item['filterType'] == 'User agent' && item['id'] == 'O') {
                                User_agent = item['arguments']['value'];
                                console.log('value', item['arguments']['value']);
                            } else if (item['id'] == 'C') {
                                Message = item['trigger']['value'];
                            } else if (
                                item['filterType'].includes('IP') ||
                                item['filterType'] == 'Resource Location' ||
                                item['filterType'] == 'Event' ||
                                item['filterType'] == 'Connection hostname'
                            ) {
                                alertExtraInfo[item['filterType']] = item['trigger']['value'];
                            }
                        });
                    } else {
                        const { summary, breachDevices, details } = json_alert;
                        let values;
                        alertExtraInfo = {
                            AlertTime: formatCurrentDateTime(time_str),
                            hostname: breachDevices[0]?.hostname ? breachDevices[0]?.hostname : undefined,
                            host_ip: breachDevices[0]?.ip ? breachDevices[0]?.ip : undefined,
                            summary: summary ? summary : undefined
                        };
                        details.forEach((item) => {
                            if (item[0].header == 'Endpoint Details') {
                                values = item[0].contents[0].values;
                                item[0].contents.forEach((i) => {
                                    if (i.key == 'IP addresses associated with hostnames') {
                                        console.log(i);
                                        alertExtraInfo[i.type] = JSON.stringify(i.values);
                                    }
                                });
                            }
                            item.forEach((ii) => {
                                alertExtraInfo[ii.header] = '--->';
                                if (
                                    ii.header == 'Activity Details' ||
                                    ii.header == 'Details of Accessing Users' ||
                                    ii.header == 'Resource Access Details'
                                ) {
                                    ii.contents.forEach((i) => {
                                        if (i['key'] == 'Resource paths include' || i['key'] == 'Resource path') {
                                            i['values'].forEach((iii) => {
                                                Resource_paths.push(iii);
                                            });
                                        } else if (
                                            i['key'].includes('Source IPs') ||
                                            i['key'].includes('Actors include')
                                        ) {
                                            alertExtraInfo[i.key] = JSON.stringify(i.values);
                                        }
                                    });
                                } else {
                                    ii.contents.forEach((i) => {
                                        if (i['type'] == 'device') {
                                            alertExtraInfo[i.key] = JSON.stringify(
                                                i.values.map(({ hostname, ip }) => ({
                                                    hostname,
                                                    ip
                                                }))
                                            );
                                        } else if (i['type'] != 'timestamp') {
                                            alertExtraInfo[i.key] = JSON.stringify(i.values);
                                        }
                                    });
                                }
                            });
                        });
                        Resource_paths = [...new Set(Resource_paths)].join('\n');
                        alertExtraInfo['Resource_paths'] = Resource_paths ? Resource_paths : undefined;
                        alertExtraInfo['Endpoint Details'] = values ? values : undefined;
                    }
                    acc.push({ alertExtraInfo });
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let ss = summary.substr(lastindex + 1).split('::');
            let desc = `Observed ${ss[ss.length - 1]}\n\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease help to verify if this activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    function breachUrl() {
        showFlag('info', 'breach Url:', `${breach_Url.replace('hXXps[:]', 'https:')}`, 'manual');
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('breachUrl', 'breachUrl', breachUrl);
}

function SangforAlertHandler(...kwargs) {
    var { summary, rawLog, LogSourceDomain, DecoderName } = kwargs[0];
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.length == 0) {
                    return acc;
                }
                const regex = /(\b\w+=)([^=\s].*?)(?=\s+\w+=|$)/g;
                let match;
                const matches = {};
                while ((match = regex.exec(log)) !== null) {
                    let item = match[0].split('=');
                    matches[item[0]] = item.slice(1, item.length).join('=');
                }
                console.log(matches);
                var pattern = /event_evidence.*?(?=suffer_classify1_id_name)/g;
                console.log(log.match(pattern));
                let logArray = log.split(' ').filter((item) => item !== ''); //Remove extra whitespace from the string
                if (DecoderName == 'cyberark_cef') {
                    let data_json = {
                        'Event time': logArray.slice(0, 3).join(' '),
                        'event_desc': matches.event_desc ? matches.event_desc : undefined,
                        'dhost': matches.dhost ? matches.dhost : undefined,
                        'dst': matches.dst ? matches.dst : undefined,
                        'duser': matches.duser ? matches.duser : undefined,
                        'shost': matches.shost ? matches.shost : undefined,
                        'src': matches.src ? matches.src : undefined,
                        'suser': matches.suser ? matches.suser : undefined
                    };
                    data_json[matches.cs3Label] = matches.cs3 ? matches.cs3 : undefined;
                    acc.push(data_json);
                } else if (DecoderName == 'trellix_cef') {
                    let data_json = {
                        filePath: matches.filePath ? matches.filePath : undefined,
                        rt: matches.rt ? matches.rt : undefined,
                        duser: matches.duser ? matches.duser : undefined,
                        msg: matches.msg ? matches.msg : undefined,
                        act: matches.act ? matches.act : undefined,
                        suser: matches.suser ? matches.suser.replace(/[<>]/g, '') : undefined,
                        fileType: matches.fileType ? matches.fileType : undefined,
                        subject: matches.subject ? matches.subject : undefined
                    };
                    data_json[matches.cs1Label] = matches.cs1 ? matches.cs1 : undefined;
                    data_json['Malicious_Domain'] = matches.cs5 ? matches.cs5 : undefined;
                    data_json[matches.flexString2Label] = matches.flexString2 ? matches.flexString2 : undefined;
                    acc.push(data_json);
                } else if (DecoderName == 'impervainc_cef') {
                    console.log('===', matches);
                    console.log('===start ', formatCurrentDateTime(parseInt(matches.start), 'impervainc_cef'));
                    let data_json = {
                        start_time: matches.start
                            ? formatCurrentDateTime(parseInt(matches.start), 'impervainc_cef')
                            : undefined,
                        end_time: matches.end
                            ? formatCurrentDateTime(parseInt(matches.end), 'impervainc_cef')
                            : undefined,
                        dhost: matches.dhost ? matches.dhost : undefined,
                        AlertTime: matches.rt ? matches.rt : undefined,
                        src: matches.src ? matches.src : undefined,
                        sptPort: matches.spt ? matches.spt : undefined,
                        dstIP: matches.dst ? matches.dst : undefined,
                        dstPort: matches.dpt ? matches.dpt : undefined,
                        protocol: matches.proto ? matches.proto : undefined,
                        request: matches.request ? matches.request : undefined,
                        requestClientApplication: matches.requestClientApplication
                            ? matches.requestClientApplication
                            : undefined,
                        msg: matches.msg ? matches.msg : undefined
                    };
                    data_json[matches.cs1Label] = matches.cs1 ? matches.cs1 : undefined;
                    data_json[matches.cs2Label] = matches.cs2 ? matches.cs2 : undefined;
                    data_json[matches.cs3Label] = matches.cs3 ? matches.cs3 : undefined;
                    data_json[matches.cs4Label] = matches.cs4 ? matches.cs4 : undefined;
                    data_json[matches.cs5Label] = matches.cs5 ? matches.cs5 : undefined;
                    data_json[matches.cs6Label] = matches.cs6 ? matches.cs6 : undefined;
                    data_json[matches.cs7Label] = matches.cs7 ? matches.cs7 : undefined;
                    data_json[matches.cs8Label] = matches.cs8 ? matches.cs8 : undefined;
                    data_json[matches.cs9Label] = matches.cs9 ? matches.cs9 : undefined;

                    acc.push(data_json);
                } else if (DecoderName == 'sangfor') {
                    let data_json = {
                        'Event time': logArray.slice(0, 3).join(' '),
                        'act': matches.act ? matches.act : undefined,
                        'dst': matches.dst ? matches.dst : undefined,
                        'src': matches.src ? matches.src : undefined,
                        'Request': matches.Request ? matches.Request.replace(/\[\.\]/g, '.') : undefined
                    };
                    let vt_domain = 'https://www.virustotal.com/gui/domain/' + matches.Request.replace(/\[\.\]/g, '.');
                    data_json['vt'] = `<a href="${vt_domain}">${vt_domain}</a>`;
                    acc.push(data_json);
                } else if (DecoderName == 'checkpoint_cef') {
                    let data_json = {
                        Signature: matches.Signature ? matches.Signature : undefined,
                        cp_severity: matches.cp_severity ? matches.cp_severity : undefined,
                        src: matches.src ? matches.src : undefined,
                        dst: matches.dst ? matches.dst : undefined,
                        origin: matches.origin ? matches.origin : undefined
                    };
                    data_json[matches.cs2Label] = matches.cs2 ? matches.cs2 : undefined;
                    data_json[matches.cs3Label] = matches.cs3 ? matches.cs3 : undefined;
                    data_json[matches.cs4Label] = matches.cs4 ? matches.cs4 : undefined;
                    data_json[matches.flexNumber1Label] = matches.flexNumber1 ? matches.flexNumber1 : undefined;
                    data_json[matches.flexNumber2Label] = matches.flexNumber2 ? matches.flexNumber2 : undefined;
                    data_json[matches.flexString2Label] = matches.flexString2 ? matches.flexString2 : undefined;
                    acc.push(data_json);
                } else if (DecoderName == 'incapsula_cef') {
                    let data_json = {
                        requestClientApplication: matches.requestClientApplication
                            ? matches.requestClientApplication
                            : undefined,
                        request: matches.request ? matches.request : undefined,
                        requestMethod: matches.requestMethod ? matches.requestMethod : undefined,
                        postbody: matches.postbody ? matches.postbody : undefined,
                        qstr: matches.qstr ? matches.qstr : undefined,
                        act: matches.act ? matches.act : undefined,
                        sip: matches.sip ? matches.sip : undefined,
                        spt: matches.spt ? matches.spt : undefined,
                        xff: matches.xff ? matches.xff : undefined,
                        cpt: matches.cpt ? matches.cpt : undefined,
                        src: matches.src ? matches.src : undefined
                    };
                    data_json[matches.cs9Label] = matches.cs9 ? matches.cs9 : undefined;
                    acc.push(data_json);
                } else if (window.location.href.includes('macaumss')) {
                    acc.push({
                        'Event time': logArray.slice(0, 3).join(' '),
                        'event_desc': matches.event_desc ? matches.event_desc : undefined,
                        'dev_name': matches.dev_name ? matches.dev_name : undefined,
                        'attack_ip': matches.attack_ip ? matches.attack_ip : undefined,
                        'suffer_ip': matches.suffer_ip ? matches.suffer_ip : undefined,
                        'suffer_port': matches.suffer_port ? matches.suffer_port : undefined,
                        'status_code': matches.status_code ? matches.status_code : undefined,
                        'x_forwarded_for': matches.x_forwarded_for ? matches.x_forwarded_for : undefined,
                        'event_evidence': log.match(pattern) ? log.match(pattern)[0] : undefined,
                        'attack_type_name': matches.attack_type_name ? matches.attack_type_name : undefined
                    });
                } else {
                    acc.push({
                        'Event time': logArray.slice(0, 3).join(' '),
                        'event_desc': matches.event_desc ? matches.event_desc : undefined,
                        'dev_name': matches.dev_name ? matches.dev_name : undefined,
                        'suffer_ip': matches.suffer_ip ? matches.suffer_ip : undefined,
                        'attack_ip': matches.attack_ip ? matches.attack_ip : undefined,
                        'event_evidence': matches.event_evidence ? matches.event_evidence : undefined,
                        'url': matches.url ? matches.url : undefined,
                        'suggest': matches.suggest ? matches.suggest : undefined
                    });
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const cachedMappingContent = GM_getValue('cachedMappingContent', null);
        const alertDescriptions = [];
        if (LogSourceDomain == cachedMappingContent['gga']) {
            alertDescriptions.push(`Log Details:\n`);
        }
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = '';
            if (summary.includes('-')) {
                desc += `Observed ${summary.substr(lastindex + 1).split('-')[1]}\n`;
            } else {
                desc += `Observed ${summary.substr(lastindex + 1)}\n`;
            }
            for (const key in info) {
                if (Object.hasOwnProperty.call(info, key)) {
                    const value = info[key];
                    if (value !== undefined) {
                        if (key == 'event_evidence') {
                            desc += `${key}: ${value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}\n`;
                        } else if (key == 'start_time' || key == 'end_time' || key == 'AlertTime') {
                            desc += `${key}(<span class="red_highlight">GMT+8</span>): ${value.split('.')[0]}\n`;
                        } else {
                            desc += `${key}: ${value}\n`;
                        }
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;

            alertDescriptions.push(desc);
        }
        if (LogSourceDomain == cachedMappingContent['gga']) {
            let kibana = $('#field-customfield_10308').text().trim().split(' ')[36];
            let newUrl = kibana.replace(
                /https:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
                'https://' + cachedMappingContent['gga_url']
            );
            alertDescriptions.push(`\n${newUrl}\n`);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function RadwareAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const json_alert = JSON.parse(log);
                const {
                    device_ip,
                    device_name,
                    device_abbr,
                    detected_by,
                    asset_name,
                    asset_type,
                    asset_ip,
                    account_uid,
                    account_name,
                    acc_site_name,
                    end_time,
                    start_time
                } = json_alert['radware'];

                alertExtraInfo = {
                    start_time: start_time._date_time ? start_time._date_time : undefined,
                    end_time: end_time._date_time ? end_time._date_time : undefined,
                    device_ip: device_ip ? device_ip : undefined,
                    device_name: device_name ? device_name : undefined,
                    device_abbr: device_abbr ? device_abbr : undefined,
                    detected_by: detected_by ? detected_by : undefined,
                    asset_name: asset_name ? asset_name : undefined,
                    asset_type: asset_type ? asset_type : undefined,
                    asset_ip: asset_ip ? asset_ip : undefined,
                    account_uid: account_uid ? account_uid : undefined,
                    account_name: account_name ? account_name : undefined,
                    acc_site_name: acc_site_name ? acc_site_name : undefined
                };
                acc.push({ alertExtraInfo });
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        if (key == 'start_time' || key == 'end_time') {
                            desc += `${key}(<span class="red_highlight">GMT</span>): ${value.split('.')[0] + 'Z'}\n`;
                        } else {
                            desc += `${key}: ${value}\n`;
                        }
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function CarbonAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const BraceIndex = log.toString().indexOf('{');
                const lastBraceIndex = log.toString().lastIndexOf('}');
                if (BraceIndex !== -1) {
                    json_text = log.toString().substr(BraceIndex, lastBraceIndex);
                    const json_alert = JSON.parse(json_text);
                    const {
                        reason,
                        device_os_version,
                        device_username,
                        device_location,
                        device_external_ip,
                        device_internal_ip,
                        device_name,
                        process_pid,
                        process_name,
                        process_sha256,
                        process_guid,
                        process_cmdline,
                        process_username,
                        netconn_remote_ip,
                        netconn_remote_port,
                        parent_guid,
                        parent_pid,
                        parent_name,
                        parent_sha256,
                        parent_username,
                        netconn_local_ip,
                        netconn_local_port,
                        first_event_timestamp
                    } = json_alert;
                    alertExtraInfo = {
                        EventTime: first_event_timestamp.split('.')[0],
                        device_name: device_name ? device_name : undefined,
                        device_os_version: device_os_version ? device_os_version : undefined,
                        device_username: device_username ? device_username : undefined,
                        device_location: device_location ? device_location : undefined,
                        device_external_ip: device_external_ip ? device_external_ip : undefined,
                        device_internal_ip: device_internal_ip ? device_internal_ip : undefined,
                        process_guid: process_guid ? process_guid : undefined,
                        process_pid: process_pid ? process_pid : undefined,
                        process_name: process_name ? process_name : undefined,
                        process_sha256: process_sha256 ? process_sha256 : undefined,
                        process_cmdline: process_cmdline ? process_cmdline : undefined,
                        process_username: process_username ? process_username : undefined,
                        parent_guid: parent_guid ? parent_guid : undefined,
                        parent_pid: parent_pid ? parent_pid : undefined,
                        parent_name: parent_name ? parent_name : undefined,
                        parent_sha256: parent_sha256 ? parent_sha256 : undefined,
                        parent_username: parent_username ? parent_username : undefined,
                        netconn_remote_ip: netconn_remote_ip ? netconn_remote_ip : undefined,
                        netconn_remote_port: netconn_remote_port ? netconn_remote_port : undefined,
                        netconn_local_ip: netconn_local_ip ? netconn_local_ip : undefined,
                        netconn_local_port: netconn_local_port ? netconn_local_port : undefined,
                        reason: reason ? reason : undefined
                    };
                    raw_alert += 1;
                    acc.push({ alertExtraInfo });
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (key == 'EventTime') {
                        desc += `EventTime(<span class="red_highlight">GMT</span>): ${value + 'Z'}\n`;
                    } else if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }

    addButton('generateDescription', 'Description', generateDescription);
}

function MultipleAccountAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const json_alert = JSON.parse(log)['win'];
                const { targetUserName, targetDomainName, subjectUserName, subjectDomainName, subjectLogonId } =
                    json_alert['eventdata'];
                const { systemTime, computer, message } = json_alert['system'];
                alertExtraInfo = {
                    Eventtime: systemTime ? systemTime : undefined,
                    computer: computer ? computer : undefined,
                    targetUserName: targetUserName ? targetUserName : undefined,
                    targetDomainName: targetDomainName ? targetDomainName : undefined,
                    subjectUserName: subjectUserName ? subjectUserName : undefined,
                    subjectDomainName: subjectDomainName ? subjectDomainName : undefined,
                    message: message ? message.split('\r\n\r\n')[0] : undefined
                };
                acc.push({ alertExtraInfo });
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        const single = [];
        const lastindex = summary.lastIndexOf(']');
        let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
        for (const info of alertInfo) {
            let desc_ = '',
                single_ = '';
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        if (key == 'Eventtime') {
                            desc_ += `${key}(<span class="red_highlight">GMT</span>): ${value.split('.')[0] + 'Z'}\n`;
                        } else if (
                            key == 'subjectUserName' ||
                            key == 'subjectDomainName' ||
                            key == 'computer' ||
                            key == 'message' ||
                            key == 'targetDomainName'
                        ) {
                            single_ += `${key}: ${value}\n`;
                        } else {
                            desc_ += `${key}: ${value}\n`;
                        }
                    }
                }
            }
            alertDescriptions.push(desc_);
            single.push(single_);
        }
        desc += [...new Set(single)].join('\n');
        desc += '\n';
        desc += [...new Set(alertDescriptions)].join('\n');
        desc += `Please verify if the activity is legitimate.\n`;
        showDialog(desc);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

/**
 * Create Description and Open MDE and MDE365 button
 * @param  {...any} kwargs - Include LogSourceDomain, Labels, LogSource, TicketAutoEscalate, Status, RawLog, Summary fields
 */
function MDE365AlertHandler(...kwargs) {
    console.log('#### Code MDE365lertHandler run ####');
    const { rawLog, LogSourceDomain, summary } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    let alertInfo_MDE = [],
        alertInfo_365 = [];
    function GMT8(params) {
        let date = new Date(params);
        date.setHours(date.getHours() + 16); // 获取当前的小时数并加上8小时
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            let logObj = '';
            if (log != '') {
                try {
                    if (log.charAt(log.length - 1) == '}') {
                        const formatJson = log.substring(log.indexOf('{')).trim();
                        logObj = JSON.parse(formatJson.replace(/\\\(n/g, '\\n('));
                    } else {
                        const formatJson = log.substring(log.indexOf('{')).trim() + '"}]}}';
                        logObj = JSON.parse(formatJson.replace(/\\\(n/g, '\\n('));
                    }
                    if (logObj['integration'] == 'Wazuh-MDE') {
                        raw_alert += 1;
                        const { mde } = logObj;
                        const { title, id, computerDnsName, relatedUser, evidence, alertCreationTime } = mde;
                        let dotIndex = alertCreationTime.lastIndexOf('.');

                        let dateTimeStr = GMT8(alertCreationTime.slice(0, dotIndex));
                        const alert = { title, id, computerDnsName, dateTimeStr };
                        const userName = relatedUser ? relatedUser.userName : 'N/A';
                        let extrainfo = '';
                        let processCommandLine = '';
                        if (evidence) {
                            const tmp = [];
                            for (const evidenceItem of evidence) {
                                let description = '';

                                if (evidenceItem.entityType === 'File') {
                                    console.log('===', WhiteFilehash(evidenceItem.sha1));
                                    if (WhiteFilehash(evidenceItem.sha1) || WhiteFilehash(evidenceItem.sha256)) {
                                        description = `filename: ${evidenceItem.fileName}\nfilePath: ${evidenceItem.filePath}`;
                                        tmp.push(description);
                                    } else {
                                        description = `filename: ${evidenceItem.fileName}\nfilePath: ${evidenceItem.filePath}\nsha1: ${evidenceItem.sha1}`;
                                        tmp.push(description);
                                    }
                                }
                                if (evidenceItem.entityType === 'Process') {
                                    if (evidenceItem.processCommandLine !== undefined) {
                                        processCommandLine = evidenceItem.processCommandLine.replace(
                                            /\r\n\r\n+/g,
                                            '\n'
                                        );
                                        console.log(processCommandLine);
                                    }
                                    if (
                                        evidenceItem.processCommandLine !== undefined &&
                                        evidenceItem.processCommandLine.includes('EncodedCommand')
                                    ) {
                                        let cmd_length = evidenceItem.processCommandLine.split(' ').length;
                                        description = `Decode_Cmd: ${atob(
                                            evidenceItem.processCommandLine
                                                .split(' ')
                                                [cmd_length - 1].replace(/['"]/g, '')
                                        )}`;
                                        tmp.push(description);
                                    }
                                    if (WhiteFilehash(evidenceItem.sha1) || WhiteFilehash(evidenceItem.sha256)) {
                                        description = `cmd: ${processCommandLine}\naccount: ${evidenceItem.accountName}`;
                                        tmp.push(description);
                                    } else {
                                        description = `cmd: ${processCommandLine}\naccount: ${evidenceItem.accountName}\nsha1: ${evidenceItem.sha1}`;
                                        tmp.push(description);
                                    }
                                }
                                if (evidenceItem.entityType === 'Url') {
                                    description += `Url: ${evidenceItem.url}`;
                                    tmp.push(description);
                                }
                                if (evidenceItem.entityType === 'Ip') {
                                    description += `IP: ${evidenceItem.ipAddress}`;
                                    tmp.push(description);
                                }
                            }
                            const uniqueDescriptions = Array.from(new Set(tmp));
                            extrainfo = uniqueDescriptions.join('\n');
                        }
                        alertInfo_MDE.push({ ...alert, userName, extrainfo });
                    } else {
                        raw_alert += 1;
                        const alerts = logObj['incidents']['alerts'][0];
                        console.log(alerts);
                        let entities = {};
                        logObj['incidents']['alerts'].forEach(function (alert, index) {
                            if (alert !== undefined) {
                                alert['entities'].forEach(function (entity) {
                                    if (entity.processCommandLine !== undefined) {
                                        processCommandLine = entity.processCommandLine.replace(/\r\n\r\n+/g, '\n');
                                        console.log(processCommandLine);
                                    }
                                    if (entity['entityType'] == 'User' || entity['entityType'] == 'Mailbox') {
                                        entities['user'] = `${entity['domainName']}\\\\${entity['accountName']}`;
                                        entities['userPrincipalName'] = entity['userPrincipalName'];
                                    }
                                    if (entity['entityType'] == 'CloudApplication') {
                                        entities['applicationId'] = entity['applicationId'];
                                        entities['applicationName'] = entity['applicationName'];
                                    }
                                    if (entity['entityType'] == 'Process') {
                                        if (!entities['process']) {
                                            entities['process'] = [];
                                        }
                                        const fileEntry = {
                                            filename: entity['fileName'],
                                            filePath: entity['filePath'],
                                            cmd: processCommandLine
                                        };
                                        if (processCommandLine.includes('EncodedCommand')) {
                                            let cmd_length = processCommandLine.split(' ').length;
                                            fileEntry['Decode_Cmd'] = atob(
                                                processCommandLine.split(' ')[cmd_length - 1].replace(/['"]/g, '')
                                            );
                                        }
                                        if (
                                            Object.keys(entity).includes('sha256') &&
                                            (WhiteFilehash(entity['sha256']) || WhiteFilehash(entity['sha1']))
                                        ) {
                                            entities['process'].push(fileEntry);
                                        } else {
                                            fileEntry['sha256'] = entity['sha256'];
                                            entities['process'].push(fileEntry);
                                        }
                                    }

                                    if (entity['entityType'] == 'File') {
                                        if (!entities['file']) {
                                            entities['file'] = [];
                                        }
                                        const fileEntry = {
                                            filename: entity['fileName'],
                                            filePath: entity['filePath']
                                        };
                                        if (
                                            Object.keys(entity).includes('sha256') &&
                                            (WhiteFilehash(entity['sha256']) || WhiteFilehash(entity['sha1']))
                                        ) {
                                            entities['file'].push(fileEntry);
                                        } else {
                                            fileEntry['sha256'] = entity['sha256'];
                                            entities['file'].push(fileEntry);
                                        }
                                    }

                                    if (entity['entityType'] == 'Ip') {
                                        if (!entities['ip']) {
                                            entities['ip'] = [];
                                        }
                                        entities['ip'].push({
                                            ip: entity['ipAddress']
                                        });
                                    }
                                    if (entity['entityType'] == 'Url') {
                                        if (!entities['url']) {
                                            entities['url'] = [];
                                        }
                                        entities['url'].push({
                                            url: entity['url']
                                        });
                                    }
                                    if (entity['entityType'] == 'MailMessage') {
                                        if (!entities['MailMessage']) {
                                            entities['MailMessage'] = [];
                                        }
                                        entities['MailMessage'].push({
                                            subject: entity['subject'],
                                            evidenceCreationTime: entity['evidenceCreationTime'],
                                            recipient: entity['recipient'],
                                            userPrincipalName: entity['userPrincipalName'],
                                            remediationStatus: entity['remediationStatus']
                                            // recipient: entity['recipient']
                                        });
                                    }
                                    console.log('===', entities['MailMessage']);
                                });
                            }
                        });

                        let creationTime = GMT8(alerts.creationTime.split('.')[0]);
                        let title = alerts?.title;
                        if (summary.toLowerCase().includes(title.toLowerCase())) {
                            title = undefined;
                        }
                        alertInfo_365.push({
                            creationTime: creationTime,
                            Title: title,
                            summary: logObj['incidents'].incidentName,
                            host: alerts?.devices[0]?.deviceDnsName,
                            user: entities.user,
                            userPrincipalName: entities.userPrincipalName,
                            process: entities.process,
                            file: entities.file,
                            ip: entities.ip,
                            url: entities.url,

                            MailMessage: entities.MailMessage,
                            alertid: alerts?.alertId,
                            incidenturi: logObj['incidents'].incidentUri,
                            severity: logObj['incidents'].severity,
                            description: alerts['description'] || undefined,
                            applicationId: entities.applicationId,
                            applicationName: entities.applicationName
                        });
                    }
                } catch (error) {
                    console.error(`Error: ${error.message}`);
                }
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertDescriptions = [];
    parseLog(rawLog);

    function generateDescription_MDE() {
        for (const info of alertInfo_MDE) {
            const { title, computerDnsName, userName, extrainfo, dateTimeStr } = info;
            const desc = `Observed ${title}\nalertCreationTime(<span class="red_highlight">GMT+8</span>): ${dateTimeStr}\nHost: ${computerDnsName}\nusername: ${userName}\n${extrainfo}\n\nPlease help to verify if it is legitimate.\n`;
            alertDescriptions.push(desc);
        }
    }
    function generateDescription_365() {
        if (summary.includes('M365 Defender High Severity Alerts: Logon from a risky country involving one user')) {
            const ticketnumber = $('#key-val').text();
            for (const info of alertInfo) {
                let desc = `Dear Customer,
	 
	            Reasons for escalating:
	             
	            Observed Logon from a risky country involving one user in [time]
	             
	            Here is information about this login:
	
	            creationTime(<span class="red_highlight"">GMT</span>): ${info.creationTime}
	             
	            source IP: ${info.ip[0].ip}
	             
	            user: ${info.user}
	             
	            active: Microsoft 365
	             
	            userPrincipalName: ${info.userPrincipalName}
	             
	            Device type:
	             
	            UserAgent:
	             
	            location:
	             
	            logging status:
	             
	            LoginStatus:
	             
	            MfaRequired:
	             
	            the user suddenly logged in from [Location1] but the user used to be logged in from [Location2], aberdeen. Please confirm whether the login behavior of the user is normal.if not, could block the ip.
	             
	             
	            Suggestion: We suggest to confirm whether the behavior of this customer logging in at ${info.ip[0].ip}: is normal or not, if not, we suggest to block the IP and change the user's password and perform a full scan on the user's commonly used PCs, thank you!
	             
	            Severity: ${info.severity}
	             
	            Correlation ticket: ${ticketnumber}
	            
	            `;
                alertDescriptions.push(desc);
            }
        } else {
            for (const info of alertInfo_365) {
                let desc = `Observed ${info.summary}\n`;
                try {
                    for (let key in info) {
                        if (info.hasOwnProperty(key)) {
                            if (Array.isArray(info[key])) {
                                info[key].forEach((item) => {
                                    desc += '\n';
                                    for (let subKey in item) {
                                        if (item.hasOwnProperty(subKey) && item[subKey] !== '') {
                                            desc += `${subKey}: ${item[subKey]}\n`;
                                        }
                                    }
                                });
                            } else {
                                if (
                                    info[key] !== undefined &&
                                    info[key] !== ' ' &&
                                    key !== 'summary' &&
                                    key !== 'alertid' &&
                                    key !== 'incidenturi' &&
                                    key !== 'severity'
                                ) {
                                    if (key == 'creationTime') {
                                        desc += `creationTime(<span class="red_highlight">GMT+8</span>): ${info[key]}\n`;
                                    } else {
                                        desc += `${key}: ${info[key]}\n`;
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error: ${error}`);
                }
                let MDEURL = '';
                const cachedMappingContent = GM_getValue('cachedMappingContent', null);

                if (LogSourceDomain == cachedMappingContent['wwa']) {
                    if (info.alertid && !MDEURL.includes(info.alertid)) {
                        MDEURL += `https://security.microsoft.com/alerts/${info.alertid}<br>`;
                    }
                    if (info.incidenturi) {
                        let incident_url = info.incidenturi.replace('hXXps[:]', 'https:') + '<br>';
                        MDEURL += incident_url;
                    }
                    desc += `MDE URL: \n${MDEURL}\n`;
                }

                desc += `\nPlease verify if the activity is legitimate.\n`;
                alertDescriptions.push(desc);
            }
        }
    }
    function generateDescription() {
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        generateDescription_MDE();
        generateDescription_365();
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    function openMDE() {
        let MDEURL = '';
        for (const info of alertInfo_MDE) {
            const { id } = info;
            if (id) {
                MDEURL += `https://security.microsoft.com/alerts/${id}<br>`;
            }
        }
        for (const info of alertInfo_365) {
            const { alertid, incidenturi } = info;
            if (alertid && !MDEURL.includes(alertid)) {
                MDEURL += `https://security.microsoft.com/alerts/${alertid}<br>`;
            }
            if (incidenturi) {
                let incident_url = incidenturi.replace('hXXps[:]', 'https:') + '<br>';
                MDEURL += incident_url;
            }
        }
        showFlag('info', 'MDE URL:', `${MDEURL}`, 'manual');
        let url = 'https://security.microsoft.com/homepage?&current=';
        url += LogSourceDomain;
        for (let i = 0; i < MDEURL.length; i++) {
            let mde_url = `&url${i}=${MDEURL[i]}`;
            url += mde_url;
            console.log(MDEURL[i]);
        }
        let MDE_Assist_ = localStorage.getItem('MDE_Assist');
        if (MDE_Assist_ != 0) {
            GM_openInTab(url, {
                active: false, // 设置为 false，以在后台打开，不激活新标签页
                insert: true // 设置为 true，将新标签页插入到当前标签页之后
            });
        }
    }
    addButton('generateDescription', 'Description', generateDescription);
    addButton('openMDE', 'MDE', openMDE);
}

function WindowsSysAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log != '') {
                    let log_data = {},
                        sub = '';
                    log.split('#010').forEach((element, index) => {
                        if (element.includes('#013')) {
                            element = element.replace(/#013/g, '');
                        }
                        if (element.includes('#009')) {
                            let e = element.replace(/#009/g, '').split(':');
                            log_data[e[0]] = e[1];
                        }
                        if (element.includes('=')) {
                            let e = element.replace(/#013/g, '').split('=');
                            log_data[e[0]] = e[1];
                        }
                        if (element.includes(':#013')) {
                            sub = element.split(':')[0];
                        }
                        if (
                            element.includes(':#009') &&
                            (element.includes('Account') ||
                                element.includes('Security ID') ||
                                element.includes('Logon ID'))
                        ) {
                            let e = element.replace(/#009/g, ' ').replace(/#013/g, '').split(': ');
                            log_data[sub + e[0].trim()] = e[1];
                        }
                        if (element.includes(':#009')) {
                            let e = element.replace(/#009/g, ' ').replace(/#013/g, '').split(': ');
                            log_data[e[0].trim()] = e[1];
                        }
                    });
                    const regex = /(\S+\s+\S+\s+\S+\s+\S+\s+)(.*)/g;
                    alertExtraInfo = {
                        Event_time: regex.exec(log.split('#010')[0])[2],
                        ComputerName: log_data.ComputerName ? log_data.ComputerName : undefined,
                        EventCode: log_data.EventCode ? log_data.EventCode : undefined,
                        SourceName: log_data.SourceName ? log_data.SourceName : undefined,
                        CreatorAccountDomain: log_data['Creator SubjectAccount Domain']
                            ? log_data['Creator SubjectAccount Domain']
                            : undefined,
                        CreatorAccountName: log_data['Creator SubjectAccount Name']
                            ? log_data['Creator SubjectAccount Name']
                            : undefined,
                        Type: log_data.Type ? log_data.Type : undefined,
                        Keywords: log_data.Keywords ? log_data.Keywords : undefined,
                        Message: log_data.Message ? log_data.Message : undefined,
                        CreatorProcessID: log_data['Creator Process ID'] ? log_data['Creator Process ID'] : undefined,
                        CreatorProcessName: log_data['Creator Process Name']
                            ? log_data['Creator Process Name']
                            : undefined,
                        NewProcessID: log_data['New Process ID'] ? log_data['New Process ID'] : undefined,
                        NewProcessName: log_data['New Process Name'] ? log_data['New Process Name'] : undefined,
                        ProcessCommandLine: log_data['Process Command Line']
                            ? log_data['Process Command Line']
                            : undefined,
                        ProcessCommandLine: log_data['Process Command Line']
                            ? log_data['Process Command Line']
                            : undefined,
                        SecurityID: log_data['Security ID'] ? log_data['Security ID'] : undefined,
                        ServiceAccount: log_data['Service Account'] ? log_data['Service Account'] : undefined,
                        ServiceFileName: log_data['Service File Name'] ? log_data['Service File Name'] : undefined,
                        ServiceName: log_data['Service Name'] ? log_data['Service Name'] : undefined,
                        ServiceStartType: log_data['Service Start Type'] ? log_data['Service Start Type'] : undefined,
                        ServiceType: log_data['Service Type'] ? log_data['Service Type'] : undefined
                    };
                    acc.push({ alertExtraInfo });
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info.alertExtraInfo) {
                if (Object.hasOwnProperty.call(info.alertExtraInfo, key)) {
                    const value = info.alertExtraInfo[key];
                    if (value !== undefined) {
                        if (key == 'start_time' || key == 'end_time') {
                            desc += `${key}(<span class="red_highlight">GMT</span>): ${value.split('.')[0] + 'Z'}\n`;
                        } else {
                            desc += `${key}: ${value}\n`;
                        }
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function ClarotyAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.length == 0) {
                    return acc;
                }
                const regex = /(\b\w+=)([^=\s].*?)(?=\s+\w+=|$)/g;
                let match;
                const matches = {};
                while ((match = regex.exec(log)) !== null) {
                    let item = match[0].split('=');
                    matches[item[0]] = item.slice(1, item.length).join('=');
                }
                raw_alert += 1;
                console.log(matches);
                let logArray = log.split(' ').filter((item) => item !== ''); //Remove extra whitespace from the string
                acc.push({
                    'Event time': logArray.slice(0, 3).join(' '),
                    'Extra information': logArray.slice(3, 8).join(' '),
                    'CtdSourceIp': matches.CtdSourceIp ? matches.CtdSourceIp : undefined,
                    'CtdDestinationIp': matches.CtdDestinationIp ? matches.CtdDestinationIp : undefined,
                    'CtdMessage': matches.CtdMessage ? matches.CtdMessage : undefined,
                    'CtdCategory': matches.CtdCategory ? matches.CtdCategory : undefined,
                    'CtdSourceZone': matches.CtdSourceZone ? matches.CtdSourceZone : undefined,
                    'CtdDestinationZone': matches.CtdDestinationZone ? matches.CtdDestinationZone : undefined,
                    'CtdAlertLink': matches.CtdAlertLink ? matches.CtdAlertLink : undefined
                });
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info) {
                if (Object.hasOwnProperty.call(info, key)) {
                    const value = info[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function FireeyeAlertHandler(...kwargs) {
    var { summary, rawLog } = kwargs[0];
    var raw_alert = 0;
    const num_alert = $('#customfield_10300-val').text().trim();
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.length == 0) {
                    return acc;
                }
                const regex = /(\b\w+=)([^=\s].*?)(?=\s+\w+=|$)/g;
                let match;
                const matches = {};
                while ((match = regex.exec(log)) !== null) {
                    let item = match[0].split('=');
                    matches[item[0]] = item.slice(1, item.length).join('=');
                }
                raw_alert += 1;
                let logArray = log.split(' ').filter((item) => item !== ''); //Remove extra whitespace from the string
                acc.push({
                    'Event time': logArray.slice(0, 3).join(' '),
                    'Vlan': matches.cn1 ? matches.cn1 : undefined,
                    'Sid': matches.cn2 ? matches.cn2 : undefined,
                    'CncHost': matches.cs5 ? matches.cs5 : undefined,
                    'CncPort': matches.cn3 ? matches.cn3 : undefined,
                    'Sname': matches.cs1 ? matches.cs1 : undefined,
                    'anomaly': matches.cs2 ? matches.cs2 : undefined,
                    'Link': matches.cs4 ? matches.cs4 : undefined,
                    'Channel': matches.cs6 ? matches.cs6 : undefined,
                    'request': matches.request ? matches.request : undefined,
                    'requestClientApplication': matches.requestClientApplication
                        ? matches.requestClientApplication
                        : undefined,
                    'requestMethod': matches.requestMethod ? matches.requestMethod : undefined,
                    'dst': matches.dst ? matches.dst : undefined,
                    'dpt': matches.dpt ? matches.dpt : undefined,
                    'src': matches.src ? matches.src : undefined,
                    'spt': matches.spt ? matches.spt : undefined,
                    'dvchost': matches.dvchost ? matches.dvchost : undefined,
                    'dvc': matches.dvc ? matches.dvc : undefined
                });
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info) {
                if (Object.hasOwnProperty.call(info, key)) {
                    const value = info[key];
                    if (value !== undefined) {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function WebAccesslogAlertHandler(...kwargs) {
    var { summary, rawLog, LogSourceDomain } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.length == 0) {
                    return acc;
                }
                console.log('===', log);
                if (
                    !summary.toLowerCase().includes('higher than allowed on most browsers. possible attack.') &&
                    !log.includes('DEBUG:')
                ) {
                    const regex = /(\b\w+=)"([^"]*?)"/g;
                    const regex_ = /"(.*?)"/g;
                    let match;
                    const matches = {};
                    while ((match = regex.exec(log)) !== null) {
                        let item = match[0].split('=');
                        matches[item[0]] = item.slice(1, item.length).join('=');
                    }
                    let match_;
                    const matches_ = [];
                    while ((match_ = regex_.exec(log)) !== null) {
                        matches_.push(match_[0]);
                    }
                    console.log(matches);
                    console.log(matches_);
                    let logArray = log.split(' ').filter((item) => item !== ''); //Remove extra whitespace from the string
                    console.log(logArray);
                    console.log('===', logArray[8]);
                    if (logArray[8].includes(':')) {
                        const regex =
                            /(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\w+)\s+(\S+)\s+(\S+)\s+(\S+:\d+)\s+-\s+\[([^\]]+)\]\s+"(GET|POST)\s+(.+?)\s+HTTP\/1\.1"\s+(\d{3})\s+(\d+)\s+"([^"]*)"\s+"([^"]+)"/;

                        const match = log.match(regex);
                        if (match) {
                            acc.push({
                                timestamp: match[1], // 日志时间
                                hostname: match[2], // 主机名
                                logType: match[3], // 日志类型（如 vami-access）
                                sourceIp: match[4], // 来源 IP
                                targetIpPort: match[5], // 目标 IP 和端口
                                requestTime: match[6], // 请求时间戳
                                method: match[7], // 请求方法
                                url: match[8], // 请求 URL
                                statusCode: match[9], // 状态码
                                bytes: match[10], // 响应字节数
                                referrer: match[11], // 引用来源
                                userAgent: match[12] // 用户代理
                            });
                        }
                    } else {
                        acc.push({
                            'Event time': logArray.slice(3, 5).join(' '),
                            'Source_IP': logArray[0] ? logArray[0] : undefined,
                            'URL': matches_[0] ? matches_[0] : undefined,
                            'User-Agent': matches_[2] ? matches_[2] : undefined,
                            'upstream_status': logArray[8] ? logArray[8] : undefined,
                            'upstream_addr': matches.upstream_addr ? matches.upstream_addr : undefined,
                            'sn': matches.sn ? matches.sn : undefined,
                            'http_referrer': matches.http_referrer ? matches.http_referrer : undefined,
                            'http_cookie': matches.http_cookie ? matches.http_cookie : undefined,
                            'location': matches.location ? matches.location : undefined
                        });
                    }
                } else if (log.includes('DEBUG:')) {
                    const logRegex = /(\S+)\s+(\S+)\s+-\s+-\s+\[(.*?)\]\s+"(.*?)"\s+(\d+)\s+(\d+)\s+"(.*?)"\s+"(.*?)"/;
                    const match = log.match(logRegex);

                    if (!match) {
                        console.error('日志格式不匹配');
                        return null;
                    }

                    console.log('===', match);

                    const [method, path, protocol] = match[4].split(' ');
                    acc.push({
                        timestamp: match[3],
                        clientIp: match[1],
                        method: method,
                        path: path,
                        responseSize: parseInt(match[6], 10),
                        serverIp: match[2],
                        statusCode: parseInt(match[5], 10),
                        serverIp: match[2]
                    });
                } else {
                    const regex1 =
                        /(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\w+)\s+pod-console\s+(.+?)\s+HTTP\/1\.1"\s+(\d{3})\s+(\d+)\s+"([^"]*)"\s+"([^"]+)"/;
                    const regex2 =
                        /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\+\d{4})\s+\[([^\]]+)\]\s+"([^"]+)"\s+-\s+-\s+\[([^\]]+)\]\s+"(GET|POST)\s+(.+?)\s+HTTP\/1\.1"\s+(\d{3})\s+(\d+)\s+"([^"]*)"\s+"([^"]+)"/g;

                    const match1 = log.match(regex1);
                    if (match1) {
                        acc.push({
                            timestamp: match1[1],
                            host: match1[2],
                            url: match1[3],
                            statusCode: match1[4],
                            bytes: match1[5],
                            referrer: match1[6],
                            userAgent: match1[7]
                        });
                    }
                    let match2;
                    while ((match2 = regex2.exec(log)) !== null) {
                        acc.push({
                            timestamp: match2[1],
                            identifier: match2[2],
                            ip: match2[3],
                            logTime: match2[4],
                            method: match2[5],
                            url: match2[6],
                            statusCode: match2[7],
                            bytes: match2[8],
                            referrer: match2[9],
                            userAgent: match2[10]
                        });
                    }
                }
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }
    const alertInfo = parseLog(rawLog);
    console.log(alertInfo);
    function generateDescription() {
        const alertDescriptions = [];
        for (const info of alertInfo) {
            const lastindex = summary.lastIndexOf(']');
            let desc = `Observed ${summary.substr(lastindex + 1)}\n`;
            for (const key in info) {
                if (Object.hasOwnProperty.call(info, key)) {
                    const value = info[key];
                    if (value !== undefined && value !== '-' && value !== '"-"') {
                        desc += `${key}: ${value}\n`;
                    }
                }
            }
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function FireeyeEtpAlertHandler(...kwargs) {
    const { rawLog, summary } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const { meta, alert, email } = JSON.parse(log)['fireeye'];
                acc.push({
                    timestamp: alert['timestamp'],
                    accepted: email['timestamp']['accepted'],
                    last_malware: meta['last_malware'],
                    alert_type: meta['alert_type'],
                    status: email['status'],
                    source_ip: email['source_ip'],
                    rcpt_to: email['smtp']['rcpt_to'],
                    mail_from: email['smtp']['mail_from'],
                    etp_message_id: email['etp_message_id'],
                    To: email['headers']['to'],
                    From: email['headers']['from'],
                    Subject: email['headers']['subject'],
                    attachment: email['attachment']
                });
                raw_alert += 1;
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${summary.split(']')[1]}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && value !== ' ' && index != 'Summary') {
                    if (index == 'timestamp') {
                        desc += `timestamp(<span class="red_highlight">GMT</span>): ${value.split('.')[0]}Z\n`;
                    } else if (index == 'accepted') {
                        desc += `accepted(<span class="red_highlight">GMT</span>): ${value}Z\n`;
                    } else {
                        desc += `${index}: ${value}\n`;
                    }
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function SentinelOneAlertHandler(...kwargs) {
    const { rawLog, summary } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                const sentinel_one = JSON.parse(log)['sentinel_one'];
                acc.push({
                    timestamp: sentinel_one.threatInfo.createdAt.split('.')[0],
                    accountName: sentinel_one.accountName,
                    agentDomain: sentinel_one.agentDomain,
                    agentIpV4: sentinel_one.agentIpV4,
                    agentOsName: sentinel_one.agentOsName,
                    agentMitigationMode: sentinel_one.agentMitigationMode,
                    filePath: sentinel_one.threatInfo.filePath,
                    sha1: sentinel_one.threatInfo.sha1,
                    confidenceLevel: sentinel_one.threatInfo.filePath,
                    threatName: sentinel_one.threatInfo.threatName,
                    processUser: sentinel_one.threatInfo.processUser
                });
                raw_alert += 1;
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${summary.split(']')[1]}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && value !== ' ' && index != 'Summary') {
                    if (index == 'timestamp') {
                        desc += `timestamp(<span class="red_highlight">GMT</span>): ${value.split('.')[0]}Z\n`;
                    } else {
                        desc += `${index}: ${value}\n`;
                    }
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function JsonAlertHandler(...kwargs) {
    const { rawLog, summary } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.length == 0) {
                    return acc;
                }
                const json_alert = JSON.parse(log)['proofpoint'];
                let Mail_file = [];
                let urls = [];
                json_alert.msgParts.forEach((item, index) => {
                    if (item.detectedName.includes('html')) {
                        urls.push(item.urls.map((i) => i.url)[0]);
                    }
                    Mail_file.push(item.detectedName);
                });

                Mail_file = JSON.stringify(Mail_file);
                urls = JSON.stringify(urls);
                acc.push({
                    createtime: json_alert.ts.split('.')[0],
                    protocol: json_alert.connection.protocol,
                    resolveStatus: json_alert.connection.resolveStatus,
                    Mail_To: JSON.stringify(json_alert.msg.header.to).replace(/[<>]/g, ''),
                    Mail_From: JSON.stringify(json_alert.msg.header.from).replace(/[<>]/g, ''),
                    Mail_Subject: json_alert.msg.header.subject,
                    country: json_alert.connection.country,
                    host_ip: json_alert.connection.ip,
                    final_action: json_alert.final_action,
                    Mail_file: Mail_file,
                    urls: urls
                });
                raw_alert += 1;
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${summary.split(']').at(-1)}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && value !== ' ' && index != 'Summary') {
                    if (index == 'createtime') {
                        desc += `createtime(<span class="red_highlight">GMT+8</span>): ${value}\n`;
                    } else {
                        desc += `${index}: ${value}\n`;
                    }
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function F5AsmAlertHandler(...kwargs) {
    const { rawLog, summary } = kwargs[0];
    var raw_alert = 0;
    function parseLog(rawLog) {
        const alertInfo = rawLog.reduce((acc, log) => {
            try {
                if (log.length == 0) {
                    return acc;
                }
                const regex = /(\w+)="([^"]*)"/g;
                const result = {};

                let match;
                while ((match = regex.exec(log)) !== null) {
                    result[match[1]] = match[2];
                }
                acc.push({
                    createtime: result.date_time,
                    unit_hostname: result.unit_hostname,
                    management_ip_address: result.management_ip_address,
                    http_class_name: result.http_class_name,
                    response_code: result.response_code,
                    request_status: result.request_status,
                    ip_client: result.ip_client,
                    uri: result.uri,
                    method: result.method,
                    protocol: result.protocol,
                    violations: result.violations,
                    attack_type: result.attack_type
                });
                raw_alert += 1;
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            return acc;
        }, []);
        return alertInfo;
    }

    const alertInfo = parseLog(rawLog);
    const num_alert = $('#customfield_10300-val').text().trim();
    function generateDescription() {
        const alertDescriptions = [];
        if (raw_alert < num_alert) {
            AJS.banner({
                body: `Number Of Alert : ${num_alert}, Raw Log Alert : ${raw_alert} Raw log information is Not Complete, Please Get More Alert Information From Elastic.\n`
            });
        }
        for (const info of alertInfo) {
            let desc = `Observed ${summary.split(']').at(-1)}\n`;
            Object.entries(info).forEach(([index, value]) => {
                if (value !== undefined && value !== ' ' && index != 'Summary') {
                    if (index == 'createtime') {
                        desc += `createtime(<span class="red_highlight">GMT+8</span>): ${value}\n`;
                    } else {
                        desc += `${index}: ${value}\n`;
                    }
                }
            });
            desc += `\nPlease verify if the activity is legitimate.\n`;
            alertDescriptions.push(desc);
        }
        const alertMsg = [...new Set(alertDescriptions)].join('\n');
        showDialog(alertMsg);
    }
    addButton('generateDescription', 'Description', generateDescription);
}

function LLA_CS_AlertHandler(DecoderName) {
    let ORG = $('#customfield_10002-val').text().trim();
    console.log(ORG.split(' ')[ORG.split(' ').length - 1]);
    const elements = document.querySelectorAll('.user-hover.user-avatar');
    const userList = ['kitty li', 'anson cho', 'ray tan', 'philip ng'];
    console.log(elements[0].textContent.toLowerCase()); // 对每个元素执行操作
    let ClientComment = false;
    for (const dataItem of userList) {
        if (elements[0].textContent.toLowerCase().includes(dataItem.toLowerCase())) {
            ClientComment = true;
            break;
        }
    }
    //判断工单是否升级，
    if (ORG.split(' ')[ORG.split(' ').length - 1] == 'None' && DecoderName == 'crowdstrike_cef') {
        $('#opsbar-opsbar-transitions').on('click', () => {
            let userConfirmed = confirm('LHG的所有 Crowdstrike 告警均需要升级，即使是误报也需要升级');
        });
    } else {
        if (!ClientComment) {
            $('#opsbar-opsbar-transitions').on('click', () => {
                let userConfirmed = confirm(
                    '只有这四个客户回复philip.ng,ray.tan,anson.cho,kitty.li,才可关单,若以上四个客户已允许close，可忽略此提示'
                );
            });
        }
    }
}

function GGA_AlertHandler() {
    const cachedMappingContent = GM_getValue('cachedMappingContent', null);

    function generateDescription() {
        var description = $('#description-val').text().trim();

        if (!description.includes('details')) {
            let kibana = $('#field-customfield_10308').text().trim().split(' ')[36];
            let newUrl = kibana.replace(
                /https:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
                'https://' + cachedMappingContent['gga_url']
            );
            description = '<b>Log Details:\n</b>' + description + '\n' + '<b>Kibana:</b>' + newUrl;
            showDialog(description);
        }
    }
    addButton('GGA', 'GGA', generateDescription);
}

function RealMonitorMe() {
    let ORG = $('#customfield_10002-val').text().trim();
    let status = $('#opsbar-transitions_more').text().trim();
    if ($('#customfield_10302-val').text().trim().includes('\n')) {
        let rules = $('#customfield_10302-val').text().trim().split(' \n')[1].split('\n');
        if (rules.length - 1 >= 3 && status == 'Work in progress') {
            confirm(
                `检测到该工单的RuleName有${
                    rules.length - 1
                }个，(如果同一张tickets出现三个告警及以上，需要往cortex群里发，如果是误报请描述原因，谢谢)`
            );
        }
    }
    const intervalId = setInterval(() => {
        var element_one = document.getElementById('opsbar-opsbar-transitions');
        var first = element_one ? element_one.textContent || element_one.innerText : null;
        if (first == 'Resolved') {
            clearInterval(intervalId);
        }
        if (first == 'Waiting for customer' && ORG.split(' ')[ORG.split(' ').length - 1] == 'None') {
            console.log('===发生了改变', first);
            confirm('请注意,该工单变为Waiting for customer,请检查该工单是否已添加ORG');
            first = 'Waiting for customer';
            clearInterval(intervalId);
        }
    }, 500);
}

function formatCurrentDateTime(dateStr, decoder_name) {
    if (dateStr) {
        var date = new Date(dateStr);
        var localOffset = date.getTimezoneOffset();
        if (decoder_name == 'impervainc_cef') {
            var targetDate = new Date(date.getTime() + (480 + localOffset) * 60000);
        } else {
            var targetDate = new Date(date.getTime() + (960 + localOffset) * 60000);
        }
        var year = targetDate.getFullYear();
        var month = ('0' + (targetDate.getMonth() + 1)).slice(-2);
        var day = ('0' + targetDate.getDate()).slice(-2);
        var hours = ('0' + targetDate.getHours()).slice(-2);
        var minutes = ('0' + targetDate.getMinutes()).slice(-2);
        var seconds = ('0' + targetDate.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const pad = (num) => (num < 10 ? '0' : '') + num;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date_ = new Date();

    const day_ = date_.getDate();
    const month_ = months[date_.getMonth()];
    const year_ = date_.getFullYear().toString().slice(-2); // 取最后两位
    const hours_ = date_.getHours();
    const minutes_ = date_.getMinutes();
    const ampm = hours_ >= 12 ? 'PM' : 'AM';
    const hour = hours_ % 12 || 12; // Convert to 12-hour format and handle 0 case

    return `${pad(day_)}/${month_}/${year_} ${pad(hour)}:${pad(minutes_)} ${ampm}`;
}

function MonitorDev() {
    function formatDate() {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0'); // 日期补齐两位数
        const month = date.toLocaleString('en-US', { month: 'short' }); // 获取月份缩写
        const year = String(date.getFullYear()).slice(-2); // 取年份的后两位

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12; // 将24小时制转换为12小时制
        hours = hours ? hours : 12; // 如果是0点，将其转换为12
        hours = String(hours).padStart(2, '0'); // 补齐小时为两位数

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    }
    let white = JSON.parse(localStorage.getItem('whitelist'));

    if (window.location.href.includes('/portal/2/create/100')) {
        const interval = setInterval(() => {
            var iframe = document.getElementById('rw_iframe');
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            var element = iframeDocument.getElementById('summary');
            if (element) {
                let summary = 'Whitelist ' + white['summary'].replace('Wazuh', white['LogSourceDomain']);
                iframeDocument.getElementById('summary').value = summary;
                iframeDocument.getElementById('s2id_labels').innerHTML =
                    `<ul class="select2-choices">  <li class="select2-search-choice">    <div>` +
                    white['LogSourceDomain'] +
                    `</div>    <a href="#" class="select2-search-choice-close" tabindex="-1"></a></li><li class="select2-search-field">    <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input" id="s2id_autogen1" style="width: 10px;">  </li></ul>`;
                iframeDocument.getElementById('labels').value = white['LogSourceDomain'];
                iframeDocument.getElementById('customfield_14601').value = formatDate();
                iframeDocument.getElementById('customfield_14600').value = formatDate();
                iframeDocument.getElementById('customfield_14610').value = 'Yes';
                iframeDocument.getElementById('customfield_14609').value = 'Yes';
                iframeDocument.getElementById('customfield_14608').value = 'Yes';
                clearInterval(interval);
            }
        }, 600);
    }
    let cachedEntry = GM_getValue('cachedEntry', null);
    if (window.location.href.includes('/servlet/desk/portal/2') && window.location.href.includes('DEV')) {
        window.location.href = `${cachedEntry['hk']}/browse/` + window.location.href.split('portal/2/')[1];
        localStorage.setItem('Dev_link', window.location.href.split('portal/2/')[1]);
    }
    if (window.location.href.includes(localStorage.getItem('Dev_link'))) {
        document.getElementById('edit-issue').click();
        const interval = setInterval(() => {
            const components = document.querySelector('#components-textarea');
            if (components) {
                $('#components-textarea').val(white['Component']);
                $('#components-textarea').click();
                $('#issuelinks-issues-textarea').val(white['MSS'].split('browse/')[1]);
                $('#tab-0').click();
                localStorage.removeItem('Dev_link');
                clearInterval(interval);
            }
        }, 500);
    }
}

function WhiteFilehash(filehash) {
    if (filehash == undefined) {
        return 0;
    }
    const cachedWhitehashContent = GM_getValue('cachedWhitehashContent', null);
    for (const f of cachedWhitehashContent) {
        if (filehash.includes(f['hash'].toLowerCase())) {
            console.log('命中了', filehash);
            return true;
        }
    }
}

function RealTimeMonitoring() {
    // Filter page: audio control registration and regular issues table update
    if (
        (window.location.href.includes('filter=15200') ||
            window.location.href.includes('filter=26405') ||
            window.location.href.includes('filter=13300')) &&
        !window.location.href.includes('MSS')
    ) {
        console.log('#### Code includes filter run ####');
        const NotifyControls = createNotifyControls();
        if (window.location.href.includes('filter=15200') || window.location.href.includes('filter=26405')) {
            setInterval(() => {
                notifyKey = [];
                $('.aui-button.aui-button-primary.search-button').click();
                setTimeout(() => {
                    checkupdate(NotifyControls);
                }, 10000);
            }, 180000);
        }
        if (window.location.href.includes('filter=13300')) {
            setInterval(() => {
                notifyKey = [];
                $('.aui-button.aui-button-primary.search-button').click();
                setTimeout(() => {
                    monitorList();
                }, 10000);
            }, 60000);
        }
    }
    if (window.location.href.includes('login.microsoftonline.com')) {
        setTimeout(() => {
            switch_user_microsoft();
        }, 2000);
    }
    if (window.location.href.includes('security.microsoft.com/homepage?&current=')) {
        setTimeout(() => {
            security_microsoft();
        }, 3000);
    }
    // Issue page: check Keywords and ATT&CK and Org
    setTimeout(() => {
        if ($('#issue-content').length && !$('.aui-banner-error').length) {
            console.log('#### Code Issue page: check Keywords ####');
            checkKeywords();
            checkATTCK();
        }
    }, 4500);
    // Issue page: Alert Handler
    function Alert_Handler() {
        var LogSourceDomain = $('#customfield_10223-val').text().trim();
        let rawLog = $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        if (rawLog == '') {
            rawLog = $('#field-customfield_10904 > div:first-child > div:nth-child(2)').text().trim().split('\n');
        }
        const summary = $('#summary-val').text().trim();
        if ($('#issue-content').length && !$('#generateDescription').length) {
            console.log('#### Code Issue page: Alert Handler ####');
            const handlers = {
                'cortex-xdr-json': cortexAlertHandler,
                'mde-api-json': MDE365AlertHandler,
                'sangfor-ccom-json': HTSCAlertHandler,
                'carbonblack': CBAlertHandler,
                'carbonblack_cef': VMCEFAlertHandler,
                'windows_eventchannel': WineventAlertHandler,
                'fortigate-firewall-v5': FortigateAlertHandler,
                'crowdstrike_cef': CSAlertHandler,
                'sophos': SophosAlertHandler,
                'sepm-security': SpemAlertHandler,
                'sepm-traffic': SpemAlertHandler,
                'vmwarecarbonblack_cef': VMCEFAlertHandler,
                'aws-cloudtrail': AwsAlertHandler,
                'aws-cisco-umbrella': AwsAlertHandler,
                'm365-defender-json': MDE365AlertHandler,
                'azureeventhub': AzureAlertHandler,
                'azuregraphapi-json': AzureGraphAlertHandler,
                'paloalto-firewall': paloaltoAlertHandler,
                'impervainc_cef': SangforAlertHandler,
                'proofpoint_tap': ProofpointAlertHandler,
                'zscaler-zpa-json': ZscalerAlertHandler,
                'pulse-secure': PulseAlertHandler,
                'aws-guardduty': AwsAlertHandler,
                'alicloud-json': AlicloudAlertHandler,
                'darktrace-json': DarktraceAlertHandler,
                'sangfor_cef': SangforAlertHandler,
                'cyberark_cef': SangforAlertHandler,
                'radware-json': RadwareAlertHandler,
                'carbonblack_cloud': CarbonAlertHandler,
                'windows-syslog': WindowsSysAlertHandler,
                'claroty_cef': ClarotyAlertHandler,
                'office-365': Risky_Countries_AlertHandler,
                'fireeye': FireeyeAlertHandler,
                'web-accesslog': WebAccesslogAlertHandler,
                'checkpoint_cef': SangforAlertHandler,
                'incapsula_cef': SangforAlertHandler,
                'fireeye-etp-json': FireeyeEtpAlertHandler,
                'sentinelone-json': SentinelOneAlertHandler,
                'sonicwall': FortigateAlertHandler,
                'trellix_cef': SangforAlertHandler,
                'json': JsonAlertHandler,
                'f5-asm': F5AsmAlertHandler,
                'sangfor': SangforAlertHandler
            };
            let DecoderName = $('#customfield_10807-val').text().trim().toLowerCase();
            if (DecoderName == '') {
                DecoderName = $('#customfield_10906-val').text().trim().toLowerCase();
            }
            if (DecoderName.includes('m365-defender-json')) {
                let decoder_name = [];
                DecoderName.split(' ').forEach((element, index) => {
                    if (element != 'hide\n' && element != '' && element != 'show\n' && element != '\n') {
                        decoder_name.push(element);
                    }
                });
                if (decoder_name[0].includes('m365-defender-json\n')) {
                    DecoderName = 'm365-defender-json';
                }
            }
            const handler = handlers[DecoderName];
            if (handler) {
                handler({
                    LogSourceDomain: LogSourceDomain,
                    rawLog: rawLog,
                    summary: summary,
                    DecoderName: DecoderName
                });
            }
            const No_Decoder_handlers = {
                'detect aad, o365 sign-in from risky countries': Risky_Countries_AlertHandler,
                'successful azure/o365 login from malware-ip': Risky_Countries_AlertHandler,
                'rarely country signin from o365': Risky_Countries_AlertHandler,
                'agent disconnected': Agent_Disconnect_AlertHandler,
                'suspicious geolocation ip login success': PulseAlertHandler,
                'login success from malware ip(s)': ThreatMatrixAlertHandler,
                'multiple account being disabled or deleted in short period of time': MultipleAccountAlertHandler,
                'multiple sms request for same source ip': AwsAlertHandler,
                'malicious email campaign detected (>20)': JsonAlertHandler
            };
            const Summary = $('#summary-val').text().trim();
            let No_Decoder_handler = null;
            Object.keys(No_Decoder_handlers).forEach((key) => {
                if (Summary.toLowerCase().includes(key)) {
                    No_Decoder_handler = No_Decoder_handlers[key];
                }
            });
            if (No_Decoder_handler !== null) {
                No_Decoder_handler({ LogSourceDomain: LogSourceDomain, rawLog: rawLog, summary: Summary });
            }
            if (LogSourceDomain == '') {
                LogSourceDomain = $('#customfield_10846-val').text().trim();
            }
            const Log_Domain_handlers = {
                mdb: MdbAlertHandler, //这里面有点工单为decoder name:sshd
                dst: DstAlertHandler
            };
            const Log_Domain_handler = Log_Domain_handlers[LogSourceDomain];
            if (Log_Domain_handler) {
                Log_Domain_handler({ LogSourceDomain: LogSourceDomain, rawLog: rawLog, summary: summary });
            }
            if (window.location.href.includes('MSS') || window.location.href.includes('OPS')) {
                addButton('towhitelist', 'WhiteList', ToWhitelist);
            }
        }
    }
    const interval = setInterval(() => {
        const element = document.querySelector('#towhitelist');
        if (!element && window.location.href.includes('browse/MSS-')) {
            Alert_Handler();
            // clearInterval(interval);
        }
    }, 1500); // 每1500毫秒检查一次

    // Issue page: Edit Notify
    setTimeout(() => {
        let LogSourceDomain,
            Source,
            Labels,
            LogSource,
            DecoderName,
            TicketAutoEscalate,
            Status,
            RawLog,
            Summary,
            AgentName,
            Description,
            SourceIP;

        let cachedEntry = GM_getValue('cachedEntry', null);
        Description = $('#description-val').text().trim();
        Summary = $('#summary-val').text().trim();
        if (window.location.host === cachedEntry['hk'].split('//')[1]) {
            // for HK
            LogSourceDomain = $('#customfield_10223-val').text().trim();
            Source = $('#customfield_10113-val').text().trim();
            Labels = $('.labels-wrap .labels li a span').text();
            LogSource = $('#customfield_10204-val').text().trim();
            DecoderName = $('#customfield_10807-val').text().trim().toLowerCase();
            TicketAutoEscalate = $('#customfield_12202-val').text().trim();
            Status = $('#status-val > span').text().trim();
            RawLog =
                $('#field-customfield_10219 > div:first-child > div:nth-child(2)').text().trim() ||
                $('#customfield_10219-val').text().trim() ||
                $('#field-customfield_10232 > div.twixi-wrap.verbose > div > div > div > pre').text();
            AgentName = $('#customfield_10805-val').text().trim();
        } else if (window.location.host === cachedEntry['macao'].split('//')[1]) {
            // for MO
            LogSourceDomain = $('#customfield_10846-val').text().trim();
            Source = $('#customfield_10872-val').text().trim();
            Labels = $('#labels-212244-value').text().trim();
            LogSource = $('#customfield_10854-val').text().trim();
            DecoderName = $('#customfield_10906-val').text().trim();
            TicketAutoEscalate = $('#customfield_10893-val').text().trim();
            Status = $('#status-value > span').text().trim();
            RawLog = $('#field-customfield_10904 > div.twixi-wrap.verbose > div').text().trim();
            AgentName = $('#customfield_10802-val').text().trim();
            SourceIP = $('#customfield_10859-val').text().trim();
        }

        const pageData = {
            LogSourceDomain,
            Source,
            Labels,
            LogSource,
            DecoderName,
            TicketAutoEscalate,
            Status,
            RawLog,
            Summary,
            AgentName,
            Description,
            SourceIP
        };

        // If it pops up once, it will not be reminded again
        if (
            ($('#issue-content').length &&
                !$('#generateTicketNotify').length &&
                window.location.href.includes('MSS')) ||
            window.location.href.includes('OPS')
        ) {
            ticketNotify(pageData);
        }
    }, 2000);

    // Issue page: Norm Alert
    setTimeout(() => {
        var LogSourceDomain = $('#customfield_10223-val').text().trim();
        let DecoderName = $('#customfield_10807-val').text().trim().toLowerCase();
        if (DecoderName == '') {
            DecoderName = $('#customfield_10906-val').text().trim().toLowerCase();
        }
        const cachedMappingContent = GM_getValue('cachedMappingContent', null);
        if (LogSourceDomain.includes(cachedMappingContent['lla'])) {
            LLA_CS_AlertHandler(DecoderName);
        }
        if (LogSourceDomain.includes(cachedMappingContent['gga'])) {
            GGA_AlertHandler();
        }
    }, 3500);

    // Issue page: Quick Reply
    setInterval(() => {
        if (document.querySelector('#reply') == null) {
            QuickReply();
        }
    }, 3000);
}

(function () {
    ('use strict');
    RealTimeMonitoring();

    AJS.whenIType('zv').execute(function () {
        document.getElementById('opsbar-transitions_more').click();
        const interval = setInterval(() => {
            const element = document.querySelector('#action_id_761');
            if (element) {
                document.getElementById('action_id_761').click();
                clearInterval(interval);
            }
        }, 100); // 每100毫秒检查一次
    });
    AJS.whenIType('zx').execute(function () {
        document.getElementById('edit-issue').click();
        const interval = setInterval(() => {
            const tabsMenu = document.querySelector('#horizontal');
            const elements = tabsMenu.querySelectorAll('*');
            const elementsArray = Array.from(elements);
            const reviewElement = elementsArray.find((element) => element.outerText.trim() === 'Review');
            if (reviewElement) {
                const menuItem = reviewElement.querySelector('.menu-item a');
                const idValue = menuItem.id;
                const element = document.querySelector('#' + idValue);
                if (element) {
                    document.getElementById(idValue).click();
                    $('#customfield_17201').val(formatCurrentDateTime());
                    const metaElement = document
                        .querySelector('meta[name="ajs-remote-user-fullname"]')
                        .getAttribute('content');
                    $('#customfield_17203-field').val(metaElement);
                    document.getElementById('customfield_17203-field').click();
                    clearInterval(interval);
                }
            }
        }, 500);
        const intervals = setInterval(() => {
            const element1 = document.querySelector('#showing-1-of-1-matching-users');
            console.log(element1);
            if (element1) {
                document.querySelector('#showing-1-of-1-matching-users li').click();
                clearInterval(intervals);
            }
        }, 500);
    });
    RealMonitorMe();
    registerSearchMenu();
    registerExceptionMenu();
    registerCustomQuickReplyMenu();
    addCss();
    MonitorDev();
})();
