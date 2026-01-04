// ==UserScript==
// @name         Todoist background colors 2023
// @namespace    https://todoist.com/app
// @version      0.0.2a
// @description  Todoist.com changes upcoming section list itemms background color 
// @copyright    samo, 2023
// @match        https://todoist.com/app*
// @license      free 
// @downloadURL https://update.greasyfork.org/scripts/459277/Todoist%20background%20colors%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/459277/Todoist%20background%20colors%202023.meta.js
// ==/UserScript==

//Array with tasks parameters
// 0 - box name
// 1 - Text color - not used now 
// 2 - Background color
var pairings = [["work" , "white", "orangered" ],
                   ["vp", "white", "red"],
                   ["meet", "white", "red"],
                   ["home", "white", "red"],
                   ["vp", "blue" , "lightgreen"]
                  ];

// Changing tasks colour
function colour_tasks() {
    var tasks = document.getElementsByClassName("task_list_item__body");
    for (let i = 0; i < 200; i++){
        console.log(tasks);
        console.log(tasks[i]);
        console.log(tasks.item(i));
        var project_text_box = tasks.item(i).getElementsByClassName('a83bd4e0 _266d6623 _6a3e5ade _2f303ac3 _2a3b75a1 _211eebc7');
        console.log("before pairings");
        pairings.forEach(function(ls){
            console.log(ls);
            if (project_text_box.getElementsByTagName("span") == pairings[0]) {
                console.log("xxxxxxxxxxx");
                // if(project_text_box.innerText == ls[0]){
                // labels[i].innerText = labels[i].innerText.toUpperCase();
                // labels[i].style.color = ls[1];
                tasks.style.backgroundColor = ls[2];
            // }
            }
        })
    }
}

colour_tasks();
//setInterval(colour_labels, 1000);