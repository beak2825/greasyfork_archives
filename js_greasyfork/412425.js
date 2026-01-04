// ==UserScript==
// @name         codeforces-problem-queue
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  You can queue the problems you want to revenge!
// @author       itohdak
// @license      MIT
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://codeforces.com/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412425/codeforces-problem-queue.user.js
// @updateURL https://update.greasyfork.org/scripts/412425/codeforces-problem-queue.meta.js
// ==/UserScript==

var max_problem_count = 50;
function getProblemQueue () {
    return JSON.parse(localStorage.getItem('problemQueue') || '{}');
}
function setProblemQueue (problemQueue) {
    localStorage.setItem('problemQueue', JSON.stringify(problemQueue));
}
function addProblem (problemTitle, problemContent) {
    var problemQueue = getProblemQueue();
    if(problemTitle in problemQueue) {
        return "Already in queue.";
    } else if(Object.keys(problemQueue).length >= max_problem_count) {
        return "Reached the maximum number of problems you can queue.</br>Let\'s solve the problems!:)";
    } else {
        problemQueue[problemTitle] = problemContent;
        setProblemQueue(problemQueue);
        return "Added successfully.";
    }
}
function deleteProblem (problemTitle) {
    var problemQueue = getProblemQueue();
    delete problemQueue[problemTitle];
    setProblemQueue(problemQueue);
}

function setAddProblemButton () {
    // Create a button in a container div.
    var div = document.createElement('div');
    div.setAttribute('style', 'margin:1em;font-size:0.8em;');
    div.setAttribute('id', 'addProblemContainer');
    var btn = document.createElement('input');
    btn.setAttribute('type', 'submit');
    btn.setAttribute('value', 'Add this problem to my problem queue');
    btn.setAttribute('style', 'padding:0 0.5em;');
    btn.setAttribute('id', 'addProblemButton');
    div.appendChild(btn);
    document.getElementsByClassName('header')[0].appendChild(div);

    // Activate the newly added button.
    document.getElementById('addProblemButton').addEventListener(
        'click', buttonClickAction, false
    );
}

function buttonClickAction (event) {
    var problemTitle = document.getElementsByClassName('title')[0].innerHTML
    var contestName = document.getElementsByClassName('left')[0].querySelectorAll('a')[0].text
    var msg = addProblem(problemTitle, {'contestName': contestName, 'problemLink': location.href});

    var p = document.createElement('p');
    p.innerHTML = '<font color="red">' + msg + '</font>';
    var cntr = document.getElementById('addProblemContainer');
    if(cntr.children.length > 1) cntr.removeChild(cntr.childNodes[1]);
    cntr.appendChild(p);
}

function createCodeforcesLikeRoundBox () {
    var roundBox = document.createElement('div');
    roundBox.setAttribute('class', 'roundbox sidebox top-contributed');
    roundBox.setAttribute('style', 'margin-top:1em;');
    var roundBoxLT = document.createElement('div');
    roundBoxLT.setAttribute('class', 'roundbox-lt');
    roundBoxLT.innerHTML = '&nbsp;';
    var roundBoxRT = document.createElement('div');
    roundBoxRT.setAttribute('class', 'roundbox-rt');
    roundBoxRT.innerHTML = '&nbsp;';
    var roundBoxLB = document.createElement('div');
    roundBoxLB.setAttribute('class', 'roundbox-lb');
    roundBoxLB.innerHTML = '&nbsp;';
    var roundBoxRB = document.createElement('div');
    roundBoxRB.setAttribute('class', 'roundbox-rb');
    roundBoxRB.innerHTML = '&nbsp;';
    roundBox.appendChild(roundBoxLT);
    roundBox.appendChild(roundBoxRT);
    // roundBox.appendChild(roundBoxLB);
    // roundBox.appendChild(roundBoxRB);
    return roundBox;
}

function createCodeforcesLikeDeleteButton (problemTitle) {
    var deleteBtn = document.createElement('a');
    deleteBtn.setAttribute('class', 'delete-virtual-contest');
    deleteBtn.setAttribute('title', 'delete [' + problemTitle + ']');
    deleteBtn.setAttribute('href', '#');
    var img = document.createElement('img');
    img.setAttribute('width', '12px;');
    img.setAttribute('src', '//sta.codeforces.com/s/!/images/delete.png');
    deleteBtn.appendChild(img);
    return deleteBtn;
}

function setProblemList () {
    var userPage = document.getElementsByClassName('avatar')[0].querySelectorAll('a')[1];
    if(userPage == null || (userPage != location.href && userPage + "#" != location.href)) return;

    var roundBox = createCodeforcesLikeRoundBox();

    var title = document.createElement('div');
    title.setAttribute('class', 'caption titled');
    title.innerHTML = '→ Problem queue';
    roundBox.appendChild(title);

    var table = document.createElement('table');
    table.setAttribute('class', 'rtable ');
    table.setAttribute('id', 'problemQueue');
    roundBox.appendChild(table);
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    var header = document.createElement('tr');
    var thIdx = document.createElement('th');
    thIdx.textContent = '#';
    var thPblm = document.createElement('th');
    thPblm.textContent = 'Problem';
    header.appendChild(thIdx);
    header.appendChild(thPblm);
    header.appendChild(document.createElement('th'));
    tbody.appendChild(header);

    var num = 1;
    var problemQueue = getProblemQueue();
    for (let key in problemQueue) {
        var tr = document.createElement('tr');
        // add index
        var tdIdx = document.createElement('td');
        tdIdx.innerText = num;
        if(num%2) tdIdx.setAttribute('class', 'dark');
        // add problem link
        var tdLink = document.createElement('td');
        if(num%2) tdLink.setAttribute('class', 'dark');
        tdLink.innerHTML = '<a href="' + problemQueue[key].problemLink + '" title="' + problemQueue[key].contestName + '" target="_blank" rel="noopener noreferrer">' + key + '</a>';
        // add delete button
        var tdBtn = document.createElement('td');
        if(num%2) tdBtn.setAttribute('class', 'dark');
        tdBtn.appendChild(createCodeforcesLikeDeleteButton(key));
        tr.appendChild(tdIdx);
        tr.appendChild(tdLink);
        tr.appendChild(tdBtn);
        tbody.appendChild(tr);
        num++;
    }
    document.getElementById('pageContent').appendChild(roundBox);

    document.querySelectorAll('.delete-virtual-contest').forEach ( (btn) => btn.addEventListener (
        'click', {obj: btn, handleEvent: deleteAction}, false
    ));
}

function deleteAction (event) {
    var tr = this.obj.parentNode.parentNode;
    var problemTitle = tr.querySelectorAll('a')[0].text;
    deleteProblem(problemTitle);
    tr.parentNode.deleteRow(tr.sectionRowIndex);
}

(function() {
    var url = window.location.href;

    if( url.match(new RegExp('/codeforces.com\/contest\/(.*)\/problem\/(.*)')) != null ) {
        setAddProblemButton();
    } else if ( url.match(new RegExp('/codeforces.com\/profile\/(.*)')) != null) {
        setProblemList();
    }
})();
