// ==UserScript==
// @name        heartland title - myfloridacounty.com exporter
// @namespace   htiac
// @match       *://*.myfloridacounty.com/orisearch/s/search*
// @include     *://myfloridacounty.com/orisearch/s/search*
// @grant       GM_addStyle
// @version     1.1
// @author      Ryan McLean
// @description Adds an export button to MyFloridaCounty.com official records search results
// @downloadURL https://update.greasyfork.org/scripts/541352/heartland%20title%20-%20myfloridacountycom%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/541352/heartland%20title%20-%20myfloridacountycom%20exporter.meta.js
// ==/UserScript==

class TableToCSV {

    constructor(options) {
        const defaults = {
            selector: 'table',
            filename: 'table.csv',
            delimiter: ',',
            lineEnding: '\n',
            download: true,
            includeHeaders: true,
            ignoreCellsSelector: '.no-export',
            includeRowNumbers: false,
            cellFormatter: null
        };
        this.options = Object.assign({}, defaults, options);
    }

    getTables() {
        return document.querySelectorAll(this.options.selector);
    }

    exportTable(table) {
        let csv = [];
        let rows = this.options.includeHeaders ? table.querySelectorAll("tr") : table.querySelectorAll("tbody tr");
        let rowIndex = 0;
        rows.forEach(row => {
            let rowData = [];
            if (this.options.includeRowNumbers) {
                rowData.push(rowIndex + 1);
            }
            const cells = row.querySelectorAll("th, td");
            cells.forEach(cell => {
                if (this.options.ignoreCellsSelector && cell.matches(this.options.ignoreCellsSelector)) {
                    return;
                }
                let data = cell.innerText;
                if (typeof this.options.cellFormatter === 'function') {
                    data = this.options.cellFormatter(cell, data);
                }
                if (data.includes('"')) {
                    data = data.replace(/"/g, '""');
                }
                if (data.search(new RegExp(`("|${this.options.delimiter}|\n)`)) >= 0) {
                    data = `"${data}"`;
                }
                rowData.push(data);
            });
            csv.push(rowData.join(this.options.delimiter));
            rowIndex++;
        });
        return csv.join(this.options.lineEnding);
    }

    downloadCSV(csvData, filename) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const link = document.createElement('a');
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportAll() {
        const tables = this.getTables();
        tables.forEach((table, index) => {
            const csvData = this.exportTable(table);
            let filename = this.options.filename;
            if (tables.length > 1) {
                const dotIndex = filename.lastIndexOf('.');
                filename = dotIndex > 0 ? filename.slice(0, dotIndex) + '-' + (index + 1) + filename.slice(dotIndex) : filename + '-' + (index + 1);
            }
            if (this.options.download) {
                this.downloadCSV(csvData, filename);
            }
        });
    }

    exportBySelector(selector) {
        const table = document.querySelector(selector);
        if (table) {
            const csvData = this.exportTable(table);
            if (this.options.download) {
                this.downloadCSV(csvData, this.options.filename);
            }
            return csvData;
        }
        return null;
    }

    exportCombined() {
        const tables = this.getTables();
        let combinedCSV = '';
        tables.forEach((table, index) => {
            if (tables.length > 1) {
                combinedCSV += `Table ${index + 1}${this.options.lineEnding}`;
            }
            combinedCSV += this.exportTable(table);
            if (index < tables.length - 1) {
                combinedCSV += this.options.lineEnding + this.options.lineEnding;
            }
        });
        if (this.options.download) {
            this.downloadCSV(combinedCSV, this.options.filename);
        }
        return combinedCSV;
    }

    previewBySelector(selector) {
        const csvData = this.exportBySelector(selector);
        if (csvData) {
            console.log(csvData);
        } else {
            console.warn(`No table found for selector: ${selector}`);
        }
    }

    setCellFormatter(formatter) {
        if (typeof formatter === 'function') {
            this.options.cellFormatter = formatter;
        }
    }

    get selector() {
        return this.options.selector;
    }

    set selector(value) {
        this.options.selector = value;
    }

    get filename() {
        return this.options.filename;
    }

    set filename(value) {
        this.options.filename = value;
    }

    get delimiter() {
        return this.options.delimiter;
    }

    set delimiter(value) {
        this.options.delimiter = value;
    }

    get lineEnding() {
        return this.options.lineEnding;
    }

    set lineEnding(value) {
        this.options.lineEnding = value;
    }

    get download() {
        return this.options.download;
    }

    set download(value) {
        this.options.download = value;
    }

    get includeHeaders() {
        return this.options.includeHeaders;
    }

    set includeHeaders(value) {
        this.options.includeHeaders = value;
    }

    get ignoreCellsSelector() {
        return this.options.ignoreCellsSelector;
    }

    set ignoreCellsSelector(value) {
        this.options.ignoreCellsSelector = value;
    }

    get includeRowNumbers() {
        return this.options.includeRowNumbers;
    }

    set includeRowNumbers(value) {
        this.options.includeRowNumbers = value;
    }

    get cellFormatter() {
        return this.options.cellFormatter;
    }

    set cellFormatter(value) {
        if (typeof value === 'function') {
            this.options.cellFormatter = value;
        }
    }

}

const cellFormatter = (cell, data) => {
  let formattedData = data.trim();
  let isHeader = $(cell).is("th");
  if( isHeader ) {
    switch(formattedData) {
      case "From":
        formattedData = "DirectName";
        break;
      case "To":
        formattedData = "IndirectName";
        break;
      case "Date":
        formattedData = "RecordDate";
        break;
      case "Document Type":
        formattedData = "DocType";
        break;
      case "Instrument Number":
        formattedData = "InstrumentNumber";
        break;
      case "Book/Page":
        formattedData = "BookPage";
        break;
      case "Consideration Amount":
        formattedData = "Consideration";
        break;
      case "Description":
        formattedData = "Comments";
        break;
      default:
        console.warn("Unknown column", formattedData);
    }
  }
  return formattedData;
}

$(document).ready(() => {
  // mark the Pages column as not exportable
  $("#ori_results thead tr th:nth-child(7)").addClass('no-export');
  $("#ori_results tbody tr td:nth-child(7)").addClass('no-export');

  // initialize the exporter
  const tableToCSV = new TableToCSV({
    selector: '#ori_results',
    filename: 'ori_results.csv',
    delimiter: ',',
    includeHeaders: true,
    includeRowNumbers: false,
    cellFormatter: cellFormatter,
    ignoreCellsSelector: ".no-export"
  });

  // insert the button
  const exportButton = $('<span>&nbsp;<button id="export_to_csv">Export to CSV</button><br /></span>')
    .on('click', () => {
      tableToCSV.exportAll();
    });

  if($('#export_to_csv').length === 0) {
    $(exportButton).insertAfter('#ori_pagesize');
  }
})