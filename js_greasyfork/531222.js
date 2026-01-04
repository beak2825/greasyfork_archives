// ==UserScript==
// @name         RunPod Show Stop Pod Button. RunPod Larger Logs
// @namespace    http://tampermonkey.net/
// @version      2024-12-24
// @description  RunPod 添加 Stop Pod 按钮。RunPod Log 页面放大
// @author       Ganlv
// @match        https://www.runpod.io/console/*
// @icon         https://www.runpod.io/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531222/RunPod%20Show%20Stop%20Pod%20Button%20RunPod%20Larger%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/531222/RunPod%20Show%20Stop%20Pod%20Button%20RunPod%20Larger%20Logs.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    GM_addStyle(`
.css-fm445e {
    align-items: initial;
}
body > div.MuiDialog-root.MuiModal-root > div.MuiDialog-container.MuiDialog-scrollPaper > div.css-1f59w55 {
    max-width: initial;
    height: 100%;
}
#modal-root .w-full.sm\\:max-w-\\[40rem\\] {
    max-width: 120rem;
}
#modal-root .sm\\:min-h-\\[60dvh\\] {
    min-height: 95dvh;
}
`);
 
    setInterval(() => {
        document.querySelectorAll('span[aria-label="More Actions"][id^="pod-button-"]').forEach((el) => {
            const podId = el.id.replace('pod-button-', '');
            if (el?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector('.MuiLabel-success') && el?.parentElement?.parentElement?.lastElementChild?.textContent !== 'Stop Pod') {
                const span = document.createElement('span');
                span.textContent = 'Stop Pod';
                span.classList.add('custom-stop-pod-button');
                span.style.display = 'flex';
                span.style.marginLeft = '9px';
                span.style.padding = '6px 13.5px';
                span.style.alignItems = 'center';
                span.style.color = '#ffffff';
                span.style.backgroundColor = '#ff0000';
                span.style.borderRadius = '10px';
                span.style.fontWeight = 'bold';
                span.style.fontSize = '0.8125rem';
                span.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';
                span.style.lineHeight = '1.5';
                span.style.textDecoration = 'none';
                span.style.cursor = 'pointer';
                span.addEventListener('click', () => {
                    if (confirm(`Are you sure to stop pod ID: ${podId}?`)) {
                        fetch('https://api.runpod.io/graphql', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${unsafeWindow.Clerk.session.lastActiveToken.jwt.claims.__raw}`,
                                'Content-Type': 'application/json',
                                'X-Team-Id': unsafeWindow.localStorage.getItem('selectedTeam'),
                            },
                            body: JSON.stringify({
                                operationName: 'stopPod',
                                query: 'mutation stopPod($input: PodStopInput!) { podStop(input: $input) { id desiredStatus lastStatusChange } }',
                                variables: {
                                    input: {
                                        podId: podId,
                                    }
                                },
                            }),
                            referrer: 'https://www.runpod.io/',
                            referrerPolicy: 'strict-origin-when-cross-origin',
                            mode: 'cors'
                        }).then(res => res.json()).then(res => {
                            console.log(res);
                            document.querySelector('button[aria-label="Refresh"]')?.click();
                        });
                    }
                });
                el?.parentElement?.parentElement?.insertAdjacentElement('beforeend', span);
            }
        });
    }, 1000);
})();