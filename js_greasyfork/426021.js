// ==UserScript==
// @name            YouTube: iCal Calendar Export for Livestreams and Premieres
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/293fe8e9c3afdf50fe1db5be9346ac5a/raw/
// @version         0.7.4
// @description     Adds a "Export to iCal" button to to YouTube Livestreams and Premieres which creates Calendar-compatible .ics files.
// @author          sidneys
// @icon            https://www.youtube.com/favicon.ico
// @noframes
// @match           http*://www.youtube.com/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/374849-library-onelementready-es7/code/Library%20%7C%20onElementReady%20ES7.js
// @require         https://cdn.jsdelivr.net/npm/moment@2.29.3/moment.min.js
// @require         https://cdn.jsdelivr.net/npm/file-saver@2.0.5/src/FileSaver.js
// @require         https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuidv4.min.js
// @require         https://gitcdn.link/cdn/jamesbrond/ics.js/0b27e3cca5670758b63e880de9e49207d1f12290/ics.js
// @run-at          document-start
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/426021/YouTube%3A%20iCal%20Calendar%20Export%20for%20Livestreams%20and%20Premieres.user.js
// @updateURL https://update.greasyfork.org/scripts/426021/YouTube%3A%20iCal%20Calendar%20Export%20for%20Livestreams%20and%20Premieres.meta.js
// ==/UserScript==


/**
 * ESLint
 * @global
 */
/* global Debug, onElementReady, uuidv4, ics */
Debug = false


/**
 * API Credentials
 * @default
 * @constant
 */
const apiKey = 'AIzaSyAxkkQLcQcshBDog7ev3jvjZmsjdDycgsQ'

/**
 * API URL
 * @constant
 */
const apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3'
const apiEndpoint = '/videos'
const apiBaseQuery = `part=snippet,liveStreamingDetails&key=${apiKey}`


/**
 * Applicable URL paths
 * @default
 * @constant
 */
const urlPathList = [
    '/channel',
    '/watch'
]

/**
 * Local Filename of iCalendar entry
 * @constant
 */
const fileNameBase = 'youtube-calendar-event-'
const fileExtension = 'ics'


/**
 * Create iCal Calendar Event
 * @param {String} subject - Subject/Title
 * @param {String} description - Description
 * @param {String} location - Location
 * @param {String} begin - Beginning date
 * @param {String} end - Ending date
 * @param {Object=} rrule - Recurrence rule
 * @param {String=} filename - Local iCalendar File Name
 * @param {String=} extension - Local iCalendar File Extension
 */
let createCalendarEvent = (subject, description, location, begin, end, filename, extension = fileExtension) => {
    console.debug('createCalendarEvent')

    // Create iCal entry
    const icalEntry = new ics(uuidv4(), 'Calendar')

    // Add calendar event
    // icalEntry.addEvent(subject, description, location, begin, end, rrule, url)
    icalEntry.addEvent(subject, description, location, false, begin, end)

    // DEBUG
    console.debug('New iCalendar entry:')
    console.debug('filename:', filename)
    console.debug('extension:', extension)
    console.debug('subject:', subject)
    console.debug('location:', location)
    console.debug('begin:', (new Date(begin)).toString())
    console.debug('end:', (new Date(end)).toString())
    console.debug('description:', `${description.substring(0, 50)}…`)

    // Download .ics file
    icalEntry.download(filename, extension)
}


/**
 * On Button Click
 */
let onClickButton = () => {
    console.debug('onClickButton')

    // Lookup YouTube video Id
    const videoId = document.querySelector('ytd-watch-flexy').getAttribute('video-id')

    // Construct API URL for request
    const apiUrl = `${apiBaseUrl}${apiEndpoint}?${apiBaseQuery}&id=${videoId}`

    // DEBUG
    console.debug('videoId', videoId)
    console.debug('apiUrl', apiUrl)

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            console.debug('data', data)
            const json = data
            const snippet = json?.items[0].snippet
            const liveStreamingDetails = json?.items[0].liveStreamingDetails

            if (!snippet) {
                console.error('API Error', 'Video:', 'snippet not found.')
                return
            }

            if (!liveStreamingDetails) {
                console.error('API Error', 'Video:', 'liveStreamingDetails not found.')
                return
            }

            // Calculate start & end time
            const startTimestamp = liveStreamingDetails.actualStartTime || liveStreamingDetails.scheduledStartTime
            const startDate = new Date(startTimestamp)
            const defaultEndDate = new Date(startDate.setSeconds(startDate.getSeconds() + 1800))
            const defaultEndTimestamp = defaultEndDate.toISOString()
            const endTimestamp = liveStreamingDetails.actualEndTime || defaultEndTimestamp

            // Format metadata
            const subject = snippet.title.trim()
            const description = snippet.description.trim()
            const location = snippet.channelTitle.trim()
            const begin = startTimestamp
            const end = endTimestamp

            // Add custom metadata
            const url = `https://youtu.be/${videoId}`
            const urlAndDescription = `Link:\n${url}\n\n${description}`
            const filename = `${fileNameBase}${videoId}`

            // Create calendar event
            // createCalendarEvent(subject, description, location, begin, end, null, url, filename)
            createCalendarEvent(subject, urlAndDescription, location, begin, end, filename)
        })
}

/**
 * Render Button 'Add to Playlist'
 * @param {Element} element - Target Element
 */
let renderButton = (element) => {
    console.debug('renderButton')

    // Create button element
    const buttonElement = document.createElement('div')
    buttonElement.innerHTML =
    `
    <button class="ytp-offline-slate-button ytp-button">
        <div class="ytp-offline-slate-button-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/>
                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
        </div>
        <div class="ytp-offline-slate-button-text">Export to iCal Calendar (.ics)</div>
    </button>
    `

    // Add button element
    element.after(buttonElement)

    // Handle button click
    buttonElement.onclick = onClickButton

    // Status
    console.debug('rendered button')
}


/**
 * Init
 */
let init = () => {
    console.info('init')

    // Verify URL path
    if (!urlPathList.some(urlPath => window.location.pathname.startsWith(urlPath))) { return }

    // Wair for container
    onElementReady('.ytp-offline-slate-buttons', false, (element) => {
        // Render button
        renderButton(element)
    })
}


/**
 * Handle in-page navigation (modern YouTube)
 * @listens window:Event#yt-navigate-finish
 */
window.addEventListener('yt-navigate-finish', () => {
    console.debug('window#yt-navigate-finish')

    init()
})
