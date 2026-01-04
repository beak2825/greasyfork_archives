// ==UserScript==
// @name         Wanikani Forum: Regular Tracker
// @namespace    http://tampermonkey.net/
// @version      1.1.10
// @description  Tracks how regular you are
// @author       Kumirei
// @include      *community.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400071/Wanikani%20Forum%3A%20Regular%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/400071/Wanikani%20Forum%3A%20Regular%20Tracker.meta.js
// ==/UserScript==

;(function () {
    // Settings object. Configure your settings here
    let settings = {
        update_interval: 10, // Minutes between fetches of the summary page data
    }

    // Global tracker object. Keeps track of your efforts of meeting the regularity criteria in the last 100 days
    let tracker = {
        last_fetch: 0, // Timestamp of when summary and category data was last fetched
        history: [], // Contains all fetches of the summary and category data going back 100 days
        streak: [0, 0], // Last date visited and the current streak
        visited: [], // List of visited dates [date1, date2, ...]
        unique_topics: 0, // Not interested in going through the trouble of tracking this right now
        flags_received: 0, // No way to detect this as far as I am aware
        suspended: false, // No way to detect this as far as I am aware
        regular: false, // Boolean indicating whether you have regular status
    }

    const msday = 1000 * 60 * 60 * 24 // Number of ms in a day
    init()

    // First run setup
    function init() {
        add_display()
        add_css()
        fetch_data()
        setInterval(fetch_data, (1000 * 60 * settings.update_interval) / 10)
    }

    // Fetches the needed data
    function fetch_data() {
        update_tracker()
        if (tracker.last_fetch < Date.now() - 1000 * 60 * settings.update_interval) {
            tracker.last_fetch = Date.now()
            save()
            let username = JSON.parse(
                JSON.parse(document.querySelector('#data-preloaded').dataset.preloaded).currentUser,
            ).username
            let summary_url = 'https://community.wanikani.com/u/' + username + '/summary'
            let stats_url = 'https://community.wanikani.com/about'
            Promise.all([fetchUrl(summary_url), fetchUrl(stats_url)]).then(process_data)
        }
    }

    async function fetchUrl(url) {
        const data = await fetch(url, {
            headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'x-requested-with': 'XMLHttpRequest',
            },
        })
        const json = await data.json()
        return json
    }

    // Updates the global variable with the new data
    function process_data(data) {
        let [summary_data, about] = data
        let s = summary_data.user_summary
        let stats = about.about.stats
        let history = tracker.history
        if (history.length > 1 && history[history.length - 2].date > Date.now() - 60 * 60 * 1000) history.pop() // Limit to hourly updates
        tracker.history.push({
            date: Date.now(),
            likes_given: s.likes_given,
            likes_received: s.likes_received,
            topics_viewed: s.topics_entered,
            posts_read: s.posts_read_count,
            days_visited: s.days_visited,
            total_topics: stats.topics_count,
            total_posts: stats.posts_count,
            topics_30d: stats.topics_30_days,
            posts_30d: stats.posts_30_days,
        })
        tracker.regular = summary_data.badges[0].id == 3 // Regular has badge ID 3
        const get_date = (date) => new Date(date).toISOString().slice(0, 10)
        tracker.visited.push(get_date(Date.now())) // Append today's date
        tracker.visited.sort()
        tracker.visited = tracker.visited.filter((d, i) => {
            // filter out old visits
            if (!tracker.visited[i + 1]) return true // Keep last
            const date = new Date(d) // Get next day
            date.setDate(date.getDate() + 1)
            return get_date(date.getTime()) == get_date(tracker.visited[i + 1])
        })
        tracker.streak = [null, tracker.visited.length]
        save()
        update_display()
    }

    // Update the tracker variable
    function update_tracker() {
        var stored = JSON.parse(localStorage.getItem('WKFRT'))
        if (stored) {
            for (let key in stored) tracker[key] = stored[key]
        }
    }

    // Stores the data in localStorage so other tabs can access it
    function save() {
        localStorage.setItem('WKFRT', JSON.stringify(tracker))
    }

    // Adds the bubbles to the header
    function add_display() {
        // START code by rfindley
        if (is_dark_theme()) {
            document.body.setAttribute('theme', 'dark')
        } else {
            document.body.setAttribute('theme', 'light')
        }
        var wk_app_nav = document.querySelector('.wanikani-app-nav').closest('.container')
        if (!wk_app_nav) {
            setTimeout(add_display, 200)
            return
        }
        // Attach the Dashboard menu to the stay-on-top menu.
        var top_menu = document.querySelector('.d-header .wrap')
        var main_content = document.querySelector('#main-outlet')
        document.body.classList.add('float_wkappnav')
        wk_app_nav.classList.add('wanikani-app-nav-container')
        top_menu.insertAdjacentElement('beforeend', wk_app_nav)
        // Adjust the main content's top padding, so it won't be hidden under the new taller top menu.
        var main_content_toppad = Number(getComputedStyle(main_content).paddingTop.match(/[0-9]*/)[0])
        main_content.setAttribute('padding-top', main_content_toppad + 25 + 'px')
        // Insert CSS.
        var css =
            '.float_wkappnav .d-header {padding-bottom: 2em;}' +
            '.float_wkappnav .d-header {height: 4em !important;}' +
            '.float_wkappnav .d-header .title {height:4em;}' +
            '.float_wkappnav .wanikani-app-nav-container {border-top:1px solid #ccc; line-height:2em;}' +
            '.float_wkappnav .wanikani-app-nav ul {padding-bottom:0; margin-bottom:0; border-bottom:inherit;}' +
            '.dashboard_bubble {color:#fff; background-color:#bdbdbd; font-size:0.8em; border-radius:0.5em; padding:0 6px; margin:0 0 0 4px; font-weight:bold;}' +
            'li[data-highlight="true"] .dashboard_bubble {background-color:#6cf;}' +
            'body[theme="dark"] .dashboard_bubble {color:#ddd; background-color:#646464;}' +
            'body[theme="dark"] li[data-highlight="true"] .dashboard_bubble {color:#000; background-color:#6cf;}' +
            'body[theme="dark"] .wanikani-app-nav[data-highlight-labels="true"] li[data-highlight="true"] a {color:#6cf;}' +
            'body[theme="dark"] .wanikani-app-nav ul li a {color:#999;}'
        document.head.insertAdjacentHTML('beforeend', '<style type="text/css">' + css + '</style>')
        // END code by rfindley
        if (!document.querySelector('#regular_status')) {
            document
                .querySelector('.wanikani-app-nav ul')
                .insertAdjacentHTML(
                    'beforeend',
                    '<li id="regular_status" data-highlight="false">Regular Status:<span class="dashboard_bubble">0%</span></li>',
                )
            update_display()
        }
    }

    // Function made by rfindley
    function is_dark_theme() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return (
            getComputedStyle(document.querySelector('html'))
                .backgroundColor.match(/\((.*)\)/)[1]
                .split(',')
                .slice(0, 3)
                .map((str) => Number(str))
                .reduce((a, i) => a + i) /
                (255 * 3) <
            0.5
        )
    }

    // Updates the display with the current numbers
    function update_display() {
        fetch_data()
        update_tracker()
        prune_history()
        save()
        let elem = document.querySelector('#regular_status')

        if (tracker.history.length != 0 && elem) {
            let days_visited = last100('days_visited') + 1
            let likes_given = last100('likes_given')
            let likes_received = last100('likes_received')
            let topics_viewed = last100('topics_viewed')
            let days_tracked = Math.floor((Date.now() - tracker.history[0].date) / msday)
            let topics_goal = Math.round(last100('total_topics') * 0.25)
            let posts_read = last100('posts_read')
            let post_goal = Math.round(last100('total_posts') * 0.25)
            if (days_tracked < 100) {
                topics_goal = Math.round((topics_goal / days_tracked) * 100) || 0
                post_goal = Math.round((post_goal / days_tracked) * 100) || 0
                if (days_tracked < 30) {
                    topics_goal = Math.round((tracker.history.at(-1).topics_30d / 0.3) * 0.25)
                    post_goal = Math.round((tracker.history.at(-1).posts_30d / 0.3) * 0.25)
                }
            }
            if (topics_goal > 500) topics_goal = 500
            if (post_goal > 20000) post_goal = 20000
            let total_days_visited = tracker.history.at(-1).days_visited
            let visit_streak = tracker.streak[1]
            let title = `
In the last 100 days
–––––––––––––––––––––––––––––
Days Visited:            ${days_visited} / 50 (${Math.round((100 * days_visited) / 50)}%)
Posts Read:                ${posts_read.toLocaleString()} / ${post_goal.toLocaleString()} (${Math.round(
                (100 * posts_read) / post_goal,
            )}%)
Topics Viewed:         ${topics_viewed.toLocaleString()} / ${topics_goal} (${Math.round(
                (100 * topics_viewed) / topics_goal,
            )}%)
Likes Given:              ${likes_given.toLocaleString()} / 30
Likes Received:        ${likes_received.toLocaleString()} / 20
–––––––––––––––––––––––––––––
Topics Posted In:      ??? / 10
Flags Not Received: ??? / 5
Not Suspended:       ???
–––––––––––––––––––––––––––––
Visit Streak:               ${visit_streak}`
            elem.title = title

            let goals = [
                days_visited / 50,
                likes_given / 30,
                likes_received / 20,
                topics_viewed / topics_goal,
                posts_read / post_goal,
            ].reduce((a, b) => {
                return b < a ? b : a
            })
            elem.children[0].innerText = Math.floor(goals * 100) + '%'
            elem.setAttribute('data-highlight', tracker.regular)
        }
    }

    // Deletes any data older than 24 hours
    function prune_history() {
        tracker.history = tracker.history.filter((item) => item.date >= Date.now() - msday * 100)
    }

    // Add CSS which makes space in the header
    function add_css() {
        document.head.insertAdjacentHTML(
            'beforeend',
            `
<style id="WKFRTCSS">
.wanikani-app-nav .wanikani-app-nav-list-header {display: none;}
.wanikani-app-nav > ul {display: flex;}
.wanikani-app-nav #regular_status {order: 4;}
.wanikani-app-nav > ul > li:last-child {margin-right: 1em;}
</style>`,
        )
    }

    function last100(key) {
        const withKey = tracker.history.filter((stats) => key in stats)
        return dict_key_diff(withKey.at(-1), withKey[0], key)
    }

    // Returns the difference between entries in two dicts
    function dict_key_diff(d1, d2, key) {
        return d1[key] - d2[key]
    }

    // Waits until a certain element is created then passes it to the callback function
    async function wait_for_selector(selector, callback, interval = 1000, max_wait = 0, count = 0) {
        let wait_id = Math.random().toString().slice(2)
        let waited = 0
        let found = 0
        let result
        let result_handler = function (e) {
            if (found == count && count != 0) return
            found++
            e.setAttribute('wait_id_' + wait_id, '')
            callback(e)
        }
        while ((waited < max_wait || max_wait == 0) && (found < count || count == 0)) {
            result = document.querySelectorAll(selector + ':not([wait_id_' + wait_id + '])')
            result.forEach(result_handler)
            await sleep(interval)
        }
    }

    // Waits for a specified number of ms before returning
    function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms))
    }
})()
