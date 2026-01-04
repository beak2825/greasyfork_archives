// ==UserScript==
// @name         Auto YT channel SPAM report
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Report YT channels for spamming
// @author       You or me
// @match        https://*.youtube.com/channel/*/about
// @match        https://*.youtube.com/c/*/about
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/429296/Auto%20YT%20channel%20SPAM%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/429296/Auto%20YT%20channel%20SPAM%20report.meta.js
// ==/UserScript==

const defaultDelayBetweenClicks = 1000; // in ms
const defaultReportText = '';
const defaultChannelsToReport = '';

GM_config.init(
    {
        'id': 'AutoYTSPAMreport',
        'fields':
        {
            'delayBetweenClicks':
            {
                'label': 'Delay between clicks in milliseconds',
                'type': 'int',
                'default': defaultDelayBetweenClicks
            },
            'reportText':
            {
                'label': 'Report text',
                'type': 'textarea',
                'default': defaultReportText
            },
            'channelsToReport':
            {
                'label': 'Channles to report. Each channel should be in a new line in a form of https://www.youtube.com/channel/_uid_/about',
                'type': 'textarea',
                'default': defaultChannelsToReport
            }
        }
    });

GM_registerMenuCommand("Config", (async () => {
    await GM.deleteValue('reportIndex');
    GM_config.open();
}));
GM_registerMenuCommand("Run", (async () => {
    await GM.setValue('state', 'run');
    await run();
}));
GM_registerMenuCommand("Stop", (async () => await GM.setValue('state', 'stop')));

function getElementsByText(str, tag = 'a') {
  return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
}

async function run() {
    try {
        const state = await GM.getValue('state', 'stop');
        if (state === 'stop') return;

        const delayBetweenClicks = GM_config.get('delayBetweenClicks');
        const reportText = GM_config.get("reportText");
        if (reportText === '') {
            alert('Report text should not be empty. Please confuigure the script');
            await GM.setValue('state', 'stop');
            return;
        }
        const channelsToReport = GM_config.get("channelsToReport");
        const channels = channelsToReport.split('\n').filter(el => el !== '');
        if (channels.length === 0) {
            alert('Empty list of channels to report. Please confuigure the script')
            return;
        }

        let index = await GM.getValue('reportIndex', '');
        if (index === '') {
            index = 0;
            await GM.setValue('reportIndex', index);
            window.location.assign(channels[index]);
            return;
        }
        index = parseInt(index);

        setTimeout(() => document.querySelector("button[aria-label='Report user']").click(), delayBetweenClicks * 1);
        setTimeout(() => getElementsByText('Report user', 'yt-formatted-string')[0].click(), delayBetweenClicks * 2); // select report channel option
        setTimeout(() => document.querySelectorAll("[id='radioLabel']")[6].click(), delayBetweenClicks * 3); // select 7th radio button, SPAM report
        setTimeout(() => document.querySelector("tp-yt-paper-button[aria-label='Next']").click(), delayBetweenClicks * 4);
        setTimeout(() => document.querySelector("tp-yt-paper-button[aria-label='Next']").click(), delayBetweenClicks * 5);
        setTimeout(() => {
            document.querySelector("textarea[aria-describedby='paper-input-add-on-1']").value = reportText;
            document.querySelector("textarea[aria-describedby='paper-input-add-on-1']").dispatchEvent(new InputEvent('input', { bubbles: true, inputType: "insertText", data: "p", composed: true }));
        }, delayBetweenClicks * 6);
        setTimeout(() => document.querySelector("tp-yt-paper-button[aria-label='Submit']").click(), delayBetweenClicks * 7);

        index++
        if (index >= channels.length) {
            await GM.deleteValue('reportIndex');
            await GM.setValue('state', 'stop');
            setTimeout(() => alert('Finished'), delayBetweenClicks * 8);
            return;
        } else {
            await GM.setValue('reportIndex', index);
            setTimeout(() => window.location.assign(channels[index]), delayBetweenClicks * 8);
        }
    } catch (err) {
        alert(err)
    }
};

run()
