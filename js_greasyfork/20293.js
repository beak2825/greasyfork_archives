// ==UserScript==
// @name        Steamgifts Train Driver
// @namespace   Barefoot Monkey
// @description Helps steamgifts users follow giveaway trains
// @include     https://www.steamgifts.com/giveaway/*
// @version     0.3
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/20293/Steamgifts%20Train%20Driver.user.js
// @updateURL https://update.greasyfork.org/scripts/20293/Steamgifts%20Train%20Driver.meta.js
// ==/UserScript==

var train_queue = []
var train_position = 0
var train_quota = 20
var train_quota_steps = 20
var already_in_queue = {}
var regex = /^https?\:\/\/www\.steamgifts\.com\/giveaway\/([^/]{5})/

var carriage_list = document.createElement('ol')


function add_to_queue(code) {
	if (!already_in_queue.hasOwnProperty(code)) {
		train_queue.push(code)
		already_in_queue[code] = true
	}
}


function new_element(tag, args) {
	var element = document.createElement(tag)
	if (args && args.text) element.appendChild(document.createTextNode(args.text))
	if (args && args.attr) {
		for (var attr in args.attr) {
			element.setAttribute(attr, args.attr[attr])
		}
	}
	if (args && args.parent) {
		if (args.ws) args.parent.appendChild(document.createTextNode(' '))
		args.parent.appendChild(element)
	}
	return element
}


function scan_next_link() {

	if (train_position < train_queue.length && train_position < train_quota) {
		// add temporary tail item
		new_element('p', { text:"scanning...", parent:scan_next_link.tail_item = new_element('li', {  parent:carriage_list }) })

		var code = train_queue[train_position]
		var url = 'https://www.steamgifts.com/giveaway/' + code + '/'

		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			context: url,
			onload:function(response) {

				var parser = new DOMParser();
				var dom = parser.parseFromString(response.responseText, "text/html");

				// get title
				var title_e = dom.querySelector('.featured__heading__medium')
				if (title_e) {
					title = (title_e && title_e.textContent) ? title_e.textContent.trim() : "(unknown)"

					// errors
					var error_e = dom.querySelector('.sidebar__error')

					// scan description
					var description_e = dom.querySelector('.page__description')

					var li = new_element('li')
					var header = new_element('h1', {parent:li})
					new_element('a', {attr: {'href':response.finalUrl}, text:title, parent:header })

					// subheadings, such as for points and number of copies
					var subheadings = dom.querySelectorAll('.featured__heading__small')
					for (let i = 0; i < subheadings.length; i += 1) {
						new_element('span', { text:subheadings[i].textContent, parent:header, ws:true })
					}

					if (error_e && error_e.textContent) new_element('span', { attr: {class:'error'}, text:error_e.textContent.trim(), parent:header, ws:true })
					else if (dom.querySelector('.sidebar__entry-delete:not(.is-hidden)')) new_element('span', { attr: {class:'status'}, text:' Entered', parent:header })
					carriage_list.appendChild(li)

					if (description_e) {
						var div = new_element('div', {attr:{class:'description'}, parent:li})
						div.innerHTML = description_e.innerHTML

						var giveaway_links = description_e.querySelectorAll('a[href^="https://www.steamgifts.com/giveaway/"],a[href^="http://www.steamgifts.com/giveaway/"]')

						for (let i = 0; i < giveaway_links.length; i += 1) {
							var url = giveaway_links[i].href
							var result = regex.exec(url)
							if (result && result.length > 1) {
								add_to_queue(result[1])
							}
						}
					}

					carriage_list.removeChild(scan_next_link.tail_item)
					scan_next_link.tail_item = null
				} else {
					var name = '(unknown)'
					var error = 'Unknown error'
					
					var heading_e = dom.querySelector('.page__heading')
					if (heading_e) {
						var heading = heading_e.textContent.trim()
						if (heading == 'Error') {
							var name_e = dom.querySelector('.table--summary>.table__row-outer-wrap:nth-child(1) a.table__column__secondary-link')
							if (name_e) name = name_e.textContent.trim()
							var error_e = dom.querySelector('.table--summary>.table__row-outer-wrap:nth-child(2) .table__column--width-fill')
							if (error_e) error = error_e.textContent.trim()
						}
					}

					var li = new_element('li')
					var header = new_element('h1', {parent:li})
					new_element('a', {attr: {'href':response.finalUrl}, text:name, parent:header })
					new_element('span', { attr: {class:'error'}, text:error, parent:header, ws:true })
					carriage_list.appendChild(li)

					carriage_list.removeChild(scan_next_link.tail_item)
					scan_next_link.tail_item = null
				}

				train_position += 1
				scan_next_link()
			},
			onerror:function(response) {
				var li = new_element('li', {text:'Error: Could not load giveaway '})
				var a = new_element('a', {attr: {'href':response.finalUrl}, text:title, parent:li })
				carriage_list.appendChild(li)

				train_position += 1
				scan_next_link()
			}
		})
	} else if (train_position < train_queue.length) {
		var li = new_element('li', {parent:carriage_list})
		var a = new_element('a', {text:'There are more carriages. Click here to visit the next '+train_quota_steps+'.',parent:new_element('p', {parent:li})})
		a.addEventListener('click', function() {

			var header = document.querySelector('header')

			window.scrollTo(0, li.previousSibling.offsetTop - ((header && header.getBoundingClientRect) ? header.getBoundingClientRect().height : 40))

			carriage_list.removeChild(li)
			train_quota += train_quota_steps
			scan_next_link()
		})
	}
}


