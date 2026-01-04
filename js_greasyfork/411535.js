// ==UserScript==
// @name         Validate Scientific Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       0101010101
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411535/Validate%20Scientific%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/411535/Validate%20Scientific%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var taskNameRegex = "Categorizing Scientific And Pseudoscientific Youtube Videos";
    var taskName = document.getElementsByTagName('h1')[1].innerText; // task name

    if(taskName.search(taskNameRegex) != -1)
    {
        console.log("Into");
        var a = document.getElementsByClassName("cml jsawesome");
        var size = a.length;
        console.log("size");
        console.log(size);
        for(var i = 0; i < size; i++)
        {
            var b = a[i].getElementsByClassName("video_metadata")[0];
            var c = b.getElementsByClassName("html cml_field clicked unknown")[0];
            c.getElementsByTagName("a")[0].remove();
            var d = a[i].getElementsByClassName("cml_row");
            d[1].getElementsByTagName("input")[0].click();
            //c.getElementsByTagName("a")[0].className = "clicked validates-clicked btn btn-info validates validation-passed"
        }
    }

    // Your code here...
})();