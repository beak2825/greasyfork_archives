// ==UserScript==
// @name         Bonk Deobfuscator
// @version      0.2
// @description  Partially deobfuscate the code
// @author       KOOKY WARRIOR
// @license      MIT
// @match        https://bonk.io/gameframe-release.html
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify.min.js
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/467842/Bonk%20Deobfuscator.user.js
// @updateURL https://update.greasyfork.org/scripts/467842/Bonk%20Deobfuscator.meta.js
// ==/UserScript==

/*
This code can only **PARTIALLY** deobfuscate the alpha2.js and save as a .js file

**TIPS: Disable this userscript once you have obtained the deobfuscated code**
*/

function log(text) {
	console.log(`[Bonk Deobfuscator] ${text}`)
}

const url = "https://bonk.io/js/alpha2s.js"
log("Fetching " + url)

fetch(url)
	.then((response) => response.text())
	.then((response) => {
		log("Deobfuscation started")

		function noDuplicate(array) {
			return [...new Set(array)]
		}
		function escapeRegExp(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		}

		let tmp

		log("Unminifing the code")
		const splitedText = js_beautify(response, { e4x: true }).split("requirejs")

		log("Setting up main variables")
		const MAINFUNCTION = splitedText[0].match(/[^\[]+/)[0]
		const MAINARRAY = splitedText[0].match(/^var ([^=^\s]+);/m)[1]

		log(`eval ${MAINFUNCTION} function`)
		eval(`var ${MAINFUNCTION};${response.split("requestjs")[0]}`)
		let returncode = `requirejs${splitedText[1]}`

		log(`Replacing "var a = ${MAINFUNCTION}; a.bcd(123)" to "${MAINFUNCTION}.bcd(123)"`)
		tmp = returncode.match(new RegExp(`var (\\S+) = ${escapeRegExp(MAINFUNCTION)};`, ""))[1]
		returncode = returncode.replaceAll(`${tmp}.`, `${MAINFUNCTION}.`)

		log(`Replacing all duplicate functions`)
		tmp = [...splitedText[0].matchAll(new RegExp(`(?<v>${escapeRegExp(MAINFUNCTION)}\\.[\\S]+) = (?<f>function\\(\\) \\{.+?};)`, "gs"))]
		let VARIABLES = tmp.map((m) => m.groups.v)
		let FUNCTIONS = tmp.map((m) => m.groups.f)
		let indices = {}
		for (let i = 0; i < FUNCTIONS.length; i++) {
			if (!indices[FUNCTIONS[i]]) {
				indices[FUNCTIONS[i]] = []
			}
			indices[FUNCTIONS[i]].push(i)
		}
		for (const key in indices) {
			const element = indices[key]
			for (let i = 0; i < element.length; i++) {
				splitedText[0] = splitedText[0].replaceAll(VARIABLES[element[i]], VARIABLES[element[0]])
				returncode = returncode.replaceAll(VARIABLES[element[i]], VARIABLES[element[0]])
			}
		}

		log(`Replacing math operation`)
		const OPERATIONEQUALVARIABLE = /case 0:\n\s+(\S+) = .+\n.+break;/gm.exec(splitedText[0])[1]
		tmp = new RegExp(
			`return {\\s+(\\S+): function\\(\\) {\\s+var ${escapeRegExp(OPERATIONEQUALVARIABLE)}, (.+) = arguments;\\s+switch \\((.+)\\)`,
			"gm"
		).exec(splitedText[0])
		const OPERATIONFUNCTION = new RegExp(`(${escapeRegExp(MAINFUNCTION)}\\....) = function\\(\\) {\\s+return.+${tmp[1]}`, "gm").exec(splitedText[0])[1]
		const OPERATIONFUNCTIONSETTER = new RegExp(
			`(${escapeRegExp(MAINFUNCTION)}\\....) = function\\(\\) {\\s+return.+${escapeRegExp(
				new RegExp(`,\\s+(\\S+): function.+\\s+${escapeRegExp(tmp[3])} =`, "gm").exec(splitedText[0])[1]
			)}`,
			"gm"
		).exec(splitedText[0])[1]
		const OPERATIONARGUMENTVARIABLE = escapeRegExp(tmp[2])
		tmp = returncode.match(
			new RegExp(
				`${escapeRegExp(OPERATIONFUNCTION)}\\((?:[^)(]|\\((?:[^)(]|\\((?:[^)(]|\\([^)(]*\\))*\\))*\\))*\\)|${escapeRegExp(
					OPERATIONFUNCTIONSETTER
				)}\\(\\d+\\)`,
				"g"
			)
		)
		// FUNCTION\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)
		var OPERATIONFUNCTIONSETTERVALUE = 0
		for (let i = 0; i < tmp.length; i++) {
			const element = tmp[i]
			if (element.includes(OPERATIONFUNCTION)) {
				const args = element.replace(`${OPERATIONFUNCTION}(`, "").replace(/.$/, "").replace(/\s/g, "").split(",")
				if (args[args.length - 1].includes(OPERATIONFUNCTIONSETTER)) {
					OPERATIONFUNCTIONSETTERVALUE = parseInt(new RegExp(`${escapeRegExp(OPERATIONFUNCTIONSETTER)}\\((\\d+)\\)`).exec(args[args.length - 1])[1])
					args.pop()
				}
				var value = new RegExp(`case ${OPERATIONFUNCTIONSETTERVALUE}:\\n\\s+${escapeRegExp(OPERATIONEQUALVARIABLE)} = (.+);\\n.+break;`, "gm").exec(
					splitedText[0]
				)[1]
				for (let j = 0; j < args.length; j++) {
					value = value.replaceAll(`${OPERATIONARGUMENTVARIABLE}[${j}]`, args[j])
				}
				try {
					value = eval(value)
				} catch (error) {
				} finally {
					returncode = returncode.replace(element, value)
				}
			} else {
				OPERATIONFUNCTIONSETTERVALUE = parseInt(new RegExp(`${escapeRegExp(OPERATIONFUNCTIONSETTER)}\\((\\d+)\\)`).exec(element)[1])
			}
		}

		const ARRAYFUNCTION = new RegExp(`${escapeRegExp(MAINARRAY)} = .+?(${escapeRegExp(MAINFUNCTION)}\\....)`, "").exec(splitedText[0])[1]
		log(`Replacing "${ARRAYFUNCTION}(123)" to "real data"`)
		tmp = noDuplicate(returncode.match(new RegExp(`${escapeRegExp(ARRAYFUNCTION)}\\((?:[^)(]|\\((?:[^)(]|\\((?:[^)(]|\\([^)(]*\\))*\\))*\\))*\\)`, "g")))
		for (let i = 0; i < tmp.length; i++) {
			const element = tmp[i]
			try {
				returncode = returncode.replaceAll(element, `"${eval(element).replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/"/g, '\\"')}"`)
			} catch (error) {
				const args = element.replace(`${ARRAYFUNCTION}(`, "").replace(/.$/, "")
				const value = parseInt(new RegExp(`${escapeRegExp(args)} = (\\d+)`).exec(returncode)[1])
				returncode = returncode.replaceAll(
					element,
					`"${eval(`${ARRAYFUNCTION}(${value})`).replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/"/g, '\\"')}"`
				)
			}
		}

		log(`Replacing "var a = ${MAINARRAY}; a[123]" to "${MAINARRAY}[123]"`)
		tmp = [...returncode.matchAll(new RegExp(`\\s+(?<v>\\S+) = ${escapeRegExp(MAINARRAY)}.*$`, "gm"))].map((m) => m.groups.v)
		for (let i = 0; i < tmp.length; i++) {
			returncode = returncode.replaceAll(tmp[i], MAINARRAY)
		}

		log(`Replacing "${MAINARRAY}[123]" to "real data"`)
		tmp = noDuplicate(
			returncode.match(new RegExp(`${escapeRegExp(MAINARRAY)}\\[(?:[^\\]\\[]|\\[(?:[^\\]\\[]|\\[(?:[^\\]\\[]|\\[[^\\]\\[]*\\])*\\])*\\])*\\]`, "g"))
		)
		// ARRAY\[(?:[^\]\[]|\[(?:[^\]\[]|\[(?:[^\]\[]|\[[^\]\[]*\])*\])*\])*\]
		for (let i = 0; i < tmp.length; i++) {
			const element = tmp[i]
			try {
				returncode = returncode.replaceAll(element, `"${eval(element).replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/"/g, '\\"')}"`)
			} catch (error) {
				try {
					const args = element.replace(`${MAINARRAY}[`, "").replace(/.$/, "")
					const value = parseInt(new RegExp(`${escapeRegExp(args)} = (\\d+)`).exec(returncode)[1])
					returncode = returncode.replaceAll(element, `"${eval(`${MAINARRAY}[${value}]`).replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/"/g, '\\"')}"`)
				} catch (err) {}
			}
		}

		log("Saving deobfuscated code")
		const filename = `BonkDeobfuscated_${Date.now()}`
		const blob = new Blob([splitedText[0] + returncode], { type: "text/javascript;charset=utf-8;" })
		if (window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveBlob(blob, filename)
		} else {
			const elem = window.document.createElement("a")
			elem.href = window.URL.createObjectURL(blob)
			elem.download = filename
			document.body.appendChild(elem)
			elem.click()
			document.body.removeChild(elem)
		}
	})
	.catch((err) => console.log(err))
