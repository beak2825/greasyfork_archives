// ==UserScript==
// @name         A9 Image Survey
// @namespace    https://greasyfork.org/en/users/12709
// @version      0.2
// @description  adds keybindings
// @author       feihtality
// @match        https://s3.amazonaws.com/mturk_bulk/hits/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19923/A9%20Image%20Survey.user.js
// @updateURL https://update.greasyfork.org/scripts/19923/A9%20Image%20Survey.meta.js
// ==/UserScript==
// jshint esnext:true

(function() {
    'use strict';

    const get = (...args) => (args[1] ? args[0] : document).querySelector(args[1] || args[0]),
          getAll = (...args) => (args[1] ? args[0] : document).querySelectorAll(args[1] || args[0]),
          KB = { HR1: 49, HR8: 56, NUM1: 97, NUM8: 104, ENTER: 13 };

    let state = [ 'dress', 'womensTop', 'womensBottom', 'mensTop', 'mensBottom', 'watch', 'shoe', 'personalBag' ].map(() => false),
        fg = [].filter.call(get(document.head, 'style').sheet.cssRules, v => v.cssText.includes('form-group'));

    document.addEventListener('keydown', e => {
        const offset = ((k) => k >= KB.NUM1 && k <= KB.NUM8 ? 96 : k >= KB.HR1 && k <= KB.HR8 ? 48 : null)(e.keyCode);
        if (e.keyCode === KB.ENTER) return get('input[type=submit]').click();
        else if (!offset) return;
        get(`.btn[data-reactid*="$q${e.keyCode - offset}"]:not([data-reactid$="$${+!state[e.keyCode - offset -1]}"])`).click();
        state[e.keyCode - offset -1] = !state[e.keyCode - offset -1];
    });

    [].forEach.call(getAll('h4[class^="qHeadline"]'), (v,i) => { v.parentNode.appendChild(v); v.textContent = `[${i+1}] ${v.textContent}`; });
    [].forEach.call(getAll('[data-reactid$="$1"]'), v => v.click());
    get('hr').style.display = 'none';
    fg[0].style.setProperty('margin-bottom', '0px', 'important');
    fg[0].style.display = 'flex';
    window.focus();
})();
