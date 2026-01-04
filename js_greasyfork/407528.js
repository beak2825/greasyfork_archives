// ==UserScript==
// @name         Area Rug
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       01
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407528/Area%20Rug.user.js
// @updateURL https://update.greasyfork.org/scripts/407528/Area%20Rug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var taskNameRegex = '[Base_template]'; // Portion of task name
	var taskName = document.getElementsByTagName('h1')[1].innerText; // task name
    if(taskName.search(taskNameRegex) != -1)
    {
        var a = document.getElementsByClassName('cml jsawesome');
        var size_a = a.length;

        for (var i = 0 ; i < size_a; i++)
        {
            a[i].getElementsByClassName("span6")[1].getElementsByClassName("radios cml_field")[0].getElementsByTagName('input')[1].click()
            a[i].getElementsByClassName("span6")[1].getElementsByClassName("radios cml_field")[1].getElementsByTagName('input')[0].click();
        }
    }

    // Your code here...
})();