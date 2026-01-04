// ==UserScript==
// @name         Pomofocus Projects Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Increase productivity by filtering your list of tasks. Requires pomofocus premium plan.
// @author       mat k
// @match        https://pomofocus.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pomofocus.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460145/Pomofocus%20Projects%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/460145/Pomofocus%20Projects%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function refreshTaskList(taskNodes) {
        console.log(taskNodes)
        let tree = analyseNodeTree(taskNodes)

        document.querySelector('div[class="filter-div"]')?.remove()
        renderFilterButtons(tree)

        return tree
    }

    function analyseTreeForProjectNames(tree) {
        let projects = []

        tree.forEach(object => {
            if (projects.includes(object.project)) {
            } else if (object.project == undefined) { } else {
                projects.push(object.project)
            }
        })

        projects.sort((a, b) => a.localeCompare(b))

        projects.splice(0,0,'Unassigned')
        projects.splice(0,0,'All')

        return projects
    }
        // Function to render the filter buttons using project names in the projectTasks object

    function styledButton(btn) {
        btn.style.cursor = 'pointer'
        btn.style.border = 'none'
        btn.style.margin = '10px 5px'
        btn.style.padding = '0 12px'
        btn.style.borderRadius = '4px'
        btn.style.boxShadow = 'rgb(235 235 235) 0 6px 0'
        btn.style.fontFamily = 'ArialRounded'
        btn.style.fontSize = '16px'
        btn.style.minHeight = '22px'
        btn.style.fontWeight = 'bold'
        //btn.style.width = '100px'
        btn.style.color = 'rgb(186, 73, 73)'
        btn.style.backgroundColor = 'white'
        btn.style.transition = 'color 0.5s ease-in-out 0s'

        btn.style.whiteSpace = 'nowrap'
        btn.style.overflow = 'clip'
        btn.style.textOverflow = 'ellipsis'
        btn.style.flex = '1 1 30%'

        return btn
    }

    function renderFilterButtons(tree) {

        let projectTasks = analyseTreeForProjectNames(tree)
        let filterDiv = document.createElement('div')
        filterDiv.style.display = 'flex'
        filterDiv.style.flexDirection = 'column'
        filterDiv.style.marginBottom = '14px'
        filterDiv.classList.add('filter-div')

        let filterTitle = document.createElement('div')
        filterTitle.innerText = 'Filter by Project'
        filterTitle.style.fontFamily = 'ArialRounded'

        filterDiv.appendChild(filterTitle)

        let btnStatic = document.createElement('div')
        btnStatic.style.display = 'flex'
        filterDiv.appendChild(btnStatic)

        let btnDynamic = document.createElement('div')
        btnDynamic.style.display = 'flex'
        btnDynamic.style.flexWrap = 'wrap'
        filterDiv.appendChild(btnDynamic)

        for (let index in projectTasks) {
            projectTasks[index]
            console.log()
            let filterButton = document.createElement('button')

            filterButton = styledButton(filterButton)

            filterButton.innerText = projectTasks[index]

            if (index == 0 | index == 1) {
                btnStatic.appendChild(filterButton)
            } else {
                btnDynamic.appendChild(filterButton)
            }

            filterButton.addEventListener('click', function(e) {
                // Toggle the visibility of tasks for the selected project
                if (index == 0) {
                    tree.forEach(taskObject => {
                        taskObject.parentNode.style.display = 'block'
                    })
                } else if (index == 1) {
                    tree.forEach(taskObject => {
                        taskObject.parentNode.style.display = 'block'
                        if (taskObject.project == undefined) {
                        } else {
                            taskObject.parentNode.style.display = 'none'
                        }
                    })
                } else {
                    tree.forEach(taskObject => {
                        taskObject.parentNode.style.display = 'block'
                        if (taskObject.project == e.target.outerText) {
                        } else {
                            taskObject.parentNode.style.display = 'none'
                        }
                    })
                }
            })
        }

        // Add the filter div above the task list
        taskDiv.insertBefore(filterDiv, taskDiv.firstChild)
    }


    function analyseNodeTree(tree) {

        const objectArray = []

        tree.childNodes.forEach(task => {
            // gets metadata about tasks in the task list.
            // it is a bit overkill, but left here in case of future development

            let wholeTask = task.childNodes[0].childNodes

            let description
            if (wholeTask.length > 1) {
                description = wholeTask[1].childNodes[0].childNodes[0].data
            }

            // taskHeader = [div = taskOverview, div = activityPomos]
            let taskHeader = wholeTask[0].childNodes

            // taskOverview = [div = checkBox, div = details]
            let taskOverview = taskHeader[0].childNodes

            let checkBox = taskOverview[0]

            // details = [span = project, text, text = title]
            let details = taskOverview[1].childNodes

            let project = details[0].childNodes[0]?.data
            let title = details[2].data

            // pomos = [div = current, div, div=target]
            let pomos = taskHeader[1].childNodes[0].childNodes

            let currentPomos = pomos[0].data
            let targetPomos = pomos[1].childNodes[1].data

            let object = {
                parentNode: task,
                title: title,
                project: project,
                description: description,
                currentPomos: currentPomos,
                targetPomos: targetPomos,
            }

            objectArray.push(object)
        })

        return objectArray
    }

    let taskDiv
    let taskNodes

    let waitForTaskList = setInterval(function() {
        taskDiv = getElementByXpath("//*[@id='target']/div/div[1]/div[2]/div/div[3]")
        if (taskDiv) {
            taskNodes = taskDiv.childNodes[1]
            clearInterval(waitForTaskList);
            refreshTaskList(taskNodes);

            // Observe the task list for changes
            let taskListObserver = new MutationObserver(() => refreshTaskList(taskNodes));
            taskListObserver.observe(taskNodes, {childList: true});
        }
    }, 200);
    setTimeout(function() {
        clearInterval(waitForTaskList);
    }, 2000);

    // Your code here...
})();