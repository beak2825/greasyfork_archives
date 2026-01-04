// ==UserScript==
//
// @name         Merge Mansion Task Tracker
// @version      1.2.3
// @license      GNU GPLv3
// @icon         https://styles.redditmedia.com/t5_3lufdh/styles/communityIcon_8o2sfjl1xcc61.jpg
// @description  Add checkboxes to track task completion status in task table
// @description  Add switch to show/hide compleated tasks
// @description  Remembers marked tasks in the browser
// @description  Table of cumulative costs is updating itself live while you select tasks
// @description  Add switch to show/hide compleated costs
//
// @namespace    merge-mansion-fandom-com
// @author       ARH
//
// @match        merge-mansion.fandom.com/*
//
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
//
// @downloadURL https://update.greasyfork.org/scripts/464589/Merge%20Mansion%20Task%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/464589/Merge%20Mansion%20Task%20Tracker.meta.js
// ==/UserScript==

// a word of explanation...
// i despise hungerian notation!
// all prefixex and sufixes that describe a type or visibility
// i make 1 exception here
// due to lack of IDE that can show me the type
// and because i have 2 types of objects that wrap the same content
// and it is not clear when what object is being used
// and so ... var_jq and var_html are jQuery or html (native javascript) objects for html elements

var run = true;
var log_prefix = "ARH/mmWiki/"
var log = console;

var UI = new function() {
    function Element(tag) {
        this._tag = tag
        this._element = document.createElement(tag)
        this.get = function() {return this._element}
        this.class = function(...new_classes){this._element.classList.add(...new_classes); return this}
        this.child = function(new_child){this._element.appendChild(new_child); return this}
        this.href = function(value){this._element.href = value; return this}
        this.id = function(value){this._element.id = value; return this}
        this.src = function(value){this._element.src = value; return this}
        this.type = function(value){this._element.type = value; return this}
        this.name = function(value){this._element.name = value; return this}
        this.min = function(value){this._element.min = value; return this}
        this.max = function(value){this._element.max = value; return this}
        this.content = function(value){this._element.textContent = value; return this}
        this.checked = function(value){this._element.checked = value; return this}
        this.attr = function(name, value){this._element.setAttribute(name, value); return this}
        this.for = function(value){return this.attr("for", value)}
    }

    this.make = function(tag) { return new Element(tag) }
}

var $ = window.jQuery;
function ensure_jquery_available(){
    if ($ !== undefined) return
    log.warn(log_prefix, "fixing JQuery absent")
    let jq = UI.make("script").src("https://code.jquery.com/jquery-3.6.0.min.js").get()
    document.getElementsByTagName('head')[0].appendChild(jq);
    if (window.jQuery !== undefined)
        { $ = window.jQuery; }
    else
        { log.warn(log_prefix, "couldn't fix JQuery absent") }
};ensure_jquery_available()

var sheet = (() => {
    let found_sheet = $("style.ARH")
    if (found_sheet.length > 0)
        { return found_sheet[0].sheet }
    let style = UI.make("style").class("ARH").get()
    document.head.appendChild(style);
    return style.sheet;
})();

// prepare save/load util objects
var su = new SettingsUtils(log_prefix);
var saved_complete = su.make_array_option("missions complete", [], "missions marked as 'complete', IDs for HTML elements in rows");
var saved_in_progress = su.make_array_option("missions in progress", [], "missions marked as 'in progress', IDs for HTML elements in rows");

var tasksTable_jq;
var costsTable_jq;

/* ====================
      simple Utils
   ==================== */

function addCcsRules(selector, ...rules) {
    let jointRules = rules.reduce((a, b) =>
    {
        a = a.trim()
        b = b.trim()

        if (a.endsWith(";"))
            { a = a.substr(0, a.length - 1) }
        a = a + ";"
        if (b.endsWith(";"))
            { b = b.substr(0, b.length - 1) }
        return a + " " + b
    })
    sheet.insertRule(`${selector} { ${jointRules} }`)
}

