// ==UserScript==
// @name        Wolfram Alpha free step-by-step solutions
// @namespace   convexcave
// @match       https://www.wolframalpha.com/input
// @match       https://www.wolframalpha.com/input/
// @match       http://www.wolframalpha.com/input
// @match       http://www.wolframalpha.com/input/
// @grant       none
// @version     1.1
// @license     MIT
// @author      wengh
// @run-at      document-idle
// @description 2021/5/10下午5:13:39
// @downloadURL https://update.greasyfork.org/scripts/426285/Wolfram%20Alpha%20free%20step-by-step%20solutions.user.js
// @updateURL https://update.greasyfork.org/scripts/426285/Wolfram%20Alpha%20free%20step-by-step%20solutions.meta.js
// ==/UserScript==

submitBtn = document.querySelector('button[type=submit]');
wolfreeBtn = submitBtn.cloneNode(true);
wolfreeBtn.replaceChildren('F');
submitBtn.parentElement.appendChild(wolfreeBtn);
wolfreeBtn.onclick = function() {
    var qd = {};
    if (location.search) location.search.substr(1).split("&").forEach(function(item) {
        var s = item.split("="),
            k = s[0],
            v = s[1] && decodeURIComponent(s[1].replaceAll('+', '%20')); //  null-coalescing / short-circuit
        //(k in qd) ? qd[k].push(v) : qd[k] = [v]
        (qd[k] = qd[k] || []).push(v) // null-coalescing / short-circuit
    });
    link = 'https://wolfreealpha.github.io/#' + qd['i'];
    location.href = link;
};