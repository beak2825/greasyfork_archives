// ==UserScript==
// @name         Base Template
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ME
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407467/Base%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/407467/Base%20Template.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var taskNameRegex = '[Base_template]'; // Portion of task name
	var taskName = document.getElementsByTagName('h1')[1].innerText; // task name
    if(taskName.search(taskNameRegex) != -1)
    {
        var a = document.getElementsByClassName('cml jsawesome');
        var size_a =  a.length;

        for (var i = 0 ; i < size_a; i++)
        {
            var b = a[i].getElementsByClassName('group logic-only-if')[0]
            var button = b.getElementsByClassName('well')[0].getElementsByClassName('radios cml_field')[0].getElementsByClassName('cml_row')[0]
            button.getElementsByTagName('input')[0].click()
            var c = a[i].getElementsByClassName('group logic-only-if')[0].getElementsByClassName('radios logic-only-if cml_field ')[0]
            var button2 = c.getElementsByClassName('cml_row')[1]
            button2.getElementsByTagName('input')[0].click()
        }
    }

    // Your code here...
})();