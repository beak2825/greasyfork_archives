// ==UserScript==
// @name         Mark43 Label Colors
// @version      2025.11.17.001
// @description  Color codes labels in Mark43 reports
// @author       AISD Police IT
// @include      /^https:\/\/.*\.mark43\.com\/.*
// @namespace https://greasyfork.org/users/1253207
// @downloadURL https://update.greasyfork.org/scripts/485662/Mark43%20Label%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/485662/Mark43%20Label%20Colors.meta.js
// ==/UserScript==

(async function(str) {
    var JVstyles = '@-webkit-keyframes blackWhite {'+
        '0% { background-color: red; }'+
        '50% { background-color: red; }'+
        '51% { background-color: ""; }'+
        '100% { background-color: ""; }'+
        '}'+
        '@-webkit-keyframes blackWhiteFade {'+
        '0% { background-color: red; }'+
        '50% { background-color: ""; }'+
        '100% { background-color: ""; }'+
        '}'+
        '#JVRelated {'+
        'background-color: "";'+
        '-webkit-animation-name: blackWhite;'+
        '-webkit-animation-name: blackWhiteFade;'+
        '-webkit-animation-iteration-count: infinite;'+
        '-webkit-animation-duration: 1s'+
        '}';

    function colorLabels() {
        let elements2 = document.getElementsByClassName('sc-dBiCOY iyhYoD');
        let elements = document.getElementsByClassName('RoutingLabels__Label-sc-1j6xyl7-0');
        for(var i = 0; i < elements.length; i++){
            var str = elements[i];
            if (str.innerText == 'CLOSED' || str.innerText == 'UNFOUNDED' || str.innerText == 'COURT DISPOSITION RECEIVED') {
                str = str.style.backgroundColor = "green"
            };
            if (str.innerText == 'ACTIVE' || str.innerText == 'ACTIVE - OFFICER INVESTIGATION PER CID' ) {
                str = str.style.backgroundColor = "blue"
            };
            if (str.innerText == 'ACTIVE PENDING WARRANT ARREST' ) {
                str = str.style.backgroundColor = "orange"
            };
            if (str.innerText == 'CLEARED PENDING COURT') {
                str = str.style.backgroundColor = "red"
            };
            if (str.innerText == 'INACTIVE' || str.innerText == 'ROUTE OTHER AGENCY') {
                elements[i] = str.style.backgroundColor = "yellow"
                elements[i] = str.style.color = "black"
            };
            if (str.innerText == 'JUVENILE RELATED') {
                str.id = 'JVRelated'
            };
        };
        for(var u = 0; u < elements2.length; u++){
            var str2 = elements2[u];
            if (str2.innerText == 'CLOSED' || str2.innerText == 'UNFOUNDED' || str2.innerText == 'COURT DISPOSITION RECEIVED') {
                elements2[u] = str2.style.backgroundColor = "green"
            };
            if (str2.innerText == 'ACTIVE' || str2.innerText == 'ACTIVE - OFFICER INVESTIGATION PER CID' ) {
                elements2[u] = str2.style.backgroundColor = "blue"
            };
            if (str2.innerText == 'ACTIVE PENDING WARRANT ARREST' ) {
                elements2[u] = str2.style.backgroundColor = "orange"
            };
            if (str2.innerText == 'CLEARED PENDING COURT') {
                elements2[u] = str2.style.backgroundColor = "red"
            };
            if (str2.innerText == 'INACTIVE' || str2.innerTExt == 'ROUTE OTHER AGENCY') {
                elements2[u] = str2.style.backgroundColor = "yellow"
                elements2[u] = str2.style.color = "black"
            };
            if (str2.innerText == 'JUVENILE RELATED') {
                str2.id = 'JVRelated'
            };
        };
    };
    function bootstrap(tries = 1) {
        if (/reports/.test(location.href)) {
            console.log('Mark43 Label Colors: Correct page detected.')
            var styleSheet = document.createElement("style")
            styleSheet.innerText = JVstyles
            document.head.appendChild(styleSheet)
            setInterval(colorLabels, 2000);
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        };
    }
    bootstrap();
})();
