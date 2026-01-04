// ==UserScript==
// @name         webwork_extension
// @namespace    webwrok.math.ntu.edu.tw
// @version      2.0
// @description  Adds correct ratio to each homework.
// @author       bert30702, oToToT
// @match        *://*.webwork.math.ntu.edu.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393381/webwork_extension.user.js
// @updateURL https://update.greasyfork.org/scripts/393381/webwork_extension.meta.js
// ==/UserScript==

(async function(){
    function getGrade(html_text){
        var m = {};
        let d = new DOMParser();
        let doc = d.parseFromString(html_text, 'text/html');
        let nodes = doc.querySelectorAll("#grades_table tr:not([class=grades-course-total])");
        nodes.forEach(function(ele) {
            let e = ele.getElementsByTagName('td');
            if (e.length) m[e[0].innerText]=e[1].innerText;
        })
        return m;
    }
    let grades_html = await (await fetch("grades/")).text();
    let map = getGrade(grades_html);
    document.querySelectorAll('a[class=set-id-tooltip]').forEach(function(ele) {
        // to hide score in closed problems, please uncomment the statement below
        // if (ele.parentNode.parentNode.innerText.includes('closed')) return;
        let key = ele.innerText;
        let span = document.createElement("span");
        span.innerText = ` ${map[key]}`;
        switch (map[key]) {
            case '100%':
                span.style.color = '#008000';
                break;
            case '0%':
                span.style.color = '#ff0000';
                break;
            default:
                span.style.color = '#1e90ff';
        }
        ele.parentNode.appendChild(span);
    });
})();