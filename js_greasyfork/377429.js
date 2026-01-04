// ==UserScript==
// @name         Leetcode ProblemSet Stat Better Display
// @description  To better display Leetcode ProblemSet Stat; to hide and dismiss the locked problems.
// @version      0.2.1
// @author       pcm
// @match        https://leetcode.com/problemset/*
// @match        https://leetcode.com/tag/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      leetcode.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/377429/Leetcode%20ProblemSet%20Stat%20Better%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/377429/Leetcode%20ProblemSet%20Stat%20Better%20Display.meta.js
// ==/UserScript==

// some global configuration
var CONF = {
    'SVG_HEIGHT': 1000,
    'SVG_WIDTH': 300,
    'COLOR_AC': '#7bc96f',
    'COLOR_NOTAC': '#08c',
    'COLOR_TODO': '#ebedf0',
    'CELL_HEIGHT': 10,
    'CELL_WIDTH': 10,
    'CELL_MARGIN': 2,
    'CELL_W_COUNT': 25,
}


// if switchHideLockedProblems == true, hide all locked problems in problemset
function statDifficulty(problemTable, switchHideLockedProblems, switchDrawProgressBar) {
    var res = {
        'num_total_easy': 0,
        'num_total_normal': 0,
        'num_total_hard': 0,
        'num_total': 0,
        'num_ac_easy': 0,
        'num_ac_normal': 0,
        'num_ac_hard': 0,
        'num_ac': 0,
    }

    // find all related indices
    var index = {}
    var thead = problemTable.getElementsByTagName('thead')[0];
    var ths = thead.getElementsByTagName("th");
    for (var i = 0; i < ths.length; i++) {
        var th = ths[i];
        if (th.textContent == 'Difficulty') index.difficulty = i;
        if (th.textContent == '\xa0') index.status = i;
        if (th.textContent == 'Title') index.title = i;
        if (th.textContent == '#') index.id = i;
    }
    if (Object.keys(index).indexOf('status') == -1) index.status = 0;
    if (Object.keys(index).indexOf('id') == -1) index.id = 1;

    var tbody = problemTable.getElementsByTagName('tbody')[0];
    var trs = tbody.getElementsByTagName("tr");

    // make the ids of problemset ascendent
    var id1 = parseInt(trs[0].getElementsByTagName("td")[1].textContent);
    var thead_id = document.getElementsByClassName('reactable-th-question_id');
    if (!thead_id[0]) {
        thead_id = document.getElementsByClassName('reactable-th-id');
    }
    thead_id[0].click();
    var id2 = parseInt(trs[0].getElementsByTagName("td")[1].textContent);
    id1 = Math.min(id1, id2);
    if (parseInt(trs[0].getElementsByTagName("td")[1].textContent) != id1) {
        thead_id[0].click();
    }

    for ( var j = 0; j < trs.length; j++) {
        var tds = trs[j].getElementsByTagName("td");
        var td_status = tds[index.status];
        var td_title = tds[index.title];
        var td_difficulty = tds[index.difficulty];
        var td_number = tds[index.id];

        // dismiss locked problems
        var locked = td_title.getElementsByClassName('fa-lock');
        if (locked[0]) {
            if (switchHideLockedProblems) {
                trs[j].innerHTML = "";
            }
            continue;
        }

        // stat difficulty
        var hard = td_difficulty.getElementsByClassName('label-danger');
        var normal = td_difficulty.getElementsByClassName('label-warning');
        var easy = td_difficulty.getElementsByClassName('label-success');
        var ac = td_status.getElementsByClassName('fa-check');
        var notac = td_status.getElementsByClassName('fa-question');
        if (switchDrawProgressBar) {
            var title = td_number.textContent + ' ' + td_title.firstChild.firstChild.textContent;
            drawOneCell(res.num_total, ac[0] ? true : false, notac[0] ? true : false, title);
        }
        if (hard[0]) {
            res.num_total_hard++;
            if (ac[0]) res.num_ac_hard++;
        }
        else if (normal[0]) {
            res.num_total_normal++;
            if (ac[0]) res.num_ac_normal++;
        }
        else if (easy[0]) {
            res.num_total_easy++;
            if (ac[0]) res.num_ac_easy++;
        }
        res.num_total++;
        if (ac[0]) res.num_ac++;
    }
    return res;
}

