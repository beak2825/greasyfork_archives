// ==UserScript==
// @name			Amazon units converter
// @name:ru			Amazon конвертер величин
// @namespace		https://greasyfork.org/ru/users/303426-титан
// @version				1.1.0
// @description		Convert Amazon units to normal units that all normal countries uses. It's check only 2 rows in a Specs table, so it's very perfomance-friendly.
// @description:ru	Конвертирует единицы измерения Амазона из американских в нормальные. Он проверяет только 2 строчки в Характеристиках, поэтому этот скрипт не оказывает практически никакого влияния на производительность
// @author			Титан
// @include			http://www.amazon.com/*/dp/*
// @include			https://www.amazon.com/*/dp/*
// @include			http://www.amazon.co.uk/*/dp/*
// @include			https://www.amazon.co.uk/*/dp/*
// @include			http://www.amazon.fr/*/dp/*
// @include			https://www.amazon.fr/*/dp/*
// @include			http://www.amazon.de/*/dp/*
// @include			https://www.amazon.de/*/dp/*
// @include			http://www.amazon.es/*/dp/*
// @include			https://www.amazon.es/*/dp/*
// @include			http://www.amazon.ca/*/dp/*
// @include			https://www.amazon.ca/*/dp/*
// @include			http://www.amazon.in/*/dp/*
// @include			https://www.amazon.in/*/dp/*
// @include			http://www.amazon.it/*/dp/*
// @include			https://www.amazon.it/*/dp/*
// @include			http://www.amazon.co.jp/*/dp/*
// @include			https://www.amazon.co.jp/*/dp/*
// @include			http://www.amazon.com.mx/*/dp/*
// @include			https://www.amazon.com.mx/*/dp/*
// @include			http://www.amazon.com.au/*/dp/*
// @include			https://www.amazon.com.au/*/dp/*
// @include			http://www.amazon.com/*/product/*
// @include			https://www.amazon.com/*/product/*
// @include			http://www.amazon.co.uk/*/product/*
// @include			https://www.amazon.co.uk/*/product/*
// @include			http://www.amazon.fr/*/product/*
// @include			https://www.amazon.fr/*/product/*
// @include			http://www.amazon.de/*/product/*
// @include			https://www.amazon.de/*/product/*
// @include			http://www.amazon.es/*/product/*
// @include			https://www.amazon.es/*/product/*
// @include			http://www.amazon.ca/*/product/*
// @include			https://www.amazon.ca/*/product/*
// @include			http://www.amazon.in/*/product/*
// @include			https://www.amazon.in/*/product/*
// @include			http://www.amazon.it/*/product/*
// @include			https://www.amazon.it/*/product/*
// @include			http://www.amazon.co.jp/*/product/*
// @include			https://www.amazon.co.jp/*/product/*
// @include			http://www.amazon.com.mx/*/product/*
// @include			https://www.amazon.com.mx/*/product/*
// @include			http://www.amazon.com.au/*/product/*
// @include			https://www.amazon.com.au/*/product/*
// @icon			https://www.google.com/s2/favicons?domain=amazon.com
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/431314/Amazon%20units%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/431314/Amazon%20units%20converter.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let DebugText = ":::Amazon American units to normal units extension::: ";
	let Debug = false;
	let UnitNames = ["inches", "pounds", "ounces"];
	let NewUnitNames = ["cm", "kg", "gram"]
	let ConvertFuncs = [ConvertInchesToSm, ConvertPoundsToKg, ConvertOuncesToGram]
	let CheckAllRows = false;

	class UnitText {
		StartIndex
		Unit
		NewUnit
		UnitConvertFunc

		get StartIndex() {
			return this._Index;
		}

		set StartIndex(value) {
			this._Index = value;
		}

		get Unit() {
			return this._Unit;
		}

		set Unit(value) {
			this._Unit = value;
		}

		get NewUnit() {
			return this._NewUnit;
		}

		set NewUnit(value) {
			this._NewUnit = value;
		}

		get UnitConvertFunc() {
			return this._UnitConvertFunc;
		}

		set UnitConvertFunc(value) {
			this._UnitConvertFunc = value;
		}

		constructor(StartIndex, Unit, NewUnit, UnitConvertFunc) {
			this._Index = StartIndex;
			this._Unit = Unit;
			this._NewUnit = NewUnit;
			this._UnitConvertFunc = UnitConvertFunc;
		}
	}

	window.onload = () => {
		if (Debug) {console.log("Amazon unit converter started"); }
		let Tables = document.querySelectorAll("table");

		for(let table of Tables) {
			if (Debug) {console.log("TABLE:"); console.log(table);}
			let tbody = table.firstElementChild;
			try {
				for (let tr of tbody.children) {
					let thNode = tr;
					while (thNode.firstElementChild != null) {thNode = thNode.firstElementChild}
					let lowerText = thNode.textContent.toLowerCase();
					if (Debug) console.log("text: ", lowerText);

					if (lowerText.indexOf("dimensions") >= 0 || lowerText.indexOf("weight") >= 0||!CheckAllRows) {
						TableSearch(tr);
					}
				}
			}
			catch (e) {
				if(Debug) console.log(table.id+ ": "+e.message);
			}
		}
	}

	function TableSearch(tr) {
		if (Debug) {
			console.log("TableSearch td:");
			console.log(tr);
		}
		let dimentionsTds = tr.querySelectorAll("td");
		for (let td of dimentionsTds) {
			while (td.firstElementChild != null) {td = td.firstElementChild}
			td.textContent = ReplaceUnits(td.textContent);
		}
	}

	/**
	 *
	 * @param {string} Text Text that will be converted
	 * @returns {string} Is something were converted (False, if nothing to convert found)
	 * @constructor
	 */
	function ReplaceUnits(Text) {
		let lastStart;
		do {
			let unitTextInfo = new Array(UnitNames.length);
			for (let i = 0; i < UnitNames.length; i++) {
				unitTextInfo[i] = new UnitText();
				unitTextInfo[i].StartIndex = Text.toLowerCase().indexOf(UnitNames[i]);
				if (unitTextInfo[i].StartIndex>0) {
					unitTextInfo[i].StartIndex+=UnitNames[i].length;
					unitTextInfo[i].Unit = UnitNames[i];
					unitTextInfo[i].NewUnit = NewUnitNames[i];
					unitTextInfo[i].UnitConvertFunc = ConvertFuncs[i];
				}
			}
			unitTextInfo.sort((a, b) => a.StartIndex - b.StartIndex); //5,4,3,2,1

			let Texts = new Array(unitTextInfo.length);
			lastStart = 0;
			for (let i = 0; i < unitTextInfo.length; i++) {
				if (unitTextInfo[i].StartIndex != -1) {
					Texts[i] = Text.slice(lastStart, unitTextInfo[i].StartIndex + 1);
					lastStart = unitTextInfo[i].StartIndex;
					Texts[i] = ReplaceUnit(Texts[i], unitTextInfo[i].Unit, unitTextInfo[i].NewUnit, unitTextInfo[i].UnitConvertFunc);
				}
			}

			if (lastStart == 0) break;

			Text = "";
			for (let t of Texts) {
				if (t!=undefined) Text+=t;
			}
		} while (true) //do until nothing to convert left
		return Text;
	}

