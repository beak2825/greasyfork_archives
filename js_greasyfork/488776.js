// ==UserScript==
// @name         Jortt hour and project overview
// @namespace    https://www.gears-for-engineers.com/
// @version      2024-03-01
// @description  Make an overview of all registered hours, default fixed hourly rate
// @license      MIT
// @author       timdrijvers
// @match        https://app.jortt.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jortt.nl
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/488776/Jortt%20hour%20and%20project%20overview.user.js
// @updateURL https://update.greasyfork.org/scripts/488776/Jortt%20hour%20and%20project%20overview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////////////////////////////////////////////////////////////////////////
    // Bunch of helper functions
    ////////////////////////////////////////////////////////////////////////

    function injectCSS(node, css) {
        let el = document.createElement('style');
        el.type = 'text/css';
        el.innerText = css;
        node.appendChild(el);
        return el;
    }

    function prefixzero(d) {
        return (d > 9 ? '' : '0') + d;
    }

    function yyyymmdd(d) {
        var mm = d.getMonth() + 1; // getMonth() is zero-based
        var dd = d.getDate();

        return [d.getFullYear(),
                prefixzero(mm),
                prefixzero(dd)
               ].join('-');
    }

    function row(columns, className="") {
        let row = document.createElement("tr");
        if (className !== "") {
            row.className = className;
        }
        for (const col of columns) {
            let cell = document.createElement("td");
            cell.append(col);
            row.append(cell);
        }
        return row;
    }

    function elem(type, attr, ...children) {
        let el = document.createElement(type);
        if (attr !== undefined) {
            el = Object.assign(el, attr);
        }

        for (let child of children) {
            el.append(child);
        }
        return el;
    }

    function whiteContainer(...children) {
        return elem("div", {"style": "background-color: #fff; padding: 20px; margin-top: 20px;"}, ...children);
    }

    function triggerInput(input, newValue) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
        ).set;
        nativeInputValueSetter.call(input, newValue);
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }

    function findAggregateId() {
        // Hours of projects get stored in projects, which are called aggregates
        const match = window.location.href.match("/aggregate_id/([^/]+)");
        if (match === null) {
            return null;
        }
        return match[1];
    }

    ////////////////////////////////////////////////////////////////////////
    // Callback functions that do the actual work.
    // Get triggered based on new elements with an ID of the map below
    ////////////////////////////////////////////////////////////////////////

    const callbackFunctions = {
        "projects-new": (node) => {
            //
            // Allow user to set a default hourly rate when editing a project
            //

            // Only when we're editing show this form
            const projectId = findAggregateId()
            if (projectId === null) {
                return;
            }
            const cacheKey = "fixedprice:" + projectId;

            let rootForm = node.shadowRoot.querySelector("form");
            injectCSS(
                rootForm,
                ".timd-custom-form div.button {display: flex; align-items: flex-end; justify-content: end; margin-top: 16px;}\n"+
                ".timd-custom-form button {border-radius: 8px; line-height: 1.1 !important; font-weight: 600; align-items: center; justify-content: center; gap: 6px; min-height: 38px; padding: 4px 10px; background-color: #39c; color: #fff; border: 1px solid transparent; cursor: pointer; }\n"+
                ".timd-custom-form label {display: block; min-height: 21px; color: #000; font-size: 14px; font-weight: 600;}\n"+
                ".timd-custom-form div.input {display: flex; border: 1px solid #E0E0E0; border-radius: 6px; height: 38px; line-height: 1.15; padding: 0 10px;}\n"+
                ".timd-custom-form input {font-size: 14px; font-weight: 400; line-height: 1.5; border: none; flex-grow: 1; width: 100%;}"
            );
            let button = elem("button", {}, "Opslaan");
            let input = elem("input", {});

            let container = whiteContainer(
              elem("label", {}, "Standaard uurtarief"),
              elem("div", {"className": "input"}, input),
              elem("div",{"className": "button"}, button)
            );
            container.className = "timd-custom-form";
            rootForm.parentNode.after(container);

            button.addEventListener("click", function () {
                if (isNaN(parseFloat(input.value.replace(/,/, '.')))) {
                    alert("Geen geldig nummer");
                    return;
                }
                GM.setValue(cacheKey, input.value);
            });

            GM.getValue(cacheKey, "").then((result) => {input.value = result});
        },
        "project-line-item-edit": (node) => {
            //
            // Set a default hourly rate when adding a new line item
            //

            const projectId = findAggregateId()
            if (projectId === null) {
                return;
            }
            const cacheKey = "fixedprice:" + projectId;
            GM.getValue(cacheKey, "").then((fixedPrice) => {
                if (fixedPrice !== "") {
                    triggerInput(node.shadowRoot.querySelector("input[name='line_item_amount']"), fixedPrice);
                }
            });
        },
        "projects-list": (node) => {
            //
            // Render a table with all hours of projects aggregated in a single overview for this month
            //

            // Create our own container
            let rootContainer = node.shadowRoot.querySelector("div[class*='PageLayout__Scrollable']");
            let container = whiteContainer();
            rootContainer.appendChild(container);

            injectCSS(
                container,
                ".timd-custom-table {width: 100%; border-collapse: collapse; }\n" +
                ".timd-custom-table thead tr {color: #39c; font-weight: 600; border-bottom: 1px solid #39c;}\n" +
                ".timd-custom-table td {padding: 10px;}\n" +
                ".timd-custom-table tr.first {border-top: 1px solid #39c;}\n" +
                ".timd-custom-table tr.weekend {background-color: #eee;}\n" +
                ".timd-custom-table tr.today {font-weight: bold;}\n" +
                ".timd-custom-table tbody tr:hover {background-color: #F3FBFF; }\n"
            );

            const today = new Date();
            container.appendChild(
                elem(
                    "h2",
                    {"style": "font-size: 18px; line-height: 24px;"},
                    "Samenvatting: "+today.toLocaleString('default',{ month: 'long' })
                )
            );

            let table = container.appendChild(
                elem(
                    "table",
                    {"className": "timd-custom-table"},
                    elem("thead", {}, row(["Dag", "Project", "Uren"]))
                )
            );
            let tableBody = table.appendChild(document.createElement("tbody"));


            fetch('/next_js/page/projects/list?', {method: 'GET'})
                .then(Result => Result.json())
                .then(response => {
                    // Generate urls for all projects
                    const urls = response.projects.map(
                        (project) => "/next_js/page/projects/show?period_cycle=month&period_date="+yyyymmdd(today)+"&aggregate_id="+project.aggregate_id
                    );

                    // Start fetching aggregated statistics for all projects
                    var requests = urls.map(url => fetch(url).then(response => response.json()));
                    Promise.all(requests)
                        .then(
                        (results) => {
                            // Helpers
                            const daysOfWeek = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
                            const isWeekend = (day) => day == 0 || day == 6;
                            const getProjectName = (project) => project.name + (project.customer_name !== null ? " | "+project.customer_name : "");

                            // Aggregate statistics for all projects date => [project lines]
                            let aggregated = {};
                            for (const project of results) {
                                for (const line_item of project.project_line_item_records) {
                                    if (!(line_item.date in aggregated)) {
                                        aggregated[line_item.date] = [];
                                    }
                                    aggregated[line_item.date].push({"project": getProjectName(project.project), "hours": line_item.quantity});
                                }
                            }

                            // Fill the table
                            let currentYear = today.getFullYear();
                            let currentMonth = today.getMonth();
                            let currentDay = today.getDate();
                            let daysOfMonth = new Date(currentYear, currentMonth+1, 0).getDate();

                            for (let day = 1; day <= daysOfMonth; day++) {
                                let first = true;
                                const dayKey = currentYear+"-"+prefixzero(currentMonth+1)+"-"+prefixzero(day);
                                const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
                                const dayCell = day+" - "+daysOfWeek[dayOfWeek];
                                const classNames = (f) => [
                                    f?"first":"",
                                    isWeekend(dayOfWeek)?"weekend": "",
                                    currentDay == day ? "today" : ""
                                ].join(" ");

                                if (!(dayKey in aggregated)) {
                                    tableBody.append(row(
                                        [dayCell, "", ""],
                                        classNames(first)
                                    ));
                                    continue;
                                }


                                for (const line_item of aggregated[dayKey]) {
                                    tableBody.append(
                                        row([
                                            dayCell,
                                            line_item.project,
                                            line_item.hours
                                        ],classNames(first))
                                    );
                                    first = false;
                                }

                            }
                        }
                    );
                });
        }
    };

    ////////////////////////////////////////////////////////////////////////
    // Setup MutationObserver to keep track of the application's state
    ////////////////////////////////////////////////////////////////////////


    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("next_js_app-root");
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.id in callbackFunctions) {
                        callbackFunctions[addedNode.id](addedNode);
                    }
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