function updateStatBar(welcomes) {
    var statBar = document.getElementById('welcome');
    if (!statBar) {
        var div = document.getElementsByClassName('header__2ZIe')[0];
        var p = div.getElementsByTagName('p')[1];
        p.innerHTML = '<div id="welcome"><span><span class="label label-primary round">Solved</span>&nbsp;-&nbsp;<span class="label label-success round"></span>&nbsp;<span class="label label-warning round"></span>&nbsp;<span class="label label-danger round"></span></span></div>';
        statBar = document.getElementById('welcome');
    }
    var total = statBar.getElementsByClassName('label-primary')[0];
    var hard = statBar.getElementsByClassName('label-danger')[0];
    var normal = statBar.getElementsByClassName('label-warning')[0];
    var easy = statBar.getElementsByClassName('label-success')[0];

    total.textContent = welcomes.num_ac.toString() + '/' + welcomes.num_total.toString() + ' Solved';
    hard.textContent = 'Hard ' + welcomes.num_ac_hard.toString() + '/' + welcomes.num_total_hard.toString();
    normal.textContent = 'Medium ' + welcomes.num_ac_normal.toString() + '/' + welcomes.num_total_normal.toString();
    easy.textContent = 'Easy ' + welcomes.num_ac_easy.toString() + '/' + welcomes.num_total_easy.toString();
}

function drawOneCell(i, ac, notac, title) {
    var svg = document.getElementById('gm_progress_graph');
    var x = (i % CONF.CELL_W_COUNT) * (CONF.CELL_MARGIN + CONF.CELL_WIDTH);
    var y = Math.floor(i / CONF.CELL_W_COUNT) * (CONF.CELL_MARGIN + CONF.CELL_HEIGHT);
    var color = CONF.COLOR_TODO;
    if (ac) color = CONF.COLOR_AC;
    else if (notac) color = CONF.COLOR_NOTAC;

    var rectHTML = 
    '<rect ' +
    'width="' + CONF.CELL_WIDTH + '" ' + 
    'height="' + CONF.CELL_HEIGHT + '" ' + 
    'x="' + x.toString() + '" ' + 
    'y="' + y.toString() + '" ' + 
    'fill="' + color + '" ';

    if (ac || notac) {
        rectHTML += '>' + 
        '<title>' + title + '</title>' + 
        '</rect>'
    }
    else {
        rectHTML += '/>';
    }
    svg.insertAdjacentHTML('beforeend', rectHTML);
    svg.setAttribute('height', y + (CONF.CELL_MARGIN + CONF.CELL_HEIGHT));
}

function initDrawProgressGraph() {
    var div = document.getElementsByClassName('progress-panel-base');
    if (!div[0]) div = document.getElementsByClassName('header__2ZIe')[0];
    else div = div[0].firstChild;
    var svgHTML = 
    '<div><svg ' + 
    'width="' + CONF.SVG_WIDTH + '" ' + 
    'height="' + CONF.SVG_HEIGHT + '" ' + 
    'id="gm_progress_graph" xmlns="http://www.w3.org/2000/svg"' + 
    '>' + 
    '<rect width="100%" height="100%" style="fill:white;/> ' + 
    '</svg></div>'
    div.insertAdjacentHTML('afterend', svgHTML);
    return true;
}

function init() {
    // document.getElementsByTagName('select')[0].options[3].selected = true;
}

function changeStatInfo(jNode) {
    init();
    var problemTable = document.getElementsByClassName('question-list-table');
    if (!problemTable[0]) {
        problemTable = document.getElementsByClassName('table__XKyc');
    }
    if (problemTable[0]) {
        var switchHideLockedProblems = true;
        var switchDrawProgressBar = initDrawProgressGraph();
        var welcomes = statDifficulty(problemTable[0], switchHideLockedProblems, switchDrawProgressBar);
        updateStatBar(welcomes);
    }
}

waitForKeyElements(".question-list-table", changeStatInfo)
waitForKeyElements(".table__XKyc", changeStatInfo)
