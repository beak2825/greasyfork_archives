// ==UserScript==
// @name         Blackboard Collaborate Playback Downloader
// @namespace    http://github.com/nixklai/BbC-Playback
// @version      0.0.3
// @description  Enable playback download in Blackboard Collaborate
// @author       Nick Lai
// @resource     THE_CSS  https://cdn.rawgit.com/needim/noty/77268c46/lib/noty.css
// @match        https://au-lti.bbcollab.com/collab/ui/scheduler/**
// @match        https://au.bbcollab.com/collab/ui/scheduler/**
// @require      https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js
// @require      https://cdn.jsdelivr.net/npm/a11y-dialog@5.3.1/a11y-dialog.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/398998/Blackboard%20Collaborate%20Playback%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/398998/Blackboard%20Collaborate%20Playback%20Downloader.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    GM_addStyle (GM_getResourceText('THE_CSS'));

    const formatHTML = output => {
        let html = '';
        html += `<div class="dialog-overlay" tabindex="-1" data-a11y-dialog-hide></div>` +
                `<dialog class="dialog-content" aria-labelledby="dialogTitle" aria-describedby="dialogDescription" style="height: 80%; overflow-y: scroll;">` +
                `<button data-a11y-dialog-hide class="dialog-close" aria-label="Close this dialog window">&times;</button>`;
        html += '<table>';
        html += `<tr><td colspan="3"><a id="copy-to-clipboard" class="button">Copy to Clipboard</a> <a id="copy-to-aria" class="button">Copy to Aria</a></td><tr>`

        output.forEach(obj => {
            html += '<tr>' +
                `<td>${obj.sessionName}<td><td>${obj.mediaName}<td><td><a target="_blank" href="${obj.url}" download="${obj.mediaName}.mp4">Video</a></td>` +
                '</tr>'
        });

        html += '</div>';
        html += '</table>';
        return html;
    }

    const printTable = output => {
        let html = formatHTML(output);

        let newHTML = document.createElement('div');
        newHTML.setAttribute('id', 'nixklai-BbC-Downloader-VideoList-Modal');
        newHTML.setAttribute('class', 'dialog');
        newHTML.innerHTML = html;
        document.body.appendChild(newHTML);

        const dialog = new A11yDialog(newHTML, document.querySelector('body'));
        dialog.show();

        const $button = document.querySelector('#main-content > header > a');
        $button.setAttribute('href', '');

        const $tooltip = document.querySelector('#main-content > header > a > div > span');
        $tooltip.innerText = 'Show URL to all video';

        $button.onclick = () => { dialog.show(); }

        const $icon = document.querySelector('#main-content > header > a > bb-svg-icon > svg');
        $icon.innerHTML = `<path d="M 14.964844 8.871094 C 14.914062 8.746094 14.792969 8.664062 14.65625 8.664062 L 11.003906 8.664062 L 11.003906 0.332031 C 11.003906 0.148438 10.855469 0 10.671875 0 L 5.339844 0 C 5.15625 0 5.007812 0.148438 5.007812 0.332031 L 5.007812 8.664062 L 1.34375 8.664062 C 1.207031 8.664062 1.085938 8.746094 1.035156 8.867188 C 0.984375 8.992188 1.011719 9.136719 1.105469 9.230469 L 7.753906 15.902344 C 7.816406 15.964844 7.902344 16 7.988281 16 C 8.078125 16 8.164062 15.964844 8.226562 15.902344 L 14.894531 9.234375 C 14.988281 9.136719 15.015625 8.996094 14.964844 8.871094 Z M 14.964844 8.871094"/>`;

        document.getElementById('copy-to-clipboard').onclick = () => {
            const string = output.map(vid => `${vid.url}`).join("\n");
            navigator.clipboard.writeText(string);
            new Noty({
                text: "Copied!",
                timeout: 2500,
            }).show();
        };

        document.getElementById('copy-to-aria').onclick = () => {
            const string = output.map(vid =>
                                      `${vid.url}` + "\n" +
                                      `  dir=${vid.sessionName}` + "\n" +
                                      `  out=${vid.sessionName} - ${vid.mediaName}.mp4`)
            .join("\n");
            navigator.clipboard.writeText(string);
            new Noty({
                text: "Copied!",
                timeout: 2500,
            }).show();
        };
    }

    const url = new URL(window.location);
    const token = url.searchParams.get('token');

    const searchParams = new URLSearchParams({
        startTime: `${new Date().getFullYear() - 1}-09-01T00:00:00+0800`,
        endTime:   `${new Date().getFullYear() + 1}-08-31T00:00:00+0800`,
        sort:      'startTime',
        order:     'desc',
        limit:     '1000',
        offset:    '0',
    });

    const response = await fetch(
        `https://au-lti.bbcollab.com/collab/api/csa/recordings?${searchParams.toString()}`,
        {headers:
           {'Authorization': `Bearer ${token}`}
        }
    );
    const video_response = (await response.json()).results;
    const video_ids = video_response.map(i => i.id)
    console.log('response', video_ids);

    const mp4_response = await Promise.all(video_ids.map(async url => {
        return await fetch(`https://au.bbcollab.com/collab/api/csa/recordings/${url}/data`)
    }));
     const mp4_objects = await Promise.all(mp4_response.map(async resp => {
        return await resp.json()
    }));

    let output = mp4_objects.map((val, key) => {
        return {
            url: val.streams.WEB,
            ...video_response[key],
        }
    });

    printTable(output);
    console.log(output);
})();