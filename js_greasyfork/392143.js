// ==UserScript==
// @name         AutoWorkingHours
// @namespace    es.csnv.autoworkinghours
// @version      2.0.4
// @description  Completa el working hours
// @author       JC
// @match        https://myte.accenture.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392143/AutoWorkingHours.user.js
// @updateURL https://update.greasyfork.org/scripts/392143/AutoWorkingHours.meta.js
// ==/UserScript==

/* jshint esversion: 2020 */

(function() {
    'use strict';

    /** Schedule configuration, based on week days **/
    const schedule = {
        mon: ["08", "00", "AM", "04", "30", "PM", "0.5"],
        tue: ["08", "00", "AM", "04", "30", "PM", "0.5"],
        wed: ["08", "00", "AM", "04", "30", "PM", "0.5"],
        thu: ["08", "00", "AM", "04", "30", "PM", "0.5"],
        fri: ["08", "00", "AM", "03", "30", "PM", "0.0"],
        sat: ["", "", "AM", "", "", "AM", ""],
        sun: ["", "", "AM", "", "", "AM", ""],
    };
    // Empty row state
    const empty = ["", "", "AM", "", "", "AM", ""];

    // Interface elements' query selector strings
    const elements = {
        WINDOW: "#punch-clock-popup",
        FOOTER_BAR: "#punch-clock-popup .footer > div",
        ROW_CONTAINER: "#workingHoursPunchClockGrid .ag-center-cols-container",
        SUBMIT_BUTTON: "#punch-clock-popup .myte-button.myte-button-submit"
    };

    // Relationship between select index in row and index in shedule array
    const selectRel = {
        0: 3,
        1: 4,
        2: 5,
        3: 6,
        4: 0,
        5: 1,
        6: 2,
    };

    const jQuery = window.jQuery;

    var Automator = {
        /**
         * Initialization
         */
		init: function() {
			this.waitUntilExists();
		},

        /**
         * Helper function. Wait until fnCondition is truthy
         */
        waitFor: function(fnCondition) {
            return new Promise((res, rej) => {
                const evaluate = () => {
                    const result = fnCondition();
                    if (result) {
                        res(result);
                    } else {
                        setTimeout(() => evaluate(), 500);
                    }
                };
                evaluate();
            });
        },

        /**
         * Wait until the Working Hours table element is visible.
         * This is a hack because we are lazy
         */
		waitUntilExists: async function() {
            await this.waitFor(() => document.querySelector(elements.WINDOW));
			this.addFillAllButton();
            this.addClearRowButton();
            this.waitUntilHides();
		},

        /**
         * Wait until the Working Hours table element hides.
         * This is a hack because we are lazy
         */
		waitUntilHides: async function() {
            await this.waitFor(() => !document.querySelector(elements.WINDOW));
            this.waitUntilExists();
		},

        /**
         * Add FillAll button in the container footer
         */
        addFillAllButton: async function() {
            const bar = await this.waitFor(() => document.querySelector(elements.FOOTER_BAR));
            const button = document.createElement("button");
			const that = this;

			button.innerText = "Autofill";
            button.classList.add("myte-button");
			button.addEventListener("click", function(e) {
				this.onAutoFill(e);
			}.bind(this));

            bar.insertBefore(button, bar.firstChild);
        },

        /**
         * Add clear button on each row
         */
        addClearRowButton: async function() {
            const clearButton = document.createElement("button");
            clearButton.innerText = "X";
            clearButton.style.position = "absolute";
            clearButton.classList.add("myte-button");
            clearButton.style.right = "0";
            clearButton.style.minWidth = "0";

            const numRows = document.querySelectorAll(".header-date-cell").length;
            await this.waitFor(() => document.querySelector(elements.ROW_CONTAINER)?.children.length >= numRows);
            const container = document.querySelector(elements.ROW_CONTAINER);
            const rows = Array.from(container.children);
            const NUM_SELECT_IN_ROW = 7;

            rows.forEach(async row => {
                const rowButton = clearButton.cloneNode(true);
                rowButton.addEventListener("click", (e) => this.clearRow(row, e));
                await this.waitFor(() => row.querySelectorAll("select").length === NUM_SELECT_IN_ROW); // Row may not be "rendered"
                row.appendChild(rowButton);
            });
        },

        /**
         * Applies days' table/configuration
         */
		onAutoFill: function(e) {
            const container = document.querySelector(elements.ROW_CONTAINER);
            const rows = Array.from(container.children);

            rows.forEach(row => {
                const firstChild = row.querySelector("* > div:first-child"); // Day label is present in first child
                if (!firstChild) {
                    throw "Could not read day label";
                }
                const day = firstChild.innerText.split(",")[0].toLowerCase();
                const selectList = Array.from(row.querySelectorAll("select"));
                const dayHours = schedule[day];
                this.setRow(row, dayHours);
            });
		},

        /**
         * Set values to row's each select element
         */
        setRow: function(row, values) {
            const rel = {
                "workStartTime": [0, 1, 2],
                "workEndTime": [3, 4, 5],
                "breakDuration": [6]
            };

            Object.entries(rel).forEach(([sKey, colArr]) => {
                row.querySelectorAll(`[col-id="${sKey}"] select`).forEach((sel, arrayPos) => {
                    const valueIndex = colArr[arrayPos];
                    const value = values[valueIndex];
                    sel.selectedIndex = this.getIndexFromValue(sel, value);
                    sel.dispatchEvent(new Event("change"));
                });
            });
        },

        /**
         * Clears content of current row select elements
         */
        clearRow: function(row, event) {
            event.preventDefault();
			event.stopPropagation();

            this.setRow(row, empty);
        },

        /**
         * Get index from the element matching the value passed by parameter, just like Array.prototype.findIndex
         */
		getIndexFromValue: function(element, value) {
			for (var i = 0; i < element.options.length; i++) {
				if (element.options[i].innerText === value) {
					return i;
				}
			}

			return -1;
		}
	};

	Automator.init();
})();