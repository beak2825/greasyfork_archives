// ==UserScript==
// @name         Jira Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script injection for additional features implementation
// @author       Jonty
// @match        https://jira.abinmetall.ru/secure/RapidBoard.jspa?rapidView=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=abinmetall.ru
// @grant        none
// @require
// @downloadURL https://update.greasyfork.org/scripts/444874/Jira%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/444874/Jira%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function () {
        let title = document.title;
        let reqURL = "//172.16.101.77:5001/user_filter/" + title;
        document.head.innerHTML += '<link href="//172.16.101.77:5001/static/filter.css" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>';

        let customScript = document.createElement('script');
        customScript.type = 'text/javascript';
        customScript.src = "//172.16.101.77:5001/static/scripts.js";
        document.head.appendChild(customScript);

        let jqueryScript = document.createElement('script');
        jqueryScript.type = 'text/javascript';
        jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        document.head.appendChild(jqueryScript);

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    document.getElementById("js-quickfilters-label").innerHTML += xmlhttp.response;
                }
                else if (xmlhttp.status == 400) {
                    alert('There was an error 400');
                }
                else {
                    alert('something else other than 200 was returned');
                }
            }
        };

        xmlhttp.open("GET", reqURL, true);
        xmlhttp.setRequestHeader('Content-Type', 'text/html');
        xmlhttp.responseType = "text";
        xmlhttp.send();
    }, 1000);


    function btn_more() {
        document.getElementById('#d_cont').toggleClass('dropdown__content-show');
    };
})();