// // check the description for a link to another giveaway. If present, then assume that this is a train
var description = document.querySelector('.page__description')
if (description) {
	var giveaway_links = description.querySelectorAll('a[href^="https://www.steamgifts.com/giveaway/"],a[href^="http://www.steamgifts.com/giveaway/"]')

	for (var i = 0; i < giveaway_links.length; i += 1) {
		var url = giveaway_links[i].href
		var result = regex.exec(url)
		if (result && result.length > 1) {
			add_to_queue(result[1])
		}
	}

	if (train_queue.length > 0) {
		var train_driver_root = new_element('div', {attr:{'class':'sg-train-driver'}})

		new_element('style', {
			parent:document.head,
			text:`
.sg-train-driver ol li {
	box-shadow: 0 4px 4px -5px black inset;
	padding: 1px 1em;
	counter-increment: carriage;
}
.sg-train-driver p {
	margin: 1em 0;
}
.sg-train-driver ol {
	display: block;
	margin: 0 -1em;
	counter-reset: carriage 1;
}
.sg-train-driver a:hover {
	text-decoration: underline;
}
.sg-train-driver a {
	color: #2C53AB;
	cursor: pointer;
}
.sg-train-driver>ol>li>h1:before {
	display: block;
	content: "carriage " counter(carriage);
	font-size: 0.8em;
	font-weight: bold;
	margin-left: 1em;
}
.sg-train-driver>ol>li>h1 a {
	font-weight: bold;
	color: #fff;
}
.sg-train-driver>ol>li>h1 {
	background: #393F4A;
	margin: -1px -1em 0.5em;
	padding: 0.5em 1em;
	color: #999;
}
.sg-train-driver {
	margin: 0.5em;
	padding: 0 1em;
	border: 1px #a8a8bc solid;
	background: #e6e6fa;
	color: #3B3B4F;
	text-shadow: none;
}
`})

		train_driver_root.appendChild(carriage_list)
		description.appendChild(train_driver_root)

		var p = new_element('p', {text:"SG Train Driver thinks that this might be a train.", parent:train_driver_root})
		var a = new_element('a', {text:'Click here to visit the next '+train_quota_steps+' carriages.',parent:p, ws:true})
		a.addEventListener('click', function() {
			train_driver_root.removeChild(p)
			scan_next_link()
		})

	}
}