function parse_amount(string_amount) {
    var text_amount = string_amount
        .replace("x","")
        .replace("+","")
        .replace(",","")
    let multiplier = 1
    if (text_amount.indexOf("K") >-0) multiplier = 1000
    if (text_amount.indexOf("M") >-0) multiplier = 1000000
    if (text_amount.indexOf("G") >-0) multiplier = 1000000000
    if (text_amount.indexOf("T") >-0) multiplier = 1000000000000
    text_amount = text_amount
        .replace("K","")
        .replace("M","")
        .replace("G","")
        .replace("T","")
    text_amount = text_amount.trim()
    return parseFloat(text_amount) * multiplier
}

/* ====================
         ctors
   ==================== */

function SettingsUtils(prefix = "ARH/") {
    const ValueType = {
        none: "none",
        bool: "bool",
        int: "int",
        float: "float",
        string: "string",
        date: "date",
        array: "array",
    }
    const _prefix = prefix

    function load_setting(key, default_value, prefix = _prefix) {
        try {
            var value = JSON.parse(localStorage.getItem(prefix + key))
        }
        catch(err) {
            log.error(log_prefix, "load_setting()", err)
            value = default_value
        }
        if (value == null) {
            log.warn(log_prefix, `setting ${prefix + key} is empty, using default: ${default_value}`)
            value = default_value
        }
        return value
    }

    function save_setting(key, value, prefix = _prefix) {
        try {
            localStorage.setItem(prefix + key, JSON.stringify(value))
        }
        catch(err) {
            log.error(log_prefix, "save_setting()", err)
        }
    }

    function remove_setting(key, prefix = _prefix) {
        try {
            localStorage.removeItem(prefix + key)
        }
        catch(err) {
            log.error(log_prefix, "remove_setting()", err)
        }
    }

    // setting creation

    this.make_some_option = function(key_param, default_value_param, type_param, description_1_param) {
        return {
            key: key_param,
            default_value: default_value_param,
            type: type_param,
            description_1: description_1_param,
            _value: null,
            _load: function() { this._value = load_setting(this.key, this.default_value) ; return this._value; },
            _save: function() { save_setting(this.key, this._value) },
            get Value() { if (this._value == null) { this._load() ; this._save() } ; return this._value },
            set Value(v) { this._value = v ; this._save() },
            remove: function() { remove_setting(this.key) },
        }
    }

    this.make_bool_option = function(key_param, default_value_param, description_1_param) {
        return this.make_some_option(key_param, default_value_param, ValueType.bool, description_1_param)
    }

    this.make_string_option = function(key_param, default_value_param, description_1_param) {
        return this.make_some_option(key_param, default_value_param, ValueType.string, description_1_param)
    }

    this.make_array_option = function(key_param, default_value_param, description_1_param) {
        return this.make_some_option(key_param, default_value_param, ValueType.array, description_1_param)
    }
}

