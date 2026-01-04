// ==UserScript==
// @name     ResetEra: Display Posts Per Day
// @description Displays posts per day average
// @version  4
// @grant    none
// @match    *://*.resetera.com/members/*
// @match    *://*.resetera.com/threads/*
// @match    *://*.neogaf.com/members/*
// @match    *://*.neogaf.com/threads/*
// @grant    GM.log
// @namespace hateradio)))
// @downloadURL https://update.greasyfork.org/scripts/369805/ResetEra%3A%20Display%20Posts%20Per%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/369805/ResetEra%3A%20Display%20Posts%20Per%20Day.meta.js
// ==/UserScript==

(() => {
    'use strict'

    class Posts {

        constructor(selector) {
            this.selector = selector
            console.log(this.selector)
            let { joined, messages } = this.rawData
            console.log('Found date/messages:', joined, messages)

            this.messages = Posts.toInt(messages)
            this.joined = Posts.toDate(joined)

            console.log('Detected date:', this.joined.toString())
        }

        diff(initial, latest) {
            return Math.floor((latest - initial) / Posts.MILLS_PER_DAY)
        }

        template(title, body) {
            return `<dl class="pairs pairs--rows pairs--rows--centered re_headerStats--joined"><dt>${title}:</dt><dd>${body}</dd></dl>`
        }

        append() {
            const temp = this.template('Posts Per Day', this.average.toFixed(2))
            this.parents.forEach(p => p.insertAdjacentHTML('beforeend', temp))
        }

        get parents() {
            return [
                document.querySelector(this.selector),
                document.querySelector('.memberHeader-stats dl').parentElement
            ]
        }

        get rawData() {
            console.log(this.selector, this.parents)
            return Array.from(this.parents[0].querySelectorAll('dl'))
                .reduce((o, d) => {
                    const prop = d.querySelector('dt').textContent.trim().toLowerCase()
                    const content = d.querySelector('time') ? d.querySelector('time').dateTime : d.querySelector('dd').textContent.trim()
                    o[prop] = content
                    return o
                }, {})
        }

        get average() {
            const days = this.diff(this.joined, new Date())
            return this.messages / days
        }

        static toInt(str) {
            return +(str.replace(/\D/g, ''))
        }

        // Fixes date parsing for Safari
        static toDate(str) {
            str = str.split('')
            str.splice(-2, 0, ':')
            return new Date(str.join(''))
        }

        static main() {
            const path = document.location.pathname.substr(1).split('/')[0]

            if (path === 'threads') {
                ModalPosts.listener()
            } else {
                const p = new Posts('div.re_headerStats')
                p.append()
            }
        }

    }

    class ModalPosts extends Posts {

        constructor(id) {
            super(`.memberTooltip-stats dd a[href*="user_id=${id}"]`);
        }

        template(title, body) {
            return `<dl class="pairs pairs--rows pairs--rows--centered re_mainStat"><dt>${title}</dt><dd>${body}</dd></dl>`
        }

        get parents() {
            return [document.querySelector(this.selector).closest('div')]
        }

        static listener() {
            document.body.addEventListener('click', e => {
                let { target = null } = e
                if (e && target && target.tagName === 'IMG') {
                    target = target.parentElement
                }
                //console.log('target', target)
                const id = e && target && target.href && parseInt(target.href.split('.').pop(), 10)
                console.log('id', id)
                if (id && !ModalPosts.ID[id]) {
                    window.setTimeout(() => {
                        const p = new ModalPosts(id);
                        p.append()
                    }, 2000)
                    ModalPosts.ID[id] = true
                }
            }, false)
        }
    }

    // static inline constants aren't allowed in all browsers yet :(

    Posts.MILLS_PER_DAY = 24 * 60 * 60 * 1000

    ModalPosts.ID = {}

    // window.setInterval(Posts.main, 5000)
    Posts.main()


})()