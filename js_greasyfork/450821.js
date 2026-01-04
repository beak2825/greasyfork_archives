// ==UserScript==
// @name         百度搜索去除csdn
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  百度搜索时利用搜索规则去除csdn
// @author       bugmakerprime
// @grant        none
// @match        https://www.baidu.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC7klEQVQ4jW2TW2hcVRSGv7X3OTOZOClJJ0EbUkwngg21pQ8hoVIULyFivWAeFBQEQdAHxQcRfFOwQa0V66VgRHzxUYvWFiuJttgYWqXUEkSt6S2JnTZmUmOmc2bOOTl7+TAzCYL/y9qw17/Xv9h8EkWR+r7PmrReBVVFpHZeu5PVzjiOMQ2z1n1L/ygvvrzI7jcXAbg6n/DM8/PsH11afbQh3/dB6wojpyuJ6t5913TdTec0t/GcTp4I9O33FrU5N62dPRf0+4lAV1acxrFr2NQ0pqd8wRqYPh/R1mZJp4XLV2KKxYRcuwURZudirBU8by2xcc4honzxVYkDB68z/HAWcLSuswz0ZRjozxAEjp68Zfu2NKOfLHHqdIiI4pyrrTAxGeiGngua23hej4yV9NffqnppJlqNefpMRf9aiPW1N4rqt03rjrvmdKEYr61wZqqKEWjJCseOV+jdnOZ62fHCSwu8MlLklrxPR7vl2PEK+W6PwpWYs39EAHiqSn9fE+k0LF5z3Lkzw8xsxNBDBSpVxVr46VTIoc866e9r4p33/2bnjgy9m1M4dUiSJGqMcOLHKmGkbN2SYtdwgfwmH2OEyZMVolB5dDjLyKs5xr6rsH1biu6bfZwDcc6pc4q1htm5mMefusrMbMynH9/Iz1Mh+z9apuUGQ1BxDN7TzL49HXhWSBKHMYJRFaw1/H42YvCBAvff18wP33ax9bY0pWVl9N0Osllh7+vtXJqJ2TVcoFRyGGMAqX0jKB98uEQmA88928odQ3/y5aEyrW2GpiZhoeiIY+ja4DMxGTB+tIyI1lMYA0AlhOWScvFizJ7dHQzenSGsKk7hrZEctw80kTiH51lKpToTIshKomoNHD5S5smn5+nq8njkwWashW/GA3zfMHRvhiBQDhwsYwwc/ryTTd0+qiC6Sodj/GiVr8fKxBH05D16b00RhsrULyGXCwnr11ueeKyFLb0eUEsuDZxVQeS/uP6/FFVBpIbzv8rZjGdREMJeAAAAAElFTkSuQmCC



// @downloadURL https://update.greasyfork.org/scripts/450821/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4csdn.user.js
// @updateURL https://update.greasyfork.org/scripts/450821/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4csdn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const key_csdn = '-csdn'

    let searchInput, searchSubmit
    if (location.host.indexOf('baidu') != -1) {
        searchInput = document.getElementById('kw')
        searchSubmit = document.getElementById('su')
    }
    function bindEvent() {
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                append(searchInput)
            }
        }, true)
        searchInput.addEventListener('blur', () => {
            append(searchInput)
        }, true)
        searchInput.addEventListener('focus', () => {
            remove(searchInput)
        }, true)
        searchSubmit.addEventListener('click', () => {
            append(searchInput)
        }, true)
    }
    function append(textBox) {
        if (textBox.value.indexOf(key_csdn) == -1 && textBox.value != "") {
            textBox.value = textBox.value.trim().concat(" ", key_csdn)
        }
    }
    function remove(textBox) {
        if (textBox.value.indexOf(key_csdn) != -1) {
            textBox.value = textBox.value.replace(key_csdn, "").trim()
        }
    }
    bindEvent()
})();