function TaskWrapper(taskRow_jq_init) {
    this.taskRow_jq = taskRow_jq_init;
    this.checkbox_completed_html = this.taskRow_jq.find(".completed-checkbox")[0];
    this.checkbox_in_progress_html = this.taskRow_jq.find(".in-progress-checkbox")[0];
    this.task_id = this.taskRow_jq.find("td:first-child span").attr("id");
    this.prequelTasks_jq_a = this.taskRow_jq.find("td:nth-child(3) a");
    this.sequelTasks_jq_a = this.taskRow_jq.find("td:nth-child(4) a");

    // setters

    this.setTaskStatusCompleated = function(new_status) {
        if (this.checkbox_completed_html.checked != new_status) {
            this.checkbox_completed_html.checked = new_status;
            this.handleChange_statusCompleated();
        }
    }

    this.setTaskStatusInProgress = function(new_status) {
        if (this.checkbox_in_progress_html.checked != new_status) {
            this.checkbox_in_progress_html.checked = new_status;
            this.handleChange_statusInProgress();
        }
    }

    // change handlers

    this.handleChange_statusCompleated = function(triggeredByUser=false) {
        if (this.checkbox_completed_html.checked) {
            this.colorTaskCompleted();
        } else {
            this.unColorTaskCompleted();
        }
        if (triggeredByUser)
            updateCostsData(costsTable_jq);
    }

    this.handleChange_statusInProgress = function(triggeredByUser=false) {
        if (this.checkbox_in_progress_html.checked) {
            this.colorTaskInProgress();
        } else {
            this.unColorTaskInProgress();
        }
        if (triggeredByUser)
            updateCostsData(costsTable_jq);
    }

    // css, save localy, propagation

    this.colorTaskCompleted = function() {
        this.taskRow_jq.addClass("completed-task");

        localStorage_saveMarkedValue(saved_complete, this.task_id);
        log.debug(log_prefix, `Task ${this.task_id} marked as completed:`, this.taskRow_jq);

        this.setTaskStatusInProgress(false); // TODO // ARH // move out of 'color' function
        this.prequelTasks_jq_a.each((i, e) => getTaskFromHyperlink(e)?.setTaskStatusCompleated(true));
    }

    this.unColorTaskCompleted = function() {
        this.taskRow_jq.removeClass("completed-task");

        localStorage_saveUnMarkedValue(saved_complete, this.task_id);
        log.debug(log_prefix, `Task ${this.task_id} unmarked as completed: ${this.taskRow_jq}`);

        this.sequelTasks_jq_a.each((i, e) => getTaskFromHyperlink(e)?.setTaskStatusCompleated(false));
        this.sequelTasks_jq_a.each((i, e) => getTaskFromHyperlink(e)?.setTaskStatusInProgress(false));
    }

    this.colorTaskInProgress = function() {
        this.taskRow_jq.addClass("in-progress-task");

        localStorage_saveMarkedValue(saved_in_progress, this.task_id);
        log.debug(log_prefix, `Task ${this.task_id} marked as in progress: ${this.taskRow_jq}`);

        this.setTaskStatusCompleated(false);
        this.prequelTasks_jq_a.each((i, e) => getTaskFromHyperlink(e)?.setTaskStatusCompleated(true));
    }

    this.unColorTaskInProgress = function() {
        this.taskRow_jq.removeClass("in-progress-task");

        localStorage_saveUnMarkedValue(saved_in_progress, this.task_id);
        log.debug(log_prefix, `Task ${this.task_id} unmarked as in progress: ${this.taskRow_jq}`);
    }

}

/* ====================
      check events
   ==================== */

// main events

function handle_taskStatusCompleated_change(e) {
    log.debug(log_prefix, "event: status 'compleated' change", e);
    const triggeredByUser = true;
    (new TaskWrapper($(e.target).closest('tr')))
        .handleChange_statusCompleated(triggeredByUser);
}

function handle_taskStatusInProgress_change(e) {
    log.info(log_prefix, "event 'in progress'", e.target);
    const triggeredByUser = true;
    (new TaskWrapper($(e.target).closest('tr')))
        .handleChange_statusInProgress(triggeredByUser);
}

function toggleVisibilityForCompleatedTasks(e) {
    if ($(e.target).prop('checked')) {
        tasksTable_jq.find("tr.completed-task").addClass("smaller");
    } else {
        tasksTable_jq.find("tr.completed-task").removeClass("smaller");
    }
}

function toggleVisibilityForCompleatedCosts(e) {
    if ($(e.target).prop('checked')) {
        costsTable_jq.find(".completed-task").addClass("smaller");
    } else {
        costsTable_jq.find(".completed-task").removeClass("smaller");
    }
}

// save to local storage utils

function localStorage_saveMarkedValue(option, value) {
    if (option.Value.includes(value)) { return; }
    option.Value.push(value);
    option.Value = option.Value;
}

function localStorage_saveUnMarkedValue(option, value) {
    if (!option.Value.includes(value)) { return; }
    let index = option.Value.indexOf(value);
    option.Value.splice(index, 1);
    option.Value = option.Value;
}

// utils

function getTaskFromHyperlink(elemnetA_html) {
    log.debug(log_prefix, "investigated an element", elemnetA_html);
    const taskId = elemnetA_html.href.split("#")[1];
    if (taskId === undefined)
        return undefined;
    return new TaskWrapper($("#"+taskId).closest('tr'));
}

function getHtmlForSwitch(checkbox_id, switch_class) {
    return `\
        <input id="${checkbox_id}" name="${checkbox_id}" type="checkbox" style="display:none;" />\
        <label class="${switch_class}" for="${checkbox_id}"></label>\
        `;
}

/* ====================
      functionality
   ==================== */

