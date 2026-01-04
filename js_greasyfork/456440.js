// ==UserScript==
// @name         Colorful Course
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Try and see
// @author       Ajax
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.xkBksZytjb.do*
// @match        https://zhjwxkyw.cic.tsinghua.edu.cn/xkBks.xkBksZytjb.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsinghua.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456440/Colorful%20Course.user.js
// @updateURL https://update.greasyfork.org/scripts/456440/Colorful%20Course.meta.js
// ==/UserScript==

'use strict';

function colorOne(td, sum, available) {
    var l = td.text.split(",");

    if (l[0][0] === '(') {
        l = l[0].substr(1, l[0].length - 1).split(")").concat(l.slice(1));
    }

    var html = "";
    for (var i=0; i<l.length; ++i) {
        l[i] = Number(l[i]);

        if (sum > available) {
            html += `<span style="color:red">${l[i]}</span>,`;
        }
        else if ((sum += l[i]) > available) {
            html += `<span style="color:orange">${l[i]}(${l[i] - (sum - available)})</span>,`;
        }
        else {
            html += `<span style="color:green">${l[i]}</span>,`;
        }
    }

    td.innerHTML = html.substr(0, html.length - 1);
    return sum;
}

(function() {
    const f = function() {
        if (document.readyState !== "complete") {
            console.log("Document not ready, waiting");
            setTimeout(f, 500);
            return;
        }

        console.log("Colorful script attached.")

        if (document.body.innerHTML.search("p_lrdwnm") !== -1)
        {
            console.log("Found undergraduate course list");
            document.getElementsByClassName("trr2").forEach((tr) => {
                var available = Number(tr.children[4].text);
                var total = Number(tr.children[5].text);
                var sum = 0;

                sum = colorOne(tr.children[6], sum, available);
                sum = colorOne(tr.children[7], sum, available);
                sum = colorOne(tr.children[8], sum, available);
            });
            console.log("Done");
        }

        else if (document.body.innerHTML.search("tbzySearchTy") !== -1) {
            console.log("Found undergraduate PE course list");
            document.getElementsByClassName("trr2").forEach((tr) => {
                var available = Number(tr.children[3].text);
                var total = Number(tr.children[4].text);
                var sum = 0;

                sum = colorOne(tr.children[5], sum, available);
            });
            console.log("Done");
        }
    };

    setTimeout(f, 500);
})();