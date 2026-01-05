// ==UserScript==
// @id          gooutcalendar@jnv.github.io
// @name        GoOut: Add Event to Google Calendar
// @description Displays Calendar button to easily add events to Google Calendar
// @namespace   https://jnv.github.io
// @domain      goout.net
// @include     https://goout.net/*
// @version     2018.11.28
// @grant       none
// @run-at      document-idle
// @screenshot  https://gist.github.com/jnv/b1891f33fb7b6f6d03dd435ba7dc3266/raw/screenshot.png
// @license     CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/27431/GoOut%3A%20Add%20Event%20to%20Google%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/27431/GoOut%3A%20Add%20Event%20to%20Google%20Calendar.meta.js
// ==/UserScript==
'use strict'

const SEL = {
  parent: '[itemtype="http://schema.org/Event"]',
  name: '[itemprop=name]',
  description: '[itemprop=description]',
  venue: '[itemprop=location] [itemprop=name]',
  address: '[itemprop=address]',
  streetAddress: '[itemprop=streetAddress]',
  addressLocality: '[itemprop=addressLocality]',
  linkContainer: '#itemEvent .functionButtons',
  startDate: '[itemprop=startDate]',
  endDate:  '[itemprop=endDate]',
}
const LINK_EL = document.createElement('a')
const FALLBACK_END_TIME = '23:59:00'

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
}

function dateFromLocationhash () {
  if (!location.hash) {
    return ''
  }
  const hshParams = decodeURIComponent(location.hash.replace('#', ''))
  const match = hshParams.match(/"(\d\d.*)"/)
  if (!match) {
    return ''
  }
  return match[1]
}

function textExtractor (parent) {
  return (selector, firstChild = false) => {
    const el = parent.querySelector(selector)
    if (!el) {
      return ''
    }
    
    if (firstChild) {
      return el.firstChild.nodeValue.trim()
    }
    
    
    if (el.tagName === 'META') {
      return el.content
    }
    
    if (el.tagName === 'TIME') {
      return el.dateTime.replace(' ', 'T')
    }
    
    return el.innerText
  }
}

function endTime (startTimeStr, lengthMinutes = 0) {
  const start = new Date(startTimeStr)
  if (lengthMinutes > 0) {
    const end = new Date(start.getTime() + lengthMinutes * 60000)
    return end.toISOString()
  }
  
  // 0 length given, use fallback time
  return startTimeStr.replace(/T.*$/i, `T${FALLBACK_END_TIME}`)
}

const LENGTH_REGEX = /(Délka|Długość|Length)\s+(\d+)/
function extractLength (parent) {
  const rows = parent.querySelector('.basic_row_info')
  if (!rows) {
    return 0
  }
  
  const rowsText = rows.innerText
  
  const match = rowsText.match(LENGTH_REGEX)
  if (match) {
    return parseInt(match[2], 10)
  }
  return 0
}

function extractData () {
  const parent = document.querySelector(SEL.parent)
  
  if (!parent) {
    return null
  }
  
  const ex = textExtractor(parent)
  
  let dateStart = dateFromLocationhash()
  if (!dateStart) {
    dateStart = ex(SEL.startDate)
  }
  
  let address = ex(SEL.address)
  if (!address) {
    address = `${ex(SEL.streetAddress)}, ${ex(SEL.addressLocality)}`
  }
  
  const length = extractLength(parent)
  let dateEnd = ex(SEL.endDate)
  if (length || !dateEnd) {
    dateEnd = endTime(dateStart, length)
  }
    
  
  let description = ex(SEL.description)
  if (description) {
    description += '\n\n'
  }
  description += location.href
  
  const data = {
    name: ex(SEL.name, true),
    description: description,
    venue: ex(SEL.venue),
    address: address,
    dateStart: dateStart,
    dateEnd: dateEnd,
  }
  
  return data
}

function queryParams(data) {
  return Object.keys(data).map(function(key) {
    return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");
}

function googleCalendarDate(isoDateStr) {
  return isoDateStr.replace(/-|:|\.\d\d\d/g, '').toUpperCase()
}

function googleCalendarUrl(data) {
  const params = {
    action: 'TEMPLATE',
    text: data.name,
    details: data.description,
    sprop: 'name:GoOut',
    dates: `${googleCalendarDate(data.dateStart)}/${googleCalendarDate(data.dateEnd)}`,
    location: `${data.venue}, ${data.address}`,
    pli: 1,
    sfi: 'true'
  }
  
  return `https://www.google.com/calendar/render?${queryParams(params)}`
}

function appendLink (data) {
  const a = LINK_EL
  a.className = 'buttonOval buttonWhite iconfont'
  a.innerText = 'calendar'
  a.target = '_blank'
  a.title = 'Add to Google Calendar'
  a.href = googleCalendarUrl(data)
  
  const parent = document.querySelector(SEL.linkContainer)
  
  if (parent && a.parentElement != parent) {
    parent.prepend(a)
  }
}

function mainHandler () {
  try {
    const data = extractData()
    console.log(data)
    if (data) {
      appendLink(data)
    }  
  } catch (e) {
    console.error(e)
  }
}

const debounceMain = debounce(mainHandler, 500)

// Initial load: when hash is already set
debounceMain()

// On date change (not triggered by pushState)
window.addEventListener('hashchange', debounceMain)

// Monkey-patch pushstate to trigger changes
const pushState = window.history.pushState
window.history.pushState = function pushStateWrapper () {
  debounceMain()
  return pushState.apply(window.history, arguments)
}
