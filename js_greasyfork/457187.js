// ==UserScript==
// @name         Orion ski filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improve searching for ski tours.
// @author       yannick.boesmans@gmail.com
// @match        https://yoyaku.orion-tour.co.jp/orion/tourlistSki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=orion-tour.co.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/457187/Orion%20ski%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/457187/Orion%20ski%20filter.meta.js
// ==/UserScript==


function matchesFilter(title) {
    return GM.getValue('filterlist').then(filterlist => {
       let filters = filterlist.split('\n');
       for (let i = 0; i < filters.length; i++) {
           if (title.includes(filters[i])) {
               return true;
           }
       }
        return false;
    });
}

function hasTag(tagList) {
    let glSide = document.querySelector('input[name="gelande"]:checked');
    if (glSide === null || glSide === undefined) {
        return true;
    }
    let matchTag = glSide.value;
    if (matchTag === '') {
        return true;
    }

    let tags = tagList.getElementsByTagName('li');
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].innerText === matchTag) {
            return true;
        }
    }
    return false;
}

function hideResultBox(box, reason) {
    console.log('Removing result ' + i + ' because of ' + reason + '.');
    box.style = 'display: none';
    const resultCounts = document.getElementsByClassName('resultcount');

    for (let i = 0; i < resultCounts.length; i++) {
        resultCounts[i].innerText = resultCounts[i].innerText - 1;
    }
}

function filterResultBoxes() {
    const resultBoxes = document.getElementsByClassName('resultBox');

    for (let i = 0; i < resultBoxes.length; i++) {
        const title = resultBoxes[i].getElementsByClassName('tourTitle')[0].innerText;
        const planInfoBox = resultBoxes[i].getElementsByClassName('planInfoBox')[0];

        // Already filtered
        if (resultBoxes[i].style['display'] === 'none') {
            continue;
        }

        if (planInfoBox === undefined) {
            hideResultBox(resultBoxes[i], 'lack of plan info');
            continue;
        }
        const availability = planInfoBox.getElementsByClassName('secondInfo')[0].getElementsByTagName('dl')[2].getElementsByTagName('dd')[0].innerText;
        const tagList = resultBoxes[i].getElementsByClassName('spList')[0];
        if (availability === '×') {
            hideResultBox(resultBoxes[i], 'non-availability');
            continue;
        }
        matchesFilter(title).then(match => {
            if (match) {
                hideResultBox(resultBoxes[i], 'filterlist');
            }
        });
        if (!hasTag(tagList)) {
            hideResultBox(resultBoxes[i], 'missing tag');
            continue;
        }
    }
}

function styleElementAsButton(element) {
    element.style = 'display: inline-block; border: 1px solid #ccc; background: #ddd; cursor: pointer';
}

function saveFilterList(content) {
    GM.setValue("filterlist", content);
}

function addFilterList() {
    let filterListDiv = document.createElement('div');
    let inputTextField = document.createElement('textarea');
    let saveButton = document.createElement('div');
    saveButton.append('Save filterlist');
    styleElementAsButton(saveButton);
    inputTextField.cols = 20;
    inputTextField.rows = 3;

    GM.getValue("filterlist").then(val => {
        inputTextField.value = val;
    });

    filterListDiv.append(inputTextField);
    filterListDiv.append(saveButton);

    saveButton.addEventListener('click', (event) => {
        saveFilterList(inputTextField.value);
    });

    document.getElementById('rightArea').prepend(filterListDiv);
}

function addFilterButton() {
    let filterDiv = document.createElement('div');
    let button = document.createElement('div');
    button.append('Filter');
    styleElementAsButton(button);
    filterDiv.append(button);

    button.addEventListener('click', (event) => {
            filterResultBoxes();
    });

    document.getElementById('rightArea').prepend(filterDiv);
}

function addGelandeSide() {
    let gsDiv = document.createElement('div');
    let radio1 = document.createElement('input');
    let label1 = document.createElement('label');
    let radio2 = document.createElement('input');
    let label2 = document.createElement('label');
    let radio3 = document.createElement('input');
    let label3 = document.createElement('label');

    gsDiv.id = 'gs_radio';

    radio1.type = 'radio';
    radio1.name = 'gelande';
    radio1.value = '';
    label1.append('None');
    radio2.type = 'radio';
    radio2.name = 'gelande';
    radio2.value = 'ゲレンデサイド';
    label2.append('Gelandeside');
    radio3.type = 'radio';
    radio3.name = 'gelande';
    radio3.value = 'ゲレンデ徒歩5分以内の宿';
    label3.append('5min walk');

    gsDiv.append(radio1);
    gsDiv.append(label1);
    gsDiv.append(radio2);
    gsDiv.append(label2);
    gsDiv.append(radio3);
    gsDiv.append(label3);

    document.getElementById('rightArea').prepend(gsDiv);
}

async function isAutoFilterOn() {
    return GM.getValue("autofilter");
}

function addAutoFilter() {
    let afDiv = document.createElement('div');
    let cb = document.createElement('input');
    let label = document.createElement('label');

    afDiv.id = 'af_cb';

    cb.type = 'checkbox';
    cb.name = 'autofilter';
    isAutoFilterOn().then(val => {
        cb.checked = val;
    });
    cb.addEventListener('click', (event) => {
        GM.setValue("autofilter", cb.checked);
    });
    label.append('Auto filter');

    afDiv.append(cb);
    afDiv.append(label);

    document.getElementById('rightArea').prepend(afDiv);
}

function isLoading() {
    let s = document.getElementById('loading').style;
    return s['display'] !== 'none';
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function waitTillLoaded() {
    let times = 0;
    while (isLoading() && times < 100) {
        await timeout(100);
        times++;
    }
}

var oldPageMove = paging.pageMove;
paging.pageMove = function(page) {
    oldPageMove(page);
    isAutoFilterOn().then((afOn) => {
        if (afOn) {
            waitTillLoaded().then(() => {
                filterResultBoxes();
            });
        }
    });
};

var oldGetData = condition.getData;
condition.getData = function(searchType, isArgument, isCallCal, initCall) {
  oldGetData(searchType, isArgument, isCallCal, initCall);
  isAutoFilterOn().then((afOn) => {
        if (afOn) {
            waitTillLoaded().then(() => {
                filterResultBoxes();
            });
        }
    });
};

function setResultsPerPage(num) {
    document.getElementById("DetailCount").value = num;
}

(function() {
    'use strict';

    setResultsPerPage(100);

    addAutoFilter();
    addFilterButton();
    addGelandeSide();
    addFilterList();



    isAutoFilterOn().then((afOn) => {
        if (afOn) {
            setTimeout(() => {
            waitTillLoaded().then(() => {
                filterResultBoxes();
            });
            }, 1000);
        }
    });
})();
