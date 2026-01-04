// ==UserScript==
// @name         OSRS Wiki - Leagues Task Filters
// @namespace    http://tampermonkey.net/
// @version      2025-09-13.1
// @description  Additional filtering for leagues tasks on the rs wiki
// @author       https://oldschool.runescape.wiki/w/User:Loaf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runescape.wiki
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @run-at       document-idle
// @include      https://oldschool.runescape.wiki/w/*League/Tasks
// @include      https://runescape.wiki/w/*League/Tasks
// @downloadURL https://update.greasyfork.org/scripts/518872/OSRS%20Wiki%20-%20Leagues%20Task%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/518872/OSRS%20Wiki%20-%20Leagues%20Task%20Filters.meta.js
// ==/UserScript==
const $ = window.jQuery;

console.log('loadedd');

// //////////////////////////////////////////
// CONSTANTS
const DATA_TYPE = { CHECKBOX: '0', CHECK_ALL_CHECKBOX: '1' };
const DATA_TYPE_PROP = 'data-lf-datatype';
const FILTER_TARGET_TYPE = { DIFFICULTY: 'difficulty', SKILL: 'skill', REGION: 'region', MISC: 'misc' };
const FILTER_MISC_TYPE = { NA: 'na', COMPLETE: 'complete', TODO: 'tod0' };
const FILTER_TARGET_PROP = 'data-lf-target';
const FILTER_TARGET_TYPE_PROP = 'data-lf-target-type';
const REGION_TARGET_PROP = 'data-tbz-area-for-filtering';

const WIKI_TASK_ROW_PROP = 'data-taskid';
const LEAGUES_TABLE = 'leagues-table';
const FILTERED_ROW_PROP = 'leagues-row-filter';
const FILTERED_ROW_PROP_VALUE = 'filtered';
const FILTERED_SELECTOR = '[leagues-row-filter=filtered]';
const ALL_FILTERS_DIV_SELECTOR = '#leagues-table-all-filters';
const ROW_STATUS_LABEL_SELECTOR = '#row-status-label';

// //////////////////////////////////////////
// HELPERS
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const getTargetType = (target) => $(target).attr(FILTER_TARGET_TYPE_PROP);
const getTarget = (target) => $(target).attr(FILTER_TARGET_PROP);
const getDataType = (target) => $(target).attr(DATA_TYPE_PROP);
const getTaskId = (target) => $(target).attr('data-taskid');

// //////////////////////////////////////////
// FILTERING
let allTaskIds = [];
let todoTasks = new Set();
let activeFilters = [];

const updateRowCountLabel = () => {
    const rowCount = $('#leagues-table tr').length - 2; // Minus header and clear rows
    const hiddenRowCount = $('#leagues-table [leagues-row-filter=filtered]').length;
	const visibleRows = rowCount - hiddenRowCount;
	const visiblePct = Math.trunc(visibleRows / rowCount * 10000) / 100;
	$('#row-status-label')
		.text(`Displaying: ${visibleRows} / ${rowCount} tasks (${visiblePct}%)`);
}

const unfilter = () => {
	$(FILTERED_SELECTOR)
		.removeAttr('style')
		.removeAttr(FILTERED_ROW_PROP);
};

const filter = (target) => {
	const selection = $(target);
	selection
		.attr(FILTERED_ROW_PROP, FILTERED_ROW_PROP_VALUE)
		.css("display", "none");
};

const filterCompleted = () => {
	const row = $(`#${LEAGUES_TABLE} .wikisync-completed, #${LEAGUES_TABLE} .highlight-on`);
	filter(row);
};

const filterNA = () => {
	const row = $(`#${LEAGUES_TABLE} tr`).filter(function() {
		return $(this).text().toLowerCase().includes('n/a');
	});

	filter(row);
};

const filterTodo = () => {
    const row = $('[todo] > input:not(:checked)').parent().parent();
    filter(row);
};

const filterRegion = (target) => {
	const row = $(`[${REGION_TARGET_PROP}=${target}]`);
	filter(row);
};

const filterSkill = (target) => {
	const row = $(`#${LEAGUES_TABLE} span[data-skill=${target}]`).parent().parent();
	filter(row);
};

const filterDifficulty = (target) => {
    const row = $(`#leagues-table img[src*="${target}.png"]`).parent().parent().parent().parent();
	filter(row);
};

const filterMisc = (target) => {
	if (target === FILTER_MISC_TYPE.NA) {
		filterNA();
	} else if (target === FILTER_MISC_TYPE.COMPLETE) {
		filterCompleted();
	} else if (target === FILTER_MISC_TYPE.TODO) {
		filterTodo();
    }
};

