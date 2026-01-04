// ==UserScript==
// @name         Wanikani: Review Answer Streak
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  Counts the number of times you have get review questions right in a row
// @author       Kumirei
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/489759-wk-custom-icons/code/CustomIcons.js?version=1350892
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413983/Wanikani%3A%20Review%20Answer%20Streak.user.js
// @updateURL https://update.greasyfork.org/scripts/413983/Wanikani%3A%20Review%20Answer%20Streak.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

;(function (Icons) {
    Icons.addCustomIcons([
        [
            'trophy',
            'M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z',
            576,
        ],
    ])

    let body = document.body
    let page
    let streak

    get_page()

    // Listen for page changes
    document.addEventListener(`turbo:before-render`, (e) => {
        body = e.detail.newBody
        get_page()
        install_streak_count()
    })

    function update_display(streak, max) {
        const elem = body.querySelector('#streak .count')
        if (elem) elem.innerHTML = `${streak} (${max})`
    }

    // The object that keeps track of the current (and previous!) streak
    streak = {
        current: {},
        prev: {},
        save: () =>
            localStorage.setItem(
                `${page}_streak`,
                JSON.stringify({ streak: streak.current.streak, max: streak.current.max }),
            ),
        load: () => {
            const data = {
                questions: 0,
                incorrect: 0,
                ...JSON.parse(localStorage.getItem(`${page}_streak`) ?? '{"streak": 0, "max": 0}'),
            }
            streak.current = data
            streak.prev = data
        },
        undo: () => {
            streak.current = streak.prev
        },
        correct: (questions, incorrect) => {
            streak.prev = streak.current
            streak.current = {
                questions,
                incorrect,
                streak: streak.current.streak + 1,
                max: Math.max(streak.current.streak + 1, streak.current.max),
            }
        },
        incorrect: (questions, incorrect) => {
            streak.prev = streak.current
            streak.current = { questions, incorrect, streak: 0, max: streak.current.max }
        },
    }
    streak.load()
    update_display(streak.current.streak, streak.current.max)

    window.addEventListener('didAnswerQuestion', (e) => {
        if (e.constructor.name !== 'DidAnswerQuestionEvent') return // Only count real WK events
        let correct = 0
        let incorrect = 0
        for (let item of Object.values(e.detail.subjectWithStats.stats)) {
            correct += item.complete ? 1 : 0
            incorrect += item.incorrect
        }
        if (e.detail.results.action === 'pass') streak.correct(correct + incorrect, incorrect)
        else streak.incorrect(correct + incorrect, incorrect)
        streak.save()
        update_display(streak.current.streak, streak.current.max)
    })

    install_streak_count()

    function get_page() {
        const path = window.location.pathname
        if (/^\/(DASHBOARD)?$/i.test(path)) page = 'dashboard'
        else if (/REVIEW(\/session)?/i.test(path)) page = 'reviews'
        else if (/LESSON(\/session)?/i.test(path)) page = 'lessons'
        else if (/EXTRA_STUDY(\/session)?/i.test(path)) page = 'extra_study'
        else page = 'other'
    }

    function install_streak_count() {
        get_page()
        streak.load()
        // Create and insert element into page
        const elem = `
                <div id="streak" class="quiz-statistics__item"><div class="quiz-statistics__item-count">
                    <div class="quiz-statistics__item-count-icon">${Icons.customIconTxt('trophy')}</div>
                    <div class="count quiz-statistics__item-count-text" style="white-space: nowrap;">${
                        streak?.current?.streak || 0
                    } (${streak?.current?.max || 0})</div>
                </div></div>
                `
        body.querySelector('.quiz-statistics')?.insertAdjacentHTML('afterbegin', elem)
    }
})(window.Icons)
