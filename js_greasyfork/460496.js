// ==UserScript==
// @name					Data Validator Helper v2
// @namespace			http://tampermonkey.net/
// @version				0.2
// @description		Data Validator Helper
// @author				Eric Liu <li.eric.liu@dnv.com>
// @match					https://data.veracity.com/dataValidator/*
// @match					https://datatest.veracity.com/dataValidator/*
// @match					https://datadevtest.veracity.com/dataValidator/*
// @grant					GM.xmlHttpRequest
// @grant					GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/460496/Data%20Validator%20Helper%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/460496/Data%20Validator%20Helper%20v2.meta.js
// ==/UserScript==

const baseUrl = location.origin + '/api/dataValidator';

(function () {
	'use strict';

	window._historyWrap = function (type) {
		var orig = history[type];
		var e = new Event(type.toLowerCase());

		return function () {
			var rv = orig.apply(this, arguments);
			e.arguments = arguments;
			window.dispatchEvent(e);
			return rv;
		};
	};
	history.pushState = _historyWrap('pushState');
	history.replaceState = _historyWrap('replaceState');

	window.schema = null;
	window.schemas = [];
	window.columnValidators = [];
	initialize();
	window.addEventListener('pushstate', (e) => {
		window.setTimeout(onRouteChange, 500);
	});
})();

async function initialize() {
	await onRouteChange();
}

async function onRouteChange() {
	if (isSchemaListPage()) {
		console.log('schema list');
		await loadColumnValidators();
		await loadSchemas();

		await createConvertButton();
		await createSchemaDeleteButtons();
	} else if (isSchemaPage()) {
		console.log('schema');
		await loadSchema();

		await createDeleteVersionButton();
	}
}

function isSchemaListPage() {
	// path = /dataValidator/08905150-2e46-4db0-b9c2-52dc6c376d29/schemas
	const path = document.location.pathname;
	return path.length == 59 && path.endsWith('/schemas');
}

function isSchemaPage() {
	// path = /dataValidator/08905150-2e46-4db0-b9c2-52dc6c376d29/schemas/939bea1f-a595-4218-b31f-834a84aef632
	const path = document.location.pathname;
	return path.length == 96 && path.slice(51, 59).endsWith('/schemas');
}

function findElementByXPath(xpath, interval = 100) {
	return new Promise((resolve) => {
		window.__findElementByXPath = window.setInterval(() => {
			const element = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

			if (element) {
				console.log('findElementByXPath', element);
				resolve(element);
				window.clearInterval(window.__findElementByXPath);
			}
		}, interval);
	});
}

function findElement(selector, interval = 100) {
	return new Promise((resolve) => {
		window.intervalHandler = window.setInterval(() => {
			const element = document.querySelector(selector);
			resolve(element);
			window.clearInterval(window.intervalHandler);
		}, interval);
	});
}

function findElements(selector, interval = 100) {
	return new Promise((resolve) => {
		window.intervalHandler = window.setInterval(() => {
			const elements = [...document.querySelectorAll(selector)];
			resolve(elements);
			window.clearInterval(window.intervalHandler);
		}, interval);
	});
}

async function createConvertButton() {
	const addButton = await findElement('#addSchemaButton');

	if (!addButton) return;

	const container = addButton.parentElement;
	let button = document.createElement('button');
	button.innerText = 'Create Schema from IMT (json)';
	button.id = 'convertButton';
	button.style.borderRadius = '5px';
	button.style.marginLeft = '5px';
	button.style.backgroundColor = 'pink';
	button.addEventListener('click', createSchemaFromIMT);
	container.appendChild(button);

	button = document.createElement('button');
	button.innerText = 'Copy from another schema';
	button.style.borderRadius = '5px';
	button.style.marginLeft = '5px';
	button.style.backgroundColor = 'pink';
	button.addEventListener('click', copySchema);
	container.appendChild(button);
}

async function createSchemaDeleteButtons() {
	const list = await findElements('ul#sortedSchemasList > li');

	if (list.length == 0) return;

	for (let r of list) {
		const name = r.querySelector('span:first-child').innerText.trim();
		const container = r.querySelector('div:last-child');
		const button = document.createElement('button');
		button.innerText = 'Delete';
		button.style.borderRadius = '5px';
		button.style.marginLeft = '5px';
		button.style.backgroundColor = 'pink';
		button.addEventListener('click', (e) => {
			e.preventDefault();
			e.cancelBubble = true;
			deleteSchema(name);
		});
		container.appendChild(button);
	}
}

