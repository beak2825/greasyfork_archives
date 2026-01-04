// ==UserScript==
// @author          Particle_G
// @description     Avoid switch screen detection in exams
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @icon            https://www.google.com/s2/favicons?sz=64&domain=h3c.com
// @license         MIT
// @match           *lmsn.h3c.com/ems/html/examCenter/fullExamTemp.do*
// @name            Avoid Detection
// @namespace       http://tampermonkey.net/
// @require         https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @resource        MDUI_CSS https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css
// @version         1.0.0
// @downloadURL https://update.greasyfork.org/scripts/450058/Avoid%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/450058/Avoid%20Detection.meta.js
// ==/UserScript==

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

const loadExternalResources = () => {
    // Load remote CSS
    GM_addStyle(GM_getResourceText("MDUI_CSS"));
}

const cancelDialog = () => {
    let button = document.querySelector(".btns-wrap > .btn-blue, .exam-dailog-ok-btn");
    if (button && button.innerText === "继续答题") {
        button.click();
    }
}

var interval = null;

(async () => {
    'use strict';
    loadExternalResources();

    let examSubButtons = document.querySelector(".exam-sub-btns");
    while (!examSubButtons) {
        console.info('Waiting for examSubButtons to be available...');
        await sleep(250);
        examSubButtons = document.querySelector(".exam-sub-btns");
    }

    let $ = mdui.$;
    document.body.classList.add("mdui-theme-accent-blue");
    $(examSubButtons).prepend(
        $('<label class="mdui-switch mdui-m-b-1">屏蔽切屏检测&nbsp;&nbsp;<input type="checkbox" id="toggleMode"/><i class="mdui-switch-icon"/i></label>')
    );
    $('#toggleMode').on('change', (event) => {
        if (event.target.checked) {
            interval = setInterval(cancelDialog, 16);
        } else {
            clearInterval(interval);
        }
    });
})();
