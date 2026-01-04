// ==UserScript==
// @name         Testout Retry
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove the Lab Score Report window on testout labs to fix what you missed and quickly resubmit.
// @author       Ultimate
// @match        https://cdn.testout.com/*
// @downloadURL https://update.greasyfork.org/scripts/423599/Testout%20Retry.user.js
// @updateURL https://update.greasyfork.org/scripts/423599/Testout%20Retry.meta.js
// ==/UserScript==

let scoreReportOpen = false;
let lastRetryTime = -1;
let retry = 0;
const prefix = '[Retry] ';
log('INJECTED INTO IFRAME');

//Set interval for checking if lab report is open
setInterval(() => {
    let pre = scoreReportOpen;
    const doneBtn = getDoneBtn();
    scoreReportOpen = doneBtn !== null;
    if (pre != scoreReportOpen) onLabScoreOpened();
}, 100);

function onLabScoreOpened() {
    if (Date.now() - lastRetryTime < 500) return;
    log('SCORE WINDOW OPENED');
    const doneBtn = getDoneBtn();

    if (doneBtn == null || doneBtn == undefined) return;

    //Add our own button
    const retryBtn = document.createElement('button');
    retryBtn.innerText = 'Retry Lab';
    retryBtn.style = 'position: absolute; z-index: 99999; overflow: visible; color: #dd2575; display: inherit; left: 1135px; top: 793px; border-width: 0px; width: 31px; height: 14px; text-align: left; font-family: Arial; font-weight: bold; font-size: 9pt; text-overflow: clip; overflow-wrap: normal; white-space: nowrap;';

    retryBtn.addEventListener('click', () => {
        log('REMOVING LAB SCORE WINDOW..');
        lastRetryTime = Date.now();

        const removeElements = [
            'ScoreReportWindow.Grid',
            'bWindow',
            'DockPanel.Border',
            'DockPanel.Border.Panel.tbTitle',
            'Background',
            'Background.Grid',
            'BackgroundGradient',
            'bPrint.Grid.contentPresenter.Image',
            'DockPanel.Border1',
            'DockPanel.Border1.StackPanel.Border',
            'svResults',
            'pnConnecting.TextBlock',
            'btDone.Grid.Border',
            'btDone.Grid.Border.NormalElement',
            'btDone.Grid.Border.NormalElement.Border',
            'btDone.Grid.contentPresenter.TextBlock',
            'UIRoot.ScoreReportWindow.Grid.bWindow.DockPanel.Border1.StackPanel.Panel.btDone.Grid.Border.NormalElement.Border',
            'UIRoot.ScoreReportWindow.Grid.bWindow.DockPanel.Border1.StackPanel.Panel.btDone.Grid.MouseOverElement',
            '_ifrmreport_',
            'bWindow.DockPanel'
        ];

        retryBtn.remove();

        let removed = 0;

        //Method 1
        removeElements.forEach(id => {
            let el = document.querySelector('#'+id.replace(/\./g, '\\.')); //.s replaced with \\. so it doesnt think its a class
            if (el !== null) {
                el.remove();
                removed++;
            }
        });

        //Method 2 - Loop through all elements because testout changes the names each score for some reason
        const all = document.querySelectorAll('.clsFrameworkElement');
        for (let i = 1; i < all.length; i++) {
            if (all[i].style.zIndex >= 99999 || all[i].id.includes('ScoreReport') || all[i].id.includes('bWindow.DockPanel')) {
                all[i].remove();
                removed++;
            }
        }

        log(`Successfully removed ${removed} elements and destroyed score report window.`); //Done!
        retry++;
    });

    if (doneBtn !== null) doneBtn.parentNode.appendChild(retryBtn);
}

//For some reason on rescore the id is different
function getDoneBtn() {
   const all = document.querySelectorAll('.clsFrameworkElement');

    for (let i = 1; i < all.length; i++) {
        if (all[i].id.includes('Done') && all[i].innerText === 'Done' && all[i].style.display === 'inherit') {
            return all[i];
        }
    }

    return null;
}

function log(msg) {
    console.log(prefix+msg);
}