async function createDeleteVersionButton() {
	const targetButton = await findElementByXPath('//button[contains(text(), "Activate version")]');

	if (!targetButton) return;

	const container = targetButton.parentElement;

	let button = document.createElement('button');
	button.id = 'version-delete-button';
	button.innerText = 'Delete version';
	button.style = 'height: 40px; background-color: pink; border-radius: 5px';
	button.addEventListener('click', (e) => deleteSchemaVersion(container));
	container.appendChild(button);
}

async function deleteSchema(name) {
	function del(workspaceId, schemaId) {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/schemas/${schemaId}?delete`,
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: () => resolve(),
				onerror: (err) => reject(err)
			})
		);
	}
	const schemas = window.schemas;
	const schema = schemas.find((s) => s.name == name);

	if (schema) {
		if (confirm(`Delete schema ${name}?`)) {
			const workspaceId = getWorkspaceId();
			await del(workspaceId, schema.schemaId);
			location.assign(location.href);
		}
	}
}

async function deleteSchemaVersion(container) {
	function del(workspaceId, versionId) {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/schemaVersions/${versionId}?delete`,
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: () => resolve(),
				onerror: (err) => reject(err)
			})
		);
	}

	const versionText = container.firstChild.querySelector('button').textContent;
	const version = parseInt(versionText.split(' ')[1]);
	const schema = window.schema;
	const schemaVersion = schema.versions.find((v) => v.version == version);

	if (schemaVersion) {
		if (schemaVersion.isActive) {
			alert('cannot delete active version');
			return;
		}

		if (confirm(`Delete version ${version}?`)) {
			const workspaceId = getWorkspaceId();
			await del(workspaceId, schemaVersion.schemaVersionId);
			location.assign(location.href);
		}
	}
}

function getWorkspaceId() {
	const path = document.location.pathname;
	return (path.length >= 51 && path.slice(15, 51)) || null;
}

function getSchemaId() {
	const path = document.location.pathname;
	return (path.length >= 96 && path.slice(60, 96)) || null;
}

async function createSchemaFromIMT() {
	const workspaceId = getWorkspaceId();
	const shortName = prompt('Enter the short name of your schema');
	const input = prompt('JSON from IMT');

	if (!workspaceId || !shortName?.trim() || !input?.trim()) return;

	const imt = JSON.parse(input);
	const schema = imt2dv(shortName, shortName, shortName, imt);
	const result = await createSchema(workspaceId, schema);

	if (result) {
		location.assign(location.pathname);
	}
}

async function copySchema() {
	function get(workspaceId, schemaId) {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/schemas/${schemaId}`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: (res) => resolve(JSON.parse(res.response)),
				onerror: (err) => reject(err)
			})
		);
	}

	function getValidators(workspaceId) {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/validators`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: (res) => resolve(JSON.parse(res.response)),
				onerror: (err) => reject(err)
			})
		);
	}

	function createValidator(workspaceId, validator) {
		validator.name += '1';
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/validators`,
				method: 'POST',
				data: JSON.stringify(validator),
				headers: {
					'Content-Type': 'application/json'
				},
				onload: (res) => resolve(JSON.parse(res.response)),
				onerror: (err) => reject(err)
			})
		);
	}

	const workspaceId = getWorkspaceId();
	const otherWorkspaceId = prompt('The other workspaceId');
	const otherSchemaId = prompt('The other schemaId');
	const shortName = prompt('Enter the short name of new schema');

	if (!workspaceId || !otherWorkspaceId || !otherSchemaId || !shortName?.trim()) return;

	const otherSchema = await get(otherWorkspaceId, otherSchemaId);
	const otherValidators = await getValidators(otherWorkspaceId);
	const validators = [...window.columnValidators];

	for (let ov of otherValidators) {
		if (validators.find((v) => v.name == ov.name)) continue;

		const newValidator = await createValidator(workspaceId, ov);
		validators.push(newValidator);
	}

	const schema = schemaReadToWrite(otherSchema, validators);

	if (!schema) {
		alert('Error');
		return;
	}

	const result = await createSchema(workspaceId, schema);

	if (result) {
		location.assign(location.pathname);
	}
}

async function loadSchemas() {
	function get(workspaceId) {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/schemas`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: (res) => resolve(JSON.parse(res.response)),
				onerror: (err) => reject(err)
			})
		);
	}

	const workspaceId = getWorkspaceId();
	const schemas = await get(workspaceId);
	window.schemas = schemas;
}