function filterTasks() {
	unfilter();
	activeFilters.forEach((filter) => {
		if (filter.targetType === FILTER_TARGET_TYPE.DIFFICULTY) {
			filterDifficulty(filter.target);
		} else if (filter.targetType === FILTER_TARGET_TYPE.SKILL) {
			filterSkill(filter.target);
		} else if (filter.targetType === FILTER_TARGET_TYPE.REGION) {
			filterRegion(filter.target);
		} else if (filter.targetType === FILTER_TARGET_TYPE.MISC) {
			filterMisc(filter.target);
		} else {
			console.error('filter type is not implemented');
		}
	});

    updateRowCountLabel();
}

// //////////////////////////////////////////
// UI ELEMENTS / DOM
const updateParentCheckboxState = (targetType) => {
    const parentCheckbox = $(`input[data-lf-target=${targetType}]`);
    const childCount = $(`input[data-lf-target-type=${targetType}]`).length
    const checkedChildCount = $(`input[data-lf-target-type=${targetType}]:checked`).length;
    const uncheckedChildCount = childCount - checkedChildCount;

    if (checkedChildCount === childCount) return parentCheckbox.prop({ indeterminate: false, checked: true });
    if (uncheckedChildCount < childCount && checkedChildCount > 0) return parentCheckbox.prop({ indeterminate: true, checked: false });
    parentCheckbox.prop({ indeterminate: false, checked: false });
};

const fetchSavedTodo = () => {
    // Fetch saved todo list
    const savedTodo = localStorage.getItem('todoTasks') || '[]';
    const todoArray = JSON.parse(savedTodo);
    todoTasks = new Set(todoArray);

    // Update checkboxes
    const checkboxes = $('#leagues-table [todo] > input');
    checkboxes.each(function() {
        const taskId = getTaskId($(this).parent().parent());
        if (todoTasks.has(taskId)) $(this).prop({checked: true});
    });

    // Update the parent checkbox state
    updateParentCheckboxState('todo');
}

let suppressAutoFilter = false;
function handleCheckboxChange() {
	const filterEnabled = !($(this).is(':checked'));
	const targetType = getTargetType(this);
	const target = getTarget(this);

	if (filterEnabled) {
		// GUARD: Don't add a filter multiple times
		if (activeFilters.filter((x) => x.target === target).length) return;
		activeFilters.push({ target, targetType });
	} else {
		activeFilters = activeFilters.filter((x) => x.target !== target);
	}

    updateParentCheckboxState(targetType);
	if (!suppressAutoFilter) filterTasks();
}

function handleParentCheckboxChange() {
    // Don't run filters until all updates are complete to improve performance
    suppressAutoFilter = true;
	const filterEnabled = ($(this).is(':checked'));
	const targetType = getTargetType(this);
	const target = getTarget(this);
    $(`input[data-lf-target-type=${target}]`)
        .prop('checked', filterEnabled)
        .trigger('change');

    // Re-enable auto filtering
    suppressAutoFilter = false;
	filterTasks();
}

const saveTodo = () => {
    const taskArr = [...todoTasks];
    const taskArrJson = JSON.stringify(taskArr);
    localStorage.setItem('todoTasks', taskArrJson);
};

let suppressSave = false;
function handleTodoCheckboxChange() {
    const taskId = getTaskId($(this).parent().parent());
    const checked = ($(this).is(':checked'));

    // Add or remove the task from the todo list
    if (checked) todoTasks.add(taskId);
    else todoTasks.delete(taskId);

    // Save to localstorage
    if (!suppressSave) saveTodo();
    updateParentCheckboxState('todo');
}

async function handleTodoHeaderCheckboxChange() {
    suppressSave = true;
    const checked = ($(this).is(':checked'));
    $('input[data-lf-target-type=todo]').prop('checked', checked);
    suppressSave = false;

    if (!checked) todoTasks.clear();
    else todoTasks = new Set([...allTaskIds]);
    saveTodo();
}

const createCheckbox = (targetCell, callback, checked = true) => {
    const targetType = getTargetType(targetCell);
	const target = getTarget(targetCell);
    const checkbox = $(`
		<input
			type="checkbox"
			${checked ? 'checked' : ''}
			${FILTER_TARGET_TYPE_PROP}=${targetType}
			${FILTER_TARGET_PROP}=${target}
		/>
	`);
    $(targetCell).append(checkbox);
    checkbox.change(callback);

    return checkbox;
}

