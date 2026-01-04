// ==UserScript==
// @name Switch JavaDoc version
// @namespace https://franklinyu.github.io
// @version 0.1
// @description Switch between JavaDoc versions since Java 7
// @match https://docs.oracle.com/javase/*/docs/api/*
// @downloadURL https://update.greasyfork.org/scripts/388046/Switch%20JavaDoc%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/388046/Switch%20JavaDoc%20version.meta.js
// ==/UserScript==

const match = location.pathname.match('/javase/(\\d+)/docs/api/(.*)')

const select = document.createElement('select')
select.style.float = 'right'
select.addEventListener('change', e => {
	location = `/javase/${e.target.value}/docs/api/${match[2]}`
})

for (const version of ['7', '8', '9', '10']) {
	const option = document.createElement('option')
	option.innerText = version
	if (version === match[1])
		option.selected = true
	select.append(option)
}

const navbar = document.getElementsByClassName('topNav')[0]
navbar && navbar.append(select)
