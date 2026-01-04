// ==UserScript==
// @name         Autodesk DXF Reference tables sort
// @namespace    V@no
// @author       V@no
// @description  Sort tables for easier find the needed code
// @include      http://docs.autodesk.com/*
// @include      https://docs.autodesk.com/*
// @include      http://help.autodesk.com/*
// @include      https://help.autodesk.com/*
// @license      MIT
// @version      1.0
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474515/Autodesk%20DXF%20Reference%20tables%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/474515/Autodesk%20DXF%20Reference%20tables%20sort.meta.js
// ==/UserScript==

(() =>
{
"use strict";

let aTrDefault = [];
let elHead;
const sortLabel = ["▲▼", "▲", "▼"];
const SETTINGS = (() =>
{
	const settings = {
		sort: {
			value: 0,
			valid: [0, 1, 2]
		}
	};
	const settingsName = "dxfRefSort";
	const settingsData = JSON.parse(localStorage.getItem(settingsName)) || {};

	const settingsSave = () =>
	{
		const data = JSON.stringify(settingsData);
		if (data === "{}")
			localStorage.removeItem(settingsName);
		else
			localStorage.setItem(settingsName, data);
	};

	for (const i in settings)
	{
		if (!settings[i].valid)
			continue;

		if (Array.isArray(settings[i].valid)
			&& !settings[i].valid.includes(settingsData[i]))
		{
			delete settingsData[i];
		}
	}
	settingsSave();

	const settingsHandler = {
		get: (target, name) => (Object.prototype.hasOwnProperty.call(target, name)
			? target[name]
			: Object.prototype.hasOwnProperty.call(settings, name) && settings[name].value),

		set: (target, name, value) =>
		{
			if (!(name in settings))
				return true;

			if (typeof value !== typeof settings[name].value)
			{
				switch (typeof settings[name].value)
				{
					case "string": {
						value = "" + value;
						break;
					}
					case "number": {
						value = Number.parseFloat(value);
						break;
					}
					case "boolean": {
						value = value ? true : false;
					}
				}
			}
			if (typeof value !== typeof settings[name].value)
				return true;

			const isChanged = value !== target[name] && settings[name].onChange instanceof Function;

			if (settings[name].valid && !settings[name].valid.includes(value))
				value = settings[name].value;

			if (value === settings[name].value)
				delete target[name];
			else
				target[name] = value;

			settingsSave();

			if (isChanged)
				settings[name].onChange(name, value);

			return true;
		},

	};
	return new Proxy(settingsData, settingsHandler);
})();

const sortTable = () =>
{
	const aTr = [...aTrDefault];
	if (SETTINGS.sort)
	{
		const sort = SETTINGS.sort === 1
			? (a, b) => a._num - b._num
			: (a, b) => b._num - a._num;

		for(let i = 0, previous = 0; i < aTr.length; i++)
		{
			let number_ = Number.parseInt(aTr[i].firstElementChild.textContent);
			if (Number.isNaN(number_))
				number_ = previous;
			else
				previous = number_;

			aTr[i]._num = number_;
		}
		aTr.sort(sort);
	}
	const elParent = aTr[0].parentNode;
	for(let i = 0; i < aTr.length; i++)
	{
		const el = aTr[i];
		el.classList.remove("RuledOddRow", "RuledEvenRow");
		el.classList.add(i % 2 ? "RuledEvenRow" : "RuledOddRow");
		elParent.append(el);
	}
	if (elHead)
		elHead.lastElementChild.dataset.sort = sortLabel[SETTINGS.sort];

	return aTr;
};

const onClick = () =>
{
	SETTINGS.sort++;
	sortTable();
};

const processNode = node =>
{
	if (!node.querySelectorAll) return;
	const elTable = node.querySelector("table.ruled, table.table");
	if (!elTable)
		return;

	elHead = elTable.querySelector("tr.RuledHeading > :first-child:not([colspan]), thead.thead > tr.row > :first-child:not([colspan])");
	elHead.removeEventListener("click", onClick);
	elHead.addEventListener("click", onClick);
	elHead.classList.add("pointer");
	aTrDefault = [...elTable.querySelectorAll("tr.RuledOddRow,tr.RuledEvenRow, table:not(.ruled) tbody tr")];
	sortTable();
};

new MutationObserver(mutations =>
{
	for (let i = 0; i < mutations.length; i++)
	{
		const addedNodes = mutations[i].addedNodes;
		if (!addedNodes) continue;

		for (let j = 0; j < addedNodes.length; j++)
			processNode(addedNodes[j]);
	}
}).observe(document, { childList: true, subtree: true });

const init = () =>
{
	const css = document.createElement("style");
	css.textContent = `
.pointer
{
	cursor: pointer;
	user-select: none;
}
thead.thead > tr > th > .p[data-sort]::after, /* help.autodesk.com */
.table-heading[data-sort]::after /* docs.autodesk.com */
{
	content: attr(data-sort);
	display: inline-block;
	width: 0;
	letter-spacing: -0.1em;
	padding: 0 0.3em;
	font-family: monospace;
	vertical-align: bottom;
	line-height: 1.2em;
}
thead.thead > tr > th > .p[data-sort]::after /* help.autodesk.com */
{
	font-size: 0.8em;
	line-height: 1.5em;
}
thead.thead > tr > th > .p[data-sort="▲▼"]::after /* help.autodesk.com */
{
	font-size: 0.8em;
	height: 1.6em;
	line-height: 0.7em;
}
`;
	document.head.append(css);
};
if (document.readyState === "loading")
	document.addEventListener("DOMContentLoaded", init);
else
	init();

})();