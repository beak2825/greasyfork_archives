// ==UserScript==
// @name        DeindentTemplateLiteralString
// @license     Unlicense
// @namespace   1N07
// @match       *://*/*
// @version     1.2
// @author      1N07
// @description Exports a simple function that can be passed a template literal. It strips code indentation from it while preserving intended indentation, by stripping out the smallest indent every line has in common.
// ==/UserScript==

/**
 * Takes a string (usually evaluated from a template literal) and strips code indentation from it,
 * while preserving intended intendation, by slicing out the smallest indentation each line has in common.
 * @param {String} str
 * @returns str with code indentation removed
 */
function DeindentTemplateLiteralString(str) {
	const smallestIndent = Math.min(
		...str
			.split("\n")
			.filter((line) => line.trim())
			.map((line) => line.match(/^\s+/)?.[0]?.length),
	);
	return str
		.split("\n")
		.map((line) => line.slice(smallestIndent))
		.join("\n")
		.trim();
}

//aliases
const Deindent = DeindentTemplateLiteralString;
