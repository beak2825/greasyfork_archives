// ==UserScript==
// @name         YouTube Mousemove Volume Control
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Drag the mouse's middle button to set volume according to where the cursor is along the width of the video.
// @author       Rasutei
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/448821/YouTube%20Mousemove%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/448821/YouTube%20Mousemove%20Volume%20Control.meta.js
// ==/UserScript==
/* eslint-disable curly */

// ----- Utility stuff -----
var $ = window.jQuery;
const logcss = `
	font-family: Hack, monospace;
	text-shadow: 0 0 10px black, 0 0 10px black;
	background: linear-gradient(to right, #4d94ff 0%, #4d94ff 8px, rgb(77 148 255 / 30%) 8px, transparent 50px);
	color: #4d94ff;
	padding: 2px 0 2px 30px;
	`
const warncss = `
	font-family: Hack, monospace;
	text-shadow: 0 0 10px black, 0 0 10px black;
	background: linear-gradient(to right, #ffa621 0%, #ffa621 0% 8px, rgb(255 166 33 / 30%) 8px, transparent 50px);
	color: #ffa621;
	padding: 2px 0 2px 30px;
	`
const log = (e) => console.log('%c'+e, logcss)
const warn = (e) => console.log('%c'+e, warncss)
const warn_element = (e) => console.log('%c%o', warncss, e)

// ----- Variables and elements -----
const spn = $('<span id="ras-volumebar-text">')
	.css('color','black')
	.css('font-size','17px')
	.css('font-family','Hack')
const fill = $('<div id="ras-volumebar-fill">')
	.append(spn)
	.css('position','relative')
	.css('left','0')
	.css('top','0')
	.css('height','100%')
	.css('transition','width 50ms ease')
	.css('background-color','white')
	.css('display','flex')
	.css('align-items','center')
	.css('justify-content','center')
	.css('overflow','hidden')
	.css('padding','0 4px')
const bar = $('<div id="ras-volumebar">')
	.append(fill)
	.css('position','absolute')
	.css('top','50%')
	.css('left','50%')
	.css('transform','translate(-50%, -50%)')
	.css('width','300px')
	.css('height','20px')
	.css('border','3px solid black')
	.css('outline','1px solid white')
	.css('background-color','rgb(0 0 0 / 50%)')
	.fadeToggle(0)
const wrapper = $('<div id="ras-vidwrapper">')
	.append(bar)
	.css('position','relative')
	.css('margin','auto')
let vid
let isMDown = false
let isSetVolume = false
let hasMouseMoved = false
let rect

// ----- Actual code -----
$(document).ready(function(){
	log('RDrag Volume: Applying script...')

	// ----- Importing a nice font I've been enjoying as of late -----
	let hackfont = document.createElement('link')
	hackfont.setAttribute('rel','stylesheet')
	hackfont.setAttribute('type','text/css')
	hackfont.setAttribute('href','//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css')

	// ----- Loop to check if page has a video -----
	let prev_url = window.location.href
	setInterval(() => {
		if (document.querySelector('#ras-vidwrapper'))
			return
		if (window.location.href != prev_url)
			prev_url = window.location.href
		if (window.location.href.includes('/watch?v=')) {

			// ----- Attach nice font -----
			document.head.appendChild(hackfont)

			// ----- Find video element -----
			vid = $('video.video-stream')

			// ----- Attach utility to video element -----
			vid[0].parentElement.append(wrapper[0])

			// ----- Apply video's size to wrapper element -----
			new ResizeObserver(() => {
				wrapper.css('width',vid.css('width'))
				wrapper.css('height',vid.css('height'))
			}).observe(vid[0])

			// ----- Getting wrapper's rect -----
			rect = wrapper[0].getBoundingClientRect()

			log('RDrag Volume: Script applied.')
		}
	}, 100)

	// ----- Mouse event handling -----
	rect = wrapper[0].getBoundingClientRect()
	wrapper.mousedown((evemt) => {
		let interval
		if (event.which == 2){
			event.preventDefault()
			event.stopPropagation()
			isSetVolume = true
			rect = wrapper[0].getBoundingClientRect()
			bar.fadeIn(100)
			SetVolume(event)
			interval = setInterval(() => {
				if (!document.hasFocus()){
					StopSetting()
					clearInterval(interval)
				}
			}, 32)
		}
	})
	wrapper.mouseup((event) => {
		if (!event.which == 3) return
		StopSetting()
	})
	wrapper.mouseleave((event) => {
		StopSetting()
	})
	wrapper.mousemove((event) => {
		if (!isSetVolume) return
		SetVolume(event)
	})
	window.blur(() => {
		warn('Blurred')
		StopSetting()
	})
})

// ----- Auxiliary functions to prevent repeats -----
function StopSetting(){
	//warn('StopSetting')
	isSetVolume = false
	bar.delay(300).fadeOut(100)
}
function SetVolume(event){
	//warn('SetVolume')
	let vol = (event.clientX - rect.left) / rect.width
	let per = (vol*100).toFixed(1)+'%'
	vid[0].volume = vol
	spn.text(per)
	fill.css('width', per)
}