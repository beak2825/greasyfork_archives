// ==UserScript==
// @name         UNBINDINATOR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Oto jest, spółka ZŁO, DUUUNDEEERSZTYYYCAAA
// @author       ja
// @match        http://tx-b-hierarchy-dub.dub.proxy.amazon.com/unbindHierarchy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400170/UNBINDINATOR.user.js
// @updateURL https://update.greasyfork.org/scripts/400170/UNBINDINATOR.meta.js
// ==/UserScript==

var tablica = new Array();
var ile = 0;
var textarea;
var paczka;
var i = 0;

setInterval(function()
            {
    if(document.getElementsByClassName("hot-key-handler")[6] != null && document.getElementsByClassName("hot-key-handler")[6] != undefined)
    {
        if(document.getElementById("sweep_div") == null || document.getElementById("sweep_div") == undefined)
        {
            document.getElementsByClassName("menu-item-title")[1].click()
            var sweep_div = document.createElement ('div');
            sweep_div.innerHTML = '<br><br><textarea id="sweep_textarea" rows="4" cols="50"></textarea>';
            sweep_div.setAttribute ('id', 'sweep_div');
            document.getElementsByTagName("body")[0].appendChild(sweep_div);

            var sweep_button_div = document.createElement ('div');
            sweep_button_div.innerHTML = '<input id="sweep_button" type="button" value="U.N.B.I.N.D."></input>';
            sweep_button_div.setAttribute ('id', 'sweep_button_div');
            document.getElementsByTagName("body")[0].appendChild(sweep_button_div);

            document.getElementById("sweep_button").addEventListener (
                "click", ButtonPRESS, false
            );

            function ButtonPRESS (zEvent)
            {
                textarea = document.getElementById("sweep_textarea").value;
                tablica = textarea.split("\n");

                if(tablica[0] != "")
                {
                    i = 0;
                    ile = tablica.length;
                    console.log(ile);

                    var zegar = setInterval(function()
                                            {
                        if(document.getElementsByTagName("input")[0].value == "" && tablica[i] != undefined)
                        {
                            document.getElementsByTagName("input")[0].value = tablica[i];
                            tablica.splice(0,1);
                            var newtext = tablica.join('\n');
                            document.getElementById("sweep_textarea").value = newtext;

                        }
                        if(tablica[0] == undefined)
                        {
                            clearInterval(zegar);
                        }
                        if(document.getElementsByClassName("hot-key-handler")[6] != null && document.getElementsByClassName("hot-key-handler")[6] != undefined)
                        {
                         document.getElementsByClassName("hot-key-handler")[6].click();
                        }
                    },300);
                }
            }
        }
    }
},200);