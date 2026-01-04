// ==UserScript==
// @name         Set Kucoin Trading View Time Period
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change all trading view time periods with hotkeys!
// @author       You
// @match        https://www.kucoin.com/trade/*
// @exclude      https://www.kucoin.com/trade/charting_library*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kucoin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471488/Set%20Kucoin%20Trading%20View%20Time%20Period.user.js
// @updateURL https://update.greasyfork.org/scripts/471488/Set%20Kucoin%20Trading%20View%20Time%20Period.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const cl = window.console.debug
    const keyToPeriod = {
        'Digit1': '1 minute', //
        'Digit2': '3 minutes',
        'Digit3': '5 minutes',
        'Digit4': '15 minutes',
        'Digit5': '1 hour',
        'Digit6': '1 day',
    }

    document.addEventListener("keydown", e => {
        if (e.shiftKey && e.code in keyToPeriod) {
            setTradingViewTimeTickDuration(keyToPeriod[e.code])
        }
    })

    async function setTradingViewTimeTickDuration (timePeriod) {
        const $tvContainers = [...document.querySelectorAll('[class^=mulKlineItem]')]
        for (const $el of $tvContainers) {
            const $timePickerBtn = $el.querySelector('div[style*="text-align: right"]')
            $timePickerBtn.click()
            await sleep(0)

            const $popper = document.querySelector('[data-popper-placement="bottom-start"]')
            const $scroller = $popper.querySelector('div[style*="overflow: auto"]')

            // Virtual scrolling hides buttons near the top/bottom, need to manually scroll to reveal and click them.
            const scrollTo = timePeriod === '1 day' ? $scroller.offsetHeight : 0
            $scroller.scrollTop = scrollTo
            await sleep(0)

            const $timePeriodBtns = [...$popper.querySelectorAll('div[style="text-align: left; padding-right: 0px;"]')]
            for (const $btn of $timePeriodBtns) {
                if ($btn.innerText === timePeriod) {
                    $btn.click()
                    break
                }
            }
        }
    }

    function sleep(t, v) {
        return new Promise(resolve => setTimeout(resolve, t, v));
    }

})();