// ==UserScript==
// @name         Delete useless tasks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Gudigno
// @match        https://account.appen.com/channels/neodev/tasks?uid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407071/Delete%20useless%20tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/407071/Delete%20useless%20tasks.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Useless Tasks declaration
    var uselessTasks = ['New Gp Crowd',
                        'Judge The Sentiment Of Youtube Comment',
                        'Sentence To Question-Answer Pairs',
                        'Japanese - Global Ner'];
    // taskList parse from JSON to a List
    var taskList = JSON.parse(document.getElementsByTagName('div')[11].dataset.tasks);

    // Look each element in the useless list
    for (var i = 0, n = uselessTasks.length; i < n; i++)
    {
        //Look each element in the taskList list
        for (var j = 0, m = taskList.length; j < m; j++)
        {
            // Check if the partial name(Regex) is into the list
            if (taskList[j][1].search(uselessTasks[i]) != -1)
            {
                // Get id and erase from List
                var id = taskList[j][0];
                eraseFromList(id);
            }
        }
    }

    function eraseFromList(id)
    {
        //Get parent of current element.. then delete it
        var parentElement = document.getElementById("task-"+id).parentNode;
        parentElement.removeChild(document.getElementById("task-"+id));
    }
})();