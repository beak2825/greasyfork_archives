// ==UserScript==
// @name         BunPro: JLPT Percentage
// @namespace    http://tampermonkey.net/
// @version      0.2.12
// @description  Adds percentages to the progress bars.
// @author       Kumirei
// @match        https://bunpro.jp/*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974366
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368374/BunPro%3A%20JLPT%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/368374/BunPro%3A%20JLPT%20Percentage.meta.js
// ==/UserScript==

;(function ($, wfs) {
    $('head').append(
        '<style id="BunProPercentageScript">' +
            '    .profile-jlpt-level .progress .percentage {' +
            '        position: absolute; ' +
            '        left: 50%;' +
            '        line-height: 13px;' +
            '        font-size: 12px;' +
            '        margin-top: -1px;' +
            '        transform: translate(-50%,1px);' +
            '        text-shadow: 1px 0px black;' +
            '    }' +
            '</style>',
    )
    const percentNumberToString = (percentNumber) => {
        if (percentNumber === 0) {
            return '0%' // instead of "0.00%";
        } else if (percentNumber === 100) {
            return '100%'
        } else {
            return (percentNumber.toFixed(1) + '%').replace('.0%', '%')
        }
    }
    wfs.wait('.profile-jlpt-level .progress-bar', function (e) {
        var percentNumber = Number($(e).attr('aria-valuenow'))
        var percentString = percentNumberToString(percentNumber)

        const parentNode = $(e.parentNode)
        for (const child of parentNode[0].children) {
            if (child.classList.contains('percentage')) {
                return
            }
        }
        parentNode.append('<span class="percentage">' + percentString + '</span>')
    })

    wfs.wait('.profile-jlpt-level', function (e) {
        if (!$('.profile-jlpt-level.total').length) {
            var bar = $('.profile-jlpt-level')[0].cloneNode(true)
            bar.className += ' total'
            $(bar).find('.percentage').remove()
            bar.childNodes[1].innerText = 'Tot'
            var barelem = $(bar).find('.progress-bar')
            var total = 0
            var learned = 0
            $('[id$="jlpt_level_progress_bars"] .progress-count').each(function (i, e) {
                var counts = e.childNodes[0].textContent.split('/')
                total += Number(counts[1])
                learned += Number(counts[0])
            })
            var percentage = (learned / total) * 100
            barelem.attr('aria-valuenow', percentage)
            barelem.attr('style', 'width: ' + percentage + '%;')
            barelem.parent().append('<span class="percentage">' + percentNumberToString(percentage) + '</span>')
            $(bar).find('.progress-count')[0].innerText = String(learned) + '/' + String(total)
            var lastbar = $('.profile-jlpt-level')
            $(lastbar[lastbar.length - 1]).after(bar)
        }
    })
})(window.jQuery, window.wfs)
