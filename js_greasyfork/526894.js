// ==UserScript==
// @name          JIRA - Report Generator for M
// @description   llll
// @version     2.4
// @author      Stan L
// @license     MIT
// @match       https://jenkins.devops.namecheap.net/*
// @include       https://track.namecheap.net/secure/RapidBoard.*
// @match         https://track.namecheap.net/secure/RapidBoard*
// @grant    GM_addStyle
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace https://greasyfork.org/users/206789
// @downloadURL https://update.greasyfork.org/scripts/526894/JIRA%20-%20Report%20Generator%20for%20M.user.js
// @updateURL https://update.greasyfork.org/scripts/526894/JIRA%20-%20Report%20Generator%20for%20M.meta.js
// ==/UserScript==

function waitForKeyElements(e, t, a, n) {
    var o, r;
    (o = void 0 === n ? $(e) : $(n)
        .contents()
        .find(e)) && o.length > 0 ? (r = !0, o.each(function () {
        var e = $(this);
        e.data('alreadyFound') || !1 || (t(e) ? r = !1 : e.data('alreadyFound', !0))
    })) : r = !1;
    var l = waitForKeyElements.controlObj || {}, i = e.replace(/[^\w]/g, '_'), c = l[i];
    r && a && c ? (clearInterval(c), delete l[i]) : c || (c = setInterval(function () {
        waitForKeyElements(e, t, a, n)
    }, 300), l[i] = c), waitForKeyElements.controlObj = l
}

const q = (s, ctx) => (ctx || document).querySelector(s);
const qa = (s, ctx) => [...(ctx || document).querySelectorAll(s)];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchTaskDescription = async (id) => {
    const url = `https://track.namecheap.net/rest/greenhopper/1.0/xboard/issue/details.json?rapidViewId=1600&issueIdOrKey=${id}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'en-US,en;q=0.9,ru;q=0.8,pt;q=0.7',
        }
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data.tabs?.defaultTabs?.find(t => t.tabId === 'DESCRIPTION')?.sections?.[0]?.html || '';
};


function htmlToText(html) {
    return html
        .replace(/<[^>]+>/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function parseGoalSection(html) {
    const normalized = html
        .replace(/\s*\n\s*/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

    let goalLabel = 'Goal';

    const goalMatch = normalized.match(/<[^>]*>\s*(Goal:|Problem description)\s*<\/[^>]*>/i);
    if (!goalMatch) return {goalLabel, goalContent: 'n/a'};

    goalLabel = goalMatch[1]?.replace(':', '') || goalLabel;

    const startIndex = normalized.indexOf(goalMatch[0]);
    const rest = normalized.slice(startIndex + goalMatch[0].length);
    const endMatch = rest.match(/(<h3[^>]*>|<[^>]*>\s*(To do:|Acceptance criteria|How to implement)\s*<\/[^>]*>)/i);
    const goalContent = endMatch ? rest.slice(0, rest.indexOf(endMatch[0])) : rest;
    return {
        goalLabel,
        goalContent: htmlToText(goalContent),
    };
}

const parseTask = async (el) => {
    const taskId = q('.ghx-key', el).innerText;
    const desc = await fetchTaskDescription(taskId) || '';

    const task = {
        epic: q('.ghx-highlighted-field', el)?.innerText || 'Without epic',
        taskId,
        summary: q('.ghx-summary', el).innerText,
        status: q('.ghx-extra-field-row:last-child .ghx-extra-field-content', el)?.innerText || '',
        eta: q('.ghx-extra-field[title^=ETA]', el).innerText,
        assignee: (q('.ghx-avatar [title^=Assignee]', el)
            ?.getAttribute('title')
            ?.replace('Assignee:', '') || '').trim(),
        ...parseGoalSection(desc),
    }
    return task;
}

const renderTask = (task) => {
    return `${task.taskId}: ${task.summary} \n     - ${task.status}\n     - ETA: ${task.eta}\n     - ${task.goalLabel}: ${task.goalContent}\n`;
}

const generateReport = async () => {

    const headers = qa('#ghx-column-header-group #ghx-column-headers .ghx-column-title')
        .map(el => el.innerText);

    const columnsToReport = [
        {title: 'IN WORK'},
        {title: 'WORK DONE'},
        {title: 'IN QA'},
        {title: 'QA DONE'},
        {title: 'REVIEW'},
    ].map(column => ({...column, index: headers.indexOf(column.title)}));


    let report = '';
    let allTasks = [];

    const columnsData = await Promise.all(columnsToReport.map(async column => {
        const col = qa('#ghx-pool .ghx-columns .ghx-column')[column.index];
        const taskCards = qa('.ghx-issue', col);

        return await Promise.all(
            taskCards.map(async (taskCard) => ({
                ...(await parseTask(taskCard)),
                columnTitle: column.title
            }))
        );
    }));

    allTasks = columnsData.flat();

    const epics = [...new Set(allTasks.map(task => task.epic))].sort();
    epics.forEach(epicTitle => {
        report += `\nEpic: ${epicTitle}`;
        const tasksFilteredByEpic = allTasks.filter(task => task.epic === epicTitle);
        console.log(epicTitle, tasksFilteredByEpic);

        columnsToReport.forEach(column => {
            const tasks = tasksFilteredByEpic.filter(task => task.columnTitle === column.title);
            if (tasks.length > 0) {
                report += `\n\n ${column.title}\n  ` + tasks.map(renderTask)
                    .join('\n\n  ');
            }
        });
        report += `\n\n`;
    });

    return report;
}

function main(jNode) {
    if ($('body')
        .hasClass('generate-report-script-applied')) return;

    $('#ghx-modes-tools')
        .css('position', 'relative')
        .append(`
        <style> .rotating-icon {display: inline-block;animation: spin 2s linear infinite;}
         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}
        </style>

        <button id="btn-generate-report" class="aui-button ghx-compact-toggle js-compact-toggle" aria-label=Report" resolved="" aria-describedby="aui-tooltip">
          <span class="aui-icon aui-icon aui-icon-small aui-iconfont-menu"></span>
        </button>
        <div id="reportContainer" style="display: none; position: absolute; top: 2em; right: 0; z-index: 9999;">
           <textarea style="resize: vertical; width: 70vw; height: 70vh; box-sizing: border-box;" id="reportContainerTextbox">test here</textarea>
        </div>`);

    $('#btn-generate-report')
        .click(async () => {
            const $icon = $('#btn-generate-report .aui-icon');
            const $reportContainer = $(reportContainer);

            if ($reportContainer.is(':visible')) {
                $reportContainer.slideUp(200);
                $icon.removeClass('rotating-icon');
                return;
            }

            $icon.addClass('rotating-icon');
            const report = await generateReport();
            $('#reportContainerTextbox')
                .val(report);
            $reportContainer.slideDown(200);
            $icon.removeClass('rotating-icon');
        });

    $('body')
        .addClass('generate-report-script-applied');
}

bWaitOnce = true;
waitForKeyElements(
    '.aui-page-header-main:first',
    main
);
