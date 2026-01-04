// ==UserScript==
// @name         Wanikani: Review Cache
// @version      1.2.10
// @description  Manages a cache of all the user's reviews
// @author       Kumirei
// @include      *wanikani.com*
// @grant       none
// ==/UserScript==

;(function (wkof) {
    // Manually increment to initiate reload for all users
    const cache_version = 1

    // Script version. Starts with q to make it larger than numerical versions
    const version = 'q1.2.10'

    // Update interval for subscriptions
    const update_interval = 10 // minutes

    // Reveal functions to window
    if (!window.review_cache?.version || window.review_cache.version < version) {
        const _subscribers = window.review_cache?._subscribers ? window.review_cache?._subscribers : new Set()
        const _fetching = window.review_cache?._fetching ? window.review_cache?._fetching : null
        if (window.review_cache?._reviewListener)
            window.removeEventListener('didCompleteSubject', window.review_cache?._reviewListener)
        window.review_cache = {
            get_reviews,
            reload,
            subscribe,
            unsubscribe,
            insert,
            silent: true, // Hide popup_delay messages in the console
            version: version,
            _subscribers,
            _fetching,
            _reviewListener: null,
        }
    }

    // Listens for completed reviews. Temporary solution while the reviews API is not available
    const item_srs = {}

    wkof.include('ItemData')
    wkof.ready('ItemData').then(async () => {
        const items = await wkof.ItemData.get_items('assignments')
        for (let item of items) item_srs[item.id] = item.assignments?.srs_stage
    })

    set_update_interval()
    set_review_listener()

    function set_review_listener() {
        const callback = async (event) => {
            if (window.location.pathname !== '/subjects/review') return // Only count reviews, not lessons or extra study
            await wkof.ready('ItemData')
            const { stats, subject } = event.detail.subjectWithStats
            window.review_cache.insert([
                [Date.now(), subject.id, item_srs[subject.id], stats.meaning.incorrect, stats.reading.incorrect],
            ])
        }
        window.addEventListener('didCompleteSubject', callback)
        window.review_cache._reviewListener = callback
    }

    // Add a subscriber
    async function subscribe(subscriber) {
        window.review_cache._subscribers.add(subscriber)
        const cached = await load_data()
        subscriber?.(cached.reviews)
        const reviews = await get_reviews()
        if (cached.reviews.length !== reviews.length) subscriber?.(reviews)
    }

    // Remove a subscriber
    function unsubscribe(subscriber) {
        return window.review_cache._subscribers.delete(subscriber)
    }

    // Automatically update every 10 minutes
    function set_update_interval() {
        get_reviews(false)
        setInterval(() => {
            if (window.review_cache._subscribers.size) get_reviews(true)
        }, update_interval * 60_000)
    }

    // Fetch reviews from storage
    async function get_reviews(disable_popup = false) {
        wkof.include('Apiv2')
        if (!window.review_cache._fetching) {
            window.review_cache._fetching = wkof
                .ready('Apiv2')
                .then(load_data)
                .then((data) => update_data_after_session(data, disable_popup))
        }
        const data = await window.review_cache._fetching
        if (data.changed) {
            for (let subscriber of window.review_cache._subscribers) subscriber?.(data.reviews)
        }
        window.review_cache._fetching = null
        return data.reviews
    }

    // Deletes cache and re-fetches reviews
    function reload() {
        return wkof.file_cache.delete('review_cache').then(get_reviews)
    }

    async function insert(reviews) {
        const cached = await load_data()
        const newestDate = reviews.reduce((max, cur) => Math.max(cur[0], max), 0)
        const updated = {
            cache_version,
            date: new Date(newestDate).toISOString(),
            reviews: cached.reviews.concat(reviews).sort((a, b) => a[0] - b[0]),
        }
        for (let subscriber of window.review_cache._subscribers) subscriber?.(updated.reviews)
        await save(updated)
    }

    // Loads data from cache
    function load_data() {
        return wkof.file_cache.load('review_cache').then(decompress, (_) => {
            return { cache_version, date: '1970-01-01T00:00:00.000Z', reviews: [] }
        })
    }

    // Save cache
    function save(data) {
        return wkof.file_cache.save('review_cache', compress(data)).then((_) => data)
    }

    // Compress and decompress the dates for better use of storage space.
    // Dates are stored as time elapsed between items, but are returned as absolute dates
    function compress(data) {
        return press(true, data)
    }
    function decompress(data) {
        return press(false, data)
    }
    function press(com, data) {
        let last = 0
        let pressed = data.reviews.map((item) => {
            let map = [com ? item[0] - last : last + item[0], ...item.slice(1)]
            last = com ? item[0] : last + item[0]
            return map
        })
        return { cache_version: data.cache_version, date: data.date, reviews: pressed }
    }

    async function update_data_after_session(data, disable_popup = false) {
        let [date, new_reviews] = await fetch_new_reviews(data.date, disable_popup)
        if (new_reviews.length) {
            for (let new_review of new_reviews) data.reviews.push(new_review)
            data.reviews.sort((a, b) => (a[0] < b[0] ? -1 : 1))
            data.date = date
            save(data)
        }
        return { reviews: data.reviews, changed: !!new_reviews.length }
    }

    // Fetches any new reviews from the API
    async function fetch_new_reviews(last_fetch, disable_popup = false) {
        if (disable_popup) wkof.Progress.popup_delay(-1, window.review_cache.silent === true)
        let updated_reviews = await wkof.Apiv2.fetch_endpoint('reviews', {
            filters: { updated_after: last_fetch },
            disable_progress_dialog: true,
        }).catch(fetch_error)
        if (disable_popup) wkof.Progress.popup_delay('default', window.review_cache.silent === true)
        if (updated_reviews.error) return [null, []] // no new reviews
        let new_reviews = updated_reviews.data.filter((item) => last_fetch < item.data.created_at)
        new_reviews = new_reviews.map((item) => [
            Date.parse(item.data.created_at),
            item.data.subject_id,
            item.data.starting_srs_stage,
            item.data.incorrect_meaning_answers,
            item.data.incorrect_reading_answers,
        ])
        return [updated_reviews.data_updated_at, new_reviews]
    }

    function fetch_error(error) {
        if (error.status !== 304) // skip logging for 304 Not Modified
            console.warn('Review Cache: Error fetching reviews', error)
        return { error }
    }
})(window.wkof)
