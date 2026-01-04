// ==UserScript==
// @name        Rodar primos - rust
// @autor       Hader Araujo
// @namespace   http://tampermonkey.net/
// @description Script para Rodar primos - rust
// @include     http://localhost:8000/user/*

// @license     MIT
// @version     0.05
// @grant       GM_openInTab
// @grant       window.close
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/459607/Rodar%20primos%20-%20rust.user.js
// @updateURL https://update.greasyfork.org/scripts/459607/Rodar%20primos%20-%20rust.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

(async function () {
    'use strict';

    console.log("inicio - " + window.location.search.replace('?', ''));
    await sleep(1000);

    while(true) {
        var xmlhttp = new XMLHttpRequest();

        var url = 'http://localhost:8000/user/' + window.location.search.replace('?', '');
        xmlhttp.onreadystatechange = myfunction;
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);

        await sleep(2000);

        url = 'http://localhost:8000/user_has_page_to_visit/' + window.location.search.replace('?', '');
        xmlhttp.onreadystatechange = myfunction;
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);

        await sleep(2000);


    }

       async function myfunction() {
         if (xmlhttp.readyState == 4) {
             var link = xmlhttp.responseText;

             if (link === 'yes') {
                 url = 'http://localhost:8000/get_openurl';
                 xmlhttp.onreadystatechange = myfunction;
                 xmlhttp.open("GET", url, true);
                 xmlhttp.send(null);

                 await sleep(2000);

                 url = 'http://localhost:8000/get_follow';
                 xmlhttp.onreadystatechange = myfunction;
                 xmlhttp.open("GET", url, true);
                 xmlhttp.send(null);

                 await sleep(2000);

                 url = 'http://localhost:8000/get_likert';
                 xmlhttp.onreadystatechange = myfunction;
                 xmlhttp.open("GET", url, true);
                 xmlhttp.send(null);

                 await sleep(2000);

                 url = 'http://localhost:8000/visit_page/' + window.location.search.replace('?', '');
                 xmlhttp.onreadystatechange = myfunction;
                 xmlhttp.open("GET", url, true);
                 xmlhttp.send(null);

                 await sleep(2000);
             }

             if (link.startsWith('http')) {
               console.log(link);

               GM_openInTab (link, { active: true, insert: true });
            }
         }
     }
})();