async function loadSchema() {
	function get(workspaceId, schemaId) {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/schemas/${schemaId}`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: (res) => resolve(JSON.parse(res.response)),
				onerror: (err) => reject(err)
			})
		);
	}

	const [workspaceId, schemaId] = [getWorkspaceId(), getSchemaId()];
	const schema = await get(workspaceId, schemaId);
	window.schema = schema;
}

async function loadColumnValidators() {
	function getPredefined() {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/validators`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: (res) => resolve(JSON.parse(res.response)),
				onerror: (err) => reject(err)
			})
		);
	}

	function get(workspaceId) {
		return new Promise((resolve, reject) =>
			GM.xmlHttpRequest({
				url: `${baseUrl}/workspaces/${workspaceId}/validators`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				onload: (res) => {
					console.log(res.response);
					resolve(JSON.parse(res.response));
				},
				onerror: (err) => reject(err)
			})
		);
	}

	try {
		const v1 = (await getPredefined()) || [];
		const v2 = (await get(getWorkspaceId())) || [];
		const v = [];
		v.push(...v1);
		v.push(...v2);
		window.columnValidators = v;
	} catch (e) {
		console.error(e);
	}
}

function createSchema(workspaceId, schema) {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({
			url: `${baseUrl}/workspaces/${workspaceId}/schemas`,
			method: 'POST',
			data: JSON.stringify(schema),
			headers: {
				'Content-Type': 'application/json'
			},
			onload: (res) => resolve(JSON.parse(res.response)),
			onerror: (err) => reject(err)
		});
	});
}

function imt2dv(name, shortName, description, imt) {
	const columnValidators = window.columnValidators;

	function getColumnValidator(name) {
		if (columnValidators) {
			return columnValidators.find((v) => v.name == name);
		}
	}
	function convertColumnValidators(imt) {
		return Object.keys(imt).map((k) => {
			const columnValidatorId = getColumnValidator(k).columnValidatorId;
			const severity = imt[k] == 0 ? 'Error' : imt[k] == 1 ? 'Warning' : 'Correction';
			return { columnValidatorId, severity };
		});
	}
	function convertColumns(imt) {
		return imt.map((c, i) => ({
			name: c.Src,
			mustBePresent: c.MustBePresent,
			columnOrder: i + 1,
			metaFormat: c.Format,
			schemaColumnType: c.Meta ? 'Metadata' : 'Validation',
			metaType: 'NotApplicable',
			columnValidators: convertColumnValidators(c.Rules)
		}));
	}
	function convertRowValidators(imt) {
		return Object.keys(imt).map((k) => {
			const v = imt[k];
			return {
				name: k,
				checkParameter: v.CheckParameter || '',
				ogicalOperator: v.RulesLogicalOperator,
				rowValidatorType: v.Type,
				columnsToCheck: v.ColsToCheck,
				columnsToAffect: v.ColsToAffect
			};
		});
	}

	const schemaColumns = convertColumns(imt.ColumnsOrder);
	const rowValidators = convertRowValidators(imt.Row);
	return {
		name,
		shortName,
		description,
		version: { schemaColumns, rowValidators }
	};
}

function schemaReadToWrite(schema, columnValidators) {
	schema.version = schema.activeVersion;

	for (let key of ['schemaId', 'isPredefined', 'workspaceId', 'activeVersion', 'versions']) {
		delete schema[key];
	}

	for (let key of ['schemaVersionId', 'schemaId', 'version', 'isActive']) {
		delete schema.version[key];
	}

	for (let column of schema.version.schemaColumns) {
		for (let key of ['schemaColumnId', 'schemaVersionId']) {
			delete column[key];
		}

		for (let validator of column.columnValidators) {
			const v = columnValidators.find(
				(v) => v.name == validator.validatorName || v.name == validator.validatorName + '1'
			);

			if (!v) {
				console.error(validator);
				return undefined;
			}

			validator.columnValidatorId = v.columnValidatorId;

			for (let key of ['schemaColumnId', 'validatorName']) {
				delete validator[key];
			}
		}
	}

	for (let validator of schema.version.rowValidators) {
		for (let key of ['rowValidatorId', 'schemaVersionId']) {
			delete validator[key];
		}
		validator.columnsToCheck = validator.columnsToCheck.map((c) => c.columnName);
		validator.columnsToAffect = validator.columnsToAffect.map((c) => c.columnName);
	}

	return schema;
}
