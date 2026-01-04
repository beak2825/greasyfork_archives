// ==UserScript==
// @name         virtualmanager.com - Employee show stars and role
// @namespace    https://greasyfork.org/en/users/884999-l%C3%A6ge-manden
// @version      0.6
// @description  Shows stars and role on employeesearch
// @author       VeryDoc
// @match        https://www.virtualmanager.com/employees/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtualmanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441230/virtualmanagercom%20-%20Employee%20show%20stars%20and%20role.user.js
// @updateURL https://update.greasyfork.org/scripts/441230/virtualmanagercom%20-%20Employee%20show%20stars%20and%20role.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('load', () => {
        setInterval(function () {
            loadPlugin();
        }, 500);
    });

    window.addEventListener('popstate', function (event) {
        loadPlugin();
    });

    function loadPlugin() {
        let myTable = document.getElementsByTagName("table")[0].getElementsByTagName('tbody')[0];
        let foundOne = false;
        let rows = myTable.rows;

        for (let row of rows) {
            if (row.classList.contains('toprow') === true) {
                if (row.classList.contains('changed') === true) {
                    return;
                }

                addSearch();
                getValuesFromLocalStorage();

                let youth = document.getElementById('custom-youth').value;
                let goalkeeper = document.getElementById('custom-goalkeeper').value;
                let field = document.getElementById('custom-field').value;
                let disiplin = document.getElementById('custom-disiplin').value;
                let motivation = document.getElementById('custom-motivation').value;

                if (youth === '' && goalkeeper === '' && field === '' && disiplin === '' && motivation === '') {
                    let newCell = row.insertCell();
                    newCell.colSpan = 2;
                    let newText = document.createTextNode('Please select one or more attributes to start search..');
                    newCell.appendChild(newText);
                } else {
                    let newCell = row.insertCell();
                    let newText = document.createTextNode('Ability');
                    newCell.appendChild(newText);

                    newCell = row.insertCell();
                    newText = document.createTextNode('Should buy!');
                    newCell.appendChild(newText);
                }

                row.classList.add('changed');
            } else {
                let a = row.cells[7];
                let skillstable = a.getElementsByTagName("table")[0].getElementsByTagName('tbody')[0];
                let skills = skillstable.children;
                let youthSkills = parseInt(skills[0].innerText.trim().replace('                                ', '').replace('\n', ':').split(':')[1]);
                let goalkeepingSkills = parseInt(skills[1].innerText.trim().replace('                                ', '').replace('\n', ':').split(':')[1]);
                let fieldplayerSkills = parseInt(skills[2].innerText.trim().replace('                                ', '').replace('\n', ':').split(':')[1]);
                let disiplinSkills = parseInt(skills[3].innerText.trim().replace('                                ', '').replace('\n', ':').split(':')[1]);
                let scountPotential = parseInt(skills[4].innerText.trim().replace('                                ', '').replace('\n', ':').split(':')[1]);
                let motivationSkills = parseInt(skills[7].innerText.trim().replace('                                ', '').replace('\n', ':').split(':')[1]);

                let totalSkills = youthSkills + goalkeepingSkills + fieldplayerSkills + disiplinSkills + motivationSkills;
                let newCell = row.insertCell();

                let newText = document.createTextNode('⭐');

                switch (true) {
                    case (totalSkills > 80):
                        newText = document.createTextNode('⭐⭐⭐⭐⭐');
                        break;
                    case (totalSkills > 60 && totalSkills < 80):
                        newText = document.createTextNode('⭐⭐⭐⭐');
                        break;
                    case (totalSkills > 40 && totalSkills < 60):
                        newText = document.createTextNode('⭐⭐⭐');
                        break;
                    case (totalSkills > 20 && totalSkills < 40):
                        newText = document.createTextNode('⭐⭐');
                        break;
                }

                let youth = parseInt(document.getElementById('custom-youth').value);;
                let goalkeeper = parseInt(document.getElementById('custom-goalkeeper').value);
                let field = parseInt(document.getElementById('custom-field').value);
                let disiplin = parseInt(document.getElementById('custom-disiplin').value);
                let motivation = parseInt(document.getElementById('custom-motivation').value);
                let scout = parseInt(document.getElementById('custom-scouting').value);

                newCell.appendChild(newText);
                if (youth === '' && goalkeeper === '' && field === '' && disiplin === '' && motivation === '') {
                } else {
                    if (youthSkills >= youth && fieldplayerSkills >= field && goalkeepingSkills >= goalkeeper && disiplinSkills >= disiplin && motivationSkills >= motivation && scountPotential >= scout) {
                        newCell = row.insertCell();
                        newCell.style.fontSize = "9px";
                        newText = document.createTextNode("Yes");
                        newCell.appendChild(newText);
                        newCell.style.backgroundColor = "green";
                        foundOne = true;
                    }
                    else {
                        newCell = row.insertCell();
                        newCell.style.fontSize = "9px";
                        newText = document.createTextNode("No");
                        newCell.appendChild(newText);
                        newCell.style.backgroundColor = "red";
                    }
                }
            }
        }

        // if (foundOne === false) {
        //     let time = 1000 + Math.random() * 1000;
        //     setTimeout(function () {
        //         let a = document.getElementsByClassName('next_page');
        //         window.location = a[0].href;
        //     }, time);
        // } else {
        //     alert('Found one!!!');
        // }
    };

    function addSearch() {
        let box = document.createElement('div');
        box.className = 'box';
        box.id = 'custom-search-box';

        let header = document.createElement('h2');
        header.innerText = 'Søgning';

        box.appendChild(header);

        let table = document.createElement('table');
        table.className = 'stretch';
        table.id = 'custom-search-table';
        let row = table.insertRow(0);
        addRowWithTextbox(table, 'Ungdomstræning', 'custom-youth');
        addRowWithTextbox(table, 'Målmandstræning', 'custom-goalkeeper');
        addRowWithTextbox(table, 'Markspillertræning', 'custom-field');
        addRowWithTextbox(table, 'Scouting potentiale', 'custom-scouting');
        addRowWithTextbox(table, 'Disiplin', 'custom-disiplin');
        addRowWithTextbox(table, 'Motivation', 'custom-motivation');

        row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);

        cell1.innerText = 'Auto next';
        cell1.style.width = '40%';

        let autoNext = document.createElement('INPUT');
        autoNext.setAttribute("type", "checkbox");
        autoNext.id = 'custom-autonext';

        cell2.appendChild(autoNext);

        box.appendChild(table);

        let buttonDiv = document.createElement('div');
        buttonDiv.className = 'right'

        let SaveButton = document.createElement('button');
        SaveButton.className = 'btn';
        SaveButton.innerText = 'Gem';
        SaveButton.onclick = function () { saveValuesToLocalStoarage(); window.location.reload(); };
        buttonDiv.appendChild(SaveButton);

        box.appendChild(buttonDiv);

        let attachBox = document.getElementsByClassName('employees_search')[0];
        attachBox.appendChild(box);
    }

    function addRowWithTextbox(table, text, id) {
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);

        cell1.innerText = text;
        cell1.style.width = '40%';

        let inputElement = document.createElement('INPUT');
        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("size", "1");
        inputElement.setAttribute("maxlength", "2");
        inputElement.id = id;

        inputElement.className = 'center';
        inputElement.style.width = '20px';

        cell2.appendChild(inputElement);
    }

    function saveValuesToLocalStoarage() {
        localStorage.setItem('custom-search-youth', document.getElementById('custom-youth').value);
        localStorage.setItem('custom-search-goalkeeper', document.getElementById('custom-goalkeeper').value);
        localStorage.setItem('custom-search-field', document.getElementById('custom-field').value);
        localStorage.setItem('custom-search-disiplin', document.getElementById('custom-disiplin').value);
        localStorage.setItem('custom-search-motivation', document.getElementById('custom-motivation').value);
        localStorage.setItem('custom-search-scouting', document.getElementById('custom-scouting').value);
    }

    function getValuesFromLocalStorage() {
        document.getElementById('custom-youth').value = localStorage.getItem('custom-search-youth');
        document.getElementById('custom-goalkeeper').value = localStorage.getItem('custom-search-goalkeeper');
        document.getElementById('custom-field').value = localStorage.getItem('custom-search-field');
        document.getElementById('custom-disiplin').value = localStorage.getItem('custom-search-disiplin');
        document.getElementById('custom-motivation').value = localStorage.getItem('custom-search-motivation');
        document.getElementById('custom-scouting').value = localStorage.getItem('custom-search-scouting');
    }
})();