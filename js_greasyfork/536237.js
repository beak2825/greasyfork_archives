// ==UserScript==
// @name         Joblum Board Auto-Apply
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates applying to frontend web developer jobs on a job board.
// @author       You
// @match        *://ru.joblum.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536237/Joblum%20Board%20Auto-Apply.user.js
// @updateURL https://update.greasyfork.org/scripts/536237/Joblum%20Board%20Auto-Apply.meta.js
// ==/UserScript==

;(function () {
	'use strict'

	// Default settings
	const defaultSettings = {
		positiveKeywords:
			'frontend, front-end, react, nextjs, next.js, javascript, typescript, vue, angular',
		negativeKeywords:
			'native, .NET, Python, Django, PHP, Laravel, mobile, iOS, Android',
		autoStart: false
	}

	// Job stats
	let jobStats = {
		jobsScanned: 0,
		titleMatches: 0,
		descriptionMatches: 0,
		applicationsSubmitted: 0,
		pagesProcessed: 0
	}

	// State
	let processedJobUrls = new Set()
	let currentSearchPageUrl = null
	let isProcessing = false
	let stopRequested = false
	let pageChangeTimer = null

	// Load settings
	function loadSettings() {
		const settings = {
			positiveKeywords: GM_getValue(
				'positiveKeywords',
				defaultSettings.positiveKeywords
			),
			negativeKeywords: GM_getValue(
				'negativeKeywords',
				defaultSettings.negativeKeywords
			),
			autoStart: GM_getValue('autoStart', defaultSettings.autoStart)
		}
		return {
			positiveKeywords: settings.positiveKeywords
				.split(',')
				.map((k) => k.trim().toLowerCase())
				.filter((k) => k),
			negativeKeywords: settings.negativeKeywords
				.split(',')
				.map((k) => k.trim().toLowerCase())
				.filter((k) => k),
			autoStart: settings.autoStart
		}
	}

	// Load saved processed URLs
	function loadProcessedUrls() {
		const savedUrls = GM_getValue('processedJobUrls', '[]')
		try {
			processedJobUrls = new Set(JSON.parse(savedUrls))
		} catch (e) {
			console.error('Error loading processed URLs:', e)
			processedJobUrls = new Set()
		}
	}

	// Save processed URLs
	function saveProcessedUrls() {
		GM_setValue('processedJobUrls', JSON.stringify([...processedJobUrls]))
	}

	let POSITIVE_KEYWORDS = loadSettings().positiveKeywords
	let NEGATIVE_KEYWORDS = loadSettings().negativeKeywords

	// Save settings
	function saveSettings(settings) {
		GM_setValue('positiveKeywords', settings.positiveKeywords)
		GM_setValue('negativeKeywords', settings.negativeKeywords)
		GM_setValue('autoStart', settings.autoStart)
		POSITIVE_KEYWORDS = settings.positiveKeywords
			.split(',')
			.map((k) => k.trim().toLowerCase())
			.filter((k) => k)
		NEGATIVE_KEYWORDS = settings.negativeKeywords
			.split(',')
			.map((k) => k.trim().toLowerCase())
			.filter((k) => k)
	}

	// Save stats
	function saveStats() {
		GM_setValue('jobStats', JSON.stringify(jobStats))
	}

	// Load stats
	function loadStats() {
		const savedStats = GM_getValue('jobStats', null)
		if (savedStats) {
			jobStats = JSON.parse(savedStats)
		}
	}

	// Utility to check if text matches criteria
	function matchesCriteria(text) {
		if (!text) return false
		const lowerText = text.toLowerCase()
		const hasPositive = POSITIVE_KEYWORDS.some((keyword) =>
			lowerText.includes(keyword)
		)
		const hasNegative = NEGATIVE_KEYWORDS.some((keyword) =>
			lowerText.includes(keyword)
		)
		return hasPositive && !hasNegative
	}

	// Utility to wait for an element
	async function waitForElement(selector, timeout = 10000) {
		const start = Date.now()
		while (Date.now() - start < timeout) {
			const element = document.querySelector(selector)
			if (element) return element
			await new Promise((resolve) => setTimeout(resolve, 100))
		}
		console.log(`Element not found after timeout: ${selector}`)
		return null
	}

	// Utility to wait for a condition
	async function waitForCondition(condition, timeout = 10000) {
		const start = Date.now()
		while (Date.now() - start < timeout) {
			if (condition()) return true
			if (stopRequested) return false
			await new Promise((resolve) => setTimeout(resolve, 100))
		}
		console.log(`Condition not met after timeout`)
		return false
	}

	// Prevent links from opening in new tabs
	function preventNewTabs() {
		document.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
			anchor.removeAttribute('target')
		})
	}

	// Check if URL is a search results page
	function isSearchResultsPage() {
		return !!document.querySelector('.content-card.card-has-jobs')
	}

	// Check if URL is a job details page
	function isJobDetailsPage() {
		return !!(
			document.querySelector('h1.job-title') &&
			document.querySelector('span[itemprop="description"]')
		)
	}

	// Check if URL is an application form page
	function isApplicationFormPage() {
		return !!document.querySelector('form#w1')
	}

	// Determine current page type and start appropriate process
	async function determinePage() {
		if (stopRequested) return

		if (isSearchResultsPage()) {
			console.log('Detected search results page')
			await processSearchResults()
		} else if (isJobDetailsPage()) {
			console.log('Detected job details page')
			await processJobDetails(currentSearchPageUrl)
		} else if (isApplicationFormPage()) {
			console.log('Detected application form page')
			await processApplicationForm(currentSearchPageUrl)
		} else {
			console.log('Not on a recognized job board page')
			showNotification('Not on a job board page.', 'warning')
			isProcessing = false
			updateUI()
		}
	}

	// Utility to delay execution
	async function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
	// Process search results page
	async function processSearchResults() {
		if (stopRequested) return

		preventNewTabs()
		currentSearchPageUrl = window.location.href
		console.log('Processing search page:', currentSearchPageUrl)
		GM_setValue('lastSearchPage', currentSearchPageUrl)

		// Wait 10 seconds for translation
		console.log('Waiting 10 seconds for page translation...')
		await delay(10000) // 10-second delay

		const jobWrappers = document.querySelectorAll('.result-wrp.row')
		console.log(`Found ${jobWrappers.length} job wrappers`)

		const jobs = []
		jobStats.pagesProcessed++
		saveStats()
		updateUI()

		for (const wrapper of jobWrappers) {
			if (stopRequested) return

			jobStats.jobsScanned++

			const titleElement = wrapper.querySelector('.job-title a')
			if (titleElement) {
				const title = titleElement?.title || titleElement.textContent || ''
				const link = titleElement.href

				if (matchesCriteria(title)) {
					jobStats.titleMatches++
					if (!processedJobUrls.has(link)) {
						console.log(`Found matching job: ${title}`)
						jobs.push({ link, title })
					} else {
						console.log(`Skipping already processed job: ${title}`)
					}
				}
			}

			saveStats()
			updateUI()
		}

		if (jobs.length === 0) {
			console.log('No matching jobs found on this page, trying next page')
			await goToNextPage()
			return
		}

		console.log(`Found ${jobs.length} matching jobs to process`)
		await processNextJob(jobs, 0)
	}

	// Process jobs one by one
	async function processNextJob(jobs, index) {
		if (stopRequested || index >= jobs.length) {
			// If we've processed all jobs, go to next page
			if (!stopRequested && index >= jobs.length) {
				await goToNextPage()
			}
			return
		}

		const job = jobs[index]
		console.log(`Processing job ${index + 1}/${jobs.length}: ${job.title}`)

		// Mark as processed to avoid duplicates
		processedJobUrls.add(job.link)
		saveProcessedUrls()

		// Navigate to job details
		console.log(`Navigating to: ${job.link}`)
		window.location.href = job.link
	}

	// Process job details page
	async function processJobDetails(returnUrl) {
		if (stopRequested) return

		console.log('Processing job details page')
		preventNewTabs()

		const titleElement = await waitForElement('h1.job-title')
		const descriptionElement = await waitForElement(
			'span[itemprop="description"]'
		)

		if (!titleElement || !descriptionElement) {
			console.error('Job title or description not found')
			returnToSearchPage(returnUrl)
			return
		}

		const jobDetails = {
			title: titleElement.textContent || '',
			description: descriptionElement.textContent || ''
		}

		if (
			matchesCriteria(jobDetails.title) &&
			matchesCriteria(jobDetails.description)
		) {
			jobStats.descriptionMatches++
			saveStats()
			updateUI()

			console.log('Job matches criteria, attempting to apply')

			const respondButton = await waitForElement('.btn.btn-apply.btn-warning')
			if (respondButton) {
				respondButton.removeAttribute('target')
				respondButton.click()
			} else {
				console.error('Respond button not found')
				returnToSearchPage(returnUrl)
			}
		} else {
			console.log('Job does not match full criteria')
			returnToSearchPage(returnUrl)
		}
	}

	// Process application form page
	async function processApplicationForm(returnUrl) {
		if (stopRequested) return

		console.log('Processing application form')

		const submitButton = await waitForElement(
			'button.btn.btn-primary[type="submit"]'
		)
		if (submitButton) {
			submitButton.click()

			jobStats.applicationsSubmitted++
			saveStats()
			updateUI()

			console.log('Application submitted successfully')
			showNotification('Application submitted!', 'success')

			// Wait for application submission to complete
			await waitForCondition(
				() => !window.location.href.includes('/candidate/apply'),
				10000
			)
			returnToSearchPage(returnUrl)
		} else {
			console.error('Submit button not found')
			showNotification('Failed to submit application.', 'error')
			returnToSearchPage(returnUrl)
		}
	}

	// Helper function to return to search page and continue processing
	function returnToSearchPage(returnUrl) {
		const lastSearchPage = GM_getValue('lastSearchPage', null)
		if (returnUrl) {
			console.log(`Returning to search page: ${returnUrl}`)
			window.location.href = returnUrl
		} else if (lastSearchPage) {
			console.log(`Returning to last known search page: ${lastSearchPage}`)
			window.location.href = lastSearchPage
		} else {
			console.error('No return URL provided and no last search page saved')
			isProcessing = false
			updateUI()
		}
	}

	// Navigate to next page
	async function goToNextPage() {
		if (stopRequested) return

		console.log('Looking for next page')

		const nextLink = document.querySelector('.pagination .next a')
		if (nextLink) {
			console.log('Found next page link, clicking...')
			nextLink.click()
		} else {
			console.log('No more pages to process')
			stopRequested = true
			isProcessing = false
			updateUI()
			showNotification('No more pages to process. Process complete!', 'info')
		}
	}

	// Monitor for page changes to automatically continue workflow
	function setupPageChangeMonitor() {
		let lastUrl = window.location.href

		// Clear any existing timer
		if (pageChangeTimer) {
			clearInterval(pageChangeTimer)
		}

		pageChangeTimer = setInterval(() => {
			if (window.location.href !== lastUrl) {
				console.log(`Page changed from ${lastUrl} to ${window.location.href}`)
				lastUrl = window.location.href

				// If we're still processing, determine the current page and continue
				if (isProcessing && !stopRequested) {
					// Give the page a moment to load
					setTimeout(() => determinePage(), 1000)
				}
			}
		}, 500)
	}

	// Main function
	async function main() {
		if (isProcessing) {
			console.log('Already processing, ignoring start request')
			return
		}

		isProcessing = true
		stopRequested = false
		updateUI()
		showNotification('Workflow started.', 'success')

		// Load saved processed URLs
		loadProcessedUrls()

		try {
			// Set up page change monitoring
			setupPageChangeMonitor()

			// Start processing the current page
			await determinePage()
		} catch (error) {
			console.error('Error in main function:', error)
			showNotification('An error occurred: ' + error.message, 'error')
			isProcessing = false
			updateUI()
		}
	}

	// Reset function
	function resetStats() {
		jobStats = {
			jobsScanned: 0,
			titleMatches: 0,
			descriptionMatches: 0,
			applicationsSubmitted: 0,
			pagesProcessed: 0
		}
		saveStats()
		updateUI()
		showNotification('Statistics reset.', 'info')
	}

	// Reset processed jobs
	function resetProcessedJobs() {
		processedJobUrls = new Set()
		saveProcessedUrls()
		showNotification('Processed jobs list cleared.', 'info')
	}

	// Stop processing
	function stop() {
		stopRequested = true
		isProcessing = false
		if (pageChangeTimer) {
			clearInterval(pageChangeTimer)
			pageChangeTimer = null
		}
		updateUI()
		showNotification('Workflow stopped.', 'info')
	}

	// Notification system
	function showNotification(message, type) {
		const existing = document.querySelector('.job-auto-apply-notification')
		if (existing) existing.remove()

		const notification = document.createElement('div')
		notification.className = `job-auto-apply-notification notification-${type}`
		notification.textContent = message
		Object.assign(notification.style, {
			position: 'fixed',
			top: '10px',
			left: '50%',
			transform: 'translateX(-50%)',
			padding: '10px 20px',
			borderRadius: '4px',
			zIndex: '1000',
			color: 'white'
		})

		switch (type) {
			case 'success':
				notification.style.backgroundColor = '#4CAF50'
				break
			case 'error':
				notification.style.backgroundColor = '#F44336'
				break
			case 'warning':
				notification.style.backgroundColor = '#FF9800'
				break
			case 'info':
				notification.style.backgroundColor = '#2196F3'
				break
		}

		document.body.appendChild(notification)
		setTimeout(() => notification.remove(), 3000)
	}

	// UI Creation
	function createUI() {
		GM_addStyle(`
            .job-auto-apply-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 350px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                font-family: 'Segoe UI', Arial, sans-serif;
                padding: 15px;
            }
            .job-auto-apply-panel h1 {
                font-size: 18px;
                margin: 0 0 10px;
                color: #333;
            }
            .status-container {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding: 10px;
                background: #f9f9f9;
                border-radius: 4px;
            }
            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 5px;
            }
            .status-active { background: #4caf50; }
            .status-inactive { background: #f44336; }
            .button-container {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            .job-auto-apply-panel button {
                flex: 1;
                padding: 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: background 0.2s;
            }
            .job-auto-apply-panel button:hover { opacity: 0.9; }
            .job-auto-apply-panel button:active { transform: translateY(1px); }
            #startButton { background: #4caf50; color: white; }
            #stopButton { background: #f44336; color: white; }
            #settingsButton { background: #2196f3; color: white; }
            .stats-container {
                background: #f9f9f9;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 15px;
            }
            .stats-title {
                font-weight: 600;
                margin-bottom: 8px;
            }
            .stat-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            .stat-value { font-weight: 600; }
            .settings-panel {
                display: none;
                margin-top: 15px;
            }
            .settings-panel textarea {
                width: 100%;
                height: 80px;
                margin-bottom: 10px;
                border-radius: 4px;
                border: 1px solid #ddd;
                padding: 5px;
            }
            .settings-panel label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            .auto-start-checkbox {
                margin: 10px 0;
            }
            .advanced-container {
                margin-top: 10px;
            }
            .advanced-button-container {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            #resetStatsButton { background: #ff9800; color: white; }
            #resetJobsButton { background: #9c27b0; color: white; }
        `)

		const panel = document.createElement('div')
		panel.className = 'job-auto-apply-panel'
		panel.innerHTML = `
            <h1>Job Application Assistant</h1>
            <div class="status-container">
                <div id="statusIndicator" class="status-indicator status-inactive"></div>
                <div id="statusText">Workflow is not running</div>
            </div>
            <div class="button-container">
                <button id="startButton">Start</button>
                <button id="stopButton">Stop</button>
                <button id="settingsButton">Settings</button>
            </div>
            <div class="stats-container">
                <div class="stats-title">Statistics</div>
                <div class="stat-item"><div>Jobs Scanned:</div><div id="jobsScanned" class="stat-value">0</div></div>
                <div class="stat-item"><div>Title Matches:</div><div id="titleMatches" class="stat-value">0</div></div>
                <div class="stat-item"><div>Description Matches:</div><div id="descriptionMatches" class="stat-value">0</div></div>
                <div class="stat-item"><div>Applications Submitted:</div><div id="applicationsSubmitted" class="stat-value">0</div></div>
                <div class="stat-item"><div>Pages Processed:</div><div id="pagesProcessed" class="stat-value">0</div></div>
            </div>
            <div class="advanced-container">
                <div class="advanced-button-container">
                    <button id="resetStatsButton">Reset Stats</button>
                    <button id="resetJobsButton">Clear Job History</button>
                </div>
            </div>
            <div class="settings-panel" id="settingsPanel">
                <label for="positiveKeywords">Positive Keywords:</label>
                <textarea id="positiveKeywords"></textarea>
                <label for="negativeKeywords">Negative Keywords:</label>
                <textarea id="negativeKeywords"></textarea>
                <div class="auto-start-checkbox">
                    <input type="checkbox" id="autoStart"> <label for="autoStart">Auto-start on page load</label>
                </div>
                <div class="button-container">
                    <button id="saveSettings">Save</button>
                    <button id="cancelSettings">Cancel</button>
                </div>
            </div>
        `
		document.body.appendChild(panel)

		// Event listeners
		document
			?.getElementById('startButton')
			?.addEventListener('click', () => main())
		document
			?.getElementById('stopButton')
			?.addEventListener('click', () => stop())
		document
			?.getElementById('resetStatsButton')
			?.addEventListener('click', () => resetStats())
		document
			?.getElementById('resetJobsButton')
			?.addEventListener('click', () => resetProcessedJobs())
		document
			?.getElementById('settingsButton')
			?.addEventListener('click', () => {
				const settingsPanel = document.getElementById('settingsPanel')
				settingsPanel.style.display =
					settingsPanel?.style.display === 'block' ? 'none' : 'block'
				if (settingsPanel?.style.display === 'block') {
					document.getElementById('positiveKeywords').value = GM_getValue(
						'positiveKeywords',
						defaultSettings.positiveKeywords
					)
					document.getElementById('negativeKeywords').value = GM_getValue(
						'negativeKeywords',
						defaultSettings.negativeKeywords
					)
					document.getElementById('autoStart').checked = GM_getValue(
						'autoStart',
						defaultSettings.autoStart
					)
				}
			})
		document.getElementById('saveSettings')?.addEventListener('click', () => {
			const settings = {
				positiveKeywords: document
					.getElementById('positiveKeywords')
					?.value.trim(),
				negativeKeywords: document
					.getElementById('negativeKeywords')
					?.value.trim(),
				autoStart: document.getElementById('autoStart')?.checked
			}
			if (!settings.positiveKeywords) {
				showNotification(
					'Please enter at least one positive keyword.',
					'warning'
				)
				return
			}
			saveSettings(settings)
			document.getElementById('settingsPanel').style.display = 'none'
			showNotification('Settings saved!', 'success')
		})
		document.getElementById('cancelSettings')?.addEventListener('click', () => {
			document.getElementById('settingsPanel').style.display = 'none'
		})
	}

	// Update UI
	function updateUI() {
		document.getElementById('statusIndicator').className = `status-indicator ${
			isProcessing ? 'status-active' : 'status-inactive'
		}`
		document.getElementById('statusText').textContent = isProcessing
			? 'Workflow is running'
			: 'Workflow is not running'
		document.getElementById('jobsScanned').textContent = jobStats.jobsScanned
		document.getElementById('titleMatches').textContent = jobStats.titleMatches
		document.getElementById('descriptionMatches').textContent =
			jobStats.descriptionMatches
		document.getElementById('applicationsSubmitted').textContent =
			jobStats.applicationsSubmitted
		document.getElementById('pagesProcessed').textContent =
			jobStats.pagesProcessed
	}

	// Initialize
	function initialize() {
		loadStats()
		loadProcessedUrls()
		createUI()
		updateUI()
		setupPageChangeMonitor()

		const settings = loadSettings()
		if (settings.autoStart && !isProcessing) {
			// Small delay to ensure page is fully loaded
			setTimeout(() => main(), 1500)
		}
	}

	initialize()
})()
