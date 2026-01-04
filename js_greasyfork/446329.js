// ==UserScript==
// @name         Komica WebM linker
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  webm linker
// @author       72
// @include      https://*.komica.org/00*/pixmicat.php?mode=category&c=WebM*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/446329/Komica%20WebM%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/446329/Komica%20WebM%20linker.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    var No = document.querySelectorAll('.qlink'); //find Post No.

    for(var i=0; i<No.length; i++)
    {

        var num = No[i].textContent.replace("No.",""); //Delete prefix

        let button = document.createElement("button"); //create button

        var link = document.createElement("a"); //create link

        var link2 = document.createElement("b"); //create link for search

        link.setAttribute('href','pixmicat.php?res='+num); //set link
        link.setAttribute('target','_blank'); //set link to open in new tab
        link.innerHTML = "試圖前往原串"; //set link

        link2.setAttribute('href','pixmicat.php?mode=search'); //set link2

        button.innerHTML = "搜尋原串"; //set button
        button.name = num; //name every button to let clipboard can have things to copy

        document.getElementsByClassName('post-head')[i].appendChild(link); //add link
        document.getElementsByClassName('post-head')[i].appendChild(button); //add button

        button.onclick = function () //set onclick movement
        {
           /* navigator.clipboard.writeText(button.name).then( //copy to clipboard

            function()
            {*/
                var new_window = window.open('pixmicat.php?mode=search','_blank'); //open search page
                new_window.onload = function ()
                {
                let Number = new_window.document.getElementsByName("keyword"); //get keyword input form
                Number[0].value = button.name; //auto fill-in search Number

                new_window.document.querySelector('select[name="field"]').value = "no"; //auto select search target to number
                };
           /* },
                                                            function()
            {
                alert('Error'); //if fail
            });*/


        }

    }


})();
