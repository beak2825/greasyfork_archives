// ==UserScript==
// @name                Expose video url classroom
// @namespace           https://greasyfork.org/users/821661
// @match               https://drive.google.com/file/d/*/view
// @grant               none
// @run-at              document-start
// @version             1.0
// @author              hdyzen
// @description         expose video url classroom
// @license             GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/510317/Expose%20video%20url%20classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/510317/Expose%20video%20url%20classroom.meta.js
// ==/UserScript==
'use strict';

const dButton = document.createElement('a');
dButton.innerHTML = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="36px" height="36px"><g stroke-width="1" fill-rule="evenodd"><g fill="#fff" transform="translate(85.333333, 64.000000)"><path d="M128,63.999444 L128,106.666444 L42.6666667,106.666667 L42.6666667,320 L256,320 L256,234.666444 L298.666,234.666444 L298.666667,362.666667 L4.26325641e-14,362.666667 L4.26325641e-14,64 L128,63.999444 Z M362.666667,1.42108547e-14 L362.666667,170.666667 L320,170.666667 L320,72.835 L143.084945,249.751611 L112.915055,219.581722 L289.83,42.666 L192,42.6666667 L192,1.42108547e-14 L362.666667,1.42108547e-14 Z" class=""></path></g></g></svg>`;
dButton.target = '_blank';
dButton.style = 'position: fixed; bottom: 10px; right: 10px; z-index: 999999;';

const originalXHR = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    if (url.includes('get_video_info')) {
        this.addEventListener('readystatechange', function (e) {
            if (this.readyState === 4) {
                try {
                    const parsedParams = new URLSearchParams(e.target.responseText);
                    const urls = parsedParams
                        .get('fmt_stream_map')
                        .split(',')
                        .map(url => url.split('|')?.[1]);

                    console.log(urls);

                    dButton.href = urls.at(-1);
                    document.documentElement.appendChild(dButton);
                } catch (error) {
                    console.error('Erro ao pegar source do video:', error);
                }
            }
        });
    }
    return originalXHR.apply(this, arguments);
};
