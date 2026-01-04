// ==UserScript==
// @name         GPA Calculator
// @namespace    https://imtwice.cn
// @version      0.1.1
// @description  why does Zhengfang have no GPA statistics
// @author       Twice
// @match        http://jwglxt.qust.edu.cn/jwglxt/cjcx/cjcx_cxDgXscj.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380684/GPA%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/380684/GPA%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    document.getElementById("search_go").addEventListener('click', async function(){
        var last = document.getElementById("gpa-block")
        if(last) last.remove()

        await sleep(1000);

        let sum = 0, credits = 0;
        let first = true;
        for (let i of document.getElementById("tabGrid").children[0].children) {
            if(first) {
                first = false;
                continue;
            }
            if(i.className != "emptyrow" && i.children.length != 0) {
               let credit = +i.children[6].innerHTML
               let point = +i.children[9].innerHTML
               sum += credit * point
               credits += credit
            }
        }

        let gpa = sum / credits
        let str = " GPA: " + gpa.toFixed(2)
        console.log(str)
        let node = document.createElement("span")
        node.id = "gpa-block"
        let txt = document.createTextNode(str)
        node.appendChild(txt)
        document.getElementById("btn_sortSetting").insertAdjacentElement("afterend", node)
    }, false);
})();