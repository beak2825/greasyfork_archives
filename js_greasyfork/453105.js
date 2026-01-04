// ==UserScript==
// @name         StreamableDownloader
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Downloads the current Streamable video when you click the button.
// @author       Contrapunctus-XIV
// @match        *://streamable.com/*
// @icon         https://cdn0.iconfinder.com/data/icons/ui-line-pixel-perfect-3/32/user_interface_UI_line_download_unduh_media_ui-512.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453105/StreamableDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/453105/StreamableDownloader.meta.js
// ==/UserScript==

const DELAY = 850;

(function() {
    'use strict'
    const videoID = window.location.href.split('/')[3];
    const bar = document.querySelector('#player-' + videoID +'-info > div.flex.gap-3');
    const btn = document.createElement('button');

    const handleClick = (event) => {
        const videoURL = document.getElementsByTagName('video')[0].getElementsByTagName('source')[0].getAttribute('src');
        if (videoURL.includes('cdn-cf-east.streamable.com')) {
            window.location.href = videoURL;
        }
        else {
            alert('Your download will begin in a few seconds');

            fetch(videoURL).then(response => { return response.blob(); })
                .then(blob => {
                var urlCreator = window.URL || window.webkitURL;
                var videoLink = urlCreator.createObjectURL(blob);
                var tag = document.createElement('a');
                tag.href = videoLink;
                tag.target = '_blank';
                tag.download = videoID + '.mp4';
                document.body.appendChild(tag);
                tag.click();
                document.body.removeChild(tag);
            })
                .catch(err => {
                alert('ERROR : Failed to download the video. Please try again. \n If it still doesn\'t work, you can contact the script author on greasyfork.org with the video URL.');
            });
        }
    }
    btn.setAttribute('class', "below-video__video-actions__cta js-download-btn tw-box-border tw-inline-flex tw-flex-row tw-flex-nowrap tw-justify-center tw-items-center tw-font-semibold tw-relative after:tw-content-[''] after:tw-block after:tw-w-full after:tw-h-full after:tw-absolute after:tw-top-0 after:tw-left-0 after:tw-opacity-0 after:tw-transition-opacity disabled:tw-border-gray-100 disabled:tw-text-gray-700/38 disabled:after:tw-hidden dark:disabled:tw-text-gray-300/38 disabled:tw-text-label-tertiary tw-shadow-sm disabled:tw-bg-gray-100 dark:disabled:tw-bg-gray-700 disabled:tw-bg-surface-tertiary tw-bg-brand-secondary tw-text-gray-700 after:tw-bg-gray-700 hover:after:tw-opacity-8 active:after:tw-opacity-8 focus:after:tw-opacity-8 dark:tw-bg-brand-secondary-dark-mode dark:tw-text-gray-300 dark:after:tw-bg-gray-300 child:tw-fill-black child:dark:tw-fill-gray-300 tw-text-base tw-rounded tw-h-9 after:tw-rounded tw-px-3 tw-gap-1");
    btn.addEventListener('click', handleClick);

    const img_download = document.createElement('span');
    img_download.setAttribute('class', 'material-icons -ml-1 -mt-0.5');
    img_download.textContent = 'download';

    const txt_download = document.createElement('span');
    txt_download.textContent = 'Download';

    btn.appendChild(img_download);
    btn.appendChild(txt_download);

    setTimeout(function() {
        bar.appendChild(btn);
    }, DELAY);
})();