function init() {

    function addCustomStyle() {
        (function addCss_tasksColors() {
            addCcsRules(".completed-task",
                        "background-color: rgba(0, 255, 0, 0.2); /* green */")
            addCcsRules(".in-progress-task",
                        "background-color: rgba(255, 255, 0, 0.2); /* yellow */")
        })();

        (function addCss_switch() {
            addCcsRules(".toggle_label",
                        "display: block;",
                        "width: 25px;",
                        "height: 16px;",
                        "background-color: rgb(94, 94, 94);",
                        "border-radius: 100px;",
                        "position: relative;",
                        "cursor: pointer;",
                        "transition: 0.5s;",
                        "box-shadow: 0 0 50px #477a85;",
                        )
            addCcsRules(".toggle_label::after",
                        'content: "";',
                        "width: 12px;",
                        "height: 12px;",
                        "background-color: rgba(255, 255, 255, 0.6);",
                        "position: absolute;",
                        "border-radius: 12px;",
                        "top: 2px;",
                        "left: 2px;",
                        "transition: 0.5s;",
                        )
            addCcsRules("input:checked + label.toggle_label",
                        "background-color: rgb(85, 23, 89);",
                        )
            addCcsRules("input:checked + label.toggle_label:after",
                        "left: calc(100% - 11px);",
                        "transform: translateX(-25%);",
                        )
        })();

        (function addCss_hidden() {
            addCcsRules(".hidden",
                        "display: none;",
                        )
        })();

        (function addCss_smaller() {
            addCcsRules("tr.smaller > td:not(:nth-child(1)), td.smaller",
                        "font-size: 8px;",
                        "padding-top: 0px;",
                        "padding-bottom: 0px;",
                        )
            addCcsRules("tr.smaller > td:nth-child(1)",
                        "padding-top: 0px;",
                        "padding-bottom: 0px;",
                        )
            addCcsRules("tr.smaller > td img, td.smaller img",
                        "display: none;",
                        )
        })();

        log.debug(log_prefix, "style injected");
    }

    function markHtmlTablesWithClasses() {
        $("table.article-table:contains('Name')").first().addClass('tasks');
        $("table.article-table:contains('Item chain')").first().addClass('costs');
    }

    addCustomStyle();
    markHtmlTablesWithClasses();

    tasksTable_jq = $("table.tasks").first();
    costsTable_jq = $("table.costs").first();
}

function loadTasksProgress() {

    function addSwitchForCompleatedTasks() {
        let table_header = tasksTable_jq.find('tr:first').first()
        table_header.append(`<th>C ${getHtmlForSwitch("checkbox_toggle_visibility_compleated", "toggle_label")}</th><th>P</th>`);
    }

    function addCheckboxesForCompleteAndInProgress()
    {
        $(tasksTable_jq).find('tr:gt(0)').each(function(index, row) {
            $(row).append('<td><input type="checkbox" class="completed-checkbox"></td><td><input type="checkbox" class="in-progress-checkbox"></td>');
        });

        log.debug(log_prefix, "checkboxes added");
    }

    function loadTasksProgressFromStorage()
    {
        log.debug(log_prefix, "loadTasksProgressFromStorage() 'compleated'", saved_complete.Value)
        for (let i of saved_complete.Value) {
            getTaskFromHyperlink({href:`#${i}`})?.setTaskStatusCompleated(true);
        }

        log.debug(log_prefix, "loadTasksProgressFromStorage() 'in progress'", saved_in_progress.Value)
        for (let i of saved_in_progress.Value) {
            getTaskFromHyperlink({href:`#${i}`})?.setTaskStatusInProgress(true);
        }
    }

    addSwitchForCompleatedTasks(tasksTable_jq);
    $("#checkbox_toggle_visibility_compleated").on("change", toggleVisibilityForCompleatedTasks);

    addCheckboxesForCompleteAndInProgress();
    $(document).on('change', '.completed-checkbox', handle_taskStatusCompleated_change);
    $(document).on('change', '.in-progress-checkbox', handle_taskStatusInProgress_change);

    loadTasksProgressFromStorage();
}

function loadCostsUpdate() {

    function addSwitchForCompleatedCosts() {
        let table_header = costsTable_jq.find('tr:first').first()
        let th = table_header.find("th:contains(Needed)").first()
        th.html(th.html() + getHtmlForSwitch("checkbox_toggle_visibility_costs_compleated", "toggle_label"))
    }

    updateCostsData();
    addSwitchForCompleatedCosts();
    $("#checkbox_toggle_visibility_costs_compleated").on("change", toggleVisibilityForCompleatedCosts);
}

