// ==UserScript==
// @name			make_qingsuyun_selectable
// @description		make the text of exam in qingsuyun selectable
// @namespace		liudonghua123
// @version        	0.1.5
// @license        	MIT
// @include        	http*://www.qingsuyun.com/*
// @include        	http*://www.qingsuyun.com/h5/p/strat/exam
// @include        	http*://www.qingsuyun.com/h5/m/exam-process
// @downloadURL https://update.greasyfork.org/scripts/481346/make_qingsuyun_selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/481346/make_qingsuyun_selectable.meta.js
// ==/UserScript==

// https://bobbyhadz.com/blog/javascript-wait-for-element-to-exist
async function waitForElementToExist(selector, interval = 300, timeout = 10000) {
    let element = document.querySelector(selector);
    if (element) {
        console.log('The element exists');
        return element;
    }
    const started_time = new Date();
    return new Promise(function(resolve, reject) {
        const intervalID = setInterval(() => {
            element = document.querySelector(selector);
            if (element) {
                console.log('The element exists');
                clearInterval(intervalID);
                resolve(element);
            }
            if (new Date() - started_time > timeout) {
                console.log('Timeout, clearInterval');
                clearInterval(intervalID);
                resolve(null);
            }
        }, interval);
    });
}

function addStyle(styles) {
    /* Create style element */
    const css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet) {
        css.styleSheet.cssText = styles;
    } else {
        css.appendChild(document.createTextNode(styles));
    }
    /* Append style to the head element */
    document.getElementsByTagName("head")[0].appendChild(css);
}

// For both desktop and mobile version
function do_work() {
    // process body.onselectstart
    document.body.onselectstart = null;
    console.info(`processed body.onselectstart`);

    // https://developer.mozilla.org/en-US/docs/Web/CSS/important
    const userSelectStyle = `
      * {
          user-select: text !important;
          --webkit-user-select: text !important;
      }
	`;
    addStyle(userSelectStyle);

    // make all the text in span selectable
    if (document.querySelector('#exam-progress-main-content-area')) {
        for (const span of document.querySelectorAll('#exam-progress-main-content-area span')) {
            // see also https://developer.mozilla.org/zh-CN/docs/Web/CSS/user-select
            span.style.userSelect = 'text';
        }
        console.info(`processed spans of question-answer-todo-area`);
    }
}

(async () => {
    const element = await waitForElementToExist('#exam-progress-main-content-area');
    if (element) {
        do_work()
    };
})();