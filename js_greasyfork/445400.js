// ==UserScript==
// @name C2 Wiki Classic Edition
// @description Makes the new SPAified C2 Wiki behave more like an ordinary website.
// @version 1
// @grant GM.info
// @run-at document-start
// @match *://wiki.c2.com/
// @match *://wiki.c2.com/?*
// @license MIT
// @namespace https://greasyfork.org/users/833386
// @downloadURL https://update.greasyfork.org/scripts/445400/C2%20Wiki%20Classic%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/445400/C2%20Wiki%20Classic%20Edition.meta.js
// ==/UserScript==

const tab2spaces = s => s.replace(/\t/g, "  ")

String.prototype.replaceFunction = function(head, replacement) {
	return this.replace(
		new RegExp(`^((\\s*)${head.replace(/[.()]/g, '\\$&')} {)[\\S\\s]*?^\\2}`, 'm'),
		(match, p1, p2) => 
			p1 + tab2spaces(replacement).split('\n').map(line => p2 + line).join('\n') + "}"
	)
}

const patch = s => tab2spaces(`	const [
		serialisePage,
		deserialisePage
	] = (() => {
		const s = new XMLSerializer()
		const p = new DOMParser()
		return [
			e => s.serializeToString(e),
			es => p.parseFromString(es, "text/html").querySelector(".page")
		]
	})()`) + s.replaceFunction("try", `
	[names, index, json] = await Promise.all([
		fetch('names.txt').then(res => res.text()).then(text => text.split(/\\r?\\n/)),
		fetch('c2-fed-index.json').then(res => res.json()),
		fetch(database+title).then(res => res.json())
	])
	options.names = names
	let page = rendered(title,json)
	history.replaceState(serialisePage(page), null)
	window.tab.insertBefore(page,null)
`).replaceFunction("window.onpopstate = async function(event)", `
	if (event.state)
		document.querySelector(".page").replaceWith(deserialisePage(event.state))
	else
		history.go(-1)
`).replaceFunction("async function internallinks(event)", `
	const t = event.target
	if (t.tagName !== 'A' || t.getAttribute('target') || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey)
		return

	event.preventDefault()

	const href = t.getAttribute('href'),
		title = href.split('?').slice(-1)[0],
		json = await fetch(database+title).then(res => res.json()),
		page = rendered(title, json)

	history.pushState(serialisePage(page),'',href)
	document.querySelector(".page").replaceWith(page)
`)

let didPatch = false

document.addEventListener('readystatechange', e => {
	if (!didPatch && document.readyState === "complete") {
  		let oops = document.createElement("div")
		oops.style.cssText = "color: oldlace; background-color: maroon; position: absolute; z-index: 4"
		oops.innerHTML = `
The script ${GM.info.script.name} has failed to perform its primary function.<br/>
This, in all likelihood, means that the front end of the C2 wiki has been overhauled.<br/>
You are welcome to write to <code>userscripts AT ylh DOT io</code> and ask for a fix.`
		document.body.prepend(oops)
	}
})

document.addEventListener('beforescriptexecute', e => {
	const script = e.target

	if (!script.matches('script[type="module"]:not(.greasy)'))
		return

	const html = script.innerHTML

	if ((s => {
		let h = 0, high = 0
		for (let i = 0; i < s.length; i++) {
			h = (h << 4) + s.charCodeAt(i)
    			if (high = h & 0xF0000000)
				h ^= high >> 24
    			h &= ~high
  		}
  		return h
	})(html) !== 0x086E878A) {
		return
	}

	e.stopPropagation()
	e.preventDefault()

	const p = script.parentElement,
		newModule = patch(html),
		newScript = document.createElement('script')

	script.remove()
	newScript.setAttribute('type', "module")
	newScript.classList.add("greasy")
	newScript.innerHTML = newModule
	p.appendChild(newScript)

	const newStyle = document.createElement("style")
	newStyle.innerHTML = ".page { all: initial; }"
	document.head.querySelector('link[rel="stylesheet"]').after(newStyle)

	didPatch = true
});