const createTargetElements = (targetCells) => {
	targetCells.each(function() {
		const dataType = $(this).attr(DATA_TYPE_PROP);
		if (dataType === DATA_TYPE.CHECKBOX) {
			return createCheckbox(this, handleCheckboxChange);
        } else if (dataType === DATA_TYPE.CHECK_ALL_CHECKBOX) {
            return createCheckbox(this, handleParentCheckboxChange);
		} else {
			console.error('data type is not implemented');
		}
	});
};

const createHeaderTodoCheckbox = () => {
    const headerElement = $(`
        <th id="todo-header">
            <div>To Do</div>
        </th>
    `).css({
        position: 'sticky',
        top: '-1px',
    }).attr({
        [FILTER_TARGET_TYPE_PROP]: 'checkbox',
        [FILTER_TARGET_PROP]: 'todo'
    });

    const headerCheckbox = createCheckbox(headerElement, undefined, false);
    $('#leagues-table thead > tr').append(headerElement);
    $('#todo-header').append(headerCheckbox);
    headerCheckbox.change(handleTodoHeaderCheckboxChange);
}

const createTodoRowCheckboxes = () => {
    $('#leagues-table tfoot > tr').append($('<td />'));
    const cellTargets = $('#leagues-table tbody > tr');
    const checkboxCell = $(`<td todo style="width: 5%;" ${FILTER_TARGET_TYPE_PROP}="todo" ${FILTER_TARGET_PROP}="checkbox" />`);
    checkboxCell.click(function(e) {
        e.stopPropagation();
    });

    cellTargets.append(checkboxCell);
    createCheckbox($('#leagues-table [todo]'), undefined, false);
    $('#leagues-table [todo] > input').change(handleTodoCheckboxChange);
}

const createTodoSelect = () => {
    createHeaderTodoCheckbox();
    createTodoRowCheckboxes();
}

const loadFilterTables = () => {
	$.get(window.mw.util.wikiScript('api'), {
		action: 'parse',
		page: 'Template:Sandbox/User:Loaf/AllCustomFilters',
		format: 'json',
	}, (data) => {
		$(`#${LEAGUES_TABLE}`).before(data.parse.text['*']);
	});
};

const layoutUpdates = async () => {
	$('#tbz-wikisync-number-of-shown-tasks').hide();
	$('.rs-wikisync-hide-completed').hide();
	$('#rs-qc-form').insertAfter(ALL_FILTERS_DIV_SELECTOR);
	$(ALL_FILTERS_DIV_SELECTOR).before(`
		<div
			style="
				border: 1px solid var(--wikitable-border);
				font-weight: bold;
				padding: 8px;
				background-color: var(--wikitable-header-bg);
				width: fit-content;"
		>
			<big id="row-status-label" />
		</div>
	`);

    createTodoSelect()
	updateRowCountLabel();
}

// //////////////////////////////////////////
// MAIN
// If anyone reading this is a wiki contributor, pls add the
// leagues-table id to the task table so this doesn't break <3
const getAllTaskIds = () => {
    $('tr[data-taskid]').each(function() {
        allTaskIds.push($(this).attr('data-taskid'));
    });
};

async function triggerLookupFilter () {
	await sleep(1000);
	filterTasks();
}

const markLeaguesTable = () => {
	const selection = $('[data-taskid]');
	selection
		.parent()
		.parent()
		.attr('id', LEAGUES_TABLE)
        .addClass('align-center-7');
}

const wikiScriptLoaded = async () => {
	let tries = 0;
	while ((!window.mw || !(window.mw?.util?.wikiScript)) && tries < 10) {
		await sleep(500);
		tries++;
	}
};

const filterTablesLoaded = async () => {
	let tries = 0;
	while(!$(`td[${DATA_TYPE_PROP}]`).length) {
		await sleep(500);
		tries++;
	}
};

const main = async () => {
	markLeaguesTable();
    getAllTaskIds();

	// Account for wiki JS delay
	await wikiScriptLoaded();
	loadFilterTables();

	// Account for JQuery injection delay
	await filterTablesLoaded();

	layoutUpdates();
	createTargetElements($(`[${DATA_TYPE_PROP}]`));

    // Update todo task checkboxes
    fetchSavedTodo();
}

$(document).ready(function() {
	main();
});

//	Listen for wiki task sync and re-filter
const syncTargets = [
	'sync.runescape.wiki/runelite/player',
	'sync.runescape.wiki/runescape/player',
];

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", async function(e) {
            if (this.readyState == 4 && syncTargets.some((x) => e.currentTarget.responseURL.includes(x))) {
				await sleep(500);
				filterTasks();
			}
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);