/**
 * Converts all numbers in text from old unit to new unit
 *
 * @param {string} Text Text that will be converted
 * @param {string} UnitName Name of current unit
 * @param {string} NewUnitName Name of the new unit
 * @param {function} UnitConvertFunc Function that takes current unit float and returns new unit float
 * @return {string} Text with all old unit floats replaced by new unit floats
 */
function ReplaceUnit(Text,UnitName,NewUnitName,UnitConvertFunc) {
	let NewText = "";
	let lastUnitTextIndex = -UnitName.length;

	let unitTextIndex = Text.toLowerCase().indexOf(UnitName);
	if (unitTextIndex===-1) return Text;

	let unitTextFragment = Text.slice(lastUnitTextIndex+UnitName.length, unitTextIndex)
	lastUnitTextIndex = unitTextIndex;

	while (unitTextIndex!==-1) { //while there IS a UnitName text in a string untouched
		let i = 0;

		console.log("original fragment: " + unitTextFragment);
		LfragmentLoop:
			while (i < unitTextFragment.length)
			{ //Перебор внутри фрагмента
				let firstDigitPos;
				let lastDigitPos;
				for (i; ;i++) { //Searches for first digit symbol
					if (i === unitTextFragment.length) { //if first digit not found, exit circle
						if(Debug) console.log(`${DebugText}no Number found before \"${UnitName}\" text: ${NormalizeString( unitTextFragment)}`);
						break LfragmentLoop;
					}
					if (isFloatNumber(unitTextFragment[i])) break;  //if first digit found, break
				}

				lastDigitPos = firstDigitPos = i;

				for (i+=1;i < unitTextFragment.length; i++) {//searches for last digit position
					if (isFloatNumber(unitTextFragment[i])) lastDigitPos = i;
					else break;
				}

				let UnitNumber = unitTextFragment.slice(firstDigitPos,lastDigitPos+1);
				let NewUnitNumber = UnitConvertFunc(UnitNumber).toFixed(2);
				unitTextFragment = unitTextFragment.slice(0,firstDigitPos) + NewUnitNumber + unitTextFragment.slice(lastDigitPos+1);
				let offset = NewUnitNumber.length - UnitNumber.length
				i+= offset;
				if(Debug) console.log("fragment: "+ NormalizeString(unitTextFragment)+"\nCursorpos:"+CreateSpaces(i)+"↑");
			}

		NewText+=unitTextFragment + NewUnitName;
		unitTextIndex = Text.toLowerCase().indexOf(UnitName, lastUnitTextIndex+UnitName.length);
		if (unitTextIndex===-1) break;
		unitTextFragment = Text.slice(lastUnitTextIndex+UnitName.length, unitTextIndex)
		lastUnitTextIndex = unitTextIndex;
	}

	if (lastUnitTextIndex<Text.length)
		NewText+=Text.slice(lastUnitTextIndex+UnitName.length)
	return NewText;
}

function ConvertInchesToSm(Inches) {
	return Inches*2.54;
}

function ConvertPoundsToKg(Pounds) {
	return Pounds*0.45359237;
}

function ConvertOuncesToGram(Ounces) {
	return Ounces *28.34952313;
}

function isFloatNumber(c) {
	return c >= '0' && c <= '9' || c === '.';
}

function CreateSpaces(Count){
	let Spaces = "";
	for (let i=Count;i--; i>0) Spaces+= " ";
	return Spaces;
}

function NormalizeString(inputString){
	let normalizedString = "";
	for (let i=0; i<inputString.length;i++) {
		switch (inputString[i]) {
			case '\n': normalizedString+="↵"; break;
			case '\t': normalizedString+="⇥"; break;
			case '\r': normalizedString+="␍"; break;
			case '\b': normalizedString+="␈"; break;
			case '\f': normalizedString+="↡"; break;
			case '\v': normalizedString+="⭳"; break;
			case '\0': normalizedString+="␀"; break;
			default: normalizedString+= inputString[i]; break;
		}
	}
	return normalizedString;
}
})();