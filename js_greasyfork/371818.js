// ==UserScript==
// @name         PixelCanvas AntiCaptcha Bot script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Dodges captchas for bots in PixelCanvas
// @author       Jack Burch
// @match        http://pixelcanvas.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371818/PixelCanvas%20AntiCaptcha%20Bot%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/371818/PixelCanvas%20AntiCaptcha%20Bot%20script.meta.js
// ==/UserScript==
main();
function main() {
    console.log('loaded!');
    return async (dispatch, getState) => {
        // TODO
        // dispatch(requestOnline());
        try {
          const state = getState();
        const { fingerprint } = '/your fingerprint here/';
        const body = JSON.stringify({
            x: 0,
            y: 0,
            color: 0,
            fingerprint,
            token: "",
            a: 8,
        });
        const response = await fetch('/api/pixel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
            credentials: 'include',
        });
        const { success, waitSeconds, errors } = await response.json();
        if (response.status === 422) {
            console.log('reloading..');
            location.reload();
            return;
        }
        else {
            setTimeout(main, 40000);
            console.log('Failed, waiting 40 seconds...');
            return;
        }
        // const error = new Error('Network response was not ok.');
        // TODO
        // dispatch(receiveBigChunkFailure(error));
        } catch (error) {
        // TODO
        // dispatch(receiveBigChunkFailure(error));
        }
    };
};