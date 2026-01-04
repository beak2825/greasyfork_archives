//jshint esversion: 6
//jshint asi: true

const url = new URL(location.href)
const page = (offset = 0) => url.pathname.split('/')[1 + offset]
const urlObj = url.searchParams
const domain = url.host

const setFname = str => {
    console.log(str)
    
    return str
}

const createBtn = (selector, count = 12, label = 'OpenLinks') => {
    $(selector).append(`<button id="open-links" data-count="${count}">${label} (${count})</button>`)
}

const ensureDomLoaded = callback => {
    if (['interactive', 'complete'].includes(document.readyState)) {
		callback()
		return
	}

	let triggered = false
	document.addEventListener('DOMContentLoaded', () => {
		if (!triggered) {
			triggered = true
			setTimeout(callback, 1)
		}
	})
}

const awaitElement = function (query, callback, time = null, err = null) {
	ensureDomLoaded(() => {
		let t = setInterval(() => {
			const e = $(query)
			if (e.length) {
				callback(e)
				clearInterval(t)
				return
			}

			if (time !== null) {
				setTimeout(() => {
					clearInterval(t)
					err(e)
					return
				}, time)
			}
		}, 10)
	})
}

const awaitTitleChange = (value, callback) => {
	let t = setInterval(() => {
		e = document.title
		if (e !== value) {
			callback(e)
			clearInterval(t)
		}
	}, 10)
}

const keyboardEvent = (callback, key = 'F19') => {
	document.addEventListener('keydown', e => {
		if (e.key.toLowerCase() === key.toLowerCase()) callback()
	})
}

const onFocus = (callback, persistent = false) => {
	if (persistent) {
		$(window).on('focus', callback)
		return
	} else if (document.hasFocus()) {
		callback()
		return
	}

	$(window).one('focus', callback)
}

const onBlur = (callback, persistent = false) => {
	if (persistent) {
		$(window).on('blur', callback)
		return
	} else if (!document.hasFocus()) {
		callback()
		return
	}

	$(window).one('blur', callback)
}

const onBlur_closeWindow = (persistent = false) => onBlur(window.close, persistent)
const onFocus_setClipboard = (data, persistent = false) => onFocus(() => setClipboard(data), persistent)
const setClipboard = data => GM_setClipboard(data)
const defaultCase = () => console.log(domain)

/* Prototypes */
Array.prototype.hasItem = function (item) {
	return this.indexOf(item) !== -1
}

Array.prototype.findDuplicates = function () {
	var uniq = this.map(name => {
		return {
			count: 1,
			name: name
		}
	}).reduce((a, b) => {
		a[b.name] = (a[b.name] || 0) + b.count
		return a
	}, {})

	return Object.keys(uniq).filter(a => uniq[a] > 1)
}

String.prototype.sizeToBytes = function () {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

	var valueArr = this.valueOf().split(' ')

	var selectedSize = valueArr[0]
	var selectedType = valueArr[1]

	return selectedSize * Math.pow(1024, sizes.indexOf(selectedType))
}

String.prototype.isUpperCase = function () {
	return this.valueOf() === this.valueOf().toUpperCase()
}

String.prototype.isLowerCase = function () {
	return this.valueOf() === this.valueOf().toLowerCase()
}

String.prototype.capitalize = function(preserve = true) {
    if(preserve) {
        return this.charAt(0).toUpperCase() + this.slice(1)
    } else {
        let str = this.toLowerCase()
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}

String.prototype.removeQuotes = function () {
	if (this.charAt(0) === '"' && this.charAt(this.length - 1) === '"') {
		return this.substr(1, this.length - 2)
	}

	return this
}

String.prototype.trimTrailing = function (charlist) {
	return this.replace(new RegExp(`[${charlist}]+$`), '')
}

String.prototype.nthIndexOf = function (pattern, n) {
	var i = -1

	while (n-- && i++ < this.length) {
		i = this.indexOf(pattern, i)
		if (i < 0) break
	}

	return i
}

String.prototype.insertSpaces = function () {
	let str = this

	str = str.replace(/([a-z])([A-Z])/g, '$1 $2')
	str = str.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')

	return str
}

String.prototype.strToName = function (short, long, ignore) {
	var str = this.valueOf()

	if (ignore.indexOf(str) > -1) {
		return ''
	} else if (short.indexOf(str) > -1 && short.length == long.length) {
		return long[short.indexOf(str)]
	} else {
		alert('Missing Site')
		console.log(`${location.protocol}//${domain}/en/${str}`)

		return str
	}
}

String.prototype.contentAfterFirstChar = function (separator) {
	return this.substring(this.indexOf(separator) + separator.length)
}

$.fn.textOnly = function () {
	return $(this).clone().children().remove().end().text()
}

$.fn.some = function (fn, thisArg) {
	let result

	for (let i = 0, iLen = this.length; i < iLen; i++) {
		if (this.hasOwnProperty(i)) {
			if (typeof thisArg == 'undefined') {
				result = fn(this[i], i, this)
			} else {
				result = fn.call(thisArg, this[i], i, this)
			}

			if (result) return true
		}
	}
	return false
}

/* Styles */

// Compatability style
GM_addStyle('#openLinks {cursor: default; }')

GM_addStyle('#open-links {cursor: default; color: black }')
GM_addStyle('#open-links[data-count] {padding: 2px 4px}')
GM_addStyle('#open-links[data-count="1"] {background-color: springgreen}')
GM_addStyle('#open-links[data-count="2"] {background-color: springgreen}')
GM_addStyle('#open-links[data-count="3"] {background-color: springgreen}')
GM_addStyle('#open-links[data-count="4"] {background-color: springgreen}')
GM_addStyle('#open-links[data-count="5"] {background-color: springgreen}')
GM_addStyle('#open-links[data-count="6"] {background-color: springgreen}')
GM_addStyle('#open-links[data-count="7"] {background-color: springgreen}')
GM_addStyle('#open-links[data-count="8"] {background-color: orange}')
GM_addStyle('#open-links[data-count="9"] {background-color: orange}')
GM_addStyle('#open-links[data-count="10"] {background-color: orange}')
GM_addStyle('#open-links[data-count="11"] {background-color: orange}')
GM_addStyle('#open-links[data-count="12"] {background-color: orange}')
GM_addStyle('#open-links[data-count="0"] {background-color: red}')
GM_addStyle('.element--missing {outline: 3px dashed red}')