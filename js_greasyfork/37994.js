// ==UserScript==
// @name         WaniKani Forums: Like counter
// @namespace    http://tampermonkey.net/
// @version      3.1.12
// @description  Keeps track of the likes you've used and how many you have left... supposedly.
// @author       Kumirei
// @include      https://community.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37994/WaniKani%20Forums%3A%20Like%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/37994/WaniKani%20Forums%3A%20Like%20counter.meta.js
// ==/UserScript==
;(function ($) {
    // SETTINGS
    const settings = {
        update_interval: 10, // Interval (minutes) for fetching summary page data and likes
        lifetime_purple: false, // Set to true for purple info bubbles
        hideReceived: false,
    }

    function getUsername() {
        return JSON.parse(JSON.parse(document.querySelector('#data-preloaded').dataset.preloaded).currentUser).username
    }

    // Global variable
    let LC = {
        stored: {
            zero: [],
            full: [],
            received: [],
            summary: {
                last_update: '1970-01-01T00:00:00.000Z',
                likes_given: 0,
                likes_received: 0,
                days_visited: 0,
                max: 400, // 400 is default for *regulars*
            },
            day: {
                given: [],
                received: 0,
            },
        },
        elems: {
            received: null,
            given: null,
            next: null,
        },
    }

    // Update LC
    Promise.all([update_stored(), update_summary()]).then(update)
    setInterval(update_all, settings.update_interval * 60 * 1000, LC)
    update_all()
    // Update the next like timer every second
    setInterval(update_next, 1000)
    // Install
    add_CSS()
    add_display()
    // Update every time a like is used
    $('body').on('click', '.post-stream .toggle-like', update)

    // Updates everything
    async function update(event) {
        // Update displayed count immediately
        if (event.type) {
            const old_count = Number(LC.elems.given.children().text())
            const new_count = old_count + ($(event.target).closest('.widget-button').hasClass('has-like') ? 1 : -1)
            LC.elems.given.children().text(new_count)
        }
    }

    // Fetches the data of LC.stored from localStorage
    function update_stored() {
        LC.stored = Object.assign(LC.stored, JSON.parse(localStorage.getItem('LCstored')) || {})
    }

    // Saves the LC.stored data to localStorage
    function save_stored() {
        localStorage.setItem('LCstored', JSON.stringify(LC.stored))
    }

    // Updates summary info and likes used/received
    async function update_all() {
        update_stored()
        const now = new Date(Date.now() - settings.update_interval * 60 * 1000).toISOString()
        if (LC.stored.summary.last_update < now) {
            //alert('Updating' + new Date().toISOString() + '\n\n' + LC.stored.summary.last_update)
            await update_summary()
            await update_day()
            save_stored()
            update_display()
        }
    }

    // Updates the LC variable with info from the summary page
    async function update_summary() {
        const username = getUsername()
        const f = await fetch(`https://community.wanikani.com/u/${username}/summary`, {
            headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'x-requested-with': 'XMLHttpRequest',
            },
        })
        if (f.status === 200) {
            const data = await f.json()
            const max = 100 * (1 + data.badges[0].id)
            const { likes_given, likes_received, days_visited } = data.user_summary
            LC.stored.summary = {
                likes_given,
                likes_received,
                days_visited,
                max,
                last_update: new Date().toISOString(),
            }
            const now = Date.now()
            LC.stored.received.push([now, likes_received])
            LC.stored.received = LC.stored.received.filter((a) => a[0] >= now - 24 * 60 * 60 * 1000)
        } else console.warn(`[LIKE COUNTER] Error ${f.status}: There was an error fetching user summary`)
    }

    // Updates the likes given and received in the last 24 hours
    async function update_day() {
        const msday = 24 * 60 * 60 * 1000
        const now = Date.now()
        const username = getUsername()
        const summary = LC.stored.summary
        const day = LC.stored.day
        day.given = (await fetch_likes(username, 1, 24)).reverse()
        //day.received = (await fetch_likes(username, 2, 24)).reverse()
        day.received = LC.stored.received[LC.stored.received.length - 1][1] - LC.stored.received[0][1] || 0
        if (day.given.length === summary.max && (LC.stored.zero[LC.stored.zero.length - 1] || 0) < now - msday) {
            LC.stored.zero.push(now)
        }
        if (day.given.length === 0 && (LC.stored.full[LC.stored.full.length - 1] || 0) < now - msday) {
            LC.stored.full.push(now)
        }
    }

    // Fetches likes from Discourse api
    async function fetch_likes(username, actionType, hoursBack) {
        const time = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString()
        let offset = 0
        let fetched = []
        let keep_fetching = true
        while (keep_fetching) {
            const f = await fetch(
                `https://community.wanikani.com/user_actions.json?offset=0&username=${username}&filter=${actionType}&offset=${offset}`,
            )
            if (f.status !== 200) {
                console.warn(`[LIKE COUNTER] Error ${f.status}: There was an error fetching user likes`)
                break
            }
            const actions = (await f.json()).user_actions
            for (let item of actions) {
                const date = item.created_at
                if (date >= time) {
                    fetched.push(Date.parse(item.created_at))
                } else {
                    keep_fetching = false
                    break
                }
            }
            offset += 30
        }
        return fetched
    }

    // Adds the bubbles to the header
    function add_display() {
        // START code by rfindley
        if (is_dark_theme()) $('body').attr('theme', 'dark')
        else $('body').attr('theme', 'light')
        // Wait for the nav
        const wk_app_nav = $('.wanikani-app-nav').closest('.container')
        if (wk_app_nav.length === 0) {
            setTimeout(add_display, 200)
            return
        }
        // Attach the Dashboard menu to the stay-on-top menu.
        const top_menu = $('.d-header')
        const main_content = $('#main-outlet')
        $('body').addClass('float_wkappnav')
        wk_app_nav.addClass('wanikani-app-nav-container')
        wk_app_nav.find('li').each((_, el) => {
            const $el = $(el)
            if (!$el.attr('data-name')) {
                $el.attr('data-name', 'original')
            }
        })
        top_menu.find('>.wrap > .contents:eq(0)').after(wk_app_nav)
        // Adjust the main content's top padding, so it won't be hidden under the new taller top menu.
        const main_content_toppad = Number(main_content.css('padding-top').match(/[0-9]*/)[0])
        main_content.css('padding-top', main_content_toppad + 25 + 'px')
        // END code by rfindley
        LC.elems = {
            // dashboard: $(
            //     '<li class="show-on-small-screen">' +
            //     '<a href="https://www.wanikani.com" target="_blank" rel="noopener noreferrer">WaniKani</a>' +
            //     '</li>',
            // ),
            received: $(
                '<li data-highlight="true" data-name="likes-received"' +
                    (settings.hideReceived ? ' style="display:none"' : '') +
                    '>Likes Received<span id="likes_received" class="dashboard_bubble">0</span></li>',
            ),
            given: $(
                '<li data-highlight="true" data-name="likes-left">Likes Left<span id="likes_given" class="dashboard_bubble">0</span></li>',
            ),
            next: $(
                '<li data-highlight="true" data-name="likes-next">Next Like<span id="next_like" class="dashboard_bubble">0</span></li>',
            ),
        }
        $('.wanikani-app-nav ul').append([LC.elems.received, LC.elems.given, LC.elems.next])
        update_display()
    }

    // Updates the counts and the hover info
    function update_display() {
        const msday = 24 * 60 * 60 * 1000
        const msh = msday / 24
        const now = Date.now()
        const { received, given, next } = LC.elems
        const summary = LC.stored.summary
        const day = LC.stored.day
        // Update counts
        received.children().text(day.received)
        given.children().text(summary.max - day.given.length)
        next.children().text(time_left(day.given[0] + msday))
        day.given.length < summary.max ? $('body').removeClass('no-likes') : $('body').addClass('no-likes')
        // Update hover info
        received.attr(
            'title',
            `${day.received.toLocaleString()} likes received in past 24h` +
                `\n${Math.round(
                    summary.likes_received / summary.days_visited,
                ).toLocaleString()} likes received per day visited` +
                `\n${summary.likes_received.toLocaleString()} total likes received`,
        )
        given.attr(
            'title',
            `${day.given.length.toLocaleString()} likes given in past 24h` +
                `\n${Math.round(
                    summary.likes_given / summary.days_visited,
                ).toLocaleString()} likes given per day visited` +
                `\n${summary.likes_given.toLocaleString()} total likes given` +
                `\n\n${LC.stored.zero.length.toLocaleString()} times have you ran out` +
                `\n${comma(
                    Math.floor((now - (LC.stored.zero[LC.stored.zero.length - 1] || now)) / msday),
                )} days since you last ran out` +
                `\n\n${LC.stored.full.length.toLocaleString()} times have you had full likes` +
                `\n${comma(
                    Math.floor((now - (LC.stored.full[LC.stored.full.length - 1] || now)) / msday),
                )} days since you last had full likes`,
        )
        let hours = Array(24)
            .fill(0)
            .map(
                (_, i) =>
                    day.given.filter((like) => like + msday > now + i * msh && like + msday < now + (i + 1) * msh)
                        .length,
            )
        const next_like = new Date(day.given[0] + msday)
        next.attr(
            'title',
            `Next like at ${next_like.getHours()}:${
                (next_like.getMinutes() < 10 ? '0' : '') + next_like.getMinutes()
            }` + `\n\nLikes replenishing in ${hours.reduce((a, c, i) => (c == 0 ? a : `${a}\n${i + 1}h: ${c}`), ``)}`,
        )
    }

    function comma(n) {
        return n.toLocaleString('en-US')
    }

    // Update the timer for the next like
    function update_next() {
        const msday = 24 * 60 * 60 * 1000
        const yesterday = Date.now() - msday
        const day = LC.stored.day
        const given = day.given.length
        day.given = day.given.filter((t) => t > yesterday)
        // If likes have been used or expired update whole display
        if (given !== day.given.length) update_display()
        // Else just update the timer
        else LC.elems.next.children().text(time_left(day.given[0] + msday))
    }

    // Adds the CSS
    function add_CSS() {
        let bubble_color = settings.lifetime_purple ? 'rgb(213, 128, 255)' : '#6cf'
        $('head')
            .append(
                '    <style id=like_counter>' +
                    '    body[theme="dark"] .wanikani-app-nav ul li {color:#999;}' +
                    '    li[data-highlight="true"] span.dashboard_bubble {background-color: ' +
                    bubble_color +
                    ' !important;}' +
                    '    bbody.no-likes .like > .fa.d-icon-d-unliked {color: red !important}' +
                    '    .wanikani-app-nav > ul {display: flex;}' +
                    '    .wanikani-app-nav li[data-name="likes-received"] {order: 1;}' +
                    '    .wanikani-app-nav li[data-name="likes-left"] {order: 2;}' +
                    '    .wanikani-app-nav li[data-name="likes-next"] {order: 3;}' +
                    '    .wanikani-app-nav li[data-name="lesson_count"],' +
                    '    .wanikani-app-nav li[data-name="review_count"],' +
                    '    .wanikani-app-nav li[data-name="next_review"] {order: 0;}' +
                    '    .float_wkappnav .d-header {padding-bottom: 2em;}' +
                    '    .float_wkappnav .d-header {height: 4em !important;}' +
                    '    .float_wkappnav .d-header .title {height:4em;}' +
                    '    .float_wkappnav .wanikani-app-nav-container {border-top:1px solid #ccc; line-height:2em;}' +
                    '    .float_wkappnav .wanikani-app-nav ul {padding-bottom:0; margin-bottom:0; border-bottom:inherit;}' +
                    '    .dashboard_bubble {color:#fff; background-color:#bdbdbd; font-size:0.8em; border-radius:0.5em; padding:0 6px; margin:0 0 0 4px; font-weight:bold;}' +
                    '    li[data-highlight="true"] .dashboard_bubble {background-color:#6cf;}' +
                    '    body[theme="dark"] .dashboard_bubble {background-color:#646464;}' +
                    '    body[theme="dark"] li[data-highlight="true"] .dashboard_bubble {color:#000; background-color:#6cf;}' +
                    '    body[theme="dark"] .wanikani-app-nav[data-highlight-labels="true"] li[data-highlight="true"] a {color:#6cf;}' +
                    '    body[theme="dark"] .wanikani-app-nav ul li a {color:#999;}' +
                    '</style>',
            )
            .append(
                '<style id="responsive-wanikani-app-nav-list-header">' +
                    '.wanikani-app-nav .show-on-small-screen {display: none;}' +
                    '@media screen and (max-width: 799px) {' +
                    '    .wanikani-app-nav {margin-top: 0; float: right;}' +
                    '    .wanikani-app-nav .hide-on-small-screen,' +
                    '    .wanikani-app-nav li[data-name="original"] {display: none !important;}' +
                    '    .wanikani-app-nav .show-on-small-screen {display: block !important;}' +
                    '}' +
                    '</style>',
            )
    }

    // Returns a string with the time remaining until the given date
    function time_left(date) {
        if (!date) return 'N/A'
        const seconds = (date - Date.now()) / 1000
        const s = Math.floor((seconds % 3600) % 60)
        const sr = Math.round((seconds % 3600) % 60)
        const m = Math.floor(((seconds - s) / 60) % 60)
        const mr = Math.round(((seconds - s) / 60) % 60)
        const h = Math.floor((seconds - s - m * 60) / 3600)
        const hr = Math.round((seconds - s - m * 60) / 3600)
        if (h != 0) return hr + 'h'
        if (m != 0) return mr + 'm'
        if (s != 0) return sr + 's'
    }

    // Checks whether a dark theme is used
    function is_dark_theme() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return (
            $('html')
                .css('background-color')
                .match(/\((.*)\)/)[1]
                .split(',')
                .slice(0, 3)
                .map((str) => Number(str))
                .reduce((a, i) => a + i) /
                (255 * 3) <
            0.5
        )
    }
})(window.jQuery)
