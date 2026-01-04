// ==UserScript==
// @name         twitter localize dates
// @namespace    http://tampermonkey.net/
// @version      2024.07.28
// @description  convert mentions of dates/times in tweet to local
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.45/moment-timezone-with-data-10-year-range.js
// @downloadURL https://update.greasyfork.org/scripts/492088/twitter%20localize%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/492088/twitter%20localize%20dates.meta.js
// ==/UserScript==


// https://www.ge.com/digital/documentation/workflow/r_wf_time_zone_abbreviations_for_date_and_time_functions.html
        const timeZoneMap = {
            ET: "America/New_York",
            EST: "America/New_York",
            EDT: "America/New_York",
            PT: "PST"
        }
/**
         * @param {string} str
         */
        function parseTime(str) {
            const timeStrMatch = str.match(/(?<time>[0-9][0-9]?(:[0-9][0-9])?)(?<offset>(a|p|A|P)(m|M))? +(?<timezone>[a-zA-Z]*)/)
            let timeStr = timeStrMatch?.groups?.time
            let timeZone = timeStrMatch?.groups?.timezone
            if(timeStr && timeZone) {
                const today = new Date().toISOString().split("T")[0]
                if(!timeStr.includes(":")) {
                    timeStr += ":00"
                }

                timeZone = timeZoneMap[timeZone.toUpperCase()] ?? timeZone

                const momentParsed=moment.tz(`${today} ${timeStr} ${timeStrMatch?.groups.offset ?? ''}`,"YYYY-MM-DD hh:mm A",timeZone)
                const dateMillis=+momentParsed
                return new Date(dateMillis)
            }

            return null
        }





        window.addEventListener("mousemove", e => {
            if(e.target instanceof HTMLElement) {
                const tweet = e.target.closest('[data-testid="cellInnerDiv"]')
                if(tweet && tweet instanceof HTMLElement) {
                    const text = tweet.querySelector('[data-testid="tweetText"]')?.textContent.trim();
                    if(text) {
                        const parseddate = parseTime(text)
                        if(parseddate && !isNaN(+parseddate)) {
                            tweet.title = parseddate.toLocaleTimeString(undefined,{hour12:false})
                        }
                    }
                }
            }
        })