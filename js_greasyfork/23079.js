// ==UserScript==
// @name         ArbeitArbeit
// @namespace    ArbeitArbeit
// @version      0.1
// @description  addStyles
// @author       Dummbroesel
// @match        file:///Volumes/Websites/accountinfo.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23079/ArbeitArbeit.user.js
// @updateURL https://update.greasyfork.org/scripts/23079/ArbeitArbeit.meta.js
// ==/UserScript==

function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.$=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    function main() {
        console.info('JQuery loaded.');
        var stylesToAdd = '<style>table{width:100%;margin-top:20px;}tr{position:relative;}tr:nth-of-type(1){position:fixed;top:0;width:100%;height:24px;}tr:nth-of-type(2n+1){background:#FFF;}tr:nth-of-type(2n+2){background:#EEE;}td,th{display:block;float:left;}td:nth-of-type(1),th:nth-of-type(1){width:320px;}td:nth-of-type(2),th:nth-of-type(2){width:384px;}td:nth-of-type(3),th:nth-of-type(3) {width:165px;}td:nth-of-type(4),th:nth-of-type(4){width:70px;}td:nth-of-type(5),th:nth-of-type(5){width:170px;}td:nth-of-type(6),th:nth-of-type(6){width:165px;}td:nth-of-type(7),th:nth-of-type(7){width:115px;}td:nth-of-type(8),th:nth-of-type(8){width:139px;}td:nth-of-type(9),th:nth-of-type(9){width:172px;}td:nth-of-type(10),th:nth-of-type(10){width:165px;}</style>';
        $(stylesToAdd).appendTo('head');

        $('td').click(function (a,b,c,d,e){
            var selection = window.getSelection();
            var succeed;
            try {
                selection.setBaseAndExtent(this, 0, this, 1);
                succeed = document.execCommand("copy");
            } catch (err) {
                console.dir(err);
            }
        });
    }
    addJQuery(main);

