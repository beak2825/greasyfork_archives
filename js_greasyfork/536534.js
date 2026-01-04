// ==UserScript==
// @name        Batch Change Package
// @namespace   https://violentmonkey.github.io
// @version     0.2.3
// @description Batch change package for multiple buildings for an account.
// @author      Anton Grouchtchak
// @match       https://office.roofingsource.com/admin/AccountView.php*
// @icon        https://office.roofingsource.com/images/roofing-source-logo.png
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/536534/Batch%20Change%20Package.user.js
// @updateURL https://update.greasyfork.org/scripts/536534/Batch%20Change%20Package.meta.js
// ==/UserScript==

/* globals $ */

(() => {
    "use strict";

    const state = {
        buildings: [],
        selectedIds: new Set()
    };

    // DOM global element references.
    /** The dialog window. */
    let $dialog;
    /** The scrollable list of buildings. */
    let $scroll;
    /** The dropdown for selecting a new package. */
    let $packageDropdown;
    /** The dropdown for selecting a new status. */
    let $statusDropdown;
    /** The label showing the number of selected buildings. */
    let $selectedCount;
    /** The progress bar for showing submission progress. */
    let $progress;
    /** The label inside the progress bar. */
    let $label;
    /** The button to select all buildings. */
    let $btnSelectAll;
    /** The button to deselect all buildings. */
    let $btnDeselectAll;
    /** The button to submit the selected buildings. */
    let $btnSubmit;

    const NO_PACKAGE_TEXT = "No Package";

    // const PACKAGE_OPTIONS_OLD = {
    //     0: NO_PACKAGE_TEXT,
    //     9: "Quote Only",
    //     12: "Billable Leak",
    //     13: "Customized RoofCare",
    //     25: "RoofCare $1199",
    //     26: "RoofCare $1,099",
    //     31: "RoofCare+ (3 visits) $1,799",
    //     46: "RoofCare+ (3 visits) $1,899",
    //     47: "GreaseCare (3 visits) $999",
    //     48: "GreaseCare (3 visits) $1,099"
    // };

    // const PACKAGE_OPTIONS_OLD = {
    //     0: NO_PACKAGE_TEXT,

    //     9: "Quote Only",
    //     12: "Billable Leak",
    //     13: "Customized RoofCare",

    //     // MCD
    //     74: "RoofCare $1,299",
    //     61: "Cont. RoofCare $1,199",
    //     66: "GreaseCare (3 visits) $1199",
    //     57: "Cont. GreaseCare (3 visits) $1099",
    //     72: "RoofCare+ (3 visits) $2,099",
    //     59: "Cont .RoofCare+ (3 visits) $1,999",

    //     // Other
    //     77: "RoofCare $1399",
    //     64: "Cont. RoofCare $1299",
    //     65: "GreaseCare (3 visits) $1299",
    //     56: "Cont. GreaseCare (3 visits) $1199",
    //     73: "RoofCare+ (3 visits) $2,199",
    //     60: "Cont. RoofCare+ (3 visits) $2,099"
    // };

    const PACKAGE_OPTIONS = [
        {
            options: [
                [0, NO_PACKAGE_TEXT]
            ]
        },
        {
            label: "Active Packages",
            options: [
                [9, "Quote Only"],
                [13, "Customized RoofCare"],
                [12, "Billable Leak"],
                [70, "New Roof RoofCare $799"],
                [71, "New Roof RoofCare $899"],
                [66, "GreaseCare (3 visits) $1199"],
                [74, "RoofCare $1,299"],
                [65, "GreaseCare (3 visits) $1299"],
                [67, "GreaseCare (4 visits) $1399"],
                [77, "RoofCare $1399"],
                [75, "RoofCare $1,499"],
                [68, "New Roof RoofCare+ (3 visits) $1,499"],
                [76, "RoofCare $1,599"],
                [69, "New Roof RoofCare+ (3 visits) $1,599"],
                [72, "RoofCare+ (3 visits) $2,099"],
                [73, "RoofCare+ (3 visits) $2,199"],
                [80, "RoofCare+ (4 visits) $2,399"]
            ]
        },
        {
            label: "Continuous Packages",
            color: "blue",
            options: [
                [57, "Cont. GreaseCare (3 visits) $1099"],
                [56, "Cont. GreaseCare (3 visits) $1199"],
                [61, "Cont. RoofCare $1,199"],
                [64, "Cont. RoofCare $1299"],
                [58, "Cont. GreaseCare (4 visits) $1299"],
                [62, "Cont. RoofCare $1,399"],
                [63, "Cont. RoofCare $1,499"],
                [59, "Cont. RoofCare+ (3 visits) $1,999"],
                [60, "Cont. RoofCare+ (3 visits) $2,099"],
                [79, "Cont. RoofCare+ (4 visits) $2,299"]
            ]
        },
        {
            label: "Legacy Packages",
            color: "red",
            options: [
                [19, "ENDING - GreaseCare (3 visits) $799"],
                [48, "ENDING - GreaseCare (3 visits) $1099"],
                [25, "ENDING - RoofCare $1199"],
                [46, "ENDING - RoofCare+ (3 visits) $1,899"]
            ]
        }
    ];

    const STATUS_OPTIONS = [
        [1, "Active"],
        [2, "Inactive"],
        [3, "New Building"],
        [4, "Delinquent"],
        [5, "Bad Standing"],
        [6, "Temporarily Active"],
        [7, "(Demo)"],
        [8, "Not Maintainable"],
        [9, "Prospect"]
    ];

    /**
     * Inject scoped CSS for styling.
     */
    const injectStyles = () => {
        const style = document.createElement("style");
        style.textContent = `
            .ui-dialog-buttonpane button {
                width: auto !important;
                text-align: center !important;
            }

            #building-table-container table {
                width: 100%;
                border-collapse: collapse;
            }

            #building-table-container table th,
            #building-table-container table td {
                padding: 4px 8px;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #building-table-container table tr:nth-child(even) {
                background-color: #edf0f2;
            }

            #submit-progress {
                margin-top: 15px;
                height: 30px;
                position: relative;
            }

            .progress-label {
                position: absolute;
                width: 100%;
                text-align: center;
                font-weight: bold;
                line-height: 30px;
                font-size: 14px;
            }

            .dropdown-row {
                margin-bottom: 10px;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    };

    /**
     * Determine color for renewal date. Green for today and future, blue for past, and red for no date.
     * @param {string} renewalStr - Date string in MM-DD-YYYY format.
     * @returns {string} CSS color.
     */
    const getRenewalColor = (renewalStr) => {
        if (renewalStr === "--") {
            return "#FF0000"; // No date provided.
        }

        const [mm, dd, yyyy] = renewalStr.split("-").map(Number);
        const renewalDate = new Date(yyyy, mm - 1, dd);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize for date-only comparison.

        return renewalDate >= today ? "#009900" : "#0066cc";
    };

    /**
     * Create the dialog container div.
     */
    const createDialogContainer = () => {
        $dialog = $("<div>").attr("id", "dialog-batch-change-package").hide();
        $("body").append($dialog);
    };

    /**
     * Extract account ID from URL.
     * @returns {string|null} The account ID or null if not found.
     */
    const getAccountId = () => new URLSearchParams(location.search).get("asid");

    /**
     * Load building data from XML API.
     * @returns {Promise<Array>} Array of building objects.
     */
    const fetchBuildings = async () => {
        const asid = getAccountId();
        if (!asid) return [];

        try {
            const xml = await $.get(`/admin/Ajax/AjaxBuildingAccountList.php?sidx=building_name&limit=0&asid=${asid}`);
            return $(xml)
                .find("row")
                .map((_, row) => {
                    const $row = $(row);
                    const id = $row.attr("id");
                    const cells = $row.find("cell");
                    const name = cells.eq(5).text().trim();
                    const renewalDate = cells.eq(7).text().trim();
                    const pkg = cells.eq(8).text().trim();
                    const status = cells.eq(1).text().trim();
                    return id ? { id, name, pkg, renewalDate, status } : null;
                })
                .get();
        } catch (error) {
            console.error("Failed to fetch buildings:", error);
            return [];
        }
    };

    /**
     * Update button states and selection count based on current state.
     */
    const refreshUIState = () => {
        const total = state.buildings.length;
        const checked = state.selectedIds.size;
        const packageDropdownValue = $packageDropdown.val() || "-1";
        const statusDropdownValue = $statusDropdown.val() || "-1";

        $btnSelectAll.button("option", "disabled", checked === total && total > 0);
        $btnDeselectAll.button("option", "disabled", checked === 0);
        $btnSubmit.button(
            "option",
            "disabled",
            checked === 0 || (packageDropdownValue === "-1" && statusDropdownValue === "-1")
        );

        $selectedCount.html(`Selected <strong>${checked}</strong> building${checked !== 1 ? "s" : ""}.`);
    };

    /**
     * Create a dropdown with options.
     * @param {Array} options - An array of [sid, label] tuples.
     * @param {string} id - The ID attribute for the dropdown element.
     * @param {string} placeholderText - The text for the placeholder option.
     * @param {boolean} isPlaceholderDisabled - Whether the placeholder option is disabled.
     * @returns {jQuery} The dropdown jQuery element.
     */
    const createDropdown = (options, id, placeholderText, isPlaceholderDisabled = true) => {
        const $select = $("<select>").attr("id", id);

        $select.append(
            $("<option>", {
                value: "-1",
                text: placeholderText,
                disabled: isPlaceholderDisabled,
                selected: true
            }).css({ "font-style": "italic", "font-weight": "bold" })
        );

        // Helper to create a single option element.
        const createOption = (sid, label, color) => {
            const $option = $("<option>").val(sid).text(label);
            if (color) {
                $option.css("color", color);
            }
            return $option;
        };

        // Helper to add options to a container (select or optgroup).
        const addOptions = (optionsArray, $container, color) => {
            optionsArray.forEach(([sid, label]) => {
                $container.append(createOption(sid, label, color));
            });
        };

        if (options.length > 0 && Array.isArray(options[0])) {
            // Simple array format.
            addOptions(options, $select);

        } else {
            // Grouped format.
            options.forEach(({ label, color, options: groupOptions }) => {
                if (label) {
                    const $optgroup = $("<optgroup>").attr("label", label);
                    $optgroup.css("color", color ?? "dimgray");
                    addOptions(groupOptions, $optgroup, color ?? "black");
                    $select.append($optgroup);
    
                } else {
                    addOptions(groupOptions, $select);
                }
            });
        }

        $select.on("change", refreshUIState);

        return $select;
    };

    /**
     * Create the basic UI elements for the dialog.
     */
    const createDialogElements = () => {
        $scroll = $("<div>").attr("id", "building-table-container").css({
            maxHeight: "350px",
            overflowY: "auto",
            overflowX: "auto",
            border: "1px solid #ccc",
            margin: "10px 0",
            boxSizing: "border-box",
            overscrollBehavior: "contain",
            whiteSpace: "nowrap"
        });

        $packageDropdown = createDropdown(PACKAGE_OPTIONS, "package-select", "Do Not Change Package", false);
        $statusDropdown = createDropdown(STATUS_OPTIONS, "status-select", "Do Not Change Status", false);

        $selectedCount = $("<div>").attr("id", "selected-count").css({
            marginBottom: "15px"
        });

        $progress = $("<div>").attr("id", "submit-progress").progressbar({ value: 0, max: 0 });
        $label = $("<div>").addClass("progress-label").text("").hide();
        $progress.prepend($label); // Need to prepend the label to show it inside the progress bar.
    };

    /**
     * Create a dropdown row with a label and dropdown element.
     * @param {string} labelText - The label text for the dropdown.
     * @param {jQuery} dropdownElement - The dropdown jQuery element.
     * @returns {jQuery} The dropdown row jQuery element.
     */
    const createDropdownRow = (labelText, dropdownElement) => {
        return $("<div>").addClass("dropdown-row").append($("<label>").text(labelText).append(dropdownElement));
    };

    /**
     * Handle checkbox change events.
     * @param {Event} e - The change event.
     */
    const handleCheckboxChange = (e) => {
        const $checkbox = $(e.target);
        const buildingId = $checkbox.val();

        if ($checkbox.prop("checked")) {
            state.selectedIds.add(buildingId);
        } else {
            state.selectedIds.delete(buildingId);
        }

        refreshUIState();
    };

    /**
     * Create a table checkbox row for a building.
     * @param {Object} building - Building object.
     * @returns {jQuery} The table row containing the checkbox.
     */
    const createTableCheckboxRow = (building) => {
        const { id, name, pkg, renewalDate, status } = building;

        const $checkbox = $("<input>").prop("type", "checkbox").val(id).on("change", handleCheckboxChange);

        const packageText = pkg || NO_PACKAGE_TEXT;
        const $packageTd = $("<td>")
            .text(packageText)
            .css("color", packageText === NO_PACKAGE_TEXT ? "#FF0000" : "inherit");

        const $renewalTd = $("<td>").text(renewalDate).css("color", getRenewalColor(renewalDate));

        const $statusTd = $("<td>")
            .text(status)
            .css("color", status === "Active" ? "#009900" : "inherit");

        const $tr = $("<tr>").append(
            $("<td>").append($checkbox),
            $("<td>").text(name).css("font-weight", "bold"),
            $packageTd,
            $renewalTd,
            $statusTd
        );

        return $tr;
    };

    /**
     * Create a building table and populate it with checkboxes.
     */
    const populateBuildingTable = () => {
        if (!$scroll) return;

        $scroll.empty();

        const $table = $("<table>");
        const $thead = $("<thead>").append(
            $("<tr>").append(
                $("<th>").text(""),
                $("<th>").text("Name"),
                $("<th>").text("Package"),
                $("<th>").text("Renewal Date"),
                $("<th>").text("Status")
            )
        );
        const $tbody = $("<tbody>");

        state.buildings.sort((a, b) => a.name.localeCompare(b.name));
        state.buildings.forEach((building) => {
            $tbody.append(createTableCheckboxRow(building));
        });

        $table.append($thead, $tbody);
        $scroll.append($table);
    };

    /**
     * Show loading spinner in the dialog while fetching data.
     */
    const showLoadingSpinner = () => {
        if (!$dialog) return;

        $dialog.empty().append(
            $("<div>")
                .css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%"
                })
                .append(
                    // https://lucide.dev/icons/refresh-cw
                    $("<img>")
                        .attr(
                            "src",
                            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxYzk1YzQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1yZWZyZXNoLWN3LWljb24gbHVjaWRlLXJlZnJlc2gtY3ciPjxwYXRoIGQ9Ik0zIDEyYTkgOSAwIDAgMSA5LTkgOS43NSA5Ljc1IDAgMCAxIDYuNzQgMi43NEwyMSA4Ii8+PHBhdGggZD0iTTIxIDN2NWgtNSIvPjxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIvPjxwYXRoIGQ9Ik04IDE2SDN2NSIvPjwvc3ZnPg=="
                        )
                        .css({ animation: "spin 1s linear infinite" })
                )
        );
    };

    /**
     * Reset the dialog content and state.
     */
    const resetDialogContent = () => {
        state.selectedIds.clear();
        $dialog.empty();
    };

    /**
     * Disable all dialog buttons (during submit).
     */
    const disableAllDialogButtons = () => {
        $(".ui-dialog-buttonpane button").button("option", "disabled", true);
    };

    /**
     * Select all buildings.
     */
    const selectAll = () => {
        $scroll.find("input[type=checkbox]").prop("checked", true);
        state.selectedIds = new Set(state.buildings.map((b) => b.id));
        refreshUIState();
    };

    /**
     * Deselect all buildings.
     */
    const deselectAll = () => {
        $scroll.find("input[type=checkbox]").prop("checked", false);
        state.selectedIds.clear();
        refreshUIState();
    };

    /**
     * Update progress bar and label.
     * @param {number} current - Current progress.
     * @param {number} total - Total items.
     */
    const updateProgress = (current, total) => {
        $progress.progressbar("value", current);
        $label.text(`${current}/${total}`);
    };

    /**
     * Simulated test-only visual loader.
     * @param {number} count - Total number of buildings to simulate.
     */
    const simulateProgress = (count) => {
        let step = 0;
        $progress.progressbar("option", "max", count);
        $label.show();

        const interval = setInterval(() => {
            step++;
            updateProgress(step, count);
            if (step === count) clearInterval(interval);
        }, 2000 / count);
    };

    /**
     * Update selected buildings with new data.
     * @param {Array} buildingIds - Array of building IDs to update.
     * @param {string} packageSid - Package ID to set.
     * @param {string} statusSid - Building status ID to set.
     */
    const submitSelectedBuildings = (buildingIds, packageSid, statusSid) => {
        let completed = 0;
        const total = buildingIds.length;

        $progress.progressbar("option", "max", total);
        $label.show();
        updateProgress(completed, total);

        const data = {};
        if (packageSid !== "-1") data.package_sid = packageSid;
        if (statusSid !== "-1") data.building_status_sid = statusSid;

        buildingIds.forEach((id) => {
            $.ajax({
                type: "POST",
                url: `/admin/BuildingModify.php?bsid=${id}`,
                data,
                success: () => {},
                error: () => console.warn(`Failed to update building ${id}`),
                complete: () => {
                    completed++;
                    updateProgress(completed, total);
                }
            });
        });
    };

    /**
     * Handle submit button click.
     */
    const handleSubmit = () => {
        const selectedIds = Array.from(state.selectedIds);
        const packageSid = $packageDropdown.val();
        const statusSid = $statusDropdown.val();

        disableAllDialogButtons();

        // simulateProgress(selectedIds.length);

        submitSelectedBuildings(selectedIds, packageSid, statusSid);
    };

    /**
     * Configure the dialog.
     */
    const configureDialog = () => {
        if (!$dialog.length) return;

        $dialog.dialog({
            title: "Batch Change Package",
            modal: true,
            // width: 460,
            // height: 580,
            width: 820,
            height: 620,
            buttons: [
                {
                    text: "Select All",
                    id: "btn-select-all",
                    disabled: true,
                    click: selectAll
                },
                {
                    text: "Deselect All",
                    id: "btn-deselect-all",
                    disabled: true,
                    click: deselectAll
                },
                {
                    text: "Submit",
                    id: "btn-submit",
                    disabled: true,
                    click: handleSubmit
                }
            ],
            close: resetDialogContent
        });

        $btnSelectAll = $("#btn-select-all");
        $btnDeselectAll = $("#btn-deselect-all");
        $btnSubmit = $("#btn-submit");
    };

    /**
     * Render the dialog content with buildings and controls.
     */
    const renderDialogContent = () => {
        const $totalCount = $("<div>").html(
            `Found <strong>${state.buildings.length}</strong> building${state.buildings.length !== 1 ? "s" : ""}.`
        );

        $dialog
            .empty()
            .append(
                $totalCount,
                $scroll,
                $selectedCount,
                createDropdownRow("New Package: ", $packageDropdown),
                createDropdownRow("New Status: ", $statusDropdown),
                $progress
            );

        refreshUIState();
    };

    /**
     * Show the dialog, handle user interaction and submission
     */
    const showDialog = async () => {
        createDialogElements();

        configureDialog();

        showLoadingSpinner();

        state.buildings = await fetchBuildings();

        if (state.buildings.length === 0) {
            $dialog.empty().append($("<div>").text("No buildings found for this account."));
            return;
        }

        populateBuildingTable();
        renderDialogContent();
    };

    /**
     * Inject button into page
     */
    const injectUI = () => {
        const $btn = $("<button>")
            .attr("id", "batch-change-package")
            .text("Batch Change Package")
            .button({
                label: "Batch Change Package",
                icons: { primary: "ui-icon-circle-check" }
            })
            .on("click", showDialog);

        const $target = $("#add-building").parent();

        if ($target.length) {
            $target.append("<br><br>").append($btn);
        }
    };

    /**
     * Main initialization function
     */
    const initialize = () => {
        injectStyles();
        createDialogContainer();
        injectUI();
    };

    initialize();
})();
