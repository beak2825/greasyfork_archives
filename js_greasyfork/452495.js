// ==UserScript==
// @name         FPL-Data Export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to export data from fpl-data.co.uk
// @author       Sertalp B. Cay
// @license      MIT
// @match        https://www.fpl-data.co.uk/statistics
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/1.0.0/jquery.csv.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fpl-data.co.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452495/FPL-Data%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/452495/FPL-Data%20Export.meta.js
// ==/UserScript==

(function() {

    function download_csv_data(csv, filename) {
        var csvFile;
        var downloadLink;
        csvFile = new Blob([csv], {type: "text/csv"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function _waitForElement(selector, delay = 50, tries = 100) {
        const element = document.querySelector(selector);

        if (!window[`__${selector}`]) {
            window[`__${selector}`] = 0;
            window[`__${selector}__delay`] = delay;
            window[`__${selector}__tries`] = tries;
        }

        function _search() {
            return new Promise((resolve) => {
                window[`__${selector}`]++;
                setTimeout(resolve, window[`__${selector}__delay`]);
            });
        }

        if (element === null) {
            if (window[`__${selector}`] >= window[`__${selector}__tries`]) {
                window[`__${selector}`] = 0;
                return Promise.resolve(null);
            }

            return _search().then(() => _waitForElement(selector));
        } else {
            return Promise.resolve(element);
        }
    }


    let $ = window.jQuery;
    let jQuery = window.jQuery;

    function first_player() {
        return document.querySelector("#stats-data-table-pivot .dash-cell-value").textContent;
    }

    function get_table_values() {
        return [...document.querySelector("#stats-data-table-pivot table").querySelectorAll("tr")].slice(1).map(i => [...i.querySelectorAll(".dash-cell-value")].map(i => i.textContent));
    }

    function prep_and_download() {

        let all_values = [];

        let next_button = document.querySelector("#stats-data-table-pivot .next-page")
        let headers = [...document.querySelector("#stats-data-table-pivot").querySelectorAll(".column-header-name")].map(i => i.textContent)
        all_values.push(headers)

        let values = get_table_values()
        all_values = all_values.concat(values)
        let v0 = first_player();

        function add_to_list_and_call_next() {
            let v1 = first_player();
            if (v1 == v0) {
                return;
            }
            let values = get_table_values()
            all_values = all_values.concat(values)
            v0 = v1;
            setTimeout(() => {
                if (!next_button.disabled) {
                    next_button.click();
                }
                else {
                    let csv_values = jQuery.csv.fromArrays(all_values);
                    download_csv_data(csv_values, "fpldata.csv");
                    document.querySelector("#stats-data-table-pivot .dash-cell-value").removeEventListener('DOMSubtreeModified', break_on_change);
                }
            }, 50);
        }

        function break_on_change() {
            add_to_list_and_call_next();
        }

        document.querySelector("#stats-data-table-pivot .dash-cell-value").addEventListener("DOMSubtreeModified", break_on_change);

        if (!next_button.disabled) {
            next_button.click();
        }



    }

    $(document).ready(function() {

        (async () => {
            const $el = await _waitForElement(`#stats-data-table-pivot`);
            console.log($el);
            let btn = document.createElement("button");
            btn.innerHTML = "Download as CSV";
            btn.addEventListener("click", prep_and_download);
            let e = document.querySelector("#stats-data-table-pivot");
            btn.style.color = 'white';
            e.prepend(btn);
        })();


    });





})();