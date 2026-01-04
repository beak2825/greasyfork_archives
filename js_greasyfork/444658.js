// ==UserScript==
// @name         Akinator Progression Visualizer
// @namespace    Hans5958
// @version      1.0.4
// @description  Adds visualization of Akinator's progression (aka. certainity, probability). Inspired by the moving vertical background of the app's old version.
// @author       Hans5958
// @match        https://*.akinator.com/game
// @match        https://*.akinator.com/rapport
// @match        https://*.akinator.com/choice
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444658/Akinator%20Progression%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/444658/Akinator%20Progression%20Visualizer.meta.js
// ==/UserScript==

const generateProgressionReport = () => `${localStorage.getItem('progression')}% in ${localStorage.getItem('step')} steps`

if (document.location.pathname.startsWith('/rapport')) {
	if (!localStorage.getItem('progression') || !localStorage.getItem('step')) return
	document.querySelector('.game-report > table:nth-child(1) > caption:nth-child(1)').innerHTML += `<br>${generateProgressionReport()}`
	return
} else if (document.location.pathname.startsWith('/choice')) {
	if (!localStorage.getItem('progression') || !localStorage.getItem('step')) return

	const bodyObserver = new MutationObserver(() => {
		if (!document.querySelector('.bubble-standard > p:nth-child(2)')) return
		document.querySelector('.bubble-standard > p:nth-child(2)').innerHTML += `<span class="win-subtitle">${generateProgressionReport()}</span>`
		bodyObserver.disconnect()
	})

	bodyObserver.observe(document.body.parentElement, {
		subtree: true,
		childList: true,
	})

	return
}

let lastData = {}
let disconnectTimeout
let sliderElement = document.createElement('div')
const sidebarElement = document.querySelector('div.col-md-2:nth-child(3), div.col-md-2:nth-child(4)')
const questionGameBlockEl = document.querySelector("#questionGameBlock")
localStorage.removeItem('pid')

sliderElement.innerHTML = `<div style="position: absolute; height: 100%; ">
<div style="height: 100%; display: flex; flex-direction: row-reverse; ">
<div style="width: 1rem; border: black solid 0.125rem; z-index: 200; display: flex; flex-direction: column-reverse; height: 100%; z-index: 10; ">
<div id="progression-slider" style="background-color: black; display: flex; height: 0%; transition: height 0.25s ease-in-out; "></div>
<div id="progression-text" style="position: relative; text-align: right; right: 10.5rem; margin-bottom: -1rem; width: 10rem; bottom: 0%;">
<span id="progression-text-checkmark"></span>
<span id="progression-text-percentage">0%</span>
</div>
</div>
</div>
</div>`
sliderElement = sliderElement.firstChild
sidebarElement.parentElement.style.display = "flex"
sidebarElement.innerHTML = ""
sidebarElement.appendChild(sliderElement)
sidebarElement.style.display = "flex"
sidebarElement.style.flexDirection = "row-reverse"

const progressionTextCheckmarkEl = sliderElement.querySelector('#progression-text-checkmark')
const progressionTextPercentageEl = sliderElement.querySelector('#progression-text-percentage')
const progressionSliderEl = sliderElement.querySelector('#progression-slider')

const watchForGameDataChanges = async () => {
	const currentProgression = Number(localStorage.getItem('progression')) || 0
	const currentStep = Number(localStorage.getItem('step')) || 0

	if (currentStep === lastData.step && currentProgression === lastData.progression) return
	// console.info(`Step: ${currentStep}\nProgression: ${currentProgression}%`)

	progressionSliderEl.style.height = currentProgression + "%"
	// sliderElement.querySelector('#progression-text').style.bottom = currentProgression + "%"
	progressionTextPercentageEl.textContent = currentProgression + "%"
	progressionTextCheckmarkEl.textContent = ''

	lastData.step = currentStep
	lastData.progression = currentProgression
	disconnectTimeout = setTimeout(() => questionGameBlockObserver.disconnect(), 2000)
}

const watchForPidChanges = async () => {
	const currentPid = localStorage.getItem('pid')

	if (currentPid === lastData.pid) return
	if (currentPid) progressionTextCheckmarkEl.textContent = '✓'

	lastData.pid = currentPid
	questionGameBlockObserver.disconnect()

}

const questionGameBlockObserver = new MutationObserver(() => {
	watchForGameDataChanges()
	watchForPidChanges()
})

const startListening = () => {
	questionGameBlockObserver.observe(questionGameBlockEl.parentElement, {
		subtree: true,
		childList: true,
	})
}

questionGameBlockEl.parentElement.addEventListener('mouseup', () => {
	startListening()
}, true)
