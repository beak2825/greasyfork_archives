// ==UserScript==
// @name          jira, quality of life extension (discontinued, check info)
// @description   out of the box only adds a button right side of the nav bar, which opens the settings to turn on/off features
// @description   currently doesn't fully support loading a ticket page via AJAX instead of a full page load
// @version       4.5
// @author        Tobias L
// @include       */jira.*
// @include       */jira/*
// @include       *.jira.*
// @run-at        document-start
// @license       GPL-3.0-only
// @namespace     https://github.com/WhiteG00se/User-Scripts
// @downloadURL https://update.greasyfork.org/scripts/445345/jira%2C%20quality%20of%20life%20extension%20%28discontinued%2C%20check%20info%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445345/jira%2C%20quality%20of%20life%20extension%20%28discontinued%2C%20check%20info%29.meta.js
// ==/UserScript==

runCodeForPagetype(getPageType())

function runCodeForPagetype(pageType) {
	if (pageType != 'plugin') modalCode()
	else return
	switch (pageType) {
		case 'dashboard':
			dashboardPageCode()
			break
		case 'ticket':
			ticketPageCode()
			break
	}
}
function getPageType() {
	let URL = window.location.href
	let pageType = 'default'
	if (getDebugMode()) console.log(URL)
	if (URL.toLowerCase().includes('/dashboard.jspa')) {
		pageType = 'dashboard'
	} else if (URL.toLowerCase().includes('/browse')) {
		pageType = 'ticket'
	} else if (URL.toLowerCase().includes('/plugins')) {
		pageType = 'plugin'
	}
	if (getDebugMode()) console.log(`the page type is: ${pageType}`)
	return pageType
}
function modalCode() {
	document.addEventListener('DOMContentLoaded', function () {
		loadModalButton()
		loadModal()
		localStorageToModal()
		submitModal()
	})
	function loadModalButton() {
		//load ex_modalButton into nav bar + add event listener to open the modal
		let ex_modalButton = `
<button id="ex_modalButton">
	<h3>&#9889</h3>
</button>`
		document.querySelector('#quicksearch-menu').insertAdjacentHTML('afterend', ex_modalButton)
		document.querySelector('#ex_modalButton').addEventListener('click', function () {
			document.querySelector('#ex_modal').style.display = 'block'
			document.querySelector('.aui-blanket').removeAttribute('hidden')
		})
	}
	function loadModal() {
		//load ex_modal into page with "display: none"
		let modal = `
<span id="ex_modal" style="display: none">
	<section class="aui-layer aui-dialog2 aui-dialog2-large" open="" style="z-index: 3000;" tabindex="-1">
		<header class="aui-dialog2-header">
			<h2 class="aui-dialog2-header-main">quality of life extension</h2>
		</header>
		<div class="aui-dialog2-content">
			<form id="ex_form">
				<h2>dashboard settings</h2>
				<table>
					<tr>
						<td>
							refresh the page <abbr
								title='does not refresh while "Create Issue" dialoge or this extension menu is open'> every x
								minutes</abbr> (0 to disable)
						</td>
						<td>
							<select class="ex_modalValue" id="ex_refreshDashboardInterval">
								<option value="0">0</option>
								<option value="60">1</option>
								<option value="120">2</option>
								<option value="180">3</option>
								<option value="240">4</option>
								<option value="300">5</option>
								<option value="360">6</option>
								<option value="420">7</option>
								<option value="480">8</option>
								<option value="540">9</option>
								<option value="600">10</option>
								<option value="660">11</option>
								<option value="720">12</option>
								<option value="780">13</option>
								<option value="840">14</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>
							remove sidebar?
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_removeSidebar">
						</td>
					</tr>
				</table>
				<hr>
				<h2>ticket page settings</h2>
				<table>
					<tr>
						<td>
							load all comments after loading the page
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_shouldLoadAllCommentsAfterPageLoad">
						</td>
					</tr>
					<tr>
						<td>
							collapse all comments after loading the page
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_shouldCollapseCommentsAfterPageLoad">
						</td>
					</tr>
					<tr>
						<td>
							show buttons to expand/collapse all comments at once
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_showExpandCollapseButtons">
						</td>
					</tr>
					<tr>
						<td>
							default comment order
						</td>
						<td>
							<select class="ex_modalValue" id="ex_selectCommentOrder">
								<option value="newestFirst">newest first</option>
								<option value="oldestFirst">oldest first</option>
								<option value="jiraDefault">jira default</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>
							collapse modules after loading the page, <abbr
								title="example (case sensitive): 'Description, Attachments, Issue Links, Test Coverage, Agile'">
								help?</abbr>
						</td>
						<td>
							<!-- jira causes problems with type="text" -->
							<input type="definitely_not_text" class="ex_modalValue"
								id="ex_whatModulesToCollapseDuringPageLoad">
						</td>
					</tr>
				</table>
				<hr>
				<h2>dev settings</h2>
				<table>
					<tr>
						<td>
							console logs for debugging
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_debugMode">
						</td>
				</table>
			</form>
		</div>
		<footer class="aui-dialog2-footer">
			<div class="aui-dialog2-footer-actions">
				<button id="ex_modal-submit-button" class="aui-button aui-button-primary" resolved="">Submit</button>
				<button id="ex_modal-cancel-button" class="aui-button aui-button-link" resolved="">Cancel</button>
			</div>
			<div class="aui-dialog2-footer-hint">Made by Tobias L</div>
		</footer>
	</section>
</span>
<div aria-hidden="true" class="aui-blanket" tabindex="0" hidden=""></div>
`
		try {
			document.querySelector('body').insertAdjacentHTML('beforeend', modal)
			//add event listener to cancel button
			document.querySelector('#ex_modal-cancel-button').addEventListener('click', function () {
				document.querySelector('#ex_modal').style.display = 'none'
				document.querySelector('.aui-blanket').setAttribute('hidden', '')
			})
			if (getDebugMode()) console.log('ex_modal was loaded')
		} catch (e) {}
	}
	function localStorageToModal() {
		//load values for class ex_modalCheckbox
		document.querySelectorAll('.ex_modalCheckbox').forEach(function (element) {
			if (localStorage.getItem(element.id) == 'true') {
				element.checked = true
			} else {
				element.checked = false
			}
		})
		//load values for class ex_modalValue
		document.querySelectorAll('.ex_modalValue').forEach(function (element) {
			element.value = localStorage.getItem(element.id)
		})
	}
	function submitModal() {
		//add event listener to submit button
		document.querySelector('#ex_modal-submit-button').addEventListener('click', function () {
			//set all values with class "ex_modalCheckbox" to localStorage
			document.querySelectorAll('.ex_modalCheckbox').forEach(function (element) {
				localStorage.setItem(element.id, element.checked)
			})
			//set all values with class "ex_modalValue" to localStorage
			document.querySelectorAll('.ex_modalValue').forEach(function (element) {
				localStorage.setItem(element.id, element.value)
			})
			location.reload() //reload page to apply changes
		})
		//disable default form submit behavior
		document.querySelector('#ex_form').addEventListener('submit', function (event) {
			event.preventDefault()
		})
	}
}
function dashboardPageCode() {
	//add event listener when readystate is interactive
	document.addEventListener('readystatechange', function () {
		if (document.readyState == 'interactive') {
			removeSidebar()
		}
	})
	document.addEventListener('DOMContentLoaded', function () {
		refreshDashboard()
	})
	function removeSidebar() {
		if (localStorage.getItem('ex_removeSidebar') != 'true') return //check localStorage
		document.querySelector('#dashboard .dashboard-tabs').remove()
		if (getDebugMode()) console.log('Sidebar removed')
	}
	function refreshDashboard() {
		const interval = localStorage.getItem('ex_refreshDashboardInterval')
		if (interval == null || interval == '0') return // check localStorage
		setInterval(function () {
			// check if there is an element with id "create-issue-dialog" AND if "ex_modal" is visible AND if pageType is "dashboard"
			if (
				document.querySelector('#create-issue-dialog') == null &&
				document.querySelector('#ex_modal').style.display == 'none' &&
				getPageType() == 'dashboard'
			) {
				location.reload()
			} else {
				if (getDebugMode()) console.log('did not refresh because "Create Issue" or "ex_modal" dialog is open')
			}
		}, interval * 1000)
		// log to console if debug mode is enabled
		if (getDebugMode()) console.log('Refreshing dashboard every ' + interval + ' seconds')
	}
}
function ticketPageCode() {
	document.addEventListener('DOMContentLoaded', function () {
		loadAllCommentsAfterPageLoad()
		commentOrder()
		loadExpandCollapseButtons()
		keepRestoringUI()
		collapseCommentsAfterPageLoad()
		collapseModules()
	})
	function loadAllCommentsAfterPageLoad() {
		if (localStorage.getItem('ex_shouldLoadAllCommentsAfterPageLoad') != 'true') return //check localStorage
		const clickHere = document.getElementsByClassName('collapsed-comments')[0]
		if (clickHere == null) return //guard clause
		clickHere.click()
	}
	function commentOrder() {
		let ex_orderButton
		switch (localStorage.getItem('ex_selectCommentOrder')) {
			case 'newestFirst':
				ex_orderButton = document.querySelector('#activitymodule .issue-activity-sort-link .aui-iconfont-up')
				if (ex_orderButton == null) return //guard clause
				ex_orderButton.click()
				break
			case 'oldestFirst':
				ex_orderButton = document.querySelector('#activitymodule .issue-activity-sort-link .aui-iconfont-down')
				if (ex_orderButton == null) return //guard clause
				ex_orderButton.click()
				break
		}
	}
	function loadExpandCollapseButtons() {
		if (localStorage.getItem('ex_showExpandCollapseButtons') != 'true') return //check localStorage
		if (document.querySelector('#ex_expandCollapseButtons') != null) return //guard clause
		let ex_expandCollapseButtons = `
<span id="ex_expandCollapseButtons">
	<button id="expandComments">expand all</button>
	<button id="collapseComments">collapse all</button>
</span>
`
		document.querySelector('#activitymodule_heading h4').insertAdjacentHTML('afterend', ex_expandCollapseButtons)
		document.querySelector('#collapseComments').addEventListener('click', collapseComments)
		document.querySelector('#expandComments').addEventListener('click', expandComments)
	}
	function keepRestoringUI() {
		const monitoredNode = document.querySelector('body')
		const ex_mutationObserver = new MutationObserver((entries) => {
			if (getDebugMode()) {
				console.log('childList of body changed ')
			}
			loadExpandCollapseButtons()
		})
		ex_mutationObserver.observe(monitoredNode, { childList: true, subtree: true })
	}
	function collapseCommentsAfterPageLoad() {
		if (localStorage.getItem('ex_shouldCollapseCommentsAfterPageLoad') != 'true') return //check localStorage
		//prevent collapsing comments before they are loaded if ex_shouldLoadAllCommentsAfterPageLoad is enabled
		if (localStorage.getItem('ex_shouldLoadAllCommentsAfterPageLoad') == 'true') {
			setTimeout(collapseComments, 200)
		} else {
			collapseComments()
		}
	}
	function collapseComments() {
		document.querySelectorAll('.twixi-block').forEach(function (currentValue) {
			currentValue.classList.remove('expanded')
			currentValue.classList.add('collapsed')
		})
	}
	function expandComments() {
		document.querySelectorAll('.twixi-block').forEach(function (currentValue) {
			currentValue.classList.remove('collapsed')
			currentValue.classList.add('expanded')
		})
	}
	function collapseModules() {
		//split input into an array and trim all of the elements
		let input = localStorage.getItem('ex_whatModulesToCollapseDuringPageLoad')
		if (input == null || input == '') return //check localStorage
		let modulesToCollapse = input.split(',')
		modulesToCollapse.forEach(function (element, index) {
			modulesToCollapse[index] = element.trim()
		})
		if (getDebugMode()) {
			console.log('modules to collapse:')
			console.log(modulesToCollapse)
		}
		// forEach modulesToCollapse find element with button[aria-label=currentValue]
		// there are two attachments modules, one of them is useless, so we need to use querySelectorAll and work with arrays
		modulesToCollapse.forEach(function (currentValue) {
			let moduleButton = document.querySelectorAll("button[aria-label='" + currentValue + "']")
			if (moduleButton.length == 0) return //guard clause
			//change aria-expanded of moduleButton to false
			moduleButton.forEach(function (currentValue) {
				currentValue.setAttribute('aria-expanded', 'false')

				//check parents of moduleButton until you find moduleContainer with class "module"

				let moduleContainer = currentValue.parentElement
				//while moduleButton doesn't have either of these classes "collapsed" or "expanded" check next parent
				while (!moduleContainer.classList.contains('module')) {
					if (moduleContainer.tagName == 'BODY') {
						if (getDebugMode()) console.warn('returning out of while loop because moduleContainer is the html body tag')
						return
					} else moduleContainer = moduleContainer.parentElement
				}
				// remove class "expanded" and add "collapsed" from moduleContainer
				moduleContainer.classList.remove('expanded')
				moduleContainer.classList.add('collapsed')
				if (getDebugMode()) console.log(`${currentValue} moduleButton & moduleContainer found, module collapsed`)
			})
		})
	}
}
function getDebugMode() {
	if (localStorage.getItem('ex_debugMode') == 'true') {
		return true
	} else {
		return false
	}
}
