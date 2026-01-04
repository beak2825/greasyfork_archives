// ==UserScript==
// @name         Copiar carteiras suno
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add the capability to copy the portfolio table to Excel, Google Sheets and similar. Also parses to dlombello planilhas: https://www.dlombelloplanilhas.com/ for portfolio management.
// @author       Felipe Lauksas
// @match        https://investidor.suno.com.br/carteiras/dividendos
// @match        https://investidor.suno.com.br/carteiras/valor
// @match        https://investidor.suno.com.br/carteiras/fiis
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.com.br
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461903/Copiar%20carteiras%20suno.user.js
// @updateURL https://update.greasyfork.org/scripts/461903/Copiar%20carteiras%20suno.meta.js
// ==/UserScript==
(function () {
	'use strict';

	// start state variables
	let linkAdded = false;
	let tries = 0;
	// end state variables

	/**
	 * Creates a TableParserOptions
	 * @class
	 * @typedef {"keepFirst"} ManyElementsInTDStrategy
	 * @typedef TableParserOptions
	 * @property {boolean} [skipEmptyRows=true] Will skip row where all columns are empty
	 * @property 	{ManyElementsInTDStrategy} manyElementsInTDStrategy
	 * @property 	{boolean} [trim=true] Will trim each cell on the table (remove spaces in the beginning and at the end)
	 * @property 	{Object} columnModifiers
	 * Map with column number as key and functions to process its string,
	 * the function takes a string as parameter <br>
	 * Eg.: `{0: (cellValue = '') => celValue.replace(/\./g, '/')}`
	 * will replace all dots to slashes on every cell from column of index 0.
	 * @property 	{Array} columnFilterAndOrder A filter where dictates the order and the columns that will be outputted
	 * @property 	{boolean} [removeHeaders=true] Set if headers (first row) should be removed
	 * @property 	{boolean} [removeFooter=false] Set if footer (last row) should be removed
	 * @param {TableParserOptions} options Options for parser
	 * @returns {TableParserOptions}
	 */
	function TableParserOptionsBuilder(
		options = {
			skipEmptyRows: true,
			manyElementsInTDStrategy: 'keepFirst',
			trim: true,
			//will parse each column with the given index
			columnModifiers: {},
			//will filter and reorder
			columnFilterAndOrder: [],
			removeHeaders: true,
			removeFooter: false,
		}
	) {
		const skipEmptyRows = options.skipEmptyRows;
		const manyElementsInTDStrategy = options.manyElementsInTDStrategy;
		const trim = options.trim;
		const columnModifiers = options.columnModifiers;
		const columnFilterAndOrder = options.columnFilterAndOrder;
		const removeHeaders = options.removeHeaders;
		const removeFooter = options.removeFooter;
		return {
			skipEmptyRows,
			manyElementsInTDStrategy,
			trim,
			columnModifiers,
			columnFilterAndOrder,
			removeHeaders,
			removeFooter,
		};
	}

	/**
	 * Will parser a table array according to giving parser
	 * @class
	 * @param {TableParserOptions} parser
	 * @param {Array} tableArray
	 * @returns {Array} the transformed array according to parser
	 */
	function TableArrayTransformer(
		parser = dividendsTableParser,
		tableArray = []
	) {
		let result = tableArray.slice();
		const parseColumns = (rowIndex) => {
			for (const columnIndex in parser.columnModifiers) {
				const columnModifier = parser.columnModifiers[columnIndex];
				parseColumn(rowIndex, columnIndex, columnModifier);
			}
		};

		const parseColumn = (rowIndex, columnIndex, columnModifier) => {
			if (columnModifier && typeof columnModifier === 'function') {
				const columnValue = result[rowIndex][columnIndex];
				const columnNewValue = columnModifier(columnValue);
				result[rowIndex][columnIndex] = columnNewValue;
			}
		};
		const filterAndReorder = () => {
			let filtered = [];
			if (Array.isArray(parser.columnFilterAndOrder)) {
				const isAllElementsNumbers = parser.columnFilterAndOrder.every(
					(e) => !isNaN(e)
				);
				if (isAllElementsNumbers) {
					result.forEach((column) => {
						const filteredColumns = parser.columnFilterAndOrder.map(
							(columnIndex) => column[columnIndex]
						);
						filtered.push(filteredColumns);
					});
				} else {
					throw 'error: column filters must be numbers with the index in array order starting from zero index.';
				}
			} else {
				filtered = result;
			}
			return filtered;
		};

		const removeHeadersAndFootersIfNeeded = () => {
			if (parser.removeHeaders || parser.removeFooter) {
				if (parser.removeHeaders && parser.removeFooter) {
					result = result.slice(1, result.length - 1);
				} else if (parser.removeHeaders) {
					result = result.slice(1, result.length);
				} else if (parser.removeFooter) {
					result = result.slice(0, result.length - 1);
				}
			}
		};

		for (let rowIndex = 1; rowIndex < result.length; rowIndex++) {
			parseColumns(rowIndex);
		}
		result = filterAndReorder();
		removeHeadersAndFootersIfNeeded();
		return result;
	}
	/**
	 *
	 * @class
	 * @param {TableParserOptions} parser
	 * @param {HTMLTableElement} portfolioTableHeader
	 * @param {HTMLTableElement} portfolioTableBody
	 * @returns
	 */
	function DOMTableToArray(
		parser = dividendsTableParser,
		portfolioTableHeader,
		portfolioTableBody
	) {
		const getTableHeaders = (tableElement) => {
			const headers = [];

			const thElementsQuery = '* > thead > tr > th:nth-of-type(n) > *';

			const thElements = tableElement.querySelectorAll(thElementsQuery);
			thElements.forEach((th) => {
				const innerText = Array.from(th.children)
					.map((textElement) => textElement.innerText || '')
					.join('');
				headers.push(innerText);
			});

			return headers;
		};

		const parseTableDataText = (tableDataText = '') => {
			let result = '';

			if (
				parser.trim &&
				tableDataText.length &&
				typeof tableDataText === 'string'
			) {
				tableDataText = tableDataText.trim();
			}

			if (tableDataText.length) {
				if (parser.manyElementsInTDStrategy === 'keepFirst') {
					try {
						const tdSplit = tableDataText.split('\n');
						result = tdSplit[0];
					} catch (error) {
						result = tableDataText;
					}
				} else {
					result = tableDataText;
				}
			}
			return result;
		};

		const getTableBody = (tableElement) => {
			const trElementsSelector = '* > tbody > tr';
			const trElements = Array.from(
				tableElement.querySelectorAll(trElementsSelector)
			);
			const trData = [];
			trElements.forEach((tr) => {
				const tds = Array.from(tr.querySelectorAll('* > td > *'));
				const tdData = [];
				tds.forEach((td) => {
					const innerText = td.innerText;
					if (typeof innerText === 'string' && innerText.length) {
						const parsedText = parseTableDataText(innerText);
						tdData.push(parsedText);
					} else {
						tdData.push('');
					}
				});
				const skip =
					parser.skipEmptyRows &&
					tdData.every((td) => td.length === 0);
				if (!skip) {
					trData.push(tdData);
				}
			});
			return trData;
		};
		const headers = getTableHeaders(portfolioTableHeader);
		const body = getTableBody(portfolioTableBody);
		const result = [headers].concat(body);
		return result;
	}

	/**
	 * Converts a bidimensional array into text
	 * joining with tabs and new lines for excel
	 * and similar copy and paste
	 * @param {Array} tableArray
	 * @returns
	 */
	const tableArrayToSheet = (tableArray = [[]]) => {
		let result = '';
		tableArray.forEach((row) => {
			result += `${row.join('\t')}\n`;
		});
		result = result.substring(0, result.length - 1);
		return result;
	};

	const dividendsTableParser = new TableParserOptionsBuilder({
		skipEmptyRows: true,
		manyElementsInTDStrategy: 'keepFirst',
		trim: true,
		//will parse each column with the given index
		columnModifiers: {
			//use: index:modifierFunction
			3: (celValue = '') => celValue.replace(/\./g, '/'),
		},
		columnFilterAndOrder: [0, 2, 5, 6, 8, 3],
		removeHeaders: true,
		removeFooter: true,
	});

	const fiiTableParser = new TableParserOptionsBuilder({
		skipEmptyRows: true,
		manyElementsInTDStrategy: 'keepFirst',
		trim: true,
		//will parse each column with the given index
		columnModifiers: {
			//use: index:modifierFunction
			3: (celValue = '') => celValue.replace(/\./g, '/'),
		},
		columnFilterAndOrder: [0, 1, 4, 6, 8, 3],
		removeHeaders: true,
		removeFooter: false,
	});

	const valorTableParser = new TableParserOptionsBuilder({
		skipEmptyRows: true,
		manyElementsInTDStrategy: 'keepFirst',
		trim: true,
		//will parse each column with the given index
		columnModifiers: {
			//use: index:modifierFunction
			3: (celValue = '') => celValue.replace(/\./g, '/'),
		},
		columnFilterAndOrder: [0, 2, 4, 5, 7, 3],
		removeHeaders: true,
		removeFooter: true,
	});

	const getParserByURL = () => {
		const URLSegments = window.location.href.split('/');
		const url = URLSegments[URLSegments.length - 1];
		let parser = dividendsTableParser;
		switch (url) {
			case 'dividendos':
				parser = dividendsTableParser;
				break;
			case 'fiis':
				parser = fiiTableParser;
				break;
			case 'valor':
				parser = valorTableParser;
				break;
			default:
				break;
		}
		return parser;
	};

	/**
	 * Watches element until it is rendered
	 * when it is found it adds the button on the
	 * top of it.
	 */
	const addCopyButton = () => {
		const tableElements = document.querySelectorAll('table');
		const portfolioTableHeader = tableElements[0];
		const portfolioTableBody = tableElements[1];
		const copyToDellombeloButtonLabel = 'Copiar para dlombello';
		const copyToTableButtonLabel = 'Copiar para tabela';

		const parser = getParserByURL();
		tries++;
		if (portfolioTableHeader) {
			const copyTableBtn = document.createElement('button');
			copyTableBtn.type = 'button';

			copyTableBtn.textContent = copyToTableButtonLabel;
			copyTableBtn.onclick = () => {
				const tableArray = DOMTableToArray(
					parser,
					portfolioTableHeader,
					portfolioTableBody
				);
				const sheet = tableArrayToSheet(tableArray);
				navigator.clipboard.writeText(sheet);
			};
			portfolioTableHeader.parentElement.insertBefore(
				copyTableBtn,
				portfolioTableHeader
			);

			const copyDellombeloBtn = document.createElement('button');
			copyDellombeloBtn.type = 'button';

			copyDellombeloBtn.textContent = copyToDellombeloButtonLabel;
			copyDellombeloBtn.onclick = () => {
				const tableArray = DOMTableToArray(
					parser,
					portfolioTableHeader,
					portfolioTableBody
				);
				const parsed = TableArrayTransformer(parser, tableArray);
				const sheet = tableArrayToSheet(parsed);
				navigator.clipboard.writeText(sheet);
			};
			portfolioTableHeader.parentElement.insertBefore(
				copyDellombeloBtn,
				portfolioTableHeader
			);
			linkAdded = true;
		}
		if (!linkAdded || tries > 60) {
			setTimeout(addCopyButton, 1000);
		}
	};
	addCopyButton();
})();