function updateCostsData()
{
    log.debug(log_prefix, "updateCostsData(...)")
    function process_raw_cost_line(costs_raw)
    {
        function internal(line)
        {
            let items_raw = $("<a>").append(line).text().trim().split("x  ")
            let items = []
            if (items_raw.length > 1)
            {
                items = [ items_raw[1], parseInt(items_raw[0]) ]
            }
            else
            {
                items = [ items_raw[0], 1 ]
            }
            costs_raw.push(items)
        }
        return internal
    }

    function raw_cost_to_dict_quantity(raw_costs)
    {
        let costs_cumulative = {};
        raw_costs.forEach(([name, qty]) => {
            costs_cumulative[name] = (costs_cumulative[name] || 0) + qty;
        });
        return costs_cumulative
    }

    function tasks_tr_to_costs_quantity(tr)
    {
        let costs_raw = []
        $(tr).find("td:nth-child(5)").each((index, td) => {
            $(td).html().split("<br>").forEach(process_raw_cost_line(costs_raw))
        })

        let costs_cumulative = raw_cost_to_dict_quantity(costs_raw)
        // console.log(costs_cumulative)
        return costs_cumulative
    }

    function get_costs_from_tasks(exclude_condition_css_selector = "")
    {
        let costs_raw_1 = []
        tasksTable_jq.find(`tr:not(:first-child)${exclude_condition_css_selector} td:nth-child(5)`).each((index, td) => {
            $(td).html().split("<br>").forEach(process_raw_cost_line(costs_raw_1))
        })
        // console.log(costs_raw_1)

        let costs_cumulative_1 = raw_cost_to_dict_quantity(costs_raw_1)
        // console.log(costs_cumulative_1)
        return costs_cumulative_1
    }

    function get_costs_from_costs()
    {
        let costs_raw_2 = []
        costsTable_jq.find("tr:not(:first-child)").each((idx, tr)=> {
            let asd=$(tr).find("td:not([rowspan])")
            console.log(asd)
            costs_raw_2.push([$(asd[1]).text().trim(), parseInt($(asd[2]).text())])
        })
        // console.log(costs_raw_2)

        let costs_cumulative_2 = raw_cost_to_dict_quantity(costs_raw_2)
        // console.log(costs_cumulative_2)
        return costs_cumulative_2
    }

    let costs_all = get_costs_from_tasks()
    // console.log(costs_all);

    // let costs_not_compleated = get_costs_from_tasks(":not(.completed-task)")
    // console.log(costs_not_compleated);

    let costs_compleated = get_costs_from_tasks(".completed-task")
    // console.log(costs_compleated);

    // example
    // {
    // 900: 1
    // "Adjustable Wrench (L2)": 1
    // "Anthurium (L6)": 1
    // "Baby Cacti (L1)": 3
    // }

    let costs_all_substracted = {}
    for (let key in costs_all) {
        costs_all_substracted[key] = costs_all[key] - (costs_compleated[key] || 0);
    }
    // console.log(costs_all_substracted);

    let new_td_text = null
    for (let key in costs_all_substracted) {
        new_td_text = costs_all_substracted[key]
        // var new_td_text = `${costs_all_substracted[key]} (${costs_all[key]})`
        costsTable_jq.find(`td:not(:contains(required)):contains(${key})`).first().next().text(new_td_text)
    }

    function markCompleatedCosts()
    {
        costsTable_jq.find("td.completed-task").removeClass("completed-task")
        costsTable_jq.find("td:not(:contains(required)):contains((L) + td:contains(0)").filter(function(){return $(this).text() === "0"}).addClass("completed-task")
        costsTable_jq.find("td.completed-task").closest("tr").find("td:not([rowspan])").addClass("completed-task")
    }
    markCompleatedCosts();
}

/* ====================
          main
   ==================== */

function main() {
    init();

    loadTasksProgress()
    loadCostsUpdate()
}

(function() {
    'use strict';
    log.debug(log_prefix, "Start");

    main();

    log.debug(log_prefix, "End");
})();

// TODO refactor this shit for higher readability and maintainability
// TODO propagate 'compleated costs' status through the table.costs to [rowspan]s
/* TODO fix bugs
    - none -
*/
