// ==UserScript==
// @name         agresso
// @version      1.0
// @description  make agresso UNIT4 more PM-ffriendly
// @author       Christopher Trampisch
// @match        https://erp.adesso.de/erp/ContentContainer.aspx*
// @grant        none
// @namespace https://greasyfork.org/users/184714
// @downloadURL https://update.greasyfork.org/scripts/367699/agresso.user.js
// @updateURL https://update.greasyfork.org/scripts/367699/agresso.meta.js
// ==/UserScript==

(function() {

    //Description
    var nodes = document.querySelectorAll('[data-fieldname="description"]');
    for (i = 0; i < nodes.length; ++i) {
        nodes[i].setAttribute("style","width: 400px;");
    }

    //Arb Auftritt
    nodes = document.querySelectorAll('[data-fieldname="work_order"]');
    for (i = 0; i < nodes.length; ++i) {
        nodes[i].setAttribute("style","width: 120px;");
    }

    //Projekt
    nodes = document.querySelectorAll('[data-fieldname="project"]');
    for (i = 0; i < nodes.length; ++i) {
        nodes[i].setAttribute("style","width: 120px;");
    }

    //Zellen Infos direkt anzeiten
    nodes = document.querySelectorAll('td');
    for (i = 0; i < nodes.length; ++i) {
        if (nodes[i].getAttribute('title') !==null) {

            var cellIndex = nodes[i].cellIndex;
            var headerRow = nodes[i].parentNode.parentNode.parentNode;
            var headers = headerRow.getElementsByTagName("th");

            if (headers[cellIndex]!==null && headers[cellIndex].getAttribute('data-fieldname') !==null && (headers[cellIndex].getAttribute('data-fieldname') == "work_order" || headers[cellIndex].getAttribute('data-fieldname') == "project")) {
                var para = document.createElement("p");
                para.setAttribute("style","font-size: 10px;");
                var node = document.createTextNode(nodes[i].title.substring(0, nodes[i].title.indexOf('-')));
                para.appendChild(node);
                nodes[i].appendChild(para);
            }
        }
    }
})();