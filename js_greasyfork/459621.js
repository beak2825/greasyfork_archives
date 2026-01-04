// ==UserScript==
// @name        Rodar primos - local python
// @autor       Hader Araujo
// @namespace   http://tampermonkey.net/
// @description Script para Rodar primos - local python
// @include     http://localhost:5000/user?*

// @license     MIT
// @version     2.1
// @grant       GM_openInTab
// @grant       window.close
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/459621/Rodar%20primos%20-%20local%20python.user.js
// @updateURL https://update.greasyfork.org/scripts/459621/Rodar%20primos%20-%20local%20python.meta.js
// ==/UserScript==


(function () {
    'use strict';

    console.log("Vamos lá....  ");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = myfunction;

    function loop() {

        var url = 'http://localhost:5000/user_link' + window.location.search;

        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);

    }

    setTimeout(() => {
        console.log("inicio - " + window.location.search.replace('?', ''));
        loop()

    }, 5 * 1000);

    function myfunction() {

        if (xmlhttp && xmlhttp.readyState == 4) {

            let timedelta = 1000 * 5;

            try{
                const jsonParsed = JSON.parse(xmlhttp.responseText)
                if (jsonParsed){

                    const url = jsonParsed['url'];
                    timedelta = jsonParsed['timedelta'];

                    console.log('timedelta: ' + timedelta);

                    if (url) {

                        if (url.includes('https://discord.com/channels/@me?p=')) {

                        url += '&callback=' + window.location.href

                            console.log(url);
                            window.open(url, "_self")

                        } else {
                            console.log(url);
                            GM_openInTab(url, { active: true, insert: true });
                        }
                    }
                }
            }catch(e) {
                console.log("Error...........");
                console.log(e);
            }

            setTimeout(() => {
                loop()
            }, timedelta);
        }
    }
})();